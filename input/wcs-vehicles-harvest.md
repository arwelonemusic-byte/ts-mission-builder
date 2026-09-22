# WCS vehicle mods — harvest (2026-09-10)

Seven "Worst Case Scenario" (WCS) vehicle mods, downloaded headless + extracted 2026-09-10 (all at the 8.1.x line, every one last updated 2026-09-03). Extractions: `reference<TITLE>` (TITLE = the WCS_* name below). Game addon folders under `My GamesArmaReforgeraddons<folder>`.

**Shared dependencies (both pulled transitively, NOT extracted):** WCS_SpaceCore `5E389BB9F58B79A6` v8.1.1 (47 MB, scripts + `Prefabs/Vehicles/Core/Tracked_Base.et` {8A883ABED22B6E27} — the tracked-vehicle base every M1A1/BMP-3 chain parents; BMP-1 parents vanilla TrackedVehicle_Base instead) and WCS_Armaments `629B2BA37EFFD577` v8.1.2 (382 MB, weapon/rearm system — the RearmVehicleAtRepairStation action conf in every armed prefab). FMTV + MRZR declare only Armaments; the other five declare both. Registry rule as for Dax: `dependencies: [<mod GUID>]` only, deps resolve transitively.

**Method (catalog-driven, as always):** entries = the mod's `Configs/EntityCatalog/<Faction>/Vehicles/WCS_*.conf` multi-lists (appended to the vanilla faction vehicle catalogs via clean `Vehicles_EntityCatalog_<Faction>.conf` overrides; BMP-1 additionally appends 4 FIA entries directly in its FIA catalog override). Names = `SCR_EditableVehicleUIInfo.Name` keys resolved through the mods' own `Language/*.en_us.conf` / `ru_ru.conf` string tables (only Stryker ships real RU names; every other RU table copies EN). Armed = weapon turret / gun-mount slot prefab present in the prefab chain (the `TRAIT_ARMED` authored label is set only on JLTV, Stryker Dragoon and MRZR — unreliable). Footprints = first `.xob` AABB in the chain (header floats @0x18/0x24, full extents). Thumbnails = the `m_Image` EditorPreview `.edds` (all 164 resolve inside the mod paks; convert via extract-thumbnails' direct-.edds path like Dax). No `m_bEnabled 0` anywhere. Default occupants are all VANILLA characters (US Rifleman/Crew/SF, USSR Crew/KLMK, FIA) — the universal `patrolCrew` emission covers them regardless.

**Other vanilla overrides shipped (all benign for us):** M1A1/BMP-3/BMP-1/Stryker append VEHICLE ammo (tank canisters, 30 mm/73 mm/Mk44 boxes) to the vanilla `InventoryItems_EntityCatalog_*` — vehicle-type items, excluded from the arsenal pool by rule. FMTV overrides `Prefabs/Characters/Core/Character_Base.et` to add character-linking colliders for its cargo bed (riding standing in the bed). JLTV and BMP-3 ship test worlds. No FactionManager, GameMode or loadout overrides.

## Totals

| Mod | GUID | ver | size | catalog entries | distinct vehicles | armed entries | size class |
|---|---|---|---|---|---|---|---|
| WCS_JLTV | `5C721177A220B42F` | 8.1.3 | 95 MB | 36 | 9 | 32 | light (3.1×5.9 m) |
| WCS_M1A1 | `5D1880C4AD410C14` | 8.1.1 | 91 MB | 56 | 11 | 56 | heavy (3.8×8.5 m) |
| WCS_BMP-3 | `5B383D4CB27E0D54` | 8.1.1 | 60 MB | 1 | 1 | 1 | heavy (3.2×7.2 m) |
| WCS_BMP-1 | `5E524E4FEECCA92B` | 8.1.1 | 121 MB | 8 | 4 | 8 | heavy (3.0×6.7 m) |
| WCS_FMTV | `65B60A48AEC31157` | 8.1.1 | 85 MB | 30 | 10 | 6 | heavy (2.8×7.6 m) |
| WCS_Stryker | `5B02128D896F7DE8` | 8.1.0 | 68 MB | 24 | 8 | 18 | heavy (3.2×7.5 m) |
| WCS_MRZR | `64900A5A31F5DCB5` | 8.1.1 | 81 MB | 9 | 5 | 5 | light (1.5×3.6 m) |
| WCS_T-72 | `5E0AB16BEB16D6A4` | 8.2.1 | 90 MB | 6 | 2 | 6 | heavy (3.6×6.8 m) |
| **all** | | | | **170** | | **132** | |

## WCS_JLTV (`5C721177A220B42F`, v8.1.3, folder `JointLightTacticalVehicle_5C721177A220B42F`)

### [US] M1280 JLTV GP — unarmed

- weapon slots: none
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1280_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_Unarmed | `{E62EEF185EC31C54}Prefabs/Vehicles/Wheeled/JLTV/Unarmed/JLTV_Unarmed.et` | JLTV_Unarmed |
| JLTV_Unarmed_Olive | `{59C895043D862E4F}Prefabs/Vehicles/Wheeled/JLTV/Unarmed/JLTV_Unarmed_Olive.et` | JLTV_Unarmed_Olive |
| JLTV_Unarmed_Woodland | `{CBC466F92C9E1AE6}Prefabs/Vehicles/Wheeled/JLTV/Unarmed/JLTV_Unarmed_Woodland.et` | JLTV_Unarmed_Woodland |
| JLTV_Unarmed_Black | `{3A66B6586464A16C}Prefabs/Vehicles/Wheeled/JLTV/Unarmed/JLTV_Unarmed_Black.et` | JLTV_Unarmed_Black |

### [US] M1281 JLTV CCWC - OGPK (M2HB) — ARMED

- weapon slots: JLTV_OGPK_M2HB, JLTV_OGPK_M2HB_Olive, JLTV_OGPK_M2HB_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1281_OGPK_M2HB_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_OGPK_M2HB | `{E49B4C9AEA70BE3F}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M2HB/JLTV_OGPK_M2HB.et` | JLTV_OGPK_M2HB |
| JLTV_OGPK_M2HB_Olive | `{36EA87CEC1BE77E0}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M2HB/JLTV_OGPK_M2HB_Olive.et` | JLTV_OGPK_M2HB_Olive |
| JLTV_OGPK_M2HB_Woodland | `{0F200E9F3D3AD905}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M2HB/JLTV_OGPK_M2HB_Woodland.et` | JLTV_OGPK_M2HB_Woodland |
| JLTV_OGPK_M2HB_Black | `{5544A492985CF8C3}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M2HB/JLTV_OGPK_M2HB_Black.et` | JLTV_OGPK_M2HB_Black |

### [US] M1281 JLTV CCWC - OGPK (M134) — ARMED

- weapon slots: JLTV_OGPK_M134, JLTV_OGPK_M134_Olive, JLTV_OGPK_M134_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1281_OGPK_M134_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_OGPK_M134 | `{0FD3226BD0578D4D}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M134/JLTV_OGPK_M134.et` | JLTV_OGPK_M134 |
| JLTV_OGPK_M134_Olive | `{38BB7CA1E7013D8D}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M134/JLTV_OGPK_M134_Olive.et` | JLTV_OGPK_M134_Olive |
| JLTV_OGPK_M134_Woodland | `{BAF198F845DF6BBD}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M134/JLTV_OGPK_M134_Woodland.et` | JLTV_OGPK_M134_Woodland |
| JLTV_OGPK_M134_Black | `{5B155FFDBEE3B2AE}Prefabs/Vehicles/Wheeled/JLTV/OGPK/M134/JLTV_OGPK_M134_Black.et` | JLTV_OGPK_M134_Black |

### [US] M1278 JLTV HGC - CROWS (M2HB) — ARMED

- weapon slots: JLTV_CROWS_M2HB_Tan, JLTV_CROWS_Mount_Base, JLTV_CROWS_M2HB, JLTV_CROWS_Mount_Olive, JLTV_CROWS_M2HB_Black, JLTV_CROWS_Mount_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1278_CROWS_M2HB_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_CROWS_M2HB | `{A19889DD96914B75}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M2HB/JLTV_CROWS_M2HB.et` | JLTV_CROWS_M2HB |
| JLTV_CROWS_M2HB_Olive | `{423EA86BC26F5128}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M2HB/JLTV_CROWS_M2HB_Olive.et` | JLTV_CROWS_M2HB_Olive |
| JLTV_CROWS_M2HB_Woodland | `{2E6481BC1EE9A767}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M2HB/JLTV_CROWS_M2HB_Woodland.et` | JLTV_CROWS_M2HB_Woodland |
| JLTV_CROWS_M2HB_Black | `{21908B379B8DDE0B}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M2HB/JLTV_CROWS_M2HB_Black.et` | JLTV_CROWS_M2HB_Black |

### [US] M1278 JLTV HGC - CROWS (M134) — ARMED

- weapon slots: JLTV_CROWS_M134_Tan, JLTV_CROWS_M134, JLTV_CROWS_Mount_Olive, JLTV_CROWS_M134_Black, JLTV_CROWS_Mount_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_ANMSY2V2_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_CROWS_M134 | `{B01D12F49572C4B8}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M134/JLTV_CROWS_M134.et` | JLTV_CROWS_M134 |
| JLTV_CROWS_M134_Olive | `{D951BEDA2CBC56BC}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M134/JLTV_CROWS_M134_Olive.et` | JLTV_CROWS_M134_Olive |
| JLTV_CROWS_M134_Woodland | `{CFC943343B0D4FBA}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M134/JLTV_CROWS_M134_Woodland.et` | JLTV_CROWS_M134_Woodland |
| JLTV_CROWS_M134_Black | `{BAFF9D86755ED99F}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M134/JLTV_CROWS_M134_Black.et` | JLTV_CROWS_M134_Black |

### [US] M1278 JLTV HGC - RS6 (M230LF) — ARMED

- weapon slots: JLTV_RS6_M230LF, JLTV_CROWS_Mount_Base, JLTV_RS6_M230LF_Olive, JLTV_CROWS_Mount_Olive, JLTV_RS6_M230LF_Black, JLTV_CROWS_Mount_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1278_CROWS_II_M230LF_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_CROWS_II_M230LF | `{49B5C8D1F28E7B7F}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/M230LF/JLTV_CROWS_II_M230LF.et` | JLTV_CROWS_II_M230LF |
| JLTV_CROWS_II_M230LF_Olive | `{225A9305129485F1}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/M230LF/JLTV_CROWS_II_M230LF_Olive.et` | JLTV_CROWS_II_M230LF_Olive |
| JLTV_CROWS_II_M230LF_Woodland | `{D17CCBF7FE9AAFEC}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/M230LF/JLTV_CROWS_II_M230LF_Woodland.et` | JLTV_CROWS_II_M230LF_Woodland |
| JLTV_CROWS_II_M230LF_Black | `{41F4B0594B760AD2}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/M230LF/JLTV_CROWS_II_M230LF_Black.et` | JLTV_CROWS_II_M230LF_Black |

### [US] M1278 JLTV HGC - RS6 (M230LF/FGM-148) — ARMED

- weapon slots: JLTV_RS6_Javelin, JLTV_RS6_Javelin_Olive, JLTV_CROWS_Mount_Olive, JLTV_RS6_Javelin_Black, JLTV_CROWS_Mount_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1278_CROWS_II_Javelin_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_CROWS_II_Javelin | `{9B906EE7402FDA06}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/Javelin/JLTV_CROWS_II_Javelin.et` | JLTV_CROWS_II_Javelin |
| JLTV_CROWS_II_Javelin_Olive | `{65FE6DD2E27E366E}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/Javelin/JLTV_CROWS_II_Javelin_Olive.et` | JLTV_CROWS_II_Javelin_Olive |
| JLTV_CROWS_II_Javelin_Woodland | `{4DB3F284FE895321}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/Javelin/JLTV_CROWS_II_Javelin_Woodland.et` | JLTV_CROWS_II_Javelin_Woodland |
| JLTV_CROWS_II_Javelin_Black | `{06504E8EBB9CB94D}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/Javelin/JLTV_CROWS_II_Javelin_Black.et` | JLTV_CROWS_II_Javelin_Black |

### [US] AN/MSY-2(V)1 MADIS Mk 1 — ARMED

- weapon slots: JLTV_RS6_AIM92, JLTV_RS6_AIM92_Olive, JLTV_CROWS_Mount_Olive, JLTV_RS6_AIM92_Black, JLTV_CROWS_Mount_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_ANMSY2V1_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_CROWS_II_AIM92 | `{6BBA4A0E747D2215}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/AIM92/JLTV_CROWS_II_AIM92.et` | JLTV_CROWS_II_AIM92 |
| JLTV_CROWS_II_AIM92_Olive | `{C1DC0BFD6196A84C}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/AIM92/JLTV_CROWS_II_AIM92_Olive.et` | JLTV_CROWS_II_AIM92_Olive |
| JLTV_CROWS_II_AIM92_Woodland | `{A7E72E0E66B73009}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/AIM92/JLTV_CROWS_II_AIM92_Woodland.et` | JLTV_CROWS_II_AIM92_Woodland |
| JLTV_CROWS_II_AIM92_Black | `{A27228A13874276F}Prefabs/Vehicles/Wheeled/JLTV/CROWS_II/AIM92/JLTV_CROWS_II_AIM92_Black.et` | JLTV_CROWS_II_AIM92_Black |

### [US] M1278 JLTV HGC - CROWS (M240) — ARMED

- weapon slots: JLTV_CROWS_M240_Tan, JLTV_CROWS_M240, JLTV_CROWS_Mount_Olive, JLTV_CROWS_M240_Black, JLTV_CROWS_Mount_Black
- footprint (xob): 3.1×5.9 m, h 4.7 (JLTV_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1278_CROWS_M240_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| JLTV_CROWS_M240 | `{B852D03E85D1F66D}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M240/JLTV_CROWS_M240.et` | JLTV_CROWS_M240 |
| JLTV_CROWS_M240_Olive | `{90C4E36CF4E9E3F7}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M240/JLTV_CROWS_M240_Olive.et` | JLTV_CROWS_M240_Olive |
| JLTV_CROWS_M240_Woodland | `{8A9444452D28F5B3}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M240/JLTV_CROWS_M240_Woodland.et` | JLTV_CROWS_M240_Woodland |
| JLTV_CROWS_M240_Black | `{F36AC030AD0B6CD4}Prefabs/Vehicles/Wheeled/JLTV/CROWS/M240/JLTV_CROWS_M240_Black.et` | JLTV_CROWS_M240_Black |


## WCS_M1A1 (`5D1880C4AD410C14`, v8.1.1, folder `M1Abrams_5D1880C4AD410C14`)

### [US] M1A1 Abrams MBT — ARMED

- weapon slots: M1A1_Turret_Olive, M1A1_Turret_Desert, M1A1_Turret_Black, M1A1_Turret_MERDC, M1A1_Turret_Woodland, M1A1_Turret_Camo_Net
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A1_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A1_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A1_Olive | `{E80B119CFDF50ABE}Prefabs/Vehicles/Tracked/M1A1/M1A1_Olive.et` | M1A1_Olive |
| M1A1_Desert | `{3C3ADBCCDA1D877B}Prefabs/Vehicles/Tracked/M1A1/M1A1_Desert.et` | M1A1_Desert |
| M1A1_Black | `{8BA532C0A417859D}Prefabs/Vehicles/Tracked/M1A1/M1A1_Black.et` | M1A1_Black |
| M1A1_MERDC | `{E59B0861ABEF1EBC}Prefabs/Vehicles/Tracked/M1A1/M1A1_MERDC.et` | M1A1_MERDC |
| M1A1_Woodland | `{D35303017B8CF6CB}Prefabs/Vehicles/Tracked/M1A1/M1A1_Woodland.et` | M1A2_Woodland |
| M1A1_Camo_Net | `{56DB823510AFCD8D}Prefabs/Vehicles/Tracked/M1A1/M1A1_Camo_Net.et` | M1A1_Camo_Net |

### [US] M1A1 Abrams MBT - TUSK — ARMED

- weapon slots: M1A1_Turret_Olive, M1A1_Turret_Desert, M1A1_Turret_Black, M1A1_Turret_MERDC, M1A1_Turret_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A1_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A1_TUSK_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A1_TUSK_Olive | `{CD7AF2F088265D6C}Prefabs/Vehicles/Tracked/M1A1/M1A1_TUSK_Olive.et` | M1A1_TUSK_Olive |
| M1A1_TUSK_Desert | `{1FE5969F03C50605}Prefabs/Vehicles/Tracked/M1A1/M1A1_TUSK_Desert.et` | M1A1_TUSK_Desert |
| M1A1_TUSK_Black | `{AED4D1ACD1C4D24F}Prefabs/Vehicles/Tracked/M1A1/M1A1_TUSK_Black.et` | M1A1_TUSK_Black |
| M1A1_TUSK_MERDC | `{C0EAEB0DDE3C496E}Prefabs/Vehicles/Tracked/M1A1/M1A1_TUSK_MERDC.et` | M1A1_TUSK_MERDC |
| M1A1_TUSK_Woodland | `{9DC6EC24266A12B1}Prefabs/Vehicles/Tracked/M1A1/M1A1_TUSK_Woodland.et` | M1A2_TUSK_Woodland |

### [US] M1A2 Abrams MBT — ARMED

- weapon slots: M1A2_Turret_Olive, M1A2_Turret_Desert, M1A2_Turret_Black, M1A2_Turret_MERDC, M1A2_Turret_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_Olive | `{3A6A7AE5693A8AEC}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_Olive.et` | M1A2_Olive |
| M1A2_Desert | `{CE4C2B81BFAA47E4}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_Desert.et` | M1A2_Desert |
| M1A2_Black | `{59C459B930D805CF}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_Black.et` | M1A2_Black |
| M1A2_MERDC | `{37FA63183F209EEE}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_MERDC.et` | M1A2_MERDC |
| M1A2_Woodland | `{D568E4C745849C74}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_Woodland.et` | M1A2_Woodland |

### [US] M1A2 Abrams MBT - TUSK — ARMED

- weapon slots: M1A2_Turret_TUSK_Olive, M1A2_Turret_TUSK_Desert, M1A2_Turret_TUSK_Black, M1A2_Turret_TUSK_MERDC, M1A2_Turret_TUSK_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2_TUSK_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_TUSK_Olive | `{F0837409A618C8D5}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_Olive.et` | M1A2_TUSK_Olive |
| M1A2_TUSK_Desert | `{19DE71593DCD6CBA}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_Desert.et` | M1A2_TUSK_Desert |
| M1A2_TUSK_Black | `{932D5755FFFA47F6}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_Black.et` | M1A2_TUSK_Black |
| M1A2_TUSK_MERDC | `{FD136DF4F002DCD7}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_MERDC.et` | M1A2_TUSK_MERDC |
| M1A2_TUSK_Woodland | `{7E58A27F8F3CA2A5}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_Woodland.et` | M1A2_TUSK_Woodland |

### [US] M1A2 Abrams MBT - TUSK II — ARMED

- weapon slots: M1A2_Turret_TUSK_II_Olive, M1A2_Turret_TUSK_II_Desert, M1A2_Turret_TUSK_II_Black, M1A2_Turret_TUSK_II_MERDC, M1A2_Turret_TUSK_II_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2_TUSKII_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_TUSK_II_Olive | `{FDDB75428A1399DF}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_II_Olive.et` | M1A2_TUSK_II_Olive |
| M1A2_TUSK_II_Desert | `{9FCB847F17AA2D7E}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_II_Desert.et` | M1A2_TUSK_II_Desert |
| M1A2_TUSK_II_Black | `{9E75561ED3F116FC}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_II_Black.et` | M1A2_TUSK_II_Black |
| M1A2_TUSK_II_MERDC | `{F04B6CBFDC098DDD}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_II_MERDC.et` | M1A2_TUSK_II_MERDC |
| M1A2_TUSK_II_Woodland | `{4A2EC4B5EAA232DF}Prefabs/Vehicles/Tracked/M1A1/M1A2/M1A2_TUSK_II_Woodland.et` | M1A2_TUSK_II_Woodland |

### [US] M1A2 SEP Abrams MBT — ARMED

- weapon slots: M1A2_Turret_SEP_Olive, M1A2_Turret_SEP_Desert, M1A2_Turret_SEP_Black, M1A2_Turret_SEP_MERDC, M1A2_Turret_SEP_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2SEP_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_SEP_Olive | `{5BA42882AC191367}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_Olive.et` | M1A2_SEP_Olive |
| M1A2_SEP_Desert | `{BB9DE6444D537712}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_Desert.et` | M1A2_SEP_Desert |
| M1A2_SEP_Black | `{380A0BDEF5FB9C44}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_Black.et` | M1A2_Black |
| M1A2_SEP_MERDC | `{5634317FFA030765}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_MERDC.et` | M1A2_SEP_MERDC |
| M1A2_SEP_Woodland | `{4B81B20E657F362C}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_Woodland.et` | M1A2_Woodland |

### [US] M1A2 SEP Abrams MBT - TUSK — ARMED

- weapon slots: M1A2_Turret_SEP_TUSK_Olive, M1A2_Turret_SEP_TUSK_Desert, M1A2_Turret_SEP_TUSK_Black, M1A2_Turret_SEP_TUSK_MERDC, M1A2_Turret_SEP_TUSK_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2SEP_TUSK_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_SEP_TUSK_Olive | `{97E6C6D819561161}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_Olive.et` | M1A2_SEP_TUSK_Olive |
| M1A2_SEP_TUSK_Desert | `{873727901D36C6E2}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_Desert.et` | M1A2_SEP_TUSK_Desert |
| M1A2_SEP_TUSK_Black | `{F448E58440B49E42}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_Black.et` | M1A2_TUSK_Black |
| M1A2_SEP_TUSK_MERDC | `{9A76DF254F4C0563}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_MERDC.et` | M1A2_SEP_TUSK_MERDC |
| M1A2_SEP_TUSK_Woodland | `{83E94C3DD1035876}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_Woodland.et` | M1A2_TUSK_Woodland |

### [US] M1A2 SEP Abrams MBT - TUSK II — ARMED

- weapon slots: M1A2_Turret_SEP_TUSK_II_Olive, M1A2_Turret_SEP_TUSK_II_Desert, M1A2_Turret_SEP_TUSK_II_Black, M1A2_Turret_SEP_TUSK_II_MERDC, M1A2_Turret_SEP_TUSK_II_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2SEP_TUSKII_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_SEP_TUSK_II_Olive | `{0DA07CC21D6BDAFE}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_II_Olive.et` | M1A2_SEP_TUSK_II_Olive |
| M1A2_SEP_TUSK_II_Desert | `{F8AE36AEA8E4F4CA}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_II_Desert.et` | M1A2_SEP_TUSK_II_Desert |
| M1A2_SEP_TUSK_II_Black | `{B38C1A5488F079DA}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_II_Black.et` | M1A2_TUSK_II_Black |
| M1A2_SEP_TUSK_II_MERDC | `{0030653F4B71CEFC}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_II_MERDC.et` | M1A2_SEP_TUSK_II_MERDC |
| M1A2_SEP_TUSK_II_Woodland | `{DD7D16305C4B348B}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEP/M1A2_SEP_TUSK_II_Woodland.et` | M1A2_TUSK_II_Woodland |

### [US] M1A2 SEPv2 Abrams MBT — ARMED

- weapon slots: M1A2_Turret_SEPv2_Olive, M1A2_Turret_SEPv2_Desert, M1A2_Turret_SEPv2_Black, M1A2_Turret_SEPv2_MERDC, M1A2_Turret_SEPv2_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2SEPV2_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_SEPv2_Olive | `{63BBA47D1396A29A}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_Olive.et` | M1A2_SEPv2_Olive |
| M1A2_SEPv2_Desert | `{E3478B6101A0D506}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_Desert.et` | M1A2_SEPv2_Desert |
| M1A2_SEPv2_Black | `{001587214A742DB9}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_Black.et` | M1A2_Black |
| M1A2_SEPv2_MERDC | `{AA2C157A78544E69}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_MERDC.et` | M1A2_SEPv2_MERDC |
| M1A2_SEPv2_Woodland | `{55C088142E28B2C4}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_Woodland.et` | M1A2_Woodland |

### [US] M1A2 SEPv2 Abrams MBT - TUSK — ARMED

- weapon slots: M1A2_Turret_SEPv2_TUSK_Olive, M1A2_Turret_SEPv2_TUSK_Desert, M1A2_Turret_SEPv2_TUSK_Black, M1A2_Turret_SEPv2_TUSK_MERDC, M1A2_Turret_SEPv2_TUSK_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2SEPV2_TUSK_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_SEPv2_TUSK_Olive | `{8439CC2A8142F952}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_Olive.et` | M1A2_SEPv2_TUSK_Olive |
| M1A2_SEPv2_TUSK_Desert | `{74714B5AB71BF9B3}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_Desert.et` | M1A2_SEPv2_TUSK_Desert |
| M1A2_SEPv2_TUSK_Black | `{E797EF76D8A07671}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_Black.et` | M1A2_TUSK_Black |
| M1A2_SEPv2_TUSK_MERDC | `{D1D2D8ADC6E1D409}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_MERDC.et` | M1A2_SEPv2_TUSK_MERDC |
| M1A2_SEPv2_TUSK_Woodland | `{4F36F39A7D2BD8C8}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_Woodland.et` | M1A2_TUSK_Woodland |

### [US] M1A2 SEPv2 Abrams MBT - TUSK II — ARMED

- weapon slots: M1A2_Turret_SEPv2_TUSK_II_Olive, M1A2_Turret_SEPv2_TUSK_II_Desert, M1A2_Turret_SEPv2_TUSK_II_Black, M1A2_Turret_SEPv2_TUSK_II_MERDC, M1A2_Turret_SEPv2_TUSK_II_Woodland
- footprint (xob): 3.8×8.5 m, h 1.8 (M1A2_Base.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1A2SEPV2_TUSKII_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1A2_SEPv2_TUSK_II_Olive | `{85C341C47BB85A5B}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_II_Olive.et` | M1A2_SEPv2_TUSK_II_Olive |
| M1A2_SEPv2_TUSK_II_Desert | `{F724F30392D60403}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_II_Desert.et` | M1A2_SEPv2_TUSK_II_Desert |
| M1A2_SEPv2_TUSK_II_Black | `{E66D6298225AD578}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_II_Black.et` | M1A2_TUSK_II_Black |
| M1A2_SEPv2_TUSK_II_MERDC | `{DD009448F2936A27}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_II_MERDC.et` | M1A2_SEPv2_TUSK_II_MERDC |
| M1A2_SEPv2_TUSK_II_Woodland | `{002BA4FFE1B53B81}Prefabs/Vehicles/Tracked/M1A1/M1A2/SEPv2/M1A2_SEPv2_TUSK_II_Woodland.et` | M1A2_TUSK_II_Woodland |


## WCS_BMP-3 (`5B383D4CB27E0D54`, v8.1.1, folder `WCS_BMP-3_5B383D4CB27E0D54`)

### [USSR] BMP-3 IFV — ARMED

- weapon slots: BMP3_Turret, BMP3_PKMT_Mount_Front_L, BMP3_PKMT_Mount_Front_R
- footprint (xob): 3.2×7.2 m, h 2.1 (BMP3_Body.xob)
- default occupants: Character_USSR_Crew, Character_USSR_Rifleman_KLMK, Character_USSR_SL_KLMK, Character_USSR_AR_KLMK, Character_USSR_GL_KLMK, Character_USSR_AT_KLMK
- name key: `#WCS-Vehicle_BMP3_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| BMP3_Base | `{1BE270891F0F3772}Prefabs/Vehicles/Tracked/BMP3/BMP3_Base.et` | BMP3 |


## WCS_BMP-1 (`5E524E4FEECCA92B`, v8.1.1, folder `BMP-1IFV_5E524E4FEECCA92B`)

### [FIA] BMP-1 IFV — ARMED

- weapon slots: BMP1_Turret_FIA, BMP1_Commander_Turret_FIA, BMP1_Turret_FIA_Desert, BMP1_Commander_Turret_FIA_Desert
- footprint (xob): 3×6.7 m, h 2.4 (BMP1_Body.xob)
- default occupants: Character_FIA_Crew, Character_FIA_SL, Character_FIA_MG, Character_FIA_AT, Character_FIA_AAT, Character_FIA_Sharpshooter, Character_FIA_Sapper, Character_FIA_AMG, Character_FIA_Rifleman
- name key: `#WCS-Vehicle_BMP1_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| BMP1_FIA | `{0144F571F1998FC4}Prefabs/Vehicles/Tracked/BMP1/BMP1_FIA.et` | BMP1_FIA |
| BMP1_FIA_Desert | `{C3CD1D637852C785}Prefabs/Vehicles/Tracked/BMP1/BMP1_FIA_Desert.et` | BMP1_FIA_Desert |

### [FIA] BMP-1P IFV — ARMED

- weapon slots: BMP1P_Turret_FIA, BMP1_Commander_Turret_FIA, BMP1P_Turret_FIA_Desert, BMP1_Commander_Turret_FIA_Desert
- footprint (xob): 3×6.7 m, h 2.4 (BMP1_Body.xob)
- default occupants: Character_FIA_Crew, Character_FIA_SL, Character_FIA_MG, Character_FIA_AT, Character_FIA_AAT, Character_FIA_Sharpshooter, Character_FIA_Sapper, Character_FIA_AMG, Character_FIA_Rifleman
- name key: `#WCS-Vehicle_BMP1P_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| BMP1P_FIA | `{BF0050432603DD9E}Prefabs/Vehicles/Tracked/BMP1/BMP1P_FIA.et` | BMP1P_FIA |
| BMP1P_FIA_Desert | `{828E8711567C3242}Prefabs/Vehicles/Tracked/BMP1/BMP1P_FIA_Desert.et` | BMP1P_FIA_Desert |

### [USSR] BMP-1 IFV — ARMED

- weapon slots: BMP1_Turret, BMP1_Commander_Turret, BMP1_Turret_Desert, BMP1_Commander_Turret_Desert
- footprint (xob): 3×6.7 m, h 2.4 (BMP1_Body.xob)
- default occupants: Character_USSR_Crew, Character_USSR_SL, Character_USSR_GL, Character_USSR_AT, Character_USSR_AAT, Character_USSR_SR, Character_USSR_Sharpshooter, Character_USSR_AR
- name key: `#WCS-Vehicle_BMP1_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| BMP1_Base | `{1DC01AAACFFA8B63}Prefabs/Vehicles/Tracked/BMP1/BMP1_Base.et` | BMP1 |
| BMP1_Desert | `{68A65EFA9B616798}Prefabs/Vehicles/Tracked/BMP1/BMP1_Desert.et` | BMP1_Desert |

### [USSR] BMP-1P IFV — ARMED

- weapon slots: BMP1P_Turret, BMP1_Commander_Turret, BMP1P_Turret_Desert, BMP1_Commander_Turret_Desert
- footprint (xob): 3×6.7 m, h 2.4 (BMP1_Body.xob)
- default occupants: Character_USSR_Crew, Character_USSR_SL, Character_USSR_GL, Character_USSR_AT, Character_USSR_AAT, Character_USSR_SR, Character_USSR_Sharpshooter, Character_USSR_AR
- name key: `#WCS-Vehicle_BMP1P_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| BMP1P_Base | `{3868E03D9A4AF186}Prefabs/Vehicles/Tracked/BMP1/BMP1P_Base.et` | BMP1P |
| BMP1P_Desert | `{C334AD811A3BFFFC}Prefabs/Vehicles/Tracked/BMP1/BMP1P_Desert.et` | BMP1P_Desert |


## WCS_FMTV (`65B60A48AEC31157`, v8.1.1, folder `WCS_FMTV_65B60A48AEC31157`)

### [US] M1083A1P2 FMTV Transport Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Transport_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Transport | `{A0CB8452B09E992D}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport.et` | M1083_Transport |
| M1083_Transport_Tan | `{50F6A20DD290B695}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Tan.et` | M1083_Transport_Tan |
| M1083_Transport_Woodland | `{45117DD549207A77}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Woodland.et` | M1083_Transport_Woodland |

### [US] M1083A1P2 FMTV Covered Transport Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Transport_Covered_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Transport_Covered | `{D63E8CFB4CAA9B32}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Covered.et` | M1083_Transport_Covered |
| M1083_Transport_Covered_Tan | `{601E2E6A55E48406}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Covered_Tan.et` | M1083_Transport_Covered_Tan |
| M1083_Transport_Covered_Woodland | `{ACCF3C5D1629AF7F}Prefabs/Vehicles/Wheeled/M1083/M1083_Transport_Covered_Woodland.et` | M1083_Transport_Covered_Woodland |

### [US] M1083A1P2 FMTV Arsenal Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Arsenal_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Arsenal | `{F755CFD6C7ACD54B}Prefabs/Vehicles/Wheeled/M1083/M1083_Arsenal.et` | M1083_Arsenal |
| M1083_Arsenal_Tan | `{DA803ABE69049F11}Prefabs/Vehicles/Wheeled/M1083/M1083_Arsenal_Tan.et` | M1083_Arsenal_Tan |
| M1083_Arsenal_Woodland | `{D3C91DB25F8ADBC2}Prefabs/Vehicles/Wheeled/M1083/M1083_Arsenal_Woodland.et` | M1083_Arsenal_Woodland |

### [US] M1083A1P2 FMTV Ammunition Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Ammo_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Ammo | `{22C47D1CF796C4C3}Prefabs/Vehicles/Wheeled/M1083/M1083_Ammo.et` | M1083_Arsenal |
| M1083_Ammo_Tan | `{C9A428975CC7C1C7}Prefabs/Vehicles/Wheeled/M1083/M1083_Ammo_Tan.et` | M1083_Arsenal_Tan |
| M1083_Ammo_Woodland | `{74FE0C47872EEF57}Prefabs/Vehicles/Wheeled/M1083/M1083_Ammo_Woodland.et` | M1083_Arsenal_Woodland |

### [US] M1083A1P2 FMTV Repair Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Repair_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Repair | `{2DC2AC00F7986CBD}Prefabs/Vehicles/Wheeled/M1083/M1083_Repair.et` | M1083_Engineer |
| M1083_Repair_Tan | `{83486836EF4CE160}Prefabs/Vehicles/Wheeled/M1083/M1083_Repair_Tan.et` | M1083_Engineer_Tan |
| M1083_Repair_Woodland | `{28E68108FB20CABA}Prefabs/Vehicles/Wheeled/M1083/M1083_Repair_Woodland.et` | M1083_Engineer_Woodland |

### [US] M1083A1P2 FMTV Construction Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Engineer_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Engineer | `{8DF0C4823CB4224D}Prefabs/Vehicles/Wheeled/M1083/M1083_Engineer.et` | M1083_Engineer |
| M1083_Engineer_Tan | `{60D35A6E23462128}Prefabs/Vehicles/Wheeled/M1083/M1083_Engineer_Tan.et` | M1083_Engineer_Tan |
| M1083_Engineer_Woodland | `{41B161496B7F805D}Prefabs/Vehicles/Wheeled/M1083/M1083_Engineer_Woodland.et` | M1083_Engineer_Woodland |

### [US] M1091A1P2 FMTV Fuel Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1091A1P2_Fuel_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1091_Tanker | `{2C091881E27BE938}Prefabs/Vehicles/Wheeled/M1083/M1091_Tanker.et` | M1091_Tanker |
| M1091_Tanker_Tan | `{4F780C30D239F63C}Prefabs/Vehicles/Wheeled/M1083/M1091_Tanker_Tan.et` | M1091_Tanker_Tan |
| M1091_Tanker_Woodland | `{5B2C8B33EEEEF5E5}Prefabs/Vehicles/Wheeled/M1083/M1091_Tanker_Woodland.et` | M1091_Tanker_Woodland |

### [US] M1083A1P2 FMTV Command Truck — unarmed

- weapon slots: none
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Command_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Command | `{DE1947A6D4DECD2C}Prefabs/Vehicles/Wheeled/M1083/M1083_Command.et` | M1083_Command |
| M1083_Command_Tan | `{888FFC71FC66385F}Prefabs/Vehicles/Wheeled/M1083/M1083_Command_Tan.et` | M1083_Command_Tan |
| M1083_Command_Woodland | `{E5D66B1A14745C24}Prefabs/Vehicles/Wheeled/M1083/M1083_Command_Woodland.et` | M1083_Command_Woodland |

### [US] M1083A1P2 FMTV Transport Truck (M2HB) — ARMED

- weapon slots: M1083_Gun_Mount_M2HB, M1083_Gun_Mount_M2HB_Tan
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Transport_Armed_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Transport_Armed | `{BE134ED7F4CCB5B9}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Armed.et` | M1083_Transport_Armed |
| M1083_Transport_Armed_Tan | `{EEF937341E143F0F}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Armed_Tan.et` | M1083_Transport_Armed_Tan |
| M1083_Transport_Armed_Woodland | `{4630C86216C9197A}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Armed_Woodland.et` | M1083_Transport_Armed_Woodland |

### [US] M1083A1P2 FMTV Covered Transport Truck (M2HB) — ARMED

- weapon slots: M1083_Gun_Mount_M2HB, M1083_Gun_Mount_M2HB_Tan
- footprint (xob): 2.8×7.6 m, h 2.5 (M1083_Base.xob)
- default occupants: Character_US_Rifleman
- name key: `#WCS-Vehicle_M1083A1P2_Transport_Covered_Armed_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| M1083_Transport_Covered_Armed | `{E2751F78ABD079B3}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Covered_Armed.et` | M1083_Transport_Covered_Armed |
| M1083_Transport_Covered_Armed_Tan | `{5AB4A22570AD6B48}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Covered_Armed_Tan.et` | M1083_Transport_Covered_Armed_Tan |
| M1083_Transport_Covered_Armed_Woodland | `{A815C3244E04D61A}Prefabs/Vehicles/Wheeled/M1083/Armed/M1083_Transport_Covered_Armed_Woodland.et` | M1083_Transport_Covered_Armed_Woodland |


## WCS_Stryker (`5B02128D896F7DE8`, v8.1.0, folder `STRYKER_5B02128D896F7DE8`)

### [US] M1126 Stryker ICV (RU: БТР М1126 \"Stryker\") — unarmed

- weapon slots: none
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1126_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_APC | `{249A75FB99B24A57}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_APC.et` | Stryker_APC |
| Stryker_APC_MERDC | `{F2307260A1B40F43}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_APC_MERDC.et` | Stryker_APC_MERDC |
| Stryker_APC_Tan | `{2551B455EA37BFD8}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_APC_Tan.et` | Stryker_APC_Tan |

### [US] M1126 Stryker ICV - Slat Armor — unarmed

- weapon slots: none
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1126_SlatArmor_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_Cage | `{7A561BEDC287CC52}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_Cage.et` | Stryker_Cage |
| Stryker_Cage_MERDC | `{E80BE5CFA7FFB275}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_Cage_MERDC.et` | Stryker_Cage_MERDC |
| Stryker_Cage_Tan | `{5FF95B515AAAD92F}Prefabs/Vehicles/Wheeled/Stryker/M1126/Stryker_Cage_Tan.et` | Stryker_Cage_Tan |

### [US] M1126 Stryker ICV - CROWS (M2HB) — ARMED

- weapon slots: Stryker_CROWS_Turret, Stryker_CROWS_Turret_MERDC, Stryker_CROWS_Turret_Tan
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1126_CROWS_M2HB_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_CROWS | `{E3DD72FD06BA2320}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS.et` | Stryker_CROWS |
| Stryker_CROWS_MERDC | `{73C1BB5B830C9F05}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_MERDC.et` | Stryker_CROWS_MERDC |
| Stryker_CROWS_Tan | `{65A1EB5BC8449FD3}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Tan.et` | Stryker_CROWS_Tan |

### [US] M1126 Stryker ICV - CROWS (M2HB) - Slat Armor — ARMED

- weapon slots: Stryker_CROWS_Turret, Stryker_CROWS_Turret_MERDC, Stryker_CROWS_Turret_Tan
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1126_CROWS_M2HB_SlatArmor_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_CROWS_Cage | `{5F17F054025E8B30}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Cage.et` | Stryker_CROWS_Cage |
| Stryker_CROWS_Cage_MERDC | `{094A1ECBEE1D9AD1}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Cage_MERDC.et` | Stryker_CROWS_Cage_MERDC |
| Stryker_CROWS_Cage_Tan | `{46A5E64726FCE76B}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Stryker_CROWS_Cage_Tan.et` | Stryker_CROWS_Cage_Tan |

### [US] M1126 Stryker ICV - CROWS-J (M2HB/FGM-148) - Slat Armor — ARMED

- weapon slots: Stryker_CROWS_Turret_Javelin, Stryker_CROWS_Turret_Javelin_MERDC, Stryker_CROWS_Turret_Javelin_Tan
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1126_CROWSJ_M2HB_FGM148_SlatArmor_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_CROWS_Javelin | `{91325B8E3EE8E4DD}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Javelin/Stryker_CROWS_Javelin.et` | Stryker_CROWS_Javelin |
| Stryker_CROWS_Javelin_MERDC | `{2AFBAB30EC3850F1}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Javelin/Stryker_CROWS_Javelin_MERDC.et` | Stryker_CROWS_Javelin_MERDC |
| Stryker_CROWS_Javelin_Tan | `{B47F060F2339FF28}Prefabs/Vehicles/Wheeled/Stryker/M1126/CROWS/Javelin/Stryker_CROWS_Javelin_Tan.et` | Stryker_CROWS_Javelin_Tan |

### [US] M1296 Stryker Dragoon (RU: БМП М1296 \"Stryker Dragoon\") — ARMED

- weapon slots: Stryker_Dragoon_Turret, Stryker_Dragoon_Turret_MERDC, Stryker_Dragoon_Turret_Tan
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1296_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_Dragoon | `{45DDFA40E1CB6B82}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon.et` | Stryker_Dragoon |
| Stryker_Dragoon_MERDC | `{D5BECC338A58208D}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_MERDC.et` | Stryker_Dragoon_MERDC |
| Stryker_Dragoon_Tan | `{4864299FF517BF20}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Tan.et` | Stryker_Dragoon_Tan |

### [US] M1296 Stryker Dragoon - Slat Armor — ARMED

- weapon slots: Stryker_Dragoon_Turret, Stryker_Dragoon_Turret_MERDC, Stryker_Dragoon_Turret_Tan
- footprint (xob): 3.2×7.5 m, h 3.8 (Stryker_Base.xob)
- default occupants: Character_US_CC, Character_US_SL, Character_US_AR, Character_US_GL, Character_US_LAT, Character_US_TL, Character_US_Ammo
- name key: `#WCS-Vehicle_M1296_SlatArmor_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_Dragoon_Cage | `{44E2468321E19451}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Cage.et` | Stryker_Dragoon_Cage |
| Stryker_Dragoon_Cage_MERDC | `{F1E9603C6635BE0F}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Cage_MERDC.et` | Stryker_Dragoon_Cage_MERDC |
| Stryker_Dragoon_Cage_Tan | `{B139673755B7015E}Prefabs/Vehicles/Wheeled/Stryker/M1296/Stryker_Dragoon_Cage_Tan.et` | Stryker_Dragoon_Cage_Tan |

### [US] M1128 Stryker MGS (RU: БМТВ М1128 \"Mobile Gun System\") — ARMED

- weapon slots: Stryker_MGS_Turret, Stryker_MGS_Turret_MERDC, Stryker_MGS_Turret_Tan
- footprint (xob): 2.9×7.3 m, h 3.4 (Stryker_MGS.xob)
- default occupants: Character_US_Crew
- name key: `#WCS-Vehicle_M1128_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| Stryker_MGS | `{A6783FAA5D516D68}Prefabs/Vehicles/Wheeled/Stryker/M1128/Stryker_MGS.et` | Stryker_MGS |
| Stryker_MGS_MERDC | `{A76DCC7AD6494682}Prefabs/Vehicles/Wheeled/Stryker/M1128/Stryker_MGS_MERDC.et` | Stryker_MGS_MERDC |
| Stryker_MGS_Tan | `{533DA733380D5E55}Prefabs/Vehicles/Wheeled/Stryker/M1128/Stryker_MGS_Tan.et` | Stryker_MGS_Tan |


## WCS_MRZR (`64900A5A31F5DCB5`, v8.1.1, folder `WCS_MRZR_64900A5A31F5DCB5`)

### [US] MRZR D4 — unarmed

- weapon slots: none
- footprint (xob): 1.5×3.6 m, h 1.7 (MRZR_Body.xob)
- default occupants: Character_US_SF_SL, Character_US_SF_RTO, Character_US_SF_LMG, Character_US_SF_Sharpshooter
- name key: `#WCS-Vehicle_MRZR_D4_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| MRZR_D4_Unarmed_Camo | `{AC8918B033DB356D}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Camo.et` | MRZR_D4_Unarmed_Camo |
| MRZR_D4_Unarmed_Olive | `{DA7CF11F1BD23125}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Olive.et` | MRZR_D4_Unarmed_Olive |
| MRZR_D4_Unarmed_Tan | `{B83B4C8BE05C9554}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Tan.et` | MRZR_D4_Unarmed_Tan |

### [US] MRZR D4 - M2HB — ARMED

- weapon slots: MRZR_Gun_Mount_M2HB, MRZR_Gun_Mount_M2HB_Tan
- footprint (xob): 1.5×3.6 m, h 1.7 (MRZR_Body.xob)
- default occupants: Character_US_SF_SL, Character_US_SF_RTO, Character_US_SF_LMG, Character_US_SF_Sharpshooter
- name key: `#WCS-Vehicle_MRZR_D4_M2HB_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| MRZR_D4_M2HB_Camo | `{D5BC187ABE85A153}Prefabs/Vehicles/Wheeled/MRZR/M2HB/MRZR_D4_M2HB_Camo.et` | MRZR_D4_M2HB_Camo |
| MRZR_D4_M2HB_Olive | `{497CF28714CD35CB}Prefabs/Vehicles/Wheeled/MRZR/M2HB/MRZR_D4_M2HB_Olive.et` | MRZR_D4_M2HB_Olive |
| MRZR_D4_M2HB_Tan | `{8D59697F5C0A6DFC}Prefabs/Vehicles/Wheeled/MRZR/M2HB/MRZR_D4_M2HB_Tan.et` | MRZR_D4_M2HB_Tan |

### [USSR] MRZR D4 — unarmed

- weapon slots: none
- footprint (xob): 1.5×3.6 m, h 1.7 (MRZR_Body.xob)
- default occupants: Character_US_SF_SL, Character_US_SF_RTO, Character_US_SF_LMG, Character_US_SF_Sharpshooter
- name key: `#WCS-Vehicle_MRZR_D4_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| MRZR_D4_Unarmed_Black | `{D768882A4BA33526}Prefabs/Vehicles/Wheeled/MRZR/Unarmed/MRZR_D4_Unarmed_Black.et` | MRZR_D4_Unarmed_Black |

### [USSR] MRZR D4 - NSV — ARMED

- weapon slots: MRZR_Gun_Mount_NSV
- footprint (xob): 1.5×3.6 m, h 1.7 (MRZR_Body.xob)
- default occupants: Character_US_SF_SL, Character_US_SF_RTO, Character_US_SF_LMG, Character_US_SF_Sharpshooter
- name key: `#WCS-Vehicle_MRZR_D4_NSV_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| MRZR_D4_NSV_Black | `{C63657059F3EF831}Prefabs/Vehicles/Wheeled/MRZR/NSV/MRZR_D4_NSV_Black.et` | MRZR_D4_NSV_Black |

### [USSR] MRZR D4 - NSV (SPP) — ARMED

- weapon slots: MRZR_Gun_Mount_NSV_SPP
- footprint (xob): 1.5×3.6 m, h 1.7 (MRZR_Body.xob)
- default occupants: Character_US_SF_SL, Character_US_SF_RTO, Character_US_SF_LMG, Character_US_SF_Sharpshooter
- name key: `#WCS-Vehicle_MRZR_D4_NSV_SPP_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| MRZR_D4_NSV_SPP_Black | `{74C20AC5FE868229}Prefabs/Vehicles/Wheeled/MRZR/NSV/MRZR_D4_NSV_SPP_Black.et` | MRZR_D4_NSV_SPP_Black |


## WCS_T-72 (`5E0AB16BEB16D6A4`, v8.2.1, folder `T-72MainBattleTank_5E0AB16BEB16D6A4`) — second batch, added 2026-09-22

Downloaded + extracted 2026-09-22 (`reference\WCS_T-72`, 90 MB, 268 files). Its gproj lists
SpaceCore + Armaments, and the download moved BOTH shared deps to **8.2.1** (the seven
first-batch mods stay at 8.1.x on disk and still load against them — WB-validated with the
`--wcs` spike). Catalogs: `Configs/EntityCatalog/USSR/Vehicles/WCS_T72.conf` (4 USSR entries,
multi-list appended via the `Vehicles_EntityCatalog_USSR.conf` override) + a direct
`Vehicles_EntityCatalog_FIA.conf` override (2 FIA entries) + a USSR `InventoryItems` append (5
vehicle-ammo items — 125 mm rack magazines, excluded from the arsenal pool by rule). All six
prefabs parent `WCS_SpaceCore`'s `Tracked_Base.et`; the T-72B chain parents `T72A_Base.et`, the
Desert/FIA liveries parent their mark's base — every catalog GUID is corroborated as a parent ref
except the four leaf liveries (catalog-only, normal). `m_eSlotTypes VEHICLE_MEDIUM`. Names via
`Language/wcs_t72_localization.en_us.conf` (RU table = EN copy; the `SPC-` duplicates of the
same keys are the author's older namespace).

### [USSR] T-72A Main Battle Tank — ARMED

- weapon slots: T72A_Turret_Base / _Desert / _FIA → `Cannon_2A46_T72A` (APFSDS) + `Cannon_2A46_T72A_HE` (HE-FRAG) + coaxial vanilla `MG_PKMT`; commander cupola `T72A_Commander_Turret*` → `HMG_NSV_MG` 12.7 mm (default occupant `Character_USSR_CC`)
- footprint (xob): 3.6×6.8 m, h 3.0 (T72A_Base.xob; turret 2.5×2.9, wreck 3.4×6.6)
- default occupants: Character_USSR_Crew (FIA livery: Character_FIA_Crew)
- name key: `#WCS-Vehicle_T72A_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| T72A_Base | `{BC07885176C7FF8A}Prefabs/Vehicles/Tracked/T72A/T72A_Base.et` | T72A (copied as T72A_Base) |
| T72A_Desert | `{AF1C02364D45CC5B}Prefabs/Vehicles/Tracked/T72A/T72A_Desert.et` | T72A_Desert |
| T72A_FIA | `{2B9DB09AC8BEA673}Prefabs/Vehicles/Tracked/T72A/T72A_FIA.et` | T72A_FIA |

### [USSR] T-72B Main Battle Tank — ARMED

- weapon slots: T72B_Turret / _Desert / _FIA (parent T72A_Turret_Base) → `Cannon_2A46_T72B` (APFSDS) + `_HE` + `_HEAT` (HEAT-FS, third feed) + coaxial `MG_PKMT` + an `Armament_Empty` slot; same NSV commander cupola; 18 `T72B_Kontakt_Turret_*` + 27 `Kontakt_Hull_*` ERA tiles (`Prefabs/Vehicles/Core/ERA/Kontakt_Base.et`)
- footprint (xob): 3.6×6.8 m, h 3.0 (T72A_Base.xob — same hull)
- default occupants: Character_USSR_Crew (FIA livery: Character_FIA_Crew)
- name key: `#WCS-Vehicle_T72B_Name`

| livery variant | ref | thumb (EditorPreview basename) |
|---|---|---|
| T72B_Base | `{726286E1F9570EA1}Prefabs/Vehicles/Tracked/T72B/T72B_Base.et` | T72B (copied as T72B_Base) |
| T72B_Desert | `{0154275FD6AE2370}Prefabs/Vehicles/Tracked/T72B/T72B_Desert.et` | T72B_Desert |
| T72B_FIA | `{D9EB40D7AD0966EC}Prefabs/Vehicles/Tracked/T72B/T72B_FIA.et` | T72B_FIA |

Registry: `generator/mods/wcs-t72.mjs` (id `wcst72`, keys `WCS_T72A_*` / `WCS_T72B_*`, labels EN
name + " (Green|Desert|FIA)"); `patrolVehicleKeys` = the two Green bases; `vehicleSizeClass`
heavy via the `WCS_T72[AB]_` prefix. The `--wcs` spike gained a T-72A Desert spawn slot and a
T-72B Green in the mounted patrol (8 GUIDs in addon.gproj). Baseline seeded 2026-09-22.

## Builder integration (decided + built 2026-09-10)

**2026-09-15: WCS_BMP-1 HIDDEN** (`hidden: true` in `wcs-bmp1.mjs`) — user playtest found the mod bugged in-game. The other six shipped to production the same day.

1. **Liveries**: every catalog entry is its own key (`WCS_<prefab basename>`, label = EN name + " (livery)"; base liveries named from the previews: JLTV = Tan, FMTV/Stryker/BMP-1 = Green; FIA BMP-1s carry "(FIA, …)"). `patrolVehicleKeys` / `transportVehicleKeys` list ONE representative livery per distinct vehicle (base livery, Olive for the all-suffixed M1 Abrams + MRZR, USSR only for the BMP-1 twins); the new optional `armedVehicleKeys` carries every armed key so the spawn picker's Armed/Unarmed chips stay right.
2. **AI patrol candidates**: tanks/IFVs/ATGM/AA carriers ARE candidates — playtest gate (MountedPatrol plugin has only ever driven MG-armed wheeled vehicles + BRDM/BTR).
3. **Registry**: seven separate defs `generator/mods/wcs-*.mjs` (ids `wcsjltv wcsm1a1 wcsbmp3 wcsbmp1 wcsfmtv wcsstryker wcsmrzr`), seven "Vehicle mods" checkboxes. A second WCS batch is planned.
4. **Size class**: `vehicleSizeClass` regex → heavy for `WCS_M1A[12]_ | WCS_BMP[13]P?_ | WCS_Stryker_ | WCS_M108x_/M109x_` (footprint rule: hulls > 6 m need the 5×10 heavy slot; role stays "transport" via the unarmed list). JLTV (5.9 m) and MRZR light.
5. **Thumbnails**: 164 PNGs at 200×150 in `web/public/icons/prefabs/`, named by PREFAB basename (20 entries share a preview with a sibling — M1A2 SEP/SEPv2 Black+Woodland reuse the M1A2 images, FMTV Ammo→Arsenal / Repair→Engineer, BMPx_Base→BMPx — copied under the prefab name, no THUMB_FALLBACKS needed).
6. **Spike** `--wcs` (TS_WebSpikeWCS): 4 spawn vehicles (JLTV CROWS, MRZR, FMTV covered, Stryker ICV — light + heavy slots), BRDM2+BMP-1+BMP-3 mounted patrol, M1A1 Olive deliver target → .gproj lists the 7 GUIDs exactly once. Workbench-validated 2026-09-10 via temporary junctions (9 addons resolved, all slots present, 0 errors on our resources; the mods' `Wrong GUID/name … Language/*.st` lines are their stripped string-table sources, same as ACE's). Audit baselines seeded (`fingerprint --write` × 7), `check` clean for all seven (the "unreferenced catalog prefabs" are the vehicle-ammo inventory appends).
