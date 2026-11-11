import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioUsuario } from "../FormularioUsuario";
import { Icone } from "@/components/ui/Icone";
import { listarUsuarios } from "@/lib/dados/painel-conteudo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id === "novo" ? "Novo usuário" : "Editar usuário" };
}

export default async function EditarUsuario({ params }: Props) {
  const { id } = await params;
  const criando = id === "novo";

  const usuarios = await listarUsuarios();
  const usuario = criando ? null : (usuarios.find((u) => u.id === id) ?? null);

  if (!criando && !usuario) notFound();

  return (
    <div>
      <Link
        href="/admin/usuarios"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todos os usuários
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">
        {criando ? "Novo usuário" : usuario!.nome}
      </h1>

      <div className="mt-8">
        <FormularioUsuario usuario={usuario} />
      </div>
    </div>
  );
}
