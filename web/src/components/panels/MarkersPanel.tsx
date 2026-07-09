"use client";

import { useState, type ReactNode } from "react";
import type { Mission, MissionMarker } from "@/lib/mission";
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
import { Field, GhostButton, Slider, TextInput } from "../ui";

/** Template for new markers — a MissionMarker minus id/position. */
export type MarkerDraft = Omit<MissionMarker, "id" | "x" | "z">;

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
  draft,
  setDraft,
  selectedMarkerId,
  updateMarker,
  removeMarker,
  onDragStart,
}: {
  mission: Mission;
  draft: MarkerDraft;
  setDraft: (patch: Partial<MarkerDraft>) => void;
  selectedMarkerId: string | null;
  updateMarker: (id: string, patch: Partial<MissionMarker>) => void;
  removeMarker: (id: string) => void;
  /** Starts the drag-a-marker-onto-the-map interaction (handled by the page) */
  onDragStart: (e: React.PointerEvent) => void;
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

  return (
    <>
      {selected && (
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-white/60">{t("Editing marker")}</span>
          <GhostButton small destructive onClick={() => removeMarker(selected.id)}>
            {t("Delete")}
          </GhostButton>
        </div>
      )}

      <div className="bg-[#14181a] rounded-[8px] h-[40px] p-1 flex items-center w-full">
        {(["military", "custom"] as const).map((kind) => {
          const activeTab = active.kind === kind;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => apply({ kind })}
              className={`flex-1 h-full rounded-[6px] flex items-center justify-center text-[12px] leading-[20px] font-medium transition-colors ${
                activeTab ? "bg-[#f4db50] text-[#202427]" : "text-white/60 hover:text-white"
              }`}
            >
              {kind === "military" ? t("Military") : t("Vanilla")}
            </button>
          );
        })}
      </div>

      {active.kind === "military" ? (
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
      ) : (
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

      <Field label={t("Text")}>
        <TextInput
          value={active.text}
          maxLength={32}
          placeholder={t("Empty")}
          onChange={(e) => apply({ text: e.target.value })}
        />
      </Field>

      {active.kind === "custom" && (
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

      {!selected && (
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
