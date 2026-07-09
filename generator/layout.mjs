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

const SLOT = {
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
