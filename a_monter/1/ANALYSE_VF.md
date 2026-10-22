# ANALYSE : le montage de Michaël (« VF by Mikha »)

> **Rôle :** ce que Michaël a fait dans son propre montage de la vidéo 1, pour en tirer la direction artistique à reproduire. **Lecteurs :** Michaël (pour valider) et les agents (avant de mettre à jour la charte ou de monter).

Sources analysées le 2026-09-29 :
- `export/VF by Mikha.mp4` : 1080×1920, 30 i/s, 1 133 images (37,77 s), H.264, BT.709, AAC 48 kHz 320 kb/s ;
- `export/reels.drt` : la timeline « reels » exportée de DaVinci Resolve Studio 21.1.

Les valeurs lues dans la timeline sont exactes (clips, textes, polices, couleurs, zooms, gains). Les valeurs marquées *(mesuré)* sont relevées sur les images de la vidéo, à ± 2 px.

## 1. Déroulé

| Images | Secondes | Parole | À l'écran | Son |
|---|---|---|---|---|
| 0 → 71 | 0 → 2,37 | « C'est la dernière chance pour toi de commander ton t-shirt Mehomies » | Face cam zoomé × 1,21 + titre en 3 lignes : DERNIÈRE CHANCE / POUR COMMANDER / TON TEE | Riser |
| 71 → 227 | 2,37 → 7,57 | « Ça va faire maintenant un mois… passer à la production » | Face cam, zoom progressif × 1 → × 1,2 | La musique démarre |
| 227 → 335 | 7,57 → 11,17 | « Avec BAG, on tenait à vous remercier pour votre soutien général autour de ce projet » | **Fond blanc** : vidéo « Version FR EN » (16:9) en haut, logo BAG et « BAGCVL / Visual artist » dessous | Clic à l'entrée et à la sortie |
| 335 → 437 | 11,17 → 14,57 | « Que ce soit vos retours… les commandes » | Face cam × 1 | |
| 437 → 593 | 14,57 → 19,77 | « En vrai les gars, chaque petit geste… sur du long terme » | Face cam, zoom progressif × 1 → × 1,15 | |
| 593 → 641 | 19,77 → 21,37 | « Donc merci à toi si tu soutiens le projet » | Face cam × 1,09 | |
| 641 → 734 | 21,37 → 24,47 | « Pour ceux qui ne l'ont pas encore fait… vous avez jusqu'à » | Face cam × 1 | |
| 734 → 891 | 24,47 → 29,7 | « ce soir minuit sur le site mehomies.com. Normalement vous avez du choix… avec six variantes » | **Fond blanc** : téléphone animé (asset site mobile) et barre de recherche dessous (asset) | Déclencheur de l'asset ; clic à la sortie |
| 891 → 918 | 29,7 → 30,6 | « mais aussi en coupe » | Face cam × 1 | |
| 918 → 967 | 30,6 → 32,23 | « avec le Boxy Tee ou le Baby Tee » | **Fond blanc** : photo du Boxy Tee, puis photo du Baby Tee (changement sur « ou »), étiquette BOXY TEE / MEHOMIES | Déclencheur avant chaque photo ; clic à la sortie |
| 967 → 1 059 | 32,23 → 35,3 | « Dans tous les cas, pour les deux modèles, ça va du XS au XXL » | Face cam × 1 | |
| 1 059 → 1 098 | 35,3 → 36,6 | « C'est le moment, faites-vous plaisir » | Face cam × 1,06 | |
| 1 098 → 1 133 | 36,6 → 37,77 | « Merci à vous, let's go » | Face cam × 1,23 | Fin nette : musique coupée à la dernière image |

## 2. Montage

- Base : `fin-precommande_facecam-voix.mp4` (les coupes de l'agent), gardé tel quel sauf **deux resserrages** : 8 images retirées à 26,9 s (entre « mehomies.com » et « Normalement ») et 3 images à 32,2 s (entre « Baby Tee » et « Dans tous les cas »). Durée : 37,77 s au lieu de 38,17 s.
- **Coupes sèches partout** : aucune transition dans la timeline.
- Les séquences sur fond blanc couvrent chacune **une idée entière** (une phrase ou un passage) et commencent sur le mot qui l'annonce : « Avec BAG », « ce soir », « avec le Boxy Tee ».

## 3. Hook (0 → 2,37 s)

- **Titre posé sur le face cam** (sans fond), sous le visage, sur le t-shirt noir.
- 3 lignes en **Gilroy Heavy capitales**, **bords gauche et droit alignés** : c'est le principe de composition de la charte, avec d'autres couleurs.

| Ligne | Texte | Couleur (timeline) | Hauteur des capitales *(mesuré)* |
|---|---|---|---|
| 1 | DERNIÈRE CHANCE | Jaune pâle `#EDC55C` | 58 px |
| 2 | POUR COMMANDER | Blanc `#FFFFFF` | 54 px |
| 3 | TON TEE | **Jaune `#FFB900`** | 131 px |

- Bloc *(mesuré)* : x de 194 à 885 (690 px, centré), y de 1 032 à 1 328. Le bord droit tombe pile sur la limite de la zone sûre sous y = 1 088 (x = 885).
- Écart entre les lignes *(mesuré)* : 21 px entre capitales.
- Ombre portée sombre sous les lettres.
- Texte fixe : présent dès la 1re image, disparaît à la coupe. Aucune animation.
- **Texte reformulé**, plus court que la phrase dite : « Dernière chance pour commander ton tee ».
- Dans Resolve : 3 titres Text+ de taille 0,09, agrandis de × 1,03, × 0,97 et × 2,35 pour aligner les bords.
- Riser : les 2,4 dernières secondes du fichier, qui se terminent avec le hook.

## 4. Face cam : cadrages

| Plan (images) | Zoom |
|---|---|
| 0 → 71 (hook) | × 1,21, fixe (décalé de 17 px vers la droite) |
| 71 → 227 | **Progressif × 1 → × 1,2** sur 5,2 s (linéaire) |
| 227 → 437 | × 1 (caché de 227 à 335 par la séquence BAG) |
| 437 → 593 | **Progressif × 1 → × 1,15** sur 5,2 s (linéaire) |
| 593 → 641 | × 1,09 |
| 641 → 807 | × 1 |
| 807 → 891 | × 1,4, mais entièrement caché par la séquence du site |
| 891 → 1 059 | × 1 |
| 1 059 → 1 098 | × 1,06 |
| 1 098 → 1 133 | × 1,23 |

Règle observée : **un nouveau cadrage à chaque nouvelle phrase**. Zooms progressifs sur les deux longues phrases, recadrages fixes (× 1,06 à × 1,23) sur les phrases courtes de la fin. Aucun dézoom.

## 5. Séquences sur fond blanc

**Fond : blanc uni** (générateur « Solid Color » de Resolve ; `#FCFCFC` *mesuré* dans le MP4), à la place de fond_1 et de son grain. Le face cam est entièrement caché pendant ces séquences.

### BAG (7,57 → 11,17 s)

- En haut : la vidéo « Version FR EN » (16:9), 887 × 500 px, x de 96 à 982, y de 449 à 948 *(mesuré)*.
- Dessous : logo BAG (rond jaune) et « BAGCVL / Visual artist », 627 px de large, y de 1 037 à 1 272 *(mesuré)*.
- Le jaune du logo BAG (`#FCBC00` *mesuré*) est celui du hook (`#FFB900`).

### Site (24,47 → 29,7 s)

- **Téléphone** (asset `site-mobile_v01.mov`) remonté de 23 px : haut du téléphone à y = 214. Coupé à 154 des 182 images : la fin fixe n'est pas utilisée.
- **Barre de recherche** (asset `barre-recherche_v01.mov`) descendue de 610 px, juste sous le téléphone : y ≈ 1 336 à 1 468. Sa fin (images 95 à 113) est répétée trois fois pour la faire durer.
- Les deux assets démarrent ensemble, 3 images après l'arrivée du fond blanc.

### Produits (30,6 → 32,23 s)

- Photo en **4:5 aux angles arrondis** (≈ 690 × 862 px, rayon ≈ 85 px), haut à y = 250 *(mesuré)* ; ombre portée marquée vers le bas et la droite. C'est proche du cadre photo de la charte (rayon ≈ 90 px, ombre).
- **Étiquette** centrée sous la photo : « BOXY TEE » en **Gilroy ExtraBold** noir (capitales 71 px), puis « MEHOMIES » en **Gilroy Medium Italic** noir (55 px) *(mesuré)*.
- 2 photos : `Mehomies_Boxy T.png` (918 → 945), puis `POST_32.png`, le Baby Tee bleu (945 → 967). L'étiquette reste « BOXY TEE » sur les deux.

### Éléments préparés mais désactivés

- Le diaporama des six t-shirts (clip composé : 6 images de détail, 3 images chacune, masque arrondi) : désactivé.
- Le calque des zones sûres (TikTok / Instagram) : piste désactivée, utilisée comme repère.

## 6. Texte et typographies

| Élément | Police | Couleur |
|---|---|---|
| Hook | Gilroy Heavy | Jaune `#FFB900`, jaune pâle `#EDC55C`, blanc |
| Étiquette produit (nom) | **Gilroy ExtraBold** | Noir |
| Étiquette produit (marque) | **Gilroy Medium Italic** | Noir |

- **Permanent Marker n'est pas utilisé**, ni le rouge `#9F1932`.
- Gilroy ExtraBold et Gilroy Medium Italic ne sont pas dans `CHARTE/07_typographies/` : elles sont installées sur le Mac de Michaël.
- **Sous-titres** : deux pistes préparées dans la timeline, mais **aucune n'est incrustée dans le MP4**.
  - ST1, active : 86 sous-titres, repris du SRT « par groupe » et retouchés ; « général » (≈ 9,6 s) et « six » (≈ 29 s) n'y sont plus écrits.
  - ST2, désactivée : 33 sous-titres, sur le hook et les séquences sur fond blanc.

## 7. Son

| Élément | Réglage | Niveau |
|---|---|---|
| Voix | Export face cam, sans changement | -14,2 LUFS |
| Musique | Même piste, départ à **1:16,97** dans le morceau, de la fin du hook à la dernière image, **gain -8,8 dB**, sans fondu | ≈ **-22,7 LUFS**, soit ≈ 8,5 dB sous la voix (v02 : -27 LUFS, 13 dB sous la voix) |
| Riser (`sfx_riser_riser_v01.mp3`) | Hook : fin du son calée sur la fin du hook | Fichier de la charte, sans gain |
| **Clic** (`sfx_clic_click_v01.wav`) | ≈ 0,1 s avant l'entrée de la séquence BAG, et avant la **sortie** de chaque séquence sur fond blanc : 7,48 s, 11,08 s, 29,55 s, 32,18 s | Sans gain (pic -1,6 dBFS dans le fichier) |
| Déclencheur (`sfx_declencheur_shutter-click_v01.mp3`) | ≈ 0,15 s avant chaque photo produit : 30,46 s et 31,29 s ; plus celui de l'asset du site (≈ 24,8 s) | Sans gain |

Mix final *(mesuré)* : **-13,6 LUFS** intégré, plage de 2,7 LU, **pic vrai +0,6 dBTP** : au-dessus de 0, risque de saturation quand les réseaux convertissent la vidéo (v02 : -1,8 dBTP).

## 8. Écarts avec la charte et avec la v02

| Élément | Charte / v02 | VF de Michaël |
|---|---|---|
| Couleur d'accent | Rouge `#9F1932` | **Jaune `#FFB900`** (+ jaune pâle `#EDC55C`), le jaune du logo BAG |
| Fond des illustrations | fond_1 `#FEFBF1` avec grain | **Blanc uni** |
| Police d'accent | Permanent Marker | Aucune ; en plus : Gilroy ExtraBold et Medium Italic |
| Compositions de texte | 3, sur fond_1 (geste / concret, minuit / mehomies.com, XS / XXL) | **1 seule : le hook**, sur le face cam, en jaune et blanc |
| Hook | Riser seul, sans titre | Riser + titre reformulé en 3 lignes |
| Sous-titres | Incrustés, mot à mot, blancs avec ombre | Préparés mais non incrustés |
| Illustrations | Photo, détourés, compositions | Vidéo + logo (BAG), assets animés (site), photos arrondies avec étiquette |
| Face cam | Zooms progressifs, plans serrés × 1,15 | Un cadrage par phrase : progressifs × 1 → × 1,2 et × 1 → × 1,15, fixes × 1,06 à × 1,23 (× 1,21 sur le hook) |
| Musique | -27 LUFS | ≈ -22,7 LUFS |
| Bruitages | Déclencheur, riser | + **clic** aux entrées et sorties du fond blanc |
| Coupes | Marge de 0,08 s | Gardées, deux resserrages (8 et 3 images) |
| Pic vrai | ≤ -1 dBTP | +0,6 dBTP |
| Fin | Arrêt sur « let's go » | Pareil, musique coupée net |

## 9. Points à corriger

1. **Sous-titres absents du MP4** : les pistes existent, mais l'incrustation n'est pas activée à l'export (Deliver). À ignorer si c'est voulu.
2. **Étiquette « BOXY TEE » sur la photo du Baby Tee** (31,5 → 32,2 s).
3. **Pic vrai +0,6 dBTP** : à limiter à -1 dBTP à l'export.
4. **Barre de recherche sous la zone sûre** : elle descend jusqu'à y ≈ 1 468, la zone sûre s'arrête à 1 365 ; la légende du réseau peut la cacher.
5. Piste ST1 : « général » et « six » ne sont plus écrits alors qu'ils sont dits.
6. Fichiers hors du dossier de la vidéo (`Version FR EN.mp4` dans Téléchargements, les six maquettes sur le Bureau, le logo BAG dans `CHARTE/a_ranger`) : à copier dans `assets/` pour que le montage puisse être refait.

## 10. Questions avant de mettre à jour la charte

1. **Jaune** : nouvelle couleur d'accent pour toutes les vidéos, ou propre à cette vidéo avec BAG (c'est le jaune de leur logo) ? Le jaune pâle `#EDC55C` est-il une couleur secondaire ?
2. **Fond blanc** : remplace-t-il fond_1 dans toutes les vidéos ?
3. **Permanent Marker** : abandonné ?
4. **Gilroy ExtraBold et Gilroy Medium Italic** : à ajouter à la charte ? Il faut alors déposer les fichiers dans `CHARTE/07_typographies/` (l'agent ne crée ni ne télécharge de police).
5. **Sous-titres** : incrustés ou non ? Si oui, quel style ?
6. **Hook** : titre reformulé en 3 lignes sur le face cam, à reprendre comme modèle ?
7. **Clic** aux entrées et sorties du fond blanc, **déclencheur** avant chaque photo : règles générales ?
8. **Musique** ≈ 8,5 dB sous la voix : nouvelle référence ?
9. **Cadrage** : un nouveau cadrage à chaque phrase, à reprendre comme règle ?

## 11. Nouvelle version et décisions (2026-09-30)

Michaël a réexporté `export/VF by Mikha.mp4` le 2026-09-30 (même durée, même son) :

- **Sous-titres incrustés** (piste retouchée) : « général » et « 6 variantes » sont écrits ; style relevé dans `CHARTE/03_motion/SOUS-TITRES.md`.
- **Étiquette corrigée** : « BABY TEE » sur la photo du Baby Tee.
- Inchangés : pic vrai à +0,6 dBTP ; barre de recherche et sous-titres de la séquence du site sous la zone sûre.

Réponses de Michaël aux questions de la section 10 : le jaune devient la couleur de toutes les vidéos, le fond blanc remplace fond_1, Permanent Marker est abandonnée, les nouvelles graisses de Gilroy sont déposées, les sous-titres sont incrustés, et le reste de sa façon de faire devient la règle. **La charte a été mise à jour le 2026-09-30.** Cette version sert de vidéo de référence : `CHARTE/08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4`.
