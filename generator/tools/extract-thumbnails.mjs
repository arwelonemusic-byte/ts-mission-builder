// Extract GM editor-preview thumbnails (.edds -> .png) for outside use.
//
// The Game Master browser images are BAKED at data-build time and shipped in
// every pak under UI/Textures/EditorPreviews/ (vanilla: 1810 files, 400x300
// BC7_UNORM_SRGB; RHS ships its own set; British Forces ships none). Format =
// the ENF1 layout documented in CLAUDE.md "Mission thumbnails": standard DDS
// header + ASCII ENF1 at 0x24 + DX10 header + Enfusion mip table at 0x94
// (8 bytes per mip: tag COPY/"LZ4 " + stored size, SMALLEST mip first),
// payloads concatenated in table order.
//
// Pipeline per file: parse table -> take the LARGEST mip (last entry) ->
// LZ4-decompress if tagged -> rewrap as a standard single-mip .dds ->
// DirectXTex texconv -> .png.
//
// Usage:
//   node generator/tools/extract-thumbnails.mjs --out <dir> <input>...
//
// <input> forms:
//   - prefab resource path, with or without {GUID}:
//       "{5B8922E61D8DF345}Prefabs/Props/Military/Antennas/Antenna_R161_01.et"
//       "Prefabs/Vehicles/Wheeled/BRDM2/BRDM2.et"
//       "PrefabsEditable/Auto/Props/Industrial/GasTank_01_blue.et"
//     Mapping: Prefabs/<sub>/Name.et            -> EditorPreviews/<sub>/Name.edds
//              PrefabsEditable/Auto/<sub>/E_.et -> EditorPreviews/Auto/<sub>/E_.edds
//     Falls back to a recursive basename search across all preview roots.
//   - a path ending in .edds (absolute, or relative to any EditorPreviews root)
//
// Preview roots = every <reference>/<Addon>/UI/Textures/EditorPreviews dir
// (vanilla ReforgerData first, then extracted mod dumps like RHS Status Quo).

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";

const REFERENCE_ROOT = String.raw`D:\VSCode_dev\arma-reforger\reference`;
const TEXCONV = process.env.TEXCONV ?? String.raw`D:\VSCode_dev\arma-reforger\texconv.exe`;

// ---------------------------------------------------------------------------
// ENF1 .edds parsing

/** LZ4 block decode into dst starting at position d. Matches may reference
 * bytes BEFORE d (previous blocks share the window — Enfusion's chunked
 * streams are block-DEPENDENT). Returns the new write position. */
function lz4DecodeInto(src, dst, d) {
  let s = 0;
  while (s < src.length) {
    const token = src[s++];
    let litLen = token >> 4;
    if (litLen === 15) {
      let b;
      do {
        b = src[s++];
        litLen += b;
      } while (b === 255);
    }
    src.copy(dst, d, s, s + litLen);
    s += litLen;
    d += litLen;
    if (s >= src.length) break; // block ends with literals
    const offset = src[s] | (src[s + 1] << 8);
    s += 2;
    let matchLen = (token & 15) + 4;
    if ((token & 15) === 15) {
      let b;
      do {
        b = src[s++];
        matchLen += b;
      } while (b === 255);
    }
    let m = d - offset;
    for (let i = 0; i < matchLen; i++) dst[d++] = dst[m++];
  }
  return d;
}

/**
 * Enfusion "LZ4 " mip payload framing (reverse-engineered from BRDM2.edds):
 * [u32 totalDecompressedSize] then per block: [u32 word][compressed bytes],
 * where compSize = word & 0x7fffffff (the MSB marks the final block) and each
 * block independently decompresses to 64 KiB (last block = remainder).
 */
function enfLz4Decode(payload, expected) {
  const total = payload.readUInt32LE(0);
  if (total !== expected)
    throw new Error(`LZ4 total ${total} != expected mip size ${expected}`);
  const dst = Buffer.alloc(total);
  let off = 4;
  let d = 0;
  while (d < total) {
    const word = payload.readUInt32LE(off);
    off += 4;
    const compSize = word & 0x7fffffff;
    const blockDecomp = Math.min(65536, total - d);
    const block = payload.subarray(off, off + compSize);
    off += compSize;
    if (compSize === blockDecomp) {
      // a block "compressed" to its own size is stored raw
      block.copy(dst, d);
      d += blockDecomp;
    } else {
      d = lz4DecodeInto(block, dst, d);
    }
  }
  if (d !== total) throw new Error(`LZ4 decode produced ${d} of ${total} bytes`);
  return dst;
}

/** Bytes for one mip level of w×h in the given dxgi format. */
function mipByteSize(dxgi, w, h) {
  // BC block-compressed formats
  const bc8 = new Set([70, 71, 72, 79, 80, 81]); // BC1, BC4
  const bc16 = new Set([73, 74, 75, 76, 77, 78, 82, 83, 84, 94, 95, 96, 97, 98, 99]); // BC2/3/5/6/7
  if (bc8.has(dxgi)) return Math.max(1, Math.ceil(w / 4)) * Math.max(1, Math.ceil(h / 4)) * 8;
  if (bc16.has(dxgi)) return Math.max(1, Math.ceil(w / 4)) * Math.max(1, Math.ceil(h / 4)) * 16;
  // assume 32bpp (B8G8R8A8 / R8G8B8A8 families)
  return w * h * 4;
}

/** Parse an ENF1 .edds and return a standard single-mip DDS buffer (top mip). */
function eddsToDds(buf, srcName) {
  if (buf.toString("ascii", 0, 4) !== "DDS ") throw new Error(`${srcName}: not a DDS`);
  if (buf.toString("ascii", 0x24, 0x28) !== "ENF1")
    throw new Error(`${srcName}: no ENF1 marker — plain DDS? pass it to texconv directly`);
  const height = buf.readUInt32LE(0x0c);
  const width = buf.readUInt32LE(0x10);
  const mipCount = Math.max(1, buf.readUInt32LE(0x1c));
  const fourCC = buf.toString("ascii", 0x54, 0x58);
  const headerEnd = fourCC === "DX10" ? 0x94 : 0x80;
  const dxgi = fourCC === "DX10" ? buf.readUInt32LE(0x80) : 0;

  // Enfusion mip table: [tag u32][storedSize u32] per mip, smallest first
  const entries = [];
  for (let i = 0; i < mipCount; i++) {
    const off = headerEnd + i * 8;
    entries.push({ tag: buf.toString("ascii", off, off + 4), size: buf.readUInt32LE(off + 4) });
  }
  const dataStart = headerEnd + mipCount * 8;

  // Largest mip = LAST table entry; its payload sits after all previous ones
  let payloadOff = dataStart;
  for (let i = 0; i < mipCount - 1; i++) payloadOff += entries[i].size;
  const top = entries[mipCount - 1];
  let payload = buf.subarray(payloadOff, payloadOff + top.size);
  const expected = mipByteSize(dxgi, width, height);
  if (top.tag === "LZ4 ") payload = enfLz4Decode(payload, expected);
  else if (top.tag !== "COPY") throw new Error(`${srcName}: unknown mip tag "${top.tag}"`);
  if (payload.length !== expected)
    throw new Error(`${srcName}: top mip ${payload.length} bytes, expected ${expected} (${width}x${height} dxgi ${dxgi})`);

  // Standard DDS: original headers minus the Enfusion table, mipMapCount = 1
  const header = Buffer.from(buf.subarray(0, headerEnd));
  header.writeUInt32LE(1, 0x1c); // mipMapCount
  header.writeUInt32LE(0, 0x24); // scrub ENF1 (reserved anyway)
  header.writeUInt32LE(payload.length, 0x14); // pitchOrLinearSize = top mip size
  return Buffer.concat([header, payload]);
}

// ---------------------------------------------------------------------------
// Preview lookup

function previewRoots() {
  const roots = [];
  for (const dir of readdirSync(REFERENCE_ROOT, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const p = join(REFERENCE_ROOT, dir.name, "UI", "Textures", "EditorPreviews");
    if (existsSync(p)) roots.push(p);
  }
  // vanilla first so shared paths resolve to vanilla art
  roots.sort((a, b) => Number(b.includes("ReforgerData")) - Number(a.includes("ReforgerData")));
  return roots;
}

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

/** Resolve one input (prefab ref / .edds path) to an existing .edds file. */
function resolveInput(input, roots) {
  let p = input.replace(/^\{[0-9A-Fa-f]{16}\}/, "").replace(/\\/g, "/");
  if (p.toLowerCase().endsWith(".edds")) {
    if (existsSync(p)) return p;
    for (const root of roots) {
      const cand = join(root, p);
      if (existsSync(cand)) return cand;
    }
    return null;
  }
  // prefab path -> preview subpath
  let sub = null;
  if (/^Prefabs\//i.test(p)) sub = p.replace(/^Prefabs\//i, "").replace(/\.et$/i, ".edds");
  else if (/^PrefabsEditable\/Auto\//i.test(p)) sub = p.replace(/^PrefabsEditable\//i, "").replace(/\.et$/i, ".edds");
  if (sub) {
    for (const root of roots) {
      const cand = join(root, sub);
      if (existsSync(cand)) return cand;
    }
  }
  // fallback: basename search (also finds E_<name>.edds for a base prefab)
  const base = basename(p).replace(/\.et$/i, "");
  const wanted = [`${base}.edds`.toLowerCase(), `e_${base}.edds`.toLowerCase()];
  for (const root of roots) {
    for (const f of walk(root)) {
      if (wanted.includes(basename(f).toLowerCase())) return f;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
// --size WxH: downscale via texconv (e.g. 200x150 for web grid tiles)
const sizeIdx = args.indexOf("--size");
let sizeArgs = [];
if (sizeIdx !== -1) {
  const m = /^(\d+)x(\d+)$/.exec(args[sizeIdx + 1] ?? "");
  if (!m) {
    console.error("--size expects WxH, e.g. --size 200x150");
    process.exit(1);
  }
  sizeArgs = ["-w", m[1], "-h", m[2]];
}
if (outIdx === -1 || !args[outIdx + 1] || args.length < 4) {
  console.error("Usage: node extract-thumbnails.mjs --out <dir> [--size WxH] <prefab-ref-or-edds>...");
  process.exit(1);
}
const consumed = new Set([outIdx, outIdx + 1, ...(sizeIdx !== -1 ? [sizeIdx, sizeIdx + 1] : [])]);
const outDir = args[outIdx + 1];
const inputs = args.filter((_, i) => !consumed.has(i));
mkdirSync(outDir, { recursive: true });

const roots = previewRoots();
console.log(`Preview roots:\n${roots.map((r) => `  ${r}`).join("\n")}`);

const tmp = join(tmpdir(), `edds2png-${process.pid}`);
mkdirSync(tmp, { recursive: true });
let ok = 0;
let fail = 0;
try {
  for (const input of inputs) {
    const edds = resolveInput(input, roots);
    if (!edds) {
      console.error(`MISS  ${input} — no preview found`);
      fail++;
      continue;
    }
    try {
      const dds = eddsToDds(readFileSync(edds), basename(edds));
      const ddsPath = join(tmp, basename(edds).replace(/\.edds$/i, ".dds"));
      writeFileSync(ddsPath, dds);
      execFileSync(TEXCONV, ["-ft", "png", "-y", "-nologo", ...sizeArgs, "-o", outDir, ddsPath], { stdio: "pipe" });
      console.log(`OK    ${basename(edds).replace(/\.edds$/i, ".png")}  <-  ${edds}`);
      ok++;
    } catch (err) {
      console.error(`FAIL  ${input}: ${err.message}`);
      fail++;
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(`\n${ok} written to ${outDir}${fail ? `, ${fail} failed` : ""}`);
process.exit(fail && !ok ? 1 : 0);
