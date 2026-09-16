# Fennek + CIE Marder 1A3 — vehicle-mod harvest (2026-09-16)

Two companion VEHICLE mods for the Bundeswehr faction (BWAR), downloaded headless + extracted
2026-09-16. Registry: `generator/mods/fennek.mjs` (id `fennek`), `generator/mods/marder.mjs`
(id `marder` = CIE Marder 1A3); both `VEHICLE_MODS` entries (side-agnostic pool contributors,
Dax pattern). The Marder was FIRST integrated as the "Marder_Bundeswehr" livery pack
`654B2E111FCED38A` and swapped for the original CIE mod the same day (user verdict:
"undercooked and buggy") — the rejected pack's harvest is kept at the end for the record.
Spike: `node generator/generate.mjs --bwv` (TS_WebSpikeBWV, BWAR vs USSR).

| Mod | GUID | ver | size | catalog entries | integrated | armed | size class |
|---|---|---|---|---|---|---|---|
| Fennek | `631D7B00C9DC049E` | 1.0.81 | 1 pak | 16 | **6** (German cut) | 4 | light (2.8×5.7 m) |
| CIE Marder 1A3 | `6446DDF41914A293` | 1.0.69 | 487 MB | 2 | 2 | 2 | heavy (3.9×7.1 m) |

**Method (catalog-driven, as always):** entries = each mod's `Configs/EntityCatalog/US/
Vehicles_EntityCatalog_US.conf` (clean overrides appending `SCR_EntityCatalogEntry` members to
the vanilla US vehicle catalog; no `m_bEnabled 0`). Names = `SCR_EditableVehicleUIInfo.Name`
(LITERAL strings in both mods — neither ships string tables). Armed = the turret's
`WeaponSlotComponent WeaponTemplate` chain. Footprints = hull `.xob` AABB (header floats
@0x18/0x24). Thumbnails = the prefabs' `m_Image` refs (see below). No `.meta` files in either
dump.

---

## Fennek (`631D7B00C9DC049E`, v1.0.81, folder `Fennek_631D7B00C9DC049E`)

Workshop: https://reforger.armaplatform.com/workshop/631D7B00C9DC049E-Fennek — gproj deps =
base game only. Extraction `reference\Fennek`. Author's Fennek is a fantasy multi-role build
on the vanilla `Wheeled_Base` with BTR-70-style turret parts.

### Catalog → decision (16 entries, 6 integrated)

| prefab (Prefabs/Vehicles/Core/) | GUID | authored Name | decision |
|---|---|---|---|
| Fennek.et | `EA5E0FED9D639DD8` | Fennek 7.62 Dutch Camo | skip — Dutch (base of the whole family) |
| Fennek50call.et | `EA6F2F3A0F7F3047` | Fennek .50cal Dutch Camo | skip — Dutch |
| Fennekscout.et | `C3CFB983A2629121` | Fennek Scout Dutch Camo | skip — Dutch |
| FennekGMG.et | `326320C7CAA88D3F` | Fennek GMG HE Dutch Camo | skip — Dutch (HK GMG 40 mm, HE) |
| FennekGMGHEPD.et | `C550D13239E1AB1C` | Fennek GMG HEDP Dutch Camo | skip — Dutch |
| Fennek_rocket_turrety.et | `777B4A04FCB4F6CF` | Fennek RP Dutch Camo | skip — Dutch + fantasy rocket turret |
| Fennek_rocket_turret_V2.et | `66FC0A5B71E6F299` | Fennek Howler Dutch Camo | skip — Dutch + barrage rocket turret |
| Fennekswattest.et | `D0A89C99AA97F011` | Fennek SWAT | skip — SWAT (police lights, siren) |
| Fennekswatvernal.et | `B4A302AB1AD8675B` | Fennek SWAT Vernal | skip — SWAT |
| FennekGendarmerie.et | `07B15AAA0C1DCAD9` | Fennek Gendarmerie | skip — police (parents the SWAT prefab) |
| **FennekMCR.et** | `0AE039AE6565558D` | Fennek 7.62 German MCR | **FENNEK_MCR** (armed) |
| **FennekMCR50call.et** | `1CF79784767B4C00` | Fennek .50cal German MCR | **FENNEK_MCR_50cal** (armed) |
| **FennekMCRscout.et** | `CD679552045A8605` | Fennek Scout German MCR | **FENNEK_MCR_Scout** (unarmed) |
| **FennekTan.et** | `968CB20CFBF7DA9B` | Fennek 7.62 Tan | **FENNEK_Tan** (armed) |
| **FennekTan50call.et** | `B7F9DE8692FCD8C9` | Fennek .50cal Tan | **FENNEK_Tan_50cal** (armed) |
| **Fennektanscout.et** | `DF2F47A02E7D3479` | Fennek Scout Tan | **FENNEK_Tan_Scout** (unarmed) |

User decision 2026-09-16: German variants only, no Dutch, no SWAT. "Tan" carries no
nationality in its name (neither Dutch nor SWAT) and is the desert livery that pairs with the
BWAR Tropentarn subfaction → kept. Labels = the literal authored names (Dax convention).

### GUID corroboration

- `0AE039AE6565558D` (FennekMCR) and `968CB20CFBF7DA9B` (FennekTan) are the PARENT refs of
  their 50cal/scout children — prefab-side confirmed.
- The four leaf GUIDs (`1CF7…`, `CD67…`, `B7F9…`, `DF2F…`) are placed in the mod's own
  `worlds/real_world_Layers/default.layer` — layer-side confirmed.
- No GUID resolves to a different path anywhere in the extraction.

### Family structure

`Fennek.et` (Dutch base, 1835 lines: hull `XOB/Fennek.xob`, lights, pilot compartment,
`m_Image "{989D725D7BEE626A}Fennek.edds"`) → `FennekMCR.et` / `FennekTan.et` (livery
children: dirty wheels, `_blk`/`_tan` turret + camera + window-bar + LP-cover parts) →
`*50call` / `*scout` (swap the turret slot prefab + the ammo MultiSlotConfiguration). The
turret variants `Fennek_turret_blk/_tan`, `Fennek_turret50call_blk/_tan` are mesh/material-only
children of `Fennek_turret` / `Fennek_turret50call`; `Fennek_scout_blk/_tan` are full copies of
`Fennek_scout`.

### Armament (turret `WeaponSlotComponent` chains)

| fit | turret | weapon (slot 0) | ammo | verdict |
|---|---|---|---|---|
| 7.62 | Fennek_turret (`XOB/Turret fennek.xob`) | `Prefabs/Weapons/HeavyWeapons/Fennek_MG.et` — UI name "HAVOC", KPVT body mesh, `MagazineWellFennek762` | mod's own `…/WeapSystems/Fennek Ammo.et` ("Fennek Box", 7.62×51, M60-magazine name key) | ARMED |
| .50cal | Fennek_turret50call (`XOB/Fennek 50 Turret.xob`) | `…/HeavyWeapons/Fennek50.et` — M2HB body, `MagazineWellM2HB` | VANILLA `Box_127x99_M2_100rnd_4AP_1Tracer` | ARMED |
| Scout | Fennek_scout (`XOB/Turret fennek.xob` + camera mast) | `…/HeavyWeapons/camera.et` — a MachineGun_Base shell with a 9×19 bullet mesh, `BaseMagazineWell`, no MagazineTemplate | none | unarmed observation mast |

Every turret also carries a disabled (`Enabled 0`) second slot with the vanilla PKMT — BTR-70
copy-paste, never active. Turret storage holds vanilla KPVT/PK boxes (BTR-70 leftovers).

### Footprint / occupants / thumbnail

- Hull `XOB/Fennek.xob`: min (−1.41, 0.34, −2.83) max (1.41, 2.02, 2.91) → **2.8 × 5.7 m**, h 1.7
  → `vehicleSizeClass` default "light" (4 × 6 m slot).
- Default occupants: pilot compartment inherits `Wheeled_Base` (none set); turret gunner seat
  `m_sDefaultOccupantPrefab` = vanilla **USSR** Rifleman (author copy-paste) — irrelevant, lib.mjs
  always emits `m_aCrewPrefabPool`.
- The mod ships NO EditorPreviews; the single `m_Image` for the whole family is the
  2435×1242 splash `Fennek.edds` (the DUTCH camo Fennek, "NL" plate — unusable for the German
  keys). Thumbs = **user in-game screenshots** (2026-09-16, `input/fennek_thumbs/*.png`, one
  per key, ~1200×1100 three-quarter views on an airfield apron) → centre 4:3 crop by full
  width → 200×150 under the prefab basenames (`web/public/icons/prefabs/FennekMCR.png` …).
  The "German MCR" livery is a brown/dark-brown blotch camo (Tropentarn-like) with an Iron
  Cross; "Tan" is plain sand with the same marking.
- Other shipped content (benign): `InventoryItems_EntityCatalog_US.conf` override (appends
  the mod's ammo boxes — vehicle items, not arsenal pool material), `AvailableActions.conf` /
  `chimeraInputCommon.conf` / `keyBindingMenu.conf` overrides (custom turret controls),
  `Ammo_762x51.conf` + `GMG grenade.conf` + `water.conf` ammo configs, a `worlds/real_world`
  test world, "Swat Lights" assets, cat props (`cat_sleep.et`, `cat_button.et` — easter eggs).

---

## CIE Marder 1A3 (`6446DDF41914A293`, v1.0.69, folder `CIEMarder1A3_6446DDF41914A293`)

Workshop: https://reforger.armaplatform.com/workshop/6446DDF41914A293-CIEMarder1A3. Extraction
`reference\Marder 1A3` (487 MB pak: `Assets/Marder 1A3 Body.xob`, turret, tracks, wreck,
Rh-202/MG3A1/MILAN meshes, own ammo configs). The ORIGINAL Marder — full vehicle build on
vanilla `Wheeled_Base` with the CIE tracked-vehicle scripts.

### Dependency chain (transitive — registry lists `6446DDF41914A293` only)

| addon | GUID | ver | size | role |
|---|---|---|---|---|
| CIE Tracked Core | `68CD35053063C6D5` | 0.0.112 | 25 MB | tracked-vehicle scripts (`LTM_*` wheels/tracks); references a non-shipping `Leopard2A6_body.xob` + `CIE_VehLockAction` class → log noise |
| ATGM | `6A4545CCB3516E86` | 1.0.1 | 99 MB | the MILAN pod (`CIE_Pod_Milan` parents vanilla XM65) |
| CIE_Thermal ("1_Night_Vision") | `68F8A813D7EF1E30` | 1.0.73 | 3.4 MB | thermal gunner sight; its gproj carries dozens of empty `""` dependency strings (author noise) |

### The 2 catalog entries (`Prefabs/Vehicles/Tracked/`)

| prefab | GUID | authored Name | our label | m_Image | corroboration |
|---|---|---|---|---|---|
| Marder_1A3.et (3036 lines) | `7D0A4C3F2E19B6A8` | Marder 1A3 | Marder 1A3 | `UI/marder1a3_SA.edds` | parent ref of the no-slat child → prefab-side OK |
| Marder_1A3_DONT SLAT ARMOR.et (76 lines, child) | `3EB200BAC8871C85` | (inherits) | Marder 1A3 (no slat armor) | `UI/marder1a3.edds` | catalog-only leaf (OK_CATALOG) |

The child only clears the 21 `Slat_*` part slots (`Slat_armor_base.et`). File name contains
SPACES — verbatim. `Configs/Editor/PlaceableEntities/Vehicles/Marder.conf` lists a single
`Wheeled/Marder 1A3/Marder 1A3 Ukrainian Army.et` `{B5BB0824C6108CC2}` that does NOT ship —
ignored (catalog rule). `m_sFaction "US"`, `m_eSlotTypes 48`.

### Armament (`VehParts/Turret/Marder 1A3_Turret.et`, 4 weapon slots)

| slot | weapon | ammo |
|---|---|---|
| 0 | `HeavyWeapons/Rheinmetall Rh-202 20mm.et` | `Box_20x139_DM63A1_APDS-T` |
| 1 | `HeavyWeapons/Rheinmetall Rh-202 20mm HEI-T.et` | `Box_20x139_DM41A1_HE-I` |
| 2 | `MachineGuns/MG3A1/MG3A1.et` (parents vanilla MG_M60D_base) | `Box_762x51_M60_500rnd_Ball` |
| 3 | `AircraftWeapons/RocketPods/CIE_Pod_Milan.et` | `K-125 ROCKET ATGM MILAN`; `magazine_40mm_ Smoke` for `Marder_SmokeLauncher.et` |

Compartments: pilot + turret gunner (`Character_US_Rifleman` default) + commander + 7 cargo
(`CargoCompartment_LAV25.conf`).

### Footprint / thumbnails

- `Assets/Marder 1A3 Body.xob`: min (−1.88, 0.29, −3.81) max (1.97, 3.77, 3.24) → **3.9 × 7.1 m**,
  h 3.5 → `vehicleSizeClass` "heavy" via the `MARDER_` prefix.
- Thumbs: the two `m_Image` refs (400×300 in-game shots) → extract-thumbnails direct-.edds path
  → 200×150 `Marder_1A3.png` / `Marder_1A3_DONT SLAT ARMOR.png`.
- Workbench noise from the chain (all theirs): `Unknown class 'CIE_VehLockAction'`, `Wrong
  GUID … Leopard2A6_body.xob` / `MI_COL.gamemat` / `metalslatearmor.gamemat` /
  `Explosion_AIM9.ptc` / `NV_WhitePhosphor_HDR.emat`, `Vehicles_Marder_Dampers.acp` compile
  failure, orphan `Marder_Track/*.edds.meta`.

---

## REJECTED: Marder_Bundeswehr (`654B2E111FCED38A`, v1.0.16) — harvested then dropped 2026-09-16

Workshop: https://reforger.armaplatform.com/workshop/654B2E111FCED38A-Marder_Bundeswehr. A
livery/loadout pack on top of CIE Marder 1A3: 5 US-catalog prefabs
(`Prefabs/Vehicles/Wheeled/Marder 1A3/Marder_Bundeswehr_{01,Camo_02,Camo_03,Sandy_01,Sandy_Camo_01}.et`,
GUIDs `0DE859516BBFF053` / `61BC6DB1D77B7F7D` / `AD1A14E0B2E93E2D` / `155E916362CDA586` /
`7CF506387F9509C4`), each a ~3000-line self-contained copy of the CIE Marder with Bundeswehr
`.emat`s, `_notTermal_…_NotRHS` turrets and `Description "Ukrainian Army"` copy-paste; "CAMO"
= camouflage netting. gproj deps: CIE Marder + BGONE `5F1EE615E7AE3106` + WCS_Armaments +
WCS_SpaceCore. User playtest verdict: undercooked and buggy → replaced by the original CIE mod
above; its baseline, thumbnails and junctions were removed. Extraction left in
`reference\Marder_Bundeswehr` (delete at will).

---

## Builder integration summary

- `layout.mjs` `vehicleSizeClass`: `MARDER_` → heavy; `FENNEK_` keys stay light.
- Junctions for Workbench validation: `audit.mjs junction fennek` / `junction marder` (the
  latter creates 4 — the mod + Tracked Core / ATGM / Thermal).
- Baselines seeded 2026-09-16 (`631D7B00C9DC049E`, `6446DDF41914A293`).
- Playtest gates: Fennek turret controls (custom input overrides), Fennek scout mast as an
  unarmed patrol vehicle, Marder AI gunnery (Rh-202 + MILAN under MountedPatrol/QRF), Marder
  heavy-slot spacing at spawn, Fennek deliver completion.
