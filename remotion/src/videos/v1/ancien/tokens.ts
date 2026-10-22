// Ancienne direction artistique (rouge, fond_1, Permanent Marker), gardée pour refaire la vidéo 1.
// Valeurs de la charte (CHARTE/02_design/DESIGN.md et tokens.json).
// Les valeurs marquées « proposition » ne sont pas encore dans la charte : elles viennent du
// plan de montage de la vidéo 1 (validé le 2026-09-29) et seront corrigées au premier retour.

export const CANEVAS = { largeur: 1080, hauteur: 1920, fps: 30 } as const;

export const COULEURS = {
  fond: "#FEFBF1",
  texte: "#000000",
  accent: "#9F1932",
  sousTitreFaceCam: "#FFFFFF", // blanc confirmé, hex supposé
} as const;

export const POLICES = {
  titre: "Gilroy Heavy",
  accent: "Permanent Marker",
} as const;

// Zone utilisable mesurée sur 05_formats/safe-zone_tiktok-instagram_overlay_v01.webp
export const ZONE_SURE = {
  haut: 219,
  gauche: 85,
  droiteHaute: 1018, // x maximal pour y < 1088
  droiteBasse: 885, // x maximal pour y de 1088 à 1365
  bas: 1365,
} as const;

// DESIGN.md §4 : cadre photo sur fond_1
export const CADRE_PHOTO = {
  largeur: 573,
  hauteur: 762,
  rayon: 90,
  ombre: "0px 10px 35px rgba(0, 0, 0, 0.375)",
} as const;

// Propositions du premier montage
// v02 (retours de Michaël sur la v01) : plus grands et plus bas. Sous y = 1088, la zone sûre
// s'arrête à x = 885 : centrée sur 540, une ligne fait donc 690 px au plus. Un groupe plus
// large (petit mot rattaché au suivant) est réduit pour tenir.
export const SOUS_TITRES = {
  taille: 110,
  largeurMax: 690,
  centreYFaceCam: 1110,
  centreYSurFond: 330,
  ombre: "0px 4px 16px rgba(0, 0, 0, 0.55)",
  maintienApresDernierMot: 15, // images : durée d'affichage après le dernier mot d'un groupe
} as const;

// Musique fournie avec la vidéo : fondus de départ (images), à régler à l'oreille
export const MUSIQUE = {
  fonduEntree: 8,
  fonduSortie: 30,
} as const;

export const IMAGE_SUR_FOND = {
  centreY: 900, // l'image descend pour laisser les sous-titres au-dessus
  largeurDetoure: 680,
  ombreDetoure: "drop-shadow(0px 12px 22px rgba(0, 0, 0, 0.28))",
} as const;

export const COMPOSITION_TEXTE = {
  largeur: 680,
  centreY: 941, // centre du bloc de l'exemple exemple_typo-1
  ecartEntreLignes: 14, // écart mesuré entre les capitales des lignes de l'exemple
  tailleMin: 60,
  tailleMax: 260,
} as const;

export const CADRAGE = {
  large: 1,
  serre: 1.15,
  origine: "540px 600px", // centre du visage dans le rush
} as const;

// Téléphone neutre pour montrer un site en version mobile (motion design validé le 2026-09-29 :
// contour noir, sans marque). Dimensions : propositions de la v01.
export const TELEPHONE = {
  ecran: { largeur: 500, hauteur: 1082 }, // 390 × 844 points de site, à l'échelle 500 / 390
  bordure: 14,
  rayon: 76,
  couleur: "#0E0E0E",
  lisere: "#2F2F2F", // bord légèrement plus clair : le téléphone reste lisible sur un fond sombre
  ecranEteint: "#070707",
  centreY: 792, // milieu de la zone sûre (y de 219 à 1365)
  ombre: CADRE_PHOTO.ombre,
  perspective: 2200, // px : profondeur de la rotation 3D d'entrée
} as const;

// Verre liquide (inspiré du Liquid Glass d'Apple), pour un asset à fond transparent : l'arrière-plan
// n'est pas connu au rendu, il ne peut pas être flouté ; le verre est donc dépoli (blanc translucide)
// pour que le texte noir reste lisible sur tout fond. Propositions de la v01 (2026-09-29).
export const VERRE_LIQUIDE = {
  remplissage:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 255, 255, 0.52) 55%, " +
    "rgba(255, 255, 255, 0.6) 100%)",
  reflets:
    "inset 0 3px 6px rgba(255, 255, 255, 0.9), inset 0 -5px 10px rgba(0, 0, 0, 0.06), " +
    "inset 0 0 26px rgba(255, 255, 255, 0.35)",
  contour: "0 0 0 1px rgba(0, 0, 0, 0.08)",
  ombre: "0 14px 38px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.12)",
  anneau:
    "linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.15) 35%, " +
    "rgba(255, 255, 255, 0.08) 65%, rgba(255, 255, 255, 0.85))",
  icones: "rgba(0, 0, 0, 0.5)",
} as const;

// Barre de recherche en verre liquide (asset « mehomies.com » tapé), propositions de la v01
export const BARRE_RECHERCHE = {
  largeur: 820,
  hauteur: 132,
  centreY: 792, // milieu de la zone sûre, comme le téléphone
  tailleTexte: 62,
  icone: 44,
  marge: 40,
} as const;

// Durée des bruitages préparés dans public/charte/sfx (mesurée)
export const SFX = {
  riser: { fichier: "charte/sfx/riser.wav", dureeS: 5.329 },
  declencheur: { fichier: "charte/sfx/declencheur.wav", dureeS: 0.96 },
} as const;
