// Slot presets + role → loadout mapping for the Builder's Advanced squad mode (the toolkit's
// slot roster, feature/slot-roster). Human-readable source + review notes: input/slot-preset-loadouts.md
// (user-reviewed 2026-10-26: "Пулеметчик" is always the PKM kit, AR maps to it on USSR/AFRF; a
// faction without a team-leader kit uses its SL kit for FTL).
//
// A preset slot carries a ROLE, a team colour and a display title (in-game text, kept verbatim).
// Applying a preset resolves the role to the loadout NAME in the table below for the mission's
// faction + subfaction (looked up in FACTIONS[faction].loadoutSets[subfaction]). A trailing "*"
// marks a nearest match (that roster has no proper kit for the role) — the UI flags such slots
// so the mission maker checks them. Presets are starting points only: squads can be built from
// scratch and every slot stays editable.
import { FACTIONS } from "./catalogue.mjs";

export const SLOT_TEAMS = ["none", "red", "blue", "green", "yellow"];
export const SLOT_ROLES = ["SL", "FTL", "AR", "MG", "GL", "AT", "AAT", "RIFLE", "CREW"];
/** Seats per squad: the Blufor "Motorized 1+4+4+2" preset needs 11 (toolkit UI tested at 9, vanilla m_iGroupSize is unbounded) */
export const MAX_SLOTS = 11;

const US_ARMY = { SL: "SL", FTL: "FTL", AR: "Automatic Rifleman", MG: "Machine Gunner", GL: "Grenadier", AT: "Light Anti-tank*", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Crew" };
const US_GB = { SL: "SL", FTL: "SL", AR: "Light MG", MG: "Light MG", GL: "Grenadier", AT: "Rifleman*", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Rifleman*" };
const US_GB_S = { SL: "SL", FTL: "SL", AR: "Rifleman*", MG: "Rifleman*", GL: "Grenadier", AT: "Rifleman*", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Rifleman*" };
const USSR_ARMY = { SL: "Ком. отделения", FTL: "Старший стрелок", AR: "Пулеметчик", MG: "Пулеметчик", GL: "Стрелок ГП", AT: "Гранатометчик", AAT: "Помощник гранатометчика", RIFLE: "Стрелок", CREW: "Экипаж" };
const USSR_KLMK = { ...USSR_ARMY, CREW: "Стрелок*" };
const USSR_SF = { SL: "Ком. отделения", FTL: "Ком. отделения", AR: "Пулеметчик", MG: "Пулеметчик", GL: "Стрелок ГП", AT: "Стрелок*", AAT: "Стрелок*", RIFLE: "Стрелок", CREW: "Стрелок*" };
const USSR_SF_S = { ...USSR_SF, AR: "Стрелок*", MG: "Стрелок*" };
const FIA = { SL: "SL", FTL: "SL", AR: "Machinegunner", MG: "Machinegunner", GL: "Rifleman*", AT: "AT Rifleman", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Crew" };
const USMC = { SL: "SL", FTL: "FTL", AR: "Automatic Rifleman", MG: "Machine Gunner", GL: "Grenadier", AT: "Light Anti-tank*", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Crew" };
const USMC_D = { ...USMC, CREW: "Rifleman*" };
const MARSOC = { SL: "SL", FTL: "TL", AR: "Machine Gunner*", MG: "Machine Gunner", GL: "Grenadier", AT: "Light Anti-tank*", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Rifleman*" };
const UK_89 = { SL: "Section Commander", FTL: "Section 2IC", AR: "LSW Gunner", MG: "GPMG Gunner", GL: "Rifleman*", AT: "MAW Gunner", AAT: "MAW Assistant", RIFLE: "Rifleman", CREW: "Crew" };
const UK_83 = { ...UK_89, AR: "Light Machine-Gunner" };
const UK_SF_89 = { SL: "SF Patrol Leader", FTL: "SF Patrol Leader", AR: "SF LMG", MG: "SF Gunner", GL: "SF Grenadier", AT: "SF Anti-Tank", AAT: "SF Trooper*", RIFLE: "SF Trooper", CREW: "SF Trooper*" };
const UK_SF_83 = { ...UK_SF_89, MG: "SF LMG*" };
const SFS_US = { SL: "SL", FTL: "FTL", AR: "Machine Gunner*", MG: "Machine Gunner", GL: "Grenadier", AT: "Anti-tank (SMAW)", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Crew" };
const SFS_RF = { SL: "Ком. отделения", FTL: "Ком. группы", AR: "Пулеметчик*", MG: "Пулеметчик", GL: "Стрелок ГП", AT: "Гранатометчик", AAT: "Стрелок*", RIFLE: "Стрелок", CREW: "Экипаж" };
const SFS_FIA = { SL: "SL", FTL: "FTL", AR: "Machine Gunner*", MG: "Machine Gunner", GL: "Grenadier", AT: "Anti-tank", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Crew" };
const CDF = { SL: "SL", FTL: "SL", AR: "Automatic Rifleman", MG: "Machine Gunner", GL: "Grenadier", AT: "Anti-tank", AAT: "Asst. Anti-tank", RIFLE: "Rifleman", CREW: "Crew" };
const CHDKZ = { SL: "SL", FTL: "SL", AR: "Automatic Rifleman", MG: "Machine Gunner", GL: "Grenadier", AT: "Anti-tank", AAT: "Rifleman*", RIFLE: "Rifleman", CREW: "Crew" };
const NAPA = { SL: "SL", FTL: "SL", AR: "Automatic Rifleman", MG: "Machine Gunner (PKM)", GL: "Grenadier", AT: "Anti-tank", AAT: "Rifleman (AK-74)*", RIFLE: "Rifleman (AK-74)", CREW: "Crew" };
const BWAR = { SL: "Squad Leader", FTL: "Team Leader", AR: "Machine-Gunner*", MG: "Machine-Gunner", GL: "Grenadier", AT: "AT Rifleman", AAT: "Ammunition Bearer*", RIFLE: "Rifleman", CREW: "Rifleman*" };

/** faction key → subfaction key → role → loadout NAME (as in loadoutSets); "*" = nearest match */
export const ROLE_LOADOUTS = {
  US: { US_Army: US_ARMY, GreenBerets: US_GB, GreenBerets_Suppressed: US_GB_S },
  US_DESERT: { US_Army: US_ARMY, GreenBerets: US_GB, GreenBerets_Suppressed: US_GB_S },
  USSR: { USSR_Army: USSR_ARMY, KLMK: USSR_KLMK, Naval_Infantry: USSR_ARMY, Spetsnaz: USSR_SF, Spetsnaz_Suppressed: USSR_SF_S },
  FIA: { FIA },
  RHS_USAF: { USMC_MEF: USMC, USMC_MEF_Desert: USMC_D, MARSOC },
  RHS_AFRF: { MSV_Flora: USSR_ARMY, MSV_VSR: USSR_ARMY, MSV_VKPO_Summer: USSR_ARMY, MSV_VKPO_Demiseason: USSR_ARMY },
  UK: { "1989 Regulars": UK_89, "1989 Special Forces": UK_SF_89, "1983 Regulars": UK_83, "1983 Special Forces": UK_SF_83 },
  SFS_US: { "Special Force Squad": SFS_US },
  SFS_USSR: { "Special Force Squad": SFS_RF },
  SFS_FIA: { "Special Force Squad": SFS_FIA },
  Ses_CDF: { "CDF Army": CDF },
  Ses_ChDKZ: { ChDKZ: CHDKZ },
  Ses_NAPA: { NAPA },
  BWAR: { Flecktarn: BWAR, Tropentarn: BWAR },
};

const S = (team, role, name) => ({ team, role, name });

/** The squad presets offered by "Add squad" (both lists always, user decision). Titles are UI
 * strings (EN/RU); slot names are the in-game seat titles exactly as authored. */
export const SLOT_PRESETS = [
  {
    id: "opfor-motor-4-3-2",
    side: "opfor",
    title: { en: "Motor rifle 4+3+2", ru: "Мотопехота 4+3+2" },
    slots: [
      S("red", "SL", "RED - Ком. отделения"),
      S("red", "MG", "RED - Пулеметчик"),
      S("red", "AT", "RED - Гранатометчик"),
      S("red", "AAT", "RED - Помощник гранатометчика"),
      S("blue", "FTL", "BLUE - Старший стрелок"),
      S("blue", "GL", "BLUE - Стрелок ГП"),
      S("blue", "RIFLE", "BLUE - Стрелок"),
      S("green", "CREW", "GREEN - Наводчик-оператор"),
      S("green", "CREW", "GREEN - Механик-водитель"),
    ],
  },
  {
    id: "opfor-motor-1-4-3-2",
    side: "opfor",
    title: { en: "Motor rifle 1+4+3+2", ru: "Мотопехота 1+4+3+2" },
    slots: [
      S("none", "SL", "Ком. отделения"),
      S("red", "FTL", "RED - Старший стрелок"),
      S("red", "MG", "RED - Пулеметчик"),
      S("red", "AT", "RED - Гранатометчик"),
      S("red", "AAT", "RED - Помощник гранатометчика"),
      S("blue", "FTL", "BLUE - Старший стрелок"),
      S("blue", "GL", "BLUE - Стрелок ГП"),
      S("blue", "RIFLE", "BLUE - Стрелок"),
      S("green", "CREW", "GREEN - Наводчик-оператор"),
      S("green", "CREW", "GREEN - Механик-водитель"),
    ],
  },
  {
    id: "opfor-inf-4-4",
    side: "opfor",
    title: { en: "Infantry 4+4", ru: "Пехота 4+4" },
    slots: [
      S("red", "SL", "RED - Ком. отделения"),
      S("red", "MG", "RED - Пулеметчик"),
      S("red", "AT", "RED - Гранатометчик"),
      S("red", "AAT", "RED - Помощник гранатометчика"),
      S("blue", "FTL", "BLUE - Старший стрелок"),
      S("blue", "RIFLE", "BLUE - Стрелок"),
      S("blue", "GL", "BLUE - Стрелок ГП"),
      S("blue", "RIFLE", "BLUE - Стрелок"),
    ],
  },
  {
    id: "opfor-inf-4-3",
    side: "opfor",
    title: { en: "Infantry 4+3", ru: "Пехота 4+3" },
    slots: [
      S("red", "SL", "RED - Ком. отделения"),
      S("red", "MG", "RED - Пулеметчик"),
      S("red", "AT", "RED - Гранатометчик"),
      S("red", "AAT", "RED - Помощник гранатометчика"),
      S("blue", "FTL", "BLUE - Старший стрелок"),
      S("blue", "GL", "BLUE - Стрелок ГП"),
      S("blue", "RIFLE", "BLUE - Стрелок"),
    ],
  },
  {
    id: "opfor-inf-1-4-3",
    side: "opfor",
    title: { en: "Infantry 1+4+3", ru: "Пехота 1+4+3" },
    slots: [
      S("none", "SL", "Ком. отделения"),
      S("red", "FTL", "RED - Старший стрелок"),
      S("red", "MG", "RED - Пулеметчик"),
      S("red", "AT", "RED - Гранатометчик"),
      S("red", "AAT", "RED - Помощник гранатометчика"),
      S("blue", "FTL", "BLUE - Старший стрелок"),
      S("blue", "GL", "BLUE - Стрелок ГП"),
      S("blue", "RIFLE", "BLUE - Стрелок"),
    ],
  },
  {
    id: "blufor-inf-1-4-4",
    side: "blufor",
    title: { en: "Infantry 1+4+4", ru: "Пехота 1+4+4" },
    slots: [
      S("none", "SL", "SL"),
      S("red", "FTL", "RED - FTL"),
      S("red", "AR", "RED - Automatic Rifleman"),
      S("red", "GL", "RED - Grenadier"),
      S("red", "RIFLE", "RED - Rifleman"),
      S("blue", "FTL", "BLUE - FTL"),
      S("blue", "AR", "BLUE - Automatic Rifleman"),
      S("blue", "GL", "BLUE - Grenadier"),
      S("blue", "RIFLE", "BLUE - Rifleman"),
    ],
  },
  {
    id: "blufor-motor-1-4-4-2",
    side: "blufor",
    title: { en: "Motorized 1+4+4+2", ru: "Мотопехота 1+4+4+2" },
    slots: [
      S("none", "SL", "SL"),
      S("red", "FTL", "RED - FTL"),
      S("red", "AR", "RED - Automatic Rifleman"),
      S("red", "GL", "RED - Grenadier"),
      S("red", "RIFLE", "RED - Rifleman"),
      S("blue", "FTL", "BLUE - FTL"),
      S("blue", "AR", "BLUE - Automatic Rifleman"),
      S("blue", "GL", "BLUE - Grenadier"),
      S("blue", "RIFLE", "BLUE - Rifleman"),
      S("green", "CREW", "GREEN - Driver"),
      S("green", "CREW", "GREEN - Gunner"),
    ],
  },
];

/** Role → the faction/subfaction's loadout, or null when the table has no entry or the named
 * loadout is missing from the roster. `approximate` = the "*" nearest-match cells. */
export function resolveRoleLoadout(faction, subfaction, role) {
  const F = FACTIONS[faction];
  if (!F) return null;
  const roster = F.loadoutSets?.[subfaction] ?? [];
  let table = ROLE_LOADOUTS[faction]?.[subfaction];
  if (!table && F.aliasOf) table = ROLE_LOADOUTS[F.aliasOf]?.[subfaction];
  const spec = table?.[role];
  if (!spec) return null;
  const approximate = spec.endsWith("*");
  const name = approximate ? spec.slice(0, -1) : spec;
  const entry = roster.find((l) => l.name === name);
  if (!entry) return null;
  return { prefab: entry.prefab, name: entry.name, approximate };
}
