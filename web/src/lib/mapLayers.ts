import type { PlaceMode } from "@/lib/mission";

// Map layer visibility (view preference, per browser — never part of the
// mission). A hidden layer is filtered out of the map props entirely, so it
// neither renders nor catches clicks/drags in either view. The spawn base and
// the stop-artillery trigger are always visible by decision (2026-09-22);
// QRF origins, advanced elements and waypoints belong to their zone and follow
// the AI-zones flag; sectors live on the Markers tab and follow markers.
export type MapLayerKey = "markers" | "zones" | "props" | "objectives";
export type MapLayers = Record<MapLayerKey, boolean>;

export const MAP_LAYER_KEYS: MapLayerKey[] = ["markers", "zones", "props", "objectives"];

/** UI labels (i18n keys — the step tabs use the same strings). */
export const MAP_LAYER_LABELS: Record<MapLayerKey, string> = {
  markers: "Markers",
  zones: "AI Zones",
  props: "Props",
  objectives: "Objectives",
};

export const ALL_LAYERS_VISIBLE: MapLayers = { markers: true, zones: true, props: true, objectives: true };

export const MAP_LAYERS_STORAGE_KEY = "ts-mission-builder-layers";

export function loadMapLayers(): MapLayers {
  try {
    const raw = localStorage.getItem(MAP_LAYERS_STORAGE_KEY);
    if (!raw) return ALL_LAYERS_VISIBLE;
    const parsed = JSON.parse(raw) as Partial<Record<string, unknown>>;
    const out = { ...ALL_LAYERS_VISIBLE };
    for (const k of MAP_LAYER_KEYS) if (parsed[k] === false) out[k] = false;
    return out;
  } catch {
    return ALL_LAYERS_VISIBLE;
  }
}

export function saveMapLayers(v: MapLayers) {
  try {
    localStorage.setItem(MAP_LAYERS_STORAGE_KEY, JSON.stringify(v));
  } catch {
    // storage unavailable — the preference just won't persist
  }
}

export function hiddenLayerCount(v: MapLayers): number {
  return MAP_LAYER_KEYS.filter((k) => !v[k]).length;
}

/** True when `key` is the ONLY visible layer (the "only" link's active state). */
export function isSoloLayer(v: MapLayers, key: MapLayerKey): boolean {
  return v[key] && MAP_LAYER_KEYS.every((k) => k === key || !v[k]);
}

/** Solo `key`; soloing the already-solo layer restores all four (toggle-back). */
export function soloLayer(v: MapLayers, key: MapLayerKey): MapLayers {
  if (isSoloLayer(v, key)) return ALL_LAYERS_VISIBLE;
  const out = { markers: false, zones: false, props: false, objectives: false };
  out[key] = true;
  return out;
}

/** Which layer a placement mode drops onto (null = always-visible content). */
export function placeModeLayer(mode: PlaceMode): MapLayerKey | null {
  switch (mode) {
    case "marker":
      return "markers";
    case "zone":
    case "qrf-origin":
    case "zone-element":
      return "zones";
    case "objective":
    case "delivery":
      return "objectives";
    case "prop":
      return "props";
    default:
      return null;
  }
}
