import type { Metadata } from "next";
import Link from "next/link";
import { listarParceirosPainel } from "@/lib/dados/painel-conteudo";

export const metadata: Metadata = { title: "Parceiros" };
export const dynamic = "force-dynamic";

export default async function Parceiros() {
  const parceiros = await listarParceirosPainel();

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Parceiros</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Redes, conselhos e organizações das quais o Instituto faz parte.
          </p>
        </div>
        <Link
          href="/admin/parceiros/novo"
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Novo parceiro
        </Link>
      </div>

      {parceiros.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-tinta-suave">
          Nenhum parceiro cadastrado.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {parceiros.map((parceiro) => (
            <li
              key={parceiro.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{parceiro.nome}</span>
                  {!parceiro.publicado && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                      oculto
                    </span>
                  )}
                </div>
                {parceiro.descricao && (
                  <p className="mt-1 text-sm text-tinta-suave">{parceiro.descricao}</p>
                )}
              </div>

              <Link
                href={`/admin/parceiros/${parceiro.id}`}
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
