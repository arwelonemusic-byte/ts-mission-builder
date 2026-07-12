// CLI wrapper: builds the TS_WebSpike test mission via lib.mjs and writes it
// into the Workbench addons directory.
//
// Usage: node generate.mjs [--clean] [--rhs]
//   --clean  only when Workbench is NOT running: it wipes the addon dir
//            including EnfusionMCP handler scripts
//   --rhs    build the RHS variant instead (TS_WebSpikeRHS: RHS_USAF vs
//            RHS_AFRF, exercises mod deps + FactionManager conf-ref entries)

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

const BUILT = process.argv.includes("--rhs") ? RHS_MISSION : MISSION;
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
