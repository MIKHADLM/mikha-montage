# sfx

> **Rôle :** regroupe les bruitages disponibles pour les vidéos. **Lecteurs :** les agents (pour choisir les fichiers) et l'humain (pour les déposer).

## Fichiers présents (mesurés le 2026-09-29)

| Fichier | Nature | Durée | Format | Loudness intégrée | Pic (true peak) |
|---|---|---|---|---|---|
| `sfx_whoosh_cinematic_v01.mp3` | Whoosh cinématique | 3,0 s | MP3 44,1 kHz stéréo | -8,2 LUFS | **+2,8 dBTP** |
| `sfx_whoosh_large-sub_v01.mp3` | Whoosh long avec grave | 8,0 s | MP3 48 kHz stéréo | -12,0 LUFS | 0,0 dBTP |
| `sfx_riser_riser_v01.mp3` | Montée (riser) | 5,3 s | MP3 44,1 kHz stéréo | -31,9 LUFS | -15,1 dBTP |
| `sfx_clic_click_v01.wav` | Clic | 0,46 s | WAV 44,1 kHz stéréo | -22,3 LUFS | -1,3 dBTP |
| `sfx_declencheur_shutter-click_v01.mp3` | Déclencheur d'appareil photo | 0,96 s | MP3 48 kHz stéréo | -23,5 LUFS | -5,1 dBTP |
| `sfx_caisse_cash-machine_v01.mp3` | Caisse enregistreuse | 1,9 s | MP3 44,1 kHz stéréo | -14,6 LUFS | **+0,6 dBTP** |

- Les fichiers sont **de niveaux très différents** : régler le gain de chacun dans le mix, ne pas les poser à volume égal.
- `whoosh_cinematic` et `cash-machine` dépassent 0 dBTP : les **atténuer** avant de les placer dans le mix, sinon ils saturent.
- `riser` contient une image de pochette intégrée : sans effet sur l'audio.
- **Licences :** sons libres de droits, licences détenues par Michaël (confirmé le 2026-09-29). Utilisation sans restriction supplémentaire.

## Usages validés (VF de Michaël, confirmés le 2026-09-30)

| Fichier | Usage | Début du son dans le fichier |
|---|---|---|
| `sfx_riser_riser_v01.mp3` | Hook en début de vidéo ; la fin du son tombe avec la fin de la phrase d'accroche | Montée progressive |
| `sfx_clic_click_v01.wav` | ≈ 0,1 s avant la sortie de chaque séquence sur fond blanc, et avant l'entrée d'une séquence qui ne commence pas par une photo | 0,08 s |
| `sfx_declencheur_shutter-click_v01.mp3` | ≈ 0,15 s avant chaque photo qui apparaît ; arrivée du téléphone (asset site mobile) | 0,23 s |
| Les 3 autres (whoosh ×2, caisse) | Pas utilisés dans la VF : à définir, ne pas les utiliser d'ici là | : |

Dans la VF, ces bruitages sont posés **sans gain**, au niveau de leur fichier.

Détail : `04_son/SON.md`, section 3.

## Ce qu'on y dépose

Bruitages (whoosh, clic, impact, etc.) validés. Usage prévu de chacun : voir `04_son/SON.md`, section 3.

## Format attendu

WAV de préférence (sans perte) ; MP3 accepté pour l'instant. Durée maximale : `[À COMPLÉTER]`

## Convention de nommage

`sfx_[type]_[nom]_vNN.ext`. Exemple : `sfx_whoosh_cinematic_v01.mp3`

Convention commune : voir `06_assets/README.md`.
