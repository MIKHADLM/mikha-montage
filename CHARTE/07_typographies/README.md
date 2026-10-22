# 07_typographies : polices de la marque

> **Rôle :** accueille les polices retenues et explique comment les ranger. **Lecteurs :** l'humain (pour déposer) et les agents (pour charger les polices).

Les agents **ne téléchargent, ne créent et ne substituent aucune police**. Si une police manque, ils le signalent.

## Polices en usage (depuis le 2026-09-30)

**Une seule famille : Gilroy**, en trois graisses (direction artistique de la VF de Michaël, confirmée le 2026-09-30).

| Fichier | Rôle | Couleur |
|---|---|---|
| `Gilroy/Gilroy-Heavy.ttf` | Titres, dont le titre d'accroche (hook) ; texte de la barre de recherche | Sur le face cam : blanc, jaune `#FFB900` (jaune pâle abandonné le 2026-10-01) ; noir sur fond blanc |
| `Gilroy/Gilroy-ExtraBold.ttf` | Sous-titres (confirmé le 2026-09-30) ; nom dans une étiquette (« BOXY TEE ») | Sous-titres : blanc sur le face cam, noir sur fond blanc ; étiquette : noir |
| `Gilroy/Gilroy-MediumItalic.ttf` | Précision dans une étiquette (« MEHOMIES », « Visual artist ») | Noir sur fond blanc |

Tailles et règles : `02_design/DESIGN.md` (section 2) et `03_motion/SOUS-TITRES.md`.

Les trois fichiers contiennent les caractères du français (accents, `œ`, `’`, `€`, guillemets) et les chiffres : testé le 2026-09-30.

## Police abandonnée

| Fichier | Statut |
|---|---|
| `PermanentMarker/PermanentMarker-Regular.ttf` | **Abandonnée le 2026-09-30.** Gardée seulement pour que les anciens montages (vidéo 1, v01 et v02) puissent être refaits. Ne plus l'utiliser. |

## Licences

| Police | Statut |
|---|---|
| Gilroy Heavy | Licence détenue par Michaël (déclaré le 2026-09-29 ; Copyright Radomir Tinkov) |
| Gilroy ExtraBold | Licence détenue par Michaël (confirmé le 2026-09-30) |
| Gilroy Medium Italic | Licence détenue par Michaël (confirmé le 2026-09-30) |
| Permanent Marker | Apache License 2.0 (indiquée dans le fichier) ; abandonnée |

Toute **nouvelle** police déposée ici doit être accompagnée de sa licence.

## Structure

Un sous-dossier par famille :

```
07_typographies/
├── Gilroy/
│   ├── Gilroy-Heavy.ttf
│   ├── Gilroy-ExtraBold.ttf
│   └── Gilroy-MediumItalic.ttf
└── PermanentMarker/            (abandonnée)
    └── PermanentMarker-Regular.ttf
```

- Nom du sous-dossier : nom de la famille sans espace.
- Nom de fichier : `[Famille]-[Graisse][Italique].ext`.
- Formats acceptés : `.ttf`, `.otf`, `.woff2`.

## Rôles à attribuer

| Rôle | Police | Statut |
|---|---|---|
| Titres | Gilroy Heavy | attribué |
| Sous-titres | Gilroy ExtraBold | attribué (confirmé le 2026-09-30) |
| Étiquette : nom | Gilroy ExtraBold | attribué (VF) |
| Étiquette : précision | Gilroy Medium Italic | attribué (VF) |
| Texte courant | `[À COMPLÉTER]` | à attribuer |
| Chiffres | Police du texte qui les porte | attribué (VF) |

Une fois un rôle changé : le reporter dans `02_design/DESIGN.md` (section 2), `02_design/tokens.json` et `03_motion/SOUS-TITRES.md`.
