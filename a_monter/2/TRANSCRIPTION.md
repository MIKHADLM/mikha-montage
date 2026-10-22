# TRANSCRIPTION : annonce_popup_mehomies.mp4

> **Rôle :** transcription du rush, choix des prises et texte retenu pour le montage. **Lecteurs :** Michaël (relecture) et les agents (montage). Les choix sont des **propositions de l'agent**, à valider avec le plan de montage (`PLAN_MONTAGE.md`).

| Élément | Valeur |
|---|---|
| Rush | `a_monter/2/annonce_popup_mehomies.mp4` : 1080×1920, 30 i/s, 257,7 s, un seul plan face cam. **Remplacé le 2026-10-01** (étalonné, son recalé de 4 images par Michaël) : décalage mesuré +133 ms, tous les temps de ce document (rush) sont ceux de l'**ancien** fichier ; ajouter 0,133 s pour le nouveau. Les fichiers de `transcription/brut/` sont déjà décalés (original : `brut_rush-avant-resync/`) |
| Reconnaissance | whisper large-v3-turbo, français, chaque morceau de parole transcrit séparément pour garder les reprises |
| Détection des silences | **-36 dB** pendant au moins 0,3 s (au lieu de -40 dB) : le bruit de la pièce tourne autour de -40 dB ; à -40, des fins de phrase gardaient jusqu'à 2 s de blanc. Transcription à -40 gardée pour comparaison dans `transcription/brut_seuil-40/` |
| Durée après coupe des silences, des reprises et des faux départs | **31,67 s** en v03 (33,33 s en v02 ; 45,93 s en v01, avant la chasse aux hésitations) ; marge de 0,08 s avant et après chaque passage |
| Volume de la voix dans le rush | -18,1 LUFS (remontée à -14 LUFS au montage) |

## 1. Texte retenu, dans l'ordre du montage (v03)

Depuis la v02, les prises de P2, P3, P5, P6, P7, P8 et P9 sont des **sous-morceaux** (`c11b`…) : seule la partie propre du morceau est gardée, retranscrite seule (`remotion/scripts/redecouper_morceau.py`), après repérage des hésitations (`remotion/scripts/reperer_hesitations.py`). Temps rush ci-dessous : **nouveau** rush.

| # | Montage v03 (s) | Texte | Prise |
|---|---|---|---|
| P1 | 0,00 → 2,87 | Les reufs, actuellement je prépare le premier pop-up de ma marque Mehomies. | c03, 3e et dernière prise |
| P2 | 2,87 → 7,00 | Ça va se passer le 7 novembre à la Condition Publique de Roubaix à l'occasion de la nouvelle édition de Space Jam. | c09b : 53,00 → 57,00 s (de « Ça » à la fin de « Jam ») |
| P3 | 7,00 → 10,20 | Passer du virtuel au physique, c'est un objectif que j'ai depuis longtemps avec Mehomies. | c11b : 3e prise de c11, à partir de 66,76 s (« Passer du… » et une 1re prise complète avant) |
| P4 | 10,20 → 15,10 | Je trouve que c'est un move qui est cohérent avec l'ADN de la marque et les valeurs qu'on cherche à véhiculer, etc etc. | c14b : c14 dès « Je » (79,86 s ; souffle avant retiré) |
| P5 | 15,10 → 18,60 | Grâce aux commandes qu'il y a eu sur le drop Mehomies Flag, on a pu se permettre des petites folies, les reufs. | c25b : 3e prise de c25, de « Grâce » (155,27 s) à la fin de « reufs » (158,62 s) |
| P6 | 18,60 → 23,87 | Parce que forcément, organiser un événement public, ça implique d'avoir du stock. Je ne peux pas arriver là-bas, les mains vides, les reufs. | c32b (2e « parce que forcément », 195,30 → 198,80 s) + c33b (dès le vrai « Je », 199,84 s) : 0,15 s entre les deux |
| P7 | 23,87 → 26,27 | Voilà, en tout cas, je suis trop content, je sens que ça avance dans le bon sens. | c37b : 227,22 → 229,47 s (de « Voilà » à la fin de « sens ») |
| P8 | 26,27 → 29,40 | Maintenant, je vais essayer de tout mettre en place pour vous proposer quelque chose de qualitatif. | c39b : 2e prise, 240,69 → 243,64 s (fin de « qualitatif » ; après, regard vers les notes) |
| P9 | 29,40 → 31,67 | Dans tous les cas, je vous en parlerai dans les semaines qui arrivent, let's go ! | c40b : dernière prise, à partir de 252,94 s (avant : 1re prise avec « merci », puis « Dans tous les cas, je vous en parl… » abandonné) |

### Prises écartées qui pourraient t'intéresser

| Phrase | Prise écartée | Différence |
|---|---|---|
| P2 | c04 (20,72 s du rush) | « Ça se passe le 7 novembre… à l'occasion de la **7ème édition** de Space Jam » : donne le numéro de l'édition |
| P7 | c36 (218,00 s) | « Voilà, en tout cas, je suis trop content. Ça avance dans le bon sens **et franchement, ça me fait trop plaisir les reufs** » : plus long (4,9 s), plus chaleureux |
| P9 | c40, 1re moitié (247,38 s) | « …dans les semaines qui arrivent, **merci**, let's go » |
| P1 | c01, c02 | Les deux premières prises de l'accroche (même texte) |

## 2. Corrections apportées au texte reconnu

| Reconnu par le modèle | Écrit dans les sous-titres | Pourquoi | Statut |
|---|---|---|---|
| Mehomiz, Mehomys | Mehomies | Orthographe du nom (charte, `TON.md`) | appliqué |
| Meo Miss Flag | Mehomies Flag | Orthographe du nom ; le modèle l'a coupé en 3 mots (« Mehomies[2] » dans `choix.json`) | appliqué |
| condition publique | Condition Publique | Nom du lieu (La Condition Publique, Roubaix) | **à confirmer** |
| les reufs | les reufs | Écriture de l'argot (« reufs », verlan de « frères ») | **à confirmer** |
| etc., etc. | etc etc | Les deux « etc » ensemble dans un seul sous-titre | proposition |
| move | move | Anglicisme gardé tel quel, comme « let's go » | **à confirmer** |
| vident | vides | « les mains vides » | appliqué |

Règles appliquées (`03_motion/SOUS-TITRES.md`) : majuscule sur la première lettre du premier mot de chaque phrase, minuscules ailleurs sauf noms propres, nombres en chiffres (« 7 novembre »), pas de ponctuation affichée.

## 3. Groupes de sous-titres

Relus et corrigés avec « | » quand le découpage automatique cassait le sens (« Condition | Publique », « Space | Jam », « on a | pu se »). Liste finale :

Les reufs | actuellement je prépare | le premier | pop-up | de ma marque | Mehomies (masqués : hook) · Ça va | se passer | le 7 novembre | à la | Condition Publique | de Roubaix | à l'occasion | de la | nouvelle édition | de Space Jam · Passer du virtuel | au physique | c'est un objectif | que j'ai | depuis longtemps | avec Mehomies · Je trouve | que c'est | un move | qui est cohérent | avec l'ADN | de la marque | et les valeurs | qu'on cherche | à véhiculer | etc etc · Grâce aux commandes | qu'il | y a eu | sur le drop | Mehomies Flag | on a pu | se permettre | des petites folies | les reufs · Parce que forcément | organiser | un événement public | ça implique | d'avoir du stock | Je ne peux | pas arriver là-bas | les mains vides | les reufs · Voilà | en tout cas | je suis | trop content | je sens | que ça avance | dans | le bon sens · Maintenant | je vais essayer | de tout | mettre en place | pour vous proposer | quelque chose | de qualitatif · Dans tous | les cas | je vous | en parlerai | dans les semaines | qui arrivent | let's go

À vérifier à l'écran : « qu'il | y a eu » et « dans | le bon sens » (4 mots ne tiennent pas dans un groupe de 3 au plus).

## 4. Rush complet, morceau par morceau

Un morceau = un passage de parole entre deux silences d'au moins 0,3 s (seuil -36 dB).

| Morceau | Rush (s) | Texte reconnu (brut) | Décision |
|---|---|---|---|
| c00 | 1,40 → 3,84 | Un, deux, un, deux. | coupé : test du micro |
| c01 | 5,96 → 9,24 | Les reufs, actuellement je prépare le premier pop-up de ma marque Mehomiz. | coupé : 1re prise de l'accroche |
| c02 | 9,92 → 13,20 | Les reufs, actuellement, je prépare le premier pop-up de ma marque, Mehomiz. | coupé : 2e prise de l'accroche |
| c03 | 14,16 → 16,84 | Les reufs, actuellement je prépare le premier pop-up de ma marque Mehomiz. | **gardé → P1** |
| c04 | 20,72 → 25,88 | Ça se passe le 7 novembre à la condition publique de Roubaix à l'occasion de la 7ème édition de Space Jam. | coupé : 1re prise (« 7ème édition ») |
| c05 | 29,38 → 35,08 | Ça va se passer le 7 novembre à la Condition Publique de Roubaix à l'occasion de la nouvelle émission. | coupé : prise ratée |
| c06 | 37,16 → 41,08 | Cela va se passer le 7 novembre, cela va se passer le 7 novembre. | coupé : faux départs |
| c07 | 44,78 → 50,22 | Ça va se passer le 7 novembre … de la nouvelle édition de Space Jam. | coupé : avant-dernière prise complète |
| c08 | 51,10 → 52,28 | Ça va se passer le 7 novembre. | coupé : faux départ |
| c09 | 52,62 → 57,02 | Ça va se passer le 7 novembre à la condition publique de Roubaix à l'occasion de la nouvelle édition de Space Jam. | **gardé → P2** |
| c10 | 58,46 → 58,84 | Merci. | coupé : bruit (son très faible) |
| c11 | 62,12 → 69,64 | Passer du virtuel au physique, c'est un objectif que j'ai depuis longtemps avec Mehomys. | **gardé → P3** |
| c12 | 70,40 → 70,62 | *Sous-titrage Société Radio-Canada* (inventé) | coupé : bruit |
| c13 | 75,26 → 78,02 | Je trouve que c'est un... Je trouve que c'est un mou... | coupé : faux départs |
| c14 | 79,38 → 84,46 | Je trouve que c'est un move qui est cohérent avec l'ADN de la marque et les valeurs qu'on cherche à véhiculer, etc., etc. | **gardé → P4** |
| c15 à c18 | 85,26 → 95,74 | *Sous-titrage…* (inventé) | coupé : bruit |
| — | 95,74 → 125,14 | (aucune parole) | coupé : silence |
| c19 | 125,14 → 126,36 | Grâce aux commandes qu'il a eues sur le... | coupé : faux départ |
| c20 | 127,12 → 134,10 | Grâce aux commandes qu'il y a eu sur le... Ok. … | coupé : faux départs |
| c21 | 134,62 → 138,74 | Grâce aux commandes … on a pu se permettre un petit | coupé : prise interrompue |
| c22 | 139,94 → 140,12 | *(inventé)* | coupé : bruit |
| c23 | 143,06 → 143,68 | Grâce aux commandes... | coupé : faux départ |
| c24 | 150,02 → 150,14 | *(inventé)* | coupé : bruit |
| c25 | 151,64 → 159,02 | Grâce aux commandes qu'il y a eu sur le drop Meo Miss Flag, on a pu se permettre des petites folies les reufs. | **gardé → P5** |
| c26 | 159,64 → 160,04 | *(inventé)* | coupé : bruit |
| c27 | 163,44 → 167,52 | Parce que forcément, organiser un événement... | coupé : faux départ |
| c28 | 169,96 → 170,18 | *(inventé)* | coupé : bruit |
| c29 | 173,64 → 176,32 | Parce que forcément... | coupé : faux départ |
| c30 | 177,30 → 179,04 | *(inventé)* | coupé : bruit |
| c31 | 180,48 → 185,74 | Parce que forcément, un pop-up physique, ça applique d'avoir du stock. | coupé : 1re prise (« un pop-up physique ») |
| c32 | 193,84 → 198,98 | Parce que forcément organiser un événement public, ça implique d'avoir du stock. | **gardé → P6** |
| c33 | 199,46 → 201,20 | Je ne peux pas arriver là-bas, les mains vident les reufs. | **gardé → P6** |
| c34 | 207,18 → 209,10 | Voilà, je suis trop content, ça… | coupé : faux départ |
| c35 | 210,16 → 214,14 | Voilà, dans les grandes lignes, je suis trop content, je suis trop content, ça avance dans les... | coupé : faux départ |
| c36 | 218,00 → 222,90 | Voilà, en tout cas, je suis trop content. Ça avance dans le bon sens et franchement, ça me fait trop plaisir les reufs. | coupé : prise précédente (voir section 1) |
| c37 | 226,48 → 229,44 | Voilà, en tout cas, je suis trop content, je sens que ça avance dans le bon sens. | **gardé → P7** |
| c38 | 230,14 → 230,26 | *(inventé)* | coupé : bruit |
| c39 | 235,58 → 244,58 | Maintenant, je vais essayer … de qualitatif. Maintenant, je vais essayer … de qualitatif. | **1re prise coupée, 2e gardée → P8** (à partir de 240,56 s, attaque mesurée sur le son) |
| c40 | 247,38 → 254,92 | Dans tous les cas … merci, let's go. Dans tous les cas … let's go. | **1re prise coupée, 2e gardée → P9** (à partir de 251,58 s) |
| c41 | 255,52 → 256,70 | *(inventé)* | coupé : bruit |

## 5. Fichiers

| Fichier | Contenu |
|---|---|
| `transcription/choix.json` | Prises gardées et texte relu (orthographe et casse des sous-titres) |
| `transcription/decoupage.json`, `mots_montage.json`, `sous-titres.json`, `mots_rush.json` | Générés par `remotion/scripts/decouper_transcription.py` |
| `transcription/brut/` | Sorties du modèle, morceau par morceau (seuil -36 dB) |
| `transcription/brut_seuil-40/` | Première transcription (seuil -40 dB), pour comparaison |
