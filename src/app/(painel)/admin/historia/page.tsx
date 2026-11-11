import type { Metadata } from "next";
import Link from "next/link";
import { Icone } from "@/components/ui/Icone";
import { listarAnosPainel } from "@/lib/dados/painel-conteudo";

export const metadata: Metadata = { title: "Linha do tempo" };
export const dynamic = "force-dynamic";

export default async function Historia() {
  const anos = await listarAnosPainel();
  const semTexto = anos.filter((a) => !a.titulo).length;
  const proximo = anos.length > 0 ? Math.max(...anos.map((a) => a.ano)) + 1 : 2016;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Linha do tempo</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Um capítulo por ano. A partir de 2027, basta acrescentar o próximo aqui.
          </p>
        </div>
        <Link
          href={`/admin/historia/${proximo}`}
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Acrescentar {proximo}
        </Link>
      </div>

      {semTexto > 0 && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Icone nome="relogio" className="h-4 w-4 shrink-0" />
          {semTexto} {semTexto === 1 ? "ano está" : "anos estão"} sem texto histórico. Eles aparecem
          reservados na linha do tempo, esperando o relato do Instituto.
        </p>
      )}

      <ul className="mt-8 space-y-3">
        {anos.map((ano) => (
          <li
            key={ano.ano}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-white p-5"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-serif text-2xl font-semibold text-bordo">{ano.ano}</span>
                {ano.destaque && (
                  <span className="rounded-full bg-bordo-suave px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-bordo-escuro">
                    marco
                  </span>
                )}
                {!ano.titulo && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                    texto a escrever
                  </span>
                )}
                {!ano.publicado && (
                  <span className="rounded-full bg-creme px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-tinta-suave">
                    oculto
                  </span>
                )}
              </div>
              {ano.titulo && <p className="mt-1 font-semibold">{ano.titulo}</p>}
              {ano.acontecimentos.length > 0 && (
                <p className="mt-0.5 text-xs text-tinta-suave">
                  {ano.acontecimentos.length}{" "}
                  {ano.acontecimentos.length === 1 ? "acontecimento" : "acontecimentos"}
                </p>
              )}
            </div>

            <Link
              href={`/admin/historia/${ano.ano}`}
              className="shrink-0 rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-white hover:bg-bordo"
            >
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
