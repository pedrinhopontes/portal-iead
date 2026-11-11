"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoReserva = {
  erro?: string;
  sucesso?: boolean;
  expiraEm?: string;
};

type RespostaReserva = {
  sucesso: boolean;
  mensagem: string;
  token: string | null;
  expira_em: string | null;
};

/**
 * Reserva um participante.
 *
 * Quem decide é o banco, não esta função: a `reservar_participante` bloqueia a
 * linha do participante, confere o estado e grava a reserva numa única transação.
 * Se duas pessoas clicarem no mesmo instante, uma recebe a reserva e a outra
 * recebe um recado — nunca as duas.
 */
export async function reservar(
  _anterior: EstadoReserva,
  formData: FormData,
): Promise<EstadoReserva> {
  const participanteId = String(formData.get("participanteId") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "");
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const consentimento = formData.get("consentimento") === "on";

  if (!participanteId) return { erro: "Participante não identificado." };
  if (!consentimento) {
    return { erro: "Para seguir, é preciso autorizar o uso dos seus dados para organizar a entrega." };
  }

  const supabase = await criarClienteServidor();

  const { data, error } = await supabase.rpc("reservar_participante", {
    p_participante_id: participanteId,
    p_nome: nome,
    p_email: email,
    p_telefone: telefone,
    p_tipo: tipo,
    p_mensagem: mensagem,
  });

  if (error) {
    return { erro: "Não foi possível registrar a reserva agora. Tente de novo em alguns instantes." };
  }

  const resposta = (Array.isArray(data) ? data[0] : data) as RespostaReserva | undefined;

  if (!resposta?.sucesso) {
    return { erro: resposta?.mensagem ?? "Não foi possível registrar a reserva." };
  }

  revalidatePath("/apadrinhamento/participantes");

  return { sucesso: true, expiraEm: resposta.expira_em ?? undefined };
}
