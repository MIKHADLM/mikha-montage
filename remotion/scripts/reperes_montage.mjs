// Repères d'un montage, calculés par le même code que la composition Montage (src/montage/donnees.ts
// et src/montage/sons.ts) : coupes du face cam, séquences, bruitages prévus, sous-titres, hook.
// Sert au contrôle avant livraison (verifier_livraison.py) et à la planche de relecture
// (planche_relecture.py) : les temps prévus ne sont jamais recopiés à la main.
//
// Usage (depuis MONTAGE/remotion) :
//   node scripts/reperes_montage.mjs <decoupage.json> <mots_montage.json> <plan.json>
// Sortie : JSON sur la sortie standard (temps en images, à fps images par seconde).
import { buildSync } from "esbuild";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const [decoupage, mots, plan] = process.argv.slice(2);
if (!plan) {
  console.error("usage : node scripts/reperes_montage.mjs <decoupage.json> <mots_montage.json> <plan.json>");
  process.exit(2);
}
const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "montage");
const entree = `
import { creerMontage } from "./donnees";
import { bruitages } from "./sons";
import { SFX } from "../charte/tokens";
export const reperes = (donnees) => {
  const M = creerMontage(donnees);
  const attaque = (fichier) => Object.values(SFX).find((s) => s.fichier === fichier)?.attaqueS ?? 0;
  return {
    fps: M.fps,
    duree: M.duree,
    rouge: M.rouge,
    coupes: M.segments.slice(1).map((s) => s.montageDebutFrame),
    segments: M.segments.map((s) => ({ id: s.id, phrase: s.phrase, debut: s.montageDebutFrame,
      fin: s.montageDebutFrame + s.dureeFrames, sourceDebut: s.sourceDebutFrame })),
    accroche: M.accroche && { debut: M.accroche.debut, fin: M.accroche.fin },
    riser: M.accroche && { fichier: SFX.riser.fichier, dureeS: SFX.riser.dureeS },
    sequences: M.sequences.map((s) => ({ type: s.type, debut: s.debut, fin: s.fin,
      debutsPhotos: s.debutsPhotos, fond: s.fond ?? null,
      lignes: s.lignes ? s.lignes.map((l) => l.texte) : null,
      image: Boolean(s.image || s.video) })),
    sons: bruitages(M).map((b) => ({ ...b, attaqueS: attaque(b.fichier),
      attaqueSecondes: b.image / M.fps + attaque(b.fichier) })),
    groupes: M.groupes,
    masques: M.masques,
    mots: M.mots.map((m) => ({ texte: m.texte, debut: m.debut, fin: m.fin, phrase: m.phrase })),
  };
};
`;
const r = buildSync({
  stdin: { contents: entree, resolveDir: src, loader: "ts" },
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
  logLevel: "error",
});
const module = { exports: {} };
new Function("module", "exports", "require", r.outputFiles[0].text)(
  module,
  module.exports,
  createRequire(import.meta.url),
);
const lire = (f) => JSON.parse(readFileSync(f, "utf8"));
const sortie = module.exports.reperes({ decoupage: lire(decoupage), mots: lire(mots), plan: lire(plan) });
process.stdout.write(JSON.stringify(sortie, null, 1) + "\n");
