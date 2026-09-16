// Bundeswehr Mod — mod content registry (harvested 2026-09-15, mod v0.2.0).
//
// Every GUID here is ground-truthed from inline `{GUID}path` references in the
// unpacked dump (D:\VSCode_dev\arma-reforger\reference\Bundeswehr Mod):
//   - faction entry:   Prefabs/MP/Managers/Factions/FactionManager_Editor.et (the
//                      mod's override of the vanilla prefab — RHS/UK entryGuid pattern)
//   - groups:          Configs/EntityCatalog/BWAR/BWAR_Groups_EntityCatalog.conf
//   - characters:      Configs/EntityCatalog/BWAR/BWAR_Characters_EntityCatalog.conf
//                      (+ the mod's LoadoutManager_BWAR.et for the playable roster)
//   - vehicles:        Configs/EntityCatalog/BWAR/BWAR_Vehicles_EntityCatalog.conf
//   - spawn point:     Worlds/Showcase_BWAR_Layers/default_*.layer (SpawnPoint_BWAR.et;
//                      the E_ editable variant has no harvestable GUID)
//   - arsenal items:   Configs/EntityCatalog/BWAR/BWAR_InventoryItems_EntityCatalog.conf
//                      (+ the character prefabs for what they actually carry)
// Full raw harvest + exclusions: input/bundeswehr-harvest.md.
//
// BUNDLE (user decision 2026-09-15): the mod ships only ONE unarmed vehicle (the
// Dingo 2), so "PZG GER Vanilla Reskin" `685EC277A4031C83` — 17 vanilla US
// vehicles (jeeps, HMMWVs, M923A1 trucks, LAV-25, UH-1Hs) reskinned into German
// camo, appended to the vanilla US vehicle catalog — is a second dependency of
// this def and its armed vehicles form the BWAR patrol/QRF pool. Both GUIDs go
// into addon.gproj whenever BWAR is a mission side. The reskin's catalog
// override also DISABLES ~30 vanilla US catalog entries (GM browser / Conflict
// spawners only — our SF slots spawn by prefab ref, unaffected).
//
// GUID COLLISION (excluded by user decision 2026-09-15): BWAR_Group_FireTeam.et
// carries `{84E5BBAB25EA23E6}` — byte-identical to the SFS US mod's own
// Group_US_FireTeam GUID (both authors bumped the vanilla FireTeam GUID
// {84E5BBAB25EA23E5} by one). A mission loading both packs (SFS_US vs BWAR)
// would resolve one prefab for both refs, so the BWAR FireTeam stays OUT of
// every pool; FireTeam_Guard has the identical TL/AT/AT/Grenadier composition.
//
// Two camo lines with identical role ladders: Flecktarn (default, temperate)
// and Tropentarn (`_3FT`, desert) — separate subfactions on the playable side
// and separate group sets on the enemy side. The 5 `AmbientPatrols/*_NotSpawned`
// groups (m_bSpawnImmediately 0) and Transport/Base are excluded per the
// catalog rules. `BWAR_Character_Randomized*` are variant wrappers over the
// UNARMED vanilla US base loadout — never used for individual spawns.

const P_G = "Prefabs/Groups/Bundeswehr";
const P_GT = "Prefabs/Groups/Bundeswehr/Tropen";
const P_C = "Prefabs/Characters/Factions/BLUFOR/Bundeswehr";
const P_CT = "Prefabs/Characters/Factions/BLUFOR/Bundeswehr/Tropen";
const P_SLOT = "Prefabs/Compositions/Slotted";
const P_RS = "Prefabs/Vehicles"; // PZG GER Vanilla Reskin (paths contain SPACES — verbatim)

const CH = {
  Rifleman: `{9A5161184FEEEDBF}${P_C}/BWAR_Character_Rifleman.et`,
  Grenadier: `{DA758A4FD5998CF3}${P_C}/BWAR_Character_Grenadier.et`,
  MG: `{D4A48867674F2C88}${P_C}/BWAR_Character_MG.et`,
  AMG: `{55C787F9CF964831}${P_C}/BWAR_Character_AMG.et`,
  Ammo: `{5430AA7481E96345}${P_C}/BWAR_Character_Ammo.et`,
  AT: `{149BDF6162AB5470}${P_C}/BWAR_Character_AT.et`,
  Marksman: `{30D1786FC6E2F847}${P_C}/BWAR_Character_Marksman.et`,
  Medic: `{6B2DA1277F16C6B7}${P_C}/BWAR_Character_Medic.et`,
  RTO: `{03E3BE7DC3BDACB7}${P_C}/BWAR_Character_RTO.et`,
  Sapper: `{9585DBF6F55C2FAF}${P_C}/BWAR_Character_Sapper.et`,
  Engineer: `{8F41526498108AC4}${P_C}/BWAR_Character_Engineer.et`,
  Scout: `{9193CE7A1A06009F}${P_C}/BWAR_Character_Scout.et`,
  TL: `{A67CBDEE4F2052FC}${P_C}/BWAR_Character_TL.et`,
  SL: `{9AF20C687BF04BF5}${P_C}/BWAR_Character_SL.et`,
  Sergeant: `{F637ADD675BFB1BF}${P_C}/BWAR_Character_Sergeant.et`,
  PL: `{38A5FE263441D9AF}${P_C}/BWAR_Character_PL.et`,
  Officer: `{F5E2E8A6DC6017B9}${P_C}/BWAR_Character_Officer.et`,
};
const CHT = {
  Rifleman: `{2B099D45A90FAF36}${P_CT}/BWAR_Character_Rifleman_3FT.et`,
  Grenadier: `{80766458E84F87D3}${P_CT}/BWAR_Character_Grenadier_3FT.et`,
  MG: `{28A3366D0E910E4F}${P_CT}/BWAR_Character_MG_3FT.et`,
  AMG: `{620D6CF4D17E95C3}${P_CT}/BWAR_Character_AMG_3FT.et`,
  Ammo: `{F59D4DEBBB719C0E}${P_CT}/BWAR_Character_Ammo_3FT.et`,
  AT: `{8A0C25A7AD676BC6}${P_CT}/BWAR_Character_AT_3FT.et`,
  Marksman: `{4967711ACA970B61}${P_CT}/BWAR_Character_Marksman_3FT.et`,
  Medic: `{BB74B7B3D08ED5DA}${P_CT}/BWAR_Character_Medic_3FT.et`,
  RTO: `{1EC2F00E8F661603}${P_CT}/BWAR_Character_RTO_3FT.et`,
  Sapper: `{366D894E0998250E}${P_CT}/BWAR_Character_Sapper_3FT.et`,
  Engineer: `{23581816093823A2}${P_CT}/BWAR_Character_Engineer_3FT.et`,
  Scout: `{1A6F5D23E4CE2FD6}${P_CT}/BWAR_Character_Scout_3FT.et`,
  TL: `{5A0B45F504E89644}${P_CT}/BWAR_Character_TL_3FT.et`,
  SL: `{43C20EA294547346}${P_CT}/BWAR_Character_SL_3FT.et`,
  Sergeant: `{115C13A51F3D0ADB}${P_CT}/BWAR_Character_Sergeant_3FT.et`,
  PL: `{4DDC4AEAA9A37C9C}${P_CT}/BWAR_Character_PL_3FT.et`,
  Officer: `{625F272A77B8E841}${P_CT}/BWAR_Character_Officer_3FT.et`,
};

// Playable roster order (mod string-table names, "Unarmed" base loadout dropped;
// the mod's "Combat Signaler" is our Radio Operator, "AT Riflemen" singularized).
const ROSTER = [
  ["Rifleman", "Rifleman"],
  ["Grenadier", "Grenadier"],
  ["Machine-Gunner", "MG"],
  ["Assistant Machine-Gunner", "AMG"],
  ["Ammunition Bearer", "Ammo"],
  ["AT Rifleman", "AT"],
  ["Marksman", "Marksman"],
  ["Medic", "Medic"],
  ["Radio Operator", "RTO"],
  ["Sapper", "Sapper"],
  ["Engineer", "Engineer"],
  ["Scout", "Scout"],
  ["Team Leader", "TL"],
  ["Squad Leader", "SL"],
  ["Sergeant", "Sergeant"],
  ["Platoon Leader", "PL"],
  ["Officer", "Officer"],
];
const roster = (dict) => ROSTER.map(([name, k]) => ({ name, prefab: dict[k] }));

// Group ladder — identical per camo line; FireTeam deliberately absent (see the
// GUID-collision note above) and SniperTeam absent because the mod ships the
// prefab but does NOT list it in its group catalog (catalog-driven rule). Size classes are count-driven (1.8 rule):
// small = 2-man teams, medium = 4-man teams, large = the 8-man RifleSquad.
function groupSet(label, P, sfx) {
  const g = (name, guid) => `${guid}${P}/BWAR_Group_${name}${sfx}.et`;
  const G = sfx
    ? {
        SentryTeam: "{B82A707CA4C81F16}", RifleSquad: "{6F18A6FE0BAD2DF2}",
        MachineGunTeam: "{345AA810A2AC8399}", MedicalSection: "{9D684B9139759422}",
        ReconTeam: "{185E032FAABD0DD3}", SapperTeam: "{45DA513EE9020CC9}",
        EngineerTeam: "{5DB38892E14418CF}",
        FireTeam_Guard: "{20BB16D91E866632}", LightFireTeam: "{8495CE04D59A040D}",
        PlatoonHQ: "{56ECF4EA0EFEC854}", AmmoTeam: "{03294A6AEB3DAF09}",
        Team_GL: "{C7D4EFA10F95DAAE}", Team_LAT: "{15EA759FD633930A}", Team_Suppress: "{5E92C8558C2224C6}",
      }
    : {
        SentryTeam: "{A24C8371464BA2D1}", RifleSquad: "{027F7157D1D94E05}",
        MachineGunTeam: "{99B65E40BA7687F9}", MedicalSection: "{E35465842A1598DB}",
        ReconTeam: "{DC53F57F0D335847}", SapperTeam: "{4D87BB5D817BCA04}",
        EngineerTeam: "{48C97BE37EAE9A08}",
        FireTeam_Guard: "{06B8470DE0EDDF63}", LightFireTeam: "{6E72CE24FFDDB286}",
        PlatoonHQ: "{1C5D152DAC6DE815}", AmmoTeam: "{5795D9156E591B85}",
        Team_GL: "{7026A94ADBE983D1}", Team_LAT: "{CC0C75439B0B3F3A}", Team_Suppress: "{FC0EF5D74FD1C536}",
      };
  return {
    label,
    sentry: g("SentryTeam", G.SentryTeam),
    defense: { ref: g("RifleSquad", G.RifleSquad), size: 8 },
    small: [
      g("SentryTeam", G.SentryTeam),
      g("MachineGunTeam", G.MachineGunTeam),
      g("MedicalSection", G.MedicalSection),
      g("ReconTeam", G.ReconTeam),
      g("SapperTeam", G.SapperTeam),
      g("EngineerTeam", G.EngineerTeam),
    ],
    medium: [
      g("FireTeam_Guard", G.FireTeam_Guard),
      g("LightFireTeam", G.LightFireTeam),
      g("PlatoonHQ", G.PlatoonHQ),
      g("AmmoTeam", G.AmmoTeam),
      g("Team_GL", G.Team_GL),
      g("Team_LAT", G.Team_LAT),
      g("Team_Suppress", G.Team_Suppress),
    ],
    large: [g("RifleSquad", G.RifleSquad)],
  };
}

export const BUNDESWEHR = {
  id: "bundeswehr",
  label: "Bundeswehr Mod",
  workshopUrl: "https://reforger.armaplatform.com/workshop/59673B087BFF710C",
  // Bundeswehr Mod + PZG GER Vanilla Reskin (bundled vehicle pool — see header)
  dependencies: ["59673B087BFF710C", "685EC277A4031C83"],
  // the bundled second addon players must ALSO install — the builder lists it
  // next to the mod in the Important! callout (user request 2026-09-16)
  extraAddons: [
    {
      label: "PZG GER Vanilla Reskins",
      workshopUrl: "https://reforger.armaplatform.com/workshop/685EC277A4031C83",
    },
  ],
  factions: {
    BWAR: {
      label: "Bundeswehr",
      // The mod OVERRIDES vanilla FactionManager_Editor.et (same parent, same
      // root ID 56B2B4776E6E4499) appending BWAR with m_bIsPlayable 0 —
      // mission layers override that EXISTING member by instance GUID.
      entryGuid: "{69B9258ECBAB97DF}",
      // Inline SCR_FactionCallsignInfo in Configs/Factions/BWAR.conf, parented
      // to vanilla Callsigns_US.conf with NO squad overrides — the instance
      // GUID is the same copy-paste as British Forces', squad members are
      // the vanilla US four.
      callsignGuid: "{5DA0F2A6677ADA9E}",
      squadBase: ["{55CCB792D10AD8F4}", "{55CCB792D13759D8}", "{55CCB792D1218E95}", "{55CCB792D0C8B3CE}"],
      squadFifth: null,
      // BWAR.conf declares m_aFriendlyFactionsIds { "US" } — symmetric, so a
      // US-vs-BWAR mission clears it via the member override (UK pattern)
      friendlyWith: ["US"],
      spawnPoint: "{3D5097F57981B0BB}Prefabs/MP/Spawning/SpawnPoint_BWAR.et",
      // Pistol-only officer prefab (like vanilla US) — Eliminate-HVT target
      hvt: CH.Officer,
      riflemen: {
        Flecktarn: CH.Rifleman,
        Tropentarn: CHT.Rifleman,
      },
      loadoutSets: {
        Flecktarn: roster(CH),
        Tropentarn: roster(CHT),
      },
      // Assembled from what the character prefabs actually carry (G36/G28/MG5/
      // P8 magazines, DM42 40 mm, DM51/DM45/DM21 grenades, M112 + M34, vanilla
      // US medical kit) + the catalog's launcher/rounds/mines/radios/backpack.
      // No primary weapons (players spawn with their issued weapon).
      arsenalItems: [
        { mode: "WEAPON", ref: "{9BD71AF57C0490C5}Prefabs/Weapons/Launchers/PzF3/BWAR_Launcher_PzF3.et" },
        { mode: "WEAPON", ref: "{28DA1878A068C4F2}Prefabs/Weapons/Launchers/PzF3/BWAR_Launcher_PzF3_Bunkerfaust.et" },
        { mode: "AMMUNITION", ref: "{AA735CE9A40FD288}Prefabs/Weapons/Magazines/BWAR_Magazine_PzF3_1rnd_DM32_AS.et" },
        { mode: "AMMUNITION", ref: "{11ED2DBDE8EECA48}Prefabs/Weapons/Magazines/BWAR_Magazine_PzF3_1rnd_DM72A1_HEAT.et" },
        { mode: "AMMUNITION", ref: "{1BF788DA3537AFE9}Prefabs/Weapons/Magazines/BWAR_Magazine_556x45_G36_30rnd_DM11_Ball.et" },
        { mode: "AMMUNITION", ref: "{021CA9D58AE1F2AC}Prefabs/Weapons/Magazines/BWAR_Magazine_556x45_G36_30rnd_DM21_Tracer.et" },
        { mode: "AMMUNITION", ref: "{6EFCF7E34938714F}Prefabs/Weapons/Magazines/BWAR_Magazine_762x51_G28_20rnd_DM111_Ball.et" },
        { mode: "AMMUNITION", ref: "{CFFD4B9779EDE062}Prefabs/Weapons/Magazines/BWAR_Magazine_762x51_G28_20rnd_DM41_AP.et" },
        { mode: "AMMUNITION", ref: "{2CF76DB20898F57D}Prefabs/Weapons/Magazines/BWAR_Magazine_762x51_G28_20rnd_DM21A2_Tracer.et" },
        { mode: "AMMUNITION", ref: "{76B2FC59ED3A6242}Prefabs/Weapons/Magazines/BWAR_Box_762x51_MG5_60rnd_DM111_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{4D8E0E2E19B0B734}Prefabs/Weapons/Magazines/BWAR_Box_762x51_MG5_60rnd_DM41_AP.et" },
        { mode: "AMMUNITION", ref: "{88C0C4C6D14EF158}Prefabs/Weapons/Magazines/BWAR_Magazine_9x19_P8_15rnd_DM11_Ball.et" },
        { mode: "AMMUNITION", ref: "{BC11E37A880AB3D0}Prefabs/Weapons/Ammo/BWAR_Ammo_Grenade_HE_DM42.et" },
        { mode: "", ref: "{F253D67BA9380DF5}Prefabs/Weapons/Grenades/BWAR_Grenade_DM51_Frag.et" },
        { mode: "", ref: "{8C1E979CA7366A56}Prefabs/Weapons/Grenades/BWAR_Grenade_DM51_HE.et" },
        { mode: "", ref: "{5CC1F37D358B24B1}Prefabs/Weapons/Grenades/BWAR_Smoke_DM45.et" },
        { mode: "", ref: "{F9704133DA6BD094}Prefabs/Weapons/Grenades/BWAR_Smoke_DM21A2B1_Green.et" },
        { mode: "", ref: "{CD6A17AD4E413817}Prefabs/Weapons/Grenades/BWAR_Smoke_DM23A2B1_Red.et" },
        { mode: "", ref: "{B55CF6A748477D00}Prefabs/Weapons/Grenades/BWAR_Smoke_DM26A2B1_Yellow.et" },
        { mode: "", ref: "{33CBDE73AB48172A}Prefabs/Weapons/Explosives/DemoBlock_M112/DemoBlock_M112.et" },
        { mode: "", ref: "{CE0AF733722B3978}Prefabs/Items/Equipment/Detonators/BlastingMachine_M34/BlastingMachine_M34.et" },
        { mode: "", ref: "{E4C9F0A4090CFE4D}Prefabs/Weapons/Explosives/Mine_M14/Mine_M14.et" },
        { mode: "", ref: "{49FFE8F373F55960}Prefabs/Weapons/Explosives/Mine_M15AT/Mine_M15AT.et" },
        { mode: "CONSUMABLE", ref: "{A81F501D3EF6F38E}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_US_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{00E36F41CA310E2A}Prefabs/Items/Medicine/SalineBag_01/SalineBag_US_01.et" },
        { mode: "CONSUMABLE", ref: "{D70216B1B2889129}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_US_01.et" },
        { mode: "", ref: "{0CF54B9A85D8E0D4}Prefabs/Items/Equipment/Binoculars/Binoculars_M22/Binoculars_M22.et" },
        { mode: "", ref: "{6F5E23A96DE41480}Prefabs/Items/Equipment/Radios/BWAR_Radio_ANPRC163.et" },
        { mode: "", ref: "{73950FBA2D7DB5C5}Prefabs/Items/Equipment/Radios/Radio_ANPRC68.et" },
        { mode: "", ref: "{9B6B61BB3FE3DFB0}Prefabs/Items/Equipment/Radios/Radio_ANPRC77.et" },
        { mode: "", ref: "{7B60A7CF3689D55A}Prefabs/Characters/Backpacks/BWAR_Backpack_Trizip.et" },
      ],
      // Dingo 2 (the mod's only vehicle, UNARMED — turret slot registered but
      // never filled) + the PZG GER reskins of vanilla US vehicles. Reskin
      // keys = the vanilla key + `_GER`; reskin file names contain spaces.
      vehicles: {
        BWAR_Dingo2A3_2B: "{193CAE259137911B}Prefabs/Vehicles/Wheeled/Dingo2/BWAR_Dingo2A3_2B.et",
        BWAR_Dingo2A3_2B_3FT: "{F373992A38F2FEF4}Prefabs/Vehicles/Wheeled/Dingo2/BWAR_Dingo2A3_2B_3FT.et",
        M151A2_GER: `{9BDDB06E8D3E3D8D}${P_RS}/Wheeled/M151A2/M151A2 PZG GER.et`,
        M151A2_transport_GER: `{A59B6CE827176166}${P_RS}/Wheeled/M151A2/M151A2 Roof PZG GER.et`,
        M151A2_M2HB_GER: `{B45E86F64FD17B13}${P_RS}/Wheeled/M151A2/M151A2 armed PZG GER.et`,
        M998_covered_GER: `{F51C4A5DEFEC9E90}${P_RS}/Wheeled/M998/M1025 light PZG GER.et`,
        M1025_GER: `{61C45911C277F184}${P_RS}/Wheeled/M998/M1025 PZG GER.et`,
        M1025_armed_M2HB_GER: `{29B6B56EB4ADC157}${P_RS}/Wheeled/M998/M1025 armed PZG GER.et`,
        M997_maxi_ambulance_GER: `{EDEBB5E916D0D8E5}${P_RS}/Wheeled/M998/M1025_maxi_ambulance_GER.et`,
        M923A1_transport_GER: `{40CC95401F931557}${P_RS}/Wheeled/M923A1/M923A1 transpo 1 PZG GER.et`,
        M923A1_transport_covered_GER: `{2F4496DBB6BF8195}${P_RS}/Wheeled/M923A1/M923A1 covered PZG GER.et`,
        M923A1_tanker_GER: `{7D5A6B25C6622144}${P_RS}/Wheeled/M923A1/M923A1 tanker PZG GER.et`,
        M923A1_command_GER: `{1C39719492E2DF66}${P_RS}/Wheeled/M923A1/M923A1 Command PZG GER.et`,
        M923A1_arsenal_GER: `{515237604A3896FC}${P_RS}/Wheeled/M923A1/M923A1 Arsenal PZG GER.et`,
        M923A1_repair_GER: `{4AAF0D3BC2B93ED1}${P_RS}/Wheeled/M923A1/M923A1 repair PZG GER.et`,
        M923A1_engineer_GER: `{E293F1978E4A4F08}${P_RS}/Wheeled/M923A1/M923A1 Engineer PZG GER.et`,
        LAV25_GER: `{A431F97175AFB711}${P_RS}/Wheeled/LAV25/LAV25 PZG GER.et`,
        UH1H_GER: `{19957370950822FC}${P_RS}/Helicopters/UH1H/UH1H PZG GER.et`,
        UH1H_armed_GER: `{B63FCA821F1AAF27}${P_RS}/Helicopters/UH1H/UH1H armed PZG GER.et`,
        UH1H_gunship_HEDP_GER: `{62B49833125D09EA}${P_RS}/Helicopters/UH1H/UH1H gunship PZG GER.et`,
        UH1H_supply_GER: `{71F5CD3C708CAE11}${P_RS}/Helicopters/UH1H/UH1H Supply PZG GER.et`,
      },
      vehicleLabels: {
        BWAR_Dingo2A3_2B: "Dingo 2 A3.2B (Flecktarn)",
        BWAR_Dingo2A3_2B_3FT: "Dingo 2 A3.2B (Tropentarn)",
        M151A2_GER: "M151A2 (GER)",
        M151A2_transport_GER: "M151A2 Jeep (GER)",
        M151A2_M2HB_GER: "M151A2 M2HB (GER)",
        M998_covered_GER: "M998 HMMWV (GER)",
        M1025_GER: "M1025 HMMWV (GER)",
        M1025_armed_M2HB_GER: "M1025 M2HB (GER)",
        M997_maxi_ambulance_GER: "M997 Ambulance (GER)",
        M923A1_transport_GER: "M923A1 Truck (GER)",
        M923A1_transport_covered_GER: "M923A1 Truck (covered, GER)",
        M923A1_tanker_GER: "M923A1 Fuel Tanker (GER)",
        M923A1_command_GER: "M923A1 Command Truck (GER)",
        M923A1_arsenal_GER: "M923A1 Arsenal Truck (GER)",
        M923A1_repair_GER: "M923A1 Repair Truck (GER)",
        M923A1_engineer_GER: "M923A1 Engineer Truck (GER)",
        LAV25_GER: "LAV-25 (GER)",
        UH1H_GER: "UH-1H (GER)",
        UH1H_armed_GER: "UH-1H (armed, GER)",
        UH1H_gunship_HEDP_GER: "UH-1H Gunship HEDP (GER)",
        UH1H_supply_GER: "UH-1H Supply (GER)",
      },
      patrolVehicleKeys: ["M151A2_M2HB_GER", "M1025_armed_M2HB_GER", "LAV25_GER"],
      transportVehicleKeys: ["M151A2_transport_GER", "BWAR_Dingo2A3_2B", "M923A1_transport_covered_GER"],
      // Mounted-patrol / vehicle-QRF crew — always emitted (m_aCrewPrefabPool);
      // the Dingo's prefab-default occupant is the vanilla US rifleman.
      patrolCrew: [CH.Rifleman, CH.TL, CH.MG, CH.AT, CH.Medic],
      // The mod ships no fortification compositions — vanilla US pools
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
      defaultGroupSet: "Flecktarn",
      groupSets: {
        Flecktarn: groupSet("Flecktarn", P_G, ""),
        Tropentarn: groupSet("Tropentarn", P_GT, "_3FT"),
      },
    },
  },
};
