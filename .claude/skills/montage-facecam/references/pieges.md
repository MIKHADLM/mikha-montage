# Pièges connus

À parcourir avant la fabrication. Chaque nouveau piège rencontré s'ajoute ici.

## Transcription
- **Hésitations effacées par la reconnaissance** (vidéo 2, 12 s sur 46 s) : « Passer du… passer du
  virtuel… passer du virtuel au physique » transcrit une seule fois, « Dans tous les cas » redit,
  « Parce que forcément » doublé. Signes : prise bien plus longue que le débit de Michaël (≈ 7 à 8
  syllabes par seconde), mots de plus de 0,6 s, mots aux temps collés. Toujours
  `reperer_hesitations.py`, puis `redecouper_morceau.py`. Les petites fenêtres de transcription
  inventent des fins de phrase : se fier aux bouts entre micro-pauses et à l'énergie du son.
- **Souffle ou blanc en bout de prise** (vidéo 2) : le seuil de -36 dB laisse passer un souffle
  (≈ -30 dB) avant le premier mot et de petits bruits après le dernier (jusqu'à 0,6 s de blanc gardé).
  Mesurer la voix franche (-27 dB) et l'alignement mot par mot (`whisper-cli --dtw large.v3.turbo
  -nfa`) ; attention aux fins en « s » ou « f », plus faibles.
- **Sous-titres en avance** : quand une prise commence par un souffle, ou quand la reconnaissance a
  fusionné deux prises, les temps de mots d'origine sont faux (P4 de la vidéo 2 : 0,4 s d'avance).
  Retranscrire la prise dès le premier mot (`redecouper_morceau.py`).
- **Rush transcrit d'un bloc :** whisper saute les reprises. Toujours `transcrire.py` (morceau par
  morceau).
- **Phrases inventées sur du bruit** (« Merci d'avoir regardé », « Sous-titrage Société
  Radio-Canada », « *sad music* ») : marquées « suspect » ; couper le morceau après vérification.
- **Deux prises dans un même morceau :** ne garder que la seconde avec `redecouper_morceau.py`
  (attaque mesurée sur le son) ; l'ancienne façon (`garderApresMot` + `debutForceS`, vidéo 1) garde
  des temps de mots faux quand la reconnaissance a fusionné les deux prises.
- **Noms propres mal reconnus** (« Mehomiz », « meomis.com ») : corrigés dans le texte relu, jamais
  affichés tels quels. Un nom coupé en plusieurs mots (« Meo Miss Flag ») : « Mehomies[2] Flag ».
- **Bruit de la pièce proche du seuil de silence** (vidéo 2 : ≈ -40 dB) : les morceaux finissent
  bien après le dernier mot (jusqu'à 2 s de blanc gardé). Comparer la fin de chaque morceau au temps
  de son dernier mot ; si l'écart dépasse 0,3 s, relancer `transcrire.py --seuil -36` et noter le
  seuil dans `choix.json`.
- **Rush remplacé après la transcription** (étalonnage, son recalé dans DaVinci, vidéo 2) : mesurer
  le décalage entre l'ancien et le nouveau son par corrélation (sur plusieurs passages), vérifier
  que l'image n'a pas bougé, puis décaler `start`, `end`, `offset` de `brut/morceaux.json` et les
  `debutForceS` de `choix.json`. Garder l'ancienne transcription à côté.

## Montage
- **Couper pendant un mot :** une séquence reste jusqu'à la fin du mot qui la clôt (retour de
  Michaël sur la v01 de la vidéo 1).
- **Musique pendant le riser :** interdit ; elle démarre après le hook.
- **Groupes de sous-titres qui cassent le sens :** relire la liste du découpage, corriger avec « | ».
- **Étiquette qui ne correspond pas au produit montré :** vérifier chaque photo.
- **Sous-titre qui ne dure qu'une image** dans les passages rapides : réglé par la durée minimale
  de 4 images ; ne pas la baisser.
- **Montage écrit à la main par vidéo :** non ; tout passe par `plan.json`, les manques deviennent
  des composants réutilisables.

## Son
- **Pic vrai au-dessus de -1 dBTP** quand des bruitages s'ajoutent à la voix limitée : toujours
  `finaliser_son.py` puis `controler_export.py`. L'encodage AAC fait remonter le pic vrai (vidéo 2 :
  -0,8 avec un plafond à -2 dBFS) : l'outil baisse alors le plafond par paliers.
- **Son en retard de 42,7 ms sur l'image** (vidéos 4 et 5, trouvé le 2026-11-06 grâce à earshot) :
  tout le son d'un MP4 rendu par Remotion (voix, clics, musique) arrive 2048 échantillons après
  l'image ; l'AAC passe par un flux ADTS (`compress-audio.js`, `-f adts`) qui perd le délai
  d'amorçage de l'encodeur (3072 échantillons réels, 1024 annoncés dans le MP4). Parade : toujours
  `scripts/rendre.py` ; `verifier_livraison.py` mesure le décalage son ↔ rush à chaque export.
- **Bruitages mal calés :** le son d'un fichier ne commence pas à 0 (clic 0,08 s, déclencheur
  0,23 s) ; la composition `Montage` en tient compte.

## Image et mise en page
- **Rush HDR ou hors format** (vidéo 3 : HEVC HLG 24 i/s) : `preparer_medias.py` copie l'image sans la convertir. Préparer d'abord un rush SDR 1080 × 1920, 30 i/s, le nommer dans `choix.json`, et le signaler : c'est une conversion, pas un étalonnage de Michaël.
- **Étiquettes couleur héritées** (vidéo 5) : la conversion HLG → SDR par `scale` (zscale absent de ffmpeg sur le Mac serveur) garde les étiquettes bt2020 / arib-std-b67 malgré `-color_primaries bt709…` ; Remotion lit alors le rush en HDR (visage rouge). Après conversion : `ffprobe` des étiquettes, puis `ffmpeg -i x.mp4 -c copy -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1`. Commande de conversion : `scale=1080:1920:flags=lanczos:in_color_matrix=bt2020:in_range=tv,format=gbrpf32le,lut3d=<lut>,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p`.
- **Couleur du rush :** jamais retouchée ; le rush est copié sans réencodage, le contrôle compare
  une image du montage et du rush.
- **Affiche recadrée** (vidéo 4 : affiche Instagram 1:1 recadrée, elle « perdait son sens ») : demander ou utiliser le fichier d'origine et l'afficher entière dans son format (`photo` `4:5`, `16:9` ou `1:1` selon son ratio).
- **Zone sûre :** sous y = 1 088, rien au-delà de x = 885 ; bas à 1 365. Exception acceptée : barre
  de recherche et sous-titres de la séquence du site.
- **Texte jaune sur fond blanc :** illisible (contraste 1,7:1) ; le jaune reste sur le face cam.
- **Tenue claire sous les sous-titres blancs** (vidéo 2) : illisibles sans ombre ; regarder une
  image de sous-titre avant le rendu ; règle de la charte (`SOUS-TITRES.md`) :
  `sousTitres.ombreSurFacecam`. Le titre d'accroche tombe aussi sur la tenue : maquette dans le plan.
- **Visage bas dans le cadre** (vidéo 3) : le titre d'accroche habituel cache la bouche, le zoom × 1,21 aggrave. Regarder une image du hook avant le rendu ; `accroche.bas` place le titre plus haut (position à valider, journal A7). Les sous-titres tombent aussi sur le bas du visage : le signaler.
- **Asset daté** (vidéo 3) : `site-mobile` montre « Précommandes disponibles » et 33 € ; vérifier son aperçu avant de l'utiliser, le refaire si le site a changé.
- **Police absente de `public/` :** toutes les compositions échouent ; relancer `preparer_medias.py`.

## Échanges avec Michaël
- **Retours dictés à la voix** : mots déformés (« 23 petits retours » pour « 2-3 », « le jeune plus
  clair » pour « le jaune »). Comprendre, et dire comment on a compris.
- **Réponse courte et ambiguë** (« Seulement l'affiche », « on la met dès le début ») : choisir
  l'interprétation la plus probable, l'écrire dans `RETOURS.md` comme « interprétation à confirmer »
  et la signaler dans la réponse, plutôt que bloquer.
- **Repères de temps** : ceux de la version qu'il a regardée ; les retrouver dans la copie du
  découpage de cette version, pas dans le découpage en cours.

## Livraison et DaVinci
- **Envoi sur le téléphone :** 30 Mo au plus ; `apercu_telephone.py`.
- **Sous-titres d'un SRT dans DaVinci :** absents de l'export si l'incrustation n'est pas activée
  dans Deliver (arrivé sur la VF).
- **Déplacer un fichier utilisé par un projet DaVinci** casse le lien : copier et prévenir.
- **Assets transparents :** ProRes 4444 avec `--config=remotion.asset.config.ts` ; sans texte sauf
  demande.

## Outils (pour l'agent)
- zsh : `rm motif_*.png` sans fichier correspondant arrête la commande ; utiliser `find … -delete`.
- Capture de site : Chrome sans tête a besoin d'un dossier temporaire autorisé (`TMPDIR`).
- Rendu Remotion : les images JPEG intermédiaires suffisent pour la vidéo ; PNG pour un asset
  transparent.
- **Bundle Remotion cassé sur un Mac** (vidéo 4) : `src/da/TitreDerriere.tsx` importe `public/da/popup/placement.json`, ignoré par Git, donc absent hors du Mac où il a été fait ; toutes les compositions échouent (« Module not found »). Parade : un bouche-trou local (non suivi) ou recréer le fichier.
