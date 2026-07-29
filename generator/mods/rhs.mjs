// RHS: Status Quo — mod content registry.
//
// Every GUID here is ground-truthed from AUTHORITATIVE inline `{GUID}path`
// references in the unpacked RHS dump (D:\VSCode_dev\arma-reforger\reference\RHS):
//   - faction confs:     Prefabs/MP/Managers/Factions/FactionManager_Editor.et (RHS's own)
//   - groups:            Configs/Editor/PlaceableEntities/RHS_Groups_{USAF,AFRF}.conf,
//                        Configs/EntityCatalog/ION/ION_Groups.conf
//   - characters:        Configs/EntityCatalog/{USMC,RHS_MSV}/*_Characters.conf
//   - vehicles:          Configs/EntityCatalog/{USMC,RHS_MSV,ION}/*_Vehicles.conf
//   - spawn points:      Configs/Editor/PlaceableEntities/Systems/RHS_Systems.conf
//   - fortifications:    Configs/Editor/PlaceableEntities/Compositions/Compositions_FreeRoamBuilding.conf
//   - arsenal items:     reforger-item-database data/rhs/items.json (catalog-sourced)
//
// WARNING (validated 2026-07-11): the RHS dump has NO .meta files and the root
// `ID` line inside its .et prefabs is NOT the resource GUID (always
// 0000000000000001). Never harvest RHS GUIDs by folder-scanning prefabs —
// including reforger-item-database data/rhs/groups.json, whose GUIDs are all
// broken for exactly that reason. Catalog/registry .conf references only.
//
// Known gaps (GUID unrecoverable from the dump — the prefabs are referenced
// nowhere): USAF FORECON squad, ION URBAN CloseProtectionTeam, all plain
// (non-Random) ION characters. ION is therefore ENEMY-ONLY (riflemen empty →
// the web UI keeps it out of the playable dropdown).

const P_USAF_G = "Prefabs/Groups/BLUFOR/RHS_USAF";
const P_MSV_G = "Prefabs/Groups/OPFOR/RHS_AFRF/MSV";
const P_ION_G = "Prefabs/Groups/INDFOR/RHS_ION";
const P_USAF_C = "Prefabs/Characters/Factions/BLUFOR/RHS_USAF";
const P_MSV_C = "Prefabs/Characters/Factions/OPFOR/RHS_AFRF/MSV";
const P_FORT = "PrefabsEditable/Auto/ConflictRHS";

export const RHS = {
  id: "rhs",
  label: "RHS: Status Quo",
  workshopUrl: "https://reforger.armaplatform.com/workshop/595F2BF2F44836FB-RHSStatusQuo",
  // Main addon + the two content packs (all three confirmed from the local
  // Workshop install folder names). Content Pack 02's own gproj lists only the
  // base game as a dependency, so all three must be declared explicitly.
  dependencies: ["595F2BF2F44836FB", "1337C0DE5DABBEEF", "BADC0DEDABBEDA5E"],
  factions: {
    RHS_USAF: {
      label: "RHS US Armed Forces",
      // RHS OVERRIDES the vanilla FactionManager_Editor.et prefab (same path,
      // same parent, same root ID), appending its factions as members with
      // m_bIsPlayable 0 — so mission layers override those EXISTING members by
      // instance GUID exactly like vanilla factions (see RHS's own
      // Coop_CombatOps_Arland default.layer). Appending a fresh conf-ref
      // member instead creates a duplicate FactionKey and faction playability
      // collapses at runtime (validated 2026-07-11).
      entryGuid: "{5CC8DE37E1FF0F7A}",
      // m_CallsignInfo instance inherits RHS's Configs/CallsignInfo/CallsignInfo_US.conf,
      // whose squad-name member GUIDs are identical to vanilla US
      callsignGuid: "{5CC8BB97E017CDBC}",
      squadBase: ["{55CCB792D10AD8F4}", "{55CCB792D13759D8}", "{55CCB792D1218E95}", "{55CCB792D0C8B3CE}"],
      squadFifth: null,
      // RHS_US_USMC.conf declares m_aFriendlyFactionsIds { "US" } — cleared by
      // the member override when a mission pits these two against each other
      friendlyWith: ["US"],
      spawnPoint: "{0CAE96554C7FEB3D}PrefabsEditable/SpawnPoints/E_SpawnPoint_US_USMC.et",
      riflemen: {
        USMC_MEF: `{CB4B1645B748D5D4}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Rifleman.et`,
        USMC_MEF_Desert: `{CA8780615993A41E}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_Rifleman.et`,
        MARSOC: `{1FA45046DA1FC409}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_Rifleman.et`,
      },
      loadoutSets: {
        USMC_MEF: [
          { name: "Rifleman", prefab: `{CB4B1645B748D5D4}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Rifleman.et` },
          { name: "Automatic Rifleman", prefab: `{66876AB6DB22430B}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_AR.et` },
          { name: "Assistant Automatic Rifleman", prefab: `{9E0B5441B270B059}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_AAR.et` },
          { name: "Grenadier", prefab: `{6B5214972C952A21}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_GL.et` },
          { name: "Machine Gunner", prefab: `{70F8C68A5ACB7AB5}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_MG.et` },
          { name: "Assistant Machine Gunner", prefab: `{3758C8E49E3C344A}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_AMG.et` },
          { name: "Light Anti-tank", prefab: `{AE2E93B28352053F}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_LAT.et` },
          { name: "Medic", prefab: `{0C1639553F575AD3}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Medic.et` },
          { name: "Sapper", prefab: `{FAC429BE41EFFA37}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Sapper.et` },
          { name: "FTL", prefab: `{0CC861F88F205BDB}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_TL.et` },
          { name: "SL", prefab: `{0B0F9BA9E9A6E118}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_SL.et` },
          { name: "RTO", prefab: `{9A38B3DFD014403C}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_RTO.et` },
          { name: "Sniper", prefab: `{19678B9267B3574A}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Sniper.et` },
          { name: "Spotter", prefab: `{B74E289F7EDF5D62}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Spotter.et` },
          { name: "Crew", prefab: `{7402385F6EE584DD}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_Crew.et` },
          { name: "Crew Commander", prefab: `{676DDD0176A01169}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_CrewLdr.et` },
          { name: "Pilot", prefab: `{42A502E3BB727CEC}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_HeliPilot.et` },
          { name: "Helicopter Crew", prefab: `{15CD521098748196}${P_USAF_C}/RHS_USAF_USMC_MEF/Character_RHS_USAF_USMC_HeliCrew.et` },
        ],
        USMC_MEF_Desert: [
          { name: "Rifleman", prefab: `{CA8780615993A41E}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_Rifleman.et` },
          { name: "Automatic Rifleman", prefab: `{1162A64DF9C25BA6}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_AR.et` },
          { name: "Assistant Automatic Rifleman", prefab: `{85A7600FFD5A052D}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_AAR.et` },
          { name: "Grenadier", prefab: `{1CB7D86C0E75328C}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_GL.et` },
          { name: "Machine Gunner", prefab: `{2D26B388DAA9692C}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_MG.et` },
          { name: "Assistant Machine Gunner", prefab: `{CCB0FBAA3D8F0A78}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_AMG.et` },
          { name: "Light Anti-tank", prefab: `{90570AB3DED27DAA}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_LAT.et` },
          { name: "Medic", prefab: `{FE4D2AC5D50E2125}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_Medic.et` },
          { name: "Sapper", prefab: `{EE81C7EAE63F0434}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_Sapper.et` },
          { name: "FTL", prefab: `{7B2DAD03ADC04376}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_TL.et` },
          { name: "SL", prefab: `{7CEA5752CB46F9B5}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_SL.et` },
          { name: "RTO", prefab: `{819487919F3EF548}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_RTO.et` },
          { name: "Sniper", prefab: `{412DB67A4B6017BF}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_Sniper.et` },
          { name: "Spotter", prefab: `{D32D76D3CB97D51C}${P_USAF_C}/RHS_USAF_USMC_MEF_D/Character_RHS_USAF_USMC_D_Spotter.et` },
        ],
        MARSOC: [
          { name: "Rifleman", prefab: `{1FA45046DA1FC409}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_Rifleman.et` },
          { name: "Grenadier", prefab: `{340BFA3E488048BE}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_GL.et` },
          { name: "Machine Gunner", prefab: `{6BC95A05D1783577}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_MG.et` },
          { name: "Assistant Machine Gunner", prefab: `{358ED1265B29F1AE}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_AMG.et` },
          { name: "Light Anti-tank", prefab: `{7269658016EE9DCA}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_LAT.et` },
          { name: "Medic", prefab: `{1CE48B40E06B1DEE}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_Medic.et` },
          { name: "Scout", prefab: `{E65AE41D857BDBC6}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_Scout.et` },
          { name: "Sniper", prefab: `{8DE8E6B2CB15EFA5}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_Sniper.et` },
          { name: "TL", prefab: `{53918F51EB353944}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_TL.et` },
          { name: "SL", prefab: `{EB4F847EEDFF4FCB}${P_USAF_C}/RHS_USAF_MARSOC/Character_RHS_USMC_MARSOC_SL.et` },
        ],
      },
      // Starter set (curated from reforger-item-database data/rhs/items.json,
      // mirroring the vanilla US composition) — pending proper arsenal-items.md
      // curation + review
      arsenalItems: [
        { mode: "WEAPON", ref: "{9C5C20FB0E01E64F}Prefabs/Weapons/Launchers/M72/Launcher_M72A3.et" },
        { mode: "WEAPON", ref: "{35022055DCDDE98B}Prefabs/Weapons/Launchers/MK153/Launcher_MK153mod2.et" },
        { mode: "AMMUNITION", ref: "{DEDC311A2B0F9235}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_M855A1_Last_5Tracer.et" },
        { mode: "AMMUNITION", ref: "{546DA68AC0D47D36}Prefabs/Weapons/Magazines/PmagUnwindowed/Magazine_556x45_PMAG_30rnd_M855A1_last5tracer.et" },
        { mode: "AMMUNITION", ref: "{BEE3897D2286992A}Prefabs/Weapons/Magazines/Box_556x45_M249_200rnd_M855A1_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{96DD0591AFDCC579}Prefabs/Weapons/Magazines/Magazine_M240_Coax/Box_762x51_M240_coax_200rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{EC9E0F22B90013F3}Prefabs/Weapons/Magazines/Magazine_762x51_M40_5rnd_M80.et" },
        { mode: "AMMUNITION", ref: "{5375FA7CB1F68573}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_M406.et" },
        { mode: "AMMUNITION", ref: "{1663496AE5B9F10B}Prefabs/Weapons/Ammo/Ammo_Grenade_HEDP_M433.et" },
        { mode: "AMMUNITION", ref: "{98DB57ECEDC81CC2}Prefabs/Weapons/Ammo/Ammo_Flare_40mm_M583A1_White.et" },
        { mode: "", ref: "{E8F00BF730225B00}Prefabs/Weapons/Grenades/Grenade_M67.et" },
        { mode: "", ref: "{9DB69176CEF0EE97}Prefabs/Weapons/Grenades/Smoke_ANM8HC.et" },
        { mode: "", ref: "{D41D22DD1B8E921E}Prefabs/Weapons/Grenades/M18/Smoke_M18_Green.et" },
        { mode: "", ref: "{3343A055A83CB30D}Prefabs/Weapons/Grenades/M18/Smoke_M18_Red.et" },
        { mode: "", ref: "{14C1A0F061D9DDEE}Prefabs/Weapons/Grenades/M18/Smoke_M18_Violet.et" },
        { mode: "", ref: "{9BBDEE253A16CC66}Prefabs/Weapons/Grenades/M18/Smoke_M18_Yellow.et" },
        { mode: "", ref: "{33CBDE73AB48172A}Prefabs/Weapons/Explosives/DemoBlock_M112/DemoBlock_M112.et" },
        { mode: "", ref: "{CE0AF733722B3978}Prefabs/Items/Equipment/Detonators/BlastingMachine_M34/BlastingMachine_M34.et" },
        { mode: "", ref: "{49FFE8F373F55960}Prefabs/Weapons/Explosives/Mine_M15AT/Mine_M15AT.et" },
        { mode: "CONSUMABLE", ref: "{A81F501D3EF6F38E}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_US_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{00E36F41CA310E2A}Prefabs/Items/Medicine/SalineBag_01/SalineBag_US_01.et" },
        { mode: "CONSUMABLE", ref: "{D70216B1B2889129}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_US_01.et" },
        { mode: "", ref: "{C55821E8E86C074E}Prefabs/Items/Equipment/Radios/Radio_ANPRC152.et" },
        // Backpacks (faction-wide, from USMC_InventoryItems.conf; FILBE coyote
        // fits both woodland and desert MEF)
        { mode: "", ref: "{48602F57998AB597}Prefabs/Items/Equipment/Backpacks/FILBE_Backpack.et" },
        { mode: "", ref: "{BC4ABD18AF9564D5}Prefabs/Items/Equipment/Backpacks/FILBE_Backpack_Heavy.et" },
        { mode: "", ref: "{9A26D311900C33EE}Prefabs/Items/Equipment/Backpacks/FILBE_hydration_pack.et" },
        { mode: "", ref: "{4805E67E2AE30F8D}Prefabs/Items/Equipment/Backpacks/Backpack_Medical_M5.et" },
      ],
      // Camo-matched backpack extras per playable subfaction (appended to
      // arsenalItems by lib.mjs) — camo mapping pending visual check
      subfactionArsenalItems: {
        USMC_MEF: [
          { mode: "", ref: "{5C5C6EE05EE2FF1A}Prefabs/Items/Equipment/Backpacks/Backpack_ALICE_Medium_assembled.et" },
          { mode: "", ref: "{95D4766BBE46F23D}Prefabs/Items/Equipment/Backpacks/Backpack_IIFS_FieldPack.et" },
        ],
        MARSOC: [
          { mode: "", ref: "{46D824AAD12330B2}Prefabs/Items/Equipment/Backpacks/backpack_511_rush12/Backpack_511_rush12_Coy.et" },
          { mode: "", ref: "{4A93B3F0B33FF104}Prefabs/Items/Equipment/Backpacks/backpack_511_rush12/Backpack_511_rush12_MC.et" },
        ],
      },
      vehicles: {
        M151A2: "{F649585ABB3706C4}Prefabs/Vehicles/Wheeled/M151A2/M151A2.et",
        M151A2_transport: "{47D94E1193A88497}Prefabs/Vehicles/Wheeled/M151A2/M151A2_transport.et",
        M151A2_M2HB: "{F6B23D17D5067C11}Prefabs/Vehicles/Wheeled/M151A2/M151A2_M2HB.et",
        M998_covered_USAF: "{923F0A979CE79ACD}Prefabs/Vehicles/Wheeled/M998/M998_covered_USAF.et",
        M998_covered_long_USAF: "{23FB589C8BF6EC6E}Prefabs/Vehicles/Wheeled/M998/M998_covered_long_USAF.et",
        M1025_USAF: "{CC55611936C21F25}Prefabs/Vehicles/Wheeled/M998/M1025_USAF.et",
        M1025_armed_M2HB_USAF: "{3277F8B1FA06A2BC}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_USAF.et",
        M1025_armed_M2HB_USAF_D: "{B8C827A45C1347A4}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_USAF_D.et",
        M997_maxi_ambulance_USAF: "{4E3A86638BFF9FC6}Prefabs/Vehicles/Wheeled/M998/M997_maxi_ambulance_USAF.et",
        M923A1_transport: "{F1FBD0972FA5FE09}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport.et",
        M923A1_transport_covered: "{81FDAD5EB644CC3D}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport_covered.et",
        M923A1_engineer: "{2D74C39A650A3030}Prefabs/Vehicles/Wheeled/M923A1/M923A1_engineer.et",
        M923A1_tanker: "{2BE1F8B9299B67C1}Prefabs/Vehicles/Wheeled/M923A1/M923A1_tanker.et",
        M923A1_command: "{36BDCC88B17B3BFA}Prefabs/Vehicles/Wheeled/M923A1/M923A1_command.et",
        M923A1_arsenal: "{1FF144F8A209239D}Prefabs/Vehicles/Wheeled/M923A1/M923A1_arsenal.et",
        M923A1_repair: "{A042ACE5C2B13206}Prefabs/Vehicles/Wheeled/M923A1/M923A1_repair.et",
        LAV25_RHS: "{3312ADBF53A16DD8}Prefabs/Vehicles/Wheeled/LAV25/LAV25_RHS.et",
        LAV25_RHS_D: "{123595894023C474}Prefabs/Vehicles/Wheeled/LAV25/LAV25_RHS_D.et",
        UH1H_RHS: "{70BAEEFC2D3FEE64}Prefabs/Vehicles/Helicopters/UH1H/UH1H.et",
        UH1H_armed: "{DDDD9B51F1234DF3}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed.et",
      },
      vehicleLabels: {
        M151A2: "M151A2",
        M151A2_transport: "M151A2 Jeep",
        M151A2_M2HB: "M151A2 M2HB",
        M998_covered_USAF: "M998 HMMWV",
        M998_covered_long_USAF: "M998 HMMWV (long)",
        M1025_USAF: "M1025 HMMWV",
        M1025_armed_M2HB_USAF: "M1025 M2HB",
        M1025_armed_M2HB_USAF_D: "M1025 M2HB (desert)",
        M997_maxi_ambulance_USAF: "M997 Ambulance",
        M923A1_transport: "M923A1 Truck",
        M923A1_transport_covered: "M923A1 Truck (covered)",
        M923A1_engineer: "M923A1 Engineer",
        M923A1_tanker: "M923A1 Tanker",
        M923A1_command: "M923A1 Command",
        M923A1_arsenal: "M923A1 Arsenal",
        M923A1_repair: "M923A1 Repair",
        LAV25_RHS: "LAV-25",
        LAV25_RHS_D: "LAV-25 (desert)",
        UH1H_RHS: "UH-1H",
        UH1H_armed: "UH-1H (armed)",
      },
      patrolVehicleKeys: ["M151A2_M2HB", "M1025_armed_M2HB_USAF", "LAV25_RHS"],
      // RHS-native Conflict fortification editables (E_*), faction-tagged _USMC_
      fortifications: {
        road: [
          `{EE1B4772E4F49744}${P_FORT}/E_Checkpoint_S_USMC_01.et`,
          `{23AFB2EDBF2FB401}${P_FORT}/E_Checkpoint_M_USMC_01.et`,
          `{B749D978A7DA29B2}${P_FORT}/E_Checkpoint_L_USMC_01.et`,
          `{36422D5465EFCDC7}${P_FORT}/E_Barricade_L_USMC_01.et`,
        ],
        roadside: [
          `{B424CD5A848BBB4A}${P_FORT}/E_Bunker_S_USMC_01.et`,
          `{AD4C783A71AF1E5D}${P_FORT}/E_MachineGunNest_S_USMC_01.et`,
          `{C1184CDACD6B9173}${P_FORT}/E_MachineGunNest_S_USMC_02.et`,
          `{B6CF141969901996}${P_FORT}/E_SandbagPosition_S_USMC_01.et`,
          `{DA9B20F9D55496B8}${P_FORT}/E_SandbagPosition_S_USMC_02.et`,
          `{3F076C00D9B101D3}${P_FORT}/E_SandbagPosition_S_USMC_03.et`,
          `{02334938ACDD88E4}${P_FORT}/E_SandbagPosition_S_USMC_04.et`,
        ],
      },
      defaultGroupSet: "USMC_MEF",
      groupSets: {
        USMC_MEF: {
          label: "USMC (MEF)",
          sentry: `{58022D923E268D86}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_SentryTeam.et`,
          defense: { ref: `{F831DFB4A9B46152}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_RifleSquad.et`, size: 9 },
          small: [
            `{FDAABEDD84CC8933}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_AmmoTeam.et`,
            `{C848B065E20A890E}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_LightFireTeam.et`,
            `{559AAEF06C2AF113}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_MachineGunTeam.et`,
            `{2F789534FC49EE31}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_MedicalSection.et`,
            `{CE3326F78B0125CC}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_ReconTeam.et`,
            `{58022D923E268D86}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_SentryTeam.et`,
            `{BBF68148AB94A7C7}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_SniperTeam.et`,
            `{CBB94A576FB7DD47}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_Team_AT.et`,
            `{5B42785917B46C1C}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_Team_GL.et`,
            `{31D079C6019C7BEF}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_Team_LAT.et`,
            `{5A348B965206FEBE}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_Team_Suppress.et`,
          ],
          medium: [
            `{19843E954790DF28}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_FireTeam.et`,
            `{0E3DC6A52A5F959E}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_PlatoonHQ.et`,
          ],
          large: [`{F831DFB4A9B46152}${P_USAF_G}/RHS_USAF_USMC_MEF/Group_USAF_USMC_MEF_RifleSquad.et`],
        },
        USMC_MEF_Desert: {
          label: "USMC (MEF, desert)",
          sentry: `{27B4E0E2A75F44E3}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_SentryTeam.et`,
          defense: { ref: `{878712C430CDA837}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_RifleSquad.et`, size: 9 },
          small: [
            `{16764DD17C2CBCAE}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_AmmoTeam.et`,
            `{A2B235FE18E16CD5}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_LightFireTeam.et`,
            `{AEE7C9BD0331B47A}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_MachineGunTeam.et`,
            `{D405F2799352AB58}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_MedicalSection.et`,
            `{A732D2933B1264FB}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_ReconTeam.et`,
            `{27B4E0E2A75F44E3}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_SentryTeam.et`,
            `{C4404C3832ED6EA2}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_SniperTeam.et`,
            `{77D57E626C91EABD}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_Team_AT.et`,
            `{7861D3272C23FB3F}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_Team_GL.et`,
            `{1910D43E4DF60884}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_Team_LAT.et`,
            `{30CE0E0DA8ED1B65}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_Team_Suppress.et`,
          ],
          medium: [
            `{3144936D0BFAAC43}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_FireTeam.et`,
            `{673C32C19A4CD4A9}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_PlatoonHQ.et`,
          ],
          large: [`{878712C430CDA837}${P_USAF_G}/RHS_USAF_USMC_MEF_D/Group_USAF_USMC_MEF_D_RifleSquad.et`],
        },
        MARSOC: {
          label: "MARSOC",
          sentry: `{7A43006F3F254FB2}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_SentryTeam.et`,
          defense: { ref: `{DA70F249A8B7A366}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_RifleSquad.et`, size: 9 },
          small: [
            `{E4E4DC161AAAD00F}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_LightFireTeam.et`,
            `{EED98638FF77CEAC}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_MachineGunTeam.et`,
            `{943BBDFC6F14D18E}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_MedicalSection.et`,
            `{F8A15963AFCAF248}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_RadioReconTeam.et`,
            `{7A43006F3F254FB2}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_SentryTeam.et`,
            `{99B7ACB5AA9765F3}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_SniperTeam.et`,
            `{B5177ACCB4B21D1D}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_Team_GL.et`,
            `{DAE39357F0637C94}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_Team_LAT.et`,
            `{7698E7E5AAA6A7BF}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_Team_Suppress.et`,
          ],
          medium: [`{F2B7D404B66FD853}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_FireTeam.et`],
          large: [`{DA70F249A8B7A366}${P_USAF_G}/RHS_USAF_MARSOC/Group_USAF_USMC_MARSOC_RifleSquad.et`],
        },
        // FORECON excluded: its squad prefab's GUID is unrecoverable from the dump
      },
    },
    RHS_AFRF: {
      label: "RHS Russian Armed Forces",
      // Existing member of RHS's FactionManager_Editor.et override (see RHS_USAF)
      entryGuid: "{5978B9CE6585BBE8}",
      // Inline SCR_FactionCallsignInfo object in RHS_RF_MSV.conf
      callsignGuid: "{5977478D568C093C}",
      squadBase: ["{5977478D568C092E}", "{5977478D568C092D}", "{5977478D568D935E}", "{5977478D568D935F}"],
      squadFifth: null,
      // RHS_RF_MSV.conf declares m_aFriendlyFactionsIds { "USSR" } — cleared by
      // the member override vs USSR AND vs MEI (alias resolves to USSR)
      friendlyWith: ["USSR"],
      spawnPoint: "{E86B0E337506B044}PrefabsEditable/SpawnPoints/E_SpawnPoint_RF_MSV.et",
      riflemen: {
        MSV_Flora: `{7CCAB195F5A1D9CA}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_Rifleman.et`,
        MSV_VSR: `{3CEC77A6686C1BA3}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_Rifleman.et`,
        MSV_VKPO_Summer: `{A0CAC00219D7EF55}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Rifleman.et`,
        MSV_VKPO_Demiseason: `{5A1F1BD88FC6C6E9}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Rifleman.et`,
      },
      // Russian loadout names by design (matches the vanilla USSR sets)
      loadoutSets: {
        MSV_Flora: [
          { name: "Стрелок", prefab: `{7CCAB195F5A1D9CA}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_Rifleman.et` },
          { name: "Пулеметчик (РПК)", prefab: `{DE4C67D3C8F6704D}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_AR.et` },
          { name: "Пулеметчик", prefab: `{8C5BB9C9A6B964AE}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_MG.et` },
          { name: "Помощник пулеметчика", prefab: `{C9CA4F02D899C1F8}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_AMG.et` },
          { name: "Стрелок ГП", prefab: `{D39919F23F411967}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_GL.et` },
          { name: "Гранатометчик", prefab: `{06E40E12B17F6E11}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_AT.et` },
          { name: "Помощник гранатометчика", prefab: `{4375F8D9CF5FCB47}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_AAT.et` },
          { name: "Санитар", prefab: `{D9AF475A4E5DC52C}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_Medic.et` },
          { name: "Старший стрелок", prefab: `{9E5162BC890ADFCF}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_SR.et` },
          { name: "Ком. отделения", prefab: `{B3C496CCFA72D25E}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_SL.et` },
          { name: "Офицер", prefab: `{A67F5A2E875AEB72}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_Officer.et` },
          { name: "Радист", prefab: `{9FEE7686D4B2257E}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_RTO.et` },
          { name: "Марксман", prefab: `{78976C69F927A7B1}${P_MSV_C}/Flora/Character_RHS_RF_MSV_Flora_Sharpshooter.et` },
          { name: "Экипаж", prefab: `{2B97973CD921E6AC}${P_MSV_C}/Flora/Character_RHS_AFRF_MSV_Flora_Crew.et` },
        ],
        MSV_VSR: [
          { name: "Стрелок", prefab: `{3CEC77A6686C1BA3}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_Rifleman.et` },
          { name: "Пулеметчик (РПК)", prefab: `{02BD56E9BC9E800E}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_AR.et` },
          { name: "Пулеметчик", prefab: `{50AA88F3D2D194ED}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_MG.et` },
          { name: "Помощник пулеметчика", prefab: `{A96C4093A5116794}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_AMG.et` },
          { name: "Стрелок ГП", prefab: `{0F6828C84B29E924}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_GL.et` },
          { name: "Гранатометчик", prefab: `{DA153F28C5179E52}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_AT.et` },
          { name: "Помощник гранатометчика", prefab: `{23D3F748B2D76D2B}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_AAT.et` },
          { name: "Санитар", prefab: `{F570BCD98B0BCED0}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_Medic.et` },
          { name: "Старший стрелок", prefab: `{424464CB4B245206}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_SR.et` },
          { name: "Ком. отделения", prefab: `{6F35A7F68E1A221D}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_SL.et` },
          { name: "Офицер", prefab: `{CC3E84140343D82E}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_Officer.et` },
          { name: "Радист", prefab: `{FF487917A93A8312}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_RTO.et` },
          { name: "Марксман", prefab: `{A4826A1E3B092A78}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_Sharpshooter.et` },
          { name: "Экипаж", prefab: `{D847E9108E4739F9}${P_MSV_C}/VSR/Character_RHS_RF_MSV_VSR_Crew.et` },
        ],
        MSV_VKPO_Summer: [
          { name: "Стрелок", prefab: `{A0CAC00219D7EF55}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Rifleman.et` },
          { name: "Пулеметчик (РПК)", prefab: `{FBB329ECA28B85A7}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_AR.et` },
          { name: "Пулеметчик", prefab: `{A9A4F7F6CCC49144}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_MG.et` },
          { name: "Помощник пулеметчика", prefab: `{F13D06392307FA6A}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_AMG.et` },
          { name: "Стрелок ГП", prefab: `{F66657CD553CEC8D}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_GL.et` },
          { name: "Гранатометчик", prefab: `{231B402DDB029BFB}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_AT.et` },
          { name: "Помощник гранатометчика", prefab: `{7B82B1E234C1F0D5}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_AAT.et` },
          { name: "ПТ Стрелок", prefab: `{6AB4C34EA1A4E42E}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_LAT.et` },
          { name: "Санитар", prefab: `{816A594FAD3F711A}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Medic.et` },
          { name: "Сапер", prefab: `{D70ED19BF7F83BE0}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Sapper.et` },
          { name: "Старший стрелок", prefab: `{32650EC86FE1AF60}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_SR.et` },
          { name: "Ком. отделения", prefab: `{963BD8F3900F27B4}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_SL.et` },
          { name: "Радист", prefab: `{A7193FBD2F2C1EEC}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_RTO.et` },
          { name: "Марксман", prefab: `{C55F0D12342C6756}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Sharpshooter.et` },
          { name: "Наблюдатель", prefab: `{690C5407460D6271}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Spotter.et` },
          { name: "Экипаж", prefab: `{F1E1A7A59FE370C6}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_Crew.et` },
          { name: "Пилот", prefab: `{BBFE0BDC501C440F}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_HeliPilot.et` },
          { name: "Бортмеханик", prefab: `{411DE243F376E485}${P_MSV_C}/VKPO_Summer/Character_RHS_RF_MSV_VKPO_S_HeliCrew.et` },
        ],
        MSV_VKPO_Demiseason: [
          { name: "Стрелок", prefab: `{5A1F1BD88FC6C6E9}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Rifleman.et` },
          { name: "Пулеметчик (РПК)", prefab: `{9D7859DE5E1DA3AB}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_AR.et` },
          { name: "Пулеметчик", prefab: `{CF6F87C43052B748}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_MG.et` },
          { name: "Помощник пулеметчика", prefab: `{E0E062BD23185D62}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_AMG.et` },
          { name: "Стрелок ГП", prefab: `{90AD27FFA9AACA81}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_GL.et` },
          { name: "Гранатометчик", prefab: `{45D0301F2794BDF7}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_AT.et` },
          { name: "Помощник гранатометчика", prefab: `{6A5FD56634DE57DD}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_AAT.et` },
          { name: "ПТ Стрелок", prefab: `{A707D61B6EDF3106}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_LAT.et` },
          { name: "Санитар", prefab: `{7E590EDD929739E4}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Medic.et` },
          { name: "Сапер", prefab: `{CD7ED39C9865ED98}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Sapper.et` },
          { name: "Старший стрелок", prefab: `{8DE84439090A3D21}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_SR.et` },
          { name: "Ком. отделения", prefab: `{F0F0A8C16C9901B8}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_SL.et` },
          { name: "Радист", prefab: `{B6C45B392F33B9E4}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_RTO.et` },
          { name: "Марксман", prefab: `{68EB286921B4E7FD}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Sharpshooter.et` },
          { name: "Наблюдатель", prefab: `{68B424CA046B2B07}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Spotter.et` },
          { name: "Экипаж", prefab: `{0848BAB1B94FCBBA}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_Crew.et` },
          { name: "Пилот", prefab: `{38D59019ABF4D5F6}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_HeliPilot.et` },
          { name: "Бортмеханик", prefab: `{BB9DCEEA3CD5A517}${P_MSV_C}/VKPO_Demiseason/Character_RHS_RF_MSV_VKPO_DS_HeliCrew.et` },
        ],
      },
      arsenalItems: [
        { mode: "WEAPON", ref: "{7A82FE978603F137}Prefabs/Weapons/Launchers/RPG7/Launcher_RPG7.et" },
        { mode: "AMMUNITION", ref: "{FBBF84E3B447D822}Prefabs/Weapons/Ammo/RPG/RHS_AmmoRocket_PG7VL.et" },
        { mode: "AMMUNITION", ref: "{4A3B196E4EA820E9}Prefabs/Weapons/Ammo/RPG/RHS_AmmoRocket_OG7V.et" },
        { mode: "AMMUNITION", ref: "{32E12D322E107F1C}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VM.et" },
        { mode: "AMMUNITION", ref: "{FD34D121FA55CB10}Prefabs/Weapons/Magazines/6l23_plastic/Magazine_545x39_plastic_AK_30rnd_Last_5Tracer.et" },
        { mode: "AMMUNITION", ref: "{DFEBDFD73BFD9501}Prefabs/Weapons/Magazines/6l23_plum/Magazine_545x39_plum_AK_30rnd_Last_5Tracer.et" },
        { mode: "AMMUNITION", ref: "{E5E9C5897CF47F44}Prefabs/Weapons/Magazines/Box_762x54_PK_100rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{D8421F6E70B2FB4F}Prefabs/Weapons/Magazines/Box_762x54_PK_250rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{77595CB9F596E6AC}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_LPS.et" },
        { mode: "AMMUNITION", ref: "{262F0D09C4130826}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_VOG25.et" },
        { mode: "AMMUNITION", ref: "{97A0A70B9BEE99E2}Prefabs/Weapons/Ammo/Ammo_Flare_26x45_White.et" },
        { mode: "", ref: "{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et" },
        { mode: "", ref: "{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et" },
        { mode: "", ref: "{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et" },
        { mode: "", ref: "{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et" },
        { mode: "", ref: "{D6EF54367CECE1D9}Prefabs/Weapons/Explosives/Mine_TM62M/Mine_TM62M.et" },
        { mode: "CONSUMABLE", ref: "{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{527D7C5D2E476BDC}Prefabs/Items/Medicine/SalineBag_01/SalineBag_USSR_01.et" },
        { mode: "CONSUMABLE", ref: "{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et" },
        { mode: "", ref: "{54C68E438DD34265}Prefabs/Items/Equipment/Radios/Radio_R107M.et" },
        // Backpacks (faction-wide, from MSV_InventoryItems.conf)
        { mode: "", ref: "{3DE0155EC9767B98}Prefabs/Items/Equipment/Backpacks/Backpack_Veshmeshok.et" },
        { mode: "", ref: "{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et" },
        { mode: "", ref: "{0D39750E5695B9D8}Prefabs/Items/Equipment/Backpacks/Backpack_RPG_Gunner.et" },
        { mode: "", ref: "{6A39B5843B3F36DA}Prefabs/Items/Equipment/Backpacks/Backpack_RPG_Assistant.et" },
        { mode: "", ref: "{7AC107CA7AFC9B59}Prefabs/Items/Equipment/Backpacks/Backpack_Medical_Soviet.et" },
      ],
      // Camo-matched backpack extras per playable subfaction — camo mapping
      // pending visual check (Suharka→90s sets, Ratnik/EMR→VKPO is a guess)
      subfactionArsenalItems: {
        MSV_Flora: [
          { mode: "", ref: "{CAEDE923EF4071AE}Prefabs/Items/Equipment/Backpacks/Backpack_Suharka_type1.et" },
          { mode: "", ref: "{A6B9DDC35384FE80}Prefabs/Items/Equipment/Backpacks/Backpack_Suharka_type2.et" },
          { mode: "", ref: "{16C7AD0508F53A9B}Prefabs/Items/Equipment/Backpacks/backpack_Wartech_BB102/Backpack_Wartech_BB102_OD.et" },
        ],
        MSV_VSR: [
          { mode: "", ref: "{CAEDE923EF4071AE}Prefabs/Items/Equipment/Backpacks/Backpack_Suharka_type1.et" },
          { mode: "", ref: "{A6B9DDC35384FE80}Prefabs/Items/Equipment/Backpacks/Backpack_Suharka_type2.et" },
          { mode: "", ref: "{72DB97161FBA7AF0}Prefabs/Items/Equipment/Backpacks/backpack_Wartech_BB102/Backpack_Wartech_BB102_FG.et" },
        ],
        MSV_VKPO_Summer: [
          { mode: "", ref: "{924B2ABFFF994188}Prefabs/Items/Equipment/Backpacks/backpack_Ratnik_6sh117/Backpack_Ratnik_6sh117.et" },
          { mode: "", ref: "{064B7836FE60606D}Prefabs/Items/Equipment/Backpacks/backpack_Ratnik_6sh118/Backpack_Ratnik_6sh118.et" },
          { mode: "", ref: "{43802D2484B1C1A1}Prefabs/Items/Equipment/Backpacks/backpack_Ratnik_6B46/Backpack_Ratnik_6B46.et" },
          { mode: "", ref: "{45DC01791EBE2349}Prefabs/Items/Equipment/Backpacks/backpack_Wartech_BB102/Backpack_Wartech_BB102_EMR.et" },
        ],
        MSV_VKPO_Demiseason: [
          { mode: "", ref: "{924B2ABFFF994188}Prefabs/Items/Equipment/Backpacks/backpack_Ratnik_6sh117/Backpack_Ratnik_6sh117.et" },
          { mode: "", ref: "{064B7836FE60606D}Prefabs/Items/Equipment/Backpacks/backpack_Ratnik_6sh118/Backpack_Ratnik_6sh118.et" },
          { mode: "", ref: "{43802D2484B1C1A1}Prefabs/Items/Equipment/Backpacks/backpack_Ratnik_6B46/Backpack_Ratnik_6B46.et" },
          { mode: "", ref: "{45DC01791EBE2349}Prefabs/Items/Equipment/Backpacks/backpack_Wartech_BB102/Backpack_Wartech_BB102_EMR.et" },
        ],
      },
      vehicles: {
        UAZ469_Camo_uncovered: "{03D9932135924AEF}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_Camo_uncovered.et",
        UAZ469_Camo: "{E1A99B5F2DC9B38A}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_Camo.et",
        UAZ469_PKM: "{0B4DEA8078B78A9B}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_PKM.et",
        UAZ452_ambulance: "{43C4AF1EEBD001CE}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_ambulance.et",
        Ural4320_transport: "{16C1F16C9B053801}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport.et",
        Ural4320_transport_covered: "{D9B91FAB817A6033}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport_covered.et",
        Ural4320_Arsenal: "{32E77EC32ED2B6D1}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_Arsenal.et",
        Ural4320_repair: "{A5647958579A4149}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_repair.et",
        Ural4320_tanker: "{4C81D7ED8F8C0D87}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_tanker.et",
        Ural4320_command: "{1BABF6B33DA0AEB6}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_command.et",
        Ural4320_engineer: "{6E9142CD2471741C}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_engineer.et",
        BTR70_AFRF: "{447CFE8D73F95C3E}Prefabs/Vehicles/Wheeled/BTR70/BTR70_AFRF.et",
        APC_K17_Berezok: "{31F0866273C46D76}Prefabs/Vehicles/Wheeled/K17/APC_K17_Berezok.et",
        APC_K17_Berezok_camo1: "{DD0CB0331A3D8CA7}Prefabs/Vehicles/Wheeled/K17/APC_K17_Berezok_camo1.et",
        APC_K17_Epoch: "{F86AB1BD36B33407}Prefabs/Vehicles/Wheeled/K17/APC_K17_Epoch.et",
        APC_K17_unarmed: "{3B899AC9449C35F0}Prefabs/Vehicles/Wheeled/K17/APC_K17_unarmed.et",
        K4386: "{A61E5C16E9A2161A}Prefabs/Vehicles/Wheeled/K4386/K4386.et",
        K4386_Camo: "{9BF596A3464B6DB8}Prefabs/Vehicles/Wheeled/K4386/K4386_Camo.et",
        K4386_Armed: "{AB5DE68E3E654FCA}Prefabs/Vehicles/Wheeled/K4386/K4386_Armed.et",
        K4386_Armed_Camo: "{1DF4C30C130D8FAD}Prefabs/Vehicles/Wheeled/K4386/K4386_Armed_Camo.et",
        Mi8MT_unarmed_transport: "{DF5CCB7C0FF049F4}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_unarmed_transport.et",
        Mi8MT_armed_black: "{80C975F8482DEE97}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed_black.et",
      },
      vehicleLabels: {
        UAZ469_Camo_uncovered: "UAZ-469 (uncovered, camo)",
        UAZ469_Camo: "UAZ-469 (camo)",
        UAZ469_PKM: "UAZ-469 PKM",
        UAZ452_ambulance: "UAZ-452 Ambulance",
        Ural4320_transport: "Ural-4320 Truck",
        Ural4320_transport_covered: "Ural-4320 Truck (covered)",
        Ural4320_Arsenal: "Ural-4320 Arsenal",
        Ural4320_repair: "Ural-4320 Repair",
        Ural4320_tanker: "Ural-4320 Tanker",
        Ural4320_command: "Ural-4320 Command",
        Ural4320_engineer: "Ural-4320 Engineer",
        BTR70_AFRF: "BTR-70",
        APC_K17_Berezok: "K-17 Bumerang (Berezok)",
        APC_K17_Berezok_camo1: "K-17 Bumerang (Berezok, camo)",
        APC_K17_Epoch: "K-17 Bumerang (Epoch)",
        APC_K17_unarmed: "K-17 Bumerang (unarmed)",
        K4386: "K-4386 Typhoon-VDV",
        K4386_Camo: "K-4386 Typhoon-VDV (camo)",
        K4386_Armed: "K-4386 Typhoon-VDV (armed)",
        K4386_Armed_Camo: "K-4386 Typhoon-VDV (armed, camo)",
        Mi8MT_unarmed_transport: "Mi-8MT (transport)",
        Mi8MT_armed_black: "Mi-8MT (armed)",
      },
      patrolVehicleKeys: ["UAZ469_PKM", "BTR70_AFRF", "K4386_Armed", "APC_K17_Berezok"],
      fortifications: {
        road: [
          `{ABB02215262D81F5}${P_FORT}/E_Checkpoint_S_AFRF_01.et`,
          `{6604D78A7DF6A2B0}${P_FORT}/E_Checkpoint_M_AFRF_01.et`,
          `{F2E2BC1F65033F03}${P_FORT}/E_Checkpoint_L_AFRF_01.et`,
          `{73E94833A736DB76}${P_FORT}/E_Barricade_L_AFRF_01.et`,
        ],
        roadside: [
          `{F18FA83D4652ADFB}${P_FORT}/E_Bunker_S_AFRF_01.et`,
          `{E8E71D5DB37608EC}${P_FORT}/E_MachineGunNest_S_AFRF_01.et`,
          `{84B329BD0FB287C2}${P_FORT}/E_MachineGunNest_S_AFRF_02.et`,
          `{25D1080027E15981}${P_FORT}/E_MachineGunNest_Scoped_S_AFRF_01.et`,
          `{F364717EAB490F27}${P_FORT}/E_SandbagPosition_S_AFRF_01.et`,
          `{9F30459E178D8009}${P_FORT}/E_SandbagPosition_S_AFRF_02.et`,
          `{7AAC09671B681762}${P_FORT}/E_SandbagPosition_S_AFRF_03.et`,
          `{47982C5F6E049E55}${P_FORT}/E_SandbagPosition_S_AFRF_04.et`,
        ],
      },
      defaultGroupSet: "MSV_Flora",
      // MSV rifle squads are 6-strong (counted from m_aUnitPrefabSlots).
      // ManeuverGroup declares only 2 unit slots — bucketed medium, not large.
      groupSets: {
        MSV_Flora: {
          label: "MSV (Flora)",
          sentry: `{73A7F75147CD0884}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_SentryTeam.et`,
          defense: { ref: `{D3940577D05FE450}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_RifleSquad.et`, size: 6 },
          small: [
            `{F009E2968D0327E4}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_LightFireTeam.et`,
            `{2CE91815C8234C9C}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_MachineGunTeam.et`,
            `{560B23D1584053BE}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_MedicalSection.et`,
            `{73A7F75147CD0884}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_SentryTeam.et`,
            `{D0273BB43CCC5B9D}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_Team_AT.et`,
            `{055A2C54B2F22CEB}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_Team_GL.et`,
            `{6275D9653D0F5054}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_Team_Suppress.et`,
          ],
          medium: [
            `{AB905EF799E0A0AE}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_FireGroup.et`,
            `{AD038CFD89AB81C7}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_ManeuverGroup.et`,
          ],
          large: [`{D3940577D05FE450}${P_MSV_G}/Flora/Group_RHS_RF_MSV_Flora_RifleSquad.et`],
        },
        MSV_VSR: {
          label: "MSV (VSR)",
          sentry: `{77313758E32191F4}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_SentryTeam.et`,
          defense: { ref: `{D702C57E74B37D20}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_RifleSquad.et`, size: 6 },
          small: [
            `{28BC4A33AC3B5BBB}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_LightFireTeam.et`,
            `{41E5EE94EB651A2F}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_MachineGunTeam.et`,
            `{3B07D5507B06050D}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_MedicalSection.et`,
            `{77313758E32191F4}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_SentryTeam.et`,
            `{750B62504EBDA441}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_Team_AT.et`,
            `{A07675B0C083D337}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_Team_GL.et`,
            `{BAC071C01C372C0B}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_Team_Suppress.et`,
          ],
          medium: [
            `{4E7F8EA6145579B3}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_FireGroup.et`,
            `{75B62458A893FD98}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_ManeuverGroup.et`,
          ],
          large: [`{D702C57E74B37D20}${P_MSV_G}/VSR/Group_RHS_RF_MSV_VSR_RifleSquad.et`],
        },
        MSV_VKPO_Summer: {
          label: "MSV (VKPO Summer)",
          sentry: `{85591815191600FC}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_SentryTeam.et`,
          defense: { ref: `{256AEA338E84EC28}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_RifleSquad.et`, size: 6 },
          small: [
            `{C210A32CAFFB7C28}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_AmmoTeam.et`,
            `{61DD5A8910ECF5C6}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_LightFireTeam.et`,
            `{2A667B5C63C8A92D}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_MachineGunTeam.et`,
            `{50844098F3ABB60F}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_MedicalSection.et`,
            `{C22DD62FE52FDE29}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_ReconTeam.et`,
            `{220AE7CEE8B2A12F}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_RadioReconTeam.et`,
            `{85591815191600FC}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_SentryTeam.et`,
            `{3C3A6867982DC57A}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_Team_AT.et`,
            `{E9477F871613B20C}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_Team_GL.et`,
            `{59890F7A5AA95897}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_Team_LAT.et`,
            `{F3A1617AA0E08276}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_Team_Suppress.et`,
          ],
          medium: [
            `{28574BDF21397789}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_FireGroup.et`,
            `{3CD734E2144453E5}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_ManeuverGroup.et`,
            `{0223367D44716E7B}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_PlatoonHQ.et`,
          ],
          large: [`{256AEA338E84EC28}${P_MSV_G}/VKPO_Summer/Group_RHS_RF_MSV_VKPO_S_RifleSquad.et`],
        },
        MSV_VKPO_Demiseason: {
          label: "MSV (VKPO Demi-season)",
          sentry: `{56FD583BBC989204}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_SentryTeam.et`,
          defense: { ref: `{F6CEAA1D2B0A7ED0}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_RifleSquad.et`, size: 6 },
          small: [
            `{F40CDA3D5A7B1CDF}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_LightFireTeam.et`,
            `{60E2D587BE5A9B43}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_MachineGunTeam.et`,
            `{1A00EE432E398461}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_MedicalSection.et`,
            `{7A82440DCA7B9056}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_ReconTeam.et`,
            `{823A051BD29CAAAE}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_RadioReconTeam.et`,
            `{56FD583BBC989204}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_SentryTeam.et`,
            `{0A8A59C10F0B2D8B}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_Team_AT.et`,
            `{DFF74E2181355AFD}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_Team_GL.et`,
            `{D30C5912E5B492C4}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_Team_LAT.et`,
            `{6670E1CEEA776B6F}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_Team_Suppress.et`,
          ],
          medium: [
            `{0ACD74AD27EEEE7D}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_FireGroup.et`,
            `{A906B4565ED3BAFC}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_ManeuverGroup.et`,
            `{BA8CA45F6B252004}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_PlatoonHQ.et`,
          ],
          large: [`{F6CEAA1D2B0A7ED0}${P_MSV_G}/VKPO_Demiseason/Group_RHS_RF_MSV_VKPO_DS_RifleSquad.et`],
        },
      },
    },
    RHS_ION: {
      label: "RHS ION PMC",
      // Existing member of RHS's FactionManager_Editor.et override (see RHS_USAF)
      entryGuid: "{623962205CE2B89C}",
      // Same callsign conf as USAF (RHS_ION.conf inherits CallsignInfo_US.conf
      // with the identical instance GUID)
      callsignGuid: "{5CC8BB97E017CDBC}",
      squadBase: ["{55CCB792D10AD8F4}", "{55CCB792D13759D8}", "{55CCB792D1218E95}", "{55CCB792D0C8B3CE}"],
      squadFifth: null,
      spawnPoint: "{F6678644B017C54D}PrefabsEditable/SpawnPoints/E_SpawnPoint_ION.et",
      // ENEMY-ONLY: plain ION character GUIDs are unrecoverable from the dump
      // (empty ION_Characters.conf; only *_Random group-filler variants are
      // referenced anywhere). No riflemen → the UI hides ION from the playable
      // dropdown.
      riflemen: {},
      loadoutSets: {},
      arsenalItems: [
        { mode: "WEAPON", ref: "{9C5C20FB0E01E64F}Prefabs/Weapons/Launchers/M72/Launcher_M72A3.et" },
        { mode: "AMMUNITION", ref: "{D8F2CA92583B23D3}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_M855_M856_Last_5Tracer.et" },
        { mode: "AMMUNITION", ref: "{546DA68AC0D47D36}Prefabs/Weapons/Magazines/PmagUnwindowed/Magazine_556x45_PMAG_30rnd_M855A1_last5tracer.et" },
        { mode: "AMMUNITION", ref: "{06D722FC2666EB83}Prefabs/Weapons/Magazines/Box_556x45_M249_200rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{EC9E0F22B90013F3}Prefabs/Weapons/Magazines/Magazine_762x51_M40_5rnd_M80.et" },
        { mode: "AMMUNITION", ref: "{5375FA7CB1F68573}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_M406.et" },
        { mode: "AMMUNITION", ref: "{98DB57ECEDC81CC2}Prefabs/Weapons/Ammo/Ammo_Flare_40mm_M583A1_White.et" },
        { mode: "", ref: "{E8F00BF730225B00}Prefabs/Weapons/Grenades/Grenade_M67.et" },
        { mode: "", ref: "{9DB69176CEF0EE97}Prefabs/Weapons/Grenades/Smoke_ANM8HC.et" },
        { mode: "", ref: "{D41D22DD1B8E921E}Prefabs/Weapons/Grenades/M18/Smoke_M18_Green.et" },
        { mode: "", ref: "{3343A055A83CB30D}Prefabs/Weapons/Grenades/M18/Smoke_M18_Red.et" },
        { mode: "", ref: "{14C1A0F061D9DDEE}Prefabs/Weapons/Grenades/M18/Smoke_M18_Violet.et" },
        { mode: "", ref: "{9BBDEE253A16CC66}Prefabs/Weapons/Grenades/M18/Smoke_M18_Yellow.et" },
        { mode: "", ref: "{33CBDE73AB48172A}Prefabs/Weapons/Explosives/DemoBlock_M112/DemoBlock_M112.et" },
        { mode: "", ref: "{49FFE8F373F55960}Prefabs/Weapons/Explosives/Mine_M15AT/Mine_M15AT.et" },
        { mode: "CONSUMABLE", ref: "{A81F501D3EF6F38E}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_US_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{00E36F41CA310E2A}Prefabs/Items/Medicine/SalineBag_01/SalineBag_US_01.et" },
        { mode: "CONSUMABLE", ref: "{D70216B1B2889129}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_US_01.et" },
        { mode: "", ref: "{C55821E8E86C074E}Prefabs/Items/Equipment/Radios/Radio_ANPRC152.et" },
      ],
      vehicles: {
        M1025_armed_M2HB_ION: "{950336877FC8B604}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_ION.et",
        M1025_armed_M2HB_MDO_ION: "{950336877FC8B605}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_MDO_ION.et",
        M1025_armed_M2HB_ION_D: "{59103017F394001A}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_ION_D.et",
        M1025_armed_M2HB_MDO_ION_D: "{F8510317523D6B46}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_MDO_ION_D.et",
        M1025_armed_M2HB_ION_Camo: "{855C78199FBCC53A}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_ION_Camo.et",
        M1025_armed_M2HB_MDO_ION_Camo: "{DB5CE10CC310B826}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_MDO_ION_Camo.et",
      },
      vehicleLabels: {
        M1025_armed_M2HB_ION: "M1025 M2HB",
        M1025_armed_M2HB_MDO_ION: "M1025 M2HB (MDO)",
        M1025_armed_M2HB_ION_D: "M1025 M2HB (desert)",
        M1025_armed_M2HB_MDO_ION_D: "M1025 M2HB (MDO, desert)",
        M1025_armed_M2HB_ION_Camo: "M1025 M2HB (camo)",
        M1025_armed_M2HB_MDO_ION_Camo: "M1025 M2HB (MDO, camo)",
      },
      patrolVehicleKeys: ["M1025_armed_M2HB_ION"],
      // ION has no own ConflictRHS fortification set — it reuses the USMC pool
      // (same pattern as FIA reusing the USSR pool in the vanilla catalogue)
      fortifications: {
        road: [
          `{EE1B4772E4F49744}${P_FORT}/E_Checkpoint_S_USMC_01.et`,
          `{23AFB2EDBF2FB401}${P_FORT}/E_Checkpoint_M_USMC_01.et`,
          `{B749D978A7DA29B2}${P_FORT}/E_Checkpoint_L_USMC_01.et`,
          `{36422D5465EFCDC7}${P_FORT}/E_Barricade_L_USMC_01.et`,
        ],
        roadside: [
          `{B424CD5A848BBB4A}${P_FORT}/E_Bunker_S_USMC_01.et`,
          `{AD4C783A71AF1E5D}${P_FORT}/E_MachineGunNest_S_USMC_01.et`,
          `{C1184CDACD6B9173}${P_FORT}/E_MachineGunNest_S_USMC_02.et`,
          `{B6CF141969901996}${P_FORT}/E_SandbagPosition_S_USMC_01.et`,
          `{DA9B20F9D55496B8}${P_FORT}/E_SandbagPosition_S_USMC_02.et`,
          `{3F076C00D9B101D3}${P_FORT}/E_SandbagPosition_S_USMC_03.et`,
          `{02334938ACDD88E4}${P_FORT}/E_SandbagPosition_S_USMC_04.et`,
        ],
      },
      defaultGroupSet: "ION_COY",
      groupSets: {
        ION_COY: {
          label: "ION PMC",
          sentry: `{516C8C7400DF2C4D}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_StaticSecurityTeam.et`,
          defense: { ref: `{51CA3A5A84652348}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_QuickReactionForce.et`, size: 10 },
          small: [
            `{7E4F9C92C7984C63}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_CloseProtectionTeam.et`,
            `{516C8C7400DF2C4D}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_StaticSecurityTeam.et`,
          ],
          medium: [
            `{6DAB535A749C809B}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_MobileSecurityTeam.et`,
            `{9996C84DED36E625}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_SpecialProjectsTeam.et`,
          ],
          large: [`{51CA3A5A84652348}${P_ION_G}/RHS_ION_COY/Group_RHS_ION_COY_QuickReactionForce.et`],
        },
      },
    },
  },
};
