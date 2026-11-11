import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { Campanha, EstadoParticipante } from "./apadrinhamento-tipos";

export type StatusApadrinhamento =
  | "reservado"
  | "confirmado"
  | "presente_recebido"
  | "concluido"
  | "cancelado"
  | "expirado";

export const rotuloStatusReserva: Record<StatusApadrinhamento, string> = {
  reservado: "Reservado",
  confirmado: "Confirmado",
  presente_recebido: "Presente recebido",
  concluido: "Concluído",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

export type ResumoCampanha = Campanha & {
  total: number;
  disponiveis: number;
  pendentes: number;
  apadrinhados: number;
};

export type DadosRestritos = {
  nome_completo: string;
  responsavel: string | null;
  contato: string | null;
  observacoes: string | null;
  autorizacao_imagem: string | null;
};

export type ParticipanteAdmin = {
  id: string;
  campanha_id: string;
  codigo_publico: string;
  idade: number | null;
  projeto: string | null;
  genero: "menina" | "menino" | "nao_informado" | null;
  tamanho_roupa: string | null;
  tamanho_calcado: string | null;
  sugestao_presente: string | null;
  estado: EstadoParticipante;
  participantes_dados_restritos: DadosRestritos | null;
};

export type Reserva = {
  id: string;
  participante_id: string;
  padrinho_nome: string;
  padrinho_email: string;
  padrinho_telefone: string | null;
  tipo: "presente" | "financeiro";
  mensagem: string | null;
  status: StatusApadrinhamento;
  reserva_expira_em: string;
  criado_em: string;
  participantes: { codigo_publico: string } | null;
};

export async function campanhasDoPainel(): Promise<ResumoCampanha[]> {
  const supabase = await criarClienteServidor();

  const { data: campanhas } = await supabase.from("campanhas").select("*").order("ano", { ascending: false });
  if (!campanhas) return [];

  const { data: participantes } = await supabase.from("participantes").select("campanha_id, estado");

  return (campanhas as Campanha[]).map((c) => {
    const meus = (participantes ?? []).filter(
      (p) => (p as { campanha_id: string }).campanha_id === c.id,
    ) as { estado: EstadoParticipante }[];

    return {
      ...c,
      total: meus.length,
      disponiveis: meus.filter((p) => p.estado === "disponivel").length,
      pendentes: meus.filter((p) => p.estado === "reserva_pendente").length,
      apadrinhados: meus.filter((p) =>
        ["apadrinhado", "presente_recebido", "concluido"].includes(p.estado),
      ).length,
    };
  });
}

export async function campanhaDoPainel(id: string): Promise<Campanha | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("campanhas").select("*").eq("id", id).maybeSingle();
  return (data as Campanha) ?? null;
}

/**
 * Participantes com os dados restritos juntos.
 *
 * Esta consulta só devolve os dados pessoais porque quem a executa está
 * autenticado com perfil de admin ou coordenação. Para qualquer outro perfil, as
 * políticas do banco devolvem o campo vazio.
 */
export async function participantesDoPainel(campanhaId: string): Promise<ParticipanteAdmin[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("participantes")
    .select("*, participantes_dados_restritos(*)")
    .eq("campanha_id", campanhaId)
    .order("codigo_publico");
  return (data as ParticipanteAdmin[]) ?? [];
}

export async function participanteDoPainel(id: string): Promise<ParticipanteAdmin | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("participantes")
    .select("*, participantes_dados_restritos(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as ParticipanteAdmin) ?? null;
}

export async function reservasDaCampanha(campanhaId: string): Promise<Reserva[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("apadrinhamentos")
    .select("*, participantes!inner(codigo_publico, campanha_id)")
    .eq("participantes.campanha_id", campanhaId)
    .order("criado_em", { ascending: false });
  return (data as Reserva[]) ?? [];
}

export function formatarDataHora(valor: string | null): string {
  if (!valor) return "—";
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
