---
name: montage-facecam
description: >-
  Monte entièrement les vidéos face cam du compte mikha_dlm (Instagram Reels, TikTok, YouTube Shorts)
  dans le style de Michaël, de la transcription au MP4 final avec Remotion : choix des prises et
  chasse aux hésitations, titre d'accroche, un cadrage par phrase, sous-titres, séquences sur fond
  blanc (partenaire, site, produit, photo, affiche, défilé), bruitages, musique, contrôles et
  livraison. Utiliser ce skill dès qu'une vidéo arrive dans MONTAGE/a_monter (un dossier par vidéo),
  dès que Michaël demande de monter, remonter, corriger, relivrer ou exporter une vidéo (y compris
  vers DaVinci : face cam seul, EDL, SRT), de proposer du motion design pour illustrer un propos,
  d'ajouter un asset à la banque de motion design, de noter ses retours pour faire évoluer le
  style, ou quand il valide une vidéo (copie dans syncro_drive pour Metricool) — même s'il ne cite
  pas le skill.
---

# Montage face cam mikha_dlm

Ce skill est la **méthode** de montage. Le **style** est dans la charte `CHARTE/` (source de vérité),
et les outils dans `remotion/` (scripts et composants). Tous les chemins partent de
`MONTAGE/` (`/Users/michaelphilibert/Documents/MIKHA/IA STUDIO/MONTAGE`). Les commandes se lancent
depuis `MONTAGE/remotion/`. Les dossiers `references/` et `modeles/` cités ci-dessous sont dans le
dossier de ce skill (`MONTAGE/.claude/skills/montage-facecam/`).

## Principes

1. **La charte décide, le skill exécute.** Ordre de priorité : brief de la vidéo > charte > ce skill >
   habitudes des autres skills (Remotion, HyperFrames). Ce skill résume le style pour s'orienter ;
   en cas d'écart, la charte fait foi.
2. **Ne rien inventer.** Une valeur `[À COMPLÉTER]` est inconnue : la demander à Michaël. Une
   proposition de l'agent est toujours présentée comme telle.
3. **Faire valider avant de produire.** Michaël valide le plan de montage, et toute proposition de
   motion design, avant le rendu. Aucune règle nouvelle n'entre dans la charte ou dans ce skill sans
   son accord. Pourquoi : c'est son image ; il préfère corriger un plan qu'une vidéo.
4. **Le rythme avant tout.** Ce que Michaël corrige le plus : une hésitation restée, un souffle en
   début de plan, un blanc après le dernier mot, un sous-titre en avance. La reconnaissance vocale ne
   les voit pas ; se fier à la mesure du son, pas au texte (étape 2).
5. **Apprendre à chaque montage.** Chaque retour de Michaël est noté, appliqué, puis proposé comme
   règle s'il vaut pour les vidéos suivantes (`references/apprentissage.md`). Le but : qu'il ait de
   moins en moins à corriger.
6. **Parler à Michaël en français simple.** Il est vidéaste, pas développeur : des secondes, des px,
   des LUFS, pas de jargon de code. Quand il est loin de son Mac, lui envoyer les vidéos sur son
   téléphone (30 Mo au plus).

## Carte des lieux

| Où | Quoi |
|---|---|
| `CHARTE/` | Style : `README.md` (ordre de lecture), `02_design/DESIGN.md`, `03_motion/MOTION.md`, `03_motion/SOUS-TITRES.md`, `04_son/SON.md`, `05_formats/FORMATS.md`, modèles dans `09_templates/` |
| `CHARTE/a_ranger/` | Fichiers que Michaël dépose : à ranger dans la charte au début d'une session |
| `a_monter/<N>/` | Une vidéo : rush, `assets/`, puis tous les documents et exports de cette vidéo |
| `a_monter/1/` | Vidéo de référence du style : `ANALYSE_VF.md` (VF de Michaël décortiquée), `plan.json` |
| `a_monter/2/` | Premier montage complet par ce skill (validé en v03) : `RETOURS.md` (ce que Michaël corrige), `plan.json` (affiche 16:9 + étiquette, défilé régulier), `transcription/choix.json` (sous-morceaux) |
| `remotion/scripts/` | Transcription, hésitations, découpage, médias, contrôles, exports DaVinci, aperçus |
| `remotion/src/montage/` | Composition `Montage` : monte n'importe quelle vidéo d'après son `plan.json` |
| `remotion/src/charte/` | Composants du style actuel (titre, sous-titres, fond blanc, photo, étiquette, cadrage) |
| `motion_design/` | Banque de motion design : `CATALOGUE.md`, un dossier par asset |
| `apprentissage/JOURNAL.md` | Mémoire des retours et des leçons, règles en attente de validation |
| `apprentissage/STATS.md` | Stats Metricool à J+7 de chaque vidéo publiée, et ce qu'on en retient |
| `.claude/agents/relecteur-montage.md`, `.claude/hooks/` | Relecteur indépendant (étape 5) ; garde-fou de livraison (étape 6) |

## Déroulé d'un montage

Détail des commandes et des formats de fichiers : `references/chaine-technique.md`.

### 0. Démarrer
- **Synchroniser d'abord** : `./synchro.sh` depuis `MONTAGE/` (Michaël travaille sur plusieurs Mac ;
  règles et conflits : `SYNCHRO.md`). Puis, après chaque étape qui change un fichier suivi (plan,
  version, retours, charte, skill, journal) : `./synchro.sh "vidéo N : <ce qui a changé>"`. Les
  rushes et assets ne passent pas par là : s'ils manquent sur ce Mac, les demander à Michaël.
- Lire la charte dans l'ordre de `CHARTE/README.md`, puis `apprentissage/JOURNAL.md` (leçons,
  règles en attente), `apprentissage/STATS.md` (ce qui a marché), `references/pieges.md` et `motion_design/CATALOGUE.md`.
- Si `CHARTE/a_ranger/` contient des fichiers : les ranger (polices dans `07_typographies/`, sons dans
  `06_assets/sfx/`, logos et étiquettes dans `06_assets/…`) et mettre à jour les README. Un fichier
  utilisé par un projet DaVinci de Michaël se **copie** au lieu de se déplacer, et on le lui dit.

### 1. Réception
- Inventaire de `a_monter/<N>/` : rush (dimensions, cadence, durée), images, vidéos, musique.
  Regarder chaque visuel : ce qu'il montre décide où il peut servir.
- **Demander tout de suite si le rush est définitif** : étalonné, et son synchronisé avec l'image
  (vidéo 2 : rush remplacé après la transcription, son recalé de 4 images). S'il change en cours de
  route : mesurer le décalage et décaler les temps (`references/pieges.md`), sans tout retranscrire.
- `BRIEF.md` d'après `CHARTE/09_templates/BRIEF_VIDEO.md` : remplir ce qui est connu (ce qui est
  écrit sur les visuels compte comme source), lister les questions (point de départ de la musique,
  droits, prix, dates, tailles, assets manquants).

### 2. Transcription et nettoyage des prises
1. `python3 scripts/transcrire.py ../a_monter/<N>` : morceaux de parole transcrits un par un (les
   reprises restent visibles), phrases inventées sur du bruit marquées « suspect ». Si la fin des
   morceaux traîne loin après le dernier mot (bruit de pièce proche de -40 dB), relancer avec
   `--seuil -36`.
2. Choisir les prises : en général la dernière complète. `TRANSCRIPTION.md` : tableau des morceaux et
   décision pour chacun (gardé, coupé : faux départ, reprise, bruit), corrections, texte retenu,
   prises écartées qui diffèrent (à signaler à Michaël).
3. `transcription/choix.json` (modèle `modeles/choix.json`) : prises gardées et **texte relu** — il
   donne l'orthographe des sous-titres (noms propres et mots de `TON.md`, nombres en chiffres).
4. **Chasser les hésitations, obligatoire.** La reconnaissance efface les « euh » et les bouts de
   phrase redits (vidéo 2 : 12 s d'hésitations sur 46 s). `python3 scripts/reperer_hesitations.py
   ../a_monter/<N>` redécoupe chaque prise gardée aux micro-pauses et signale : répétition,
   hésitation, mot trop long, bruit, **début lent** (souffle avant le premier mot), **fin qui
   traîne** (blanc après le dernier mot, regard vers les notes). Pour chaque cas, mesurer sur le son
   l'attaque du premier mot et la fin du dernier (à peu près : l'aligneur, en 6, affine), puis `python3 scripts/redecouper_morceau.py
   ../a_monter/<N> <morceau> <début> [<fin>]` : un sous-morceau retranscrit seul, avec des temps de
   mots justes, à mettre dans `choix.json`.
5. Règles de coupe : **chaque plan commence sur le premier mot et finit sur le dernier** ; deux
   phrases enchaînées gardent ≈ 0,15 s de blanc ; jamais de mot coupé.
6. **Caler les mots avec l'aligneur** : `python3 scripts/aligner_mots.py ../a_monter/<N>` (après
   `choix.json` relu et les sous-morceaux faits ; environ 5 s). Whisper a transcrit ; l'aligneur
   (Qwen3-ForcedAligner, local) reprend le texte relu prise par prise et donne le début et la fin de
   chaque mot, plus justes que whisper (vidéo 5 : jusqu'à 0,3 s d'écart, l'aligneur tombe sur les
   pauses). L'attaque du 1er mot et la fin du dernier sont recalées sur l'énergie du son : ce sont
   les points de coupe, à la place de la mesure à la main. Produit `transcription/mots_alignes.json`.
   Une prise ratée (aligneur absent, mots en nombre différent, bords loin de la prise) est notée
   ÉCHEC et garde les temps de whisper : la lire dans le résumé affiché. À relancer après toute
   retouche du texte relu ou des prises (sinon le découpage signale « périmé » et reprend whisper).
7. `python3 scripts/decouper_transcription.py ../a_monter/<N>` (il lit `mots_alignes.json` ;
   `--whisper` pour l'ignorer), puis relire la liste des groupes de sous-titres affichée et la ligne
   « temps des mots » (aligneur ou whisper, phrase par phrase) : un « | » dans le texte relu force une
   coupure là où un groupe casse le sens. Relancer `reperer_hesitations.py` : il ne doit plus rien
   signaler.

### 3. Plan de montage, à faire valider
- `PLAN_MONTAGE.md` (modèle `modeles/PLAN_MONTAGE.md`) : titre d'accroche (2 ou 3 propositions, avec
  une maquette sur une image du rush si la tenue est claire), cadrage de chaque phrase, séquences sur
  fond blanc, sous-titres masqués, sons, musique, motion design (banque d'abord), questions.
- Les règles pour décider : `references/plan-de-montage.md`. Une illustration montre **ce qui est
  dit** à ce moment-là, et rien d'autre (consigne de Michaël, vidéo 2).
- Le présenter à Michaël et **attendre son accord**. Ses réponses vont mot pour mot dans
  `RETOURS.md` ; une réponse ambiguë est interprétée explicitement et signalée.

### 4. Fabrication
- Écrire `a_monter/<N>/plan.json` : la traduction exacte du plan validé (format et exemples :
  `references/chaine-technique.md` ; exemples : `a_monter/1/plan.json`, `a_monter/2/plan.json`).
- `python3 scripts/preparer_medias.py ../a_monter/<N> v<N>` (après une retouche du plan ou du
  découpage : ajouter `--donnees`).
- Vérifier sur images fixes avant le rendu complet : hook, chaque séquence, un sous-titre **sur le
  face cam** (lisible sur la tenue ? sinon `sousTitres.ombreSurFacecam`, charte `SOUS-TITRES.md`) :
  `npx remotion still Montage <image>.png --frame=<n> --props='{"video":"v<N>"}'`.
- Rendu : **toujours** `python3 scripts/rendre.py <N> <nom>_v01` (image et son rendus à part,
  assemblés par ffmpeg, son finalisé à -1 dBTP, copie du découpage et du plan de la version). Jamais
  `npx remotion render Montage …mp4` seul : son AAC arrive 42,7 ms après l'image (`references/pieges.md`).
- Un besoin que les types de séquence ne couvrent pas : ajouter le composant (voir
  `references/chaine-technique.md`, « Étendre le montage »), pas de montage écrit à la main.

### 5. Contrôles et relecture (avant de montrer quoi que ce soit à Michaël)
1. **Contrôle mesuré, obligatoire** : `python3 scripts/verifier_livraison.py <export>`. Verdict OK /
   PAS OK et liste des problèmes : format, -14 LUFS, pic vrai, écrêtage, silences, décalage son ↔ rush
   (ms, plan par plan), clics aux coupes, bruitages à leur temps prévu (et `earshot timeline --cues`),
   zone sûre des séquences sur fond, images isolées (A13). Seuils : `scripts/seuils_livraison.json`.
   Preuve : `export/<nom>_vNN_controle.json`. Couleur comparée au rush : `controler_export.py
   <export> --rush <rush> --image-montage <n> --image-rush <m>` (à faire à la première version).
2. **Relecture image par image** : `python3 scripts/planche_relecture.py <export>` → pages
   `export/<nom>_vNN_planche_NN.png` (5 images à chaque coupe, entrée / sortie de séquence, photo,
   fin du hook, avec les mots dits). Les **regarder toutes** (outil Read) : image isolée, texte en
   avance ou en retard sur le mot, sous-titre faux ou qui revient, affiche recadrée, étiquette fausse,
   texte hors zone, illustration qui ne montre pas ce qui est dit (A10, A13 à A16, A18, A19).
3. **Boucle** : un défaut trouvé → corriger la cause (`plan.json`, découpage, composant), relancer
   `rendre.py` (même version tant que Michaël ne l'a pas vue), puis 1 et 2. **3 tours au plus** ; au-delà,
   livrer en disant clairement ce qui reste et pourquoi.
4. **Relecteur indépendant** : lancer le sous-agent `relecteur-montage` (`.claude/agents/`) avec les
   chemins de l'export, des planches, du `_controle.json`, de `plan.json`, `PLAN_MONTAGE.md`,
   `choix.json`, `RETOURS.md` et `apprentissage/JOURNAL.md`. Il n'a pas vu le montage et rend des
   défauts classés (bloquant, à corriger, à regarder). Corriger les bloquants (retour en 3), trancher le
   reste ; ce qui reste ouvert est dit à Michaël.
5. `a_monter/<N>/CHECKLIST_VALIDATION.md` (copie de `CHARTE/09_templates/`) : case cochée = vérifié
   par une mesure ou par la relecture ; ce qui se juge à l'écoute reste à Michaël.

### 6. Livraison
- **Garde-fou (hook du projet, `.claude/hooks/controle_livraison.py`)** : l'envoi d'un export ou de
  son aperçu sur Telegram, et sa copie vers `syncro_drive`, sont refusés tant que
  `<nom>_vNN_controle.json` n'est pas au statut OK pour ce fichier exact (un nouveau rendu ou
  `finaliser_son.py` après le contrôle le rend périmé). En fin de tour, il rappelle une fois le contrôle
  si une version récente en manque. Si Michaël accepte un point PAS OK : mettre `"statut": "ACCEPTE"`
  et ses mots dans `"accepte"` du `_controle.json`, jamais de soi-même.
- Donner le lien de l'export, le verdict du contrôle, ce que la relecture a corrigé et ce qui reste à
  juger. Envoyer aussi la copie légère (`python3 scripts/apercu_telephone.py <export>`), surtout s'il
  est loin de son Mac.
- S'il veut finir dans DaVinci : `exporter_facecam.py` (face cam seul + EDL) et
  `exporter_sous_titres.py` (SRT par groupe ou mot à mot).

### 7. Retours et apprentissage
- Les retours de Michaël peuvent arriver via l'outil retours-video (`http://100.68.33.13:8780`, voir
  `~/agent/README.md`) : lire `a_monter/<N>/retours/<version>.md` / `.json` ; chaque retour est lié à une
  frame (et parfois une plage `fin_frame` ou un point x,y relatif) de cette version ; après application,
  cocher `fait` (mettre `"fait": true` dans le json, ou case dans l'outil).
- Chaque retour : noté mot pour mot dans `a_monter/<N>/RETOURS.md` (modèle `modeles/RETOURS.md`),
  appliqué dans une nouvelle version (`_v02`…). Ses repères de temps sont ceux de la version qu'il a
  regardée : garder une copie du découpage de chaque version (`export/<nom>_vNN_decoupage.json`).
- Corriger la cause, pas seulement le passage signalé : chercher le même défaut ailleurs dans la
  vidéo (vidéo 2 : un sous-titre en avance signalé, une phrase entière en avance trouvée).
- En fin de vidéo : mettre à jour `apprentissage/JOURNAL.md`, et proposer à Michaël de transformer en
  règle ce qui vaut pour toutes les vidéos (charte pour le style, ce skill ou les scripts pour la
  méthode). Détail : `references/apprentissage.md`.
- Si Michaël remonte lui-même une version (DaVinci), analyser sa timeline pour apprendre ses
  valeurs exactes, comme `a_monter/1/ANALYSE_VF.md`.

### 8. Vidéo validée → Drive (pour Metricool)
- Dès que Michaël valide une version (« validé », « c'est bon », « ok pour publier »…), copier
  (jamais déplacer) le fichier qu'il désigne dans
  `/Users/michaelphilibert/Documents/MIKHA/IA STUDIO/AUTOMATISATIONS/syncro_drive/`, nommé
  `AAAA-MM-JJ_<titre-court>_VF.mp4` (date de validation ; ex. `2026-09-30_MEHO-dernier-jour_VF.mp4`).
  Ce peut être un export du skill (`<nom>_vNN.mp4`) ou un export DaVinci de Michaël : dans le doute
  sur la version, lui demander.
- Ce dossier est synchronisé avec Google Drive, d'où Metricool récupère la vidéo. Lui confirmer la
  copie (nom du fichier). Une fois la vidéo programmée, ajouter en tête de `PLAN_MONTAGE.md` la ligne
  `> **Publication :** programmée le JJ/MM/AAAA à HH:MM (réseaux)` (« publiée » une fois en ligne) :
  `etat_montage.txt` cesse alors de compter les questions du brief. La copie ne programme rien : la publication suit la procédure de
  `AUTOMATISATIONS/CONTEXTE.md` (« Publication d'une vidéo validée »), seulement après son « ok »
  sur la légende, le réseau et l'horaire.
- Légendes MIKHA : **ni emoji ni hashtag** (Michaël, 2026-11-03). Proposer le texte brut.
- Programmation Metricool (marque mikha_dlm, blogId 3680334) : Metricool ne lit pas le Drive privé
  (« Failed to normalize media »). Procédure validée (Michaël, 2026-11-03) : retrouver le VF et la
  miniature sur le Drive (MCP Google Drive, `search_files`), les passer en « tous ceux qui ont le
  lien » en lecture (`share_file`, `anyoneWithLink`, `reader`), puis donner leurs liens `view` à
  `createScheduledPost` (`media` + `videoThumbnailUrl`). On laisse le partage par lien ensuite.
  Le dossier Drive n'est pas lisible depuis le terminal (File Provider) : vérifier par le MCP.
  TikTok exige un `title` dans `tiktokData`.

### 9. Stats à J+7 (apprendre ce qui marche)
- À la programmation : `~/agent/scripts/rappel-ajout.sh "<J+7> 10:00" "MONTAGE : relever stats
  Metricool vidéo <N> <titre>"` (jamais CronCreate).
- À J+7 : MCP Metricool `getAnalyticsDataByMetrics` en **lecture seule** (blogId 3680334, du jour de
  publication à J+7 ; champs dans `apprentissage/STATS.md`) : vues, portée, j'aime, commentaires,
  partages, enregistrements, temps moyen vu, part des vues de plus de 3 s (Instagram), vidéo vue en
  entier (TikTok), YouTube si disponible.
- Une ligne par réseau dans `apprentissage/STATS.md`, puis 1 ou 2 phrases « ce qu'on en retient »
  (hook, durée, type de séquence) ; une piste qui se confirme sur plusieurs vidéos devient une règle
  proposée à Michaël (`JOURNAL.md`). Lire `STATS.md` avant d'écrire un plan de montage.

## Le style en bref (la charte fait foi)

- **Exigence de Michaël (règles validées le 2026-11-03) :** il regarde à l'image près. Aucune image
  isolée aux raccords ; texte à l'écran calé sur la voix au mot près, avec les mots dits et la phrase
  complète ; affiche toujours entière (jamais recadrée) avec l'étiquette lieu / date dessous ; avant
  livraison, chaque raccord et chaque entrée de texte regardés image par image.

- **Hook :** la phrase d'accroche entière ; titre reformulé en 3 lignes Gilroy Heavy capitales, bords
  alignés, sous le visage ; un seul jaune `#FFB900` sur les mots importants, blanc ailleurs ; face
  cam × 1,21 ; riser qui finit avec la phrase ; pas de sous-titres.
- **Face cam :** un nouveau cadrage à chaque phrase (zoom progressif à partir d'environ 4 s,
  recadrage fixe × 1,06 à × 1,23 en dessous ou si la phrase est coupée par le fond blanc, × 1
  entre deux) ; coupes sèches ; silences, hésitations et souffles tous coupés.
- **Sous-titres :** Gilroy ExtraBold 75 px, groupe de 1 à 3 mots en entier, calé sur la voix ; blancs
  sur le face cam (ombre si la tenue est claire), noirs sur fond blanc ; masqués quand l'écran montre
  déjà les mots ou dit l'essentiel (date et lieu sous une affiche).
- **Séquences sur fond blanc :** une idée entière, du mot qui l'annonce à la fin du mot qui la clôt ;
  partenaire (vidéo + étiquette), site (téléphone + barre de recherche), produit (photo arrondie +
  étiquette, changée sur le mot qui nomme le produit), photo (affiche 16:9 + étiquette date / lieu ;
  défilé de visuels non nommés à intervalles réguliers ; produits détourés posés en entier).
- **Son :** voix -14 LUFS ; musique ≈ 8,5 dB dessous, de la fin du hook à la dernière image ; clic à
  chaque sortie du fond blanc et à l'entrée d'une séquence partenaire ; déclencheur avant chaque
  photo, -6 dB dans un défilé ; pic vrai -1 dBTP au plus.

**DA rouge, en test (2026-11-03) :** titre en bloc derrière la tête, sous-titres Thunder mot par mot,
fond rouge grainé. Seulement pour une vidéo dont `plan.json` porte `"da": "rouge"`, sur demande de
Michaël (vidéo pilote) ; tant qu'il ne l'a pas validée, la charte jaune reste la règle. Format et
rendu : `references/chaine-technique.md` (§5, « DA rouge ») ; décisions : `DA MIKHA/DECISIONS.md`.

## Motion design

Quand un propos gagnerait à être illustré et qu'aucune photo ne convient : chercher d'abord dans
`motion_design/CATALOGUE.md`, sinon **proposer** (modèle `modeles/PROPOSITION_MOTION.md`), et ne rien
produire avant l'accord de Michaël. Un asset produit et jugé utile par Michaël entre dans la banque
(fiche, aperçu, registre) pour être réutilisé. Détail : `references/motion-design.md`.

## Pièges connus

Les erreurs déjà rencontrées et leur parade sont dans `references/pieges.md` : à parcourir avant la
transcription et avant la fabrication, et à compléter quand un nouveau piège apparaît.
