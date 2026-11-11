import Link from "next/link";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import { Icone } from "@/components/ui/Icone";
import type { Projeto } from "@/lib/dados/conteudo-tipos";

const paletas = {
  verde: "bg-verde-escuro",
  bordo: "bg-bordo",
  ardosia: "bg-ardosia",
} as const;

export function CartaoProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-linha bg-white transition-shadow hover:shadow-lg">
      <div className="relative">
        <Foto
          slot={`projeto-${projeto.slug}-capa`}
          legenda={`Atividade do projeto ${projeto.nome}`}
          proporcao="4/3"
          raio="rounded-none"
          className="border-b border-linha"
          tamanhos="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
        />
        {projeto.chamada && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${paletas[projeto.paleta]}`}
          >
            {projeto.chamada}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold">{projeto.nome}</h3>

        <div className="mt-2 flex flex-wrap gap-2">
          {projeto.publico && <Etiqueta tom="neutro">{projeto.publico}</Etiqueta>}
          {projeto.faixa_etaria && <Etiqueta tom="verde">{projeto.faixa_etaria}</Etiqueta>}
        </div>

        {projeto.resumo && (
          <p className="mt-4 flex-1 text-sm leading-relaxed text-tinta-suave">{projeto.resumo}</p>
        )}

        <Link
          href={`/projetos/${projeto.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-bordo hover:text-bordo-escuro"
        >
          Conhecer o projeto
          <Icone nome="seta" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
