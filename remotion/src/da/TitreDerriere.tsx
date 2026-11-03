// Recherche de DA (2026-11-03, DA MIKHA/planche_titres) : titre d'accroche « piste 02 », un mot
// géant en Anton qui passe derrière le sujet, et trois apparitions retenues par Michaël
// (01 sort de derrière la tête, 06 du flou au net, 08 frappe). Test sur l'ouverture du rush de la
// vidéo 2 ; ne fait pas partie de la charte (jaune, Gilroy), qui reste inchangée.
//   python3 scripts/placer_titre_derriere.py public/da/popup/sujet MEHOMIES --police public/da/polices/Anton-Regular.ttf --depuis 20
//   npx remotion render DA-TitreDerriere out/da_montee.mp4 --props='{"apparition":"montee"}'
import { loadFont } from "@remotion/fonts";
import { Video } from "@remotion/media";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import placement from "../../public/da/popup/placement.json";

export type Apparition = "montee" | "flou" | "frappe";
// Contour de secours redessiné devant le sujet : jamais, toujours, ou seulement sur les lettres
// et les images où la tête cache trop la lettre (couverture mesurée par placer_titre_derriere.py)
export type Contour = "non" | "toujours" | "auto";
export type ProprietesTitreDerriere = {
  apparition: Apparition;
  contour: Contour;
};

const ROUGE = "#F12F19";
const PETIT = "LE PREMIER POP-UP";
const RUSH = { fichier: "v2/rush.mp4", debut: 426 }; // phrase P1 (decoupage.json, segment 1)
export const DUREE_TITRE_DERRIERE = 86;

// Contour auto (propositions) : invisible sous 22 % de lettre cachée, plein à 35 %, lissé sur
// ± 4 images pour qu'il ne clignote pas
const CONTOUR_AUTO = { debut: 0.22, plein: 0.35, lissage: 4 };
const opaciteContour = (f: number, lettre: number) => {
  const { couverture } = placement;
  let somme = 0;
  let n = 0;
  for (let k = f - CONTOUR_AUTO.lissage; k <= f + CONTOUR_AUTO.lissage; k++) {
    const part =
      couverture[Math.min(couverture.length - 1, Math.max(0, k))][lettre] ?? 0;
    somme += interpolate(
      part,
      [CONTOUR_AUTO.debut, CONTOUR_AUTO.plein],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
    n++;
  }
  return somme / n;
};

const SORTIE = Easing.bezier(0.16, 1, 0.3, 1);
const prog = (f: number, debut: number, duree: number) =>
  interpolate(f, [debut, debut + duree], [0, 1], {
    easing: SORTIE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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

// Calque plein cadre qui porte un texte SVG (ligne de base exacte, comme le script de placement)
const Calque: React.FC<{
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ style, children }) => (
  <AbsoluteFill style={style}>
    <svg width={1080} height={1920}>
      {children}
    </svg>
  </AbsoluteFill>
);

export const TitreDerriere: React.FC<ProprietesTitreDerriere> = ({
  apparition,
  contour,
}) => {
  const f = useCurrentFrame();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() => delayRender("Polices DA"));
  const [pret, setPret] = useState(false);
  useEffect(() => {
    chargement()
      .then(() => {
        setPret(true);
        continueRender(attente);
      })
      .catch(cancelRender);
  }, [attente, continueRender, cancelRender]);

  const { taille, ligneDeBase, hautCapitales, x0, largeur } = placement;
  const capitales = ligneDeBase - hautCapitales;
  const basPetit = hautCapitales - 34;
  const lettresPetit = [...PETIT];
  const lettres = [...placement.mot];

  // Styles du petit texte et du mot géant, image par image
  let petit: React.CSSProperties = {};
  let geant: React.CSSProperties = {};
  let espacement = 16;
  let opacitePetit: (i: number) => number = () => 1;
  let opaciteGeant: (i: number) => number = () => 1;
  if (apparition === "montee") {
    const p = prog(f, 0, 12),
      g = prog(f, 6, 14);
    petit = { opacity: p };
    espacement = 40 - 24 * p;
    // Le mot monte d'une hauteur de capitales ; la découpe reste fixe sous la ligne de base
    // (elle est posée avant le déplacement, d'où le décalage compensé)
    const decalage = (1 - g) * (capitales + 30);
    geant = {
      transform: `translateY(${decalage}px)`,
      clipPath: `inset(0 0 ${1920 - ligneDeBase - 12 + decalage}px 0)`,
    };
  } else if (apparition === "flou") {
    const p = prog(f, 0, 12),
      g = prog(f, 4, 16);
    petit = { opacity: p, filter: `blur(${12 * (1 - p)}px)` };
    geant = {
      opacity: g,
      filter: `blur(${26 * (1 - g)}px)`,
      transform: `scale(${1.12 - 0.12 * g})`,
      transformOrigin: `${x0 + largeur / 2}px ${ligneDeBase - capitales / 2}px`,
    };
  } else {
    opacitePetit = (i) => (f >= i ? 1 : 0);
    opaciteGeant = (i) => (f >= lettresPetit.length + 2 + i * 2 ? 1 : 0);
  }

  const motGeant = (trait: boolean) => (
    <text
      x={x0}
      y={ligneDeBase}
      fontFamily="Anton"
      fontSize={taille}
      textLength={largeur}
      lengthAdjust="spacing"
      fill={trait ? "none" : ROUGE}
      stroke={trait ? ROUGE : undefined}
      strokeWidth={trait ? 3 : undefined}
    >
      {lettres.map((l, i) => (
        <tspan
          key={i}
          opacity={
            opaciteGeant(i) *
            (trait && contour === "auto" ? opaciteContour(f, i) : 1)
          }
        >
          {l}
        </tspan>
      ))}
    </text>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video src={staticFile(RUSH.fichier)} trimBefore={RUSH.debut} />
      {pret && (
        <>
          <Calque style={geant}>{motGeant(false)}</Calque>
        </>
      )}
      <Img
        src={staticFile(`da/popup/sujet/${String(f).padStart(4, "0")}.png`)}
        style={{
          position: "absolute",
          inset: 0,
          width: 1080,
          height: 1920,
          filter: "drop-shadow(0 0 36px rgba(0,0,0,.45))",
        }}
      />
      {pret && contour !== "non" && (
        <Calque style={geant}>{motGeant(true)}</Calque>
      )}
      {/* La petite ligne passe devant le sujet : trop fine pour rester lisible derrière */}
      {pret && (
        <Calque style={petit}>
          <text
            x={540 + espacement / 2}
            y={basPetit}
            textAnchor="middle"
            fontFamily="Thunder"
            fontSize={84}
            letterSpacing={espacement}
            fill={ROUGE}
          >
            {lettresPetit.map((l, i) => (
              <tspan key={i} opacity={opacitePetit(i)}>
                {l}
              </tspan>
            ))}
          </text>
        </Calque>
      )}
    </AbsoluteFill>
  );
};
