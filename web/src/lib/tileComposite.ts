// Stitches a terrain's XYZ tile pyramid into one canvas for the 3D view's
// terrain texture. The repo ships no single-image basemaps (tiles only), so
// the composite is built in the browser: pick the deepest zoom level whose
// stitched size stays within MAX_TEXTURE_PX, then draw every available tile.
// Tiles beyond the world's data extent don't exist (404) — the pre-filled
// page-background color shows there instead, matching the 2D donut mask.
import type { TerrainConfig } from "./terrains";

const MAX_TEXTURE_PX = 6144;
const TILE_PX = 256;
const BACKGROUND = "#0d0f11";
/** Keep at most this many composites alive — a 5000² canvas is ~100 MB RGBA. */
const CACHE_CAP = 3;

const cache = new Map<string, Promise<HTMLCanvasElement>>();

export function compositeTerrainTexture(t: TerrainConfig): Promise<HTMLCanvasElement> {
  const hit = cache.get(t.key);
  if (hit) return hit;
  const p = build(t);
  cache.set(t.key, p);
  for (const key of cache.keys()) {
    if (cache.size <= CACHE_CAP) break;
    if (key !== t.key) cache.delete(key);
  }
  return p;
}

async function build(t: TerrainConfig): Promise<HTMLCanvasElement> {
  const [w, h] = t.worldSize;
  // Meters-per-pixel doubles per level up from the native tileMaxZoom.
  let z = t.tileMaxZoom;
  while (z > 0 && Math.max(w, h) / 2 ** (t.tileMaxZoom - z) > MAX_TEXTURE_PX) z--;
  const mpp = 2 ** (t.tileMaxZoom - z);
  const cw = Math.ceil(w / mpp);
  const ch = Math.ceil(h / mpp);

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d canvas unavailable");
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, cw, ch);

  // Tile (0,0) sits at the world's NW corner; rows grow southward.
  const jobs: Promise<void>[] = [];
  for (let ty = 0; ty * TILE_PX < ch; ty++) {
    for (let tx = 0; tx * TILE_PX < cw; tx++) {
      const url = t.tilePattern
        .replace("{z}", String(z))
        .replace("{x}", String(tx))
        .replace("{y}", String(ty));
      jobs.push(
        loadImage(url)
          .then((img) => {
            ctx.drawImage(img, tx * TILE_PX, ty * TILE_PX);
          })
          .catch(() => {}) // absent edge tile — background fill stays
      );
    }
  }
  await Promise.all(jobs);
  return canvas;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img);
}
