import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotaoExcluir } from "./BotaoExcluir";
import { FormularioNoticia, type NoticiaEditavel } from "../FormularioNoticia";
import { Icone } from "@/components/ui/Icone";
import { criarClienteServidor } from "@/lib/supabase/servidor";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id === "nova" ? "Nova notícia" : "Editar notícia" };
}

const vazia: NoticiaEditavel = {
  id: null,
  titulo: "",
  slug: "",
  resumo: "",
  corpo: "",
  categoria: "",
  data: null,
  publicado: false,
};

export default async function EditarNoticia({ params }: Props) {
  const { id } = await params;
  const criando = id === "nova";

  let noticia = vazia;

  if (!criando) {
    const supabase = await criarClienteServidor();
    const { data } = await supabase
      .from("noticias")
      .select("id, titulo, slug, resumo, corpo, categoria, data, publicado")
      .eq("id", id)
      .maybeSingle();

    if (!data) notFound();
    noticia = data as NoticiaEditavel;
  }

  return (
    <div>
      <Link
        href="/admin/noticias"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todas as notícias
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">
          {criando ? "Nova notícia" : "Editar notícia"}
        </h1>
        {!criando && noticia.id && <BotaoExcluir id={noticia.id} titulo={noticia.titulo} />}
      </div>

      <div className="mt-8">
        <FormularioNoticia noticia={noticia} />
      </div>
    </div>
  );
}
