import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { encre } from "./polices";
import {
  BLANC,
  MOTS_DE_LIAISON,
  OMBRES,
  POLICES_ROUGE,
  SOUS_TITRES_ROUGE as S,
} from "./tokens";

// Un mot placé sur la timeline montée (images), avec son groupe du découpage et sa phrase
export type MotMonte = {
  texte: string;
  debut: number;
  fin: number;
  phrase: string;
  groupe: string;
};
export type GroupeLong = { debut: number; fin: number; mots: MotMonte[] };
// Rendu à une image : montée mot par mot (face cam), apparition sèche (fond rouge), ou rien
export type ModeSousTitres = "facecam" | "rouge" | null;

const largeur = (ms: MotMonte[]) =>
  encre(ms.map((m) => m.texte).join(" "), POLICES_ROUGE.texte, S.taille).avance;

// Groupes longs (planche soustitres.html) : on fusionne les groupes du découpage (qui gardent déjà
// ensemble « le 7 novembre », « Condition Publique »…) en lignes qui tiennent dans la largeur. Une fin
// de phrase ou une pause coupe toujours ; entre deux, les lignes ont des longueurs proches (vide au
// bout des lignes minimisé au carré) et aucune ne finit sur un petit mot de liaison.
// `coupures` : images où une ligne doit aussi couper (fin d'un texte en escalier ou du hook), pour
// qu'une ligne ne mélange pas des mots déjà montés à l'écran et des mots qui suivent (vidéo 5).
export const grouperLong = (
  mots: MotMonte[],
  fps: number,
  duree: number,
  coupures: number[] = [],
) => {
  const groupes: MotMonte[][] = [];
  for (const m of mots) {
    const g = groupes[groupes.length - 1];
    if (g && g[0].groupe === m.groupe) g.push(m);
    else groupes.push([m]);
  }
  const morceaux: MotMonte[][][] = [];
  for (const g of groupes) {
    const cour = morceaux[morceaux.length - 1];
    const prec = cour?.[cour.length - 1].at(-1);
    if (
      !prec ||
      prec.phrase !== g[0].phrase ||
      g[0].debut - prec.fin > S.pauseS * fps ||
      coupures.some((c) => prec.fin <= c + 1 && g[0].debut >= c - 1)
    ) {
      morceaux.push([g]);
    } else cour.push(g);
  }
  const lignes: MotMonte[][] = [];
  for (const gs of morceaux) {
    const cout = [0];
    const depuis = [0];
    for (let i = 1; i <= gs.length; i++) {
      cout[i] = Infinity;
      for (let k = i - 1; k >= 0; k--) {
        const ms = gs.slice(k, i).flat();
        const w = largeur(ms);
        if (w > S.largeurMax && i - k > 1) break;
        const finLiaison =
          i < gs.length &&
          MOTS_DE_LIAISON.has(ms[ms.length - 1].texte.toLowerCase());
        const c = cout[k] + (S.largeurMax - w) ** 2 + (finLiaison ? 1e7 : 0);
        if (c < cout[i]) {
          cout[i] = c;
          depuis[i] = k;
        }
      }
    }
    const l: MotMonte[][] = [];
    for (let i = gs.length; i > 0; i = depuis[i])
      l.unshift(gs.slice(depuis[i], i).flat());
    lignes.push(...l);
  }
  // Chaque groupe reste jusqu'au suivant, `maintien` images au plus après son dernier mot
  return lignes.map((ms, i): GroupeLong => {
    const suivant = i + 1 < lignes.length ? lignes[i + 1][0].debut : duree;
    return {
      debut: ms[0].debut,
      fin: Math.min(duree, suivant, ms[ms.length - 1].fin + S.maintien),
      mots: ms,
    };
  });
};

// Sous-titres de la DA rouge : Thunder blanc avec ombre, une ligne centrée dont le bas est à 1340 px
// (une ligne trop large est réduite). La place de chaque mot est réservée dès le début du groupe ; le
// mot apparaît quand il est dit, en montant d'une ligne fixe sous les jambages sur le face cam, d'un
// coup sur le fond rouge.
export const SousTitresRouge: React.FC<{
  groupes: GroupeLong[];
  mode: (frame: number) => ModeSousTitres;
}> = ({ groupes, mode }) => {
  const f = useCurrentFrame();
  const g = groupes.find((x) => f >= x.debut && f < x.fin);
  const m = mode(f);
  const disposition = useMemo(() => {
    if (!g) return null;
    const P = POLICES_ROUGE.texte;
    const texte = g.mots.map((x) => x.texte).join(" ");
    const taille = Math.min(
      S.taille,
      (S.taille * S.largeurMax) / encre(texte, P, S.taille).avance,
    );
    const total = encre(texte, P, taille).avance;
    const jambages = encre("gjpqy", P, taille).bas;
    let prefixe = "";
    const mots = g.mots.map((x) => {
      const pos = encre(prefixe, P, taille).avance;
      prefixe += `${x.texte} `;
      return { ...x, x: S.centre - total / 2 + pos };
    });
    return { taille, base: S.bas - jambages, jambages, mots };
  }, [g]);
  if (!g || !m || !disposition) return null;
  const { taille, base, jambages } = disposition;

  return (
    <AbsoluteFill style={{ filter: OMBRES.sousTitres }}>
      <svg width={1080} height={1920}>
        <defs>
          <clipPath id="sous-titres-ligne">
            <rect
              x={0}
              y={base - 1.2 * taille}
              width={1080}
              height={1.2 * taille + jambages + 2}
            />
          </clipPath>
        </defs>
        <g clipPath="url(#sous-titres-ligne)">
          {disposition.mots
            .filter((x) => f >= x.debut)
            .map((x, i) => {
              const p =
                m === "rouge" ? 1 : Math.min(1, (f - x.debut) / S.montee);
              const e = 1 - (1 - p) ** 4;
              return (
                <text
                  key={i}
                  x={x.x}
                  y={base}
                  transform={`translate(0 ${(1 - e) * S.descente * taille})`}
                  fontFamily={POLICES_ROUGE.texte}
                  fontSize={taille}
                  fill={BLANC}
                  style={{ whiteSpace: "pre" }}
                >
                  {x.texte}
                </text>
              );
            })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
