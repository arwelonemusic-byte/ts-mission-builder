"use client";

import { PANEL_SHADOW, PrimaryButton } from "./ui";

export type StepId = "mission" | "factions" | "spawn" | "zones" | "markers" | "briefing";

const STEPS: { id: StepId; label: string }[] = [
  { id: "mission", label: "Mission" },
  { id: "factions", label: "Factions" },
  { id: "spawn", label: "Spawn" },
  { id: "zones", label: "Zones" },
  { id: "markers", label: "Markers" },
  { id: "briefing", label: "Brief" },
];

export default function StepTabs({
  step,
  onStep,
  onGenerate,
  busy,
}: {
  step: StepId;
  onStep: (s: StepId) => void;
  onGenerate: () => void;
  busy?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 w-max">
      <div className={`h-[40px] rounded-[8px] bg-[#14181a] p-1 flex items-center gap-1 ${PANEL_SHADOW}`}>
        {STEPS.map((s) => {
          const active = step === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStep(s.id)}
              className={`h-full px-3 rounded-[6px] text-[12px] leading-[20px] font-medium flex items-center transition-colors ${
                active ? "bg-[#f4db50] text-[#202427]" : "text-white/60 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <PrimaryButton onClick={onGenerate} disabled={busy}>
        {busy ? "GENERATING…" : "GENERATE"}
      </PrimaryButton>
    </div>
  );
}
