# STATS : ce que donnent les vidéos publiées

> **Rôle :** relier le style d'un montage à ses résultats. Relevé 7 jours après la publication (J+7),
> par le MCP Metricool en lecture seule (marque mikha_dlm, blogId 3680334). **Lecteurs :** les agents
> (avant un plan de montage : qu'est-ce qui a marché ?) et Michaël. Procédure : skill
> `montage-facecam`, étape 9.

## Relevés

| Vidéo | Publiée | Relevé | Réseau | Durée | Vues | Portée | J'aime | Comm. | Partages | Enreg. | Temps moyen vu | Vue > 3 s / vue complète |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 Fakhomies (DA rouge pilote, v04) | 04/11 17:31 | 06/11 (J+2, partiel) | Instagram | 29 s | 494 | 315 | 14 | 0 | 1 | 0 | 6,2 s | 32 % regardent plus de 3 s |
| 4 Fakhomies | 04/11 17:31 | 06/11 (J+2, partiel) | TikTok | 29 s | 849 | — | 16 | 0 | 2 | — | — | — |
| 4 Fakhomies | 04/11 | 06/11 | YouTube Shorts | — | aucune donnée renvoyée par Metricool | | | | | | | |
| 5 Space Jam (DA rouge, v03) | 06/11 17:00 (programmée) | à faire le 13/11 (rappel) | | 20,5 s | | | | | | | | |

## Ce qu'on en retient (à compléter à chaque relevé)

- Vidéo 4 (J+2) : sur Instagram, seulement 32 % des vues passent 3 s et le temps moyen est de 6,2 s
  sur 29 s : le hook et les 5 premières secondes sont le levier n° 1. TikTok fait près de 2 fois les
  vues d'Instagram. À confirmer à J+7 (rappel le 11/11).

## Comment relever (résumé)

`getAnalyticsDataByMetrics`, `brandId` 3680334, du jour de publication à J+7 :
- Instagram Reels : `IGRE02` date, `IGRE03` texte, `IGRE23` vues, `IGRE11` portée, `IGRE10` j'aime,
  `IGRE07` commentaires, `IGRE12` enregistrements, `IGRE21` partages, `IGRE24` temps moyen vu (s),
  `IGRE27` rétention (%), `IGRE28` part des vues de plus de 3 s ;
- TikTok : `TKPO02`, `TKPO05`, `TKPO06` durée, `TKPO07` vues, `TKPO11` portée, `TKPO08`, `TKPO09`,
  `TKPO10`, `TKPO13` vidéo vue en entier (%), `TKPO15` temps moyen vu, `TKPO16` part « Pour toi » ;
- YouTube : connecteur `all videos`, `YTVV02`, `YTVV17` titre, `YTVV06` vues, `YTVV08` durée moyenne
  vue, `YTVV09`, `YTVV11`, `YTVV12` (les champs `YTVI…` sont abandonnés).
Une case vide (`null`) = Metricool ne fournit pas la donnée : l'écrire « — », ne rien inventer.
