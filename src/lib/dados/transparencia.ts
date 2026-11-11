import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { Documento, LinhaFinanceira, ResumoAnual } from "./transparencia-tipos";

export * from "./transparencia-tipos";

export async function listarDocumentos(): Promise<Documento[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("transparencia_documentos")
    .select("*")
    .order("ano", { ascending: false, nullsFirst: false })
    .order("publicado_em", { ascending: false });
  return (data as Documento[]) ?? [];
}

export async function listarFinancas(): Promise<LinhaFinanceira[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("financas_anuais")
    .select("ano, categoria, natureza, valor, fonte")
    .order("ano");
  return ((data as LinhaFinanceira[]) ?? []).map((l) => ({ ...l, valor: Number(l.valor) }));
}

/** Agrupa os lançamentos por ano, somando receitas e despesas. */
export function resumirPorAno(linhas: LinhaFinanceira[]): ResumoAnual[] {
  const porAno = new Map<number, ResumoAnual>();

  for (const linha of linhas) {
    const atual = porAno.get(linha.ano) ?? { ano: linha.ano, receitas: 0, despesas: 0 };
    if (linha.natureza === "receita") atual.receitas += linha.valor;
    else atual.despesas += linha.valor;
    porAno.set(linha.ano, atual);
  }

  return [...porAno.values()].sort((a, b) => a.ano - b.ano);
}

/**
 * Data em que o portal foi atualizado pela última vez.
 *
 * Considera tanto a publicação de documentos quanto a atualização dos valores:
 * quem consulta quer saber se a informação é recente, não qual tabela mudou.
 */
export async function ultimaAtualizacao(): Promise<string | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();

  const [documentos, financas] = await Promise.all([
    supabase
      .from("transparencia_documentos")
      .select("atualizado_em")
      .order("atualizado_em", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("financas_anuais")
      .select("atualizado_em")
      .order("atualizado_em", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const datas = [documentos.data?.atualizado_em, financas.data?.atualizado_em].filter(
    (d): d is string => Boolean(d),
  );

  if (datas.length === 0) return null;
  return datas.sort().reverse()[0];
}
