"use client";

import { TERRAIN_LIST } from "@/lib/terrains";
import type { Mission } from "@/lib/mission";
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
  return (
    <>
      <Field label="Name">
        <TextInput
          value={mission.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
        />
      </Field>
      <Field label="Author">
        <TextInput value={mission.author} onChange={(e) => update({ author: e.target.value })} />
      </Field>
      <Field label="Player count">
        <TextInput
          type="number"
          min={1}
          max={128}
          value={mission.playerCount}
          onChange={(e) => update({ playerCount: +e.target.value || 24 })}
        />
      </Field>
      <Field label="Terrain">
        <SelectInput
          value={mission.terrain}
          onChange={(e) =>
            update({
              terrain: e.target.value,
              spawn: { ...mission.spawn, placed: false },
              zones: [],
              markers: [],
            })
          }
        >
          {TERRAIN_LIST.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Hint>Changing terrain clears placements.</Hint>
      <Divider />
      <GhostButton destructive onClick={onReset}>
        Reset mission
      </GhostButton>
    </>
  );
}
