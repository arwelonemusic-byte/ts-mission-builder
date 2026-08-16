# AI Groups

Re-verified against Reforger 1.8 (2026-08-16, `reference\ReforgerData`
`configs/EntityCatalog/*/Groups_EntityCatalog_*.conf` + per-prefab
`m_aUnitPrefabSlots` counts). All GUIDs/paths unchanged from the original
harvest. 1.8 resized several groups — the trailing number on each line is the
1.8 unit-slot count; size classes in catalogue.mjs now follow counts
(small = 2, medium = 3-5, large = 6+), matching BI's own GROUPSIZE_* labels.

1.8 delisted from the group catalogs (prefabs still ship on disk; excluded
per the catalog-driven rule):
- `{D807C7047E818488}Prefabs/Groups/BLUFOR/Group_US_SniperTeam.et` (2 slots)
- `{3A76D9342C76A1F5}Prefabs/Groups/OPFOR/Group_USSR_SearchGroup.et` (11 slots, no GROUPSIZE label)

Excluded as always: `*_Base`, `Transport`, `WithDriver`, `LessArmored`.

## USSR - USSR_army
{C8622D0595B48437}Prefabs/Groups/OPFOR/Group_USSR_AmmoTeam.et — 4
{8DE0C0830FE0C33D}Prefabs/Groups/OPFOR/Group_USSR_Base.et
{344B4B6F787CFB23}Prefabs/Groups/OPFOR/Group_USSR_EngineerTeam.et — 2
{30ED11AA4F0D41E5}Prefabs/Groups/OPFOR/Group_USSR_FireGroup.et — 4
{6F72F05752ED62A8}Prefabs/Groups/OPFOR/Group_USSR_FireGroup_Guard.et — 4
{0C9A82FEAB4794D7}Prefabs/Groups/OPFOR/Group_USSR_LessArmored.et
{657590C1EC9E27D3}Prefabs/Groups/OPFOR/Group_USSR_LightFireTeam.et — 4
{A2F75E45C66B1C0A}Prefabs/Groups/OPFOR/Group_USSR_MachineGunTeam.et — 2
{1A5F0D93609DA5DA}Prefabs/Groups/OPFOR/Group_USSR_ManeuverGroup.et — 2 (SR+LAT pair since 1.8)
{D815658156080328}Prefabs/Groups/OPFOR/Group_USSR_MedicalSection.et — 2
{0D10CCEEC7B3EC34}Prefabs/Groups/OPFOR/Group_USSR_PlatoonHQ.et — 5
{E552DABF3636C2AD}Prefabs/Groups/OPFOR/Group_USSR_RifleSquad.et — 6
{BB2E6C2CC2755E9B}Prefabs/Groups/OPFOR/Group_USSR_SapperTeam.et — 2
{CB58D90EA14430AD}Prefabs/Groups/OPFOR/Group_USSR_SentryTeam.et — 2
{96BAB56E6558788E}Prefabs/Groups/OPFOR/Group_USSR_Team_AT.et — 4
{43C7A28EEB660FF8}Prefabs/Groups/OPFOR/Group_USSR_Team_GL.et — 4
{2E59ECDA9ED0B993}Prefabs/Groups/OPFOR/Group_USSR_Team_LAT.et — 4
{1C0502B5729E7231}Prefabs/Groups/OPFOR/Group_USSR_Team_Suppress.et — 4
{29DFCC25F263026B}Prefabs/Groups/OPFOR/Group_USSR_Transport.et — 2
{5BEB08E423F8CD0D}Prefabs/Groups/OPFOR/Group_USSR_WithDriver.et

## USSR - KLMK
{17F51B6521F7194A}Prefabs/Groups/OPFOR/KLMK/Group_USSR_AmmoTeam_KLMK.et — 4
{13A616F83A41C610}Prefabs/Groups/OPFOR/KLMK/Group_USSR_FireGroup_KLMK.et — 4
{5B08C42EA0661A20}Prefabs/Groups/OPFOR/KLMK/Group_USSR_LightFireTeam_KLMK.et — 4
{56DC5F9D2D6119F2}Prefabs/Groups/OPFOR/KLMK/Group_USSR_MachineGunTeam_KLMK.et — 2
{195CE45AF822820B}Prefabs/Groups/OPFOR/KLMK/Group_USSR_ManeuverGroup_KLMK.et — 2
{8E29E7581DE832CC}Prefabs/Groups/OPFOR/KLMK/Group_USSR_MedicalSection_KLMK.et — 2
{B69270E9F222F356}Prefabs/Groups/OPFOR/KLMK/Group_USSR_PlatoonHQ_KLMK.et — 5
{06F0C9675883F18A}Prefabs/Groups/OPFOR/KLMK/Group_USSR_ReconTeam.et — 2
{97D45056CFC22FF2}Prefabs/Groups/OPFOR/KLMK/Group_USSR_RifleSquad_KLMK.et — 6
{8EDE6E160E71ABB4}Prefabs/Groups/OPFOR/KLMK/Group_USSR_SapperTeam_KLMK.et — 2
{61E209AA5933AC95}Prefabs/Groups/OPFOR/KLMK/Group_USSR_SentryTeam_KLMK.et — 2
{129039549B0B82FF}Prefabs/Groups/OPFOR/KLMK/Group_USSR_Team_AT_KLMK.et — 4
{E382595E188AF8A1}Prefabs/Groups/OPFOR/KLMK/Group_USSR_Team_GL_KLMK.et — 4
{A286509C2F94005F}Prefabs/Groups/OPFOR/KLMK/Group_USSR_Team_LAT_KLMK.et — 4
{014B050050A8B5B5}Prefabs/Groups/OPFOR/KLMK/Group_USSR_Team_Suppress_KLMK.et — 4

## USSR - Naval_infantry
{AEC45E0050F58730}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_AmmoTeam_NI.et — 4
{26099EE31B5CC43A}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_FireGroup_NI.et — 4
{8E1B1AEBBB1AA155}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_LightFireTeam_NI.et — 4
{10E7872ECBF80AC5}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_MachineGunTeam_NI.et — 2
{D3117480BFB20776}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_ManeuverGroup_NI.et — 2
{6A05BCEA5B9B15E7}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_MedicalSection_NI.et — 2
{1BF443A793E269EB}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_PlatoonHQ_NI.et — 5
{250BBF11AA24076F}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_RifleSquad_NI.et — 6
{6AF3751BFA86836E}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_SapperTeam_NI.et — 2
{85384D373DB6EBBB}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_SentryTeam_NI.et — 2
{A665FE0F7C136660}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_Team_AT_NI.et — 4
{7318E9EFF22D1116}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_Team_GL_NI.et — 4
{CA4790822E4ECE29}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_Team_LAT_NI.et — 4
{1C6721180B16D6E5}Prefabs/Groups/OPFOR/Naval_Infantry/Group_USSR_Team_Suppress_NI.et — 4

## USSR - Spetsnaz
{4C44B4D8F2820F25}Prefabs/Groups/OPFOR/Spetsnaz/Group_USSR_Spetsnaz_SentryTeam.et — 2
{4D3BBEC1A955626A}Prefabs/Groups/OPFOR/Spetsnaz/Group_USSR_Spetsnaz_Squad.et — 6

## USSR - Spetsnaz suppressed
{666A2B0A6B1967AE}Prefabs/Groups/OPFOR/Spetsnaz/Suppressed/Group_USSR_Spetsnaz_ReconSquad.et — 6
{B721D5A8C1B556CE}Prefabs/Groups/OPFOR/Spetsnaz/Suppressed/Group_USSR_Spetsnaz_ReconTeam.et — 2

## US - US_army
{F72EF3429D8C8DF5}Prefabs/Groups/BLUFOR/Group_US_AmmoTeam.et — 4
{EACD97CF4A702FAE}Prefabs/Groups/BLUFOR/Group_US_Base.et
{6B2A6EE5002D200F}Prefabs/Groups/BLUFOR/Group_US_EngineerTeam.et — 2
{84E5BBAB25EA23E5}Prefabs/Groups/BLUFOR/Group_US_FireTeam.et — 4
{0A8E20F50DA233E1}Prefabs/Groups/BLUFOR/Group_US_FireTeam_Guard.et — 4
{FCF7F5DC4F83955C}Prefabs/Groups/BLUFOR/Group_US_LightFireTeam.et — 4
{958039B857396B7B}Prefabs/Groups/BLUFOR/Group_US_MachineGunTeam.et — 2
{EF62027CC75A7459}Prefabs/Groups/BLUFOR/Group_US_MedicalSection.et — 2
{B7AB5D3F8A7ADAE4}Prefabs/Groups/BLUFOR/Group_US_PlatoonHQ.et — 4
{F65B7BB712F46FEE}Prefabs/Groups/BLUFOR/Group_US_ReconTeam.et — 2
{DDF3799FA1387848}Prefabs/Groups/BLUFOR/Group_US_RifleSquad.et — 9
{9624D2B39397E148}Prefabs/Groups/BLUFOR/Group_US_SapperTeam.et — 2
{3BF36BDEEB33AEC9}Prefabs/Groups/BLUFOR/Group_US_SentryTeam.et — 2
{DE747BC9217D383C}Prefabs/Groups/BLUFOR/Group_US_Team_GL.et — 4
{FAEA8B9E1252F56E}Prefabs/Groups/BLUFOR/Group_US_Team_LAT.et — 4
{81B6DBF2B88545F5}Prefabs/Groups/BLUFOR/Group_US_Team_Suppress.et — 4
{727C134094032B1F}Prefabs/Groups/BLUFOR/Group_US_Transport.et — 2

## US - Green berets
{35681BE27C302FF5}Prefabs/Groups/BLUFOR/GreenBerets/Group_US_GreenBeret_SentryTeam.et — 2
{D0886786634E55AE}Prefabs/Groups/BLUFOR/GreenBerets/Group_US_GreenBeret_Squad.et — 6

## US - Green berets suppressed
{AC473DE5F4B24E82}Prefabs/Groups/BLUFOR/GreenBerets/Suppressed/Group_US_GreenBeret_ReconTeam.et — 2
{1F468430E5AB477E}Prefabs/Groups/BLUFOR/GreenBerets/Suppressed/Group_US_GreenBeret_ReconSquad.et — 6

## FIA
{C1E39427E43B1E79}Prefabs/Groups/INDFOR/Group_FIA_AmmoTeam.et — 4
{242BC3C6BCE96EA5}Prefabs/Groups/INDFOR/Group_FIA_Base.et
{5BEA04939D148B1D}Prefabs/Groups/INDFOR/Group_FIA_FireTeam.et — 5
{1BB20A4B3A53D0F5}Prefabs/Groups/INDFOR/Group_FIA_LightFireTeam.et — 4
{22F33D3EC8F281AB}Prefabs/Groups/INDFOR/Group_FIA_MachineGunTeam.et — 2
{581106FA58919E89}Prefabs/Groups/INDFOR/Group_FIA_MedicalSection.et — 2
{EE92725E9B949C3D}Prefabs/Groups/INDFOR/Group_FIA_PlatoonHQ.et — 3
{2E9C920C3ACA2C6F}Prefabs/Groups/INDFOR/Group_FIA_ReconTeam.et — 2
{CE41AF625D05D0F0}Prefabs/Groups/INDFOR/Group_FIA_RifleSquad.et — 7
{A0E9B5D6EA2072C4}Prefabs/Groups/INDFOR/Group_FIA_SapperTeam.et — 2
{6E725D44CA973C24}Prefabs/Groups/INDFOR/Group_FIA_SentryTeam.et — 2
{6307F42403E9B8A4}Prefabs/Groups/INDFOR/Group_FIA_SharpshooterTeam.et — 2
{2CC26054775FBA2C}Prefabs/Groups/INDFOR/Group_FIA_Team_AT.et — 4
{9328FE7DD0019E60}Prefabs/Groups/INDFOR/Group_FIA_Team_LAT.et — 4
