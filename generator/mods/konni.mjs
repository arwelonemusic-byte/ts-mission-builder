// Konni Group (7DAFEF0126B180E0, v1.0.4, game 1.9.0.37, harvested 2026-11-20)
// — a Russian PMC that REPLACES the vanilla Soviet faction in place: the
// faction key stays "USSR". Clean overrides with the vanilla GUIDs of
// Configs/Factions/USSR.conf {09727032415AC39B} (name "Konni Group", flag,
// home territory), the USSR character + group EntityCatalogs (vanilla entries
// disabled, Konni entries added), EditableEntityCore.conf, the USSR arsenal
// boxes and 22 vanilla Soviet vehicles (UAZ-469 ×3, UAZ-452 ×3, Ural-4320 ×8,
// BRDM-2 + BTR-70 incl. Conflict variants, Mi-8MT ×4: Konni markings + Konni
// default occupants). Its own soldiers/groups live under Prefabs/Characters/
// KON/<Subfaction>/ and Prefabs/Groups/KON/ with their own GUIDs — vanilla
// USSR group/character prefabs are NOT touched, so the Builder references
// Konni's groups directly.
//
// Integration = `aliasOf: "USSR"` (SFS RF pattern), ENEMY-ONLY (`riflemen: {}`
// — the author ships no player loadouts or arsenal): entryGuid / callsigns /
// vehicles / fortifications are inherited from vanilla USSR; with the mod
// loaded those vanilla vehicles come Konni-marked and Konni-crewed for free.
// Same-in-game-faction pairings (USSR / SFS_USSR players) are blocked by the
// existing aliasConflict guard; RHS_AFRF players get the usual USSR
// friendliness clearing.
//
// Five subfactions = five group sets. Every group below is cataloged in the
// mod's Groups_EntityCatalog_USSR.conf override (GUIDs = catalog = rdb).
// Size classes follow the project count rule (2 = small, 3-5 = medium,
// 6+ = large). EXCLUDED by curation: crews and specialists that need equipment
// the mission does not place or that only carry/heal (KON FireSupport = AGL/HMG
// crews, UAVCell, CasEvac stretcher bearers, MedEvac medics, HeliCrew,
// PilotPair, Command = officer pair; every VehicleCrew) and the five
// AmbientPatrols/*_NotSpawned ambient shells.
//
// Characters: role base + concrete _A/_B/_C variants, all armed, VariantData-
// free, chain → Character_KON_Base → vanilla Character_USSR_Base (Russian
// voices, faction USSR). Each subfaction ships an "Officer" HVT role; the
// registry's single hvt = the Elite Group Officer.
//
// Dependency anchor: the mod itself (transitive closure: RHS Status Quo + both
// content packs, nine WCS 9.0 infantry packs, Bandit Gear → Zelik's Character).
// Full harvest: input/konni-harvest.md.
const P_KON_C = "Prefabs/Characters/KON";
const P_KON_G = "Prefabs/Groups/KON";

export const KONNI = {
  id: "konni",
  label: "Konni Group (Russian PMC)",
  workshopUrl: "https://reforger.armaplatform.com/workshop/7DAFEF0126B180E0",
  dependencies: ["7DAFEF0126B180E0"],
  factions: {
    KONNI: {
      aliasOf: "USSR",
      label: "Konni Group (Russian PMC)",
      hvt: `{4B419A80253B5E35}${P_KON_C}/Elite/Character_KON_ELT_HVT_A.et`,
      // Concrete vehicle crewmen (universal patrolCrew rule — lib.mjs always
      // emits m_aCrewPrefabPool)
      patrolCrew: [
        `{3B1B88E5ED7A45AE}${P_KON_C}/K07/Character_KON_K07_Crew_A.et`,
        `{574FBC0551BECA80}${P_KON_C}/K07/Character_KON_K07_Crew_B.et`,
        `{2DEE9CAFD46CB6D3}${P_KON_C}/Konni/Character_KON_KON_Crew_A.et`,
        `{41BAA84F68A839FD}${P_KON_C}/Konni/Character_KON_KON_Crew_B.et`,
        `{A426E4B6644DAE96}${P_KON_C}/Konni/Character_KON_KON_Crew_C.et`,
      ],
      // Enemy-only: no player content
      riflemen: {},
      loadoutSets: {},
      arsenalItems: [],
      defaultGroupSet: "KON",
      groupSets: {
        KON: {
          label: "Konni (assault detachments)",
          sentry: `{BAD4832000BCA1C8}${P_KON_G}/Group_KON_KON_LightTroika.et`,
          defense: { ref: `{258C70E45EA48741}${P_KON_G}/Group_KON_KON_AssaultGroup.et`, size: 8 },
          small: [`{36FA0219F31C9AF8}${P_KON_G}/Group_KON_KON_SniperPair.et`],
          medium: [
            `{BAD4832000BCA1C8}${P_KON_G}/Group_KON_KON_LightTroika.et`,
            `{B406727974C50A8F}${P_KON_G}/Group_KON_KON_HeavyTroika_MG.et`,
            `{3EB9C5A263030030}${P_KON_G}/Group_KON_KON_HeavyTroika_AT.et`,
            `{35C20D6A7A5AF631}${P_KON_G}/Group_KON_KON_ProbeTeam.et`,
            `{23F49186B55CA9EE}${P_KON_G}/Group_KON_KON_SapperGroup.et`,
          ],
          large: [
            `{258C70E45EA48741}${P_KON_G}/Group_KON_KON_AssaultGroup.et`,
            `{C8D29E922C06ACB0}${P_KON_G}/Group_KON_KON_AssaultGroup_Night.et`,
            `{306A7307ADBAC0EF}${P_KON_G}/Group_KON_KON_FixingPlatoon.et`,
            `{F86AA865BFB9C042}${P_KON_G}/Group_KON_KON_MobileRPG.et`,
            `{4DD155EC49219C04}${P_KON_G}/Group_KON_KON_ReconGroup.et`,
          ],
        },
        K07: {
          label: "Komanda 07 (contract security)",
          sentry: `{535CF418F007EF7D}${P_KON_G}/Group_KON_K07_Checkpoint.et`,
          defense: { ref: `{5782209F612F1276}${P_KON_G}/Group_KON_K07_Detail.et`, size: 6 },
          small: [`{535CF418F007EF7D}${P_KON_G}/Group_KON_K07_Checkpoint.et`],
          medium: [`{1B4BC5ABC495D2E0}${P_KON_G}/Group_KON_K07_Team.et`],
          large: [`{5782209F612F1276}${P_KON_G}/Group_KON_K07_Detail.et`],
        },
        K00: {
          label: "Komanda 00 (special forces)",
          sentry: `{2A571491805A11C5}${P_KON_G}/Group_KON_K00_Pair.et`,
          defense: { ref: `{8AA00E4ED1874B19}${P_KON_G}/Group_KON_K00_Element.et`, size: 6 },
          small: [`{2A571491805A11C5}${P_KON_G}/Group_KON_K00_Pair.et`],
          medium: [`{02828EFC542937E2}${P_KON_G}/Group_KON_K00_Team.et`],
          large: [`{8AA00E4ED1874B19}${P_KON_G}/Group_KON_K00_Element.et`],
        },
        ELT: {
          label: "PMC Elite Group",
          sentry: `{997F3332C0D72F8C}${P_KON_G}/Group_KON_ELT_SniperPair.et`,
          defense: { ref: `{2DAAB998450E64E7}${P_KON_G}/Group_KON_ELT_AssaultGroup.et`, size: 8 },
          small: [`{997F3332C0D72F8C}${P_KON_G}/Group_KON_ELT_SniperPair.et`],
          medium: [
            `{FF8713F6E56F252B}${P_KON_G}/Group_KON_ELT_Team.et`,
            `{E25464C77AEA2970}${P_KON_G}/Group_KON_ELT_ReconGroup.et`,
          ],
          large: [`{2DAAB998450E64E7}${P_KON_G}/Group_KON_ELT_AssaultGroup.et`],
        },
        BAR: {
          label: "Barkov's Forces (rogue army)",
          sentry: `{8CE018388AD99141}${P_KON_G}/Group_KON_BAR_MarksmanPair.et`,
          defense: { ref: `{17BAA18DC8E1A485}${P_KON_G}/Group_KON_BAR_RifleSquad.et`, size: 8 },
          small: [`{8CE018388AD99141}${P_KON_G}/Group_KON_BAR_MarksmanPair.et`],
          medium: [
            `{F194A15AA93E3E81}${P_KON_G}/Group_KON_BAR_FireTeam.et`,
            `{766AC09B124ECD84}${P_KON_G}/Group_KON_BAR_Spetsnaz.et`,
          ],
          large: [
            `{17BAA18DC8E1A485}${P_KON_G}/Group_KON_BAR_RifleSquad.et`,
            `{4AD7EC739CA812F9}${P_KON_G}/Group_KON_BAR_GasMaskSquad.et`,
          ],
        },
      },
    },
  },
};
