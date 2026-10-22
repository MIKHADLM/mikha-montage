import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { mesurer } from "./polices";
import { CANEVAS, COMPOSITION_TEXTE, COULEURS, POLICES } from "./tokens";

export type Morceau = { texte: string; police: "titre" | "accent" };
export type LigneComposition = { morceaux: Morceau[]; apparition: number };

// Composition de texte (DESIGN.md §3) : lignes centrées dont la taille s'ajuste pour que
// tous les bords soient alignés, mesurés sur l'encre réelle (les coups de pinceau de
// Permanent Marker dépassent la largeur théorique des lettres). Gilroy Heavy noir,
// Permanent Marker rouge sur les mots importants. Chaque ligne apparaît quand ses mots
// sont prononcés (apparition, en images, relative au début de la séquence).
export const CompositionTexte: React.FC<{ lignes: LigneComposition[] }> = ({ lignes }) => {
  const frame = useCurrentFrame();

  const disposition = useMemo(() => {
    const REF = 100;
    const mesures = lignes.map((ligne) => {
      const morceaux = ligne.morceaux.map((m) => {
        const famille = POLICES[m.police];
        return { ...m, famille, ...mesurer(m.texte, famille, REF) };
      });
      const premier = morceaux[0];
      const dernier = morceaux[morceaux.length - 1];
      const avances = morceaux.slice(0, -1).reduce((total, m) => total + m.largeur, 0);
      const encreRef = premier.encreGauche + avances + dernier.encreDroite;
      const taille = Math.min(
        COMPOSITION_TEXTE.tailleMax,
        Math.max(COMPOSITION_TEXTE.tailleMin, (COMPOSITION_TEXTE.largeur / encreRef) * REF),
      );
      const echelle = taille / REF;
      // origine du texte telle que l'encre soit centrée sur le canevas
      const x = CANEVAS.largeur / 2 - (encreRef * echelle) / 2 + premier.encreGauche * echelle;
      const capitales = Math.max(...morceaux.map((m) => m.capitales * echelle));
      return { morceaux, taille, capitales, x };
    });
    const hauteur =
      mesures.reduce((total, m) => total + m.capitales, 0) +
      COMPOSITION_TEXTE.ecartEntreLignes * (mesures.length - 1);
    let haut = COMPOSITION_TEXTE.centreY - hauteur / 2;
    return mesures.map((m) => {
      const ligneDeBase = haut + m.capitales;
      haut = ligneDeBase + COMPOSITION_TEXTE.ecartEntreLignes;
      return { ...m, ligneDeBase };
    });
  }, [lignes]);

  return (
    <svg
      width={CANEVAS.largeur}
      height={CANEVAS.hauteur}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {disposition.map((ligne, i) =>
        frame >= lignes[i].apparition ? (
          <text
            key={i}
            x={ligne.x}
            y={ligne.ligneDeBase}
            textAnchor="start"
            fontSize={ligne.taille}
            style={{ whiteSpace: "pre" }}
          >
            {ligne.morceaux.map((m, j) => (
              <tspan
                key={j}
                fontFamily={m.famille}
                fill={m.police === "accent" ? COULEURS.accent : COULEURS.texte}
              >
                {m.texte}
              </tspan>
            ))}
          </text>
        ) : null,
      )}
    </svg>
  );
};
