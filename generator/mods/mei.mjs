// Middle East Insurgents — REAL faction from the "MiddleEastInsurgents" mod,
// voiced Arabic via our own "TS MEI Arabic Voices" addon (see the anchor note
// on the mod def below; the original Czech to Arabic anchor died 2026-09-04
// when its direct dependency "Israelite Utility" was blocked by Bohemia).
//
// Why a real faction (v2, replacing the earlier "USSR 2 Middle East" alias
// integration): MiddleEastInsurgents defines MEI as a REAL faction (FactionKey
// "MEI", INDFOR-based, own flag/callsigns/radio 52000, friendly only to
// CIV+MEC) and OVERRIDES the vanilla FactionManager_Editor.et (same root ID
// 56B2B4776E6E4499), appending MEI as member {6A4624294CD7E4A0} (+ a MEC
// civilian-militia member {6A4624294DDAF524} we leave untouched) — the
// validated RHS entryGuid path. A real faction means USSR-vs-MEI works, no
// reskin-coverage caveats, and no alias machinery. Plain "MiddleEastInsurgents"
// alone would leave the insurgents speaking Czech (they inherit FIA voices).
//
// All GUIDs RE-HARVESTED for MEI 1.3.1 (2026-09-04): the author regenerated
// the resource GUIDs of every group + character prefab AND the FactionManager
// member + callsign instance; the mod's catalog confs still carry the OLD
// GUIDs next to the new ones (Workbench flagged every old one nonexistent).
// Truth = prefab side (parent chains / variant tables); conf-only paths take
// the unflagged candidate. Vehicles + squad-name members were NOT regenerated.
// 1.3.1 also grew the catalog: Team_GL/LAT/Suppress + SharpshooterTeam now
// have trustworthy GUIDs (unrecoverable in July) and RifleSquad is 7 slots.
// All GUIDs ground-truthed from the extraction
// (D:\VSCode_dev\arma-reforger\reference\MiddleEastInsurgents):
//   - faction member:  Prefabs/MP/Managers/Factions/FactionManager_Editor.et
//   - groups:          Configs/EntityCatalog/FIA/Groups_EntityCatalog_MEI.conf
//   - callsigns:       Configs/Callsigns/Callsigns_MEI.conf (4 squads "1"-"4")
// MEI ships no vehicle catalog of its own (MEI.conf points at the vanilla FIA
// vehicle catalog) and no spawn points — vehicles/spawn refs below are the
// vanilla FIA ones; fortifications reuse the vanilla USSR pools (user call).
// Enemy-only by design (riflemen/loadoutSets empty).
const P_MEI_G = "Prefabs/Groups/MEI";
const P_SLOT = "Prefabs/Compositions/Slotted";

export const MEI = {
  id: "mei",
  label: "Middle East Insurgents",
  // Anchor = our own "TS MEI Arabic Voices" addon (0B6643C078688A29, built
  // 2026-09-04, source: Workbench addons dir "TS MEI Arabic Voices"): two
  // resource overrides that route MEI characters through the vanilla Russian
  // voice pipeline (Character_MEI_Base.et sound component -> vanilla voice
  // code + RU radio-protocol acps; FactionIdentity_MEI.conf VoiceIDs 201/202
  // -> 101/102), which "Russian to Arabic" 1.0.9 (65E0AE1A83DA063A, now
  // self-contained) overrides with Arabic samples. Its .gproj pulls
  // MiddleEastInsurgents + Russian to Arabic transitively. Replaces the
  // Czech to Arabic anchor (direct dep on the blocked Israelite Utility).
  // Side effect: vanilla USSR troops in the same mission speak Arabic too.
  workshopUrl: "https://reforger.armaplatform.com/workshop/0B6643C078688A29",
  dependencies: ["0B6643C078688A29"],
  // Un-hidden 2026-09-04 once the TS MEI Arabic Voices addon was published
  // to the Workshop (0B6643C078688A29); playtest of the Arabic voices pending.
  hidden: false,
  factions: {
    MEI: {
      label: "Middle East Insurgents",
      // MEI 1.3.1 (2026-09-03) regenerated the FactionManager override: MEI
      // member {6A4624294CD7E4A0} (was {64E5479B63D9AEFF}), MEC {6A4624294DDAF524}
      entryGuid: "{6A4624294CD7E4A0}",
      // m_CallsignInfo instance in MEI.conf (regenerated in 1.3.1), members
      // from Callsigns_MEI.conf (unchanged)
      callsignGuid: "{68E0FDE916735380}",
      squadBase: ["{64D896904E7CCB74}", "{64D896904E7CCB45}", "{64D896904E7CCB44}", "{64D896904E7CCB47}"],
      squadFifth: null,
      // MEI.conf declares CIV + MEC friendly — neither can be a mission side,
      // so no clearing ever triggers; recorded for completeness
      friendlyWith: ["CIV", "MEC"],
      spawnPoint: "{72713ED566A531F3}PrefabsEditable/SpawnPoints/E_SpawnPoint_FIA.et",
      // HVT for Eliminate-HVT objectives
      hvt: "{15CD0954AEE19BF2}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Leader.et",
      riflemen: {},
      loadoutSets: {},
      arsenalItems: [],
      // Native MEI reskins where the mod ships them (UAZ plain + PKM, covered
      // Ural); vanilla USSR armor for the heavier patrol tiers — no MEI
      // variants exist, and captured Soviet vehicles fit insurgents better
      // than the fictional-force FIA skins
      vehicles: {
        UAZ469_MEI: "{C43AFDF4133C764B}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_MEI.et",
        UAZ469_PKM_MEI: "{1160703EE72C1945}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469_PKM_MEI.et",
        Ural4320_transport_covered_MEI: "{5DA1C29E005ECC50}Prefabs/Vehicles/Wheeled/Ural4320/Ural4320_transport_covered_MEI.et",
        BRDM2: "{254289B9C09904AB}Prefabs/Vehicles/Wheeled/BRDM2/BRDM2.et",
        BTR70: "{C012BB3488BEA0C2}Prefabs/Vehicles/Wheeled/BTR70/BTR70.et",
      },
      vehicleLabels: {
        UAZ469_MEI: "UAZ-469",
        UAZ469_PKM_MEI: "UAZ-469 PKM",
        Ural4320_transport_covered_MEI: "Ural-4320 Truck (covered)",
        BRDM2: "BRDM-2",
        BTR70: "BTR-70",
      },
      patrolVehicleKeys: ["UAZ469_PKM_MEI", "BRDM2", "BTR70"],
      transportVehicleKeys: ["UAZ469_MEI", "Ural4320_transport_covered_MEI"],
      // Mounted patrols fill vehicles with the PREFAB's default occupants —
      // vanilla USSR crew for BRDM2/BTR70 AND for UAZ469_PKM_MEI (it inherits
      // the vanilla UAZ's occupant slots). Force insurgent crews instead;
      // the Randomized prefab varies the outfit per seat.
      // CONCRETE characters only — Character_MEI_Randomized is an editor
      // variant-table wrapper over an unarmed CIV base; outside the GM editor
      // pipeline (FillCompartments spawns directly) it spawns the base:
      // unarmed identical civilians (bug found 2026-07-31)
      patrolCrew: [
        "{F95AEA26749B12EC}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman1.et",
        "{950EDEC6C85F9DC2}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman2.et",
        "{7092923FC4BA0AA9}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman3.et",
        "{4DA6B707B1D6839E}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman4.et",
        "{A83AFBFEBD3314F5}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman5.et",
      ],
      // Vanilla USSR pools (insurgents captured Soviet positions — user call)
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
      // Slot counts from m_aUnitPrefabSlots (1.3.1); classes count-driven per
      // the 1.8 rules: small = 2, medium = 3-5, large = 6+.
      defaultGroupSet: "Insurgents",
      groupSets: {
        Insurgents: {
          label: "Insurgents",
          sentry: `{9BB41B28EB97A926}${P_MEI_G}/Group_MEI_SentryTeam.et`,
          defense: { ref: `{C289D03E4F13A740}${P_MEI_G}/Group_MEI_RifleSquad.et`, size: 7 },
          small: [
            `{015F1AAC16472DD2}${P_MEI_G}/Group_MEI_MachineGunTeam.et`,
            `{9BB41B28EB97A926}${P_MEI_G}/Group_MEI_SentryTeam.et`,
            `{D4E0EF34D4BC6BDB}${P_MEI_G}/Group_MEI_ReconTeam.et`,
            `{702A22210F060E93}${P_MEI_G}/Group_MEI_SniperTeam.et`,
            `{5C6AFE7AA57EB290}${P_MEI_G}/Group_MEI_SharpshooterTeam.et`,
            `{2419190B7861CBD9}${P_MEI_G}/Group_MEI_MedicalSection.et`,
            `{04ED87FFCC68373D}${P_MEI_G}/Group_MEI_SapperTeam.et`,
          ],
          medium: [
            `{DFC9AD6C43E608A7}${P_MEI_G}/Group_MEI_LightFireTeam.et`,
            `{BDBE43FE17B323D7}${P_MEI_G}/Group_MEI_FireTeam.et`,
            `{E30B7B9AC1E82157}${P_MEI_G}/Group_MEI_PlatoonHQ.et`,
            `{094294F8A8B4357E}${P_MEI_G}/Group_MEI_AmmoTeam.et`,
            `{4AAF649CEA888EC6}${P_MEI_G}/Group_MEI_Team_AT.et`,
            `{081D451BF3C817D0}${P_MEI_G}/Group_MEI_Team_GL.et`,
            `{E4160FF3ED018519}${P_MEI_G}/Group_MEI_Team_LAT.et`,
            `{2F91C1FC6ADAB3D9}${P_MEI_G}/Group_MEI_Team_Suppress.et`,
          ],
          large: [`{C289D03E4F13A740}${P_MEI_G}/Group_MEI_RifleSquad.et`],
        },
      },
    },
  },
};
