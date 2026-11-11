import { SeArea } from "@/components/site/SeArea";
import type { Metadata } from "next";
import Link from "next/link";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone, type NomeIcone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
import { configuracaoPix } from "@/lib/dados/apoio";
import { instituto } from "@/lib/instituto";
import { pixConfigurado } from "@/lib/pix";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apoie o IEAD",
  description:
    "Apoie o Instituto Educacional Araujo Dutra: contribuição mensal, doação única por PIX, apadrinhamento de Natal, voluntariado e parcerias.",
};

const caminhos: { titulo: string; texto: string; href: string; cta: string; icone: NomeIcone }[] = [
  {
    titulo: "Contribuição mensal",
    texto:
      "A forma que mais ajuda: permite ao Instituto planejar o ano, manter as turmas e comprar material com antecedência.",
    href: "/seja-filiado",
    cta: "Quero contribuir todo mês",
    icone: "coracao",
  },
  {
    titulo: "Doação única",
    texto:
      "Uma contribuição pontual, no valor que você escolher, direto na conta do Instituto por PIX — sem taxa, o valor chega inteiro.",
    href: "/seja-filiado",
    cta: "Fazer uma doação",
    icone: "presente",
  },
  {
    titulo: "Apadrinhamento de Natal",
    texto:
      "Escolha um participante, prepare o presente e entregue na festa de encerramento do ano. Um presente com nome e com história.",
    href: "/apadrinhamento",
    cta: "Apadrinhe neste Natal",
    icone: "pessoas",
  },
];

const outrasFormas = [
  { titulo: "Voluntariado", texto: "Doar tempo e conhecimento para as turmas, oficinas e eventos." },
  { titulo: "Parceria institucional", texto: "Empresas e organizações que queiram apoiar projetos específicos." },
  { titulo: "Patrocínio de projeto", texto: "Vincular a sua marca a um projeto do Instituto." },
  { titulo: "Doação de materiais", texto: "Material escolar, de higiene, alimentos e equipamentos." },
];

export default async function Apoie() {
  const config = await configuracaoPix();
  const pixPronto = pixConfigurado(config);

  return (
    <>
      <CapaPagina
        sobretitulo="Apoie o IEAD"
        titulo="Há mais de um jeito de fazer parte"
        texto="Escolha a forma que combina com você. Toda contribuição vira atividade, material e acompanhamento para crianças, adolescentes, mulheres e pessoas idosas de Guadalupe."
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {caminhos.map((caminho) => (
              <article key={caminho.titulo} className="flex flex-col rounded-2xl border border-linha bg-areia p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bordo text-white">
                  <Icone nome={caminho.icone} className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-xl font-semibold">{caminho.titulo}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-tinta-suave">{caminho.texto}</p>
                <Link
                  href={caminho.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-bordo hover:text-bordo-escuro"
                >
                  {caminho.cta}
                  <Icone nome="seta" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Secao>

      <Secao fundo="creme">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <TituloSecao sobretitulo="PIX" titulo="Doação direta, sem taxa" />
              <p className="mt-5 leading-relaxed text-tinta-suave">
                O PIX cai direto na conta do Instituto, sem intermediário e sem taxa por transação. É por isso
                que ele é a primeira forma de pagamento do portal: o valor doado chega inteiro.
              </p>

              <div
                className={`mt-8 rounded-2xl border p-6 ${
                  pixPronto ? "border-verde bg-verde-suave" : "border-dashed border-bordo/40 bg-white"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-tinta-suave">
                  Chave PIX do IEAD
                </p>

                {pixPronto ? (
                  <>
                    <p className="mt-2 break-all font-mono text-lg font-semibold text-verde-escuro">
                      {config.chave}
                    </p>
                    <p className="mt-2 text-sm text-tinta-suave">
                      Em nome de <strong className="font-semibold text-tinta">{config.nome}</strong>.
                      Confira o nome no seu aplicativo antes de confirmar — é assim que você sabe que o
                      dinheiro vai para o Instituto.
                    </p>
                    <SeArea href="/seja-filiado">
                      <p className="mt-3 text-sm text-tinta-suave">
                        Prefere um código pronto, com valor e identificação?{" "}
                        <Link
                          href="/seja-filiado"
                          className="font-semibold text-bordo hover:underline"
                        >
                          Gere o seu PIX aqui
                        </Link>
                        .
                      </p>
                    </SeArea>
                  </>
                ) : (
                  <>
                    <p className="mt-2 font-mono text-lg font-semibold text-tinta-suave">
                      aguardando confirmação
                    </p>
                    <p className="mt-3 text-sm text-tinta-suave">
                      A chave oficial será publicada aqui depois de cadastrada no painel pelo Instituto.
                      Nenhuma chave foi inserida por suposição — publicar uma chave errada desviaria
                      doações.
                    </p>
                  </>
                )}

                <p className="mt-3 text-sm text-tinta-suave">
                  CNPJ do Instituto: <strong className="font-semibold text-tinta">{instituto.cnpj}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Aviso titulo="Como a confirmação funciona" tom="informativo">
                O PIX cai direto na conta do Instituto, sem intermediário. Como não há integração
                bancária ainda, a baixa é feita por uma pessoa do financeiro conferindo o extrato — por
                isso cada doação recebe uma referência própria, que aparece no pagamento.
              </Aviso>

              <div className="rounded-2xl border border-linha bg-white p-7">
                <h2 className="text-xl font-semibold">Outras formas de apoiar</h2>
                <ul className="mt-5 space-y-4">
                  {outrasFormas.map((forma) => (
                    <li key={forma.titulo} className="flex gap-3">
                      <Icone nome="check" className="mt-1 h-4 w-4 shrink-0 text-verde-escuro" />
                      <div>
                        <p className="font-semibold">{forma.titulo}</p>
                        <p className="text-sm text-tinta-suave">{forma.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contato"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-verde-escuro px-6 py-3 text-sm font-bold text-white hover:bg-tinta"
                >
                  Falar com o Instituto
                  <Icone nome="seta" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
