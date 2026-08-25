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
//   --bandits   build the Bandit Faction variant (TS_WebSpikeBandits: US vs
//               PLASTICBANDIT — enemy-only, FactionManager_Base append pattern)
//   --afrf-mei  build the RHS-vs-MEI variant (TS_WebSpikeAFRFMEI: RHS_AFRF vs
//               MEI — validates the friendly-faction clearing override)
//   --sfs       build the SFS loadout-pack variant (TS_WebSpikeSFS: SFS_US
//               "US Special Force Squad (Abrashka)" vs USSR — playable alias)
//   --sfs-enemy build the SFS enemy-side variant (TS_WebSpikeSFSEnemy: vanilla
//               USSR vs SFS_US — SFS group pools/SL hvt/SF crews on US vehicles)
//   --sfs-rf-fia build the RF+FIA SFS packs variant (TS_WebSpikeSFSRFFIA:
//               SFS_USSR playable vs SFS_FIA enemy — both new packs, both sides)
//   --a2        build the Arma II Factions variant (TS_WebSpikeA2: CDF playable
//               vs ChDKZ — exercises both new-faction sides + NAPA availability)
//   --arsenal   build the Arsenal Builder variant (TS_WebSpikeArsenal: US vs
//               USSR with a mission.arsenal override — pool-resolved modes)
//   --thumbs    build the thumbnail-harvest mock (TS_WebSpikeThumbs: ALL
//               vanilla pool items in the crate, pool order, variants forced
//               flat — screenshot the crate pages for the thumbnail slicer)
//   --thumbs-uk same for the British Forces pool (TS_WebSpikeThumbsUK)
//   --thumbs-rhs-afrf  same for the RHS AFRF pool slice (TS_WebSpikeThumbsAFRF)
//   --thumbs-rhs-ion   same for the RHS ION pool slice + 5 vanilla 1.8 additions (TS_WebSpikeThumbsION)
//   --thumbs-rhs-usaf  same for the RHS USAF pool slice (TS_WebSpikeThumbsUSAF)
//   --thumbs-sfs-us    SFS US pack: baked refs outside every pool (TS_WebSpikeThumbsSFSUS)
//   --thumbs-sfs-rf    SFS RF+FIA packs: same, both factions (TS_WebSpikeThumbsSFSRF)
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
//   --merak     same, on Merak Island
//   --mogadishu same, on Mogadishu
//   --alhadra   same, on Al Hadra

import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildMissionFiles, FACTIONS, ARSENAL_POOL, MOD_ARSENAL_POOLS, CORE_ARSENAL_ITEMS } from "./lib.mjs";

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
        // QRF reinforcements — origin coords reuse the toolkit template-world's
        // QRFAnchors positions (road-adjacent, validated for both plugins).
        // No `vehicles` on the mounted module: each spike variant's enemy
        // faction falls back to its own patrol-vehicle candidates.
        {
          type: "TS_ScenarioFrameworkPluginQRFFoot",
          attrs: { m_iBudget: 2 },
          origins: [
            [3136.656, 32.986, 1373.865],
            [2751.657, 25.438, 1281.013],
            [2582.144, 121.881, 2350.583],
          ],
        },
        {
          type: "TS_ScenarioFrameworkPluginQRFMounted",
          attrs: { m_iBudget: 1 },
          origins: [[3255.005, 29.811, 2023.903]],
        },
      ],
    },
    {
      name: "Area2",
      pos: "2600 70 1750",
      radius: 400,
      plugins: [
        // Mixed armed + unarmed pool — exercises the transportVehicleKeys path
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["BRDM2", "Ural4320_transport_covered"] },
      ],
    },
  ],
  markers: [
    // military: non-default faction+type → both written; text carried on base
    { kind: "military", pos: [2795.3, 74.07, 1628.7], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    // military all-defaults (BLUFOR infantry): empty type block, all omitted
    { kind: "military", pos: [1400, 38, 2450], text: "", faction: "BLUFOR", type: "INFANTRY" },
    // custom with icon/color/rotation/text
    { kind: "custom", pos: [2600, 70, 1750], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
    // custom all-defaults except text
    { kind: "custom", pos: [2000, 29.81, 2000], text: "OBJ", icon: "CIRCLE", color: "WHITE", rotation: 0 },
  ],
  sectors: [
    // AO: prefab defaults — must emit NO component block, no angles (yaw 0)
    { kind: "ao", pos: [2600, 70, 1700], length: 1400, width: 1000, rotation: 0 },
    // objective: red component override + rotation (angles 0 30 0)
    { kind: "objective", pos: [2795.3, 74.1, 1628.7], length: 300, width: 200, rotation: 30 },
  ],
  // Objectives: one of each MVP type. HVT inside Area1 (garrisoned zone), clear
  // area on Area1's center, reach point on the road south of the AO.
  objectives: [
    {
      type: "hvt",
      pos: [2820.5, 72.88, 1651.2],
      taskTitle: "Ликвидировать командира",
      taskDesc: "В районе цели замечен старший офицер противника. Найдите и ликвидируйте его.",
    },
    {
      type: "clear",
      pos: [2795.3, 74.07, 1628.7],
      radius: 200,
      taskTitle: "Зачистить лагерь",
      taskDesc: "Зачистите лагерь противника в указанном районе.",
    },
    {
      type: "reach",
      pos: [2000, 29.81, 2000],
      radius: 25,
      taskTitle: "Выйти к перекрестку",
      taskDesc: "Выйдите к перекрестку и осмотритесь.",
    },
    {
      type: "deliver",
      pos: [2836.2, 72.96, 1620.4],
      delivery: [1380.5, 36.3, 2378.9],
      deliveryRadius: 30,
      objectRef: "{259EE7B78C51B624}Prefabs/Vehicles/Wheeled/UAZ469/UAZ469.et",
      taskTitle: "Угнать УАЗ",
      taskDesc: "В лагере противника стоит УАЗ-469. Угоните его и доставьте на базу.",
    },
    {
      type: "destroy",
      pos: [2770.4, 75.97, 1610.9],
      objectRef: "{34AD2F398FDFE5B3}Prefabs/Props/Military/AmmoBoxes/EquipmentBoxStack/USSR/EquipmentBoxStack_USSR_01_V5.et",
      taskTitle: "Уничтожить склад боеприпасов",
      taskDesc: "В лагере противника складированы боеприпасы. Найдите и уничтожьте их.",
    },
    // Approach radars — exercise the fix-only (no spawnRef) emission path:
    // RPL-5 = _on-body replication, TPN-19 = from-scratch destruction
    {
      type: "destroy",
      pos: [2700.0, 70.13, 1570.0],
      objectRef: "{DED4DB7D08E6E0BE}Prefabs/Structures/Military/Radar/ApproachRadar_RPL5_01/ApproachRadar_RPL5_01.et",
      taskTitle: "Уничтожить радар РПЛ-5",
      taskDesc: "Подорвите посадочный радар противника. Потребуется взрывчатка.",
    },
    {
      type: "destroy",
      pos: [2660.0, 61.27, 1545.0],
      objectRef: "{A0190D51FD62FF68}Prefabs/Structures/Military/Radar/ApproachRadar_TPN19_01/ApproachRadar_TPN19_01.et",
      taskTitle: "Уничтожить радар ТПН-19",
      taskDesc: "Уничтожьте радар управления заходом на посадку.",
    },
  ],
  // Props: exercise every emission path — defended fortification (rotated,
  // AreaPropDef block with a small-window group), minefield module, wreck,
  // and a base-prefab (no E_ variant) entry. Positions along the road SW of
  // the AO.
  props: [
    // MG nest facing east (yaw 90), defended by a small-window group
    { ref: "{047B9C8AAB50CE0F}PrefabsEditable/Auto/Compositions/Slotted/SlotFlatSmall/E_MachineGunNest_S_USSR_01.et", pos: [2050, 31.2, 2040], rotation: 90, defense: { sizes: ["small"] } },
    // AT minefield on the road — minefield cat is not defense-capable, plain
    { ref: "{D3FDAE504F8621E8}PrefabsEditable/EffectsModules/Mine/EffectModule_MineField_Medium_US.et", pos: [1980, 29.5, 1985], rotation: 45, defense: null },
    // wreck, yaw 0 → no angles line
    { ref: "{82008EE10AB80D6E}PrefabsEditable/Auto/Props/Wrecks/E_UAZ469_wreck.et", pos: [2010, 30.1, 2010], rotation: 0, defense: null },
    // base prefab (no E_ mirror) — emits as-is, not GM-editable
    { ref: "{114DE81321786CD9}Prefabs/Compositions/Slotted/SlotFlatSmall/MachineGunNest_S_USSR_01_PKM.et", pos: [2100, 32.4, 2080], rotation: 270, defense: { sizes: ["medium", "large"] } },
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

// UK thumbnail-harvest mock: every ARSENAL_POOL_UK item in the crate, pool
// order, variants forced flat (see THUMBS_MISSION). US playable is fine — the
// crate contents are what matters; the UK deps arrive via the arsenal refs.
const THUMBS_UK_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeThumbsUK",
  dirName: "TS_WebSpikeThumbsUK",
  addonTitle: "TS Web Spike Thumbs UK Mission",
  name: "TS_WebSpikeThumbsUK",
  displayName: "TS Web Spike Thumbs UK",
  guids: {
    addon: "6A9D72E14B08C356",
    world: "6A9D72E1D93A7F82",
    missionConf: "6A9D72E1682E90B4",
  },
  arsenal: MOD_ARSENAL_POOLS.uk.map((i) => ({ ref: i.ref, mode: i.mode === "WEAPON_VARIANTS" ? "WEAPON" : i.mode })),
};

// RHS AFRF thumbnail-harvest mock (see THUMBS_MISSION): the whole AFRF pool
// slice in the crate; the faction filter keeps this stable when USAF/ION are
// appended to MOD_ARSENAL_POOLS.rhs later.
const THUMBS_RHS_AFRF_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeThumbsAFRF",
  dirName: "TS_WebSpikeThumbsAFRF",
  addonTitle: "TS Web Spike Thumbs AFRF Mission",
  name: "TS_WebSpikeThumbsAFRF",
  displayName: "TS Web Spike Thumbs AFRF",
  guids: {
    addon: "6A9E83F25C19D467",
    world: "6A9E83F2EA4B8093",
    missionConf: "6A9E83F2793FA1C5",
  },
  // Optional category slice (--cats=Clothing or --cats="Equipment,Other"):
  // chunked captures are small enough to audit reliably — the full-pool
  // capture drifted invisibly (2026-08-13). Category names = pool categories.
  arsenal: MOD_ARSENAL_POOLS.rhs
    .filter((i) => {
      if (!i.factions.includes("RHS_AFRF")) return false;
      const catsArg = process.argv.find((a) => a.startsWith("--cats="));
      if (!catsArg) return true;
      return catsArg.slice(7).split(",").map((s) => s.trim()).includes(i.category);
    })
    .map((i) => ({ ref: i.ref, mode: i.mode === "WEAPON_VARIANTS" ? "WEAPON" : i.mode })),
};

// RHS USAF thumbnail-harvest mock (see THUMBS_MISSION): the whole USAF pool
// slice, --cats slicing supported like AFRF/ION.
const THUMBS_RHS_USAF_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeThumbsUSAF",
  dirName: "TS_WebSpikeThumbsUSAF",
  addonTitle: "TS Web Spike Thumbs USAF Mission",
  name: "TS_WebSpikeThumbsUSAF",
  displayName: "TS Web Spike Thumbs USAF",
  guids: {
    addon: "6AA2C59E1F74B8D2",
    world: "6AA2C59E83D06A47",
    missionConf: "6AA2C59E47B92E15",
  },
  arsenal: MOD_ARSENAL_POOLS.rhs
    .filter((i) => {
      if (!i.factions.includes("RHS_USAF")) return false;
      const catsArg = process.argv.find((a) => a.startsWith("--cats="));
      if (!catsArg) return true;
      return catsArg.slice(7).split(",").map((s) => s.trim()).includes(i.category);
    })
    .map((i) => ({ ref: i.ref, mode: i.mode === "WEAPON_VARIANTS" ? "WEAPON" : i.mode })),
};

// RHS ION thumbnail-harvest mock (see THUMBS_MISSION): the whole ION pool
// slice (--cats slicing supported like AFRF) + 5 vanilla items appended at
// the END (clean ION ordinals for mapping): the 3 UGL smokes + 2 razor-wire
// parts that 1.8 added to the vanilla catalogs after the vanilla capture.
const THUMBS_ION_VANILLA_EXTRAS = [
  "Ammo_Grenade_Smoke_M713_Red",
  "Ammo_Grenade_Smoke_M715_Green",
  "Ammo_Grenade_Smoke_M716_Yellow",
  "BarbedTape_Stake",
  "Barbed_Tape",
];
const THUMBS_RHS_ION_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeThumbsION",
  dirName: "TS_WebSpikeThumbsION",
  addonTitle: "TS Web Spike Thumbs ION Mission",
  name: "TS_WebSpikeThumbsION",
  displayName: "TS Web Spike Thumbs ION",
  guids: {
    addon: "6AA10B47D2E85F19",
    world: "6AA10B473C96A2D5",
    missionConf: "6AA10B478E51C7B3",
  },
  arsenal: [
    ...MOD_ARSENAL_POOLS.rhs
      .filter((i) => {
        if (!i.factions.includes("RHS_ION")) return false;
        const catsArg = process.argv.find((a) => a.startsWith("--cats="));
        if (!catsArg) return true;
        return catsArg.slice(7).split(",").map((s) => s.trim()).includes(i.category);
      })
      .map((i) => ({ ref: i.ref, mode: i.mode === "WEAPON_VARIANTS" ? "WEAPON" : i.mode })),
    ...ARSENAL_POOL
      .filter((i) => THUMBS_ION_VANILLA_EXTRAS.includes(i.ref.split("/").pop().replace(".et", "")))
      .map((i) => ({ ref: i.ref, mode: i.mode === "WEAPON_VARIANTS" ? "WEAPON" : i.mode })),
  ],
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

// Arsenal Builder spike: exercises the mission.arsenal override path — baked US
// set minus its last entry, plus two ARSENAL_POOL-resolved additions (one with
// a mode token, one mode-less). NOT on the base MISSION: mod spikes spread
// ...MISSION and would inherit US refs into non-US missions.
const ARSENAL_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeArsenal",
  dirName: "TS_WebSpikeArsenal",
  addonTitle: "TS Web Spike Arsenal Mission",
  name: "TS_WebSpikeArsenal",
  displayName: "TS Web Spike Arsenal",
  guids: {
    addon: "6A9B3E1C7D42A051",
    world: "6A9B3E1C58F09B37",
    missionConf: "6A9B3E1C91C6E4D8",
  },
  arsenal: [
    ...FACTIONS.US.arsenalItems.slice(0, -1).map((i) => i.ref),
    "{3E413771E1834D2F}Prefabs/Weapons/Rifles/M16/Rifle_M16A2.et", // pool mode WEAPON
    "{C7861F11D5334C0E}Prefabs/Characters/Uniforms/Jacket_US_BDU.et", // pool mode "" (omitted)
    ...CORE_ARSENAL_ITEMS.map((i) => i.ref), // core pool (ACE epinephrine) resolves its own mode
  ],
};

// Positioned-spawn spike (individual spawn element placement, 2026-08-18):
// exercises the web's per-element input shape — 2 crates (one rotated), a
// rotated FARP off the anchor (own sampled Y), a moved+rotated vehicle, and
// the spawn point without angles.
const SPAWN_POS_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeSpawnPos",
  dirName: "TS_WebSpikeSpawnPos",
  addonTitle: "TS Web Spike SpawnPos Mission",
  name: "TS_WebSpikeSpawnPos",
  displayName: "TS Web Spike SpawnPos",
  guids: {
    addon: "6AA35D0E4B71C293",
    world: "6AA35D0E19E8A6F4",
    missionConf: "6AA35D0E7C30D815",
  },
  // Squads exercise the deny-name resolution: Cyrillic passes through raw,
  // 1"2 escapes to 1'2 (gname), and index 2 keeps its literal apostrophe.
  groups: [
    { name: "Гусыня-1", size: 9 },
    { name: '1"2', size: 9 },
    { name: "1'3", size: 3 },
  ],
  spawn: {
    pos: [1351.9, 37.189, 2399.1],
    farp: true,
    farpPos: [1339.5, 2410.5],
    farpRotation: 51,
    // Two spawn points -> $grp form; per-point deny lists by squad INDEX
    spawnPoints: [
      { pos: [1365.9, 2393.1], denied: [2] },
      { pos: [1389.9, 2393.1], denied: [0, 1] },
    ],
    crates: [
      { pos: [1365.9, 2399.1], rotation: 0 },
      { pos: [1368.9, 2399.1], rotation: 45 },
    ],
    vehicles: [
      { type: "M151A2_transport", pos: [1341.9, 2386.1], rotation: 180 },
      { type: "M923A1_transport_covered", pos: [1330.4, 2380.2], rotation: 135 },
    ],
  },
};

// Thumbnail-harvest mock mission: EVERY vanilla pool item in the arsenal crate,
// in exact ARSENAL_POOL order (= arsenal-pool.mjs line order — the slicing
// manifest). WEAPON_VARIANTS is forced to WEAPON so each prefab gets its OWN
// tile (variants otherwise fold into the base weapon's variant selector and
// never tile). Open the crate in-game, screenshot every page, feed the shots
// to the thumbnail slicer.
const THUMBS_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeThumbs",
  dirName: "TS_WebSpikeThumbs",
  addonTitle: "TS Web Spike Thumbs Mission",
  name: "TS_WebSpikeThumbs",
  displayName: "TS Web Spike Thumbs",
  guids: {
    addon: "6A9C51D08E2B7F43",
    world: "6A9C51D0A75C0E91",
    missionConf: "6A9C51D0C39F6A28",
  },
  arsenal: ARSENAL_POOL.map((i) => ({ ref: i.ref, mode: i.mode === "WEAPON_VARIANTS" ? "WEAPON" : i.mode })),
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

// Bandits spike: vanilla US vs the enemy-only PLASTICBANDIT faction —
// exercises the FactionManager_BASE-append pattern (member inherited into
// the Editor prefab), bandit group pools, the armed UAZ-452 patrol with
// forced bandit crew, and the transitive 3-addon dep chain.
const BANDITS_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeBandits",
  dirName: "TS_WebSpikeBandits",
  addonTitle: "TS Web Spike Bandits Mission",
  name: "TS_WebSpikeBandits",
  displayName: "TS Web Spike Bandits",
  enemyFaction: "PLASTICBANDIT",
  enemyGroupSets: ["Bandits"],
  guids: {
    addon: "99A9AB6EEFD0528D",
    world: "84C01751F17AEA08",
    missionConf: "56BD263DA36A47DD",
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

// SFS spike: the Abrashka loadout pack as playable "faction" vs vanilla USSR
// — first PLAYABLE use of the alias machinery (SFS_US resolves to US in every
// serialized faction key; US member gets the playable/callsign block; deps =
// the SFS addon whose gproj pulls GRS/Milsim/RHS transitively).
const SFS_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeSFS",
  dirName: "TS_WebSpikeSFS",
  addonTitle: "TS Web Spike SFS Mission",
  name: "TS_WebSpikeSFS",
  displayName: "TS Web Spike SFS",
  playableFaction: "SFS_US",
  playableSubfaction: "Special Force Squad",
  loadouts: FACTIONS.SFS_US.loadoutSets["Special Force Squad"].filter((l) =>
    ["Rifleman", "Grenadier", "Machine Gunner", "Medic", "SL", "Sniper"].includes(l.name)
  ),
  guids: {
    addon: "7C41D9A2E85B3F10",
    world: "3AF8B2C7D1946E5C",
    missionConf: "9E27C4B8A6D1F3E4",
  },
};

// SFS enemy-side spike: vanilla USSR vs SFS_US — exercises the SFS group
// pools (defense/sentry/garrison/patrols/QRF), the SL hvt-capable enemy,
// SFS patrolCrew in inherited US patrol vehicles, and the alias enemy path
// (every serialized enemy key resolves to "US"; deps = the SFS anchor).
const SFS_ENEMY_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeSFSEnemy",
  dirName: "TS_WebSpikeSFSEnemy",
  addonTitle: "TS Web Spike SFS Enemy Mission",
  name: "TS_WebSpikeSFSEnemy",
  displayName: "TS Web Spike SFS Enemy",
  playableFaction: "USSR",
  playableSubfaction: "USSR_Army",
  enemyFaction: "SFS_US",
  enemyGroupSets: ["SFS"],
  loadouts: FACTIONS.USSR.loadoutSets.USSR_Army.filter((l) =>
    ["Стрелок", "Пулеметчик (РПК)", "Стрелок ГП", "Санитар", "Ком. отделения", "Ком. взвода"].includes(l.name)
  ),
  guids: {
    addon: "6A97E1B24C08D5F3",
    world: "6A97E1B291D6420A",
    missionConf: "6A97E1B2E73A88C1",
  },
  briefing: {
    ...MISSION.briefing,
    extra: [
      {
        title: "Support",
        text: ["- 2x UAZ-469", "- 1x Ural-4320 Transport Truck"],
      },
    ],
  },
  spawn: {
    ...MISSION.spawn,
    vehicles: [{ type: "UAZ469" }, { type: "UAZ469" }, { type: "Ural4320_transport_covered" }],
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["M1025_armed_M2HB"] },
      ],
    },
  ],
};

// SFS thumbnail-harvest mocks (2026-08-17): crate = ONLY the baked refs that
// live outside every harvested pool (Abrashka dep-mod items — GRS, PKP-B,
// SFSLoadoutBOX...; pool-covered refs already have thumbnails). Two spikes
// because the dep closures come from the mission factions: the US pack rides
// SFS_MISSION's factions, RF+FIA ride SFS_RF_FIA_MISSION's (both anchors).
const SFS_POOL_REFS = new Set(
  [...ARSENAL_POOL, ...MOD_ARSENAL_POOLS.uk, ...MOD_ARSENAL_POOLS.rhs].map((i) => i.ref)
);
const sfsOutsidePool = (...keys) => {
  const seen = new Set();
  const out = [];
  for (const k of keys) {
    for (const it of FACTIONS[k].arsenalItems) {
      if (SFS_POOL_REFS.has(it.ref) || seen.has(it.ref)) continue;
      seen.add(it.ref);
      out.push({ ref: it.ref, mode: it.mode === "WEAPON_VARIANTS" ? "WEAPON" : it.mode });
    }
  }
  return out;
};

// RF+FIA SFS spike: both new Abrashka packs in one mission — SFS_USSR playable
// (RF loadouts/arsenal, alias playable block on the USSR member) vs SFS_FIA
// enemy (SFS-FIA group pools, PL hvt, SF crews in FIA patrol vehicles). Deps =
// both anchors.
const SFS_RF_FIA_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeSFSRFFIA",
  dirName: "TS_WebSpikeSFSRFFIA",
  addonTitle: "TS Web Spike SFS RF FIA Mission",
  name: "TS_WebSpikeSFSRFFIA",
  displayName: "TS Web Spike SFS RF FIA",
  playableFaction: "SFS_USSR",
  playableSubfaction: "Special Force Squad",
  enemyFaction: "SFS_FIA",
  enemyGroupSets: ["SFS"],
  loadouts: FACTIONS.SFS_USSR.loadoutSets["Special Force Squad"].filter((l) =>
    ["Стрелок", "Стрелок ГП", "Пулеметчик", "Санитар", "Ком. отделения", "Снайпер"].includes(l.name)
  ),
  guids: {
    addon: "6A97F5C31D24B860",
    world: "6A97F5C36B09E144",
    missionConf: "6A97F5C3A45D7E92",
  },
  briefing: {
    ...MISSION.briefing,
    extra: [
      {
        title: "Support",
        text: ["- 2x UAZ-469", "- 1x Ural-4320 Transport Truck"],
      },
    ],
  },
  spawn: {
    ...MISSION.spawn,
    vehicles: [{ type: "UAZ469" }, { type: "UAZ469" }, { type: "Ural4320_transport_covered" }],
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["BRDM2_FIA"] },
      ],
    },
  ],
};

const THUMBS_SFS_US_MISSION = {
  ...SFS_MISSION,
  addonId: "TSWebSpikeThumbsSFSUS",
  dirName: "TS_WebSpikeThumbsSFSUS",
  addonTitle: "TS Web Spike Thumbs SFS US Mission",
  name: "TS_WebSpikeThumbsSFSUS",
  displayName: "TS Web Spike Thumbs SFS US",
  guids: {
    addon: "6AA3D07C4E92B1F5",
    world: "6AA3D07CA1568D23",
    missionConf: "6AA3D07C79E4C6B8",
  },
  arsenal: sfsOutsidePool("SFS_US"),
};

const THUMBS_SFS_RF_FIA_MISSION = {
  ...SFS_RF_FIA_MISSION,
  addonId: "TSWebSpikeThumbsSFSRF",
  dirName: "TS_WebSpikeThumbsSFSRF",
  addonTitle: "TS Web Spike Thumbs SFS RF FIA Mission",
  name: "TS_WebSpikeThumbsSFSRF",
  displayName: "TS Web Spike Thumbs SFS RF FIA",
  guids: {
    addon: "6AA3D142B7605E89",
    world: "6AA3D1423AF8C217",
    missionConf: "6AA3D1428D19F4A6",
  },
  arsenal: sfsOutsidePool("SFS_USSR", "SFS_FIA"),
};

// Arma II Factions spike: CDF playable vs ChDKZ enemy — exercises the mod's
// conf-ref FactionManager members on both sides (playable/callsign block on
// the CDF member, ChDKZ group pools + PL hvt + Chedaki crews in reskinned
// vehicles). No friendliness clearing fires (CDF↔ChDKZ are hostile).
const A2_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeA2",
  dirName: "TS_WebSpikeA2",
  addonTitle: "TS Web Spike A2 Mission",
  name: "TS_WebSpikeA2",
  displayName: "TS Web Spike A2",
  playableFaction: "Ses_CDF",
  playableSubfaction: "CDF Army",
  enemyFaction: "Ses_ChDKZ",
  enemyGroupSets: ["ChDKZ"],
  loadouts: FACTIONS.Ses_CDF.loadoutSets["CDF Army"].filter((l) =>
    ["Rifleman", "Automatic Rifleman", "Grenadier", "Medic", "SL", "PL"].includes(l.name)
  ),
  guids: {
    addon: "6A98A2F00C4D71B5",
    world: "6A98A2F059E3B267",
    missionConf: "6A98A2F0B71D94E8",
  },
  briefing: {
    ...MISSION.briefing,
    extra: [
      {
        title: "Support",
        text: ["- 2x UAZ-469", "- 1x Ural-4320 Transport Truck"],
      },
    ],
  },
  spawn: {
    ...MISSION.spawn,
    vehicles: [{ type: "UAZ469_CDF" }, { type: "UAZ469_CDF" }, { type: "Ural4320_transport_covered_CDF" }],
  },
  zones: [
    MISSION.zones[0],
    {
      ...MISSION.zones[1],
      plugins: [
        { type: "TS_ScenarioFrameworkPluginMountedPatrol", attrs: { m_iBudget: 1 }, vehicles: ["BRDM2_ChDKZ", "Ural4320_transport_covered_ChDKZ"] },
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

// Merak spike: island interior — AIWorld cross-check matched (32.72 sampled
// vs 32.687 placed).
const MERAK_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeMerak",
  dirName: "TS_WebSpikeMerak",
  addonTitle: "TS Web Spike Merak Mission",
  name: "TS_WebSpikeMerak",
  displayName: "TS Web Spike Merak",
  terrain: "merak",
  guids: {
    addon: "6A900BEAF5D2F3EC",
    world: "6A900BEA40C405A8",
    missionConf: "6A900BEA71E512BD",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet forces have taken the central highlands of Merak Island.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "4200 52.16 5800",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "5200 29.53 4900",
    },
    {
      ...MISSION.zones[1],
      pos: "5000 32.06 4800",
    },
  ],
  markers: [
    { kind: "military", pos: [5200, 29.5, 4900], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [4250, 52.6, 5750], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [5000, 32.1, 4800], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [5100, 27.8, 4850], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [5200, 29.5, 4900], length: 300, width: 200, rotation: 30 },
  ],
  // Terrain spike: base MISSION's props/objectives carry Arland coords
  // (Merak: props would land in the sea) — not part of terrain validation.
  objectives: [],
  props: [],
};

// Mogadishu spike: coastal city — heightmap validated against terrain-fitted
// buildings (2.00 sampled vs 2.001 placed); spike sits on the inland rise.
const MOGADISHU_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeMogadishu",
  dirName: "TS_WebSpikeMogadishu",
  addonTitle: "TS Web Spike Mogadishu Mission",
  name: "TS_WebSpikeMogadishu",
  displayName: "TS Web Spike Mogadishu",
  terrain: "mogadishu",
  guids: {
    addon: "6A911CFB06E304FD",
    world: "6A911CFB51D516B9",
    missionConf: "6A911CFB82F623CE",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Militia forces control the districts on the rise north-west of the Mogadishu waterfront.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "1500 31.38 4800",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "2500 17.31 4200",
    },
    {
      ...MISSION.zones[1],
      pos: "2300 17.75 4100",
    },
  ],
  markers: [
    { kind: "military", pos: [2500, 17.3, 4200], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [1550, 31.2, 4750], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [2300, 17.8, 4100], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [2400, 17.5, 4150], length: 1000, width: 800, rotation: 0 },
    { kind: "objective", pos: [2500, 17.3, 4200], length: 300, width: 200, rotation: 30 },
  ],
  // Terrain spike: drop the base MISSION's Arland-coord props/objectives.
  objectives: [],
  props: [],
};

// Al Hadra spike: desert flats — AIWorld cross-check matched (36.22 sampled
// vs 36.075 placed).
const ALHADRA_MISSION = {
  ...MISSION,
  addonId: "TSWebSpikeAlHadra",
  dirName: "TS_WebSpikeAlHadra",
  addonTitle: "TS Web Spike Al Hadra Mission",
  name: "TS_WebSpikeAlHadra",
  displayName: "TS Web Spike Al Hadra",
  terrain: "alhadra",
  guids: {
    addon: "6A922D0C17F415DE",
    world: "6A922D0C62E6270A",
    missionConf: "6A922D0C93072F1F",
  },
  briefing: {
    ...MISSION.briefing,
    situation: [
      "Soviet-backed forces hold the compounds on the Al Hadra flats.",
      "",
      "Friendly forces are staging north-west of the AO. Enemy patrols, mounted elements and garrisoned positions are reported around the objective area.",
    ],
  },
  spawn: {
    ...MISSION.spawn,
    pos: "2700 24.13 5900",
  },
  zones: [
    {
      ...MISSION.zones[0],
      pos: "3600 17.84 5000",
    },
    {
      ...MISSION.zones[1],
      pos: "3400 17.84 4900",
    },
  ],
  markers: [
    { kind: "military", pos: [3600, 17.8, 5000], text: "Enemy armor", faction: "OPFOR", type: "ARMOR" },
    { kind: "military", pos: [2750, 20.0, 5850], text: "", faction: "BLUFOR", type: "INFANTRY" },
    { kind: "custom", pos: [3400, 17.8, 4900], text: "Лагерь", icon: "DOT", color: "OPFOR", rotation: 45 },
  ],
  sectors: [
    { kind: "ao", pos: [3500, 17.8, 4950], length: 1200, width: 900, rotation: 0 },
    { kind: "objective", pos: [3600, 17.8, 5000], length: 300, width: 200, rotation: 30 },
  ],
  // Terrain spike: drop the base MISSION's Arland-coord props/objectives.
  objectives: [],
  props: [],
};

const BUILT = process.argv.includes("--alhadra")
  ? ALHADRA_MISSION
  : process.argv.includes("--mogadishu")
  ? MOGADISHU_MISSION
  : process.argv.includes("--merak")
  ? MERAK_MISSION
  : process.argv.includes("--zarichne")
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
            : process.argv.includes("--bandits")
              ? BANDITS_MISSION
              : process.argv.includes("--afrf-mei")
                ? AFRF_MEI_MISSION
              : process.argv.includes("--mei")
                ? MEI_MISSION
                : process.argv.includes("--a2")
                  ? A2_MISSION
                : process.argv.includes("--sfs-rf-fia")
                  ? SFS_RF_FIA_MISSION
                : process.argv.includes("--sfs-enemy")
                  ? SFS_ENEMY_MISSION
                : process.argv.includes("--sfs")
                  ? SFS_MISSION
                : process.argv.includes("--arsenal")
                  ? ARSENAL_MISSION
                : process.argv.includes("--spawn-pos")
                  ? SPAWN_POS_MISSION
                : process.argv.includes("--thumbs-sfs-us")
                  ? THUMBS_SFS_US_MISSION
                : process.argv.includes("--thumbs-sfs-rf")
                  ? THUMBS_SFS_RF_FIA_MISSION
                : process.argv.includes("--thumbs-rhs-usaf")
                  ? THUMBS_RHS_USAF_MISSION
                : process.argv.includes("--thumbs-rhs-ion")
                  ? THUMBS_RHS_ION_MISSION
                : process.argv.includes("--thumbs-rhs-afrf")
                  ? THUMBS_RHS_AFRF_MISSION
                : process.argv.includes("--thumbs-uk")
                  ? THUMBS_UK_MISSION
                : process.argv.includes("--thumbs")
                  ? THUMBS_MISSION
                  : MISSION;
// CLI heightmap sampler (same .bin/.json pair the web app ships) so spikes
// get terrain-accurate bundle Y and prop tilt like a browser export. Falls
// back to flat emission for terrains without a local heightmap.
function cliSampler(terrainKey) {
  try {
    const dir = join(import.meta.dirname, "..", "web", "public", "heightmaps");
    const meta = JSON.parse(readFileSync(join(dir, `${terrainKey}.json`), "utf8"));
    const buf = readFileSync(join(dir, `${terrainKey}.bin`));
    const u16 = new Uint16Array(buf.buffer, buf.byteOffset, buf.byteLength / 2);
    const { worldWidthM, worldHeightM, widthPx, heightPx, minElevationM, heightScale } = meta;
    // px per metre = 1/cellSizeM — pixel i sits at exactly i·cellSizeM
    // (see web/src/lib/heightmap.ts for the stretch bug this replaces)
    const xS = 1 / meta.cellSizeM;
    const yS = 1 / meta.cellSizeM;
    return (x, z) => {
      if (x < 0 || x > worldWidthM || z < 0 || z > worldHeightM) return NaN;
      const fx = x * xS, fy = z * yS;
      const x0 = Math.min(widthPx - 1, Math.floor(fx)), y0 = Math.min(heightPx - 1, Math.floor(fy));
      const x1 = Math.min(widthPx - 1, x0 + 1), y1 = Math.min(heightPx - 1, y0 + 1);
      const tx = fx - x0, ty = fy - y0;
      const h = (u16[y0 * widthPx + x0] * (1 - tx) + u16[y0 * widthPx + x1] * tx) * (1 - ty)
              + (u16[y1 * widthPx + x0] * (1 - tx) + u16[y1 * widthPx + x1] * tx) * ty;
      return minElevationM + h * heightScale;
    };
  } catch {
    return undefined;
  }
}

const { files, addonDirName } = buildMissionFiles(BUILT, { sampleY: cliSampler(BUILT.terrain) });
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
