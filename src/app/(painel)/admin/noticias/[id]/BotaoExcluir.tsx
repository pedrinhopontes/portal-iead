"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { excluirNoticia } from "../acoes";

/**
 * Exclusão em dois passos.
 *
 * Apagar é irreversível, então o primeiro clique apenas avisa e o segundo confirma —
 * sem diálogo do navegador, que é fácil de clicar sem ler.
 */
export function BotaoExcluir({ id, titulo }: { id: string; titulo: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="rounded-full border border-bordo/40 px-5 py-2.5 text-sm font-semibold text-bordo hover:bg-bordo-suave"
      >
        Excluir
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-bordo-suave px-4 py-3">
      <p className="text-sm text-bordo-escuro">
        Apagar <strong className="font-semibold">{titulo}</strong> de vez? Não dá para desfazer.
      </p>
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciar(async () => {
            await excluirNoticia(id);
            router.push("/admin/noticias");
          })
        }
        className="rounded-full bg-bordo px-4 py-2 text-sm font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
      >
        {pendente ? "Apagando…" : "Sim, apagar"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        className="rounded-full border border-bordo/40 px-4 py-2 text-sm font-semibold text-bordo-escuro"
      >
        Cancelar
      </button>
    </div>
  );
}
