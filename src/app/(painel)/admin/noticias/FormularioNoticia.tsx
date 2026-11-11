"use client";

import Link from "next/link";
import { useActionState } from "react";
import { EnvioDeFotos, type FotoEscolhida } from "./EnvioDeFotos";
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
  capa: FotoEscolhida | null;
  galeria: FotoEscolhida[];
  videoUrl: string | null;
  temMenores: boolean;
  autorizacao: string | null;
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

      {/* ---------- Imagens e vídeo ---------- */}
      <fieldset className="rounded-2xl border border-linha bg-white p-6">
        <legend className="px-2 text-sm font-bold uppercase tracking-wider text-verde-escuro">
          Imagens e vídeo
        </legend>

        <label className="mt-2 block text-sm font-semibold">
          Foto de capa
          <span className="mt-1 block text-xs font-normal text-tinta-suave">
            Aparece no cartão da notícia e na prévia do WhatsApp.
          </span>
        </label>
        <div className="mt-2">
          <EnvioDeFotos nome="capa" umaSo iniciais={noticia.capa ? [noticia.capa] : []} />
        </div>

        <label className="mt-7 block text-sm font-semibold">
          Galeria
          <span className="mt-1 block text-xs font-normal text-tinta-suave">
            Pode escolher várias de uma vez. Com duas ou mais, a notícia mostra um carrossel, na
            ordem em que aparecem aqui.
          </span>
        </label>
        <div className="mt-2">
          <EnvioDeFotos nome="galeria" iniciais={noticia.galeria} />
        </div>

        <div className="mt-7 rounded-xl border-2 border-bordo/30 bg-bordo-suave p-5">
          <label className="flex items-start gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              name="tem_menores"
              defaultChecked={noticia.temMenores}
              className="mt-0.5 h-4 w-4"
            />
            <span>
              Estas fotos mostram crianças ou adolescentes
              <span className="block font-normal text-bordo-escuro">
                Vale para a capa e para a galeria desta notícia.
              </span>
            </span>
          </label>

          <label className="mt-4 block text-sm font-semibold">
            Termo de autorização de imagem
            <input
              name="autorizacao"
              defaultValue={noticia.autorizacao ?? ""}
              placeholder="ex.: Termo coletivo Cantata de Natal, 2026"
              className="mt-1 w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
            />
            <span className="mt-1 block text-xs font-normal text-bordo-escuro">
              Obrigatório se a caixa acima estiver marcada. O banco recusa a foto sem isto — não é
              uma formalidade desta tela.
            </span>
          </label>
        </div>

        <label className="mt-7 flex flex-col gap-1.5 text-sm font-semibold">
          Vídeo
          <input
            name="video_url"
            type="url"
            defaultValue={noticia.videoUrl ?? ""}
            placeholder="https://www.youtube.com/watch?v=..."
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Cole o endereço do vídeo no YouTube, Instagram ou Facebook. O arquivo não é hospedado
            aqui: um vídeo de celular consumiria o armazenamento inteiro, e essas plataformas
            entregam de graça e mais rápido.
          </span>
        </label>
      </fieldset>

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
