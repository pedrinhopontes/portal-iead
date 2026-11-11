import type { Metadata } from "next";
import { excluirDocumento, excluirLancamento } from "./acoes";
import { FormularioDocumento, FormularioLancamento } from "./Formularios";
import { Aviso } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";
import {
  categoriaPorSlug,
  formatarDataCurta,
  formatarReal,
  formatarTamanho,
  listarDocumentos,
  listarFinancas,
} from "@/lib/dados/transparencia";

export const metadata: Metadata = { title: "Transparência" };
export const dynamic = "force-dynamic";

export default async function TransparenciaPainel() {
  const [documentos, financas] = await Promise.all([listarDocumentos(), listarFinancas()]);

  const anos = [...new Set(financas.map((f) => f.ano))].sort((a, b) => b - a);
  const anoSugerido = anos[0] ?? new Date().getFullYear() - 1;

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold">Portal da Transparência</h1>
      <p className="mt-1 text-sm text-tinta-suave">
        Documentos públicos e os valores que alimentam os gráficos.
      </p>

      <Aviso titulo="O que não entra aqui" tom="protecao" className="mt-6">
        Nome de doador individual, dado bancário pessoal e qualquer informação de beneficiário ficam
        fora. Os valores são agregados por ano e categoria — nunca lançamento a lançamento.
      </Aviso>

      {/* ---------------- Documentos ---------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold">Documentos</h2>

        <div className="mt-5">
          <FormularioDocumento />
        </div>

        {documentos.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-sm text-tinta-suave">
            Nenhum documento publicado ainda.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {documentos.map((documento) => (
              <li
                key={documento.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-white p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{documento.titulo}</span>
                    {documento.ano && (
                      <span className="rounded-full bg-creme px-2.5 py-0.5 text-[11px] font-bold text-tinta-suave">
                        {documento.ano}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-tinta-suave">
                    {categoriaPorSlug(documento.categoria)?.nome} · {documento.tipo} · publicado em{" "}
                    {formatarDataCurta(documento.publicado_em)}
                    {documento.tamanho_bytes ? ` · ${formatarTamanho(documento.tamanho_bytes)}` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <a
                    href={documento.arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-bordo hover:underline"
                  >
                    Abrir
                  </a>
                  <form action={excluirDocumento.bind(null, documento.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-linha px-4 py-2 text-sm font-semibold hover:border-bordo hover:text-bordo"
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------------- Valores ---------------- */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold">Receitas e despesas</h2>

        <div className="mt-5">
          <FormularioLancamento anoSugerido={anoSugerido} />
        </div>

        {financas.length === 0 ? (
          <p className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-sm text-tinta-suave">
            <Icone nome="grafico" className="h-4 w-4" />
            Nenhum valor lançado. O gráfico do site mostra o estado vazio.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-linha bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-linha bg-areia text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ano</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Natureza</th>
                  <th className="px-4 py-3 text-right font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Fonte</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {financas.map((linha) => (
                  <tr
                    key={`${linha.ano}-${linha.categoria}-${linha.natureza}`}
                    className="border-b border-linha/60 last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold">{linha.ano}</td>
                    <td className="px-4 py-3">{linha.categoria}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          linha.natureza === "receita"
                            ? "bg-verde-suave text-verde-escuro"
                            : "bg-ardosia/10 text-ardosia"
                        }`}
                      >
                        {linha.natureza}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatarReal(linha.valor)}</td>
                    <td className="px-4 py-3 text-xs text-tinta-suave">{linha.fonte ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <form
                        action={excluirLancamento.bind(
                          null,
                          linha.ano,
                          linha.categoria,
                          linha.natureza,
                        )}
                      >
                        <button type="submit" className="text-sm font-semibold text-bordo hover:underline">
                          Excluir
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
