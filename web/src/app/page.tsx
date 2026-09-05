"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FACTIONS, ZONE_MODULES } from "mission-gen";
import {
  DEFAULT_DELIVER_VEHICLE,
  DEFAULT_DESTROY_OBJECT,
  defaultArsenal,
  defaultLoadouts,
  downloadMissionJson,
  sanitizeArsenal,
  factionMeta,
  freshenGuids,
  freshSpawnElemId,
  loadMission,
  materializeSpawnAt,
  missionFileName,
  newMission,
  objectiveRadius,
  parseMissionJson,
  saveMission,
  type Mission,
  type MissionMarker,
  type MissionObjective,
  type MissionProp,
  type MissionSector,
  type ObjectiveType,
  type PlaceMode,
  type Zone,
  STOP_TRIGGER_RADIUS,
  type AiArtillery,
} from "@/lib/mission";
import { rangeLabel, totalEnemyRange } from "@/lib/enemyEstimate";
import { exportMission } from "@/lib/export";
import { findColor, findIcon, MARKER_LABEL_OUTLINE, maskIconStyle, militaryIconUrl } from "@/lib/markers";
import { ORIGIN_COLORS } from "@/lib/zoneModules";
import { ARTY_STOP_COLOR, OBJECTIVE_COLOR, PROP_COLOR } from "@/lib/overlayHtml";
import { LangProvider, loadLang, saveLang, tr, zonesCountLabel, type Lang } from "@/lib/i18n";
import AppBar, { type StepId } from "@/components/AppBar";
import GenerateOverlay, { GEN_STAGES, type GenState } from "@/components/GenerateOverlay";
import { XButton } from "@/components/ui";
import type { MapApi } from "@/components/MissionMap";
import MissionPanel from "@/components/panels/MissionPanel";
import PlayersPanel from "@/components/panels/PlayersPanel";
import EnemyPanel from "@/components/panels/EnemyPanel";
import SpawnPanel from "@/components/panels/SpawnPanel";
import ZonesPanel from "@/components/panels/ZonesPanel";
import ObjectivesPanel from "@/components/panels/ObjectivesPanel";
import PropsPanel from "@/components/panels/PropsPanel";
import MarkersPanel, { type MarkerDraft, type MarkersTab } from "@/components/panels/MarkersPanel";
import BriefingPanel from "@/components/panels/BriefingPanel";

const MissionMap = dynamic(() => import("@/components/MissionMap"), { ssr: false });
const MissionMap3D = dynamic(() => import("@/components/MissionMap3D"), { ssr: false });

let idCounter = 0;
const freshId = () => `z${Date.now().toString(36)}${(idCounter++).toString(36)}`;

const STEP_TITLES: Record<StepId, string> = {
  mission: "Mission setup",
  players: "Players & loadouts",
  enemy: "Enemy forces",
  spawn: "Spawn",
  zones: "AI Zones",
  objectives: "Objectives",
  props: "Props",
  markers: "Markers",
  briefing: "Briefing",
};
const STEP_NUMS: Record<StepId, string> = {
  mission: "01",
  players: "02",
  spawn: "03",
  enemy: "04",
  zones: "05",
  objectives: "06",
  props: "07",
  markers: "08",
  briefing: "09",
};

// Mobile bottom-sheet sizing per tab: these fill the whole height (their
// panels don't need the map); the rest hug their content, capped at 50dvh.
const FILL_STEPS: ReadonlySet<StepId> = new Set(["mission", "players", "enemy", "briefing"]);

const DEFAULT_MARKER_DRAFT: MarkerDraft = {
  kind: "military",
  text: "",
  faction: "blufor",
  type: "infantry",
  quad: "circle",
  color: "WHITE",
  rotation: 0,
};

type Status = { msg: string; kind: "warn" | "info"; n: number } | null;
type Ghost = { x: number; y: number; over: boolean } | null;

export default function Editor() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [lang, setLangState] = useState<Lang>("en");
  const [step, setStep] = useState<StepId>("mission");
  const [placeMode, setPlaceMode] = useState<PlaceMode>(null);
  // Which objective type an armed "objective" placement creates (type picker)
  const [pendingObjectiveType, setPendingObjectiveType] = useState<ObjectiveType | null>(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  // Enemy-artillery Stop trigger selection (single trigger → boolean)
  const [stopTriggerSelected, setStopTriggerSelected] = useState(false);
  // Selected spawn element (map footprint click) — shows the 2D rotate handle.
  // Keys: "farp" | "sp:<id>" | "crate:<id>" | "veh:<id>".
  const [selectedSpawnEl, setSelectedSpawnEl] = useState<string | null>(null);
  // Which prefab an armed "prop" placement creates (picked in the modal first)
  const [pendingPropRef, setPendingPropRef] = useState<string | null>(null);
  // Which vehicle type an armed "spawn-vehicle" placement creates (dropdown)
  const [pendingVehicleType, setPendingVehicleType] = useState<string | null>(null);
  // Which deliver objective an armed "delivery" placement feeds
  const [deliveryTarget, setDeliveryTarget] = useState<string | null>(null);
  // Which zone+module an armed "qrf-origin" placement feeds (QRF reinforcements)
  const [originTarget, setOriginTarget] = useState<{ zoneId: string; moduleType: string } | null>(null);
  // Selected reinforcement origin (panel row ↔ map badge, two-way)
  const [selectedOrigin, setSelectedOrigin] = useState<{
    zoneId: string;
    moduleType: string;
    index: number;
  } | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [markerDraft, setMarkerDraftState] = useState<MarkerDraft>(DEFAULT_MARKER_DRAFT);
  // Markers-panel sub-tab lives here (not in the panel) so map-side sector
  // clicks can force the panel onto the Sectors tab.
  const [markersTab, setMarkersTab] = useState<MarkersTab>("military");
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [sectorDraw, setSectorDraw] = useState<"ao" | "objective" | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [focus, setFocus] = useState<{ x: number; z: number; radius: number; seq: number } | null>(null);
  const [gen, setGen] = useState<GenState>(null);
  const [ghost, setGhost] = useState<Ghost>(null);
  // Freshly placed map elements ("spawn" / zone id / marker id) — drives the
  // drop/stamp entrance animations; flags expire after 650ms (design v2).
  const [fresh, setFresh] = useState<Record<string, boolean>>({});
  // 2D/3D view toggle. Leaflet stays mounted (CSS-hidden) while 3D is up so
  // its pan/zoom survives the round-trip; the 3D view mounts on demand.
  const [view3D, setView3DState] = useState(false);
  const view3DRef = useRef(false);
  // 2D viewport captured at toggle time — the 3D camera opens on it.
  const enterViewRef = useRef<{ x: number; z: number; radius: number } | null>(null);
  // Per-view imperative APIs (a single ref would go stale across toggles).
  const mapApi2d = useRef<MapApi | null>(null);
  const mapApi3d = useRef<MapApi | null>(null);
  const mapApi = () => (view3DRef.current ? mapApi3d.current : mapApi2d.current);
  const setView3D = (v: boolean) => {
    if (v) enterViewRef.current = mapApi2d.current?.getView?.() ?? null;
    else mapApi3d.current = null;
    view3DRef.current = v;
    setView3DState(v);
  };
  const genRef = useRef<GenState>(null);
  genRef.current = gen;

  // Mobile: the map region ends at the sheet's top edge — publish the sheet's
  // measured height as a CSS var (see --mb-map-bottom in globals.css).
  // Dep: the column only mounts after the mission loads (early "Loading…"
  // return), so re-run when that flips.
  const columnRef = useRef<HTMLDivElement>(null);
  const missionLoaded = mission !== null;
  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty("--mb-sheet-h", `${el.getBoundingClientRect().height}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [missionLoaded]);

  const setMarkerDraft = (patch: Partial<MarkerDraft>) => setMarkerDraftState((d) => ({ ...d, ...patch }));
  const t = (s: string) => tr(lang, s);
  const setLang = (l: Lang) => {
    setLangState(l);
    saveLang(l);
  };
  const say = (msg: string, kind: "warn" | "info" = "info") =>
    setStatus((s) => ({ msg, kind, n: (s?.n ?? 0) + 1 }));

  const focusOn = (x: number, z: number, radius: number) =>
    setFocus((f) => ({ x, z, radius, seq: (f?.seq ?? 0) + 1 }));

  const markFresh = (id: string) => {
    setFresh((f) => ({ ...f, [id]: true }));
    window.setTimeout(
      () =>
        setFresh((f) => {
          const next = { ...f };
          delete next[id];
          return next;
        }),
      650
    );
  };

  useEffect(() => {
    setMission(loadMission());
    setLangState(loadLang());
  }, []);
  useEffect(() => {
    if (mission) saveMission(mission);
  }, [mission]);

  // The 3D toggle lives in a desktop-only HUD cluster; if the window shrinks
  // to the mobile layout while 3D is up, fall back to 2D (no touch controls).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => {
      if (mq.matches) {
        view3DRef.current = false;
        setView3DState(false);
      }
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Esc: cancel placement / dismiss the finished generate overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (genRef.current?.phase === "done") setGen(null);
      else {
        setPlaceMode(null);
        setOriginTarget(null);
        setSectorDraw(null);
        setPendingObjectiveType(null);
        setPendingPropRef(null);
        setPendingVehicleType(null);
        setDeliveryTarget(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  // Factions offered by the UI: vanilla + factions of enabled mods. Factions
  // without riflemen (e.g. RHS ION — player-character GUIDs unrecoverable)
  // are enemy-only.
  const factionKeys = Object.keys(FACTIONS).filter((k) => {
    const mod = factionMeta(k).mod;
    return !mod || (mission?.mods ?? []).includes(mod);
  });
  const playableFactionKeys = factionKeys.filter(
    (k) => Object.keys(FACTIONS[k].riflemen ?? {}).length > 0
  );
  // playableOnly marks factions with no enemy-side content (US_DESERT — a pure
  // reskin alias of US; SFS lost the flag when it gained AI groups in 2026-08)
  const enemyFactionKeys = factionKeys.filter((k) => !FACTIONS[k].playableOnly);
  // Alias factions (aliasOf) share their base faction's in-game FactionKey —
  // both sides of an alias pair in one mission would be the same faction.
  // The enemy dropdown shows conflicting options disabled (EnemyPanel).
  const aliasConflict = (a: string, b: string) =>
    a !== b && (FACTIONS[a]?.aliasOf ?? a) === (FACTIONS[b]?.aliasOf ?? b);

  const update = (patch: Partial<Mission>) => setMission((m) => (m ? { ...m, ...patch } : m));
  const updateSpawn = (patch: Partial<Mission["spawn"]>) =>
    setMission((m) => (m ? { ...m, spawn: { ...m.spawn, ...patch } } : m));
  const updateZone = (id: string, patch: Partial<Zone>) =>
    setMission((m) =>
      m ? { ...m, zones: m.zones.map((z) => (z.id === id ? { ...z, ...patch } : z)) } : m
    );
  const removeZone = (id: string) => {
    setMission((m) => (m ? { ...m, zones: m.zones.filter((z) => z.id !== id) } : m));
    setSelectedZoneId((cur) => (cur === id ? null : cur));
    setSelectedOrigin((cur) => (cur?.zoneId === id ? null : cur));
    // Deleting the zone an origin placement was armed for cancels the mode
    setOriginTarget((cur) => {
      if (cur?.zoneId !== id) return cur;
      setPlaceMode((pm) => (pm === "qrf-origin" ? null : pm));
      return null;
    });
  };
  const updateObjective = (id: string, patch: Partial<MissionObjective>) =>
    setMission((m) =>
      m ? { ...m, objectives: m.objectives.map((o) => (o.id === id ? { ...o, ...patch } : o)) } : m
    );
  const removeObjective = (id: string) => {
    setMission((m) => (m ? { ...m, objectives: m.objectives.filter((o) => o.id !== id) } : m));
    setSelectedObjectiveId((cur) => (cur === id ? null : cur));
    // Deleting the objective an armed delivery placement was for cancels it
    setDeliveryTarget((cur) => {
      if (cur !== id) return cur;
      setPlaceMode((pm) => (pm === "delivery" ? null : pm));
      return null;
    });
  };
  const updateProp = (id: string, patch: Partial<MissionProp>) =>
    setMission((m) =>
      m ? { ...m, props: m.props.map((p) => (p.id === id ? { ...p, ...patch } : p)) } : m
    );
  const removeProp = (id: string) => {
    setMission((m) => (m ? { ...m, props: m.props.filter((p) => p.id !== id) } : m));
    setSelectedPropId((cur) => (cur === id ? null : cur));
  };
  const updateMarker = (id: string, patch: Partial<MissionMarker>) =>
    setMission((m) =>
      m ? { ...m, markers: m.markers.map((mk) => (mk.id === id ? { ...mk, ...patch } : mk)) } : m
    );
  const removeMarker = (id: string) => {
    setMission((m) => (m ? { ...m, markers: m.markers.filter((mk) => mk.id !== id) } : m));
    setSelectedMarkerId((cur) => (cur === id ? null : cur));
  };
  const updateSector = (id: string, patch: Partial<MissionSector>) =>
    setMission((m) =>
      m ? { ...m, sectors: m.sectors.map((s) => (s.id === id ? { ...s, ...patch } : s)) } : m
    );
  const removeSector = (id: string) => {
    setMission((m) => (m ? { ...m, sectors: m.sectors.filter((s) => s.id !== id) } : m));
    setSelectedSectorId((cur) => (cur === id ? null : cur));
  };

  /* ----- sector (TS_MapOverlay rectangle) placement + selection ----- */
  // Arming the draw mode and arming a click-place mode are mutually exclusive.
  const armSectorDraw = (kind: "ao" | "objective") => {
    setView3D(false); // rubber-band drawing is 2D-only (v1)
    setPlaceMode(null);
    setOriginTarget(null);
    setSelectedSectorId(null);
    setSectorDraw((cur) => (cur === kind ? null : kind));
  };
  const armPlaceMode = (m: PlaceMode) => {
    setSectorDraw(null);
    if (m !== "qrf-origin") setOriginTarget(null);
    if (m !== "objective") setPendingObjectiveType(null);
    if (m !== "prop") setPendingPropRef(null);
    if (m !== "spawn-vehicle") setPendingVehicleType(null);
    setPlaceMode(m);
  };
  /** Arm objective placement for a type from the panel picker (null = cancel). */
  const armObjectivePlace = (type: ObjectiveType | null) => {
    setSectorDraw(null);
    setOriginTarget(null);
    setDeliveryTarget(null);
    setPendingObjectiveType(type);
    setPlaceMode(type ? "objective" : null);
  };
  /** Arm prop placement for a prefab from the picker modal (null = cancel). */
  const armPropPlace = (ref: string | null) => {
    setSectorDraw(null);
    setOriginTarget(null);
    setDeliveryTarget(null);
    setPendingObjectiveType(null);
    setPendingPropRef(ref);
    setPlaceMode(ref ? "prop" : null);
  };
  /** Toggle delivery-point placement for a deliver objective (same id re-toggles off). */
  const armDeliveryPlace = (objectiveId: string) => {
    setSectorDraw(null);
    setOriginTarget(null);
    setPendingObjectiveType(null);
    setDeliveryTarget((cur) => {
      const same = cur === objectiveId;
      setPlaceMode(same ? null : "delivery");
      return same ? null : objectiveId;
    });
  };
  /** Toggle QRF origin placement for a zone+module (same pair re-toggles off). */
  const armOriginPlace = (zoneId: string, moduleType: string) => {
    setSectorDraw(null);
    setOriginTarget((cur) => {
      const same = cur?.zoneId === zoneId && cur.moduleType === moduleType;
      setPlaceMode(same ? null : "qrf-origin");
      return same ? null : { zoneId, moduleType };
    });
  };
  /** Toggle Stop Artillery trigger placement (re-click cancels). */
  const armStopTriggerPlace = () => {
    setDeliveryTarget(null);
    armPlaceMode(placeMode === "arty-stop" ? null : "arty-stop");
  };
  const setAiArty = (patch: Partial<AiArtillery>) =>
    setMission((m) => (m ? { ...m, aiArty: { ...m.aiArty, ...patch } } : m));
  const onSectorDrawn = (kind: "ao" | "objective", x: number, z: number, length: number, width: number) => {
    const id = freshId();
    setMission((m) => (m ? { ...m, sectors: [...m.sectors, { id, kind, x, z, length, width, rotation: 0 }] } : m));
    setSelectedSectorId(id);
    setSectorDraw(null);
    markFresh(id);
  };
  // Leaving the Sectors sub-tab disarms a pending draw mode.
  const goMarkersTab = (tab: MarkersTab) => {
    if (tab !== "sectors") setSectorDraw(null);
    setMarkersTab(tab);
  };
  const onSectorClick = (id: string) => {
    setSelectedSectorId(id);
    setSelectedMarkerId(null);
    setMarkersTab("sectors");
    setStep("markers");
  };

  /** Everything that must change together when the enemy faction changes. */
  const enemyPatch = (ef: string, zones: Zone[]): Partial<Mission> => ({
    enemyFaction: ef,
    enemyGroupSets: [FACTIONS[ef].defaultGroupSet],
    zones: zones.map((zn) => ({
      ...zn,
      modules: zn.modules.map((mm) =>
        mm.vehicles ? { ...mm, vehicles: FACTIONS[ef].patrolVehicleKeys.slice(0, 1) } : mm
      ),
    })),
  });

  const setPlayableFaction = (pf: string) => {
    if (!mission) return;
    const sub = Object.keys(FACTIONS[pf].riflemen)[0];
    const patch: Partial<Mission> = {
      playableFaction: pf,
      playableSubfaction: sub,
      loadouts: defaultLoadouts(pf, sub),
      arsenal: defaultArsenal(pf, sub),
      spawn: { ...mission.spawn, vehicles: [] },
    };
    if (pf === mission.enemyFaction || aliasConflict(pf, mission.enemyFaction)) {
      const nextEnemy = enemyFactionKeys.find((f) => f !== pf && !aliasConflict(f, pf));
      if (nextEnemy) Object.assign(patch, enemyPatch(nextEnemy, mission.zones));
    }
    update(patch);
  };

  const setEnemyFaction = (ef: string) => {
    if (!mission) return;
    update(enemyPatch(ef, mission.zones));
  };

  /** Move the playable side to `pf` keeping every pick that still resolves
   * there (subfaction, chosen loadouts, spawn vehicles; the arsenal is
   * re-sanitized by the caller). Used for alias hops (US ⇄ US_DESERT,
   * SFS_US → US): an alias inherits its base's rosters, so toggling a camo
   * pack must not wipe the user's setup. Anything that doesn't resolve falls
   * back exactly like a manual faction change. */
  const aliasHopPatch = (pf: string): Partial<Mission> => {
    if (!mission) return {};
    const F = FACTIONS[pf];
    const sub = F.riflemen[mission.playableSubfaction]
      ? mission.playableSubfaction
      : Object.keys(F.riflemen)[0];
    const set = new Set((F.loadoutSets[sub] ?? []).map((l) => l.prefab));
    const loadouts = mission.loadouts.filter((l) => set.has(l));
    return {
      playableFaction: pf,
      playableSubfaction: sub,
      loadouts: loadouts.length ? loadouts : defaultLoadouts(pf, sub),
      spawn: {
        ...mission.spawn,
        vehicles: mission.spawn.vehicles.filter((v) => !!F.vehicles?.[v.type]),
      },
    };
  };

  /** Toggle enabled mods; factions of a disabled mod fall back to vanilla
   * defaults (with the same cascades as a manual faction change). Enabling a
   * mod whose faction is a `defaultWhenEnabled` alias of the current playable
   * faction switches the players onto it (camo packs: US → US_DESERT). */
  const setMods = (mods: string[]) => {
    if (!mission) return;
    const allowed = (k: string) => {
      const mod = factionMeta(k).mod;
      return !mod || mods.includes(mod);
    };
    const patch: Partial<Mission> = { mods };
    let playable = mission.playableFaction;
    if (!allowed(playable)) {
      const base = FACTIONS[playable]?.aliasOf;
      if (base && allowed(base)) {
        // Disabling an alias pack: back to its base faction, picks preserved
        playable = base;
        Object.assign(patch, aliasHopPatch(playable));
      } else {
        playable = "US";
        const sub = Object.keys(FACTIONS[playable].riflemen)[0];
        Object.assign(patch, {
          playableFaction: playable,
          playableSubfaction: sub,
          loadouts: defaultLoadouts(playable, sub),
          arsenal: defaultArsenal(playable, sub),
          spawn: { ...mission.spawn, vehicles: [] },
        });
      }
    } else {
      const justEnabled = mods.filter((id) => !mission.mods.includes(id));
      const target = Object.keys(FACTIONS).find((k) => {
        const f = FACTIONS[k];
        return !!f.defaultWhenEnabled && f.aliasOf === playable && justEnabled.includes(f.mod ?? "");
      });
      if (target) {
        playable = target;
        Object.assign(patch, aliasHopPatch(playable));
      }
    }
    if (
      !allowed(mission.enemyFaction) ||
      mission.enemyFaction === playable ||
      aliasConflict(mission.enemyFaction, playable)
    ) {
      const nextEnemy = Object.keys(FACTIONS).find(
        (f) => allowed(f) && !FACTIONS[f].playableOnly && f !== playable && !aliasConflict(f, playable)
      );
      if (nextEnemy) Object.assign(patch, enemyPatch(nextEnemy, mission.zones));
    }
    // Disabling a mod also scrubs its items from the arsenal (unless the
    // playable cascade above already reset it to the new faction's default).
    if (!patch.arsenal) {
      patch.arsenal = sanitizeArsenal(
        mission.arsenal,
        mods,
        playable,
        patch.playableSubfaction ?? mission.playableSubfaction
      );
    }
    update(patch);
  };

  const goStep = (s: StepId) => {
    setPlaceMode(null);
    setOriginTarget(null);
    setSectorDraw(null);
    setPendingObjectiveType(null);
    setPendingPropRef(null);
    setPendingVehicleType(null);
    setDeliveryTarget(null);
    setStep(s);
  };

  // Prefilled task texts for a freshly placed objective (current UI lang).
  // Completion feedback is the native ON_FINISH task notification (carries the
  // task title) — no per-objective hint texts since 2026-08-02.
  const objectiveTextDefaults = (type: ObjectiveType) =>
    type === "hvt"
      ? {
          taskTitle: t("Eliminate the HVT"),
          taskDesc: t("Find and eliminate the enemy officer in the area."),
        }
      : type === "clear"
        ? {
            taskTitle: t("Clear the area"),
            taskDesc: t("Clear all enemy forces from the designated area."),
          }
        : type === "destroy"
          ? {
              taskTitle: t("Destroy the target"),
              taskDesc: t("Find and destroy the designated target."),
            }
          : type === "deliver"
            ? {
                taskTitle: t("Deliver the vehicle"),
                taskDesc: t("Get the vehicle to the delivery point intact."),
              }
            : {
                taskTitle: t("Reach the location"),
                taskDesc: t("Get to the designated location."),
              };

  const onMapClick = (x: number, z: number) => {
    if (!mission) return;
    if (!placeMode) {
      setSelectedMarkerId(null);
      setSelectedZoneId(null);
      setSelectedSectorId(null);
      setSelectedOrigin(null);
      setSelectedObjectiveId(null);
      setSelectedPropId(null);
      setStopTriggerSelected(false);
      setSelectedSpawnEl(null);
      return;
    }
    const xi = +x.toFixed(1);
    const zi = +z.toFixed(1);
    if (placeMode === "spawn") {
      // First placement: spawn point at the click + one crate. Everything
      // else is added via per-element map-click placement ("spawn" mode is
      // only reachable from the un-placed state — Move spawn was removed
      // 2026-08-19; relocating means Remove spawn + rebuild).
      update({ spawn: materializeSpawnAt(xi, zi) });
      mapApi()?.addPing(xi, zi, "#3fa9f5");
      markFresh("spawn");
      setPlaceMode(null);
    } else if (placeMode === "spawn-point") {
      const id = freshSpawnElemId();
      setMission((m) =>
        m && m.spawn.spawnPoints.length < 8
          ? { ...m, spawn: { ...m.spawn, spawnPoints: [...m.spawn.spawnPoints, { id, x: xi, z: zi, denied: [] }] } }
          : m
      );
      setSelectedSpawnEl(`sp:${id}`);
      mapApi()?.addPing(xi, zi, "#50c878");
      setPlaceMode(null);
    } else if (placeMode === "spawn-crate") {
      const id = freshSpawnElemId();
      setMission((m) =>
        m && m.spawn.crates.length < 8
          ? { ...m, spawn: { ...m.spawn, crates: [...m.spawn.crates, { id, x: xi, z: zi, rotation: 0 }] } }
          : m
      );
      setSelectedSpawnEl(`crate:${id}`);
      mapApi()?.addPing(xi, zi, "#50c878");
      setPlaceMode(null);
    } else if (placeMode === "spawn-vehicle" && pendingVehicleType) {
      const id = freshSpawnElemId();
      const type = pendingVehicleType;
      // Faction switched while armed → the type no longer resolves; disarm.
      if (!FACTIONS[mission.playableFaction]?.vehicles?.[type]) {
        setPlaceMode(null);
        setPendingVehicleType(null);
        return;
      }
      setMission((m) =>
        m
          ? { ...m, spawn: { ...m.spawn, vehicles: [...m.spawn.vehicles, { id, type, x: xi, z: zi, rotation: 0 }] } }
          : m
      );
      setSelectedSpawnEl(`veh:${id}`);
      mapApi()?.addPing(xi, zi, "#f5c542");
      setPlaceMode(null);
      setPendingVehicleType(null);
    } else if (placeMode === "spawn-farp") {
      updateSpawn({ farp: true, farpPos: { x: xi, z: zi, rotation: 0 } });
      setSelectedSpawnEl("farp");
      mapApi()?.addPing(xi, zi, "#3fa9f5");
      setPlaceMode(null);
    } else if (placeMode === "zone") {
      const zone: Zone = {
        id: freshId(),
        x: xi,
        z: zi,
        radius: 200,
        // explicit type — ZONE_MODULES[0] is Defense Group, not the default
        modules: [{ type: "TS_ScenarioFrameworkPluginAIPatrol", budget: 2 }],
      };
      setMission((m) => (m ? { ...m, zones: [...m.zones, zone] } : m));
      setSelectedZoneId(zone.id);
      mapApi()?.addPing(xi, zi, "#9333ea");
      markFresh(zone.id);
      setPlaceMode(null);
    } else if (placeMode === "objective" && pendingObjectiveType) {
      const type = pendingObjectiveType;
      const d = objectiveTextDefaults(type);
      const objective: MissionObjective = {
        id: freshId(),
        type,
        x: xi,
        z: zi,
        radius: objectiveRadius(type),
        objectRef:
          type === "destroy" ? DEFAULT_DESTROY_OBJECT : type === "deliver" ? DEFAULT_DELIVER_VEHICLE : undefined,
        delivery: type === "deliver" ? null : undefined,
        deliveryRadius: type === "deliver" ? 25 : undefined,
        ...d,
      };
      setMission((m) => (m ? { ...m, objectives: [...m.objectives, objective] } : m));
      setSelectedObjectiveId(objective.id);
      mapApi()?.addPing(xi, zi, OBJECTIVE_COLOR);
      markFresh(objective.id);
      setPlaceMode(null);
      setPendingObjectiveType(null);
    } else if (placeMode === "prop" && pendingPropRef) {
      // Pick-first flow: the prefab was chosen in the modal before arming
      const prop: MissionProp = { id: freshId(), ref: pendingPropRef, x: xi, z: zi, rotation: 0, defense: false };
      setMission((m) => (m ? { ...m, props: [...m.props, prop] } : m));
      setSelectedPropId(prop.id);
      mapApi()?.addPing(xi, zi, PROP_COLOR);
      markFresh(prop.id);
      setPlaceMode(null);
      setPendingPropRef(null);
    } else if (placeMode === "arty-stop") {
      // Single trigger; moving it afterwards = dragging the map badge
      setAiArty({ stopTrigger: { x: xi, z: zi, radius: STOP_TRIGGER_RADIUS.default } });
      setStopTriggerSelected(true);
      mapApi()?.addPing(xi, zi, ARTY_STOP_COLOR);
      markFresh("arty-stop");
      setPlaceMode(null);
    } else if (placeMode === "delivery" && deliveryTarget) {
      updateObjective(deliveryTarget, { delivery: { x: xi, z: zi } });
      setSelectedObjectiveId(deliveryTarget);
      mapApi()?.addPing(xi, zi, OBJECTIVE_COLOR);
      setPlaceMode(null);
      setDeliveryTarget(null);
    } else if (placeMode === "qrf-origin" && originTarget) {
      // Stays armed for multi-drop (like markers) until the module's origin
      // cap is reached; the panel button re-toggle / Esc cancels earlier.
      const zn = mission.zones.find((z) => z.id === originTarget.zoneId);
      const mm = zn?.modules.find((m2) => m2.type === originTarget.moduleType);
      const cap =
        ZONE_MODULES.find((d) => d.type === originTarget.moduleType)?.maxOrigins ?? 3;
      const cur = mm?.origins ?? [];
      if (!zn || !mm || cur.length >= cap) {
        setPlaceMode(null);
        setOriginTarget(null);
        return;
      }
      updateZone(zn.id, {
        modules: zn.modules.map((m2) =>
          m2.type === mm.type ? { ...m2, origins: [...cur, { x: xi, z: zi }] } : m2
        ),
      });
      mapApi()?.addPing(xi, zi, ORIGIN_COLORS[originTarget.moduleType] ?? "#f97316");
      if (cur.length + 1 >= cap) {
        setPlaceMode(null);
        setOriginTarget(null);
      }
    }
  };

  // Bumped on every map zone-click so the panel re-reveals the card even when
  // the same zone is clicked again.
  const [zoneRevealSeq, setZoneRevealSeq] = useState(0);
  const onZoneClick = (id: string) => {
    setSelectedZoneId(id);
    setZoneRevealSeq((s) => s + 1);
    setStep("zones");
  };

  const selectAndFocusZone = (id: string) => {
    setSelectedZoneId(id);
    const zn = mission?.zones.find((z) => z.id === id);
    if (zn) focusOn(zn.x, zn.z, zn.radius * 1.5);
  };

  /* ----- objective selection (panel card ↔ map badge, two-way) ----- */
  const [objectiveRevealSeq, setObjectiveRevealSeq] = useState(0);
  const onObjectiveClick = (id: string) => {
    setSelectedObjectiveId(id);
    setObjectiveRevealSeq((s) => s + 1);
    setStep("objectives");
  };
  const selectAndFocusObjective = (id: string) => {
    setSelectedObjectiveId(id);
    const o = mission?.objectives.find((ob) => ob.id === id);
    if (o) focusOn(o.x, o.z, Math.max(200, (o.radius ?? 0) * 1.5));
  };

  /* ----- prop selection (panel card ↔ map badge, two-way) ----- */
  const [propRevealSeq, setPropRevealSeq] = useState(0);
  const onPropClick = (id: string) => {
    setSelectedPropId(id);
    setPropRevealSeq((s) => s + 1);
    setStep("props");
  };
  const selectAndFocusProp = (id: string) => {
    setSelectedPropId(id);
    const p = mission?.props.find((pr) => pr.id === id);
    if (p) focusOn(p.x, p.z, 150);
  };

  /* ----- Stop Artillery trigger selection (panel card ↔ map badge) ----- */
  const [stopTriggerRevealSeq, setStopTriggerRevealSeq] = useState(0);
  const onStopTriggerClick = () => {
    setStopTriggerSelected(true);
    setStopTriggerRevealSeq((s) => s + 1);
    setStep("enemy");
  };
  const selectAndFocusStopTrigger = () => {
    setStopTriggerSelected(true);
    const st = mission?.aiArty.stopTrigger;
    if (st) focusOn(st.x, st.z, Math.max(200, st.radius * 1.5));
  };
  const removeStopTrigger = () => {
    setAiArty({ stopTrigger: null });
    setStopTriggerSelected(false);
    if (placeMode === "arty-stop") setPlaceMode(null);
  };

  /* ----- spawn element selection / move / rotate (map-side) ----- */
  const [spawnRevealSeq, setSpawnRevealSeq] = useState(0);
  const onSpawnElementClick = (key: string) => {
    setSelectedSpawnEl(key);
    setSpawnRevealSeq((s) => s + 1);
    setStep("spawn");
  };
  /** Panel row click → select the element on the map and fly to it. */
  const selectAndFocusSpawnEl = (key: string) => {
    setSelectedSpawnEl(key);
    const sp = mission?.spawn;
    if (!sp) return;
    let pos: { x: number; z: number } | undefined;
    if (key === "farp") pos = sp.farpPos;
    else if (key.startsWith("sp:")) pos = sp.spawnPoints.find((p) => p.id === key.slice(3));
    else if (key.startsWith("crate:")) pos = sp.crates.find((c) => c.id === key.slice(6));
    else if (key.startsWith("veh:")) pos = sp.vehicles.find((v) => v.id === key.slice(4));
    if (pos) focusOn(pos.x, pos.z, 150);
  };
  const patchSpawnElement = (key: string, patch: { x?: number; z?: number; rotation?: number }) =>
    setMission((m) => {
      if (!m) return m;
      const sp = m.spawn;
      if (key === "farp") return { ...m, spawn: { ...sp, farpPos: { ...sp.farpPos, ...patch } } };
      if (key.startsWith("sp:") && patch.x !== undefined && patch.z !== undefined) {
        const id = key.slice("sp:".length);
        return {
          ...m,
          spawn: {
            ...sp,
            spawnPoints: sp.spawnPoints.map((p) => (p.id === id ? { ...p, x: patch.x!, z: patch.z! } : p)),
          },
        };
      }
      if (key.startsWith("crate:")) {
        const id = key.slice("crate:".length);
        return { ...m, spawn: { ...sp, crates: sp.crates.map((c) => (c.id === id ? { ...c, ...patch } : c)) } };
      }
      if (key.startsWith("veh:")) {
        const id = key.slice("veh:".length);
        return { ...m, spawn: { ...sp, vehicles: sp.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)) } };
      }
      return m;
    });
  const onSpawnElementMoved = (key: string, x: number, z: number) => patchSpawnElement(key, { x, z });
  const onSpawnElementRotated = (key: string, rotation: number) => patchSpawnElement(key, { rotation });

  /* ----- QRF origin selection (panel row ↔ map badge, two-way) ----- */
  const selectOriginFromPanel = (zoneId: string, moduleType: string, index: number) => {
    setSelectedOrigin({ zoneId, moduleType, index });
    const o = mission?.zones
      .find((z) => z.id === zoneId)
      ?.modules.find((m2) => m2.type === moduleType)?.origins?.[index];
    if (o) focusOn(o.x, o.z, 200);
  };
  const onOriginMapClick = (zoneId: string, moduleType: string, index: number) => {
    setSelectedOrigin({ zoneId, moduleType, index });
    setSelectedZoneId(zoneId);
    setZoneRevealSeq((s) => s + 1);
    setStep("zones");
  };
  /** Fix up the selection when an origin row is deleted (indices shift). */
  const onOriginRemoved = (zoneId: string, moduleType: string, index: number) =>
    setSelectedOrigin((cur) => {
      if (!cur || cur.zoneId !== zoneId || cur.moduleType !== moduleType) return cur;
      if (cur.index === index) return null;
      return cur.index > index ? { ...cur, index: cur.index - 1 } : cur;
    });

  const onMarkerClick = (id: string) => {
    setSelectedMarkerId((cur) => (cur === id ? null : id));
    setSelectedSectorId(null);
    const mk = mission?.markers.find((m2) => m2.id === id);
    if (mk) setMarkersTab(mk.kind);
    setStep("markers");
  };

  /* ----- marker drag-and-drop from the panel ----- */
  // Desktop: the 360px panel floats OVER the full-bleed map, so a clientX gate
  // (392 = 16 + panel + 16) rejects drops over the panel. Mobile (<768px): the
  // bottom panel doesn't overlap the map, so screenToWorld's rect check is enough.
  const overPanelGate = (clientX: number) =>
    !window.matchMedia("(min-width: 768px)").matches || clientX >= 392;
  const onMarkerDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const move = (ev: PointerEvent) => {
        const over = !!mapApi()?.screenToWorld(ev.clientX, ev.clientY) && overPanelGate(ev.clientX);
        setGhost({ x: ev.clientX, y: ev.clientY, over });
      };
      const cleanup = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", cancel);
        setGhost(null);
      };
      // OS-interrupted touch (incoming call, gesture takeover): drop nothing
      const cancel = () => cleanup();
      const up = (ev: PointerEvent) => {
        cleanup();
        const world = mapApi()?.screenToWorld(ev.clientX, ev.clientY);
        if (world && overPanelGate(ev.clientX)) {
          const id = freshId();
          setMission((m) =>
            m ? { ...m, markers: [...m.markers, { ...markerDraft, id, x: world.x, z: world.z }] } : m
          );
          mapApi()?.addPing(world.x, world.z, "#f4db50");
          markFresh(id);
        }
      };
      setGhost({ x: e.clientX, y: e.clientY, over: false });
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", cancel);
    },
    [markerDraft]
  );

  /* ----- generate flow ----- */
  // Generate = validation + the staged progress theater ending in the MISSION
  // READY state; the real folder-pick export runs from the Download button
  // (its click provides the user activation showDirectoryPicker needs).
  const busy = gen?.phase === "run";
  const doGenerate = () => {
    if (!mission || busy) return;
    if (!mission.spawn.placed) {
      say(t("Place a spawn point first (Spawn tab)."), "warn");
      goStep("spawn");
      return;
    }
    if (mission.loadouts.length === 0) {
      say(t("Select at least one loadout (Players tab)."), "warn");
      goStep("players");
      return;
    }
    if (mission.objectives.some((o) => o.type === "deliver" && !o.delivery)) {
      say(t("Place a delivery point for every Deliver Vehicle objective (Objectives tab)."), "warn");
      goStep("objectives");
      return;
    }
    setGen({ phase: "run", stage: 0 });
    let stage = 0;
    const ticker = window.setInterval(() => {
      stage += 1;
      if (stage >= GEN_STAGES.length) {
        window.clearInterval(ticker);
        setGen((g) => (g && g.phase === "run" ? { ...g, stage: GEN_STAGES.length } : g));
        window.setTimeout(() => setGen((g) => (g && g.phase === "run" ? { ...g, phase: "done" } : g)), 350);
      } else {
        setGen((g) => (g && g.phase === "run" ? { ...g, stage } : g));
      }
    }, 480);
  };

  const doDownload = async () => {
    if (!mission) return;
    // A renamed mission is a new addon — re-mint guids so two exports never
    // share resource GUIDs; setMission persists them for stable re-exports
    const m = freshenGuids(mission);
    if (m !== mission) setMission(m);
    try {
      const { fileCount, dirName } = await exportMission(m);
      // Fire-and-forget: archive the generated mission server-side (stats +
      // recoverable copy). Export success never depends on this.
      fetch("/api/generated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(m),
      }).catch(() => {});
      setGen(null);
      say(
        t("Mission written to {dir}/ ({n} files).")
          .replace("{dir}", dirName)
          .replace("{n}", String(fileCount))
      );
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      if (aborted) return; // picker cancelled — stay on the ready screen
      // t() maps known error messages (e.g. the folder-export one) to RU;
      // unknown messages pass through untranslated.
      setGen(null);
      const msg = t(err instanceof Error ? err.message : String(err));
      say(t("Export failed: {error}").replace("{error}", msg), "warn");
    }
  };

  // Everything that points INTO the old mission (ids, armed placement modes)
  // has to go when the whole mission object is swapped out.
  const clearSelections = () => {
    setSelectedZoneId(null);
    setSelectedMarkerId(null);
    setSelectedSectorId(null);
    setSelectedOrigin(null);
    setSelectedObjectiveId(null);
    setSelectedPropId(null);
    setStopTriggerSelected(false);
    setOriginTarget(null);
    setSectorDraw(null);
    setPendingObjectiveType(null);
    setPendingPropRef(null);
    setPendingVehicleType(null);
    setDeliveryTarget(null);
    setPlaceMode(null);
    setStatus(null);
    setStep("mission");
  };

  const onReset = () => {
    if (confirm(t("Reset the whole mission?"))) {
      setMission(newMission());
      clearSelections();
    }
  };

  /* ----- mission file (.json) -----
   * Browser-agnostic on purpose: the addon export needs showDirectoryPicker
   * (Chrome/Edge), this doesn't — it's how a Firefox user gets work out. */
  const onSaveFile = () => {
    if (!mission) return;
    downloadMissionJson(mission);
    say(t("Mission saved as {file}").replace("{file}", missionFileName(mission)));
  };

  const onLoadFile = async (file: File) => {
    try {
      // Parse BEFORE asking — no point confirming a file we can't read
      const loaded = parseMissionJson(await file.text());
      if (!confirm(t("Replace the current mission with this file?"))) return;
      setMission(loaded);
      clearSelections();
      say(t("Loaded: {name}").replace("{name}", loaded.displayName));
    } catch (err) {
      const msg = t(err instanceof Error ? err.message : String(err));
      say(t("Import failed: {error}").replace("{error}", msg), "warn");
    }
  };

  if (!mission) {
    return <main className="grid place-items-center h-dvh bg-[#0d0f11] text-white/60">Loading…</main>;
  }

  const placeNoun =
    placeMode === "spawn"
      ? t("the spawn point")
      : placeMode === "spawn-point"
        ? t("a spawn point")
        : placeMode === "spawn-crate"
          ? t("an arsenal crate")
          : placeMode === "spawn-vehicle"
            ? t("the vehicle")
            : placeMode === "spawn-farp"
              ? t("the FARP")
      : placeMode === "qrf-origin"
        ? t("a reinforcement origin")
        : placeMode === "objective"
          ? t("the objective")
          : placeMode === "delivery"
            ? t("the delivery point")
            : placeMode === "prop"
              ? t("the prop")
              : placeMode === "arty-stop"
                ? t("the stop-artillery trigger")
                : t("an AI zone");
  const sectorNoun = sectorDraw === "ao" ? t("the AO sector") : t("an objective sector");

  return (
    <LangProvider value={lang}>
    <main className="relative h-dvh w-full overflow-hidden bg-[#0d0f11] select-none">
      {/* map (below the 56px app bar; on mobile it stops above the bottom panel).
          2D stays mounted (display:none) while 3D is up; 3D mounts on demand. */}
      <div className="absolute left-0 right-0 bottom-0 top-[56px] max-md:bottom-[var(--mb-map-bottom)]">
        {(() => {
          const shared = {
            terrainKey: mission.terrain,
            lang,
            playableFaction: mission.playableFaction,
            spawn: mission.spawn,
            zones: mission.zones,
            selectedZoneId,
            selectedOrigin,
            onOriginClick: onOriginMapClick,
            objectives: mission.objectives,
            selectedObjectiveId,
            onObjectiveClick,
            onObjectiveMoved: (id: string, x: number, z: number) => updateObjective(id, { x, z }),
            onDeliveryMoved: (id: string, x: number, z: number) => updateObjective(id, { delivery: { x, z } }),
            props: mission.props,
            selectedPropId,
            onPropClick,
            onPropMoved: (id: string, x: number, z: number) => updateProp(id, { x, z }),
            stopTrigger: mission.aiArty.enabled ? mission.aiArty.stopTrigger : null,
            stopTriggerSelected,
            onStopTriggerClick,
            onStopTriggerMoved: (x: number, z: number) =>
              setMission((m) =>
                m && m.aiArty.stopTrigger
                  ? { ...m, aiArty: { ...m.aiArty, stopTrigger: { ...m.aiArty.stopTrigger, x, z } } }
                  : m
              ),
            markers: mission.markers,
            selectedMarkerId,
            sectors: mission.sectors,
            selectedSectorId,
            sectorDraw,
            fresh,
            placeMode,
            focus,
            onMapClick,
            onZoneClick,
            onZoneMoved: (id: string, x: number, z: number) => updateZone(id, { x, z }),
            onOriginMoved: (zoneId: string, moduleType: string, index: number, x: number, z: number) =>
              setMission((m) =>
                m
                  ? {
                      ...m,
                      zones: m.zones.map((zn) =>
                        zn.id === zoneId
                          ? {
                              ...zn,
                              modules: zn.modules.map((mm) =>
                                mm.type === moduleType
                                  ? {
                                      ...mm,
                                      origins: (mm.origins ?? []).map((o, i) =>
                                        i === index ? { x, z } : o
                                      ),
                                    }
                                  : mm
                              ),
                            }
                          : zn
                      ),
                    }
                  : m
              ),
            selectedSpawnEl,
            onSpawnElementClick,
            onSpawnElementMoved,
            onSpawnElementRotated,
            onMarkerClick,
            onMarkerMoved: (id: string, x: number, z: number) => updateMarker(id, { x, z }),
            onSectorDrawn,
            onSectorClick,
            onSectorChanged: updateSector,
          };
          return (
            <>
              <div className={`absolute inset-0 ${view3D ? "hidden" : ""}`}>
                <MissionMap
                  {...shared}
                  view3D={view3D}
                  onToggleView={() => setView3D(true)}
                  onApi={(api) => (mapApi2d.current = api)}
                />
              </div>
              {view3D && (
                <MissionMap3D
                  {...shared}
                  view3D
                  onToggleView={() => setView3D(false)}
                  initialView={enterViewRef.current}
                  onApi={(api) => (mapApi3d.current = api)}
                />
              )}
            </>
          );
        })()}
      </div>

      <AppBar
        step={step}
        onStep={goStep}
        onGenerate={doGenerate}
        busy={busy}
        dots={{ spawn: !mission.spawn.placed, players: mission.loadouts.length === 0 }}
        lang={lang}
        onLang={setLang}
      />

      {/* placement banner */}
      {(placeMode || sectorDraw) && (
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[1700] pointer-events-none flex items-center gap-[10px] bg-[rgba(32,36,39,0.95)] rounded-[8px] px-4 py-[9px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] animate-[mbFadeSlide_0.25s_ease] max-md:max-w-[calc(100vw-24px)]">
          <span className="w-2 h-2 rounded-full bg-[#f4db50] animate-[mbPulseDot_1.2s_ease-in-out_infinite]" />
          <span className="text-[12px] leading-[1.4] text-white">
            {placeMode ? (
              <>
                {t("Click the map to place")} <span className="text-[#f4db50] font-medium">{placeNoun}</span>
              </>
            ) : (
              <>
                {t("Drag on the map to draw")} <span className="text-[#f4db50] font-medium">{sectorNoun}</span>
              </>
            )}
            <span className="text-white/45"> {t("· press the button again to cancel")}</span>
          </span>
        </div>
      )}

      {/* left column (desktop) / bottom sheet (mobile: full-height for
          map-less tabs, content-hugging capped at 50dvh for the rest) */}
      <div
        ref={columnRef}
        className={`pointer-events-none absolute left-4 top-[72px] bottom-4 w-[360px] z-[1650] flex flex-col gap-3 max-md:left-0 max-md:right-0 max-md:w-auto max-md:bottom-[var(--mb-tabbar-h)] ${
          FILL_STEPS.has(step) ? "max-md:top-[56px]" : "max-md:top-auto max-md:max-h-[50dvh]"
        }`}
      >
        <div
          className={`pointer-events-auto min-h-0 bg-[#202427] rounded-[12px] p-5 flex flex-col gap-4 overflow-y-auto ts-thin-scrollbar [&>*]:shrink-0 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] max-md:grow max-md:rounded-b-none`}
        >
          <div className="flex items-center gap-[10px] shrink-0">
            <span className="font-mono text-[11px] leading-none font-semibold text-[#f4db50] bg-[rgba(244,219,80,0.12)] rounded-[4px] px-[6px] py-[5px] tracking-[0.08em]">
              {STEP_NUMS[step]}
            </span>
            <h1 className="font-slab text-[20px] leading-[24px] font-medium text-white flex-1 min-w-0">
              {t(STEP_TITLES[step])}
            </h1>
            {step === "spawn" && mission.spawn.placed && (
              <button
                type="button"
                onClick={() => {
                  if (!confirm(t("Delete all spawn elements? You'll need to build the spawn from scratch."))) return;
                  setSelectedSpawnEl(null);
                  setPendingVehicleType(null);
                  setPlaceMode(null);
                  updateSpawn({
                    placed: false,
                    x: 0,
                    z: 0,
                    farp: false,
                    farpPos: { x: 0, z: 0, rotation: 0 },
                    spawnPoints: [{ id: freshSpawnElemId(), x: 0, z: 0, denied: [] }],
                    crates: [],
                    vehicles: [],
                  });
                }}
                className="text-[12px] text-[#e8593c] hover:text-[#f07a62] transition-colors"
              >
                {t("Remove spawn")}
              </button>
            )}
            {step === "zones" && mission.zones.length > 0 && (
              <span className="text-[12px] text-white/40" title={t("Estimated enemy count")}>
                {zonesCountLabel(lang, mission.zones.length)}
                {(() => {
                  const total = rangeLabel(totalEnemyRange(mission));
                  return total ? ` · ${total} ${t("hostiles")}` : "";
                })()}
              </span>
            )}
          </div>

          <div key={step} className="flex flex-col gap-4 [&>*]:shrink-0 animate-[mbFadeSlide_0.28s_cubic-bezier(0.22,1,0.36,1)]">
            {step === "mission" && (
              <MissionPanel
                mission={mission}
                update={update}
                onMods={setMods}
                onReset={onReset}
                onSaveFile={onSaveFile}
                onLoadFile={onLoadFile}
              />
            )}
            {step === "players" && (
              <PlayersPanel
                mission={mission}
                update={update}
                factionKeys={playableFactionKeys}
                onPlayableFaction={setPlayableFaction}
              />
            )}
            {step === "enemy" && (
              <EnemyPanel
                mission={mission}
                update={update}
                factionKeys={enemyFactionKeys}
                onEnemyFaction={setEnemyFaction}
                placeMode={placeMode}
                onArmStopTrigger={armStopTriggerPlace}
                stopTriggerSelected={stopTriggerSelected}
                stopTriggerRevealSeq={stopTriggerRevealSeq}
                onSelectStopTrigger={selectAndFocusStopTrigger}
                onRemoveStopTrigger={removeStopTrigger}
              />
            )}
            {step === "spawn" && (
              <SpawnPanel
                mission={mission}
                placeMode={placeMode}
                setPlaceMode={armPlaceMode}
                update={update}
                updateSpawn={updateSpawn}
                selectedSpawnEl={selectedSpawnEl}
                revealSeq={spawnRevealSeq}
                selectSpawnEl={selectAndFocusSpawnEl}
                onAddVehicle={(type) => {
                  setPendingVehicleType(type);
                  armPlaceMode("spawn-vehicle");
                }}
              />
            )}
            {step === "zones" && (
              <ZonesPanel
                mission={mission}
                placeMode={placeMode}
                setPlaceMode={armPlaceMode}
                originTarget={originTarget}
                onArmOrigin={armOriginPlace}
                selectedOrigin={selectedOrigin}
                onSelectOrigin={selectOriginFromPanel}
                onOriginRemoved={onOriginRemoved}
                selectedZoneId={selectedZoneId}
                revealSeq={zoneRevealSeq}
                onSelectZone={selectAndFocusZone}
                updateZone={updateZone}
                removeZone={removeZone}
              />
            )}
            {step === "objectives" && (
              <ObjectivesPanel
                mission={mission}
                placing={placeMode === "objective"}
                pendingType={pendingObjectiveType}
                onArmObjective={armObjectivePlace}
                deliveryTarget={placeMode === "delivery" ? deliveryTarget : null}
                onArmDelivery={armDeliveryPlace}
                selectedObjectiveId={selectedObjectiveId}
                revealSeq={objectiveRevealSeq}
                onSelectObjective={selectAndFocusObjective}
                updateObjective={updateObjective}
                removeObjective={removeObjective}
              />
            )}
            {step === "props" && (
              <PropsPanel
                mission={mission}
                placing={placeMode === "prop"}
                pendingRef={pendingPropRef}
                onArmProp={armPropPlace}
                selectedPropId={selectedPropId}
                revealSeq={propRevealSeq}
                onSelectProp={selectAndFocusProp}
                updateProp={updateProp}
                removeProp={removeProp}
              />
            )}
            {step === "markers" && (
              <MarkersPanel
                mission={mission}
                tab={markersTab}
                setTab={goMarkersTab}
                draft={markerDraft}
                setDraft={setMarkerDraft}
                selectedMarkerId={selectedMarkerId}
                updateMarker={updateMarker}
                removeMarker={removeMarker}
                onDragStart={onMarkerDragStart}
                selectedSectorId={selectedSectorId}
                sectorDraw={sectorDraw}
                onArmSectorDraw={armSectorDraw}
                updateSector={updateSector}
                removeSector={removeSector}
                onDeselectMarker={() => setSelectedMarkerId(null)}
              />
            )}
            {step === "briefing" && <BriefingPanel mission={mission} update={update} />}
          </div>
        </div>

        {status && (
          <div
            key={status.n}
            className="pointer-events-auto shrink-0 bg-[#202427] rounded-[12px] px-[14px] py-3 flex items-start gap-[10px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] animate-[mbShake_0.4s_ease] max-md:order-first max-md:mx-3"
          >
            <span className={`text-[13px] leading-4 ${status.kind === "warn" ? "text-[#f4db50]" : "text-white/60"}`}>
              {status.kind === "warn" ? "⚠" : "ⓘ"}
            </span>
            <div className="flex-1 min-w-0 text-[12px] leading-4 text-white/80 whitespace-pre-wrap">{status.msg}</div>
            <XButton ariaLabel={t("Dismiss")} onClick={() => setStatus(null)} />
          </div>
        )}
      </div>

      {/* marker drag ghost */}
      {ghost && (
        <div
          className="fixed z-[2500] pointer-events-none"
          style={{
            left: ghost.x,
            top: ghost.y,
            transform: `translate(-50%,-50%) scale(${ghost.over ? 1 : 0.8})`,
            opacity: ghost.over ? 0.95 : 0.5,
            transition: "transform 0.12s ease, opacity 0.12s ease",
          }}
        >
          {ghost.over && (
            <div className="absolute -inset-2 rounded-full border border-dashed border-[#f4db50]" />
          )}
          {markerDraft.kind === "military" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={militaryIconUrl(markerDraft.faction, markerDraft.type)}
              alt=""
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <div style={maskIconStyle(findIcon(markerDraft.quad), 40, findColor(markerDraft.color).hex, markerDraft.rotation)} />
          )}
          {markerDraft.text.trim() && (
            <div
              className="absolute left-[44px] top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] leading-[1.2] font-semibold text-black"
              style={{ textShadow: MARKER_LABEL_OUTLINE }}
            >
              {markerDraft.text.trim()}
            </div>
          )}
        </div>
      )}

      <GenerateOverlay gen={gen} onClose={() => setGen(null)} onDownload={doDownload} />
    </main>
    </LangProvider>
  );
}
