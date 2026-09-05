declare module "mission-gen" {
  export const TERRAINS: Record<
    string,
    {
      label: string;
      parent: string;
      nav: string[];
      dependencies?: string[];
      parentHasPerceptionManager?: boolean;
      parentHasAIWorld?: boolean;
      parentHasRadioManager?: boolean;
    }
  >;
  export const FACTIONS: Record<
    string,
    {
      /** Vanilla factions: FactionManager_Editor member instance GUID */
      entryGuid?: string;
      /** Mod factions: faction .conf resource ref (new FactionManager member) */
      confRef?: string;
      /** MODS key when the faction comes from a mod */
      mod?: string;
      /** Vanilla faction key this faction is a reskin-alias of (e.g. MEI → USSR) */
      aliasOf?: string;
      /** Factions with no enemy-side content: playable side only, never enemy
       *  (US_DESERT — a pure reskin alias of US) */
      playableOnly?: boolean;
      /** Alias factions only: enabling their mod while the players are the
       *  base faction switches the playable side to this entry (camo packs) */
      defaultWhenEnabled?: boolean;
      /** In-game faction keys this faction's conf declares friendly (symmetric!)
       *  — lib.mjs clears the list via member override when the mission pits
       *  such a pair against each other */
      friendlyWith?: string[];
      /** Display label (mod factions; vanilla factions show their key) */
      label?: string;
      callsignGuid: string;
      squadBase: string[];
      squadFifth: string | null;
      spawnPoint: string;
      /** HVT character for Eliminate-HVT objectives when this faction is the enemy */
      hvt?: string;
      riflemen: Record<string, string>;
      loadoutSets: Record<string, { name: string; prefab: string }[]>;
      arsenalItems: { mode: string; ref: string }[];
      /** Optional subfaction-specific arsenal extras (e.g. camo-matched backpacks), keyed like riflemen */
      subfactionArsenalItems?: Record<string, { mode: string; ref: string }[]>;
      vehicles: Record<string, string>;
      vehicleLabels: Record<string, string>;
      patrolVehicleKeys: string[];
      /** Unarmed transport candidates for the same modules ("Unarmed" list in
       *  the UI; empty for factions without unarmed vehicles, e.g. RHS ION) */
      transportVehicleKeys: string[];
      /** Character prefabs for mounted-patrol / vehicle-QRF crews. Required
       *  for every faction (lib.mjs throws on vehicle modules without it) —
       *  always emitted so borrowed/captured vehicles never spawn their
       *  prefab-default (wrong-faction) crews. Concrete prefabs only. */
      patrolCrew?: string[];
      fortifications: { road: string[]; roadside: string[] };
      defaultGroupSet: string;
      groupSets: Record<
        string,
        {
          label: string;
          sentry: string;
          defense: { ref: string; size: number };
          small: string[];
          medium: string[];
          large: string[];
        }
      >;
    }
  >;
  export const K: Record<string, unknown>;
  export const MODS: Record<
    string,
    {
      id: string;
      label: string;
      workshopUrl: string;
      dependencies: string[];
      /** Not offered in the UI (broken dep chain etc.); saves using it fall back to vanilla */
      hidden?: boolean;
      factions: Record<string, unknown>;
    }
  >;
  export const ZONE_MODULES: {
    type: string;
    label: string;
    kind: "infantry" | "vehicle" | "fortification" | "slotai" | "qrf-foot" | "qrf-vehicle";
    pool?: string;
    sizes?: string[];
    maxBudget?: number;
    noBudget?: boolean;
    /** QRF modules: max user-placed reinforcement origins (spawn anchors) */
    maxOrigins?: number;
  }[];
  export const OBJECTIVE_TYPES: {
    type: "hvt" | "clear" | "reach" | "destroy" | "deliver";
    label: string;
    /** Trigger radius bounds for area types; absent for hvt/destroy/deliver */
    radius?: { min: number; max: number; default: number };
    /** deliver only: delivery-trigger radius bounds */
    deliveryRadius?: { min: number; max: number; default: number };
  }[];
  /** Destroy-object pool: root-destructible prefabs with shipped thumbnails
   * (web/public/icons/prefabs/<thumb>); vehicles are added by the web modal */
  export const DESTROY_OBJECTS: {
    /** stored identity (mission JSON) + thumb/label key — never changes */
    ref: string;
    label: string;
    cat: "comms" | "fuel" | "cache" | "weapons";
    thumb: string;
    /** GM-editable E_ variant actually spawned (lib.mjs resolves at emission) */
    spawnRef?: string;
    /** destruction-re-enable override prefab descriptor (generator-internal) */
    fix?: { guid: string; cls: string; id: string; cmp?: string; body?: string; extra?: string };
  }[];
  /** Prop footprint: full XZ sizes in meters (w = local X, len = local Z,
   * offX/offZ = box-center offset in prefab-local space) or a disc { d } */
  export type PropFootprint = { w: number; len: number; offX?: number; offZ?: number; d?: undefined } | { d: number; w?: undefined; len?: undefined; offX?: undefined; offZ?: undefined };
  export const PROP_CATEGORIES: {
    key: "militaryBase" | "fortification" | "minefield" | "cargo" | "wreck" | "other";
    label: string;
    /** props in this category may carry an enemy defense group */
    defense?: boolean;
  }[];
  export const PROPS: {
    /** stored identity (mission JSON) — E_ variant where vanilla has one */
    ref: string;
    label: string;
    cat: "militaryBase" | "fortification" | "minefield" | "cargo" | "wreck" | "other";
    /** false = no E_ mirror in vanilla: spawns fine but not GM-editable */
    editable?: boolean;
    /** false = never terrain-tilt (vertical structures: antenna masts) */
    tilt?: boolean;
    fp: PropFootprint;
  }[];
  export const DEFAULT_PROP: string;
  /** Arsenal Builder browse pool: full vanilla item catalog (auto-generated by
   * tools/harvest-arsenal-pool.mjs). ref = {GUID}path identity; name/nameRu =
   * real in-game names (nameRu omitted when identical); type/mode = catalog
   * enums (mode "" = engine default, omitted at emission). */
  export type ArsenalPoolEntry = {
    ref: string;
    name: string;
    nameRu?: string;
    factions: string[];
    category: string;
    type: string;
    mode: string;
  };
  export const ARSENAL_POOL: ArsenalPoolEntry[];
  /** Per-mod arsenal pools keyed by MODS id (e.g. "uk") — browse-list entries
   * gated by enabled mods; lib.mjs unions a mod's deps when its items are used */
  export const MOD_ARSENAL_POOLS: Record<string, ArsenalPoolEntry[]>;
  /** Mandatory addons of EVERY generated mission (ACE Medical) — always in
   * addon.gproj deps and the Important! callout, no UI gating */
  export const CORE_ADDONS: { guid: string; label: string; workshopUrl: string }[];
  /** Core-addon items: always browsable in the Arsenal Builder (no mod gating)
   * and baked into every faction's default crate contents */
  export const CORE_ARSENAL_POOL: ArsenalPoolEntry[];
  /** {mode, ref} view of CORE_ARSENAL_POOL (baked-default shape) */
  export const CORE_ARSENAL_ITEMS: { mode: string; ref: string }[];
  export function resolvePropDefenseGroup(factionKey: string, groupSetKeys: string | string[] | undefined, sizes: string[] | undefined, ordinal?: number): string;
  export function resolveGroupPool(factionKey: string, groupSetKeys: string | string[] | undefined, sizes: string[]): string[];
  export function resolveSentryPool(factionKey: string, groupSetKeys: string | string[] | undefined): string[];
  export function resolveDefenseGroup(factionKey: string, groupSetKeys: string | string[] | undefined): string;
  export function mintGuid(): string;
  export function buildMissionFiles(
    mission: unknown,
    options?: { sampleY?: (x: number, z: number) => number }
  ): {
    files: Record<string, string>;
    guids: { addon: string; world: string; missionConf: string; thumbnail: string };
    addonDirName: string;
  };

  export type LayoutItem = {
    kind: "farp" | "crate" | "spawnPoint" | "vehicle";
    index?: number;
    type?: string;
    cls?: "light" | "heavy" | "heli";
    x: number;
    z: number;
    yaw: number;
    w: number;
    len: number;
  };
  export function layoutSpawnBundle(spawn: { farp: boolean; vehicles?: { type: string }[] }): {
    items: LayoutItem[];
    bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  };
  export function rotateLocal(x: number, z: number, yawDeg: number): [number, number];
  export function itemWorldCorners(
    item: { x: number; z: number; w: number; len: number; yaw?: number },
    originX: number,
    originZ: number,
    yawDeg: number
  ): [number, number][];
  export function vehicleSizeClass(key: string): "light" | "heavy" | "heli";
  /** Pointed-nose vehicle footprint outline (5 points, apex = facing along
   * local +Z). Same signature as itemWorldCorners. */
  export function vehicleWorldOutline(
    item: { x?: number; z?: number; w: number; len: number },
    originX: number,
    originZ: number,
    yawDeg: number
  ): [number, number][];

  // --- Free-placement layer (positioned spawn shape) ---
  export type PositionedSpawn = {
    x: number;
    z: number;
    farp: boolean;
    farpPos?: { x: number; z: number; rotation: number };
    /** Legacy single-point shape — runtime fallback only; new code uses spawnPoints. */
    spawnPoint?: { x: number; z: number };
    spawnPoints?: { id: string; x: number; z: number; denied?: string[] }[];
    crates?: { id: string; x: number; z: number; rotation: number }[];
    vehicles?: { id: string; type: string; x: number; z: number; rotation: number }[];
  };
  export type SpawnElement = {
    kind: "farp" | "crate" | "spawnPoint" | "vehicle";
    key: string;
    id?: string;
    index?: number;
    type?: string;
    cls?: "light" | "heavy" | "heli";
    x: number;
    z: number;
    rotation: number;
    w: number;
    len: number;
  };
  export const ELEMENT_SIZES: Record<"farp" | "crate" | "spawnPoint", { w: number; len: number }>;
  /** FARP interior schematic (map-local meters): cone positions + crate
   * cluster rects — see layout.mjs for the frame convention. */
  export const FARP_DETAIL: {
    cones: [number, number][];
    boxes: { x: number; z: number; w: number; len: number }[];
  };
  export function spawnElements(spawn: PositionedSpawn): SpawnElement[];
  export function spawnElementsBounds(spawn: PositionedSpawn): { minX: number; maxX: number; minZ: number; maxZ: number };
  export function rectsOverlap(
    a: { x: number; z: number; w: number; len: number; rotation?: number },
    b: { x: number; z: number; w: number; len: number; rotation?: number }
  ): boolean;
  export function autoPlaceSpawnElement(
    spawn: PositionedSpawn,
    kind: "crate" | "light" | "heavy" | "heli" | "spawnPoint"
  ): { x: number; z: number; rotation: number };
}
