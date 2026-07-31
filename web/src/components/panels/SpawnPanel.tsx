"use client";

import { useState } from "react";
import { FACTIONS, vehicleSizeClass } from "mission-gen";
import type { Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { Divider, GhostButton, SectionLabel, SelectInput, Slider, Toggle } from "../ui";

export default function SpawnPanel({
  mission,
  placeMode,
  setPlaceMode,
  updateSpawn,
  slope,
}: {
  mission: Mission;
  placeMode: "spawn" | "zone" | "marker" | "qrf-origin" | "objective" | "delivery" | null;
  setPlaceMode: (m: "spawn" | "zone" | "marker" | "qrf-origin" | "objective" | "delivery" | null) => void;
  updateSpawn: (patch: Partial<Mission["spawn"]>) => void;
  slope: number | null;
}) {
  const t = useT();
  const spawn = mission.spawn;
  const playable = FACTIONS[mission.playableFaction];
  const placing = placeMode === "spawn";
  const togglePlace = () => setPlaceMode(placing ? null : "spawn");

  // Ground vehicles and helicopters are separate lists (the bundle lays them
  // out in separate rows) — reordering is confined to the item's own group.
  const ground: { type: string }[] = [];
  const helis: { type: string }[] = [];
  for (const v of spawn.vehicles) (vehicleSizeClass(v.type) === "heli" ? helis : ground).push(v);

  // Pointer-drag row reorder (36px steps, live commit). The highlight follows
  // the dragged ITEM to its current slot, not the original position.
  const [drag, setDrag] = useState<{ group: "ground" | "heli"; idx: number } | null>(null);
  const beginVehDrag = (e: React.PointerEvent, group: "ground" | "heli", idx0: number) => {
    e.preventDefault();
    const startY = e.clientY;
    // Snapshot both groups at drag start; every move re-derives the order from
    // the snapshot (single splice), so intermediate commits can't drift.
    const g0 = [...ground];
    const h0 = [...helis];
    const src = group === "ground" ? g0 : h0;
    setDrag({ group, idx: idx0 });
    let cur = idx0;
    const onMove = (ev: PointerEvent) => {
      const target = Math.max(0, Math.min(src.length - 1, idx0 + Math.round((ev.clientY - startY) / 36)));
      if (target === cur) return;
      cur = target;
      const moved = [...src];
      const [item] = moved.splice(idx0, 1);
      moved.splice(target, 0, item);
      updateSpawn({
        vehicles: group === "ground" ? [...moved, ...h0] : [...g0, ...moved],
      });
      setDrag({ group, idx: target });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setDrag(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const vehRow = (group: "ground" | "heli", v: { type: string }, j: number) => {
    const dragging = drag?.group === group && drag.idx === j;
    return (
      <div
        key={`${group}${j}`}
        className={`flex items-center gap-2 h-[32px] rounded-[4px] pl-2 pr-1 transition-colors ${
          dragging ? "bg-[#2e3439] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.5)]" : "bg-[#14181a]"
        }`}
      >
        <span
          onPointerDown={(e) => beginVehDrag(e, group, j)}
          className="shrink-0 cursor-grab touch-none text-white/40 hover:text-white/70 px-1"
          title={t("Drag to reorder")}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" aria-hidden>
            <circle cx="2" cy="2" r="1.2" /><circle cx="6" cy="2" r="1.2" />
            <circle cx="2" cy="7" r="1.2" /><circle cx="6" cy="7" r="1.2" />
            <circle cx="2" cy="12" r="1.2" /><circle cx="6" cy="12" r="1.2" />
          </svg>
        </span>
        <span className="flex-1 min-w-0 truncate text-[12px] text-white/80">
          {playable?.vehicleLabels[v.type] ?? v.type}
        </span>
        <button
          type="button"
          aria-label={t("Remove vehicle")}
          onClick={() => {
            const nextGround = group === "ground" ? ground.filter((_, k) => k !== j) : ground;
            const nextHelis = group === "heli" ? helis.filter((_, k) => k !== j) : helis;
            updateSpawn({ vehicles: [...nextGround, ...nextHelis] });
          }}
          className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/zones/trash.svg" alt="" style={{ width: 14, height: 14 }} />
        </button>
      </div>
    );
  };

  if (!spawn.placed) {
    return (
      <>
        <GhostButton active={placing} onClick={togglePlace}>
          {placing ? t("Click the map… (cancel)") : t("Place spawn (click map)")}
        </GhostButton>
        <div className="border border-dashed border-[#2e3439] rounded-[8px] px-4 py-6 flex flex-col items-center gap-[10px] text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f4db50" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M22 12a10 10 0 1 1-20 0a10 10 0 0 1 20 0M22 12h-4M6 12H2M12 6V2M12 22v-4" />
            <circle cx="12" cy="12" r="1.5" fill="#f4db50" stroke="none" />
          </svg>
          <span className="text-[13px] font-medium text-white">{t("No spawn point yet")}</span>
          <span className="text-[11px] leading-4 text-white/40 max-w-[260px]">
            {t(
              "Hit the button above, then click anywhere on the map. The base bundle — spawn point, arsenal crate and vehicles — is laid out around it."
            )}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <GhostButton active={placing} onClick={togglePlace}>
        {placing ? t("Click the map… (cancel)") : t("Move spawn (click map)")}
      </GhostButton>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-white">{t("Rotation")}</span>
          <span className="text-[12px] text-white/60">{spawn.yaw}°</span>
        </div>
        <Slider min={0} max={355} step={5} value={spawn.yaw} onChange={(v) => updateSpawn({ yaw: v })} />
      </div>

      {slope !== null && slope > 3 && (
        <div className="bg-[rgba(244,219,80,0.12)] border border-[rgba(244,219,80,0.4)] rounded-[8px] p-3 text-[12px] leading-[16px] text-[#f4db50] animate-[mbFadeSlide_0.2s_ease]">
          {t(
            "⚠ Uneven ground: {n} m elevation change across the bundle footprint. Consider moving or rotating the spawn."
          ).replace("{n}", slope.toFixed(1))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">{t("FARP composition")}</span>
        <Toggle
          checked={spawn.farp}
          onChange={(on) => updateSpawn({ farp: on })}
          ariaLabel={t("FARP composition")}
        />
      </div>

      <Divider />

      <SectionLabel>{t("Vehicles")}</SectionLabel>
      {spawn.vehicles.length > 0 && (
        <div className="flex flex-col gap-1">
          {ground.map((v, j) => vehRow("ground", v, j))}
          {ground.length > 0 && helis.length > 0 && <div className="border-t border-[#2e3439] my-1" />}
          {helis.map((v, j) => vehRow("heli", v, j))}
        </div>
      )}
      {Object.keys(playable?.vehicles ?? {}).length === 0 ? (
        <span className="text-[11px] leading-4 text-white/40">
          {t("No vehicle catalogue for this faction yet.")}
        </span>
      ) : (
        <SelectInput
          value=""
          onChange={(e) => {
            if (e.target.value) updateSpawn({ vehicles: [...spawn.vehicles, { type: e.target.value }] });
          }}
        >
          <option value="">{t("+ add vehicle…")}</option>
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
