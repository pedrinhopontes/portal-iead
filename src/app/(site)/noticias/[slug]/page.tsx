import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { formatarData, noticiaPorSlug, paragrafos } from "@/lib/dados/conteudo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await noticiaPorSlug(slug);
  if (!noticia) return { title: "Notícia não encontrada" };
  return { title: noticia.titulo, description: noticia.resumo };
}

export default async function PaginaNoticia({ params }: Props) {
  const { slug } = await params;
  const noticia = await noticiaPorSlug(slug);

  if (!noticia) notFound();

  return (
    <article>
      <section className="border-b border-linha bg-creme">
        <Container estreito className="py-14 sm:py-20">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
          >
            <Icone nome="seta" className="h-4 w-4 rotate-180" />
            Todas as notícias
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Etiqueta tom="bordo">{noticia.categoria}</Etiqueta>
            <span className="text-sm font-semibold text-tinta-suave">{formatarData(noticia.data)}</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {noticia.titulo}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-tinta-suave">{noticia.resumo}</p>
        </Container>
      </section>

      <Secao fundo="branco">
        <Container estreito>
          <Foto
            slot={`noticia-${noticia.slug}-capa`}
            proporcao="16/9"
            legenda="Imagem principal da notícia"
            tamanhos="(max-width: 768px) 100vw, 720px"
          />

          <div className="mt-10 space-y-5 text-lg leading-relaxed text-tinta-suave">
            {paragrafos(noticia.corpo).map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-linha bg-areia p-6">
            <p className="font-semibold">Compartilhe esta notícia</p>
            <p className="mt-1 text-sm text-tinta-suave">
              Cada notícia tem endereço próprio, o que facilita o compartilhamento no WhatsApp e nas redes
              sociais.
            </p>
            <code className="mt-3 block overflow-x-auto rounded-lg bg-white px-4 py-2.5 text-sm text-tinta-suave">
              iearaujodutra.com.br/noticias/{noticia.slug}
            </code>
          </div>
        </Container>
      </Secao>
    </article>
  );
}
