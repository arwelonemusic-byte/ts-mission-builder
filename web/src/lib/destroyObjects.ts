// Destroy-objective target pool: the curated DESTROY_OBJECTS registry
// (generator/catalogue.mjs, provenance input/destroy-objects.md) plus a
// Vehicles category built from the mission factions' vehicle dicts. Thumbs
// live in /icons/prefabs/ (extracted GM editor previews, 200x150); vehicle
// thumbs are keyed by prefab basename — factions whose mods ship no
// EditorPreviews (British Forces, MEI reskins) fall back to the modal's
// placeholder tile via <img> onError.
import { DESTROY_OBJECTS, FACTIONS, VEHICLE_MODS } from "mission-gen";
import type { Mission } from "./mission";

export type DestroyCategory = "comms" | "fuel" | "cache" | "weapons" | "vehicles";

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
  // Arma II Factions reskins: the mod's own EditorPreviews ship as PNGs for
  // the HMMWVs, UAZ-469s and command Urals. The rest fall back to the vanilla
  // base vehicle — the mod has no preview for them (UAZ-452, BRDM-2, Mi-8
  // gunships) or a broken one (every BTR-70 = a bad rock shot, Mi-8 = a wheel
  // close-up, 12 of 14 Urals = a CDF soldier). Re-check after a mod update.
  UAZ452_transport_CDF: "UAZ452_transport.png",
  UAZ452_ambulance_CDF: "UAZ452_ambulance.png",
  UAZ452_cargo_CDF: "UAZ452_cargo.png",
  BRDM2_CDF: "BRDM2.png",
  BTR70_Ses_CDF: "BTR70.png",
  Ural4320_Ses_CDF_transport: "Ural4320_transport.png",
  Ural4320_Ses_CDF_transport_covered: "Ural4320_transport_covered.png",
  Ural4320_Ses_CDF_ammo: "Ural4320_ammo.png",
  Ural4320_Ses_CDF_engineer: "Ural4320_engineer.png",
  Ural4320_Ses_CDF_repair: "Ural4320_repair.png",
  Ural4320_Ses_CDF_tanker: "Ural4320_tanker.png",
  Mi8MT_CDF: "Mi8MT_armed.png",
  Mi8MT_armed_Ses_CDF: "Mi8MT_armed.png",
  Mi8MT_armed_gunship_HE_Ses_CDF: "Mi8MT_armed_gunship_HE.png",
  Mi8MT_armed_gunship_HEDP_Ses_CDF: "Mi8MT_armed_gunship_HEDP.png",
  UAZ452_transport_ChDKZ: "UAZ452_transport.png",
  UAZ452_ambulance_ChDKZ: "UAZ452_ambulance.png",
  UAZ452_cargo_ChDKZ: "UAZ452_cargo.png",
  BRDM2_Ses_ChDKZ: "BRDM2.png",
  BTR70_Ses_ChDKZ: "BTR70.png",
  Ural4320_Ses_ChDKZ_transport: "Ural4320_transport.png",
  Ural4320_Ses_ChDKZ_transport_covered: "Ural4320_transport_covered.png",
  Ural4320_Ses_ChDKZ_ammo: "Ural4320_ammo.png",
  Ural4320_Ses_ChDKZ_engineer: "Ural4320_engineer.png",
  Ural4320_Ses_ChDKZ_repair: "Ural4320_repair.png",
  Ural4320_Ses_ChDKZ_tanker: "Ural4320_tanker.png",
  BRDM2_Ses_NAPA: "BRDM2.png",
  BTR70_Ses_NAPA: "BTR70.png",
  // Bundeswehr (2026-09-15): the Tropentarn Dingo shares the Flecktarn preview;
  // the bundled PZG GER reskins ship no previews -> their vanilla US parents
  // (keys = the reskin prefab basenames, which contain spaces — verbatim)
  BWAR_Dingo2A3_2B_3FT: "BWAR_Dingo2A3_2B.png",
  "M151A2 PZG GER": "M151A2_MERDC.png",
  "M151A2 Roof PZG GER": "M151A2_transport.png",
  "M151A2 armed PZG GER": "M151A2_M2HB.png",
  "M1025 light PZG GER": "M998_covered.png",
  "M1025 PZG GER": "M1025_MERDC.png",
  "M1025 armed PZG GER": "M1025_armed_M2HB.png",
  M1025_maxi_ambulance_GER: "M997_maxi_ambulance.png",
  "M923A1 transpo 1 PZG GER": "M923A1_transport.png",
  "M923A1 covered PZG GER": "M923A1_transport_covered.png",
  "M923A1 tanker PZG GER": "M923A1_tanker.png",
  "M923A1 Command PZG GER": "M923A1_command.png",
  "M923A1 Arsenal PZG GER": "M923A1_arsenal.png",
  "M923A1 repair PZG GER": "M923A1_repair.png",
  "M923A1 Engineer PZG GER": "M923A1_engineer.png",
  "LAV25 PZG GER": "LAV25.png",
  "UH1H PZG GER": "UH1H.png",
  "UH1H armed PZG GER": "UH1H_armed.png",
  "UH1H gunship PZG GER": "UH1H_armed_gunship_HEDP.png",
  "UH1H Supply PZG GER": "UH1H.png",
};

export const thumbFromRef = (ref: string) => {
  const base = (ref.split("/").pop() ?? "").replace(/\.et$/i, "");
  return THUMB_FALLBACKS[base] ?? `${base}.png`;
};

/** Enabled vehicle mods' entries (side-agnostic — join every vehicle pool). */
function modVehicleEntries(m: Mission, seen: Set<string>): DestroyEntry[] {
  const entries: DestroyEntry[] = [];
  for (const vm of Object.values(VEHICLE_MODS)) {
    if (vm.hidden || !m.mods.includes(vm.id)) continue;
    for (const [key, ref] of Object.entries(vm.vehicles)) {
      if (seen.has(ref)) continue;
      seen.add(ref);
      entries.push({ ref, label: vm.vehicleLabels?.[key] ?? key, cat: "vehicles", thumb: thumbFromRef(ref) });
    }
  }
  return entries;
}

/** Full selectable pool for a mission: curated objects + both sides' vehicles
 * + enabled vehicle mods. */
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
  entries.push(...modVehicleEntries(m, seen));
  return entries;
}

/** Pool entry for a stored ref (card display); null for stale refs. */
export function destroyEntry(m: Mission, ref: string | undefined): DestroyEntry | null {
  if (!ref) return null;
  return destroyPool(m).find((e) => e.ref === ref) ?? null;
}

/** Deliver-vehicle pool: every vehicle of vanilla + ENABLED-mod factions
 * (not just the mission's two sides — steal-and-deliver plots want the full
 * garage) + enabled vehicle mods. Deduped by ref; vanilla factions come
 * first in FACTIONS order. */
export function deliverVehiclePool(m: Mission): DestroyEntry[] {
  const entries: DestroyEntry[] = [];
  const seen = new Set<string>();
  for (const f of Object.values(FACTIONS)) {
    if (f.mod && !m.mods.includes(f.mod)) continue;
    for (const [key, ref] of Object.entries(f.vehicles ?? {})) {
      if (seen.has(ref)) continue;
      seen.add(ref);
      entries.push({ ref, label: f.vehicleLabels?.[key] ?? key, cat: "vehicles", thumb: thumbFromRef(ref) });
    }
  }
  entries.push(...modVehicleEntries(m, seen));
  return entries;
}

/** Pool entry lookup against the deliver pool (card display). */
export function deliverEntry(m: Mission, ref: string | undefined): DestroyEntry | null {
  if (!ref) return null;
  return deliverVehiclePool(m).find((e) => e.ref === ref) ?? null;
}
