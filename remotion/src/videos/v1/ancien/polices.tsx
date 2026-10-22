import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";
import { POLICES } from "./tokens";

const chargement = Promise.all([
  loadFont({ family: POLICES.titre, url: staticFile("charte/polices/Gilroy-Heavy.ttf") }),
  loadFont({ family: POLICES.accent, url: staticFile("charte/polices/PermanentMarker-Regular.ttf") }),
]);

// N'affiche ses enfants qu'une fois les polices chargées : les compositions de texte
// mesurent leurs lignes au rendu, les mesures doivent utiliser les vraies polices.
export const PolicesChargees: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [attente] = useState(() => delayRender("Chargement des polices de la charte"));
  const [pret, setPret] = useState(false);

  useEffect(() => {
    chargement
      .then(() => {
        setPret(true);
        continueRender(attente);
      })
      .catch((e) => cancelRender(e));
  }, [attente, continueRender, cancelRender]);

  return pret ? <>{children}</> : null;
};

let contexte: CanvasRenderingContext2D | null = null;

// Mesures d'un texte par le navigateur (crénage compris) : avance, débords de l'encre à
// gauche et à droite du point d'origine, hauteur des capitales.
export const mesurer = (texte: string, police: string, taille: number) => {
  if (!contexte) {
    contexte = document.createElement("canvas").getContext("2d");
  }
  const ctx = contexte!;
  ctx.font = `${taille}px "${police}"`;
  const m = ctx.measureText(texte);
  const capitales = ctx.measureText("H").actualBoundingBoxAscent;
  return {
    largeur: m.width,
    encreGauche: m.actualBoundingBoxLeft,
    encreDroite: m.actualBoundingBoxRight,
    capitales,
  };
};
