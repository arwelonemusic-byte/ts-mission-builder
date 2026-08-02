// US Special Force Squad (Abrashka) — "SFS US Loadout" (69F2D31EB2E09C84).
//
// NOT a faction: a playable-only loadout pack. The mod ships 12 modernized
// SF character prefabs at the vanilla US_Army paths but with THEIR OWN
// resource GUIDs (Workbench-duplicate style — e.g. Crew {E1CB513B8B9B08F5}
// vs vanilla {E1CB513B8B9B08F4}), all faction US, parented to the vanilla
// US BaseLoadout. Integration = the aliasOf machinery (kept dormant since
// MEI v1, first real playable use): SFS_US is a UI-level faction entry that
// resolves to the in-game "US" faction at emission, inheriting entryGuid /
// callsigns / spawn point / vehicles from vanilla US and carrying only its
// own label, loadouts and arsenal. playableOnly hides it from the enemy
// dropdown (it has no groups of its own — inherited US groupSets are never
// used).
//
// GUIDs ground-truthed from the extraction
// (D:\VSCode_dev\arma-reforger\reference\SFS US Loadout): character resource
// refs from the mod's own Prefabs/MP/Managers/Loadouts/LoadoutManager_Editor.et
// override (the only conf-like GUID source — no .meta ships); item refs from
// the character prefabs' inventories. All 12 characters are concrete
// (VariantData-free) — safe for any spawn path.
//
// Dependency anchor: the mod itself. Its .gproj declares GRS-ShadowsPistolPack,
// GRS-Weapons, MilsimRadioNetwork, StunGrenade, FORTEX_ORSIS_T5000_TO_US,
// MK46AMPMK48-FIXED and 401ksRussianLeafSuits; RHS (595F2BF2F44836FB) arrives
// transitively via GRS-Weapons. One anchor GUID suffices (validated pattern).
const P_SFS_C = "Prefabs/Characters/Factions/BLUFOR/US_Army";

export const SFS = {
  id: "sfs",
  label: "US Special Force Squad (Abrashka)",
  workshopUrl: "https://reforger.armaplatform.com/workshop/69F2D31EB2E09C84",
  dependencies: ["69F2D31EB2E09C84"],
  factions: {
    SFS_US: {
      aliasOf: "US",
      label: "US Special Force Squad (Abrashka)",
      playableOnly: true,
      riflemen: {
        "Special Force Squad": `{F44F87222B67E26A}${P_SFS_C}/Character_US_Rifleman.et`,
      },
      loadoutSets: {
        "Special Force Squad": [
          { name: "Rifleman", prefab: `{F44F87222B67E26A}${P_SFS_C}/Character_US_Rifleman.et` },
          { name: "Grenadier", prefab: `{06A2C5FD02D05F65}${P_SFS_C}/Character_US_GP.et` },
          { name: "Machine Gunner", prefab: `{ADB0F1274E9A0670}${P_SFS_C}/Character_US_MG.et` },
          { name: "Anti-tank (SMAW)", prefab: `{270F46FC595C0CCF}${P_SFS_C}/Character_US_AT.et` },
          { name: "Light Anti-tank", prefab: `{526AEFB356C2F1BF}${P_SFS_C}/Character_US_LightAT.et` },
          { name: "Medic", prefab: `{CDA1BFA445A6C6F5}${P_SFS_C}/Character_US_Medic.et` },
          { name: "Sapper", prefab: `{E72229CB79558754}${P_SFS_C}/Character_US_Sapper.et` },
          { name: "FTL", prefab: `{DD8871B53B595AEC}${P_SFS_C}/Character_US_FTL.et` },
          { name: "SL", prefab: `{922FDE221251B080}${P_SFS_C}/Character_US_SL.et` },
          { name: "Sniper", prefab: `{C0EE7CD6A89B123B}${P_SFS_C}/Character_US_Sniper.et` },
          { name: "Crew", prefab: `{E1CB513B8B9B08F5}${P_SFS_C}/Character_US_Crew.et` },
          { name: "Pilot", prefab: `{8B2D21607CC52AE7}${P_SFS_C}/Character_US_Pilot.et` },
        ],
      },
      // Curated per the arsenal rule (no primaries): launchers + flares,
      // ammo for the pack's weapons (GRS shorty Pmags, S&W Spec Series
      // pistol, Mk48, M40A5, GM94, SMAW), explosives, medical, utility,
      // backpacks. Item refs come straight from the SFS characters'
      // inventories, so every magazine matches an issued weapon.
      arsenalItems: [
        { mode: "WEAPON", ref: "{9C5C20FB0E01E64F}Prefabs/Weapons/Launchers/M72/Launcher_M72A3.et" },
        { mode: "WEAPON", ref: "{35022055DCDDE98B}Prefabs/Weapons/Launchers/MK153/Launcher_MK153mod2.et" },
        { mode: "WEAPON", ref: "{EC9BDA3D9DDD8795}Prefabs/Weapons/Flares/FlareStarParachute_M127A1_white.et" },
        { mode: "WEAPON", ref: "{756231FF84F158A4}Prefabs/Weapons/Flares/FlareStarParachute_M126A1_red.et" },
        { mode: "WEAPON", ref: "{51D9E3AEC8476BA4}Prefabs/Weapons/Flares/FlareStarParachute_M195_green.et" },
        { mode: "AMMUNITION", ref: "{BDEC33EC406B8B3D}Prefabs/Weapons/Magazines/Pmag/Magazine_556x45_PmagWindowed_RP_30rnd_m995.et" },
        { mode: "AMMUNITION", ref: "{91A8A0194CD8C4B8}Prefabs/Weapons/Magazines/S&W Spec Series.et" },
        { mode: "AMMUNITION", ref: "{A5ABF3A654653153}Prefabs/Weapons/Magazines/7.62 Nato AP 100rnd.et" },
        { mode: "AMMUNITION", ref: "{BD870C104949A281}Prefabs/Weapons/Magazines/7.62 Nato AP Tracer 100rnd.et" },
        { mode: "AMMUNITION", ref: "{925F3A6F7FE0DE64}Prefabs/Weapons/Magazines/Magazine_762x51_M40_5rnd_M61AP.et" },
        { mode: "AMMUNITION", ref: "{FDACA6E5AEC36BD0}Prefabs/Weapons/Magazines/GM94/Magazine_43x30mm_GM94_4rnd_VGM93100.et" },
        { mode: "AMMUNITION", ref: "{D3CCDE5C34549F1A}Prefabs/Weapons/Magazines/GM94/Magazine_43x30mm_GM94_4rnd_VGM93900.et" },
        { mode: "AMMUNITION", ref: "{27AC9FC7F5E2BEEB}Prefabs/Weapons/Magazines/MK153/Container_MK153_HEDP.et" },
        { mode: "", ref: "{E8F00BF730225B00}Prefabs/Weapons/Grenades/Grenade_M67.et" },
        { mode: "", ref: "{ED97A510AA0A46C5}Prefabs/Weapons/Grenades/Grenade_Stun.et" },
        { mode: "", ref: "{9DB69176CEF0EE97}Prefabs/Weapons/Grenades/Smoke_ANM8HC.et" },
        { mode: "", ref: "{D41D22DD1B8E921E}Prefabs/Weapons/Grenades/M18/Smoke_M18_Green.et" },
        { mode: "", ref: "{3343A055A83CB30D}Prefabs/Weapons/Grenades/M18/Smoke_M18_Red.et" },
        { mode: "", ref: "{14C1A0F061D9DDEE}Prefabs/Weapons/Grenades/M18/Smoke_M18_Violet.et" },
        { mode: "", ref: "{9BBDEE253A16CC66}Prefabs/Weapons/Grenades/M18/Smoke_M18_Yellow.et" },
        { mode: "", ref: "{33CBDE73AB48172A}Prefabs/Weapons/Explosives/DemoBlock_M112/DemoBlock_M112.et" },
        { mode: "", ref: "{CE0AF733722B3978}Prefabs/Items/Equipment/Detonators/BlastingMachine_M34/BlastingMachine_M34.et" },
        { mode: "", ref: "{49FFE8F373F55960}Prefabs/Weapons/Explosives/Mine_M15AT/Mine_M15AT.et" },
        { mode: "CONSUMABLE", ref: "{A81F501D3EF6F38E}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_US_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{00E36F41CA310E2A}Prefabs/Items/Medicine/SalineBag_01/SalineBag_US_01.et" },
        { mode: "CONSUMABLE", ref: "{D70216B1B2889129}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_US_01.et" },
        { mode: "", ref: "{AE578EEA4244D41F}Prefabs/Items/Equipment/Kits/MedicalKit_01/MedicalKit_01_US.et" },
        { mode: "", ref: "{FAE8B9F7CEA49696}Prefabs/Items/Equipment/Binoculars/Rangefinder_Vector21_lc.et" },
        { mode: "", ref: "{1D71E1BFAE1E0481}Prefabs/Items/Equipment/Radios/Milsim_Radios/TUO-HH-163-HP.et" },
        { mode: "", ref: "{2C99C2B9A10C711D}Prefabs/Items/Equipment/Navigation/DAGR/DAGR_Map.et" },
        { mode: "", ref: "{33B2DFDCD0EBA3DB}Prefabs/Items/Equipment/Kits/RepairKit_01/RepairKit_01_wrench.et" },
        { mode: "", ref: "{BC4ABD18AF9564D5}Prefabs/Items/Equipment/Backpacks/FILBE_Backpack_Heavy.et" },
        { mode: "", ref: "{42EA0BC81221FC0C}Prefabs/Items/Equipment/Backpacks/FILBE_Backpack_Heavy_Ext.et" },
        { mode: "", ref: "{1B9B1BB7CD2D14A7}Prefabs/Items/Equipment/Backpacks/Backpack_Hiking_Covered_Autumn.et" },
      ],
    },
  },
};
