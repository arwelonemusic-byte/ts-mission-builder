"use client";

import { useEffect, useRef, useState } from "react";
import { tr, type Lang } from "@/lib/i18n";
import {
  ALL_LAYERS_VISIBLE,
  hiddenLayerCount,
  isSoloLayer,
  MAP_LAYER_LABELS,
  soloLayer,
  type MapLayerKey,
  type MapLayers,
} from "@/lib/mapLayers";
import { StepIcon, type StepId } from "@/components/AppBar";

// Top-right map HUD cluster shared by the 2D and 3D views: map-layers sheet
// (2026-09-22), fit whole map (zoom +/- buttons dropped 2026-09-19 — nobody
// used them, wheel/pinch zooms), the satellite/topo basemap toggle (only for
// terrains that ship a satellite pyramid), the elevation overlay and the 2D/3D
// view toggle. Desktop only — mobile pinch-zooms and stays 2D.
type Props = {
  lang: Lang;
  onFit: () => void;
  view3D: boolean;
  onToggleView: () => void;
  /** Terrain ships a satellite pyramid → show the SAT button */
  satAvailable?: boolean;
  satLayer?: boolean;
  onToggleSat?: () => void;
  /** Elevation overlay (POC) on/off */
  elevLayer?: boolean;
  onToggleElev?: () => void;
  /** Map layer visibility (markers / AI zones / props / objectives) */
  layers?: MapLayers;
  onLayersChange?: (v: MapLayers) => void;
};

const BTN =
  "w-9 h-9 bg-[#202427] hover:bg-[#2e3439] active:bg-[#3a4249] flex items-center justify-center";

const LAYER_ROWS: { key: MapLayerKey; label: string; icon: StepId }[] = (
  ["markers", "zones", "props", "objectives"] as MapLayerKey[]
).map((key) => ({ key, label: MAP_LAYER_LABELS[key], icon: key }));

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {off ? (
        <>
          <path d="M10.7 5.1A10.9 10.9 0 0 1 12 5c7 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2M6.6 6.6A18.6 18.6 0 0 0 2 12s3 7 10 7a10.7 10.7 0 0 0 5.4-1.4" />
          <path d="M14.1 14.1a3 3 0 0 1-4.2-4.2M2 2l20 20" />
        </>
      ) : (
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </>
      )}
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}

export default function MapViewControls({
  lang,
  onFit,
  view3D,
  onToggleView,
  satAvailable,
  satLayer,
  onToggleSat,
  elevLayer,
  onToggleElev,
  layers,
  onLayersChange,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Outside click / Escape close the sheet (Escape also cancels page-side
  // placement — harmless, the sheet is a view control).
  useEffect(() => {
    if (!sheetOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setSheetOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  const vis = layers ?? ALL_LAYERS_VISIBLE;
  const hidden = hiddenLayerCount(vis);
  const setVis = (next: MapLayers) => onLayersChange?.(next);

  return (
    <div ref={rootRef} className="max-md:hidden absolute top-4 right-4 z-[1000]">
      <div className="flex flex-col gap-px rounded-[8px] overflow-hidden shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)]">
        {layers && onLayersChange && (
          <button
            type="button"
            aria-label={tr(lang, "Map layers")}
            title={tr(lang, "Map layers")}
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen((v) => !v)}
            className={`${BTN} ${hidden > 0 || sheetOpen ? "text-[#f4db50]" : "text-white/70"}`}
          >
            <LayersIcon />
          </button>
        )}
        <button
          type="button"
          aria-label={tr(lang, "Fit whole map")}
          title={tr(lang, "Fit whole map")}
          onClick={onFit}
          className={`${BTN} text-white/70`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        {satAvailable && onToggleSat && (
          <button
            type="button"
            aria-label={tr(lang, satLayer ? "Topographic map" : "Satellite imagery")}
            title={tr(lang, satLayer ? "Topographic map" : "Satellite imagery")}
            onClick={onToggleSat}
            className={`${BTN} text-[10px] font-semibold tracking-wide ${satLayer ? "text-[#f4db50]" : "text-white/70"}`}
          >
            SAT
          </button>
        )}
        {onToggleElev && (
          <button
            type="button"
            aria-label={tr(lang, "Elevation overlay")}
            title={tr(lang, "Elevation overlay")}
            onClick={onToggleElev}
            className={`${BTN} text-[10px] font-semibold tracking-wide ${elevLayer ? "text-[#f4db50]" : "text-white/70"}`}
          >
            ELEV
          </button>
        )}
        <button
          type="button"
          aria-label={tr(lang, view3D ? "2D view" : "3D view")}
          title={tr(lang, view3D ? "2D view" : "3D view")}
          onClick={onToggleView}
          className={`${BTN} text-[11px] font-semibold ${view3D ? "text-[#f4db50]" : "text-white/70"}`}
        >
          3D
        </button>
      </div>

      {sheetOpen && layers && onLayersChange && (
        <div
          role="group"
          aria-label={tr(lang, "Map layers")}
          className="absolute top-0 right-full mr-2 w-[220px] rounded-[8px] bg-[#202427] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] py-1 text-[12px] leading-[20px] text-white"
        >
          <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {tr(lang, "Map layers")}
          </div>
          {LAYER_ROWS.map((row) => {
            const on = vis[row.key];
            const solo = isSoloLayer(vis, row.key);
            return (
              <div key={row.key} className="group flex items-center h-8 pl-2 pr-3 hover:bg-white/5">
                <button
                  type="button"
                  aria-label={tr(lang, on ? "Hide layer" : "Show layer")}
                  aria-pressed={on}
                  title={tr(lang, on ? "Hide layer" : "Show layer")}
                  onClick={() => setVis({ ...vis, [row.key]: !on })}
                  className={`w-7 h-7 flex items-center justify-center rounded-[4px] ${on ? "text-white/80" : "text-white/30"} hover:text-white`}
                >
                  <EyeIcon off={!on} />
                </button>
                <button
                  type="button"
                  onClick={() => setVis({ ...vis, [row.key]: !on })}
                  className={`flex-1 min-w-0 flex items-center gap-[6px] px-1 text-left ${on ? "text-white" : "text-white/35"}`}
                >
                  <StepIcon id={row.icon} size={14} />
                  <span className="truncate">{tr(lang, row.label)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVis(soloLayer(vis, row.key))}
                  aria-pressed={solo}
                  title={tr(lang, solo ? "Show all layers" : "Show only this layer")}
                  className={`shrink-0 px-1 text-[11px] rounded-[4px] ${
                    solo ? "text-[#f4db50]" : "text-white/35 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-white"
                  }`}
                >
                  {tr(lang, "only")}
                </button>
              </div>
            );
          })}
          {hidden > 0 && (
            <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between px-3 h-8">
              <span className="text-white/40">{tr(lang, "{n} hidden").replace("{n}", String(hidden))}</span>
              <button
                type="button"
                onClick={() => setVis(ALL_LAYERS_VISIBLE)}
                className="text-[#f4db50] hover:text-[#f9e278]"
              >
                {tr(lang, "Show all")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
