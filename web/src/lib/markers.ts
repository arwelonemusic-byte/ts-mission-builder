// Marker catalogue — military icon combos + the vanilla marker atlas, both
// copied from ts-ops-planner. Everything here is exportable to the game's
// SCR_ScenarioFrameworkSlotMarker (Markers.layer); ops-planner icons without
// a matching game enum (TS markers, direction-of-attack-main-planned) are
// intentionally excluded.

export type MarkerFaction = "blufor" | "opfor" | "indfor" | "unknown";
export type MarkerKind = "military" | "custom";

export const MARKER_FACTIONS: { key: MarkerFaction; label: string; enum: string }[] = [
  { key: "blufor", label: "BLUFOR", enum: "BLUFOR" },
  { key: "opfor", label: "OPFOR", enum: "OPFOR" },
  { key: "indfor", label: "INDFOR", enum: "INDFOR" },
  { key: "unknown", label: "Unknown", enum: "UNKNOWN" },
];

/** Military unit types → EMilitarySymbolIcon enum token ("" = empty/none). */
export const MILITARY_TYPES: { key: string; label: string; enum: string }[] = [
  { key: "empty", label: "Empty", enum: "" },
  { key: "infantry", label: "Infantry", enum: "INFANTRY" },
  { key: "motorized", label: "Motorized", enum: "MOTORIZED" },
  { key: "armor", label: "Armor", enum: "ARMOR" },
  { key: "antiarmor", label: "Anti-Armor", enum: "ANTITANK" },
  { key: "mortar", label: "Mortar", enum: "MORTAR" },
  { key: "artillery", label: "Artillery", enum: "ARTILLERY" },
  { key: "fixedwing", label: "Fixed Wing", enum: "FIXED_WING" },
  { key: "recon", label: "Recon", enum: "RECON" },
  { key: "supply", label: "Supply", enum: "SUPPLY" },
  { key: "maintenance", label: "Maintenance", enum: "MAINTENANCE" },
  { key: "medical", label: "Medical", enum: "MEDICAL" },
];

export function militaryIconUrl(faction: string, type: string): string {
  return `/icons/military/land-${faction}-${type}.png`;
}

/** 8-direction white text-shadow "outline" for marker labels — readable on
 * both dark terrain and light map areas. Shared by the map divIcons and the
 * panel's drop-well preview. */
export const MARKER_LABEL_OUTLINE =
  "-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,1px 1px 0 #fff,-1px 0 0 #fff,1px 0 0 #fff,0 -1px 0 #fff,0 1px 0 #fff";

/** Vanilla marker atlas (1248×1520, 128px sprites on a 136px grid). */
export const VANILLA_ATLAS = { url: "/icons/vanilla-markers.png", width: 1248, height: 1520 };

export type IconEntry = {
  category: "general" | "tactical" | "arrow";
  quad: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/** quad → SCR_EScenarioFrameworkMarkerCustom enum token:
 * uppercase, dashes→underscores, trailing "-N" collapses ("circle-2"→CIRCLE2). */
export function iconEnum(quad: string): string {
  return quad.toUpperCase().replace(/-(\d+)$/, "$1").replace(/-/g, "_");
}

export const MARKER_ICONS: IconEntry[] = [
  { category: "general", quad: "circle", label: "CIRCLE", x: 552, y: 280, w: 128, h: 128 },
  { category: "general", quad: "circle-2", label: "CIRCLE 2", x: 688, y: 280, w: 128, h: 128 },
  { category: "general", quad: "cross", label: "CROSS", x: 8, y: 416, w: 128, h: 128 },
  { category: "general", quad: "cross-2", label: "CROSS 2", x: 144, y: 416, w: 128, h: 128 },
  { category: "general", quad: "dot", label: "DOT", x: 144, y: 552, w: 128, h: 128 },
  { category: "general", quad: "dot-2", label: "DOT 2", x: 280, y: 552, w: 128, h: 128 },
  { category: "general", quad: "drop-point", label: "DROP POINT", x: 416, y: 552, w: 128, h: 128 },
  { category: "general", quad: "drop-point-2", label: "DROP POINT 2", x: 552, y: 552, w: 128, h: 128 },
  { category: "general", quad: "entry-point", label: "ENTRY POINT", x: 688, y: 552, w: 128, h: 128 },
  { category: "general", quad: "entry-point-2", label: "ENTRY POINT 2", x: 824, y: 552, w: 128, h: 128 },
  { category: "general", quad: "flag", label: "FLAG", x: 960, y: 552, w: 128, h: 128 },
  { category: "general", quad: "flag-2", label: "FLAG 2", x: 1096, y: 552, w: 128, h: 128 },
  { category: "general", quad: "flag-3", label: "FLAG 3", x: 8, y: 688, w: 128, h: 128 },
  { category: "general", quad: "fortification", label: "FORTIFICATION", x: 416, y: 688, w: 128, h: 128 },
  { category: "general", quad: "fortification-2", label: "FORTIFICATION 2", x: 552, y: 688, w: 128, h: 128 },
  { category: "general", quad: "mark-exclamation", label: "MARK EXCLAMATION", x: 280, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mark-exclamation-2", label: "MARK EXCLAMATION 2", x: 416, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mark-exclamation-3", label: "MARK EXCLAMATION 3", x: 552, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mark-question", label: "MARK QUESTION", x: 688, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mark-question-2", label: "MARK QUESTION 2", x: 824, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mark-question-3", label: "MARK QUESTION 3", x: 960, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mine-field", label: "MINE FIELD", x: 1096, y: 824, w: 128, h: 128 },
  { category: "general", quad: "mine-field-2", label: "MINE FIELD 2", x: 8, y: 960, w: 128, h: 128 },
  { category: "general", quad: "mine-field-3", label: "MINE FIELD 3", x: 144, y: 960, w: 128, h: 128 },
  { category: "general", quad: "mine-single", label: "MINE SINGLE", x: 280, y: 960, w: 128, h: 128 },
  { category: "general", quad: "mine-single-2", label: "MINE SINGLE 2", x: 416, y: 960, w: 128, h: 128 },
  { category: "general", quad: "mine-single-3", label: "MINE SINGLE 3", x: 552, y: 960, w: 128, h: 128 },
  { category: "general", quad: "objective-marker", label: "OBJECTIVE MARKER", x: 688, y: 960, w: 128, h: 128 },
  { category: "general", quad: "objective-marker-2", label: "OBJECTIVE MARKER 2", x: 824, y: 960, w: 128, h: 128 },
  { category: "general", quad: "observation-post", label: "OBSERVATION POST", x: 960, y: 960, w: 128, h: 128 },
  { category: "general", quad: "observation-post-2", label: "OBSERVATION POST 2", x: 1096, y: 960, w: 128, h: 128 },
  { category: "general", quad: "pick-up", label: "PICK UP", x: 8, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "pick-up-2", label: "PICK UP 2", x: 144, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "point-of-interest", label: "POINT OF INTEREST", x: 280, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "point-of-interest-2", label: "POINT OF INTEREST 2", x: 416, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "point-of-interest-3", label: "POINT OF INTEREST 3", x: 552, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "point-special", label: "POINT SPECIAL", x: 688, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "point-special-2", label: "POINT SPECIAL 2", x: 824, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "recon-outpost", label: "RECON OUTPOST", x: 960, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "recon-outpost-2", label: "RECON OUTPOST 2", x: 1096, y: 1096, w: 128, h: 128 },
  { category: "general", quad: "waypoint", label: "WAYPOINT", x: 1096, y: 1232, w: 128, h: 128 },
  { category: "general", quad: "waypoint-2", label: "WAYPOINT 2", x: 8, y: 1368, w: 128, h: 128 },
  { category: "tactical", quad: "defend", label: "DEFEND", x: 280, y: 416, w: 128, h: 128 },
  { category: "tactical", quad: "defend-2", label: "DEFEND 2", x: 416, y: 416, w: 128, h: 128 },
  { category: "tactical", quad: "destroy", label: "DESTROY", x: 552, y: 416, w: 128, h: 128 },
  { category: "tactical", quad: "destroy-2", label: "DESTROY 2", x: 688, y: 416, w: 128, h: 128 },
  { category: "tactical", quad: "heal", label: "HEAL", x: 688, y: 688, w: 128, h: 128 },
  { category: "tactical", quad: "help", label: "HELP", x: 824, y: 688, w: 128, h: 128 },
  { category: "tactical", quad: "help-2", label: "HELP 2", x: 960, y: 688, w: 128, h: 128 },
  { category: "tactical", quad: "attack", label: "ATTACK", x: 280, y: 280, w: 128, h: 128 },
  { category: "tactical", quad: "attack-main", label: "ATTACK MAIN", x: 416, y: 280, w: 128, h: 128 },
  { category: "tactical", quad: "contain", label: "CONTAIN", x: 824, y: 280, w: 128, h: 128 },
  { category: "tactical", quad: "contain-2", label: "CONTAIN 2", x: 960, y: 280, w: 128, h: 128 },
  { category: "tactical", quad: "contain-3", label: "CONTAIN 3", x: 1096, y: 280, w: 128, h: 128 },
  { category: "tactical", quad: "retain", label: "RETAIN", x: 144, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "retain-2", label: "RETAIN 2", x: 280, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "strong-point", label: "STRONG POINT", x: 552, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "strong-point-2", label: "STRONG POINT 2", x: 688, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "target-reference-point", label: "TARGET REFERENCE POINT", x: 824, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "target-reference-point-2", label: "TARGET REFERENCE POINT 2", x: 960, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "ambush", label: "AMBUSH", x: 8, y: 8, w: 128, h: 128 },
  { category: "tactical", quad: "ambush-2", label: "AMBUSH 2", x: 144, y: 8, w: 128, h: 128 },
  { category: "tactical", quad: "reconnaissance", label: "RECONNAISSANCE", x: 8, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "search-area", label: "SEARCH AREA", x: 416, y: 1232, w: 128, h: 128 },
  { category: "tactical", quad: "direction-of-attack", label: "DIRECTION OF ATTACK", x: 824, y: 416, w: 128, h: 128 },
  { category: "tactical", quad: "direction-of-attack-main", label: "DIRECTION OF ATTACK MAIN", x: 960, y: 416, w: 128, h: 128 },
  { category: "tactical", quad: "direction-of-attack-planned", label: "DIRECTION OF ATTACK PLANNED", x: 8, y: 552, w: 128, h: 128 },
  { category: "tactical", quad: "follow-and-support", label: "FOLLOW AND SUPPORT", x: 144, y: 688, w: 128, h: 128 },
  { category: "tactical", quad: "follow-and-support-2", label: "FOLLOW AND SUPPORT 2", x: 280, y: 688, w: 128, h: 128 },
  { category: "tactical", quad: "join", label: "JOIN", x: 1096, y: 688, w: 128, h: 128 },
  { category: "tactical", quad: "join-2", label: "JOIN 2", x: 8, y: 824, w: 128, h: 128 },
  { category: "tactical", quad: "join-3", label: "JOIN 3", x: 144, y: 824, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-large", label: "ARROW LARGE", x: 280, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-large-2", label: "ARROW LARGE 2", x: 416, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-large-3", label: "ARROW LARGE 3", x: 552, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-medium", label: "ARROW MEDIUM", x: 688, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-medium-2", label: "ARROW MEDIUM 2", x: 824, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-medium-3", label: "ARROW MEDIUM 3", x: 960, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-small", label: "ARROW SMALL", x: 1096, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-small-2", label: "ARROW SMALL 2", x: 8, y: 280, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-small-3", label: "ARROW SMALL 3", x: 144, y: 280, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-large", label: "ARROW CURVE LARGE", x: 280, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-large-2", label: "ARROW CURVE LARGE 2", x: 416, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-large-3", label: "ARROW CURVE LARGE 3", x: 552, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-medium", label: "ARROW CURVE MEDIUM", x: 688, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-medium-2", label: "ARROW CURVE MEDIUM 2", x: 824, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-medium-3", label: "ARROW CURVE MEDIUM 3", x: 960, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-small", label: "ARROW CURVE SMALL", x: 1096, y: 8, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-small-2", label: "ARROW CURVE SMALL 2", x: 8, y: 144, w: 128, h: 128 },
  { category: "arrow", quad: "arrow-curve-small-3", label: "ARROW CURVE SMALL 3", x: 144, y: 144, w: 128, h: 128 },
];

export const MARKER_CATEGORIES: { key: IconEntry["category"]; label: string }[] = [
  { key: "general", label: "General" },
  { key: "tactical", label: "Tactical" },
  { key: "arrow", label: "Arrows" },
];

export function findIcon(quad: string): IconEntry {
  return MARKER_ICONS.find((i) => i.quad === quad) ?? MARKER_ICONS[0];
}

/** The game's 13 placed-marker colors. `name` is the file enum token
 * (SCR_EScenarioFrameworkMarkerCustomColor); the enum indexes into the game's
 * placed-color array by ORDINAL, so the names don't match the rendered color
 * (e.g. RED renders dark red, OPFOR renders red, DARK_PINK renders dark
 * brown). `hex` is the sRGB value the game actually renders. */
export const MARKER_COLORS: { name: string; label: string; hex: string }[] = [
  { name: "DARK_PINK", label: "Dark Brown", hex: "#60383d" },
  { name: "CIVILIAN", label: "Purple", hex: "#9151a0" },
  { name: "MAGENTA", label: "Ping", hex: "#f038db" },
  { name: "DARK_BLUE", label: "Navy Blue", hex: "#0d6079" },
  { name: "BLUFOR", label: "Cyan", hex: "#22c3f3" },
  { name: "BLUE", label: "Blue", hex: "#0d7aed" },
  { name: "GREEN", label: "Dark Green", hex: "#005b26" },
  { name: "INDEPENDENT", label: "Green", hex: "#22b24f" },
  { name: "OPFOR", label: "Red", hex: "#ee2e2e" },
  { name: "RED", label: "Dark Red", hex: "#821c1c" },
  { name: "ORANGE", label: "Dark Orange", hex: "#e2a84f" },
  { name: "REFORGER_ORANGE", label: "Orange", hex: "#f9d368" },
  { name: "WHITE", label: "White", hex: "#ffffff" },
];

export function findColor(name: string) {
  return MARKER_COLORS.find((c) => c.name === name) ?? MARKER_COLORS[MARKER_COLORS.length - 1];
}

/** CSS style for rendering an atlas sprite recolored via mask. */
export function maskIconStyle(icon: IconEntry, size: number, colorHex: string, rotation = 0): React.CSSProperties {
  const scale = size / icon.w;
  return {
    width: size,
    height: size,
    backgroundColor: colorHex,
    WebkitMaskImage: `url(${VANILLA_ATLAS.url})`,
    maskImage: `url(${VANILLA_ATLAS.url})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: `-${icon.x * scale}px -${icon.y * scale}px`,
    maskPosition: `-${icon.x * scale}px -${icon.y * scale}px`,
    WebkitMaskSize: `${VANILLA_ATLAS.width * scale}px ${VANILLA_ATLAS.height * scale}px`,
    maskSize: `${VANILLA_ATLAS.width * scale}px ${VANILLA_ATLAS.height * scale}px`,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
  };
}
