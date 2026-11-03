// Recherche de DA (2026-11-03) : entrée et sortie d'une séquence sur le fond rouge grainé. Test sur
// la vidéo 2 : fin de P1 en face cam, P2 (« Ça va se passer le 7 novembre… ») sur le fond rouge avec
// l'affiche et son étiquette, puis début de P3 en face cam. Les transitions commencent sur le
// changement de phrase. Sous-titres absents : le test porte seulement sur le passage.
//   npx remotion render DA-EntreeFondRouge "../DA MIKHA/tests_video/entree_pose.mp4" --props='{"transition":"pose"}'
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AfficheEtiquette, FondRouge } from "./FondRougeGrain";

// coupe : coupe sèche (charte actuelle) ; pose : coupe sèche, l'affiche se pose ; volet : le fond
// rouge monte comme une carte et redescend ; pousse : le face cam est poussé vers le haut par le rouge
export type TransitionRouge = "coupe" | "pose" | "volet" | "pousse";

const RUSH = "v2/rush.mp4";
// decoupage.json : P1 (426, 86 images), P2 (1588, 124), P3 (2000, 96)
const AVANT = { source: 426 + 56, duree: 30 }; // la fin de P1
const ROUGE = { source: 1588, duree: 124 }; // P2
const APRES = { source: 2000, duree: 36 }; // le début de P3
const T1 = AVANT.duree; // entrée
const T2 = T1 + ROUGE.duree; // sortie
export const DUREE_ENTREE_FOND_ROUGE = T2 + APRES.duree;

// Durées et courbes (propositions)
const D = { passage: 8, pose: 8 };
const ENTREE = Easing.bezier(0.33, 1, 0.68, 1);
const SORTIE = Easing.bezier(0.32, 0, 0.67, 0);

// Sons (CHARTE/04_son/SON.md) : déclencheur 5 images avant la photo, clic 3 images avant la sortie ;
// whoosh cinématique (pic à 0,4 s) pour les passages animés, baissé (proposition)
const SFX = {
  declencheur: "charte/sfx/declencheur.wav",
  clic: "charte/sfx/clic.wav",
  whoosh: "da/sfx/whoosh_cinematic.wav",
};
// Le pic du whoosh tombe au milieu du passage
const WHOOSH = 12 - D.passage / 2;
const Son: React.FC<{ fichier: string; image: number; volume?: number }> = ({
  fichier,
  image,
  volume = 1,
}) => (
  <Sequence from={Math.max(0, image)}>
    <Audio
      src={staticFile(fichier)}
      trimBefore={Math.max(0, -image)}
      volume={volume}
    />
  </Sequence>
);

const Plan: React.FC<{ source: number; duree: number; from: number }> = ({
  source,
  duree,
  from,
}) => (
  <Sequence from={from} durationInFrames={duree}>
    <Video src={staticFile(RUSH)} trimBefore={source} />
  </Sequence>
);

const p = (f: number, debut: number, duree: number, courbe = ENTREE) =>
  interpolate(f, [debut, debut + duree], [0, 1], {
    easing: courbe,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const EntreeFondRouge: React.FC<{ transition: TransitionRouge }> = ({
  transition,
}) => {
  const f = useCurrentFrame();
  const anime = transition === "volet" || transition === "pousse";
  // Fin de la séquence rouge : avec un passage animé, elle déborde de D.passage images sur P3
  const finRouge = anime ? T2 + D.passage : T2;
  const visible = f >= T1 && f < finRouge;

  // Position verticale du rouge (en part de la hauteur) : 1 = sous l'image, 0 = en place
  const entree = anime ? p(f, T1, D.passage) : 1;
  const sortie = anime ? p(f, T2, D.passage, SORTIE) : 0;
  const yRouge = (1 - entree) * 1920 + sortie * 1920;
  // Pousse : le face cam part vers le haut devant le rouge, et revient d'en haut à la sortie
  const yAvant = transition === "pousse" ? -entree * 1920 : 0;
  const yApres = transition === "pousse" ? (sortie - 1) * 1920 : 0;

  // Pose : l'affiche arrive un peu plus grande et se pose
  const pose = transition === "pose" ? p(f, T1, D.pose) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${f < T2 ? yAvant : 0}px)`,
        }}
      >
        <Plan {...AVANT} from={0} />
        {/* P2 tourne dessous : sa voix accompagne l'affiche ; il n'est vu que pendant l'entrée */}
        <Plan {...ROUGE} from={T1} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ transform: `translateY(${f >= T2 ? yApres : 0}px)` }}
      >
        <Plan {...APRES} from={T2} />
      </AbsoluteFill>
      {visible && (
        <AbsoluteFill style={{ transform: `translateY(${yRouge}px)` }}>
          <FondRouge cadence={0} />
          <AfficheEtiquette
            style={{
              opacity: pose,
              transform: `scale(${1.06 - 0.06 * pose})`,
            }}
          />
        </AbsoluteFill>
      )}
      {anime ? (
        <>
          <Son fichier={SFX.whoosh} image={T1 - WHOOSH} volume={0.35} />
          <Son fichier={SFX.whoosh} image={T2 - WHOOSH} volume={0.35} />
        </>
      ) : (
        <>
          <Son fichier={SFX.declencheur} image={T1 - 5} />
          <Son fichier={SFX.clic} image={T2 - 3} />
        </>
      )}
    </AbsoluteFill>
  );
};
