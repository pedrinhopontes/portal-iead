import Link from "next/link";
import type { ReactNode } from "react";
import { Icone } from "./Icone";

type Variante = "primario" | "secundario" | "contorno" | "claro";

const estilos: Record<Variante, string> = {
  primario: "bg-bordo text-white hover:bg-bordo-escuro",
  secundario: "bg-verde-escuro text-white hover:bg-tinta",
  contorno: "border-2 border-tinta/25 text-tinta hover:border-bordo hover:text-bordo",
  claro: "bg-white text-bordo hover:bg-creme",
};

const tamanhos = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type Props = {
  children: ReactNode;
  href?: string;
  variante?: Variante;
  tamanho?: keyof typeof tamanhos;
  comSeta?: boolean;
  className?: string;
  type?: "button" | "submit";
};

export function Botao({
  children,
  href,
  variante = "primario",
  tamanho = "md",
  comSeta = false,
  className = "",
  type = "button",
}: Props) {
  const classe = `group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors ${estilos[variante]} ${tamanhos[tamanho]} ${className}`;

  const conteudo = (
    <>
      {children}
      {comSeta && <Icone nome="seta" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  if (href) {
    const externo = href.startsWith("http");
    if (externo) {
      return (
        <a href={href} className={classe} target="_blank" rel="noopener noreferrer">
          {conteudo}
        </a>
      );
    }
    return (
      <Link href={href} className={classe}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button type={type} className={classe}>
      {conteudo}
    </button>
  );
}
