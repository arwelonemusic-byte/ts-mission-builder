// Spawn bundle layout engine — single source of truth for BOTH the web preview
// (map footprint + schematic) and the generator (entity offsets). All positions
// are bundle-local meters: +x = east, +z = north when bundle yaw = 0; origin =
// the user-placed spawn position = FARP center.
//
// FARP pad extents measured from E_TS_FARP_Comp child coords (x -8.3..7.1,
// z -10.6..10.5) plus margin; heli slots sized for rotor clearance
// (UH-1H ~15 m, Mi-8 ~21 m rotor diameter).

export function vehicleSizeClass(key) {
  if (/^(UH1H|Mi8MT)/.test(key)) return "heli";
  if (/^(M923A1|Ural4320|BTR70|BRDM2|LAV25|M998_covered_long)/.test(key)) return "heavy";
  return "light";
}

export const SLOT = {
  light: { w: 4, len: 6 },
  heavy: { w: 5, len: 10 },
  heli: { w: 24, len: 24 },
};

const GROUND_ROW_START_X = -10;
const GROUND_ROW_LIMIT_X = 30;

/**
 * @param spawn {{ farp: boolean, vehicles?: {type:string}[] }}
 * @returns {{ items: Array, bounds: {minX,maxX,minZ,maxZ} }}
 */
export function layoutSpawnBundle(spawn) {
  const items = [];
  if (spawn.farp) {
    items.push({ kind: "farp", x: 0, z: 0, yaw: 0, w: 20, len: 22 });
  }
  items.push({ kind: "crate", x: 14, z: 0, yaw: 0, w: 2, len: 2 });
  items.push({ kind: "spawnPoint", x: 14, z: -6, yaw: 0, w: 2, len: 2 });

  // Ground vehicles: parking rows south of the pad, filling east, wrapping to
  // further rows. Vehicles face south (away from the pad).
  let gx = GROUND_ROW_START_X;
  let gz = spawn.farp ? -16 : -10;
  let rowMaxLen = 0;
  // Helicopters: their own row north of the pad, generous spacing.
  let hx = GROUND_ROW_START_X;
  const hz = spawn.farp ? 26 : 14;

  (spawn.vehicles ?? []).forEach((v, i) => {
    const cls = vehicleSizeClass(v.type);
    const s = SLOT[cls];
    if (cls === "heli") {
      items.push({ kind: "vehicle", index: i, type: v.type, cls, x: hx + s.w / 2, z: hz + s.len / 2, yaw: 0, w: s.w, len: s.len });
      hx += s.w + 6;
      return;
    }
    if (gx + s.w > GROUND_ROW_LIMIT_X) {
      gx = GROUND_ROW_START_X;
      gz -= rowMaxLen + 4;
      rowMaxLen = 0;
    }
    items.push({ kind: "vehicle", index: i, type: v.type, cls, x: gx + s.w / 2, z: gz - s.len / 2, yaw: 180, w: s.w, len: s.len });
    gx += s.w + 3;
    rowMaxLen = Math.max(rowMaxLen, s.len);
  });

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const it of items) {
    minX = Math.min(minX, it.x - it.w / 2);
    maxX = Math.max(maxX, it.x + it.w / 2);
    minZ = Math.min(minZ, it.z - it.len / 2);
    maxZ = Math.max(maxZ, it.z + it.len / 2);
  }
  const m = 2;
  return { items, bounds: { minX: minX - m, maxX: maxX + m, minZ: minZ - m, maxZ: maxZ + m } };
}

// --- Free-placement layer (positioned spawn shape, 2026-08-18) ---
// A positioned spawn stores absolute world coords + a compass rotation per
// element: { x, z, farp, farpPos: {x,z,rotation}, spawnPoint: {x,z},
// crates: [{id,x,z,rotation}], vehicles: [{id,type,x,z,rotation}] }.
// layoutSpawnBundle above stays untouched — it seeds first placement, bakes
// legacy saves and serves the generator's legacy input path.

export const ELEMENT_SIZES = {
  farp: { w: 20, len: 22 },
  crate: { w: 2, len: 2 },
  spawnPoint: { w: 2, len: 2 },
};

/** FARP interior schematic in MAP-LOCAL meters, so players can read the
 * orientation before rotating. Harvested from TS_FARP_Comp child coords; the
 * emitted composition is rotated +90° CW of the map footprint (see lib.mjs),
 * so these already include that transform: map point = (compZ, -compX).
 * cones = the two rows marking the drive-through lane (enter along map ±Z at
 * rotation 0); boxes = the two crate/barrel prop clusters flanking the lane. */
export const FARP_DETAIL = {
  cones: [
    [-3.45, 8.33], [-3.45, 3.54], [-3.45, -1.97], [-3.45, -7.1],
    [4.77, 8.33], [4.77, 3.54], [4.77, -1.97], [4.77, -7.1],
  ],
  boxes: [
    { x: 8.7, z: -0.2, w: 4.4, len: 8 },
    { x: -7.9, z: 1.3, w: 5.9, len: 5 },
  ],
};

/**
 * Positioned spawn → flat world-frame element list. The one derivation both
 * map views, the slope check and auto-placement consume.
 * Every item: { kind, key, x, z, rotation, w, len } plus id/index/type/cls
 * for crates/vehicles. key = "farp" | "spawnPoint" | "crate:<id>" | "veh:<id>".
 */
export function spawnElements(spawn) {
  const items = [];
  if (spawn.farp) {
    const f = spawn.farpPos ?? { x: spawn.x, z: spawn.z, rotation: 0 };
    items.push({ kind: "farp", key: "farp", x: f.x, z: f.z, rotation: f.rotation ?? 0, ...ELEMENT_SIZES.farp });
  }
  (spawn.crates ?? []).forEach((c, i) => {
    items.push({ kind: "crate", key: `crate:${c.id}`, id: c.id, index: i, x: c.x, z: c.z, rotation: c.rotation ?? 0, ...ELEMENT_SIZES.crate });
  });
  const sp = spawn.spawnPoint ?? { x: spawn.x, z: spawn.z };
  items.push({ kind: "spawnPoint", key: "spawnPoint", x: sp.x, z: sp.z, rotation: 0, ...ELEMENT_SIZES.spawnPoint });
  (spawn.vehicles ?? []).forEach((v, i) => {
    const cls = vehicleSizeClass(v.type);
    items.push({ kind: "vehicle", key: `veh:${v.id}`, id: v.id, index: i, type: v.type, cls, x: v.x, z: v.z, rotation: v.rotation ?? 0, ...SLOT[cls] });
  });
  return items;
}

/** Axis-aligned world bounds over all elements' rotated corners, +2 m margin. */
export function spawnElementsBounds(spawn) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const it of spawnElements(spawn)) {
    for (const [cx, cz] of itemWorldCorners({ x: 0, z: 0, w: it.w, len: it.len }, it.x, it.z, it.rotation)) {
      minX = Math.min(minX, cx);
      maxX = Math.max(maxX, cx);
      minZ = Math.min(minZ, cz);
      maxZ = Math.max(maxZ, cz);
    }
  }
  const m = 2;
  return { minX: minX - m, maxX: maxX + m, minZ: minZ - m, maxZ: maxZ + m };
}

/** SAT overlap test for two rotated rects { x, z, w, len, rotation }. */
export function rectsOverlap(a, b) {
  const corners = (r) => itemWorldCorners({ x: 0, z: 0, w: r.w, len: r.len }, r.x, r.z, r.rotation ?? 0);
  const ca = corners(a);
  const cb = corners(b);
  for (const rect of [ca, cb]) {
    for (let i = 0; i < 2; i++) {
      const ax = rect[i + 1][0] - rect[i][0];
      const az = rect[i + 1][1] - rect[i][1];
      let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
      for (const [px, pz] of ca) {
        const d = px * ax + pz * az;
        aMin = Math.min(aMin, d);
        aMax = Math.max(aMax, d);
      }
      for (const [px, pz] of cb) {
        const d = px * ax + pz * az;
        bMin = Math.min(bMin, d);
        bMax = Math.max(bMax, d);
      }
      if (aMax < bMin || bMax < aMin) return false;
    }
  }
  return true;
}

/**
 * Next free spot near the anchor for a new element. kind = "crate" or a
 * vehicle size class ("light" | "heavy" | "heli"). Candidates walk the classic
 * auto-layout pattern (crates cluster east of the anchor, ground vehicles in
 * parking rows south, helis in rows north), each tested with 1.5 m clearance
 * against every existing element. Never throws — exhausted candidates fall
 * back to a spot south of everything.
 */
export function autoPlaceSpawnElement(spawn, kind) {
  const size = kind === "crate" ? ELEMENT_SIZES.crate : SLOT[kind];
  const rotation = kind === "light" || kind === "heavy" ? 180 : 0;
  const existing = spawnElements(spawn);
  const free = (lx, lz) => {
    const cand = {
      x: spawn.x + lx,
      z: spawn.z + lz,
      w: size.w + 3,
      len: size.len + 3,
      rotation,
    };
    return !existing.some((it) => rectsOverlap(cand, it));
  };
  const candidates = [];
  if (kind === "crate") {
    for (let row = 0; row < 4; row++) {
      for (let lx = 14; lx <= 30; lx += 3) candidates.push([lx, -3 * row]);
    }
  } else if (kind === "heli") {
    const hz = spawn.farp ? 26 : 14;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        candidates.push([GROUND_ROW_START_X + col * (size.w + 6) + size.w / 2, hz + row * 30 + size.len / 2]);
      }
    }
  } else {
    const gz0 = spawn.farp ? -16 : -10;
    for (let row = 0; row < 6; row++) {
      for (let gx = GROUND_ROW_START_X; gx + size.w <= GROUND_ROW_LIMIT_X; gx += size.w + 3) {
        candidates.push([gx + size.w / 2, gz0 - row * (size.len + 4) - size.len / 2]);
      }
    }
  }
  for (const [lx, lz] of candidates) {
    if (free(lx, lz)) return { x: +(spawn.x + lx).toFixed(1), z: +(spawn.z + lz).toFixed(1), rotation };
  }
  const count = existing.length;
  return { x: +spawn.x.toFixed(1), z: +(spawn.z - 60 - 5 * count).toFixed(1), rotation };
}

/**
 * Rotate a bundle-local offset by the bundle yaw (degrees, compass-style to
 * match Enfusion Y angles) into world-frame dx/dz.
 */
export function rotateLocal(x, z, yawDeg) {
  const r = (yawDeg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [x * c + z * s, -x * s + z * c];
}

/** Pointed-nose outline for a vehicle footprint (prefabs face local +Z, so
 * the apex marks the facing). Rectangle whose front quarter tapers to a
 * center point — overall length is unchanged, the shape stays inside the
 * plain rect. Point order: rear-left, rear-right, front-right shoulder,
 * nose apex, front-left shoulder. Same signature as itemWorldCorners. */
export function vehicleWorldOutline(item, originX, originZ, yawDeg) {
  const hw = item.w / 2;
  const hl = item.len / 2;
  const nose = Math.min(item.len * 0.25, item.w);
  const pts = [
    [-hw, -hl],
    [hw, -hl],
    [hw, hl - nose],
    [0, hl],
    [-hw, hl - nose],
  ];
  return pts.map(([lx, lz]) => {
    const [dx, dz] = rotateLocal(lx + (item.x ?? 0), lz + (item.z ?? 0), yawDeg);
    return [originX + dx, originZ + dz];
  });
}

/** World-frame corner positions of a layout item's rectangle (bundle at origin/yaw). */
export function itemWorldCorners(item, originX, originZ, yawDeg) {
  const hw = item.w / 2;
  const hl = item.len / 2;
  const corners = [
    [item.x - hw, item.z - hl],
    [item.x + hw, item.z - hl],
    [item.x + hw, item.z + hl],
    [item.x - hw, item.z + hl],
  ];
  return corners.map(([lx, lz]) => {
    const [dx, dz] = rotateLocal(lx, lz, yawDeg);
    return [originX + dx, originZ + dz];
  });
}
