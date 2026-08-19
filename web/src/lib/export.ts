import { buildMissionFiles, FACTIONS, itemWorldCorners } from "mission-gen";
import type { Mission, MissionProp } from "./mission";
import { missionIds } from "./mission";
import { propCanDefend, propEntry, propRect } from "./props";
import { getSampler } from "./terrainSampler";
import { iconEnum, MARKER_FACTIONS, MILITARY_TYPES } from "./markers";
import { thumbnailPixels, thumbnailPngBytes } from "./thumbnail";
import { encodeEdds } from "./edds";

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

  // Objectives → Objectives.layer LayerTask/Slot blocks (heightmap Y)
  const objectives = [];
  for (const o of m.objectives) {
    const oy = await elevationAt(m.terrain, o.x, o.z);
    let delivery;
    if (o.type === "deliver" && o.delivery) {
      const dy = await elevationAt(m.terrain, o.delivery.x, o.delivery.z);
      delivery = [y(o.delivery.x), y(dy), y(o.delivery.z)];
    }
    objectives.push({
      type: o.type,
      pos: [y(o.x), y(oy), y(o.z)],
      radius: o.radius,
      objectRef: o.objectRef,
      delivery,
      deliveryRadius: o.deliveryRadius,
      taskTitle: o.taskTitle,
      taskDesc: o.taskDesc,
    });
  }

  // Props → Props.layer entities (+ AO.layer defense trios in the generator)
  const props = [];
  for (const p of m.props) {
    const py = await elevationAt(m.terrain, p.x, p.z);
    props.push({
      ref: p.ref,
      pos: [y(p.x), y(py), y(p.z)],
      rotation: p.rotation,
      defense: p.defense && propCanDefend(p.ref) ? { sizes: p.defenseSizes } : null,
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
    // Ordered refs (= in-game arsenal order); migrate() sanitized them and
    // lib.mjs resolves modes from ARSENAL_POOL / the baked set.
    arsenal: m.arsenal,
    groups: m.groups,
    guids: m.guids,
    // Flag only — the generator emits the ref + .edds.meta, the binaries are
    // added in exportMission (canvas isn't available to the Node CLI).
    thumbnail: !!m.thumbnail,
    briefing: {
      situation: m.briefing.situation.split("\n"),
      objectives: m.briefing.objectives.split("\n"),
      threats: m.briefing.threats.split("\n"),
      extra: m.briefing.extra.map((e) => ({ title: e.title, text: e.text.split("\n") })),
    },
    // Positioned spawn shape (per-element world coords + rotation); lib.mjs
    // samples each element's Y itself via options.sampleY.
    spawn: {
      pos: [y(m.spawn.x), y(spawnY), y(m.spawn.z)],
      farp: m.spawn.farp,
      farpPos: [y(m.spawn.farpPos.x), y(m.spawn.farpPos.z)],
      farpRotation: m.spawn.farpPos.rotation,
      // denied = squad INDICES into groups (unknown ids dropped); the
      // generator resolves them to callsign names via gname() so escaping/
      // fallback match the emitted m_aSquadNames exactly.
      spawnPoints: m.spawn.spawnPoints.map((p) => ({
        pos: [y(p.x), y(p.z)],
        denied: p.denied.map((id) => m.groups.findIndex((g) => g.id === id)).filter((i) => i >= 0),
      })),
      crates: m.spawn.crates.map((c) => ({ pos: [y(c.x), y(c.z)], rotation: c.rotation })),
      vehicles: m.spawn.vehicles.map((v) => ({ type: v.type, pos: [y(v.x), y(v.z)], rotation: v.rotation })),
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
    objectives,
    props,
  };
}

/**
 * Max elevation difference (m) across a prop's footprint — 9-point sampling
 * (corners + edge midpoints + center of the rotated box). Disc footprints
 * use their bounding square.
 */
export async function propSlopeDelta(m: Mission, p: MissionProp): Promise<number> {
  const entry = propEntry(p.ref);
  if (!entry) return 0;
  const s = await getSampler(m.terrain);
  const r = propRect(entry.fp);
  const corners = itemWorldCorners({ x: r.offX, z: r.offZ, w: r.w, len: r.len }, p.x, p.z, p.rotation);
  const pts: [number, number][] = [...(corners as [number, number][]), [p.x, p.z]];
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

  // Binary members of the file map (thumbnail); written the same way as text.
  const binaries: Record<string, Uint8Array<ArrayBuffer>> = {};
  if (m.thumbnail) {
    const name = missionIds(m).name;
    const { width, height, rgba } = await thumbnailPixels(m.thumbnail, m.displayName);
    // The .png is the import source Workbench wants next to a texture — a
    // .edds without one loads fine but reports "source file not found" in the
    // editor. Sources are stripped when the addon is packed, so it's free.
    binaries[`Images/${name}.png`] = await thumbnailPngBytes(m.thumbnail, m.displayName);
    binaries[`Images/${name}.edds`] = encodeEdds(width, height, rgba);
  }

  const w = window as unknown as { showDirectoryPicker?: (o?: object) => Promise<FileSystemDirectoryHandle> };
  if (!w.showDirectoryPicker) {
    // Dead end for Firefox/Safari — point at the .json handoff (Mission tab)
    // rather than just naming the browsers that work.
    throw new Error(
      "This browser can't write the addon folder — use Chrome or Edge, or save the mission to a file (Mission tab) and generate it there."
    );
  }
  const root = await w.showDirectoryPicker({ mode: "readwrite" });
  const addonDir = await root.getDirectoryHandle(addonDirName, { create: true });

  // Order matters for the thumbnail: the .png goes down before the .edds so
  // the .edds is the newer file and Workbench doesn't treat it as stale.
  const all: [string, string | Uint8Array<ArrayBuffer>][] = [
    ...Object.entries(files),
    ...Object.entries(binaries),
  ];
  for (const [rel, content] of all) {
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
  return { fileCount: all.length, dirName: addonDirName };
}
