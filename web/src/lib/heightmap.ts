/**
 * Loads a heightmap (raw little-endian uint16 binary + sidecar JSON) and
 * returns a sampler that converts (worldX, worldY) → elevation in metres.
 *
 * The .bin file preserves full 1/65535 precision (≈ 3 cm at Arland's scale),
 * unlike the debug .png which is degraded by 8-bit canvas reads.
 */

export type HeightmapMeta = {
  bin: string;
  png: string;
  widthPx: number;
  heightPx: number;
  cellSizeM: number;
  worldWidthM: number;
  worldHeightM: number;
  heightScale: number;
  minElevationM: number;
  sourceCellSizeM: number;
};

export type HeightmapSampler = {
  meta: HeightmapMeta;
  /** Returns elevation in metres, or NaN if (worldX, worldY) is out of bounds. */
  sample: (worldX: number, worldY: number) => number;
  /**
   * True when any of the four grid cells `sample` would blend at this point
   * holds the extractor's no-data sentinel (raw 0 = minElevationM, e.g.
   * Armenhof's outermost south row / west+east columns). Overlays skip such
   * points — the bilinear blend from the sentinel to real terrain is garbage.
   */
  noDataNear: (worldX: number, worldY: number) => boolean;
  /**
   * Elevation of the nearest non-sentinel cell among the four `sample` would
   * blend, or NaN when all four are sentinels (deep ocean clamped at the
   * format floor — Everon/Kolguyev — reads NaN; Armenhof's boundary row next
   * to 320 m fields reads ~320).
   */
  nearestValid: (worldX: number, worldY: number) => number;
};

/**
 * Row 0 of the source grid corresponds to the SOUTH edge of the world
 * (worldY = 0); row (h-1) = the NORTH edge (max worldY). (The code below
 * always did this; the docstring said the opposite until 2026-09-17 and
 * misled the ts-ops-planner nadir_mosaic.py Heightmap class.)
 */
export async function loadHeightmap(
  binUrl: string,
  metaUrl: string,
): Promise<HeightmapSampler> {
  const [meta, buf] = await Promise.all([
    fetch(metaUrl).then((r) => r.json() as Promise<HeightmapMeta>),
    fetch(binUrl).then((r) => r.arrayBuffer()),
  ]);

  const raw = new Uint16Array(buf);
  const expected = meta.widthPx * meta.heightPx;
  if (raw.length !== expected) {
    throw new Error(
      `heightmap size mismatch: expected ${expected} u16 values, got ${raw.length}`,
    );
  }

  const { worldWidthM, worldHeightM, widthPx, heightPx, minElevationM, heightScale } = meta;
  // Pixel i sits at EXACTLY i·cellSizeM metres: the extractor's downsample
  // keeps every step-th terrain vertex (node-registered), so the last pixel
  // is at (widthPx-1)·cellSizeM — usually short of worldWidthM (Arland:
  // 4090 vs 4096). The old (widthPx-1)/worldWidthM mapping stretched the
  // grid ~0.15%, reading terrain ~3 m south-west of the true point at
  // mid-map — enough to bury a prop on a slope (engine-validated against
  // Workbench getHeight probes, 2026-08-04).
  const xScale = 1 / meta.cellSizeM;
  const yScale = 1 / meta.cellSizeM;

  const maxPx = widthPx - 1;
  const maxPy = heightPx - 1;
  // Bilinear sampling. Nearest-neighbor caused dot/scanline noise in the
  // radial LOS mask when adjacent ray steps (4m apart) landed in the same
  // 10m cell then abruptly jumped to a neighbor several meters higher.
  // Row 0 of the heightmap corresponds to worldY=0 (south) — larger worldY
  // means larger py.
  const sample = (worldX: number, worldY: number): number => {
    if (worldX < 0 || worldX > worldWidthM) return NaN;
    if (worldY < 0 || worldY > worldHeightM) return NaN;
    const fx = worldX * xScale;
    const fy = worldY * yScale;
    const x0 = Math.min(maxPx, Math.floor(fx));
    const y0 = Math.min(maxPy, Math.floor(fy));
    const x1 = Math.min(maxPx, x0 + 1);
    const y1 = Math.min(maxPy, y0 + 1);
    const tx = fx - x0;
    const ty = fy - y0;
    const h00 = raw[y0 * widthPx + x0];
    const h10 = raw[y0 * widthPx + x1];
    const h01 = raw[y1 * widthPx + x0];
    const h11 = raw[y1 * widthPx + x1];
    const h = (h00 * (1 - tx) + h10 * tx) * (1 - ty)
            + (h01 * (1 - tx) + h11 * tx) * ty;
    return minElevationM + h * heightScale;
  };

  // Boundary rows/columns: a line that is mostly sentinel is the extractor
  // sampling outside the terrain — its few non-zero cells are partial garbage
  // (Armenhof row 0: 383 zeros + a 128 m and a 327 m stray), so the whole
  // line counts as no-data.
  const badRow = new Uint8Array(heightPx);
  const badCol = new Uint8Array(widthPx);
  {
    const rowZeros = new Uint32Array(heightPx);
    const colZeros = new Uint32Array(widthPx);
    for (let y = 0; y < heightPx; y++) {
      for (let x = 0; x < widthPx; x++) {
        if (raw[y * widthPx + x] === 0) {
          rowZeros[y]++;
          colZeros[x]++;
        }
      }
    }
    for (let y = 0; y < heightPx; y++) if (rowZeros[y] * 2 > widthPx) badRow[y] = 1;
    for (let x = 0; x < widthPx; x++) if (colZeros[x] * 2 > heightPx) badCol[x] = 1;
  }
  const isNoData = (x: number, y: number): boolean =>
    raw[y * widthPx + x] === 0 || badRow[y] === 1 || badCol[x] === 1;

  const noDataNear = (worldX: number, worldY: number): boolean => {
    if (worldX < 0 || worldX > worldWidthM || worldY < 0 || worldY > worldHeightM) return true;
    const x0 = Math.min(maxPx, Math.floor(worldX * xScale));
    const y0 = Math.min(maxPy, Math.floor(worldY * yScale));
    const x1 = Math.min(maxPx, x0 + 1);
    const y1 = Math.min(maxPy, y0 + 1);
    return isNoData(x0, y0) || isNoData(x1, y0) || isNoData(x0, y1) || isNoData(x1, y1);
  };

  const nearestValid = (worldX: number, worldY: number): number => {
    if (worldX < 0 || worldX > worldWidthM || worldY < 0 || worldY > worldHeightM) return NaN;
    const fx = worldX * xScale;
    const fy = worldY * yScale;
    const x0 = Math.min(maxPx, Math.floor(fx));
    const y0 = Math.min(maxPy, Math.floor(fy));
    const x1 = Math.min(maxPx, x0 + 1);
    const y1 = Math.min(maxPy, y0 + 1);
    let best = NaN;
    let bestD = Infinity;
    for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]] as const) {
      if (isNoData(cx, cy)) continue;
      const v = raw[cy * widthPx + cx];
      const d = (fx - cx) * (fx - cx) + (fy - cy) * (fy - cy);
      if (d < bestD) {
        bestD = d;
        best = minElevationM + v * heightScale;
      }
    }
    return best;
  };

  return { meta, sample, noDataNear, nearestValid };
}
