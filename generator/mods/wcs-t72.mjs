// WCS T-72 — "WCS_T-72" (5E0AB16BEB16D6A4) by Worst Case Scenario, v8.2.1 harvested 2026-09-22.
// Full provenance (refs, names, weapon slots, footprints, occupants): input/wcs-vehicles-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. The second WCS batch's first mod: 6 catalog entries = 2 distinct
// vehicles (T-72A, T-72B with Kontakt-1 ERA) x 3 liveries (Green base, Desert,
// FIA); every livery is its own key so the spawn picker offers the camo choice
// (livery rule 2026-09-10), while patrolVehicleKeys lists ONE representative
// livery per vehicle so the zone multiselects stay short.
// armedVehicleKeys = every key (drives the picker's Armed/Unarmed chips).
// Source = the mod's Configs/EntityCatalog/USSR/Vehicles/WCS_T72.conf (4
// USSR entries, appended to the vanilla USSR vehicle catalog via a clean
// override) + its Vehicles_EntityCatalog_FIA.conf override (the 2 FIA
// liveries, FIA crew default) — catalog-driven rule, no m_bEnabled 0; labels =
// SCR_EditableVehicleUIInfo Name keys resolved via the mod's own
// Language/wcs_t72_localization.en_us.conf + a livery suffix (RU table = EN copy).
// Armed: 2A46 125 mm (APFSDS + HE-FRAG feeds; the T-72B adds HEAT-FS) +
// coaxial PKT + NSV 12.7 mm commander cupola on both marks.
// Deps: 5E0AB16BEB16D6A4 only — WCS_SpaceCore 5E389BB9F58B79A6 / WCS_Armaments
// 629B2BA37EFFD577 arrive transitively through the mod's gproj (both moved to
// 8.2.1 with this download; the 8.1.x WCS mods still load against them).
// vehicleSizeClass: "heavy" — hull xob 3.6 x 6.8 m (layout.mjs regex: WCS_T72).
const P = "Prefabs/Vehicles/Tracked";
export const WCS_T72 = {
  id: "wcst72",
  label: "WCS T-72",
  workshopUrl: "https://reforger.armaplatform.com/workshop/5E0AB16BEB16D6A4-WCS_T-72",
  dependencies: ["5E0AB16BEB16D6A4"],
  vehicles: {
    WCS_T72A_Base: `{BC07885176C7FF8A}${P}/T72A/T72A_Base.et`,
    WCS_T72A_Desert: `{AF1C02364D45CC5B}${P}/T72A/T72A_Desert.et`,
    WCS_T72A_FIA: `{2B9DB09AC8BEA673}${P}/T72A/T72A_FIA.et`,
    WCS_T72B_Base: `{726286E1F9570EA1}${P}/T72B/T72B_Base.et`,
    WCS_T72B_Desert: `{0154275FD6AE2370}${P}/T72B/T72B_Desert.et`,
    WCS_T72B_FIA: `{D9EB40D7AD0966EC}${P}/T72B/T72B_FIA.et`,
  },
  vehicleLabels: {
    WCS_T72A_Base: "T-72A Main Battle Tank (Green)",
    WCS_T72A_Desert: "T-72A Main Battle Tank (Desert)",
    WCS_T72A_FIA: "T-72A Main Battle Tank (FIA)",
    WCS_T72B_Base: "T-72B Main Battle Tank (Green)",
    WCS_T72B_Desert: "T-72B Main Battle Tank (Desert)",
    WCS_T72B_FIA: "T-72B Main Battle Tank (FIA)",
  },
  // Armed -> zone multiselect "Armed" group (one livery per vehicle).
  patrolVehicleKeys: ["WCS_T72A_Base", "WCS_T72B_Base"],
  // No unarmed variant ships.
  transportVehicleKeys: [],
  // Every key is an armed MBT — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: ["WCS_T72A_Base", "WCS_T72A_Desert", "WCS_T72A_FIA", "WCS_T72B_Base", "WCS_T72B_Desert", "WCS_T72B_FIA"],
};
