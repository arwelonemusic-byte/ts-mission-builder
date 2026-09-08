---
name: addon-audit
description: Audit the Workshop addons TS Mission Builder depends on (faction mods, vehicle mods, core ACE addons, modded maps) for updates that break or extend the Builder — regenerated/moved/removed GUIDs, new groups/characters/vehicles/arsenal items, FactionManager member changes, map terrain/entity/imagery changes that need tile re-capture. Use when the user says /addon-audit, reports that a supported mod was updated (pastes a workshop URL / GUID / mod name), or asks to audit/check/re-verify all Builder-supported addons. Takes a workshop URL, GUID, registry id (rhs, uk, mei, novka, core…) or "all".
---

# Addon audit

Community addons update under us. Every update can (a) BREAK the Builder — prefab GUIDs
regenerated (MEI 1.3.1), prefabs moved/removed, FactionManager members re-minted, catalog
confs left stale — or (b) EXTEND what we could offer — new group/character/vehicle prefabs,
new arsenal items, new subfactions, new map content. This skill downloads the latest
version, extracts it beside the previous one, diffs the two, verifies every ref the Builder
holds, and produces a triage report + follow-up list. It never edits the registries itself.

**Tool**: `node .claude/skills/addon-audit/scripts/audit.mjs <cmd> …` (run from the repo
root). It reads the registries (`MODS`, `VEHICLE_MODS`, `CORE_ADDONS`, `TERRAINS`,
`MOD_ARSENAL_POOLS`, `CORE_ARSENAL_POOL` from `generator/catalogue.mjs`) so the supported
set is never hand-maintained. `AUDIT_SETS` at the top of the script maps a registry entry
to the GUIDs it is audited through when they differ from `dependencies` (MEI → its two
content mods, UK → +Truck Utility companion, bandits → +Bandit Gear, core → ACE Medical
+ ACE Core with a script-symbol check).

| command | does |
|---|---|
| `list [--json] [--stale]` | every supported addon: kind, GUID, on-disk version (game `meta`), baseline version, state (`ok` / `STALE` / `NO-BASE` / `NO-DISK` / `NO-EXTR`) |
| `fingerprint <t> [--write] [--version V] [--title T] [--force]` | fingerprint the CURRENT extraction (file hashes, `{GUID}path` pairs, catalog conf contents, FactionManager members, layer entity counts + baked managers, navmesh + terrain tile hashes) → `input/addon-audit/<GUID>.json` |
| `rotate <t>` | move `reference/<Title>` → `reference/_prev/<Title>` (replacing an older `_prev` copy) so the next extraction is CLEAN (extract-addon merges in place and never removes deleted files) |
| `diff <t> [--full]` | baseline (or `_prev` extraction when present) vs current extraction: files, regenerated/moved GUIDs, new/removed content refs, catalog + FactionManager deltas, map signals + verdict |
| `check <t> [--unused] [--rebuild-vanilla]` | every Builder ref for the target vs the current extraction: `OK` (prefab/layer-corroborated) / `OK_CATALOG` (catalog confs only — normal for top-level prefabs nothing else references) / `VANILLA` / `AMBIGUOUS` / `REGENERATED` / `MOVED` / `PATH_ONLY` / `NOT_FOUND`; bare instance GUIDs (`entryGuid`, callsigns, squad members) as `bare:OK|VANILLA|MISSING`; core script symbols; map TERRAINS flags vs the bare world's baked managers; count of mod-owned catalog prefabs the Builder doesn't use. Uses a vanilla index (`input/addon-audit/_vanilla-index.json.gz`, gitignored, built once from `reference/ReforgerData`, ~20 s; `--rebuild-vanilla` after a game update) so vanilla GUIDs reused by mods — callsign members, vanilla groups referenced from mod worlds, the vanilla GUID beside a mod's Workbench-duplicate prefab at a vanilla path — never read as breaks |

| `junction <t> [--remove]` | TEMPORARY Workbench junctions for the target's addons AND their full gproj dependency chain (`<WB addons>\<Name>_<GUID>` → game folder), recorded in `input/addon-audit/_junctions.json`; `--remove` drops exactly those (`junction all --remove` = everything on record). Folders/junctions the tool didn't create are never touched |

`<t>` = 16-hex GUID, registry id (`rhs`, `uk`, `mei`, `bandits`, `sfs`, `sfsrf`, `sfsfia`,
`arma2`, `usdesert`, `daxhumvees`, `core`, terrain keys `armenhof`…`westzagoria`) or `all`.

Baselines live in `input/addon-audit/` (committed — they ARE the "what the Builder was
harvested against" record; version `null` = seeded from an extraction older than the
on-disk copy, so the first diff is the real comparison). `reference/_prev/` is scratch:
the skill deletes and recreates its own copies there, nothing else.

## Workflow A — one addon the user knows was updated

`/addon-audit <workshop URL | GUID | registry id>`

1. `list` → confirm the target is Builder-supported and note baseline vs disk versions. A
   GUID not in any audit set → say so and stop (it's not our dependency; maybe it should
   be — ask).
2. **Download** the latest version with the download-addon helper (Bash timeout ≥ 10 min,
   several GUIDs in one call when the audit set has more than one):
   ```bash
   python "C:/Users/djdav/.claude/skills/download-addon/download-addon.py" <GUID> [<GUID>…]
   ```
   Same rules as `/download-addon` (close the game's Workshop screen; one dedi at a time).
   Workbench reads mods straight from the game folder once they were registered via the
   launcher's **Scan for projects** — an already-known addon keeps working after an in-place
   update; a NEWLY downloaded one needs a scan (user action) before any Workbench validation.
   If the helper says `[already up to date]` AND `list` shows `ok` → report "no update,
   nothing to audit" and stop (offer `check` as a sanity pass).
3. **Rotate + extract**: `rotate <GUID>` then invoke the `extract-addon` skill on the
   `RESULT` folder. Extract every GUID in the audit set that changed.
4. `diff <GUID>` (add `--full` when a section is truncated) then `check <id>`.
5. **Triage** with the checklists below. Read the actual changed files when the diff
   flags something (the `_prev` copy makes `diff <old> <new>` on a conf trivial).
6. **Report** (the deliverable): version old → new; BREAKS (what the Builder emits that no
   longer resolves, with the fix); NEW CONTENT worth adding (grouped, with harvestable GUIDs
   and the catalog file they came from); NO-OP changes summarized in one line; follow-ups
   (harvest doc update, thumbnails, spike regeneration, playtest gates).
6b. **Workbench validation of a registry fix** (map nav/flag change, faction GUID change):
   regenerate the spike (`node generator/generate.mjs --<flag>`), then
   `junction <id>` → `wb_launch` on the spike's `.gproj` → `wb_open_resource Worlds/<spike>.ent`
   (poll the newest `logs_*/console.log` for `WorldEditor: LoadWorld` — large worlds time
   out client-side) → `wb_state` / `wb_entity_list` for the entities you changed → scan the
   log for `(E)` lines naming OUR resources (`dependency '<GUID>' can't be added` = the
   junction step was skipped) → kill Workbench → **`junction <id> --remove`**. Never leave
   junctions behind (user decision 2026-09-08); mention in the report that they were
   created and removed.
7. **Advance the baseline only after the Builder is updated (or the verdict is no-op)**:
   `fingerprint <GUID> --write --force --version <new>`. Update the mod's harvest doc
   (`input/<mod>-harvest.md`) header with the new version and what changed.

## Workflow B — audit everything

`/addon-audit all`

1. `list` — capture the table (it's the "before" state for the report).
2. Download ALL supported GUIDs in ONE helper call (`list --json` gives the GUID column;
   skip `NO-DISK` entries that are the user's own addons). One dedicated-server run resolves
   and delta-patches everything; multi-GB (RHS, maps) can take a while — that's expected.
3. `list --stale` → the addons whose on-disk version moved past the baseline. For each:
   rotate → extract → `diff` → `check`. Unchanged addons get nothing (mention them as a
   count in the report).
4. Triage every changed addon with the checklists; one consolidated report ordered by
   severity: BREAKS first, then map re-capture decisions, then new-content opportunities.
5. Advance baselines only for addons that need no Builder change; leave the others STALE
   until their follow-up lands (the `list` state is the todo list).

## Checklist — faction addons (RHS, UK, MEI, Bandits, SFS packs, Arma II, US Desert)

Sources of truth stay catalog-driven (never folder-scan): `Configs/EntityCatalog/**`,
`Configs/Editor/PlaceableEntities/**`, Arsenal-list confs, the mod's `FactionManager_*.et`
override, prefab-side `{GUID}path` refs (parent chains, group unit slots, variant tables).

BREAKS (fix before anything else):
- `check` REGENERATED / MOVED / MISSING on any registry or arsenal-pool ref. Prefab-side
  evidence beats catalog confs (AMBIGUOUS = both sides disagree with equal weight → open
  the prefab in Workbench / the Arma II GUID-cross-map audit). Stale catalog alternates are
  normal after a regeneration (MEI) — the Builder must hold the PREFAB-side GUID.
- FactionManager member instance GUIDs (`entryGuid`) changed or the faction conf ref
  moved → every faction override the Builder emits targets a dead member ("no available
  factions" at runtime). Also a newly appended member = new faction candidate.
- Callsign object / squad-name member GUIDs (`callsignGuid`, `squadBase`, `squadFifth`) —
  bare-GUID check + read the faction's `.conf` if the file changed.
- Spawn point prefab, `hvt` officer, `patrolCrew` (must stay CONCRETE, armed characters —
  re-verify a `_Randomized`/`_Random` wrapper didn't replace them), fortification pools.
- `friendlyWith`: grep the faction confs for `m_aFriendlyFactionsIds` — a new friendship
  with a vanilla side silently disables combat unless lib.mjs clears it.
- Dependencies: compare the addon's `addon.gproj` deps (the tool prints `gprojDeps` in
  `list --json`) with the registry `dependencies` — a new required dep must be downloaded
  (the helper pulls it transitively) and registered in Workbench (launcher → Scan for
  projects); a dep that was blocked/removed (Israelite Utility story)
  makes generated missions unjoinable → `hidden: true` until resolved.
- Scripts: a mod that starts overriding vanilla classes the toolkit also mods (`modded
  class` collisions), or changes catalog-driven behavior — skim added/changed `.c` files.

NEW CONTENT (opportunities, list them — the user decides):
- New group prefabs in the group catalogs → bucket by unit-slot COUNT (small 2 / medium 3–5
  / large 6+), sentry team candidates, defense-group candidates.
- New characters → loadout roster + subfaction candidates; new officer → `hvt`.
- New vehicles → `vehicles`/`vehicleLabels` + armed/unarmed split (walk the turret/gun-mount
  chain) + thumbnails (`generator/tools/extract-thumbnails.mjs`).
- New arsenal items (arsenal-list confs / InventoryItems catalogs) → re-run the pool
  harvester for that mod (`generator/tools/harvest-arsenal-pool.mjs`) + item thumbnails
  (auto-hover-capture pipeline); check `m_bEnabled 0` flips both ways.
- New subfaction/era catalogs (UK 1983/1989 pattern), new fortification compositions.
- Removed content (removed pairs / removed catalog entries) that the Builder still lists
  even if the file survives — drop it with the same care as a MISSING ref.

Cosmetic-only (report as a count): materials, textures, models, sounds, localization,
prefab tweaks whose GUID/path didn't move. `*_Randomized` wrapper edits don't matter unless
they replaced a concrete ref we use.

## Checklist — vehicle addons (Dax Humvees, future JLTV/Stryker/T-72…)

- `check` on every `MOD_VEHICLES` ref (catalog-only corroboration is normal for top-level
  vehicle prefabs — `OK_CATALOG`).
- New vehicles in the mod's vehicle catalog override → key naming (`<PREFIX>_…`, globally
  unique), armed/unarmed split, `vehicleSizeClass` for non-HMMWV chassis (trucks/armor
  "heavy", helis "heli" — key-pattern regex in `layout.mjs`), thumbnails (the mod's baked
  EditorPreviews when present).
- Previously disabled variants enabled (Dax tan twins) → re-harvest, label suffixes, thumbs.
- Occupant/turret changes: mounted-patrol crews come from `patrolCrew`, but a changed
  compartment layout changes how many seats fill; ammo-feed changes (own vs vanilla boxes)
  are a playtest note, not a Builder change.
- Dependencies: a vehicle mod that grows a dep (weapon pack) must list it or resolve it
  transitively — re-check `gprojDeps`.

## Checklist — core addons (ACE Medical + ACE Core)

- `check core`: the epinephrine ref (CORE_ARSENAL_POOL) + the script symbols behind the
  mission-header `m_ACE_Settings` block (`ACE_MissionHeaderSettings`,
  `ACE_Medical_Core_Settings`, `m_fBleedingRateScale`, `SetModSettings`, `OnMissionSet`).
  A MISSING symbol means the header override no longer applies → bleeding scale silently
  back to 1.0 on servers; re-read the changed `.c` files for the new mechanism.
- New per-faction catalog items appended by ACE Medical (it currently adds epinephrine to
  US/USSR/FIA) → CORE_ARSENAL_POOL candidates + `migrate()` backfill entry + thumbnail.
- ACE Core's dependency list (must stay base-game-only; ACE Medical must keep pulling ACE
  Core transitively — never list ACE Core directly).
- Settings.conf member GUID (`{60FD72EFA3DB8236}`) only matters if the header route is
  ever swapped for the conf-override fallback.

## Checklist — map addons (the tricky one)

The Builder holds three things per map: registry refs (parent world `.ent`, 3 navmesh
`.nmn`, optional `mapEntity` topo/satellite, `parentHas*` flags), a heightmap
(`web/public/heightmaps/<key>.bin/.json`, from `Terrain.terr` + `.ttile` via ts-ops-planner
`tools/map-gen/extract_heightmap.py`) and tile pyramids (`web/public/tiles/<key>/`, from
IN-GAME map screenshots via `auto_capture.py` → `grid_stitch.py` → `tile_pyramid.py` — no
offline source, re-capture costs real user time). The diff's **Map signals** section is
built to separate bug-fix updates from content updates:

| signal in the diff | meaning | action |
|---|---|---|
| only `.c`/`.conf`/`.et`/materials changed; terrain, navmesh, layers, imagery unchanged | scripts/prefab fixes | none — `check` the TERRAINS refs, advance baseline |
| `.terr`/`.ttile` CHANGED | heightmap edited | re-extract the heightmap to the scratchpad and compare against the shipped `.bin` (max/mean abs delta, where); ship the new one only if the delta is meaningful for placement (> ~1 m anywhere players build); a global sub-metre wobble is a no-op |
| world `.layer` entity counts moved (net delta ≠ 0, especially Roads / Buildings / Locations / Towns layers; forests/vegetation matter less) | settlements, roads or bases changed | tiles are stale where those layers live: pull the changed entities' coords from the `_prev`-vs-new layer diff, decide re-capture (whole map vs. affected cells — `auto_capture.py` walks a grid, `grid_stitch.py` accepts partial RR-CC sets) |
| `.nmn` navmesh changed with no layer/terrain change | nav rebake | none for the Builder (refs are by path); note it — AI pathing changes are a playtest observation |
| `.topo` / map `.edds` (satellite/topo the MapEntity uses) changed | the in-game map picture changed | re-capture tiles (this is the picture we screenshot) |
| world `.ent` changed / `parent` ref moved / layers renamed | world restructure | `check` MISMATCH lines on `parentHas*` / mapEntity → fix the TERRAINS entry; new bare world path → parent ref; regenerate the map's spike and wb-validate |
| GM world layer navmesh refs changed | nav files renamed | update `nav[]` (verify the `.nmn` files exist — Al Hadra's stale-prefab lesson) |
| `addon.gproj` deps changed | new building pack / map-on-map dep | the download helper fetches the new dep transitively; ask for a Workbench Scan for projects before validating; the registry lists only the map GUID (transitive) — nothing to change unless the map dropped a dep we relied on |
| world size / `boundMaxs` in the bare world's default.layer changed | terrain re-cut | worldSize + heightmap + full tile re-capture |

When the verdict is "WORLD CONTENT CHANGED", quantify before recommending: which layers,
how many entities, where (a `git diff`-style read of the two layer files gives coords).
A handful of prop fixes inside one village ≠ a new town. Put the recommendation and the
evidence in the report; the user decides whether to spend a capture session.

## Report format

Lead with the verdict per addon (BREAKS / RE-CAPTURE / NEW CONTENT / NO-OP), then the
evidence, then the follow-up list with the exact files to touch
(`generator/mods/<mod>.mjs`, `catalogue.mjs` TERRAINS, `input/<mod>-harvest.md`, thumbs,
spike flag to regenerate + Workbench-validate). Don't advance a baseline for an addon with
open follow-ups.

## Known accepted findings (don't re-report as new)

`check all` on 2026-09-08 (seed sweep) is clean except these — each is understood; mention
them only if the evidence CHANGES:
- **MEI — 3 AMBIGUOUS groups** (`Group_MEI_LightFireTeam` / `PlatoonHQ` / `Team_AT`): MEI
  1.3.1 ships two group catalogs that disagree (`Configs/EntityCatalog/MEI/…` vs
  `Configs/EntityCatalog/FIA/…`) and no prefab references a group, so the tool can't rank
  them. The registry holds the `EntityCatalog/MEI` GUIDs, Workbench-validated 2026-09-04
  (0 unresolved refs). Re-check only if the diff shows those catalogs changing.
- **SFS US — 1 NOT_FOUND** (`Milsim_Radios/TUO-HH-163-HP.et`): a dependency-mod item baked
  into the SFS arsenal; the 22-addon SFS dep closure is not in the audit set (and the packs
  are blocked under Reforger 1.8 anyway — see CLAUDE.md "SFS dep-mod thumbnails PARKED").
- **Ruha — MISMATCH PerceptionManager**: the bare world's `worlds/Ruha_Layers/default.layer`
  bakes in `PerceptionManager PerceptionManager1`; the registry lacks
  `parentHasPerceptionManager: true`, so generated missions add a second one named
  `PerceptionManager` (no name clash → no Workbench error, unlike Serhiivka, but two
  managers). FIXED 2026-09-08: flag set in `catalogue.mjs`, `--ruha` spike regenerated
  without the manager, Workbench-validated on Ruha 1.0.7 (exactly one PerceptionManager
  in the loaded world); `check ruha` reads OK.
- **Merak 1.0.28 — BTR.nmn → BTRlike.nmn** (first real break the sweep caught, 2026-09-08):
  registry `nav[1]` updated to `{5D2C71EE05F0C6A6}…/BTRlike.nmn`, `--merak` spike
  Workbench-validated. Lesson for the map checklist: a NOT_FOUND on a `TERRAINS.nav` ref
  means "read the GM world's default.layer NavmeshFile lines" — the GM layer is the truth.
- **Workbench dependency resolution has two paths (measured 2026-09-08)**: the LAUNCHER
  resolves deps from the game's addons folder through its project list (populated by
  "Scan for projects" — the user runs that after new downloads); a direct `-gproj` launch,
  which is what `wb_launch` does, IGNORES that list and registers only the game data, the
  Workbench addons dir and the project → `dependency '<GUID>' can't be added` + crash.
  `-addonsDir` cannot fix it (single dir, replaces the defaults, semicolon lists are taken
  literally → "Can't find 58D0FB3206B6F859 game addon" popup). The user deleted the old
  permanent junctions on purpose and chose TEMPORARY ones for MCP-driven validation:
  `junction <id>` before `wb_launch`, `junction <id> --remove` right after the check (see
  workflow step 6b). Never leave junctions behind; say in the report that they were
  created and removed.

## Gotchas

- Extractions have NO `.meta` files and prefab root `ID` lines are not resource GUIDs —
  GUID truth is inline `{GUID}path` refs only, ranked prefab > layer > catalog conf.
- `extract-addon` merges into an existing folder and never deletes — ALWAYS `rotate`
  first, or removed files go unnoticed and the diff lies.
- The game client auto-updates addons; an on-disk version can be newer than the extraction
  and than the harvest. `list` compares baseline vs disk, not extraction vs disk.
- Version strings are the author's — some never bump (Merak "NEW MAP 2" style titles,
  Serhiivka 8.0.0). The fingerprint diff is the truth; the version is a label.
- Titles with `:` were folder-named by hand (`RHS Status Quo`, `British Forces - Truck,
  Utility`); the tool matches loosely. New extractions follow extract-addon's naming.
- User-owned anchors (TS MEI Arabic Voices `0B6643C078688A29`, the toolkit) are never
  audited — their content is the user's.
- Never judge a map by the mod's own log noise; only errors referencing OUR entities count
  (Workbench step happens after the Builder is updated, not inside the audit).
