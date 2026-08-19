"use client";

import { useEffect, useRef, useState } from "react";
import { FACTIONS, vehicleSizeClass } from "mission-gen";
import type { Mission, PlaceMode, SpawnVehicle } from "@/lib/mission";
import { sanitizeSpawnDenials } from "@/lib/mission";
import { useT } from "@/lib/i18n";
import ArsenalBuilderModal from "../ArsenalBuilderModal";
import { Divider, GhostButton, SectionLabel, SelectInput } from "../ui";

const MAX_CRATES = 8;
const MAX_SPAWN_POINTS = 8;

export default function SpawnPanel({
  mission,
  placeMode,
  setPlaceMode,
  update,
  updateSpawn,
  selectedSpawnEl,
  revealSeq,
  selectSpawnEl,
  onAddVehicle,
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
  /** Row click → select the element on the map + fly to it */
  selectSpawnEl: (key: string) => void;
  /** Vehicle picked in the dropdown → arms "spawn-vehicle" map placement */
  onAddVehicle: (type: string) => void;
}) {
  const t = useT();
  const spawn = mission.spawn;
  const playable = FACTIONS[mission.playableFaction];
  const placing = placeMode === "spawn";
  const togglePlace = () => setPlaceMode(placing ? null : "spawn");
  /** Per-element add buttons toggle their map placement mode. */
  const toggleAdd = (m: PlaceMode) => setPlaceMode(placeMode === m ? null : m);
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
  // Two-line card variant of rowClass (spawn points: header + squad chips)
  const cardClass = (key: string) =>
    `flex flex-col gap-1 rounded-[4px] p-2 bg-[#14181a] border transition-colors ${
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] hover:bg-[#2e3439] transition-colors"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/zones/trash.svg" alt="" style={{ width: 14, height: 14 }} />
    </button>
  );

  const vehRow = (v: SpawnVehicle) => (
    <div
      key={v.id}
      ref={bindRowRef(`veh:${v.id}`)}
      className={`${rowClass(`veh:${v.id}`)} cursor-pointer`}
      onClick={() => selectSpawnEl(`veh:${v.id}`)}
    >
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
              "Hit the button above, then click anywhere on the map to drop the spawn point and an arsenal crate. Add vehicles, crates, spawn points and a FARP from this panel — each is placed with its own map click."
            )}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
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

      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-white">{t("FARP composition")}</span>
        {spawn.farp ? (
          <GhostButton small onClick={() => updateSpawn({ farp: false })}>
            {t("Delete FARP")}
          </GhostButton>
        ) : (
          <GhostButton small active={placeMode === "spawn-farp"} onClick={() => toggleAdd("spawn-farp")}>
            {placeMode === "spawn-farp" ? t("Click the map… (cancel)") : t("Add FARP (click map)")}
          </GhostButton>
        )}
      </div>

      <Divider />

      <SectionLabel>{t("Spawn points")}</SectionLabel>
      {spawn.spawnPoints.length > 1 && (
        <span className="text-[11px] leading-4 text-white/40">
          {t("Untick squads that must not deploy at a point.")}
        </span>
      )}
      <div className="flex flex-col gap-1">
        {spawn.spawnPoints.map((p, i) => {
          const single = spawn.spawnPoints.length === 1;
          return (
            <div
              key={p.id}
              ref={bindRowRef(`sp:${p.id}`)}
              className={`${cardClass(`sp:${p.id}`)} cursor-pointer`}
              onClick={() => selectSpawnEl(`sp:${p.id}`)}
            >
              <div className="flex items-center gap-2 min-h-[24px]">
                <span className="flex-1 min-w-0 truncate text-[12px] text-white/80">
                  {t("Spawn point")} {i + 1}
                </span>
                {!single &&
                  trashBtn(t("Remove spawn point"), () =>
                    updateSpawn({
                      spawnPoints: sanitizeSpawnDenials(
                        spawn.spawnPoints.filter((x) => x.id !== p.id),
                        mission.groups
                      ),
                    })
                  )}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1" onClick={(e) => e.stopPropagation()}>
                {mission.groups.map((g, gi) => {
                  const checked = !p.denied.includes(g.id);
                  const allowedCount = spawn.spawnPoints.filter((pp) => !pp.denied.includes(g.id)).length;
                  // Single point: everything ON, locked (no alternative to
                  // exclude from). Otherwise a squad's LAST allowed point
                  // stays locked so every squad can always deploy somewhere.
                  const disabled = single || (checked && allowedCount === 1);
                  return (
                    <label
                      key={g.id}
                      className={`flex items-center gap-1 ${disabled ? "opacity-40" : "cursor-pointer"}`}
                      title={
                        single
                          ? t("Only spawn point — all squads deploy here.")
                          : disabled
                            ? t("This squad's last spawn point.")
                            : undefined
                      }
                    >
                      <input
                        type="checkbox"
                        className="size-[12px] accent-[#f4db50]"
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) =>
                          updateSpawn({
                            spawnPoints: spawn.spawnPoints.map((pp) =>
                              pp.id === p.id
                                ? {
                                    ...pp,
                                    denied: e.target.checked
                                      ? pp.denied.filter((d) => d !== g.id)
                                      : [...pp.denied, g.id],
                                  }
                                : pp
                            ),
                          })
                        }
                      />
                      <span className="text-[11px] text-white/70 truncate max-w-[120px]">
                        {g.name.trim() || `1'${gi + 1}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {spawn.spawnPoints.length < MAX_SPAWN_POINTS && (
        <GhostButton active={placeMode === "spawn-point"} onClick={() => toggleAdd("spawn-point")}>
          {placeMode === "spawn-point" ? t("Click the map… (cancel)") : t("+ add spawn point")}
        </GhostButton>
      )}

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
          <div
            key={c.id}
            ref={bindRowRef(`crate:${c.id}`)}
            className={`${rowClass(`crate:${c.id}`)} cursor-pointer`}
            onClick={() => selectSpawnEl(`crate:${c.id}`)}
          >
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
        <GhostButton active={placeMode === "spawn-crate"} onClick={() => toggleAdd("spawn-crate")}>
          {placeMode === "spawn-crate" ? t("Click the map… (cancel)") : t("+ add crate")}
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
            onAddVehicle(type);
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
