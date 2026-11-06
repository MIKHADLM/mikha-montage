# Transcription : vidéo 6

Rush `IMG_8398_sdr.mp4`, 14 morceaux (`transcrire.py`, seuil -40 dB). Temps des mots : aligneur (5/5 prises alignées).

| Morceau | Temps rush | Texte reconnu | Décision |
|---|---|---|---|
| c00 | 0.90 → 1.90 | C'est aujourd'hui les frères. | **gardé (P1, hook)** |
| c01 | 2.26 → 8.62 | On vous donne rendez-vous cet après-midi à 15h à la Condition Publique de Roubaix pour le premier événement physique auquel participe Mehomies. | **gardé (P2)** |
| c02 | 12.20 → 12.74 | Vous avez… | coupé : faux départ |
| c03 | 14.66 → 16.96 | C'est gratuit, vous aurez donc la possibilité de vous… | coupé : faux départ |
| c04 | 18.28 → 24.88 | C'est gratuit, vous aurez donc la possibilité de venir voir en vrai les t-shirts de la collection Mehomies Flag, ainsi que les derniers prop… | coupé : reprise inachevée (à signaler) |
| c05-c07, c09 | 26.5 → 36.1 | « C'est gratuit… » | coupés : faux départs |
| c08 | 33.70 → 34.00 | Ahem. | coupé : bruit |
| c10 | 37.08 → 43.34 | C'est gratuit, sur place vous retrouverez du stock pour la collection Mehomies Flag, mais aussi la possibilité de voir nos derniers prototypes. | **gardé (P3)** ; débit lent mais sans reprise (vérifié : retranscription seule de 37,08 → 39,7 s et énergie du son) |
| c11 | 43.94 → 45.36 | Des petites surprises sur lesquelles on travaille. | **gardé (P4)** |
| c12 | 45.86 → 47.54 | Bref, on espère vous voir « en nom bleu ». | coupé : reprise |
| c13 | 47.88 → 51.46 | Bref, on espère vous voir nombreux, merci pour la force, let's go ! | **gardé (P5)** |

Corrections : « Méomise », « Mehomie's » → Mehomies. Hésitations : `reperer_hesitations.py` ne signale que 3 « mots longs » (temps de whisper) ; l'aligneur les place à 0,4-0,5 s : pas d'hésitation. Montage : 19,5 s.
