# Penser le montage : règles de décision

Comment passer d'une transcription à un plan de montage dans le style de Michaël. Les valeurs sont
dans la charte ; ici, le **pourquoi** et la façon de choisir. Référence : sa VF de la vidéo 1
(`a_monter/1/ANALYSE_VF.md`, `a_monter/1/plan.json`). Les heuristiques marquées « à confirmer »
viennent d'une seule vidéo : les soumettre à Michaël dans le plan, et les corriger dans
`apprentissage/JOURNAL.md` selon ses retours.

## Sommaire
1. Lire la vidéo avant de la monter
2. Le hook
3. Les cadrages du face cam
4. Les séquences sur fond blanc
5. Les sous-titres
6. Le son
7. L'appel à l'action et la fin
8. Présenter le plan

## 1. Lire la vidéo avant de la monter

- Découper le texte retenu en **phrases** (P1, P2…) : la phrase est l'unité du montage (un cadrage
  par phrase, une séquence couvre une ou plusieurs idées entières).
- Repérer pour chaque phrase : l'idée, les mots importants, ce qui peut se montrer (partenaire cité,
  site, produit, chiffre, liste, avant/après), sa durée.
- Vérifier les faits cités (prix, dates, tailles) avec le brief : rien ne s'écrit à l'écran sans être
  vérifié. Ce qui est écrit sur un visuel fourni (affiche : date, lieu) compte comme source.
- Les durées se lisent **après** la chasse aux hésitations (SKILL.md, étape 2) : une phrase de 7 s
  peut n'en faire que 3 une fois les reprises retirées, ce qui change son cadrage.

## 2. Le hook

La première phrase accroche : c'est elle qui retient le spectateur. Dans la VF : toute la phrase, 2,4 s.

- **Titre reformulé**, pas la transcription : garder l'enjeu en 3 lignes courtes, en capitales.
  « C'est la dernière chance pour toi de commander ton t-shirt Mehomies » devient
  « DERNIÈRE CHANCE / POUR COMMANDER / TON TEE ».
- **Le jaune met en avant les mots importants** (confirmé par Michaël) : le mot le plus fort, en
  `jaune`, prend la ligne la plus grande ; un autre groupe important prend aussi `jaune` (le
  `jaunePale` est abandonné depuis le 2026-10-01) ; le
  reste en `blanc`. Les tailles se font seules (bords alignés) : une ligne courte devient grande,
  donc mettre le mot fort sur une ligne courte.
- Proposer **2 ou 3 titres** dans le plan : Michaël choisit. Si la tenue est claire ou chargée sous
  le visage, joindre une maquette des titres sur une image du rush (vidéo 2 : t-shirt blanc).
- Face cam × 1,21 fixe, riser jusqu'à la fin de la phrase, pas de sous-titres, pas de logo.

## 3. Les cadrages du face cam

Changer de cadrage à chaque phrase donne du rythme et masque les coupes (VF).

| Situation | Choix (VF) |
|---|---|
| Hook | × 1,21 fixe |
| Longue phrase, environ 4 s et plus (confirmé le 2026-10-01) | Zoom progressif × 1 → × 1,2, ou × 1 → × 1,15 |
| Phrase coupée par une séquence sur fond blanc | Recadrage fixe : un zoom progressif sauterait au retour |
| Phrase courte | Recadrage fixe entre × 1,06 et × 1,23 |
| Entre deux phrases recadrées | × 1, pour que le changement se voie |
| Dernière phrase | Recadrage serré (× 1,23 dans la VF) |
| Phrase entièrement couverte par une séquence sur fond blanc | Pas de cadrage à prévoir |

Jamais de dézoom (VF). Le zoom se fait autour du centre de l'image, comme dans DaVinci.

## 4. Les séquences sur fond blanc

Elles illustrent une idée quand montrer vaut mieux que dire. Le face cam disparaît : c'est un
changement fort, à réserver aux moments qui le méritent (VF : 3 séquences en 38 s, environ un quart
du temps).

| Ce qui est dit | Séquence |
|---|---|
| Un partenaire (BAG…) | `partenaire` : sa vidéo ou une image en haut, son étiquette dessous (étiquettes BAG prêtes dans `CHARTE/06_assets/partenaires/`) |
| Le site, la commande en ligne | `site` : téléphone et barre de recherche (assets de la banque) |
| Un ou plusieurs produits, coupes, modèles | `produit` : une photo par produit cité, changée sur le mot, étiquette nom (ExtraBold) + précision (Medium Italic, ex. « MEHOMIES ») |
| Plusieurs visuels pour une même idée, non nommés un par un (stock, gamme, variantes) | `photo` en **défilé** : `"regulier": true` et `"declencheurDb": -6` (charte `MOTION.md` §2, `SON.md`) |
| Un chiffre, une liste, une étape, un concept | Motion design : banque d'abord, sinon proposition (`motion-design.md`) |

- **Cohérence** (consigne de Michaël, vidéo 2) : l'image montre ce qui est dit à ce moment-là. Un
  visuel fourni qui n'illustre aucune phrase n'est pas utilisé (vidéo 2 : affiches des artistes,
  qu'il ne cite pas). L'écrire dans le plan : « pourquoi c'est cohérent ».
- **Affiche d'événement** (date, lieu, nom dits à l'oral) : type `photo` 16:9 + étiquette (date en
  nom, lieu en précision), sous-titres masqués sur la phrase (vidéo 2, validé).
- **Défilé** de visuels pour une même idée (stock, gamme) : intervalles réguliers, déclencheur
  -6 dB (charte). Produits détourés : `detoure: true`, posés en entier dans le cadre.
- **Bornes :** du mot qui annonce l'idée (« Avec BAG », « ce soir », « avec le Boxy Tee ») ou du
  début de la phrase, jusqu'à la **fin du mot qui la clôt** : jamais coupée pendant un mot.
- **Une idée entière** : pas de séquence qui s'arrête au milieu d'une énumération.
- **Assets :** ceux livrés dans `assets/`, ceux de la charte et de la banque. S'il en manque, le dire
  dans le plan ; ne jamais inventer une image.
- Vérifier que l'étiquette correspond au produit montré (erreur « BOXY TEE » sur un Baby Tee dans une
  première VF).

## 5. Les sous-titres

- Partout où il y a de la voix, **sauf** pendant le hook, les séquences `produit` (l'étiquette dit
  les noms) et les passages où l'écran montre déjà les mots (adresse tapée dans la barre :
  `masquer` sur « sur le site mehomies.com »).
- Relire les groupes affichés par le découpage : un groupe doit garder le sens (« votre soutien
  général », pas « général autour ») ; corriger avec « | » dans le texte relu.
- Tous les mots dits sont écrits ; nombres en chiffres ; noms propres de `TON.md`.

## 6. Le son

- Voix à -14 LUFS (automatique), musique fournie à ≈ -22,7 LUFS (`niveauLufs` de `choix.json`),
  depuis le point de départ donné par Michaël, de la fin du hook jusqu'à la dernière image.
- Riser sur le hook ; clic aux entrées (séquence partenaire) et sorties du fond blanc ; déclencheur
  avant chaque photo : placés automatiquement par le montage.
- Whoosh et caisse enregistreuse : pas d'usage défini ; les proposer seulement comme propositions.

## 7. L'appel à l'action et la fin

- Quand Michaël cite le site pour commander : séquence `site`, avec les sous-titres masqués sur
  l'adresse (la barre l'écrit déjà).
- Fin sur la dernière phrase en face cam, sans carte de fin, musique coupée net (VF).

## 8. Présenter le plan

`PLAN_MONTAGE.md` (modèle `modeles/PLAN_MONTAGE.md`) : un tableau par sujet, les temps en secondes,
les choix de l'agent présentés comme des propositions, les questions à la fin. Michaël valide ou
corrige ; ses corrections entrent dans `RETOURS.md` avant la fabrication.
