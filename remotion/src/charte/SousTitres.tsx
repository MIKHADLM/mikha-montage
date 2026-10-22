import { useCurrentFrame } from "remotion";
import { mesurer } from "./polices";
import { CANEVAS, POLICES, SOUS_TITRES, TITRE_ACCROCHE } from "./tokens";

export type GroupeSousTitres = { debut: number; fin: number; texte: string };
// Style à une image donnée : couleur et ligne de base, ou null quand les sous-titres sont masqués.
// ombre : celle du titre d'accroche, pour un fond clair derrière des sous-titres blancs (option du plan)
export type StyleSousTitres = {
  couleur: string;
  ligneDeBase: number;
  ombre?: boolean;
} | null;

// Sous-titres (SOUS-TITRES.md) : Gilroy ExtraBold, groupe de 1 à 3 mots affiché en entier, centré,
// sans ombre (sauf option du plan). Un groupe trop large pour la zone sûre est réduit.
export const SousTitres: React.FC<{
  groupes: GroupeSousTitres[];
  style: (frame: number) => StyleSousTitres;
}> = ({ groupes, style }) => {
  const frame = useCurrentFrame();
  const groupe = groupes.find((g) => frame >= g.debut && frame < g.fin);
  const s = style(frame);
  if (!groupe || !s) {
    return null;
  }
  const largeur = mesurer(
    groupe.texte,
    POLICES.extraBold,
    SOUS_TITRES.taille,
  ).largeur;
  const taille = Math.min(
    SOUS_TITRES.taille,
    (SOUS_TITRES.taille * SOUS_TITRES.largeurMax) / largeur,
  );
  const o = TITRE_ACCROCHE.ombre;

  return (
    <svg
      width={CANEVAS.largeur}
      height={CANEVAS.hauteur}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {s.ombre && (
        <defs>
          <filter id="ombre-st" x="-10%" y="-30%" width="120%" height="180%">
            <feDropShadow
              dx={o.dx}
              dy={o.dy}
              stdDeviation={o.flou}
              floodColor="#000000"
              floodOpacity={o.opacite}
            />
          </filter>
        </defs>
      )}
      <text
        x={CANEVAS.largeur / 2}
        y={s.ligneDeBase}
        textAnchor="middle"
        fontFamily={POLICES.extraBold}
        fontSize={taille}
        fill={s.couleur}
        filter={s.ombre ? "url(#ombre-st)" : undefined}
        style={{ whiteSpace: "pre" }}
      >
        {groupe.texte}
      </text>
    </svg>
  );
};
