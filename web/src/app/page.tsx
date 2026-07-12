"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FACTIONS, ZONE_MODULES } from "mission-gen";
import {
  defaultLoadouts,
  factionMeta,
  freshenGuids,
  loadMission,
  newMission,
  saveMission,
  type Mission,
  type MissionMarker,
  type MissionSector,
  type Zone,
} from "@/lib/mission";
import { exportMission, spawnSlopeDelta } from "@/lib/export";
import { findColor, findIcon, MARKER_LABEL_OUTLINE, maskIconStyle, militaryIconUrl } from "@/lib/markers";
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
import MarkersPanel, { type MarkerDraft, type MarkersTab } from "@/components/panels/MarkersPanel";
import BriefingPanel from "@/components/panels/BriefingPanel";

const MissionMap = dynamic(() => import("@/components/MissionMap"), { ssr: false });

let idCounter = 0;
const freshId = () => `z${Date.now().toString(36)}${(idCounter++).toString(36)}`;

const STEP_TITLES: Record<StepId, string> = {
  mission: "Mission setup",
  players: "Players & loadouts",
  enemy: "Enemy forces",
  spawn: "Spawn",
  zones: "AI Zones",
  markers: "Markers",
  briefing: "Briefing",
};
const STEP_NUMS: Record<StepId, string> = {
  mission: "01",
  players: "02",
  spawn: "03",
  enemy: "04",
  zones: "05",
  markers: "06",
  briefing: "07",
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
  const [placeMode, setPlaceMode] = useState<"spawn" | "zone" | "marker" | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [markerDraft, setMarkerDraftState] = useState<MarkerDraft>(DEFAULT_MARKER_DRAFT);
  // Markers-panel sub-tab lives here (not in the panel) so map-side sector
  // clicks can force the panel onto the Sectors tab.
  const [markersTab, setMarkersTab] = useState<MarkersTab>("military");
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [sectorDraw, setSectorDraw] = useState<"ao" | "objective" | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [slope, setSlope] = useState<number | null>(null);
  const [focus, setFocus] = useState<{ x: number; z: number; radius: number; seq: number } | null>(null);
  const [gen, setGen] = useState<GenState>(null);
  const [ghost, setGhost] = useState<Ghost>(null);
  // Freshly placed map elements ("spawn" / zone id / marker id) — drives the
  // drop/stamp entrance animations; flags expire after 650ms (design v2).
  const [fresh, setFresh] = useState<Record<string, boolean>>({});
  const mapApi = useRef<MapApi | null>(null);
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

  // Esc: cancel placement / dismiss the finished generate overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (genRef.current?.phase === "done") setGen(null);
      else {
        setPlaceMode(null);
        setSectorDraw(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Slope check across the bundle footprint whenever spawn placement changes
  useEffect(() => {
    if (!mission?.spawn.placed) {
      setSlope(null);
      return;
    }
    let cancelled = false;
    spawnSlopeDelta(mission)
      .then((d) => {
        if (!cancelled) setSlope(d);
      })
      .catch(() => setSlope(null));
    return () => {
      cancelled = true;
    };
  }, [mission?.spawn, mission?.terrain]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setPlaceMode(null);
    setSelectedSectorId(null);
    setSectorDraw((cur) => (cur === kind ? null : kind));
  };
  const armPlaceMode = (m: "spawn" | "zone" | "marker" | null) => {
    setSectorDraw(null);
    setPlaceMode(m);
  };
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
      spawn: { ...mission.spawn, vehicles: [] },
    };
    if (pf === mission.enemyFaction) {
      const nextEnemy = factionKeys.find((f) => f !== pf);
      if (nextEnemy) Object.assign(patch, enemyPatch(nextEnemy, mission.zones));
    }
    update(patch);
  };

  const setEnemyFaction = (ef: string) => {
    if (!mission) return;
    update(enemyPatch(ef, mission.zones));
  };

  /** Toggle enabled mods; factions of a disabled mod fall back to vanilla
   * defaults (with the same cascades as a manual faction change). */
  const setMods = (mods: string[]) => {
    if (!mission) return;
    const allowed = (k: string) => {
      const mod = factionMeta(k).mod;
      return !mod || mods.includes(mod);
    };
    const patch: Partial<Mission> = { mods };
    let playable = mission.playableFaction;
    if (!allowed(playable)) {
      playable = "US";
      const sub = Object.keys(FACTIONS[playable].riflemen)[0];
      Object.assign(patch, {
        playableFaction: playable,
        playableSubfaction: sub,
        loadouts: defaultLoadouts(playable, sub),
        spawn: { ...mission.spawn, vehicles: [] },
      });
    }
    if (!allowed(mission.enemyFaction) || mission.enemyFaction === playable) {
      const nextEnemy = Object.keys(FACTIONS).find((f) => allowed(f) && f !== playable);
      if (nextEnemy) Object.assign(patch, enemyPatch(nextEnemy, mission.zones));
    }
    update(patch);
  };

  const goStep = (s: StepId) => {
    setPlaceMode(null);
    setSectorDraw(null);
    setStep(s);
  };

  const onMapClick = (x: number, z: number) => {
    if (!mission) return;
    if (!placeMode) {
      setSelectedMarkerId(null);
      setSelectedZoneId(null);
      setSelectedSectorId(null);
      return;
    }
    const xi = +x.toFixed(1);
    const zi = +z.toFixed(1);
    if (placeMode === "spawn") {
      updateSpawn({ placed: true, x: xi, z: zi });
      mapApi.current?.addPing(xi, zi, "#3fa9f5");
      markFresh("spawn");
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
      mapApi.current?.addPing(xi, zi, "#9333ea");
      markFresh(zone.id);
      setPlaceMode(null);
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
        const over = !!mapApi.current?.screenToWorld(ev.clientX, ev.clientY) && overPanelGate(ev.clientX);
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
        const world = mapApi.current?.screenToWorld(ev.clientX, ev.clientY);
        if (world && overPanelGate(ev.clientX)) {
          const id = freshId();
          setMission((m) =>
            m ? { ...m, markers: [...m.markers, { ...markerDraft, id, x: world.x, z: world.z }] } : m
          );
          mapApi.current?.addPing(world.x, world.z, "#f4db50");
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

  const onReset = () => {
    if (confirm(t("Reset the whole mission?"))) {
      setMission(newMission());
      setSelectedZoneId(null);
      setSelectedMarkerId(null);
      setSelectedSectorId(null);
      setSectorDraw(null);
      setPlaceMode(null);
      setStatus(null);
      setStep("mission");
    }
  };

  if (!mission) {
    return <main className="grid place-items-center h-dvh bg-[#0d0f11] text-white/60">Loading…</main>;
  }

  const placeNoun = placeMode === "spawn" ? t("the spawn point") : t("an AI zone");
  const sectorNoun = sectorDraw === "ao" ? t("the AO sector") : t("an objective sector");

  return (
    <LangProvider value={lang}>
    <main className="relative h-dvh w-full overflow-hidden bg-[#0d0f11] select-none">
      {/* map (below the 56px app bar; on mobile it stops above the bottom panel) */}
      <div className="absolute left-0 right-0 bottom-0 top-[56px] max-md:bottom-[var(--mb-map-bottom)]">
        <MissionMap
          terrainKey={mission.terrain}
          lang={lang}
          playableFaction={mission.playableFaction}
          spawn={mission.spawn}
          zones={mission.zones}
          selectedZoneId={selectedZoneId}
          markers={mission.markers}
          selectedMarkerId={selectedMarkerId}
          sectors={mission.sectors}
          selectedSectorId={selectedSectorId}
          sectorDraw={sectorDraw}
          fresh={fresh}
          placeMode={placeMode}
          focus={focus}
          onMapClick={onMapClick}
          onZoneClick={onZoneClick}
          onZoneMoved={(id, x, z) => updateZone(id, { x, z })}
          onSpawnMoved={(x, z) => updateSpawn({ x, z })}
          onMarkerClick={onMarkerClick}
          onMarkerMoved={(id, x, z) => updateMarker(id, { x, z })}
          onSectorDrawn={onSectorDrawn}
          onSectorClick={onSectorClick}
          onSectorChanged={updateSector}
          onApi={(api) => (mapApi.current = api)}
        />
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
                onClick={() => focusOn(mission.spawn.x, mission.spawn.z, 150)}
                className="text-[12px] text-[#f4db50] hover:text-[#f9e278] transition-colors"
              >
                {t("Show on map")}
              </button>
            )}
            {step === "zones" && mission.zones.length > 0 && (
              <span className="text-[12px] text-white/40">
                {zonesCountLabel(lang, mission.zones.length)}
              </span>
            )}
          </div>

          <div key={step} className="flex flex-col gap-4 [&>*]:shrink-0 animate-[mbFadeSlide_0.28s_cubic-bezier(0.22,1,0.36,1)]">
            {step === "mission" && (
              <MissionPanel mission={mission} update={update} onMods={setMods} onReset={onReset} />
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
                factionKeys={factionKeys}
                onEnemyFaction={setEnemyFaction}
              />
            )}
            {step === "spawn" && (
              <SpawnPanel
                mission={mission}
                placeMode={placeMode}
                setPlaceMode={armPlaceMode}
                updateSpawn={updateSpawn}
                slope={slope}
              />
            )}
            {step === "zones" && (
              <ZonesPanel
                mission={mission}
                placeMode={placeMode}
                setPlaceMode={armPlaceMode}
                selectedZoneId={selectedZoneId}
                revealSeq={zoneRevealSeq}
                onSelectZone={selectAndFocusZone}
                updateZone={updateZone}
                removeZone={removeZone}
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
