# Slot presets: role → loadout per playable faction (user-reviewed 2026-10-26)

Code copy: `generator/slotPresets.mjs` (`ROLE_LOADOUTS`, `SLOT_PRESETS`) — edit both, the Builder reads the code.

Source: `generator/catalogue.mjs` `loadoutSets` (the names the Builder's loadout dropdown shows).
A preset slot carries a ROLE (first column) plus its display title (the user's preset text, e.g.
"RED - Пулеметчик"); applying a preset resolves the role to the loadout below for the mission's
faction + subfaction. Cells marked `*` have no proper match: the fallback is a suggestion, the slot
is flagged in the UI so the mission maker can pick another loadout.

## Roles used by the presets

| Role | Opfor preset title | Blufor preset title |
|---|---|---|
| SL | Ком. отделения | SL |
| FTL | Старший стрелок | FTL |
| AR | — | Automatic Rifleman |
| MG | Пулеметчик | — |
| GL | Стрелок ГП | Grenadier |
| AT | Гранатометчик | — |
| AAT | Помощник гранатометчика | — |
| RIFLE | Стрелок | Rifleman |
| CREW | Наводчик-оператор, Механик-водитель | Gunner, Driver |

## Mapping

| Faction / subfaction | SL | FTL | AR | MG | GL | AT | AAT | RIFLE | CREW |
|---|---|---|---|---|---|---|---|---|---|
| US Army (also US Desert Camo) | SL | FTL | Automatic Rifleman | Machine Gunner | Grenadier | Light Anti-tank* | Rifleman* | Rifleman | Crew |
| US Green Berets | SL | SL | Light MG | Light MG | Grenadier | Rifleman* | Rifleman* | Rifleman | Rifleman* |
| US Green Berets (suppressed) | SL | SL | Rifleman* | Rifleman* | Grenadier | Rifleman* | Rifleman* | Rifleman | Rifleman* |
| USSR Army, Naval Infantry | Ком. отделения | Старший стрелок | Пулеметчик | Пулеметчик | Стрелок ГП | Гранатометчик | Помощник гранатометчика | Стрелок | Экипаж |
| USSR KLMK | Ком. отделения | Старший стрелок | Пулеметчик | Пулеметчик | Стрелок ГП | Гранатометчик | Помощник гранатометчика | Стрелок | Стрелок* |
| USSR Spetsnaz | Ком. отделения | Ком. отделения | Пулеметчик | Пулеметчик | Стрелок ГП | Стрелок* | Стрелок* | Стрелок | Стрелок* |
| USSR Spetsnaz (suppressed) | Ком. отделения | Ком. отделения | Стрелок* | Стрелок* | Стрелок ГП | Стрелок* | Стрелок* | Стрелок | Стрелок* |
| FIA | SL | SL | Machinegunner | Machinegunner | Rifleman* | AT Rifleman | Rifleman* | Rifleman | Crew |
| RHS USMC MEF | SL | FTL | Automatic Rifleman | Machine Gunner | Grenadier | Light Anti-tank* | Rifleman* | Rifleman | Crew |
| RHS USMC MEF Desert | SL | FTL | Automatic Rifleman | Machine Gunner | Grenadier | Light Anti-tank* | Rifleman* | Rifleman | Rifleman* |
| RHS MARSOC | SL | TL | Machine Gunner* | Machine Gunner | Grenadier | Light Anti-tank* | Rifleman* | Rifleman | Rifleman* |
| RHS AFRF (all four MSV camos) | Ком. отделения | Старший стрелок | Пулеметчик | Пулеметчик | Стрелок ГП | Гранатометчик | Помощник гранатометчика | Стрелок | Экипаж |
| UK 1989 Regulars | Section Commander | Section 2IC | LSW Gunner | GPMG Gunner | Rifleman* | MAW Gunner | MAW Assistant | Rifleman | Crew |
| UK 1983 Regulars | Section Commander | Section 2IC | Light Machine-Gunner | GPMG Gunner | Rifleman* | MAW Gunner | MAW Assistant | Rifleman | Crew |
| UK 1989 Special Forces | SF Patrol Leader | SF Patrol Leader | SF LMG | SF Gunner | SF Grenadier | SF Anti-Tank | SF Trooper* | SF Trooper | SF Trooper* |
| UK 1983 Special Forces | SF Patrol Leader | SF Patrol Leader | SF LMG | SF LMG* | SF Grenadier | SF Anti-Tank | SF Trooper* | SF Trooper | SF Trooper* |
| SFS US | SL | FTL | Machine Gunner* | Machine Gunner | Grenadier | Anti-tank (SMAW) | Rifleman* | Rifleman | Crew |
| SFS RF | Ком. отделения | Ком. группы | Пулеметчик* | Пулеметчик | Стрелок ГП | Гранатометчик | Стрелок* | Стрелок | Экипаж |
| SFS FIA | SL | FTL | Machine Gunner* | Machine Gunner | Grenadier | Anti-tank | Rifleman* | Rifleman | Crew |
| CDF | SL | SL | Automatic Rifleman | Machine Gunner | Grenadier | Anti-tank | Asst. Anti-tank | Rifleman | Crew |
| ChDKZ | SL | SL | Automatic Rifleman | Machine Gunner | Grenadier | Anti-tank | Rifleman* | Rifleman | Crew |
| NAPA | SL | SL | Automatic Rifleman | Machine Gunner (PKM) | Grenadier | Anti-tank | Rifleman (AK-74)* | Rifleman (AK-74) | Crew |
| Bundeswehr (both camos) | Squad Leader | Team Leader | Machine-Gunner* | Machine-Gunner | Grenadier | AT Rifleman | Ammunition Bearer* | Rifleman | Rifleman* |

## Rules behind the `*` cells (adjust here)

1. **"Пулеметчик" is always the PKM loadout**, and the AR role maps to it as well on USSR and RHS AFRF: the RPK is not considered a machine gun (user decision 2026-10-26).
2. **AR where the faction has no automatic rifleman** → its machine gunner (MARSOC, SFS ×3, Bundeswehr, Spetsnaz, Green Berets "Light MG").
3. **FTL where the faction has no team-leader kit** → the SL loadout (user decision 2026-10-26).
4. **Гранатометчик on factions without an RPG gunner** → Light Anti-tank (US, USMC, MARSOC); Spetsnaz / Green Berets have no launcher kit at all → Rifleman.
5. **Помощник гранатометчика without an assistant kit** → Rifleman; Bundeswehr's Ammunition Bearer and CDF's Asst. Anti-tank are the real assistants, MAW Assistant for the UK.
6. **Стрелок ГП / Grenadier where no UGL kit exists** (FIA, UK Regulars) → Rifleman.
7. **Crew where the subfaction ships none** (Green Berets, Spetsnaz, KLMK, USMC Desert, MARSOC, UK SF, Bundeswehr) → Rifleman; the squad can still mount up, the kit just has no crew gear.
