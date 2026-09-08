#!/usr/bin/env node
// Addon audit tool for TS Mission Builder — see ../SKILL.md for the workflow.
//
// Commands (run from the repo root):
//   node .claude/skills/addon-audit/scripts/audit.mjs list [--json] [--stale]
//   node .claude/skills/addon-audit/scripts/audit.mjs fingerprint <target> [--write] [--version V] [--title T]
//   node .claude/skills/addon-audit/scripts/audit.mjs rotate <target>
//   node .claude/skills/addon-audit/scripts/audit.mjs diff <target> [--prev <folder>] [--full]
//   node .claude/skills/addon-audit/scripts/audit.mjs check <target> [--unused]
//
// <target> = a 16-hex addon GUID, a registry id (mod id like "rhs", terrain
// key like "novka", "core") or "all". A registry id expands to every GUID in
// its audit set (AUDIT_SETS below).
//
// Baselines: input/addon-audit/<GUID>.json.gz — the fingerprint of the extraction
// the Builder was last audited/harvested against. `diff` compares the baseline
// (or a rotated `_prev` extraction) with the CURRENT extraction.

import { createHash } from "node:crypto";
import { gunzipSync, gzipSync } from "node:zlib";
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, rmdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { CORE_ADDONS, CORE_ARSENAL_POOL, MODS, MOD_ARSENAL_POOLS, TERRAINS, VEHICLE_MODS } from "../../../../generator/catalogue.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../../../..");
const BASELINE_DIR = join(REPO, "input", "addon-audit");
const GAME_ADDONS = join(process.env.USERPROFILE ?? "C:/Users/djdav", "Documents", "My Games", "ArmaReforger", "addons");
const REFERENCE = "D:/VSCode_dev/arma-reforger/reference";
const VANILLA = join(REFERENCE, "ReforgerData");
const PREV_DIR = join(REFERENCE, "_prev");

// ---------------------------------------------------------------------------
// Audit sets: which GUIDs each Builder registry entry is audited through.
// Default = the registry's `dependencies`. Overrides exist where the content
// the Builder references lives elsewhere (MEI: the anchor is the user's own
// voice addon, the harvested content is in the two mods it pulls) or where a
// companion addon must be re-checked by standing decision (BF Truck, Utility).
// ---------------------------------------------------------------------------
const AUDIT_SETS = {
  mei: {
    guids: ["64CEC8E005828E5D", "65E0AE1A83DA063A"],
    note: "anchor 0B6643C078688A29 (TS MEI Arabic Voices) is the user's own addon — not audited; 64CE… = MiddleEastInsurgents (harvest source), 65E0… = Russian to Arabic (voice pipeline)",
  },
  uk: {
    extra: ["66D74CE7E94C5D05"],
    note: "66D7… = British Forces: Truck, Utility — NOT a dependency; re-check it stays a pure duplicate of BF's Land Rover content (drop the exclusion if BF ever dedupes)",
  },
  bandits: {
    extra: ["66B523AD189F3233"],
    note: "66B5… = Bandit Gear (dep) — the characters' gear lives there",
  },
  core: {
    guids: ["60C4C12DAE90727B", "60C4CE4888FF4621"],
    // Script symbols the mission-header ACE settings block relies on
    // (lib.mjs emits m_ACE_Settings; ACE Core applies it in OnMissionSet).
    symbols: [
      "ACE_MissionHeaderSettings",
      "ACE_Medical_Core_Settings",
      "m_fBleedingRateScale",
      "m_fBloodRegenScale",
      "m_ACE_Medical_Core",
      "SetModSettings",
      "OnMissionSet",
    ],
    note: "ACE Medical (anchor) + ACE Core (transitive dep, owns the mission-header settings machinery)",
  },
};

const TEXT_EXT = new Set([".conf", ".et", ".layer", ".ent", ".c", ".gproj", ".st", ".meta"]);
const MAP_EXT = new Set([".ttile", ".terr", ".nmn", ".topo", ".ntile", ".smd"]);
// Per-file hashes are kept for text + map-data files and for map imagery; every
// other binary asset (textures, materials, models, sounds, nav tiles) is folded
// into a per-extension aggregate (count + combined hash) — keeps map baselines
// at a few hundred KB instead of tens of MB while still registering "materials
// changed" as a count.
// Map imagery = every .topo plus .edds whose BASENAME looks like a map picture
// (satellite/2dMap/minimap/GameMaster/GM_*). Tested on the basename only —
// a folder called "BritMapProject" (Faircroft) matched every texture once.
const IMAGERY_RE = /(topo|satell|2dmap|minimap|gamemaster|(^|[_\-])gm([_\-]|$))/i;
function isImagery(r, ext) { return ext === ".topo" || (ext === ".edds" && IMAGERY_RE.test(basename(r, ext))); }
function keepPerFile(r, ext) { return TEXT_EXT.has(ext) || MAP_EXT.has(ext) || isImagery(r, ext); }
const REF_RE = /"\{([0-9A-F]{16})\}([^"]*)"/g;

// ---------------------------------------------------------------------------
// Registry → audit entries
// ---------------------------------------------------------------------------
function registryEntries() {
  const entries = [];
  for (const [id, mod] of Object.entries(MODS)) {
    const set = AUDIT_SETS[id] ?? {};
    entries.push({
      id, kind: "faction", label: mod.label, workshopUrl: mod.workshopUrl, hidden: !!mod.hidden,
      guids: set.guids ?? [...mod.dependencies, ...(set.extra ?? [])], note: set.note,
      def: mod, pool: MOD_ARSENAL_POOLS[id] ?? [],
    });
  }
  for (const [id, mod] of Object.entries(VEHICLE_MODS)) {
    const set = AUDIT_SETS[id] ?? {};
    entries.push({
      id, kind: "vehicle", label: mod.label, workshopUrl: mod.workshopUrl, hidden: !!mod.hidden,
      guids: set.guids ?? [...mod.dependencies, ...(set.extra ?? [])], note: set.note, def: mod, pool: [],
    });
  }
  {
    const set = AUDIT_SETS.core;
    entries.push({
      id: "core", kind: "core", label: CORE_ADDONS.map((c) => c.label).join(" + "),
      workshopUrl: CORE_ADDONS[0]?.workshopUrl, guids: set.guids ?? CORE_ADDONS.map((c) => c.guid),
      note: set.note, symbols: set.symbols, def: { CORE_ADDONS }, pool: CORE_ARSENAL_POOL,
    });
  }
  for (const [key, t] of Object.entries(TERRAINS)) {
    if (!t.dependencies?.length) continue; // vanilla terrains ship with the game
    entries.push({ id: key, kind: "map", label: t.label, guids: [...t.dependencies], def: t, pool: [] });
  }
  return entries;
}

function resolveTargets(target) {
  const entries = registryEntries();
  if (!target || target === "all") return entries;
  if (/^[0-9A-Fa-f]{16}$/.test(target)) {
    const g = target.toUpperCase();
    const owner = entries.find((e) => e.guids.includes(g));
    return [owner ? { ...owner, guids: [g] } : { id: g, kind: "unknown", label: g, guids: [g], def: {}, pool: [] }];
  }
  const e = entries.find((x) => x.id === target);
  if (!e) die(`unknown target "${target}" — use a GUID, one of [${entries.map((x) => x.id).join(", ")}] or "all"`);
  return [e];
}

// ---------------------------------------------------------------------------
// On-disk addon (game folder) + extraction resolution
// ---------------------------------------------------------------------------
function addonDir(guid) {
  if (!existsSync(GAME_ADDONS)) return null;
  const hit = readdirSync(GAME_ADDONS).find((n) => n.toUpperCase().endsWith(`_${guid}`));
  return hit ? join(GAME_ADDONS, hit) : null;
}

function readMeta(dir) {
  try {
    const raw = readFileSync(join(dir, "meta"), "utf8").replace(/^\uFEFF/, "");
    const m = JSON.parse(raw).meta;
    return { name: m.name, version: m.versions?.[0]?.version ?? "", updatedAt: (m.updatedAt ?? "").slice(0, 10) };
  } catch { return null; }
}

function readTitle(dir) {
  try {
    const txt = readFileSync(join(dir, "addon.gproj"), "latin1");
    const m = txt.match(/TITLE\s+"([^"]*)"/);
    return m ? m[1] : null;
  } catch { return null; }
}

function readGprojDeps(dir) {
  try {
    const txt = readFileSync(join(dir, "addon.gproj"), "latin1");
    const m = txt.match(/Dependencies\s*\{([^}]*)\}/);
    if (!m) return [];
    return [...m[1].matchAll(/"([0-9A-F]{16})"/g)].map((x) => x[1]).filter((g) => g !== "58D0FB3206B6F859");
  } catch { return []; }
}

// Extraction folders were named from the gproj TITLE by hand — Windows forbids
// ":" so "RHS: Status Quo" became "RHS Status Quo" and "British Forces:
// Truck, Utility" became "British Forces - Truck, Utility". Match loosely.
function safeFolderName(title) { return title.replace(/[:*?"<>|\/]/g, "").replace(/\s+/g, " ").trim(); }
function normName(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, ""); }
function findFolder(root, title) {
  if (!existsSync(root)) return null;
  if (existsSync(join(root, title))) return title;
  const safe = safeFolderName(title);
  if (existsSync(join(root, safe))) return safe;
  const want = normName(title);
  const dirs = readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  return dirs.find((d) => normName(d) === want) ?? null;
}

function baselinePath(guid) { return join(BASELINE_DIR, `${guid}.json.gz`); }
function readBaseline(guid) {
  const p = baselinePath(guid);
  if (!existsSync(p)) return null;
  return JSON.parse(gunzipSync(readFileSync(p)).toString("utf8"));
}

function locate(guid, opts = {}) {
  const dir = addonDir(guid);
  const meta = dir ? readMeta(dir) : null;
  const baseline = readBaseline(guid);
  const gprojTitle = opts.title ?? (dir ? readTitle(dir) : null) ?? baseline?.gprojTitle ?? baseline?.title ?? null;
  const folder = gprojTitle ? findFolder(REFERENCE, gprojTitle) : null;
  const title = folder ?? (gprojTitle ? safeFolderName(gprojTitle) : null);
  const extraction = title ? join(REFERENCE, title) : null;
  const prevFolder = gprojTitle ? findFolder(PREV_DIR, gprojTitle) : null;
  return {
    guid, dir, meta, title, gprojTitle, baseline,
    gprojDeps: dir ? readGprojDeps(dir) : [],
    extraction: folder ? extraction : null,
    extractionExpected: extraction,
    prev: prevFolder ? join(PREV_DIR, prevFolder) : null,
  };
}

// ---------------------------------------------------------------------------
// Fingerprinting
// ---------------------------------------------------------------------------
function walk(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.isFile()) out.push(p);
    }
  }
  return out.sort();
}

function sha(buf) { return createHash("sha1").update(buf).digest("hex").slice(0, 16); }

function rel(root, p) { return relative(root, p).split(sep).join("/"); }

function fingerprintFolder(root) {
  const files = {};
  const counts = {};
  const aggregates = {}; // ext → { count, hash }
  const aggHashers = {};
  const pairs = new Set();
  const catalogs = {};
  const factionManagers = {};
  const layers = {};
  const worlds = {};
  const nav = {};
  let terrainTiles = 0;
  const terrainHash = createHash("sha1");
  for (const p of walk(root)) {
    const r = rel(root, p);
    const ext = extname(p).toLowerCase();
    counts[ext] = (counts[ext] ?? 0) + 1;
    const buf = readFileSync(p);
    const h = sha(buf);
    if (keepPerFile(r, ext)) files[r] = h;
    else { (aggHashers[ext] ??= createHash("sha1")).update(r).update(h); aggregates[ext] = { count: (aggregates[ext]?.count ?? 0) + 1, hash: null }; }
    if (ext === ".ttile" || ext === ".terr") { terrainTiles++; terrainHash.update(buf); }
    if (ext === ".nmn") nav[r] = { size: buf.length, hash: h };
    if (!TEXT_EXT.has(ext)) continue;
    const txt = buf.toString("utf8");
    const refsInFile = [];
    for (const m of txt.matchAll(REF_RE)) {
      if (m[2]) { pairs.add(`${m[1]} ${m[2]}`); refsInFile.push(`{${m[1]}}${m[2]}`); }
    }
    const lower = r.toLowerCase();
    if (ext === ".conf" && (lower.includes("configs/entitycatalog/") || lower.includes("configs/editor/placeableentities/") || lower.includes("arsenal"))) {
      // catalog-driven rule: these confs decide what content exists
      catalogs[r] = [...new Set(refsInFile)];
    }
    if (ext === ".et" && /factionmanager/i.test(basename(r))) {
      const members = [];
      for (const m of txt.matchAll(/SCR_Faction\s+"\{([0-9A-F]{16})\}"\s*:\s*"\{([0-9A-F]{16})\}([^"]*)"/g)) members.push({ member: m[1], conf: `{${m[2]}}${m[3]}` });
      for (const m of txt.matchAll(/SCR_Faction\s+"\{([0-9A-F]{16})\}"\s*\{/g)) if (!members.some((x) => x.member === m[1])) members.push({ member: m[1], conf: "(override of inherited member)" });
      factionManagers[r] = members;
    }
    if (ext === ".layer") {
      const entities = (txt.match(/^[A-Za-z_][A-Za-z0-9_]*(?:\s+[^\s:]+)?\s*:\s*"\{[0-9A-F]{16}\}/gm) ?? []).length;
      const managers = [];
      for (const tag of ["SCR_MapEntity", "SCR_AIWorld", "PerceptionManager", "RadioManager", "SCR_GameModeSFManager", "SCR_BaseGameMode"]) if (txt.includes(tag)) managers.push(tag);
      const navRefs = [...txt.matchAll(/NavmeshFile\s+"\{([0-9A-F]{16})\}([^"]*)"/g)].map((m) => `{${m[1]}}${m[2]}`);
      layers[r] = { entities, managers, navRefs };
    }
    if (ext === ".ent") {
      const parent = txt.match(/Parent\s+"\{([0-9A-F]{16})\}([^"]*)"/);
      worlds[r] = { parent: parent ? `{${parent[1]}}${parent[2]}` : null, lines: txt.split("\n").length };
    }
  }
  for (const [ext, hs] of Object.entries(aggHashers)) aggregates[ext].hash = hs.digest("hex").slice(0, 16);
  return {
    fileCount: Object.values(counts).reduce((a, b) => a + b, 0), counts, files, aggregates,
    pairs: [...pairs].sort(),
    catalogs, factionManagers, layers, worlds, nav,
    terrain: { tiles: terrainTiles, hash: terrainTiles ? terrainHash.digest("hex").slice(0, 16) : null },
  };
}

function buildFingerprint(loc, opts = {}) {
  const root = opts.dir ?? loc.extraction;
  if (!root) die(`no extraction for ${loc.guid} (${loc.title ?? "title unknown"}) — expected ${loc.extractionExpected ?? "?"}`);
  const fp = fingerprintFolder(root);
  const mtime = statSync(root).mtime.toISOString().slice(0, 10);
  // Without an explicit --version, trust the on-disk meta version only when the
  // extraction is at least as new as the on-disk copy (the game client
  // auto-updates addons behind our back).
  const autoVersion = loc.meta?.version && loc.meta.updatedAt && mtime >= loc.meta.updatedAt ? loc.meta.version : null;
  return {
    guid: loc.guid, title: loc.title ?? basename(root), gprojTitle: loc.gprojTitle ?? null, name: loc.meta?.name ?? loc.baseline?.name ?? null,
    version: opts.version ?? autoVersion,
    diskVersionAtFingerprint: loc.meta?.version ?? null,
    fingerprintedAt: new Date().toISOString().slice(0, 10),
    extractionMtime: mtime,
    extraction: root.split(sep).join("/"),
    gprojDeps: loc.gprojDeps,
    ...fp,
  };
}

// ---------------------------------------------------------------------------
// Diff
// ---------------------------------------------------------------------------
function setDiff(a, b) {
  const A = new Set(a), B = new Set(b);
  return { added: [...B].filter((x) => !A.has(x)), removed: [...A].filter((x) => !B.has(x)) };
}

function diffFingerprints(old, cur) {
  const files = { added: [], removed: [], changed: [] };
  for (const [f, h] of Object.entries(cur.files)) {
    if (!(f in old.files)) files.added.push(f);
    else if (old.files[f] !== h) files.changed.push(f);
  }
  for (const f of Object.keys(old.files)) if (!(f in cur.files)) files.removed.push(f);

  const pairs = setDiff(old.pairs, cur.pairs);
  const oldByPath = new Map(), oldByGuid = new Map(), curByPath = new Map(), curByGuid = new Map();
  for (const p of old.pairs) { const [g, ...rest] = p.split(" "); const path = rest.join(" "); oldByPath.set(path.toLowerCase(), g); oldByGuid.set(g, path); }
  for (const p of cur.pairs) { const [g, ...rest] = p.split(" "); const path = rest.join(" "); curByPath.set(path.toLowerCase(), g); curByGuid.set(g, path); }
  const regenerated = [], moved = [];
  for (const p of pairs.added) {
    const [g, ...rest] = p.split(" "); const path = rest.join(" ");
    const og = oldByPath.get(path.toLowerCase());
    if (og && og !== g) regenerated.push({ path, oldGuid: og, newGuid: g });
    const op = oldByGuid.get(g);
    if (op && op.toLowerCase() !== path.toLowerCase()) moved.push({ guid: g, oldPath: op, newPath: path });
  }
  const regenPaths = new Set(regenerated.map((r) => r.path.toLowerCase()));
  const movedGuids = new Set(moved.map((m) => m.guid));
  const newPairs = pairs.added.filter((p) => { const [g, ...rest] = p.split(" "); return !regenPaths.has(rest.join(" ").toLowerCase()) && !movedGuids.has(g); });
  const removedPairs = pairs.removed.filter((p) => { const [g, ...rest] = p.split(" "); return !regenPaths.has(rest.join(" ").toLowerCase()) && !movedGuids.has(g); });

  const catalogs = {};
  for (const f of new Set([...Object.keys(old.catalogs), ...Object.keys(cur.catalogs)])) {
    const d = setDiff(old.catalogs[f] ?? [], cur.catalogs[f] ?? []);
    if (d.added.length || d.removed.length) catalogs[f] = { ...d, status: !(f in old.catalogs) ? "NEW FILE" : !(f in cur.catalogs) ? "REMOVED FILE" : "changed" };
  }
  const factionManagers = {};
  for (const f of new Set([...Object.keys(old.factionManagers), ...Object.keys(cur.factionManagers)])) {
    const key = (m) => `${m.member} ${m.conf}`;
    const d = setDiff((old.factionManagers[f] ?? []).map(key), (cur.factionManagers[f] ?? []).map(key));
    if (d.added.length || d.removed.length) factionManagers[f] = d;
  }
  const layers = {};
  for (const f of new Set([...Object.keys(old.layers), ...Object.keys(cur.layers)])) {
    const o = old.layers[f], c = cur.layers[f];
    if (!o) { layers[f] = { status: "NEW", entities: c.entities, managers: c.managers }; continue; }
    if (!c) { layers[f] = { status: "REMOVED", entities: o.entities }; continue; }
    if (old.files[f] === cur.files[f]) continue;
    const managers = setDiff(o.managers, c.managers);
    const navRefs = setDiff(o.navRefs, c.navRefs);
    layers[f] = { status: "changed", entitiesBefore: o.entities, entitiesAfter: c.entities, managersAdded: managers.added, managersRemoved: managers.removed, navAdded: navRefs.added, navRemoved: navRefs.removed };
  }
  const worlds = {};
  for (const f of new Set([...Object.keys(old.worlds), ...Object.keys(cur.worlds)])) {
    const o = old.worlds[f], c = cur.worlds[f];
    if (!o || !c || old.files[f] !== cur.files[f] || o.parent !== c.parent) worlds[f] = { before: o ?? null, after: c ?? null };
  }
  const navChanged = Object.keys({ ...old.nav, ...cur.nav }).filter((f) => old.nav[f]?.hash !== cur.nav[f]?.hash);
  const aggregates = {};
  for (const ext of new Set([...Object.keys(old.aggregates ?? {}), ...Object.keys(cur.aggregates ?? {})])) {
    const o = old.aggregates?.[ext], c = cur.aggregates?.[ext];
    if (o?.hash !== c?.hash || o?.count !== c?.count) aggregates[ext] = { before: o?.count ?? 0, after: c?.count ?? 0 };
  }
  return {
    aggregates,
    files, regenerated, moved, newPairs, removedPairs, catalogs, factionManagers, layers, worlds, navChanged,
    terrainChanged: old.terrain.hash !== cur.terrain.hash, terrainTiles: [old.terrain.tiles, cur.terrain.tiles],
  };
}

function groupByExt(list) {
  const g = {};
  for (const f of list) { const e = extname(f).toLowerCase() || "(none)"; (g[e] ??= []).push(f); }
  return g;
}

function printList(title, list, cap) {
  if (!list.length) return;
  console.log(`  ${title} (${list.length}):`);
  for (const x of list.slice(0, cap)) console.log(`    ${typeof x === "string" ? x : JSON.stringify(x)}`);
  if (list.length > cap) console.log(`    … ${list.length - cap} more (use --full)`);
}

function printDiff(loc, old, cur, d, full, kind) {
  const cap = full ? Infinity : 40;
  console.log(`\n=== DIFF ${loc.guid} ${cur.title}  (${old.version ?? "baseline version unknown"} [${old.fingerprintedAt}] → disk ${loc.meta?.version ?? "?"} [${loc.meta?.updatedAt ?? "?"}])`);
  console.log(`files: ${old.fileCount} → ${cur.fileCount}  added ${d.files.added.length} / removed ${d.files.removed.length} / changed ${d.files.changed.length}`);
  for (const [name, list] of Object.entries(d.files)) {
    if (!list.length) continue;
    const byExt = groupByExt(list);
    console.log(`  ${name}: ` + Object.entries(byExt).map(([e, l]) => `${e} ×${l.length}`).join(", "));
    const interesting = list.filter((f) => { const e = extname(f).toLowerCase(); return TEXT_EXT.has(e) || MAP_EXT.has(e); });
    printList(`${name} (audit-relevant files)`, interesting, cap);
  }
  if (Object.keys(d.aggregates).length) console.log("  other binary assets (per extension, count before → after; hashed in aggregate, not listed): " + Object.entries(d.aggregates).map(([e, a]) => `${e} ${a.before}→${a.after}`).join(", "));
  console.log("\n-- GUID ↔ path pairs (engine-written refs inside the mod's own confs/prefabs/layers)");
  printList("REGENERATED GUIDs (same path, new GUID — every Builder ref to these is now WRONG/stale)", d.regenerated, cap);
  printList("MOVED paths (same GUID, new path — Builder refs still resolve; update the path when touched)", d.moved, cap);
  printList("new pairs (new prefabs/configs/assets referenced somewhere)", d.newPairs, cap);
  printList("removed pairs (content no longer referenced anywhere)", d.removedPairs, cap);
  console.log("\n-- Catalog confs (EntityCatalog / PlaceableEntities / Arsenal lists) — the harvest sources");
  if (!Object.keys(d.catalogs).length) console.log("  (no catalog entry changes)");
  for (const [f, c] of Object.entries(d.catalogs)) {
    console.log(`  ${f} [${c.status}] +${c.added.length} / -${c.removed.length}`);
    printList("added", c.added, cap); printList("removed", c.removed, cap);
  }
  console.log("\n-- FactionManager overrides (faction member instance GUIDs = the Builder's entryGuid source)");
  if (!Object.keys(d.factionManagers).length) console.log("  (no member changes)");
  for (const [f, c] of Object.entries(d.factionManagers)) { console.log(`  ${f}`); printList("added members", c.added, cap); printList("removed members", c.removed, cap); }
  if (kind !== "map") {
    const catalogAdded = Object.values(d.catalogs).reduce((n, c) => n + c.added.length, 0);
    const catalogRemoved = Object.values(d.catalogs).reduce((n, c) => n + c.removed.length, 0);
    const fmChanged = Object.keys(d.factionManagers).length;
    const worldFiles = Object.keys(d.layers).length + Object.keys(d.worlds).length;
    if (worldFiles) console.log(`  (${worldFiles} world/layer files changed — a non-map addon's demo/showcase worlds; irrelevant unless a Builder ref points there)`);
    const breaks = d.regenerated.length + d.moved.length + fmChanged;
    let verdict;
    if (breaks) verdict = `BREAK CANDIDATES — ${d.regenerated.length} regenerated GUIDs, ${d.moved.length} moved paths, ${fmChanged} FactionManager files changed → run check and fix the registry before anything else`;
    else if (catalogAdded || catalogRemoved) verdict = `CONTENT CHANGED — catalog entries +${catalogAdded} / -${catalogRemoved} (new harvest candidates / removals) → run check, then triage with the SKILL.md checklist`;
    else if (d.newPairs.length + d.removedPairs.length) verdict = `NEW/REMOVED REFS without catalog changes (${d.newPairs.length} new, ${d.removedPairs.length} removed — assets/sounds/scripts, or prefabs not yet catalogued) → skim the lists, run check`;
    else if (d.files.changed.length + d.files.added.length + d.files.removed.length) verdict = "COSMETIC — files tweaked but no GUID/path, catalog or FactionManager changes → run check as a formality, then advance the baseline";
    else verdict = "NO CHANGE";
    console.log(`\n  VERDICT: ${verdict}`);
  }
  const mapish = kind === "map" && (cur.terrain.tiles || Object.keys(cur.layers).length || Object.keys(cur.nav).length);
  if (mapish) {
    console.log("\n-- Map signals");
    console.log(`  terrain (.terr/.ttile): ${d.terrainChanged ? "CHANGED" : "unchanged"} (${d.terrainTiles[0]} → ${d.terrainTiles[1]} files)  → ${d.terrainChanged ? "re-extract the heightmap and compare against web/public/heightmaps" : "heightmap stays valid"}`);
    console.log(`  navmesh (.nmn): ${d.navChanged.length ? "CHANGED " + d.navChanged.join(", ") : "unchanged"}`);
    const layerEntries = Object.entries(d.layers);
    let entityDelta = 0;
    for (const [, l] of layerEntries) { if (l.status === "changed") entityDelta += l.entitiesAfter - l.entitiesBefore; else if (l.status === "NEW") entityDelta += l.entities; else if (l.status === "REMOVED") entityDelta -= l.entities; }
    console.log(`  world layers: ${layerEntries.length} changed/new/removed, net entity delta ${entityDelta >= 0 ? "+" : ""}${entityDelta}`);
    for (const [f, l] of layerEntries.slice(0, cap)) {
      const extra = [];
      if (l.managersAdded?.length) extra.push(`managers +${l.managersAdded.join("/")}`);
      if (l.managersRemoved?.length) extra.push(`managers -${l.managersRemoved.join("/")}`);
      if (l.navAdded?.length || l.navRemoved?.length) extra.push(`nav refs changed`);
      console.log(`    ${f}: ${l.status}${l.status === "changed" ? ` entities ${l.entitiesBefore} → ${l.entitiesAfter}` : ` entities ${l.entities}`}${extra.length ? "  [" + extra.join(", ") + "]" : ""}`);
    }
    if (layerEntries.length > cap) console.log(`    … ${layerEntries.length - cap} more layers (use --full)`);
    for (const [f, w] of Object.entries(d.worlds)) console.log(`  world file ${f}: ${w.before ? (w.after ? "changed" : "REMOVED") : "NEW"}${w.before?.parent !== w.after?.parent ? ` parent ${w.before?.parent ?? "-"} → ${w.after?.parent ?? "-"}` : ""}`);
    const imagery = [...d.files.changed, ...d.files.added].filter((f) => /\.(topo|edds)$/i.test(f) && /map|topo|satellite|2dmap|minimap/i.test(f));
    if (imagery.length) printList("map imagery files (topo/satellite edds) changed — the in-game map picture moved", imagery, cap);
    const onlyCode = !d.terrainChanged && !d.navChanged.length && !layerEntries.length && !Object.keys(d.worlds).length && !imagery.length;
    console.log(`  VERDICT: ${onlyCode ? "code/config/prefab-only update — no tiles/heightmap work; run `check` for the TERRAINS refs" : d.terrainChanged || imagery.length || entityDelta !== 0 ? "WORLD CONTENT CHANGED — see SKILL.md map triage (tiles re-capture / heightmap re-extract decision)" : "world files touched but no terrain/entity-count/imagery change — likely cosmetic; spot-check the listed layers"}`);
  }
}

// ---------------------------------------------------------------------------
// Check — Builder refs vs the current extraction set
// ---------------------------------------------------------------------------
function collectBuilderRefs(entry) {
  const refs = new Map(); // "{G}path" → source label
  const bare = new Map(); // "G" → source label
  const scan = (obj, label) => {
    const s = JSON.stringify(obj);
    for (const m of s.matchAll(/\{([0-9A-F]{16})\}([^"\\]*)/g)) {
      if (m[2]) { if (!refs.has(`{${m[1]}}${m[2]}`)) refs.set(`{${m[1]}}${m[2]}`, label); }
      else if (!bare.has(m[1])) bare.set(m[1], label);
    }
  };
  if (entry.kind === "map") {
    const t = entry.def;
    refs.set(t.parent, "TERRAINS.parent");
    for (const n of t.nav ?? []) refs.set(n, "TERRAINS.nav");
    if (t.mapEntity) for (const [k, v] of Object.entries(t.mapEntity)) refs.set(v, `TERRAINS.mapEntity.${k}`);
  } else {
    scan(entry.def, `registry ${entry.id}`);
    scan(entry.pool, `arsenal pool ${entry.id}`);
  }
  return { refs, bare };
}

function sourceKind(ext) {
  if (ext === ".et") return "prefab";
  if (ext === ".layer" || ext === ".ent") return "layer";
  if (ext === ".conf") return "catalog";
  return "other";
}

// byPath: lowercased path → Map<guid, Set<sourceKind>>; byGuid: guid → Set<path>.
// A path can carry SEVERAL GUIDs when an author regenerated prefabs but left
// stale catalog confs behind (MEI 1.3.1) — engine-written prefab/layer refs
// outrank hand-maintained catalog confs (the Arma II trust rule).
function indexExtractions(roots) {
  const byPath = new Map(), byGuid = new Map(), fileSet = new Set();
  const texts = [];
  for (const root of roots) {
    for (const p of walk(root)) {
      const r = rel(root, p).toLowerCase();
      fileSet.add(r);
      const ext = extname(p).toLowerCase();
      if (!TEXT_EXT.has(ext)) continue;
      const txt = readFileSync(p, "utf8");
      texts.push({ root, r, txt });
      const kind = sourceKind(ext);
      for (const m of txt.matchAll(REF_RE)) {
        if (m[2]) {
          const lp = m[2].toLowerCase();
          if (!byPath.has(lp)) byPath.set(lp, new Map());
          const g = byPath.get(lp);
          if (!g.has(m[1])) g.set(m[1], new Set());
          g.get(m[1]).add(kind);
          if (!byGuid.has(m[1])) byGuid.set(m[1], new Set());
          byGuid.get(m[1]).add(m[2]);
        } else if (!byGuid.has(m[1])) byGuid.set(m[1], new Set());
      }
    }
  }
  return { byPath, byGuid, fileSet, texts };
}

function strength(kinds) { return kinds.has("prefab") ? 2 : kinds.has("layer") ? 1 : 0; }
const STRENGTH_NAME = ["catalog", "layer", "prefab"];

// Vanilla index (reference/ReforgerData): file set + {GUID}path pairs + every
// GUID seen (pair or bare instance). Mods reuse vanilla GUIDs constantly —
// callsign members, group prefabs referenced from mod worlds, "Workbench
// duplicate" prefabs at vanilla paths — so a GUID that is not the mod's own is
// not automatically a problem. Building it walks ~22k text files (~20 s), so
// it is cached at input/addon-audit/_vanilla-index.json.gz (gitignored,
// rebuilt when missing or with --rebuild-vanilla).
const VANILLA_CACHE = join(BASELINE_DIR, "_vanilla-index.json.gz");
let vanillaIndex = null;
function vanilla() {
  if (vanillaIndex) return vanillaIndex;
  if (!existsSync(VANILLA)) return (vanillaIndex = { files: new Set(), byPath: new Map(), guids: new Set() });
  if (existsSync(VANILLA_CACHE) && !process.argv.includes("--rebuild-vanilla")) {
    const j = JSON.parse(gunzipSync(readFileSync(VANILLA_CACHE)).toString("utf8"));
    return (vanillaIndex = { files: new Set(j.files), byPath: new Map(Object.entries(j.byPath)), guids: new Set(j.guids) });
  }
  console.error("(building the vanilla index from ReforgerData — one-off, cached afterwards)");
  const files = new Set(), byPath = new Map(), guids = new Set();
  for (const p of walk(VANILLA)) {
    const r = rel(VANILLA, p).toLowerCase();
    files.add(r);
    const ext = extname(p).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    for (const m of readFileSync(p, "utf8").matchAll(REF_RE)) {
      guids.add(m[1]);
      if (m[2] && !byPath.has(m[2].toLowerCase())) byPath.set(m[2].toLowerCase(), m[1]);
    }
  }
  mkdirSync(BASELINE_DIR, { recursive: true });
  writeFileSync(VANILLA_CACHE, gzipSync(Buffer.from(JSON.stringify({ files: [...files], byPath: Object.fromEntries(byPath), guids: [...guids] }))));
  return (vanillaIndex = { files, byPath, guids });
}
function vanillaHas(path) { return vanilla().files.has(path.toLowerCase()); }
function vanillaGuidAt(path) { return vanilla().byPath.get(path.toLowerCase()) ?? null; }
function vanillaKnowsGuid(guid) { return vanilla().guids.has(guid); }

// Which extraction folder (other than the audited ones) holds a path — for
// refs that point into a dependency mod outside the audit set.
function otherExtractionWith(path, roots) {
  const lower = path.toLowerCase();
  for (const d of readdirSync(REFERENCE, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith("_") || d.name === "ReforgerData") continue;
    const root = join(REFERENCE, d.name);
    if (roots.some((r) => resolve(r).toLowerCase() === resolve(root).toLowerCase())) continue;
    if (existsSync(join(root, path))) return d.name;
  }
  return null;
}

function checkEntry(entry, locs) {
  const roots = locs.map((l) => l.extraction).filter(Boolean);
  console.log(`\n=== CHECK ${entry.id} (${entry.kind}) — ${entry.label}`);
  for (const l of locs) console.log(`  ${l.guid} ${l.title ?? "?"}: ${l.extraction ? "extraction " + l.extraction : "NO EXTRACTION (" + (l.extractionExpected ?? "title unknown") + ")"}${l.meta ? `  disk v${l.meta.version}` : "  not in game addons dir"}`);
  if (!roots.length) { console.log("  nothing to check against"); return; }
  const idx = indexExtractions(roots);
  const { refs, bare } = collectBuilderRefs(entry);
  const tally = {};
  const bump = (s) => (tally[s] = (tally[s] ?? 0) + 1);
  const problems = [];
  for (const [ref, src] of refs) {
    const m = ref.match(/^\{([0-9A-F]{16})\}(.*)$/);
    const guid = m[1], path = m[2], lp = path.toLowerCase();
    const guidsAtPath = idx.byPath.get(lp) ?? new Map();
    const mine = guidsAtPath.get(guid);
    // A mod file at a VANILLA path (Workbench-duplicate style: SFS packs) makes
    // the vanilla GUID show up beside the mod's own — that alternate is never a
    // regeneration, so drop it from the comparison and only mention it.
    const vanillaG = vanillaGuidAt(path);
    const othersAll = [...guidsAtPath.entries()].filter(([g]) => g !== guid);
    const others = othersAll.filter(([g]) => g !== vanillaG).sort((a, b) => strength(b[1]) - strength(a[1]) || b[1].size - a[1].size);
    const fmt = (list) => list.map(([g, k]) => `{${g}}[${[...k].join("/")}]`).join(", ");
    const vanillaNote = vanillaG && othersAll.some(([g]) => g === vanillaG) ? ` (vanilla GUID {${vanillaG}} shares this path — mod-side duplicate, expected)` : "";
    let status, extra = "";
    if (mine) {
      const my = strength(mine), best = others.length ? strength(others[0][1]) : -1;
      if (best < 0) status = my === 0 ? "OK_CATALOG" : "OK";
      else if (my > best || (my === best && mine.size > others[0][1].size)) { status = my === 0 ? "OK_CATALOG" : "OK"; extra = `(weaker alternates at this path: ${fmt(others)})`; }
      else if (my === best) { status = "AMBIGUOUS"; extra = `equally-strong alternates: ${fmt(others)}`; }
      else { status = "REGENERATED"; extra = `stronger evidence for ${fmt(others.filter(([, k]) => strength(k) > my))} — the Builder GUID survives only in ${STRENGTH_NAME[my]} sources`; }
      extra += vanillaNote;
    } else if (others.length) {
      status = "REGENERATED"; extra = `NOW ${fmt(others.slice(0, 1))}${vanillaNote}`;
    } else if (guidsAtPath.size && guid === vanillaG) {
      status = "VANILLA"; extra = `(vanilla GUID; the mod ships its own {${othersAll[0][0]}} at this path — decide which one the Builder should hold)`;
    } else if (idx.byGuid.has(guid) && idx.byGuid.get(guid).size) {
      status = "MOVED"; extra = `NOW ${[...idx.byGuid.get(guid)][0]}`;
    } else if (idx.fileSet.has(lp)) status = "PATH_ONLY";
    else if (vanillaHas(path)) status = "VANILLA";
    else {
      const elsewhere = otherExtractionWith(path, roots);
      status = "NOT_FOUND"; extra = elsewhere ? `not in the audited extractions or vanilla — found in reference/${elsewhere} (dependency-mod content: audit that addon)` : "not in the audited extractions, vanilla, or any other extraction — dependency-mod content not extracted, or removed";
    }
    bump(status);
    if (!["OK", "VANILLA", "OK_CATALOG"].includes(status) || extra.startsWith("(weaker") || extra.startsWith("(vanilla GUID;")) problems.push({ status, ref, src, extra });
  }
  for (const [guid, src] of bare) {
    const status = idx.byGuid.has(guid) ? "OK" : vanillaKnowsGuid(guid) ? "VANILLA" : "MISSING";
    bump(`bare:${status}`);
    if (status === "MISSING") problems.push({ status: "BARE_GUID_MISSING", guid, src, extra: "instance GUID (entryGuid / callsign / squad member) found in neither the mod nor vanilla" });
  }
  if (!refs.size && !bare.size) console.log("  refs: none (alias/reskin entry — nothing but the addon GUID is referenced)");
  else console.log("  refs: " + Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(", "));
  console.log("    OK = pair corroborated by the mod's own prefabs/layers | OK_CATALOG = catalog confs only (normal for top-level prefabs nothing else references) | VANILLA = base-game content | AMBIGUOUS = equally-strong conflicting GUIDs at the path (Workbench decides) | REGENERATED = stronger evidence for a DIFFERENT GUID at the path | MOVED = GUID now at another path | PATH_ONLY = file exists, nothing references it | NOT_FOUND = neither path nor GUID anywhere; bare:* = instance GUIDs (entryGuid/callsigns/squads)");
  const order = { NOT_FOUND: 0, REGENERATED: 1, BARE_GUID_MISSING: 2, AMBIGUOUS: 3, MOVED: 4, PATH_ONLY: 5, VANILLA: 6, OK: 7 };
  problems.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  for (const p of problems) console.log(`    ${p.status.padEnd(12)} ${p.ref ?? p.guid}  ← ${p.src}${p.extra ? "  " + p.extra : ""}`);
  if (!problems.length) console.log("    every Builder ref checks out");

  if (entry.symbols) {
    console.log("  script symbols:");
    for (const sym of entry.symbols) {
      const hits = idx.texts.filter((t) => t.r.endsWith(".c") && t.txt.includes(sym)).length;
      console.log(`    ${hits ? "OK     " : "MISSING"} ${sym}${hits ? ` (${hits} script files)` : ""}`);
    }
  }

  if (entry.kind === "map") {
    const t = entry.def;
    console.log("  parent-world manager scan (TERRAINS flags vs what the bare world's layers actually bake in):");
    const parentPath = t.parent.replace(/^\{[0-9A-F]{16}\}/, "");
    const layerDir = parentPath.replace(/\.ent$/i, "_Layers").toLowerCase();
    const found = new Set();
    for (const x of idx.texts) {
      if (!x.r.startsWith(layerDir + "/") || !x.r.endsWith(".layer")) continue;
      for (const tag of ["SCR_MapEntity", "SCR_AIWorld", "PerceptionManager", "RadioManager"]) if (x.txt.includes(tag)) found.add(tag);
    }
    const expect = [
      ["PerceptionManager", !!t.parentHasPerceptionManager, "parentHasPerceptionManager"],
      ["SCR_AIWorld", !!t.parentHasAIWorld, "parentHasAIWorld"],
      ["RadioManager", !!t.parentHasRadioManager, "parentHasRadioManager"],
      ["SCR_MapEntity", !t.mapEntity, "(mapEntity absent ⇒ parent must bake one in)"],
    ];
    for (const [tag, flag, name] of expect) {
      const has = found.has(tag);
      console.log(`    ${has === flag ? "OK      " : "MISMATCH"} ${tag}: bare world ${has ? "HAS" : "lacks"} it, registry ${name} = ${flag}${has !== flag ? "  ← fix the TERRAINS entry (duplicate-entity or missing-manager risk)" : ""}`);
    }
    if (!idx.texts.some((x) => x.r.startsWith(layerDir + "/"))) console.log(`    (no layers found under ${layerDir}/ — parent path drift? check the world file list in the diff)`);
  }

  if (entry.kind === "faction" || entry.kind === "vehicle") {
    const known = new Set([...refs.keys()].map((r) => r.toLowerCase()));
    const unused = [];
    for (const root of roots) {
      for (const p of walk(root)) {
        const r = rel(root, p);
        if (extname(r).toLowerCase() !== ".conf") continue;
        const lr = r.toLowerCase();
        if (!(lr.includes("configs/entitycatalog/") || lr.includes("configs/editor/placeableentities/"))) continue;
        const txt = readFileSync(p, "utf8");
        for (const m of txt.matchAll(REF_RE)) {
          if (!m[2] || !/\.et$/i.test(m[2])) continue;
          const ref = `{${m[1]}}${m[2]}`;
          if (!idx.fileSet.has(m[2].toLowerCase())) continue; // mod-owned prefabs only (registry dumps list vanilla too)
          if (!known.has(ref.toLowerCase()) && !/(Base|_base)\.et$/.test(m[2])) unused.push(`${r} :: ${ref}`);
        }
      }
    }
    const uniq = [...new Set(unused)];
    console.log(`  catalog prefabs NOT referenced by the Builder: ${uniq.length}${uniq.length ? (process.argv.includes("--unused") ? "" : "  (pass --unused to list; the diff's catalog section shows only the NEW ones)") : ""}`);
    if (process.argv.includes("--unused")) for (const u of uniq) console.log(`    ${u}`);
  }
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------
function cmdList(args) {
  const json = args.includes("--json"), staleOnly = args.includes("--stale");
  const rows = [];
  for (const e of registryEntries()) {
    for (const g of e.guids) {
      const l = locate(g);
      const stale = !l.baseline || !l.meta || l.baseline.version == null || l.baseline.version !== l.meta.version || !l.extraction;
      rows.push({
        id: e.id, kind: e.kind, label: e.label, hidden: e.hidden ?? false, guid: g, workshopUrl: e.workshopUrl ?? `https://reforger.armaplatform.com/workshop/${g}`,
        addonName: l.meta?.name ?? null, title: l.title, diskVersion: l.meta?.version ?? null, diskUpdatedAt: l.meta?.updatedAt ?? null, onDisk: !!l.dir,
        baselineVersion: l.baseline?.version ?? null, baselineDate: l.baseline?.fingerprintedAt ?? null, extraction: l.extraction, prev: l.prev,
        gprojDeps: l.gprojDeps, stale, note: e.note,
      });
    }
  }
  const out = staleOnly ? rows.filter((r) => r.stale) : rows;
  if (json) { console.log(JSON.stringify(out, null, 2)); return; }
  console.log(`${"id".padEnd(11)} ${"kind".padEnd(8)} ${"guid".padEnd(17)} ${"disk".padEnd(12)} ${"updated".padEnd(11)} ${"baseline".padEnd(12)} ${"state".padEnd(9)} title / extraction`);
  for (const r of out) {
    const state = !r.onDisk ? "NO-DISK" : !r.extraction ? "NO-EXTR" : !r.baselineDate ? "NO-BASE" : !r.baselineVersion ? "UNVERSND" : r.stale ? "STALE" : "ok";
    console.log(`${r.id.padEnd(11)} ${r.kind.padEnd(8)} ${r.guid.padEnd(17)} ${(r.diskVersion ?? "-").padEnd(12)} ${(r.diskUpdatedAt ?? "-").padEnd(11)} ${(r.baselineVersion ?? "-").padEnd(12)} ${state.padEnd(9)} ${r.title ?? "?"}${r.extraction ? "" : "  [no extraction]"}${r.hidden ? "  [hidden]" : ""}`);
  }
  console.log("\nstate: STALE = disk version ≠ baseline version → rotate + re-extract + diff; UNVERSND = baseline seeded from an extraction OLDER than the on-disk copy (version unknown) → treat as STALE, the diff is the truth; NO-BASE = fingerprint --write needed; NO-DISK = run download-addon; NO-EXTR = extract-addon needed");
  const notes = [...new Set(out.map((r) => r.note).filter(Boolean))];
  for (const n of notes) console.log(`note: ${n}`);
}

function expandGuids(target) {
  const entries = resolveTargets(target);
  const seen = new Set();
  const out = [];
  for (const e of entries) for (const g of e.guids) if (!seen.has(g)) { seen.add(g); out.push({ entry: e, guid: g }); }
  return out;
}

function argValue(args, name) { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; }

function cmdFingerprint(target, args) {
  const write = args.includes("--write");
  const force = args.includes("--force");
  const version = argValue(args, "--version");
  const title = argValue(args, "--title");
  const dir = argValue(args, "--dir");
  const bulk = !target || target === "all" || !/^[0-9A-Fa-f]{16}$/.test(target);
  for (const { guid } of expandGuids(target)) {
    const loc = locate(guid, { title });
    if (write && bulk && loc.baseline && !force) { console.log(`${guid} ${loc.title}: baseline exists (v${loc.baseline.version ?? "?"}, ${loc.baseline.fingerprintedAt}) — skipped (pass --force to overwrite)`); continue; }
    if (!loc.extraction && !dir) { console.log(`${guid} ${loc.title ?? "?"}: NO extraction (${loc.extractionExpected ?? "title unknown — pass --title"}) — skipped`); continue; }
    const fp = buildFingerprint(loc, { version, dir });
    console.log(`${guid} ${fp.title}: ${fp.fileCount} files, ${fp.pairs.length} GUID↔path pairs, ${Object.keys(fp.catalogs).length} catalog confs, ${Object.keys(fp.layers).length} layers, terrain tiles ${fp.terrain.tiles}, version ${fp.version ?? "unknown"} (disk ${fp.diskVersionAtFingerprint ?? "-"})`);
    if (write) {
      mkdirSync(BASELINE_DIR, { recursive: true });
      writeFileSync(baselinePath(guid), gzipSync(Buffer.from(JSON.stringify(fp))));
      console.log(`  baseline written → ${rel(REPO, baselinePath(guid))} (${(statSync(baselinePath(guid)).size / 1024).toFixed(0)} KB)`);
    }
  }
}

function cmdRotate(target) {
  for (const { guid } of expandGuids(target)) {
    const loc = locate(guid);
    if (!loc.extraction) { console.log(`${guid} ${loc.title ?? "?"}: no extraction to rotate`); continue; }
    mkdirSync(PREV_DIR, { recursive: true });
    const dest = join(PREV_DIR, loc.title);
    if (existsSync(dest)) { rmSync(dest, { recursive: true, force: true }); console.log(`  removed older _prev copy ${dest}`); }
    renameSync(loc.extraction, dest);
    console.log(`${guid} ${loc.title}: rotated → ${dest}  (now run /extract-addon on ${loc.dir ?? "the addon folder"})`);
  }
}

function cmdDiff(target, args) {
  const full = args.includes("--full");
  const prevArg = argValue(args, "--prev");
  for (const { guid, entry } of expandGuids(target)) {
    const loc = locate(guid);
    if (!loc.extraction) { console.log(`\n=== DIFF ${guid} ${loc.title ?? "?"}: NO current extraction (${loc.extractionExpected ?? "?"})`); continue; }
    let old = loc.baseline;
    const prevDir = prevArg ?? loc.prev;
    if (prevDir && existsSync(prevDir)) {
      old = { ...(loc.baseline ?? {}), ...fingerprintFolder(prevDir), version: loc.baseline?.version ?? null, fingerprintedAt: `_prev ${statSync(prevDir).mtime.toISOString().slice(0, 10)}` };
      console.log(`(old side = rotated extraction ${prevDir})`);
    }
    if (!old) { console.log(`\n=== DIFF ${guid} ${loc.title}: no baseline and no _prev extraction — run fingerprint --write first`); continue; }
    const cur = buildFingerprint(loc);
    printDiff(loc, old, cur, diffFingerprints(old, cur), full, entry.kind);
  }
}

function cmdCheck(target) {
  for (const e of resolveTargets(target)) checkEntry(e, e.guids.map((g) => locate(g)));
}

// ---------------------------------------------------------------------------
// Temporary junctions for Workbench validation (user decision 2026-09-08).
// A direct -gproj launch (enfusion-mcp wb_launch) resolves dependencies ONLY
// from the Workbench addons dir, so a spike depending on a mod/map needs the
// addon (and its whole gproj dep chain) to physically appear there. The user
// deleted the old permanent junctions on purpose → create them just for the
// validation and remove them afterwards. Everything created is recorded in
// _junctions.json so --remove never touches anything it didn't make.
// ---------------------------------------------------------------------------
const WB_ADDONS = join(process.env.USERPROFILE ?? "C:/Users/djdav", "Documents", "My Games", "ArmaReforgerWorkbench", "addons");
const JUNCTION_LEDGER = join(BASELINE_DIR, "_junctions.json");
function readLedger() { return existsSync(JUNCTION_LEDGER) ? JSON.parse(readFileSync(JUNCTION_LEDGER, "utf8")) : []; }
function writeLedger(list) { mkdirSync(BASELINE_DIR, { recursive: true }); writeFileSync(JUNCTION_LEDGER, JSON.stringify(list, null, 2) + "\n"); }

function depClosure(guids) {
  const seen = new Set(), order = [];
  const visit = (g) => {
    if (seen.has(g)) return;
    seen.add(g);
    order.push(g);
    const d = addonDir(g);
    if (d) for (const dep of readGprojDeps(d)) visit(dep);
  };
  for (const g of guids) visit(g);
  return order;
}

function cmdJunction(target, args) {
  const remove = args.includes("--remove");
  if (remove && (!target || target === "all")) {
    const ledger = readLedger();
    if (!ledger.length) { console.log("no temporary junctions recorded"); return; }
    for (const j of ledger) {
      try { if (existsSync(j.path) && lstatSync(j.path).isSymbolicLink()) { rmdirSync(j.path); console.log(`removed ${j.path}`); } else console.log(`skip (not a junction / gone) ${j.path}`); }
      catch (e) { console.log(`FAILED to remove ${j.path}: ${e.message}`); }
    }
    writeLedger([]);
    return;
  }
  const guids = depClosure(expandGuids(target).map((x) => x.guid));
  const ledger = readLedger();
  for (const g of guids) {
    const src = addonDir(g);
    if (!src) { console.log(`${g}: not in the game addons dir — download it first`); continue; }
    const name = basename(src);
    const dest = join(WB_ADDONS, name);
    const inLedger = ledger.find((j) => j.guid === g);
    if (remove) {
      if (!inLedger) { console.log(`${g} ${name}: not created by this tool — left alone`); continue; }
      try { if (existsSync(dest) && lstatSync(dest).isSymbolicLink()) rmdirSync(dest); console.log(`removed ${dest}`); }
      catch (e) { console.log(`FAILED to remove ${dest}: ${e.message}`); continue; }
      ledger.splice(ledger.indexOf(inLedger), 1);
      continue;
    }
    if (existsSync(dest)) {
      const isLink = lstatSync(dest).isSymbolicLink();
      console.log(`${g} ${name}: already present in the Workbench addons dir (${isLink ? inLedger ? "our temporary junction" : "a junction not made by this tool" : "a real folder"}) — untouched`);
      continue;
    }
    symlinkSync(src, dest, "junction");
    ledger.push({ guid: g, name, path: dest, target: src, created: new Date().toISOString().slice(0, 16) });
    console.log(`junction ${name} → ${src}`);
  }
  writeLedger(ledger);
  if (!remove) console.log(`\n${ledger.length} temporary junction(s) on record — run \`junction ${target} --remove\` (or \`junction all --remove\`) after the Workbench check.`);
}

function die(msg) { console.error(`error: ${msg}`); process.exit(1); }

const [cmd, target, ...rest] = process.argv.slice(2);
const args = [target, ...rest].filter(Boolean);
switch (cmd) {
  case "list": cmdList(args); break;
  case "fingerprint": cmdFingerprint(target, rest); break;
  case "rotate": cmdRotate(target); break;
  case "diff": cmdDiff(target, rest); break;
  case "check": cmdCheck(target); break;
  case "junction": cmdJunction(target, rest); break;
  default:
    console.log("usage: audit.mjs list [--json] [--stale] | fingerprint <target> [--write] [--version V] [--title T] [--dir D] | rotate <target> | diff <target> [--prev D] [--full] | check <target> [--unused] | junction <target> [--remove]  (junction all --remove = drop every temporary junction on record)");
    process.exit(cmd ? 1 : 0);
}
