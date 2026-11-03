// Recherche de DA (2026-11-03) : la fin de vidéo. Test sur la dernière phrase de la vidéo 2 (P9,
// « … dans les semaines qui arrivent, let's go »), avec la musique comme dans le montage.
//   rien : la vidéo s'arrête sur la fin de la phrase (charte actuelle, MOTION.md)
//   letsgo : « LET'S GO » devient une signature, en bloc comme le titre, « GO » derrière la tête
//   carte : coupe sèche sur le fond rouge avec le nom du compte, comme le panneau de Michaël
// Détourage : swift scripts/detourer.swift public/da/fin/rush public/da/fin/sujet
//   npx remotion render DA-FinVideo "../DA MIKHA/tests_video/fin_letsgo.mp4" --props='{"fin":"letsgo"}'
import { loadFont } from "@remotion/fonts";
import { Audio, Video } from "@remotion/media";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import { FondRouge } from "./FondRougeGrain";

export type Fin = "rien" | "letsgo" | "carte";

const ROUGE = "#F12F19";
const OMBRE = "drop-shadow(0 6px 18px rgba(0,0,0,.55))";
// P9 dans le rush à partir de sa 30e image (source 7616) ; mots (mots_montage.json) en images
// depuis ce départ : « let's » à 24, « go » à 32, fin de la phrase à 38
const RUSH = { fichier: "v2/rush.mp4", debut: 7616 };
const MOTS = { lets: 24, go: 32, finPhrase: 38 };
// Musique : le montage la démarre à la fin du hook (image 86) ; P9 commence à 882
const MUSIQUE = { fichier: "v2/musique.wav", debut: 882 + 30 - 86 };
// Durées de chaque fin (propositions) : la signature reste 1 s après « go », la carte 1 s
export const DUREES_FIN: Record<Fin, number> = {
  rien: MOTS.finPhrase,
  letsgo: 62,
  carte: MOTS.finPhrase + 30,
};
export const DUREE_FIN = DUREES_FIN.letsgo;

// Chargées au montage du composant, pas à l'import : Root importe ce fichier même sur un Mac
// qui n'a pas public/da/ (non synchronisé)
const chargement = () =>
  loadFont({
    family: "Anton",
    url: staticFile("da/polices/Anton-Regular.ttf"),
  });
const encre = (t: string, taille: number) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${taille}px Anton`;
  const m = ctx.measureText(t);
  return {
    g: m.actualBoundingBoxLeft,
    l: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    haut: m.actualBoundingBoxAscent,
  };
};

// « LET'S » en petit et en blanc, « GO » géant et rouge, sur la même ligne de base, en haut de la
// zone sûre (85 à 1018, haut à 219, 330 px de haut au plus, comme le titre)
type Morceau = {
  t: string;
  taille: number;
  x: number;
  base: number;
  haut: number;
};
const signature = (): Morceau[] => {
  const W = 933,
    ecart = 24,
    part = 0.42; // capitales de « LET'S » par rapport à « GO »
  const largeur = (cap: number) =>
    encre("GO", (100 * cap) / encre("GO", 100).haut).l +
    ecart +
    encre("LET'S", (100 * cap * part) / encre("LET'S", 100).haut).l;
  const cap = Math.min(330, (100 * W) / largeur(100));
  const tg = (100 * cap) / encre("GO", 100).haut,
    tp = (100 * cap * part) / encre("LET'S", 100).haut;
  const x0 = 85 + (W - largeur(cap)) / 2,
    base = 219 + cap;
  const lp = encre("LET'S", tp);
  return [
    { t: "LET'S", taille: tp, x: x0 + lp.g, base, haut: lp.haut },
    {
      t: "GO",
      taille: tg,
      x: x0 + lp.l + ecart + encre("GO", tg).g,
      base,
      haut: cap,
    },
  ];
};

// Le morceau sort d'une ligne fixe sous sa ligne de base (apparition du titre)
const Sortant: React.FC<{
  m: Morceau;
  debut: number;
  couleur: string;
  trait?: boolean;
}> = ({ m, debut, couleur, trait }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [debut, debut + 12], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const id = `fin-${m.t}-${trait ? "t" : "p"}`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={1080} height={m.base + 8} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <text
          x={m.x}
          y={m.base}
          transform={`translate(0 ${(1 - p) * (m.haut + 16)})`}
          fontFamily="Anton"
          fontSize={m.taille}
          fill={trait ? "none" : couleur}
          stroke={trait ? couleur : undefined}
          strokeWidth={trait ? 3 : undefined}
        >
          {m.t}
        </text>
      </g>
    </svg>
  );
};

export const FinVideo: React.FC<{ fin: Fin }> = ({ fin }) => {
  const f = useCurrentFrame();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() => delayRender("Police Anton"));
  const [morceaux, setMorceaux] = useState<Morceau[]>([]);
  useEffect(() => {
    chargement()
      .then(() => {
        setMorceaux(signature());
        continueRender(attente);
      })
      .catch(cancelRender);
  }, [attente, continueRender, cancelRender]);

  const duree = DUREES_FIN[fin];
  const [lets, go] = morceaux;
  const visage = fin === "carte" ? MOTS.finPhrase : duree;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={visage}>
        <Video src={staticFile(RUSH.fichier)} trimBefore={RUSH.debut} />
      </Sequence>
      {fin === "letsgo" && go && (
        <>
          <AbsoluteFill style={{ filter: OMBRE }}>
            <Sortant m={go} debut={MOTS.go - 2} couleur={ROUGE} />
          </AbsoluteFill>
          <Img
            src={staticFile(
              `da/fin/sujet/${String(Math.min(f, 61)).padStart(4, "0")}.png`,
            )}
            style={{
              position: "absolute",
              inset: 0,
              width: 1080,
              height: 1920,
              filter: "drop-shadow(0 0 36px rgba(0,0,0,.45))",
            }}
          />
          <Sortant m={go} debut={MOTS.go - 2} couleur={ROUGE} trait />
          <AbsoluteFill style={{ filter: OMBRE }}>
            <Sortant m={lets} debut={MOTS.lets - 2} couleur="#fff" />
          </AbsoluteFill>
        </>
      )}
      {fin === "carte" && f >= MOTS.finPhrase && (
        <AbsoluteFill>
          <FondRouge cadence={0} />
          {/* Comme le panneau « SUR TOUT LE SITE » : Anton noir, léger flou */}
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 1920 - 1180 - 219,
              paddingTop: 219,
              filter: "blur(2.2px)",
              opacity: interpolate(
                f,
                [MOTS.finPhrase, MOTS.finPhrase + 8],
                [0, 1],
                {
                  extrapolateRight: "clamp",
                },
              ),
              transform: `scale(${interpolate(
                f,
                [MOTS.finPhrase, MOTS.finPhrase + 8],
                [1.06, 1],
                {
                  easing: Easing.bezier(0.33, 1, 0.68, 1),
                  extrapolateRight: "clamp",
                },
              )})`,
            }}
          >
            <div
              style={{
                fontFamily: "Anton",
                fontSize: 150,
                lineHeight: 1,
                color: "#0d0d0d",
              }}
            >
              @MIKHA_DLM
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <Audio
        src={staticFile(MUSIQUE.fichier)}
        trimBefore={MUSIQUE.debut}
        durationInFrames={duree}
      />
      {fin === "carte" && (
        <Sequence from={MOTS.finPhrase - 5}>
          <Audio src={staticFile("charte/sfx/clic.wav")} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
