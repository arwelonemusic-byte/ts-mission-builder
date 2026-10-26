"use client";

import { useEffect, useState } from "react";
import { clampMissionTime, daysInMonth, MISSION_YEAR_MAX, MISSION_YEAR_MIN } from "mission-gen";
import type { Mission, MissionTime } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { Divider, Field, GhostButton, PlusIcon, SelectInput, TextArea, TextInput } from "../ui";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (v: number, digits: number) => String(v).padStart(digits, "0");

/** Digits-only field with local text state: commits while the typed value is
 * in range, snaps on blur (above max → max, below min / empty → last value —
 * a half-typed year like "19" must not jump to 1899). The text resyncs from
 * the value only while unfocused, else typing "0" of "07" would re-render as
 * "00" and fill the field. Arrow keys step ±1, wrapping when `wrap` is set
 * (clock fields). */
function NumberField({
  value,
  min,
  max,
  digits,
  wrap,
  ariaLabel,
  onCommit,
}: {
  value: number;
  min: number;
  max: number;
  digits: number;
  wrap?: boolean;
  ariaLabel: string;
  onCommit: (v: number) => void;
}) {
  const [text, setText] = useState(pad(value, digits));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(pad(value, digits));
  }, [value, digits, focused]);
  const step = (d: number) => {
    let v = value + d;
    if (v > max) v = wrap ? min : max;
    if (v < min) v = wrap ? max : min;
    setText(pad(v, digits));
    onCommit(v);
  };
  return (
    <TextInput
      inputMode="numeric"
      aria-label={ariaLabel}
      maxLength={digits}
      value={text}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, digits);
        setText(raw);
        const v = +raw;
        if (raw !== "" && v >= min && v <= max) onCommit(v);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        if (text !== "" && +text > max) onCommit(max);
        setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          step(e.key === "ArrowUp" ? 1 : -1);
        }
      }}
      className="text-center tabular-nums !px-0"
      style={{ width: digits * 12 + 32 }}
    />
  );
}

export default function BriefingPanel({
  mission,
  update,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
}) {
  const t = useT();
  const briefing = mission.briefing;
  const setExtra = (extra: Mission["briefing"]["extra"]) => update({ briefing: { ...briefing, extra } });
  const time = mission.time;
  // Re-clamp on every change: a month/year switch can shorten the month
  // under the chosen day (31 Mar → Feb = 28/29).
  const setTime = (patch: Partial<MissionTime>) => update({ time: clampMissionTime({ ...time, ...patch }) });
  const monthDays = daysInMonth(time.month, time.year);

  return (
    <>
      <Field label={t("Start time")}>
        <div className="flex items-center gap-2">
          <NumberField value={time.hours} min={0} max={23} digits={2} wrap ariaLabel={t("Hours")} onCommit={(hours) => setTime({ hours })} />
          <span className="text-[14px] text-white/60">:</span>
          <NumberField value={time.minutes} min={0} max={59} digits={2} wrap ariaLabel={t("Minutes")} onCommit={(minutes) => setTime({ minutes })} />
        </div>
      </Field>
      <Field label={t("Date")}>
        <div className="flex items-center gap-2">
          <SelectInput
            aria-label={t("Day")}
            className="!w-[72px] shrink-0 tabular-nums"
            value={time.day}
            onChange={(e) => setTime({ day: +e.target.value })}
          >
            {Array.from({ length: monthDays }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            aria-label={t("Month")}
            className="flex-1 min-w-0"
            value={time.month}
            onChange={(e) => setTime({ month: +e.target.value })}
          >
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>
                {t(name)}
              </option>
            ))}
          </SelectInput>
          <NumberField value={time.year} min={MISSION_YEAR_MIN} max={MISSION_YEAR_MAX} digits={4} ariaLabel={t("Year")} onCommit={(year) => setTime({ year })} />
        </div>
      </Field>
      <Divider />
      <Field label={t("Situation")}>
        <TextArea
          rows={4}
          value={briefing.situation}
          onChange={(e) => update({ briefing: { ...briefing, situation: e.target.value } })}
        />
      </Field>
      <Field label={t("Objectives")}>
        <TextArea
          rows={3}
          value={briefing.objectives}
          onChange={(e) => update({ briefing: { ...briefing, objectives: e.target.value } })}
        />
      </Field>
      <Field label={t("Hostile forces")}>
        <TextArea
          rows={3}
          value={briefing.threats}
          onChange={(e) => update({ briefing: { ...briefing, threats: e.target.value } })}
        />
      </Field>

      {briefing.extra.map((ex, i) => (
        <div key={i} className="flex flex-col gap-2 animate-[mbFadeSlide_0.2s_ease]">
          <div className="flex items-center gap-2">
            <TextInput
              className="flex-1 min-w-0"
              placeholder={t("Section name (e.g. Support)")}
              value={ex.title}
              onChange={(e) =>
                setExtra(briefing.extra.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
              }
            />
            <button
              type="button"
              aria-label={t("Remove section")}
              onClick={() => setExtra(briefing.extra.filter((_, j) => j !== i))}
              className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <TextArea
            rows={3}
            value={ex.text}
            onChange={(e) =>
              setExtra(briefing.extra.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
            }
          />
        </div>
      ))}
      <GhostButton onClick={() => setExtra([...briefing.extra, { title: "", text: "" }])}>
        <PlusIcon />
        {t("Add briefing section")}
      </GhostButton>
    </>
  );
}
