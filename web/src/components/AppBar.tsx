"use client";

import { useT, type Lang } from "@/lib/i18n";

export type StepId = "mission" | "players" | "enemy" | "spawn" | "zones" | "markers" | "briefing";

/** 24×24 single-path stroke icons (rendered 14×14), from the v2 design. */
const STEPS: { id: StepId; label: string; icon: string }[] = [
  { id: "mission", label: "Mission", icon: "M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" },
  {
    id: "players",
    label: "Players",
    icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0",
  },
  { id: "spawn", label: "Spawn", icon: "M22 12a10 10 0 1 1-20 0a10 10 0 0 1 20 0M22 12h-4M6 12H2M12 6V2M12 22v-4" },
  {
    id: "enemy",
    label: "Enemy",
    icon: "M10 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0M16 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8 20v2h8v-2M12.5 17l-.5-1-.5 1h1zM16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20",
  },
  {
    id: "zones",
    label: "Zones",
    icon: "M22 12a10 10 0 1 1-20 0a10 10 0 0 1 20 0M18 12a6 6 0 1 1-12 0a6 6 0 0 1 12 0M14 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0",
  },
  {
    id: "markers",
    label: "Markers",
    icon: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0",
  },
  {
    id: "briefing",
    label: "Brief",
    icon: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8",
  },
];

/** Top application bar: logo + step tabs (with incomplete-step dots) +
 * language toggle + GENERATE. */
export default function AppBar({
  step,
  onStep,
  onGenerate,
  busy,
  ready,
  dots,
  lang,
  onLang,
}: {
  step: StepId;
  onStep: (s: StepId) => void;
  onGenerate: () => void;
  busy?: boolean;
  /** Mission passes validation — GENERATE glows as a "ready" signal */
  ready?: boolean;
  /** Steps that should show the yellow "needs attention" dot */
  dots: Partial<Record<StepId, boolean>>;
  lang: Lang;
  onLang: (lang: Lang) => void;
}) {
  const t = useT();
  return (
    <div className="absolute top-0 left-0 right-0 h-[56px] z-[1600] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 bg-[#202427] border-b border-[#2e3439] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-[10px] min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/ts-logo.svg" alt="TS" className="shrink-0" style={{ width: 31, height: 24 }} />
        <span className="font-slab text-[16px] font-medium text-white whitespace-nowrap">
          {t("Mission Builder")}
        </span>
      </div>

      <div className="h-[40px] rounded-[8px] bg-[#14181a] p-1 flex items-center gap-1">
        {STEPS.map((s) => {
          const active = step === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStep(s.id)}
              className={`relative h-full px-3 rounded-[6px] text-[12px] leading-[20px] font-medium flex items-center gap-[6px] transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${
                active ? "bg-[#f4db50] text-[#202427]" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="shrink-0"
              >
                <path d={s.icon} />
              </svg>
              {t(s.label)}
              {!active && dots[s.id] && (
                <span className="absolute top-[3px] right-[3px] w-[5px] h-[5px] rounded-full bg-[#f4db50]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 justify-end">
        <div className="h-[32px] rounded-[8px] bg-[#14181a] p-[3px] flex items-center">
          {(["en", "ru"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLang(l)}
              className={`h-full px-[10px] rounded-[6px] flex items-center justify-center text-[11px] leading-none font-semibold tracking-[0.04em] transition-colors ${
                lang === l ? "bg-[#f4db50] text-[#202427]" : "text-white/60 hover:text-white"
              }`}
            >
              {l === "en" ? "ENG" : "RU"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={busy}
          className={`h-[40px] px-4 rounded-[8px] text-[12px] leading-[20px] font-medium transition-colors ${
            busy
              ? "bg-[#2e3439] text-white/30 cursor-default"
              : `bg-[#f4db50] text-[#202427] hover:bg-[#f9e278] ${
                  ready ? "animate-[mbGlow_2.6s_ease-in-out_infinite]" : ""
                }`
          }`}
        >
          {busy ? t("GENERATING…") : t("GENERATE")}
        </button>
      </div>
    </div>
  );
}
