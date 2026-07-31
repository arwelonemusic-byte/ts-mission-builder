// Destroy-objective target pool: the curated DESTROY_OBJECTS registry
// (generator/catalogue.mjs, provenance input/destroy-objects.md) plus a
// Vehicles category built from the mission factions' vehicle dicts. Thumbs
// live in /icons/prefabs/ (extracted GM editor previews, 200x150); vehicle
// thumbs are keyed by prefab basename — factions whose mods ship no
// EditorPreviews (British Forces, MEI reskins) fall back to the modal's
// placeholder tile via <img> onError.
import { DESTROY_OBJECTS, FACTIONS } from "mission-gen";
import type { Mission } from "./mission";

export type DestroyCategory = "comms" | "fuel" | "cache" | "weapons" | "industrial" | "vehicles";

export type DestroyEntry = {
  ref: string;
  label: string;
  cat: DestroyCategory;
  /** filename under /icons/prefabs/ */
  thumb: string;
};

/** Category filter chips, in display order. Labels are i18n keys. */
export const DESTROY_CATEGORIES: { key: DestroyCategory; label: string }[] = [
  { key: "comms", label: "Communications" },
  { key: "fuel", label: "Fuel" },
  { key: "cache", label: "Caches" },
  { key: "weapons", label: "Weapons" },
  { key: "industrial", label: "Industrial" },
  { key: "vehicles", label: "Vehicles" },
];

/** British Forces ships no previews for its RESKINS of vanilla vehicles —
 * show the vanilla base vehicle's thumbnail instead (same silhouette, US
 * livery). BF's own Land Rovers + MEI's reskins have real extracted thumbs
 * under their prefab basenames. Keyed by prefab basename (no .et). */
const THUMB_FALLBACKS: Record<string, string> = {
  M997_maxi_ambulance_UK: "M997_maxi_ambulance.png",
  M923A1_transport_covered_UK: "M923A1_transport_covered.png",
  M923A1_tanker_UK: "M923A1_tanker.png",
  M923A1_arsenal_UK: "M923A1_arsenal.png",
  M923A1_repair_UK: "M923A1_repair.png",
  M923A1_engineer_UK: "M923A1_engineer.png",
  BF_BRDM2_Conflict_UK: "BRDM2.png",
  UH1H_UK: "UH1H.png",
  UH1H_armed_UK: "UH1H_armed.png",
  UH1H_armed_gunship_HE_UK: "UH1H_armed_gunship_HE.png",
  // Vanilla/mod variants BI never baked a preview for — nearest family member
  Mi8MT_unarmed_transport: "Mi8MT_armed.png",
  Mi8MT_armed_black: "Mi8MT_armed.png",
  SP02_GUNSHIP: "UH1H_armed_gunship_HE_sharkNose.png",
  M998_uncovered: "M998_covered.png",
  M998_uncovered_MERDC: "M998_covered_MERDC.png",
  UAZ469_PKM_FIA: "UAZ469_PKM.png",
  UAZ469_UK59_FIA: "UAZ469_PKM.png",
  UAZ469_Camo: "UAZ469.png",
  UAZ469_Camo_uncovered: "UAZ469_uncovered.png",
  UAZ452_Armed_Bandit: "UAZ452_transport_Bandit.png",
};

const thumbFromRef = (ref: string) => {
  const base = (ref.split("/").pop() ?? "").replace(/\.et$/i, "");
  return THUMB_FALLBACKS[base] ?? `${base}.png`;
};

/** Full selectable pool for a mission: curated objects + both sides' vehicles. */
export function destroyPool(m: Mission): DestroyEntry[] {
  const entries: DestroyEntry[] = DESTROY_OBJECTS.map((o) => ({ ...o }));
  const seen = new Set(entries.map((e) => e.ref));
  for (const fk of [m.enemyFaction, m.playableFaction]) {
    const f = FACTIONS[fk];
    if (!f?.vehicles) continue;
    for (const [key, ref] of Object.entries(f.vehicles)) {
      if (seen.has(ref)) continue;
      seen.add(ref);
      entries.push({
        ref,
        label: f.vehicleLabels?.[key] ?? key,
        cat: "vehicles",
        thumb: thumbFromRef(ref),
      });
    }
  }
  return entries;
}

/** Pool entry for a stored ref (card display); null for stale refs. */
export function destroyEntry(m: Mission, ref: string | undefined): DestroyEntry | null {
  if (!ref) return null;
  return destroyPool(m).find((e) => e.ref === ref) ?? null;
}
