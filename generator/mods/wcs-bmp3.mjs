// WCS BMP-3 — "WCS_BMP-3" (5B383D4CB27E0D54) by Worst Case Scenario, v8.1.1 harvested 2026-09-10.
// Full provenance (refs, names, weapon slots, footprints, occupants): input/wcs-vehicles-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. 1 catalog entries = 1 distinct vehicles x livery variants;
// every livery is its own key so the spawn picker offers the camo choice (user
// decision 2026-09-10), while patrolVehicleKeys/transportVehicleKeys list ONE
// representative livery per vehicle so the zone multiselects stay short.
// armedVehicleKeys = every armed key (drives the picker's Armed/Unarmed chips).
// Source = the mod's Configs/EntityCatalog/<Faction>/Vehicles/WCS_BMP-3.conf
// (catalog-driven rule; no m_bEnabled 0); labels = SCR_EditableVehicleUIInfo
// Name keys resolved via the mod's own Language/*.en_us.conf + a livery suffix.
// Deps: 5B383D4CB27E0D54 only — WCS_SpaceCore 5E389BB9F58B79A6 / WCS_Armaments
// 629B2BA37EFFD577 arrive transitively through the mod's gproj.
// vehicleSizeClass: "heavy" (layout.mjs regex extended for WCS_ keys).
export const WCS_BMP3 = {
  id: "wcsbmp3",
  label: "WCS BMP-3",
  workshopUrl: "https://reforger.armaplatform.com/workshop/5B383D4CB27E0D54-WCS_BMP-3",
  dependencies: ["5B383D4CB27E0D54"],
  vehicles: {
    WCS_BMP3_Base: "{1BE270891F0F3772}Prefabs/Vehicles/Tracked/BMP3/BMP3_Base.et",
  },
  vehicleLabels: {
    WCS_BMP3_Base: "BMP-3 IFV (Green)",
  },
  // Armed -> zone multiselect "Armed" group (one livery per vehicle).
  patrolVehicleKeys: [
    "WCS_BMP3_Base",
  ],
  // Unarmed -> zone multiselect "Unarmed" group (one livery per vehicle).
  transportVehicleKeys: [

  ],
  // Every armed key (all liveries) — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: [
    "WCS_BMP3_Base",
  ],
};
