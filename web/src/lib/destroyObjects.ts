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

const thumbFromRef = (ref: string) => {
  const base = ref.split("/").pop() ?? "";
  return base.replace(/\.et$/i, ".png");
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
