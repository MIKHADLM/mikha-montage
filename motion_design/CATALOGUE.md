# CATALOGUE : banque de motion design

> **Rôle :** liste des animations réutilisables d'une vidéo à l'autre, avec leur statut et la façon de les appeler. **Lecteurs :** Michaël (choisir, valider) et les agents (réutiliser avant de proposer du neuf).

Statuts : **proposé** (idée écrite, rien de produit) · **validé** (produit et accepté par Michaël) · **utilisé** (dans une vidéo publiée).
Chaque asset a son dossier ici : `PLAN.md` (choix et déroulé), `export/` (fichiers), `apercu.png` (planche d'images).

## Assets

| Identifiant | Ce que ça montre | Statut | Fichier | Durée | Quand l'utiliser | Dans un plan de montage | Utilisé dans |
|---|---|---|---|---|---|---|---|
| `site-mobile` | Téléphone neutre qui monte du bas en 3D ; le site mehomies.com s'allume, défile jusqu'au France Boxy Tee, zoom sur les tailles, choix de la taille M, « Ajouter au panier - 33 € » | Validé (2026-09-29), utilisé | `site_mobile/export/site-mobile_v01.mov` (ProRes 4444 transparent) | 6,07 s | Quand le site ou la commande en ligne est cité | Séquence `site` (avec la barre dessous, comme la VF) ou `motion` avec `"asset": "site-mobile"` | Vidéo 1 (VF) |
| `barre-recherche` | Barre de recherche en verre liquide : une goutte s'étire en capsule, « mehomies.com » est tapé, validation | Validé en usage (VF), réglages en attente (journal A4, A6) | `barre_recherche/export/barre-recherche_v01.mov` (ProRes 4444 transparent) | 3,8 s | Pour faire retenir l'adresse du site | Séquence `site` (sous le téléphone) ou `motion` avec `"asset": "barre-recherche"` | Vidéo 1 (VF) |

Aperçus : `site_mobile/apercu.png`, `barre_recherche/apercu.png`.

**À refaire si le site change :** `site-mobile` montre le site tel qu'il était le 2026-09-29 (« Précommandes disponibles »). Nouvelles captures : `node scripts/capturer_site.mjs ../motion_design/site_mobile` depuis `remotion/`.

## Propositions en attente

| Identifiant | Idée | Proposée le | Pour quelle vidéo |
|---|---|---|---|
| — | Aucune pour l'instant | | |

## Entrer dans la banque

1. Proposition validée par Michaël, puis produite (asset transparent, sans texte sauf demande).
2. Dossier `motion_design/<id>/` avec `PLAN.md`, `export/`, `apercu.png` (`python3 scripts/apercu_asset.py …`).
3. Une ligne ci-dessus et une ligne dans `remotion/src/motion/registre.ts`.
4. Une ligne dans `apprentissage/JOURNAL.md`.
