"use client";

import { MODS } from "mission-gen";
import { TERRAIN_LIST, terrainByKey } from "@/lib/terrains";
import type { Mission } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import { CheckRow, Divider, Field, GhostButton, Hint, SelectInput, TextInput } from "../ui";

export default function MissionPanel({
  mission,
  update,
  onMods,
  onReset,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  onMods: (mods: string[]) => void;
  onReset: () => void;
}) {
  const t = useT();
  // Required addons = toolkit (always) + the selected map's addon (modded
  // terrains) + every enabled content mod. Mirrors what the player must have
  // installed, not what the generator ends up listing as dependencies.
  const terrain = terrainByKey(mission.terrain);
  const requiredAddons = [
    {
      label: "TS Mission Toolkit",
      url: "https://reforger.armaplatform.com/workshop/6906F4528B72651A-TSMissionToolkit",
    },
    ...(terrain.modded && terrain.workshopUrl
      ? [{ label: terrain.label, url: terrain.workshopUrl }]
      : []),
    ...mission.mods
      .map((id) => MODS[id])
      .filter(Boolean)
      .map((mod) => ({ label: mod.label, url: mod.workshopUrl })),
  ];
  return (
    <>
      <div className="bg-[rgba(244,219,80,0.12)] border border-[rgba(244,219,80,0.4)] rounded-[8px] p-3 flex flex-col gap-1">
        <span className="text-[14px] leading-[20px] font-bold text-[#f4db50]">{t("Important!")}</span>
        <span className="text-[12px] leading-[16px] text-white/80">
          {t("Make sure you have these addons installed and updated:")}
        </span>
        {requiredAddons.map((addon) => (
          <a
            key={addon.url}
            href={addon.url}
            target="_blank"
            rel="noopener"
            className="w-max max-w-full text-[12px] leading-[16px] font-medium text-[#f4db50] underline underline-offset-2 hover:text-[#f9e278] transition-colors"
          >
            {addon.label} — Reforger Workshop
          </a>
        ))}
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
          {TERRAIN_LIST.filter((tn) => !tn.modded).map((tn) => (
            <option key={tn.key} value={tn.key}>
              {tn.label}
            </option>
          ))}
          {TERRAIN_LIST.some((tn) => tn.modded) && (
            <option disabled aria-hidden value="">
              ──────────
            </option>
          )}
          {TERRAIN_LIST.filter((tn) => tn.modded).map((tn) => (
            <option key={tn.key} value={tn.key}>
              {tn.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Hint>{t("Changing terrain clears placements.")}</Hint>
      <Divider />
      {/* Content mods: gate which factions the builder offers. Disabling a mod
          resets any faction selections that depend on it (page.tsx setMods). */}
      <div className="text-[12px] text-white">{t("Supported mods")}</div>
      <div className="flex flex-col gap-2">
        {Object.values(MODS).map((mod: { id: string; label: string; workshopUrl: string }) => {
          const on = mission.mods.includes(mod.id);
          return (
            <div key={mod.id} className="flex flex-col gap-1">
              <CheckRow
                checked={on}
                onChange={(next) =>
                  onMods(next ? [...mission.mods, mod.id] : mission.mods.filter((x) => x !== mod.id))
                }
              >
                {mod.label}
              </CheckRow>
            </div>
          );
        })}
      </div>
      <Divider />
      <GhostButton destructive onClick={onReset}>
        {t("Reset mission")}
      </GhostButton>
    </>
  );
}
