# CHECKLIST DE VALIDATION : la vidéo est-elle publiable ?

> **Rôle :** critères à vérifier avant publication. **Lecteurs :** l'humain et les agents (passer cette liste sur l'export final). Une vidéo n'est publiable que si **toutes** les cases sont cochées, ou si l'écart est justifié dans le brief.

Vidéo : annonce du pop-up, `export/annonce-popup_v03.mp4`  ·  Version : v03, **validée par Michaël le 2026-10-01**  ·  Date : 2026-10-01

Case cochée = vérifié par l'agent par une mesure (`controler_export.py`, images fixes, planche d'images clés). Case vide = à juger par Michaël à l'écoute ou au visionnage, ou hors du montage.

## Montage

- [ ] Aucun mot coupé (début et fin de chaque phrase entendus en entier) : *à l'écoute*
- [x] Hésitations : chaque prise gardée passée à `reperer_hesitations.py` : aucune répétition, aucun « euh », aucun début lent ni fin qui traîne (voix franche à moins de 0,2 s du début et 0,4 s de la fin de chaque prise, v03)
- [x] Aucun silence restant (aucun passage de 0,3 s sous -40 dB) et pas d'image noire
- [x] Coupes sèches uniquement
- [x] Un nouveau cadrage du face cam à chaque phrase (zoom progressif sur P4, seule phrase face cam de 4 s et plus d'un seul tenant ; fixe ailleurs), aucun dézoom progressif
- [ ] Rythme cohérent avec les phrases, le texte et l'ambiance de la vidéo : *au visionnage*
- [ ] Durée conforme au brief et à `05_formats/FORMATS.md` : 31,72 s ; durée cible non fixée

## Hook

- [x] Titre d'accroche : « LE PREMIER / POP-UP / MEHOMIES », 3 lignes Gilroy Heavy en majuscules, bords alignés, « POP-UP » et « MEHOMIES » en jaune `#FFB900` (un seul jaune), « POP-UP » le plus grand
- [x] Présent dès la 1re image, retiré à la coupe qui suit la phrase d'accroche (2,87 s) ; sous-titres masqués pendant ce temps
- [x] Riser dont la fin tombe avec la fin de la phrase ; musique qui démarre juste après (placement automatique)

## Texte

- [x] Sous-titres **incrustés** dans la vidéo, tous les mots dits écrits (texte relu, `TRANSCRIPTION.md`)
- [x] Chaque groupe de 1 à 3 mots apparaît quand son premier mot est prononcé (P4 et « Je ne peux » recalés en v03 : prises retranscrites dès le premier mot)
- [x] Sous-titres en Gilroy ExtraBold, blancs sur le face cam, noirs sur fond blanc ; ombre sur le face cam (tenue claire, règle du 2026-10-01)
- [x] Sous-titres masqués quand un texte à l'écran montre déjà les mots dits (étiquette « MEHOMIES FLAG ») et pendant P2 (date et lieu écrits sous la couverture, demande de Michaël)
- [x] Majuscule sur la première lettre du premier mot d'une phrase seulement ; nombres en chiffres (« 7 novembre ») ; pas de ponctuation
- [x] Noms propres bien écrits : Mehomies, Mehomies Flag, Condition Publique, Space Jam
- [x] Étiquettes : « MEHOMIES FLAG » sur la photo du Boxy porté (design USA de la collection Flag)
- [x] Prix, dates et tailles : seule la date est écrite (« 7 NOVEMBRE », identique aux affiches) ; lieu « Condition Publique, Roubaix » (affiches : « la condition publique · Roubaix »)

## Mise en page

- [x] Zones sûres respectées : couverture de y = 449 à 948 et étiquette jusqu'à y = 1 170, réduite à 690 px de large au plus ; photos de y = 250 à 1 112 ; sous-titres à y ≈ 1 385 comme la VF (dépassement de 20 px déjà accepté)
- [x] Contrastes : pas de texte jaune sur fond blanc
- [ ] Taille minimale des textes : non fixée par la charte
- [x] Logo ou étiquette partenaire : sans objet (aucun partenaire)

## Son

- [x] Voix vers -14 LUFS (mix final -14,6 LUFS)
- [x] Musique ≈ 8,5 dB sous la voix (-22,7 LUFS), de la fin du hook à la dernière image
- [ ] Aucun passage où la musique couvre la parole : *à l'écoute*
- [x] Pic vrai -1,2 dBTP (maximum -1)
- [x] Musique = `assets/music.mp3` fournie par Michaël, prise dès le début de la piste ; bruitages de `06_assets/sfx/` : riser (hook), clic (sorties du fond blanc), déclencheur (chaque photo ; -6 dB dans la rafale des t-shirts, demande de Michaël)

## Charte

- [x] Couleurs : jaune, blanc, noir ; ni rouge, ni jaune pâle
- [x] Typographies : Gilroy Heavy, ExtraBold, Medium Italic ; pas de Permanent Marker
- [x] Séquences d'illustration sur fond blanc uni, face cam caché, chacune sur une idée entière
- [x] Animations et transitions : coupes sèches uniquement
- [x] Rush principal non retouché en couleur : écart moyen 1,44 / 255 entre le montage et le rush (image 463 / 4666)

## Fin

- [ ] Appel à l'action : aucun dans la vidéo (« je vous en parlerai dans les semaines qui arrivent ») ; brief à compléter
- [x] Fin sur la dernière phrase en face cam (× 1,23), musique coupée net

## Publication

- [ ] Légende, hashtags et mentions conformes à `05_formats/FORMATS.md`
- [ ] Couverture prête
- [ ] Mentions obligatoires présentes (`01_marque/MARQUE.md`)

## Écarts constatés

| Écart | Justifié dans le brief ? | Décision |
|---|---|---|
| Ombre sous les sous-titres blancs du face cam (celle du titre d'accroche : 5 px vers le bas, 7 px de flou, noir à 60 %) | Oui : t-shirt blanc imprimé sous le visage | Gardée par Michaël le 2026-10-01 ; règle « tenue claire » dans `SOUS-TITRES.md` |
| Couverture 16:9 + étiquette date / lieu (écarts identiques à ceux de l'étiquette produit) | Demande de Michaël sur la v01 ; placement proposé par l'agent | Validé avec la v03 |
| T-shirts détourés posés dans le cadre photo arrondi, sur blanc, avec 60 px de marge | Les détourés ne sont pas encore définis dans la charte (DESIGN.md §4) | Validé avec la v03 |
