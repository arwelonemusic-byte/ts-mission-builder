import { FACTIONS, mintGuid } from "mission-gen";

/** sizes = Foot Patrols weight-slider selection (size classes for the group
 *  pool); absent = the module default (all sizes).
 *  origins = QRF reinforcement origin points (world coords, max maxOrigins);
 *  each becomes a TS_QRFSpawnAnchor in the generated QRF.layer. */
export type ZoneOrigin = { x: number; z: number };
export type ZoneModule = {
  type: string;
  budget: number;
  vehicles?: string[];
  sizes?: string[];
  origins?: ZoneOrigin[];
};
export type ArtyShell = { on: boolean; count: number };
export type ArtySupport = { enabled: boolean; he: ArtyShell; smoke: ArtyShell; illum: ArtyShell };
export type Zone = { id: string; x: number; z: number; radius: number; modules: ZoneModule[] };
export type SpawnVehicle = { type: string };
/** Player squad: callsign (m_sCallsign) + max players (m_iGroupSize 1-9) */
export type MissionGroup = { name: string; size: number };

export type MissionMarker = {
  id: string;
  x: number;
  z: number;
  kind: "military" | "custom";
  text: string;
  /** military */
  faction: string;
  type: string;
  /** custom (vanilla) */
  quad: string;
  color: string;
  rotation: number;
};

/** Map-overlay rectangle (TS_MapOverlay.et): one "ao" + any number of
 * "objective". Axis mapping (careful — easy to flip): `length` spans the
 * LOCAL X axis (ShapePoint X = ±length/2, itemWorldCorners `w`), `width`
 * spans the LOCAL Z axis (ShapePoint Z = ±width/2, itemWorldCorners `len`). */
export type MissionSector = {
  id: string;
  kind: "ao" | "objective";
  x: number;
  z: number;
  length: number;
  width: number;
  /** yaw deg 0..359, compass convention (same as spawn.yaw) */
  rotation: number;
};

export type Mission = {
  version: 1;
  displayName: string;
  author: string;
  terrain: string; // arland | eden | cain
  playableFaction: string;
  playableSubfaction: string;
  enemyFaction: string;
  enemyGroupSets: string[];
  /** Enabled content mods (MODS keys, e.g. "rhs") — gates which factions the
   * UI offers. Dependencies in the generated addon.gproj derive from the
   * factions actually used, not from this list. */
  mods: string[];
  briefing: {
    situation: string;
    objectives: string;
    threats: string;
    /** Additional custom briefing sections (in-game journal tabs), ids 3+ */
    extra: { title: string; text: string }[];
  };
  /** Selected loadout prefab refs (from the playable subfaction's loadout set) */
  loadouts: string[];
  /** Player squads (1-8) → playable faction's m_aSquadNames + m_aPredefinedGroups */
  groups: MissionGroup[];
  /** Artillery support → TS_FireSupportManagerComponent on GameModeSF */
  arty: ArtySupport;
  spawn: { placed: boolean; x: number; z: number; yaw: number; farp: boolean; vehicles: SpawnVehicle[] };
  zones: Zone[];
  markers: MissionMarker[];
  sectors: MissionSector[];
  guids: { addon: string; world: string; missionConf: string };
  /** Sanitized mission name the guids were minted for — a renamed mission is
   * a new addon and must not reuse them (see freshenGuids) */
  guidsName: string;
};

/** FACTIONS' TS type is inferred from the vanilla literal in catalogue.mjs;
 * mod-merged entries carry extra fields (mod tag, display label) the inferred
 * type doesn't know about — access them through this typed view. */
export type FactionMeta = { mod?: string; label?: string };
export function factionMeta(key: string): FactionMeta {
  return (FACTIONS[key] ?? {}) as FactionMeta;
}

/** Default loadout selection for a subfaction: its first (rifleman) entry. */
export function defaultLoadouts(faction: string, subfaction: string): string[] {
  const set = FACTIONS[faction]?.loadoutSets[subfaction] ?? [];
  return set.slice(0, 1).map((l) => l.prefab);
}

/** The Mod Defaults standard squad set: 1'1-1'4 + 1'6 @ 9/9/9/9/3. */
export function defaultGroups(): MissionGroup[] {
  return [
    { name: "1'1", size: 9 },
    { name: "1'2", size: 9 },
    { name: "1'3", size: 9 },
    { name: "1'4", size: 9 },
    { name: "1'6", size: 3 },
  ];
}

// Counts mirror the toolkit GameModeSF prefab's TS_FireSupportManagerComponent
// values (HE 60 / Smoke 30 / Illum 30) so the UI defaults equal what the
// mission gets anyway.
export function defaultArty(): ArtySupport {
  return {
    enabled: false,
    he: { on: true, count: 60 },
    smoke: { on: true, count: 30 },
    illum: { on: true, count: 30 },
  };
}

export function newMission(): Mission {
  const m: Mission = {
    version: 1,
    displayName: "My Mission",
    author: "",
    terrain: "arland",
    playableFaction: "US",
    playableSubfaction: "US_Army",
    enemyFaction: "USSR",
    enemyGroupSets: ["USSR_Army"],
    mods: [],
    briefing: { situation: "", objectives: "", threats: "", extra: [] },
    loadouts: defaultLoadouts("US", "US_Army"),
    groups: defaultGroups(),
    arty: defaultArty(),
    spawn: { placed: false, x: 0, z: 0, yaw: 0, farp: true, vehicles: [] },
    zones: [],
    markers: [],
    sectors: [],
    guids: { addon: mintGuid(), world: mintGuid(), missionConf: mintGuid() },
    guidsName: "",
  };
  m.guidsName = missionIds(m).name;
  return m;
}

/** GUIDs stay stable across re-exports of the SAME mission (so a published
 * addon can be regenerated in place), but a mission renamed since its guids
 * were minted is a NEW addon — reusing them gives two missions the same
 * resource GUIDs and they collide in the game's resource database. Call at
 * export time; persist the result if a new object comes back. */
export function freshenGuids(m: Mission): Mission {
  const name = missionIds(m).name;
  if (m.guidsName === name) return m;
  return {
    ...m,
    guidsName: name,
    guids: { addon: mintGuid(), world: mintGuid(), missionConf: mintGuid() },
  };
}

const LS_KEY = "ts-mission-builder-v1";

export function loadMission(): Mission {
  if (typeof window === "undefined") return newMission();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return newMission();
    const m = JSON.parse(raw) as Mission & { enemyGroupSet?: string };
    if (m.version !== 1) return newMission();
    return migrate(m);
  } catch {
    return newMission();
  }
}

/** Bring a parsed save up to the current shape. Shared by loadMission (browser
 * storage) and parseMissionJson (imported file) so a mission built in an older
 * build behaves identically whichever door it comes through. Additive only —
 * it defaults missing fields and never throws on unknown ones (see the
 * write-back in page.tsx: anything that bails to newMission() here would
 * overwrite the user's save). */
function migrate(m: Mission & { enemyGroupSet?: string }): Mission {
  if (!m.enemyGroupSets?.length) {
    m.enemyGroupSets = [m.enemyGroupSet ?? FACTIONS[m.enemyFaction]?.defaultGroupSet ?? "USSR_Army"];
    delete m.enemyGroupSet;
  }
  // Drop set keys the registry no longer has (e.g. MEI's subfaction sets
  // collapsed into one "Insurgents" pool); never leave the list empty
  const knownSets = FACTIONS[m.enemyFaction]?.groupSets ?? {};
  m.enemyGroupSets = m.enemyGroupSets.filter((k) => k in knownSets);
  if (!m.enemyGroupSets.length && FACTIONS[m.enemyFaction]?.defaultGroupSet) {
    m.enemyGroupSets = [FACTIONS[m.enemyFaction].defaultGroupSet];
  }
  if (!m.loadouts?.length) m.loadouts = defaultLoadouts(m.playableFaction, m.playableSubfaction);
  // Squads: default old saves; clamp hand-edited ones (1-8 groups, size 1-9)
  if (!Array.isArray(m.groups) || m.groups.length === 0) m.groups = defaultGroups();
  else
    m.groups = m.groups.slice(0, 8).map((g) => ({
      name: String(g?.name ?? ""),
      size: Math.max(1, Math.min(9, Math.floor(+g?.size) || 9)),
    }));
  // Mods gate: default old saves to none; if a save somehow uses a mod
  // faction without the mod enabled, enable it rather than break the mission
  if (!Array.isArray(m.mods)) m.mods = [];
  for (const fk of [m.playableFaction, m.enemyFaction]) {
    const mod = factionMeta(fk).mod;
    if (mod && !m.mods.includes(mod)) m.mods.push(mod);
  }
  // Old saves lack guidsName: "" never matches a sanitized name, so the
  // next export re-mints — also cures duplicates minted before this field
  // existed (rename-without-reset reused the stored guids verbatim)
  if (typeof m.guidsName !== "string") m.guidsName = "";
  if (!m.briefing.extra) m.briefing.extra = [];
  if (!m.markers) m.markers = [];
  if (!m.sectors) m.sectors = [];
  // Only one AO sector is allowed — drop extras if a save ever holds more
  let seenAo = false;
  m.sectors = m.sectors.filter((s) => {
    if (s.kind !== "ao") return true;
    if (seenAo) return false;
    seenAo = true;
    return true;
  });
  if (!m.arty) m.arty = defaultArty();
  // Early builds shipped invented defaults (60/40/40); if the user never
  // touched artillery, silently swap in the prefab-matching counts.
  if (
    !m.arty.enabled &&
    m.arty.he.on && m.arty.he.count === 60 &&
    m.arty.smoke.on && m.arty.smoke.count === 40 &&
    m.arty.illum.on && m.arty.illum.count === 40
  ) {
    m.arty = defaultArty();
  }
  if (typeof m.spawn.yaw !== "number") m.spawn.yaw = 0;
  // Mounted-patrol/QRF-mounted modules gained per-zone vehicle selection;
  // default old saves. QRF modules: sanitize origins (array, max 3).
  for (const zn of m.zones) {
    for (const mod of zn.modules) {
      if (
        (mod.type === "TS_ScenarioFrameworkPluginMountedPatrol" ||
          mod.type === "TS_ScenarioFrameworkPluginQRFMounted") &&
        !mod.vehicles?.length
      ) {
        mod.vehicles = FACTIONS[m.enemyFaction]?.patrolVehicleKeys.slice(0, 1) ?? [];
      }
      if (
        mod.type === "TS_ScenarioFrameworkPluginQRFFoot" ||
        mod.type === "TS_ScenarioFrameworkPluginQRFMounted"
      ) {
        mod.origins = (Array.isArray(mod.origins) ? mod.origins : [])
          .filter((o) => typeof o?.x === "number" && typeof o?.z === "number")
          .slice(0, 3);
      }
    }
  }
  return m;
}

/* ----- mission file (.json) — the browser-agnostic save/handoff path -----
 * The addon export needs showDirectoryPicker (Chrome/Edge only), so a Firefox
 * user can build a mission but never get it out. These two move the mission
 * itself: save to a file anywhere, load it anywhere. */

export function missionFileName(m: Mission): string {
  return `${missionIds(m).dirName}.tsmission.json`;
}

/** Download the mission as a .json file. Deliberately a plain Blob + <a
 * download> — no File System Access API — so this works in every browser. */
export function downloadMissionJson(m: Mission) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(m, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = missionFileName(m);
  // Firefox only fires the download for an anchor that's in the document, and
  // revoking too early cancels it there — hence the append + deferred revoke.
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 0);
}

/** Parse a .json save from downloadMissionJson. Throws a translatable message
 * on anything that isn't one of our missions — the shape gate matters because
 * migrate() dereferences these fields, and a half-applied import would land in
 * the live mission (and from there into localStorage). */
export function parseMissionJson(text: string): Mission {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Not a mission file.");
  }
  const m = raw as Mission & { enemyGroupSet?: string };
  if (
    !m ||
    typeof m !== "object" ||
    m.version !== 1 ||
    typeof m.displayName !== "string" ||
    typeof m.briefing !== "object" ||
    m.briefing === null ||
    typeof m.spawn !== "object" ||
    m.spawn === null ||
    !Array.isArray(m.zones)
  ) {
    throw new Error("Not a mission file.");
  }
  return migrate(m);
}

export function saveMission(m: Mission) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(m));
  } catch {
    // storage full/blocked — non-fatal
  }
}

/** Sanitized identifiers derived from the display name. */
export function missionIds(m: Mission) {
  const compact = m.displayName.replace(/[^A-Za-z0-9]+/g, "") || "TSMission";
  const underscored = m.displayName.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "TS_Mission";
  return { addonId: compact, dirName: underscored, name: underscored };
}
