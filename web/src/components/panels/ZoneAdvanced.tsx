"use client";

import { useEffect, useRef } from "react";
// Advanced AI placement (2026-09-21): the zone card's Advanced view — icon
// sub-tabs (Foot patrols / Mounted patrols / Defense groups / Static soldiers),
// an "+ Add …" button that arms map placement, and one card per element.
// Flow (replaces the Figma Cancel/Complete two-phase): the first map click
// creates the element card with defaults; patrols stay armed to append
// waypoints (live loop on the map) until 6, a re-toggle or Esc.
import type { Mission, Zone, ZoneElement, ZoneElementKind } from "@/lib/mission";
import {
  DEFENSE_RADIUS,
  ZONE_ELEMENT_CAPS,
  ZONE_ELEMENT_KINDS,
  ZONE_ELEMENT_MAX_WAYPOINTS,
  elementOutsideZone,
  patrolNeedsWaypoint,
} from "@/lib/mission";
import { ELEMENT_ADD_LABELS, ELEMENT_DESCRIPTIONS, ELEMENT_KIND_ICONS, ELEMENT_KIND_LABELS, ELEMENT_LABELS } from "@/lib/zoneModules";
import { enemyGroups, enemyRoles, groupBy, rosterLabel, vehicleLabel, zoneVehicleCandidates } from "@/lib/roster";
import { useLang, useT } from "@/lib/i18n";
import { GhostButton, Hint, MaskIcon, PlusIcon, Segmented, SelectInput, Slider } from "../ui";

export type ElementTarget = { zoneId: string; kind: ZoneElementKind; elementId: string | null };
export type SelectedElement = { zoneId: string; elementId: string; wp: number | null };

const TRASH = "/icons/zones/trash.svg";

export default function ZoneAdvanced({
  mission,
  zone,
  tab,
  setTab,
  elementTarget,
  onArmElement,
  selectedElement,
  onSelectElement,
  updateZoneElement,
  removeZoneElement,
  removeZoneWaypoint,
}: {
  mission: Mission;
  zone: Zone;
  tab: ZoneElementKind;
  setTab: (k: ZoneElementKind) => void;
  /** Armed placement for THIS zone (null when armed elsewhere / not armed) */
  elementTarget: ElementTarget | null;
  onArmElement: (zoneId: string, kind: ZoneElementKind, elementId: string | null) => void;
  /** Selection for THIS zone */
  selectedElement: SelectedElement | null;
  onSelectElement: (zoneId: string, elementId: string, wp: number | null) => void;
  updateZoneElement: (zoneId: string, elementId: string, patch: Partial<ZoneElement>) => void;
  removeZoneElement: (zoneId: string, elementId: string) => void;
  removeZoneWaypoint: (zoneId: string, elementId: string, wp: number) => void;
}) {
  const t = useT();
  const lang = useLang();
  const ef = mission.enemyFaction;
  // Reveal the selected element card (a freshly placed one is appended at the
  // bottom of a possibly long list — the zone-card reveal alone stops short).
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    if (!selectedElement) return;
    cardRefs.current.get(selectedElement.elementId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedElement]);
  const elements = (zone.elements ?? []).filter((el) => el.kind === tab);
  const armedAdd = elementTarget?.kind === tab && elementTarget.elementId === null;
  const atCap = elements.length >= ZONE_ELEMENT_CAPS[tab];

  const groupOptions = groupBy(enemyGroups(ef), (g) => g.setLabel);
  const roleOptions = groupBy(enemyRoles(ef), (r) => r.subfaction);
  const vehicleOptions = zoneVehicleCandidates(ef, mission.mods);

  const groupSelect = (el: ZoneElement & { group: string }, label: string) => (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-white/40">{t(label)}</span>
      <SelectInput value={el.group} onChange={(e) => updateZoneElement(zone.id, el.id, { group: e.target.value } as Partial<ZoneElement>)}>
        {groupOptions.map((grp) =>
          groupOptions.length > 1 ? (
            <optgroup key={grp.key} label={grp.key}>
              {grp.items.map((g) => (
                <option key={g.id} value={g.id}>
                  {rosterLabel(g, lang)} ({g.size})
                </option>
              ))}
            </optgroup>
          ) : (
            grp.items.map((g) => (
              <option key={g.id} value={g.id}>
                {rosterLabel(g, lang)} ({g.size})
              </option>
            ))
          )
        )}
      </SelectInput>
    </label>
  );

  const waypointRows = (el: ZoneElement & { waypoints: { x: number; z: number }[] }) => {
    const armedWp = elementTarget?.elementId === el.id;
    const needs = patrolNeedsWaypoint(el);
    return (
      <div className="ml-1 pl-4 border-l border-[#2e3439] flex flex-col gap-1">
        {el.waypoints.map((_, wi) => {
          const sel = selectedElement?.elementId === el.id && selectedElement.wp === wi;
          return (
            <div
              key={wi}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement(zone.id, el.id, wi);
              }}
              className={`flex items-center gap-2 rounded-[4px] px-1 -mx-1 cursor-pointer transition-colors ${
                sel ? "bg-[rgba(244,219,80,0.12)] text-[#f4db50]" : "text-white/80 hover:bg-[#2e3439]"
              }`}
            >
              <span className="text-[12px] flex-1">
                {t("Waypoint")} {wi + 1}
              </span>
              <button
                type="button"
                aria-label={t("Delete waypoint")}
                onClick={(e) => {
                  e.stopPropagation();
                  removeZoneWaypoint(zone.id, el.id, wi);
                }}
                className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
              >
                <img src={TRASH} alt="" style={{ width: 16, height: 16 }} />
              </button>
            </div>
          );
        })}
        {el.waypoints.length < ZONE_ELEMENT_MAX_WAYPOINTS ? (
          <GhostButton active={armedWp} onClick={() => onArmElement(zone.id, el.kind, el.id)} className="mt-1">
            {!armedWp && <PlusIcon />}
            {armedWp ? t("Click the map to add waypoints… (finish)") : t("Add waypoint")}
          </GhostButton>
        ) : (
          <span className="text-[11px] text-white/40">{t("Maximum number of waypoints reached")}</span>
        )}
        {needs && <span className="text-[11px] text-[#f87171]">{t("Needs at least one waypoint")}</span>}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Segmented
        tone="raised"
        value={tab}
        onChange={setTab}
        options={ZONE_ELEMENT_KINDS.map((k) => ({
          value: k,
          title: t(ELEMENT_KIND_LABELS[k]),
          label: <MaskIcon src={ELEMENT_KIND_ICONS[k]} size={18} />,
        }))}
      />
      <span className="text-[13px] font-bold text-white">{t(ELEMENT_KIND_LABELS[tab])}</span>
      <Hint>{t(ELEMENT_DESCRIPTIONS[tab])}</Hint>
      {!atCap && (
        <GhostButton active={armedAdd} onClick={() => onArmElement(zone.id, tab, null)}>
          {!armedAdd && <PlusIcon />}
          {armedAdd ? t("Click the map… (cancel)") : t(ELEMENT_ADD_LABELS[tab])}
        </GhostButton>
      )}

      {elements.map((el, k) => {
        const sel = selectedElement?.elementId === el.id;
        const outside = elementOutsideZone(zone, el);
        return (
          <div
            key={el.id}
            ref={(node) => {
              if (node) cardRefs.current.set(el.id, node);
              else cardRefs.current.delete(el.id);
            }}
            // scrollIntoView honours scroll-margin: overshoot 24 px so a revealed
            // card doesn't sit flush against the panel edge
            style={{ scrollMarginBottom: 24, scrollMarginTop: 24 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(zone.id, el.id, null);
            }}
            className={`bg-[#202427] rounded-[6px] p-3 flex flex-col gap-2 border cursor-pointer transition-colors ${
              sel && selectedElement?.wp === null ? "border-[#f4db50]" : "border-transparent hover:border-[#2e3439]"
            }`}
          >
            <div className="flex items-center gap-2">
              <img src={ELEMENT_KIND_ICONS[el.kind]} alt="" style={{ width: 16, height: 16 }} />
              <span className={`text-[12px] font-bold ${sel ? "text-[#f4db50]" : "text-white"}`}>
                {t(ELEMENT_LABELS[el.kind])} {k + 1}
              </span>
              <span className="flex-1" />
              <button
                type="button"
                aria-label={t("Delete element")}
                onClick={(e) => {
                  e.stopPropagation();
                  removeZoneElement(zone.id, el.id);
                }}
                className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
              >
                <img src={TRASH} alt="" style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {el.kind === "foot-patrol" && (
              <>
                {groupSelect(el, "Group")}
                {waypointRows(el)}
              </>
            )}

            {el.kind === "mounted-patrol" && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-white/40">{t("Vehicle")}</span>
                  <SelectInput value={el.vehicle} onChange={(e) => updateZoneElement(zone.id, el.id, { vehicle: e.target.value } as Partial<ZoneElement>)}>
                    {vehicleOptions.map((grp) => (
                      <optgroup key={grp.heading} label={t(grp.heading)}>
                        {grp.keys.map((vk) => (
                          <option key={vk} value={vk}>
                            {vehicleLabel(ef, vk)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </SelectInput>
                </label>
                {groupSelect(el, "Crew group")}
                {waypointRows(el)}
              </>
            )}

            {el.kind === "defense-group" && (
              <>
                {groupSelect(el, "Group")}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white">{t("Defense radius")}</span>
                  <span className="text-[12px] text-white/60">{el.radius} m</span>
                </div>
                <Slider
                  min={DEFENSE_RADIUS.min}
                  max={DEFENSE_RADIUS.max}
                  step={5}
                  value={el.radius}
                  onChange={(v) => updateZoneElement(zone.id, el.id, { radius: v } as Partial<ZoneElement>)}
                  trackColor="#2e3439"
                />
              </>
            )}

            {el.kind === "static" && (
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-white/40">{t("Role")}</span>
                <SelectInput value={el.role} onChange={(e) => updateZoneElement(zone.id, el.id, { role: e.target.value } as Partial<ZoneElement>)}>
                  {roleOptions.map((grp) =>
                    roleOptions.length > 1 ? (
                      <optgroup key={grp.key} label={grp.key}>
                        {grp.items.map((r) => (
                          <option key={r.id} value={r.id}>
                            {rosterLabel(r, lang)}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      grp.items.map((r) => (
                        <option key={r.id} value={r.id}>
                          {rosterLabel(r, lang)}
                        </option>
                      ))
                    )
                  )}
                </SelectInput>
              </label>
            )}

            {outside && (
              <span className="text-[11px] text-[#f4db50]/80">{t("Outside the zone circle — the despawn range is widened to cover it")}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
