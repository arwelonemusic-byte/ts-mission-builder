"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FACTIONS, ZONE_MODULES } from "mission-gen";
import { defaultLoadouts, loadMission, newMission, saveMission, type Mission, type MissionMarker, type Zone } from "@/lib/mission";
import type { MapFocus } from "@/components/MissionMap";
import type { MarkerDraft } from "@/components/panels/MarkersPanel";
import { exportMission, spawnSlopeDelta } from "@/lib/export";
import StepTabs, { type StepId } from "@/components/StepTabs";
import { PANEL_SHADOW, XButton } from "@/components/ui";
import MissionPanel from "@/components/panels/MissionPanel";
import FactionsPanel from "@/components/panels/FactionsPanel";
import SpawnPanel from "@/components/panels/SpawnPanel";
import ZonesPanel from "@/components/panels/ZonesPanel";
import MarkersPanel from "@/components/panels/MarkersPanel";
import BriefingPanel from "@/components/panels/BriefingPanel";

const MissionMap = dynamic(() => import("@/components/MissionMap"), { ssr: false });

let zoneCounter = 0;
const zoneId = () => `z${Date.now().toString(36)}${(zoneCounter++).toString(36)}`;

const STEP_TITLES: Record<StepId, string> = {
  mission: "Mission setup",
  factions: "Factions & loadouts",
  spawn: "Spawn",
  zones: "AI Zones",
  markers: "Markers",
  briefing: "Briefing",
};

const DEFAULT_MARKER_DRAFT: MarkerDraft = {
  kind: "military",
  text: "",
  faction: "blufor",
  type: "infantry",
  quad: "circle",
  color: "WHITE",
  rotation: 0,
};

export default function Editor() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [step, setStep] = useState<StepId>("mission");
  const [placeMode, setPlaceMode] = useState<"spawn" | "zone" | "marker" | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [markerDraft, setMarkerDraftState] = useState<MarkerDraft>(DEFAULT_MARKER_DRAFT);
  const setMarkerDraft = (patch: Partial<MarkerDraft>) =>
    setMarkerDraftState((d) => ({ ...d, ...patch }));
  const [status, setStatus] = useState<string>("");
  const [slope, setSlope] = useState<number | null>(null);
  const [focus, setFocus] = useState<MapFocus | null>(null);

  const focusOn = (x: number, z: number, radius: number) =>
    setFocus((f) => ({ x, z, radius, seq: (f?.seq ?? 0) + 1 }));

  useEffect(() => {
    setMission(loadMission());
  }, []);
  useEffect(() => {
    if (mission) saveMission(mission);
  }, [mission]);

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

  const factionKeys = Object.keys(FACTIONS);

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

  /** Everything that must change together when the enemy faction changes:
   * troop sets reset to the faction default, per-zone patrol-vehicle
   * selections reset (vehicle keys are faction-specific). */
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
    // Playable and enemy factions can't match — bump the enemy to the next
    // available faction in the same update (no intermediate invalid state).
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

  const goStep = (s: StepId) => {
    setPlaceMode(null); // don't leave a stray click-to-place mode behind
    setStep(s);
  };

  const onMapClick = (x: number, z: number) => {
    if (!mission) return;
    if (!placeMode) {
      // Plain map click deselects everything (marker + zone — all cards collapse)
      setSelectedMarkerId(null);
      setSelectedZoneId(null);
      return;
    }
    const xi = +x.toFixed(1);
    const zi = +z.toFixed(1);
    if (placeMode === "spawn") {
      updateSpawn({ placed: true, x: xi, z: zi });
      setPlaceMode(null);
    } else if (placeMode === "marker") {
      // Marker placement stays active so several can be dropped in a row
      const mk: MissionMarker = { ...markerDraft, id: zoneId(), x: xi, z: zi };
      setMission((m) => (m ? { ...m, markers: [...m.markers, mk] } : m));
    } else {
      const zone: Zone = {
        id: zoneId(),
        x: xi,
        z: zi,
        radius: 200,
        modules: [{ type: ZONE_MODULES[0].type, budget: 2 }],
      };
      setMission((m) => (m ? { ...m, zones: [...m.zones, zone] } : m));
      setSelectedZoneId(zone.id);
      setPlaceMode(null);
    }
  };

  // Bumped on every map zone-click so the panel re-reveals the card even when
  // the same zone is clicked again (selectedZoneId alone wouldn't change).
  const [zoneRevealSeq, setZoneRevealSeq] = useState(0);
  const onZoneClick = (id: string) => {
    setSelectedZoneId(id);
    setZoneRevealSeq((s) => s + 1);
    setStep("zones");
  };

  const onMarkerClick = (id: string) => {
    setSelectedMarkerId((cur) => (cur === id ? null : id));
    setStep("markers");
  };

  /** Zone-card click in the panel: select + pan/zoom the map to the zone. */
  const selectAndFocusZone = (id: string) => {
    setSelectedZoneId(id);
    const zn = mission?.zones.find((z) => z.id === id);
    if (zn) focusOn(zn.x, zn.z, zn.radius * 1.5);
  };

  const busy = status === "Generating…";

  const doExport = async () => {
    if (!mission || busy) return;
    if (!mission.spawn.placed) {
      setStatus("Place a spawn point first (Spawn tab).");
      setStep("spawn");
      return;
    }
    if (mission.loadouts.length === 0) {
      setStatus("Select at least one loadout (Factions tab).");
      setStep("factions");
      return;
    }
    try {
      setStatus("Generating…");
      const result = await exportMission(mission);
      setStatus(`Done: ${result}. Open the project in Workbench once, then publish.`);
    } catch (err) {
      setStatus(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const onReset = () => {
    if (confirm("Reset the whole mission?")) {
      setMission(newMission());
      setSelectedZoneId(null);
      setSelectedMarkerId(null);
      setPlaceMode(null);
      setStatus("");
      setStep("mission");
    }
  };

  if (!mission) {
    return <main className="grid place-items-center h-dvh bg-slate-900 text-white/60">Loading…</main>;
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <MissionMap
          terrainKey={mission.terrain}
          playableFaction={mission.playableFaction}
          spawn={mission.spawn}
          zones={mission.zones}
          selectedZoneId={selectedZoneId}
          markers={mission.markers}
          selectedMarkerId={selectedMarkerId}
          placeMode={placeMode}
          focus={focus}
          onMapClick={onMapClick}
          onZoneClick={onZoneClick}
          onZoneMoved={(id, x, z) => updateZone(id, { x, z })}
          onSpawnMoved={(x, z) => updateSpawn({ x, z })}
          onMarkerClick={onMarkerClick}
          onMarkerMoved={(id, x, z) => updateMarker(id, { x, z })}
        />
      </div>

      {placeMode && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[1400] pointer-events-none bg-[rgba(32,36,39,0.95)] text-white text-[12px] px-4 py-2 rounded-[8px] ${PANEL_SHADOW}`}>
          Click the map to place{" "}
          <span className="text-[#f4db50] font-medium">
            {placeMode === "spawn" ? "the spawn point" : placeMode === "zone" ? "an AI zone" : "markers"}
          </span>{" "}
          — or press the button again to {placeMode === "marker" ? "finish" : "cancel"}.
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 bottom-4 w-[360px] z-[1500] flex flex-col gap-4">
        <div className="pointer-events-auto">
          <StepTabs step={step} onStep={goStep} onGenerate={doExport} busy={busy} />
        </div>

        {/* [&>*]:shrink-0 — panel children keep their natural height; overflow
            scrolls instead of flex-squeezing fixed-height buttons/inputs */}
        <div className={`pointer-events-auto min-h-0 bg-[#202427] rounded-[12px] p-5 flex flex-col gap-4 overflow-y-auto ts-thin-scrollbar [&>*]:shrink-0 ${PANEL_SHADOW}`}>
          <div className="flex items-center justify-between shrink-0">
            <h1 className="font-slab text-[20px] leading-[24px] font-medium text-white">
              {STEP_TITLES[step]}
            </h1>
            {step === "spawn" && mission.spawn.placed && (
              <button
                type="button"
                onClick={() => focusOn(mission.spawn.x, mission.spawn.z, 150)}
                className="text-[12px] text-[#f4db50] hover:text-[#f9e278] transition-colors"
              >
                Show on map
              </button>
            )}
          </div>
          {step === "mission" && (
            <MissionPanel mission={mission} update={update} onReset={onReset} />
          )}
          {step === "factions" && (
            <FactionsPanel
              mission={mission}
              update={update}
              onPlayableFaction={setPlayableFaction}
              onEnemyFaction={setEnemyFaction}
            />
          )}
          {step === "spawn" && (
            <SpawnPanel
              mission={mission}
              placeMode={placeMode}
              setPlaceMode={setPlaceMode}
              updateSpawn={updateSpawn}
              slope={slope}
            />
          )}
          {step === "zones" && (
            <ZonesPanel
              mission={mission}
              placeMode={placeMode}
              setPlaceMode={setPlaceMode}
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
              draft={markerDraft}
              setDraft={setMarkerDraft}
              selectedMarkerId={selectedMarkerId}
              updateMarker={updateMarker}
              removeMarker={removeMarker}
              placeMode={placeMode}
              setPlaceMode={setPlaceMode}
            />
          )}
          {step === "briefing" && <BriefingPanel mission={mission} update={update} />}
        </div>

        {status && (
          <div className={`pointer-events-auto shrink-0 bg-[#202427] rounded-[12px] p-4 flex items-start gap-2 ${PANEL_SHADOW}`}>
            <div className="flex-1 min-w-0 text-[12px] leading-[16px] text-white/80 whitespace-pre-wrap">
              {status}
            </div>
            <XButton ariaLabel="Dismiss" onClick={() => setStatus("")} />
          </div>
        )}
      </div>
    </main>
  );
}
