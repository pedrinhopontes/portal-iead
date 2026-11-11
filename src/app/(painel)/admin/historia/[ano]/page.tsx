import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioAno } from "../FormularioAno";
import { Icone } from "@/components/ui/Icone";
import { anoPainel } from "@/lib/dados/painel-conteudo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ ano: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ano } = await params;
  return { title: `Linha do tempo · ${ano}` };
}

export default async function EditarAno({ params }: Props) {
  const { ano } = await params;
  const numero = Number(ano);

  if (!Number.isInteger(numero) || numero < 2016 || numero > 2100) notFound();

  const registro = await anoPainel(numero);

  return (
    <div>
      <Link
        href="/admin/historia"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Linha do tempo
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">
        {registro ? `Ano de ${numero}` : `Acrescentar ${numero}`}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-tinta-suave">
        As fotos deste ano são cadastradas em Fotos e arquivos, marcando os lugares
        &quot;{numero} — foto 1&quot; e seguintes.
      </p>

      <div className="mt-8">
        <FormularioAno ano={registro} anoSugerido={numero} />
      </div>
    </div>
  );
}
