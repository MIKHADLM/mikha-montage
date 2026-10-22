import type { GroupeSousTitres } from "./SousTitres";
import { SOUS_TITRES } from "./tokens";

// Lit les fichiers produits par scripts/decouper_transcription.py (copiés par
// scripts/preparer_medias.py) et place les segments et les mots sur la timeline montée.

type Segment = {
  id: number;
  phrase: string;
  sourceDebutFrame: number;
  dureeFrames: number;
  montageDebutFrame: number;
};

type Decoupage = { fps: number; dureeMontageFrames: number; segments: Segment[] };

type MotSource = {
  id: string;
  texte: string;
  debutS: number;
  finS: number;
  phrase: string;
  groupe: string;
  segment: number;
};

export type Mot = MotSource & { debut: number; fin: number };

export const creerMontage = (decoupage: Decoupage, motsSource: MotSource[]) => {
  const { fps, segments } = decoupage;
  const segment = (id: number) => segments[id - 1];
  const versMontage = (tS: number, idSegment: number) => {
    const s = segment(idSegment);
    return Math.round(tS * fps - s.sourceDebutFrame + s.montageDebutFrame);
  };

  const mots: Mot[] = motsSource.map((m) => ({
    ...m,
    debut: versMontage(m.debutS, m.segment),
    fin: versMontage(m.finS, m.segment),
  }));

  // n-ième mot « texte » d'une phrase, pour caler un plan sur la parole
  const mot = (phrase: string, texte: string, n = 1): Mot => {
    const trouves = mots.filter(
      (m) => m.phrase === phrase && m.texte.toLowerCase() === texte.toLowerCase(),
    );
    if (trouves.length < n) {
      throw new Error(`Mot introuvable : ${phrase} « ${texte} » n° ${n}`);
    }
    return trouves[n - 1];
  };

  const ordre: string[] = [];
  const parGroupe = new Map<string, Mot[]>();
  for (const m of mots) {
    if (!parGroupe.has(m.groupe)) {
      ordre.push(m.groupe);
      parGroupe.set(m.groupe, []);
    }
    parGroupe.get(m.groupe)!.push(m);
  }
  const groupes: GroupeSousTitres[] = ordre.map((cle, i) => {
    const ms = parGroupe.get(cle)!;
    const suivant = ordre[i + 1] ? parGroupe.get(ordre[i + 1])![0].debut : Infinity;
    const debut = ms[0].debut;
    const fin = Math.max(
      debut + 6,
      Math.min(suivant, ms[ms.length - 1].fin + SOUS_TITRES.maintienApresDernierMot),
    );
    return { debut, fin, mots: ms.map((m) => ({ texte: m.texte, debut: m.debut })) };
  });

  return {
    fps,
    duree: decoupage.dureeMontageFrames,
    segments,
    mots,
    mot,
    groupes,
    debutSegment: (id: number) => segment(id).montageDebutFrame,
    finSegment: (id: number) => segment(id).montageDebutFrame + segment(id).dureeFrames,
  };
};

export type Montage = ReturnType<typeof creerMontage>;
