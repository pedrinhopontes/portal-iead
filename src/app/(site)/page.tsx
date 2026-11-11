import Link from "next/link";
import { CartaoNoticia } from "@/components/site/CartaoNoticia";
import { CartaoProjeto } from "@/components/site/CartaoProjeto";
import { Indicadores } from "@/components/site/Indicadores";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Carrossel } from "@/components/ui/Carrossel";
import { Container } from "@/components/ui/Container";
import { Foto } from "@/components/ui/Foto";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icone } from "@/components/ui/Icone";
import { SeArea } from "@/components/site/SeArea";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { campanhaVigente } from "@/lib/dados/apadrinhamento";
import {
  anoTemTexto,
  linhaDoTempo,
  listarIndicadores,
  listarNoticias,
  listarParceiros,
  listarProjetos,
} from "@/lib/dados/conteudo";
import { resolverFotos } from "@/lib/dados/fotos-do-site";
import { carregarTextos } from "@/lib/dados/textos";
import { instituto, textoQuemSomosAtual } from "@/lib/instituto";

const valoresContribuicao = ["R$ 20", "R$ 50", "R$ 80", "R$ 100", "Outro valor"];

const chavesDasFormas = [
  { titulo: "apadrinhamento.entregar.titulo", descricao: "apadrinhamento.entregar.texto" },
  { titulo: "apadrinhamento.contribuir.titulo", descricao: "apadrinhamento.contribuir.texto" },
] as const;

export default async function PaginaInicial() {
  const t = await carregarTextos();
  const [campanha, fotosDoCarrossel, projetos, noticias, anos, indicadores, parceiros] =
    await Promise.all([
      campanhaVigente(),
      resolverFotos(Array.from({ length: 12 }, (_, i) => `home-hero-${i + 1}`)),
      listarProjetos(),
      listarNoticias(),
      linhaDoTempo(),
      listarIndicadores(),
      listarParceiros(),
    ]);

  return (
    <>
      {/* ---------- Banner principal ---------- */}
      <section className="relative overflow-hidden bg-creme">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-verde/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-bordo/10 blur-3xl"
        />

        <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <Etiqueta tom="bordo">2016 — 2026 · 10 anos de história</Etiqueta>

            <h1 className="mt-6 max-w-2xl font-serif text-4xl font-semibold leading-[1.08] sm:text-5xl">
              {t("inicio.banner.titulo")}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave">
              {t("inicio.banner.texto")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <SeArea href="/projetos">
                <Botao href="/projetos" tamanho="lg" comSeta>
                  {t("inicio.botao.projetos")}
                </Botao>
              </SeArea>
              <SeArea href="/apadrinhamento">
                <Botao href="/apadrinhamento" variante="contorno" tamanho="lg">
                  {t("inicio.botao.apadrinhar")}
                </Botao>
              </SeArea>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-tinta-suave">
              <Icone nome="local" className="h-4 w-4 text-verde-escuro" />
              {instituto.endereco.completo}
            </p>
          </div>

          <div className="relative">
            <Carrossel
              fotos={fotosDoCarrossel}
              proporcao="3/2"
              legenda="Fotografias de abertura: atividades do Instituto na sede, em Guadalupe."
              className="bg-white/60"
              tamanhos="(max-width: 1024px) 100vw, 560px"
            />
            <div className="absolute -left-2 -top-4 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-bordo text-center text-white shadow-lg sm:-left-6 sm:-top-6 sm:h-28 sm:w-28">
              <span className="font-serif text-2xl font-semibold leading-none sm:text-3xl">10</span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest sm:mt-1 sm:text-[10px]">
                anos
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Apresentação e indicadores ---------- */}
      <Secao fundo="branco">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <TituloSecao
              sobretitulo={t("inicio.quem-somos.sobretitulo")}
              titulo={t("inicio.quem-somos.titulo")}
              texto={textoQuemSomosAtual}
            />
            <div className="flex flex-col justify-center gap-5">
              <Aviso titulo={t("inicio.quem-somos.aviso-titulo")} tom="pendente">
                {t("inicio.quem-somos.aviso-texto")}
              </Aviso>
              <SeArea href="/quem-somos">
                <Botao href="/quem-somos" variante="secundario" comSeta className="self-start">
                  {t("inicio.botao.quem-somos")}
                </Botao>
              </SeArea>
            </div>
          </div>

          <div className="mt-14">
            <h2 className="sr-only">Indicadores de impacto</h2>
            <Indicadores indicadores={indicadores} />
            <p className="mt-4 text-sm text-tinta-suave">
              {t("inicio.indicadores.nota")}
            </p>
          </div>
        </Container>
      </Secao>

      {/* ---------- Projetos ---------- */}
      <SeArea href="/projetos">
      <Secao fundo="areia">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <TituloSecao
              sobretitulo={t("inicio.projetos.sobretitulo")}
              titulo={t("inicio.projetos.titulo")}
              texto={t("inicio.projetos.texto")}
            />
            <Botao href="/projetos" variante="contorno" comSeta>
              {t("inicio.botao.todos-projetos")}
            </Botao>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projetos.map((projeto) => (
              <CartaoProjeto key={projeto.id} projeto={projeto} />
            ))}
          </div>
        </Container>
      </Secao>
      </SeArea>

      {/* ---------- Apadrinhamento ---------- */}
      <SeArea href="/apadrinhamento">
      <Secao fundo="bordo">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <TituloSecao
                claro
                sobretitulo={
                  campanha
                    ? t("inicio.apadrinhamento.sobretitulo-vigente")
                    : t("inicio.apadrinhamento.sobretitulo-fechada")
                }
                titulo={campanha?.titulo ?? t("inicio.apadrinhamento.titulo")}
                texto={campanha?.vinculo ?? t("inicio.apadrinhamento.texto")}
              />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {chavesDasFormas.map((forma) => (
                  <div key={forma.titulo} className="rounded-2xl bg-white/10 p-5 ring-1 ring-inset ring-white/20">
                    <p className="flex items-center gap-2 font-semibold text-white">
                      <Icone nome="presente" className="h-5 w-5" />
                      {t(forma.titulo)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{t(forma.descricao)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Botao href="/apadrinhamento" variante="claro" tamanho="lg" comSeta>
                  {t("inicio.botao.quero-apadrinhar")}
                </Botao>
                <Link
                  href="/apadrinhamento#historico"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white"
                >
                  {t("inicio.botao.campanhas-anteriores")}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-inset ring-white/20">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                <Icone nome="cadeado" className="h-5 w-5" />
                {t("inicio.protecao.titulo")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                {t("inicio.protecao.texto1")}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/85">
                {t("inicio.protecao.texto2")}
              </p>
            </div>
          </div>
        </Container>
      </Secao>
      </SeArea>

      {/* ---------- 10 anos ---------- */}
      <SeArea href="/nossa-historia">
      <Secao fundo="creme">
        <Container>
          <TituloSecao
            centralizado
            sobretitulo={t("inicio.historia.sobretitulo")}
            titulo={t("inicio.historia.titulo")}
            texto={t("inicio.historia.texto")}
          />

          <ol className="mt-12 flex flex-wrap justify-center gap-3">
            {anos.map((ano) => (
              <li key={ano.ano}>
                <Link
                  href={`/nossa-historia#ano-${ano.ano}`}
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-2xl border text-sm font-bold transition-colors ${
                    anoTemTexto(ano)
                      ? "border-bordo/30 bg-white text-bordo hover:bg-bordo hover:text-white"
                      : "border-dashed border-tinta/30 bg-transparent text-tinta-suave hover:border-tinta/50"
                  }`}
                >
                  {ano.ano}
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide">
                    {anoTemTexto(ano) ? "registrado" : "a preencher"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Botao href="/nossa-historia" tamanho="lg" comSeta>
              {t("inicio.botao.linha-do-tempo")}
            </Botao>
            <Botao href="/nossa-historia/10-anos" variante="contorno" tamanho="lg">
              {t("inicio.botao.dez-anos")}
            </Botao>
          </div>
        </Container>
      </Secao>
      </SeArea>

      {/* ---------- Filiação e contribuição mensal ---------- */}
      <SeArea href="/seja-filiado">
      <Secao fundo="branco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <TituloSecao
                sobretitulo={t("inicio.filiacao.sobretitulo")}
                titulo={t("inicio.filiacao.titulo")}
                texto={t("inicio.filiacao.texto")}
              />

              <div className="mt-8 flex flex-wrap gap-3">
                {valoresContribuicao.map((valor) => (
                  <span
                    key={valor}
                    className="rounded-xl border-2 border-linha px-5 py-3 font-semibold text-tinta transition-colors hover:border-verde-escuro hover:text-verde-escuro"
                  >
                    {valor}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Botao href="/seja-filiado" variante="secundario" tamanho="lg" comSeta>
                  {t("inicio.botao.contribuir")}
                </Botao>
                <Botao href="/apoie" variante="contorno" tamanho="lg">
                  {t("inicio.botao.doacao-unica")}
                </Botao>
              </div>
            </div>

            <Aviso titulo={t("inicio.pagamentos.aviso-titulo")} tom="demonstracao">
              <p>
                {t("inicio.pagamentos.aviso-texto1")}
              </p>
              <p className="mt-3">
                {t("inicio.pagamentos.aviso-texto2")}
              </p>
            </Aviso>
          </div>
        </Container>
      </Secao>
      </SeArea>

      {/* ---------- Notícias ---------- */}
      <SeArea href="/noticias">
      <Secao fundo="areia">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <TituloSecao
              sobretitulo={t("inicio.noticias.sobretitulo")}
              titulo={t("inicio.noticias.titulo")}
              texto={t("inicio.noticias.texto")}
            />
            <Botao href="/noticias" variante="contorno" comSeta>
              {t("inicio.botao.noticias")}
            </Botao>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {noticias.slice(0, 3).map((noticia) => (
              <CartaoNoticia key={noticia.id} noticia={noticia} />
            ))}
          </div>
        </Container>
      </Secao>
      </SeArea>

      {/* ---------- Depoimentos ---------- */}
      <Secao fundo="verde" compacta>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <TituloSecao
              claro
              sobretitulo={t("inicio.depoimentos.sobretitulo")}
              titulo={t("inicio.depoimentos.titulo")}
            />
            <div className="rounded-2xl border border-dashed border-white/40 bg-white/10 p-8">
              <p className="text-white/90">
                {t("inicio.depoimentos.texto")}
              </p>
            </div>
          </div>
        </Container>
      </Secao>

      {/* ---------- Galeria ---------- */}
      <Secao fundo="branco">
        <Container>
          <TituloSecao
            centralizado
            sobretitulo={t("inicio.galeria.sobretitulo")}
            titulo={t("inicio.galeria.titulo")}
            texto={t("inicio.galeria.texto")}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { slot: "home-galeria-1", legenda: "Aula de pintura — projeto Renascer" },
              { slot: "home-galeria-2", legenda: "Dia das mães na sede" },
              { slot: "home-galeria-3", legenda: "Oficina 5.5 — atividade de cidadania" },
              { slot: "home-galeria-4", legenda: "Aula de ballet" },
              { slot: "home-galeria-5", legenda: "Sementes II — passeio" },
              { slot: "home-galeria-6", legenda: "Aula de percussão" },
            ].map((item) => (
              <Foto key={item.slot} slot={item.slot} legenda={item.legenda} proporcao="4/3" />
            ))}
          </div>
        </Container>
      </Secao>

      {/* ---------- Parceiros ---------- */}
      <Secao fundo="creme" compacta>
        <Container>
          <TituloSecao
            centralizado
            sobretitulo={t("inicio.parceiros.sobretitulo")}
            titulo={t("inicio.parceiros.titulo")}
          />
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {parceiros.map((parceiro) => (
              <li
                key={parceiro.nome}
                className="rounded-xl border border-linha bg-white px-5 py-4 text-center"
              >
                <p className="font-semibold text-tinta">{parceiro.nome}</p>
                {parceiro.descricao && (
                  <p className="mt-0.5 max-w-[16rem] text-xs text-tinta-suave">{parceiro.descricao}</p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-tinta-suave">
            {t("inicio.parceiros.nota")}
          </p>
        </Container>
      </Secao>

      {/* ---------- Transparência ----------
          Verde, e não ardósia: o rodapé é ardósia, e duas faixas da mesma cor
          coladas viram um bloco escuro só, com o botão parecendo solto no vazio. */}
      <SeArea href="/transparencia">
      <Secao fundo="verde" compacta>
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                <Icone nome="grafico" className="h-4 w-4" />
                {t("inicio.transparencia.rotulo")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                {t("inicio.transparencia.titulo")}
              </h2>
              <p className="mt-4 text-white/80">
                {t("inicio.transparencia.texto")}
              </p>
            </div>
            <Botao href="/transparencia" variante="claro" tamanho="lg" comSeta>
              {t("inicio.botao.transparencia")}
            </Botao>
          </div>
        </Container>
      </Secao>
      </SeArea>
    </>
  );
}
