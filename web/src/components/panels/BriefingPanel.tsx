"use client";

import type { Mission } from "@/lib/mission";
import { Field, GhostButton, TextArea, TextInput, XButton } from "../ui";

export default function BriefingPanel({
  mission,
  update,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
}) {
  const briefing = mission.briefing;
  const setExtra = (extra: Mission["briefing"]["extra"]) => update({ briefing: { ...briefing, extra } });

  return (
    <>
      <Field label="Situation">
        <TextArea
          rows={4}
          value={briefing.situation}
          onChange={(e) => update({ briefing: { ...briefing, situation: e.target.value } })}
        />
      </Field>
      <Field label="Objectives">
        <TextArea
          rows={3}
          value={briefing.objectives}
          onChange={(e) => update({ briefing: { ...briefing, objectives: e.target.value } })}
        />
      </Field>
      <Field label="Hostile forces">
        <TextArea
          rows={3}
          value={briefing.threats}
          onChange={(e) => update({ briefing: { ...briefing, threats: e.target.value } })}
        />
      </Field>

      {briefing.extra.map((ex, i) => (
        <div key={i} className="bg-[#14181a] rounded-[8px] p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TextInput
              className="!bg-[#202427] flex-1"
              placeholder="Section name (e.g. Support)"
              value={ex.title}
              onChange={(e) =>
                setExtra(briefing.extra.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
              }
            />
            <XButton
              ariaLabel="Remove section"
              onClick={() => setExtra(briefing.extra.filter((_, j) => j !== i))}
            />
          </div>
          <TextArea
            className="!bg-[#202427]"
            rows={3}
            value={ex.text}
            onChange={(e) =>
              setExtra(briefing.extra.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
            }
          />
        </div>
      ))}
      <GhostButton onClick={() => setExtra([...briefing.extra, { title: "", text: "" }])}>
        + Add briefing section
      </GhostButton>
    </>
  );
}
