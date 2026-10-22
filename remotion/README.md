# Projet Remotion : montages du compte mikha_dlm

> **Rôle :** mode d'emploi du projet qui monte les vidéos avec Remotion. **Lecteurs :** les agents (qui montent) et Michaël (pour relancer un rendu).

La charte (`../CHARTE/`) reste la source de vérité ; la méthode de montage est dans le skill `../.claude/skills/montage-facecam/` (détail des commandes et des formats : `references/chaine-technique.md`). Ce projet est l'outillage : scripts, composants du style actuel, et **une seule composition, `Montage`, qui monte n'importe quelle vidéo d'après son `plan.json`** (aucun code à écrire par vidéo).

## Chaîne de montage d'une vidéo

Chaque vidéo arrive dans `../a_monter/<N>/` avec son rush et son dossier `assets/`. Commandes lancées depuis ce dossier.

| Étape | Commande ou fichier | Produit |
|---|---|---|
| 1. Transcription | `python3 scripts/transcrire.py ../a_monter/<N>` | `transcription/brut/` (morceau par morceau, reprises gardées) |
| 2. Choix | `transcription/choix.json` : prises gardées, texte relu (« \| » force une coupure de sous-titres) | — |
| 3. Découpage | `python3 scripts/decouper_transcription.py ../a_monter/<N>` | `decoupage.json`, `mots_montage.json`, `sous-titres.json`, `mots_rush.json` |
| 4. Plan | `../a_monter/<N>/plan.json` : traduction du plan de montage validé | — |
| 5. Médias | `python3 scripts/preparer_medias.py ../a_monter/<N> v<N>` (`--donnees` pour ne recopier que les JSON) | `public/v<N>/` (rush avec voix à -14 LUFS, musique, images, vidéos, JSON) et `public/charte/` |
| 6. Contrôle sur image fixe | `npx remotion still Montage <image>.png --frame=<n> --props='{"video":"v<N>"}'` | — |
| 7. Rendu | `npx remotion render Montage ../a_monter/<N>/export/<nom>_v01.mp4 --props='{"video":"v<N>"}'` | MP4 1080×1920, 30 i/s, H.264, BT.709 |
| 8. Son final | `python3 scripts/finaliser_son.py <export>` | Pic vrai plafonné à -1 dBTP (image copiée telle quelle) |
| 9. Contrôle | `python3 scripts/controler_export.py <export> --rush <rush> --image-montage <n> --image-rush <m>` | OK / À CORRIGER : format, loudness, pic vrai, silences, images noires, couleur |
| 10. Téléphone | `python3 scripts/apercu_telephone.py <export>` | Copie de moins de 29 Mo |

Aperçu interactif : `npm run dev` (Remotion Studio), composition `Montage`, propriété `video`.

**Pour DaVinci :** `python3 scripts/exporter_facecam.py ../a_monter/<N> v<N>` (face cam seul et EDL) ; `python3 scripts/exporter_sous_titres.py ../a_monter/<N>` (SRT par groupe et mot à mot, au moins 4 images par entrée).

## Motion design (assets à fond transparent)

Livrés sans fond et sans texte, en ProRes 4444 avec transparence. Banque : `../motion_design/CATALOGUE.md` ; chaque asset validé est aussi dans `src/motion/registre.ts` pour être joué par une séquence `motion` d'un plan.

| Étape | Commande | Produit |
|---|---|---|
| Captures du site mobile | `node scripts/capturer_site.mjs ../motion_design/site_mobile` | `captures/`, `public/site-mobile/`, `src/motion/donnees/site-mobile.json` |
| Rendu d'un asset | `npx remotion render Motion-SiteMobile ../motion_design/site_mobile/export/site-mobile_v01.mov --config=remotion.asset.config.ts` (idem `Motion-BarreRecherche`) | MOV ProRes 4444, 1080×1920, 30 i/s |
| Aperçu pour la banque | `python3 scripts/apercu_asset.py <asset.mov>` | `apercu.png` dans le dossier de l'asset |

`remotion.asset.config.ts` remplace `remotion.config.ts` pour ces rendus (ProRes 4444, images intermédiaires en PNG pour garder la transparence).

## Organisation

| Dossier / fichier | Contenu |
|---|---|
| `src/montage/MontageFacecam.tsx` | Composition `Montage` : face cam, cadrages, titre d'accroche, séquences sur fond blanc, sous-titres, musique, bruitages |
| `src/montage/donnees.ts` | Format de `plan.json`, ancres (phrase, mot), groupes de sous-titres, placement sur la timeline |
| `src/charte/tokens.ts` | Valeurs de la charte actuelle (direction artistique du 2026-09-30) |
| `src/charte/` | Composants du style : titre d'accroche, sous-titres, cadrage, fond blanc, photo arrondie, étiquette, partenaire, téléphone, verre liquide, polices |
| `src/motion/` | Assets de motion design (`SiteMobile`, `BarreRecherche`) et leur registre |
| `src/videos/v1/` | Vidéo 1 montée à la main dans l'ancienne direction (v01, v02), avec ses composants dans `ancien/` : ne plus s'en servir comme modèle |
| `scripts/` | Transcription, découpage, médias, contrôles, exports, captures, aperçus (Python, Node, ffmpeg, Pillow) |
| `public/` | Médias générés par les scripts : ne pas modifier à la main |

## Règles appliquées

- Le rush n'est jamais retouché en couleur : l'image est copiée sans réencodage avant le montage, et le rendu reste en BT.709.
- Le texte des sous-titres vient du texte relu (`choix.json`), jamais directement de la reconnaissance vocale.
- Aucune police, musique ou image n'est ajoutée si elle n'est pas dans la charte, dans la banque ou fournie avec la vidéo.
- Si la charte change, mettre à jour `src/charte/tokens.ts`.

## Licence Remotion

Remotion est gratuit pour un indépendant ou une structure de 3 personnes au plus ; au-delà, une licence d'entreprise est nécessaire ([conditions](https://www.remotion.pro/license)).
