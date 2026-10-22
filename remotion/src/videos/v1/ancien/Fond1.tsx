import { AbsoluteFill, Img, staticFile } from "remotion";
import { CADRE_PHOTO, CANEVAS, COULEURS, IMAGE_SUR_FOND } from "./tokens";

// fond_1 : utilisé tel quel (grain et texture inclus), DESIGN.md §4
export const Fond1: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: COULEURS.fond }}>
    <Img
      src={staticFile("charte/fond-1.png")}
      style={{ width: CANEVAS.largeur, height: CANEVAS.hauteur }}
    />
    {children}
  </AbsoluteFill>
);

// Photo dans le cadre arrondi, avec l'ombre de la charte
export const PhotoCadre: React.FC<{ src: string }> = ({ src }) => (
  <div
    style={{
      position: "absolute",
      left: CANEVAS.largeur / 2 - CADRE_PHOTO.largeur / 2,
      top: IMAGE_SUR_FOND.centreY - CADRE_PHOTO.hauteur / 2,
      width: CADRE_PHOTO.largeur,
      height: CADRE_PHOTO.hauteur,
      borderRadius: CADRE_PHOTO.rayon,
      overflow: "hidden",
      boxShadow: CADRE_PHOTO.ombre,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

// Produit détouré, centré, avec une ombre douce
export const ProduitDetoure: React.FC<{ src: string }> = ({ src }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: CANEVAS.largeur / 2,
      top: IMAGE_SUR_FOND.centreY,
      width: IMAGE_SUR_FOND.largeurDetoure,
      translate: "-50% -50%",
      filter: IMAGE_SUR_FOND.ombreDetoure,
    }}
  />
);
