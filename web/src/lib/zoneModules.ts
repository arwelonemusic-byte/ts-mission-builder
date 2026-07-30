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
