import type { ReactNode } from "react";
import { Icone, type NomeIcone } from "./Icone";

type Tom = "pendente" | "demonstracao" | "protecao" | "informativo";

const tons: Record<Tom, { caixa: string; icone: NomeIcone; cor: string }> = {
  pendente: { caixa: "border-amber-300 bg-amber-50", icone: "relogio", cor: "text-amber-700" },
  demonstracao: { caixa: "border-ardosia/30 bg-ardosia/5", icone: "documento", cor: "text-ardosia" },
  protecao: { caixa: "border-bordo/30 bg-bordo-suave", icone: "cadeado", cor: "text-bordo-escuro" },
  informativo: { caixa: "border-verde/40 bg-verde-suave", icone: "check", cor: "text-verde-escuro" },
};

/**
 * Bloco de aviso honesto: diz o que ainda não existe, o que é demonstração e o que
 * é regra de proteção de dados. Aparece no site, não só no código.
 */
export function Aviso({
  titulo,
  children,
  tom = "pendente",
  className = "",
}: {
  titulo: string;
  children?: ReactNode;
  tom?: Tom;
  className?: string;
}) {
  const estilo = tons[tom];

  return (
    <div className={`rounded-2xl border ${estilo.caixa} p-5 ${className}`}>
      <p className={`flex items-center gap-2 text-sm font-bold ${estilo.cor}`}>
        <Icone nome={estilo.icone} className="h-5 w-5 shrink-0" />
        {titulo}
      </p>
      {children && <div className="mt-2 text-sm leading-relaxed text-tinta-suave">{children}</div>}
    </div>
  );
}
