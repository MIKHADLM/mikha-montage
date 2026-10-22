import "./index.css";
import { Composition } from "remotion";
import { CANEVAS } from "./charte/tokens";
import { BarreRecherche, DUREE_BARRE_RECHERCHE } from "./motion/BarreRecherche";
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
