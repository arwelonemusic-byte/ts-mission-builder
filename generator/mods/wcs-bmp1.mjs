// WCS BMP-1 — "WCS_BMP-1" (5E524E4FEECCA92B) by Worst Case Scenario, v8.1.1 harvested 2026-09-10.
// Full provenance (refs, names, weapon slots, footprints, occupants): input/wcs-vehicles-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. 8 catalog entries = 4 distinct vehicles x livery variants;
// every livery is its own key so the spawn picker offers the camo choice (user
// decision 2026-09-10), while patrolVehicleKeys/transportVehicleKeys list ONE
// representative livery per vehicle so the zone multiselects stay short.
// armedVehicleKeys = every armed key (drives the picker's Armed/Unarmed chips).
// Source = the mod's Configs/EntityCatalog/<Faction>/Vehicles/WCS_BMP-1.conf
// (catalog-driven rule; no m_bEnabled 0); labels = SCR_EditableVehicleUIInfo
// Name keys resolved via the mod's own Language/*.en_us.conf + a livery suffix.
// Deps: 5E524E4FEECCA92B only — WCS_SpaceCore 5E389BB9F58B79A6 / WCS_Armaments
// 629B2BA37EFFD577 arrive transitively through the mod's gproj.
// vehicleSizeClass: "heavy" (layout.mjs regex extended for WCS_ keys).
export const WCS_BMP1 = {
  id: "wcsbmp1",
  // HIDDEN 2026-09-15 (user playtest: the mod is bugged in-game). Registry +
  // --wcs spike keep working; MissionPanel skips the checkbox and migrate()
  // strips the id + every BMP-1 vehicle from saves. Flip to false once the
  // author fixes it (re-audit first: /addon-audit wcsbmp1).
  hidden: true,
  label: "WCS BMP-1",
  workshopUrl: "https://reforger.armaplatform.com/workshop/5E524E4FEECCA92B-WCS_BMP-1",
  dependencies: ["5E524E4FEECCA92B"],
  vehicles: {
    WCS_BMP1_FIA: "{0144F571F1998FC4}Prefabs/Vehicles/Tracked/BMP1/BMP1_FIA.et",
    WCS_BMP1_FIA_Desert: "{C3CD1D637852C785}Prefabs/Vehicles/Tracked/BMP1/BMP1_FIA_Desert.et",
    WCS_BMP1P_FIA: "{BF0050432603DD9E}Prefabs/Vehicles/Tracked/BMP1/BMP1P_FIA.et",
    WCS_BMP1P_FIA_Desert: "{828E8711567C3242}Prefabs/Vehicles/Tracked/BMP1/BMP1P_FIA_Desert.et",
    WCS_BMP1_Base: "{1DC01AAACFFA8B63}Prefabs/Vehicles/Tracked/BMP1/BMP1_Base.et",
    WCS_BMP1_Desert: "{68A65EFA9B616798}Prefabs/Vehicles/Tracked/BMP1/BMP1_Desert.et",
    WCS_BMP1P_Base: "{3868E03D9A4AF186}Prefabs/Vehicles/Tracked/BMP1/BMP1P_Base.et",
    WCS_BMP1P_Desert: "{C334AD811A3BFFFC}Prefabs/Vehicles/Tracked/BMP1/BMP1P_Desert.et",
  },
  vehicleLabels: {
    WCS_BMP1_FIA: "BMP-1 IFV (FIA, Green)",
    WCS_BMP1_FIA_Desert: "BMP-1 IFV (FIA, Desert)",
    WCS_BMP1P_FIA: "BMP-1P IFV (FIA, Green)",
    WCS_BMP1P_FIA_Desert: "BMP-1P IFV (FIA, Desert)",
    WCS_BMP1_Base: "BMP-1 IFV (Green)",
    WCS_BMP1_Desert: "BMP-1 IFV (Desert)",
    WCS_BMP1P_Base: "BMP-1P IFV (Green)",
    WCS_BMP1P_Desert: "BMP-1P IFV (Desert)",
  },
  // Armed -> zone multiselect "Armed" group (one livery per vehicle).
  patrolVehicleKeys: [
    "WCS_BMP1_Base",
    "WCS_BMP1P_Base",
  ],
  // Unarmed -> zone multiselect "Unarmed" group (one livery per vehicle).
  transportVehicleKeys: [

  ],
  // Every armed key (all liveries) — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: [
    "WCS_BMP1_FIA",
    "WCS_BMP1_FIA_Desert",
    "WCS_BMP1P_FIA",
    "WCS_BMP1P_FIA_Desert",
    "WCS_BMP1_Base",
    "WCS_BMP1_Desert",
    "WCS_BMP1P_Base",
    "WCS_BMP1P_Desert",
  ],
};
