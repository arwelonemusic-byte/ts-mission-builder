// WCS Stryker — "WCS_Stryker" (5B02128D896F7DE8) by Worst Case Scenario, v8.1.0 harvested 2026-09-10.
// Full provenance (refs, names, weapon slots, footprints, occupants): input/wcs-vehicles-harvest.md.
//
// VEHICLE MOD (side-agnostic pool contributor, Dax Humvees pattern) — NOT a
// faction. 24 catalog entries = 8 distinct vehicles x livery variants;
// every livery is its own key so the spawn picker offers the camo choice (user
// decision 2026-09-10), while patrolVehicleKeys/transportVehicleKeys list ONE
// representative livery per vehicle so the zone multiselects stay short.
// armedVehicleKeys = every armed key (drives the picker's Armed/Unarmed chips).
// Source = the mod's Configs/EntityCatalog/<Faction>/Vehicles/WCS_Stryker.conf
// (catalog-driven rule; no m_bEnabled 0); labels = SCR_EditableVehicleUIInfo
// Name keys resolved via the mod's own Language/*.en_us.conf + a livery suffix.
// Deps: 5B02128D896F7DE8 only — WCS_SpaceCore 5E389BB9F58B79A6 / WCS_Armaments
// 629B2BA37EFFD577 arrive transitively through the mod's gproj.
// vehicleSizeClass: "heavy" (layout.mjs regex extended for WCS_ keys).
export const WCS_STRYKER = {
  id: "wcsstryker",
  label: "WCS Stryker",
  workshopUrl: "https://reforger.armaplatform.com/workshop/5B02128D896F7DE8-WCS_Stryker",
  dependencies: ["5B02128D896F7DE8"],
  vehicles: {
    WCS_Stryker_APC: "{249A75FB99B24A57}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_APC.et",
    WCS_Stryker_APC_MERDC: "{F2307260A1B40F43}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_APC_MERDC.et",
    WCS_Stryker_APC_Tan: "{2551B455EA37BFD8}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_APC_Tan.et",
    WCS_Stryker_Cage: "{7A561BEDC287CC52}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_Cage.et",
    WCS_Stryker_Cage_MERDC: "{E80BE5CFA7FFB275}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_Cage_MERDC.et",
    WCS_Stryker_Cage_Tan: "{5FF95B515AAAD92F}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_Cage_Tan.et",
    WCS_Stryker_CROWS: "{E3DD72FD06BA2320}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS.et",
    WCS_Stryker_CROWS_MERDC: "{73C1BB5B830C9F05}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_MERDC.et",
    WCS_Stryker_CROWS_Tan: "{65A1EB5BC8449FD3}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Tan.et",
    WCS_Stryker_CROWS_Cage: "{5F17F054025E8B30}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Cage.et",
    WCS_Stryker_CROWS_Cage_MERDC: "{094A1ECBEE1D9AD1}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Cage_MERDC.et",
    WCS_Stryker_CROWS_Cage_Tan: "{46A5E64726FCE76B}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Cage_Tan.et",
    WCS_Stryker_CROWS_Javelin: "{91325B8E3EE8E4DD}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Javelin/Stryker_CROWS_Javelin.et",
    WCS_Stryker_CROWS_Javelin_MERDC: "{2AFBAB30EC3850F1}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Javelin/Stryker_CROWS_Javelin_MERDC.et",
    WCS_Stryker_CROWS_Javelin_Tan: "{B47F060F2339FF28}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Javelin/Stryker_CROWS_Javelin_Tan.et",
    WCS_Stryker_Dragoon: "{45DDFA40E1CB6B82}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon.et",
    WCS_Stryker_Dragoon_MERDC: "{D5BECC338A58208D}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_MERDC.et",
    WCS_Stryker_Dragoon_Cage: "{44E2468321E19451}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Cage.et",
    WCS_Stryker_Dragoon_Cage_MERDC: "{F1E9603C6635BE0F}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Cage_MERDC.et",
    WCS_Stryker_Dragoon_Tan: "{4864299FF517BF20}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Tan.et",
    WCS_Stryker_Dragoon_Cage_Tan: "{B139673755B7015E}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Cage_Tan.et",
    WCS_Stryker_MGS: "{A6783FAA5D516D68}Prefabs/Vehicles/Wheeled/Stryker/M1128/Stryker_MGS.et",
    WCS_Stryker_MGS_MERDC: "{A76DCC7AD6494682}Prefabs/Vehicles/Wheeled/Stryker/M1128/Stryker_MGS_MERDC.et",
    WCS_Stryker_MGS_Tan: "{533DA733380D5E55}Prefabs/Vehicles/Wheeled/Stryker/M1128/Stryker_MGS_Tan.et",
  },
  vehicleLabels: {
    WCS_Stryker_APC: "M1126 Stryker ICV (Green)",
    WCS_Stryker_APC_MERDC: "M1126 Stryker ICV (MERDC)",
    WCS_Stryker_APC_Tan: "M1126 Stryker ICV (Tan)",
    WCS_Stryker_Cage: "M1126 Stryker ICV - Slat Armor (Green)",
    WCS_Stryker_Cage_MERDC: "M1126 Stryker ICV - Slat Armor (MERDC)",
    WCS_Stryker_Cage_Tan: "M1126 Stryker ICV - Slat Armor (Tan)",
    WCS_Stryker_CROWS: "M1126 Stryker ICV - CROWS (M2HB) (Green)",
    WCS_Stryker_CROWS_MERDC: "M1126 Stryker ICV - CROWS (M2HB) (MERDC)",
    WCS_Stryker_CROWS_Tan: "M1126 Stryker ICV - CROWS (M2HB) (Tan)",
    WCS_Stryker_CROWS_Cage: "M1126 Stryker ICV - CROWS (M2HB) - Slat Armor (Green)",
    WCS_Stryker_CROWS_Cage_MERDC: "M1126 Stryker ICV - CROWS (M2HB) - Slat Armor (MERDC)",
    WCS_Stryker_CROWS_Cage_Tan: "M1126 Stryker ICV - CROWS (M2HB) - Slat Armor (Tan)",
    WCS_Stryker_CROWS_Javelin: "M1126 Stryker ICV - CROWS-J (M2HB/FGM-148) - Slat Armor (Green)",
    WCS_Stryker_CROWS_Javelin_MERDC: "M1126 Stryker ICV - CROWS-J (M2HB/FGM-148) - Slat Armor (MERDC)",
    WCS_Stryker_CROWS_Javelin_Tan: "M1126 Stryker ICV - CROWS-J (M2HB/FGM-148) - Slat Armor (Tan)",
    WCS_Stryker_Dragoon: "M1296 Stryker Dragoon (Green)",
    WCS_Stryker_Dragoon_MERDC: "M1296 Stryker Dragoon (MERDC)",
    WCS_Stryker_Dragoon_Cage: "M1296 Stryker Dragoon - Slat Armor (Green)",
    WCS_Stryker_Dragoon_Cage_MERDC: "M1296 Stryker Dragoon - Slat Armor (MERDC)",
    WCS_Stryker_Dragoon_Tan: "M1296 Stryker Dragoon (Tan)",
    WCS_Stryker_Dragoon_Cage_Tan: "M1296 Stryker Dragoon - Slat Armor (Tan)",
    WCS_Stryker_MGS: "M1128 Stryker MGS (Green)",
    WCS_Stryker_MGS_MERDC: "M1128 Stryker MGS (MERDC)",
    WCS_Stryker_MGS_Tan: "M1128 Stryker MGS (Tan)",
  },
  // Armed -> zone multiselect "Armed" group (one livery per vehicle).
  patrolVehicleKeys: [
    "WCS_Stryker_CROWS",
    "WCS_Stryker_CROWS_Cage",
    "WCS_Stryker_CROWS_Javelin",
    "WCS_Stryker_Dragoon",
    "WCS_Stryker_Dragoon_Cage",
    "WCS_Stryker_MGS",
  ],
  // Unarmed -> zone multiselect "Unarmed" group (one livery per vehicle).
  transportVehicleKeys: [
    "WCS_Stryker_APC",
    "WCS_Stryker_Cage",
  ],
  // Every armed key (all liveries) — spawn picker Armed/Unarmed classification.
  armedVehicleKeys: [
    "WCS_Stryker_CROWS",
    "WCS_Stryker_CROWS_MERDC",
    "WCS_Stryker_CROWS_Tan",
    "WCS_Stryker_CROWS_Cage",
    "WCS_Stryker_CROWS_Cage_MERDC",
    "WCS_Stryker_CROWS_Cage_Tan",
    "WCS_Stryker_CROWS_Javelin",
    "WCS_Stryker_CROWS_Javelin_MERDC",
    "WCS_Stryker_CROWS_Javelin_Tan",
    "WCS_Stryker_Dragoon",
    "WCS_Stryker_Dragoon_MERDC",
    "WCS_Stryker_Dragoon_Cage",
    "WCS_Stryker_Dragoon_Cage_MERDC",
    "WCS_Stryker_Dragoon_Tan",
    "WCS_Stryker_Dragoon_Cage_Tan",
    "WCS_Stryker_MGS",
    "WCS_Stryker_MGS_MERDC",
    "WCS_Stryker_MGS_Tan",
  ],
};
