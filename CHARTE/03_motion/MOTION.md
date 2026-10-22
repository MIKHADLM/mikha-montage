# MOTION : rythme et animations

> **Rôle :** règles de rythme, d'animation et de transition des vidéos mikha_dlm. **Lecteurs :** les agents (montage HyperFrames / Remotion) ; l'humain pour compléter.

Canevas de référence : 1080×1920, 30 i/s (à confirmer). Toute durée est donnée en **millisecondes** ou en **images à 30 i/s** : préciser l'unité. Toute valeur `[À COMPLÉTER : ...]` est inconnue : ne pas l'inventer.

**Mise à jour du 2026-09-30** d'après la VF de Michaël (`08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4`, analyse : `a_monter/1/ANALYSE_VF.md`), confirmée par Michaël : sa façon de faire devient la règle.

## 1. Rythme

| Élément | Valeur |
|---|---|
| Règle générale | **Pas de valeur fixe.** Le rythme est défini par les **phrases**, le **texte** et l'**ambiance globale** de chaque vidéo. L'agent le déduit de la transcription, de la musique fournie et du brief. |
| Ambiance et rythme souhaités pour la vidéo | Indiqués dans `09_templates/BRIEF_VIDEO.md` |
| Silences | **Tous coupés** (confirmé par Michaël) |
| Marge gardée avant / après chaque passage | **0,08 s** : montage de l'agent repris dans la VF, avec seulement deux pauses resserrées entre deux phrases (8 et 3 images) |
| Unité de montage | **La phrase** : chaque phrase reçoit son propre cadrage (section 4), et une séquence d'illustration couvre une idée entière (`02_design/DESIGN.md`, section 4) |

## 2. Animations de texte

| Cas | Règle |
|---|---|
| Sous-titres | Groupes de 1 à 3 mots, **chaque groupe apparaît en entier** quand son premier mot est prononcé, en coupe sèche. Détail dans `SOUS-TITRES.md`. |
| Concept ou phrase importante | Titre composé (lignes aux bords alignés, mots forts en jaune `#FFB900` et plus grands) : `02_design/DESIGN.md`, section 3. Il remplace les sous-titres pendant son affichage. |
| Effet d'apparition d'un mot ou groupe | **Coupe sèche** (VF) |
| Apparition d'un titre | **Coupe sèche**, toutes les lignes en même temps ; le titre d'accroche est présent dès la 1re image (VF) |
| Sortie du texte | **Coupe sèche** (VF) |
| Apparition d'une séquence sur fond blanc | **Coupe sèche**, avec un bruitage (`04_son/SON.md`) |
| Durée d'une séquence sur fond blanc | Toute l'idée qu'elle illustre, et **au moins jusqu'à la fin du mot prononcé qui la clôt** : jamais coupée pendant un mot (confirmé par Michaël le 2026-09-29) |
| Changement de photo : produits cités | Une photo par produit **nommé**, changée sur le mot qui le nomme (VF de la vidéo 1 : « le Boxy Tee ou le Baby Tee ») |
| Changement de photo : défilé | Plusieurs visuels qui illustrent **une même idée** sans être nommés un par un (vidéo 2 : 6 t-shirts sur « avoir du stock ») : **même temps d'affichage pour chacun**, à intervalles réguliers sur toute la séquence (≈ 0,5 s par visuel dans la vidéo 2), coupes sèches ; déclencheur à -6 dB (`04_son/SON.md`). Confirmé par Michaël le 2026-10-01 |
| Texte et mots qui le suivent | Un titre peut rester affiché pendant les quelques mots qui le suivent, sans les écrire (confirmé par Michaël le 2026-09-29) |

## 2 bis. Animations d'entrée et de sortie (autres éléments)

| Nom | Type (texte / image / logo / produit) | Entrée ou sortie | Durée | Courbe | Usage |
|---|---|---|---|---|---|
| Montée du téléphone, rotation 3D | Téléphone (site en version mobile) | Entrée | 18 images (0,6 s) ; la rotation se termine à 24 images | `cubic-bezier(0.33, 1, 0.68, 1)` | Le téléphone, écran éteint, monte depuis sous l'image, incliné (X 22°, Y -14°, Z 4°, perspective 2 200 px, échelle 0,9) et se redresse (idée de Michaël) |
| Allumage de l'écran | Écran du téléphone | Entrée | 10 images (0,33 s), à la fin de la montée | Linéaire | Le site apparaît sur l'écran noir |
| Défilement au doigt | Page de site dans le téléphone | : | 24 images (0,8 s) | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Parcourir une page ; au plus 115 px de déplacement par image |
| Toucher | Cercle gris sur l'écran | : | 12 images (0,4 s) | : | Montrer où le doigt appuie |
| Page suivante | Page de site dans le téléphone | Entrée | 12 images (0,4 s) | `cubic-bezier(0.33, 1, 0.68, 1)` | La nouvelle page arrive par la droite, l'ancienne est poussée à gauche et assombrie |
| Zoom sur le téléphone | Téléphone | : | 22 images (0,73 s) ; retour en 18 images | `cubic-bezier(0.45, 0, 0.2, 1)` | Rendre lisible un détail du site (tailles, bouton) : × 1,9 |
| Goutte de verre liquide | Capsule en verre liquide (barre de recherche) | Entrée | Goutte 10 images ; étirement en capsule 14 images | Ressort avec léger rebond (Remotion `spring`, amortissement 11 puis 13) | La capsule naît d'une goutte et s'étire en s'écrasant un peu, comme un liquide |
| Frappe au clavier | Texte dans une barre de recherche | Entrée | 2 à 5 images par lettre (« mehomies.com » en 32 images) | : | Texte tapé lettre par lettre, curseur clignotant ensuite (8 images allumé, 8 éteint) |
| Validation | Capsule en verre liquide | : | Enfoncement 4 images, puis rebond | Ressort (amortissement 9) | La capsule s'enfonce de 4 %, s'éclaircit et rebondit |
| `[À COMPLÉTER : autres animations]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` |

Ces animations sont celles des deux assets de motion design (`motion_design/site_mobile/PLAN.md` et `motion_design/barre_recherche/PLAN.md`) : valeurs proposées par l'agent. **Michaël les a utilisés tels quels dans la VF** : téléphone et barre de recherche lancés ensemble, barre placée sous le téléphone, fin du téléphone coupée, fin de la barre répétée pour la faire durer.

- **Décalage (stagger) entre éléments d'un même groupe :** `[À COMPLÉTER : ms]`
- **Courbes par défaut :** entrée `[À COMPLÉTER]` ; sortie `[À COMPLÉTER]`
- **Rebonds / élasticité :** présents dans l'asset barre de recherche, gardés dans la VF `[À COMPLÉTER : autorisés ailleurs ?]`

## 3. Transitions

| Transition | Statut | Durée | Quand l'utiliser |
|---|---|---|---|
| **Coupe sèche** | Autorisée : **seule transition de la VF** (confirmé le 2026-09-30) | : | Partout : entre les plans face cam, vers et depuis les séquences sur fond blanc, entre deux photos |
| `[À COMPLÉTER : nom]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` | `[À COMPLÉTER]` |

- **Effets interdits (glitch, flash, secousse…) :** `[À COMPLÉTER]` (aucun dans la VF)

## 4. Zooms et cadrages du face cam

Règle de la VF (confirmée le 2026-09-30) : **un nouveau cadrage à chaque nouvelle phrase**.

| Élément | Valeur (VF) |
|---|---|
| Quand changer de cadrage | Au début de chaque phrase (coupe sèche) |
| Zoom progressif | Sur les **phrases d'environ 4 s et plus** : × 1 → × 1,2 et × 1 → × 1,15, sur toute la durée de la phrase, **linéaire** ; recadrage fixe en dessous (règle confirmée par Michaël le 2026-10-01). Exception : une phrase coupée par une séquence sur fond blanc prend un cadrage fixe (un zoom progressif sauterait) |
| Recadrage fixe | × 1,06 à × 1,23, surtout sur les phrases courtes de la fin ; × 1,09 au milieu |
| Plan large | × 1 entre deux phrases recadrées |
| Hook | × 1,21 fixe, légèrement décalé (17 px) |
| Direction | Zoom avant uniquement : aucun dézoom dans la VF |
| Facteur maximal visible | × 1,23 |
| Sous-titres pendant un zoom | Le zoom s'applique à la vidéo seule ; sous-titres et textes restent à taille fixe |
| Zoom sur les séquences sur fond blanc | Aucun (VF) |

## 5. Ouverture type (hook)

Modèle : le début de la VF, confirmé le 2026-09-30.

- **Durée :** toute la phrase d'accroche (2,37 s dans la VF).
- **Image :** face cam × 1,21 et **titre d'accroche** reformulé en 3 lignes (`02_design/DESIGN.md`, section 3.1), présent dès la 1re image, retiré à la coupe qui suit la phrase.
- **Son :** riser dont la fin tombe avec la fin de la phrase ; la musique démarre juste après (`04_son/SON.md`).
- **Sous-titres :** masqués pendant le hook.
- **Présence du logo :** aucune.
- **Interdits :** `[À COMPLÉTER : ex. pas de bonjour, pas d'intro logo]`

## 6. Fin de vidéo

- **Carte de fin :** aucune (VF) : la vidéo se termine sur la dernière phrase en face cam (« Merci à vous, let's go », recadrage × 1,23).
- **Son :** la musique s'arrête net sur la dernière image, sans fondu (VF).
- **Contenu (logo, site, @, produit) :** `[À COMPLÉTER : si une carte de fin est voulue un jour]`

## 7. Appel à l'action

| Élément | Valeur |
|---|---|
| Formulation(s) | Dite par Michaël (ex. « jusqu'à ce soir minuit sur le site mehomies.com ») `[À COMPLÉTER : formulations imposées ?]` |
| Forme | Voix + **séquence du site** sur fond blanc : téléphone animé et barre de recherche où s'écrit « mehomies.com » (VF) |
| Moment d'apparition | Quand le site est mentionné (VF : sur « ce soir minuit sur le site mehomies.com ») |
| Destination | Site mehomies.com |
