import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { corpsPourCapitales, encre } from "./polices";
import {
  BLANC,
  ELEMENTS,
  ETIQUETTE_ROUGE as E,
  OMBRES,
  POLICES_ROUGE,
} from "./tokens";

// Éléments posés sur le fond rouge grainé (DECISIONS.md, « Séquences d'illustration ») : entièrement
// visibles, angles droits, ombre légère ; élément et étiquette finissent au-dessus de 1180 px.

type Cadre = { gauche: number; haut: number; largeur: number; hauteur: number };

// Cadre d'un élément : à sa place quand une étiquette suit, sinon centré entre le haut de la zone sûre
// et la limite des éléments
const centre = (hauteur: number) =>
  (ELEMENTS.haut + ELEMENTS.bas - hauteur) / 2;
export const cadreLarge = (etiquette: boolean): Cadre => {
  const L = ELEMENTS.large;
  return {
    gauche: L.gauche,
    largeur: L.largeur,
    hauteur: L.hauteur,
    haut: etiquette ? L.hautAvecEtiquette : centre(L.hauteur),
  };
};
export const cadrePhoto = (etiquette: boolean): Cadre => {
  const P = ELEMENTS.photo;
  return {
    gauche: P.gauche,
    largeur: P.largeur,
    hauteur: P.hauteur,
    haut: etiquette ? P.hautAvecEtiquette : centre(P.hauteur),
  };
};
export const cadreCarre = (etiquette: boolean): Cadre => {
  const C = ELEMENTS.carre;
  return {
    gauche: (1080 - C.cote) / 2,
    largeur: C.cote,
    hauteur: C.cote,
    haut: etiquette ? C.hautAvecEtiquette : centre(C.cote),
  };
};
const style = (c: Cadre): React.CSSProperties => ({
  position: "absolute",
  left: c.gauche,
  top: c.haut,
  width: c.largeur,
  height: c.hauteur,
});

// « Pose » (choisie le 2026-11-03) : l'élément et son étiquette arrivent un peu plus grands et en
// fondu, en ELEMENTS.pose.duree images, au début de leur Sequence (coupe sèche vers le rouge)
export const Pose: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, ELEMENTS.pose.duree], [0, 1], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: p,
        transform: `scale(${ELEMENTS.pose.echelle - (ELEMENTS.pose.echelle - 1) * p})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Image 16:9, 4:5 ou 1:1 posée sur le rouge. detoure : produit en PNG transparent, posé en entier
// dans son cadre, l'ombre suit sa forme
export const ImageRouge: React.FC<{
  src: string;
  cadre: Cadre;
  detoure?: boolean;
}> = ({ src, cadre, detoure = false }) => (
  <Img
    src={staticFile(src)}
    style={{
      ...style(cadre),
      objectFit: detoure ? "contain" : "cover",
      boxShadow: detoure ? undefined : OMBRES.element,
      filter: detoure ? OMBRES.elementDetoure : undefined,
    }}
  />
);

// Vidéo 16:9 sans son (partenaire, extrait de jeu)
export const VideoRouge: React.FC<{
  src: string;
  debut: number;
  cadre: Cadre;
}> = ({ src, debut, cadre }) => (
  <Video
    src={staticFile(src)}
    trimBefore={debut}
    volume={0}
    objectFit="cover"
    style={{ ...style(cadre), boxShadow: OMBRES.element }}
  />
);

// Étiquette PNG d'un partenaire (CHARTE/06_assets/partenaires, dessinée pour le fond blanc) : sous
// l'élément, réduite pour finir au-dessus de 1180 px. Proposition, à vérifier sur le rouge.
export const EtiquettePngRouge: React.FC<{ src: string; sous: Cadre }> = ({
  src,
  sous,
}) => {
  const haut = sous.haut + sous.hauteur + E.ecart / 2;
  const largeur = Math.min(821, ((ELEMENTS.bas - haut) * 1080) / 353);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: (1080 - largeur) / 2,
        top: haut,
        width: largeur,
      }}
    />
  );
};

// Étiquette (style 02 « Blanc ») centrée sous l'élément : nom en Anton blanc, précision en Thunder
// blanc espacé dessous, ombre légère ; une ligne plus large que 690 px est réduite
export const EtiquetteRouge: React.FC<{
  nom: string;
  precision?: string;
  sous: Cadre;
}> = ({ nom, precision, sous }) => {
  const ligne = (
    texte: string,
    police: string,
    capitales: number,
    espacement: number,
  ) => {
    let taille = corpsPourCapitales(police, capitales);
    const l = encre(texte, police, taille, { espacement }).l;
    if (l > E.largeurMax) taille *= E.largeurMax / l;
    const e = encre(texte, police, taille, { espacement });
    return { taille, x: 540 - e.l / 2 + e.g };
  };
  const baseNom = sous.haut + sous.hauteur + E.ecart + E.capitalesNom;
  const n = ligne(nom, POLICES_ROUGE.titre, E.capitalesNom, 0);
  const p = precision
    ? ligne(
        precision,
        POLICES_ROUGE.texte,
        E.capitalesPrecision,
        E.espacementPrecision,
      )
    : null;
  return (
    <AbsoluteFill style={{ filter: OMBRES.etiquette }}>
      <svg width={1080} height={1920}>
        <text
          x={n.x}
          y={baseNom}
          fontFamily={POLICES_ROUGE.titre}
          fontSize={n.taille}
          fill={BLANC}
          style={{ whiteSpace: "pre" }}
        >
          {nom}
        </text>
        {p && (
          <text
            x={p.x}
            y={baseNom + E.entre + E.capitalesPrecision}
            fontFamily={POLICES_ROUGE.texte}
            fontSize={p.taille}
            letterSpacing={E.espacementPrecision}
            fill={BLANC}
            style={{ whiteSpace: "pre" }}
          >
            {precision}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
