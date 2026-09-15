// WCS FMTV — "WCS_FMTV" (65B60A48AEC31157) by Worst Case Scenario, v8.1.1 harvested 2026-09-10.
// Full provenance (refs, names, weapon slots, footprints, occupants): input/wcs-vehicles-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. 30 catalog entries = 10 distinct vehicles x livery variants;
// every livery is its own key so the spawn picker offers the camo choice (user
// decision 2026-09-10), while patrolVehicleKeys/transportVehicleKeys list ONE
// representative livery per vehicle so the zone multiselects stay short.
// armedVehicleKeys = every armed key (drives the picker's Armed/Unarmed chips).
// Source = the mod's Configs/EntityCatalog/<Faction>/Vehicles/WCS_FMTV.conf
// (catalog-driven rule; no m_bEnabled 0); labels = SCR_EditableVehicleUIInfo
// Name keys resolved via the mod's own Language/*.en_us.conf + a livery suffix.
// Deps: 65B60A48AEC31157 only — WCS_SpaceCore 5E389BB9F58B79A6 / WCS_Armaments
// 629B2BA37EFFD577 arrive transitively through the mod's gproj.
// vehicleSizeClass: "heavy" (layout.mjs regex extended for WCS_ keys).
export const WCS_FMTV = {
  id: "wcsfmtv",
  label: "WCS FMTV",
  workshopUrl: "https://reforger.armaplatform.com/workshop/65B60A48AEC31157-WCS_FMTV",
  dependencies: ["65B60A48AEC31157"],
  vehicles: {
    WCS_M1083_Transport: "{A0CB8452B09E992D}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport.et",
    WCS_M1083_Transport_Tan: "{50F6A20DD290B695}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Tan.et",
    WCS_M1083_Transport_Woodland: "{45117DD549207A77}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Woodland.et",
    WCS_M1083_Transport_Covered: "{D63E8CFB4CAA9B32}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Covered.et",
    WCS_M1083_Transport_Covered_Tan: "{601E2E6A55E48406}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Covered_Tan.et",
    WCS_M1083_Transport_Covered_Woodland: "{ACCF3C5D1629AF7F}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Covered_Woodland.et",
    WCS_M1083_Arsenal: "{F755CFD6C7ACD54B}Prefabs/Vehicles/Wheeled/M1083/M1083_Arsenal.et",
    WCS_M1083_Arsenal_Tan: "{DA803ABE69049F11}Prefabs/Vehicles/Wheeled/M1083/M1083_Arsenal_Tan.et",
    WCS_M1083_Arsenal_Woodland: "{D3C91DB25F8ADBC2}Prefabs/Vehicles/Wheeled/M1083/M1083_Arsenal_Woodland.et",
    WCS_M1083_Ammo: "{22C47D1CF796C4C3}Prefabs/Vehicles/Wheeled/M1083/M1083_Ammo.et",
    WCS_M1083_Ammo_Tan: "{C9A428975CC7C1C7}Prefabs/Vehicles/Wheeled/M1083/M1083_Ammo_Tan.et",
    WCS_M1083_Ammo_Woodland: "{74FE0C47872EEF57}Prefabs/Vehicles/Wheeled/M1083/M1083_Ammo_Woodland.et",
    WCS_M1083_Repair: "{2DC2AC00F7986CBD}Prefabs/Vehicles/Wheeled/M1083/M1083_Repair.et",
    WCS_M1083_Repair_Tan: "{83486836EF4CE160}Prefabs/Vehicles/Wheeled/M1083/M1083_Repair_Tan.et",
    WCS_M1083_Repair_Woodland: "{28E68108FB20CABA}Prefabs/Vehicles/Wheeled/M1083/M1083_Repair_Woodland.et",
    WCS_M1083_Engineer: "{8DF0C4823CB4224D}Prefabs/Vehicles/Wheeled/M1083/M1083_Engineer.et",
    WCS_M1083_Engineer_Tan: "{60D35A6E23462128}Prefabs/Vehicles/Wheeled/M1083/M1083_Engineer_Tan.et",
    WCS_M1083_Engineer_Woodland: "{41B161496B7F805D}Prefabs/Vehicles/Wheeled/M1083/M1083_Engineer_Woodland.et",
    WCS_M1091_Tanker: "{2C091881E27BE938}Prefabs/Vehicles/Wheeled/M1083/M1091_Tanker.et",
    WCS_M1091_Tanker_Tan: "{4F780C30D239F63C}Prefabs/Vehicles/Wheeled/M1083/M1091_Tanker_Tan.et",
    WCS_M1091_Tanker_Woodland: "{5B2C8B33EEEEF5E5}Prefabs/Vehicles/Wheeled/M1083/M1091_Tanker_Woodland.et",
    WCS_M1083_Command: "{DE1947A6D4DECD2C}Prefabs/Vehicles/Wheeled/M1083/M1083_Command.et",
    WCS_M1083_Command_Tan: "{888FFC71FC66385F}Prefabs/Vehicles/Wheeled/M1083/M1083_Command_Tan.et",
    WCS_M1083_Command_Woodland: "{E5D66B1A14745C24}Prefabs/Vehicles/Wheeled/M1083/M1083_Command_Woodland.et",
    WCS_M1083_Transport_Armed: "{BE134ED7F4CCB5B9}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Armed.et",
    WCS_M1083_Transport_Armed_Tan: "{EEF937341E143F0F}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Armed_Tan.et",
    WCS_M1083_Transport_Armed_Woodland: "{4630C86216C9197A}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Armed_Woodland.et",
    WCS_M1083_Transport_Covered_Armed: "{E2751F78ABD079B3}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Covered_Armed.et",
    WCS_M1083_Transport_Covered_Armed_Tan: "{5AB4A22570AD6B48}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Covered_Armed_Tan.et",
    WCS_M1083_Transport_Covered_Armed_Woodland: "{A815C3244E04D61A}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Covered_Armed_Woodland.et",
  },
  vehicleLabels: {
    WCS_M1083_Transport: "M1083A1P2 FMTV Transport Truck (Green)",
    WCS_M1083_Transport_Tan: "M1083A1P2 FMTV Transport Truck (Tan)",
    WCS_M1083_Transport_Woodland: "M1083A1P2 FMTV Transport Truck (Woodland)",
    WCS_M1083_Transport_Covered: "M1083A1P2 FMTV Covered Transport Truck (Green)",
    WCS_M1083_Transport_Covered_Tan: "M1083A1P2 FMTV Covered Transport Truck (Tan)",
    WCS_M1083_Transport_Covered_Woodland: "M1083A1P2 FMTV Covered Transport Truck (Woodland)",
    WCS_M1083_Arsenal: "M1083A1P2 FMTV Arsenal Truck (Green)",
    WCS_M1083_Arsenal_Tan: "M1083A1P2 FMTV Arsenal Truck (Tan)",
    WCS_M1083_Arsenal_Woodland: "M1083A1P2 FMTV Arsenal Truck (Woodland)",
    WCS_M1083_Ammo: "M1083A1P2 FMTV Ammunition Truck (Green)",
    WCS_M1083_Ammo_Tan: "M1083A1P2 FMTV Ammunition Truck (Tan)",
    WCS_M1083_Ammo_Woodland: "M1083A1P2 FMTV Ammunition Truck (Woodland)",
    WCS_M1083_Repair: "M1083A1P2 FMTV Repair Truck (Green)",
    WCS_M1083_Repair_Tan: "M1083A1P2 FMTV Repair Truck (Tan)",
    WCS_M1083_Repair_Woodland: "M1083A1P2 FMTV Repair Truck (Woodland)",
    WCS_M1083_Engineer: "M1083A1P2 FMTV Construction Truck (Green)",
    WCS_M1083_Engineer_Tan: "M1083A1P2 FMTV Construction Truck (Tan)",
    WCS_M1083_Engineer_Woodland: "M1083A1P2 FMTV Construction Truck (Woodland)",
    WCS_M1091_Tanker: "M1091A1P2 FMTV Fuel Truck (Green)",
    WCS_M1091_Tanker_Tan: "M1091A1P2 FMTV Fuel Truck (Tan)",
    WCS_M1091_Tanker_Woodland: "M1091A1P2 FMTV Fuel Truck (Woodland)",
    WCS_M1083_Command: "M1083A1P2 FMTV Command Truck (Green)",
    WCS_M1083_Command_Tan: "M1083A1P2 FMTV Command Truck (Tan)",
    WCS_M1083_Command_Woodland: "M1083A1P2 FMTV Command Truck (Woodland)",
    WCS_M1083_Transport_Armed: "M1083A1P2 FMTV Transport Truck (M2HB) (Green)",
    WCS_M1083_Transport_Armed_Tan: "M1083A1P2 FMTV Transport Truck (M2HB) (Tan)",
    WCS_M1083_Transport_Armed_Woodland: "M1083A1P2 FMTV Transport Truck (M2HB) (Woodland)",
    WCS_M1083_Transport_Covered_Armed: "M1083A1P2 FMTV Covered Transport Truck (M2HB) (Green)",
    WCS_M1083_Transport_Covered_Armed_Tan: "M1083A1P2 FMTV Covered Transport Truck (M2HB) (Tan)",
    WCS_M1083_Transport_Covered_Armed_Woodland: "M1083A1P2 FMTV Covered Transport Truck (M2HB) (Woodland)",
  },
  // Armed -> zone multiselect "Armed" group (one livery per vehicle).
  patrolVehicleKeys: [
    "WCS_M1083_Transport_Armed",
    "WCS_M1083_Transport_Covered_Armed",
  ],
  // Unarmed -> zone multiselect "Unarmed" group (one livery per vehicle).
  transportVehicleKeys: [
    "WCS_M1083_Transport",
    "WCS_M1083_Transport_Covered",
    "WCS_M1083_Arsenal",
    "WCS_M1083_Ammo",
    "WCS_M1083_Repair",
    "WCS_M1083_Engineer",
    "WCS_M1091_Tanker",
    "WCS_M1083_Command",
  ],
  // Every armed key (all liveries) — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: [
    "WCS_M1083_Transport_Armed",
    "WCS_M1083_Transport_Armed_Tan",
    "WCS_M1083_Transport_Armed_Woodland",
    "WCS_M1083_Transport_Covered_Armed",
    "WCS_M1083_Transport_Covered_Armed_Tan",
    "WCS_M1083_Transport_Covered_Armed_Woodland",
  ],
};
