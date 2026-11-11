"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { StatusApadrinhamento } from "@/lib/dados/painel-apadrinhamento";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoForm = { erro?: string; salvo?: boolean };

function erroLegivel(codigo: string | undefined, mensagem: string): string {
  if (codigo === "23505") return "Já existe um registro com este código ou ano.";
  if (codigo === "42501" || codigo === "PGRST301") return "O seu perfil não tem permissão para esta ação.";
  if (codigo === "23514") return "Algum valor não passou nas regras do banco. Confira os campos.";
  return mensagem;
}

function limpar(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  return texto === "" ? null : texto;
}

function revalidarTudo(campanhaId?: string) {
  revalidatePath("/admin/apadrinhamento");
  if (campanhaId) revalidatePath(`/admin/apadrinhamento/${campanhaId}`);
  revalidatePath("/apadrinhamento");
  revalidatePath("/apadrinhamento/participantes");
}

// -----------------------------------------------------------------------------
// Campanha
// -----------------------------------------------------------------------------
export async function salvarCampanha(_anterior: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const id = String(formData.get("id") ?? "").trim();
  const ano = Number(formData.get("ano"));
  const titulo = String(formData.get("titulo") ?? "").trim();

  if (!Number.isInteger(ano) || ano < 2018 || ano > 2100) return { erro: "Informe um ano válido." };
  if (!titulo) return { erro: "O título da campanha é obrigatório." };

  const horas = Number(formData.get("horas_reserva"));
  const valor = String(formData.get("valor_contribuicao") ?? "").replace(",", ".").trim();

  const dados = {
    ano,
    titulo,
    chamada: limpar(formData.get("chamada")),
    vinculo: limpar(formData.get("vinculo")),
    descricao: limpar(formData.get("descricao")),
    valor_contribuicao: valor === "" ? null : Number(valor),
    prazo_entrega: limpar(formData.get("prazo_entrega")),
    data_evento: limpar(formData.get("data_evento")),
    local_evento: limpar(formData.get("local_evento")),
    observacao: limpar(formData.get("observacao")),
    horas_reserva: Number.isInteger(horas) && horas > 0 ? horas : 48,
    status: String(formData.get("status") ?? "rascunho"),
  };

  const supabase = await criarClienteServidor();

  if (id) {
    const { error } = await supabase.from("campanhas").update(dados).eq("id", id);
    if (error) return { erro: erroLegivel(error.code, error.message) };
    revalidarTudo(id);
    return { salvo: true };
  }

  const { data, error } = await supabase.from("campanhas").insert(dados).select("id").single();
  if (error) return { erro: erroLegivel(error.code, error.message) };
  revalidarTudo();
  redirect(`/admin/apadrinhamento/${data.id}`);
}

// -----------------------------------------------------------------------------
// Participante
// -----------------------------------------------------------------------------
export async function salvarParticipante(_anterior: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const id = String(formData.get("id") ?? "").trim();
  const campanhaId = String(formData.get("campanha_id") ?? "").trim();
  const codigo = String(formData.get("codigo_publico") ?? "").trim().toUpperCase();
  const nomeCompleto = String(formData.get("nome_completo") ?? "").trim();

  if (!campanhaId) return { erro: "Campanha não identificada." };
  if (!codigo) return { erro: "O código público é obrigatório. É por ele que o site identifica o participante." };
  if (!nomeCompleto) return { erro: "O nome completo é obrigatório. Ele fica na área restrita e nunca aparece no site." };

  const idade = Number(formData.get("idade"));

  const publicos = {
    campanha_id: campanhaId,
    codigo_publico: codigo,
    nome_exibicao: limpar(formData.get("nome_exibicao")),
    idade: Number.isInteger(idade) && idade >= 0 ? idade : null,
    projeto: limpar(formData.get("projeto")),
    genero: limpar(formData.get("genero")) ?? "nao_informado",
    tamanho_roupa: limpar(formData.get("tamanho_roupa")),
    tamanho_calcado: limpar(formData.get("tamanho_calcado")),
    sugestao_presente: limpar(formData.get("sugestao_presente")),
    observacao_publica: limpar(formData.get("observacao_publica")),
  };

  const restritos = {
    nome_completo: nomeCompleto,
    responsavel: limpar(formData.get("responsavel")),
    contato: limpar(formData.get("contato")),
    observacoes: limpar(formData.get("observacoes")),
    autorizacao_imagem: limpar(formData.get("autorizacao_imagem")),
  };

  const supabase = await criarClienteServidor();

  let participanteId = id;

  if (id) {
    const { error } = await supabase.from("participantes").update(publicos).eq("id", id);
    if (error) return { erro: erroLegivel(error.code, error.message) };
  } else {
    const { data, error } = await supabase.from("participantes").insert(publicos).select("id").single();
    if (error) return { erro: erroLegivel(error.code, error.message) };
    participanteId = data.id;
  }

  const { error: erroRestrito } = await supabase
    .from("participantes_dados_restritos")
    .upsert({ participante_id: participanteId, ...restritos }, { onConflict: "participante_id" });

  if (erroRestrito) return { erro: erroLegivel(erroRestrito.code, erroRestrito.message) };

  revalidarTudo(campanhaId);
  redirect(`/admin/apadrinhamento/${campanhaId}`);
}

export async function excluirParticipante(campanhaId: string, id: string) {
  const supabase = await criarClienteServidor();
  await supabase.from("participantes").delete().eq("id", id);
  revalidarTudo(campanhaId);
}

// -----------------------------------------------------------------------------
// Reservas
// -----------------------------------------------------------------------------
export async function mudarStatusReserva(
  campanhaId: string,
  apadrinhamentoId: string,
  novo: StatusApadrinhamento,
) {
  const supabase = await criarClienteServidor();
  await supabase.rpc("mudar_status_apadrinhamento", {
    p_apadrinhamento_id: apadrinhamentoId,
    p_novo: novo,
  });
  revalidarTudo(campanhaId);
}

export async function expirarReservasAgora(campanhaId: string) {
  const supabase = await criarClienteServidor();
  await supabase.rpc("expirar_reservas");
  revalidarTudo(campanhaId);
}
