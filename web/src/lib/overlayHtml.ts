// Pure HTML-string builders for map overlay icons, shared by the 2D view
// (wrapped in L.divIcon) and the 3D view (mounted in CSS2DObjects). All
// roots are center-anchored: 2D wraps them with iconAnchor = size/2, 3D
// relies on CSS2DRenderer's default translate(-50%,-50%).
import { ZONE_MODULES } from "mission-gen";
import type { MissionMarker, ObjectiveType, Zone } from "./mission";
import { findColor, findIcon, militaryIconUrl, MARKER_LABEL_OUTLINE, VANILLA_ATLAS } from "./markers";
import { DISABLED_ICON_FILTER, MODULE_ICONS } from "./zoneModules";
import type { Lang } from "./i18n";

/** Mission marker: military = pre-colored PNG, custom = atlas sprite
 * recolored via CSS mask. Text label sits to the right of the icon;
 * selection adds a yellow halo ring. */
export function markerHtml(mk: MissionMarker, selected: boolean, freshDrop = false): string {
  const size = 40;
  const label = mk.text.trim().replace(/[<>&"]/g, "");
  const halo = selected
    ? `<div style="position:absolute;inset:-5px;border:2px solid #f4db50;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,0.4),0 0 12px rgba(244,219,80,0.6);"></div>`
    : "";
  let iconHtml: string;
  if (mk.kind === "military") {
    // width/height must be inline STYLE — Tailwind preflight's `img { height: auto }`
    // overrides the presentation attributes and the PNG blows up to 128px.
    iconHtml = `<img src="${militaryIconUrl(mk.faction, mk.type)}" style="display:block;width:${size}px;height:${size}px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.7));" />`;
  } else {
    const icon = findIcon(mk.quad);
    const hex = findColor(mk.color).hex;
    const scale = size / icon.w;
    const mask = `url(${VANILLA_ATLAS.url})`;
    const pos = `-${icon.x * scale}px -${icon.y * scale}px`;
    const msize = `${VANILLA_ATLAS.width * scale}px ${VANILLA_ATLAS.height * scale}px`;
    iconHtml = `<div style="width:${size}px;height:${size}px;background-color:${hex};-webkit-mask-image:${mask};mask-image:${mask};-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:${pos};mask-position:${pos};-webkit-mask-size:${msize};mask-size:${msize};transform:rotate(${mk.rotation}deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,0.7));"></div>`;
  }
  const labelHtml = label
    ? `<div style="position:absolute;left:${size + 4}px;top:50%;transform:translateY(-50%);white-space:nowrap;font:600 12px/1.2 var(--font-roboto),sans-serif;color:#000;text-shadow:${MARKER_LABEL_OUTLINE};">${label}</div>`
    : "";
  const drop = freshDrop ? "animation:mbDrop 0.4s cubic-bezier(0.22,1,0.36,1);" : "";
  return `<div style="position:relative;width:${size}px;height:${size}px;${drop}">${halo}${iconHtml}${labelHtml}</div>`;
}

/** Zone dot hover tooltip: module chip row, disabled modules greyed with 0
 * (Figma 106:216). Styled via the .zone-tip rules in globals.css. */
export function zoneTooltipHtml(zone: Zone, name: string, lang: Lang): string {
  const chips = ZONE_MODULES.map((def) => {
    const mod = zone.modules.find((mm) => mm.type === def.type);
    const iconStyle = `width:16px;height:16px;flex:none;${mod ? "" : `filter:${DISABLED_ICON_FILTER};opacity:0.45;`}`;
    const countStyle = `font:400 12px/1 var(--font-roboto),sans-serif;color:${mod ? "#fff" : "#6a767c"};`;
    return `<span style="display:flex;align-items:center;gap:3px;flex:none;"><img src="${MODULE_ICONS[def.type]}" alt="" style="${iconStyle}" /><span style="${countStyle}">${mod?.budget ?? 0}</span></span>`;
  }).join("");
  return `<div style="width:max-content;">
    <div style="display:flex;align-items:baseline;gap:8px;"><span style="font:700 12px/1.2 var(--font-roboto),sans-serif;color:#fff;">${name}</span><span style="font:400 11px/1.2 var(--font-roboto),sans-serif;color:rgba(255,255,255,0.5);">${zone.radius} ${lang === "ru" ? "м" : "m"}</span></div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:6px;">${chips}</div>
  </div>`;
}

/** 14px round handle at a zone's center — the only clickable/draggable part. */
export function zoneDotHtml(selected: boolean): string {
  const color = selected ? "#ffcc00" : "#9333ea";
  return `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);cursor:move;"></div>`;
}

/** "347 m" / "1.4 km" label for the origin-drag distance pill. */
export function distanceLabel(dist: number, lang: Lang): string {
  if (dist < 1000) return `${Math.round(dist)} ${lang === "ru" ? "м" : "m"}`;
  return `${(dist / 1000).toFixed(1)} ${lang === "ru" ? "км" : "km"}`;
}

/** Distance pill shown at the origin→zone line midpoint during a badge drag.
 * Styled like the HUD scale/coords readouts; non-interactive. Zero-footprint
 * root — the inner span self-centers with its own translate(-50%,-50%). */
export function distancePillHtml(dist: number, lang: Lang): string {
  return `<div style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);pointer-events:none;"><span class="mb-dist-pill" style="display:block;white-space:nowrap;background:rgba(32,36,39,0.92);border-radius:6px;padding:3px 8px;font:500 11px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;color:rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.5);">${distanceLabel(dist, lang)}</span></div>`;
}

/** Round badge for a QRF reinforcement origin: colored disc + white module
 * glyph (footsteps / truck). Selection adds a yellow halo ring. */
export function originBadgeHtml(moduleType: string, color: string, selected: boolean): string {
  const foot = moduleType === "TS_ScenarioFrameworkPluginQRFFoot";
  const glyphPath = foot
    ? "M10.6667 11.3333H13.3333M2.66667 8.66667H5.33333M2.66669 10.6667V9.08C2.66669 7.66667 1.98002 7 2.00002 5.33333C2.02002 3.52 2.99336 1.33333 5.00002 1.33333C6.24669 1.33333 6.66669 2.53333 6.66669 3.66667C6.66669 5.74 5.33336 7.44 5.33336 9.45333V10.6667C5.33336 11.0203 5.19288 11.3594 4.94283 11.6095C4.69278 11.8595 4.35364 12 4.00002 12C3.6464 12 3.30726 11.8595 3.05721 11.6095C2.80716 11.3594 2.66669 11.0203 2.66669 10.6667ZM13.3333 13.3333V11.7467C13.3333 10.3333 14.02 9.66667 14 8C13.98 6.18667 13.0067 4 11 4C9.75333 4 9.33333 5.2 9.33333 6.33333C9.33333 8.40667 10.6667 10.1067 10.6667 12.12V13.3333C10.6667 13.687 10.8071 14.0261 11.0572 14.2761C11.3072 14.5262 11.6464 14.6667 12 14.6667C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333Z"
    : "M12.6667 12H14C14.4 12 14.6667 11.7333 14.6667 11.3333V9.33333C14.6667 8.73333 14.2 8.2 13.6667 8.06667C12.4667 7.73333 10.6667 7.33333 10.6667 7.33333C10.6667 7.33333 9.8 6.4 9.2 5.8C8.86667 5.53333 8.46667 5.33333 8 5.33333H7.33333M12.6667 12C12.6667 12.7364 12.0697 13.3333 11.3333 13.3333C10.597 13.3333 10 12.7364 10 12M12.6667 12C12.6667 11.2636 12.0697 10.6667 11.3333 10.6667C10.597 10.6667 10 11.2636 10 12M3.33333 5.33333C2.93333 5.33333 2.6 5.6 2.4 5.93333L1.46667 7.86667C1.37839 8.12415 1.33333 8.39447 1.33333 8.66667V11.3333C1.33333 11.7333 1.6 12 2 12H3.33333M3.33333 5.33333H3L2.99996 2.99996H7.33329L7.33333 3.50004M3.33333 5.33333H7.33333M3.33333 12C3.33333 12.7364 3.93029 13.3333 4.66667 13.3333C5.40305 13.3333 6 12.7364 6 12M3.33333 12C3.33333 11.2636 3.93029 10.6667 4.66667 10.6667C5.40305 10.6667 6 11.2636 6 12M7.33333 5.33333L7.33333 3.50004M7.33333 3.50004H12.3333M6 12L10 12";
  const halo = selected
    ? `<div style="position:absolute;inset:-6px;border:2px solid #f4db50;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,0.4),0 0 12px rgba(244,219,80,0.6);"></div>`
    : "";
  return `<div style="position:relative;width:24px;height:24px;">${halo}<div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;cursor:move;"><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="${glyphPath}" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>`;
}

/** Objectives accent (map badge, radius circle, placement ping) — distinct
 * from zone purple #9333ea, sector red #9f2828 and marker yellow. */
export const OBJECTIVE_COLOR = "#e8593c";

/** Per-type white stroke glyphs (16×16 viewBox inner SVG markup), shared by
 * the map badge below and the panel's type picker. */
export const OBJECTIVE_GLYPHS: Record<ObjectiveType, string> = {
  // crosshair
  hvt:
    `<circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.4" fill="none"/>` +
    `<path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  // shield-check
  clear:
    `<path d="M8 1.5 L13 3.5 V7.5 C13 11 10.7 13.4 8 14.5 C5.3 13.4 3 11 3 7.5 V3.5 Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/>` +
    `<path d="M5.8 8 L7.4 9.6 L10.2 6.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  // flag
  reach:
    `<path d="M3.5 14.5 V2.2 M3.5 2.4 C5 1.4 6.5 1.4 8 2.4 C9.5 3.4 11 3.4 12.5 2.4 V8.6 C11 9.6 9.5 9.6 8 8.6 C6.5 7.6 5 7.6 3.5 8.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  // bomb with sparking fuse
  destroy:
    `<circle cx="7" cy="10" r="4.5" stroke="currentColor" stroke-width="1.4" fill="none"/>` +
    `<path d="M10.2 6.8 L12.4 4.6 M12.4 4.6 L11.4 2.4 M12.4 4.6 L14.6 5.6 M12.4 4.6 L14.2 2.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>`,
  // steering wheel
  deliver:
    `<circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4" fill="none"/>` +
    `<circle cx="8" cy="8" r="1.6" stroke="currentColor" stroke-width="1.2" fill="none"/>` +
    `<path d="M8 9.6 V13.5 M6.6 7.2 L3 5.8 M9.4 7.2 L13 5.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
};

/** Small checkered-flag badge for a deliver objective's delivery point.
 * Same accent family as the objective badge; draggable in both views. */
export function deliveryBadgeHtml(selected: boolean): string {
  const halo = selected
    ? `<div style="position:absolute;inset:-5px;border:2px solid #f4db50;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,0.4),0 0 12px rgba(244,219,80,0.6);"></div>`
    : "";
  const flag =
    `<svg width="12" height="12" viewBox="0 0 16 16">` +
    `<path d="M4 14.5 V2 H12.5 V9 H4" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
    `<path d="M4 2 H8.25 V5.5 H4 Z M8.25 5.5 H12.5 V9 H8.25 Z" fill="#fff"/>` +
    `</svg>`;
  return `<div style="position:relative;width:22px;height:22px;">${halo}<div style="width:22px;height:22px;border-radius:50%;background:${OBJECTIVE_COLOR};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;cursor:move;">${flag}</div></div>`;
}

/** Round badge at an objective's position: accent disc + white type glyph.
 * Selection adds the standard yellow halo ring. Draggable in both views. */
export function objectiveBadgeHtml(type: ObjectiveType, selected: boolean, freshDrop = false): string {
  const halo = selected
    ? `<div style="position:absolute;inset:-6px;border:2px solid #f4db50;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,0.4),0 0 12px rgba(244,219,80,0.6);"></div>`
    : "";
  const drop = freshDrop ? "animation:mbDrop 0.4s cubic-bezier(0.22,1,0.36,1);" : "";
  return `<div style="position:relative;width:28px;height:28px;${drop}">${halo}<div style="width:28px;height:28px;border-radius:50%;background:${OBJECTIVE_COLOR};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;cursor:move;color:#fff;"><svg width="15" height="15" viewBox="0 0 16 16">${OBJECTIVE_GLYPHS[type]}</svg></div></div>`;
}

/** Small square chip at a sector's center — the 3D view's select/move handle
 * (2D uses the outline stroke instead). */
export function sectorChipHtml(kind: "ao" | "objective", selected: boolean): string {
  const color = selected ? "#ffcc00" : kind === "ao" ? "#000000" : "#9f2828";
  return `<div style="width:12px;height:12px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.6);cursor:move;"></div>`;
}

/** Double expanding ring for placement pings (mbPing keyframes in globals.css). */
export function pingHtml(color: string): string {
  const ring = (delay: string) =>
    `<div style="position:absolute;inset:0;border:2px solid ${color};border-radius:50%;animation:mbPing 0.7s ease-out ${delay} both;"></div>`;
  return `<div style="position:relative;width:44px;height:44px;">${ring("0s")}${ring("0.15s")}</div>`;
}
