# CHARTE : charte graphique du compte mikha_dlm (Instagram, TikTok, YouTube)

> **Rôle :** index de la charte, ordre de lecture et suivi d'avancement. **Lecteurs :** l'humain (suivi) et les agents IA (point d'entrée obligatoire).

Cette charte est la **source de vérité unique** pour les agents IA qui montent les vidéos du compte **mikha_dlm** avec HyperFrames et Remotion. Chaque vidéo produite doit en respecter les règles.

Format vidéo cible de référence : vertical **1080×1920, 30 i/s** (à confirmer).

## Le compte en deux lignes

- Compte **personnel** de Michaël Philibert (vidéaste freelance, fondateur de la marque Mehomies), publié sur Instagram, TikTok et YouTube (Shorts) sous le nom `mikha_dlm` (à confirmer).
- Ce n'est **pas** le compte de la marque Mehomies (compte de la marque : `@mehomies.co`) : ici, Mehomies apparaît en coulisse et parcours de fondateur, jamais en catalogue produit. Détail dans `01_marque/MARQUE.md`.
- Source du positionnement : `/Users/michaelphilibert/Documents/GITHUB/IA/Core-Context/BRANDS/MIKHA/MIKHA_DLM.md`.

## Direction artistique actuelle (2026-09-30)

Tirée du montage de Michaël (VF de la vidéo 1, `08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4`, analyse dans `a_monter/1/ANALYSE_VF.md`) et confirmée par lui :

- **Couleur d'accent : jaune `#FFB900`** dans toutes les vidéos (le rouge `#9F1932` est abandonné).
- **Fond blanc uni** pour les séquences d'illustration (fond_1 et son grain sont abandonnés).
- **Gilroy seule** : Heavy (titres), ExtraBold (sous-titres, noms), Medium Italic (précisions) ; Permanent Marker est abandonnée.
- **Hook :** titre reformulé en 3 lignes aux bords alignés, sur le face cam, avec le riser.
- **Sous-titres incrustés**, blancs sur le face cam, noirs sur fond blanc.
- **Un cadrage par phrase**, coupes sèches, séquences sur fond blanc qui couvrent une idée entière, clic et déclencheur aux entrées et sorties, musique ≈ 8,5 dB sous la voix.

Précisions du 2026-10-01 (vidéo 2, confirmées par Michaël) :

- **Un seul jaune** `#FFB900` dans le titre d'accroche (jaune pâle abandonné).
- **Zoom progressif** sur les phrases d'environ 4 s et plus, recadrage fixe en dessous.
- **Défilé de visuels** non nommés : même temps d'affichage pour chacun, déclencheur à -6 dB.

`CHARTE/a_ranger/` reçoit les fichiers que Michaël dépose ; l'agent les range dans la charte.

## Autour de la charte

| Où | Rôle |
|---|---|
| `.claude/skills/montage-facecam/` | Le skill qui monte les vidéos face cam : la **méthode** (la charte reste le **style**) |
| `apprentissage/JOURNAL.md` | Leçons des montages et règles en attente de validation |
| `motion_design/CATALOGUE.md` | Banque de motion design réutilisable |
| `remotion/` | Outils de montage (scripts, composants, composition `Montage`) |

## Faits de contexte sur Mehomies (à confirmer)

- Marque : Mehomies ; site : [www.mehomies.com](https://www.mehomies.com)
- Collection : Mehomies Flag, en collaboration avec BAG, six t-shirts inspirés de six pays
- Coupes : Boxy (t-shirt crop, manches amples) et Baby Tee (coupe ajustée)
- Écriture exacte des noms propres : Mehomies, BAG, Boxy, Baby Tee

## Règles pour les agents

1. **Ordre de lecture :** `README` → `MARQUE` → `TON` → `DESIGN` → `MOTION` → `SOUS-TITRES` → `SON` → `FORMATS` → brief de la vidéo (`09_templates/BRIEF_VIDEO.md` rempli pour la vidéo).
2. **Hiérarchie en cas de conflit :** le **brief de la vidéo** l'emporte sur la **charte**, et la **charte** l'emporte sur les **habitudes des skills** (HyperFrames, Remotion, etc.).
3. **Ne rien inventer :** toute valeur au format `[À COMPLÉTER : ...]` est **inconnue**. L'agent ne la remplace pas par une valeur de son choix : il la signale et demande la valeur, ou utilise celle du brief de la vidéo si elle y figure.
4. **Spec visuelle :** le fichier de design principal est `02_design/DESIGN.md` (les skills HyperFrames cherchent `frame.md` → `design.md` → `DESIGN.md`). Les mêmes valeurs existent en JSON dans `02_design/tokens.json`. En cas d'écart entre les deux, `DESIGN.md` fait foi.
5. **Musique :** fournie par Michaël avec chaque vidéo (chemin dans le brief). Les agents n'en choisissent pas.
6. **Silences :** tous coupés au montage.
7. **Assets :** logos, produits, partenaires et autres visuels sont fournis avec chaque vidéo (chemins dans le brief).
8. **Étalonnage :** le plan principal (face cam ou autre rush) est **étalonné par Michaël avant d'être transmis**. Les agents n'appliquent aucun étalonnage ni LUT sur ce rush.
9. **Avant de livrer :** passer `09_templates/CHECKLIST_VALIDATION.md`.

## Rôle de chaque fichier

| Fichier / dossier | Rôle | Lecteur |
|---|---|---|
| `01_marque/MARQUE.md` | Positionnement, audience, piliers, cloisonnement, mentions obligatoires | Les deux |
| `01_marque/TON.md` | Ton de voix, niveau de langue, lexique, orthographe des noms propres | Les deux |
| `02_design/DESIGN.md` | Spec visuelle : couleurs, typos, fond, composition de texte, zones sûres | Agents |
| `02_design/tokens.json` | Mêmes valeurs en JSON, importable par Remotion et les scripts | Agents / scripts |
| `03_motion/MOTION.md` | Rythme, animations, transitions, zooms, ouverture et fermeture types | Agents |
| `03_motion/SOUS-TITRES.md` | Style, taille, position, groupes de mots, casse, mise en valeur | Agents |
| `04_son/SON.md` | Musique, niveaux (LUFS), bruitages signature, voix | Agents |
| `05_formats/FORMATS.md` | Spécifications par plateforme (Instagram Reels, TikTok, YouTube Shorts) et gabarit de zones sûres | Les deux |
| `06_assets/` | Logos, produits, partenaires, éléments graphiques, textures, LUT, icônes, SFX, musique | Agents |
| `07_typographies/` | Polices (Gilroy Heavy, ExtraBold, Medium Italic ; Permanent Marker abandonnée) | Les deux |
| `08_references/` | Vidéos de référence, captures, exemples de mise en page, contre-exemples | Les deux |
| `09_templates/BRIEF_VIDEO.md` | Brief à remplir pour chaque vidéo | Les deux |
| `09_templates/CHECKLIST_VALIDATION.md` | Critères de publication | Les deux |

## Convention des emplacements

- `[À COMPLÉTER : description]` : information manquante, à ne pas deviner.
- `(à confirmer)` : information pré-remplie mais pas encore validée.
- `(mesuré sur ...)` : valeur relevée sur un fichier de Michaël, à confirmer.
- Quand un emplacement est complété, retirer la mention `[À COMPLÉTER : ...]` et mettre à jour le tableau d'avancement ci-dessous.

## À valider lors des premiers tests

| Sujet | Où | Statut |
|---|---|---|
| Marge de sécurité autour des mots coupés | `03_motion/MOTION.md` | Tranché par la VF : 0,08 s |
| Usage du clic | `04_son/SON.md` | Tranché par la VF : entrées et sorties du fond blanc |
| Usage des whoosh et de la caisse | `04_son/SON.md` | À définir (pas utilisés dans la VF) |
| Niveau de chaque bruitage dans le mix | `04_son/SON.md` | VF : fichiers posés sans gain |
| Facteur et courbe des zooms progressifs | `03_motion/MOTION.md` | Tranché par la VF : × 1 → × 1,2 ou × 1,15, linéaire |
| Graisse des sous-titres | `03_motion/SOUS-TITRES.md` | Tranché le 2026-09-30 : ExtraBold |
| Pic vrai maximal du mix | `04_son/SON.md` | Tranché le 2026-09-30 : -1 dBTP |
| Licences de Gilroy ExtraBold et Medium Italic | `07_typographies/README.md` | Confirmées le 2026-09-30 |

## Tableau d'avancement

| Fichier | Statut |
|---|---|
| `01_marque/MARQUE.md` | partiel (positionnement et piliers remplis ; mentions, promesse, valeurs à remplir) |
| `01_marque/TON.md` | partiel (ton et style remplis ; lexique, tu/vous, noms des six pays à remplir) |
| `02_design/DESIGN.md` | mis à jour le 2026-09-30 (jaune, fond blanc, Gilroy, hook, séquences sur fond blanc, étiquettes) et le 2026-10-01 (un seul jaune) ; logo du compte, grille, hiérarchie à remplir |
| `02_design/tokens.json` | mis à jour le 2026-09-30 |
| `03_motion/MOTION.md` | mis à jour le 2026-09-30 (coupes sèches, un cadrage par phrase, hook, fin) et le 2026-10-01 (règle des zooms, défilé régulier) ; transitions autres que la coupe sèche, effets interdits à remplir |
| `03_motion/SOUS-TITRES.md` | mis à jour le 2026-09-30 (style, position, groupes, masquage) ; graisse à confirmer, largeur maximale à remplir |
| `04_son/SON.md` | mis à jour le 2026-09-30 (niveaux, riser, clic, déclencheur) et le 2026-10-01 (déclencheur à -6 dB dans un défilé) ; pic vrai maximal, whoosh et caisse à définir |
| `05_formats/FORMATS.md` | partiel (zones sûres et format Instagram remplis ; durées, couvertures, légendes, hashtags à remplir) |
| `06_assets/` | 6 bruitages et 2 étiquettes BAG déposés ; fond_1 archivé ; le reste est fourni avec chaque vidéo |
| `07_typographies/` | Gilroy Heavy, ExtraBold et Medium Italic déposées (licences des deux dernières à confirmer) ; Permanent Marker abandonnée |
| `08_references/REFERENCES.md` | VF de Michaël et 6 images de référence ajoutées ; anciens exemples marqués abandonnés |
| `09_templates/BRIEF_VIDEO.md` | modèle prêt (titre d'accroche et types de séquences ajoutés) |
| `09_templates/CHECKLIST_VALIDATION.md` | mise à jour le 2026-09-30 |
