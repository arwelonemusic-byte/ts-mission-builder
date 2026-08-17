# Automated per-item tooltip capture for the arsenal crate (feeds
# tooltip-thumbs.py). Replaces manually hovering + screenshotting every item.
#
# Calibrated 2026-08-16 against a live crate screenshot (Workbench play mode,
# "Vicinity > Arsenal" panel):
#  - The arsenal grid lives in the LEFT part of the screen; the character
#    inventory on the right is full of identical-looking item grids ->
#    detection defaults to the left 40% of the screen (--region overrides).
#  - Paging is Q/E (yellow buttons under the grid, "Q 1/3 E") — the script
#    presses E (scancode injection) between pages, NOT mouse wheel.
#  - One tile always carries a yellow selection border which can bridge the
#    gutter and merge two tiles into one component -> yellow pixels are
#    masked to background before segmentation.
#
# How it works:
#   1. Open the spike crate in-game (BORDERLESS/WINDOWED on the PRIMARY
#      monitor — exclusive fullscreen often blanks ImageGrab), crate grid
#      visible, then start this script and alt-tab back to the game.
#   2. After --start seconds the script grabs the screen, finds the item tiles
#      with the same gutter-color segmentation the page slicer uses, and for
#      each tile: moves the cursor (Win32 SendInput — injected input reaches
#      the game's raw-input stream, unlike SetCursorPos) to just inside the
#      tile's bottom-left corner, waits --delay for the name tooltip, and
#      saves a crop (tile at top-left, tooltip band below) into --dir.
#   3. It presses E (while hovering the grid — Q/E only work there) and
#      repeats for EXACTLY --pages pages. Pass the true page count from the
#      "N / M" indicator under the grid — every auto-stop heuristic tried
#      false-fired against this UI (see the comment in main()).
#   4. Review/mapping/write = the normal tooltip-thumbs.py flow on --dir.
#
# Duplicate shots are HARMLESS (the pipeline is name-anchored; when two shots
# show the same item, map one and leave the other unmapped).
#
# Dead-man switch: grab the mouse yourself (move it > 60 px off script
# position) and the run aborts before the next hover.
#
#   python generator/tools/auto-hover-capture.py --dir "input/thumb-shots/RHS AFRF Ammo" --probe
#   python generator/tools/auto-hover-capture.py --dir "input/thumb-shots/RHS AFRF Ammo" --pages 3
#
# Options: --start 5 (countdown s), --delay 0.8 (tooltip wait s), --pages 40,
#          --region L,T,R,B (px; override the left-40% default if the debug
#          overlay picks up stray UI), --mode abs|rel (rel = stepped relative
#          moves, fallback if the game ignores absolute injected moves).
import ctypes
import sys
import time
from ctypes import wintypes
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageGrab
from scipy import ndimage

# ---- args -------------------------------------------------------------------
def arg(name, default=None):
    if name in sys.argv:
        return sys.argv[sys.argv.index(name) + 1]
    return default

if "--dir" not in sys.argv:
    print("usage: auto-hover-capture.py --dir <shots dir> [--probe] [--pages N]")
    sys.exit(1)

OUT_DIR = Path(arg("--dir"))
OUT_DIR.mkdir(parents=True, exist_ok=True)
DEBUG_DIR = OUT_DIR / "_debug"
DEBUG_DIR.mkdir(exist_ok=True)

START = float(arg("--start", "5"))
DELAY = float(arg("--delay", "0.8"))
PAGES = int(arg("--pages", "40"))
MODE = arg("--mode", "abs")
PROBE = "--probe" in sys.argv
REGION = None
if arg("--region"):
    REGION = tuple(int(v) for v in arg("--region").split(","))

# ---- Win32 input ------------------------------------------------------------
user32 = ctypes.windll.user32
user32.SetProcessDPIAware()

class MOUSEINPUT(ctypes.Structure):
    _fields_ = [("dx", wintypes.LONG), ("dy", wintypes.LONG),
                ("mouseData", wintypes.DWORD), ("dwFlags", wintypes.DWORD),
                ("time", wintypes.DWORD), ("dwExtraInfo", ctypes.c_size_t)]

class KEYBDINPUT(ctypes.Structure):
    _fields_ = [("wVk", wintypes.WORD), ("wScan", wintypes.WORD),
                ("dwFlags", wintypes.DWORD), ("time", wintypes.DWORD),
                ("dwExtraInfo", ctypes.c_size_t)]

class INPUT(ctypes.Structure):
    class _U(ctypes.Union):
        _fields_ = [("mi", MOUSEINPUT), ("ki", KEYBDINPUT)]
    _anonymous_ = ("u",)
    _fields_ = [("type", wintypes.DWORD), ("u", _U)]

MOVE, ABSOLUTE = 0x0001, 0x8000
KEY_SCANCODE, KEY_UP = 0x0008, 0x0002
SCAN_E = 0x12  # page-forward in the crate UI
SCAN_Q = 0x10  # page-back

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
    else:  # stepped relative moves — raw-input-only games see these for sure
        for _ in range(80):
            cx, cy = cursor_pos()
            ddx, ddy = x - cx, y - cy
            if abs(ddx) <= 1 and abs(ddy) <= 1:
                break
            send_mouse(MOVE, max(-40, min(40, ddx)), max(-40, min(40, ddy)))
            time.sleep(0.004)
    time.sleep(0.02)

# ---- tile detection (same ground truth as slice-thumbnails.py) --------------
GUTTER_RGB = np.array([79, 76, 74])
GUTTER_TOL = 14
MIN_TILE = 60
MAX_TILE = 340          # > 3 cells + gutters; kills the giant outside-grid component
MIN_FILL = 0.5
BLANK_STD, BLANK_P99 = 6.0, 90

def find_tiles(img):
    rgb = np.asarray(img.convert("RGB")).astype(int)
    h, w = rgb.shape[:2]
    mask = np.zeros((h, w), bool)
    if REGION:
        mask[REGION[1]:REGION[3], REGION[0]:REGION[2]] = True
    else:
        # arsenal panel is left-of-center; the character inventory grids on
        # the right must never be detected
        mask[:, : int(w * 0.40)] = True
    gutter = (np.abs(rgb - GUTTER_RGB) < GUTTER_TOL).all(axis=2)
    # yellow selection border: bridges the gutter around the selected tile ->
    # treat as background so it can't merge two tiles into one component
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    yellow = (r > 140) & (g > 110) & (b < 100) & (r - b > 60)
    labels, _ = ndimage.label(~gutter & ~yellow & mask)
    tiles = []
    for idx, sl in enumerate(ndimage.find_objects(labels), start=1):
        if sl is None:
            continue
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        tw, th = x1 - x0, y1 - y0
        if tw < MIN_TILE or th < MIN_TILE or tw > MAX_TILE or th > MAX_TILE:
            continue
        if (labels[sl] == idx).mean() < MIN_FILL:
            continue
        lum = rgb[y0:y1, x0:x1].mean(axis=2)
        if lum.std() < BLANK_STD and np.percentile(lum, 99) < BLANK_P99:
            continue  # empty spacer cell
        tiles.append((x0, y0, x1, y1))
    tiles = largest_cluster(tiles)
    tiles.sort(key=lambda t: (round(t[1] / 92), t[0]))
    return tiles

def largest_cluster(tiles, reach=300):
    """The 3D world behind the UI can produce isolated tile-sized
    gutter-colored patches (seen in calibration: a patch in the trees).
    Real tiles sit in one dense grid — keep only the biggest group of
    tiles whose centers chain together within `reach` px."""
    if len(tiles) < 2:
        return tiles
    centers = [((x0 + x1) / 2, (y0 + y1) / 2) for x0, y0, x1, y1 in tiles]
    parent = list(range(len(tiles)))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i
    for i in range(len(tiles)):
        for j in range(i + 1, len(tiles)):
            if (abs(centers[i][0] - centers[j][0]) < reach
                    and abs(centers[i][1] - centers[j][1]) < reach):
                parent[find(i)] = find(j)
    groups = {}
    for i in range(len(tiles)):
        groups.setdefault(find(i), []).append(tiles[i])
    return max(groups.values(), key=len)

def overlay(img, tiles, name):
    dbg = img.convert("RGB").copy()
    d = ImageDraw.Draw(dbg)
    for i, (x0, y0, x1, y1) in enumerate(tiles):
        d.rectangle([x0, y0, x1 - 1, y1 - 1], outline=(255, 60, 60), width=2)
        d.text((x0 + 4, y0 + 3), str(i), fill=(255, 255, 100))
    dbg.save(DEBUG_DIR / name)

# ---- main loop --------------------------------------------------------------
def main():
    print(f"Focus the game. Capturing in {START:.0f}s... (grab the mouse to abort)")
    time.sleep(START)

    # rewind to page 1: hover a tile (Q/E only work over the grid) and press
    # Q once per possible page — extra presses on page 1 are no-ops, so the
    # run no longer depends on which page the crate was left on
    first = find_tiles(ImageGrab.grab())
    if first:
        fx0, fy0, fx1, fy1 = first[0]
        move_to(fx0 + 28, fy1 - 14)
        time.sleep(0.2)
        for _ in range(max(0, PAGES - 1)):
            press_key(SCAN_Q)
            time.sleep(0.5)

    shot_n = 0
    for page in range(PAGES):
        img = ImageGrab.grab()
        tiles = find_tiles(img)
        if tiles:
            # The crate shows a PERSISTENT tooltip for the SELECTED tile even
            # with the cursor parked off-grid — after paging it covers the top
            # rows and hides tiles from detection (cost 11 of 27 tiles on the
            # ammo page 3). Hover the bottom-most tile so the tooltip drops
            # below the grid, re-grab, and union both detections.
            bx0, by0, bx1, by1 = max(tiles, key=lambda t: (t[3], t[2]))
            move_to(bx0 + 28, by1 - 14)
            time.sleep(0.5)
            img = ImageGrab.grab()
            tiles2 = find_tiles(img)
            for t2 in tiles2:
                c2 = ((t2[0] + t2[2]) / 2, (t2[1] + t2[3]) / 2)
                if not any(abs(c2[0] - (t[0] + t[2]) / 2) < 20
                           and abs(c2[1] - (t[1] + t[3]) / 2) < 20 for t in tiles):
                    tiles.append(t2)
            tiles.sort(key=lambda t: (round(t[1] / 92), t[0]))
        # NO auto-stop: every pixel cue tried (full grabs, grid crops, the
        # "N / M" page indicator) false-fired against this UI — translucent
        # panel with animated world bleed, floating grid bottom on sparse
        # pages, a PERSISTENT tooltip spilling into any fixed band, and
        # near-identical variant pages. --pages must be the EXACT page count
        # (read "N / M" under the grid); the loop runs exactly that many
        # pages and E on the last page is a harmless no-op.
        overlay(img, tiles, f"tiles-p{page:02d}.png")
        if not tiles:
            print(f"page {page}: no tiles found (see _debug/tiles-p{page:02d}.png; "
                  f"try --region) -> stop")
            break
        print(f"page {page}: {len(tiles)} tiles")

        todo = tiles[:3] if PROBE else tiles
        expected = None
        for x0, y0, x1, y1 in todo:
            if expected is not None:
                cx, cy = cursor_pos()
                if abs(cx - expected[0]) > 60 or abs(cy - expected[1]) > 60:
                    print("mouse moved by user -> abort")
                    return
            # bottom-left inside the tile: tooltip renders BELOW the tile,
            # tile render stays unobstructed (the shape crop_tile expects)
            hx, hy = x0 + 28, y1 - 14
            move_to(hx, hy)
            expected = (hx, hy)
            time.sleep(DELAY)
            if PROBE:
                continue
            shot = ImageGrab.grab((max(0, x0 - 6), max(0, y0 - 6),
                                   min(SW, x0 + 620), min(SH, y1 + 280)))
            # the crate UI intermittently blanks tiles for a moment (restock/
            # refresh flicker — cost 5 of 117 shots on the first ammo run):
            # if the tile area no longer resembles what detection saw (item
            # render gone, world blur in its place), wait it out and retake
            # interior only — the hover/selection border repaints tile edges
            ref = np.asarray(img.convert("L"))[y0 + 8 : y1 - 8, x0 + 8 : x1 - 8]
            cur = np.asarray(shot.convert("L"))[14 : 6 + (y1 - y0) - 8, 14 : 6 + (x1 - x0) - 8]
            if cur.shape == ref.shape and np.abs(cur.astype(int) - ref.astype(int)).mean() > 25:
                time.sleep(1.5)
                shot = ImageGrab.grab((max(0, x0 - 6), max(0, y0 - 6),
                                       min(SW, x0 + 620), min(SH, y1 + 280)))
            # encode the exact tile size — tooltip-thumbs.py crops the tile
            # at (6,6,6+w,6+h) instead of guessing (its crop_tile heuristic
            # was built for hand-cropped shots and misfires on these)
            shot.save(OUT_DIR / f"auto-p{page:02d}-t{shot_n:03d}-w{x1 - x0}h{y1 - y0}.png")
            shot_n += 1

        # Q/E paging only works while the cursor is OVER the grid (user-
        # confirmed 2026-08-16: pressing E with the cursor parked below the
        # grid closes the whole inventory) — press E while still hovering
        # the last tile.
        if PROBE:
            press_key(SCAN_E)
            print("probe done — check that (a) the game cursor visited the first 3 "
                  f"tiles, (b) _debug/tiles-p{page:02d}.png outlines real tiles, and "
                  "(c) the crate flipped to page 2 just now (press Q to go back). "
                  "If the cursor didn't move in-game, retry with --mode rel.")
            return
        if page == PAGES - 1:
            break  # last requested page — don't touch the UI again
        press_key(SCAN_E)
        # then clear the cursor OFF the grid before the next page grab — a
        # resting cursor re-pops its tooltip over the new page and the
        # covered tiles are neither detected nor hovered (cost pages 2/3
        # ~9 items each on the first full run). Below the grid is safe as
        # long as no key is pressed there.
        grid_cx = (min(t[0] for t in tiles) + max(t[2] for t in tiles)) // 2
        grid_bottom = max(t[3] for t in tiles)
        move_to(grid_cx, min(SH - 2, grid_bottom + 30))
        time.sleep(0.9)

    print(f"{shot_n} shots -> {OUT_DIR}")
    print("next: python generator/tools/tooltip-thumbs.py --dir "
          f"\"{OUT_DIR}\"  (review sheets -> mapping.py -> --write)")

if __name__ == "__main__":
    main()
