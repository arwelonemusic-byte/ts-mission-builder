# Arsenal item sets (MVP: one set per faction)

Curated from `reforger-item-database` (`data/items.json`, faction metadata from the
vanilla EntityCatalog configs). These fill the mission's `TS_CustomArsenal.conf`
override — the set matching the playable faction is baked into the generated addon.

**How to edit:** delete lines you don't want; add items as full `{GUID}path` prefab
refs (any line starting with `{`). Section headings are only for readability.
Clothing is intentionally excluded — loadouts cover it.

## US

### Weapons


{9C5C20FB0E01E64F}Prefabs/Weapons/Launchers/M72/Launcher_M72A3.et
{EC9BDA3D9DDD8795}Prefabs/Weapons/Flares/FlareStarParachute_M127A1_white.et
{756231FF84F158A4}Prefabs/Weapons/Flares/FlareStarParachute_M126A1_red.et
{51D9E3AEC8476BA4}Prefabs/Weapons/Flares/FlareStarParachute_M195_green.et

### Ammunition

{D8F2CA92583B23D3}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_M855_M856_Last_5Tracer.et
{BCB5E5C608ECFF50}Prefabs/Weapons/Magazines/Magazine_762x51_M14_20rnd_M80.et
{06D722FC2666EB83}Prefabs/Weapons/Magazines/Box_556x45_M249_200rnd_4Ball_1Tracer.et
{4D2C1E8F3A81F894}Prefabs/Weapons/Magazines/Box_762x51_M60_100rnd_4Ball_1Tracer.et
{5375FA7CB1F68573}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_M406.et
{1663496AE5B9F10B}Prefabs/Weapons/Ammo/Ammo_Grenade_HEDP_M433.et
{98DB57ECEDC81CC2}Prefabs/Weapons/Ammo/Ammo_Flare_40mm_M583A1_White.et

### Throwables

{E8F00BF730225B00}Prefabs/Weapons/Grenades/Grenade_M67.et
{9DB69176CEF0EE97}Prefabs/Weapons/Grenades/Smoke_ANM8HC.et
{D41D22DD1B8E921E}Prefabs/Weapons/Grenades/M18/Smoke_M18_Green.et
{3343A055A83CB30D}Prefabs/Weapons/Grenades/M18/Smoke_M18_Red.et
{14C1A0F061D9DDEE}Prefabs/Weapons/Grenades/M18/Smoke_M18_Violet.et
{9BBDEE253A16CC66}Prefabs/Weapons/Grenades/M18/Smoke_M18_Yellow.et

### Explosives

{33CBDE73AB48172A}Prefabs/Weapons/Explosives/DemoBlock_M112/DemoBlock_M112.et
{CE0AF733722B3978}Prefabs/Items/Equipment/Detonators/BlastingMachine_M34/BlastingMachine_M34.et
{E4C9F0A4090CFE4D}Prefabs/Weapons/Explosives/Mine_M14/Mine_M14.et
{49FFE8F373F55960}Prefabs/Weapons/Explosives/Mine_M15AT/Mine_M15AT.et

### Medical

{A81F501D3EF6F38E}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_US_01.et
{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et
{00E36F41CA310E2A}Prefabs/Items/Medicine/SalineBag_01/SalineBag_US_01.et
{D70216B1B2889129}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_US_01.et

### Equipment

{73950FBA2D7DB5C5}Prefabs/Items/Equipment/Radios/Radio_ANPRC68.et

### Backpacks and Vests

{5C5C6EE05EE2FF1A}Prefabs/Items/Equipment/Backpacks/Backpack_ALICE_Medium_assembled.et
{95D4766BBE46F23D}Prefabs/Items/Equipment/Backpacks/Backpack_IIFS_FieldPack.et

## USSR

### Weapons

{722CE6FEC39EE896}Prefabs/Weapons/Launchers/RPG22/Launcher_RPG22.et
{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et
{36218D5F0C7095E6}Prefabs/Weapons/Flares/Flare_RSP30_red.et
{FC79F6BDEB7F1BC2}Prefabs/Weapons/Flares/Flare_RSP30_green.et

### Ammunition

{0A84AA5A3884176F}Prefabs/Weapons/Magazines/Magazine_545x39_AK_30rnd_Last_5Tracer.et
{BC74DAC891D48540}Prefabs/Weapons/Magazines/Magazine_545x39_RPK_45rnd_Ball.et
{E5E9C5897CF47F44}Prefabs/Weapons/Magazines/Box_762x54_PK_100rnd_4Ball_1Tracer.et
{9CCB46C6EE632C1A}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_Sniper.et
{32E12D322E107F1C}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VM.et
{609E216CBF8D0B68}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VL.et
{AA658D334766D4EE}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VR.et
{262F0D09C4130826}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_VOG25.et
{906F07BD0366E08F}Prefabs/Weapons/Ammo/Ammo_Flare_40mm_VG40OP_White.et

### Throwables

{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et
{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et

### Explosives

{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et
{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et
{B05A816C0BF50802}Prefabs/Weapons/Explosives/Mine_PMN4/Mine_PMN4.et
{D6EF54367CECE1D9}Prefabs/Weapons/Explosives/Mine_TM62M/Mine_TM62M.et

### Medical

{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et
{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et
{527D7C5D2E476BDC}Prefabs/Items/Medicine/SalineBag_01/SalineBag_USSR_01.et
{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et

### Backpacks and Vests

{3DE0155EC9767B98}Prefabs/Items/Equipment/Backpacks/Backpack_Veshmeshok.et
{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et

## FIA

### Weapons

{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et
{36218D5F0C7095E6}Prefabs/Weapons/Flares/Flare_RSP30_red.et
{FC79F6BDEB7F1BC2}Prefabs/Weapons/Flares/Flare_RSP30_green.et

### Ammunition

{A827B610B7CD4158}Prefabs/Weapons/Magazines/Vz58/Magazine_762x39_Vz58_30rnd_Last_5Tracer.et
{03094E059B554A9C}Prefabs/Weapons/Magazines/UK59/Box_762x54_UK59_50rnd_4Ball_1Tracer.et
{77595CB9F596E6AC}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_LPS.et
{9CCB46C6EE632C1A}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_Sniper.et
{32E12D322E107F1C}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VM.et
{609E216CBF8D0B68}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VL.et
{AA658D334766D4EE}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VR.et

### Throwables

{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et
{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et

### Explosives

{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et
{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et
{B05A816C0BF50802}Prefabs/Weapons/Explosives/Mine_PMN4/Mine_PMN4.et
{D6EF54367CECE1D9}Prefabs/Weapons/Explosives/Mine_TM62M/Mine_TM62M.et

### Medical

{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et
{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et
{527D7C5D2E476BDC}Prefabs/Items/Medicine/SalineBag_01/SalineBag_USSR_01.et
{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et

### Backpacks and Vests

{FDA7B6630DB87991}Prefabs/Items/Equipment/Backpacks/Backpack_M70_Swiss.et
{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et

