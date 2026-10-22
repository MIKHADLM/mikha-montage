# Motion design : le site mehomies.com en version mobile

> **Rôle :** choix validés, déroulé et fabrication de l'animation qui montre le site sur un téléphone. **Lecteurs :** Michaël et les agents.

## 1. Validé par Michaël (2026-09-29)

| Choix | Décision |
|---|---|
| Proposition | 1, la visite guidée |
| Support | Téléphone neutre : contour noir, sans marque (`CHARTE/02_design/DESIGN.md`, section 4) |
| Image du site | Captures haute définition du vrai site, animées dans Remotion |
| Livraison | Asset sur **fond transparent**, **sans texte** : Michaël pose l'animation et ajoute le texte dans DaVinci |
| Entrée | Le téléphone monte du bas avec une petite rotation 3D, puis le site s'allume sur l'écran (idée de Michaël) |
| Parcours | Accueil → France Boxy Tee → taille M → « Ajouter au panier - 33 € » (proposé par défaut, pas d'objection) |
| Son | Déclencheur de la charte à l'arrivée du téléphone (piste audio du fichier, à couper si besoin) |

## 2. Déroulé de la v01 (182 images à 30 i/s, 6,07 s)

| Images | Secondes | À l'écran | Mouvement |
|---|---|---|---|
| 0 | 0 | Image vide (le téléphone est sous le cadre) | : |
| 0 → 18 | 0 → 0,6 | Le téléphone, écran éteint, monte du bas | Ralentit à l'arrivée ; échelle 0,9 → 1 |
| 0 → 24 | 0 → 0,8 | Il se redresse | Rotation 3D X 22°, Y -14°, Z 4° → 0 |
| 16 → 26 | 0,53 → 0,87 | Le site s'allume sur l'écran | L'écran noir s'efface |
| 32 → 56 | 1,07 → 1,87 | Accueil : mascotte, bandeau « Précommandes disponibles », grille des t-shirts | Défilement au doigt |
| 60 | 2 | Toucher sur le France Boxy Tee | Cercle gris |
| 66 → 78 | 2,2 → 2,6 | La page produit arrive par la droite | L'accueil est poussé à gauche et assombri |
| 82 → 106 | 2,73 → 3,53 | La page descend jusqu'au bouton ; zoom sur les tailles | Zoom × 1,9 |
| 110 | 3,67 | Toucher sur M | Cercle gris |
| 114 | 3,8 | M en noir, bouton « Ajouter au panier - 33 € » | : |
| 134 → 152 | 4,47 → 5,07 | Retour au repos : photo, prix, tailles et bouton visibles | Dézoom |
| 152 → 181 | 5,07 → 6,07 | Téléphone au repos | Fixe : à couper ou à prolonger dans DaVinci |

Durées et courbes : `CHARTE/03_motion/MOTION.md`, section 2 bis (propositions à régler au visionnage).

## 3. Fichiers

| Fichier | Contenu |
|---|---|
| `export/site-mobile_v01.mov` | L'asset : ProRes 4444 avec transparence, 1080×1920, 30 i/s, BT.709, 6,07 s ; son : déclencheur à -24 LUFS |
| `captures/accueil.png`, `produit.png`, `produit_taille-m.png` | Captures du 2026-09-29, après le retrait du jeu concours ; 390 points de large à densité 3 (1 170 px) |
| `captures/positions.json` | Position des éléments animés (carte du Boxy Tee, tailles, bouton) |

## 4. Refaire l'animation (depuis `MONTAGE/remotion/`)

1. Nouvelles captures, après tout changement du site : `node scripts/capturer_site.mjs ../motion_design/site_mobile`. Les positions se mettent à jour seules.
2. Rendu : `npx remotion render Motion-SiteMobile ../motion_design/site_mobile/export/site-mobile_v02.mov --config=remotion.asset.config.ts`.

Code : `remotion/src/motion/SiteMobile.tsx` (déroulé), `remotion/src/charte/Telephone.tsx` (téléphone et toucher).

## 5. Contrôles de la v01

- Image 0 entièrement transparente ; téléphone au repos de x = 272 à 808 et de y = 237 à 1 347 : dans la zone sûre.
- Posé sur le face cam de la vidéo 1 : bords nets, ombre douce, contour lisible sur le t-shirt noir.
- Aucun texte ajouté ; seul le texte du site apparaît.

## 6. Points ouverts

- Sur mobile, le titre « PRODUITS » touche le bandeau noir depuis le retrait du jeu concours ; on le voit pendant le défilement. Si tu ajoutes un espace sur le site, il suffit de refaire les captures et le rendu.
- Les captures montrent le site tel qu'il était le 2026-09-29 (« Précommandes disponibles ») : à refaire si l'affichage change.
- Une version sur fond vert est possible si un logiciel ne lit pas la transparence.
