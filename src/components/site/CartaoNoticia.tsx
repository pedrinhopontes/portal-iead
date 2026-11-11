import Image from "next/image";
import Link from "next/link";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Foto } from "@/components/ui/Foto";
import { formatarData, type Noticia } from "@/lib/dados/conteudo-tipos";

export function CartaoNoticia({ noticia }: { noticia: Noticia }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-linha bg-white transition-shadow hover:shadow-lg">
      {noticia.capa ? (
        <div className="relative aspect-[16/9] border-b border-linha bg-creme">
          <Image
            src={noticia.capa.caminho}
            alt={noticia.capa.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
            className="object-cover"
          />
        </div>
      ) : (
        <Foto
          slot={`noticia-${noticia.slug}-capa`}
          legenda="Imagem de capa da notícia"
          proporcao="16/9"
          raio="rounded-none"
          className="border-b border-linha"
          tamanhos="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Etiqueta tom="bordo">{noticia.categoria}</Etiqueta>
          <span className="text-xs font-semibold text-tinta-suave">{formatarData(noticia.data)}</span>
        </div>

        <h3 className="mt-3 text-lg font-semibold">
          <Link href={`/noticias/${noticia.slug}`} className="hover:text-bordo">
            {noticia.titulo}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-tinta-suave">{noticia.resumo}</p>

        <Link
          href={`/noticias/${noticia.slug}`}
          className="mt-4 text-sm font-bold text-bordo hover:text-bordo-escuro"
        >
          Ler a notícia
        </Link>
      </div>
    </article>
  );
}
