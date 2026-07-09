declare module "mission-gen" {
  export const TERRAINS: Record<string, { label: string; parent: string; nav: string[] }>;
  export const FACTIONS: Record<
    string,
    {
      entryGuid: string;
      callsignGuid: string;
      squadBase: string[];
      squadFifth: string | null;
      spawnPoint: string;
      riflemen: Record<string, string>;
      loadoutSets: Record<string, { name: string; prefab: string }[]>;
      arsenalItems: { mode: string; ref: string }[];
      vehicles: Record<string, string>;
      vehicleLabels: Record<string, string>;
      patrolVehicleKeys: string[];
      fortifications: { road: string[]; roadside: string[] };
      defaultGroupSet: string;
      groupSets: Record<
        string,
        { label: string; sentry: string; small: string[]; medium: string[]; large: string[] }
      >;
    }
  >;
  export const K: Record<string, unknown>;
  export const ZONE_MODULES: {
    type: string;
    label: string;
    kind: "infantry" | "vehicle" | "fortification";
    pool?: string;
    sizes?: string[];
    maxBudget?: number;
  }[];
  export function resolveGroupPool(factionKey: string, groupSetKeys: string | string[] | undefined, sizes: string[]): string[];
  export function resolveSentryPool(factionKey: string, groupSetKeys: string | string[] | undefined): string[];
  export function mintGuid(): string;
  export function buildMissionFiles(
    mission: unknown,
    options?: { sampleY?: (x: number, z: number) => number }
  ): {
    files: Record<string, string>;
    guids: { addon: string; world: string; missionConf: string };
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
