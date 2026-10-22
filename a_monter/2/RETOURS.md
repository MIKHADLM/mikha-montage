# RETOURS : vidéo 2

> **Rôle :** retours de Michaël sur chaque version de la vidéo 2, mot pour mot, et ce qui en a été fait. **Lecteurs :** l'agent (application, apprentissage) et Michaël.

## Plan de montage (2026-10-01)

| # | Retour de Michaël (mot pour mot) | Ce qui a été fait (version) | Portée | Destination proposée |
|---|---|---|---|---|
| 1 | « P2 2,87 → 7,43 Seulement l'affiche » | Lu comme : la couverture Space Jam seule pendant toute la phrase (variante B), sans les 6 affiches d'artistes (v01). **Interprétation à confirmer** | Cette vidéo | — |
| 2 | « P6 27,90 → 35,10 Réutiliser des images des tee dans le montage 1 » | Les 6 Boxy détourés de la vidéo 1 (Belgique, Brésil, France, Suisse, Royaume-Uni, USA), un par groupe de sous-titres, de « ça implique » à la fin de P6, à la place de l'illustration du stock (v01) | Cette vidéo | — |
| 3 | « Hook A » | « LE PREMIER / POP-UP / MEHOMIES » (v01) | Cette vidéo | — |
| 4 | « les reufs / Condition Publique / move » | Orthographes confirmées (v01) | Toutes les vidéos | `CHARTE/01_marque/TON.md` (lexique), à proposer |
| 5 | « j'utilise la photo du Boxy porté de la vidéo 1 » | Séquence « sur le drop Mehomies Flag » : Boxy porté, étiquette « MEHOMIES FLAG » (v01) | Cette vidéo | — |
| 6 | « J'ai les droit de la musique » | Noté dans le brief | Cette vidéo | — |
| 7 | « on l'a mets des le début » | Lu comme : la piste prise à partir de 0:00 ; elle démarre dans la vidéo juste après le hook, comme le veut la charte (pas pendant le riser) (v01). **Interprétation à confirmer** | Cette vidéo | — |
| 8 | « 9: ok » (zoom progressif à partir d'environ 4 s, recadrage fixe en dessous) | Règle appliquée | Toutes les vidéos | Charte `03_motion/MOTION.md` §4, journal A1 |
| 9 | « je viens effectivement de faire la colorimétrie, le rush est donc maintenant est étonné » | Nouveau rush utilisé tel quel (image copiée sans réencodage) | Cette vidéo | — |
| 10 | « J'ai aussi remarqué qu'il y avait un décalage entre le son et l'image, j'ai donc décalé le son de 4 Frames sur Davinci. Ça va peut-être être impliqué de réaliser les timings pour les sous-titres et les plans » | Décalage mesuré par corrélation entre l'ancien et le nouveau son : +133 ms (+4,00 images), identique du début à la fin ; image inchangée. Tous les temps de la transcription décalés d'autant : sous-titres et coupes calés sur le nouveau rush (v01) | Cette vidéo | Skill (`pieges.md`) : rush remplacé après la transcription |

Non répondu, gardé tel que proposé : P2 « nouvelle édition » (dernière prise), P7 dernière prise courte, P9 sans « merci », « etc etc ».

## v01 (2026-10-01)

Ajouts de l'agent constatés au contrôle, **à valider** :

| # | Constat | Ce qui a été fait | Portée |
|---|---|---|---|
| A | Sous-titres blancs sans ombre peu lisibles sur le t-shirt blanc | Ombre du titre d'accroche ajoutée sous les sous-titres du face cam (option `sousTitres.ombreSurFacecam` du plan) | Cette vidéo ; règle possible « ombre quand la tenue est claire » |
| B | Couverture 16:9 seule : grand vide dessous à la place de l'étiquette | Couverture centrée dans l'espace libre (y = 525) | Toutes les vidéos (nouveau type « photo ») |
| C | T-shirts détourés : remplir le cadre les couperait | Posés en entier dans le cadre arrondi, sur blanc, 60 px de marge | Toutes les vidéos |

Retours de Michaël sur la v01 (temps de la v01) :

| # | Retour de Michaël (mot pour mot) | Ce qui a été fait (v02) | Portée | Destination |
|---|---|---|---|---|
| 1 | « Pour le titre, utilise le même jaune pour les deux dernières lignes. Je veux que tu utilises le jaune qui est actuellement sur Pop-up. Le jeune plus clair, on peut l'oublier » | « POP-UP » et « MEHOMIES » en jaune `#FFB900` ; jaune pâle retiré de la charte | Toutes les vidéos | Charte `DESIGN.md`, `tokens.json`, checklist ; skill — **appliquée** |
| 2 | « Pour le plan P2, je pense qu'on va enlever les sous-titres sur cette partie et mettre les informations importantes c'est-à-dire la date et le lieu en plus de l'affiche » | Couverture à la place de la vidéo partenaire, étiquette dessous : « 7 NOVEMBRE » (Gilroy ExtraBold) et « Condition Publique, Roubaix » (Medium Italic) ; sous-titres masqués sur toute la phrase | Cette vidéo ; modèle possible pour un événement | Journal A10 |
| 3 | « Certaines hésitations n'ont pas été coupées, c'est un point qu'il va falloir améliorer que ce soit pour ce montage et pour les autres montages qui vont suivre. » | Nouvel outil `reperer_hesitations.py` : chaque prise gardée redécoupée aux micro-pauses et retranscrite par bouts ; `redecouper_morceau.py` pour ne garder que la partie propre. Étape obligatoire du skill | Toutes les vidéos | Skill (étape 2, pièges), outils — **appliquée** |
| 4 | « Entre 0:07 et 0:11 à couper » | P3 : la reconnaissance avait effacé « Passer du… » et une 1re prise complète de « passer du virtuel au physique, c'est un objectif » ; seule la dernière est gardée (à partir de 66,76 s du rush) | Cette vidéo | — |
| 5 | « Entre 0:20 et 0:23 toujours des phrases d'hésitation sur le "grâce aux commandes.." » | P5 : deux « Grâce aux commandes qu'il y a eu sur le drop… » abandonnés retirés ; 3e prise gardée (à partir de 155,00 s) | Cette vidéo | — |
| 6 | « Entre 0:27 et 0:29 il y a de l'hésitation » | P6 : 1er « Parce que forcément » retiré (2e gardé, à partir de 195,30 s) | Cette vidéo | — |
| 7 | « L'espace sonores entre le mot stock et le début de la phrase, je peux pas arriver les moins vides est trop grand, il faut que les deux phrases s'enchaînent plus rapidement » | Blanc entre « stock » et « Je » ramené de 0,46 s à 0,16 s | Toutes les vidéos (enchaîner les phrases liées) | Skill (étape 2) |
| 8 | « Il faut couper la fin de la phrase avec le mot qualitatif dès que celui-ci a été prononcé parce que après on me voit regarder mes notes » | P8 coupée à la fin de « qualitatif » (243,64 s + 0,08 s de marge) : 1,1 s de moins | Toutes les vidéos (pas de regard vers les notes) | Skill (étape 2) |
| 9 | « À 0:42, on voit à un moment d'hésitation, car je dis deux fois dans tous les cas » | P9 : « Dans tous les cas, je vous en parl… » abandonné retiré ; dernière prise gardée (à partir de 252,94 s) | Cette vidéo | — |

Repéré en plus par le nouvel outil et coupé : 0,6 s de bruit et de blanc avant « Voilà » (P7), 0,3 s avant « Ça va se passer » (P2).

Conséquences : le montage passe de 45,9 s à **33,3 s** ; P3 et P8 durent moins de 4 s et prennent un recadrage fixe (règle des cadrages).

## v02 (2026-10-01)

| # | Retour de Michaël (mot pour mot) | Ce qui a été fait (v03) | Portée | Destination |
|---|---|---|---|---|
| 0 | « C'est beaucoup mieux » | — | — | — |
| 1 | « J'ai encore 23 petits retours pour le rythme avec parfois des plans qui pourraient être coupés plus rapidement que ce soit au début ou à la fin » | Chaque plan mesuré au début et à la fin (voix franche au-dessus de -27 dB, temps de mots alignés) : P4 commence sur « Je trouve » (-0,35 s de souffle), P2 finit sur « Jam » (-0,15 s), P7 sur « sens » (-0,12 s) ; détection ajoutée à `reperer_hesitations.py` ([début lent], [fin qui traîne]) | Toutes les vidéos | Skill (étape 2), outil — **appliquée** |
| 2 | « Le plan où je dis "grâce aux commandes" pourrait être un peu coupé au début parce qu'il y a un petit espace avec du silence » | P5 commence sur « Grâce » (155,27 s) : 0,3 s de souffle retiré | Cette vidéo | — |
| 3 | « Après les Reufs, on pourrait aussi couper ce plan plus rapidement car ça casse le rythme vu qu'il y a un petit silence inutil » | P5 coupée à la fin de « reufs » (158,62 s) : 0,6 s de blanc retiré (deux petits bruits avaient trompé la détection des silences) | Cette vidéo | — |
| 4 | « Au niveau de l'illustration avec les six T-shirts, qui défilent. Je pense qu'on pourrait réduire un peu le son des flashes » | Déclencheur à -6 dB dans cette séquence (option `declencheurDb` du plan) | Toutes les vidéos (défilés) | Charte `SON.md` — **appliquée** (confirmé le 2026-10-01) |
| 5 | « Il faudrait que le temps d'affichage des différents T-shirts soient le même histoire que le changement entre les différents T-shirts soit régulier » | Les 6 t-shirts restent chacun 0,56 s (16 ou 17 images), à intervalles égaux, au lieu de changer sur les mots (option `regulier` du type « photo ») | Toutes les vidéos (défilés) | Charte `MOTION.md` §2 — **appliquée** (confirmé le 2026-10-01) |
| 6 | « Le sous-titre "je ne peux pas" apparaît avant que la phrase soit prononcée » | Le son à 199,64 s était un souffle : « Je » commence à 199,84 s. Prise recoupée et retranscrite seule, sous-titre recalé. Même défaut, non signalé, corrigé sur P4 (sous-titres ≈ 0,4 s en avance avec la transcription d'origine) | Toutes les vidéos | Skill (pièges) |

Conséquence : 33,3 s → **31,7 s**.

## v03 (2026-10-01) : validée

| # | Retour de Michaël (mot pour mot) | Suite |
|---|---|---|
| 1 | « On garde l'ombre » | Ombre sous les sous-titres blancs gardée ; inscrite dans la charte (`SOUS-TITRES.md`) pour une tenue claire |
| 2 | « garde « Condition Publique » » | Étiquette inchangée (« Condition Publique, Roubaix ») ; orthographe inscrite dans `TON.md` |
| 3 | « On peut valider cette version du montage » | **v03 validée** : `export/annonce-popup_v03.mp4` |

## Bilan

| Versions | Retours | Dont règles proposées | Dont règles acceptées |
|---|---|---|---|
| plan, v01, v02, v03 (validée) | 10 sur le plan, 9 sur la v01, 6 sur la v02 | 6 (orthographes, cadrages, un seul jaune, hésitations, début et fin de plan au mot près, défilé régulier) | 5 (cadrages, un seul jaune, hésitations, début et fin de plan, défilé régulier) |
