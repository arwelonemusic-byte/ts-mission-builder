// Enemy roster helpers for Advanced AI placement — thin typed view over the
// generator's AUTO-GENERATED ENEMY_GROUPS / ENEMY_ROLES (generator/roster.mjs)
// plus the vehicle-candidate list shared by the zone-module multiselect and the
// mounted-patrol dropdown.
import { ENEMY_GROUPS, ENEMY_ROLES, FACTIONS, MOD_VEHICLES, VEHICLE_MODS } from "mission-gen";
import type { RosterGroup, RosterRole } from "mission-gen";
import type { Lang } from "./i18n";

/** Registry order of a faction's group sets (default set first) — the optgroup
 * order users already know from the Enemy tab; roster subfactions without a
 * set (RHS FORECON, SSO…) sort after them, alphabetically. */
function setRank(faction: string, set: string | null | undefined): number {
  const keys = Object.keys(FACTIONS[faction]?.groupSets ?? {});
  const i = set ? keys.indexOf(set) : -1;
  return i === -1 ? keys.length : i;
}
/** All groups of a faction (every registry set), registry set order then size desc. */
export function enemyGroups(faction: string): RosterGroup[] {
  return [...(ENEMY_GROUPS[faction] ?? [])].sort((a, b) => setRank(faction, a.set) - setRank(faction, b.set) || b.size - a.size || a.label.localeCompare(b.label));
}
/** All character roles of a faction (every subfaction), registry set order then label. */
export function enemyRoles(faction: string): RosterRole[] {
  return [...(ENEMY_ROLES[faction] ?? [])].sort(
    (a, b) => setRank(faction, a.set) - setRank(faction, b.set) || a.subfaction.localeCompare(b.subfaction) || a.label.localeCompare(b.label)
  );
}
export const rosterGroupExists = (faction: string, id: string): boolean => enemyGroups(faction).some((g) => g.id === id);
export const rosterRoleExists = (faction: string, id: string): boolean => enemyRoles(faction).some((r) => r.id === id);

/** Group-set key the defaults should come from: the first selected enemy set,
 * else the faction's default set. */
function primarySet(faction: string, enemyGroupSets: string[] | undefined): string | undefined {
  return enemyGroupSets?.[0] ?? FACTIONS[faction]?.defaultGroupSet;
}

/** Default group for a new element: the primary set's sentry team (the same
 * 2-man team the Fortifications module garrisons with), else that set's
 * first group, else the faction's first group. */
export function defaultGroupKey(faction: string, enemyGroupSets: string[] | undefined): string {
  const groups = enemyGroups(faction);
  const set = primarySet(faction, enemyGroupSets);
  const sentryRef = set ? FACTIONS[faction]?.groupSets?.[set]?.sentry : undefined;
  return (
    groups.find((g) => g.set === set && sentryRef && g.refs.includes(sentryRef))?.id ??
    groups.find((g) => g.set === set)?.id ??
    groups[0]?.id ??
    ""
  );
}

/** Default role for a new static soldier: the primary set's Rifleman, else
 * that set's first role, else the faction's first role. */
export function defaultRoleKey(faction: string, enemyGroupSets: string[] | undefined): string {
  const roles = enemyRoles(faction);
  const set = primarySet(faction, enemyGroupSets);
  return (
    roles.find((r) => r.set === set && r.label === "Rifleman")?.id ??
    roles.find((r) => r.set === set)?.id ??
    roles.find((r) => r.label === "Rifleman")?.id ??
    roles[0]?.id ??
    ""
  );
}

/** Unit-slot count of a group (enemy estimate); undefined for unknown ids. */
export function groupSize(faction: string, id: string): number | undefined {
  return enemyGroups(faction).find((g) => g.id === id)?.size;
}

/** Roster labels carry their own RU (not routed through tr()). */
export function rosterLabel(entry: { label: string; labelRu?: string }, lang: Lang): string {
  return lang === "ru" && entry.labelRu ? entry.labelRu : entry.label;
}

/** Group entries by a key, keeping first-seen order (for <optgroup>s). */
export function groupBy<T>(list: T[], key: (t: T) => string): { key: string; items: T[] }[] {
  const out: { key: string; items: T[] }[] = [];
  for (const item of list) {
    const k = key(item);
    const g = out.find((o) => o.key === k);
    if (g) g.items.push(item);
    else out.push({ key: k, items: [item] });
  }
  return out;
}

/** Armed/Unarmed vehicle candidates for an enemy faction: its patrol/transport
 * keys plus the enabled vehicle mods' pools (side-agnostic). Shared by the
 * Mounted Patrols / Vehicle Reinforcements multiselect and the Advanced
 * mounted-patrol dropdown. */
export function zoneVehicleCandidates(enemyFaction: string, mods: string[]): { heading: "Armed" | "Unarmed"; keys: string[] }[] {
  const enemy = FACTIONS[enemyFaction];
  const enabledVehicleMods = Object.values(VEHICLE_MODS).filter((vm) => mods.includes(vm.id) && !vm.hidden);
  return [
    { heading: "Armed" as const, keys: [...(enemy?.patrolVehicleKeys ?? []), ...enabledVehicleMods.flatMap((vm) => vm.patrolVehicleKeys)] },
    { heading: "Unarmed" as const, keys: [...(enemy?.transportVehicleKeys ?? []), ...enabledVehicleMods.flatMap((vm) => vm.transportVehicleKeys)] },
  ].filter((grp) => grp.keys.length > 0);
}

export function vehicleLabel(enemyFaction: string, key: string): string {
  return FACTIONS[enemyFaction]?.vehicleLabels?.[key] ?? MOD_VEHICLES[key]?.label ?? key;
}
