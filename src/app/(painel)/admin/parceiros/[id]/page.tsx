import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioParceiro } from "../FormularioParceiro";
import { Icone } from "@/components/ui/Icone";
import { listarParceirosPainel, parceiroPainel } from "@/lib/dados/painel-conteudo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id === "novo" ? "Novo parceiro" : "Editar parceiro" };
}

export default async function EditarParceiro({ params }: Props) {
  const { id } = await params;
  const criando = id === "novo";

  const parceiro = criando ? null : await parceiroPainel(id);
  if (!criando && !parceiro) notFound();

  const todos = criando ? await listarParceirosPainel() : [];
  const proximaOrdem = todos.length > 0 ? Math.max(...todos.map((p) => p.ordem)) + 1 : 1;

  return (
    <div>
      <Link
        href="/admin/parceiros"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todos os parceiros
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">
        {criando ? "Novo parceiro" : parceiro!.nome}
      </h1>

      <div className="mt-8">
        <FormularioParceiro parceiro={parceiro} proximaOrdem={proximaOrdem} />
      </div>
    </div>
  );
}
