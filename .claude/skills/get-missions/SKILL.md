---
name: get-missions
description: Pull freshly generated community missions from the production box into D:\VSCode_dev\arma-reforger\ts-mission-builder\generated-missions — one folder per mission (name-author) with the mission JSON and its thumbnail. Use when the user says /get-missions or asks to fetch/sync/download generated missions from the server.
---

# Get generated missions from the production box

Missions generated with the web tool are archived on the Selectel box (`ssh slotbot-msk`) by the `/api/generated` route. This skill syncs NEW archives to the local collection at `D:\VSCode_dev\arma-reforger\ts-mission-builder\generated-missions\` — one folder per mission named `<name-slug>-<author-slug>`, containing `mission.json` (self-contained, re-importable via the tool's Load-from-file) and `thumbnail.jpg` (when the author uploaded one).

Paths:
- Remote archive: `/opt/ts-web/ts-mission-builder/.mission-data/missions/*.json` (filenames start with a UTC timestamp — lexical order = chronological)
- Local root: `D:\VSCode_dev\arma-reforger\ts-mission-builder\generated-missions\`
- Sync manifest: `generated-missions\_synced.txt` (one remote filename per line — already-ingested archives)
- Ingest helper: `.claude/skills/get-missions/scripts/ingest.mjs`

Use the **Bash tool** for ssh/scp (quoting through PowerShell mangles remote commands).

## Steps

1. List remote archives:
   ```bash
   ssh slotbot-msk 'ls /opt/ts-web/ts-mission-builder/.mission-data/missions 2>/dev/null'
   ```
   Empty (or missing dir) → report "no missions archived yet" and stop.

2. Read `generated-missions/_synced.txt` (may not exist — treat as empty). New = remote filenames not in the manifest. None new → report "no new missions" plus the current total and stop.

3. Fetch the new files into a temp dir (use the session scratchpad, not the collection root):
   ```bash
   scp "slotbot-msk:/opt/ts-web/ts-mission-builder/.mission-data/missions/<file>" "<tmpdir>/"
   ```
   Batch with a brace list or a loop; quote filenames (slugs are safe, but quote anyway).

4. Ingest each in **chronological (lexical) filename order**, so re-generated missions end with the newest copy in their folder:
   ```bash
   node .claude/skills/get-missions/scripts/ingest.mjs "<tmpdir>/<file>" "D:/VSCode_dev/arma-reforger/ts-mission-builder/generated-missions"
   ```
   (run from the repo root; the script prints the folder name it wrote). The same `name-author` folder is deliberately overwritten by later archives of the same mission.

5. Append the ingested remote filenames to `_synced.txt` (create it if needed) and delete the temp copies. Do NOT delete anything on the box — the server archive is the source of truth.

6. Report: how many new archives were ingested, the mission folders touched (note which lacked a thumbnail), and the running totals (manifest line count = archives synced; folder count = distinct missions).

## Notes

- `generated-missions/` is gitignored — it's a local collection, never committed.
- If a remote filename is in the manifest but its local folder was deleted, re-sync it by removing its line from `_synced.txt` and re-running.
- Stats without downloading: `ssh slotbot-msk 'wc -l < /opt/ts-web/ts-mission-builder/.mission-data/events.jsonl'`.
