# Per-page tile capture for the WCS Arsenal crate UI (feeds tooltip-thumbs.py).
#
# The "WCS Arsenal" mod replaces the vanilla crate grid with LARGE bordered
# tiles (at 3840x1600: weapons 2 columns x 4 rows of ~362x178 px, small items
# 4 columns of half-width cells) that carry
# the item NAME in a dark band at the bottom of the cell — so there is nothing
# to hover for: one screenshot per page, slice the tiles, done. The band below
# the image area plays the role of the vanilla tooltip in the review sheets
# (some items ship no name -> empty band -> map by ordinal + render).
#
# Calibrated 2026-09-16 (Workbench play mode, Bundeswehr thumbs spike):
#  - panel = left third of the screen; tiles have a 1 px light border
#    (flat lum 69; the translucent gutters reach ~66), 6 px gutters between tiles
#  - page indicator "N / M" sits under the grid; Q/E flip pages while the
#    cursor hovers the grid (same as vanilla)
#  - hovering a tile pops a hint window -> the page is grabbed with the
#    cursor parked OFF the grid, then a tile is hovered only to press E
#  - the crate does NOT display the mod's rank-patch items (custom
#    BWAR_PATCHES type): 22 pages x 8 = 176 = 219 pool items - 43 patches
#
# Shot format = tooltip-thumbs.py's auto format: image area at (6,6) with its
# size in the filename (-w<W>h<H>), name band below. `wcs-` prefix makes
# tooltip-thumbs.py content-fit the thumb (the wide 362x150 image area would
# otherwise shrink to a 160x66 strip).
#
#   python generator/tools/wcs-arsenal-capture.py --dir "input/thumb-shots/Bundeswehr" --probe-image shot.png
#   python generator/tools/wcs-arsenal-capture.py --dir "input/thumb-shots/Bundeswehr" --probe
#   python generator/tools/wcs-arsenal-capture.py --dir "input/thumb-shots/Bundeswehr" --pages 22
#
# Options: --start 5 (countdown s), --pages N (EXACT page count from "N / M"),
#          --region L,T,R,B (px; default = left 35% of the screen),
#          --mode abs|rel (cursor injection, see auto-hover-capture.py),
#          --no-deadman (don't abort when the cursor leaves the parked spot),
#          --deselect X,Y (click a player-inventory item after each page flip so
#          the first crate tile drops its selection + hint popup),
#          --save-pages (keep the raw page grabs in _debug/page-NN.png),
#          --from-pages <dir> (offline: slice tiles from saved page grabs).
import ctypes
import sys
import time
from ctypes import wintypes
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageGrab
from scipy import ndimage

def arg(name, default=None):
    if name in sys.argv:
        return sys.argv[sys.argv.index(name) + 1]
    return default

if "--dir" not in sys.argv:
    print("usage: wcs-arsenal-capture.py --dir <shots dir> [--probe | --probe-image <png> | --pages N]")
    sys.exit(1)

OUT_DIR = Path(arg("--dir"))
OUT_DIR.mkdir(parents=True, exist_ok=True)
DEBUG_DIR = OUT_DIR / "_debug"
DEBUG_DIR.mkdir(exist_ok=True)
START = float(arg("--start", "5"))
PAGES = int(arg("--pages", "40"))
MODE = arg("--mode", "abs")
PROBE = "--probe" in sys.argv
PROBE_IMAGE = arg("--probe-image")
REGION = tuple(int(v) for v in arg("--region").split(",")) if arg("--region") else None
# --deselect X,Y: after each page flip, click this screen point (an item in
# the player's inventory on the right) so the crate's first tile loses its
# selection and its hint popup (user suggestion 2026-09-16)
DESELECT = tuple(int(v) for v in arg("--deselect").split(",")) if arg("--deselect") else None

# ---- Win32 input (same as auto-hover-capture.py) ----------------------------
user32 = ctypes.windll.user32
user32.SetProcessDPIAware()

class MOUSEINPUT(ctypes.Structure):
    _fields_ = [("dx", wintypes.LONG), ("dy", wintypes.LONG), ("mouseData", wintypes.DWORD),
                ("dwFlags", wintypes.DWORD), ("time", wintypes.DWORD), ("dwExtraInfo", ctypes.c_size_t)]

class KEYBDINPUT(ctypes.Structure):
    _fields_ = [("wVk", wintypes.WORD), ("wScan", wintypes.WORD), ("dwFlags", wintypes.DWORD),
                ("time", wintypes.DWORD), ("dwExtraInfo", ctypes.c_size_t)]

class INPUT(ctypes.Structure):
    class _U(ctypes.Union):
        _fields_ = [("mi", MOUSEINPUT), ("ki", KEYBDINPUT)]
    _anonymous_ = ("u",)
    _fields_ = [("type", wintypes.DWORD), ("u", _U)]

MOVE, ABSOLUTE = 0x0001, 0x8000
KEY_SCANCODE, KEY_UP = 0x0008, 0x0002
SCAN_E, SCAN_Q = 0x12, 0x10

def send_mouse(flags, dx=0, dy=0):
    inp = INPUT(type=0)
    inp.mi = MOUSEINPUT(dx, dy, 0, flags, 0, 0)
    user32.SendInput(1, ctypes.byref(inp), ctypes.sizeof(INPUT))

LEFTDOWN, LEFTUP = 0x0002, 0x0004

def click(x, y):
    move_to(x, y)
    time.sleep(0.08)
    send_mouse(LEFTDOWN)
    time.sleep(0.06)
    send_mouse(LEFTUP)
    time.sleep(0.08)

def press_key(scan):
    for flags in (KEY_SCANCODE, KEY_SCANCODE | KEY_UP):
        inp = INPUT(type=1)
        inp.ki = KEYBDINPUT(0, scan, flags, 0, 0)
        user32.SendInput(1, ctypes.byref(inp), ctypes.sizeof(INPUT))
        time.sleep(0.05)

SW, SH = user32.GetSystemMetrics(0), user32.GetSystemMetrics(1)

def cursor_pos():
    pt = wintypes.POINT()
    user32.GetCursorPos(ctypes.byref(pt))
    return pt.x, pt.y

def move_to(x, y):
    if MODE == "abs":
        send_mouse(MOVE | ABSOLUTE, int(x * 65535 / (SW - 1)), int(y * 65535 / (SH - 1)))
    else:
        for _ in range(80):
            cx, cy = cursor_pos()
            ddx, ddy = x - cx, y - cy
            if abs(ddx) <= 1 and abs(ddy) <= 1:
                break
            send_mouse(MOVE, max(-40, min(40, ddx)), max(-40, min(40, ddy)))
            time.sleep(0.004)
    time.sleep(0.02)

# ---- tile detection ---------------------------------------------------------
# The crate is a 4 x 4 grid of ~181 x 178 px cells; an item spans 1x1 (mags,
# grenades, attachments, clothing), 2x1 (weapons) or 2x2 cells (vests, packs)
# and every item has its own frame: 1 px FLAT gray border lines (lum 69,
# unsaturated; the selected item swaps in a yellow frame). Two half-width items
# in one big cell are separated by a divider (flat line or lighter band).
#   frame (once, page 1 = weapons): the 2 big columns x 4 rows from luminance
#     profiles (a big-column line is flat gray over >= 35 % of the region
#     height, a row line over >= 85 % of the grid width); each big column is
#     halved into two cells (2 px divider slot in the middle).
#   per page: for every pair of adjacent cells, probe the boundary strip for a
#     light vertical/horizontal line spanning >= 90 % of it. No line = the
#     same item -> union the cells; each union's bbox is one tile. A weapon's
#     render never spans 90 % of the cell height at the exact middle, a 2x2
#     vest has no frame between its cells, so both footprints fall out.
BORDER_LUM = 69
MIN_TILE, MAX_TILE = 120, 740

def _lines(profile, thr, gap=3):
    idx = np.where(profile >= thr)[0]
    groups = []
    for i in idx:
        if not groups or i - groups[-1][-1] > gap:
            groups.append([i])
        else:
            groups[-1].append(i)
    return [int(round(np.mean(g))) for g in groups]

def _cells(lines):
    return [(a + 1, b) for a, b in zip(lines, lines[1:]) if MIN_TILE <= b - a <= MAX_TILE]

def _frame_mask(sub):
    lum = sub.mean(axis=2)
    r, g, b = sub[..., 0], sub[..., 1], sub[..., 2]
    flat = (np.abs(lum - BORDER_LUM) <= 5) & ((sub.max(axis=2) - sub.min(axis=2)) <= 10)
    yellow = (r > 140) & (g > 110) & (b < 120)
    return flat | yellow

def find_frame(img):
    """-> (col_cells, row_cells): 4 column cells (two halves per big column)
    and 4 row cells, absolute px. None when the grid isn't visible."""
    rgb = np.asarray(img.convert("RGB")).astype(int)
    h, w = rgb.shape[:2]
    rx0, ry0, rx1, ry1 = REGION if REGION else (0, 0, int(w * 0.35), h)
    line = _frame_mask(rgb[ry0:ry1, rx0:rx1])
    xs = [rx0 + x for x in _lines(line.mean(axis=0), 0.35)]
    big = []
    for c in _cells(xs):
        if big and c[0] - big[-1][1] < 5 and (c[1] - big[-1][0]) <= MAX_TILE:
            big[-1] = (big[-1][0], c[1])
        else:
            big.append(c)
    big = [c for c in big if c[1] - c[0] >= 300]
    if len(big) < 2:
        return None
    gx0, gx1 = big[0][0] - 1, big[-1][1]
    ys = [ry0 + y for y in _lines(line[:, gx0 - rx0 : gx1 - rx0].mean(axis=1), 0.85)]
    rows = _cells(ys)
    if len(rows) < 2:
        return None
    cols = []
    for x0, x1 in big:
        mid = (x0 + x1) // 2
        cols += [(x0, mid - 1), (mid + 2, x1)]
    return cols, rows

def _light(strip):
    lum = strip.mean(axis=2)
    r, g, b = strip[..., 0], strip[..., 1], strip[..., 2]
    return ((lum >= 45) & (lum <= 130)) | ((r > 140) & (g > 110) & (b < 120))

def _mid_divider(rgb, x0, y0, x1, y1):
    """Two half-width items in one big cell each have their OWN frame: the
    strip across the middle shows two flat-gray (69) frame lines ~7 px apart
    with the lit gutter between them (measured lum 54-88) and dark tile
    interior outside. Signature = a column that is flat-frame on >= 90 % of
    the rows with a dark tile interior 3 px to one side. A wide item's render
    (utility pouch, MG grip) is bright on BOTH sides of any line-like column."""
    strip = rgb[y0:y1, x0:x1]
    frame = _frame_mask(strip).mean(axis=0)
    med = np.median(strip.mean(axis=2), axis=0)
    for c in range(3, strip.shape[1] - 3):
        if frame[c] >= 0.9 and (med[c - 3] <= 45 or med[c + 3] <= 45):
            return True
    return False

def _row_gutter_line(rgb, x0, y0, x1, y1):
    """Frame lines in the gutter between two rows (flat gray / yellow) —
    present for separate items, absent inside a 2x2 item."""
    mask = _frame_mask(rgb[y0:y1, x0:x1])
    return (mask.mean(axis=1) >= 0.85).any()

def is_empty(cell):
    """Empty slots show a fine 90 px sub-grid over the (world-lit, so any
    brightness) panel — texture, not luminance, tells them apart: measured
    std 6.6-6.9 / <2 % pixels off the median for empty cells vs std >= 11.8
    and >= 5 % for the darkest filled cells (P8/MP7 magazines)."""
    lum = cell[6:-6, 6:-6].mean(axis=2)
    dev = (np.abs(lum - np.median(lum)) > 20).mean()
    return lum.std() < 9.5 or dev < 0.02

def find_tiles(img, frame=None):
    rgb = np.asarray(img.convert("RGB")).astype(int)
    frame = frame or find_frame(img)
    if not frame:
        return []
    cols, rows = frame
    nc, nr = len(cols), len(rows)
    parent = list(range(nc * nr))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i
    def union(a, b):
        parent[find(a)] = find(b)
    for ri, (y0, y1) in enumerate(rows):
        for ci, (x0, x1) in enumerate(cols):
            if ci + 1 < nc:  # boundary to the right
                nx0 = cols[ci + 1][0]
                # the 6 px gutter between the two BIG columns always separates
                # items (nothing spans it); the mid-cell slot needs the test
                if nx0 - x1 <= 4 and not _mid_divider(rgb, x1 - 7, y0 + 10, nx0 + 7, y1 - 10):
                    union(ri * nc + ci, ri * nc + ci + 1)
            if ri + 1 < nr:  # boundary below
                ny0 = rows[ri + 1][0]
                if not _row_gutter_line(rgb, x0 + 10, y1 - 3, x1 - 10, ny0 + 3):
                    union(ri * nc + ci, (ri + 1) * nc + ci)
    groups, filled = {}, {}
    for ri, (y0, y1) in enumerate(rows):
        for ci, (x0, x1) in enumerate(cols):
            k = find(ri * nc + ci)
            g = groups.setdefault(k, [x0, y0, x1, y1])
            g[0], g[1], g[2], g[3] = min(g[0], x0), min(g[1], y0), max(g[2], x1), max(g[3], y1)
            # empty slots have no frames, so adjacent empties merge into one
            # group — judge emptiness per CELL (world bleed makes a wide empty
            # block fail the texture test), keep the group if any cell is filled
            filled[k] = filled.get(k, False) or not is_empty(rgb[y0:y1, x0:x1])
    tiles = [tuple(g) for k, g in groups.items() if filled[k]]
    tiles.sort(key=lambda t: (round(t[1] / 90), t[0]))
    return tiles

def name_band_top(rgb_tile):
    """Bottom rows of a tile = the name band, a flat strip ~8-10 lum DARKER
    than the image area above it. Tiles differ in overall brightness (hover
    highlight / hint shading lift a whole tile by ~6), so the detection is
    RELATIVE: reference = the band rows just above the bottom frame line,
    walk up while a row's median stays within 3 of it. Fallback 85 %
    (measured 150/177 on the 3840x1600 layout)."""
    lum = rgb_tile.mean(axis=2)
    th = lum.shape[0]
    med = np.array([np.median(lum[y]) for y in range(th)])
    ref = np.median(med[th - 12 : th - 6])
    y = th - 7
    while y > th * 0.6 and abs(med[y] - ref) <= 3:
        y -= 1
    top = y + 1
    if top > th * 0.95 or top < th * 0.6:
        top = int(th * 0.85)
    return top

def overlay(img, tiles, name):
    dbg = img.convert("RGB").copy()
    d = ImageDraw.Draw(dbg)
    rgb = np.asarray(dbg).astype(int)
    for i, (x0, y0, x1, y1) in enumerate(tiles):
        bt = y0 + name_band_top(rgb[y0:y1, x0:x1])
        d.rectangle([x0, y0, x1 - 1, y1 - 1], outline=(255, 60, 60), width=2)
        d.line([x0, bt, x1, bt], fill=(60, 220, 255), width=2)
        d.text((x0 + 4, y0 + 3), str(i), fill=(255, 255, 100))
    dbg.save(DEBUG_DIR / name)

def save_tiles(img, tiles, page, shot_n):
    rgb = np.asarray(img.convert("RGB")).astype(int)
    for x0, y0, x1, y1 in tiles:
        bt = y0 + name_band_top(rgb[y0:y1, x0:x1])
        shot = img.crop((x0 - 6, y0 - 6, x1 + 6, y1 + 6))
        shot.save(OUT_DIR / f"wcs-p{page:02d}-t{shot_n:03d}-w{x1 - x0}h{bt - y0}.png")
        shot_n += 1
    return shot_n

# ---- main -------------------------------------------------------------------
def main():
    if arg("--from-pages"):
        # offline mode: slice tiles from raw page grabs saved by --save-pages
        # (page-NN.png in that dir) — iterate on detection without the game
        pages = sorted(Path(arg("--from-pages")).glob("page-*.png"))
        frame = find_frame(Image.open(pages[0])) if pages else None
        shot_n = 0
        for page, pp in enumerate(pages):
            img = Image.open(pp)
            tiles = find_tiles(img, frame)
            overlay(img, tiles, f"tiles-p{page:02d}.png")
            print(f"page {page}: {len(tiles)} tiles")
            shot_n = save_tiles(img, tiles, page, shot_n)
        print(f"{shot_n} shots -> {OUT_DIR}")
        return

    if PROBE_IMAGE:
        img = Image.open(PROBE_IMAGE)
        # --frame-from <png>: take the frame grid from another (clean) page grab
        frame = find_frame(Image.open(arg("--frame-from"))) if arg("--frame-from") else None
        tiles = find_tiles(img, frame)
        overlay(img, tiles, "probe-image.png")
        n = save_tiles(img, tiles, 99, 0) if "--save" in sys.argv else 0
        print(f"{len(tiles)} tiles: {tiles}\noverlay -> {DEBUG_DIR / 'probe-image.png'}; saved {n} sample shots")
        return

    print(f"Focus the game. Capturing in {START:.0f}s... (grab the mouse to abort)")
    time.sleep(START)
    # The frame is measured on PAGE 1 (weapons, 2 big columns) — the crate may
    # have been left on any page (last page = sparse 4-column patches), so
    # first find ANY grid line to hover, rewind with Q, then lock the frame.
    img = ImageGrab.grab()
    rgb = np.asarray(img.convert("RGB")).astype(int)
    h, w = rgb.shape[:2]
    rx0, ry0, rx1, ry1 = REGION if REGION else (0, 0, int(w * 0.35), h)
    line = _frame_mask(rgb[ry0:ry1, rx0:rx1])
    xs = [rx0 + x for x in _lines(line.mean(axis=0), 0.30)]
    ys = [ry0 + y for y in _lines(line.mean(axis=1), 0.10)]
    if len(xs) < 2 or len(ys) < 2:
        img.save(DEBUG_DIR / "start-fail.png")
        print("no crate grid on screen (see _debug/start-fail.png; is the arsenal open?)")
        return
    hover0 = ((xs[0] + xs[1]) // 2, (ys[0] + ys[1]) // 2)
    move_to(*hover0)
    time.sleep(0.2)
    for _ in range(max(0, PAGES - 1)):
        press_key(SCAN_Q)
        time.sleep(0.4)
    if DESELECT:
        click(*DESELECT)
    time.sleep(0.8)

    img = ImageGrab.grab()
    frame = find_frame(img)
    tiles = find_tiles(img, frame)
    if not tiles:
        overlay(img, tiles, "tiles-p00.png")
        print("no tiles found on page 1 (see _debug/tiles-p00.png; try --region)")
        return
    grid_cx = (min(t[0] for t in tiles) + max(t[2] for t in tiles)) // 2
    grid_bottom = max(t[3] for t in tiles)
    # park the cursor on the deselect point (player inventory) when given —
    # parking below the grid leaves the last-hovered tile highlighted (user-
    # observed); otherwise just below the grid
    park = DESELECT if DESELECT else (grid_cx, min(SH - 2, grid_bottom + 30))
    move_to(*park)
    time.sleep(0.8)

    # The FRAME (2 big columns x 4 rows) never moves within a session -> detect
    # it once; per page only the split test runs (weapons fill a big cell,
    # magazines/pouches/clothing come as PAIRS of half-width cells — found the
    # hard way 2026-09-16 when a plain cell cache sliced pairs as one tile).
    def tiles_on(img):
        return find_tiles(img, frame)

    shot_n = 0
    for page in range(PAGES):
        img = ImageGrab.grab()
        if "--save-pages" in sys.argv:
            img.save(DEBUG_DIR / f"page-{page:02d}.png")  # raw grab for offline re-slicing
        tiles = tiles_on(img)
        overlay(img, tiles, f"tiles-p{page:02d}.png")
        print(f"page {page}: {len(tiles)} tiles")
        if not tiles:
            break
        if PROBE:
            print("probe done — check _debug/tiles-p00.png outlines the real tiles and "
                  "the cyan line sits on top of each name band")
            return
        shot_n = save_tiles(img, tiles, page, shot_n)
        if page == PAGES - 1:
            break
        # dead-man switch: the user grabbing the mouse aborts the run. The
        # game may nudge the parked cursor a little (window clipping, hint
        # close) -> generous 200 px tolerance; --no-deadman disables it.
        cx, cy = cursor_pos()
        if "--no-deadman" not in sys.argv and (abs(cx - park[0]) > 200 or abs(cy - park[1]) > 200):
            print(f"mouse moved by user -> abort (cursor {cx},{cy} vs parked {park})")
            return
        # hover the LAST detected tile (cells move between layouts) to page
        hover = (tiles[-1][0] + 30, tiles[-1][3] - 12)
        move_to(*hover)
        time.sleep(0.3)
        press_key(SCAN_E)
        time.sleep(0.4)
        if DESELECT:
            click(*DESELECT)
        else:
            move_to(*park)
        time.sleep(1.0)

    print(f"{shot_n} shots -> {OUT_DIR}")
    print(f"next: python generator/tools/tooltip-thumbs.py --dir \"{OUT_DIR}\"")

if __name__ == "__main__":
    main()
