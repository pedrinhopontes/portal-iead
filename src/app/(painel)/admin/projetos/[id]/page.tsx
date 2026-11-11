import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioProjeto } from "../FormularioProjeto";
import { Icone } from "@/components/ui/Icone";
import { listarProjetosPainel, projetoPainel } from "@/lib/dados/painel-conteudo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id === "novo" ? "Novo projeto" : "Editar projeto" };
}

export default async function EditarProjeto({ params }: Props) {
  const { id } = await params;
  const criando = id === "novo";

  const projeto = criando ? null : await projetoPainel(id);
  if (!criando && !projeto) notFound();

  const todos = criando ? await listarProjetosPainel() : [];
  const proximaOrdem = todos.length > 0 ? Math.max(...todos.map((p) => p.ordem)) + 1 : 1;

  return (
    <div>
      <Link
        href="/admin/projetos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todos os projetos
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">
        {criando ? "Novo projeto" : projeto!.nome}
      </h1>

      <div className="mt-8">
        <FormularioProjeto projeto={projeto} proximaOrdem={proximaOrdem} />
      </div>
    </div>
  );
}
