// Recherche de DA (2026-11-03, DA MIKHA/planche_titres/titre_bloc.html) : titre d'accroche en bloc
// compact, d'après les références « Prospects » et « ideas and content » de Michaël. Mot clé géant en
// rouge, petits mots en blanc glissés à côté ; ombre portée. Deux compositions retenues :
//   05 « ligne » : mot clé et petit mot sur la même ligne, sous le visage, devant le sujet
//   06 « empiles » : petits mots empilés à côté du mot clé, en haut, les mots rouges derrière la tête
// Apparition : chaque morceau sort d'une ligne fixe sous sa ligne de base, dans l'ordre de lecture
// (même principe que l'apparition 01 du titre). Test sur l'ouverture du rush de la vidéo 2 (P1), suivie
// du début de P2 pour voir la sortie du titre à la coupe. Son et sortie : trois pistes à comparer.
//   npx remotion render DA-TitreBloc "../DA MIKHA/tests_video/titre_bloc_06.mp4" --props='{"compo":"empiles","son":"riser","sortie":"coupe"}'
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
  useVideoConfig,
} from "remotion";

export type CompoBloc = "ligne" | "empiles";
// Son : riser de la charte (fin calée sur la fin du hook), un clic par morceau, ou un whoosh
// Sortie : coupe sèche avec le plan, retour sous les lignes, ou flou
export type SonBloc = "aucun" | "riser" | "clics" | "whoosh";
export type SortieBloc = "coupe" | "retour" | "flou";
export type ProprietesTitreBloc = {
  compo: CompoBloc;
  son?: SonBloc;
  sortie?: SortieBloc;
};

const ROUGE = "#F12F19";
const BLANC = "#fff";
const POLICE = "Anton";
const OMBRE = "drop-shadow(0 6px 18px rgba(0,0,0,.55))"; // proposition
// Phrases P1 (le hook) et P2 (decoupage.json, segments 1 et 2)
const RUSH = { fichier: "v2/rush.mp4", p1: 426, p2: 1588 };
const HOOK = 86; // durée de P1 : le titre reste jusqu'à la coupe
export const DUREE_TITRE_BLOC = HOOK + 30;

// Le titre de la vidéo 2, découpé par rôle (voir la planche)
const TITRE = {
  avant: ["LE", "PREMIER"],
  cle: "POP-UP",
  lien: "DE",
  apres: "MEHOMIES",
};

// Zone sûre (CHARTE/02_design/DESIGN.md §7) et hauteur maximale du bloc (propositions)
const PLACE = {
  haut: { x: 85, W: 933, haut: 219, hMax: 330 },
  bas: { x: 195, W: 690, bas: 1340, hMax: 400 },
};

// Apparition (propositions) : un morceau toutes les 4 images, chacun monte en 12 images
const T = { debut: 2, intervalle: 4, duree: 12 };
// Sortie (propositions) : retour en 8 images, un morceau toutes les 2 images, fini à la coupe ;
// flou en 8 images
const S = { duree: 8, intervalle: 2 };
// Sons (CHARTE/04_son/SON.md) : le clic sonne 0,079 s après le début de son fichier ; le pic du
// whoosh cinématique est à 0,4 s (mesuré)
const SON = {
  riser: { fichier: "charte/sfx/riser.wav", dureeS: 5.329 },
  clic: { fichier: "charte/sfx/clic.wav", attaqueS: 0.079 },
  whoosh: { fichier: "da/sfx/whoosh_cinematic.wav", picS: 0.4 },
};

// Chargées au montage du composant, pas à l'import : Root importe ce fichier même sur un Mac
// qui n'a pas public/da/ (non synchronisé)
const chargement = () =>
  loadFont({
    family: POLICE,
    url: staticFile("da/polices/Anton-Regular.ttf"),
  });

type Morceau = {
  t: string;
  taille: number;
  x: number;
  base: number;
  haut: number;
  couleur: string;
  derriere: boolean;
};

// Encre d'un texte en Anton à une taille donnée
const encre = (t: string, taille: number) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${taille}px ${POLICE}`;
  const m = ctx.measureText(t);
  return {
    g: m.actualBoundingBoxLeft,
    l: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    haut: m.actualBoundingBoxAscent,
  };
};
const tailleLargeur = (t: string, l: number) => (100 * l) / encre(t, 100).l;
const tailleCap = (t: string, h: number) => (100 * h) / encre(t, 100).haut;
const morceau = (
  t: string,
  taille: number,
  x: number,
  base: number,
  couleur: string,
): Morceau => ({
  t,
  taille,
  x: x + encre(t, taille).g,
  base,
  haut: encre(t, taille).haut,
  couleur,
  derriere: false,
});

// 05 : petits mots en haut, mot clé géant et petit mot sur la même ligne de base, dernier mot en grand
const blocLigne = (W: number) => {
  const a = TITRE.avant.join(" ");
  const tc = tailleLargeur(TITRE.cle, W * 0.62),
    cc = encre(TITRE.cle, tc).haut;
  const cp = cc * 0.34,
    ta = tailleCap(a, cp);
  const tg = tailleLargeur(TITRE.apres, W * 0.92),
    cg = encre(TITRE.apres, tg).haut;
  const e1 = cp * 0.3,
    e2 = Math.min(cc, cg) * 0.1;
  const m = [
    morceau(a, ta, 0, cp, BLANC),
    morceau(TITRE.cle, tc, 0, cp + e1 + cc, ROUGE),
  ];
  if (TITRE.lien)
    m.push(
      morceau(TITRE.lien, ta, encre(TITRE.cle, tc).l + 18, cp + e1 + cc, BLANC),
    );
  m.push(morceau(TITRE.apres, tg, W * 0.08, cp + e1 + cc + e2 + cg, ROUGE));
  return { h: cp + e1 + cc + e2 + cg, m };
};

// 06 : petits mots empilés à gauche, à la hauteur exacte du mot clé ; dernier mot sur toute la largeur
const blocEmpiles = (W: number) => {
  const ecartX = 22;
  let lo = 20,
    hi = 600;
  let r = { tc: 0, cc: 0, ev: 0, cp: 0, tp: [0], lp: 0 };
  for (let i = 0; i < 40; i++) {
    const tc = (lo + hi) / 2,
      cc = encre(TITRE.cle, tc).haut,
      ev = cc * 0.12;
    const cp = (cc - ev) / 2;
    const tp = TITRE.avant.map((t) => tailleCap(t, cp));
    const lp = Math.max(...TITRE.avant.map((t, k) => encre(t, tp[k]).l));
    r = { tc, cc, ev, cp, tp, lp };
    if (lp + ecartX + encre(TITRE.cle, tc).l > W) hi = tc;
    else lo = tc;
  }
  const tg = tailleLargeur(TITRE.apres, W),
    cg = encre(TITRE.apres, tg).haut,
    ecart = Math.min(r.cc, cg) * 0.1;
  const m = TITRE.avant.map((t, k) =>
    morceau(
      t,
      r.tp[k],
      r.lp - encre(t, r.tp[k]).l,
      r.cp + k * (r.cp + r.ev),
      BLANC,
    ),
  );
  m.push(morceau(TITRE.cle, r.tc, r.lp + ecartX, r.cc, ROUGE));
  m.push(morceau(TITRE.apres, tg, 0, r.cc + ecart + cg, ROUGE));
  m.forEach((x) => (x.derriere = x.couleur === ROUGE));
  return { h: r.cc + ecart + cg, m };
};

// Place le bloc dans la zone sûre ; un bloc trop haut est réduit et recentré
const placer = (compo: CompoBloc): Morceau[] => {
  const p = compo === "ligne" ? PLACE.bas : PLACE.haut;
  const faire = compo === "ligne" ? blocLigne : blocEmpiles;
  let { h, m } = faire(p.W);
  let x0 = p.x;
  if (h > p.hMax) {
    const W = (p.W * p.hMax) / h;
    ({ h, m } = faire(W));
    x0 += (p.W - W) / 2;
  }
  const y0 = "haut" in p ? p.haut : p.bas - h;
  return m.map((x) => ({ ...x, x: x.x + x0, base: x.base + y0 }));
};

const SORTIE = Easing.bezier(0.16, 1, 0.3, 1);

// Un calque plein cadre ; chaque morceau sort d'une découpe fixe posée sous sa ligne de base
const Calque: React.FC<{
  morceaux: (Morceau & { rang: number })[];
  trait?: boolean;
  id: string;
  sortie: SortieBloc;
  total: number;
}> = ({ morceaux, trait, id, sortie, total }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        {morceaux.map((x) => (
          <clipPath key={x.rang} id={`${id}-${x.rang}`}>
            <rect x={0} y={0} width={1080} height={x.base + 8} />
          </clipPath>
        ))}
      </defs>
      {morceaux.map((x) => {
        const p = interpolate(
          f,
          [
            T.debut + x.rang * T.intervalle,
            T.debut + x.rang * T.intervalle + T.duree,
          ],
          [0, 1],
          {
            easing: SORTIE,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        // Retour : le dernier morceau lu redescend le premier, le dernier à partir finit à la coupe
        const debutRetour =
          HOOK -
          S.duree -
          (total - 1) * S.intervalle +
          (total - 1 - x.rang) * S.intervalle;
        const r =
          sortie === "retour"
            ? interpolate(f, [debutRetour, debutRetour + S.duree], [0, 1], {
                easing: Easing.in(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;
        const montee = Math.min(p, 1 - r);
        return (
          <g key={x.rang} clipPath={`url(#${id}-${x.rang})`}>
            <text
              x={x.x}
              y={x.base}
              transform={`translate(0 ${(1 - montee) * (x.haut + 16)})`}
              fontFamily={POLICE}
              fontSize={x.taille}
              fill={trait ? "none" : x.couleur}
              stroke={trait ? x.couleur : undefined}
              strokeWidth={trait ? 3 : undefined}
            >
              {x.t}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Les sons du titre, posés sur la timeline (en images)
const Sons: React.FC<{ son: SonBloc; total: number }> = ({ son, total }) => {
  const { fps } = useVideoConfig();
  if (son === "riser") {
    // La fin du riser tombe avec la fin du hook (SON.md)
    const duree = Math.round(SON.riser.dureeS * fps);
    return (
      <Sequence durationInFrames={HOOK}>
        <Audio
          src={staticFile(SON.riser.fichier)}
          trimBefore={Math.max(0, duree - HOOK)}
        />
      </Sequence>
    );
  }
  if (son === "clics") {
    // Un clic quand chaque morceau sort de sa ligne (1 image après son départ)
    const attaque = Math.round(SON.clic.attaqueS * fps);
    return (
      <>
        {Array.from({ length: total }, (_, rang) => {
          const image = T.debut + rang * T.intervalle + 1 - attaque;
          return (
            <Sequence key={rang} from={Math.max(0, image)}>
              <Audio
                src={staticFile(SON.clic.fichier)}
                trimBefore={Math.max(0, -image)}
              />
            </Sequence>
          );
        })}
      </>
    );
  }
  if (son === "whoosh") {
    // Le pic du whoosh tombe au milieu de l'apparition du bloc
    const fin = T.debut + (total - 1) * T.intervalle + T.duree;
    const image = Math.round((T.debut + fin) / 2 - SON.whoosh.picS * fps);
    return (
      <Sequence from={Math.max(0, image)}>
        <Audio
          src={staticFile(SON.whoosh.fichier)}
          trimBefore={Math.max(0, -image)}
        />
      </Sequence>
    );
  }
  return null;
};

export const TitreBloc: React.FC<ProprietesTitreBloc> = ({
  compo,
  son = "aucun",
  sortie = "coupe",
}) => {
  const f = useCurrentFrame();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() => delayRender("Police Anton"));
  const [morceaux, setMorceaux] = useState<(Morceau & { rang: number })[]>([]);
  useEffect(() => {
    chargement()
      .then(() => {
        // Ordre de lecture : de haut en bas, puis de gauche à droite
        const m = placer(compo)
          .sort((a, b) => a.base - b.base || a.x - b.x)
          .map((x, rang) => ({ ...x, rang }));
        setMorceaux(m);
        continueRender(attente);
      })
      .catch(cancelRender);
  }, [attente, compo, continueRender, cancelRender]);

  const derriere = morceaux.filter((x) => x.derriere);
  const devant = morceaux.filter((x) => !x.derriere);
  const total = morceaux.length;
  // Flou de sortie, appliqué à chaque calque de texte (jamais au sujet)
  const flou =
    sortie === "flou"
      ? interpolate(f, [HOOK - S.duree, HOOK], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const style = (ombre: boolean): React.CSSProperties => ({
    filter:
      [ombre ? OMBRE : "", flou ? `blur(${24 * flou}px)` : ""].join(" ") ||
      undefined,
    opacity: 1 - flou,
  });
  const calque = { sortie, total };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={HOOK}>
        <Video src={staticFile(RUSH.fichier)} trimBefore={RUSH.p1} />
        {derriere.length > 0 && (
          <>
            <AbsoluteFill style={style(true)}>
              <Calque morceaux={derriere} id="derriere" {...calque} />
            </AbsoluteFill>
            <Img
              src={staticFile(
                `da/popup/sujet/${String(Math.min(f, HOOK - 1)).padStart(4, "0")}.png`,
              )}
              style={{
                position: "absolute",
                inset: 0,
                width: 1080,
                height: 1920,
                filter: "drop-shadow(0 0 36px rgba(0,0,0,.45))",
              }}
            />
            {/* Contour permanent (choix de Michaël pour le titre derrière la tête) */}
            <AbsoluteFill style={style(false)}>
              <Calque morceaux={derriere} trait id="contour" {...calque} />
            </AbsoluteFill>
          </>
        )}
        <AbsoluteFill style={style(true)}>
          <Calque morceaux={devant} id="devant" {...calque} />
        </AbsoluteFill>
      </Sequence>
      {/* Début de P2 : la coupe montre la sortie du titre */}
      <Sequence from={HOOK}>
        <Video src={staticFile(RUSH.fichier)} trimBefore={RUSH.p2} />
      </Sequence>
      <Sons son={son} total={total} />
    </AbsoluteFill>
  );
};
