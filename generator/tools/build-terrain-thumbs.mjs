// Build the square map thumbnails the Terrain picker modal shows, straight
// from the tile pyramids the map already ships (no new captures needed).
// Run after adding a terrain or re-capturing its tiles:
//   node generator/tools/build-terrain-thumbs.mjs [key ...]
//
// Geometry (mirrors MissionMap.tsx's tileLayer setup): at tile zoom
// tileMaxZoom one pixel is one metre, so a zoom-z tile spans
// 256 · 2^(tileMaxZoom − z) metres and the world occupies the top-left
// worldSize / 2^(tileMaxZoom − z) pixels of the stitched zoom-z canvas —
// the rest is the pyramid's padding (the z0 tile shows the map in its
// top-left corner). We stitch zoom 2 (≥512 px of map for every shipped
// terrain), crop to the world rectangle and downscale to THUMB px.
// Output: web/public/icons/terrains/<terrain key>.jpg
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const TERRAINS_TS = join(root, "web", "src", "lib", "terrains.ts");
const PUBLIC = join(root, "web", "public");
const OUT_DIR = join(PUBLIC, "icons", "terrains");
const THUMB = 512;
const STITCH_Z = 2;
const BG = { r: 13, g: 15, b: 17 }; // #0d0f11 — the map's void fill

// terrains.ts is the single source of tile geometry; a light regex parse
// keeps this tool free of a TS toolchain (same approach as the harvesters).
function parseTerrains(src) {
  const out = [];
  const re = /\{\s*key:\s*"([^"]+)"[\s\S]*?worldSize:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\][\s\S]*?tilePattern:\s*"([^"]+)"[\s\S]*?tileMaxZoom:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src))) {
    const [, key, w, h, pattern, maxZoom] = m;
    out.push({
      key,
      worldSize: [Number(w), Number(h)],
      tileDir: pattern.replace(/\?.*$/, "").replace(/\/\{z\}.*$/, ""),
      tileMaxZoom: Number(maxZoom),
    });
  }
  return out;
}

async function build(t) {
  const z = Math.min(STITCH_Z, t.tileMaxZoom);
  const scale = 2 ** (t.tileMaxZoom - z); // metres per pixel at zoom z
  const n = 2 ** z; // tiles per axis
  const worldPx = [Math.round(t.worldSize[0] / scale), Math.round(t.worldSize[1] / scale)];
  const layers = [];
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const file = join(PUBLIC, t.tileDir, String(z), String(x), `${y}.jpg`);
      if (!existsSync(file)) continue; // padding tiles beyond the world are not shipped
      layers.push({ input: file, left: x * 256, top: y * 256 });
    }
  }
  if (!layers.length) throw new Error(`${t.key}: no zoom-${z} tiles under ${t.tileDir}`);
  const canvas = sharp({
    create: { width: n * 256, height: n * 256, channels: 3, background: BG },
  }).composite(layers);
  const stitched = await canvas.jpeg({ quality: 100 }).toBuffer();
  const out = join(OUT_DIR, `${t.key}.jpg`);
  await sharp(stitched)
    .extract({ left: 0, top: 0, width: worldPx[0], height: worldPx[1] })
    .resize(THUMB, THUMB, { fit: "cover", kernel: "lanczos3" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(`${t.key.padEnd(12)} z${z} ${worldPx[0]}x${worldPx[1]} px of map, ${layers.length} tiles → ${out}`);
}

const terrains = parseTerrains(readFileSync(TERRAINS_TS, "utf8"));
const only = process.argv.slice(2);
const todo = only.length ? terrains.filter((t) => only.includes(t.key)) : terrains;
if (!todo.length) throw new Error(`no terrains matched: ${only.join(", ")}`);
mkdirSync(OUT_DIR, { recursive: true });
for (const t of todo) await build(t);
