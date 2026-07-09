"use client";

import { useT } from "@/lib/i18n";

export const GEN_STAGES = [
  "Validating mission",
  "Minting addon GUIDs",
  "Placing spawn bundle",
  "Populating AI zones",
  "Writing briefing & markers",
];

export type GenState = { phase: "run" | "done"; stage: number } | null;

/** Full-screen generate overlay: staged progress theater, then the MISSION
 * READY stamp with next steps + Download (design v2). The actual folder-pick
 * export runs from the Download click. Esc/Done dismiss when done. */
export default function GenerateOverlay({
  gen,
  onClose,
  onDownload,
}: {
  gen: GenState;
  onClose: () => void;
  onDownload: () => void;
}) {
  const t = useT();
  if (!gen) return null;
  const pct = Math.round((Math.min(gen.stage, GEN_STAGES.length) / GEN_STAGES.length) * 100);

  return (
    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-[rgba(13,15,17,0.55)] backdrop-blur-[3px] animate-[mbFadeIn_0.2s_ease]">
      <div className="w-[420px] max-w-[calc(100vw-48px)] bg-[#202427] rounded-[12px] p-7 flex flex-col gap-5 shadow-[0px_24px_48px_0px_rgba(0,0,0,0.55)] animate-[mbFadeSlide_0.25s_ease]">
        {gen.phase === "run" ? (
          <>
            <span className="font-slab text-[20px] font-medium text-white">{t("Generating mission")}</span>
            <div className="flex flex-col gap-3">
              {GEN_STAGES.map((label, i) => {
                const done = gen.stage > i;
                const active = gen.stage === i;
                return (
                  <div key={label} className="flex items-center gap-3">
                    {done ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0 animate-[mbPop_0.2s_ease]" aria-hidden>
                        <path d="M3 8l3.5 3.5L13 5" stroke="#f4db50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : active ? (
                      <span
                        className="shrink-0 w-[14px] h-[14px] rounded-full animate-[mbSpin_0.7s_linear_infinite]"
                        style={{ border: "2px solid rgba(244,219,80,0.25)", borderTopColor: "#f4db50" }}
                      />
                    ) : (
                      <span className="shrink-0 w-2 h-2 mx-[3px] rounded-full bg-[#2e3439]" />
                    )}
                    <span className={`text-[13px] ${done ? "text-white/85" : active ? "text-white" : "text-white/35"}`}>
                      {t(label)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1 rounded-full bg-[#14181a] overflow-hidden">
              <div
                className="h-full bg-[#f4db50] transition-[width] duration-[450ms]"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className="self-center mt-2 mb-1 border-[3px] border-[#f4db50] rounded-[6px] px-[26px] py-[10px] animate-[mbStamp_0.45s_cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: "rotate(-6deg)" }}
            >
              <span className="font-slab text-[24px] leading-none font-bold text-[#f4db50] tracking-[0.18em]">
                {t("MISSION READY")}
              </span>
            </div>
            <span className="font-slab text-[22px] leading-[28px] font-medium text-white">
              {t("Mission generated")}
            </span>
            <div className="flex flex-col gap-2">
              {["Open the generated project in Workbench once.", "Publish to the Workshop from Workbench."].map(
                (s, i) => (
                  <div key={s} className="flex items-start gap-[10px]">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[rgba(244,219,80,0.12)] text-[#f4db50] text-[11px] font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-5 text-white/80">{t(s)}</span>
                  </div>
                )
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-[40px] rounded-[8px] bg-[#2e3439] text-white hover:bg-[#3a4249] text-[12px] font-medium transition-colors"
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                onClick={onDownload}
                className="flex-1 h-[40px] rounded-[8px] bg-[#f4db50] text-[#202427] hover:bg-[#f9e278] text-[12px] font-medium transition-colors"
              >
                {t("Download")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
