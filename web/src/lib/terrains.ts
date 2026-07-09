// Map display config for the three vanilla terrains. Bounds calibrated in
// ts-ops-planner (worldUR there); heightmaps extracted from game .terr data.
export type TerrainConfig = {
  key: string; // generator terrain key (arland | eden | cain)
  label: string;
  worldSize: [number, number]; // [width(X), height(Z)] of the map in meters
  heightmapBin: string;
  heightmapMeta: string;
  /** XYZ tile pyramid (from ts-ops-planner tooling) */
  tilePattern: string;
  tileMaxZoom: number;
};

export const TERRAIN_LIST: TerrainConfig[] = [
  {
    key: "arland",
    label: "Arland",
    worldSize: [4100, 4100],
    heightmapBin: "/heightmaps/arland.bin",
    heightmapMeta: "/heightmaps/arland.json",
    tilePattern: "/tiles/arland/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
  },
  {
    key: "eden",
    label: "Everon",
    worldSize: [13000, 13000],
    heightmapBin: "/heightmaps/everon.bin",
    heightmapMeta: "/heightmaps/everon.json",
    tilePattern: "/tiles/everon/{z}/{x}/{y}.jpg",
    tileMaxZoom: 6,
  },
  {
    key: "cain",
    label: "Kolguyev",
    worldSize: [13000, 13000],
    heightmapBin: "/heightmaps/kolguyev.bin",
    heightmapMeta: "/heightmaps/kolguyev.json",
    tilePattern: "/tiles/kolguyev/{z}/{x}/{y}.jpg",
    tileMaxZoom: 6,
  },
];

export const terrainByKey = (key: string): TerrainConfig =>
  TERRAIN_LIST.find((t) => t.key === key) ?? TERRAIN_LIST[0];
