/**
 * Mission thumbnail compositing.
 *
 * The generated addon ships one image used for all three mission-header
 * fields (m_sIcon / m_sLoadingScreen / m_sPreviewImage). It's built here in
 * the browser as: user photo (cover-fitted) -> TS template overlay (logo,
 * "Operation", dark gradient) -> mission name in Roboto Slab Bold.
 *
 * Geometry is measured from the shipped template + a finished reference
 * thumbnail (Operation Long Echoes), so generated images line up with
 * hand-made ones exactly:
 *   template "Operation"  ink x 154..523, y 806..883
 *   mission name          ink x 154, cap-top 932, descender-bottom 1070
 *
 * At 143px the reference resolves to a baseline of 1041 (its ink top of 932
 * is the ASCENDER of the "h" in "Echoes" at 109px, not the 102px cap height —
 * anchoring to caps sits every name with an ascender 7px high). The baseline
 * is string-independent, so names shrink and grow around a fixed line.
 * Horizontally we cancel the first glyph's side bearing so the name's INK
 * lines up with the template's "Operation" ink rather than its origin.
 */

export const THUMB_W = 1920;
export const THUMB_H = 1200;

const TEMPLATE_URL = "/thumbnail-template.png";

/** Mission-name type block (see module doc for where these come from).
 *  The reference art measures 143.91pt; 140 is the chosen house size. */
const NAME_INK_X = 154;
const NAME_BASELINE = 1041;
const NAME_SIZE = 140;
/** Keep a right margin roughly matching the left inset. */
const NAME_MAX_W = THUMB_W - NAME_INK_X - 120;
/** Long names shrink rather than overflow; below this they'd read as a caption. */
const NAME_MIN_SIZE = 70;

/** Stored source photos are re-encoded to JPEG so a mission still fits in
 *  localStorage (and in the .json handoff) — a 1920x1200 PNG would not. */
const SOURCE_QUALITY = 0.85;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

let templatePromise: Promise<HTMLImageElement> | null = null;
function template(): Promise<HTMLImageElement> {
  if (!templatePromise) templatePromise = loadImage(TEMPLATE_URL);
  return templatePromise;
}

function canvas2d(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser.");
  return { c, ctx };
}

/** Draw `img` so it fills w x h without distortion, centred (CSS object-fit: cover). */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

/**
 * Normalize a user upload for storage: cover-fit to the thumbnail frame and
 * re-encode as JPEG. Returns a data URL to keep in mission state.
 */
export async function prepareThumbnailSource(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const { c, ctx } = canvas2d(THUMB_W, THUMB_H);
    drawCover(ctx, img, THUMB_W, THUMB_H);
    return c.toDataURL("image/jpeg", SOURCE_QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The template already prints "Operation", so don't repeat it. */
export function thumbnailNameText(displayName: string): string {
  return displayName.trim().replace(/^operation\s+/i, "").trim();
}

/** Resolve the Roboto Slab family that next/font generated for this build. */
function slabFamily(): string {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-roboto-slab")
    .trim();
  return v || '"Roboto Slab", serif';
}

/**
 * Render the finished thumbnail. `source` is a data URL from
 * prepareThumbnailSource (null renders template + text over black).
 */
export async function renderThumbnail(
  source: string | null,
  displayName: string
): Promise<HTMLCanvasElement> {
  const { c, ctx } = canvas2d(THUMB_W, THUMB_H);

  // Black base so a missing/transparent photo still yields an opaque image
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, THUMB_W, THUMB_H);

  if (source) {
    const photo = await loadImage(source);
    drawCover(ctx, photo, THUMB_W, THUMB_H);
  }

  ctx.drawImage(await template(), 0, 0, THUMB_W, THUMB_H);

  const text = thumbnailNameText(displayName);
  if (text) {
    const family = slabFamily();
    // Canvas silently substitutes a fallback for a font that hasn't loaded
    try {
      await document.fonts.load(`700 ${NAME_SIZE}px ${family}`, text);
    } catch {
      // font loading unsupported/blocked — fall through and draw anyway
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    let size = NAME_SIZE;
    ctx.font = `700 ${size}px ${family}`;
    // Shrink to fit rather than run off the frame
    while (ctx.measureText(text).width > NAME_MAX_W && size > NAME_MIN_SIZE) {
      size -= 2;
      ctx.font = `700 ${size}px ${family}`;
    }

    // actualBoundingBoxLeft is negative when the ink starts right of the
    // origin (the usual case) — adding it cancels the side bearing.
    const m = ctx.measureText(text);
    const lead = Number.isFinite(m.actualBoundingBoxLeft) ? m.actualBoundingBoxLeft : 0;

    ctx.fillStyle = "#fff";
    ctx.fillText(text, NAME_INK_X + lead, NAME_BASELINE);
  }

  return c;
}

/** Composited pixels, ready for encodeEdds. */
export async function thumbnailPixels(source: string | null, displayName: string) {
  const c = await renderThumbnail(source, displayName);
  const ctx = c.getContext("2d")!;
  return {
    width: THUMB_W,
    height: THUMB_H,
    rgba: ctx.getImageData(0, 0, THUMB_W, THUMB_H).data,
  };
}

function canvasToBlob(c: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode the image."))), type, quality)
  );
}

/** PNG bytes of the composite — shipped next to the .edds as its import source. */
export async function thumbnailPngBytes(source: string | null, displayName: string) {
  const c = await renderThumbnail(source, displayName);
  const blob = await canvasToBlob(c, "image/png");
  return new Uint8Array(await blob.arrayBuffer());
}

/** Small preview for the UI (object URL — caller revokes). */
export async function thumbnailPreviewUrl(source: string | null, displayName: string) {
  const c = await renderThumbnail(source, displayName);
  return URL.createObjectURL(await canvasToBlob(c, "image/jpeg", 0.9));
}
