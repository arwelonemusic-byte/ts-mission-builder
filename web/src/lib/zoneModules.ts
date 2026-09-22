// Zone-module chip icons (Figma 106:24 / tooltip 106:216) — shared between
// the Zones panel cards and the map dot tooltip.
export const MODULE_ICONS: Record<string, string> = {
  DefenseGroup: "/icons/zones/defense.svg",
  TS_ScenarioFrameworkPluginAIPatrol: "/icons/zones/foot-patrol.svg",
  TS_ScenarioFrameworkPluginSmartGarrison: "/icons/zones/garrison.svg",
  TS_ScenarioFrameworkPluginMountedPatrol: "/icons/zones/mounted-patrol.svg",
  TS_ScenarioFrameworkPluginFortification: "/icons/zones/fortification.svg",
  TS_ScenarioFrameworkPluginQRFFoot: "/icons/zones/qrf-foot.svg",
  TS_ScenarioFrameworkPluginQRFMounted: "/icons/zones/qrf-vehicle.svg",
};

/** Map colors for QRF reinforcement origins (marker badge + dashed line to
 * the zone center) — per module type so foot/vehicle stay distinguishable. */
export const ORIGIN_COLORS: Record<string, string> = {
  TS_ScenarioFrameworkPluginQRFFoot: "#f97316",
  TS_ScenarioFrameworkPluginQRFMounted: "#e0315e",
};

/** Muted style applied to a chip icon when its module is disabled. */
export const DISABLED_ICON_FILTER = "grayscale(1) brightness(0.8)";

/** Hover explanations for the module checkboxes. */
export const MODULE_DESCRIPTIONS: Record<string, string> = {
  DefenseGroup: "Large group in the center with a defend waypoint",
  TS_ScenarioFrameworkPluginAIPatrol: "Groups with random patrol waypoints",
  TS_ScenarioFrameworkPluginSmartGarrison: "Small static groups inside buildings",
  TS_ScenarioFrameworkPluginMountedPatrol: "Vehicles patrolling roads in the area",
  TS_ScenarioFrameworkPluginFortification: "Bunkers, sandbag positions, MG nests etc.",
  TS_ScenarioFrameworkPluginQRFFoot:
    "Squads move in on foot from origin points when players enter the zone",
  TS_ScenarioFrameworkPluginQRFMounted:
    "Reinforcements drive in from origin points and dismount at the zone",
};

// --- Advanced AI placement (2026-09-21) ---------------------------------------
import type { Zone, ZoneElementKind } from "./mission";
import { ZONE_MODULES } from "mission-gen";

/** Which Simple-tab module chip an advanced element kind counts toward (null = its own chip). */
export const ELEMENT_KIND_MODULE: Record<ZoneElementKind, string | null> = {
  "foot-patrol": "TS_ScenarioFrameworkPluginAIPatrol",
  "mounted-patrol": "TS_ScenarioFrameworkPluginMountedPatrol",
  "defense-group": "DefenseGroup",
  static: null,
};
export const ELEMENT_KIND_ICONS: Record<ZoneElementKind, string> = {
  "foot-patrol": "/icons/zones/foot-patrol.svg",
  "mounted-patrol": "/icons/zones/mounted-patrol.svg",
  "defense-group": "/icons/zones/defense.svg",
  static: "/icons/zones/static-soldier.svg",
};
/** Sub-tab titles / card titles (EN keys, RU in i18n). */
export const ELEMENT_KIND_LABELS: Record<ZoneElementKind, string> = {
  "foot-patrol": "Foot patrols",
  "mounted-patrol": "Mounted patrols",
  "defense-group": "Defense groups",
  static: "Static AI soldiers",
};
export const ELEMENT_LABELS: Record<ZoneElementKind, string> = {
  "foot-patrol": "Foot patrol",
  "mounted-patrol": "Mounted patrol",
  "defense-group": "Defense group",
  static: "Static soldier",
};
export const ELEMENT_ADD_LABELS: Record<ZoneElementKind, string> = {
  "foot-patrol": "Add foot patrol",
  "mounted-patrol": "Add mounted patrol",
  "defense-group": "Add defense group",
  static: "Add static soldier",
};
export const ELEMENT_DESCRIPTIONS: Record<ZoneElementKind, string> = {
  "foot-patrol": "Patrol groups with manually placed cycled waypoints.",
  "mounted-patrol": "Patrol groups on vehicles with manually placed cycled waypoints.",
  "defense-group": "AI groups defending an area with a custom radius.",
  static: "AI characters that don't move. They will still shoot and turn.",
};

/** Chip row shared by the collapsed zone card and the map dot tooltip: one
 * chip per Simple-tab module (budget + advanced elements of the mapped kind)
 * plus a trailing static-soldier chip. */
export function zoneChipCounts(zone: Zone): { key: string; icon: string; label: string; count: number }[] {
  const els = zone.elements ?? [];
  const chips = ZONE_MODULES.map((def: { type: string; label: string }) => {
    const mod = zone.modules.find((mm) => mm.type === def.type);
    const kinds = (Object.keys(ELEMENT_KIND_MODULE) as ZoneElementKind[]).filter((k) => ELEMENT_KIND_MODULE[k] === def.type);
    const manual = els.filter((e) => kinds.includes(e.kind)).length;
    const budget = mod ? (def.type === "DefenseGroup" ? 1 : mod.budget) : 0;
    return { key: def.type, icon: MODULE_ICONS[def.type], label: def.label, count: budget + manual };
  });
  chips.push({ key: "static", icon: ELEMENT_KIND_ICONS.static, label: ELEMENT_KIND_LABELS.static, count: els.filter((e) => e.kind === "static").length });
  return chips;
}
