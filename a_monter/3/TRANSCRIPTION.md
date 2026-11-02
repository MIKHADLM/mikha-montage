# Vidéo 3 : transcription (version sous-titres seuls)

Rush intégral, sans coupe. Temps des groupes calés sur les bouffées de voix mesurées dans le son.

Texte retenu :
Salut à toute l'équipe, juste pour vous dire, on vient de sortir un petit jeu vidéo sur le site mehomies.com à l'occasion d'Halloween. Il est dispo jusqu'à la fin de semaine. Et petite information supplémentaire : vous pouvez choper du coup un petit restock de t-shirts sur le site, mais aussi au pop-up, au pop-up Space Jam. Donc voilà, on compte sur vous les frères. Merci pour la force. Let's go.

Non écrits : les « euh » (9,9 s et 20,1 s).

Doutes : « dispo » (la reconnaissance hésite avec « disponible ») ; « de t-shirts » (la reconnaissance hésite avec « du t-shirt »).

## v02 : rush original (`IMG_8323_original.MOV`)

Même texte. Temps de la v01 + 0,100 s : le rush compressé avait perdu 0,1 s au début (mesuré sur le son à 1, 12 et 25 s). Copie des temps de la v01 dans `export/IMG_8323_sous-titres_v01_*.json`.
HDR HLG converti en SDR Rec.709 avec `hlg_vers_sdr_lut.py .5 .8` (paramètres : gain 0,5, genou 0,8), réglage comparé au rush compressé.

## Version complète (`IMG_8323_complet_v01`)

Retranscrit morceau par morceau sur `IMG_8323_sdr.mp4` (même son que le rush original). Ancienne transcription gardée dans `transcription/brut_rush-compresse/`, données de la v02 dans `export/IMG_8323_sous-titres_v02_*.json`.

| Morceau | Temps rush (s) | Texte reconnu | Décision |
|---|---|---|---|
| c00 | 0,56 → 5,56 | Salut à toute l'équipe … sur le site mehomies.com | Gardé, séparé en c00a et c00b au creux de son à 4,20 s |
| c01 | 5,94 → 6,96 | À l'occasion d'Halloween | Gardé |
| c02 | 7,48 → 9,54 | Il est dispo jusqu'à la fin de semaine | Gardé |
| c03 | 10,04 → 10,92 | Euh | Coupé |
| c04 | 11,26 → 12,72 | Et petite information supplémentaire | Gardé |
| c05 | 13,36 → 14,24 | Vous pouvez choper du coup | Gardé |
| c06 | 14,64 → 15,76 | Euh, un petit restock | c06b : gardé à partir de 15,14 s |
| c07 | 16,28 → 16,82 | de t-shirts | Gardé |
| c08 | 17,22 → 17,70 | Sur le site | Gardé |
| c09 | 18,12 → 18,80 | Mais aussi | Gardé |
| c10 | 19,16 → 21,24 | au pop-up, euh | Coupé (faux départ) |
| c11 | 22,68 → 24,12 | au pop-up Space Jam | c11a + c11b : pause de 0,44 s retirée |
| c12 | 25,30 → 26,66 | Donc voilà, on compte sur vous les frères | Gardé |
| c13 | 27,70 → 28,40 | Merci pour la force | Gardé |
| c14 | 28,72 → 29,02 | Let's go | Gardé |

La reconnaissance se trompe sur « au pop-up » (« Hoop, hoop ») : le mot a été reconnu au niveau du son et d'après la prise c10. Doutes inchangés : « dispo », « de t-shirts ».
