"use client";

// Shared prefab picker: thumbnail tile + full-screen grid modal with category
// filter chips. Extracted from ObjectivesPanel (destroy/deliver target picker)
// so the Props tab can reuse it — entries are anything with a ref/label/cat
// and a thumb filename under /icons/prefabs/.
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { XButton } from "@/components/ui";

export type PickerEntry = {
  ref: string;
  label: string;
  cat: string;
  /** filename under /icons/prefabs/ */
  thumb: string;
};

/** Thumbnail tile with glyph placeholder underneath (covers prefabs without
 * a baked EditorPreview — the broken <img> hides itself). glyph = 16x16
 * viewBox inner-SVG markup (an overlayHtml glyph string). */
export function ObjectThumb({ entry, glyph, size }: { entry: PickerEntry | null; glyph: string; size?: number }) {
  // Fixed pixel size (card row) or fluid 4:3 (modal grid tiles)
  const style = size ? { width: size, height: Math.round((size * 3) / 4) } : undefined;
  const cls = size ? "" : "w-full aspect-[4/3]";
  return (
    <span
      className={`relative shrink-0 rounded-[4px] overflow-hidden bg-[#0d0f11] flex items-center justify-center ${cls}`}
      style={style}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 16 16"
        style={{ color: "#3a4147", position: "absolute" }}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
      {entry && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/icons/prefabs/${entry.thumb}`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

/** Full-screen modal: scrollable thumbnail grid + category filter chips.
 * categories = the filter-chip list (i18n keys); chips hide when the pool
 * spans fewer than two of them. */
export function ObjectPickerModal({
  pool,
  categories,
  glyph,
  title,
  current,
  onPick,
  onClose,
}: {
  pool: PickerEntry[];
  categories: { key: string; label: string }[];
  glyph: string;
  title: string;
  current: string | undefined;
  onPick: (ref: string) => void;
  onClose: () => void;
}) {
  const t = useT();
  const [cat, setCat] = useState<string>("all");
  // Opening on an existing selection scrolls the grid to it (instant — a
  // smooth scroll from the top reads as jank on long pools)
  const currentTileRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    currentTileRef.current?.scrollIntoView({ block: "center" });
  }, []);
  // Esc closes the modal without disturbing the page-level handler's other
  // duties (stopPropagation keeps it from also cancelling placement modes)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  const cats = categories.filter((c) => pool.some((e) => e.cat === c.key));
  const shown = cat === "all" ? pool : pool.filter((e) => e.cat === cat);

  return (
    <div
      /* items-start: the grid height changes with the active filter — a
         centered box would jump vertically on every chip click */
      className="fixed inset-0 z-[3000] bg-black/60 flex items-start justify-center p-4 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="bg-[#202427] rounded-[12px] p-4 flex flex-col gap-3 w-full max-w-[720px] max-h-[80dvh] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] animate-[mbFadeSlide_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-slab text-[16px] font-medium text-white flex-1">{title}</h2>
          <XButton ariaLabel={t("Dismiss")} onClick={onClose} />
        </div>

        <div className={`flex flex-wrap gap-1 ${cats.length <= 1 ? "hidden" : ""}`}>
          {[{ key: "all", label: "All" }, ...cats].map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCat(c.key)}
              className={`px-3 py-[6px] rounded-[6px] text-[12px] transition-colors ${
                cat === c.key
                  ? "bg-[#f4db50] text-[#202427] font-medium"
                  : "bg-[#14181a] text-white/70 hover:text-white"
              }`}
            >
              {t(c.label)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto ts-thin-scrollbar pr-1">
          {shown.map((e) => {
            const isCurrent = e.ref === current;
            return (
              <button
                key={e.ref}
                ref={isCurrent ? currentTileRef : undefined}
                type="button"
                onClick={() => onPick(e.ref)}
                className={`bg-[#14181a] rounded-[8px] p-2 flex flex-col gap-[6px] border text-left transition-colors ${
                  isCurrent ? "border-[#f4db50]" : "border-transparent hover:border-[#2e3439]"
                }`}
              >
                <ObjectThumb entry={e} glyph={glyph} />
                <span className="text-[11px] leading-[14px] text-white/80 line-clamp-2">{t(e.label)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
