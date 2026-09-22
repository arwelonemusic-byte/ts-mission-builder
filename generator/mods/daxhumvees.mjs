// Dax Humvees — "Dax Humvees" (62DA2C805FEB90A1), v1.3.21 harvested 2026-09-06,
// tan twins added from v1.3.23 on 2026-09-22 (/addon-audit).
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
// TAN twins (v1.3.23, 2026-09-22): the author enabled the 14 tan liveries the
// 1.3.21 workshop page listed as "[TAN currently disabled]" — 14 new US
// catalog entries in Prefabs/Vehicles/Wheeled/M998/Tan/, each a CHILD of its
// green twin (materials + tan roof/mount parts that parent the green parts,
// so the armament is identical). Keys = green key + "_TAN", labels = the
// literal authored Names ("M1025 11 (M2) Tan"). Thumbs = the DH-_0000s
// preview set (the 13T prefab's own m_Image points at the 33 render — author
// bug — so its thumb is mapped by hand to DH-_0000s_0011_13). Catalog-only
// GUIDs (top-level leaves, nothing references them) — Workbench-validated.
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
const P_TAN = "Prefabs/Vehicles/Wheeled/M998/Tan";
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
    DAX_M1025_11_TAN: `{415275140FE2DEC6}${P_TAN}/M1025 11T.et`,
    DAX_M1025_12_TAN: `{D84CCC8D1205EF56}${P_TAN}/M1025 12T.et`,
    DAX_M1025_13_TAN: `{AF46A405E6A70025}${P_TAN}/M1025 13T.et`,
    DAX_M1025_21_TAN: `{1FBA5C57B06F50CA}${P_TAN}/M1025 21T.et`,
    DAX_M1025_22_TAN: `{86A4E5CEAD88615A}${P_TAN}/M1025 22T.et`,
    DAX_M1025_23_TAN: `{F1AE8D46592A8E2A}${P_TAN}/M1025 23T.et`,
    DAX_M1025_31_TAN: `{EBB21BCFBDB238BE}${P_TAN}/M1025 31T.et`,
    DAX_M1025_32_TAN: `{72ACA256A055092E}${P_TAN}/M1025 32T.et`,
    DAX_M1025_33_TAN: `{05A6CADE54F7E65E}${P_TAN}/M1025 33T.et`,
    DAX_M998_01_TAN: `{23ED2EA20C86F313}${P_TAN}/M998 01T.et`,
    DAX_M998_02_TAN: `{BAF3973B1161C283}${P_TAN}/M998 02T.et`,
    DAX_M1025_MORTAR_03_TAN: `{14B2A1F78A0C5979}${P_TAN}/M1025 Mortar03T.et`,
    DAX_M998_04_ENGI_TAN: `{88E64343CB079F30}${P_TAN}/M998 04 EngiT.et`,
    DAX_M997_MEDIC_TAN: `{3D79A5BF36C22A3F}${P_TAN}/M997_medicT.et`,
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
    DAX_M1025_11_TAN: "M1025 11 (M2) Tan",
    DAX_M1025_12_TAN: "M1025 12 (M60) Tan",
    DAX_M1025_13_TAN: "M1025 13 (DUKE) Tan",
    DAX_M1025_21_TAN: "M1025 21 (M2) Tan",
    DAX_M1025_22_TAN: "M1025 22 (M60) Tan",
    DAX_M1025_23_TAN: "M1025 23 (DUKE) Tan",
    DAX_M1025_31_TAN: "M1025 31 (M2) Tan",
    DAX_M1025_32_TAN: "M1025 32 (M60) Tan",
    DAX_M1025_33_TAN: "M1025 33 (DUKE) Tan",
    DAX_M998_01_TAN: "M998 01 Platoon Tan",
    DAX_M998_02_TAN: "M998 02 Platoon (M2) Tan",
    DAX_M1025_MORTAR_03_TAN: "M1025 03 Mortar Tan",
    DAX_M998_04_ENGI_TAN: "M998 04 Engi Tan",
    DAX_M997_MEDIC_TAN: "M997 41 Medic Tan",
  },
  // Armed -> the zone multiselect's "Armed" group; unarmed -> "Unarmed".
  // Green liveries only (one representative per vehicle, WCS livery rule);
  // the tan twins are spawn-picker choices via armedVehicleKeys below.
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
  // Every armed key incl. the tan twins — spawn picker Armed/Unarmed chips.
  armedVehicleKeys: [
    "DAX_M1025_11",
    "DAX_M1025_12",
    "DAX_M1025_21",
    "DAX_M1025_22",
    "DAX_M1025_31",
    "DAX_M1025_32",
    "DAX_M998_02",
    "DAX_M1025_11_TAN",
    "DAX_M1025_12_TAN",
    "DAX_M1025_21_TAN",
    "DAX_M1025_22_TAN",
    "DAX_M1025_31_TAN",
    "DAX_M1025_32_TAN",
    "DAX_M998_02_TAN",
  ],
};
