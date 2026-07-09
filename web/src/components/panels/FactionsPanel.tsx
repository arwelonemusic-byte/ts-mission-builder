"use client";

import { FACTIONS } from "mission-gen";
import { defaultLoadouts, type Mission } from "@/lib/mission";
import { CheckRow, Divider, Field, GhostButton, SelectInput } from "../ui";

export default function FactionsPanel({
  mission,
  update,
  onPlayableFaction,
  onEnemyFaction,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  onPlayableFaction: (faction: string) => void;
  onEnemyFaction: (faction: string) => void;
}) {
  const factionKeys = Object.keys(FACTIONS);
  const playable = FACTIONS[mission.playableFaction];
  const enemy = FACTIONS[mission.enemyFaction];
  const loadoutSet = playable?.loadoutSets[mission.playableSubfaction] ?? [];

  return (
    <>
      <Field label="Player Faction">
        <SelectInput value={mission.playableFaction} onChange={(e) => onPlayableFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Player Subfaction">
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
        <span className="text-[12px] text-white flex-1">Loadouts</span>
        <GhostButton
          small
          onClick={() => update({ loadouts: loadoutSet.map((l) => l.prefab) })}
        >
          All
        </GhostButton>
        <GhostButton
          small
          onClick={() =>
            update({ loadouts: defaultLoadouts(mission.playableFaction, mission.playableSubfaction) })
          }
        >
          Reset
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

      <Field label="Enemy Faction">
        <SelectInput value={mission.enemyFaction} onChange={(e) => onEnemyFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f} disabled={f === mission.playableFaction}>
              {f}
              {f === mission.playableFaction ? " (playable)" : ""}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="text-[12px] text-white">Enemy troops (mix any)</div>
      <div className="flex flex-col gap-2">
        {Object.entries(enemy?.groupSets ?? {}).map(([key, gs]) => (
          <CheckRow
            key={key}
            checked={mission.enemyGroupSets.includes(key)}
            onChange={(on) => {
              const next = on
                ? [...mission.enemyGroupSets, key]
                : mission.enemyGroupSets.filter((k) => k !== key);
              if (next.length === 0) return; // keep at least one set selected
              update({ enemyGroupSets: next });
            }}
          >
            {(gs as { label: string }).label}
          </CheckRow>
        ))}
      </div>
    </>
  );
}
