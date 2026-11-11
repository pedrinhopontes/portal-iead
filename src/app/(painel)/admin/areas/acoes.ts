"use server";

import { revalidatePath } from "next/cache";
import { AREAS_OCULTAVEIS } from "@/lib/dados/areas";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoAreas = { erro?: string; salvo?: boolean };

/**
 * Grava quais áreas aparecem no site.
 *
 * O formulário manda os endereços que DEVEM aparecer (as caixas marcadas), e
 * aqui a lista é invertida para guardar as ocultas. Guardar as ocultas, e não
 * as visíveis, tem um motivo: quando uma área nova for criada no futuro, ela
 * aparece por padrão em vez de sumir porque ninguém lembrou de marcá-la.
 */
export async function salvarAreas(
  _anterior: EstadoAreas,
  formData: FormData,
): Promise<EstadoAreas> {
  const visiveis = new Set(formData.getAll("visivel").map(String));

  const ocultas = AREAS_OCULTAVEIS.filter((a) => !visiveis.has(a.href)).map((a) => a.href);

  const supabase = await criarClienteServidor();

  // `upsert` em vez de `update`: se a migração 0012 ainda não tiver rodado,
  // um `update` não acharia a linha, não daria erro e a tela diria "salvo"
  // sem ter salvo nada. Esse é o tipo de falha que ninguém percebe na hora.
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        chave: "areas_ocultas",
        valor: { ocultas },
        descricao:
          "Endereços das áreas que não aparecem no menu, no rodapé, no mapa do site nem na página inicial. A página em si continua respondendo.",
      },
      { onConflict: "chave" },
    );

  if (error) {
    if (error.code === "42501" || error.code === "PGRST301") {
      return { erro: "O seu perfil não tem permissão para alterar o que aparece no site." };
    }
    return { erro: error.message };
  }

  // O menu está em todas as páginas: o layout inteiro precisa ser refeito.
  revalidatePath("/", "layout");
  revalidatePath("/admin/areas");

  return { salvo: true };
}
