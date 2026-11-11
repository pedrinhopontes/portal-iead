import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { carregarTextos } from "@/lib/dados/textos";
import { campanhaPorAno } from "@/lib/dados/apadrinhamento";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ ano: string }> };

const rotulosRegistro = {
  facebook: "Ver álbum no Facebook",
  youtube: "Assistir no YouTube",
  instagram: "Ver no Instagram",
  pagina: "Abrir a página da campanha",
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ano } = await params;
  return {
    title: `Apadrinhamento ${ano}`,
    description: `Registros da campanha de apadrinhamento de Natal do IEAD em ${ano}.`,
  };
}

export default async function CampanhaPorAno({ params }: Props) {
  const t = await carregarTextos();
  const { ano } = await params;
  const numero = Number(ano);

  if (!Number.isInteger(numero)) notFound();

  const campanha = await campanhaPorAno(numero);
  if (!campanha || campanha.status === "rascunho") notFound();

  const vigente = campanha.status === "aberta";

  return (
    <>
      <CapaPagina
        sobretitulo={vigente ? "Campanha vigente" : "Acervo histórico"}
        titulo={campanha.titulo}
        texto={
          campanha.vinculo ??
          "Esta página guarda os registros desta edição da campanha de apadrinhamento de Natal do IEAD."
        }
      >
        <div className="flex flex-wrap gap-3">
          {vigente && (
            <Botao href="/apadrinhamento/participantes" tamanho="lg" comSeta>
              Ver os participantes
            </Botao>
          )}
          <Botao href="/apadrinhamento#historico" variante="contorno" tamanho="lg">
            Todas as campanhas
          </Botao>
        </div>
      </CapaPagina>

      <Secao fundo="branco">
        <Container>
          {campanha.registro_url && campanha.registro_tipo ? (
            <div className="rounded-2xl border border-linha bg-areia p-8">
              <Etiqueta tom="neutro">Registro original</Etiqueta>
              <h2 className="mt-4 text-2xl font-semibold">O que temos desta edição</h2>
              <p className="mt-3 text-tinta-suave">
                {t("campanha-ano.acervo.texto")}
              </p>
              <a
                href={campanha.registro_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
              >
                {rotulosRegistro[campanha.registro_tipo]}
                <Icone nome="seta" className="h-4 w-4" />
              </a>

              {campanha.observacao && (
                <Aviso titulo={t("campanha-ano.corrigir.titulo")} tom="pendente" className="mt-8">
                  {campanha.observacao}
                </Aviso>
              )}
            </div>
          ) : (
            <Aviso titulo={vigente ? "Campanha em andamento" : "Sem registro publicado"} tom="informativo">
              {vigente
                ? `Os registros de ${numero} — fotografias, vídeos e resultados — serão publicados aqui ao longo da campanha e permanecem no portal depois do encerramento.`
                : "Esta edição ainda não tem registro publicado no portal."}
            </Aviso>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Banner da campanha", "Registro da entrega", "Festa de encerramento", "Participantes e padrinhos"].map(
              (legenda, i) => (
                <Foto
                  key={legenda}
                  slot={`apadrinhamento-${numero}-${i + 1}`}
                  proporcao="4/3"
                  legenda={legenda}
                />
              ),
            )}
          </div>
        </Container>
      </Secao>
    </>
  );
}
