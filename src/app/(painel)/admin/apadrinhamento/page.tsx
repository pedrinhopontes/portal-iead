import type { Metadata } from "next";
import Link from "next/link";
import { Icone } from "@/components/ui/Icone";
import { campanhasDoPainel } from "@/lib/dados/painel-apadrinhamento";

export const metadata: Metadata = { title: "Apadrinhamento" };
export const dynamic = "force-dynamic";

const corStatus: Record<string, string> = {
  aberta: "bg-verde-suave text-verde-escuro",
  rascunho: "bg-amber-50 text-amber-800",
  encerrada: "bg-ardosia/10 text-ardosia",
  arquivada: "bg-creme text-tinta-suave",
};

export default async function Campanhas() {
  const campanhas = await campanhasDoPainel();
  const aberta = campanhas.find((c) => c.status === "aberta");

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Apadrinhamento</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Campanhas de Natal, participantes e reservas.
          </p>
        </div>
        <Link
          href="/admin/apadrinhamento/nova"
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Nova campanha
        </Link>
      </div>

      {aberta && (
        <div className="mt-8 rounded-2xl border-2 border-verde bg-verde-suave p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-verde-escuro">
            Campanha recebendo apadrinhamentos
          </p>
          <h2 className="mt-2 font-serif text-xl font-semibold">{aberta.titulo}</h2>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <span>
              <strong className="font-serif text-2xl font-semibold text-verde-escuro">
                {aberta.disponiveis}
              </strong>{" "}
              disponíveis
            </span>
            <span>
              <strong className="font-serif text-2xl font-semibold text-amber-700">
                {aberta.pendentes}
              </strong>{" "}
              com reserva pendente
            </span>
            <span>
              <strong className="font-serif text-2xl font-semibold text-bordo">
                {aberta.apadrinhados}
              </strong>{" "}
              apadrinhados
            </span>
          </div>
          <Link
            href={`/admin/apadrinhamento/${aberta.id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-verde-escuro px-5 py-2.5 text-sm font-bold text-white hover:bg-tinta"
          >
            Gerenciar
            <Icone nome="seta" className="h-4 w-4" />
          </Link>
        </div>
      )}

      {campanhas.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-10 text-center">
          <Icone nome="presente" className="mx-auto h-8 w-8 text-tinta/30" />
          <p className="mt-3 font-semibold">Nenhuma campanha cadastrada</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {campanhas.map((campanha) => (
            <li
              key={campanha.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-2xl font-semibold text-bordo">{campanha.ano}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                      corStatus[campanha.status] ?? "bg-creme text-tinta-suave"
                    }`}
                  >
                    {campanha.status}
                  </span>
                  {campanha.total > 0 && (
                    <span className="text-xs text-tinta-suave">
                      {campanha.total} participantes · {campanha.disponiveis} disponíveis
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm font-semibold">{campanha.titulo}</p>
              </div>

              <Link
                href={`/admin/apadrinhamento/${campanha.id}`}
                className="shrink-0 rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-white hover:bg-bordo"
              >
                Abrir
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/admin/textos/apadrinhamento"
        className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-linha bg-white px-6 py-5 hover:border-bordo"
      >
        <span>
          <span className="block font-semibold">Textos da página de apadrinhamento</span>
          <span className="text-sm text-tinta-suave">
            Títulos e parágrafos que aparecem no site, com a página ao lado
          </span>
        </span>
        <Icone nome="seta" className="h-4 w-4 shrink-0 text-tinta-suave" />
      </Link>
    </div>
  );
}
