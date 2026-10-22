# Apprendre à chaque montage

Le style de Michaël se précise vidéo après vidéo. Ce skill doit s'améliorer avec lui : chaque retour
est une information sur ce qu'il veut. Objectif mesurable : **moins de corrections d'une vidéo à
l'autre**.

## Où vit la mémoire

| Fichier | Contenu | Qui décide |
|---|---|---|
| `a_monter/<N>/RETOURS.md` | Retours de cette vidéo, mot pour mot, version par version, et ce qui a été fait | Michaël (retours), l'agent (application) |
| `apprentissage/JOURNAL.md` | Toutes les leçons, dans l'ordre, avec leur destination et leur statut ; règles en attente ; indicateurs par vidéo | L'agent l'écrit, Michaël valide les règles |
| `CHARTE/` | Les règles de **style** validées | Michaël |
| Ce skill (`SKILL.md`, `references/`) | Les règles de **méthode** validées | Michaël |
| `remotion/` | Les outils : un bug corrigé ou un réglage de composant | L'agent, en le disant |

## La boucle

1. **Noter** chaque retour dans `RETOURS.md`, mot pour mot, avec la version concernée. Si le retour
   est ambigu, poser une question plutôt que deviner.
2. **Appliquer** à la vidéo en cours : nouvelle version, sans écraser la précédente.
3. **Classer** le retour :
   - propre à cette vidéo (un mot, un choix de photo) ;
   - règle de style qui vaut pour toutes les vidéos → charte ;
   - règle de méthode (ordre, vérification, façon de décider) → ce skill ;
   - défaut d'un outil → scripts ou composants.
4. **Proposer** en fin de vidéo : « Je propose d'en faire une règle : … ». Ne mettre à jour la charte
   ou le skill qu'après son accord ; noter « confirmé par Michaël le <date> » dans la charte.
5. **Consigner** dans `apprentissage/JOURNAL.md` : la leçon, sa destination, son statut (appliquée,
   en attente, refusée), et les indicateurs de la vidéo (nombre de versions, nombre de retours).

## Quand Michaël monte lui-même une version

C'est la meilleure source : ses valeurs exactes. Lui demander la timeline DaVinci (`.drt`) et
l'analyser comme `a_monter/1/ANALYSE_VF.md` :
- le `.drt` est une archive zip de XML ; `SeqContainer/*.xml` contient les pistes et les clips ;
- les compositions Fusion (titres Text+) sont en zlib, avec 4 octets de longueur devant ; les outils
  sont dans un second bloc zlib ;
- les réglages de clip (`EffectFiltersBA`) sont en protobuf, compressé zstd quand l'octet d'en-tête
  vaut 0x81 : paramètre 42/43 = zoom, 40/41 = position, 95 = gain audio en dB ; images-clés en
  enregistrements de 16 octets (image, drapeaux, valeur double).
Compléter par des mesures sur la vidéo exportée (positions, couleurs, niveaux).

## Faire évoluer le skill lui-même

- Garder `SKILL.md` court : les détails vont dans `references/`.
- Chaque changement du skill est noté dans le journal (date, quoi, pourquoi).
- Une règle qui ne sert plus est retirée ou marquée « abandonnée », jamais laissée en contradiction
  avec la charte.
