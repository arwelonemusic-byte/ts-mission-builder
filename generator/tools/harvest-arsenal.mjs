// Re-sync FACTIONS[*].arsenalItems in catalogue.mjs from input/arsenal-items.md.
// Run after editing the .md:  node generator/tools/harvest-arsenal.mjs
//
// Item modes (m_eItemMode) are looked up in the reforger-item-database by full
// prefab ref; refs not found there get an empty mode (engine DEFAULT).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MD_PATH = join(root, "input", "arsenal-items.md");
const CAT_PATH = join(root, "generator", "catalogue.mjs");
const DB_PATH = "D:/VSCode_dev/arma-reforger/reforger-item-database/data/items.json";

const md = readFileSync(MD_PATH, "utf8");
let modeByRef = new Map();
try {
  const db = JSON.parse(readFileSync(DB_PATH, "utf8"));
  modeByRef = new Map(db.map((i) => [i.prefabPath, i.itemMode]));
} catch {
  console.warn(`item database not found at ${DB_PATH} — all modes will be empty`);
}

// Parse: "## FACTION" headings, then any line starting with "{"
const sets = {};
let cur = null;
for (const line of md.split(/\r?\n/)) {
  const h = line.match(/^## (\w+)/);
  if (h) {
    cur = h[1];
    sets[cur] = [];
    continue;
  }
  if (cur && line.startsWith("{")) sets[cur].push(line.trim());
}

const factions = Object.keys(sets);
if (!factions.length) {
  console.error("no faction sections found in the md");
  process.exit(1);
}

let cat = readFileSync(CAT_PATH, "utf8");
const unknownMode = [];

for (const f of factions) {
  const items = sets[f]
    .map((ref) => {
      let mode = modeByRef.get(ref);
      if (mode === undefined) {
        unknownMode.push(`${f}: ${ref}`);
        mode = "";
      }
      return `      { mode: "${mode}", ref: "${ref}" },`;
    })
    .join("\n");
  // Replace the existing arsenalItems array inside this faction's section.
  // Anchor on the faction key at 2-space indent, then the first arsenalItems
  // array after it (arrays never nest inside it — safe lazy match).
  const re = new RegExp(`(\\n  ${f}: \\{[\\s\\S]*?\\n    arsenalItems: \\[)[\\s\\S]*?(\\n    \\],)`);
  if (!re.test(cat)) {
    console.error(`arsenalItems anchor for ${f} not found in catalogue.mjs`);
    process.exit(1);
  }
  cat = cat.replace(re, `$1\n${items}$2`);
}

writeFileSync(CAT_PATH, cat, "utf8");
if (unknownMode.length) console.warn("refs not in item DB (mode empty):\n  " + unknownMode.join("\n  "));
console.log(
  "catalogue.mjs updated:",
  factions.map((f) => `${f}=${sets[f].length}`).join(", ")
);
