// Motion design « site mobile » : proposition 1, la visite guidée (validée le 2026-09-29), livrée
// comme un asset : fond transparent, sans texte (Michaël ajoute le texte dans DaVinci).
// Le téléphone monte du bas avec une petite rotation 3D, le site s'allume sur l'écran, l'accueil de
// mehomies.com défile jusqu'aux t-shirts, un doigt touche le France Boxy Tee, la page produit arrive
// par la droite, zoom sur les tailles, le doigt choisit M (« Ajouter au panier - 33 € »), puis le
// téléphone revient au repos. Plan : motion_design/site_mobile/PLAN.md.
// Captures et positions : scripts/capturer_site.mjs.
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Telephone, Toucher } from "../charte/Telephone";
import { SFX, TELEPHONE } from "../charte/tokens";
import site from "./donnees/site-mobile.json";

type Rect = { x: number; y: number; largeur: number; hauteur: number };
const centre = (r: Rect) => ({
  x: r.x + r.largeur / 2,
  y: r.y + r.hauteur / 2,
});

const K = TELEPHONE.ecran.largeur / site.ecran.largeur; // px par point de site
const ECRAN = site.ecran.hauteur; // hauteur de page visible, en points

// Temps en images à 30 i/s (propositions de la v01)
const T = {
  montee: [0, 18],
  rotation: [0, 24], // la rotation 3D se termine un peu après l'arrivée
  allumage: [16, 26], // le site s'affiche sur l'écran
  defilement: [32, 56],
  toucherCarte: 60,
  arriveeProduit: [66, 78],
  defilementProduit: [82, 98],
  zoom: [84, 106],
  toucherTaille: 110,
  choixTaille: 114,
  dezoom: [134, 152],
};
export const DUREE_SITE_MOBILE = 182;

// Entrée : départ entièrement sous l'image (image 0 vide), incliné en 3D (degrés), un peu plus petit
const DEPART = { y: 1750, echelle: 0.9, rotation: { x: 22, y: -14, z: 4 } };

// Défilements, en points de page : l'accueil descend d'un geste jusqu'au France Boxy Tee
const carte = centre(site.accueil.photo);
const DEFILEMENT_ACCUEIL = [0, carte.y - 0.45 * ECRAN];
const boutonBas = site.produit.bouton.y + site.produit.bouton.hauteur;
// après le zoom, puis à la fin : photo, tailles et bouton « Ajouter au panier » visibles
const DEFILEMENT_PRODUIT = [0, boutonBas - ECRAN + 90, boutonBas - ECRAN + 16];
const taille = centre(site.produit.boutonTaille);

// Zoom : la zone « Taille » → bouton vient au centre de la partie haute de la zone sûre
const ZOOM = 1.9;
const CIBLE_Y = 760;
const zoneY =
  (site.produit.tailles.y - 32 + boutonBas) / 2 - DEFILEMENT_PRODUIT[1];
const zoneAuRepos = TELEPHONE.centreY - TELEPHONE.ecran.hauteur / 2 + zoneY * K;
const Y_ZOOM =
  CIBLE_Y - TELEPHONE.centreY - ZOOM * (zoneAuRepos - TELEPHONE.centreY);

// Courbes : au plus 115 px de déplacement par image (sauf la montée), pour un mouvement fluide
const ARRIVEE = Easing.bezier(0.33, 1, 0.68, 1); // montée et page produit : rapide, puis ralentit
const DOIGT = Easing.bezier(0.25, 0.1, 0.25, 1); // défilement au doigt : accélère, puis glisse
const DOUX = Easing.bezier(0.45, 0, 0.2, 1); // zoom et dézoom
const borne = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const entre = (
  frame: number,
  temps: number[],
  valeurs: number[],
  easing: (t: number) => number,
) => interpolate(frame, temps, valeurs, { ...borne, easing });

// Une page du site dans l'écran : x décale la page (points), defilement la fait monter (points)
const Page: React.FC<{
  x: number;
  defilement: number;
  voile?: number;
  ombre?: boolean;
  children: React.ReactNode;
}> = ({ x, defilement, voile = 0, ombre = false, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: TELEPHONE.ecran.largeur,
      height: TELEPHONE.ecran.hauteur,
      backgroundColor: "white",
      transform: `translateX(${x * K}px)`,
      boxShadow: ombre ? "-12px 0 32px rgba(0, 0, 0, 0.18)" : undefined,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TELEPHONE.ecran.largeur,
        transform: `translateY(${-defilement * K}px)`,
      }}
    >
      {children}
    </div>
    {voile > 0 && (
      <AbsoluteFill style={{ backgroundColor: "black", opacity: voile }} />
    )}
  </div>
);

const Capture: React.FC<{ fichier: string; visible?: boolean }> = ({
  fichier,
  visible = true,
}) => (
  <Img
    src={staticFile(fichier)}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: TELEPHONE.ecran.largeur,
      opacity: visible ? 1 : 0,
    }}
  />
);

export const SiteMobile: React.FC = () => {
  const frame = useCurrentFrame();

  const montee = entre(frame, T.montee, [0, 1], ARRIVEE);
  const redresse = entre(frame, T.rotation, [0, 1], ARRIVEE);
  const avantDezoom = frame < T.dezoom[0];
  const zoom = avantDezoom
    ? entre(frame, T.zoom, [0, 1], DOUX)
    : entre(frame, T.dezoom, [1, 0], DOUX);

  const accueil = entre(frame, T.defilement, DEFILEMENT_ACCUEIL, DOIGT);
  const produit = avantDezoom
    ? entre(frame, T.defilementProduit, DEFILEMENT_PRODUIT.slice(0, 2), DOIGT)
    : entre(frame, T.dezoom, DEFILEMENT_PRODUIT.slice(1), DOUX);
  const pousse = entre(frame, T.arriveeProduit, [0, 1], ARRIVEE);

  return (
    <AbsoluteFill>
      <Telephone
        y={DEPART.y * (1 - montee) + Y_ZOOM * zoom}
        echelle={
          (DEPART.echelle + (1 - DEPART.echelle) * montee) *
          (1 + (ZOOM - 1) * zoom)
        }
        rotation={{
          x: DEPART.rotation.x * (1 - redresse),
          y: DEPART.rotation.y * (1 - redresse),
          z: DEPART.rotation.z * (1 - redresse),
        }}
        eteint={entre(frame, T.allumage, [1, 0], Easing.linear)}
      >
        <Page
          x={-0.3 * site.ecran.largeur * pousse}
          defilement={accueil}
          voile={0.12 * pousse}
        >
          <Capture fichier={site.accueil.fichier} />
          <Toucher
            x={carte.x * K}
            y={carte.y * K}
            debut={T.toucherCarte}
            diametre={44 * K}
          />
        </Page>
        <Page
          x={site.ecran.largeur * (1 - pousse)}
          defilement={produit}
          ombre={pousse > 0 && pousse < 1}
        >
          <Capture fichier={site.produit.fichier} />
          <Capture
            fichier={site.produit.fichierTaille}
            visible={frame >= T.choixTaille}
          />
          <Toucher
            x={taille.x * K}
            y={taille.y * K}
            debut={T.toucherTaille}
            diametre={44 * K}
          />
        </Page>
      </Telephone>
      <Audio
        name="Déclencheur : arrivée du téléphone"
        src={staticFile(SFX.declencheur.fichier)}
      />
    </AbsoluteFill>
  );
};
