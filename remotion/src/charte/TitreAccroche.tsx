import { useMemo } from "react";
import { mesurer } from "./polices";
import {
  CANEVAS,
  COULEURS,
  type CouleurTexte,
  POLICES,
  TITRE_ACCROCHE,
} from "./tokens";

export type LigneTitre = { texte: string; couleur: CouleurTexte };

// Titre d'accroche (DESIGN.md §3.1) : lignes en Gilroy Heavy dont la taille s'ajuste pour que les
// bords gauche et droit soient alignés, mesurés sur l'encre réelle ; le jaune met en avant les mots
// importants. Posé sur le face cam, sous le visage (bas de la dernière ligne fixé), avec une ombre
// portée sombre. Fixe : il apparaît et disparaît en coupe sèche.
export const TitreAccroche: React.FC<{ lignes: LigneTitre[] }> = ({
  lignes,
}) => {
  const disposition = useMemo(() => {
    const REF = 100;
    const mesures = lignes.map((ligne) => {
      const m = mesurer(ligne.texte, POLICES.heavy, REF);
      const encre = m.encreGauche + m.encreDroite;
      const taille = Math.min(
        TITRE_ACCROCHE.tailleMax,
        (TITRE_ACCROCHE.largeur / encre) * REF,
      );
      const echelle = taille / REF;
      // origine du texte telle que l'encre soit centrée sur le canevas
      const x =
        CANEVAS.largeur / 2 - (encre * echelle) / 2 + m.encreGauche * echelle;
      return { ...ligne, taille, x, capitales: m.capitales * echelle };
    });
    const hauteur =
      mesures.reduce((total, m) => total + m.capitales, 0) +
      TITRE_ACCROCHE.ecartEntreLignes * (mesures.length - 1);
    let haut = TITRE_ACCROCHE.bas - hauteur;
    return mesures.map((m) => {
      const ligneDeBase = haut + m.capitales;
      haut = ligneDeBase + TITRE_ACCROCHE.ecartEntreLignes;
      return { ...m, ligneDeBase };
    });
  }, [lignes]);
  const o = TITRE_ACCROCHE.ombre;

  return (
    <svg
      width={CANEVAS.largeur}
      height={CANEVAS.hauteur}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <filter id="ombre-titre" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow
            dx={o.dx}
            dy={o.dy}
            stdDeviation={o.flou}
            floodColor="#000000"
            floodOpacity={o.opacite}
          />
        </filter>
      </defs>
      {disposition.map((ligne, i) => (
        <text
          key={i}
          x={ligne.x}
          y={ligne.ligneDeBase}
          textAnchor="start"
          fontFamily={POLICES.heavy}
          fontSize={ligne.taille}
          fill={COULEURS[ligne.couleur]}
          filter="url(#ombre-titre)"
          style={{ whiteSpace: "pre" }}
        >
          {ligne.texte}
        </text>
      ))}
    </svg>
  );
};
