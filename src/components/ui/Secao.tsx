import type { ReactNode } from "react";

type Fundo = "areia" | "creme" | "branco" | "bordo" | "verde" | "ardosia";

const fundos: Record<Fundo, string> = {
  areia: "bg-areia text-tinta",
  creme: "bg-creme text-tinta",
  branco: "bg-white text-tinta",
  bordo: "bg-bordo text-white",
  verde: "bg-verde-escuro text-white",
  ardosia: "bg-ardosia text-white",
};

export function Secao({
  children,
  fundo = "areia",
  id,
  className = "",
  compacta = false,
}: {
  children: ReactNode;
  fundo?: Fundo;
  id?: string;
  className?: string;
  compacta?: boolean;
}) {
  const espacamento = compacta ? "py-12 sm:py-16" : "py-16 sm:py-24";
  return (
    <section id={id} className={`${fundos[fundo]} ${espacamento} ${className}`}>
      {children}
    </section>
  );
}
