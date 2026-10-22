# SOUS-TITRES : texte qui suit la voix

> **Rôle :** règles d'affichage des sous-titres synchronisés sur la voix, et distinction avec les titres et textes d'illustration. **Lecteurs :** les agents (HyperFrames / Remotion) et l'humain pour compléter.

Canevas : 1080×1920 (à confirmer). Tailles en pixels sur ce canevas. Toute valeur `[À COMPLÉTER : ...]` est inconnue : ne pas l'inventer. Les sous-titres restent **dans les zones sûres** (voir `02_design/DESIGN.md`, section 7).

**Mise à jour du 2026-09-30** d'après la VF de Michaël (`08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4`), confirmée par Michaël : sous-titres **incrustés** dans la vidéo, style ci-dessous. `(mesuré sur la VF)` = relevé sur cette vidéo, ± 2 px.

## 0. Deux types de texte à l'écran

| Type | Quand | Règles |
|---|---|---|
| **Sous-titres** | Tout au long de la vidéo : sur le face cam et sur les séquences sur fond blanc | Cette page |
| **Titre ou texte d'illustration** | Titre d'accroche (hook), étiquette sous une photo, adresse tapée dans la barre de recherche | `02_design/DESIGN.md`, sections 3 et 4. Quand il montre les mots dits, **il remplace les sous-titres** |

## 1. Découpage et rythme

| Élément | Valeur |
|---|---|
| Apparition | **Chaque groupe apparaît en entier** au début de son premier mot, et reste jusqu'au groupe suivant (VF, faite avec le SRT « par groupe ») |
| Mots affichés en même temps | **1 à 3**, 2 en général |
| Coupures | Un groupe ne se termine pas sur un petit mot de liaison (article, préposition) : règle du découpage automatique, reprise dans la VF |
| Durée minimale d'un groupe | 4 images, soit 0,13 s (SRT de l'agent repris dans la VF) |
| Maintien après le dernier mot | Jusqu'au groupe suivant, 0,5 s au plus (SRT de l'agent) |
| Décalage sous-titre / voix | Aucun : le groupe apparaît quand son premier mot est prononcé (tolérance de 0,13 s dans les passages rapides) |
| Nombre de lignes | 1 |
| Ponctuation affichée | **Aucune**, sauf à l'intérieur des mots (apostrophes, « mehomies.com ») |

## 2. Casse et orthographe

- **Règle de casse (confirmée) :** majuscule sur la **première lettre seulement**, pour le premier mot d'une phrase ; minuscule pour tous les autres mots.
- **Noms propres :** écriture exacte de `01_marque/TON.md` (Mehomies, BAG, Boxy Tee, Baby Tee), même au milieu d'une phrase.
- **Nombres :** écrits **en chiffres** (« 6 variantes », VF).
- **Tous les mots dits sont écrits** (la VF a rétabli « général » et « 6 » qui manquaient dans une première version).
- **Horodatage :** calé sur l'audio **monté** (silences coupés), pas sur le rush brut.
- **Mots familiers, argot, mots en anglais :** transcrits tels quels dans la VF (« let's go », « En vrai les gars ») `[À COMPLÉTER : confirmer]`
- **Gros mots :** `[À COMPLÉTER : conservés / censurés, comment]`

## 3. Style

| Élément | Valeur (mesuré sur la VF) |
|---|---|
| Police | **Gilroy ExtraBold** (`07_typographies/Gilroy/Gilroy-ExtraBold.ttf`), confirmée le 2026-09-30 |
| Taille | ≈ 75 px (hauteur des capitales : 53 px) |
| Interlettrage | `[À COMPLÉTER]` |
| Couleur sur le face cam | **Blanc** `#FFFFFF` |
| Couleur sur fond blanc | **Noir** `#000000` |
| Ombre | **Aucune** par défaut (VF). **Exception : tenue claire** sous les sous-titres blancs (t-shirt blanc de la vidéo 2) : l'ombre du titre d'accroche (5 px vers le bas, 7 px de flou, noir à 60 %), sinon les sous-titres sont illisibles. Gardée par Michaël le 2026-10-01 |
| Contour | Aucun |
| Fond / pastille derrière le texte | Aucun |

## 4. Position

| Élément | Valeur (mesuré sur la VF) |
|---|---|
| Alignement | Centré (x = 540) |
| Position verticale | Bande de y ≈ 1 330 à 1 385 (ligne de base ≈ 1 382), **la même sur le face cam et sur fond blanc** |
| Exception | Séquence du site : sous la barre de recherche, y ≈ 1 505 à 1 557 |
| Largeur maximale du bloc | `[À COMPLÉTER : px]` |
| Zone sûre | Le bas des lettres (y ≈ 1 385) dépasse de 20 px la limite de 1 365 sur la partie gauche ; dans la séquence du site, les sous-titres sont sous la zone sûre : exception acceptée le 2026-09-30 (`02_design/DESIGN.md`, section 7) |

## 5. Mise en valeur d'un mot

| Élément | Valeur |
|---|---|
| Mots mis en valeur | Aucun dans la VF `[À COMPLÉTER : autorisé ? en jaune #FFB900 sur le face cam ?]` |
| Effet d'apparition / de sortie | Coupe sèche : le groupe apparaît et disparaît d'un coup (VF) |

## 6. Quand masquer les sous-titres

| Situation | Sous-titres (VF) |
|---|---|
| Accroche (hook) | **Masqués** : le titre d'accroche les remplace |
| Un texte à l'écran montre les mots dits | **Masqués** : étiquette produit pendant « avec le Boxy Tee ou le Baby Tee », adresse tapée dans la barre pendant « sur le site mehomies.com » |
| Séquence sur fond blanc | **Affichés en noir** |
| Carte de fin / appel à l'action | Pas de carte de fin dans la VF ; sous-titres jusqu'à la dernière phrase |
| Plan sans voix (photos, produit, musique) | `[À COMPLÉTER]` |

## 7. Fabrication

- Fichiers SRT de la vidéo : `python3 scripts/exporter_sous_titres.py ../a_monter/<N>` depuis `MONTAGE/remotion/` ; la VF utilise la version **par groupe**.
- Dans DaVinci : piste de sous-titres stylée (police, taille, couleur, position ci-dessus), puis **incrustation dans la vidéo** à l'export (Deliver).
