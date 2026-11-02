# CHECKLIST DE VALIDATION : la vidéo est-elle publiable ?

> **Rôle :** critères à vérifier avant publication. **Lecteurs :** l'humain et les agents (passer cette liste sur l'export final). Une vidéo n'est publiable que si **toutes** les cases sont cochées, ou si l'écart est justifié dans le brief.

Vidéo : `IMG_8323_complet_v01.mp4`  ·  Version : v01 (test)  ·  Date : 2026-11-02

Cases cochées = vérifié par mesure ou sur les images clés. Non cochées = à juger à l'écoute ou au visionnage par Michaël, ou sans objet pour un test (publication).

Direction artistique de référence : la VF de Michaël (`08_references/videos/ref_mikha-dlm_vf-fin-precommande_v01.mp4`), règles mises à jour le 2026-09-30.

## Montage

- [ ] Aucun mot coupé (début et fin de chaque phrase entendus en entier)
- [x] Aucun silence restant (tous coupés) et pas de blanc involontaire (image noire, plan vide)
- [ ] Aucune hésitation restée (bout de phrase redit, « euh », regard vers les notes) ; chaque plan commence sur le premier mot et finit sur le dernier ; ≈ 0,15 s entre deux phrases enchaînées (règles du 2026-10-01)
- [x] Coupes sèches uniquement
- [ ] Un nouveau cadrage du face cam à chaque phrase (zoom progressif sur les longues phrases, recadrage fixe ailleurs), aucun dézoom
- [ ] Rythme cohérent avec les phrases, le texte et l'ambiance de la vidéo (brief)
- [ ] Durée conforme au brief et à `05_formats/FORMATS.md`

## Hook

- [x] Titre d'accroche : reformulation courte de la phrase, 3 lignes Gilroy Heavy en majuscules, bords alignés, mots forts en jaune `#FFB900` et plus grands
- [x] Présent dès la 1re image, retiré à la coupe qui suit la phrase d'accroche ; sous-titres masqués pendant ce temps
- [ ] Riser dont la fin tombe avec la fin de la phrase ; musique qui démarre juste après

## Texte

- [ ] Sous-titres **incrustés** dans la vidéo, sans faute, tous les mots dits écrits
- [ ] Chaque groupe de 1 à 3 mots apparaît quand son premier mot est prononcé, jamais avant
- [x] Sous-titres en Gilroy ExtraBold, blancs sur le face cam, noirs sur fond blanc, sans contour ; ombre seulement si la tenue est claire (`03_motion/SOUS-TITRES.md`)
- [x] Sous-titres masqués quand un texte à l'écran montre déjà les mots dits (étiquette, adresse dans la barre de recherche)
- [ ] Majuscule sur la première lettre du premier mot d'une phrase seulement ; nombres en chiffres ; pas de ponctuation
- [ ] Noms propres bien écrits : Mehomies, BAG, Boxy Tee, Baby Tee
- [x] Étiquettes : le nom correspond au produit montré (ex. « BABY TEE » sur la photo du Baby Tee)
- [ ] Prix, dates et tailles identiques à ceux vérifiés dans le brief

## Mise en page

- [ ] Zones sûres respectées (voir `02_design/DESIGN.md`, section 7) ; exception acceptée : barre de recherche et sous-titres de la séquence du site
- [x] Contrastes lisibles : pas de texte jaune sur fond blanc
- [ ] Taille minimale des textes respectée
- [ ] Logo ou étiquette partenaire : taille et zone de protection respectées

## Son

- [x] Voix vers -14 LUFS
- [ ] Musique ≈ 8,5 dB sous la voix, de la fin du hook à la dernière image (aucun passage où elle couvre la parole)
- [x] Pas d'écrêtage ni de saturation : pic vrai à -1 dBTP au plus
- [ ] Musique = celle fournie par Michaël avec la vidéo ; bruitages pris dans `06_assets/sfx/` : riser (hook), clic (entrées et sorties du fond blanc), déclencheur (photos)

## Charte

- [x] Couleurs de `02_design/DESIGN.md` uniquement : jaune `#FFB900`, blanc, noir ; **pas de rouge ni de jaune pâle** (abandonné le 2026-10-01)
- [x] Typographies de `07_typographies/` uniquement : Gilroy Heavy, ExtraBold, Medium Italic ; **pas de Permanent Marker**
- [x] Séquences d'illustration sur **fond blanc uni**, face cam caché, chacune sur une idée entière ; **pas de fond_1**
- [x] Défilé de visuels : même temps d'affichage pour chacun, déclencheur à -6 dB
- [ ] Animations et transitions autorisées uniquement (`03_motion/MOTION.md`)
- [ ] Rush principal non retouché en couleur (déjà étalonné par Michaël)

## Fin

- [ ] Appel à l'action présent (formulation conforme au brief) ; si le site est cité : séquence du site (téléphone et barre de recherche)
- [x] Fin sur la dernière phrase en face cam, musique coupée net (ou carte de fin prévue par le brief)

## Publication

- [ ] Légende, hashtags et mentions conformes à `05_formats/FORMATS.md`
- [ ] Couverture prête
- [ ] Mentions obligatoires présentes (`01_marque/MARQUE.md`)

## Écarts constatés

| Écart | Justifié dans le brief ? | Décision |
|---|---|---|
| Plan non validé avant le rendu | Oui (test) | À Michaël |
| Musique générée pour le test, jamais écoutée (charte : fournie par Michaël) ; ≈ 8 dB sous la voix | Oui | Provisoire, à remplacer |
| Rush HDR converti en SDR par LUT (charte : aucune LUT) ; 24 i/s passé en 30 i/s | Oui | À confirmer : rush étalonné ? |
| Fond blanc ≈ 45 % du temps (VF ≈ 25 %) | Non, choix de l'agent pour montrer jeu, t-shirts et pop-up | À juger |
| Titre d'accroche en haut (y ≈ 285 à 540), visage trop bas | Oui | À juger |
| Sous-titres sur le bas du visage, parfois sur la bouche (position de charte gardée) | Oui | À juger |
| Hook de 3,73 s (VF 2,37 s) | Non : phrase longue | À juger |
| Site : barre seule, `site-mobile` écarté (précommandes, prix) | Oui | Refaire l'asset si besoin |
| Jeu : capture et affiche à la place du téléphone ; affiche recadrée sans date | Oui | À juger |
| Pop-up : image carrée de 640 px, format nouveau | Oui | À juger |
| Clic : ajouté à l'entrée de la barre, retiré entre deux séquences blanches collées | Lecture de `SON.md` | À confirmer |
