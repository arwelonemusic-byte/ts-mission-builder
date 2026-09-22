// Elevation overlay (POC 2026-09-19): recolours the terrain by height from
// the shipped heightmap — blue = the terrain's LOWEST land, red = its highest
// point, sea flat navy. The ramp is PER TERRAIN (user decision 2026-09-19
// after a global 0–900 m ramp left Arland's 148 m of relief a uniform blue):
// every map uses the full gradient, so colours read as relative relief, not
// absolute altitude — the legend prints the map's own metres at the ticks.
// Rendered client-side into a canvas (no shipped assets), consumed by the 2D
// map as an L.imageOverlay stretched over the world rectangle.
import type { HeightmapSampler } from "./heightmap";

export type ElevationOverlay = {
  /** data: URL of the rendered PNG (north row first) */
  url: string;
  /** the ramp's range = this map's land range in metres (legend ticks) */
  minM: number;
  maxM: number;
};

/** Blue → cyan → green → yellow → red, t in [0,1]. */
const RAMP: [number, number, number][] = [
  [28, 56, 224],
  [0, 196, 232],
  [64, 200, 64],
  [245, 220, 40],
  [222, 40, 32],
];

export function rampColor(t: number): [number, number, number] {
  const c = Math.min(1, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(c));
  const f = c - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

export const RAMP_CSS =
  "linear-gradient(to top, " +
  RAMP.map((c, i) => "rgb(" + c.join(",") + ") " + (i / (RAMP.length - 1)) * 100 + "%").join(", ") +
  ")";

const SEA_M = 0.3; // heightmap cells at/below this = water
const SEA_RGB = [12, 34, 92];
const MAX_PX = 2048;

export function renderElevationOverlay(
  sampler: HeightmapSampler,
  worldW: number,
  worldH: number,
): ElevationOverlay {
  const mPerPx = Math.max(worldW, worldH) / MAX_PX;
  const w = Math.round(worldW / mPerPx);
  const h = Math.round(worldH / mPerPx);
  // pass 1: sample + this map's land range
  const elev = new Float32Array(w * h);
  let lo = Infinity;
  let hi = -Infinity;
  for (let r = 0; r < h; r++) {
    const wy = worldH - (r + 0.5) * mPerPx; // row 0 = north
    for (let c = 0; c < w; c++) {
      const wx = (c + 0.5) * mPerPx;
      let e = sampler.sample(wx, wy);
      if (e === e && sampler.noDataNear(wx, wy)) {
        // Raw-0 sentinel cells: deep ocean clamped at the format floor (all
        // neighbours water/sentinel → paint as sea) or the extractor sampling
        // outside the terrain boundary next to real land (Armenhof's south
        // row → transparent, and never part of the ramp range).
        const nv = sampler.nearestValid(wx, wy);
        e = nv === nv && nv > SEA_M ? NaN : -1;
      }
      elev[r * w + c] = e;
      if (e === e && e > SEA_M) {
        if (e < lo) lo = e;
        if (e > hi) hi = e;
      }
    }
  }
  if (!(lo < hi)) {
    lo = 0;
    hi = 1;
  }
  // pass 2: colour on the per-terrain ramp
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const span = hi - lo;
  for (let i = 0; i < w * h; i++) {
    const e = elev[i];
    const o = i * 4;
    if (e !== e) {
      d[o + 3] = 0; // outside the heightmap / no-data → transparent
      continue;
    }
    if (e <= SEA_M) {
      d[o] = SEA_RGB[0];
      d[o + 1] = SEA_RGB[1];
      d[o + 2] = SEA_RGB[2];
      d[o + 3] = 255;
      continue;
    }
    const [cr, cg, cb] = rampColor((e - lo) / span);
    d[o] = cr;
    d[o + 1] = cg;
    d[o + 2] = cb;
    d[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return { url: canvas.toDataURL("image/png"), minM: lo, maxM: hi };
}
