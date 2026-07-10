// CLI wrapper: builds the TS_WebSpike test mission via lib.mjs and writes it
// into the Workbench addons directory.
//
// Usage: node generate.mjs [--clean]   (--clean only when Workbench is NOT
// running: it wipes the addon dir including EnfusionMCP handler scripts)

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
  playerCount: 24,
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

const { files, addonDirName } = buildMissionFiles(MISSION);
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
console.log(`Mission: ${MISSION.displayName} | ${MISSION.terrain} | ${MISSION.playableFaction} vs ${MISSION.enemyFaction}`);
