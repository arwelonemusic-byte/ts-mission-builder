// Mission addon generator library — pure functions, runs in Node or the browser.
// buildMissionFiles(mission) -> { files: { relPath: content }, addonDirName }
//
// All GUIDs ground-truthed from TS Mission Toolkit / vanilla data / production ops.
// See CLAUDE.md "Validated architecture facts" before changing formats.

import { TERRAINS, FACTIONS, MODS, K, ZONE_MODULES, OBJECTIVE_TYPES, DESTROY_OBJECTS, resolveGroupPool, resolveSentryPool, resolveDefenseGroup } from "./catalogue.mjs";
import { layoutSpawnBundle, rotateLocal } from "./layout.mjs";
export { TERRAINS, FACTIONS, MODS, K, ZONE_MODULES, OBJECTIVE_TYPES, DESTROY_OBJECTS, resolveGroupPool, resolveSentryPool, resolveDefenseGroup };
export { layoutSpawnBundle, rotateLocal, itemWorldCorners, vehicleSizeClass } from "./layout.mjs";

let guidCounter = 0;
export function mintGuid() {
  // Workbench convention: 8 hex chars epoch-seconds + 8 random hex
  const ts = Math.floor(Date.now() / 1000).toString(16).toUpperCase().padStart(8, "0");
  let rnd = "";
  for (let i = 0; i < 8; i++) rnd += "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
  // counter mixed in so same-millisecond mints stay unique
  guidCounter = (guidCounter + 1) & 0xf;
  return ts + rnd.slice(0, 7) + guidCounter.toString(16).toUpperCase();
}

function meta(resourceClass, guid, relPath) {
  const platforms = ["XBOX_ONE", "XBOX_SERIES", "PS4", "PS5", "HEADLESS"];
  let s = `MetaFileClass {\n Name "{${guid}}${relPath}"\n Configurations {\n  ${resourceClass} PC {\n  }\n`;
  for (const p of platforms) s += `  ${resourceClass} ${p} : PC {\n  }\n`;
  return s + ` }\n}\n`;
}

// Texture .meta — unlike our text resources, an imported texture's meta names
// the per-platform TextureUnspecified.conf that drove the conversion (engine
// resource-type confs, fixed GUIDs). Copied from Workbench-produced
// Images/*.edds.meta so a reimport in Workbench behaves identically.
const TEXTURE_TYPE_CONFS = {
  PC: "DC555BD399D92412",
  XBOX_ONE: "8F13AE697AE60784",
  XBOX_SERIES: "D28E01700D90F52C",
  PS4: "C6CD3D8752652D2A",
  PS5: "6248F71B9D7C1E93",
  HEADLESS: "699C82A6807668A7",
};

function textureMeta(guid, relPath) {
  let s = `MetaFileClass {\n Name "{${guid}}${relPath}"\n Configurations {\n`;
  for (const [platform, confGuid] of Object.entries(TEXTURE_TYPE_CONFS)) {
    s += `  PNGResourceClass ${platform} : "{${confGuid}}Configs/System/ResourceTypes/${platform}/TextureUnspecified.conf" {\n  }\n`;
  }
  return s + ` }\n}\n`;
}

// Multi-line m_sEntryText serialization (quoted lines joined by `\` continuations)
function entryText(lines, indent) {
  const safe = lines.length ? lines : [""];
  return safe.map((l) => `"${String(l).replace(/"/g, "'")}"`).join(`\\\n${indent}`);
}

const posStr = (p) => (Array.isArray(p) ? p.map((n) => +n.toFixed(3)).join(" ") : p);

// Artillery support: component override on the GameModeSF entity instance.
// m_bEnabled defaults to 0 in script (the prefab doesn't set it), so a
// disabled toggle = no block at all. Round counts are written only when they
// differ from the prefab-effective values (HE 60, Smoke 30, Illum 30); 0 is a
// valid explicit value that removes that round type from the game.
// mission.arty = { he, smoke, illum } round counts, or null/undefined = off.
function fireSupportBlock(arty) {
  if (!arty) return "";
  const prefabDefaults = { he: 60, smoke: 30, illum: 30 };
  const names = { he: "m_iRoundsHE", smoke: "m_iRoundsSmoke", illum: "m_iRoundsIllum" };
  let rounds = "";
  for (const key of ["he", "smoke", "illum"]) {
    const n = Math.max(0, Math.floor(arty[key] ?? 0));
    if (n !== prefabDefaults[key]) rounds += `\n   ${names[key]} ${n}`;
  }
  return `
  TS_FireSupportManagerComponent "${K.CMP_FIRE_SUPPORT}" {
   m_bEnabled 1${rounds}
  }`;
}

export function buildMissionFiles(mission, options = {}) {
  const F = FACTIONS[mission.playableFaction];
  const ENEMY = FACTIONS[mission.enemyFaction];
  const TERRAIN = TERRAINS[mission.terrain];
  if (!F) throw new Error(`Unknown playable faction: ${mission.playableFaction}`);
  if (!ENEMY) throw new Error(`Unknown enemy faction: ${mission.enemyFaction}`);
  if (!TERRAIN) throw new Error(`Unknown terrain: ${mission.terrain}`);
  const RIFLEMAN = F.riflemen[mission.playableSubfaction];
  if (!RIFLEMAN) throw new Error(`No rifleman for ${mission.playableFaction}/${mission.playableSubfaction}`);

  const guids = {
    addon: mission.guids?.addon ?? mintGuid(),
    world: mission.guids?.world ?? mintGuid(),
    missionConf: mission.guids?.missionConf ?? mintGuid(),
    thumbnail: mission.guids?.thumbnail ?? mintGuid(),
  };

  // Custom thumbnail: the web app composites the image and adds the binary
  // Images/<name>.png + .edds; we own the resource ref and the sidecar .meta.
  // Without one the mission keeps the toolkit's stock icon.
  const thumbPath = `Images/${mission.name}.edds`;
  const thumbRef = mission.thumbnail ? `{${guids.thumbnail}}${thumbPath}` : K.TOOLKIT_ICON;

  // Mod content: dependencies + extra FactionManager entries derive from the
  // factions the mission actually uses (their `mod` tag), NOT from a UI
  // checkbox — a vanilla-only mission must never force players to install a
  // mod that merely happened to be enabled in the builder.
  const usedMods = [...new Set([F.mod, ENEMY.mod].filter(Boolean))];
  const modDeps = [
    ...new Set([...usedMods.flatMap((id) => MODS[id].dependencies), ...(TERRAIN.dependencies ?? [])]),
  ];
  // Alias factions (aliasOf) are vanilla reskins — their vanilla member is
  // already in the FactionManager emission, so they must not appear again.
  const modFactionKeys = usedMods
    .flatMap((id) => Object.keys(MODS[id].factions))
    .filter((k) => !FACTIONS[k].aliasOf);

  // --- addon.gproj ---
  const gproj = `GameProject {
 ID "${mission.addonId}"
 GUID "${guids.addon}"
 TITLE "${mission.addonTitle}"
 Dependencies {
  "${K.BASE_GAME}"
  "${K.TOOLKIT}"${modDeps.map((d) => `\n  "${d}"`).join("")}
 }
 Configurations {
  GameProjectConfig PC {
  }
  GameProjectConfig XBOX_ONE {
  }
  GameProjectConfig XBOX_SERIES {
  }
  GameProjectConfig PS4 {
  }
  GameProjectConfig PS5 {
  }
  GameProjectConfig HEADLESS {
  }
 }
}
`;

  // --- world .ent ---
  const worldEnt = `SubScene {\n Parent "${TERRAIN.parent}"\n}\n`;

  // --- mission .conf ---
  const taskTypes = ["DELIVER", "DESTROY", "CLEAR_AREA", "KILL", "DEFEND"]
    .map((t) => `  SCR_ScenarioFrameworkTaskType "{${mintGuid()}}" {\n   m_eTypeOfTask ${t}\n  }`)
    .join("\n");
  const shortDesc = (mission.briefing.situation[0] ?? mission.displayName).replace(/"/g, "'");
  const missionConf = `SCR_MissionHeaderCombatOps {
 World "{${guids.world}}Worlds/${mission.name}.ent"
 m_sName "${mission.displayName}"
 m_sAuthor "${mission.author}"
 m_sDescription "${shortDesc}"
 m_sDetails "${shortDesc}"
 m_sIcon "${thumbRef}"
 m_sLoadingScreen "${thumbRef}"
 m_sPreviewImage "${thumbRef}"
 m_sGameMode "COOP"
 m_iPlayerCount ${mission.playerCount ?? 128}
 m_bOverrideScenarioTimeAndWeather 1
 m_bRandomStartingDaytime 1
 m_iMapMarkerLimitPerPlayer 999
 m_aTaskTypesAvailable {
${taskTypes}
 }
}
`;

  // --- Override 1: TS_MissionLoadouts.conf (same path, ORIGINAL GUID in .meta) ---
  // The toolkit's default conf is empty, so every selected loadout is a NEW array
  // member with a fresh GUID. Confs load locally on every machine — loadouts and
  // the GM assign action work regardless of the replication bubble.
  // m_iMaxPlayers stays at its default (-1, unlimited) for now.
  let selectedLoadouts = mission.loadouts;
  if (!selectedLoadouts?.length) {
    selectedLoadouts = F.loadoutSets[mission.playableSubfaction]?.slice(0, 1);
    if (!selectedLoadouts?.length) throw new Error(`No loadouts for ${mission.playableFaction}/${mission.playableSubfaction}`);
  }
  const loadoutConfigs = selectedLoadouts
    .map((l) => `  TS_LoadoutConfig "{${mintGuid()}}" {\n   m_sName "${l.name}"\n   m_CharacterPrefab "${l.prefab}"\n  }`)
    .join("\n");
  const loadoutConfOverride = `TS_LoadoutListConfig {\n m_aLoadoutConfigs {\n${loadoutConfigs}\n }\n}\n`;

  // --- Override 2: LoadoutCrates_Conf.et (faction affiliation only) ---
  // Loadouts live in the conf now; the crate override just brands the crate with
  // the playable faction for the 1.7 arsenal faction validation.
  const crateOverride = `GenericEntity : "${K.CRATE_PARENT}" {
 ID "${K.CRATE_ROOT_ID}"
 components {
  SCR_FactionAffiliationComponent "${K.CMP_FACTION_AFF}" {
   "faction affiliation" "${mission.playableFaction}"
  }
 }
}
`;

  // --- Override 3: TS_CustomArsenal.conf ---
  // First entry reuses the base conf's member instance GUID (its supply cost /
  // allocation fields come from the base); new members declare m_iSupplyCost 0.
  // m_eItemMode comes from the vanilla EntityCatalog (omitted when empty).
  // subfactionArsenalItems (optional) appends subfaction-specific extras (e.g.
  // camo-matched backpacks) for the selected playable subfaction.
  const arsenalItems = [...F.arsenalItems, ...(F.subfactionArsenalItems?.[mission.playableSubfaction] ?? [])]
    .map((item, i) => {
      const guid = i === 0 ? K.ARSENAL_BASE_ENTRY : `{${mintGuid()}}`;
      const mode = item.mode ? `\n   m_eItemMode ${item.mode}` : "";
      const cost = i === 0 ? "" : "\n   m_iSupplyCost 0";
      return `  SCR_ArsenalItemStandalone "${guid}" {${mode}${cost}\n   m_ItemResourceName "${item.ref}"\n  }`;
    })
    .join("\n");
  const arsenalOverride = `SCR_ArsenalItemListConfig {\n m_aArsenalItems {\n${arsenalItems}\n }\n}\n`;

  // --- Override 4: Briefing.conf (toolkit's instance GUIDs kept) ---
  // The 3 default entries (ids 0-2) reuse the toolkit's instance GUIDs; additional
  // user entries get fresh GUIDs and sequential ids from 3 (Foxhound pattern).
  const briefTexts = [mission.briefing.situation, mission.briefing.objectives, mission.briefing.threats];
  const briefDefaults = K.BRIEF_ENTRIES.map(
    (e, i) => `    SCR_JournalEntry "${e.guid}" {
     m_iEntryID ${e.id}
     m_eJournalEntryType Custom
     m_sCustomEntryName "${e.title}"
     m_sEntryText ${entryText(briefTexts[i], "     ")}
    }`
  );
  const briefExtras = (mission.briefing.extra ?? []).map(
    (e, i) => `    SCR_JournalEntry "{${mintGuid()}}" {
     m_iEntryID ${K.BRIEF_ENTRIES.length + i}
     m_eJournalEntryType Custom
     m_sCustomEntryName "${String(e.title ?? "").replace(/"/g, "'")}"
     m_sEntryText ${entryText(e.text, "     ")}
    }`
  );
  const briefEntries = [...briefDefaults, ...briefExtras].join("\n");
  const briefingOverride = `SCR_JournalSetupConfig {
 m_aJournals {
  SCR_JournalConfig "${K.BRIEF_JOURNAL}" {
   m_aEntries {
${briefEntries}
   }
  }
 }
}
`;

  // --- default.layer ---
  const navBlocks = [
    ['NavmeshWorldComponent "{5584F30E67F617AD}"', 'NavmeshWorld "{50FC63BEBE3973C5}"', '"{6906F4B5A0124466}"', TERRAIN.nav[0]],
    ['NavmeshWorldComponent "{5584F30EEFEE1223}"', 'ChimeraNavmeshWorld "{50FC63BEBE3973C5}"', '"{60CA9BE5536BF701}"', TERRAIN.nav[1]],
    ['NavmeshWorldComponent "{5C8C9B750D124A63}"', 'NavmeshWorld "{5C8C9B750B60C6E2}"', '"{5C90BD0EC793647D}"', TERRAIN.nav[2]],
  ]
    .map(
      ([cmp, settings, cfgGuid, file]) => `  ${cmp} {
   NavmeshSettings ${settings} {
    NavmeshFilesConfig BaseNavmeshFilesConfig ${cfgGuid} {
     NavmeshFile "${file}"
    }
   }
  }`
    )
    .join("\n");

  // Player squads: mission.groups = [{name, size}] (max 8, size 1-9), default =
  // the Mod Defaults standard 1'1-1'4 + 1'6 @ 9/9/9/9/3. groups[i] <-> squad
  // name [i] <-> group preset [i] by index (m_bIsAssignedRandomly 0 assigns
  // names in array order).
  const DEFAULT_GROUPS = [
    { name: "1'1", size: 9 },
    { name: "1'2", size: 9 },
    { name: "1'3", size: 9 },
    { name: "1'4", size: 9 },
    { name: "1'6", size: 3 },
  ];
  const groups = mission.groups?.length ? mission.groups.slice(0, 8) : DEFAULT_GROUPS;
  const gname = (g, i) => (String(g?.name ?? "").trim().replace(/"/g, "'") || `1'${i + 1}`);
  // Always override ALL squadBase members even with fewer groups: overflow
  // auto-created groups pick up un-overridden vanilla names ("3", "4") —
  // fallback-name the unused slots so numbering stays consistent.
  const nameCount = Math.max(groups.length, F.squadBase.length);
  const squadCallsigns = Array.from({ length: nameCount }, (_, i) => {
    let guid;
    if (i < F.squadBase.length) guid = F.squadBase[i];
    else if (i === 4 && F.squadFifth) guid = F.squadFifth;
    else guid = `{${mintGuid()}}`;
    return [guid, gname(groups[i], i)];
  });
  const squadNamesBlock = squadCallsigns
    .map(([guid, cs]) => `     SCR_CallsignInfo "${guid}" {\n      m_sCallsign "${cs}"\n     }`)
    .join("\n");
  const groupPresets = groups
    .map((g) => {
      const size = Math.max(1, Math.min(9, Math.floor(+g.size) || 9));
      return `    SCR_GroupPreset "{${mintGuid()}}" {\n     m_iGroupSize ${size}\n    }`;
    })
    .join("\n");

  // Faction friendliness (m_aFriendlyFactionsIds) is SYMMETRIC and one-sided
  // declarations suffice (SCR_Faction.c: "for init it is only required for one
  // faction") — a declared friendship between the mission's two sides would
  // make them refuse to fight (UK↔US, RHS_AFRF↔USSR/MEI). When either side's
  // registry def declares the other side friendly (`friendlyWith`, in-game
  // keys; aliases resolve to their base key), that member's override clears
  // the list so the pair is hostile in THIS mission.
  const effKey = (k) => FACTIONS[k].aliasOf ?? k;
  const sideKeys = [effKey(mission.playableFaction), effKey(mission.enemyFaction)];
  function clearedFriendsBlock(key) {
    const idx = sideKeys.indexOf(key);
    if (idx === -1) return "";
    const other = sideKeys[1 - idx];
    if (!FACTIONS[key].friendlyWith?.includes(other)) return "";
    return `\n   m_aFriendlyFactionsIds {\n   }`;
  }

  function factionEntry(key) {
    const f = FACTIONS[key];
    // entryGuid = override an EXISTING FactionManager_Editor member (vanilla
    // factions, and mod factions when the mod overrides that prefab — RHS
    // does). confRef = append a NEW member sourcing the mod's faction .conf
    // (CIV_ENTRY pattern) — only for mods that DON'T override the prefab;
    // appending a duplicate FactionKey kills playability at runtime. New
    // members set m_bIsPlayable 0 explicitly: their conf may inherit
    // playable=1 from a vanilla base faction.
    const head = f.confRef
      ? `  SCR_Faction "{${mintGuid()}}" : "${f.confRef}" {`
      : `  SCR_Faction "${f.entryGuid}" {`;
    // m_bIsAssignedRandomly defaults to 1 — turn it OFF on every faction so
    // squads take callsigns in order (1'1, 1'2, ...) instead of at random.
    if (key !== mission.playableFaction)
      return `${head}${f.confRef ? "\n   m_bIsPlayable 0" : ""}${clearedFriendsBlock(key)}
   m_CallsignInfo SCR_FactionCallsignInfo "${f.callsignGuid}" {
    m_bIsAssignedRandomly 0
   }
  }`;
    return `${head}
   m_bIsPlayable 1${clearedFriendsBlock(key)}
   m_CallsignInfo SCR_FactionCallsignInfo "${f.callsignGuid}" {
    m_bIsAssignedRandomly 0
    m_aSquadNames {
${squadNamesBlock}
    }
    m_sCallsignGroupFormat "%3"
   }
   m_aPredefinedGroups {
${groupPresets}
   }
  }`;
  }

  const base = (Array.isArray(mission.spawn.pos) ? mission.spawn.pos : mission.spawn.pos.split(" ").map(Number));
  const mgr = (dx, dy, dz) => `${+(base[0] + dx).toFixed(3)} ${+(base[1] + dy).toFixed(3)} ${+(base[2] + dz).toFixed(3)}`;

  const defaultLayer = `SCR_AIWorld SCR_AIWorld : "{E0A05C76552E7F58}Prefabs/AI/SCR_AIWorld.et" {
 components {
${navBlocks}
 }
 coords ${mgr(-20, 0, -20)}
}
${TERRAIN.parentHasPerceptionManager ? "" : `PerceptionManager PerceptionManager : "{028DAEAD63E056BE}Prefabs/World/Game/PerceptionManager.et" {
 coords ${mgr(-20, 0, -18)}
}
`}SCR_FactionManager FactionManager_Editor : "{4A188E44289B9A50}Prefabs/MP/Managers/Factions/FactionManager_Editor.et" {
 coords ${mgr(-19, 0, -17)}
 Factions {
${["US", "USSR", "FIA", ...modFactionKeys].map(factionEntry).join("\n")}
  SCR_Faction "${K.CIV_ENTRY}" {
  }
 }
}
RadioManagerEntity RadioManager : "{B8E09FAB91C4ECCD}Prefabs/Systems/Radio/RadioManager.et" {
 coords ${mgr(-20, 0, -19)}
}
SCR_BaseGameMode GameModeSF : "{ECEEDB2D3737204B}Prefabs/Systems/ScenarioFramework/GameModeSF.et" {
 components {
  SCR_RespawnSystemComponent "{56B2B4793051E7C9}" {
   m_SpawnLogic SCR_MenuSpawnLogic "{5D36888CC966608A}" {
   }
  }${fireSupportBlock(mission.arty)}
 }
 coords ${mgr(-20, 0, -21)}
}
ScriptedChatEntity ScriptedChatEntity : "{F69BC912AC8236F9}Prefabs/MP/ScriptedChatEntity.et" {
 coords ${mgr(-20, 0, -16)}
}
SCR_LoadoutManager : "{AA4E7419A1FF65B0}Prefabs/MP/Managers/Loadouts/LoadoutManager_Base.et" {
 coords ${mgr(-19, 0, -15)}
 m_aPlayerLoadouts {
  TS_PlayerArsenalLoadout "${K.LM_ARSENAL_LOADOUT}" {
   m_sLoadoutResource "${RIFLEMAN}"
   m_sAffiliatedFaction "${mission.playableFaction}"
  }
  SCR_FactionPlayerLoadout "${K.LM_RIFLEMAN_LOADOUT}" {
   m_sLoadoutResource "${RIFLEMAN}"
   m_sAffiliatedFaction "${mission.playableFaction}"
  }
 }
}
`;

  // --- Spawn.layer ---
  // All positions come from the shared bundle layout engine (layout.mjs) so the
  // web preview and the generated mission are guaranteed to match. The whole
  // bundle rotates around the spawn origin by mission.spawn.yaw. If
  // options.sampleY(x,z) is provided (web heightmap), each element gets a
  // terrain-accurate Y; otherwise everything uses the origin's Y.
  const bundleYaw = +((mission.spawn.yaw ?? 0) % 360).toFixed(1);
  const originY = base[1];
  const sampleYFn = options.sampleY;
  const yAt = (wx, wz) => {
    if (!sampleYFn) return originY;
    const y = sampleYFn(wx, wz);
    return Number.isFinite(y) ? y : originY;
  };
  const layout = layoutSpawnBundle(mission.spawn);
  const localToWorld = (lx, lz) => {
    const [dx, dz] = rotateLocal(lx, lz, bundleYaw);
    return [base[0] + dx, base[2] + dz, dx, dz];
  };

  function slotBlock(name, objectRef, item) {
    const [wx, wz, dx, dz] = localToWorld(item.x, item.z);
    const relY = +(yAt(wx, wz) - originY).toFixed(3);
    const slotYaw = +(((bundleYaw + (item.yaw ?? 0)) % 360).toFixed(1));
    const angles = slotYaw ? `\n     angles 0 ${slotYaw} 0` : "";
    return `    GenericEntity ${name} : "${K.SLOT_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotBase "${K.CMP_SF_SLOT}" {
       m_sObjectToSpawn "${objectRef}"
      }
     }
     coords ${+dx.toFixed(3)} ${relY} ${+dz.toFixed(3)}${angles}
    }`;
  }

  const crateItem = layout.items.find((it) => it.kind === "crate");
  const spawnPointItem = layout.items.find((it) => it.kind === "spawnPoint");
  const vehicleItems = layout.items.filter((it) => it.kind === "vehicle");

  const vehicleSlots = vehicleItems
    .map((it, i) => {
      const ref = F.vehicles[it.type];
      if (!ref) throw new Error(`No vehicle GUID for ${mission.playableFaction}/${it.type}`);
      return slotBlock(`SlotVehicle${i + 1}`, ref, it);
    })
    .join("\n");

  const farpBlock = mission.spawn.farp
    ? `GenericEntity : "${K.FARP_COMP}" {\n coords ${+base[0].toFixed(3)} ${+originY.toFixed(3)} ${+base[2].toFixed(3)}\n angles 0 ${bundleYaw} 0\n}\n`
    : "";

  const [spX, spZ] = localToWorld(spawnPointItem.x, spawnPointItem.z);
  const spawnLayer = `SCR_SpawnPoint : "${F.spawnPoint}" {
 coords ${+spX.toFixed(3)} ${+yAt(spX, spZ).toFixed(3)} ${+spZ.toFixed(3)}
}
GenericEntity AreaSpawn : "${K.AREA_PREFAB}" {
 coords ${+base[0].toFixed(3)} ${+originY.toFixed(3)} ${+base[2].toFixed(3)}
 {
  GenericEntity LayerCrates : "${K.LAYER_PREFAB}" {
   coords 0 0 0
   {
${slotBlock("SlotCrate", `{${K.CRATE_GUID}}${K.CRATE_PATH}`, crateItem)}
   }
  }
  GenericEntity LayerVehicles : "${K.LAYER_PREFAB}" {
   coords 0 0 0
   {
${vehicleSlots}
   }
  }
 }
}
${farpBlock}`;

  // --- AO.layer ---
  // Pools are resolved from the module definition + enemy group set:
  // infantry modules get size-filtered group pools, vehicle modules get the
  // enemy faction's patrol vehicles.
  // QRF plugin attrs (serialization ground truth: Operation Choripan AO.layer):
  // trigger radius = the zone radius (players entering the zone fire the QRF),
  // anchor group pairs the plugin with ITS zone+module anchors, and the
  // spawn-distance window is deliberately liberal (200-5000 m, plugin defaults
  // are 150-800) — the builder shows the origin→zone line, so placement
  // distance is the mission maker's call. m_fAnchorSearchRadius must cover the
  // window (default 1500 would silently drop far origins at Init).
  const qrfAnchorGroup = (zoneName, kind) =>
    `${zoneName}_${kind === "qrf-foot" ? "Foot" : "Mounted"}`;
  const moduleKind = (p) => ZONE_MODULES.find((d) => d.type === p.type)?.kind;
  const isQrfModule = (p) => {
    const k = moduleKind(p);
    return k === "qrf-foot" || k === "qrf-vehicle";
  };

  function pluginBlock(p, zone, zoneName) {
    const def = ZONE_MODULES.find((d) => d.type === p.type);
    if (!def) throw new Error(`Unknown zone module type: ${p.type}`);
    const enemySets = mission.enemyGroupSets ?? mission.enemyGroupSet;
    const qrfAttrs = {};
    if (isQrfModule(p)) {
      qrfAttrs.m_fTriggerRadius = zone.radius;
      qrfAttrs.m_sAnchorGroup = `"${qrfAnchorGroup(zoneName, def.kind)}"`;
      qrfAttrs.m_fMinSpawnDistance = 200;
      qrfAttrs.m_fMaxSpawnDistance = 5000;
      qrfAttrs.m_fAnchorSearchRadius = 5000;
      // One wave spreads across all placed origins (groups round-robin);
      // default 1 would stack every group/vehicle on the single farthest one.
      if ((p.origins?.length ?? 0) > 1) qrfAttrs.m_iAnchorsPerWave = p.origins.length;
    }
    let pools; // [attrName, refs][]
    if (def.kind === "infantry" || def.kind === "qrf-foot") {
      // Per-zone size-class selection (Foot Patrols weight slider); the module
      // definition's sizes are the default when the mission doesn't specify
      // (QRF Foot always uses its definition sizes — large groups).
      pools = [[def.pool, resolveGroupPool(mission.enemyFaction, enemySets, p.sizes ?? def.sizes)]];
    } else if (def.kind === "fortification") {
      // Composition pools are baked per enemy faction; the AI pool is the
      // sentry team of each SELECTED enemy group set. Tuning attrs (roadside
      // offset 15 / min road width 4 / min spacing 50 / single side) equal
      // the plugin's class defaults and are omitted (Enfusion omits defaults;
      // see Operation Last Light AO.layer for the reference serialization).
      pools = [
        ["m_aRoadFortifications", ENEMY.fortifications.road],
        ["m_aRoadsideFortifications", ENEMY.fortifications.roadside],
        ["m_aAIGroupPool", resolveSentryPool(mission.enemyFaction, enemySets)],
      ];
    } else {
      // Per-zone vehicle selection (keys into the enemy faction's vehicle dict);
      // falls back to all patrol candidates if the mission doesn't specify.
      const keys = p.vehicles?.length ? p.vehicles : ENEMY.patrolVehicleKeys;
      const refs = keys.map((k) => {
        const ref = ENEMY.vehicles[k];
        if (!ref) throw new Error(`Unknown patrol vehicle ${mission.enemyFaction}/${k}`);
        return ref;
      });
      pools = [[def.pool, refs]];
      // Without a crew pool the plugin uses each vehicle prefab's DEFAULT
      // occupants — wrong faction when a faction borrows another's vehicles
      // (MEI in vanilla USSR armor spawned USSR crews). patrolCrew forces
      // faction-correct occupants.
      if (ENEMY.patrolCrew?.length) pools.push(["m_aCrewPrefabPool", ENEMY.patrolCrew]);
    }
    for (const [, refs] of pools) {
      if (!refs?.length) throw new Error(`Empty pool for ${p.type} (${mission.enemyFaction})`);
    }
    let s = `      ${p.type} "{${mintGuid()}}" {\n`;
    for (const [k, v] of Object.entries({ ...(p.attrs ?? {}), ...qrfAttrs })) s += `       ${k} ${v}\n`;
    for (const [name, refs] of pools) {
      s += `       ${name} {\n`;
      for (const ref of refs) s += `        "${ref}"\n`;
      s += `       }\n`;
    }
    return s + `      }`;
  }

  const isSlotAIModule = (p) => ZONE_MODULES.find((d) => d.type === p.type)?.kind === "slotai";

  const aoLayer = mission.zones
    .map((z, i) => {
      const zoneName = z.name ?? `Area${i + 1}`;
      // QRF modules without a single placed origin can never fire (the plugin
      // disarms at Init when its anchor group is empty) — skip them entirely.
      const pluginMods = z.plugins.filter(
        (p) => !isSlotAIModule(p) && !(isQrfModule(p) && !(p.origins?.length))
      );
      const plugins = pluginMods.map((p) => pluginBlock(p, z, zoneName)).join("\n");
      const pluginsBlock = pluginMods.length ? `\n     m_aPlugins {\n${plugins}\n     }` : "";
      // Defense Group: a vanilla SlotAI child of the Layer spawning the
      // largest selected enemy squad in place — the slot's default defend
      // waypoint (30 m radius) keeps it holding the zone center.
      const defenseBlock = z.plugins.some(isSlotAIModule)
        ? `
   {
    GenericEntity SlotAI${i + 1} : "${K.SLOTAI_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotAI "${K.CMP_SF_SLOTAI}" {
       m_sObjectToSpawn "${resolveDefenseGroup(mission.enemyFaction, mission.enemyGroupSets ?? mission.enemyGroupSet)}"
      }
     }
     coords 0 0 0
    }
   }`
        : "";
      return `GenericEntity ${zoneName} : "${K.AREA_PREFAB}" {
 components {
  SCR_ScenarioFrameworkArea "${K.CMP_SF_AREA}" {
   m_fAreaRadius ${z.radius}
   m_bDynamicDespawn 1
   m_iDynamicDespawnRange ${Math.round(z.radius + 400)}
  }
 }
 coords ${posStr(z.pos)}
 {
  GenericEntity Layer${i + 1} : "${K.LAYER_PREFAB}" {
   components {
    SCR_ScenarioFrameworkLayerBase "${K.CMP_SF_LAYER}" {${pluginsBlock}
    }
   }
   coords 0 0 0${defenseBlock}
  }
 }
}
`;
    })
    .join("");

  // --- Markers.layer ---
  // Workbench pattern (see Operation Crayfish): ONE Area wraps all markers,
  // one Layer inside it, one $grp SlotMarker group with a named body per
  // marker. Area/Layer carry no SF components here — just coords. Marker
  // coords are Area-relative. Fields equal to their class defaults are
  // omitted, matching Enfusion's serializer.
  // Marker input (already enum tokens, mapped by the web app):
  //   { kind: "military"|"custom", pos: [x,y,z], text,
  //     faction: "BLUFOR"|..., type: "INFANTRY"|""|...,   (military)
  //     icon: "CIRCLE"|..., color: "WHITE"|..., rotation } (custom)
  const escMarkerText = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  function markerTypeLines(mk) {
    const lines = [];
    if (mk.text) lines.push(`m_sMapMarkerText "${escMarkerText(mk.text)}"`);
    if (mk.kind === "military") {
      if (mk.faction && mk.faction !== "BLUFOR") lines.push(`m_eMapMarkerFactionIcon ${mk.faction}`);
      // Both type modifiers are OR-ed by the game and default to INFANTRY —
      // write both so the mask equals exactly the chosen type ("" = empty).
      if (!mk.type) {
        lines.push(`m_eMapMarkerType1Modifier 0`);
        lines.push(`m_eMapMarkerType2Modifier 0`);
      } else if (mk.type !== "INFANTRY") {
        lines.push(`m_eMapMarkerType1Modifier ${mk.type}`);
        lines.push(`m_eMapMarkerType2Modifier ${mk.type}`);
      }
    } else {
      if (mk.icon && mk.icon !== "CIRCLE") lines.push(`m_eMapMarkerIcon ${mk.icon}`);
      if (mk.color && mk.color !== "WHITE") lines.push(`m_eMapMarkerColor ${mk.color}`);
      // Workbench uses a -180..180 slider; normalize our 0..359 to that range
      let rot = Math.round(mk.rotation ?? 0) % 360;
      if (rot > 180) rot -= 360;
      if (rot) lines.push(`m_iMapMarkerRotation ${rot}`);
    }
    return lines;
  }

  let markersLayer = "";
  const missionMarkers = mission.markers ?? [];
  if (missionMarkers.length) {
    const avg = (idx) => missionMarkers.reduce((s, mk) => s + mk.pos[idx], 0) / missionMarkers.length;
    const origin = [+avg(0).toFixed(3), +avg(1).toFixed(3), +avg(2).toFixed(3)];
    const slotBlocks = missionMarkers
      .map((mk, i) => {
        const cls = mk.kind === "military" ? "SCR_ScenarioFrameworkMarkerMilitary" : "SCR_ScenarioFrameworkMarkerCustom";
        const rel = [mk.pos[0] - origin[0], mk.pos[1] - origin[1], mk.pos[2] - origin[2]];
        const body = markerTypeLines(mk)
          .map((l) => `         ${l}`)
          .join("\n");
        return `     SlotMarker${i + 1} {
      components {
       SCR_ScenarioFrameworkSlotMarker "${K.CMP_SF_SLOTMARKER}" {
        m_MapMarkerType ${cls} "${K.MARKER_TYPE_GUID}" {${body ? `\n${body}` : ""}
        }
       }
      }
      coords ${posStr(rel)}
     }`;
      })
      .join("\n");
    // "LayerMarkers", not "Layer1" — entity names are global across all
    // layers and AO.layer already numbers its zone layers Layer1..N.
    markersLayer = `GenericEntity AreaMarkers : "${K.AREA_PREFAB}" {
 coords ${posStr(origin)}
 {
  GenericEntity LayerMarkers : "${K.LAYER_PREFAB}" {
   coords 0 0 0
   {
    $grp GenericEntity : "${K.SLOTMARKER_PREFAB}" {
${slotBlocks}
    }
   }
  }
 }
}
`;
  }

  // --- Sectors (TS_MapOverlay rectangles), appended top-level to Markers.layer ---
  // ONE $grp of anonymous prefab instances — plain world entities, no SF Area
  // wrapper and no entity names (matching hand-placed missions). AO = pure
  // prefab defaults (black outline, dark fill OUTSIDE); objective = red
  // override. Rect size = per-instance ShapePoint Position overrides via the
  // prefab's fixed point GUIDs (±length/2 on X, ±width/2 on Z); point Y is
  // irrelevant to the map draw and written as 0.
  const missionSectors = mission.sectors ?? [];
  if (missionSectors.length) {
    const sectorInstances = missionSectors
      .map((s) => {
        const comp =
          s.kind === "objective"
            ? `
  components {
   TS_MapOverlayComponent "${K.CMP_MAPOVERLAY}" {
    m_FillColor 0.623957 0.155932 0.155932 0.094118
    m_OutlineColor 0.623529 0.156863 0.156863 1
    m_OutlineWidth 2
    m_FillOutside 0
   }
  }`
            : "";
        const yaw = +(((s.rotation ?? 0) % 360).toFixed(1));
        const angles = yaw ? `\n  angles 0 ${yaw} 0` : "";
        const pts = K.MAPOVERLAY_POINTS.map(
          (p) =>
            `   ShapePoint "${p.guid}" {\n    Position ${+((p.sx * s.length) / 2).toFixed(3)} 0 ${+((p.sz * s.width) / 2).toFixed(3)}\n   }`
        ).join("\n");
        return ` {${comp}\n  coords ${posStr(s.pos)}${angles}\n  Points {\n${pts}\n  }\n }`;
      })
      .join("\n");
    markersLayer += `$grp PolylineShapeEntity : "${K.MAPOVERLAY_PREFAB}" {\n${sectorInstances}\n}\n`;
  }

  // --- QRF.layer ---
  // Reinforcement origins → TS_QRFSpawnAnchor marker entities, ONE $grp of
  // anonymous instances (Operation Choripan pattern: coords then
  // m_sAnchorGroup). The group key pairs each anchor with its zone+module
  // plugin — the 5000 m anchor sphere query would otherwise cross-match
  // neighboring zones' origins.
  let qrfLayer = "";
  {
    const anchors = [];
    mission.zones.forEach((z, i) => {
      const zoneName = z.name ?? `Area${i + 1}`;
      for (const p of z.plugins) {
        if (!isQrfModule(p)) continue;
        for (const o of p.origins ?? []) {
          anchors.push({ pos: o, group: qrfAnchorGroup(zoneName, moduleKind(p)) });
        }
      }
    });
    if (anchors.length) {
      qrfLayer =
        `$grp TS_QRFSpawnAnchor : "${K.QRF_ANCHOR_PREFAB}" {\n` +
        anchors.map((a) => ` {\n  coords ${posStr(a.pos)}\n  m_sAnchorGroup "${a.group}"\n }`).join("\n") +
        `\n}\n`;
    }
  }

  // --- Objectives.layer ---
  // Real SF tasks (LayerTask* + Slot*), one Area wrapping all objectives.
  // Dynamic despawn stays OFF (LayerBase default) — mission-critical entities
  // exist from session start and never despawn. Task ID = the LayerTask
  // entity's world name (must be world-globally unique; SCR_TaskSystem rejects
  // duplicates). m_eTaskUIVisibility LIST_ONLY = task-list entry WITHOUT a map
  // marker, so objective positions stay hidden (m_fMarkerUpdateInterval keeps
  // its default 0 — nothing tracks a moving HVT). Completion is auto-detected
  // by each m_sTaskPrefab's Task class (Kill: damage-state hook; Move/Clear:
  // trigger OnActivate) and fires the custom ShowHint via
  // m_aTriggerActionsOnFinish. m_sFactionKey MUST be a playable faction or
  // task creation fails at Init.
  let objectivesLayer = "";
  // Destroy-target override prefabs (Prefabs/DestroyTargets/Dest_<name>.et):
  // vanilla prop destruction is disabled engine-wide (Enabled 0 in
  // DestructionMultiPhase_Base.ct) — DESTROY_OBJECTS entries with a `fix`
  // descriptor get a mission-local child prefab of their E_ variant that
  // flips the multiphase component back on (component-instance GUID reused
  // from the base chain, per the standard override rule). GUIDs and content
  // are fixed in the catalogue, so every generated mission ships identical
  // files — path collisions across mission addons are byte-identical, the
  // same collide-by-design pattern as the loadout conf overrides.
  const destroyTargetFiles = {};
  const missionObjectives = mission.objectives ?? [];
  if (missionObjectives.length) {
    const playableKey = effKey(mission.playableFaction);
    // ShowHint m_sText supports <br/> markup; literal newlines would break the
    // .layer file. Quotes escape to ' like all other user text we serialize.
    const escObjText = (s) => String(s ?? "").replace(/"/g, "'").replace(/\r?\n/g, "<br/>");
    const showHint = (o) => `     m_aTriggerActionsOnFinish {
      SCR_ScenarioFrameworkActionShowHint "{${mintGuid()}}" {
       m_iMaxNumberOfActivations 1
       m_sTitle "${escObjText(o.hintTitle)}"
       m_sText "${escObjText(o.hintBody)}"
       m_iTimeout 8
       m_sFactionKey "${playableKey}"
      }
     }`;
    // m_eTaskNotificationSettings 0 suppresses the vanilla task popups
    // (created/finished/failed — default is ALL flags): they'd duplicate our
    // hint, and SCR_PopUpNotification has queue/stacking bugs (toolkit rule:
    // hints over popups).
    const taskFields = (o) => `     m_sFactionKey "${playableKey}"
     m_sTaskTitle "${escObjText(o.taskTitle)}"
     m_sTaskDescription "${escObjText(o.taskDesc)}"
     m_eTaskUIVisibility LIST_ONLY
     m_eTaskNotificationSettings 0
${showHint(o)}`;
    const radiusOf = (o) => {
      const def = OBJECTIVE_TYPES.find((t) => t.type === o.type)?.radius;
      return Math.round(o.radius ?? def?.default ?? 25);
    };
    const avg = (idx) => missionObjectives.reduce((s, o) => s + o.pos[idx], 0) / missionObjectives.length;
    const origin = [+avg(0).toFixed(3), +avg(1).toFixed(3), +avg(2).toFixed(3)];

    const objectiveBlocks = missionObjectives
      .map((o, i) => {
        const n = i + 1;
        let layerPrefab, cmpClass, cmpGuid, slotBlock;
        // The LayerTask entity's world position — objective pos for most
        // types; the deliver branch moves it to the delivery point.
        let layerPos = o.pos;
        if (o.type === "hvt") {
          const hvtRef = ENEMY.hvt;
          if (!hvtRef) throw new Error(`No HVT character for faction ${mission.enemyFaction}`);
          layerPrefab = K.LAYERTASK_KILL_PREFAB;
          cmpClass = "SCR_ScenarioFrameworkLayerTaskKill";
          cmpGuid = K.CMP_LT_KILL;
          // m_bCanBeGarbageCollected 0: an unprotected spawned character far
          // from players gets garbage-collected -> objective uncompletable.
          // HideInBuilding (toolkit): relocates the spawned officer into the
          // nearest building within 75 m (sentinel post, else navmesh-validated
          // interior position) after spawn — the SLOT stays the spawner so the
          // task's kill hook is unaffected; no building -> stays at the slot.
          slotBlock = `    GenericEntity SlotObjective${n} : "${K.SLOT_KILL_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotKill "${K.CMP_SLOT_KILL}" {
       m_aPlugins {
        TS_ScenarioFrameworkPluginHideInBuilding "{${mintGuid()}}" {
        }
       }
       m_sObjectToSpawn "${hvtRef}"
       m_bCanBeGarbageCollected 0
      }
     }
     coords 0 0 0
    }`;
        } else if (o.type === "reach") {
          layerPrefab = K.LAYERTASK_MOVE_PREFAB;
          cmpClass = "SCR_ScenarioFrameworkLayerTask";
          cmpGuid = K.CMP_LT_MOVE;
          // PLAYER presence is required — the trigger prefab default is
          // ANY_CHARACTER (wandering AI would complete the objective).
          slotBlock = `    GenericEntity SlotObjective${n} : "${K.SLOT_MOVETO_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotExtraction "${K.CMP_SLOT_MOVETO}" {
       m_aPlugins {
        SCR_ScenarioFrameworkPluginTrigger "${K.CMP_PLUGINTRIG_MOVETO}" {
         m_fAreaRadius ${radiusOf(o)}
         m_eActivationPresence PLAYER
         m_sActivatedByThisFaction "${playableKey}"
        }
       }
      }
     }
     coords 0 0 0
    }`;
        } else if (o.type === "clear") {
          layerPrefab = K.LAYERTASK_CLEAR_PREFAB;
          cmpClass = "SCR_ScenarioFrameworkLayerTaskClearArea";
          cmpGuid = K.CMP_LT_CLEAR;
          // m_sObjectToSpawn is overridden from the slot default
          // (TriggerDominance) to the SF TriggerCharacterSlow: the dominance
          // trigger silently ignores every PluginTrigger field except radius +
          // faction (its 0.528 ratio would complete with enemies still alive).
          // The FactionControl condition counts trigger.GetEntitiesInside() —
          // so the trigger MUST track ALL characters: ANY_CHARACTER presence
          // (explicit — the plugin default is PLAYER and is pushed onto the
          // trigger) and NO m_sActivatedByThisFaction (an owner faction drops
          // everyone else from the inside-list; either mistake makes the ratio
          // 1.0 the moment a player steps in — playtest-caught 2026-07-31).
          // Net semantics: >=1 alive character inside AND every non-CIV
          // character inside is playable-faction. The 5 s countdown is dwell
          // time so a drive-by flicker can't complete the objective.
          slotBlock = `    GenericEntity SlotObjective${n} : "${K.SLOT_CLEAR_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotClearArea "${K.CMP_SLOT_CLEAR}" {
       m_aPlugins {
        SCR_ScenarioFrameworkPluginTrigger "${K.CMP_PLUGINTRIG_CLEAR}" {
         m_fAreaRadius ${radiusOf(o)}
         m_eActivationPresence ANY_CHARACTER
         m_aCustomTriggerConditions {
          SCR_CustomTriggerConditionsFactionControl "{${mintGuid()}}" {
           m_aControlFactionKeys {
            "${playableKey}"
           }
           m_aIgnoredFactionKeys {
            "CIV"
           }
           m_eComparisonOperator GREATER_OR_EQUAL
           m_fControlRatio 1
          }
         }
         m_fActivationCountdownTimer 5
        }
       }
       m_sObjectToSpawn "${K.TRIGGER_CHARACTER_SLOW}"
      }
     }
     coords 0 0 0
    }`;
        } else if (o.type === "deliver") {
          // Vehicle-delivery: the LayerTask sits at the DELIVERY point (its
          // SlotMoveTo trigger completes the task when the chosen vehicle
          // prefab is inside); the vehicle itself spawns from a plain
          // SlotBase child at the objective position. Serialization mirrors
          // the vanilla TaskDeliverVehicles.et reference composition.
          if (!o.objectRef) throw new Error(`Deliver objective without objectRef`);
          if (!o.delivery) throw new Error(`Deliver objective without a delivery point`);
          const deliveryDef = OBJECTIVE_TYPES.find((t) => t.type === "deliver").deliveryRadius;
          const dRadius = Math.round(o.deliveryRadius ?? deliveryDef.default);
          layerPrefab = K.LAYERTASK_MOVE_PREFAB;
          cmpClass = "SCR_ScenarioFrameworkLayerTask";
          cmpGuid = K.CMP_LT_MOVE;
          // The layer's coords (rel, computed below) must be the DELIVERY
          // point; the vehicle slot is offset back to the objective position.
          layerPos = o.delivery;
          const vRel = posStr([
            o.pos[0] - o.delivery[0],
            o.pos[1] - o.delivery[1],
            o.pos[2] - o.delivery[2],
          ]);
          slotBlock = `    GenericEntity SlotObjective${n} : "${K.SLOT_MOVETO_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotExtraction "${K.CMP_SLOT_MOVETO}" {
       m_aPlugins {
        SCR_ScenarioFrameworkPluginTrigger "${K.CMP_PLUGINTRIG_MOVETO}" {
         m_fAreaRadius ${dRadius}
         m_eActivationPresence SPECIFIC_PREFAB_NAME
         m_aCustomTriggerConditions {
          SCR_CustomTriggerConditionsSpecificPrefabCount "{${mintGuid()}}" {
           m_aPrefabFilter {
            SCR_ScenarioFrameworkPrefabFilterCount "{${mintGuid()}}" {
             m_sSpecificPrefabName "${o.objectRef}"
             m_bIncludeChildren 1
            }
           }
          }
         }
        }
       }
      }
     }
     coords 0 0 0
    }
    GenericEntity SlotObjective${n}Vehicle : "${K.SLOT_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotBase "${K.CMP_SF_SLOT}" {
       m_sObjectToSpawn "${o.objectRef}"
       m_bCanBeGarbageCollected 0
      }
     }
     coords ${vRel}
    }`;
        } else if (o.type === "destroy") {
          // objectRef = any prefab whose ROOT carries a damage manager
          // (DESTROY_OBJECTS pool or a faction vehicle — BaseVehicle has its
          // own GetDamageManager fast path). SCR_TaskDestroyObject hooks the
          // damage state; no plugins needed. GC protection like the HVT.
          // objectRef stays the STORED identity; what spawns is resolved via
          // the catalogue: fix -> mission-local destruction-enabled prefab,
          // spawnRef -> the GM-editable E_ variant, else objectRef as-is
          // (mortars, vehicles).
          if (!o.objectRef) throw new Error(`Destroy objective without objectRef`);
          const dEntry = DESTROY_OBJECTS.find((d) => d.ref === o.objectRef);
          let dSpawn = o.objectRef;
          if (dEntry?.fix) {
            const baseName = dEntry.spawnRef.split("/").pop().replace(/^E_/, "");
            const dPath = `Prefabs/DestroyTargets/Dest_${baseName}`;
            destroyTargetFiles[dPath] = {
              guid: dEntry.fix.guid,
              content: `${dEntry.fix.cls} : "${dEntry.spawnRef}" {
 ID "${dEntry.fix.id}"
 components {
  SCR_DestructionMultiPhaseComponent "${dEntry.fix.cmp}" {
   Enabled 1${dEntry.fix.body ?? ""}
  }
 }
}
`,
            };
            dSpawn = `{${dEntry.fix.guid}}${dPath}`;
          } else if (dEntry?.spawnRef) {
            dSpawn = dEntry.spawnRef;
          }
          layerPrefab = K.LAYERTASK_DESTROY_PREFAB;
          cmpClass = "SCR_ScenarioFrameworkLayerTaskDestroy";
          cmpGuid = K.CMP_LT_DESTROY;
          slotBlock = `    GenericEntity SlotObjective${n} : "${K.SLOT_DESTROY_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotDestroy "${K.CMP_SLOT_DESTROY}" {
       m_sObjectToSpawn "${dSpawn}"
       m_bCanBeGarbageCollected 0
      }
     }
     coords 0 0 0
    }`;
        } else {
          throw new Error(`Unknown objective type: ${o.type}`);
        }
        const rel = posStr([layerPos[0] - origin[0], layerPos[1] - origin[1], layerPos[2] - origin[2]]);
        return `  GenericEntity Task_Objective${n} : "${layerPrefab}" {
   components {
    ${cmpClass} "${cmpGuid}" {
${taskFields(o)}
    }
   }
   coords ${rel}
   {
${slotBlock}
   }
  }`;
      })
      .join("\n");

    objectivesLayer = `GenericEntity AreaObjectives : "${K.AREA_PREFAB}" {
 components {
  SCR_ScenarioFrameworkArea "${K.CMP_SF_AREA}" {
  }
 }
 coords ${posStr(origin)}
 {
${objectiveBlocks}
 }
}
`;
  }

  const layersDir = `Worlds/${mission.name}_Layers`;
  const files = {
    "addon.gproj": gproj,
    [`Worlds/${mission.name}.ent`]: worldEnt,
    [`Worlds/${mission.name}.ent.meta`]: meta("ENTResourceClass", guids.world, `Worlds/${mission.name}.ent`),
    [`Missions/${mission.name}.conf`]: missionConf,
    [`Missions/${mission.name}.conf.meta`]: meta("CONFResourceClass", guids.missionConf, `Missions/${mission.name}.conf`),
    [K.LOADOUT_CONF_PATH]: loadoutConfOverride,
    [`${K.LOADOUT_CONF_PATH}.meta`]: meta("CONFResourceClass", K.LOADOUT_CONF_GUID, K.LOADOUT_CONF_PATH),
    [K.CRATE_PATH]: crateOverride,
    [`${K.CRATE_PATH}.meta`]: meta("EntityTemplateResourceClass", K.CRATE_GUID, K.CRATE_PATH),
    [K.ARSENAL_PATH]: arsenalOverride,
    [`${K.ARSENAL_PATH}.meta`]: meta("CONFResourceClass", K.ARSENAL_GUID, K.ARSENAL_PATH),
    [K.BRIEFING_PATH]: briefingOverride,
    [`${K.BRIEFING_PATH}.meta`]: meta("CONFResourceClass", K.BRIEFING_GUID, K.BRIEFING_PATH),
    [`${layersDir}/default.layer`]: defaultLayer,
    [`${layersDir}/Spawn.layer`]: spawnLayer,
    [`${layersDir}/AO.layer`]: aoLayer,
    [`${layersDir}/Markers.layer`]: markersLayer,
    [`${layersDir}/QRF.layer`]: qrfLayer,
    [`${layersDir}/Objectives.layer`]: objectivesLayer,
    [`${layersDir}/Props.layer`]: "",
  };

  for (const [dPath, d] of Object.entries(destroyTargetFiles)) {
    files[dPath] = d.content;
    files[`${dPath}.meta`] = meta("EntityTemplateResourceClass", d.guid, dPath);
  }

  // The .png/.edds binaries come from the browser (canvas); here we only add
  // the sidecar that gives the pair its stable resource GUID.
  if (mission.thumbnail) files[`${thumbPath}.meta`] = textureMeta(guids.thumbnail, thumbPath);

  return { files, guids, addonDirName: mission.dirName ?? mission.addonId };
}
