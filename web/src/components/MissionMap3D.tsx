"use client";

/**
 * 3D terrain viewport for mission editing (ported from ts-ops-planner's
 * MapClient3D and made interactive).
 *
 * Coordinate mapping:
 *   - three.js X = worldX
 *   - three.js Y = elevation (m)
 *   - three.js Z = -worldZ  (north has the most negative Z)
 *
 * Controls (custom, no OrbitControls):
 *   - LMB drag           pan (ground-anchored); < 5 px = click → onMapClick
 *   - MMB drag           orbit around the terrain point under the cursor
 *   - Wheel              cursor-anchored dolly
 *
 * Architecture mirrors the 2D view: page.tsx owns all state, this component
 * renders it and reports interactions. A setup effect keyed on the terrain
 * builds camera/renderers/terrain; `syncOverlays` clear-and-rebuilds every
 * overlay from props (same philosophy as the 2D overlay.clearLayers()).
 * Rendering is on-demand — every mutation calls world.render().
 *
 * Overlay model:
 *   - zones / sectors / spawn bundle = WebGL lines + translucent fills whose
 *     vertices are draped onto the RENDERED terrain (meshY interpolates the
 *     same decimated grid buildTerrain produced, so nothing pokes through).
 *   - markers / zone dots / origin badges / pings = CSS2DObjects reusing the
 *     exact HTML the 2D divIcons use (screen-constant by nature). Interactive
 *     ones opt into pointer events and get a shared drag controller; their
 *     events never reach the canvas, so camera panning stays untouched.
 *   - terrain texture = the XYZ tile pyramid stitched into a canvas at
 *     runtime (lib/tileComposite) — the repo ships no single-image basemaps.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { spawnElements, itemWorldCorners, rotateLocal, vehicleWorldOutline, FARP_DETAIL } from "mission-gen";
import { terrainByKey } from "@/lib/terrains";
import { getSampler } from "@/lib/terrainSampler";
import { compositeTerrainTexture } from "@/lib/tileComposite";
import { propEntry, propRect } from "@/lib/props";
import {
  deliveryBadgeHtml,
  distanceLabel,
  distancePillHtml,
  markerHtml,
  objectiveBadgeHtml,
  originBadgeHtml,
  pingHtml,
  propBadgeHtml,
  sectorChipHtml,
  zoneDotHtml,
} from "@/lib/overlayHtml";
import { ORIGIN_COLORS } from "@/lib/zoneModules";
import { coordsText } from "@/lib/i18n";
import MapViewControls from "@/components/MapViewControls";
import type { MapProps } from "@/components/MissionMap";

export type Map3DProps = MapProps & {
  /** Viewport handed over from the 2D map at toggle time (fit-square). */
  initialView?: { x: number; z: number; radius: number } | null;
};

/* ---------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------ */

const ZONE_COLOR = 0x9333ea;
const SELECT_COLOR = 0xffcc00;
const OBJECTIVE_COLOR = 0x9f2828; // sector "objective" rectangles
const TASK_COLOR = 0xe8593c; // mission objectives (matches overlayHtml OBJECTIVE_COLOR)
const PROP_GREEN = 0x4ade80; // props (matches overlayHtml PROP_COLOR)
const AO_COLOR = 0x000000;
const SPAWN_BLUE = 0x3fa9f5;
const CRATE_GREEN = 0x50c878;
const HELI_PURPLE = 0xc792ea;
const VEHICLE_YELLOW = 0xf5c542;

/** Lift draped lines/fills/icons above the terrain to kill z-fighting. */
const LINE_LIFT = 1.5;
const FILL_LIFT = 0.75;
const ICON_LIFT = 1.5;

const POLAR_MIN = (1 * Math.PI) / 180;
const POLAR_MAX = (75 * Math.PI) / 180;
const MIN_DISTANCE = 50;
const FOV = 55;

/** Movement below this many px counts as a click, not a drag. */
const CLICK_SLOP_PX = 5;
/** CSS2D drag controller threshold. */
const DRAG_THRESHOLD_PX = 4;

/* ---------------------------------------------------------------------------
 * Decimated terrain grid + interpolation/picking against the RENDERED mesh
 * ------------------------------------------------------------------------ */

/** The exact vertex grid buildTerrain rendered — draped overlays and picking
 * both interpolate THIS (triangle-exact), never the raw heightmap, so they
 * agree with what's on screen even on heavily decimated big maps. */
type MeshGrid = {
  heights: Float32Array;
  vertsX: number;
  vertsY: number;
  w: number; // world width (X), m
  h: number; // world height (Z), m
  minY: number;
  maxY: number;
};

function flatGrid(w: number, h: number): MeshGrid {
  return { heights: new Float32Array(4), vertsX: 2, vertsY: 2, w, h, minY: 0, maxY: 0 };
}

/** Elevation of the rendered mesh at (worldX, worldZ) — triangle-exact
 * against the buildTerrain triangulation (quads split along b–c). */
function meshY(g: MeshGrid, x: number, z: number): number {
  const gx = Math.min(Math.max((x / g.w) * (g.vertsX - 1), 0), g.vertsX - 1);
  const gz = Math.min(Math.max((z / g.h) * (g.vertsY - 1), 0), g.vertsY - 1);
  let i0 = Math.floor(gx);
  let j0 = Math.floor(gz);
  if (i0 >= g.vertsX - 1) i0 = g.vertsX - 2;
  if (j0 >= g.vertsY - 1) j0 = g.vertsY - 2;
  const fx = gx - i0;
  const fz = gz - j0;
  const h00 = g.heights[j0 * g.vertsX + i0];
  const h10 = g.heights[j0 * g.vertsX + i0 + 1];
  const h01 = g.heights[(j0 + 1) * g.vertsX + i0];
  const h11 = g.heights[(j0 + 1) * g.vertsX + i0 + 1];
  if (fx + fz <= 1) return h00 + fx * (h10 - h00) + fz * (h01 - h00);
  return h11 + (1 - fx) * (h01 - h11) + (1 - fz) * (h10 - h11);
}

/* ---------------------------------------------------------------------------
 * World (persistent three.js state)
 * ------------------------------------------------------------------------ */

type World = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  webgl: THREE.WebGLRenderer;
  css2d: CSS2DRenderer;
  grid: MeshGrid;
  terrain: THREE.Mesh | null;
  /** All overlay content (WebGL + CSS2D). Cleared+rebuilt by syncOverlays. */
  overlay: THREE.Group;
  /** Spawn element fill meshes — raycast targets for per-element drags.
   * Each carries its element key in userData.spawnKey. */
  spawnPick: THREE.Mesh[];
  /** Per-element live re-drape at (x, z) during a drag, keyed like
   * selectedSpawnEl ("farp" | "spawnPoint" | "crate:<id>" | "veh:<id>"). */
  spawnSetters: Map<string, (x: number, z: number) => void>;
  target: THREE.Vector3;
  minDistance: number;
  maxDistance: number;
  /** Whole-map framing (fit button + initial placement). */
  center: THREE.Vector3;
  dist0: number;
  focusAnimId: number | null;
  syncOverlays: () => void;
  tweenTo: (endTar: THREE.Vector3, endDist: number) => void;
  render: () => void;
};

/** Ray-pick the rendered terrain. Analytic march over the height grid —
 * cheap enough for pointermove-rate picking (Raycaster vs the ~130k-tri
 * terrain mesh is not). Returns the world-space hit or null (sky / outside
 * the world). */
function pickTerrain(world: World, clientX: number, clientY: number): { x: number; z: number } | null {
  const dom = world.webgl.domElement;
  const rect = dom.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  pickNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pickNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  pickRaycaster.setFromCamera(pickNdc, world.camera);
  const o = pickRaycaster.ray.origin;
  const d = pickRaycaster.ray.direction;
  const g = world.grid;

  // Vertical clip: only the [minY, maxY] band can contain terrain.
  const top = g.maxY + 0.5;
  const bottom = g.minY - 0.5;
  let t0 = 0;
  let t1 = Infinity;
  if (d.y < -1e-9) {
    t0 = Math.max(0, (top - o.y) / d.y);
    t1 = (bottom - o.y) / d.y;
  } else if (o.y > top) {
    return null; // looking up from above the terrain band
  } else if (d.y > 1e-9) {
    t1 = (top - o.y) / d.y;
  }
  // Horizontal clip to the world rect (three: x ∈ [0,w], z ∈ [-h,0]).
  const clip = (p: number, dir: number, lo: number, hi: number): boolean => {
    if (Math.abs(dir) < 1e-12) return p >= lo && p <= hi;
    let a = (lo - p) / dir;
    let b = (hi - p) / dir;
    if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a);
    t1 = Math.min(t1, b);
    return true;
  };
  if (!clip(o.x, d.x, 0, g.w)) return null;
  if (!clip(o.z, d.z, -g.h, 0)) return null;
  if (t1 <= t0) return null;

  const above = (t: number): number => {
    const x = o.x + d.x * t;
    const z = o.z + d.z * t;
    return o.y + d.y * t - meshY(g, x, -z);
  };
  const cell = Math.min(g.w / (g.vertsX - 1), g.h / (g.vertsY - 1));
  const step = Math.max(1, cell * 0.5);
  let tPrev = t0;
  if (above(t0) <= 0) {
    // Camera ray already starts under the surface — snap to the entry point.
    const x = o.x + d.x * t0;
    const z = o.z + d.z * t0;
    return { x: clampTo(x, g.w), z: clampTo(-z, g.h) };
  }
  for (let i = 0; i < 4096; i++) {
    const t = Math.min(tPrev + step, t1);
    if (above(t) <= 0) {
      // Bisect [tPrev, t] onto the surface.
      let lo = tPrev;
      let hi = t;
      for (let k = 0; k < 24; k++) {
        const mid = (lo + hi) / 2;
        if (above(mid) <= 0) hi = mid;
        else lo = mid;
      }
      const x = o.x + d.x * hi;
      const z = o.z + d.z * hi;
      return { x: clampTo(x, g.w), z: clampTo(-z, g.h) };
    }
    if (t >= t1) return null;
    tPrev = t;
  }
  return null;
}
const pickRaycaster = new THREE.Raycaster();
const pickNdc = new THREE.Vector2();
const clampTo = (v: number, max: number) => Math.min(max, Math.max(0, v));

/* ---------------------------------------------------------------------------
 * Draped geometry helpers (all vertices ride meshY + lift; `fill` refills the
 * SAME buffers in place for cheap live drags)
 * ------------------------------------------------------------------------ */

type PointFn = (i: number) => [number, number];

function drapedLine(
  g: MeshGrid,
  n: number,
  mat: THREE.LineBasicMaterial | THREE.LineDashedMaterial,
  closed: boolean
) {
  const positions = new Float32Array(n * 3);
  const geom = new THREE.BufferGeometry();
  const attr = new THREE.BufferAttribute(positions, 3);
  geom.setAttribute("position", attr);
  const obj = closed ? new THREE.LineLoop(geom, mat) : new THREE.Line(geom, mat);
  obj.renderOrder = 2;
  const fill = (pts: PointFn, lift: number) => {
    for (let i = 0; i < n; i++) {
      const [x, z] = pts(i);
      positions[i * 3] = x;
      positions[i * 3 + 1] = meshY(g, x, z) + lift;
      positions[i * 3 + 2] = -z;
    }
    attr.needsUpdate = true;
    geom.computeBoundingSphere();
    if (mat instanceof THREE.LineDashedMaterial) obj.computeLineDistances();
  };
  return { obj, fill };
}

/** (nu+1)×(nv+1) draped vertex grid — discs (polar), sector/bundle fills. */
function drapedGridMesh(g: MeshGrid, nu: number, nv: number, mat: THREE.MeshBasicMaterial) {
  const vertsU = nu + 1;
  const vertsV = nv + 1;
  const positions = new Float32Array(vertsU * vertsV * 3);
  const indices: number[] = [];
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * vertsU + i;
      const b = a + 1;
      const c = a + vertsU;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }
  const geom = new THREE.BufferGeometry();
  const attr = new THREE.BufferAttribute(positions, 3);
  geom.setAttribute("position", attr);
  geom.setIndex(indices);
  const obj = new THREE.Mesh(geom, mat);
  obj.renderOrder = 1;
  const fill = (uv: (u: number, v: number) => [number, number], lift: number) => {
    for (let j = 0; j < vertsV; j++) {
      for (let i = 0; i < vertsU; i++) {
        const [x, z] = uv(i / nu, j / nv);
        const idx = (j * vertsU + i) * 3;
        positions[idx] = x;
        positions[idx + 1] = meshY(g, x, z) + lift;
        positions[idx + 2] = -z;
      }
    }
    attr.needsUpdate = true;
    geom.computeBoundingSphere();
  };
  return { obj, fill };
}

function fillMaterial(color: number, opacity: number): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

/** Perimeter walker for an n-corner polygon, `per` interpolated points per edge. */
function perimeter(corners: [number, number][], per: number): PointFn {
  const n = corners.length;
  return (i: number) => {
    const e = Math.floor(i / per) % n;
    const f = (i % per) / per;
    const [ax, az] = corners[e];
    const [bx, bz] = corners[(e + 1) % n];
    return [ax + (bx - ax) * f, az + (bz - az) * f];
  };
}

/** Bilinear interior of a 4-corner polygon (corner order as itemWorldCorners). */
function quadUV(corners: [number, number][]): (u: number, v: number) => [number, number] {
  const [c0, c1, c2, c3] = corners;
  return (u: number, v: number) => {
    const topX = c0[0] + (c1[0] - c0[0]) * u;
    const topZ = c0[1] + (c1[1] - c0[1]) * u;
    const botX = c3[0] + (c2[0] - c3[0]) * u;
    const botZ = c3[1] + (c2[1] - c3[1]) * u;
    return [topX + (botX - topX) * v, topZ + (botZ - topZ) * v];
  };
}

/* ---------------------------------------------------------------------------
 * CSS2D helpers
 * ------------------------------------------------------------------------ */

function css2dNode(html: string, interactive = false): { obj: CSS2DObject; el: HTMLDivElement } {
  const el = document.createElement("div");
  el.innerHTML = html;
  if (interactive) el.style.pointerEvents = "auto";
  const obj = new CSS2DObject(el);
  return { obj, el };
}

type DragHandlers = {
  onClick: () => void;
  onDragLive?: (x: number, z: number) => void;
  onDragEnd?: (x: number, z: number) => void;
};

/** Shared drag controller for CSS2D handles (markers, zone dots, origin
 * badges, sector chips). Pointer events are captured on the element, so the
 * canvas never sees them — camera panning is suppressed structurally.
 * < DRAG_THRESHOLD_PX of total movement = click. */
function makeDraggable(
  world: World,
  el: HTMLElement,
  obj: CSS2DObject,
  lift: number,
  handlers: DragHandlers
) {
  let startClient: { x: number; y: number } | null = null;
  let startWorld: { x: number; z: number } | null = null;
  let moved = false;
  let last: { x: number; z: number } | null = null;

  const onDown = (e: PointerEvent) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.preventDefault();
    e.stopPropagation();
    el.setPointerCapture(e.pointerId);
    startClient = { x: e.clientX, y: e.clientY };
    startWorld = { x: obj.position.x, z: -obj.position.z };
    moved = false;
    last = null;
  };
  const onMove = (e: PointerEvent) => {
    if (!startClient || !e.isPrimary) return;
    if (!moved && Math.hypot(e.clientX - startClient.x, e.clientY - startClient.y) < DRAG_THRESHOLD_PX)
      return;
    moved = true;
    const hit = pickTerrain(world, e.clientX, e.clientY);
    if (!hit) return; // above the horizon — keep the last valid point
    last = hit;
    obj.position.set(hit.x, meshY(world.grid, hit.x, hit.z) + lift, -hit.z);
    handlers.onDragLive?.(hit.x, hit.z);
    world.render();
  };
  const onUp = (e: PointerEvent) => {
    if (!startClient || !e.isPrimary) return;
    const wasMoved = moved;
    const fin = last;
    startClient = null;
    moved = false;
    last = null;
    if (wasMoved && fin) handlers.onDragEnd?.(+fin.x.toFixed(1), +fin.z.toFixed(1));
    else if (!wasMoved) handlers.onClick();
  };
  const onCancel = () => {
    if (!startClient) return;
    const sw = startWorld;
    startClient = null;
    moved = false;
    last = null;
    if (sw) {
      obj.position.set(sw.x, meshY(world.grid, sw.x, sw.z) + lift, -sw.z);
      handlers.onDragLive?.(sw.x, sw.z);
    }
    world.render();
  };
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onCancel);
}

function disposeMaterial(m: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(m)) m.forEach((x) => x.dispose());
  else m.dispose();
}

function clearOverlays(world: World): void {
  world.overlay.traverse((obj) => {
    const anyObj = obj as THREE.Mesh;
    if (anyObj.geometry) anyObj.geometry.dispose();
    if (anyObj.material) disposeMaterial(anyObj.material);
  });
  // Removing dispatches 'removed' → CSS2DObjects detach their DOM elements.
  world.overlay.clear();
  world.spawnPick = [];
  world.spawnSetters = new Map();
}

/* ---------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------ */

export default function MissionMap3D(props: Map3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  // Consume any focus seq that predates this mount (stale 2D focus).
  const lastFocusSeqRef = useRef<number | null>(props.focus?.seq ?? null);
  // The 2D handoff applies to the FIRST setup only — a terrain switch while
  // in 3D re-runs setup with coords that belong to the previous world.
  const initialViewRef = useRef(props.initialView ?? null);

  // ===== Setup effect — runs only when the terrain changes =================
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;

    const t = terrainByKey(props.terrainKey);
    const [w, h] = t.worldSize;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0f11);

    const camera = new THREE.PerspectiveCamera(
      FOV,
      Math.max(1, mount.clientWidth / Math.max(1, mount.clientHeight)),
      1,
      Math.max(w, h) * 8
    );
    const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);

    const webgl = new THREE.WebGLRenderer({ antialias: true });
    webgl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    webgl.setSize(mount.clientWidth, mount.clientHeight);
    webgl.outputColorSpace = THREE.SRGBColorSpace;
    webgl.domElement.style.position = "absolute";
    webgl.domElement.style.inset = "0";
    mount.appendChild(webgl.domElement);

    // CSS2DRenderer layers HTML markers over the WebGL canvas. Pointer events
    // on the container are disabled so the canvas receives mouse input; the
    // interactive handles opt back in individually.
    const css2d = new CSS2DRenderer();
    css2d.setSize(mount.clientWidth, mount.clientHeight);
    css2d.domElement.style.position = "absolute";
    css2d.domElement.style.inset = "0";
    css2d.domElement.style.pointerEvents = "none";
    css2d.domElement.style.overflow = "hidden";
    mount.appendChild(css2d.domElement);

    // No scene lights: the tiles already carry baked hillshading, so the
    // terrain renders UNLIT (MeshBasicMaterial) — engine lighting would
    // double-shade slopes and make 3D darker than the 2D tiles.

    const centerX = w * 0.5;
    const centerZ = h * 0.5;
    const halfDiag = Math.hypot(w, h) * 0.5;
    const maxDistance = halfDiag * 5;
    const dist0 = halfDiag / tanHalfFov;
    const polar0 = 0.45;

    // Initial framing: the handed-over 2D viewport if present (consumed once,
    // and only if it lies inside this world), else whole map.
    const iv0 = initialViewRef.current;
    initialViewRef.current = null;
    const iv = iv0 && iv0.x >= 0 && iv0.x <= w && iv0.z >= 0 && iv0.z <= h ? iv0 : null;
    const startDist = iv
      ? Math.min(maxDistance, Math.max(MIN_DISTANCE, (iv.radius / tanHalfFov) * 1.1))
      : dist0;
    const target = new THREE.Vector3(iv ? iv.x : centerX, 0, -(iv ? iv.z : centerZ));
    camera.position.set(
      target.x,
      target.y + startDist * Math.cos(polar0),
      target.z + startDist * Math.sin(polar0)
    );
    camera.lookAt(target);

    const overlay = new THREE.Group();
    scene.add(overlay);

    const world: World = {
      scene,
      camera,
      webgl,
      css2d,
      grid: flatGrid(w, h),
      terrain: null,
      overlay,
      spawnPick: [],
      spawnSetters: new Map(),
      target,
      minDistance: MIN_DISTANCE,
      maxDistance,
      center: new THREE.Vector3(centerX, 0, -centerZ),
      dist0,
      focusAnimId: null,
      syncOverlays: () => {},
      tweenTo: () => {},
      render: () => {
        webgl.render(scene, camera);
        css2d.render(scene, camera);
      },
    };
    worldRef.current = world;

    // ---- Terrain -----------------------------------------------------------
    const terrainMat = new THREE.MeshBasicMaterial({ color: 0x1a2025 });

    function disposeTerrain() {
      if (!world.terrain) return;
      scene.remove(world.terrain);
      world.terrain.geometry.dispose();
      world.terrain = null;
    }

    function buildTerrain(sampler: Awaited<ReturnType<typeof getSampler>> | null) {
      disposeTerrain();
      const segX = sampler ? Math.min(sampler.meta.widthPx - 1, 256) : 1;
      const segZ = sampler ? Math.min(sampler.meta.heightPx - 1, 256) : 1;
      const vertsX = segX + 1;
      const vertsZ = segZ + 1;
      const positions = new Float32Array(vertsX * vertsZ * 3);
      const uvs = new Float32Array(vertsX * vertsZ * 2);
      const heights = new Float32Array(vertsX * vertsZ);
      const indices: number[] = [];
      let minY = Infinity;
      let maxY = -Infinity;
      for (let j = 0; j < vertsZ; j++) {
        for (let i = 0; i < vertsX; i++) {
          const u = i / segX;
          const v = j / segZ;
          const wx = u * w;
          const wz = v * h;
          const raw = sampler ? sampler.sample(wx, wz) : 0;
          const elev = Number.isFinite(raw) ? raw : 0;
          const idx = j * vertsX + i;
          positions[idx * 3] = wx;
          positions[idx * 3 + 1] = elev;
          positions[idx * 3 + 2] = -wz;
          uvs[idx * 2] = u;
          uvs[idx * 2 + 1] = v;
          heights[idx] = elev;
          if (elev < minY) minY = elev;
          if (elev > maxY) maxY = elev;
        }
      }
      for (let j = 0; j < segZ; j++) {
        for (let i = 0; i < vertsX - 1; i++) {
          const a = j * vertsX + i;
          const b = a + 1;
          const c = a + vertsX;
          const d = c + 1;
          indices.push(a, b, c, b, d, c); // CCW from above (+Y)
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      world.terrain = new THREE.Mesh(geom, terrainMat);
      scene.add(world.terrain);
      world.grid = { heights, vertsX, vertsY: vertsZ, w, h, minY, maxY };
    }
    buildTerrain(null);

    let texture: THREE.CanvasTexture | null = null;
    compositeTerrainTexture(t)
      .then((canvas) => {
        if (disposed) return;
        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = webgl.capabilities.getMaxAnisotropy();
        terrainMat.map = texture;
        terrainMat.color.set(0xffffff);
        terrainMat.needsUpdate = true;
        world.render();
      })
      .catch((err) => {
        console.warn(`[MissionMap3D] tile composite failed for ${t.key}:`, err);
      });

    getSampler(props.terrainKey)
      .then((sampler) => {
        if (disposed) return;
        buildTerrain(sampler);
        // The camera was framed against a flat y=0 world — lift the whole
        // rig by the terrain height at the target so a close-in initial
        // view can't start underground.
        const ty = meshY(world.grid, target.x, -target.z);
        if (Math.abs(ty - target.y) > 0.01) {
          const dy = ty - target.y;
          target.y += dy;
          camera.position.y += dy;
          camera.lookAt(target);
        }
        world.syncOverlays(); // re-drape everything that was built flat
      })
      .catch((err) => {
        console.warn(`[MissionMap3D] heightmap load failed for ${t.key}:`, err);
      });

    // ---- Overlays ----------------------------------------------------------
    world.syncOverlays = () => {
      if (disposed) return;
      clearOverlays(world);
      const p = propsRef.current;
      const grid = world.grid;

      /* -- sectors: draped outline (+fill for objectives) + center chip -- */
      for (const s of p.sectors) {
        const selected = s.id === p.selectedSectorId;
        const lineColor = selected ? SELECT_COLOR : s.kind === "ao" ? AO_COLOR : OBJECTIVE_COLOR;
        const per = Math.min(64, Math.max(4, Math.ceil(Math.max(s.length, s.width) / 25)));
        const outline = drapedLine(
          grid,
          per * 4,
          new THREE.LineBasicMaterial({ color: lineColor }),
          true
        );
        overlay.add(outline.obj);
        let fillObj: ReturnType<typeof drapedGridMesh> | null = null;
        if (s.kind === "objective") {
          const nu = Math.min(48, Math.max(1, Math.ceil(s.length / 25)));
          const nv = Math.min(48, Math.max(1, Math.ceil(s.width / 25)));
          fillObj = drapedGridMesh(grid, nu, nv, fillMaterial(OBJECTIVE_COLOR, 0.09));
          overlay.add(fillObj.obj);
        }
        const drapeAt = (cx: number, cz: number) => {
          const corners = itemWorldCorners(
            { x: 0, z: 0, w: s.length, len: s.width },
            cx,
            cz,
            s.rotation
          );
          outline.fill(perimeter(corners, per), LINE_LIFT);
          fillObj?.fill(quadUV(corners), FILL_LIFT);
        };
        drapeAt(s.x, s.z);

        const chip = css2dNode(sectorChipHtml(s.kind, selected), true);
        chip.obj.position.set(s.x, meshY(grid, s.x, s.z) + ICON_LIFT, -s.z);
        overlay.add(chip.obj);
        makeDraggable(world, chip.el, chip.obj, ICON_LIFT, {
          onClick: () => propsRef.current.onSectorClick(s.id),
          onDragLive: (x, z) => drapeAt(x, z),
          onDragEnd: (x, z) => propsRef.current.onSectorChanged(s.id, { x, z }),
        });
      }

      /* -- spawn elements: draped footprints, per-element drag via canvas
         (rotation is 2D-only, like sector rotate) -- */
      if (p.spawn.placed) {
        for (const it of spawnElements(p.spawn)) {
          let color = VEHICLE_YELLOW;
          let opacity = 0.45;
          if (it.kind === "farp") {
            color = SPAWN_BLUE;
            opacity = 0.15;
          } else if (it.kind === "crate") {
            color = CRATE_GREEN;
            opacity = 0.6;
          } else if (it.kind === "spawnPoint") {
            color = 0xffffff;
            opacity = 0.6;
          } else if (it.cls === "heli") {
            color = HELI_PURPLE;
            opacity = 0.15;
          }
          const selected = it.key === p.selectedSpawnEl;
          const edgeColor = selected ? SELECT_COLOR : color;
          // Spawn point renders as its in-game 10 m radius circle
          if (it.kind === "spawnPoint") {
            const disc = drapedGridMesh(grid, 32, 4, fillMaterial(0xffffff, 0.2));
            overlay.add(disc.obj);
            disc.obj.userData.spawnKey = it.key;
            world.spawnPick.push(disc.obj);
            const circleLine = drapedLine(grid, 48, new THREE.LineBasicMaterial({ color: edgeColor }), true);
            overlay.add(circleLine.obj);
            const setSp = (x: number, z: number) => {
              disc.fill((u, v) => {
                const a = u * Math.PI * 2;
                const rr = v * 10;
                return [x + rr * Math.cos(a), z + rr * Math.sin(a)];
              }, LINE_LIFT);
              circleLine.fill((i) => {
                const a = (i / 48) * Math.PI * 2;
                return [x + 10 * Math.cos(a), z + 10 * Math.sin(a)];
              }, LINE_LIFT);
            };
            setSp(it.x, it.z);
            world.spawnSetters.set(it.key, setSp);
            continue;
          }
          const isVehicle = it.kind === "vehicle";
          const sub = Math.min(8, Math.max(1, Math.ceil(Math.max(it.w, it.len) / 8)));
          const per = Math.max(2, sub);
          const fill = drapedGridMesh(grid, sub, sub, fillMaterial(color, opacity));
          overlay.add(fill.obj);
          fill.obj.userData.spawnKey = it.key;
          world.spawnPick.push(fill.obj);
          // Vehicles: pointed-nose pentagon (apex = facing) — body quad above
          // plus this nose triangle (degenerate quad), 5-edge outline.
          let noseFill: ReturnType<typeof drapedGridMesh> | null = null;
          if (isVehicle) {
            noseFill = drapedGridMesh(grid, sub, sub, fillMaterial(color, opacity));
            overlay.add(noseFill.obj);
            noseFill.obj.userData.spawnKey = it.key;
            world.spawnPick.push(noseFill.obj);
          }
          const edge = drapedLine(grid, per * (isVehicle ? 5 : 4), new THREE.LineBasicMaterial({ color: edgeColor }), true);
          overlay.add(edge.obj);
          let ring: ReturnType<typeof drapedLine> | null = null;
          let coneLoops: ReturnType<typeof drapedLine>[] = [];
          let boxFills: ReturnType<typeof drapedGridMesh>[] = [];
          let boxEdges: ReturnType<typeof drapedLine>[] = [];
          if (it.kind === "farp") {
            // vehicle maintenance trigger radius
            ring = drapedLine(
              grid,
              40,
              new THREE.LineDashedMaterial({ color: SPAWN_BLUE, dashSize: 1.5, gapSize: 3 }),
              true
            );
            overlay.add(ring.obj);
            // interior schematic: cone rows (drive-through lane) + crate clusters
            coneLoops = FARP_DETAIL.cones.map(() => {
              const c = drapedLine(grid, 8, new THREE.LineBasicMaterial({ color: 0xff6a3d }), true);
              overlay.add(c.obj);
              return c;
            });
            boxFills = FARP_DETAIL.boxes.map(() => {
              const b = drapedGridMesh(grid, 2, 2, fillMaterial(SPAWN_BLUE, 0.35));
              overlay.add(b.obj);
              return b;
            });
            boxEdges = FARP_DETAIL.boxes.map(() => {
              const b = drapedLine(grid, 8, new THREE.LineBasicMaterial({ color: SPAWN_BLUE }), true);
              overlay.add(b.obj);
              return b;
            });
          }
          const setEl = (x: number, z: number) => {
            if (isVehicle && noseFill) {
              const o = vehicleWorldOutline({ x: 0, z: 0, w: it.w, len: it.len }, x, z, it.rotation);
              // o = [rearL, rearR, shoulderR, apex, shoulderL]
              // Fill at the SAME lift as the outline: on these small shapes
              // the standard 0.75 m line/fill split reads as a visible offset
              // at oblique camera angles (fill renders first + polygonOffset,
              // so the coplanar outline still draws on top).
              fill.fill(quadUV([o[0], o[1], o[2], o[4]]), LINE_LIFT);
              noseFill.fill(quadUV([o[4], o[2], o[3], o[3]]), LINE_LIFT);
              edge.fill(perimeter(o, per), LINE_LIFT);
            } else {
              const corners = itemWorldCorners({ x: 0, z: 0, w: it.w, len: it.len }, x, z, it.rotation);
              fill.fill(quadUV(corners), LINE_LIFT);
              edge.fill(perimeter(corners, per), LINE_LIFT);
            }
            ring?.fill((i) => {
              const a = (i / 40) * Math.PI * 2;
              return [x + 10 * Math.cos(a), z + 10 * Math.sin(a)];
            }, LINE_LIFT);
            coneLoops.forEach((c, ci) => {
              const [lx, lz] = FARP_DETAIL.cones[ci];
              const [dx, dz] = rotateLocal(lx, lz, it.rotation);
              c.fill((i) => {
                const a = (i / 8) * Math.PI * 2;
                return [x + dx + 0.4 * Math.cos(a), z + dz + 0.4 * Math.sin(a)];
              }, LINE_LIFT);
            });
            boxFills.forEach((b, bi) => {
              const corners = itemWorldCorners(FARP_DETAIL.boxes[bi], x, z, it.rotation);
              b.fill(quadUV(corners), LINE_LIFT);
              boxEdges[bi].fill(perimeter(corners, 2), LINE_LIFT);
            });
          };
          setEl(it.x, it.z);
          world.spawnSetters.set(it.key, setEl);
        }
      }

      /* -- zones: draped ring + disc, dot handle, QRF origin lines/badges -- */
      for (const zone of p.zones) {
        const selected = zone.id === p.selectedZoneId;
        const ring = drapedLine(
          grid,
          96,
          new THREE.LineBasicMaterial({ color: selected ? SELECT_COLOR : ZONE_COLOR }),
          true
        );
        overlay.add(ring.obj);
        const disc = drapedGridMesh(grid, 48, 8, fillMaterial(ZONE_COLOR, 0.12));
        overlay.add(disc.obj);

        type OriginVisual = {
          line: ReturnType<typeof drapedLine>;
          obj: CSS2DObject;
          getOrigin: () => { x: number; z: number };
        };
        const originVisuals: OriginVisual[] = [];

        // Live zone-center state — the dot drag re-drapes ring/disc/lines.
        let zc = { x: zone.x, z: zone.z };
        const drapeZone = () => {
          ring.fill((i) => {
            const a = (i / 96) * Math.PI * 2;
            return [zc.x + zone.radius * Math.cos(a), zc.z + zone.radius * Math.sin(a)];
          }, LINE_LIFT + (selected ? 0.3 : 0));
          disc.fill((u, v) => {
            const a = u * Math.PI * 2;
            const rr = v * zone.radius;
            return [zc.x + rr * Math.cos(a), zc.z + rr * Math.sin(a)];
          }, FILL_LIFT);
          for (const ov of originVisuals) {
            const o = ov.getOrigin();
            ov.line.fill(
              (i) => {
                const f = i / 64;
                return [o.x + (zc.x - o.x) * f, o.z + (zc.z - o.z) * f];
              },
              LINE_LIFT
            );
          }
        };

        for (const mod of zone.modules) {
          const color = ORIGIN_COLORS[mod.type];
          if (!color || !mod.origins?.length) continue;
          for (const [oi, origin] of mod.origins.entries()) {
            const so = p.selectedOrigin;
            const selOrigin =
              so?.zoneId === zone.id && so.moduleType === mod.type && so.index === oi;
            const line = drapedLine(
              grid,
              65,
              new THREE.LineDashedMaterial({
                color: new THREE.Color(color),
                dashSize: 8,
                gapSize: 8,
                transparent: true,
                opacity: 0.85,
              }),
              false
            );
            overlay.add(line.obj);
            const badge = css2dNode(originBadgeHtml(mod.type, color, selOrigin), true);
            const oPos = { x: origin.x, z: origin.z };
            badge.obj.position.set(oPos.x, meshY(grid, oPos.x, oPos.z) + ICON_LIFT, -oPos.z);
            overlay.add(badge.obj);
            originVisuals.push({ line, obj: badge.obj, getOrigin: () => oPos });

            // Distance pill lives only while dragging (2D parity).
            let pill: { obj: CSS2DObject; el: HTMLDivElement } | null = null;
            makeDraggable(world, badge.el, badge.obj, ICON_LIFT, {
              onClick: () => propsRef.current.onOriginClick(zone.id, mod.type, oi),
              onDragLive: (x, z) => {
                oPos.x = x;
                oPos.z = z;
                line.fill(
                  (i) => {
                    const f = i / 64;
                    return [x + (zc.x - x) * f, z + (zc.z - z) * f];
                  },
                  LINE_LIFT
                );
                const dist = Math.hypot(x - zc.x, z - zc.z);
                const mx = (x + zc.x) / 2;
                const mz = (z + zc.z) / 2;
                if (!pill) {
                  pill = css2dNode(distancePillHtml(dist, propsRef.current.lang));
                  overlay.add(pill.obj);
                } else {
                  const el = pill.el.querySelector(".mb-dist-pill");
                  if (el) el.textContent = distanceLabel(dist, propsRef.current.lang);
                }
                pill.obj.position.set(mx, meshY(grid, mx, mz) + 2, -mz);
              },
              onDragEnd: (x, z) => {
                if (pill) {
                  overlay.remove(pill.obj);
                  pill = null;
                }
                propsRef.current.onOriginMoved(zone.id, mod.type, oi, x, z);
              },
            });
          }
        }

        drapeZone();

        const dot = css2dNode(zoneDotHtml(selected), true);
        dot.obj.position.set(zc.x, meshY(grid, zc.x, zc.z) + ICON_LIFT, -zc.z);
        overlay.add(dot.obj);
        makeDraggable(world, dot.el, dot.obj, ICON_LIFT, {
          onClick: () => propsRef.current.onZoneClick(zone.id),
          onDragLive: (x, z) => {
            zc = { x, z };
            drapeZone();
          },
          onDragEnd: (x, z) => propsRef.current.onZoneMoved(zone.id, x, z),
        });
      }

      /* -- markers -- */
      for (const mk of p.markers) {
        const node = css2dNode(markerHtml(mk, mk.id === p.selectedMarkerId, !!p.fresh[mk.id]), true);
        node.obj.position.set(mk.x, meshY(grid, mk.x, mk.z) + ICON_LIFT, -mk.z);
        overlay.add(node.obj);
        makeDraggable(world, node.el, node.obj, ICON_LIFT, {
          onClick: () => propsRef.current.onMarkerClick(mk.id),
          onDragEnd: (x, z) => propsRef.current.onMarkerMoved(mk.id, x, z),
        });
      }

      /* -- objectives: accent badge (draggable) + draped trigger-radius ring
            for the area types; the ring re-drapes live during a badge drag -- */
      for (const o of p.objectives) {
        const selected = o.id === p.selectedObjectiveId;
        let drapeRing: ((x: number, z: number) => void) | null = null;
        if (o.radius) {
          const ring = drapedLine(
            grid,
            96,
            new THREE.LineDashedMaterial({
              color: selected ? SELECT_COLOR : TASK_COLOR,
              dashSize: 8,
              gapSize: 6,
            }),
            true
          );
          overlay.add(ring.obj);
          const disc = drapedGridMesh(grid, 48, 8, fillMaterial(TASK_COLOR, 0.1));
          overlay.add(disc.obj);
          drapeRing = (x, z) => {
            ring.fill((i) => {
              const a = (i / 96) * Math.PI * 2;
              return [x + o.radius! * Math.cos(a), z + o.radius! * Math.sin(a)];
            }, LINE_LIFT + (selected ? 0.3 : 0));
            disc.fill((u, v) => {
              const a = u * Math.PI * 2;
              const rr = v * o.radius!;
              return [x + rr * Math.cos(a), z + rr * Math.sin(a)];
            }, FILL_LIFT);
          };
          drapeRing(o.x, o.z);
        }
        // Deliver: dashed line to the delivery point + flag badge + trigger
        // ring, live-redraped during either end's drag (QRF-origin pattern).
        let drapeLine: ((ox: number, oz: number, dx: number, dz: number) => void) | null = null;
        const del = o.type === "deliver" && o.delivery ? { ...o.delivery } : null;
        if (del) {
          const line = drapedLine(
            grid,
            65,
            new THREE.LineDashedMaterial({
              color: TASK_COLOR,
              dashSize: 8,
              gapSize: 8,
              transparent: true,
              opacity: 0.85,
            }),
            false
          );
          overlay.add(line.obj);
          const dRadius = o.deliveryRadius ?? 25;
          const dRing = drapedLine(
            grid,
            96,
            new THREE.LineDashedMaterial({ color: selected ? SELECT_COLOR : TASK_COLOR, dashSize: 6, gapSize: 5 }),
            true
          );
          overlay.add(dRing.obj);
          const drapeDelivery = (dx: number, dz: number) => {
            dRing.fill((i) => {
              const a = (i / 96) * Math.PI * 2;
              return [dx + dRadius * Math.cos(a), dz + dRadius * Math.sin(a)];
            }, LINE_LIFT);
          };
          drapeLine = (ox, oz, dx, dz) => {
            line.fill((i) => {
              const f = i / 64;
              return [ox + (dx - ox) * f, oz + (dz - oz) * f];
            }, LINE_LIFT);
          };
          drapeLine(o.x, o.z, del.x, del.z);
          drapeDelivery(del.x, del.z);

          const flag = css2dNode(deliveryBadgeHtml(selected), true);
          flag.obj.position.set(del.x, meshY(grid, del.x, del.z) + ICON_LIFT, -del.z);
          overlay.add(flag.obj);
          makeDraggable(world, flag.el, flag.obj, ICON_LIFT, {
            onClick: () => propsRef.current.onObjectiveClick(o.id),
            onDragLive: (x, z) => {
              del.x = x;
              del.z = z;
              drapeLine?.(o.x, o.z, x, z);
              drapeDelivery(x, z);
            },
            onDragEnd: (x, z) => propsRef.current.onDeliveryMoved(o.id, x, z),
          });
        }

        const badge = css2dNode(objectiveBadgeHtml(o.type, selected, !!p.fresh[o.id]), true);
        badge.obj.position.set(o.x, meshY(grid, o.x, o.z) + ICON_LIFT, -o.z);
        overlay.add(badge.obj);
        makeDraggable(world, badge.el, badge.obj, ICON_LIFT, {
          onClick: () => propsRef.current.onObjectiveClick(o.id),
          onDragLive: (x, z) => {
            drapeRing?.(x, z);
            if (del) drapeLine?.(x, z, del.x, del.z);
          },
          onDragEnd: (x, z) => propsRef.current.onObjectiveMoved(o.id, x, z),
        });
      }

      /* -- props: green badge (draggable) + draped footprint outline + facing
            tick along local +Z; everything re-drapes live during a drag -- */
      for (const pr of p.props) {
        const selected = pr.id === p.selectedPropId;
        const entry = propEntry(pr.ref);
        const r = entry ? propRect(entry.fp) : null;
        const lineColor = selected ? SELECT_COLOR : PROP_GREEN;
        let drapeFp: ((x: number, z: number) => void) | null = null;
        if (r && (r.disc || r.w >= 1 || r.len >= 1)) {
          let drapeShape: (x: number, z: number) => void;
          if (r.disc) {
            const ring = drapedLine(
              grid,
              64,
              new THREE.LineDashedMaterial({ color: lineColor, dashSize: 3, gapSize: 2 }),
              true
            );
            overlay.add(ring.obj);
            const radius = r.w / 2;
            drapeShape = (x, z) =>
              ring.fill((i) => {
                const a = (i / 64) * Math.PI * 2;
                return [x + radius * Math.cos(a), z + radius * Math.sin(a)];
              }, LINE_LIFT);
          } else {
            const per = Math.min(32, Math.max(4, Math.ceil(Math.max(r.w, r.len) / 5)));
            const outline = drapedLine(
              grid,
              per * 4,
              new THREE.LineDashedMaterial({ color: lineColor, dashSize: 3, gapSize: 2 }),
              true
            );
            overlay.add(outline.obj);
            drapeShape = (x, z) => {
              const corners = itemWorldCorners(
                { x: r.offX, z: r.offZ, w: r.w, len: r.len },
                x,
                z,
                pr.rotation
              );
              outline.fill(perimeter(corners, per), LINE_LIFT);
            };
          }
          // Facing tick: front-edge midpoint → 4 m outward along local +Z
          const tickLine = drapedLine(grid, 8, new THREE.LineBasicMaterial({ color: lineColor }), false);
          overlay.add(tickLine.obj);
          const frontX = r.disc ? 0 : r.offX;
          const frontZ = (r.disc ? 0 : r.offZ) + (r.disc ? r.w : r.len) / 2;
          const [ax, az] = rotateLocal(frontX, frontZ, pr.rotation);
          const [bx, bz] = rotateLocal(frontX, frontZ + 4, pr.rotation);
          drapeFp = (x, z) => {
            drapeShape(x, z);
            tickLine.fill((i) => {
              const f = i / 8;
              return [x + ax + (bx - ax) * f, z + az + (bz - az) * f];
            }, LINE_LIFT);
          };
          drapeFp(pr.x, pr.z);
        }

        const badge = css2dNode(propBadgeHtml(selected, !!p.fresh[pr.id]), true);
        badge.obj.position.set(pr.x, meshY(grid, pr.x, pr.z) + ICON_LIFT, -pr.z);
        overlay.add(badge.obj);
        makeDraggable(world, badge.el, badge.obj, ICON_LIFT, {
          onClick: () => propsRef.current.onPropClick(pr.id),
          onDragLive: (x, z) => drapeFp?.(x, z),
          onDragEnd: (x, z) => propsRef.current.onPropMoved(pr.id, x, z),
        });
      }

      world.render();
    };
    world.syncOverlays();

    // ---- Camera tween (focus / fit) ---------------------------------------
    world.tweenTo = (endTar: THREE.Vector3, endDist: number) => {
      const startCam = camera.position.clone();
      const startTar = target.clone();
      const dir = new THREE.Vector3().subVectors(startCam, startTar);
      if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);
      dir.normalize();
      const endCam = endTar.clone().addScaledVector(dir, endDist);
      const DURATION = 600;
      const t0 = performance.now();
      const ease = (x: number) => 1 - Math.pow(1 - x, 3); // matches Leaflet flyTo feel
      if (world.focusAnimId !== null) cancelAnimationFrame(world.focusAnimId);
      const step = () => {
        if (disposed) return;
        const k = Math.min(1, (performance.now() - t0) / DURATION);
        const e = ease(k);
        camera.position.lerpVectors(startCam, endCam, e);
        target.lerpVectors(startTar, endTar, e);
        camera.lookAt(target);
        world.render();
        world.focusAnimId = k < 1 ? requestAnimationFrame(step) : null;
      };
      world.focusAnimId = requestAnimationFrame(step);
    };

    // ---- Controls ----------------------------------------------------------
    const dom = webgl.domElement;
    dom.style.touchAction = "none";
    dom.style.cursor = propsRef.current.placeMode ? "crosshair" : "grab";

    let dragging = false;
    let dragButton = -1;
    let lastX = 0;
    let lastY = 0;
    let moveAccum = 0;
    let elemDrag: {
      key: string;
      startX: number;
      startZ: number;
      sx: number;
      sz: number;
      last: { x: number; z: number } | null;
    } | null = null;

    /** Stored world position of a spawn element by its key. */
    const spawnElPos = (key: string): { x: number; z: number } | null => {
      const sp = propsRef.current.spawn;
      if (key === "farp") return { x: sp.farpPos.x, z: sp.farpPos.z };
      if (key === "spawnPoint") return { x: sp.spawnPoint.x, z: sp.spawnPoint.z };
      if (key.startsWith("crate:")) {
        const c = sp.crates.find((cc) => cc.id === key.slice("crate:".length));
        return c ? { x: c.x, z: c.z } : null;
      }
      if (key.startsWith("veh:")) {
        const v = sp.vehicles.find((vv) => vv.id === key.slice("veh:".length));
        return v ? { x: v.x, z: v.z } : null;
      }
      return null;
    };

    const mmbPivot = new THREE.Vector3();

    const restoreCursor = () => {
      dom.style.cursor = propsRef.current.placeMode ? "crosshair" : "grab";
    };

    const captureMMBPivot = (clientX: number, clientY: number): void => {
      mmbPivot.copy(target);
      const hit = pickTerrain(world, clientX, clientY);
      if (hit) mmbPivot.set(hit.x, meshY(world.grid, hit.x, hit.z), -hit.z);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 && e.button !== 1) return;
      if (e.button === 0 && world.spawnPick.length) {
        // Spawn-element grab? (few small quads — Raycaster is fine here)
        const rect = dom.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          pickNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          pickNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          pickRaycaster.setFromCamera(pickNdc, camera);
          const hits = pickRaycaster.intersectObjects(world.spawnPick, false);
          const key = hits.length > 0 ? (hits[0].object.userData.spawnKey as string | undefined) : undefined;
          if (key) {
            const start = pickTerrain(world, e.clientX, e.clientY);
            const pos = spawnElPos(key);
            if (start && pos) {
              elemDrag = { key, startX: start.x, startZ: start.z, sx: pos.x, sz: pos.z, last: null };
              dom.style.cursor = "move";
              e.preventDefault();
              return;
            }
          }
        }
      }
      dragging = true;
      dragButton = e.button;
      lastX = e.clientX;
      lastY = e.clientY;
      moveAccum = 0;
      dom.style.cursor = "grabbing";
      if (e.button === 1) captureMMBPivot(e.clientX, e.clientY);
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (elemDrag) {
        const hit = pickTerrain(world, e.clientX, e.clientY);
        if (hit) {
          const g = world.grid;
          const nx = clampTo(elemDrag.sx + (hit.x - elemDrag.startX), g.w);
          const nz = clampTo(elemDrag.sz + (hit.z - elemDrag.startZ), g.h);
          elemDrag.last = { x: nx, z: nz };
          world.spawnSetters.get(elemDrag.key)?.(nx, nz);
          world.render();
        }
        return;
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moveAccum += Math.abs(dx) + Math.abs(dy);
      if (dragButton === 0) {
        // LMB pan: translate camera and target by the same ground offset so
        // the cursor approximately sticks to the terrain.
        const dist = camera.position.distanceTo(target);
        const worldPerPx = (2 * dist * tanHalfFov) / Math.max(1, dom.clientHeight);
        const fwd = new THREE.Vector3().subVectors(target, camera.position);
        fwd.y = 0;
        if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
        fwd.normalize();
        const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
        const off = new THREE.Vector3()
          .addScaledVector(right, -dx * worldPerPx)
          .addScaledVector(fwd, dy * worldPerPx);
        target.add(off);
        camera.position.add(off);
      } else if (dragButton === 1) {
        // MMB orbit around the captured pivot with a polar clamp.
        const yawDelta = -dx * 0.005;
        const pitchDelta = dy * 0.005;
        const cy = Math.cos(yawDelta);
        const sy = Math.sin(yawDelta);
        const yawAround = (v: THREE.Vector3) => {
          const rx = v.x - mmbPivot.x;
          const rz = v.z - mmbPivot.z;
          v.x = mmbPivot.x + rx * cy - rz * sy;
          v.z = mmbPivot.z + rx * sy + rz * cy;
        };
        yawAround(camera.position);
        yawAround(target);
        const lookHoriz = new THREE.Vector3().subVectors(target, camera.position);
        lookHoriz.y = 0;
        if (lookHoriz.lengthSq() > 1e-6) {
          lookHoriz.normalize();
          const rightAxis = new THREE.Vector3(-lookHoriz.z, 0, lookHoriz.x);
          const q = new THREE.Quaternion().setFromAxisAngle(rightAxis, pitchDelta);
          const tmpCam = camera.position.clone().sub(mmbPivot).applyQuaternion(q).add(mmbPivot);
          const tmpTar = target.clone().sub(mmbPivot).applyQuaternion(q).add(mmbPivot);
          const off = new THREE.Vector3().subVectors(tmpCam, tmpTar);
          const offLen = off.length();
          if (offLen > 1e-3) {
            const newPolar = Math.acos(Math.max(-1, Math.min(1, off.y / offLen)));
            if (newPolar >= POLAR_MIN && newPolar <= POLAR_MAX) {
              camera.position.copy(tmpCam);
              target.copy(tmpTar);
            }
          }
        }
      }
      camera.lookAt(target);
      world.render();
    };

    const onMouseUp = (e: MouseEvent) => {
      if (elemDrag) {
        const bd = elemDrag;
        elemDrag = null;
        restoreCursor();
        if (bd.last && (Math.abs(bd.last.x - bd.sx) > 0.5 || Math.abs(bd.last.z - bd.sz) > 0.5)) {
          propsRef.current.onSpawnElementMoved(bd.key, +bd.last.x.toFixed(1), +bd.last.z.toFixed(1));
        } else {
          if (bd.last) {
            world.spawnSetters.get(bd.key)?.(bd.sx, bd.sz); // snap back — too small to commit
            world.render();
          }
          // A clean click on the element selects it (parity with 2D)
          propsRef.current.onSpawnElementClick(bd.key);
        }
        return;
      }
      if (!dragging) return;
      const wasButton = dragButton;
      dragging = false;
      dragButton = -1;
      restoreCursor();
      if (wasButton === 0 && moveAccum < CLICK_SLOP_PX) {
        const hit = pickTerrain(world, e.clientX, e.clientY);
        if (hit) propsRef.current.onMapClick(+hit.x.toFixed(1), +hit.z.toFixed(1));
      }
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.1 : 1 / 1.1;
      const curDist = camera.position.distanceTo(target);
      if (curDist < 1e-6) return;
      const newDist = Math.max(MIN_DISTANCE, Math.min(maxDistance, curDist * factor));
      const f = newDist / curDist;
      if (Math.abs(f - 1) < 1e-6) return;
      // Cursor-anchored zoom; falls back to a plain dolly over the background.
      const hit = pickTerrain(world, e.clientX, e.clientY);
      if (hit) {
        const pivot = new THREE.Vector3(hit.x, meshY(world.grid, hit.x, hit.z), -hit.z);
        camera.position.set(
          pivot.x + (camera.position.x - pivot.x) * f,
          pivot.y + (camera.position.y - pivot.y) * f,
          pivot.z + (camera.position.z - pivot.z) * f
        );
        target.set(
          pivot.x + (target.x - pivot.x) * f,
          pivot.y + (target.y - pivot.y) * f,
          pivot.z + (target.z - pivot.z) * f
        );
      } else {
        const dir = new THREE.Vector3().subVectors(camera.position, target).divideScalar(curDist);
        camera.position.copy(target).addScaledVector(dir, newDist);
      }
      camera.lookAt(target);
      world.render();
    };

    // ---- Keyboard: WASD pans on the ground plane, Q/E orbits around the
    // terrain point at the viewport center. Physical key codes (layout-
    // independent — works on ЙЦУКЕН too). Held keys drive a rAF loop with
    // delta-time; the view stays render-on-demand otherwise.
    const KEY_CODES = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE"]);
    const KEY_PAN = 0.7; // viewport heights per second
    const KEY_YAW = (100 * Math.PI) / 180; // rad per second
    const keysDown = new Set<string>();
    let keyRaf = 0;
    let keyLast = 0;
    const yawPivot = new THREE.Vector3();
    let yawPivotValid = false;

    const isTyping = () => {
      const el = document.activeElement;
      return (
        !!el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          (el as HTMLElement).isContentEditable)
      );
    };

    const keyStep = (now: number) => {
      const dt = Math.min(0.05, (now - keyLast) / 1000);
      keyLast = now;
      let moved = false;

      let px = 0; // screen-right
      let pf = 0; // screen-up (forward on the ground)
      if (keysDown.has("KeyW")) pf += 1;
      if (keysDown.has("KeyS")) pf -= 1;
      if (keysDown.has("KeyA")) px -= 1;
      if (keysDown.has("KeyD")) px += 1;
      if (px || pf) {
        const dist = camera.position.distanceTo(target);
        const speed = KEY_PAN * 2 * dist * tanHalfFov * dt;
        const fwd = new THREE.Vector3().subVectors(target, camera.position);
        fwd.y = 0;
        if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
        fwd.normalize();
        const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
        const off = new THREE.Vector3()
          .addScaledVector(right, px * speed)
          .addScaledVector(fwd, pf * speed);
        target.add(off);
        camera.position.add(off);
        yawPivotValid = false; // panning moves the viewport center
        moved = true;
      }

      let spin = 0;
      if (keysDown.has("KeyQ")) spin += 1;
      if (keysDown.has("KeyE")) spin -= 1;
      if (spin) {
        if (!yawPivotValid) {
          // Pivot = terrain under the screen center (fallback: camera target).
          const rect = dom.getBoundingClientRect();
          const hit = pickTerrain(world, rect.left + rect.width / 2, rect.top + rect.height / 2);
          if (hit) yawPivot.set(hit.x, meshY(world.grid, hit.x, hit.z), -hit.z);
          else yawPivot.copy(target);
          yawPivotValid = true;
        }
        const a = spin * KEY_YAW * dt;
        const cy = Math.cos(a);
        const sy = Math.sin(a);
        const yawAround = (v: THREE.Vector3) => {
          const rx = v.x - yawPivot.x;
          const rz = v.z - yawPivot.z;
          v.x = yawPivot.x + rx * cy - rz * sy;
          v.z = yawPivot.z + rx * sy + rz * cy;
        };
        yawAround(camera.position);
        yawAround(target);
        moved = true;
      }

      if (moved) {
        camera.lookAt(target);
        world.render();
      }
      keyRaf = keysDown.size > 0 ? requestAnimationFrame(keyStep) : 0;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!KEY_CODES.has(e.code) || e.ctrlKey || e.metaKey || e.altKey || isTyping()) return;
      if (keysDown.has(e.code)) return; // key auto-repeat
      if ((e.code === "KeyQ" || e.code === "KeyE") && !keysDown.has("KeyQ") && !keysDown.has("KeyE"))
        yawPivotValid = false; // fresh rotate session — re-pick the center
      keysDown.add(e.code);
      if (!keyRaf) {
        keyLast = performance.now();
        keyRaf = requestAnimationFrame(keyStep);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.code);
    };
    const onWindowBlur = () => {
      keysDown.clear(); // alt-tab must not leave keys stuck down
    };

    // Coordinate readout under the cursor (rAF-throttled terrain pick).
    let hoverRaf = 0;
    const onHover = (e: MouseEvent) => {
      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = 0;
        const el = coordsRef.current;
        if (!el || disposed) return;
        const hit = pickTerrain(world, e.clientX, e.clientY);
        if (hit) el.textContent = coordsText(propsRef.current.lang, Math.round(hit.x), Math.round(hit.z));
      });
    };

    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("contextmenu", onContextMenu);
    dom.addEventListener("mousemove", onHover);
    // Wheel on the mount container so it also fires over CSS2D overlays.
    mount.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    const ro = new ResizeObserver(() => {
      const cw = mount.clientWidth;
      const ch = mount.clientHeight;
      if (!cw || !ch) return;
      webgl.setSize(cw, ch);
      css2d.setSize(cw, ch);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      world.render();
    });
    ro.observe(mount);

    // ---- Imperative API for the page (pings, drag-drop conversion, fit) ----
    propsRef.current.onApi?.({
      addPing: (x, z, color) => {
        if (disposed) return;
        const { obj } = css2dNode(pingHtml(color));
        obj.position.set(x, meshY(world.grid, x, z) + 2, -z);
        scene.add(obj);
        world.render();
        window.setTimeout(() => {
          scene.remove(obj);
          if (!disposed) world.render();
        }, 750);
      },
      screenToWorld: (clientX, clientY) => {
        const rect = mount.getBoundingClientRect();
        if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom)
          return null;
        const hit = pickTerrain(world, clientX, clientY);
        if (!hit) return null;
        return { x: +hit.x.toFixed(1), z: +hit.z.toFixed(1) };
      },
      fitWholeMap: () => {
        const y = meshY(world.grid, centerX, centerZ);
        world.tweenTo(new THREE.Vector3(centerX, y, -centerZ), dist0);
      },
      getView: () => ({
        x: target.x,
        z: -target.z,
        radius: camera.position.distanceTo(target) * tanHalfFov,
      }),
    });

    world.render();

    return () => {
      disposed = true;
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("contextmenu", onContextMenu);
      dom.removeEventListener("mousemove", onHover);
      mount.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
      if (keyRaf) cancelAnimationFrame(keyRaf);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      if (world.focusAnimId !== null) cancelAnimationFrame(world.focusAnimId);
      ro.disconnect();
      clearOverlays(world);
      scene.remove(overlay);
      disposeTerrain();
      terrainMat.dispose();
      texture?.dispose();
      if (dom.parentNode === mount) mount.removeChild(dom);
      if (css2d.domElement.parentNode === mount) mount.removeChild(css2d.domElement);
      webgl.dispose();
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.terrainKey]);

  // ===== Overlay sync — same dep list as the 2D redraw effect ==============
  useEffect(() => {
    worldRef.current?.syncOverlays();
  }, [
    props.spawn,
    props.selectedSpawnEl,
    props.zones,
    props.selectedZoneId,
    props.selectedOrigin,
    props.markers,
    props.selectedMarkerId,
    props.objectives,
    props.selectedObjectiveId,
    props.props,
    props.selectedPropId,
    props.sectors,
    props.selectedSectorId,
    props.playableFaction,
    props.lang,
    props.fresh,
  ]);

  // Cursor tracks the armed placement mode (2D parity).
  useEffect(() => {
    const world = worldRef.current;
    if (world) world.webgl.domElement.style.cursor = props.placeMode ? "crosshair" : "grab";
  }, [props.placeMode]);

  // Fly to a requested focus point, honoring the fit-radius semantics.
  useEffect(() => {
    const world = worldRef.current;
    const f = props.focus;
    if (!world || !f) return;
    if (lastFocusSeqRef.current === f.seq) return;
    lastFocusSeqRef.current = f.seq;
    const tanHalfFov = Math.tan((world.camera.fov * Math.PI) / 360);
    const endDist = Math.min(
      world.maxDistance,
      Math.max(world.minDistance, (f.radius / tanHalfFov) * 1.1)
    );
    world.tweenTo(new THREE.Vector3(f.x, meshY(world.grid, f.x, f.z), -f.z), endDist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focus?.seq]);

  const zoomBy = (factor: number) => {
    const world = worldRef.current;
    if (!world) return;
    const { camera, target } = world;
    const curDist = camera.position.distanceTo(target);
    if (curDist < 1e-6) return;
    const newDist = Math.max(world.minDistance, Math.min(world.maxDistance, curDist * factor));
    const dir = new THREE.Vector3().subVectors(camera.position, target).divideScalar(curDist);
    camera.position.copy(target).addScaledVector(dir, newDist);
    camera.lookAt(target);
    world.render();
  };

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0 overflow-hidden" />

      {/* placement edge glow (2D parity) */}
      {props.placeMode && (
        <div
          className="absolute inset-0 pointer-events-none z-[900]"
          style={{ boxShadow: "inset 0 0 0 2px rgba(244,219,80,0.35), inset 0 0 80px rgba(244,219,80,0.05)" }}
        />
      )}

      <MapViewControls
        lang={props.lang}
        onZoomIn={() => zoomBy(1 / 1.4)}
        onZoomOut={() => zoomBy(1.4)}
        onFit={() => {
          const world = worldRef.current;
          if (!world) return;
          world.tweenTo(
            new THREE.Vector3(world.center.x, meshY(world.grid, world.center.x, -world.center.z), world.center.z),
            world.dist0
          );
        }}
        view3D={props.view3D}
        onToggleView={props.onToggleView}
      />

      {/* coordinate readout (no scale bar — perspective has no single scale) */}
      <div className="max-md:hidden absolute right-4 bottom-4 z-[1000] pointer-events-none">
        <div className="bg-[rgba(32,36,39,0.9)] rounded-[8px] px-[10px] py-[6px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.4)]">
          <span ref={coordsRef} className="font-mono text-[11px] leading-none font-medium text-white/75">
            {coordsText(props.lang, "—", "—")}
          </span>
        </div>
      </div>
    </div>
  );
}
