import type { Metadata } from "next";
import { cancelarContribuicao, confirmarContribuicao, mudarStatusFiliacao } from "./acoes";
import { FormularioPix } from "./FormularioPix";
import { Aviso } from "@/components/ui/Aviso";
import {
  configuracaoPix,
  formatarReal,
  listarContribuicoes,
  listarFiliacoes,
  rotuloStatusContribuicao,
} from "@/lib/dados/apoio";
import { formatarDataHora } from "@/lib/dados/painel-apadrinhamento";

export const metadata: Metadata = { title: "Contribuições" };
export const dynamic = "force-dynamic";

const corStatus: Record<string, string> = {
  aguardando: "bg-amber-50 text-amber-800",
  confirmada: "bg-verde-suave text-verde-escuro",
  cancelada: "bg-creme text-tinta-suave",
};

const corFiliacao: Record<string, string> = {
  em_analise: "bg-amber-50 text-amber-800",
  aprovada: "bg-verde-suave text-verde-escuro",
  recusada: "bg-creme text-tinta-suave",
};

export default async function Contribuicoes() {
  const [contribuicoes, filiacoes, config] = await Promise.all([
    listarContribuicoes(),
    listarFiliacoes(),
    configuracaoPix(),
  ]);

  const aguardando = contribuicoes.filter((c) => c.status === "aguardando");
  const confirmadas = contribuicoes.filter((c) => c.status === "confirmada");
  const totalConfirmado = confirmadas.reduce((soma, c) => soma + Number(c.valor), 0);
  const mensaisAtivas = confirmadas.filter((c) => c.tipo === "mensal").length;

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold">Contribuições</h1>
      <p className="mt-1 text-sm text-tinta-suave">
        Doações registradas pelo site e pedidos de filiação associativa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-linha bg-white p-6">
          <p className="text-sm text-tinta-suave">Aguardando o PIX</p>
          <p className="mt-1 font-serif text-3xl font-semibold text-amber-700">{aguardando.length}</p>
        </div>
        <div className="rounded-2xl border border-linha bg-white p-6">
          <p className="text-sm text-tinta-suave">Confirmadas</p>
          <p className="mt-1 font-serif text-3xl font-semibold text-verde-escuro">{confirmadas.length}</p>
        </div>
        <div className="rounded-2xl border border-linha bg-white p-6">
          <p className="text-sm text-tinta-suave">Total confirmado</p>
          <p className="mt-1 font-serif text-3xl font-semibold text-bordo">
            {formatarReal(totalConfirmado)}
          </p>
          {mensaisAtivas > 0 && (
            <p className="mt-1 text-xs text-tinta-suave">
              {mensaisAtivas} {mensaisAtivas === 1 ? "mensal" : "mensais"}
            </p>
          )}
        </div>
      </div>

      <Aviso titulo="Como dar baixa" tom="informativo" className="mt-6">
        O PIX cai direto na conta do Instituto, sem integração bancária — por isso a confirmação é
        manual. Localize a referência no extrato e marque como confirmada. É essa marcação que alimenta
        os números do Portal da Transparência.
      </Aviso>

      {/* ---------------- Contribuições ---------------- */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold">Doações</h2>

        {contribuicoes.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-sm text-tinta-suave">
            Nenhuma contribuição registrada ainda.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {contribuicoes.map((contribuicao) => (
              <li key={contribuicao.id} className="rounded-2xl border border-linha bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-xl font-semibold text-bordo">
                        {formatarReal(Number(contribuicao.valor))}
                      </span>
                      <span className="rounded-full bg-areia px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-tinta-suave">
                        {contribuicao.tipo === "mensal" ? "mensal" : "única"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${corStatus[contribuicao.status]}`}
                      >
                        {rotuloStatusContribuicao[contribuicao.status]}
                      </span>
                      <code className="rounded bg-creme px-2 py-0.5 font-mono text-[11px]">
                        {contribuicao.referencia}
                      </code>
                    </div>

                    <p className="mt-2 font-semibold">{contribuicao.apoiadores?.nome ?? "—"}</p>
                    <p className="text-sm text-tinta-suave">
                      {contribuicao.apoiadores?.email}
                      {contribuicao.apoiadores?.telefone && ` · ${contribuicao.apoiadores.telefone}`}
                    </p>
                    {contribuicao.mensagem && (
                      <p className="mt-2 rounded-xl bg-areia px-4 py-2 text-sm text-tinta-suave">
                        {contribuicao.mensagem}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-tinta-suave">
                      Registrada em {formatarDataHora(contribuicao.criado_em)}
                      {contribuicao.confirmada_em &&
                        ` · confirmada em ${formatarDataHora(contribuicao.confirmada_em)}`}
                    </p>
                  </div>

                  {contribuicao.status === "aguardando" && (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <form action={confirmarContribuicao.bind(null, contribuicao.id)}>
                        <button
                          type="submit"
                          className="rounded-full bg-verde-escuro px-4 py-2 text-sm font-semibold text-white hover:bg-tinta"
                        >
                          Confirmar recebimento
                        </button>
                      </form>
                      <form action={cancelarContribuicao.bind(null, contribuicao.id)}>
                        <button
                          type="submit"
                          className="rounded-full border border-linha px-4 py-2 text-sm font-semibold hover:border-bordo hover:text-bordo"
                        >
                          Cancelar
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------------- Filiações ---------------- */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold">Pedidos de filiação</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Filiação associativa envolve direitos estatutários e não se confunde com doação.
        </p>

        {filiacoes.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-sm text-tinta-suave">
            Nenhum pedido de filiação.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {filiacoes.map((filiacao) => (
              <li key={filiacao.id} className="rounded-2xl border border-linha bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{filiacao.nome}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${corFiliacao[filiacao.status]}`}
                      >
                        {filiacao.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-tinta-suave">
                      {filiacao.email}
                      {filiacao.telefone && ` · ${filiacao.telefone}`}
                    </p>
                    {filiacao.motivacao && (
                      <p className="mt-2 rounded-xl bg-areia px-4 py-2 text-sm text-tinta-suave">
                        {filiacao.motivacao}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-tinta-suave">
                      Pedido em {formatarDataHora(filiacao.criado_em)}
                    </p>
                  </div>

                  {filiacao.status === "em_analise" && (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <form action={mudarStatusFiliacao.bind(null, filiacao.id, "aprovada")}>
                        <button
                          type="submit"
                          className="rounded-full bg-verde-escuro px-4 py-2 text-sm font-semibold text-white hover:bg-tinta"
                        >
                          Aprovar
                        </button>
                      </form>
                      <form action={mudarStatusFiliacao.bind(null, filiacao.id, "recusada")}>
                        <button
                          type="submit"
                          className="rounded-full border border-linha px-4 py-2 text-sm font-semibold hover:border-bordo hover:text-bordo"
                        >
                          Recusar
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------------- Configuração do PIX ---------------- */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold">Configuração do PIX</h2>
        <div className="mt-5">
          <FormularioPix config={config} />
        </div>
      </section>
    </div>
  );
}
