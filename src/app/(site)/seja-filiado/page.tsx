import type { Metadata } from "next";
import { FormularioContribuicao } from "./FormularioContribuicao";
import { FormularioFiliacao } from "./FormularioFiliacao";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { carregarTextos } from "@/lib/dados/textos";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { configuracaoPix } from "@/lib/dados/apoio";
import { pixConfigurado } from "@/lib/pix";

export const metadata: Metadata = {
  title: "Seja um Filiado",
  description:
    "Torne-se apoiador mensal do Instituto Educacional Araujo Dutra e ajude a manter os projetos socioeducativos funcionando o ano inteiro.",
};

export const dynamic = "force-dynamic";

const recursosDoApoiador = [
  "Escolher o valor e a frequência",
  "Pagar por PIX, sem taxa e sem intermediário",
  "Receber a referência da contribuição na hora",
  "Falar direto com o Instituto pelo WhatsApp",
  "Pedir o comprovante quando precisar",
  "Cancelar quando quiser, sem burocracia",
];

export default async function SejaFiliado() {
  const t = await carregarTextos();
  const config = await configuracaoPix();
  const pixPronto = pixConfigurado(config);

  return (
    <>
      <CapaPagina
        sobretitulo={t("filiado.capa.sobretitulo")}
        titulo={t("filiado.capa.titulo")}
        texto={t("filiado.capa.texto")}
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <FormularioContribuicao />

            <div className="space-y-5">
              {!pixPronto && (
                <Aviso titulo={t("filiado.sem-pix.titulo")} tom="pendente">
                  {t("filiado.sem-pix.texto")}
                </Aviso>
              )}

              <div className="rounded-2xl border border-linha bg-areia p-6">
                <p className="flex items-center gap-2 font-semibold">
                  <Icone nome="coracao" className="h-5 w-5 text-verde-escuro" />
                  Por que PIX, e não cartão
                </p>
                <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                  {t("filiado.pix.vantagem")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                  {t("filiado.pix.contrapartida")}
                </p>
              </div>

              <div className="rounded-2xl border border-linha bg-white p-6">
                <h2 className="font-semibold">O que você pode fazer</h2>
                <ul className="mt-4 space-y-2.5">
                  {recursosDoApoiador.map((recurso) => (
                    <li key={recurso} className="flex items-start gap-2.5 text-sm text-tinta-suave">
                      <Icone nome="check" className="mt-0.5 h-4 w-4 shrink-0 text-verde-escuro" />
                      {recurso}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Secao>

      <Secao fundo="areia">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <TituloSecao
              sobretitulo={t("filiado.associacao.sobretitulo")}
              titulo={t("filiado.associacao.titulo")}
              texto={t("filiado.associacao.texto")}
            />
            <FormularioFiliacao />
          </div>
        </Container>
      </Secao>
    </>
  );
}
