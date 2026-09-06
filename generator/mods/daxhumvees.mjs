// Dax Humvees — "Dax Humvees" (62DA2C805FEB90A1), v1.3.21 harvested 2026-09-06.
// Full provenance: input/dax-humvees-harvest.md.
//
// FIRST VEHICLE MOD — the side-agnostic pool-contributor pattern (design
// settled 2026-08-09): NOT a faction, no faction-eligibility gating. The 14
// vehicles join the player spawn-vehicle picker and the per-zone mounted-
// patrol / vehicle-QRF multiselects (under a "Modded vehicles"-style group)
// for EVERY mission side; the deliver/destroy objective pools pick them up
// too. Deps are usage-derived: the addon GUID joins addon.gproj only when a
// mission actually places one of these vehicles (lib.mjs).
//
// Harvest source = the mod's own Configs/EntityCatalog/US/
// Vehicles_EntityCatalog_US.conf (14 entries, catalog-driven rule); labels =
// each prefab's SCR_EditableVehicleComponent m_UIInfo Name (literal strings,
// no localization keys). Prefab-side cross-check: the catalog GUIDs for
// "M1025 31" / "M998 01" are referenced from other prefabs in the extraction
// (DUKE variants parent M1025 31), no GUID conflicts found. Paths contain
// SPACES — verbatim, never normalize.
//
// All vehicles are HMMWV-chassis ground cars -> vehicleSizeClass default
// "light" is correct for every key (no layout changes needed).
//
// Armament (chain-walked through the roof/gun-mount part prefabs):
//  - (M2) variants + M998 02 -> M2HB pintle; VANILLA 12.7x99 ammo boxes (the
//    mod only overrides the vanilla Box_127x99_M2_100rnd_Base to tag it
//    CommonItemType MG_AMMO for its DAX_TurretAmmoRackComponent reload system,
//    and wraps the vanilla pintle M2 in its own weapon prefab for storage
//    integration — no ballistics/magazine changes).
//  - (M60) variants -> mod's own MG_M60_Mounted whose MagazineTemplate is the
//    mod's OWN 200rnd 7.62x51 box (vanilla ships only 100/500rnd); it parents
//    the vanilla 100rnd base, so projectiles/ballistics stay vanilla.
//  - DUKE variants (13/23/33) -> ECM antennas, roof replaces the gun mount:
//    unarmed. M998 01 Platoon / M1025 03 Mortar (deployable M252 as cargo) /
//    M998 04 Engi (M60 ammo rack slot but Enabled 0, no weapon) / M997 41
//    Medic: unarmed.
const P_DAX = "Prefabs/Vehicles/Wheeled/M998/Green";
export const DAXHUMVEES = {
  id: "daxhumvees",
  label: "Dax Humvees",
  workshopUrl: "https://reforger.armaplatform.com/workshop/62DA2C805FEB90A1-DaxHumvees",
  dependencies: ["62DA2C805FEB90A1"],
  vehicles: {
    DAX_M1025_11: `{415275140FE2DEC5}${P_DAX}/M1025 11.et`,
    DAX_M1025_12: `{D84CCC8D1205EF55}${P_DAX}/M1025 12s.et`,
    DAX_M1025_13: `{D4D049F526336C43}${P_DAX}/M1025 13.et`,
    DAX_M1025_21: `{C40688758BF54596}${P_DAX}/M1025 21.et`,
    DAX_M1025_22: `{A852BC953731CAB8}${P_DAX}/M1025 22.et`,
    DAX_M1025_23: `{4DCEF06C3BD45DD3}${P_DAX}/M1025 23.et`,
    DAX_M1025_31: `{30FD13597422B058}${P_DAX}/M1025 31.et`,
    DAX_M1025_32: `{9CDE8DE3443A54CB}${P_DAX}/M1025 32.et`,
    DAX_M1025_33: `{CD74E757AEF78682}${P_DAX}/M1025 33.et`,
    DAX_M998_01: `{238759D0C0F71442}${P_DAX}/M998 01.et`,
    DAX_M998_02: `{BAF3973B1161C284}${P_DAX}/M998 02.et`,
    DAX_M1025_MORTAR_03: `{630CFE1EC11416F3}${P_DAX}/M1025 Mortar03.et`,
    DAX_M998_04_ENGI: `{AFD2DC77C3A339F1}${P_DAX}/M998 04 Engi.et`,
    DAX_M997_MEDIC: `{1D657F3885DEDA18}${P_DAX}/M997_medic.et`,
  },
  vehicleLabels: {
    DAX_M1025_11: "M1025 11 (M2)",
    DAX_M1025_12: "M1025 12 (M60)",
    DAX_M1025_13: "M1025 13 (DUKE)",
    DAX_M1025_21: "M1025 21 (M2)",
    DAX_M1025_22: "M1025 22 (M60)",
    DAX_M1025_23: "M1025 23 (DUKE)",
    DAX_M1025_31: "M1025 31 (M2)",
    DAX_M1025_32: "M1025 32 (M60)",
    DAX_M1025_33: "M1025 33 (DUKE)",
    DAX_M998_01: "M998 01 Platoon",
    DAX_M998_02: "M998 02 Platoon (M2)",
    DAX_M1025_MORTAR_03: "M1025 03 Mortar",
    DAX_M998_04_ENGI: "M998 04 Engi",
    DAX_M997_MEDIC: "M997 41 Medic",
  },
  // Armed -> the zone multiselect's "Armed" group; unarmed -> "Unarmed".
  patrolVehicleKeys: [
    "DAX_M1025_11",
    "DAX_M1025_12",
    "DAX_M1025_21",
    "DAX_M1025_22",
    "DAX_M1025_31",
    "DAX_M1025_32",
    "DAX_M998_02",
  ],
  transportVehicleKeys: [
    "DAX_M1025_13",
    "DAX_M1025_23",
    "DAX_M1025_33",
    "DAX_M998_01",
    "DAX_M1025_MORTAR_03",
    "DAX_M998_04_ENGI",
    "DAX_M997_MEDIC",
  ],
};
