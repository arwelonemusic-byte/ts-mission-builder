# Individual character prefabs — every enemy-capable faction

Harvested 2026-09-21 by `node generator/tools/harvest-characters.mjs` (regenerate, don't hand-edit). Machine-readable twin: `input/characters-harvest.json`.

**Scope**: every registry faction that can be the enemy side (US_DESERT is `playableOnly` → excluded). Aliases (SFS packs) list their OWN character prefabs, not the base faction's.

**Rules applied**: `*Random*`/`*Randomized*` wrappers skipped (user rule — they are variant tables over unarmed bases, broken for individual spawns); `*_Base`/`*BaseLoadout*` abstract parents skipped; discovery = character EntityCatalog confs + a sweep of the faction's `Prefabs/Characters/Factions/<folder>` (prefabs no catalog lists are marked UNCATALOGED); GUID evidence prefab > layer > catalog (Arma II trust rule), vanilla GUIDs from the addon-audit vanilla index.

**Status legend**: OK = catalog GUID corroborated by the mod's own prefabs/layers · OK_CATALOG = catalog confs only (normal for leaf characters nothing else references) · VANILLA = base-game content · CONFLICT = catalog and prefab-side disagree (prefab-side GUID shown) · UNCATALOGED_PREFAB/LAYER/CATALOG = not in the faction's character catalog, GUID from a prefab / layer / other-conf ref (group unit slot, variant table, LoadoutManager entry, groups conf) · UNCATALOGED_VANILLA = vanilla prefab outside the catalogs · UNCATALOGED_NO_GUID = file ships but nothing references it (unrecoverable without a live Workbench .meta).

**Weapons** = the chain's CharacterWeaponSlotComponent templates (slot 0 first) plus "(inv)" = weapon prefabs issued through InitialInventoryItems (holstered pistols, spare launchers); UNARMED = neither anywhere in the chain ("Unarmed" roles, MEI heli crew, the Bundeswehr Officer who carries P8 magazines but no P8).

**Caveats found while harvesting** (all reproduced in the tables' Notes column):
- Arma II CDF: the catalog's SL GUID is really the Medic's and MG/SL are off by one → 3 CONFLICT rows, prefab-side GUIDs shown (the documented trust-rule case). CDF Sharpshooter and ChDKZ Rifleman2/3 are cataloged but the prefabs do NOT ship. NAPA's catalog lists vanilla USSR (copy-paste bug) → its whole roster is UNCATALOGED_PREFAB/LAYER, GUIDs from the Random variant tables + the mod's test world.
- Stale parent paths relinked by GUID (the engine resolves parents by GUID, so these work in-game): UK Crew Commanders / HeliCrew point at a wrong folder; MEI AT/AT2/Sapper parent a renamed `Character_MEI_Rifle1` (= Rifleman1); every Bandit leaf parents the old `BANDIT/` folder (author renamed the faction to PLASTICBANDIT — relinked by suffix).
- RHS: the cataloged rosters are the primary variants; the `<Role>2`/`<Role>_3` cosmetic twins (same name, different uniform/gear) are UNCATALOGED but carry prefab-side GUIDs from the Random wrappers' variant tables (164 USAF / 178 AFRF / 37 ION). ION has an EMPTY catalog → all 61 from variant tables. 8 RHS prefabs have no GUID source at all (FORECON PL/TL_Marksman/Unarmed, VKPO CC/Officer ×4, SOF Sniper).
- UK: Reservists are in the catalog (the Builder excludes them by design); 6 UK prefabs at the UK_Army root (Patrol_* set, 1983 SF Sniper/Spotter) have no GUID source; 1 catalog entry is `m_bEnabled 0`.
- Vanilla: campaign-only characters (`US_Army/KS/*`, `Campaign/*`) excluded; `Character_USSR_AKOfficer` has no GUID source. `_Guard` variants are uncataloged (referenced only from Guard group prefabs).
- SFS packs: alias factions with NO catalogs — every row is UNCATALOGED_PREFAB with the GUID from the pack's LoadoutManager override / group unit slots (matches `input/sfs-harvest.md` / `sfs-rf-fia-harvest.md`).

## Summary

| Faction | Characters | Cataloged | Uncataloged | with GUID | Cosmetic variants | Unarmed | Conflicts | Skipped random | Skipped base |
|---|---|---|---|---|---|---|---|---|---|
| US | 46 | 41 | 5 | 46 | 1 | 1 | 0 | 1 | 3 |
| USSR | 87 | 80 | 7 | 86 | 1 | 3 | 0 | 2 | 3 |
| FIA | 25 | 21 | 4 | 25 | 0 | 1 | 0 | 1 | 2 |
| RHS_USAF | 262 | 114 | 148 | 259 | 164 | 3 | 0 | 82 | 7 |
| RHS_AFRF | 321 | 151 | 170 | 316 | 178 | 4 | 0 | 88 | 11 |
| RHS_ION | 61 | 0 | 61 | 61 | 37 | 0 | 0 | 12 | 5 |
| UK | 97 | 77 | 20 | 91 | 0 | 1 | 0 | 0 | 9 |
| MEI | 32 | 32 | 0 | 32 | 5 | 2 | 0 | 1 | 2 |
| PLASTICBANDIT | 20 | 4 | 16 | 20 | 9 | 0 | 0 | 6 | 4 |
| SFS_US | 13 | 0 | 13 | 13 | 0 | 0 | 0 | 0 | 0 |
| SFS_USSR | 13 | 0 | 13 | 13 | 0 | 0 | 0 | 0 | 1 |
| SFS_FIA | 13 | 0 | 13 | 13 | 0 | 0 | 0 | 0 | 0 |
| Ses_CDF | 79 | 16 | 63 | 79 | 50 | 2 | 3 | 21 | 2 |
| Ses_ChDKZ | 102 | 14 | 88 | 102 | 79 | 5 | 0 | 21 | 2 |
| Ses_NAPA | 83 | 0 | 83 | 83 | 61 | 0 | 0 | 21 | 2 |
| BWAR | 34 | 34 | 0 | 34 | 0 | 2 | 0 | 2 | 4 |

## US — US Army (vanilla)

Sources: `ReforgerData/Configs/EntityCatalog/US/Characters_EntityCatalog_US.conf`; sweep of `reference/ReforgerData` under `Prefabs/Characters/Factions/BLUFOR/US_Army/`. Paths below are relative to that prefix.

Catalog entries OUTSIDE the faction folder (ignored): 36 — e.g. `Prefabs/Characters/Campaign/Final/BLUFOR/US_army/Campaign_US_Player.et` (Characters_EntityCatalog_US.conf).

### (root) (26)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_US_AMG.et` | `{6058AB54781A0C52}` | OK | Rifle_M16A2 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_US_AR.et` | `{5B1996C05B1E51A4}` | OK | MG_M249 |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_US_Ammo.et` | `{CD28EE7C5690D3BB}` | OK | Rifle_M16A2 |  |
| Crew Commander | Командир экипажа | `Character_US_CC.et` | `{F35F145D4A3F75EF}` | OK | Rifle_M16A2_carbine |  |
| Crewman | Член экипажа | `Character_US_Crew.et` | `{E1CB513B8B9B08F4}` | OK | Rifle_M16A2_carbine |  |
| Sapper | Сапер | `Character_US_Engineer.et` | `{36CCDB4556ECDA06}` | UNCATALOGED_PREFAB | Rifle_M16A2 | carries VariantData |
| Grenadier | Гренадер | `Character_US_GL.et` | `{84029128FA6F6BB9}` | OK | Rifle_M16A2_M203 |  |
| Helicopter Crew | Экипаж вертолета | `Character_US_HeliCrew.et` | `{15CD521098748195}` | OK | Handgun_M9 |  |
| Helicopter Pilot | Пилот вертолета | `Character_US_HeliPilot.et` | `{42A502E3BB727CEB}` | OK | Handgun_M9 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_US_LAT.et` | `{27BF1FF235DD6036}` | OK | Rifle_M16A2, Launcher_M72A3 | carries VariantData |
| Machine-Gunner | Пулеметчик | `Character_US_MG.et` | `{1623EA3AEFACA0E4}` | OK | MG_M60, Handgun_M9 |  |
| Medic | Врач | `Character_US_Medic.et` | `{C9E4FEAF5AAC8D8C}` | OK | Rifle_M16A2 |  |
| Officer | Офицер | `Character_US_Officer.et` | `{DE15FB5FAFC3E63F}` | OK | Handgun_M9 |  |
| Platoon Leader | Командир взвода | `Character_US_PL.et` | `{0B3167BB0FB68110}` | OK | Rifle_M16A2, Handgun_M9 |  |
| Combat Signaler | Связист | `Character_US_RTO.et` | `{3726077BE60962FF}` | OK | Rifle_M16A2 |  |
| Rifleman | Стрелок | `Character_US_Rifleman.et` | `{26A9756790131354}` | OK | Rifle_M16A2 | carries VariantData |
| Rifleman | Стрелок | `Character_US_Rifleman_Variant_1.et` | `{EA158B6EB6A24B4B}` | OK | Rifle_M16A2 | cosmetic variant of Character_US_Rifleman; carries VariantData |
| Squad Leader | Командир отделения | `Character_US_SL.et` | `{E45F1E163F5CA080}` | OK | Rifle_M16A2 |  |
| Combat Engineer | Военный инженер | `Character_US_Sapper.et` | `{AE63E4B79FB45DD1}` | OK | Rifle_M16A2 | carries VariantData |
| Scout | Разведчик | `Character_US_Scout.et` | `{371FD0F920B600DD}` | OK | Rifle_M16A2_OliveGreen_Solid |  |
| Scout Radio Operator | Радист-разведчик | `Character_US_Scout_RTO.et` | `{E94CD0D20A63909E}` | OK | Rifle_M16A2_OliveGreen_Solid |  |
| Platoon Sergeant | Взводный сержант | `Character_US_Sergeant.et` | `{4FBA24F7BB43E17D}` | OK | Rifle_M16A2 |  |
| Sniper | Снайпер | `Character_US_Sniper.et` | `{0F6689B491641155}` | OK | Rifle_M21_ARTII, Handgun_M9 |  |
| Spotter | Корректировщик огня | `Character_US_Spotter.et` | `{1CA3D30464EE4674}` | OK | Rifle_M16A2_carbine_M203_OliveGreen_Solid |  |
| Team Leader | Командир группы | `Character_US_TL.et` | `{E398E44759DA1A43}` | OK | Rifle_M16A2_4x20 |  |
| Unarmed | Невооруженный | `Character_US_Unarmed.et` | `{2F912ED6E399FF47}` | OK | — | UNARMED (no weapon in slots or inventory) |

### GreenBerets (9)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Special Forces | Спецназ | `Character_US_SF.et` | `{36E28C628A2F83CB}` | OK | Rifle_M16A2_carbine_AP2k_OliveGreen_Sand_Stripes |  |
| Special Forces Grenadier | Гранатометчик спецназа | `Character_US_SF_GL.et` | `{C110498284A5418F}` | OK | Rifle_M16A2_carbine_M203_OliveGreen_Sand_Stripes |  |
| Special Forces Machine-Gunner | Пулеметчик спецназа | `Character_US_SF_LMG.et` | `{6E1E87ECA5F5A7EA}` | OK | MG_M249 |  |
| Special Forces Medic | Врач спецназа | `Character_US_SF_Medic.et` | `{9A234C5857D92187}` | OK | Rifle_M16A2_carbine_OliveGreen_Solid |  |
| Special Forces Officer | Офицер спецназа | `Character_US_SF_Officer.et` | `{C0F45FA0C11853D1}` | OK_CATALOG | Rifle_M16A2_carbine_OliveGreen_Solid, Handgun_M9 |  |
| Special Forces Radio Operator | Радист спецназа | `Character_US_SF_RTO.et` | `{5228D8F587B5EEDC}` | OK | Rifle_M16A2_carbine_OliveGreen_Solid |  |
| Special Forces Squad Leader | Командир спецназа | `Character_US_SF_SL.et` | `{85261D5B04BFA7EE}` | OK | Rifle_M16A2_carbine_M203_OliveGreen_Sand_Stripes |  |
| Special Forces Sapper | Сапер спецназа | `Character_US_SF_Sapper.et` | `{FCA76613163633F8}` | OK | Rifle_M16A2_carbine_OliveGreen_Sand_Stripes, Launcher_M72A3 |  |
| Special Forces Sharpshooter | Снайпер спецназа | `Character_US_SF_Sharpshooter.et` | `{ADC2DE949F566202}` | OK | Rifle_M16A2_4x20_OliveGreen_Sand_Stripes |  |

### GreenBerets/Suppressed (7)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Special Forces Grenadier - Recon | Гранатометчик спецназа (разведка) | `Character_US_SF_GL_S.et` | `{78149A76D073D4C7}` | OK | Rifle_M16A2_suppressor_M203_OliveGreen_Sand_Stripes |  |
| Special Forces Medic - Recon | Врач спецназа (разведка) | `Character_US_SF_Medic_S.et` | `{218217624DA44CCD}` | OK | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes |  |
| Special Forces Radio Operator - Recon | Радист спецназа (разведка) | `Character_US_SF_RTO_S.et` | `{C81429173BB025F2}` | OK | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes |  |
| Special Forces - Recon | Боец спецназа (разведка) | `Character_US_SF_S.et` | `{33155540F5CAA602}` | OK | Rifle_M16A2_carbine_suppressor_AP2K_OliveGreen_Sand_Stripes |  |
| Special Forces Squad Leader - Recon | Командир спецназа (разведка) | `Character_US_SF_SL_S.et` | `{E5E4A45D13175E67}` | OK | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes |  |
| Special Forces Sapper - Recon | Сапер спецназа (разведка) | `Character_US_SF_Sapper_S.et` | `{B7E8542C3CD9E4B2}` | OK | Rifle_M16A2_carbine_suppressor_OliveGreen_Sand_Stripes, Launcher_M72A3 |  |
| Special Forces Sharpshooter - Recon | Снайпер спецназа (разведка) | `Character_US_SF_Sharpshooter_S.et` | `{EC8C02BC296EEEA0}` | OK | Rifle_M16A2_suppressor_4x20_OliveGreen_Sand_Stripes |  |

### Guard (4)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Automatic Rifleman | Стрелок-пулеметчик | `Character_US_AR_Guard.et` | `{A16C9953F9767526}` | UNCATALOGED_PREFAB | MG_M249 |  |
| Grenadier | Гренадер | `Character_US_GL_Guard.et` | `{F6A45EA59BA3C2E8}` | UNCATALOGED_PREFAB | Rifle_M16A2_M203 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_US_LAT_Guard.et` | `{BDDBE7D384E49891}` | UNCATALOGED_PREFAB | Rifle_M16A2, Launcher_M72A3 |  |
| Team Leader | Командир группы | `Character_US_TL_Guard.et` | `{C1E111A1865C5E75}` | UNCATALOGED_PREFAB | Rifle_M16A2_4x20 |  |

Skipped random/randomized wrappers (1): Character_US_Randomized

Skipped abstract parents (3): Character_US_Base, Character_US_BaseLoadout, Character_US_SF_BaseLoadout

## USSR — Soviet Army (vanilla)

Sources: `ReforgerData/Configs/EntityCatalog/USSR/Characters_EntityCatalog_USSR.conf`; sweep of `reference/ReforgerData` under `Prefabs/Characters/Factions/OPFOR/USSR_Army/`. Paths below are relative to that prefix.

Catalog entries OUTSIDE the faction folder (ignored): 38 — e.g. `Prefabs/Characters/Campaign/Final/OPFOR/USSR_Army/Campaign_USSR_Player.et` (Characters_EntityCatalog_USSR.conf).

### (root) (29)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_USSR_AAT.et` | `{631158F6898738A4}` | OK | Rifle_AK74 |  |
| Officer | Офицер | `Character_USSR_AKOfficer.et` | — | UNCATALOGED_NO_GUID | Rifle_AKS74U, Handgun_PM |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_USSR_AMG.et` | `{E9AEEF2D9E41321B}` | OK | Rifle_AK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_USSR_AR.et` | `{23ADBBC31B6A3DC6}` | OK | MG_RPK74 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_USSR_AT.et` | `{1C78331E156A3D65}` | OK | Rifle_AKS74U, Launcher_RPG7_PGO7 |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_USSR_Ammo.et` | `{B31D4E408AEC99A4}` | OK | Rifle_AK74 |  |
| Crew Commander | Командир экипажа | `Character_USSR_CC.et` | `{BA010C4C82F3DE92}` | OK | Rifle_AKS74U |  |
| Crewman | Член экипажа | `Character_USSR_Crew.et` | `{9FFEF10757E742EB}` | OK | Rifle_AKS74U |  |
| Sapper | Сапер | `Character_USSR_Engineer.et` | `{EBFB363AC7A5FCE6}` | UNCATALOGED_PREFAB | Rifle_AK74 | carries VariantData |
| Grenadier | Гренадер | `Character_USSR_GL.et` | `{8E0FE664CE7D1CA9}` | OK | Rifle_AK74_GP25 |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_USSR_GateKeeper.et` | `{98DD20EB738E324D}` | UNCATALOGED_PREFAB | Rifle_AK74 |  |
| Helicopter Crew | Экипаж вертолета | `Character_USSR_HeliCrew.et` | `{C8FABF6F093DA775}` | OK | Handgun_PM |  |
| Helicopter Pilot | Пилот вертолета | `Character_USSR_HeliPilot.et` | `{A62FA97C4EC64F14}` | OK | Handgun_PM |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_USSR_LAT.et` | `{BF643BE4ADBDFDD3}` | OK | Rifle_AK74, Launcher_RPG22 |  |
| Machine-Gunner | Пулеметчик | `Character_USSR_MG.et` | `{96C784C502AC37DA}` | OK | MG_PKM, Handgun_PM |  |
| Medic | Врач | `Character_USSR_Medic.et` | `{AB9726163EC1BD81}` | OK | Rifle_AK74 |  |
| Officer | Офицер | `Character_USSR_Officer.et` | `{5117311FB822FD1F}` | OK | Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_USSR_PL.et` | `{426F7FAAC77A2A6D}` | OK | Rifle_AK74, Handgun_PM |  |
| Combat Signaler | Связист | `Character_USSR_RTO.et` | `{612F43A4D5AE765F}` | OK | Rifle_AK74 |  |
| Rifleman | Стрелок | `Character_USSR_Rifleman.et` | `{DCB41B3746FDD1BE}` | OK | Rifle_AK74 | carries VariantData |
| Rifleman | Стрелок | `Character_USSR_Rifleman_Variant_1.et` | `{069118B2D809C9E1}` | OK | Rifle_AK74 | cosmetic variant of Character_USSR_Rifleman; carries VariantData |
| Squad Leader | Командир отделения | `Character_USSR_SL.et` | `{5436629450D8387A}` | OK | Rifle_AK74_GP25 |  |
| Senior Rifleman | Старший стрелок | `Character_USSR_SR.et` | `{333DA6244C7DA34C}` | OK | Rifle_AK74N_1P29 | carries VariantData |
| Combat Engineer | Военный инженер | `Character_USSR_Sapper.et` | `{CBF7A398FE060335}` | OK | Rifle_AK74 | carries VariantData |
| Scout | Разведчик | `Character_USSR_Scout.et` | `{2C490E2846A1E884}` | OK | Rifle_AK74 |  |
| Scout Radio Operator | Радист-разведчик | `Character_USSR_Scout_RTO.et` | `{0DC67B4DFFD7A361}` | OK | Rifle_AK74 |  |
| Platoon Sergeant | Взводный сержант | `Character_USSR_Sergeant.et` | `{928DC9882A0AC79D}` | OK | Rifle_AK74 |  |
| Sharpshooter | Пехотный снайпер | `Character_USSR_Sharpshooter.et` | `{976AC400219898FA}` | OK | Rifle_SVD_PSO |  |
| Unarmed | Невооруженный | `Character_USSR_Unarmed.et` | `{98EB9CDD85B8C92C}` | OK | — | UNARMED (no weapon in slots or inventory) |

### Guard (4)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_USSR_AAT_Guard.et` | `{F5CF70B790492C70}` | UNCATALOGED_PREFAB | Rifle_AK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_USSR_AR_Guard.et` | `{7C5B742C683F53C6}` | UNCATALOGED_PREFAB | MG_RPK74 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_USSR_AT_Guard.et` | `{FDBB366704065748}` | UNCATALOGED_PREFAB | Rifle_AKS74U, Launcher_RPG7_PGO7 |  |
| Squad Leader | Командир отделения | `Character_USSR_SL_Guard.et` | `{90D2F1A1CFCA7B5F}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25 |  |

### KLMK (18)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_USSR_AAT_KLMK.et` | `{E8EF64F8B943A507}` | OK | Rifle_AK74 |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_USSR_AMG_KLMK.et` | `{F89D79B340033E32}` | OK | Rifle_AK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_USSR_AR_KLMK.et` | `{862E3B66D0316F0A}` | OK | MG_RPK74 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_USSR_AT_KLMK.et` | `{9A12B3F6ABDF70BE}` | OK | Rifle_AKS74U, Launcher_RPG7_PGO7 |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_USSR_Ammo_KLMK.et` | `{77D7BFD355620806}` | OK | Rifle_AK74 |  |
| Grenadier | Гренадер | `Character_USSR_GL_KLMK.et` | `{6B00D3FC285E0AE0}` | OK | Rifle_AK74_GP25 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_USSR_LAT_KLMK.et` | `{9833B84F57F9F22F}` | OK | Rifle_AK74, Launcher_RPG22 |  |
| Machine-Gunner | Пулеметчик | `Character_USSR_MG_KLMK.et` | `{8A60AEBD529FEB8B}` | OK | MG_PKM, Handgun_PM |  |
| Medic | Врач | `Character_USSR_Medic_KLMK.et` | `{D66C215D6F03EFFD}` | OK | Rifle_AK74 |  |
| Platoon Leader | Командир взвода | `Character_USSR_PL_KLMK.et` | `{E8A05D5E0CEAC836}` | OK | Rifle_AK74, Handgun_PM |  |
| Combat Signaler | Связист | `Character_USSR_RTO_KLMK.et` | `{9C16A2371109644D}` | OK | Rifle_AK74 |  |
| Rifleman | Стрелок | `Character_USSR_Rifleman_KLMK.et` | `{145DBC42B19FC4D6}` | OK | Rifle_AK74 | carries VariantData |
| Squad Leader | Командир отделения | `Character_USSR_SL_KLMK.et` | `{A8507C7BBAF64A71}` | OK | Rifle_AK74_GP25 |  |
| Senior Rifleman | Старший стрелок | `Character_USSR_SR_KLMK.et` | `{C49ED6AA2EA02B15}` | OK | Rifle_AK74N_1P29 |  |
| Combat Engineer | Военный инженер | `Character_USSR_Sapper_KLMK.et` | `{A70AD7146D3FBF41}` | OK | Rifle_AK74 |  |
| Platoon Sergeant | Взводный сержант | `Character_USSR_Sergeant_KLMK.et` | `{FC13DAA97D49137F}` | OK | Rifle_AK74 |  |
| Sharpshooter | Пехотный снайпер | `Character_USSR_Sharpshooter_KLMK.et` | `{B056E800F6286831}` | OK | Rifle_SVD_PSO |  |
| Unarmed | Невооруженный | `Character_USSR_Unarmed_KLMK.et` | `{F67A91C100D6C222}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

### Naval_Infantry (20)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Naval Infantry Anti-Tank Assistant | Помощник противотанкового стрелка морской пехоты | `Character_USSR_NI_AAT.et` | `{D2D6106D52DF6B0A}` | OK | Rifle_AK74 |  |
| Naval Infantry Machine-Gunner Assistant | Помощник пулеметчика морской пехоты | `Character_USSR_NI_AMG.et` | `{5869A7B6451961B5}` | OK | Rifle_AK74 |  |
| Naval Infantry Automatic Rifleman | Стрелок-пулеметчик морской пехоты | `Character_USSR_NI_AR.et` | `{FF534E2B68E3D9D0}` | OK | MG_RPK74 |  |
| Naval Infantry Anti-Tank Specialist | Противотанковый стрелок морской пехоты | `Character_USSR_NI_AT.et` | `{27FB27EA116AC78C}` | OK | Rifle_AKS74U, Launcher_RPG7_PGO7 |  |
| Naval Infantry Ammunition Bearer | Подносчик боеприпасов морской пехоты | `Character_USSR_NI_Ammo.et` | `{63B5AEDAB5EDE4B7}` | OK | Rifle_AK74 |  |
| Naval Infantry Crew Commander | Командир экипажа морской пехоты | `Character_USSR_NI_CC.et` | `{F3AB754B0209BEAC}` | OK_CATALOG | Rifle_AKS74U |  |
| Naval Infantry Crewman | Член экипажа морской пехоты | `Character_USSR_NI_Crew.et` | `{4F56119D68E63FF8}` | OK_CATALOG | Rifle_AKS74U |  |
| Naval Infantry Grenadier | Гранатометчик морской пехоты | `Character_USSR_NI_GL.et` | `{F286300A9F54B0FA}` | OK | Rifle_AK74_GP25 |  |
| Naval Infantry Light AT Rifleman | Легкий противотанковый стрелок морской пехоты | `Character_USSR_NI_LAT.et` | `{1F8E131008DE0DD1}` | OK | Rifle_AK74, Launcher_RPG22 |  |
| Naval Infantry Machine-Gunner | Пулеметчик морской пехоты | `Character_USSR_NI_MG.et` | `{AD44903106ACCD33}` | OK | MG_PKM, Handgun_PM |  |
| Naval Infantry Medic | Врач морской пехоты | `Character_USSR_NI_Medic.et` | `{34D564602573EDA1}` | OK | Rifle_AK74 |  |
| Naval Infantry Platoon Leader | Командир взвода морской пехоты | `Character_USSR_NI_PL.et` | `{0BC506AD47804A53}` | OK | Rifle_AK74, Handgun_PM |  |
| Naval Infantry Combat Signaler | Связист морской пехоты | `Character_USSR_NI_RTO.et` | `{0E4D9E3249328533}` | OK | Rifle_AK74 |  |
| Naval Infantry Rifleman | Стрелок морской пехоты | `Character_USSR_NI_Rifleman.et` | `{6F412F678228D5F7}` | OK | Rifle_AK74 | carries VariantData |
| Naval Infantry Squad Leader | Командир отделения морской пехоты | `Character_USSR_NI_SL.et` | `{92DBBF345A677BC3}` | OK | Rifle_AK74_GP25 |  |
| Naval Infantry Senior Rifleman | Старший стрелок морской пехоты | `Character_USSR_NI_SR.et` | `{EFC353CC3FF4475A}` | OK | Rifle_AK74N_1P29 |  |
| Naval Infantry Combat Engineer | Военный инженер морской пехоты | `Character_USSR_NI_Sapper.et` | `{8C966363D98C3D2F}` | OK | Rifle_AK74 |  |
| Naval Infantry Platoon Sergeant | Взводный сержант морской пехоты | `Character_USSR_NI_Sergeant.et` | `{D4B48CB2120CD6E0}` | OK | Rifle_AK74 |  |
| Naval Infantry Sharpshooter | Пехотный снайпер морской пехоты | `Character_USSR_NI_Sharpshooter.et` | `{8CDEE565CB49D126}` | OK | Rifle_SVD_PSO |  |
| Unarmed | Невооруженный | `Character_USSR_NI_Unarmed.et` | `{2BC3C5A7294A3289}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

### Spetsnaz (9)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Special Forces | Спецназ | `Character_USSR_SF.et` | `{2DB452B3EC386B92}` | OK | Rifle_AK74N |  |
| Special Forces Grenadier | Гранатометчик спецназа | `Character_USSR_SF_GL.et` | `{B823C229EC3981B7}` | OK | Rifle_AK74N_GP25 |  |
| Special Forces Machine-Gunner | Пулеметчик спецназа | `Character_USSR_SF_LMG.et` | `{0B8AC0C3C447F90E}` | OK | MG_RPK74N, Flare_RSP30_green |  |
| Special Forces Medic | Врач спецназа | `Character_USSR_SF_Medic.et` | `{8CA70597606992EC}` | OK | Rifle_AKS74UN |  |
| Special Forces Officer | Офицер спецназа | `Character_USSR_SF_Officer.et` | `{B2A71FE01BA567D6}` | OK_CATALOG | Rifle_AKS74UN, Handgun_PM |  |
| Special Forces Radio Operator | Радист спецназа | `Character_USSR_SF_RTO.et` | `{B6A2736A7201DD23}` | OK | Rifle_AKS74UN |  |
| Special Forces Squad Leader | Командир спецназа | `Character_USSR_SF_SL.et` | `{5811F02495F6810E}` | OK | Rifle_AK74N_GP25 |  |
| Special Forces Sapper | Сапер спецназа | `Character_USSR_SF_Sapper.et` | `{730CDEC4168637B6}` | OK | Rifle_AKS74UN, Launcher_RPG22 |  |
| Special Forces Sharpshooter | Снайпер спецназа | `Character_USSR_SF_Sharpshooter.et` | `{ADB43E67E3766CE7}` | OK | Rifle_SVD_PSO |  |

### Spetsnaz/Suppressed (7)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Special Forces Grenadier - Recon | Гранатометчик спецназа (разведка) | `Character_USSR_SF_GL_S.et` | `{CF43078FA4830404}` | OK | Rifle_AK74N_PBS4_GP25 |  |
| Special Forces Medic - Recon | Врач спецназа (разведка) | `Character_USSR_SF_Medic_S.et` | `{029FF8F84148012E}` | OK | Rifle_AKS74UN_PBS4 |  |
| Special Forces Radio Operator - Recon | Радист спецназа (разведка) | `Character_USSR_SF_RTO_S.et` | `{1523C468AAF90312}` | OK | Rifle_AKS74UN_PBS4 |  |
| Special Forces - Recon | Боец спецназа (разведка) | `Character_USSR_SF_S.et` | `{4D20F57C29B6EC1D}` | OK | Rifle_AK74N_PBS4 |  |
| Special Forces Squad Leader - Recon | Командир спецназа (разведка) | `Character_USSR_SF_SL_S.et` | `{6C1FFF78CD4E4ADA}` | OK | Rifle_AK74N_PBS4 |  |
| Special Forces Sapper - Recon | Сапер спецназа (разведка) | `Character_USSR_SF_Sapper_S.et` | `{A16C1DE30B6957D9}` | OK | Rifle_AKS74UN_PBS4, Launcher_RPG22 |  |
| Special Forces Sharpshooter - Recon | Снайпер спецназа (разведка) | `Character_USSR_SF_Sharpshooter_S.et` | `{5EFF3963153BE048}` | OK | Rifle_AK74N_PBS4_1P29 |  |

Skipped random/randomized wrappers (2): Character_USSR_Randomized, Character_USSR_Randomized_KLMK

Skipped abstract parents (3): Character_USSR_Base, Character_USSR_BaseLoadout, Character_USSR_SF_BaseLoadout

## FIA — FIA (vanilla)

Sources: `ReforgerData/Configs/EntityCatalog/FIA/Characters_EntityCatalog_FIA.conf`; sweep of `reference/ReforgerData` under `Prefabs/Characters/Factions/INDFOR/FIA/`. Paths below are relative to that prefix.

### (root) (21)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_FIA_AAT.et` | `{FF43925D26526B95}` | OK | Rifle_VZ58P |  |
| Guerrilla | Партизан | `Character_FIA_AC.et` | `{9503CB9B3463BA1E}` | OK | Handgun_PM |  |
| Guerrilla - Grenadier | Партизан (гранатометчик) | `Character_FIA_AC_Grenadier.et` | `{5C0DC0BE7F1A7346}` | OK | Handgun_PM |  |
| Guerrilla - Medic | Партизан (медик) | `Character_FIA_AC_Medic.et` | `{4E29194BA809DF32}` | OK | Handgun_PM |  |
| Guerrilla - Spotter | Партизан (корректировщик огня) | `Character_FIA_AC_Scout.et` | `{B4977616CD19191A}` | OK | Handgun_PM |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_FIA_AMG.et` | `{75FC25863194612A}` | OK | Rifle_VZ58P |  |
| Anti-Tank Specialist | Бронебойщик | `Character_FIA_AT.et` | `{D25BC9815A9F9E8D}` | OK | Rifle_VZ58P, Launcher_RPG7 |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_FIA_Ammo.et` | `{48F96834C3289E04}` | OK | Rifle_VZ58P |  |
| Crew Commander | Командир экипажа | `Character_FIA_CC.et` | `{7B171A8ADD2664FE}` | OK | Rifle_VZ58V |  |
| Crewman | Член экипажа | `Character_FIA_Crew.et` | `{641AD7731E23454B}` | OK | Rifle_VZ58V |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_FIA_LAT.et` | `{C77DFB8546B3F2A2}` | OK | Rifle_VZ58P, Launcher_RPG75 |  |
| Machine-Gunner | Пулеметчик | `Character_FIA_MG.et` | `{58E47E5A4D599432}` | OK | MG_UK59_4x8, Handgun_PM |  |
| Medic | Врач | `Character_FIA_Medic.et` | `{45A02CA25CBA9443}` | OK | Rifle_VZ58V |  |
| Platoon Leader | Командир взвода | `Character_FIA_PL.et` | `{FE65E8C60C751352}` | OK | Rifle_VZ58V, Handgun_PM |  |
| Combat Signaler | Связист | `Character_FIA_RTO.et` | `{23D81C023DBF85AC}` | OK | Rifle_VZ58P |  |
| Rifleman | Стрелок | `Character_FIA_Rifleman.et` | `{84B40583F4D1B7A3}` | OK | Rifle_VZ58P |  |
| Squad Leader | Командир отделения | `Character_FIA_SL.et` | `{677B515F119222C2}` | OK | Rifle_VZ58V |  |
| Sapper | Сапер | `Character_FIA_Sapper.et` | `{066644E57BA1E26E}` | OK | Rifle_VZ58P |  |
| Scout | Разведчик | `Character_FIA_Scout.et` | `{BF1E43FF39AA526B}` | OK | Rifle_VZ58V |  |
| Sharpshooter | Пехотный снайпер | `Character_FIA_Sharpshooter.et` | `{CE33AB22F61F3365}` | OK | Rifle_SVD_PSO, Handgun_PM |  |
| Unarmed | Невооруженный | `Character_FIA_Unarmed.et` | `{854C04F0EA2129CC}` | OK | — | UNARMED (no weapon in slots or inventory) |

### Special Units (4)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Guerrilla | Партизан | `Character_FIA_AC_Partisan.et` | `{254F12535581E4C2}` | UNCATALOGED_VANILLA | Rifle_VZ58V, Handgun_PM |  |
| Guerrilla - Grenadier | Партизан (гранатометчик) | `Character_FIA_AC_Partisan_Grenadier.et` | `{273F0239FE94FDA5}` | UNCATALOGED_VANILLA | Handgun_PM |  |
| Machine-Gunner | Пулеметчик | `Character_FIA_MG_Elite.et` | `{244E2E8B42B42490}` | UNCATALOGED_VANILLA | MG_UK59_4x8, Handgun_PM |  |
| Sharpshooter | Пехотный снайпер | `Character_FIA_Rebel_Sharpshooter.et` | `{1FDA92972C1B771B}` | UNCATALOGED_VANILLA | Rifle_SVD_PSO, Handgun_PM |  |

Skipped random/randomized wrappers (1): Character_FIA_Randomized

Skipped abstract parents (2): Character_FIA_BaseLoadout, Character_FIA_base

## RHS_USAF — RHS USAF (RHS Status Quo)

Sources: `RHS Status Quo/Configs/EntityCatalog/USMC/USMC_Characters.conf`; sweep of `reference/RHS Status Quo` under `Prefabs/Characters/Factions/BLUFOR/RHS_USAF/`. Paths below are relative to that prefix.

### RHS_USAF_Army (1)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Rifleman | Стрелок | `Character_RHS_USA_Rifleman.et` | `{8A8897B257013B36}` | UNCATALOGED_LAYER | Rifle_M4A1_ARMY_ACOG2 |  |

### RHS_USAF_FORECON (52)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Ammunition Bearer M249 | Подносчик боеприпасов M249 | `Character_RHS_USAF_FORECON_AAR.et` | `{00A5B7F435759703}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 |  |
| Ammunition Bearer M249 | Подносчик боеприпасов M249 | `Character_RHS_USAF_FORECON_AAR_2.et` | `{822102BED7615E1C}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_AAR |
| Ammunition Bearer M249 | Подносчик боеприпасов M249 | `Character_RHS_USAF_FORECON_AAR_3.et` | `{67BD4E47DB84C977}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_AAR |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_FORECON_AMG.et` | `{52B269EE5B3A83E0}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 |  |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_FORECON_AMG2.et` | `{3CC541D895D9AE7F}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon13, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_AMG |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_FORECON_AMG3.et` | `{D9590D21993C3914}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_AMG |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_AR.et` | `{75B8E80FADCF99F2}` | UNCATALOGED_PREFAB | MG_M249, Handgun_M18 |  |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_AR_2.et` | `{867B7780A9DCA714}` | UNCATALOGED_PREFAB | MG_M249, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_AR |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_AR_3.et` | `{63E73B79A539307F}` | UNCATALOGED_PREFAB | MG_M249, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_AR |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_FORECON_Ammo.et` | `{AFFCF999D95E052F}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_FORECON_Ammo2.et` | `{6D4813AB6C0EB95E}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_FORECON_Ammo3.et` | `{88D45F5260EB2E35}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon14, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Ammo |
| Grenadier | Гренадер | `Character_RHS_USAF_FORECON_GL.et` | `{786D962E5A78F0D8}` | UNCATALOGED_PREFAB | Rifle_M4A1_M203_RAS_Aimpoint, Handgun_M18 |  |
| Grenadier | Гренадер | `Character_RHS_USAF_FORECON_GL2.et` | `{38C77F7BB9382939}` | UNCATALOGED_PREFAB | Rifle_M4A1_M203_RAS_Aimpoint, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_GL |
| Grenadier | Гренадер | `Character_RHS_USAF_FORECON_GL3.et` | `{DD5B3382B5DDBE52}` | UNCATALOGED_PREFAB | Rifle_M4A1_M203_RAS_Aimpoint, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_GL |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_FORECON_LAT.et` | `{1555DD4816FDEF84}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon4, Launcher_M72A3, Handgun_M18 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_FORECON_LAT2.et` | `{8F56A1F94CA55C3A}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon3, Launcher_M72A3, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_FORECON_LAT3.et` | `{6ACAED004040CB51}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon2, Launcher_M72A3, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_LAT |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_FORECON_MG.et` | `{27AF3615C3808D11}` | UNCATALOGED_PREFAB | MG_M240_MDO, Handgun_M18 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_FORECON_MG2.et` | `{5A1BB6FBD3312A2D}` | UNCATALOGED_PREFAB | MG_M240_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_FORECON_MG3.et` | `{BF87FA02DFD4BD46}` | UNCATALOGED_PREFAB | MG_M240_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_MG |
| Medic | Врач | `Character_RHS_USAF_FORECON_Medic.et` | `{8A286A16130B1522}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon8, Handgun_M18 |  |
| Medic | Врач | `Character_RHS_USAF_FORECON_Medic2.et` | `{7E62EA30BF7565CC}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon9, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Medic |
| Medic | Врач | `Character_RHS_USAF_FORECON_Medic3.et` | `{9BFEA6C9B390F2A7}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon5, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Medic |
| Squad Leader | Командир отделения | `Character_RHS_USAF_FORECON_PL.et` | — | UNCATALOGED_NO_GUID | Rifle_M4A1_RAS_ERGO_Forecon1, Handgun_M18 |  |
| Combat Signaler | Связист | `Character_RHS_USAF_FORECON_RTO.et` | `{0496506A57116766}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 |  |
| Combat Signaler | Связист | `Character_RHS_USAF_FORECON_RTO_2.et` | `{311CA19C71F79A9A}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_RTO |
| Combat Signaler | Связист | `Character_RHS_USAF_FORECON_RTO_3.et` | `{D480ED657D120DF1}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_RTO |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_Rifleman.et` | `{E92B2A4970D82027}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 |  |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_Rifleman2.et` | `{AC4C64855DD11188}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon6, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Rifleman |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_Rifleman3.et` | `{49D0287C513486E3}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon7, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_USAF_FORECON_SL.et` | `{183019109F4B3BE1}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon1, Handgun_M18 |  |
| Squad Leader | Командир отделения | `Character_RHS_USAF_FORECON_SL2.et` | `{7337B254415C3AC8}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon13, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_SL |
| Squad Leader | Командир отделения | `Character_RHS_USAF_FORECON_SL3.et` | `{96ABFEAD4DB9ADA3}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_SL |
| Sapper | Сапер | `Character_RHS_USAF_FORECON_Sapper.et` | `{7391108D2C771C94}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 |  |
| Sapper | Сапер | `Character_RHS_USAF_FORECON_Sapper_2.et` | `{471AF5E1AB0EDA64}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Sapper |
| Sapper | Сапер | `Character_RHS_USAF_FORECON_Sapper_3.et` | `{A286B918A7EB4D0F}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon11, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Sapper |
| Scout | Разведчик | `Character_RHS_USAF_FORECON_Scout.et` | `{7096054B761BD30A}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_0_NT4_FORECON, Handgun_M18 |  |
| Scout | Разведчик | `Character_RHS_USAF_FORECON_Scout2.et` | `{5132D6DDC69E2287}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_0_NT4_FORECON, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Scout |
| Scout | Разведчик | `Character_RHS_USAF_FORECON_Scout3.et` | `{B4AE9A24CA7BB5EC}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_0_NT4_FORECON, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Scout |
| Scout | Разведчик | `Character_RHS_USAF_FORECON_Scout_RTO.et` | `{727988529E6D5B83}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_0_NT4_FORECON, Handgun_M18 |  |
| Scout | Разведчик | `Character_RHS_USAF_FORECON_Scout_RTO_2.et` | `{0223B730158F82EF}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_0_NT4_FORECON, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Scout_RTO |
| Scout | Разведчик | `Character_RHS_USAF_FORECON_Scout_RTO_3.et` | `{E7BFFBC9196A1584}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_0_NT4_FORECON, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Scout_RTO |
| Sniper | Снайпер | `Character_RHS_USAF_FORECON_Sniper.et` | `{1D1C88EC1B58537E}` | UNCATALOGED_CATALOG | Rifle_M40A5_Optic_PEQ, Handgun_M17 |  |
| Spotter | Корректировщик огня | `Character_RHS_USAF_FORECON_Spotter.et` | `{857E30A69B9985BD}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_ForeconThermal, Handgun_M18 |  |
| Spotter | Корректировщик огня | `Character_RHS_USAF_FORECON_Spotter2.et` | `{347CD24BC51C9418}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_ForeconThermal, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_USAF_FORECON_Spotter3.et` | `{D1E09EB2C9F90373}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_ForeconThermal, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_Spotter |
| Team Leader | Командир группы | `Character_RHS_USAF_FORECON_TL.et` | `{1FF7E341F9CD8122}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon12, Handgun_M18 |  |
| Team Leader | Командир группы | `Character_RHS_USAF_FORECON_TL2.et` | `{3AEFA74B339A4EA2}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon10, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_TL |
| Team Leader | Командир группы | `Character_RHS_USAF_FORECON_TL3.et` | `{DF73EBB23F7FD9C9}` | UNCATALOGED_PREFAB | Rifle_M4A1_RAS_ERGO_Forecon9, Handgun_M18 | cosmetic variant of Character_RHS_USAF_FORECON_TL |
| Team Leader | Командир группы | `Character_RHS_USAF_FORECON_TL_Marksman.et` | — | UNCATALOGED_NO_GUID | Rifle_M38SDMR_manta_covers, Handgun_M18 |  |
| Rifleman | Стрелок | `Character_RHS_USAF_FORECON_Unarmed.et` | — | UNCATALOGED_NO_GUID | — | UNARMED (no weapon in slots or inventory) |

### RHS_USAF_MARSOC (36)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USMC_MARSOC_AMG.et` | `{358ED1265B29F1AE}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS, Handgun_M18 |  |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USMC_MARSOC_AMG_2.et` | `{8180286909FBE349}` | OK | Rifle_M4A1_BLOCK_II_FSP_ACOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_AMG |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USMC_MARSOC_AMG_3.et` | `{641C6490051E7422}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_AMG |
| Machine-Gunner | Пулеметчик | `Character_RHS_USMC_MARSOC_AR.et` | `{39DE841FBF372194}` | UNCATALOGED_PREFAB | MG_M249, Handgun_M18 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_USMC_MARSOC_AR2.et` | `{1320AD60B56F7285}` | UNCATALOGED_PREFAB | MG_M249, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_AR |
| Machine-Gunner | Пулеметчик | `Character_RHS_USMC_MARSOC_AR3.et` | `{F6BCE199B98AE5EE}` | UNCATALOGED_PREFAB | MG_M249, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_AR |
| Grenadier | Гренадер | `Character_RHS_USMC_MARSOC_GL.et` | `{340BFA3E488048BE}` | OK | Rifle_M4A1_M203_BLOCK_II_SU230, Handgun_M18 |  |
| Grenadier | Гренадер | `Character_RHS_USMC_MARSOC_GL2.et` | `{5FFBC7B3B92B5B77}` | OK | Rifle_M4A1_M203_BLOCK_II_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_GL |
| Grenadier | Гренадер | `Character_RHS_USMC_MARSOC_GL3.et` | `{BA678B4AB5CECC1C}` | OK | Rifle_M4A1_M203_BLOCK_II_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_GL |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USMC_MARSOC_LAT.et` | `{7269658016EE9DCA}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers, Launcher_M72A3, Handgun_M18 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USMC_MARSOC_LAT2.et` | `{2BB3DE6A60048FA1}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers, Launcher_M72A3, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USMC_MARSOC_LAT3.et` | `{CE2F92936CE118CA}` | OK | Rifle_M4A1_BLOCK_II_FSP_SU230, Launcher_M72A3, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_LAT |
| Machine-Gunner | Пулеметчик | `Character_RHS_USMC_MARSOC_MG.et` | `{6BC95A05D1783577}` | OK | MG_M240_Light_MDO, Handgun_M18 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_USMC_MARSOC_MG2.et` | `{3D270E33D3225863}` | OK | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_USMC_MARSOC_MG3.et` | `{D8BB42CADFC7CF08}` | OK | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MG |
| Medic | Врач | `Character_RHS_USMC_MARSOC_Medic.et` | `{1CE48B40E06B1DEE}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS, Handgun_M18 |  |
| Medic | Врач | `Character_RHS_USMC_MARSOC_Medic2.et` | `{EE96846E6F38D917}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Medic |
| Medic | Врач | `Character_RHS_USMC_MARSOC_Medic3.et` | `{0B0AC89763DD4E7C}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Medic |
| Combat Signaler | Связист | `Character_RHS_USMC_MARSOC_RTO.et` | `{C0FF3E29DD8E8D51}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_II_SU230_nocovers, Handgun_M18 |  |
| Sensor Operator | Радиоразведчик | `Character_RHS_USMC_MARSOC_RadioRecon.et` | `{D2CF8EAB01654CFA}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_II_SU230_nocovers, Device_SpectrumDevice_base, Handgun_M18 |  |
| Rifleman | Стрелок | `Character_RHS_USMC_MARSOC_Rifleman.et` | `{1FA45046DA1FC409}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers, Handgun_M18 |  |
| Rifleman | Стрелок | `Character_RHS_USMC_MARSOC_Rifleman2.et` | `{695CA068E1DF65A2}` | OK | Rifle_M4A1_BLOCK_II_FSP_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Rifleman |
| Rifleman | Стрелок | `Character_RHS_USMC_MARSOC_Rifleman3.et` | `{8CC0EC91ED3AF2C9}` | OK | Rifle_M4A1_BLOCK_II_FSP_ACOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_USMC_MARSOC_SL.et` | `{EB4F847EEDFF4FCB}` | OK | Rifle_M4A1_BLOCK_II_SU230, Handgun_M18 |  |
| Squad Leader | Командир отделения | `Character_RHS_USMC_MARSOC_SL_2.et` | `{871BB09E513BC0E5}` | OK | Rifle_M4A1_BLOCK_II_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_SL |
| Squad Leader | Командир отделения | `Character_RHS_USMC_MARSOC_SL_3.et` | `{6287FC675DDE578E}` | OK | Rifle_M4A1_BLOCK_II_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_SL |
| Scout | Разведчик | `Character_RHS_USMC_MARSOC_Scout.et` | `{E65AE41D857BDBC6}` | OK | Rifle_M4A1_MK18_Eot, Handgun_M18 |  |
| Scout | Разведчик | `Character_RHS_USMC_MARSOC_Scout2.et` | `{C1C6B88316D39E5C}` | OK | Rifle_M4A1_MK18_Eot_2, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Scout |
| Scout | Разведчик | `Character_RHS_USMC_MARSOC_Scout3.et` | `{245AF47A1A360937}` | OK | Rifle_M4A1_BLOCK_II_FSP_EXPS, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Scout |
| Sniper | Снайпер | `Character_RHS_USMC_MARSOC_Sniper.et` | `{8DE8E6B2CB15EFA5}` | OK | Rifle_M40A5_Optic, Handgun_M18 |  |
| Spotter | Корректировщик огня | `Character_RHS_USMC_MARSOC_Spotter.et` | `{C5746D78F7E68FE6}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_II_PAS13, Handgun_M18 |  |
| Spotter | Корректировщик огня | `Character_RHS_USMC_MARSOC_Spotter2.et` | `{E4240E32507AEE37}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_II_PAS13, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_USMC_MARSOC_Spotter3.et` | `{01B842CB5C9F795C}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_II_PAS13, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_Spotter |
| Team Leader | Командир группы | `Character_RHS_USMC_MARSOC_TL.et` | `{53918F51EB353944}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers_MRDS, Handgun_M18 |  |
| Team Leader | Командир группы | `Character_RHS_USMC_MARSOC_TL2.et` | `{5DD31F8333893CEC}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_TL |
| Team Leader | Командир группы | `Character_RHS_USMC_MARSOC_TL3.et` | `{B84F537A3F6CAB87}` | OK | Rifle_M4A1_BLOCK_II_SU230_nocovers, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_TL |

### RHS_USAF_MARSOC_MC (27)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USMC_MARSOC_MC_AMG.et` | `{C3F899887E0E60A3}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 |  |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USMC_MARSOC_MC_AMG2.et` | `{A4025B29E5032ACE}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_AMG |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USMC_MARSOC_MC_AMG3.et` | `{419E17D0E9E6BDA5}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_AMG |
| Grenadier | Гренадер | `Character_RHS_USMC_MARSOC_MC_GL.et` | `{E4B74EE9CCA2D0FF}` | UNCATALOGED_PREFAB | Rifle_M4A1_M203_BLOCK_II_SU230, Handgun_M18 |  |
| Grenadier | Гренадер | `Character_RHS_USMC_MARSOC_MC_GL2.et` | `{A98D8F1D9C0CCA7A}` | UNCATALOGED_PREFAB | Rifle_M4A1_M203_BLOCK_II_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_GL |
| Grenadier | Гренадер | `Character_RHS_USMC_MARSOC_MC_GL3.et` | `{4C11C3E490E95D11}` | UNCATALOGED_PREFAB | Rifle_M4A1_M203_BLOCK_II_SU230, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_GL |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USMC_MARSOC_MC_LAT.et` | `{841F2D2E33C90CC7}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Launcher_M72A3, Handgun_M18 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USMC_MARSOC_MC_LAT2.et` | `{1791BB083C7FD88B}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Launcher_M72A3, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USMC_MARSOC_MC_LAT3.et` | `{F20DF7F1309A4FE0}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Launcher_M72A3, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_LAT |
| Machine-Gunner M240 | Пулеметчик M240 | `Character_RHS_USMC_MARSOC_MC_MG.et` | `{BB75EED2555AAD36}` | UNCATALOGED_PREFAB | MG_M240_Light_MDO, Handgun_M18 |  |
| Machine-Gunner M240 | Пулеметчик M240 | `Character_RHS_USMC_MARSOC_MC_MG2.et` | `{CB51469DF605C96E}` | UNCATALOGED_PREFAB | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_MG |
| Machine-Gunner M240 | Пулеметчик M240 | `Character_RHS_USMC_MARSOC_MC_MG3.et` | `{2ECD0A64FAE05E05}` | UNCATALOGED_PREFAB | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_MG |
| Medic | Врач | `Character_RHS_USMC_MARSOC_MC_Medic.et` | `{4F93CAD338D98CBE}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 |  |
| Medic | Врач | `Character_RHS_USMC_MARSOC_MC_Medic2.et` | `{E2FE4F605D1A7662}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_Medic |
| Medic | Врач | `Character_RHS_USMC_MARSOC_MC_Medic3.et` | `{0762039951FFE109}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_Medic |
| Rifleman | Стрелок | `Character_RHS_USMC_MARSOC_MC_Rifleman.et` | `{1AACE38A84710440}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 |  |
| Rifleman | Стрелок | `Character_RHS_USMC_MARSOC_MC_Rifleman2.et` | `{6A2CEB9828B7F6EE}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_Rifleman |
| Rifleman | Стрелок | `Character_RHS_USMC_MARSOC_MC_Rifleman3.et` | `{8FB0A76124526185}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_USMC_MARSOC_MC_SL.et` | `{84EAC1D709911BC6}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 |  |
| Squad Leader | Командир отделения | `Character_RHS_USMC_MARSOC_MC_SL2.et` | `{E27D42326468D98B}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_SL |
| Squad Leader | Командир отделения | `Character_RHS_USMC_MARSOC_MC_SL3.et` | `{07E10ECB688D4EE0}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_SL |
| Spotter | Корректировщик огня | `Character_RHS_USMC_MARSOC_MC_Spotter.et` | `{524957B40B9EEFFE}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_temp_bebra_thermal, Handgun_M18 |  |
| Spotter | Корректировщик огня | `Character_RHS_USMC_MARSOC_MC_Spotter2.et` | `{C7FB1B8831B5B07F}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_temp_bebra_thermal, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_USMC_MARSOC_MC_Spotter3.et` | `{226757713D502714}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_temp_bebra_thermal, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_Spotter |
| Team Leader | Командир группы | `Character_RHS_USMC_MARSOC_MC_TL.et` | `{832D3B866F17A105}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 |  |
| Team Leader | Командир группы | `Character_RHS_USMC_MARSOC_MC_TL2.et` | `{ABA5572D16AEADE1}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_TL |
| Team Leader | Командир группы | `Character_RHS_USMC_MARSOC_MC_TL3.et` | `{4E391BD41A4B3A8A}` | UNCATALOGED_PREFAB | Rifle_M4A1_URGI_145_RIS_Raider_VCOG, Handgun_M18 | cosmetic variant of Character_RHS_USMC_MARSOC_MC_TL |

### RHS_USAF_USMC_MEF (74)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant M249 | Помощник пулеметчика M249 | `Character_RHS_USAF_USMC_AAR.et` | `{9E0B5441B270B059}` | OK | Rifle_M27IAR_VC18DSCO |  |
| Machine-Gunner Assistant M249 | Помощник пулеметчика M249 | `Character_RHS_USAF_USMC_AAR_2.et` | `{97C5A978B53B8FA5}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_AAR |
| Machine-Gunner Assistant M249 | Помощник пулеметчика M249 | `Character_RHS_USAF_USMC_AAR_3.et` | `{7259E581B9DE18CE}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_AAR |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_USAF_USMC_AAT.et` | `{BDE77F3F89FA3EF5}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_USAF_USMC_AAT_2.et` | `{2A15FBFFCA2093BB}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_USAF_USMC_AAT_3.et` | `{CF89B706C6C504D0}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_AAT |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_USMC_AMG.et` | `{3758C8E49E3C344A}` | OK | Rifle_M27IAR_VC18DSCO |  |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_USMC_AMG_2.et` | `{02A862F998C13A3C}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_AMG |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_USMC_AMG_3.et` | `{E7342E009424AD57}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_USAF_USMC_AR.et` | `{66876AB6DB22430B}` | OK | MG_M249 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_USAF_USMC_AR_2.et` | `{94FA45F8CF896AC2}` | OK | MG_M249 | cosmetic variant of Character_RHS_USAF_USMC_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_USAF_USMC_AR_3.et` | `{71660901C36CFDA9}` | OK | MG_M249 | cosmetic variant of Character_RHS_USAF_USMC_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_USAF_USMC_AT.et` | `{FA4771514D0D700A}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Launcher_MK153mod2 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_USAF_USMC_AT_2.et` | `{CCB65B86BC77E1B7}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Launcher_MK153mod2 | cosmetic variant of Character_RHS_USAF_USMC_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_USAF_USMC_AT_3.et` | `{292A177FB09276DC}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Launcher_MK153mod2 | cosmetic variant of Character_RHS_USAF_USMC_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_USMC_Ammo.et` | `{58E18718B3EE5F92}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_USMC_Ammo_2.et` | `{ED8318F49373BE75}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_USMC_Ammo_3.et` | `{081F540D9F96291E}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_Ammo |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_Crew.et` | `{7402385F6EE584DD}` | OK | Rifle_M4_RAS_PMAG, Handgun_M18 |  |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_CrewLdr.et` | `{676DDD0176A01169}` | OK | Rifle_M4_RAS_RCO_PEQ, Handgun_M18 |  |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_CrewLdr_2.et` | `{095BA8BEF81B61DC}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_CrewLdr |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_CrewLdr_3.et` | `{ECC7E447F4FEF6B7}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_CrewLdr |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_Crew_2.et` | `{B214FD5C643C3679}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_PMAG, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Crew |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_Crew_3.et` | `{5788B1A568D9A112}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_PMAG, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Crew |
| Grenadier | Гренадер | `Character_RHS_USAF_USMC_GL.et` | `{6B5214972C952A21}` | OK | Rifle_M4_M203_RAS_RCO_PEQ |  |
| Grenadier | Гренадер | `Character_RHS_USAF_USMC_GL_2.et` | `{AB5C72D77FEE1BE7}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_GL |
| Grenadier | Гренадер | `Character_RHS_USAF_USMC_GL_3.et` | `{4EC03E2E730B8C8C}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_GL |
| Helicopter Crew | Экипаж вертолета | `Character_RHS_USAF_USMC_HeliCrew.et` | `{15CD521098748196}` | OK_CATALOG | Handgun_M18 |  |
| Helicopter Pilot | Пилот вертолета | `Character_RHS_USAF_USMC_HeliPilot.et` | `{42A502E3BB727CEC}` | OK | Handgun_M18 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_USMC_LAT.et` | `{AE2E93B28352053F}` | OK | Rifle_M27IAR_VC18DSCO, Launcher_M72A3 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_USMC_LAT_2.et` | `{0AE40DDCD21DDE75}` | OK | Rifle_M27IAR_VC18DSCO, Launcher_M72A3 | cosmetic variant of Character_RHS_USAF_USMC_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_USMC_LAT_3.et` | `{EF784125DEF8491E}` | OK | Rifle_M27IAR_VC18DSCO, Launcher_M72A3 | cosmetic variant of Character_RHS_USAF_USMC_LAT |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_USMC_MG.et` | `{70F8C68A5ACB7AB5}` | OK | MG_M240_Light_MDO, Handgun_M18 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_USMC_MG_2.et` | `{E40BC280EE964830}` | OK | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_USMC_MG_3.et` | `{01978E79E273DF5B}` | OK | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_MG |
| Medic | Врач | `Character_RHS_USAF_USMC_Medic.et` | `{0C1639553F575AD3}` | OK | Rifle_M4_RAS_ACOG_ARD_PEQ |  |
| Medic | Врач | `Character_RHS_USAF_USMC_Medic_2.et` | `{9C561B1BBF532C6C}` | OK | Rifle_M4_RAS_ACOG_ARD_PEQ | cosmetic variant of Character_RHS_USAF_USMC_Medic |
| Medic | Врач | `Character_RHS_USAF_USMC_Medic_3.et` | `{79CA57E2B3B6BB07}` | OK | Rifle_M4_RAS_ACOG_ARD_PEQ | cosmetic variant of Character_RHS_USAF_USMC_Medic |
| Officer | Офицер | `Character_RHS_USAF_USMC_Officer.et` | `{8CD3EE2E80AB4820}` | UNCATALOGED_LAYER | Handgun_M17 |  |
| Platoon Leader | Командир взвода | `Character_RHS_USAF_USMC_PL.et` | `{D67950161BE7FDD5}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 |  |
| Platoon Leader | Командир взвода | `Character_RHS_USAF_USMC_PL_2.et` | `{DE46E1C1A13ABA44}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_PL |
| Platoon Leader | Командир взвода | `Character_RHS_USAF_USMC_PL_3.et` | `{3BDAAD38ADDF2D2F}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_PL |
| Combat Signaler | Связист | `Character_RHS_USAF_USMC_RTO.et` | `{9A38B3DFD014403C}` | OK | Rifle_M4_RAS_RCO_PEQ |  |
| Combat Signaler | Связист | `Character_RHS_USAF_USMC_RTO_2.et` | `{24F80A5A13AD4B23}` | OK | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_RTO |
| Combat Signaler | Связист | `Character_RHS_USAF_USMC_RTO_3.et` | `{C16446A31F48DC48}` | OK | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_RTO |
| Rifleman | Стрелок | `Character_RHS_USAF_USMC_Rifleman.et` | `{CB4B1645B748D5D4}` | OK | Rifle_M27IAR_VC18DSCO_LC |  |
| Rifleman | Стрелок | `Character_RHS_USAF_USMC_Rifleman_2.et` | `{BA5842946E1CA1B7}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_Rifleman |
| Rifleman | Стрелок | `Character_RHS_USAF_USMC_Rifleman_3.et` | `{5FC40E6D62F936DC}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_USAF_USMC_SL.et` | `{0B0F9BA9E9A6E118}` | OK | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 |  |
| Squad Leader | Командир отделения | `Character_RHS_USAF_USMC_SL_2.et` | `{D4E3B18C172A49C3}` | OK | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_SL |
| Squad Leader | Командир отделения | `Character_RHS_USAF_USMC_SL_3.et` | `{317FFD751BCFDEA8}` | OK | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_SL |
| Sapper | Сапер | `Character_RHS_USAF_USMC_Sapper.et` | `{FAC429BE41EFFA37}` | OK | Rifle_M27IAR_VC18DSCO_LC |  |
| Sapper | Сапер | `Character_RHS_USAF_USMC_Sapper_2.et` | `{A5B29098B146CECF}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_Sapper |
| Sapper | Сапер | `Character_RHS_USAF_USMC_Sapper_3.et` | `{402EDC61BDA359A4}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_Sapper |
| Scout | Разведчик | `Character_RHS_USAF_USMC_Scout.et` | `{6572AE8D144102B3}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_TA31RCO, Handgun_M18 |  |
| Scout | Разведчик | `Character_RHS_USAF_USMC_Scout_2.et` | `{1C548F6E9D2E0266}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_TA31RCO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Scout |
| Scout | Разведчик | `Character_RHS_USAF_USMC_Scout_3.et` | `{F9C8C39791CB950D}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_TA31RCO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Scout |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_USAF_USMC_Scout_RTO.et` | `{BF7824B53330C399}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_su231A, Handgun_M18 |  |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_USAF_USMC_Scout_RTO_2.et` | `{E1E6E1C43C9184CC}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_su231A, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Scout_RTO |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_USAF_USMC_Scout_RTO_3.et` | `{047AAD3D307413A7}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_su231A, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Scout_RTO |
| Platoon Sergeant | Взводный сержант | `Character_RHS_USAF_USMC_Sergeant.et` | `{B076ECE5FAB4379B}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 |  |
| Platoon Sergeant | Взводный сержант | `Character_RHS_USAF_USMC_Sergeant_2.et` | `{8EE26080F2C8B805}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Sergeant |
| Platoon Sergeant | Взводный сержант | `Character_RHS_USAF_USMC_Sergeant_3.et` | `{6B7E2C79FE2D2F6E}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_Sergeant |
| Sniper | Снайпер | `Character_RHS_USAF_USMC_Sniper.et` | `{19678B9267B3574A}` | OK | Rifle_M40A5_Optic_PEQ, Handgun_M18 |  |
| Spotter | Корректировщик огня | `Character_RHS_USAF_USMC_Spotter.et` | `{B74E289F7EDF5D62}` | OK | Rifle_M4_M203_RAS_RCO_PEQ |  |
| Spotter | Корректировщик огня | `Character_RHS_USAF_USMC_Spotter_2.et` | `{F1B83A028E79CD21}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_USAF_USMC_Spotter_3.et` | `{142476FB829C5A4A}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_Spotter |
| Team Leader | Командир группы | `Character_RHS_USAF_USMC_TL.et` | `{0CC861F88F205BDB}` | OK | Rifle_M27IAR_VC18DSCO_LC |  |
| Team Leader | Командир группы | `Character_RHS_USAF_USMC_TL_2.et` | `{0665818A8E5DEDC1}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_TL |
| Team Leader | Командир группы | `Character_RHS_USAF_USMC_TL_3.et` | `{E3F9CD7382B87AAA}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_TL |
| Team Leader M38 | Командир группы M38 | `Character_RHS_USAF_USMC_TL_Marksman.et` | `{3C935933439BDEBD}` | UNCATALOGED_PREFAB | Rifle_M38SDMR, Handgun_M18 |  |
| Team Leader M38 | Командир группы M38 | `Character_RHS_USAF_USMC_TL_Marksman_2.et` | `{2AE2FD9F65749859}` | UNCATALOGED_PREFAB | Rifle_M38SDMR_manta_covers, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_TL_Marksman |
| Team Leader M38 | Командир группы M38 | `Character_RHS_USAF_USMC_TL_Marksman_3.et` | `{CF7EB16669910F32}` | UNCATALOGED_PREFAB | Rifle_M38SDMR_manta_covers, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_TL_Marksman |
| Unarmed | Невооруженный | `Character_RHS_USAF_USMC_Unarmed.et` | `{E6A629723004E6C2}` | OK | — | UNARMED (no weapon in slots or inventory) |

### RHS_USAF_USMC_MEF_D (72)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant M249 | Помощник пулеметчика M249 | `Character_RHS_USAF_USMC_D_AAR.et` | `{85A7600FFD5A052D}` | OK | Rifle_M27IAR_VC18DSCO |  |
| Machine-Gunner Assistant M249 | Помощник пулеметчика M249 | `Character_RHS_USAF_USMC_D_AAR_2.et` | `{943B0EBD1BC95B9F}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_D_AAR |
| Machine-Gunner Assistant M249 | Помощник пулеметчика M249 | `Character_RHS_USAF_USMC_D_AAR_3.et` | `{71A74244172CCCF4}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_D_AAR |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_USAF_USMC_D_AAT.et` | `{460F4C712A4900C7}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_USAF_USMC_D_AAT_2.et` | `{29EB5C3A64D24781}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_USAF_USMC_D_AAT_3.et` | `{CC7710C36837D0EA}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_AAT |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_USMC_D_AMG.et` | `{CCB0FBAA3D8F0A78}` | OK | Rifle_M27IAR_VC18DSCO |  |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_USMC_D_AMG_2.et` | `{0156C53C3633EE06}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_D_AMG |
| Machine-Gunner Assistant M240 | Помощник пулеметчика M240 | `Character_RHS_USAF_USMC_D_AMG_3.et` | `{E4CA89C53AD6796D}` | OK | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_D_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_USAF_USMC_D_AR.et` | `{1162A64DF9C25BA6}` | OK | MG_M249 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_USAF_USMC_D_AR_2.et` | `{4A9AC7C1B0959671}` | OK | MG_M249 | cosmetic variant of Character_RHS_USAF_USMC_D_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_USAF_USMC_D_AR_3.et` | `{AF068B38BC70011A}` | OK | MG_M249 | cosmetic variant of Character_RHS_USAF_USMC_D_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_USAF_USMC_D_AT.et` | `{A7990453CD6F6393}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Launcher_MK153mod2 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_USAF_USMC_D_AT_2.et` | `{F74A9546CF8E8A6F}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Launcher_MK153mod2 | cosmetic variant of Character_RHS_USAF_USMC_D_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_USAF_USMC_D_AT_3.et` | `{12D6D9BFC36B1D04}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Launcher_MK153mod2 | cosmetic variant of Character_RHS_USAF_USMC_D_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_USMC_D_Ammo.et` | `{631D49D8C017344A}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_USMC_D_Ammo_2.et` | `{D435FF669B99DFC0}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_D_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_USAF_USMC_D_Ammo_3.et` | `{31A9B39F977C48AB}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO | cosmetic variant of Character_RHS_USAF_USMC_D_Ammo |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_D_Crew.et` | `{4FFEF69F1D1CEF05}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_PMAG, Handgun_M18 |  |
| Crew Commander | Командир экипажа | `Character_RHS_USAF_USMC_D_CrewLdr.et` | `{AB5BEB68988CC575}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Handgun_M18 |  |
| Crew Commander | Командир экипажа | `Character_RHS_USAF_USMC_D_CrewLdr_2.et` | `{FB705A298BD381AD}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_CrewLdr |
| Crew Commander | Командир экипажа | `Character_RHS_USAF_USMC_D_CrewLdr_3.et` | `{1EEC16D0873616C6}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_RCO_PEQ, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_CrewLdr |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_D_Crew_2.et` | `{8BA21ACE6CD657CC}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_PMAG, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Crew |
| Crewman | Член экипажа | `Character_RHS_USAF_USMC_D_Crew_3.et` | `{6E3E56376033C0A7}` | UNCATALOGED_PREFAB | Rifle_M4_RAS_PMAG, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Crew |
| Grenadier | Гренадер | `Character_RHS_USAF_USMC_D_GL.et` | `{1CB7D86C0E75328C}` | OK | Rifle_M4_M203_RAS_RCO_PEQ |  |
| Grenadier | Гренадер | `Character_RHS_USAF_USMC_D_GL_2.et` | `{90A0BC170C17703F}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_GL |
| Grenadier | Гренадер | `Character_RHS_USAF_USMC_D_GL_3.et` | `{753CF0EE00F2E754}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_GL |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_USMC_D_LAT.et` | `{90570AB3DED27DAA}` | OK | Rifle_M27IAR_VC18DSCO, Launcher_M72A3 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_USMC_D_LAT_2.et` | `{091AAA197CEF0A4F}` | OK | Rifle_M27IAR_VC18DSCO, Launcher_M72A3 | cosmetic variant of Character_RHS_USAF_USMC_D_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_USAF_USMC_D_LAT_3.et` | `{EC86E6E0700A9D24}` | OK | Rifle_M27IAR_VC18DSCO, Launcher_M72A3 | cosmetic variant of Character_RHS_USAF_USMC_D_LAT |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_USMC_D_MG.et` | `{2D26B388DAA9692C}` | OK | MG_M240_Light_MDO, Handgun_M18 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_USMC_D_MG_2.et` | `{DFF70C409D6F23E8}` | OK | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_USAF_USMC_D_MG_3.et` | `{3A6B40B9918AB483}` | OK | MG_M240_Light_MDO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_MG |
| Medic | Врач | `Character_RHS_USAF_USMC_D_Medic.et` | `{FE4D2AC5D50E2125}` | OK | Rifle_M4_RAS_ACOG_ARD_PEQ |  |
| Medic | Врач | `Character_RHS_USAF_USMC_D_Medic_2.et` | `{50602D72517FF870}` | OK | Rifle_M4_RAS_ACOG_ARD_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_Medic |
| Medic | Врач | `Character_RHS_USAF_USMC_D_Medic_3.et` | `{B5FC618B5D9A6F1B}` | OK | Rifle_M4_RAS_ACOG_ARD_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_Medic |
| Officer | Офицер | `Character_RHS_USAF_USMC_D_Officer.et` | `{40E5D8476E879C3C}` | UNCATALOGED_LAYER | Handgun_M17 |  |
| Platoon Leader | Командир взвода | `Character_RHS_USAF_USMC_D_PL.et` | `{8BA725149B85EE4C}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 |  |
| Platoon Leader | Командир взвода | `Character_RHS_USAF_USMC_D_PL_2.et` | `{E5BA2F01D2C3D19C}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_PL |
| Platoon Leader | Командир взвода | `Character_RHS_USAF_USMC_D_PL_3.et` | `{002663F8DE2646F7}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_PL |
| Combat Signaler | Связист | `Character_RHS_USAF_USMC_D_RTO.et` | `{819487919F3EF548}` | OK | Rifle_M4_RAS_RCO_PEQ |  |
| Combat Signaler | Связист | `Character_RHS_USAF_USMC_D_RTO_2.et` | `{2706AD9FBD5F9F19}` | OK | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_RTO |
| Combat Signaler | Связист | `Character_RHS_USAF_USMC_D_RTO_3.et` | `{C29AE166B1BA0872}` | OK | Rifle_M4_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_RTO |
| Rifleman | Стрелок | `Character_RHS_USAF_USMC_D_Rifleman.et` | `{CA8780615993A41E}` | OK | Rifle_M27IAR_VC18DSCO_LC |  |
| Rifleman | Стрелок | `Character_RHS_USAF_USMC_D_Rifleman_2.et` | `{92F378E5D3546642}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_USAF_USMC_D_Rifleman_3.et` | `{776F341CDFB1F129}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_D_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_USAF_USMC_D_SL.et` | `{7CEA5752CB46F9B5}` | OK | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 |  |
| Squad Leader | Командир отделения | `Character_RHS_USAF_USMC_D_SL_2.et` | `{EF1F7F4C64D3221B}` | OK | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_SL |
| Squad Leader | Командир отделения | `Character_RHS_USAF_USMC_D_SL_3.et` | `{0A8333B56836B570}` | OK | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_SL |
| Sapper | Сапер | `Character_RHS_USAF_USMC_D_Sapper.et` | `{EE81C7EAE63F0434}` | OK | Rifle_M27IAR_VC18DSCO_LC |  |
| Sapper | Сапер | `Character_RHS_USAF_USMC_D_Sapper_2.et` | `{642EB46C180BB24C}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_D_Sapper |
| Sapper | Сапер | `Character_RHS_USAF_USMC_D_Sapper_3.et` | `{81B2F89514EE2527}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_D_Sapper |
| Scout | Разведчик | `Character_RHS_USAF_USMC_D_Scout.et` | `{668C0948BAB3D689}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_TA31RCO, Handgun_M18 |  |
| Scout | Разведчик | `Character_RHS_USAF_USMC_D_Scout_2.et` | `{D062B9077302D67A}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_TA31RCO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Scout |
| Scout | Разведчик | `Character_RHS_USAF_USMC_D_Scout_3.et` | `{35FEF5FE7FE74111}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_TA31RCO, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Scout |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_USAF_USMC_D_Scout_RTO.et` | `{4D53D62240F823E8}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_su231A, Handgun_M18 |  |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_USAF_USMC_D_Scout_RTO_2.et` | `{14C0AD0C4910A3AC}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_su231A, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Scout_RTO |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_USAF_USMC_D_Scout_RTO_3.et` | `{F15CE1F545F534C7}` | UNCATALOGED_PREFAB | Rifle_M27IAR_camo1_su231A, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Scout_RTO |
| Platoon Sergeant | Взводный сержант | `Character_RHS_USAF_USMC_D_Sergeant.et` | `{71EAC81153F94B18}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 |  |
| Platoon Sergeant | Взводный сержант | `Character_RHS_USAF_USMC_D_Sergeant_2.et` | `{A6495AF14F807FF0}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Sergeant |
| Platoon Sergeant | Взводный сержант | `Character_RHS_USAF_USMC_D_Sergeant_3.et` | `{43D516084365E89B}` | UNCATALOGED_PREFAB | Rifle_M27IAR_VC18DSCO_LC, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_Sergeant |
| Sniper | Снайпер | `Character_RHS_USAF_USMC_D_Sniper.et` | `{412DB67A4B6017BF}` | OK | Rifle_M40A5_Optic_PEQ, Handgun_M18 |  |
| Spotter | Корректировщик огня | `Character_RHS_USAF_USMC_D_Spotter.et` | `{D32D76D3CB97D51C}` | OK | Rifle_M4_M203_RAS_RCO_PEQ |  |
| Spotter | Корректировщик огня | `Character_RHS_USAF_USMC_D_Spotter_2.et` | `{0393C895FDB12D50}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_USAF_USMC_D_Spotter_3.et` | `{E60F846CF154BA3B}` | OK | Rifle_M4_M203_RAS_RCO_PEQ | cosmetic variant of Character_RHS_USAF_USMC_D_Spotter |
| Team Leader | Командир группы | `Character_RHS_USAF_USMC_D_TL.et` | `{7B2DAD03ADC04376}` | OK | Rifle_M27IAR_VC18DSCO_LC |  |
| Team Leader | Командир группы | `Character_RHS_USAF_USMC_D_TL_2.et` | `{3D994F4AFDA48619}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_D_TL |
| Team Leader | Командир группы | `Character_RHS_USAF_USMC_D_TL_3.et` | `{D80503B3F1411172}` | OK | Rifle_M27IAR_VC18DSCO_LC | cosmetic variant of Character_RHS_USAF_USMC_D_TL |
| Sharpshooter | Пехотный снайпер | `Character_RHS_USAF_USMC_D_TL_Marksman.et` | `{97ECFCC2870A3865}` | UNCATALOGED_PREFAB | Rifle_M38SDMR, Handgun_M18 |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_USAF_USMC_D_TL_Marksman_2.et` | `{D248C2B6281EFD27}` | UNCATALOGED_PREFAB | Rifle_M38SDMR_manta_covers, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_TL_Marksman |
| Sharpshooter | Пехотный снайпер | `Character_RHS_USAF_USMC_D_TL_Marksman_3.et` | `{37D48E4F24FB6A4C}` | UNCATALOGED_PREFAB | Rifle_M38SDMR_manta_covers, Handgun_M18 | cosmetic variant of Character_RHS_USAF_USMC_D_TL_Marksman |
| Unarmed | Невооруженный | `Character_RHS_USAF_USMC_D_Unarmed.et` | `{E01F8B014CE06C2F}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

Skipped random/randomized wrappers (82): Character_RHS_USAF_FORECON_AAR_Random, Character_RHS_USAF_FORECON_AMG_Random, Character_RHS_USAF_FORECON_AR_Random, Character_RHS_USAF_FORECON_Ammo_Random, Character_RHS_USAF_FORECON_GL_Random, Character_RHS_USAF_FORECON_LAT_Random, Character_RHS_USAF_FORECON_MG_Random, Character_RHS_USAF_FORECON_Medic_Random, Character_RHS_USAF_FORECON_RTO_Random, Character_RHS_USAF_FORECON_Rifleman_Random, Character_RHS_USAF_FORECON_SL_Random, Character_RHS_USAF_FORECON_Sapper_Random, Character_RHS_USAF_FORECON_Scout_RTO_Random, Character_RHS_USAF_FORECON_Scout_Random, Character_RHS_USAF_FORECON_Spotter_Random, Character_RHS_USAF_FORECON_TL_Random, Character_RHS_USMC_MARSOC_AMG_Random, Character_RHS_USMC_MARSOC_AR_Random, Character_RHS_USMC_MARSOC_GL_Random, Character_RHS_USMC_MARSOC_LAT_Random, Character_RHS_USMC_MARSOC_MG_Random, Character_RHS_USMC_MARSOC_Medic_Random, Character_RHS_USMC_MARSOC_Rifleman_Random, Character_RHS_USMC_MARSOC_SL_Random, Character_RHS_USMC_MARSOC_Scout_Random, Character_RHS_USMC_MARSOC_Spotter_Random, Character_RHS_USMC_MARSOC_TL_Random, Character_RHS_USMC_MARSOC_MC_AMG_Random, Character_RHS_USMC_MARSOC_MC_GL_Random, Character_RHS_USMC_MARSOC_MC_LAT_Random, Character_RHS_USMC_MARSOC_MC_MG_Random, Character_RHS_USMC_MARSOC_MC_Medic_Random, Character_RHS_USMC_MARSOC_MC_Rifleman_Random, Character_RHS_USMC_MARSOC_MC_SL_Random, Character_RHS_USMC_MARSOC_MC_Spotter_Random, Character_RHS_USMC_MARSOC_MC_TL_Random, Character_RHS_USAF_USMC_AAR_Random, Character_RHS_USAF_USMC_AAT_Random, Character_RHS_USAF_USMC_AMG_Random, Character_RHS_USAF_USMC_AR_Random, Character_RHS_USAF_USMC_AT_Random, Character_RHS_USAF_USMC_Ammo_Random, Character_RHS_USAF_USMC_CrewLdr_Random, Character_RHS_USAF_USMC_Crew_Random, Character_RHS_USAF_USMC_GL_Random, Character_RHS_USAF_USMC_LAT_Random, Character_RHS_USAF_USMC_MG_Random, Character_RHS_USAF_USMC_Medic_Random, Character_RHS_USAF_USMC_PL_Random, Character_RHS_USAF_USMC_RTO_Random, Character_RHS_USAF_USMC_Rifleman_Random, Character_RHS_USAF_USMC_SL_Random, Character_RHS_USAF_USMC_Sapper_Random, Character_RHS_USAF_USMC_Scout_RTO_Random, Character_RHS_USAF_USMC_Scout_Random, Character_RHS_USAF_USMC_Sergeant_Random, Character_RHS_USAF_USMC_Spotter_Random, Character_RHS_USAF_USMC_TL_Marksman_Random, Character_RHS_USAF_USMC_TL_Random, Character_RHS_USAF_USMC_D_AAR_Random, Character_RHS_USAF_USMC_D_AAT_Random, Character_RHS_USAF_USMC_D_AMG_Random, Character_RHS_USAF_USMC_D_AR_Random, Character_RHS_USAF_USMC_D_AT_Random, Character_RHS_USAF_USMC_D_Ammo_Random, Character_RHS_USAF_USMC_D_CrewLdr_Random, Character_RHS_USAF_USMC_D_Crew_Random, Character_RHS_USAF_USMC_D_GL_Random, Character_RHS_USAF_USMC_D_LAT_Random, Character_RHS_USAF_USMC_D_MG_Random, Character_RHS_USAF_USMC_D_Medic_Random, Character_RHS_USAF_USMC_D_PL_Random, Character_RHS_USAF_USMC_D_RTO_Random, Character_RHS_USAF_USMC_D_Rifleman_Random, Character_RHS_USAF_USMC_D_SL_Random, Character_RHS_USAF_USMC_D_Sapper_Random, Character_RHS_USAF_USMC_D_Scout_RTO_Random, Character_RHS_USAF_USMC_D_Scout_Random, Character_RHS_USAF_USMC_D_Sergeant_Random, Character_RHS_USAF_USMC_D_Spotter_Random, Character_RHS_USAF_USMC_D_TL_Marksman_Random, Character_RHS_USAF_USMC_D_TL_Random

Skipped abstract parents (7): Character_RHS_USAF_Base, Character_RHS_USA_BaseLoadout, Character_RHS_USAF_FORECON_BaseLoadout, Character_RHS_USMC_MARSOC_BaseLoadout, Character_RHS_USMC_MARSOC_MC_BaseLoadout, Character_RHS_USAF_USMC_BaseLoadout, Character_RHS_USAF_USMC_D_BaseLoadout

## RHS_AFRF — RHS AFRF (RHS Status Quo)

Sources: `RHS Status Quo/Configs/EntityCatalog/RHS_MSV/MSV_EMR_Characters.conf`; sweep of `reference/RHS Status Quo` under `Prefabs/Characters/Factions/OPFOR/RHS_AFRF/`. Paths below are relative to that prefix.

Catalog entries OUTSIDE the faction folder (ignored): 1 — e.g. `Prefabs/Characters/Campaign/RHS/Coop/Campaign_MSV_Player.et` (MSV_EMR_Characters.conf).

### MSV/Flora (15)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Crewman | Экипаж | `Character_RHS_AFRF_MSV_Flora_Crew.et` | `{2B97973CD921E6AC}` | OK_CATALOG | Rifle_AKS74UN |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_Flora_AAT.et` | `{4375F8D9CF5FCB47}` | OK | Rifle_AK74 |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_Flora_AMG.et` | `{C9CA4F02D899C1F8}` | OK | Rifle_AK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_Flora_AR.et` | `{DE4C67D3C8F6704D}` | OK | MG_RPK74 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_Flora_AT.et` | `{06E40E12B17F6E11}` | OK | Rifle_AK74, Launcher_RPG7 |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_Flora_GL.et` | `{D39919F23F411967}` | OK | Rifle_AK74_GP25 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_Flora_MG.et` | `{8C5BB9C9A6B964AE}` | OK | MG_PKM, Handgun_PM |  |
| Medic | Врач | `Character_RHS_RF_MSV_Flora_Medic.et` | `{D9AF475A4E5DC52C}` | OK | Rifle_AK74 |  |
| Officer | Офицер | `Character_RHS_RF_MSV_Flora_Officer.et` | `{A67F5A2E875AEB72}` | OK_CATALOG | Rifle_AK74 |  |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_Flora_RTO.et` | `{9FEE7686D4B2257E}` | OK_CATALOG | Rifle_AK74 |  |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_Flora_Rifleman.et` | `{7CCAB195F5A1D9CA}` | OK | Rifle_AK74 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_Flora_SL.et` | `{B3C496CCFA72D25E}` | OK | Rifle_AK74_GP25 |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_Flora_SR.et` | `{9E5162BC890ADFCF}` | OK | Rifle_AK74 |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_Flora_Sharpshooter.et` | `{78976C69F927A7B1}` | OK_CATALOG | Rifle_SVD_PSO |  |
| Unarmed | Невооруженный | `Character_RHS_RF_MSV_Flora_Unarmed.et` | `{EFB582B84BA4A73C}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

### MSV/VKPO3_EMR (57)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_3.0_AAT.et` | `{1A2F0AD1980FBFE5}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_3.0_AAT2.et` | `{E9C5B084560C53EE}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_3.0_AAT3.et` | `{0C59FC7D5AE9C485}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AAT |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_3.0_AMG.et` | `{9090BD0A8FC9B55A}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_3.0_AMG2.et` | `{B70F810EA2652CBB}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_3.0_AMG3.et` | `{5293CDF7AE80BBD0}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_3.0_AR.et` | `{EFFD8A492BB9E881}` | UNCATALOGED_PREFAB | MG_RPK74M_NPZ_1p86 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_3.0_AR2.et` | `{B63EC14C618F3671}` | UNCATALOGED_PREFAB | MG_RPK74M_NPZ_1p86 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_3.0_AR3.et` | `{53A28DB56D6AA11A}` | UNCATALOGED_PREFAB | MG_RPK74M_NPZ_1p86 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_3.0_AT.et` | `{3755E3885230F6DD}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0, Launcher_RPG7_pgo7_rhs |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_3.0_AT2.et` | `{C6F35395F3AB63C2}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0, Launcher_RPG7_pgo7_rhs | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_3.0_AT3.et` | `{236F1F6CFF4EF4A9}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90, Launcher_RPG7_pgo7_rhs | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_3.0_Ammo.et` | `{2436394FEEE287EB}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_3.0_Ammo_2.et` | `{EFE2BE6B8B195B0A}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_3.0_Ammo_3.et` | `{0A7EF29287FCCC61}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Ammo |
| Crew Commander | Командир экипажа | `Character_RHS_RF_MSV_VKPO_3.0_CC.et` | — | UNCATALOGED_NO_GUID | Rifle_AKS74UN_PlasticMag |  |
| Crewman | Член экипажа | `Character_RHS_RF_MSV_VKPO_3.0_Crew.et` | `{08D5860833E95CA4}` | UNCATALOGED_PREFAB | Rifle_AKS74UN_PlasticMag |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_3.0_GL.et` | `{E228F468DC0E81AB}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_3.0_GL2.et` | `{FAE5AB9F6DCB1F83}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_GL |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_3.0_GL3.et` | `{1F79E766612E88E8}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_GL |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_3.0_MG.et` | `{BDEA545345F6FC62}` | UNCATALOGED_PREFAB | MG_PKP_base, Handgun_PM |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_3.0_MG2.et` | `{9839621F07C21C97}` | UNCATALOGED_PREFAB | MG_PKP_base, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_3.0_MG3.et` | `{7DA52EE60B278BFC}` | UNCATALOGED_PREFAB | MG_PKP_base, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_MG |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_3.0_Medic.et` | `{E365B757340027E4}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_3.0_Medic2.et` | `{F556759CCA876610}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Medic |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_3.0_Medic3.et` | `{10CA3965C662F17B}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Medic |
| Officer | Офицер | `Character_RHS_RF_MSV_VKPO_3.0_Officer.et` | — | UNCATALOGED_NO_GUID | Handgun_PM (inv) | no weapon SLOT — armed via inventory only |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_3.0_PL.et` | `{1B6BC2CF04DA7B02}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3_1p86, Handgun_PM (inv) |  |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_3.0_PL_2.et` | `{A2915F96FC36623D}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3_1p86, Handgun_PM (inv) | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_PL |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_3.0_PL_3.et` | `{470D136FF0D3F556}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90, Handgun_PM (inv) | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_PL |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_3.0_RTO.et` | `{C6B4848E83E251DC}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_3.0_RTO_2.et` | `{58517CDD56FCA85C}` | UNCATALOGED_PREFAB | Rifle_AN94Railed_1p90_camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_RTO |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_3.0_RTO_3.et` | `{BDCD30245A193F37}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_RTO |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_3.0_Rifleman.et` | `{E569F066E35DA06F}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3_1p86 |  |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_3.0_Rifleman2.et` | `{35C3E1D9CA966CE9}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3_1p86 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_3.0_Rifleman3.et` | `{D05FAD20C673FB82}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_3.0_SL.et` | `{82757B56193D4A92}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_3.0_SL2.et` | `{B11566B095AF0C72}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_SL |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_3.0_SL3.et` | `{54892A49994A9B19}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_gp25_1p87_1p90_Camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_SL |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_3.0_SR.et` | `{FF6D97AE7CAE760B}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_TGPA_Thermal |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_3.0_SR_2.et` | `{6744D4969A8590FA}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_TGPA_Thermal | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_SR |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_3.0_SR_3.et` | `{82D8986F96600791}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_TGPA_Thermal | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_SR |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_3.0_Sapper.et` | `{F8A58F2159851F48}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_3.0_Sapper_2.et` | `{4B582FCE388B5A2C}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Sapper |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_3.0_Sapper_3.et` | `{AEC46337346ECD47}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Sapper |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_3.0_Scout.et` | `{19DBD80A5110E1CC}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_3.0_Scout2.et` | `{DA064971B36C215B}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Scout |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_3.0_Scout3.et` | `{3F9A0588BF89B630}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Scout |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO.et` | `{EBF60D0E092A26E2}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 |  |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO_2.et` | `{E6741109AB57B6D9}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_VKPO3.0 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO_3.et` | `{03E85DF0A7B221B2}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_3.0_Sergeant.et` | `{7BD71EE82DDDB298}` | UNCATALOGED_PREFAB | Rifle_AN94Railed_1p87_perst, Handgun_PM (inv) |  |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_3.0_Sergeant_2.et` | `{F5C0C7159CE28B1A}` | UNCATALOGED_PREFAB | Rifle_AN94_valday_rail_camo_1p87_1p90, Handgun_PM (inv) | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Sergeant |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_3.0_Sergeant_3.et` | `{105C8BEC90071C71}` | UNCATALOGED_PREFAB | Rifle_AN94Railed_1p90_camo, Handgun_PM (inv) | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Sergeant |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter.et` | `{8E225DCFE40EFA25}` | UNCATALOGED_PREFAB | Rifle_SVD_1P21, Handgun_PM (inv) |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter_2.et` | `{C1E5844AC2F8527C}` | UNCATALOGED_PREFAB | Rifle_SVD_1P21, Handgun_PM (inv) | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter_3.et` | `{2479C8B3CE1DC517}` | UNCATALOGED_PREFAB | Rifle_SVD_1P21, Handgun_PM (inv) | cosmetic variant of Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter |

### MSV/VKPO_Demiseason (75)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_DS_AAT.et` | `{6A5FD56634DE57DD}` | OK | Rifle_AK74M |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_DS_AAT_2.et` | `{CB8034F229E66EC4}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_DS_AAT_3.et` | `{2E1C780B2503F9AF}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AAT |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_DS_AMG.et` | `{E0E062BD23185D62}` | OK | Rifle_AK74M |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_DS_AMG_2.et` | `{E33DADF47B07C743}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_DS_AMG_3.et` | `{06A1E10D77E25028}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_DS_AR.et` | `{9D7859DE5E1DA3AB}` | OK | MG_RPK74M |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_DS_AR_2.et` | `{0D2C8BEF14C6B2CE}` | OK | MG_RPK74M_1P78 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_DS_AR_3.et` | `{E8B0C716182325A5}` | OK | MG_RPK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_DS_AT.et` | `{45D0301F2794BDF7}` | OK | Rifle_AK74M, Launcher_RPG7_pgo7 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_DS_AT_2.et` | `{B0FCD9686BDDAED0}` | OK | Rifle_AK74M_1P63, Launcher_RPG7_pgo7 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_DS_AT_3.et` | `{55609591673839BB}` | OK | Rifle_AK74M, Launcher_RPG7_pgo7 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_DS_Ammo.et` | `{24AB05F6644410F5}` | UNCATALOGED_PREFAB | Rifle_AK74M |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_DS_Ammo_2.et` | `{DA39E2D64AF9A9DA}` | UNCATALOGED_PREFAB | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_DS_Ammo_3.et` | `{3FA5AE2F461C3EB1}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Ammo |
| Crew Commander | Командир экипажа | `Character_RHS_RF_MSV_VKPO_DS_CC.et` | — | UNCATALOGED_NO_GUID | Rifle_AKS74UN_PlasticMag |  |
| Crewman | Экипаж | `Character_RHS_RF_MSV_VKPO_DS_Crew.et` | `{0848BAB1B94FCBBA}` | OK | Rifle_AKS74UN_PlasticMag |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_DS_GL.et` | `{90AD27FFA9AACA81}` | OK | Rifle_AK74M_GP25 |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_DS_GL_2.et` | `{D716F039A8445480}` | OK | Rifle_AK74M_GP25 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_GL |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_DS_GL_3.et` | `{328ABCC0A4A1C3EB}` | OK | Rifle_AK74M_GP25_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_GL |
| Helicopter Crew | Экипаж вертолета | `Character_RHS_RF_MSV_VKPO_DS_HeliCrew.et` | `{BB9DCEEA3CD5A517}` | OK_CATALOG | Handgun_PM |  |
| Helicopter Pilot | Пилот вертолета | `Character_RHS_RF_MSV_VKPO_DS_HeliPilot.et` | `{38D59019ABF4D5F6}` | OK | Handgun_PM |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_RF_MSV_VKPO_DS_LAT.et` | `{A707D61B6EDF3106}` | OK | Rifle_AK74M_npz_rail_1p87, Launcher_RPG22 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_RF_MSV_VKPO_DS_LAT_2.et` | `{EB71C2D131DB230A}` | OK | Rifle_AK74M_1P63, Launcher_RPG22 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_RF_MSV_VKPO_DS_LAT_3.et` | `{0EED8E283D3EB461}` | OK | Rifle_AK74M, Launcher_RPG22 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_LAT |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_DS_MG.et` | `{CF6F87C43052B748}` | OK | MG_PKP_base, Handgun_PM |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_DS_MG_2.et` | `{9841406E393C0757}` | OK | MG_PKP_base, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_DS_MG_3.et` | `{7DDD0C9735D9903C}` | OK | MG_PKP_base, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_MG |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_DS_Medic.et` | `{7E590EDD929739E4}` | OK | Rifle_AK74M |  |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_DS_Medic_2.et` | `{02C9F4BB701ABA37}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Medic |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_DS_Medic_3.et` | `{E755B8427CFF2D5C}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Medic |
| Officer | Офицер | `Character_RHS_RF_MSV_VKPO_DS_Officer.et` | `{124C018E4FE2DE7B}` | UNCATALOGED_CATALOG | Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_DS_PL.et` | `{69EE1158717E3028}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63, Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_DS_PL_2.et` | `{A20C632F7690F523}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_PL |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_DS_PL_3.et` | `{47902FD67A756248}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_1p90, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_PL |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_DS_RTO.et` | `{B6C45B392F33B9E4}` | OK | Rifle_AK74M |  |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_DS_RTO_2.et` | `{C56DC557F06BB65C}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_RTO |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_DS_RTO_3.et` | `{20F189AEFC8E2137}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_RTO |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_DS_Rifleman.et` | `{5A1F1BD88FC6C6E9}` | OK | Rifle_AK74M |  |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_DS_Rifleman_2.et` | `{B5B5962C6390B560}` | OK | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_DS_Rifleman_3.et` | `{5029DAD56F75220B}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_DS_SL.et` | `{F0F0A8C16C9901B8}` | OK | Rifle_AK74M_npz_rail_gp25_1p87_1p90 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_DS_SL_2.et` | `{A8A93362C08006A4}` | OK | Rifle_AK74M_npz_rail_gp25_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_SL |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_DS_SL_3.et` | `{4D357F9BCC6591CF}` | OK | Rifle_AK74M_GP25_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_SL |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_DS_SR.et` | `{8DE84439090A3D21}` | OK | Rifle_AK74M_1P78 |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_DS_SR_2.et` | `{67D9E82F102307E4}` | OK | Rifle_AK74M_npz_rail_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_SR |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_DS_SR_3.et` | `{8245A4D61CC6908F}` | OK | Rifle_AK74M_1P78 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_SR |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_DS_SR_GL.et` | `{306E81534A21D1A6}` | OK | Rifle_AK74M_npz_rail_gp25_1p87 |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_DS_SR_GL_2.et` | `{E836357CACCF04E6}` | OK | Rifle_AK74M_npz_rail_gp25_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_SR_GL |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_DS_SR_GL_3.et` | `{0DAA7985A02A938D}` | OK | Rifle_AK74M_1P78_GP25 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_SR_GL |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_DS_Sapper.et` | `{CD7ED39C9865ED98}` | OK | Rifle_AK74M |  |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_DS_Sapper_2.et` | `{F42EC47054103CAA}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Sapper |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_DS_Sapper_3.et` | `{11B2888958F5ABC1}` | OK | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Sapper |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout.et` | `{84E76180F787FFCC}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_camo |  |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_2.et` | `{82CB60CE5267943D}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Scout |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_3.et` | `{67572C375E820356}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Scout |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_RTO.et` | `{DDE45751B6A534CA}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo |  |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_RTO_2.et` | `{1076D13A587C3D18}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Scout_RTO |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_RTO_3.et` | `{F5EA9DC35499AA73}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Scout_RTO |
| Sensor Operator | Радиоразведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon.et` | `{B6852AEDAD71AB8F}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo, Device_SpectrumDevice_ru |  |
| Sensor Operator | Радиоразведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon_2.et` | `{2C4CA4EBA186A1E0}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo, Device_SpectrumDevice_ru | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon |
| Sensor Operator | Радиоразведчик | `Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon_3.et` | `{C9D0E812AD63368B}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo, Device_SpectrumDevice_ru | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_DS_Sergeant.et` | `{E1EAB80D1FE2C5FE}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_1p90 |  |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_DS_Sergeant_2.et` | `{810FB438FF44ACD2}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Sergeant |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_DS_Sergeant_3.et` | `{6493F8C1F3A13BB9}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Sergeant |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_DS_Sharpshooter.et` | `{68EB286921B4E7FD}` | OK | Rifle_SVD_PSO |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_DS_Sharpshooter_2.et` | `{3FFB9E205563F066}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Sharpshooter |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_DS_Sharpshooter_3.et` | `{DA67D2D95986670D}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Sharpshooter |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_DS_Spotter.et` | `{68B424CA046B2B07}` | OK | Rifle_AK74M_npz_rail_1p86-1 |  |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_DS_Spotter_2.et` | `{932449E60BEC3A72}` | OK | Rifle_AK74M_npz_rail_1p86-1 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_DS_Spotter_3.et` | `{76B8051F0709AD19}` | OK | Rifle_AK74M_npz_rail_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_DS_Spotter_GL.et` | `{68B424CA046B2B06}` | OK | Rifle_AK74M_npz_rail_gp25_1p87 |  |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_DS_Spotter_GL_2.et` | `{843482335C88C9AA}` | OK | Rifle_AK74M_GP25_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Spotter_GL |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_DS_Spotter_GL_3.et` | `{61A8CECA506D5EC1}` | OK | Rifle_AK74M_1P78_GP25 | cosmetic variant of Character_RHS_RF_MSV_VKPO_DS_Spotter_GL |
| Unarmed | Невооруженный | `Character_RHS_RF_MSV_VKPO_DS_Unarmed.et` | `{5B86D918831C9235}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

### MSV/VKPO_Summer (75)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_S_AAT.et` | `{7B82B1E234C1F0D5}` | OK | Rifle_AK74M |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_S_AAT_2.et` | `{48ABAF37D20EFF3D}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VKPO_S_AAT_3.et` | `{AD37E3CEDEEB6856}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AAT |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_S_AMG.et` | `{F13D06392307FA6A}` | OK | Rifle_AK74M |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_S_AMG_2.et` | `{6016363180EF56BA}` | OK | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VKPO_S_AMG_3.et` | `{858A7AC88C0AC1D1}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_S_AR.et` | `{FBB329ECA28B85A7}` | OK | MG_RPK74M |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_S_AR_2.et` | `{0B6372D14360CCDE}` | OK | MG_RPK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VKPO_S_AR_3.et` | `{EEFF3E284F855BB5}` | OK | MG_RPK74M_1P78 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_S_AT.et` | `{231B402DDB029BFB}` | OK | Rifle_AK74M, Launcher_RPG7_pgo7 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_S_AT_2.et` | `{B6B320563C7BD0C0}` | OK | Rifle_AK74M_1P63, Launcher_RPG7_pgo7 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VKPO_S_AT_3.et` | `{532F6CAF309E47AB}` | OK | Rifle_AK74M, Launcher_RPG7_pgo7 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_S_Ammo.et` | `{22E4FCC833E26EE5}` | UNCATALOGED_PREFAB | Rifle_AK74M |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_S_Ammo_2.et` | `{C049E0D125647FA2}` | UNCATALOGED_PREFAB | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_RHS_RF_MSV_VKPO_S_Ammo_3.et` | `{25D5AC282981E8C9}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Ammo |
| Crewman | Экипаж | `Character_RHS_RF_MSV_VKPO_S_CC.et` | — | UNCATALOGED_NO_GUID | Rifle_AKS74UN_PlasticMag |  |
| Crewman | Экипаж | `Character_RHS_RF_MSV_VKPO_S_Crew.et` | `{F1E1A7A59FE370C6}` | OK | Rifle_AKS74UN_PlasticMag |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_S_GL.et` | `{F66657CD553CEC8D}` | OK | Rifle_AK74M_GP25 |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_S_GL_2.et` | `{D1590907FFE22A90}` | OK | Rifle_AK74M_GP25 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_GL |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VKPO_S_GL_3.et` | `{34C545FEF307BDFB}` | OK | Rifle_AK74M_GP25_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_GL |
| Helicopter Crew | Экипаж вертолета | `Character_RHS_RF_MSV_VKPO_S_HeliCrew.et` | `{411DE243F376E485}` | OK_CATALOG | Handgun_PM |  |
| Helicopter Pilot | Пилот вертолета | `Character_RHS_RF_MSV_VKPO_S_HeliPilot.et` | `{BBFE0BDC501C440F}` | OK | Handgun_PM |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_RF_MSV_VKPO_S_LAT.et` | `{6AB4C34EA1A4E42E}` | OK | Rifle_AK74M_npz_rail_1p87, Launcher_RPG22 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_RF_MSV_VKPO_S_LAT_2.et` | `{685A5914CA33B2F3}` | OK | Rifle_AK74M_1P63, Launcher_RPG22 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_RHS_RF_MSV_VKPO_S_LAT_3.et` | `{8DC615EDC6D62598}` | OK | Rifle_AK74M, Launcher_RPG22 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_LAT |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_S_MG.et` | `{A9A4F7F6CCC49144}` | OK | MG_PKP_base, Handgun_PM |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_S_MG_2.et` | `{9E0EB9506E9A7947}` | OK | MG_PKP_base, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VKPO_S_MG_3.et` | `{7B92F5A9627FEE2C}` | OK | MG_PKP_base, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_MG |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_S_Medic.et` | `{816A594FAD3F711A}` | OK | Rifle_AK74M |  |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_S_Medic_2.et` | `{03718476327CF340}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Medic |
| Medic | Врач | `Character_RHS_RF_MSV_VKPO_S_Medic_3.et` | `{E6EDC88F3E99642B}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Medic |
| Officer | Офицер | `Character_RHS_RF_MSV_VKPO_S_Officer.et` | `{13F471430D84970C}` | UNCATALOGED_CATALOG | Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_S_PL.et` | `{D6635BA91795A269}` | UNCATALOGED_PREFAB | Rifle_AK74M, Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_S_PL_2.et` | `{A4439A1121368B33}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_1p90, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_PL |
| Platoon Leader | Командир взвода | `Character_RHS_RF_MSV_VKPO_S_PL_3.et` | `{41DFD6E82DD31C58}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63, Handgun_PM | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_PL |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_S_RTO.et` | `{A7193FBD2F2C1EEC}` | OK | Rifle_AK74M |  |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_S_RTO_2.et` | `{46465E920B8327A5}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_RTO |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VKPO_S_RTO_3.et` | `{A3DA126B0766B0CE}` | OK | Rifle_AK74M | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_RTO |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_S_Rifleman.et` | `{A0CAC00219D7EF55}` | OK | Rifle_AK74M |  |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_S_Rifleman_2.et` | `{82B048F236674D1C}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VKPO_S_Rifleman_3.et` | `{672C040B3A82DA77}` | OK | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_S_SL.et` | `{963BD8F3900F27B4}` | OK | Rifle_AK74M_npz_rail_gp25_1p87_1p90 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_S_SL_2.et` | `{AEE6CA5C972678B4}` | OK | Rifle_AK74M_npz_rail_gp25_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_SL |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VKPO_S_SL_3.et` | `{4B7A86A59BC3EFDF}` | OK | Rifle_AK74M_GP25_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_SL |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_S_SR.et` | `{32650EC86FE1AF60}` | OK | Rifle_AK74M_1P78 |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_S_SR_2.et` | `{61961111478579F4}` | OK | Rifle_AK74M_1P78 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_SR |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_S_SR_3.et` | `{840A5DE84B60EE9F}` | OK | Rifle_AK74M_npz_rail_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_SR |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_S_SR_GL.et` | `{FDDD9406855A048E}` | OK | Rifle_AK74M_npz_rail_gp25_1p87 |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_S_SR_GL_2.et` | `{E98E45B1EEA94D91}` | OK | Rifle_AK74M_npz_rail_gp25_1p87_1p90 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_SR_GL |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VKPO_S_SR_GL_3.et` | `{0C120948E24CDAFA}` | OK | Rifle_AK74M_1P78_GP25 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_SR_GL |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_S_Sapper.et` | `{D70ED19BF7F83BE0}` | OK | Rifle_AK74M |  |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_S_Sapper_2.et` | `{0EAEE8D99BB37D39}` | OK | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Sapper |
| Sapper | Сапер | `Character_RHS_RF_MSV_VKPO_S_Sapper_3.et` | `{EB32A4209756EA52}` | OK | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Sapper |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_S_Scout.et` | `{07CCFA450C6F6E35}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_camo |  |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_2.et` | `{837310031001DD4A}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Scout |
| Scout | Разведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_3.et` | `{66EF5CFA1CE44A21}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_1p90_camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Scout |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_RTO.et` | `{CCF79F167CC9C881}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo |  |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_RTO_2.et` | `{31CDC216EADA7843}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Scout_RTO |
| Scout Radio Operator | Радист-разведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_RTO_3.et` | `{D4518EEFE63FEF28}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Scout_RTO |
| Sensor Operator | Радиоразведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon.et` | `{A3EBCBD82E3F0988}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo, Device_SpectrumDevice_ru |  |
| Sensor Operator | Радиоразведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon_2.et` | `{0328E647C99927AF}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo, Device_SpectrumDevice_ru | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon |
| Sensor Operator | Радиоразведчик | `Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon_3.et` | `{E6B4AABEC57CB0C4}` | UNCATALOGED_PREFAB | Rifle_AK74M_camo, Device_SpectrumDevice_ru | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_S_Sergeant.et` | `{1B6A94A4D041846D}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87_1p90 |  |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_S_Sergeant_2.et` | `{B60A6AE6AAB354AE}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_1p87 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Sergeant |
| Platoon Sergeant | Взводный сержант | `Character_RHS_RF_MSV_VKPO_S_Sergeant_3.et` | `{5396261FA656C3C5}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Sergeant |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_S_Sharpshooter.et` | `{C55F0D12342C6756}` | OK | Rifle_SVD_PSO |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_S_Sharpshooter_2.et` | `{BF725BD014DDDAE9}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Sharpshooter |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VKPO_S_Sharpshooter_3.et` | `{5AEE172918384D82}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Sharpshooter |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_S_Spotter.et` | `{690C5407460D6271}` | OK | Rifle_AK74M_npz_rail_1p86-1 |  |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_S_Spotter_2.et` | `{823781A1C180C639}` | OK | Rifle_AK74M_npz_rail_1p86-1 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_S_Spotter_3.et` | `{67ABCD58CD655152}` | OK | Rifle_AK74M_npz_rail_1p86-1 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_S_Spotter_GL.et` | `{7DC8CF73F5A13345}` | OK | Rifle_AK74M_npz_rail_gp25_1p87 |  |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_S_Spotter_GL_2.et` | `{B1ADBE9572E4AFE7}` | OK | Rifle_AK74M_1P78_GP25 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Spotter_GL |
| Spotter | Корректировщик огня | `Character_RHS_RF_MSV_VKPO_S_Spotter_GL_3.et` | `{5431F26C7E01388C}` | OK | Rifle_AK74M_GP25_1P63 | cosmetic variant of Character_RHS_RF_MSV_VKPO_S_Spotter_GL |
| Unarmed | Невооруженный | `Character_RHS_RF_MSV_VKPO_S_Unarmed.et` | `{1AE4F920A7C9050B}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

### MSV/VSR (15)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_MSV_VSR_AAT.et` | `{23D3F748B2D76D2B}` | OK | Rifle_AK74 |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_RHS_RF_MSV_VSR_AMG.et` | `{A96C4093A5116794}` | OK | Rifle_AK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_RHS_RF_MSV_VSR_AR.et` | `{02BD56E9BC9E800E}` | OK | MG_RPK74 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_MSV_VSR_AT.et` | `{DA153F28C5179E52}` | OK | Rifle_AK74, Launcher_RPG7 |  |
| Crewman | Экипаж | `Character_RHS_RF_MSV_VSR_Crew.et` | `{D847E9108E4739F9}` | OK_CATALOG | Rifle_AKS74UN |  |
| Grenadier | Гренадер | `Character_RHS_RF_MSV_VSR_GL.et` | `{0F6828C84B29E924}` | OK | Rifle_AK74_GP25 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_MSV_VSR_MG.et` | `{50AA88F3D2D194ED}` | OK | MG_PKM, Handgun_PM |  |
| Medic | Врач | `Character_RHS_RF_MSV_VSR_Medic.et` | `{F570BCD98B0BCED0}` | OK | Rifle_AK74 |  |
| Officer | Офицер | `Character_RHS_RF_MSV_VSR_Officer.et` | `{CC3E84140343D82E}` | OK_CATALOG | Rifle_AK74 |  |
| Combat Signaler | Связист | `Character_RHS_RF_MSV_VSR_RTO.et` | `{FF487917A93A8312}` | OK_CATALOG | Rifle_AK74 |  |
| Rifleman | Стрелок | `Character_RHS_RF_MSV_VSR_Rifleman.et` | `{3CEC77A6686C1BA3}` | OK | Rifle_AK74 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_MSV_VSR_SL.et` | `{6F35A7F68E1A221D}` | OK | Rifle_AK74_GP25 |  |
| Senior Rifleman | Старший стрелок | `Character_RHS_RF_MSV_VSR_SR.et` | `{424464CB4B245206}` | OK | Rifle_AK74 |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_MSV_VSR_Sharpshooter.et` | `{A4826A1E3B092A78}` | OK_CATALOG | Rifle_SVD_PSO |  |
| Unarmed | Невооруженный | `Character_RHS_RF_MSV_VSR_Unarmed.et` | `{85F45C82CFBD9460}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

### SSO/ATACS (28)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_SSO_AAT.et` | `{3996E00B5D9CB638}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_SSO_AAT2.et` | `{5B44B9821EF8DE85}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_SSO_AAT3.et` | `{BED8F57B121D49EE}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_AAT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_SSO_AT.et` | `{7A35FA2BB9A424F6}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO, Launcher_RPG7_pgo7_rhs |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_SSO_AT2.et` | `{E54AB94F36386A1F}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO, Launcher_RPG7_pgo7_rhs | cosmetic variant of Character_RHS_RF_SSO_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_SSO_AT3.et` | `{00D6F5B63ADDFD74}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO, Launcher_RPG7_pgo7_rhs | cosmetic variant of Character_RHS_RF_SSO_AT |
| Grenadier | Гренадер | `Character_RHS_RF_SSO_GL.et` | `{AF48EDCB379A5380}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO |  |
| Grenadier | Гренадер | `Character_RHS_RF_SSO_GL2.et` | `{D95C4145A858165E}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_GL |
| Grenadier | Гренадер | `Character_RHS_RF_SSO_GL3.et` | `{3CC00DBCA4BD8135}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_GL |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SSO_MG.et` | `{F08A4DF0AE622E49}` | UNCATALOGED_PREFAB | MG_PKM_B51_Thermal |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SSO_MG2.et` | `{BB8088C5C251154A}` | UNCATALOGED_LAYER | MG_PKM_B51_Thermal | cosmetic variant of Character_RHS_RF_SSO_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SSO_MG3.et` | `{5E1CC43CCEB48221}` | UNCATALOGED_LAYER | MG_PKM_B51_Thermal | cosmetic variant of Character_RHS_RF_SSO_MG |
| Medic | Врач | `Character_RHS_RF_SSO_Medic.et` | `{BB301E085F49DB3E}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO |  |
| Medic | Врач | `Character_RHS_RF_SSO_Medic2.et` | `{8EA19C97E573C16E}` | UNCATALOGED_PREFAB | Rifle_AK105_b30_b31s_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_Medic |
| Medic | Врач | `Character_RHS_RF_SSO_Medic3.et` | `{6B3DD06EE9965605}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_Medic |
| Rifleman | Стрелок | `Character_RHS_RF_SSO_Rifleman.et` | `{13C9E18887DF2FFD}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO |  |
| Rifleman | Стрелок | `Character_RHS_RF_SSO_Rifleman2.et` | `{DFB8C4FA33F3A4C3}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19n_b33_b9m_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_SSO_Rifleman3.et` | `{3A2488033F1633A8}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_RF_SSO_SL.et` | `{4273B2462497E66C}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_SSO_SL2.et` | `{9B239158A85DA790}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30_b31s_b33_rk3_pt1_FDE_RailCover_SSO | cosmetic variant of Character_RHS_RF_SSO_SL |
| Squad Leader | Командир отделения | `Character_RHS_RF_SSO_SL3.et` | `{7EBFDDA1A4B830FB}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30u_b31n_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_SL |
| Sapper | Сапер | `Character_RHS_RF_SSO_Sapper.et` | `{8352662A7671B836}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19_b33_b9m_pt1_rk3_FDE_SSO |  |
| Sapper | Сапер | `Character_RHS_RF_SSO_Sapper2.et` | `{D4F8FB3470B79EE1}` | UNCATALOGED_PREFAB | Rifle_AK74M_b30_b31s_b33_rk3_pt1_FDE_RailCover_SSO | cosmetic variant of Character_RHS_RF_SSO_Sapper |
| Sapper | Сапер | `Character_RHS_RF_SSO_Sapper3.et` | `{3164B7CD7C52098A}` | UNCATALOGED_PREFAB | Rifle_AK105_b30_b31s_b33_pt1_rk3_FDE_SSO | cosmetic variant of Character_RHS_RF_SSO_Sapper |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_SSO_Sharpshooter.et` | `{CFC798E19D7E3094}` | UNCATALOGED_LAYER | Rifle_SVD_1P21_TGPV, Handgun_APS (inv) |  |
| Spotter | Корректировщик огня | `Character_RHS_RF_SSO_Spotter.et` | `{C0B0F929BB41FC6E}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_TGPA_Thermal |  |
| Spotter | Корректировщик огня | `Character_RHS_RF_SSO_Spotter2.et` | `{2B73D8D050A1BC7B}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_TGPA_Thermal | cosmetic variant of Character_RHS_RF_SSO_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_RF_SSO_Spotter3.et` | `{CEEF94295C442B10}` | UNCATALOGED_PREFAB | Rifle_AK74M_npz_rail_camo_TGPA_Thermal | cosmetic variant of Character_RHS_RF_SSO_Spotter |

### VV/RG/Atacs (31)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_SOF_AAT.et` | `{FFF764BBA021A8C0}` | OK | Rifle_AK200_B30_B31S_RailCover_XPS, Launcher_RPOD, Handgun_Glock17 |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_SOF_AAT2.et` | `{DAED4B38692EF29E}` | UNCATALOGED_PREFAB | Rifle_AK200_T1_klesh, Launcher_RPOD, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_RHS_RF_SOF_AAT3.et` | `{3F7107C165CB65F5}` | UNCATALOGED_PREFAB | Rifle_AK205_B9M_T1, Launcher_RPOD, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_AAT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_SOF_AT.et` | `{58BA009D212B8E8E}` | OK | Rifle_AK200_B9M_45rnd, Launcher_RPOA, Handgun_Glock17 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_SOF_AT2.et` | `{232B3DFFCB8574E7}` | UNCATALOGED_PREFAB | Rifle_AK200_B9M_T1, Launcher_RPOA, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_RHS_RF_SOF_AT3.et` | `{C6B77106C760E38C}` | UNCATALOGED_PREFAB | Rifle_AK205_B30_B31S_RailCover_RG, Launcher_RPOA, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_AT |
| Breacher | Прорывник | `Character_RHS_RF_SOF_Chad.et` | `{16404B0559CC2C7B}` | UNCATALOGED_PREFAB | Rifle_AK205_T1, Handgun_Glock17 |  |
| Breacher | Прорывник | `Character_RHS_RF_SOF_Chad2.et` | `{5DD1CE8A8758F88F}` | UNCATALOGED_PREFAB | Rifle_AK205_XPS, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Chad |
| Grenadier | Гренадер | `Character_RHS_RF_SOF_GL.et` | `{8DC7177DAF15F9F8}` | UNCATALOGED_PREFAB | GL_GM94, Rifle_AK205_B9M, Handgun_Glock17 |  |
| Grenadier | Гренадер | `Character_RHS_RF_SOF_GL2.et` | `{1F3DC5F555E508A6}` | UNCATALOGED_PREFAB | GL_GM94_camo, Rifle_AK205_B10M_B19_RK3_PT1_B9M_FDE_XPS, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_GL |
| Grenadier | Гренадер | `Character_RHS_RF_SOF_GL3.et` | `{FAA1890C59009FCD}` | UNCATALOGED_PREFAB | GL_GM94_camo, Rifle_AK205_B9M_T1_low, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_GL |
| DONT USE ME |  | `Character_RHS_RF_SOF_GM94.et` | `{3A35E25C2D89AD2F}` | OK_CATALOG | Rifle_AK74_RHSMag, Handgun_Glock17 |  |
| DONT USE ME |  | `Character_RHS_RF_SOF_GM94Belt.et` | `{8C3094C2AA59376A}` | OK_CATALOG | Rifle_AK105_b10m_b19, Handgun_Glock17 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SOF_MG.et` | `{D205B74636ED8431}` | OK | MG_PKM_B51_Eot, Handgun_Glock17 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SOF_MG2.et` | `{7DE10C753FEC0BB2}` | UNCATALOGED_PREFAB | MG_PKM_B51_1p87, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SOF_MG3.et` | `{987D408C33099CD9}` | UNCATALOGED_PREFAB | MG_PKM_B51_Eot, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_MG |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_SOF_Marksman.et` | `{41E4A355893B09FE}` | OK | Rifle_SVD_1P21, Handgun_Glock17 |  |
| Medic | Врач | `Character_RHS_RF_SOF_Medic.et` | `{A6C8A0545DBD8260}` | OK | Rifle_AK200_B10M_B19_B9M_XPS, Handgun_Glock17 |  |
| Medic | Врач | `Character_RHS_RF_SOF_Medic2.et` | `{8987F34E3AE61973}` | UNCATALOGED_PREFAB | Rifle_AK205_XPS_klesh, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Medic |
| Medic | Врач | `Character_RHS_RF_SOF_Medic3.et` | `{6C1BBFB736038E18}` | UNCATALOGED_PREFAB | Rifle_AK205_XPS_m300, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Medic |
| Rifleman | Стрелок | `Character_RHS_RF_SOF_Rifleman.et` | `{135F5E0601BBC4EA}` | UNCATALOGED_PREFAB | Rifle_AK200_B9M_1P90_2, Handgun_Glock17 |  |
| Rifleman | Стрелок | `Character_RHS_RF_SOF_Rifleman2.et` | `{49074A7C5718B0C3}` | OK | Rifle_AK200_1P90_klesh, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_SOF_Rifleman3.et` | `{AC9B06855BFD27A8}` | UNCATALOGED_PREFAB | Rifle_AK200_1P90_m300, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_SOF_Rifleman4.et` | `{91AF23BD2E91AE9F}` | UNCATALOGED_PREFAB | Rifle_AK200_B30_B31S_1P90, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOF_SL.et` | `{578A9679C9CBA788}` | OK | Rifle_AK200_B9M_1P90, Handgun_Glock17 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOF_SL2.et` | `{54CD08DAAD811B57}` | UNCATALOGED_PREFAB | Rifle_AK200_B30_B31S_RailCover_1P90, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_SL |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOF_SL3.et` | `{B1514423A1648C3C}` | UNCATALOGED_PREFAB | Rifle_AK205_B10M_B19_RK3_PT1_B9M_XPS_Perst, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_SL |
| Scout | Разведчик | `Character_RHS_RF_SOF_Scout.et` | `{135F5E0601BBC4E9}` | OK | Rifle_AK105_b10m_b19n_b33_b9m_tgpa, Handgun_Glock17 |  |
| Scout | Разведчик | `Character_RHS_RF_SOF_Scout2.et` | `{A6D7CFA3430D5E38}` | UNCATALOGED_PREFAB | Rifle_AK105_tpga, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Scout |
| Scout | Разведчик | `Character_RHS_RF_SOF_Scout3.et` | `{434B835A4FE8C953}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOF_Scout |
| Sniper | Снайпер | `Character_RHS_RF_SOF_Sniper.et` | — | UNCATALOGED_NO_GUID | Rifle_SVD_1P21, Handgun_Glock17 |  |

### VV/RG/Blk (7)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Rifleman | Стрелок | `Character_RHS_RF_SOBR_Breacher.et` | `{EABACB837362304D}` | OK_CATALOG | Rifle_SR3M_supr, Handgun_Glock17 |  |
| Rifleman | Стрелок | `Character_RHS_RF_SOBR_Breacher2.et` | `{FABC8CBA1DFF203D}` | OK_CATALOG | Rifle_SR3M_supr, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBR_Breacher |
| Rifleman | Стрелок | `Character_RHS_RF_SOBR_Breacher3.et` | `{1F20C043111AB756}` | OK_CATALOG | Rifle_SR3M_supr, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBR_Breacher |
| Breacher | Прорывник | `Character_RHS_RF_SOBR_Chad1.et` | `{E4E52E85601454F5}` | UNCATALOGED_CATALOG | Rifle_SR3M_supr, Handgun_Glock17 |  |
| Breacher | Прорывник | `Character_RHS_RF_SOBR_Chad2.et` | `{88B11A65DCD0DBDB}` | UNCATALOGED_CATALOG | Rifle_SR3M_supr, Handgun_Glock17 |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_RF_SOBR_Marksman.et` | `{D5640BB562716235}` | OK_CATALOG | Rifle_SR3M_supr_PSO, Handgun_Glock17 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOBR_SL.et` | `{7284A0C1AC626E1F}` | OK_CATALOG | Rifle_SR3M_supr, Handgun_Glock17 |  |

### VV/RG/Olive (18)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Grenadier | Гренадер | `Character_RHS_RF_SOBROlive_GL.et` | `{5E0D068CFB4DAFC4}` | UNCATALOGED_PREFAB | GL_GM94, Rifle_AK105, Handgun_Glock17 |  |
| Grenadier | Гренадер | `Character_RHS_RF_SOBROlive_GL2.et` | `{58FF89B7F032BF1E}` | UNCATALOGED_PREFAB | GL_GM94, Rifle_AK105_b10m_b19_b33_b9m_RG, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_GL |
| Grenadier | Гренадер | `Character_RHS_RF_SOBROlive_GL3.et` | `{BD63C54EFCD72875}` | UNCATALOGED_PREFAB | GL_GM94, Rifle_AK105, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_GL |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SOBROlive_MG.et` | `{01CFA6B762B5D20D}` | UNCATALOGED_PREFAB | MG_PKM, Handgun_Glock17 |  |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SOBROlive_MG2.et` | `{3A2340379A3BBC0A}` | UNCATALOGED_PREFAB | MG_PKM, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_MG |
| Machine-Gunner | Пулеметчик | `Character_RHS_RF_SOBROlive_MG3.et` | `{DFBF0CCE96DE2B61}` | UNCATALOGED_PREFAB | MG_PKM, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_MG |
| Medic | Врач | `Character_RHS_RF_SOBROlive_Medic.et` | `{91D951304AD6B7BB}` | UNCATALOGED_PREFAB | Rifle_AK104_b10m_b19n_b33_pt1_dtk2_rk3_T1, Handgun_Glock17 |  |
| Medic | Врач | `Character_RHS_RF_SOBROlive_Medic2.et` | `{BC135A20148DFB28}` | UNCATALOGED_PREFAB | Rifle_AK104_b30_b31s_b33_RG, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_Medic |
| Medic | Врач | `Character_RHS_RF_SOBROlive_Medic3.et` | `{598F16D918686C43}` | UNCATALOGED_PREFAB | Rifle_AK103, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_Medic |
| Rifleman | Стрелок | `Character_RHS_RF_SOBROlive_Rifleman.et` | `{9FBBD0D57F3EED94}` | UNCATALOGED_PREFAB | Rifle_AK103_b10m_b19_b33_pt1_rk3_b9m_XPS, Handgun_Glock17 |  |
| Rifleman | Стрелок | `Character_RHS_RF_SOBROlive_Rifleman2.et` | `{8026D60DBDC48C6F}` | UNCATALOGED_PREFAB | Rifle_AK103_b30_b31s_b33_pt1_rk3_RailCover_RG, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_Rifleman |
| Rifleman | Стрелок | `Character_RHS_RF_SOBROlive_Rifleman3.et` | `{65BA9AF4B1211B04}` | UNCATALOGED_PREFAB | Rifle_AK104_b10m_b19_b33_b9m_rk3_dtk2_b9m_XPS, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOBROlive_SL.et` | `{3E5089B23E7E64FD}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19n_b33_b9m_pt1_rk3_dtk2_XPS, Handgun_Glock17 |  |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOBROlive_SL2.et` | `{130F44980856ACEF}` | UNCATALOGED_PREFAB | Rifle_AK103_b30u_b31n_b33_pt1_rk3_dtk2_XPS, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_SL |
| Squad Leader | Командир отделения | `Character_RHS_RF_SOBROlive_SL3.et` | `{F693086104B33B84}` | UNCATALOGED_PREFAB | Rifle_AK105_b30u_b31n_b33_pt1_rk3_dtk2_T1, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_SL |
| Scout | Разведчик | `Character_RHS_RF_SOBROlive_Scout.et` | `{6B673E6D2FC67193}` | UNCATALOGED_PREFAB | Rifle_AK104, Handgun_Glock17 |  |
| Scout | Разведчик | `Character_RHS_RF_SOBROlive_Scout2.et` | `{934366CD6D66BC63}` | UNCATALOGED_PREFAB | Rifle_AK103, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_Scout |
| Scout | Разведчик | `Character_RHS_RF_SOBROlive_Scout3.et` | `{76DF2A3461832B08}` | UNCATALOGED_PREFAB | Rifle_AK105, Handgun_Glock17 | cosmetic variant of Character_RHS_RF_SOBROlive_Scout |

Skipped random/randomized wrappers (88): Character_RHS_RF_MSV_VKPO_3.0_AAT_Random, Character_RHS_RF_MSV_VKPO_3.0_AMG_Random, Character_RHS_RF_MSV_VKPO_3.0_AR_Random, Character_RHS_RF_MSV_VKPO_3.0_AT_Random, Character_RHS_RF_MSV_VKPO_3.0_Ammo_Random, Character_RHS_RF_MSV_VKPO_3.0_GL_Random, Character_RHS_RF_MSV_VKPO_3.0_MG_Random, Character_RHS_RF_MSV_VKPO_3.0_Medic_Random, Character_RHS_RF_MSV_VKPO_3.0_PL_Random, Character_RHS_RF_MSV_VKPO_3.0_RTO_Random, Character_RHS_RF_MSV_VKPO_3.0_Rifleman_Random, Character_RHS_RF_MSV_VKPO_3.0_SL_Random, Character_RHS_RF_MSV_VKPO_3.0_SR_Random, Character_RHS_RF_MSV_VKPO_3.0_Sapper_Random, Character_RHS_RF_MSV_VKPO_3.0_Scout_RTO_Random, Character_RHS_RF_MSV_VKPO_3.0_Scout_Random, Character_RHS_RF_MSV_VKPO_3.0_Sergeant_Random, Character_RHS_RF_MSV_VKPO_3.0_Sharpshooter_Random, Character_RHS_RF_MSV_VKPO_DS_AAT_Random, Character_RHS_RF_MSV_VKPO_DS_AMG_Random, Character_RHS_RF_MSV_VKPO_DS_AR_Random, Character_RHS_RF_MSV_VKPO_DS_AT_Random, Character_RHS_RF_MSV_VKPO_DS_Ammo_Random, Character_RHS_RF_MSV_VKPO_DS_GL_Random, Character_RHS_RF_MSV_VKPO_DS_LAT_Random, Character_RHS_RF_MSV_VKPO_DS_MG_Random, Character_RHS_RF_MSV_VKPO_DS_Medic_Random, Character_RHS_RF_MSV_VKPO_DS_PL_Random, Character_RHS_RF_MSV_VKPO_DS_RTO_Random, Character_RHS_RF_MSV_VKPO_DS_Rifleman_Random, Character_RHS_RF_MSV_VKPO_DS_SL_Random, Character_RHS_RF_MSV_VKPO_DS_SR_GL_Random, Character_RHS_RF_MSV_VKPO_DS_SR_Random, Character_RHS_RF_MSV_VKPO_DS_Sapper_Random, Character_RHS_RF_MSV_VKPO_DS_Scout_RTO_Random, Character_RHS_RF_MSV_VKPO_DS_Scout_RadioRecon_Random, Character_RHS_RF_MSV_VKPO_DS_Scout_Random, Character_RHS_RF_MSV_VKPO_DS_Sergeant_Random, Character_RHS_RF_MSV_VKPO_DS_Sharpshooter_Random, Character_RHS_RF_MSV_VKPO_DS_Spotter_GL_Random, Character_RHS_RF_MSV_VKPO_DS_Spotter_Random, Character_RHS_RF_MSV_VKPO_S_AAT_Random, Character_RHS_RF_MSV_VKPO_S_AMG_Random, Character_RHS_RF_MSV_VKPO_S_AR_Random, Character_RHS_RF_MSV_VKPO_S_AT_Random, Character_RHS_RF_MSV_VKPO_S_Ammo_Random, Character_RHS_RF_MSV_VKPO_S_GL_Random, Character_RHS_RF_MSV_VKPO_S_LAT_Random, Character_RHS_RF_MSV_VKPO_S_MG_Random, Character_RHS_RF_MSV_VKPO_S_Medic_Random, Character_RHS_RF_MSV_VKPO_S_PL_Random, Character_RHS_RF_MSV_VKPO_S_RTO_Random, Character_RHS_RF_MSV_VKPO_S_Rifleman_Random, Character_RHS_RF_MSV_VKPO_S_SL_Random, Character_RHS_RF_MSV_VKPO_S_SR_GL_Random, Character_RHS_RF_MSV_VKPO_S_SR_Random, Character_RHS_RF_MSV_VKPO_S_Sapper_Random, Character_RHS_RF_MSV_VKPO_S_Scout_RTO_Random, Character_RHS_RF_MSV_VKPO_S_Scout_RadioRecon_Random, Character_RHS_RF_MSV_VKPO_S_Scout_Random, Character_RHS_RF_MSV_VKPO_S_Sergeant_Random, Character_RHS_RF_MSV_VKPO_S_Sharpshooter_Random, Character_RHS_RF_MSV_VKPO_S_Spotter_GL_Random, Character_RHS_RF_MSV_VKPO_S_Spotter_Random, Character_RHS_RF_SSO_AAT_Random, Character_RHS_RF_SSO_AT_Random, Character_RHS_RF_SSO_GL_Random, Character_RHS_RF_SSO_MG_Random, Character_RHS_RF_SSO_Medic_Random, Character_RHS_RF_SSO_Rifleman_Random, Character_RHS_RF_SSO_SL_Random, Character_RHS_RF_SSO_Sapper_Random, Character_RHS_RF_SSO_Spotter_Random, Character_RHS_RF_SOF_AAT_Random, Character_RHS_RF_SOF_AT_Random, Character_RHS_RF_SOF_Chad_Random, Character_RHS_RF_SOF_GL_Random, Character_RHS_RF_SOF_MG_Random, Character_RHS_RF_SOF_Medic_Random, Character_RHS_RF_SOF_Rifleman_Random, Character_RHS_RF_SOF_SL_Random, Character_RHS_RF_SOF_Scout_Random, Character_RHS_RF_SOBROlive_GL_Random, Character_RHS_RF_SOBROlive_MG_Random, Character_RHS_RF_SOBROlive_Medic_Random, Character_RHS_RF_SOBROlive_Rifleman_Random, Character_RHS_RF_SOBROlive_SL_Random, Character_RHS_RF_SOBROlive_Scout_Random

Skipped abstract parents (11): Character_RHS_AFRF_Base, Character_RHS_RF_MSV_Flora_BaseLoadout, Character_RHS_RF_MSV_VKPO_3.0_BaseLoadout, Character_RHS_RF_MSV_VKPO_DS_BaseLoadout, Character_RHS_RF_MSV_VKPO_S_BaseLoadout, Character_RHS_RF_MSV_VSR_BaseLoadout, Character_RHS_RF_SSO_BaseLoadout, Character_RHS_RF_SOF_BaseLoadout, Character_RHS_RF_SOF_TacticaBase, Character_RHS_RF_SOBR_BaseLoadout, Character_RHS_RF_SOBROlive_BaseLoadout

## RHS_ION — RHS ION (RHS Status Quo) — enemy-only

Sources: `RHS Status Quo/Configs/EntityCatalog/ION/ION_Characters.conf`; sweep of `reference/RHS Status Quo` under `Prefabs/Characters/Factions/INDFOR/`. Paths below are relative to that prefix.

### RHS_ION (15)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Spotter | Корректировщик огня | `Character_RHS_ION_Marksman.et` | `{FEF9EEE562103D3E}` | UNCATALOGED_PREFAB | Rifle_DOM4A1_ION_ACOG_ReapIR_SD, Handgun_Glock45 |  |
| Spotter | Корректировщик огня | `Character_RHS_ION_Marksman2.et` | `{9697F411F1513A0D}` | UNCATALOGED_PREFAB | Rifle_DOM4A1_ION_ACOG_ReapIR_SD, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_Marksman |
| Spotter | Корректировщик огня | `Character_RHS_ION_Marksman3.et` | `{730BB8E8FDB4AD66}` | UNCATALOGED_PREFAB | Rifle_DOM4A1_ION_ACOG_ReapIR_SD, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_Marksman |
| Medic | Врач | `Character_RHS_ION_Medic.et` | `{51ACA7578D7D01F5}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_BLK_ION1, Handgun_Glock45 |  |
| Medic | Врач | `Character_RHS_ION_Medic2.et` | `{E51ADA322865E0CA}` | UNCATALOGED_PREFAB | Rifle_DOM4A1_ION_BRAVO4_SD, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_Medic |
| Medic | Врач | `Character_RHS_ION_Medic3.et` | `{008696CB248077A1}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_BLK_ION1, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_Medic |
| Rifleman | Стрелок | `Character_RHS_ION_Rifleman.et` | `{AC4213B6EA90F029}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_BLK_ION1 |  |
| Rifleman | Стрелок | `Character_RHS_ION_Rifleman2.et` | `{14B31EA458C5E4EB}` | UNCATALOGED_PREFAB | Rifle_DOM4A1_ION_BRAVO4_SD | cosmetic variant of Character_RHS_ION_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Rifleman3.et` | `{F12F525D54207380}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_BLK_ION1 | cosmetic variant of Character_RHS_ION_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_ION_SL.et` | `{EDECFE7965364081}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_BLK_ION1, Handgun_Glock45 |  |
| Squad Leader | Командир отделения | `Character_RHS_ION_SL2.et` | `{22AB32D5BDF35B57}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_BLK_ION1, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_SL |
| Squad Leader | Командир отделения | `Character_RHS_ION_SL3.et` | `{C7377E2CB116CC3C}` | UNCATALOGED_PREFAB | Rifle_DOM4A1_FSP_ION_BRAVO4_SD, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_SL |
| Scout | Разведчик | `Character_RHS_ION_Scout.et` | `{AB12C80AE86DC7DD}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_BLK_ION1, Handgun_Glock45 |  |
| Scout | Разведчик | `Character_RHS_ION_Scout2.et` | `{CA4AE6DF518EA781}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_BLK_ION1, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_Scout |
| Scout | Разведчик | `Character_RHS_ION_Scout3.et` | `{2FD6AA265D6B30EA}` | UNCATALOGED_PREFAB | Rifle_DOMk18_ION_RMR_SD, Handgun_Glock45 | cosmetic variant of Character_RHS_ION_Scout |

### RHS_ION_Coy (12)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Medic | Врач | `Character_RHS_ION_Coy_Medic.et` | `{EADBC108CFAFA662}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_DDC_ION |  |
| Medic | Врач | `Character_RHS_ION_Coy_Medic2.et` | `{9BB60706D0690F3D}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_DDC_ION | cosmetic variant of Character_RHS_ION_Coy_Medic |
| Medic | Врач | `Character_RHS_ION_Coy_Medic3.et` | `{7E2A4BFFDC8C9856}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_DDC_ION | cosmetic variant of Character_RHS_ION_Coy_Medic |
| Rifleman | Стрелок | `Character_RHS_ION_Coy_Rifleman.et` | `{FD5A1A2FA455FAEE}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_DDC_ION |  |
| Rifleman | Стрелок | `Character_RHS_ION_Coy_Rifleman2.et` | `{F73EA958D88D7295}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_DDC_ION | cosmetic variant of Character_RHS_ION_Coy_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Coy_Rifleman3.et` | `{12A2E5A1D468E5FE}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD115_DDC_ION | cosmetic variant of Character_RHS_ION_Coy_Rifleman |
| Squad Leader | Командир отделения | `Character_RHS_ION_Coy_SL.et` | `{FD5A1A2FA455FAEF}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_DDC_ION |  |
| Squad Leader | Командир отделения | `Character_RHS_ION_Coy_SL2.et` | `{9E26280BF26C3E96}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_DDC_ION | cosmetic variant of Character_RHS_ION_Coy_SL |
| Squad Leader | Командир отделения | `Character_RHS_ION_Coy_SL3.et` | `{17EE5012424D26D3}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_DDC_ION | cosmetic variant of Character_RHS_ION_Coy_SL |
| Spotter | Корректировщик огня | `Character_RHS_ION_Coy_Spotter.et` | `{BAD5974D96C6F0CD}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_DDC_ION_ReapIR |  |
| Spotter | Корректировщик огня | `Character_RHS_ION_Coy_Spotter2.et` | `{29D838B5C3B204FD}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_DDC_ION_ReapIR | cosmetic variant of Character_RHS_ION_Coy_Spotter |
| Spotter | Корректировщик огня | `Character_RHS_ION_Coy_Spotter3.et` | `{CC44744CCF579396}` | UNCATALOGED_PREFAB | Rifle_AR15_GA_UD145_DDC_ION_ReapIR | cosmetic variant of Character_RHS_ION_Coy_Spotter |

### RHS_ION_Urban (23)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Sharpshooter | Пехотный снайпер | `Character_RHS_ION_Urban_Marksman.et` | `{B8D79D2C9ADC6159}` | UNCATALOGED_PREFAB | Rifle_M16A2_weaver_marksman |  |
| Sharpshooter | Пехотный снайпер | `Character_RHS_ION_Urban_Marksman2.et` | `{AE339A6E8AF7FDDB}` | UNCATALOGED_PREFAB | Rifle_M16A2_weaver_marksman | cosmetic variant of Character_RHS_ION_Urban_Marksman |
| Sharpshooter | Пехотный снайпер | `Character_RHS_ION_Urban_Marksman3.et` | `{4BAFD69786126AB0}` | UNCATALOGED_PREFAB | Rifle_M16A2_weaver_marksman | cosmetic variant of Character_RHS_ION_Urban_Marksman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman.et` | `{A33B018249DE49E6}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman10.et` | `{A7FC572D7BE2ADF3}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman11.et` | `{42601BD477073A98}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_EOT_pmag |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman12.et` | `{2E342F34CBC3B5B6}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_pmag |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman13.et` | `{CBA863CDC72622DD}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_warden |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman14.et` | `{F69C46F5B24AABEA}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_pmag |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman15.et` | `{13000A0CBEAF3C81}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_sf |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman16.et` | `{7F543EEC026BB3AF}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman17.et` | `{9AC872150E8E24C4}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman18.et` | `{053C749CE8B2A1C1}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_warden |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman19.et` | `{E0A03865E45736AA}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_rmr_warden |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman2.et` | `{2C1770DB2363233D}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_EOT | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman20.et` | `{3EE2EEB466059C63}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine | cosmetic variant of Character_RHS_ION_Urban_Rifleman2 |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman3.et` | `{C98B3C222F86B456}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_EOT_pmag | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman4.et` | `{F4BF191A5AEA3D61}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_rmr | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman5.et` | `{112355E3560FAA0A}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_rmr_warden | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman6.et` | `{7D776103EACB2524}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1 | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman7.et` | `{98EB2DFAE62EB24F}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_pmag | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman8.et` | `{071F2B730012374A}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_pmag_warden | cosmetic variant of Character_RHS_ION_Urban_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_Rifleman9.et` | `{E283678A0CF7A021}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_weaver_T1_pmag_warden | cosmetic variant of Character_RHS_ION_Urban_Rifleman |

### RHS_ION_Urban_demi (11)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman.et` | `{A1F593882E99452D}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman10.et` | `{8C08158988558DE5}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman11.et` | `{6994597084B01A8E}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 |  |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman2.et` | `{3A966B44EA5DE319}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman3.et` | `{DF0A27BDE6B87472}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman4.et` | `{E23E028593D4FD45}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman5.et` | `{07A24E7C9F316A2E}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman6.et` | `{6BF67A9C23F5E500}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman7.et` | `{8E6A36652F10726B}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman8.et` | `{119E30ECC92CF76E}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |
| Rifleman | Стрелок | `Character_RHS_ION_Urban_D_Rifleman9.et` | `{F4027C15C5C96005}` | UNCATALOGED_PREFAB | Rifle_M4A1_BLOCK_1_ION_V2 | cosmetic variant of Character_RHS_ION_Urban_D_Rifleman |

Skipped random/randomized wrappers (12): Character_RHS_ION_Marksman_Random, Character_RHS_ION_Medic_Random, Character_RHS_ION_Rifleman_Random, Character_RHS_ION_SL_Random, Character_RHS_ION_Scout_Random, Character_RHS_ION_Coy_Medic_Random, Character_RHS_ION_Coy_Rifleman_Random, Character_RHS_ION_Coy_SL_Random, Character_RHS_ION_Coy_Spotter_Random, Character_RHS_ION_Urban_Marksman_Random, Character_RHS_ION_Urban_Rifleman_Random, Character_RHS_ION_Urban_D_Rifleman_Random

Skipped abstract parents (5): Character_RHS_ION_BaseLoadout, Character_RHS_ION_base, Character_RHS_ION_Coy_BaseLoadout, Character_RHS_ION_Urban_BaseLoadout, Character_RHS_ION_Urban_D_BaseLoadout

## UK — British Military (British Forces)

Sources: `British Forces/Configs/EntityCatalog/UK/UK_Characters.conf`; sweep of `reference/British Forces` under `Prefabs/Characters/Factions/BLUFOR/UK_Army/`. Paths below are relative to that prefix.

### 1983/Regulars (22)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Crew Commander | Командир экипажа | `Character_UK_1983_CC.et` | `{FA8C27E4FA636E47}` | OK_CATALOG | Rifle_L2A3_Sterling | stale parent path relinked: BLUFOR/US_Army/Character_UK_1983_Crew.et → BLUFOR/UK_Army/1983/Regulars/Character_UK_1983_Crew.et |
| Crewman | Член экипажа | `Character_UK_1983_Crew.et` | `{834EA2EE05E27E41}` | OK_CATALOG | Rifle_L2A3_Sterling |  |
| Helicopter Crew | Экипаж вертолета | `Character_UK_1983_HeliCrew.et` | `{0E04E64329F4AF38}` | OK_CATALOG | Rifle_L2A3_Sterling, Schermuly_Rocket_Flare_White (inv), Schermuly_Rocket_Flare_Orange (inv) | stale parent path relinked: BLUFOR/US_Army/Character_UK_1983_HeliPilot.et → BLUFOR/UK_Army/1983/Regulars/Character_UK_1983_HeliPilot.et |
| Helicopter Pilot | Пилот вертолета | `Character_UK_1983_HeliPilot.et` | `{B85BC71B4D06D60F}` | OK_CATALOG | Rifle_L2A3_Sterling, Schermuly_Rocket_Flare_White (inv), Schermuly_Rocket_Flare_Orange (inv) |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_UK_1983_Regulars_AMG.et` | `{327FBCA6B02BC5A8}` | OK | Rifle_L1A1_SLR_Plastic |  |
| Machine-Gunner | Пулеметчик | `Character_UK_1983_Regulars_GPMG_No1.et` | `{D005E20AE7CB8431}` | OK | MG_GPMG_L7A2 |  |
| Light Machine-Gunner |  | `Character_UK_1983_Regulars_L4LMG_No1.et` | `{B3BBFBAC7CBF582E}` | OK_CATALOG | MG_L4_LMG |  |
| Anti-Tank Specialist | Бронебойщик | `Character_UK_1983_Regulars_MAW_No1.et` | `{8C380664085E4A89}` | OK | Rifle_L2A3_Sterling, Launcher_84mm_MAW_Optic | carries VariantData |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_UK_1983_Regulars_Maw_No2.et` | `{E06C3284B49AC5A7}` | OK | Rifle_L1A1_SLR_Plastic | carries VariantData |
| Medic | Врач | `Character_UK_1983_Regulars_Medic.et` | `{AF1B1F8F59BB3B0F}` | OK | Rifle_L2A3_Sterling |  |
| Officer | Офицер | `Character_UK_1983_Regulars_Officer.et` | `{FCE20644BDD2D5CC}` | OK_CATALOG | Handgun_HiPower |  |
| Platoon Leader | Командир взвода | `Character_UK_1983_Regulars_PlatoonLeader.et` | `{1958315C7F55F1AA}` | OK | Rifle_L1A1_SLR_Plastic, Handgun_HiPower |  |
| Combat Signaler | Связист | `Character_UK_1983_Regulars_RTO.et` | `{142FD4053B47B4B7}` | OK | Rifle_L2A3_Sterling |  |
| Rifleman | Стрелок | `Character_UK_1983_Regulars_Rifleman.et` | `{A6D0DBFAC6349E22}` | OK | Rifle_L1A1_SLR_Plastic |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_UK_1983_Regulars_Rifleman_LAT.et` | `{F5B9FF92DBFB520C}` | OK | Rifle_L1A1_SLR_Plastic, Launcher_LAW66_L1A1 |  |
| Rifleman | Стрелок | `Character_UK_1983_Regulars_Rifleman_Sterling.et` | `{AD4C5059DE96F917}` | UNCATALOGED_PREFAB | Rifle_L2A3_Sterling |  |
| Sapper | Сапер | `Character_UK_1983_Regulars_Sapper.et` | `{E41871B093958DD1}` | OK | Rifle_L2A3_Sterling |  |
| Section 2IC |  | `Character_UK_1983_Regulars_Section2IC.et` | `{2C69231254D1AEDB}` | OK | Rifle_L1A1_SLR_Plastic_SUIT |  |
| Section Commander |  | `Character_UK_1983_Regulars_SectionCommander.et` | `{FFB42452E9AD5FFC}` | OK | Rifle_L1A1_SLR_Plastic |  |
| Platoon Sergeant | Взводный сержант | `Character_UK_1983_Regulars_Sergeant.et` | `{F1DC0DCDD8677485}` | OK | Rifle_L1A1_SLR_Plastic |  |
| Trained Sniper |  | `Character_UK_1983_Regulars_Sniper.et` | `{FB8600CB9B527FCB}` | OK | Rifle_L42A1, Handgun_HiPower |  |
| Spotter | Корректировщик огня | `Character_UK_1983_Regulars_Spotter.et` | `{33A1A49E7ABEEF78}` | OK | Rifle_L1A1_SLR_Plastic_SUIT | m_bEnabled 0 in catalog |

### 1983/Reservists (4)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Reservist (LAW 66) |  | `Character_UK_1983_Reservist_LAT.et` | `{3812CCED7C78916B}` | OK | Rifle_L1A1_SLR_Laminate, Launcher_LAW66_L1A1 |  |
| Reservist (LMG) |  | `Character_UK_1983_Reservist_LMG.et` | `{B2AD7B366BBE9BD4}` | OK | MG_L4_LMG |  |
| Reservist |  | `Character_UK_1983_Reservist_Rifleman.et` | `{57F707723CD960C7}` | OK | Rifle_L1A1_SLR_Wood |  |
| Reservist Section Commander |  | `Character_UK_1983_Reservist_SectionCommander.et` | `{F035759076B5818A}` | OK | Rifle_L2A3_Sterling |  |

### 1983/SpecialForces (12)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Counter Revolutionary Warfare Trooper |  | `Character_UK_1983_SpecialForces_CRW.et` | `{7778AEFBB5CE20AB}` | OK_CATALOG | Rifle_MP5_SL20, Handgun_HiPower_20 |  |
| Special Forces Anti-Tank |  | `Character_UK_1983_SpecialForces_CharlieG.et` | `{E62ADEF04A5A630C}` | OK_CATALOG | Rifle_L1A1_SLR_Plastic, Launcher_84mm_MAW_Optic |  |
| Special Forces Grenadier | Гранатометчик спецназа | `Character_UK_1983_SpecialForces_GL.et` | `{34480F9B2A83A8F3}` | OK | Rifle_CAR15_653_OliveGreen_SandStripes, Launcher_M79 |  |
| Special Forces Machine-Gunner | Пулеметчик спецназа | `Character_UK_1983_SpecialForces_LMG.et` | `{6B8AAFA0B37BD53A}` | OK | MG_L4_LMG |  |
| Special Forces Medic | Врач спецназа | `Character_UK_1983_SpecialForces_Medic.et` | `{DF457B105509006C}` | OK | Rifle_CAR15_653 |  |
| Special Forces Officer | Офицер спецназа | `Character_UK_1983_SpecialForces_Officer.et` | `{4838874AA8CE9855}` | OK_CATALOG | Rifle_AR15_604_OliveGreen_Solid, Launcher_LAW66_L1A1, Handgun_HiPower |  |
| Special Forces Radio Operator | Радист спецназа | `Character_UK_1983_SpecialForces_RTO.et` | `{205F4DC054E25828}` | OK | Rifle_CAR15_653_OliveGreen_SandStripes |  |
| Special Forces Squad Leader | Командир спецназа | `Character_UK_1983_SpecialForces_SL.et` | `{541580A5EFB063CA}` | OK | Rifle_CAR15_653_OliveGreen_Solid, Welrod |  |
| Special Forces Saboteur |  | `Character_UK_1983_SpecialForces_Saboteur.et` | `{5CF7B3F937BA66ED}` | OK_CATALOG | Rifle_L34A1_Sterling, Welrod |  |
| Special Forces Sapper | Сапер спецназа | `Character_UK_1983_SpecialForces_Sapper.et` | `{A97BEB8FF3472C18}` | OK | Rifle_AR15_604_OliveGreen_Solid, Launcher_LAW66_L1A1 |  |
| Special Forces Sharpshooter | Снайпер спецназа | `Character_UK_1983_SpecialForces_Sharpshooter.et` | `{C7F673EEC46863F2}` | OK | Rifle_L42A1, Handgun_HiPower |  |
| Special Forces Trooper |  | `Character_UK_1983_SpecialForces_Trooper.et` | `{0E74C9F36755655C}` | OK | Rifle_L1A1_SLR_Plastic, Launcher_LAW66_L1A1 |  |

### 1989/Regulars (31)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Crew Commander | Командир экипажа | `Character_UK_1989_CC.et` | `{E38BE58BD3DF365E}` | OK_CATALOG | Rifle_L85A1_Attachments_Irons | stale parent path relinked: BLUFOR/US_Army/Character_UK_1989_Crew.et → BLUFOR/UK_Army/1989/Regulars/Character_UK_1989_Crew.et |
| Crewman | Член экипажа | `Character_UK_1989_Crew.et` | `{21B95ED97AE24289}` | OK | Rifle_L85A1_Attachments_Irons |  |
| Aircraft Commander |  | `Character_UK_1989_HeliCrew.et` | `{FD03E0583287AC1B}` | OK | Rifle_L2A3_Sterling, Schermuly_Rocket_Flare_White (inv), Schermuly_Rocket_Flare_Orange (inv) |  |
| Aircraft Commander |  | `Character_UK_1989_HeliPilot.et` | `{8329B91DB26C922D}` | OK | Handgun_HiPower, Schermuly_Rocket_Flare_White (inv), Schermuly_Rocket_Flare_Orange (inv) |  |
| Ground Crew |  | `Character_UK_1989_Heli_GroundCrew.et` | `{5A4943AF88A0FBE8}` | UNCATALOGED_PREFAB | Rifle_L2A3_Sterling |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_UK_1989_Regulars_AMG.et` | `{146D4295E1E1DFF2}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Convoy Commander |  | `Character_UK_1989_Regulars_ConvoyCommander.et` | `{3FBF6AC8C621AF32}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_Irons |  |
| Detachment Commander |  | `Character_UK_1989_Regulars_DetachmentCommander.et` | `{564622CD8C4FA227}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_SUSAT |  |
| Driver | Водитель | `Character_UK_1989_Regulars_Driver.et` | `{8105DD9A6CB40F8D}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_Irons |  |
| Machine-Gunner | Пулеметчик | `Character_UK_1989_Regulars_GPMG_No1.et` | `{111A85E9DD0EB2B6}` | OK | MG_GPMG_L7A2 |  |
| LSW Gunner |  | `Character_UK_1989_Regulars_LSW.et` | `{D0F124C1610D3232}` | OK | Rifle_L85_LSW_A1_Attachments_SUSAT |  |
| Anti-Tank Specialist | Бронебойщик | `Character_UK_1989_Regulars_MAW_No1.et` | `{02E60251E009D3BD}` | OK | Rifle_L85A1_Attachments_SUSAT, Launcher_84mm_MAW_Optic | carries VariantData |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_UK_1989_Regulars_Maw_No2.et` | `{B317C07044D4B06F}` | OK | Rifle_L85A1_Attachments_SUSAT | carries VariantData |
| Medic | Врач | `Character_UK_1989_Regulars_Medic.et` | `{59DC74EF0ECF7E49}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Officer | Офицер | `Character_UK_1989_Regulars_Officer.et` | `{6D4AB9E422430636}` | OK | Handgun_HiPower |  |
| Platoon Leader | Командир взвода | `Character_UK_1989_Regulars_PlatoonLeader.et` | `{F487760AB6777BF3}` | OK | Rifle_L85A1_Attachments_SUSAT, Handgun_HiPower |  |
| Combat Signaler | Связист | `Character_UK_1989_Regulars_RTO.et` | `{323D2A366A8DAEED}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Rifleman | Стрелок | `Character_UK_1989_Regulars_Rifleman.et` | `{4AF2023E868540E7}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Rifleman (LAW 66) |  | `Character_UK_1989_Regulars_Rifleman_LAT_LAW66.et` | `{B3B68543494C3B8E}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_SUSAT, Launcher_LAW66_L1A1 |  |
| Rifleman (LAW 80) |  | `Character_UK_1989_Regulars_Rifleman_LAT_LAW80.et` | `{B10659FFD99279DC}` | OK | Rifle_L85A1_Attachments_SUSAT, Launcher_LAW80_base |  |
| Mortarman |  | `Character_UK_1989_Regulars_Rifleman_Mortar.et` | `{96C9CA768A4D36DF}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_Irons |  |
| Rifleman (Recce) |  | `Character_UK_1989_Regulars_Rifleman_Recce.et` | `{9C92456D731A6DAA}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_SUSAT |  |
| Combat Engineer |  | `Character_UK_1989_Regulars_Sapper.et` | `{08E104521DE26461}` | OK | Rifle_L85A1_Attachments_Irons, Mine_L9A1_Barmine |  |
| Assault Engineer |  | `Character_UK_1989_Regulars_Sapper_Assault.et` | `{91CA00A021FC8834}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_SUSAT |  |
| Section 2IC |  | `Character_UK_1989_Regulars_Section2IC.et` | `{F9E2E97FA21AA133}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Section Commander |  | `Character_UK_1989_Regulars_SectionCommander.et` | `{7D7C6FBCBA40F45D}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Section Commander (Recce) |  | `Character_UK_1989_Regulars_SectionCommander_Recce.et` | `{7865DE528AEF1FF0}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_SUSAT |  |
| Platoon Sergeant | Взводный сержант | `Character_UK_1989_Regulars_Sergeant.et` | `{B9CFB916A26682D6}` | OK | Rifle_L85A1_Attachments_SUSAT |  |
| Trained Sniper |  | `Character_UK_1989_Regulars_Sniper.et` | `{68463C017BA8C3EB}` | OK | Rifle_AI_L96A1_PM6x42, Handgun_HiPower |  |
| Trained Sniper |  | `Character_UK_1989_Regulars_Sniper_Recce.et` | `{62B41F5648E706F0}` | UNCATALOGED_PREFAB | Rifle_AI_L96A1_PM6x42, Handgun_HiPower |  |
| Spotter | Корректировщик огня | `Character_UK_1989_Regulars_Spotter.et` | `{4E9A3CAA773252F0}` | UNCATALOGED_PREFAB | Rifle_L85A1_Attachments_SUSAT |  |

### 1989/Reservists (8)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Reservist (LAW 66) |  | `Character_UK_1989_Reservist_LAT.et` | `{32C3AC2DE395CB05}` | OK | Rifle_L1A1_SLR_Plastic, Launcher_LAW66_L1A1 |  |
| Officer Cadet |  | `Character_UK_1989_Reservist_Officer.et` | `{2B867D53E25C485C}` | UNCATALOGED_PREFAB | Rifle_L2A3_Sterling |  |
| Reservist Section Commander |  | `Character_UK_1989_Reservist_SectionCommander.et` | `{130A2E98EF961445}` | OK | Rifle_L2A3_Sterling |  |
| Driver (Reservist) |  | `Character_UK_1989_Reservists_Driver.et` | `{18803AC6D0C311D7}` | UNCATALOGED_PREFAB | Rifle_L2A3_Sterling |  |
| Reservist Engineer |  | `Character_UK_1989_Reservists_Engineer.et` | `{4FAB226017A82F43}` | OK | Rifle_L2A3_Sterling, Mine_Mk7 |  |
| Reservist (LMG) |  | `Character_UK_1989_Reservists_LMG.et` | `{F22E993715463973}` | OK_CATALOG | MG_L4_LMG |  |
| Reservist |  | `Character_UK_1989_Reservists_Rifleman.et` | `{B286CF6178DEEBE3}` | OK | Rifle_L1A1_SLR_Plastic |  |
| Reservist (Recce) |  | `Character_UK_1989_Reservists_Rifleman_Recce.et` | `{134FFEADD353AA31}` | OK | Rifle_L1A1_SLR_Plastic |  |

### 1989/SpecialForces (13)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Special Forces Anti-Tank |  | `Character_UK_1989_SpecialForces_CharlieG.et` | `{B801B6E50A01209F}` | OK_CATALOG | Rifle_AR15_715_OliveGreen_Solid, Launcher_84mm_MAW_Optic, Handgun_HiPower |  |
| Special Forces Grenadier | Гранатометчик спецназа | `Character_UK_1989_SpecialForces_GL.et` | `{101531EFC9E0E85B}` | OK | Rifle_AR15_M203_715_OliveGreen_Solid, Handgun_HiPower |  |
| Special Forces Machine-Gunner | Пулеметчик спецназа | `Character_UK_1989_SpecialForces_GPMG.et` | `{62D02E1AA4A4B305}` | OK | MG_GPMG_L7A2, Handgun_HiPower |  |
| Special Forces Machine-Gunner | Пулеметчик спецназа | `Character_UK_1989_SpecialForces_LMG.et` | `{CF564BD6D0DA773A}` | OK | MG_Minimi, Handgun_HiPower |  |
| Special Forces Medic | Врач спецназа | `Character_UK_1989_SpecialForces_Medic.et` | `{58BD727F9736FC19}` | OK | Rifle_CAR15_733_OliveGreen_Solid, Handgun_HiPower |  |
| Special Forces Officer | Офицер спецназа | `Character_UK_1989_SpecialForces_Officer.et` | `{9050187791D8C55D}` | OK_CATALOG | Rifle_CAR15_733_OliveGreen_SandStripes, Launcher_LAW66_L1A1, Handgun_HiPower |  |
| Special Forces Radio Operator | Радист спецназа | `Character_UK_1989_SpecialForces_RTO.et` | `{6471B09A37F58FD4}` | OK | Rifle_CAR15_733_OliveGreen_SandStripes, Launcher_LAW66_L1A1, Handgun_HiPower |  |
| Special Forces Squad Leader | Командир спецназа | `Character_UK_1989_SpecialForces_SL.et` | `{6FAAF2B4A124BA7F}` | OK | Rifle_AR15_M203_715_OliveGreen_SandStripes, Welrod |  |
| Special Forces Saboteur |  | `Character_UK_1989_SpecialForces_Saboteur.et` | `{02DCDBEC77E1257E}` | OK | Rifle_MP5SD3, Welrod |  |
| Special Forces Sapper | Сапер спецназа | `Character_UK_1989_SpecialForces_Sapper.et` | `{2B1775204D8A02F2}` | OK | Rifle_CAR15_733_OliveGreen_Solid, Launcher_LAW66_L1A1, Handgun_HiPower |  |
| Special Forces PM Sniper |  | `Character_UK_1989_SpecialForces_Sniper.et` | `{98DC13CEC2967722}` | OK | Rifle_AI_PM_SF_PM6x42, Handgun_HiPower |  |
| Special Forces PM Sniper (Covert) |  | `Character_UK_1989_SpecialForces_SniperCovert.et` | `{94F4290723AD153B}` | OK | Rifle_AI_PMSD_PM6x42, Welrod |  |
| Special Forces Trooper |  | `Character_UK_1989_SpecialForces_Trooper.et` | `{A2F125ECA3AD0305}` | OK | Rifle_AR15_715_OliveGreen_Solid, Launcher_LAW66_L1A1, Handgun_HiPower |  |

### (root) (7)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Sniper | Снайпер | `Character_UK_1983_SF_Sniper.et` | — | UNCATALOGED_NO_GUID | Rifle_L42A1, Handgun_HiPower |  |
| Spotter | Корректировщик огня | `Character_UK_1983_SF_Spotter.et` | — | UNCATALOGED_NO_GUID | Rifle_L1A1_SLR_Laminate |  |
| Machine-Gunner | Пулеметчик | `Character_UK_Patrol_Gunner.et` | — | UNCATALOGED_NO_GUID | MG_GPMG_L7A2 |  |
| Section Commander |  | `Character_UK_Patrol_Leader.et` | — | UNCATALOGED_NO_GUID | Rifle_AR15_604, Launcher_LAW66_L1A1 |  |
| Combat Signaler | Связист | `Character_UK_Patrol_Signals.et` | — | UNCATALOGED_NO_GUID | Rifle_AR15_604, Launcher_LAW66_L1A1 |  |
| Rifleman | Стрелок | `Character_UK_Patrol_Trooper.et` | — | UNCATALOGED_NO_GUID | Rifle_L1A1_SLR_Plastic, Launcher_LAW66_L1A1 |  |
| Unarmed | Невооруженный | `Character_UK_Unarmed.et` | `{B528DED2712C9982}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |

Skipped abstract parents (9): Character_UK_1983_Regulars_BaseLoadout, Character_UK_1983_Reservist_BaseLoadout, Character_UK_1983_SpecialForces_BaseLoadout, Character_UK_1989_Regulars_BaseLoadout, Character_UK_1989_Reservists_BaseLoadout, Character_UK_1989_SpecialForces_BaseLoadout, Character_UK_Base, Character_UK_BaseLoadout, Character_UK_Patrol_Base

## MEI — Middle East Insurgents — enemy-only

Sources: `MiddleEastInsurgents/Configs/EntityCatalog/MEI/Characters_EntityCatalog_MEI.conf`, `MiddleEastInsurgents/Configs/EntityCatalog/FIA/Characters_EntityCatalog_MEI.conf`; sweep of `reference/MiddleEastInsurgents` under `Prefabs/Characters/Factions/IND/MEI/`. Paths below are relative to that prefix.

### (root) (32)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Grenadier | Гренадер | `Character_MEI_AG1.et` | `{91D9FF2600E080AF}` | OK | Rifle_AK74N_GP25 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_MEI_AR.et` | `{18A9F48EBB87D2F0}` | OK | MG_RPK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_MEI_AR2.et` | `{EADA2C708DB52BC8}` | OK | MG_RPK74 | cosmetic variant of Character_MEI_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_MEI_AR3.et` | `{0F4660898150BCA3}` | OK | MG_RPK74 | cosmetic variant of Character_MEI_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_MEI_ARifleman1.et` | `{A47DAC6EE8361F75}` | OK | MG_RPK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_MEI_ARifleman2.et` | `{C829988E54F2905B}` | OK | MG_RPK74 |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_MEI_ARifleman3.et` | `{2DB5D47758170730}` | OK | MG_RPK74 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_MEI_AT.et` | `{46CBE7ED7435A25C}` | OK | Rifle_AK74, Launcher_RPG7_PGO7 | stale parent path relinked: IND/MEI/Character_MEI_Rifle1.et → IND/MEI/Character_MEI_Rifleman1.et |
| Anti-Tank Specialist | Бронебойщик | `Character_MEI_AT1.et` | `{F6438A49A355F155}` | OK | Rifle_AK74, Launcher_RPG7_PGO7 | cosmetic variant of Character_MEI_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_MEI_AT2.et` | `{6A455C4D045B7B4F}` | OK | Rifle_AK74, Launcher_RPG7_PGO7 | cosmetic variant of Character_MEI_AT; catalogs disagree: {6A455C4D045B7B4F} / {9A17BEA91F917E7B}; stale parent path relinked: IND/MEI/Character_MEI_Rifle1.et → IND/MEI/Character_MEI_Rifleman1.et |
| Bomb vest Warrior |  | `Character_MEI_Bomb.et` | `{11CF9580EEE827F6}` | OK | Rifle_AKS74U |  |
| Vest Man | Человек в жилете | `Character_MEI_Bomber.et` | `{958C0AB8ECDA03F9}` | OK | Rifle_AKS74U |  |
| Crew Commander | Командир экипажа | `Character_MEI_CC.et` | `{1451CFEED16DB58C}` | OK | Rifle_AKS74U |  |
| Crewman | Член экипажа | `Character_MEI_Crew.et` | `{8B556AC161BE7405}` | OK | Rifle_AKS74U |  |
| Grenadier | Гренадер | `Character_MEI_GL.et` | `{157C8AAF4C30BBDA}` | OK | Rifle_AK74N_GP25 |  |
| Helicopter Crew | Экипаж вертолета | `Character_MEI_HeliCrew.et` | `{013E137EEB9F000F}` | OK | — | UNARMED (no weapon in slots or inventory) |
| Helicopter Pilot | Пилот вертолета | `Character_MEI_HeliPilot.et` | `{9EEA722ACE508FDB}` | OK | — | UNARMED (no weapon in slots or inventory) |
| Machine-Gunner | Пулеметчик | `Character_MEI_LMG1.et` | `{B582888C61E30624}` | OK | MG_PKM |  |
| Machine-Gunner | Пулеметчик | `Character_MEI_LMG2.et` | `{D9D6BC6CDD27890A}` | OK | MG_UK59 |  |
| Officer | Офицер | `Character_MEI_Leader.et` | `{15CD0954AEE19BF2}` | OK | Rifle_AK74 | catalogs disagree: {15CD0954AEE19BF2} / {58B923E15109E91A} |
| Machine-Gunner | Пулеметчик | `Character_MEI_MG.et` | `{8A6672A86B068679}` | OK | MG_PKM |  |
| Machine-Gunner | Пулеметчик | `Character_MEI_MG2.et` | `{307A5448B2E63ECC}` | OK | MG_UK59 | cosmetic variant of Character_MEI_MG |
| Medic | Врач | `Character_MEI_Medic.et` | `{E6324648D7C20957}` | OK | Rifle_VZ58V |  |
| Rifleman | Стрелок | `Character_MEI_Rifleman1.et` | `{F95AEA26749B12EC}` | OK | Rifle_AK74 | catalogs disagree: {F95AEA26749B12EC} / {76B11940F6EDF623} |
| Rifleman | Стрелок | `Character_MEI_Rifleman2.et` | `{950EDEC6C85F9DC2}` | OK | Rifle_AK74 | catalogs disagree: {950EDEC6C85F9DC2} / {EB364CCCBCFD29A5} |
| Rifleman | Стрелок | `Character_MEI_Rifleman3.et` | `{7092923FC4BA0AA9}` | OK | Rifle_VZ58V | catalogs disagree: {7092923FC4BA0AA9} / {0EAA0035B018BECE} |
| Rifleman | Стрелок | `Character_MEI_Rifleman4.et` | `{4DA6B707B1D6839E}` | OK | Rifle_AK74 | catalogs disagree: {4DA6B707B1D6839E} / {339E250DC57437F9} |
| Rifleman | Стрелок | `Character_MEI_Rifleman5.et` | `{A83AFBFEBD3314F5}` | OK | Rifle_AK74 | catalogs disagree: {A83AFBFEBD3314F5} / {D60269F4C991A092} |
| Sapper | Сапер | `Character_MEI_Sapper.et` | `{0482D36FE842BB41}` | OK | Rifle_AKS74U | catalogs disagree: {0482D36FE842BB41} / {E1E6ACDA18F1AB27}; stale parent path relinked: IND/MEI/Character_MEI_Rifle1.et → IND/MEI/Character_MEI_Rifleman1.et |
| Scout | Разведчик | `Character_MEI_Scout.et` | `{A8DCD6A481346FB4}` | OK | Rifle_VZ58V |  |
| Sharpshooter | Пехотный снайпер | `Character_MEI_Sharpshooter.et` | `{16269A5F2CD693E4}` | OK | Rifle_SVD_PSO, Handgun_PM |  |
| Sharpshooter | Пехотный снайпер | `Character_MEI_Sniper.et` | `{95F67CCC15CAB4CE}` | OK | Rifle_SVD_PSO | catalogs disagree: {95F67CCC15CAB4CE} / {8F6B34BB2FDEE4CD} |

Skipped random/randomized wrappers (1): Character_MEI_Randomized

Skipped abstract parents (2): Character_MEI_Base, Character_MEI_BaseLoadout

## PLASTICBANDIT — Bandits (Bandit Faction) — enemy-only

Sources: `Bandit Faction/Configs/EntityCatalog/PLASTICBANDIT/Characters_EntityCatalog_PLASTICBANDIT.conf`; sweep of `reference/Bandit Faction` + `reference/Bandit Gear` under `Prefabs/Characters/Factions/PLASTICBANDIT/`. Paths below are relative to that prefix.

### Scav (12)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Brute |  | `Character_PLASTICBANDIT_Scav_Brute.et` | `{E520BB188371797C}` | OK | Rifle_AK74N_GP25, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Chad |  | `Character_PLASTICBANDIT_Scav_Chad.et` | `{4AF5CA8950F943BB}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_AP2k, Handgun_M9 | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Chad |  | `Character_PLASTICBANDIT_Scav_Chad_2.et` | `{7433F98C68B21BCC}` | UNCATALOGED_PREFAB | Rifle_M16A2_carbine_OliveGreen_Sand_Stripes, Handgun_M9 | cosmetic variant of Character_PLASTICBANDIT_Scav_Chad; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Chad |  | `Character_PLASTICBANDIT_Scav_Chad_3.et` | `{A0F9C5C818B353B1}` | UNCATALOGED_PREFAB | Rifle_VZ58V, Handgun_M9 | cosmetic variant of Character_PLASTICBANDIT_Scav_Chad; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Gopnik |  | `Character_PLASTICBANDIT_Scav_Gopnik.et` | `{ED01FD5B050F8D1C}` | UNCATALOGED_PREFAB | Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Gopnik |  | `Character_PLASTICBANDIT_Scav_Gopnik_2.et` | `{CDF7E3D4AFDDF4A1}` | UNCATALOGED_PREFAB | Rifle_M21, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Scav_Gopnik; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Gunner |  | `Character_PLASTICBANDIT_Scav_Gunner.et` | `{82039BBAC7BE7D12}` | OK | MG_PKM, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Rocketeer |  | `Character_PLASTICBANDIT_Scav_RPG.et` | `{ABAAFB98DB36C615}` | OK | Launcher_RPG7, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Scav |  | `Character_PLASTICBANDIT_Scav_Rookie.et` | `{40E3BABD93B85F2D}` | UNCATALOGED_PREFAB | Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Scav |  | `Character_PLASTICBANDIT_Scav_Rookie_2.et` | `{C1F886698C7AB55F}` | UNCATALOGED_PREFAB | Rifle_AKS74U_Bandit, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Scav_Rookie; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Scav |  | `Character_PLASTICBANDIT_Scav_Veteran.et` | `{08AFE0C974319080}` | UNCATALOGED_PREFAB | Rifle_AK74, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Scav |  | `Character_PLASTICBANDIT_Scav_Veteran_2.et` | `{B1719853A46DC880}` | UNCATALOGED_PREFAB | Rifle_AKS74U_Bandit, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Scav_Veteran; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |

### Stalker (8)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Veteran |  | `Character_PLASTICBANDIT_Stalker_Legend.et` | `{9612646CDFA61CFF}` | UNCATALOGED_PREFAB | Rifle_SVD, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Veteran |  | `Character_PLASTICBANDIT_Stalker_Legend_2.et` | `{F173BD4149CB592B}` | UNCATALOGED_PREFAB | Rifle_SVD, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Stalker_Legend; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Veteran |  | `Character_PLASTICBANDIT_Stalker_Legend_3.et` | `{9D5B9E1B2E7D29B2}` | UNCATALOGED_PREFAB | Rifle_SVD, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Stalker_Legend; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Rookie |  | `Character_PLASTICBANDIT_Stalker_Rookie.et` | `{1063DF1108C9D39B}` | UNCATALOGED_PREFAB | Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Rookie |  | `Character_PLASTICBANDIT_Stalker_Rookie_2.et` | `{ED3CD4AD2E8DCE0F}` | UNCATALOGED_PREFAB | Rifle_AKS74U_Bandit, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Stalker_Rookie; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Wraith |  | `Character_PLASTICBANDIT_Stalker_Shadow.et` | `{22B4E6BA1E4F0B30}` | OK | Rifle_M21_ARTII_OliveGreen_Sand_Stripes_Wrapped, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Rookie |  | `Character_PLASTICBANDIT_Stalker_Veteran.et` | `{34F236B87F308240}` | UNCATALOGED_PREFAB | Rifle_AK74N_1P29, Handgun_PM | stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |
| Rookie |  | `Character_PLASTICBANDIT_Stalker_Veteran_2.et` | `{620C07C16012A63F}` | UNCATALOGED_PREFAB | Rifle_AKS74U_Bandit, Handgun_PM | cosmetic variant of Character_PLASTICBANDIT_Stalker_Veteran; stale parent path relinked: INDFOR/BANDIT/Character_BANDIT_BaseLoadout.et → PLASTICBANDIT/Character_PLASTICBANDIT_BaseLoadout.et; stale parent path relinked: BANDIT/Character_BANDIT_base.et → PLASTICBANDIT/Character_PLASTICBANDIT_base.et (renamed ancestor, matched by suffix) |

Skipped random/randomized wrappers (6): Character_PLASTICBANDIT_Chad_Randomized, Character_PLASTICBANDIT_Gopnik_Randomized, Character_PLASTICBANDIT_Randomized, Character_PLASTICBANDIT_Rookie_Randomized, Character_PLASTICBANDIT_Scav_Randomized, Character_PLASTICBANDIT_Veteran_Randomized

Skipped abstract parents (4): Character_PLASTICBANDIT_BaseLoadout, Character_PLASTICBANDIT_base, Character_PLASTICBANDIT_Scav_BaseLoadout, Character_PLASTICBANDIT_Stalker_BaseLoadout

## SFS_US — SFS US (Abrashka loadout pack, alias of US) — no catalogs

Sources: no character catalogs; sweep of `reference/SFS US Loadout` under `Prefabs/Characters/Factions/BLUFOR/US_Army/`. Paths below are relative to that prefix.

### (root) (13)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Light AT Rifleman | Легкий бронебойщик | `Character_US_AT.et` | `{270F46FC595C0CCF}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Launcher_MK153mod2, Spec Series |  |
| Crewman | Член экипажа | `Character_US_Crew.et` | `{E1CB513B8B9B08F5}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Spec Series |  |
| Team Leader | Командир группы | `Character_US_FTL.et` | `{DD8871B53B595AEC}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_Block2_UGL, Spec Series |  |
| Special Forces Grenadier | Гранатометчик спецназа | `Character_US_GP.et` | `{06A2C5FD02D05F65}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_Block2_UGL, GL_GM94_camo, Spec Series |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_US_LightAT.et` | `{526AEFB356C2F1BF}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Launcher_M72A3, Spec Series |  |
| Machine-Gunner | Пулеметчик | `Character_US_MG.et` | `{ADB0F1274E9A0670}` | UNCATALOGED_PREFAB | Mk48 Tan, Spec Series |  |
| Medic | Врач | `Character_US_Medic.et` | `{CDA1BFA445A6C6F5}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Spec Series |  |
| Officer | Офицер | `Character_US_PL.et` | `{0B3167BB0FB68111}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_Block2_UGL, Spec Series |  |
| Helicopter Pilot | Пилот вертолета | `Character_US_Pilot.et` | `{8B2D21607CC52AE7}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Spec Series |  |
| Rifleman | Стрелок | `Character_US_Rifleman.et` | `{F44F87222B67E26A}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Spec Series |  |
| Special Forces Squad Leader | Командир спецназа | `Character_US_SL.et` | `{922FDE221251B080}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_Block2_UGL, Spec Series |  |
| Sapper | Сапер | `Character_US_Sapper.et` | `{E72229CB79558754}` | UNCATALOGED_PREFAB | Rifle_M4_Variant_URGI, Spec Series |  |
| Sniper | Снайпер | `Character_US_Sniper.et` | `{C0EE7CD6A89B123B}` | UNCATALOGED_PREFAB | Rifle_M40A5_UPD, Spec Series |  |

## SFS_USSR — SFS RF (Abrashka loadout pack, alias of USSR) — no catalogs

Sources: no character catalogs; sweep of `reference/SFS RF Loadout` under `Prefabs/Characters/Factions/OPFOR/USSR_Army/`. Paths below are relative to that prefix.

### (root) (13)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist | Бронебойщик | `Character_RF_AT.et` | `{81569EB41A4DAD62}` | UNCATALOGED_PREFAB | 105AK, Launcher_RPG7_pgo7, Handgun_PM |  |
| Crewman | Экипаж | `Character_RF_Crew.et` | `{4DF623E7F9C0F333}` | UNCATALOGED_PREFAB | 105AK, Handgun_PM |  |
| Team Leader | Командир группы | `Character_RF_FTL.et` | `{7202885B2B9F0906}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25, Handgun_PM |  |
| Grenadier | Гренадер | `Character_RF_GL.et` | `{542B89549473DA14}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25, GL_GM94_camo, Handgun_PM |  |
| Anti-Tank Specialist | Бронебойщик | `Character_RF_LAT.et` | `{4465FCB62ED31D3B}` | UNCATALOGED_PREFAB | 105AK, Launcher_RPOD, Handgun_PM |  |
| Machine-Gunner | Пулеметчик | `Character_RF_MG.et` | `{0BE9296F0D8BA7DD}` | UNCATALOGED_PREFAB | MG_PKP_B_base_MUFFISBEST_G, Handgun_PM |  |
| Special Forces Medic | Врач спецназа | `Character_RF_Medic.et` | `{1106DD26506B4B87}` | UNCATALOGED_PREFAB | 105AK, Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_RF_PL.et` | `{AD68BFF34CA720BD}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25, Handgun_PM |  |
| Helicopter Pilot | Пилот вертолета | `Character_RF_Pilot.et` | `{578A43E26908A795}` | UNCATALOGED_PREFAB | 105AK, Handgun_PM |  |
| Rifleman | Стрелок | `Character_RF_Rifleman.et` | `{814572381FE980FD}` | UNCATALOGED_PREFAB | 105AK, Handgun_PM |  |
| Squad Leader | Командир отделения | `Character_RF_SL.et` | `{3476066A5140112D}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25, Handgun_PM |  |
| Rifleman | Стрелок | `Character_RF_Sapper.et` | `{989653474741CABD}` | UNCATALOGED_PREFAB | 105AK, Handgun_PM |  |
| Special Forces Sharpshooter | Снайпер спецназа | `Character_RF_Sniper.et` | `{F61BCB26706E8557}` | UNCATALOGED_PREFAB | Rifle_ORSIS_T5000_Forest, Handgun_PM |  |

Skipped abstract parents (1): Character_USSR_Base

## SFS_FIA — SFS FIA (Abrashka loadout pack, alias of FIA) — no catalogs

Sources: no character catalogs; sweep of `reference/SFS FIA Loadout` under `Prefabs/Characters/Factions/INDFOR/FIA/`. Paths below are relative to that prefix.

### (root) (13)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist | Бронебойщик | `Character_FIA_AT.et` | `{AF47482BCE451DDE}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Launcher_RPG7_pgo7, Handgun_APS |  |
| Crewman | Член экипажа | `Character_FIA_Crew.et` | `{641AD7731E23454C}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Team Leader | Командир группы | `Character_FIA_FTL.et` | `{F11A8F6843FFE69F}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| EditableEntity_Character_Grenadier |  | `Character_FIA_GL.et` | `{7A3A5FCB407B6AA8}` | UNCATALOGED_PREFAB | Rifle_AK74M_b10m_b19n_npz_rail_perst_Eot_gp25, Handgun_APS |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_FIA_LAT.et` | `{C77DFB8546B3F2A3}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Launcher_RPOA, Handgun_APS |  |
| Machine-Gunner | Пулеметчик | `Character_FIA_MG.et` | `{25F8FFF0D9831761}` | UNCATALOGED_PREFAB | MG_PKM_B51_1p86, Handgun_APS |  |
| Medic | Врач | `Character_FIA_Medic.et` | `{E11E955F2771D774}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Platoon Leader | Командир взвода | `Character_FIA_PL.et` | `{8379696C98AF9001}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Helicopter Pilot | Пилот вертолета | `Character_FIA_Pilot.et` | `{A7920B9B1E123B66}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Rifleman | Стрелок | `Character_FIA_Rifleman.et` | `{11E0896C07A2338B}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Squad Leader | Командир отделения | `Character_FIA_SL.et` | `{1A67D0F58548A191}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Sapper | Сапер | `Character_FIA_Sapper.et` | `{066644E57BA1E26F}` | UNCATALOGED_PREFAB | Rifle_AK105_b10m_b19_b33_b9m_rk3_pt1_tgpa, Handgun_APS |  |
| Sharpshooter | Пехотный снайпер | `Character_FIA_Sniper.et` | `{68EBDC844C8EAD84}` | UNCATALOGED_PREFAB | Rifle_SVD_1P21_TGPV, Handgun_APS |  |

## Ses_CDF — CDF — Chernarussian Defence Forces (Arma II Factions)

Sources: `Arma II Factions/Configs/EntityCatalog/Ses_CDF/Ses_CDF_Characters.conf`, `Arma II Factions/Configs/EntityCatalog/US/Characters_EntityCatalog_Ses_CDF.conf`; sweep of `reference/Arma II Factions` under `Prefabs/Characters/Factions/BLUFOR/CDF_Army/`. Paths below are relative to that prefix.

Catalog entries OUTSIDE the faction folder (ignored): 28 — e.g. `Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_Rifleman.et` (Characters_EntityCatalog_Ses_CDF.conf).

### (root) (79)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_CDF_AAT.et` | `{A0FFE636D44E5918}` | OK | Rifle_AK74_RHSmag |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_CDF_AAT_2.et` | `{45882F3323AA67ED}` | OK | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_CDF_AAT_3.et` | `{A01463CA2F4FF086}` | OK | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_CDF_AAT_4.et` | `{9D2046F25A2379B1}` | OK | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_AAT |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_CDF_AMG.et` | `{2A4051EDC38853A7}` | OK | Rifle_AK74N_RHSMag |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_CDF_AMG_2.et` | `{6D35B635714BCE6A}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_CDF_AMG_3.et` | `{B59DDFF408C2D036}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_CDF_AMG_4.et` | `{B59DDFF408C2D037}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_CDF_AR.et` | `{7B9EAE5EB616387A}` | OK | MG_RPK74N |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_CDF_AR_2.et` | `{966733875CC796B4}` | UNCATALOGED_PREFAB | MG_RPK74N_1P29 | cosmetic variant of Character_CDF_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_CDF_AR_3.et` | `{4ECF5A46254E88E8}` | UNCATALOGED_PREFAB | MG_RPK74N_ses_P | cosmetic variant of Character_CDF_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_CDF_AR_4.et` | `{4ECF5A46254E88E9}` | UNCATALOGED_PREFAB | MG_RPK74N | cosmetic variant of Character_CDF_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_CDF_AT.et` | `{A336C79FCF9F2626}` | OK | Rifle_AK74_RHSmag, Launcher_RPG7_pgo7 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_CDF_AT_2.et` | `{2BB7610023DC8AAA}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag, Launcher_RPG7_pgo7 | cosmetic variant of Character_CDF_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_CDF_AT_3.et` | `{CE2B2DF92F391DC1}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag, Launcher_RPG7_pgo7 | cosmetic variant of Character_CDF_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_CDF_AT_4.et` | `{F31F08C15A5594F6}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag, Launcher_RPG7_pgo7 | cosmetic variant of Character_CDF_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_CDF_Ammo.et` | `{E986E5189BCA4883}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_CDF_Ammo_2.et` | `{7A6CAF043AD1AC50}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_CDF_Ammo_3.et` | `{9FF0E3FD36343B3B}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_CDF_Ammo_4.et` | `{A2C4C6C54358B20C}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_Ammo; carries VariantData |
| Crew Commander | Командир экипажа | `Character_CDF_CC.et` | `{7766953EDCFC5F06}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Crew Commander | Командир экипажа | `Character_CDF_CC_2.et` | `{F3C645BC2773A7DF}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_CDF_CC |
| Crewman | Член экипажа | `Character_CDF_Crew.et` | `{930302D9F14EEFC0}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Crewman | Член экипажа | `Character_CDF_Crew_2.et` | `{25FB4AACCD9E245C}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_CDF_Crew |
| Grenadier | Гренадер | `Character_CDF_GL.et` | `{764BD07F41A15150}` | OK | Rifle_AK74_GP25_RHSmag |  |
| Grenadier | Гренадер | `Character_CDF_GL_2.et` | `{4C5D4851E04570FA}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag_Rail_Aimpoint | cosmetic variant of Character_CDF_GL |
| Grenadier | Гренадер | `Character_CDF_GL_3.et` | `{A9C104A8ECA0E791}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_CDF_GL |
| Grenadier | Гренадер | `Character_CDF_GL_4.et` | `{94F5219099CC6EA6}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_CDF_GL |
| Helicopter Crew | Экипаж вертолета | `Character_CDF_HeliCrew.et` | `{6CB62AE5BE36AA18}` | UNCATALOGED_LAYER | Handgun_PM |  |
| Helicopter Pilot | Пилот вертолета | `Character_CDF_HeliPilot.et` | `{990951B11778B1D8}` | UNCATALOGED_PREFAB | Handgun_PM |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_CDF_LAT.et` | `{6DA7E54B8E4F3FC3}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag, Launcher_RPG75 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_CDF_LAT_2.et` | `{6579D9103B972A23}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag, Launcher_RPG75 | cosmetic variant of Character_CDF_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_CDF_LAT_3.et` | `{80E595E93772BD48}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_Aimpoint, Launcher_RPG75 | cosmetic variant of Character_CDF_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_CDF_LAT_4.et` | `{BDD1B0D1421E347F}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_Aimpoint, Launcher_RPG75 | cosmetic variant of Character_CDF_LAT |
| Machine-Gunner | Пулеметчик | `Character_CDF_MG.et` | `{29897044D8592C9A}` | CONFLICT | MG_PKMN_1P29, Handgun_PM | catalog {29897044D8592C99} vs prefab-side {29897044D8592C9A} — prefab-side preferred |
| Machine-Gunner | Пулеметчик | `Character_CDF_MG_2.et` | `{030AF806713D232D}` | UNCATALOGED_PREFAB | MG_PKMN, Handgun_PM | cosmetic variant of Character_CDF_MG |
| Machine-Gunner | Пулеметчик | `Character_CDF_MG_3.et` | `{E696B4FF7DD8B446}` | UNCATALOGED_PREFAB | MG_PKM, Handgun_PM | cosmetic variant of Character_CDF_MG |
| Machine-Gunner | Пулеметчик | `Character_CDF_MG_4.et` | `{DBA291C708B43D71}` | UNCATALOGED_PREFAB | MG_PKMN_1P29, Handgun_PM | cosmetic variant of Character_CDF_MG |
| Medic | Врач | `Character_CDF_Medic.et` | `{16165F4184929A69}` | CONFLICT | Rifle_AKS74U_RHSMag | catalog {F051151C98DB30CD} vs prefab-side {16165F4184929A69} — prefab-side preferred |
| Medic | Врач | `Character_CDF_Medic_2.et` | `{6D0432F404EE4F24}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_CDF_Medic |
| Medic | Врач | `Character_CDF_Medic_3.et` | `{88987E0D080BD84F}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_CDF_Medic |
| Officer | Офицер | `Character_CDF_Officer.et` | `{3FC8B61EE94F6139}` | UNCATALOGED_LAYER | Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_CDF_PL.et` | `{756D4054410A1927}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag, Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_CDF_PL_2.et` | `{3947DB473E91D159}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag, Handgun_PM | cosmetic variant of Character_CDF_PL |
| Combat Signaler | Связист | `Character_CDF_RTO.et` | `{7C646869CFA3B721}` | OK | Rifle_AK74_RHSmag |  |
| Combat Signaler | Связист | `Character_CDF_RTO_2.et` | `{4B65DE96FA27BF75}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_RTO |
| Combat Signaler | Связист | `Character_CDF_RTO_3.et` | `{93CDB75783AEA129}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_RTO |
| Rifleman | Стрелок | `Character_CDF_Rifleman.et` | `{9DE22FB5586591CC}` | OK | Rifle_AK74_RHSmag |  |
| Rifleman | Стрелок | `Character_CDF_Rifleman2.et` | `{5C3875FDB56CB949}` | UNCATALOGED_LAYER | Rifle_AK74N_Rail_Aimpoint | cosmetic variant of Character_CDF_Rifleman |
| Rifleman | Стрелок | `Character_CDF_Rifleman_2.et` | `{FC071FF58423F774}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_Rifleman |
| Rifleman | Стрелок | `Character_CDF_Rifleman_3.et` | `{199B530C88C6601F}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_Aimpoint | cosmetic variant of Character_CDF_Rifleman |
| Rifleman | Стрелок | `Character_CDF_Rifleman_4.et` | `{24AF7634FDAAE928}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_Aimpoint | cosmetic variant of Character_CDF_Rifleman |
| Squad Leader | Командир отделения | `Character_CDF_SL.et` | `{16165F4184929A6A}` | CONFLICT | Rifle_AK74N_Rail_SU230_Ses_CDF | catalog {16165F4184929A69} vs prefab-side {16165F4184929A6A} — prefab-side preferred |
| Squad Leader | Командир отделения | `Character_CDF_SL_2.et` | `{33E28B0A888122DE}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_SU230_Ses_CDF | cosmetic variant of Character_CDF_SL |
| Squad Leader | Командир отделения | `Character_CDF_SL_3.et` | `{D67EC7F38464B5B5}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_SU230_Ses_CDF | cosmetic variant of Character_CDF_SL |
| Squad Leader | Командир отделения | `Character_CDF_SL_4.et` | `{EB4AE2CBF1083C82}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_SU230_Ses_CDF | cosmetic variant of Character_CDF_SL |
| Senior Rifleman | Старший стрелок | `Character_CDF_SR.et` | `{03A6062FDF62A7F8}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_ACOG, Handgun_PM |  |
| Senior Rifleman | Старший стрелок | `Character_CDF_SR_2.et` | `{FC9250475822239E}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_ACOG, Handgun_PM | cosmetic variant of Character_CDF_SR |
| Senior Rifleman | Старший стрелок | `Character_CDF_SR_3.et` | `{190E1CBE54C7B4F5}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_ACOG, Handgun_PM | cosmetic variant of Character_CDF_SR |
| Senior Rifleman | Старший стрелок | `Character_CDF_SR_4.et` | `{243A398621AB3DC2}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_ACOG, Handgun_PM | cosmetic variant of Character_CDF_SR |
| Sapper | Сапер | `Character_CDF_Sapper.et` | `{759D8C8B4213D504}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag |  |
| Sapper | Сапер | `Character_CDF_Sapper_2.et` | `{33D3F01D83B36B8F}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_Sapper |
| Sapper | Сапер | `Character_CDF_Sapper_3.et` | `{D64FBCE48F56FCE4}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_Aimpoint | cosmetic variant of Character_CDF_Sapper |
| Sapper | Сапер | `Character_CDF_Sapper_4.et` | `{EB7B99DCFA3A75D3}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_CDF_Sapper |
| Scout | Разведчик | `Character_CDF_Scout.et` | `{1C5D238E55ACDFDC}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_ACOG |  |
| Scout Radio Operator | Радист-разведчик | `Character_CDF_Scout_RTO.et` | `{BDFC54A749BAFE54}` | UNCATALOGED_PREFAB | Rifle_AK74N_Rail_ACOG |  |
| Scout Radio Operator | Радист-разведчик | `Character_CDF_Scout_RTO_S.et` | `{5ED3BC639B649643}` | UNCATALOGED_LAYER | Rifle_AK74N_Rail_S_Aimpoint |  |
| Scout | Разведчик | `Character_CDF_Scout_S.et` | `{1BB93D4B09CA1077}` | UNCATALOGED_LAYER | Rifle_AK74N_Rail_S_Aimpoint |  |
| Platoon Sergeant | Взводный сержант | `Character_CDF_Sergeant.et` | `{3082927028B38FD2}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag |  |
| Platoon Sergeant | Взводный сержант | `Character_CDF_Sergeant_2.et` | `{C8BD3DE118F7EEC6}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_CDF_Sergeant |
| — |  | `Character_CDF_Sharpshooter.et` | `{BCC61BCFB0FBC6BF}` | OK_CATALOG | — | CATALOGED BUT THE PREFAB DOES NOT SHIP — unusable (catalog GUID kept for the record) |
| Sharpshooter | Пехотный снайпер | `Character_CDF_Sniper.et` | `{03A6062FDF62A7F9}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO |  |
| Sharpshooter | Пехотный снайпер | `Character_CDF_Sniper_2.et` | `{471455C340DD5221}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_CDF_Sniper |
| Spotter | Корректировщик огня | `Character_CDF_Spotter.et` | `{0779E285709FDE15}` | OK | Rifle_AK74_GP25_RHSmag |  |
| Spotter | Корректировщик огня | `Character_CDF_Spotter_2.et` | `{CCCD879DCB99FDFA}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_CDF_Spotter |
| Spotter | Корректировщик огня | `Character_CDF_Spotter_3.et` | `{2951CB64C77C6A91}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_CDF_Spotter |
| Spotter | Корректировщик огня | `Character_CDF_Spotter_4.et` | `{1465EE5CB210E3A6}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_CDF_Spotter |
| Unarmed | Невооруженный | `Character_CDF_Unarmed.et` | `{344B1F57F7E86726}` | OK | — | UNARMED (no weapon in slots or inventory) |
| Unarmed | Невооруженный | `Character_CDF_Unarmed_2.et` | `{C7C8CEB8FC0BB3EE}` | UNCATALOGED_PREFAB | — | cosmetic variant of Character_CDF_Unarmed; UNARMED (no weapon in slots or inventory) |

Skipped random/randomized wrappers (21): Character_CDF_AAT_Random, Character_CDF_AMG_Random, Character_CDF_AR_Random, Character_CDF_AT_Random, Character_CDF_Ammo_Random, Character_CDF_CC_Random, Character_CDF_Crew_Random, Character_CDF_GL_Random, Character_CDF_LAT_Random, Character_CDF_MG_Random, Character_CDF_Medic_Random, Character_CDF_PL_Random, Character_CDF_RTO_Random, Character_CDF_Rifleman_Random, Character_CDF_SL_Random, Character_CDF_SR_Random, Character_CDF_Sapper_Random, Character_CDF_Sergeant_Random, Character_CDF_Sniper_Random, Character_CDF_Spotter_Random, Character_CDF_Unarmed_Random

Skipped abstract parents (2): Character_CDF_Base, Character_CDF_BaseLoadout

## Ses_ChDKZ — ChDKZ — Chedaki Insurgents (Arma II Factions)

Sources: `Arma II Factions/Configs/EntityCatalog/ChDKZ/ChDKZ_Characters.conf`; sweep of `reference/Arma II Factions` under `Prefabs/Characters/Factions/OPFOR/ChDKZ/`. Paths below are relative to that prefix.

### (root) (102)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_ChDKZ_AAT.et` | `{80CA7DA95DF47432}` | OK | Rifle_AKM_SteelMag |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_ChDKZ_AAT_2.et` | `{F2C81A1C5E988D13}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_ChDKZ_AAT_3.et` | `{175456E5527D1A78}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag | cosmetic variant of Character_ChDKZ_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_ChDKZ_AAT_4.et` | `{2A6073DD2711934F}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_ChDKZ_AAT_5.et` | `{CFFC3F242BF40424}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag | cosmetic variant of Character_ChDKZ_AAT |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_ChDKZ_AMG.et` | `{0A75CA724A327E8D}` | OK | Rifle_AKM_SteelMag |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_ChDKZ_AMG_2.et` | `{DA75831A0C792494}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag | cosmetic variant of Character_ChDKZ_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_ChDKZ_AMG_3.et` | `{3FE9CFE3009CB3FF}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_ChDKZ_AMG_4.et` | `{02DDEADB75F03AC8}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_ChDKZ_AMG_5.et` | `{E741A6227915ADA3}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag | cosmetic variant of Character_ChDKZ_AMG |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_ChDKZ_AR.et` | `{8DF4F10E6EE4680D}` | OK | MG_RPK74N_ses |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_ChDKZ_AR_2.et` | `{6F865DF1C729B76A}` | UNCATALOGED_PREFAB | MG_RPK74 | cosmetic variant of Character_ChDKZ_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_ChDKZ_AR_3.et` | `{8A1A1108CBCC2001}` | UNCATALOGED_PREFAB | MG_RPK74N_ses | cosmetic variant of Character_ChDKZ_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_ChDKZ_AR_4.et` | `{B72E3430BEA0A936}` | UNCATALOGED_PREFAB | MG_RPK74N | cosmetic variant of Character_ChDKZ_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_ChDKZ_AR_5.et` | `{52B278C9B2453E5D}` | UNCATALOGED_PREFAB | MG_RPK74N_ses | cosmetic variant of Character_ChDKZ_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_ChDKZ_AT.et` | `{555C98CF176D7651}` | OK | Rifle_AKM_SteelMag, Launcher_RPG7 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_ChDKZ_AT_2.et` | `{D2560F76B832AB74}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag, Launcher_RPG7 | cosmetic variant of Character_ChDKZ_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_ChDKZ_AT_3.et` | `{37CA438FB4D73C1F}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag, Launcher_RPG7 | cosmetic variant of Character_ChDKZ_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_ChDKZ_AT_4.et` | `{0AFE66B7C1BBB528}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag, Launcher_RPG7 | cosmetic variant of Character_ChDKZ_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_ChDKZ_AT_5.et` | `{EF622A4ECD5E2243}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag, Launcher_RPG7 | cosmetic variant of Character_ChDKZ_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_ChDKZ_Ammo.et` | `{82F7026A2508DDB5}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_ChDKZ_Ammo_2.et` | `{E8C6A8C030571FC6}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_ChDKZ_Ammo_3.et` | `{0D5AE4393CB288AD}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag | cosmetic variant of Character_ChDKZ_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_ChDKZ_Ammo_4.et` | `{306EC10149DE019A}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSMag | cosmetic variant of Character_ChDKZ_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_ChDKZ_Ammo_5.et` | `{D5F28DF8453B96F1}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Ammo |
| Crew Commander | Командир экипажа | `Character_ChDKZ_CC.et` | `{810CCA6E040E0F71}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Crew Commander | Командир экипажа | `Character_ChDKZ_CC_2.et` | `{0A272BCABC9D8601}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_CC |
| Crew Commander | Командир экипажа | `Character_ChDKZ_CC_3.et` | `{EFBB6733B078116A}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_CC |
| Crewman | Член экипажа | `Character_ChDKZ_Crew.et` | `{6AE26CAF6AA0CE1E}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Crewman | Член экипажа | `Character_ChDKZ_Crew_2.et` | `{B7514D68C71897CA}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_Crew |
| Crewman | Член экипажа | `Character_ChDKZ_Crew_3.et` | `{52CD0191CBFD00A1}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_Crew |
| Grenadier | Гренадер | `Character_ChDKZ_GL.et` | `{80218F2F99530127}` | OK | Rifle_AKM_GP25_SteelMag |  |
| Grenadier | Гренадер | `Character_ChDKZ_GL_2.et` | `{B5BC26277BAB5124}` | UNCATALOGED_PREFAB | Rifle_AKM_GP25_SteelMag | cosmetic variant of Character_ChDKZ_GL |
| Grenadier | Гренадер | `Character_ChDKZ_GL_3.et` | `{50206ADE774EC64F}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_ChDKZ_GL |
| Grenadier | Гренадер | `Character_ChDKZ_GL_4.et` | `{6D144FE602224F78}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_ChDKZ_GL |
| Grenadier | Гренадер | `Character_ChDKZ_GL_5.et` | `{8888031F0EC7D813}` | UNCATALOGED_PREFAB | Rifle_AKM_GP25_SteelMag | cosmetic variant of Character_ChDKZ_GL |
| Guerrilla | Партизан | `Character_ChDKZ_Insurgent.et` | `{B6F179A1885898AC}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Guerrilla | Партизан | `Character_ChDKZ_Insurgent_2.et` | `{C2095ABF49CEF8D0}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Insurgent |
| Guerrilla | Партизан | `Character_ChDKZ_Insurgent_3.et` | `{27951646452B6FBB}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag | cosmetic variant of Character_ChDKZ_Insurgent |
| Guerrilla | Партизан | `Character_ChDKZ_Insurgent_4.et` | `{1AA1337E3047E68C}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_Insurgent |
| Guerrilla | Партизан | `Character_ChDKZ_Insurgent_PM.et` | `{A2BEE5B8F7017E0D}` | UNCATALOGED_LAYER | Handgun_PM |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_ChDKZ_LAT.et` | `{4D927ED407F512E9}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag, Launcher_RPG22 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_ChDKZ_LAT_2.et` | `{D239EC3F46A5C0DD}` | UNCATALOGED_PREFAB | Rifle_AK74N_RHSMag, Launcher_RPG22 | cosmetic variant of Character_ChDKZ_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_ChDKZ_LAT_3.et` | `{37A5A0C64A4057B6}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag, Launcher_RPG22 | cosmetic variant of Character_ChDKZ_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_ChDKZ_LAT_4.et` | `{0A9185FE3F2CDE81}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag, Launcher_RPG22 | cosmetic variant of Character_ChDKZ_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_ChDKZ_LAT_5.et` | `{EF0DC90733C949EA}` | UNCATALOGED_PREFAB | Rifle_AKMN_SteelMag, Launcher_RPG22 | cosmetic variant of Character_ChDKZ_LAT |
| Machine-Gunner | Пулеметчик | `Character_ChDKZ_MG.et` | `{DFE32F1400AB7CEE}` | OK | MG_PKM |  |
| Machine-Gunner | Пулеметчик | `Character_ChDKZ_MG_2.et` | `{FAEB9670EAD302F3}` | UNCATALOGED_PREFAB | MG_PKMN | cosmetic variant of Character_ChDKZ_MG |
| Machine-Gunner | Пулеметчик | `Character_ChDKZ_MG_3.et` | `{1F77DA89E6369598}` | UNCATALOGED_PREFAB | MG_PKM | cosmetic variant of Character_ChDKZ_MG |
| Machine-Gunner | Пулеметчик | `Character_ChDKZ_MG_4.et` | `{2243FFB1935A1CAF}` | UNCATALOGED_PREFAB | MG_PKM | cosmetic variant of Character_ChDKZ_MG |
| Machine-Gunner | Пулеметчик | `Character_ChDKZ_MG_5.et` | `{C7DFB3489FBF8BC4}` | UNCATALOGED_PREFAB | MG_PKMN | cosmetic variant of Character_ChDKZ_MG |
| Medic | Врач | `Character_ChDKZ_Medic.et` | `{47112033E5E9DA33}` | OK | Rifle_AKS74U_RHSMag |  |
| Medic | Врач | `Character_ChDKZ_Medic_2.et` | `{D225A8163C5A4520}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_Medic |
| Medic | Врач | `Character_ChDKZ_Medic_3.et` | `{FB42FC95E5C004D2}` | UNCATALOGED_PREFAB | Rifle_AKMN_SteelMag | cosmetic variant of Character_ChDKZ_Medic |
| Medic | Врач | `Character_ChDKZ_Medic_4.et` | `{0A8DC1D745D35B7C}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_Medic |
| Medic | Врач | `Character_ChDKZ_Medic_5.et` | `{EF118D2E4936CC17}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Medic |
| Officer | Офицер | `Character_ChDKZ_Officer.et` | `{DA9F69A8160823DB}` | UNCATALOGED_LAYER | Handgun_PM |  |
| Platoon Leader | Командир взвода | `Character_ChDKZ_PL.et` | `{7962B9884187FB8E}` | UNCATALOGED_PREFAB | Rifle_AK74M |  |
| Platoon Leader | Командир взвода | `Character_ChDKZ_PL_2.et` | `{C0A6B531A57FF087}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63 | cosmetic variant of Character_ChDKZ_PL |
| Platoon Leader | Командир взвода | `Character_ChDKZ_PL_3.et` | `{253AF9C8A99A67EC}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P63 | cosmetic variant of Character_ChDKZ_PL |
| Platoon Leader | Командир взвода | `Character_ChDKZ_PL_4.et` | `{180EDCF0DCF6EEDB}` | UNCATALOGED_PREFAB | Rifle_AK74M | cosmetic variant of Character_ChDKZ_PL |
| Platoon Leader | Командир взвода | `Character_ChDKZ_PL_5.et` | `{FD929009D01379B0}` | UNCATALOGED_PREFAB | Rifle_AK74M | cosmetic variant of Character_ChDKZ_PL |
| Combat Signaler | Связист | `Character_ChDKZ_RTO.et` | `{5C51F3F646199A0B}` | OK | Rifle_AKM_SteelMag |  |
| Combat Signaler | Связист | `Character_ChDKZ_RTO_2.et` | `{FC25EBB98715558B}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_RTO |
| Combat Signaler | Связист | `Character_ChDKZ_RTO_3.et` | `{19B9A7408BF0C2E0}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_RTO |
| Combat Signaler | Связист | `Character_ChDKZ_RTO_4.et` | `{248D8278FE9C4BD7}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_RTO |
| Combat Signaler | Связист | `Character_ChDKZ_RTO_5.et` | `{C111CE81F279DCBC}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_RTO |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman.et` | `{FC8129BEC88601E4}` | OK | Rifle_AKM_SteelMag |  |
| — |  | `Character_ChDKZ_Rifleman2.et` | `{6BB16C6C34B98D2B}` | OK_CATALOG | — | cosmetic variant of Character_ChDKZ_Rifleman; CATALOGED BUT THE PREFAB DOES NOT SHIP — unusable (catalog GUID kept for the record) |
| — |  | `Character_ChDKZ_Rifleman3.et` | `{8E2D2095385C1A40}` | OK_CATALOG | — | cosmetic variant of Character_ChDKZ_Rifleman; CATALOGED BUT THE PREFAB DOES NOT SHIP — unusable (catalog GUID kept for the record) |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_2.et` | `{517B430D1449AC2F}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_Rifleman |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_3.et` | `{B4E70FF418AC3B44}` | UNCATALOGED_PREFAB | Rifle_AKMN_SteelMag | cosmetic variant of Character_ChDKZ_Rifleman |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_4.et` | `{89D32ACC6DC0B273}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Rifleman |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_5.et` | `{6C4F663561252518}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_Rifleman |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_Armor.et` | `{B31905AD4D309377}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag |  |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_Armor_2.et` | `{DD2ABAF69C44EB5C}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_Rifleman_Armor |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_Armor_3.et` | `{38B6F60F90A17C37}` | UNCATALOGED_PREFAB | Rifle_AKMN_SteelMag | cosmetic variant of Character_ChDKZ_Rifleman_Armor |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_Armor_4.et` | `{0582D337E5CDF500}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_Rifleman_Armor |
| Rifleman | Стрелок | `Character_ChDKZ_Rifleman_Armor_5.et` | `{E01E9FCEE928626B}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Rifleman_Armor |
| Squad Leader | Командир отделения | `Character_ChDKZ_SL.et` | `{E07C00115C60CA1E}` | OK | Rifle_AK74M_GP25 |  |
| Squad Leader | Командир отделения | `Character_ChDKZ_SL_2.et` | `{CA03E57C136F0300}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25 | cosmetic variant of Character_ChDKZ_SL |
| Squad Leader | Командир отделения | `Character_ChDKZ_SL_3.et` | `{2F9FA9851F8A946B}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25 | cosmetic variant of Character_ChDKZ_SL |
| Squad Leader | Командир отделения | `Character_ChDKZ_SL_4.et` | `{12AB8CBD6AE61D5C}` | UNCATALOGED_PREFAB | Rifle_AKMN_GP25_SteelMag | cosmetic variant of Character_ChDKZ_SL |
| Squad Leader | Командир отделения | `Character_ChDKZ_SL_5.et` | `{F737C04466038A37}` | UNCATALOGED_PREFAB | Rifle_AK74M_GP25 | cosmetic variant of Character_ChDKZ_SL |
| Senior Rifleman | Старший стрелок | `Character_ChDKZ_SR.et` | `{9D64ECE939F3F687}` | UNCATALOGED_PREFAB | Rifle_AK74N_1P29_RHSMag |  |
| Senior Rifleman | Старший стрелок | `Character_ChDKZ_SR_2.et` | `{05733E31C3CC0240}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P29_RHSMag | cosmetic variant of Character_ChDKZ_SR |
| Senior Rifleman | Старший стрелок | `Character_ChDKZ_SR_3.et` | `{E0EF72C8CF29952B}` | UNCATALOGED_PREFAB | Rifle_AK74N_1P78_RHSMag | cosmetic variant of Character_ChDKZ_SR |
| Senior Rifleman | Старший стрелок | `Character_ChDKZ_SR_4.et` | `{DDDB57F0BA451C1C}` | UNCATALOGED_PREFAB | Rifle_AK74M_1P78_PlumMag | cosmetic variant of Character_ChDKZ_SR |
| Senior Rifleman | Старший стрелок | `Character_ChDKZ_SR_5.et` | `{38471B09B6A08B77}` | UNCATALOGED_PREFAB | Rifle_AKMN_1P29_SteelMag | cosmetic variant of Character_ChDKZ_SR |
| Sapper | Сапер | `Character_ChDKZ_Sapper.et` | `{B55424B3217BCC13}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag |  |
| Sapper | Сапер | `Character_ChDKZ_Sapper_2.et` | `{52B0F6161350FBA7}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_ChDKZ_Sapper |
| Sapper | Сапер | `Character_ChDKZ_Sapper_3.et` | `{B72CBAEF1FB56CCC}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_ChDKZ_Sapper |
| Sapper | Сапер | `Character_ChDKZ_Sapper_4.et` | `{8A189FD76AD9E5FB}` | UNCATALOGED_PREFAB | Rifle_AKMN_SteelMag | cosmetic variant of Character_ChDKZ_Sapper |
| Sapper | Сапер | `Character_ChDKZ_Sapper_5.et` | `{6F84D32E663C7290}` | UNCATALOGED_PREFAB | Rifle_AKM_SteelMag | cosmetic variant of Character_ChDKZ_Sapper |
| Sharpshooter | Пехотный снайпер | `Character_ChDKZ_Sharpshooter.et` | `{910C01EBD5E4146E}` | OK | Rifle_SVD_PSO |  |
| Sharpshooter | Пехотный снайпер | `Character_ChDKZ_Sharpshooter_2.et` | `{090F131703E796BF}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_ChDKZ_Sharpshooter |
| Sharpshooter | Пехотный снайпер | `Character_ChDKZ_Sharpshooter_3.et` | `{EC935FEE0F0201D4}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_ChDKZ_Sharpshooter |
| Unarmed | Невооруженный | `Character_ChDKZ_Unarmed.et` | `{8B6A85B5CF5C6D22}` | OK | — | UNARMED (no weapon in slots or inventory) |
| Unarmed | Невооруженный | `Character_ChDKZ_Unarmed_2.et` | `{F041D7297DDE878C}` | UNCATALOGED_PREFAB | — | cosmetic variant of Character_ChDKZ_Unarmed; UNARMED (no weapon in slots or inventory) |
| Unarmed | Невооруженный | `Character_ChDKZ_Unarmed_3.et` | `{15DD9BD0713B10E7}` | UNCATALOGED_PREFAB | — | cosmetic variant of Character_ChDKZ_Unarmed; UNARMED (no weapon in slots or inventory) |
| Unarmed | Невооруженный | `Character_ChDKZ_Unarmed_4.et` | `{28E9BEE8045799D0}` | UNCATALOGED_PREFAB | — | cosmetic variant of Character_ChDKZ_Unarmed; UNARMED (no weapon in slots or inventory) |
| Unarmed | Невооруженный | `Character_ChDKZ_Unarmed_5.et` | `{CD75F21108B20EBB}` | UNCATALOGED_PREFAB | — | cosmetic variant of Character_ChDKZ_Unarmed; UNARMED (no weapon in slots or inventory) |

Skipped random/randomized wrappers (21): Character_ChDKZ_AAT_Random, Character_ChDKZ_AMG_Random, Character_ChDKZ_AR_Random, Character_ChDKZ_AT_Random, Character_ChDKZ_Ammo_Random, Character_ChDKZ_CC_Random, Character_ChDKZ_Crew_Random, Character_ChDKZ_GL_Random, Character_ChDKZ_Insurgent_Random, Character_ChDKZ_LAT_Random, Character_ChDKZ_MG_Random, Character_ChDKZ_Medic_Random, Character_ChDKZ_PL_Random, Character_ChDKZ_RTO_Random, Character_ChDKZ_Rifleman_Armor_Random, Character_ChDKZ_Rifleman_Random, Character_ChDKZ_SL_Random, Character_ChDKZ_SR_Random, Character_ChDKZ_Sapper_Random, Character_ChDKZ_Sharpshooter_Random, Character_ChDKZ_Unarmed_Random

Skipped abstract parents (2): Character_ChDKZ_Base, Character_ChDKZ_BaseLoadout

## Ses_NAPA — NAPA — Chernarussian Guerrillas (Arma II Factions; its catalog lists vanilla USSR by mistake)

Sources: `Arma II Factions/Configs/EntityCatalog/NAPA/NAPA_Characters.conf`; sweep of `reference/Arma II Factions` under `Prefabs/Characters/Factions/INDFOR/NAPA/`. Paths below are relative to that prefix.

Catalog entries OUTSIDE the faction folder (ignored): 14 — e.g. `Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_USSR_AAT.et` (NAPA_Characters.conf).

### (root) (83)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_NAPA_AAT.et` | `{89A8633875C983BA}` | UNCATALOGED_PREFAB | Rifle_VZ58P |  |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_NAPA_AAT_2.et` | `{537A15C51C476EF4}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_NAPA_AAT_3.et` | `{B6E6593C10A2F99F}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AAT |
| Anti-Tank Specialist Assistant | Помощник бронебойщика | `Character_NAPA_AAT_4.et` | `{8BD27C0465CE70A8}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AAT |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG.et` | `{0317D4E3620F8905}` | UNCATALOGED_PREFAB | Rifle_VZ58P |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_2.et` | `{7BC78CC34EA6C773}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_3.et` | `{9E5BC03A42435018}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_4.et` | `{A36FE502372FD92F}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AMG |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_PKM.et` | `{113CCCAA468FFE30}` | UNCATALOGED_PREFAB | Rifle_VZ58P |  |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_PKM_2.et` | `{D8BE7774193D2A86}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AMG_PKM |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_PKM_3.et` | `{14620E60CE394C79}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AMG_PKM |
| Machine-Gunner Assistant | Помощник пулеметчика | `Character_NAPA_AMG_PKM_4.et` | `{29562B58BB55C54E}` | UNCATALOGED_PREFAB | Rifle_VZ58P | cosmetic variant of Character_NAPA_AMG_PKM |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_NAPA_AR.et` | `{0510EDC0E364FCD6}` | UNCATALOGED_PREFAB | MG_RPK74N_ses |  |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_NAPA_AR_2.et` | `{199B7FD0996DB0A7}` | UNCATALOGED_LAYER | MG_RPK74 | cosmetic variant of Character_NAPA_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_NAPA_AR_3.et` | `{FC073329958827CC}` | UNCATALOGED_LAYER | MG_RPK74 | cosmetic variant of Character_NAPA_AR |
| Automatic Rifleman | Стрелок-пулеметчик | `Character_NAPA_AR_4.et` | `{C1331611E0E4AEFB}` | UNCATALOGED_LAYER | MG_RPK74N_ses | cosmetic variant of Character_NAPA_AR |
| Anti-Tank Specialist | Бронебойщик | `Character_NAPA_AT.et` | `{DDB884019AEDE28A}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG7 |  |
| Anti-Tank Specialist | Бронебойщик | `Character_NAPA_AT_2.et` | `{A44B2D57E676ACB9}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG7 | cosmetic variant of Character_NAPA_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_NAPA_AT_3.et` | `{41D761AEEA933BD2}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG7 | cosmetic variant of Character_NAPA_AT |
| Anti-Tank Specialist | Бронебойщик | `Character_NAPA_AT_4.et` | `{7CE344969FFFB2E5}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG7 | cosmetic variant of Character_NAPA_AT |
| Ammunition Bearer | Подносчик боеприпасов | `Character_NAPA_Ammo.et` | `{08AB1E11A971C5F2}` | UNCATALOGED_PREFAB | Rifle_VZ58P |  |
| Ammunition Bearer | Подносчик боеприпасов | `Character_NAPA_Ammo_2.et` | `{22B984561AAFB146}` | UNCATALOGED_LAYER | Rifle_VZ58P | cosmetic variant of Character_NAPA_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_NAPA_Ammo_3.et` | `{C725C8AF164A262D}` | UNCATALOGED_LAYER | Rifle_VZ58P | cosmetic variant of Character_NAPA_Ammo |
| Ammunition Bearer | Подносчик боеприпасов | `Character_NAPA_Ammo_4.et` | `{FA11ED976326AF1A}` | UNCATALOGED_LAYER | Rifle_VZ58P | cosmetic variant of Character_NAPA_Ammo |
| Crew Commander | Командир экипажа | `Character_NAPA_CC.et` | `{09E8D6A0898E9BAA}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Crew Commander | Командир экипажа | `Character_NAPA_CC_2.et` | `{7C3A09EBE2D981CC}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_CC |
| Crewman | Член экипажа | `Character_NAPA_Crew.et` | `{1CFF4E8E34E4C9D3}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Crewman | Член экипажа | `Character_NAPA_Crew_2.et` | `{7D2E61FEEDE0394A}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_Crew |
| Grenadier | Гренадер | `Character_NAPA_GL.et` | `{08C593E114D395FC}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag |  |
| Grenadier | Гренадер | `Character_NAPA_GL_2.et` | `{C3A1040625EF56E9}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_NAPA_GL |
| Grenadier | Гренадер | `Character_NAPA_GL_3.et` | `{263D48FF290AC182}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_NAPA_GL |
| Grenadier | Гренадер | `Character_NAPA_GL_4.et` | `{1B096DC75C6648B5}` | UNCATALOGED_PREFAB | Rifle_AK74_GP25_RHSmag | cosmetic variant of Character_NAPA_GL |
| Light AT Rifleman | Легкий бронебойщик | `Character_NAPA_LAT.et` | `{CD129913E6D6649A}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG75 |  |
| Light AT Rifleman | Легкий бронебойщик | `Character_NAPA_LAT_2.et` | `{738BE3E6047A233A}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG22 | cosmetic variant of Character_NAPA_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_NAPA_LAT_3.et` | `{9617AF1F089FB451}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG22 | cosmetic variant of Character_NAPA_LAT |
| Light AT Rifleman | Легкий бронебойщик | `Character_NAPA_LAT_4.et` | `{AB238A277DF33D66}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball, Launcher_RPG75 | cosmetic variant of Character_NAPA_LAT |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG.et` | `{570733DA8D2BE835}` | UNCATALOGED_PREFAB | MG_PKM |  |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_2.et` | `{8CF6B451B497053E}` | UNCATALOGED_LAYER | MG_PKM | cosmetic variant of Character_NAPA_MG |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_3.et` | `{696AF8A8B8729255}` | UNCATALOGED_LAYER | MG_PKM | cosmetic variant of Character_NAPA_MG |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_4.et` | `{545EDD90CD1E1B62}` | UNCATALOGED_LAYER | MG_PKM | cosmetic variant of Character_NAPA_MG |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_UK.et` | `{825CF2A0231AA133}` | UNCATALOGED_PREFAB | MG_UK59 |  |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_UK_2.et` | `{115D19BBCA329B55}` | UNCATALOGED_PREFAB | MG_UK59 | cosmetic variant of Character_NAPA_MG_UK |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_UK_3.et` | `{F4C15542C6D70C3E}` | UNCATALOGED_PREFAB | MG_UK59 | cosmetic variant of Character_NAPA_MG_UK |
| Machine-Gunner | Пулеметчик | `Character_NAPA_MG_UK_4.et` | `{C9F5707AB3BB8509}` | UNCATALOGED_PREFAB | MG_UK59 | cosmetic variant of Character_NAPA_MG_UK |
| Medic | Врач | `Character_NAPA_Medic.et` | `{E6A32FEAA73639D4}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball |  |
| Medic | Врач | `Character_NAPA_Medic_2.et` | `{9671D6B41CFB245A}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball | cosmetic variant of Character_NAPA_Medic |
| Medic | Врач | `Character_NAPA_Medic_3.et` | `{73ED9A4D101EB331}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball | cosmetic variant of Character_NAPA_Medic |
| Medic | Врач | `Character_NAPA_Medic_4.et` | `{4ED9BF7565723A06}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball | cosmetic variant of Character_NAPA_Medic |
| Platoon Leader | Командир взвода | `Character_NAPA_PL.et` | `{F186A546CC076F55}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Platoon Leader | Командир взвода | `Character_NAPA_PL_2.et` | `{B6BB9710FB3BF74A}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_PL |
| Platoon Leader | Командир взвода | `Character_NAPA_PL_3.et` | `{5327DBE9F7DE6021}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_PL |
| Platoon Leader | Командир взвода | `Character_NAPA_PL_4.et` | `{6E13FED182B2E916}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_PL |
| Combat Signaler | Связист | `Character_NAPA_RTO.et` | `{DCD11431A73AEC78}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Combat Signaler | Связист | `Character_NAPA_RTO_2.et` | `{5D97E460C5CAB66C}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_RTO |
| Combat Signaler | Связист | `Character_NAPA_RTO_3.et` | `{B80BA899C92F2107}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_RTO |
| Combat Signaler | Связист | `Character_NAPA_RTO_4.et` | `{853F8DA1BC43A830}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_RTO |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AK74.et` | `{81AABF85182C9FA3}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag |  |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AK74_2.et` | `{28516DB3285DAF3D}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_NAPA_Rifleman_AK74 |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AK74_3.et` | `{CDCD214A24B83856}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_NAPA_Rifleman_AK74 |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AK74_4.et` | `{F0F9047251D4B161}` | UNCATALOGED_PREFAB | Rifle_AK74_RHSmag | cosmetic variant of Character_NAPA_Rifleman_AK74 |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AKSU.et` | `{6436F37C14C908C8}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AKSU_2.et` | `{9A5264FC76199554}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_Rifleman_AKSU |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AKSU_3.et` | `{7FCE28057AFC023F}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_Rifleman_AKSU |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_AKSU_4.et` | `{42FA0D3D0F908B08}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_Rifleman_AKSU |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_VZ.et` | `{3BC9EFCE8DC9B614}` | UNCATALOGED_PREFAB | Rifle_VZ58P_Ball |  |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_VZ_2.et` | `{635EF14DE03D6F6D}` | UNCATALOGED_PREFAB | Rifle_VZ58P_Ball | cosmetic variant of Character_NAPA_Rifleman_VZ |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_VZ_3.et` | `{86C2BDB4ECD8F806}` | UNCATALOGED_PREFAB | Rifle_VZ58P_Ball | cosmetic variant of Character_NAPA_Rifleman_VZ |
| Rifleman | Стрелок | `Character_NAPA_Rifleman_VZ_4.et` | `{BBF6988C99B47131}` | UNCATALOGED_PREFAB | Rifle_VZ58P_Ball | cosmetic variant of Character_NAPA_Rifleman_VZ |
| Squad Leader | Командир отделения | `Character_NAPA_SL.et` | `{68981CDFD1E05EC5}` | UNCATALOGED_PREFAB | Rifle_AKS74U_RHSMag |  |
| Squad Leader | Командир отделения | `Character_NAPA_SL_2.et` | `{BC1EC75D4D2B04CD}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_SL |
| Squad Leader | Командир отделения | `Character_NAPA_SL_3.et` | `{59828BA441CE93A6}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_SL |
| Squad Leader | Командир отделения | `Character_NAPA_SL_4.et` | `{64B6AE9C34A21A91}` | UNCATALOGED_LAYER | Rifle_AKS74U_RHSMag | cosmetic variant of Character_NAPA_SL |
| Sapper | Сапер | `Character_NAPA_Sapper.et` | `{E1AF9D8C921613D7}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball |  |
| Sapper | Сапер | `Character_NAPA_Sapper_2.et` | `{95F83066561F4C57}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball | cosmetic variant of Character_NAPA_Sapper |
| Sapper | Сапер | `Character_NAPA_Sapper_3.et` | `{70647C9F5AFADB3C}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball | cosmetic variant of Character_NAPA_Sapper |
| Sapper | Сапер | `Character_NAPA_Sapper_4.et` | `{4D5059A72F96520B}` | UNCATALOGED_PREFAB | Rifle_VZ58V_Ball | cosmetic variant of Character_NAPA_Sapper |
| Scout | Разведчик | `Character_NAPA_Scout.et` | `{EC4FA9F1875AA6C1}` | UNCATALOGED_PREFAB | Rifle_VZ58V |  |
| Scout | Разведчик | `Character_NAPA_Scout_2.et` | `{167342C13E860A50}` | UNCATALOGED_PREFAB | Rifle_VZ58V | cosmetic variant of Character_NAPA_Scout |
| Scout | Разведчик | `Character_NAPA_Scout_3.et` | `{F3EF0E3832639D3B}` | UNCATALOGED_PREFAB | Rifle_VZ58V | cosmetic variant of Character_NAPA_Scout |
| Scout | Разведчик | `Character_NAPA_Scout_4.et` | `{CEDB2B00470F140C}` | UNCATALOGED_PREFAB | Rifle_VZ58V | cosmetic variant of Character_NAPA_Scout |
| Sharpshooter | Пехотный снайпер | `Character_NAPA_Sharpshooter.et` | `{4402179619992EC2}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO |  |
| Sharpshooter | Пехотный снайпер | `Character_NAPA_Sharpshooter_2.et` | `{F75391F3FF0DCCF2}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_NAPA_Sharpshooter |
| Sharpshooter | Пехотный снайпер | `Character_NAPA_Sharpshooter_3.et` | `{12CFDD0AF3E85B99}` | UNCATALOGED_PREFAB | Rifle_SVD_PSO | cosmetic variant of Character_NAPA_Sharpshooter |

Skipped random/randomized wrappers (21): Character_NAPA_AAT_Random, Character_NAPA_AMG_PKM_Random, Character_NAPA_AMG_Random, Character_NAPA_AR_Random, Character_NAPA_AT_Random, Character_NAPA_Ammo_Random, Character_NAPA_CC_Random, Character_NAPA_GL_Random, Character_NAPA_LAT_Random, Character_NAPA_MG_Random, Character_NAPA_MG_UK_Random, Character_NAPA_Medic_Random, Character_NAPA_PL_Random, Character_NAPA_RTO_Random, Character_NAPA_Rifleman_AK74_Random, Character_NAPA_Rifleman_AKSU_Random, Character_NAPA_Rifleman_VZ_Random, Character_NAPA_SL_Random, Character_NAPA_Sapper_Random, Character_NAPA_Scout_Random, Character_NAPA_Sharpshooter_Random

Skipped abstract parents (2): Character_NAPA_BaseLoadout, Character_NAPA_base

## BWAR — Bundeswehr (Bundeswehr Mod)

Sources: `Bundeswehr Mod/Configs/EntityCatalog/BWAR/BWAR_Characters_EntityCatalog.conf`; sweep of `reference/Bundeswehr Mod` under `Prefabs/Characters/Factions/BLUFOR/Bundeswehr/`. Paths below are relative to that prefix.

### (root) (17)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant |  | `BWAR_Character_AMG.et` | `{55C787F9CF964831}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| AT Riflemen |  | `BWAR_Character_AT.et` | `{149BDF6162AB5470}` | OK | BWAR_Rifle_G36A3_ZO4x30, BWAR_Launcher_PzF3 | carries VariantData |
| Ammunition Bearer |  | `BWAR_Character_Ammo.et` | `{5430AA7481E96345}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Engineer |  | `BWAR_Character_Engineer.et` | `{8F41526498108AC4}` | OK | BWAR_Rifle_G36A3_ZO4x30 | carries VariantData |
| Grenadier |  | `BWAR_Character_Grenadier.et` | `{DA758A4FD5998CF3}` | OK | BWAR_Rifle_G36A3_AG40_ZO4x30 |  |
| Machine-Gunner |  | `BWAR_Character_MG.et` | `{D4A48867674F2C88}` | OK | BWAR_MG_MG5A2_ZO4x30i |  |
| Marksman |  | `BWAR_Character_Marksman.et` | `{30D1786FC6E2F847}` | OK | BWAR_DMR_G28_PMII |  |
| Medic |  | `BWAR_Character_Medic.et` | `{6B2DA1277F16C6B7}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Officer |  | `BWAR_Character_Officer.et` | `{F5E2E8A6DC6017B9}` | OK | — | UNARMED (no weapon in slots or inventory) |
| Platoon Leader |  | `BWAR_Character_PL.et` | `{38A5FE263441D9AF}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Combat Signaler |  | `BWAR_Character_RTO.et` | `{03E3BE7DC3BDACB7}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Rifleman |  | `BWAR_Character_Rifleman.et` | `{9A5161184FEEEDBF}` | OK | BWAR_Handgun_P8A1, BWAR_Rifle_G36A3_ZO4x30 |  |
| Squad Leader |  | `BWAR_Character_SL.et` | `{9AF20C687BF04BF5}` | OK | BWAR_Rifle_G36A3_AG40_ZO4x30 |  |
| Sapper |  | `BWAR_Character_Sapper.et` | `{9585DBF6F55C2FAF}` | OK | BWAR_Rifle_G36A3_ZO4x30 | carries VariantData |
| Scout |  | `BWAR_Character_Scout.et` | `{9193CE7A1A06009F}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Sergeant |  | `BWAR_Character_Sergeant.et` | `{F637ADD675BFB1BF}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Team Leader |  | `BWAR_Character_TL.et` | `{A67CBDEE4F2052FC}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |

### Tropen (17)

| Name | RU | Prefab | GUID | Status | Weapons | Notes |
|---|---|---|---|---|---|---|
| Machine-Gunner Assistant |  | `BWAR_Character_AMG_3FT.et` | `{620D6CF4D17E95C3}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| AT Riflemen |  | `BWAR_Character_AT_3FT.et` | `{8A0C25A7AD676BC6}` | OK | BWAR_Rifle_G36A3_ZO4x30, BWAR_Launcher_PzF3 | carries VariantData |
| Ammunition Bearer |  | `BWAR_Character_Ammo_3FT.et` | `{F59D4DEBBB719C0E}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Engineer |  | `BWAR_Character_Engineer_3FT.et` | `{23581816093823A2}` | OK | BWAR_Rifle_G36A3_ZO4x30 | carries VariantData |
| Grenadier |  | `BWAR_Character_Grenadier_3FT.et` | `{80766458E84F87D3}` | OK | BWAR_Rifle_G36A3_AG40_ZO4x30 |  |
| Machine-Gunner |  | `BWAR_Character_MG_3FT.et` | `{28A3366D0E910E4F}` | OK | BWAR_MG_MG5A2_ZO4x30i |  |
| Marksman |  | `BWAR_Character_Marksman_3FT.et` | `{4967711ACA970B61}` | OK | BWAR_DMR_G28_PMII |  |
| Medic |  | `BWAR_Character_Medic_3FT.et` | `{BB74B7B3D08ED5DA}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Officer |  | `BWAR_Character_Officer_3FT.et` | `{625F272A77B8E841}` | OK_CATALOG | — | UNARMED (no weapon in slots or inventory) |
| Platoon Leader |  | `BWAR_Character_PL_3FT.et` | `{4DDC4AEAA9A37C9C}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Combat Signaler |  | `BWAR_Character_RTO_3FT.et` | `{1EC2F00E8F661603}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Rifleman |  | `BWAR_Character_Rifleman_3FT.et` | `{2B099D45A90FAF36}` | OK | BWAR_Handgun_P8A1, BWAR_Rifle_G36A3_ZO4x30 |  |
| Squad Leader |  | `BWAR_Character_SL_3FT.et` | `{43C20EA294547346}` | OK | BWAR_Rifle_G36A3_AG40_ZO4x30 |  |
| Sapper |  | `BWAR_Character_Sapper_3FT.et` | `{366D894E0998250E}` | OK | BWAR_Rifle_G36A3_ZO4x30 | carries VariantData |
| Scout |  | `BWAR_Character_Scout_3FT.et` | `{1A6F5D23E4CE2FD6}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Sergeant |  | `BWAR_Character_Sergeant_3FT.et` | `{115C13A51F3D0ADB}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |
| Team Leader |  | `BWAR_Character_TL_3FT.et` | `{5A0B45F504E89644}` | OK | BWAR_Rifle_G36A3_ZO4x30 |  |

Skipped random/randomized wrappers (2): BWAR_Character_Randomized, BWAR_Character_Randomized_3FT

Skipped abstract parents (4): BWAR_Character_Base, BWAR_Character_BaseLoadout, BWAR_Character_BaseLoadout_3FT, BWAR_Character_Base_3FT
