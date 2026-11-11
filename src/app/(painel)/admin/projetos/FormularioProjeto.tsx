"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarProjeto, type EstadoConteudo } from "../conteudo-acoes";
import type { ProjetoPainel } from "@/lib/dados/painel-conteudo";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioProjeto({
  projeto,
  proximaOrdem,
}: {
  projeto: ProjetoPainel | null;
  proximaOrdem: number;
}) {
  const [estado, acao, enviando] = useActionState<EstadoConteudo, FormData>(salvarProjeto, {});

  return (
    <form action={acao} className="max-w-3xl space-y-5">
      {projeto && <input type="hidden" name="id" value={projeto.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Nome do projeto
          <input name="nome" required defaultValue={projeto?.nome ?? ""} className={campo} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Endereço da página
          <input
            name="slug"
            required
            defaultValue={projeto?.slug ?? ""}
            placeholder="sementes-1"
            className={`${campo} font-mono text-sm`}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Minúsculas, números e hífen. Mudar isso depois quebra os links já compartilhados.
          </span>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Chamada
          <input
            name="chamada"
            defaultValue={projeto?.chamada ?? ""}
            placeholder="Primeira infância"
            className={campo}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Público
          <input name="publico" defaultValue={projeto?.publico ?? ""} className={campo} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Faixa etária
          <input name="faixa_etaria" defaultValue={projeto?.faixa_etaria ?? ""} className={campo} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Resumo
        <textarea name="resumo" rows={3} defaultValue={projeto?.resumo ?? ""} className={campo} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Objetivos
          <textarea
            name="objetivos"
            rows={5}
            defaultValue={(projeto?.objetivos ?? []).join("\n")}
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">Um por linha.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Atividades
          <textarea
            name="atividades"
            rows={5}
            defaultValue={(projeto?.atividades ?? []).join("\n")}
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">Uma por linha.</span>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Ponto a confirmar
        <textarea name="observacao" rows={2} defaultValue={projeto?.observacao ?? ""} className={campo} />
        <span className="text-xs font-normal text-tinta-suave">
          Aparece como alerta na página do projeto. Use para divergências ainda não resolvidas; deixe em
          branco quando estiver tudo confirmado.
        </span>
      </label>

      <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Cor do destaque
          <select name="paleta" defaultValue={projeto?.paleta ?? "verde"} className={campo}>
            <option value="verde">Verde</option>
            <option value="bordo">Bordô</option>
            <option value="ardosia">Ardósia</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ordem
          <input
            type="number"
            name="ordem"
            defaultValue={projeto?.ordem ?? proximaOrdem}
            className={campo}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-linha bg-white p-4 text-sm">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={projeto?.publicado ?? false}
          className="mt-0.5 h-4 w-4"
        />
        <span>
          <strong className="font-semibold">Publicar no site</strong>
          <span className="block text-tinta-suave">
            Desmarcado, o projeto fica salvo e visível só aqui no painel.
          </span>
        </span>
      </label>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar projeto"}
        </button>
        <Link
          href="/admin/projetos"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
