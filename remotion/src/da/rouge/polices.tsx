import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";
import { POLICES_ROUGE } from "./tokens";

// Polices de la DA rouge (DA MIKHA/polices, copiées dans public/charte/polices par
// scripts/preparer_medias.py). Chargées seulement pour une vidéo en DA rouge : une vidéo de la
// charte se rend même si ces fichiers manquent.
let chargement: Promise<unknown> | null = null;
const charger = () =>
  (chargement ??= Promise.all([
    loadFont({
      family: POLICES_ROUGE.titre,
      url: staticFile("charte/polices/Anton-Regular.ttf"),
    }),
    loadFont({
      family: POLICES_ROUGE.texte,
      url: staticFile("charte/polices/Thunder-LC.ttf"),
    }),
    loadFont({
      family: POLICES_ROUGE.escalier,
      url: staticFile("charte/polices/Chivo-VariableFont_wght.ttf"),
      weight: "100 900",
    }),
  ]));

export const PolicesRouge: React.FC<{
  actif: boolean;
  children: React.ReactNode;
}> = ({ actif, children }) => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() =>
    actif ? delayRender("Chargement des polices de la DA rouge") : null,
  );
  const [pret, setPret] = useState(!actif);
  useEffect(() => {
    if (attente === null) return;
    charger()
      .then(() => {
        setPret(true);
        continueRender(attente);
      })
      .catch((e) => cancelRender(e));
  }, [attente, continueRender, cancelRender]);
  return pret ? <>{children}</> : null;
};

let contexte: CanvasRenderingContext2D | null = null;

// Encre d'un texte : débord à gauche du point d'origine, largeur, hauteur au-dessus et au-dessous
// de la ligne de base ; avance (largeur typographique)
export const encre = (
  texte: string,
  police: string,
  taille: number,
  { graisse = 400, espacement = 0 } = {},
) => {
  if (!contexte) contexte = document.createElement("canvas").getContext("2d");
  const ctx = contexte!;
  ctx.font = `${graisse} ${taille}px "${police}"`;
  ctx.letterSpacing = `${espacement}px`;
  const m = ctx.measureText(texte);
  return {
    g: m.actualBoundingBoxLeft,
    l: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    haut: m.actualBoundingBoxAscent,
    bas: m.actualBoundingBoxDescent,
    avance: m.width,
  };
};
// Corps pour une hauteur de capitales donnée (mesurée sur « H »)
export const corpsPourCapitales = (police: string, capitales: number) =>
  (100 * capitales) / encre("H", police, 100).haut;
