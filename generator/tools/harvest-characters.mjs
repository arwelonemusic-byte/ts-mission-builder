// Harvest INDIVIDUAL character prefabs for every enemy-capable Builder faction
// (vanilla US/USSR/FIA + the faction mods) from the unpacked extractions.
//
//   node generator/tools/harvest-characters.mjs            → input/characters-harvest.md + .json
//   node generator/tools/harvest-characters.mjs --only BWAR,UK
//
// Method (the project's harvest rules):
//  - Discovery is CATALOG-DRIVEN: `Configs/EntityCatalog/**/*Characters*.conf`
//    entries decide what the mod exposes. Prefabs under the faction's character
//    folder that NO catalog lists are reported separately as "uncataloged"
//    (SFS packs ship no character catalogs at all → everything is uncataloged
//    and GUIDs come from the mod's LoadoutManager override / group unit slots).
//  - GUID evidence follows the Arma II trust rule: prefab/layer refs (engine
//    written) outrank hand-maintained catalog confs. A catalog GUID that the
//    mod's own prefabs contradict is reported as a CONFLICT with the
//    prefab-side GUID preferred.
//  - `*Random*` / `*Randomized*` prefabs are variant wrappers over unarmed
//    bases (broken for individual spawns) → skipped by user rule; `*_Base` /
//    `*BaseLoadout*` parents are abstract → skipped.
//  - Names = the game's real names: prefab chain `m_UIInfo Name` (literal or
//    #KEY → mod string table first, vanilla fallback), RU when it differs.
//  - Weapons = CharacterWeaponSlotComponent templates merged down the chain
//    (nearest declaration per slot-instance GUID wins).
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, basename, extname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const REF = "D:/VSCode_dev/arma-reforger/reference";
const VAN = `${REF}/ReforgerData`;
const VAN_LANG = `${VAN}/Language/localization`;
const VANILLA_CACHE = join(REPO, "input", "addon-audit", "_vanilla-index.json.gz");

const cat = (root, ...p) => join(root, "Configs", "EntityCatalog", ...p);

// Every enemy-capable registry faction (US_DESERT is playableOnly → out).
const SOURCES = [
  { key: "US", label: "US Army (vanilla)", roots: [], catalogs: [cat(VAN, "US", "Characters_EntityCatalog_US.conf")], pathRe: /^Prefabs\/Characters\/Factions\/BLUFOR\/US_Army\//i, lang: [] },
  { key: "USSR", label: "Soviet Army (vanilla)", roots: [], catalogs: [cat(VAN, "USSR", "Characters_EntityCatalog_USSR.conf")], pathRe: /^Prefabs\/Characters\/Factions\/OPFOR\/USSR_Army\//i, lang: [] },
  { key: "FIA", label: "FIA (vanilla)", roots: [], catalogs: [cat(VAN, "FIA", "Characters_EntityCatalog_FIA.conf")], pathRe: /^Prefabs\/Characters\/Factions\/INDFOR\/FIA\//i, lang: [] },
  { key: "RHS_USAF", label: "RHS USAF (RHS Status Quo)", roots: [`${REF}/RHS Status Quo`], catalogs: [cat(`${REF}/RHS Status Quo`, "USMC", "USMC_Characters.conf")], pathRe: /^Prefabs\/Characters\/Factions\/BLUFOR\/RHS_USAF\//i, lang: [`${REF}/RHS Status Quo/Language/rhs_localization`] },
  { key: "RHS_AFRF", label: "RHS AFRF (RHS Status Quo)", roots: [`${REF}/RHS Status Quo`], catalogs: [cat(`${REF}/RHS Status Quo`, "RHS_MSV", "MSV_EMR_Characters.conf")], pathRe: /^Prefabs\/Characters\/Factions\/OPFOR\/RHS_AFRF\//i, lang: [`${REF}/RHS Status Quo/Language/rhs_localization`] },
  { key: "RHS_ION", label: "RHS ION (RHS Status Quo) — enemy-only", roots: [`${REF}/RHS Status Quo`], catalogs: [cat(`${REF}/RHS Status Quo`, "ION", "ION_Characters.conf")], pathRe: /^Prefabs\/Characters\/Factions\/INDFOR\/RHS_ION/i, lang: [`${REF}/RHS Status Quo/Language/rhs_localization`] },
  { key: "UK", label: "British Military (British Forces)", roots: [`${REF}/British Forces`], catalogs: [cat(`${REF}/British Forces`, "UK", "UK_Characters.conf")], pathRe: /^Prefabs\/Characters\/Factions\/BLUFOR\/UK_Army\//i, lang: [`${REF}/British Forces/Language/BritishForces_localization`, `${REF}/British Forces/Language/localization`] },
  { key: "MEI", label: "Middle East Insurgents — enemy-only", roots: [`${REF}/MiddleEastInsurgents`], catalogs: [cat(`${REF}/MiddleEastInsurgents`, "MEI", "Characters_EntityCatalog_MEI.conf"), cat(`${REF}/MiddleEastInsurgents`, "FIA", "Characters_EntityCatalog_MEI.conf")], pathRe: /^Prefabs\/Characters\/Factions\/IND\/MEI\//i, lang: [`${REF}/MiddleEastInsurgents/Language/mei_localization`] },
  { key: "PLASTICBANDIT", label: "Bandits (Bandit Faction) — enemy-only", roots: [`${REF}/Bandit Faction`, `${REF}/Bandit Gear`], catalogs: [cat(`${REF}/Bandit Faction`, "PLASTICBANDIT", "Characters_EntityCatalog_PLASTICBANDIT.conf")], pathRe: /^Prefabs\/Characters\/Factions\/PLASTICBANDIT\//i, lang: [] },
  { key: "SFS_US", label: "SFS US (Abrashka loadout pack, alias of US) — no catalogs", roots: [`${REF}/SFS US Loadout`], catalogs: [], pathRe: /^Prefabs\/Characters\/Factions\/BLUFOR\/US_Army\/Character_US_/i, lang: [`${REF}/RHS Status Quo/Language/rhs_localization`], modOnlySweep: true },
  { key: "SFS_USSR", label: "SFS RF (Abrashka loadout pack, alias of USSR) — no catalogs", roots: [`${REF}/SFS RF Loadout`], catalogs: [], pathRe: /^Prefabs\/Characters\/Factions\/OPFOR\/USSR_Army\/Character_/i, lang: [`${REF}/RHS Status Quo/Language/rhs_localization`], modOnlySweep: true },
  { key: "SFS_FIA", label: "SFS FIA (Abrashka loadout pack, alias of FIA) — no catalogs", roots: [`${REF}/SFS FIA Loadout`], catalogs: [], pathRe: /^Prefabs\/Characters\/Factions\/INDFOR\/FIA\/Character_/i, lang: [`${REF}/RHS Status Quo/Language/rhs_localization`], modOnlySweep: true },
  { key: "Ses_CDF", label: "CDF — Chernarussian Defence Forces (Arma II Factions)", roots: [`${REF}/Arma II Factions`], catalogs: [cat(`${REF}/Arma II Factions`, "Ses_CDF", "Ses_CDF_Characters.conf"), cat(`${REF}/Arma II Factions`, "US", "Characters_EntityCatalog_Ses_CDF.conf")], pathRe: /^Prefabs\/Characters\/Factions\/BLUFOR\/CDF_Army\//i, lang: [`${REF}/Arma II Factions/Language/SesFactionsLocalization`] },
  { key: "Ses_ChDKZ", label: "ChDKZ — Chedaki Insurgents (Arma II Factions)", roots: [`${REF}/Arma II Factions`], catalogs: [cat(`${REF}/Arma II Factions`, "ChDKZ", "ChDKZ_Characters.conf")], pathRe: /^Prefabs\/Characters\/Factions\/OPFOR\/ChDKZ\//i, lang: [`${REF}/Arma II Factions/Language/SesFactionsLocalization`] },
  { key: "Ses_NAPA", label: "NAPA — Chernarussian Guerrillas (Arma II Factions; its catalog lists vanilla USSR by mistake)", roots: [`${REF}/Arma II Factions`], catalogs: [cat(`${REF}/Arma II Factions`, "NAPA", "NAPA_Characters.conf")], pathRe: /^Prefabs\/Characters\/Factions\/INDFOR\/NAPA\//i, lang: [`${REF}/Arma II Factions/Language/SesFactionsLocalization`] },
  { key: "BWAR", label: "Bundeswehr (Bundeswehr Mod)", roots: [`${REF}/Bundeswehr Mod`], catalogs: [cat(`${REF}/Bundeswehr Mod`, "BWAR", "BWAR_Characters_EntityCatalog.conf")], pathRe: /^Prefabs\/Characters\/Factions\/BLUFOR\/Bundeswehr\//i, lang: [`${REF}/Bundeswehr Mod/Language/BWAR_Localization`] },
];

const SKIP_RANDOM = /random/i;
const SKIP_BASE = /(_Base|BaseLoadout|[a-z]Base)(_\w+)?\.et$/i; // Character_X_Base, X_BaseLoadout_3FT, RHS TacticaBase
const TEXT_EXT = new Set([".et", ".conf", ".layer", ".ent"]);
const REF_RE = /\{([0-9A-F]{16})\}([^"\s{}]*)/g;

// --- fs helpers ---------------------------------------------------------------
function* walk(root) {
  if (!existsSync(root)) return;
  for (const d of readdirSync(root, { withFileTypes: true })) {
    const p = join(root, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const rel = (root, p) => relative(root, p).split(sep).join("/");
const shortPath = (p) => p.replace(/^Prefabs\/Characters\/Factions\//i, "");
let onDiskAll = new Set(); // every .et under the current faction's Prefabs/Characters/Factions (incl. bases) — for renamed-ancestor relinks

// --- string tables (copied from harvest-arsenal-pool.mjs) ----------------------
function parseStringTable(path) {
  if (!existsSync(path)) return new Map();
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const ids = [], texts = [];
  let mode = "seek-ids", bucket = null, continuing = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (mode === "seek-ids") { if (line === "Ids {") { mode = "collect"; bucket = ids; } continue; }
    if (mode === "seek-texts") { if (line === "Texts {") { mode = "collect"; bucket = texts; } continue; }
    if (mode === "collect") {
      if (!continuing && line === "}") { mode = bucket === ids ? "seek-texts" : "done"; bucket = null; continue; }
      const hasCont = line.endsWith("\\");
      const body = hasCont ? line.slice(0, -1).trimEnd() : line;
      const first = body.indexOf('"'), last = body.lastIndexOf('"');
      const content = first !== -1 && last > first ? body.slice(first + 1, last) : body;
      if (continuing) bucket[bucket.length - 1] += "\n" + content; else bucket.push(content);
      continuing = hasCont;
    }
  }
  if (ids.length !== texts.length) { console.error(`string table ${path}: ids=${ids.length} texts=${texts.length}`); process.exit(1); }
  return new Map(ids.map((id, i) => [id, texts[i]]));
}
function mergeTables(maps) { const out = new Map(); for (const m of [...maps].reverse()) for (const [k, v] of m) out.set(k, v); return out; }
function makeResolver(table) {
  const lower = new Map(); for (const [k, v] of table) lower.set(k.toLowerCase(), v);
  const resolve = (key) => {
    const direct = table.get(key) ?? lower.get(key.toLowerCase());
    if (direct !== undefined) return direct;
    const sp = key.indexOf(" ");
    if (sp > 0) { const base = table.get(key.slice(0, sp)) ?? lower.get(key.slice(0, sp).toLowerCase()); if (base !== undefined) return base + key.slice(sp); }
    return undefined;
  };
  return (key) => {
    let text = resolve(key);
    for (let i = 0; text !== undefined && i < 3 && text.includes("#"); i++) text = text.replace(/#([A-Za-z0-9_-]+)/g, (m, k) => resolve(k) ?? m);
    return text;
  };
}
const tableCache = new Map();
function tablesFor(bases, locale) {
  return mergeTables([...bases, VAN_LANG].map((b) => {
    const p = `${b}.${locale}.conf`;
    if (!tableCache.has(p)) tableCache.set(p, parseStringTable(p));
    return tableCache.get(p);
  }));
}

// --- GUID evidence index per mod root -----------------------------------------
// byPath: lowercased path → Map<guid, Set<kind>>  (kind: prefab | layer | catalog)
const indexCache = new Map();
const guidIndexCache = new Map(); // root → Map<guid, Set<path>>
function indexRoot(root) {
  if (indexCache.has(root)) return indexCache.get(root);
  const byPath = new Map(), byGuid = new Map();
  guidIndexCache.set(root, byGuid);
  for (const p of walk(root)) {
    const ext = extname(p).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    const kind = ext === ".et" ? "prefab" : ext === ".conf" ? "catalog" : "layer";
    const txt = readFileSync(p, "utf8");
    for (const m of txt.matchAll(REF_RE)) {
      if (!m[2]) continue;
      const lp = m[2].toLowerCase();
      if (!byPath.has(lp)) byPath.set(lp, new Map());
      const g = byPath.get(lp);
      if (!g.has(m[1])) g.set(m[1], new Set());
      g.get(m[1]).add(kind);
      if (!byGuid.has(m[1])) byGuid.set(m[1], new Set());
      byGuid.get(m[1]).add(m[2]);
    }
  }
  indexCache.set(root, byPath);
  return byPath;
}
let vanillaByPath = null;
function vanillaGuidAt(path) {
  if (!vanillaByPath) {
    if (!existsSync(VANILLA_CACHE)) { console.error("missing input/addon-audit/_vanilla-index.json.gz — run the addon-audit tool once (any `check`) to build it"); process.exit(1); }
    vanillaByPath = new Map(Object.entries(JSON.parse(gunzipSync(readFileSync(VANILLA_CACHE)).toString("utf8")).byPath));
  }
  return vanillaByPath.get(path.toLowerCase()) ?? null;
}

/** Evidence for a prefab path: {guid, kind, alt[]} — strongest evidence wins,
 * mod roots before vanilla; a catalog-only GUID contradicted by prefab refs is a conflict. */
function evidenceFor(path, roots) {
  const cands = new Map(); // guid → best kind rank (2 prefab, 1 layer, 0 catalog)
  for (const root of roots) {
    const g = indexRoot(root).get(path.toLowerCase());
    if (!g) continue;
    for (const [guid, kinds] of g) {
      const rank = kinds.has("prefab") ? 2 : kinds.has("layer") ? 1 : 0;
      cands.set(guid, Math.max(cands.get(guid) ?? -1, rank));
    }
  }
  if (!cands.size) {
    const v = vanillaGuidAt(path);
    return v ? { guid: v, kind: "vanilla", alt: [] } : { guid: null, kind: "none", alt: [] };
  }
  const sorted = [...cands.entries()].sort((a, b) => b[1] - a[1]);
  const [guid, rank] = sorted[0];
  return { guid, kind: ["catalog", "layer", "prefab"][rank], alt: sorted.slice(1).map(([g, r]) => ({ guid: g, kind: ["catalog", "layer", "prefab"][r] })) };
}

// --- catalogs -----------------------------------------------------------------
function parseCatalog(path) {
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const out = [];
  let cur = null, depth = 0, entryDepth = -1;
  for (const raw of lines) {
    const line = raw.trim();
    if (/^SCR_EntityCatalogEntry\b/.test(line)) { cur = { guid: null, path: null, enabled: true }; entryDepth = depth; }
    if (cur) {
      const m = line.match(/^m_sEntityPrefab "\{([0-9A-F]{16})\}([^"]+)"/);
      if (m) { cur.guid = m[1]; cur.path = m[2]; }
      if (/^m_bEnabled 0\b/.test(line) && depth === entryDepth + 1) cur.enabled = false;
    }
    depth += (line.match(/\{/g) ?? []).length; depth -= (line.match(/\}/g) ?? []).length;
    if (cur && depth <= entryDepth) { if (cur.path) out.push(cur); cur = null; entryDepth = -1; }
  }
  return out;
}

// --- prefab chain --------------------------------------------------------------
const prefabCache = new Map();
function readPrefab(path, roots) {
  const k = roots.join("|") + "::" + path.toLowerCase();
  if (prefabCache.has(k)) return prefabCache.get(k);
  let res = null;
  for (const root of [...roots, VAN]) {
    const p = join(root, path);
    if (existsSync(p)) { res = parsePrefab(readFileSync(p, "utf8"), root === VAN ? "vanilla" : basename(root)); break; }
  }
  prefabCache.set(k, res);
  return res;
}
function parsePrefab(txt, origin) {
  const head = txt.match(/^\s*(\w+)\s*:\s*"\{([0-9A-F]{16})\}([^"]+)"/);
  const parent = head?.[3] ?? null;
  const parentGuid = head?.[2] ?? null;
  let name = null;
  const ui = txt.indexOf("m_UIInfo ");
  if (ui >= 0) { const m = txt.slice(ui, ui + 600).match(/\n\s*Name "([^"]*)"/); if (m) name = m[1]; }
  const faction = txt.match(/\n\s*m_sFaction "([^"]*)"/)?.[1] ?? null;
  const image = txt.match(/\n\s*m_Image "\{[0-9A-F]{16}\}([^"]+)"/)?.[1] ?? null;
  const variant = /SCR_EditableEntityVariantData/.test(txt);
  const weapons = new Map(); // slot instance guid → {template, index}
  // Brace-balanced block scan: slots can nest an `AttachType InventoryStorageSlot {…}`
  // block before WeaponTemplate (Bundeswehr), so a lazy regex stops too early.
  for (const m of txt.matchAll(/CharacterWeaponSlotComponent "\{([0-9A-F]{16})\}" \{/g)) {
    let depth = 1, i = m.index + m[0].length, q = false;
    for (; i < txt.length && depth > 0; i++) {
      const ch = txt[i];
      if (ch === '"') q = !q;
      else if (!q && ch === "{") depth++;
      else if (!q && ch === "}") depth--;
    }
    const body = txt.slice(m.index + m[0].length, i);
    const t = body.match(/\n\s*WeaponTemplate "(?:\{[0-9A-F]{16}\})?([^"]*)"/);
    const idx = body.match(/WeaponSlotIndex (\d+)/);
    weapons.set(m[1], { template: t ? t[1] : undefined, index: idx ? +idx[1] : undefined });
  }
  // Weapons issued through the inventory (holstered pistols, spare launchers)
  // rather than a weapon slot — e.g. the Bundeswehr Officer's pistol.
  const invWeapons = new Set();
  for (const m of txt.matchAll(/PrefabsToSpawn \{([\s\S]*?)\n\s*\}/g)) { // GUID braces sit inside quotes — stop at the closing brace on its own line
    for (const w of m[1].matchAll(/Prefabs\/Weapons\/(Rifles|Handguns|MachineGuns|Launchers|SniperRifles|Snipers|SMGs?|Shotguns|Pistols)\/[^"]*\/([^"/]+)\.et/g)) invWeapons.add(w[2]);
  }
  return { parent, parentGuid, name, faction, image, variant, weapons, invWeapons, origin };
}
function resolveChain(path, roots) {
  const chain = [];
  let p = path;
  const relinked = [];
  for (let i = 0; p && i < 8; i++) {
    let pf = readPrefab(p, roots);
    if (!pf && chain.length) {
      // Parent path stale (UK: CC → Crew at the wrong folder; MEI: Rifle1 renamed) —
      // the engine resolves by GUID, so look the parent GUID up in the mod's refs.
      const pg = chain[chain.length - 1].parentGuid;
      for (const root of roots) {
        const paths = guidIndexCache.get(root)?.get(pg);
        if (!paths) continue;
        const hit = [...paths].find((q) => q.toLowerCase() !== p.toLowerCase() && readPrefab(q, roots));
        if (hit) { relinked.push(`${shortPath(p)} → ${shortPath(hit)}`); p = hit; pf = readPrefab(p, roots); break; }
      }
      if (!pf) {
        // Renamed faction folder (Bandits: BANDIT/Character_BANDIT_base → PLASTICBANDIT/
        // Character_PLASTICBANDIT_base): same suffix after the faction token, one match.
        const suf = basename(p).replace(/^Character_[^_]+/i, "").toLowerCase();
        const cands = suf.length > 4 ? [...onDiskAll].filter((q) => basename(q).replace(/^Character_[^_]+/i, "").toLowerCase() === suf) : [];
        if (cands.length === 1) { relinked.push(`${shortPath(p)} → ${shortPath(cands[0])} (renamed ancestor, matched by suffix)`); p = cands[0]; pf = readPrefab(p, roots); }
      }
    }
    if (!pf) { chain.push({ missing: p }); break; }
    chain.push({ path: p, ...pf });
    p = pf.parent;
  }
  const own = chain[0];
  let name = null, faction = null, image = null;
  const slots = new Map(), invWeapons = new Set();
  for (const c of chain) {
    if (c.missing) continue;
    if (name === null && c.name !== null) name = c.name;
    if (faction === null && c.faction !== null) faction = c.faction;
    if (image === null && c.image !== null) image = c.image;
    for (const w of c.invWeapons) invWeapons.add(w);
    for (const [g, w] of c.weapons) {
      const s = slots.get(g) ?? {};
      if (s.template === undefined && w.template !== undefined) s.template = w.template;
      if (s.index === undefined && w.index !== undefined) s.index = w.index;
      slots.set(g, s);
    }
  }
  const weapons = [...slots.values()].filter((s) => s.template).sort((a, b) => (a.index ?? 9) - (b.index ?? 9)).map((s) => basename(s.template, ".et"));
  const inv = [...invWeapons].filter((w) => !weapons.includes(w));
  return { name, faction, image, weapons, invWeapons: inv, variant: own?.variant ?? false, chainLen: chain.length, missingParent: chain.find((c) => c.missing)?.missing ?? null, ownFound: !own?.missing, relinked };
}

// --- main ---------------------------------------------------------------------
const only = (() => { const i = process.argv.indexOf("--only"); return i >= 0 ? new Set(process.argv[i + 1].split(",")) : null; })();
const result = [];
for (const src of SOURCES) {
  if (only && !only.has(src.key)) continue;
  const en = makeResolver(tablesFor(src.lang, "en_us"));
  const ru = makeResolver(tablesFor(src.lang, "ru_ru"));
  const roots = src.roots;
  const evRoots = roots.length ? roots : [VAN];

  // 1. catalog entries (filtered to the faction's folder)
  const cataloged = new Map(); // path → {guid, enabled, catalogs[]}
  const catalogOffFolder = [];
  for (const c of src.catalogs) {
    for (const e of parseCatalog(c)) {
      if (!src.pathRe.test(e.path)) { catalogOffFolder.push({ ...e, catalog: basename(c) }); continue; }
      const cur = cataloged.get(e.path) ?? { guids: new Set(), enabled: true, catalogs: [] };
      cur.guids.add(e.guid); cur.enabled = cur.enabled && e.enabled; cur.catalogs.push(basename(c));
      cataloged.set(e.path, cur);
    }
  }

  // 2. prefab sweep (mod roots, or vanilla for the vanilla factions)
  const sweepRoots = src.modOnlySweep || roots.length ? roots : [VAN];
  const onDisk = new Set();
  for (const root of sweepRoots) {
    const base = join(root, "Prefabs", "Characters", "Factions");
    for (const p of walk(base)) { if (extname(p) !== ".et") continue; const r = rel(root, p); if (src.pathRe.test(r)) onDisk.add(r); }
  }

  onDiskAll = onDisk;
  const all = new Set([...cataloged.keys(), ...onDisk]);
  const rows = [], skipped = { random: [], base: [], debug: [] };
  for (const path of [...all].sort()) {
    const bn = basename(path, ".et");
    if (SKIP_RANDOM.test(bn) || /\/Random(Soldiers)?\//i.test(path)) { skipped.random.push(path); continue; }
    if (SKIP_BASE.test(path)) { skipped.base.push(path); continue; }
    if (/\/(Debug|KS)\//i.test(path)) { skipped.debug.push(path); continue; } // RHS Debug/, vanilla campaign KS/
    const c = cataloged.get(path);
    const ev = evidenceFor(path, evRoots);
    const chain = resolveChain(path, roots);
    let guid = ev.guid, status;
    const notes = [];
    if (c) {
      const cg = [...c.guids];
      if (cg.length > 1) notes.push(`catalogs disagree: ${cg.map((g) => `{${g}}`).join(" / ")}`);
      if (ev.kind === "prefab" || ev.kind === "layer") {
        status = c.guids.has(ev.guid) ? "OK" : "CONFLICT";
        if (status === "CONFLICT") notes.push(`catalog {${cg[0]}} vs ${ev.kind}-side {${ev.guid}} — prefab-side preferred`);
      } else if (ev.kind === "vanilla") { status = "VANILLA"; if (!c.guids.has(ev.guid)) { status = "CONFLICT"; notes.push(`catalog {${cg[0]}} vs vanilla {${ev.guid}}`); } }
      else { status = "OK_CATALOG"; if (!guid) guid = cg[0]; }
      if (!c.enabled) notes.push("m_bEnabled 0 in catalog");
      if (!onDisk.has(path) && !src.modOnlySweep && roots.length && !existsSync(join(VAN, path))) notes.push("prefab file NOT in extraction");
    } else {
      status = guid ? (ev.kind === "vanilla" ? "UNCATALOGED_VANILLA" : `UNCATALOGED_${ev.kind.toUpperCase()}`) : "UNCATALOGED_NO_GUID";
    }
    const rawName = chain.name;
    let nameEn = null, nameRu = null;
    if (!chain.ownFound) {
      notes.length = 0;
      notes.push("CATALOGED BUT THE PREFAB DOES NOT SHIP — unusable (catalog GUID kept for the record)");
    } else {
      if (chain.missingParent) notes.push(`ancestor not in extraction: ${shortPath(chain.missingParent)} (inherited data past it invisible)`);
      for (const r of chain.relinked) notes.push(`stale parent path relinked: ${r}`);
      if (chain.variant) notes.push("carries VariantData");
      if (!chain.weapons.length && !chain.invWeapons.length) notes.push("UNARMED (no weapon in slots or inventory)");
      else if (!chain.weapons.length) notes.push("no weapon SLOT — armed via inventory only");
      if (rawName) {
        if (rawName.startsWith("#")) { nameEn = en(rawName.slice(1)) ?? null; nameRu = ru(rawName.slice(1)) ?? null; if (!nameEn) { nameEn = rawName; notes.push("name key unresolved"); } }
        else { nameEn = rawName; }
      } else notes.push("no m_UIInfo Name in chain");
    }
    if (nameRu === nameEn) nameRu = null;
    rows.push({ path, guid, status, evidence: ev.kind, alt: ev.alt, name: nameEn, nameRu, rawName, faction: chain.faction, weapons: chain.weapons, invWeapons: chain.invWeapons, image: chain.image, cataloged: !!c, enabled: c ? c.enabled : null, ships: chain.ownFound, notes });
  }
  // Cosmetic variants: "<Role>2"/"<Role>_2"/"<Role>3" siblings of a shipped <Role>
  const byBase = new Map(rows.map((r) => [basename(r.path, ".et").toLowerCase(), r]));
  for (const r of rows) {
    const m = basename(r.path, ".et").match(/^(.*?)(?:_Variant)?_?(\d)$/);
    if (m && byBase.has(m[1].toLowerCase()) && m[1].toLowerCase() !== basename(r.path, ".et").toLowerCase()) { r.variantOf = basename(byBase.get(m[1].toLowerCase()).path, ".et"); r.notes.unshift(`cosmetic variant of ${r.variantOf}`); }
  }
  result.push({ ...src, pathRe: src.pathRe.source, rows, skipped, catalogOffFolder });
  console.error(`${src.key}: ${rows.length} characters (${rows.filter((r) => r.cataloged).length} cataloged, ${rows.filter((r) => !r.cataloged).length} uncataloged), skipped ${skipped.random.length} random + ${skipped.base.length} base`);
}

// --- output -------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const md = [];
md.push(`# Individual character prefabs — every enemy-capable faction`, ``,
  `Harvested ${today} by \`node generator/tools/harvest-characters.mjs\` (regenerate, don't hand-edit). Machine-readable twin: \`input/characters-harvest.json\`.`, ``,
  `**Scope**: every registry faction that can be the enemy side (US_DESERT is \`playableOnly\` → excluded). Aliases (SFS packs) list their OWN character prefabs, not the base faction's.`, ``,
  `**Rules applied**: \`*Random*\`/\`*Randomized*\` wrappers skipped (user rule — they are variant tables over unarmed bases, broken for individual spawns); \`*_Base\`/\`*BaseLoadout*\` abstract parents skipped; discovery = character EntityCatalog confs + a sweep of the faction's \`Prefabs/Characters/Factions/<folder>\` (prefabs no catalog lists are marked UNCATALOGED); GUID evidence prefab > layer > catalog (Arma II trust rule), vanilla GUIDs from the addon-audit vanilla index.`, ``,
  `**Status legend**: OK = catalog GUID corroborated by the mod's own prefabs/layers · OK_CATALOG = catalog confs only (normal for leaf characters nothing else references) · VANILLA = base-game content · CONFLICT = catalog and prefab-side disagree (prefab-side GUID shown) · UNCATALOGED_PREFAB/LAYER/CATALOG = not in the faction's character catalog, GUID from a prefab / layer / other-conf ref (group unit slot, variant table, LoadoutManager entry, groups conf) · UNCATALOGED_VANILLA = vanilla prefab outside the catalogs · UNCATALOGED_NO_GUID = file ships but nothing references it (unrecoverable without a live Workbench .meta).`, ``,
  `**Weapons** = the chain's CharacterWeaponSlotComponent templates (slot 0 first) plus "(inv)" = weapon prefabs issued through InitialInventoryItems (holstered pistols, spare launchers); UNARMED = neither anywhere in the chain ("Unarmed" roles, MEI heli crew, the Bundeswehr Officer who carries P8 magazines but no P8).`, ``,
  `**Caveats found while harvesting** (all reproduced in the tables' Notes column):`,
  `- Arma II CDF: the catalog's SL GUID is really the Medic's and MG/SL are off by one → 3 CONFLICT rows, prefab-side GUIDs shown (the documented trust-rule case). CDF Sharpshooter and ChDKZ Rifleman2/3 are cataloged but the prefabs do NOT ship. NAPA's catalog lists vanilla USSR (copy-paste bug) → its whole roster is UNCATALOGED_PREFAB/LAYER, GUIDs from the Random variant tables + the mod's test world.`,
  `- Stale parent paths relinked by GUID (the engine resolves parents by GUID, so these work in-game): UK Crew Commanders / HeliCrew point at a wrong folder; MEI AT/AT2/Sapper parent a renamed \`Character_MEI_Rifle1\` (= Rifleman1); every Bandit leaf parents the old \`BANDIT/\` folder (author renamed the faction to PLASTICBANDIT — relinked by suffix).`,
  `- RHS: the cataloged rosters are the primary variants; the \`<Role>2\`/\`<Role>_3\` cosmetic twins (same name, different uniform/gear) are UNCATALOGED but carry prefab-side GUIDs from the Random wrappers' variant tables (164 USAF / 178 AFRF / 37 ION). ION has an EMPTY catalog → all 61 from variant tables. 8 RHS prefabs have no GUID source at all (FORECON PL/TL_Marksman/Unarmed, VKPO CC/Officer ×4, SOF Sniper).`,
  `- UK: Reservists are in the catalog (the Builder excludes them by design); 6 UK prefabs at the UK_Army root (Patrol_* set, 1983 SF Sniper/Spotter) have no GUID source; 1 catalog entry is \`m_bEnabled 0\`.`,
  `- Vanilla: campaign-only characters (\`US_Army/KS/*\`, \`Campaign/*\`) excluded; \`Character_USSR_AKOfficer\` has no GUID source. \`_Guard\` variants are uncataloged (referenced only from Guard group prefabs).`,
  `- SFS packs: alias factions with NO catalogs — every row is UNCATALOGED_PREFAB with the GUID from the pack's LoadoutManager override / group unit slots (matches \`input/sfs-harvest.md\` / \`sfs-rf-fia-harvest.md\`).`, ``);

md.push(`## Summary`, ``, `| Faction | Characters | Cataloged | Uncataloged | with GUID | Cosmetic variants | Unarmed | Conflicts | Skipped random | Skipped base |`, `|---|---|---|---|---|---|---|---|---|---|`);
for (const f of result) {
  const r = f.rows;
  md.push(`| ${f.key} | ${r.length} | ${r.filter((x) => x.cataloged).length} | ${r.filter((x) => !x.cataloged).length} | ${r.filter((x) => x.guid).length} | ${r.filter((x) => x.variantOf).length} | ${r.filter((x) => x.ships && !x.weapons.length && !x.invWeapons.length).length} | ${r.filter((x) => x.status === "CONFLICT").length} | ${f.skipped.random.length} | ${f.skipped.base.length} |`);
}
md.push(``);

for (const f of result) {
  md.push(`## ${f.key} — ${f.label}`, ``);
  // Longest common directory prefix of the faction's rows (Bandits split into Scav/ + Stalker/ under one folder)
  const dirs = f.rows.map((r) => dirname(r.path).split("/"));
  let common = dirs[0] ?? [];
  for (const d of dirs) { let i = 0; while (i < common.length && i < d.length && common[i] === d[i]) i++; common = common.slice(0, i); }
  const prefix = common.length ? common.join("/") + "/" : "Prefabs/Characters/Factions/";
  md.push(`Sources: ${f.catalogs.length ? f.catalogs.map((c) => `\`${rel(REF, c)}\``).join(", ") : "no character catalogs"}; sweep of ${f.roots.length ? f.roots.map((r) => `\`reference/${basename(r)}\``).join(" + ") : "`reference/ReforgerData`"} under \`${prefix}\`. Paths below are relative to that prefix.`, ``);
  if (f.catalogOffFolder.length) md.push(`Catalog entries OUTSIDE the faction folder (ignored): ${f.catalogOffFolder.length} — e.g. \`${f.catalogOffFolder[0].path}\` (${f.catalogOffFolder[0].catalog}).`, ``);
  const groups = new Map();
  for (const r of f.rows) { const sub = dirname(r.path.slice(prefix.length)); const k = sub === "." ? "(root)" : sub; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
  for (const [sub, rows] of groups) {
    md.push(`### ${sub} (${rows.length})`, ``, `| Name | RU | Prefab | GUID | Status | Weapons | Notes |`, `|---|---|---|---|---|---|---|`);
    for (const r of rows) {
      const file = r.path.slice(prefix.length).replace(/^.*\//, "");
      const weapons = [...r.weapons, ...(r.invWeapons ?? []).map((w) => `${w} (inv)`)];
      md.push(`| ${r.name ?? "—"} | ${r.nameRu ?? ""} | \`${file}\` | ${r.guid ? `\`{${r.guid}}\`` : "—"} | ${r.status} | ${weapons.join(", ") || "—"} | ${r.notes.join("; ")} |`);
    }
    md.push(``);
  }
  if (f.skipped.random.length) md.push(`Skipped random/randomized wrappers (${f.skipped.random.length}): ${f.skipped.random.map((p) => basename(p, ".et")).join(", ")}`, ``);
  if (f.skipped.base.length) md.push(`Skipped abstract parents (${f.skipped.base.length}): ${f.skipped.base.map((p) => basename(p, ".et")).join(", ")}`, ``);
}
writeFileSync(join(REPO, "input", "characters-harvest.md"), md.join("\n"));
writeFileSync(join(REPO, "input", "characters-harvest.json"), JSON.stringify(result.map((f) => ({ key: f.key, label: f.label, rows: f.rows.map((r) => ({ ...r, ref: r.guid ? `{${r.guid}}${r.path}` : null })), skipped: f.skipped })), null, 1));
console.error(`wrote input/characters-harvest.md + .json`);
