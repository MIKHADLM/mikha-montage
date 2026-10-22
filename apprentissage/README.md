# apprentissage : la mémoire des montages

> **Rôle :** garder trace de ce que chaque montage apprend, pour que le style et la méthode s'améliorent d'une vidéo à l'autre. **Lecteurs :** Michaël (suivi, validation des règles) et les agents (lu au début de chaque montage par le skill `montage-facecam`).

## Comment ça marche

1. Pendant un montage, chacun de tes retours est noté mot pour mot dans `a_monter/<N>/RETOURS.md` et appliqué.
2. En fin de vidéo, l'agent te propose de transformer en **règle** ce qui vaut pour toutes les vidéos.
3. Une règle acceptée va dans la **charte** (`CHARTE/`, pour le style) ou dans le **skill** (`.claude/skills/montage-facecam/`, pour la méthode). Tant que tu n'as pas dit oui, elle reste « en attente » dans le journal.
4. Le **journal** (`JOURNAL.md`) garde toutes les leçons dans l'ordre, avec leur destination, et un bilan par vidéo : le nombre de retours doit baisser avec le temps.

Rien n'entre dans la charte ou le skill sans ton accord.

## Fichiers

| Fichier | Contenu |
|---|---|
| `JOURNAL.md` | Leçons, règles en attente, bilan par vidéo, évolutions du skill |
| `a_monter/<N>/RETOURS.md` | Tes retours sur une vidéo, version par version |
