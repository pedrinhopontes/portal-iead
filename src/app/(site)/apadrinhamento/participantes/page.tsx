import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { ListaParticipantes } from "@/components/site/ListaParticipantes";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Secao } from "@/components/ui/Secao";
import { campanhaVigente, participantesDaCampanha } from "@/lib/dados/apadrinhamento";

export const metadata: Metadata = {
  title: "Participantes do Apadrinhamento",
  description: "Escolha um participante da campanha de apadrinhamento de Natal do IEAD.",
  robots: { index: false },
};

// A vitrine muda a cada reserva: nunca servir uma versão guardada em cache.
export const dynamic = "force-dynamic";

export default async function Participantes() {
  const campanha = await campanhaVigente();
  const participantes = campanha ? await participantesDaCampanha(campanha.id) : [];

  return (
    <>
      <CapaPagina
        sobretitulo={campanha ? `Campanha ${campanha.ano}` : "Apadrinhamento"}
        titulo="Escolha um participante"
        texto="Cada participante é identificado por um código. Você verá apenas a idade, os tamanhos e a sugestão de presente — o suficiente para escolher bem, sem expor nenhuma criança."
      />

      <Secao fundo="areia">
        <Container>
          {!campanha && (
            <Aviso titulo="Nenhuma campanha aberta no momento" tom="informativo">
              Quando a próxima campanha de apadrinhamento for aberta pelo Instituto, os participantes
              aparecem aqui.
            </Aviso>
          )}

          {campanha && (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {campanha.observacao && (
                  <Aviso titulo="Lista de demonstração" tom="demonstracao">
                    {campanha.observacao}
                  </Aviso>
                )}

                <Aviso titulo="O que nunca aparece nesta página" tom="protecao">
                  Nome completo, endereço, escola, nome dos responsáveis e qualquer contato pessoal ficam
                  em tabela separada do banco de dados, acessível apenas à coordenação. Fotografias só
                  são publicadas com autorização registrada dos responsáveis.
                </Aviso>
              </div>

              <div className="mt-12">
                <ListaParticipantes
                  participantes={participantes}
                  campanhaAberta={campanha.status === "aberta"}
                />
              </div>

              <Aviso titulo="Como funciona a reserva" tom="informativo" className="mt-12">
                Ao escolher um participante, ele sai da vitrine na hora e fica reservado para você por{" "}
                {campanha.horas_reserva} horas. Nesse prazo, a equipe do Instituto entra em contato para
                confirmar. Se a confirmação não acontecer, a reserva vence sozinha e o participante volta
                para a lista — ninguém fica esperando indefinidamente.
              </Aviso>

              <div className="mt-8 flex justify-center">
                <Botao href="/apadrinhamento" variante="contorno">
                  Voltar para a campanha
                </Botao>
              </div>
            </>
          )}
        </Container>
      </Secao>
    </>
  );
}
