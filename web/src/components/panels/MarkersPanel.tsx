"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Mission, MissionMarker, MissionSector } from "@/lib/mission";
import {
  findColor,
  findIcon,
  MARKER_CATEGORIES,
  MARKER_COLORS,
  MARKER_FACTIONS,
  MARKER_ICONS,
  MARKER_LABEL_OUTLINE,
  maskIconStyle,
  MILITARY_TYPES,
  militaryIconUrl,
} from "@/lib/markers";
import { useT } from "@/lib/i18n";
import { Field, GhostButton, PlusIcon, Slider, TextInput } from "../ui";

/** Template for new markers — a MissionMarker minus id/position. */
export type MarkerDraft = Omit<MissionMarker, "id" | "x" | "z">;

/** Panel sub-tab: the two marker kinds plus the Sectors (TS_MapOverlay) tab. */
export type MarkersTab = "military" | "custom" | "sectors";

/** Editor swatch color per sector kind (matches MissionMap's rendering). */
const SECTOR_COLORS: Record<MissionSector["kind"], string> = {
  ao: "#000000",
  objective: "#9f2828",
};

/** Sector dimension input (m): free typing, clamp + commit on blur/Enter. */
function SizeInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <input
      type="number"
      min={10}
      max={10000}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        const v = Math.min(10000, Math.max(10, Math.round(+text) || 10));
        setText(String(v));
        onCommit(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className="w-full h-[44px] bg-[#14181a] border border-[#2e3439] rounded-[4px] px-3 text-[14px] text-white focus:border-[#f4db50] focus:outline-none"
    />
  );
}

function ChevronDown({ open }: { open?: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 9.33 5.33"
      className={`shrink-0 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M0.67 0.67 L4.67 4.67 L8.67 0.67" stroke="#fafafa" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

/** Ops-planner style select: bezel button with icon preview + label + chevron,
 * the native <select> stretched invisibly over it. */
function IconSelect({
  value,
  options,
  preview,
  onChange,
}: {
  value: string;
  options: { key: string; label: string }[];
  preview: ReactNode;
  onChange: (key: string) => void;
}) {
  const current = options.find((o) => o.key === value);
  return (
    <div className="relative h-[44px] bg-[#14181a] border border-[#2e3439] hover:border-[#3d4550] rounded-[4px] flex items-center gap-2 px-3 transition-colors">
      {preview}
      <span className="flex-1 text-left text-[14px] text-white truncate">{current?.label ?? value}</span>
      <ChevronDown />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function MarkersPanel({
  mission,
  tab,
  setTab,
  draft,
  setDraft,
  selectedMarkerId,
  updateMarker,
  removeMarker,
  onDragStart,
  selectedSectorId,
  sectorDraw,
  onArmSectorDraw,
  updateSector,
  removeSector,
  onDeselectMarker,
}: {
  mission: Mission;
  tab: MarkersTab;
  setTab: (tab: MarkersTab) => void;
  draft: MarkerDraft;
  setDraft: (patch: Partial<MarkerDraft>) => void;
  selectedMarkerId: string | null;
  updateMarker: (id: string, patch: Partial<MissionMarker>) => void;
  removeMarker: (id: string) => void;
  /** Starts the drag-a-marker-onto-the-map interaction (handled by the page) */
  onDragStart: (e: React.PointerEvent) => void;
  selectedSectorId: string | null;
  sectorDraw: "ao" | "objective" | null;
  onArmSectorDraw: (kind: "ao" | "objective") => void;
  updateSector: (id: string, patch: Partial<MissionSector>) => void;
  removeSector: (id: string) => void;
  onDeselectMarker: () => void;
}) {
  const t = useT();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [wellHover, setWellHover] = useState(false);

  const selected = mission.markers.find((mk) => mk.id === selectedMarkerId) ?? null;
  // Panel edits the selected marker live, or the new-marker template.
  const active: MarkerDraft = selected ?? draft;
  const apply = (patch: Partial<MarkerDraft>) => {
    if (selected) updateMarker(selected.id, patch);
    else setDraft(patch);
  };

  const icon = findIcon(active.quad);
  const color = findColor(active.color);

  const selectedSector = mission.sectors.find((s) => s.id === selectedSectorId) ?? null;
  const hasAo = mission.sectors.some((s) => s.kind === "ao");
  // "Objective 1..n" numbering follows placement order among objectives only
  const objectiveNo = (id: string) =>
    mission.sectors.filter((s) => s.kind === "objective").findIndex((s) => s.id === id) + 1;
  const sectorLabel = (s: MissionSector) =>
    s.kind === "ao" ? "AO" : `${t("Objective")} ${objectiveNo(s.id)}`;

  const TAB_LABELS: Record<MarkersTab, string> = {
    military: t("Military"),
    custom: t("Vanilla"),
    sectors: t("Sectors"),
  };

  return (
    <>
      {tab !== "sectors" && selected && (
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-white/60">{t("Editing marker")}</span>
          <GhostButton small destructive onClick={() => removeMarker(selected.id)}>
            {t("Delete")}
          </GhostButton>
        </div>
      )}
      {tab === "sectors" && selectedSector && (
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] text-white/60">
            {t("Editing sector")}
            <span
              className="inline-block size-[10px] rounded-[2px] border border-[rgba(255,255,255,0.4)]"
              style={{ background: SECTOR_COLORS[selectedSector.kind] }}
            />
            <span className="text-white">{sectorLabel(selectedSector)}</span>
          </span>
          <GhostButton small destructive onClick={() => removeSector(selectedSector.id)}>
            {t("Delete")}
          </GhostButton>
        </div>
      )}

      {!(tab === "sectors" && selectedSector) && (
      <div className="bg-[#14181a] rounded-[8px] h-[40px] p-1 flex items-center w-full">
        {(["military", "custom", "sectors"] as const).map((kind) => {
          const activeTab = tab === kind;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => {
                setTab(kind);
                if (kind === "sectors") onDeselectMarker();
                else apply({ kind });
              }}
              className={`flex-1 h-full rounded-[6px] flex items-center justify-center text-[12px] leading-[20px] font-medium transition-colors ${
                activeTab ? "bg-[#f4db50] text-[#202427]" : "text-white/60 hover:text-white"
              }`}
            >
              {TAB_LABELS[kind]}
            </button>
          );
        })}
      </div>
      )}

      {tab === "military" && (
        <>
          <Field label={t("Faction")}>
            <IconSelect
              value={active.faction}
              options={MARKER_FACTIONS.map((o) => ({ key: o.key, label: t(o.label) }))}
              preview={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={militaryIconUrl(active.faction, active.type)}
                  alt=""
                  className="shrink-0"
                  style={{ width: 28, height: 28 }}
                />
              }
              onChange={(faction) => apply({ faction })}
            />
          </Field>
          <Field label={t("Type")}>
            <IconSelect
              value={active.type}
              options={MILITARY_TYPES.map((o) => ({ key: o.key, label: t(o.label) }))}
              preview={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={militaryIconUrl(active.faction, active.type)}
                  alt=""
                  className="shrink-0"
                  style={{ width: 28, height: 28 }}
                />
              }
              onChange={(type) => apply({ type })}
            />
          </Field>
        </>
      )}
      {tab === "custom" && (
        <>
          <Field label={t("Marker")}>
            <button
              type="button"
              onClick={() => setPickerOpen(!pickerOpen)}
              className="h-[44px] bg-[#14181a] border border-[#2e3439] hover:border-[#3d4550] rounded-[4px] flex items-center gap-2 px-3 w-full transition-colors"
            >
              <div className="shrink-0" style={maskIconStyle(icon, 28, "#fafafa")} />
              <span className="flex-1 text-left text-[14px] text-white truncate">{icon.label}</span>
              <ChevronDown open={pickerOpen} />
            </button>
          </Field>
          {pickerOpen && (
            <div className="bg-[#14181a] border border-[#2e3439] rounded-[4px] p-2 flex flex-col gap-2 max-h-[280px] overflow-y-auto ts-thin-scrollbar">
              {MARKER_CATEGORIES.map((cat) => (
                <div key={cat.key} className="flex flex-col gap-1">
                  <div className="text-[11px] text-white/40">{t(cat.label)}</div>
                  <div className="grid grid-cols-6 gap-1">
                    {MARKER_ICONS.filter((i) => i.category === cat.key).map((i) => (
                      <button
                        key={i.quad}
                        type="button"
                        title={i.label}
                        onClick={() => {
                          apply({ quad: i.quad });
                          setPickerOpen(false);
                        }}
                        className={`flex items-center justify-center rounded-[4px] p-1 transition-colors ${
                          i.quad === active.quad ? "bg-[rgba(244,219,80,0.24)]" : "hover:bg-[#2e3439]"
                        }`}
                      >
                        <div style={maskIconStyle(i, 28, "#fafafa")} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Field label={t("Color")}>
            <div className="grid grid-cols-7 gap-2">
              {MARKER_COLORS.map((c) => {
                const sel = c.name === active.color;
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.label}
                    onClick={() => apply({ color: c.name })}
                    className="h-[32px] rounded-[4px] border border-[rgba(255,255,255,0.24)] flex items-center justify-center transition-transform hover:scale-[1.05]"
                    style={{ background: c.hex }}
                  >
                    {sel && (
                      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                        <path
                          d="M3 8l3.5 3.5L13 5"
                          stroke={c.name === "WHITE" || c.name === "REFORGER_ORANGE" ? "#202427" : "#fff"}
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>
        </>
      )}

      {tab !== "sectors" && (
        <Field label={t("Text")}>
          <TextInput
            value={active.text}
            maxLength={32}
            placeholder={t("Empty")}
            onChange={(e) => apply({ text: e.target.value })}
          />
        </Field>
      )}

      {tab === "custom" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white">{t("Rotation")}</span>
            <span className="text-[12px] text-white/60">{active.rotation}°</span>
          </div>
          <Slider
            min={0}
            max={359}
            step={1}
            value={active.rotation}
            onChange={(v) => apply({ rotation: ((Math.round(v) % 360) + 360) % 360 })}
          />
        </div>
      )}

      {tab === "sectors" && selectedSector && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white">{t("Rotation")}</span>
              <span className="text-[12px] text-white/60">{selectedSector.rotation}°</span>
            </div>
            <Slider
              min={0}
              max={359}
              step={1}
              value={selectedSector.rotation}
              onChange={(v) =>
                updateSector(selectedSector.id, { rotation: ((Math.round(v) % 360) + 360) % 360 })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label={`${t("Length")} (m)`}>
              <SizeInput
                value={selectedSector.length}
                onCommit={(v) => updateSector(selectedSector.id, { length: v })}
              />
            </Field>
            <Field label={`${t("Width")} (m)`}>
              <SizeInput
                value={selectedSector.width}
                onCommit={(v) => updateSector(selectedSector.id, { width: v })}
              />
            </Field>
          </div>
        </>
      )}

      {tab === "sectors" && !selectedSector && (
        <>
          <GhostButton
            active={sectorDraw === "ao"}
            disabled={hasAo}
            onClick={() => onArmSectorDraw("ao")}
          >
            {sectorDraw !== "ao" && !hasAo && <PlusIcon />}
            {t("Add AO Sector")}
          </GhostButton>
          <GhostButton active={sectorDraw === "objective"} onClick={() => onArmSectorDraw("objective")}>
            {sectorDraw !== "objective" && <PlusIcon />}
            {t("Add Objective Sector")}
          </GhostButton>

          {mission.sectors.length === 0 && (
            <div className="border border-dashed border-[#2e3439] rounded-[8px] px-4 py-6 flex flex-col items-center gap-[10px] text-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9f2828" strokeWidth="1.5" aria-hidden>
                <rect x="2" y="5" width="20" height="14" rx="1" />
                <rect x="8" y="9" width="8" height="6" rx="0.5" />
              </svg>
              <span className="text-[13px] font-medium text-white">{t("No sectors yet")}</span>
              <span className="text-[11px] leading-4 text-white/40 max-w-[260px]">
                {t(
                  "Sectors are map-only rectangles: the AO sector outlines the playable area, objective sectors highlight target areas."
                )}
              </span>
            </div>
          )}
        </>
      )}

      {tab !== "sectors" && !selected && (
        <div
          onPointerDown={onDragStart}
          onMouseEnter={() => setWellHover(true)}
          onMouseLeave={() => setWellHover(false)}
          className="rounded-[8px] p-5 flex flex-col items-center gap-2 text-center cursor-grab touch-none transition-colors"
          style={{
            border: `1px dashed ${wellHover ? "#f4db50" : "rgba(244,219,80,0.55)"}`,
            background: wellHover ? "linear-gradient(rgba(244,219,80,0.06),rgba(244,219,80,0.02))" : undefined,
          }}
        >
          {/* Live preview of the draft: icon + label, exactly as it lands on the map */}
          <div className="pointer-events-none flex items-center gap-[6px] min-h-[40px]">
            {active.kind === "military" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={militaryIconUrl(active.faction, active.type)}
                alt=""
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <div style={maskIconStyle(icon, 40, color.hex, active.rotation)} />
            )}
            {active.text.trim() && (
              <span
                className="text-[12px] leading-[1.2] font-semibold text-black"
                style={{ textShadow: MARKER_LABEL_OUTLINE }}
              >
                {active.text.trim()}
              </span>
            )}
          </div>
          <span className="text-[13px] font-semibold text-[#f4db50] pointer-events-none">
            {t("Drag me onto the map!")}
          </span>
          <span className="text-[11px] leading-[15px] text-white/40 pointer-events-none">
            {t("Drop anywhere on the map · click a marker to edit")}
          </span>
        </div>
      )}
    </>
  );
}
