"use client";

// Props tab: expandable card per placed prop (ObjectivesPanel skeleton).
// Pick-first flow (UX feedback 2026-08-04): "Add prop" opens the shared
// thumbnail-grid modal (category chips, default "All"); picking a prefab
// arms map placement for it. The card's picker row reuses the same modal to
// swap an existing prop's prefab in place.
import { useEffect, useRef, useState } from "react";
import { PROP_CATEGORIES } from "mission-gen";
import type { Mission, MissionProp } from "@/lib/mission";
import { propCanDefend, propEntry, propPool } from "@/lib/props";
import { propSlopeDelta } from "@/lib/export";
import { PROP_COLOR, PROP_GLYPH } from "@/lib/overlayHtml";
import { useT } from "@/lib/i18n";
import { CheckRow, GhostButton, Hint, PlusIcon, Slider } from "@/components/ui";
import { ObjectPickerModal, ObjectThumb } from "@/components/ObjectPicker";
import { PATROL_WEIGHT_STOPS, weightStop } from "@/components/panels/ZonesPanel";

export default function PropsPanel({
  mission,
  placing,
  pendingRef,
  onArmProp,
  selectedPropId,
  revealSeq,
  onSelectProp,
  updateProp,
  removeProp,
}: {
  mission: Mission;
  placing: boolean;
  /** Prefab an armed placement will create (shown in the button label) */
  pendingRef: string | null;
  /** Arm map placement for a picked prefab (null = cancel) */
  onArmProp: (ref: string | null) => void;
  selectedPropId: string | null;
  /** Bumped on every map badge-click — re-reveals the card even for a re-click */
  revealSeq: number;
  onSelectProp: (id: string) => void;
  updateProp: (id: string, patch: Partial<MissionProp>) => void;
  removeProp: (id: string) => void;
}) {
  const t = useT();
  // Which prop's prefab-picker modal is open ("add" = the new-prop flow)
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [addPickerOpen, setAddPickerOpen] = useState(false);
  const pool = propPool();

  // When a prop is selected on the map, reveal its card in the panel
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    if (!selectedPropId) return;
    cardRefs.current.get(selectedPropId)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPropId, revealSeq]);

  // Uneven-terrain check per prop (9-point sample over the rotated footprint,
  // same threshold as the spawn bundle). Props are few — recompute them all.
  const [slopes, setSlopes] = useState<Record<string, number>>({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, number> = {};
      for (const p of mission.props) next[p.id] = await propSlopeDelta(mission, p);
      if (!cancelled) setSlopes(next);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mission.props, mission.terrain]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <GhostButton
        active={placing || addPickerOpen}
        onClick={() => {
          if (placing) onArmProp(null);
          else setAddPickerOpen((v) => !v);
        }}
      >
        {!placing && !addPickerOpen && <PlusIcon />}
        {placing
          ? `${t("Click the map… (cancel)")}${(() => {
              const e = propEntry(pendingRef ?? undefined);
              return e ? ` — ${t(e.label)}` : "";
            })()}`
          : addPickerOpen
            ? t("Pick a prop… (cancel)")
            : t("Add prop")}
      </GhostButton>

      {mission.props.length === 0 && (
        <div className="border border-dashed border-[#2e3439] rounded-[8px] px-4 py-6 flex flex-col items-center gap-[10px] text-center">
          <svg width="36" height="36" viewBox="0 0 16 16" style={{ color: PROP_COLOR }} aria-hidden
            dangerouslySetInnerHTML={{ __html: PROP_GLYPH }}
          />
          <span className="text-[13px] font-medium text-white">{t("No props yet")}</span>
          <span className="text-[11px] leading-4 text-white/40 max-w-[260px]">
            {t(
              "Dress up the mission area with fortifications, obstacles, minefields, wrecks and camp compositions — and optionally garrison them with enemy troops."
            )}
          </span>
        </div>
      )}

      {mission.props.map((p, i) => {
        const selected = p.id === selectedPropId;
        const entry = propEntry(p.ref);
        const canDefend = propCanDefend(p.ref);
        const slope = slopes[p.id] ?? 0;
        return (
          <div
            key={p.id}
            ref={(el) => {
              if (el) cardRefs.current.set(p.id, el);
              else cardRefs.current.delete(p.id);
            }}
            onClick={() => onSelectProp(p.id)}
            className={`bg-[#14181a] rounded-[8px] p-4 flex flex-col gap-3 border cursor-pointer transition-[border-color,transform] animate-[mbFadeSlide_0.3s_ease] ${
              selected ? "border-[#f4db50]" : "border-transparent hover:border-[#2e3439] hover:-translate-y-px"
            }`}
          >
            <div className="flex items-center gap-2">
              <ObjectThumb entry={entry} glyph={PROP_GLYPH} size={40} />
              <span className="text-[14px] font-bold text-white truncate flex-1 min-w-0">
                {i + 1}. {entry ? t(entry.label) : t("Prop")}
              </span>
              {!selected && slope > 3 && (
                <span className="text-[12px] text-[#f4db50] shrink-0" title={t("Uneven ground")}>
                  ⚠
                </span>
              )}
              {!selected && p.defense && canDefend && (
                <span className="text-[12px] text-white/60 shrink-0">{t("defended")}</span>
              )}
              <button
                type="button"
                aria-label={t("Delete prop")}
                onClick={(e) => {
                  e.stopPropagation();
                  removeProp(p.id);
                }}
                className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {selected && (
              /* Controls must not bubble to the card's onClick (map re-focus) */
              <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setPickerFor(p.id)}
                  className="bg-[#14181a] rounded-[8px] p-2 flex items-center gap-3 border border-[#2e3439] hover:border-[#f4db50] transition-colors text-left"
                >
                  <ObjectThumb entry={entry} glyph={PROP_GLYPH} size={64} />
                  <span className="flex-1 min-w-0 text-[12px] text-white truncate">
                    {entry ? t(entry.label) : t("Select prop…")}
                  </span>
                  <span className="text-[11px] text-[#f4db50] shrink-0">{t("Change")}</span>
                </button>
                {entry?.editable === false && (
                  <Hint>{t("This prop has no editable variant — the Game Master can't move or delete it in-game.")}</Hint>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white">{t("Rotation")}</span>
                  <span className="text-[12px] text-white/60">{p.rotation}°</span>
                </div>
                <Slider
                  min={0}
                  max={359}
                  step={1}
                  value={p.rotation}
                  onChange={(v) => updateProp(p.id, { rotation: ((Math.round(v) % 360) + 360) % 360 })}
                  trackColor="#2e3439"
                />
                <Hint>{t("0° faces north; the tick on the footprint shows the facing (MG nests and bunkers fire that way).")}</Hint>

                {canDefend && (
                  <>
                    <CheckRow
                      checked={p.defense}
                      onChange={(next) => updateProp(p.id, { defense: next, defenseSizes: undefined })}
                    >
                      {t("Add enemy defense group")}
                    </CheckRow>
                    {p.defense && (
                      <div className="ml-1 pl-4 border-l border-[#2e3439] flex flex-col gap-1">
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={weightStop(p.defenseSizes)}
                          onChange={(v) =>
                            updateProp(p.id, { defenseSizes: PATROL_WEIGHT_STOPS[v - 1].sizes })
                          }
                          trackColor="#2e3439"
                        />
                        <span className="text-[11px] text-white/40">
                          {t(PATROL_WEIGHT_STOPS[weightStop(p.defenseSizes) - 1].label)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {slope > 3 && (
                  <div className="bg-[rgba(244,219,80,0.12)] border border-[rgba(244,219,80,0.4)] rounded-[8px] p-3 text-[12px] leading-[16px] text-[#f4db50] animate-[mbFadeSlide_0.2s_ease]">
                    {t("⚠ Uneven ground: {n} m elevation change across the prop footprint. Large props may float or clip — consider moving or rotating it.").replace(
                      "{n}",
                      slope.toFixed(1)
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {addPickerOpen && (
        <ObjectPickerModal
          pool={pool}
          categories={PROP_CATEGORIES}
          glyph={PROP_GLYPH}
          title={t("Select prop")}
          current={pendingRef ?? undefined}
          onPick={(ref) => {
            setAddPickerOpen(false);
            onArmProp(ref);
          }}
          onClose={() => setAddPickerOpen(false)}
        />
      )}

      {pickerFor && (() => {
        const target = mission.props.find((p) => p.id === pickerFor);
        if (!target) return null;
        return (
          <ObjectPickerModal
            pool={pool}
            categories={PROP_CATEGORIES}
            glyph={PROP_GLYPH}
            title={t("Select prop")}
            current={target.ref}
            onPick={(ref) => {
              // Switching category can invalidate the defense checkbox
              const patch: Partial<MissionProp> = { ref };
              if (!propCanDefend(ref)) {
                patch.defense = false;
                patch.defenseSizes = undefined;
              }
              updateProp(pickerFor, patch);
              setPickerFor(null);
            }}
            onClose={() => setPickerFor(null)}
          />
        );
      })()}
    </>
  );
}
