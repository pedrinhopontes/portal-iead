"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarAno, type EstadoConteudo } from "../conteudo-acoes";
import type { AnoPainel } from "@/lib/dados/painel-conteudo";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioAno({ ano, anoSugerido }: { ano: AnoPainel | null; anoSugerido: number }) {
  const [estado, acao, enviando] = useActionState<EstadoConteudo, FormData>(salvarAno, {});

  return (
    <form action={acao} className="max-w-3xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ano
          <input
            type="number"
            name="ano"
            required
            min={2016}
            max={2100}
            readOnly={Boolean(ano)}
            defaultValue={ano?.ano ?? anoSugerido}
            className={`${campo} ${ano ? "cursor-not-allowed opacity-70" : ""}`}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Título do ano
          <input
            name="titulo"
            defaultValue={ano?.titulo ?? ""}
            placeholder="A fundação"
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Enquanto estiver em branco, a linha do tempo mostra o ano como &quot;texto a escrever&quot;.
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Texto histórico
        <textarea name="texto" rows={4} defaultValue={ano?.texto ?? ""} className={campo} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Principais acontecimentos
        <textarea
          name="acontecimentos"
          rows={5}
          defaultValue={(ano?.acontecimentos ?? []).join("\n")}
          className={campo}
        />
        <span className="text-xs font-normal text-tinta-suave">
          Um por linha. Conquistas, parcerias firmadas, marcos do ano.
        </span>
      </label>

      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-xl border border-linha bg-white p-4 text-sm">
          <input
            type="checkbox"
            name="destaque"
            defaultChecked={ano?.destaque ?? false}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            <strong className="font-semibold">Marco da história</strong>
            <span className="block text-tinta-suave">
              Ganha a etiqueta &quot;Marco&quot; na linha do tempo. Use com parcimônia.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-linha bg-white p-4 text-sm">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={ano?.publicado ?? true}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            <strong className="font-semibold">Mostrar na linha do tempo</strong>
            <span className="block text-tinta-suave">
              Mesmo sem texto, o ano aparece reservado — é assim que a década fica completa.
            </span>
          </span>
        </label>
      </div>

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
          {enviando ? "Salvando…" : "Salvar ano"}
        </button>
        <Link
          href="/admin/historia"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
