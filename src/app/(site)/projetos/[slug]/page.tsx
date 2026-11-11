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
import { TituloSecao } from "@/components/ui/TituloSecao";
import { projetoPorSlug } from "@/lib/dados/conteudo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projeto = await projetoPorSlug(slug);
  if (!projeto) return { title: "Projeto não encontrado" };
  return { title: projeto.nome, description: projeto.resumo ?? undefined };
}

export default async function PaginaProjeto({ params }: Props) {
  const { slug } = await params;
  const projeto = await projetoPorSlug(slug);

  if (!projeto) notFound();

  return (
    <>
      <CapaPagina
        sobretitulo={projeto.chamada ?? undefined}
        titulo={projeto.nome}
        texto={projeto.resumo ?? undefined}
      >
        <div className="flex flex-wrap gap-2">
          {projeto.publico && <Etiqueta tom="bordo">{projeto.publico}</Etiqueta>}
          {projeto.faixa_etaria && <Etiqueta tom="verde">{projeto.faixa_etaria}</Etiqueta>}
        </div>
      </CapaPagina>

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              {projeto.objetivos.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold">Objetivos</h2>
                  <ul className="mt-4 space-y-3">
                    {projeto.objetivos.map((objetivo) => (
                      <li key={objetivo} className="flex gap-3 text-tinta-suave">
                        <Icone nome="check" className="mt-1 h-4 w-4 shrink-0 text-verde-escuro" />
                        {objetivo}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {projeto.atividades.length > 0 && (
                <>
                  <h2 className="mt-10 text-2xl font-semibold">Atividades</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {projeto.atividades.map((atividade) => (
                      <li
                        key={atividade}
                        className="rounded-full border border-linha bg-areia px-4 py-2 text-sm"
                      >
                        {atividade}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {projeto.observacao && (
                <Aviso titulo="Informação a confirmar" tom="pendente" className="mt-10">
                  {projeto.observacao}
                </Aviso>
              )}
            </div>

            <div className="space-y-4">
              <Foto
                slot={`projeto-${projeto.slug}-capa`}
                proporcao="4/3"
                legenda={`Atividade do projeto ${projeto.nome}`}
                tamanhos="(max-width: 1024px) 100vw, 480px"
              />
              <div className="grid grid-cols-2 gap-4">
                <Foto slot={`projeto-${projeto.slug}-1`} proporcao="1/1" legenda="Registro da turma" />
                <Foto slot={`projeto-${projeto.slug}-2`} proporcao="1/1" legenda="Material produzido" />
              </div>
            </div>
          </div>
        </Container>
      </Secao>

      <Secao fundo="areia">
        <Container>
          <TituloSecao
            sobretitulo="Acervo do projeto"
            titulo="O que esta página vai reunir"
            texto="Cada projeto terá um acervo próprio, alimentado pelo painel administrativo pelo coordenador responsável."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { nome: "Fotografias e vídeos", icone: "camera" as const },
              { nome: "Relatórios de atividades", icone: "documento" as const },
              { nome: "Notícias relacionadas", icone: "documento" as const },
              { nome: "Calendário", icone: "relogio" as const },
              { nome: "Resultados", icone: "grafico" as const },
              { nome: "Materiais institucionais", icone: "documento" as const },
            ].map((item) => (
              <div
                key={item.nome}
                className="flex items-center gap-3 rounded-xl border border-dashed border-tinta/20 bg-white/60 px-5 py-4"
              >
                <Icone nome={item.icone} className="h-5 w-5 text-verde-escuro" />
                <div>
                  <p className="text-sm font-semibold">{item.nome}</p>
                  <p className="text-xs text-tinta-suave">Aguardando cadastro</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Secao>

      <Secao fundo="bordo" compacta>
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-white">Como colaborar com o {projeto.nome}</h2>
              <p className="mt-3 text-white/85">
                Você pode apoiar com contribuição mensal, doação pontual, voluntariado ou parceria
                institucional.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Botao href="/seja-filiado" variante="claro" comSeta>
                Apoiar todo mês
              </Botao>
              <Botao
                href="/contato"
                variante="contorno"
                className="border-white/50 text-white hover:border-white hover:text-white"
              >
                Falar com o Instituto
              </Botao>
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
