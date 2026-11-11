"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarCampanha, type EstadoForm } from "./acoes";
import type { Campanha } from "@/lib/dados/apadrinhamento-tipos";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

/** Converte timestamp do banco para o formato que o input datetime-local aceita. */
function paraInput(valor: string | null): string {
  if (!valor) return "";
  const d = new Date(valor);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FormularioCampanha({ campanha }: { campanha: Campanha | null }) {
  const [estado, acao, enviando] = useActionState<EstadoForm, FormData>(salvarCampanha, {});

  return (
    <form action={acao} className="space-y-5">
      {campanha && <input type="hidden" name="id" value={campanha.id} />}

      <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ano
          <input
            type="number"
            name="ano"
            required
            min={2018}
            max={2100}
            defaultValue={campanha?.ano ?? new Date().getFullYear()}
            className={campo}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Título
          <input name="titulo" required defaultValue={campanha?.titulo ?? ""} className={campo} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Chamada
        <input name="chamada" defaultValue={campanha?.chamada ?? ""} className={campo} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Vínculo com outros eventos
        <input name="vinculo" defaultValue={campanha?.vinculo ?? ""} className={campo} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Descrição
        <textarea name="descricao" rows={3} defaultValue={campanha?.descricao ?? ""} className={campo} />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Valor da contribuição
          <input
            name="valor_contribuicao"
            inputMode="decimal"
            placeholder="250,00"
            defaultValue={campanha?.valor_contribuicao ?? ""}
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Em branco: a tela diz que o valor será confirmado.
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Prazo de entrega
          <input
            type="datetime-local"
            name="prazo_entrega"
            defaultValue={paraInput(campanha?.prazo_entrega ?? null)}
            className={campo}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Data do evento
          <input
            type="datetime-local"
            name="data_evento"
            defaultValue={paraInput(campanha?.data_evento ?? null)}
            className={campo}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Local do evento
        <input name="local_evento" defaultValue={campanha?.local_evento ?? ""} className={campo} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Situação
          <select name="status" defaultValue={campanha?.status ?? "rascunho"} className={campo}>
            <option value="rascunho">Rascunho — invisível no site</option>
            <option value="aberta">Aberta — recebendo apadrinhamentos</option>
            <option value="encerrada">Encerrada — visível, sem novas reservas</option>
            <option value="arquivada">Arquivada — fica no acervo</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Validade da reserva (horas)
          <input
            type="number"
            name="horas_reserva"
            min={1}
            max={720}
            defaultValue={campanha?.horas_reserva ?? 48}
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Passado esse prazo sem confirmação, o participante volta para a lista.
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Aviso exibido no site
        <textarea name="observacao" rows={2} defaultValue={campanha?.observacao ?? ""} className={campo} />
        <span className="text-xs font-normal text-tinta-suave">
          Aparece como alerta na lista. Deixe em branco quando a lista for real — hoje ele avisa que os
          participantes são de demonstração.
        </span>
      </label>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      {estado.salvo && (
        <p role="status" className="rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro">
          Campanha salva. As mudanças já valem no site.
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar campanha"}
        </button>
        <Link
          href="/admin/apadrinhamento"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Voltar
        </Link>
      </div>
    </form>
  );
}
