"use client";

import { TERRAIN_LIST } from "@/lib/terrains";
import type { Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { Divider, Field, GhostButton, Hint, SelectInput, TextInput } from "../ui";

export default function MissionPanel({
  mission,
  update,
  onReset,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  onReset: () => void;
}) {
  const t = useT();
  return (
    <>
      <div className="bg-[rgba(244,219,80,0.12)] border border-[rgba(244,219,80,0.4)] rounded-[8px] p-3 flex flex-col gap-1">
        <span className="text-[14px] leading-[20px] font-bold text-[#f4db50]">{t("Important!")}</span>
        <span className="text-[12px] leading-[16px] text-white/80">
          {t("Make sure you have the TS Mission Toolkit addon installed and updated:")}
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
      <Field label={t("Name")}>
        <TextInput
          value={mission.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
        />
      </Field>
      <Field label={t("Author")}>
        <TextInput value={mission.author} onChange={(e) => update({ author: e.target.value })} />
      </Field>
      <Field label={t("Player count")}>
        <TextInput
          type="number"
          min={1}
          max={128}
          value={mission.playerCount}
          onChange={(e) => update({ playerCount: +e.target.value || 24 })}
        />
      </Field>
      <Field label={t("Terrain")}>
        <SelectInput
          value={mission.terrain}
          onChange={(e) =>
            update({
              terrain: e.target.value,
              spawn: { ...mission.spawn, placed: false },
              zones: [],
              markers: [],
              sectors: [],
            })
          }
        >
          {TERRAIN_LIST.map((tn) => (
            <option key={tn.key} value={tn.key}>
              {tn.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Hint>{t("Changing terrain clears placements.")}</Hint>
      <Divider />
      <GhostButton destructive onClick={onReset}>
        {t("Reset mission")}
      </GhostButton>
    </>
  );
}
