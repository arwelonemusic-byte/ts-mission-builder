# Navmesh vs. Object Placement in Arma Reforger Missions

Findings from 2026-09-07, verified against vanilla scripts (`ReforgerData/scripts`) and the BI wiki.

## The problem

Objects dragged directly into the World Editor are **invisible to AI pathfinding**. Bots walk straight
through barbed wire, sandbags, and MG nests placed that way. The same objects spawned through the
scenario framework (Area -> Layer -> Slot) are pathed around correctly.

Observed in Bite the Dust: an MG nest with barbed wire placed directly caused AI to walk into the wire
and bleed out. Switching the same nest to slot spawning made bots path around it.

## Why

AI pathfinding uses a **pre-baked navmesh**, not the live scene.

- A mission that is a sub-scene of a vanilla/community map inherits the map's navmesh files (`.nmn`)
  through the `SCR_AIWorld` entity in `default.layer`. Bite the Dust points at the three Zargabad
  files (`Navmesh_GM_Zargabad_Soldier.nmn`, `_BTR.nmn`, `_LowRes.nmn`) inside the Zargabad addon.
- Those files were baked by the map author. Anything placed in the World Editor afterward is not in
  them. Play mode does not rebuild anything.
- Slot spawning explicitly requests a runtime rebuild right after spawning. In
  `scripts/Game/ScenarioFramework/Components/SCR_ScenarioFrameworkSlotBase.c` (~line 620):

  ```c
  IEntity entity = GetGame().SpawnEntityPrefab(resource, GetGame().GetWorld(), m_SpawnParams);
  SCR_AIWorld aiWorld = SCR_AIWorld.Cast(GetGame().GetAIWorld());
  if (aiWorld)
      aiWorld.RequestNavmeshRebuildEntity(entity);
  ```

- `SCR_AIWorld.RequestNavmeshRebuildEntity()` (`scripts/Game/AI/SCR_AIWorld.c` ~line 250) walks the
  entity and all children, collects bounds of every piece that has a mesh and physics on the
  `EPhysicsLayerDefs.Navmesh | NavmeshVehicle` layer, merges nearby bounds, and calls the engine
  `RequestNavmeshRebuild(min, max)` for each area. Roads are re-linked too unless the entity has a
  BTR-type `NavmeshCustomLinkComponent`.

Other vanilla callers of the same rebuild: `SCR_SiteSlotEntity`, `SCR_CampaignMilitaryBaseComponent`
(Conflict base compositions), `SCR_ScenarioFrameworkSlotWaypoint`, `SCR_EditableEntityComponent`
(Game Master in-game placement/deletion), `SCR_DestructibleBuildingComponent` and
`SCR_DestructionUtility` (building collapse), `SCR_CampaignBuildingDisassemblyUserAction`.

Direct World Editor placement has **no** equivalent hook.

## Caveats on the runtime rebuild

- Only entities whose physics interaction layer includes the navmesh flags trigger a rebuild.
  Vanilla props (barbed wire, sandbags, MG nests, fortifications) do. Characters and vehicles are
  deliberately excluded.
- It runs once at spawn time. Objects moved or deleted later outside the framework leave the
  navmesh stale again.
- Rebuild areas are merged when centers are within `MAX_NAVMESH_REBUILD_SIZE`; very large
  compositions may produce several rebuild requests.

## Options for obstacles AI must respect

1. **Spawn through slots** (recommended). Zero maintenance, matches vanilla behaviour.
2. **Rebake the navmesh** in World Editor (Navmesh Tool -> Rebuild changed tiles -> Save As into
   the mission addon), then repoint the three `NavmeshFile` paths on the `SCR_AIWorld` entity in
   `default.layer`. Bakes placements permanently but means owning navmesh copies. Only worth it for
   dozens of static obstacles.
3. **Custom component** on directly placed obstacles that calls
   `SCR_AIWorld.RequestNavmeshRebuildEntity(GetOwner())` on init. Direct placement with slot-like
   behaviour at the cost of a little script.

## Rule of thumb for the mission builder

Anything that blocks movement and matters to AI (fortifications, wire, roadblocks, barricades)
must go through a slot. Direct placement is fine for decoration and for objects AI never needs to
path around.

## References

- Wiki: World Editor: Navmesh Tool / Navmesh Tool Tutorial
- `ReforgerData/scripts/Game/AI/SCR_AIWorld.c`
- `ReforgerData/scripts/Game/ScenarioFramework/Components/SCR_ScenarioFrameworkSlotBase.c`
