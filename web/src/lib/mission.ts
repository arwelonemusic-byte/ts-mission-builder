import { FACTIONS, mintGuid } from "mission-gen";

export type ZoneModule = { type: string; budget: number; vehicles?: string[] };
export type ArtyShell = { on: boolean; count: number };
export type ArtySupport = { enabled: boolean; he: ArtyShell; smoke: ArtyShell; illum: ArtyShell };
export type Zone = { id: string; x: number; z: number; radius: number; modules: ZoneModule[] };
export type SpawnVehicle = { type: string };

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
  briefing: {
    situation: string;
    objectives: string;
    threats: string;
    /** Additional custom briefing sections (in-game journal tabs), ids 3+ */
    extra: { title: string; text: string }[];
  };
  /** Selected loadout prefab refs (from the playable subfaction's loadout set) */
  loadouts: string[];
  /** Artillery support → TS_FireSupportManagerComponent on GameModeSF */
  arty: ArtySupport;
  spawn: { placed: boolean; x: number; z: number; yaw: number; farp: boolean; vehicles: SpawnVehicle[] };
  zones: Zone[];
  markers: MissionMarker[];
  sectors: MissionSector[];
  guids: { addon: string; world: string; missionConf: string };
};

/** Default loadout selection for a subfaction: its first (rifleman) entry. */
export function defaultLoadouts(faction: string, subfaction: string): string[] {
  const set = FACTIONS[faction]?.loadoutSets[subfaction] ?? [];
  return set.slice(0, 1).map((l) => l.prefab);
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
  return {
    version: 1,
    displayName: "My Mission",
    author: "",
    terrain: "arland",
    playableFaction: "US",
    playableSubfaction: "US_Army",
    enemyFaction: "USSR",
    enemyGroupSets: ["USSR_Army"],
    briefing: { situation: "", objectives: "", threats: "", extra: [] },
    loadouts: defaultLoadouts("US", "US_Army"),
    arty: defaultArty(),
    spawn: { placed: false, x: 0, z: 0, yaw: 0, farp: true, vehicles: [] },
    zones: [],
    markers: [],
    sectors: [],
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
    if (!m.enemyGroupSets?.length) {
      m.enemyGroupSets = [m.enemyGroupSet ?? FACTIONS[m.enemyFaction]?.defaultGroupSet ?? "USSR_Army"];
      delete m.enemyGroupSet;
    }
    if (!m.loadouts?.length) m.loadouts = defaultLoadouts(m.playableFaction, m.playableSubfaction);
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
    // Mounted-patrol modules gained per-zone vehicle selection; default old saves
    for (const zn of m.zones) {
      for (const mod of zn.modules) {
        if (mod.type === "TS_ScenarioFrameworkPluginMountedPatrol" && !mod.vehicles?.length) {
          mod.vehicles = FACTIONS[m.enemyFaction]?.patrolVehicleKeys.slice(0, 1) ?? [];
        }
      }
    }
    return m;
  } catch {
    return newMission();
  }
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
