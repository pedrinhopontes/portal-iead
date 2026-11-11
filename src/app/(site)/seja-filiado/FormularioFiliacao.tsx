"use client";

import Link from "next/link";
import { useActionState } from "react";
import { pedirFiliacao, type EstadoFiliacao } from "./acoes";
import { Icone } from "@/components/ui/Icone";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioFiliacao() {
  const [estado, acao, enviando] = useActionState<EstadoFiliacao, FormData>(pedirFiliacao, {});

  if (estado.sucesso) {
    return (
      <div className="rounded-2xl border-2 border-verde bg-verde-suave p-7">
        <Icone nome="check" className="h-8 w-8 text-verde-escuro" />
        <h3 className="mt-3 font-serif text-xl font-semibold text-verde-escuro">Pedido registrado</h3>
        <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
          A diretoria analisa os pedidos de filiação conforme o estatuto do Instituto. Você receberá
          retorno pelo e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <form action={acao} className="rounded-2xl border border-linha bg-white p-7">
      <h3 className="text-lg font-semibold">Quero me associar ao Instituto</h3>
      <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
        O pedido passa por análise da diretoria, conforme o estatuto. Associar-se é diferente de apoiar
        financeiramente: envolve direitos e deveres previstos no estatuto.
      </p>

      <div className="mt-5 space-y-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Nome
          <input name="nome" required autoComplete="name" className={campo} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            E-mail
            <input type="email" name="email" required autoComplete="email" className={campo} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Telefone
            <input type="tel" name="telefone" autoComplete="tel" className={campo} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Por que você quer se associar
          <textarea name="motivacao" rows={3} className={campo} />
        </label>

        <label className="flex items-start gap-3 text-sm text-tinta-suave">
          <input type="checkbox" name="consentimento" className="mt-0.5 h-4 w-4" />
          <span>
            Autorizo o uso dos meus dados na análise deste pedido, conforme a{" "}
            <Link href="/privacidade" className="font-semibold text-bordo hover:underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
      </div>

      {estado.erro && (
        <p role="alert" className="mt-4 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-5 rounded-full bg-verde-escuro px-6 py-3 font-bold text-white hover:bg-tinta disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Enviar pedido"}
      </button>
    </form>
  );
}
