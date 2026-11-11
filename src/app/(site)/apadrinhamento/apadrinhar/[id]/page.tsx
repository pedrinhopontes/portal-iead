import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioApadrinhamento } from "./FormularioApadrinhamento";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Secao } from "@/components/ui/Secao";
import {
  campanhaVigente,
  formatarValor,
  participantePorId,
  rotuloEstado,
} from "@/lib/dados/apadrinhamento";

export const metadata: Metadata = {
  title: "Apadrinhar",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function Apadrinhar({ params }: Props) {
  const { id } = await params;

  const participante = await participantePorId(id);
  if (!participante) notFound();

  const campanha = await campanhaVigente();
  const indisponivel = participante.estado !== "disponivel";
  const campanhaFechada = !campanha || campanha.status !== "aberta";

  return (
    <>
      <CapaPagina
        sobretitulo={campanha ? `Campanha ${campanha.ano}` : "Apadrinhamento"}
        titulo={`Apadrinhar ${participante.codigo_publico}`}
        texto="Preencha os seus dados para reservar. A equipe do Instituto entra em contato para combinar a entrega."
      />

      <Secao fundo="areia">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            {/* Ficha do participante */}
            <div className="rounded-2xl border border-linha bg-white p-7">
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-3xl font-semibold text-bordo">
                  {participante.codigo_publico}
                </p>
                <Etiqueta tom={indisponivel ? "neutro" : "verde"}>
                  {rotuloEstado[participante.estado]}
                </Etiqueta>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                {participante.idade !== null && (
                  <div className="flex justify-between gap-3 border-b border-linha/70 pb-2">
                    <dt className="text-tinta-suave">Idade</dt>
                    <dd className="font-semibold">{participante.idade} anos</dd>
                  </div>
                )}
                {participante.projeto && (
                  <div className="flex justify-between gap-3 border-b border-linha/70 pb-2">
                    <dt className="text-tinta-suave">Projeto</dt>
                    <dd className="font-semibold">{participante.projeto}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3 border-b border-linha/70 pb-2">
                  <dt className="text-tinta-suave">Tamanho da roupa</dt>
                  <dd className="font-semibold">{participante.tamanho_roupa ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-linha/70 pb-2">
                  <dt className="text-tinta-suave">Calçado</dt>
                  <dd className="font-semibold">{participante.tamanho_calcado ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-tinta-suave">Sugestão de presente</dt>
                  <dd className="text-right font-semibold">{participante.sugestao_presente ?? "—"}</dd>
                </div>
              </dl>

              <p className="mt-6 text-xs leading-relaxed text-tinta-suave">
                Estas são todas as informações que o Instituto divulga sobre um participante. Nome,
                endereço, escola e contato não são publicados em nenhuma hipótese.
              </p>
            </div>

            {/* Formulário */}
            <div>
              {indisponivel || campanhaFechada ? (
                <Aviso
                  titulo={
                    campanhaFechada
                      ? "Esta campanha não está recebendo apadrinhamentos"
                      : "Este participante já foi escolhido"
                  }
                  tom="pendente"
                >
                  <p>
                    {campanhaFechada
                      ? "Quando a próxima campanha abrir, a vitrine volta a aceitar reservas."
                      : "Alguém reservou antes. Mas há outros participantes esperando — escolha outro e o Natal dele também fica garantido."}
                  </p>
                  <Botao href="/apadrinhamento/participantes" variante="secundario" comSeta className="mt-5">
                    Ver quem ainda está disponível
                  </Botao>
                </Aviso>
              ) : (
                <FormularioApadrinhamento
                  participanteId={participante.id}
                  codigo={participante.codigo_publico}
                  horasReserva={campanha.horas_reserva}
                  valorContribuicao={formatarValor(campanha.valor_contribuicao)}
                />
              )}
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
