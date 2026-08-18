"use client";

import { useEffect, useRef, useState } from "react";
import { FACTIONS, autoPlaceSpawnElement, vehicleSizeClass } from "mission-gen";
import type { Mission, PlaceMode, SpawnVehicle } from "@/lib/mission";
import { freshSpawnElemId } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import ArsenalBuilderModal from "../ArsenalBuilderModal";
import { Divider, GhostButton, SectionLabel, SelectInput, Toggle } from "../ui";

const MAX_CRATES = 8;

export default function SpawnPanel({
  mission,
  placeMode,
  setPlaceMode,
  update,
  updateSpawn,
  selectedSpawnEl,
  revealSeq,
}: {
  mission: Mission;
  placeMode: PlaceMode;
  setPlaceMode: (m: PlaceMode) => void;
  update: (patch: Partial<Mission>) => void;
  updateSpawn: (patch: Partial<Mission["spawn"]>) => void;
  /** Map-selected element key — highlights the matching crate/vehicle row */
  selectedSpawnEl: string | null;
  /** Bumped on every map click so re-selecting re-reveals the row */
  revealSeq: number;
}) {
  const t = useT();
  const spawn = mission.spawn;
  const playable = FACTIONS[mission.playableFaction];
  const placing = placeMode === "spawn";
  const togglePlace = () => setPlaceMode(placing ? null : "spawn");
  const [arsenalOpen, setArsenalOpen] = useState(false);

  // Ground vehicles and helicopters are grouped visually; every element is
  // freely placed on the map, so list order carries no meaning and rows
  // delete by id.
  const ground: SpawnVehicle[] = [];
  const helis: SpawnVehicle[] = [];
  for (const v of spawn.vehicles) (vehicleSizeClass(v.type) === "heli" ? helis : ground).push(v);

  // When an element is selected on the map, reveal its row in the panel
  // (same pattern as PropsPanel cards).
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => {
    if (!selectedSpawnEl) return;
    rowRefs.current.get(selectedSpawnEl)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedSpawnEl, revealSeq]);

  const rowClass = (key: string) =>
    `flex items-center gap-2 h-[32px] rounded-[4px] pl-3 pr-1 bg-[#14181a] border transition-colors ${
      selectedSpawnEl === key ? "border-[#f4db50]" : "border-transparent"
    }`;
  const bindRowRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) rowRefs.current.set(key, el);
    else rowRefs.current.delete(key);
  };

  const trashBtn = (label: string, onClick: () => void) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/zones/trash.svg" alt="" style={{ width: 14, height: 14 }} />
    </button>
  );

  const vehRow = (v: SpawnVehicle) => (
    <div key={v.id} ref={bindRowRef(`veh:${v.id}`)} className={rowClass(`veh:${v.id}`)}>
      <span className="flex-1 min-w-0 truncate text-[12px] text-white/80">
        {spawn.vehicles.indexOf(v) + 1}. {playable?.vehicleLabels[v.type] ?? v.type}
      </span>
      {trashBtn(t("Remove vehicle"), () =>
        updateSpawn({ vehicles: spawn.vehicles.filter((x) => x.id !== v.id) })
      )}
    </div>
  );

  if (!spawn.placed) {
    return (
      <>
        <GhostButton active={placing} onClick={togglePlace}>
          {placing ? t("Click the map… (cancel)") : t("Place spawn (click map)")}
        </GhostButton>
        <div className="border border-dashed border-[#2e3439] rounded-[8px] px-4 py-6 flex flex-col items-center gap-[10px] text-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f4db50" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M22 12a10 10 0 1 1-20 0a10 10 0 0 1 20 0M22 12h-4M6 12H2M12 6V2M12 22v-4" />
            <circle cx="12" cy="12" r="1.5" fill="#f4db50" stroke="none" />
          </svg>
          <span className="text-[13px] font-medium text-white">{t("No spawn point yet")}</span>
          <span className="text-[11px] leading-4 text-white/40 max-w-[260px]">
            {t(
              "Hit the button above, then click anywhere on the map. The base bundle — spawn point, arsenal crate and vehicles — is laid out around it. Drag any element on the map to rearrange your base."
            )}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Move-spawn translates the WHOLE base in its current arrangement —
          individual elements move by dragging them on the map. */}
      <GhostButton active={placing} onClick={togglePlace}>
        {placing ? t("Click the map… (cancel)") : t("Move spawn (click map)")}
      </GhostButton>
      {arsenalOpen && (
        <ArsenalBuilderModal
          faction={mission.playableFaction}
          subfaction={mission.playableSubfaction}
          mods={mission.mods}
          arsenal={mission.arsenal}
          onChange={(refs) => update({ arsenal: refs })}
          onClose={() => setArsenalOpen(false)}
        />
      )}
      <span className="text-[11px] leading-4 text-white/40">
        {t("Drag elements on the map to move them; select one to rotate it.")}
      </span>

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white">{t("FARP composition")}</span>
        <Toggle
          checked={spawn.farp}
          onChange={(on) => updateSpawn({ farp: on })}
          ariaLabel={t("FARP composition")}
        />
      </div>

      <Divider />

      <div className="flex items-center justify-between">
        <SectionLabel>{t("Arsenal crates")}</SectionLabel>
        <button
          type="button"
          onClick={() => setArsenalOpen(true)}
          className="text-[12px] text-[#f4db50] hover:text-[#f9e278] transition-colors"
        >
          {t("Arsenal Builder")}
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {spawn.crates.map((c, i) => (
          <div key={c.id} ref={bindRowRef(`crate:${c.id}`)} className={rowClass(`crate:${c.id}`)}>
            <span className="flex-1 min-w-0 truncate text-[12px] text-white/80">
              {t("Arsenal crate")} {i + 1}
            </span>
            {spawn.crates.length > 1 &&
              trashBtn(t("Remove crate"), () =>
                updateSpawn({ crates: spawn.crates.filter((x) => x.id !== c.id) })
              )}
          </div>
        ))}
      </div>
      {spawn.crates.length < MAX_CRATES && (
        <GhostButton
          onClick={() =>
            updateSpawn({
              crates: [...spawn.crates, { id: freshSpawnElemId(), ...autoPlaceSpawnElement(spawn, "crate") }],
            })
          }
        >
          {t("+ add crate")}
        </GhostButton>
      )}

      <Divider />

      <SectionLabel>{t("Vehicles")}</SectionLabel>
      {spawn.vehicles.length > 0 && (
        <div className="flex flex-col gap-1">
          {ground.map(vehRow)}
          {ground.length > 0 && helis.length > 0 && <div className="border-t border-[#2e3439] my-1" />}
          {helis.map(vehRow)}
        </div>
      )}
      {Object.keys(playable?.vehicles ?? {}).length === 0 ? (
        <span className="text-[11px] leading-4 text-white/40">
          {t("No vehicle catalogue for this faction yet.")}
        </span>
      ) : (
        <SelectInput
          value=""
          onChange={(e) => {
            const type = e.target.value;
            if (!type) return;
            updateSpawn({
              vehicles: [
                ...spawn.vehicles,
                { id: freshSpawnElemId(), type, ...autoPlaceSpawnElement(spawn, vehicleSizeClass(type)) },
              ],
            });
          }}
        >
          <option value="">{t("+ add vehicle…")}</option>
          {Object.keys(playable?.vehicles ?? {}).map((vk) => (
            <option key={vk} value={vk}>
              {playable?.vehicleLabels[vk] ?? vk}
            </option>
          ))}
        </SelectInput>
      )}
    </>
  );
}
