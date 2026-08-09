// Props tab catalogue: hand-picked placeable prefabs (source: the user's
// "Object placement.md" pick list, E_ audit 2026-08-04). refs are the
// GM-editable E_ variants where vanilla ships one (GUIDs harvested from
// Configs/Editor/PlaceableEntities — the reference dump has no .meta files);
// entries with editable: false have no E_ mirror in vanilla and emit the
// base prefab (accepted trade-off: they spawn fine but are not
// GM-editable/deletable in-game).
//
// fp = XZ footprint in meters, FULL sizes (not half-extents): w spans local
// X, len spans local Z, offX/offZ = box-center offset in prefab-local space.
// The whole box rotates with the entity yaw. Synced by
// generator/tools/harvest-prop-footprints.mjs — don't hand-edit fp values.
// Sources: slotted compositions = their PhysicsBoxGeometry UserAction
// Extents/Offset (inheritance-walked); plain props/wrecks = .xob header AABB
// (min @0x18, max @0x24, float32-LE); minefields = the fixed
// SCR_EffectsModuleAreaMeshComponent sizes (m_fWidth/m_fLenght are full
// diameters per SCR_BaseAreaMeshComponent docs).
//
// Facing: compositions are authored front-toward local +Z, and yaw is a
// compass bearing (0 = north, 90 = east, clockwise on the map). MG nests /
// bunkers fire toward +Z; checkpoint/barricade road axis runs along local Z.
const A = "PrefabsEditable/Auto";
const SLOTTED = `${A}/Compositions/Slotted`;
const MINE = "PrefabsEditable/EffectsModules/Mine";

// Filter chips in the prop picker (order = display order). defense: true
// marks categories whose props may get an enemy defense group (SlotAI).
export const PROP_CATEGORIES = [
  { key: "militaryBase", label: "Military base", defense: true },
  { key: "fortification", label: "Fortifications", defense: true },
  { key: "minefield", label: "Mine Fields" },
  { key: "cargo", label: "Cargo" },
  { key: "wreck", label: "Wrecks" },
  { key: "other", label: "Other" },
];

export const PROPS = [
  // ---- Military base --------------------------------------------------
  { ref: `{C6B534F64C60C583}${SLOTTED}/SlotFlatLarge/E_Helipad_L_US_01.et`, label: "Helipad (US)", cat: "militaryBase", fp: { w: 25, len: 25 } },
  { ref: `{B2BE9F96CF7399CC}${SLOTTED}/SlotFlatLarge/E_Helipad_L_USSR_01.et`, label: "Helipad (Soviet)", cat: "militaryBase", fp: { w: 25, len: 25 } },
  { ref: `{74B740B56C82C0CF}${SLOTTED}/SlotFlatLarge/E_LivingArea_L_US_01.et`, label: "Living Area, large (US)", cat: "militaryBase", fp: { w: 40, len: 40 } },
  { ref: `{85E7D977EFAC11CB}${SLOTTED}/SlotFlatLarge/E_LivingArea_L_USSR_01.et`, label: "Living Area, large (Soviet)", cat: "militaryBase", fp: { w: 40, len: 40 } },
  { ref: `{71FF67164192F291}${SLOTTED}/SlotFlatMedium/E_FieldHospital_M_FIA_01.et`, label: "Field Hospital (FIA)", cat: "militaryBase", fp: { w: 20, len: 20 } },
  { ref: `{D0281DAF0B131742}${SLOTTED}/SlotFlatMedium/E_FieldHospital_M_US_01.et`, label: "Field Hospital (US)", cat: "militaryBase", fp: { w: 20, len: 20 } },
  { ref: `{505F78512FE8B698}${SLOTTED}/SlotFlatMedium/E_FieldHospital_M_USSR_01.et`, label: "Field Hospital (Soviet)", cat: "militaryBase", fp: { w: 20, len: 20 } },
  { ref: `{C731CC083B954825}${SLOTTED}/SlotFlatSmall/E_Antenna_S_FIA_01.et`, label: "Antenna (FIA)", cat: "militaryBase", tilt: false, fp: { w: 5, len: 5 } },
  { ref: `{F7DC8BB193BCAF44}${SLOTTED}/SlotFlatSmall/E_Antenna_S_US_01.et`, label: "Antenna (US)", cat: "militaryBase", tilt: false, fp: { w: 5, len: 5 } },
  { ref: `{0E9BAF79B9D47993}${SLOTTED}/SlotFlatSmall/E_Antenna_S_USSR_01.et`, label: "Antenna (Soviet)", cat: "militaryBase", tilt: false, fp: { w: 5, len: 5 } },
  { ref: `{7CB2EB208F93C6D4}${SLOTTED}/SlotFlatSmall/E_Headquarters_S_FIA_01.et`, label: "Headquarters (FIA)", cat: "militaryBase", fp: { w: 12, len: 12 } },
  { ref: `{9771776551C306E0}${SLOTTED}/SlotFlatSmall/E_Headquarters_S_US_01.et`, label: "Headquarters (US)", cat: "militaryBase", fp: { w: 12, len: 12 } },
  { ref: `{847605BB95F1F066}${SLOTTED}/SlotFlatSmall/E_Headquarters_S_USSR_01.et`, label: "Headquarters (Soviet)", cat: "militaryBase", fp: { w: 12, len: 12 } },
  { ref: `{7394E0251880F29A}${SLOTTED}/SlotFlatSmall/E_LivingArea_S_FIA_01.et`, label: "Living Area, small (FIA)", cat: "militaryBase", fp: { w: 12, len: 12 } },
  { ref: `{DB7F01C68EACBEC0}${SLOTTED}/SlotFlatSmall/E_LivingArea_S_US_01.et`, label: "Living Area, small (US)", cat: "militaryBase", fp: { w: 12, len: 12 } },
  { ref: `{BE3988DF6E3CD0B2}${SLOTTED}/SlotFlatSmall/E_LivingArea_S_USSR_01.et`, label: "Living Area, small (Soviet)", cat: "militaryBase", fp: { w: 12, len: 12 } },
  { ref: `{617E4B88F858344B}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_FIA_03.et`, label: "Supply Cache 3 (FIA)", cat: "militaryBase", fp: { d: 15 } },
  { ref: `{7BFA33D24ECB81CD}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_FIA_03_Empty.et`, label: "Supply Cache 3, empty (FIA)", cat: "militaryBase", fp: { d: 15 } },
  { ref: `{5C4A6EB08D34BD7C}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_FIA_04.et`, label: "Supply Cache 4 (FIA)", cat: "militaryBase", fp: { d: 15 } },
  { ref: `{B9D6224981D12A17}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_FIA_05.et`, label: "Supply Cache 5 (FIA)", cat: "militaryBase", fp: { d: 15 } },
  { ref: `{D58216A93D15A539}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_FIA_06.et`, label: "Supply Cache 6 (FIA)", cat: "militaryBase", fp: { d: 15 } },
  { ref: `{94D9E9B690F98756}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_US_01.et`, label: "Supply Cache (US)", cat: "militaryBase", fp: { w: 6, len: 6 } },
  { ref: `{EB63BCC0AA844B17}${SLOTTED}/SlotFlatSmall/E_SupplyCache_S_USSR_01.et`, label: "Supply Cache (Soviet)", cat: "militaryBase", fp: { w: 6, len: 6 } },
  // ---- Fortifications -------------------------------------------------
  { ref: `{1EED86CBA983241E}${SLOTTED}/SlotFlatSmall/E_Bunker_S_FIA_01.et`, label: "Bunker (FIA)", cat: "fortification", fp: { w: 12, len: 12 } },
  { ref: `{E87F2E0B5C56A1C3}${SLOTTED}/SlotFlatSmall/E_Bunker_S_US_01.et`, label: "Bunker (US)", cat: "fortification", fp: { w: 12, len: 12 } },
  { ref: `{4885DEA01D687DB3}${SLOTTED}/SlotFlatSmall/E_Bunker_S_USSR_01.et`, label: "Bunker (Soviet)", cat: "fortification", fp: { w: 12, len: 12 } },
  { ref: `{E5043AB2B2C5DFE1}${SLOTTED}/SlotFlatSmall/E_GuardTower_S_US_01.et`, label: "Guard Tower (US)", cat: "fortification", fp: { w: 12, len: 12 } },
  { ref: `{9C13C175AB00BCA8}${SLOTTED}/SlotFlatSmall/E_GuardTower_S_USSR_01.et`, label: "Guard Tower (Soviet)", cat: "fortification", fp: { w: 12, len: 12 } },
  { ref: `{336DB98AC1B21594}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_S_FIA_02.et`, label: "MG Nest (FIA)", cat: "fortification", fp: { w: 10, len: 6 } },
  { ref: `{02C9F8198A7B9897}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_S_US_01.et`, label: "MG Nest (US)", cat: "fortification", fp: { w: 10, len: 6 } },
  { ref: "{9D720679B696FEE1}Prefabs/Compositions/Slotted/SlotFlatSmall/MachineGunNest_S_US_01_M2HB.et", label: "MG Nest, M2HB (US)", cat: "fortification", editable: false, fp: { w: 10, len: 6 } },
  { ref: "{4D69F9D77C372BE5}Prefabs/Compositions/Slotted/SlotFlatSmall/MachineGunNest_S_US_01_M60.et", label: "MG Nest, M60 (US)", cat: "fortification", editable: false, fp: { w: 10, len: 6 } },
  { ref: `{6E9DCCF936BF17B9}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_S_US_02.et`, label: "MG Nest 2 (US)", cat: "fortification", fp: { w: 12, len: 6, offX: 1, offZ: 0 } },
  { ref: `{047B9C8AAB50CE0F}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_S_USSR_01.et`, label: "MG Nest (Soviet)", cat: "fortification", fp: { w: 12, len: 5 } },
  { ref: "{114DE81321786CD9}Prefabs/Compositions/Slotted/SlotFlatSmall/MachineGunNest_S_USSR_01_PKM.et", label: "MG Nest, PKM (Soviet)", cat: "fortification", editable: false, fp: { w: 12, len: 5 } },
  { ref: `{682FA86A17944120}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_S_USSR_02.et`, label: "MG Nest 2 (Soviet)", cat: "fortification", fp: { w: 10, len: 6 } },
  { ref: `{BB201FF4DC275DBB}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_Scoped_S_FIA_01.et`, label: "MG Nest, scoped (FIA)", cat: "fortification", fp: { w: 10, len: 6 } },
  { ref: `{B45F724442487DED}${SLOTTED}/SlotFlatSmall/E_MachineGunNest_Scoped_S_USSR_01.et`, label: "MG Nest, scoped (Soviet)", cat: "fortification", fp: { w: 10, len: 6 } },
  { ref: `{CE74090473B270DE}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_FIA_01.et`, label: "Sandbag Position (FIA)", cat: "fortification", fp: { w: 12, len: 7 } },
  { ref: `{B8138FFE79F61D33}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_US_01.et`, label: "Sandbag Position 1 (US)", cat: "fortification", fp: { w: 10, len: 5 } },
  { ref: `{D447BB1EC532921D}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_US_02.et`, label: "Sandbag Position 2 (US)", cat: "fortification", fp: { w: 10, len: 5 } },
  { ref: `{31DBF7E7C9D70576}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_US_03.et`, label: "Sandbag Position 3 (US)", cat: "fortification", fp: { w: 7, len: 5 } },
  { ref: `{0CEFD2DFBCBB8C41}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_US_04.et`, label: "Sandbag Position 4 (US)", cat: "fortification", fp: { w: 7, len: 5 } },
  { ref: `{9BC88E502B836DBF}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_USSR_01.et`, label: "Sandbag Position 1 (Soviet)", cat: "fortification", fp: { w: 10, len: 5 } },
  { ref: `{F79CBAB09747E291}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_USSR_02.et`, label: "Sandbag Position 2 (Soviet)", cat: "fortification", fp: { w: 10, len: 5 } },
  { ref: `{1200F6499BA275FB}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_USSR_03.et`, label: "Sandbag Position 3 (Soviet)", cat: "fortification", fp: { w: 7, len: 6 } },
  { ref: `{2F34D371EECEFCCD}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_USSR_04.et`, label: "Sandbag Position 4 (Soviet)", cat: "fortification", fp: { w: 7, len: 6 } },
  { ref: `{8BABAE6E7F9B3E39}${A}/Props/Military/Sandbags/E_Sandbag_01_bunker_burlap.et`, label: "Sandbag Bunker (burlap)", cat: "fortification", fp: { w: 4.5, len: 4.7, offX: 0, offZ: 0.1 } },
  { ref: `{2D60BA8C416641F9}${A}/Props/Military/Sandbags/E_Sandbag_01_bunker_plastic.et`, label: "Sandbag Bunker (plastic)", cat: "fortification", fp: { w: 4.5, len: 4.7, offX: 0, offZ: 0.1 } },
  // Barricades/checkpoints moved in from the dissolved Obstacles category
  // (2026-08-04): fortification-cat = eligible for a defense group.
  { ref: `{DAEC7898BE11C117}${SLOTTED}/SlotRoadLarge/E_Barricade_L_US_01.et`, label: "Barricade, large (US)", cat: "fortification", fp: { w: 15, len: 5 } },
  { ref: `{3FB42D0A5589A530}${SLOTTED}/SlotRoadLarge/E_Barricade_L_USSR_01.et`, label: "Barricade, large (Soviet)", cat: "fortification", fp: { w: 15, len: 5 } },
  { ref: `{07B8390A85FAAF82}${SLOTTED}/SlotRoadLarge/E_Checkpoint_L_US_01.et`, label: "Checkpoint, large (US)", cat: "fortification", fp: { w: 15, len: 15 } },
  { ref: `{612AB9E420809989}${SLOTTED}/SlotRoadLarge/E_Checkpoint_L_USSR_01.et`, label: "Checkpoint, large (Soviet)", cat: "fortification", fp: { w: 15, len: 15 } },
  { ref: `{6FE74C9C75DA8A52}${SLOTTED}/SlotRoadMedium/E_Barricade_M_US_01.et`, label: "Barricade, medium (US)", cat: "fortification", fp: { w: 10, len: 5 } },
  { ref: `{1236588FCEA4848F}${SLOTTED}/SlotRoadMedium/E_Barricade_M_USSR_01.et`, label: "Barricade, medium (Soviet)", cat: "fortification", fp: { w: 10, len: 5 } },
  { ref: `{7DBED4D2E5586BEA}${SLOTTED}/SlotRoadMedium/E_Checkpoint_M_US_01.et`, label: "Checkpoint, medium (US)", cat: "fortification", fp: { w: 10, len: 10 } },
  { ref: `{1DF9835399B603EB}${SLOTTED}/SlotRoadMedium/E_Checkpoint_M_USSR_01.et`, label: "Checkpoint, medium (Soviet)", cat: "fortification", fp: { w: 10, len: 10 } },
  { ref: `{D7B8408B96F4DF79}${SLOTTED}/SlotRoadSmall/E_Barricade_S_US_01.et`, label: "Barricade, small (US)", cat: "fortification", fp: { w: 7, len: 5 } },
  { ref: `{17B68DA54A970140}${SLOTTED}/SlotRoadSmall/E_Barricade_S_USSR_01.et`, label: "Barricade, small (Soviet)", cat: "fortification", fp: { w: 7, len: 5 } },
  { ref: `{A870787967D4D18D}${SLOTTED}/SlotRoadSmall/E_Checkpoint_S_US_01.et`, label: "Checkpoint, small (US)", cat: "fortification", fp: { w: 5, len: 5 } },
  { ref: `{5AF4E84CA11058F4}${SLOTTED}/SlotRoadSmall/E_Checkpoint_S_USSR_01.et`, label: "Checkpoint, small (Soviet)", cat: "fortification", fp: { w: 5, len: 5 } },
  // ---- Mine Fields ----------------------------------------------------
  { ref: `{383E34B5B5A0DE87}${MINE}/EffectModule_MineField_AP_Small_US.et`, label: "AP Minefield, small (US)", cat: "minefield", fp: { w: 15, len: 15 } },
  { ref: `{2F0CCC459889B8EE}${MINE}/EffectModule_MineField_AP_Small_USSR.et`, label: "AP Minefield, small (Soviet)", cat: "minefield", fp: { w: 15, len: 15 } },
  { ref: `{3A65DAE7479234D8}${MINE}/EffectModule_MineField_AP_Medium_US.et`, label: "AP Minefield, medium (US)", cat: "minefield", fp: { w: 35, len: 35 } },
  { ref: `{34EB1F16E01716A4}${MINE}/EffectModule_MineField_AP_Medium_USSR.et`, label: "AP Minefield, medium (Soviet)", cat: "minefield", fp: { w: 35, len: 35 } },
  { ref: `{583D04DE7E5A8D22}${MINE}/EffectModule_MineField_Small_US.et`, label: "AT Minefield, small (US)", cat: "minefield", fp: { w: 15, len: 15 } },
  { ref: `{0D6A1225534F164D}${MINE}/EffectModule_MineField_Small_USSR.et`, label: "AT Minefield, small (Soviet)", cat: "minefield", fp: { w: 15, len: 15 } },
  { ref: `{D3FDAE504F8621E8}${MINE}/EffectModule_MineField_Medium_US.et`, label: "AT Minefield, medium (US)", cat: "minefield", fp: { w: 35, len: 35 } },
  { ref: `{1BAE4DF554AED35C}${MINE}/EffectModule_MineField_Medium_USSR.et`, label: "AT Minefield, medium (Soviet)", cat: "minefield", fp: { w: 35, len: 35 } },
  { ref: `{E54FEBE04DBDD4CE}${MINE}/EffectModule_MineField_Large_US.et`, label: "AT Minefield, large (US)", cat: "minefield", fp: { w: 75, len: 75 } },
  { ref: `{28ECED0C0F3655DB}${MINE}/EffectModule_MineField_Large_USSR.et`, label: "AT Minefield, large (Soviet)", cat: "minefield", fp: { w: 75, len: 75 } },
  { ref: `{36108DAFF38E0C07}${MINE}/EffectModule_MineField_Rect_Row_US.et`, label: "Mine Row (US)", cat: "minefield", fp: { w: 5, len: 10 } },
  { ref: `{B86FFB24E23D8055}${MINE}/EffectModule_MineField_Rect_Row_USSR.et`, label: "Mine Row (Soviet)", cat: "minefield", fp: { w: 5, len: 10 } },
  { ref: `{BF4F9228DD61216B}${A}/Structures/Signs/Military/SignMinefield_01/E_SignMinefield_01.et`, label: "Minefield Sign", cat: "minefield", fp: { w: 0.9, len: 0.1 } },
  // ---- Cargo ----------------------------------------------------------
  { ref: `{1D962DC7A425BA42}${A}/Props/Military/CargoContainers/E_CargoContainer_01_10ft_US_ammo.et`, label: "Cargo Container 10ft (US)", cat: "cargo", fp: { w: 2.5, len: 3.1 } },
  { ref: `{01E81906ECD8EFAB}${A}/Props/Military/CargoContainers/E_CargoContainer_01_10ft_USSR_ammo.et`, label: "Cargo Container 10ft (Soviet)", cat: "cargo", fp: { w: 2.5, len: 3.1 } },
  { ref: `{8F07679B86F6B854}${A}/Props/Military/CargoContainers/E_CargoContainer_01_20ft_US_ammo.et`, label: "Cargo Container 20ft (US)", cat: "cargo", fp: { w: 2.5, len: 6.1 } },
  { ref: `{D22350EE9A2173B9}${A}/Props/Military/CargoContainers/E_CargoContainer_01_20ft_USSR_ammo.et`, label: "Cargo Container 20ft (Soviet)", cat: "cargo", fp: { w: 2.5, len: 6.1 } },
  { ref: "{ECC4315520263256}Prefabs/Props/Military/MilitaryCrates/CrateStack_01/CrateStack_01_dark.et", label: "Crate Stack", cat: "cargo", editable: false, fp: { w: 1.2, len: 1 } },
  // ---- Wrecks ---------------------------------------------------------
  { ref: `{506B08364BB4FFA2}${A}/Props/Wrecks/E_Ural4320_wreck.et`, label: "Ural-4320 wreck", cat: "wreck", fp: { w: 3.2, len: 7.6, offX: -0.2, offZ: 0.1 } },
  { ref: `{ACA1BADA1C09110A}${A}/Props/Wrecks/E_BMP1_wreck.et`, label: "BMP-1 wreck", cat: "wreck", fp: { w: 3.3, len: 7.3, offX: 0, offZ: 1 } },
  { ref: "{C707F02B5A64AA08}Prefabs/Props/Wrecks/BRDM2_wreck/BRDM2_wreck.et", label: "BRDM-2 wreck", cat: "wreck", editable: false, fp: { w: 2.3, len: 5.7, offX: 0, offZ: 0.1 } },
  { ref: `{A41F1EC4E72108AA}${A}/Props/Wrecks/E_BTR70_wreck.et`, label: "BTR-70 wreck", cat: "wreck", fp: { w: 2.9, len: 7.4 } },
  { ref: "{1D0B32AA80873228}Prefabs/Props/Wrecks/LAV25_wreck/LAV25_wreck.et", label: "LAV-25 wreck", cat: "wreck", editable: false, fp: { w: 2.6, len: 6.5, offX: 0, offZ: 0.2 } },
  { ref: `{A237EA45CED8EBFA}${A}/Props/Wrecks/E_M113_wreck.et`, label: "M113 wreck", cat: "wreck", fp: { w: 2.7, len: 5.7, offX: 0, offZ: 0.1 } },
  { ref: `{02D53C3EA1C76E4D}${A}/Props/Wrecks/E_M151A2_wreck.et`, label: "M151A2 wreck", cat: "wreck", fp: { w: 1.9, len: 3.8, offX: 0, offZ: -0.1 } },
  { ref: `{9E5EDE35EFBF70B7}${A}/Props/Wrecks/E_M923A1_wreck.et`, label: "M923A1 wreck", cat: "wreck", fp: { w: 3.2, len: 8.3, offX: 0.2, offZ: -0.4 } },
  { ref: `{7C5703881A4D40A9}${A}/Props/Wrecks/E_M998_wreck.et`, label: "M998 wreck", cat: "wreck", fp: { w: 2.4, len: 5, offX: 0, offZ: -0.2 } },
  { ref: "{38E750A0E7C3B350}Prefabs/Props/Wrecks/Mi8MT_wreck/Mi8MT_wreck.et", label: "Mi-8MT wreck", cat: "wreck", editable: false, fp: { w: 4.7, len: 18.7, offX: -0.2, offZ: -4.6 } },
  { ref: `{FA34D99C60B233F0}${A}/Props/Wrecks/E_S105_wreck.et`, label: "S105 wreck", cat: "wreck", fp: { w: 2.5, len: 4.5 } },
  { ref: "{45D056CC11985141}Prefabs/Props/Wrecks/S1203_wreck/S1203_wreck.et", label: "S1203 wreck", cat: "wreck", editable: false, fp: { w: 1.8, len: 4.6 } },
  { ref: `{21B4CFCFAE632E30}${A}/Props/Wrecks/E_T62_wreck.et`, label: "T-62 wreck", cat: "wreck", fp: { w: 3.5, len: 6.8, offX: 0, offZ: -0.1 } },
  { ref: "{7F29BE4FBFC98392}Prefabs/Props/Wrecks/UAZ452_wreck/UAZ452_wreck.et", label: "UAZ-452 wreck", cat: "wreck", editable: false, fp: { w: 2.3, len: 4.6 } },
  { ref: `{82008EE10AB80D6E}${A}/Props/Wrecks/E_UAZ469_wreck.et`, label: "UAZ-469 wreck", cat: "wreck", fp: { w: 2.3, len: 4.1, offX: 0, offZ: 0.2 } },
  { ref: "{77F237994998613F}Prefabs/Props/Wrecks/UH1H_wreck/UH1H_wreck.et", label: "UH-1H wreck", cat: "wreck", editable: false, fp: { w: 2.9, len: 12.7, offX: 0, offZ: -2.4 } },
  // ---- Other ----------------------------------------------------------
  { ref: "{0C1E367EF0151DE2}Prefabs/Props/Military/Furniture/Toilet_USSR_01/Excrement_01.et", label: "Excrement", cat: "other", editable: false, fp: { w: 0.1, len: 0.2 } },
];

// migrate() backfill for stale refs (placement flow always carries an
// explicitly picked ref since the pick-first UX, 2026-08-04)
export const DEFAULT_PROP = `{B8138FFE79F61D33}${SLOTTED}/SlotFlatSmall/E_SandbagPosition_S_US_01.et`;
