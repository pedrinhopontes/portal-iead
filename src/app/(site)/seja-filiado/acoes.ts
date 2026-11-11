"use server";

import { configuracaoPix } from "@/lib/dados/apoio";
import { montarCodigoPix, pixConfigurado, qrCodeSvg } from "@/lib/pix";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoContribuicao = {
  erro?: string;
  sucesso?: boolean;
  referencia?: string;
  valor?: number;
  tipo?: "unica" | "mensal";
  codigoPix?: string;
  qrSvg?: string;
  pixPendente?: boolean;
};

type RespostaRpc = { sucesso: boolean; mensagem: string; referencia: string | null };

/** Aceita "50", "50,00" e "R$ 50,00". */
function lerValor(bruto: string): number | null {
  const limpo = bruto
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const numero = Number(limpo);
  return Number.isFinite(numero) && numero > 0 ? Math.round(numero * 100) / 100 : null;
}

export async function contribuir(
  _anterior: EstadoContribuicao,
  formData: FormData,
): Promise<EstadoContribuicao> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "");
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const consentimento = formData.get("consentimento") === "on";

  const escolhido = String(formData.get("valor") ?? "");
  const outro = String(formData.get("valor_outro") ?? "");
  const valor = lerValor(escolhido === "outro" ? outro : escolhido);

  if (!valor) return { erro: "Informe um valor maior que zero." };
  if (tipo !== "unica" && tipo !== "mensal") return { erro: "Escolha entre contribuição única ou mensal." };
  if (!consentimento) {
    return { erro: "Para seguir, é preciso autorizar o uso dos seus dados para registrar a contribuição." };
  }

  const supabase = await criarClienteServidor();

  const { data, error } = await supabase.rpc("registrar_contribuicao", {
    p_nome: nome,
    p_email: email,
    p_telefone: telefone,
    p_tipo: tipo,
    p_valor: valor,
    p_mensagem: mensagem,
  });

  if (error) {
    return { erro: "Não foi possível registrar agora. Tente de novo em alguns instantes." };
  }

  const resposta = (Array.isArray(data) ? data[0] : data) as RespostaRpc | undefined;

  if (!resposta?.sucesso || !resposta.referencia) {
    return { erro: resposta?.mensagem ?? "Não foi possível registrar a contribuição." };
  }

  // Gera o código do PIX, se o Instituto já cadastrou a chave.
  const config = await configuracaoPix();

  if (!pixConfigurado(config)) {
    return {
      sucesso: true,
      referencia: resposta.referencia,
      valor,
      tipo: tipo as "unica" | "mensal",
      pixPendente: true,
    };
  }

  const codigoPix = montarCodigoPix({ ...config, valor, referencia: resposta.referencia });

  return {
    sucesso: true,
    referencia: resposta.referencia,
    valor,
    tipo: tipo as "unica" | "mensal",
    codigoPix,
    qrSvg: await qrCodeSvg(codigoPix),
  };
}

export type EstadoFiliacao = { erro?: string; sucesso?: boolean };

export async function pedirFiliacao(
  _anterior: EstadoFiliacao,
  formData: FormData,
): Promise<EstadoFiliacao> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const motivacao = String(formData.get("motivacao") ?? "").trim();

  if (formData.get("consentimento") !== "on") {
    return { erro: "Para seguir, é preciso autorizar o uso dos seus dados na análise do pedido." };
  }

  const supabase = await criarClienteServidor();

  const { data, error } = await supabase.rpc("registrar_filiacao", {
    p_nome: nome,
    p_email: email,
    p_telefone: telefone,
    p_motivacao: motivacao,
  });

  if (error) return { erro: "Não foi possível registrar agora. Tente de novo em alguns instantes." };

  const resposta = (Array.isArray(data) ? data[0] : data) as { sucesso: boolean; mensagem: string } | undefined;

  if (!resposta?.sucesso) return { erro: resposta?.mensagem ?? "Não foi possível registrar o pedido." };

  return { sucesso: true };
}
