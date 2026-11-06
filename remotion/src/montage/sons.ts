// Bruitages du montage, en images sur la timeline montée. Fichier sans React : lu par la composition
// Montage et par scripts/reperes_montage.mjs (temps prévus des bruitages pour le contrôle avant
// livraison, scripts/verifier_livraison.py).
import { PLACEMENT_SFX, SFX } from "../charte/tokens";
import type { Montage } from "./donnees";

// Bruitages placés d'après les séquences (04_son/SON.md) : clic avant l'entrée d'une séquence qui
// ne commence pas par une photo (partenaire, motion sur fond blanc) et avant chaque sortie du fond
// blanc (pas entre deux séquences collées : on reste sur le fond blanc), déclencheur avant chaque photo
export const bruitages = (M: Montage) => {
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
    // « fond blanc » : tout fond plein cadre (blanc de la charte, rouge ou image de la DA rouge)
    const surFondBlanc = s.type !== "motion" || s.fond !== "facecam";
    if (
      s.type === "partenaire" ||
      s.type === "texte" ||
      (s.type === "motion" && surFondBlanc)
    ) {
      sons.push({
        nom: `Clic : entrée ${s.type}`,
        fichier: SFX.clic.fichier,
        volume: M.clicVolume,
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
    const suiviDeBlanc = M.sequences.some(
      (x) => x.debut === s.fin && (x.type !== "motion" || x.fond !== "facecam"),
    );
    if (s.fin < M.duree && surFondBlanc && !suiviDeBlanc) {
      sons.push({
        nom: `Clic : sortie ${s.type}`,
        fichier: SFX.clic.fichier,
        volume: M.clicVolume,
        image: s.fin - clic,
      });
    }
  }
  return sons.map((s) => ({ ...s, image: Math.max(0, s.image) }));
};
