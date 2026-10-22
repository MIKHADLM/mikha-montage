import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CADRAGE } from "./tokens";

export type PlanCadrage = { debut: number; fin: number; de: number; a: number };

// Cadrage du face cam : échelle fixe ou zoom progressif (linéaire) sur chaque plan, centré
// sur le visage. Changer d'échelle à chaque coupe masque le saut de l'image.
export const Cadrage: React.FC<{ plans: PlanCadrage[]; children: React.ReactNode }> = ({
  plans,
  children,
}) => {
  const frame = useCurrentFrame();
  const plan = plans.find((p) => frame >= p.debut && frame < p.fin);
  const echelle = plan
    ? interpolate(frame, [plan.debut, plan.fin], [plan.de, plan.a], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : CADRAGE.large;

  return (
    <AbsoluteFill style={{ scale: String(echelle), transformOrigin: CADRAGE.origine }}>
      {children}
    </AbsoluteFill>
  );
};
