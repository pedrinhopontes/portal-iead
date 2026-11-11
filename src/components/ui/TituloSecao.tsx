import type { ReactNode } from "react";

export function TituloSecao({
  sobretitulo,
  titulo,
  texto,
  claro = false,
  centralizado = false,
  nivel = 2,
  className = "",
}: {
  sobretitulo?: string;
  titulo: ReactNode;
  texto?: ReactNode;
  claro?: boolean;
  centralizado?: boolean;
  nivel?: 1 | 2 | 3;
  className?: string;
}) {
  const Tag = (`h${nivel}` as const) satisfies "h1" | "h2" | "h3";
  const tamanho =
    nivel === 1 ? "text-4xl sm:text-5xl lg:text-6xl" : nivel === 2 ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl";

  return (
    <div className={`${centralizado ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {sobretitulo && (
        <p
          className={`mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] ${
            claro ? "text-white/75" : "text-verde-escuro"
          } ${centralizado ? "justify-center" : ""}`}
        >
          <span aria-hidden="true" className={`h-px w-8 ${claro ? "bg-white/40" : "bg-verde"}`} />
          {sobretitulo}
        </p>
      )}
      <Tag className={`${tamanho} font-semibold ${claro ? "text-white" : ""}`}>{titulo}</Tag>
      {texto && (
        <p className={`mt-4 text-lg leading-relaxed ${claro ? "text-white/85" : "text-tinta-suave"}`}>{texto}</p>
      )}
    </div>
  );
}
