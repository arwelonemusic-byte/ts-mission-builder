// Static GUID catalogue — ground-truthed from TS Mission Toolkit, unpacked vanilla
// data, production ops, and input/ai-groups.md + input/characters-loadouts.md.
// Extend by harvesting; never invent GUIDs here.
//
// AI group size rules (per Mod Defaults direction):
//   small  (2-4)  -> garrison pools; also included in patrol pools
//   medium (4-6)  -> patrol pools
//   large  (6-9)  -> QRF pools (QRF modules not exposed in the UI yet)
// A group may appear in more than one bucket (SF subfactions have one squad
// unit that serves as both medium and large).
// Excluded from infantry pools: *_Base templates, Transport, WithDriver,
// LessArmored (vehicle-bound or template groups).

export const TERRAINS = {
  arland: {
    label: "Arland",
    parent: "{A9806AF617972E97}worlds/Arland/Arland.ent",
    nav: [
      "{D8EF7131FB31AF97}worlds/GameMaster/Navmeshes/GM_Arland.nmn",
      "{A0AEEB1E7EF474FA}worlds/GameMaster/Navmeshes/GM_Arland_vehicles.nmn",
      "{804386FFEB7B7EFD}worlds/MP/Navmeshes/LowResArland.nmn",
    ],
  },
  eden: {
    label: "Everon",
    parent: "{853E92315D1D9EFE}worlds/Eden/Eden.ent",
    nav: [
      "{AD5F99CD7C59D5E0}worlds/GameMaster/Navmeshes/GM_Eden.nmn",
      "{C35ECF3276824654}worlds/GameMaster/Navmeshes/GM_Eden_vehicles.nmn",
      "{5E19E60F26327356}worlds/MP/Navmeshes/LowResEden.nmn",
    ],
  },
  cain: {
    label: "Kolguyev",
    parent: "{1EA95DAE3230BEB0}worlds/Cain/Cain.ent",
    nav: [
      "{ACBE49C3E71A9E65}worlds/GameMaster/Navmeshes/GM_Cain.nmn",
      "{27D8B11BF4E78009}worlds/GameMaster/Navmeshes/GM_Cain_vehicles.nmn",
      "{1B1989747762AF12}worlds/MP/Navmeshes/LowResCain.nmn",
    ],
  },
};

const P_OPFOR = "Prefabs/Groups/OPFOR";
const P_BLUFOR = "Prefabs/Groups/BLUFOR";
const P_INDFOR = "Prefabs/Groups/INDFOR";
const P_SLOT = "Prefabs/Compositions/Slotted";

// FIA has no own road fortification compositions — it reuses the USSR pool
// (per the Fortification module brief), so the list is hoisted for sharing.
const ROAD_FORTS_USSR = [
  `{9483333BFD9E2D0F}${P_SLOT}/SlotRoadSmall/Checkpoint_S_USSR_01.et`,
  `{7C85836D444E3797}${P_SLOT}/SlotRoadMedium/Checkpoint_M_USSR_01.et`,
  `{2A27606856B8A914}${P_SLOT}/SlotRoadLarge/Barricade_L_USSR_01.et`,
  `{9F9924B626C5FA2C}${P_SLOT}/SlotRoadLarge/Checkpoint_L_USSR_01.et`,
];

export const FACTIONS = {
  US: {
    entryGuid: "{56DEAC40D2DBC8B1}",
    callsignGuid: "{5DA0F2A6677ADA9E}",
    squadBase: ["{55CCB792D10AD8F4}", "{55CCB792D13759D8}", "{55CCB792D1218E95}", "{55CCB792D0C8B3CE}"],
    squadFifth: null,
    spawnPoint: "{CEA2B24051A44525}PrefabsEditable/SpawnPoints/E_SpawnPoint_US.et",
    riflemen: {
      US_Army: "{26A9756790131354}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Rifleman.et",
      GreenBerets: "{36E28C628A2F83CB}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF.et",
      GreenBerets_Suppressed: "{33155540F5CAA602}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_S.et",
    },
    // Selectable player loadouts per subfaction (source: input/characters-loadouts.md,
    // "Don't use" entries excluded; suppressed SF sets mirror their parent's names)
    loadoutSets: {
      US_Army: [
        { name: "Rifleman", prefab: "{26A9756790131354}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Rifleman.et" },
        { name: "Automatic Rifleman", prefab: "{5B1996C05B1E51A4}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_AR.et" },
        { name: "Grenadier", prefab: "{84029128FA6F6BB9}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_GL.et" },
        { name: "Machine Gunner", prefab: "{1623EA3AEFACA0E4}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_MG.et" },
        { name: "Assistant Machine Gunner", prefab: "{6058AB54781A0C52}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_AMG.et" },
        { name: "Light Anti-tank", prefab: "{27BF1FF235DD6036}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_LAT.et" },
        { name: "Medic", prefab: "{C9E4FEAF5AAC8D8C}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Medic.et" },
        { name: "Engineer", prefab: "{36CCDB4556ECDA06}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Engineer.et" },
        { name: "Sapper", prefab: "{AE63E4B79FB45DD1}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Sapper.et" },
        { name: "FTL", prefab: "{E398E44759DA1A43}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_TL.et" },
        { name: "SL", prefab: "{E45F1E163F5CA080}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_SL.et" },
        { name: "PL", prefab: "{0B3167BB0FB68110}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_PL.et" },
        { name: "RTO", prefab: "{3726077BE60962FF}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_RTO.et" },
        { name: "Sniper", prefab: "{0F6689B491641155}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Sniper.et" },
        { name: "Spotter", prefab: "{1CA3D30464EE4674}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Spotter.et" },
        { name: "Crew", prefab: "{E1CB513B8B9B08F4}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Crew.et" },
        { name: "Crew Commander", prefab: "{F35F145D4A3F75EF}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_CC.et" },
        { name: "Pilot", prefab: "{42A502E3BB727CEB}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_HeliPilot.et" },
        { name: "Helicopter Crew", prefab: "{15CD521098748195}Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_HeliCrew.et" },
      ],
      GreenBerets: [
        { name: "Rifleman", prefab: "{36E28C628A2F83CB}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF.et" },
        { name: "Grenadier", prefab: "{C110498284A5418F}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_GL.et" },
        { name: "Light MG", prefab: "{6E1E87ECA5F5A7EA}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_LMG.et" },
        { name: "Medic", prefab: "{9A234C5857D92187}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_Medic.et" },
        { name: "RTO", prefab: "{5228D8F587B5EEDC}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_RTO.et" },
        { name: "Sapper", prefab: "{FCA76613163633F8}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_Sapper.et" },
        { name: "Sharpshooter", prefab: "{ADC2DE949F566202}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_Sharpshooter.et" },
        { name: "SL", prefab: "{85261D5B04BFA7EE}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Character_US_SF_SL.et" },
      ],
      GreenBerets_Suppressed: [
        { name: "Rifleman", prefab: "{33155540F5CAA602}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_S.et" },
        { name: "Grenadier", prefab: "{78149A76D073D4C7}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_GL_S.et" },
        { name: "Medic", prefab: "{218217624DA44CCD}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_Medic_S.et" },
        { name: "RTO", prefab: "{C81429173BB025F2}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_RTO_S.et" },
        { name: "Sapper", prefab: "{B7E8542C3CD9E4B2}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_Sapper_S.et" },
        { name: "Sharpshooter", prefab: "{EC8C02BC296EEEA0}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_Sharpshooter_S.et" },
        { name: "SL", prefab: "{E5E4A45D13175E67}Prefabs/Characters/Factions/BLUFOR/US_Army/GreenBerets/Suppressed/Character_US_SF_SL_S.et" },
      ],
    },
    // Arsenal crate contents (source: input/arsenal-items.md; modes from
    // reforger-item-database). Baked per playable faction — not user-editable.
    arsenalItems: [
      { mode: "WEAPON", ref: "{9C5C20FB0E01E64F}Prefabs/Weapons/Launchers/M72/Launcher_M72A3.et" },
      { mode: "WEAPON", ref: "{EC9BDA3D9DDD8795}Prefabs/Weapons/Flares/FlareStarParachute_M127A1_white.et" },
      { mode: "WEAPON", ref: "{756231FF84F158A4}Prefabs/Weapons/Flares/FlareStarParachute_M126A1_red.et" },
      { mode: "WEAPON", ref: "{51D9E3AEC8476BA4}Prefabs/Weapons/Flares/FlareStarParachute_M195_green.et" },
      { mode: "AMMUNITION", ref: "{D8F2CA92583B23D3}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_M855_M856_Last_5Tracer.et" },
      { mode: "AMMUNITION", ref: "{BCB5E5C608ECFF50}Prefabs/Weapons/Magazines/Magazine_762x51_M14_20rnd_M80.et" },
      { mode: "AMMUNITION", ref: "{06D722FC2666EB83}Prefabs/Weapons/Magazines/Box_556x45_M249_200rnd_4Ball_1Tracer.et" },
      { mode: "AMMUNITION", ref: "{4D2C1E8F3A81F894}Prefabs/Weapons/Magazines/Box_762x51_M60_100rnd_4Ball_1Tracer.et" },
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
      { mode: "", ref: "{E4C9F0A4090CFE4D}Prefabs/Weapons/Explosives/Mine_M14/Mine_M14.et" },
      { mode: "", ref: "{49FFE8F373F55960}Prefabs/Weapons/Explosives/Mine_M15AT/Mine_M15AT.et" },
      { mode: "CONSUMABLE", ref: "{A81F501D3EF6F38E}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_US_01.et" },
      { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
      { mode: "CONSUMABLE", ref: "{00E36F41CA310E2A}Prefabs/Items/Medicine/SalineBag_01/SalineBag_US_01.et" },
      { mode: "CONSUMABLE", ref: "{D70216B1B2889129}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_US_01.et" },
      { mode: "", ref: "{73950FBA2D7DB5C5}Prefabs/Items/Equipment/Radios/Radio_ANPRC68.et" },
      { mode: "", ref: "{5C5C6EE05EE2FF1A}Prefabs/Items/Equipment/Backpacks/Backpack_ALICE_Medium_assembled.et" },
      { mode: "", ref: "{95D4766BBE46F23D}Prefabs/Items/Equipment/Backpacks/Backpack_IIFS_FieldPack.et" },
    ],
    // Spawn-picker vehicles (full faction list incl. armed + helis, source: input/vehicles.md)
    vehicles: {
      M151A2_transport: "{47D94E1193A88497}Prefabs/Vehicles/Wheeled/M151A2/M151A2_transport.et",
      M151A2_transport_MERDC: "{94DE32169691AC34}Prefabs/Vehicles/Wheeled/M151A2/M151A2_transport_MERDC.et",
      M151A2_MERDC: "{86D830868F026D54}Prefabs/Vehicles/Wheeled/M151A2/M151A2_MERDC.et",
      M151A2_M2HB: "{F6B23D17D5067C11}Prefabs/Vehicles/Wheeled/M151A2/M151A2_M2HB.et",
      M151A2_M2HB_MERDC: "{5168FEA3054D6D15}Prefabs/Vehicles/Wheeled/M151A2/M151A2_M2HB_MERDC.et",
      M923A1_transport: "{F1FBD0972FA5FE09}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport.et",
      M923A1_transport_MERDC: "{3F2AA823B6C65E1E}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport_MERDC.et",
      M923A1_transport_covered: "{81FDAD5EB644CC3D}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport_covered.et",
      M923A1_transport_covered_MERDC: "{04BDACC0BB83284E}Prefabs/Vehicles/Wheeled/M923A1/M923A1_transport_covered_MERDC.et",
      M998_uncovered: "{5674FAEB9AB7BDD0}Prefabs/Vehicles/Wheeled/M998/M998_uncovered.et",
      M998_uncovered_MERDC: "{6B24D5AFD884D64C}Prefabs/Vehicles/Wheeled/M998/M998_uncovered_MERDC.et",
      M998_covered: "{B55C6990A6A9411B}Prefabs/Vehicles/Wheeled/M998/M998_covered.et",
      M998_covered_MERDC: "{AF0578D66D51946B}Prefabs/Vehicles/Wheeled/M998/M998_covered_MERDC.et",
      M998_covered_long: "{9B1BF9644E0378D6}Prefabs/Vehicles/Wheeled/M998/M998_covered_long.et",
      M998_covered_long_MERDC: "{751AFEEA19DDFB04}Prefabs/Vehicles/Wheeled/M998/M998_covered_long_MERDC.et",
      M1025_MERDC: "{27E2E58E734A80EC}Prefabs/Vehicles/Wheeled/M998/M1025_MERDC.et",
      M1025_armed_M2HB: "{3EA6F47D95867114}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB.et",
      M1025_armed_M2HB_MERDC: "{DD774A8FD0989A78}Prefabs/Vehicles/Wheeled/M998/M1025_armed_M2HB_MERDC.et",
      M997_maxi_ambulance: "{00C9BBE426F7D459}Prefabs/Vehicles/Wheeled/M998/M997_maxi_ambulance.et",
      M997_maxi_ambulance_MERDC: "{3B1EB924602C7A07}Prefabs/Vehicles/Wheeled/M998/M997_maxi_ambulance_MERDC.et",
      LAV25: "{0FBF8F010F81A4E5}Prefabs/Vehicles/Wheeled/LAV25/LAV25.et",
      LAV25_MERDC: "{B7A8BAA37CB0AC2B}Prefabs/Vehicles/Wheeled/LAV25/LAV25_MERDC.et",
      UH1H: "{EEE291940A9DA42A}Prefabs/Vehicles/Helicopters/UH1H/UH1H_sharkNose.et",
      UH1H_armed: "{DDDD9B51F1234DF3}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed.et",
      UH1H_armed_sharkNose: "{00BC1E407D536A34}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_sharkNose.et",
      UH1H_gunship_HE: "{21E9A875C0A3C409}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_gunship_HE.et",
      UH1H_gunship_HE_sharkNose: "{350492BE6F09A847}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_gunship_HE_sharkNose.et",
      UH1H_gunship_HEDP: "{CB4D4CF7E887B2D0}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_gunship_HEDP.et",
      UH1H_gunship_HEDP_sharkNose: "{3133602B406D131C}Prefabs/Vehicles/Helicopters/UH1H/UH1H_armed_gunship_HEDP_sharkNose.et",
      UH1H_SP02_gunship: "{CB6215B3B44EA463}Prefabs/Vehicles/Helicopters/UH1H/SP02_GUNSHIP.et",
    },
    vehicleLabels: {
      M151A2_transport: "M151A2 Jeep",
      M151A2_transport_MERDC: "M151A2 Jeep (MERDC)",
      M151A2_MERDC: "M151A2 (MERDC)",
      M151A2_M2HB: "M151A2 M2HB",
      M151A2_M2HB_MERDC: "M151A2 M2HB (MERDC)",
      M923A1_transport: "M923A1 Truck",
      M923A1_transport_MERDC: "M923A1 Truck (MERDC)",
      M923A1_transport_covered: "M923A1 Truck (covered)",
      M923A1_transport_covered_MERDC: "M923A1 Truck (covered, MERDC)",
      M998_uncovered: "M998 HMMWV (uncovered)",
      M998_uncovered_MERDC: "M998 HMMWV (uncovered, MERDC)",
      M998_covered: "M998 HMMWV",
      M998_covered_MERDC: "M998 HMMWV (MERDC)",
      M998_covered_long: "M998 HMMWV (long)",
      M998_covered_long_MERDC: "M998 HMMWV (long, MERDC)",
      M1025_MERDC: "M1025 HMMWV (MERDC)",
      M1025_armed_M2HB: "M1025 M2HB",
      M1025_armed_M2HB_MERDC: "M1025 M2HB (MERDC)",
      M997_maxi_ambulance: "M997 Ambulance",
      M997_maxi_ambulance_MERDC: "M997 Ambulance (MERDC)",
      LAV25: "LAV-25",
      LAV25_MERDC: "LAV-25 (MERDC)",
      UH1H: "UH-1H",
      UH1H_armed: "UH-1H (armed)",
      UH1H_armed_sharkNose: "UH-1H (armed, shark nose)",
      UH1H_gunship_HE: "UH-1H Gunship HE",
      UH1H_gunship_HE_sharkNose: "UH-1H Gunship HE (shark nose)",
      UH1H_gunship_HEDP: "UH-1H Gunship HEDP",
      UH1H_gunship_HEDP_sharkNose: "UH-1H Gunship HEDP (shark nose)",
      UH1H_SP02_gunship: "UH-1H SP02 Gunship",
    },
    // Mounted-patrol candidates (keys into `vehicles`), ordered light -> heavy.
    // Which of these actually patrol is a PER-ZONE selection in the mission.
    patrolVehicleKeys: ["M151A2_M2HB", "M1025_armed_M2HB", "LAV25"],
    // Fortifications module composition pools (road checkpoints/barricades +
    // roadside bunkers/MG nests); source: Fortification module brief
    fortifications: {
      road: [
        `{E660DE914A7211EB}${P_SLOT}/SlotRoadSmall/Checkpoint_S_US_01.et`,
        `{55D508179EF5E64A}${P_SLOT}/SlotRoadMedium/Checkpoint_M_US_01.et`,
        `{AF770C825EA592CF}${P_SLOT}/SlotRoadLarge/Barricade_L_US_01.et`,
        `{E74D2F51CD4F03D0}${P_SLOT}/SlotRoadLarge/Checkpoint_L_US_01.et`,
      ],
      roadside: [
        `{C7D38772154D45BB}${P_SLOT}/SlotFlatSmall/Bunker_S_US_01.et`,
        `{AB87B392A989CA95}${P_SLOT}/SlotFlatSmall/GuardTower_S_US_01.et`,
        `{AC84AEB35260CEF8}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_US_01.et`,
        `{9D720679B696FEE1}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_US_01_M2HB.et`,
        `{4D69F9D77C372BE5}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_US_01_M60.et`,
        `{C0D09A53EEA441D6}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_US_02.et`,
        `{917158017F425567}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_US_01.et`,
        `{FD256CE1C386DA49}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_US_02.et`,
        `{18B92018CF634D22}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_US_03.et`,
        `{258D0520BA0FC415}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_US_04.et`,
      ],
    },
    defaultGroupSet: "US_Army",
    groupSets: {
      US_Army: {
        label: "US Army",
        sentry: `{3BF36BDEEB33AEC9}${P_BLUFOR}/Group_US_SentryTeam.et`,
        small: [
          `{F72EF3429D8C8DF5}${P_BLUFOR}/Group_US_AmmoTeam.et`,
          `{6B2A6EE5002D200F}${P_BLUFOR}/Group_US_EngineerTeam.et`,
          `{FCF7F5DC4F83955C}${P_BLUFOR}/Group_US_LightFireTeam.et`,
          `{958039B857396B7B}${P_BLUFOR}/Group_US_MachineGunTeam.et`,
          `{EF62027CC75A7459}${P_BLUFOR}/Group_US_MedicalSection.et`,
          `{F65B7BB712F46FEE}${P_BLUFOR}/Group_US_ReconTeam.et`,
          `{9624D2B39397E148}${P_BLUFOR}/Group_US_SapperTeam.et`,
          `{3BF36BDEEB33AEC9}${P_BLUFOR}/Group_US_SentryTeam.et`,
          `{D807C7047E818488}${P_BLUFOR}/Group_US_SniperTeam.et`,
          `{DE747BC9217D383C}${P_BLUFOR}/Group_US_Team_GL.et`,
          `{FAEA8B9E1252F56E}${P_BLUFOR}/Group_US_Team_LAT.et`,
          `{81B6DBF2B88545F5}${P_BLUFOR}/Group_US_Team_Suppress.et`,
        ],
        medium: [
          `{84E5BBAB25EA23E5}${P_BLUFOR}/Group_US_FireTeam.et`,
          `{0A8E20F50DA233E1}${P_BLUFOR}/Group_US_FireTeam_Guard.et`,
          `{B7AB5D3F8A7ADAE4}${P_BLUFOR}/Group_US_PlatoonHQ.et`,
        ],
        large: [`{DDF3799FA1387848}${P_BLUFOR}/Group_US_RifleSquad.et`],
      },
      GreenBerets: {
        label: "Green Berets",
        sentry: `{35681BE27C302FF5}${P_BLUFOR}/GreenBerets/Group_US_GreenBeret_SentryTeam.et`,
        small: [`{35681BE27C302FF5}${P_BLUFOR}/GreenBerets/Group_US_GreenBeret_SentryTeam.et`],
        medium: [`{D0886786634E55AE}${P_BLUFOR}/GreenBerets/Group_US_GreenBeret_Squad.et`],
        large: [`{D0886786634E55AE}${P_BLUFOR}/GreenBerets/Group_US_GreenBeret_Squad.et`],
      },
      GreenBerets_Suppressed: {
        label: "Green Berets (suppressed)",
        sentry: `{35681BE27C302FF5}${P_BLUFOR}/GreenBerets/Group_US_GreenBeret_SentryTeam.et`, // parent set team (no suppressed variant)
        small: [`{AC473DE5F4B24E82}${P_BLUFOR}/GreenBerets/Suppressed/Group_US_GreenBeret_ReconTeam.et`],
        medium: [`{1F468430E5AB477E}${P_BLUFOR}/GreenBerets/Suppressed/Group_US_GreenBeret_ReconSquad.et`],
        large: [`{1F468430E5AB477E}${P_BLUFOR}/GreenBerets/Suppressed/Group_US_GreenBeret_ReconSquad.et`],
      },
    },
  },
  USSR: {
    entryGuid: "{56DEAC40D3C2E623}",
    callsignGuid: "{5DA0F2A67DFB8809}",
    squadBase: ["{55CCB79287E901BC}", "{55CCB79287936EBD}", "{55CCB79287BAFBD6}", "{55CCB79287A4D7B6}"],
    squadFifth: null,
    spawnPoint: "{45225582B358C31A}PrefabsEditable/SpawnPoints/E_SpawnPoint_USSR.et",
    riflemen: {
      USSR_Army: "{DCB41B3746FDD1BE}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Rifleman.et",
      KLMK: "{145DBC42B19FC4D6}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_Rifleman_KLMK.et",
      Naval_Infantry: "{6F412F678228D5F7}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_Rifleman.et",
      Spetsnaz: "{2DB452B3EC386B92}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF.et",
      Spetsnaz_Suppressed: "{4D20F57C29B6EC1D}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_S.et",
    },
    loadoutSets: {
      USSR_Army: [
        { name: "Стрелок", prefab: "{DCB41B3746FDD1BE}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Rifleman.et" },
        { name: "Пулеметчик (РПК)", prefab: "{23ADBBC31B6A3DC6}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_AR.et" },
        { name: "Пулеметчик", prefab: "{96C784C502AC37DA}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_MG.et" },
        { name: "Стрелок ГП", prefab: "{8E0FE664CE7D1CA9}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_GL.et" },
        { name: "Гранатометчик", prefab: "{1C78331E156A3D65}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_AT.et" },
        { name: "Помощник гранатометчика", prefab: "{631158F6898738A4}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_AAT.et" },
        { name: "ПТ Стрелок", prefab: "{BF643BE4ADBDFDD3}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_LAT.et" },
        { name: "Санитар", prefab: "{AB9726163EC1BD81}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Medic.et" },
        { name: "Инженер", prefab: "{EBFB363AC7A5FCE6}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Engineer.et" },
        { name: "Сапер", prefab: "{CBF7A398FE060335}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Sapper.et" },
        { name: "Старший стрелок", prefab: "{333DA6244C7DA34C}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_SR.et" },
        { name: "Ком. отделения", prefab: "{5436629450D8387A}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_SL.et" },
        { name: "Ком. взвода", prefab: "{426F7FAAC77A2A6D}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_PL.et" },
        { name: "Зам. ком. взвода", prefab: "{612F43A4D5AE765F}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_RTO.et" },
        { name: "Снайпер", prefab: "{976AC400219898FA}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Sharpshooter.et" },
        { name: "Экипаж", prefab: "{9FFEF10757E742EB}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_Crew.et" },
        { name: "Пилот", prefab: "{A62FA97C4EC64F14}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_HeliPilot.et" },
        { name: "Экипаж вертолета", prefab: "{C8FABF6F093DA775}Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_HeliCrew.et" },
      ],
      KLMK: [
        { name: "Стрелок", prefab: "{145DBC42B19FC4D6}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_Rifleman_KLMK.et" },
        { name: "Пулеметчик (РПК)", prefab: "{862E3B66D0316F0A}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_AR_KLMK.et" },
        { name: "Пулеметчик", prefab: "{8A60AEBD529FEB8B}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_MG_KLMK.et" },
        { name: "Стрелок ГП", prefab: "{6B00D3FC285E0AE0}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_GL_KLMK.et" },
        { name: "Гранатометчик", prefab: "{9A12B3F6ABDF70BE}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_AT_KLMK.et" },
        { name: "Помощник гранатометчика", prefab: "{E8EF64F8B943A507}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_AAT_KLMK.et" },
        { name: "ПТ Стрелок", prefab: "{9833B84F57F9F22F}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_LAT_KLMK.et" },
        { name: "Санитар", prefab: "{D66C215D6F03EFFD}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_Medic_KLMK.et" },
        { name: "Сапер", prefab: "{A70AD7146D3FBF41}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_Sapper_KLMK.et" },
        { name: "Старший стрелок", prefab: "{C49ED6AA2EA02B15}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_SR_KLMK.et" },
        { name: "Ком. отделения", prefab: "{A8507C7BBAF64A71}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_SL_KLMK.et" },
        { name: "Ком. взвода", prefab: "{E8A05D5E0CEAC836}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_PL_KLMK.et" },
        { name: "Зам. ком. взвода", prefab: "{9C16A2371109644D}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_RTO_KLMK.et" },
        { name: "Снайпер", prefab: "{B056E800F6286831}Prefabs/Characters/Factions/OPFOR/USSR_Army/KLMK/Character_USSR_Sharpshooter_KLMK.et" },
      ],
      Naval_Infantry: [
        { name: "Стрелок", prefab: "{6F412F678228D5F7}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_Rifleman.et" },
        { name: "Пулеметчик (РПК)", prefab: "{FF534E2B68E3D9D0}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_AR.et" },
        { name: "Пулеметчик", prefab: "{AD44903106ACCD33}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_MG.et" },
        { name: "Стрелок ГП", prefab: "{F286300A9F54B0FA}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_GL.et" },
        { name: "Гранатометчик", prefab: "{27FB27EA116AC78C}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_AT.et" },
        { name: "Помощник гранатометчика", prefab: "{D2D6106D52DF6B0A}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_AAT.et" },
        { name: "ПТ Стрелок", prefab: "{1F8E131008DE0DD1}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_LAT.et" },
        { name: "Санитар", prefab: "{34D564602573EDA1}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_Medic.et" },
        { name: "Сапер", prefab: "{8C966363D98C3D2F}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_Sapper.et" },
        { name: "Старший стрелок", prefab: "{EFC353CC3FF4475A}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_SR.et" },
        { name: "Ком. отделения", prefab: "{92DBBF345A677BC3}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_SL.et" },
        { name: "Ком. взвода", prefab: "{0BC506AD47804A53}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_PL.et" },
        { name: "Зам. ком. взвода", prefab: "{0E4D9E3249328533}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_RTO.et" },
        { name: "Снайпер", prefab: "{8CDEE565CB49D126}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_Sharpshooter.et" },
        { name: "Экипаж", prefab: "{4F56119D68E63FF8}Prefabs/Characters/Factions/OPFOR/USSR_Army/Naval_Infantry/Character_USSR_NI_Crew.et" },
      ],
      Spetsnaz: [
        { name: "Стрелок", prefab: "{2DB452B3EC386B92}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF.et" },
        { name: "Стрелок ГП", prefab: "{B823C229EC3981B7}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_GL.et" },
        { name: "Пулеметчик", prefab: "{0B8AC0C3C447F90E}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_LMG.et" },
        { name: "Санитар", prefab: "{8CA70597606992EC}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_Medic.et" },
        { name: "Зам. ком. взвода", prefab: "{B6A2736A7201DD23}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_RTO.et" },
        { name: "Сапер", prefab: "{730CDEC4168637B6}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_Sapper.et" },
        { name: "Снайпер", prefab: "{ADB43E67E3766CE7}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_Sharpshooter.et" },
        { name: "Ком. отделения", prefab: "{5811F02495F6810E}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Character_USSR_SF_SL.et" },
      ],
      Spetsnaz_Suppressed: [
        { name: "Стрелок", prefab: "{4D20F57C29B6EC1D}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_S.et" },
        { name: "Стрелок ГП", prefab: "{CF43078FA4830404}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_GL_S.et" },
        { name: "Санитар", prefab: "{029FF8F84148012E}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_Medic_S.et" },
        { name: "Зам. ком. взвода", prefab: "{1523C468AAF90312}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_RTO_S.et" },
        { name: "Сапер", prefab: "{A16C1DE30B6957D9}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_Sapper_S.et" },
        { name: "Снайпер", prefab: "{5EFF3963153BE048}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_Sharpshooter_S.et" },
        { name: "Ком. отделения", prefab: "{6C1FFF78CD4E4ADA}Prefabs/Characters/Factions/OPFOR/USSR_Army/Spetsnaz/Suppressed/Character_USSR_SF_SL_S.et" },
      ],
    },
    // Arsenal crate contents (source: input/arsenal-items.md; modes from
    // reforger-item-database). Baked per playable faction — not user-editable.
    arsenalItems: [
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
    ],
    vehicles: {
      UAZ469: "{259EE7B78C51B624}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469.et",
      UAZ469_uncovered: "{16A674FE31B0921C}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_uncovered.et",
      UAZ469_PKM: "{0B4DEA8078B78A9B}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_PKM.et",
      UAZ452_transport: "{1FBB492E86002BF5}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_transport.et",
      Ural4320_transport: "{16C1F16C9B053801}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport.et",
      Ural4320_transport_covered: "{D9B91FAB817A6033}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport_covered.et",
      BRDM2: "{254289B9C09904AB}Prefabs/Vehicles/Wheeled/BRDM2/BRDM2.et",
      BTR70: "{C012BB3488BEA0C2}Prefabs/Vehicles/Wheeled/BTR70/BTR70.et",
      Mi8MT_transport: "{DF5CCB7C0FF049F4}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_unarmed_transport.et",
      Mi8MT_armed: "{7BD282AF716ED639}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed.et",
      Mi8MT_gunship_HE: "{3C6B3ED0C3AC30D5}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed_gunship_HE.et",
      Mi8MT_gunship_HEDP: "{DBEC63C9DEE4358C}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MT_armed_gunship_HEDP.et",
    },
    vehicleLabels: {
      UAZ469: "UAZ-469",
      UAZ469_uncovered: "UAZ-469 (uncovered)",
      UAZ469_PKM: "UAZ-469 PKM",
      UAZ452_transport: "UAZ-452 Van",
      Ural4320_transport: "Ural-4320 Truck",
      Ural4320_transport_covered: "Ural-4320 Truck (covered)",
      BRDM2: "BRDM-2",
      BTR70: "BTR-70",
      Mi8MT_transport: "Mi-8MT Transport",
      Mi8MT_armed: "Mi-8MT (armed)",
      Mi8MT_gunship_HE: "Mi-8MT Gunship HE",
      Mi8MT_gunship_HEDP: "Mi-8MT Gunship HEDP",
    },
    patrolVehicleKeys: ["UAZ469_PKM", "BRDM2", "BTR70"],
    fortifications: {
      road: ROAD_FORTS_USSR,
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
    },
    defaultGroupSet: "USSR_Army",
    groupSets: {
      USSR_Army: {
        label: "USSR Army",
        sentry: `{CB58D90EA14430AD}${P_OPFOR}/Group_USSR_SentryTeam.et`,
        small: [
          `{C8622D0595B48437}${P_OPFOR}/Group_USSR_AmmoTeam.et`,
          `{344B4B6F787CFB23}${P_OPFOR}/Group_USSR_EngineerTeam.et`,
          `{657590C1EC9E27D3}${P_OPFOR}/Group_USSR_LightFireTeam.et`,
          `{A2F75E45C66B1C0A}${P_OPFOR}/Group_USSR_MachineGunTeam.et`,
          `{D815658156080328}${P_OPFOR}/Group_USSR_MedicalSection.et`,
          `{BB2E6C2CC2755E9B}${P_OPFOR}/Group_USSR_SapperTeam.et`,
          `{CB58D90EA14430AD}${P_OPFOR}/Group_USSR_SentryTeam.et`,
          `{96BAB56E6558788E}${P_OPFOR}/Group_USSR_Team_AT.et`,
          `{43C7A28EEB660FF8}${P_OPFOR}/Group_USSR_Team_GL.et`,
          `{2E59ECDA9ED0B993}${P_OPFOR}/Group_USSR_Team_LAT.et`,
          `{1C0502B5729E7231}${P_OPFOR}/Group_USSR_Team_Suppress.et`,
        ],
        medium: [
          `{30ED11AA4F0D41E5}${P_OPFOR}/Group_USSR_FireGroup.et`,
          `{6F72F05752ED62A8}${P_OPFOR}/Group_USSR_FireGroup_Guard.et`,
          `{3A76D9342C76A1F5}${P_OPFOR}/Group_USSR_SearchGroup.et`,
          `{0D10CCEEC7B3EC34}${P_OPFOR}/Group_USSR_PlatoonHQ.et`,
        ],
        large: [
          `{1A5F0D93609DA5DA}${P_OPFOR}/Group_USSR_ManeuverGroup.et`,
          `{E552DABF3636C2AD}${P_OPFOR}/Group_USSR_RifleSquad.et`,
        ],
      },
      KLMK: {
        label: "USSR (KLMK)",
        sentry: `{61E209AA5933AC95}${P_OPFOR}/KLMK/Group_USSR_SentryTeam_KLMK.et`,
        small: [
          `{17F51B6521F7194A}${P_OPFOR}/KLMK/Group_USSR_AmmoTeam_KLMK.et`,
          `{5B08C42EA0661A20}${P_OPFOR}/KLMK/Group_USSR_LightFireTeam_KLMK.et`,
          `{56DC5F9D2D6119F2}${P_OPFOR}/KLMK/Group_USSR_MachineGunTeam_KLMK.et`,
          `{8E29E7581DE832CC}${P_OPFOR}/KLMK/Group_USSR_MedicalSection_KLMK.et`,
          `{06F0C9675883F18A}${P_OPFOR}/KLMK/Group_USSR_ReconTeam.et`,
          `{8EDE6E160E71ABB4}${P_OPFOR}/KLMK/Group_USSR_SapperTeam_KLMK.et`,
          `{61E209AA5933AC95}${P_OPFOR}/KLMK/Group_USSR_SentryTeam_KLMK.et`,
          `{129039549B0B82FF}${P_OPFOR}/KLMK/Group_USSR_Team_AT_KLMK.et`,
          `{E382595E188AF8A1}${P_OPFOR}/KLMK/Group_USSR_Team_GL_KLMK.et`,
          `{A286509C2F94005F}${P_OPFOR}/KLMK/Group_USSR_Team_LAT_KLMK.et`,
          `{014B050050A8B5B5}${P_OPFOR}/KLMK/Group_USSR_Team_Suppress_KLMK.et`,
        ],
        medium: [
          `{13A616F83A41C610}${P_OPFOR}/KLMK/Group_USSR_FireGroup_KLMK.et`,
          `{B69270E9F222F356}${P_OPFOR}/KLMK/Group_USSR_PlatoonHQ_KLMK.et`,
        ],
        large: [
          `{195CE45AF822820B}${P_OPFOR}/KLMK/Group_USSR_ManeuverGroup_KLMK.et`,
          `{97D45056CFC22FF2}${P_OPFOR}/KLMK/Group_USSR_RifleSquad_KLMK.et`,
        ],
      },
      Naval_Infantry: {
        label: "Naval Infantry",
        sentry: `{85384D373DB6EBBB}${P_OPFOR}/Naval_Infantry/Group_USSR_SentryTeam_NI.et`,
        small: [
          `{AEC45E0050F58730}${P_OPFOR}/Naval_Infantry/Group_USSR_AmmoTeam_NI.et`,
          `{8E1B1AEBBB1AA155}${P_OPFOR}/Naval_Infantry/Group_USSR_LightFireTeam_NI.et`,
          `{10E7872ECBF80AC5}${P_OPFOR}/Naval_Infantry/Group_USSR_MachineGunTeam_NI.et`,
          `{6A05BCEA5B9B15E7}${P_OPFOR}/Naval_Infantry/Group_USSR_MedicalSection_NI.et`,
          `{6AF3751BFA86836E}${P_OPFOR}/Naval_Infantry/Group_USSR_SapperTeam_NI.et`,
          `{85384D373DB6EBBB}${P_OPFOR}/Naval_Infantry/Group_USSR_SentryTeam_NI.et`,
          `{A665FE0F7C136660}${P_OPFOR}/Naval_Infantry/Group_USSR_Team_AT_NI.et`,
          `{7318E9EFF22D1116}${P_OPFOR}/Naval_Infantry/Group_USSR_Team_GL_NI.et`,
          `{CA4790822E4ECE29}${P_OPFOR}/Naval_Infantry/Group_USSR_Team_LAT_NI.et`,
          `{1C6721180B16D6E5}${P_OPFOR}/Naval_Infantry/Group_USSR_Team_Suppress_NI.et`,
        ],
        medium: [
          `{26099EE31B5CC43A}${P_OPFOR}/Naval_Infantry/Group_USSR_FireGroup_NI.et`,
          `{1BF443A793E269EB}${P_OPFOR}/Naval_Infantry/Group_USSR_PlatoonHQ_NI.et`,
        ],
        large: [
          `{D3117480BFB20776}${P_OPFOR}/Naval_Infantry/Group_USSR_ManeuverGroup_NI.et`,
          `{250BBF11AA24076F}${P_OPFOR}/Naval_Infantry/Group_USSR_RifleSquad_NI.et`,
        ],
      },
      Spetsnaz: {
        label: "Spetsnaz",
        sentry: `{4C44B4D8F2820F25}${P_OPFOR}/Spetsnaz/Group_USSR_Spetsnaz_SentryTeam.et`,
        small: [`{4C44B4D8F2820F25}${P_OPFOR}/Spetsnaz/Group_USSR_Spetsnaz_SentryTeam.et`],
        medium: [`{4D3BBEC1A955626A}${P_OPFOR}/Spetsnaz/Group_USSR_Spetsnaz_Squad.et`],
        large: [`{4D3BBEC1A955626A}${P_OPFOR}/Spetsnaz/Group_USSR_Spetsnaz_Squad.et`],
      },
      Spetsnaz_Suppressed: {
        label: "Spetsnaz (suppressed)",
        sentry: `{4C44B4D8F2820F25}${P_OPFOR}/Spetsnaz/Group_USSR_Spetsnaz_SentryTeam.et`, // parent set team (no suppressed variant)
        small: [`{B721D5A8C1B556CE}${P_OPFOR}/Spetsnaz/Suppressed/Group_USSR_Spetsnaz_ReconTeam.et`],
        medium: [`{666A2B0A6B1967AE}${P_OPFOR}/Spetsnaz/Suppressed/Group_USSR_Spetsnaz_ReconSquad.et`],
        large: [`{666A2B0A6B1967AE}${P_OPFOR}/Spetsnaz/Suppressed/Group_USSR_Spetsnaz_ReconSquad.et`],
      },
    },
  },
  FIA: {
    entryGuid: "{56DEAC40D132400B}",
    callsignGuid: "{60A6B21E18F28741}",
    squadBase: ["{58B2B630FDD64B6D}", "{58B2B630FDD64B53}", "{58B2B630FDD64B51}", "{58B2B630FDD64B50}"],
    squadFifth: "{61C8F1ACA9FDB12D}",
    spawnPoint: "{72713ED566A531F3}PrefabsEditable/SpawnPoints/E_SpawnPoint_FIA.et",
    riflemen: {
      FIA: "{84B40583F4D1B7A3}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_Rifleman.et",
    },
    loadoutSets: {
      FIA: [
        { name: "Rifleman", prefab: "{84B40583F4D1B7A3}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_Rifleman.et" },
        { name: "Machinegunner", prefab: "{58E47E5A4D599432}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_MG.et" },
        { name: "AT Rifleman", prefab: "{D25BC9815A9F9E8D}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_AT.et" },
        { name: "Light Anti-tank", prefab: "{C77DFB8546B3F2A2}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_LAT.et" },
        { name: "Medic", prefab: "{45A02CA25CBA9443}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_Medic.et" },
        { name: "Sapper", prefab: "{066644E57BA1E26E}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_Sapper.et" },
        { name: "Sharpshooter", prefab: "{CE33AB22F61F3365}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_Sharpshooter.et" },
        { name: "SL", prefab: "{677B515F119222C2}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_SL.et" },
        { name: "PL", prefab: "{FE65E8C60C751352}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_PL.et" },
        { name: "RTO", prefab: "{23D81C023DBF85AC}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_RTO.et" },
        { name: "Crew", prefab: "{641AD7731E23454B}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_Crew.et" },
        { name: "Crew Commander", prefab: "{7B171A8ADD2664FE}Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_CC.et" },
      ],
    },
    // Arsenal crate contents (source: input/arsenal-items.md; modes from
    // reforger-item-database). Baked per playable faction — not user-editable.
    arsenalItems: [
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
    ],
    vehicles: {
      UAZ469_FIA: "{F7E9AA0C813EABDA}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_FIA.et",
      UAZ469_FIA_uncovered: "{E28501E93F8EFDC0}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_FIA_uncovered.et",
      UAZ469_PKM_FIA: "{22B327C6752EC4D4}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_PKM_FIA.et",
      UAZ469_UK59_FIA: "{E72D78E7F45532EC}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_UK59_FIA.et",
      UAZ452_transport_FIA: "{BDE16A6AE9942D44}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_transport_FIA.et",
      Ural4320_FIA_transport: "{16E32C3ABEAFC2C6}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_FIA_transport.et",
      Ural4320_FIA_transport_covered: "{B70E6D12A8EC2410}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_FIA_transport_covered.et",
      BRDM2_FIA: "{442939C9617DF228}Prefabs/Vehicles/Wheeled/BRDM2/BRDM2_FIA.et",
      BTR70_FIA: "{B47110AA1A806556}Prefabs/Vehicles/Wheeled/BTR70/BTR70_FIA.et",
    },
    vehicleLabels: {
      UAZ469_FIA: "UAZ-469",
      UAZ469_FIA_uncovered: "UAZ-469 (uncovered)",
      UAZ469_PKM_FIA: "UAZ-469 PKM",
      UAZ469_UK59_FIA: "UAZ-469 UK-59",
      UAZ452_transport_FIA: "UAZ-452 Van",
      Ural4320_FIA_transport: "Ural-4320 Truck",
      Ural4320_FIA_transport_covered: "Ural-4320 Truck (covered)",
      BRDM2_FIA: "BRDM-2",
      BTR70_FIA: "BTR-70",
    },
    patrolVehicleKeys: ["UAZ469_PKM_FIA", "UAZ469_UK59_FIA", "BRDM2_FIA", "BTR70_FIA"],
    fortifications: {
      road: ROAD_FORTS_USSR, // FIA has no own road compositions (per brief)
      roadside: [
        `{627A868E7B5D3914}${P_SLOT}/SlotFlatSmall/Bunker_S_FIA_01.et`,
        `{1A0F6E75C7065DC0}${P_SLOT}/SlotFlatSmall/MachineGunNest_S_FIA_02.et`,
        `{98976370BD31E739}${P_SLOT}/SlotFlatSmall/MachineGunNest_Scoped_S_FIA_01.et`,
        `{B04F2A9C5356C02D}${P_SLOT}/SlotFlatSmall/SandbagPosition_S_FIA_01.et`,
      ],
    },
    defaultGroupSet: "FIA",
    groupSets: {
      FIA: {
        label: "FIA",
        sentry: `{6E725D44CA973C24}${P_INDFOR}/Group_FIA_SentryTeam.et`,
        small: [
          `{C1E39427E43B1E79}${P_INDFOR}/Group_FIA_AmmoTeam.et`,
          `{1BB20A4B3A53D0F5}${P_INDFOR}/Group_FIA_LightFireTeam.et`,
          `{22F33D3EC8F281AB}${P_INDFOR}/Group_FIA_MachineGunTeam.et`,
          `{581106FA58919E89}${P_INDFOR}/Group_FIA_MedicalSection.et`,
          `{2E9C920C3ACA2C6F}${P_INDFOR}/Group_FIA_ReconTeam.et`,
          `{A0E9B5D6EA2072C4}${P_INDFOR}/Group_FIA_SapperTeam.et`,
          `{6E725D44CA973C24}${P_INDFOR}/Group_FIA_SentryTeam.et`,
          `{6307F42403E9B8A4}${P_INDFOR}/Group_FIA_SharpshooterTeam.et`,
          `{2CC26054775FBA2C}${P_INDFOR}/Group_FIA_Team_AT.et`,
          `{9328FE7DD0019E60}${P_INDFOR}/Group_FIA_Team_LAT.et`,
        ],
        medium: [
          `{5BEA04939D148B1D}${P_INDFOR}/Group_FIA_FireTeam.et`,
          `{EE92725E9B949C3D}${P_INDFOR}/Group_FIA_PlatoonHQ.et`,
        ],
        large: [`{CE41AF625D05D0F0}${P_INDFOR}/Group_FIA_RifleSquad.et`],
      },
    },
  },
};

export const K = {
  BASE_GAME: "58D0FB3206B6F859",
  TOOLKIT: "6906F4528B72651A",
  TOOLKIT_ICON: "{9BC3A40FAAF2BD75}Images/TSGM_icon.edds",
  CIV_ENTRY: '{607AA5C7A94496DA}" : "{3FA20B01D950D31F}Configs/Factions/CIV.conf',
  AREA_PREFAB: "{C72F956E4AC6A6E7}Prefabs/Systems/ScenarioFramework/Components/Area.et",
  LAYER_PREFAB: "{5F9FFF4BF027B3A3}Prefabs/Systems/ScenarioFramework/Components/Layer.et",
  SLOT_PREFAB: "{AA01691FDC4E9167}Prefabs/Systems/ScenarioFramework/Components/Slot.et",
  SLOTMARKER_PREFAB: "{E537867C6E760514}Prefabs/Systems/ScenarioFramework/Components/SlotMarker.et",
  CMP_SF_AREA: "{59E8CDC50969206E}",
  CMP_SF_LAYER: "{5A2283EA2A0B4B14}",
  CMP_SF_SLOT: "{5A22E1D67E712EC8}",
  // SlotMarker.et prefab-instance GUIDs (fixed, same on every marker — see
  // Operation Crayfish Markers.layer)
  CMP_SF_SLOTMARKER: "{5EA2BD9901E5E82E}",
  MARKER_TYPE_GUID: "{697E675AD7054FB0}",
  FARP_COMP: "{0C16FFB1B07F4A89}Prefabs/Compositions/Slotted/TS_FARP_Comp.et",
  // Loadout system (conf-based): missions spawn the toolkit's LoadoutCrates_Conf.et
  // and override the toolkit's loadout .conf with the selected loadouts. The crate
  // prefab is only overridden to set faction affiliation (1.7 arsenal validation).
  CRATE_GUID: "897A36FA3D0A19F8",
  CRATE_PATH: "Prefabs/Props/Military/MilitaryCrates/CrateStack_01/Dst/LoadoutCrates_Conf.et",
  CRATE_PARENT: "{8CB451B8E1565814}Prefabs/Props/Military/MilitaryCrates/CrateStack_01/Dst/LoadoutCrates.et",
  CRATE_ROOT_ID: "F0DBA538AC2A0552",
  CMP_FACTION_AFF: "{69070DAC6383E350}",
  LOADOUT_CONF_GUID: "2B1F00FB4CED5910",
  LOADOUT_CONF_PATH: "Configs/Loadouts/TS_MissionLoadouts.conf",
  ARSENAL_GUID: "DDDE97723E57CC62",
  ARSENAL_PATH: "Configs/CustomArsenal/TS_CustomArsenal.conf",
  // The toolkit's base conf has one member; overrides reuse its instance GUID
  // for the first item (Workbench pattern, see Operation Crayfish)
  ARSENAL_BASE_ENTRY: "{69092805DE3E6A13}",
  BRIEFING_GUID: "66D418A7AFBF6FEB",
  BRIEFING_PATH: "Configs/Journal/Briefing.conf",
  BRIEF_JOURNAL: "{690743E9320B39D9}",
  BRIEF_ENTRIES: [
    { guid: "{690743E93F762F8D}", id: 0, title: "Ситуация" },
    { guid: "{690743E9783A1E66}", id: 1, title: "Задачи" },
    { guid: "{690743E96F38D3AA}", id: 2, title: "Враждебные силы" },
  ],
  LM_ARSENAL_LOADOUT: "{69070DBB1C884284}",
  LM_RIFLEMAN_LOADOUT: "{6906F4B5E812A159}",
};

// Zone modules exposed in the builder UI (MVP set per Mod Defaults spec).
// kind "infantry" pools are resolved from the enemy groupSet by size rule;
// kind "vehicle" pools use the enemy faction's patrolVehicles.
// kind "fortification" pools come from FACTIONS[*].fortifications (road +
// roadside compositions) + groupSets[*].sentry AI teams; only the budget is
// user-facing (maxBudget caps the UI input).
// QRF (sizes: ["large"], needs TS_QRFSpawnAnchor placement) is deferred.
export const ZONE_MODULES = [
  { type: "TS_ScenarioFrameworkPluginAIPatrol", label: "AI Foot Patrols", kind: "infantry", pool: "m_aPrefabPool", sizes: ["small", "medium"] },
  { type: "TS_ScenarioFrameworkPluginSmartGarrison", label: "Smart Garrison", kind: "infantry", pool: "m_aPrefabPool", sizes: ["small"] },
  { type: "TS_ScenarioFrameworkPluginMountedPatrol", label: "Mounted Patrols", kind: "vehicle", pool: "m_aVehiclePrefabPool" },
  { type: "TS_ScenarioFrameworkPluginFortification", label: "Fortifications", kind: "fortification", maxBudget: 4 },
];

/**
 * Resolve an infantry pool by size classes across one or more group sets
 * (the mission maker can mix enemy forces, e.g. USSR Army + Spetsnaz).
 * Falls back to all size classes if the requested ones are empty.
 */
export function resolveGroupPool(factionKey, groupSetKeys, sizes) {
  const faction = FACTIONS[factionKey];
  if (!faction) throw new Error(`Unknown faction: ${factionKey}`);
  let keys = groupSetKeys;
  if (typeof keys === "string") keys = [keys];
  if (!keys?.length) keys = [faction.defaultGroupSet];
  const sets = keys.map((k) => {
    const set = faction.groupSets[k];
    if (!set) throw new Error(`Unknown group set ${factionKey}/${k}`);
    return set;
  });
  const collect = (classes) => [...new Set(sets.flatMap((set) => classes.flatMap((s) => set[s] ?? [])))];
  const refs = collect(sizes);
  if (refs.length) return refs;
  return collect(["small", "medium", "large"]);
}

/**
 * Sentry-team pool for the Fortification plugin: one team per selected enemy
 * group set (suppressed SF sets carry their parent's team, so dedupe).
 */
export function resolveSentryPool(factionKey, groupSetKeys) {
  const faction = FACTIONS[factionKey];
  if (!faction) throw new Error(`Unknown faction: ${factionKey}`);
  let keys = groupSetKeys;
  if (typeof keys === "string") keys = [keys];
  if (!keys?.length) keys = [faction.defaultGroupSet];
  return [
    ...new Set(
      keys.map((k) => {
        const set = faction.groupSets[k];
        if (!set) throw new Error(`Unknown group set ${factionKey}/${k}`);
        return set.sentry;
      })
    ),
  ];
}
