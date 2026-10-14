// Map lines (Markers tab → Lines) — a 1:1 port of ts-ops-planner's line tool:
// same 14-colour palette (sRGB hex, Figma node 19:1159 — the engine's placed-
// marker colours + TS Better Markers' black), same 5 width steps in world
// metres, same zoom-scaled stroke. In-game they render through the toolkit's
// TS_MapOverlayComponent on an open PolylineShapeEntity (m_OutlineWidthMeters
// — the Ops Planner mod's own `widthM * zoom` stroke math).

export type LineWidth = 1 | 2 | 3 | 4 | 5;

export const LINE_WIDTHS: LineWidth[] = [1, 2, 3, 4, 5];
export const DEFAULT_LINE_WIDTH: LineWidth = 3;

/** Width step → world metres (ts-ops-planner LINE_WIDTH_METERS). */
export const LINE_WIDTH_METERS: Record<LineWidth, number> = { 1: 2, 2: 4, 3: 8, 4: 12, 5: 16 };

/** Ops Planner palette, in its ColorGrid order (2 rows × 7). */
export const LINE_COLORS: { name: string; label: string; hex: string }[] = [
  { name: "BLACK", label: "Black", hex: "#000000" },
  { name: "DARK_BROWN", label: "Dark Brown", hex: "#60383d" },
  { name: "PURPLE", label: "Purple", hex: "#9151a0" },
  { name: "PING", label: "Ping", hex: "#f038db" },
  { name: "NAVY_BLUE", label: "Navy Blue", hex: "#0d6079" },
  { name: "CYAN", label: "Cyan", hex: "#22c3f3" },
  { name: "BLUE", label: "Blue", hex: "#0d7aed" },
  { name: "DARK_GREEN", label: "Dark Green", hex: "#005b26" },
  { name: "GREEN", label: "Green", hex: "#22b24f" },
  { name: "RED", label: "Red", hex: "#ee2e2e" },
  { name: "DARK_RED", label: "Dark Red", hex: "#821c1c" },
  { name: "DARK_ORANGE", label: "Dark Orange", hex: "#e2a84f" },
  { name: "ORANGE", label: "Orange", hex: "#f9d368" },
  { name: "WHITE", label: "White", hex: "#ffffff" },
];
export const DEFAULT_LINE_COLOR = "BLACK";

/** Swatches the checkmark has to be dark on. */
export const LIGHT_LINE_COLORS = new Set(["WHITE", "ORANGE", "DARK_ORANGE", "CYAN"]);

/** Selection halo colour (ts-ops-planner's under-stroke). */
export const LINE_HALO = "#fbbf24";

export function lineColorHex(name: string): string {
  return (LINE_COLORS.find((c) => c.name === name) ?? LINE_COLORS[0]).hex;
}

export function isLineWidth(v: unknown): v is LineWidth {
  return v === 1 || v === 2 || v === 3 || v === 4 || v === 5;
}

/** CRS.Simple: 1 world metre = 2^zoom px. Floored so lines never vanish
 * (same 1.5 px floor as the Ops Planner web tool and its in-game mod). */
export function metersToWeight(m: number, zoom: number): number {
  return Math.max(1.5, m * Math.pow(2, zoom));
}

/** Width-picker preview bar thickness (px) per step — UI only. */
export function lineWidthPreviewPx(w: LineWidth): number {
  return 2 + (w - 1) * 2;
}
