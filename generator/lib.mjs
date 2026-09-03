// Mission addon generator library — pure functions, runs in Node or the browser.
// buildMissionFiles(mission) -> { files: { relPath: content }, addonDirName }
//
// All GUIDs ground-truthed from TS Mission Toolkit / vanilla data / production ops.
// See CLAUDE.md "Validated architecture facts" before changing formats.

import { TERRAINS, FACTIONS, MODS, K, ZONE_MODULES, OBJECTIVE_TYPES, DESTROY_OBJECTS, PROPS, PROP_CATEGORIES, DEFAULT_PROP, ARSENAL_POOL, MOD_ARSENAL_POOLS, CORE_ADDONS, CORE_ARSENAL_POOL, CORE_ARSENAL_ITEMS, resolveGroupPool, resolveSentryPool, resolveDefenseGroup, resolvePropDefenseGroup } from "./catalogue.mjs";
import { layoutSpawnBundle, rotateLocal, ELEMENT_SIZES, SLOT, vehicleSizeClass } from "./layout.mjs";
export { TERRAINS, FACTIONS, MODS, K, ZONE_MODULES, OBJECTIVE_TYPES, DESTROY_OBJECTS, PROPS, PROP_CATEGORIES, DEFAULT_PROP, ARSENAL_POOL, MOD_ARSENAL_POOLS, CORE_ADDONS, CORE_ARSENAL_POOL, CORE_ARSENAL_ITEMS, resolveGroupPool, resolveSentryPool, resolveDefenseGroup, resolvePropDefenseGroup };
export { layoutSpawnBundle, rotateLocal, itemWorldCorners, vehicleWorldOutline, vehicleSizeClass, ELEMENT_SIZES, FARP_DETAIL, spawnElements, spawnElementsBounds, rectsOverlap, autoPlaceSpawnElement } from "./layout.mjs";

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

// Enemy AI artillery: TS_AiArtilleryComponent override on the same GameModeSF
// entity. m_bEnabled defaults to 0 in script (the prefab doesn't set it), so
// a disabled toggle = no block at all. Fields are written only when they
// differ from the prefab-effective values (rounds 60, cooldown 600/1800 s;
// strike chance keeps its script default 0.6). The web UI sends a single
// cooldown as equal min/max seconds; the generator input keeps them separate.
// mission.aiArty = { rounds, strikeChance (0..1), cooldownMin, cooldownMax,
// stopTriggers } or null/undefined = off.
function aiArtilleryBlock(a) {
  if (!a) return "";
  let f = "";
  const rounds = Math.max(1, Math.floor(a.rounds ?? 60));
  if (rounds !== 60) f += `
   m_iRoundsAvailable ${rounds}`;
  const chance = +Math.max(0, Math.min(1, a.strikeChance ?? 0.6)).toFixed(2);
  if (chance !== 0.6) f += `
   m_fStrikeChance ${chance}`;
  const cdMin = Math.max(0, Math.round(a.cooldownMin ?? 600));
  const cdMax = Math.max(cdMin, Math.round(a.cooldownMax ?? cdMin));
  if (cdMin !== 600) f += `
   m_iCooldownMin ${cdMin}`;
  if (cdMax !== 1800) f += `
   m_iCooldownMax ${cdMax}`;
  return `
  TS_AiArtilleryComponent "${K.CMP_AI_ARTILLERY}" {
   m_bEnabled 1${f}
  }`;
}

export function buildMissionFiles(mission, options = {}) {
  const F = FACTIONS[mission.playableFaction];
  const ENEMY = FACTIONS[mission.enemyFaction];
  const TERRAIN = TERRAINS[mission.terrain];
  if (!F) throw new Error(`Unknown playable faction: ${mission.playableFaction}`);
  if (!ENEMY) throw new Error(`Unknown enemy faction: ${mission.enemyFaction}`);
  if (ENEMY.playableOnly) throw new Error(`Faction ${mission.enemyFaction} is playable-only and can't be the enemy side`);
  if (!TERRAIN) throw new Error(`Unknown terrain: ${mission.terrain}`);
  const RIFLEMAN = F.riflemen[mission.playableSubfaction];
  if (!RIFLEMAN) throw new Error(`No rifleman for ${mission.playableFaction}/${mission.playableSubfaction}`);

  // Alias factions (aliasOf) are UI-level entries over a vanilla faction —
  // every serialized faction KEY must be the base's in-game key (SFS_US → US).
  const effKey = (k) => FACTIONS[k].aliasOf ?? k;
  // Both sides resolving to one in-game faction (e.g. SFS_US vs US) means the
  // "enemy" AI is friendly to the players — the UI blocks it, this is the backstop
  if (effKey(mission.playableFaction) === effKey(mission.enemyFaction))
    throw new Error(
      `Playable (${mission.playableFaction}) and enemy (${mission.enemyFaction}) sides both resolve to in-game faction ${effKey(mission.playableFaction)}`
    );

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
  // Arsenal Builder: user-picked mod items pull their mod's deps too (usage-
  // derived, same philosophy) — but NOT its FactionManager emission (arsenal
  // usage alone doesn't put the mod's factions in the mission).
  const arsenalRefSet = new Set(
    (Array.isArray(mission.arsenal) ? mission.arsenal : []).map((e) => (e && typeof e === "object" ? e.ref : e))
  );
  // Mod pools list shared VANILLA prefabs alongside their own (RHS lists the
  // vanilla PM, UK the ALICE packs…) — only refs the vanilla pool does NOT
  // own establish a real dependency on the mod.
  const vanillaRefs = new Set(ARSENAL_POOL.map((i) => i.ref));
  const arsenalMods = Object.entries(MOD_ARSENAL_POOLS)
    .filter(([, pool]) => pool.some((i) => arsenalRefSet.has(i.ref) && !vanillaRefs.has(i.ref)))
    .map(([id]) => id);
  // Core addons (ACE Medical) are mandatory for every mission — listed right
  // after the toolkit, ahead of the usage-derived deps.
  const modDeps = [
    ...new Set([
      ...CORE_ADDONS.map((a) => a.guid),
      ...usedMods.flatMap((id) => MODS[id].dependencies),
      ...arsenalMods.flatMap((id) => MODS[id].dependencies),
      ...(TERRAIN.dependencies ?? []),
    ]),
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
   "faction affiliation" "${effKey(mission.playableFaction)}"
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
  // mission.arsenal (ordered refs from the Arsenal Builder) overrides the baked
  // set; modes resolve from ARSENAL_POOL with the baked entries winning (keeps
  // mod-faction refs + curated modes authoritative). Min 1 item: an empty
  // override array would leave the base conf's ref-less placeholder member
  // (conf arrays merge by member GUID). CORE_ARSENAL_ITEMS (ACE Medical
  // epinephrine) close every faction's baked set.
  const bakedArsenal = [...F.arsenalItems, ...(F.subfactionArsenalItems?.[mission.playableSubfaction] ?? []), ...CORE_ARSENAL_ITEMS];
  let arsenalList;
  if (Array.isArray(mission.arsenal)) {
    if (!mission.arsenal.length) throw new Error("mission.arsenal must contain at least one item");
    const modeByRef = new Map();
    for (const it of ARSENAL_POOL) modeByRef.set(it.ref, it.mode);
    for (const pool of Object.values(MOD_ARSENAL_POOLS)) for (const it of pool) modeByRef.set(it.ref, it.mode);
    for (const it of CORE_ARSENAL_POOL) modeByRef.set(it.ref, it.mode);
    for (const it of bakedArsenal) modeByRef.set(it.ref, it.mode);
    arsenalList = mission.arsenal.map((entry) => {
      // {mode, ref} objects carry an explicit mode (CLI spikes, e.g. --thumbs
      // forcing WEAPON_VARIANTS flat); the web app always sends bare refs.
      if (entry && typeof entry === "object") return { mode: entry.mode ?? "", ref: entry.ref };
      if (!modeByRef.has(entry)) throw new Error(`unknown arsenal item ref: ${entry}`);
      return { mode: modeByRef.get(entry), ref: entry };
    });
  } else {
    arsenalList = bakedArsenal;
  }
  const arsenalItems = arsenalList
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
    if (key !== effKey(mission.playableFaction))
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

  // Terrains whose bare world lacks an SCR_MapEntity (Merak) get one emitted
  // here, mirroring the map addon's own GM-world setup — the deploy menu
  // hard-requires it ("Map entity is missing in the world!" VME).
  const mapEntityBlock = TERRAIN.mapEntity
    ? `SCR_MapEntity MapEntity : "{731564B66F91B107}Prefabs/World/Game/MapEntity.et" {
 coords ${mgr(-20, 0, -21)}
 "Map Geometry Data" "${TERRAIN.mapEntity.topo}"
 "Satellite background image" "${TERRAIN.mapEntity.satellite}"
}
`
    : "";

  const defaultLayer = `${mapEntityBlock}${TERRAIN.parentHasAIWorld ? "" : `SCR_AIWorld SCR_AIWorld : "{E0A05C76552E7F58}Prefabs/AI/SCR_AIWorld.et" {
 components {
${navBlocks}
 }
 coords ${mgr(-20, 0, -20)}
}
`}${TERRAIN.parentHasPerceptionManager ? "" : `PerceptionManager PerceptionManager : "{028DAEAD63E056BE}Prefabs/World/Game/PerceptionManager.et" {
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
${TERRAIN.parentHasRadioManager ? "" : `RadioManagerEntity RadioManager : "{B8E09FAB91C4ECCD}Prefabs/Systems/Radio/RadioManager.et" {
 coords ${mgr(-20, 0, -19)}
}
`}SCR_BaseGameMode GameModeSF : "{ECEEDB2D3737204B}Prefabs/Systems/ScenarioFramework/GameModeSF.et" {
 components {
  SCR_RespawnSystemComponent "{56B2B4793051E7C9}" {
   m_SpawnLogic SCR_MenuSpawnLogic "{5D36888CC966608A}" {
   }
  }${fireSupportBlock(mission.arty)}${aiArtilleryBlock(mission.aiArty)}
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
   m_sAffiliatedFaction "${effKey(mission.playableFaction)}"
  }
  SCR_FactionPlayerLoadout "${K.LM_RIFLEMAN_LOADOUT}" {
   m_sLoadoutResource "${RIFLEMAN}"
   m_sAffiliatedFaction "${effKey(mission.playableFaction)}"
  }
 }
}
`;

  // --- Spawn.layer ---
  // Two input shapes:
  //  - POSITIONED (web since 2026-08-18, detected by spawn.crates being an
  //    array): per-element absolute world coords + compass rotation
  //    { pos, farp, farpPos, farpRotation, spawnPoint, crates: [{pos,rotation}],
  //    vehicles: [{type,pos,rotation}] }. Every element (FARP included)
  //    samples its own terrain Y.
  //  - LEGACY (CLI spikes): { pos, yaw, farp, vehicles: [{type}] } — positions
  //    come from the shared bundle layout engine (layout.mjs) and the whole
  //    bundle rotates around the spawn origin by spawn.yaw. Output is
  //    byte-identical to the pre-free-placement generator.
  // With no options.sampleY (heightmap), Ys fall back to the origin's Y.
  const originY = base[1];
  const sampleYFn = options.sampleY;
  const yAt = (wx, wz) => {
    if (!sampleYFn) return originY;
    const y = sampleYFn(wx, wz);
    return Number.isFinite(y) ? y : originY;
  };

  // Terrain tilt, shared by positioned spawn elements and props (the sign
  // convention was ground-truthed in the props section — see the comment
  // there): pitch = +atan(slope along local +Z), roll = −atan(slope along
  // local +X), lever arms = footprint half-extents (min 2 m), clamped ±30°.
  // Slot-spawned objects inherit the slot's FULL orientation
  // (SCR_ScenarioFrameworkSlotBase.SpawnAsset copies the owner's world
  // transform through a MatrixToAngles round-trip), so slot pitch/roll
  // reaches the spawned crate/vehicle.
  const terrainTilt = (wx, wz, yawDeg, dR, dF) => {
    if (!sampleYFn) return [0, 0];
    const th = (yawDeg * Math.PI) / 180;
    const fwd = [Math.sin(th), Math.cos(th)];
    const right = [Math.cos(th), -Math.sin(th)];
    const at = (v, k) => {
      const y = sampleYFn(wx + v[0] * k, wz + v[1] * k);
      return Number.isFinite(y) ? y : null;
    };
    const f1 = at(fwd, dF), f0 = at(fwd, -dF), r1 = at(right, dR), r0 = at(right, -dR);
    if (f1 === null || f0 === null || r1 === null || r0 === null) return [0, 0];
    const clamp = (v) => Math.max(-30, Math.min(30, +v.toFixed(1)));
    return [clamp((Math.atan2(f1 - f0, 2 * dF) * 180) / Math.PI), clamp((-Math.atan2(r1 - r0, 2 * dR) * 180) / Math.PI)];
  };

  // m_bCanBeGarbageCollected 0 on every crate/vehicle slot (2026-08-20): the
  // engine garbage collector treats parked player vehicles as abandoned and
  // despawns them mid-mission; base equipment must live for the whole session
  // (same protection as the HVT/destroy objective slots).
  const slotBlockRel = (name, objectRef, dx, relY, dz, slotYaw, pitch = 0, roll = 0) => {
    const angles = pitch || slotYaw || roll ? `\n     angles ${pitch} ${slotYaw} ${roll}` : "";
    return `    GenericEntity ${name} : "${K.SLOT_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotBase "${K.CMP_SF_SLOT}" {
       m_sObjectToSpawn "${objectRef}"
       m_bCanBeGarbageCollected 0
      }
     }
     coords ${+dx.toFixed(3)} ${relY} ${+dz.toFixed(3)}${angles}
    }`;
  };

  let crateSlots;
  let vehicleSlots;
  let farpBlock;
  let spawnPointBlock;

  if (Array.isArray(mission.spawn.crates)) {
    // Positioned shape
    const sp = mission.spawn;
    const rot = (r) => +(((((r ?? 0) % 360) + 360) % 360).toFixed(1));
    // Crates/vehicles/FARP tilt to the terrain like props do; the spawn
    // point stays plumb (invisible marker).
    const slotAbs = (name, objectRef, pos, rotation, size, yLift = 0) => {
      const relY = +(yAt(pos[0], pos[1]) - originY + yLift).toFixed(3);
      const yaw = rot(rotation);
      const [pitch, roll] = terrainTilt(pos[0], pos[1], yaw, Math.max(2, size.w / 2), Math.max(2, size.len / 2));
      return slotBlockRel(name, objectRef, pos[0] - base[0], relY, pos[1] - base[2], yaw, pitch, roll);
    };
    if (!sp.crates.length) {
      // Min 1 crate — the loadout/arsenal systems live on the crate (UI enforces
      // this; reaching here means a hand-built input).
      throw new Error("spawn.crates must contain at least 1 crate");
    }
    crateSlots = sp.crates
      .map((c, i) => slotAbs(`SlotCrate${i + 1}`, `{${K.CRATE_GUID}}${K.CRATE_PATH}`, c.pos, c.rotation, ELEMENT_SIZES.crate))
      .join("\n");
    vehicleSlots = (sp.vehicles ?? [])
      .map((v, i) => {
        const ref = F.vehicles[v.type];
        if (!ref) throw new Error(`No vehicle GUID for ${mission.playableFaction}/${v.type}`);
        // +20 cm so physics settles the vehicle down instead of it clipping
        // into a terrain undulation between tilt sample points
        return slotAbs(`SlotVehicle${i + 1}`, ref, v.pos, v.rotation, SLOT[vehicleSizeClass(v.type)], 0.2);
      })
      .join("\n");
    // The FARP composition is authored 90° CW of our map footprint — the
    // emitted yaw carries the offset (map UI stays as-is); the tilt frame
    // follows it, so the lever arms swap (local Z spans the map rect's w).
    const farpYaw = rot((sp.farpRotation ?? 0) + 90);
    const [farpPitch, farpRoll] = sp.farp
      ? terrainTilt(sp.farpPos[0], sp.farpPos[1], farpYaw, ELEMENT_SIZES.farp.len / 2, ELEMENT_SIZES.farp.w / 2)
      : [0, 0];
    const farpAngles = farpPitch || farpYaw || farpRoll ? ` angles ${farpPitch} ${farpYaw} ${farpRoll}\n` : "";
    farpBlock = sp.farp
      ? `GenericEntity : "${K.FARP_COMP}" {\n coords ${+sp.farpPos[0].toFixed(3)} ${+yAt(sp.farpPos[0], sp.farpPos[1]).toFixed(3)} ${+sp.farpPos[1].toFixed(3)}\n${farpAngles}}\n`
      : "";
    // Spawn points are move-only by design — no angles, ever. Deny-only
    // per-squad filtering (toolkit TS_SpawnPointGroupFilter, modded
    // SCR_SpawnPoint): each point may carry m_aTS_DeniedGroupNames as an
    // ENTITY-LEVEL property (script-injected attribute — no component, no
    // GUIDs). The runtime matches the squad CALLSIGN exactly and
    // case-sensitively, which is gname()'s output (generated missions never
    // emit m_sGroupName) — so denied names MUST be resolved here from squad
    // indices, never web-side. Empty arrays are OMITTED (both-empty = open to
    // everyone incl. in-game custom groups), so a single all-allowed point is
    // byte-identical to the classic output. Multiple points use the $grp
    // form: first body anonymous, later bodies named SpawnPoint2..N
    // (serialization ground truth: Posredniki_war Spawn.layer).
    const spPts = Array.isArray(sp.spawnPoints) && sp.spawnPoints.length
      ? sp.spawnPoints
      : [{ pos: sp.spawnPoint, denied: [] }];
    const deniedNames = (p) => {
      const idx = [...new Set((p.denied ?? []).filter((i) => Number.isInteger(i) && i >= 0 && i < groups.length))];
      const allowedNames = new Set(groups.map((g, i) => (idx.includes(i) ? null : gname(g, i))).filter(Boolean));
      // Duplicate squad names: denying the shared name would also strand the
      // same-named ALLOWED squad — fail OPEN (omit the name).
      return [...new Set(idx.map((i) => gname(groups[i], i)))].filter((n) => !allowedNames.has(n));
    };
    const spCoords = (p) => `coords ${+p.pos[0].toFixed(3)} ${+yAt(p.pos[0], p.pos[1]).toFixed(3)} ${+p.pos[1].toFixed(3)}`;
    const deniedBlock = (names, pad) =>
      names.length
        ? `\n${pad}m_aTS_DeniedGroupNames {\n${names.map((n) => `${pad} "${n}"`).join("\n")}\n${pad}}`
        : "";
    spawnPointBlock =
      spPts.length === 1
        ? `SCR_SpawnPoint : "${F.spawnPoint}" {\n ${spCoords(spPts[0])}${deniedBlock(deniedNames(spPts[0]), " ")}\n}`
        : `$grp SCR_SpawnPoint : "${F.spawnPoint}" {\n` +
          spPts
            .map((p, i) => ` ${i === 0 ? "" : `SpawnPoint${i + 1} `}{\n  ${spCoords(p)}${deniedBlock(deniedNames(p), "  ")}\n }`)
            .join("\n") +
          `\n}`;
  } else {
    // Legacy shape
    const bundleYaw = +((mission.spawn.yaw ?? 0) % 360).toFixed(1);
    const layout = layoutSpawnBundle(mission.spawn);
    const localToWorld = (lx, lz) => {
      const [dx, dz] = rotateLocal(lx, lz, bundleYaw);
      return [base[0] + dx, base[2] + dz, dx, dz];
    };
    const slotBlock = (name, objectRef, item) => {
      const [wx, wz, dx, dz] = localToWorld(item.x, item.z);
      const relY = +(yAt(wx, wz) - originY).toFixed(3);
      const slotYaw = +(((bundleYaw + (item.yaw ?? 0)) % 360).toFixed(1));
      return slotBlockRel(name, objectRef, dx, relY, dz, slotYaw);
    };
    const crateItem = layout.items.find((it) => it.kind === "crate");
    const spawnPointItem = layout.items.find((it) => it.kind === "spawnPoint");
    crateSlots = slotBlock("SlotCrate", `{${K.CRATE_GUID}}${K.CRATE_PATH}`, crateItem);
    vehicleSlots = layout.items
      .filter((it) => it.kind === "vehicle")
      .map((it, i) => {
        const ref = F.vehicles[it.type];
        if (!ref) throw new Error(`No vehicle GUID for ${mission.playableFaction}/${it.type}`);
        return slotBlock(`SlotVehicle${i + 1}`, ref, it);
      })
      .join("\n");
    farpBlock = mission.spawn.farp
      ? `GenericEntity : "${K.FARP_COMP}" {\n coords ${+base[0].toFixed(3)} ${+originY.toFixed(3)} ${+base[2].toFixed(3)}\n angles 0 ${bundleYaw} 0\n}\n`
      : "";
    const [spX, spZ] = localToWorld(spawnPointItem.x, spawnPointItem.z);
    spawnPointBlock = `SCR_SpawnPoint : "${F.spawnPoint}" {
 coords ${+spX.toFixed(3)} ${+yAt(spX, spZ).toFixed(3)} ${+spZ.toFixed(3)}
}`;
  }

  const spawnLayer = `${spawnPointBlock}
GenericEntity AreaSpawn : "${K.AREA_PREFAB}" {
 coords ${+base[0].toFixed(3)} ${+originY.toFixed(3)} ${+base[2].toFixed(3)}
 {
  GenericEntity LayerCrates : "${K.LAYER_PREFAB}" {
   coords 0 0 0
   {
${crateSlots}
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
      // occupants — wrong faction whenever a faction borrows another's
      // vehicles (MEI in USSR armor spawned USSR crews; RHS_AFRF in a vanilla
      // UAZ spawned vanilla USSR crews). Every faction must define patrolCrew
      // (concrete characters only) so the pool is ALWAYS emitted.
      if (!ENEMY.patrolCrew?.length)
        throw new Error(`Faction ${mission.enemyFaction} has no patrolCrew — vehicle modules would spawn prefab-default (wrong-faction) crews`);
      pools.push(["m_aCrewPrefabPool", ENEMY.patrolCrew]);
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
   m_iDynamicDespawnRange ${Math.round(z.radius + 600)}
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

  // --- Props.layer + prop-defense areas ---
  // Props are plain world entities (FARP-style placement): the E_/base
  // prefab at the sampled position with a compass-bearing yaw (prefabs face
  // local +Z, so yaw 0 = north). A defended prop adds a distinctly-named
  // Area/Layer/SlotAI trio appended to AO.layer — dynamic despawn ON with
  // the range left at the class default (750), no area radius; the SlotAI's
  // default 30 m defend waypoint keeps the group holding the prop.
  //
  // Terrain tilt: with a heightmap sampler available (web export), props get
  // full `angles <pitch> <yaw> <roll>` so they hug slopes instead of
  // floating at the front and sinking at the back. Sign convention was
  // ground-truthed against terrain-snapped entities in extracted community
  // worlds (Ruha GravelPile roll −4.5° vs slope-predicted −5.4°, Takistan
  // cargo containers, Kunar GravelPile — 2026-08-04): pitch = +atan(slope
  // along local +Z) (nose up when ground rises ahead), roll = −atan(slope
  // along local +X) (right side dips on a right-rising slope). Lever arms =
  // footprint half-extents (min 2 m) so the fitted plane matches what the
  // prop spans; clamped ±30° (steeper reads as a placement error and the
  // panel's uneven-ground warning already fired). Minefield effect modules
  // stay flat — they're logical areas, the spawned mines snap individually.
  const props = mission.props ?? [];
  // With a sampler, prop Y comes from the heightmap regardless of the input
  // pos (a no-op for web exports, which sampled the same heightmap already —
  // but it corrects hand-written CLI fixture Ys, which put spike props
  // meters underground, playtest-caught 2026-08-04).
  const propPos = (p) => {
    if (!sampleYFn) return p.pos;
    const y = sampleYFn(p.pos[0], p.pos[2]);
    return Number.isFinite(y) ? [p.pos[0], +y.toFixed(3), p.pos[2]] : p.pos;
  };
  const propTilt = (p, yaw) => {
    const entry = PROPS.find((e) => e.ref === p.ref);
    // minefields = logical areas; tilt: false = vertical structures
    // (antenna masts) that are built plumb regardless of ground slope
    if (!entry || entry.cat === "minefield" || entry.tilt === false) return [0, 0];
    const fp = entry.fp ?? {};
    // shared math lives in terrainTilt (spawn section)
    return terrainTilt(p.pos[0], p.pos[2], yaw, Math.max(2, (fp.d ?? fp.w ?? 0) / 2), Math.max(2, (fp.d ?? fp.len ?? 0) / 2));
  };
  const propsLayer = props
    .map((p, i) => {
      const yaw = +((p.rotation ?? 0) % 360).toFixed(1);
      const [pitch, roll] = propTilt(p, yaw);
      const angles = pitch || yaw || roll ? `\n angles ${pitch} ${yaw} ${roll}` : "";
      return `GenericEntity Prop${i + 1} : "${p.ref}" {\n coords ${posStr(propPos(p))}${angles}\n}\n`;
    })
    .join("");
  const propDefenseBlocks = props
    .map((p, i) => {
      if (!p.defense) return "";
      const entry = PROPS.find((e) => e.ref === p.ref);
      const cat = entry && PROP_CATEGORIES.find((c) => c.key === entry.cat);
      if (!cat?.defense) throw new Error(`Prop ${i + 1} (${p.ref}) is not in a defense-capable category`);
      const group = resolvePropDefenseGroup(mission.enemyFaction, mission.enemyGroupSets ?? mission.enemyGroupSet, p.defense.sizes, i);
      // Spawn the group 5 m BEHIND the prop's rear footprint edge (local −Z,
      // rotated with the yaw) — spawning at the prop center tangled AI in
      // the fortification's own barbed wire (playtest-caught 2026-08-04).
      // The slot's default defend waypoint (30 m) still covers the prop, so
      // the group walks up and mans it naturally. Y is terrain-sampled at
      // the offset point (slot coords are Area-relative).
      const fp = entry.fp ?? {};
      const rearLocal = [
        fp.d ? 0 : (fp.offX ?? 0),
        (fp.d ? -fp.d / 2 : (fp.offZ ?? 0) - (fp.len ?? 0) / 2) - 5,
      ];
      const [sdx, sdz] = rotateLocal(rearLocal[0], rearLocal[1], +((p.rotation ?? 0) % 360));
      const pPos = propPos(p);
      let sdy = 0;
      if (sampleYFn) {
        const sy = sampleYFn(pPos[0] + sdx, pPos[2] + sdz);
        if (Number.isFinite(sy)) sdy = sy - pPos[1];
      }
      const slotCoords = posStr([sdx, sdy, sdz]);
      return `GenericEntity AreaPropDef${i + 1} : "${K.AREA_PREFAB}" {
 components {
  SCR_ScenarioFrameworkArea "${K.CMP_SF_AREA}" {
   m_bDynamicDespawn 1
  }
 }
 coords ${posStr(pPos)}
 {
  GenericEntity LayerPropDef${i + 1} : "${K.LAYER_PREFAB}" {
   components {
    SCR_ScenarioFrameworkLayerBase "${K.CMP_SF_LAYER}" {
    }
   }
   coords 0 0 0
   {
    GenericEntity SlotAIPropDef${i + 1} : "${K.SLOTAI_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotAI "${K.CMP_SF_SLOTAI}" {
       m_sObjectToSpawn "${group}"
      }
     }
     coords ${slotCoords}
    }
   }
  }
 }
}
`;
    })
    .join("");

  // Stop Artillery triggers: Area > Layer > SlotPlayerTrigger trios appended
  // to AO.layer (AreaPropDef precedent). Emitted only when enemy artillery is
  // on - TS_ScenarioFrameworkActionStopArtillery logs a WARNING when no
  // enabled TS_AiArtilleryComponent exists. No dynamic despawn: the trigger
  // is mission-critical and must live from session start (AreaObjectives
  // rule). m_fAreaRadius is always written (the plugin default 5 sits below
  // the UI minimum); the plugin's default PLAYER presence is kept. The action
  // GUID is a new array member -> per-run mintGuid() like every other member.
  const artyStopBlocks = (mission.aiArty?.stopTriggers ?? [])
    .map((st, i) => `GenericEntity AreaArtyStop${i + 1} : "${K.AREA_PREFAB}" {
 components {
  SCR_ScenarioFrameworkArea "${K.CMP_SF_AREA}" {
  }
 }
 coords ${posStr(st.pos)}
 {
  GenericEntity LayerArtyStop${i + 1} : "${K.LAYER_PREFAB}" {
   components {
    SCR_ScenarioFrameworkLayerBase "${K.CMP_SF_LAYER}" {
    }
   }
   coords 0 0 0
   {
    GenericEntity SlotArtyStop${i + 1} : "${K.SLOT_PLAYERTRIGGER_PREFAB}" {
     components {
      SCR_ScenarioFrameworkSlotTrigger "${K.CMP_SLOT_TRIGGER}" {
       m_aPlugins {
        SCR_ScenarioFrameworkPluginTrigger "${K.CMP_PLUGINTRIG_PLAYERTRIGGER}" {
         m_fAreaRadius ${Math.round(st.radius)}
        }
       }
       m_aTriggerActions {
        TS_ScenarioFrameworkActionStopArtillery "{${mintGuid()}}" {
         m_iMaxNumberOfActivations 1
        }
       }
      }
     }
     coords 0 0 0
    }
   }
  }
 }
}
`)
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
  // trigger OnActivate) and announces itself via the NATIVE ON_FINISH task
  // notification (see taskFields). m_sFactionKey MUST be a playable faction
  // or task creation fails at Init.
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
    // Task text supports <br/> markup; literal newlines would break the
    // .layer file. Quotes escape to ' like all other user text we serialize.
    const escObjText = (s) => String(s ?? "").replace(/"/g, "'").replace(/\r?\n/g, "<br/>");
    // m_eTaskNotificationSettings 6 = the native, faction-filtered
    // "task finished" popup (carries the task title). Replaced the custom
    // ShowHint action 2026-08-02 — hints are suppressed entirely for players
    // who disable Settings > Interface > Show Hints (user report), while
    // task popups have no such opt-out. Why 6 and not a single flag: BI's
    // SCR_ETaskNotificationSettings is declared SEQUENTIAL (ON_CREATED 0,
    // ON_UPDATED 1, ON_FINISH 2...) and the script checks raw member values,
    // but the Workbench Flags widget (= what BI designers author with)
    // stores 1<<index (CREATED 1, UPDATED 2, FINISH 4...). Playtest
    // 2026-08-02: value 2 produced NO finish popup and Workbench displayed
    // it as "ON UPDATED" — the runtime follows the widget encoding. 6 = 2|4
    // spells ON_FINISH under BOTH readings; the stray bit is harmless either
    // way (widget: UPDATED — our task types never emit a progressed state;
    // sequential: CANCELLED — our tasks are never cancelled).
    const taskFields = (o) => `     m_sFactionKey "${playableKey}"
     m_sTaskTitle "${escObjText(o.taskTitle)}"
     m_sTaskDescription "${escObjText(o.taskDesc)}"
     m_eTaskUIVisibility LIST_ONLY
     m_eTaskNotificationSettings 6`;
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
            // Parent = the E_ variant when one exists, else the base ref
            // (radars have no E_). cmp = multiphase override (component
            // instance GUID from the base chain); extra = verbatim extra
            // component blocks (fresh components: _on replication, editable,
            // Rpl, from-scratch destruction).
            const dParent = dEntry.spawnRef ?? dEntry.ref;
            const baseName = dParent.split("/").pop().replace(/^E_/, "");
            const dPath = `Prefabs/DestroyTargets/Dest_${baseName}`;
            const cmpBlock = dEntry.fix.cmp
              ? `\n  SCR_DestructionMultiPhaseComponent "${dEntry.fix.cmp}" {\n   Enabled 1${dEntry.fix.body ?? ""}\n  }`
              : "";
            destroyTargetFiles[dPath] = {
              guid: dEntry.fix.guid,
              content: `${dEntry.fix.cls} : "${dParent}" {
 ID "${dEntry.fix.id}"
 components {${cmpBlock}${dEntry.fix.extra ?? ""}
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
    [`${layersDir}/AO.layer`]: aoLayer + propDefenseBlocks + artyStopBlocks,
    [`${layersDir}/Markers.layer`]: markersLayer,
    [`${layersDir}/QRF.layer`]: qrfLayer,
    [`${layersDir}/Objectives.layer`]: objectivesLayer,
    [`${layersDir}/Props.layer`]: propsLayer,
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
