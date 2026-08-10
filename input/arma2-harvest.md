# Arma II Factions harvest (2026-08-10)

Mod: "Arma II Factions" by Sestenz — `Arma2Factions_5F396C4F713595DB`
(https://reforger.armaplatform.com/workshop/5F396C4F713595DB). Integrated as
mod `arma2` (`generator/mods/arma2.mjs`): **Ses_CDF / Ses_ChDKZ / Ses_NAPA**,
all playable + enemy-capable. The mod's three Takistani factions (Ses_TKA /
Ses_TKG / Ses_TKR) are SKIPPED by user decision — noted below for a possible
future pass. Extraction: `D:\VSCode_dev\arma-reforger\reference\Arma II
Factions` (1244 files).

## Shape of the mod

- **RHS entryGuid pattern**: overrides vanilla `FactionManager_Editor.et`
  (root ID `56B2B4776E6E4499`) appending 6 conf-ref members, `m_bIsPlayable
  0`. Member instance GUIDs (= our entryGuids): CDF `{5D9F7285A1D004FE}`,
  NAPA `{604D1A678B852591}`, ChDKZ `{604D1A678A26714B}`, TKA
  `{60753DCAAD475575}`, TKG `{60753DCAAC7BCED5}`, TKR `{60753DCAAB0E7DBB}`.
- **Callsigns**: faction confs reference the VANILLA callsign confs with no
  squad-name overrides → squadBase = vanilla squad GUIDs. Instance GUIDs:
  CDF `{6874070850B730C6}` (→Callsigns_US), ChDKZ `{5DA0F2A67DFB8809}`
  (→Callsigns_USSR; byte-identical to vanilla USSR's instance — copy-paste),
  NAPA `{5612D998B673DA16}` (→Callsigns_FIA, company names overridden,
  squads inherit).
- **friendlyWith** (declared in the confs): CDF→US+RHS_USAF,
  ChDKZ→USSR+RHS_AFRF, NAPA→none, TKA↔TKG.
- **Spawn points** (GUIDs from `Ses_Props_A2F.conf`): CDF
  `{367B6C75494ECA6B}`, ChDKZ `{82787597EE11F812}`, NAPA
  `{D6CDD39095D690BE}`, TKA `{0F90B6F8277AE8AF}`. TKG/TKR ship none.
- **`*_Random` characters are unarmed-base VariantData wrappers**
  (verified: CDF Rifleman_Random has a variant table + zero weapons) —
  group slots fine, individual spawns (crew/hvt) must be concrete.
- **Deps**: `.gproj` declares RHS `595F2BF2F44836FB` + TacticalFlava
  `5D550926D43F1409`. TacticalFlava is a 9-pack family with vanity
  `DEADC0DE0000000N` GUIDs (Core/Weapons/BM-21/TIGR/Clothes/HMMWV/M-ATV/
  Turrets/2B9Vasilek) — all real installed addons, junctioned 2026-08-10
  along with the mod + TacticalFlava root (11 new junctions, no further
  transitive deps). Mission anchor = `5F396C4F713595DB` alone.

## GUID sources (trust order used)

1. `Configs/Editor/PlaceableEntities/Ses_Groups_A2F.conf` — ALL group GUIDs.
2. `Configs/Editor/PlaceableEntities/Ses_Veh_A2F.conf` — vehicle GUIDs.
3. `Configs/EntityCatalog/<F>/<F>_Characters.conf` — CDF/ChDKZ character
   GUIDs. **NAPA's catalog is a copy-paste bug** (lists vanilla USSR
   characters!) — NAPA roster + all leadership/crew GUIDs recovered from the
   Random wrappers' variant tables (ION trick; 251 concrete refs recoverable
   mod-wide).
4. `Ses_Props_A2F.conf` — spawn points.

`Character_CDF_Officer.et` ships but appears in NO conf → no GUID source →
CDF hvt = PL `{756D4054410A1927}` (SFS-US precedent).

**TRUST RULE (Workbench-caught 2026-08-10, applies to ALL mods): prefab-side
refs beat conf refs.** The engine writes parent-chain and variant-table GUIDs
into prefabs itself, so they're always current; hand-maintained catalog confs
go stale. Enfusion resolves refs BY GUID first with path fallback — a stale
GUID that no longer exists merely logs `Wrong GUID` and falls back to the
path (works, noisy), but a stale GUID that still exists AS ANOTHER RESOURCE
silently resolves to the wrong prefab with no error. Both cases live in this
mod's CDF catalog: MG `{...C99}`→true `{...C9A}`, Medic `{F051151C98DB30CD}`
→true `{16165F4184929A69}`, SL `{16165F4184929A69}`→true `{16165F4184929A6A}`
(the catalog's SL GUID IS the Medic prefab — a catalog-sourced SL loadout
would silently spawn a medic). The catalog's `Character_CDF_Sharpshooter.et`
prefab doesn't ship at all (dead entry) — excluded from the roster. Audit
method: grep every {GUID}path pair across Prefabs/ vs Configs/, prefer the
prefab-side GUID on any conflict; ChDKZ/NAPA/vehicles had no conflicts.

## Group slot counts (real slots, preview refs excluded)

- CDF: RifleSquad 9, RifleSquad2 6, PlatoonHQ 5, FireTeam/LightFireTeam 4,
  Ammo/AT/GL/LAT/Suppress teams 4, MG/Medical/Recon/Sapper/Sentry/Sniper 2.
- ChDKZ: RifleSquad 6, PlatoonHQ 5, FireGroup/LightFireTeam 4,
  Ammo/AT/GL/Suppress 4, MG/Medical/Sapper/Sentry 2, **ManeuverGroup 2**
  (bucketed medium — RHS MSV precedent).
- NAPA: RifleSquad 7, FireTeam 5, LightFireTeam 4, Ammo/AT 4, PlatoonHQ 3,
  MG/Medical/Recon/Sapper/Sentry/Sharpshooter 2.

## Curation calls

- Fortifications: vanilla USSR pools for all three (Soviet-equipped — MEI
  precedent). Arsenal: assembled from the roster characters' OWN inventories
  (SFS pattern, 2026-08-10 — replaced an initial vanilla-set starter cut
  whose AK mags didn't fit the RHS rifles): swept every concrete character
  prefab per faction for carried magazines/rockets/launchers. Weapon
  families: CDF = RHS AK-74 plum 5.45 + RPK + PKM + SVD + PM, scoped RHS
  RPG-7 (pgo7) + RPG-75; ChDKZ = RHS AKM steel 7.62x39 (+ some 5.45) + PKM
  boxes + SVD + PM, plain RHS RPG-7 + RPG-22; NAPA = Vz.58 + UK-59 + 5.45
  mixes + PKM up to 250rnd + SVD, all three launchers. Universal kit shared
  (RGD-5/RDG-2 as carried, soviet explosives/detonator/mines, medical,
  RSP-30 flares, soviet backpacks; NAPA keeps the FIA M70 pack).
- Vehicles: per-faction reskin fleets taken from Ses_Veh_A2F.conf; CDF camo
  UAZ variants and the empty-pod Mi-8 gunship skipped (don't-overpopulate).
  NAPA's own catalog points at vanilla refs — its registry entry mixes NAPA
  reskins (UAZ/UK59/BRDM2/BTR70) with vanilla Ural/UAZ-452 transports.
- ChDKZ extra loadouts: Insurgent + Rifleman (armored) included; cosmetic
  `Rifleman2/3`, `_2/_3/_4/_5` leader variants excluded.

## Skipped (future curation material)

- **TKA (Takistani Army)**: full faction — 15 groups, characters (incl.
  SpecialForces set in `Ses_Characters_A2F.conf`), Mi-8 gunships, Ural/UAZ
  fleet, spawn point, Callsigns_TK. Viable playable+enemy if ever wanted.
- **TKR (Takistani Rebels)**: 13 groups + characters, no spawn point →
  enemy-only candidate (some of its PL prefabs confusingly live under the
  vanilla FIA folder as `Character_Ses_TKR_PL*.et`).
- **TKG (Takistani Militia)**: shell — Base/BaseLoadout characters only, no
  groups, one BTR70 reskin. Skip permanently.

## Spike

`--a2` → TS_WebSpikeA2 (Ses_CDF "CDF Army" vs Ses_ChDKZ, Arland; mounted
patrol mixes armed BRDM-2 + unarmed covered Ural; deliver/spawn vehicles =
CDF fleet; hvt = ChDKZ PL).
