import { SeArea } from "@/components/site/SeArea";
import { carregarTextos } from "@/lib/dados/textos";
import type { ChaveDeTexto } from "@/content/textos";
import type { Metadata } from "next";
import Link from "next/link";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { configuracaoPix } from "@/lib/dados/apoio";
import { instituto } from "@/lib/instituto";
import { pixConfigurado } from "@/lib/pix";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apoie o IEAD",
  description:
    "Apoie o Instituto Educacional Araujo Dutra: contribuição mensal, doação única por PIX, apadrinhamento de Natal, voluntariado e parcerias.",
};

/** Os três caminhos de apoio. Título, texto e botão são chaves do registro de textos. */
const caminhos: { titulo: ChaveDeTexto; texto: ChaveDeTexto; href: string; cta: ChaveDeTexto; icone: NomeIcone }[] = [
  {
    titulo: "apoie.mensal.titulo",
    texto: "apoie.mensal.texto",
    href: "/seja-filiado",
    cta: "apoie.mensal.botao",
    icone: "coracao",
  },
  {
    titulo: "apoie.unica.titulo",
    texto: "apoie.unica.texto",
    href: "/seja-filiado",
    cta: "apoie.unica.botao",
    icone: "presente",
  },
  {
    titulo: "apoie.apadrinhamento.titulo",
    texto: "apoie.apadrinhamento.texto",
    href: "/apadrinhamento",
    cta: "apoie.apadrinhamento.botao",
    icone: "pessoas",
  },
];

const outrasFormas = [
  { titulo: "Voluntariado", texto: "Doar tempo e conhecimento para as turmas, oficinas e eventos." },
  { titulo: "Parceria institucional", texto: "Empresas e organizações que queiram apoiar projetos específicos." },
  { titulo: "Patrocínio de projeto", texto: "Vincular a sua marca a um projeto do Instituto." },
  { titulo: "Doação de materiais", texto: "Material escolar, de higiene, alimentos e equipamentos." },
];

export default async function Apoie() {
  const t = await carregarTextos();
  const config = await configuracaoPix();
  const pixPronto = pixConfigurado(config);

  return (
    <>
      <CapaPagina
        sobretitulo={t("apoie.capa.sobretitulo")}
        titulo={t("apoie.capa.titulo")}
        texto={t("apoie.capa.texto")}
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {caminhos.map((caminho) => (
              <article key={caminho.titulo} className="flex flex-col rounded-2xl border border-linha bg-areia p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bordo text-white">
                  <Icone nome={caminho.icone} className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-semibold">{t(caminho.titulo)}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-tinta-suave">{t(caminho.texto)}</p>
                <Link
                  href={caminho.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-bordo hover:text-bordo-escuro"
                >
                  {t(caminho.cta)}
                  <Icone nome="seta" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Secao>

      <Secao fundo="creme">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <TituloSecao
                sobretitulo={t("apoie.pix.sobretitulo")}
                titulo={t("apoie.pix.titulo")}
              />
              <p className="mt-5 leading-relaxed text-tinta-suave">
                {t("apoie.pix.texto")}
              </p>

              <div
                className={`mt-8 rounded-2xl border p-6 ${
                  pixPronto ? "border-verde bg-verde-suave" : "border-dashed border-bordo/40 bg-white"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-tinta-suave">
                  Chave PIX do IEAD
                </p>

                {pixPronto ? (
                  <>
                    <p className="mt-2 break-all font-mono text-lg font-semibold text-verde-escuro">
                      {config.chave}
                    </p>
                    <p className="mt-2 text-sm text-tinta-suave">
                      Em nome de <strong className="font-semibold text-tinta">{config.nome}</strong>.
                      {t("apoie.pix.confira")}
                    </p>
                    <SeArea href="/seja-filiado">
                      <p className="mt-3 text-sm text-tinta-suave">
                        Prefere um código pronto, com valor e identificação?{" "}
                        <Link
                          href="/seja-filiado"
                          className="font-semibold text-bordo hover:underline"
                        >
                          Gere o seu PIX aqui
                        </Link>
                        .
                      </p>
                    </SeArea>
                  </>
                ) : (
                  <>
                    <p className="mt-2 font-mono text-lg font-semibold text-tinta-suave">
                      aguardando confirmação
                    </p>
                    <p className="mt-3 text-sm text-tinta-suave">
                      {t("apoie.pix.sem-chave")}
                    </p>
                  </>
                )}

                <p className="mt-3 text-sm text-tinta-suave">
                  CNPJ do Instituto: <strong className="font-semibold text-tinta">{instituto.cnpj}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Aviso titulo={t("apoie.confirmacao.titulo")} tom="informativo">
                {t("apoie.confirmacao.texto")}
              </Aviso>

              <div className="rounded-2xl border border-linha bg-white p-7">
                <h2 className="text-xl font-semibold">Outras formas de apoiar</h2>
                <ul className="mt-5 space-y-4">
                  {outrasFormas.map((forma) => (
                    <li key={forma.titulo} className="flex gap-3">
                      <Icone nome="check" className="mt-1 h-4 w-4 shrink-0 text-verde-escuro" />
                      <div>
                        <p className="font-semibold">{forma.titulo}</p>
                        <p className="text-sm text-tinta-suave">{forma.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contato"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-verde-escuro px-6 py-3 text-sm font-bold text-white hover:bg-tinta"
                >
                  Falar com o Instituto
                  <Icone nome="seta" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
