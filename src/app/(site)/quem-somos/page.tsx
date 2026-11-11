import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { SeArea } from "@/components/site/SeArea";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Foto } from "@/components/ui/Foto";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { listarParceiros } from "@/lib/dados/conteudo";
import { carregarTextos } from "@/lib/dados/textos";
import { instituto, textoQuemSomosAtual } from "@/lib/instituto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça o Instituto Educacional Araujo Dutra: missão, atuação em Guadalupe, governança, parceiros e documentos institucionais.",
};

const valoresCitados = ["Solidariedade", "Equidade", "Justiça social", "Convivência comunitária"];

const chavesDaGovernanca = [
  { titulo: "quem-somos.governanca.equipe.titulo", descricao: "quem-somos.governanca.equipe.texto" },
  { titulo: "quem-somos.governanca.diretoria.titulo", descricao: "quem-somos.governanca.diretoria.texto" },
  { titulo: "quem-somos.governanca.conselhos.titulo", descricao: "quem-somos.governanca.conselhos.texto" },
] as const;

export default async function QuemSomos() {
  const t = await carregarTextos();
  const parceiros = await listarParceiros();

  return (
    <>
      <CapaPagina
        sobretitulo={t("quem-somos.capa.sobretitulo")}
        titulo={t("quem-somos.capa.titulo")}
        texto={t("quem-somos.capa.texto")}
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-5 text-lg leading-relaxed text-tinta-suave">
              <p>{textoQuemSomosAtual}</p>
              <p>
                {t("quem-somos.intro.paragrafo")}
              </p>
              <Aviso titulo={t("quem-somos.aviso-revisao.titulo")} tom="pendente">
                A história completa do IEAD, a descrição da sua qualificação jurídica e a razão social
                registrada precisam ser confirmadas. O site atual publica &quot;
                {instituto.razaoSocialNoSiteAtual}&quot;, enquanto a marca usa &quot;Instituto&quot;.
              </Aviso>
            </div>

            <Foto
              slot="quem-somos-sede"
              proporcao="3/4"
              legenda="Fachada da sede ou foto de equipe do Instituto, em Guadalupe."
              tamanhos="(max-width: 1024px) 100vw, 460px"
            />
          </div>
        </Container>
      </Secao>

      {/* Missão, visão e valores */}
      <Secao fundo="areia" id="missao">
        <Container>
          <TituloSecao
            sobretitulo={t("quem-somos.missao.sobretitulo")}
            titulo={t("quem-somos.missao.titulo")}
            texto={t("quem-somos.missao.texto")}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-linha bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-verde-escuro">
                {t("quem-somos.missao.rotulo")}
              </p>
              <p className="mt-3 leading-relaxed text-tinta-suave">
                {t("quem-somos.missao.conteudo")}
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-tinta/25 bg-transparent p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-tinta-suave">
                {t("quem-somos.visao.rotulo")}
              </p>
              <p className="mt-3 leading-relaxed text-tinta-suave">
                {t("quem-somos.visao.conteudo")}
              </p>
            </div>

            <div className="rounded-2xl border border-linha bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-verde-escuro">
                {t("quem-somos.valores.rotulo")}
              </p>
              <ul className="mt-3 space-y-2">
                {valoresCitados.map((valor) => (
                  <li key={valor} className="flex items-center gap-2 text-tinta-suave">
                    <Icone nome="check" className="h-4 w-4 text-verde-escuro" />
                    {valor}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-tinta-suave">
                {t("quem-somos.valores.nota")}
              </p>
            </div>
          </div>
        </Container>
      </Secao>

      {/* Guadalupe */}
      <Secao fundo="verde" id="guadalupe">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <TituloSecao
              claro
              sobretitulo={t("quem-somos.atuacao.sobretitulo")}
              titulo={t("quem-somos.atuacao.titulo")}
              texto={t("quem-somos.atuacao.texto")}
            />
            <div className="rounded-2xl border border-dashed border-white/40 bg-white/10 p-8 text-white/90">
              <p>
                {t("quem-somos.atuacao.paragrafo")}
              </p>
              <p className="mt-4 text-sm text-white/90">
                {t("quem-somos.atuacao.nota")}
              </p>
            </div>
          </div>
        </Container>
      </Secao>

      {/* Governança */}
      <Secao fundo="branco" id="governanca">
        <Container>
          <TituloSecao
            sobretitulo={t("quem-somos.governanca.sobretitulo")}
            titulo={t("quem-somos.governanca.titulo")}
            texto={t("quem-somos.governanca.texto")}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {chavesDaGovernanca.map((bloco) => (
              <div key={bloco.titulo} className="rounded-2xl border border-linha bg-areia p-7">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icone nome="pessoas" className="h-5 w-5 text-verde-escuro" />
                  {t(bloco.titulo)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{t(bloco.descricao)}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {t("quem-somos.governanca.aguardando")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-linha bg-areia p-7">
            <h3 className="text-lg font-semibold">{t("quem-somos.documentos.titulo")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
              {t("quem-somos.documentos.texto")}
            </p>
            <SeArea href="/transparencia">
              <Botao href="/transparencia" variante="secundario" comSeta className="mt-5">
                {t("quem-somos.documentos.botao")}
              </Botao>
            </SeArea>
          </div>
        </Container>
      </Secao>

      {/* Parceiros */}
      <Secao fundo="creme" compacta>
        <Container>
          <TituloSecao
            sobretitulo={t("quem-somos.parceiros.sobretitulo")}
            titulo={t("quem-somos.parceiros.titulo")}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parceiros.map((parceiro) => (
              <li key={parceiro.nome} className="rounded-xl border border-linha bg-white px-5 py-4">
                <p className="font-semibold">{parceiro.nome}</p>
                {parceiro.descricao && (
                  <p className="mt-1 text-sm text-tinta-suave">{parceiro.descricao}</p>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </Secao>
    </>
  );
}
