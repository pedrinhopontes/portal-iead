import type { Metadata } from "next";
import { FormularioContribuicao } from "./FormularioContribuicao";
import { FormularioFiliacao } from "./FormularioFiliacao";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
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
  const config = await configuracaoPix();
  const pixPronto = pixConfigurado(config);

  return (
    <>
      <CapaPagina
        sobretitulo="Seja um filiado"
        titulo="Faça parte de quem transforma vidas"
        texto="A contribuição mensal é o que dá previsibilidade ao Instituto: permite manter as turmas abertas, comprar material e planejar o ano inteiro sem depender de doações pontuais."
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <FormularioContribuicao />

            <div className="space-y-5">
              {!pixPronto && (
                <Aviso titulo="A chave PIX ainda não foi cadastrada" tom="pendente">
                  O formulário funciona e registra a sua contribuição, mas o código PIX só é gerado depois
                  que o Instituto cadastrar a chave no painel. Nenhuma chave foi colocada por suposição —
                  publicar uma chave errada desviaria doações.
                </Aviso>
              )}

              <div className="rounded-2xl border border-linha bg-areia p-6">
                <p className="flex items-center gap-2 font-semibold">
                  <Icone nome="coracao" className="h-5 w-5 text-verde-escuro" />
                  Por que PIX, e não cartão
                </p>
                <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                  O PIX cai direto na conta do Instituto, sem intermediário e sem taxa por transação. Numa
                  doação de R$ 50, a diferença entre receber R$ 50 e receber R$ 47 não é pequena quando o
                  orçamento é o de uma organização social.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                  A contrapartida: o PIX não cobra sozinho. A contribuição mensal, nesta fase, é um
                  compromisso que você repete a cada mês — e que o Instituto acompanha. A cobrança
                  automática depende de integração bancária, prevista para a fase seguinte.
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
              sobretitulo="Atenção"
              titulo="Apoiar financeiramente não é o mesmo que ser associado"
              texto="A filiação associativa envolve direitos previstos no estatuto, regras próprias e aprovação administrativa. Por isso ela tem um fluxo separado do apoio financeiro, e um não leva ao outro."
            />
            <FormularioFiliacao />
          </div>
        </Container>
      </Secao>
    </>
  );
}
