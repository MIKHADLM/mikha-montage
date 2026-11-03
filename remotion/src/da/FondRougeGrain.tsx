// Recherche de DA (2026-11-03) : le fond rouge grainé des séquences d'illustration, à la place du
// fond blanc. Grain mesuré sur le panneau de Michaël (DA MIKHA/Panneau_2.png) : monochrome (le même
// écart sur les trois couches), écart-type ≈ 10,7 niveaux, grain d'un pixel. Il est seulement sur le
// fond : l'affiche posée dessus n'en a pas (Panneau_1.png). Le grain est calculé, pas une image :
// même tirage pour une même image, donc le rendu est reproductible.
//   npx remotion render DA-FondRougeGrain "../DA MIKHA/tests_video/grain_12.mp4" --props='{"cadence":12}'
import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { AbsoluteFill, Img, staticFile, useDelayRender } from "remotion";
import { FondRouge } from "./rouge/FondRouge";

export { FondRouge };

export const DUREE_FOND_ROUGE_GRAIN = 90;

// Scène de test : l'affiche du 7 novembre posée sur le fond, avec son étiquette (style 02)
// Chargées au montage du composant, pas à l'import : Root importe ce fichier même sur un Mac
// qui n'a pas public/da/ (non synchronisé)
const chargement = () =>
  Promise.all([
    loadFont({
      family: "Anton",
      url: staticFile("da/polices/Anton-Regular.ttf"),
    }),
    loadFont({
      family: "Thunder",
      url: staticFile("da/polices/Thunder-LC.ttf"),
    }),
  ]);
const AFFICHE = { x: 96, y: 430, l: 888, h: 500 };
const ETIQUETTE = { ecart: 56, capNom: 62, capPrecision: 44, entre: 22 };

const capitales = (police: string) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `100px ${police}`;
  return ctx.measureText("H").actualBoundingBoxAscent / 100;
};

// L'affiche et son étiquette, sans le fond (style : opacité et transformation de l'apparition)
export const AfficheEtiquette: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() => delayRender("Polices DA"));
  const [ratio, setRatio] = useState<{ anton: number; thunder: number }>();
  useEffect(() => {
    chargement()
      .then(() => {
        setRatio({ anton: capitales("Anton"), thunder: capitales("Thunder") });
        continueRender(attente);
      })
      .catch(cancelRender);
  }, [attente, continueRender, cancelRender]);

  const haut = AFFICHE.y + AFFICHE.h + ETIQUETTE.ecart;
  return (
    <AbsoluteFill style={style}>
      <Img
        src={staticFile("v2/images/couverture-space-jam-7.png")}
        style={{
          position: "absolute",
          left: AFFICHE.x,
          top: AFFICHE.y,
          width: AFFICHE.l,
          height: AFFICHE.h,
          objectFit: "cover",
          boxShadow: "0 14px 34px rgba(0,0,0,.35)",
        }}
      />
      {ratio && (
        <svg
          width={1080}
          height={1920}
          style={{
            position: "absolute",
            inset: 0,
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,.45))",
          }}
        >
          <text
            x={540}
            y={haut + ETIQUETTE.capNom}
            textAnchor="middle"
            fontFamily="Anton"
            fontSize={ETIQUETTE.capNom / ratio.anton}
            fill="#fff"
          >
            7 NOVEMBRE
          </text>
          <text
            x={540}
            y={
              haut + ETIQUETTE.capNom + ETIQUETTE.entre + ETIQUETTE.capPrecision
            }
            textAnchor="middle"
            fontFamily="Thunder"
            fontSize={ETIQUETTE.capPrecision / ratio.thunder}
            letterSpacing={3}
            fill="#fff"
          >
            Condition Publique, Roubaix
          </text>
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const FondRougeGrain: React.FC<{ cadence: number }> = ({ cadence }) => (
  <AbsoluteFill>
    <FondRouge cadence={cadence} />
    <AfficheEtiquette />
  </AbsoluteFill>
);
