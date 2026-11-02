# BRIEF vidéo 3 : jeu Fakhomies, restock, pop-up (test du skill)

> **Rôle :** brief de la version complète de test. **Lecteurs :** Michaël et les agents.

- **Statut :** test à distance, non publié, plan non validé par Michaël avant le rendu (demandé ainsi).
- **Rush :** `IMG_8323_sdr.mp4` = image SDR de la v02 (`IMG_8323_original.MOV` HEVC HLG, 24 i/s, converti par `hlg_vers_sdr_lut.py`, passé en 1080 × 1920, 30 i/s) + son d'origine. Rush définitif : à confirmer.
- **Hypothèses :** restock = Boxy France, Brésil, USA. Aucun stock ni prix à l'écran. Aucune date de fin de jeu à l'écran, seule la voix en parle. Pop-up : seulement ce qui est lu sur l'affiche ou dit par Michaël (7 novembre, Condition Publique, Roubaix).
- **Musique :** `assets/musique_test_generee.wav`, générée par `generer_musique_test.py`, autorisée pour ce test, **provisoire, jamais écoutée**. Pour la remplacer : poser la piste dans `assets/`, changer `musique` dans `transcription/choix.json`, relancer `preparer_medias.py` puis le rendu.
- **Assets :** copiés de `assets_candidats/` (sources : `assets_candidats/SOURCES.md`) dans `assets/`.

## Questions pour Michaël

1. Le restock porte bien sur les Boxy France, Brésil, USA ?
2. Titre d'accroche : A, B ou C (`PLAN_MONTAGE.md`) ? Titre en haut accepté pour un rush où le visage est bas ?
3. Sous-titres à leur place de charte : sur ce rush ils tombent sur le bas du visage. On les garde, ou on filme moins bas ?
4. Il dit « dispo » ou « disponible » (P4) ? « de t-shirts » ou « du t-shirt » (P6) ? La reconnaissance hésite.
5. Le jeu était cassé en ligne au moment de la collecte (`SOURCES.md`) : à vérifier avant de publier « il est dispo ».
