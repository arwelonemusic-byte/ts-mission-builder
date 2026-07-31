"use client";

import { useEffect, useRef, useState } from "react";
import { FACTIONS, ZONE_MODULES } from "mission-gen";
import type { Mission, Zone, ZoneModule } from "@/lib/mission";
import { rangeLabel, zoneEnemyRange } from "@/lib/enemyEstimate";
import { MODULE_DESCRIPTIONS, MODULE_ICONS } from "@/lib/zoneModules";
import { useLang, useT, zoneName } from "@/lib/i18n";
import { CheckRow, GhostButton, PlusIcon, Slider } from "../ui";

/** Foot Patrols weight slider: 5 stops over contiguous size-class windows.
 * Only the selected stop's label is shown. Stop 3 (all sizes) = default. */
const PATROL_WEIGHT_STOPS: { sizes: string[]; label: string }[] = [
  { sizes: ["small"], label: "Small groups only" },
  { sizes: ["small", "medium"], label: "Small to medium groups" },
  { sizes: ["small", "medium", "large"], label: "Mix of all group sizes" },
  { sizes: ["medium", "large"], label: "Medium to large groups" },
  { sizes: ["large"], label: "Only large groups" },
];
function weightStop(sizes?: string[]): number {
  if (!sizes?.length) return 3;
  const key = [...sizes].sort().join(",");
  const idx = PATROL_WEIGHT_STOPS.findIndex((s) => [...s.sizes].sort().join(",") === key);
  return idx === -1 ? 3 : idx + 1;
}

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
  originTarget,
  onArmOrigin,
  selectedOrigin,
  onSelectOrigin,
  onOriginRemoved,
  selectedZoneId,
  revealSeq,
  onSelectZone,
  updateZone,
  removeZone,
}: {
  mission: Mission;
  placeMode: "spawn" | "zone" | "marker" | "qrf-origin" | "objective" | "delivery" | null;
  setPlaceMode: (m: "spawn" | "zone" | "marker" | "qrf-origin" | "objective" | "delivery" | null) => void;
  /** Armed QRF origin placement: which zone+module the next map click feeds */
  originTarget: { zoneId: string; moduleType: string } | null;
  /** Toggle origin placement for a zone+module (re-toggle to cancel) */
  onArmOrigin: (zoneId: string, moduleType: string) => void;
  /** Selected origin (two-way with the map badges) */
  selectedOrigin: { zoneId: string; moduleType: string; index: number } | null;
  /** Select an origin row → page pans/zooms the map to it */
  onSelectOrigin: (zoneId: string, moduleType: string, index: number) => void;
  /** Notify the page an origin was deleted so the selection index stays valid */
  onOriginRemoved: (zoneId: string, moduleType: string, index: number) => void;
  selectedZoneId: string | null;
  /** Bumped on every map zone-click — re-reveals the card even for a re-click */
  revealSeq: number;
  onSelectZone: (id: string) => void;
  updateZone: (id: string, patch: Partial<Zone>) => void;
  removeZone: (id: string) => void;
}) {
  const t = useT();
  const lang = useLang();
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
        {!placing && <PlusIcon />}
        {placing ? t("Click the map… (cancel)") : t("Add zone (click map)")}
      </GhostButton>
      {mission.zones.length === 0 && (
        <div className="border border-dashed border-[#2e3439] rounded-[8px] px-4 py-6 flex flex-col items-center gap-[10px] text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.5" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" fill="#9333ea" stroke="none" />
          </svg>
          <span className="text-[13px] font-medium text-white">{t("No AI zones yet")}</span>
          <span className="text-[11px] leading-4 text-white/40 max-w-[260px]">
            {t(
              "AI zones spawn enemy activity — garrisons, patrols, fortifications — around a map point. Drop one near an objective."
            )}
          </span>
        </div>
      )}

      {mission.zones.map((zn, i) => {
        const selected = zn.id === selectedZoneId;
        const est = rangeLabel(zoneEnemyRange(zn, mission.enemyFaction, mission.enemyGroupSets));
        return (
          <div
            key={zn.id}
            ref={(el) => {
              if (el) cardRefs.current.set(zn.id, el);
              else cardRefs.current.delete(zn.id);
            }}
            onClick={() => onSelectZone(zn.id)}
            className={`bg-[#14181a] rounded-[8px] p-4 flex flex-col border cursor-pointer transition-[border-color,transform] animate-[mbFadeSlide_0.3s_ease] ${
              selected
                ? "gap-2 border-[#f4db50]"
                : "gap-3 border-transparent hover:border-[#2e3439] hover:-translate-y-px"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-white">{zoneName(lang, i + 1)}</span>
              {!selected && (
                <span className="flex items-center gap-[3px]">
                  <img src="/icons/zones/radius.svg" alt="" style={{ width: 16, height: 16 }} />
                  <span className="text-[12px] text-white">{zn.radius} m</span>
                </span>
              )}
              {est && (
                <span className="flex items-center gap-[3px]" title={t("Estimated enemy count")}>
                  <img src="/icons/zones/skull.svg" alt="" style={{ width: 16, height: 16 }} />
                  <span className="text-[12px] text-white/60">{est}</span>
                </span>
              )}
              <span className="flex-1" />
              <button
                type="button"
                aria-label={t("Delete zone")}
                onClick={(e) => {
                  e.stopPropagation();
                  removeZone(zn.id);
                }}
                className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
              >
                <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Collapsed: icon chips for every module — disabled ones greyed
                with 0 (Figma 106:24). Expanded (= selected): full controls. */}
            {!selected && (
              <div className="flex items-center gap-3">
                {ZONE_MODULES.map((d: { type: string; label: string }) => {
                  const mm = zn.modules.find((m2) => m2.type === d.type);
                  return (
                    <span key={d.type} className="flex items-center gap-[3px]" title={t(d.label)}>
                      <img
                        src={MODULE_ICONS[d.type]}
                        alt={t(d.label)}
                        style={{
                          width: 16,
                          height: 16,
                          ...(mm ? {} : { filter: "grayscale(1) brightness(0.8)", opacity: 0.45 }),
                        }}
                      />
                      <span className={`text-[12px] ${mm ? "text-white" : "text-white/40"}`}>
                        {mm?.budget ?? 0}
                      </span>
                    </span>
                  );
                })}
              </div>
            )}

            {selected && (
              /* Interacting with the expanded controls must not bubble to the
                 card's onClick — that re-focuses the map on the zone. */
              <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white">{t("Radius")}</span>
              <span className="text-[12px] text-white/60">{zn.radius} m</span>
            </div>
            <Slider
              min={50}
              max={1000}
              step={25}
              value={zn.radius}
              onChange={(v) => updateZone(zn.id, { radius: v })}
              trackColor="#2e3439"
            />

            {ZONE_MODULES.map((def: { type: string; label: string; kind?: string; sizes?: string[]; maxBudget?: number; noBudget?: boolean; maxOrigins?: number }) => {
              const mod = zn.modules.find((mm) => mm.type === def.type);
              const isQrf = def.kind === "qrf-foot" || def.kind === "qrf-vehicle";
              const wantsVehicles = def.kind === "vehicle" || def.kind === "qrf-vehicle";
              const origins = mod?.origins ?? [];
              const armed =
                placeMode === "qrf-origin" &&
                originTarget?.zoneId === zn.id &&
                originTarget.moduleType === def.type;
              return (
                <div key={def.type} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0" title={t(MODULE_DESCRIPTIONS[def.type])}>
                      <CheckRow
                        checked={!!mod}
                        onChange={(on) => {
                          const fresh: ZoneModule = wantsVehicles
                            ? {
                                type: def.type,
                                budget: isQrf ? 1 : 2,
                                vehicles: enemy?.patrolVehicleKeys.slice(0, 1) ?? [],
                                ...(isQrf ? { origins: [] } : {}),
                              }
                            : {
                                type: def.type,
                                budget: def.noBudget || isQrf ? 1 : 2,
                                ...(isQrf ? { origins: [] } : {}),
                              };
                          const modules = on
                            ? [...zn.modules, fresh]
                            : zn.modules.filter((mm) => mm.type !== def.type);
                          // Unchecking the module that origin placement is
                          // armed for cancels the placement mode.
                          if (!on && armed) onArmOrigin(zn.id, def.type);
                          updateZone(zn.id, { modules });
                        }}
                      >
                        {t(def.label)}
                      </CheckRow>
                    </div>
                    {mod && !def.noBudget && (
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
                  {mod && def.kind === "infantry" && (def.sizes?.length ?? 0) > 1 && (
                    <div className="ml-1 pl-4 border-l border-[#2e3439] flex flex-col gap-1">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={weightStop(mod.sizes)}
                        onChange={(v) =>
                          updateZone(zn.id, {
                            modules: zn.modules.map((mm) =>
                              mm.type === def.type
                                ? { ...mm, sizes: PATROL_WEIGHT_STOPS[v - 1].sizes }
                                : mm
                            ),
                          })
                        }
                        trackColor="#2e3439"
                      />
                      <span className="text-[11px] text-white/40">
                        {t(PATROL_WEIGHT_STOPS[weightStop(mod.sizes) - 1].label)}
                      </span>
                    </div>
                  )}
                  {mod && wantsVehicles && (
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
                  {mod && isQrf && origins.length > 0 && (
                    <div className="ml-1 pl-4 border-l border-[#2e3439] flex flex-col gap-1">
                      {origins.map((_o, oi) => {
                        const selOrigin =
                          selectedOrigin?.zoneId === zn.id &&
                          selectedOrigin.moduleType === def.type &&
                          selectedOrigin.index === oi;
                        return (
                          <div
                            key={oi}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectOrigin(zn.id, def.type, oi);
                            }}
                            className={`flex items-center gap-2 h-[24px] px-1 -mx-1 rounded-[4px] cursor-pointer transition-colors ${
                              selOrigin ? "bg-[rgba(244,219,80,0.12)]" : "hover:bg-[#2e3439]"
                            }`}
                          >
                            <span
                              className={`flex-1 min-w-0 text-[12px] ${
                                selOrigin ? "text-[#f4db50]" : "text-white/80"
                              }`}
                            >
                              {t("Origin")} {oi + 1}
                            </span>
                            <button
                              type="button"
                              aria-label={t("Delete origin")}
                              onClick={(e) => {
                                e.stopPropagation();
                                onOriginRemoved(zn.id, def.type, oi);
                                updateZone(zn.id, {
                                  modules: zn.modules.map((mm) =>
                                    mm.type === def.type
                                      ? { ...mm, origins: origins.filter((_, k) => k !== oi) }
                                      : mm
                                  ),
                                });
                              }}
                              className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src="/icons/zones/trash.svg" alt="" style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {mod && isQrf && origins.length < (def.maxOrigins ?? 3) && (
                    <GhostButton
                      active={armed}
                      onClick={() => onArmOrigin(zn.id, def.type)}
                      className="mt-1"
                    >
                      {!armed && <PlusIcon />}
                      {armed ? t("Click the map… (cancel)") : t("Add Reinforcement Origin")}
                    </GhostButton>
                  )}
                </div>
              );
            })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
