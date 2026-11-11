"use server";

import { revalidatePath } from "next/cache";
import { problemasDaConfiguracao } from "@/lib/pix";
import { criarClienteServidor, usuarioDoPainel } from "@/lib/supabase/servidor";

export type EstadoPix = { erro?: string; salvo?: boolean };

function revalidar() {
  revalidatePath("/admin/contribuicoes");
  revalidatePath("/seja-filiado");
  revalidatePath("/apoie");
}

export async function confirmarContribuicao(id: string) {
  const supabase = await criarClienteServidor();
  const eu = await usuarioDoPainel();

  await supabase
    .from("contribuicoes")
    .update({ status: "confirmada", confirmada_em: new Date().toISOString(), confirmada_por: eu?.id ?? null })
    .eq("id", id);

  revalidar();
}

export async function cancelarContribuicao(id: string) {
  const supabase = await criarClienteServidor();
  await supabase.from("contribuicoes").update({ status: "cancelada" }).eq("id", id);
  revalidar();
}

export async function mudarStatusFiliacao(id: string, status: "em_analise" | "aprovada" | "recusada") {
  const supabase = await criarClienteServidor();
  await supabase.from("filiacoes").update({ status }).eq("id", id);
  revalidar();
}

/**
 * Guarda os dados do PIX.
 *
 * A validação é dura de propósito: chave errada ou nome cortado produzem um QR
 * Code que leva o dinheiro para o lugar errado, ou que o banco recusa. Melhor
 * recusar aqui do que descobrir depois que ninguém conseguiu doar.
 */
export async function salvarPix(_anterior: EstadoPix, formData: FormData): Promise<EstadoPix> {
  const config = {
    chave: String(formData.get("chave") ?? "").trim(),
    nome: String(formData.get("nome") ?? "").trim(),
    cidade: String(formData.get("cidade") ?? "").trim(),
  };

  const problemas = problemasDaConfiguracao(config);
  if (problemas.length > 0) return { erro: problemas.join(" ") };

  const supabase = await criarClienteServidor();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ chave: "pix", valor: config }, { onConflict: "chave" });

  if (error) {
    if (error.code === "42501" || error.code === "PGRST301") {
      return { erro: "O seu perfil não tem permissão para alterar as configurações." };
    }
    return { erro: error.message };
  }

  revalidar();
  return { salvo: true };
}
