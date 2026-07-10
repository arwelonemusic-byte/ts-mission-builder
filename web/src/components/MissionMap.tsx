"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { layoutSpawnBundle, itemWorldCorners, FACTIONS, ZONE_MODULES } from "mission-gen";
import { terrainByKey } from "@/lib/terrains";
import type { MissionMarker, Zone } from "@/lib/mission";
import { findColor, findIcon, militaryIconUrl, MARKER_LABEL_OUTLINE, VANILLA_ATLAS } from "@/lib/markers";
import { DISABLED_ICON_FILTER, MODULE_ICONS } from "@/lib/zoneModules";
import { coordsText, scaleLabel, tr, type Lang } from "@/lib/i18n";

// Coordinate mapping (same convention as ts-ops-planner): lat = world Z
// (northing), lng = world X, 1 map unit = 1 meter. For tile pyramids we use a
// custom CRS.Simple transformation (1, 0, -1, maxY) that keeps north up while
// moving pixel space into the positive quadrant (tile paths can't be negative).
// TileLayer zoomOffset bridges pyramid-z (0 = whole map) to Leaflet zoom.

export type MapSpawn = {
  placed: boolean;
  x: number;
  z: number;
  yaw: number;
  farp: boolean;
  vehicles: { type: string }[];
};

/** Pan/zoom request: fit a square of `radius` meters around (x, z). Bump
 * `seq` to trigger — same coords twice still re-centers. */
export type MapFocus = { x: number; z: number; radius: number; seq: number };

/** Imperative surface handed to the page via onApi: placement pings, screen→
 * world conversion (marker drag-drop), and the fit-whole-map HUD button. */
export type MapApi = {
  addPing: (x: number, z: number, color: string) => void;
  screenToWorld: (clientX: number, clientY: number) => { x: number; z: number } | null;
  fitWholeMap: () => void;
};

export type MapProps = {
  terrainKey: string;
  lang: Lang;
  playableFaction: string;
  spawn: MapSpawn;
  zones: Zone[];
  selectedZoneId: string | null;
  markers: MissionMarker[];
  selectedMarkerId: string | null;
  /** Freshly placed ids ("spawn" / zone id / marker id) → entrance animation */
  fresh: Record<string, boolean>;
  placeMode: "spawn" | "zone" | "marker" | null;
  focus: MapFocus | null;
  onMapClick: (x: number, z: number) => void;
  onZoneClick: (id: string) => void;
  onZoneMoved: (id: string, x: number, z: number) => void;
  onSpawnMoved: (x: number, z: number) => void;
  onMarkerClick: (id: string) => void;
  onMarkerMoved: (id: string, x: number, z: number) => void;
  onApi?: (api: MapApi) => void;
};

export default function MissionMap(props: MapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);
  const worldRef = useRef<[number, number]>([0, 0]); // [w, h]
  const scaleBarRef = useRef<HTMLDivElement>(null);
  const scaleLabelRef = useRef<HTMLSpanElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  // Rerun the scale-bar label when the language changes (set by the creation effect)
  const updateScaleRef = useRef<(() => void) | null>(null);
  // Set after a bundle drag so the trailing map "click" doesn't re-place
  // anything while a placeMode is active.
  const suppressClickRef = useRef(false);

  // (Re)create the map when the terrain changes
  useEffect(() => {
    if (!divRef.current) return;
    const t = terrainByKey(props.terrainKey);
    const [w, h] = t.worldSize;
    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [h, w],
    ];

    const crs = L.extend({}, L.CRS.Simple, {
      transformation: new L.Transformation(1, 0, -1, h),
    }) as L.CRS;

    const map = L.map(divRef.current, {
      crs,
      minZoom: -6,
      maxZoom: 4,
      zoomSnap: 0.25,
      attributionControl: false,
      zoomControl: false, // custom HUD buttons instead (design v2)
    });
    L.tileLayer(t.tilePattern, {
      tileSize: 256,
      minZoom: -t.tileMaxZoom,
      maxZoom: 4,
      minNativeZoom: -t.tileMaxZoom,
      maxNativeZoom: 0,
      zoomOffset: t.tileMaxZoom,
      noWrap: true,
      bounds: L.latLngBounds(bounds),
    }).addTo(map);
    map.fitBounds(bounds);
    map.setMaxBounds([
      [-h * 0.1, -w * 0.1],
      [h * 1.1, w * 1.1],
    ]);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }
      propsRef.current.onMapClick(e.latlng.lng, e.latlng.lat);
    });

    const overlay = L.layerGroup().addTo(map);
    mapRef.current = map;
    overlayRef.current = overlay;
    worldRef.current = [w, h];

    // Leaflet only tracks WINDOW resizes; the mobile layout resizes the
    // container itself (sheet height varies per tab) — observe it directly.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(divRef.current);

    // --- HUD: scale bar (bracket sized to a round distance) + coordinates ---
    const updateScale = () => {
      const bar = scaleBarRef.current;
      const lbl = scaleLabelRef.current;
      if (!bar || !lbl) return;
      const pxPerMeter = map.getZoomScale(map.getZoom(), 0); // CRS.Simple: 1 unit = 1 m at z0
      const candidates = [25, 50, 100, 200, 500, 1000, 2000, 5000];
      let c = candidates[candidates.length - 1];
      for (const cand of candidates) {
        const px = cand * pxPerMeter;
        if (px >= 46 && px <= 150) {
          c = cand;
          break;
        }
      }
      bar.style.width = `${Math.round(c * pxPerMeter)}px`;
      lbl.textContent = scaleLabel(propsRef.current.lang, c);
    };
    map.on("zoomend", updateScale);
    updateScale();
    updateScaleRef.current = updateScale;

    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      const el = coordsRef.current;
      if (!el) return;
      const cx = Math.round(Math.min(w, Math.max(0, e.latlng.lng)));
      const cz = Math.round(Math.min(h, Math.max(0, e.latlng.lat)));
      el.textContent = coordsText(propsRef.current.lang, cx, cz);
    });

    // --- imperative API for the page (pings, drag-drop conversion, fit) ---
    propsRef.current.onApi?.({
      addPing: (x, z, color) => {
        const ring = (delay: string) =>
          `<div style="position:absolute;inset:0;border:2px solid ${color};border-radius:50%;animation:mbPing 0.7s ease-out ${delay} both;"></div>`;
        const ping = L.marker([z, x], {
          interactive: false,
          icon: L.divIcon({
            className: "",
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            html: `<div style="position:relative;width:44px;height:44px;">${ring("0s")}${ring("0.15s")}</div>`,
          }),
        }).addTo(map);
        window.setTimeout(() => ping.remove(), 750);
      },
      screenToWorld: (clientX, clientY) => {
        const el = divRef.current;
        const m = mapRef.current;
        if (!el || !m) return null;
        const r = el.getBoundingClientRect();
        if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
        const ll = m.containerPointToLatLng(L.point(clientX - r.left, clientY - r.top));
        const [ww, hh] = worldRef.current;
        return {
          x: +Math.min(ww, Math.max(0, ll.lng)).toFixed(1),
          z: +Math.min(hh, Math.max(0, ll.lat)).toFixed(1),
        };
      },
      fitWholeMap: () => {
        const [ww, hh] = worldRef.current;
        mapRef.current?.fitBounds(
          [
            [0, 0],
            [hh, ww],
          ]
        );
      },
    });

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      overlayRef.current = null;
      updateScaleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.terrainKey]);

  // Refresh the imperative scale-bar label when the language changes
  useEffect(() => {
    updateScaleRef.current?.();
  }, [props.lang]);

  // Pan/zoom to a requested focus point (Show on map, zone-card click)
  useEffect(() => {
    const map = mapRef.current;
    const f = props.focus;
    if (!map || !f) return;
    map.fitBounds(
      [
        [f.z - f.radius, f.x - f.radius],
        [f.z + f.radius, f.x + f.radius],
      ],
      { padding: [24, 24] }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focus?.seq]);

  // Redraw spawn footprint + zones on every relevant change
  useEffect(() => {
    const overlay = overlayRef.current;
    const map = mapRef.current;
    if (!overlay || !map) return;
    overlay.clearLayers();

    if (props.spawn.placed) {
      drawSpawnBundle(
        map,
        overlay,
        props.spawn,
        props.playableFaction,
        props.lang,
        !!props.fresh["spawn"],
        suppressClickRef,
        (x, z) => propsRef.current.onSpawnMoved(x, z)
      );
    }

    for (const [zi, zone] of props.zones.entries()) {
      const selected = zone.id === props.selectedZoneId;
      // The circle itself is NOT interactive — clicks pass through to the map
      // so overlapping zones can be placed. Selection/drag happens on the
      // center dot marker only.
      const circle = L.circle([zone.z, zone.x], {
        radius: zone.radius,
        color: selected ? "#ffcc00" : "#e04b4b",
        weight: selected ? 3 : 2,
        fillColor: "#e04b4b",
        fillOpacity: 0.12,
        interactive: false,
        className: props.fresh[zone.id] ? "mb-fresh-path" : "",
      }).addTo(overlay);

      const dot = L.marker([zone.z, zone.x], {
        icon: zoneDotIcon(selected),
        draggable: true,
      })
        .bindTooltip(zoneTooltipHtml(zone, `Area${zi + 1}`, props.lang), {
          direction: "top",
          offset: [0, -10],
          opacity: 1,
          className: "zone-tip",
        })
        .addTo(overlay);
      dot.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        propsRef.current.onZoneClick(zone.id);
      });
      dot.on("drag", () => circle.setLatLng(dot.getLatLng()));
      dot.on("dragend", () => {
        const ll = dot.getLatLng();
        propsRef.current.onZoneMoved(zone.id, +ll.lng.toFixed(1), +ll.lat.toFixed(1));
      });
    }

    for (const mk of props.markers) {
      const marker = L.marker([mk.z, mk.x], {
        icon: markerDivIcon(mk, mk.id === props.selectedMarkerId, !!props.fresh[mk.id]),
        draggable: true,
      }).addTo(overlay);
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        propsRef.current.onMarkerClick(mk.id);
      });
      marker.on("dragend", () => {
        const ll = marker.getLatLng();
        propsRef.current.onMarkerMoved(mk.id, +ll.lng.toFixed(1), +ll.lat.toFixed(1));
      });
    }
  }, [
    props.spawn,
    props.zones,
    props.selectedZoneId,
    props.markers,
    props.selectedMarkerId,
    props.playableFaction,
    props.lang,
    props.fresh,
  ]);

  return (
    <div className="absolute inset-0">
      <div
        ref={divRef}
        className="mission-map absolute inset-0"
        style={{ cursor: props.placeMode ? "crosshair" : "grab" }}
      />

      {/* placement edge glow */}
      {props.placeMode && (
        <div
          className="absolute inset-0 pointer-events-none z-[900]"
          style={{ boxShadow: "inset 0 0 0 2px rgba(244,219,80,0.35), inset 0 0 80px rgba(244,219,80,0.05)" }}
        />
      )}

      {/* zoom / fit controls (desktop only — mobile pinch-zooms) */}
      <div className="max-md:hidden absolute top-4 right-4 z-[1000] flex flex-col gap-px rounded-[8px] overflow-hidden shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          aria-label={tr(props.lang, "Zoom in")}
          title={tr(props.lang, "Zoom in")}
          onClick={() => mapRef.current?.zoomIn()}
          className="w-9 h-9 bg-[#202427] hover:bg-[#2e3439] active:bg-[#3a4249] text-white text-[18px] font-medium flex items-center justify-center"
        >
          +
        </button>
        <button
          type="button"
          aria-label={tr(props.lang, "Zoom out")}
          title={tr(props.lang, "Zoom out")}
          onClick={() => mapRef.current?.zoomOut()}
          className="w-9 h-9 bg-[#202427] hover:bg-[#2e3439] active:bg-[#3a4249] text-white text-[18px] font-medium flex items-center justify-center"
        >
          −
        </button>
        <button
          type="button"
          aria-label={tr(props.lang, "Fit whole map")}
          title={tr(props.lang, "Fit whole map")}
          onClick={() => {
            const [ww, hh] = worldRef.current;
            mapRef.current?.fitBounds(
              [
                [0, 0],
                [hh, ww],
              ]
            );
          }}
          className="w-9 h-9 bg-[#202427] hover:bg-[#2e3439] active:bg-[#3a4249] text-white/70 flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* scale bar + coordinate readout (desktop only) */}
      <div className="max-md:hidden absolute right-4 bottom-4 z-[1000] pointer-events-none flex flex-col items-end gap-[6px]">
        <div className="flex flex-col items-start gap-[3px] bg-[rgba(32,36,39,0.9)] rounded-[8px] px-[10px] py-[6px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.4)]">
          <div
            ref={scaleBarRef}
            className="h-[5px] transition-[width] duration-150"
            style={{
              borderLeft: "1.5px solid rgba(255,255,255,0.8)",
              borderRight: "1.5px solid rgba(255,255,255,0.8)",
              borderBottom: "1.5px solid rgba(255,255,255,0.8)",
              width: 100,
            }}
          />
          <span ref={scaleLabelRef} className="font-mono text-[10px] leading-none font-medium text-white/60" />
        </div>
        <div className="bg-[rgba(32,36,39,0.9)] rounded-[8px] px-[10px] py-[6px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.4)]">
          <span ref={coordsRef} className="font-mono text-[11px] leading-none font-medium text-white/75">
            {coordsText(props.lang, "—", "—")}
          </span>
        </div>
      </div>
    </div>
  );
}

/** DivIcon for a mission marker: military = pre-colored PNG, custom = atlas
 * sprite recolored via CSS mask. Text label sits to the right of the icon;
 * selection adds a yellow halo ring. */
function markerDivIcon(mk: MissionMarker, selected: boolean, freshDrop = false) {
  const size = 40;
  const label = mk.text.trim().replace(/[<>&"]/g, "");
  const halo = selected
    ? `<div style="position:absolute;inset:-5px;border:2px solid #f4db50;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,0.4),0 0 12px rgba(244,219,80,0.6);"></div>`
    : "";
  let iconHtml: string;
  if (mk.kind === "military") {
    // width/height must be inline STYLE — Tailwind preflight's `img { height: auto }`
    // overrides the presentation attributes and the PNG blows up to 128px.
    iconHtml = `<img src="${militaryIconUrl(mk.faction, mk.type)}" style="display:block;width:${size}px;height:${size}px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.7));" />`;
  } else {
    const icon = findIcon(mk.quad);
    const hex = findColor(mk.color).hex;
    const scale = size / icon.w;
    const mask = `url(${VANILLA_ATLAS.url})`;
    const pos = `-${icon.x * scale}px -${icon.y * scale}px`;
    const msize = `${VANILLA_ATLAS.width * scale}px ${VANILLA_ATLAS.height * scale}px`;
    iconHtml = `<div style="width:${size}px;height:${size}px;background-color:${hex};-webkit-mask-image:${mask};mask-image:${mask};-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:${pos};mask-position:${pos};-webkit-mask-size:${msize};mask-size:${msize};transform:rotate(${mk.rotation}deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,0.7));"></div>`;
  }
  const labelHtml = label
    ? `<div style="position:absolute;left:${size + 4}px;top:50%;transform:translateY(-50%);white-space:nowrap;font:600 12px/1.2 var(--font-roboto),sans-serif;color:#000;text-shadow:${MARKER_LABEL_OUTLINE};">${label}</div>`
    : "";
  const drop = freshDrop ? "animation:mbDrop 0.4s cubic-bezier(0.22,1,0.36,1);" : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="position:relative;width:${size}px;height:${size}px;${drop}">${halo}${iconHtml}${labelHtml}</div>`,
  });
}

/** Zone dot hover tooltip: module chip row, disabled modules greyed with 0
 * (Figma 106:216). Styled via the .zone-tip rules in globals.css. */
function zoneTooltipHtml(zone: Zone, name: string, lang: Lang) {
  const chips = ZONE_MODULES.map((def) => {
    const mod = zone.modules.find((mm) => mm.type === def.type);
    const iconStyle = `width:16px;height:16px;flex:none;${mod ? "" : `filter:${DISABLED_ICON_FILTER};opacity:0.45;`}`;
    const countStyle = `font:400 12px/1 var(--font-roboto),sans-serif;color:${mod ? "#fff" : "#6a767c"};`;
    return `<span style="display:flex;align-items:center;gap:3px;flex:none;"><img src="${MODULE_ICONS[def.type]}" alt="" style="${iconStyle}" /><span style="${countStyle}">${mod?.budget ?? 0}</span></span>`;
  }).join("");
  return `<div style="width:max-content;">
    <div style="display:flex;align-items:baseline;gap:8px;"><span style="font:700 12px/1.2 var(--font-roboto),sans-serif;color:#fff;">${name}</span><span style="font:400 11px/1.2 var(--font-roboto),sans-serif;color:rgba(255,255,255,0.5);">${zone.radius} ${lang === "ru" ? "м" : "m"}</span></div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:6px;">${chips}</div>
  </div>`;
}

/** Small round handle at a zone's center — the only clickable/draggable part.
 * On touch devices the 14px dot gets a transparent 32px hit box. */
function zoneDotIcon(selected: boolean) {
  const color = selected ? "#ffcc00" : "#e04b4b";
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const dot = `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);cursor:move;"></div>`;
  if (!coarse) {
    return L.divIcon({ className: "", iconSize: [14, 14], iconAnchor: [7, 7], html: dot });
  }
  return L.divIcon({
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">${dot}</div>`,
  });
}

/** True-scale spawn bundle footprint: bounding box + per-item glyphs.
 * The whole footprint is draggable — grab any part of it to move the spawn. */
function drawSpawnBundle(
  map: L.Map,
  overlay: L.LayerGroup,
  spawn: MapSpawn,
  faction: string,
  lang: Lang,
  freshPlace: boolean,
  suppressClickRef: { current: boolean },
  onSpawnMoved: (x: number, z: number) => void
) {
  const { items, bounds } = layoutSpawnBundle(spawn);
  const labels = FACTIONS[faction]?.vehicleLabels ?? {};
  const grab = freshPlace ? "cursor-move mb-fresh-path" : "cursor-move";
  const toLatLngs = (corners: [number, number][]) =>
    corners.map(([x, z]) => [z, x] as [number, number]);

  const dragLayers: (L.Polygon | L.Circle)[] = [];

  // Bounding box (dashed). Transparent fill keeps the interior grabbable.
  const box = {
    x: (bounds.minX + bounds.maxX) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2,
    w: bounds.maxX - bounds.minX,
    len: bounds.maxZ - bounds.minZ,
  };
  dragLayers.push(
    L.polygon(toLatLngs(itemWorldCorners(box, spawn.x, spawn.z, spawn.yaw)), {
      color: "#3fa9f5",
      weight: 1.5,
      dashArray: "6 4",
      fillColor: "#3fa9f5",
      fillOpacity: 0.02,
      className: grab,
    }).addTo(overlay)
  );

  for (const it of items) {
    const corners = toLatLngs(itemWorldCorners(it, spawn.x, spawn.z, spawn.yaw));
    if (it.kind === "farp") {
      dragLayers.push(
        L.polygon(corners, {
          color: "#3fa9f5",
          weight: 1,
          fillColor: "#3fa9f5",
          fillOpacity: 0.15,
          className: grab,
        }).addTo(overlay)
      );
      // vehicle maintenance trigger radius
      dragLayers.push(
        L.circle([spawn.z, spawn.x], {
          radius: 10,
          color: "#3fa9f5",
          weight: 1,
          dashArray: "2 4",
          fill: false,
          interactive: false,
        }).addTo(overlay)
      );
    } else if (it.kind === "crate") {
      dragLayers.push(
        L.polygon(corners, {
          color: "#50c878",
          weight: 1.5,
          fillColor: "#50c878",
          fillOpacity: 0.6,
          className: grab,
        })
          .bindTooltip(tr(lang, "Arsenal crate"), { direction: "top" })
          .addTo(overlay)
      );
    } else if (it.kind === "spawnPoint") {
      dragLayers.push(
        L.polygon(corners, {
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#ffffff",
          fillOpacity: 0.6,
          className: grab,
        })
          .bindTooltip(tr(lang, "Spawn point"), { direction: "top" })
          .addTo(overlay)
      );
    } else {
      const isHeli = it.cls === "heli";
      const color = isHeli ? "#c792ea" : "#f5c542";
      dragLayers.push(
        L.polygon(corners, {
          color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: isHeli ? 0.15 : 0.45,
          className: grab,
        })
          .bindTooltip(`${(it.index ?? 0) + 1}. ${labels[it.type ?? ""] ?? it.type}`, {
            direction: "top",
          })
          .addTo(overlay)
      );
    }
  }

  makeBundleDraggable(map, dragLayers, spawn, suppressClickRef, onSpawnMoved);
}

/** Manual drag for the bundle's vector layers (Leaflet paths aren't natively
 * draggable). Mousedown on any layer pauses map panning, mousemove shifts
 * every layer live, mouseup commits the delta via onSpawnMoved.
 * Intentionally mouse-only: on touch devices the spawn is moved via the
 * SpawnPanel "Move spawn (click map)" button + tap (Leaflet's synthesized
 * click). Marker/zone drags use native Leaflet draggables (touch-safe). */
function makeBundleDraggable(
  map: L.Map,
  layers: (L.Polygon | L.Circle)[],
  spawn: MapSpawn,
  suppressClickRef: { current: boolean },
  onSpawnMoved: (x: number, z: number) => void
) {
  let start: L.LatLng | null = null;
  let snapshots: { poly?: L.LatLng[][]; center?: L.LatLng }[] = [];

  const shift = (dLat: number, dLng: number) => {
    layers.forEach((ly, i) => {
      const snap = snapshots[i];
      if (ly instanceof L.Circle && snap.center) {
        ly.setLatLng(L.latLng(snap.center.lat + dLat, snap.center.lng + dLng));
      } else if (ly instanceof L.Polygon && snap.poly) {
        ly.setLatLngs(
          snap.poly.map((ring) => ring.map((p) => L.latLng(p.lat + dLat, p.lng + dLng)))
        );
      }
    });
  };

  const onMove = (e: L.LeafletMouseEvent) => {
    if (!start) return;
    shift(e.latlng.lat - start.lat, e.latlng.lng - start.lng);
  };

  const onUp = (e: L.LeafletMouseEvent) => {
    map.off("mousemove", onMove);
    map.off("mouseup", onUp);
    map.dragging.enable();
    if (!start) return;
    const dLat = e.latlng.lat - start.lat;
    const dLng = e.latlng.lng - start.lng;
    start = null;
    if (Math.abs(dLat) > 0.5 || Math.abs(dLng) > 0.5) {
      // A real drag — swallow the trailing map click (it fires synchronously
      // after mouseup, if the browser emits one at all; expire the flag so a
      // missing click can't eat the next genuine one).
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 100);
      onSpawnMoved(+(spawn.x + dLng).toFixed(1), +(spawn.z + dLat).toFixed(1));
    }
  };

  for (const ly of layers) {
    if (ly.options.interactive === false) continue;
    ly.on("mousedown", (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      map.dragging.disable();
      start = e.latlng;
      snapshots = layers.map((l) =>
        l instanceof L.Circle
          ? { center: l.getLatLng() }
          : { poly: (l.getLatLngs() as L.LatLng[][]).map((ring) => ring.map((p) => L.latLng(p.lat, p.lng))) }
      );
      map.on("mousemove", onMove);
      map.on("mouseup", onUp);
    });
  }
}
