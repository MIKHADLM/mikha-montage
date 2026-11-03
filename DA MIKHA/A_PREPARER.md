# Ce qu'il reste à préparer avant le premier montage dans la nouvelle DA

> Liste établie le 2026-11-03, après les décisions de `DECISIONS.md`. But : un premier montage le
> plus soigné possible, et un protocole qu'on peut répéter vidéo après vidéo. Rien ici n'est validé :
> ce sont des questions et des propositions.

## 1. Décisions de style qui manquent encore

### Titre d'accroche
- ~~Petite ligne, son, sortie, ombre~~ : réglés le 2026-11-03 (titre en bloc 06, riser + coupe sèche, ombre portée ; voir `DECISIONS.md`).
- **Règles de choix du mot géant** : quel mot du hook devient géant ? Combien de lettres au plus
  (un mot de 12 lettres en pleine largeur devient tout petit) ? Que faire avec deux mots, un nombre,
  un nom propre ?
- **Cas où le titre ne passe pas derrière la tête** : tête trop haute dans le cadre, plan trop serré,
  sujet qui bouge beaucoup. Il faut une solution de repli : titre devant, avec contour et ombre.
- **Durée et rythme du hook** : l'ancienne charte disait « phrase d'accroche entière, pas de
  sous-titres ». Est-ce que ça reste vrai ?

### Séquences sur fond rouge
- ~~Étiquettes~~ : style 02 « Blanc » (Anton et Thunder blancs, ombre légère), choisi le 2026-11-03.
- ~~Rouge sur rouge~~ : sur le fond rouge, le texte en escalier passe en noir flouté comme le panneau (choix 06, 2026-11-03).
- **Assets de la banque de motion design** (téléphone, barre de recherche…) : ils ont été pensés
  pour le fond blanc. Il faut vérifier leur contraste sur le rouge et faire des variantes si besoin.
- ~~Grain~~ : grain fixe mesuré sur ton panneau, sur le fond seulement (choisi le 2026-11-03 ; l'animé ne survit pas à la compression d'Instagram).
- ~~Entrée et sortie du fond rouge~~ : « Pose » (coupe sèche, l'élément se pose en 8 images ; déclencheur à l'entrée, clic à la sortie), choisie le 2026-11-03.
- ~~Mise en page~~ : l'élément et son étiquette finissent au-dessus de 1180 px (validé le 2026-11-03).

### Le reste de la vidéo
- ~~Fin de vidéo~~ : rien, comme aujourd'hui (choisi le 2026-11-03).
- ~~Couverture du Reel~~ : Michaël les fait lui-même (2026-11-03).
- ~~Identité sonore~~ : on garde la palette actuelle (riser, déclencheur, clic), choisi le 2026-11-03.
- **Étalonnage du face cam** : un léger réglage commun (une LUT) pour que le rouge des textes et les
  peaux restent pareils d'une vidéo à l'autre ?

## 2. Le tournage (c'est ce qui décide le plus de la qualité)

~~Fiche de tournage~~ : écrite le 2026-11-03, `FICHE_TOURNAGE.md`. Hook à × 1, sans zoom (2026-11-03).

## 3. Ce qu'il faut construire pour que le montage soit répétable

**Construit le 2026-11-03** (`remotion/src/da/rouge/`, interrupteur `"da": "rouge"` dans `plan.json`,
documenté dans `.claude/skills/montage-facecam/references/chaine-technique.md` §5). Vidéos 1 et 2
vérifiées identiques au pixel près sur 12 images. Essai complet sur la vidéo 2 :
`tests_video/montage_rouge_essai_v2.mp4` (pas le pilote : même plan, titre en bloc, un texte en
escalier d'essai sur P8).

- ~~Détourage dans la chaîne~~ : `preparer_medias.py` détoure les images du hook (`--detourage` pour
  le refaire seul). Le contrôle des bords reste visuel.
- ~~Titre en bloc dans `plan.json`~~ (`accroche.titre`, repli `accroche.derriere: false`) ; hook à × 1.
- ~~Nouveaux sous-titres~~ : Thunder, groupes longs, montée mot par mot sur le face cam, sec sur le
  rouge, bas à 1 340 ; export SRT avec les mêmes groupes.
- ~~Fond rouge grainé~~ dans tous les types de séquences, « Pose », étiquettes blanches, règle des 1 180.
- ~~Texte en escalier~~ : séquence `texte`.
- ~~Choix de la DA par vidéo~~.
- ~~Polices~~ : `DA MIKHA/polices/` (elles iront dans `CHARTE/07_typographies/` à la validation).

Reste à faire :
- **Licence Thunder** : le fichier dit « Free for personal use only ». Pour des Reels de marque, il
  faut une licence commerciale (ou changer de police pour les sous-titres). **[À COMPLÉTER] par Michaël.**
- **Assets de motion design et séquence `site` sur le rouge** : gardés tels quels, contraste à juger
  au pilote.
- **Étiquettes PNG des partenaires** (texte noir, dessinées pour le blanc) : réduites sous la vidéo,
  à juger ; sinon passer à `nom` / `precision` en texte.
- **Modèles** : `PLAN_MONTAGE.md` (titre en bloc avec sa maquette) et `CHECKLIST_VALIDATION.md`
  (lettres du titre cachées, bords du détourage, sous-titres dans la zone sûre, rien sous les
  sous-titres, ombres) : à écrire avec le pilote.
- **Contrôle automatique du rush** (1080 × 1920, 30 i/s, SDR Rec.709) : proposé, pas construit.

## 4. Ordre proposé

1. ~~Titre : composition, son et sortie~~ (fait le 2026-11-03).
2. Décisions de style manquantes (étiquettes, rouge sur rouge, grain, fin, couverture).
3. ~~Fiche de tournage~~ (`FICHE_TOURNAGE.md`), à appliquer dès la prochaine vidéo tournée.
4. Construction dans la chaîne Remotion (section 3).
5. **Vidéo pilote** : remonter la vidéo 2 entièrement dans la nouvelle DA pour tout valider d'un
   coup, puis écrire la DA dans la charte.
