import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { AnoHistoria, Indicador, Noticia, Parceiro, Projeto } from "./conteudo-tipos";

export type {
  AnoHistoria,
  CategoriaNoticia,
  Indicador,
  Noticia,
  Parceiro,
  Projeto,
} from "./conteudo-tipos";
export { formatarData, paragrafos, anoTemTexto, categoriasDeNoticia } from "./conteudo-tipos";

/**
 * As consultas abaixo usam a chave pública, então as políticas do banco se
 * aplicam: notícia não publicada, projeto despublicado e campanha em rascunho
 * simplesmente não voltam. A página não precisa filtrar nada.
 */

export async function listarNoticias(): Promise<Noticia[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("noticias")
    .select("id, slug, titulo, resumo, corpo, categoria, data, publicado")
    .order("data", { ascending: false, nullsFirst: false })
    .order("criado_em", { ascending: false });
  return (data as Noticia[]) ?? [];
}

export async function noticiaPorSlug(slug: string): Promise<Noticia | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("noticias")
    .select("id, slug, titulo, resumo, corpo, categoria, data, publicado")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Noticia) ?? null;
}

export async function listarProjetos(): Promise<Projeto[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("projetos")
    .select(
      "id, slug, nome, chamada, publico, faixa_etaria, observacao, resumo, objetivos, atividades, paleta",
    )
    .order("ordem");
  return (data as Projeto[]) ?? [];
}

export async function projetoPorSlug(slug: string): Promise<Projeto | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("projetos")
    .select(
      "id, slug, nome, chamada, publico, faixa_etaria, observacao, resumo, objetivos, atividades, paleta",
    )
    .eq("slug", slug)
    .maybeSingle();
  return (data as Projeto) ?? null;
}

export async function linhaDoTempo(): Promise<AnoHistoria[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("timeline_anos")
    .select("ano, titulo, texto, acontecimentos, destaque")
    .order("ano");
  return (data as AnoHistoria[]) ?? [];
}

export async function listarIndicadores(): Promise<Indicador[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("indicadores")
    .select("rotulo, valor, verificado, fonte")
    .order("ordem");
  return (data as Indicador[]) ?? [];
}

export async function listarParceiros(): Promise<Parceiro[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("parceiros")
    .select("nome, descricao, site")
    .order("ordem");
  return (data as Parceiro[]) ?? [];
}
