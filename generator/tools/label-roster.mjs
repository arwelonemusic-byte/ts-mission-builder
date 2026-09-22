// Human-readable ROLE and GROUP labels for the advanced-AI-placement feature.
//
//   node generator/tools/label-roster.mjs   → input/roster-labels.md + input/roster-labels.json
//
// Roles: consumes input/characters-harvest.json (run harvest-characters.mjs
// first). Character prefabs are collapsed onto a ROLE per subfaction — the role
// stem is the prefab basename minus its variant suffix (`_2`, `3`, `_Variant_1`)
// — and the emission script picks one variant at random. The label comes from a
// stem-token dictionary (consistent across factions: AR → Automatic Rifleman,
// LAT → Light Anti-Tank …); unknown stems fall back to the game's own name.
// Excluded: unarmed shells, prefabs that don't ship, prefabs without a GUID.
//
// Groups: every group ref in the registry's FACTIONS[*].groupSets, labelled
// from the basename token dictionary (Rifle Squad, Fire Team, Machine Gun
// Team …), with the game's own name + unit-slot count alongside for review;
// `<Group>2` twins collapse onto the base group the same way.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { FACTIONS } from "../catalogue.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REF = "D:/VSCode_dev/arma-reforger/reference";
const VAN = `${REF}/ReforgerData`;
const harvest = JSON.parse(readFileSync(join(REPO, "input", "characters-harvest.json"), "utf8"));

// --- subfaction folders → registry set key + label ------------------------------
// folder = path relative to Prefabs/Characters/Factions/<side>/<faction>/ ("" = root)
const SUBFACTIONS = {
  US: { "": ["US_Army", "US Army"], Guard: ["US_Army", "US Army", "fold"], GreenBerets: ["GreenBerets", "Green Berets"], "GreenBerets/Suppressed": ["GreenBerets_Suppressed", "Green Berets (suppressed)"] },
  USSR: { "": ["USSR_Army", "Soviet Army"], Guard: ["USSR_Army", "Soviet Army", "fold"], KLMK: ["KLMK", "Soviet Army (KLMK)"], Naval_Infantry: ["Naval_Infantry", "Naval Infantry"], Spetsnaz: ["Spetsnaz", "Spetsnaz"], "Spetsnaz/Suppressed": ["Spetsnaz_Suppressed", "Spetsnaz (suppressed)"] },
  FIA: { "": ["FIA", "FIA"], "Special Units": ["FIA", "FIA", "fold"] },
  RHS_USAF: { RHS_USAF_Army: [null, "US Army (RHS)"], RHS_USAF_USMC_MEF: ["USMC_MEF", "USMC (MEF)"], RHS_USAF_USMC_MEF_D: ["USMC_MEF_Desert", "USMC (MEF, desert)"], RHS_USAF_MARSOC: ["MARSOC", "MARSOC"], RHS_USAF_MARSOC_MC: [null, "MARSOC (MultiCam)"], RHS_USAF_FORECON: [null, "FORECON"] },
  RHS_AFRF: { "MSV/Flora": ["MSV_Flora", "MSV (Flora)"], "MSV/VSR": ["MSV_VSR", "MSV (VSR)"], "MSV/VKPO_Summer": ["MSV_VKPO_Summer", "MSV (VKPO summer)"], "MSV/VKPO_Demiseason": ["MSV_VKPO_Demiseason", "MSV (VKPO demi-season)"], "MSV/VKPO3_EMR": [null, "MSV (VKPO 3.0 EMR)"], "SSO/ATACS": [null, "SSO (A-TACS)"], "SSO/ATACS/Variants": [null, "SSO (A-TACS)", "fold"], "VV/RG/Atacs": [null, "Rosgvardia (A-TACS)"], "VV/RG/Blk": [null, "Rosgvardia (black)"], "VV/RG/Olive": [null, "Rosgvardia (olive)"] },
  RHS_ION: { "": ["ION_COY", "ION"], "INDFOR/RHS_ION_Coy": ["ION_COY", "ION (company)"], "INDFOR/RHS_ION_Urban": [null, "ION (urban)"], "INDFOR/RHS_ION_Urban_demi": [null, "ION (urban, demi-season)"] },
  UK: { "1989/Regulars": ["Regulars_1989", "1989 Regulars"], "1989/SpecialForces": ["SF_1989", "1989 Special Forces"], "1983/Regulars": ["Regulars_1983", "1983 Regulars"], "1983/SpecialForces": ["SF_1983", "1983 Special Forces"], "1989/Reservists": [null, "1989 Reservists (excluded by design)"], "1983/Reservists": [null, "1983 Reservists (excluded by design)"], "": [null, "Patrol / misc (root)"] },
  MEI: { "": ["Insurgents", "Insurgents"] },
  PLASTICBANDIT: { Scav: ["Bandits", "Scavengers"], Stalker: ["Bandits", "Stalkers"] },
  SFS_US: { "": ["SFS", "Special Force Squad"] }, SFS_USSR: { "": ["SFS", "Special Force Squad"] }, SFS_FIA: { "": ["SFS", "Special Force Squad"] },
  Ses_CDF: { "": ["CDF_Army", "CDF"] }, Ses_ChDKZ: { "": ["ChDKZ", "ChDKZ"] }, Ses_NAPA: { "": ["NAPA", "NAPA"] },
  BWAR: { "": ["Flecktarn", "Flecktarn"], Tropen: ["Tropentarn", "Tropentarn"] },
};

// --- role stem tokens → label ---------------------------------------------------
// Stems are matched as whole token sequences after the faction prefix is stripped.
const ROLE_LABELS = [
  // [regex on the stem (case-insensitive), EN, RU]
  [/^Scout_RTO$/, "Scout Radio Operator", "Разведчик-радист"],
  [/^Scout$/, "Scout", "Разведчик"],
  [/^(Rifleman|Rifle|Trooper)$/, "Rifleman", "Стрелок"],
  [/^GP$/, "Grenadier", "Гранатометчик (ГП)"], // SFS Character_US_GP = "Special Forces Grenadier" (M4 Block II UGL)
  [/^SR$/, "Senior Rifleman", "Старший стрелок"],
  [/^SR_GL$/, "Senior Rifleman (GL)", "Старший стрелок (ГП)"],
  [/^(AR|ARifleman)$/, "Automatic Rifleman", "Стрелок-пулеметчик"],
  [/^AAR$/, "Assistant Automatic Rifleman", "Помощник стрелка-пулеметчика"],
  [/^(MG|Gunner|LMG)$/, "Machine Gunner", "Пулеметчик"],
  [/^AMG$/, "Assistant Machine Gunner", "Помощник пулеметчика"],
  [/^(GL|Grenadier|AG)$/, "Grenadier", "Гранатометчик (ГП)"],
  [/^(AT|RPG)$/, "Anti-Tank", "Гранатометчик (РПГ)"],
  [/^AAT$/, "Assistant Anti-Tank", "Помощник гранатометчика"],
  [/^(LAT|LightAT)$/, "Light Anti-Tank", "ПТ стрелок"],
  [/^Medic$/, "Medic", "Санитар"],
  [/^Engineer$/, "Engineer", "Инженер"],
  [/^Sapper$/, "Sapper", "Сапер"],
  [/^Ammo$/, "Ammo Bearer", "Подносчик боеприпасов"],
  [/^(TL|FTL)$/, "Team Leader", "Командир группы"],
  [/^TL_Marksman$/, "Team Leader (marksman)", "Командир группы (марксман)"],
  [/^(SL|Leader|Sergeant_SL)$/, "Squad Leader", "Командир отделения"],
  [/^PL$/, "Platoon Leader", "Командир взвода"],
  [/^Sergeant$/, "Platoon Sergeant", "Зам. командира взвода"],
  [/^(Officer|AKOfficer)$/, "Officer", "Офицер"],
  [/^(RTO|Signals)$/, "Radio Operator", "Радист"],
  [/^RadioRecon$/, "Radio Recon", "Радиоразведчик"],
  [/^Sniper$/, "Sniper", "Снайпер"],
  [/^Spotter$/, "Spotter", "Наблюдатель"],
  [/^Spotter_GL$/, "Spotter (GL)", "Наблюдатель (ГП)"],
  [/^(Sharpshooter|Marksman)$/, "Sharpshooter", "Марксман"],
  [/^(Crew|Crewman)$/, "Crewman", "Член экипажа"],
  [/^(CC|CrewLdr)$/, "Crew Commander", "Командир экипажа"],
  [/^(HeliPilot|Pilot)$/, "Helicopter Pilot", "Пилот вертолета"],
  [/^HeliCrew$/, "Helicopter Crew", "Экипаж вертолета"],
  [/^GateKeeper$/, "Gate Guard", "Часовой"],
  [/^SF$/, "Operator", "Оператор"],
  [/^Bomber$/, "Suicide Bomber", "Смертник"],
  [/^Bomb$/, "Bomb Maker", "Подрывник"],
  [/^Leader$/, "Leader", "Главарь"],
];

// Per-faction stem overrides (author-specific naming that must not hit the shared dictionary)
const ROLE_OVERRIDES = {
  PLASTICBANDIT: { Rookie: ["Rookie", "Новичок"], Veteran: ["Veteran", "Ветеран"], Legend: ["Legend", "Легенда"], Shadow: ["Wraith", "Призрак"], Gunner: ["Gunner", "Пулеметчик"], RPG: ["RPG Gunner", "Гранатометчик (РПГ)"], Brute: ["Brute", "Громила"], Chad: ["Chad", "Чад"], Gopnik: ["Gopnik", "Гопник"] },
  RHS_AFRF: { Chad: ["Breacher", "Штурмовик"], Breacher: ["Breacher", "Штурмовик"], Scout_RadioRecon: ["Sensor Operator", "Оператор РТР"] },
  FIA: { AC: ["Guerrilla", "Партизан"], AC_Grenadier: ["Guerrilla Grenadier", "Партизан-гранатометчик"], AC_Medic: ["Guerrilla Medic", "Партизан-санитар"], AC_Scout: ["Guerrilla Spotter", "Партизан-наблюдатель"], AC_Partisan: ["Partisan", "Партизан (ополченец)"], AC_Partisan_Grenadier: ["Partisan Grenadier", "Партизан-гранатометчик (ополченец)"], MG_Elite: ["Machine Gunner", "Пулеметчик"], Rebel_Sharpshooter: ["Sharpshooter", "Марксман"] },
  UK: {
    GPMG_No1: ["GPMG Gunner", "Пулеметчик (GPMG)"], L4LMG_No1: ["LMG Gunner (L4)", "Пулеметчик (L4)"], MAW_No1: ["MAW Gunner", "Гранатометчик (Carl Gustav)"], Maw_No2: ["MAW Assistant", "Помощник гранатометчика"],
    PlatoonLeader: ["Platoon Leader", "Командир взвода"], SectionCommander: ["Section Commander", "Командир секции"], SectionCommander_Recce: ["Section Commander (recce)", "Командир секции (разведка)"], Section2IC: ["Section 2IC", "Зам. командира секции"],
    Rifleman_LAT: ["Light Anti-Tank", "ПТ стрелок"], Rifleman_LAT_LAW66: ["Light Anti-Tank (LAW)", "ПТ стрелок (LAW)"], Rifleman_LAT_LAW80: ["Light Anti-Tank (LAW)", "ПТ стрелок (LAW)"], Rifleman_Sterling: ["Rifleman", "Стрелок"], Rifleman_Recce: ["Rifleman (recce)", "Стрелок (разведка)"], Rifleman_Mortar: ["Mortarman", "Минометчик"],
    Sapper_Assault: ["Assault Engineer", "Штурмовой сапер"], Heli_GroundCrew: ["Ground Crew", "Наземный персонал"], ConvoyCommander: ["Convoy Commander", "Командир колонны"], DetachmentCommander: ["Detachment Commander", "Командир отряда"], Driver: ["Driver", "Водитель"], LSW: ["LSW Gunner", "Пулеметчик (LSW)"], Sniper_Recce: ["Sniper (recce)", "Снайпер (разведка)"],
    CRW: ["CRW Trooper", "Боец CRW"], CharlieG: ["Anti-Tank (Carl Gustav)", "Гранатометчик (Carl Gustav)"], Saboteur: ["Saboteur", "Диверсант"], GPMG: ["Machine Gunner (GPMG)", "Пулеметчик (GPMG)"], SniperCovert: ["Sniper (covert)", "Снайпер (скрытный)"],
  },
  Ses_ChDKZ: { Insurgent: ["Insurgent", "Повстанец"], Insurgent_PM: ["Insurgent", "Повстанец"], Rifleman_Armor: ["Rifleman", "Стрелок"] },
  Ses_NAPA: { AMG_PKM: ["Assistant Machine Gunner", "Помощник пулеметчика"], MG_UK: ["Machine Gunner", "Пулеметчик"], Rifleman_AK74: ["Rifleman", "Стрелок"], Rifleman_AKSU: ["Rifleman", "Стрелок"], Rifleman_VZ: ["Rifleman", "Стрелок"] },
  MEI: { Leader: ["Leader", "Главарь"] },
};

const FACTION_PREFIX = /^(Character_)?(RHS_USAF_(USMC_MEF_D|USMC_D|USMC|FORECON|Army)_|RHS_USMC_MARSOC_MC_|RHS_USMC_MARSOC_|RHS_USA_|RHS_RF_MSV_VKPO_3\.0_|RHS_RF_MSV_VKPO_DS_|RHS_RF_MSV_VKPO_S_|RHS_RF_MSV_Flora_|RHS_RF_MSV_VSR_|RHS_RF_SSO_|RHS_RF_SOF_|RHS_RF_SOBR_|RHS_RF_SOBROlive_|RHS_ION_Urban_D_|RHS_ION_Urban_|RHS_ION_Coy_|RHS_ION_|RHS_AFRF_MSV_Flora_|UK_(1983|1989)_(Regulars|Reservists|Reservist|SF|SpecialForces)_|UK_(1983|1989)_|UK_Patrol_|UK_|USSR_NI_|USSR_SF_|USSR_|US_SF_|US_|FIA_|MEI_|PLASTICBANDIT_(Scav|Stalker)_|CDF_|ChDKZ_|NAPA_|RF_|BWAR_Character_|BWAR_)/i;
const SUFFIXES = /(_KLMK|_Guard|_Tigerstripe|_3FT|_S)$/i;

function roleStem(file) {
  let s = basename(file, ".et");
  s = s.replace(FACTION_PREFIX, "");
  s = s.replace(SUFFIXES, "");
  // Variant digits: "_2", "_Variant_1", or a single digit glued to letters ("Rifleman2", "Chad2") —
  // model numbers keep theirs ("AK74", "GM94") and "_No1"/"_No2" are DIFFERENT roles (gunner / assistant).
  if (!/_No\d$/i.test(s)) s = s.replace(/(?:_Variant)?_\d+$|(?<=[A-Za-z])\d$/i, "");
  if (s === "" || /^S$/i.test(s)) s = "SF"; // Character_US_SF.et / Character_US_SF_S.et → the SF rifleman
  return s;
}
function roleLabel(faction, stem, fallbackEn, fallbackRu) {
  const ov = ROLE_OVERRIDES[faction];
  // Second pass with ALL trailing digits stripped (ION "Rifleman10"…"Rifleman20")
  for (const s of [stem, stem.replace(/\d+$/, "")]) {
    if (ov) for (const [k, v] of Object.entries(ov)) if (k.toLowerCase() === s.toLowerCase()) return { en: v[0], ru: v[1], source: "override" };
    for (const [re, en, ru] of ROLE_LABELS) if (re.test(s)) return { en, ru, source: "stem" };
  }
  return { en: fallbackEn ?? stem, ru: fallbackRu ?? null, source: "game name" };
}

// --- roles ----------------------------------------------------------------------
const roles = [];
const excludedRows = [];
for (const f of harvest) {
  const subs = SUBFACTIONS[f.key] ?? {};
  const rows = f.rows;
  // Faction root = Prefabs/Characters/Factions/<side>/<faction>/, or /<faction>/ when the mod skips the side folder (Bandits)
  const first = rows[0]?.path ?? "";
  const facRoot = first.match(/^(Prefabs\/Characters\/Factions\/(?:BLUFOR|OPFOR|INDFOR|IND|CIV)\/[^/]+\/)/i)?.[1] ?? first.match(/^(Prefabs\/Characters\/Factions\/[^/]+\/)/)?.[1] ?? null;
  const byRole = new Map(); // faction|subfaction|label → role
  for (const r of rows) {
    const rel = facRoot && r.path.startsWith(facRoot) ? r.path.slice(facRoot.length) : r.path.replace(/^Prefabs\/Characters\/Factions\//, "");
    const folder = rel.includes("/") ? dirname(rel) : "";
    const sub = subs[folder] ?? [null, folder || "(root)"];
    const armed = r.weapons.length || r.invWeapons.length;
    const reason = !r.ships ? "does not ship" : !r.guid ? "no GUID source" : !armed ? "unarmed" : /DONT USE/i.test(r.name ?? "") ? `author-flagged "${r.name}"` : null;
    if (reason) { excludedRows.push({ faction: f.key, file: basename(r.path), reason }); continue; }
    const stem = roleStem(r.path);
    const lab = roleLabel(f.key, stem, r.name, r.nameRu);
    const key = `${f.key}|${sub[1]}|${lab.en.toLowerCase()}`;
    if (!byRole.has(key)) byRole.set(key, { faction: f.key, setKey: sub[0], subfaction: sub[1], label: lab.en, labelRu: lab.ru, labelSource: lab.source, stems: new Set(), gameNames: new Set(), gameNamesRu: new Set(), variants: [] });
    const g = byRole.get(key);
    g.stems.add(stem);
    if (r.name) g.gameNames.add(r.name);
    if (r.nameRu) g.gameNamesRu.add(r.nameRu);
    // Prefer the game's own RU when our EN label equals the game's EN name (vanilla-keyed roles)
    if (lab.en === r.name && r.nameRu) g.labelRu = r.nameRu;
    if (lab.source !== g.labelSource && lab.source === "game name") g.labelSource = "mixed";
    g.variants.push({ file: basename(r.path), ref: r.ref, weapons: [...r.weapons, ...r.invWeapons.map((w) => `${w} (inv)`)], status: r.status, cataloged: r.cataloged, foldedFrom: sub[2] === "fold" ? folder : undefined });
  }
  for (const g of byRole.values()) roles.push({ ...g, stems: [...g.stems], gameNames: [...g.gameNames], gameNamesRu: [...g.gameNamesRu] });
}

// --- groups ---------------------------------------------------------------------
const GROUP_LABELS = [
  [/^RifleSquad$/, "Rifle Squad", "Стрелковое отделение"],
  [/^Squad$/, "Squad", "Отделение"],
  [/^ReconSquad$/, "Recon Squad", "Разведывательное отделение"],
  [/^InfantrySection$/, "Infantry Section", "Пехотная секция"],
  [/^RifleGroup$/, "Rifle Group", "Стрелковая группа"],
  [/^GunGroup$/, "Gun Group", "Пулеметная группа"],
  [/^Brick$/, "Brick (4-man patrol)", "Патруль «Brick» (4 чел.)"],
  [/^(FireTeam|FireGroup)$/, "Fire Team", "Огневая группа"],
  [/^(FireTeam|FireGroup)_Guard$/, "Fire Team (guard)", "Огневая группа (охрана)"],
  [/^FireTeam_Heavy$/, "Heavy Fire Team", "Тяжелая огневая группа"],
  [/^LightFireTeam$/, "Light Fire Team", "Легкая огневая группа"],
  [/^ManeuverGroup$/, "Maneuver Group", "Маневренная группа"],
  [/^(MachineGunTeam|MGTeam)$/, "Machine Gun Team", "Пулеметный расчет"],
  [/^Team_Suppress$/, "Suppression Team", "Группа подавления"],
  [/^Team_GL$/, "Grenadier Team", "Группа гранатометчиков (ГП)"],
  [/^(Team_AT|RPGTeam)$/, "Anti-Tank Team", "Противотанковая группа"],
  [/^Team_LAT$/, "Light Anti-Tank Team", "Группа ПТ стрелков"],
  [/^AmmoTeam$/, "Ammo Team", "Группа подносчиков"],
  [/^EngineerTeam$/, "Engineer Team", "Инженерная группа"],
  [/^SapperTeam$/, "Sapper Team", "Саперная группа"],
  [/^MedicalSection$/, "Medical Section", "Медицинская группа"],
  [/^(ReconTeam|RecceTeam)$/, "Recon Team", "Разведгруппа"],
  [/^RadioReconTeam$/, "Radio Recon Team", "Группа радиоразведки"],
  [/^SentryTeam$/, "Sentry Team", "Парный пост"],
  [/^SniperTeam$/, "Sniper Team", "Снайперская пара"],
  [/^(SharpshooterTeam|Sharpshooter)$/, "Sharpshooter Team", "Пара марксманов"],
  [/^PlatoonHQ$/, "Platoon HQ", "Управление взвода"],
  [/^Patrol$/, "Patrol", "Патруль"],
  [/^Team$/, "SF Team", "Группа СпН"],
  [/^CloseProtectionTeam$/, "Close Protection Team", "Группа охраны"],
  [/^StaticSecurityTeam$/, "Static Security Team", "Пост охраны"],
  [/^SpecialProjectsTeam$/, "Special Projects Team", "Группа спецпроектов"],
  [/^QuickReactionForce$/, "Quick Reaction Force", "Группа быстрого реагирования"],
];
// Per-faction group labels where the mod's own flavour beats the shared dictionary
const GROUP_OVERRIDES = {
  PLASTICBANDIT: { Patrol: ["Duo", "Двойка"], FireTeam: ["Crew", "Бригада"], FireTeam_Heavy: ["Heavy Crew", "Тяжелая бригада"], Squad: ["Gang", "Банда"], MGTeam: ["MG Trio", "Пулеметная тройка"], RPGTeam: ["RPG Duo", "Двойка с РПГ"], Sharpshooter: ["Sharpshooter Duo", "Двойка марксманов"] },
  UK: { MachineGunTeam: ["GPMG Team", "Расчет GPMG"], Team_AT: ["Charlie G Team", "Расчет Carl Gustav"], SniperTeam: ["Sniper Pair", "Снайперская пара"], RecceTeam: ["Recce Team", "Разведгруппа"], MedicalSection: ["Medical Team", "Медицинская группа"], AmmoTeam: ["Resupply Team", "Группа снабжения"], Brick: ["Patrol Brick", "Патруль «Brick»"], Patrol: ["SF Patrol", "Патруль СпН"] },
};
const GROUP_PREFIX = /^(BWAR_Group_|Group_(USAF_USMC_MEF_D_|USAF_USMC_MEF_|USAF_USMC_MARSOC_|RHS_RF_MSV_VKPO_DS_|RHS_RF_MSV_VKPO_S_|RHS_RF_MSV_Flora_|RHS_RF_MSV_VSR_|RHS_ION_COY_|UK_(1983|1989)_(Regulars|SpecialForces)_|US_GreenBeret_|USSR_Spetsnaz_|Ses_CDF_|ChDKZ_|NAPA_|MEI_|PLASTICBANDIT_|USSR_|US_|FIA_))/i;
const GROUP_SUFFIX = /(_KLMK|_NI|_3FT)$/i;
function groupStem(ref) { return basename(ref.replace(/^\{[0-9A-F]{16}\}/, ""), ".et").replace(GROUP_PREFIX, "").replace(GROUP_SUFFIX, "").replace(/\d+$/, ""); }

// Group prefab facts: game name (chain), slot count (nearest declaration)
const strCache = new Map();
function table(base, locale) {
  const p = `${base}.${locale}.conf`;
  if (strCache.has(p)) return strCache.get(p);
  const m = new Map();
  if (existsSync(p)) {
    const lines = readFileSync(p, "utf8").split(/\r?\n/);
    const ids = [], texts = []; let mode = 0, cont = false;
    for (const raw of lines) {
      const l = raw.trim();
      if (mode === 0) { if (l === "Ids {") mode = 1; continue; }
      if (mode === 2) { if (l === "Texts {") mode = 3; continue; }
      if (!cont && l === "}") { mode = mode === 1 ? 2 : 4; if (mode === 4) break; continue; }
      const hc = l.endsWith("\\"); const body = hc ? l.slice(0, -1).trimEnd() : l;
      const a = body.indexOf('"'), b = body.lastIndexOf('"'); const c = a !== -1 && b > a ? body.slice(a + 1, b) : body;
      const bucket = mode === 1 ? ids : texts;
      if (cont) bucket[bucket.length - 1] += "\n" + c; else bucket.push(c);
      cont = hc;
    }
    ids.forEach((id, i) => m.set(id, texts[i]));
  }
  strCache.set(p, m);
  return m;
}
const LANG = {
  vanilla: `${VAN}/Language/localization`, rhs: `${REF}/RHS Status Quo/Language/rhs_localization`, uk: `${REF}/British Forces/Language/BritishForces_localization`,
  mei: `${REF}/MiddleEastInsurgents/Language/mei_localization`, a2: `${REF}/Arma II Factions/Language/SesFactionsLocalization`, bw: `${REF}/Bundeswehr Mod/Language/BWAR_Localization`,
};
const ROOTS = {
  US: [], USSR: [], FIA: [], RHS_USAF: [`${REF}/RHS Status Quo`], RHS_AFRF: [`${REF}/RHS Status Quo`], RHS_ION: [`${REF}/RHS Status Quo`], UK: [`${REF}/British Forces`], MEI: [`${REF}/MiddleEastInsurgents`],
  PLASTICBANDIT: [`${REF}/Bandit Faction`], SFS_US: [`${REF}/SFS US Loadout`], SFS_USSR: [`${REF}/SFS RF Loadout`], SFS_FIA: [`${REF}/SFS FIA Loadout`],
  Ses_CDF: [`${REF}/Arma II Factions`], Ses_ChDKZ: [`${REF}/Arma II Factions`], Ses_NAPA: [`${REF}/Arma II Factions`], BWAR: [`${REF}/Bundeswehr Mod`],
};
const LANGS = { RHS_USAF: "rhs", RHS_AFRF: "rhs", RHS_ION: "rhs", UK: "uk", MEI: "mei", Ses_CDF: "a2", Ses_ChDKZ: "a2", Ses_NAPA: "a2", BWAR: "bw", SFS_US: "rhs", SFS_USSR: "rhs", SFS_FIA: "rhs" };
function resolveKey(key, faction, locale) {
  const bases = [LANGS[faction] ? LANG[LANGS[faction]] : null, LANG.vanilla].filter(Boolean);
  for (const b of bases) { const t = table(b, locale); const v = t.get(key) ?? [...t].find(([k]) => k.toLowerCase() === key.toLowerCase())?.[1]; if (v !== undefined) return v; }
  return undefined;
}
function groupFacts(ref, faction) {
  const path = ref.replace(/^\{[0-9A-F]{16}\}/, "");
  let p = path, name = null, slots = null, hops = 0;
  while (p && hops++ < 6) {
    let txt = null;
    for (const root of [...ROOTS[faction], VAN]) { const fp = join(root, p); if (existsSync(fp)) { txt = readFileSync(fp, "utf8"); break; } }
    if (!txt) return { name, slots, missing: name === null || slots === null ? p : null }; // a missing *_Base ancestor only matters if it left something unresolved
    if (name === null) { const ui = txt.indexOf("m_UIInfo "); if (ui >= 0) { const m = txt.slice(ui, ui + 600).match(/\n\s*Name "([^"]*)"/); if (m) name = m[1]; } }
    if (slots === null) { const m = txt.match(/m_aUnitPrefabSlots \{([\s\S]*?)\n\s*\}/); if (m) slots = (m[1].match(/\{[0-9A-F]{16}\}/g) ?? []).length; }
    p = txt.match(/^\s*\w+\s*:\s*"\{[0-9A-F]{16}\}([^"]+)"/)?.[1] ?? null;
  }
  return { name, slots };
}

const groups = [];
for (const [fk, F] of Object.entries(FACTIONS)) {
  if (fk === "US_DESERT" || F.playableOnly) continue;
  for (const [setKey, set] of Object.entries(F.groupSets ?? {})) {
    const refs = new Map(); // ref → classes
    const add = (r, c) => { if (!r) return; if (!refs.has(r)) refs.set(r, new Set()); refs.get(r).add(c); };
    for (const r of set.small ?? []) add(r, "small");
    for (const r of set.medium ?? []) add(r, "medium");
    for (const r of set.large ?? []) add(r, "large");
    add(set.sentry, "sentry"); add(set.defense?.ref, "defense");
    const byStem = new Map();
    for (const [ref, classes] of refs) {
      const stem = groupStem(ref);
      const k = stem.toLowerCase();
      if (!byStem.has(k)) byStem.set(k, { faction: fk, setKey, setLabel: set.label ?? setKey, stem, variants: [] });
      const facts = groupFacts(ref, fk);
      let gameName = facts.name, gameNameRu = null;
      if (gameName?.startsWith("#")) { const key = gameName.slice(1); gameName = resolveKey(key, fk, "en_us") ?? gameName; gameNameRu = resolveKey(key, fk, "ru_ru") ?? null; if (gameNameRu === gameName) gameNameRu = null; }
      byStem.get(k).variants.push({ file: basename(ref.replace(/^\{[0-9A-F]{16}\}/, "")), ref, classes: [...classes], gameName, gameNameRu, slots: facts.slots, missing: facts.missing ?? null });
    }
    // A "<Group>2" twin with a DIFFERENT slot count is not a variant (CDF RifleSquad 9 vs RifleSquad2 "Infantry Group" 6) → its own entry
    for (const g of [...byStem.values()]) {
      const main = g.variants.find((v) => !/\d\.et$/.test(v.file)) ?? g.variants[0];
      for (const v of g.variants.filter((v) => v !== main && v.slots !== main.slots)) {
        g.variants = g.variants.filter((x) => x !== v);
        byStem.set(v.file, { ...g, stem: basename(v.file, ".et").replace(GROUP_PREFIX, ""), variants: [v], splitFrom: g.stem });
      }
    }
    for (const g of byStem.values()) {
      const ov = GROUP_OVERRIDES[fk]?.[g.stem];
      const hit = ov ? null : GROUP_LABELS.find(([re]) => re.test(g.stem));
      const gn = g.variants[0].gameName, gnRu = g.variants[0].gameNameRu;
      if (g.splitFrom) { g.label = gn ?? g.stem; g.labelRu = gnRu; g.labelSource = `game name (size differs from ${g.splitFrom})`; }
      else if (ov) { g.label = ov[0]; g.labelRu = ov[1]; g.labelSource = "override"; }
      else { g.label = hit ? hit[1] : gn ?? g.stem; g.labelRu = hit ? (hit[1] === gn && gnRu ? gnRu : hit[2]) : gnRu; g.labelSource = hit ? "stem" : "game name"; }
      g.size = g.variants[0].slots;
      groups.push(g);
    }
  }
}

// --- output ---------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const md = [];
md.push(`# Roster labels — roles and groups per enemy-capable faction`, ``,
  `Generated ${today} by \`node generator/tools/label-roster.mjs\` from \`input/characters-harvest.json\` + the registry's \`groupSets\` (regenerate, don't hand-edit; tweak the label dictionaries in the script). JSON twin: \`input/roster-labels.json\`.`, ``,
  `**Roles** = character prefabs collapsed per subfaction on their role STEM (basename minus the faction prefix and the \`_2\`/\`3\`/\`_Variant_1\` suffix); the emission script picks one variant at random. Labels come from a stem dictionary shared by all factions (so RHS "Rifleman"-named M249 gunners still read Automatic Rifleman); stems the dictionary doesn't know keep the game's own name ("game name" in the Source column). Unarmed shells, non-shipping prefabs and GUID-less prefabs are excluded (listed at the end). \`Guard/\` and FIA \`Special Units/\` prefabs fold into the parent subfaction's role of the same stem. Subfactions with no registry group set are marked — roles there are placeable, but no groups exist for them yet.`, ``,
  `**Groups** = every ref in the registry's \`groupSets\`, collapsed the same way (CDF RifleSquad + RifleSquad2). Columns show the proposed label, the game's own name and the unit-slot count so the label can be judged. Size classes: small/medium/large per the 1.8 count rule, plus the set's sentry/defense picks.`, ``);

md.push(`## Roles`, ``);
const byFac = new Map();
for (const r of roles) (byFac.get(r.faction) ?? byFac.set(r.faction, []).get(r.faction)).push(r);
for (const [fk, list] of byFac) {
  const F = FACTIONS[fk];
  md.push(`### ${fk} — ${F?.label ?? fk} (${list.length} roles, ${list.reduce((a, r) => a + r.variants.length, 0)} prefabs)`, ``);
  const bySub = new Map();
  for (const r of list) (bySub.get(r.subfaction) ?? bySub.set(r.subfaction, []).get(r.subfaction)).push(r);
  for (const [sub, rs] of bySub) {
    const setNote = rs[0].setKey ? `registry set \`${rs[0].setKey}\`` : "**no registry group set**";
    md.push(`#### ${sub} (${setNote}, ${rs.length} roles)`, ``, `| Label | RU | Stems | Game name(s) | Variants | Weapons (distinct kits) | Source |`, `|---|---|---|---|---|---|---|`);
    for (const r of rs.sort((a, b) => a.label.localeCompare(b.label))) {
      const w = [...new Set(r.variants.map((v) => v.weapons.join(" + ")))];
      md.push(`| **${r.label}** | ${r.labelRu ?? ""} | ${r.stems.map((s) => `\`${s}\``).join(", ")} | ${r.gameNames.join(" / ")} | ${r.variants.length}: ${r.variants.map((v) => `\`${basename(v.file, ".et")}\`${v.foldedFrom ? ` (${v.foldedFrom})` : ""}`).join(", ")} | ${w.join("<br>")} | ${r.labelSource} |`);
    }
    md.push(``);
  }
}
md.push(`### Excluded prefabs (${excludedRows.length})`, ``, `| Faction | Prefab | Reason |`, `|---|---|---|`);
for (const e of excludedRows) md.push(`| ${e.faction} | \`${e.file}\` | ${e.reason} |`);
md.push(``);

md.push(`## Groups`, ``);
const gByFac = new Map();
for (const g of groups) (gByFac.get(g.faction) ?? gByFac.set(g.faction, []).get(g.faction)).push(g);
for (const [fk, list] of gByFac) {
  md.push(`### ${fk} — ${FACTIONS[fk]?.label ?? fk} (${list.length} groups)`, ``);
  const bySet = new Map();
  for (const g of list) (bySet.get(g.setKey) ?? bySet.set(g.setKey, []).get(g.setKey)).push(g);
  for (const [setKey, gs] of bySet) {
    md.push(`#### ${gs[0].setLabel} (\`${setKey}\`, ${gs.length} groups)`, ``, `| Label | RU | Size | Classes | Game name | Prefab(s) | Source |`, `|---|---|---|---|---|---|---|`);
    for (const g of gs.sort((a, b) => (b.size ?? 0) - (a.size ?? 0) || a.label.localeCompare(b.label))) {
      const classes = [...new Set(g.variants.flatMap((v) => v.classes))].join(", ");
      const names = [...new Set(g.variants.map((v) => v.gameName ?? "—"))].join(" / ");
      const sizes = [...new Set(g.variants.map((v) => v.slots))].join("/");
      md.push(`| **${g.label}** | ${g.labelRu ?? ""} | ${sizes} | ${classes} | ${names} | ${g.variants.map((v) => `\`${basename(v.file, ".et")}\`${v.missing ? " (chain break)" : ""}`).join(", ")} | ${g.labelSource} |`);
    }
    md.push(``);
  }
}
writeFileSync(join(REPO, "input", "roster-labels.md"), md.join("\n"));
writeFileSync(join(REPO, "input", "roster-labels.json"), JSON.stringify({ generated: today, roles, groups, excluded: excludedRows }, null, 1));
console.error(`roles: ${roles.length} (${roles.filter((r) => r.labelSource === "game name").length} from game names, ${roles.filter((r) => r.collision).length} collisions), groups: ${groups.length}; excluded prefabs: ${excludedRows.length}`);
console.error(`wrote input/roster-labels.md + .json`);
