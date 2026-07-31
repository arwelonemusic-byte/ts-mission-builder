"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { layoutSpawnBundle, itemWorldCorners, rotateLocal, FACTIONS } from "mission-gen";
import { terrainByKey } from "@/lib/terrains";
import type { MissionMarker, MissionSector, Zone } from "@/lib/mission";
import {
  distanceLabel,
  distancePillHtml,
  markerHtml,
  originBadgeHtml,
  pingHtml,
  zoneDotHtml,
  zoneTooltipHtml,
} from "@/lib/overlayHtml";
import { ORIGIN_COLORS } from "@/lib/zoneModules";
import { coordsText, scaleLabel, tr, zoneName, type Lang } from "@/lib/i18n";
import MapViewControls from "@/components/MapViewControls";

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
  /** Current viewport as a fit-square (used to hand the view over to 3D). */
  getView?: () => { x: number; z: number; radius: number } | null;
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
  sectors: MissionSector[];
  selectedSectorId: string | null;
  /** Armed sector draw mode: drag on the map creates an AO/objective rectangle */
  sectorDraw: "ao" | "objective" | null;
  /** Freshly placed ids ("spawn" / zone id / marker id) → entrance animation */
  fresh: Record<string, boolean>;
  placeMode: "spawn" | "zone" | "marker" | "qrf-origin" | null;
  focus: MapFocus | null;
  onMapClick: (x: number, z: number) => void;
  onZoneClick: (id: string) => void;
  onZoneMoved: (id: string, x: number, z: number) => void;
  /** QRF reinforcement origin dragged to a new position */
  onOriginMoved: (zoneId: string, moduleType: string, index: number, x: number, z: number) => void;
  /** Selected origin (two-way with the panel rows) */
  selectedOrigin: { zoneId: string; moduleType: string; index: number } | null;
  /** Origin badge clicked on the map → page selects its panel row */
  onOriginClick: (zoneId: string, moduleType: string, index: number) => void;
  onSpawnMoved: (x: number, z: number) => void;
  onMarkerClick: (id: string) => void;
  onMarkerMoved: (id: string, x: number, z: number) => void;
  onSectorDrawn: (kind: "ao" | "objective", x: number, z: number, length: number, width: number) => void;
  onSectorClick: (id: string) => void;
  onSectorChanged: (
    id: string,
    patch: Partial<Pick<MissionSector, "x" | "z" | "length" | "width" | "rotation">>
  ) => void;
  onApi?: (api: MapApi) => void;
  /** 2D/3D view toggle state + handler (rendered in the HUD cluster) */
  view3D: boolean;
  onToggleView: () => void;
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

    // The tile pyramids are padded to power-of-two squares with a dark-navy
    // filler baked into the JPGs south/east of the map. Mask everything
    // outside the world bounds with the page background so that padding never
    // shows (donut polygon: huge outer ring, world rect as evenodd hole).
    // Added before the overlay group → renders above tiles, below vectors.
    const maskMargin = Math.max(w, h) * 4;
    L.polygon(
      [
        [
          [-maskMargin, -maskMargin],
          [h + maskMargin, -maskMargin],
          [h + maskMargin, w + maskMargin],
          [-maskMargin, w + maskMargin],
        ],
        [
          [0, 0],
          [h, 0],
          [h, w],
          [0, w],
        ],
      ],
      { stroke: false, fillColor: "#0d0f11", fillOpacity: 1, interactive: false }
    ).addTo(map);

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
        const ping = L.marker([z, x], {
          interactive: false,
          icon: L.divIcon({
            className: "",
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            html: pingHtml(color),
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
      getView: () => {
        const m = mapRef.current;
        if (!m) return null;
        const size = m.getSize();
        if (size.x === 0 || size.y === 0) return null; // hidden — no usable view
        const c = m.getCenter();
        const b = m.getBounds();
        const radius = Math.min(b.getEast() - b.getWest(), b.getNorth() - b.getSouth()) / 2;
        return { x: c.lng, z: c.lat, radius };
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

  // Pan/zoom to a requested focus point (Show on map, zone-card click).
  // Skip while hidden behind the 3D view (display:none → size 0): fitBounds
  // on a 0-size map lands on a garbage max-zoom view, and the request is
  // being serviced by the 3D camera anyway.
  useEffect(() => {
    const map = mapRef.current;
    const f = props.focus;
    if (!map || !f) return;
    const size = map.getSize();
    if (size.x === 0 || size.y === 0) return;
    map.fitBounds(
      [
        [f.z - f.radius, f.x - f.radius],
        [f.z + f.radius, f.x + f.radius],
      ],
      { padding: [24, 24] }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focus?.seq]);

  // Sector draw mode: drag an axis-aligned rectangle on the map. Panning is
  // suspended while armed; pointer events give one code path for mouse+touch.
  useEffect(() => {
    const map = mapRef.current;
    const el = divRef.current;
    const kind = props.sectorDraw;
    if (!map || !el || !kind) return;
    map.dragging.disable();
    const prevTouchAction = el.style.touchAction;
    el.style.touchAction = "none"; // stop browser pan/scroll on touch drags

    const [w, h] = worldRef.current;
    const clampLL = (ll: L.LatLng) =>
      L.latLng(Math.min(h, Math.max(0, ll.lat)), Math.min(w, Math.max(0, ll.lng)));
    let anchor: L.LatLng | null = null;
    let preview: L.Polygon | null = null;

    const ringFor = (a: L.LatLng, b: L.LatLng): [number, number][] => [
      [a.lat, a.lng],
      [a.lat, b.lng],
      [b.lat, b.lng],
      [b.lat, a.lng],
    ];

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      anchor = clampLL(map.mouseEventToLatLng(e));
    };
    const onMove = (e: PointerEvent) => {
      if (!anchor || !e.isPrimary) return;
      const ring = ringFor(anchor, clampLL(map.mouseEventToLatLng(e)));
      if (!preview) {
        const color = kind === "ao" ? "#000000" : "#9f2828";
        preview = L.polygon(ring, {
          color,
          weight: 2,
          dashArray: "6 4",
          fillColor: color,
          fillOpacity: 0.08,
          interactive: false,
        }).addTo(map);
      } else {
        preview.setLatLngs(ring);
      }
    };
    const finish = (e: PointerEvent, commit: boolean) => {
      if (!anchor || !e.isPrimary) return;
      const a = anchor;
      const cur = clampLL(map.mouseEventToLatLng(e));
      anchor = null;
      preview?.remove();
      preview = null;
      if (!commit) return;
      const length = Math.abs(cur.lng - a.lng); // local X extent
      const width = Math.abs(cur.lat - a.lat); // local Z extent
      if (length < 10 || width < 10) return; // too small — cancel silently
      // Swallow the trailing map click so it can't instantly deselect
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 100);
      propsRef.current.onSectorDrawn(
        kind,
        +((cur.lng + a.lng) / 2).toFixed(1),
        +((cur.lat + a.lat) / 2).toFixed(1),
        +length.toFixed(1),
        +width.toFixed(1)
      );
    };
    const onUp = (e: PointerEvent) => finish(e, true);
    const onCancel = (e: PointerEvent) => finish(e, false);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onCancel);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onCancel);
      preview?.remove();
      map.dragging.enable();
      el.style.touchAction = prevTouchAction;
    };
  }, [props.sectorDraw]);

  // Redraw spawn footprint + zones on every relevant change
  useEffect(() => {
    const overlay = overlayRef.current;
    const map = mapRef.current;
    if (!overlay || !map) return;
    overlay.clearLayers();

    // Sectors first — their fills are non-interactive and everything else
    // (spawn bundle, zone dots, markers) must stay clickable above them.
    for (const s of props.sectors) {
      drawSector(
        map,
        overlay,
        s,
        s.id === props.selectedSectorId,
        worldRef.current,
        !!props.fresh[s.id],
        suppressClickRef,
        (id) => propsRef.current.onSectorClick(id),
        (id, patch) => propsRef.current.onSectorChanged(id, patch)
      );
    }

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
        color: selected ? "#ffcc00" : "#9333ea",
        weight: selected ? 3 : 2,
        fillColor: "#9333ea",
        fillOpacity: 0.12,
        interactive: false,
        className: props.fresh[zone.id] ? "mb-fresh-path" : "",
      }).addTo(overlay);

      const dot = L.marker([zone.z, zone.x], {
        icon: zoneDotIcon(selected),
        draggable: true,
      })
        .bindTooltip(zoneTooltipHtml(zone, zoneName(props.lang, zi + 1), props.lang), {
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

      // QRF reinforcement origins: colored badge + dashed line to the zone
      // center. Badges are draggable; the line follows live during drags
      // (of the origin here, of the zone via full redraw on commit). While
      // dragging, a distance pill sits at the line midpoint.
      for (const mod of zone.modules) {
        const color = ORIGIN_COLORS[mod.type];
        if (!color || !mod.origins?.length) continue;
        for (const [oi, origin] of mod.origins.entries()) {
          const so = props.selectedOrigin;
          const selOrigin =
            so?.zoneId === zone.id && so.moduleType === mod.type && so.index === oi;
          const line = L.polyline(
            [
              [origin.z, origin.x],
              [zone.z, zone.x],
            ],
            { color, weight: 2, dashArray: "6 6", opacity: 0.85, interactive: false }
          ).addTo(overlay);
          const badge = L.marker([origin.z, origin.x], {
            icon: originBadgeIcon(mod.type, color, selOrigin),
            draggable: true,
          })
            .bindTooltip(
              `${zoneName(props.lang, zi + 1)} · ${tr(props.lang, "Origin")} ${oi + 1}`,
              { direction: "top", offset: [0, -12], opacity: 1 }
            )
            .addTo(overlay);
          badge.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            propsRef.current.onOriginClick(zone.id, mod.type, oi);
          });
          let distPill: L.Marker | null = null;
          // The hover tooltip fights the distance pill during a drag (it
          // re-opens on mouseover) — unbind it; the post-drop redraw rebinds.
          badge.on("dragstart", () => badge.unbindTooltip());
          badge.on("drag", () => {
            const ll = badge.getLatLng();
            line.setLatLngs([
              [ll.lat, ll.lng],
              [zone.z, zone.x],
            ]);
            // Distance pill at the line midpoint, live during the drag
            const dist = Math.hypot(ll.lng - zone.x, ll.lat - zone.z);
            const mid: [number, number] = [(ll.lat + zone.z) / 2, (ll.lng + zone.x) / 2];
            if (!distPill) {
              distPill = L.marker(mid, {
                icon: distancePillIcon(dist, propsRef.current.lang),
                interactive: false,
              }).addTo(overlay);
            } else {
              distPill.setLatLng(mid);
              // Update the label in place — setIcon would rebuild the DOM node
              // on every drag tick and flicker.
              const el = distPill.getElement()?.querySelector(".mb-dist-pill");
              if (el) el.textContent = distanceLabel(dist, propsRef.current.lang);
            }
          });
          badge.on("dragend", () => {
            distPill?.remove();
            distPill = null;
            const ll = badge.getLatLng();
            propsRef.current.onOriginMoved(
              zone.id,
              mod.type,
              oi,
              +ll.lng.toFixed(1),
              +ll.lat.toFixed(1)
            );
          });
        }
      }
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
    props.selectedOrigin,
    props.markers,
    props.selectedMarkerId,
    props.sectors,
    props.selectedSectorId,
    props.playableFaction,
    props.lang,
    props.fresh,
  ]);

  return (
    <div className="absolute inset-0">
      <div
        ref={divRef}
        className="mission-map absolute inset-0"
        style={{ cursor: props.placeMode || props.sectorDraw ? "crosshair" : "grab" }}
      />

      {/* placement edge glow */}
      {(props.placeMode || props.sectorDraw) && (
        <div
          className="absolute inset-0 pointer-events-none z-[900]"
          style={{ boxShadow: "inset 0 0 0 2px rgba(244,219,80,0.35), inset 0 0 80px rgba(244,219,80,0.05)" }}
        />
      )}

      {/* zoom / fit / 3D controls (desktop only — mobile pinch-zooms) */}
      <MapViewControls
        lang={props.lang}
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onFit={() => {
          const [ww, hh] = worldRef.current;
          mapRef.current?.fitBounds(
            [
              [0, 0],
              [hh, ww],
            ]
          );
        }}
        view3D={props.view3D}
        onToggleView={props.onToggleView}
      />

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

/** DivIcon wrapper for a mission marker (HTML shared with the 3D view). */
function markerDivIcon(mk: MissionMarker, selected: boolean, freshDrop = false) {
  const size = 40;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: markerHtml(mk, selected, freshDrop),
  });
}

/** Small round handle at a zone's center — the only clickable/draggable part.
 * On touch devices the 14px dot gets a transparent 32px hit box. */
function zoneDotIcon(selected: boolean) {
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const dot = zoneDotHtml(selected);
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

/** Distance pill shown at the origin→zone line midpoint during a badge drag. */
function distancePillIcon(dist: number, lang: Lang) {
  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: distancePillHtml(dist, lang),
  });
}

/** DivIcon wrapper for a QRF origin badge; 32px transparent hit box on touch. */
function originBadgeIcon(moduleType: string, color: string, selected: boolean) {
  const badge = originBadgeHtml(moduleType, color, selected);
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  if (!coarse) {
    return L.divIcon({ className: "", iconSize: [24, 24], iconAnchor: [12, 12], html: badge });
  }
  return L.divIcon({
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">${badge}</div>`,
  });
}

/** Sector (TS_MapOverlay rectangle) rendering + interactions.
 *
 * Layer stack per sector: a non-interactive fill (AO = donut darkening
 * everything OUTSIDE the rect, like the in-game m_FillOutside; objective =
 * faint red inside), a visible outline, and an invisible fat "hit" outline.
 * The hit polygon uses fill:false, so ONLY its stroke is hit-testable —
 * selection and drag-to-move work exclusively on the outline while the
 * interior stays click-through for zones/markers/map underneath.
 *
 * The selected sector gets 4 corner resize handles (center-anchored) and a
 * rotation handle offset outward from the top edge. All drags live-update the
 * layer set via one shared `update()`; commits go through onSectorChanged →
 * React state → full redraw (same pattern as the spawn bundle). */
function drawSector(
  map: L.Map,
  overlay: L.LayerGroup,
  s: MissionSector,
  selected: boolean,
  world: [number, number],
  freshPlace: boolean,
  suppressClickRef: { current: boolean },
  onSectorClick: (id: string) => void,
  onSectorChanged: (
    id: string,
    patch: Partial<Pick<MissionSector, "x" | "z" | "length" | "width" | "rotation">>
  ) => void
) {
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const baseColor = s.kind === "ao" ? "#000000" : "#9f2828";
  const lineColor = selected ? "#ffcc00" : baseColor;
  const [w, h] = world;

  type SectorRect = Pick<MissionSector, "x" | "z" | "length" | "width" | "rotation">;
  // length spans local X, width spans local Z (itemWorldCorners w/len axes)
  const cornersOf = (sec: SectorRect) =>
    itemWorldCorners({ x: 0, z: 0, w: sec.length, len: sec.width }, sec.x, sec.z, sec.rotation) as [
      number,
      number,
    ][];
  const toLatLngs = (corners: [number, number][]) =>
    corners.map(([x, z]) => [z, x] as [number, number]);

  let temp: SectorRect = { x: s.x, z: s.z, length: s.length, width: s.width, rotation: s.rotation };
  let rect = toLatLngs(cornersOf(temp));

  // World-bounds outer ring for the AO donut (Leaflet's default evenodd fill
  // rule turns the rect ring into a hole → dark fill outside the AO only).
  const worldRing: [number, number][] = [
    [0, 0],
    [0, w],
    [h, w],
    [h, 0],
  ];

  const fill =
    s.kind === "ao"
      ? L.polygon([worldRing, rect], {
          stroke: false,
          fillColor: "#000000",
          fillOpacity: 0.18,
          interactive: false,
        }).addTo(overlay)
      : L.polygon(rect, {
          stroke: false,
          fillColor: baseColor,
          fillOpacity: 0.09,
          interactive: false,
        }).addTo(overlay);

  const outline = L.polygon(rect, {
    fill: false,
    color: lineColor,
    weight: s.kind === "ao" ? 3 : 2,
    interactive: false,
    className: freshPlace ? "mb-fresh-path" : "",
  }).addTo(overlay);

  // fill:false → only the (invisible, fat) stroke is hit-tested
  const hit = L.polygon(rect, {
    fill: false,
    color: "#000000",
    opacity: 0,
    weight: coarse ? 24 : 14,
    interactive: true,
  }).addTo(overlay);

  const handles: L.Marker[] = [];
  let rotHandle: L.Marker | null = null;
  let rotStem: L.Polyline | null = null;
  // The handle being dragged is NOT repositioned by update() — Leaflet's
  // Draggable owns its position until dragend (React then redraws everything).
  let activeHandle: L.Marker | null = null;

  const topMidWorld = (sec: SectorRect): [number, number] => {
    const [dx, dz] = rotateLocal(0, sec.width / 2, sec.rotation);
    return [sec.x + dx, sec.z + dz];
  };
  const rotHandleWorld = (sec: SectorRect): [number, number] => {
    const [dx, dz] = rotateLocal(0, sec.width / 2 + Math.max(15, sec.width * 0.15), sec.rotation);
    return [sec.x + dx, sec.z + dz];
  };

  const update = () => {
    rect = toLatLngs(cornersOf(temp));
    if (s.kind === "ao") fill.setLatLngs([worldRing, rect]);
    else fill.setLatLngs(rect);
    outline.setLatLngs(rect);
    hit.setLatLngs(rect);
    if (selected) {
      const corners = cornersOf(temp);
      handles.forEach((hm, i) => {
        if (hm !== activeHandle) hm.setLatLng([corners[i][1], corners[i][0]]);
      });
      const [rx, rz] = rotHandleWorld(temp);
      if (rotHandle && rotHandle !== activeHandle) rotHandle.setLatLng([rz, rx]);
      const [tx, tz] = topMidWorld(temp);
      rotStem?.setLatLngs([
        [tz, tx],
        [rz, rx],
      ]);
    }
  };

  /* ----- outline: click to select, pointer-drag to move ----- */
  let dragMoved = false;
  hit.on("click", (e) => {
    L.DomEvent.stopPropagation(e);
    if (dragMoved) {
      dragMoved = false;
      return;
    }
    onSectorClick(s.id);
  });

  const hitEl = hit.getElement() as SVGElement | null;
  if (hitEl) {
    hitEl.style.cursor = "move";
    let start: L.LatLng | null = null;
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      e.stopPropagation();
      hitEl.setPointerCapture(e.pointerId);
      map.dragging.disable();
      start = map.mouseEventToLatLng(e);
      dragMoved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!start || !e.isPrimary) return;
      const cur = map.mouseEventToLatLng(e);
      const dLng = cur.lng - start.lng;
      const dLat = cur.lat - start.lat;
      if (Math.abs(dLng) > 0.5 || Math.abs(dLat) > 0.5) dragMoved = true;
      temp = { ...temp, x: s.x + dLng, z: s.z + dLat };
      update();
    };
    const onUp = (e: PointerEvent) => {
      if (!start || !e.isPrimary) return;
      const cur = map.mouseEventToLatLng(e);
      const dLng = cur.lng - start.lng;
      const dLat = cur.lat - start.lat;
      start = null;
      map.dragging.enable();
      if (Math.abs(dLng) > 0.5 || Math.abs(dLat) > 0.5) {
        // Swallow the trailing map click (same trick as the spawn bundle)
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 100);
        onSectorChanged(s.id, { x: +(s.x + dLng).toFixed(1), z: +(s.z + dLat).toFixed(1) });
      }
    };
    const onCancel = () => {
      if (!start) return;
      start = null;
      map.dragging.enable();
      temp = { ...temp, x: s.x, z: s.z };
      update();
    };
    hitEl.addEventListener("pointerdown", onDown);
    hitEl.addEventListener("pointermove", onMove);
    hitEl.addEventListener("pointerup", onUp);
    hitEl.addEventListener("pointercancel", onCancel);
  }

  if (!selected) return;

  /* ----- corner resize handles (opposite corner stays fixed) ----- */
  const corners = cornersOf(temp);
  for (let ci = 0; ci < 4; ci++) {
    const hm = L.marker([corners[ci][1], corners[ci][0]], {
      icon: sectorHandleIcon(coarse),
      draggable: true,
    }).addTo(overlay);
    // World position of the diagonally opposite corner — the resize anchor
    let anchor: [number, number] = [0, 0];
    hm.on("dragstart", () => {
      activeHandle = hm;
      anchor = cornersOf(temp)[(ci + 2) % 4];
    });
    hm.on("drag", () => {
      const ll = hm.getLatLng();
      const [ax, az] = anchor;
      // Anchor→cursor span, un-rotated into the sector's local frame: the
      // dragged corner's two sides follow the cursor, the other two stay put.
      const [lx, lz] = rotateLocal(ll.lng - ax, ll.lat - az, -temp.rotation);
      const sx = lx < 0 ? -1 : 1;
      const sz = lz < 0 ? -1 : 1;
      const len = Math.min(10000, Math.max(10, Math.abs(lx)));
      const wid = Math.min(10000, Math.max(10, Math.abs(lz)));
      const [cdx, cdz] = rotateLocal((sx * len) / 2, (sz * wid) / 2, temp.rotation);
      temp = { ...temp, x: ax + cdx, z: az + cdz, length: len, width: wid };
      update();
    });
    hm.on("dragend", () => {
      activeHandle = null;
      onSectorChanged(s.id, {
        x: +temp.x.toFixed(1),
        z: +temp.z.toFixed(1),
        length: +temp.length.toFixed(1),
        width: +temp.width.toFixed(1),
      });
    });
    handles.push(hm);
  }

  /* ----- rotation handle (outward from the top-edge midpoint) ----- */
  const [rx, rz] = rotHandleWorld(temp);
  const [tx, tz] = topMidWorld(temp);
  rotStem = L.polyline(
    [
      [tz, tx],
      [rz, rx],
    ],
    { color: "#ffcc00", weight: 1.5, dashArray: "3 3", interactive: false }
  ).addTo(overlay);
  rotHandle = L.marker([rz, rx], { icon: sectorRotateIcon(coarse), draggable: true }).addTo(overlay);
  rotHandle.on("dragstart", () => (activeHandle = rotHandle));
  rotHandle.on("drag", () => {
    const ll = rotHandle!.getLatLng();
    // Compass yaw of the cursor around the center (matches rotateLocal:
    // local (0,d) → world (d·sin yaw, d·cos yaw))
    const yaw =
      (Math.round((Math.atan2(ll.lng - temp.x, ll.lat - temp.z) * 180) / Math.PI) + 360) % 360;
    temp = { ...temp, rotation: yaw };
    update();
  });
  rotHandle.on("dragend", () => {
    activeHandle = null;
    onSectorChanged(s.id, { rotation: temp.rotation });
  });
}

/** Square resize handle for a sector corner (transparent 28px hit box on touch). */
function sectorHandleIcon(coarse: boolean) {
  const sq = `<div style="width:10px;height:10px;background:#fff;border:2px solid #202427;box-shadow:0 1px 3px rgba(0,0,0,0.6);cursor:nwse-resize;"></div>`;
  if (!coarse) {
    return L.divIcon({ className: "", iconSize: [10, 10], iconAnchor: [5, 5], html: sq });
  }
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">${sq}</div>`,
  });
}

/** Round rotation handle with a curved-arrow glyph. */
function sectorRotateIcon(coarse: boolean) {
  const dot = `<div style="width:18px;height:18px;border-radius:50%;background:#ffcc00;border:2px solid #202427;box-shadow:0 1px 4px rgba(0,0,0,0.6);cursor:grab;display:flex;align-items:center;justify-content:center;"><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#202427" stroke-width="1.6" stroke-linecap="round"><path d="M10 6a4 4 0 1 1-1.17-2.83"/><path d="M10.2 1.2v2.3H7.9"/></svg></div>`;
  if (!coarse) {
    return L.divIcon({ className: "", iconSize: [18, 18], iconAnchor: [9, 9], html: dot });
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
