# Bundeswehr Mod harvest reference (2026-09-15)

Raw harvest results from the unpacked dumps
(`D:\VSCode_dev\arma-reforger\reference\Bundeswehr Mod`, v0.2.0, Workshop updated 2026-09-12;
`D:\VSCode_dev\arma-reforger\reference\PZG GER Vanilla Reskin`, v1.0.1). The curated cut lives
in `generator/mods/bundeswehr.mjs`; this doc keeps the superset + provenance.

## Addons / bundle

- **Bundeswehr Mod** `59673B087BFF710C` — 2.7 GB (data.pak + data001.pak), own `.gproj` deps =
  base game only. Version 0.2.0 = early, actively developed (created 2026-05-24): expect GUID
  churn on updates → `/addon-audit bundeswehr` after every version bump (baselines seeded
  2026-09-15).
- **PZG GER Vanilla Reskin** `685EC277A4031C83` — 97 MB, base game only. BUNDLED as a second
  dependency of the same registry def (user decision 2026-09-15: the Bundeswehr mod ships one
  unarmed vehicle; the reskin supplies the armed patrol pool). Alternatives considered and
  skipped for now: Fennek `631D7B00C9DC049E`, G-Series G300 `6996E9DDF9E5F3BF`, Marder
  `654B2E111FCED38A` (heavy dep chain).
- Both GUIDs go into `addon.gproj` whenever BWAR is a mission side (usage-derived deps).

## GUID trust rules

No `.meta` files in either dump; every character prefab shares root `ID "520EC961A090B1EE"`
(mirrors vanilla Character_Base), every group `0000000000000001`. Sources used (inline
`{GUID}path` refs only):

- Faction entry: `Prefabs/MP/Managers/Factions/FactionManager_Editor.et` (the mod's override
  of the vanilla prefab, same root ID `56B2B4776E6E4499`) → member `{69B9258ECBAB97DF}` :
  `{DED67C541C41B460}Configs/Factions/BWAR.conf`, `m_bIsPlayable 0`.
- Groups: `Configs/EntityCatalog/BWAR/BWAR_Groups_EntityCatalog.conf`.
- Characters: `Configs/EntityCatalog/BWAR/BWAR_Characters_EntityCatalog.conf` (+
  `Prefabs/MP/Managers/Loadouts/LoadoutManager_BWAR.et` for the author's playable roster).
- Vehicles: `Configs/EntityCatalog/BWAR/BWAR_Vehicles_EntityCatalog.conf`; reskins from the
  reskin pack's `Configs/EntityCatalog/US/Vehicles_EntityCatalog_US.conf` (an OVERRIDE of the
  vanilla US vehicle catalog — see below).
- Spawn point: `Worlds/Showcase_BWAR_Layers/default_DO_NOT_ADD_STUFF_HERE.layer` →
  `{3D5097F57981B0BB}Prefabs/MP/Spawning/SpawnPoint_BWAR.et`. The editable
  `PrefabsEditable/SpawnPoints/E_SpawnPoint_BWAR.et` exists but nothing references it by GUID
  (the Systems.conf registry lists only arsenal boxes) → plain spawn point used.
- Arsenal: `Configs/EntityCatalog/BWAR/BWAR_InventoryItems_EntityCatalog.conf` (243 entries,
  0 disabled) + the character prefabs for the carried set.

Stale internal paths (GUIDs resolve, files renamed): `BWAR_Character_Squadleader.et` (= SL,
referenced by the NotSpawned RifleSquad), `Mortar_MRS120.et` / `Part_MRS120_*.et` (=
`BWAR_*`), rank patches under `Combatshirt_Short/` + `Jacket_Short/Patch_*` (= `Jacket_Short/
BWAR_Patch_*`). The audit tool's ranking trips on ONE of them: the AT characters reference
`{AB479EBF284550EC}…/BWAR_Launcher_PzF3.et`, but that GUID is the `_Extended` launcher's (the
plain launcher's own parent line says so) — the plain launcher is `{9BD71AF57C0490C5}`
(catalog + showcase layer). Same for the PzF3 rounds: `{AA735CE9A40FD288}` DM32 /
`{11ED2DBDE8EECA48}` DM72A1 are the plain mags (catalog + launcher magazine wells);
`{5C9607595BC3BBFC}` / `{72D65F6D8CE38B0C}` are the `_Extended` mags. Recorded as an accepted
finding in the addon-audit SKILL.md.

## Faction

- Key `BWAR`, `#BWAR_Faction_Name` = "Bundeswehr" (UC "BUNDESWEHR"), description "Armed forces
  of the Federal Republic of Germany", `m_FactionLabel FACTION_BWAR`, BLUFOR base, radio 48000,
  encryption "Sauerkraut", **friendly to `US`** (symmetric → cleared on the BWAR member in
  US-vs-BWAR missions, UK pattern; Workbench-validated in `--bw-enemy`).
- Callsigns: inline `SCR_FactionCallsignInfo "{5DA0F2A6677ADA9E}"` parented to vanilla
  `{CB7824D572DD0D5C}Configs/Callsigns/Callsigns_US.conf`, NO squad overrides → squadBase =
  the vanilla US four (`{55CCB792D10AD8F4}` `{55CCB792D13759D8}` `{55CCB792D1218E95}`
  `{55CCB792D0C8B3CE}`). The instance GUID is byte-identical to British Forces' copy-paste.
- Identity: vanilla heads/bodies, `SoundIdentity` VoiceIDs 1/2 = vanilla US voices (English
  radio protocol, like UK). `BWAR_Character_Base.et` adds `RadioProtocol_Report_2_US.acp`.
- Home territory conf = German federal states (cosmetic).
- The mod also ships `FactionManager_BWARxUSSR.et` (a BWAR+USSR manager for its showcase),
  `LoadoutManager_BWAR.et` (18 loadouts incl. "Unarmed" base loadout), `GameMode_Base.et`
  override adding `BWAR_LicensePlateManagerComponent`, `EditorModeEdit.et` registry append,
  `EditableEntityCore.conf` label additions (FACTION_BWAR, BWAR_CAMO Flecktarn/Tropentarn) —
  all additive deltas.

## Groups (catalog order; slot roles from `m_aUnitPrefabSlots`)

Flecktarn `Prefabs/Groups/Bundeswehr/BWAR_Group_<name>.et` / Tropentarn
`…/Tropen/BWAR_Group_<name>_3FT.et` — identical role lists, all parent vanilla
`{EACD97CF4A702FAE}Prefabs/Groups/BLUFOR/Group_US_Base.et`.

| name | slots | roles | Flecktarn GUID | Tropentarn GUID | in registry |
|---|---|---|---|---|---|
| RifleSquad | 8 | SL TL MG AMG Medic Grenadier AT AT | `027F7157D1D94E05` | `6F18A6FE0BAD2DF2` | large + defense (size 8) |
| FireTeam | 4 | TL AT AT Grenadier | `84E5BBAB25EA23E6` | `0BCDD88303A75A88` | **EXCLUDED** (Flecktarn GUID collides with SFS US's Group_US_FireTeam — both = vanilla `…23E5`+1; Tropentarn dropped for symmetry) |
| FireTeam_Guard | 4 | TL AT AT Grenadier | `06B8470DE0EDDF63` | `20BB16D91E866632` | medium |
| LightFireTeam | 4 | TL Rifleman ×3 | `6E72CE24FFDDB286` | `8495CE04D59A040D` | medium |
| Team_GL | 4 | TL Rifleman Grenadier ×2 | `7026A94ADBE983D1` | `C7D4EFA10F95DAAE` | medium |
| Team_LAT | 4 | TL Rifleman AT ×2 | `CC0C75439B0B3F3A` | `15EA759FD633930A` | medium |
| Team_Suppress | 4 | TL MG AMG Grenadier | `FC0EF5D74FD1C536` | `5E92C8558C2224C6` | medium |
| PlatoonHQ | 4 | PL Sergeant RTO Medic | `1C5D152DAC6DE815` | `56ECF4EA0EFEC854` | medium |
| AmmoTeam | 4 | AMG ×2 Ammo ×2 | `5795D9156E591B85` | `03294A6AEB3DAF09` | medium |
| SentryTeam | 2 | Rifleman ×2 | `A24C8371464BA2D1` | `B82A707CA4C81F16` | small + sentry |
| MachineGunTeam | 2 | MG AMG | `99B65E40BA7687F9` | `345AA810A2AC8399` | small |
| MedicalSection | 2 | Medic ×2 | `E35465842A1598DB` | `9D684B9139759422` | small |
| ReconTeam | 2 | Scout RTO | `DC53F57F0D335847` | `185E032FAABD0DD3` | small |
| SapperTeam | 2 | Sapper ×2 | `4D87BB5D817BCA04` | `45DA513EE9020CC9` | small |
| EngineerTeam | 2 | Engineer ×2 | `48C97BE37EAE9A08` | `5DB38892E14418CF` | small |
| SniperTeam | 2 | RTO Marksman | (not cataloged) | (not cataloged) | **excluded** — prefab ships, catalog omits it (catalog-driven rule) |
| Transport | 2 | Rifleman ×2 (RETURN_FIRE, TransportUnit) | `389215E699BD064A` | `4957A91D8894C636` | excluded (Transport rule) |
| Base | 0 | — | — | — | excluded |
| AmbientPatrols/*_NotSpawned ×5 | — | `m_bSpawnImmediately 0`, delayed member spawn | `A47C6B46C1677850` `43D264DE2E6EAA55` `5B2AD9513441BACC` `EF38A26F2059997A` `0E09D04F06B61C73` | — | excluded (ambient-patrol shells) |

Registry pools per set: small 6, medium 7, large 1 (RifleSquad). Baked previews exist for 13
groups (`UI/Textures/EditorPreviews/Groups/BLUFOR/Bundeswehr/`) — unused by the web.

## Characters

`Prefabs/Characters/Factions/BLUFOR/Bundeswehr/BWAR_Character_<role>.et` (Flecktarn) and
`…/Tropen/BWAR_Character_<role>_3FT.et`. All concrete roles are ARMED in their own prefab
(G36A3 ZO4x30; SL/Grenadier G36A3 AG40; MG MG5A2 ZO4x30i; Marksman G28 PMII; AT + PzF3;
Rifleman also carries a P8A1; Officer = P8 mags only, no rifle). Chain: Character_Base.et
(Rifleman/SL/TL/…/Officer) or vanilla `Character_US_BaseLoadout.et` (PL, Randomized).

| role | string-table name | Flecktarn | Tropentarn | registry |
|---|---|---|---|---|
| Rifleman | Rifleman | `9A5161184FEEEDBF` | `2B099D45A90FAF36` | loadout, riflemen, crew |
| Grenadier | Grenadier | `DA758A4FD5998CF3` | `80766458E84F87D3` | loadout |
| MG | Machine-Gunner | `D4A48867674F2C88` | `28A3366D0E910E4F` | loadout, crew |
| AMG | Machine-Gunner Assistant | `55C787F9CF964831` | `620D6CF4D17E95C3` | loadout |
| Ammo | Ammunition Bearer | `5430AA7481E96345` | `F59D4DEBBB719C0E` | loadout |
| AT | AT Riflemen | `149BDF6162AB5470` | `8A0C25A7AD676BC6` | loadout, crew |
| Marksman | Marksman | `30D1786FC6E2F847` | `4967711ACA970B61` | loadout |
| Medic | Medic | `6B2DA1277F16C6B7` | `BB74B7B3D08ED5DA` | loadout, crew |
| RTO | Combat Signaler | `03E3BE7DC3BDACB7` | `1EC2F00E8F661603` | loadout ("Radio Operator") |
| Sapper | Sapper | `9585DBF6F55C2FAF` | `366D894E0998250E` | loadout |
| Engineer | Engineer | `8F41526498108AC4` | `23581816093823A2` | loadout |
| Scout | Scout | `9193CE7A1A06009F` | `1A6F5D23E4CE2FD6` | loadout |
| TL | Team Leader | `A67CBDEE4F2052FC` | `5A0B45F504E89644` | loadout, crew |
| SL | Squad Leader (`#BWAR_Role_Squadleader`) | `9AF20C687BF04BF5` | `43C20EA294547346` | loadout |
| Sergeant | Sergeant | `F637ADD675BFB1BF` | `115C13A51F3D0ADB` | loadout |
| PL | Platoon Leader | `38A5FE263441D9AF` | `4DDC4AEAA9A37C9C` | loadout |
| Officer | Officer | `F5E2E8A6DC6017B9` | `625F272A77B8E841` | loadout, **hvt** (Flecktarn) |
| BaseLoadout | Unarmed | `789D0116CBABF5D8` | `3587937C4591C1B4` | excluded (no weapons) |
| Randomized | Random GER Soldier | `BE6CAA57A0D38F9B` | `29B493C4DB0CC896` | excluded — `SCR_EditableEntityVariantData` wrapper over the UNARMED vanilla US base loadout (individual spawns would be unarmed) |

Playable roster = 17 loadouts per camo subfaction (author's LoadoutManager minus "Unarmed").
The DE string table is real German; RU/all others are copies of EN (RU names shown = EN).

## Vehicles

- Mod's own: `{193CAE259137911B}Prefabs/Vehicles/Wheeled/Dingo2/BWAR_Dingo2A3_2B.et` (Flecktarn),
  `{F373992A38F2FEF4}…/BWAR_Dingo2A3_2B_3FT.et` (Tropentarn) — "Dingo 2 A3.2B". UNARMED:
  `BWAR_Dingo2_Base.et` registers a `Turret` slot but neither variant fills it. 7 seats
  (driver, co-driver, 5 passengers), default occupant = vanilla `Character_US_Rifleman`
  (→ patrolCrew matters, emitted as always). Hull AABB 2.88 × 4.49 × 6.17 m →
  `vehicleSizeClass` heavy (`BWAR_Dingo2` prefix). Preview shipped →
  `web/public/icons/prefabs/BWAR_Dingo2A3_2B.png` (200×150), 3FT falls back to it.
- Also shipped, not used: `BWAR_Mortar_MRS120.et` `{D5D51F54E2639F39}` (WeaponTripod catalog),
  `BWAR_MortarPlacement_S_DE_01.et` slotted composition, GER flag poles/flags.
- **PZG GER Vanilla Reskin** — 20 catalog entries (one listed twice) over 17 prefabs, all
  parented to vanilla US prefabs with German-camo `.emat`s; file names contain SPACES:

| key | GUID | prefab | vanilla parent | armed |
|---|---|---|---|---|
| M151A2_GER | `9BDDB06E8D3E3D8D` | `M151A2/M151A2 PZG GER.et` | M151A2_MERDC | no |
| M151A2_transport_GER | `A59B6CE827176166` | `M151A2/M151A2 Roof PZG GER.et` | M151A2_transport | no |
| M151A2_M2HB_GER | `B45E86F64FD17B13` | `M151A2/M151A2 armed PZG GER.et` | M151A2_M2HB | **M2HB** |
| M998_covered_GER | `F51C4A5DEFEC9E90` | `M998/M1025 light PZG GER.et` | M998_covered | no |
| M1025_GER | `61C45911C277F184` | `M998/M1025 PZG GER.et` | M1025 | no |
| M1025_armed_M2HB_GER | `29B6B56EB4ADC157` | `M998/M1025 armed PZG GER.et` | M1025_armed_M2HB | **M2HB** |
| M997_maxi_ambulance_GER | `EDEBB5E916D0D8E5` | `M998/M1025_maxi_ambulance_GER.et` | M997_maxi_ambulance | no |
| M923A1_transport_GER | `40CC95401F931557` | `M923A1/M923A1 transpo 1 PZG GER.et` | M923A1_transport | no |
| M923A1_transport_covered_GER | `2F4496DBB6BF8195` | `M923A1/M923A1 covered PZG GER.et` | M923A1_transport_covered | no |
| M923A1_tanker_GER | `7D5A6B25C6622144` | `M923A1/M923A1 tanker PZG GER.et` | M923A1_tanker | no |
| M923A1_command_GER | `1C39719492E2DF66` | `M923A1/M923A1 Command PZG GER.et` | M923A1_command | no |
| M923A1_arsenal_GER | `515237604A3896FC` | `M923A1/M923A1 Arsenal PZG GER.et` | M923A1_arsenal | no |
| M923A1_repair_GER | `4AAF0D3BC2B93ED1` | `M923A1/M923A1 repair PZG GER.et` | M923A1_repair | no |
| M923A1_engineer_GER | `E293F1978E4A4F08` | `M923A1/M923A1 Engineer PZG GER.et` | M923A1_engineer | no |
| LAV25_GER | `A431F97175AFB711` | `LAV25/LAV25 PZG GER.et` | LAV25 | **turret** |
| UH1H_GER | `19957370950822FC` | `UH1H/UH1H PZG GER.et` | UH1H | no |
| UH1H_armed_GER | `B63FCA821F1AAF27` | `UH1H/UH1H armed PZG GER.et` | UH1H_armed | door guns |
| UH1H_gunship_HEDP_GER | `62B49833125D09EA` | `UH1H/UH1H gunship PZG GER.et` | UH1H_armed_gunship_HEDP | gunship |
| UH1H_supply_GER | `71F5CD3C708CAE11` | `UH1H/UH1H Supply PZG GER.et` | UH1H_base | no |

  The reskin's catalog override also sets `m_bEnabled 0` on 30 vanilla US member entries
  (every vanilla US vehicle except the Conflict variants) — this only affects catalog
  consumers (GM placement browser, Conflict spawners, supply lists); our SF slots spawn by
  prefab ref, so a US-vs-BWAR mission still spawns vanilla US vehicles fine
  (Workbench-validated `--bw-enemy`: vanilla M151A2/M923A1 spawn slots resolved). The reskin
  ships NO previews → `THUMB_FALLBACKS` in `destroyObjects.ts` map the prefab basenames (with
  spaces) to the vanilla parents' PNGs. Its `M923A1 covered PZG GER` logs a harmless
  "BaseRadioComponent does not have any transceiver" warning; its M998 damper `.acp` ref is a
  stale GUID (the reskin's noise, not ours).
- Registry pools: armed = M151A2_M2HB_GER, M1025_armed_M2HB_GER, LAV25_GER; unarmed =
  M151A2_transport_GER, BWAR_Dingo2A3_2B, M923A1_transport_covered_GER.

## Fortifications

None shipped (only arsenal-box props + a mortar pit) → vanilla US road/roadside pools copied.

## Arsenal

- Pool: `generator/arsenal-pool-bundeswehr.mjs` (242 items after dedupe; harvester source
  `bundeswehr`, `--only bundeswehr` re-harvests it alone). The catalog's `BWAR_PATCHES`
  category/type (43 rank patches, mod-extended enum) folds into Other; 23 entries are vanilla
  prefabs (US medical kit, M14/M15 mines, M112 + M34, ANPRC-68/77, compass/map/flashlight/
  watch/binoculars/E-tool, jerrycan, repair/medical/rearming kits, mine flag, sandbag part,
  personal belongings) that dedupe against the vanilla pool in the modal. NAME_OVERRIDES: the 2
  PzF3 round prefabs carry no Name at all, and the 14 magazine pouches point at
  `#RHS-Vest_Blueforce_Pouch_Name` (an RHS key no shipped table defines).
- Thumbnails: `--thumbs-bw` spike (`TS_WebSpikeThumbsBW`) puts the 219 pool items NOT in the
  vanilla pool in the crate, pool order, WEAPON_VARIANTS forced flat → capture with
  `auto-hover-capture.py` + `tooltip-thumbs.py` (see CLAUDE.md "Item thumbnails"). Pending
  until the user captures.
- Baked default set (registry `arsenalItems`, 32 entries): PzF3 + Bunkerfaust launchers and
  their DM32/DM72A1 rounds; G36 (DM11/DM21), G28 (DM111/DM41/DM21A2), MG5 (4B1T/AP), P8 mags;
  DM42 40 mm HE; DM51 frag + HE; DM45/DM21/DM23/DM26 smokes; M112 + M34, M14 + M15AT; vanilla
  US medical ×4; M22 binoculars, AN/PRC-163 (mod) + AN/PRC-68 + AN/PRC-77; Trizip backpack
  (the mod's only backpack — the RTO carries the vanilla PRC-77). MP7/MG4/Gen3PM/G95 magazines
  exist in the catalog but no character issues those weapons → left to the Arsenal Builder.
  ACE epinephrine is appended by the core pool as usual.

## Scripts / overrides (risk review)

37 `.c` files, 6 modded classes (`SCR_InventoryStorageBaseUI` ×2, `SCR_InventoryStorageLBSUI`
×2, `SCR_InventoryStorageManagerComponent`, `SCR_RadioComponent`,
`SCR_CharacterCameraHandlerComponent`, `SCR_AttributesManagerEditorComponentClass`) — NVG,
license plates, tactical signs, pistol holster cosmetics, magazine pouch inventory areas,
PzF3 tandem swap. Nothing touches factions, spawning or the Scenario Framework.

## Spikes / validation (2026-09-15)

- `--bw` (`TS_WebSpikeBW`, BWAR Flecktarn vs USSR; Dingo + M1025 M2HB GER + M923A1 covered GER
  spawn slots): Workbench world load clean, both addon GUIDs in `addon.gproj`, 0 errors on our
  resources.
- `--bw-enemy` (`TS_WebSpikeBWEnemy`, US vs BWAR Tropentarn; mounted patrol M1025 M2HB GER +
  Dingo 3FT): friendly list cleared on `{69B9258ECBAB97DF}`, 26 Tropentarn refs + Officer hvt
  resolved, 0 errors on our resources (the mod's own "RigidBodyComponent on model without
  geometry" lines for helmet/pouch/holster xobs are its noise).
- `--thumbs-bw`: world loads; the arsenal conf itself can't be opened through the Workbench
  bridge (worlds only — the "Cannot open prefabs at this time" dialog), so its 219 refs were
  cross-checked offline: every path exists in the extraction, the only GUID disagreements are
  the PzF3 launcher/rounds above (resolved prefab-side in our favour).
- Temporary junctions `BundeswehrMod_59673B087BFF710C` + `PZGGERVanillaReskins_685EC277A4031C83`
  were created via `audit.mjs junction bundeswehr` and LEFT IN PLACE for the thumbnail
  capture — remove with `node .claude/skills/addon-audit/scripts/audit.mjs junction bundeswehr --remove`
  afterwards.
- Log noise owned by the mods (ignore): `Wrong GUID … Language/BWAR_localization.st` (stripped
  string-table source), 4 orphan `WeaponCase/Data/*.edds.meta`, `PreviewModel` /
  `m_iMaterialAnimationFrame` / `SlidingTrackMaterial` unknown keywords (newer-tools data),
  obsolete `SetBone` script warnings, the reskin's M998 damper `.acp` GUID.

## Playtest gates (pending)

- Bundeswehr as players: loadouts spawn armed with German kit, Dingo drives (7 seats), reskin
  HMMWV M2HB fires, arsenal crate shows the baked set (PzF3 tile present = the plain launcher
  GUID is right).
- Bundeswehr as enemy: Tropentarn groups patrol/garrison, GER crews in the reskin HMMWVs +
  Dingo (not vanilla US), pistol-only Officer as hvt hides in a building, US-vs-BWAR actually
  shoot at each other.
- Both mods in the same mission as SFS US (excluded FireTeam) never load the colliding GUID.
