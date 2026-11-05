# JOURNAL D'APPRENTISSAGE

> **Rôle :** toutes les leçons des montages, dans l'ordre, avec leur destination et leur statut. **Lecteurs :** les agents (au début de chaque montage) et Michaël (validation des règles en attente).

Statuts : **appliquée** (dans la charte, le skill ou les outils) · **en attente** (à proposer ou à confirmer par Michaël) · **refusée**.

## 1. Règles en attente de validation

| # | Proposition | Origine | À confirmer par |
|---|---|---|---|
| A2 | Ombre du titre d'accroche : 5 px vers le bas, 7 px de flou, noir à 60 % (valeurs de l'agent, la VF montre une ombre sombre sans valeurs lisibles) | Montage automatique de la vidéo 1 | Michaël (utilisée sans remarque dans la vidéo 2, validée) |
| A3 | Ombre des photos produit : 12 px à droite, 16 px vers le bas, 40 px de flou, noir à 35 % | Estimée sur la VF | Michaël (utilisée sans remarque dans la vidéo 2, validée) |
| A4 | Couleur du curseur de la barre de recherche : rouge (asset v01), jaune (peu visible sur le verre blanc) ou noir | Passage au jaune | Michaël |
| A5 | Usage des whoosh et de la caisse enregistreuse | Non utilisés dans la VF | Michaël, quand l'occasion se présente |
| A6 | Rebonds dans les animations (goutte de la barre de recherche) : autorisés ailleurs ? | Asset barre de recherche | Michaël |
| A7 | Titre d'accroche en haut (bas à y = 540) quand le visage occupe la place habituelle ; que faire des sous-titres dans ce cas | Vidéo 3, visage bas dans le cadre | Michaël |
| A8 | Clic à l'entrée d'un asset sur fond blanc, pas de clic entre deux séquences blanches collées | Vidéo 3, lecture de `SON.md` | Michaël |
| A9 | Image carrée de petite définition : 640 px, sans agrandissement, étiquette dessous | Vidéo 3, affiche Space Jam | Michaël |
| A10 | **Ne jamais recadrer une affiche** : toujours entière (format natif, fond rouge ou blanc autour si besoin), avec l'étiquette lieu / date quand même (l'affiche entière est petite, retour v02 frame 772) | Vidéo 4, retour 6 sur la v01 (« elle perdait son sens ») | **Validée par Michaël le 2026-11-03 (« Ok règles ») : règle définitive (checklist, skill)** |
| A11 | Une illustration commence sur le mot qui **ouvre** l'idée (« il s'agit », « faire gagner », « développer »), pas sur le mot qui la nomme ; le texte en escalier démarre en même temps | Vidéo 4, retours 2 à 4 sur la v01 | Michaël |
| A12 | Le texte en escalier n'est pas systématique : une illustration peut rester sans texte, sous-titres de base gardés (`texte` avec `lignes: []`) | Vidéo 4, retour 5 sur la v01 | Michaël |
| A13 | **Aucune image isolée aux raccords** : une illustration qui commence (ou finit) à moins de 5 images d'une coupe est recalée sur la coupe ; contrôle automatique `detecter_frames_isolees.py` à chaque export | Vidéo 4, v02 frame 104 (« une frame parasite ») | **Validée par Michaël le 2026-11-03 (« Ok règles ») : règle définitive (checklist, skill)** |
| A14 | **Texte à l'écran calé sur la voix au mot près** : chaque mot du texte en escalier apparaît quand il est dit (fait par le montage) ; un mot écrit doit donc être le mot dit (« sorti », pas « sortie ») | Vidéo 4, v02 frame 154 | **Validée par Michaël le 2026-11-03 (« Ok règles ») : règle définitive (checklist, skill)** |
| A15 | **Phrases complètes à l'écran** : un texte reprend toute la phrase dite, sans sauter de mots (« des réductions qui vont de 5 à 15 % ») | Vidéo 4, v02 frame 234 | **Validée par Michaël le 2026-11-03 (« Ok règles ») : règle définitive (checklist, skill)** |
| A16 | **Niveau d'exigence de Michaël** : il regarde à l'image près (frame isolée, texte en avance de quelques images, mots manquants). Avant chaque livraison : planche image par image autour de chaque raccord et de chaque entrée de texte, pas seulement des images clés | Bilan des retours v01 et v02 de la vidéo 4 | **Validée par Michaël le 2026-11-03 (« Ok règles ») : règle définitive (checklist, skill)** |
| A17 | Clics à -4 dB sous le niveau du fichier, par défaut pour toutes les vidéos (`SON.md`, code : `sons.clicDb`, -4 par défaut) | Vidéo 4, retour v03 « baisse un peu le son des clics » | **Validée par Michaël le 2026-11-03 : règle définitive (SON.md, code)** |
| A18 | Un sous-titre dont tous les mots ont été dits sous le hook ou sous un texte en escalier ne réapparaît pas après (il revenait 2 à 6 images, « les frères » après le titre) ; une ligne de sous-titres coupe aussi à la fin de ces passages (fait dans le code, DA rouge) | Vidéo 5, contrôle image par image de la v01 | Michaël |

## 2. Leçons

| Date | Vidéo | Leçon | Source | Destination | Statut |
|---|---|---|---|---|---|
| 2026-09-29 | 1 | Transcrire morceau par morceau : d'un bloc, whisper perd les reprises | Premier essai | Outil `transcrire.py`, skill (pièges) | appliquée |
| 2026-09-29 | 1 | Musique à partir du point donné par Michaël (1:16), jamais pendant le riser : elle démarre après le hook | Retour v01 | Charte `SON.md` | appliquée |
| 2026-09-29 | 1 | Un écran reste affiché au moins jusqu'à la fin du mot qui le clôt | Retour v01 (« ouvertes ») | Charte `MOTION.md` | appliquée |
| 2026-09-29 | 1 | Un texte peut rester pendant les mots qui le suivent sans les écrire | Retour v01 (« pour nous ») | Charte `MOTION.md` | appliquée |
| 2026-09-29 | 1 | Sous-titres plus grands et plus bas que la v01 | Retour v01 | Remplacé par le style de la VF | appliquée puis remplacée |
| 2026-09-29 | 1 | Michaël veut pouvoir finir lui-même : face cam seul, EDL et SRT pour DaVinci | Demande | Outils `exporter_facecam.py`, `exporter_sous_titres.py` | appliquée |
| 2026-09-29 | 1 | Un sous-titre ne doit jamais durer une seule image : 4 images au moins | Analyse du SRT | Outils (SRT, montage) | appliquée |
| 2026-09-29 | — | Motion design : propositions d'abord, rien de produit avant son accord | Demande | Skill (`motion-design.md`) | appliquée |
| 2026-09-29 | — | Assets de motion design : fond transparent (ProRes 4444), sans texte | Demande | Charte `DESIGN.md`, skill | appliquée |
| 2026-09-29 | — | Téléphone qui monte du bas avec une petite rotation 3D, site qui s'allume dessus | Idée de Michaël | Asset `site-mobile` | appliquée |
| 2026-09-30 | 1 | Direction artistique de la VF : jaune `#FFB900`, fond blanc, Gilroy seule, hook en 3 lignes, un cadrage par phrase, clic, musique ≈ 8,5 dB sous la voix | VF de Michaël (`a_monter/1/ANALYSE_VF.md`) | Charte (toutes les sections) | appliquée |
| 2026-09-30 | 1 | Le jaune met en avant les mots importants du hook | Réponse de Michaël | Charte `DESIGN.md` | appliquée |
| 2026-09-30 | 1 | Sous-titres en Gilroy ExtraBold, incrustés ; nombres en chiffres | Réponse de Michaël, VF | Charte `SOUS-TITRES.md` | appliquée |
| 2026-09-30 | 1 | Pic vrai -1 dBTP au plus (la VF était à +0,6) | Réponse de Michaël | Charte `SON.md`, outil `controler_export.py` | appliquée |
| 2026-09-30 | 1 | Séquence du site sous la zone sûre : gardée « pour l'instant » | Réponse de Michaël | Charte `DESIGN.md` §7 (exception) | appliquée |
| 2026-09-30 | 1 | Vérifier que l'étiquette correspond au produit montré | Erreur « BOXY TEE » sur le Baby Tee (1re VF) | Charte (checklist), skill (pièges) | appliquée |
| 2026-09-30 | 1 | Le découpage automatique des sous-titres ne connaît pas le sens : relire les groupes, corriger avec « | » | Test du montage automatique | Outil `decouper_transcription.py`, skill | appliquée |
| 2026-09-30 | — | Un fichier utilisé par un projet DaVinci se copie, ne se déplace pas | Rangement de `a_ranger` | Skill (pièges) | appliquée |
| 2026-10-01 | 2 | Zoom progressif à partir d'environ 4 s, recadrage fixe en dessous ; fixe aussi pour une phrase coupée par le fond blanc | Plan de la vidéo 2 (« ok ») | Charte `MOTION.md` §4, skill (`plan-de-montage.md`) | appliquée |
| 2026-10-01 | 2 | Bruit de pièce à -40 dB : relever le seuil de silence à -36 dB | Transcription de la vidéo 2 | Skill (pièges) | appliquée |
| 2026-10-01 | 2 | Nom coupé par la reconnaissance (« Meo Miss Flag ») : notation « Mehomies[2] » | Découpage de la vidéo 2 | Outil `decouper_transcription.py`, skill | appliquée |
| 2026-10-01 | 2 | Rush remplacé après la transcription (son recalé de 4 images) : mesurer le décalage par corrélation et décaler les temps, sans retranscrire | Retour de Michaël | Skill (pièges) | appliquée |
| 2026-10-01 | 2 | L'encodage AAC fait remonter le pic vrai : plafond du limiteur baissé par paliers | Contrôle de la v01 | Outil `finaliser_son.py` | appliquée |
| 2026-10-01 | 2 | Les illustrations doivent être cohérentes avec ce qui est dit | Consigne de Michaël | Skill (`plan-de-montage.md`) | à proposer comme règle |
| 2026-10-01 | 2 | Un seul jaune `#FFB900` dans le titre d'accroche ; jaune pâle abandonné | Retour v01 (« le jaune plus clair, on peut l'oublier ») | Charte `DESIGN.md`, `tokens.json`, checklist ; skill | appliquée |
| 2026-10-01 | 2 | Chasser les hésitations que la reconnaissance efface (bouts redits, « euh », fin où l'on regarde ses notes, blanc entre deux phrases) : étape obligatoire | Retour v01 (« un point qu'il va falloir améliorer… pour les autres montages ») | Skill (étape 2, pièges), outils `reperer_hesitations.py`, `redecouper_morceau.py` | appliquée |
| 2026-10-01 | 2 | Chaque plan commence sur le premier mot et finit sur le dernier : le seuil de silence (-36 dB) laisse passer souffles et bruits faibles ; mesurer la voix franche (-27 dB) et les temps de mots alignés | Retour v02 (« des plans qui pourraient être coupés plus rapidement au début ou à la fin ») | Skill (étape 2, pièges), outil `reperer_hesitations.py` | appliquée |
| 2026-10-01 | 2 | Sous-titres en avance quand une prise commence par un souffle ou quand la reconnaissance a fusionné des prises : retranscrire la prise dès le premier mot | Retour v02 (« je ne peux pas » en avance) | Skill (pièges) | appliquée |
| 2026-10-01 | 2 | Défilé de visuels non nommés : même temps d'affichage pour chacun, déclencheur à -6 dB | Retour v02, confirmé comme règle (« ajoute les flashs et le rythme régulier à la charte ») | Charte `MOTION.md` §2, `SON.md`, `DESIGN.md` §4, checklist ; skill (`plan-de-montage.md`) | appliquée |
| 2026-10-01 | 2 | Ombre du titre d'accroche sous les sous-titres blancs quand la tenue est claire | v03 (« On garde l'ombre ») | Charte `SOUS-TITRES.md` | appliquée |
| 2026-10-01 | 2 | Type « photo » : affiche 16:9 + étiquette (date, lieu), détourés posés en entier dans le cadre, image 16:9 seule centrée | v03 validée | Outils, skill (`chaine-technique.md`) | appliquée |
| 2026-10-01 | 2 | Orthographe : « les reufs », « move », « Condition Publique », « Space Jam » | Réponses de Michaël | Charte `TON.md` | appliquée |
| 2026-11-02 | 3 | Regarder où tombe le visage sur le rush avant de fixer le titre : ici le titre habituel cachait la bouche | Image fixe avant rendu | Skill (pièges), règle A7 | en attente |
| 2026-11-02 | 3 | `site-mobile` date du 29/09 (« Précommandes disponibles », 33 €) : à refaire avant de le réutiliser | Vérification de l'aperçu | Skill (pièges) | appliquée |
| 2026-11-02 | 3 | Rush HDR ou 24 i/s : `preparer_medias.py` copie l'image telle quelle, donc préparer d'abord un rush SDR 1080 × 1920, 30 i/s | Vidéo 3 | Skill (pièges) | appliquée |
| 2026-11-02 | 3 | Un sous-titre masqué pouvait revenir 3 images après la fin du masque | Planche d'images clés | Outil (`donnees.ts`) | appliquée |
| 2026-11-02 | 3 | ffmpeg récent n'accepte plus `-vsync` | Contrôle de la couleur en erreur | Outil `controler_export.py` | appliquée |
| 2026-11-05 | 5 | Rush converti HLG → SDR : ffmpeg (swscale) recopie les étiquettes couleur de l'entrée (bt2020 / HLG) malgré `-color_*` ; le navigateur du rendu lit alors l'image en HDR (visage rouge, écart 46/255). Réétiqueter sans réencoder (`h264_metadata`) et vérifier avec `ffprobe` | Contrôle de la couleur | Skill (pièges) | appliquée |
| 2026-11-05 | 5 | Sous-titre du hook ou d'un texte en escalier qui réapparaît après le masque | Planche image par image | Outil (`MontageFacecam.tsx`, `grouperLong`), règle A18 | en attente |
| 2026-11-05 | 5 | Produits sur fond blanc pur (photos du site) posés sur le rouge : les détourer. Le masque de Vision (macOS) laisse un bord flou et un halo ; un détourage par le fond blanc relié au bord, bord de 2 px décontaminé, est net | Retour v01 (« détourer les T-shirts ») | Outil `detourer_fond_blanc.py` | appliquée |

## 3. Bilan par vidéo

- **Vidéo 5 (annonce Space Jam, DA rouge)** : v01 le 2026-11-05 (20,5 s), plan de coupe de Michaël, affiche de la vidéo 4, stock t-shirts. v02 : t-shirts détourés (retour v01).
- **Vidéo 4 (Fakhomies, DA rouge pilote)** : validée en v04 le 2026-11-03 après 3 tours (v01 placement des illustrations, v02 retours à l'image, v03 clics). Leçon : Michaël juge à l'image près (règles A13 à A16).

| Vidéo | Versions | Retours de Michaël | Règles acceptées | Remarque |
|---|---|---|---|---|
| 1 (fin des précommandes) | v01, v02 (agent), VF (Michaël) | 6 sur la v01 | 5 | Michaël a trouvé la direction artistique en montant lui-même |
| 2 (annonce du pop-up) | plan, v01, v02, v03 (agent, **v03 validée**) | 10 sur le plan, 9 sur la v01, 6 sur la v02 | 5 (cadrages, un seul jaune, chasse aux hésitations, plans coupés au mot, défilé régulier) | Premier montage complet par le skill ; rush remplacé en cours ; 45,9 → 33,3 → 31,7 s ; v02 « beaucoup mieux » |
| 3 (jeu, restock, pop-up) | sous-titres v01, v02, complet v01 (test, musique provisoire) | en attente | 0 | Montée sans validation du plan pour tester le skill à distance ; 30,1 → 18,3 s |

## 4. Évolutions du skill et des outils

| Date | Changement | Pourquoi |
|---|---|---|
| 2026-09-30 | Création du skill `montage-facecam` ; composition générique `Montage` pilotée par `plan.json` ; composants du style de la VF ; scripts `transcrire.py`, `controler_export.py`, `apercu_telephone.py`, `apercu_asset.py` ; banque de motion design et ce journal | Demande de Michaël : monter entièrement les vidéos face cam, apprendre à chaque montage, proposer du motion design et le garder en banque |
| 2026-09-30 | Test : la vidéo 1 remontée automatiquement d'après sa VF ; rendu conforme au contrôle technique et très proche de la VF (seul écart : quelques groupes de sous-titres) | Vérifier le skill sur une vraie vidéo |
| 2026-10-01 | Type de séquence « photo » (sans étiquette, 4:5 ou 16:9, détourés), option `sousTitres.ombreSurFacecam`, notation « [n] » du texte relu, plafond par paliers dans `finaliser_son.py` | Vidéo 2 |
| 2026-10-01 | `reperer_hesitations.py` (bouts entre micro-pauses retranscrits seuls) et `redecouper_morceau.py` (sous-morceaux, lus par `decouper_transcription.py`) ; étiquette facultative du type « photo » et réduction automatique des étiquettes trop larges | Retours de Michaël sur la v01 de la vidéo 2 |
| 2026-10-01 | Type « photo » : options `regulier` et `declencheurDb` ; `reperer_hesitations.py` signale les débuts lents et les fins qui traînent | Retours de Michaël sur la v02 de la vidéo 2 |
| 2026-10-01 | Passe d'ensemble du skill après la vidéo 2 : principe « le rythme avant tout » ; étape 1 (rush définitif ? étalonné et synchronisé) ; étape 2 réécrite en 6 temps (transcription, choix, texte relu, chasse aux hésitations, règles de coupe, découpage) ; contrôle des sous-titres sur la tenue ; corriger la cause et chercher le même défaut ailleurs ; résumé du style à jour (un seul jaune, ombre si tenue claire, affiche, défilé) ; pièges « échanges avec Michaël » ; modèles `choix.json` et `PLAN_MONTAGE.md` ; règles de cohérence des illustrations | Question de Michaël : « est-ce qu'il ne faudrait pas remettre à jour le skill ? » |
| 2026-11-02 | `accroche.bas`, `partenaire` avec `nom` et `precision` sans étiquette image, `motion.departImage`, `photo` au format `1:1`, clic d'entrée des assets sur fond blanc, pas de clic entre séquences collées, masque étendu au groupe en cours ; `controler_export.py` : `-fps_mode` | Vidéo 3 |
| 2026-11-03 | DA rouge : séquence `texte` avec `lignes: []` (illustration plein cadre sans texte, sous-titres de base gardés) | Vidéo 4, retours sur la v01 |
| 2026-11-03 | Bords des séquences recalés sur la coupe voisine (< 5 images) ; texte en escalier calé mot par mot sur la voix ; script `detecter_frames_isolees.py` | Vidéo 4, retours à l'image sur la v02 |
