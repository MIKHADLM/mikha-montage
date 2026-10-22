# DESIGN : spécification visuelle du compte mikha_dlm

> **Rôle :** spec visuelle de référence des vidéos mikha_dlm (Instagram Reels, TikTok, YouTube Shorts). **Lecteurs :** les agents IA (HyperFrames, Remotion) en priorité, et l'humain pour la compléter. Les mêmes valeurs sont dans `tokens.json`.

## Comment lire ce fichier (agents)

- Canevas de référence : **1080×1920 px, vertical, 30 i/s** (à confirmer).
- Toute valeur `[À COMPLÉTER : ...]` est **inconnue** : ne pas l'inventer, ne pas la remplacer par un réglage par défaut du skill. La signaler, et utiliser la valeur du brief de la vidéo si elle existe.
- `(mesuré sur la VF)` : valeur relevée sur le montage de Michaël, vidéo de référence `08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4` (analyse complète : `a_monter/1/ANALYSE_VF.md`), ± 2 px.
- Toutes les tailles sont en **pixels sur le canevas 1080×1920**.
- Orthographe exacte des noms propres : voir `01_marque/TON.md`.

**Direction artistique mise à jour le 2026-09-30** d'après le montage de Michaël (VF de la vidéo 1) : **jaune** à la place du rouge, **fond blanc** à la place de fond_1, **Gilroy seule** (Permanent Marker abandonnée). Les exemples antérieurs (fond_1, rouge, Permanent Marker) ne sont plus à reproduire.

## 1. Couleurs

| Nom | Hex | Rôle | Statut |
|---|---|---|---|
| **Jaune** (accent) | `#FFB900` | Couleur d'accent de toutes les vidéos : **met en avant les mots importants du hook** (ex. « TON TEE ») | Confirmé par Michaël le 2026-09-30, remplace le rouge |
| ~~Jaune pâle~~ | ~~`#EDC55C`~~ | **Abandonné** le 2026-10-01 (« le jaune plus clair, on peut l'oublier ») : tous les mots importants prennent le jaune `#FFB900` | Ne plus utiliser (reste dans la VF de la vidéo 1) |
| **Blanc** | `#FFFFFF` | Fond plein des séquences d'illustration ; texte sur le face cam (sous-titres, lignes du titre) | Fond confirmé par Michaël le 2026-09-30, remplace fond_1 |
| Noir | `#000000` | Texte sur fond blanc (sous-titres, étiquettes) | Mesuré sur la VF |
| ~~Rouge~~ | ~~`#9F1932`~~ | **Abandonné** le 2026-09-30 | Ne plus utiliser |
| ~~fond_1~~ | ~~`#FEFBF1` avec grain~~ | **Abandonné** le 2026-09-30 (fichier gardé pour archive dans `06_assets/textures/`) | Ne plus utiliser |

Notes :

- `#FFB900` est la valeur réglée dans la timeline DaVinci de la VF. Il est quasi identique au jaune du logo BAG (`#FCBC00` mesuré).
- **Blanc du fond :** générateur « Solid Color » de Resolve ; l'export le rend en `#FCFCFC` (mesuré). Référence : `#FFFFFF`.
- **Jaune sur blanc :** contraste ≈ 1,7:1 (calculé), peu lisible. La VF n'emploie le jaune que sur le face cam ; sur fond blanc, le texte est noir.
- **Étalonnage du plan principal :** aucune couleur n'est appliquée par-dessus le rush (voir section 9).
- **Dégradés :** `[À COMPLÉTER : autorisés ou non, définition]`
- **Contraste minimal texte / fond :** `[À COMPLÉTER : ex. ratio 4.5:1]`
- **Couleurs propres à chaque pays de la collection Mehomies Flag :** `[À COMPLÉTER : autorisées ou non, dans quel cadre]`

## 2. Typographies

Les polices sont dans `07_typographies/`. Ne rien télécharger ni substituer : si une police manque, le signaler. **Une seule famille : Gilroy**, en trois graisses (confirmé le 2026-09-30).

| Rôle | Police | Fichier | Couleur | Taille (mesuré sur la VF) | Casse |
|---|---|---|---|---|---|
| Titre d'accroche et titres | **Gilroy Heavy** | `07_typographies/Gilroy/Gilroy-Heavy.ttf` | Sur le face cam : blanc, jaune | Libre, bords alignés (hauteur des capitales de 54 à 131 px) | Majuscules |
| Sous-titres | **Gilroy ExtraBold** (confirmé le 2026-09-30) | `07_typographies/Gilroy/Gilroy-ExtraBold.ttf` | Blanc sur le face cam, noir sur fond blanc | ≈ 75 px (capitales 53 px) | Voir `03_motion/SOUS-TITRES.md` |
| Étiquette : nom (produit, partenaire) | **Gilroy ExtraBold** | `07_typographies/Gilroy/Gilroy-ExtraBold.ttf` | Noir sur fond blanc (blanc sur fond sombre : étiquette BAG) | Capitales 71 px (produit) | Majuscules |
| Étiquette : précision (marque, métier) | **Gilroy Medium Italic** | `07_typographies/Gilroy/Gilroy-MediumItalic.ttf` | Comme le nom | Capitales 55 px (produit) | « MEHOMIES » en majuscules, « Visual artist » en minuscules |
| Texte de la barre de recherche (asset) | Gilroy Heavy | `07_typographies/Gilroy/Gilroy-Heavy.ttf` | Noir | 62 px | Minuscules (adresse du site) |
| Chiffres | Police du texte qui les porte | : | : | : | Écrits en chiffres dans les sous-titres (« 6 variantes », VF) |
| ~~Accent~~ | ~~Permanent Marker~~ | **Abandonnée** le 2026-09-30 (fichier gardé pour les anciens montages) | : | : | : |

**Document Photoshop de référence (fourni par Michaël) :** 1080 × 1920 px, **300 pixels/pouce**. Conversion : **1 pt = 300 / 72 = 4,1667 px**. Repères de l'ancien exemple, toujours valables pour Gilroy : corps 24 pt (100 px) et 26,4 pt (110 px), interligne 21 pt (87,5 px).

- **Tailles libres :** dans un titre, la taille de chaque ligne s'**ajuste** pour que les **bords gauche et droit de toutes les lignes soient alignés** (confirmé par le hook de la VF).
- **Taille minimale lisible en 1080 px :** `[À COMPLÉTER : px]`
- **Interlettrage :** `[À COMPLÉTER : ex. 0 ou -2 %]`
- **Alignement :** centré (VF).
- **Police de secours si une police de marque est absente :** aucune : signaler.
- **Caractères français :** les trois fichiers Gilroy contiennent les accents, `œ`, `’`, `€`, les guillemets français et les chiffres (testé le 2026-09-30).

## 3. Titres et compositions de texte

### 3.1 Titre d'accroche (hook)

Modèle : le hook de la VF (`08_references/captures/exemple_hook-1_v01.png`), confirmé par Michaël le 2026-09-30.

| Élément | Valeur (mesuré sur la VF) |
|---|---|
| Durée | Toute la phrase d'accroche : présent dès la 1re image, disparaît à la coupe qui la termine (2,37 s dans la VF) |
| Texte | **Reformulation courte** de la phrase dite, pas la transcription : « C'est la dernière chance pour toi de commander ton t-shirt Mehomies » devient « DERNIÈRE CHANCE / POUR COMMANDER / TON TEE » |
| Fond | Aucun : posé sur le face cam, sous le visage (sur le t-shirt) |
| Structure | 3 lignes, Gilroy Heavy, majuscules, bords gauche et droit alignés (taille de chaque ligne ajustée) |
| Couleurs | **Le jaune `#FFB900` met en avant les mots importants** (confirmé le 2026-09-30), le reste est en blanc. **Un seul jaune** depuis le 2026-10-01 : le jaune pâle est abandonné (vidéo 2 : « LE PREMIER » blanc, « POP-UP » et « MEHOMIES » jaune). VF de la vidéo 1 : ligne 1 jaune pâle `#EDC55C` (ancienne règle), ligne 2 blanc, ligne 3 jaune |
| Hauteur des capitales | 58 px, 54 px, 131 px |
| Écart entre les lignes | 21 px (entre capitales) |
| Bloc | x de 194 à 885 (690 px, centré sur 540), y de 1 032 à 1 328 ; le bord droit tombe sur la limite de la zone sûre (x = 885 sous y = 1 088) |
| Ombre | Ombre portée sombre sous les lettres ; paramètres `[À COMPLÉTER]` |
| Animation | Aucune : apparition et disparition en coupe sèche |
| Sous-titres | Masqués pendant le titre |

Face cam et son du hook : `03_motion/MOTION.md` (section 5) et `04_son/SON.md`.

### 3.2 Règles générales

- **Composition :** plusieurs lignes aux bords alignés, taille de chaque ligne ajustée. Les **mots les plus importants** sont mis en valeur par la **couleur jaune `#FFB900` et une ligne plus grande** (remplace Permanent Marker rouge).
- **Remplace les sous-titres :** pendant qu'un titre ou un texte dit les mêmes mots, il remplace les sous-titres.
- **Composition sur fond blanc :** `[À COMPLÉTER : pas encore d'exemple ; le texte y serait noir, le jaune étant peu lisible sur blanc]`
- **Nombre maximal de lignes et de mots :** `[À COMPLÉTER]` (3 lignes dans la VF)
- **Autre position que sous le visage :** `[À COMPLÉTER]`

## 4. Fond blanc et séquences d'illustration

**Fond blanc uni `#FFFFFF`**, plein cadre, à la place de fond_1 (confirmé le 2026-09-30). Pendant ces séquences, le face cam est entièrement caché.

Règles observées sur la VF (confirmées le 2026-09-30) :

- Chaque séquence couvre **une idée entière** (une phrase ou un passage) et **commence sur le mot qui l'annonce** : « Avec BAG », « ce soir », « avec le Boxy Tee ».
- Entrée et sortie en **coupe sèche**, avec un bruitage (`04_son/SON.md`).
- Les **sous-titres continuent en noir**, sauf quand l'écran montre déjà les mots dits (étiquette produit, adresse tapée dans la barre de recherche).
- Tous les éléments sont **centrés** horizontalement.

### Mises en page (mesuré sur la VF)

| Séquence | Contenu | Mesures | Capture |
|---|---|---|---|
| **Partenaire** | Vidéo du partenaire en 16:9 en haut, étiquette du partenaire dessous | Vidéo 887 × 500 px (x de 96 à 982, y de 449 à 948) ; étiquette de 627 px de large (y de 1 037 à 1 272) | `exemple_partenaire-1_v01.png` |
| **Site** | Téléphone animé (asset site mobile) et barre de recherche (asset) juste dessous | Haut du téléphone à y = 214 ; barre de y ≈ 1 336 à 1 468 ; sous-titres de y ≈ 1 505 à 1 557 (barre et sous-titres sous la zone sûre, voir section 7) | `exemple_site-1_v01.png` |
| **Produit** | Photo aux angles arrondis, étiquette dessous ; une photo par produit cité, changée sur le mot (défilé de visuels non nommés : intervalles réguliers, `03_motion/MOTION.md` §2) | Photo 4:5 ≈ 690 × 862 px, haut à y = 250 ; « BOXY TEE » : capitales 71 px, y de 1 180 à 1 251 ; « MEHOMIES » : 55 px, y de 1 279 à 1 334 | `exemple_produit-1_v01.png` |

### Cadre photo (mesuré sur la VF)

| Élément | Valeur |
|---|---|
| Ratio | 4:5 |
| Taille | ≈ 690 × 862 px |
| Rayon des angles | ≈ 85 px |
| Ombre | Douce, décalée vers le bas et la droite, visible sur ≈ 50 à 60 px ; paramètres exacts `[À COMPLÉTER]` |

L'ancien cadre (3:4, 573 × 762 px, rayon 90 px, sur fond_1) n'est plus la référence.

### Étiquette (nom + précision)

Élément de la VF et des étiquettes BAG fournies par Michaël : un visuel (photo, logo) et, dessous ou à côté :

- le **nom** en Gilroy ExtraBold, majuscules (« BOXY TEE », « BAGCVL ») ;
- une **précision** en Gilroy Medium Italic (« MEHOMIES », « Visual artist »).

Noir sur fond blanc ; blanc sur fond sombre. Étiquettes prêtes du partenaire BAG : `06_assets/partenaires/` (section 5).

### Téléphone neutre, pour montrer un site en version mobile

Validé par Michaël le 2026-09-29 (contour noir, sans marque) ; valeurs proposées au premier motion design, à confirmer.

| Élément | Valeur |
|---|---|
| Coque | Noire `#0E0E0E`, bord intérieur plus clair `#2F2F2F` de 2 px (lisible sur un fond sombre), boutons latéraux discrets |
| Marque | Aucune : ni logo, ni encoche, ni barre d'état |
| Écran | 500 × 1 082 px, soit 390 × 844 points de site ; angles arrondis de 62 px |
| Taille au repos | 528 × 1 110 px, rayon extérieur 76 px, centré sur x = 540 et y = 792 (milieu de la zone sûre) |
| Ombre | Celle de l'ancien cadre photo (10 px vers le bas, 35 px de flou, noir à 37,5 %) |
| Livraison | Asset sur fond transparent, sans texte (ProRes 4444) : Michaël ajoute le texte dans DaVinci |

### Verre liquide

Inspiré du Liquid Glass d'Apple, demandé par Michaël le 2026-09-29 pour la barre de recherche ; valeurs proposées par l'agent, à confirmer.

| Élément | Valeur |
|---|---|
| Principe | Un asset transparent ne peut pas flouter ce qu'il y aura derrière : le verre est **dépoli**, pour que le texte noir reste lisible sur tout fond |
| Remplissage | Blanc translucide en dégradé vertical : 74 % en haut, 52 % au milieu, 60 % en bas |
| Reflets | Lumière intérieure en haut, léger assombrissement intérieur en bas, halo intérieur blanc ; reflet ovale qui glisse sur le verre |
| Bord | Anneau lumineux de 2 px en dégradé (blanc vif en haut à gauche et en bas à droite), contour noir à 8 % de 1 px |
| Ombre | Douce, vers le bas : 14 px de décalage, 38 px de flou, noir à 20 % |
| Forme | Capsule (angles arrondis à la moitié de la hauteur) |
| Texte et icônes | Gilroy Heavy noir ; icônes grises (noir à 50 %) ; curseur rouge `#9F1932` dans l'asset v01. Avec le passage au jaune : `[À COMPLÉTER : curseur jaune, peu visible sur verre blanc, ou noir ?]` |

Autres réglages à compléter :

- **Détourés produit (PNG transparents) sur fond blanc :** `[À COMPLÉTER : encore utilisés ? pas dans la VF]`
- **Photo ou vidéo dans le cadre arrondi :** `[À COMPLÉTER : les deux ? animation autorisée ?]`

## 5. Logo et partenaires

Les logos et autres assets (produits, partenaires…) sont **fournis avec chaque vidéo à monter** ; leurs chemins figurent dans le brief.

| Version | Fichier | Usage | Fond compatible |
|---|---|---|---|
| **Étiquette BAG**, texte noir | `06_assets/partenaires/partenaire_bag_etiquette-texte-noir_v01.png` | Séquence partenaire (utilisée dans la VF) : logo rond jaune « BAG », « BAGCVL », « Visual artist » ; PNG transparent 1080 × 353 | Fond blanc ou clair |
| **Étiquette BAG**, texte blanc | `06_assets/partenaires/partenaire_bag_etiquette-texte-blanc_v01.png` | Même étiquette pour un fond sombre (face cam, vidéo) | Fond sombre |
| `[À COMPLÉTER : logo ou signature du compte, ou « aucun logo »]` | `[À COMPLÉTER : chemin dans 06_assets/logos/]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` |
| `[À COMPLÉTER : logo Mehomies]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` |

- **Taille dans la VF :** étiquette BAG affichée sur 627 px de large (mesuré).
- **Taille minimale (largeur en 1080 px) :** `[À COMPLÉTER : ex. 160 px]`
- **Zone de protection autour du logo :** `[À COMPLÉTER : ex. 24 px de chaque côté]`
- **Animation autorisée du logo :** `[À COMPLÉTER : oui / non, laquelle]` (aucune dans la VF)
- **Interdits (déformer, recolorer, ombre…) :** `[À COMPLÉTER]`

## 6. Grille et marges

| Élément | Valeur |
|---|---|
| Marges gauche / droite | Voir les zones sûres, section 7 |
| Marges haute / basse | Voir les zones sûres, section 7 |
| Nombre de colonnes | `[À COMPLÉTER]` |
| Unité d'espacement de base | `[À COMPLÉTER : px]` |
| Alignement principal des blocs de texte | Centré (VF) |

## 7. Zones sûres (1080×1920)

Gabarit de référence : `05_formats/safe-zone_tiktok-instagram_overlay_v01.webp` (zone transparente = zone utilisable, valable pour **TikTok et Instagram Reels**). Tout texte, logo et élément important reste **à l'intérieur** de cette zone. Michaël monte avec ce gabarit en calque de repère (piste désactivée à l'export).

**Zone utilisable (mesurée sur le gabarit)**, polygone en pixels (x, y) :

`(85, 219)` → `(1018, 219)` → `(1018, 1088)` → `(885, 1088)` → `(885, 1475)` → `(499, 1475)` → `(499, 1365)` → `(85, 1365)` → retour à `(85, 219)`

| Bord | Marge mesurée sur le gabarit | Détail |
|---|---|---|
| Haut | 219 px | |
| Gauche | 85 px | |
| Droite | 62 px en haut (y < 1088) ; 195 px plus bas (y de 1088 à 1365) | Colonne droite réservée aux boutons de la plateforme |
| Bas | 555 px sous la partie gauche (jusqu'à y = 1365) ; 445 px dans la colonne centrale x de 499 à 885 (jusqu'à y = 1475) | |

**Rectangle sûr simple** (entièrement dans le polygone, pour un placement rapide) : x de 85 à 885, y de 219 à 1365, soit marges haut 219 / bas 555 / gauche 85 / droite 195.

**Recommandation Instagram Reels collée par Michaël (source externe, moins restrictive)** : haut ≈ 108 px, bas ≈ 300 à 320 px, gauche ≈ 60 px, droite ≈ 100 à 120 px ; zone centrale ≈ 1080 × 1420 px. **En cas d'écart, le gabarit mesuré ci-dessus l'emporte** (il couvre les deux plateformes).

| Plateforme | Valeurs propres à la plateforme |
|---|---|
| Instagram Reels | Voir la recommandation ci-dessus |
| TikTok | `[À COMPLÉTER : valeurs propres, si différentes du gabarit]` |
| YouTube Shorts | `[À COMPLÉTER : valeurs propres, si différentes du gabarit]` |

- **Exception acceptée (2026-09-30, « on garde ça pour l'instant ») :** dans la séquence du site, la barre de recherche (y ≈ 1 336 à 1 468) et les sous-titres (y ≈ 1 505 à 1 557) descendent sous la zone sûre. Le bas des sous-titres courants (y ≈ 1 385) dépasse aussi de 20 px la limite de 1 365 sur la partie gauche.
- **Éléments autorisés à déborder des zones sûres :** le fond blanc et le rush plein cadre couvrent tout le cadre ; `[À COMPLÉTER : autres exceptions éventuelles]`
- **Captures de l'interface des plateformes utilisées pour la mesure :** `[À COMPLÉTER : chemins dans 08_references/captures/, si disponibles]`

## 8. Éléments graphiques signature

Éléments de la VF : titre d'accroche en 3 lignes (section 3.1), fond blanc plein cadre, photo aux angles arrondis avec ombre, étiquette nom + précision, téléphone neutre et barre de recherche en verre liquide (assets animés).

| Élément | Description | Fichier | Usage | Interdits |
|---|---|---|---|---|
| Étiquette BAG | Logo rond jaune + « BAGCVL » + « Visual artist » | `06_assets/partenaires/partenaire_bag_etiquette-texte-*_v01.png` | Séquence partenaire | `[À COMPLÉTER]` |
| Téléphone animé (site mobile) | Asset transparent | `motion_design/site_mobile/export/` | Séquence site | `[À COMPLÉTER]` |
| Barre de recherche « mehomies.com » | Asset transparent | `motion_design/barre_recherche/export/` | Séquence site, sous le téléphone | `[À COMPLÉTER]` |
| `[À COMPLÉTER : autre élément signature]` | `[À COMPLÉTER]` | `[À COMPLÉTER : chemin dans 06_assets/elements-graphiques/]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` |

- **Épaisseur des traits / contours :** `[À COMPLÉTER : px]`
- **Icônes :** `[À COMPLÉTER : style, dossier 06_assets/icones/]`

## 9. Traitement de l'image

| Élément | Valeur |
|---|---|
| Étalonnage du plan principal | **Fait par Michaël avant transmission.** Le rush arrive déjà étalonné. Les agents n'appliquent ni LUT, ni correction de couleur, ni filtre sur ce rush. |
| Grain et texture | **Aucun** : fond blanc uni (fond_1 et son grain abandonnés le 2026-09-30) |
| Grain par-dessus la vidéo ou les photos | Aucun dans la VF `[À COMPLÉTER : confirmer]` |
| Vignettage | Aucun dans la VF `[À COMPLÉTER : confirmer]` |
| Cadrage des rushs face cam | Recadrage par zoom autorisé : un nouveau cadrage à chaque phrase (`03_motion/MOTION.md`, section 4) |
| Photos produit | Angles arrondis et ombre (section 4) |

## 10. Hiérarchie visuelle

Ce que le spectateur doit voir **en premier**, puis en deuxième, puis en troisième, sur une image type :

1. `[À COMPLÉTER : ex. le visage / le titre / le produit]`
2. `[À COMPLÉTER]`
3. `[À COMPLÉTER]`

- **Nombre maximal d'éléments textuels simultanés à l'écran :** `[À COMPLÉTER]`
- **Rapport de taille titre / texte :** `[À COMPLÉTER]`

## 11. À faire / à ne jamais faire

| À faire | À ne jamais faire |
|---|---|
| Fond blanc uni pour les séquences d'illustration, face cam caché | Étalonner ou modifier la couleur du rush principal |
| Jaune `#FFB900` pour les mots forts des titres sur le face cam ; noir sur fond blanc | Utiliser le rouge `#9F1932`, Permanent Marker ou fond_1 (abandonnés) |
| Hook : titre reformulé en 3 lignes Gilroy Heavy aux bords alignés, sur le face cam | Placer du texte ou un élément important hors de la zone sûre |
| Étiquette nom (Gilroy ExtraBold) + précision (Gilroy Medium Italic) sous une photo ou un logo | Inventer une police ou une couleur absente de cette charte |
| Sous-titres Gilroy ExtraBold, blancs sur le face cam, noirs sur fond blanc (voir `SOUS-TITRES.md`) | Mettre du texte jaune sur fond blanc (illisible) |
| Couper tous les silences | Laisser un silence dans le montage |
