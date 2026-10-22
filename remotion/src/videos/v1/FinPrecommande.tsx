// Vidéo 1 : fin des précommandes (a_monter/1). Plan : a_monter/1/PLAN_MONTAGE.md, validé le 2026-09-29.
// Les temps viennent de la transcription : chaque plan est calé sur un mot prononcé.
// v02 (retours sur la v01) : musique après le riser, un écran reste affiché jusqu'à la fin du
// mot qui le clôt, composition « chaque petit geste » prolongée pendant « pour nous ».
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Cadrage, type PlanCadrage } from "./ancien/Cadrage";
import { CompositionTexte, type LigneComposition } from "./ancien/CompositionTexte";
import { Fond1, PhotoCadre, ProduitDetoure } from "./ancien/Fond1";
import { PolicesChargees } from "./ancien/polices";
import { SousTitres, type ZoneSousTitres } from "./ancien/SousTitres";
import { CADRAGE, CANEVAS, MUSIQUE, SFX } from "./ancien/tokens";
import { creerMontage } from "./ancien/montage";
import decoupage from "./donnees/decoupage.json";
import motsMontage from "./donnees/mots_montage.json";

const M = creerMontage(decoupage, motsMontage.mots);
const { mot, debutSegment, finSegment } = M;
export const DUREE_V1 = M.duree;

const RUSH = "v1/rush.mp4";
const image = (nom: string) => `v1/images/${nom}.png`;
const borne = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cadrage du face cam : large (1,00) et serré (1,15) alternent à chaque coupe
const PLANS: PlanCadrage[] = [
  { debut: 0, fin: finSegment(1), de: CADRAGE.large, a: 1.08 }, // accroche
  { debut: mot("P2", "ouvertes").fin, fin: finSegment(2), de: CADRAGE.serre, a: CADRAGE.serre },
  { debut: debutSegment(3), fin: finSegment(3), de: CADRAGE.large, a: 1.05 }, // avec BAG
  { debut: debutSegment(4), fin: finSegment(4), de: CADRAGE.serre, a: CADRAGE.serre },
  { debut: debutSegment(5), fin: finSegment(5), de: CADRAGE.large, a: CADRAGE.large },
  { debut: debutSegment(6), fin: mot("P5", "chaque").debut, de: CADRAGE.serre, a: CADRAGE.serre },
  { debut: mot("P5", "nous").fin, fin: finSegment(6), de: 1.05, a: CADRAGE.large },
  { debut: debutSegment(7), fin: finSegment(7), de: CADRAGE.serre, a: 1.19 }, // merci à toi
  { debut: debutSegment(8), fin: mot("P7", "jusqu'à").debut, de: CADRAGE.large, a: CADRAGE.large },
  { debut: debutSegment(10), fin: mot("P8", "que").debut, de: CADRAGE.serre, a: CADRAGE.serre },
  { debut: debutSegment(11), fin: mot("P8", "le", 1).debut, de: CADRAGE.large, a: CADRAGE.large },
  { debut: mot("P9", "pour").debut, fin: mot("P9", "du").debut, de: CADRAGE.serre, a: CADRAGE.serre },
  { debut: debutSegment(13), fin: finSegment(13), de: CADRAGE.large, a: 1.05 },
  { debut: debutSegment(14), fin: finSegment(14), de: CADRAGE.serre, a: 1.19 }, // let's go
];

type Ecran = { nom: string; debut: number; fin: number } & (
  | { type: "photo"; image: string }
  | { type: "detoures"; images: string[] }
  | { type: "composition"; lignes: LigneComposition[] }
);

const ligne = (apparition: number, ...morceaux: LigneComposition["morceaux"]) => ({
  apparition,
  morceaux,
});
const titre = (texte: string) => ({ texte, police: "titre" as const });
const accent = (texte: string) => ({ texte, police: "accent" as const });

// Écrans sur fond_1 : images (avec le déclencheur) et compositions de texte
const ECRANS: Ecran[] = [
  {
    nom: "Gros plan de l'impression",
    type: "photo",
    debut: debutSegment(2),
    fin: mot("P2", "ouvertes").fin, // jusqu'à la fin du mot « ouvertes »
    image: image("closeup-v1-ecd988ab"),
  },
  {
    nom: "Composition : chaque petit geste",
    type: "composition",
    debut: mot("P5", "chaque").debut,
    fin: mot("P5", "nous").fin, // reste affichée pendant « pour nous », sans l'écrire
    lignes: [
      ligne(mot("P5", "chaque").debut, titre("CHAQUE PETIT")),
      ligne(mot("P5", "geste").debut, accent("GESTE")),
      ligne(mot("P5", "c'est").debut, titre("C'EST QUELQUE")),
      ligne(mot("P5", "chose").debut, titre("CHOSE DE TRÈS")),
      ligne(mot("P5", "concret").debut, accent("CONCRET")),
    ],
  },
  {
    nom: "Composition : jusqu'à ce soir minuit",
    type: "composition",
    debut: mot("P7", "jusqu'à").debut,
    fin: finSegment(9),
    lignes: [
      ligne(mot("P7", "jusqu'à").debut, titre("JUSQU'À CE SOIR")),
      ligne(mot("P7", "minuit").debut, accent("MINUIT")),
      ligne(mot("P7", "sur").debut, titre("SUR LE SITE")),
      ligne(mot("P7", "mehomies.com").debut, accent("MEHOMIES.COM")),
    ],
  },
  {
    nom: "Les six Boxy",
    type: "detoures",
    debut: mot("P8", "que").debut,
    fin: finSegment(10),
    images: ["bel", "bra", "fra", "swi", "uk", "us"].map((pays) => image(`mehomies-tee-${pays}-v2`)),
  },
  {
    nom: "Boxy porté",
    type: "photo",
    debut: mot("P8", "le", 1).debut,
    fin: mot("P8", "le", 2).debut,
    image: image("mehomies-boxy-t"),
  },
  {
    nom: "Baby Tee porté",
    type: "photo",
    debut: mot("P8", "le", 2).debut,
    fin: mot("P9", "pour").debut,
    image: image("post-32"),
  },
  {
    nom: "Composition : du XS au XXL",
    type: "composition",
    debut: mot("P9", "du").debut,
    fin: finSegment(12),
    lignes: [
      ligne(mot("P9", "du").debut, titre("DU "), accent("XS")),
      ligne(mot("P9", "au").debut, titre("AU "), accent("XXL")),
    ],
  },
];

const zoneSousTitres = (frame: number): ZoneSousTitres => {
  const ecran = ECRANS.find((e) => frame >= e.debut && frame < e.fin);
  if (!ecran) return "faceCam";
  return ecran.type === "composition" ? "masque" : "surFond";
};

// Les six détourés défilent à intervalle régulier sur la durée de l'écran
const Defilement: React.FC<{ images: string[]; duree: number }> = ({ images, duree }) => {
  const frame = useCurrentFrame();
  const visible = Math.min(images.length - 1, Math.floor(frame / (duree / images.length)));
  return (
    <>
      {images.map((src, i) => (
        <div key={src} style={{ opacity: i === visible ? 1 : 0 }}>
          <ProduitDetoure src={src} />
        </div>
      ))}
    </>
  );
};

const FIN_ACCROCHE = mot("P1", "Mehomies").fin; // la fin du riser tombe ici
const DEBUT_RISER = Math.round(SFX.riser.dureeS * M.fps) - FIN_ACCROCHE;
// Pas de musique pendant le riser : elle démarre sur la transition qui le suit
const DEBUT_MUSIQUE = debutSegment(2);
const DUREE_MUSIQUE = M.duree - DEBUT_MUSIQUE;

export const FinPrecommande: React.FC = () => (
  <PolicesChargees>
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Cadrage plans={PLANS}>
        {M.segments.map((s) => (
          <Video
            key={s.id}
            name={`Rush ${s.id} (${s.phrase})`}
            src={staticFile(RUSH)}
            from={s.montageDebutFrame}
            durationInFrames={s.dureeFrames}
            trimBefore={s.sourceDebutFrame}
            volume={(f) =>
              interpolate(f, [0, 2, s.dureeFrames - 2, s.dureeFrames], [0, 1, 1, 0], borne)
            }
            style={{ position: "absolute", width: CANEVAS.largeur, height: CANEVAS.hauteur }}
          />
        ))}
      </Cadrage>

      {ECRANS.map((e) => (
        <Sequence key={e.nom} name={e.nom} from={e.debut} durationInFrames={e.fin - e.debut}>
          <Fond1>
            {e.type === "photo" && <PhotoCadre src={e.image} />}
            {e.type === "detoures" && <Defilement images={e.images} duree={e.fin - e.debut} />}
            {e.type === "composition" && (
              <CompositionTexte
                lignes={e.lignes.map((l) => ({ ...l, apparition: l.apparition - e.debut }))}
              />
            )}
          </Fond1>
        </Sequence>
      ))}

      <SousTitres groupes={M.groupes} zone={zoneSousTitres} />

      <Audio
        name="Riser (accroche)"
        src={staticFile(SFX.riser.fichier)}
        trimBefore={DEBUT_RISER}
        durationInFrames={FIN_ACCROCHE}
        volume={(f) => interpolate(f, [0, 8], [0, 1], borne)}
      />
      <Audio
        name="Musique (à partir de 1:16 de la piste)"
        src={staticFile("v1/musique.wav")}
        from={DEBUT_MUSIQUE}
        durationInFrames={DUREE_MUSIQUE}
        volume={(f) =>
          interpolate(
            f,
            [0, MUSIQUE.fonduEntree, DUREE_MUSIQUE - MUSIQUE.fonduSortie, DUREE_MUSIQUE],
            [0, 1, 1, 0],
            borne,
          )
        }
      />
      {ECRANS.filter((e) => e.type !== "composition").map((e) => (
        <Audio
          key={e.nom}
          name={`Déclencheur : ${e.nom}`}
          src={staticFile(SFX.declencheur.fichier)}
          from={e.debut}
        />
      ))}
    </AbsoluteFill>
  </PolicesChargees>
);
