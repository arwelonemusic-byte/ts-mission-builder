"use client";

import { useEffect, useState } from "react";
import { FACTIONS, SLOT_PRESETS, resolveRoleLoadout, type SlotPreset } from "mission-gen";
import {
  defaultArsenal,
  defaultGroups,
  defaultLoadouts,
  ensureGroupSlots,
  factionMeta,
  freshGroupId,
  freshSlotId,
  isDefaultGroups,
  isSlotTeam,
  MAX_SQUAD_SLOTS,
  newSlot,
  retargetSlots,
  SLOT_TEAM_COLORS,
  slotsFromPreset,
  syncGroupSizes,
  type ArtySupport,
  type Mission,
  type MissionGroup,
  type SlotTeam,
  type SquadMode,
  type SquadSlot,
} from "@/lib/mission";
import { useLang, useT } from "@/lib/i18n";
import { CheckRow, Divider, Field, GhostButton, PlusIcon, Segmented, SelectInput, TextInput, Toggle, XButton } from "../ui";

const MAX_GROUPS = 8;
/** Simple-mode size spinner cap (vanilla "Empty slot" rows; Advanced seats go to MAX_SQUAD_SLOTS) */
const MAX_GROUP_SIZE = 9;
/** Team picker = a 2×2 grid of 14 px dots (Figma 140:30): white top-left, red
 * top-right, blue bottom-left, green bottom-right; the selected dot gets a
 * 2 px white ring. Yellow exists in the toolkit enum but is not offered. */
const TEAMS: SlotTeam[] = ["none", "red", "blue", "green"];
const TEAM_LABELS: Record<SlotTeam, string> = { none: "White", red: "Red", blue: "Blue", green: "Green" };
const TEAM_GRID: Record<SlotTeam, string> = {
  none: "left-px top-px",
  red: "left-[21px] top-px",
  blue: "left-px top-[21px]",
  green: "left-[21px] top-[21px]",
};

function TeamPicker({ value, onChange }: { value: SlotTeam; onChange: (team: SlotTeam) => void }) {
  const t = useT();
  return (
    <div className="shrink-0 p-1" role="radiogroup" aria-label={t("Team")}>
      <div className="relative size-[36px]">
        {TEAMS.map((team) => {
          const active = value === team;
          return (
            <button
              key={team}
              type="button"
              role="radio"
              aria-checked={active}
              title={t(TEAM_LABELS[team])}
              aria-label={t(TEAM_LABELS[team])}
              onClick={() => onChange(team)}
              className={`absolute size-[14px] rounded-full transition-[filter] ${TEAM_GRID[team]} ${
                active ? "outline outline-2 -outline-offset-1 outline-white" : "hover:brightness-125"
              }`}
              style={{ background: SLOT_TEAM_COLORS[team] }}
            />
          );
        })}
      </div>
    </div>
  );
}

type Roster = { name: string; prefab: string }[];

/** Squad-size spinner (1–9): local text state so the field can be transiently
 * empty while typing; commits clamped, restores the last value on blur. */
function SizeInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  return (
    <input
      type="number"
      min={1}
      max={MAX_GROUP_SIZE}
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          setText("");
          return;
        }
        const v = Math.min(MAX_GROUP_SIZE, Math.max(1, Math.floor(+raw) || 1));
        setText(String(v));
        onCommit(v);
      }}
      onBlur={() => {
        if (text === "") setText(String(value));
      }}
      className="w-[52px] h-[28px] shrink-0 bg-[#202427] border border-[#2e3439] rounded-[4px] px-2 text-[12px] text-white text-center focus:border-[#f4db50] focus:outline-none"
    />
  );
}

/** Lowest unused 1'N callsign for a newly added squad. */
function nextCallsign(groups: MissionGroup[]): string {
  for (let n = 1; n <= 9; n++) {
    const cs = `1'${n}`;
    if (!groups.some((g) => g.name === cs)) return cs;
  }
  return "1'9";
}

/** Shell-count spinner for artillery rows (0–999, clamped). */
function ShellInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  return (
    <input
      type="number"
      min={0}
      max={999}
      value={value}
      onChange={(e) => onCommit(Math.max(0, Math.min(999, Math.floor(+e.target.value) || 0)))}
      className="w-[52px] h-[28px] shrink-0 bg-[#202427] border border-[#2e3439] rounded-[4px] px-2 text-[12px] text-white text-center focus:border-[#f4db50] focus:outline-none"
    />
  );
}

function TrashButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`size-[24px] shrink-0 flex items-center justify-center rounded-[4px] transition-colors ${
        disabled ? "opacity-25 cursor-default" : "hover:bg-[#2e3439]"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/zones/trash.svg" alt="" style={{ width: 16, height: 16 }} />
    </button>
  );
}

function DuplicateButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`size-[24px] shrink-0 flex items-center justify-center rounded-[4px] transition-colors ${
        disabled ? "opacity-25 cursor-default" : "hover:bg-[#2e3439]"
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="#fafafa" strokeWidth="1.4" fill="none" opacity="0.8" />
        <path d="M10.5 2.5 H4 A1.5 1.5 0 0 0 2.5 4 V10.5" stroke="#fafafa" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
      </svg>
    </button>
  );
}

/** Six-dot grip; the only draggable element of a seat row so text selection
 * inside the inputs is never hijacked by the browser's drag. Focused, the
 * arrow keys move the seat too (keyboard / no-DnD fallback). */
function DragHandle({
  label,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  label: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMove: (delta: -1 | 1) => void;
}) {
  return (
    <span
      draggable
      tabIndex={0}
      role="button"
      title={label}
      aria-label={label}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onKeyDown={(e) => {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        onMove(e.key === "ArrowUp" ? -1 : 1);
      }}
      className="w-[14px] h-[44px] shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-white/30 hover:text-white/70 focus:text-[#f4db50] focus:outline-none"
    >
      <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden>
        {[2, 7, 12].map((y) => (
          <g key={y}>
            <circle cx="2" cy={y} r="1.2" fill="currentColor" />
            <circle cx="6" cy={y} r="1.2" fill="currentColor" />
          </g>
        ))}
      </svg>
    </span>
  );
}

/** One seat: title, team, loadout. The first seat of a squad is the leader seat
 * (toolkit: taking it promotes the player), shown with a star. */
function SlotRow({
  slot,
  index,
  roster,
  faction,
  subfaction,
  canDelete,
  dragOver,
  onChange,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onMove,
}: {
  slot: SquadSlot;
  index: number;
  roster: Roster;
  faction: string;
  subfaction: string;
  canDelete: boolean;
  dragOver: boolean;
  onChange: (s: SquadSlot) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onMove: (delta: -1 | 1) => void;
}) {
  const t = useT();
  const missing = !slot.loadout;
  // A preset seat still on its "nearest match" kit — worth a look by the mission maker
  const resolved = slot.role ? resolveRoleLoadout(faction, subfaction, slot.role) : null;
  const approximate = !!resolved && resolved.approximate && resolved.prefab === slot.loadout;
  const loadoutName = (prefab: string) => roster.find((l) => l.prefab === prefab)?.name ?? "";
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`rounded-[6px] bg-[#202427] p-2 flex items-start gap-1 transition-colors ${
        dragOver ? "outline outline-1 outline-[#f4db50]" : ""
      } ${missing ? "ring-1 ring-[#f26f63]/60" : ""}`}
      style={{ boxShadow: `inset 3px 0 0 ${SLOT_TEAM_COLORS[slot.team]}` }}
    >
      <DragHandle label={t("Drag to reorder")} onDragStart={onDragStart} onDragEnd={onDragEnd} onMove={onMove} />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <TextInput
          placeholder={t("Slot title")}
          maxLength={40}
          value={slot.name}
          onChange={(e) => onChange({ ...slot, name: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <TeamPicker value={slot.team} onChange={(team) => onChange({ ...slot, team })} />
          <SelectInput
            value={slot.loadout}
            aria-label={t("Loadout")}
            onChange={(e) => {
              const prefab = e.target.value;
              // A title that still equals the old kit's name follows the new kit; a
              // hand-written title (preset seats included) stays. Picking by hand
              // also drops the preset role so faction changes keep this choice.
              const oldName = loadoutName(slot.loadout);
              const name = slot.name === oldName || slot.name === "" ? loadoutName(prefab) : slot.name;
              onChange({ ...slot, loadout: prefab, name, role: undefined });
            }}
          >
            {missing && <option value="">{`— ${t("Pick a loadout")} —`}</option>}
            {roster.map((l) => (
              <option key={l.prefab} value={l.prefab}>
                {l.name}
              </option>
            ))}
          </SelectInput>
        </div>
        {missing && <div className="text-[11px] text-[#f26f63]">{t("Pick a loadout")}</div>}
        {!missing && approximate && (
          <div className="text-[11px] text-[#f4db50]/80">{t("Nearest match — check the loadout")}</div>
        )}
      </div>
      <div className="h-[44px] shrink-0 flex items-center">
        <TrashButton label={t("Remove slot")} onClick={onDelete} disabled={!canDelete} />
      </div>
    </div>
  );
}

function SquadCard({
  group,
  roster,
  faction,
  subfaction,
  canDuplicate,
  onChange,
  onDuplicate,
  onDelete,
}: {
  group: MissionGroup;
  roster: Roster;
  faction: string;
  subfaction: string;
  canDuplicate: boolean;
  onChange: (g: MissionGroup) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const t = useT();
  const slots = group.slots ?? [];
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const setSlots = (next: SquadSlot[]) => onChange({ ...group, slots: next, size: Math.max(1, next.length) });
  const move = (from: number, to: number) => {
    if (from === to || from < 0 || from >= slots.length) return;
    const next = slots.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setSlots(next);
  };
  return (
    <div className="bg-[#14181a] rounded-[8px] p-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <TextInput
          className="flex-1 min-w-0"
          placeholder={t("Squad name")}
          maxLength={24}
          value={group.name}
          onChange={(e) => onChange({ ...group, name: e.target.value })}
        />
        <span className="shrink-0 text-[11px] text-white/40 tabular-nums">{slots.length}</span>
        <DuplicateButton label={t("Duplicate squad")} onClick={onDuplicate} disabled={!canDuplicate} />
        <TrashButton label={t("Remove squad")} onClick={onDelete} />
      </div>
      <div className="flex flex-col gap-[6px]">
        {slots.map((slot, i) => (
          <SlotRow
            key={slot.id}
            slot={slot}
            index={i}
            roster={roster}
            faction={faction}
            subfaction={subfaction}
            canDelete={slots.length > 1}
            dragOver={dragOver === i && dragFrom !== null && dragFrom !== i}
            onChange={(s) => setSlots(slots.map((x) => (x.id === s.id ? s : x)))}
            onDelete={() => setSlots(slots.filter((x) => x.id !== slot.id))}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(i));
              e.dataTransfer.effectAllowed = "move";
              setDragFrom(i);
            }}
            onDragOver={(e) => {
              if (dragFrom === null) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (dragOver !== i) setDragOver(i);
            }}
            onDragLeave={() => {
              if (dragOver === i) setDragOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const from = dragFrom ?? Number(e.dataTransfer.getData("text/plain"));
              move(from, i);
              setDragFrom(null);
              setDragOver(null);
            }}
            onDragEnd={() => {
              setDragFrom(null);
              setDragOver(null);
            }}
            onMove={(delta) => move(i, Math.max(0, Math.min(slots.length - 1, i + delta)))}
          />
        ))}
      </div>
      {slots.length < MAX_SQUAD_SLOTS && (
        <GhostButton small onClick={() => setSlots([...slots, newSlot(faction, subfaction, "RIFLE")])}>
          <PlusIcon />
          {t("Add slot")}
        </GhostButton>
      )}
    </div>
  );
}

/** "Add squad" picker: start fresh (one leader seat) or one of the presets —
 * both lists always, whatever the faction (user decision). */
function PresetPicker({ onPick, onClose }: { onPick: (presetId: string | null) => void; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);
  const row = (title: string, sub: string, dots: SlotTeam[], onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-[8px] bg-[#14181a] hover:bg-[#2e3439] transition-colors px-3 py-2 flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-white">{title}</div>
        <div className="text-[11px] text-white/40">{sub}</div>
      </div>
      <div className="flex items-center gap-[3px] shrink-0">
        {dots.map((team, i) => (
          <span key={i} className="size-[8px] rounded-full" style={{ background: SLOT_TEAM_COLORS[team] }} />
        ))}
      </div>
    </button>
  );
  const list = (side: SlotPreset["side"]) =>
    SLOT_PRESETS.filter((p) => p.side === side).map((p) => (
      <div key={p.id}>
        {row(
          p.title[lang],
          t("{n} slots").replace("{n}", String(p.slots.length)),
          p.slots.map((s) => (isSlotTeam(s.team) ? s.team : "none")),
          () => onPick(p.id),
        )}
      </div>
    ));
  return (
    <div className="fixed inset-0 z-[3000] bg-black/60 flex items-start justify-center p-4 pt-[10vh]" onClick={onClose}>
      <div
        className="bg-[#202427] rounded-[12px] p-4 flex flex-col gap-3 w-full max-w-[440px] max-h-[80dvh] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)] animate-[mbFadeSlide_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="font-slab text-[16px] font-medium text-white flex-1">{t("New squad")}</h2>
          <XButton ariaLabel={t("Dismiss")} onClick={onClose} />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {row(t("Start fresh"), t("One leader seat, build the rest yourself"), ["none"], () => onPick(null))}
          <div className="text-[11px] text-white/40 pt-1">{t("Opfor presets")}</div>
          {list("opfor")}
          <div className="text-[11px] text-white/40 pt-1">{t("Blufor presets")}</div>
          {list("blufor")}
        </div>
      </div>
    </div>
  );
}

export default function PlayersPanel({
  mission,
  update,
  factionKeys,
  onPlayableFaction,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  /** Vanilla + enabled-mod factions (filtered in page.tsx) */
  factionKeys: string[];
  onPlayableFaction: (faction: string) => void;
}) {
  const t = useT();
  const playable = FACTIONS[mission.playableFaction];
  const faction = mission.playableFaction;
  const subfaction = mission.playableSubfaction;
  const loadoutSet: Roster = playable?.loadoutSets[subfaction] ?? [];
  const arty = mission.arty;
  const setArty = (patch: Partial<ArtySupport>) => update({ arty: { ...arty, ...patch } });
  const setGroups = (groups: MissionGroup[]) => update({ groups });
  const advanced = mission.squadMode === "advanced";
  const [picker, setPicker] = useState(false);
  const seats = mission.groups.reduce((n, g) => n + (g.slots?.length ?? 0), 0);

  const setMode = (squadMode: SquadMode) => {
    if (squadMode === mission.squadMode) return;
    if (squadMode === "advanced") {
      // Untouched default squads → start empty (no squads by default in
      // Advanced); edited squads convert to seats (SL + Riflemen) so nothing is lost
      const groups = isDefaultGroups(mission.groups) ? [] : syncGroupSizes(ensureGroupSlots(mission.groups, faction, subfaction));
      update({ squadMode, groups });
    } else {
      update({ squadMode, groups: mission.groups.length ? mission.groups : defaultGroups() });
    }
  };

  const addSquad = (presetId: string | null) => {
    setPicker(false);
    if (mission.groups.length >= MAX_GROUPS) return;
    const slots = presetId ? slotsFromPreset(presetId, faction, subfaction) : [newSlot(faction, subfaction, "SL")];
    setGroups([...mission.groups, { id: freshGroupId(), name: nextCallsign(mission.groups), size: slots.length, slots }]);
  };

  const duplicateSquad = (i: number) => {
    if (mission.groups.length >= MAX_GROUPS) return;
    const g = mission.groups[i];
    const copy: MissionGroup = {
      ...g,
      id: freshGroupId(),
      name: nextCallsign(mission.groups),
      slots: (g.slots ?? []).map((s) => ({ ...s, id: freshSlotId() })),
    };
    setGroups([...mission.groups.slice(0, i + 1), copy, ...mission.groups.slice(i + 1)]);
  };

  const shellRow = (key: "he" | "smoke" | "illum", label: string) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <CheckRow checked={arty[key].on} onChange={(on) => setArty({ [key]: { ...arty[key], on } })}>
          {label}
        </CheckRow>
      </div>
      {arty[key].on && (
        <ShellInput value={arty[key].count} onCommit={(count) => setArty({ [key]: { ...arty[key], count } })} />
      )}
    </div>
  );

  return (
    <>
      <Field label={t("Player Faction")}>
        <SelectInput value={mission.playableFaction} onChange={(e) => onPlayableFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f}>
              {factionMeta(f).label ?? f}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label={t("Player Subfaction")}>
        <SelectInput
          value={mission.playableSubfaction}
          onChange={(e) =>
            update({
              playableSubfaction: e.target.value,
              loadouts: defaultLoadouts(faction, e.target.value),
              arsenal: defaultArsenal(faction, e.target.value),
              groups: retargetSlots(mission.groups, { faction, subfaction }, { faction, subfaction: e.target.value }),
            })
          }
        >
          {Object.keys(playable?.riflemen ?? {}).map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </SelectInput>
      </Field>

      {/* Squad mode: Simple = squads by size + crate loadouts (original flow);
          Advanced = seats bound to loadouts (toolkit slot roster, pak-gated) */}
      <Segmented<SquadMode>
        value={mission.squadMode}
        onChange={setMode}
        options={[
          { value: "simple", label: t("Simple") },
          { value: "advanced", label: t("Advanced") },
        ]}
      />

      {advanced ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-white flex-1">
              {t("Squads")}{" "}
              <span className="text-white/40">
                · {mission.groups.length}/{MAX_GROUPS} · {t("{n} seats").replace("{n}", String(seats))}
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {mission.groups.map((g, i) => (
              <SquadCard
                key={g.id}
                group={g}
                roster={loadoutSet}
                faction={faction}
                subfaction={subfaction}
                canDuplicate={mission.groups.length < MAX_GROUPS}
                onChange={(next) => setGroups(mission.groups.map((x) => (x.id === next.id ? next : x)))}
                onDuplicate={() => duplicateSquad(i)}
                onDelete={() => setGroups(mission.groups.filter((x) => x.id !== g.id))}
              />
            ))}
            {mission.groups.length < MAX_GROUPS && (
              <GhostButton onClick={() => setPicker(true)}>
                <PlusIcon />
                {t("Add squad")}
              </GhostButton>
            )}
          </div>
          {picker && <PresetPicker onPick={addSquad} onClose={() => setPicker(false)} />}
        </>
      ) : (
        <>
          {/* Player squads → playable faction m_aSquadNames + m_aPredefinedGroups */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-white flex-1">
              {t("Squads")}{" "}
              <span className="text-white/40">
                · {mission.groups.length}/{MAX_GROUPS}
              </span>
            </span>
            <GhostButton small onClick={() => setGroups(defaultGroups())}>
              {t("Reset")}
            </GhostButton>
          </div>
          <div className="flex flex-col gap-2">
            {mission.groups.map((g, i) => (
              <div key={g.id} className="flex items-center gap-2">
                <TextInput
                  className="flex-1 min-w-0"
                  placeholder={t("Squad name")}
                  maxLength={24}
                  value={g.name}
                  onChange={(e) => setGroups(mission.groups.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                />
                <SizeInput
                  value={g.size}
                  onCommit={(size) => setGroups(mission.groups.map((x, j) => (j === i ? { ...x, size } : x)))}
                />
                {mission.groups.length > 1 && (
                  <TrashButton label={t("Remove squad")} onClick={() => setGroups(mission.groups.filter((_, j) => j !== i))} />
                )}
              </div>
            ))}
            {mission.groups.length < MAX_GROUPS && (
              <GhostButton
                onClick={() =>
                  setGroups([...mission.groups, { id: freshGroupId(), name: nextCallsign(mission.groups), size: 9 }])
                }
              >
                <PlusIcon />
                {t("Add squad")}
              </GhostButton>
            )}
          </div>

          <Divider />

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-white flex-1">
              {t("Loadouts")}{" "}
              <span className="text-white/40">
                {t("· {n} selected").replace("{n}", String(mission.loadouts.length))}
              </span>
            </span>
            <GhostButton small onClick={() => update({ loadouts: loadoutSet.map((l) => l.prefab) })}>
              {t("All")}
            </GhostButton>
            <GhostButton small onClick={() => update({ loadouts: defaultLoadouts(faction, subfaction) })}>
              {t("Reset")}
            </GhostButton>
          </div>
          <div className="flex flex-col gap-2">
            {loadoutSet.map((l) => (
              <CheckRow
                key={l.prefab}
                checked={mission.loadouts.includes(l.prefab)}
                onChange={(on) => {
                  const next = on ? [...mission.loadouts, l.prefab] : mission.loadouts.filter((p) => p !== l.prefab);
                  update({ loadouts: next });
                }}
              >
                {l.name}
              </CheckRow>
            ))}
          </div>
        </>
      )}

      <Divider />

      {/* Artillery support → TS_FireSupportManagerComponent on GameModeSF */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">{t("Artillery Support")}</span>
        <Toggle checked={arty.enabled} onChange={(enabled) => setArty({ enabled })} ariaLabel={t("Artillery Support")} />
      </div>
      {arty.enabled && (
        <div className="flex flex-col gap-2 animate-[mbFadeSlide_0.2s_ease]">
          {shellRow("he", t("HE shells"))}
          {shellRow("smoke", t("Smoke shells"))}
          {shellRow("illum", t("Illumination shells"))}
        </div>
      )}
    </>
  );
}
