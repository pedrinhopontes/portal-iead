"use client";

import { useActionState } from "react";
import { salvarPix, type EstadoPix } from "./acoes";
import { Icone } from "@/components/ui/Icone";
import type { ConfiguracaoPix } from "@/lib/pix";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioPix({ config }: { config: Partial<ConfiguracaoPix> | null }) {
  const [estado, acao, enviando] = useActionState<EstadoPix, FormData>(salvarPix, {});

  return (
    <form action={acao} className="rounded-2xl border border-linha bg-white p-7">
      <h2 className="flex items-center gap-2 font-semibold">
        <Icone nome="cadeado" className="h-5 w-5 text-bordo" />
        Dados do PIX
      </h2>
      <p className="mt-2 text-sm text-tinta-suave">
        É com isso que o site gera o QR Code das doações. Confira com calma: chave errada manda o
        dinheiro para a conta errada.
      </p>

      <div className="mt-5 space-y-5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Chave PIX
          <input
            name="chave"
            required
            defaultValue={config?.chave ?? ""}
            placeholder="CNPJ, e-mail, telefone ou chave aleatória"
            className={`${campo} font-mono`}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Use a chave da conta do Instituto, não a de uma pessoa física.
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Nome do recebedor
            <input
              name="nome"
              required
              maxLength={25}
              defaultValue={config?.nome ?? ""}
              className={campo}
            />
            <span className="text-xs font-normal text-tinta-suave">
              Até 25 caracteres. É o nome que aparece no aplicativo de quem doa.
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Cidade
            <input
              name="cidade"
              required
              maxLength={15}
              defaultValue={config?.cidade ?? ""}
              placeholder="RIO DE JANEIRO"
              className={campo}
            />
            <span className="text-xs font-normal text-tinta-suave">Até 15 caracteres.</span>
          </label>
        </div>
      </div>

      {estado.erro && (
        <p role="alert" className="mt-5 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      {estado.salvo && (
        <p role="status" className="mt-5 rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro">
          Dados salvos. O site já está gerando PIX com essa chave.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
      >
        {enviando ? "Salvando…" : "Salvar dados do PIX"}
      </button>
    </form>
  );
}
