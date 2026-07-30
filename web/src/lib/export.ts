import { buildMissionFiles, FACTIONS, itemWorldCorners, layoutSpawnBundle } from "mission-gen";
import type { Mission } from "./mission";
import { missionIds } from "./mission";
import { loadHeightmap, type HeightmapSampler } from "./heightmap";
import { terrainByKey } from "./terrains";
import { iconEnum, MARKER_FACTIONS, MILITARY_TYPES } from "./markers";

const samplerCache = new Map<string, Promise<HeightmapSampler>>();

function getSampler(terrainKey: string): Promise<HeightmapSampler> {
  let p = samplerCache.get(terrainKey);
  if (!p) {
    const t = terrainByKey(terrainKey);
    p = loadHeightmap(t.heightmapBin, t.heightmapMeta);
    samplerCache.set(terrainKey, p);
  }
  return p;
}

/** Elevation lookup with graceful fallback for out-of-bounds points. */
export async function elevationAt(terrainKey: string, x: number, z: number): Promise<number> {
  try {
    const s = await getSampler(terrainKey);
    const y = s.sample(x, z);
    return Number.isNaN(y) ? 0 : Math.max(0, y);
  } catch {
    return 0;
  }
}

/** Convert the editor's mission state into the generator's input shape. */
export async function toGeneratorMission(m: Mission) {
  const ids = missionIds(m);
  const y = (v: number) => +v.toFixed(3);
  const spawnY = await elevationAt(m.terrain, m.spawn.x, m.spawn.z);

  const zones = [];
  for (let i = 0; i < m.zones.length; i++) {
    const zn = m.zones[i];
    const zy = await elevationAt(m.terrain, zn.x, zn.z);
    const plugins = [];
    for (const mod of zn.modules) {
      const p: {
        type: string;
        attrs: Record<string, number>;
        vehicles?: string[];
        sizes?: string[];
        origins?: number[][];
      } = {
        type: mod.type,
        attrs: { m_iBudget: mod.budget },
        vehicles: mod.vehicles,
        sizes: mod.sizes,
      };
      // QRF reinforcement origins → TS_QRFSpawnAnchor coords (heightmap Y)
      if (mod.origins?.length) {
        p.origins = [];
        for (const o of mod.origins) {
          const oy = await elevationAt(m.terrain, o.x, o.z);
          p.origins.push([y(o.x), y(oy), y(o.z)]);
        }
      }
      plugins.push(p);
    }
    zones.push({
      name: `Area${i + 1}`,
      pos: [y(zn.x), y(zy), y(zn.z)],
      radius: zn.radius,
      plugins,
    });
  }

  // Markers: web keys → game enum tokens (the generator writes tokens as-is)
  const markers = [];
  for (const mk of m.markers) {
    const my = await elevationAt(m.terrain, mk.x, mk.z);
    markers.push({
      kind: mk.kind,
      pos: [y(mk.x), y(my), y(mk.z)],
      text: mk.text,
      faction: MARKER_FACTIONS.find((f) => f.key === mk.faction)?.enum ?? "BLUFOR",
      type: MILITARY_TYPES.find((t) => t.key === mk.type)?.enum ?? "INFANTRY",
      icon: iconEnum(mk.quad),
      color: mk.color,
      rotation: mk.rotation,
    });
  }

  // Sectors (TS_MapOverlay rectangles), AO first for a stable layer order
  const sectors = [];
  const sortedSectors = [...m.sectors].sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === "ao" ? -1 : 1
  );
  for (const s of sortedSectors) {
    const sy = await elevationAt(m.terrain, s.x, s.z);
    sectors.push({
      kind: s.kind,
      pos: [y(s.x), y(sy), y(s.z)],
      length: s.length,
      width: s.width,
      rotation: s.rotation,
    });
  }

  // Selected loadouts resolved to {name, prefab}, keeping catalogue order
  const loadoutSet = FACTIONS[m.playableFaction]?.loadoutSets[m.playableSubfaction] ?? [];
  const loadouts = loadoutSet.filter((l) => m.loadouts.includes(l.prefab));

  return {
    addonId: ids.addonId,
    dirName: ids.dirName,
    addonTitle: m.displayName,
    name: ids.name,
    displayName: m.displayName,
    author: m.author || "TS Mission Builder",
    terrain: m.terrain,
    playableFaction: m.playableFaction,
    playableSubfaction: m.playableSubfaction,
    enemyFaction: m.enemyFaction,
    enemyGroupSets: m.enemyGroupSets,
    loadouts,
    groups: m.groups,
    guids: m.guids,
    briefing: {
      situation: m.briefing.situation.split("\n"),
      objectives: m.briefing.objectives.split("\n"),
      threats: m.briefing.threats.split("\n"),
      extra: m.briefing.extra.map((e) => ({ title: e.title, text: e.text.split("\n") })),
    },
    spawn: {
      pos: [y(m.spawn.x), y(spawnY), y(m.spawn.z)],
      yaw: m.spawn.yaw,
      farp: m.spawn.farp,
      vehicles: m.spawn.vehicles.map((v) => ({ type: v.type })),
    },
    // Artillery: unchecked shell types flatten to 0 rounds (removes the round
    // type in-game — the component has no per-type enable flags)
    arty: m.arty.enabled
      ? {
          he: m.arty.he.on ? m.arty.he.count : 0,
          smoke: m.arty.smoke.on ? m.arty.smoke.count : 0,
          illum: m.arty.illum.on ? m.arty.illum.count : 0,
        }
      : null,
    zones,
    markers,
    sectors,
  };
}

/**
 * Max elevation difference (m) across the spawn bundle footprint — corners,
 * edge midpoints and center of the rotated bounding box.
 */
export async function spawnSlopeDelta(m: Mission): Promise<number> {
  const s = await getSampler(m.terrain);
  const { bounds } = layoutSpawnBundle(m.spawn);
  const box = {
    x: (bounds.minX + bounds.maxX) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2,
    w: bounds.maxX - bounds.minX,
    len: bounds.maxZ - bounds.minZ,
    yaw: 0,
  };
  const corners = itemWorldCorners(box, m.spawn.x, m.spawn.z, m.spawn.yaw);
  const pts: [number, number][] = [...(corners as [number, number][]), [m.spawn.x, m.spawn.z]];
  for (let i = 0; i < corners.length; i++) {
    const [ax, az] = corners[i];
    const [bx, bz] = corners[(i + 1) % corners.length];
    pts.push([(ax + bx) / 2, (az + bz) / 2]);
  }
  const ys = pts.map(([px, pz]) => s.sample(px, pz)).filter((v) => Number.isFinite(v));
  if (ys.length < 2) return 0;
  return Math.max(...ys) - Math.min(...ys);
}

/** Generate the addon and write it into a user-picked directory (File System Access API). */
export async function exportMission(m: Mission): Promise<{ fileCount: number; dirName: string }> {
  const gen = await toGeneratorMission(m);
  const sampler = await getSampler(m.terrain);
  const { files, addonDirName } = buildMissionFiles(gen, {
    sampleY: (x: number, z: number) => sampler.sample(x, z),
  });

  const w = window as unknown as { showDirectoryPicker?: (o?: object) => Promise<FileSystemDirectoryHandle> };
  if (!w.showDirectoryPicker) {
    throw new Error("This browser doesn't support folder export — use Chrome or Edge.");
  }
  const root = await w.showDirectoryPicker({ mode: "readwrite" });
  const addonDir = await root.getDirectoryHandle(addonDirName, { create: true });

  for (const [rel, content] of Object.entries(files)) {
    const parts = rel.split("/");
    let dir = addonDir;
    for (const part of parts.slice(0, -1)) {
      dir = await dir.getDirectoryHandle(part, { create: true });
    }
    const fh = await dir.getFileHandle(parts[parts.length - 1], { create: true });
    const ws = await fh.createWritable();
    await ws.write(content);
    await ws.close();
  }
  return { fileCount: Object.keys(files).length, dirName: addonDirName };
}
