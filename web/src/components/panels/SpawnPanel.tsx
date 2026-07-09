"use client";

import { FACTIONS } from "mission-gen";
import type { Mission } from "@/lib/mission";
import { Divider, GhostButton, Hint, SectionLabel, SelectInput, Slider, Toggle, XButton } from "../ui";

export default function SpawnPanel({
  mission,
  placeMode,
  setPlaceMode,
  updateSpawn,
  slope,
}: {
  mission: Mission;
  placeMode: "spawn" | "zone" | "marker" | null;
  setPlaceMode: (m: "spawn" | "zone" | "marker" | null) => void;
  updateSpawn: (patch: Partial<Mission["spawn"]>) => void;
  slope: number | null;
}) {
  const spawn = mission.spawn;
  const playable = FACTIONS[mission.playableFaction];
  const placing = placeMode === "spawn";
  const togglePlace = () => setPlaceMode(placing ? null : "spawn");

  if (!spawn.placed) {
    return (
      <>
        <GhostButton active={placing} onClick={togglePlace}>
          {placing ? "Click the map… (cancel)" : "Place spawn (click map)"}
        </GhostButton>
        <Hint>Place the spawn point on the map to unlock rotation, FARP and vehicle settings.</Hint>
      </>
    );
  }

  return (
    <>
      <GhostButton active={placing} onClick={togglePlace}>
        {placing ? "Click the map… (cancel)" : "Move spawn (click map)"}
      </GhostButton>
      <div className="text-[12px] text-white/60">
        at {spawn.x}, {spawn.z}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-white">Rotation</span>
          <span className="text-[12px] text-white/60">{spawn.yaw}°</span>
        </div>
        <Slider min={0} max={355} step={5} value={spawn.yaw} onChange={(v) => updateSpawn({ yaw: v })} />
      </div>

      {slope !== null && slope > 3 && (
        <div className="bg-[rgba(244,219,80,0.12)] border border-[rgba(244,219,80,0.4)] rounded-[8px] p-3 text-[12px] leading-[16px] text-[#f4db50]">
          ⚠ Uneven ground: {slope.toFixed(1)} m elevation change across the bundle footprint. Consider
          moving or rotating the spawn.
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">FARP composition</span>
        <Toggle
          checked={spawn.farp}
          onChange={(on) => updateSpawn({ farp: on })}
          ariaLabel="FARP composition"
        />
      </div>

      <Divider />

      <SectionLabel>Vehicles</SectionLabel>
      {spawn.vehicles.length > 0 && (
        <div className="flex flex-col gap-1">
          {spawn.vehicles.map((v, i) => (
            <div key={i} className="flex items-center gap-2 h-[32px] bg-[#14181a] rounded-[4px] pl-3 pr-1">
              <span className="flex-1 min-w-0 truncate text-[12px] text-white/80">
                {playable?.vehicleLabels[v.type] ?? v.type}
              </span>
              <XButton
                ariaLabel="Remove vehicle"
                onClick={() => updateSpawn({ vehicles: spawn.vehicles.filter((_, j) => j !== i) })}
              />
            </div>
          ))}
        </div>
      )}
      {Object.keys(playable?.vehicles ?? {}).length === 0 ? (
        <Hint>No vehicle catalogue for this faction yet.</Hint>
      ) : (
        <SelectInput
          value=""
          onChange={(e) => {
            if (e.target.value) updateSpawn({ vehicles: [...spawn.vehicles, { type: e.target.value }] });
          }}
        >
          <option value="">+ add vehicle…</option>
          {Object.keys(playable?.vehicles ?? {}).map((vk) => (
            <option key={vk} value={vk}>
              {playable?.vehicleLabels[vk] ?? vk}
            </option>
          ))}
        </SelectInput>
      )}
    </>
  );
}
