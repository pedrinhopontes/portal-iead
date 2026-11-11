import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorDePagina } from "../EditorDePagina";
import type { TextoEditavel } from "../tipos";
import { Icone } from "@/components/ui/Icone";
import { paginaPorSlug } from "@/content/textos";
import { textosParaOPainel } from "@/lib/dados/textos";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pagina = paginaPorSlug(slug);
  return { title: pagina ? `Textos — ${pagina.nome}` : "Textos do site" };
}

export default async function TextosDaPagina({ params }: Props) {
  const { slug } = await params;
  const pagina = paginaPorSlug(slug);
  if (!pagina) notFound();

  const todos = (await textosParaOPainel()) as TextoEditavel[];
  const textos = todos.filter((t) => t.pagina === pagina.nome);

  return (
    <div>
      <Link
        href="/admin/textos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todas as páginas
      </Link>

      <h1 className="mt-4 font-serif text-3xl font-semibold">{pagina.nome}</h1>
      <p className="mt-1 text-sm text-tinta-suave">
        Mude o texto no campo e clique em salvar: a página ao lado se atualiza. Apagar um campo
        devolve o texto original — nada se perde.
      </p>

      {textos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-sm text-tinta-suave">
          Esta página ainda não teve os textos preparados para edição.
        </p>
      ) : (
        <EditorDePagina textos={textos} url={pagina.url} />
      )}
    </div>
  );
}
