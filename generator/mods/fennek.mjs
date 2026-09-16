// Fennek — "Fennek" (631D7B00C9DC049E), v1.0.81 harvested 2026-09-16.
// Full provenance (refs, names, weapon slots, footprint, occupants, the
// excluded Dutch/SWAT/police variants): input/fennek-marder-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. Companion to the Bundeswehr faction (BWAR): the mod ships 16
// catalog entries but only the GERMAN cut is integrated (user decision
// 2026-09-16: no Dutch camo, no SWAT/Gendarmerie police variants, no rocket
// "Howler"/"RP" fantasy turrets) = 6 keys: 3 turret fits ("7.62" MG / ".50cal"
// M2HB / unarmed "Scout" camera mast) x 2 liveries ("German MCR" = the black
// MCR-fit German scheme, "Tan" = desert — kept because it is neither Dutch nor
// SWAT and pairs with the BWAR Tropentarn subfaction).
// Source = the mod's Configs/EntityCatalog/US/Vehicles_EntityCatalog_US.conf
// (catalog-driven rule; all 16 appended to the vanilla US vehicle catalog);
// labels = each prefab's SCR_EditableVehicleUIInfo Name (LITERAL strings, no
// localization keys — kept verbatim like Dax). Prefab-side cross-check: the
// two base GUIDs (FennekMCR / FennekTan) are parents of their 50cal/scout
// children; the four leaf GUIDs are placed in the mod's own
// worlds/real_world_Layers/default.layer — all corroborated.
// Armed: "7.62" turret = the mod's Fennek_MG ("HAVOC" UI name, KPVT-mesh MG
// feeding the mod's own 7.62x51 "Fennek Box"); ".50cal" = Fennek50 (M2HB
// body, VANILLA 12.7x99 100rnd box); "Scout" = a camera.et dummy weapon in the
// gun slot (9x19 bullet mesh, no magazine/ammo) -> unarmed observation mast.
// Deps: 631D7B00C9DC049E only (gproj deps = base game).
// vehicleSizeClass: "light" — hull xob 2.8 x 5.7 m fits the 4 x 6 m slot.
// Default occupant on the turret seat = vanilla USSR Rifleman (author
// copy-paste from the BTR-70 turret) — irrelevant, lib.mjs always emits
// m_aCrewPrefabPool.
const P = "Prefabs/Vehicles/Core";
export const FENNEK = {
  id: "fennek",
  label: "Fennek",
  workshopUrl: "https://reforger.armaplatform.com/workshop/631D7B00C9DC049E-Fennek",
  dependencies: ["631D7B00C9DC049E"],
  vehicles: {
    FENNEK_MCR: `{0AE039AE6565558D}${P}/FennekMCR.et`,
    FENNEK_MCR_50cal: `{1CF79784767B4C00}${P}/FennekMCR50call.et`,
    FENNEK_MCR_Scout: `{CD679552045A8605}${P}/FennekMCRscout.et`,
    FENNEK_Tan: `{968CB20CFBF7DA9B}${P}/FennekTan.et`,
    FENNEK_Tan_50cal: `{B7F9DE8692FCD8C9}${P}/FennekTan50call.et`,
    FENNEK_Tan_Scout: `{DF2F47A02E7D3479}${P}/Fennektanscout.et`,
  },
  vehicleLabels: {
    FENNEK_MCR: "Fennek 7.62 German MCR",
    FENNEK_MCR_50cal: "Fennek .50cal German MCR",
    FENNEK_MCR_Scout: "Fennek Scout German MCR",
    FENNEK_Tan: "Fennek 7.62 Tan",
    FENNEK_Tan_50cal: "Fennek .50cal Tan",
    FENNEK_Tan_Scout: "Fennek Scout Tan",
  },
  // Armed -> zone multiselect "Armed" group (one livery per turret fit).
  patrolVehicleKeys: ["FENNEK_MCR", "FENNEK_MCR_50cal"],
  // Unarmed -> zone multiselect "Unarmed" group (one livery).
  transportVehicleKeys: ["FENNEK_MCR_Scout"],
  // Every armed key (both liveries) — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: ["FENNEK_MCR", "FENNEK_MCR_50cal", "FENNEK_Tan", "FENNEK_Tan_50cal"],
};
