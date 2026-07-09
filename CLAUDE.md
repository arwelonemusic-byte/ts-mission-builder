# TS Mission Builder

Web-based mission creation tool for Arma Reforger. Community members design a mission in the browser (map, factions, AI zones, briefing) and the tool generates a complete, workshop-ready mission addon as plain text files. Workbench is needed only to open the project once (regenerates `resourceDatabase.rdb` / missing `.meta`) and to publish.

Feasibility research + decisions (2026-07-04): see the report in Obsidian — `C:\Users\djdav\Obsidian Vaults\Alex's Vault\Inbox\Web-based mission making — Feasibility Report.md` (brief: `Web-based mission making.md`, foundation spec: `Mod Defaults.md`).

## Division of labor

- **TS Mission Toolkit** (`C:\Users\djdav\Documents\My Games\ArmaReforgerWorkbench\addons\TS Mission Toolkit`) = runtime: prefabs, ScenarioFramework plugins, loadout/arsenal/fire-support systems. Generated missions depend on it (`.gproj` dependency GUID `6906F4528B72651A`).
- **TS Mission Builder** (this repo) = authoring: web app + generator library that emits mission addons. Never put builder files in the toolkit repo and never put addon resources here.
- Generated output goes to `C:\Users\djdav\Documents\My Games\ArmaReforgerWorkbench\addons\<AddonName>` (current spike target: `TS_WebSpike`).

## Repo layout

npm workspaces: `generator` (package `mission-gen`) + `web`. Root `npm install`; dev server: `npm run dev` in `web/` (localhost:3000); typecheck/build: `npm run build` in `web/`.

- `generator/lib.mjs` — pure generator library (`buildMissionFiles(mission)` → `{files, guids, addonDirName}`), runs in Node AND the browser. `generator/catalogue.mjs` — the GUID catalogue (terrains, factions, `ZONE_MODULES` UI list). `generator/generate.mjs` — CLI wrapper that builds the TS_WebSpike test mission (`node generate.mjs`).
- `web/` — Next.js 16 + Tailwind v4, styled to match ts-ops-planner (full-bleed map, floating 360px panel, yellow `#f4db50` accent). `src/app/page.tsx` = the editor shell (step tabs Mission/Factions/Spawn/Zones/Markers/Brief + GENERATE, all state lifted here, localStorage key `ts-mission-builder-v1`); per-step panels in `src/components/panels/`; `src/components/MissionMap.tsx` = lean imperative Leaflet map (CRS.Simple with flipped-Y transformation, XYZ tile pyramids from `public/tiles/` — tiles required, no single-image fallback; lat=worldZ lng=worldX, 1 unit = 1 m); `src/lib/export.ts` = mission state → generator input (heightmap Y sampling) → File System Access API folder write (Chrome/Edge only); `src/lib/heightmap.ts` = bilinear sampler copied verbatim from ts-ops-planner; `src/lib/terrains.ts` = 3 vanilla terrains (tile pyramids + heightmaps copied from ts-ops-planner).

## Validated architecture facts (don't re-derive)

- **Offline generation works.** Addon = `addon.gproj`, `Missions/*.conf(+.meta)`, `Worlds/*.ent` (3-line `SubScene { Parent "{GUID}worlds/..." }`) `(+.meta)`, `Worlds/*_Layers/*.layer` (text, LF, UTF-8 no BOM). `resourceDatabase.rdb` is binary — never write it; Workbench recreates it on open/close.
- **Self-assigned GUIDs are accepted.** Random/timestamp 16-hex in hand-written `.meta` files works (validated in Workbench + playtest). Keep resource GUIDs stable across generator re-runs.
- **Clean resource override** = same relative path as the original + `.meta` declaring the ORIGINAL resource's GUID. For prefab overrides, mirror Workbench output (see `addons\Operation NewOp` examples): same parent ref AND same root `ID` as the original file, declare only changed components using the base's component-instance GUIDs (quoted: `SCR_Foo "{GUID}"`). Engine layers deltas — the toolkit's other components survive. Four standard overrides per mission: TS_MissionLoadouts.conf `{2B1F00FB4CED5910}` (loadout list — toolkit default is empty, all entries are new members with fresh GUIDs), LoadoutCrates_Conf.et `{897A36FA3D0A19F8}` (faction affiliation only), TS_CustomArsenal.conf `{DDDE97723E57CC62}`, Briefing.conf `{66D418A7AFBF6FEB}` (reuse the toolkit's entry instance GUIDs for the 3 default sections ids 0-2; user-added extra sections get fresh GUIDs, sequential `m_iEntryID` from 3, `m_eJournalEntryType Custom` + editable `m_sCustomEntryName` — Foxhound pattern; multi-line text = quoted lines joined by `\` + newline).
- **Component overrides in layers/prefabs must reuse the base prefab's component-instance GUIDs** — never mint fresh GUIDs for them. Fresh GUIDs only for NEW array members / nested objects.
- **Mod Defaults standard** (per spec): 6 layers (default/AO/Spawn/Markers/QRF/Props; empty `.layer` files are valid); FactionManager callsigns 1'1–1'4 + 1'6, `m_sCallsignGroupFormat "%3"`, group presets 9/9/9/9/3 on the playable faction, `m_bIsAssignedRandomly 0` on ALL factions' `SCR_FactionCallsignInfo` (default 1 hands out squad names in random order); GameModeSF spawn logic WITHOUT `m_sForcedFaction`; LoadoutManager entries Arsenal/Rifleman (names inherited from `LoadoutManager_Base.et`, set only resource + faction); Spawn layer = faction spawn point + AreaSpawn→LayerCrates/LayerVehicles slots + optional FARP `{0C16FFB1B07F4A89}` (plain placement); MVP plugin set = AIPatrol, MountedPatrol, Fortification, QRFFoot, QRFMounted, SmartGarrison. Every generated Area sets `m_bDynamicDespawn 1` + `m_iDynamicDespawnRange` = zone radius + 400.
- All catalogue GUIDs (terrains arland/eden/cain + navmeshes, faction entries, callsign infos, vanilla squad-name members, characters, vehicles, arsenal items) are ground-truthed in `generator/generate.mjs` — extend, don't re-harvest.

## Verification workflow

1. `node generator/generate.mjs` (avoid `--clean` while Workbench runs — it deletes the EnfusionMCP handler scripts).
2. Offline check: enfusion-mcp `mod` tool, action `validate`, projectPath = the generated addon.
3. Workbench check: `wb_launch` with the generated `.gproj` → `wb_open_resource Worlds/<name>.ent` → `wb_entity_list`/`wb_layers` → scan the newest `C:\Users\djdav\Documents\My Games\ArmaReforgerWorkbench\logs\logs_*/console.log` + `error.log` for resource errors. Restart Workbench (kill + `wb_launch`) after changing resources on disk — `wb_reload` only reloads scripts.
4. Playtest is manual (user). Dedicated-server testing uses the published Workshop pak, not the local copy.

## AI group pools

Full vanilla group catalogue lives in `generator/catalogue.mjs` `groupSets` (source: `input/ai-groups.md`), organized per faction → group set (subfaction) → size class. Size rules: **small** (sentry/MG/AT/GL/LAT/suppress/ammo/medical/sapper/engineer/recon/sniper teams) → garrison + patrols; **medium** (fire groups/teams, search groups, platoon HQs) → patrols; **large** (rifle squads, maneuver groups) → patrols + QRF (module not exposed yet). SF sets (Spetsnaz/Green Berets) reuse their squad as medium+large. Excluded: `*_Base`, `Transport`, `WithDriver`, `LessArmored`. Pool resolution = `resolveGroupPool()` (accepts multiple set keys, merges + dedupes, falls back to all sizes if a class is empty); mounted patrols use `patrolVehicles`. The mission's `enemyGroupSets` array (UI: "Enemy troops" checkbox list, min 1 selected) picks which sets to mix. Full vanilla character list for the future loadout picker: `input/characters-loadouts.md` (not yet in the catalogue).

Defense Group module (kind `slotai`, on/off only): NOT a toolkit plugin — emits a vanilla `SlotAI` child entity inside the zone's Layer (prefab `K.SLOTAI_PREFAB`, component GUID `K.CMP_SF_SLOTAI`, coords 0 0 0 = zone center; entity named `SlotAI<N>` per zone — entity names are world-global). `m_sObjectToSpawn` = the largest squad among selected enemy sets (`groupSets[*].defense` `{ref, size}`, resolved by `resolveDefenseGroup()`, ties → first selected). The slot's default 30 m defend waypoint needs no extra config. NOTE: `ZONE_MODULES[0]` is Defense Group — the fresh-zone default module in page.tsx references AIPatrol explicitly.

Fortifications module (`TS_ScenarioFrameworkPluginFortification` — singular): composition pools live in `FACTIONS[*].fortifications` `{road, roadside}` (FIA road reuses USSR's `ROAD_FORTS_USSR`); the AI pool is one `groupSets[*].sentry` team per selected enemy set, resolved by `resolveSentryPool()` (suppressed SF sets carry the parent's team, deduped). UI exposes only the budget (`maxBudget: 4` on the module def caps the input). Tuning attrs (roadside offset 15 / min road width 4 / min spacing 50 / single side) equal the plugin's class defaults and are omitted from the serialized block.

## Loadouts

Full curated character rosters live in `catalogue.mjs` `loadoutSets` per faction → subfaction (source: `input/characters-loadouts.md`; "Don't use" entries excluded; suppressed SF sets reuse parent names; USSR names are Russian by design). The UI "Loadouts" section is a checkbox multiselect over `loadoutSets[playableSubfaction]` (min 1; selection resets on faction/subfaction change; stored as prefab refs in `mission.loadouts`). Selected loadouts go into the `TS_MissionLoadouts.conf` override as `TS_LoadoutConfig` entries with fresh GUIDs (the toolkit default conf is empty — nothing to override in place). The toolkit's conf-based crate (`LoadoutCrates_Conf.et`, `TS_LoadoutSelectorConfComponent`) reads that conf locally on every machine, and the GM "Assign Loadout" action reads it directly — no replication-bubble dependency, no crate loadout override. The crate prefab is still overridden, but only to set `SCR_FactionAffiliationComponent` to the playable faction. `m_iMaxPlayers` is left at default (-1) for now — per-role player caps are a future setting (the conf supports `m_iMaxPlayers`/`m_eLimitScope` per entry when the UI adds them).

## Arsenal

MVP: one baked item set per faction (no UI). Source of truth = `input/arsenal-items.md` (bare `{GUID}path` lines under `## Faction` headings). After editing it, run `node generator/tools/harvest-arsenal.mjs` to re-sync `catalogue.mjs` `FACTIONS[*].arsenalItems` as `{mode, ref}` (modes come from reforger-item-database `data/items.json` `itemMode`, valid `SCR_EArsenalItemMode` tokens, omitted when empty). The generator writes the playable faction's set into the `TS_CustomArsenal.conf` override: first entry reuses the toolkit base conf's member instance GUID `{69092805DE3E6A13}` (Workbench pattern), the rest are fresh-GUID members with `m_iSupplyCost 0`. Clothing is excluded by design (loadouts cover it). Item database tool: `D:\VSCode_dev\arma-reforger\reforger-item-database` (browsable catalog + its own conf generator).

## Vehicles

Full vanilla vehicle catalogue (source: `input/vehicles.md`) in `catalogue.mjs`: `vehicles`/`vehicleLabels` = spawn-picker list per faction (everything incl. armed + helicopters); `patrolVehicleKeys` = mounted-patrol CANDIDATES (armed/armored base variants, keys into `vehicles`, ordered light→heavy). Which candidates actually patrol is a **per-zone multiselect** on the Mounted Patrols module (`ZoneModule.vehicles` keys, min 1, defaults to the lightest; selections reset when the enemy faction changes since keys are faction-specific). Faction assignment: `_FIA` suffix → FIA, Soviet designs → USSR, US designs (incl. MERDC variants, LAV-25, all UH1H) → US.

## Markers

Markers tab (military + vanilla, mirroring ts-ops-planner's New Marker panel; no TS markers, no phonetic text substitution). Catalogue in `web/src/lib/markers.ts`: military = 48 pre-rendered PNGs (`web/public/icons/military/land-<faction>-<type>.png`, copied from ts-ops-planner), vanilla = atlas sprites (`web/public/icons/vanilla-markers.png`, CSS-mask recolored). `mission.markers` → export maps web keys to game enum tokens → `generator/lib.mjs` emits `Markers.layer` (ONE Area → ONE Layer → ONE `$grp SlotMarker.et` group with named `SlotMarkerN` bodies, Area-relative coords, fields omitted at class defaults; fixed prefab-instance GUIDs in `K.CMP_SF_SLOTMARKER`/`K.MARKER_TYPE_GUID`). **Gotchas (ground-truthed):** `m_eMapMarkerColor` (SCR_EScenarioFrameworkMarkerCustomColor) indexes the game's placed-color array by ORDINAL, so enum names ≠ rendered colors (RED renders dark red, OPFOR red, DARK_PINK dark brown — see MARKER_COLORS in markers.ts); the icon enum has no DIRECTION_OF_ATTACK_MAIN_PLANNED (that ops-planner sprite is excluded); military type is written to BOTH m_eMapMarkerType1Modifier and Type2 (they're OR-ed, both default INFANTRY), omitted for infantry, `0 0` for empty. Marker placement mode stays active for multi-drop; markers are draggable; click selects for live editing.

## Known gaps / next steps

- Per-loadout player caps (m_iMaxPlayers/m_eLimitScope UI); user-editable arsenal contents (MVP ships baked per-faction sets).
- QRF layer content + `TS_QRFSpawnAnchor` `$grp` placement (deferred by spec).
- Heightmap-based Y sampling for arbitrary placement (ts-ops-planner `web/src/lib/heightmap.ts` + `tools/map-gen/extract_heightmap.py` assets).
- Web app scaffold + mission JSON schema formalization.

## External references

- Unpacked vanilla data (text `.conf`s, EBIN worlds): `D:\VSCode_dev\arma-reforger\reference\ReforgerData`
- Production mission examples (override patterns, faction setups): `C:\Users\djdav\Documents\My Games\ArmaReforgerWorkbench\addons\Operation *`
- enfusion-mcp offline generator precedent: `C:\Users\djdav\mcp-servers\enfusion-mcp-BK\src\templates\scenario.ts`
