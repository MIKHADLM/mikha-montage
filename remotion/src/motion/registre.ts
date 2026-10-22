// Banque de motion design (motion_design/CATALOGUE.md) : chaque asset validé est un composant
// Remotion, référencé ici par son identifiant. Un plan de montage peut alors le jouer avec une
// séquence { "type": "motion", "asset": "<identifiant>" }, sans code en plus.
// Ajouter un asset : son composant dans src/motion/, sa durée exportée, une ligne ci-dessous,
// et sa fiche dans motion_design/CATALOGUE.md.
import { BarreRecherche, DUREE_BARRE_RECHERCHE } from "./BarreRecherche";
import { DUREE_SITE_MOBILE, SiteMobile } from "./SiteMobile";

export const BANQUE_MOTION = {
  "site-mobile": { composant: SiteMobile, duree: DUREE_SITE_MOBILE },
  "barre-recherche": {
    composant: BarreRecherche,
    duree: DUREE_BARRE_RECHERCHE,
  },
} as const;

export type IdMotion = keyof typeof BANQUE_MOTION;
