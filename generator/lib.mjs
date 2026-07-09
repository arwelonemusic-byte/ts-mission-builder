// Mission addon generator library — pure functions, runs in Node or the browser.
// buildMissionFiles(mission) -> { files: { relPath: content }, addonDirName }
//
// All GUIDs ground-truthed from TS Mission Toolkit / vanilla data / production ops.
// See CLAUDE.md "Validated architecture facts" before changing formats.

import { TERRAINS, FACTIONS, K, ZONE_MODULES, resolveGroupPool, resolveSentryPool, resolveDefenseGroup } from "./catalogue.mjs";
import { layoutSpawnBundle, rotateLocal } from "./layout.mjs";
export { TERRAINS, FACTIONS, K, ZONE_MODULES, resolveGroupPool, resolveSentryPool, resolveDefenseGroup };
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

// Multi-line m_sEntryText serialization (quoted lines joined by `\` continuations)
function entryText(lines, indent) {
  const safe = lines.length ? lines : [""];
  return safe.map((l) => `"${String(l).replace(/"/g, "'")}"`).join(`\\\n${indent}`);
}

const posStr = (p) => (Array.isArray(p) ? p.map((n) => +n.toFixed(3)).join(" ") : p);

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
  };

  // --- addon.gproj ---
  const gproj = `GameProject {
 ID "${mission.addonId}"
 GUID "${guids.addon}"
 TITLE "${mission.addonTitle}"
 Dependencies {
  "${K.BASE_GAME}"
  "${K.TOOLKIT}"
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
 m_sIcon "${K.TOOLKIT_ICON}"
 m_sLoadingScreen "${K.TOOLKIT_ICON}"
 m_sPreviewImage "${K.TOOLKIT_ICON}"
 m_sGameMode "COOP"
 m_iPlayerCount ${mission.playerCount}
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
  const arsenalItems = F.arsenalItems
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

  const squadCallsigns = ["1'1", "1'2", "1'3", "1'4"].map((cs, i) => [F.squadBase[i], cs]);
  squadCallsigns.push([F.squadFifth ?? `{${mintGuid()}}`, "1'6"]);
  const squadNamesBlock = squadCallsigns
    .map(([guid, cs]) => `     SCR_CallsignInfo "${guid}" {\n      m_sCallsign "${cs}"\n     }`)
    .join("\n");
  const groupPresets = [9, 9, 9, 9, 3]
    .map((size) => `    SCR_GroupPreset "{${mintGuid()}}" {\n     m_iGroupSize ${size}\n    }`)
    .join("\n");

  function factionEntry(key) {
    const f = FACTIONS[key];
    // m_bIsAssignedRandomly defaults to 1 — turn it OFF on every faction so
    // squads take callsigns in order (1'1, 1'2, ...) instead of at random.
    if (key !== mission.playableFaction)
      return `  SCR_Faction "${f.entryGuid}" {
   m_CallsignInfo SCR_FactionCallsignInfo "${f.callsignGuid}" {
    m_bIsAssignedRandomly 0
   }
  }`;
    return `  SCR_Faction "${f.entryGuid}" {
   m_bIsPlayable 1
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
PerceptionManager PerceptionManager : "{028DAEAD63E056BE}Prefabs/World/Game/PerceptionManager.et" {
 coords ${mgr(-20, 0, -18)}
}
SCR_FactionManager FactionManager_Editor : "{4A188E44289B9A50}Prefabs/MP/Managers/Factions/FactionManager_Editor.et" {
 coords ${mgr(-19, 0, -17)}
 Factions {
${factionEntry("US")}
${factionEntry("USSR")}
${factionEntry("FIA")}
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
  }
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
  function pluginBlock(p) {
    const def = ZONE_MODULES.find((d) => d.type === p.type);
    if (!def) throw new Error(`Unknown zone module type: ${p.type}`);
    const enemySets = mission.enemyGroupSets ?? mission.enemyGroupSet;
    let pools; // [attrName, refs][]
    if (def.kind === "infantry") {
      pools = [[def.pool, resolveGroupPool(mission.enemyFaction, enemySets, def.sizes)]];
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
    }
    for (const [, refs] of pools) {
      if (!refs?.length) throw new Error(`Empty pool for ${p.type} (${mission.enemyFaction})`);
    }
    let s = `      ${p.type} "{${mintGuid()}}" {\n`;
    for (const [k, v] of Object.entries(p.attrs ?? {})) s += `       ${k} ${v}\n`;
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
      const pluginMods = z.plugins.filter((p) => !isSlotAIModule(p));
      const plugins = pluginMods.map(pluginBlock).join("\n");
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
      return `GenericEntity ${z.name ?? `Area${i + 1}`} : "${K.AREA_PREFAB}" {
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
    [`${layersDir}/QRF.layer`]: "",
    [`${layersDir}/Props.layer`]: "",
  };

  return { files, guids, addonDirName: mission.dirName ?? mission.addonId };
}
