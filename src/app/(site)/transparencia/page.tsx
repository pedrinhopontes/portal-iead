import type { Metadata } from "next";
import Link from "next/link";
import { CapaPagina } from "@/components/site/CapaPagina";
import { GraficoFinancas } from "@/components/site/GraficoFinancas";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import {
  categorias,
  categoriaPorSlug,
  formatarDataCurta,
  formatarTamanho,
  listarDocumentos,
  listarFinancas,
  naoPublicamos,
  resumirPorAno,
  ultimaAtualizacao,
} from "@/lib/dados/transparencia";
import { carregarTextos } from "@/lib/dados/textos";

export const metadata: Metadata = {
  title: "Portal da Transparência",
  description:
    "Documentos institucionais, prestação de contas, receitas, aplicação dos recursos, parcerias e relatórios de impacto do IEAD.",
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ano?: string; categoria?: string }> };

export default async function Transparencia({ searchParams }: Props) {
  const t = await carregarTextos();
  const [documentos, financas, atualizadoEm, filtros] = await Promise.all([
    listarDocumentos(),
    listarFinancas(),
    ultimaAtualizacao(),
    searchParams,
  ]);

  const anosDisponiveis = [
    ...new Set(documentos.map((d) => d.ano).filter((a): a is number => a !== null)),
  ].sort((a, b) => b - a);

  const anoAtivo = anosDisponiveis.includes(Number(filtros.ano)) ? Number(filtros.ano) : null;
  const categoriaAtiva = categoriaPorSlug(filtros.categoria ?? "")?.slug ?? null;

  const visiveis = documentos.filter(
    (d) => (!anoAtivo || d.ano === anoAtivo) && (!categoriaAtiva || d.categoria === categoriaAtiva),
  );

  const resumo = resumirPorAno(financas);

  /** Monta o endereço do filtro preservando o que já está escolhido. */
  const comFiltro = (mudanca: { ano?: number | null; categoria?: string | null }) => {
    const parametros = new URLSearchParams();
    const ano = mudanca.ano === undefined ? anoAtivo : mudanca.ano;
    const categoria = mudanca.categoria === undefined ? categoriaAtiva : mudanca.categoria;
    if (ano) parametros.set("ano", String(ano));
    if (categoria) parametros.set("categoria", categoria);
    const query = parametros.toString();
    return `/transparencia${query ? `?${query}` : ""}#documentos`;
  };

  const chip = (ativo: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      ativo ? "border-bordo bg-bordo text-white" : "border-linha bg-white hover:border-bordo hover:text-bordo"
    }`;

  return (
    <>
      <CapaPagina
        sobretitulo={t("transparencia.capa.sobretitulo")}
        titulo={t("transparencia.capa.titulo")}
        texto={t("transparencia.capa.texto")}
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-tinta-suave">
          <Icone nome="relogio" className="h-4 w-4" />
          Última atualização:{" "}
          {atualizadoEm
            ? new Date(atualizadoEm).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "nenhuma publicação até o momento"}
        </p>
      </CapaPagina>

      {/* ---------------- Receitas e despesas ---------------- */}
      <Secao fundo="branco">
        <Container>
          <TituloSecao
            sobretitulo={t("transparencia.financas.sobretitulo")}
            titulo={t("transparencia.financas.titulo")}
            texto={t("transparencia.financas.texto")}
          />
          <div className="mt-10">
            <GraficoFinancas dados={resumo} />
          </div>
        </Container>
      </Secao>

      {/* ---------------- Documentos ---------------- */}
      <Secao fundo="areia" id="documentos">
        <Container>
          <TituloSecao
            sobretitulo={t("transparencia.documentos.sobretitulo")}
            titulo={t("transparencia.documentos.titulo")}
          />

          <div className="mt-8 rounded-2xl border border-linha bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-tinta-suave">Categoria</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={comFiltro({ categoria: null })} className={chip(categoriaAtiva === null)}>
                Todas
              </Link>
              {categorias.map((categoria) => (
                <Link
                  key={categoria.slug}
                  href={comFiltro({ categoria: categoria.slug })}
                  className={chip(categoriaAtiva === categoria.slug)}
                >
                  {categoria.nome}
                </Link>
              ))}
            </div>

            {anosDisponiveis.length > 0 && (
              <>
                <p className="mt-6 text-sm font-bold uppercase tracking-wider text-tinta-suave">Ano</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={comFiltro({ ano: null })} className={chip(anoAtivo === null)}>
                    Todos
                  </Link>
                  {anosDisponiveis.map((ano) => (
                    <Link key={ano} href={comFiltro({ ano })} className={chip(anoAtivo === ano)}>
                      {ano}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {documentos.length === 0 ? (
            <Aviso titulo={t("transparencia.vazio.titulo")} tom="pendente" className="mt-8">
              {t("transparencia.vazio.texto")}
            </Aviso>
          ) : visiveis.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-tinta-suave">
              {t("transparencia.sem-filtro")}
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visiveis.map((documento) => (
                <li key={documento.id} className="flex flex-col rounded-2xl border border-linha bg-white p-6">
                  <div className="flex items-start gap-3">
                    <Icone nome="documento" className="mt-0.5 h-5 w-5 shrink-0 text-bordo" />
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug">{documento.titulo}</p>
                      <p className="mt-1 text-xs text-tinta-suave">
                        {documento.tipo}
                        {documento.ano && ` · ${documento.ano}`}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-tinta-suave">
                    Publicado em {formatarDataCurta(documento.publicado_em)}
                    {documento.tamanho_bytes ? ` · ${formatarTamanho(documento.tamanho_bytes)}` : ""}
                  </p>

                  <a
                    href={documento.arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-bordo hover:text-bordo-escuro"
                  >
                    Abrir o documento
                    <Icone nome="seta" className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* As categorias previstas, mesmo as ainda vazias: quem consulta vê o que falta. */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => {
              const quantos = documentos.filter((d) => d.categoria === categoria.slug).length;
              return (
                <div
                  key={categoria.slug}
                  className={`rounded-2xl border p-6 ${
                    quantos > 0 ? "border-linha bg-white" : "border-dashed border-tinta/20"
                  }`}
                >
                  <h3 className="font-semibold">{categoria.nome}</h3>
                  <p className="mt-1 text-sm text-tinta-suave">{categoria.descricao}</p>
                  <p
                    className={`mt-3 text-xs font-bold uppercase tracking-wide ${
                      quantos > 0 ? "text-verde-escuro" : "text-amber-700"
                    }`}
                  >
                    {quantos > 0
                      ? `${quantos} ${quantos === 1 ? "documento" : "documentos"}`
                      : "nenhum documento ainda"}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Secao>

      {/* ---------------- Limites ---------------- */}
      <Secao fundo="ardosia" compacta>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <TituloSecao
              claro
              sobretitulo={t("transparencia.limites.sobretitulo")}
              titulo={t("transparencia.limites.titulo")}
            />
            <ul className="space-y-3">
              {naoPublicamos.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <Icone nome="cadeado" className="mt-1 h-5 w-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Secao>

      <Secao fundo="creme" compacta>
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <Aviso titulo={t("transparencia.nada-inventado.titulo")} tom="protecao" className="max-w-2xl">
              {t("transparencia.nada-inventado.texto")}
            </Aviso>
            <Botao href="/contato" variante="secundario" comSeta>
              Solicitar um documento
            </Botao>
          </div>
        </Container>
      </Secao>
    </>
  );
}
