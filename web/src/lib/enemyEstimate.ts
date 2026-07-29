import { FACTIONS, ZONE_MODULES } from "mission-gen";
import type { Mission, Zone } from "./mission";

/** Ballpark enemy-count estimation for AI zones.
 *
 * Toolkit budget semantics (TS_ScenarioFrameworkPluginBase): budget = number
 * of groups/compositions to spawn. Per module:
 *  - Defense Group: exactly one defense group — size is KNOWN per group set
 *    (groupSets[*].defense.size; resolveDefenseGroup picks the largest).
 *  - Foot Patrols / Garrison: budget × one group from the module's size-class
 *    pool — estimated via the class ranges below (mirrors resolveGroupPool's
 *    fall-back to all classes when the requested ones are empty).
 *  - Vehicle Patrols: budget × one vehicle, compartments filled with the
 *    prefab's default occupants (driver/gunner/cargo) — seat counts vary.
 *  - Fortifications: budget × one composition, each garrisoned by one
 *    sentry-pool team.
 */
const CLASS_RANGE: Record<string, [number, number]> = {
  small: [2, 4],
  medium: [4, 6],
  large: [6, 9],
};
const VEHICLE_CREW_RANGE: [number, number] = [3, 8];
const SENTRY_RANGE: [number, number] = [2, 4];
const ALL_CLASSES = ["small", "medium", "large"];

type GroupSet = { defense?: { size: number } } & Record<string, unknown>;

export function zoneEnemyRange(
  zone: Zone,
  enemyFaction: string,
  enemyGroupSets: string[]
): [number, number] {
  const faction = FACTIONS[enemyFaction];
  const sets = enemyGroupSets
    .map((k) => faction?.groupSets?.[k] as GroupSet | undefined)
    .filter((s): s is GroupSet => !!s);
  let min = 0;
  let max = 0;
  const classNonEmpty = (c: string) =>
    sets.some((s) => ((s[c] as string[] | undefined) ?? []).length > 0);

  for (const mod of zone.modules) {
    const def = ZONE_MODULES.find((d) => d.type === mod.type);
    if (!def) continue;
    if (def.kind === "slotai") {
      const size = Math.max(0, ...sets.map((s) => s.defense?.size ?? 0));
      min += size;
      max += size;
    } else if (def.kind === "vehicle") {
      min += mod.budget * VEHICLE_CREW_RANGE[0];
      max += mod.budget * VEHICLE_CREW_RANGE[1];
    } else if (def.kind === "fortification") {
      min += mod.budget * SENTRY_RANGE[0];
      max += mod.budget * SENTRY_RANGE[1];
    } else {
      let classes = (mod.sizes ?? def.sizes ?? ALL_CLASSES).filter(classNonEmpty);
      if (classes.length === 0) classes = ALL_CLASSES.filter(classNonEmpty);
      if (classes.length === 0) continue;
      min += mod.budget * Math.min(...classes.map((c) => CLASS_RANGE[c][0]));
      max += mod.budget * Math.max(...classes.map((c) => CLASS_RANGE[c][1]));
    }
  }
  return [min, max];
}

export function totalEnemyRange(mission: Mission): [number, number] {
  let min = 0;
  let max = 0;
  for (const zn of mission.zones) {
    const [a, b] = zoneEnemyRange(zn, mission.enemyFaction, mission.enemyGroupSets);
    min += a;
    max += b;
  }
  return [min, max];
}

/** "~8–14" (single number when min === max, e.g. defense-only zones). */
export function rangeLabel([min, max]: [number, number]): string {
  if (max <= 0) return "";
  return min === max ? `~${min}` : `~${min}–${max}`;
}
