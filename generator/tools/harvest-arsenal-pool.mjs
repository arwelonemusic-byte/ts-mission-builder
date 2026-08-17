// Harvest arsenal item pools (Arsenal Builder browse lists) from unpacked game
// and mod data. Run manually after a re-extraction:
//   node generator/tools/harvest-arsenal-pool.mjs
//
// Per source: EntityCatalog .confs decide WHAT exists (catalog-driven rule —
// never folder-scan); display names resolve through the prefab .et inheritance
// chain (Name "#..." key, mod root first then vanilla) into the positional
// string tables (en + ru). The {GUID}path prefab ref is the item identity.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REF = "D:/VSCode_dev/arma-reforger/reference/ReforgerData";
const BF = "D:/VSCode_dev/arma-reforger/reference/British Forces";
const RHS = "D:/VSCode_dev/arma-reforger/reference/RHS Status Quo";

// Aircraft/vehicle pylon+ammo items (rocket pods, heli rockets, vehicle ammo
// boxes): the arsenal crate UI never displays them and they're useless as
// crate content — excluded from the pools entirely (user decision 2026-08-12).
const EXCLUDED_TYPES = new Set(["HELICOPTER", "VEHICLE"]);
// Individual dead entries: never displayed by the crate AND junk data (the
// RHS VKPO underwear layers' names resolve to the "Pick up" interaction verb).
const EXCLUDED_REFS = new Set([
  "{34B3B2E5CC452F8A}Prefabs/Characters/Uniforms/VKPO/Undershirt_Demiseason_VKPO.et",
  "{C4D2963435559DD6}Prefabs/Characters/Uniforms/VKPO/Undershirt_Summer_VKPO.et",
]);

// Hand-curated name fixes for author-data quirks (applied after resolution,
// BEFORE the same-name disambiguation — colliding overrides get the token
// suffix automatically). Keyed by full {GUID}path ref.
const NAME_OVERRIDES = {
  // BF points these prefabs' Name at a DESCRIPTION string ("Stops bleeding
  // when applied" / "Останавливает кровотечение при наложении")
  "{E67E7932C86FBB96}Prefabs/Items/Medicine/FieldDressing_UK_01.et": { name: "Bandage", nameRu: "Бинт" },
  "{06858A926A75DE90}Prefabs/Items/Medicine/FieldDressing_UK_Taped_01.et": { name: "Bandage", nameRu: "Бинт" },
  // RHS AK-74 RHS-magazine variants inherit a generic "Weapon" key
  "{6408F2C84AE5DBD0}Prefabs/Weapons/Rifles/AK74/Rifle_AK74_RHSMag.et": { name: "AK-74 (RHS Mag)", nameRu: "АК-74 (магазины RHS)" },
  "{6733EB7DB00E7067}Prefabs/Weapons/Rifles/AK74/Rifle_AK74N_RHSMag.et": { name: "AK-74N (RHS Mag)", nameRu: "АК-74Н (магазины RHS)" },
  // Prefab missing from every extraction (humanized fallback) — real in-game
  // name read from the crate tooltip during the AFRF clothing capture
  "{8266820FFDE17477}Prefabs/Characters/Handwear/Gloves_Wool_01/Gloves_Wool_01.et": { name: "Woolen gloves", nameRu: "Шерстяные перчатки" },
  // RHS points these prefabs' Name at UI action strings ("Attach: %1" /
  // "Change fire mode") — real names read from the crate tooltips during the
  // AFRF ammo capture (2026-08-16); RU follows the sibling-scope convention
  // ("Прицел 1П29" / "Прицел ПСО-1M2-1")
  "{C850A33226B8F9C1}Prefabs/Weapons/Attachments/Optics/Optic_PSO1/Optic_PSO1.et": { name: "PSO-1 Scope", nameRu: "Прицел ПСО-1" },
  "{1ABABE3551512B0A}Prefabs/Weapons/Attachments/Underbarrel/UGL_GP25.et": { name: "GP-25", nameRu: "ГП-25" },
  // Same quirk class, found during the ION capture (2026-08-17): real names
  // read from the crate tooltips. The two ION morale patches are literally
  // named "Patch" in-game — the same-name disambiguation appends their
  // basename tokens ("Patch (BlackStatic)" / "(ContrleTheNoise)").
  "{BD496EE1B40DC510}Prefabs/Weapons/Attachments/Optics/Optic_4x20/Optic_4x20.et": { name: "4×20 Carry Handle Scope", nameRu: "Прицел 4×20" },
  "{9B6B61BB3FE3DFB0}Prefabs/Items/Equipment/Radios/Radio_ANPRC77.et": { name: "AN/PRC-77 Radio" },
  "{DB41FC7E83B3EFDC}Prefabs/Items/Equipment/Patches/Patch_ION_BlackStatic.et": { name: "Patch" },
  "{711D0B97E5B0B285}Prefabs/Items/Equipment/Patches/Patch_ION_ContrleTheNoise.et": { name: "Patch" },
};

// Complete enums (scripts/Game/Components/Arsenal/SCR_EArsenalItem{Type,Mode}.c) —
// an unknown token means the parser drifted or the game added members: hard error.
const ITEM_TYPES = new Set([
  "RIFLE", "PISTOL", "LETHAL_THROWABLE", "ROCKET_LAUNCHER", "MACHINE_GUN", "HEAL",
  "BACKPACK", "SNIPER_RIFLE", "NON_LETHAL_THROWABLE", "HEADWEAR", "TORSO",
  "VEST_AND_WAIST", "LEGS", "FOOTWEAR", "RADIO_BACKPACK", "EQUIPMENT",
  "WEAPON_ATTACHMENT", "EXPLOSIVES", "HANDWEAR", "MORTARS", "HELICOPTER", "VEHICLE",
]);
const ITEM_MODES = new Set([
  "DEFAULT", "WEAPON", "WEAPON_VARIANTS", "AMMUNITION", "CONSUMABLE", "ATTACHMENT",
  "SUPPORT_STATION", "PYLON",
]);

// --- Sources -----------------------------------------------------------------
// catalogs: [conf path, faction tag][]. roots: prefab/name resolution order
// (own data first, vanilla fallback — mod prefabs inherit vanilla bases).
// normalizeCategory maps the source's m_sIdentifier labels onto the vanilla
// category set; return null to exclude the entry.
const ukArsenalDir = join(BF, "Configs", "EntityCatalog", "UK", "Arsenal Lists");
const SOURCES = [
  {
    key: "vanilla",
    outFile: "arsenal-pool.mjs",
    constName: "ARSENAL_POOL",
    header: "Full vanilla arsenal item pool (Arsenal Builder browse list).",
    roots: [REF],
    stringTables: [join(REF, "Language", "localization")],
    // FactionLess's single entry (personal belongings) is civilian kit.
    catalogs: ["US", "USSR", "FIA", "CIV", "FactionLess"].map((dir) => [
      join(REF, "Configs", "EntityCatalog", dir, `InventoryItems_EntityCatalog_${dir === "FactionLess" ? "Factionless" : dir}.conf`),
      dir === "FactionLess" ? "CIV" : dir,
    ]),
    normalizeCategory(cat) {
      if (cat.startsWith("Attachments (Not in arsenal")) return null; // cost-calc bookkeeping
      return cat === "Others" ? "Other" : cat;
    },
  },
  {
    key: "uk",
    outFile: "arsenal-pool-uk.mjs",
    constName: "ARSENAL_POOL_UK",
    header: "British Forces arsenal item pool (mod id \"uk\", faction UK).",
    roots: [BF, REF],
    stringTables: [join(BF, "Language", "BritishForces_localization"), join(REF, "Language", "localization")],
    // UK_Arsenal_*.conf are aggregators (no direct entries); *_Hidden.conf =
    // internal LAW80 mechanism parts. Era overlap (1983/1989/All) dedupes by ref.
    catalogs: readdirSync(ukArsenalDir)
      .filter((f) => f.endsWith(".conf") && !/^UK_Arsenal_/.test(f) && !/_Hidden\.conf$/.test(f))
      .sort()
      .map((f) => [join(ukArsenalDir, f), "UK"]),
    normalizeCategory(cat) {
      if (cat.startsWith("Attachments (Not in arsenal")) return null; // incl. the mod's "calulation" typo
      const base = cat.replace(/\s*-\s*(1983|1989|All).*$/, "").trim();
      const MAP = { Explosives: "Throwable and Explosives", Deployables: "DeployableParts", Others: "Other" };
      return MAP[base] ?? base;
    },
  },
  {
    // RHS is harvested per faction (AFRF -> USAF -> ION); each gets its own
    // pool file, merged under MODS id "rhs" in catalogue.mjs.
    key: "rhs-afrf",
    outFile: "arsenal-pool-rhs-afrf.mjs",
    constName: "ARSENAL_POOL_RHS_AFRF",
    header: "RHS AFRF arsenal item pool (mod id \"rhs\", faction RHS_AFRF).",
    roots: [RHS, REF],
    stringTables: [join(RHS, "Language", "rhs_localization"), join(REF, "Language", "localization")],
    catalogs: [[join(RHS, "Configs", "EntityCatalog", "RHS_MSV", "MSV_InventoryItems.conf"), "RHS_AFRF"]],
    normalizeCategory(cat) {
      if (cat.startsWith("Attachments (Not in arsenal")) return null;
      return cat === "Others" ? "Other" : cat;
    },
  },
  {
    key: "rhs-usaf",
    outFile: "arsenal-pool-rhs-usaf.mjs",
    constName: "ARSENAL_POOL_RHS_USAF",
    header: "RHS USAF arsenal item pool (mod id \"rhs\", faction RHS_USAF).",
    roots: [RHS, REF],
    stringTables: [join(RHS, "Language", "rhs_localization"), join(REF, "Language", "localization")],
    catalogs: [[join(RHS, "Configs", "EntityCatalog", "USMC", "USMC_InventoryItems.conf"), "RHS_USAF"]],
    normalizeCategory(cat) {
      if (cat.startsWith("Attachments (Not in arsenal")) return null;
      return cat === "Others" ? "Other" : cat;
    },
  },
  {
    key: "rhs-ion",
    outFile: "arsenal-pool-rhs-ion.mjs",
    constName: "ARSENAL_POOL_RHS_ION",
    header: "RHS ION arsenal item pool (mod id \"rhs\", faction RHS_ION).",
    roots: [RHS, REF],
    stringTables: [join(RHS, "Language", "rhs_localization"), join(REF, "Language", "localization")],
    catalogs: [[join(RHS, "Configs", "EntityCatalog", "ION", "ION_InventoryItems.conf"), "RHS_ION"]],
    normalizeCategory(cat) {
      if (cat.startsWith("Attachments (Not in arsenal")) return null;
      return cat === "Others" ? "Other" : cat;
    },
  },
];

// --- String tables -----------------------------------------------------------
// Positional two-array format: Ids { "AR-..." ... } Texts { "..." ... }, Nth id
// maps to Nth text. A line whose content ends with a trailing backslash
// continues the SAME entry on the next line — join before counting or the
// mapping silently shifts (~200 vanilla entries).
function parseStringTable(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const ids = [];
  const texts = [];
  let mode = "seek-ids";
  let bucket = null;
  let continuing = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (mode === "seek-ids") {
      if (line === "Ids {") { mode = "collect"; bucket = ids; }
      continue;
    }
    if (mode === "seek-texts") {
      if (line === "Texts {") { mode = "collect"; bucket = texts; }
      continue;
    }
    if (mode === "collect") {
      if (!continuing && line === "}") {
        mode = bucket === ids ? "seek-texts" : "done";
        bucket = null;
        continue;
      }
      const hasCont = line.endsWith("\\");
      const body = hasCont ? line.slice(0, -1).trimEnd() : line;
      const first = body.indexOf('"');
      const last = body.lastIndexOf('"');
      const content = first !== -1 && last > first ? body.slice(first + 1, last) : body;
      if (continuing) bucket[bucket.length - 1] += "\n" + content;
      else bucket.push(content);
      continuing = hasCont;
    }
  }
  if (ids.length === 0 || ids.length !== texts.length) {
    console.error(`string table ${path}: ids=${ids.length} texts=${texts.length} — refusing to continue`);
    process.exit(1);
  }
  return new Map(ids.map((id, i) => [id, texts[i]]));
}

/** Merge tables: earlier paths win (mod table before vanilla fallback). */
function mergeTables(maps) {
  const out = new Map();
  for (const m of maps.reverse()) for (const [k, v] of m) out.set(k, v);
  return out;
}

/** Key lookup with the engine's leniencies (both RHS-observed): keys match
 * case-insensitively ("glock17" vs "Glock17"), and a Name can be a HYBRID of
 * key + literal suffix ("#RHS-Weapon_AK74M_Name (B10M/B19)") — the key part
 * resolves, the remainder is appended verbatim. */
function makeResolver(table) {
  const lower = new Map();
  for (const [k, v] of table) lower.set(k.toLowerCase(), v);
  const resolve = (key) => {
    const direct = table.get(key) ?? lower.get(key.toLowerCase());
    if (direct !== undefined) return direct;
    const sp = key.indexOf(" ");
    if (sp > 0) {
      const base = table.get(key.slice(0, sp)) ?? lower.get(key.slice(0, sp).toLowerCase());
      if (base !== undefined) return base + key.slice(sp);
    }
    return undefined;
  };
  // Resolved texts can EMBED further "#KEY" tokens (RHS balaclava colors:
  // "Balaclava - #RHS-Color_OLIVE") — the engine resolves those recursively.
  return (key) => {
    let text = resolve(key);
    for (let i = 0; text !== undefined && i < 3 && text.includes("#"); i++) {
      text = text.replace(/#([A-Za-z0-9_-]+)/g, (m, k) => resolve(k) ?? m);
    }
    return text;
  };
}

// --- Catalog parse -----------------------------------------------------------
function parseCatalog(path, faction) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const entries = [];
  let category = "";
  let cur = null;
  const flush = () => {
    if (cur && cur.ref) entries.push(cur);
    cur = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^m_sIdentifier "([^"]+)"$/))) {
      flush();
      category = m[1];
      continue;
    }
    if (line.startsWith("SCR_EntityCatalogInventoryItem ")) {
      flush();
      // m_eItemType omitted = engine default RIFLE; m_eItemMode omitted = engine
      // DEFAULT, serialized "" (emission omits the line, matching catalogue.mjs).
      cur = { ref: "", faction, category, type: "RIFLE", mode: "", enabled: true };
      continue;
    }
    if (!cur) continue;
    if ((m = line.match(/^m_sEntityPrefab "(\{[A-F0-9]+\}[^"]+)"$/))) cur.ref = m[1];
    else if ((m = line.match(/^m_bEnabled (\d)$/))) cur.enabled = m[1] !== "0";
    else if ((m = line.match(/^m_eItemType (\w+)$/))) {
      if (!ITEM_TYPES.has(m[1])) { console.error(`${path}: unknown item type ${m[1]}`); process.exit(1); }
      cur.type = m[1];
    } else if ((m = line.match(/^m_eItemMode (\w+)$/))) {
      if (!ITEM_MODES.has(m[1])) { console.error(`${path}: unknown item mode ${m[1]}`); process.exit(1); }
      cur.mode = m[1] === "DEFAULT" ? "" : m[1];
    }
  }
  flush();
  return entries;
}

// --- Prefab name resolution --------------------------------------------------
const basenameIndexes = new Map(); // root -> Map<basename, relPath[]> (lazy)
function findByBasename(refRoot, basename) {
  if (!basenameIndexes.has(refRoot)) {
    const idx = new Map();
    for (const rel of readdirSync(join(refRoot, "Prefabs"), { recursive: true })) {
      const p = String(rel).replace(/\\/g, "/");
      if (!p.endsWith(".et")) continue;
      const base = p.split("/").pop();
      if (!idx.has(base)) idx.set(base, []);
      idx.get(base).push("Prefabs/" + p);
    }
    basenameIndexes.set(refRoot, idx);
  }
  return basenameIndexes.get(refRoot).get(basename) ?? [];
}

/** Walk a prefab's inheritance chain (across roots) for the first Name "#..." key. */
function nameKeyForPrefab(roots, relPath, log, depth = 0) {
  if (depth > 4) return null;
  let path = null;
  for (const r of roots) {
    if (existsSync(join(r, relPath))) { path = join(r, relPath); break; }
  }
  if (!path) {
    for (const r of roots) {
      const hits = findByBasename(r, relPath.split("/").pop());
      if (hits.length === 1) {
        log.push(`${relPath}: stale path -> ${hits[0]}`);
        path = join(r, hits[0]);
        break;
      }
    }
    if (!path) {
      log.push(`${relPath}: missing from extraction (or ambiguous basename)`);
      return null;
    }
  }
  const text = readFileSync(path, "utf8");
  const name = text.match(/\bName "#([^"]+)"/);
  if (name) return { key: name[1] };
  // Mods sometimes write the display name as a LITERAL string instead of a
  // localization key (BF's 68 Pattern smock) — an own-file literal must beat
  // the parent chain, or the item inherits a wrong vanilla name.
  const literal = text.match(/ItemDisplayName [^\n]*\n\s*Name "([^"#][^"]*)"/);
  if (literal) return { literal: literal[1] };
  const parent = text.match(/^\w+ : "\{[A-F0-9]+\}([^"]+\.et)"/m);
  if (parent) return nameKeyForPrefab(roots, parent[1], log, depth + 1);
  return null;
}

function humanize(ref) {
  return ref.split("/").pop().replace(/\.et$/, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}
const prefabBasename = (ref) => ref.split("/").pop().replace(/\.et$/, "");

// --- Per-source harvest ------------------------------------------------------
function harvestSource(src) {
  console.log(`\n=== ${src.key} ===`);
  const en = mergeTables(src.stringTables.map((p) => parseStringTable(`${p}.en_us.conf`)));
  const ru = mergeTables(src.stringTables.map((p) => parseStringTable(`${p}.ru_ru.conf`)));
  const enText = makeResolver(en);
  const ruText = makeResolver(ru);
  console.log(`string tables: en ${en.size}, ru ${ru.size}`);

  const byRef = new Map();
  const stats = [];
  let disabled = 0, excludedCat = 0, excludedType = 0;
  const conflicts = [];
  for (const [path, faction] of src.catalogs) {
    const entries = parseCatalog(path, faction);
    let kept = 0;
    for (const e of entries) {
      if (!e.enabled) { disabled++; continue; }
      const cat = src.normalizeCategory(e.category);
      if (cat === null) { excludedCat++; continue; }
      if (EXCLUDED_TYPES.has(e.type)) { excludedType++; continue; }
      if (EXCLUDED_REFS.has(e.ref)) { excludedType++; continue; }
      kept++;
      const prev = byRef.get(e.ref);
      if (prev) {
        if (!prev.factions.includes(faction)) prev.factions.push(faction);
        if (prev.category !== cat || prev.type !== e.type || prev.mode !== e.mode)
          conflicts.push(`${e.ref}: ${prev.category}/${prev.type}/${prev.mode} vs ${cat}/${e.type}/${e.mode} — kept first`);
      } else {
        byRef.set(e.ref, { ref: e.ref, factions: [faction], category: cat, type: e.type, mode: e.mode });
      }
    }
    stats.push(`${path.split(/[\\/]/).pop()}=${kept}/${entries.length}`);
  }

  const pathLog = [];
  const nameFallbacks = [];
  for (const item of byRef.values()) {
    const relPath = item.ref.replace(/^\{[A-F0-9]+\}/, "");
    const res = nameKeyForPrefab(src.roots, relPath, pathLog);
    if (res?.literal) {
      // literal names have no localization — same text in every language
      item.name = res.literal.trim();
      continue;
    }
    const key = res?.key ?? null;
    const enName = key ? enText(key) : undefined;
    if (key === null || enName === undefined) {
      if (key !== null) pathLog.push(`${relPath}: key ${key} not in string tables`);
      nameFallbacks.push(relPath);
      item.name = humanize(item.ref);
    } else {
      // the game data itself carries trailing spaces on a few names
      item.name = enName.trim();
      const ruName = ruText(key)?.trim();
      if (ruName !== undefined && ruName !== item.name) item.nameRu = ruName;
    }
  }

  for (const [ref, over] of Object.entries(NAME_OVERRIDES)) {
    const item = byRef.get(ref);
    if (!item) continue;
    item.name = over.name;
    if (over.nameRu && over.nameRu !== over.name) item.nameRu = over.nameRu;
    else delete item.nameRu;
  }

  // Disambiguate same-name entries: BI/mod authors reuse one localization key
  // across a weapon's attachment configurations. Within each (name + faction-
  // set) group, append the basename tokens not common to the whole group.
  const RU_SUFFIX_TOKENS = { suppressor: "глушитель" };
  const nameGroups = new Map();
  for (const item of byRef.values()) {
    const k = `${item.name}|${item.factions.join(",")}`;
    if (!nameGroups.has(k)) nameGroups.set(k, []);
    nameGroups.get(k).push(item);
  }
  let suffixed = 0;
  for (const group of nameGroups.values()) {
    if (group.length < 2) continue;
    const tokenLists = group.map((i) => prefabBasename(i.ref).split("_"));
    const common = new Set(tokenLists[0].filter((t) => tokenLists.every((l) => l.includes(t))));
    for (let i = 0; i < group.length; i++) {
      const extra = tokenLists[i].filter((t) => !common.has(t));
      if (!extra.length) continue;
      const item = group[i];
      const ruExtra = extra.map((t) => RU_SUFFIX_TOKENS[t.toLowerCase()] ?? t);
      const baseRu = item.nameRu ?? item.name;
      item.name += ` (${extra.join(", ")})`;
      const ruName = `${baseRu} (${ruExtra.join(", ")})`;
      if (ruName !== item.name) item.nameRu = ruName;
      suffixed++;
    }
  }

  const items = [...byRef.values()];
  const lines = items.map((i) => {
    const ruField = i.nameRu !== undefined ? ` nameRu: ${JSON.stringify(i.nameRu)},` : "";
    return `  { ref: ${JSON.stringify(i.ref)}, name: ${JSON.stringify(i.name)},${ruField} factions: ${JSON.stringify(i.factions)}, category: ${JSON.stringify(i.category)}, type: ${JSON.stringify(i.type)}, mode: ${JSON.stringify(i.mode)} },`;
  });
  const outPath = join(root, "generator", src.outFile);
  writeFileSync(outPath, `// AUTO-GENERATED by tools/harvest-arsenal-pool.mjs — do not hand-edit.
// ${src.header} Names resolved through the prefab chain to the en_us/ru_ru
// string tables (nameRu omitted when identical to name).
// Regenerate: node generator/tools/harvest-arsenal-pool.mjs
export const ${src.constName} = [
${lines.join("\n")}
];
`, "utf8");

  const perCat = {};
  for (const i of items) perCat[i.category] = (perCat[i.category] ?? 0) + 1;
  console.log(`catalogs (kept/total): ${stats.join(", ")}`);
  console.log(`skipped: ${disabled} disabled, ${excludedCat} excluded-category, ${excludedType} heli/vehicle-type`);
  console.log(`pool: ${items.length} items after dedupe; ${suffixed} same-name entries got a variant suffix`);
  console.log("categories:", Object.entries(perCat).map(([c, n]) => `${c}=${n}`).join(", "));
  if (conflicts.length) console.warn("metadata conflicts:\n  " + conflicts.join("\n  "));
  if (pathLog.length) console.warn("path fixups / unresolved:\n  " + pathLog.join("\n  "));
  if (nameFallbacks.length) console.warn(`humanized-name fallbacks (${nameFallbacks.length}):\n  ` + nameFallbacks.join("\n  "));
  console.log(`wrote ${outPath}`);
}

for (const src of SOURCES) harvestSource(src);
