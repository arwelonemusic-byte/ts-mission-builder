declare module "mission-gen" {
  export const TERRAINS: Record<
    string,
    {
      label: string;
      parent: string;
      nav: string[];
      dependencies?: string[];
      parentHasPerceptionManager?: boolean;
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
      /** Loadout-pack pseudo-factions (SFS): playable side only, never enemy */
      playableOnly?: boolean;
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
}
