"use client";

// Shared prefab picker: thumbnail tile + full-screen grid modal with category
// filter chips. Extracted from ObjectivesPanel (destroy/deliver target picker)
// so the Props tab can reuse it — entries are anything with a ref/label/cat
// and a thumb filename under /icons/prefabs/.
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { TextInput, XButton } from "@/components/ui";

export type PickerEntry = {
  ref: string;
  label: string;
  cat: string;
  /** filename under /icons/prefabs/ — or an absolute URL (leading "/") used
   * verbatim (terrain thumbs live under /icons/terrains/) */
  thumb: string;
  /** Optional second line under the label in the modal grid (e.g. map size) */
  sub?: string;
};

const thumbSrc = (thumb: string) => (thumb.startsWith("/") ? thumb : `/icons/prefabs/${thumb}`);

/** Thumbnail tile with glyph placeholder underneath (covers prefabs without
 * a baked EditorPreview — the broken <img> hides itself). glyph = 16x16
 * viewBox inner-SVG markup (an overlayHtml glyph string). */
export function ObjectThumb({
  entry,
  glyph,
  size,
  square,
}: {
  entry: PickerEntry | null;
  glyph: string;
  size?: number;
  /** 1:1 tile instead of the prefab-preview 4:3 (square map thumbnails) */
  square?: boolean;
}) {
  // Fixed pixel size (card row) or fluid (modal grid tiles); 4:3 = the baked
  // EditorPreview shape, 1:1 = the terrain thumbnails
  const style = size ? { width: size, height: square ? size : Math.round((size * 3) / 4) } : undefined;
  const cls = size ? "" : square ? "w-full aspect-square" : "w-full aspect-[4/3]";
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
          src={thumbSrc(entry.thumb)}
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
  square,
  searchable,
}: {
  pool: PickerEntry[];
  categories: { key: string; label: string }[];
  glyph: string;
  title: string;
  current: string | undefined;
  onPick: (ref: string) => void;
  onClose: () => void;
  /** Square tiles (see ObjectThumb) */
  square?: boolean;
  /** Live text filter over labels (+ refs/keys) above the grid — for pools
   * too long to scan (the spawn-vehicle picker with vehicle mods enabled).
   * Autofocused on open; combines with the category chips. */
  searchable?: { placeholder: string; empty: string };
}) {
  const t = useT();
  const [cat, setCat] = useState<string>("all");
  const [query, setQuery] = useState("");
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
  const byCat = cat === "all" ? pool : pool.filter((e) => e.cat === cat);
  // Every whitespace-separated token must appear in the translated label or
  // the ref (vehicle KEY / prefab path) — "jltv m2hb" finds every M2HB JLTV
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = tokens.length
    ? byCat.filter((e) => {
        const hay = `${t(e.label)} ${e.ref}`.toLowerCase();
        return tokens.every((tok) => hay.includes(tok));
      })
    : byCat;

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
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="font-slab text-[16px] font-medium text-white flex-1">{title}</h2>
          <XButton ariaLabel={t("Dismiss")} onClick={onClose} />
        </div>

        {searchable && (
          /* shrink-0: the modal is a flex column capped at 80dvh — without it
             the overflowing grid squeezes the input to a sliver. Plain text
             input + our own clear button: type="search" renders the browser's
             native (blue-tinted) clear control. */
          <div className="relative shrink-0">
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchable.placeholder}
              className={`!h-[36px] text-[12px] ${query ? "pr-9" : ""}`}
              autoFocus
              type="text"
            />
            {query && (
              <span className="absolute right-[6px] top-1/2 -translate-y-1/2">
                <XButton ariaLabel={t("Dismiss")} onClick={() => setQuery("")} />
              </span>
            )}
          </div>
        )}

        <div className={`flex flex-wrap gap-1 shrink-0 ${cats.length <= 1 ? "hidden" : ""}`}>
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
                <ObjectThumb entry={e} glyph={glyph} square={square} />
                <span className="text-[11px] leading-[14px] text-white/80 line-clamp-2">{t(e.label)}</span>
                {e.sub && <span className="text-[10px] leading-[12px] text-white/40">{e.sub}</span>}
              </button>
            );
          })}
          {searchable && shown.length === 0 && (
            <div className="col-span-full py-8 text-center text-[12px] text-white/40">{searchable.empty}</div>
          )}
        </div>
      </div>
    </div>
  );
}
