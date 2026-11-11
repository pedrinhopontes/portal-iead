"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { criarClienteNavegador } from "@/lib/supabase/navegador";

export function FormularioEntrada({ destino }: { destino: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [recuperacaoEnviada, setRecuperacaoEnviada] = useState(false);

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const supabase = criarClienteNavegador();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      // Mensagem genérica de propósito: não revela se o e-mail existe.
      setErro("E-mail ou senha incorretos.");
      setEnviando(false);
      return;
    }

    router.push(destino);
    router.refresh();
  }

  async function recuperarAcesso() {
    if (!email) {
      setErro("Escreva o seu e-mail acima para receber o link de recuperação.");
      return;
    }
    setErro(null);
    const supabase = criarClienteNavegador();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setRecuperacaoEnviada(true);
  }

  return (
    <form onSubmit={entrar} className="rounded-2xl border border-linha bg-white p-7 shadow-sm">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        E-mail
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
        />
      </label>

      <label className="mt-4 flex flex-col gap-1.5 text-sm font-semibold">
        Senha
        <input
          type="password"
          name="senha"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="rounded-xl border border-linha bg-areia px-4 py-3 font-normal"
        />
      </label>

      {erro && (
        <p role="alert" className="mt-4 rounded-xl bg-bordo-suave px-4 py-3 text-sm text-bordo-escuro">
          {erro}
        </p>
      )}

      {recuperacaoEnviada && (
        <p role="status" className="mt-4 rounded-xl bg-verde-suave px-4 py-3 text-sm text-verde-escuro">
          Se este e-mail tiver acesso ao painel, o link de recuperação chegará em instantes.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-bordo px-6 py-3.5 font-bold text-white transition-colors hover:bg-bordo-escuro disabled:opacity-60"
      >
        <Icone nome="cadeado" className="h-4 w-4" />
        {enviando ? "Entrando…" : "Entrar"}
      </button>

      <button
        type="button"
        onClick={recuperarAcesso}
        className="mt-4 w-full text-center text-sm font-semibold text-tinta-suave hover:text-bordo hover:underline"
      >
        Esqueci minha senha
      </button>
    </form>
  );
}
