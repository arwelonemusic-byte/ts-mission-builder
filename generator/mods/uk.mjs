// British Forces — mod content registry.
//
// Every GUID here is ground-truthed from AUTHORITATIVE inline `{GUID}path`
// references in the unpacked dump (D:\VSCode_dev\arma-reforger\reference\British Forces):
//   - faction entry:     Prefabs/MP/Managers/Factions/FactionManager_Editor.et (BF's override)
//   - groups:            Configs/EntityCatalog/UK/UK_Groups.conf
//   - characters:        Configs/EntityCatalog/UK/UK_Characters.conf
//   - vehicles:          Configs/EntityCatalog/UK/Vehicles_EntityCatalog_UK.conf
//   - spawn points:      Configs/Editor/PlaceableEntities/Systems/Systems.conf
//   - fortifications:    Configs/Editor/PlaceableEntities/Compositions/Compositions.conf
//   - arsenal items:     Configs/EntityCatalog/UK/Arsenal Lists/*.conf
//
// Like RHS, the dump has NO .meta files and prefab root `ID` lines are shared
// across files (not resource GUIDs) — catalog/registry .conf references only.
// Full raw harvest + exclusions: input/uk-harvest.md.
//
// The companion "British Forces: Truck, Utility" addon (66D74CE7E94C5D05) is
// deliberately NOT a dependency: as of 1.0.65 it contains zero unique content —
// all Land Rover prefabs it ships also exist inside British Forces with
// identical GUIDs, and it has no Configs/ to append anything (validated
// 2026-07-29 by full diff of both extractions).
//
// Reservists exist in the mod (both eras) but are excluded by design — not
// playable and not offered as enemy group sets.

const P_G83 = "Prefabs/Groups/BLUFOR/British Forces/1983";
const P_G89 = "Prefabs/Groups/BLUFOR/British Forces/1989";
const P_C83 = "Prefabs/Characters/Factions/BLUFOR/UK_Army/1983";
const P_C89 = "Prefabs/Characters/Factions/BLUFOR/UK_Army/1989";
const P_LR = "Prefabs/Vehicles/Wheeled/LR_3Series";
const P_FORT = "PrefabsEditable/Auto/Compositions/Slotted";

export const UK = {
  id: "uk",
  label: "British Forces",
  workshopUrl: "https://reforger.armaplatform.com/workshop/5AE50EC5B8D6F4AE",
  dependencies: ["5AE50EC5B8D6F4AE"],
  factions: {
    UK: {
      label: "British Military",
      // BF OVERRIDES the vanilla FactionManager_Editor.et prefab (same path,
      // same parent, same root ID 56B2B4776E6E4499), appending UK as a member
      // with m_bIsPlayable 0 — mission layers override that EXISTING member by
      // instance GUID (the validated RHS pattern).
      entryGuid: "{61500924662B6062}",
      // Inline SCR_FactionCallsignInfo in Configs/Factions/UK.conf, parented to
      // vanilla Callsigns_US.conf; its squad-name member GUIDs are identical to
      // vanilla US (it overrides them to A/C/E/G — we override them again)
      callsignGuid: "{5DA0F2A6677ADA9E}",
      squadBase: ["{55CCB792D10AD8F4}", "{55CCB792D13759D8}", "{55CCB792D1218E95}", "{55CCB792D0C8B3CE}"],
      squadFifth: null,
      // UK.conf declares m_aFriendlyFactionsIds { "US" } — friendliness is
      // symmetric, so a US-vs-UK mission clears it via the member override
      friendlyWith: ["US"],
      spawnPoint: "{75262929CD256E99}PrefabsEditable/SpawnPoints/E_SpawnPoint_UK.et",
      // HVT for Eliminate-HVT objectives (1989 Regulars = default subfaction)
      hvt: "{6D4AB9E422430636}Prefabs/Characters/Factions/BLUFOR/UK_Army/1989/Regulars/Character_UK_1989_Regulars_Officer.et",
      riflemen: {
        "1989 Regulars": `{4AF2023E868540E7}${P_C89}/Regulars/Character_UK_1989_Regulars_Rifleman.et`,
        "1989 Special Forces": `{A2F125ECA3AD0305}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Trooper.et`,
        "1983 Regulars": `{A6D0DBFAC6349E22}${P_C83}/Regulars/Character_UK_1983_Regulars_Rifleman.et`,
        "1983 Special Forces": `{0E74C9F36755655C}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Trooper.et`,
      },
      loadoutSets: {
        "1989 Regulars": [
          { name: "Rifleman", prefab: `{4AF2023E868540E7}${P_C89}/Regulars/Character_UK_1989_Regulars_Rifleman.et` },
          { name: "Rifleman (LAW 80)", prefab: `{B10659FFD99279DC}${P_C89}/Regulars/Character_UK_1989_Regulars_Rifleman_LAT_LAW80.et` },
          { name: "LSW Gunner", prefab: `{D0F124C1610D3232}${P_C89}/Regulars/Character_UK_1989_Regulars_LSW.et` },
          { name: "GPMG Gunner", prefab: `{111A85E9DD0EB2B6}${P_C89}/Regulars/Character_UK_1989_Regulars_GPMG_No1.et` },
          { name: "Assistant Machine-Gunner", prefab: `{146D4295E1E1DFF2}${P_C89}/Regulars/Character_UK_1989_Regulars_AMG.et` },
          { name: "MAW Gunner", prefab: `{02E60251E009D3BD}${P_C89}/Regulars/Character_UK_1989_Regulars_MAW_No1.et` },
          { name: "MAW Assistant", prefab: `{B317C07044D4B06F}${P_C89}/Regulars/Character_UK_1989_Regulars_Maw_No2.et` },
          { name: "Section Commander", prefab: `{7D7C6FBCBA40F45D}${P_C89}/Regulars/Character_UK_1989_Regulars_SectionCommander.et` },
          { name: "Section 2IC", prefab: `{F9E2E97FA21AA133}${P_C89}/Regulars/Character_UK_1989_Regulars_Section2IC.et` },
          { name: "Medic", prefab: `{59DC74EF0ECF7E49}${P_C89}/Regulars/Character_UK_1989_Regulars_Medic.et` },
          { name: "Radio Operator", prefab: `{323D2A366A8DAEED}${P_C89}/Regulars/Character_UK_1989_Regulars_RTO.et` },
          { name: "Sapper", prefab: `{08E104521DE26461}${P_C89}/Regulars/Character_UK_1989_Regulars_Sapper.et` },
          { name: "Sniper", prefab: `{68463C017BA8C3EB}${P_C89}/Regulars/Character_UK_1989_Regulars_Sniper.et` },
          { name: "Sergeant", prefab: `{B9CFB916A26682D6}${P_C89}/Regulars/Character_UK_1989_Regulars_Sergeant.et` },
          { name: "Platoon Leader", prefab: `{F487760AB6777BF3}${P_C89}/Regulars/Character_UK_1989_Regulars_PlatoonLeader.et` },
          { name: "Officer", prefab: `{6D4AB9E422430636}${P_C89}/Regulars/Character_UK_1989_Regulars_Officer.et` },
          { name: "Crew", prefab: `{21B95ED97AE24289}${P_C89}/Regulars/Character_UK_1989_Crew.et` },
          { name: "Helicopter Pilot", prefab: `{8329B91DB26C922D}${P_C89}/Regulars/Character_UK_1989_HeliPilot.et` },
        ],
        "1989 Special Forces": [
          { name: "SF Trooper", prefab: `{A2F125ECA3AD0305}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Trooper.et` },
          { name: "SF Patrol Leader", prefab: `{6FAAF2B4A124BA7F}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_SL.et` },
          { name: "SF Anti-Tank", prefab: `{B801B6E50A01209F}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_CharlieG.et` },
          { name: "SF Grenadier", prefab: `{101531EFC9E0E85B}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_GL.et` },
          { name: "SF Gunner", prefab: `{62D02E1AA4A4B305}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_GPMG.et` },
          { name: "SF LMG", prefab: `{CF564BD6D0DA773A}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_LMG.et` },
          { name: "SF Medic", prefab: `{58BD727F9736FC19}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Medic.et` },
          { name: "SF RTO", prefab: `{6471B09A37F58FD4}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_RTO.et` },
          { name: "SF Sapper", prefab: `{2B1775204D8A02F2}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Sapper.et` },
          { name: "SF Saboteur", prefab: `{02DCDBEC77E1257E}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Saboteur.et` },
          { name: "SF Sniper", prefab: `{98DC13CEC2967722}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Sniper.et` },
          { name: "SF Sniper (Covert)", prefab: `{94F4290723AD153B}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_SniperCovert.et` },
          { name: "SF Officer", prefab: `{9050187791D8C55D}${P_C89}/SpecialForces/Character_UK_1989_SpecialForces_Officer.et` },
        ],
        "1983 Regulars": [
          { name: "Rifleman", prefab: `{A6D0DBFAC6349E22}${P_C83}/Regulars/Character_UK_1983_Regulars_Rifleman.et` },
          { name: "Rifleman (LAT)", prefab: `{F5B9FF92DBFB520C}${P_C83}/Regulars/Character_UK_1983_Regulars_Rifleman_LAT.et` },
          { name: "Light Machine-Gunner", prefab: `{B3BBFBAC7CBF582E}${P_C83}/Regulars/Character_UK_1983_Regulars_L4LMG_No1.et` },
          { name: "GPMG Gunner", prefab: `{D005E20AE7CB8431}${P_C83}/Regulars/Character_UK_1983_Regulars_GPMG_No1.et` },
          { name: "Assistant Machine-Gunner", prefab: `{327FBCA6B02BC5A8}${P_C83}/Regulars/Character_UK_1983_Regulars_AMG.et` },
          { name: "MAW Gunner", prefab: `{8C380664085E4A89}${P_C83}/Regulars/Character_UK_1983_Regulars_MAW_No1.et` },
          { name: "MAW Assistant", prefab: `{E06C3284B49AC5A7}${P_C83}/Regulars/Character_UK_1983_Regulars_Maw_No2.et` },
          { name: "Section Commander", prefab: `{FFB42452E9AD5FFC}${P_C83}/Regulars/Character_UK_1983_Regulars_SectionCommander.et` },
          { name: "Section 2IC", prefab: `{2C69231254D1AEDB}${P_C83}/Regulars/Character_UK_1983_Regulars_Section2IC.et` },
          { name: "Medic", prefab: `{AF1B1F8F59BB3B0F}${P_C83}/Regulars/Character_UK_1983_Regulars_Medic.et` },
          { name: "Radio Operator", prefab: `{142FD4053B47B4B7}${P_C83}/Regulars/Character_UK_1983_Regulars_RTO.et` },
          { name: "Sapper", prefab: `{E41871B093958DD1}${P_C83}/Regulars/Character_UK_1983_Regulars_Sapper.et` },
          { name: "Sniper", prefab: `{FB8600CB9B527FCB}${P_C83}/Regulars/Character_UK_1983_Regulars_Sniper.et` },
          { name: "Sergeant", prefab: `{F1DC0DCDD8677485}${P_C83}/Regulars/Character_UK_1983_Regulars_Sergeant.et` },
          { name: "Platoon Leader", prefab: `{1958315C7F55F1AA}${P_C83}/Regulars/Character_UK_1983_Regulars_PlatoonLeader.et` },
          { name: "Officer", prefab: `{FCE20644BDD2D5CC}${P_C83}/Regulars/Character_UK_1983_Regulars_Officer.et` },
          { name: "Crew", prefab: `{834EA2EE05E27E41}${P_C83}/Regulars/Character_UK_1983_Crew.et` },
          { name: "Helicopter Pilot", prefab: `{B85BC71B4D06D60F}${P_C83}/Regulars/Character_UK_1983_HeliPilot.et` },
        ],
        "1983 Special Forces": [
          { name: "SF Trooper", prefab: `{0E74C9F36755655C}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Trooper.et` },
          { name: "SF Patrol Leader", prefab: `{541580A5EFB063CA}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_SL.et` },
          { name: "SF Anti-Tank", prefab: `{E62ADEF04A5A630C}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_CharlieG.et` },
          { name: "SF Grenadier", prefab: `{34480F9B2A83A8F3}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_GL.et` },
          { name: "SF LMG", prefab: `{6B8AAFA0B37BD53A}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_LMG.et` },
          { name: "SF Medic", prefab: `{DF457B105509006C}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Medic.et` },
          { name: "SF RTO", prefab: `{205F4DC054E25828}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_RTO.et` },
          { name: "SF Sapper", prefab: `{A97BEB8FF3472C18}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Sapper.et` },
          { name: "SF Saboteur", prefab: `{5CF7B3F937BA66ED}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Saboteur.et` },
          { name: "SF Sharpshooter", prefab: `{C7F673EEC46863F2}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Sharpshooter.et` },
          { name: "CRW Trooper", prefab: `{7778AEFBB5CE20AB}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_CRW.et` },
          { name: "SF Officer", prefab: `{4838874AA8CE9855}${P_C83}/SpecialForces/Character_UK_1983_SpecialForces_Officer.et` },
        ],
      },
      // Starter set (mixed-era by design, like the RHS baked sets) — pending
      // proper arsenal-items.md curation + review. Convention: no primary
      // weapons (players spawn with their issued weapon via loadouts) —
      // launchers/flares + ammo + mines/explosives + medical + utility only.
      arsenalItems: [
        { mode: "WEAPON", ref: "{E0CFA3FE78FC5190}Prefabs/Weapons/Launchers/M72/Launcher_LAW66_L1A1.et" },
        { mode: "WEAPON", ref: "{65DEE4A3BAAD1B1E}Prefabs/Weapons/Launchers/LAW80/Launcher_LAW80_base.et" },
        { mode: "WEAPON", ref: "{AE8BF1F7476AA76D}Prefabs/Weapons/Launchers/MAW_84MM/Launcher_84mm_MAW_Optic.et" },
        { mode: "WEAPON", ref: "{9361BEC03E52E6F8}Prefabs/Weapons/Handguns/Handheld Rocket Flares/Schermuly/Schermuly_Rocket_Flare_White.et" },
        { mode: "WEAPON", ref: "{5D694BB6F4A3819B}Prefabs/Weapons/Handguns/Handheld Rocket Flares/Schermuly/Schermuly_Rocket_Flare_Green.et" },
        { mode: "WEAPON", ref: "{CE4BDC1B0C4C6965}Prefabs/Weapons/Handguns/Handheld Rocket Flares/Schermuly/Schermuly_Rocket_Flare_Orange.et" },
        { mode: "AMMUNITION", ref: "{68CFC7B6DE0CC75F}Prefabs/Weapons/Magazines/Magazine_762x51_FAL_Commonwealth_20rnd_Ball.et" },
        { mode: "AMMUNITION", ref: "{1F32D9DE309EF634}Prefabs/Weapons/Magazines/Magazine_762x51_FAL_Commonwealth_20rnd_Tracer.et" },
        { mode: "AMMUNITION", ref: "{E882742A33858D5A}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_RadwayGreen_Ball.et" },
        { mode: "AMMUNITION", ref: "{91EA3DF1BA0AB1EF}Prefabs/Weapons/Magazines/Magazine_9x19_L2A3_34rnd_Ball.et" },
        { mode: "AMMUNITION", ref: "{D22DF40D07DA4615}Prefabs/Weapons/Magazines/Box_762x51_GPMG_100rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{610F92DFDCCCAF80}Prefabs/Weapons/Magazines/Magazine_762x51_Bren_Commonwealth_30rnd_Ball.et" },
        { mode: "AMMUNITION", ref: "{1E7D876C06089E21}Prefabs/Weapons/Magazines/Magazine_9x19_HiPower_13rnd_Ball.et" },
        { mode: "AMMUNITION", ref: "{F2E474689BD7C2E1}Prefabs/Weapons/Ammo/Ammo_Rocket_HEAT_L40.et" },
        { mode: "", ref: "{CE179546A16382BA}Prefabs/Weapons/Grenades/Grenade_L2A2.et" },
        { mode: "", ref: "{77A25EFFE26D8A7E}Prefabs/Weapons/Grenades/Smoke_No83_Green.et" },
        { mode: "", ref: "{4C075BF50FD8C069}Prefabs/Weapons/Grenades/Smoke_No83_Red.et" },
        { mode: "", ref: "{1F9E536AD45F48C7}Prefabs/Weapons/Explosives/DemoBlock_PE4/DemoBlock_PE4.et" },
        { mode: "", ref: "{07D3AD1BE6EA2AB2}Prefabs/Weapons/Explosives/Mine_Mk7/Mine_Mk7.et" },
        { mode: "", ref: "{74369C511864A660}Prefabs/Weapons/Explosives/Mine_L9A1_Barmine/Mine_L9A1_Barmine.et" },
        { mode: "CONSUMABLE", ref: "{E67E7932C86FBB96}Prefabs/Items/Medicine/FieldDressing_UK_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "", ref: "{9065E77698E63C1B}Prefabs/Items/Equipment/Binoculars/Binoculars_L12A1_Avimo.et" },
        { mode: "", ref: "{1A7FE1AC9E645F27}Prefabs/Items/Equipment/Radios/Radio_PRC349.et" },
        // Backpacks (identical in both era catalogs — no subfaction split needed)
        { mode: "", ref: "{0960A1A0B891F243}Prefabs/Items/Equipment/Backpacks/Rucksack_P58_Large_Pack.et" },
        { mode: "", ref: "{816B4F309B3B3D39}Prefabs/Items/Equipment/Backpacks/Rucksack_GS_assembled.et" },
        { mode: "", ref: "{25F3E9A9A45B3C58}Prefabs/Items/Equipment/Backpacks/Backpack_Para_Bergen.et" },
        { mode: "", ref: "{4BA48D3B0E53DF91}Prefabs/Items/Equipment/Backpacks/Rucksack_84mm_MAW_Carrier.et" },
      ],
      vehicles: {
        LR3_SWB_transport: `{EDEAE951AFF2A836}${P_LR}/3Series_SWB_Transport.et`,
        LR3_SWB_covered: `{A1B40BD7EDC01F07}${P_LR}/3Series_SWB_Transport_Covered.et`,
        LR3_SWB_GPMG: `{CC4DFA3A23A5BA41}${P_LR}/3Series_SWB_GPMG.et`,
        LR3_LWB_transport: `{701ADC27F9D842DF}${P_LR}/3Series_LWB_Transport.et`,
        LR3_LWB_cargo: `{F6F447710C03EE43}${P_LR}/3Series_LWB_Cargo.et`,
        LR3_LWB_GPMG: `{A8031273F082DA77}${P_LR}/3Series_LWB_GPMG.et`,
        LR3_LWB_recce: `{53982BB1E5E3BE60}${P_LR}/3Series_LWB_Recce.et`,
        LR3_LWB_recce_M2HB: `{57FE9BCA625CA0E3}${P_LR}/3Series_LWB_Recce_M2HB.et`,
        M997_ambulance_UK: "{671AA29846EC7406}Prefabs/Vehicles/Wheeled/M998/M997_maxi_ambulance_UK.et",
        M923A1_transport_covered_UK: "{F9FD7E24B28538EE}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport_covered_UK.et",
        M923A1_tanker_UK: "{6B3DF3AEFC3B0B16}Prefabs/Vehicles/Wheeled/M923A1/M923A1_tanker_UK.et",
        M923A1_arsenal_UK: "{F5075485634B4226}Prefabs/Vehicles/Wheeled/M923A1/M923A1_arsenal_UK.et",
        M923A1_repair_UK: "{19205B4B546E80E6}Prefabs/Vehicles/Wheeled/M923A1/M923A1_repair_UK.et",
        M923A1_engineer_UK: "{01597DBC9F50FC47}Prefabs/Vehicles/Wheeled/M923A1/M923A1_engineer_UK.et",
        BRDM2_UK: "{44338ACCBD5D7D29}Prefabs/Vehicles/Wheeled/Conflict_Variants/BF_BRDM2_Conflict_UK.et",
        UH1H_UK: "{33ED4D9D86F595C6}Prefabs/Vehicles/Helicopters/UH1H/UH1H_UK.et",
        UH1H_armed_UK: "{3026F7740CC47876}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_UK.et",
        UH1H_gunship_UK: "{CD887C4D54D7F827}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_gunship_HE_UK.et",
      },
      vehicleLabels: {
        LR3_SWB_transport: "Land Rover SWB",
        LR3_SWB_covered: "Land Rover SWB (covered)",
        LR3_SWB_GPMG: "Land Rover SWB GPMG",
        LR3_LWB_transport: "Land Rover LWB",
        LR3_LWB_cargo: "Land Rover LWB Cargo",
        LR3_LWB_GPMG: "Land Rover LWB GPMG",
        LR3_LWB_recce: "Land Rover Recce",
        LR3_LWB_recce_M2HB: "Land Rover Recce M2HB",
        M997_ambulance_UK: "M997 Ambulance",
        M923A1_transport_covered_UK: "M923A1 Truck (covered)",
        M923A1_tanker_UK: "M923A1 Tanker",
        M923A1_arsenal_UK: "M923A1 Arsenal",
        M923A1_repair_UK: "M923A1 Repair",
        M923A1_engineer_UK: "M923A1 Engineer",
        BRDM2_UK: "BRDM-2 (captured)",
        UH1H_UK: "UH-1H",
        UH1H_armed_UK: "UH-1H (armed)",
        UH1H_gunship_UK: "UH-1H Gunship",
      },
      patrolVehicleKeys: ["LR3_SWB_GPMG", "LR3_LWB_GPMG", "LR3_LWB_recce", "LR3_LWB_recce_M2HB", "BRDM2_UK"],
      transportVehicleKeys: ["LR3_SWB_transport", "LR3_LWB_transport", "M923A1_transport_covered_UK"],
      // Mounted-patrol / vehicle-QRF crew — always emitted (m_aCrewPrefabPool)
      // so captured/borrowed vehicles never spawn their prefab-default crews
      patrolCrew: [
        `{4AF2023E868540E7}${P_C89}/Regulars/Character_UK_1989_Regulars_Rifleman.et`,
        `{D0F124C1610D3232}${P_C89}/Regulars/Character_UK_1989_Regulars_LSW.et`,
        `{B10659FFD99279DC}${P_C89}/Regulars/Character_UK_1989_Regulars_Rifleman_LAT_LAW80.et`,
        `{F9E2E97FA21AA133}${P_C89}/Regulars/Character_UK_1989_Regulars_Section2IC.et`,
        `{59DC74EF0ECF7E49}${P_C89}/Regulars/Character_UK_1989_Regulars_Medic.et`,
      ],
      // UK-skinned vanilla-US-based Conflict compositions
      fortifications: {
        road: [
          `{FD5AFA14D7534DB5}${P_FORT}/SlotRoadSmall/E_Checkpoint_S_UK_01.et`,
          `{289456BF55DFF7D2}${P_FORT}/SlotRoadMedium/E_Checkpoint_M_UK_01.et`,
          `{5292BB67357D33BA}${P_FORT}/SlotRoadLarge/E_Checkpoint_L_UK_01.et`,
          `{8292C2E626734340}${P_FORT}/SlotRoadSmall/E_Barricade_S_UK_01.et`,
          `{3ACDCEF1C55D1669}${P_FORT}/SlotRoadMedium/E_Barricade_M_UK_01.et`,
          `{8FC6FAF50E965D2E}${P_FORT}/SlotRoadLarge/E_Barricade_L_UK_01.et`,
        ],
        roadside: [
          `{BD55AC66ECD13DFB}${P_FORT}/SlotFlatSmall/E_Bunker_S_UK_01.et`,
          `{57E37A743AFC04AF}${P_FORT}/SlotFlatSmall/E_MachineGunNest_S_UK_01.et`,
          `{3BB74E9486388B81}${P_FORT}/SlotFlatSmall/E_MachineGunNest_S_UK_02.et`,
          `{ED390D93C971810B}${P_FORT}/SlotFlatSmall/E_SandbagPosition_S_UK_01.et`,
          `{816D397375B50E25}${P_FORT}/SlotFlatSmall/E_SandbagPosition_S_UK_02.et`,
          `{64F1758A7950994E}${P_FORT}/SlotFlatSmall/E_SandbagPosition_S_UK_03.et`,
          `{59C550B20C3C1079}${P_FORT}/SlotFlatSmall/E_SandbagPosition_S_UK_04.et`,
        ],
      },
      defaultGroupSet: "Regulars_1989",
      groupSets: {
        Regulars_1989: {
          label: "Regulars (1989)",
          sentry: `{E8DF4E522B10298E}${P_G89}/Group_UK_1989_Regulars_MachineGunTeam.et`,
          defense: { ref: `{031596647BF760C1}${P_G89}/Group_UK_1989_Regulars_InfantrySection.et`, size: 8 },
          small: [
            `{E8DF4E522B10298E}${P_G89}/Group_UK_1989_Regulars_MachineGunTeam.et`,
            `{88CA4BED4F558F6F}${P_G89}/Group_UK_1989_Regulars_Team_AT.et`,
            `{AEE1030C6A66E9C0}${P_G89}/Group_UK_1989_Regulars_SniperTeam.et`,
            `{B50504459A0323B8}${P_G89}/Group_UK_1989_Regulars_RecceTeam.et`,
            `{EBA6F44BF1B3010F}${P_G89}/Group_UK_1989_Regulars_MedicalSection.et`,
            `{A0C411E558DF236F}${P_G89}/Group_UK_1989_Regulars_GunGroup.et`,
            `{9E8AAE0330DB7324}${P_G89}/Group_UK_1989_Regulars_AmmoTeam.et`,
            `{C60BEEF357183A23}${P_G89}/Group_UK_1989_Regulars_SapperTeam.et`,
          ],
          medium: [
            `{D1BA6BC45BDCA015}${P_G89}/Group_UK_1989_Regulars_FireTeam.et`,
            `{09C8B74EAE1A0ADA}${P_G89}/Group_UK_1989_Regulars_Brick.et`,
            `{019AB1B6B9E28257}${P_G89}/Group_UK_1989_Regulars_RifleGroup.et`,
            `{756BBB58355968B1}${P_G89}/Group_UK_1989_Regulars_PlatoonHQ.et`,
          ],
          large: [`{031596647BF760C1}${P_G89}/Group_UK_1989_Regulars_InfantrySection.et`],
        },
        SF_1989: {
          label: "Special Forces (1989)",
          sentry: `{711B73BBB94DAEF8}${P_G89}/Group_UK_1989_SpecialForces_Patrol.et`,
          defense: { ref: `{441092B8CDA4A0BB}${P_G89}/Group_UK_1989_SpecialForces_Team.et`, size: 8 },
          small: [`{711B73BBB94DAEF8}${P_G89}/Group_UK_1989_SpecialForces_Patrol.et`],
          medium: [`{711B73BBB94DAEF8}${P_G89}/Group_UK_1989_SpecialForces_Patrol.et`],
          large: [`{441092B8CDA4A0BB}${P_G89}/Group_UK_1989_SpecialForces_Team.et`],
        },
        Regulars_1983: {
          label: "Regulars (1983)",
          sentry: `{B8A563E00A634114}${P_G83}/Group_UK_1983_Regulars_MachineGunTeam.et`,
          defense: { ref: `{4679AD5C647BBE6A}${P_G83}/Group_UK_1983_Regulars_InfantrySection.et`, size: 8 },
          small: [
            `{B8A563E00A634114}${P_G83}/Group_UK_1983_Regulars_MachineGunTeam.et`,
            `{7EA45A04944D66B8}${P_G83}/Group_UK_1983_Regulars_Team_AT.et`,
            `{05BEF3A0665B78FF}${P_G83}/Group_UK_1983_Regulars_SniperTeam.et`,
            `{6D09BE2E2DE3007B}${P_G83}/Group_UK_1983_Regulars_RecceTeam.et`,
            `{C24758249A005E36}${P_G83}/Group_UK_1983_Regulars_MedicalSection.et`,
            `{A54348BD64AE32BB}${P_G83}/Group_UK_1983_Regulars_GunGroup.et`,
            `{B7C4064815CF5683}${P_G83}/Group_UK_1983_Regulars_AmmoTeam.et`,
            `{0981675634D93A6B}${P_G83}/Group_UK_1983_Regulars_SapperTeam.et`,
          ],
          medium: [
            `{31C628F860EBBD49}${P_G83}/Group_UK_1983_Regulars_Brick.et`,
            `{0409ED4DA691D6FB}${P_G83}/Group_UK_1983_Regulars_RifleGroup.et`,
            `{AD075E7C8CBDB029}${P_G83}/Group_UK_1983_Regulars_PlatoonHQ.et`,
          ],
          large: [`{4679AD5C647BBE6A}${P_G83}/Group_UK_1983_Regulars_InfantrySection.et`],
        },
        SF_1983: {
          label: "Special Forces (1983)",
          sentry: `{578C0EE14EC8EF4D}${P_G83}/Group_UK_1983_SpecialForces_Patrol.et`,
          defense: { ref: `{C6330C2C7FD9A911}${P_G83}/Group_UK_1983_SpecialForces_Team.et`, size: 8 },
          small: [`{578C0EE14EC8EF4D}${P_G83}/Group_UK_1983_SpecialForces_Patrol.et`],
          medium: [`{578C0EE14EC8EF4D}${P_G83}/Group_UK_1983_SpecialForces_Patrol.et`],
          large: [`{C6330C2C7FD9A911}${P_G83}/Group_UK_1983_SpecialForces_Team.et`],
        },
      },
    },
  },
};
