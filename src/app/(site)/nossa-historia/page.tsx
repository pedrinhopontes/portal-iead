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
import { anoTemTexto, linhaDoTempo } from "@/lib/dados/conteudo";
import { slotsComFoto } from "@/lib/dados/fotos-do-site";
import { carregarTextos } from "@/lib/dados/textos";

export const metadata: Metadata = {
  title: "Nossa História | 10 Anos",
  description:
    "A linha do tempo do Instituto Educacional Araujo Dutra, de 2016 a 2026: fundação, projetos, conquistas e parcerias.",
};

export const dynamic = "force-dynamic";

export default async function NossaHistoria() {
  const t = await carregarTextos();
  const anos = await linhaDoTempo();

  // Resolve as fotos de todos os anos de uma vez, para a árvore de componentes
  // não precisar descobrir isso ano a ano.
  const fotosPorAno = new Map<number, string[]>(
    await Promise.all(
      anos.map(async (a) => [a.ano, await slotsComFoto(`historia-${a.ano}`, 4)] as [number, string[]]),
    ),
  );

  return (
    <>
      <CapaPagina
        sobretitulo={t("historia.capa.sobretitulo")}
        titulo={t("historia.capa.titulo")}
        texto={t("historia.capa.texto")}
      >
        <Botao href="/nossa-historia/10-anos" tamanho="lg" comSeta>
          Página especial dos 10 anos
        </Botao>
      </CapaPagina>

      <Secao fundo="branco">
        <Container>
          {anos.length === 0 ? (
            <Aviso titulo={t("historia.vazio.titulo")} tom="informativo">
              {t("historia.vazio.texto")}
            </Aviso>
          ) : (
            <ol className="relative space-y-10 border-l-2 border-linha pl-8 sm:pl-12">
              {anos.map((ano) => {
                const slots = fotosPorAno.get(ano.ano) ?? [];
                const temTexto = anoTemTexto(ano);
                const temConteudo = temTexto || slots.length > 0;

                return (
                  <li key={ano.ano} id={`ano-${ano.ano}`} className="relative scroll-mt-32">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white sm:-left-[57px] ${
                        temTexto ? "bg-bordo" : "bg-linha"
                      }`}
                    />

                    <div
                      className={`rounded-2xl border p-7 ${
                        temConteudo ? "border-linha bg-areia" : "border-dashed border-tinta/20 bg-transparent"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-serif text-3xl font-semibold text-bordo">{ano.ano}</span>
                        {ano.destaque && <Etiqueta tom="bordo">Marco</Etiqueta>}
                        {!temTexto && (
                          <Etiqueta tom="aviso">
                            {slots.length > 0 ? "Texto a escrever" : "Aguardando registros"}
                          </Etiqueta>
                        )}
                      </div>

                      {temTexto ? (
                        <>
                          <h2 className="mt-2 text-xl font-semibold">{ano.titulo}</h2>
                          {ano.texto && (
                            <p className="mt-3 leading-relaxed text-tinta-suave">{ano.texto}</p>
                          )}
                          {ano.acontecimentos.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {ano.acontecimentos.map((item) => (
                                <li key={item} className="flex gap-3 text-sm text-tinta-suave">
                                  <Icone nome="check" className="mt-0.5 h-4 w-4 shrink-0 text-verde-escuro" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
                          {slots.length > 0
                            ? "Já temos o registro fotográfico deste ano. O texto histórico, os acontecimentos e as conquistas serão escritos pelo Instituto e entram aqui pelo painel administrativo."
                            : "Este ano está reservado na linha do tempo e será preenchido com os registros históricos do Instituto: texto, fotografias, vídeos, principais acontecimentos, projetos desenvolvidos, conquistas e parcerias."}
                        </p>
                      )}

                      {slots.length > 0 ? (
                        <div
                          className={`mt-6 grid gap-3 ${
                            slots.length === 1 ? "sm:max-w-sm" : "grid-cols-2 sm:max-w-xl"
                          }`}
                        >
                          {slots.map((slot) => (
                            <Foto
                              key={slot}
                              slot={slot}
                              proporcao="3/2"
                              legenda={`Registro de ${ano.ano}`}
                              tamanhos="(max-width: 640px) 100vw, 300px"
                            />
                          ))}
                        </div>
                      ) : (
                        temTexto && (
                          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
                            <Foto
                              slot={`historia-${ano.ano}-1`}
                              proporcao="3/2"
                              legenda={`Registro de ${ano.ano}`}
                              tamanhos="(max-width: 640px) 50vw, 230px"
                            />
                            <Foto
                              slot={`historia-${ano.ano}-2`}
                              proporcao="3/2"
                              legenda={`Registro de ${ano.ano}`}
                              tamanhos="(max-width: 640px) 50vw, 230px"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Container>
      </Secao>

      <Secao fundo="creme" compacta>
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold">Tem registros destes anos?</h2>
              <p className="mt-3 text-tinta-suave">
                {t("historia.acervo.texto")}
              </p>
            </div>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-full bg-bordo px-7 py-3.5 font-semibold text-white hover:bg-bordo-escuro"
            >
              Enviar material histórico
              <Icone nome="seta" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Secao>
    </>
  );
}
