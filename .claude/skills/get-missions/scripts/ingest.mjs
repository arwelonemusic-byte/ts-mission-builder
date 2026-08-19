// Ingest one archived mission .json into the local collection:
//   generated-missions/<name-slug>-<author-slug>/mission.json
//   generated-missions/<name-slug>-<author-slug>/thumbnail.jpg   (when present)
// Re-ingesting the same mission overwrites its folder (newest archive wins).
// Usage: node ingest.mjs <archived.json> <outRoot>
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const [, , jsonPath, outRoot] = process.argv;
if (!jsonPath || !outRoot) {
  console.error("usage: node ingest.mjs <archived.json> <outRoot>");
  process.exit(1);
}

const text = readFileSync(jsonPath, "utf8");
const m = JSON.parse(text);

// Cyrillic names slug to nothing under a bare [a-z0-9] filter, so every such
// mission collapsed into "unnamed-<author>" — two of them by one author would
// silently overwrite each other. Transliterate before filtering.
const CYRILLIC = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[Ѐ-ӿ]/g, (c) => (c in CYRILLIC ? CYRILLIC[c] : "-"))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const stamp = (path.basename(jsonPath).match(/^[\d-]+T[\d-]+Z/) || ["unnamed"])[0];
const dirName = `${slug(m.displayName) || stamp}-${slug(m.author) || "unknown"}`;
const out = path.join(outRoot, dirName);
mkdirSync(out, { recursive: true });
writeFileSync(path.join(out, "mission.json"), text);

if (typeof m.thumbnail === "string") {
  const match = m.thumbnail.match(/^data:image\/(\w+);base64,(.+)$/s);
  if (match) {
    const ext = match[1] === "jpeg" ? "jpg" : match[1];
    writeFileSync(path.join(out, `thumbnail.${ext}`), Buffer.from(match[2], "base64"));
  }
}

console.log(dirName);
