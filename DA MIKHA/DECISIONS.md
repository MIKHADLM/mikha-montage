# Recherche de DA : décisions de Michaël

> Exploration commencée le 2026-11-03. **La charte (`CHARTE/`, jaune et Gilroy) n'est pas modifiée** tant que Michaël n'a pas validé le passage à cette DA.

## Base (templates de Michaël, dossier `DA MIKHA/`)

- **Rouge `#F12F19`** (2026-11-03 : Michaël veut un rouge « plus pétant » ; il remplace le `#F12F19` mesuré sur ses templates), avec du noir et du blanc. Grain fin, sans taches de couleur, sur les panneaux rouges.
- Typos : **Anton** pour les titres et les panneaux, **Thunder LC** pour les sous-titres.
- Le flou du panneau « SUR TOUT LE SITE » est **voulu**.
- Le rouge de l'affiche FAKHOMIES n'a pas d'importance : l'affiche sert seulement d'exemple concret.

## Titre d'accroche

- **Piste 02, validée** : un mot clé géant en Anton, rouge, qui remplit la largeur de la zone sûre (85 à 1018 px) et passe **derrière le sujet** (détourage image par image).
- **Contour permanent** (2026-11-03) : un contour rouge de 3 px redessine le mot par-dessus le sujet pendant toute la durée du titre. Les variantes sans contour et à contour automatique sont écartées.
- **Placement** : le titre descend le plus possible derrière la tête, tant qu'aucune lettre n'est cachée à plus de 30 % (proposition) ; au plus haut, le haut des capitales reste au bord haut de la zone sûre (219 px). Script : `remotion/scripts/placer_titre_derriere.py`.
- **Petite ligne** (le début du titre) : Thunder, espacée, **devant** le sujet, au-dessus du mot géant. **À retravailler** (Michaël est d'accord, 2026-11-03) : elle se perd sur un fond chargé, et elle est **hors zone sûre** (ligne de base à 185 px, la zone commence à 219). Six variantes : `planche_titres/petite_ligne.html`.
- **Les six variantes de la petite ligne sont refusées** (2026-11-03) : « ça ne me correspond pas », on repense le titre entièrement. Nouvelles références : `references/ref_titre_prospects.png` et `references/ref_titre_ideas_content.png`. Ce qu'on en retient : un **bloc compact**, un mot clé très grand, des petits mots glissés dans les vides (coins, à côté, empilés), un interligne très serré, deux couleurs (mot clé et le reste). Six compositions sur deux titres : `planche_titres/titre_bloc.html`. **Retenues pour la suite : 05 « mot clé et petit mot sur la même ligne »** (sous le visage) **ou 06 « empilés, derrière la tête »** ; une 07 ajoutée (la 05 derrière la tête). Animées sur le rush (2026-11-03) : chaque morceau sort d'une ligne fixe sous sa ligne de base, dans l'ordre de lecture, un toutes les 4 images, en 12 images (propositions). Vidéos : `tests_video/titre_bloc_05_ligne.mp4` et `titre_bloc_06_empiles.mp4`, composition `DA-TitreBloc`.
- **Choix du titre (2026-11-03) : 06, « empilés, derrière la tête »** (`tests_video/titre_bloc_06_empiles.mp4`). Petits mots blancs empilés à gauche à la hauteur du mot clé, devant le sujet ; mot clé et dernier mot en rouge, derrière la tête, avec contour permanent ; bloc en haut de la zone sûre (219 px), 330 px de haut au plus. Il remplace le mot géant seul avec sa petite ligne. Le dernier mot passe en grande partie derrière les cheveux : laisser de l'air au-dessus de la tête au tournage (`A_PREPARER.md`).
- **Son et sortie, en test (2026-11-03)** : le titre reste jusqu'à la fin du hook. Trois pistes rendues sur P1 puis le début de P2 : A riser de la charte (fin calée sur la fin du hook) + coupe sèche ; B un clic par morceau qui sort + retour sous les lignes (dans l'ordre inverse, fini à la coupe) ; C whoosh cinématique (pic au milieu de l'apparition) + flou. Fichiers `tests_video/titre_06_son-…_sortie-….mp4` ; les sons et les sorties se combinent librement (props `son` et `sortie` de `DA-TitreBloc`).
- **Choix (2026-11-03) : A, riser + coupe sèche** (`tests_video/titre_06_son-riser_sortie-coupe.mp4`). Le riser de la charte, sans gain, dont la fin tombe sur la fin du hook ; le titre reste jusqu'au bout de la phrase d'accroche et disparaît net avec la coupe.
- **Apparition : 01, « sort de derrière la tête »**. La petite ligne apparaît en 12 images en resserrant son espacement ; le mot géant monte d'une hauteur de capitales en 14 images à partir de l'image 6, et sort d'une ligne fixe placée sous sa ligne de base.
- **Son et sortie : riser + coupe sèche** (2026-11-03, voir le titre en bloc ci-dessous).
- **Pas de zoom pendant le hook** (2026-11-03) : le face cam reste à × 1 pendant la phrase d'accroche (l'ancienne charte : × 1,21), pour que la tête ne monte pas vers le titre. Les cadrages par phrase reprennent ensuite.

## Ombre portée

- **Titres et sous-titres auront une ombre portée** pour les détacher du fond (Michaël, 2026-11-03). Réglage en test : `drop-shadow(0 6px 18px rgba(0,0,0,.55))` (proposition).

## Sous-titres (2026-11-03, `planche_titres/soustitres.html`)

- **Police : Thunder LC**, blanche, dans la casse de ton template (majuscule au premier mot de la phrase), avec **ombre portée** (en test : `drop-shadow(0 4px 10px rgba(0,0,0,.6))`, proposition).
- **Groupes longs, en plus petit** : 70 px au lieu de 96 (proposition). Les groupes du montage sont fusionnés tant que la ligne tient dans la largeur (690 px, voir la hauteur ci-dessous). Une fin de phrase ou une pause de plus de 0,3 s coupe toujours. Les lignes sont équilibrées : pas de mot orphelin, et jamais de fin de ligne sur un petit mot de liaison.
- **Animation retenue : 09, « Montée mot par mot »**. Chaque mot monte d'une ligne fixe (sous les jambages) en 5 images au moment où il est dit, et les mots s'ajoutent jusqu'à former le groupe. La place de chaque mot est réservée dès le début du groupe, donc rien ne se décale. Chaque groupe reste jusqu'au suivant (0,5 s au plus après son dernier mot).
- **En option : 01, « Groupe entier, coupe sèche »**, avec les mêmes groupes longs.
- **Blancs partout**, y compris sur le fond rouge des séquences d'illustration, comme sur ton template de l'affiche.
- **Sur le fond rouge** (2026-11-03) : toujours mot par mot, mais **sans animation**. Chaque mot apparaît d'un coup quand il est dit, à sa place réservée, sans montée.
- **Hauteur standard réseaux sociaux** (2026-11-03) : une seule hauteur pour toutes les vidéos, sans tenir compte du t-shirt, calée sur la zone sûre TikTok/Reels (`CHARTE/02_design/DESIGN.md` §7). Le bloc est **calé par le bas à 1340 px** (bas de la zone sûre : 1365) et grandit vers le haut quand il y a deux lignes. Il est **centré sur 540 px et large de 690 px au plus** (195 à 885 px), pour ne pas passer sous la colonne des boutons à droite. Les groupes longs se remplissent donc jusqu'à 690 px au lieu de 820 (propositions). Bouton « Zone sûre » sur la planche pour le vérifier.

## Fin de vidéo

- **Choix (2026-11-03) : rien.** On garde la règle actuelle : pas de carte ni de signature, la vidéo s'arrête sur la fin de la dernière phrase, musique coupée net (`tests_video/fin_rien.mp4`).

- Aujourd'hui : pas de carte de fin, la vidéo s'arrête sur la dernière phrase, musique coupée net (`CHARTE/03_motion/MOTION.md`).
- Trois pistes rendues sur la dernière phrase de la vidéo 2 (composition `DA-FinVideo`, fichiers `tests_video/fin_*.mp4`) : **rien** (charte actuelle) ; **signature « LET'S GO »** en bloc comme le titre (« LET'S » blanc devant, « GO » rouge derrière la tête, chaque mot sort quand il est dit, tenue 1 s après la phrase) ; **carte rouge** avec « @MIKHA_DLM » en Anton noir flouté, posée comme un élément, 1 s, clic avant (propositions).

## Couverture

- **Michaël fait les couvertures lui-même** (2026-11-03) : le montage n'en produit pas. Les pistes ci-dessous restent comme repères.

- **Recadrage de la grille du profil Instagram** : la grille montre le centre de la couverture en 3:4 (1080 × 1440), soit 240 px coupés en haut et en bas (guides tiers de 2025-2026, pas de source officielle de Meta : à vérifier dans l'app, « Modifier la couverture »). Le titre de la vidéo, calé à 219 px, y est rogné : la couverture a sa propre mise en page.
- Quatre pistes : `planche_titres/couverture.html` (avec un aperçu du profil). Sur un fond rouge, les mots clés du titre passent en noir (le rouge disparaît sur le rouge).

## Identité sonore

- **On garde la palette actuelle** (2026-11-03) : riser sous le hook (fin calée sur la fin de la phrase), déclencheur avant l'élément posé sur le fond rouge, clic avant le retour en face cam, musique fournie par Michaël à ≈ 8,5 dB sous la voix et coupée net à la fin (`CHARTE/04_son/SON.md`). Whooshs et caisse toujours inutilisés. Texte en escalier : sans son par défaut (proposition, pas tranché).

## Séquences d'illustration

- **Le fond blanc disparaît** (2026-11-03) : les séquences d'illustration se font sur le **fond rouge grainé** `#F12F19` de tes templates (affiche posée avec ombre portée, panneau « SUR TOUT LE SITE »).
- **Grain fixe, choisi le 2026-11-03** (`tests_video/grain_fixe.mp4`, cadence 0). Détails : mesuré sur ton panneau (`Panneau_2.png`) : monochrome, écart-type ≈ 10,7 niveaux, grain d'un pixel, **sur le fond seulement** (l'affiche de `Panneau_1.png` n'en a pas). Reproduit par le calcul dans `remotion/src/da/FondRougeGrain.tsx` (composant `FondRouge`, composition `DA-FondRougeGrain`). Trois cadences rendues : fixe, 12 et 30 nouveaux grains par seconde (`tests_video/grain_*.mp4`). **Mesure importante :** après une recompression proche de celle d'Instagram (≈ 3,5 Mb/s), le grain fixe reste intact, le grain animé est presque effacé (finesse divisée par 2,6 à 12 i/s, par 4 à 30 i/s) et devient une bouillie.
- **Entrée et sortie du fond rouge : « Pose », choisie le 2026-11-03** (`tests_video/fond_rouge_pose.mp4`) : coupe sèche vers le rouge sur le premier mot de la phrase, l'élément se pose en 8 images (de 106 % à 100 %, en fondu, proposition), déclencheur 5 images avant ; sortie en coupe sèche avec un clic 3 images avant. Les quatre pistes testées : quatre passages rendus sur la vidéo 2 (fin de P1, P2 sur le rouge avec l'affiche, début de P3), composition `DA-EntreeFondRouge`, fichiers `tests_video/fond_rouge_*.mp4`. **Coupe** : coupe sèche, déclencheur avant l'affiche, clic avant la sortie (charte actuelle). **Pose** : pareil, mais l'affiche se pose en 8 images (de 106 % à 100 %, en fondu). **Volet** : le rouge monte comme une carte en 8 images et redescend à la sortie. **Pousse** : le rouge pousse le face cam vers le haut, et le face cam revient d'en haut à la sortie. Volet et pousse avec le whoosh cinématique, baissé (propositions).
- **Les éléments posés sur le fond rouge** (affiche, photo, produit, téléphone…) sont **entièrement visibles** (jamais coupés par le bord ni sortis de la zone sûre), **n'entrent jamais en conflit avec les sous-titres** (aucun recouvrement) et portent une **légère ombre portée**, comme l'affiche de ton template.
- **Mise en page, validée le 2026-11-03** : l'élément et son étiquette finissent **au-dessus de 1180 px**, ce qui laisse la place de deux lignes de sous-titres (bas à 1340) sans qu'ils se touchent. La photo produit 4:5 passe donc de 690 à 610 px de large.
- **Étiquettes (nom + précision) : style 02 « Blanc », choisi le 2026-11-03** (`planche_titres/etiquettes.html`). Centrées sous l'élément, à 56 px de son bas : nom en **Anton blanc** majuscules (capitales 62 px), précision en **Thunder blanc** (capitales 44 px, espacement 3 px) 22 px dessous ; ombre légère `drop-shadow(0 4px 10px rgba(0,0,0,.45))` (valeurs proposées). Les sous-titres restent masqués quand l'étiquette montre les mots dits (règle de la charte).

## Texte sur image d'illustration (références « create culture » et « escalier »)

- Ces compositions servent **sur les images d'illustration**, pas forcément pour le titre d'accroche.
- **Validé le 2026-11-03** : on l'utilisera **de temps en temps** dans les montages, sur des images d'illustration. Pas encore branché dans la composition `Montage` ni écrit dans la charte.
- **Retenu pour le test : la carte 06**. Chivo ExtraBold en minuscules, approche très serrée (−0,05 em), lignes « en escalier » de tailles et de retraits différents, les mots clés en grand. **En rouge `#F12F19`** (le crème de la référence est écarté), avec ombre portée.
- **Pas de caractères spéciaux** : pas de crochets, pas d'astérisque, pas de note de bas de page.
- **Apparition mot par mot.** En test : un mot toutes les 5 images à 24 i/s, chacun en fondu de 6 images (proposition).
- **Tout en minuscules**, noms propres compris (« halloween »).
- **Sur le fond rouge : noir flouté, comme le panneau** (choix 06, 2026-11-03, `planche_titres/rouge_sur_rouge.html`). Le texte en escalier passe en noir `#0d0d0d` avec le léger flou de ton panneau « SUR TOUT LE SITE » (en test : `blur(2.2px)` en 1080 × 1920, proposition), sans ombre. Sur une image d'illustration, il reste rouge.
- **Les mots ne doivent jamais se chevaucher ni se toucher.** L'interligne se calcule sur l'encre réelle de chaque ligne (accents, apostrophes, jambages), avec au moins 16 % du corps de la ligne suivante entre deux lignes (proposition).

## Fichiers

| Où | Quoi |
|---|---|
| `FICHE_TOURNAGE.md` | La fiche à relire avant chaque tournage |
| `planche_titres/index.html` | Les 8 pistes de titre |
| `planche_titres/piste02.html` | Lisibilité de la piste 02 (mesure de la part cachée par lettre) |
| `planche_titres/animations.html` | Les 8 apparitions (01, 06 et 08 retenues pour le test, 01 choisie) |
| `tests_video/` | Tests sur le rush de la vidéo 2 ; **le choix retenu est `titre_01_montee_contour.mp4`** |
| `remotion/src/da/TitreBloc.tsx` | Composition `DA-TitreBloc` (titre en bloc, 05 et 06) |
| `remotion/scripts/detourer.swift` | Détourage du sujet image par image (macOS Vision) |
| `remotion/src/da/TitreDerriere.tsx` | Composition `DA-TitreDerriere` |
| `planche_titres/petite_ligne.html` | Les 6 variantes de la petite ligne du titre |
| `planche_titres/titre_bloc.html` | Titre en bloc, d'après les références « Prospects » et « ideas and content » |
| `planche_titres/etiquettes.html` | Les 6 styles d'étiquette sur fond rouge |
| `planche_titres/rouge_sur_rouge.html` | Texte en escalier sur le fond rouge (6 couleurs) |
| `planche_titres/couverture.html` | Les 4 couvertures et l'aperçu du profil |
| `planche_titres/composition.html` | Tests de composition d'après les deux références |
| `remotion/src/da/TexteIllustration.tsx` | Composition `DA-TexteIllustration` (rendu : `tests_video/illustration_escalier_rouge.mp4`) |
