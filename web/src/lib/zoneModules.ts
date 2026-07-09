// Zone-module chip icons (Figma 106:24 / tooltip 106:216) — shared between
// the Zones panel cards and the map dot tooltip.
export const MODULE_ICONS: Record<string, string> = {
  DefenseGroup: "/icons/zones/defense.svg",
  TS_ScenarioFrameworkPluginAIPatrol: "/icons/zones/foot-patrol.svg",
  TS_ScenarioFrameworkPluginSmartGarrison: "/icons/zones/garrison.svg",
  TS_ScenarioFrameworkPluginMountedPatrol: "/icons/zones/mounted-patrol.svg",
  TS_ScenarioFrameworkPluginFortification: "/icons/zones/fortification.svg",
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
};
