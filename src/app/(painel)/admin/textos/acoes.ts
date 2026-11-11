"use server";

import { revalidatePath } from "next/cache";
import { TEXTOS, type ChaveDeTexto } from "@/content/textos";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoTextos = { erro?: string; salvos?: number; restaurados?: number };

/**
 * Grava os textos de uma página.
 *
 * Guarda só o que FOI MUDADO. Campo igual ao padrão, ou em branco, apaga a
 * linha em vez de gravar uma cópia do original — assim o banco contém a
 * diferença, e mexer no texto padrão no código passa a valer automaticamente
 * para quem nunca editou aquele campo.
 */
export async function salvarTextos(
  _anterior: EstadoTextos,
  formData: FormData,
): Promise<EstadoTextos> {
  const chaves = formData.getAll("chave").map(String) as ChaveDeTexto[];

  const paraGravar: { chave: string; valor: string }[] = [];
  const paraApagar: string[] = [];

  for (const chave of chaves) {
    const definicao = TEXTOS[chave];
    if (!definicao) continue;

    const valor = String(formData.get(`valor:${chave}`) ?? "").trim();

    if (!valor || valor === definicao.padrao.trim()) paraApagar.push(chave);
    else paraGravar.push({ chave, valor });
  }

  const supabase = await criarClienteServidor();

  if (paraGravar.length > 0) {
    const { error } = await supabase
      .from("textos_site")
      .upsert(paraGravar, { onConflict: "chave" });

    if (error) {
      if (error.code === "42501" || error.code === "PGRST301") {
        return { erro: "O seu perfil não tem permissão para alterar os textos do site." };
      }
      if (error.code === "42P01") {
        return { erro: "A tabela de textos ainda não existe. Rode supabase/aplicar-textos.sql." };
      }
      return { erro: error.message };
    }
  }

  if (paraApagar.length > 0) {
    const { error } = await supabase.from("textos_site").delete().in("chave", paraApagar);
    if (error) return { erro: error.message };
  }

  // Os textos estão em páginas de todo o site; o layout inteiro é refeito.
  revalidatePath("/", "layout");
  revalidatePath("/admin/textos");

  return { salvos: paraGravar.length, restaurados: paraApagar.length };
}
