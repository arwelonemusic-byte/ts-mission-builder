# Roster labels — roles and groups per enemy-capable faction

Generated 2026-09-21 by `node generator/tools/label-roster.mjs` from `input/characters-harvest.json` + the registry's `groupSets` (regenerate, don't hand-edit; tweak the label dictionaries in the script). JSON twin: `input/roster-labels.json`.

**Roles** = character prefabs collapsed per subfaction on their role STEM (basename minus the faction prefix and the `_2`/`3`/`_Variant_1` suffix); the emission script picks one variant at random. Labels come from a stem dictionary shared by all factions (so RHS "Rifleman"-named M249 gunners still read Automatic Rifleman); stems the dictionary doesn't know keep the game's own name ("game name" in the Source column). Unarmed shells, non-shipping prefabs and GUID-less prefabs are excluded (listed at the end). `Guard/` and FIA `Special Units/` prefabs fold into the parent subfaction's role of the same stem. Subfactions with no registry group set are marked — roles there are placeable, but no groups exist for them yet.

**Groups** = every ref in the registry's `groupSets`, collapsed the same way (CDF RifleSquad + RifleSquad2). Columns show the proposed label, the game's own name and the unit-slot count so the label can be judged. Size classes: small/medium/large per the 1.8 count rule, plus the set's sentry/defense picks.

## Roles

### US — US (40 roles, 45 prefabs)

#### US Army (registry set `US_Army`, 24 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 1: `Character_US_Ammo` | Rifle_M16A2 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_US_AMG` | Rifle_M16A2 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 2: `Character_US_AR`, `Character_US_AR_Guard` (Guard) | MG_M249 | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 1: `Character_US_CC` | Rifle_M16A2_carbine | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_US_Crew` | Rifle_M16A2_carbine | stem |
| **Engineer** | Инженер | `Engineer` | Sapper | 1: `Character_US_Engineer` | Rifle_M16A2 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 2: `Character_US_GL`, `Character_US_GL_Guard` (Guard) | Rifle_M16A2_M203 | stem |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_US_HeliCrew` | Handgun_M9 | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_US_HeliPilot` | Handgun_M9 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 2: `Character_US_LAT`, `Character_US_LAT_Guard` (Guard) | Rifle_M16A2 + Launcher_M72A3 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_US_MG` | MG_M60 + Handgun_M9 | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_US_Medic` | Rifle_M16A2 | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_US_Officer` | Handgun_M9 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `Character_US_PL` | Rifle_M16A2 + Handgun_M9 | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 1: `Character_US_Sergeant` | Rifle_M16A2 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_US_RTO` | Rifle_M16A2 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 2: `Character_US_Rifleman`, `Character_US_Rifleman_Variant_1` | Rifle_M16A2 | stem |
| **Sapper** | Сапер | `Sapper` | Combat Engineer | 1: `Character_US_Sapper` | Rifle_M16A2 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 1: `Character_US_Scout` | Rifle_M16A2_OliveGreen_Solid | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 1: `Character_US_Scout_RTO` | Rifle_M16A2_OliveGreen_Solid | stem |
| **Sniper** | Снайпер | `Sniper` | Sniper | 1: `Character_US_Sniper` | Rifle_M21_ARTII + Handgun_M9 | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 1: `Character_US_Spotter` | Rifle_M16A2_carbine_M203_OliveGreen_Solid | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_US_SL` | Rifle_M16A2 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 2: `Character_US_TL`, `Character_US_TL_Guard` (Guard) | Rifle_M16A2_4x20 | stem |

#### Green Berets (registry set `GreenBerets`, 9 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Grenadier** | Гранатометчик (ГП) | `GL` | Special Forces Grenadier | 1: `Character_US_SF_GL` | Rifle_M16A2_carbine_M203_OliveGreen_Sand_Stripes | stem |
| **Machine Gunner** | Пулеметчик | `LMG` | Special Forces Machine-Gunner | 1: `Character_US_SF_LMG` | MG_M249 | stem |
| **Medic** | Санитар | `Medic` | Special Forces Medic | 1: `Character_US_SF_Medic` | Rifle_M16A2_carbine_OliveGreen_Solid | stem |
| **Officer** | Офицер | `Officer` | Special Forces Officer | 1: `Character_US_SF_Officer` | Rifle_M16A2_carbine_OliveGreen_Solid + Handgun_M9 | stem |
| **Operator** | Оператор | `SF` | Special Forces | 1: `Character_US_SF` | Rifle_M16A2_carbine_AP2k_OliveGreen_Sand_Stripes | stem |
| **Radio Operator** | Радист | `RTO` | Special Forces Radio Operator | 1: `Character_US_SF_RTO` | Rifle_M16A2_carbine_OliveGreen_Solid | stem |
| **Sapper** | Сапер | `Sapper` | Special Forces Sapper | 1: `Character_US_SF_Sapper` | Rifle_M16A2_carbine_OliveGreen_Sand_Stripes + Launcher_M72A3 | stem |
| **Sharpshooter** | Марксман | `Sharpshooter` | Special Forces Sharpshooter | 1: `Character_US_SF_Sharpshooter` | Rifle_M16A2_4x20_OliveGreen_Sand_Stripes | stem |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader | 1: `Character_US_SF_SL` | Rifle_M16A2_carbine_M203_OliveGreen_Sand_Stripes | stem |

#### Green Berets (suppressed) (registry set `GreenBerets_Suppressed`, 7 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Grenadier** | Гранатометчик (ГП) | `GL` | Special Forces Grenadier - Recon | 1: `Character_US_SF_GL_S` | Rifle_M16A2_suppressor_M203_OliveGreen_Sand_Stripes | stem |
| **Medic** | Санитар | `Medic` | Special Forces Medic - Recon | 1: `Character_US_SF_Medic_S` | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes | stem |
| **Operator** | Оператор | `SF` | Special Forces - Recon | 1: `Character_US_SF_S` | Rifle_M16A2_carbine_suppressor_AP2K_OliveGreen_Sand_Stripes | stem |
| **Radio Operator** | Радист | `RTO` | Special Forces Radio Operator - Recon | 1: `Character_US_SF_RTO_S` | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes | stem |
| **Sapper** | Сапер | `Sapper` | Special Forces Sapper - Recon | 1: `Character_US_SF_Sapper_S` | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes + Launcher_M72A3 | stem |
| **Sharpshooter** | Марксман | `Sharpshooter` | Special Forces Sharpshooter - Recon | 1: `Character_US_SF_Sharpshooter_S` | Rifle_M16A2_suppressor_4x20_OliveGreen_Sand_Stripes | stem |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader - Recon | 1: `Character_US_SF_SL_S` | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes | stem |

### USSR — USSR (78 roles, 83 prefabs)

#### Soviet Army (registry set `USSR_Army`, 26 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 1: `Character_USSR_Ammo` | Rifle_AK74 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 2: `Character_USSR_AT`, `Character_USSR_AT_Guard` (Guard) | Rifle_AKS74U + Launcher_RPG7_PGO7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 2: `Character_USSR_AAT`, `Character_USSR_AAT_Guard` (Guard) | Rifle_AK74 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_USSR_AMG` | Rifle_AK74 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 2: `Character_USSR_AR`, `Character_USSR_AR_Guard` (Guard) | MG_RPK74 | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 1: `Character_USSR_CC` | Rifle_AKS74U | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_USSR_Crew` | Rifle_AKS74U | stem |
| **Engineer** | Инженер | `Engineer` | Sapper | 1: `Character_USSR_Engineer` | Rifle_AK74 | stem |
| **Gate Guard** | Часовой | `GateKeeper` | Anti-Tank Specialist Assistant | 1: `Character_USSR_GateKeeper` | Rifle_AK74 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 1: `Character_USSR_GL` | Rifle_AK74_GP25 | stem |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_USSR_HeliCrew` | Handgun_PM | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_USSR_HeliPilot` | Handgun_PM | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 1: `Character_USSR_LAT` | Rifle_AK74 + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_USSR_MG` | MG_PKM + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_USSR_Medic` | Rifle_AK74 | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_USSR_Officer` | Handgun_PM | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `Character_USSR_PL` | Rifle_AK74 + Handgun_PM | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 1: `Character_USSR_Sergeant` | Rifle_AK74 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_USSR_RTO` | Rifle_AK74 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 2: `Character_USSR_Rifleman`, `Character_USSR_Rifleman_Variant_1` | Rifle_AK74 | stem |
| **Sapper** | Сапер | `Sapper` | Combat Engineer | 1: `Character_USSR_Sapper` | Rifle_AK74 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 1: `Character_USSR_Scout` | Rifle_AK74 | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 1: `Character_USSR_Scout_RTO` | Rifle_AK74 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 1: `Character_USSR_SR` | Rifle_AK74N_1P29 | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 1: `Character_USSR_Sharpshooter` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 2: `Character_USSR_SL`, `Character_USSR_SL_Guard` (Guard) | Rifle_AK74_GP25 | stem |

#### Soviet Army (KLMK) (registry set `KLMK`, 17 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 1: `Character_USSR_Ammo_KLMK` | Rifle_AK74 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 1: `Character_USSR_AT_KLMK` | Rifle_AKS74U + Launcher_RPG7_PGO7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 1: `Character_USSR_AAT_KLMK` | Rifle_AK74 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_USSR_AMG_KLMK` | Rifle_AK74 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 1: `Character_USSR_AR_KLMK` | MG_RPK74 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 1: `Character_USSR_GL_KLMK` | Rifle_AK74_GP25 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 1: `Character_USSR_LAT_KLMK` | Rifle_AK74 + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_USSR_MG_KLMK` | MG_PKM + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_USSR_Medic_KLMK` | Rifle_AK74 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `Character_USSR_PL_KLMK` | Rifle_AK74 + Handgun_PM | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 1: `Character_USSR_Sergeant_KLMK` | Rifle_AK74 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_USSR_RTO_KLMK` | Rifle_AK74 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_USSR_Rifleman_KLMK` | Rifle_AK74 | stem |
| **Sapper** | Сапер | `Sapper` | Combat Engineer | 1: `Character_USSR_Sapper_KLMK` | Rifle_AK74 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 1: `Character_USSR_SR_KLMK` | Rifle_AK74N_1P29 | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 1: `Character_USSR_Sharpshooter_KLMK` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_USSR_SL_KLMK` | Rifle_AK74_GP25 | stem |

#### Naval Infantry (registry set `Naval_Infantry`, 19 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Naval Infantry Ammunition Bearer | 1: `Character_USSR_NI_Ammo` | Rifle_AK74 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Naval Infantry Anti-Tank Specialist | 1: `Character_USSR_NI_AT` | Rifle_AKS74U + Launcher_RPG7_PGO7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Naval Infantry Anti-Tank Assistant | 1: `Character_USSR_NI_AAT` | Rifle_AK74 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Naval Infantry Machine-Gunner Assistant | 1: `Character_USSR_NI_AMG` | Rifle_AK74 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Naval Infantry Automatic Rifleman | 1: `Character_USSR_NI_AR` | MG_RPK74 | stem |
| **Crew Commander** | Командир экипажа | `CC` | Naval Infantry Crew Commander | 1: `Character_USSR_NI_CC` | Rifle_AKS74U | stem |
| **Crewman** | Член экипажа | `Crew` | Naval Infantry Crewman | 1: `Character_USSR_NI_Crew` | Rifle_AKS74U | stem |
| **Grenadier** | Гранатометчик (ГП) | `GL` | Naval Infantry Grenadier | 1: `Character_USSR_NI_GL` | Rifle_AK74_GP25 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Naval Infantry Light AT Rifleman | 1: `Character_USSR_NI_LAT` | Rifle_AK74 + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Naval Infantry Machine-Gunner | 1: `Character_USSR_NI_MG` | MG_PKM + Handgun_PM | stem |
| **Medic** | Санитар | `Medic` | Naval Infantry Medic | 1: `Character_USSR_NI_Medic` | Rifle_AK74 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Naval Infantry Platoon Leader | 1: `Character_USSR_NI_PL` | Rifle_AK74 + Handgun_PM | stem |
| **Platoon Sergeant** | Зам. командира взвода | `Sergeant` | Naval Infantry Platoon Sergeant | 1: `Character_USSR_NI_Sergeant` | Rifle_AK74 | stem |
| **Radio Operator** | Радист | `RTO` | Naval Infantry Combat Signaler | 1: `Character_USSR_NI_RTO` | Rifle_AK74 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Naval Infantry Rifleman | 1: `Character_USSR_NI_Rifleman` | Rifle_AK74 | stem |
| **Sapper** | Сапер | `Sapper` | Naval Infantry Combat Engineer | 1: `Character_USSR_NI_Sapper` | Rifle_AK74 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Naval Infantry Senior Rifleman | 1: `Character_USSR_NI_SR` | Rifle_AK74N_1P29 | stem |
| **Sharpshooter** | Марксман | `Sharpshooter` | Naval Infantry Sharpshooter | 1: `Character_USSR_NI_Sharpshooter` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Naval Infantry Squad Leader | 1: `Character_USSR_NI_SL` | Rifle_AK74_GP25 | stem |

#### Spetsnaz (registry set `Spetsnaz`, 9 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Grenadier** | Гранатометчик (ГП) | `GL` | Special Forces Grenadier | 1: `Character_USSR_SF_GL` | Rifle_AK74N_GP25 | stem |
| **Machine Gunner** | Пулеметчик | `LMG` | Special Forces Machine-Gunner | 1: `Character_USSR_SF_LMG` | MG_RPK74N + Flare_RSP30_green | stem |
| **Medic** | Санитар | `Medic` | Special Forces Medic | 1: `Character_USSR_SF_Medic` | Rifle_AKS74UN | stem |
| **Officer** | Офицер | `Officer` | Special Forces Officer | 1: `Character_USSR_SF_Officer` | Rifle_AKS74UN + Handgun_PM | stem |
| **Operator** | Оператор | `SF` | Special Forces | 1: `Character_USSR_SF` | Rifle_AK74N | stem |
| **Radio Operator** | Радист | `RTO` | Special Forces Radio Operator | 1: `Character_USSR_SF_RTO` | Rifle_AKS74UN | stem |
| **Sapper** | Сапер | `Sapper` | Special Forces Sapper | 1: `Character_USSR_SF_Sapper` | Rifle_AKS74UN + Launcher_RPG22 | stem |
| **Sharpshooter** | Марксман | `Sharpshooter` | Special Forces Sharpshooter | 1: `Character_USSR_SF_Sharpshooter` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader | 1: `Character_USSR_SF_SL` | Rifle_AK74N_GP25 | stem |

#### Spetsnaz (suppressed) (registry set `Spetsnaz_Suppressed`, 7 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Grenadier** | Гранатометчик (ГП) | `GL` | Special Forces Grenadier - Recon | 1: `Character_USSR_SF_GL_S` | Rifle_AK74N_PBS4_GP25 | stem |
| **Medic** | Санитар | `Medic` | Special Forces Medic - Recon | 1: `Character_USSR_SF_Medic_S` | Rifle_AKS74UN_PBS4 | stem |
| **Operator** | Оператор | `SF` | Special Forces - Recon | 1: `Character_USSR_SF_S` | Rifle_AK74N_PBS4 | stem |
| **Radio Operator** | Радист | `RTO` | Special Forces Radio Operator - Recon | 1: `Character_USSR_SF_RTO_S` | Rifle_AKS74UN_PBS4 | stem |
| **Sapper** | Сапер | `Sapper` | Special Forces Sapper - Recon | 1: `Character_USSR_SF_Sapper_S` | Rifle_AKS74UN_PBS4 + Launcher_RPG22 | stem |
| **Sharpshooter** | Марксман | `Sharpshooter` | Special Forces Sharpshooter - Recon | 1: `Character_USSR_SF_Sharpshooter_S` | Rifle_AK74N_PBS4_1P29 | stem |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader - Recon | 1: `Character_USSR_SF_SL_S` | Rifle_AK74N_PBS4 | stem |

### FIA — FIA (22 roles, 24 prefabs)

#### FIA (registry set `FIA`, 22 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 1: `Character_FIA_Ammo` | Rifle_VZ58P | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 1: `Character_FIA_AT` | Rifle_VZ58P + Launcher_RPG7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 1: `Character_FIA_AAT` | Rifle_VZ58P | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_FIA_AMG` | Rifle_VZ58P | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 1: `Character_FIA_CC` | Rifle_VZ58V | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_FIA_Crew` | Rifle_VZ58V | stem |
| **Guerrilla** | Партизан | `AC` | Guerrilla | 1: `Character_FIA_AC` | Handgun_PM | override |
| **Guerrilla Grenadier** | Партизан-гранатометчик | `AC_Grenadier` | Guerrilla - Grenadier | 1: `Character_FIA_AC_Grenadier` | Handgun_PM | override |
| **Guerrilla Medic** | Партизан-санитар | `AC_Medic` | Guerrilla - Medic | 1: `Character_FIA_AC_Medic` | Handgun_PM | override |
| **Guerrilla Spotter** | Партизан-наблюдатель | `AC_Scout` | Guerrilla - Spotter | 1: `Character_FIA_AC_Scout` | Handgun_PM | override |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 1: `Character_FIA_LAT` | Rifle_VZ58P + Launcher_RPG75 | stem |
| **Machine Gunner** | Пулеметчик | `MG`, `MG_Elite` | Machine-Gunner | 2: `Character_FIA_MG`, `Character_FIA_MG_Elite` (Special Units) | MG_UK59_4x8 + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_FIA_Medic` | Rifle_VZ58V | stem |
| **Partisan** | Партизан (ополченец) | `AC_Partisan` | Guerrilla | 1: `Character_FIA_AC_Partisan` (Special Units) | Rifle_VZ58V + Handgun_PM | override |
| **Partisan Grenadier** | Партизан-гранатометчик (ополченец) | `AC_Partisan_Grenadier` | Guerrilla - Grenadier | 1: `Character_FIA_AC_Partisan_Grenadier` (Special Units) | Handgun_PM | override |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `Character_FIA_PL` | Rifle_VZ58V + Handgun_PM | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_FIA_RTO` | Rifle_VZ58P | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_FIA_Rifleman` | Rifle_VZ58P | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `Character_FIA_Sapper` | Rifle_VZ58P | stem |
| **Scout** | Разведчик | `Scout` | Scout | 1: `Character_FIA_Scout` | Rifle_VZ58V | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter`, `Rebel_Sharpshooter` | Sharpshooter | 2: `Character_FIA_Sharpshooter`, `Character_FIA_Rebel_Sharpshooter` (Special Units) | Rifle_SVD_PSO + Handgun_PM | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_FIA_SL` | Rifle_VZ58V | stem |

### RHS_USAF — RHS US Armed Forces (93 roles, 257 prefabs)

#### US Army (RHS) (**no registry group set**, 1 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_RHS_USA_Rifleman` | Rifle_M4A1_ARMY_ACOG2 | stem |

#### FORECON (**no registry group set**, 17 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 3: `Character_RHS_USAF_FORECON_Ammo`, `Character_RHS_USAF_FORECON_Ammo2`, `Character_RHS_USAF_FORECON_Ammo3` | Rifle_M4A1_RAS_ERGO_Forecon14 + Handgun_M18 | stem |
| **Assistant Automatic Rifleman** | Помощник стрелка-пулеметчика | `AAR` | Ammunition Bearer M249 | 3: `Character_RHS_USAF_FORECON_AAR`, `Character_RHS_USAF_FORECON_AAR_2`, `Character_RHS_USAF_FORECON_AAR_3` | Rifle_M4A1_RAS_ERGO_Forecon14 + Handgun_M18 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant M240 | 3: `Character_RHS_USAF_FORECON_AMG`, `Character_RHS_USAF_FORECON_AMG2`, `Character_RHS_USAF_FORECON_AMG3` | Rifle_M4A1_RAS_ERGO_Forecon14 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon13 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon11 + Handgun_M18 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Rifleman | 3: `Character_RHS_USAF_FORECON_AR`, `Character_RHS_USAF_FORECON_AR_2`, `Character_RHS_USAF_FORECON_AR_3` | MG_M249 + Handgun_M18 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_USAF_FORECON_GL`, `Character_RHS_USAF_FORECON_GL2`, `Character_RHS_USAF_FORECON_GL3` | Rifle_M4A1_M203_RAS_Aimpoint + Handgun_M18 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_USAF_FORECON_LAT`, `Character_RHS_USAF_FORECON_LAT2`, `Character_RHS_USAF_FORECON_LAT3` | Rifle_M4A1_RAS_ERGO_Forecon4 + Launcher_M72A3 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon3 + Launcher_M72A3 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon2 + Launcher_M72A3 + Handgun_M18 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_USAF_FORECON_MG`, `Character_RHS_USAF_FORECON_MG2`, `Character_RHS_USAF_FORECON_MG3` | MG_M240_MDO + Handgun_M18 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_USAF_FORECON_Medic`, `Character_RHS_USAF_FORECON_Medic2`, `Character_RHS_USAF_FORECON_Medic3` | Rifle_M4A1_RAS_ERGO_Forecon8 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon9 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon5 + Handgun_M18 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_RHS_USAF_FORECON_RTO`, `Character_RHS_USAF_FORECON_RTO_2`, `Character_RHS_USAF_FORECON_RTO_3` | Rifle_M4A1_RAS_ERGO_Forecon11 + Handgun_M18 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_USAF_FORECON_Rifleman`, `Character_RHS_USAF_FORECON_Rifleman2`, `Character_RHS_USAF_FORECON_Rifleman3` | Rifle_M4A1_RAS_ERGO_Forecon11 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon6 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon7 + Handgun_M18 | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_USAF_FORECON_Sapper`, `Character_RHS_USAF_FORECON_Sapper_2`, `Character_RHS_USAF_FORECON_Sapper_3` | Rifle_M4A1_RAS_ERGO_Forecon11 + Handgun_M18 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_USAF_FORECON_Scout`, `Character_RHS_USAF_FORECON_Scout2`, `Character_RHS_USAF_FORECON_Scout3` | Rifle_M4A1_BLOCK_0_NT4_FORECON + Handgun_M18 | stem |
| **Scout Radio Operator** | Разведчик-радист | `Scout_RTO` | Scout | 3: `Character_RHS_USAF_FORECON_Scout_RTO`, `Character_RHS_USAF_FORECON_Scout_RTO_2`, `Character_RHS_USAF_FORECON_Scout_RTO_3` | Rifle_M4A1_BLOCK_0_NT4_FORECON + Handgun_M18 | stem |
| **Sniper** | Снайпер | `Sniper` | Sniper | 1: `Character_RHS_USAF_FORECON_Sniper` | Rifle_M40A5_Optic_PEQ + Handgun_M17 | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_USAF_FORECON_Spotter`, `Character_RHS_USAF_FORECON_Spotter2`, `Character_RHS_USAF_FORECON_Spotter3` | Rifle_M4A1_RAS_ERGO_ForeconThermal + Handgun_M18 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_USAF_FORECON_SL`, `Character_RHS_USAF_FORECON_SL2`, `Character_RHS_USAF_FORECON_SL3` | Rifle_M4A1_RAS_ERGO_Forecon1 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon13 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon11 + Handgun_M18 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 3: `Character_RHS_USAF_FORECON_TL`, `Character_RHS_USAF_FORECON_TL2`, `Character_RHS_USAF_FORECON_TL3` | Rifle_M4A1_RAS_ERGO_Forecon12 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon10 + Handgun_M18<br>Rifle_M4A1_RAS_ERGO_Forecon9 + Handgun_M18 | stem |

#### MARSOC (registry set `MARSOC`, 14 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant M240 | 3: `Character_RHS_USMC_MARSOC_AMG`, `Character_RHS_USMC_MARSOC_AMG_2`, `Character_RHS_USMC_MARSOC_AMG_3` | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS + Handgun_M18<br>Rifle_M4A1_BLOCK_II_FSP_ACOG + Handgun_M18 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Machine-Gunner | 3: `Character_RHS_USMC_MARSOC_AR`, `Character_RHS_USMC_MARSOC_AR2`, `Character_RHS_USMC_MARSOC_AR3` | MG_M249 + Handgun_M18 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_USMC_MARSOC_GL`, `Character_RHS_USMC_MARSOC_GL2`, `Character_RHS_USMC_MARSOC_GL3` | Rifle_M4A1_M203_BLOCK_II_SU230 + Handgun_M18 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_USMC_MARSOC_LAT`, `Character_RHS_USMC_MARSOC_LAT2`, `Character_RHS_USMC_MARSOC_LAT3` | Rifle_M4A1_BLOCK_II_SU230_nocovers + Launcher_M72A3 + Handgun_M18<br>Rifle_M4A1_BLOCK_II_FSP_SU230 + Launcher_M72A3 + Handgun_M18 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_USMC_MARSOC_MG`, `Character_RHS_USMC_MARSOC_MG2`, `Character_RHS_USMC_MARSOC_MG3` | MG_M240_Light_MDO + Handgun_M18 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_USMC_MARSOC_Medic`, `Character_RHS_USMC_MARSOC_Medic2`, `Character_RHS_USMC_MARSOC_Medic3` | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS + Handgun_M18<br>Rifle_M4A1_BLOCK_II_SU230_nocovers + Handgun_M18 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_RHS_USMC_MARSOC_RTO` | Rifle_M4A1_BLOCK_II_SU230_nocovers + Handgun_M18 | stem |
| **Radio Recon** | Радиоразведчик | `RadioRecon` | Sensor Operator | 1: `Character_RHS_USMC_MARSOC_RadioRecon` | Rifle_M4A1_BLOCK_II_SU230_nocovers + Device_SpectrumDevice_base + Handgun_M18 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_USMC_MARSOC_Rifleman`, `Character_RHS_USMC_MARSOC_Rifleman2`, `Character_RHS_USMC_MARSOC_Rifleman3` | Rifle_M4A1_BLOCK_II_SU230_nocovers + Handgun_M18<br>Rifle_M4A1_BLOCK_II_FSP_SU230 + Handgun_M18<br>Rifle_M4A1_BLOCK_II_FSP_ACOG + Handgun_M18 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_USMC_MARSOC_Scout`, `Character_RHS_USMC_MARSOC_Scout2`, `Character_RHS_USMC_MARSOC_Scout3` | Rifle_M4A1_MK18_Eot + Handgun_M18<br>Rifle_M4A1_MK18_Eot_2 + Handgun_M18<br>Rifle_M4A1_BLOCK_II_FSP_EXPS + Handgun_M18 | stem |
| **Sniper** | Снайпер | `Sniper` | Sniper | 1: `Character_RHS_USMC_MARSOC_Sniper` | Rifle_M40A5_Optic + Handgun_M18 | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_USMC_MARSOC_Spotter`, `Character_RHS_USMC_MARSOC_Spotter2`, `Character_RHS_USMC_MARSOC_Spotter3` | Rifle_M4A1_BLOCK_II_PAS13 + Handgun_M18 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_USMC_MARSOC_SL`, `Character_RHS_USMC_MARSOC_SL_2`, `Character_RHS_USMC_MARSOC_SL_3` | Rifle_M4A1_BLOCK_II_SU230 + Handgun_M18 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 3: `Character_RHS_USMC_MARSOC_TL`, `Character_RHS_USMC_MARSOC_TL2`, `Character_RHS_USMC_MARSOC_TL3` | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS + Handgun_M18<br>Rifle_M4A1_BLOCK_II_SU230_nocovers + Handgun_M18 | stem |

#### MARSOC (MultiCam) (**no registry group set**, 9 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant M240 | 3: `Character_RHS_USMC_MARSOC_MC_AMG`, `Character_RHS_USMC_MARSOC_MC_AMG2`, `Character_RHS_USMC_MARSOC_MC_AMG3` | Rifle_M4A1_URGI_145_RIS_Raider_VCOG + Handgun_M18 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_USMC_MARSOC_MC_GL`, `Character_RHS_USMC_MARSOC_MC_GL2`, `Character_RHS_USMC_MARSOC_MC_GL3` | Rifle_M4A1_M203_BLOCK_II_SU230 + Handgun_M18 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_USMC_MARSOC_MC_LAT`, `Character_RHS_USMC_MARSOC_MC_LAT2`, `Character_RHS_USMC_MARSOC_MC_LAT3` | Rifle_M4A1_URGI_145_RIS_Raider_VCOG + Launcher_M72A3 + Handgun_M18 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner M240 | 3: `Character_RHS_USMC_MARSOC_MC_MG`, `Character_RHS_USMC_MARSOC_MC_MG2`, `Character_RHS_USMC_MARSOC_MC_MG3` | MG_M240_Light_MDO + Handgun_M18 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_USMC_MARSOC_MC_Medic`, `Character_RHS_USMC_MARSOC_MC_Medic2`, `Character_RHS_USMC_MARSOC_MC_Medic3` | Rifle_M4A1_URGI_145_RIS_Raider_VCOG + Handgun_M18 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_USMC_MARSOC_MC_Rifleman`, `Character_RHS_USMC_MARSOC_MC_Rifleman2`, `Character_RHS_USMC_MARSOC_MC_Rifleman3` | Rifle_M4A1_URGI_145_RIS_Raider_VCOG + Handgun_M18 | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_USMC_MARSOC_MC_Spotter`, `Character_RHS_USMC_MARSOC_MC_Spotter2`, `Character_RHS_USMC_MARSOC_MC_Spotter3` | Rifle_M4A1_URGI_145_temp_bebra_thermal + Handgun_M18 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_USMC_MARSOC_MC_SL`, `Character_RHS_USMC_MARSOC_MC_SL2`, `Character_RHS_USMC_MARSOC_MC_SL3` | Rifle_M4A1_URGI_145_RIS_Raider_VCOG + Handgun_M18 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 3: `Character_RHS_USMC_MARSOC_MC_TL`, `Character_RHS_USMC_MARSOC_MC_TL2`, `Character_RHS_USMC_MARSOC_MC_TL3` | Rifle_M4A1_URGI_145_RIS_Raider_VCOG + Handgun_M18 | stem |

#### USMC (MEF) (registry set `USMC_MEF`, 27 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 3: `Character_RHS_USAF_USMC_Ammo`, `Character_RHS_USAF_USMC_Ammo_2`, `Character_RHS_USAF_USMC_Ammo_3` | Rifle_M27IAR_VC18DSCO | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_USAF_USMC_AT`, `Character_RHS_USAF_USMC_AT_2`, `Character_RHS_USAF_USMC_AT_3` | Rifle_M4_RAS_RCO_PEQ + Launcher_MK153mod2 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_USAF_USMC_AAT`, `Character_RHS_USAF_USMC_AAT_2`, `Character_RHS_USAF_USMC_AAT_3` | Rifle_M4_RAS_RCO_PEQ | stem |
| **Assistant Automatic Rifleman** | Помощник стрелка-пулеметчика | `AAR` | Machine-Gunner Assistant M249 | 3: `Character_RHS_USAF_USMC_AAR`, `Character_RHS_USAF_USMC_AAR_2`, `Character_RHS_USAF_USMC_AAR_3` | Rifle_M27IAR_VC18DSCO | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant M240 | 3: `Character_RHS_USAF_USMC_AMG`, `Character_RHS_USAF_USMC_AMG_2`, `Character_RHS_USAF_USMC_AMG_3` | Rifle_M27IAR_VC18DSCO | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 3: `Character_RHS_USAF_USMC_AR`, `Character_RHS_USAF_USMC_AR_2`, `Character_RHS_USAF_USMC_AR_3` | MG_M249 | stem |
| **Crew Commander** | Командир экипажа | `CrewLdr` | Crewman | 3: `Character_RHS_USAF_USMC_CrewLdr`, `Character_RHS_USAF_USMC_CrewLdr_2`, `Character_RHS_USAF_USMC_CrewLdr_3` | Rifle_M4_RAS_RCO_PEQ + Handgun_M18 | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 3: `Character_RHS_USAF_USMC_Crew`, `Character_RHS_USAF_USMC_Crew_2`, `Character_RHS_USAF_USMC_Crew_3` | Rifle_M4_RAS_PMAG + Handgun_M18 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_USAF_USMC_GL`, `Character_RHS_USAF_USMC_GL_2`, `Character_RHS_USAF_USMC_GL_3` | Rifle_M4_M203_RAS_RCO_PEQ | stem |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_RHS_USAF_USMC_HeliCrew` | Handgun_M18 | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_RHS_USAF_USMC_HeliPilot` | Handgun_M18 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_USAF_USMC_LAT`, `Character_RHS_USAF_USMC_LAT_2`, `Character_RHS_USAF_USMC_LAT_3` | Rifle_M27IAR_VC18DSCO + Launcher_M72A3 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_USAF_USMC_MG`, `Character_RHS_USAF_USMC_MG_2`, `Character_RHS_USAF_USMC_MG_3` | MG_M240_Light_MDO + Handgun_M18 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_USAF_USMC_Medic`, `Character_RHS_USAF_USMC_Medic_2`, `Character_RHS_USAF_USMC_Medic_3` | Rifle_M4_RAS_ACOG_ARD_PEQ | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_RHS_USAF_USMC_Officer` | Handgun_M17 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 3: `Character_RHS_USAF_USMC_PL`, `Character_RHS_USAF_USMC_PL_2`, `Character_RHS_USAF_USMC_PL_3` | Rifle_M27IAR_VC18DSCO_LC + Handgun_M18 | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 3: `Character_RHS_USAF_USMC_Sergeant`, `Character_RHS_USAF_USMC_Sergeant_2`, `Character_RHS_USAF_USMC_Sergeant_3` | Rifle_M27IAR_VC18DSCO_LC + Handgun_M18 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_RHS_USAF_USMC_RTO`, `Character_RHS_USAF_USMC_RTO_2`, `Character_RHS_USAF_USMC_RTO_3` | Rifle_M4_RAS_RCO_PEQ | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_USAF_USMC_Rifleman`, `Character_RHS_USAF_USMC_Rifleman_2`, `Character_RHS_USAF_USMC_Rifleman_3` | Rifle_M27IAR_VC18DSCO_LC | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_USAF_USMC_Sapper`, `Character_RHS_USAF_USMC_Sapper_2`, `Character_RHS_USAF_USMC_Sapper_3` | Rifle_M27IAR_VC18DSCO_LC | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_USAF_USMC_Scout`, `Character_RHS_USAF_USMC_Scout_2`, `Character_RHS_USAF_USMC_Scout_3` | Rifle_M27IAR_camo1_TA31RCO + Handgun_M18 | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 3: `Character_RHS_USAF_USMC_Scout_RTO`, `Character_RHS_USAF_USMC_Scout_RTO_2`, `Character_RHS_USAF_USMC_Scout_RTO_3` | Rifle_M27IAR_camo1_su231A + Handgun_M18 | stem |
| **Sniper** | Снайпер | `Sniper` | Sniper | 1: `Character_RHS_USAF_USMC_Sniper` | Rifle_M40A5_Optic_PEQ + Handgun_M18 | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_USAF_USMC_Spotter`, `Character_RHS_USAF_USMC_Spotter_2`, `Character_RHS_USAF_USMC_Spotter_3` | Rifle_M4_M203_RAS_RCO_PEQ | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_USAF_USMC_SL`, `Character_RHS_USAF_USMC_SL_2`, `Character_RHS_USAF_USMC_SL_3` | Rifle_M27IAR_VC18DSCO_LC + Handgun_M18 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 3: `Character_RHS_USAF_USMC_TL`, `Character_RHS_USAF_USMC_TL_2`, `Character_RHS_USAF_USMC_TL_3` | Rifle_M27IAR_VC18DSCO_LC | stem |
| **Team Leader (marksman)** | Командир группы (марксман) | `TL_Marksman` | Team Leader M38 | 3: `Character_RHS_USAF_USMC_TL_Marksman`, `Character_RHS_USAF_USMC_TL_Marksman_2`, `Character_RHS_USAF_USMC_TL_Marksman_3` | Rifle_M38SDMR + Handgun_M18<br>Rifle_M38SDMR_manta_covers + Handgun_M18 | stem |

#### USMC (MEF, desert) (registry set `USMC_MEF_Desert`, 25 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 3: `Character_RHS_USAF_USMC_D_Ammo`, `Character_RHS_USAF_USMC_D_Ammo_2`, `Character_RHS_USAF_USMC_D_Ammo_3` | Rifle_M27IAR_VC18DSCO | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_USAF_USMC_D_AT`, `Character_RHS_USAF_USMC_D_AT_2`, `Character_RHS_USAF_USMC_D_AT_3` | Rifle_M4_RAS_RCO_PEQ + Launcher_MK153mod2 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_USAF_USMC_D_AAT`, `Character_RHS_USAF_USMC_D_AAT_2`, `Character_RHS_USAF_USMC_D_AAT_3` | Rifle_M4_RAS_RCO_PEQ | stem |
| **Assistant Automatic Rifleman** | Помощник стрелка-пулеметчика | `AAR` | Machine-Gunner Assistant M249 | 3: `Character_RHS_USAF_USMC_D_AAR`, `Character_RHS_USAF_USMC_D_AAR_2`, `Character_RHS_USAF_USMC_D_AAR_3` | Rifle_M27IAR_VC18DSCO | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant M240 | 3: `Character_RHS_USAF_USMC_D_AMG`, `Character_RHS_USAF_USMC_D_AMG_2`, `Character_RHS_USAF_USMC_D_AMG_3` | Rifle_M27IAR_VC18DSCO | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 3: `Character_RHS_USAF_USMC_D_AR`, `Character_RHS_USAF_USMC_D_AR_2`, `Character_RHS_USAF_USMC_D_AR_3` | MG_M249 | stem |
| **Crew Commander** | Командир экипажа | `CrewLdr` | Crew Commander | 3: `Character_RHS_USAF_USMC_D_CrewLdr`, `Character_RHS_USAF_USMC_D_CrewLdr_2`, `Character_RHS_USAF_USMC_D_CrewLdr_3` | Rifle_M4_RAS_RCO_PEQ + Handgun_M18 | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 3: `Character_RHS_USAF_USMC_D_Crew`, `Character_RHS_USAF_USMC_D_Crew_2`, `Character_RHS_USAF_USMC_D_Crew_3` | Rifle_M4_RAS_PMAG + Handgun_M18 | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_USAF_USMC_D_GL`, `Character_RHS_USAF_USMC_D_GL_2`, `Character_RHS_USAF_USMC_D_GL_3` | Rifle_M4_M203_RAS_RCO_PEQ | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_USAF_USMC_D_LAT`, `Character_RHS_USAF_USMC_D_LAT_2`, `Character_RHS_USAF_USMC_D_LAT_3` | Rifle_M27IAR_VC18DSCO + Launcher_M72A3 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_USAF_USMC_D_MG`, `Character_RHS_USAF_USMC_D_MG_2`, `Character_RHS_USAF_USMC_D_MG_3` | MG_M240_Light_MDO + Handgun_M18 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_USAF_USMC_D_Medic`, `Character_RHS_USAF_USMC_D_Medic_2`, `Character_RHS_USAF_USMC_D_Medic_3` | Rifle_M4_RAS_ACOG_ARD_PEQ | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_RHS_USAF_USMC_D_Officer` | Handgun_M17 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 3: `Character_RHS_USAF_USMC_D_PL`, `Character_RHS_USAF_USMC_D_PL_2`, `Character_RHS_USAF_USMC_D_PL_3` | Rifle_M27IAR_VC18DSCO_LC + Handgun_M18 | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 3: `Character_RHS_USAF_USMC_D_Sergeant`, `Character_RHS_USAF_USMC_D_Sergeant_2`, `Character_RHS_USAF_USMC_D_Sergeant_3` | Rifle_M27IAR_VC18DSCO_LC + Handgun_M18 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_RHS_USAF_USMC_D_RTO`, `Character_RHS_USAF_USMC_D_RTO_2`, `Character_RHS_USAF_USMC_D_RTO_3` | Rifle_M4_RAS_RCO_PEQ | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_USAF_USMC_D_Rifleman`, `Character_RHS_USAF_USMC_D_Rifleman_2`, `Character_RHS_USAF_USMC_D_Rifleman_3` | Rifle_M27IAR_VC18DSCO_LC | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_USAF_USMC_D_Sapper`, `Character_RHS_USAF_USMC_D_Sapper_2`, `Character_RHS_USAF_USMC_D_Sapper_3` | Rifle_M27IAR_VC18DSCO_LC | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_USAF_USMC_D_Scout`, `Character_RHS_USAF_USMC_D_Scout_2`, `Character_RHS_USAF_USMC_D_Scout_3` | Rifle_M27IAR_camo1_TA31RCO + Handgun_M18 | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 3: `Character_RHS_USAF_USMC_D_Scout_RTO`, `Character_RHS_USAF_USMC_D_Scout_RTO_2`, `Character_RHS_USAF_USMC_D_Scout_RTO_3` | Rifle_M27IAR_camo1_su231A + Handgun_M18 | stem |
| **Sniper** | Снайпер | `Sniper` | Sniper | 1: `Character_RHS_USAF_USMC_D_Sniper` | Rifle_M40A5_Optic_PEQ + Handgun_M18 | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_USAF_USMC_D_Spotter`, `Character_RHS_USAF_USMC_D_Spotter_2`, `Character_RHS_USAF_USMC_D_Spotter_3` | Rifle_M4_M203_RAS_RCO_PEQ | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_USAF_USMC_D_SL`, `Character_RHS_USAF_USMC_D_SL_2`, `Character_RHS_USAF_USMC_D_SL_3` | Rifle_M27IAR_VC18DSCO_LC + Handgun_M18 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 3: `Character_RHS_USAF_USMC_D_TL`, `Character_RHS_USAF_USMC_D_TL_2`, `Character_RHS_USAF_USMC_D_TL_3` | Rifle_M27IAR_VC18DSCO_LC | stem |
| **Team Leader (marksman)** | Командир группы (марксман) | `TL_Marksman` | Sharpshooter | 3: `Character_RHS_USAF_USMC_D_TL_Marksman`, `Character_RHS_USAF_USMC_D_TL_Marksman_2`, `Character_RHS_USAF_USMC_D_TL_Marksman_3` | Rifle_M38SDMR + Handgun_M18<br>Rifle_M38SDMR_manta_covers + Handgun_M18 | stem |

### RHS_AFRF — RHS Russian Armed Forces (130 roles, 310 prefabs)

#### MSV (Flora) (registry set `MSV_Flora`, 14 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 1: `Character_RHS_RF_MSV_Flora_AT` | Rifle_AK74 + Launcher_RPG7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 1: `Character_RHS_RF_MSV_Flora_AAT` | Rifle_AK74 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_RHS_RF_MSV_Flora_AMG` | Rifle_AK74 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 1: `Character_RHS_RF_MSV_Flora_AR` | MG_RPK74 | stem |
| **Crewman** | Экипаж | `Crew` | Crewman | 1: `Character_RHS_AFRF_MSV_Flora_Crew` | Rifle_AKS74UN | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 1: `Character_RHS_RF_MSV_Flora_GL` | Rifle_AK74_GP25 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_RHS_RF_MSV_Flora_MG` | MG_PKM + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_RHS_RF_MSV_Flora_Medic` | Rifle_AK74 | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_RHS_RF_MSV_Flora_Officer` | Rifle_AK74 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_RHS_RF_MSV_Flora_RTO` | Rifle_AK74 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_RHS_RF_MSV_Flora_Rifleman` | Rifle_AK74 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 1: `Character_RHS_RF_MSV_Flora_SR` | Rifle_AK74 | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 1: `Character_RHS_RF_MSV_Flora_Sharpshooter` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_RHS_RF_MSV_Flora_SL` | Rifle_AK74_GP25 | stem |

#### MSV (VKPO 3.0 EMR) (**no registry group set**, 19 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 3: `Character_RHS_RF_MSV_VKPO_3.0_Ammo`, `Character_RHS_RF_MSV_VKPO_3.0_Ammo_2`, `Character_RHS_RF_MSV_VKPO_3.0_Ammo_3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_RF_MSV_VKPO_3.0_AT`, `Character_RHS_RF_MSV_VKPO_3.0_AT2`, `Character_RHS_RF_MSV_VKPO_3.0_AT3` | Rifle_AK74M_npz_rail_camo_VKPO3.0 + Launcher_RPG7_pgo7_rhs<br>Rifle_AN94_valday_rail_camo_1p87_1p90 + Launcher_RPG7_pgo7_rhs | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_RF_MSV_VKPO_3.0_AAT`, `Character_RHS_RF_MSV_VKPO_3.0_AAT2`, `Character_RHS_RF_MSV_VKPO_3.0_AAT3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 3: `Character_RHS_RF_MSV_VKPO_3.0_AMG`, `Character_RHS_RF_MSV_VKPO_3.0_AMG2`, `Character_RHS_RF_MSV_VKPO_3.0_AMG3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 3: `Character_RHS_RF_MSV_VKPO_3.0_AR`, `Character_RHS_RF_MSV_VKPO_3.0_AR2`, `Character_RHS_RF_MSV_VKPO_3.0_AR3` | MG_RPK74M_NPZ_1p86 | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_RHS_RF_MSV_VKPO_3.0_Crew` | Rifle_AKS74UN_PlasticMag | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_RF_MSV_VKPO_3.0_GL`, `Character_RHS_RF_MSV_VKPO_3.0_GL2`, `Character_RHS_RF_MSV_VKPO_3.0_GL3` | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_RF_MSV_VKPO_3.0_MG`, `Character_RHS_RF_MSV_VKPO_3.0_MG2`, `Character_RHS_RF_MSV_VKPO_3.0_MG3` | MG_PKP_base + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_RF_MSV_VKPO_3.0_Medic`, `Character_RHS_RF_MSV_VKPO_3.0_Medic2`, `Character_RHS_RF_MSV_VKPO_3.0_Medic3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 3: `Character_RHS_RF_MSV_VKPO_3.0_PL`, `Character_RHS_RF_MSV_VKPO_3.0_PL_2`, `Character_RHS_RF_MSV_VKPO_3.0_PL_3` | Rifle_AK74M_npz_rail_camo_VKPO3_1p86 + Handgun_PM (inv)<br>Rifle_AN94_valday_rail_camo_1p87_1p90 + Handgun_PM (inv) | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 3: `Character_RHS_RF_MSV_VKPO_3.0_Sergeant`, `Character_RHS_RF_MSV_VKPO_3.0_Sergeant_2`, `Character_RHS_RF_MSV_VKPO_3.0_Sergeant_3` | Rifle_AN94Railed_1p87_perst + Handgun_PM (inv)<br>Rifle_AN94_valday_rail_camo_1p87_1p90 + Handgun_PM (inv)<br>Rifle_AN94Railed_1p90_camo + Handgun_PM (inv) | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_RHS_RF_MSV_VKPO_3.0_RTO`, `Character_RHS_RF_MSV_VKPO_3.0_RTO_2`, `Character_RHS_RF_MSV_VKPO_3.0_RTO_3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94Railed_1p90_camo<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_RF_MSV_VKPO_3.0_Rifleman`, `Character_RHS_RF_MSV_VKPO_3.0_Rifleman2`, `Character_RHS_RF_MSV_VKPO_3.0_Rifleman3` | Rifle_AK74M_npz_rail_camo_VKPO3_1p86<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_RF_MSV_VKPO_3.0_Sapper`, `Character_RHS_RF_MSV_VKPO_3.0_Sapper_2`, `Character_RHS_RF_MSV_VKPO_3.0_Sapper_3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_RF_MSV_VKPO_3.0_Scout`, `Character_RHS_RF_MSV_VKPO_3.0_Scout2`, `Character_RHS_RF_MSV_VKPO_3.0_Scout3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 3: `Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO`, `Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO_2`, `Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO_3` | Rifle_AK74M_npz_rail_camo_VKPO3.0<br>Rifle_AN94_valday_rail_camo_1p87_1p90 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 3: `Character_RHS_RF_MSV_VKPO_3.0_SR`, `Character_RHS_RF_MSV_VKPO_3.0_SR_2`, `Character_RHS_RF_MSV_VKPO_3.0_SR_3` | Rifle_AK74M_npz_rail_camo_TGPA_Thermal | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 3: `Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter`, `Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter_2`, `Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter_3` | Rifle_SVD_1P21 + Handgun_PM (inv) | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_RF_MSV_VKPO_3.0_SL`, `Character_RHS_RF_MSV_VKPO_3.0_SL2`, `Character_RHS_RF_MSV_VKPO_3.0_SL3` | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo | stem |

#### MSV (VKPO demi-season) (registry set `MSV_VKPO_Demiseason`, 27 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 3: `Character_RHS_RF_MSV_VKPO_DS_Ammo`, `Character_RHS_RF_MSV_VKPO_DS_Ammo_2`, `Character_RHS_RF_MSV_VKPO_DS_Ammo_3` | Rifle_AK74M<br>Rifle_AK74M_1P63 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_RF_MSV_VKPO_DS_AT`, `Character_RHS_RF_MSV_VKPO_DS_AT_2`, `Character_RHS_RF_MSV_VKPO_DS_AT_3` | Rifle_AK74M + Launcher_RPG7_pgo7<br>Rifle_AK74M_1P63 + Launcher_RPG7_pgo7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_RF_MSV_VKPO_DS_AAT`, `Character_RHS_RF_MSV_VKPO_DS_AAT_2`, `Character_RHS_RF_MSV_VKPO_DS_AAT_3` | Rifle_AK74M<br>Rifle_AK74M_1P63 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 3: `Character_RHS_RF_MSV_VKPO_DS_AMG`, `Character_RHS_RF_MSV_VKPO_DS_AMG_2`, `Character_RHS_RF_MSV_VKPO_DS_AMG_3` | Rifle_AK74M<br>Rifle_AK74M_1P63 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 3: `Character_RHS_RF_MSV_VKPO_DS_AR`, `Character_RHS_RF_MSV_VKPO_DS_AR_2`, `Character_RHS_RF_MSV_VKPO_DS_AR_3` | MG_RPK74M<br>MG_RPK74M_1P78 | stem |
| **Crewman** | Экипаж | `Crew` | Crewman | 1: `Character_RHS_RF_MSV_VKPO_DS_Crew` | Rifle_AKS74UN_PlasticMag | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_RF_MSV_VKPO_DS_GL`, `Character_RHS_RF_MSV_VKPO_DS_GL_2`, `Character_RHS_RF_MSV_VKPO_DS_GL_3` | Rifle_AK74M_GP25<br>Rifle_AK74M_GP25_1P63 | stem |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_RHS_RF_MSV_VKPO_DS_HeliCrew` | Handgun_PM | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_RHS_RF_MSV_VKPO_DS_HeliPilot` | Handgun_PM | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_RF_MSV_VKPO_DS_LAT`, `Character_RHS_RF_MSV_VKPO_DS_LAT_2`, `Character_RHS_RF_MSV_VKPO_DS_LAT_3` | Rifle_AK74M_npz_rail_1p87 + Launcher_RPG22<br>Rifle_AK74M_1P63 + Launcher_RPG22<br>Rifle_AK74M + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_RF_MSV_VKPO_DS_MG`, `Character_RHS_RF_MSV_VKPO_DS_MG_2`, `Character_RHS_RF_MSV_VKPO_DS_MG_3` | MG_PKP_base + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_RF_MSV_VKPO_DS_Medic`, `Character_RHS_RF_MSV_VKPO_DS_Medic_2`, `Character_RHS_RF_MSV_VKPO_DS_Medic_3` | Rifle_AK74M | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_RHS_RF_MSV_VKPO_DS_Officer` | Handgun_PM | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 3: `Character_RHS_RF_MSV_VKPO_DS_PL`, `Character_RHS_RF_MSV_VKPO_DS_PL_2`, `Character_RHS_RF_MSV_VKPO_DS_PL_3` | Rifle_AK74M_1P63 + Handgun_PM<br>Rifle_AK74M_npz_rail_1p87 + Handgun_PM<br>Rifle_AK74M_npz_rail_1p87_1p90 + Handgun_PM | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 3: `Character_RHS_RF_MSV_VKPO_DS_Sergeant`, `Character_RHS_RF_MSV_VKPO_DS_Sergeant_2`, `Character_RHS_RF_MSV_VKPO_DS_Sergeant_3` | Rifle_AK74M_npz_rail_1p87_1p90<br>Rifle_AK74M_npz_rail_1p87<br>Rifle_AK74M_1P63 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_RHS_RF_MSV_VKPO_DS_RTO`, `Character_RHS_RF_MSV_VKPO_DS_RTO_2`, `Character_RHS_RF_MSV_VKPO_DS_RTO_3` | Rifle_AK74M | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_RF_MSV_VKPO_DS_Rifleman`, `Character_RHS_RF_MSV_VKPO_DS_Rifleman_2`, `Character_RHS_RF_MSV_VKPO_DS_Rifleman_3` | Rifle_AK74M<br>Rifle_AK74M_npz_rail_1p87<br>Rifle_AK74M_1P63 | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_RF_MSV_VKPO_DS_Sapper`, `Character_RHS_RF_MSV_VKPO_DS_Sapper_2`, `Character_RHS_RF_MSV_VKPO_DS_Sapper_3` | Rifle_AK74M<br>Rifle_AK74M_1P63<br>Rifle_AK74M_npz_rail_1p87 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_RF_MSV_VKPO_DS_Scout`, `Character_RHS_RF_MSV_VKPO_DS_Scout_2`, `Character_RHS_RF_MSV_VKPO_DS_Scout_3` | Rifle_AK74M_npz_rail_1p87_camo | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 3: `Character_RHS_RF_MSV_VKPO_DS_Scout_RTO`, `Character_RHS_RF_MSV_VKPO_DS_Scout_RTO_2`, `Character_RHS_RF_MSV_VKPO_DS_Scout_RTO_3` | Rifle_AK74M_camo<br>Rifle_AK74M_camo_1P63 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 3: `Character_RHS_RF_MSV_VKPO_DS_SR`, `Character_RHS_RF_MSV_VKPO_DS_SR_2`, `Character_RHS_RF_MSV_VKPO_DS_SR_3` | Rifle_AK74M_1P78<br>Rifle_AK74M_npz_rail_1p87_1p90 | stem |
| **Senior Rifleman (GL)** | Старший стрелок (ГП) | `SR_GL` | Senior Rifleman | 3: `Character_RHS_RF_MSV_VKPO_DS_SR_GL`, `Character_RHS_RF_MSV_VKPO_DS_SR_GL_2`, `Character_RHS_RF_MSV_VKPO_DS_SR_GL_3` | Rifle_AK74M_npz_rail_gp25_1p87<br>Rifle_AK74M_npz_rail_gp25_1p87_1p90<br>Rifle_AK74M_1P78_GP25 | stem |
| **Sensor Operator** | Радиоразведчик | `Scout_RadioRecon` | Sensor Operator | 3: `Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon`, `Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon_2`, `Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon_3` | Rifle_AK74M_camo + Device_SpectrumDevice_ru | override |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 3: `Character_RHS_RF_MSV_VKPO_DS_Sharpshooter`, `Character_RHS_RF_MSV_VKPO_DS_Sharpshooter_2`, `Character_RHS_RF_MSV_VKPO_DS_Sharpshooter_3` | Rifle_SVD_PSO | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_RF_MSV_VKPO_DS_Spotter`, `Character_RHS_RF_MSV_VKPO_DS_Spotter_2`, `Character_RHS_RF_MSV_VKPO_DS_Spotter_3` | Rifle_AK74M_npz_rail_1p86-1<br>Rifle_AK74M_npz_rail_1p87_1p90 | stem |
| **Spotter (GL)** | Наблюдатель (ГП) | `Spotter_GL` | Spotter | 3: `Character_RHS_RF_MSV_VKPO_DS_Spotter_GL`, `Character_RHS_RF_MSV_VKPO_DS_Spotter_GL_2`, `Character_RHS_RF_MSV_VKPO_DS_Spotter_GL_3` | Rifle_AK74M_npz_rail_gp25_1p87<br>Rifle_AK74M_GP25_1P63<br>Rifle_AK74M_1P78_GP25 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_RF_MSV_VKPO_DS_SL`, `Character_RHS_RF_MSV_VKPO_DS_SL_2`, `Character_RHS_RF_MSV_VKPO_DS_SL_3` | Rifle_AK74M_npz_rail_gp25_1p87_1p90<br>Rifle_AK74M_npz_rail_gp25_1p87<br>Rifle_AK74M_GP25_1P63 | stem |

#### MSV (VKPO summer) (registry set `MSV_VKPO_Summer`, 27 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 3: `Character_RHS_RF_MSV_VKPO_S_Ammo`, `Character_RHS_RF_MSV_VKPO_S_Ammo_2`, `Character_RHS_RF_MSV_VKPO_S_Ammo_3` | Rifle_AK74M<br>Rifle_AK74M_1P63 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_RF_MSV_VKPO_S_AT`, `Character_RHS_RF_MSV_VKPO_S_AT_2`, `Character_RHS_RF_MSV_VKPO_S_AT_3` | Rifle_AK74M + Launcher_RPG7_pgo7<br>Rifle_AK74M_1P63 + Launcher_RPG7_pgo7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_RF_MSV_VKPO_S_AAT`, `Character_RHS_RF_MSV_VKPO_S_AAT_2`, `Character_RHS_RF_MSV_VKPO_S_AAT_3` | Rifle_AK74M<br>Rifle_AK74M_1P63 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 3: `Character_RHS_RF_MSV_VKPO_S_AMG`, `Character_RHS_RF_MSV_VKPO_S_AMG_2`, `Character_RHS_RF_MSV_VKPO_S_AMG_3` | Rifle_AK74M<br>Rifle_AK74M_npz_rail_1p87 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 3: `Character_RHS_RF_MSV_VKPO_S_AR`, `Character_RHS_RF_MSV_VKPO_S_AR_2`, `Character_RHS_RF_MSV_VKPO_S_AR_3` | MG_RPK74M<br>MG_RPK74M_1P78 | stem |
| **Crewman** | Экипаж | `Crew` | Crewman | 1: `Character_RHS_RF_MSV_VKPO_S_Crew` | Rifle_AKS74UN_PlasticMag | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_RF_MSV_VKPO_S_GL`, `Character_RHS_RF_MSV_VKPO_S_GL_2`, `Character_RHS_RF_MSV_VKPO_S_GL_3` | Rifle_AK74M_GP25<br>Rifle_AK74M_GP25_1P63 | stem |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_RHS_RF_MSV_VKPO_S_HeliCrew` | Handgun_PM | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_RHS_RF_MSV_VKPO_S_HeliPilot` | Handgun_PM | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 3: `Character_RHS_RF_MSV_VKPO_S_LAT`, `Character_RHS_RF_MSV_VKPO_S_LAT_2`, `Character_RHS_RF_MSV_VKPO_S_LAT_3` | Rifle_AK74M_npz_rail_1p87 + Launcher_RPG22<br>Rifle_AK74M_1P63 + Launcher_RPG22<br>Rifle_AK74M + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_RF_MSV_VKPO_S_MG`, `Character_RHS_RF_MSV_VKPO_S_MG_2`, `Character_RHS_RF_MSV_VKPO_S_MG_3` | MG_PKP_base + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_RF_MSV_VKPO_S_Medic`, `Character_RHS_RF_MSV_VKPO_S_Medic_2`, `Character_RHS_RF_MSV_VKPO_S_Medic_3` | Rifle_AK74M | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_RHS_RF_MSV_VKPO_S_Officer` | Handgun_PM | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 3: `Character_RHS_RF_MSV_VKPO_S_PL`, `Character_RHS_RF_MSV_VKPO_S_PL_2`, `Character_RHS_RF_MSV_VKPO_S_PL_3` | Rifle_AK74M + Handgun_PM<br>Rifle_AK74M_npz_rail_1p87_1p90 + Handgun_PM<br>Rifle_AK74M_1P63 + Handgun_PM | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 3: `Character_RHS_RF_MSV_VKPO_S_Sergeant`, `Character_RHS_RF_MSV_VKPO_S_Sergeant_2`, `Character_RHS_RF_MSV_VKPO_S_Sergeant_3` | Rifle_AK74M_npz_rail_1p87_1p90<br>Rifle_AK74M_npz_rail_1p87<br>Rifle_AK74M_1P63 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_RHS_RF_MSV_VKPO_S_RTO`, `Character_RHS_RF_MSV_VKPO_S_RTO_2`, `Character_RHS_RF_MSV_VKPO_S_RTO_3` | Rifle_AK74M | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_RF_MSV_VKPO_S_Rifleman`, `Character_RHS_RF_MSV_VKPO_S_Rifleman_2`, `Character_RHS_RF_MSV_VKPO_S_Rifleman_3` | Rifle_AK74M<br>Rifle_AK74M_1P63<br>Rifle_AK74M_npz_rail_1p87 | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_RF_MSV_VKPO_S_Sapper`, `Character_RHS_RF_MSV_VKPO_S_Sapper_2`, `Character_RHS_RF_MSV_VKPO_S_Sapper_3` | Rifle_AK74M<br>Rifle_AK74M_npz_rail_1p87<br>Rifle_AK74M_1P63 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_RF_MSV_VKPO_S_Scout`, `Character_RHS_RF_MSV_VKPO_S_Scout_2`, `Character_RHS_RF_MSV_VKPO_S_Scout_3` | Rifle_AK74M_npz_rail_1p87_camo<br>Rifle_AK74M_camo_1P63<br>Rifle_AK74M_npz_rail_1p87_1p90_camo | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 3: `Character_RHS_RF_MSV_VKPO_S_Scout_RTO`, `Character_RHS_RF_MSV_VKPO_S_Scout_RTO_2`, `Character_RHS_RF_MSV_VKPO_S_Scout_RTO_3` | Rifle_AK74M_camo<br>Rifle_AK74M_camo_1P63 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 3: `Character_RHS_RF_MSV_VKPO_S_SR`, `Character_RHS_RF_MSV_VKPO_S_SR_2`, `Character_RHS_RF_MSV_VKPO_S_SR_3` | Rifle_AK74M_1P78<br>Rifle_AK74M_npz_rail_1p87_1p90 | stem |
| **Senior Rifleman (GL)** | Старший стрелок (ГП) | `SR_GL` | Senior Rifleman | 3: `Character_RHS_RF_MSV_VKPO_S_SR_GL`, `Character_RHS_RF_MSV_VKPO_S_SR_GL_2`, `Character_RHS_RF_MSV_VKPO_S_SR_GL_3` | Rifle_AK74M_npz_rail_gp25_1p87<br>Rifle_AK74M_npz_rail_gp25_1p87_1p90<br>Rifle_AK74M_1P78_GP25 | stem |
| **Sensor Operator** | Радиоразведчик | `Scout_RadioRecon` | Sensor Operator | 3: `Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon`, `Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon_2`, `Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon_3` | Rifle_AK74M_camo + Device_SpectrumDevice_ru | override |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 3: `Character_RHS_RF_MSV_VKPO_S_Sharpshooter`, `Character_RHS_RF_MSV_VKPO_S_Sharpshooter_2`, `Character_RHS_RF_MSV_VKPO_S_Sharpshooter_3` | Rifle_SVD_PSO | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_RF_MSV_VKPO_S_Spotter`, `Character_RHS_RF_MSV_VKPO_S_Spotter_2`, `Character_RHS_RF_MSV_VKPO_S_Spotter_3` | Rifle_AK74M_npz_rail_1p86-1 | stem |
| **Spotter (GL)** | Наблюдатель (ГП) | `Spotter_GL` | Spotter | 3: `Character_RHS_RF_MSV_VKPO_S_Spotter_GL`, `Character_RHS_RF_MSV_VKPO_S_Spotter_GL_2`, `Character_RHS_RF_MSV_VKPO_S_Spotter_GL_3` | Rifle_AK74M_npz_rail_gp25_1p87<br>Rifle_AK74M_1P78_GP25<br>Rifle_AK74M_GP25_1P63 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_RF_MSV_VKPO_S_SL`, `Character_RHS_RF_MSV_VKPO_S_SL_2`, `Character_RHS_RF_MSV_VKPO_S_SL_3` | Rifle_AK74M_npz_rail_gp25_1p87_1p90<br>Rifle_AK74M_npz_rail_gp25_1p87<br>Rifle_AK74M_GP25_1P63 | stem |

#### MSV (VSR) (registry set `MSV_VSR`, 14 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 1: `Character_RHS_RF_MSV_VSR_AT` | Rifle_AK74 + Launcher_RPG7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 1: `Character_RHS_RF_MSV_VSR_AAT` | Rifle_AK74 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_RHS_RF_MSV_VSR_AMG` | Rifle_AK74 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 1: `Character_RHS_RF_MSV_VSR_AR` | MG_RPK74 | stem |
| **Crewman** | Экипаж | `Crew` | Crewman | 1: `Character_RHS_RF_MSV_VSR_Crew` | Rifle_AKS74UN | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 1: `Character_RHS_RF_MSV_VSR_GL` | Rifle_AK74_GP25 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_RHS_RF_MSV_VSR_MG` | MG_PKM + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_RHS_RF_MSV_VSR_Medic` | Rifle_AK74 | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_RHS_RF_MSV_VSR_Officer` | Rifle_AK74 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_RHS_RF_MSV_VSR_RTO` | Rifle_AK74 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_RHS_RF_MSV_VSR_Rifleman` | Rifle_AK74 | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 1: `Character_RHS_RF_MSV_VSR_SR` | Rifle_AK74 | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 1: `Character_RHS_RF_MSV_VSR_Sharpshooter` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_RHS_RF_MSV_VSR_SL` | Rifle_AK74_GP25 | stem |

#### SSO (A-TACS) (**no registry group set**, 10 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_RF_SSO_AT`, `Character_RHS_RF_SSO_AT2`, `Character_RHS_RF_SSO_AT3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO + Launcher_RPG7_pgo7_rhs<br>Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO + Launcher_RPG7_pgo7_rhs<br>Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO + Launcher_RPG7_pgo7_rhs | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_RF_SSO_AAT`, `Character_RHS_RF_SSO_AAT2`, `Character_RHS_RF_SSO_AAT3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_RF_SSO_GL`, `Character_RHS_RF_SSO_GL2`, `Character_RHS_RF_SSO_GL3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_RF_SSO_MG`, `Character_RHS_RF_SSO_MG2`, `Character_RHS_RF_SSO_MG3` | MG_PKM_B51_Thermal | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_RF_SSO_Medic`, `Character_RHS_RF_SSO_Medic2`, `Character_RHS_RF_SSO_Medic3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK105_b30_b31s_b33_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_RF_SSO_Rifleman`, `Character_RHS_RF_SSO_Rifleman2`, `Character_RHS_RF_SSO_Rifleman3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 3: `Character_RHS_RF_SSO_Sapper`, `Character_RHS_RF_SSO_Sapper2`, `Character_RHS_RF_SSO_Sapper3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b30_b31s_b33_rk3_pt1_FDE_RailCover_SSO<br>Rifle_AK105_b30_b31s_b33_pt1_rk3_FDE_SSO | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 1: `Character_RHS_RF_SSO_Sharpshooter` | Rifle_SVD_1P21_TGPV + Handgun_APS (inv) | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_RF_SSO_Spotter`, `Character_RHS_RF_SSO_Spotter2`, `Character_RHS_RF_SSO_Spotter3` | Rifle_AK74M_npz_rail_camo_TGPA_Thermal | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_RF_SSO_SL`, `Character_RHS_RF_SSO_SL2`, `Character_RHS_RF_SSO_SL3` | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO<br>Rifle_AK74M_b30_b31s_b33_rk3_pt1_FDE_RailCover_SSO<br>Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | stem |

#### Rosgvardia (A-TACS) (**no registry group set**, 10 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_RHS_RF_SOF_AT`, `Character_RHS_RF_SOF_AT2`, `Character_RHS_RF_SOF_AT3` | Rifle_AK200_B9M_45rnd + Launcher_RPOA + Handgun_Glock17<br>Rifle_AK200_B9M_T1 + Launcher_RPOA + Handgun_Glock17<br>Rifle_AK205_B30_B31S_RailCover_RG + Launcher_RPOA + Handgun_Glock17 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 3: `Character_RHS_RF_SOF_AAT`, `Character_RHS_RF_SOF_AAT2`, `Character_RHS_RF_SOF_AAT3` | Rifle_AK200_B30_B31S_RailCover_XPS + Launcher_RPOD + Handgun_Glock17<br>Rifle_AK200_T1_klesh + Launcher_RPOD + Handgun_Glock17<br>Rifle_AK205_B9M_T1 + Launcher_RPOD + Handgun_Glock17 | stem |
| **Breacher** | Прорывник | `Chad` | Breacher | 2: `Character_RHS_RF_SOF_Chad`, `Character_RHS_RF_SOF_Chad2` | Rifle_AK205_T1 + Handgun_Glock17<br>Rifle_AK205_XPS + Handgun_Glock17 | override |
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_RF_SOF_GL`, `Character_RHS_RF_SOF_GL2`, `Character_RHS_RF_SOF_GL3` | GL_GM94 + Rifle_AK205_B9M + Handgun_Glock17<br>GL_GM94_camo + Rifle_AK205_B10M_B19_RK3_PT1_B9M_FDE_XPS + Handgun_Glock17<br>GL_GM94_camo + Rifle_AK205_B9M_T1_low + Handgun_Glock17 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_RF_SOF_MG`, `Character_RHS_RF_SOF_MG2`, `Character_RHS_RF_SOF_MG3` | MG_PKM_B51_Eot + Handgun_Glock17<br>MG_PKM_B51_1p87 + Handgun_Glock17 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_RF_SOF_Medic`, `Character_RHS_RF_SOF_Medic2`, `Character_RHS_RF_SOF_Medic3` | Rifle_AK200_B10M_B19_B9M_XPS + Handgun_Glock17<br>Rifle_AK205_XPS_klesh + Handgun_Glock17<br>Rifle_AK205_XPS_m300 + Handgun_Glock17 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 4: `Character_RHS_RF_SOF_Rifleman`, `Character_RHS_RF_SOF_Rifleman2`, `Character_RHS_RF_SOF_Rifleman3`, `Character_RHS_RF_SOF_Rifleman4` | Rifle_AK200_B9M_1P90_2 + Handgun_Glock17<br>Rifle_AK200_1P90_klesh + Handgun_Glock17<br>Rifle_AK200_1P90_m300 + Handgun_Glock17<br>Rifle_AK200_B30_B31S_1P90 + Handgun_Glock17 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_RF_SOF_Scout`, `Character_RHS_RF_SOF_Scout2`, `Character_RHS_RF_SOF_Scout3` | Rifle_AK105_b10m_b19n_b33_b9m_tgpa + Handgun_Glock17<br>Rifle_AK105_tpga + Handgun_Glock17<br>Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_Glock17 | stem |
| **Sharpshooter** | Пехотный снайпер | `Marksman` | Sharpshooter | 1: `Character_RHS_RF_SOF_Marksman` | Rifle_SVD_1P21 + Handgun_Glock17 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_RF_SOF_SL`, `Character_RHS_RF_SOF_SL2`, `Character_RHS_RF_SOF_SL3` | Rifle_AK200_B9M_1P90 + Handgun_Glock17<br>Rifle_AK200_B30_B31S_RailCover_1P90 + Handgun_Glock17<br>Rifle_AK205_B10M_B19_RK3_PT1_B9M_XPS_Perst + Handgun_Glock17 | stem |

#### Rosgvardia (black) (**no registry group set**, 3 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Breacher** | Прорывник | `Breacher`, `Chad` | Rifleman / Breacher | 5: `Character_RHS_RF_SOBR_Breacher`, `Character_RHS_RF_SOBR_Breacher2`, `Character_RHS_RF_SOBR_Breacher3`, `Character_RHS_RF_SOBR_Chad1`, `Character_RHS_RF_SOBR_Chad2` | Rifle_SR3M_supr + Handgun_Glock17 | override |
| **Sharpshooter** | Пехотный снайпер | `Marksman` | Sharpshooter | 1: `Character_RHS_RF_SOBR_Marksman` | Rifle_SR3M_supr_PSO + Handgun_Glock17 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_RHS_RF_SOBR_SL` | Rifle_SR3M_supr + Handgun_Glock17 | stem |

#### Rosgvardia (olive) (**no registry group set**, 6 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Grenadier** | Гренадер | `GL` | Grenadier | 3: `Character_RHS_RF_SOBROlive_GL`, `Character_RHS_RF_SOBROlive_GL2`, `Character_RHS_RF_SOBROlive_GL3` | GL_GM94 + Rifle_AK105 + Handgun_Glock17<br>GL_GM94 + Rifle_AK105_b10m_b19_b33_b9m_RG + Handgun_Glock17 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 3: `Character_RHS_RF_SOBROlive_MG`, `Character_RHS_RF_SOBROlive_MG2`, `Character_RHS_RF_SOBROlive_MG3` | MG_PKM + Handgun_Glock17 | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_RF_SOBROlive_Medic`, `Character_RHS_RF_SOBROlive_Medic2`, `Character_RHS_RF_SOBROlive_Medic3` | Rifle_AK104_b10m_b19n_b33_pt1_dtk2_rk3_T1 + Handgun_Glock17<br>Rifle_AK104_b30_b31s_b33_RG + Handgun_Glock17<br>Rifle_AK103 + Handgun_Glock17 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_RF_SOBROlive_Rifleman`, `Character_RHS_RF_SOBROlive_Rifleman2`, `Character_RHS_RF_SOBROlive_Rifleman3` | Rifle_AK103_b10m_b19_b33_pt1_rk3_b9m_XPS + Handgun_Glock17<br>Rifle_AK103_b30_b31s_b33_pt1_rk3_RailCover_RG + Handgun_Glock17<br>Rifle_AK104_b10m_b19_b33_b9m_rk3_dtk2_b9m_XPS + Handgun_Glock17 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_RF_SOBROlive_Scout`, `Character_RHS_RF_SOBROlive_Scout2`, `Character_RHS_RF_SOBROlive_Scout3` | Rifle_AK104 + Handgun_Glock17<br>Rifle_AK103 + Handgun_Glock17<br>Rifle_AK105 + Handgun_Glock17 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_RF_SOBROlive_SL`, `Character_RHS_RF_SOBROlive_SL2`, `Character_RHS_RF_SOBROlive_SL3` | Rifle_AK105_b10m_b19n_b33_b9m_pt1_rk3_dtk2_XPS + Handgun_Glock17<br>Rifle_AK103_b30u_b31n_b33_pt1_rk3_dtk2_XPS + Handgun_Glock17<br>Rifle_AK105_b30u_b31n_b33_pt1_rk3_dtk2_T1 + Handgun_Glock17 | stem |

### RHS_ION — RHS ION PMC (12 roles, 61 prefabs)

#### ION (registry set `ION_COY`, 5 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_ION_Medic`, `Character_RHS_ION_Medic2`, `Character_RHS_ION_Medic3` | Rifle_AR15_GA_UD145_BLK_ION1 + Handgun_Glock45<br>Rifle_DOM4A1_ION_BRAVO4_SD + Handgun_Glock45 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_ION_Rifleman`, `Character_RHS_ION_Rifleman2`, `Character_RHS_ION_Rifleman3` | Rifle_AR15_GA_UD145_BLK_ION1<br>Rifle_DOM4A1_ION_BRAVO4_SD | stem |
| **Scout** | Разведчик | `Scout` | Scout | 3: `Character_RHS_ION_Scout`, `Character_RHS_ION_Scout2`, `Character_RHS_ION_Scout3` | Rifle_AR15_GA_UD115_BLK_ION1 + Handgun_Glock45<br>Rifle_DOMk18_ION_RMR_SD + Handgun_Glock45 | stem |
| **Sharpshooter** | Марксман | `Marksman` | Spotter | 3: `Character_RHS_ION_Marksman`, `Character_RHS_ION_Marksman2`, `Character_RHS_ION_Marksman3` | Rifle_DOM4A1_ION_ACOG_ReapIR_SD + Handgun_Glock45 | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_ION_SL`, `Character_RHS_ION_SL2`, `Character_RHS_ION_SL3` | Rifle_AR15_GA_UD145_BLK_ION1 + Handgun_Glock45<br>Rifle_DOM4A1_FSP_ION_BRAVO4_SD + Handgun_Glock45 | stem |

#### ION (company) (registry set `ION_COY`, 4 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Medic** | Врач | `Medic` | Medic | 3: `Character_RHS_ION_Coy_Medic`, `Character_RHS_ION_Coy_Medic2`, `Character_RHS_ION_Coy_Medic3` | Rifle_AR15_GA_UD115_DDC_ION | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 3: `Character_RHS_ION_Coy_Rifleman`, `Character_RHS_ION_Coy_Rifleman2`, `Character_RHS_ION_Coy_Rifleman3` | Rifle_AR15_GA_UD115_DDC_ION | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 3: `Character_RHS_ION_Coy_Spotter`, `Character_RHS_ION_Coy_Spotter2`, `Character_RHS_ION_Coy_Spotter3` | Rifle_AR15_GA_UD145_DDC_ION_ReapIR | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 3: `Character_RHS_ION_Coy_SL`, `Character_RHS_ION_Coy_SL2`, `Character_RHS_ION_Coy_SL3` | Rifle_AR15_GA_UD145_DDC_ION | stem |

#### ION (urban) (**no registry group set**, 2 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Rifleman** | Стрелок | `Rifleman`, `Rifleman10`, `Rifleman11`, `Rifleman12`, `Rifleman13`, `Rifleman14`, `Rifleman15`, `Rifleman16`, `Rifleman17`, `Rifleman18`, `Rifleman19`, `Rifleman20` | Rifleman | 20: `Character_RHS_ION_Urban_Rifleman`, `Character_RHS_ION_Urban_Rifleman10`, `Character_RHS_ION_Urban_Rifleman11`, `Character_RHS_ION_Urban_Rifleman12`, `Character_RHS_ION_Urban_Rifleman13`, `Character_RHS_ION_Urban_Rifleman14`, `Character_RHS_ION_Urban_Rifleman15`, `Character_RHS_ION_Urban_Rifleman16`, `Character_RHS_ION_Urban_Rifleman17`, `Character_RHS_ION_Urban_Rifleman18`, `Character_RHS_ION_Urban_Rifleman19`, `Character_RHS_ION_Urban_Rifleman2`, `Character_RHS_ION_Urban_Rifleman20`, `Character_RHS_ION_Urban_Rifleman3`, `Character_RHS_ION_Urban_Rifleman4`, `Character_RHS_ION_Urban_Rifleman5`, `Character_RHS_ION_Urban_Rifleman6`, `Character_RHS_ION_Urban_Rifleman7`, `Character_RHS_ION_Urban_Rifleman8`, `Character_RHS_ION_Urban_Rifleman9` | Rifle_M16A2_carbine<br>Rifle_M16A2_carbine_weaver_EOT_pmag<br>Rifle_M16A2_carbine_weaver_T1_pmag<br>Rifle_M16A2_carbine_weaver_T1_warden<br>Rifle_M16A2_carbine_weaver_T1_sf<br>Rifle_M16A2_carbine_weaver_rmr_warden<br>Rifle_M16A2_carbine_weaver_EOT<br>Rifle_M16A2_carbine_weaver_rmr<br>Rifle_M16A2_carbine_weaver_T1<br>Rifle_M16A2_carbine_weaver_T1_pmag_warden | stem |
| **Sharpshooter** | Пехотный снайпер | `Marksman` | Sharpshooter | 3: `Character_RHS_ION_Urban_Marksman`, `Character_RHS_ION_Urban_Marksman2`, `Character_RHS_ION_Urban_Marksman3` | Rifle_M16A2_weaver_marksman | stem |

#### ION (urban, demi-season) (**no registry group set**, 1 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Rifleman** | Стрелок | `Rifleman`, `Rifleman10`, `Rifleman11` | Rifleman | 11: `Character_RHS_ION_Urban_D_Rifleman`, `Character_RHS_ION_Urban_D_Rifleman10`, `Character_RHS_ION_Urban_D_Rifleman11`, `Character_RHS_ION_Urban_D_Rifleman2`, `Character_RHS_ION_Urban_D_Rifleman3`, `Character_RHS_ION_Urban_D_Rifleman4`, `Character_RHS_ION_Urban_D_Rifleman5`, `Character_RHS_ION_Urban_D_Rifleman6`, `Character_RHS_ION_Urban_D_Rifleman7`, `Character_RHS_ION_Urban_D_Rifleman8`, `Character_RHS_ION_Urban_D_Rifleman9` | Rifle_M4A1_BLOCK_1_ION_V2 | stem |

### UK — British Military (88 roles, 90 prefabs)

#### 1983 Regulars (registry set `Regulars_1983`, 21 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_UK_1983_Regulars_AMG` | Rifle_L1A1_SLR_Plastic | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 1: `Character_UK_1983_CC` | Rifle_L2A3_Sterling | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_UK_1983_Crew` | Rifle_L2A3_Sterling | stem |
| **GPMG Gunner** | Пулеметчик (GPMG) | `GPMG_No1` | Machine-Gunner | 1: `Character_UK_1983_Regulars_GPMG_No1` | MG_GPMG_L7A2 | override |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_UK_1983_HeliCrew` | Rifle_L2A3_Sterling + Schermuly_Rocket_Flare_White (inv) + Schermuly_Rocket_Flare_Orange (inv) | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_UK_1983_HeliPilot` | Rifle_L2A3_Sterling + Schermuly_Rocket_Flare_White (inv) + Schermuly_Rocket_Flare_Orange (inv) | stem |
| **Light Anti-Tank** | ПТ стрелок | `Rifleman_LAT` | Light AT Rifleman | 1: `Character_UK_1983_Regulars_Rifleman_LAT` | Rifle_L1A1_SLR_Plastic + Launcher_LAW66_L1A1 | override |
| **LMG Gunner (L4)** | Пулеметчик (L4) | `L4LMG_No1` | Light Machine-Gunner | 1: `Character_UK_1983_Regulars_L4LMG_No1` | MG_L4_LMG | override |
| **MAW Assistant** | Помощник гранатометчика | `Maw_No2` | Anti-Tank Specialist Assistant | 1: `Character_UK_1983_Regulars_Maw_No2` | Rifle_L1A1_SLR_Plastic | override |
| **MAW Gunner** | Гранатометчик (Carl Gustav) | `MAW_No1` | Anti-Tank Specialist | 1: `Character_UK_1983_Regulars_MAW_No1` | Rifle_L2A3_Sterling + Launcher_84mm_MAW_Optic | override |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_UK_1983_Regulars_Medic` | Rifle_L2A3_Sterling | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_UK_1983_Regulars_Officer` | Handgun_HiPower | stem |
| **Platoon Leader** | Командир взвода | `PlatoonLeader` | Platoon Leader | 1: `Character_UK_1983_Regulars_PlatoonLeader` | Rifle_L1A1_SLR_Plastic + Handgun_HiPower | override |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 1: `Character_UK_1983_Regulars_Sergeant` | Rifle_L1A1_SLR_Plastic | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_UK_1983_Regulars_RTO` | Rifle_L2A3_Sterling | stem |
| **Rifleman** | Стрелок | `Rifleman`, `Rifleman_Sterling` | Rifleman | 2: `Character_UK_1983_Regulars_Rifleman`, `Character_UK_1983_Regulars_Rifleman_Sterling` | Rifle_L1A1_SLR_Plastic<br>Rifle_L2A3_Sterling | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `Character_UK_1983_Regulars_Sapper` | Rifle_L2A3_Sterling | stem |
| **Section 2IC** | Зам. командира секции | `Section2IC` | Section 2IC | 1: `Character_UK_1983_Regulars_Section2IC` | Rifle_L1A1_SLR_Plastic_SUIT | override |
| **Section Commander** | Командир секции | `SectionCommander` | Section Commander | 1: `Character_UK_1983_Regulars_SectionCommander` | Rifle_L1A1_SLR_Plastic | override |
| **Sniper** | Снайпер | `Sniper` | Trained Sniper | 1: `Character_UK_1983_Regulars_Sniper` | Rifle_L42A1 + Handgun_HiPower | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 1: `Character_UK_1983_Regulars_Spotter` | Rifle_L1A1_SLR_Plastic_SUIT | stem |

#### 1983 Reservists (excluded by design) (**no registry group set**, 4 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Reservist (LAW 66) | 1: `Character_UK_1983_Reservist_LAT` | Rifle_L1A1_SLR_Laminate + Launcher_LAW66_L1A1 | stem |
| **Machine Gunner** | Пулеметчик | `LMG` | Reservist (LMG) | 1: `Character_UK_1983_Reservist_LMG` | MG_L4_LMG | stem |
| **Rifleman** | Стрелок | `Rifleman` | Reservist | 1: `Character_UK_1983_Reservist_Rifleman` | Rifle_L1A1_SLR_Wood | stem |
| **Section Commander** | Командир секции | `SectionCommander` | Reservist Section Commander | 1: `Character_UK_1983_Reservist_SectionCommander` | Rifle_L2A3_Sterling | override |

#### 1983 Special Forces (registry set `SF_1983`, 12 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank (Carl Gustav)** | Гранатометчик (Carl Gustav) | `CharlieG` | Special Forces Anti-Tank | 1: `Character_UK_1983_SpecialForces_CharlieG` | Rifle_L1A1_SLR_Plastic + Launcher_84mm_MAW_Optic | override |
| **CRW Trooper** | Боец CRW | `CRW` | Counter Revolutionary Warfare Trooper | 1: `Character_UK_1983_SpecialForces_CRW` | Rifle_MP5_SL20 + Handgun_HiPower_20 | override |
| **Grenadier** | Гранатометчик (ГП) | `GL` | Special Forces Grenadier | 1: `Character_UK_1983_SpecialForces_GL` | Rifle_CAR15_653_OliveGreen_SandStripes + Launcher_M79 | stem |
| **Machine Gunner** | Пулеметчик | `LMG` | Special Forces Machine-Gunner | 1: `Character_UK_1983_SpecialForces_LMG` | MG_L4_LMG | stem |
| **Medic** | Санитар | `Medic` | Special Forces Medic | 1: `Character_UK_1983_SpecialForces_Medic` | Rifle_CAR15_653 | stem |
| **Officer** | Офицер | `Officer` | Special Forces Officer | 1: `Character_UK_1983_SpecialForces_Officer` | Rifle_AR15_604_OliveGreen_Solid + Launcher_LAW66_L1A1 + Handgun_HiPower | stem |
| **Radio Operator** | Радист | `RTO` | Special Forces Radio Operator | 1: `Character_UK_1983_SpecialForces_RTO` | Rifle_CAR15_653_OliveGreen_SandStripes | stem |
| **Rifleman** | Стрелок | `Trooper` | Special Forces Trooper | 1: `Character_UK_1983_SpecialForces_Trooper` | Rifle_L1A1_SLR_Plastic + Launcher_LAW66_L1A1 | stem |
| **Saboteur** | Диверсант | `Saboteur` | Special Forces Saboteur | 1: `Character_UK_1983_SpecialForces_Saboteur` | Rifle_L34A1_Sterling + Welrod | override |
| **Sapper** | Сапер | `Sapper` | Special Forces Sapper | 1: `Character_UK_1983_SpecialForces_Sapper` | Rifle_AR15_604_OliveGreen_Solid + Launcher_LAW66_L1A1 | stem |
| **Sharpshooter** | Марксман | `Sharpshooter` | Special Forces Sharpshooter | 1: `Character_UK_1983_SpecialForces_Sharpshooter` | Rifle_L42A1 + Handgun_HiPower | stem |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader | 1: `Character_UK_1983_SpecialForces_SL` | Rifle_CAR15_653_OliveGreen_Solid + Welrod | stem |

#### 1989 Regulars (registry set `Regulars_1989`, 30 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Assault Engineer** | Штурмовой сапер | `Sapper_Assault` | Assault Engineer | 1: `Character_UK_1989_Regulars_Sapper_Assault` | Rifle_L85A1_Attachments_SUSAT | override |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `Character_UK_1989_Regulars_AMG` | Rifle_L85A1_Attachments_SUSAT | stem |
| **Convoy Commander** | Командир колонны | `ConvoyCommander` | Convoy Commander | 1: `Character_UK_1989_Regulars_ConvoyCommander` | Rifle_L85A1_Attachments_Irons | override |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 1: `Character_UK_1989_CC` | Rifle_L85A1_Attachments_Irons | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_UK_1989_Crew` | Rifle_L85A1_Attachments_Irons | stem |
| **Detachment Commander** | Командир отряда | `DetachmentCommander` | Detachment Commander | 1: `Character_UK_1989_Regulars_DetachmentCommander` | Rifle_L85A1_Attachments_SUSAT | override |
| **Driver** | Водитель | `Driver` | Driver | 1: `Character_UK_1989_Regulars_Driver` | Rifle_L85A1_Attachments_Irons | override |
| **GPMG Gunner** | Пулеметчик (GPMG) | `GPMG_No1` | Machine-Gunner | 1: `Character_UK_1989_Regulars_GPMG_No1` | MG_GPMG_L7A2 | override |
| **Ground Crew** | Наземный персонал | `Heli_GroundCrew` | Ground Crew | 1: `Character_UK_1989_Heli_GroundCrew` | Rifle_L2A3_Sterling | override |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Aircraft Commander | 1: `Character_UK_1989_HeliCrew` | Rifle_L2A3_Sterling + Schermuly_Rocket_Flare_White (inv) + Schermuly_Rocket_Flare_Orange (inv) | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Aircraft Commander | 1: `Character_UK_1989_HeliPilot` | Handgun_HiPower + Schermuly_Rocket_Flare_White (inv) + Schermuly_Rocket_Flare_Orange (inv) | stem |
| **Light Anti-Tank (LAW)** | ПТ стрелок (LAW) | `Rifleman_LAT_LAW66`, `Rifleman_LAT_LAW80` | Rifleman (LAW 66) / Rifleman (LAW 80) | 2: `Character_UK_1989_Regulars_Rifleman_LAT_LAW66`, `Character_UK_1989_Regulars_Rifleman_LAT_LAW80` | Rifle_L85A1_Attachments_SUSAT + Launcher_LAW66_L1A1<br>Rifle_L85A1_Attachments_SUSAT + Launcher_LAW80_base | override |
| **LSW Gunner** | Пулеметчик (LSW) | `LSW` | LSW Gunner | 1: `Character_UK_1989_Regulars_LSW` | Rifle_L85_LSW_A1_Attachments_SUSAT | override |
| **MAW Assistant** | Помощник гранатометчика | `Maw_No2` | Anti-Tank Specialist Assistant | 1: `Character_UK_1989_Regulars_Maw_No2` | Rifle_L85A1_Attachments_SUSAT | override |
| **MAW Gunner** | Гранатометчик (Carl Gustav) | `MAW_No1` | Anti-Tank Specialist | 1: `Character_UK_1989_Regulars_MAW_No1` | Rifle_L85A1_Attachments_SUSAT + Launcher_84mm_MAW_Optic | override |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_UK_1989_Regulars_Medic` | Rifle_L85A1_Attachments_SUSAT | stem |
| **Mortarman** | Минометчик | `Rifleman_Mortar` | Mortarman | 1: `Character_UK_1989_Regulars_Rifleman_Mortar` | Rifle_L85A1_Attachments_Irons | override |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_UK_1989_Regulars_Officer` | Handgun_HiPower | stem |
| **Platoon Leader** | Командир взвода | `PlatoonLeader` | Platoon Leader | 1: `Character_UK_1989_Regulars_PlatoonLeader` | Rifle_L85A1_Attachments_SUSAT + Handgun_HiPower | override |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 1: `Character_UK_1989_Regulars_Sergeant` | Rifle_L85A1_Attachments_SUSAT | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `Character_UK_1989_Regulars_RTO` | Rifle_L85A1_Attachments_SUSAT | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_UK_1989_Regulars_Rifleman` | Rifle_L85A1_Attachments_SUSAT | stem |
| **Rifleman (recce)** | Стрелок (разведка) | `Rifleman_Recce` | Rifleman (Recce) | 1: `Character_UK_1989_Regulars_Rifleman_Recce` | Rifle_L85A1_Attachments_SUSAT | override |
| **Sapper** | Сапер | `Sapper` | Combat Engineer | 1: `Character_UK_1989_Regulars_Sapper` | Rifle_L85A1_Attachments_Irons + Mine_L9A1_Barmine | stem |
| **Section 2IC** | Зам. командира секции | `Section2IC` | Section 2IC | 1: `Character_UK_1989_Regulars_Section2IC` | Rifle_L85A1_Attachments_SUSAT | override |
| **Section Commander** | Командир секции | `SectionCommander` | Section Commander | 1: `Character_UK_1989_Regulars_SectionCommander` | Rifle_L85A1_Attachments_SUSAT | override |
| **Section Commander (recce)** | Командир секции (разведка) | `SectionCommander_Recce` | Section Commander (Recce) | 1: `Character_UK_1989_Regulars_SectionCommander_Recce` | Rifle_L85A1_Attachments_SUSAT | override |
| **Sniper** | Снайпер | `Sniper` | Trained Sniper | 1: `Character_UK_1989_Regulars_Sniper` | Rifle_AI_L96A1_PM6x42 + Handgun_HiPower | stem |
| **Sniper (recce)** | Снайпер (разведка) | `Sniper_Recce` | Trained Sniper | 1: `Character_UK_1989_Regulars_Sniper_Recce` | Rifle_AI_L96A1_PM6x42 + Handgun_HiPower | override |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 1: `Character_UK_1989_Regulars_Spotter` | Rifle_L85A1_Attachments_SUSAT | stem |

#### 1989 Reservists (excluded by design) (**no registry group set**, 8 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Driver** | Водитель | `Driver` | Driver (Reservist) | 1: `Character_UK_1989_Reservists_Driver` | Rifle_L2A3_Sterling | override |
| **Engineer** | Инженер | `Engineer` | Reservist Engineer | 1: `Character_UK_1989_Reservists_Engineer` | Rifle_L2A3_Sterling + Mine_Mk7 | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Reservist (LAW 66) | 1: `Character_UK_1989_Reservist_LAT` | Rifle_L1A1_SLR_Plastic + Launcher_LAW66_L1A1 | stem |
| **Machine Gunner** | Пулеметчик | `LMG` | Reservist (LMG) | 1: `Character_UK_1989_Reservists_LMG` | MG_L4_LMG | stem |
| **Officer** | Офицер | `Officer` | Officer Cadet | 1: `Character_UK_1989_Reservist_Officer` | Rifle_L2A3_Sterling | stem |
| **Rifleman** | Стрелок | `Rifleman` | Reservist | 1: `Character_UK_1989_Reservists_Rifleman` | Rifle_L1A1_SLR_Plastic | stem |
| **Rifleman (recce)** | Стрелок (разведка) | `Rifleman_Recce` | Reservist (Recce) | 1: `Character_UK_1989_Reservists_Rifleman_Recce` | Rifle_L1A1_SLR_Plastic | override |
| **Section Commander** | Командир секции | `SectionCommander` | Reservist Section Commander | 1: `Character_UK_1989_Reservist_SectionCommander` | Rifle_L2A3_Sterling | override |

#### 1989 Special Forces (registry set `SF_1989`, 13 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank (Carl Gustav)** | Гранатометчик (Carl Gustav) | `CharlieG` | Special Forces Anti-Tank | 1: `Character_UK_1989_SpecialForces_CharlieG` | Rifle_AR15_715_OliveGreen_Solid + Launcher_84mm_MAW_Optic + Handgun_HiPower | override |
| **Grenadier** | Гранатометчик (ГП) | `GL` | Special Forces Grenadier | 1: `Character_UK_1989_SpecialForces_GL` | Rifle_AR15_M203_715_OliveGreen_Solid + Handgun_HiPower | stem |
| **Machine Gunner** | Пулеметчик | `LMG` | Special Forces Machine-Gunner | 1: `Character_UK_1989_SpecialForces_LMG` | MG_Minimi + Handgun_HiPower | stem |
| **Machine Gunner (GPMG)** | Пулеметчик (GPMG) | `GPMG` | Special Forces Machine-Gunner | 1: `Character_UK_1989_SpecialForces_GPMG` | MG_GPMG_L7A2 + Handgun_HiPower | override |
| **Medic** | Санитар | `Medic` | Special Forces Medic | 1: `Character_UK_1989_SpecialForces_Medic` | Rifle_CAR15_733_OliveGreen_Solid + Handgun_HiPower | stem |
| **Officer** | Офицер | `Officer` | Special Forces Officer | 1: `Character_UK_1989_SpecialForces_Officer` | Rifle_CAR15_733_OliveGreen_SandStripes + Launcher_LAW66_L1A1 + Handgun_HiPower | stem |
| **Radio Operator** | Радист | `RTO` | Special Forces Radio Operator | 1: `Character_UK_1989_SpecialForces_RTO` | Rifle_CAR15_733_OliveGreen_SandStripes + Launcher_LAW66_L1A1 + Handgun_HiPower | stem |
| **Rifleman** | Стрелок | `Trooper` | Special Forces Trooper | 1: `Character_UK_1989_SpecialForces_Trooper` | Rifle_AR15_715_OliveGreen_Solid + Launcher_LAW66_L1A1 + Handgun_HiPower | stem |
| **Saboteur** | Диверсант | `Saboteur` | Special Forces Saboteur | 1: `Character_UK_1989_SpecialForces_Saboteur` | Rifle_MP5SD3 + Welrod | override |
| **Sapper** | Сапер | `Sapper` | Special Forces Sapper | 1: `Character_UK_1989_SpecialForces_Sapper` | Rifle_CAR15_733_OliveGreen_Solid + Launcher_LAW66_L1A1 + Handgun_HiPower | stem |
| **Sniper** | Снайпер | `Sniper` | Special Forces PM Sniper | 1: `Character_UK_1989_SpecialForces_Sniper` | Rifle_AI_PM_SF_PM6x42 + Handgun_HiPower | stem |
| **Sniper (covert)** | Снайпер (скрытный) | `SniperCovert` | Special Forces PM Sniper (Covert) | 1: `Character_UK_1989_SpecialForces_SniperCovert` | Rifle_AI_PMSD_PM6x42 + Welrod | override |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader | 1: `Character_UK_1989_SpecialForces_SL` | Rifle_AR15_M203_715_OliveGreen_SandStripes + Welrod | stem |

### MEI — Middle East Insurgents (15 roles, 30 prefabs)

#### Insurgents (registry set `Insurgents`, 15 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 3: `Character_MEI_AT`, `Character_MEI_AT1`, `Character_MEI_AT2` | Rifle_AK74 + Launcher_RPG7_PGO7 | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR`, `ARifleman` | Automatic Rifleman | 6: `Character_MEI_AR`, `Character_MEI_AR2`, `Character_MEI_AR3`, `Character_MEI_ARifleman1`, `Character_MEI_ARifleman2`, `Character_MEI_ARifleman3` | MG_RPK74 | stem |
| **Bomb Maker** | Подрывник | `Bomb` | Bomb vest Warrior | 1: `Character_MEI_Bomb` | Rifle_AKS74U | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 1: `Character_MEI_CC` | Rifle_AKS74U | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_MEI_Crew` | Rifle_AKS74U | stem |
| **Grenadier** | Гренадер | `AG`, `GL` | Grenadier | 2: `Character_MEI_AG1`, `Character_MEI_GL` | Rifle_AK74N_GP25 | stem |
| **Leader** | Главарь | `Leader` | Officer | 1: `Character_MEI_Leader` | Rifle_AK74 | override |
| **Machine Gunner** | Пулеметчик | `LMG`, `MG` | Machine-Gunner | 4: `Character_MEI_LMG1`, `Character_MEI_LMG2`, `Character_MEI_MG`, `Character_MEI_MG2` | MG_PKM<br>MG_UK59 | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_MEI_Medic` | Rifle_VZ58V | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 5: `Character_MEI_Rifleman1`, `Character_MEI_Rifleman2`, `Character_MEI_Rifleman3`, `Character_MEI_Rifleman4`, `Character_MEI_Rifleman5` | Rifle_AK74<br>Rifle_VZ58V | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `Character_MEI_Sapper` | Rifle_AKS74U | stem |
| **Scout** | Разведчик | `Scout` | Scout | 1: `Character_MEI_Scout` | Rifle_VZ58V | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 1: `Character_MEI_Sharpshooter` | Rifle_SVD_PSO + Handgun_PM | stem |
| **Sniper** | Снайпер | `Sniper` | Sharpshooter | 1: `Character_MEI_Sniper` | Rifle_SVD_PSO | stem |
| **Suicide Bomber** | Смертник | `Bomber` | Vest Man | 1: `Character_MEI_Bomber` | Rifle_AKS74U | stem |

### PLASTICBANDIT — Bandits (11 roles, 20 prefabs)

#### Scavengers (registry set `Bandits`, 7 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Brute** | Громила | `Brute` | Brute | 1: `Character_PLASTICBANDIT_Scav_Brute` | Rifle_AK74N_GP25 + Handgun_PM | override |
| **Chad** | Чад | `Chad` | Chad | 3: `Character_PLASTICBANDIT_Scav_Chad`, `Character_PLASTICBANDIT_Scav_Chad_2`, `Character_PLASTICBANDIT_Scav_Chad_3` | Rifle_M16A2_carbine_AP2k + Handgun_M9<br>Rifle_M16A2_carbine_OliveGreen_Sand_Stripes + Handgun_M9<br>Rifle_VZ58V + Handgun_M9 | override |
| **Gopnik** | Гопник | `Gopnik` | Gopnik | 2: `Character_PLASTICBANDIT_Scav_Gopnik`, `Character_PLASTICBANDIT_Scav_Gopnik_2` | Handgun_PM<br>Rifle_M21 + Handgun_PM | override |
| **Gunner** | Пулеметчик | `Gunner` | Gunner | 1: `Character_PLASTICBANDIT_Scav_Gunner` | MG_PKM + Handgun_PM | override |
| **Rookie** | Новичок | `Rookie` | Scav | 2: `Character_PLASTICBANDIT_Scav_Rookie`, `Character_PLASTICBANDIT_Scav_Rookie_2` | Handgun_PM<br>Rifle_AKS74U_Bandit + Handgun_PM | override |
| **RPG Gunner** | Гранатометчик (РПГ) | `RPG` | Rocketeer | 1: `Character_PLASTICBANDIT_Scav_RPG` | Launcher_RPG7 + Handgun_PM | override |
| **Veteran** | Ветеран | `Veteran` | Scav | 2: `Character_PLASTICBANDIT_Scav_Veteran`, `Character_PLASTICBANDIT_Scav_Veteran_2` | Rifle_AK74 + Handgun_PM<br>Rifle_AKS74U_Bandit + Handgun_PM | override |

#### Stalkers (registry set `Bandits`, 4 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Legend** | Легенда | `Legend` | Veteran | 3: `Character_PLASTICBANDIT_Stalker_Legend`, `Character_PLASTICBANDIT_Stalker_Legend_2`, `Character_PLASTICBANDIT_Stalker_Legend_3` | Rifle_SVD + Handgun_PM | override |
| **Rookie** | Новичок | `Rookie` | Rookie | 2: `Character_PLASTICBANDIT_Stalker_Rookie`, `Character_PLASTICBANDIT_Stalker_Rookie_2` | Handgun_PM<br>Rifle_AKS74U_Bandit + Handgun_PM | override |
| **Veteran** | Ветеран | `Veteran` | Rookie | 2: `Character_PLASTICBANDIT_Stalker_Veteran`, `Character_PLASTICBANDIT_Stalker_Veteran_2` | Rifle_AK74N_1P29 + Handgun_PM<br>Rifle_AKS74U_Bandit + Handgun_PM | override |
| **Wraith** | Призрак | `Shadow` | Wraith | 1: `Character_PLASTICBANDIT_Stalker_Shadow` | Rifle_M21_ARTII_OliveGreen_Sand_Stripes_Wrapped + Handgun_PM | override |

### SFS_US — US Special Force Squad (Abrashka) (13 roles, 13 prefabs)

#### Special Force Squad (registry set `SFS`, 13 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Light AT Rifleman | 1: `Character_US_AT` | Rifle_M4_Variant_URGI + Launcher_MK153mod2 + Spec Series | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_US_Crew` | Rifle_M4_Variant_URGI + Spec Series | stem |
| **Grenadier** | Гранатометчик (ГП) | `GP` | Special Forces Grenadier | 1: `Character_US_GP` | Rifle_M4_Variant_Block2_UGL + GL_GM94_camo + Spec Series | stem |
| **Helicopter Pilot** | Пилот вертолета | `Pilot` | Helicopter Pilot | 1: `Character_US_Pilot` | Rifle_M4_Variant_URGI + Spec Series | stem |
| **Light Anti-Tank** | ПТ стрелок | `LightAT` | Light AT Rifleman | 1: `Character_US_LightAT` | Rifle_M4_Variant_URGI + Launcher_M72A3 + Spec Series | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_US_MG` | Mk48 Tan + Spec Series | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_US_Medic` | Rifle_M4_Variant_URGI + Spec Series | stem |
| **Platoon Leader** | Командир взвода | `PL` | Officer | 1: `Character_US_PL` | Rifle_M4_Variant_Block2_UGL + Spec Series | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_US_Rifleman` | Rifle_M4_Variant_URGI + Spec Series | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `Character_US_Sapper` | Rifle_M4_Variant_URGI + Spec Series | stem |
| **Sniper** | Снайпер | `Sniper` | Sniper | 1: `Character_US_Sniper` | Rifle_M40A5_UPD + Spec Series | stem |
| **Squad Leader** | Командир отделения | `SL` | Special Forces Squad Leader | 1: `Character_US_SL` | Rifle_M4_Variant_Block2_UGL + Spec Series | stem |
| **Team Leader** | Командир группы | `FTL` | Team Leader | 1: `Character_US_FTL` | Rifle_M4_Variant_Block2_UGL + Spec Series | stem |

### SFS_USSR — RF Special Force Squad (Abrashka) (13 roles, 13 prefabs)

#### Special Force Squad (registry set `SFS`, 13 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 1: `Character_RF_AT` | 105AK + Launcher_RPG7_pgo7 + Handgun_PM | stem |
| **Crewman** | Экипаж | `Crew` | Crewman | 1: `Character_RF_Crew` | 105AK + Handgun_PM | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 1: `Character_RF_GL` | Rifle_AK74M_GP25 + GL_GM94_camo + Handgun_PM | stem |
| **Helicopter Pilot** | Пилот вертолета | `Pilot` | Helicopter Pilot | 1: `Character_RF_Pilot` | 105AK + Handgun_PM | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Anti-Tank Specialist | 1: `Character_RF_LAT` | 105AK + Launcher_RPOD + Handgun_PM | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_RF_MG` | MG_PKP_B_base_MUFFISBEST_G + Handgun_PM | stem |
| **Medic** | Санитар | `Medic` | Special Forces Medic | 1: `Character_RF_Medic` | 105AK + Handgun_PM | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `Character_RF_PL` | Rifle_AK74M_GP25 + Handgun_PM | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_RF_Rifleman` | 105AK + Handgun_PM | stem |
| **Sapper** | Сапер | `Sapper` | Rifleman | 1: `Character_RF_Sapper` | 105AK + Handgun_PM | stem |
| **Sniper** | Снайпер | `Sniper` | Special Forces Sharpshooter | 1: `Character_RF_Sniper` | Rifle_ORSIS_T5000_Forest + Handgun_PM | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_RF_SL` | Rifle_AK74M_GP25 + Handgun_PM | stem |
| **Team Leader** | Командир группы | `FTL` | Team Leader | 1: `Character_RF_FTL` | Rifle_AK74M_GP25 + Handgun_PM | stem |

### SFS_FIA — FIA Special Force Squad (Abrashka) (13 roles, 13 prefabs)

#### Special Force Squad (registry set `SFS`, 13 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 1: `Character_FIA_AT` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Launcher_RPG7_pgo7 + Handgun_APS | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 1: `Character_FIA_Crew` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Grenadier** | Гранатометчик (ГП) | `GL` | EditableEntity_Character_Grenadier | 1: `Character_FIA_GL` | Rifle_AK74M_b10m_b19n_npz_rail_perst_Eot_gp25 + Handgun_APS | stem |
| **Helicopter Pilot** | Пилот вертолета | `Pilot` | Helicopter Pilot | 1: `Character_FIA_Pilot` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 1: `Character_FIA_LAT` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Launcher_RPOA + Handgun_APS | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `Character_FIA_MG` | MG_PKM_B51_1p86 + Handgun_APS | stem |
| **Medic** | Врач | `Medic` | Medic | 1: `Character_FIA_Medic` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `Character_FIA_PL` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `Character_FIA_Rifleman` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `Character_FIA_Sapper` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Sniper** | Снайпер | `Sniper` | Sharpshooter | 1: `Character_FIA_Sniper` | Rifle_SVD_1P21_TGPV + Handgun_APS | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `Character_FIA_SL` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |
| **Team Leader** | Командир группы | `FTL` | Team Leader | 1: `Character_FIA_FTL` | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa + Handgun_APS | stem |

### Ses_CDF — CDF — Chernarussian Defence Forces (25 roles, 76 prefabs)

#### CDF (registry set `CDF_Army`, 25 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 4: `Character_CDF_Ammo`, `Character_CDF_Ammo_2`, `Character_CDF_Ammo_3`, `Character_CDF_Ammo_4` | Rifle_AK74N_RHSMag | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 4: `Character_CDF_AT`, `Character_CDF_AT_2`, `Character_CDF_AT_3`, `Character_CDF_AT_4` | Rifle_AK74_RHSmag + Launcher_RPG7_pgo7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 4: `Character_CDF_AAT`, `Character_CDF_AAT_2`, `Character_CDF_AAT_3`, `Character_CDF_AAT_4` | Rifle_AK74_RHSmag | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 4: `Character_CDF_AMG`, `Character_CDF_AMG_2`, `Character_CDF_AMG_3`, `Character_CDF_AMG_4` | Rifle_AK74N_RHSMag | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 4: `Character_CDF_AR`, `Character_CDF_AR_2`, `Character_CDF_AR_3`, `Character_CDF_AR_4` | MG_RPK74N<br>MG_RPK74N_1P29<br>MG_RPK74N_ses_P | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 2: `Character_CDF_CC`, `Character_CDF_CC_2` | Rifle_AKS74U_RHSMag | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 2: `Character_CDF_Crew`, `Character_CDF_Crew_2` | Rifle_AKS74U_RHSMag | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 4: `Character_CDF_GL`, `Character_CDF_GL_2`, `Character_CDF_GL_3`, `Character_CDF_GL_4` | Rifle_AK74_GP25_RHSmag<br>Rifle_AK74_GP25_RHSmag_Rail_Aimpoint | stem |
| **Helicopter Crew** | Экипаж вертолета | `HeliCrew` | Helicopter Crew | 1: `Character_CDF_HeliCrew` | Handgun_PM | stem |
| **Helicopter Pilot** | Пилот вертолета | `HeliPilot` | Helicopter Pilot | 1: `Character_CDF_HeliPilot` | Handgun_PM | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 4: `Character_CDF_LAT`, `Character_CDF_LAT_2`, `Character_CDF_LAT_3`, `Character_CDF_LAT_4` | Rifle_AK74N_RHSMag + Launcher_RPG75<br>Rifle_AK74N_Rail_Aimpoint + Launcher_RPG75 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 4: `Character_CDF_MG`, `Character_CDF_MG_2`, `Character_CDF_MG_3`, `Character_CDF_MG_4` | MG_PKMN_1P29 + Handgun_PM<br>MG_PKMN + Handgun_PM<br>MG_PKM + Handgun_PM | stem |
| **Medic** | Врач | `Medic` | Medic | 3: `Character_CDF_Medic`, `Character_CDF_Medic_2`, `Character_CDF_Medic_3` | Rifle_AKS74U_RHSMag | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_CDF_Officer` | Handgun_PM | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 2: `Character_CDF_PL`, `Character_CDF_PL_2` | Rifle_AK74N_RHSMag + Handgun_PM | stem |
| **Platoon Sergeant** | Взводный сержант | `Sergeant` | Platoon Sergeant | 2: `Character_CDF_Sergeant`, `Character_CDF_Sergeant_2` | Rifle_AK74N_RHSMag | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 3: `Character_CDF_RTO`, `Character_CDF_RTO_2`, `Character_CDF_RTO_3` | Rifle_AK74_RHSmag | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 5: `Character_CDF_Rifleman`, `Character_CDF_Rifleman2`, `Character_CDF_Rifleman_2`, `Character_CDF_Rifleman_3`, `Character_CDF_Rifleman_4` | Rifle_AK74_RHSmag<br>Rifle_AK74N_Rail_Aimpoint | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 4: `Character_CDF_Sapper`, `Character_CDF_Sapper_2`, `Character_CDF_Sapper_3`, `Character_CDF_Sapper_4` | Rifle_AK74_RHSmag<br>Rifle_AK74N_Rail_Aimpoint | stem |
| **Scout** | Разведчик | `Scout` | Scout | 2: `Character_CDF_Scout`, `Character_CDF_Scout_S` | Rifle_AK74N_Rail_ACOG<br>Rifle_AK74N_Rail_S_Aimpoint | stem |
| **Scout Radio Operator** | Радист-разведчик | `Scout_RTO` | Scout Radio Operator | 2: `Character_CDF_Scout_RTO`, `Character_CDF_Scout_RTO_S` | Rifle_AK74N_Rail_ACOG<br>Rifle_AK74N_Rail_S_Aimpoint | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 4: `Character_CDF_SR`, `Character_CDF_SR_2`, `Character_CDF_SR_3`, `Character_CDF_SR_4` | Rifle_AK74N_Rail_ACOG + Handgun_PM | stem |
| **Sniper** | Снайпер | `Sniper` | Sharpshooter | 2: `Character_CDF_Sniper`, `Character_CDF_Sniper_2` | Rifle_SVD_PSO | stem |
| **Spotter** | Корректировщик огня | `Spotter` | Spotter | 4: `Character_CDF_Spotter`, `Character_CDF_Spotter_2`, `Character_CDF_Spotter_3`, `Character_CDF_Spotter_4` | Rifle_AK74_GP25_RHSmag | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 4: `Character_CDF_SL`, `Character_CDF_SL_2`, `Character_CDF_SL_3`, `Character_CDF_SL_4` | Rifle_AK74N_Rail_SU230_Ses_CDF | stem |

### Ses_ChDKZ — ChDKZ — Chedaki Insurgents (20 roles, 95 prefabs)

#### ChDKZ (registry set `ChDKZ`, 20 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 5: `Character_ChDKZ_Ammo`, `Character_ChDKZ_Ammo_2`, `Character_ChDKZ_Ammo_3`, `Character_ChDKZ_Ammo_4`, `Character_ChDKZ_Ammo_5` | Rifle_AKM_SteelMag<br>Rifle_AK74_RHSMag | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 5: `Character_ChDKZ_AT`, `Character_ChDKZ_AT_2`, `Character_ChDKZ_AT_3`, `Character_ChDKZ_AT_4`, `Character_ChDKZ_AT_5` | Rifle_AKM_SteelMag + Launcher_RPG7<br>Rifle_AK74_RHSMag + Launcher_RPG7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 5: `Character_ChDKZ_AAT`, `Character_ChDKZ_AAT_2`, `Character_ChDKZ_AAT_3`, `Character_ChDKZ_AAT_4`, `Character_ChDKZ_AAT_5` | Rifle_AKM_SteelMag<br>Rifle_AK74_RHSMag | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 5: `Character_ChDKZ_AMG`, `Character_ChDKZ_AMG_2`, `Character_ChDKZ_AMG_3`, `Character_ChDKZ_AMG_4`, `Character_ChDKZ_AMG_5` | Rifle_AKM_SteelMag<br>Rifle_AK74_RHSMag | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 5: `Character_ChDKZ_AR`, `Character_ChDKZ_AR_2`, `Character_ChDKZ_AR_3`, `Character_ChDKZ_AR_4`, `Character_ChDKZ_AR_5` | MG_RPK74N_ses<br>MG_RPK74<br>MG_RPK74N | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 3: `Character_ChDKZ_CC`, `Character_ChDKZ_CC_2`, `Character_ChDKZ_CC_3` | Rifle_AKS74U_RHSMag | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 3: `Character_ChDKZ_Crew`, `Character_ChDKZ_Crew_2`, `Character_ChDKZ_Crew_3` | Rifle_AKS74U_RHSMag | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 5: `Character_ChDKZ_GL`, `Character_ChDKZ_GL_2`, `Character_ChDKZ_GL_3`, `Character_ChDKZ_GL_4`, `Character_ChDKZ_GL_5` | Rifle_AKM_GP25_SteelMag<br>Rifle_AK74_GP25_RHSmag | stem |
| **Insurgent** | Повстанец | `Insurgent`, `Insurgent_PM` | Guerrilla | 5: `Character_ChDKZ_Insurgent`, `Character_ChDKZ_Insurgent_2`, `Character_ChDKZ_Insurgent_3`, `Character_ChDKZ_Insurgent_4`, `Character_ChDKZ_Insurgent_PM` | Rifle_AKS74U_RHSMag<br>Rifle_AKM_SteelMag<br>Rifle_AK74N_RHSMag<br>Handgun_PM | override |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 5: `Character_ChDKZ_LAT`, `Character_ChDKZ_LAT_2`, `Character_ChDKZ_LAT_3`, `Character_ChDKZ_LAT_4`, `Character_ChDKZ_LAT_5` | Rifle_AKM_SteelMag + Launcher_RPG22<br>Rifle_AK74N_RHSMag + Launcher_RPG22<br>Rifle_AK74_RHSmag + Launcher_RPG22<br>Rifle_AKMN_SteelMag + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 5: `Character_ChDKZ_MG`, `Character_ChDKZ_MG_2`, `Character_ChDKZ_MG_3`, `Character_ChDKZ_MG_4`, `Character_ChDKZ_MG_5` | MG_PKM<br>MG_PKMN | stem |
| **Medic** | Врач | `Medic` | Medic | 5: `Character_ChDKZ_Medic`, `Character_ChDKZ_Medic_2`, `Character_ChDKZ_Medic_3`, `Character_ChDKZ_Medic_4`, `Character_ChDKZ_Medic_5` | Rifle_AKS74U_RHSMag<br>Rifle_AK74_RHSmag<br>Rifle_AKMN_SteelMag<br>Rifle_AKM_SteelMag | stem |
| **Officer** | Офицер | `Officer` | Officer | 1: `Character_ChDKZ_Officer` | Handgun_PM | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 5: `Character_ChDKZ_PL`, `Character_ChDKZ_PL_2`, `Character_ChDKZ_PL_3`, `Character_ChDKZ_PL_4`, `Character_ChDKZ_PL_5` | Rifle_AK74M<br>Rifle_AK74M_1P63 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 5: `Character_ChDKZ_RTO`, `Character_ChDKZ_RTO_2`, `Character_ChDKZ_RTO_3`, `Character_ChDKZ_RTO_4`, `Character_ChDKZ_RTO_5` | Rifle_AKM_SteelMag<br>Rifle_AK74_RHSmag | stem |
| **Rifleman** | Стрелок | `Rifleman`, `Rifleman_Armor` | Rifleman | 10: `Character_ChDKZ_Rifleman`, `Character_ChDKZ_Rifleman_2`, `Character_ChDKZ_Rifleman_3`, `Character_ChDKZ_Rifleman_4`, `Character_ChDKZ_Rifleman_5`, `Character_ChDKZ_Rifleman_Armor`, `Character_ChDKZ_Rifleman_Armor_2`, `Character_ChDKZ_Rifleman_Armor_3`, `Character_ChDKZ_Rifleman_Armor_4`, `Character_ChDKZ_Rifleman_Armor_5` | Rifle_AKM_SteelMag<br>Rifle_AK74_RHSmag<br>Rifle_AKMN_SteelMag<br>Rifle_AKS74U_RHSMag | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 5: `Character_ChDKZ_Sapper`, `Character_ChDKZ_Sapper_2`, `Character_ChDKZ_Sapper_3`, `Character_ChDKZ_Sapper_4`, `Character_ChDKZ_Sapper_5` | Rifle_AKM_SteelMag<br>Rifle_AK74_RHSmag<br>Rifle_AKS74U_RHSMag<br>Rifle_AKMN_SteelMag | stem |
| **Senior Rifleman** | Старший стрелок | `SR` | Senior Rifleman | 5: `Character_ChDKZ_SR`, `Character_ChDKZ_SR_2`, `Character_ChDKZ_SR_3`, `Character_ChDKZ_SR_4`, `Character_ChDKZ_SR_5` | Rifle_AK74N_1P29_RHSMag<br>Rifle_AK74M_1P29_RHSMag<br>Rifle_AK74N_1P78_RHSMag<br>Rifle_AK74M_1P78_PlumMag<br>Rifle_AKMN_1P29_SteelMag | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 3: `Character_ChDKZ_Sharpshooter`, `Character_ChDKZ_Sharpshooter_2`, `Character_ChDKZ_Sharpshooter_3` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 5: `Character_ChDKZ_SL`, `Character_ChDKZ_SL_2`, `Character_ChDKZ_SL_3`, `Character_ChDKZ_SL_4`, `Character_ChDKZ_SL_5` | Rifle_AK74M_GP25<br>Rifle_AKMN_GP25_SteelMag | stem |

### Ses_NAPA — NAPA — Chernarussian Guerrillas (18 roles, 83 prefabs)

#### NAPA (registry set `NAPA`, 18 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 4: `Character_NAPA_Ammo`, `Character_NAPA_Ammo_2`, `Character_NAPA_Ammo_3`, `Character_NAPA_Ammo_4` | Rifle_VZ58P | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | Anti-Tank Specialist | 4: `Character_NAPA_AT`, `Character_NAPA_AT_2`, `Character_NAPA_AT_3`, `Character_NAPA_AT_4` | Rifle_VZ58V_Ball + Launcher_RPG7 | stem |
| **Assistant Anti-Tank** | Помощник гранатометчика | `AAT` | Anti-Tank Specialist Assistant | 4: `Character_NAPA_AAT`, `Character_NAPA_AAT_2`, `Character_NAPA_AAT_3`, `Character_NAPA_AAT_4` | Rifle_VZ58P | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG`, `AMG_PKM` | Machine-Gunner Assistant | 8: `Character_NAPA_AMG`, `Character_NAPA_AMG_2`, `Character_NAPA_AMG_3`, `Character_NAPA_AMG_4`, `Character_NAPA_AMG_PKM`, `Character_NAPA_AMG_PKM_2`, `Character_NAPA_AMG_PKM_3`, `Character_NAPA_AMG_PKM_4` | Rifle_VZ58P | stem |
| **Automatic Rifleman** | Стрелок-пулеметчик | `AR` | Automatic Rifleman | 4: `Character_NAPA_AR`, `Character_NAPA_AR_2`, `Character_NAPA_AR_3`, `Character_NAPA_AR_4` | MG_RPK74N_ses<br>MG_RPK74 | stem |
| **Crew Commander** | Командир экипажа | `CC` | Crew Commander | 2: `Character_NAPA_CC`, `Character_NAPA_CC_2` | Rifle_AKS74U_RHSMag | stem |
| **Crewman** | Член экипажа | `Crew` | Crewman | 2: `Character_NAPA_Crew`, `Character_NAPA_Crew_2` | Rifle_AKS74U_RHSMag | stem |
| **Grenadier** | Гренадер | `GL` | Grenadier | 4: `Character_NAPA_GL`, `Character_NAPA_GL_2`, `Character_NAPA_GL_3`, `Character_NAPA_GL_4` | Rifle_AK74_GP25_RHSmag | stem |
| **Light Anti-Tank** | ПТ стрелок | `LAT` | Light AT Rifleman | 4: `Character_NAPA_LAT`, `Character_NAPA_LAT_2`, `Character_NAPA_LAT_3`, `Character_NAPA_LAT_4` | Rifle_VZ58V_Ball + Launcher_RPG75<br>Rifle_VZ58V_Ball + Launcher_RPG22 | stem |
| **Machine Gunner** | Пулеметчик | `MG`, `MG_UK` | Machine-Gunner | 8: `Character_NAPA_MG`, `Character_NAPA_MG_2`, `Character_NAPA_MG_3`, `Character_NAPA_MG_4`, `Character_NAPA_MG_UK`, `Character_NAPA_MG_UK_2`, `Character_NAPA_MG_UK_3`, `Character_NAPA_MG_UK_4` | MG_PKM<br>MG_UK59 | stem |
| **Medic** | Врач | `Medic` | Medic | 4: `Character_NAPA_Medic`, `Character_NAPA_Medic_2`, `Character_NAPA_Medic_3`, `Character_NAPA_Medic_4` | Rifle_VZ58V_Ball | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 4: `Character_NAPA_PL`, `Character_NAPA_PL_2`, `Character_NAPA_PL_3`, `Character_NAPA_PL_4` | Rifle_AKS74U_RHSMag | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 4: `Character_NAPA_RTO`, `Character_NAPA_RTO_2`, `Character_NAPA_RTO_3`, `Character_NAPA_RTO_4` | Rifle_AKS74U_RHSMag | stem |
| **Rifleman** | Стрелок | `Rifleman_AK74`, `Rifleman_AKSU`, `Rifleman_VZ` | Rifleman | 12: `Character_NAPA_Rifleman_AK74`, `Character_NAPA_Rifleman_AK74_2`, `Character_NAPA_Rifleman_AK74_3`, `Character_NAPA_Rifleman_AK74_4`, `Character_NAPA_Rifleman_AKSU`, `Character_NAPA_Rifleman_AKSU_2`, `Character_NAPA_Rifleman_AKSU_3`, `Character_NAPA_Rifleman_AKSU_4`, `Character_NAPA_Rifleman_VZ`, `Character_NAPA_Rifleman_VZ_2`, `Character_NAPA_Rifleman_VZ_3`, `Character_NAPA_Rifleman_VZ_4` | Rifle_AK74_RHSmag<br>Rifle_AKS74U_RHSMag<br>Rifle_VZ58P_Ball | override |
| **Sapper** | Сапер | `Sapper` | Sapper | 4: `Character_NAPA_Sapper`, `Character_NAPA_Sapper_2`, `Character_NAPA_Sapper_3`, `Character_NAPA_Sapper_4` | Rifle_VZ58V_Ball | stem |
| **Scout** | Разведчик | `Scout` | Scout | 4: `Character_NAPA_Scout`, `Character_NAPA_Scout_2`, `Character_NAPA_Scout_3`, `Character_NAPA_Scout_4` | Rifle_VZ58V | stem |
| **Sharpshooter** | Пехотный снайпер | `Sharpshooter` | Sharpshooter | 3: `Character_NAPA_Sharpshooter`, `Character_NAPA_Sharpshooter_2`, `Character_NAPA_Sharpshooter_3` | Rifle_SVD_PSO | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 4: `Character_NAPA_SL`, `Character_NAPA_SL_2`, `Character_NAPA_SL_3`, `Character_NAPA_SL_4` | Rifle_AKS74U_RHSMag | stem |

### BWAR — Bundeswehr (32 roles, 32 prefabs)

#### Flecktarn (registry set `Flecktarn`, 16 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 1: `BWAR_Character_Ammo` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | AT Riflemen | 1: `BWAR_Character_AT` | BWAR_Rifle_G36A3_ZO4x30 + BWAR_Launcher_PzF3 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `BWAR_Character_AMG` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Engineer** | Инженер | `Engineer` | Engineer | 1: `BWAR_Character_Engineer` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Grenadier** | Гранатометчик (ГП) | `Grenadier` | Grenadier | 1: `BWAR_Character_Grenadier` | BWAR_Rifle_G36A3_AG40_ZO4x30 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `BWAR_Character_MG` | BWAR_MG_MG5A2_ZO4x30i | stem |
| **Medic** | Санитар | `Medic` | Medic | 1: `BWAR_Character_Medic` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `BWAR_Character_PL` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Platoon Sergeant** | Зам. командира взвода | `Sergeant` | Sergeant | 1: `BWAR_Character_Sergeant` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `BWAR_Character_RTO` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `BWAR_Character_Rifleman` | BWAR_Handgun_P8A1 + BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `BWAR_Character_Sapper` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 1: `BWAR_Character_Scout` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Sharpshooter** | Марксман | `Marksman` | Marksman | 1: `BWAR_Character_Marksman` | BWAR_DMR_G28_PMII | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `BWAR_Character_SL` | BWAR_Rifle_G36A3_AG40_ZO4x30 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 1: `BWAR_Character_TL` | BWAR_Rifle_G36A3_ZO4x30 | stem |

#### Tropentarn (registry set `Tropentarn`, 16 roles)

| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |
|---|---|---|---|---|---|---|
| **Ammo Bearer** | Подносчик боеприпасов | `Ammo` | Ammunition Bearer | 1: `BWAR_Character_Ammo_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Anti-Tank** | Гранатометчик (РПГ) | `AT` | AT Riflemen | 1: `BWAR_Character_AT_3FT` | BWAR_Rifle_G36A3_ZO4x30 + BWAR_Launcher_PzF3 | stem |
| **Assistant Machine Gunner** | Помощник пулеметчика | `AMG` | Machine-Gunner Assistant | 1: `BWAR_Character_AMG_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Engineer** | Инженер | `Engineer` | Engineer | 1: `BWAR_Character_Engineer_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Grenadier** | Гранатометчик (ГП) | `Grenadier` | Grenadier | 1: `BWAR_Character_Grenadier_3FT` | BWAR_Rifle_G36A3_AG40_ZO4x30 | stem |
| **Machine Gunner** | Пулеметчик | `MG` | Machine-Gunner | 1: `BWAR_Character_MG_3FT` | BWAR_MG_MG5A2_ZO4x30i | stem |
| **Medic** | Санитар | `Medic` | Medic | 1: `BWAR_Character_Medic_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Platoon Leader** | Командир взвода | `PL` | Platoon Leader | 1: `BWAR_Character_PL_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Platoon Sergeant** | Зам. командира взвода | `Sergeant` | Sergeant | 1: `BWAR_Character_Sergeant_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Radio Operator** | Радист | `RTO` | Combat Signaler | 1: `BWAR_Character_RTO_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Rifleman** | Стрелок | `Rifleman` | Rifleman | 1: `BWAR_Character_Rifleman_3FT` | BWAR_Handgun_P8A1 + BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Sapper** | Сапер | `Sapper` | Sapper | 1: `BWAR_Character_Sapper_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Scout** | Разведчик | `Scout` | Scout | 1: `BWAR_Character_Scout_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |
| **Sharpshooter** | Марксман | `Marksman` | Marksman | 1: `BWAR_Character_Marksman_3FT` | BWAR_DMR_G28_PMII | stem |
| **Squad Leader** | Командир отделения | `SL` | Squad Leader | 1: `BWAR_Character_SL_3FT` | BWAR_Rifle_G36A3_AG40_ZO4x30 | stem |
| **Team Leader** | Командир группы | `TL` | Team Leader | 1: `BWAR_Character_TL_3FT` | BWAR_Rifle_G36A3_ZO4x30 | stem |

### Excluded prefabs (43)

| Faction | Prefab | Reason |
|---|---|---|
| US | `Character_US_Unarmed.et` | unarmed |
| USSR | `Character_USSR_AKOfficer.et` | no GUID source |
| USSR | `Character_USSR_Unarmed.et` | unarmed |
| USSR | `Character_USSR_Unarmed_KLMK.et` | unarmed |
| USSR | `Character_USSR_NI_Unarmed.et` | unarmed |
| FIA | `Character_FIA_Unarmed.et` | unarmed |
| RHS_USAF | `Character_RHS_USAF_FORECON_PL.et` | no GUID source |
| RHS_USAF | `Character_RHS_USAF_FORECON_TL_Marksman.et` | no GUID source |
| RHS_USAF | `Character_RHS_USAF_FORECON_Unarmed.et` | no GUID source |
| RHS_USAF | `Character_RHS_USAF_USMC_Unarmed.et` | unarmed |
| RHS_USAF | `Character_RHS_USAF_USMC_D_Unarmed.et` | unarmed |
| RHS_AFRF | `Character_RHS_RF_MSV_Flora_Unarmed.et` | unarmed |
| RHS_AFRF | `Character_RHS_RF_MSV_VKPO_3.0_CC.et` | no GUID source |
| RHS_AFRF | `Character_RHS_RF_MSV_VKPO_3.0_Officer.et` | no GUID source |
| RHS_AFRF | `Character_RHS_RF_MSV_VKPO_DS_CC.et` | no GUID source |
| RHS_AFRF | `Character_RHS_RF_MSV_VKPO_DS_Unarmed.et` | unarmed |
| RHS_AFRF | `Character_RHS_RF_MSV_VKPO_S_CC.et` | no GUID source |
| RHS_AFRF | `Character_RHS_RF_MSV_VKPO_S_Unarmed.et` | unarmed |
| RHS_AFRF | `Character_RHS_RF_MSV_VSR_Unarmed.et` | unarmed |
| RHS_AFRF | `Character_RHS_RF_SOF_GM94.et` | author-flagged "DONT USE ME" |
| RHS_AFRF | `Character_RHS_RF_SOF_GM94Belt.et` | author-flagged "DONT USE ME" |
| RHS_AFRF | `Character_RHS_RF_SOF_Sniper.et` | no GUID source |
| UK | `Character_UK_1983_SF_Sniper.et` | no GUID source |
| UK | `Character_UK_1983_SF_Spotter.et` | no GUID source |
| UK | `Character_UK_Patrol_Gunner.et` | no GUID source |
| UK | `Character_UK_Patrol_Leader.et` | no GUID source |
| UK | `Character_UK_Patrol_Signals.et` | no GUID source |
| UK | `Character_UK_Patrol_Trooper.et` | no GUID source |
| UK | `Character_UK_Unarmed.et` | unarmed |
| MEI | `Character_MEI_HeliCrew.et` | unarmed |
| MEI | `Character_MEI_HeliPilot.et` | unarmed |
| Ses_CDF | `Character_CDF_Sharpshooter.et` | does not ship |
| Ses_CDF | `Character_CDF_Unarmed.et` | unarmed |
| Ses_CDF | `Character_CDF_Unarmed_2.et` | unarmed |
| Ses_ChDKZ | `Character_ChDKZ_Rifleman2.et` | does not ship |
| Ses_ChDKZ | `Character_ChDKZ_Rifleman3.et` | does not ship |
| Ses_ChDKZ | `Character_ChDKZ_Unarmed.et` | unarmed |
| Ses_ChDKZ | `Character_ChDKZ_Unarmed_2.et` | unarmed |
| Ses_ChDKZ | `Character_ChDKZ_Unarmed_3.et` | unarmed |
| Ses_ChDKZ | `Character_ChDKZ_Unarmed_4.et` | unarmed |
| Ses_ChDKZ | `Character_ChDKZ_Unarmed_5.et` | unarmed |
| BWAR | `BWAR_Character_Officer.et` | unarmed |
| BWAR | `BWAR_Character_Officer_3FT.et` | unarmed |

## Groups

### US — US (20 groups)

#### US Army (`US_Army`, 15 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 9 | large, defense | Rifle Squad | `Group_US_RifleSquad` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `Group_US_AmmoTeam` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_US_FireTeam` | stem |
| **Fire Team (guard)** | Огневая группа (охрана) | 4 | medium | Fire Team | `Group_US_FireTeam_Guard` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | medium | Grenadier Team | `Group_US_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `Group_US_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_US_LightFireTeam` | stem |
| **Platoon HQ** | Штаб взвода | 4 | medium | Platoon HQ | `Group_US_PlatoonHQ` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Base of Fire Team | `Group_US_Team_Suppress` | stem |
| **Engineer Team** | Инженерная группа | 2 | small | #AR-Group_EngineerTeam | `Group_US_EngineerTeam` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_US_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_US_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_US_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_US_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_US_SentryTeam` | stem |

#### Green Berets (`GreenBerets`, 2 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Squad** | Отделение | 6 | medium, large, defense | Special Forces Squad | `Group_US_GreenBeret_Squad` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Special Forces Team | `Group_US_GreenBeret_SentryTeam` | stem |

#### Green Berets (suppressed) (`GreenBerets_Suppressed`, 3 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Recon Squad** | Разведывательное отделение | 6 | medium, large, defense | Special Forces Recon Squad | `Group_US_GreenBeret_ReconSquad` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Special Forces Recon Team | `Group_US_GreenBeret_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | sentry | Special Forces Team | `Group_US_GreenBeret_SentryTeam` | stem |

### USSR — USSR (50 groups)

#### USSR Army (`USSR_Army`, 16 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_USSR_RifleSquad` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_USSR_PlatoonHQ` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `Group_USSR_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | medium | Anti-Tank Team | `Group_USSR_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_USSR_FireGroup` | stem |
| **Fire Team (guard)** | Огневая группа (охрана) | 4 | medium | Fire Team | `Group_USSR_FireGroup_Guard` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | medium | Grenadier Team | `Group_USSR_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `Group_USSR_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_USSR_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Base of Fire Team | `Group_USSR_Team_Suppress` | stem |
| **Engineer Team** | Инженерная группа | 2 | small | #AR-Group_EngineerTeam | `Group_USSR_EngineerTeam` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_USSR_MachineGunTeam` | stem |
| **Maneuver Group** | Маневренная группа | 2 | small | Maneuver Team | `Group_USSR_ManeuverGroup` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_USSR_MedicalSection` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_USSR_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_USSR_SentryTeam` | stem |

#### USSR (KLMK) (`KLMK`, 15 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_USSR_RifleSquad_KLMK` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_USSR_PlatoonHQ_KLMK` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `Group_USSR_AmmoTeam_KLMK` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | medium | Anti-Tank Team | `Group_USSR_Team_AT_KLMK` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_USSR_FireGroup_KLMK` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | medium | Grenadier Team | `Group_USSR_Team_GL_KLMK` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `Group_USSR_Team_LAT_KLMK` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_USSR_LightFireTeam_KLMK` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Base of Fire Team | `Group_USSR_Team_Suppress_KLMK` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_USSR_MachineGunTeam_KLMK` | stem |
| **Maneuver Group** | Маневренная группа | 2 | small | Maneuver Team | `Group_USSR_ManeuverGroup_KLMK` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_USSR_MedicalSection_KLMK` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_USSR_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_USSR_SapperTeam_KLMK` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_USSR_SentryTeam_KLMK` | stem |

#### Naval Infantry (`Naval_Infantry`, 14 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Naval Infantry Rifle Squad | `Group_USSR_RifleSquad_NI` | stem |
| **Platoon HQ** | Управление взвода | 5 | medium | Naval Infantry Platoon HQ | `Group_USSR_PlatoonHQ_NI` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Naval Infantry Ammunition Supply Team | `Group_USSR_AmmoTeam_NI` | stem |
| **Anti-Tank Team** | Противотанковая группа | 4 | medium | Naval Infantry Anti-Tank Team | `Group_USSR_Team_AT_NI` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Naval Infantry Fire Team | `Group_USSR_FireGroup_NI` | stem |
| **Grenadier Team** | Группа гранатометчиков (ГП) | 4 | medium | Naval Infantry Grenadier Team | `Group_USSR_Team_GL_NI` | stem |
| **Light Anti-Tank Team** | Группа ПТ стрелков | 4 | medium | Naval Infantry Light Anti-Tank Team | `Group_USSR_Team_LAT_NI` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Naval Infantry Light Fire Team | `Group_USSR_LightFireTeam_NI` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Naval Infantry Base of Fire Team | `Group_USSR_Team_Suppress_NI` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Naval Infantry Machine Gun Team | `Group_USSR_MachineGunTeam_NI` | stem |
| **Maneuver Group** | Маневренная группа | 2 | small | Naval Infantry Maneuver Team | `Group_USSR_ManeuverGroup_NI` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Naval Infantry Medical Support Team | `Group_USSR_MedicalSection_NI` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Naval Infantry Sapper Team | `Group_USSR_SapperTeam_NI` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Naval Infantry Patrol Team | `Group_USSR_SentryTeam_NI` | stem |

#### Spetsnaz (`Spetsnaz`, 2 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Squad** | Отделение | 6 | medium, large, defense | Special Forces Squad | `Group_USSR_Spetsnaz_Squad` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Special Forces Team | `Group_USSR_Spetsnaz_SentryTeam` | stem |

#### Spetsnaz (suppressed) (`Spetsnaz_Suppressed`, 3 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Recon Squad** | Разведывательное отделение | 6 | medium, large, defense | Special Forces Recon Squad | `Group_USSR_Spetsnaz_ReconSquad` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Special Forces Recon Team | `Group_USSR_Spetsnaz_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | sentry | Special Forces Team | `Group_USSR_Spetsnaz_SentryTeam` | stem |

### FIA — FIA (13 groups)

#### FIA (`FIA`, 13 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 7 | large, defense | Rifle Squad | `Group_FIA_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 5 | medium | Fire Team | `Group_FIA_FireTeam` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `Group_FIA_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | medium | Anti-Tank Team | `Group_FIA_Team_AT` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `Group_FIA_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_FIA_LightFireTeam` | stem |
| **Platoon HQ** | Штаб взвода | 3 | medium | Platoon HQ | `Group_FIA_PlatoonHQ` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_FIA_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_FIA_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_FIA_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_FIA_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_FIA_SentryTeam` | stem |
| **Sharpshooter Team** | Группа пехотных снайперов | 2 | small | Sharpshooter Team | `Group_FIA_SharpshooterTeam` | stem |

### RHS_USAF — RHS US Armed Forces (39 groups)

#### USMC (MEF) (`USMC_MEF`, 14 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 9 | large, defense | Rifle Squad | `Group_USAF_USMC_MEF_RifleSquad` | stem |
| **Ammo Team** | Группа подносчиков | 4 | small | Ammunition Supply Team | `Group_USAF_USMC_MEF_AmmoTeam` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_USAF_USMC_MEF_FireTeam` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_USAF_USMC_MEF_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | small | Light Anti-Tank Team | `Group_USAF_USMC_MEF_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_USAF_USMC_MEF_LightFireTeam` | stem |
| **Platoon HQ** | Штаб взвода | 4 | medium | Platoon HQ | `Group_USAF_USMC_MEF_PlatoonHQ` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_USAF_USMC_MEF_Team_Suppress` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 2 | small | Anti-Tank Team | `Group_USAF_USMC_MEF_Team_AT` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_USAF_USMC_MEF_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_USAF_USMC_MEF_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_USAF_USMC_MEF_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | (Group_USAF_USMC_MEF_SentryTeam) | `Group_USAF_USMC_MEF_SentryTeam` | stem |
| **Sniper Team** | Снайперская группа | 2 | small | Sniper Team | `Group_USAF_USMC_MEF_SniperTeam` | stem |

#### USMC (MEF, desert) (`USMC_MEF_Desert`, 14 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 9 | large, defense | Rifle Squad | `Group_USAF_USMC_MEF_D_RifleSquad` | stem |
| **Ammo Team** | Группа подносчиков | 4 | small | Ammunition Supply Team | `Group_USAF_USMC_MEF_D_AmmoTeam` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_USAF_USMC_MEF_D_FireTeam` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_USAF_USMC_MEF_D_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | small | Light Anti-Tank Team | `Group_USAF_USMC_MEF_D_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_USAF_USMC_MEF_D_LightFireTeam` | stem |
| **Platoon HQ** | Штаб взвода | 4 | medium | Platoon HQ | `Group_USAF_USMC_MEF_D_PlatoonHQ` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_USAF_USMC_MEF_D_Team_Suppress` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 2 | small | Anti-Tank Team | `Group_USAF_USMC_MEF_D_Team_AT` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_USAF_USMC_MEF_D_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_USAF_USMC_MEF_D_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_USAF_USMC_MEF_D_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | (Group_USAF_USMC_MEF_D_SentryTeam) | `Group_USAF_USMC_MEF_D_SentryTeam` | stem |
| **Sniper Team** | Снайперская группа | 2 | small | Sniper Team | `Group_USAF_USMC_MEF_D_SniperTeam` | stem |

#### MARSOC (`MARSOC`, 11 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 9 | large, defense | Rifle Squad | `Group_USAF_USMC_MARSOC_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_USAF_USMC_MARSOC_FireTeam` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_USAF_USMC_MARSOC_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | small | Light Anti-Tank Team | `Group_USAF_USMC_MARSOC_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_USAF_USMC_MARSOC_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_USAF_USMC_MARSOC_Team_Suppress` | stem |
| **Radio Recon Team** | Группа радиоразведки | 3 | small | Radio Reconnaissance Team | `Group_USAF_USMC_MARSOC_RadioReconTeam` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_USAF_USMC_MARSOC_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_USAF_USMC_MARSOC_MedicalSection` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | (Group_USAF_USMC_MARSOC_SentryTeam) | `Group_USAF_USMC_MARSOC_SentryTeam` | stem |
| **Sniper Team** | Снайперская группа | 2 | small | Sniper Team | `Group_USAF_USMC_MARSOC_SniperTeam` | stem |

### RHS_AFRF — RHS Russian Armed Forces (49 groups)

#### MSV (Flora) (`MSV_Flora`, 10 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_RHS_RF_MSV_Flora_RifleSquad` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_RHS_RF_MSV_Flora_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_RHS_RF_MSV_Flora_FireGroup` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_RHS_RF_MSV_Flora_Team_GL` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_RHS_RF_MSV_Flora_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_RHS_RF_MSV_Flora_Team_Suppress` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_RHS_RF_MSV_Flora_MachineGunTeam` | stem |
| **Maneuver Group** | Маневренная группа | 2 | medium | Maneuver Team | `Group_RHS_RF_MSV_Flora_ManeuverGroup` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_RHS_RF_MSV_Flora_MedicalSection` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Rifle Squad | `Group_RHS_RF_MSV_Flora_SentryTeam` | stem |

#### MSV (VSR) (`MSV_VSR`, 10 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_RHS_RF_MSV_VSR_RifleSquad` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_RHS_RF_MSV_VSR_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_RHS_RF_MSV_VSR_FireGroup` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_RHS_RF_MSV_VSR_Team_GL` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_RHS_RF_MSV_VSR_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_RHS_RF_MSV_VSR_Team_Suppress` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_RHS_RF_MSV_VSR_MachineGunTeam` | stem |
| **Maneuver Group** | Маневренная группа | 2 | medium | Maneuver Team | `Group_RHS_RF_MSV_VSR_ManeuverGroup` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_RHS_RF_MSV_VSR_MedicalSection` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Rifle Squad | `Group_RHS_RF_MSV_VSR_SentryTeam` | stem |

#### MSV (VKPO Summer) (`MSV_VKPO_Summer`, 15 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_RHS_RF_MSV_VKPO_S_RifleSquad` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_RHS_RF_MSV_VKPO_S_PlatoonHQ` | stem |
| **Ammo Team** | Группа подносчиков | 4 | small | Ammunition Supply Team | `Group_RHS_RF_MSV_VKPO_S_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_RHS_RF_MSV_VKPO_S_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_RHS_RF_MSV_VKPO_S_FireGroup` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_RHS_RF_MSV_VKPO_S_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | small | Light Anti-Tank Team | `Group_RHS_RF_MSV_VKPO_S_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_RHS_RF_MSV_VKPO_S_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_RHS_RF_MSV_VKPO_S_Team_Suppress` | stem |
| **Radio Recon Team** | Группа радиоразведки | 3 | small | Radio Reconnaissance Team | `Group_RHS_RF_MSV_VKPO_S_RadioReconTeam` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_RHS_RF_MSV_VKPO_S_MachineGunTeam` | stem |
| **Maneuver Group** | Маневренная группа | 2 | medium | Maneuver Team | `Group_RHS_RF_MSV_VKPO_S_ManeuverGroup` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_RHS_RF_MSV_VKPO_S_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_RHS_RF_MSV_VKPO_S_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Rifle Squad | `Group_RHS_RF_MSV_VKPO_S_SentryTeam` | stem |

#### MSV (VKPO Demi-season) (`MSV_VKPO_Demiseason`, 14 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_RHS_RF_MSV_VKPO_DS_RifleSquad` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_RHS_RF_MSV_VKPO_DS_PlatoonHQ` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_RHS_RF_MSV_VKPO_DS_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_RHS_RF_MSV_VKPO_DS_FireGroup` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_RHS_RF_MSV_VKPO_DS_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | small | Light Anti-Tank Team | `Group_RHS_RF_MSV_VKPO_DS_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | small | Light Fire Team | `Group_RHS_RF_MSV_VKPO_DS_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_RHS_RF_MSV_VKPO_DS_Team_Suppress` | stem |
| **Radio Recon Team** | Группа радиоразведки | 3 | small | Radio Reconnaissance Team | `Group_RHS_RF_MSV_VKPO_DS_RadioReconTeam` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_RHS_RF_MSV_VKPO_DS_MachineGunTeam` | stem |
| **Maneuver Group** | Маневренная группа | 2 | medium | Maneuver Team | `Group_RHS_RF_MSV_VKPO_DS_ManeuverGroup` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_RHS_RF_MSV_VKPO_DS_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_RHS_RF_MSV_VKPO_DS_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Rifle Squad | `Group_RHS_RF_MSV_VKPO_DS_SentryTeam` | stem |

### RHS_ION — RHS ION PMC (4 groups)

#### ION PMC (`ION_COY`, 4 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Quick Reaction Force** | Группа быстрого реагирования | 10 | large, defense | Quick Reaction Force | `Group_RHS_ION_COY_QuickReactionForce` | stem |
| **Special Projects Team** | Группа спецпроектов | 8 | medium | Special Projects Team | `Group_RHS_ION_COY_SpecialProjectsTeam` | stem |
| **Close Protection Team** | Группа охраны | 4 | small | Close Protection Team | `Group_RHS_ION_COY_CloseProtectionTeam` | stem |
| **Static Security Team** | Пост охраны | 4 | small, sentry | Static Security Team | `Group_RHS_ION_COY_StaticSecurityTeam` | stem |

### UK — British Military (29 groups)

#### Regulars (1989) (`Regulars_1989`, 13 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Infantry Section** | Пехотная секция | 8 | large, defense | Infantry Section | `Group_UK_1989_Regulars_InfantrySection` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_UK_1989_Regulars_PlatoonHQ` | stem |
| **Rifle Group** | Стрелковая группа | 5 | medium | Rifle Group | `Group_UK_1989_Regulars_RifleGroup` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_UK_1989_Regulars_FireTeam` | stem |
| **Patrol Brick** | Патруль «Brick» | 4 | medium | Patrol Brick | `Group_UK_1989_Regulars_Brick` | override |
| **Sapper Team** | Саперная группа | 4 | small | Sapper Team | `Group_UK_1989_Regulars_SapperTeam` | stem |
| **Gun Group** | Пулеметная группа | 3 | small | Gun Group | `Group_UK_1989_Regulars_GunGroup` | stem |
| **Resupply Team** | Группа снабжения | 3 | small | Resupply Team | `Group_UK_1989_Regulars_AmmoTeam` | override |
| **Charlie G Team** | Расчет Carl Gustav | 2 | small | Charlie G Team | `Group_UK_1989_Regulars_Team_AT` | override |
| **GPMG Team** | Расчет GPMG | 2 | small, sentry | GPMG Team | `Group_UK_1989_Regulars_MachineGunTeam` | override |
| **Medical Team** | Медицинская группа | 2 | small | Medical Team | `Group_UK_1989_Regulars_MedicalSection` | override |
| **Recce Team** | Разведгруппа | 2 | small | Recce Team | `Group_UK_1989_Regulars_RecceTeam` | override |
| **Sniper Pair** | Снайперская пара | 2 | small | Sniper Pair | `Group_UK_1989_Regulars_SniperTeam` | override |

#### Special Forces (1989) (`SF_1989`, 2 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **SF Team** | Группа СпН | 8 | large, defense | Special Forces Team | `Group_UK_1989_SpecialForces_Team` | stem |
| **SF Patrol** | Патруль СпН | 4 | small, medium, sentry | Special Forces Patrol | `Group_UK_1989_SpecialForces_Patrol` | override |

#### Regulars (1983) (`Regulars_1983`, 12 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Infantry Section** | Пехотная секция | 8 | large, defense | Infantry Section | `Group_UK_1983_Regulars_InfantrySection` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_UK_1983_Regulars_PlatoonHQ` | stem |
| **Rifle Group** | Стрелковая группа | 5 | medium | Rifle Group | `Group_UK_1983_Regulars_RifleGroup` | stem |
| **Patrol Brick** | Патруль «Brick» | 4 | medium | Patrol Brick | `Group_UK_1983_Regulars_Brick` | override |
| **Resupply Team** | Группа снабжения | 4 | small | Resupply Team | `Group_UK_1983_Regulars_AmmoTeam` | override |
| **Sapper Team** | Саперная группа | 4 | small | Sapper Team | `Group_UK_1983_Regulars_SapperTeam` | stem |
| **Gun Group** | Пулеметная группа | 3 | small | Gun Group | `Group_UK_1983_Regulars_GunGroup` | stem |
| **Charlie G Team** | Расчет Carl Gustav | 2 | small | Charlie G Team | `Group_UK_1983_Regulars_Team_AT` | override |
| **GPMG Team** | Расчет GPMG | 2 | small, sentry | GPMG Team | `Group_UK_1983_Regulars_MachineGunTeam` | override |
| **Medical Team** | Медицинская группа | 2 | small | Medical Team | `Group_UK_1983_Regulars_MedicalSection` | override |
| **Recce Team** | Разведгруппа | 2 | small | Recce Team | `Group_UK_1983_Regulars_RecceTeam` | override |
| **Sniper Pair** | Снайперская пара | 2 | small | Sniper Pair | `Group_UK_1983_Regulars_SniperTeam` | override |

#### Special Forces (1983) (`SF_1983`, 2 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **SF Team** | Группа СпН | 8 | large, defense | Special Forces Team | `Group_UK_1983_SpecialForces_Team` | stem |
| **SF Patrol** | Патруль СпН | 4 | small, medium, sentry | Special Forces Patrol | `Group_UK_1983_SpecialForces_Patrol` | override |

### MEI — Middle East Insurgents (16 groups)

#### Insurgents (`Insurgents`, 16 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 7 | large, defense | Rifle Squad | `Group_MEI_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 5 | medium | Fire Team | `Group_MEI_FireTeam` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `Group_MEI_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | medium | Anti-Tank Team | `Group_MEI_Team_AT` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | medium | Grenadier Team | `Group_MEI_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `Group_MEI_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_MEI_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Base of Fire Team | `Group_MEI_Team_Suppress` | stem |
| **Platoon HQ** | Штаб взвода | 3 | medium | Platoon HQ | `Group_MEI_PlatoonHQ` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_MEI_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_MEI_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_MEI_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_MEI_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_MEI_SentryTeam` | stem |
| **Sharpshooter Team** | Группа пехотных снайперов | 2 | small | Sharpshooter Team | `Group_MEI_SharpshooterTeam` | stem |
| **Sniper Team** | Снайперская группа | 2 | small | Sniper Team | `Group_MEI_SniperTeam` | stem |

### PLASTICBANDIT — Bandits (7 groups)

#### Bandits (`Bandits`, 7 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Gang** | Банда | 9 | large, defense | Gang - Random | `Group_PLASTICBANDIT_Squad` | override |
| **Crew** | Бригада | 5 | medium | Crew - Random | `Group_PLASTICBANDIT_FireTeam` | override |
| **Heavy Crew** | Тяжелая бригада | 5 | medium | Crew - Heavy | `Group_PLASTICBANDIT_FireTeam_Heavy` | override |
| **MG Trio** | Пулеметная тройка | 3 | small | Trio - MG Team | `Group_PLASTICBANDIT_MGTeam` | override |
| **Duo** | Двойка | 2 | small, sentry | Duo - Random | `Group_PLASTICBANDIT_Patrol` | override |
| **RPG Duo** | Двойка с РПГ | 2 | small | Duo - RPG Team | `Group_PLASTICBANDIT_RPGTeam` | override |
| **Sharpshooter Duo** | Двойка марксманов | 2 | small | Duo - Sharpshooters | `Group_PLASTICBANDIT_Sharpshooter` | override |

### SFS_US — US Special Force Squad (Abrashka) (5 groups)

#### Special Force Squad (`SFS`, 5 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 9 | large, defense | RifleSquad Custom | `Group_US_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 4 | medium | FireTeam Custom | `Group_US_FireTeam` | stem |
| **Fire Team (guard)** | Огневая группа (охрана) | 4 | medium | FireTeam Guard Custom | `Group_US_FireTeam_Guard` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | FireTeamLight Custom | `Group_US_LightFireTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | SentryTeam Custom | `Group_US_SentryTeam` | stem |

### SFS_USSR — RF Special Force Squad (Abrashka) (4 groups)

#### Special Force Squad (`SFS`, 4 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 7 | large, defense | Rifle Suad Custom | `Group_USSR_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 4 | medium | FireTeam Custom | `Group_USSR_FireGroup` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | FireTeamLight Custom | `Group_USSR_LightFireTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | SentryTeam Custom | `Group_USSR_SentryTeam` | stem |

### SFS_FIA — FIA Special Force Squad (Abrashka) (6 groups)

#### Special Force Squad (`SFS`, 6 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 7 | large, defense | Rifle Squad Custom | `Group_FIA_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 5 | medium | FireTeam Custom | `Group_FIA_FireTeam` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | FireTeamLight Custom | `Group_FIA_LightFireTeam` | stem |
| **Platoon HQ** | Управление взвода | 3 | medium | PlatoonHQ Custom | `Group_FIA_PlatoonHQ` | stem |
| **Recon Team** | Разведгруппа | 2 | small | ReconTeam Custom | `Group_FIA_ReconTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | SentryTeam Custom | `Group_FIA_SentryTeam` | stem |

### Ses_CDF — CDF — Chernarussian Defence Forces (16 groups)

#### CDF Army (`CDF_Army`, 16 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 9 | large, defense | Rifle Squad | `Group_Ses_CDF_RifleSquad` | stem |
| **Infantry Group** | Пехотная группа | 6 | large | Infantry Group | `Group_Ses_CDF_RifleSquad2` | game name (size differs from RifleSquad) |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_Ses_CDF_PlatoonHQ` | stem |
| **Ammo Team** | Группа подносчиков | 4 | small | Ammunition Supply Team | `Group_Ses_CDF_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_Ses_CDF_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_Ses_CDF_FireTeam` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_Ses_CDF_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | small | Light Anti-Tank Team | `Group_Ses_CDF_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_Ses_CDF_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_Ses_CDF_Team_Suppress` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_Ses_CDF_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_Ses_CDF_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_Ses_CDF_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_Ses_CDF_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_Ses_CDF_SentryTeam` | stem |
| **Sniper Team** | Снайперская группа | 2 | small | Sniper Team | `Group_Ses_CDF_SniperTeam` | stem |

### Ses_ChDKZ — ChDKZ — Chedaki Insurgents (13 groups)

#### Chedaki (`ChDKZ`, 13 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 6 | large, defense | Rifle Squad | `Group_ChDKZ_RifleSquad` | stem |
| **Platoon HQ** | Штаб взвода | 5 | medium | Platoon HQ | `Group_ChDKZ_PlatoonHQ` | stem |
| **Ammo Team** | Группа подносчиков | 4 | small | Ammunition Supply Team | `Group_ChDKZ_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_ChDKZ_Team_AT` | stem |
| **Fire Team** | Огневая группа | 4 | medium | Fire Team | `Group_ChDKZ_FireGroup` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | small | Grenadier Team | `Group_ChDKZ_Team_GL` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_ChDKZ_LightFireTeam` | stem |
| **Suppression Team** | Группа подавления | 4 | small | Base of Fire Team | `Group_ChDKZ_Team_Suppress` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_ChDKZ_MachineGunTeam` | stem |
| **Maneuver Group** | Маневренная группа | 2 | medium | Maneuver Team | `Group_ChDKZ_ManeuverGroup` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_ChDKZ_MedicalSection` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_ChDKZ_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_ChDKZ_SentryTeam` | stem |

### Ses_NAPA — NAPA — Chernarussian Guerrillas (12 groups)

#### NAPA (`NAPA`, 12 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 7 | large, defense | Rifle Squad | `Group_NAPA_RifleSquad` | stem |
| **Fire Team** | Огневая группа | 5 | medium | Fire Team | `Group_NAPA_FireTeam` | stem |
| **Ammo Team** | Группа подносчиков | 4 | small | Ammunition Supply Team | `Group_NAPA_AmmoTeam` | stem |
| **Anti-Tank Team** | Противотанковый расчет | 4 | small | Anti-Tank Team | `Group_NAPA_Team_AT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `Group_NAPA_LightFireTeam` | stem |
| **Platoon HQ** | Штаб взвода | 3 | medium | Platoon HQ | `Group_NAPA_PlatoonHQ` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `Group_NAPA_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `Group_NAPA_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `Group_NAPA_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `Group_NAPA_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `Group_NAPA_SentryTeam` | stem |
| **Sharpshooter Team** | Группа пехотных снайперов | 2 | small | Sharpshooter Team | `Group_NAPA_SharpshooterTeam` | stem |

### BWAR — Bundeswehr (28 groups)

#### Flecktarn (`Flecktarn`, 14 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 8 | large, defense | Rifle Squad | `BWAR_Group_RifleSquad` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `BWAR_Group_AmmoTeam` | stem |
| **Fire Team (guard)** | Огневая группа (охрана) | 4 | medium | Fire Team | `BWAR_Group_FireTeam_Guard` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | medium | Grenadier Team | `BWAR_Group_Team_GL` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `BWAR_Group_Team_LAT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `BWAR_Group_LightFireTeam` | stem |
| **Platoon HQ** | Штаб взвода | 4 | medium | Platoon HQ | `BWAR_Group_PlatoonHQ` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Base of Fire Team | `BWAR_Group_Team_Suppress` | stem |
| **Engineer Team** | Инженерная группа | 2 | small | #AR-Group_EngineerTeam | `BWAR_Group_EngineerTeam` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `BWAR_Group_MachineGunTeam` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `BWAR_Group_MedicalSection` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `BWAR_Group_ReconTeam` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `BWAR_Group_SapperTeam` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `BWAR_Group_SentryTeam` | stem |

#### Tropentarn (`Tropentarn`, 14 groups)

| Label | RU | Size | Classes | Game name | Prefab(s) | Source |
|---|---|---|---|---|---|---|
| **Rifle Squad** | Стрелковое отделение | 8 | large, defense | Rifle Squad | `BWAR_Group_RifleSquad_3FT` | stem |
| **Ammo Team** | Группа подносчиков | 4 | medium | Ammunition Supply Team | `BWAR_Group_AmmoTeam_3FT` | stem |
| **Fire Team (guard)** | Огневая группа (охрана) | 4 | medium | Fire Team | `BWAR_Group_FireTeam_Guard_3FT` | stem |
| **Grenadier Team** | Группа гренадеров | 4 | medium | Grenadier Team | `BWAR_Group_Team_GL_3FT` | stem |
| **Light Anti-Tank Team** | Легкий противотанковый расчет | 4 | medium | Light Anti-Tank Team | `BWAR_Group_Team_LAT_3FT` | stem |
| **Light Fire Team** | Легкая огневая группа | 4 | medium | Light Fire Team | `BWAR_Group_LightFireTeam_3FT` | stem |
| **Platoon HQ** | Штаб взвода | 4 | medium | Platoon HQ | `BWAR_Group_PlatoonHQ_3FT` | stem |
| **Suppression Team** | Группа подавления | 4 | medium | Base of Fire Team | `BWAR_Group_Team_Suppress_3FT` | stem |
| **Engineer Team** | Инженерная группа | 2 | small | #AR-Group_EngineerTeam | `BWAR_Group_EngineerTeam_3FT` | stem |
| **Machine Gun Team** | Пулеметный расчет | 2 | small | Machine Gun Team | `BWAR_Group_MachineGunTeam_3FT` | stem |
| **Medical Section** | Медицинская группа | 2 | small | Medical Support Team | `BWAR_Group_MedicalSection_3FT` | stem |
| **Recon Team** | Разведгруппа | 2 | small | Recon Team | `BWAR_Group_ReconTeam_3FT` | stem |
| **Sapper Team** | Саперная группа | 2 | small | Sapper Team | `BWAR_Group_SapperTeam_3FT` | stem |
| **Sentry Team** | Парный пост | 2 | small, sentry | Patrol Team | `BWAR_Group_SentryTeam_3FT` | stem |
