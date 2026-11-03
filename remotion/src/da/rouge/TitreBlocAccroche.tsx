import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { encre } from "./polices";
import { BLANC, OMBRES, POLICES_ROUGE, ROUGE, TITRE_BLOC } from "./tokens";

// Le titre découpé par rôle : petits mots empilés (blancs), mot clé et dernier mot (rouges)
export type TitreBloc = { avant: string[]; cle: string; apres?: string };

type Morceau = {
  t: string;
  taille: number;
  x: number;
  base: number;
  haut: number;
  rouge: boolean;
  rang: number;
};

const P = POLICES_ROUGE.titre;
const tailleLargeur = (t: string, l: number) => (100 * l) / encre(t, P, 100).l;
const tailleCap = (t: string, h: number) => (100 * h) / encre(t, P, 100).haut;
const morceau = (
  t: string,
  taille: number,
  x: number,
  base: number,
  rouge: boolean,
) => {
  const e = encre(t, P, taille);
  return { t, taille, x: x + e.g, base, haut: e.haut, rouge, rang: 0 };
};

// Composition 06 sur une largeur W : la pile de petits mots a exactement la hauteur du mot clé (corps
// cherché par dichotomie pour que pile + mot clé remplissent W), le dernier mot remplit W dessous
const bloc = (T: TitreBloc, W: number) => {
  const ecartX = T.avant.length ? TITRE_BLOC.ecartX : 0;
  let lo = 20;
  let hi = 900;
  let r = { tc: 0, cc: 0, cp: 0, ev: 0, tp: [] as number[], lp: 0 };
  for (let i = 0; i < 40; i++) {
    const tc = (lo + hi) / 2;
    const cc = encre(T.cle, P, tc).haut;
    const n = T.avant.length;
    const ev = cc * TITRE_BLOC.ecartPile;
    const cp = n ? (cc - ev * (n - 1)) / n : 0;
    const tp = T.avant.map((t) => tailleCap(t, cp));
    const lp = n ? Math.max(...T.avant.map((t, k) => encre(t, P, tp[k]).l)) : 0;
    r = { tc, cc, cp, ev, tp, lp };
    if (lp + ecartX + encre(T.cle, P, tc).l > W) hi = tc;
    else lo = tc;
  }
  const m: Morceau[] = T.avant.map((t, k) =>
    morceau(
      t,
      r.tp[k],
      r.lp - encre(t, P, r.tp[k]).l,
      r.cp + k * (r.cp + r.ev),
      false,
    ),
  );
  m.push(morceau(T.cle, r.tc, r.lp + ecartX, r.cc, true));
  let h = r.cc;
  if (T.apres) {
    const tg = tailleLargeur(T.apres, W);
    const cg = encre(T.apres, P, tg).haut;
    h += Math.min(r.cc, cg) * TITRE_BLOC.ecartLignes + cg;
    m.push(morceau(T.apres, tg, 0, h, true));
  }
  return { h, m };
};

// Placé en haut de la zone sûre ; un bloc trop haut est réduit et recentré. Ordre de lecture : de haut
// en bas, puis de gauche à droite
export const placerTitre = (T: TitreBloc): Morceau[] => {
  let { h, m } = bloc(T, TITRE_BLOC.largeur);
  let x0 = TITRE_BLOC.gauche;
  if (h > TITRE_BLOC.hauteurMax) {
    const W = (TITRE_BLOC.largeur * TITRE_BLOC.hauteurMax) / h;
    ({ h, m } = bloc(T, W));
    x0 += (TITRE_BLOC.largeur - W) / 2;
  }
  return m
    .map((x) => ({ ...x, x: x.x + x0, base: x.base + TITRE_BLOC.haut }))
    .sort((a, b) => a.base - b.base || a.x - b.x)
    .map((x, rang) => ({ ...x, rang }));
};

const MONTEE = Easing.bezier(0.16, 1, 0.3, 1);
const A = TITRE_BLOC.apparition;

// Un calque plein cadre ; chaque morceau sort d'une découpe fixe posée sous sa ligne de base
const Calque: React.FC<{
  morceaux: Morceau[];
  id: string;
  trait?: boolean;
}> = ({ morceaux, id, trait }) => {
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
        const depart = A.debut + x.rang * A.intervalle;
        const p = interpolate(f, [depart, depart + A.duree], [0, 1], {
          easing: MONTEE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const couleur = x.rouge ? ROUGE : BLANC;
        return (
          <g key={x.rang} clipPath={`url(#${id}-${x.rang})`}>
            <text
              x={x.x}
              y={x.base}
              transform={`translate(0 ${(1 - p) * (x.haut + 16)})`}
              fontFamily={POLICES_ROUGE.titre}
              fontSize={x.taille}
              fill={trait ? "none" : couleur}
              stroke={trait ? couleur : undefined}
              strokeWidth={trait ? TITRE_BLOC.contour : undefined}
            >
              {x.t}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Titre d'accroche de la DA rouge, posé dans une Sequence de la durée du hook. sujet : dossier des
// images détourées du hook (public/<video>/sujet/NNNN.png, NNNN = image depuis le début du hook) ;
// null : tout le titre passe devant (repli quand le détourage n'est pas possible)
export const TitreBlocAccroche: React.FC<{
  titre: TitreBloc;
  sujet: string | null;
  duree: number;
}> = ({ titre, sujet, duree }) => {
  const f = useCurrentFrame();
  const morceaux = useMemo(() => placerTitre(titre), [titre]);
  const derriere = sujet ? morceaux.filter((x) => x.rouge) : [];
  const devant = sujet ? morceaux.filter((x) => !x.rouge) : morceaux;
  return (
    <AbsoluteFill>
      {sujet && (
        <>
          <AbsoluteFill style={{ filter: OMBRES.titre }}>
            <Calque morceaux={derriere} id="titre-derriere" />
          </AbsoluteFill>
          <Img
            src={staticFile(
              `${sujet}/${String(Math.min(f, duree - 1)).padStart(4, "0")}.png`,
            )}
            style={{
              position: "absolute",
              inset: 0,
              width: 1080,
              height: 1920,
              objectFit: "cover",
              filter: OMBRES.sujet,
            }}
          />
          {/* Contour permanent : le mot rouge reste lisible par-dessus la tête */}
          <Calque morceaux={derriere} id="titre-contour" trait />
        </>
      )}
      <AbsoluteFill style={{ filter: OMBRES.titre }}>
        <Calque morceaux={devant} id="titre-devant" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
