import "./index.css";
import { Composition } from "remotion";
import { CANEVAS } from "./charte/tokens";
import { BarreRecherche, DUREE_BARRE_RECHERCHE } from "./motion/BarreRecherche";
import {
  DUREE_ILLUSTRATION,
  FPS_ILLUSTRATION,
  TexteIllustration,
} from "./da/TexteIllustration";
import { DUREE_ENTREE_FOND_ROUGE, EntreeFondRouge } from "./da/EntreeFondRouge";
import { DUREE_FIN, DUREES_FIN, FinVideo } from "./da/FinVideo";
import { DUREE_FOND_ROUGE_GRAIN, FondRougeGrain } from "./da/FondRougeGrain";
import { DUREE_TITRE_BLOC, TitreBloc } from "./da/TitreBloc";
import { DUREE_TITRE_DERRIERE, TitreDerriere } from "./da/TitreDerriere";
import { DUREE_SITE_MOBILE, SiteMobile } from "./motion/SiteMobile";
import { calculerMontage, MontageFacecam } from "./montage/MontageFacecam";
import { DUREE_V1, FinPrecommande } from "./videos/v1/FinPrecommande";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Montage de toutes les vidéos face cam (plan.json de chaque vidéo) :
          npx remotion render Montage <sortie>.mp4 --props='{"video":"v2"}' */}
      <Composition
        id="Montage"
        component={MontageFacecam}
        calculateMetadata={calculerMontage}
        defaultProps={{ video: "v1" }}
        durationInFrames={1}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Vidéo 1, montée à la main dans l'ancienne direction (v01, v02) */}
      <Composition
        id="V1-FinPrecommande"
        component={FinPrecommande}
        durationInFrames={DUREE_V1}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Recherche de DA : titre derrière le sujet (DA MIKHA/planche_titres) */}
      <Composition
        id="DA-TitreDerriere"
        component={TitreDerriere}
        defaultProps={{
          apparition: "montee" as const,
          contour: "toujours" as const, // choix de Michaël (2026-11-03)
        }}
        durationInFrames={DUREE_TITRE_DERRIERE}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Recherche de DA : titre en bloc (planche titre_bloc.html, compositions 05 et 06) */}
      <Composition
        id="DA-TitreBloc"
        component={TitreBloc}
        defaultProps={{
          compo: "empiles" as const, // choix de Michaël (2026-11-03)
          son: "riser" as const,
          sortie: "coupe" as const,
        }}
        durationInFrames={DUREE_TITRE_BLOC}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Recherche de DA : fond rouge grainé (cadence du grain : 0 = fixe) */}
      <Composition
        id="DA-FondRougeGrain"
        component={FondRougeGrain}
        defaultProps={{ cadence: 0 }} // grain fixe, choix de Michaël (2026-11-03)
        durationInFrames={DUREE_FOND_ROUGE_GRAIN}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Recherche de DA : entrée et sortie d'une séquence sur le fond rouge */}
      <Composition
        id="DA-EntreeFondRouge"
        component={EntreeFondRouge}
        defaultProps={{ transition: "pose" as const }} // choix de Michaël (2026-11-03)
        durationInFrames={DUREE_ENTREE_FOND_ROUGE}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Recherche de DA : fin de vidéo (la durée dépend de la fin choisie) */}
      <Composition
        id="DA-FinVideo"
        component={FinVideo}
        defaultProps={{ fin: "rien" as const }} // choix de Michaël (2026-11-03)
        calculateMetadata={({ props }) => ({
          durationInFrames: DUREES_FIN[props.fin],
        })}
        durationInFrames={DUREE_FIN}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Recherche de DA : texte en escalier sur une image d'illustration */}
      <Composition
        id="DA-TexteIllustration"
        component={TexteIllustration}
        durationInFrames={DUREE_ILLUSTRATION}
        fps={FPS_ILLUSTRATION}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      {/* Assets à fond transparent : rendus en ProRes 4444 (voir README) */}
      <Composition
        id="Motion-SiteMobile"
        component={SiteMobile}
        durationInFrames={DUREE_SITE_MOBILE}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
      <Composition
        id="Motion-BarreRecherche"
        component={BarreRecherche}
        durationInFrames={DUREE_BARRE_RECHERCHE}
        fps={CANEVAS.fps}
        width={CANEVAS.largeur}
        height={CANEVAS.hauteur}
      />
    </>
  );
};
