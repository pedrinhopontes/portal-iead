import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioParticipante } from "../FormularioParticipante";
import { Icone } from "@/components/ui/Icone";
import {
  campanhaDoPainel,
  participanteDoPainel,
  participantesDoPainel,
} from "@/lib/dados/painel-apadrinhamento";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; pid: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pid } = await params;
  return { title: pid === "novo" ? "Novo participante" : "Editar participante" };
}

/** Sugere o próximo código da campanha, no formato P-<ano>-<sequência>. */
function proximoCodigo(ano: number, existentes: string[]): string {
  const prefixo = `P-${ano}-`;
  const numeros = existentes
    .filter((c) => c.startsWith(prefixo))
    .map((c) => Number(c.slice(prefixo.length)))
    .filter((n) => Number.isInteger(n));
  const proximo = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return `${prefixo}${String(proximo).padStart(3, "0")}`;
}

export default async function EditarParticipante({ params }: Props) {
  const { id, pid } = await params;
  const criando = pid === "novo";

  const campanha = await campanhaDoPainel(id);
  if (!campanha) notFound();

  const participante = criando ? null : await participanteDoPainel(pid);
  if (!criando && !participante) notFound();

  const existentes = criando ? (await participantesDoPainel(id)).map((p) => p.codigo_publico) : [];

  return (
    <div>
      <Link
        href={`/admin/apadrinhamento/${id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Campanha {campanha.ano}
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">
        {criando ? "Novo participante" : `Participante ${participante?.codigo_publico}`}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-tinta-suave">
        O formulário está dividido em dois blocos de propósito: o de cima é o que o site mostra, o de
        baixo nunca sai do painel.
      </p>

      <div className="mt-8">
        <FormularioParticipante
          campanhaId={id}
          participante={participante}
          proximoCodigo={proximoCodigo(campanha.ano, existentes)}
        />
      </div>
    </div>
  );
}
