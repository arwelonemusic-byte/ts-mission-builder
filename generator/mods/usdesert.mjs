// US Desert Camo — "US to Desert Camo" (69E376017D21C27D), v1.0.7 harvested 2026-09-05.
//
// NOT a faction and NOT a loadout pack: a pure MATERIAL reskin. The addon
// ships 28 .emat overrides at the vanilla US clothing paths (BDU M81/M65
// jacket + pants incl. rolled-up/tucked/item variants, tiger stripe, jungle
// boots, boonie + patrol hats, PASGT helmet cover/scrim, pilot + tanker
// suits) and 7 desert textures (DBDU/DCU patterns, desert helmet/hat covers,
// nomex). No prefabs, no configs, no scripts, no catalogs
// (D:\VSCode_dev\arma-reforger\reference\US to Desert Camo) — every vanilla
// US character (and any mod character reusing those materials) turns desert
// as soon as the addon is loaded.
//
// Integration = the alias route (SFS pattern): US_DESERT is a UI-level
// faction entry over vanilla US. The catalogue merge copies the whole US
// entry underneath (US Army / Green Berets subfactions, loadouts, arsenal,
// spawn point, callsigns, vehicles, patrol crews — all the right prefabs,
// since the reskin is global), lib.mjs serializes every faction key as "US"
// and pulls the addon GUID as a usage-derived dependency. playableOnly: the
// enemy side has no desert-specific content and US-vs-US is impossible
// anyway (same in-game faction). defaultWhenEnabled: ticking the mod while
// the players are vanilla US switches them to this entry (page.tsx setMods)
// — the mission maker enabling a camo pack wants their players in it.
export const USDESERT = {
  id: "usdesert",
  label: "US Desert Camo",
  workshopUrl: "https://reforger.armaplatform.com/workshop/69E376017D21C27D",
  dependencies: ["69E376017D21C27D"],
  factions: {
    US_DESERT: {
      aliasOf: "US",
      label: "US Desert Camo",
      playableOnly: true,
      defaultWhenEnabled: true,
    },
  },
};
