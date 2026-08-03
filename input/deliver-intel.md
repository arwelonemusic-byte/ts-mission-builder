# Deliver Intel objective — harvest + design (2026-08-01)

Planned 6th objective type. Investigation done in-session 2026-08-01; this doc is the
implementation-ready ground truth. Status: WAITING on the user's tent composition
(TS Mission Toolkit) — everything else is harvested.

## Native SF machinery (all vanilla, all validated from scripts + prefabs)

Vanilla reference composition (serialization ground truth, like TaskDeliverVehicles
was for deliver-vehicle):
`Prefabs/Systems/ScenarioFramework/Compositions/LayerTasks/TaskDeliverIntel.et`

Prefabs + base component-instance GUIDs (K-entry candidates; reuse, never mint):

| K name | Value |
|---|---|
| LAYERTASK_DELIVER_PREFAB | `{88821DCA414AF4C7}Prefabs/Systems/ScenarioFramework/Components/LayerTaskDeliver.et` |
| CMP_LT_DELIVER | `{5A6513F48903E7DA}` (class `SCR_ScenarioFrameworkLayerTaskDeliver`) |
| SLOT_PICK_PREFAB | `{9F70B00322910AED}Prefabs/Systems/ScenarioFramework/Components/SlotPick.et` |
| CMP_SLOT_PICK | `{5A2283FD60F69A1A}` (class `SCR_ScenarioFrameworkSlotPick`) |
| SLOT_DELIVERY_PREFAB | `{4C2EF5C1E53FE511}Prefabs/Systems/ScenarioFramework/Components/SlotDelivery.et` |
| CMP_SLOT_DELIVERY | `{59F51EA7A10294D2}` (class `SCR_ScenarioFrameworkSlotDelivery`) |
| CMP_PLUGINTRIG_DELIVERY | `{5A6513EB3A4B9621}` (PluginTrigger inside SlotDelivery base, default radius 5) |
| INTEL_FOLDER | `{6D56FED1E55A8F84}Prefabs/Items/Misc/IntelligenceFolder_E_01/IntelligenceFolder_E_01.et` |

Notes:
- LayerTaskDeliver base already sets `m_eTypeOfTask DELIVER` + `m_sTaskPrefab TaskDeliver.et`
  — inherited for free.
- SlotDelivery base spawns `TriggerCharacterSlow` (the SF trigger we use for Clear) —
  ALL PluginTrigger fields honored. Set `m_eActivationPresence PLAYER` explicitly.
- SlotPick base bakes `m_bCanBeGarbageCollected 0` AND blacklists the spawned item in
  the garbage system.
- IntelligenceFolder_E_01 is the ONLY intel item in vanilla — bake it, no picker UI.

## Mechanics (SCR_TaskDeliver, 496 lines — read 2026-08-01)

- Completion: delivery trigger OnActivate → COMPLETED if the item ENTITY is inside the
  trigger OR any character inside carries it in inventory (hand-offs, vehicles, thrown —
  all work).
- Courier killed → item auto-ejected from the corpse's inventory next to the body; task
  continues.
- Three text states, updated live in the task list: initial (find it) → possessed
  (`m_sTaskTitleUpdated`/`Updated1`) → dropped (`Updated2`).
- Marker caveat (playtest gate): on pickup the task marker is MoveTask'd to the delivery
  point; dropped intel gets a delayed marker reveal (`m_iIntelMapMarkerUpdateDelay`,
  default 30 s). Under our LIST_ONLY policy no marker should exist at all — verify
  nothing leaks (same gate the other task types passed). Omit
  `m_bPlaceMarkerOnSubjectSlot` (default 0; the vanilla composition sets 1 — we don't).

## Placement design (decided with the user 2026-08-01)

Bare folder-on-ground rejected (palm-sized item, no marker → unfindable litter).
Decision: **universal tent composition** — military tent + field desk + dressing,
HAND-AUTHORED by the user, homed in **TS Mission Toolkit** (no new dependency; rides
the same Workshop republish already pending for HideInBuilding).

- The composition must NOT contain the folder — `SCR_TaskDeliver` binds its tracked
  asset to the entity SlotPick itself spawns; a pre-placed folder is invisible to the task.
- Emission per intel objective: LayerTask entity at the objective point with THREE
  children — plain SlotBase spawning the composition at `0 0 0`, SlotPick spawning the
  folder at the DESK-SURFACE OFFSET (a few cm above; physics seats it), SlotDelivery at
  `delivery - pos` offset (nested under the task layer → auto-binds, no
  m_aAssociatedTaskLayers needed).
- Needed from the composition when it lands: resource ref (GUID+path), desk-surface
  local offset (x y z), frozen origin convention (ground level, centered; desk at a
  known bearing — if the interior is rearranged the catalogue offset must move too).
- Rotation: v1 fixed yaw (or per-mission random); a rotation slider on the intel card
  is a v2 candidate (spawn-bundle yaw pattern).
- Uneven ground: composition spawns un-conformed at sampled terrain Y (same as destroy
  props) — compact footprint recommended.

## Web integration sketch

Reuses the deliver-vehicle plumbing wholesale: type `"intel"` with two map points
(objective pos = tent/folder, delivery point = existing deliveryTarget placement flow +
radius slider), standard 4 text fields; prefill Updated1/2 stage texts from i18n
(picked up: "Deliver the intel to the extraction point"-style). Task description
prefill should nudge mission makers to write a locatable clue — there is no marker;
the description IS the treasure map. No objectRef picker (folder + composition baked).
Mission JSON stores only type/points/texts — the composition ref is pure emission-time
detail, so it can be upgraded later without migrations.
