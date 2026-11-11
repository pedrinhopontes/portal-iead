import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { ConfiguracaoPix } from "@/lib/pix";

export type StatusContribuicao = "aguardando" | "confirmada" | "cancelada";

export const rotuloStatusContribuicao: Record<StatusContribuicao, string> = {
  aguardando: "Aguardando o PIX",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
};

export type Contribuicao = {
  id: string;
  tipo: "unica" | "mensal";
  valor: number;
  status: StatusContribuicao;
  referencia: string;
  mensagem: string | null;
  confirmada_em: string | null;
  criado_em: string;
  apoiadores: { nome: string; email: string; telefone: string | null } | null;
};

export type Filiacao = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  motivacao: string | null;
  status: "em_analise" | "aprovada" | "recusada";
  observacao_interna: string | null;
  criado_em: string;
};

/**
 * Dados do PIX guardados em site_settings.
 *
 * Ficam no banco, e não no código, para o Instituto poder trocar a chave pelo
 * painel sem depender de alguém que programe.
 */
export async function configuracaoPix(): Promise<Partial<ConfiguracaoPix> | null> {
  if (!supabaseConfigurado) return null;

  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("site_settings").select("valor").eq("chave", "pix").maybeSingle();

  if (!data?.valor) return null;
  return data.valor as Partial<ConfiguracaoPix>;
}

export async function listarContribuicoes(): Promise<Contribuicao[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("contribuicoes")
    .select("*, apoiadores(nome, email, telefone)")
    .order("criado_em", { ascending: false })
    .limit(200);

  type Linha = Omit<Contribuicao, "apoiadores"> & {
    apoiadores: Contribuicao["apoiadores"] | NonNullable<Contribuicao["apoiadores"]>[];
  };

  return ((data ?? []) as unknown as Linha[]).map((linha) => ({
    ...linha,
    apoiadores: Array.isArray(linha.apoiadores) ? (linha.apoiadores[0] ?? null) : linha.apoiadores,
  }));
}

export async function listarFiliacoes(): Promise<Filiacao[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("filiacoes")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(200);
  return (data as Filiacao[]) ?? [];
}

export function formatarReal(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
