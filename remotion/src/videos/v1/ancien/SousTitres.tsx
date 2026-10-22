import { useCurrentFrame } from "remotion";
import { mesurer } from "./polices";
import { COULEURS, POLICES, SOUS_TITRES } from "./tokens";

export type GroupeSousTitres = {
  debut: number;
  fin: number;
  mots: { texte: string; debut: number }[];
};

export type ZoneSousTitres = "faceCam" | "surFond" | "masque";

// Sous-titres (SOUS-TITRES.md) : groupes de 2 à 3 mots, chaque mot apparaît quand il est
// prononcé. Sur le face cam : blancs avec ombre portée sombre. Pendant une image sur fond_1 :
// noirs, au-dessus de l'image. Masqués pendant une composition de texte.
export const SousTitres: React.FC<{
  groupes: GroupeSousTitres[];
  zone: (frame: number) => ZoneSousTitres;
}> = ({ groupes, zone }) => {
  const frame = useCurrentFrame();
  const ici = zone(frame);
  const groupe = groupes.find((g) => frame >= g.debut && frame < g.fin);
  if (ici === "masque" || !groupe) {
    return null;
  }
  const surFond = ici === "surFond";
  const centreY = surFond ? SOUS_TITRES.centreYSurFond : SOUS_TITRES.centreYFaceCam;
  const largeur = mesurer(
    groupe.mots.map((m) => m.texte).join(" "),
    POLICES.titre,
    SOUS_TITRES.taille,
  ).largeur;
  const taille = Math.min(SOUS_TITRES.taille, (SOUS_TITRES.taille * SOUS_TITRES.largeurMax) / largeur);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: centreY - taille / 2,
        height: taille,
        lineHeight: `${taille}px`,
        textAlign: "center",
        whiteSpace: "pre",
        fontFamily: POLICES.titre,
        fontSize: taille,
        color: surFond ? COULEURS.texte : COULEURS.sousTitreFaceCam,
        textShadow: surFond ? "none" : SOUS_TITRES.ombre,
      }}
    >
      {groupe.mots.map((mot, i) => (
        <span key={i} style={{ opacity: frame >= mot.debut ? 1 : 0 }}>
          {(i > 0 ? " " : "") + mot.texte}
        </span>
      ))}
    </div>
  );
};
