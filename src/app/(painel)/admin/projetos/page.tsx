import type { Metadata } from "next";
import Link from "next/link";
import { Icone } from "@/components/ui/Icone";
import { listarProjetosPainel } from "@/lib/dados/painel-conteudo";

export const metadata: Metadata = { title: "Projetos" };
export const dynamic = "force-dynamic";

export default async function Projetos() {
  const projetos = await listarProjetosPainel();

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Projetos</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Textos, objetivos e atividades de cada projeto do Instituto.
          </p>
        </div>
        <Link
          href="/admin/projetos/novo"
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Novo projeto
        </Link>
      </div>

      {projetos.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-10 text-center">
          <Icone nome="pessoas" className="mx-auto h-8 w-8 text-tinta/30" />
          <p className="mt-3 font-semibold">Nenhum projeto cadastrado</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {projetos.map((projeto) => (
            <li
              key={projeto.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{projeto.nome}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                      projeto.publicado
                        ? "bg-verde-suave text-verde-escuro"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {projeto.publicado ? "no ar" : "rascunho"}
                  </span>
                  {projeto.faixa_etaria && (
                    <span className="text-xs text-tinta-suave">{projeto.faixa_etaria}</span>
                  )}
                  {projeto.observacao && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                      a confirmar
                    </span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs text-tinta-suave">/projetos/{projeto.slug}</p>
              </div>

              <Link
                href={`/admin/projetos/${projeto.id}`}
                className="shrink-0 rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-white hover:bg-bordo"
              >
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
