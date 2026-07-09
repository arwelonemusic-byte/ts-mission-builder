"use client";

import { FACTIONS } from "mission-gen";
import { defaultLoadouts, type ArtySupport, type Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { CheckRow, Divider, Field, GhostButton, SelectInput, Toggle } from "../ui";

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

export default function PlayersPanel({
  mission,
  update,
  onPlayableFaction,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  onPlayableFaction: (faction: string) => void;
}) {
  const t = useT();
  const factionKeys = Object.keys(FACTIONS);
  const playable = FACTIONS[mission.playableFaction];
  const loadoutSet = playable?.loadoutSets[mission.playableSubfaction] ?? [];
  const arty = mission.arty;
  const setArty = (patch: Partial<ArtySupport>) => update({ arty: { ...arty, ...patch } });
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
              {f}
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
              loadouts: defaultLoadouts(mission.playableFaction, e.target.value),
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
        <GhostButton
          small
          onClick={() =>
            update({ loadouts: defaultLoadouts(mission.playableFaction, mission.playableSubfaction) })
          }
        >
          {t("Reset")}
        </GhostButton>
      </div>
      <div className="flex flex-col gap-2">
        {loadoutSet.map((l) => (
          <CheckRow
            key={l.prefab}
            checked={mission.loadouts.includes(l.prefab)}
            onChange={(on) => {
              const next = on
                ? [...mission.loadouts, l.prefab]
                : mission.loadouts.filter((p) => p !== l.prefab);
              update({ loadouts: next });
            }}
          >
            {l.name}
          </CheckRow>
        ))}
      </div>

      <Divider />

      {/* Artillery support → TS_FireSupportManagerComponent on GameModeSF */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">{t("Artillery Support")}</span>
        <Toggle
          checked={arty.enabled}
          onChange={(enabled) => setArty({ enabled })}
          ariaLabel={t("Artillery Support")}
        />
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
