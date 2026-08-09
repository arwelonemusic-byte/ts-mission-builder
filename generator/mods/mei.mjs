// Middle East Insurgents — REAL faction from the "MiddleEastInsurgents" mod,
// voiced Arabic via the "Czech to Arabic" chain.
//
// Dependency anchor: Czech to Arabic (68DC13E97BF267BD) — its own .gproj pulls
// MiddleEastInsurgents (64CEC8E005828E5D) + RussiantoArabic (65E0AE1A83DA063A)
// transitively. CzechtoArabic itself is voice/cosmetic-only (67 files: audio +
// Arabic-styled USSR sign retextures, no configs — verified 2026-07-29).
//
// Why this chain (v2, replacing the earlier "USSR 2 Middle East" alias
// integration): MiddleEastInsurgents defines MEI as a REAL faction (FactionKey
// "MEI", INDFOR-based, own flag/callsigns/radio 52000, friendly only to
// CIV+MEC) and OVERRIDES the vanilla FactionManager_Editor.et (same root ID
// 56B2B4776E6E4499), appending MEI as member {64E5479B63D9AEFF} (+ a MEC
// civilian-militia member {64E51887ABD12B07} we leave untouched) — the
// validated RHS entryGuid path. A real faction means USSR-vs-MEI works, no
// reskin-coverage caveats, and no alias machinery. Plain "MiddleEastInsurgents"
// alone would leave the insurgents speaking Czech (they inherit FIA voices).
//
// All GUIDs ground-truthed from the extraction
// (D:\VSCode_dev\arma-reforger\reference\MiddleEastInsurgents):
//   - faction member:  Prefabs/MP/Managers/Factions/FactionManager_Editor.et
//   - groups:          Configs/EntityCatalog/FIA/Groups_EntityCatalog_MEI.conf
//   - callsigns:       Configs/Callsigns/Callsigns_MEI.conf (4 squads "1"-"4")
// MEI ships no vehicle catalog of its own (MEI.conf points at the vanilla FIA
// vehicle catalog) and no spawn points — vehicles/spawn refs below are the
// vanilla FIA ones; fortifications reuse the vanilla USSR pools (user call).
// Enemy-only by design (riflemen/loadoutSets empty). Group prefabs
// Team_GL/Team_LAT/Team_Suppress exist on disk but are NOT in the catalog
// (no trustworthy GUIDs) — excluded.
const P_MEI_G = "Prefabs/Groups/MEI";
const P_SLOT = "Prefabs/Compositions/Slotted";

export const MEI = {
  id: "mei",
  label: "Middle East Insurgents",
  workshopUrl: "https://reforger.armaplatform.com/workshop/68DC13E97BF267BD-CzechtoArabic",
  dependencies: ["68DC13E97BF267BD"],
  factions: {
    MEI: {
      label: "Middle East Insurgents",
      entryGuid: "{64E5479B63D9AEFF}",
      // m_CallsignInfo instance in MEI.conf, members from Callsigns_MEI.conf
      callsignGuid: "{60A6B21E18F28741}",
      squadBase: ["{64D896904E7CCB74}", "{64D896904E7CCB45}", "{64D896904E7CCB44}", "{64D896904E7CCB47}"],
      squadFifth: null,
      // MEI.conf declares CIV + MEC friendly — neither can be a mission side,
      // so no clearing ever triggers; recorded for completeness
      friendlyWith: ["CIV", "MEC"],
      spawnPoint: "{72713ED566A531F3}PrefabsEditable/SpawnPoints/E_SpawnPoint_FIA.et",
      // HVT for Eliminate-HVT objectives
      hvt: "{58B923E15109E91A}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Leader.et",
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
        "{76B11940F6EDF623}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman1.et",
        "{EB364CCCBCFD29A5}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman2.et",
        "{0EAA0035B018BECE}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman3.et",
        "{339E250DC57437F9}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman4.et",
        "{D60269F4C991A092}Prefabs/Characters/Factions/IND/MEI/Character_MEI_Rifleman5.et",
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
      // Slot counts from m_aUnitPrefabSlots; classes per the project size rules.
      defaultGroupSet: "Insurgents",
      groupSets: {
        Insurgents: {
          label: "Insurgents",
          sentry: `{92A836D86D75707B}${P_MEI_G}/Group_MEI_SentryTeam.et`,
          defense: { ref: `{329BC4FEFAE79CAF}${P_MEI_G}/Group_MEI_RifleSquad.et`, size: 8 },
          small: [
            `{1CC538C6B0DE68D5}${P_MEI_G}/Group_MEI_MachineGunTeam.et`,
            `{92A836D86D75707B}${P_MEI_G}/Group_MEI_SentryTeam.et`,
            `{172965BB188FCB8F}${P_MEI_G}/Group_MEI_ReconTeam.et`,
            `{42A0E2DD1E8F9779}${P_MEI_G}/Group_MEI_SniperTeam.et`,
            `{15BD9D7E0910185F}${P_MEI_G}/Group_MEI_MedicalSection.et`,
            `{4E9F762B4C0DD5ED}${P_MEI_G}/Group_MEI_SapperTeam.et`,
            `{613836A938A01319}${P_MEI_G}/Group_MEI_AmmoTeam.et`,
            `{F0982B2402D1BE70}${P_MEI_G}/Group_MEI_Team_AT.et`,
          ],
          medium: [
            `{43A262F8A24DF461}${P_MEI_G}/Group_MEI_LightFireTeam.et`,
            `{9036410306683271}${P_MEI_G}/Group_MEI_FireTeam.et`,
            `{4B5FEBA696C827D4}${P_MEI_G}/Group_MEI_PlatoonHQ.et`,
          ],
          large: [`{329BC4FEFAE79CAF}${P_MEI_G}/Group_MEI_RifleSquad.et`],
        },
      },
    },
  },
};
