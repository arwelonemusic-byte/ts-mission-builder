# Handoff: TS Mission Toolkit callout (Mission setup panel)

## Overview
A single new component for **ts-mission-builder** (`web/`): an "Important!" callout reminding mission makers to install/update the TS Mission Toolkit addon. It sits in the **Mission setup panel**, directly below the panel header, above the "Name" field.

## About the design file
`callout-reference.html` in this folder is a **design reference created in HTML** — not production code. Recreate it in the existing codebase environment: Next.js 16 + React 19 + Tailwind v4, following the patterns already in `web/src/components/panels/MissionPanel.tsx` and `web/src/components/ui.tsx`.

## Fidelity
**High-fidelity.** Colors, spacing, and typography are final and follow the existing ops-planner design system already used throughout the app.

## Placement
- File: `web/src/components/panels/MissionPanel.tsx`
- Position: first child of the panel body — rendered before the `Name` `<Field>`.
- The panel body already provides `gap-4` (16px) vertical rhythm; the callout needs no extra margins.

## Component spec
Container:
- `background: rgba(244,219,80,0.12)` (brand yellow @ 12% — same treatment as the existing uneven-ground spawn warning)
- `border: 1px solid rgba(244,219,80,0.4)`
- `border-radius: 8px`
- `padding: 12px`
- vertical stack, `gap: 4px`

Content (three lines):
1. **"Important!"** — Roboto 700, 14px / 20px, color `#f4db50`
2. **"Make sure you have the TS Mission Toolkit addon installed and updated:"** — Roboto 400, 12px / 16px, color `rgba(255,255,255,0.8)`
3. Link — text **"TS Mission Toolkit — Reforger Workshop"**, Roboto 500, 12px / 16px, color `#f4db50`, `text-decoration: underline`, `text-underline-offset: 2px`
   - `href="https://reforger.armaplatform.com/workshop/6906F4528B72651A-TSMissionToolkit"`
   - `target="_blank" rel="noopener"`
   - Hover: `#f9e278` (existing brand hover yellow)

Suggested Tailwind (matches codebase conventions — arbitrary values, no new tokens):
```tsx
<div className="bg-[rgba(244,219,80,0.12)] border border-[rgba(244,219,80,0.4)] rounded-[8px] p-3 flex flex-col gap-1">
  <span className="text-[14px] leading-[20px] font-bold text-[#f4db50]">Important!</span>
  <span className="text-[12px] leading-[16px] text-white/80">
    Make sure you have the TS Mission Toolkit addon installed and updated:
  </span>
  <a
    href="https://reforger.armaplatform.com/workshop/6906F4528B72651A-TSMissionToolkit"
    target="_blank"
    rel="noopener"
    className="w-max max-w-full text-[12px] leading-[16px] font-medium text-[#f4db50] underline underline-offset-2 hover:text-[#f9e278] transition-colors"
  >
    TS Mission Toolkit — Reforger Workshop
  </a>
</div>
```

## Interactions & behavior
- Link opens in a new tab; no other interactivity.
- Static — always visible, no dismiss state, no persistence.

## Design tokens used (existing system, do not invent new ones)
- Brand yellow `#f4db50`; hover yellow `#f9e278`
- Yellow soft fill `rgba(244,219,80,0.12)`; yellow soft border `rgba(244,219,80,0.4)`
- Text on dark: white @ 80%
- Radius 8px; padding 12px
- Font: Roboto (already loaded via `next/font/google`)

## Assets
None.

## Files
- `callout-reference.html` — standalone visual reference of the component on the panel background (`#202427`).
