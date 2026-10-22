// Valeurs de la charte (CHARTE/02_design/DESIGN.md et tokens.json) : direction artistique du
// 2026-09-30, tirée de la VF de Michaël (mesures à ± 2 px). Les valeurs marquées « proposition »
// ne sont pas mesurées : à régler au visionnage. L'ancienne direction (rouge, fond_1, Permanent
// Marker) est dans src/videos/v1/ancien/, pour pouvoir refaire la vidéo 1.

export const CANEVAS = { largeur: 1080, hauteur: 1920, fps: 30 } as const;

export const COULEURS = {
  jaune: "#FFB900", // met en avant les mots importants du hook
  jaunePale: "#EDC55C", // abandonné le 2026-10-01 (un seul jaune) ; gardé pour la VF de la vidéo 1
  blanc: "#FFFFFF",
  noir: "#000000",
  fond: "#FFFFFF", // fond des séquences d'illustration
} as const;
export type CouleurTexte = "jaune" | "jaunePale" | "blanc" | "noir";

// Familles déclarées dans polices.tsx (fichiers de CHARTE/07_typographies/Gilroy)
export const POLICES = {
  heavy: "Gilroy Heavy", // titres
  extraBold: "Gilroy ExtraBold", // sous-titres, nom d'une étiquette
  mediumItalic: "Gilroy Medium Italic", // précision d'une étiquette
} as const;
export const CAPITALES = 0.7; // hauteur des capitales / corps, pour les trois graisses de Gilroy

// Zone utilisable mesurée sur 05_formats/safe-zone_tiktok-instagram_overlay_v01.webp
export const ZONE_SURE = {
  haut: 219,
  gauche: 85,
  droiteHaute: 1018, // x maximal pour y < 1088
  droiteBasse: 885, // x maximal pour y de 1088 à 1365
  bas: 1365,
} as const;

// Titre d'accroche (DESIGN.md §3.1) : lignes aux bords alignés, sous le visage
export const TITRE_ACCROCHE = {
  largeur: 690,
  bas: 1328, // bas de la dernière ligne (VF)
  ecartEntreLignes: 21, // entre capitales (VF)
  tailleMax: 260,
  ombre: { dx: 0, dy: 5, flou: 7, opacite: 0.6 }, // proposition : paramètres non mesurés
} as const;

// Sous-titres (SOUS-TITRES.md) : Gilroy ExtraBold, groupe entier, centré
export const SOUS_TITRES = {
  taille: 75, // capitales 53 px (VF)
  ligneDeBase: 1382, // VF
  ligneDeBaseSite: 1557, // séquence du site : sous la barre de recherche (VF)
  largeurMax: 880,
  maintienApresDernierMot: 15, // images
  dureeMin: 4, // images
} as const;

// Cadrage du face cam (MOTION.md §4) : zoom autour du centre de l'image, comme dans DaVinci
export const CADRAGE = { origine: "540px 960px" } as const;

// Séquences sur fond blanc (DESIGN.md §4, VF)
export const PHOTO = {
  largeur: 690,
  hauteur: 862,
  haut: 250,
  rayon: 85,
  ombre: "12px 16px 40px rgba(0, 0, 0, 0.35)", // proposition : vers le bas et la droite comme la VF
  margeDetoure: 60, // proposition (vidéo 2) : produit détouré posé en entier dans le cadre, sur blanc
} as const;
export const ETIQUETTE = {
  nom: { capitales: 71, ligneDeBase: 1251 }, // Gilroy ExtraBold
  precision: { capitales: 55, ligneDeBase: 1334 }, // Gilroy Medium Italic
  largeurMax: 690, // zone sûre sous y = 1 088 (x de 195 à 885 autour du centre) : un texte plus large est réduit
} as const;
export const PARTENAIRE = {
  video: { gauche: 96, haut: 449, largeur: 887, hauteur: 500 },
  etiquette: { largeur: 821, haut: 1023 }, // étiquette PNG 1080 × 353, contenu de 627 px de large
} as const;
// Image 16:9 seule (séquence photo, sans étiquette) : largeur de la vidéo partenaire, centrée entre le
// haut de la zone sûre (219) et le haut des sous-titres (≈ 1 330). Proposition (vidéo 2)
export const IMAGE_LARGE = { haut: 525 } as const;
// Étiquette sous une image 16:9 (placée comme la vidéo partenaire, y de 449 à 948) : même écart
// image / nom (68 px) et nom / précision (83 px) que sous une photo produit. Proposition (vidéo 2)
export const ETIQUETTE_LARGE = { nom: 1087, precision: 1170 } as const;
export const SITE = {
  decalageTelephone: -23,
  decalageBarre: 610,
  departAssets: 3,
} as const;

// Musique (SON.md) : aucun fondu audible ; 2 images seulement, pour éviter un clic
export const MUSIQUE = { fondu: 2 } as const;

// Bruitages de public/charte/sfx, au niveau de leur fichier ; attaqueS = début du son dans le fichier
export const SFX = {
  riser: { fichier: "charte/sfx/riser.wav", dureeS: 5.329 },
  clic: { fichier: "charte/sfx/clic.wav", dureeS: 0.459, attaqueS: 0.079 },
  declencheur: {
    fichier: "charte/sfx/declencheur.wav",
    dureeS: 0.96,
    attaqueS: 0.227,
  },
} as const;
// Placement du son (SON.md, VF), en images : le clic tombe 3 images avant la coupe, le déclencheur
// 5 images avant la photo
export const PLACEMENT_SFX = { clic: 3, declencheur: 5 } as const;

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
  ombre: "0px 10px 35px rgba(0, 0, 0, 0.375)",
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
  curseur: "#9F1932", // couleur de l'asset v01 ; avec le passage au jaune : à trancher (DESIGN.md §4)
} as const;
