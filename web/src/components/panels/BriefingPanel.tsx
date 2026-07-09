"use client";

import type { Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { Field, GhostButton, PlusIcon, TextArea, TextInput } from "../ui";

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

  return (
    <>
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
