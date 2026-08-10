// Arma II Factions — "Arma II Factions" (5F396C4F713595DB) by Sestenz.
// CDF / ChDKZ / NAPA integrated (2026-08-10); the mod's three Takistani
// factions (Ses_TKA/TKG/TKR) are deliberately SKIPPED (user call — TKG is a
// shell with no groups/roster anyway, TKR ships no spawn point).
//
// Pattern = the validated RHS entryGuid path: the mod overrides the vanilla
// FactionManager_Editor.et (same root ID 56B2B4776E6E4499) appending its
// factions as conf-ref members with m_bIsPlayable 0 — mission layers override
// those EXISTING members by instance GUID exactly like vanilla factions.
// All three factions are REAL factions (own keys, callsigns, spawn points) —
// playable AND enemy-capable.
//
// Callsigns: each faction's conf references the VANILLA callsign conf of its
// archetype with no squad-name overrides (CDF→Callsigns_US, ChDKZ→
// Callsigns_USSR, NAPA→Callsigns_FIA) — so squadBase reuses the vanilla
// squad-member GUIDs; only the m_CallsignInfo instance GUIDs are mod-specific
// (ChDKZ's is byte-identical to vanilla USSR's — copy-paste, like UK did
// with US).
//
// friendlyWith (declared in the mod's confs, symmetric one-sided): CDF→US +
// RHS_USAF, ChDKZ→USSR + RHS_AFRF — the existing clearing machinery blocks
// the friendship when such a pair are the two mission sides. NAPA declares
// none (hostile to everyone).
//
// The *_Random characters are unarmed-base VariantData wrappers (MEI/Bandits
// pattern — verified CDF Rifleman_Random: variant table, zero weapons):
// group slots use them freely, but hvt/patrolCrew below are CONCRETE only.
// NAPA's ChDKZ-style catalog conf is a copy-paste bug (lists vanilla USSR
// characters) — the NAPA roster GUIDs were recovered from the Random
// wrappers' variant tables (ION trick). Character_CDF_Officer.et ships but
// appears in NO conf (no GUID source) → CDF hvt = PL, same as SFS US.
//
// GUID sources: FactionManager_Editor.et (entry GUIDs), Ses_Groups_A2F.conf
// (all groups), Ses_Veh_A2F.conf (vehicles), Ses_Props_A2F.conf (spawn
// points), per-faction EntityCatalog character confs + Random variant tables
// (characters). Full harvest: input/arma2-harvest.md.
//
// Arsenal = the vanilla USSR set (CDF/ChDKZ) / vanilla FIA set (NAPA) copied
// verbatim — STARTER CUT: the factions carry RHS weapons, so the vanilla AK
// magazines may not fit their primaries (launcher rounds/medical/utility are
// universal). Fortifications reuse vanilla USSR pools (Soviet-equipped
// forces — MEI precedent). Dependency anchor: the mod itself; its .gproj
// pulls RHS (595F2BF2F44836FB) + TacticalFlava (5D550926D43F1409)
// transitively.
const P_CDF_C = "Prefabs/Characters/Factions/BLUFOR/CDF_Army";
const P_CDF_G = "Prefabs/Groups/BLUFOR/Ses_CDF";
const P_CHD_C = "Prefabs/Characters/Factions/OPFOR/ChDKZ";
const P_CHD_G = "Prefabs/Groups/OPFOR/Ses_ChDKZ";
const P_NAPA_C = "Prefabs/Characters/Factions/INDFOR/NAPA";
const P_NAPA_G = "Prefabs/Groups/INDFOR/Ses_NAPA";
const P_SLOT = "Prefabs/Compositions/Slotted";

// Vanilla USSR fortification pools (shared by all three factions)
const A2_FORTS = {
  road: [
    `{9483333BFD9E2D0F}${P_SLOT}/SlotRoadSmall/Checkpoint_S_USSR_01.et`,
    `{7C85836D444E3797}${P_SLOT}/SlotRoadMedium/Checkpoint_M_USSR_01.et`,
    `{2A27606856B8A914}${P_SLOT}/SlotRoadLarge/Barricade_L_USSR_01.et`,
    `{9F9924B626C5FA2C}${P_SLOT}/SlotRoadLarge/Checkpoint_L_USSR_01.et`,
  ],
  roadside: [
    `{7492BAA88AFCEDCE}${P_SLOT}/SlotFlatSmall/Bunker_S_USSR_01.et`,
    `{DFBF655559915333}${P_SLOT}/SlotFlatSmall/GuardTower_S_USSR_01.et`,
    `{7A40BF128BB47EFD}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_USSR_01.et`,
    `{114DE81321786CD9}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_USSR_01_PKM.et`,
    `{16148BF23770F1D3}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_USSR_02.et`,
    `{084825E68F0FAF86}${P_SLOT}/SlotFlatSmall/MachineGunNest_Scoped_S_USSR_01.et`,
    `{8E1DF47DD56E69E6}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_USSR_01.et`,
    `{E249C09D69AAE6C8}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_USSR_02.et`,
    `{07D58C64654F71A3}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_USSR_03.et`,
    `{3AE1A95C1023F894}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_USSR_04.et`,
  ],
};

// Vanilla USSR arsenal set (starter cut — see header)
const A2_ARSENAL_SOVIET = [
  { mode: "WEAPON", ref: "{722CE6FEC39EE896}Prefabs/Weapons/Launchers/RPG22/Launcher_RPG22.et" },
  { mode: "WEAPON", ref: "{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et" },
  { mode: "WEAPON", ref: "{36218D5F0C7095E6}Prefabs/Weapons/Flares/Flare_RSP30_red.et" },
  { mode: "WEAPON", ref: "{FC79F6BDEB7F1BC2}Prefabs/Weapons/Flares/Flare_RSP30_green.et" },
  { mode: "AMMUNITION", ref: "{0A84AA5A3884176F}Prefabs/Weapons/Magazines/Magazine_545x39_AK_30rnd_Last_5Tracer.et" },
  { mode: "AMMUNITION", ref: "{BC74DAC891D48540}Prefabs/Weapons/Magazines/Magazine_545x39_RPK_45rnd_Ball.et" },
  { mode: "AMMUNITION", ref: "{E5E9C5897CF47F44}Prefabs/Weapons/Magazines/Box_762x54_PK_100rnd_4Ball_1Tracer.et" },
  { mode: "AMMUNITION", ref: "{9CCB46C6EE632C1A}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_Sniper.et" },
  { mode: "AMMUNITION", ref: "{32E12D322E107F1C}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VM.et" },
  { mode: "AMMUNITION", ref: "{609E216CBF8D0B68}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VL.et" },
  { mode: "AMMUNITION", ref: "{AA658D334766D4EE}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VR.et" },
  { mode: "AMMUNITION", ref: "{262F0D09C4130826}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_VOG25.et" },
  { mode: "AMMUNITION", ref: "{906F07BD0366E08F}Prefabs/Weapons/Ammo/Ammo_Flare_40mm_VG40OP_White.et" },
  { mode: "", ref: "{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et" },
  { mode: "", ref: "{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et" },
  { mode: "", ref: "{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et" },
  { mode: "", ref: "{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et" },
  { mode: "", ref: "{B05A816C0BF50802}Prefabs/Weapons/Explosives/Mine_PMN4/Mine_PMN4.et" },
  { mode: "", ref: "{D6EF54367CECE1D9}Prefabs/Weapons/Explosives/Mine_TM62M/Mine_TM62M.et" },
  { mode: "CONSUMABLE", ref: "{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et" },
  { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
  { mode: "CONSUMABLE", ref: "{527D7C5D2E476BDC}Prefabs/Items/Medicine/SalineBag_01/SalineBag_USSR_01.et" },
  { mode: "CONSUMABLE", ref: "{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et" },
  { mode: "", ref: "{3DE0155EC9767B98}Prefabs/Items/Equipment/Backpacks/Backpack_Veshmeshok.et" },
  { mode: "", ref: "{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et" },
];

// Vanilla FIA arsenal set for NAPA (starter cut)
const A2_ARSENAL_GUERRILLA = [
  { mode: "WEAPON", ref: "{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et" },
  { mode: "WEAPON", ref: "{36218D5F0C7095E6}Prefabs/Weapons/Flares/Flare_RSP30_red.et" },
  { mode: "WEAPON", ref: "{FC79F6BDEB7F1BC2}Prefabs/Weapons/Flares/Flare_RSP30_green.et" },
  { mode: "AMMUNITION", ref: "{A827B610B7CD4158}Prefabs/Weapons/Magazines/Vz58/Magazine_762x39_Vz58_30rnd_Last_5Tracer.et" },
  { mode: "AMMUNITION", ref: "{03094E059B554A9C}Prefabs/Weapons/Magazines/UK59/Box_762x54_UK59_50rnd_4Ball_1Tracer.et" },
  { mode: "AMMUNITION", ref: "{77595CB9F596E6AC}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_LPS.et" },
  { mode: "AMMUNITION", ref: "{9CCB46C6EE632C1A}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_Sniper.et" },
  { mode: "AMMUNITION", ref: "{32E12D322E107F1C}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VM.et" },
  { mode: "AMMUNITION", ref: "{609E216CBF8D0B68}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VL.et" },
  { mode: "AMMUNITION", ref: "{AA658D334766D4EE}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VR.et" },
  { mode: "", ref: "{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et" },
  { mode: "", ref: "{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et" },
  { mode: "", ref: "{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et" },
  { mode: "", ref: "{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et" },
  { mode: "", ref: "{B05A816C0BF50802}Prefabs/Weapons/Explosives/Mine_PMN4/Mine_PMN4.et" },
  { mode: "", ref: "{D6EF54367CECE1D9}Prefabs/Weapons/Explosives/Mine_TM62M/Mine_TM62M.et" },
  { mode: "CONSUMABLE", ref: "{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et" },
  { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
  { mode: "CONSUMABLE", ref: "{527D7C5D2E476BDC}Prefabs/Items/Medicine/SalineBag_01/SalineBag_USSR_01.et" },
  { mode: "CONSUMABLE", ref: "{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et" },
  { mode: "", ref: "{FDA7B6630DB87991}Prefabs/Items/Equipment/Backpacks/Backpack_M70_Swiss.et" },
  { mode: "", ref: "{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et" },
];

export const ARMA2 = {
  id: "arma2",
  label: "Arma II Factions",
  workshopUrl: "https://reforger.armaplatform.com/workshop/5F396C4F713595DB",
  dependencies: ["5F396C4F713595DB"],
  factions: {
    Ses_CDF: {
      label: "CDF — Chernarussian Defence Forces",
      entryGuid: "{5D9F7285A1D004FE}",
      // m_CallsignInfo instance in Ses_CDF.conf (references vanilla Callsigns_US)
      callsignGuid: "{6874070850B730C6}",
      squadBase: ["{55CCB792D10AD8F4}", "{55CCB792D13759D8}", "{55CCB792D1218E95}", "{55CCB792D0C8B3CE}"],
      squadFifth: null,
      friendlyWith: ["US", "RHS_USAF"],
      spawnPoint: "{367B6C75494ECA6B}PrefabsEditable/SpawnPoints/E_SpawnPoint_Ses_CDF.et",
      // No GUID source exists for Character_CDF_Officer.et → PL
      hvt: `{756D4054410A1927}${P_CDF_C}/Character_CDF_PL.et`,
      riflemen: {
        "CDF Army": `{9DE22FB5586591CC}${P_CDF_C}/Character_CDF_Rifleman.et`,
      },
      loadoutSets: {
        "CDF Army": [
          { name: "Rifleman", prefab: `{9DE22FB5586591CC}${P_CDF_C}/Character_CDF_Rifleman.et` },
          { name: "Automatic Rifleman", prefab: `{7B9EAE5EB616387A}${P_CDF_C}/Character_CDF_AR.et` },
          { name: "Machine Gunner", prefab: `{29897044D8592C99}${P_CDF_C}/Character_CDF_MG.et` },
          { name: "Asst. Machine Gunner", prefab: `{2A4051EDC38853A7}${P_CDF_C}/Character_CDF_AMG.et` },
          { name: "Grenadier", prefab: `{764BD07F41A15150}${P_CDF_C}/Character_CDF_GL.et` },
          { name: "Anti-tank", prefab: `{A336C79FCF9F2626}${P_CDF_C}/Character_CDF_AT.et` },
          { name: "Asst. Anti-tank", prefab: `{A0FFE636D44E5918}${P_CDF_C}/Character_CDF_AAT.et` },
          { name: "Medic", prefab: `{F051151C98DB30CD}${P_CDF_C}/Character_CDF_Medic.et` },
          { name: "RTO", prefab: `{7C646869CFA3B721}${P_CDF_C}/Character_CDF_RTO.et` },
          { name: "Sharpshooter", prefab: `{BCC61BCFB0FBC6BF}${P_CDF_C}/Character_CDF_Sharpshooter.et` },
          { name: "Spotter", prefab: `{0779E285709FDE15}${P_CDF_C}/Character_CDF_Spotter.et` },
          { name: "SL", prefab: `{16165F4184929A69}${P_CDF_C}/Character_CDF_SL.et` },
          { name: "PL", prefab: `{756D4054410A1927}${P_CDF_C}/Character_CDF_PL.et` },
          { name: "Crew", prefab: `{930302D9F14EEFC0}${P_CDF_C}/Character_CDF_Crew.et` },
          { name: "Crew Commander", prefab: `{7766953EDCFC5F06}${P_CDF_C}/Character_CDF_CC.et` },
          { name: "Heli Pilot", prefab: `{990951B11778B1D8}${P_CDF_C}/Character_CDF_HeliPilot.et` },
          { name: "Heli Crew", prefab: `{6CB62AE5BE36AA18}${P_CDF_C}/Character_CDF_HeliCrew.et` },
        ],
      },
      arsenalItems: A2_ARSENAL_SOVIET,
      vehicles: {
        UAZ469_CDF: "{A36B7742CB4CC488}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_Ses_CDF.et",
        UAZ469_uncovered_CDF: "{37DA845E90392CAE}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_uncovered_Ses_CDF.et",
        UAZ452_transport_CDF: "{F57C79AD8C847274}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_transport_CDF.et",
        UAZ452_ambulance_CDF: "{B8712D3815A12B80}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_ambulance_CDF.et",
        UAZ452_cargo_CDF: "{17C7BC2F234DC252}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_cargo_CDF.et",
        M998_CDF: "{2ED080DF6331F96C}Prefabs/Vehicles/Wheeled/M998/M998_Ses_CDF.et",
        M998_covered_CDF: "{DC1EC1C3D981099C}Prefabs/Vehicles/Wheeled/M998/M998_covered_Ses_CDF.et",
        M998_covered_long_CDF: "{405603C5E132D095}Prefabs/Vehicles/Wheeled/M998/M998_covered_long_Ses_CDF.et",
        M997_ambulance_CDF: "{4009925F627ACC58}Prefabs/Vehicles/Wheeled/M998/M997_maxi_ambulance_Ses_CDF.et",
        M1025_CDF: "{0D07BF4156645F90}Prefabs/Vehicles/Wheeled/M998/M1025_Ses_CDF.et",
        M1025_armed_M2HB_CDF: "{35D71FBBC41EF23B}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_Ses_CDF.et",
        BRDM2_CDF: "{0CB42A0E046DAD18}Prefabs/Vehicles/Wheeled/BRDM2/BRDM2_CDF.et",
        BTR70_CDF: "{52441D784D145D52}Prefabs/Vehicles/Wheeled/BTR70/BTR70_Ses_CDF.et",
        Ural4320_transport_CDF: "{95C19D971E734B61}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_transport.et",
        Ural4320_transport_covered_CDF: "{0EFFC9A8E672EF33}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_transport_covered.et",
        Ural4320_ammo_CDF: "{130022A09F0B79DD}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_ammo.et",
        Ural4320_command_CDF: "{B8C6D4393223FDC2}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_command.et",
        Ural4320_engineer_CDF: "{FE22FEC101ED24BA}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_engineer.et",
        Ural4320_repair_CDF: "{D23974B5B13AF002}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_repair.et",
        Ural4320_tanker_CDF: "{10BAF58D6690A1E4}Prefabs/Vehicles/Wheeled/Ural4320/Ses_CDF/Ural4320_Ses_CDF_tanker.et",
        Mi8MT_CDF: "{F81699EAF73DD999}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_CDF.et",
        Mi8MT_armed_CDF: "{1F8AE9B33AB52BF5}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed_Ses_CDF.et",
        Mi8MT_gunship_HE_CDF: "{D8B8D5CF241082C2}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed_gunship_HE_Ses_CDF.et",
        Mi8MT_gunship_HEDP_CDF: "{0F1FEC9C41E7DAC5}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed_gunship_HEDP_Ses_CDF.et",
      },
      vehicleLabels: {
        UAZ469_CDF: "UAZ-469",
        UAZ469_uncovered_CDF: "UAZ-469 (uncovered)",
        UAZ452_transport_CDF: "UAZ-452 Van",
        UAZ452_ambulance_CDF: "UAZ-452 Ambulance",
        UAZ452_cargo_CDF: "UAZ-452 Cargo",
        M998_CDF: "M998 HMMWV",
        M998_covered_CDF: "M998 HMMWV (covered)",
        M998_covered_long_CDF: "M998 HMMWV (long)",
        M997_ambulance_CDF: "M997 Ambulance",
        M1025_CDF: "M1025 HMMWV",
        M1025_armed_M2HB_CDF: "M1025 M2HB",
        BRDM2_CDF: "BRDM-2",
        BTR70_CDF: "BTR-70",
        Ural4320_transport_CDF: "Ural-4320 Truck",
        Ural4320_transport_covered_CDF: "Ural-4320 Truck (covered)",
        Ural4320_ammo_CDF: "Ural-4320 Ammo Truck",
        Ural4320_command_CDF: "Ural-4320 Command Truck",
        Ural4320_engineer_CDF: "Ural-4320 Engineer Truck",
        Ural4320_repair_CDF: "Ural-4320 Repair Truck",
        Ural4320_tanker_CDF: "Ural-4320 Fuel Tanker",
        Mi8MT_CDF: "Mi-8MT Transport",
        Mi8MT_armed_CDF: "Mi-8MT (armed)",
        Mi8MT_gunship_HE_CDF: "Mi-8MT Gunship HE",
        Mi8MT_gunship_HEDP_CDF: "Mi-8MT Gunship HEDP",
      },
      patrolVehicleKeys: ["M1025_armed_M2HB_CDF", "BRDM2_CDF", "BTR70_CDF"],
      transportVehicleKeys: ["UAZ469_CDF", "Ural4320_transport_CDF", "Ural4320_transport_covered_CDF"],
      patrolCrew: [
        `{930302D9F14EEFC0}${P_CDF_C}/Character_CDF_Crew.et`,
        `{9DE22FB5586591CC}${P_CDF_C}/Character_CDF_Rifleman.et`,
        `{764BD07F41A15150}${P_CDF_C}/Character_CDF_GL.et`,
        `{7B9EAE5EB616387A}${P_CDF_C}/Character_CDF_AR.et`,
        `{16165F4184929A69}${P_CDF_C}/Character_CDF_SL.et`,
      ],
      fortifications: A2_FORTS,
      defaultGroupSet: "CDF_Army",
      groupSets: {
        CDF_Army: {
          label: "CDF Army",
          sentry: `{F0EDA16CEEC12D18}${P_CDF_G}/Group_Ses_CDF_SentryTeam.et`,
          defense: { ref: `{50DE534A7953C1CC}${P_CDF_G}/Group_Ses_CDF_RifleSquad.et`, size: 9 },
          small: [
            `{804388B3A49FB35D}${P_CDF_G}/Group_Ses_CDF_AmmoTeam.et`,
            `{08CA9553E76D868C}${P_CDF_G}/Group_Ses_CDF_MachineGunTeam.et`,
            `{7228AE97770E99AE}${P_CDF_G}/Group_Ses_CDF_MedicalSection.et`,
            `{CEE288E63858E720}${P_CDF_G}/Group_Ses_CDF_ReconTeam.et`,
            `{1F26994029F145CD}${P_CDF_G}/Group_Ses_CDF_SapperTeam.et`,
            `{F0EDA16CEEC12D18}${P_CDF_G}/Group_Ses_CDF_SentryTeam.et`,
            `{13190DB67B730759}${P_CDF_G}/Group_Ses_CDF_SniperTeam.et`,
            `{35E7582C39C71A0E}${P_CDF_G}/Group_Ses_CDF_Team_AT.et`,
            `{8B22B09B1EE38220}${P_CDF_G}/Group_Ses_CDF_Team_GL.et`,
            `{1BDA24E551CD97E2}${P_CDF_G}/Group_Ses_CDF_Team_LAT.et`,
            `{AFE4A0448A0C6DC8}${P_CDF_G}/Group_Ses_CDF_Team_Suppress.et`,
          ],
          medium: [
            `{338E63B617C13325}${P_CDF_G}/Group_Ses_CDF_FireTeam.et`,
            `{3D989BB73A001A78}${P_CDF_G}/Group_Ses_CDF_LightFireTeam.et`,
            `{0EEC68B499065772}${P_CDF_G}/Group_Ses_CDF_PlatoonHQ.et`,
          ],
          large: [
            `{50DE534A7953C1CC}${P_CDF_G}/Group_Ses_CDF_RifleSquad.et`,
            `{04186BFCD5D7C0E8}${P_CDF_G}/Group_Ses_CDF_RifleSquad2.et`,
          ],
        },
      },
    },
    Ses_ChDKZ: {
      label: "ChDKZ — Chedaki Insurgents",
      entryGuid: "{604D1A678A26714B}",
      // Byte-identical to vanilla USSR's callsign instance (author copy-paste)
      callsignGuid: "{5DA0F2A67DFB8809}",
      squadBase: ["{55CCB79287E901BC}", "{55CCB79287936EBD}", "{55CCB79287BAFBD6}", "{55CCB79287A4D7B6}"],
      squadFifth: null,
      friendlyWith: ["USSR", "RHS_AFRF"],
      spawnPoint: "{82787597EE11F812}PrefabsEditable/SpawnPoints/E_SpawnPoint_Ses_ChDKZ.et",
      hvt: `{7962B9884187FB8E}${P_CHD_C}/Character_ChDKZ_PL.et`,
      riflemen: {
        ChDKZ: `{FC8129BEC88601E4}${P_CHD_C}/Character_ChDKZ_Rifleman.et`,
      },
      loadoutSets: {
        ChDKZ: [
          { name: "Rifleman", prefab: `{FC8129BEC88601E4}${P_CHD_C}/Character_ChDKZ_Rifleman.et` },
          { name: "Rifleman (armored)", prefab: `{B31905AD4D309377}${P_CHD_C}/Character_ChDKZ_Rifleman_Armor.et` },
          { name: "Insurgent", prefab: `{B6F179A1885898AC}${P_CHD_C}/Character_ChDKZ_Insurgent.et` },
          { name: "Automatic Rifleman", prefab: `{8DF4F10E6EE4680D}${P_CHD_C}/Character_ChDKZ_AR.et` },
          { name: "Machine Gunner", prefab: `{DFE32F1400AB7CEE}${P_CHD_C}/Character_ChDKZ_MG.et` },
          { name: "Grenadier", prefab: `{80218F2F99530127}${P_CHD_C}/Character_ChDKZ_GL.et` },
          { name: "Anti-tank", prefab: `{555C98CF176D7651}${P_CHD_C}/Character_ChDKZ_AT.et` },
          { name: "Light Anti-tank", prefab: `{4D927ED407F512E9}${P_CHD_C}/Character_ChDKZ_LAT.et` },
          { name: "Medic", prefab: `{47112033E5E9DA33}${P_CHD_C}/Character_ChDKZ_Medic.et` },
          { name: "Sapper", prefab: `{B55424B3217BCC13}${P_CHD_C}/Character_ChDKZ_Sapper.et` },
          { name: "RTO", prefab: `{5C51F3F646199A0B}${P_CHD_C}/Character_ChDKZ_RTO.et` },
          { name: "Sharpshooter", prefab: `{910C01EBD5E4146E}${P_CHD_C}/Character_ChDKZ_Sharpshooter.et` },
          { name: "SL", prefab: `{E07C00115C60CA1E}${P_CHD_C}/Character_ChDKZ_SL.et` },
          { name: "PL", prefab: `{7962B9884187FB8E}${P_CHD_C}/Character_ChDKZ_PL.et` },
          { name: "Crew", prefab: `{6AE26CAF6AA0CE1E}${P_CHD_C}/Character_ChDKZ_Crew.et` },
        ],
      },
      arsenalItems: A2_ARSENAL_SOVIET,
      vehicles: {
        UAZ469_ChDKZ: "{EF3C004C1F1E24C6}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_Ses_ChDKZ.et",
        UAZ469_uncovered_ChDKZ: "{6CC21EBAB10F2A89}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_uncovered_Ses_ChDKZ.et",
        UAZ469_PKM_ChDKZ: "{499E2EBD08B7FE17}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_PKM_Ses_ChDKZ.et",
        UAZ452_transport_ChDKZ: "{935188308D14805D}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_transport_ChDKZ.et",
        UAZ452_ambulance_ChDKZ: "{E33C4B493EBD2435}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_ambulance_ChDKZ.et",
        UAZ452_cargo_ChDKZ: "{26702C2E32AD1217}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_cargo_ChDKZ.et",
        BRDM2_ChDKZ: "{1799AE4958D0D24A}Prefabs/Vehicles/Wheeled/BRDM2/BRDM2_Ses_ChDKZ.et",
        BTR70_ChDKZ: "{160E1EDDBFFF8CFD}Prefabs/Vehicles/Wheeled/BTR70/BTR70_Ses_ChDKZ.et",
        Ural4320_transport_ChDKZ: "{8918EDE86C8CB551}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_transport.et",
        Ural4320_transport_covered_ChDKZ: "{66A75AF67285BE70}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_transport_covered.et",
        Ural4320_ammo_ChDKZ: "{63A1F70634613D4F}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_ammo.et",
        Ural4320_command_ChDKZ: "{2B8531515FF1FC34}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_command.et",
        Ural4320_engineer_ChDKZ: "{EA1129AFC401782D}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_engineer.et",
        Ural4320_repair_ChDKZ: "{4D26B4451552089C}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_repair.et",
        Ural4320_tanker_ChDKZ: "{8FA5357DC2F8597A}Prefabs/Vehicles/Wheeled/Ural4320/Ses_ChDKZ/Ural4320_Ses_ChDKZ_tanker.et",
      },
      vehicleLabels: {
        UAZ469_ChDKZ: "UAZ-469",
        UAZ469_uncovered_ChDKZ: "UAZ-469 (uncovered)",
        UAZ469_PKM_ChDKZ: "UAZ-469 PKM",
        UAZ452_transport_ChDKZ: "UAZ-452 Van",
        UAZ452_ambulance_ChDKZ: "UAZ-452 Ambulance",
        UAZ452_cargo_ChDKZ: "UAZ-452 Cargo",
        BRDM2_ChDKZ: "BRDM-2",
        BTR70_ChDKZ: "BTR-70",
        Ural4320_transport_ChDKZ: "Ural-4320 Truck",
        Ural4320_transport_covered_ChDKZ: "Ural-4320 Truck (covered)",
        Ural4320_ammo_ChDKZ: "Ural-4320 Ammo Truck",
        Ural4320_command_ChDKZ: "Ural-4320 Command Truck",
        Ural4320_engineer_ChDKZ: "Ural-4320 Engineer Truck",
        Ural4320_repair_ChDKZ: "Ural-4320 Repair Truck",
        Ural4320_tanker_ChDKZ: "Ural-4320 Fuel Tanker",
      },
      patrolVehicleKeys: ["UAZ469_PKM_ChDKZ", "BRDM2_ChDKZ", "BTR70_ChDKZ"],
      transportVehicleKeys: ["UAZ452_transport_ChDKZ", "Ural4320_transport_ChDKZ", "Ural4320_transport_covered_ChDKZ"],
      patrolCrew: [
        `{6AE26CAF6AA0CE1E}${P_CHD_C}/Character_ChDKZ_Crew.et`,
        `{FC8129BEC88601E4}${P_CHD_C}/Character_ChDKZ_Rifleman.et`,
        `{8DF4F10E6EE4680D}${P_CHD_C}/Character_ChDKZ_AR.et`,
        `{80218F2F99530127}${P_CHD_C}/Character_ChDKZ_GL.et`,
        `{E07C00115C60CA1E}${P_CHD_C}/Character_ChDKZ_SL.et`,
      ],
      fortifications: A2_FORTS,
      defaultGroupSet: "ChDKZ",
      groupSets: {
        ChDKZ: {
          label: "Chedaki",
          sentry: `{981E842FB1BA3F23}${P_CHD_G}/Group_ChDKZ_SentryTeam.et`,
          defense: { ref: `{382D76092628D3F8}${P_CHD_G}/Group_ChDKZ_RifleSquad.et`, size: 6 },
          small: [
            `{8690489CE38D02BF}${P_CHD_G}/Group_ChDKZ_AmmoTeam.et`,
            `{B150EB035199623C}${P_CHD_G}/Group_ChDKZ_MachineGunTeam.et`,
            `{CBB2D0C7C1FA7D1E}${P_CHD_G}/Group_ChDKZ_MedicalSection.et`,
            `{77D5BC03768A57F6}${P_CHD_G}/Group_ChDKZ_SapperTeam.et`,
            `{981E842FB1BA3F23}${P_CHD_G}/Group_ChDKZ_SentryTeam.et`,
            `{9E758B5C6A0DB9B2}${P_CHD_G}/Group_ChDKZ_Team_AT.et`,
            `{4B089CBCE433CEC4}${P_CHD_G}/Group_ChDKZ_Team_GL.et`,
            `{1A0A44D1B4D1210C}${P_CHD_G}/Group_ChDKZ_Team_Suppress.et`,
          ],
          medium: [
            `{2C033F255E9F995A}${P_CHD_G}/Group_ChDKZ_FireGroup.et`,
            `{88767F2204DD56BC}${P_CHD_G}/Group_ChDKZ_LightFireTeam.et`,
            `{11FEE261D621348B}${P_CHD_G}/Group_ChDKZ_PlatoonHQ.et`,
            // 2 unit slots only (RHS MSV ManeuverGroup precedent)
            `{D57C11490075F09F}${P_CHD_G}/Group_ChDKZ_ManeuverGroup.et`,
          ],
          large: [`{382D76092628D3F8}${P_CHD_G}/Group_ChDKZ_RifleSquad.et`],
        },
      },
    },
    Ses_NAPA: {
      label: "NAPA — Chernarussian Guerrillas",
      entryGuid: "{604D1A678B852591}",
      // m_CallsignInfo instance in Ses_NAPA.conf (references vanilla
      // Callsigns_FIA; only company names are overridden — squads inherit)
      callsignGuid: "{5612D998B673DA16}",
      squadBase: ["{58B2B630FDD64B6D}", "{58B2B630FDD64B53}", "{58B2B630FDD64B51}", "{58B2B630FDD64B50}"],
      squadFifth: "{61C8F1ACA9FDB12D}",
      spawnPoint: "{D6CDD39095D690BE}PrefabsEditable/SpawnPoints/E_SpawnPoint_Ses_NAPA.et",
      hvt: `{F186A546CC076F55}${P_NAPA_C}/Character_NAPA_PL.et`,
      riflemen: {
        NAPA: `{81AABF85182C9FA3}${P_NAPA_C}/Character_NAPA_Rifleman_AK74.et`,
      },
      loadoutSets: {
        NAPA: [
          { name: "Rifleman (AK-74)", prefab: `{81AABF85182C9FA3}${P_NAPA_C}/Character_NAPA_Rifleman_AK74.et` },
          { name: "Rifleman (AKS-74U)", prefab: `{6436F37C14C908C8}${P_NAPA_C}/Character_NAPA_Rifleman_AKSU.et` },
          { name: "Rifleman (Vz. 58)", prefab: `{3BC9EFCE8DC9B614}${P_NAPA_C}/Character_NAPA_Rifleman_VZ.et` },
          { name: "Automatic Rifleman", prefab: `{0510EDC0E364FCD6}${P_NAPA_C}/Character_NAPA_AR.et` },
          { name: "Machine Gunner (PKM)", prefab: `{570733DA8D2BE835}${P_NAPA_C}/Character_NAPA_MG.et` },
          { name: "Machine Gunner (UK-59)", prefab: `{825CF2A0231AA133}${P_NAPA_C}/Character_NAPA_MG_UK.et` },
          { name: "Grenadier", prefab: `{08C593E114D395FC}${P_NAPA_C}/Character_NAPA_GL.et` },
          { name: "Anti-tank", prefab: `{DDB884019AEDE28A}${P_NAPA_C}/Character_NAPA_AT.et` },
          { name: "Light Anti-tank", prefab: `{CD129913E6D6649A}${P_NAPA_C}/Character_NAPA_LAT.et` },
          { name: "Medic", prefab: `{E6A32FEAA73639D4}${P_NAPA_C}/Character_NAPA_Medic.et` },
          { name: "Sapper", prefab: `{E1AF9D8C921613D7}${P_NAPA_C}/Character_NAPA_Sapper.et` },
          { name: "RTO", prefab: `{DCD11431A73AEC78}${P_NAPA_C}/Character_NAPA_RTO.et` },
          { name: "Sharpshooter", prefab: `{4402179619992EC2}${P_NAPA_C}/Character_NAPA_Sharpshooter.et` },
          { name: "Scout", prefab: `{EC4FA9F1875AA6C1}${P_NAPA_C}/Character_NAPA_Scout.et` },
          { name: "SL", prefab: `{68981CDFD1E05EC5}${P_NAPA_C}/Character_NAPA_SL.et` },
          { name: "PL", prefab: `{F186A546CC076F55}${P_NAPA_C}/Character_NAPA_PL.et` },
          { name: "Crew", prefab: `{1CFF4E8E34E4C9D3}${P_NAPA_C}/Character_NAPA_Crew.et` },
        ],
      },
      arsenalItems: A2_ARSENAL_GUERRILLA,
      // NAPA reskins where the mod ships them; vanilla Ural/UAZ-452
      // transports fill the gaps (its own catalog points at vanilla refs)
      vehicles: {
        UAZ469_NAPA: "{D9BCD36DBDCF660C}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_Ses_NAPA.et",
        UAZ469_uncovered_NAPA: "{B1BB344C2BB65DF1}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_uncovered_Ses_NAPA.et",
        UAZ469_UK59_NAPA: "{A33FC5774C0166A3}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_UK59_Ses_NAPA.et",
        BRDM2_NAPA: "{8CF38D3EFC558D84}Prefabs/Vehicles/Wheeled/BRDM2/BRDM2_Ses_NAPA.et",
        BTR70_NAPA: "{C63F988320179F4F}Prefabs/Vehicles/Wheeled/BTR70/BTR70_Ses_NAPA.et",
        UAZ452_transport: "{1FBB492E86002BF5}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_transport.et",
        UAZ452_ambulance: "{43C4AF1EEBD001CE}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_ambulance.et",
        Ural4320_transport: "{16C1F16C9B053801}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport.et",
        Ural4320_transport_covered: "{D9B91FAB817A6033}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport_covered.et",
      },
      vehicleLabels: {
        UAZ469_NAPA: "UAZ-469",
        UAZ469_uncovered_NAPA: "UAZ-469 (uncovered)",
        UAZ469_UK59_NAPA: "UAZ-469 UK-59",
        BRDM2_NAPA: "BRDM-2",
        BTR70_NAPA: "BTR-70",
        UAZ452_transport: "UAZ-452 Van",
        UAZ452_ambulance: "UAZ-452 Ambulance",
        Ural4320_transport: "Ural-4320 Truck",
        Ural4320_transport_covered: "Ural-4320 Truck (covered)",
      },
      patrolVehicleKeys: ["UAZ469_UK59_NAPA", "BRDM2_NAPA", "BTR70_NAPA"],
      transportVehicleKeys: ["UAZ469_NAPA", "Ural4320_transport", "Ural4320_transport_covered"],
      patrolCrew: [
        `{1CFF4E8E34E4C9D3}${P_NAPA_C}/Character_NAPA_Crew.et`,
        `{81AABF85182C9FA3}${P_NAPA_C}/Character_NAPA_Rifleman_AK74.et`,
        `{3BC9EFCE8DC9B614}${P_NAPA_C}/Character_NAPA_Rifleman_VZ.et`,
        `{08C593E114D395FC}${P_NAPA_C}/Character_NAPA_GL.et`,
        `{68981CDFD1E05EC5}${P_NAPA_C}/Character_NAPA_SL.et`,
      ],
      fortifications: A2_FORTS,
      defaultGroupSet: "NAPA",
      groupSets: {
        NAPA: {
          label: "NAPA",
          sentry: `{274CEB4D57FC1563}${P_NAPA_G}/Group_NAPA_SentryTeam.et`,
          defense: { ref: `{877F196BC06EF9B7}${P_NAPA_G}/Group_NAPA_RifleSquad.et`, size: 7 },
          small: [
            `{2947F71ACF65637E}${P_NAPA_G}/Group_NAPA_AmmoTeam.et`,
            `{D09C400AFF0C0D71}${P_NAPA_G}/Group_NAPA_MachineGunTeam.et`,
            `{AA7E7BCE6F6F1253}${P_NAPA_G}/Group_NAPA_MedicalSection.et`,
            `{208B18D32B16541E}${P_NAPA_G}/Group_NAPA_ReconTeam.et`,
            `{C887D36190CC7DB6}${P_NAPA_G}/Group_NAPA_SapperTeam.et`,
            `{274CEB4D57FC1563}${P_NAPA_G}/Group_NAPA_SentryTeam.et`,
            `{8AB4988AFEED5234}${P_NAPA_G}/Group_NAPA_SharpshooterTeam.et`,
            `{EAE32D0EBC745D90}${P_NAPA_G}/Group_NAPA_Team_AT.et`,
          ],
          medium: [
            `{9A8A1C1F7C3BE306}${P_NAPA_G}/Group_NAPA_FireTeam.et`,
            `{A999399919FBEAEE}${P_NAPA_G}/Group_NAPA_LightFireTeam.et`,
            `{E085F8818A48E44C}${P_NAPA_G}/Group_NAPA_PlatoonHQ.et`,
          ],
          large: [`{877F196BC06EF9B7}${P_NAPA_G}/Group_NAPA_RifleSquad.et`],
        },
      },
    },
  },
};
