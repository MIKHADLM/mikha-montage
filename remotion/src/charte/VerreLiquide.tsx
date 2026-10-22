import { VERRE_LIQUIDE } from "./tokens";

// Capsule en verre liquide (DESIGN.md §4), centrée sur son point d'origine : verre dépoli, reflets
// intérieurs, anneau lumineux sur le bord, ombre douce. reflet : position du reflet lumineux, de
// gauche (0) à droite (1) ; eclat : voile blanc quand on appuie (0 à 1).
export const VerreLiquide: React.FC<{
  largeur: number;
  hauteur: number;
  reflet: number;
  eclat?: number;
  children?: React.ReactNode;
}> = ({ largeur, hauteur, reflet, eclat = 0, children }) => (
  <div
    style={{
      position: "absolute",
      left: -largeur / 2,
      top: -hauteur / 2,
      width: largeur,
      height: hauteur,
      borderRadius: hauteur / 2,
      background: VERRE_LIQUIDE.remplissage,
      boxShadow: `${VERRE_LIQUIDE.reflets}, ${VERRE_LIQUIDE.contour}, ${VERRE_LIQUIDE.ombre}`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: hauteur / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${reflet * 100}%`,
          top: -hauteur * 0.35,
          width: hauteur * 1.8,
          height: hauteur * 0.95,
          translate: "-50% 0",
          background:
            "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />
      {eclat > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "white",
            opacity: 0.4 * eclat,
          }}
        />
      )}
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: hauteur / 2,
        padding: 2,
        background: VERRE_LIQUIDE.anneau,
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
    {children}
  </div>
);
