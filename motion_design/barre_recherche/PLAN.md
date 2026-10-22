# Motion design : barre de recherche « mehomies.com »

> **Rôle :** demande, déroulé et fabrication de l'asset barre de recherche. **Lecteurs :** Michaël et les agents.

## 1. Demande de Michaël (2026-09-29)

Une barre de recherche où le texte « mehomies.com » est tapé, **en transparence**, design **inspiré du Liquid Glass**.

## 2. Choix de la v01 (propositions de l'agent)

| Élément | Choix | Pourquoi |
|---|---|---|
| Matière | Verre dépoli blanc translucide, reflets intérieurs, anneau lumineux sur le bord, ombre douce (`CHARTE/02_design/DESIGN.md`, section 4) | Un asset transparent ne peut pas flouter ce qu'il y aura derrière : le verre est dépoli pour que le texte reste lisible sur tout fond |
| Texte | « mehomies.com » en minuscules, Gilroy Heavy noir | Police et couleur de la charte ; aucune police ajoutée |
| Curseur | Rouge `#9F1932` | Couleur d'accent de la charte |
| Icônes | Loupe à gauche, micro à droite, gris | Codes d'une barre de recherche de téléphone ; pas de marque |
| Taille et place | 820 × 132 px, centrée sur x = 540 et y = 792 (milieu de la zone sûre, comme le téléphone) | Dans la zone sûre |
| Son | Aucun | La charte n'a pas de bruit de frappe |

## 3. Déroulé (114 images à 30 i/s, 3,8 s)

| Images | Secondes | À l'écran |
|---|---|---|
| 0 | 0 | Image vide |
| 0 → 10 | 0 → 0,33 | Une goutte de verre apparaît avec la loupe, petit rebond |
| 6 → 20 | 0,2 → 0,67 | Elle s'étire en capsule en s'écrasant un peu, comme un liquide ; la loupe suit le bord gauche ; le reflet glisse sur le verre |
| 14 → 26 | 0,47 → 0,87 | Le micro apparaît, le curseur clignote |
| 26 → 58 | 0,87 → 1,93 | « mehomies.com » est tapé lettre par lettre (rythme un peu irrégulier, hésitation avant le point) |
| 58 → 84 | 1,93 → 2,8 | Le curseur clignote |
| 84 → 100 | 2,8 → 3,33 | Validation : la capsule s'enfonce, s'éclaircit et rebondit ; le curseur disparaît |
| 100 → 113 | 3,33 → 3,8 | Fixe : à couper ou prolonger dans DaVinci |

Durées et courbes : `CHARTE/03_motion/MOTION.md`, section 2 bis.

## 4. Fichiers et contrôles

- `export/barre-recherche_v01.mov` : ProRes 4444 avec transparence, 1080×1920, 30 i/s, BT.709, 3,8 s, sans son.
- Image 0 entièrement transparente ; à la fin, la barre et son ombre occupent x de 126 à 954 et y de 725 à 876 : dans la zone sûre.
- Lisibilité vérifiée sur trois fonds : le face cam de la vidéo 1, fond_1 et du noir.

## 5. Refaire (depuis `MONTAGE/remotion/`)

`npx remotion render Motion-BarreRecherche ../motion_design/barre_recherche/export/barre-recherche_v02.mov --config=remotion.asset.config.ts`

Code : `remotion/src/motion/BarreRecherche.tsx` (déroulé), `remotion/src/charte/VerreLiquide.tsx` (matière).

## 6. Points ouverts

- Le vrai Liquid Glass floute et déforme ce qu'il y a derrière : c'est impossible dans un fichier transparent. Dans DaVinci, on peut flouter le fond sous la barre avec la forme de la barre comme cache ; je peux fournir ce cache si besoin.
- Le rebond (goutte, validation) n'est pas encore tranché par la charte (`MOTION.md`, « Rebonds / élasticité ») : à garder ou non selon ton avis.
