// Shared, module-cached heightmap samplers — used by the export pipeline
// (elevation stamping) and the 3D view (terrain mesh). One fetch per terrain.
import { loadHeightmap, type HeightmapSampler } from "./heightmap";
import { terrainByKey } from "./terrains";

const samplerCache = new Map<string, Promise<HeightmapSampler>>();

export function getSampler(terrainKey: string): Promise<HeightmapSampler> {
  let p = samplerCache.get(terrainKey);
  if (!p) {
    const t = terrainByKey(terrainKey);
    p = loadHeightmap(t.heightmapBin, t.heightmapMeta);
    samplerCache.set(terrainKey, p);
  }
  return p;
}
