import { interpolate, useCurrentFrame } from "remotion";
import { CANEVAS, TELEPHONE } from "./tokens";

export const TELEPHONE_LARGEUR =
  TELEPHONE.ecran.largeur + 2 * TELEPHONE.bordure;
export const TELEPHONE_HAUTEUR =
  TELEPHONE.ecran.hauteur + 2 * TELEPHONE.bordure;

const Bouton: React.FC<{
  cote: "left" | "right";
  haut: number;
  hauteur: number;
}> = ({ cote, haut, hauteur }) => (
  <div
    style={{
      position: "absolute",
      [cote]: -4,
      top: haut,
      width: 6,
      height: hauteur,
      borderRadius: 3,
      backgroundColor: TELEPHONE.lisere,
    }}
  />
);

export type Rotation3D = { x: number; y: number; z: number };

// Téléphone neutre (DESIGN.md §4) : coque noire au bord légèrement plus clair, écran arrondi,
// sans marque ni encoche, ombre de la charte. Au repos, il est centré dans la zone sûre ; x et y
// le déplacent (px), echelle l'agrandit autour de son centre, rotation l'incline en 3D (degrés).
// eteint : opacité de l'écran noir posé sur le site (1 = écran éteint, 0 = site affiché).
export const Telephone: React.FC<{
  children: React.ReactNode;
  x?: number;
  y?: number;
  echelle?: number;
  rotation?: Rotation3D;
  eteint?: number;
}> = ({
  children,
  x = 0,
  y = 0,
  echelle = 1,
  rotation = { x: 0, y: 0, z: 0 },
  eteint = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: CANEVAS.largeur / 2 - TELEPHONE_LARGEUR / 2,
      top: TELEPHONE.centreY - TELEPHONE_HAUTEUR / 2,
      width: TELEPHONE_LARGEUR,
      height: TELEPHONE_HAUTEUR,
      borderRadius: TELEPHONE.rayon,
      backgroundColor: TELEPHONE.couleur,
      boxShadow: `inset 0 0 0 2px ${TELEPHONE.lisere}, ${TELEPHONE.ombre}`,
      transform:
        `perspective(${TELEPHONE.perspective}px) translate(${x}px, ${y}px) ` +
        `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(${echelle})`,
    }}
  >
    <Bouton cote="left" haut={230} hauteur={80} />
    <Bouton cote="left" haut={330} hauteur={80} />
    <Bouton cote="right" haut={280} hauteur={130} />
    <div
      style={{
        position: "absolute",
        left: TELEPHONE.bordure,
        top: TELEPHONE.bordure,
        width: TELEPHONE.ecran.largeur,
        height: TELEPHONE.ecran.hauteur,
        borderRadius: TELEPHONE.rayon - TELEPHONE.bordure,
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {children}
      {eteint > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: eteint,
            background:
              "linear-gradient(120deg, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0.08) 50%, " +
              `rgba(255, 255, 255, 0) 65%), ${TELEPHONE.ecranEteint}`,
          }}
        />
      )}
    </div>
  </div>
);

// Toucher du doigt sur l'écran : cercle gris qui s'enfonce puis s'efface, en 12 images.
// x, y : centre du doigt, en px dans la page affichée.
export const Toucher: React.FC<{
  x: number;
  y: number;
  debut: number;
  diametre: number;
}> = ({ x, y, debut, diametre }) => {
  const t = useCurrentFrame() - debut;
  if (t < 0 || t > 12) {
    return null;
  }
  const echelle = interpolate(t, [0, 3, 6, 12], [0.6, 1, 1, 1.35]);
  const opacite = interpolate(t, [0, 3, 6, 12], [0, 1, 1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - diametre / 2,
        top: y - diametre / 2,
        width: diametre,
        height: diametre,
        borderRadius: "50%",
        backgroundColor: "rgba(20, 20, 20, 0.28)",
        border: "2px solid rgba(20, 20, 20, 0.3)",
        transform: `scale(${echelle})`,
        opacity: opacite,
      }}
    />
  );
};
