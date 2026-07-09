"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { layoutSpawnBundle, itemWorldCorners, FACTIONS, ZONE_MODULES } from "mission-gen";
import { terrainByKey } from "@/lib/terrains";
import type { MissionMarker, Zone } from "@/lib/mission";
import { findColor, findIcon, militaryIconUrl, VANILLA_ATLAS } from "@/lib/markers";
import { DISABLED_ICON_FILTER, MODULE_ICONS } from "@/lib/zoneModules";

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

export type MapProps = {
  terrainKey: string;
  playableFaction: string;
  spawn: MapSpawn;
  zones: Zone[];
  selectedZoneId: string | null;
  markers: MissionMarker[];
  selectedMarkerId: string | null;
  placeMode: "spawn" | "zone" | "marker" | null;
  focus: MapFocus | null;
  onMapClick: (x: number, z: number) => void;
  onZoneClick: (id: string) => void;
  onZoneMoved: (id: string, x: number, z: number) => void;
  onSpawnMoved: (x: number, z: number) => void;
  onMarkerClick: (id: string) => void;
  onMarkerMoved: (id: string, x: number, z: number) => void;
};

export default function MissionMap(props: MapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
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
      zoomControl: false, // default top-left sits under the floating panel
    });
    L.control.zoom({ position: "topright" }).addTo(map);
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

    return () => {
      map.remove();
      mapRef.current = null;
      overlayRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.terrainKey]);

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
      drawSpawnBundle(map, overlay, props.spawn, props.playableFaction, suppressClickRef, (x, z) =>
        propsRef.current.onSpawnMoved(x, z)
      );
    }

    for (const zone of props.zones) {
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
      }).addTo(overlay);

      const dot = L.marker([zone.z, zone.x], {
        icon: zoneDotIcon(selected),
        draggable: true,
      })
        .bindTooltip(zoneTooltipHtml(zone), {
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
        icon: markerDivIcon(mk, mk.id === props.selectedMarkerId),
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
  ]);

  return (
    <div
      ref={divRef}
      className="mission-map absolute inset-0"
      style={{ cursor: props.placeMode ? "crosshair" : "grab" }}
    />
  );
}

/** DivIcon for a mission marker: military = pre-colored PNG, custom = atlas
 * sprite recolored via CSS mask. Text label sits to the right of the icon;
 * selection adds a yellow halo ring. */
function markerDivIcon(mk: MissionMarker, selected: boolean) {
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
  // Black text with an 8-direction white text-shadow "outline" — readable on
  // both dark terrain and light map areas.
  const outline =
    "-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,1px 1px 0 #fff,-1px 0 0 #fff,1px 0 0 #fff,0 -1px 0 #fff,0 1px 0 #fff";
  const labelHtml = label
    ? `<div style="position:absolute;left:${size + 4}px;top:50%;transform:translateY(-50%);white-space:nowrap;font:600 12px/1.2 var(--font-roboto),sans-serif;color:#000;text-shadow:${outline};">${label}</div>`
    : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="position:relative;width:${size}px;height:${size}px;">${halo}${iconHtml}${labelHtml}</div>`,
  });
}

/** Zone dot hover tooltip: module chip row, disabled modules greyed with 0
 * (Figma 106:216). Styled via the .zone-tip rules in globals.css. */
function zoneTooltipHtml(zone: Zone) {
  const chips = ZONE_MODULES.map((def) => {
    const mod = zone.modules.find((mm) => mm.type === def.type);
    const iconStyle = `width:16px;height:16px;flex:none;${mod ? "" : `filter:${DISABLED_ICON_FILTER};opacity:0.45;`}`;
    const countStyle = `font:400 12px/1 var(--font-roboto),sans-serif;color:${mod ? "#fff" : "#6a767c"};`;
    return `<span style="display:flex;align-items:center;gap:3px;flex:none;"><img src="${MODULE_ICONS[def.type]}" alt="" style="${iconStyle}" /><span style="${countStyle}">${mod?.budget ?? 0}</span></span>`;
  }).join("");
  return `<div style="display:flex;align-items:center;gap:12px;width:max-content;">${chips}</div>`;
}

/** Small round handle at a zone's center — the only clickable/draggable part. */
function zoneDotIcon(selected: boolean) {
  const color = selected ? "#ffcc00" : "#e04b4b";
  return L.divIcon({
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);cursor:move;"></div>`,
  });
}

/** True-scale spawn bundle footprint: bounding box + per-item glyphs.
 * The whole footprint is draggable — grab any part of it to move the spawn. */
function drawSpawnBundle(
  map: L.Map,
  overlay: L.LayerGroup,
  spawn: MapSpawn,
  faction: string,
  suppressClickRef: { current: boolean },
  onSpawnMoved: (x: number, z: number) => void
) {
  const { items, bounds } = layoutSpawnBundle(spawn);
  const labels = FACTIONS[faction]?.vehicleLabels ?? {};
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
      className: "cursor-move",
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
          className: "cursor-move",
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
          className: "cursor-move",
        })
          .bindTooltip("Arsenal crate", { direction: "top" })
          .addTo(overlay)
      );
    } else if (it.kind === "spawnPoint") {
      dragLayers.push(
        L.polygon(corners, {
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#ffffff",
          fillOpacity: 0.6,
          className: "cursor-move",
        })
          .bindTooltip("Spawn point", { direction: "top" })
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
          className: "cursor-move",
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
 * every layer live, mouseup commits the delta via onSpawnMoved. */
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
