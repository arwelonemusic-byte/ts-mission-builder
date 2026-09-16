# Slice per-item TOOLTIP captures into arsenal thumbnails.
#
# Capture format (one screenshot per item, hovered so the name tooltip shows):
# the item tile sits at the TOP-LEFT corner (capture may extend right into the
# neighboring tile — cropped away here), the tooltip with the item's name is
# the dark band underneath. Name-anchored and order-independent — immune to
# every packing/drift failure mode of full-page captures.
#
# Workflow:
#   1. python generator/tools/tooltip-thumbs.py --dir "input/thumb-shots/<X>"
#      -> writes _review/sheet-NN.png contact sheets: [index | thumb | tooltip]
#   2. Claude reads the sheets, matches tooltip names against the pool, writes
#      the mapping file _review/mapping.py: {"<screenshot filename>": "<prefab
#      basename>", ...}
#   3. python generator/tools/tooltip-thumbs.py --dir "..." --write
#      -> applies mapping.py, writes web/public/icons/items/<basename>.png
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
ICONS_DIR = ROOT / "web" / "public" / "icons" / "items"

GUTTER_RGB = np.array([79, 76, 74])
GUTTER_TOL = 14
THUMB_W, THUMB_H = 160, 120


def tile_box(img, name):
    """Auto-captured shots (auto-hover-capture.py) encode the exact tile
    geometry in the filename (-w<W>h<H>, tile at 6,6) — use it verbatim.
    Manual shots fall back to the crop_tile heuristic."""
    m = re.search(r"-w(\d+)h(\d+)", name)
    if m:
        tw, th = int(m.group(1)), int(m.group(2))
        if name.startswith("wcs-"):
            return wcs_tile_box(img, tw)
        if name.startswith("ts-"):
            # TS Capture Arsenal UI (ts-arsenal-capture.py): the WHOLE black
            # square incl. the top-left name, inset 2 px against edge bleed
            return (8, 8, min(img.width, 6 + tw - 2), min(img.height, 6 + th - 2))
        return (6, 6, min(img.width, 6 + tw), min(img.height, 6 + th))
    return crop_tile(img)


def fits(name):
    """Shots whose thumb is content-fitted rather than letterboxed whole."""
    return name.startswith("wcs-") or name.startswith("ts-")


def wcs_tile_box(img, tw):
    """WCS Arsenal shots (wcs-arsenal-capture.py) hold the WHOLE tile at (6,6)
    with the item name printed in a band at its bottom. The thumb keeps the
    name text (user decision 2026-09-16) -> box = the full tile, inset 3 px so
    the gray/yellow frame never enters the thumb; content_fit then frames
    item + label together."""
    return (9, 9, 6 + tw - 3, img.height - 9)


def wcs_band_top(img, tw):
    """Top of the name band inside a WCS tile (for the review sheet's name
    strip): a flat strip ~8-10 lum darker than the image area; walk up from
    the rows above the bottom frame while the row median stays within 3."""
    a = np.asarray(img.convert("RGB")).astype(int)
    tile_bottom = img.height - 6
    lum = a[6:tile_bottom, 6 : 6 + tw].mean(axis=2)
    th = lum.shape[0]
    med = np.array([np.median(lum[y]) for y in range(th)])
    ref = np.median(med[th - 12 : th - 6])
    y = th - 7
    while y > th * 0.6 and abs(med[y] - ref) <= 3:
        y -= 1
    top = y + 1
    if top > th * 0.95 or top < th * 0.6:
        top = int(th * 0.85)
    return 6 + top


def crop_tile(img):
    """Tile = the connected non-gutter component nearest the top-left corner
    (≥60px both ways). Clipped capture edges are fine — the tooltip band below
    and the neighbor sliver right are separate components."""
    from scipy import ndimage

    rgb = np.asarray(img.convert("RGB")).astype(int)
    gutter = (np.abs(rgb - GUTTER_RGB) < GUTTER_TOL).all(axis=2)
    labels, _ = ndimage.label(~gutter)
    best = None
    for idx, sl in enumerate(ndimage.find_objects(labels), start=1):
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        if y1 - y0 < 60 or x1 - x0 < 60:
            continue
        if (labels[sl] == idx).mean() < 0.3:
            continue
        d = x0 + y0  # distance from the top-left corner
        if best is None or d < best[0]:
            best = (d, (x0, y0, x1, y1))
    if not best:
        return (0, 0, img.width, img.height)
    x0, y0, x1, y1 = best[1]
    # The tile can merge with the bright end-of-grid background (or the
    # tooltip band) through breaks in the gutter line — trim the bbox at the
    # first uniform non-tile column/row: gutter-gray, bright background, or
    # tooltip-dark. Tile interiors are dark with content.
    lum = rgb.mean(axis=2)
    for x in range(x0 + 60, x1):
        col_g = gutter[y0:y1, x].mean() > 0.85
        col_bright = lum[y0:y1, x].mean() > 95 and lum[y0:y1, x].std() < 18
        if col_g or col_bright:
            x1 = x
            break
    for y in range(y0 + 60, y1):
        row = lum[y, x0:x1]
        row_g = gutter[y, x0:x1].mean() > 0.85
        row_dark = row.mean() < 45 and row.std() < 12
        row_bright = row.mean() > 95 and row.std() < 18
        if row_g or row_dark or row_bright:
            y1 = y
            break
    return (x0, y0, x1, y1)


def content_fit(crop):
    """WCS Arsenal tiles (wcs-arsenal-capture.py): the image area is a wide
    362x150 strip with the item centred on a dark gradient — letterboxing it
    into 160x120 leaves a 66 px sliver. Crop to the item's own bounding box
    (pixels that differ from the tile's corner colour) plus a margin, kept at
    least 4:3 so small items don't blow up beyond the vanilla look."""
    px = np.asarray(crop).astype(int)
    bg = np.median(px[2:8, 2:8].reshape(-1, 3), axis=0)
    diff = np.abs(px - bg).sum(axis=2) > 45
    ys, xs = np.where(diff)
    if len(xs) < 50:
        return crop
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    cw, ch = x1 - x0, y1 - y0
    # expand to 4:3 around the content, with a 6 % margin, clamped to the tile
    tw = max(cw * 1.12, ch * 1.12 * 4 / 3, crop.width * 0.45)
    th = tw * 3 / 4
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    bx0 = int(max(0, min(crop.width - tw, cx - tw / 2)))
    by0 = int(max(0, min(crop.height - th, cy - th / 2)))
    return crop.crop((bx0, by0, int(min(crop.width, bx0 + tw)), int(min(crop.height, by0 + th))))


def norm_thumb(img, box, fit=False):
    crop = img.convert("RGB").crop(box)
    if fit:
        crop = content_fit(crop)
    scale = min(THUMB_W / crop.width, THUMB_H / crop.height)
    rs = crop.resize((max(1, int(crop.width * scale)), max(1, int(crop.height * scale))), Image.LANCZOS)
    px = np.asarray(crop)
    bg = tuple(int(v) for v in np.median(px[2:6, 2:6].reshape(-1, 3), axis=0))
    canvas = Image.new("RGB", (THUMB_W, THUMB_H), bg)
    canvas.paste(rs, ((THUMB_W - rs.width) // 2, (THUMB_H - rs.height) // 2))
    return canvas


def main():
    if "--dir" not in sys.argv:
        print("usage: tooltip-thumbs.py --dir <shots dir> [--write]")
        sys.exit(1)
    shots_dir = Path(sys.argv[sys.argv.index("--dir") + 1])
    write = "--write" in sys.argv
    review = shots_dir / "_review"
    review.mkdir(exist_ok=True)
    shots = sorted(p for p in shots_dir.glob("*.png"))

    if write:
        ns = {}
        exec((review / "mapping.py").read_text(encoding="utf-8"), ns)
        mapping = ns["MAPPING"]
        n = 0
        for p in shots:
            base = mapping.get(p.name)
            if not base:
                print(f"unmapped, skipped: {p.name}")
                continue
            img = Image.open(p)
            norm_thumb(img, tile_box(img, p.name), fit=fits(p.name)).save(ICONS_DIR / f"{base}.png")
            n += 1
        print(f"wrote {n} thumbnails -> {ICONS_DIR}")
        return

    # review sheets: index + cropped thumb + tooltip band (full width, bottom)
    per_sheet = 12
    for s in range(0, len(shots), per_sheet):
        chunk = shots[s : s + per_sheet]
        row_h = THUMB_H + 8
        sheet = Image.new("RGB", (720, row_h * len(chunk)), (24, 26, 28))
        d = ImageDraw.Draw(sheet)
        for i, p in enumerate(chunk):
            img = Image.open(p)
            box = tile_box(img, p.name)
            y = i * row_h
            sheet.paste(norm_thumb(img, box, fit=fits(p.name)), (40, y + 4))
            # tooltip band: below the tile, full capture width (WCS tiles: the
            # in-tile name band, since the thumb box spans the whole tile; TS
            # capture tiles: the top strip where the name is printed)
            band_top = box[3]
            band_bottom = img.height
            if p.name.startswith("wcs-"):
                m = re.search(r"-w(\d+)h", p.name)
                band_top = wcs_band_top(img, int(m.group(1))) if m else box[3]
            elif p.name.startswith("ts-"):
                band_top = box[1]
                band_bottom = box[1] + max(24, int((box[3] - box[1]) * 0.18))
            band = img.convert("RGB").crop((0, band_top, img.width, band_bottom))
            if band.height > 0:
                scale = min(480 / band.width, (row_h - 8) / band.height, 1.5)
                band = band.resize((max(1, int(band.width * scale)), max(1, int(band.height * scale))))
                sheet.paste(band, (220, y + 4))
            d.text((4, y + 4), f"{s + i}", fill=(240, 240, 120))
            d.text((4, y + 18), p.name.replace("Screenshot 2026-", "")[:14], fill=(150, 150, 150))
        sheet.save(review / f"sheet-{s // per_sheet:02d}.png")
    print(f"{len(shots)} shots -> {review} (sheet-*.png); write _review/mapping.py then re-run with --write")


if __name__ == "__main__":
    main()
