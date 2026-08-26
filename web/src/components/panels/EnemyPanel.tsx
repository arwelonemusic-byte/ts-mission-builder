"use client";

import { useEffect, useRef } from "react";
import { FACTIONS } from "mission-gen";
import {
  factionMeta,
  STOP_TRIGGER_RADIUS,
  stopTriggerRadius,
  type AiArtillery,
  type Mission,
  type PlaceMode,
} from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { CheckRow, Divider, Field, GhostButton, Hint, IntInput, PlusIcon, SelectInput, Slider, Toggle } from "../ui";

export default function EnemyPanel({
  mission,
  update,
  factionKeys,
  onEnemyFaction,
  placeMode,
  onArmStopTrigger,
  stopTriggerSelected,
  stopTriggerRevealSeq,
  onSelectStopTrigger,
  onRemoveStopTrigger,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  /** Vanilla + enabled-mod factions (filtered in page.tsx) */
  factionKeys: string[];
  onEnemyFaction: (faction: string) => void;
  placeMode: PlaceMode;
  /** Arm/cancel Stop Artillery trigger placement (Add or Move) */
  onArmStopTrigger: () => void;
  /** Trigger card ↔ map badge selection (two-way) */
  stopTriggerSelected: boolean;
  /** Bumped on every map badge click so the card re-reveals */
  stopTriggerRevealSeq: number;
  onSelectStopTrigger: () => void;
  onRemoveStopTrigger: () => void;
}) {
  const t = useT();
  const enemy = FACTIONS[mission.enemyFaction];
  // Alias factions share their base's in-game FactionKey — both sides of an
  // alias pair would be the same faction, so the pairing is disabled.
  const pf = mission.playableFaction;
  const aliasConflict = (f: string) =>
    f !== pf && (FACTIONS[f]?.aliasOf ?? f) === (FACTIONS[pf]?.aliasOf ?? pf);
  const suffix = (f: string) => {
    if (f === pf) return t(" (playable)");
    if (aliasConflict(f)) {
      return `${t(" (incompatible with playable ")}${factionMeta(pf).label ?? pf})`;
    }
    return "";
  };

  // Enemy AI artillery → TS_AiArtilleryComponent on GameModeSF
  const ai = mission.aiArty;
  const setAi = (patch: Partial<AiArtillery>) => update({ aiArty: { ...ai, ...patch } });
  const st = ai.stopTrigger;
  const armed = placeMode === "arty-stop";
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (stopTriggerRevealSeq) cardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [stopTriggerRevealSeq]);

  return (
    <>
      <Field label={t("Enemy Faction")}>
        <SelectInput value={mission.enemyFaction} onChange={(e) => onEnemyFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f} disabled={f === mission.playableFaction || aliasConflict(f)}>
              {factionMeta(f).label ?? f}
              {suffix(f)}
            </option>
          ))}
        </SelectInput>
      </Field>
      {/* Single-set factions (e.g. MEI's combined pool) have no choice to make */}
      {Object.keys(enemy?.groupSets ?? {}).length > 1 && (
        <>
          <div className="text-[12px] text-white">{t("Enemy troops (mix any)")}</div>
          <div className="flex flex-col gap-2">
            {Object.entries(enemy?.groupSets ?? {}).map(([key, gs]) => (
              <CheckRow
                key={key}
                checked={mission.enemyGroupSets.includes(key)}
                onChange={(on) => {
                  const next = on
                    ? [...mission.enemyGroupSets, key]
                    : mission.enemyGroupSets.filter((k) => k !== key);
                  if (next.length === 0) return; // keep at least one set selected
                  update({ enemyGroupSets: next });
                }}
              >
                {(gs as { label: string }).label}
              </CheckRow>
            ))}
          </div>
        </>
      )}

      <Divider />

      {/* Enemy AI artillery: mirrors the Players-tab Artillery Support toggle */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">{t("Enemy Artillery Support")}</span>
        <Toggle
          checked={ai.enabled}
          onChange={(enabled) => {
            setAi({ enabled });
            if (!enabled && armed) onArmStopTrigger();
          }}
          ariaLabel={t("Enemy Artillery Support")}
        />
      </div>
      {ai.enabled && (
        <div className="flex flex-col gap-3 animate-[mbFadeSlide_0.2s_ease]">
          <Hint>{t("Enemy AI calls in mortar strikes on players spotted by its troops.")}</Hint>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-white">{t("Rounds available")}</span>
            <IntInput value={ai.rounds} min={1} max={100000} onCommit={(rounds) => setAi({ rounds })} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white">{t("Strike chance")}</span>
              <span className="text-[12px] text-white/60">{ai.strikeChance}%</span>
            </div>
            <Slider
              min={5}
              max={100}
              step={5}
              value={ai.strikeChance}
              onChange={(v) => setAi({ strikeChance: v })}
              trackColor="#2e3439"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-white">{t("Cooldown (minutes)")}</span>
            <IntInput value={ai.cooldownMin} min={1} max={60} onCommit={(cooldownMin) => setAi({ cooldownMin })} />
          </div>

          <div className="text-[12px] text-white">{t("Stop Artillery Trigger")}</div>
          <Hint>
            {t(
              "Players entering the trigger stop the enemy artillery for the rest of the mission. Without one it fires until it runs out of rounds."
            )}
          </Hint>
          {st ? (
            <div
              ref={cardRef}
              onClick={onSelectStopTrigger}
              className={`rounded-[8px] p-3 flex flex-col gap-2 cursor-pointer bg-[#14181a] border transition-colors ${
                stopTriggerSelected ? "border-[#f4db50]" : "border-[#2e3439]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white">{t("Stop Artillery Trigger")}</span>
                <button
                  type="button"
                  aria-label={t("Remove trigger")}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveStopTrigger();
                  }}
                  className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white">{t("Radius")}</span>
                <span className="text-[12px] text-white/60">{st.radius} m</span>
              </div>
              <Slider
                min={STOP_TRIGGER_RADIUS.min}
                max={STOP_TRIGGER_RADIUS.max}
                step={5}
                value={st.radius}
                onChange={(v) => setAi({ stopTrigger: { ...st, radius: stopTriggerRadius(v) } })}
                trackColor="#2e3439"
              />
            </div>
          ) : (
            <GhostButton active={armed} onClick={onArmStopTrigger}>
              {!armed && <PlusIcon />}
              {armed ? t("Click the map… (cancel)") : t("Add Stop Artillery Trigger")}
            </GhostButton>
          )}
        </div>
      )}
    </>
  );
}
