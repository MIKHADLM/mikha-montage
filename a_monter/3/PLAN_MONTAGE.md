# PLAN DE MONTAGE : jeu Fakhomies, restock, pop-up (test)

> **Rôle :** plan de la version complète de test de la vidéo 3. Monté sans validation préalable, à la demande de Michaël : tout est proposition. **Lecteurs :** Michaël et les agents (`plan.json`).

Rush : `IMG_8323_sdr.mp4` (30,1 s) · Montage : 18,30 s · Version : `export/IMG_8323_complet_v01.mp4` · Date : 2026-11-02

## 1. Texte retenu

Coupés : « euh » c03 (10,04 → 10,92 s), « euh » début de c06 (14,62 → 15,12 s), « au pop-up, euh » c10 (19,16 → 21,24 s), pause de 0,44 s entre « pop-up » et « Space Jam ». Les 3 signalements restants de `reperer_hesitations.py` (début lent sur « Un », « Merci », « Let's ») sont des mots dits doucement, vérifiés au niveau du son. Les 3 « mots longs » sont des fins de mots gardées.

| Phrase | Montage (s) | Texte | Prise |
|---|---|---|---|
| P1 | 0,00 → 3,73 | Salut à toute l'équipe, juste pour vous dire, on vient de sortir un petit jeu vidéo | c00a |
| P2 | 3,73 → 5,17 | sur le site mehomies.com | c00b |
| P3 | 5,17 → 6,33 | à l'occasion d'Halloween | c01 |
| P4 | 6,33 → 8,57 | Il est dispo jusqu'à la fin de semaine | c02 |
| P5 | 8,57 → 10,20 | Et petite information supplémentaire | c04 |
| P6 | 10,20 → 13,37 | Vous pouvez choper du coup un petit restock de t-shirts sur le site | c05, c06b, c07, c08 |
| P7 | 13,37 → 15,50 | mais aussi au pop-up Space Jam | c09, c11a, c11b |
| P8 | 15,50 → 17,00 | Donc voilà on compte sur vous les frères | c12 |
| P9 | 17,00 → 17,83 | Merci pour la force | c13 |
| P10 | 17,83 → 18,30 | Let's go | c14 |

## 2. Hook (P1)

| Proposition | Ligne 1 | Ligne 2 | Ligne 3 |
|---|---|---|---|
| A (montée) | ON VIENT DE SORTIR (blanc) | UN JEU VIDÉO (jaune) | MEHOMIES (jaune) |
| B | LE NOUVEAU (blanc) | JEU VIDÉO (jaune) | MEHOMIES (jaune) |
| C | UN JEU VIDÉO (blanc) | POUR HALLOWEEN (jaune) | MEHOMIES (jaune) |

Face cam × 1,21, riser, pas de sous-titres. Titre en haut (bas à y = 540) : à la place habituelle il cachait la bouche, le visage étant très bas dans ce rush.

## 3. Cadrages

| Phrase | Cadrage | Pourquoi |
|---|---|---|
| P1 | × 1,21 fixe | Hook |
| P5 | × 1,12 fixe | Phrase de 1,6 s |
| P6 | × 1 | Entre deux recadrages, coupée par le fond blanc |
| P7 | × 1,12 fixe | Coupée par le fond blanc |
| P8 | × 1 | Entre deux recadrages |
| P9 | × 1,12 fixe | Phrase courte |
| P10 | × 1,23 fixe | Dernière phrase |

P2, P3, P4 : couvertes par le fond blanc.

## 4. Séquences sur fond blanc

| Séquence | De … à … | Temps (s) | Contenu | Cohérence avec ce qui est dit |
|---|---|---|---|---|
| Barre de recherche | P2 | 3,73 → 5,17 | `barre-recherche`, prise à son image 18, sous-titres masqués | L'adresse s'écrit quand il la dit |
| Affiche | P3 | 5,17 → 6,33 | Affiche Fakhomies 4:5, recadrée pour retirer la date du bas | Le jeu d'Halloween |
| Jeu | P4 | 6,33 → 8,57 | Capture de partie 16:9 (salle de contrôle, puis caméra), étiquette FAKHOMIES / MEHOMIES GAME | Le jeu dont il parle |
| Défilé t-shirts | « un » → fin de P6 | 11,27 → 13,37 | 6 visuels Boxy France, Brésil, USA, intervalles réguliers (0,35 s), déclencheur -6 dB, sans étiquette | Le restock de t-shirts |
| Pop-up | « au » → fin de P7 | 14,20 → 15,50 | Affiche Space Jam 640 px sans agrandissement, étiquette 7 NOVEMBRE / Condition Publique, Roubaix | Le pop-up Space Jam |

**Non utilisés :** `site-mobile` (montre « Précommandes disponibles » et « 33 € », faux ou interdit ici) ; captures fixes du jeu ; cols de t-shirts.

## 5. Son

Voix -14 LUFS visée ; musique provisoire à -22,7 LUFS, de la fin du hook à la dernière image ; riser sur le hook ; clics à l'entrée de la barre, à l'entrée de la capture du jeu et à chaque retour au face cam ; déclencheur avant chaque photo. Pas de whoosh ni de caisse (usage non défini).

## 6. Questions

Voir `BRIEF.md`.
