"use client";

import Link from "next/link";
import { useActionState } from "react";
import { salvarNoticia, type EstadoFormulario } from "./acoes";

export type NoticiaEditavel = {
  id: string | null;
  titulo: string;
  slug: string;
  resumo: string;
  corpo: string;
  categoria: string;
  data: string | null;
  publicado: boolean;
};

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioNoticia({ noticia }: { noticia: NoticiaEditavel }) {
  const [estado, acao, enviando] = useActionState<EstadoFormulario, FormData>(salvarNoticia, {});

  return (
    <form action={acao} className="max-w-3xl space-y-5">
      {noticia.id && <input type="hidden" name="id" value={noticia.id} />}

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Título
        <input name="titulo" required defaultValue={noticia.titulo} className={campo} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Endereço da página
        <input
          name="slug"
          defaultValue={noticia.slug}
          placeholder="deixe em branco para gerar a partir do título"
          className={`${campo} font-mono text-sm`}
        />
        <span className="text-xs font-normal text-tinta-suave">
          É o que aparece no link compartilhado: iearaujodutra.com.br/noticias/
          <strong className="font-semibold">endereço</strong>. Depois de publicada, mudar o endereço quebra
          os links já compartilhados.
        </span>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Categoria
          <select name="categoria" defaultValue={noticia.categoria || ""} required className={campo}>
            <option value="">Selecione</option>
            <option value="Institucional">Institucional</option>
            <option value="Campanhas">Campanhas</option>
            <option value="Projetos">Projetos</option>
            <option value="Conquistas">Conquistas</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Data do fato
          <input type="date" name="data" defaultValue={noticia.data ?? ""} className={campo} />
          <span className="text-xs font-normal text-tinta-suave">
            Pode ficar em branco. A notícia aparece como &quot;data a confirmar&quot;.
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Resumo
        <textarea name="resumo" required rows={3} defaultValue={noticia.resumo} className={campo} />
        <span className="text-xs font-normal text-tinta-suave">
          Duas ou três linhas. É o que aparece no cartão da notícia e na prévia do WhatsApp.
        </span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Texto da notícia
        <textarea name="corpo" required rows={14} defaultValue={noticia.corpo} className={campo} />
        <span className="text-xs font-normal text-tinta-suave">
          Separe os parágrafos com uma linha em branco.
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-linha bg-white p-4 text-sm">
        <input type="checkbox" name="publicado" defaultChecked={noticia.publicado} className="mt-0.5 h-4 w-4" />
        <span>
          <strong className="font-semibold">Publicar no site</strong>
          <span className="block text-tinta-suave">
            Enquanto estiver desmarcado, a notícia fica salva e visível só aqui no painel.
          </span>
        </span>
      </label>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-bordo px-6 py-3 font-bold text-white transition-colors hover:bg-bordo-escuro disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar"}
        </button>
        <Link
          href="/admin/noticias"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
