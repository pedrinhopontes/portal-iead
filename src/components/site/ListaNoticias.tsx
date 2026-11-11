import Link from "next/link";
import { CartaoNoticia } from "@/components/site/CartaoNoticia";
import { categoriasDeNoticia, type CategoriaNoticia, type Noticia } from "@/lib/dados/conteudo-tipos";

/**
 * Lista de notícias com filtro por categoria.
 *
 * O filtro é feito por endereço (`/noticias?categoria=Projetos`), não por estado
 * no navegador. Assim cada recorte pode ser compartilhado e indexado, e a lista
 * continua sendo renderizada no servidor.
 */
export function ListaNoticias({
  noticias,
  categoriaAtiva,
}: {
  noticias: Noticia[];
  categoriaAtiva: CategoriaNoticia | null;
}) {
  const visiveis = categoriaAtiva
    ? noticias.filter((n) => n.categoria === categoriaAtiva)
    : noticias;

  const filtros: { rotulo: string; href: string; ativo: boolean }[] = [
    { rotulo: "Todas", href: "/noticias", ativo: categoriaAtiva === null },
    ...categoriasDeNoticia.map((c) => ({
      rotulo: c,
      href: `/noticias?categoria=${encodeURIComponent(c)}`,
      ativo: categoriaAtiva === c,
    })),
  ];

  return (
    <div>
      <nav aria-label="Filtrar notícias por categoria" className="flex flex-wrap gap-2">
        {filtros.map((filtro) => (
          <Link
            key={filtro.href}
            href={filtro.href}
            aria-current={filtro.ativo ? "page" : undefined}
            scroll={false}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filtro.ativo
                ? "border-bordo bg-bordo text-white"
                : "border-linha bg-white text-tinta hover:border-bordo hover:text-bordo"
            }`}
          >
            {filtro.rotulo}
          </Link>
        ))}
      </nav>

      {/* Cada cartão é um h3; sem este h2 a hierarquia pularia do h1 da capa
          direto para o h3, e quem navega por títulos se perde. */}
      <h2 className="sr-only">
        {categoriaAtiva ? `Notícias de ${categoriaAtiva}` : "Todas as notícias"}
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((noticia) => (
          <CartaoNoticia key={noticia.id} noticia={noticia} />
        ))}
      </div>

      {visiveis.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-tinta-suave">
          Nenhuma notícia nesta categoria.
        </p>
      )}
    </div>
  );
}
