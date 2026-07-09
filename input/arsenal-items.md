# Arsenal item sets (MVP: one set per faction)

Curated from `reforger-item-database` (`data/items.json`, faction metadata from the
vanilla EntityCatalog configs). These fill the mission's `TS_CustomArsenal.conf`
override — the set matching the playable faction is baked into the generated addon.

**How to edit:** delete lines you don't want; add items as full `{GUID}path` prefab
refs (any line starting with `{`). Section headings are only for readability.
Clothing is intentionally excluded — loadouts cover it.

## US

### Weapons

{3E413771E1834D2F}Prefabs/Weapons/Rifles/M16/Rifle_M16A2.et
{5A987A8A13763769}Prefabs/Weapons/Rifles/M16/Rifle_M16A2_M203.et
{F97A4AC994231900}Prefabs/Weapons/Rifles/M16/Rifle_M16A2_carbine.et
{EF73725A81669E2C}Prefabs/Weapons/Rifles/M16/Rifle_M16A2_carbine_M203.et
{D2B48DEBEF38D7D7}Prefabs/Weapons/MachineGuns/M249/MG_M249.et
{D182DCDD72BF7E34}Prefabs/Weapons/MachineGuns/M60/MG_M60.et
{B31929F65F0D0279}Prefabs/Weapons/Rifles/M14/Rifle_M21.et
{81EB948E6414BD6F}Prefabs/Weapons/Rifles/M14/Rifle_M21_ARTII.et
{1353C6EAD1DCFE43}Prefabs/Weapons/Handguns/M9/Handgun_M9.et
{9C5C20FB0E01E64F}Prefabs/Weapons/Launchers/M72/Launcher_M72A3.et
{EC9BDA3D9DDD8795}Prefabs/Weapons/Flares/FlareStarParachute_M127A1_white.et
{756231FF84F158A4}Prefabs/Weapons/Flares/FlareStarParachute_M126A1_red.et
{51D9E3AEC8476BA4}Prefabs/Weapons/Flares/FlareStarParachute_M195_green.et

### Ammunition

{2EBF60EF24B108FC}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_M855_Ball.et
{D8F2CA92583B23D3}Prefabs/Weapons/Magazines/Magazine_556x45_STANAG_30rnd_M855_M856_Last_5Tracer.et
{BCB5E5C608ECFF50}Prefabs/Weapons/Magazines/Magazine_762x51_M14_20rnd_M80.et
{9C05543A503DB80E}Prefabs/Weapons/Magazines/Magazine_9x19_M9_15rnd_Ball.et
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
{AE578EEA4244D41F}Prefabs/Items/Equipment/Kits/MedicalKit_01/MedicalKit_01_US.et

### Equipment

{0CF54B9A85D8E0D4}Prefabs/Items/Equipment/Binoculars/Binoculars_M22/Binoculars_M22.et
{61D4F80E49BF9B12}Prefabs/Items/Equipment/Compass/Compass_SY183.et
{922F95F91943F69A}Prefabs/Items/Equipment/Maps/PaperMap_01_folded_US.et
{3A421547BC29F679}Prefabs/Items/Equipment/Flashlights/Flashlight_MX991/Flashlight_MX991.et
{6E35D94130954509}Prefabs/Items/Equipment/Accessories/ETool_ALICE/ETool_ALICE_FreeRoamBuilding_Gadget.et
{78ED4FEF62BBA728}Prefabs/Items/Equipment/Watches/Watch_SandY184A.et
{73950FBA2D7DB5C5}Prefabs/Items/Equipment/Radios/Radio_ANPRC68.et
{33B2DFDCD0EBA3DB}Prefabs/Items/Equipment/Kits/RepairKit_01/RepairKit_01_wrench.et

### Backpacks and Vests

{5C5C6EE05EE2FF1A}Prefabs/Items/Equipment/Backpacks/Backpack_ALICE_Medium_assembled.et
{95D4766BBE46F23D}Prefabs/Items/Equipment/Backpacks/Backpack_IIFS_FieldPack.et
{4805E67E2AE30F8D}Prefabs/Items/Equipment/Backpacks/Backpack_Medical_M5.et
{9B6B61BB3FE3DFB0}Prefabs/Items/Equipment/Radios/Radio_ANPRC77.et
{2835A0EA3B79E63E}Prefabs/Characters/Vests/Vest_ALICE/Variants/Vest_ALICE_rifleman.et
{156DC7109CEE6F69}Prefabs/Characters/Vests/Vest_ALICE/Variants/Vest_ALICE_AR.et
{18B8B9316B590643}Prefabs/Characters/Vests/Vest_ALICE/Variants/Vest_ALICE_GL.et
{477A190AF2A17B8A}Prefabs/Characters/Vests/Vest_ALICE/Variants/Vest_ALICE_MG.et
{4B57C11AA5161760}Prefabs/Characters/Vests/Vest_PASGT/Vest_PASGT.et

### Weapon Attachments

{BD496EE1B40DC510}Prefabs/Weapons/Attachments/Optics/Optic_4x20/Optic_4x20.et
{D2018EDB1BBF4C88}Prefabs/Weapons/Attachments/Optics/Optic_ARTII/Optic_ARTII.et
{08286DDBB1F33FF1}Prefabs/Weapons/Attachments/Optics/Optic_AP2k/Collim_AP2k.et
{E52C9791E1554A5F}Prefabs/Weapons/Attachments/Muzzle/Suppressor_M16/Suppressor_M16.et
{6288A1F1A5E3AC37}Prefabs/Weapons/Attachments/Muzzle/FlashHider_M16A2/FlashHider_M16.et
{558117556F3880A8}Prefabs/Weapons/Attachments/Bayonets/Bayonet_M9.et

## USSR

### Weapons

{FA5C25BF66A53DCF}Prefabs/Weapons/Rifles/AK74/Rifle_AK74.et
{63E8322E2ADD4AA7}Prefabs/Weapons/Rifles/AK74/Rifle_AK74_GP25.et
{BFEA719491610A45}Prefabs/Weapons/Rifles/AKS74U/Rifle_AKS74U.et
{A7AF84C6C58BA3E8}Prefabs/Weapons/MachineGuns/RPK74/MG_RPK74.et
{A89BC9D55FFB4CD8}Prefabs/Weapons/MachineGuns/PKM/MG_PKM.et
{6415B7923DE28C1B}Prefabs/Weapons/Rifles/SVD/Rifle_SVD_PSO.et
{C0F7DD85A86B2900}Prefabs/Weapons/Handguns/PM/Handgun_PM.et
{7A82FE978603F137}Prefabs/Weapons/Launchers/RPG7/Launcher_RPG7.et
{E8A55396050E1762}Prefabs/Weapons/Launchers/RPG7/Launcher_RPG7_PGO7.et
{722CE6FEC39EE896}Prefabs/Weapons/Launchers/RPG22/Launcher_RPG22.et
{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et
{36218D5F0C7095E6}Prefabs/Weapons/Flares/Flare_RSP30_red.et
{FC79F6BDEB7F1BC2}Prefabs/Weapons/Flares/Flare_RSP30_green.et

### Ammunition

{BBB50A815A2F916B}Prefabs/Weapons/Magazines/Magazine_545x39_AK_30rnd_Ball.et
{0A84AA5A3884176F}Prefabs/Weapons/Magazines/Magazine_545x39_AK_30rnd_Last_5Tracer.et
{BC74DAC891D48540}Prefabs/Weapons/Magazines/Magazine_545x39_RPK_45rnd_Ball.et
{E5E9C5897CF47F44}Prefabs/Weapons/Magazines/Box_762x54_PK_100rnd_4Ball_1Tracer.et
{9CCB46C6EE632C1A}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_Sniper.et
{8B853CDD11BA916E}Prefabs/Weapons/Magazines/Magazine_9x18_PM_8rnd_Ball.et
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
{21EF98BFC1EB3793}Prefabs/Items/Equipment/Kits/MedicalKit_01/MedicalKit_01_USSR.et

### Equipment

{243948B23D90BECB}Prefabs/Items/Equipment/Binoculars/Binoculars_B8/Binoculars_B8.et
{F2539FA5706E51E4}Prefabs/Items/Equipment/Binoculars/Binoculars_B12/Binoculars_B12.et
{7CEF68E2BC68CE71}Prefabs/Items/Equipment/Compass/Compass_Adrianov.et
{F849217AB3BA88BE}Prefabs/Items/Equipment/Maps/PaperMap_01_folded_USSR.et
{575EA58E67448C2A}Prefabs/Items/Equipment/Flashlights/Flashlight_Soviet_01/Flashlight_Soviet_01.et
{062E2F1D7F6739D6}Prefabs/Items/Equipment/Accessories/ETool_MPL50/ETool_MPL50_FreeRoamBuilding_Gadget.et
{6FD6C96121905202}Prefabs/Items/Equipment/Watches/Watch_Vostok.et
{E1A5D4B878AA8980}Prefabs/Items/Equipment/Radios/Radio_R148.et
{33B2DFDCD0EBA3DB}Prefabs/Items/Equipment/Kits/RepairKit_01/RepairKit_01_wrench.et

### Backpacks and Vests

{3DE0155EC9767B98}Prefabs/Items/Equipment/Backpacks/Backpack_Veshmeshok.et
{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et
{0D39750E5695B9D8}Prefabs/Items/Equipment/Backpacks/Backpack_RPG_Gunner.et
{6A39B5843B3F36DA}Prefabs/Items/Equipment/Backpacks/Backpack_RPG_Assistant.et
{7AC107CA7AFC9B59}Prefabs/Items/Equipment/Backpacks/Backpack_Medical_Soviet.et
{54C68E438DD34265}Prefabs/Items/Equipment/Radios/Radio_R107M.et
{08155E701A949620}Prefabs/Characters/Vests/Vest_SovietHarness/Variants/Vest_SovietHarness_rifleman.et
{4711A4CAF64C4CEE}Prefabs/Characters/Vests/Vest_SovietHarness/Variants/Vest_SovietHarness_AR.et
{15067AD09803580D}Prefabs/Characters/Vests/Vest_SovietHarness/Variants/Vest_SovietHarness_MG.et
{9713FE6DDCC9510D}Prefabs/Characters/Vests/Vest_Lifchik/Vest_Lifchik.et
{C8516078375CBE45}Prefabs/Characters/Vests/Vest_Lifchik/Vest_Lifchik_GL.et
{ADE19B33DCBB9005}Prefabs/Characters/Vests/Vest_6B2/Vest_6B2.et
{4CBDC206FEF9897C}Prefabs/Characters/Vests/Vest_6B3/Vest_6B3.et

### Weapon Attachments

{ACDF49FACD0701A8}Prefabs/Weapons/Attachments/Optics/Optic_1P29/Optic_1P29.et
{C850A33226B8F9C1}Prefabs/Weapons/Attachments/Optics/Optic_PSO1/Optic_PSO1.et
{E5E9DBBF3BFB88C6}Prefabs/Weapons/Attachments/Optics/Optic_PGO7/Optic_PGO7V3.et
{3B96FAC169E27037}Prefabs/Weapons/Attachments/Muzzle/Suppressor_PBS4/Suppressor_PBS4.et
{4A815EB8B824974A}Prefabs/Weapons/Attachments/Muzzle/FlashHider_AK74/FlashHider_AK74.et
{98C79F5FAE12F9B6}Prefabs/Weapons/Attachments/Bayonets/Bayonet_6Kh4.et

## FIA

### Weapons

{9C948630078D154D}Prefabs/Weapons/Rifles/VZ58/Rifle_VZ58P.et
{443CEFF17E040B11}Prefabs/Weapons/Rifles/VZ58/Rifle_VZ58V.et
{026CE108BFB3EC03}Prefabs/Weapons/MachineGuns/UK59/MG_UK59.et
{3EB02CDAD5F23C82}Prefabs/Weapons/Rifles/SVD/Rifle_SVD.et
{6415B7923DE28C1B}Prefabs/Weapons/Rifles/SVD/Rifle_SVD_PSO.et
{C0F7DD85A86B2900}Prefabs/Weapons/Handguns/PM/Handgun_PM.et
{7A82FE978603F137}Prefabs/Weapons/Launchers/RPG7/Launcher_RPG7.et
{7C45EC94C698246B}Prefabs/Weapons/Launchers/RPG75/Launcher_RPG75.et
{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et
{36218D5F0C7095E6}Prefabs/Weapons/Flares/Flare_RSP30_red.et
{FC79F6BDEB7F1BC2}Prefabs/Weapons/Flares/Flare_RSP30_green.et

### Ammunition

{48720FC416263FC1}Prefabs/Weapons/Magazines/Vz58/Magazine_762x39_Vz58_30rnd_Ball.et
{A827B610B7CD4158}Prefabs/Weapons/Magazines/Vz58/Magazine_762x39_Vz58_30rnd_Last_5Tracer.et
{03094E059B554A9C}Prefabs/Weapons/Magazines/UK59/Box_762x54_UK59_50rnd_4Ball_1Tracer.et
{77595CB9F596E6AC}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_LPS.et
{9CCB46C6EE632C1A}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_Sniper.et
{8B853CDD11BA916E}Prefabs/Weapons/Magazines/Magazine_9x18_PM_8rnd_Ball.et
{32E12D322E107F1C}Prefabs/Weapons/Ammo/Ammo_Rocket_PG7VM.et

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
{9132672C4D9B2102}Prefabs/Items/Equipment/Kits/MedicalKit_01/MedicalKit_01_FIA.et

### Equipment

{243948B23D90BECB}Prefabs/Items/Equipment/Binoculars/Binoculars_B8/Binoculars_B8.et
{F2539FA5706E51E4}Prefabs/Items/Equipment/Binoculars/Binoculars_B12/Binoculars_B12.et
{7CEF68E2BC68CE71}Prefabs/Items/Equipment/Compass/Compass_Adrianov.et
{983B57B8E95C1F52}Prefabs/Items/Equipment/Maps/PaperMap_01_folded_FIA.et
{575EA58E67448C2A}Prefabs/Items/Equipment/Flashlights/Flashlight_Soviet_01/Flashlight_Soviet_01.et
{062E2F1D7F6739D6}Prefabs/Items/Equipment/Accessories/ETool_MPL50/ETool_MPL50_FreeRoamBuilding_Gadget.et
{61A705D76908160C}Prefabs/Items/Equipment/Watches/Watch_Orlik38/Watch_Orlik38.et
{540C08AD5F21A5FA}Prefabs/Items/Equipment/Radios/Radio_R148_FIA.et
{33B2DFDCD0EBA3DB}Prefabs/Items/Equipment/Kits/RepairKit_01/RepairKit_01_wrench.et

### Backpacks and Vests

{FDA7B6630DB87991}Prefabs/Items/Equipment/Backpacks/Backpack_M70_Swiss.et
{41A9C55B61F375F0}Prefabs/Items/Equipment/Backpacks/Backpack_Kolobok.et
{0D39750E5695B9D8}Prefabs/Items/Equipment/Backpacks/Backpack_RPG_Gunner.et
{6A39B5843B3F36DA}Prefabs/Items/Equipment/Backpacks/Backpack_RPG_Assistant.et
{79015191C0E77E48}Prefabs/Items/Equipment/Backpacks/Backpack_Medical_Soviet_02.et
{73EFD7591F4134D3}Prefabs/Items/Equipment/Radios/Radio_RF10/Radio_RF10.et
{ED5574EA7F63B457}Prefabs/Characters/Vests/Vest_Type56/Vest_Type56.et
{ADE19B33DCBB9005}Prefabs/Characters/Vests/Vest_6B2/Vest_6B2.et

### Weapon Attachments

{C850A33226B8F9C1}Prefabs/Weapons/Attachments/Optics/Optic_PSO1/Optic_PSO1.et
{886A96EF3F14BCD2}Prefabs/Weapons/Attachments/Optics/UK59_4x8/Optic_UK59_4x8.et
{3F1B1BAD1F6DDC28}Prefabs/Weapons/Attachments/Bayonets/Bayonet_VZ58/Bayonet_VZ58_v1.et

