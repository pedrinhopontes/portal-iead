import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sair } from "./acoes";
import { MenuLateral } from "./MenuLateral";
import { Marca } from "@/components/layout/Marca";
import { Icone } from "@/components/ui/Icone";
import { itensDoPerfil, rotuloPerfil, type Perfil } from "@/lib/painel";
import { pendenciasDeConfiguracao, supabaseConfigurado } from "@/lib/supabase/configuracao";
import { usuarioDoPainel } from "@/lib/supabase/servidor";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel do IEAD" },
  robots: { index: false, follow: false },
};

export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigurado) return <BancoNaoConfigurado />;

  const usuario = await usuarioDoPainel();
  if (!usuario) redirect("/entrar");
  if (!usuario.perfil) return <SemAcesso email={usuario.email} />;

  const itens = itensDoPerfil(usuario.perfil as Perfil);

  return (
    <div className="flex min-h-screen flex-col bg-areia lg:flex-row">
      <aside className="border-b border-linha bg-white lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-linha px-6 py-5">
          <Marca tamanho={36} />
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold text-bordo">Painel</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-verde-escuro">IEAD</p>
          </div>
        </div>

        <MenuLateral itens={itens} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-linha bg-white px-6 py-4">
          <div>
            <p className="font-semibold">{usuario.nome}</p>
            <p className="text-xs text-tinta-suave">
              {rotuloPerfil[usuario.perfil as Perfil]} · {usuario.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-linha px-4 py-2 text-sm font-semibold hover:border-bordo hover:text-bordo"
            >
              Ver o site
            </Link>
            <form action={sair}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-white hover:bg-bordo"
              >
                <Icone nome="cadeado" className="h-4 w-4" />
                Sair
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

function BancoNaoConfigurado() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-5 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-8">
        <h1 className="font-serif text-2xl font-semibold text-amber-900">
          O painel ainda não está conectado
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-amber-900">
          O banco de dados do Supabase ainda não foi configurado. Nada do painel funciona até isso ser
          feito, e o site público continua no ar normalmente.
        </p>
        <p className="mt-4 text-sm font-semibold text-amber-900">
          Falta preencher no arquivo <code className="font-mono">.env.local</code>:
        </p>
        <ul className="mt-2 list-inside list-disc font-mono text-xs text-amber-900">
          {pendenciasDeConfiguracao().map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-amber-900">
          O passo a passo completo está em <code className="font-mono">docs/supabase.md</code>.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-bold text-bordo hover:underline">
          Voltar para o site
        </Link>
      </div>
    </main>
  );
}

function SemAcesso({ email }: { email: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-linha bg-white p-8 text-center">
        <Icone nome="cadeado" className="mx-auto h-8 w-8 text-bordo" />
        <h1 className="mt-4 font-serif text-2xl font-semibold">Sem acesso ao painel</h1>
        <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
          A conta <strong className="font-semibold">{email}</strong> existe, mas ainda não foi liberada
          para o painel. Peça a um administrador do Instituto para cadastrar o seu perfil.
        </p>
        <form action={sair} className="mt-6">
          <button
            type="submit"
            className="rounded-full bg-tinta px-6 py-3 text-sm font-bold text-white hover:bg-bordo"
          >
            Sair
          </button>
        </form>
      </div>
    </main>
  );
}
