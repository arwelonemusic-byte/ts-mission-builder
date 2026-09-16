// CIE Marder 1A3 — "Marder 1A3" (6446DDF41914A293), v1.0.69 harvested 2026-09-16.
// Full provenance (refs, names, weapon slots, footprint, occupants, dep chain,
// the rejected Marder_Bundeswehr livery pack): input/fennek-marder-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. Companion to the Bundeswehr faction (BWAR). ONE vehicle, the
// Marder 1A3 IFV (Rh-202 20 mm autocannon with APDS-T + HE-I feeds, coaxial
// MG3A1, MILAN ATGM pod, smoke launchers; driver + gunner/commander turret +
// 7 cargo seats), in 2 catalog fits: with slat armor (base) and without.
// User decision 2026-09-16: this ORIGINAL CIE mod replaces the
// "Marder_Bundeswehr" livery pack 654B2E111FCED38A that was integrated first
// the same day ("undercooked and buggy") — that pack's 5 self-contained
// prefab copies were dropped entirely.
// Source = the mod's Configs/EntityCatalog/US/Vehicles_EntityCatalog_US.conf
// (2 entries, catalog-driven rule; the PlaceableEntities registry lists only
// a non-shipping "Marder 1A3 Ukrainian Army.et" — ignored). GUID
// corroboration: the base prefab {7D0A4C3F2E19B6A8} is the PARENT of the
// no-slat child; the child GUID is catalog-only (top-level leaf).
// Labels are humanized (authored Name = "Marder 1A3", the child has none).
// Deps: 6446DDF41914A293 only. Its gproj pulls CIE Tracked Core
// 68CD35053063C6D5, ATGM 6A4545CCB3516E86 (the MILAN pod) and CIE_Thermal
// 68F8A813D7EF1E30 (thermal sights) — transitive, never listed here.
// vehicleSizeClass: "heavy" — hull xob 3.9 x 7.1 m (layout.mjs regex: MARDER_).
// Default occupants: vanilla US Rifleman (turret) — lib.mjs always emits
// m_aCrewPrefabPool so the crew rule covers it.
const P = "Prefabs/Vehicles/Tracked";
export const MARDER = {
  id: "marder",
  label: "CIE Marder 1A3",
  workshopUrl: "https://reforger.armaplatform.com/workshop/6446DDF41914A293-CIEMarder1A3",
  dependencies: ["6446DDF41914A293"],
  vehicles: {
    MARDER_1A3: `{7D0A4C3F2E19B6A8}${P}/Marder_1A3.et`,
    // prefab file name contains SPACES — verbatim
    MARDER_1A3_NoSlat: `{3EB200BAC8871C85}${P}/Marder_1A3_DONT SLAT ARMOR.et`,
  },
  vehicleLabels: {
    MARDER_1A3: "Marder 1A3",
    MARDER_1A3_NoSlat: "Marder 1A3 (no slat armor)",
  },
  // Armed -> zone multiselect "Armed" group (one fit).
  patrolVehicleKeys: ["MARDER_1A3"],
  // No unarmed variant ships.
  transportVehicleKeys: [],
  // Both keys are the same armed IFV — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: ["MARDER_1A3", "MARDER_1A3_NoSlat"],
};
