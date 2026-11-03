# Chaîne technique : commandes, formats, extension

Toutes les commandes se lancent depuis `MONTAGE/remotion/`. `<N>` = numéro de la vidéo
(`a_monter/<N>/`), `v<N>` = son identifiant dans Remotion (`public/v<N>/`).

## Sommaire
1. Prérequis
2. Dossier d'une vidéo
3. Commandes, dans l'ordre
4. `choix.json`
5. `plan.json`
6. Ce que la composition `Montage` fait toute seule
7. Étendre le montage
8. Assets de motion design
9. Exports pour DaVinci
10. Dépannage

## 1. Prérequis

| Outil | Où | Usage |
|---|---|---|
| ffmpeg / ffprobe | Homebrew | Son, vidéo, mesures |
| whisper-cli + modèle `~/.cache/whisper-cpp/ggml-large-v3-turbo.bin` | Homebrew / cache | Transcription (français) |
| Node + Remotion 4.0.530 | `remotion/node_modules` | Montage et rendu |
| Python 3 + Pillow | système | Scripts |

## 2. Dossier d'une vidéo

```
a_monter/<N>/
├── <rush>.mp4                 livré par Michaël, déjà étalonné (ne jamais retoucher la couleur)
├── assets/                    images, vidéos, musique livrées avec la vidéo
├── BRIEF.md                   d'après CHARTE/09_templates/BRIEF_VIDEO.md
├── TRANSCRIPTION.md           morceaux, décisions, corrections, texte retenu
├── transcription/
│   ├── brut/                  sortie de transcrire.py (morceaux.json, morceaux/cNN.json)
│   ├── choix.json             prises gardées et texte relu (écrit par l'agent, validé)
│   └── decoupage.json, mots_montage.json, sous-titres.json, mots_rush.json   (générés)
├── PLAN_MONTAGE.md            plan à faire valider
├── plan.json                  traduction du plan validé, lue par le montage
├── RETOURS.md                 retours de Michaël, version par version
├── CHECKLIST_VALIDATION.md    contrôles de la version livrée
└── export/                    <nom>_v01.mp4, aperçus, exports DaVinci
```

## 3. Commandes, dans l'ordre

| Étape | Commande | Produit |
|---|---|---|
| Transcription | `python3 scripts/transcrire.py ../a_monter/<N>` | `transcription/brut/` + tableau des morceaux |
| Hésitations | `python3 scripts/reperer_hesitations.py ../a_monter/<N> [--phrases P3,P5]` | bouts de chaque prise gardée, répétitions, « euh », mots longs, blancs (rien n'est coupé) |
| Sous-morceau | `python3 scripts/redecouper_morceau.py ../a_monter/<N> <morceau> <débutS> [<finS>] [--id c11b]` | partie propre d'un morceau, retranscrite seule (`brut/sous-morceaux.json`) |
| Découpage | `python3 scripts/decouper_transcription.py ../a_monter/<N>` | segments, mots, groupes de sous-titres (affichés) |
| Médias | `python3 scripts/preparer_medias.py ../a_monter/<N> v<N>` | `public/v<N>/` : rush (voix à -14 LUFS, image copiée), musique, images, vidéos, JSON |
| Données seules | `python3 scripts/preparer_medias.py ../a_monter/<N> v<N> --donnees` | recopie des JSON après une retouche de `plan.json` ou du découpage |
| Image fixe | `npx remotion still Montage /tmp/…/f.png --frame=<n> --props='{"video":"v<N>"}'` | contrôle d'une image |
| Aperçu interactif | `npm run dev` (Remotion Studio, composition `Montage`, propriété `video`) | |
| Rendu | `npx remotion render Montage ../a_monter/<N>/export/<nom>_v01.mp4 --props='{"video":"v<N>"}'` | MP4 1080×1920, 30 i/s, H.264, BT.709 |
| Son final | `python3 scripts/finaliser_son.py <export>` | pic vrai ramené à -1 dBTP si besoin (image copiée) |
| Contrôle | `python3 scripts/controler_export.py <export> --rush ../a_monter/<N>/<rush> --image-montage <n> --image-rush <m>` | OK / À CORRIGER par critère |
| Téléphone | `python3 scripts/apercu_telephone.py <export>` | copie de moins de 29 Mo |

`--image-montage` / `--image-rush` : le même instant dans le montage et dans le rush, sur un plan à
× 1 sans texte ni séquence (temps rush = `sourceDebutFrame` du segment + écart dans le segment).

## 4. `choix.json`

Écrit par l'agent après la transcription, validé avec le plan. Modèle : `modeles/choix.json`.

| Champ | Rôle |
|---|---|
| `rush`, `fps` | Nom du fichier rush, 30 |
| `margeS` | Son gardé avant et après chaque passage : **0,08 s** (validé) |
| `silence` | `{ "seuilDb": -40, "dureeMinS": 0.3 }` (mêmes réglages que `transcrire.py`) |
| `sousTitres` | `{ police: "CHARTE/07_typographies/Gilroy/Gilroy-ExtraBold.ttf", taillePx: 75, largeurMaxPx: 880, motsMax: 3 }` : sert au découpage en groupes |
| `musique` | `{ fichier: "assets/…", debutDansLaPisteS: <s>, niveauLufs: -22.7 }` ; point de départ donné par Michaël |
| `phrases` | `[{ id: "P1", morceaux: ["c01"], texte: "…" }]` dans l'ordre du montage |
| `phrases[].garderApresMot` + `debutForceS` | Deux prises dans un même morceau : on garde ce qui suit le mot indiqué, à partir de l'attaque mesurée sur le son (exemple : P1 de la vidéo 1) |
| `coupes` | `{ "c00": "bruit", "c02": "faux départ", "c01-debut": "1re prise" }` : raison de chaque passage coupé ; avec un sous-morceau, `"c11-debut"` / `"c11-fin"` = ce qui reste hors de `c11b` |
| Sous-morceau (`c11b`) | Dans `morceaux` à la place du morceau : seule la partie propre est gardée, avec des temps de mots justes (mieux que `garderApresMot` quand la reconnaissance a fusionné des prises). Créé par `redecouper_morceau.py` |

**Texte relu :** il doit avoir **autant de mots** que la reconnaissance (sinon le découpage s'arrête et
affiche les deux listes). Il fixe l'orthographe et la casse des sous-titres. Nombres en chiffres.
Un « | » isolé force une coupure de sous-titres (il n'est pas affiché). Un « [n] » collé à un mot
(« Mehomies[2] Flag ») indique qu'il couvre n mots reconnus, quand la reconnaissance a coupé un nom
(« Meo Miss Flag ») ; il n'est pas affiché.

## 5. `plan.json`

Lu par la composition `Montage`. Exemple complet : `a_monter/1/plan.json`. Modèle : `modeles/plan.json`.

**Ancres** (moments de la parole) : `"P3"` = la phrase P3 ; `"P3:Avec"` = le mot « Avec » de P3 ;
`"P8:avec:2"` = le 2e « avec » de P8 (majuscules et ponctuation ignorées). En `de`, l'ancre donne un
début (de la phrase ou du mot) ; en `a`, une fin (de la phrase ou du mot).

```json
{
 "accroche": { "phrase": "P1", "lignes": [
   { "texte": "DERNIÈRE CHANCE", "couleur": "jaunePale" },
   { "texte": "POUR COMMANDER", "couleur": "blanc" },
   { "texte": "TON TEE", "couleur": "jaune" } ] },
 "cadrages": [ { "phrase": "P1", "zoom": 1.21 }, { "phrase": "P2", "zoom": [1, 1.2] } ],
 "sequences": [ … ],
 "sousTitres": { "masquer": [["P7:sur", "P7:mehomies.com"]] }
}
```

| Champ | Valeurs |
|---|---|
| `accroche.lignes[].couleur` | `jaune`, `blanc` (`jaunePale` abandonné le 2026-10-01, gardé pour la vidéo 1) |
| `cadrages[].zoom` | un nombre (fixe) ou `[départ, arrivée]` (progressif, linéaire sur la phrase) ; phrase absente = × 1 |
| `accroche.bas` | bas du titre en px (1 328 par défaut), si le visage occupe la place habituelle (vidéo 3 : 540, proposition) |
| `sousTitres.masquer` | paires `[de, a]` : sous-titres cachés pendant ce passage |
| `sousTitres.ombreSurFacecam` | `true` : ombre du titre d'accroche sous les sous-titres blancs (tenue claire, vidéo 2 ; proposition, journal A7) |

**Séquences** (fond blanc plein cadre, sauf `motion` sur le face cam) :

| `type` | Champs | Rendu |
|---|---|---|
| `partenaire` | `de`, `a`, `etiquette` (chemin dans `public/`, ex. `charte/partenaires/partenaire_bag_etiquette-texte-noir_v01.png`), `video` ou `image` (dans `public/v<N>/`, ex. `videos/version-fr-en.mp4`), `videoDebutS` ; `nom` et `precision` à la place d'`etiquette` pour une étiquette texte (`etiquette` devient facultative) | Vidéo 16:9 sans son en haut, étiquette dessous |
| `site` | `de`, `a` | Téléphone animé et barre de recherche (assets de la banque), placés comme dans la VF |
| `produit` | `de`, `a`, `photos: [{ fichier, de?, nom, precision? }]` | Une photo arrondie à la fois (changement sur l'ancre `de` de la photo suivante), étiquette nom / précision |
| `photo` | `de`, `a`, `format` (`4:5` par défaut, `16:9`, ou `1:1` : image carrée à 640 px sans agrandissement, étiquette dessous), `regulier?` (photos à intervalles égaux, ancres `de` ignorées), `declencheurDb?` (ex. -6 pour une rafale), `photos: [{ fichier, de?, detoure?, nom?, precision? }]` | Photos une à la fois, étiquette facultative ; 4:5 dans le cadre arrondi (`detoure: true` : produit détouré posé en entier, sur blanc) ; 16:9 à la place de la vidéo partenaire avec étiquette dessous (ex. date et lieu sous une affiche), ou centrée à y = 525 sans étiquette ; sous-titres noirs (les masquer avec `sousTitres.masquer` si l'étiquette dit l'essentiel) ; déclencheur avant chaque photo (vidéo 2, journal A8) |
| `motion` | `de`, `a`, `asset` (identifiant de `src/motion/registre.ts`), `fond` (`blanc` par défaut, ou `facecam`), `decalageY`, `departImage` (image de l'asset où commencer) | Asset de la banque joué jusqu'au bout puis figé |

Les images d'`assets/` arrivent dans `public/v<N>/images/` sous un nom simplifié (minuscules, tirets,
sans « avec arrière-plan supprimé ») : le script les affiche.

### DA rouge (en test depuis le 2026-11-03, `"da": "rouge"`)

La nouvelle direction artistique (`DA MIKHA/DECISIONS.md`) n'est **pas encore dans la charte** : elle
ne sert que pour une vidéo dont `plan.json` porte `"da": "rouge"` (d'abord la vidéo pilote, sur demande
de Michaël). Sans ce champ, la vidéo garde la charte jaune : les vidéos 1, 2 et 3 ne changent pas.
Composants : `remotion/src/da/rouge/` ; valeurs : `src/da/rouge/tokens.ts`.

```json
{
 "da": "rouge",
 "accroche": { "phrase": "P1",
   "titre": { "avant": ["LE", "PREMIER"], "cle": "POP-UP", "apres": "MEHOMIES" } },
 "cadrages": [ … ], "sequences": [ … ], "sousTitres": { "masquer": [ … ] }
}
```

| Champ | Rôle |
|---|---|
| `accroche.titre` | Titre en bloc (composition 06) : `avant` = 1 à 3 petits mots blancs empilés à gauche, `cle` = mot clé rouge, `apres` = dernier mot rouge sur toute la largeur (facultatif). Remplace `accroche.lignes` |
| `accroche.derriere` | `false` : tout le titre passe devant (repli si le détourage rate : tête trop haute, plan trop serré) ; sinon les mots rouges passent derrière le sujet, avec un contour permanent de 3 px |
| `cadrages` | Le cadrage de la phrase d'accroche est ignoré : le hook reste à × 1 |
| séquence `texte` | `de`, `a`, `lignes: [{ texte, largeur, gauche }]` (largeur et retrait en part de 1080), `image?` / `video?` + `videoDebutS?` (plein cadre). Texte en escalier, Chivo 800 minuscule serrée, mot par mot ; noir flouté sur le fond rouge, rouge sur une image. Sans caractères spéciaux. Sous-titres masqués pendant la séquence ; `lignes: []` = image ou vidéo seule, sous-titres de base gardés (vidéo 4) |

Rendu, tout seul :
- **Hook :** le bloc monte morceau par morceau (un toutes les 4 images, en 12) ; images détourées
  `public/v<N>/sujet/NNNN.png`, faites par `preparer_medias.py` (relancer seul :
  `python3 scripts/preparer_medias.py ../a_monter/<N> v<N> --detourage`, après un changement de prise
  du hook). Vérifier les bords (cheveux, mains) sur 2 ou 3 images. Riser et coupe sèche comme avant.
- **Sous-titres :** Thunder blanc 70 px avec ombre, groupes longs sur une ligne de 690 px au plus
  (coupés à chaque phrase et à chaque pause de plus de 0,3 s, jamais finis sur un mot de liaison),
  bas à 1 340 px ; chaque mot monte quand il est dit sur le face cam, apparaît d'un coup sur le rouge ;
  masqués pendant le hook, `produit`, `texte` et `masquer`.
- **Séquences :** fond rouge grainé (grain fixe) à la place du blanc ; images à angles droits avec
  ombre, posées (« Pose » : 106 % → 100 % en fondu, 8 images) ; 16:9 à 888 × 500, 4:5 à 610 × 762,
  1:1 à 640 ; étiquette nom (Anton blanc) / précision (Thunder blanc) à 56 px sous l'élément ; tout
  finit au-dessus de 1 180 px. Mêmes bruitages qu'avant (déclencheur avant chaque élément, clic à la
  sortie ; clic à l'entrée d'un `texte`).
- **À vérifier au pilote (non réglé) :** assets de motion design et `site` (pensés pour le blanc,
  gardés tels quels sur le rouge) ; étiquettes PNG des partenaires (noires, réduites sous la vidéo) ;
  sous-titres pendant `site` (hauteur standard, sous le téléphone).
- **Export SRT :** `exporter_sous_titres.py` reprend les groupes longs quand le plan est en DA rouge.
- **Polices :** `DA MIKHA/polices/` (copiées par `preparer_medias.py`). **Thunder : licence
  « personal use only » dans le fichier, licence commerciale [À COMPLÉTER]** (`DA MIKHA/polices/README.md`).

## 6. Ce que la composition `Montage` fait toute seule

- Face cam : segments du découpage, fondu de 2 images sur la voix à chaque coupe, cadrage par phrase.
- Hook : titre d'accroche pendant toute la phrase `accroche.phrase` ; riser dont la fin tombe avec
  la fin de cette phrase ; musique qui démarre juste après, jusqu'à la dernière image.
- Sous-titres : groupes de `mots_montage.json`, chacun au moins 4 images, jusqu'au groupe suivant ou
  0,5 s après son dernier mot ; masqués pendant le hook, les séquences `produit` et les passages
  `masquer` ; blancs sur le face cam, noirs sur fond blanc (y compris `photo`), plus bas pendant la
  séquence `site`.
- Bruitages : clic dont le son tombe 3 images avant l'entrée d'une séquence `partenaire` ou `motion`
  sur fond blanc et avant la sortie de chaque séquence sur fond blanc (pas entre deux séquences collées) ; déclencheur 5 images avant chaque photo (`produit` et
  `photo`) ; l'asset du
  site apporte son propre déclencheur.

Les valeurs (tailles, positions, niveaux) sont dans `remotion/src/charte/tokens.ts`, reprises de la
charte. Si la charte change, mettre à jour ce fichier.

## 7. Étendre le montage

- **Nouvel asset de la banque :** composant dans `src/motion/`, durée exportée, une ligne dans
  `src/motion/registre.ts` ; il est alors utilisable avec une séquence `motion`.
- **Nouveau type de séquence** (une mise en page que Michaël valide et qui reviendra) : type dans
  `src/montage/donnees.ts` (`SequencePlan`), rendu et règles de son dans
  `src/montage/MontageFacecam.tsx`, composant dans `src/charte/`. Puis `npx tsc --noEmit`,
  `npx eslint src`, une image fixe de contrôle, et documenter le type ici et dans la charte.
- Ne pas écrire de montage à la main par vidéo : le plan doit rester la seule chose propre à une vidéo.

## 8. Assets de motion design

- Rendu transparent : `npx remotion render <Id> ../motion_design/<dossier>/export/<id>_v01.mov --config=remotion.asset.config.ts`
  (ProRes 4444 avec couche alpha ; `remotion.config.ts` impose un CRF incompatible avec ProRes).
- Aperçu pour la banque : `python3 scripts/apercu_asset.py ../motion_design/<dossier>/export/<id>_v01.mov`.
- Captures d'un site en version mobile (390 × 844 points, densité 3) : `node scripts/capturer_site.mjs ../motion_design/site_mobile`
  (avec `TMPDIR` dans le dossier temporaire de la session si le bac à sable bloque le profil Chrome).

## 9. Exports pour DaVinci

| Commande | Produit |
|---|---|
| `python3 scripts/exporter_facecam.py ../a_monter/<N> v<N>` | `export/<nom>_facecam-voix.mp4` (coupes, voix seule) et `export/<nom>_derushage.edl` (coupes sur le rush d'origine) |
| `python3 scripts/exporter_sous_titres.py ../a_monter/<N>` | `export/<nom>_sous-titres_par-groupe.srt` et `_mot-a-mot.srt` |

Dans DaVinci : Fichier > Importer > Sous-titre, glisser le SRT au tout début de la timeline ; les
sous-titres ne sont dans l'export que si l'incrustation est activée dans Deliver.

## 10. Dépannage

| Message ou symptôme | Cause | Remède |
|---|---|---|
| `P… : n mots reconnus pour m mots relus` | Le texte relu n'a pas le même nombre de mots | Aligner le texte relu sur les mots reconnus affichés (un mot relu par mot reconnu) |
| `Mot introuvable pour l'ancre « … »` | Mot absent de la phrase ou mal écrit | Chercher le mot exact dans `transcription/mots_montage.json` (champ `texte`) |
| `Phrase introuvable dans le découpage` | Identifiant de phrase erroné | Identifiants de `choix.json` |
| Erreur de chargement de police | Police absente de `public/charte/polices` | Relancer `preparer_medias.py` (il copie `CHARTE/07_typographies`) |
| Pic vrai au-dessus de -1 dBTP | Bruitages ou musique sur la voix limitée | `finaliser_son.py` (baisse le plafond par paliers de 0,5 dB si l'AAC fait remonter le pic) |
| Rendu ProRes refusé (« does not support the --crf option ») | Configuration H.264 par défaut | `--config=remotion.asset.config.ts` |
