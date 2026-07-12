# RHS harvest reference (2026-07-11)

Raw harvest results from the unpacked RHS dump (`D:\VSCode_dev\arma-reforger\reference\RHS`)
and `reforger-item-database`. The curated MVP cut lives in `generator/mods/rhs.mjs`;
this doc preserves the full superset + provenance for future curation passes.

## GUID trust rules (CRITICAL — validated)

The RHS dump has NO `.meta` files, and the root `ID` line inside its `.et` prefabs is
NOT the resource GUID (always `0000000000000001`). Never folder-scan RHS prefabs for
GUIDs. Consequently `reforger-item-database/data/rhs/groups.json` GUIDs are ALL broken,
and its ION character entries are smeared. Trustworthy sources (inline `{GUID}path`
references only):

- Groups USAF: `Configs/Editor/PlaceableEntities/RHS_Groups_USAF.conf`
- Groups AFRF: `Configs/Editor/PlaceableEntities/RHS_Groups_AFRF.conf`
- Groups ION: `Configs/EntityCatalog/ION/ION_Groups.conf`
- Characters: `Configs/EntityCatalog/USMC/USMC_Characters.conf`, `Configs/EntityCatalog/RHS_MSV/MSV_EMR_Characters.conf` (`ION_Characters.conf` is EMPTY)
- Vehicles: `Configs/EntityCatalog/{USMC,RHS_MSV,ION}/*_Vehicles.conf`
- Spawn points + arsenals: `Configs/Editor/PlaceableEntities/Systems/RHS_Systems.conf`
- Fortifications: `Configs/Editor/PlaceableEntities/Compositions/Compositions_FreeRoamBuilding.conf`
- Faction conf GUIDs + FactionManager member GUIDs: `Prefabs/MP/Managers/Factions/FactionManager_Editor.et` (RHS's override of the vanilla prefab)
- Arsenal items: `reforger-item-database/data/rhs/items.json` (catalog-sourced, GOOD; 2,155 items)

Unrecoverable from the dump (no inline reference anywhere): USAF FORECON Squad
(`Group_USAF_USMC_FORECON_Squad.et`, 6-man), ION URBAN CloseProtectionTeam, all plain
(non-`_Random`) ION characters. Recover from a live Workbench `.meta` if ever needed.

## Addons / factions

- Workshop GUIDs (from `C:\Users\djdav\Documents\My Games\ArmaReforger\addons` folder names):
  main `595F2BF2F44836FB` (RHS - Status Quo), CP01 `1337C0DE5DABBEEF`, CP02 `BADC0DEDABBEDA5E`.
  Workbench needs directory junctions of these into the Workbench addons dir (created).
- Faction confs: USAF `{F33C7BF22CBF3A8A}Configs/Factions/RHS_US_USMC.conf`,
  AFRF `{627A8CDE681D223D}Configs/Factions/RHS_RF_MSV.conf`,
  ION `{CB76A36EACFBDF35}Configs/Factions/RHS_ION.conf`.
- FactionManager_Editor member GUIDs (RHS overrides the vanilla prefab — override these
  members, NEVER append duplicates): USAF `{5CC8DE37E1FF0F7A}`, AFRF `{5978B9CE6585BBE8}`,
  ION `{623962205CE2B89C}`.
- Callsigns: USAF + ION share `m_CallsignInfo "{5CC8BB97E017CDBC}"` (inherits
  `{04DB0C8242F4B5B4}Configs/CallsignInfo/CallsignInfo_US.conf`; squad-name members are
  vanilla-identical: `{55CCB792D10AD8F4}` `{55CCB792D13759D8}` `{55CCB792D1218E95}`
  `{55CCB792D0C8B3CE}`). AFRF has an inline object `{5977478D568C093C}` with squad names
  `{5977478D568C092E}` `{5977478D568C092D}` `{5977478D568D935E}` `{5977478D568D935F}`.
- Friendly factions: RHS_USAF → US; RHS_AFRF → USSR (user confirmed hostility defaults
  work out of the box).
- item-db faction keys: `RHS_USAF`, `RHS_AFRF`, `ION` (=RHS_ION), `FFA` (shared pool, 147 items).

## Squad sizes (counted from m_aUnitPrefabSlots)

USMC MEF/MEF_D/MARSOC RifleSquad = 9; USMC FireTeam = 4; MachineGunTeam/SentryTeam = 2;
FORECON Squad = 6. MSV RifleSquad = 6; FireGroup = 4; **ManeuverGroup = 2 declared slots**
(bucketed medium in rhs.mjs, not large). ION QuickReactionForce = 10.

## In rhs.mjs (curated cut)

Groups (all from the registries above): USAF USMC_MEF (14), USMC_MEF_Desert (14),
MARSOC (11); AFRF MSV_Flora (10), MSV_VSR (10), MSV_VKPO_Summer (15),
MSV_VKPO_Demiseason (14); ION_COY (5). Vehicles: USMC 20, MSV 22 of 27, ION 6.
Characters: primary-variant role rosters per subfaction. Arsenal: ~20-item starter sets.
Fortifications: Checkpoint S/M/L + Barricade_L (road), Bunker/MG nests/SandbagPositions
(roadside); ION reuses USMC.

## Harvested but NOT in rhs.mjs (future curation material)

### Groups
- USAF/MSV `AmbientPatrols/*_NotSpawned` variants (excluded by pool rules): USMC FireTeam
  `{72CA13F8B32F5DCF}`, MachineGunTeam `{878B0C1FD7089B6B}`, RifleSquad `{99E99A4389ADC0FD}`,
  SentryTeam `{2DFBE17D9DB5E34B}`, Team_LAT `{D8BFA8F174FE39EC}`; plus MSV VKPO_S variants.
- `*_Base` templates (non-spawnable): USMC MEF Base `{EE8D60FCE6D3B856}`, FORECON Base
  `{D0208DD54E52EFD7}`, ION URBAN Base `{A5C5CE75FE31AFD8}`.
- ION URBAN_DEMI static cell: `{9F5D840D3A60B643}Prefabs/Groups/INDFOR/RHS_ION/RHS_ION_URBAN_DEMI/Group_RHS_ION_BLACK_STATIC_Static_Cell.et`.

### Vehicles (MSV variants skipped in rhs.mjs)
```
APC_K17_Berezok_tan:      {944D59BF5EC046D6}Prefabs/Vehicles/Wheeled/K17/APC_K17_Berezok_tan.et
APC_K17_Epoch_camo1:      {3918E80DF5393F8C}Prefabs/Vehicles/Wheeled/K17/APC_K17_Epoch_camo1.et
APC_K17_unarmed_camo1:    {DC6A0BC75B198106}Prefabs/Vehicles/Wheeled/K17/APC_K17_unarmed_camo1.et
APC_K17_unarmed_camoExpo: {DD20465C217BB8BF}Prefabs/Vehicles/Wheeled/K17/APC_K17_unarmed_camoExpo.et
Mi8MTT-A_Black:           {4A465E25A866520E}Prefabs/Vehicles/Helicopters/Mi8MT/Mi8MTT-A_Black.et
```
(USMC vehicle catalog also lists M1025 desert variant `M1025_armed_M2HB_USAF_D`
`{B8C827A45C1347A4}` — included; nothing else skipped. Also present in the RHS tree but
NOT in faction catalogs: BRDM2, 2S1, T14, UH1Y, F22/FA18/IL76/SU57 showcase aircraft —
no catalog GUIDs harvested.)

### Character roster notes
- Full USMC catalog ≈ 90 entries, MSV ≈ 100+ — rhs.mjs takes primary variants only;
  `_2`/`_3` cosmetic variants exist for most roles (same role, different look), e.g.
  USMC Rifleman_2 `{BA5842946E1CA1B7}`, Rifleman_3 `{5FC40E6D62F936DC}`.
- MSV also has VV/RG SOF characters (Atacs: `Character_RHS_RF_SOF_*`; SOBR Blk:
  `Character_RHS_RF_SOBR_*`) in MSV_EMR_Characters.conf — no matching group set
  harvested (no SOF groups in the registries), so no subfaction yet.
- `Unarmed` characters per subfaction exist (not loadout material).

### Spawn points / arsenals (RHS_Systems.conf)
```
SPAWN_US_USMC: {0CAE96554C7FEB3D}PrefabsEditable/SpawnPoints/E_SpawnPoint_US_USMC.et   (in rhs.mjs)
SPAWN_RF_MSV:  {E86B0E337506B044}PrefabsEditable/SpawnPoints/E_SpawnPoint_RF_MSV.et    (in rhs.mjs)
SPAWN_ION:     {F6678644B017C54D}PrefabsEditable/SpawnPoints/E_SpawnPoint_ION.et       (in rhs.mjs)
ARSENAL_USMC:  {314C0961EF3B6787}PrefabsEditable/Auto/Systems/Arsenal/ArsenalBoxes/US/E_ArsenalBox_USMC.et
ARSENAL_AFRF:  {115B814BA42CF5FA}PrefabsEditable/Auto/Systems/Arsenal/ArsenalBoxes/USSR/E_ArsenalBox_RHS.et
ARSENAL_ION:   {8662E64C0BD92112}PrefabsEditable/Auto/Systems/Arsenal/ArsenalBoxes/ION/E_ArsenalBox_RHS_ION.et
```

### Fortifications not in rhs.mjs (`PrefabsEditable/Auto/ConflictRHS/`)
Small/roadside candidates skipped from the pools:
```
USMC BarbedTapeKnifeRest: {36A84C0F1B679227}  Barricade_S: {6F10B35E26C17331}  Barricade_M: {A2A446C17D1A5074}
USMC Dragonsteeth_S: {17C5CD399557B543}  MortarPlacement_S: {1004D6553BC4D646}
USMC Sandbag walls: LongHigh {A34FAD8A5C314DD6} Long {831D0C9839E884EE} RoundHigh {C882027A1C3805A5}
     Round {50115411276EA45E} Wall {63E149557883E3F9} WallSolid {D4D7019BD3AFE708}
AFRF BarbedTapeTriple: {17D5820D45E6A57F}  Barricade_S: {2ABBD639E4186580}  Barricade_M: {E70F23A6BFC346C5}
AFRF MortarPlacement_S: {55AFB332F91DC0F7}
AFRF Sandbag walls: Long {DFA905A56CBB227A} LongHigh {AD7CF44CBCD66171} Round {6A2D77168BCE1C7A}
     RoundHigh {2573A5CA06F7DF94} Wall {ED665FAA7618BFFE} WallSolid {8DC7161152783CD0}
```
Large base compositions (both factions, prefix `E_*_USMC_01` / `E_*_AFRF_01`): AmmoStorage_S
(USMC {BABA872EAB372FC6} / AFRF {FF11E24969EE3977}), Antenna_S ({029082373AF4D837} /
{473BE750F82DCE86}), CamoNet Small/Medium/Large ({6FB51F7773AC0AB9} {474EA79B828157E9}
{DB1D272EBD1DD746} / {2A1E7A10B1751C08} {02E5C2FC40584158} {9EB642497FC4C1F7}),
FieldHospital_M ({4CFE57D0E1510B0C} / {095532B723881DBD}), FloodlightGenerator_S
({361B48D342FEA7CF} / {73B02DB48027B17E}), FuelStorage_S ({B5FAC353A85BE5D3} /
{F051A6346A82F362}), Headquarters_S ({A0603193C4219306} / {E5CB54F406F885B7}), Helipad_L
({4E61423F1EED31DB} / {0BCA2758DC34276A}), LivingArea_S/L ({28E24277E65162C9}
{71B0DC7DA57FDC3F} / {6D49271024887478} {341BB91A67A6CA8E}), PlayerHub_S
({5EAA423739485F37} / {1B012750FB914986}), VehicleMaintenance_S/M ({C4A1043FB488799F}
{0915F1A0EF535ADA} / {810A615876516F2E} {4CBE94C72D8A4C6B}).
No ION fortification set exists. AFRF has no Dragonsteeth/KnifeRest.
The RHS tree's `PrefabsEditable/Auto/Compositions/Misc/FreeRoamBuilding/` `E_*_US/USSR_*`
prefabs are RHS-authored editor wrappers around VANILLA compositions (separate from ConflictRHS).

### Arsenal
`data/rhs/items.json`: 2,155 items — RHS_AFRF 922, RHS_USAF 734, ION 352, FFA 147.
Categories: Clothing 513, Equipment 538, Weapons 347, Backpacks/Vests 272, Ammunition 226,
Attachments 196, Throwables 36, Helicopter 22. Full curation should go through
`input/arsenal-items.md` + `harvest-arsenal.mjs` (needs `## RHS_*` section support +
pointing mode lookups at `data/rhs/items.json` — not done yet).
