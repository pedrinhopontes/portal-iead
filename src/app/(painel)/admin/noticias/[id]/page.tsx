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
  capa: null,
  galeria: [],
  videoUrl: null,
  temMenores: false,
  autorizacao: null,
};

type MidiaDaNoticia = { caminho: string; alt: string; tem_menores: boolean; autorizacao: string | null };

/** O cliente tipa relação embutida como lista; a capa é sempre uma só. */
function umaSo<T>(valor: T | T[] | null): T | null {
  return (Array.isArray(valor) ? valor[0] : valor) ?? null;
}

export default async function EditarNoticia({ params }: Props) {
  const { id } = await params;
  const criando = id === "nova";

  let noticia = vazia;

  if (!criando) {
    const supabase = await criarClienteServidor();
    const { data } = await supabase
      .from("noticias")
      .select(
        "id, titulo, slug, resumo, corpo, categoria, data, publicado, video_url, " +
          "capa:midias(caminho, alt, tem_menores, autorizacao)",
      )
      .eq("id", id)
      .maybeSingle();

    if (!data) notFound();

    // O cliente do Supabase não resolve o tipo da relação embutida sem os
    // tipos gerados do banco; a forma é conhecida e está declarada aqui.
    const linha = data as unknown as NoticiaEditavel & {
      video_url: string | null;
      capa: MidiaDaNoticia | MidiaDaNoticia[] | null;
    };

    const { data: daGaleria } = await supabase
      .from("noticia_midias")
      .select("ordem, midias(caminho, alt)")
      .eq("noticia_id", id)
      .order("ordem");

    const capa = umaSo(linha.capa);

    const galeria = ((daGaleria ?? []) as { midias: unknown }[])
      .map((l) => umaSo(l.midias as MidiaDaNoticia | MidiaDaNoticia[] | null))
      .filter((m): m is MidiaDaNoticia => m !== null)
      .map((m) => ({ caminho: m.caminho, alt: m.alt, nomeOriginal: m.caminho.split("/").pop() ?? "" }));

    noticia = {
      ...linha,
      capa: capa
        ? { caminho: capa.caminho, alt: capa.alt, nomeOriginal: capa.caminho.split("/").pop() ?? "" }
        : null,
      galeria,
      videoUrl: linha.video_url,
      // A marcação vale para o conjunto: vem da capa, ou da primeira da galeria.
      temMenores: capa?.tem_menores ?? false,
      autorizacao: capa?.autorizacao ?? null,
    };
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
