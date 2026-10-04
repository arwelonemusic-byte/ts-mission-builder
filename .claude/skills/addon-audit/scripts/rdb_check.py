"""Grade {GUID}path refs against a packed addon's resourceDatabase.rdb.

The rdb shipped next to a Workshop addon's data.pak is the GUID <-> path table
the engine loads — stronger evidence than anything inside the extraction (which
has no .meta files). Entry layout observed (MEI 1.3.2, 2026-10-03):
    u32 len | path | \\0 | 6 bytes | GUID (u64 LE) | 8 bytes

Usage:
    python rdb_check.py <addon>/resourceDatabase.rdb <file-with-refs>... [--bad]

Every {GUID}path ref (.et/.conf) found in the given files is graded:
    OK          the rdb maps that GUID to that path
    WRONG_GUID  the path ships under a different GUID (shown)
    MOVED       the GUID ships at a different path (shown)
    NOT_IN_PAK  neither — a deleted prefab, or simply vanilla/another mod's content
--bad prints only the non-OK rows.
"""
import re
import struct
import sys

args = [a for a in sys.argv[1:] if not a.startswith("--")]
only_bad = "--bad" in sys.argv
rdb = open(args[0], "rb").read()

by_path, by_guid = {}, {}
for m in re.finditer(rb"([\x01-\xff])\x00\x00\x00([\x20-\x7e]{4,300}?)\x00(.{6})(.{8})", rdb, re.S):
    path = m.group(2)
    if len(path) not in (m.group(1)[0] - 1, m.group(1)[0]):
        continue
    guid = "%016X" % struct.unpack("<Q", m.group(4))[0]
    by_path.setdefault(path.decode(), set()).add(guid)
    by_guid[guid] = path.decode()
print(f"rdb entries: {len(by_path)} paths, {len(by_guid)} guids", file=sys.stderr)

refs = set()
for f in args[1:]:
    txt = open(f, encoding="utf-8", errors="replace").read()
    refs |= set(re.findall(r"\{([0-9A-F]{16})\}([^\"`\s,\]]+\.(?:et|conf))", txt))

for g, p in sorted(refs, key=lambda r: r[1]):
    if by_guid.get(g) == p:
        st = "OK"
    elif p in by_path:
        st = "WRONG_GUID (pak has %s)" % ",".join(sorted(by_path[p]))
    elif g in by_guid:
        st = "MOVED -> %s" % by_guid[g]
    else:
        st = "NOT_IN_PAK"
    if st != "OK" or not only_bad:
        print(f"{st:40s} {{{g}}}{p}")
