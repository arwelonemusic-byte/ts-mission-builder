// Re-sync PROPS[*].fp in generator/props.mjs from the unpacked vanilla data.
// Run after editing the PROPS list:  node generator/tools/harvest-prop-footprints.mjs
//
// Footprint sources (research 2026-08-04):
//  - minefield effect modules: fixed SCR_EffectsModuleAreaMeshComponent sizes
//    (m_fWidth/m_fLenght are FULL diameters per SCR_BaseAreaMeshComponent).
//  - slotted compositions: the first `PhysicsBoxGeometry UserAction` block
//    carrying `Extents X Y Z` (FULL size) + optional `Offset`, walking the
//    `: "{GUID}path.et"` inheritance chain (weapon variants are 3-line
//    children; BuildableComposition_Base's block is empty — skipped).
//  - plain props/wrecks: the first MeshObject .xob along the chain; the .xob
//    header carries the model-space AABB (float32-LE min @0x18, max @0x24).
//  - last resort for compositions: the slot class from the path
//    (SlotFlat{S,M,L} = 15/30/45 m disc, SlotRoad{S,M,L} = 6/10/14 m square).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PROPS_PATH = join(root, "generator", "props.mjs");
const REF_ROOT = "D:/VSCode_dev/arma-reforger/reference/ReforgerData";

const { PROPS } = await import(`file://${PROPS_PATH.replace(/\\/g, "/")}`);

const MINEFIELDS = [
  [/Rect_Row/, { w: 5, len: 10 }],
  [/_Small/, { w: 15, len: 15 }],
  [/_Medium/, { w: 35, len: 35 }],
  [/_Large/, { w: 75, len: 75 }],
];
const SLOT_FALLBACK = [
  [/SlotFlatSmall/, { d: 15 }],
  [/SlotFlatMedium/, { d: 30 }],
  [/SlotFlatLarge/, { d: 45 }],
  [/SlotRoadSmall/, { w: 6, len: 6 }],
  [/SlotRoadMedium/, { w: 10, len: 10 }],
  [/SlotRoadLarge/, { w: 14, len: 14 }],
];

const r1 = (v) => Math.round(v * 10) / 10;

function xobFootprint(xobPath) {
  const buf = readFileSync(join(REF_ROOT, xobPath));
  if (buf.toString("ascii", 0, 4) !== "FORM" || buf.toString("ascii", 8, 12) !== "XOB9")
    throw new Error(`unexpected .xob header in ${xobPath}`);
  const min = [buf.readFloatLE(0x18), buf.readFloatLE(0x1c), buf.readFloatLE(0x20)];
  const max = [buf.readFloatLE(0x24), buf.readFloatLE(0x28), buf.readFloatLE(0x2c)];
  return {
    w: r1(max[0] - min[0]),
    len: r1(max[2] - min[2]),
    offX: r1((min[0] + max[0]) / 2),
    offZ: r1((min[2] + max[2]) / 2),
  };
}

// Walk one prefab file: UserAction box with Extents wins, else the first
// MeshObject .xob, else recurse into the parent prefab.
function chainFootprint(etPath, depth = 0) {
  if (depth > 12) return null;
  let text;
  try {
    text = readFileSync(join(REF_ROOT, etPath), "utf8");
  } catch {
    return { error: `file not found: ${etPath}` };
  }
  const box = text.match(/PhysicsBoxGeometry UserAction\s*\{([^{}]*)\}/);
  if (box) {
    const ext = box[1].match(/Extents\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/);
    if (ext) {
      const fp = { w: r1(+ext[1]), len: r1(+ext[3]) };
      const off = box[1].match(/Offset\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/);
      if (off) {
        fp.offX = r1(+off[1]);
        fp.offZ = r1(+off[3]);
      }
      return fp;
    }
  }
  const xob = text.match(/"\{[0-9A-F]{16}\}([^"]+\.xob)"/);
  if (xob) return xobFootprint(xob[1]);
  const parent = text.match(/^\s*\w+\s*:\s*"\{[0-9A-F]{16}\}([^"]+\.et)"/m);
  if (parent) return chainFootprint(parent[1], depth + 1);
  return null;
}

function footprintFor(ref) {
  const path = ref.replace(/^\{[0-9A-F]{16}\}/, "");
  if (path.includes("EffectsModules/Mine")) {
    for (const [re, fp] of MINEFIELDS) if (re.test(path)) return fp;
    return { error: `no minefield size rule for ${path}` };
  }
  const fp = chainFootprint(path);
  if (fp && !fp.error) return fp;
  for (const [re, slot] of SLOT_FALLBACK) if (re.test(path)) return slot;
  return fp ?? { error: `no footprint source found for ${path}` };
}

const fmt = (fp) => {
  if (fp.d) return `fp: { d: ${fp.d} }`;
  let s = `fp: { w: ${fp.w}, len: ${fp.len}`;
  // drop sub-5cm centering noise, keep real offsets
  if (Math.abs(fp.offX ?? 0) >= 0.05 || Math.abs(fp.offZ ?? 0) >= 0.05)
    s += `, offX: ${fp.offX ?? 0}, offZ: ${fp.offZ ?? 0}`;
  return s + " }";
};

let src = readFileSync(PROPS_PATH, "utf8");
const failed = [];
for (const p of PROPS) {
  const fp = footprintFor(p.ref);
  if (fp.error) {
    failed.push(`${p.label}: ${fp.error}`);
    continue;
  }
  const guid = p.ref.match(/^\{([0-9A-F]{16})\}/)[1];
  const lineRe = new RegExp(`(\\{${guid}\\}[^\\n]*?)fp: (?:null|\\{[^}]*\\})`);
  if (!lineRe.test(src)) {
    failed.push(`${p.label}: entry line for {${guid}} not found in props.mjs`);
    continue;
  }
  src = src.replace(lineRe, `$1${fmt(fp)}`);
  console.log(`${p.label.padEnd(34)} ${fmt(fp)}`);
}
writeFileSync(PROPS_PATH, src, "utf8");
if (failed.length) {
  console.error("\nFAILED:\n  " + failed.join("\n  "));
  process.exit(1);
}
console.log(`\nprops.mjs updated: ${PROPS.length} footprints`);
