import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { instituto } from "@/lib/instituto";
import { carregarTextos } from "@/lib/dados/textos";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o Instituto Educacional Araujo Dutra: endereço em Guadalupe, telefone, e-mail, WhatsApp e horário de funcionamento.",
};

const assuntos = [
  "Quero apadrinhar uma criança",
  "Quero ser apoiador mensal",
  "Quero ser voluntário",
  "Proposta de parceria ou patrocínio",
  "Envio de material histórico",
  "Solicitação de documento",
  "Outro assunto",
];

export default async function Contato() {
  const t = await carregarTextos();
  return (
    <>
      <CapaPagina
        sobretitulo={t("contato.capa.sobretitulo")}
        titulo={t("contato.capa.titulo")}
        texto={t("contato.capa.texto")}
      />

      <Secao fundo="branco">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            {/* Formulário */}
            <div>
              <h2 className="text-2xl font-semibold">Envie uma mensagem</h2>

              <form className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm font-semibold">
                    Nome
                    <input
                      type="text"
                      name="nome"
                      autoComplete="name"
                      className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold">
                    E-mail
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm font-semibold">
                    Telefone
                    <input
                      type="tel"
                      name="telefone"
                      autoComplete="tel"
                      className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-semibold">
                    Assunto
                    <select
                      name="assunto"
                      defaultValue=""
                      className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
                    >
                      <option value="">Selecione</option>
                      {assuntos.map((assunto) => (
                        <option key={assunto} value={assunto}>
                          {assunto}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-1.5 text-sm font-semibold">
                  Mensagem
                  <textarea
                    name="mensagem"
                    rows={5}
                    className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
                  />
                </label>

                <label className="flex items-start gap-3 text-sm text-tinta-suave">
                  <input type="checkbox" name="consentimento" className="mt-1 h-4 w-4" />
                  {t("contato.consentimento")}
                </label>

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-bordo px-6 py-3.5 font-bold text-white opacity-60 sm:w-auto"
                >
                  Enviar mensagem
                </button>
              </form>

              <Aviso titulo={t("contato.aviso.titulo")} tom="demonstracao" className="mt-6">
                {t("contato.aviso.texto")}
              </Aviso>
            </div>

            {/* Dados de contato */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-linha bg-areia p-7">
                <h2 className="text-xl font-semibold">Conecte-se conosco</h2>
                <ul className="mt-5 space-y-4 text-sm">
                  <li className="flex gap-3">
                    <Icone nome="local" className="mt-0.5 h-5 w-5 shrink-0 text-bordo" />
                    <span>{instituto.endereco.completo}</span>
                  </li>
                  <li className="flex gap-3">
                    <Icone nome="telefone" className="mt-0.5 h-5 w-5 shrink-0 text-bordo" />
                    <a href={instituto.contato.telefoneLink} className="hover:text-bordo hover:underline">
                      {instituto.contato.telefone}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Icone nome="email" className="mt-0.5 h-5 w-5 shrink-0 text-bordo" />
                    <a href={`mailto:${instituto.contato.email}`} className="hover:text-bordo hover:underline">
                      {instituto.contato.email}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Icone nome="relogio" className="mt-0.5 h-5 w-5 shrink-0 text-bordo" />
                    <span>{instituto.contato.horario}</span>
                  </li>
                </ul>

                <a
                  href={instituto.contato.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-verde-escuro px-6 py-3 text-sm font-bold text-white hover:bg-tinta"
                >
                  <Icone nome="whatsapp" className="h-5 w-5" />
                  Chamar no WhatsApp
                </a>
              </div>

              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-verde/40 bg-verde-suave/40 p-6 text-center">
                <Icone nome="local" className="h-7 w-7 text-verde-escuro/70" />
                <p className="text-sm font-semibold text-verde-escuro">Mapa da sede</p>
                <p className="max-w-xs text-xs text-tinta-suave">
                  {t("contato.mapa.nota")}
                </p>
              </div>

              <div className="rounded-2xl border border-linha bg-white p-6 text-sm text-tinta-suave">
                <p className="font-semibold text-tinta">Dados institucionais</p>
                <p className="mt-2">CNPJ {instituto.cnpj}</p>
                <p>Registro CMDCA-Rio {instituto.registroCmdcaRio}</p>
              </div>
            </div>
          </div>
        </Container>
      </Secao>
    </>
  );
}
