// Données d'un montage face cam : découpage et mots (scripts/decouper_transcription.py) et plan
// de montage (a_monter/<N>/plan.json, écrit par l'agent d'après le PLAN_MONTAGE.md validé).
// Tout est placé en images sur la timeline montée.
import type { GroupeSousTitres } from "../charte/SousTitres";
import type { IdMotion } from "../motion/registre";
import type { CouleurTexte } from "../charte/tokens";
import { SOUS_TITRES } from "../charte/tokens";

type Segment = {
  id: number;
  phrase: string;
  sourceDebutFrame: number;
  dureeFrames: number;
  montageDebutFrame: number;
};
export type Decoupage = {
  fps: number;
  dureeMontageFrames: number;
  segments: Segment[];
};
type MotSource = {
  texte: string;
  debutS: number;
  finS: number;
  phrase: string;
  groupe: string;
  segment: number;
};
export type MotsMontage = { mots: MotSource[] };

// Une ancre désigne un moment de la parole : "P3" (la phrase P3), "P3:Avec" (le mot « Avec » de P3),
// "P8:avec:2" (le 2e « avec » de P8). En début de séquence : début de la phrase ou du mot ; en fin :
// fin de la phrase ou du mot (jamais coupé pendant un mot, MOTION.md §2).
export type Ancre = string;

export type Plan = {
  // Absente : pas de titre d'accroche, ni riser, ni musique (version « sous-titres seuls », vidéo 3)
  accroche?: {
    phrase: string;
    lignes: { texte: string; couleur: CouleurTexte }[];
  };
  cadrages?: { phrase: string; zoom: number | [number, number] }[];
  sequences?: SequencePlan[];
  // ombreSurFacecam : ombre du titre d'accroche sous les sous-titres blancs (t-shirt clair, vidéo 2)
  sousTitres?: { masquer?: [Ancre, Ancre][]; ombreSurFacecam?: boolean };
};
export type SequencePlan =
  | {
      type: "partenaire";
      de: Ancre;
      a: Ancre;
      etiquette: string;
      video?: string;
      videoDebutS?: number;
      image?: string;
    }
  | { type: "site"; de: Ancre; a: Ancre }
  // Asset de la banque de motion design (src/motion/registre.ts), sur fond blanc ou sur le face cam
  | {
      type: "motion";
      de: Ancre;
      a: Ancre;
      asset: IdMotion;
      fond?: "blanc" | "facecam";
      decalageY?: number;
    }
  // Photos (affiche, illustration, produits détourés) : 4:5 arrondie ou 16:9, une à la fois
  // (changement sur l'ancre `de` de la photo suivante), sous-titres noirs affichés ; étiquette
  // facultative (nom + précision, ex. date et lieu sous une affiche 16:9)
  | {
      type: "photo";
      de: Ancre;
      a: Ancre;
      format?: "4:5" | "16:9";
      // regulier : photos affichées chacune le même temps (les ancres `de` des photos sont ignorées)
      regulier?: boolean;
      // gain du déclencheur en dB (ex. -6 pour une rafale de photos), 0 par défaut
      declencheurDb?: number;
      photos: {
        fichier: string;
        de?: Ancre;
        detoure?: boolean;
        nom?: string;
        precision?: string;
      }[];
    }
  | {
      type: "produit";
      de: Ancre;
      a: Ancre;
      photos: {
        fichier: string;
        de?: Ancre;
        nom: string;
        precision?: string;
      }[];
    };

export type DonneesMontage = {
  decoupage: Decoupage;
  mots: MotsMontage;
  plan: Plan;
};

const normaliser = (t: string) => t.toLowerCase().replace(/[.,!?;:…]+$/, "");

export const creerMontage = ({
  decoupage,
  mots: motsSource,
  plan,
}: DonneesMontage) => {
  const { fps, segments } = decoupage;
  const duree = decoupage.dureeMontageFrames;
  const versMontage = (tS: number, idSegment: number) => {
    const s = segments[idSegment - 1];
    return Math.round(tS * fps - s.sourceDebutFrame + s.montageDebutFrame);
  };
  const mots = motsSource.mots.map((m) => ({
    ...m,
    debut: versMontage(m.debutS, m.segment),
    fin: versMontage(m.finS, m.segment),
  }));

  const segmentsDe = (phrase: string) => {
    const s = segments.filter((x) => x.phrase === phrase);
    if (!s.length) {
      throw new Error(`Phrase introuvable dans le découpage : ${phrase}`);
    }
    return s;
  };
  const debutPhrase = (phrase: string) =>
    segmentsDe(phrase)[0].montageDebutFrame;
  const finPhrase = (phrase: string) => {
    const s = segmentsDe(phrase);
    return s[s.length - 1].montageDebutFrame + s[s.length - 1].dureeFrames;
  };
  const mot = (ancre: Ancre) => {
    const [phrase, texte, n = "1"] = ancre.split(":");
    const trouves = mots.filter(
      (m) => m.phrase === phrase && normaliser(m.texte) === normaliser(texte),
    );
    if (trouves.length < Number(n)) {
      throw new Error(`Mot introuvable pour l'ancre « ${ancre} »`);
    }
    return trouves[Number(n) - 1];
  };
  const debut = (ancre: Ancre) =>
    ancre.includes(":") ? mot(ancre).debut : debutPhrase(ancre);
  const fin = (ancre: Ancre) =>
    ancre.includes(":") ? mot(ancre).fin : finPhrase(ancre);

  // Groupes de sous-titres dans l'ordre (même règle que scripts/exporter_sous_titres.py) : un groupe
  // commence à son premier mot, ou à la fin du groupe précédent s'il le déborde ; il reste au moins
  // dureeMin images et s'arrête au groupe suivant ou maintienApresDernierMot images après son dernier mot.
  const parGroupe = new Map<string, typeof mots>();
  for (const m of mots) {
    parGroupe.set(m.groupe, [...(parGroupe.get(m.groupe) ?? []), m]);
  }
  const listes = [...parGroupe.values()];
  const groupes: GroupeSousTitres[] = [];
  let finPrecedent = 0;
  listes.forEach((ms, i) => {
    const suivant = i + 1 < listes.length ? listes[i + 1][0].debut : duree;
    const d = Math.max(ms[0].debut, finPrecedent);
    const f = Math.min(
      duree,
      Math.max(
        d + SOUS_TITRES.dureeMin,
        Math.min(
          suivant,
          ms[ms.length - 1].fin + SOUS_TITRES.maintienApresDernierMot,
        ),
      ),
    );
    finPrecedent = f;
    groupes.push({ debut: d, fin: f, texte: ms.map((m) => m.texte).join(" ") });
  });

  const accroche = plan.accroche
    ? {
        debut: debutPhrase(plan.accroche.phrase),
        fin: finPhrase(plan.accroche.phrase),
        lignes: plan.accroche.lignes,
      }
    : null;
  const cadrages = (plan.cadrages ?? []).map((c) => {
    const [de, a] = typeof c.zoom === "number" ? [c.zoom, c.zoom] : c.zoom;
    return { debut: debutPhrase(c.phrase), fin: finPhrase(c.phrase), de, a };
  });
  // Début de chaque photo d'une séquence produit ou photo : sur son ancre `de`, ou à intervalles
  // égaux (photo, `regulier`)
  const sequences = (plan.sequences ?? []).map((s) => {
    const d = debut(s.de);
    const f = fin(s.a);
    const photos = s.type === "produit" || s.type === "photo" ? s.photos : [];
    const regulier = s.type === "photo" && s.regulier;
    const debutsPhotos = photos.map((p, k) =>
      regulier
        ? Math.round(d + (k * (f - d)) / photos.length)
        : p.de
          ? debut(p.de)
          : d,
    );
    return { ...s, debut: d, fin: f, debutsPhotos };
  });
  const masques = (plan.sousTitres?.masquer ?? []).map(([a, b]) => ({
    debut: debut(a),
    fin: fin(b),
  }));

  return {
    fps,
    duree,
    segments,
    mots,
    groupes,
    accroche,
    cadrages,
    sequences,
    masques,
    debut,
    fin,
  };
};

export type Montage = ReturnType<typeof creerMontage>;
