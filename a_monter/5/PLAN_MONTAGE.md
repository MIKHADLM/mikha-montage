# Plan de montage : vidéo 5 (annonce Space Jam), DA rouge

> Monté directement en v01 sans validation préalable (mission M19, 2026-11-05). Tout est proposition. Traduction exacte : `plan.json`.

- **Hook (P1) :** titre en bloc « PREMIER / ÉVÉNEMENT / **MEHOMIES** / **CE WEEK-END** » (les mots dits), mots rouges derrière la tête avec contour. Autres titres possibles : « NOTRE / PREMIER / **POP-UP** / **MEHOMIES** » ; « CE / **SAMEDI** / **SPACE JAM** ».
- **Illustrations :**
  - P2 « ce samedi … Condition Publique de Roubaix » : affiche Space Jam entière (4:5) sur rouge, étiquette « SAMEDI 7 NOVEMBRE / Condition Publique, Roubaix », sous-titres masqués.
  - P3 « un village de créateurs avec une trentaine de stands » : texte en escalier sur fond rouge, mot par mot.
  - P4 « Vous pourrez vous procurer des t-shirts » : plan de coupe de Michaël (crash zoom Boxy Brésil) plein cadre, sous-titres de base.
  - P4 « de la collection Mehomies Flag » : défilé régulier Boxy France puis USA (stock validé), déclencheur -6 dB.
  - P5 « prototypes » : face cam (aucun visuel de prototype fourni).
- **Cadrages :** P2 × 1,12 ; P3 × 1 → 1,15 ; P4 × 1,08 ; P5 × 1,18 ; P6 × 1,1.
- **Son :** voix -14 LUFS ; musique de la vidéo 4 (départ 0 s) ; riser, clics (-4 dB), déclencheurs automatiques.
- **À signaler :** visage bas dans le cadre : les sous-titres (bas à 1 340 px) passent sur le menton et parfois la bouche.

## v02 (2026-11-05, retour de Michael sur la v01 : « est-ce que tu pourrais essayer de détourer les T-shirts qui ont été mis sur le fond rouge ? »)
- Boxy France et USA détourés (`assets/boxy_*_detoure.png`, `remotion/scripts/detourer_fond_blanc.py` : fond blanc relié au bord, bord doux de 2 px décontaminé du blanc), posés sur le rouge avec l'ombre qui suit leur forme. Bords vérifiés zoomés (col, manches, ourlet) : pas de halo blanc. Rien d'autre ne change.

## v03 (2026-11-05, retour de Michael sur la v02 : « Sur le fond rouge avec l'affiche, est-ce que ce serait possible de rajouter les sous-titres en plus des informations ? »)
- Sous-titres gardés pendant l'affiche (masque retiré), style habituel du fond rouge, sous l'étiquette (bas à 1 340 px, étiquette au-dessus de 1 180 px) : rien ne se chevauche, vérifié image par image (images 80 à 211).
- Lignes recalées pour la lecture : « ce samedi se tient / la 7e édition / de Space Jam / à la Condition Publique / de Roubaix » (« | » dans le texte relu) ; une ligne coupe aussi aux bords de chaque séquence (plus de « pas ce samedi » à cheval sur l'entrée de l'affiche).
