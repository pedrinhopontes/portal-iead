import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { ListaParticipantes } from "@/components/site/ListaParticipantes";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Secao } from "@/components/ui/Secao";
import { campanhaVigente, participantesDaCampanha } from "@/lib/dados/apadrinhamento";
import { carregarTextos } from "@/lib/dados/textos";

export const metadata: Metadata = {
  title: "Participantes do Apadrinhamento",
  description: "Escolha um participante da campanha de apadrinhamento de Natal do IEAD.",
  robots: { index: false },
};

// A lista muda a cada reserva: nunca servir uma versão guardada em cache.
export const dynamic = "force-dynamic";

export default async function Participantes() {
  const t = await carregarTextos();
  const campanha = await campanhaVigente();
  const participantes = campanha ? await participantesDaCampanha(campanha.id) : [];

  return (
    <>
      <CapaPagina
        sobretitulo={campanha ? `Campanha ${campanha.ano}` : "Apadrinhamento"}
        titulo={t("participantes.capa.titulo")}
        texto={t("participantes.capa.texto")}
      />

      <Secao fundo="areia">
        <Container>
          {!campanha && (
            <Aviso titulo={t("participantes.sem-campanha.titulo")} tom="informativo">
              {t("participantes.sem-campanha.texto")}
            </Aviso>
          )}

          {campanha && (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {campanha.observacao && (
                  <Aviso titulo={t("participantes.demonstracao.titulo")} tom="demonstracao">
                    {campanha.observacao}
                  </Aviso>
                )}

                <Aviso titulo={t("participantes.protecao.titulo")} tom="protecao">
                  {t("participantes.protecao.texto")}
                </Aviso>
              </div>

              <div className="mt-12">
                <ListaParticipantes
                  participantes={participantes}
                  campanhaAberta={campanha.status === "aberta"}
                />
              </div>

              <Aviso titulo={t("participantes.reserva.titulo")} tom="informativo" className="mt-12">
                Ao escolher um participante, ele sai da lista na hora e fica reservado para você por{" "}
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
