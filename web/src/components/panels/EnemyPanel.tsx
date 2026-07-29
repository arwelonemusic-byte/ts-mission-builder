"use client";

import { FACTIONS } from "mission-gen";
import { factionMeta, type Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { CheckRow, Field, SelectInput } from "../ui";

export default function EnemyPanel({
  mission,
  update,
  factionKeys,
  onEnemyFaction,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  /** Vanilla + enabled-mod factions (filtered in page.tsx) */
  factionKeys: string[];
  onEnemyFaction: (faction: string) => void;
}) {
  const t = useT();
  const enemy = FACTIONS[mission.enemyFaction];
  // Alias factions share their base's in-game FactionKey — both sides of an
  // alias pair would be the same faction, so the pairing is disabled.
  const pf = mission.playableFaction;
  const aliasConflict = (f: string) =>
    FACTIONS[f]?.aliasOf === pf || FACTIONS[pf]?.aliasOf === f;
  const suffix = (f: string) => {
    if (f === pf) return t(" (playable)");
    if (aliasConflict(f)) {
      return `${t(" (incompatible with playable ")}${factionMeta(pf).label ?? pf})`;
    }
    return "";
  };

  return (
    <>
      <Field label={t("Enemy Faction")}>
        <SelectInput value={mission.enemyFaction} onChange={(e) => onEnemyFaction(e.target.value)}>
          {factionKeys.map((f) => (
            <option key={f} value={f} disabled={f === mission.playableFaction || aliasConflict(f)}>
              {factionMeta(f).label ?? f}
              {suffix(f)}
            </option>
          ))}
        </SelectInput>
      </Field>
      {/* Single-set factions (e.g. MEI's combined pool) have no choice to make */}
      {Object.keys(enemy?.groupSets ?? {}).length > 1 && (
        <>
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
      )}
    </>
  );
}
