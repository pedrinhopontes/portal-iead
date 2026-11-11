import type { Metadata } from "next";
import Link from "next/link";
import type { TextoEditavel } from "./tipos";
import { Icone } from "@/components/ui/Icone";
import { PAGINAS } from "@/content/textos";
import { textosParaOPainel } from "@/lib/dados/textos";

export const metadata: Metadata = { title: "Textos do site" };
export const dynamic = "force-dynamic";

export default async function Textos() {
  const todos = (await textosParaOPainel()) as TextoEditavel[];

  const paginas = PAGINAS.map((p) => {
    const daPagina = todos.filter((t) => t.pagina === p.nome);
    return {
      ...p,
      total: daPagina.length,
      alterados: daPagina.filter((t) => t.alterado).length,
    };
  });

  const prontas = paginas.filter((p) => p.total > 0);
  const pendentes = paginas.filter((p) => p.total === 0);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold">Textos do site</h1>
      <p className="mt-1 text-sm text-tinta-suave">
        Escolha uma página para editar os títulos e parágrafos. Os campos ficam de um lado e a
        página de verdade do outro.
      </p>

      <ul className="mt-8 divide-y divide-linha rounded-2xl border border-linha bg-white">
        {prontas.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/admin/textos/${p.slug}`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-areia"
            >
              <span>
                <span className="block font-semibold">{p.nome}</span>
                <span className="text-sm text-tinta-suave">
                  {p.total} {p.total === 1 ? "texto" : "textos"}
                  {p.alterados > 0 && (
                    <span className="text-verde-escuro">
                      {" "}
                      · {p.alterados} alterado{p.alterados === 1 ? "" : "s"}
                    </span>
                  )}
                </span>
              </span>
              <Icone nome="seta" className="h-4 w-4 shrink-0 text-tinta-suave" />
            </Link>
          </li>
        ))}
      </ul>

      {pendentes.length > 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-6">
          <p className="text-sm font-semibold">Ainda não preparadas</p>
          <p className="mt-1 text-sm text-tinta-suave">
            Os textos destas páginas continuam no código e serão liberados para edição em seguida:{" "}
            {pendentes.map((p) => p.nome).join(", ")}.
          </p>
        </div>
      )}
    </div>
  );
}
