// CLI wrapper: builds the TS_WebSpike test mission via lib.mjs and writes it
// into the Workbench addons directory.
//
// Usage: node generate.mjs [--clean] [--rhs] [--armenhof]
//   --clean     only when Workbench is NOT running: it wipes the addon dir
//               including EnfusionMCP handler scripts
//   --rhs       build the RHS variant instead (TS_WebSpikeRHS: RHS_USAF vs
//               RHS_AFRF, exercises mod deps + FactionManager conf-ref entries)
//   --uk        build the British Forces variant (TS_WebSpikeUK: UK "1989
//               Regulars" vs vanilla USSR — UK playable-side path)
//   --uk-enemy  build the British Forces enemy-side variant (TS_WebSpikeUKEnemy:
//               vanilla US vs UK — UK groups/fortifications/Land Rover patrols)
//   --mei       build the Middle East Insurgents variant (TS_WebSpikeMEI: US vs
//               MEI — the USSR alias faction, exercises alias emission + deps)
//   --afrf-mei  build the RHS-vs-MEI variant (TS_WebSpikeAFRFMEI: RHS_AFRF vs
//               MEI — validates the friendly-faction clearing override)
//   --armenhof  build the modded-terrain variant (TS_WebSpikeArmenhof: vanilla
//               US vs USSR on Armenhof, exercises terrain dependencies + nav refs)
//   --chernarus same, on ChernarusMinus (terrain with transitive map-addon deps)
//   --faircroft same, on Faircroft Islands (world codename BritMapProject)
//   --iraq      same, on Iraq 1990
//   --kunar     same, on Kunar Province
//   --ruha      same, on Ruha
//   --serhiivka same, on Serhiivka
//   --takistan  same, on Takistan
//   --zargabad  same, on Zargabad
//   --zarichne  same, on Zarichne

import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { buildMissionFiles, FACTIONS } from "./lib.mjs";

const ADDONS_ROOT = String.raw`C:\Users\djdav\Documents\My Games\ArmaReforgerWorkbench\addons`;

const MISSION = {
  addonId: "TSWebSpike",
  dirName: "TS_WebSpike",
  addonTitle: "TS Web Spike Mission",
  name: "TS_WebSpike",
  displayName: "TS Web Spike",
  author: "TS Web Tool",
  terrain: "arland",
  playableFaction: "US",
  playableSubfaction: "US_Army",
  enemyFaction: "USSR",
  enemyGroupSets: ["USSR_Army"],
  loadouts: FACTIONS.US.loadoutSets.US_Army.filter((l) =>
    ["Rifleman", "Automatic Rifleman", "Grenadier", "Medic", "FTL", "SL", "PL"].includes(l.name)
  ),
  // Stable resource GUIDs so re-runs don't churn refs while Workbench is open
  guids: {
    addon: "6A490698D6C9AC86",
    world: "6A490698C0582E49",
    missionConf: "6A49069854A9547B",
  },
  briefing: {
    situation: [
      "Soviet forces have established a foothold on eastern Arland.",
      "",
      "Friendly forces are staging at the FARP north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
    objectives: [
      "1. Clear the enemy presence in the objective area.",
      "2. Neutralize mounted patrols operating on the roads south of the AO.",
    ],
    threats: [
      "- Up to two squads of garrisoned infantry",
      "- Foot patrols in the objective area",
      "- BRDM-2 mounted patrol on the southern roads",
    ],
    extra: [
      {
        title: "Support",
        text: ["- 2x M151A2 Jeep", "- 1x M923A1 Transport Truck"],
      },
    ],
  },
  spawn: {
    pos: "1351.898 37.189 2399.095",
    yaw: 51,
    farp: true,
    vehicles: [
      { type: "M151A2_transport" },
      { type: "M151A2_transport" },
      { type: "M923A1_transport_covered" },
    ],
  },
  // Artillery support (smoke 30 = prefab default → omitted; illum 0 = removed)
  arty: { he: 40, smoke: 30, illum: 0 },
  zones: [
    {
      name: "Area1",
      pos: "2795.307 74.075 1628.664",
      radius: 200,
      plugins: [
        { type: "DefenseGroup" },
        { type: "TS_ScenarioFrameworkPluginAIPatrol", attrs: { m_iBudget: 2 } },
        { type: "TS_ScenarioFrameworkPluginSmartGarrison", attrs: { m_iBudget: 2 } },
        { type: "TS_ScenarioFrameworkPluginFortification", attrs: { m_iBudget: 2 } },
      ],
    },
    {
      name: "Area2",
      pos: "2600 70 1750",
      radius: 400,
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["BRDM2"] },
      ],
    },
  ],
  markers: [
    // military: non-default faction+type → both written; text carried on base
    { kind: "military", pos: [2795.3, 74.1, 1628.7], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    // military all-defaults (BLUFOR infantry): empty type block, all omitted
    { kind: "military", pos: [1400, 38, 2450], text: "", faction: "BLUFOR", type: "INFANTRY" },
    // custom with icon/color/rotation/text
    { kind: "custom", pos: [2600, 70, 1750], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
    // custom all-defaults except text
    { kind: "custom", pos: [2000, 50, 2000], text: "OBJ", icon: "CIRCLE", color: "WHITE", rotation: 0 },
  ],
  sectors: [
    // AO: prefab defaults — must emit NO component block, no angles (yaw 0)
    { kind: "ao", pos: [2600, 70, 1700], length: 1400, width: 1000, rotation: 0 },
    // objective: red component override + rotation (angles 0 30 0)
    { kind: "objective", pos: [2795.3, 74.1, 1628.7], length: 300, width: 200, rotation: 30 },
  ],
};

// RHS spike variant: same layout/zones, RHS factions + RHS content overrides.
// Separate dirName + stable GUIDs so both spikes can coexist in Workbench.
const RHS_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeRHS",
  dirName: "TS_WebSpikeRHS",
  addonTitle: "TS Web Spike RHS Mission",
  name: "TS_WebSpikeRHS",
  displayName: "TS Web Spike RHS",
  playableFaction: "RHS_USAF",
  playableSubfaction: "USMC_MEF",
  enemyFaction: "RHS_AFRF",
  enemyGroupSets: ["MSV_Flora"],
  loadouts: FACTIONS.RHS_USAF.loadoutSets.USMC_MEF.filter((l) =>
    ["Rifleman", "Automatic Rifleman", "Grenadier", "Medic", "FTL", "SL"].includes(l.name)
  ),
  guids: {
    addon: "6A4F669A0BB59F81",
    world: "6A4F669A51C2D7E3",
    missionConf: "6A4F669A3E88B1A4",
  },
  spawn: {
    ...MISSION.spawn,
    vehicles: [
      { type: "M151A2_transport" },
      { type: "M151A2_transport" },
      { type: "M923A1_transport_covered" },
    ],
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["UAZ469_PKM"] },
      ],
    },
  ],
};

// British Forces spike: UK playable vs vanilla USSR — exercises the UK
// FactionManager member override, UK spawn point, loadout/arsenal/crate
// overrides and the BF-only dependency list (no Truck Utility).
const UK_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeUK",
  dirName: "TS_WebSpikeUK",
  addonTitle: "TS Web Spike UK Mission",
  name: "TS_WebSpikeUK",
  displayName: "TS Web Spike UK",
  playableFaction: "UK",
  playableSubfaction: "1989 Regulars",
  enemyFaction: "USSR",
  enemyGroupSets: ["USSR_Army"],
  loadouts: FACTIONS.UK.loadoutSets["1989 Regulars"].filter((l) =>
    ["Rifleman", "LSW Gunner", "GPMG Gunner", "Medic", "Section Commander", "Section 2IC"].includes(l.name)
  ),
  guids: {
    addon: "985BCD7B10BCEB66",
    world: "D48FEE1675182286",
    missionConf: "B6EC273B7493D83D",
  },
  briefing: {
    ...MISSION.briefing,
    extra: [
      {
        title: "Support",
        text: ["- 2x Land Rover LWB", "- 1x M923A1 Transport Truck"],
      },
    ],
  },
  spawn: {
    ...MISSION.spawn,
    vehicles: [
      { type: "LR3_LWB_transport" },
      { type: "LR3_LWB_transport" },
      { type: "M923A1_transport_covered_UK" },
    ],
  },
};

// British Forces enemy-side spike: vanilla US vs UK — exercises UK group
// pools (defense/sentry/garrison/patrols), UK fortification compositions and
// Land Rover mounted patrols.
const UK_ENEMY_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeUKEnemy",
  dirName: "TS_WebSpikeUKEnemy",
  addonTitle: "TS Web Spike UK Enemy Mission",
  name: "TS_WebSpikeUKEnemy",
  displayName: "TS Web Spike UK Enemy",
  enemyFaction: "UK",
  enemyGroupSets: ["Regulars_1989"],
  guids: {
    addon: "B8A45354C1D8A35B",
    world: "06E249959350A16D",
    missionConf: "6FD8C1E2CEB9F9FD",
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["LR3_SWB_GPMG"] },
      ],
    },
  ],
};

// Middle East Insurgents spike: vanilla US vs the MEI alias faction — the
// mission content is identical to the vanilla spike's USSR enemy (alias
// factions reuse all vanilla USSR refs); only the deps differ (USSR 2 Middle
// East addon, whose own gproj pulls MiddleEastInsurgents + RussiantoArabic
// transitively). In-game the USSR troops appear as insurgents with Arabic voices.
const MEI_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeMEI",
  dirName: "TS_WebSpikeMEI",
  addonTitle: "TS Web Spike MEI Mission",
  name: "TS_WebSpikeMEI",
  displayName: "TS Web Spike MEI",
  enemyFaction: "MEI",
  enemyGroupSets: ["Insurgents"],
  guids: {
    addon: "DAE3044250CCAAD6",
    world: "57022A61BE10B225",
    missionConf: "EAC58DE935E71F85",
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["UAZ469_PKM_MEI"] },
      ],
    },
  ],
};

// RHS-vs-MEI spike: playable RHS_AFRF vs the MEI alias faction — validates the
// m_aFriendlyFactionsIds clearing override (RHS_RF_MSV.conf declares USSR
// friendly; MEI IS the in-game USSR, so without the override neither side
// would fight). The AFRF member in default.layer must carry an empty
// m_aFriendlyFactionsIds block.
const AFRF_MEI_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeAFRFMEI",
  dirName: "TS_WebSpikeAFRFMEI",
  addonTitle: "TS Web Spike AFRF vs MEI Mission",
  name: "TS_WebSpikeAFRFMEI",
  displayName: "TS Web Spike AFRF vs MEI",
  playableFaction: "RHS_AFRF",
  playableSubfaction: "MSV_Flora",
  enemyFaction: "MEI",
  enemyGroupSets: ["Insurgents"],
  loadouts: FACTIONS.RHS_AFRF.loadoutSets.MSV_Flora.slice(0, 6),
  guids: {
    addon: "B9E81D78B9C6F4D6",
    world: "7DE526B3DBB6BD09",
    missionConf: "952EBE836AF2E99F",
  },
  spawn: {
    ...MISSION.spawn,
    vehicles: [
      { type: "UAZ469_Camo_uncovered" },
      { type: "UAZ469_Camo_uncovered" },
      { type: "Ural4320_transport_covered" },
    ],
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["BRDM2"] },
      ],
    },
  ],
};

// Armenhof spike: vanilla factions on a modded terrain — proves a mission
// picks up the MAP addon dependency with no faction mods in play. Coords
// sampled from the ops-planner heightmap (validated against the GM world's
// AIWorld elevation).
const ARMENHOF_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeArmenhof",
  dirName: "TS_WebSpikeArmenhof",
  addonTitle: "TS Web Spike Armenhof Mission",
  name: "TS_WebSpikeArmenhof",
  displayName: "TS Web Spike Armenhof",
  terrain: "armenhof",
  guids: {
    addon: "6A85C1A05B3D9E42",
    world: "6A85C1A0C7F41D88",
    missionConf: "6A85C1A09A2E6B57",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces have breached the inner German border and are advancing on Fulda through the Armenhof countryside.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "1200 335.91 2600",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "2400 361.28 1400",
    },
    {
      ...MISSION.zones[1],
      pos: "2200 365.69 1550",
    },
  ],
  markers: [
    { kind: "military", pos: [2400, 361.3, 1400], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [1250, 336.5, 2550], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [2200, 365.7, 1550], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [2300, 364, 1500], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [2400, 361.3, 1400], length: 300, width: 200, rotation: 30 },
  ],
};

// Chernarus spike: second modded terrain — the map addon has its own deps
// (building/rail/outside-terrain packs) that must resolve transitively from
// just the map GUID. Coords sampled from the heightmap around the GM world's
// validated AIWorld position (hills north of the coast).
const CHERNARUS_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeChernarus",
  dirName: "TS_WebSpikeChernarus",
  addonTitle: "TS Web Spike Chernarus Mission",
  name: "TS_WebSpikeChernarus",
  displayName: "TS Web Spike Chernarus",
  terrain: "chernarus",
  guids: {
    addon: "6A86D2B14C7E8F53",
    world: "6A86D2B1A93B6E17",
    missionConf: "6A86D2B1D45C9A28",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces are consolidating in the hills of central Chernarus.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "7000 318.53 10800",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "7900 400.66 9900",
    },
    {
      ...MISSION.zones[1],
      pos: "8000 425.13 9800",
    },
  ],
  markers: [
    { kind: "military", pos: [7900, 400.7, 9900], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [7050, 310.6, 10850], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [8000, 425.1, 9800], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [7950, 412, 9850], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [7900, 400.7, 9900], length: 300, width: 200, rotation: 30 },
  ],
};

// Faircroft spike: island terrain — coords sampled from the heightmap on the
// central landmass (the map is mostly water; GM-world managers sit at Y=0 so
// there was no AIWorld elevation cross-check on this one).
const FAIRCROFT_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeFaircroft",
  dirName: "TS_WebSpikeFaircroft",
  addonTitle: "TS Web Spike Faircroft Mission",
  name: "TS_WebSpikeFaircroft",
  displayName: "TS Web Spike Faircroft",
  terrain: "faircroft",
  guids: {
    addon: "6A87E3C27D5A9B64",
    world: "6A87E3C2B84C7F29",
    missionConf: "6A87E3C2E96D8A35",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces have seized the central island of the Faircroft archipelago.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "6200 61.9 4800",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "7200 57.2 4300",
    },
    {
      ...MISSION.zones[1],
      pos: "7000 42 4200",
    },
  ],
  markers: [
    { kind: "military", pos: [7200, 57.2, 4300], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [6300, 60, 4900], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [7000, 42, 4200], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [7100, 50, 4250], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [7200, 57.2, 4300], length: 300, width: 200, rotation: 30 },
  ],
};

// Iraq 1990 spike: desert terrain, coords sampled from the heightmap
// (AIWorld cross-check matched: sampled 42.16 vs placed 42.156).
const IRAQ_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeIraq",
  dirName: "TS_WebSpikeIraq",
  addonTitle: "TS Web Spike Iraq Mission",
  name: "TS_WebSpikeIraq",
  displayName: "TS Web Spike Iraq",
  terrain: "iraq1990",
  guids: {
    addon: "6A88F4D38E6B7C75",
    world: "6A88F4D3C95D8E31",
    missionConf: "6A88F4D3FA7E9B46",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet-backed forces hold the high desert west of the wadi.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "1000 125.6 2600",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "2200 90.1 1500",
    },
    {
      ...MISSION.zones[1],
      pos: "2000 88.9 1400",
    },
  ],
  markers: [
    { kind: "military", pos: [2200, 90.1, 1500], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [1050, 104.8, 2550], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [2000, 88.9, 1400], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [2100, 95.8, 1450], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [2200, 90.1, 1500], length: 300, width: 200, rotation: 30 },
  ],
};

// Kunar spike: mountain terrain — spawn on a terrace above the northern river
// valley, zones on the valley floor (no AIWorld elevation cross-check: the
// map's managers sit at placeholder Y=10).
const KUNAR_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeKunar",
  dirName: "TS_WebSpikeKunar",
  addonTitle: "TS Web Spike Kunar Mission",
  name: "TS_WebSpikeKunar",
  displayName: "TS Web Spike Kunar",
  terrain: "kunar",
  guids: {
    addon: "6A89A5E49F7C8D86",
    world: "6A89A5E4DA6E9F42",
    missionConf: "6A89A5E40B8FAC57",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces control the villages along the Kunar river valley.",
      "",
      "Friendly forces are staging on the terrace north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "1700 85.7 3400",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "2200 19.8 3100",
    },
    {
      ...MISSION.zones[1],
      pos: "2400 21.4 3000",
    },
  ],
  markers: [
    { kind: "military", pos: [2200, 19.8, 3100], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [1650, 59.7, 3450], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [2400, 21.4, 3000], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [2300, 23, 3050], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [2200, 19.8, 3100], length: 300, width: 200, rotation: 30 },
  ],
};

// Ruha spike: rolling Finnish terrain, coords sampled from the heightmap
// (AIWorld cross-check matched: sampled 58.38 vs placed 58.374).
const RUHA_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeRuha",
  dirName: "TS_WebSpikeRuha",
  addonTitle: "TS Web Spike Ruha Mission",
  name: "TS_WebSpikeRuha",
  displayName: "TS Web Spike Ruha",
  terrain: "ruha",
  guids: {
    addon: "6A8AB6F5A08D9E97",
    world: "6A8AB6F5EB7FA053",
    missionConf: "6A8AB6F51C90BD68",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces have dug into the forests east of the Ruha farmlands.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "2400 58.5 5600",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "3400 59.7 4700",
    },
    {
      ...MISSION.zones[1],
      pos: "3200 59.3 4600",
    },
  ],
  markers: [
    { kind: "military", pos: [3400, 59.7, 4700], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [2450, 51.3, 5550], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [3200, 59.3, 4600], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [3300, 59.4, 4650], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [3400, 59.7, 4700], length: 300, width: 200, rotation: 30 },
  ],
};

// Serhiivka spike: Ukrainian steppe terrain — heightmap validated against the
// map's terrain-fitted gas-station buildings (149.16 sampled vs 149.156
// placed; its AIWorld manager Y is arbitrary, don't cross-check against it).
const SERHIIVKA_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeSerhiivka",
  dirName: "TS_WebSpikeSerhiivka",
  addonTitle: "TS Web Spike Serhiivka Mission",
  name: "TS_WebSpikeSerhiivka",
  displayName: "TS Web Spike Serhiivka",
  terrain: "serhiivka",
  guids: {
    addon: "6A8BC7A6B19EAFA8",
    world: "6A8BC7A6FC80B164",
    missionConf: "6A8BC7A62DA1CE79",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces hold the fields and treelines south-east of the Serhiivka farmsteads.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "3000 142.4 6000",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "4000 128.3 5000",
    },
    {
      ...MISSION.zones[1],
      pos: "3800 139.7 4900",
    },
  ],
  markers: [
    { kind: "military", pos: [4000, 128.3, 5000], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [3050, 143.2, 5950], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [3800, 139.7, 4900], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [3900, 135.1, 4950], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [4000, 128.3, 5000], length: 300, width: 200, rotation: 30 },
  ],
};

// Takistan spike: mountain desert — spike sits in the northern valley
// (heightmap validated against terrain-fitted houses, e.g. 294.31 sampled vs
// 294.29 placed; the GM layer's managers all sit at origin).
const TAKISTAN_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeTakistan",
  dirName: "TS_WebSpikeTakistan",
  addonTitle: "TS Web Spike Takistan Mission",
  name: "TS_WebSpikeTakistan",
  displayName: "TS Web Spike Takistan",
  terrain: "takistan",
  guids: {
    addon: "6A8CD8B7C2AFC0B9",
    world: "6A8CD8B70D91C275",
    missionConf: "6A8CD8B73EB2DF8A",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet-backed forces hold the villages on the valley floor north of the Takistani highlands.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "3900 99.4 11000",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "5200 135.3 10400",
    },
    {
      ...MISSION.zones[1],
      pos: "5000 130.8 10300",
    },
  ],
  markers: [
    { kind: "military", pos: [5200, 135.3, 10400], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [3950, 96.6, 10950], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [5000, 130.8, 10300], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [5100, 131, 10350], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [5200, 135.3, 10400], length: 300, width: 200, rotation: 30 },
  ],
};

// Zargabad spike: city plain — heightmap validated against a terrain-fitted
// content entity (17.28 sampled vs 17.347 placed).
const ZARGABAD_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeZargabad",
  dirName: "TS_WebSpikeZargabad",
  addonTitle: "TS Web Spike Zargabad Mission",
  name: "TS_WebSpikeZargabad",
  displayName: "TS Web Spike Zargabad",
  terrain: "zargabad",
  guids: {
    addon: "6A8DE9C8D3B0D1CA",
    world: "6A8DE9C81EA2D386",
    missionConf: "6A8DE9C84FC3F09B",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet-backed forces occupy the orchards and compounds south-east of Zargabad.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "3200 19.4 4800",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "4200 16.8 3800",
    },
    {
      ...MISSION.zones[1],
      pos: "4000 21.7 3700",
    },
  ],
  markers: [
    { kind: "military", pos: [4200, 16.8, 3800], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [3250, 18.8, 4750], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [4000, 21.7, 3700], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [4100, 18.2, 3750], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [4200, 16.8, 3800], length: 300, width: 200, rotation: 30 },
  ],
};

// Zarichne spike: river lowland — heightmap validated against 7 terrain-fitted
// buildings (5 within ~1 m, one exact; outliers were river-bank bluffs).
// Parent world ships its own PerceptionManager (parentHasPerceptionManager).
const ZARICHNE_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeZarichne",
  dirName: "TS_WebSpikeZarichne",
  addonTitle: "TS Web Spike Zarichne Mission",
  name: "TS_WebSpikeZarichne",
  displayName: "TS Web Spike Zarichne",
  terrain: "zarichne",
  guids: {
    addon: "6A8EFAD9E4C1E2DB",
    world: "6A8EFAD92FB3F497",
    missionConf: "6A8EFAD960D401AC",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces hold the fields east of the Zarichne river crossings.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "2800 22.6 3700",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "3600 25.3 3150",
    },
    {
      ...MISSION.zones[1],
      pos: "3400 24.3 3050",
    },
  ],
  markers: [
    { kind: "military", pos: [3600, 25.3, 3150], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [2850, 20.3, 3650], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [3400, 24.3, 3050], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [3500, 24.6, 3100], length: 1000, width: 800, rotation: 0 },
    { kind: "objective", pos: [3600, 25.3, 3150], length: 300, width: 200, rotation: 30 },
  ],
};

const BUILT = process.argv.includes("--zarichne")
  ? ZARICHNE_MISSION
  : process.argv.includes("--zargabad")
  ? ZARGABAD_MISSION
  : process.argv.includes("--takistan")
  ? TAKISTAN_MISSION
  : process.argv.includes("--serhiivka")
  ? SERHIIVKA_MISSION
  : process.argv.includes("--ruha")
  ? RUHA_MISSION
  : process.argv.includes("--kunar")
  ? KUNAR_MISSION
  : process.argv.includes("--iraq")
  ? IRAQ_MISSION
  : process.argv.includes("--faircroft")
  ? FAIRCROFT_MISSION
  : process.argv.includes("--chernarus")
    ? CHERNARUS_MISSION
    : process.argv.includes("--armenhof")
      ? ARMENHOF_MISSION
      : process.argv.includes("--rhs")
        ? RHS_MISSION
        : process.argv.includes("--uk-enemy")
          ? UK_ENEMY_MISSION
          : process.argv.includes("--uk")
            ? UK_MISSION
            : process.argv.includes("--afrf-mei")
              ? AFRF_MEI_MISSION
              : process.argv.includes("--mei")
                ? MEI_MISSION
                : MISSION;
const { files, addonDirName } = buildMissionFiles(BUILT);
const addonDir = join(ADDONS_ROOT, addonDirName);

if (process.argv.includes("--clean") && existsSync(addonDir)) {
  rmSync(addonDir, { recursive: true });
  console.log("cleaned", addonDir);
}

for (const [rel, content] of Object.entries(files)) {
  const abs = join(addonDir, ...rel.split("/"));
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, content, { encoding: "utf8" });
  console.log("wrote", rel, `(${content.length} bytes)`);
}

console.log(`\nDone -> ${addonDir}`);
console.log(`Mission: ${BUILT.displayName} | ${BUILT.terrain} | ${BUILT.playableFaction} vs ${BUILT.enemyFaction}`);
