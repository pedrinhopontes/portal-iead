import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Foto } from "@/components/ui/Foto";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { listarParceiros } from "@/lib/dados/conteudo";
import { instituto, textoQuemSomosAtual } from "@/lib/instituto";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça o Instituto Educacional Araujo Dutra: missão, atuação em Guadalupe, governança, parceiros e documentos institucionais.",
};

const valoresCitados = ["Solidariedade", "Equidade", "Justiça social", "Convivência comunitária"];

const governanca = [
  { titulo: "Equipe", descricao: "Educadores, coordenação e apoio que acompanham as turmas no dia a dia." },
  { titulo: "Diretoria", descricao: "Responsável pela condução institucional do Instituto." },
  { titulo: "Conselhos", descricao: "Instâncias de acompanhamento e fiscalização previstas no estatuto." },
];

export default async function QuemSomos() {
  const parceiros = await listarParceiros();

  return (
    <>
      <CapaPagina
        sobretitulo="Quem somos"
        titulo="Um instituto nascido e enraizado em Guadalupe"
        texto="Desde 2016, o IEAD trabalha para que a educação chegue onde ela mais transforma: perto de casa, todos os dias, com quem conhece cada família pelo nome."
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-5 text-lg leading-relaxed text-tinta-suave">
              <p>{textoQuemSomosAtual}</p>
              <p>
                O Instituto atende crianças, adolescentes, jovens, mulheres e pessoas idosas por meio de
                projetos socioeducativos, culturais e de fortalecimento de vínculos.
              </p>
              <Aviso titulo="Em revisão com o Instituto" tom="pendente">
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
            sobretitulo="Missão, visão e valores"
            titulo="O que nos move"
            texto="A missão abaixo é a que o Instituto publica hoje. Visão e valores precisam ser formalizados pela diretoria."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-linha bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-verde-escuro">Missão</p>
              <p className="mt-3 leading-relaxed text-tinta-suave">
                Através da educação, propiciar a crianças, adolescentes e idosos uma convivência comunitária
                fundamentada nos valores da solidariedade, da equidade e da justiça social, nos bairros do Rio
                de Janeiro com baixo índice de desenvolvimento humano.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed border-tinta/25 bg-transparent p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-tinta-suave">Visão</p>
              <p className="mt-3 leading-relaxed text-tinta-suave">
                Aguardando o texto oficial aprovado pela diretoria. Este espaço fica reservado e será
                preenchido pelo painel administrativo.
              </p>
            </div>

            <div className="rounded-2xl border border-linha bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-verde-escuro">Valores</p>
              <ul className="mt-3 space-y-2">
                {valoresCitados.map((valor) => (
                  <li key={valor} className="flex items-center gap-2 text-tinta-suave">
                    <Icone nome="check" className="h-4 w-4 text-verde-escuro" />
                    {valor}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-tinta-suave">
                Valores extraídos do texto institucional atual. A lista oficial precisa ser confirmada.
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
              sobretitulo="Nossa atuação"
              titulo="O papel do IEAD na comunidade de Guadalupe"
              texto="Estar no bairro muda tudo: a criança chega a pé, a família conhece a equipe e o acompanhamento não depende de transporte nem de agendamento distante."
            />
            <div className="rounded-2xl border border-dashed border-white/40 bg-white/10 p-8 text-white/90">
              <p>
                Esta seção receberá o texto sobre a presença do Instituto no território: histórico de
                ocupação do espaço, articulação com escolas e serviços públicos, e os dados do bairro que
                justificam a atuação.
              </p>
              <p className="mt-4 text-sm text-white/90">
                Aguardando o conteúdo do Instituto. Nenhum dado socioeconômico foi inserido por conta própria.
              </p>
            </div>
          </div>
        </Container>
      </Secao>

      {/* Governança */}
      <Secao fundo="branco" id="governanca">
        <Container>
          <TituloSecao
            sobretitulo="Governança"
            titulo="Equipe, diretoria e conselhos"
            texto="A composição será publicada com nome, cargo e período de mandato — somente com autorização de cada pessoa."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {governanca.map((bloco) => (
              <div key={bloco.titulo} className="rounded-2xl border border-linha bg-areia p-7">
                <p className="flex items-center gap-2 text-lg font-semibold">
                  <Icone nome="pessoas" className="h-5 w-5 text-verde-escuro" />
                  {bloco.titulo}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{bloco.descricao}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Aguardando lista autorizada
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-linha bg-areia p-7">
            <h3 className="text-lg font-semibold">Documentos institucionais</h3>
            <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
              Estatuto social, atas, documentos de regularidade e certificações ficam reunidos no Portal da
              Transparência, com filtro por ano e data da última atualização.
            </p>
            <Botao href="/transparencia" variante="secundario" comSeta className="mt-5">
              Ir para a transparência
            </Botao>
          </div>
        </Container>
      </Secao>

      {/* Parceiros */}
      <Secao fundo="creme" compacta>
        <Container>
          <TituloSecao sobretitulo="Parceiros" titulo="Redes e articulações" />
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
