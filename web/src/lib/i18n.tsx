"use client";

// UI localization (EN → RU). Source of truth: input/localization.md (user-
// approved table). EN strings ARE the keys — components stay readable and any
// string missing from the table just renders in English. Data-driven names
// (loadouts, vehicles, enemy group sets, terrains) are intentionally not
// translated — they come from generator/catalogue.mjs.

import { createContext, useContext, useMemo } from "react";

export type Lang = "en" | "ru";

export const LANG_STORAGE_KEY = "ts-mission-builder-lang";

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    if (v === "ru" || v === "en") return v;
  } catch {
    // storage unavailable — fall through to the system language
  }
  // First visit: follow the browser/system language (an explicit toggle
  // choice is persisted and takes precedence on later visits).
  const sys = [...(navigator.languages ?? []), navigator.language ?? ""];
  if (sys.some((l) => l?.toLowerCase().startsWith("ru"))) return "ru";
  return "en";
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // storage unavailable — language just won't persist
  }
}

const RU: Record<string, string> = {
  // App chrome
  "Mission Builder": "Конструктор миссий",
  Generate: "Создать",
  "Generating…": "Создание…",
  "More options": "Ещё",

  // Tabs
  Mission: "Миссия",
  Players: "Игроки",
  Enemy: "Противник",
  Spawn: "Спавн",
  Zones: "Зоны",
  Markers: "Маркеры",
  Brief: "Брифинг",

  // Panel titles
  "Mission setup": "Настройка миссии",
  "Players & loadouts": "Игроки и снаряжение",
  "Enemy forces": "Силы противника",
  // "Spawn" panel title shares the tab entry above
  "AI Zones": "Ботозоны",
  Briefing: "Брифинг",

  // Mission tab
  Name: "Название",
  Author: "Автор",
  Terrain: "Карта",
  "Changing terrain clears placements.": "Смена карты удаляет всё размещённое.",
  "Reset mission": "Сбросить миссию",
  "Reset the whole mission?": "Сбросить всю миссию?",
  "Important!": "Важно!",
  "Make sure you have these addons installed and updated:":
    "Убедитесь, что эти аддоны установлены и обновлены:",
  "Supported mods": "Поддерживаемые моды",

  // Players tab
  "Player Faction": "Фракция игроков",
  "Player Subfaction": "Подфракция игроков",
  Loadouts: "Снаряжение",
  "· {n} selected": "· выбрано: {n}",
  All: "Все",
  Reset: "Сброс",
  "Artillery Support": "Артиллерийская поддержка",
  "HE shells": "Осколочно-фугасные",
  "Smoke shells": "Дымовые",
  "Illumination shells": "Осветительные",

  // Enemy tab
  "Enemy Faction": "Фракция противника",
  " (playable)": " (игроки)",
  "Enemy troops (mix any)": "Войска противника (можно несколько)",

  // Spawn tab
  "Place spawn (click map)": "Разместить спавн (клик по карте)",
  "Move spawn (click map)": "Передвинуть спавн (клик по карте)",
  "Click the map… (cancel)": "Кликните по карте… (отмена)",
  "Show on map": "Показать на карте",
  "No spawn point yet": "Точка спавна не размещена",
  "Hit the button above, then click anywhere on the map. The base bundle — spawn point, arsenal crate and vehicles — is laid out around it.":
    "Нажмите кнопку выше и кликните в любом месте карты. Вокруг точки будет размещена база — спавн, ящик снаряжения и техника.",
  Rotation: "Поворот",
  "⚠ Uneven ground: {n} m elevation change across the bundle footprint. Consider moving or rotating the spawn.":
    "⚠ Неровная поверхность: перепад высот {n} м в границах базы. Попробуйте передвинуть или повернуть спавн.",
  "FARP composition": "FARP",
  Vehicles: "Техника",
  "+ add vehicle…": "+ добавить технику…",
  "No vehicle catalogue for this faction yet.": "Для этой фракции пока нет каталога техники.",
  "Drag to reorder": "Перетащите, чтобы изменить порядок",
  "Remove vehicle": "Убрать технику",
  "Arsenal crate": "Ящик снаряжения",
  "Spawn point": "Точка спавна",

  // Zones tab ("+" is an svg icon on the button, not part of the label)
  "Add zone (click map)": "Добавить зону (клик по карте)",
  "No AI zones yet": "Ботозоны не добавлены",
  "AI zones spawn enemy activity — garrisons, patrols, fortifications — around a map point. Drop one near an objective.":
    "Ботозоны создают активность противника — гарнизоны, патрули, укрепления — вокруг точки на карте. Разместите зону рядом с целью.",
  Radius: "Радиус",
  "Defense Group": "Группа обороны",
  "Foot Patrols": "Пешие патрули",
  Garrison: "Гарнизон",
  "Vehicle Patrols": "Патрули на технике",
  Fortifications: "Укрепления",
  "Large group in the center with a defend waypoint": "Большая группа в центре зоны с приказом обороняться",
  "Groups with random patrol waypoints": "Группы со случайными маршрутами патрулирования",
  "Small static groups inside buildings": "Небольшие статичные группы в зданиях",
  "Vehicles patrolling roads in the area": "Техника, патрулирующая дороги в зоне",
  "Bunkers, sandbag positions, MG nests etc.": "Бункеры, укрепы, пулемётные гнёзда и т.п.",
  "Delete zone": "Удалить зону",

  // Markers tab
  Military: "Военные",
  Vanilla: "Стандартные",
  Faction: "Фракция",
  Type: "Тип",
  Marker: "Маркер",
  Color: "Цвет",
  Text: "Текст",
  Empty: "Пусто",
  "Drag me onto the map!": "Перетащи меня на карту!",
  "Drop anywhere on the map · click a marker to edit":
    "Отпустите в любом месте карты · клик по маркеру — редактирование",
  "Editing marker": "Редактирование маркера",
  Delete: "Удалить",
  Unknown: "Неизвестно",
  Infantry: "Пехота",
  Motorized: "Мотопехота",
  Armor: "Бронетехника",
  "Anti-Armor": "ПТО",
  Mortar: "Миномёты",
  Artillery: "Артиллерия",
  "Fixed Wing": "Авиация",
  Recon: "Разведка",
  Supply: "Снабжение",
  Maintenance: "Ремонт",
  Medical: "Медицина",
  General: "Общие",
  Tactical: "Тактические",
  Arrows: "Стрелки",

  // Markers tab — Sectors sub-tab (TS_MapOverlay rectangles). RU calls them
  // "Районы": Район операции (AO) / Район задачи (objective).
  Sectors: "Районы",
  "Add AO Sector": "Добавить район операции",
  "Add Objective Sector": "Добавить район задачи",
  "AO Sector": "Район операции",
  "Objective Sector": "Район задачи",
  Objective: "Задача",
  "Editing sector": "Редактирование района",
  Width: "Ширина",
  Length: "Длина",
  "Sectors are map-only rectangles: the AO sector outlines the playable area, objective sectors highlight target areas.":
    "Районы — прямоугольники на карте: район операции очерчивает границы миссии, районы задач выделяют цели.",
  "No sectors yet": "Районы не добавлены",
  "Drag on the map to draw": "Проведите по карте, чтобы нарисовать",
  "the AO sector": "район операции",
  "an objective sector": "район задачи",

  // Briefing tab
  Situation: "Ситуация",
  Objectives: "Задачи",
  "Hostile forces": "Враждебные силы",
  "Section name (e.g. Support)": "Название раздела (напр. Поддержка)",
  "Add briefing section": "Добавить раздел",
  "Remove section": "Удалить раздел",

  // Placement banner / status
  "Click the map to place": "Кликните по карте, чтобы разместить",
  "the spawn point": "точку спавна",
  "an AI zone": "ботозону",
  "· press the button again to cancel": "· нажмите кнопку ещё раз для отмены",
  "Place a spawn point first (Spawn tab).": "Сначала разместите точку спавна (вкладка «Спавн»).",
  "Select at least one loadout (Players tab).":
    "Выберите хотя бы один вариант снаряжения (вкладка «Игроки»).",
  "Export failed: {error}": "Ошибка экспорта: {error}",
  "This browser doesn't support folder export — use Chrome or Edge.":
    "Этот браузер не поддерживает экспорт в папку — используйте Chrome или Edge.",
  Dismiss: "Закрыть",

  // Generate overlay
  "Generating mission": "Создание миссии",
  "Validating mission": "Проверка миссии",
  "Minting addon GUIDs": "Создание GUID аддона",
  "Placing spawn bundle": "Размещение базы",
  "Populating AI zones": "Заполнение ботозон",
  "Writing briefing & markers": "Запись брифинга и маркеров",
  "MISSION READY": "МИССИЯ ГОТОВА",
  "Mission generated": "Миссия создана",
  "Open the generated project in Workbench once.": "Откройте созданный проект в Workbench.",
  "Publish to the Workshop from Workbench.": "Опубликуйте в Workshop из Workbench.",
  Cancel: "Отмена",
  Download: "Скачать",
  "Mission written to {dir}/ ({n} files).": "Миссия записана в {dir}/ (файлов: {n}).",

  // Map HUD
  "Zoom in": "Приблизить",
  "Zoom out": "Отдалить",
  "Fit whole map": "Показать всю карту",
};

/** Pure lookup — usable outside React (Leaflet HTML, event closures). */
export function tr(lang: Lang, s: string): string {
  if (lang === "ru") return RU[s] ?? s;
  return s;
}

/** Display name for AI zone N — "Zone 1" / "Зона 1". Display only: the
 * generated world entities keep their `Area${n}` names (export.ts). */
export function zoneName(lang: Lang, n: number): string {
  if (lang === "ru") return `Зона ${n}`;
  return `Zone ${n}`;
}

/** "3 zones" / "3 зоны" with proper Russian plural forms. */
export function zonesCountLabel(lang: Lang, n: number): string {
  if (lang === "ru") {
    const mod10 = n % 10;
    const mod100 = n % 100;
    let word: string;
    if (mod10 === 1 && mod100 !== 11) word = "зона";
    else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = "зоны";
    else word = "зон";
    return `${n} ${word}`;
  }
  if (n === 1) return "1 zone";
  return `${n} zones`;
}

/** HUD scale label: "200 m" / "2 km" (RU: м / км). */
export function scaleLabel(lang: Lang, meters: number): string {
  if (meters >= 1000) {
    if (lang === "ru") return `${meters / 1000} км`;
    return `${meters / 1000} km`;
  }
  if (lang === "ru") return `${meters} м`;
  return `${meters} m`;
}

/** HUD coordinate readout: "{x} E · {z} N" (RU: В · С). */
export function coordsText(lang: Lang, x: string | number, z: string | number): string {
  if (lang === "ru") return `${x} В · ${z} С`;
  return `${x} E · ${z} N`;
}

const LangContext = createContext<Lang>("en");
export const LangProvider = LangContext.Provider;

export function useLang(): Lang {
  return useContext(LangContext);
}

/** Translator bound to the current language from context. */
export function useT(): (s: string) => string {
  const lang = useContext(LangContext);
  return useMemo(() => (s: string) => tr(lang, s), [lang]);
}
