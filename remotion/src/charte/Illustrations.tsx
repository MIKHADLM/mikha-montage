import { Video } from "@remotion/media";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { mesurer } from "./polices";
import {
  CANEVAS,
  CAPITALES,
  COULEURS,
  ETIQUETTE,
  IMAGE_LARGE,
  PARTENAIRE,
  PHOTO,
  POLICES,
} from "./tokens";

// Éléments des séquences d'illustration sur fond blanc (DESIGN.md §4), placés comme dans la VF.

export const FondBlanc: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COULEURS.fond }} />
);

// Photo 4:5 aux angles arrondis, avec ombre, en haut de la zone sûre. Un produit détouré (PNG
// transparent) est posé en entier dans le cadre, sur blanc, au lieu de le remplir.
export const PhotoArrondie: React.FC<{ src: string; detoure?: boolean }> = ({
  src,
  detoure = false,
}) => (
  <div
    style={{
      position: "absolute",
      left: (CANEVAS.largeur - PHOTO.largeur) / 2,
      top: PHOTO.haut,
      width: PHOTO.largeur,
      height: PHOTO.hauteur,
      borderRadius: PHOTO.rayon,
      overflow: "hidden",
      boxShadow: PHOTO.ombre,
      backgroundColor: COULEURS.fond,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: detoure ? "contain" : "cover",
        padding: detoure ? PHOTO.margeDetoure : 0,
        boxSizing: "border-box",
      }}
    />
  </div>
);

// Image 16:9 (affiche, couverture) : taille de la vidéo partenaire ; à sa place quand une étiquette
// suit, sinon centrée dans l'espace libre
export const ImageLarge: React.FC<{ src: string; avecEtiquette?: boolean }> = ({
  src,
  avecEtiquette = false,
}) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: PARTENAIRE.video.gauche,
      top: avecEtiquette ? PARTENAIRE.video.haut : IMAGE_LARGE.haut,
      width: PARTENAIRE.video.largeur,
      height: PARTENAIRE.video.hauteur,
      objectFit: "cover",
    }}
  />
);

// Étiquette sous la photo : nom en Gilroy ExtraBold, précision en Gilroy Medium Italic, en noir ;
// une ligne plus large que la zone sûre est réduite
const tailleQuiTient = (texte: string, police: string, capitales: number) => {
  const taille = capitales / CAPITALES;
  const largeur = mesurer(texte, police, taille).largeur;
  return Math.min(taille, (taille * ETIQUETTE.largeurMax) / largeur);
};

export const Etiquette: React.FC<{
  nom: string;
  precision?: string;
  lignesDeBase?: { nom: number; precision: number };
}> = ({
  nom,
  precision,
  lignesDeBase = {
    nom: ETIQUETTE.nom.ligneDeBase,
    precision: ETIQUETTE.precision.ligneDeBase,
  },
}) => (
  <svg
    width={CANEVAS.largeur}
    height={CANEVAS.hauteur}
    style={{ position: "absolute", left: 0, top: 0 }}
  >
    <text
      x={CANEVAS.largeur / 2}
      y={lignesDeBase.nom}
      textAnchor="middle"
      fontFamily={POLICES.extraBold}
      fontSize={tailleQuiTient(nom, POLICES.extraBold, ETIQUETTE.nom.capitales)}
      fill={COULEURS.noir}
    >
      {nom}
    </text>
    {precision && (
      <text
        x={CANEVAS.largeur / 2}
        y={lignesDeBase.precision}
        textAnchor="middle"
        fontFamily={POLICES.mediumItalic}
        fontSize={tailleQuiTient(
          precision,
          POLICES.mediumItalic,
          ETIQUETTE.precision.capitales,
        )}
        fill={COULEURS.noir}
      >
        {precision}
      </text>
    )}
  </svg>
);

// Séquence partenaire : vidéo (sans son) ou image du partenaire en 16:9 en haut, étiquette dessous
export const Partenaire: React.FC<{
  video?: string;
  videoDebut?: number;
  image?: string;
  etiquette: string;
}> = ({ video, videoDebut = 0, image, etiquette }) => {
  const cadre = {
    position: "absolute" as const,
    left: PARTENAIRE.video.gauche,
    top: PARTENAIRE.video.haut,
    width: PARTENAIRE.video.largeur,
    height: PARTENAIRE.video.hauteur,
    objectFit: "cover" as const,
  };
  return (
    <>
      {video && (
        <Video
          src={staticFile(video)}
          trimBefore={videoDebut}
          volume={0}
          style={cadre}
        />
      )}
      {image && <Img src={staticFile(image)} style={cadre} />}
      <Img
        src={staticFile(etiquette)}
        style={{
          position: "absolute",
          left: (CANEVAS.largeur - PARTENAIRE.etiquette.largeur) / 2,
          top: PARTENAIRE.etiquette.haut,
          width: PARTENAIRE.etiquette.largeur,
        }}
      />
    </>
  );
};
