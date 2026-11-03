import { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { encre } from "./polices";
import {
  ELEMENTS,
  ESCALIER,
  NOIR_TEXTE,
  OMBRES,
  POLICES_ROUGE,
  ROUGE,
} from "./tokens";

// Une ligne de l'escalier : largeur cible et retrait à gauche, en part de 1080 px
export type LigneEscalier = { texte: string; largeur: number; gauche: number };

// Texte en escalier (DECISIONS.md, carte 06) : Chivo 800 en minuscules très serrées, lignes de tailles
// et de retraits différents, mots clés en grand, sans caractères spéciaux. Sur le fond rouge : noir
// flouté comme le panneau « SUR TOUT LE SITE », sans ombre ; sur une image : rouge avec ombre.
// Mot par mot. Le bloc est centré entre le haut de la zone sûre et la limite des éléments (1180 px).
export const TexteEscalier: React.FC<{
  lignes: LigneEscalier[];
  surRouge: boolean;
  apparitions?: number[]; // image d'apparition de chaque mot (calée sur la voix), sinon cadence fixe
}> = ({ lignes, surRouge, apparitions }) => {
  const f = useCurrentFrame();
  const P = POLICES_ROUGE.escalier;
  const disposition = useMemo(() => {
    const opts = (corps: number) => ({
      graisse: ESCALIER.graisse,
      espacement: ESCALIER.approche * corps,
    });
    let base = 0;
    let basPrecedent = 0;
    let rang = 0;
    const l = lignes.map((x, i) => {
      const corps =
        (100 * x.largeur * 1080) / encre(x.texte, P, 100, opts(100)).avance;
      const { haut, bas } = encre(x.texte, P, corps, opts(corps));
      base += i === 0 ? haut : basPrecedent + ESCALIER.ecart * corps + haut;
      basPrecedent = bas;
      const mots = x.texte.split(" ").map((m) => ({ m, rang: rang++ }));
      return { ...x, corps, base, haut: i === 0 ? haut : 0, mots };
    });
    const hauteur = base + basPrecedent;
    const decalage = Math.max(
      ELEMENTS.haut,
      (ELEMENTS.haut + ELEMENTS.bas - hauteur) / 2,
    );
    return l.map((x) => ({ ...x, base: x.base + decalage }));
  }, [lignes, P]);
  const A = ESCALIER.apparition;

  return (
    <AbsoluteFill
      style={{
        filter: surRouge ? `blur(${ESCALIER.flouSurRouge}px)` : OMBRES.titre,
      }}
    >
      <svg width={1080} height={1920}>
        {disposition.map((l, i) => (
          <text
            key={i}
            x={l.gauche * 1080}
            y={l.base}
            fontFamily={P}
            fontWeight={ESCALIER.graisse}
            fontSize={l.corps}
            letterSpacing={ESCALIER.approche * l.corps}
            fill={surRouge ? NOIR_TEXTE : ROUGE}
            style={{ whiteSpace: "pre" }}
          >
            {l.mots.map(({ m, rang }, j) => (
              <tspan
                key={j}
                opacity={interpolate(
                  f,
                  [
                    apparitions?.[rang] ?? A.debut + rang * A.intervalle,
                    (apparitions?.[rang] ?? A.debut + rang * A.intervalle) +
                      A.duree,
                  ],
                  [0, 1],
                  {
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                )}
              >
                {(j ? " " : "") + m}
              </tspan>
            ))}
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
