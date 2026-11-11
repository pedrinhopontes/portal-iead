import type { Metadata } from "next";
import { Aviso } from "@/components/ui/Aviso";
import { Botao } from "@/components/ui/Botao";
import { Container } from "@/components/ui/Container";
import { Foto } from "@/components/ui/Foto";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { TituloSecao } from "@/components/ui/TituloSecao";
/**
 * Dados do evento comemorativo.
 *
 * Só a data está confirmada pelo Instituto. Os campos nulos aparecem como
 * "a confirmar" na tela e passam para o banco quando o material chegar.
 */
const evento10Anos = {
  data: "7 de novembro de 2026",
  local: null as string | null,
};

export const metadata: Metadata = {
  title: "IEAD 10 Anos: Infâncias Protegidas, Futuros Possíveis",
  description:
    "A comemoração dos 10 anos do Instituto Educacional Araujo Dutra: seminário, programação, palestrantes e registros do encontro de 7 de novembro de 2026.",
};

const blocosAcervo = [
  { titulo: "Seminário", descricao: "Tema, mesas e conteúdo apresentado." },
  { titulo: "Palestrantes", descricao: "Nome, minicurrículo e tema de cada convidado." },
  { titulo: "Programação", descricao: "Horários e atividades do dia." },
  { titulo: "Fotografias", descricao: "Registro do encontro, com autorização de uso." },
  { titulo: "Vídeos", descricao: "Gravações e trechos da comemoração." },
  { titulo: "Depoimentos", descricao: "Falas de participantes, famílias e parceiros." },
  { titulo: "Parceiros", descricao: "Quem apoiou a realização do evento." },
  { titulo: "Resultados", descricao: "O que ficou da comemoração para o Instituto." },
];

export default function DezAnos() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-linha bg-bordo text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <Container className="relative py-16 sm:py-24">
          <Etiqueta tom="neutro" className="bg-white/15 text-white ring-white/30">
            7 de novembro de 2026
          </Etiqueta>
          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            IEAD 10 Anos: Infâncias Protegidas, Futuros Possíveis
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            A comemoração de uma década de atuação em Guadalupe reuniu o seminário, parceiros institucionais e
            as famílias atendidas pelo Instituto.
          </p>
          <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
            <span className="flex items-center gap-2">
              <Icone nome="relogio" className="h-4 w-4" />
              {evento10Anos.data}
            </span>
            <span className="flex items-center gap-2">
              <Icone nome="local" className="h-4 w-4" />
              {evento10Anos.local ?? "Local a confirmar"}
            </span>
          </p>
        </Container>
      </section>

      <Secao fundo="branco">
        <Container>
          <TituloSecao
            sobretitulo="Acervo permanente"
            titulo="O que esta página vai guardar"
            texto="A comemoração continua disponível como acervo histórico mesmo depois de 2026. Cada bloco abaixo é preenchido pelo painel administrativo."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {blocosAcervo.map((bloco) => (
              <div key={bloco.titulo} className="rounded-2xl border border-dashed border-tinta/20 p-6">
                <p className="font-semibold">{bloco.titulo}</p>
                <p className="mt-1 text-sm text-tinta-suave">{bloco.descricao}</p>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                  Aguardando material
                </p>
              </div>
            ))}
          </div>

          <Aviso titulo="Material do evento ainda não recebido" tom="pendente" className="mt-10">
            O evento ocorreu em 7 de novembro de 2026, três dias antes desta entrega. Assim que o Instituto
            enviar programação, lista de palestrantes, fotografias e vídeos, esta página passa a exibir o
            conteúdo real — nada foi preenchido por suposição.
          </Aviso>
        </Container>
      </Secao>

      <Secao fundo="areia">
        <Container>
          <TituloSecao centralizado sobretitulo="Galeria" titulo="Registros da comemoração" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Foto
                key={i}
                slot={`dez-anos-${i + 1}`}
                proporcao="4/3"
                legenda="Registro do evento de 10 anos"
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Botao href="/contato" variante="secundario" comSeta>
              Enviar fotos e vídeos do evento
            </Botao>
          </div>
        </Container>
      </Secao>
    </>
  );
}
