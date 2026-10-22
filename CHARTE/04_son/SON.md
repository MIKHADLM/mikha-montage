# SON : musique, niveaux, bruitages, voix

> **Rôle :** règles audio des vidéos mikha_dlm. **Lecteurs :** les agents (mixage HyperFrames / Remotion) et l'humain pour compléter.

Toute valeur `[À COMPLÉTER : ...]` est inconnue : ne pas l'inventer.

**Mise à jour du 2026-09-30** d'après la VF de Michaël (`08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4`), confirmée par Michaël : sa façon de faire devient la règle. `(mesuré sur la VF)` = relevé sur cette vidéo ou dans sa timeline DaVinci.

## 1. Musique

**Les musiques sont fournies par Michaël avec chaque vidéo à monter.** Les agents ne choisissent, ne téléchargent et ne génèrent aucune musique de leur propre initiative : ils utilisent la piste fournie avec le brief.

| Élément | Valeur |
|---|---|
| Source | Fournie par Michaël avec le rush (chemin indiqué dans le brief) |
| Genre, tempo, ambiance | Définis par la piste fournie |
| Licence / droits | Pistes fournies par Michaël, qui en détient les droits `[À COMPLÉTER : confirmer pour les musiques]` |
| Piste absente du brief | L'agent le signale et ne monte pas de musique |
| Point de départ dans la piste | Indiqué par Michaël avec la piste (ex. « à partir de 1:16 ») |
| Début dans la vidéo | **Juste après le hook** : pas de musique pendant le riser (confirmé le 2026-09-29, appliqué dans la VF) |
| Fin | **Jusqu'à la dernière image, arrêt net**, sans fondu (VF) |
| Voix et paroles dans la musique | `[À COMPLÉTER : sous la voix off, autorisées ou non]` |
| Sons tendance des plateformes | `[À COMPLÉTER : autorisés ou non]` |
| Dossier de stockage éventuel des pistes réutilisées | `06_assets/musique/` |

## 2. Niveaux

| Élément | Valeur |
|---|---|
| Voix (loudness intégrée) | **-14 LUFS** (export face cam de l'agent, -14,2 LUFS mesuré, gardé sans changement dans la VF) |
| Musique sous la voix | **≈ 8,5 dB sous la voix**, soit ≈ -22,7 LUFS (VF : gain de -8,8 dB sur un extrait à -13,9 LUFS) ; niveau constant du début à la fin |
| Loudness intégrée du mix final | -13,6 LUFS (mesuré sur la VF) |
| Pic maximal (true peak) | **-1 dBTP** (confirmé le 2026-09-30). La VF montait à +0,6 dBTP |
| Ducking de la musique | Aucun (VF) |
| Fondu d'entrée / de sortie de la musique | Aucun (VF) |

## 3. Bruitages

Bruitages disponibles dans `06_assets/sfx/` (mesures : voir le README de ce dossier). Ils sont libres de droits ; Michaël détient les licences (confirmé le 2026-09-29). Dans la VF, ils sont posés **sans gain**, au niveau de leur fichier.

| Fichier | Nature | Quand l'utiliser (VF) | Niveau dans le mix |
|---|---|---|---|
| `sfx_riser_riser_v01.mp3` | Montée (riser), 5,3 s | Pendant le **hook** : la fin du son tombe avec la fin de la phrase d'accroche (on garde la fin du fichier, 2,4 s dans la VF) | Fichier sans gain |
| `sfx_clic_click_v01.wav` | Clic | ≈ 0,1 s avant la **sortie de chaque séquence sur fond blanc**, et avant l'**entrée** d'une séquence qui ne commence pas par une photo (séquence partenaire) | Fichier sans gain |
| `sfx_declencheur_shutter-click_v01.mp3` | Déclencheur d'appareil photo | ≈ 0,15 s avant **chaque photo** qui apparaît, et à l'arrivée du téléphone (son inclus dans l'asset site mobile) | Fichier sans gain ; **-6 dB dans un défilé** de photos (`03_motion/MOTION.md`, section 2), pour que la rafale de flashs ne domine pas (confirmé par Michaël le 2026-10-01, vidéo 2) |
| `sfx_whoosh_cinematic_v01.mp3` | Whoosh cinématique | Pas utilisé dans la VF : à définir | à définir |
| `sfx_whoosh_large-sub_v01.mp3` | Whoosh long avec grave | Pas utilisé dans la VF : à définir | à définir |
| `sfx_caisse_cash-machine_v01.mp3` | Caisse enregistreuse | Pas utilisé dans la VF : à définir | à définir |

Précisions d'exécution :

- **Moment du son, pas du fichier :** le clic commence 0,08 s après le début de son fichier, le déclencheur 0,23 s après (mesuré). Placer le fichier pour que le **son** tombe au moment voulu.
- **Riser :** départ dans le fichier = durée du fichier (5,33 s) − durée du hook ; la fin du riser reste calée sur la fin de la phrase.
- **Whoosh et caisse :** ne pas les utiliser tant que leur usage n'est pas défini.
- **Bruitages à ajouter :** `[À COMPLÉTER : autres sons prévus]`

## 4. Voix

| Élément | Valeur |
|---|---|
| Voix utilisée | Voix réelle de Michaël, prise avec le face cam |
| Voix de synthèse autorisée | `[À COMPLÉTER : oui / non, laquelle]` |
| Traitement (débruitage, compression, EQ) | Aucun dans la VF en dehors du réglage à -14 LUFS `[À COMPLÉTER : confirmer]` |
| Rythme de parole souhaité | `[À COMPLÉTER]` |
| Langue(s) | `[À COMPLÉTER]` |
| Traitement des silences et hésitations | Tous coupés, reprises et faux départs retirés (voir `MOTION.md`) |
