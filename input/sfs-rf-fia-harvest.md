# SFS RF + SFS FIA Loadout harvest (2026-08-09)

Mods by abrashka, same concept as the SFS US pack (`input/sfs-harvest.md`):
- "SFS RF Loadout" — `SFSRFLoadout_69F72741A0C9B270` → **SFS_USSR** (`generator/mods/sfsrf.mjs`, `aliasOf: "USSR"`)
- "SFS FIA Loadout" — `SFSFIALoadout_6A066E84BB1DA751` → **SFS_FIA** (`generator/mods/sfsfia.mjs`, `aliasOf: "FIA"`)

Extractions: `D:\VSCode_dev\arma-reforger\reference\SFS RF Loadout` (38 files),
`...\SFS FIA Loadout` (33 files). Both playable AND enemy-capable from day one
(characters + groups + author-curated arsenal boxes shipped together).

## Shape (both mods)

- Characters at the vanilla faction folders with own resource GUIDs; RF names
  them `Character_RF_*` (new filenames), FIA reuses/extends vanilla
  `Character_FIA_*` names (Workbench-duplicate GUIDs: Crew {641AD7731E23454C}
  vs vanilla {...4B}, LAT {C77DFB8546B3F2A3} vs {...A2}, Sapper
  {066644E57BA1E26F} vs {...6E}). ALL concrete — `grep -c VariantData` = 0 on
  every character in both mods; weapons inline. GUID source = each mod's
  `Prefabs/MP/Managers/Loadouts/LoadoutManager_Editor.et` override (13
  loadouts each: unnamed Rifleman + 12 named).
- Group prefabs parent the VANILLA bases (USSR base {8DE0C0830FE0C33D}, FIA
  base {242BC3C6BCE96EA5}); the shipped `Group_USSR_Base.et` /
  `Group_FIA_Base.et` are therefore overrides of the vanilla base prefabs
  (RF base carries 6 RF slots, FIA base 2 — harmless, vanilla concrete groups
  define their own slots and the bases are in no catalog).
- Group GUID source = the mods' clean overrides of the vanilla
  `Groups_EntityCatalog_<FACTION>.conf` (append-only, fresh member GUIDs,
  `m_eSlotTypes 7`). WeaponTripod catalogs register the arsenal boxes
  (FIA's two entries ship `m_bEnabled 0` — GM-disabled by the author).

## RF groups (`Prefabs/Groups/OPFOR`)

| Group (editor name) | File | GUID | Slots |
|---|---|---|---|
| Rifle Suad Custom (sic) | Group_USSR_RifleSquad | {6B6B2B2836D6DC79} | 7: FTL, 2×Rifleman, MG, GL, Medic, AT |
| FireTeam Custom | Group_USSR_FireGroup | {30ED11AA4F0D41E6} | 4: FTL, Rifleman, MG, LAT |
| FireTeamLight Custom | Group_USSR_LightFireTeam | {475563F8643503F9} | 4: FTL, 2×Rifleman, GL |
| SentryTeam Custom | Group_USSR_SentryTeam | {CB58D90EA14430AE} | 2: 2×Rifleman |

Catalog quirks: SentryTeam is listed TWICE (author slip);
`Group_USSR_SearchGroup.et` (11 slots, parents the VANILLA RifleSquad
{E552DABF3636C2AD}) ships on disk but is NOT in the catalog → no harvestable
GUID → excluded (same as MEI's stray teams).

## FIA groups (`Prefabs/Groups/INDFOR`)

| Group (editor name) | File | GUID | Slots |
|---|---|---|---|
| Rifle Squad Custom | Group_FIA_RifleSquad | {CE41AF625D05D0F1} | 7: FTL, 2×GL, LAT, MG, 2×Rifleman |
| FireTeam Custom | Group_FIA_FireTeam | {5BEA04939D148B1E} | 5: FTL, GL, LAT, 2×Rifleman |
| FireTeamLight Custom | Group_FIA_LightFireTeam | {1BB20A4B3A53D0F6} | 4: 4×Rifleman |
| PlatoonHQ Custom | Group_FIA_PlatoonHQ | {EE92725E9B949C3E} | 3: PL, GL, Medic |
| ReconTeam Custom | Group_FIA_ReconTeam | {2E9C920C3ACA2C70} | 2: GL, Rifleman |
| SentryTeam Custom | Group_FIA_SentryTeam | {6E725D44CA973C25} | 2: 2×Rifleman |

## Characters

RF (`Prefabs/Characters/Factions/OPFOR/USSR_Army/Character_RF_*.et`):
Rifleman {814572381FE980FD}, GL {542B89549473DA14}, MG {0BE9296F0D8BA7DD},
AT {81569EB41A4DAD62}, LAT {4465FCB62ED31D3B}, Medic {1106DD26506B4B87},
Sapper {989653474741CABD}, FTL {7202885B2B9F0906}, SL {3476066A5140112D},
PL {AD68BFF34CA720BD}, Sniper {F61BCB26706E8557}, Crew {4DF623E7F9C0F333},
Pilot {578A43E26908A795}. (RF also overrides vanilla `Character_USSR_Base.et`.)

FIA (`Prefabs/Characters/Factions/INDFOR/FIA/Character_FIA_*.et`):
Rifleman {11E0896C07A2338B}, GL {7A3A5FCB407B6AA8}, MG {25F8FFF0D9831761},
AT {AF47482BCE451DDE}, LAT {C77DFB8546B3F2A3}, Medic {E11E955F2771D774},
Sapper {066644E57BA1E26F}, FTL {F11A8F6843FFE69F}, SL {1A67D0F58548A191},
PL {8379696C98AF9001}, Sniper {68EBDC844C8EAD84}, Crew {641AD7731E23454C},
Pilot {A7920B9B1E123B66}.

Unlike the US pack, both PLs ARE harvestable → `hvt` = PL for both.

## Arsenal

Source = the author's arsenal-box prefabs (SCR_ArsenalComponent
`m_OverwriteArsenalConfig` item lists; the author separately sent
`E_CustomArsenalSFS.et`, byte-identical to the RF mod's shipped copy):
- RF: `PrefabsEditable/.../E_CustomArsenalSFS.et` (34 entries) — taken
  verbatim minus a duplicate FILBE_Backpack_Heavy_BIG and minus
  `MG_PKM_B51_SOF {244CEE7882EE68F5}` (primary MG — standing no-primaries
  arsenal rule; its PK/PKP-B ammo boxes stay).
- FIA: `PrefabsEditable/.../E_CustomArsenalBox_FIA.et` (27 entries) — taken
  verbatim, contains no primaries.

The RF box also carries `SFS_LoadoutBoxComponent` / `SFS_SaveLoadoutAction` /
`SFS_OpenLoadoutMenuAction` — script classes from the SFSLoadoutBOX dep addon
(the author's own loadout-crate system; we don't use it, our conf-based
crate covers loadouts).

## Dependency chains

Anchors = the mods themselves (transitive-closure pattern, validated for SFS US).
- RF .gproj declares: WCS_Armbands `61E42AE6714A3CC2`, StunGrenade
  `59EAA899751805DF`, RHS `595F2BF2F44836FB`, PKP-B `6447378A6C7CB747`
  (MUFFISBEST), FORTEXORSIST-5000 `66D92EE8EB81518C`, RHSWeaponExtensions
  `66AC2E9049E2F8EF`, 401ksRussianLeafSuits `69BA25A1449A76BF`, SFSLoadoutBOX
  `6A093796BD836C6A`, Wirecutters2 `62F364B35E9B51B0`, RISLaserAttachments
  `5ABD0CB57F7E9EB1` (+ empty "" slots — removed deps, harmless).
- FIA .gproj declares: RHS, SFSLoadoutBOX, Wirecutters2.

Full transitive closure = 13 addons (incl. RHS ContentPacks 01/02), all
junctioned into the Workbench addons dir 2026-08-09 (7 new junctions:
the two mods + WCS_Armbands, PKP-B, RHSWeaponExtensions, SFSLoadoutBOX,
Wirecutters2).
