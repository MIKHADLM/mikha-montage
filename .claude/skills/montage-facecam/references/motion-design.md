# Motion design : proposer, produire, mettre en banque

Le motion design illustre un propos quand aucune photo ne convient, et chaque asset réussi enrichit
une banque réutilisable (`motion_design/CATALOGUE.md`). Règle de Michaël : **il valide les
propositions avant que l'agent génère ou anime quoi que ce soit.**

## 1. Repérer les occasions

En lisant la transcription, noter les passages où l'image aiderait :

| Propos | Idées d'illustration |
|---|---|
| Le site, une application, commander en ligne | Téléphone et barre de recherche (banque) |
| Un chiffre, un prix, une durée, un délai | Chiffre qui s'affiche ou compte, compte à rebours |
| Une liste, des étapes, un processus | Éléments qui apparaissent un par un |
| Une comparaison, un avant / après | Deux éléments côte à côte |
| Des produits, des variantes | Grille, défilement, produits qui sortent d'un écran |
| Un partenaire, une collaboration | Étiquette animée, logos réunis |

Ne pas en proposer partout : une ou deux par vidéo au plus, là où le face cam seul est faible.

## 2. La banque d'abord

Lire `motion_design/CATALOGUE.md`. Un asset existant qui convient se joue avec une séquence
`motion` (ou `site`) dans `plan.json`, sans rien produire.

## 3. Proposer

Une proposition par passage, avec le modèle `modeles/PROPOSITION_MOTION.md` : ce que ça montre, sur
quel support, déroulé (temps / à l'écran / mouvement), durée, son, assets nécessaires, où dans la
vidéo, et réutilisation possible. Donner 2 ou 3 variantes quand le choix est ouvert, avec une
recommandation. Les mettre dans le plan de montage ; attendre la réponse de Michaël.

## 4. Produire (après accord)

- Un composant Remotion dans `remotion/src/motion/<Nom>.tsx`, avec les valeurs de la charte
  (`src/charte/tokens.ts`) ; une composition dans `src/Root.tsx`.
- Fluidité : au plus ≈ 115 px de déplacement par image, sauf une entrée rapide voulue ; courbes
  douces ; vérifier sur une planche d'images avant le rendu.
- **Asset sans texte** (Michaël ajoute le texte dans DaVinci) et **sur fond transparent**, sauf
  demande contraire : ProRes 4444 avec couche alpha
  (`npx remotion render <Id> … .mov --config=remotion.asset.config.ts`).
- Contrôles : image 0 vide, transparence propre posée sur le face cam, élément dans la zone sûre.
- Un dossier `motion_design/<id>/` : `PLAN.md` (choix, déroulé, fichiers, comment le refaire),
  `export/<id>_v01.mov`, `apercu.png` (`scripts/apercu_asset.py`).

Exemples : `motion_design/site_mobile/` (téléphone, captures du vrai site par
`scripts/capturer_site.mjs`) et `motion_design/barre_recherche/` (verre liquide).

## 5. Mettre en banque

Quand Michaël juge l'asset utile :
1. Une ligne dans `motion_design/CATALOGUE.md` : identifiant, description, statut, fichier, durée,
   quand l'utiliser, comment l'appeler dans un plan, aperçu, vidéos où il sert.
2. Une ligne dans `remotion/src/motion/registre.ts`, pour le jouer dans un montage.
3. Le noter dans `apprentissage/JOURNAL.md`.

Statuts : **proposé** (idée écrite) → **validé** (produit et accepté) → **utilisé** (dans une vidéo
publiée). Une nouvelle version d'un asset ne remplace jamais la précédente : `_v02`, et la fiche le dit.
