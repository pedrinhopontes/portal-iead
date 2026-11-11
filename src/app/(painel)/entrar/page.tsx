import type { Metadata } from "next";
import Link from "next/link";
import { FormularioEntrada } from "./FormularioEntrada";
import { Marca } from "@/components/layout/Marca";
import { pendenciasDeConfiguracao, supabaseConfigurado } from "@/lib/supabase/configuracao";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export default async function Entrar({
  searchParams,
}: {
  searchParams: Promise<{ destino?: string }>;
}) {
  const { destino } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-creme px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Marca tamanho={64} />
          <h1 className="mt-4 font-serif text-2xl font-semibold">Painel do IEAD</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Acesso restrito à equipe do Instituto.
          </p>
        </div>

        {supabaseConfigurado ? (
          <FormularioEntrada destino={destino ?? "/admin"} />
        ) : (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
            <p className="font-bold">O painel ainda não está conectado ao banco de dados.</p>
            <p className="mt-2">
              Falta preencher no arquivo <code className="font-mono">.env.local</code>:
            </p>
            <ul className="mt-2 list-inside list-disc font-mono text-xs">
              {pendenciasDeConfiguracao().map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3">
              O passo a passo está em <code className="font-mono">docs/supabase.md</code>.
            </p>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-tinta-suave">
          <Link href="/" className="hover:text-bordo hover:underline">
            Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
