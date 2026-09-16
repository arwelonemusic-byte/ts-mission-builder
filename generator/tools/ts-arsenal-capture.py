# Per-page tile capture for the "TS Capture Arsenal UI" addon (feeds tooltip-thumbs.py).
#
# The capture-only addon (Workbench addons dir "TS Capture Arsenal UI", GUID
# 7292A2E8E26226E4, pulled in by a thumbs spike's `extraDependencies`) turns the
# vicinity panel's crate view into exactly 4 equal SQUARE black tiles per page
# (2 x 2), item auto-fitted to 88 % of the tile, weapons in 3/4 view, and the
# item NAME printed top-left in TS yellow — so there is nothing to hover for:
# one screenshot per page, slice the 4 black squares, done. Unlike the WCS
# Arsenal UI (wcs-arsenal-capture.py) nothing is repacked or hidden: the crate
# shows every item in conf order, one per tile (195 items = 49 pages).
#
# Detection: a tile is a large near-black connected component in the left part
# of the screen (item renders punch holes in it but never reach the edge, so the
# black ring stays connected; the selected tile's yellow frame sits OUTSIDE the
# black). No frames, no gutters, no page-1 calibration.
#
# Timing: the addon re-fits every page ~0.2 s after the flip (probe FOV, then
# the solved FOV, then a verify pass) -> the grab waits 1.6 s after paging.
#
#   python generator/tools/ts-arsenal-capture.py --dir "input/thumb-shots/Bundeswehr-ts" --probe
#   python generator/tools/ts-arsenal-capture.py --dir "input/thumb-shots/Bundeswehr-ts" --pages 49 --deselect X,Y
#
# Options: --start 5 (countdown s), --pages N (EXACT page count from "N / M"),
#          --region L,T,R,B (px; default = left 40 % of the screen),
#          --mode abs|rel (cursor injection, see auto-hover-capture.py),
#          --no-deadman (don't abort when the cursor leaves the parked spot),
#          --deselect X,Y (click a player-inventory item after each page flip so
#          the first crate tile drops its selection frame),
#          --save-pages (keep the raw page grabs in _debug/page-NN.png),
#          --from-pages <dir> (offline: slice tiles from saved page grabs),
#          --regrab N (re-shoot the page on screen as _debug/page-NN.png),
#          --probe-image <png> (offline: detection overlay for one grab).
#
# Shot format = tooltip-thumbs.py's auto format: tile at (6,6) with its size in
# the filename (-w<W>h<H>); the `ts-` prefix makes tooltip-thumbs.py take the
# whole tile (name included, user decision) and show the top name strip in the
# review sheets.
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
    print("usage: ts-arsenal-capture.py --dir <shots dir> [--probe | --probe-image <png> | --pages N]")
    sys.exit(1)

OUT_DIR = Path(arg("--dir"))
OUT_DIR.mkdir(parents=True, exist_ok=True)
DEBUG_DIR = OUT_DIR / "_debug"
DEBUG_DIR.mkdir(exist_ok=True)
START = float(arg("--start", "5"))
PAGES = int(arg("--pages", "60"))
MODE = arg("--mode", "abs")
PROBE = "--probe" in sys.argv
PROBE_IMAGE = arg("--probe-image")
REGION = tuple(int(v) for v in arg("--region").split(",")) if arg("--region") else None
DESELECT = tuple(int(v) for v in arg("--deselect").split(",")) if arg("--deselect") else None
SETTLE = 1.6  # s after a page flip before grabbing (addon auto-fit passes)

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
LEFTDOWN, LEFTUP = 0x0002, 0x0004

def send_mouse(flags, dx=0, dy=0):
    inp = INPUT(type=0)
    inp.mi = MOUSEINPUT(dx, dy, 0, flags, 0, 0)
    user32.SendInput(1, ctypes.byref(inp), ctypes.sizeof(INPUT))

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

def click(x, y):
    move_to(x, y)
    time.sleep(0.08)
    send_mouse(LEFTDOWN)
    time.sleep(0.06)
    send_mouse(LEFTUP)
    time.sleep(0.08)

# ---- tile detection ---------------------------------------------------------
# Two stages (learned on the first run 2026-09-16): the GRID (4 cell boxes) is
# found once as black connected components — items never reach the edge of an
# EMPTY-ish tile — but clothing, the ZO4x30i scope and the MRS120 baseplate
# fill the whole square and broke the black ring (8 of 195 tiles missed). Per
# page the fixed cells are therefore judged FILLED by the yellow item name the
# addon prints in the top strip (every slot gets SetText(GetItemName())); a
# vanilla empty slot (gray boxes, last page) has no yellow.
BLACK_MAX = 12       # per-channel max for "tile black" (the addon paints (0,0,0))
MIN_TILE = 150       # px; tiles are ~3 x 66 layout units x UI scale (>= 190 px at 3840x1600)
MIN_FILL = 0.45      # black share of the bbox (the item render punches a hole)
NAME_STRIP = 0.22    # top share of a cell that holds the name
MIN_NAME_PX = 25     # yellow text pixels that count as "has a name"
MIN_BLACK = 0.05     # black share that separates a tile from an empty vanilla slot

def find_grid(img):
    """-> [(x0, y0, x1, y1)] of the black square tiles in reading order (the
    cell grid; call on a page whose tiles are not filled edge to edge)."""
    rgb = np.asarray(img.convert("RGB")).astype(int)
    h, w = rgb.shape[:2]
    rx0, ry0, rx1, ry1 = REGION if REGION else (0, 0, int(w * 0.4), h)
    sub = rgb[ry0:ry1, rx0:rx1]
    black = sub.max(axis=2) <= BLACK_MAX
    labels, _ = ndimage.label(black)
    tiles = []
    for idx, sl in enumerate(ndimage.find_objects(labels), start=1):
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        tw, th = x1 - x0, y1 - y0
        if tw < MIN_TILE or th < MIN_TILE:
            continue
        if not 0.9 <= tw / th <= 1.1:
            continue
        if (labels[sl] == idx).mean() < MIN_FILL:
            continue
        tiles.append((rx0 + x0, ry0 + y0, rx0 + x1, ry0 + y1))
    if not tiles:
        return []
    th = np.median([t[3] - t[1] for t in tiles])
    tiles.sort(key=lambda t: (round(t[1] / (th * 0.5)), t[0]))
    return tiles

def cell_filled(rgb, box):
    x0, y0, x1, y1 = box
    strip = rgb[y0 : y0 + int((y1 - y0) * NAME_STRIP), x0:x1]
    r, g, b = strip[..., 0], strip[..., 1], strip[..., 2]
    yellow = (r >= 190) & (g >= 150) & (b <= 150) & (r - b >= 70)
    # a vanilla empty slot showed ~110 yellow-ish px but ZERO black; even the
    # edge-to-edge renders keep >= 0.31 black (measured pages 12/29-32/37)
    black = (rgb[y0:y1, x0:x1].max(axis=2) <= BLACK_MAX).mean()
    return int(yellow.sum()) >= MIN_NAME_PX and black >= MIN_BLACK

def find_tiles(img, grid):
    rgb = np.asarray(img.convert("RGB")).astype(int)
    return [box for box in grid if cell_filled(rgb, box)]

def overlay(img, tiles, name):
    dbg = img.convert("RGB").copy()
    d = ImageDraw.Draw(dbg)
    for i, (x0, y0, x1, y1) in enumerate(tiles):
        d.rectangle([x0, y0, x1 - 1, y1 - 1], outline=(255, 60, 60), width=2)
        d.text((x0 + 4, y1 - 14), str(i), fill=(255, 255, 100))
    dbg.save(DEBUG_DIR / name)

def save_tiles(img, tiles, page, shot_n):
    for x0, y0, x1, y1 in tiles:
        shot = img.crop((x0 - 6, y0 - 6, x1 + 6, y1 + 6))
        shot.save(OUT_DIR / f"ts-p{page:02d}-t{shot_n:03d}-w{x1 - x0}h{y1 - y0}.png")
        shot_n += 1
    return shot_n

# ---- main -------------------------------------------------------------------
def main():
    if arg("--from-pages"):
        pages = sorted(Path(arg("--from-pages")).glob("page-*.png"))
        grid = find_grid(Image.open(pages[0])) if pages else []
        print(f"grid from {pages[0].name if pages else '?'}: {grid}")
        shot_n = 0
        for page, pp in enumerate(pages):
            img = Image.open(pp)
            tiles = find_tiles(img, grid)
            overlay(img, tiles, f"tiles-p{page:02d}.png")
            print(f"page {page}: {len(tiles)} tiles")
            shot_n = save_tiles(img, tiles, page, shot_n)
        print(f"{shot_n} shots -> {OUT_DIR}")
        return

    if PROBE_IMAGE:
        img = Image.open(PROBE_IMAGE)
        grid = find_grid(img)
        tiles = find_tiles(img, grid)
        overlay(img, tiles, "probe-image.png")
        n = save_tiles(img, tiles, 99, 0) if "--save" in sys.argv else 0
        print(f"{len(tiles)} tiles: {tiles}\noverlay -> {DEBUG_DIR / 'probe-image.png'}; saved {n} sample shots")
        return

    print(f"Focus the game. Capturing in {START:.0f}s... (grab the mouse to abort)")
    time.sleep(START)

    if arg("--regrab"):
        # re-shoot ONE page as shown right now (e.g. the last page after the
        # user dismissed a hint popup) -> _debug/page-NN.png, then --from-pages
        page = int(arg("--regrab"))
        img = ImageGrab.grab()
        img.save(DEBUG_DIR / f"page-{page:02d}.png")
        print(f"saved _debug/page-{page:02d}.png — re-slice with --from-pages")
        return

    img = ImageGrab.grab()
    grid = find_grid(img)
    tiles = find_tiles(img, grid)
    if not tiles:
        img.save(DEBUG_DIR / "start-fail.png")
        print("no black tiles on screen (see _debug/start-fail.png; is the arsenal open with the capture UI?)")
        return
    if PROBE:
        overlay(img, tiles, "probe.png")
        print(f"probe: {len(tiles)} tiles {tiles} -> _debug/probe.png (check the outlines hug the black squares)")
        return

    # the crate may have been left on any page: hover a tile and rewind with Q
    hover = (tiles[0][0] + 40, tiles[0][3] - 40)
    move_to(*hover)
    time.sleep(0.2)
    for _ in range(max(0, PAGES - 1)):
        press_key(SCAN_Q)
        time.sleep(0.25)
    if DESELECT:
        click(*DESELECT)
    time.sleep(SETTLE)
    # lock the cell grid on page 1 (weapons never fill a tile edge to edge)
    grid = find_grid(ImageGrab.grab()) or grid

    grid_cx = (min(t[0] for t in tiles) + max(t[2] for t in tiles)) // 2
    grid_bottom = max(t[3] for t in tiles)
    park = DESELECT if DESELECT else (grid_cx, min(SH - 2, grid_bottom + 40))
    move_to(*park)
    time.sleep(0.5)

    shot_n = 0
    for page in range(PAGES):
        img = ImageGrab.grab()
        if "--save-pages" in sys.argv:
            img.save(DEBUG_DIR / f"page-{page:02d}.png")
        tiles = find_tiles(img, grid)
        overlay(img, tiles, f"tiles-p{page:02d}.png")
        print(f"page {page}: {len(tiles)} tiles")
        if not tiles:
            break
        shot_n = save_tiles(img, tiles, page, shot_n)
        if page == PAGES - 1:
            break
        cx, cy = cursor_pos()
        if "--no-deadman" not in sys.argv and (abs(cx - park[0]) > 200 or abs(cy - park[1]) > 200):
            print(f"mouse moved by user -> abort (cursor {cx},{cy} vs parked {park})")
            return
        # hover the last tile's bottom-left corner (away from the render) to page
        hover = (tiles[-1][0] + 40, tiles[-1][3] - 40)
        move_to(*hover)
        time.sleep(0.3)
        press_key(SCAN_E)
        time.sleep(0.4)
        if DESELECT:
            click(*DESELECT)
        else:
            move_to(*park)
        time.sleep(SETTLE)

    print(f"{shot_n} shots -> {OUT_DIR}")
    print(f"next: python generator/tools/tooltip-thumbs.py --dir \"{OUT_DIR}\"")

if __name__ == "__main__":
    main()
