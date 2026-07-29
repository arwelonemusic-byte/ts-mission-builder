# UI localization table (EN → RU)

Review/edit the RU column, then I'll wire it into the app (the RU/ENG toggle
reads from this table; EN stays the source of truth). Data-driven names are
NOT here by design: loadout names (USSR set is already Russian in the
catalogue), vehicle labels, and enemy group-set labels come from
`generator/catalogue.mjs` — translating those means editing the catalogue,
say the word if you want that too.

## App chrome

| EN | RU |
|---|---|
| Mission Builder | Конструктор миссий |
| Generate | Создать |
| Generating… | Создание… |
| Tactical Shift *(Discord button — not translated)* | Tactical Shift |
| More options *(mobile "…" button aria-label)* | Ещё |

## Tabs

| EN | RU |
|---|---|
| Mission | Миссия |
| Players | Игроки |
| Enemy | Противник |
| Spawn | Спавн |
| Zones | Зоны |
| Markers | Маркеры |
| Brief | Брифинг |

## Panel titles

| EN | RU |
|---|---|
| Mission setup | Настройка миссии |
| Players & loadouts | Игроки и снаряжение |
| Enemy forces | Силы противника |
| Spawn | Точка спавна |
| AI Zones | Ботозоны |
| Markers | Маркеры |
| Briefing | Брифинг |

## Mission tab

| EN | RU |
|---|---|
| Name | Название |
| Author | Автор |
| Player count | Количество игроков |
| Terrain | Карта |
| Changing terrain clears placements. | Смена карты удаляет всё размещённое. |
| Reset mission | Сбросить миссию |
| Reset the whole mission? | Сбросить всю миссию? |
| Important! | Важно! |
| Make sure you have these addons and their dependencies installed and updated: | Убедитесь, что эти аддоны и их зависимости установлены и обновлены: |
| TS Mission Toolkit — Reforger Workshop | *(not translated — proper noun link)* |

## Players tab

| EN | RU |
|---|---|
| Player Faction | Фракция игроков |
| Player Subfaction | Подфракция игроков |
| Squads | Отряды |
| Squad name | Название отряда |
| Add squad | Добавить отряд |
| Remove squad | Удалить отряд |
| Loadouts | Снаряжение |
| · {n} selected | · выбрано: {n} |
| All | Все |
| Reset | Сброс |
| Artillery Support | Артиллерийская поддержка |
| HE shells | Осколочно-фугасные |
| Smoke shells | Дымовые |
| Illumination shells | Осветительные |

## Enemy tab

| EN | RU |
|---|---|
| Enemy Faction | Фракция противника |
| (playable) | (игроки) |
| Enemy troops (mix any) | Войска противника (можно несколько) |

## Spawn tab

| EN | RU |
|---|---|
| Place spawn (click map) | Разместить спавн (клик по карте) |
| Move spawn (click map) | Передвинуть спавн (клик по карте) |
| Click the map… (cancel) | Кликните по карте… (отмена) |
| Show on map | Показать на карте |
| No spawn point yet | Точка спавна не размещена |
| Hit the button above, then click anywhere on the map. The base bundle — spawn point, arsenal crate and vehicles — is laid out around it. | Нажмите кнопку выше и кликните в любом месте карты. Вокруг точки будет размещена база — спавн, ящик снаряжения и техника. |
| Rotation | Поворот |
| ⚠ Uneven ground: {n} m elevation change across the bundle footprint. Consider moving or rotating the spawn. | ⚠ Неровная поверхность: перепад высот {n} м в границах базы. Попробуйте передвинуть или повернуть спавн. |
| FARP composition | FARP |
| Vehicles | Техника |
| + add vehicle… | + добавить технику… |
| No vehicle catalogue for this faction yet. | Для этой фракции пока нет каталога техники. |
| Spawn bundle — drag to move | База — перетащите, чтобы передвинуть |
| Drag to reorder | Перетащите, чтобы изменить порядок |
| Remove vehicle | Убрать технику |
| Arsenal crate *(map tooltip)* | Ящик снаряжения |
| Spawn point *(map tooltip)* | Точка спавна |

## Zones tab

| EN | RU |
|---|---|
| Add zone (click map) *(+ is an svg icon)* | Добавить зону (клик по карте) |
| {n} zone / {n} zones | {n} зона / {n} зоны / {n} зон |
| No AI zones yet | Ботозоны не добавлены |
| AI zones spawn enemy activity — garrisons, patrols, fortifications — around a map point. Drop one near an objective. | Ботозоны создают активность противника — гарнизоны, патрули, укрепления — вокруг точки на карте. Разместите зону рядом с целью. |
| Radius | Радиус |
| Defense Group | Группа обороны |
| Foot Patrols | Пешие патрули |
| Garrison | Гарнизон |
| Vehicle Patrols | Патрули на технике |
| Fortifications | Укрепления |
| Large group in the center with a defend waypoint | Большая группа в центре зоны с приказом обороняться |
| Groups with random patrol waypoints | Группы со случайными маршрутами патрулирования |
| Small static groups inside buildings | Небольшие статичные группы в зданиях |
| Vehicles patrolling roads in the area | Техника, патрулирующая дороги в зоне |
| Bunkers, sandbag positions, MG nests etc. | Бункеры, укрепы, пулемётные гнёзда и т.п. |
| Delete zone | Удалить зону |

## Markers tab

| EN | RU |
|---|---|
| Military | Военные |
| Vanilla | Стандартные |
| Faction | Фракция |
| Type | Тип |
| Marker | Маркер |
| Color | Цвет |
| Text | Текст |
| Empty | Пусто |
| Drag me onto the map! | Перетащи меня на карту! |
| Drop anywhere on the map · click a marker to edit | Отпустите в любом месте карты · клик по маркеру — редактирование |
| Editing marker | Редактирование маркера |
| Delete | Удалить |
| BLUFOR / OPFOR / INDFOR / Unknown | BLUFOR / OPFOR / INDFOR / Неизвестно |
| General / Tactical / Arrows *(icon picker categories)* | Общие / Тактические / Стрелки |
| Infantry / Motorized / Armor / Anti-Armor / Mortar / Artillery / Fixed Wing / Recon / Supply / Maintenance / Medical / Empty | Пехота / Мотопехота / Бронетехника / ПТО / Миномёты / Артиллерия / Авиация / Разведка / Снабжение / Ремонт / Медицина / Пусто |

## Briefing tab

| EN | RU |
|---|---|
| Situation | Ситуация |
| Objectives | Задачи |
| Hostile forces | Враждебные силы |
| Section name (e.g. Support) | Название раздела (напр. Поддержка) |
| Add briefing section *(+ is an svg icon)* | Добавить раздел |
| Remove section | Удалить раздел |

## Placement banner / status

| EN | RU |
|---|---|
| Click the map to place | Кликните по карте, чтобы разместить |
| the spawn point | точку спавна |
| an AI zone | ботозону |
| markers | маркеры |
| · press the button again to cancel | · нажмите кнопку ещё раз для отмены |
| · press the button again to finish | · нажмите кнопку ещё раз для завершения |
| Place a spawn point first (Spawn tab). | Сначала разместите точку спавна (вкладка «Спавн»). |
| Select at least one loadout (Players tab). | Выберите хотя бы один вариант снаряжения (вкладка «Игроки»). |
| Export failed: {error} | Ошибка экспорта: {error} |
| This browser doesn't support folder export — use Chrome or Edge. | Этот браузер не поддерживает экспорт в папку — используйте Chrome или Edge. |
| Dismiss *(toast close button)* | Закрыть |

## Generate overlay

| EN | RU |
|---|---|
| Generating mission | Создание миссии |
| Validating mission | Проверка миссии |
| Minting addon GUIDs | Создание GUID аддона |
| Placing spawn bundle | Размещение базы |
| Populating AI zones | Заполнение ботозон |
| Writing briefing & markers | Запись брифинга и маркеров |
| MISSION READY | МИССИЯ ГОТОВА |
| Mission generated | Миссия создана |
| Open the generated project in Workbench. | Откройте созданный проект в Workbench. |
| Publish to the Workshop from Workbench. | Опубликуйте в Workshop из Workbench. |
| Cancel | Отмена |
| Download | Скачать |
| Mission written to {dir}/ ({n} files). | Миссия записана в {dir}/ (файлов: {n}). |

## Map HUD

| EN | RU |
|---|---|
| Zoom in / Zoom out / Fit whole map | Приблизить / Отдалить / Показать всю карту |
| {n} m / {n} km | {n} м / {n} км |
| {x} E · {z} N | {x} В · {z} С |
