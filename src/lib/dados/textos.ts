import { cookies } from "next/headers";
import { cache } from "react";
import { TEXTOS, type ChaveDeTexto } from "@/content/textos";
import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/**
 * Textos do site, com o padrão no código e a alteração no banco.
 *
 * A tabela `textos_site` guarda só o que o Instituto mudou. Chave sem linha no
 * banco usa o padrão de `src/content/textos.ts`, e apagar a linha devolve o
 * original. O banco guarda a diferença, não o conteúdo inteiro — por isso o
 * site funciona igual com a tabela vazia, e nenhuma página quebra se o banco
 * estiver fora do ar.
 */
const alteracoes = cache(async (): Promise<Map<string, string>> => {
  const mapa = new Map<string, string>();
  if (!supabaseConfigurado) return mapa;

  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("textos_site").select("chave, valor");

  for (const linha of (data ?? []) as { chave: string; valor: string }[]) {
    if (linha.valor.trim()) mapa.set(linha.chave, linha.valor);
  }
  return mapa;
});

/** Nome do cookie que leva o rascunho do painel até a prévia. */
export const COOKIE_PREVIA = "previa-textos";

/**
 * O rascunho que o painel está digitando AGORA, se houver.
 *
 * A prévia é a página pública de verdade, renderizada no servidor — então o
 * texto que ainda não foi salvo precisa chegar até lá de alguma forma. Vai num
 * cookie, com apenas os campos que mudaram: quem está editando mexe em um ou
 * dois por vez, e isso cabe de sobra no limite de 4 KB.
 *
 * Só vale para quem está autenticado no painel. Um visitante que forjasse o
 * cookie veria um texto diferente apenas no próprio navegador, mas a checagem
 * evita que a página pública dependa de dado vindo do cliente.
 */
const rascunhoDaPrevia = cache(async (): Promise<Map<string, string>> => {
  const vazio = new Map<string, string>();
  if (!supabaseConfigurado) return vazio;

  const cru = (await cookies()).get(COOKIE_PREVIA)?.value;
  if (!cru) return vazio;

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return vazio;

  try {
    const objeto = JSON.parse(decodeURIComponent(cru)) as Record<string, unknown>;
    const mapa = new Map<string, string>();
    for (const [chave, valor] of Object.entries(objeto)) {
      if (typeof valor === "string" && chave in TEXTOS) mapa.set(chave, valor);
    }
    return mapa;
  } catch {
    return vazio;
  }
});

export type LeitorDeTextos = (chave: ChaveDeTexto) => string;

/**
 * Carrega os textos de uma vez e devolve o leitor.
 *
 * Usado no topo de cada página: `const t = await carregarTextos();` e depois
 * `t("apadrinhamento.o-que-e.titulo")`. Uma consulta por requisição, graças ao
 * `cache` do React, mesmo que vinte componentes peçam.
 */
export async function carregarTextos(): Promise<LeitorDeTextos> {
  const [mudados, rascunho] = await Promise.all([alteracoes(), rascunhoDaPrevia()]);

  // Ordem: o que está sendo digitado vence o que está salvo, que vence o padrão.
  return (chave) => rascunho.get(chave) ?? mudados.get(chave) ?? TEXTOS[chave].padrao;
}

/** Tudo o que o painel precisa para listar e editar. */
export async function textosParaOPainel() {
  const mudados = await alteracoes();

  return (Object.keys(TEXTOS) as ChaveDeTexto[]).map((chave) => ({
    chave,
    ...TEXTOS[chave],
    valor: mudados.get(chave) ?? null,
    alterado: mudados.has(chave),
  }));
}
