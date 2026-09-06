# Dax Humvees — harvest notes (2026-09-06, mod v1.3.21)

Workshop: https://reforger.armaplatform.com/workshop/62DA2C805FEB90A1-DaxHumvees
Addon GUID `62DA2C805FEB90A1`; gproj deps = base game only → registry
`dependencies: ["62DA2C805FEB90A1"]`. Extraction: `reference\Dax Humvees`
(737 files, single `data.pak`). Junctioned into the Workbench addons dir as
`DaxHumvees_62DA2C805FEB90A1` (2026-09-06).

First VEHICLE mod (side-agnostic pool contributor — no faction, no side
gating). Registry: `generator/mods/daxhumvees.mjs`.

## Sources

- **Vehicle list (authoritative, catalog-driven rule)**:
  `Configs/EntityCatalog/US/Vehicles_EntityCatalog_US.conf` — a clean override
  of the vanilla US vehicle catalog appending 14 `SCR_EntityCatalogEntry`
  members with `{GUID}path` prefab refs. All 14 prefabs live in
  `Prefabs/Vehicles/Wheeled/M998/Green/` — **paths contain spaces**
  ("M1025 11.et"), copy verbatim.
- `Configs/Editor/PlaceableEntities/Vehicles/DaxHumvees_Vehicles.conf` is NOT
  usable — it's a full `SCR_PlaceableEntitiesRegistry` dump that also lists
  hundreds of vanilla prefabs (author exported the whole registry).
- **Labels**: each prefab's `SCR_EditableVehicleComponent` → `m_UIInfo` →
  `Name` — literal strings, no localization keys ("M1025 11 (M2)", …).
- **Cross-check (Arma II trust rule)**: catalog GUIDs for "M1025 31"
  (`30FD13597422B058`, referenced as parent by all three DUKE variants) and
  "M998 01" (`238759D0C0F71442`) are corroborated prefab-side; no GUID
  resolves to a different path anywhere in the extraction.

## The 14 vehicles (key → name → armament)

Armament resolved by walking the roof/gun-mount part chains
(`VehParts/M1025_roof_M2_*` → `M1025_gun_mount_*`):

| key | name | armament |
|---|---|---|
| DAX_M1025_11 | M1025 11 (M2) | M2HB (roof_M2_11) |
| DAX_M1025_12 | M1025 12 (M60) | M60 (roof_OpenShortNew_12) |
| DAX_M1025_13 | M1025 13 (DUKE) | unarmed — DUKE ECM, open-back roof |
| DAX_M1025_21 | M1025 21 (M2) | M2HB (roof_M2_21old) |
| DAX_M1025_22 | M1025 22 (M60) | M60 (roof_M2_22) |
| DAX_M1025_23 | M1025 23 (DUKE) | unarmed — DUKE ECM |
| DAX_M1025_31 | M1025 31 (M2) | M2HB (roof_M2_31a) |
| DAX_M1025_32 | M1025 32 (M60) | M60 |
| DAX_M1025_33 | M1025 33 (DUKE) | unarmed — parents 31 but overrides the roof to Openback_33 |
| DAX_M998_01 | M998 01 Platoon | unarmed troop carrier (TC canopy) |
| DAX_M998_02 | M998 02 Platoon (M2) | M2HB (mod's own M151A2-style mount) |
| DAX_M1025_MORTAR_03 | M1025 03 Mortar | unarmed carrier — deployable M252 parts as cargo |
| DAX_M998_04_ENGI | M998 04 Engi | unarmed (its M60 ammo-rack slot ships `Enabled 0`) |
| DAX_M997_MEDIC | M997 41 Medic | unarmed ambulance (parents vanilla M997) |

The 11/12/13 · 21/22/23 · 31/32/33 numbering = bumper/callsign rows; variants
in a row differ in interior stowage, not chassis. All are HMMWV-chassis
ground cars → `vehicleSizeClass` default "light" is correct for every key.

## Tan/desert variants: SHIPPED-BUT-DISABLED by the author (checked 2026-09-06)

The Workshop description advertises 28 variants — 14 green + 14 tan — with
the caveat **"[TAN currently disabled]"**. The v1.3.21 pak matches that
exactly: it ships the tan SUPPORT content — `VehParts/TAN/*` roofs/gun
mounts, tan props (Bumper1tan, floor1tan, cover1_tan…) and a full second
preview set (`Assets/Data/Previews/DH-_0000s_*` = tan renders, verified
visually; the `DH-_0001s_*` set the shipped prefabs reference = green) — but
NO tan vehicle prefabs: nothing in the pak references the TAN parts or the
0000s previews, and the US EntityCatalog lists only the 14 `Green/` vehicles.
So the current 14-key registry is COMPLETE; every vehicle is the green
livery, which is why the labels carry no color suffix (vanilla convention:
base livery unsuffixed, variants get "(tan)" like MERDC). When the author
re-enables tan: re-harvest the catalog, append the tan keys with "(tan)"
labels, and map their thumbs to the DH-_0000s previews.

## Mounted-MG ammo (user question, answered 2026-09-06)

- **M2 mounts: VANILLA ammo.** The turret weapon is the mod's own
  `Prefabs/Weapons/HeavyWeapons/HMG_M2HB_pintle_M1025.et`
  (`{9BB8CDE624AAE99C}`) but it merely PARENTS the vanilla pintle M2
  (`{E517E6CCC1DF5737}`, same relative path) and adds storage-purpose flags —
  no magazine or ballistics changes, so it feeds from the vanilla 12.7×99
  boxes. The mod's `Prefabs/Weapons/Magazines/Box_127x99_M2_100rnd_Base.et`
  is a clean OVERRIDE of the vanilla box base (same parent + same root ID
  `476AE746F954DD20`) that only tags it `CommonItemType "MG_AMMO"` so the
  mod's `DAX_TurretAmmoRackComponent` (scripts/Game/Ammorack/) can pull
  reloads from the on-turret ammo-rack storage.
- **M60 mounts: mod's OWN magazine.** `MG_M60_Mounted.et` sets
  `MagazineTemplate` to the mod's `Box_762x51_M60_200rnd_4Ball_1Tracer.et`
  (`{29C6598DF2522D25}` — vanilla ships only 100/500rnd M60 boxes). It
  parents the vanilla 100rnd base (root ID `0922E741B2667475`), so
  projectiles/ballistics are vanilla; only capacity (200) and the box model
  are the mod's.
- Net: everything resolves inside the mod + base game — no extra deps.

## Thumbnails

The mod ships its own baked previews (`Assets/Data/Previews/DH-_0001s_*.edds`,
referenced per prefab via `m_UIInfo m_Image` — the author reuses one image per
variant family: 11/21 share, 12/22 share, all three DUKEs share). Converted
2026-09-06 with `generator/tools/extract-thumbnails.mjs --size 200x150`
(direct .edds inputs) and copied to `web/public/icons/prefabs/<prefab
basename>.png` ("M1025 11.png" … — spaces kept, matching `thumbFromRef`).
No THUMB_FALLBACKS entries needed.

## Workbench validation (2026-09-06)

Spike `node generator/generate.mjs --dax` (TS_WebSpikeDax: US vs USSR; Dax
spawn vehicles, mixed vanilla+Dax mounted patrol, Dax deliver target) —
addon.gproj lists `62DA2C805FEB90A1` exactly once; world opens, all generated
entities present, zero log errors referencing our resources. The mod ships
its own log noise: orphan `.meta` entries (shield/turret test assets) and
stale internal GUID refs (`turret1.emat`, `Vehicles_M998_Dampers.acp`,
`DAX_Localization.st`, backpack icon .edds) — theirs, ignore.

Playtest gates pending: player-side spawn (turret usable, ammo-rack reload),
enemy mounted patrol crews (USSR patrolCrew in Dax seats), deliver objective
completion with a Dax prefab.
