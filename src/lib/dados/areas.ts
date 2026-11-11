import { cache } from "react";
import { menuPrincipal, type ItemDeMenu } from "@/lib/navegacao";
import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/**
 * Quais áreas do site o Instituto escolheu não anunciar ainda.
 *
 * Uma aba que leva a uma página vazia é pior do que aba nenhuma: quem clica
 * conclui que o Instituto não tem projetos, ou não presta contas. Esconder a
 * área diz a verdade — ainda não há o que mostrar — sem afirmar o contrário.
 *
 * `cache` do React garante uma consulta por requisição, mesmo que o cabeçalho,
 * o rodapé e cinco seções da home perguntem a mesma coisa.
 */
export const areasOcultas = cache(async (): Promise<string[]> => {
  if (!supabaseConfigurado) return [];

  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("site_settings")
    .select("valor")
    .eq("chave", "areas_ocultas")
    .maybeSingle();

  const valor = data?.valor as { ocultas?: unknown } | null;
  if (!valor || !Array.isArray(valor.ocultas)) return [];

  return valor.ocultas.filter((h): h is string => typeof h === "string");
});

/** A área está visível? Endereço desconhecido é sempre visível. */
export async function areaVisivel(href: string): Promise<boolean> {
  return !(await areasOcultas()).includes(href);
}

export type { ItemDeMenu };

/** O menu principal já sem as áreas ocultas. */
export async function menuVisivel(): Promise<ItemDeMenu[]> {
  const ocultas = await areasOcultas();
  return menuPrincipal.filter((item) => !ocultas.includes(item.href));
}

/**
 * Áreas que o Instituto pode esconder.
 *
 * "Início" e "Contato" ficam de fora da lista de propósito: um site sem porta
 * de entrada e sem forma de falar com o Instituto não serve para nada, e não
 * é o tipo de decisão que deve caber num botão de liga-desliga.
 */
export const AREAS_OCULTAVEIS: ItemDeMenu[] = menuPrincipal.filter(
  (item) => item.href !== "/" && item.href !== "/contato",
);
