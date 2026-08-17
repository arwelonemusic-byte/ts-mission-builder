"use client";

import { useEffect, useState } from "react";
import { FACTIONS } from "mission-gen";
import {
  defaultArsenal,
  defaultGroups,
  defaultLoadouts,
  factionMeta,
  type ArtySupport,
  type Mission,
  type MissionGroup,
} from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { CheckRow, Divider, Field, GhostButton, PlusIcon, SelectInput, TextInput, Toggle } from "../ui";

const MAX_GROUPS = 8;
const MAX_GROUP_SIZE = 9;

/** Squad-size spinner (1–9): local text state so the field can be transiently
 * empty while typing; commits clamped, restores the last value on blur. */
function SizeInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <input
      type="number"
      min={1}
      max={MAX_GROUP_SIZE}
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          setText("");
          return;
        }
        const v = Math.min(MAX_GROUP_SIZE, Math.max(1, Math.floor(+raw) || 1));
        setText(String(v));
        onCommit(v);
      }}
      onBlur={() => {
        if (text === "") setText(String(value));
      }}
      className="w-[52px] h-[28px] shrink-0 bg-[#202427] border border-[#2e3439] rounded-[4px] px-2 text-[12px] text-white text-center focus:border-[#f4db50] focus:outline-none"
    />
  );
}

/** Lowest unused 1'N callsign for a newly added squad. */
function nextCallsign(groups: MissionGroup[]): string {
  for (let n = 1; n <= 9; n++) {
    const cs = `1'${n}`;
    if (!groups.some((g) => g.name === cs)) return cs;
  }
  return "1'9";
}

/** Shell-count spinner for artillery rows (0–999, clamped). */
function ShellInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  return (
    <input
      type="number"
      min={0}
      max={999}
      value={value}
      onChange={(e) => onCommit(Math.max(0, Math.min(999, Math.floor(+e.target.value) || 0)))}
      className="w-[52px] h-[28px] shrink-0 bg-[#202427] border border-[#2e3439] rounded-[4px] px-2 text-[12px] text-white text-center focus:border-[#f4db50] focus:outline-none"
    />
  );
}

export default function PlayersPanel({
  mission,
  update,
  factionKeys,
  onPlayableFaction,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  /** Vanilla + enabled-mod factions (filtered in page.tsx) */
  factionKeys: string[];
  onPlayableFaction: (faction: string) => void;
}) {
  const t = useT();
  const playable = FACTIONS[mission.playableFaction];
  const loadoutSet = playable?.loadoutSets[mission.playableSubfaction] ?? [];
  const arty = mission.arty;
  const setArty = (patch: Partial<ArtySupport>) => update({ arty: { ...arty, ...patch } });
  const setGroups = (groups: MissionGroup[]) => update({ groups });
  const shellRow = (key: "he" | "smoke" | "illum", label: string) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <CheckRow checked={arty[key].on} onChange={(on) => setArty({ [key]: { ...arty[key], on } })}>
          {label}
        </CheckRow>
      </div>
      {arty[key].on && (
        <ShellInput value={arty[key].count} onCommit={(count) => setArty({ [key]: { ...arty[key], count } })} />
      )}
    </div>
  );

  return (
    <>
      <Field label={t("Player Faction")}>
        <SelectInput value={mission.playableFaction} onChange={(e) => onPlayableFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f}>
              {factionMeta(f).label ?? f}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label={t("Player Subfaction")}>
        <SelectInput
          value={mission.playableSubfaction}
          onChange={(e) =>
            update({
              playableSubfaction: e.target.value,
              loadouts: defaultLoadouts(mission.playableFaction, e.target.value),
              arsenal: defaultArsenal(mission.playableFaction, e.target.value),
            })
          }
        >
          {Object.keys(playable?.riflemen ?? {}).map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </SelectInput>
      </Field>

      {/* Player squads → playable faction m_aSquadNames + m_aPredefinedGroups */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-white flex-1">
          {t("Squads")}{" "}
          <span className="text-white/40">
            · {mission.groups.length}/{MAX_GROUPS}
          </span>
        </span>
        <GhostButton small onClick={() => setGroups(defaultGroups())}>
          {t("Reset")}
        </GhostButton>
      </div>
      <div className="flex flex-col gap-2">
        {mission.groups.map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput
              className="flex-1 min-w-0"
              placeholder={t("Squad name")}
              maxLength={24}
              value={g.name}
              onChange={(e) =>
                setGroups(mission.groups.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
              }
            />
            <SizeInput
              value={g.size}
              onCommit={(size) =>
                setGroups(mission.groups.map((x, j) => (j === i ? { ...x, size } : x)))
              }
            />
            {mission.groups.length > 1 && (
              <button
                type="button"
                aria-label={t("Remove squad")}
                onClick={() => setGroups(mission.groups.filter((_, j) => j !== i))}
                className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        ))}
        {mission.groups.length < MAX_GROUPS && (
          <GhostButton
            onClick={() =>
              setGroups([...mission.groups, { name: nextCallsign(mission.groups), size: 9 }])
            }
          >
            <PlusIcon />
            {t("Add squad")}
          </GhostButton>
        )}
      </div>

      <Divider />

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-white flex-1">
          {t("Loadouts")}{" "}
          <span className="text-white/40">
            {t("· {n} selected").replace("{n}", String(mission.loadouts.length))}
          </span>
        </span>
        <GhostButton small onClick={() => update({ loadouts: loadoutSet.map((l) => l.prefab) })}>
          {t("All")}
        </GhostButton>
        <GhostButton
          small
          onClick={() =>
            update({ loadouts: defaultLoadouts(mission.playableFaction, mission.playableSubfaction) })
          }
        >
          {t("Reset")}
        </GhostButton>
      </div>
      <div className="flex flex-col gap-2">
        {loadoutSet.map((l) => (
          <CheckRow
            key={l.prefab}
            checked={mission.loadouts.includes(l.prefab)}
            onChange={(on) => {
              const next = on
                ? [...mission.loadouts, l.prefab]
                : mission.loadouts.filter((p) => p !== l.prefab);
              update({ loadouts: next });
            }}
          >
            {l.name}
          </CheckRow>
        ))}
      </div>

      <Divider />

      {/* Artillery support → TS_FireSupportManagerComponent on GameModeSF */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">{t("Artillery Support")}</span>
        <Toggle
          checked={arty.enabled}
          onChange={(enabled) => setArty({ enabled })}
          ariaLabel={t("Artillery Support")}
        />
      </div>
      {arty.enabled && (
        <div className="flex flex-col gap-2 animate-[mbFadeSlide_0.2s_ease]">
          {shellRow("he", t("HE shells"))}
          {shellRow("smoke", t("Smoke shells"))}
          {shellRow("illum", t("Illumination shells"))}
        </div>
      )}
    </>
  );
}
