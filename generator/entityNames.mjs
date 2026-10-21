// Zone (AI area) entity names (2026-10-21): a zone may carry a custom name
// that becomes its Area entity's world name in AO.layer (default `Area<N>`),
// so mission makers can find their areas in the World Editor. The rules live
// here so the web UI (inline validation) and lib.mjs (top-of-build throw)
// apply the same ones.
//
// Charset = an identifier (letters, digits, underscore, no leading digit):
// every one of the 5537 named entities in the extracted community worlds and
// all production missions match it, and so does every name lib.mjs writes.
// Entity names are world-global — Workbench rejects duplicates — so a custom
// name may not reuse another zone's name (custom OR default), any fixed name
// the generator writes, or anything in a numbered family it writes
// (`Area<N>` included, so deleting/adding zones can never renumber a default
// onto a custom name). Comparison is case-insensitive.

export const ZONE_NAME_MAX = 40;

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;

// Fixed world-global names written by lib.mjs (default/Spawn/Props/Markers/
// Objectives layers).
const FIXED = [
  "SCR_AIWorld", "PerceptionManager", "FactionManager_Editor", "RadioManager", "GameModeSF",
  "ScriptedChatEntity", "MapEntity",
  "AreaSpawn", "LayerCrates", "LayerVehicles", "SlotCrate",
  "AreaProps", "LayerProps", "AreaMarkers", "LayerMarkers", "AreaObjectives",
].map((s) => s.toLowerCase());

// Numbered families written by lib.mjs (zones, advanced AI, props, arty stop
// triggers, markers, spawn, objectives).
const NUMBERED = [
  /^area\d+$/, /^layer\d+$/, /^slotai\d+$/, /^layerstatic\d+$/, /^slotaistatic\d+_\d+$/,
  /^ai_(footpatrol|mountedpatrol|defense)_\d+_\d+$/,
  /^(a_waypoints|a_cycle|a_defend|b_slotai|c_slotai|b_vehicle)_\d+_\d+$/, /^b_patrol_\d+_\d+_\d+$/,
  /^(slot)?prop\d+$/, /^(area|layer|slotai)propdef\d+$/, /^(area|layer|slot)artystop\d+$/,
  /^slotmarker\d+$/, /^slotcrate\d+$/, /^slotvehicle\d+$/, /^spawnpoint\d+$/,
  /^slotobjective\d+(vehicle)?$/, /^task_objective\d+$/,
];

/** Default entity name of the zone at 0-based index i. */
export const defaultZoneEntityName = (i) => `Area${i + 1}`;

/** Why `name` can't be the custom name of zone `index` (0-based), or null.
 *  `otherNames` = the effective names of every OTHER zone. Codes:
 *  "chars" | "length" | "reserved" | "duplicate". The zone's own default
 *  (`Area<index+1>`) is accepted — callers treat it as "no custom name". */
export function zoneNameError(name, index, otherNames) {
  if (!IDENT.test(name)) return "chars";
  if (name.length > ZONE_NAME_MAX) return "length";
  const lc = name.toLowerCase();
  if (lc === defaultZoneEntityName(index).toLowerCase()) return null;
  if (FIXED.includes(lc) || NUMBERED.some((re) => re.test(lc))) return "reserved";
  if (otherNames.some((n) => n.toLowerCase() === lc)) return "duplicate";
  return null;
}
