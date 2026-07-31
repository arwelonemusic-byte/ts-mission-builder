import { appendFile, mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Mission-generation telemetry + archive. The browser POSTs the full mission
 * .json (same shape as Save-to-file) after a successful addon export; we
 * archive it and append a one-line stats event. Fire-and-forget on the
 * client — generation never depends on this succeeding.
 *
 * Storage: <repo>/.mission-data (gitignored; on the box that's
 * /opt/ts-web/ts-mission-builder/.mission-data, owned by tsweb).
 *   missions/<utc-timestamp>_<name-slug>.json  — full mission saves
 *   events.jsonl                               — one line per generation
 */

const DATA_DIR = process.env.MISSION_DATA_DIR ?? path.resolve(process.cwd(), "..", ".mission-data");
/** Mission JSONs carry the thumbnail as a JPEG data URL — allow a few MB. */
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (!text || text.length > MAX_BYTES) return new Response(null, { status: 413 });

    let m: Record<string, unknown>;
    try {
      m = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return new Response(null, { status: 400 });
    }
    if (typeof m !== "object" || m === null || typeof m.displayName !== "string") {
      return new Response(null, { status: 400 });
    }

    const slug =
      m.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "unnamed";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");

    const missionsDir = path.join(DATA_DIR, "missions");
    await mkdir(missionsDir, { recursive: true });
    await writeFile(path.join(missionsDir, `${stamp}_${slug}.json`), text, "utf8");

    const zones = Array.isArray(m.zones) ? m.zones.length : 0;
    const markers = Array.isArray(m.markers) ? m.markers.length : 0;
    const event = {
      ts: new Date().toISOString(),
      name: m.displayName,
      author: typeof m.author === "string" ? m.author : "",
      terrain: typeof m.terrain === "string" ? m.terrain : "",
      playable: typeof m.playableFaction === "string" ? m.playableFaction : "",
      enemy: typeof m.enemyFaction === "string" ? m.enemyFaction : "",
      zones,
      markers,
    };
    await appendFile(path.join(DATA_DIR, "events.jsonl"), JSON.stringify(event) + "\n", "utf8");

    return new Response(null, { status: 204 });
  } catch {
    // Never bubble server hiccups back into the client's generate flow.
    return new Response(null, { status: 500 });
  }
}
