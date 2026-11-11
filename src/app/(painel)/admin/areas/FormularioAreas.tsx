"use client";

import { useActionState } from "react";
import { salvarAreas, type EstadoAreas } from "./acoes";
import { Icone } from "@/components/ui/Icone";
import type { ItemDeMenu } from "@/lib/navegacao";

export type LinhaDeArea = ItemDeMenu & {
  visivel: boolean;
  /** Quanto conteúdo existe nessa área, para a decisão ser informada. */
  situacao: string;
  vazia: boolean;
};

export function FormularioAreas({ areas }: { areas: LinhaDeArea[] }) {
  const [estado, acao, enviando] = useActionState<EstadoAreas, FormData>(salvarAreas, {});

  return (
    <form action={acao} className="mt-8">
      <ul className="divide-y divide-linha rounded-2xl border border-linha bg-white">
        {areas.map((area) => (
          <li key={area.href} className="flex flex-wrap items-center gap-4 px-6 py-4">
            <label className="flex flex-1 items-center gap-4">
              <input
                type="checkbox"
                name="visivel"
                value={area.href}
                defaultChecked={area.visivel}
                className="h-5 w-5 shrink-0 accent-[var(--color-verde)]"
              />
              <span className="min-w-0">
                <span className="block font-semibold">{area.rotulo}</span>
                <code className="text-xs text-tinta-suave">{area.href}</code>
              </span>
            </label>

            <span
              className={`text-sm ${area.vazia ? "font-semibold text-amber-700" : "text-tinta-suave"}`}
            >
              {area.situacao}
            </span>
          </li>
        ))}
      </ul>

      {estado.erro && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro"
        >
          {estado.erro}
        </p>
      )}

      {estado.salvo && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro"
        >
          <Icone nome="check" className="mr-2 inline h-4 w-4" />
          Salvo. O menu do site já mudou.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
      >
        {enviando ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
