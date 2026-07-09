"use client";

import { useEffect, useRef, useState } from "react";
import { FACTIONS, ZONE_MODULES } from "mission-gen";
import type { Mission, Zone, ZoneModule } from "@/lib/mission";
import { CheckRow, GhostButton, Hint, Slider, XButton } from "../ui";

/** Module budget spinner. Allows clearing the field while typing (backspace);
 * an empty field commits 1 on blur. Typed values clamp to [1, max]. */
function BudgetInput({
  value,
  max,
  onCommit,
}: {
  value: number;
  max: number;
  onCommit: (v: number) => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <input
      type="number"
      min={1}
      max={max}
      value={text}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          setText("");
          return;
        }
        const v = Math.min(max, Math.max(1, Math.floor(+raw) || 1));
        setText(String(v));
        onCommit(v);
      }}
      onBlur={() => {
        if (text === "") {
          setText("1");
          onCommit(1);
        }
      }}
      className="w-[52px] h-[28px] shrink-0 bg-[#202427] border border-[#2e3439] rounded-[4px] px-2 text-[12px] text-white text-center focus:border-[#f4db50] focus:outline-none"
    />
  );
}

export default function ZonesPanel({
  mission,
  placeMode,
  setPlaceMode,
  selectedZoneId,
  revealSeq,
  onSelectZone,
  updateZone,
  removeZone,
}: {
  mission: Mission;
  placeMode: "spawn" | "zone" | "marker" | null;
  setPlaceMode: (m: "spawn" | "zone" | "marker" | null) => void;
  selectedZoneId: string | null;
  /** Bumped on every map zone-click — re-reveals the card even for a re-click */
  revealSeq: number;
  onSelectZone: (id: string) => void;
  updateZone: (id: string, patch: Partial<Zone>) => void;
  removeZone: (id: string) => void;
}) {
  const enemy = FACTIONS[mission.enemyFaction];
  const placing = placeMode === "zone";

  // When a zone is selected on the map, reveal its card in the scrollable panel
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    if (!selectedZoneId) return;
    cardRefs.current.get(selectedZoneId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedZoneId, revealSeq]);

  return (
    <>
      <GhostButton active={placing} onClick={() => setPlaceMode(placing ? null : "zone")}>
        {placing ? "Click the map… (cancel)" : "+ Add zone (click map)"}
      </GhostButton>
      {mission.zones.length === 0 && (
        <Hint>AI zones spawn enemy activity — garrisons, patrols, fortifications — around a map point.</Hint>
      )}

      {mission.zones.map((zn, i) => {
        const selected = zn.id === selectedZoneId;
        return (
          <div
            key={zn.id}
            ref={(el) => {
              if (el) cardRefs.current.set(zn.id, el);
              else cardRefs.current.delete(zn.id);
            }}
            onClick={() => onSelectZone(zn.id)}
            className={`bg-[#14181a] rounded-[8px] p-3 flex flex-col gap-2 border cursor-pointer transition-colors ${
              selected ? "border-[#f4db50]" : "border-transparent hover:border-[#2e3439]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="flex-1 text-[14px] font-medium text-white">Area{i + 1}</span>
              <XButton
                ariaLabel="Delete zone"
                onClick={(e) => {
                  e.stopPropagation();
                  removeZone(zn.id);
                }}
              />
            </div>

            {/* Collapsed: one-line summary. Expanded (= selected): full controls. */}
            {!selected && (
              <div className="text-[11px] leading-[16px] text-white/50">
                {[
                  `${zn.radius} m`,
                  ...zn.modules.map((mm) => {
                    const def = ZONE_MODULES.find(
                      (d: { type: string; label: string }) => d.type === mm.type
                    );
                    return `${mm.budget}× ${def?.label ?? mm.type}`;
                  }),
                ].join(" · ")}
              </div>
            )}

            {selected && (
              <>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white">Radius</span>
              <span className="text-[12px] text-white/60">{zn.radius} m</span>
            </div>
            <Slider
              min={50}
              max={1000}
              step={25}
              value={zn.radius}
              onChange={(v) => updateZone(zn.id, { radius: v })}
            />

            {ZONE_MODULES.map((def: { type: string; label: string; kind?: string; maxBudget?: number }) => {
              const mod = zn.modules.find((mm) => mm.type === def.type);
              return (
                <div key={def.type} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <CheckRow
                        checked={!!mod}
                        onChange={(on) => {
                          const fresh: ZoneModule =
                            def.kind === "vehicle"
                              ? { type: def.type, budget: 2, vehicles: enemy?.patrolVehicleKeys.slice(0, 1) ?? [] }
                              : { type: def.type, budget: 2 };
                          const modules = on
                            ? [...zn.modules, fresh]
                            : zn.modules.filter((mm) => mm.type !== def.type);
                          updateZone(zn.id, { modules });
                        }}
                      >
                        {def.label}
                      </CheckRow>
                    </div>
                    {mod && (
                      <BudgetInput
                        value={mod.budget}
                        max={def.maxBudget ?? 10}
                        onCommit={(v) =>
                          updateZone(zn.id, {
                            modules: zn.modules.map((mm) =>
                              mm.type === def.type ? { ...mm, budget: v } : mm
                            ),
                          })
                        }
                      />
                    )}
                  </div>
                  {mod && def.kind === "vehicle" && (
                    <div className="ml-1 pl-4 border-l border-[#2e3439] flex flex-col gap-1">
                      {(enemy?.patrolVehicleKeys ?? []).map((vk: string) => {
                        const checked = mod.vehicles?.includes(vk) ?? false;
                        return (
                          <CheckRow
                            key={vk}
                            checked={checked}
                            onChange={(on) => {
                              const cur = mod.vehicles ?? [];
                              const next = on ? [...cur, vk] : cur.filter((k) => k !== vk);
                              if (next.length === 0) return; // keep at least one vehicle
                              updateZone(zn.id, {
                                modules: zn.modules.map((mm) =>
                                  mm.type === def.type ? { ...mm, vehicles: next } : mm
                                ),
                              });
                            }}
                          >
                            {enemy?.vehicleLabels[vk] ?? vk}
                          </CheckRow>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
