// Props tab pool: the curated PROPS registry (generator/props.mjs — E_
// variants + footprints, provenance "Object placement.md"). Thumbs live in
// /icons/prefabs/ (extracted GM editor previews, 200x150) keyed by prefab
// basename; entries without a baked preview (the 13 base-prefab-only props
// have none — they aren't GM-placeable in vanilla) fall back to the picker's
// glyph tile via <img> onError.
import { PROPS, PROP_CATEGORIES, type PropFootprint } from "mission-gen";

export type PropCategoryKey = (typeof PROP_CATEGORIES)[number]["key"];

export type PropEntry = {
  ref: string;
  label: string;
  cat: PropCategoryKey;
  editable?: boolean;
  fp: PropFootprint;
  /** filename under /icons/prefabs/ */
  thumb: string;
};

/** Entries whose preview lives under another basename. MGN weapon variants
 * DO have baked E_ previews despite having no E_ prefab (found by the
 * extractor's basename fallback); minefields share 4 user-shot thumbs
 * (assets/Prop Thumbnails, cropped 2026-08-04) since sizes only differ in
 * area, not mine model. Keyed by prefab basename (no .et). Unmapped missing
 * previews (crate stack, S1203 wreck) fall back to the glyph tile. */
const THUMB_FALLBACKS: Record<string, string> = {
  MachineGunNest_S_US_01_M2HB: "E_MachineGunNest_S_US_01_M2HB.png",
  MachineGunNest_S_US_01_M60: "E_MachineGunNest_S_US_01_M60.png",
  MachineGunNest_S_USSR_01_PKM: "E_MachineGunNest_S_USSR_01_PKM.png",
  E_SupplyCache_S_FIA_03_Empty: "E_SupplyCache_S_FIA_03.png",
  Mi8MT_wreck: "Mi8MT_armed.png",
  EffectModule_MineField_AP_Small_US: "MineField_US_AP.png",
  EffectModule_MineField_AP_Medium_US: "MineField_US_AP.png",
  EffectModule_MineField_AP_Small_USSR: "MineField_USSR_AP.png",
  EffectModule_MineField_AP_Medium_USSR: "MineField_USSR_AP.png",
  EffectModule_MineField_Small_US: "MineField_US_AT.png",
  EffectModule_MineField_Medium_US: "MineField_US_AT.png",
  EffectModule_MineField_Large_US: "MineField_US_AT.png",
  EffectModule_MineField_Rect_Row_US: "MineField_US_AT.png",
  EffectModule_MineField_Small_USSR: "MineField_USSR_AT.png",
  EffectModule_MineField_Medium_USSR: "MineField_USSR_AT.png",
  EffectModule_MineField_Large_USSR: "MineField_USSR_AT.png",
  EffectModule_MineField_Rect_Row_USSR: "MineField_USSR_AT.png",
};

export function propThumb(ref: string): string {
  const base = (ref.split("/").pop() ?? "").replace(/\.et$/i, "");
  return THUMB_FALLBACKS[base] ?? `${base}.png`;
}

/** Full pool with thumbs resolved (picker grid). */
export function propPool(): PropEntry[] {
  return PROPS.map((p) => ({ ...p, thumb: propThumb(p.ref) }));
}

/** Pool entry for a stored ref (card display); null for stale refs. */
export function propEntry(ref: string | undefined): PropEntry | null {
  if (!ref) return null;
  const p = PROPS.find((e) => e.ref === ref);
  return p ? { ...p, thumb: propThumb(p.ref) } : null;
}

/** May this prop carry an enemy defense group? (category flag) */
export function propCanDefend(ref: string | undefined): boolean {
  const p = propEntry(ref);
  return !!PROP_CATEGORIES.find((c) => c.key === p?.cat)?.defense;
}

/** Footprint as a centered rect for map drawing: disc entries map to their
 * bounding square (circle rendering is the caller's choice via `disc`). */
export function propRect(fp: PropFootprint): { w: number; len: number; offX: number; offZ: number; disc: boolean } {
  if (typeof fp.d === "number") return { w: fp.d, len: fp.d, offX: 0, offZ: 0, disc: true };
  return { w: fp.w ?? 0, len: fp.len ?? 0, offX: fp.offX ?? 0, offZ: fp.offZ ?? 0, disc: false };
}
