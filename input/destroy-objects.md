# Destroy-object objective — vanilla prefab harvest (2026-07-31)

Candidates for the future "Destroy object" objective type (LayerTaskDestroy + SlotDestroy).

## CRITICAL mechanic constraint

`SCR_TaskDestroyObject.HookTaskAsset()` resolves the damage manager via the static
`SCR_DamageManagerComponent.GetDamageManager(owner)` (scripts/GameCode/Components/SCR_DamageManagerComponent.c:399)
— character/vehicle fast paths, else `owner.FindComponent(SCR_DamageManagerComponent)`.
**It does NOT walk children.** The spawned prefab's ROOT entity must carry a
`SCR_DamageManagerComponent` descendant (`SCR_DestructionMultiPhaseComponent`,
`SCR_DestructibleBuildingComponent`, `SCR_DestructionFractalComponent` all qualify)
or the task never completes. Compositions rooted in `BuildableComposition_Base` /
`StaticObject_base` (full radar comps, slotted antenna emplacements) will NOT work
as vanilla destroy targets. (KSC/COE2 get away with composition wrappers only
because `KSC_KillTask` walks one level of children — their task class, not ours.)

GUID note: ReforgerData has no .meta files and prefab root `ID` lines are NOT
resource GUIDs — every ref below is cross-referenced from a `{GUID}path` usage in
another .et/.conf/.layer. ⚠ = single corroboration, verify in Workbench before use.

## A. Natively destructible (root-level damage manager) — usable as-is

| Ref | Object | Notes |
|---|---|---|
| `{82CCE96E35DC6A6E}Prefabs/Structures/Military/Antennas/Antenna_BARS_01/Antenna_BARS_01_transmitter.et` | BARS radio-relay transmitter mast (~10-12 m) | MultiPhase, 15000 HP; prime comms target (KSC uses it verbatim) |
| `{11153A8B7A2F5D20}Prefabs/Structures/Military/Antennas/Antenna_BARS_01/Antenna_BARS_01.et` | BARS antenna variant | inherited MultiPhase 10000 HP ⚠ |
| `{B9AEDBE988F20A1A}Prefabs/Structures/Infrastructure/Towers/AntennaR404_01/AntennaR404_01.et` | R-404 troposcatter dish array (~8×8×10 m) | MultiPhase 5000 HP (KSC retunes to 1000) |
| `{5C9F32A26A42876F}Prefabs/Structures/Infrastructure/Towers/AntennaVOR_01/AntennaVOR_01.et` | VOR navaid beacon (~10 m ring) | DestructibleBuilding (Metal_Medium) |
| `{DBCDEC45DB834E8A}Prefabs/Structures/Infrastructure/Towers/TransmitterTower_01/TransmitterTower_01.et` | ~50 m lattice transmitter mast (`_medium` `{7E2380494811A5FB}`, `_small` `{6A004A8F0571D456}`) | MultiPhase 15000 HP |
| `{CECADADEE5772DB1}Prefabs/Structures/Infrastructure/Power/TransformerStation110kV_E_01/Transformer110kV_E_01.et` | 110 kV oil transformer (~4×3×4 m) | MultiPhase 2000 HP, explosion FX baked in. ⚠ conflicting GUID `{EEEFF09A3BEF040E}` in PrefabLibrary — verify |
| `{A54F6416C3A6A4D7}Prefabs/Structures/Infrastructure/Power/TransformerSubstation_01/TransformerSubstation_01.et` | pole-mounted substation tower | DestructibleBuilding (Brick_Tiny) ⚠ |
| `{06804C659EF7C47D}Prefabs/Structures/Infrastructure/Power/TransformerStation_E_01/TransformerStation_E_01.et` | brick transformer kiosk | DestructibleBuilding (Brick_Medium), well corroborated |
| `{6AD4788522334B53}Prefabs/Structures/Infrastructure/Power/TransformerStation_E_02/TransformerStation_E_02.et` | larger transformer station | DestructibleBuilding |
| `{92BE346D5E0BD792}Prefabs/Props/Military/Fuel/MobileWaterTank_USSR_01_fuel.et` / US `{9F35A268E0DD98A4}…/MobileWaterTank_US_01_fuel.et` | towed fuel bowser (~4×2×2 m) | MultiPhase 5000 HP; best single "fuel dump" prop |
| `{2FCB46C395C9CBE7}Prefabs/Props/Airport/GeneratorAirfield_USSR_01/GeneratorAirfield_USSR_01.et` / US `{7F671B405CDBF0A2}` | trailer airfield generator | MultiPhase 3000 HP, wreck phase |
| `{6597847D2AC253F5}Prefabs/Props/Military/Generators/GeneratorMilitary_USSR_01/GeneratorMilitary_USSR_01.et` (camo `{FB728A0AA878F95C}`) | Soviet skid generator | MultiPhase 2000 HP ⚠ |
| `{616F4E93658E5A3A}Prefabs/Props/Military/Generators/GeneratorFloodlight_USSR_01.et` / US `{0E94F28FD722B1D8}` | generator + floodlight mast | MultiPhase 1000 HP; searchlight stand-in |
| `{D44E66C875C41446}Prefabs/Structures/Industrial/Containers/FuelTanks/FuelTank_01/FuelTank_01_green.et` (grey `{389D6DF9941FF22D}`) | vertical fuel tank (~4×6 m) | DestructibleBuilding (Metal_Small) + Ruin |
| `{2D92D7E09B3424BC}…/FuelTanks/FuelTank_02/FuelTank_02_green.et` (grey `{AF44CFF705C52B9B}`) | horizontal fuel tank (~6 m) | DestructibleBuilding + Ruin |
| `{F348AFB824F180D4}Prefabs/Structures/Military/FuelStations/FuelStation_USSR_01/FuelStation_USSR_01.et` | Soviet field fuel station | MultiPhase 1000 HP |
| `{4D100F180B3EFEC1}Prefabs/Structures/Industrial/Containers/Silos/Silo_01/Silo_01.et` | industrial silo (~5×12 m) | DestructibleBuilding + Ruin |
| `{5B8922E61D8DF345}Prefabs/Props/Military/Antennas/Antenna_R161_01.et` | R-161 field antenna (~5 m) | MultiPhase 800 HP |
| `{B4F2701CBBE49C48}Prefabs/Props/Military/Antennas/Antenna_RC292_01.et` | RC-292 US field antenna | MultiPhase 800 HP |
| `{34AD2F398FDFE5B3}Prefabs/Props/Military/AmmoBoxes/EquipmentBoxStack/USSR/EquipmentBoxStack_USSR_01_V5.et` / US V5 `{B33E74A024F0C8EA}` | ammo/equipment crate stack — the weapon cache (V1-V6 variants) | MultiPhase 800 HP (KSC's Destroy Cache = these) |
| `{AA1E1DD1D69055EC}Prefabs/Props/Military/MilitaryCrates/CrateStack_01/CrateStack_01_green.et` (grey `{93B2511EFB2B6A51}`) | large crate stack | MultiPhase 1500 HP |
| `{E17324998DE1BB87}…/ShellContainerstack_01/ShellContainerstack_01_pile_big.et` (small `{77D49455528ED5E6}`) | artillery shell pile | MultiPhase 1500 HP; ammo-dump target |
| `{D1FFE458E8AC4BDB}Prefabs/Weapons/Mortars/2B14/Mortar_2B14.et` / `{8094D99689ABE241}…/M252/Mortar_M252.et` | 82/81 mm mortar | weapon damage manager + destroyed-part prefabs |
| `{10C5A45290A9EEED}Prefabs/Props/Industrial/GasTank_01_blue.et`, `{1EDBE01AAD5EE137}` GasTank_02_blue, `{0712799E7E8A0D56}` GasTank_02_rusty | propane tanks (small — cluster them) | MultiPhase 300 HP |

GUID unresolved (no cross-ref anywhere; resolve in Workbench): `Antenna_R142_01.et` (4500 HP, beefiest prop antenna), `Antenna_US_02` (3000), `Antenna_USSR_02` (2500), `Antenna_FIA_02` (800).
Smaller but thematic: RadioStation_R123M_01 `{03B44EA7652D0D17}`, RadioStation_ANGRC160_01 `{34736979381CA219}` (~0.6 m — better as composition children).

## B. Iconic but NOT natively destructible → need a root-level override (Pinecone Jam recipe)

| Ref | Object | Why it fails |
|---|---|---|
| `{2BC7C6DE43AC49E2}…/ApproachRadar_RPL5_01/ApproachRadar_RPL5_01_short.et` (tall `{979A564D476B5AAE}`) | THE radar dish | StaticObject chain, no damage manager anywhere |
| `{DED4DB7D08E6E0BE}…/ApproachRadar_RPL5_01/ApproachRadar_RPL5_01.et` | full RPL-5 composition | composition root |
| `{A0190D51FD62FF68}…/ApproachRadar_TPN19_01/ApproachRadar_TPN19_01.et` | AN/TPN-19 US radar | same; its generator `{451BE00A37C69679}` is what Operation Pinecone Jam overrode |
| `{53251E86B44EF4F2}Prefabs/Structures/Airport/AntennaAirport_01/AntennaAirport_01.et` | 30 m striped airport mast | Infrastructure chain, mesh only |
| `{68ED84218EA1BDC3}Prefabs/Compositions/Slotted/SlotFlatSmall/Antenna_S_USSR_01.et` (US `{8B4B8BF44162B24E}`) | slotted radio-relay emplacement | BuildableComposition root (destructible generator is a CHILD — invisible to GetDamageManager). Foxhound overrode this one |
| `{5BA978B9D36641DD}…/Compositions/USSR/Antenna_01_USSR.et`, US `{CF4F7AEE0BFA7B25}`, FIA `{DD49716491710760}` | radio-relay antenna prop (2 km relay) | Props_Base chain, no destruction |
| `{55B73CF1EE914E07}…/Antenna_02_USSR.et`, US `{C5EA2AA3BDEA88A2}` | HQ antenna (service point) | same |
| `{BE3D31D8919CA073}…/TransformerStation110kV_E_01_simple_v1.et` | full 110 kV switchyard comp | use the child Transformer110kV directly instead |

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
component {51E082CF9A77B1A1} to 1500 HP) also works but note it carries `EnableDamage 0`
(suspicious — verify) and only worked because the generator child ALREADY had the component;
Foxhound completed its objective via a custom OPF_HintAction, not LayerTaskDestroy.

CAVEAT for our generator: shadowing a vanilla path affects EVERY instance of that prefab
on the map (Foxhound-style global override). For mission-local destroy targets prefer a
NEW prefab (own path + own GUID in our addon, parented to the vanilla prefab) with the
component added — same recipe, no global shadowing, and the SlotDestroy spawns our prefab.
