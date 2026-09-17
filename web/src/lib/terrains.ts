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
  /** Optional satellite-style pyramid (nadir World Editor captures stitched by
   * ts-ops-planner `nadir_mosaic.py`, then `tile_pyramid.py`). Unlike the topo
   * pyramid (1 px = 1 m at its deepest level) this one is sharper: its deepest
   * level holds 2^nativeZoom px per metre, so the map serves it up to Leaflet
   * zoom `nativeZoom` before upscaling. */
  sat?: SatTiles;
  /** Terrain comes from a workshop mod (rendered below vanilla in the dropdown) */
  modded?: boolean;
  /** Workshop page of the map addon (modded terrains only) — shown in the required-addons callout */
  workshopUrl?: string;
};

export type SatTiles = {
  tilePattern: string;
  tileMaxZoom: number;
  /** log2 of the pixels-per-metre at tileMaxZoom (2 = 4 px/m) */
  nativeZoom: number;
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
    // 2026-09-17: re-captured with the settled recipe (step 100 / column step 200 / 1200 m,
    // 882 frames), ortho-stitched, exactly 4 px/m (16400 px) so it aligns with the CRS.
    sat: { tilePattern: "/tiles/arland-sat/{z}/{x}/{y}.jpg", tileMaxZoom: 7, nativeZoom: 2 },
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
    // 2026-09-16: 4096 EnfusionMapMaker frames (step 200, ortho-stitched against
    // the heightmap), rendered at exactly 4 px/m → 52000 px → pyramid max_z 8.
    sat: { tilePattern: "/tiles/kolguyev-sat/{z}/{x}/{y}.jpg", tileMaxZoom: 8, nativeZoom: 2 },
  },
  // Modded terrains (assets calibrated in ts-ops-planner; generator side in
  // generator/catalogue.mjs TERRAINS carries the addon dependency GUIDs).
  {
    key: "armenhof",
    label: "Armenhof",
    worldSize: [3840, 3840],
    heightmapBin: "/heightmaps/armenhof.bin",
    heightmapMeta: "/heightmaps/armenhof.json",
    tilePattern: "/tiles/armenhof/{z}/{x}/{y}.jpg",
    tileMaxZoom: 4,
    // 2026-09-16: 1369 nadir frames (step 100 / 1200 m), ortho-stitched, 4 px/m -> 15360 px -> max_z 6.
    sat: { tilePattern: "/tiles/armenhof-sat/{z}/{x}/{y}.jpg", tileMaxZoom: 6, nativeZoom: 2 },
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/656514EAA451A2B2-Armenhof",
  },
  {
    key: "chernarus",
    label: "Chernarus",
    worldSize: [15360, 15360],
    // ?v=2: cache-buster for the 2026-08-19 terrain-update re-capture — the
    // tile/heightmap URLs are otherwise stable and browsers cache the old
    // bytes with heuristic freshness (Caddy sends no Cache-Control). Bump on
    // every future asset refresh.
    heightmapBin: "/heightmaps/chernarus.bin?v=2",
    heightmapMeta: "/heightmaps/chernarus.json",
    tilePattern: "/tiles/chernarus/{z}/{x}/{y}.jpg?v=2",
    tileMaxZoom: 6,
    // 2026-09-17: 23716 nadir frames (step 100 / 1200 m), ortho-stitched, shipped at
    // 2 px/m (30720 px -> max_z 7, nativeZoom 1) to keep the repo size sane on a 15 km map.
    sat: { tilePattern: "/tiles/chernarus-sat/{z}/{x}/{y}.jpg", tileMaxZoom: 7, nativeZoom: 1 },
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/665D1AA55B5D8076-ChernarusMinus",
  },
  {
    key: "faircroft",
    label: "Faircroft Islands",
    worldSize: [12800, 12800],
    heightmapBin: "/heightmaps/faircroft.bin",
    heightmapMeta: "/heightmaps/faircroft.json",
    tilePattern: "/tiles/faircroft/{z}/{x}/{y}.jpg",
    tileMaxZoom: 6,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/614B62005CBB8057-FaircroftIslands",
  },
  {
    key: "iraq1990",
    label: "Iraq 1990",
    worldSize: [4000, 4000],
    heightmapBin: "/heightmaps/iraq1990.bin",
    heightmapMeta: "/heightmaps/iraq1990.json",
    tilePattern: "/tiles/iraq1990/{z}/{x}/{y}.jpg",
    tileMaxZoom: 4,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/61A56756149009FF-Iraq1990",
  },
  {
    key: "kunar",
    label: "Kunar Province",
    worldSize: [4000, 4000],
    heightmapBin: "/heightmaps/kunar.bin",
    heightmapMeta: "/heightmaps/kunar.json",
    tilePattern: "/tiles/kunar/{z}/{x}/{y}.jpg",
    tileMaxZoom: 4,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/5C9691EA7FD7A79F-KunarProvince",
  },
  {
    key: "ruha",
    label: "Ruha",
    worldSize: [8000, 8000],
    heightmapBin: "/heightmaps/ruha.bin",
    heightmapMeta: "/heightmaps/ruha.json",
    tilePattern: "/tiles/ruha/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/653CB36244ADBE0F-Ruha",
  },
  {
    key: "serhiivka",
    label: "Serhiivka",
    worldSize: [10000, 10000],
    heightmapBin: "/heightmaps/serhiivka.bin",
    heightmapMeta: "/heightmaps/serhiivka.json",
    tilePattern: "/tiles/serhiivka/{z}/{x}/{y}.jpg",
    tileMaxZoom: 6,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/61557578724DBE60-WCSSerhiivka",
  },
  {
    key: "takistan",
    label: "Takistan",
    worldSize: [12900, 12900],
    heightmapBin: "/heightmaps/takistan.bin",
    heightmapMeta: "/heightmaps/takistan.json",
    tilePattern: "/tiles/takistan/{z}/{x}/{y}.jpg",
    tileMaxZoom: 6,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/615EEBD9BDFEEE9B-Takistan",
  },
  {
    key: "zargabad",
    label: "Zargabad",
    worldSize: [8000, 8000],
    heightmapBin: "/heightmaps/zargabad.bin",
    heightmapMeta: "/heightmaps/zargabad.json",
    tilePattern: "/tiles/zargabad/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/662B602B3F823F27-Zargabad",
  },
  {
    key: "zarichne",
    label: "Zarichne",
    worldSize: [4600, 4600],
    heightmapBin: "/heightmaps/zarichne.bin",
    heightmapMeta: "/heightmaps/zarichne.json",
    tilePattern: "/tiles/zarichne/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/61732D4F7D980E9A-Zarichne",
  },
  {
    key: "merak",
    label: "Merak",
    worldSize: [10240, 10240],
    heightmapBin: "/heightmaps/merak.bin",
    heightmapMeta: "/heightmaps/merak.json",
    tilePattern: "/tiles/merak/{z}/{x}/{y}.jpg",
    tileMaxZoom: 6,
    // 2026-09-17: 10609 nadir frames (step 100 / 1200 m), ortho-stitched against the
    // re-shipped 1.0.28 heightmap; 4 px/m (40960 px -> max_z 8) — 2 px/m read blurry at
    // the zoom levels people actually use (user decision), so only Chernarus stays at 2.
    sat: { tilePattern: "/tiles/merak-sat/{z}/{x}/{y}.jpg", tileMaxZoom: 8, nativeZoom: 2 },
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/6047000574D60BF9-MerakIsland",
  },
  {
    key: "mogadishu",
    label: "Mogadishu",
    worldSize: [6000, 6000],
    heightmapBin: "/heightmaps/mogadishu.bin",
    heightmapMeta: "/heightmaps/mogadishu.json",
    tilePattern: "/tiles/mogadishu/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/5F1D02080409E128-Mogadishu",
  },
  {
    key: "alhadra",
    label: "Al Hadra",
    worldSize: [8192, 8192],
    heightmapBin: "/heightmaps/alhadra.bin",
    heightmapMeta: "/heightmaps/alhadra.json",
    tilePattern: "/tiles/alhadra/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/68957914EA45BA6C-ALHadra",
  },
  {
    key: "novka",
    label: "Novka",
    worldSize: [2816, 2816],
    heightmapBin: "/heightmaps/novka.bin",
    heightmapMeta: "/heightmaps/novka.json",
    tilePattern: "/tiles/novka/{z}/{x}/{y}.jpg",
    tileMaxZoom: 4,
    // 2026-09-16: 841 nadir frames (step 100 / 1200 m — seams 1.0 m median vs 2.7 m at
    // step 200 / 950 m), ortho-stitched, 4 px/m → 11264 px → max_z 6.
    sat: { tilePattern: "/tiles/novka-sat/{z}/{x}/{y}.jpg", tileMaxZoom: 6, nativeZoom: 2 },
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/6550CDE61DD51E14-Novka",
  },
  {
    key: "westzagoria",
    label: "West Zagoria",
    worldSize: [4608, 4608],
    heightmapBin: "/heightmaps/westzagoria.bin",
    heightmapMeta: "/heightmaps/westzagoria.json",
    tilePattern: "/tiles/westzagoria/{z}/{x}/{y}.jpg",
    tileMaxZoom: 5,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/6044F5AB4E6F9D5A-WestZagoria",
  },
  {
    key: "seitenbuch",
    label: "Seitenbuch",
    // First non-square terrain (4096x2048 tile extent, 1 px = 1 m at z4)
    worldSize: [4000, 2000],
    heightmapBin: "/heightmaps/seitenbuch.bin",
    heightmapMeta: "/heightmaps/seitenbuch.json",
    tilePattern: "/tiles/seitenbuch/{z}/{x}/{y}.jpg",
    tileMaxZoom: 4,
    modded: true,
    workshopUrl: "https://reforger.armaplatform.com/workshop/5F031E702D6FAAB1-Seitenbuch-Germany",
  },
];

export const terrainByKey = (key: string): TerrainConfig =>
  TERRAIN_LIST.find((t) => t.key === key) ?? TERRAIN_LIST[0];

/** Square map thumbnail for the Terrain picker — built from the tile pyramid
 * by `node generator/tools/build-terrain-thumbs.mjs` (re-run after adding a
 * terrain or re-capturing its tiles). */
export const terrainThumb = (key: string) => `/icons/terrains/${key}.jpg`;

/** "13 × 13 km" — one decimal only when the size isn't a whole kilometre */
export function formatWorldSize([w, h]: [number, number]): string {
  const km = (m: number) => {
    const v = Math.round(m / 100) / 10;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  };
  return `${km(w)} × ${km(h)} km`;
}
