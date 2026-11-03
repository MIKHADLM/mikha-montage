// Recherche de DA (2026-11-03, DA MIKHA/planche_titres/composition.html, carte 06) : texte posé
// sur une image d'illustration, composé « en escalier » (lignes de tailles et de calages
// différents) en Chivo ExtraBold minuscule très serrée, rouge, avec ombre portée. Apparition mot
// par mot. Pas de crochets ni d'astérisque (demande de Michaël). Test sur le plan 1 du jeu
// FAKHOMIES ; ne fait pas partie de la charte.
//   npx remotion render DA-TexteIllustration "../DA MIKHA/tests_video/illustration_escalier.mp4"
import { loadFont } from "@remotion/fonts";
import { measureText } from "@remotion/layout-utils";
import { Video } from "@remotion/media";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";

export const FPS_ILLUSTRATION = 24; // cadence du rendu du jeu
export const DUREE_ILLUSTRATION = 120;

const ROUGE = "#F12F19";
const POLICE = "Chivo";
const GRAISSE = 800;
const APPROCHE = -0.05; // em
// Entre deux lignes : écart minimal entre l'encre de l'une (jambages, accents compris) et celle de
// la suivante (ascendantes, apostrophes), en part du corps de la ligne suivante (proposition)
const ECART = 0.16;
const OMBRE = "drop-shadow(0 6px 18px rgba(0,0,0,.55))"; // proposition

// L'escalier : chaque ligne a une largeur cible (part de 1080) et un retrait à gauche.
// Les lignes « fortes » portent les mots clés et prennent presque toute la largeur.
const LIGNES = [
  { texte: "il s’agit", largeur: 0.48, gauche: 0.12 },
  { texte: "d’un jeu", largeur: 0.44, gauche: 0.36 },
  { texte: "d’horreur", largeur: 0.76, gauche: 0.1 },
  { texte: "sorti à", largeur: 0.3, gauche: 0.5 },
  { texte: "l’occasion", largeur: 0.54, gauche: 0.14 },
  { texte: "d’halloween", largeur: 0.8, gauche: 0.08 },
];
const HAUT = 560; // haut des capitales de la première ligne

// Mot par mot : premier mot à 0,4 s, puis un mot toutes les 5 images (propositions)
const T = { debut: 10, intervalle: 5, duree: 6 };

// Chargées au montage du composant, pas à l'import : Root importe ce fichier même sur un Mac
// qui n'a pas public/da/ (non synchronisé)
const chargement = () =>
  loadFont({
    family: POLICE,
    url: staticFile("da/polices/Chivo-VariableFont_wght.ttf"),
    weight: "100 900",
  });

export const TexteIllustration: React.FC = () => {
  const f = useCurrentFrame();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() => delayRender("Police Chivo"));
  const [pret, setPret] = useState(false);
  useEffect(() => {
    chargement()
      .then(() => {
        setPret(true);
        continueRender(attente);
      })
      .catch(cancelRender);
  }, [attente, continueRender, cancelRender]);

  // Corps de chaque ligne pour atteindre sa largeur cible, puis lignes de base successives
  const mesure = (texte: string, corps: number) =>
    measureText({
      text: texte,
      fontFamily: POLICE,
      fontWeight: GRAISSE,
      fontSize: corps,
      letterSpacing: `${APPROCHE * corps}px`,
    }).width;
  // Encre réelle d'une ligne au-dessus et au-dessous de sa ligne de base
  const encre = (texte: string, corps: number) => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.font = `${GRAISSE} ${corps}px "${POLICE}"`;
    ctx.letterSpacing = `${APPROCHE * corps}px`;
    const m = ctx.measureText(texte);
    return { haut: m.actualBoundingBoxAscent, bas: m.actualBoundingBoxDescent };
  };
  let base = HAUT;
  let basPrecedent = 0;
  let rang = 0;
  const lignes = pret
    ? LIGNES.map((l, i) => {
        const corps = (100 * l.largeur * 1080) / mesure(l.texte, 100);
        const { haut, bas } = encre(l.texte, corps);
        base += i === 0 ? haut : basPrecedent + ECART * corps + haut;
        basPrecedent = bas;
        const mots = l.texte.split(" ").map((m) => ({ m, rang: rang++ }));
        return { ...l, corps, base, mots };
      })
    : [];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video src={staticFile("da/fakhomies/entrepot.mp4")} />
      <AbsoluteFill style={{ filter: OMBRE }}>
        <svg width={1080} height={1920}>
          {lignes.map((l) => (
            <text
              key={l.texte}
              x={l.gauche * 1080}
              y={l.base}
              fontFamily={POLICE}
              fontWeight={GRAISSE}
              fontSize={l.corps}
              letterSpacing={APPROCHE * l.corps}
              fill={ROUGE}
              style={{ whiteSpace: "pre" }}
            >
              {l.mots.map(({ m, rang: r }, j) => {
                const p = interpolate(
                  f,
                  [
                    T.debut + r * T.intervalle,
                    T.debut + r * T.intervalle + T.duree,
                  ],
                  [0, 1],
                  {
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                );
                return (
                  <tspan key={j} opacity={p} dy={0}>
                    {(j ? " " : "") + m}
                  </tspan>
                );
              })}
            </text>
          ))}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
