# SYNCHRO : travailler sur MONTAGE depuis plusieurs Mac

> **Rôle :** comment l'espace MONTAGE reste identique sur les Mac de Michaël. **Lecteurs :** Michaël et les agents (Claude Code) de chaque Mac.

## Le principe

- Tout ce qui fait la **méthode, le style et la mémoire** est dans un dépôt Git privé : `git@github.com:MIKHADLM/mikha-montage.git`. Skill (`.claude/skills/montage-facecam`), charte (`CHARTE/`), outils (`remotion/`), journal (`apprentissage/`), banque de motion design, documents des vidéos (`a_monter/<N>/*.md`, `plan.json`, `transcription/choix.json`…).
- Les **médias lourds** ne sont pas dans Git (`.gitignore`) : rushes, `assets/`, `export/`, transcriptions brutes, `remotion/node_modules`, `remotion/public/charte` et `public/v*`. Ils passent d'un Mac à l'autre par AirDrop, Google Drive ou disque, **seulement pour la vidéo qu'on monte**.
- Une vidéo se monte **sur un seul Mac à la fois**. Si on change de Mac en cours de montage : synchroniser, puis copier le rush et `assets/` (et `transcription/brut/` pour éviter de retranscrire).

## La règle (agents)

1. **En début de session** sur MONTAGE : `./synchro.sh` (récupère les changements de l'autre Mac).
2. **Après chaque étape qui change un fichier suivi** (plan validé, nouvelle version, retours notés, règle ajoutée à la charte ou au skill, journal) : `./synchro.sh "vidéo N : <ce qui a changé>"`.
3. **Conflit** au `pull --rebase` : ne rien écraser. Montrer à Michaël les fichiers en conflit, les fusionner (garder les deux apports quand c'est possible : journal, retours), puis `git rebase --continue` et `./synchro.sh`.
4. Ne jamais forcer un envoi (`push --force`) ni supprimer l'historique.

## Installer sur un nouveau Mac

Voir `INSTALLATION_NOUVEAU_MAC.md`.
