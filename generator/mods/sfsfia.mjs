// FIA Special Force Squad (Abrashka) — "SFS FIA Loadout" (6A066E84BB1DA751).
// Same author/concept as the SFS US/RF packs (sfs.mjs / sfsrf.mjs), FIA
// replacement: NOT a faction — modernized FIA characters at the vanilla
// INDFOR/FIA paths with their own resource GUIDs (Workbench-duplicate style —
// Crew {641AD7731E23454C} is one digit off vanilla {641AD7731E23454B}) plus
// 6 AI group prefabs, all resolving to the in-game "FIA" faction.
// Integration = `aliasOf: "FIA"`: SFS_FIA inherits entryGuid / callsigns /
// spawn point / vehicles / fortifications from vanilla FIA and overrides
// label, loadouts, arsenal, groupSets, hvt and patrolCrew.
//
// Groups (fresh GUIDs, catalog-sourced — RifleSquad {CE41AF625D05D0F1} is
// one digit off vanilla {CE41AF625D05D0F0}) parent the VANILLA Group_FIA_Base
// {242BC3C6BCE96EA5}; the shipped Group_FIA_Base.et is an override of the
// vanilla base (2 FIA rifleman slots — harmless). Registered via clean
// overrides of the vanilla FIA catalogs Groups_EntityCatalog_FIA.conf /
// WeaponTripod_EntityCatalog_FIA.conf (append-only; NB the author ships the
// two FIA arsenal-box entries with m_bEnabled 0 — disabled in the GM editor).
//
// GUID sources: characters = the mod's LoadoutManager_Editor.et override;
// groups = Groups_EntityCatalog_FIA.conf; arsenal = the author's
// E_CustomArsenalBox_FIA.et box list verbatim (no primaries in it). All
// characters concrete (VariantData-free) — safe for any spawn path.
//
// Dependency anchor: the mod itself (transitive-closure pattern). Its .gproj
// declares RHS + the SFS core-script addons directly.
const P_SFIA_C = "Prefabs/Characters/Factions/INDFOR/FIA";
const P_SFIA_G = "Prefabs/Groups/INDFOR";

export const SFSFIA = {
  id: "sfsfia",
  label: "FIA Special Force Squad (Abrashka)",
  workshopUrl: "https://reforger.armaplatform.com/workshop/6A066E84BB1DA751",
  dependencies: ["6A066E84BB1DA751"],
  factions: {
    SFS_FIA: {
      aliasOf: "FIA",
      label: "FIA Special Force Squad (Abrashka)",
      hvt: `{8379696C98AF9001}${P_SFIA_C}/Character_FIA_PL.et`,
      // Concrete SFS-FIA characters so patrols/QRF vehicles carry SF crews,
      // not the prefab-default vanilla FIA ones (universal patrolCrew rule)
      patrolCrew: [
        `{641AD7731E23454C}${P_SFIA_C}/Character_FIA_Crew.et`,
        `{11E0896C07A2338B}${P_SFIA_C}/Character_FIA_Rifleman.et`,
        `{7A3A5FCB407B6AA8}${P_SFIA_C}/Character_FIA_GL.et`,
        `{C77DFB8546B3F2A3}${P_SFIA_C}/Character_FIA_LAT.et`,
        `{F11A8F6843FFE69F}${P_SFIA_C}/Character_FIA_FTL.et`,
      ],
      // ONE pool (EnemyPanel hides the troops list for single-set factions).
      // Slot counts from m_aUnitPrefabSlots; classes per the project size rules.
      defaultGroupSet: "SFS",
      groupSets: {
        SFS: {
          label: "Special Force Squad",
          sentry: `{6E725D44CA973C25}${P_SFIA_G}/Group_FIA_SentryTeam.et`,
          defense: { ref: `{CE41AF625D05D0F1}${P_SFIA_G}/Group_FIA_RifleSquad.et`, size: 7 },
          small: [
            `{6E725D44CA973C25}${P_SFIA_G}/Group_FIA_SentryTeam.et`,
            `{2E9C920C3ACA2C70}${P_SFIA_G}/Group_FIA_ReconTeam.et`,
          ],
          medium: [
            `{5BEA04939D148B1E}${P_SFIA_G}/Group_FIA_FireTeam.et`,
            `{1BB20A4B3A53D0F6}${P_SFIA_G}/Group_FIA_LightFireTeam.et`,
            `{EE92725E9B949C3E}${P_SFIA_G}/Group_FIA_PlatoonHQ.et`,
          ],
          large: [`{CE41AF625D05D0F1}${P_SFIA_G}/Group_FIA_RifleSquad.et`],
        },
      },
      riflemen: {
        "Special Force Squad": `{11E0896C07A2338B}${P_SFIA_C}/Character_FIA_Rifleman.et`,
      },
      loadoutSets: {
        "Special Force Squad": [
          { name: "Rifleman", prefab: `{11E0896C07A2338B}${P_SFIA_C}/Character_FIA_Rifleman.et` },
          { name: "Grenadier", prefab: `{7A3A5FCB407B6AA8}${P_SFIA_C}/Character_FIA_GL.et` },
          { name: "Machine Gunner", prefab: `{25F8FFF0D9831761}${P_SFIA_C}/Character_FIA_MG.et` },
          { name: "Anti-tank", prefab: `{AF47482BCE451DDE}${P_SFIA_C}/Character_FIA_AT.et` },
          { name: "Light Anti-tank", prefab: `{C77DFB8546B3F2A3}${P_SFIA_C}/Character_FIA_LAT.et` },
          { name: "Medic", prefab: `{E11E955F2771D774}${P_SFIA_C}/Character_FIA_Medic.et` },
          { name: "Sapper", prefab: `{066644E57BA1E26F}${P_SFIA_C}/Character_FIA_Sapper.et` },
          { name: "FTL", prefab: `{F11A8F6843FFE69F}${P_SFIA_C}/Character_FIA_FTL.et` },
          { name: "SL", prefab: `{1A67D0F58548A191}${P_SFIA_C}/Character_FIA_SL.et` },
          { name: "PL", prefab: `{8379696C98AF9001}${P_SFIA_C}/Character_FIA_PL.et` },
          { name: "Sniper", prefab: `{68EBDC844C8EAD84}${P_SFIA_C}/Character_FIA_Sniper.et` },
          { name: "Crew", prefab: `{641AD7731E23454C}${P_SFIA_C}/Character_FIA_Crew.et` },
          { name: "Pilot", prefab: `{A7920B9B1E123B66}${P_SFIA_C}/Character_FIA_Pilot.et` },
        ],
      },
      // The author's E_CustomArsenalBox_FIA.et list verbatim (contains no
      // primary weapons — nothing to drop)
      arsenalItems: [
        { mode: "WEAPON", ref: "{3F38EE51E904AE5B}Prefabs/Weapons/Launchers/RPOA/Launcher_RPOA.et" },
        { mode: "WEAPON", ref: "{D107989BCA4445D7}Prefabs/Weapons/Launchers/RPOA/Launcher_RPOD.et" },
        { mode: "WEAPON", ref: "{327103CB218E7CA1}Prefabs/Weapons/Flares/Flare_RSP30_white.et" },
        { mode: "AMMUNITION", ref: "{1B8AD6E8D6A6E9ED}Prefabs/Weapons/Magazines/AK103_magazine/Magazine_762x39_plastic_AK_30rnd_57BZ231.et" },
        { mode: "AMMUNITION", ref: "{446CD9EBCB531303}Prefabs/Weapons/Magazines/aps_magazine/Magazine_9x18_APS_20rnd_7N25.et" },
        { mode: "AMMUNITION", ref: "{1F9F751F318EBEB0}Prefabs/Weapons/Magazines/Magazine_762x54_SVD_10rnd_7N14.et" },
        { mode: "AMMUNITION", ref: "{E5E9C5897CF47F44}Prefabs/Weapons/Magazines/Box_762x54_PK_100rnd_4Ball_1Tracer.et" },
        { mode: "AMMUNITION", ref: "{FBBF84E3B447D822}Prefabs/Weapons/Ammo/RPG/RHS_AmmoRocket_PG7VL.et" },
        { mode: "AMMUNITION", ref: "{262F0D09C4130826}Prefabs/Weapons/Ammo/Ammo_Grenade_HE_VOG25.et" },
        { mode: "", ref: "{645C73791ECA1698}Prefabs/Weapons/Grenades/Grenade_RGD5.et" },
        { mode: "", ref: "{77EAE5E07DC4678A}Prefabs/Weapons/Grenades/Smoke_RDG2.et" },
        { mode: "", ref: "{97064F8597F2D7BF}Prefabs/Weapons/Explosives/DemoBlock_TSh400g/DemoBlock_TSh400g.et" },
        { mode: "", ref: "{90976DC90A223095}Prefabs/Items/Equipment/Detonators/BlastingMachine_KPM_3U1/BlastingMachine_KPM_3U1.et" },
        { mode: "CONSUMABLE", ref: "{C3F1FA1E2EC2B345}Prefabs/Items/Medicine/FieldDressing_01/FieldDressing_USSR_01.et" },
        { mode: "CONSUMABLE", ref: "{0D9A5DCF89AE7AA9}Prefabs/Items/Medicine/MorphineInjection_01/MorphineInjection_01.et" },
        { mode: "CONSUMABLE", ref: "{527D7C5D2E476BDC}Prefabs/Items/Medicine/SalineBag_01/SalineBag_USSR_01.et" },
        { mode: "CONSUMABLE", ref: "{80E75A71C29190DB}Prefabs/Items/Medicine/Tourniquet_01/Tourniquet_USSR_01.et" },
        { mode: "", ref: "{21EF98BFC1EB3793}Prefabs/Items/Equipment/Kits/MedicalKit_01/MedicalKit_01_USSR.et" },
        { mode: "", ref: "{AD8027AA74047D4B}Prefabs/Items/Equipment/Radios/Radio_R148_FIA_1CH.et" },
        { mode: "", ref: "{F3680EE9CB89F344}Prefabs/Items/Equipment/Radios/Radio_R148_FIA_2CH.et" },
        { mode: "", ref: "{07604971C6549B30}Prefabs/Items/Equipment/Radios/Radio_R148_FIA_3CH.et" },
        { mode: "", ref: "{983B57B8E95C1F52}Prefabs/Items/Equipment/Maps/Map_Paper_01/PaperMap_01_folded_FIA.et" },
        { mode: "", ref: "{C354CB40B3928AC0}Prefabs/Items/Equipment/Navigation/Orion/Orion_Map.et" },
        { mode: "", ref: "{7CEF68E2BC68CE71}Prefabs/Items/Equipment/Compass/Compass_Adrianov.et" },
        { mode: "", ref: "{575EA58E67448C2A}Prefabs/Items/Equipment/Flashlights/Flashlight_Soviet_01/Flashlight_Soviet_01.et" },
        { mode: "", ref: "{062E2F1D7F6739D6}Prefabs/Items/Equipment/Accessories/ETool_MPL50/ETool_MPL50_FreeRoamBuilding_Gadget.et" },
        { mode: "", ref: "{33B2DFDCD0EBA3DB}Prefabs/Items/Equipment/Kits/RepairKit_01/RepairKit_01_wrench.et" },
      ],
    },
  },
};
