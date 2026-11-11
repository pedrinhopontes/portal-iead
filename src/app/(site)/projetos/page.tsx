import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { CartaoProjeto } from "@/components/site/CartaoProjeto";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { listarProjetos } from "@/lib/dados/conteudo";

export const metadata: Metadata = {
  title: "Nossos Projetos",
  description:
    "Sementes I e II, Oficina 5.5, Renascer, Pré-Vestibular Libertas e Inglês Social: os projetos socioeducativos do IEAD em Guadalupe.",
};

export const dynamic = "force-dynamic";

/**
 * Frentes que aparecem no site atual (Canva) e não constavam do briefing.
 * Ficam aqui como lembrete até o Instituto definir o que acontece com elas.
 */
const frentesAConfirmar = [
  { nome: "Liberta-se", descricao: "Alfabetização de adultos" },
  {
    nome: "EASIP – Mulheres",
    descricao: "Inserção de mulheres jovens moradoras de favelas no mercado de trabalho",
  },
  { nome: "Cursos", descricao: "Inglês, informática e preparatório para o ENCCEJA" },
];

export default async function Projetos() {
  const projetos = await listarProjetos();

  return (
    <>
      <CapaPagina
        sobretitulo="Nossos projetos"
        titulo="Da primeira infância à universidade"
        texto="Cada projeto tem público, objetivos e atividades próprias — e uma página com fotografias, relatórios, notícias e formas de colaborar."
      />

      <Secao fundo="areia">
        <Container>
          {projetos.length === 0 ? (
            <Aviso titulo="Nenhum projeto publicado" tom="informativo">
              Os projetos cadastrados no painel aparecem aqui assim que forem publicados.
            </Aviso>
          ) : (
            <>
              {/* Cada cartão é um h3; sem este h2 a hierarquia pularia do h1 da
                  capa direto para o h3, e quem navega por títulos se perde. */}
              <h2 className="sr-only">Projetos do Instituto</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projetos.map((projeto) => (
                  <CartaoProjeto key={projeto.id} projeto={projeto} />
                ))}
              </div>
            </>
          )}

          <Aviso titulo="As descrições são iniciais" tom="pendente" className="mt-10">
            Conforme o briefing, os textos acima são um ponto de partida e devem ser revisados com a equipe
            de cada projeto. As faixas etárias divergem entre o site atual e o briefing e estão sinalizadas
            dentro de cada página.
          </Aviso>
        </Container>
      </Secao>

      <Secao fundo="branco">
        <Container>
          <TituloSecao
            sobretitulo="A confirmar"
            titulo="Frentes que aparecem no site atual"
            texto="Estas iniciativas estão publicadas hoje em iearaujodutra.com.br, mas não constavam do briefing. Precisam de definição: seguem ativas, mudaram de nome ou saem do ar?"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {frentesAConfirmar.map((frente) => (
              <li key={frente.nome} className="rounded-xl border border-dashed border-tinta/25 px-5 py-4">
                <p className="font-semibold">{frente.nome}</p>
                <p className="mt-1 text-sm text-tinta-suave">{frente.descricao}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Secao>
    </>
  );
}
