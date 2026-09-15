// WCS MRZR — "WCS_MRZR" (64900A5A31F5DCB5) by Worst Case Scenario, v8.1.1 harvested 2026-09-10.
// Full provenance (refs, names, weapon slots, footprints, occupants): input/wcs-vehicles-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. 9 catalog entries = 5 distinct vehicles x livery variants;
// every livery is its own key so the spawn picker offers the camo choice (user
// decision 2026-09-10), while patrolVehicleKeys/transportVehicleKeys list ONE
// representative livery per vehicle so the zone multiselects stay short.
// armedVehicleKeys = every armed key (drives the picker's Armed/Unarmed chips).
// Source = the mod's Configs/EntityCatalog/<Faction>/Vehicles/WCS_MRZR.conf
// (catalog-driven rule; no m_bEnabled 0); labels = SCR_EditableVehicleUIInfo
// Name keys resolved via the mod's own Language/*.en_us.conf + a livery suffix.
// Deps: 64900A5A31F5DCB5 only — WCS_SpaceCore 5E389BB9F58B79A6 / WCS_Armaments
// 629B2BA37EFFD577 arrive transitively through the mod's gproj.
// vehicleSizeClass: "light" (default, fits the 4x6 m slot).
export const WCS_MRZR = {
  id: "wcsmrzr",
  label: "WCS MRZR",
  workshopUrl: "https://reforger.armaplatform.com/workshop/64900A5A31F5DCB5-WCS_MRZR",
  dependencies: ["64900A5A31F5DCB5"],
  vehicles: {
    WCS_MRZR_D4_Unarmed_Camo: "{AC8918B033DB356D}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Camo.et",
    WCS_MRZR_D4_Unarmed_Olive: "{DA7CF11F1BD23125}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Olive.et",
    WCS_MRZR_D4_Unarmed_Tan: "{B83B4C8BE05C9554}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Tan.et",
    WCS_MRZR_D4_M2HB_Camo: "{D5BC187ABE85A153}Prefabs/Vehicles/Wheeled/MRZR/M2HB/MRZR_D4_M2HB_Camo.et",
    WCS_MRZR_D4_M2HB_Olive: "{497CF28714CD35CB}Prefabs/Vehicles/Wheeled/MRZR/M2HB/MRZR_D4_M2HB_Olive.et",
    WCS_MRZR_D4_M2HB_Tan: "{8D59697F5C0A6DFC}Prefabs/Vehicles/Wheeled/MRZR/M2HB/MRZR_D4_M2HB_Tan.et",
    WCS_MRZR_D4_Unarmed_Black: "{D768882A4BA33526}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Black.et",
    WCS_MRZR_D4_NSV_Black: "{C63657059F3EF831}Prefabs/Vehicles/Wheeled/MRZR/NSV/MRZR_D4_NSV_Black.et",
    WCS_MRZR_D4_NSV_SPP_Black: "{74C20AC5FE868229}Prefabs/Vehicles/Wheeled/MRZR/NSV/MRZR_D4_NSV_SPP_Black.et",
  },
  vehicleLabels: {
    WCS_MRZR_D4_Unarmed_Camo: "MRZR D4 (Camo)",
    WCS_MRZR_D4_Unarmed_Olive: "MRZR D4 (Olive)",
    WCS_MRZR_D4_Unarmed_Tan: "MRZR D4 (Tan)",
    WCS_MRZR_D4_M2HB_Camo: "MRZR D4 - M2HB (Camo)",
    WCS_MRZR_D4_M2HB_Olive: "MRZR D4 - M2HB (Olive)",
    WCS_MRZR_D4_M2HB_Tan: "MRZR D4 - M2HB (Tan)",
    WCS_MRZR_D4_Unarmed_Black: "MRZR D4 (Black)",
    WCS_MRZR_D4_NSV_Black: "MRZR D4 - NSV (Black)",
    WCS_MRZR_D4_NSV_SPP_Black: "MRZR D4 - NSV (SPP) (Black)",
  },
  // Armed -> zone multiselect "Armed" group (one livery per vehicle).
  patrolVehicleKeys: [
    "WCS_MRZR_D4_M2HB_Olive",
    "WCS_MRZR_D4_NSV_Black",
    "WCS_MRZR_D4_NSV_SPP_Black",
  ],
  // Unarmed -> zone multiselect "Unarmed" group (one livery per vehicle).
  transportVehicleKeys: [
    "WCS_MRZR_D4_Unarmed_Olive",
    "WCS_MRZR_D4_Unarmed_Black",
  ],
  // Every armed key (all liveries) — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: [
    "WCS_MRZR_D4_M2HB_Camo",
    "WCS_MRZR_D4_M2HB_Olive",
    "WCS_MRZR_D4_M2HB_Tan",
    "WCS_MRZR_D4_NSV_Black",
    "WCS_MRZR_D4_NSV_SPP_Black",
  ],
};
