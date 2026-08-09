// Bandit Faction — enemy-only PvE faction (author-confirmed: "NOT currently
// set up to be a playable faction. I recommend using it for PvE enemies only").
//
// Dependency anchor: Bandit Faction (66C4458756B32594) — its .gproj declares
// Bandit Gear (66B523AD189F3233), which declares Zelik's Character
// (5D0551624969C92E); one GUID resolves the chain transitively.
//
// FactionManager pattern (NEW — differs from RHS/BF/MEI): the mod overrides
// vanilla FactionManager_BASE.et (same root ID 56B2B4776E6E4499), appending
// member {6735141732DAB748} : Configs/Factions/PLASTICBANDIT.conf. Vanilla
// Base declares no members and Editor inherits Base, so the member reaches
// our missions by prefab inheritance and is overridden by instance GUID like
// any Editor-declared member.
//
// PLASTICBANDIT.conf: m_bIsPlayable 0 explicit, NO m_aFriendlyFactionsIds
// (hostile to everything — works vs any playable side, no clearing), radio
// 5800, EMPTY inline callsign object (fine for enemy-only: only
// m_bIsAssignedRandomly is emitted; squadBase stays empty). No spawn points
// or fortification compositions in the mod — FIA spawn ref for shape
// completeness (unused, enemy-only), vanilla USSR fortification pools.
//
// All GUIDs from Configs/EntityCatalog/PLASTICBANDIT/*.conf (extraction
// D:\VSCode_dev\arma-reforger\reference\Bandit Faction; AmbientPatrols
// *_NotSpawned catalog entries excluded per pool rules).
const P_BANDIT_G = "Prefabs/Groups/PLASTICBANDIT";
const P_SLOT = "Prefabs/Compositions/Slotted";

export const BANDITS = {
  id: "bandits",
  label: "Bandit Faction",
  workshopUrl: "https://reforger.armaplatform.com/workshop/66C4458756B32594",
  dependencies: ["66C4458756B32594"],
  factions: {
    PLASTICBANDIT: {
      label: "Bandits",
      entryGuid: "{6735141732DAB748}",
      callsignGuid: "{67271E167FE29B3D}",
      squadBase: [],
      squadFifth: null,
      spawnPoint: "{72713ED566A531F3}PrefabsEditable/SpawnPoints/E_SpawnPoint_FIA.et",
      // No officer in the mod — Stalker "Shadow" is the distinct named
      // character (Scav Brute {E520BB188371797C} as alternate)
      hvt: "{22B4E6BA1E4F0B30}Prefabs/Characters/Factions/PLASTICBANDIT/Stalker/Character_PLASTICBANDIT_Stalker_Shadow.et",
      riflemen: {},
      loadoutSets: {},
      arsenalItems: [],
      // The mod's "UAZ452_Armed_Bandit" is NOT armed — it's a pure editor
      // budget-cost override of the transport van (author misnomer, dropped).
      // The mod ships no armed vehicle, so the gun-truck slot is the vanilla
      // USSR UAZ-469 PKM (captured); the Bukhanka stays as the honest
      // troop-carrier option.
      vehicles: {
        UAZ469_PKM: "{0B4DEA8078B78A9B}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_PKM.et",
        UAZ452_transport_Bandit: "{9B9DF3CDAFDF6BE3}Prefabs/Vehicles/Wheeled/UAZ452/UAZ452_transport_Bandit.et",
        S105_Bandit: "{DC08B2446B718430}Prefabs/Vehicles/Wheeled/S105/S105_Bandit.et",
        S105_Bandit_02: "{BB74B5B15F8A091B}Prefabs/Vehicles/Wheeled/S105/S105_Bandit_02.et",
      },
      vehicleLabels: {
        UAZ469_PKM: "UAZ-469 PKM (captured)",
        UAZ452_transport_Bandit: "UAZ-452 Van",
        S105_Bandit: "S105 Car",
        S105_Bandit_02: "S105 Car (alt)",
      },
      patrolVehicleKeys: ["UAZ469_PKM"],
      // The Bukhanka predates the armed/unarmed split (was in patrolVehicleKeys
      // as the deliberate troop-carrier option); the S105 civilian cars stay
      // out of the pool by the don't-overpopulate rule
      transportVehicleKeys: ["UAZ452_transport_Bandit"],
      // CONCRETE characters only — Character_PLASTICBANDIT_Randomized is an
      // editor variant-table wrapper over an unarmed BaseLoadout; direct
      // spawns (FillCompartments) get the base: unarmed identical clones
      // (playtest-caught 2026-07-31)
      patrolCrew: [
        "{40E3BABD93B85F2D}Prefabs/Characters/Factions/PLASTICBANDIT/Scav/Character_PLASTICBANDIT_Scav_Rookie.et",
        "{C1F886698C7AB55F}Prefabs/Characters/Factions/PLASTICBANDIT/Scav/Character_PLASTICBANDIT_Scav_Rookie_2.et",
        "{08AFE0C974319080}Prefabs/Characters/Factions/PLASTICBANDIT/Scav/Character_PLASTICBANDIT_Scav_Veteran.et",
        "{ED01FD5B050F8D1C}Prefabs/Characters/Factions/PLASTICBANDIT/Scav/Character_PLASTICBANDIT_Scav_Gopnik.et",
        "{1063DF1108C9D39B}Prefabs/Characters/Factions/PLASTICBANDIT/Stalker/Character_PLASTICBANDIT_Stalker_Rookie.et",
        "{34F236B87F308240}Prefabs/Characters/Factions/PLASTICBANDIT/Stalker/Character_PLASTICBANDIT_Stalker_Veteran.et",
      ],
      // Vanilla USSR pools — no compositions in the mod; scavenged Soviet
      // positions fit the fiction (same refs as MEI)
      fortifications: {
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
      },
      // ONE pool, no subfaction choice (EnemyPanel hides single-set factions).
      // Randomized-wrapper slots INSIDE group prefabs resolve fine (playtest
      // 2026-07-31) — only INDIVIDUAL direct spawns (crew seats, hvt) get the
      // unarmed base, so all 7 groups are usable. Slot counts: Squad 10,
      // FireTeams 6, MGTeam 4, Patrol/RPGTeam/Sharpshooter 3.
      defaultGroupSet: "Bandits",
      groupSets: {
        Bandits: {
          label: "Bandits",
          sentry: `{7E7B234B9503F8D8}${P_BANDIT_G}/Group_PLASTICBANDIT_Patrol.et`,
          defense: { ref: `{EE1CA3E20AA9E4F0}${P_BANDIT_G}/Group_PLASTICBANDIT_Squad.et`, size: 10 },
          small: [
            `{7E7B234B9503F8D8}${P_BANDIT_G}/Group_PLASTICBANDIT_Patrol.et`,
            `{C4FEF5D8AC0DB8D6}${P_BANDIT_G}/Group_PLASTICBANDIT_MGTeam.et`,
            `{10D3AFE50879B195}${P_BANDIT_G}/Group_PLASTICBANDIT_RPGTeam.et`,
            `{3B840E8559DD4F31}${P_BANDIT_G}/Group_PLASTICBANDIT_Sharpshooter.et`,
          ],
          medium: [
            `{1F1451C4E968C477}${P_BANDIT_G}/Group_PLASTICBANDIT_FireTeam.et`,
            `{7B3B2E1089F7AA26}${P_BANDIT_G}/Group_PLASTICBANDIT_FireTeam_Heavy.et`,
          ],
          large: [`{EE1CA3E20AA9E4F0}${P_BANDIT_G}/Group_PLASTICBANDIT_Squad.et`],
        },
      },
    },
  },
};
