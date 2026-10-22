// Motion design « barre de recherche » (demandé le 2026-09-29) : asset à fond transparent, design
// inspiré du Liquid Glass. Une goutte de verre apparaît avec la loupe, s'étire en capsule, puis
// « mehomies.com » est tapé lettre par lettre ; le curseur clignote, on valide (la capsule
// s'enfonce et rebondit). Plan : motion_design/barre_recherche/PLAN.md.
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PolicesChargees } from "../charte/polices";
import {
  BARRE_RECHERCHE as B,
  CANEVAS,
  COULEURS,
  POLICES,
  VERRE_LIQUIDE,
} from "../charte/tokens";
import { VerreLiquide } from "../charte/VerreLiquide";

const TEXTE = "mehomies.com";

// Temps en images à 30 i/s (propositions de la v01)
const T = { goutte: 0, etirement: 6, micro: 14, frappe: 26, validation: 84 };
// Images entre deux lettres : frappe un peu irrégulière, courte hésitation avant le point
const INTERVALLES = [3, 2, 3, 3, 2, 3, 3, 5, 3, 2, 3];
const LETTRES = [...TEXTE].map(
  (_, i) => T.frappe + INTERVALLES.slice(0, i).reduce((a, b) => a + b, 0),
);
const FIN_FRAPPE = LETTRES[LETTRES.length - 1];
export const DUREE_BARRE_RECHERCHE = 114;

const borne = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Loupe: React.FC = () => (
  <svg width={B.icone} height={B.icone} viewBox="0 0 44 44">
    <circle
      cx="19"
      cy="19"
      r="13"
      fill="none"
      stroke={VERRE_LIQUIDE.icones}
      strokeWidth="5.5"
    />
    <line
      x1="29"
      y1="29"
      x2="40"
      y2="40"
      stroke={VERRE_LIQUIDE.icones}
      strokeWidth="5.5"
      strokeLinecap="round"
    />
  </svg>
);

const Micro: React.FC = () => (
  <svg width={B.icone} height={B.icone} viewBox="0 0 44 44">
    <rect
      x="15"
      y="3"
      width="14"
      height="24"
      rx="7"
      fill={VERRE_LIQUIDE.icones}
    />
    <path
      d="M9 21 a13 13 0 0 0 26 0"
      fill="none"
      stroke={VERRE_LIQUIDE.icones}
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="22"
      y1="34"
      x2="22"
      y2="41"
      stroke={VERRE_LIQUIDE.icones}
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const BarreRecherche: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Goutte qui apparaît avec un petit rebond, puis s'étire en capsule ; pendant l'étirement la
  // capsule s'écrase un peu, comme un liquide
  const goutte = spring({
    frame: frame - T.goutte,
    fps,
    config: { damping: 11, stiffness: 190, mass: 0.7 },
  });
  const etire = spring({
    frame: frame - T.etirement,
    fps,
    config: { damping: 13, stiffness: 110, mass: 0.9 },
  });
  const largeur = B.hauteur + (B.largeur - B.hauteur) * etire;
  const hauteur =
    B.hauteur *
    (1 -
      0.1 * Math.sin(Math.PI * Math.min(Math.max(etire, 0), 1)) -
      0.5 * Math.max(etire - 1, 0));

  // Validation : la capsule s'enfonce, s'éclaircit, puis rebondit
  const enfonce = interpolate(
    frame,
    [T.validation, T.validation + 4],
    [0, 1],
    borne,
  );
  const relache = spring({
    frame: frame - T.validation - 4,
    fps,
    config: { damping: 9, stiffness: 170 },
  });
  const appui = frame < T.validation + 4 ? enfonce : 1 - relache;

  const reflet = interpolate(
    frame,
    [T.etirement, T.etirement + 30],
    [0.15, 0.8],
    {
      ...borne,
      easing: Easing.inOut(Easing.cubic),
    },
  );

  const tapees = LETTRES.filter((f) => frame >= f).length;
  const allume = (depuis: number) => Math.floor((frame - depuis) / 8) % 2 === 0;
  const curseur =
    frame >= T.micro &&
    frame < T.validation &&
    (frame < T.frappe
      ? allume(T.micro)
      : frame <= FIN_FRAPPE
        ? true
        : allume(FIN_FRAPPE));

  return (
    <PolicesChargees>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: CANEVAS.largeur / 2,
            top: B.centreY,
            scale: goutte * (1 - 0.04 * appui),
          }}
        >
          <VerreLiquide
            largeur={largeur}
            hauteur={hauteur}
            reflet={reflet}
            eclat={Math.max(appui, 0)}
          >
            <div
              style={{
                position: "absolute",
                left: B.marge,
                top: hauteur / 2 - B.icone / 2,
                opacity: interpolate(frame, [2, 8], [0, 1], borne),
              }}
            >
              <Loupe />
            </div>
            <div
              style={{
                position: "absolute",
                left: B.marge + B.icone + 22,
                top: 0,
                height: hauteur,
                display: "flex",
                alignItems: "center",
                fontFamily: POLICES.heavy,
                fontSize: B.tailleTexte,
                color: COULEURS.noir,
                whiteSpace: "pre",
              }}
            >
              {TEXTE.slice(0, tapees)}
              <span
                style={{
                  display: "inline-block",
                  width: 5,
                  height: B.tailleTexte * 1.05,
                  marginLeft: 4,
                  borderRadius: 3,
                  backgroundColor: B.curseur,
                  opacity: curseur ? 1 : 0,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                right: B.marge,
                top: hauteur / 2 - B.icone / 2,
                opacity: interpolate(
                  frame,
                  [T.micro, T.micro + 6],
                  [0, 1],
                  borne,
                ),
              }}
            >
              <Micro />
            </div>
          </VerreLiquide>
        </div>
      </AbsoluteFill>
    </PolicesChargees>
  );
};
