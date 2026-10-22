import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CADRAGE } from "./tokens";

export type PlanCadrage = { debut: number; fin: number; de: number; a: number };

// Cadrage du face cam (MOTION.md §4) : un cadrage par phrase, fixe ou en zoom progressif linéaire,
// autour du centre de l'image comme dans DaVinci. Hors des plans : échelle 1.
export const Cadrage: React.FC<{
  plans: PlanCadrage[];
  children: React.ReactNode;
}> = ({ plans, children }) => {
  const frame = useCurrentFrame();
  const plan = plans.find((p) => frame >= p.debut && frame < p.fin);
  const echelle = plan
    ? interpolate(frame, [plan.debut, plan.fin], [plan.de, plan.a], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill
      style={{ scale: String(echelle), transformOrigin: CADRAGE.origine }}
    >
      {children}
    </AbsoluteFill>
  );
};
