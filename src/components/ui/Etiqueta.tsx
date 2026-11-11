import type { ReactNode } from "react";

type Tom = "verde" | "bordo" | "ardosia" | "neutro" | "aviso";

const tons: Record<Tom, string> = {
  verde: "bg-verde-suave text-verde-escuro ring-verde/30",
  bordo: "bg-bordo-suave text-bordo-escuro ring-bordo/25",
  ardosia: "bg-ardosia/10 text-ardosia ring-ardosia/25",
  neutro: "bg-creme text-tinta-suave ring-linha",
  aviso: "bg-amber-50 text-amber-800 ring-amber-300",
};

export function Etiqueta({
  children,
  tom = "neutro",
  className = "",
}: {
  children: ReactNode;
  tom?: Tom;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${tons[tom]} ${className}`}
    >
      {children}
    </span>
  );
}
