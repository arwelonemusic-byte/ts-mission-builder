"use client";

import { useEffect, useRef, useState } from "react";
import { MODS } from "mission-gen";
import { TERRAIN_LIST, terrainByKey } from "@/lib/terrains";
import type { Mission } from "@/lib/mission";
import { prepareThumbnailSource, thumbnailPreviewUrl } from "@/lib/thumbnail";
import { useT } from "@/lib/i18n";
import { CheckRow, Divider, Field, GhostButton, Hint, SelectInput, TextInput } from "../ui";

export default function MissionPanel({
  mission,
  update,
  onMods,
  onReset,
  onSaveFile,
  onLoadFile,
}: {
  mission: Mission;
  update: (patch: Partial<Mission>) => void;
  onMods: (mods: string[]) => void;
  onReset: () => void;
  onSaveFile: () => void;
  onLoadFile: (file: File) => void;
}) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // Live thumbnail preview. Compositing a 1920x1200 canvas per keystroke is
  // wasteful, so the name edits are debounced; the object URL is swapped (and
  // the old one revoked) only once a render actually completes.
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const [thumbBusy, setThumbBusy] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(async () => {
      try {
        const url = await thumbnailPreviewUrl(mission.thumbnail, mission.displayName);
        if (!alive) {
          URL.revokeObjectURL(url);
          return;
        }
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = url;
        setPreview(url);
      } catch {
        // preview is cosmetic — a failure here must not break the panel
      }
    }, 300);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [mission.thumbnail, mission.displayName]);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    []
  );

  async function onPickImage(file: File) {
    setThumbError(null);
    setThumbBusy(true);
    try {
      update({ thumbnail: await prepareThumbnailSource(file) });
    } catch (e) {
      setThumbError(e instanceof Error ? e.message : String(e));
    } finally {
      setThumbBusy(false);
    }
  }

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
          {t("Make sure you have these addons and their dependencies installed and updated:")}
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
      {/* Content mods: gate which factions the builder offers. Disabling a mod
          resets any faction selections that depend on it (page.tsx setMods).
          Sits right under the Important callout so enabling a mod visibly
          extends the required-addons list above it. */}
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
          {TERRAIN_LIST.filter((tn) => tn.modded)
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((tn) => (
              <option key={tn.key} value={tn.key}>
                {tn.label}
              </option>
            ))}
        </SelectInput>
      </Field>
      <Hint>{t("Changing terrain clears placements.")}</Hint>
      <Divider />
      <Field label={t("Name")}>
        <TextInput
          value={mission.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
        />
      </Field>
      <Field label={t("Author")}>
        <TextInput value={mission.author} onChange={(e) => update({ author: e.target.value })} />
      </Field>
      {/* Thumbnail: one image drives m_sIcon / m_sLoadingScreen /
          m_sPreviewImage. The photo is composited under the TS template and
          the mission name is drawn in, so every mission looks consistent. */}
      <Divider />
      <div className="text-[12px] text-white">{t("Thumbnail")}</div>
      <div className="w-full aspect-[8/5] rounded-[8px] overflow-hidden bg-black/40 border border-white/10">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-[11px] text-white/40">
            {t("Loading preview…")}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <GhostButton small className="flex-1" onClick={() => imageRef.current?.click()}>
          {thumbBusy
            ? t("Loading preview…")
            : mission.thumbnail
              ? t("Replace image")
              : t("Upload image")}
        </GhostButton>
        {mission.thumbnail && (
          <GhostButton small className="flex-1" onClick={() => update({ thumbnail: null })}>
            {t("Remove image")}
          </GhostButton>
        )}
      </div>
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onPickImage(file);
        }}
      />
      {thumbError && <Hint>{thumbError}</Hint>}
      <Hint>{t("Your image sits under the frame; the mission name is drawn on top. 1920×1200 fits exactly.")}</Hint>
      <Divider />
      {/* Mission file: the only export path that works outside Chrome/Edge —
          a Firefox user saves the .json and hands it to someone who can
          generate the addon. Doubles as a backup and a sharing format. */}
      <div className="text-[12px] text-white">{t("Mission file")}</div>
      <div className="flex gap-2">
        <GhostButton small className="flex-1" onClick={onSaveFile}>
          {t("Save to file")}
        </GhostButton>
        <GhostButton small className="flex-1" onClick={() => fileRef.current?.click()}>
          {t("Load from file")}
        </GhostButton>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Clear the value so re-picking the SAME file fires change again
          e.target.value = "";
          if (file) onLoadFile(file);
        }}
      />
      <Hint>{t("Works in any browser — back up a mission or hand it to someone else.")}</Hint>
      <Divider />
      <GhostButton destructive onClick={onReset}>
        {t("Reset mission")}
      </GhostButton>
    </>
  );
}
