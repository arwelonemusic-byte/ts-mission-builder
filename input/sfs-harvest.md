# SFS US Loadout harvest (2026-08-02)

Mod: "SFS US Loadout" by abrashka — `SFSUSLoadout_69F2D31EB2E09C84`
(https://reforger.armaplatform.com/workshop/69F2D31EB2E09C84). Integrated as
the playable-only pseudo-faction **SFS_US** ("US Special Force Squad
(Abrashka)"), `generator/mods/sfs.mjs`, via the `aliasOf: "US"` machinery.
Extraction: `D:\VSCode_dev\arma-reforger\reference\SFS US Loadout` (23 files).

## Shape of the mod

- 12 character prefabs at the VANILLA `Prefabs/Characters/Factions/BLUFOR/US_Army/`
  paths but with their own resource GUIDs (Workbench-duplicate style — Crew is
  `{E1CB513B8B9B08F5}`, one digit off vanilla `{E1CB513B8B9B08F4}`). All are
  faction US, parent `Character_US_BaseLoadout.et` (vanilla), all concrete
  (`grep -c VariantData` = 0 on every one) — safe for any spawn path.
- `Prefabs/MP/Managers/Loadouts/LoadoutManager_Editor.et` override = the mod's
  Conflict integration AND our only GUID source (no `.meta`, no Configs/).
  Every character resource ref below is verbatim from it.
- A few gear prefabs (FILBE_Backpack_Heavy_Ext, custom helmets, ION shirt
  retexture) + `Worlds/test.ent`.

## Characters (all `Prefabs/Characters/Factions/BLUFOR/US_Army/Character_US_*.et`)

| Loadout (mod name) | File | GUID |
|---|---|---|
| Rifleman (unnamed entry) | Character_US_Rifleman | {F44F87222B67E26A} |
| GL | Character_US_GP | {06A2C5FD02D05F65} |
| AT | Character_US_AT | {270F46FC595C0CCF} |
| Medic | Character_US_Medic | {CDA1BFA445A6C6F5} |
| MG | Character_US_MG | {ADB0F1274E9A0670} |
| Sniper | Character_US_Sniper | {C0EE7CD6A89B123B} |
| SL | Character_US_SL | {922FDE221251B080} |
| FTL | Character_US_FTL | {DD8871B53B595AEC} |
| Pilot | Character_US_Pilot | {8B2D21607CC52AE7} |
| Crew | Character_US_Crew | {E1CB513B8B9B08F5} |
| Sapper | Character_US_Sapper | {E72229CB79558754} |
| Light AT | Character_US_LightAT | {526AEFB356C2F1BF} |

Weapons carried (context for the arsenal): GRS_Base_Shorty (M4A1, GRS) on
almost everyone; S&W "Spec Series" pistol (GRS Shadows pistol pack); Mk48 Tan
(MG); Rifle_M40A5_UPD (Sniper, ships in this mod); Launcher_MK153mod2 SMAW
(AT/LightAT); Launcher_M72A3 (LightAT); GM94 mags on the GL. Everyone carries
Rangefinder Vector21, Garmin watch, Milsim TUO-HH-163-HP radio, stun grenades,
ETool building gadget.

## Dependency chain

`.gproj` declares (note two empty "" slots — removed deps, harmless):
GRS-ShadowsPistolPack `66D45442A2D79E40`, GRS-Weapons `651433ECBC794018`,
MilsimRadioNetwork `656A504DB72C4723`, StunGrenade `59EAA899751805DF`,
FORTEX_ORSIS_T5000_TO_US `69B751D64B2A1456`, MK46AMPMK48-FIXED
`694633B6F415DF18`, 401ksRussianLeafSuits `69BA25A1449A76BF`.

**RHS (`595F2BF2F44836FB`) is NOT declared directly** — it arrives
transitively via GRS-Weapons. Full transitive closure (22 addons, all junctioned
into the Workbench addons dir 2026-08-02): the 7 above + GRS-ShadowsCore,
GRS-DevFramework, BaconSuppressors, M17Pistol, M249ScopeRails,
RISLaserAttachments, MK46-MK48, FORTEXORSIST-5000, TacticalDataLink,
10RRSaveRadio, 506thIRRU-EnhancedRadio, RHS ×3 packs. Our generated missions
anchor on `69F2D31EB2E09C84` alone.

## Known dep-mod log noise (NOT ours)

GRS-DevFramework logs "Wrong GUID/name … Configs/GRS_Tops.conf (and the other
locker configs) / Failed to open" — its locker framework references an optional
GRS gear addon that isn't in the chain. Pre-existing in the published mod;
judge generated missions only by errors referencing our resources
(TS_WebSpikeSFS validated clean 2026-08-02, world load 233 ms).
