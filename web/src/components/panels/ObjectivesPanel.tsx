"use client";

// Objectives tab: expandable card per placed objective (ZonesPanel skeleton).
// Unique add flow (per the feature doc): "Add objective" opens an in-panel
// type picker — icon + name + one-line description per type — and clicking a
// type arms map placement for it (standard placement banner, Esc cancels).
import { useEffect, useMemo, useRef, useState } from "react";
import { OBJECTIVE_TYPES } from "mission-gen";
import { objectiveRadius, type Mission, type MissionObjective, type ObjectiveType } from "@/lib/mission";
import { DESTROY_CATEGORIES, destroyEntry, destroyPool, type DestroyCategory, type DestroyEntry } from "@/lib/destroyObjects";
import { OBJECTIVE_COLOR, OBJECTIVE_GLYPHS } from "@/lib/overlayHtml";
import { useT } from "@/lib/i18n";
import { Field, GhostButton, PlusIcon, SectionLabel, Slider, TextArea, TextInput, XButton } from "@/components/ui";

const TYPE_DESCRIPTIONS: Record<ObjectiveType, string> = {
  hvt: "Spawns an enemy officer at the point. Completes when he is killed.",
  clear: "Completes when players hold the area and no enemy troops remain inside.",
  reach: "Completes when a player reaches the point.",
  destroy: "Spawns a destructible object or vehicle at the point. Completes when it is destroyed.",
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
  // Which objective's target-object modal is open (destroy type only)
  const [objectModalId, setObjectModalId] = useState<string | null>(null);
  const pool = useMemo(() => destroyPool(mission), [mission.playableFaction, mission.enemyFaction]); // eslint-disable-line react-hooks/exhaustive-deps

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
                {o.type === "destroy" && (() => {
                  const entry = destroyEntry(mission, o.objectRef);
                  return (
                    <div className="flex flex-col gap-2">
                      <span className="text-[12px] text-white">{t("Target object")}</span>
                      <button
                        type="button"
                        onClick={() => setObjectModalId(o.id)}
                        className="bg-[#14181a] rounded-[8px] p-2 flex items-center gap-3 border border-[#2e3439] hover:border-[#f4db50] transition-colors text-left"
                      >
                        <ObjectThumb entry={entry} size={64} />
                        <span className="flex-1 min-w-0 text-[12px] text-white truncate">
                          {entry ? t(entry.label) : t("Select object…")}
                        </span>
                        <span className="text-[11px] text-[#f4db50] shrink-0">{t("Change")}</span>
                      </button>
                    </div>
                  );
                })()}
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

      {objectModalId && (() => {
        const target = mission.objectives.find((ob) => ob.id === objectModalId);
        if (!target) return null;
        return (
          <ObjectPickerModal
            pool={pool}
            current={target.objectRef}
            onPick={(ref) => {
              updateObjective(objectModalId, { objectRef: ref });
              setObjectModalId(null);
            }}
            onClose={() => setObjectModalId(null)}
          />
        );
      })()}
    </>
  );
}

/** Thumbnail tile with glyph placeholder underneath (covers factions whose
 * mods ship no EditorPreviews — the broken <img> hides itself). */
function ObjectThumb({ entry, size }: { entry: DestroyEntry | null; size?: number }) {
  // Fixed pixel size (card row) or fluid 4:3 (modal grid tiles)
  const style = size ? { width: size, height: Math.round((size * 3) / 4) } : undefined;
  const cls = size ? "" : "w-full aspect-[4/3]";
  return (
    <span
      className={`relative shrink-0 rounded-[4px] overflow-hidden bg-[#0d0f11] flex items-center justify-center ${cls}`}
      style={style}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 16 16"
        style={{ color: "#3a4147", position: "absolute" }}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: OBJECTIVE_GLYPHS.destroy }}
      />
      {entry && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/icons/prefabs/${entry.thumb}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

/** Full-screen modal: scrollable thumbnail grid + category filter chips. */
function ObjectPickerModal({
  pool,
  current,
  onPick,
  onClose,
}: {
  pool: DestroyEntry[];
  current: string | undefined;
  onPick: (ref: string) => void;
  onClose: () => void;
}) {
  const t = useT();
  const [cat, setCat] = useState<DestroyCategory | "all">("all");
  // Esc closes the modal without disturbing the page-level handler's other
  // duties (stopPropagation keeps it from also cancelling placement modes)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  const cats = DESTROY_CATEGORIES.filter((c) => pool.some((e) => e.cat === c.key));
  const shown = cat === "all" ? pool : pool.filter((e) => e.cat === cat);

  return (
    <div
      /* items-start: the grid height changes with the active filter — a
         centered box would jump vertically on every chip click */
      className="fixed inset-0 z-[3000] bg-black/60 flex items-start justify-center p-4 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="bg-[#202427] rounded-[12px] p-4 flex flex-col gap-3 w-full max-w-[720px] max-h-[80dvh] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] animate-[mbFadeSlide_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-slab text-[16px] font-medium text-white flex-1">{t("Select target object")}</h2>
          <XButton ariaLabel={t("Dismiss")} onClick={onClose} />
        </div>

        <div className="flex flex-wrap gap-1">
          {[{ key: "all" as const, label: "All" }, ...cats].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCat(c.key as DestroyCategory | "all")}
              className={`px-3 py-[6px] rounded-[6px] text-[12px] transition-colors ${
                cat === c.key
                  ? "bg-[#f4db50] text-[#202427] font-medium"
                  : "bg-[#14181a] text-white/70 hover:text-white"
              }`}
            >
              {t(c.label)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto ts-thin-scrollbar pr-1">
          {shown.map((e) => {
            const isCurrent = e.ref === current;
            return (
              <button
                key={e.ref}
                type="button"
                onClick={() => onPick(e.ref)}
                className={`bg-[#14181a] rounded-[8px] p-2 flex flex-col gap-[6px] border text-left transition-colors ${
                  isCurrent ? "border-[#f4db50]" : "border-transparent hover:border-[#2e3439]"
                }`}
              >
                <ObjectThumb entry={e} />
                <span className="text-[11px] leading-[14px] text-white/80 line-clamp-2">{t(e.label)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
