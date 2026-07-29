# British Forces harvest reference (2026-07-29)

Raw harvest results from the unpacked British Forces dump
(`D:\VSCode_dev\arma-reforger\reference\British Forces`, v1.0.65). The curated MVP cut
lives in `generator/mods/uk.mjs`; this doc preserves the full superset + provenance for
future curation passes.

## GUID trust rules

Same situation as RHS: the dump has NO `.meta` files and prefab root `ID` lines are
shared across files (all LR_3Series prefabs = `BBCBA43A9778AE21`, all UK spawn points =
`52E65E9446A3DC1D`) — never folder-scan for GUIDs. Trustworthy sources (inline
`{GUID}path` references only):

- Groups: `Configs/EntityCatalog/UK/UK_Groups.conf` (the `_1983`/`_1989` confs are thin
  overlays that only flip `m_bEnabled` per era — no new prefabs)
- Characters: `Configs/EntityCatalog/UK/UK_Characters.conf` (+ `UK_Characters_Campaign_1989.conf`)
- Vehicles: `Configs/EntityCatalog/UK/Vehicles_EntityCatalog_UK.conf`,
  `Configs/EntityCatalog/CIV/Vehicles_EntityCatalog_CIV.conf`
- Arsenal items: `Configs/EntityCatalog/UK/Arsenal Lists/*.conf`
- Spawn points / mines / arsenal boxes: `Configs/Editor/PlaceableEntities/Systems/Systems.conf`
- Fortifications/compositions: `Configs/Editor/PlaceableEntities/Compositions/Compositions.conf`
  (+ `Compositions_FreeRoamBuilding.conf`)
- Faction entry GUID: `Prefabs/MP/Managers/Factions/FactionManager_Editor.et` (BF's
  override of the vanilla prefab)

Known path drift: the 1989 Transport group prefabs reference drivers at
`Prefabs/Characters/Campaign/Groups/Driver/...` while the catalog says
`Prefabs/Characters/Campaign/BLUFOR/UK_Army/Groups/Driver/...` — same GUIDs; the GUID is
authoritative, prefer the catalog path.

## Addons / faction

- Workshop GUID `5AE50EC5B8D6F4AE` (British Forces). Own `.gproj` deps = base game only.
- **"British Forces: Truck, Utility" (`66D74CE7E94C5D05`) is NOT a dependency and is NOT
  listed in `uk.mjs`.** Validated 2026-07-29 by full diff of both extractions: its 421
  files (the whole LR_3Series Land Rover family) are a subset of the British Forces tree
  with identical paths and GUIDs, and it ships no `Configs/` at all, so it cannot append
  catalog entries. Only 5 files differ slightly (`3Series_Base.et` / `3Series_LWB_Base.et`
  extra SideX/SideZ lines, `3Series_LWB_Recce.et` GetOutTeleport/TRAIT_ARMED/coords, 2
  `.anm`) — it is a standalone republication of the Land Rover. Re-check if the BF author
  ever DEdupes the content out of the main addon.
- FactionManager: BF overrides vanilla `FactionManager_Editor.et` (same parent
  `{A242612865F2A48E}FactionManager_Base.et`, same root ID `56B2B4776E6E4499`) and appends
  ONE member: `SCR_Faction "{61500924662B6062}" : "{99C6CF7D6C5CD9A4}Configs/Factions/UK.conf"`
  with `m_bIsPlayable 0` → override this EXISTING member (entryGuid path), never append.
- FactionKey `UK`, label `#BF-Faction_UK-name` = "British Military" (UC "BRITISH
  MILITARY"), `m_FactionLabel FACTION_BRITISH`, radio 48000, friendly to `US`.
- Callsigns: inline `SCR_FactionCallsignInfo "{5DA0F2A6677ADA9E}"` in `UK.conf`, parented
  to vanilla `{CB7824D572DD0D5C}Configs/Callsigns/Callsigns_US.conf`. The instance GUID
  AND the member GUIDs are copy-pasted from vanilla US.conf — squad members are
  vanilla-identical (`{55CCB792D10AD8F4}` `{55CCB792D13759D8}` `{55CCB792D1218E95}`
  `{55CCB792D0C8B3CE}`, overridden by the mod to "A"/"C"/"E"/"G"); companies 1–8,
  platoons 1–4, role callsigns IC/Sigs. Formats `%1%2%3`.
- BF path-overrides two vanilla files (side effect of loading the mod, harmless to the
  generator): `Configs/EntityCatalog/CIV/Vehicles_EntityCatalog_CIV.conf` (58 → 18
  entries, all civilian Land Rovers) and `Configs/Factions/CIV.conf` (adds UK to
  `m_aFriendlyFactionsIds`).
- `Configs/EntityCatalog/UK/UK_SupplyContainerItems.conf` is wired but EMPTY.

## Squad sizes (counted from m_aUnitPrefabSlots)

InfantrySection = 8 (both eras); RifleGroup = 5; PlatoonHQ = 5; FireTeam (1989 only) = 4;
Brick = 4; SapperTeam = 4; GunGroup = 3; AmmoTeam 1983 = 4, 1989 = 3; MachineGunTeam /
Team_AT / SniperTeam / RecceTeam / MedicalSection / Transport = 2; SF Team = 8, SF
Patrol = 4; Reservist RifleSquad = 8.

## In uk.mjs (curated cut)

Subfactions (user decision 2026-07-29): "1989 Regulars", "1989 Special Forces",
"1983 Regulars", "1983 Special Forces" (1989 first = default). Reservists skipped
entirely (not playable, no enemy group sets). Group sets: Regulars_1989 (13 groups),
SF_1989 (2), Regulars_1983 (12), SF_1983 (2); sentry = MachineGunTeam (Regulars) /
Patrol (SF); defense = InfantrySection / SF Team (size 8). Vehicles: 18 (8 Land Rovers,
M997, 5 M923A1 UK skins, BRDM-2 UK, 3 UH1H). Loadouts: 18/13/18/12 primary-variant
rosters. Arsenal: 28-item mixed-era starter set (no primary weapons per the project-wide
arsenal rule — launchers, Schermuly flares, ammo, mines/explosives, medical, utility,
4 backpacks; UK backpacks are era-identical so no subfaction split).
Fortifications: UK checkpoint/barricade
S/M/L (road), bunker + 2 MG nests + 4 sandbag positions (roadside). Spawn point
`{75262929CD256E99}PrefabsEditable/SpawnPoints/E_SpawnPoint_UK.et`.

## Harvested but NOT in uk.mjs (future curation material)

### Groups (excluded)
```
Reservists 1983 RifleSquad:   {371653AF9A7B81B8}Prefabs/Groups/BLUFOR/British Forces/1983/Group_UK_1983_Reservists_RifleSquad.et   (8)
Reservists 1989 RifleSquad:   {69AF7EA853C0032F}Prefabs/Groups/BLUFOR/British Forces/1989/Group_UK_1989_Reservists_RifleSquad.et   (8)
Regulars 1989 Transport:      {7B4FCFCE540CBA37}Prefabs/Groups/BLUFOR/British Forces/1989/Group_UK_1989_Regulars_Transport.et      (2 drivers)
Reservists 1989 Transport:    {53CA5603AA992F59}Prefabs/Groups/BLUFOR/British Forces/1989/Group_UK_1989_Reservists_Transport.et    (2 drivers)
```
Plus 5 disabled vanilla-US `*_NotSpawned` ambient entries in UK_Groups.conf
(`{94B5E9E3D8E4B887}` FireTeam, `{DA987D8C5A311713}` MachineGunTeam,
`{4F6811B5E789FA88}` RifleSquad, `{FB7A6A8BF391D93E}` SentryTeam, `{3EC052EA1F35DCA4}` Team_LAT).

### Characters (excluded from loadout rosters)
```
1983 Regulars extras:  Spotter {33A1A49E7ABEEF78} (m_bEnabled 0 in catalog, still used in group slots),
                       CC {FA8C27E4FA636E47}, HeliCrew {0E04E64329F4AF38}
1989 Regulars extras:  MAW_No1 dupes covered; CC {E38BE58BD3DF365E}, HeliCrew {FD03E0583287AC1B}
Generic:               Character_UK_Unarmed {B528DED2712C9982}
1983 Reservists:       Rifleman {57F707723CD960C7}, SectionCommander {F035759076B5818A},
                       LAT {3812CCED7C78916B}, LMG {B2AD7B366BBE9BD4}
1989 Reservists:       Rifleman {B286CF6178DEEBE3}, Engineer {4FAB226017A82F43},
                       Rifleman_Recce {134FFEADD353AA31}, SectionCommander {130A2E98EF961445},
                       LAT {32C3AC2DE395CB05}, LMG {F22E993715463973}
```
`UK_Characters_Campaign_1989.conf` adds 44 Conflict player-slot loadouts under
`Prefabs/Characters/Campaign/BLUFOR/UK_Army/Groups/` (Assault/Driver/AT/Recce/Engineer/
GPMG/Commander/Heli/Mortar/SF Assault/SF Recon roles incl. ConvoyCommander
`{AA74F71C1228D03B}`, Mortarman `{C44C43024075DDCD}`, DetachmentCommander
`{224C619E8320D65A}`, four Engineer grades, OfficerCadet→FieldOfficer ladder) — good
material for a future Conflict-style loadout expansion.

### Vehicles (excluded)
```
3Series_SWB_Transport_Covered_Camo: {D7F4C63BA427454E}Prefabs/Vehicles/Wheeled/LR_3Series/3Series_SWB_Transport_Covered_Camo.et
3Series_LWB_Transport_Camo:         {098E31B006CAE0CE}Prefabs/Vehicles/Wheeled/LR_3Series/3Series_LWB_Transport_Camo.et
M923A1_command_UK:                  {B9540BEB76268B95}Prefabs/Vehicles/Wheeled/M923A1/M923A1_command_UK.et  (editor-only entry)
M923A1_ammo_UK:                     {06932467ADD5459C}Prefabs/Vehicles/Wheeled/M923A1/M923A1_ammo_UK.et     (editor-only entry)
```
Reachable only via `m_sVariantPrefab` / campaign confs (not in the spawnable catalog):
M151A2_M2HB_UK, M998_covered_long_UK, `*_Filled` cargo/engineer variants,
3Series_LWB_Recce_CommandoOps, all `_Variant_2`/`_Variant_3` cosmetic Land Rovers,
campaign MHQ `{D33EB133E3708326}CampaignMobileAssemblyWest_UK.et`. 18 civilian Land
Rovers live in the CIV catalog override (colors + Randomised).

### Weapon tripods / deployables (`WeaponTripod_EntityCatalog_UK.conf`, complete)
```
{D7D67566D0A78E0A}Prefabs/Weapons/Mortars/L16/Mortar_L16.et
{19B8FEA4D767B3C7}Prefabs/Weapons/Tripods/Monopod_LouchPole_GPMG.et
{93D05BC98A15A0EF}Prefabs/Weapons/Tripods/Tripod_GPMG.et
{AA35709DD4F778B6}Prefabs/Weapons/Tripods/Tripod_M3_M2HB_UK.et
```
Deployable parts (UK_Deployables_All.conf): M2 gun/tripod, L16 mortar 3 parts, M122
tripod, burlap sandbag.

### Spawn points / systems
```
{F0CB79928E4DC28D}PrefabsEditable/SpawnPoints/E_SpawnPoint_UK_Supplies.et  (135 m supply range)
{641BE0766BB1874E}PrefabsEditable/Auto/Props/Military/Compositions/UK/E_ArsenalBox_UK.et
{C4A574FD7579FD7B}.../E_ArsenalBox_UK_Weapons.et
{15152B41A9655937}.../E_ArsenalBox_UK_Equipment.et
{76D1ABFCE95FE1DA}PrefabsEditable/Mines/E_Mine_Mk7.et
{08F92698449282BD}PrefabsEditable/Mines/E_Mine_L9A1_Barmine.et
```

### Compositions beyond the fortification pools
Slotted (Compositions.conf): PlayerHub_S, Headquarters_S, SupplyCache_S,
MortarPlacement_S `{29C16EBB4DBF9918}`, GPMG_AAMount_S `{7DBB5238AD1E4334}`, Antenna_S,
LivingArea_S/L, FieldHospital_M, AmmoStorage_S, VehicleMaintenance_S/M, Helipad_L,
FuelStorage_S (+ `_Conflict_UK` variants in Compositions_FreeRoamBuilding.conf).
FreeRoamBuilding extras: Dragonsteeth, BarbedTapeKnifeRest, 6 plastic sandbag shapes,
3 camo nets, FloodlightGenerator. Flags: E_FlagPole_02_V1/V2_UK. Base building:
`m_sBaseBuildingSourceBase {D647D6186DFB1421}E_SourceBase_S_UK_01.et` (UK_Campaign.conf).
UK compositions inherit vanilla US ones and re-skin faction affiliation only (names still
`#AR-EditableEntity_*_US_*`).

### Arsenal supersets (uk.mjs bakes 28 items)
`UK_Weapons_All.conf` = 44 entries (incl. L34A1 suppressed Sterling, LSW Irons, Minimi,
L8, three AI PM sniper variants incl. suppressed, M79, Welrod, MP5/MP5SD1/MP5K/MP5SD3,
full M16/CAR-15 family + OliveGreen/SandStripes variants). `UK_Ammunition_All.conf` = 37
(FAL BattleMix, RadwayGreen Tracer/4B1T, GPMG 50/200rnd boxes, Minimi 200rnd box, M2
100rnd box, AIPM 10rnd, M406 HE / M583A1 flare 40 mm). `UK_Explosives_All.conf` = 17
(No80 WP, No83 Blue/Yellow, Schermuly rocket flares ×3, Mine Mk7, L9A1 Barmine, Hayrick
demo, 4×81 mm mortar rounds). `UK_Equipment_All.conf` = 21 (taped dressing, tourniquet,
saline, medical kit, folded map, 2 compasses, flashlight, watch, PRC349, mine flag,
E-tool, jerrycan, repair/rearming kits, Shrike blasting machine, ballistic table, 81 mm
ammo box). Era gating exists (`UK_Arsenal_1983/1989.conf` swap weapon/ammo/attachment/
clothing lists; explosives + equipment shared) — a future era-aware arsenal could follow it.

## Localization

`Language/BritishForces_localization.en_us.conf` (StringTableRuntime; text line = id
line + 634). Faction: `BF-Faction_UK-name` = "British Military". Role names resolve via
`BritishForces-Role_*` / `BritishForces-Character-Name-*` keys; 1983 SF + many regular
roles reuse vanilla `#AR-Role_*`. Hardcoded English names in prefabs: L4LMG_No1 = "Light
Machine-Gunner", Section2IC = "Section 2IC", SectionCommander = "Section Commander",
CRW = "Counter Revolutionary Warfare Trooper".
