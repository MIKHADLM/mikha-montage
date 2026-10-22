# 06_assets : assets de marque

> **Rôle :** stocke tous les fichiers réutilisables dans les vidéos et fixe leurs conventions de nommage. **Lecteurs :** les agents (pour trouver et référencer les fichiers) et l'humain (pour les déposer).

**Règle :** logos, produits, partenaires, éléments graphiques, icônes et musiques sont **fournis avec chaque vidéo à monter** (chemins dans le brief). Cette arborescence n'est pas à remplir d'avance : elle sert de rangement et d'archive. Déjà en place : les bruitages (`sfx/`) et les étiquettes BAG (`partenaires/`). fond_1 (`textures/`) est abandonné depuis le 2026-09-30 (fond blanc uni) et gardé pour archive.

Les fichiers déposés par Michaël dans `CHARTE/a_ranger/` sont rangés ici (ou dans `07_typographies/` pour les polices) par l'agent.

## Sous-dossiers

| Dossier | Contenu |
|---|---|
| `logos/` | Logos (signature du compte, Mehomies, autres versions) |
| `produits/detoures/` | Produits détourés, PNG transparents |
| `produits/photos/` | Photos portées, gros plans |
| `partenaires/` | Logos et éléments de BAG et d'autres partenaires |
| `elements-graphiques/` | Formes, cadres, tracés signature |
| `textures/` | Textures et grains |
| `luts/` | Fichiers `.cube` d'étalonnage |
| `icones/` | Icônes |
| `sfx/` | Bruitages |
| `musique/` | Pistes musicales validées |

## Convention de nommage commune (proposition, à valider)

Format : `type_sujet_variante_vNN.extension`

- minuscules, sans accents, sans espaces ;
- mots séparés par des tirets `-`, blocs séparés par des tirets bas `_` ;
- numéro de version sur deux chiffres : `v01`, `v02` ;
- ne jamais écraser un fichier validé : créer la version suivante.

| Élément | Règle |
|---|---|
| Noms propres dans les noms de fichier | `mehomies`, `bag`, `boxy`, `baby-tee` (minuscules) |
| Orthographe à l'écran | Voir `01_marque/TON.md` (le nom de fichier ne fait pas foi) |
| Exemple logo | `logo_mehomies_principal_v01.svg` |
| Exemple produit | `produit_mehomies-flag_boxy_[pays]_detoure_v01.png` |
| Exemple photo | `photo_mehomies-flag_baby-tee_[pays]_porte-face_v01.jpg` |

- **Validation de cette convention :** `[À COMPLÉTER : valider ou modifier la proposition ci-dessus]`
- **Fichier à jour avec les assets validés (facultatif) :** `[À COMPLÉTER : ex. un inventaire ASSETS.md, oui ou non]`
- **Règles de résolution minimale (px) et de poids maximal :** `[À COMPLÉTER]`
