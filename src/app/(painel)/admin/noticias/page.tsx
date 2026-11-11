import type { Metadata } from "next";
import Link from "next/link";
import { alternarPublicacao } from "./acoes";
import { Icone } from "@/components/ui/Icone";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export const metadata: Metadata = { title: "Notícias" };

type LinhaNoticia = {
  id: string;
  titulo: string;
  categoria: string;
  data: string | null;
  publicado: boolean;
  atualizado_em: string;
};

function formatar(data: string | null) {
  if (!data) return "Data a confirmar";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default async function ListaNoticias() {
  const supabase = await criarClienteServidor();

  const { data, error } = await supabase
    .from("noticias")
    .select("id, titulo, categoria, data, publicado, atualizado_em")
    .order("atualizado_em", { ascending: false });

  const noticias = (data ?? []) as LinhaNoticia[];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Notícias</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Notícias institucionais, campanhas, projetos e conquistas.
          </p>
        </div>
        <Link
          href="/admin/noticias/nova"
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Nova notícia
        </Link>
      </div>

      {error && (
        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-bold">Não foi possível carregar as notícias.</p>
          <p className="mt-2">
            {error.code === "42P01"
              ? "As tabelas ainda não existem no banco. Rode as migrations da pasta supabase/migrations."
              : error.message}
          </p>
        </div>
      )}

      {!error && noticias.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-10 text-center">
          <Icone nome="documento" className="mx-auto h-8 w-8 text-tinta/30" />
          <p className="mt-3 font-semibold">Nenhuma notícia cadastrada ainda</p>
          <p className="mt-1 text-sm text-tinta-suave">
            A primeira notícia publicada já aparece na página inicial do site.
          </p>
        </div>
      )}

      {noticias.length > 0 && (
        <ul className="mt-8 space-y-3">
          {noticias.map((noticia) => (
            <li
              key={noticia.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-creme px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-tinta-suave">
                    {noticia.categoria}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                      noticia.publicado
                        ? "bg-verde-suave text-verde-escuro"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {noticia.publicado ? "no ar" : "rascunho"}
                  </span>
                  <span className="text-xs text-tinta-suave">{formatar(noticia.data)}</span>
                </div>
                <p className="mt-1.5 truncate font-semibold">{noticia.titulo}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <form action={alternarPublicacao.bind(null, noticia.id, !noticia.publicado)}>
                  <button
                    type="submit"
                    className="rounded-full border border-linha px-4 py-2 text-sm font-semibold hover:border-bordo hover:text-bordo"
                  >
                    {noticia.publicado ? "Tirar do ar" : "Publicar"}
                  </button>
                </form>
                <Link
                  href={`/admin/noticias/${noticia.id}`}
                  className="rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-white hover:bg-bordo"
                >
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
