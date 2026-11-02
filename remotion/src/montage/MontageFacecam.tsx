// Montage d'une vidéo face cam dans le style de la charte (direction artistique du 2026-09-30),
// entièrement piloté par les données : aucune ligne de code à écrire par vidéo.
//   npx remotion render Montage <sortie>.mp4 --props='{"video":"v2"}'
// Lit public/<video>/decoupage.json, mots_montage.json et plan.json (copiés par
// scripts/preparer_medias.py) ; le rush, la musique et les images sont aussi dans public/<video>/.
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  type CalculateMetadataFunction,
  Freeze,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { Cadrage } from "../charte/Cadrage";
import {
  Etiquette,
  FondBlanc,
  ImageLarge,
  Partenaire,
  PhotoArrondie,
} from "../charte/Illustrations";
import { PolicesChargees } from "../charte/polices";
import { SousTitres, type StyleSousTitres } from "../charte/SousTitres";
import { TitreAccroche } from "../charte/TitreAccroche";
import {
  COULEURS,
  ETIQUETTE_LARGE,
  MUSIQUE,
  PLACEMENT_SFX,
  SFX,
  SITE,
  SOUS_TITRES,
} from "../charte/tokens";
import {
  BarreRecherche,
  DUREE_BARRE_RECHERCHE,
} from "../motion/BarreRecherche";
import { BANQUE_MOTION } from "../motion/registre";
import { DUREE_SITE_MOBILE, SiteMobile } from "../motion/SiteMobile";
import { creerMontage, type DonneesMontage, type Montage } from "./donnees";

export type PropsMontage = { video: string; donnees?: DonneesMontage };

export const calculerMontage: CalculateMetadataFunction<PropsMontage> = async ({
  props,
}) => {
  const lire = (fichier: string) =>
    fetch(staticFile(`${props.video}/${fichier}`)).then((r) => r.json());
  const [decoupage, mots, plan] = await Promise.all([
    lire("decoupage.json"),
    lire("mots_montage.json"),
    lire("plan.json"),
  ]);
  return {
    durationInFrames: decoupage.dureeMontageFrames,
    props: { ...props, donnees: { decoupage, mots, plan } },
  };
};

const borne = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Un asset de la banque joué jusqu'au bout, puis figé sur sa dernière image
const Figer: React.FC<{ derniere: number; children: React.ReactNode }> = ({
  derniere,
  children,
}) => (
  <Freeze frame={derniere} active={(f) => f > derniere}>
    {children}
  </Freeze>
);

// Bruitages placés d'après les séquences (04_son/SON.md) : clic avant l'entrée d'une séquence
// partenaire et avant chaque sortie du fond blanc, déclencheur avant chaque photo
const bruitages = (M: Montage) => {
  const clic = PLACEMENT_SFX.clic + Math.round(SFX.clic.attaqueS * M.fps);
  const declencheur =
    PLACEMENT_SFX.declencheur + Math.round(SFX.declencheur.attaqueS * M.fps);
  const sons: {
    nom: string;
    fichier: string;
    image: number;
    volume?: number;
  }[] = [];
  for (const s of M.sequences) {
    if (s.type === "partenaire") {
      sons.push({
        nom: "Clic : entrée partenaire",
        fichier: SFX.clic.fichier,
        image: s.debut - clic,
      });
    }
    const gainDb = s.type === "photo" ? (s.declencheurDb ?? 0) : 0;
    s.debutsPhotos.forEach((debut, i) => {
      sons.push({
        nom: `Déclencheur : photo ${i + 1}`,
        fichier: SFX.declencheur.fichier,
        image: debut - declencheur,
        volume: 10 ** (gainDb / 20),
      });
    });
    const surFondBlanc = s.type !== "motion" || s.fond !== "facecam";
    if (s.fin < M.duree && surFondBlanc) {
      sons.push({
        nom: `Clic : sortie ${s.type}`,
        fichier: SFX.clic.fichier,
        image: s.fin - clic,
      });
    }
  }
  return sons.map((s) => ({ ...s, image: Math.max(0, s.image) }));
};

export const MontageFacecam: React.FC<PropsMontage> = ({ video, donnees }) => {
  if (!donnees) {
    throw new Error(
      "Données absentes : lancer le rendu avec calculateMetadata (composition « Montage »)",
    );
  }
  const M = creerMontage(donnees);
  const { accroche } = M;

  // Sous-titres : masqués pendant le hook, les séquences produit et les passages demandés ;
  // noirs sur fond blanc, plus bas dans la séquence du site
  const style = (f: number): StyleSousTitres => {
    if (accroche && f >= accroche.debut && f < accroche.fin) return null;
    if (M.masques.some((m) => f >= m.debut && f < m.fin)) return null;
    const seq = M.sequences.find((s) => f >= s.debut && f < s.fin);
    if (!seq || (seq.type === "motion" && seq.fond === "facecam")) {
      return {
        couleur: COULEURS.blanc,
        ligneDeBase: SOUS_TITRES.ligneDeBase,
        ombre: donnees.plan.sousTitres?.ombreSurFacecam,
      };
    }
    if (seq.type === "produit") return null;
    return {
      couleur: COULEURS.noir,
      ligneDeBase:
        seq.type === "site"
          ? SOUS_TITRES.ligneDeBaseSite
          : SOUS_TITRES.ligneDeBase,
    };
  };

  const riser = Math.round(SFX.riser.dureeS * M.fps);
  const dureeMusique = accroche ? M.duree - accroche.fin : 0;

  return (
    <PolicesChargees>
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <Cadrage plans={M.cadrages}>
          {M.segments.map((s) => (
            <Video
              key={s.id}
              name={`Face cam ${s.id} (${s.phrase})`}
              src={staticFile(`${video}/rush.mp4`)}
              from={s.montageDebutFrame}
              durationInFrames={s.dureeFrames}
              trimBefore={s.sourceDebutFrame}
              volume={(f) =>
                interpolate(
                  f,
                  [0, 2, s.dureeFrames - 2, s.dureeFrames],
                  [0, 1, 1, 0],
                  borne,
                )
              }
              objectFit="cover"
              style={{ position: "absolute", width: "100%", height: "100%" }}
            />
          ))}
        </Cadrage>

        {accroche && (
          <Sequence
            name="Titre d'accroche"
            from={accroche.debut}
            durationInFrames={accroche.fin - accroche.debut}
          >
            <TitreAccroche lignes={accroche.lignes} />
          </Sequence>
        )}

        {M.sequences.map((s, i) => (
          <Sequence
            key={i}
            name={`Séquence ${s.type}`}
            from={s.debut}
            durationInFrames={s.fin - s.debut}
          >
            {(s.type !== "motion" || s.fond !== "facecam") && <FondBlanc />}
            {s.type === "motion" &&
              (() => {
                const { composant: Asset, duree } = BANQUE_MOTION[s.asset];
                return (
                  <AbsoluteFill
                    style={{ translate: `0px ${s.decalageY ?? 0}px` }}
                  >
                    <Figer derniere={duree - 1}>
                      <Asset />
                    </Figer>
                  </AbsoluteFill>
                );
              })()}
            {s.type === "partenaire" && (
              <Partenaire
                video={s.video && `${video}/${s.video}`}
                videoDebut={Math.round((s.videoDebutS ?? 0) * M.fps)}
                image={s.image && `${video}/${s.image}`}
                etiquette={s.etiquette}
              />
            )}
            {s.type === "site" && (
              <Sequence from={SITE.departAssets}>
                <AbsoluteFill
                  style={{ translate: `0px ${SITE.decalageTelephone}px` }}
                >
                  <Figer derniere={DUREE_SITE_MOBILE - 1}>
                    <SiteMobile />
                  </Figer>
                </AbsoluteFill>
                <AbsoluteFill
                  style={{ translate: `0px ${SITE.decalageBarre}px` }}
                >
                  <Figer derniere={DUREE_BARRE_RECHERCHE - 1}>
                    <BarreRecherche />
                  </Figer>
                </AbsoluteFill>
              </Sequence>
            )}
            {(s.type === "produit" || s.type === "photo") &&
              (() => {
                const photos: {
                  fichier: string;
                  de?: string;
                  nom?: string;
                  precision?: string;
                  detoure?: boolean;
                }[] = s.photos;
                const large = s.type === "photo" && s.format === "16:9";
                return photos.map((p, k) => {
                  const debut = s.debutsPhotos[k] - s.debut;
                  const fin =
                    k + 1 < photos.length
                      ? s.debutsPhotos[k + 1] - s.debut
                      : s.fin - s.debut;
                  const src = `${video}/${p.fichier}`;
                  return (
                    <Sequence
                      key={k}
                      name={p.nom ?? p.fichier}
                      from={debut}
                      durationInFrames={fin - debut}
                    >
                      {large ? (
                        <ImageLarge src={src} avecEtiquette={Boolean(p.nom)} />
                      ) : (
                        <PhotoArrondie src={src} detoure={p.detoure} />
                      )}
                      {p.nom && (
                        <Etiquette
                          nom={p.nom}
                          precision={p.precision}
                          lignesDeBase={large ? ETIQUETTE_LARGE : undefined}
                        />
                      )}
                    </Sequence>
                  );
                });
              })()}
          </Sequence>
        ))}

        <SousTitres groupes={M.groupes} style={style} />

        {accroche && (
          <Audio
            name="Riser (hook)"
            src={staticFile(SFX.riser.fichier)}
            from={Math.max(0, accroche.fin - riser)}
            trimBefore={Math.max(0, riser - accroche.fin)}
            durationInFrames={Math.min(riser, accroche.fin)}
          />
        )}
        {accroche && dureeMusique > 0 && (
          <Audio
            name="Musique"
            src={staticFile(`${video}/musique.wav`)}
            from={accroche.fin}
            durationInFrames={dureeMusique}
            volume={(f) =>
              interpolate(
                f,
                [0, MUSIQUE.fondu, dureeMusique - MUSIQUE.fondu, dureeMusique],
                [0, 1, 1, 0],
                borne,
              )
            }
          />
        )}
        {bruitages(M).map((s) => (
          <Audio
            key={`${s.nom}-${s.image}`}
            name={s.nom}
            src={staticFile(s.fichier)}
            from={s.image}
            volume={s.volume}
          />
        ))}
      </AbsoluteFill>
    </PolicesChargees>
  );
};
