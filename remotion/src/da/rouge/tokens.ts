// Valeurs de la DA rouge (DA MIKHA/DECISIONS.md, décisions de Michaël du 2026-11-03). Elle remplace
// la charte jaune pour une vidéo dont plan.json porte "da": "rouge" ; les autres vidéos gardent la
// charte (src/charte/tokens.ts). Les valeurs marquées « proposition » sont à régler au visionnage.
// Pas encore écrite dans CHARTE/ : elle le sera après la vidéo pilote.

export const ROUGE = "#F12F19";
export const BLANC = "#FFFFFF";
export const NOIR_TEXTE = "#0D0D0D"; // texte posé sur le fond rouge (comme le panneau de Michaël)

// Familles déclarées dans polices.tsx (fichiers de DA MIKHA/polices, copiés dans public/charte/polices)
export const POLICES_ROUGE = {
  titre: "DA Anton", // titre d'accroche, nom des étiquettes
  texte: "DA Thunder", // sous-titres, précision des étiquettes
  escalier: "DA Chivo", // texte en escalier, graisse 800
} as const;

// Ombres portées (propositions)
export const OMBRES = {
  titre: "drop-shadow(0 6px 18px rgba(0,0,0,.55))",
  sujet: "drop-shadow(0 0 36px rgba(0,0,0,.45))", // le sujet détouré, au-dessus des mots rouges
  sousTitres: "drop-shadow(0 4px 10px rgba(0,0,0,.6))",
  etiquette: "drop-shadow(0 4px 10px rgba(0,0,0,.45))",
  element: "0 14px 34px rgba(0,0,0,.35)", // box-shadow d'une image posée sur le rouge
  elementDetoure: "drop-shadow(0 14px 24px rgba(0,0,0,.35))", // produit détouré : l'ombre suit sa forme
} as const;

// Titre d'accroche en bloc (composition 06 « empilés, derrière la tête ») : petits mots blancs
// empilés à gauche à la hauteur du mot clé, mot clé et dernier mot rouges derrière la tête avec un
// contour permanent ; en haut de la zone sûre, 330 px de haut au plus
export const TITRE_BLOC = {
  gauche: 85,
  largeur: 933,
  haut: 219,
  hauteurMax: 330,
  ecartX: 22, // entre la pile de petits mots et le mot clé
  ecartPile: 0.12, // entre deux petits mots, en part des capitales du mot clé
  ecartLignes: 0.1, // entre le mot clé et le dernier mot
  contour: 3,
  // Apparition : chaque morceau sort d'une ligne fixe sous sa ligne de base, dans l'ordre de lecture
  apparition: { debut: 2, intervalle: 4, duree: 12 },
} as const;

// Sous-titres : Thunder blanc, groupes longs sur une ligne, bloc calé par le bas à 1340 px, centré,
// 690 px au plus (zone sûre, colonne des boutons à droite)
export const SOUS_TITRES_ROUGE = {
  taille: 70,
  largeurMax: 690,
  bas: 1340,
  centre: 540,
  pauseS: 0.3, // une pause plus longue coupe toujours le groupe
  maintien: 15, // images après le dernier mot (0,5 s), au plus jusqu'au groupe suivant
  montee: 5, // images : montée d'un mot sur le face cam (sur le rouge : apparition sèche)
  descente: 1.15, // départ de la montée, en corps sous sa place
} as const;
// Petits mots qui ne finissent jamais une ligne
export const MOTS_DE_LIAISON = new Set([
  "le",
  "la",
  "les",
  "de",
  "du",
  "des",
  "à",
  "au",
  "aux",
  "un",
  "une",
  "ma",
  "mon",
  "ta",
  "ton",
  "sa",
  "son",
  "ses",
  "mes",
  "tes",
  "et",
  "ou",
  "que",
  "qui",
  "en",
  "pour",
  "par",
  "sur",
  "avec",
  "dans",
  "se",
  "je",
  "tu",
  "on",
]);

// Éléments posés sur le fond rouge : entièrement visibles, angles droits, ombre légère ; l'élément et
// son étiquette finissent au-dessus de 1180 px (validé le 2026-11-03)
export const ELEMENTS = {
  haut: 219,
  bas: 1180,
  large: { gauche: 96, largeur: 888, hauteur: 500, hautAvecEtiquette: 430 }, // 16:9
  photo: { gauche: 235, largeur: 610, hauteur: 762, hautAvecEtiquette: 230 }, // 4:5
  carre: { cote: 640, hautAvecEtiquette: 310 }, // 1:1 (petite source, vidéo 3)
  // « Pose » : l'élément arrive un peu plus grand et en fondu (propositions)
  pose: { duree: 8, echelle: 1.06 },
} as const;
export const ETIQUETTE_ROUGE = {
  ecart: 56, // entre le bas de l'élément et le haut des capitales du nom
  capitalesNom: 62, // Anton blanc
  capitalesPrecision: 44, // Thunder blanc
  entre: 22,
  espacementPrecision: 3,
  largeurMax: 690, // une ligne plus large est réduite
} as const;

// Texte en escalier (Chivo 800 minuscule serrée) : noir flouté sur le rouge, rouge sur une image
export const ESCALIER = {
  graisse: 800,
  approche: -0.05, // em
  ecart: 0.16, // entre l'encre de deux lignes, en part du corps de la ligne suivante
  flouSurRouge: 2.2, // px
  // Mot par mot (propositions, d'après le test à 24 i/s) : premier mot à 0,4 s, puis un toutes les 6 images
  apparition: { debut: 12, intervalle: 6, duree: 8 },
} as const;
