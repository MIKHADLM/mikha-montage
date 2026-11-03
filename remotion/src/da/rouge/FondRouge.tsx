import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Fond rouge grainé des séquences d'illustration de la DA rouge. Grain mesuré sur le panneau de
// Michaël (DA MIKHA/Panneau_2.png) : monochrome (le même écart sur les trois couches), écart-type
// ≈ 10,7 niveaux, grain d'un pixel, sur le fond seulement. Calculé, pas une image : même tirage pour
// une même image, donc rendu reproductible. Grain fixe (cadence 0) choisi le 2026-11-03 : le grain
// animé ne survit pas à la recompression d'Instagram.
const ROUGE = [0xf1, 0x2f, 0x19] as const; // #F12F19
const ECART_TYPE = 10.7; // mesuré sur Panneau_2.png

// Tirage pseudo-aléatoire reproductible (mulberry32)
const tirage = (graine: number) => () => {
  graine |= 0;
  graine = (graine + 0x6d2b79f5) | 0;
  let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Fond rouge plein cadre avec grain. cadence : nouveaux grains par seconde (0 : grain fixe)
export const FondRouge: React.FC<{ cadence: number }> = ({ cadence }) => {
  const f = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const toile = useRef<HTMLCanvasElement>(null);
  const tirageCourant = cadence ? Math.floor((f * cadence) / fps) : 0;
  useLayoutEffect(() => {
    const ctx = toile.current!.getContext("2d")!;
    const image = ctx.createImageData(width, height);
    const d = image.data;
    const hasard = tirage(1 + tirageCourant * 7919);
    for (let i = 0; i < d.length; i += 4) {
      // Gaussienne approchée (somme de trois tirages uniformes), même valeur sur R, V et B
      const n = (hasard() + hasard() + hasard() - 1.5) * 2 * ECART_TYPE;
      d[i] = ROUGE[0] + n;
      d[i + 1] = ROUGE[1] + n;
      d[i + 2] = ROUGE[2] + n;
      d[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }, [tirageCourant, width, height]);
  return (
    <canvas
      ref={toile}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
    />
  );
};
