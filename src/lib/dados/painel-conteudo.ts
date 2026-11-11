import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { AnoHistoria, Indicador, Parceiro, Projeto } from "./conteudo-tipos";

/**
 * Consultas do painel.
 *
 * Diferente das públicas, estas enxergam também o que não está publicado — não
 * por passarem por cima das regras, mas porque as políticas de escrita do banco
 * dão acesso de leitura total a quem tem o perfil certo.
 */

export type ProjetoPainel = Projeto & { ordem: number; publicado: boolean };
export type ParceiroPainel = Parceiro & { id: string; ordem: number; publicado: boolean };
export type IndicadorPainel = Indicador & { id: string; ordem: number };
export type AnoPainel = AnoHistoria & { publicado: boolean };

export type UsuarioPainel = {
  id: string;
  nome: string;
  email: string;
  perfil: "admin" | "comunicacao" | "financeiro" | "coordenador";
  ativo: boolean;
  criado_em: string;
};

export type RegistroAuditoria = {
  id: number;
  tabela: string;
  registro_id: string | null;
  operacao: "INSERT" | "UPDATE" | "DELETE";
  usuario_email: string | null;
  em: string;
};

export async function listarProjetosPainel(): Promise<ProjetoPainel[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("projetos").select("*").order("ordem");
  return (data as ProjetoPainel[]) ?? [];
}

export async function projetoPainel(id: string): Promise<ProjetoPainel | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("projetos").select("*").eq("id", id).maybeSingle();
  return (data as ProjetoPainel) ?? null;
}

export async function listarAnosPainel(): Promise<AnoPainel[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("timeline_anos").select("*").order("ano");
  return (data as AnoPainel[]) ?? [];
}

export async function anoPainel(ano: number): Promise<AnoPainel | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("timeline_anos").select("*").eq("ano", ano).maybeSingle();
  return (data as AnoPainel) ?? null;
}

export async function listarParceirosPainel(): Promise<ParceiroPainel[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("parceiros").select("*").order("ordem");
  return (data as ParceiroPainel[]) ?? [];
}

export async function parceiroPainel(id: string): Promise<ParceiroPainel | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("parceiros").select("*").eq("id", id).maybeSingle();
  return (data as ParceiroPainel) ?? null;
}

export async function listarIndicadoresPainel(): Promise<IndicadorPainel[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("indicadores").select("*").order("ordem");
  return (data as IndicadorPainel[]) ?? [];
}

export async function listarUsuarios(): Promise<UsuarioPainel[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("usuarios_admin")
    .select("id, nome, email, perfil, ativo, criado_em")
    .order("criado_em");
  return (data as UsuarioPainel[]) ?? [];
}

export async function listarAuditoria(limite = 100): Promise<RegistroAuditoria[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("log_auditoria")
    .select("id, tabela, registro_id, operacao, usuario_email, em")
    .order("em", { ascending: false })
    .limit(limite);
  return (data as RegistroAuditoria[]) ?? [];
}
