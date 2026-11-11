import type { Metadata } from "next";
import Link from "next/link";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import {
  campanhaVigente,
  campanhasAnteriores,
  formatarPrazo,
  formatarValor,
} from "@/lib/dados/apadrinhamento";
import { carregarTextos } from "@/lib/dados/textos";

export const metadata: Metadata = {
  title: "Apadrinhamento de Natal",
  description:
    "Apadrinhe uma criança ou adolescente do IEAD neste Natal. Conheça a campanha, as formas de participar e o histórico das campanhas anteriores.",
};

export const dynamic = "force-dynamic";

const passos = [
  "Veja os participantes disponíveis na lista da campanha.",
  "Escolha um participante e faça a reserva.",
  "Consulte os tamanhos e a sugestão de presente.",
  "Decida entre entregar o presente ou contribuir financeiramente.",
  "Preencha o formulário de contato.",
  "Confirme a solicitação de apadrinhamento.",
  "Receba a confirmação e as orientações de entrega.",
];

const rotulosRegistro = {
  facebook: "Ver álbum no Facebook",
  youtube: "Assistir no YouTube",
  instagram: "Ver no Instagram",
  pagina: "Abrir a página da campanha",
} as const;

export default async function Apadrinhamento() {
  const t = await carregarTextos();
  const campanha = await campanhaVigente();
  const anteriores = await campanhasAnteriores();

  const valor = formatarValor(campanha?.valor_contribuicao ?? null);

  return (
    <>
      <CapaPagina
        sobretitulo={campanha ? `Campanha ${campanha.ano}` : "Apadrinhamento de Natal"}
        titulo={campanha?.titulo ?? "Apadrinhamento de Natal"}
        texto={campanha?.vinculo ?? "O apadrinhamento de Natal do IEAD acontece todos os anos desde 2018."}
      >
        {campanha && (
          <div className="flex flex-wrap gap-3">
            <Botao href="/apadrinhamento/participantes" tamanho="lg" comSeta>
              Ver os participantes
            </Botao>
            <Botao href="#como-participar" variante="contorno" tamanho="lg">
              Como funciona
            </Botao>
          </div>
        )}
      </CapaPagina>

      {!campanha && (
        <Secao fundo="areia" compacta>
          <Container>
            <Aviso titulo={t("apadrinhamento.sem-campanha.titulo")} tom="informativo">
              {t("apadrinhamento.sem-campanha.texto")}
            </Aviso>
          </Container>
        </Secao>
      )}

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <TituloSecao
                sobretitulo={t("apadrinhamento.o-que-e.sobretitulo")}
                titulo={t("apadrinhamento.o-que-e.titulo")}
                texto={campanha?.descricao ?? t("apadrinhamento.o-que-e.texto")}
              />
              <p className="mt-6 leading-relaxed text-tinta-suave">
                {t("apadrinhamento.o-que-e.paragrafo")}
              </p>
            </div>
            <Foto
              slot="apadrinhamento-capa"
              proporcao="3/2"
              legenda="Entrega dos presentes na festa de encerramento de uma campanha anterior."
              tamanhos="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </Container>
      </Secao>

      {campanha && (
        <>
          <Secao fundo="areia" id="como-participar">
            <Container>
              <TituloSecao
                sobretitulo={t("apadrinhamento.como-participar.sobretitulo")}
                titulo={t("apadrinhamento.como-participar.titulo")}
              />

              <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {passos.map((passo, i) => (
                  <li key={passo} className="rounded-2xl border border-linha bg-white p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bordo font-serif text-lg font-semibold text-white">
                      {i + 1}
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-tinta-suave">{passo}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-linha bg-white p-7">
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <Icone nome="presente" className="h-5 w-5 text-bordo" />
                    {t("apadrinhamento.entregar.titulo")}
                  </p>
                  <p className="mt-3 leading-relaxed text-tinta-suave">
                    {t("apadrinhamento.entregar.texto")}
                  </p>
                </div>

                <div className="rounded-2xl border border-linha bg-white p-7">
                  <p className="flex items-center gap-2 text-lg font-semibold">
                    <Icone nome="coracao" className="h-5 w-5 text-bordo" />
                    {t("apadrinhamento.contribuir.titulo")}
                  </p>
                  <p className="mt-3 leading-relaxed text-tinta-suave">
                    {t("apadrinhamento.contribuir.texto")}
                  </p>
                  <p className="mt-4 rounded-xl bg-areia p-4 text-sm text-tinta-suave">
                    {valor
                      ? `Valor da contribuição em ${campanha.ano}: ${valor}.`
                      : `O valor da contribuição em ${campanha.ano} ainda será confirmado pelo Instituto.`}
                  </p>
                </div>
              </div>
            </Container>
          </Secao>

          <Secao fundo="creme">
            <Container>
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <TituloSecao
                    sobretitulo={t("apadrinhamento.encerramento.sobretitulo")}
                    titulo={t("apadrinhamento.encerramento.titulo")}
                  />
                  {/* O ícone fica dentro do <dt>: uma lista de definição só aceita
                      dt e dd dentro do div que os agrupa, e um div extra no meio
                      quebra a semântica para quem usa leitor de tela. */}
                  <dl className="mt-8 space-y-4">
                    <div>
                      <dt className="flex items-center gap-2 font-semibold">
                        <Icone nome="relogio" className="h-5 w-5 shrink-0 text-bordo" />
                        Prazo de entrega dos presentes
                      </dt>
                      <dd className="mt-1 pl-7 text-tinta-suave">
                        {formatarPrazo(campanha.prazo_entrega) ?? "A confirmar"}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 font-semibold">
                        <Icone nome="coracao" className="h-5 w-5 shrink-0 text-bordo" />
                        Data do evento
                      </dt>
                      <dd className="mt-1 pl-7 text-tinta-suave">
                        {formatarPrazo(campanha.data_evento) ?? "A confirmar"}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 font-semibold">
                        <Icone nome="local" className="h-5 w-5 shrink-0 text-bordo" />
                        Local
                      </dt>
                      <dd className="mt-1 pl-7 text-tinta-suave">
                        {campanha.local_evento ?? "A confirmar"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {!campanha.prazo_entrega && (
                  <Aviso titulo={`Datas de ${campanha.ano} ainda não definidas`} tom="pendente">
                    Em 2025, o prazo de entrega foi 15 de dezembro às 17h30, na sede do Instituto, e a
                    festa aconteceu em 19 de dezembro às 19h30. As datas desta campanha aparecem aqui
                    assim que forem cadastradas no painel — nenhuma data foi copiada do ano anterior.
                  </Aviso>
                )}
              </div>
            </Container>
          </Secao>
        </>
      )}

      <Secao fundo="bordo" compacta>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <TituloSecao
              claro
              sobretitulo={t("apadrinhamento.protecao.sobretitulo")}
              titulo={t("apadrinhamento.protecao.titulo")}
            />
            <div className="space-y-3 text-white/85">
              <p className="flex gap-3">
                <Icone nome="cadeado" className="mt-1 h-5 w-5 shrink-0" />
                {t("apadrinhamento.protecao.item1")}
              </p>
              <p className="flex gap-3">
                <Icone nome="cadeado" className="mt-1 h-5 w-5 shrink-0" />
                {t("apadrinhamento.protecao.item2")}
              </p>
              <p className="flex gap-3">
                <Icone nome="cadeado" className="mt-1 h-5 w-5 shrink-0" />
                {t("apadrinhamento.protecao.item3")}
              </p>
            </div>
          </div>
        </Container>
      </Secao>

      <Secao fundo="branco" id="historico">
        <Container>
          <TituloSecao
            sobretitulo={t("apadrinhamento.historico.sobretitulo")}
            titulo={t("apadrinhamento.historico.titulo")}
            texto={t("apadrinhamento.historico.texto")}
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campanha && (
              <li className="rounded-2xl border-2 border-bordo bg-bordo-suave p-6">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-bordo">{campanha.ano}</span>
                  <Etiqueta tom="bordo">Campanha vigente</Etiqueta>
                </div>
                <p className="mt-3 text-sm text-tinta-suave">{campanha.titulo}</p>
                <Link
                  href={`/apadrinhamento/${campanha.ano}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-bordo hover:text-bordo-escuro"
                >
                  Ver a campanha
                  <Icone nome="seta" className="h-4 w-4" />
                </Link>
              </li>
            )}

            {anteriores.map((anterior) => (
              <li key={anterior.id} className="rounded-2xl border border-linha bg-areia p-6">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-tinta">{anterior.ano}</span>
                  {anterior.registro_tipo && (
                    <Etiqueta tom="neutro">{rotulosRegistro[anterior.registro_tipo]}</Etiqueta>
                  )}
                </div>
                {anterior.observacao && (
                  <p className="mt-3 text-xs leading-relaxed text-amber-700">{anterior.observacao}</p>
                )}
                <Link
                  href={`/apadrinhamento/${anterior.ano}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-bordo hover:text-bordo-escuro"
                >
                  Ver os registros
                  <Icone nome="seta" className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Secao>

      {campanha && (
        <Secao fundo="verde" compacta>
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold text-white">Pronto para apadrinhar?</h2>
                <p className="mt-3 text-white/85">
                  Escolha um participante e garanta que o Natal dele tenha um presente com o seu nome.
                </p>
              </div>
              <Botao href="/apadrinhamento/participantes" variante="claro" tamanho="lg" comSeta>
                Ver os participantes
              </Botao>
            </div>
          </Container>
        </Secao>
      )}
    </>
  );
}
