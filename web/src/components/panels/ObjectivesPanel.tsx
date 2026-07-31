"use client";

// Objectives tab: expandable card per placed objective (ZonesPanel skeleton).
// Unique add flow (per the feature doc): "Add objective" opens an in-panel
// type picker — icon + name + one-line description per type — and clicking a
// type arms map placement for it (standard placement banner, Esc cancels).
import { useEffect, useRef, useState } from "react";
import { OBJECTIVE_TYPES } from "mission-gen";
import { objectiveRadius, type Mission, type MissionObjective, type ObjectiveType } from "@/lib/mission";
import { OBJECTIVE_COLOR, OBJECTIVE_GLYPHS } from "@/lib/overlayHtml";
import { useT } from "@/lib/i18n";
import { Field, GhostButton, PlusIcon, SectionLabel, Slider, TextArea, TextInput } from "@/components/ui";

const TYPE_DESCRIPTIONS: Record<ObjectiveType, string> = {
  hvt: "Spawns an enemy officer at the point. Completes when he is killed.",
  clear: "Completes when players hold the area and no enemy troops remain inside.",
  reach: "Completes when a player reaches the point.",
};

function TypeGlyph({ type, size = 16 }: { type: ObjectiveType; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ color: "#fff" }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: OBJECTIVE_GLYPHS[type] }}
    />
  );
}

export default function ObjectivesPanel({
  mission,
  placing,
  pendingType,
  onArmObjective,
  selectedObjectiveId,
  revealSeq,
  onSelectObjective,
  updateObjective,
  removeObjective,
}: {
  mission: Mission;
  placing: boolean;
  pendingType: ObjectiveType | null;
  onArmObjective: (type: ObjectiveType | null) => void;
  selectedObjectiveId: string | null;
  revealSeq: number;
  onSelectObjective: (id: string) => void;
  updateObjective: (id: string, patch: Partial<MissionObjective>) => void;
  removeObjective: (id: string) => void;
}) {
  const t = useT();
  const [pickerOpen, setPickerOpen] = useState(false);

  // When an objective is selected on the map, reveal its card in the panel
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    if (!selectedObjectiveId) return;
    cardRefs.current.get(selectedObjectiveId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedObjectiveId, revealSeq]);

  const typeDef = (type: ObjectiveType) => OBJECTIVE_TYPES.find((d) => d.type === type);

  return (
    <>
      <GhostButton
        active={placing || pickerOpen}
        onClick={() => {
          if (placing) onArmObjective(null);
          else setPickerOpen((v) => !v);
        }}
      >
        {!placing && !pickerOpen && <PlusIcon />}
        {placing
          ? `${t("Click the map… (cancel)")}${pendingType ? ` — ${t(typeDef(pendingType)?.label ?? "")}` : ""}`
          : pickerOpen
            ? t("Pick a type… (cancel)")
            : t("Add objective")}
      </GhostButton>

      {pickerOpen && !placing && (
        <div className="flex flex-col gap-2 animate-[mbFadeSlide_0.25s_ease]">
          {OBJECTIVE_TYPES.map((d) => (
            <button
              key={d.type}
              type="button"
              onClick={() => {
                setPickerOpen(false);
                onArmObjective(d.type);
              }}
              className="bg-[#14181a] rounded-[8px] p-3 flex items-start gap-3 text-left border border-transparent hover:border-[#f4db50] transition-colors"
            >
              <span
                className="size-[28px] shrink-0 rounded-full flex items-center justify-center border-2 border-white/80"
                style={{ background: OBJECTIVE_COLOR }}
              >
                <TypeGlyph type={d.type} size={15} />
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                <span className="text-[13px] font-medium text-white">{t(d.label)}</span>
                <span className="text-[11px] leading-4 text-white/40">{t(TYPE_DESCRIPTIONS[d.type])}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {mission.objectives.length === 0 && !pickerOpen && (
        <div className="border border-dashed border-[#2e3439] rounded-[8px] px-4 py-6 flex flex-col items-center gap-[10px] text-center">
          <svg width="36" height="36" viewBox="0 0 16 16" style={{ color: OBJECTIVE_COLOR }} aria-hidden
            dangerouslySetInnerHTML={{ __html: OBJECTIVE_GLYPHS.hvt }}
          />
          <span className="text-[13px] font-medium text-white">{t("No objectives yet")}</span>
          <span className="text-[11px] leading-4 text-white/40 max-w-[260px]">
            {t(
              "Objectives give players real in-game tasks — eliminate an HVT, clear an area, reach a location — with instant completion feedback."
            )}
          </span>
        </div>
      )}

      {mission.objectives.map((o, i) => {
        const selected = o.id === selectedObjectiveId;
        const radiusDef = typeDef(o.type)?.radius;
        return (
          <div
            key={o.id}
            ref={(el) => {
              if (el) cardRefs.current.set(o.id, el);
              else cardRefs.current.delete(o.id);
            }}
            onClick={() => onSelectObjective(o.id)}
            className={`bg-[#14181a] rounded-[8px] p-4 flex flex-col gap-3 border cursor-pointer transition-[border-color,transform] animate-[mbFadeSlide_0.3s_ease] ${
              selected ? "border-[#f4db50]" : "border-transparent hover:border-[#2e3439] hover:-translate-y-px"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="size-[20px] shrink-0 rounded-full flex items-center justify-center"
                style={{ background: OBJECTIVE_COLOR }}
              >
                <TypeGlyph type={o.type} size={12} />
              </span>
              <span className="text-[14px] font-bold text-white truncate">
                {i + 1}. {t(typeDef(o.type)?.label ?? o.type)}
              </span>
              {!selected && radiusDef && (
                <span className="text-[12px] text-white/60 shrink-0">{o.radius} m</span>
              )}
              <span className="flex-1" />
              <button
                type="button"
                aria-label={t("Delete objective")}
                onClick={(e) => {
                  e.stopPropagation();
                  removeObjective(o.id);
                }}
                className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {!selected && (
              <span className="text-[12px] text-white/60 truncate">{o.taskTitle}</span>
            )}

            {selected && (
              /* Controls must not bubble to the card's onClick (map re-focus) */
              <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                {radiusDef && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-white">{t("Radius")}</span>
                      <span className="text-[12px] text-white/60">{o.radius} m</span>
                    </div>
                    <Slider
                      min={radiusDef.min}
                      max={radiusDef.max}
                      step={5}
                      value={o.radius ?? radiusDef.default}
                      onChange={(v) => updateObjective(o.id, { radius: objectiveRadius(o.type, v) })}
                      trackColor="#2e3439"
                    />
                  </>
                )}
                <Field label={t("Task title")}>
                  <TextInput
                    value={o.taskTitle}
                    onChange={(e) => updateObjective(o.id, { taskTitle: e.target.value })}
                  />
                </Field>
                <Field label={t("Task description")}>
                  <TextArea
                    value={o.taskDesc}
                    onChange={(e) => updateObjective(o.id, { taskDesc: e.target.value })}
                  />
                </Field>
                <SectionLabel>{t("Completion hint")}</SectionLabel>
                <Field label={t("Hint title")}>
                  <TextInput
                    value={o.hintTitle}
                    onChange={(e) => updateObjective(o.id, { hintTitle: e.target.value })}
                  />
                </Field>
                <Field label={t("Hint text")}>
                  <TextArea
                    value={o.hintBody}
                    onChange={(e) => updateObjective(o.id, { hintBody: e.target.value })}
                  />
                </Field>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
