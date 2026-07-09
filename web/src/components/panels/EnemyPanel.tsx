"use client";

import { FACTIONS } from "mission-gen";
import type { Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { CheckRow, Field, SelectInput } from "../ui";

export default function EnemyPanel({
  mission,
  update,
  onEnemyFaction,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  onEnemyFaction: (faction: string) => void;
}) {
  const t = useT();
  const factionKeys = Object.keys(FACTIONS);
  const enemy = FACTIONS[mission.enemyFaction];

  return (
    <>
      <Field label={t("Enemy Faction")}>
        <SelectInput value={mission.enemyFaction} onChange={(e) => onEnemyFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f} disabled={f === mission.playableFaction}>
              {f}
              {f === mission.playableFaction ? t(" (playable)") : ""}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="text-[12px] text-white">{t("Enemy troops (mix any)")}</div>
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
