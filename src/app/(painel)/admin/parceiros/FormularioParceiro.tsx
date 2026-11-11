"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { excluirParceiro, salvarParceiro, type EstadoConteudo } from "../conteudo-acoes";
import type { ParceiroPainel } from "@/lib/dados/painel-conteudo";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioParceiro({
  parceiro,
  proximaOrdem,
}: {
  parceiro: ParceiroPainel | null;
  proximaOrdem: number;
}) {
  const [estado, acao, enviando] = useActionState<EstadoConteudo, FormData>(salvarParceiro, {});

  return (
    <form action={acao} className="max-w-2xl space-y-5">
      {parceiro && <input type="hidden" name="id" value={parceiro.id} />}

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Nome
        <input name="nome" required defaultValue={parceiro?.nome ?? ""} className={campo} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Descrição
        <input name="descricao" defaultValue={parceiro?.descricao ?? ""} className={campo} />
      </label>

      <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Site
          <input
            type="url"
            name="site"
            defaultValue={parceiro?.site ?? ""}
            placeholder="https://"
            className={campo}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ordem
          <input
            type="number"
            name="ordem"
            defaultValue={parceiro?.ordem ?? proximaOrdem}
            className={campo}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-linha bg-white p-4 text-sm">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={parceiro?.publicado ?? true}
          className="mt-0.5 h-4 w-4"
        />
        <span>
          <strong className="font-semibold">Mostrar no site</strong>
          <span className="block text-tinta-suave">
            A logomarca entra no lugar do nome quando for cadastrada em Fotos e arquivos.
          </span>
        </span>
      </label>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar parceiro"}
        </button>
        <Link
          href="/admin/parceiros"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>
        {parceiro && <BotaoExcluir id={parceiro.id} nome={parceiro.nome} />}
      </div>
    </form>
  );
}

function BotaoExcluir({ id, nome }: { id: string; nome: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="ml-auto text-sm font-semibold text-tinta-suave hover:text-bordo hover:underline"
      >
        Excluir
      </button>
    );
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-2 rounded-xl bg-bordo-suave px-4 py-2">
      <span className="text-sm text-bordo-escuro">Apagar {nome}?</span>
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciar(async () => {
            await excluirParceiro(id);
            router.push("/admin/parceiros");
          })
        }
        className="rounded-full bg-bordo px-4 py-1.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {pendente ? "Apagando…" : "Sim"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        className="rounded-full border border-bordo/40 px-4 py-1.5 text-sm font-semibold text-bordo-escuro"
      >
        Não
      </button>
    </div>
  );
}
