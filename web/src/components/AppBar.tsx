"use client";

import { useState } from "react";
import { useT, type Lang } from "@/lib/i18n";

export type StepId = "mission" | "players" | "enemy" | "spawn" | "zones" | "objectives" | "props" | "markers" | "briefing";

/** 24×24 single-path stroke icons (rendered 16×16), from the v2 design. */
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
    // crosshair-in-shield: distinct from the concentric-circles Zones icon
    id: "objectives",
    label: "Objectives",
    icon: "M12 22c5-2 8-6.5 8-12V5l-8-3-8 3v5c0 5.5 3 10 8 12M12 7v3M12 14v3M7.5 12h3M13.5 12h3",
  },
  {
    // cube/box: a placeable object
    id: "props",
    label: "Props",
    icon: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7l8.7 5 8.7-5M12 22V12",
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

const DISCORD_URL = "https://discord.gg/M3yAhHGxrd";

/** Discord logo mark (16×12.39 fill path from the design asset). */
function DiscordIcon() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 12.3856" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M13.5535 1.03729C12.5178 0.552705 11.4104 0.200531 10.2526 0C10.1104 0.257074 9.94429 0.602844 9.82976 0.877902C8.599 0.692812 7.37956 0.692812 6.17144 0.877902C6.05693 0.602844 5.88704 0.257074 5.74357 0C4.58454 0.200531 3.47584 0.553999 2.44013 1.03985C0.351095 4.19666 -0.215207 7.27505 0.0679444 10.3097C1.4535 11.3444 2.79627 11.973 4.11638 12.3843C4.44233 11.9357 4.73302 11.4588 4.98345 10.9563C4.5065 10.775 4.04969 10.5514 3.61805 10.2917C3.73256 10.2069 3.84457 10.1182 3.95279 10.027C6.58546 11.2583 9.44593 11.2583 12.0472 10.027C12.1566 10.1182 12.2686 10.2069 12.3819 10.2917C11.949 10.5527 11.4909 10.7763 11.014 10.9576C11.2644 11.4588 11.5538 11.937 11.881 12.3856C13.2024 11.9743 14.5464 11.3457 15.932 10.3097C16.2642 6.79176 15.3644 3.74164 13.5535 1.03729ZM5.34212 8.44343C4.55181 8.44343 3.9037 7.70563 3.9037 6.80718C3.9037 5.90873 4.53797 5.16966 5.34212 5.16966C6.14628 5.16966 6.79437 5.90743 6.78053 6.80718C6.78178 7.70563 6.14628 8.44343 5.34212 8.44343ZM10.6578 8.44343C9.86752 8.44343 9.21941 7.70563 9.21941 6.80718C9.21941 5.90873 9.85366 5.16966 10.6578 5.16966C11.462 5.16966 12.1101 5.90743 12.0962 6.80718C12.0962 7.70563 11.462 8.44343 10.6578 8.44343Z" />
    </svg>
  );
}

/** Check-square glyph on the Generate button (16-viewBox paths from the design). */
function GenerateIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" />
      <path d="M6 8L7.33333 9.33333L10 6.66667" />
    </svg>
  );
}

/** Top application bar: logo + step tabs (with incomplete-step dots) + Generate,
 * language toggle + Discord link. Yellow is reserved for Generate (design v2.1). */
export default function AppBar({
  step,
  onStep,
  onGenerate,
  busy,
  dots,
  lang,
  onLang,
}: {
  step: StepId;
  onStep: (s: StepId) => void;
  onGenerate: () => void;
  busy?: boolean;
  /** Steps that should show the yellow "needs attention" dot */
  dots: Partial<Record<StepId, boolean>>;
  lang: Lang;
  onLang: (lang: Lang) => void;
}) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
    <div className="absolute top-0 left-0 right-0 h-[56px] z-[1600] hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 bg-[#202427] border-b border-[#2e3439] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-[10px] min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/ts-logo.svg" alt="TS" className="shrink-0" style={{ width: 31, height: 24 }} />
        <span className="font-slab text-[16px] font-medium text-white whitespace-nowrap">
          {t("Mission Builder")}
        </span>
      </div>

      <div className="flex items-center gap-2">
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
                  active ? "bg-[#2e3439] text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  width="16"
                  height="16"
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
        <button
          type="button"
          onClick={onGenerate}
          disabled={busy}
          className={`h-[40px] px-4 rounded-[8px] text-[12px] leading-[20px] font-medium flex items-center gap-[6px] transition-colors ${
            busy
              ? "bg-[#2e3439] text-white/30 cursor-default"
              : "bg-[#f4db50] text-[#202427] hover:bg-[#f9e278]"
          }`}
        >
          <GenerateIcon />
          {busy ? t("Generating…") : t("Generate")}
        </button>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <div className="h-[40px] rounded-[8px] bg-[#14181a] p-[3px] flex items-center">
          {(["en", "ru"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLang(l)}
              className={`h-full px-[10px] rounded-[6px] flex items-center justify-center text-[11px] leading-none font-semibold tracking-[0.04em] transition-colors ${
                lang === l ? "bg-[#2e3439] text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {l === "en" ? "ENG" : "RU"}
            </button>
          ))}
        </div>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener"
          className="h-[40px] px-4 rounded-[8px] bg-[#5865f2] hover:bg-[#6b77f5] text-white text-[12px] leading-[20px] font-medium flex items-center gap-[6px] transition-colors"
        >
          <DiscordIcon />
          Tactical Shift
        </a>
      </div>
    </div>

    {/* ----- mobile (<768px) chrome ----- */}

    {/* mobile header: logo (no label) + Generate + "…" */}
    <div className="md:hidden absolute top-0 left-0 right-0 h-[56px] z-[1600] flex items-center justify-between px-3 bg-[#202427] border-b border-[#2e3439] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/ts-logo.svg" alt="TS" className="shrink-0" style={{ width: 31, height: 24 }} />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            onGenerate();
          }}
          disabled={busy}
          className={`h-[40px] px-4 rounded-[8px] text-[12px] leading-[20px] font-medium flex items-center gap-[6px] transition-colors ${
            busy
              ? "bg-[#2e3439] text-white/30 cursor-default"
              : "bg-[#f4db50] text-[#202427] hover:bg-[#f9e278]"
          }`}
        >
          <GenerateIcon />
          {busy ? t("Generating…") : t("Generate")}
        </button>
        <button
          type="button"
          aria-label={t("More options")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="w-[40px] h-[40px] rounded-[8px] bg-[#14181a] text-white/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor" aria-hidden>
            <circle cx="2" cy="2" r="1.5" />
            <circle cx="2" cy="8" r="1.5" />
            <circle cx="2" cy="14" r="1.5" />
          </svg>
        </button>
      </div>
    </div>

    {/* "…" dropdown: language toggle + Discord (siblings of the header so the
        menu isn't trapped in its stacking context) */}
    {menuOpen && (
      <>
        <div className="md:hidden fixed inset-0 z-[1890]" onClick={() => setMenuOpen(false)} />
        <div className="md:hidden absolute right-3 top-[60px] z-[1900] min-w-[220px] bg-[#202427] border border-[#2e3439] rounded-[12px] p-3 flex flex-col gap-3 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] animate-[mbFadeSlide_0.2s_ease]">
          <div className="h-[40px] rounded-[8px] bg-[#14181a] p-[3px] flex items-center">
            {(["en", "ru"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  onLang(l);
                  setMenuOpen(false);
                }}
                className={`flex-1 h-full rounded-[6px] flex items-center justify-center text-[11px] leading-none font-semibold tracking-[0.04em] transition-colors ${
                  lang === l ? "bg-[#2e3439] text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {l === "en" ? "ENG" : "RU"}
              </button>
            ))}
          </div>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            onClick={() => setMenuOpen(false)}
            className="h-[40px] px-4 rounded-[8px] bg-[#5865f2] hover:bg-[#6b77f5] text-white text-[12px] leading-[20px] font-medium flex items-center justify-center gap-[6px] transition-colors"
          >
            <DiscordIcon />
            Tactical Shift
          </a>
        </div>
      </>
    )}

    {/* icon-only bottom tab bar */}
    <div
      role="tablist"
      className="md:hidden absolute bottom-0 left-0 right-0 z-[1660] h-[var(--mb-tabbar-h)] pb-[env(safe-area-inset-bottom)] bg-[#202427] border-t border-[#2e3439] flex items-stretch"
    >
      {STEPS.map((s) => {
        const active = step === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={t(s.label)}
            onClick={() => onStep(s.id)}
            className="flex-1 flex items-center justify-center active:scale-[0.97] transition-transform"
          >
            <span
              className={`relative w-10 h-10 rounded-[8px] flex items-center justify-center ${
                active ? "bg-[#2e3439] text-white" : "text-white/60"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={s.icon} />
              </svg>
              {!active && dots[s.id] && (
                <span className="absolute top-[3px] right-[3px] w-[5px] h-[5px] rounded-full bg-[#f4db50]" />
              )}
            </span>
          </button>
        );
      })}
    </div>
    </>
  );
}
