# Plan de montage : vidéo 6 (jour J Space Jam), DA rouge

> Monté directement en v01 sans validation préalable (consigne de la mission, publication le 7/11 vers 11h30). Tout est proposition. Traduction exacte : `plan.json`. Base : vidéo 5.

- **Hook (P1, 1,1 s) :** titre en bloc « C'EST / **AUJOURD'HUI** / **LES FRÈRES** » (les mots dits), mots rouges derrière la tête avec contour, face cam × 1, riser. Autre titre possible : « C'EST / **AUJOURD'HUI** / **SPACE JAM** » (non dit).
- **Illustrations :**
  - P2 « rendez-vous cet après-midi à 15h à la Condition Publique de Roubaix » : affiche Space Jam entière (4:5) sur rouge, étiquette « SAMEDI 7 NOVEMBRE, 15H / Condition Publique, Roubaix », sous-titres gardés sous l'étiquette (comme la v03 de la vidéo 5).
  - P3 « sur place vous retrouverez du stock » : plan de coupe crash zoom Boxy Brésil plein cadre, texte en escalier rouge mot par mot « sur place / vous retrouverez / du stock » (les sous-titres blancs étaient illisibles sur le t-shirt blanc).
  - P3 « pour la collection Mehomies Flag » : défilé régulier Boxy France puis USA détourés, déclencheur -6 dB.
  - « prototypes », « petites surprises » : face cam (aucun visuel de prototype).
- **Cadrages :** P2 × 1,12 (coupée par l'affiche) ; P3 × 1 ; P4 × 1,18 ; P5 × 1,1.
- **Son :** voix -14 LUFS ; musique Fakhomies (départ 0 s) ; riser, clics (-4 dB), déclencheurs automatiques.

## v01 : contrôles et relecture (2026-11-06)
- `verifier_livraison.py` : **OK** (-14,2 LUFS, pic vrai -1,8 dBTP, son / rush 0 ms, bruitages 0 ms, aucune image isolée) ; couleur identique au rush (1,34/255). « À regarder » : clic de sortie de l'affiche (5,05 s) masqué par « Roubaix » pour la corrélation, retrouvé par earshot (-30 ms).
- Corrigé pendant la boucle : sous-titres blancs illisibles sur le t-shirt blanc du plan de coupe → texte en escalier rouge (tour 1) ; « à la Condition / Publique de Roubaix » coupé en deux (relecteur) → « à la Condition Publique » puis « de Roubaix » (tour 3).
- Laissé tel quel, comme la vidéo 5 (non relevé par Michael) : « Mehomies Flag » reste 3 images sur le face cam après le défilé (336-338) et les derniers sous-titres débordent de 2 images aux coupes ; une image rouge vide entre les deux t-shirts du défilé (312, fondu « Pose ») ; à partir de l'image 280 le texte rouge passe sur le drapeau (moins contrasté) ; « FRÈRES » à moitié derrière les cheveux (contour lisible).
- Suggestions du relecteur, à trancher par Michael : étiquette « AUJOURD'HUI, 15H » au lieu de « SAMEDI 7 NOVEMBRE, 15H » ; un visuel sur « C'est gratuit ».

## v02 (2026-11-06, retour de Michael sur la v01 : un « bref on espère » en trop)
- Faux départ « Bref, on esp… » retiré au début de la dernière phrase (sous-morceau c13b, début forcé sur l'attaque du 2e « Bref ») : 19,5 → 18,6 s. Rien d'autre ne change.
- Contrôle : **PAS OK** sur un seul point, l'avis d'earshot (écart médian des bruitages 29 ms pour un seuil de 25). Seul le déclencheur à 9,43 s a bougé chez earshot (-4 → +28 ms) ; le son de v01 et v02 est identique à cet endroit (corrélation : 0 ms, +0,12 dB, le gain de voix est passé de +5,4 à +5,6 dB). Mesure principale des bruitages : 0 ms. Fausse alerte à faire accepter par Michael.
