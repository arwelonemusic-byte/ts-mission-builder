# Konni Group — harvest notes

Harvested 2026-11-20 from **Konni Group** `7DAFEF0126B180E0` v1.0.4 (game 1.9.0.37, last modified 2026-11-12, 88 MB).
Extraction: `D:\VSCode_dev\arma-reforger\reference\Konni Group` (823 files). Audit baseline: `input/addon-audit/7DAFEF0126B180E0.json.gz`.
Registry: `generator/mods/konni.mjs` (mod id `konni`, faction key `KONNI`). Spike: `node generator/generate.mjs --konni` (TS_WebSpikeKonni).

## What the mod is

A Russian PMC that **replaces the vanilla Soviet faction in place**. The faction key stays `USSR`. Everything is a clean override that keeps the vanilla GUID:

| Override | Vanilla GUID | What changes |
|---|---|---|
| `Configs/Factions/USSR.conf` | `{09727032415AC39B}` | name "Konni Group", icon, flag, flag material, home territory (11-line delta) |
| `Configs/EntityCatalog/USSR/Characters_EntityCatalog_USSR.conf` | `{3B679F1799D55F6F}` | vanilla entries `m_bEnabled 0`, Konni characters added |
| `Configs/EntityCatalog/USSR/Groups_EntityCatalog_USSR.conf` | `{37D5B75AAC3E72EA}` | vanilla entries disabled, 36 Konni groups + 5 ambient `_NotSpawned` added |
| `Configs/Core/EditableEntityCore.conf` | `{DE17AC501F0CD5EB}` | its Game Master label |
| `Configs/Identities/Characters/Character_Identities.conf` | | `KON_` bio groups |
| `Prefabs/Props/Military/Compositions/USSR/ArsenalBox_USSR.et` + 3 `E_ArsenalBox_USSR*` | `{AD59EDEAA26CE792}` … | Konni flag on the arsenal boxes |
| 22 vanilla Soviet vehicles | identical | Konni markings, logo decals, cargo bars, **Konni default occupants** |

Overridden vehicles: UAZ-469 (`UAZ469`, `UAZ469_PKM`, `UAZ469_uncovered`), UAZ-452 (`transport`, `cargo`, `ambulance`), Ural-4320 (`transport`, `transport_covered`, `ammo`, `Arsenal`, `command`, `engineer`, `repair`, `tanker`), BRDM-2 + `BRDM2_Conflict`, BTR-70 + `BTR70_Conflict`, Mi-8MT (`unarmed_transport`, `armed`, `armed_gunship_HE`, `armed_gunship_HEDP`). Parts live in `Prefabs/Vehicles/KON/Parts/`. No new vehicle models. The mod ships its own Game Master previews for all 22 (`UI/Textures/EditorPreviews/KON/Vehicles`); the Builder shows the vanilla thumbnails.

Script: `Scripts/Game/Identity/KON_CharacterIdentityBioGroupConfig.c`. It's a `modded class SCR_CharacterIdentityBioGroupConfig` that gives `USSR`-keyed characters only `KON_` bios. It repeats `[BaseContainerProps]` correctly. Plus a modded `EEditableEntityLabel` enum.

Vanilla USSR group and character **prefabs are not touched**. Konni's own soldiers and groups have their own GUIDs under `Prefabs/Characters/KON/<Subfaction>/` and `Prefabs/Groups/KON/`. So loading the mod does not turn the vanilla USSR groups the Builder emits into Konni troops. The registry references Konni's groups directly.

## Integration decision

`aliasOf: "USSR"`, **enemy-only** (`riflemen: {}`, `loadoutSets: {}`, `arsenalItems: []`). It's the SFS RF pattern without the player side.
- **Inherited from vanilla USSR:** `entryGuid` `{56DEAC40D3C2E623}`, callsign, spawn point, the 20-key vehicle garage, patrol/transport keys and fortification pools. With the mod loaded, the vanilla Soviet vehicles come Konni-marked and Konni-crewed for free.
- **Pairing limits:** USSR and SFS_USSR players are blocked by the existing `aliasConflict` cascade (browser-verified: switching the players to USSR swaps the enemy to US and retargets advanced elements). RHS_AFRF players get the usual USSR friendliness clearing.
- **Dependencies:** the Konni GUID alone. Its closure resolves transitively: RHS Status Quo + CP01 + CP02, nine WCS 9.0 infantry packs (Clothing, Clothing_Assets, Weapons, Attachments, Scopes, Sounds, Weapon_Scripts, NATO, RU), and Bandit Gear → Zelik's Character. New download for a player who already has RHS: about 4.6 GB, almost all WCS (Clothing_Assets 1.8 GB, NATO 0.9 GB, Scopes / Attachments / RU about 0.5 GB each).

## Subfactions and group sets

Every group is cataloged; group GUIDs = catalog = the mod's resource database. Sizes come from `m_aUnitPrefabSlots`. Classes follow the project count rule: 2 = small, 3–5 = medium, 6+ = large.

| Set | Label | small | medium | large | sentry | defense |
|---|---|---|---|---|---|---|
| `KON` (default) | Konni (assault detachments) | Sniper Pair 2 | Light Troika 3, MG Troika 3, AT Troika 3, Probe Team 4, Sapper Group 5 | Assault Group 8, Assault Group (night) 6, Fixing Element 8, Mobile RPG Group 7, Recon Group 6 | Light Troika | Assault Group 8 |
| `K07` | Komanda 07 (contract security) | Checkpoint 2 | Team 4 | Security Detail 6 | Checkpoint | Security Detail 6 |
| `K00` | Komanda 00 (special forces) | Pair 2 | Team 4 | Element 6 | Pair | Element 6 |
| `ELT` | PMC Elite Group | Sniper Pair 2 | Team 4, Recon Group 5 | Assault Group 8 | Sniper Pair | Assault Group 8 |
| `BAR` | Barkov's Forces (rogue army) | Marksman Pair 2 | Fire Team 4, Spetsnaz 5 | Rifle Squad 8, Gas Mask Squad 6 | Marksman Pair | Rifle Squad 8 |

**Excluded by curation.** These groups need equipment the mission doesn't place, only carry or heal, or are crews:
- KON FireSupport 8 (AGL/HMG crews)
- KON UAVCell 2
- KON CasEvac 8 (stretcher bearers)
- KON MedEvac 3 (medics)
- KON HeliCrew 4
- KON PilotPair 2
- KON Command 2 (officer pair)
- every VehicleCrew (KON, K07, BAR: 3 each)
- the five `AmbientPatrols/*_NotSpawned` shells

## Characters

Each role is a base prefab (`Character_KON_<SUB>_<Role>.et`) plus concrete kits `_A/_B/_C` (KON has three, the others two or three). The chain runs kit → role base → `Prefabs/Characters/KON/Character_KON_Base.et` → vanilla `Character_USSR_Base.et`, so faction USSR and Russian voices. All kits are armed and VariantData-free, so they're safe for individual spawns.

The harvest found 239 prefabs: 169 cataloged kits plus 70 uncataloged role bases. The **role bases are excluded** from the roster (`CATALOG_ONLY` in `label-roster.mjs`): they carry only the bare rifle, while the cataloged kits add magazines and grenades. 19 `Unarmed` roles drop out as unarmed. The result is **65 roles**:
- **Konni:** AGL Crewman, Assistant MG, Stretcher Bearer, Commander, Crewman, Flight Crew, Grenadier, HMG Crewman, MG, Medic, Officer, Helicopter Pilot, Disposable Probe, Anti-Tank, Rifleman, Sapper, Scout, Sniper, Spotter, Thermobaric Gunner, UAV Assistant, UAV Operator, Veteran
- **K07:** Commander, Crewman, Grenadier, Officer, MG, Medic, Rifleman
- **K00:** Officer, Breacher, MG, Team Leader, Marksman, Medic, Operator
- **Elite:** Assistant MG, Commander, Grenadier, Officer, MG, Medic, Anti-Tank, Rifleman, Sapper, Scout, Sniper, Spotter, Thermobaric Gunner, Veteran
- **Barkov:** Assistant MG, Rifleman (gas mask), Commander, Crewman, Grenadier, Officer, MG, Medic, Anti-Tank, Rifleman, Sniper, Spetsnaz Leader, Spetsnaz MG, Spetsnaz Operator

Names in the mod are literal English (no string tables), so the RU labels are ours.

- `hvt` = `{4B419A80253B5E35}…/Elite/Character_KON_ELT_HVT_A.et` "Elite Group Officer A" (AK-105 + MP-443). Every subfaction ships an HVT/Officer role, but the registry holds one.
- `patrolCrew` = K07 Crew A/B + KON Crew A/B/C.

## Roster tooling changes (same day)

- `harvest-characters.mjs`: new optional `sweepBase` per source. Konni keeps its soldiers outside `Prefabs/Characters/Factions`. `KONNI` source = Konni's override of the USSR character catalog + a sweep of `Prefabs/Characters/KON/(Konni|K07|K00|Elite|Barkov)/`.
- `label-roster.mjs`:
  - `KONNI` subfaction table (folders under `Prefabs/Characters/KON/`)
  - `KON_<SUB>_` character/group prefixes
  - `_A/_B/_C` letter variants collapse onto one role
  - role and group overrides (EN + RU)
  - the `CATALOG_ONLY` set
- The full re-harvest also picked up British Forces 1.0.71's new Russian names for UK soldiers (`characters-harvest.*`, a few UK `labelRu` in `roster-labels.*` / `roster.mjs`). That's a genuine upstream change, not a Konni side effect.

## Validation

- **Offline:** the `--konni` spike lists exactly base game + toolkit + ACE Medical + `7DAFEF0126B180E0` in `addon.gproj`. AO.layer carries Konni groups from the three selected sets, Konni crews in `m_aCrewPrefabPool`, an advanced foot patrol / mounted patrol (UAZ-469 PKM) / defense group (Gas Mask Squad) / static soldier (Elite MG), and the Elite Group Officer as the HVT.
- **Workbench, 2026-11-20:** `-gproj` launch with temporary junctions for the 15-addon chain (`audit.mjs junction konni`, removed afterwards). The world loaded with 173,311 entities, and the Konni script compiled. The only errors are the dependency mods' noise: Zelik's orphan `ZEL_HandsClothing_Base.et.meta`, plus a network lookup. Warnings are unregistered `.json` / `$profile` files.
- **Browser (dev server):**
  - the Konni checkbox appears under Faction mods
  - KONNI is offered only as the enemy, with five troop sets
  - zone estimate ~12–21 for Defense + Foot Patrols + Fortifications
  - the Advanced group dropdown lists all 26 groups by subfaction with sizes
  - the alias guard works
- **`audit.mjs check konni`:** every Builder ref checks out (22 catalog-only, 10 prefab-corroborated).

## Playtest gates

- Konni groups spawn and fight under the toolkit plugins (patrols, garrison, fortifications, QRF).
- Konni crews board the restyled vanilla vehicles in mounted patrols.
- The Elite Group Officer HVT task completes.
- The 4.6 GB WCS dependency chain is acceptable to the community.

Re-audit after Konni or WCS updates (`/addon-audit konni`): the author already rebuilt for WCS 9.0 once (1.0.2).
