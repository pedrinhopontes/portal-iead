"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarUsuario, type EstadoUsuario } from "./acoes";
import { rotuloPerfil, type Perfil } from "@/lib/painel";
import type { UsuarioPainel } from "@/lib/dados/painel-conteudo";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

const perfis: Perfil[] = ["admin", "comunicacao", "financeiro", "coordenador"];

const oQuePodeFazer: Record<Perfil, string> = {
  admin: "Tudo, incluindo gerenciar usuários e ver o registro de alterações.",
  comunicacao: "Notícias, projetos, linha do tempo, fotos, parceiros e indicadores.",
  financeiro: "Contribuições e Portal da Transparência.",
  coordenador: "Projetos, fotos e o apadrinhamento, incluindo os dados restritos dos participantes.",
};

export function FormularioUsuario({ usuario }: { usuario: UsuarioPainel | null }) {
  const [estado, acao, enviando] = useActionState<EstadoUsuario, FormData>(salvarUsuario, {});
  const criando = usuario === null;

  return (
    <form action={acao} className="max-w-2xl space-y-5">
      <input type="hidden" name="criando" value={criando ? "1" : "0"} />

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        UID do Supabase Auth
        <input
          name="id"
          required
          readOnly={!criando}
          defaultValue={usuario?.id ?? ""}
          placeholder="68f1954a-dbe5-4071-a8c2-3b1789a14908"
          className={`${campo} font-mono text-sm ${criando ? "" : "cursor-not-allowed opacity-70"}`}
        />
        {criando && (
          <span className="text-xs font-normal text-tinta-suave">
            Crie o login primeiro no Supabase, em Authentication → Users → Add user (marcando
            &quot;Auto Confirm User&quot;), e cole aqui o UID que aparece na lista.
          </span>
        )}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Nome
          <input name="nome" required defaultValue={usuario?.nome ?? ""} className={campo} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          E-mail
          <input type="email" name="email" required defaultValue={usuario?.email ?? ""} className={campo} />
          <span className="text-xs font-normal text-tinta-suave">
            O mesmo usado no login, para a lista fazer sentido.
          </span>
        </label>
      </div>

      <fieldset className="rounded-2xl border border-linha bg-white p-6">
        <legend className="px-2 text-sm font-bold uppercase tracking-wider text-verde-escuro">
          Perfil de acesso
        </legend>
        <div className="space-y-2">
          {perfis.map((perfil) => (
            <label
              key={perfil}
              className="flex cursor-pointer items-start gap-3 rounded-xl p-3 text-sm hover:bg-areia"
            >
              <input
                type="radio"
                name="perfil"
                value={perfil}
                required
                defaultChecked={(usuario?.perfil ?? "comunicacao") === perfil}
                className="mt-0.5 h-4 w-4"
              />
              <span>
                <strong className="font-semibold">{rotuloPerfil[perfil]}</strong>
                <span className="block text-tinta-suave">{oQuePodeFazer[perfil]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-3 rounded-xl border border-linha bg-white p-4 text-sm">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={usuario?.ativo ?? true}
          className="mt-0.5 h-4 w-4"
        />
        <span>
          <strong className="font-semibold">Acesso liberado</strong>
          <span className="block text-tinta-suave">
            Desmarcar bloqueia a entrada sem apagar o histórico do que a pessoa fez.
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
          {enviando ? "Salvando…" : "Salvar usuário"}
        </button>
        <Link
          href="/admin/usuarios"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
