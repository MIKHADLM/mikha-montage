// Données d'un montage face cam : découpage et mots (scripts/decouper_transcription.py) et plan
// de montage (a_monter/<N>/plan.json, écrit par l'agent d'après le PLAN_MONTAGE.md validé).
// Tout est placé en images sur la timeline montée.
import type { GroupeSousTitres } from "../charte/SousTitres";
import type { IdMotion } from "../motion/registre";
import type { CouleurTexte } from "../charte/tokens";
import { SOUS_TITRES } from "../charte/tokens";
import type { LigneEscalier } from "../da/rouge/TexteEscalier";
import type { TitreBloc } from "../da/rouge/TitreBlocAccroche";

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
  // Direction artistique : "charte" (jaune et Gilroy, par défaut : vidéos 1 à 3) ou "rouge" (nouvelle
  // DA, DA MIKHA/DECISIONS.md : titre en bloc derrière la tête, Thunder, fond rouge grainé)
  da?: "charte" | "rouge";
  // Absente : pas de titre d'accroche, ni riser, ni musique (version « sous-titres seuls », vidéo 3)
  accroche?: {
    phrase: string;
    // charte : lignes du titre
    lignes?: { texte: string; couleur: CouleurTexte }[];
    // bas du titre en px, si le visage est là où le titre tombe d'habitude (vidéo 3)
    bas?: number;
    // DA rouge : titre en bloc (petits mots empilés, mot clé, dernier mot)
    titre?: TitreBloc;
    // DA rouge : false = titre entier devant le sujet (repli si le détourage échoue) ; sinon les mots
    // rouges passent derrière le sujet détouré (public/<video>/sujet, preparer_medias.py)
    derriere?: boolean;
  };
  cadrages?: { phrase: string; zoom: number | [number, number] }[];
  sequences?: SequencePlan[];
  // ombreSurFacecam : ombre du titre d'accroche sous les sous-titres blancs (t-shirt clair, vidéo 2)
  sousTitres?: { masquer?: [Ancre, Ancre][]; ombreSurFacecam?: boolean };
  // gain des clics en dB ; -4 par défaut (SON.md, validé le 2026-11-03, vidéo 4)
  sons?: { clicDb?: number };
};
export type SequencePlan =
  | {
      type: "partenaire";
      de: Ancre;
      a: Ancre;
      // étiquette image (partenaire), ou texte nom + précision (ex. une vidéo de jeu, vidéo 3)
      etiquette?: string;
      nom?: string;
      precision?: string;
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
      // image de l'asset où commencer, pour le caler sur une phrase courte (vidéo 3)
      departImage?: number;
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
      // 1:1 : image carrée affichée sans agrandissement (petite source, vidéo 3)
      format?: "4:5" | "16:9" | "1:1";
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
    }
  // DA rouge seulement : texte en escalier, sur le fond rouge (noir flouté) ou sur une image ou une
  // vidéo plein cadre (rouge) ; à utiliser de temps en temps
  // `lignes: []` : illustration plein cadre sans texte, sous-titres de base gardés (vidéo 4)
  | {
      type: "texte";
      de: Ancre;
      a: Ancre;
      lignes: LigneEscalier[];
      image?: string;
      video?: string;
      videoDebutS?: number;
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

  const rouge = plan.da === "rouge";
  if (plan.accroche && rouge && !plan.accroche.titre) {
    throw new Error("DA rouge : accroche.titre manque dans plan.json");
  }
  if (plan.accroche && !rouge && !plan.accroche.lignes) {
    throw new Error("Charte : accroche.lignes manque dans plan.json");
  }
  if (!rouge && plan.sequences?.some((s) => s.type === "texte")) {
    throw new Error("Séquence « texte » : seulement en DA rouge");
  }
  const accroche = plan.accroche
    ? {
        debut: debutPhrase(plan.accroche.phrase),
        fin: finPhrase(plan.accroche.phrase),
        lignes: plan.accroche.lignes ?? [],
        bas: plan.accroche.bas,
        titre: plan.accroche.titre,
        derriere: plan.accroche.derriere !== false,
      }
    : null;
  // DA rouge : pas de zoom pendant le hook (la tête ne doit pas monter vers le titre)
  const cadrages = (plan.cadrages ?? [])
    .filter((c) => !(rouge && c.phrase === plan.accroche?.phrase))
    .map((c) => {
      const [de, a] = typeof c.zoom === "number" ? [c.zoom, c.zoom] : c.zoom;
      return { debut: debutPhrase(c.phrase), fin: finPhrase(c.phrase), de, a };
    });
  // Début de chaque photo d'une séquence produit ou photo : sur son ancre `de`, ou à intervalles
  // égaux (photo, `regulier`)
  // Bords d'une séquence recalés sur la coupe voisine s'ils en sont à moins de 5 images : sinon il
  // reste une ou deux images isolées du face cam (frame parasite, vidéo 4, retour sur la v02)
  const SNAP = 5;
  const caler = (t: number, cote: "debut" | "fin") => {
    for (const g of segments) {
      const a0 = g.montageDebutFrame;
      const a1 = a0 + g.dureeFrames;
      if (cote === "debut" && t >= a0 && t - a0 < SNAP) return a0;
      if (cote === "fin" && t <= a1 && a1 - t < SNAP && t > a0) return a1;
    }
    return t;
  };
  // Texte en escalier : chaque mot apparaît quand il est dit (mot reconnu correspondant dans la
  // séquence, accents et ponctuation ignorés) ; un mot non dit suit le précédent de 4 images
  const cle = (t: string) =>
    t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’]/g, "'")
      .replace(/[^a-z0-9%']/g, "");
  const apparitionsEscalier = (texte: string[], d: number, f: number) => {
    const dits = mots.filter((m) => m.debut >= d - 2 && m.debut < f);
    let k = 0;
    let prec = -4;
    return texte.map((w) => {
      // un mot dit sauté au plus : un mot écrit qui n'est pas dit ne va pas chercher un homonyme plus loin
      const j = dits.findIndex(
        (m, i) => i >= k && i <= k + 1 && cle(m.texte) === cle(w),
      );
      const t = j >= 0 ? Math.max(0, dits[j].debut - d) : prec + 4;
      if (j >= 0) k = j + 1;
      prec = t;
      return t;
    });
  };
  const sequences = (plan.sequences ?? []).map((s) => {
    const d = caler(debut(s.de), "debut");
    const f = caler(fin(s.a), "fin");
    const photos = s.type === "produit" || s.type === "photo" ? s.photos : [];
    const regulier = s.type === "photo" && s.regulier;
    const debutsPhotos = photos.map((p, k) =>
      regulier
        ? Math.round(d + (k * (f - d)) / photos.length)
        : p.de
          ? debut(p.de)
          : d,
    );
    const apparitions =
      s.type === "texte"
        ? apparitionsEscalier(
            s.lignes.flatMap((l) => l.texte.split(" ")),
            d,
            f,
          )
        : [];
    return { ...s, debut: d, fin: f, debutsPhotos, apparitions };
  });
  // Un groupe masqué ne doit pas réapparaître juste après le masque (son maintien le dépasse)
  const masques = (plan.sousTitres?.masquer ?? []).map(([a, b]) => {
    const f = fin(b);
    const enCours = groupes.find((g) => g.debut < f && g.fin > f);
    return { debut: debut(a), fin: enCours ? enCours.fin : f };
  });

  return {
    clicVolume: 10 ** ((plan.sons?.clicDb ?? -4) / 20), // -4 dB par défaut (SON.md, validé le 2026-11-03)
    rouge,
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
