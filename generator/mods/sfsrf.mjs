// RF Special Force Squad (Abrashka) — "SFS RF Loadout" (69F72741A0C9B270).
// Same author/concept as the SFS US pack (sfs.mjs), USSR replacement this
// time: NOT a faction — modernized Russian Federation SF characters named
// Character_RF_* at the vanilla OPFOR/USSR_Army folder plus 4 AI group
// prefabs, all resolving to the in-game "USSR" faction. Integration =
// `aliasOf: "USSR"`: SFS_USSR inherits entryGuid / callsigns / spawn point /
// vehicles / fortifications from vanilla USSR and overrides label, loadouts,
// arsenal, groupSets, hvt and patrolCrew.
//
// Groups (fresh GUIDs, catalog-sourced) parent the VANILLA Group_USSR_Base
// {8DE0C0830FE0C33D} — the shipped Group_USSR_Base.et is an override of the
// vanilla base (adds 6 RF slots; harmless: vanilla concrete groups define
// their own slots). Registered via clean overrides of the vanilla USSR
// catalogs Groups_EntityCatalog_USSR.conf / WeaponTripod_EntityCatalog_USSR
// .conf (append-only, fresh member GUIDs). The catalog lists SentryTeam
// TWICE (author slip) and omits Group_USSR_SearchGroup.et entirely — the
// SearchGroup ships on disk but has no harvestable GUID, so it's excluded
// (same as MEI's stray teams).
//
// GUID sources: characters = the mod's LoadoutManager_Editor.et override;
// groups = Groups_EntityCatalog_USSR.conf; arsenal = the author's
// E_CustomArsenalSFS.et box (SCR_ArsenalComponent item list — sent by the
// author as the curated set; we drop its one primary weapon, MG_PKM_B51_SOF
// {244CEE7882EE68F5}, per the standing no-primaries arsenal rule, keeping
// its ammo boxes). All characters concrete (VariantData-free) — safe for any
// spawn path. Loadout names are Russian, matching the vanilla-USSR naming
// convention.
//
// Dependency anchor: the mod itself (transitive-closure pattern). Its .gproj
// pulls RHS, StunGrenade, 401ksRussianLeafSuits, the SFS core scripts
// (SFS_LoadoutBoxComponent et al.) and the MUFFISBEST PKP-B pack transitively.
const P_RF_C = "Prefabs/Characters/Factions/OPFOR/USSR_Army";
const P_RF_G = "Prefabs/Groups/OPFOR";

export const SFSRF = {
  id: "sfsrf",
  label: "RF Special Force Squad (Abrashka)",
  workshopUrl: "https://reforger.armaplatform.com/workshop/69F72741A0C9B270",
  dependencies: ["69F72741A0C9B270"],
  factions: {
    SFS_USSR: {
      aliasOf: "USSR",
      label: "RF Special Force Squad (Abrashka)",
      hvt: `{AD68BFF34CA720BD}${P_RF_C}/Character_RF_PL.et`,
      // Concrete RF characters so patrols/QRF vehicles carry SF crews, not
      // the prefab-default vanilla USSR ones (universal patrolCrew rule)
      patrolCrew: [
        `{4DF623E7F9C0F333}${P_RF_C}/Character_RF_Crew.et`,
        `{814572381FE980FD}${P_RF_C}/Character_RF_Rifleman.et`,
        `{542B89549473DA14}${P_RF_C}/Character_RF_GL.et`,
        `{4465FCB62ED31D3B}${P_RF_C}/Character_RF_LAT.et`,
        `{7202885B2B9F0906}${P_RF_C}/Character_RF_FTL.et`,
      ],
      // ONE pool (EnemyPanel hides the troops list for single-set factions).
      // Slot counts from m_aUnitPrefabSlots; classes per the project size rules.
      defaultGroupSet: "SFS",
      groupSets: {
        SFS: {
          label: "Special Force Squad",
          sentry: `{CB58D90EA14430AE}${P_RF_G}/Group_USSR_SentryTeam.et`,
          defense: { ref: `{6B6B2B2836D6DC79}${P_RF_G}/Group_USSR_RifleSquad.et`, size: 7 },
          small: [`{CB58D90EA14430AE}${P_RF_G}/Group_USSR_SentryTeam.et`],
          medium: [
            `{30ED11AA4F0D41E6}${P_RF_G}/Group_USSR_FireGroup.et`,
            `{475563F8643503F9}${P_RF_G}/Group_USSR_LightFireTeam.et`,
          ],
          large: [`{6B6B2B2836D6DC79}${P_RF_G}/Group_USSR_RifleSquad.et`],
        },
      },
      riflemen: {
        "Special Force Squad": `{814572381FE980FD}${P_RF_C}/Character_RF_Rifleman.et`,
      },
      loadoutSets: {
        "Special Force Squad": [
          { name: "Стрелок", prefab: `{814572381FE980FD}${P_RF_C}/Character_RF_Rifleman.et` },
          { name: "Стрелок ГП", prefab: `{542B89549473DA14}${P_RF_C}/Character_RF_GL.et` },
          { name: "Пулеметчик", prefab: `{0BE9296F0D8BA7DD}${P_RF_C}/Character_RF_MG.et` },
          { name: "Гранатометчик", prefab: `{81569EB41A4DAD62}${P_RF_C}/Character_RF_AT.et` },
          { name: "ПТ Стрелок", prefab: `{4465FCB62ED31D3B}${P_RF_C}/Character_RF_LAT.et` },
          { name: "Санитар", prefab: `{1106DD26506B4B87}${P_RF_C}/Character_RF_Medic.et` },
          { name: "Сапер", prefab: `{989653474741CABD}${P_RF_C}/Character_RF_Sapper.et` },
          { name: "Ком. группы", prefab: `{7202885B2B9F0906}${P_RF_C}/Character_RF_FTL.et` },
          { name: "Ком. отделения", prefab: `{3476066A5140112D}${P_RF_C}/Character_RF_SL.et` },
          { name: "Ком. взвода", prefab: `{AD68BFF34CA720BD}${P_RF_C}/Character_RF_PL.et` },
          { name: "Снайпер", prefab: `{F61BCB26706E8557}${P_RF_C}/Character_RF_Sniper.et` },
          { name: "Экипаж", prefab: `{4DF623E7F9C0F333}${P_RF_C}/Character_RF_Crew.et` },
          { name: "Пилот", prefab: `{578A43E26908A795}${P_RF_C}/Character_RF_Pilot.et` },
        ],
      },
      // The author's E_CustomArsenalSFS.et list verbatim, minus the
      // MG_PKM_B51_SOF primary (no-primaries rule) and a duplicate
      // FILBE_Backpack_Heavy_BIG entry
      arsenalItems: [
        { mode: "WEAPON", ref: "{3F38EE51E904AE5B}Prefabs/Weapons/Launchers/RPOA/Launcher_RPOA.et" },
        { mode: "WEAPON", ref: "{D107989BCA4445D7}Prefabs/Weapons/Launchers/RPOA/Launcher_RPOD.et" },
        { mode: "WEAPON", ref: "{EC9BDA3D9DDD8795}Prefabs/Weapons/Flares/FlareStarParachute_M127A1_white.et" },
        { mode: "AMMUNITION", ref: "{B39F57E7FB003434}Prefabs/Weapons/Magazines/AK12_magazine/Magazine_545x39_AK12_30rnd_Base.et" },
        { mode: "AMMUNITION", ref: "{FBBF84E3B447D822}Prefabs/Weapons/Ammo/RPG/RHS_AmmoRocket_PG7VL.et" },
        { mode: "AMMUNITION", ref: "{262F0D09C4130826}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_VOG25.et" },
        { mode: "AMMUNITION", ref: "{D3CCDE5C34549F1A}Prefabs/Weapons/Magazines/GM94/Magazine_43x30mm_GM94_4rnd_VGM93900.et" },
        { mode: "AMMUNITION", ref: "{FDACA6E5AEC36BD0}Prefabs/Weapons/Magazines/GM94/Magazine_43x30mm_GM94_4rnd_VGM93100.et" },
        { mode: "AMMUNITION", ref: "{C42F83C4FD0A11B2}Prefabs/Weapons/PKP-B/Magazines/Box_762x54_PKP_B_100rnd_Base_MUFFISBEST.et" },
        { mode: "AMMUNITION", ref: "{E5E9C5897CF47F44}Prefabs/Weapons/Magazines/Box_762x54_PK_100rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{E256C0CC945E18A5}Prefabs/Weapons/Magazines/Magazine_8,6x70_mm_(.338 Lapua Magnum)_BP.et" },
        { mode: "", ref: "{1ABABE3551512B0A}Prefabs/Weapons/Attachments/Underbarrel/UGL_GP25.et" },
        { mode: "", ref: "{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et" },
        { mode: "", ref: "{8E97135D2E37CAA6}Prefabs/Weapons/Grenades/Grenade_Stun_OPFOR.et" },
        { mode: "", ref: "{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et" },
        { mode: "", ref: "{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et" },
        { mode: "", ref: "{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et" },
        { mode: "CONSUMABLE", ref: "{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et" },
        { mode: "", ref: "{21EF98BFC1EB3793}Prefabs/Items/Equipment/Kits/MedicalKit_01/MedicalKit_01_USSR.et" },
        { mode: "", ref: "{843B3B353F31A527}Prefabs/Items/Equipment/Binoculars/Rangefinder_Vector21_t_lc.et" },
        { mode: "", ref: "{2A31D4F1DEE607DC}Prefabs/Items/Equipment/Radios/Radio_R187P1_OLD_1ch.et" },
        { mode: "", ref: "{74D9FDB2616B89D3}Prefabs/Items/Equipment/Radios/Radio_R187P1_OLD_2ch.et" },
        { mode: "", ref: "{80D1BA2A6CB6E1A7}Prefabs/Items/Equipment/Radios/Radio_R187P1_OLD_3ch.et" },
        { mode: "", ref: "{F849217AB3BA88BE}Prefabs/Items/Equipment/Maps/Map_Paper_01/PaperMap_01_folded_USSR.et" },
        { mode: "", ref: "{C354CB40B3928AC0}Prefabs/Items/Equipment/Navigation/Orion/Orion_Map.et" },
        { mode: "", ref: "{7CEF68E2BC68CE71}Prefabs/Items/Equipment/Compass/Compass_Adrianov.et" },
        { mode: "", ref: "{575EA58E67448C2A}Prefabs/Items/Equipment/Flashlights/Flashlight_Soviet_01/Flashlight_Soviet_01.et" },
        { mode: "", ref: "{062E2F1D7F6739D6}Prefabs/Items/Equipment/Accessories/ETool_MPL50/ETool_MPL50_FreeRoamBuilding_Gadget.et" },
        { mode: "", ref: "{33B2DFDCD0EBA3DB}Prefabs/Items/Equipment/Kits/RepairKit_01/RepairKit_01_wrench.et" },
        { mode: "", ref: "{E99828C1199986A5}Prefabs/Items/Equipment/Backpacks/FILBE_Backpack_Heavy_BIG.et" },
        { mode: "", ref: "{4F4F2D9BA5175884}Prefabs/Items/Equipment/Backpacks/Backpack_Wartech_BB102_FG_CUSTOM.et" },
      ],
    },
  },
};
