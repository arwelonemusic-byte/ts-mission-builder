# Slice arsenal-crate screenshots into per-item thumbnails for the Arsenal
# Builder (web/public/icons/items/<prefab-basename>.png).
#
# Input: screenshots of the TS_WebSpikeThumbs crate pages (node generate.mjs
# --thumbs puts ALL ARSENAL_POOL items in the crate in pool order, variants
# forced flat), cropped to the item grid, filenames sorting in capture order,
# pages captured WITHOUT overlap (identical-looking adjacent items make
# content-based dedupe unsound — two "ART II Scope" entries render
# pixel-identically).
#
# The crate UI is a masonry grid on a ~92px cell pitch: tiles span 1x1 up to
# 2x3 cells, separated by light-gray gutters (~RGB 79,76,74). Ground truth
# established 2026-08-12 (see CLAUDE.md):
#  - Items with m_eItemType HELICOPTER or VEHICLE (rocket pods, heli rockets,
#    25mm M242 vehicle ammo boxes) are NOT displayed by the crate at all
#    (HIDDEN_TYPES below) — they keep the glyph fallback in the web UI.
#  - The packer is mostly forward-only: cells it can't fill before a bigger
#    tile stay EMPTY (pure-background tiles = spacers, skipped here), and
#    occasionally it places a small item AHEAD of a bigger earlier one
#    (local reorder) — fixed via ORDER_FIXUPS below after visual audit.
#
# Pipeline: gutter mask -> connected components -> tile rects -> spacer
# detection (content energy) -> row-major order -> sequential assignment to
# the displayed pool -> ORDER_FIXUPS -> thumbnails.
#
#   python generator/tools/slice-thumbnails.py                 # vanilla, preview only
#   python generator/tools/slice-thumbnails.py --write         # vanilla, write thumbs
#   python generator/tools/slice-thumbnails.py --pool uk       # UK pool (shots in
#                                                              # input/thumb-shots-uk)
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
POOL_KEY = sys.argv[sys.argv.index("--pool") + 1] if "--pool" in sys.argv else "vanilla"
# Optional "cats" restricts the displayed expectation to those pool categories
# (chunked captures: a 793-item single capture drifted invisibly — small
# per-category crates via `generate.mjs --thumbs-rhs-afrf --cats=...` are
# auditable; weapons kept their verified full-capture thumbs).
POOLS = {
    "vanilla": {"mjs": "arsenal-pool.mjs", "shots": "Vanilla"},
    "uk": {"mjs": "arsenal-pool-uk.mjs", "shots": "British Forces"},
    "rhs-afrf": {"mjs": "arsenal-pool-rhs-afrf.mjs", "shots": "RHS AFRF"},
    "rhs-afrf-ammo": {"mjs": "arsenal-pool-rhs-afrf.mjs", "shots": "RHS AFRF Ammo",
                      "cats": ["Ammunition", "Throwable and Explosives", "Weapon Attachments"]},
    "rhs-afrf-equip": {"mjs": "arsenal-pool-rhs-afrf.mjs", "shots": "RHS AFRF Equipment",
                       "cats": ["Equipment", "Other"]},
    "rhs-afrf-vests": {"mjs": "arsenal-pool-rhs-afrf.mjs", "shots": "RHS AFRF Vests",
                       "cats": ["Backpacks and Vests"]},
    "rhs-afrf-clothing": {"mjs": "arsenal-pool-rhs-afrf.mjs", "shots": "RHS AFRF Clothing",
                          "cats": ["Clothing"]},
}
SHOTS_DIR = ROOT / "input" / "thumb-shots" / POOLS[POOL_KEY]["shots"]
POOL_MJS = ROOT / "generator" / POOLS[POOL_KEY]["mjs"]
ICONS_DIR = ROOT / "web" / "public" / "icons" / "items"
OUT_DIR = SHOTS_DIR / "_preview"

GUTTER_RGB = np.array([79, 76, 74])
GUTTER_TOL = 14
MIN_TILE = 60          # px; anything smaller is inter-tile lattice
# Tiles fill their bbox ~0.84-1.0 (item renders whose colors match the gutter
# gray punch holes in the component — e.g. the FIA Medical Bag at 0.84);
# lattice/background pieces sit at 0.03-0.06. 0.5 splits with huge margin.
MIN_FILL = 0.5
CELL_PITCH = 92
THUMB_W, THUMB_H = 160, 120
# blank spacer cells: pure background gradient, no item render
BLANK_STD, BLANK_P99 = 6.0, 90

# Item types the crate UI never displays. The harvester now excludes these
# from the pool entirely (EXCLUDED_TYPES there), so this is a no-op safety
# net kept in case the pool ever carries them again.
HIDDEN_TYPES = {"HELICOPTER", "VEHICLE"}

# Individual items (prefab basenames) the crate refuses to display even though
# they're regular pool entries — no tile, no thumbnail (glyph fallback in the
# web UI). Found empirically: the capture comes up short and the labels drift
# by one from the item's slot onward.
HIDDEN_REFS: dict[str, set[str]] = {
    "vanilla": set(),
    # Combat Body Armour: regular pool entry, never tiles in the crate (first
    # misdiagnosed as the Smock Hood — the hood DOES display, as a hooded-
    # garment render at the end of the accessories run).
    "uk": {"Vest_CBA"},
    # DRIFT-SUSPECT FULL CAPTURE — do NOT --write this pool key again: the
    # 793-item capture drifted invisibly (clothing/equipment regions were
    # wrong; the true never-tiling items were the VKPO "Pick up" undershirts,
    # since excluded from the pool at harvest). Clothing thumbs are now
    # tooltip-sourced (tooltip-thumbs.py); remaining regions get chunked
    # recaptures (rhs-afrf-* keys below).
    "rhs-afrf": set(),
}

# Local packing reorders (a 1x1 item back-filled AHEAD of a run of bigger
# tiles): tile-position -> displayed-pool index it actually shows. Identity
# where absent. Per pool, filled from the visual audit of the ov3-*.png
# overlays; geometry-dependent, so re-audit after any re-capture.
ALL_FIXUPS: dict[str, dict[int, int]] = {
    "vanilla": {  # audited 2026-08-12
        # US: bandage (1x1) before the four 81mm mortar shells
        90: 94, 91: 90, 92: 91, 93: 92, 94: 93,
        # US: mortar ballistic manual (1x2) before the resupply satchel
        109: 110, 110: 109,
        # US: personal belongings before the three boots
        157: 160, 158: 157, 159: 158, 160: 159,
        # USSR: personal belongings before the combat boots
        314: 315, 315: 314,
        # FIA: burlap sandbag before the 2B14 mortar parts + 6T5 tripod
        319: 323, 320: 319, 321: 320, 322: 321, 323: 322,
        # FIA: personal belongings before the combat boots
        354: 355, 355: 354,
    },
    "rhs-afrf": {  # audited 2026-08-13
        # wool gloves (1x1) back-filled into the undisplayed 6M2's slot, ahead
        # of the 6M2-1/earmuff/balaclava/6B49 run
        775: 786,
        **{p: p - 1 for p in range(776, 787)},
    },
    "uk": {  # audited 2026-08-12 (user-spotted the sandbag/bandage window)
        # burlap sandbag (1x1) back-filled ahead of the PASGT/BDU/M2HB/mortar
        # wide-tile run (into the gap left by the undisplayed Vest_CBA)
        96: 109,
        **{p: p - 1 for p in range(97, 110)},
        # blasting machine + mortar manual (1x1) before the resupply satchel
        127: 128, 128: 129, 129: 127,
        # L2A2 grenade (1x1) before the 81mm mortar ammo carrier
        130: 131, 131: 130,
        # personal belongings (1x1) before the Hayrick charge + 4 mortar bombs
        143: 148, 144: 143, 145: 144, 146: 145, 147: 146, 148: 147,
    },
}
ORDER_FIXUPS = ALL_FIXUPS.get(POOL_KEY, {})


def parse_pool():
    items = []
    for line in POOL_MJS.read_text(encoding="utf-8").splitlines():
        m = re.match(r'\s*\{ ref: "(\{[A-F0-9]+\}([^"]+))", name: "((?:[^"\\]|\\.)*)"', line)
        if not m:
            continue
        ty = re.search(r'type: "([A-Z_]*)"', line)
        cat = re.search(r'category: "((?:[^"\\]|\\.)*)"', line)
        items.append({
            "ref": m.group(1),
            "base": m.group(2).split("/")[-1].removesuffix(".et"),
            "name": m.group(3),
            "type": ty.group(1) if ty else "",
            "category": cat.group(1) if cat else "",
        })
    return items


def detect_tiles(img):
    rgb = np.asarray(img.convert("RGB")).astype(int)
    h, w, _ = rgb.shape
    gutter = (np.abs(rgb - GUTTER_RGB) < GUTTER_TOL).all(axis=2)
    labels, _ = ndimage.label(~gutter)
    tiles = []
    for idx, sl in enumerate(ndimage.find_objects(labels), start=1):
        y0, y1 = sl[0].start, sl[0].stop - 1
        x0, x1 = sl[1].start, sl[1].stop - 1
        if y1 - y0 + 1 < MIN_TILE or x1 - x0 + 1 < MIN_TILE:
            continue
        if (labels[sl] == idx).mean() < MIN_FILL:
            continue
        clipped = y0 <= 0 or y1 >= h - 1 or x0 <= 0 or x1 >= w - 1
        tiles.append({"rect": (x0, y0, x1, y1), "clipped": clipped})
    return tiles


def tile_metrics(img, rect):
    x0, y0, x1, y1 = rect
    m = 8
    crop = np.asarray(img.convert("L")).astype(float)[y0 + m : y1 - m, x0 + m : x1 - m]
    if crop.size == 0:
        return 0.0, 0.0
    return float(crop.std()), float(np.percentile(crop, 99))


def crop_norm(img, rect):
    """Tile crop scaled onto a uniform 4:3 canvas (tile background color)."""
    x0, y0, x1, y1 = rect
    crop = img.convert("RGB").crop((x0, y0, x1 + 1, y1 + 1))
    scale = min(THUMB_W / crop.width, THUMB_H / crop.height)
    rs = crop.resize((max(1, int(crop.width * scale)), max(1, int(crop.height * scale))), Image.LANCZOS)
    px = np.asarray(crop)
    bg = tuple(int(v) for v in np.median(px[2:6, 2:6].reshape(-1, 3), axis=0))
    canvas = Image.new("RGB", (THUMB_W, THUMB_H), bg)
    canvas.paste(rs, ((THUMB_W - rs.width) // 2, (THUMB_H - rs.height) // 2))
    return canvas


def main():
    write = "--write" in sys.argv
    pool = parse_pool()
    cats = POOLS[POOL_KEY].get("cats")
    if cats:
        pool = [i for i in pool if i["category"] in cats]
    hidden_refs = HIDDEN_REFS.get(POOL_KEY, set())
    displayed = [i for i in pool if i["type"] not in HIDDEN_TYPES and i["base"] not in hidden_refs]
    hidden = [i for i in pool if i["type"] in HIDDEN_TYPES or i["base"] in hidden_refs]
    print(f"pool {len(pool)} = displayed {len(displayed)} + hidden {len(hidden)} ({HIDDEN_TYPES})")
    OUT_DIR.mkdir(exist_ok=True)

    # Detect all tiles, reading order, no dedupe
    stream = []  # (shot Image, rect, blank)
    n_spacers = 0
    for path in sorted(SHOTS_DIR.glob("*.png")):
        img = Image.open(path)
        tiles = [t for t in detect_tiles(img) if not t["clipped"]]
        xs = [t["rect"][0] for t in tiles]
        ys = [t["rect"][1] for t in tiles]
        for t in tiles:
            x0, y0, x1, y1 = t["rect"]
            t["col"] = round((x0 - min(xs)) / CELL_PITCH)
            t["row"] = round((y0 - min(ys)) / CELL_PITCH)
            std, p99 = tile_metrics(img, t["rect"])
            t["blank"] = std < BLANK_STD and p99 < BLANK_P99
        tiles.sort(key=lambda t: (t["row"], t["col"]))
        for t in tiles:
            if t["blank"]:
                n_spacers += 1
            else:
                stream.append({"img": img, "rect": t["rect"], "shot": path.name})
        # overlay for auditing
        over = img.convert("RGB")
        d = ImageDraw.Draw(over)
        base_idx = len(stream) - len([t for t in tiles if not t["blank"]])
        k = base_idx
        for t in tiles:
            x0, y0, x1, y1 = t["rect"]
            if t["blank"]:
                lab, col = "SPACER", (120, 255, 140)
            else:
                lab = f"{k}:{displayed[k]['name'][:24]}" if k < len(displayed) else "PAST-END"
                col = (255, 230, 120)
                k += 1
            d.rectangle([x0, y0, x1, y1], outline=(255, 210, 60))
            d.text((x0 + 3, y0 + 2), lab, fill=col)
        over.save(OUT_DIR / ("ov3-" + path.name.replace("Screenshot 2026-08-12 ", "")))

    print(f"item tiles: {len(stream)}, spacers: {n_spacers}, expected: {len(displayed)}")
    if len(stream) != len(displayed):
        print("MISMATCH — audit the ov3-*.png overlays before trusting any of this")

    assert sorted(ORDER_FIXUPS.keys()) == sorted(ORDER_FIXUPS.values()), "fixups must permute"

    if write:
        ICONS_DIR.mkdir(parents=True, exist_ok=True)
        n = min(len(stream), len(displayed))
        for p in range(n):
            t = stream[p]
            target = displayed[ORDER_FIXUPS.get(p, p)]
            crop_norm(t["img"], t["rect"]).save(ICONS_DIR / f"{target['base']}.png")
        print(f"wrote {n} thumbnails -> {ICONS_DIR}")
        print(f"no thumbnails (hidden in crate): {[i['base'] for i in hidden]}")


if __name__ == "__main__":
    main()
