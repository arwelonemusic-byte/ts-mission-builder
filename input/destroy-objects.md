# Destroy-object objective — vanilla prefab harvest (2026-07-31)

Candidates for the future "Destroy object" objective type (LayerTaskDestroy + SlotDestroy).
TRIMMED 2026-07-31 (decision): the user-facing pool is limited to objects that are BOTH
natively destructible AND have a baked GM thumbnail in `UI/Textures/EditorPreviews/`
(400×300 BC7 .edds, same ENF1 format as our thumbnail encoder — decodable offline via
top-mip extraction + texconv; no runtime rendering needed). Everything else is parked
in the sections below for later.

## CRITICAL mechanic constraint

`SCR_TaskDestroyObject.HookTaskAsset()` resolves the damage manager via the static
`SCR_DamageManagerComponent.GetDamageManager(owner)` (scripts/GameCode/Components/SCR_DamageManagerComponent.c:399)
— character/vehicle fast paths, else `owner.FindComponent(SCR_DamageManagerComponent)`.
**It does NOT walk children.** The spawned prefab's ROOT entity must carry a
`SCR_DamageManagerComponent` descendant (`SCR_DestructionMultiPhaseComponent`,
`SCR_DestructibleBuildingComponent`, `SCR_DestructionFractalComponent` all qualify)
or the task never completes. Compositions rooted in `BuildableComposition_Base` /
`StaticObject_base` will NOT work as vanilla destroy targets. (KSC/COE2 get away with
composition wrappers only because `KSC_KillTask` walks one level of children.)

GUID note: refs are cross-referenced from `{GUID}path` usages (ReforgerData root `ID`
lines are NOT resource GUIDs). ⚠ = single corroboration, verify in Workbench.
Preview paths are relative to `UI/Textures/EditorPreviews/` in the vanilla pak.

## A. MVP pool — destructible AND thumbnailed

| Ref | Object | Destruction | Preview |
|---|---|---|---|
| `{5C9F32A26A42876F}Prefabs/Structures/Infrastructure/Towers/AntennaVOR_01/AntennaVOR_01.et` | VOR navaid beacon (~10 m ring + cone) | DestructibleBuilding (Metal_Medium) | `Auto/Structures/Infrastructure/Towers/E_AntennaVOR_01.edds` |
| `{DBCDEC45DB834E8A}Prefabs/Structures/Infrastructure/Towers/TransmitterTower_01/TransmitterTower_01.et` | ~50 m lattice transmitter mast | MultiPhase 15000 HP | `Auto/Structures/Infrastructure/Towers/E_TransmitterTower_01.edds` |
| `{7E2380494811A5FB}…/TransmitterTower_01_medium.et` | medium mast | inherited | `…/E_TransmitterTower_01_medium.edds` |
| `{6A004A8F0571D456}…/TransmitterTower_01_small.et` | small mast | inherited | `…/E_TransmitterTower_01_small.edds` |
| `{92BE346D5E0BD792}Prefabs/Props/Military/Fuel/MobileWaterTank_USSR_01_fuel.et` | Soviet fuel bowser trailer (~4×2×2 m) | MultiPhase 5000 HP | `Auto/Props/Military/WaterTanks/E_MobileFuelTank_USSR_01.edds` |
| `{9F35A268E0DD98A4}Prefabs/Props/Military/Fuel/MobileWaterTank_US_01_fuel.et` | US fuel bowser trailer | MultiPhase 5000 HP | `Auto/Props/Military/WaterTanks/E_MobileFuelTank_US_01.edds` |
| `{616F4E93658E5A3A}Prefabs/Props/Military/Generators/GeneratorFloodlight_USSR_01.et` | generator + floodlight mast (searchlight stand-in) | MultiPhase 1000 HP | `Auto/Props/Military/Generators/E_GeneratorFloodlight_USSR_01.edds` |
| `{0E94F28FD722B1D8}…/GeneratorFloodlight_US_01.et` | US variant | MultiPhase 1000 HP | `…/E_GeneratorFloodlight_US_01.edds` |
| `{4D100F180B3EFEC1}Prefabs/Structures/Industrial/Containers/Silos/Silo_01/Silo_01.et` | industrial silo (~5×12 m) | DestructibleBuilding + Ruin | `Auto/Structures/Industrial/Containers/Silos/E_Silo_01.edds` |
| Silo_02 (base `{A46A8D4B5A534D2E}` — resolve concrete variant GUIDs in Workbench) | silo v2 (+Blue/Yellow) | DestructibleBuilding | `…/E_Silo_02.edds`, `_Blue`, `_Yellow` |
| `{5B8922E61D8DF345}Prefabs/Props/Military/Antennas/Antenna_R161_01.et` | R-161 Soviet field antenna (~5 m) | MultiPhase 800 HP | `Auto/Props/Military/Antennas/E_Antenna_R161_01.edds` |
| `{B4F2701CBBE49C48}Prefabs/Props/Military/Antennas/Antenna_RC292_01.et` | RC-292 US field antenna | MultiPhase 800 HP | `Auto/Props/Military/Antennas/E_Antenna_RC292_01.edds` |
| `{34AD2F398FDFE5B3}Prefabs/Props/Military/AmmoBoxes/EquipmentBoxStack/USSR/EquipmentBoxStack_USSR_01_V5.et` | Soviet weapon cache (crate stack; V1-V6 + covered variants all previewed) | MultiPhase 800 HP | `Auto/Props/Military/AmmoBoxes/EquipmentBoxStack/E_EquipmentBoxStack_USSR_01_V5.edds` |
| `{B33E74A024F0C8EA}…/US/EquipmentBoxStack_US_01_V5.et` | US weapon cache | MultiPhase 800 HP | `…/E_EquipmentBoxStack_US_01_V5.edds` |
| `{D1FFE458E8AC4BDB}Prefabs/Weapons/Mortars/2B14/Mortar_2B14.et` | 82 mm mortar | weapon dmg manager + destroyed parts | `Auto/Weapons/Mortars/2B14/E_Mortar_2B14.edds` |
| `{8094D99689ABE241}Prefabs/Weapons/Mortars/M252/Mortar_M252.et` | 81 mm mortar | same | `Auto/Weapons/Mortars/M252/E_Mortar_N252.edds` (BI typo: N252) |
| `{10C5A45290A9EEED}Prefabs/Props/Industrial/GasTank_01_blue.et` | propane tank (small — cluster) | MultiPhase 300 HP | `Auto/Props/Industrial/E_GasTank_01_blue.edds` (+red/rusty) |
| `{1EDBE01AAD5EE137}…/GasTank_02_blue.et`, `{0712799E7E8A0D56}…/GasTank_02_rusty.et` | propane tank v2 | MultiPhase 300 HP | `…/E_GasTank_02_*.edds` |
| `{03B44EA7652D0D17}Prefabs/Props/Military/Radios/RadioStation_R123M_01.et` | R-123M radio set (~0.6 m — small) | Destructible_Props_Base | `Auto/Props/Military/Radios/E_RadioStation_R123M_01.edds` |
| `{34736979381CA219}…/RadioStation_ANGRC160_01.et` | AN/GRC-160 radio set | same | `…/E_RadioStation_ANGRC160_01.edds` |

Category shape for the UI: **Comms** (VOR, transmitter towers, R-161, RC-292, radio sets),
**Fuel** (bowsers, gas tanks), **Cache/Ammo** (equipment box stacks), **Weapons** (mortars),
**Industrial** (silos), **Vehicles** (below).

## B. Vehicles (bundled into the same Destroy-object objective — decision 2026-07-31)

No new harvest needed: the pool is the existing `FACTIONS[*].vehicles` registry
(the spawn-picker list — everything incl. armed vehicles + helicopters, with
`vehicleLabels` for display names). Which faction's list the UI offers is a
feature-planning decision (the original Tasks doc wanted the pool NOT limited to
the enemy faction); factions with thin vehicle lists just make the objective less
attractive there — acceptable per decision.

Mechanics: vehicles are first-class vanilla destroy targets, better supported than
props — `SCR_DamageManagerComponent.GetDamageManager()` has a dedicated `BaseVehicle`
fast path (no root-component concerns at all), and `SCR_TaskDestroyObject` adds
vehicle-only completion paths (engine-drowned polling + `GetOnEngineStop`). The
vanilla `Compositions/LayerTasks/TaskDestroy.et` reference composition itself spawns
a UAZ469. No overrides, ever.

Thumbnails:
- **Vanilla**: 145 previews under `EditorPreviews/Vehicles/{Wheeled,Helicopters}/…`,
  path mirrors the prefab path, every catalogue key sampled has full variant
  coverage (UAZ469 ×23 incl. FIA/CIV, M923A1 ×21, UH1H ×12, Mi8 ×8, M151A2 ×8,
  BTR70/BRDM2/LAV25 ✓).
- **RHS**: ships its own `UI/Textures/EditorPreviews/Vehicles/…` (M1025 family
  confirmed) — same extraction pipeline.
- **British Forces**: ships NO EditorPreviews at all — UK vehicles get a generic
  placeholder tile or are excluded from the picker (degraded pool accepted).
- **MEI**: its `vehicles` dict points at vanilla FIA prefabs → covered by the
  vanilla previews (`BRDM2_FIA.edds` etc. confirmed). The UAZ469_PKM_MEI reskin is
  patrol-only, not in the destroy pool.

## Parked: destructible but NO baked thumbnail (future — bake previews via an
editable-prefab wrapper addon, or ship hand-made screenshots)

BARS transmitter mast `{82CCE96E35DC6A6E}` (15000 HP) + BARS antenna `{11153A8B7A2F5D20}` ⚠;
R-404 troposcatter `{B9AEDBE988F20A1A}` (5000 HP); 110 kV transformer `{CECADADEE5772DB1}` ⚠
(GUID conflict `{EEEFF09A3BEF040E}` — verify); TransformerSubstation_01 `{A54F6416C3A6A4D7}` ⚠;
TransformerStation_E_01 `{06804C659EF7C47D}` / _E_02 `{6AD4788522334B53}`; GeneratorAirfield
USSR `{2FCB46C395C9CBE7}` / US `{7F671B405CDBF0A2}` (3000 HP, wreck phase); GeneratorMilitary
USSR `{6597847D2AC253F5}` ⚠; static FuelTank_01 `{D44E66C875C41446}`/`{389D6DF9941FF22D}` +
FuelTank_02 `{2D92D7E09B3424BC}`/`{AF44CFF705C52B9B}`; FuelStation_USSR `{F348AFB824F180D4}`;
CrateStack_01 `{AA1E1DD1D69055EC}`/`{93B2511EFB2B6A51}` (1500 HP); ShellContainerstack big
`{E17324998DE1BB87}` / small `{77D49455528ED5E6}`; Antenna_R142 (4500 HP) + Antenna_US_02 /
USSR_02 / FIA_02 — GUIDs unresolved, need Workbench.

## Parked: iconic but NOT natively destructible → need a root-level override

RPL-5 radar dish short `{2BC7C6DE43AC49E2}` / tall `{979A564D476B5AAE}` / full comp
`{DED4DB7D08E6E0BE}`; AN/TPN-19 `{A0190D51FD62FF68}` (its generator `{451BE00A37C69679}` is
what Operation Pinecone Jam overrode); 30 m airport mast `{53251E86B44EF4F2}`; slotted
antenna emplacements `{68ED84218EA1BDC3}`/US `{8B4B8BF44162B24E}` (previews DO exist —
`Auto/Compositions/Slotted/SlotFlatSmall/E_Antenna_S_*.edds` — but BuildableComposition
root has no damage manager; Foxhound's override target); relay antennas Antenna_01
USSR `{5BA978B9D36641DD}` / US `{CF4F7AEE0BFA7B25}` / FIA `{DD49716491710760}`; HQ antennas
Antenna_02 USSR `{55B73CF1EE914E07}` / US `{C5EA2AA3BDEA88A2}`; 110 kV switchyard comp
`{BE3D31D8919CA073}`.

## Override recipe (ground truth: Operation Pinecone Jam TPN19 generator — the GOOD template)

Shadow the vanilla path; keep root `ID` + .meta `Name` GUID exactly vanilla; add to the ROOT:

```
SCR_DestructionMultiPhaseComponent "{freshGuid}" {
 Enabled 1
 "Additional hit zones" {
  SCR_HitZone Default {
   DamageReduction 30
   DamageThreshold 30
   "Collision multiplier" 0.5
   "Melee multiplier" 0.05
   "Kinetic multiplier" 0.05
   "Fragmentation multiplier" 0.1
   "Explosive multiplier" 3
  }
 }
 m_fBaseHealth 1500
 m_fDamageThresholdMaximum 50000
 m_DestroySpawnObjects {
  SCR_ParticleSpawnable "{freshGuid}" {
   m_Particle "{3528DFF4EE2BBD7C}Particles/Vehicle/Vehicle_explosion_medium_01.ptc"
  }
 }
}
RplComponent "{freshGuid}" { Enabled 1 }
```

Hit zone = demolition-charge-only (small arms ~useless, explosives 3×). The component
inherits `{76DA308CC9E2AB84}Prefabs/Props/Core/DestructionMultiPhase_Base.ct` semantics.
Foxhound's variant (Antenna_S_USSR_01.et override, retuning the inherited generator-child
component {51E082CF9A77B1A1} to 1500 HP) also works but carries `EnableDamage 0`
(suspicious — verify) and only worked because the generator child ALREADY had the
component; Foxhound completed its objective via a custom OPF_HintAction, not LayerTaskDestroy.

CAVEAT for our generator: shadowing a vanilla path affects EVERY instance of that prefab
on the map (Foxhound-style global override). For mission-local destroy targets prefer a
NEW prefab (own path + own GUID in our addon, parented to the vanilla prefab) with the
component added — same recipe, no global shadowing, and the SlotDestroy spawns our prefab.

## Thumbnail extraction pipeline (validated format, not yet built)

`UI/Textures/EditorPreviews/**.edds` = 400×300 BC7_UNORM_SRGB, standard DDS header +
ENF1 @0x24 + DX10 header + smallest-first mip table (all COPY in sampled files) — the
exact format web/src/lib/edds.ts ENCODES. Decode: take the largest mip (last table
entry), rewrap as a standard single-mip .dds, convert with DirectXTex texconv → PNG.
RHS ships its own `UI/Textures/EditorPreviews/` (confirmed), so mod content gets
thumbnails the same way.
