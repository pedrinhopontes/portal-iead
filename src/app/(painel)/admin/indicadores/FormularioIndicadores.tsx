"use client";

import { useActionState } from "react";
import { salvarIndicadores, type EstadoConteudo } from "../conteudo-acoes";
import type { IndicadorPainel } from "@/lib/dados/painel-conteudo";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-2.5 font-normal";

export function FormularioIndicadores({ indicadores }: { indicadores: IndicadorPainel[] }) {
  const [estado, acao, enviando] = useActionState<EstadoConteudo, FormData>(salvarIndicadores, {});

  return (
    <form action={acao} className="space-y-4">
      {indicadores.map((indicador) => (
        <div key={indicador.id} className="rounded-2xl border border-linha bg-white p-6">
          <input type="hidden" name="id" value={indicador.id} />

          <p className="font-semibold">{indicador.rotulo}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Número
              <input
                name={`valor-${indicador.id}`}
                defaultValue={indicador.valor ?? ""}
                placeholder="—"
                className={campo}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              De onde veio esse número
              <input
                name={`fonte-${indicador.id}`}
                defaultValue={indicador.fonte ?? ""}
                placeholder="ex.: Relatório de atividades 2026, página 4"
                className={campo}
              />
            </label>
          </div>

          <label className="mt-4 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name={`verificado-${indicador.id}`}
              defaultChecked={indicador.verificado}
              className="mt-0.5 h-4 w-4"
            />
            <span>
              <strong className="font-semibold">Número conferido, pode ir ao site</strong>
              <span className="block text-tinta-suave">
                Sem marcar, a home mostra um travessão e o aviso de que o dado está pendente.
              </span>
            </span>
          </label>
        </div>
      ))}

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      {estado.salvo && (
        <p role="status" className="rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro">
          Indicadores salvos. As mudanças já valem na página inicial.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
      >
        {enviando ? "Salvando…" : "Salvar indicadores"}
      </button>
    </form>
  );
}
