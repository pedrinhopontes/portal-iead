import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { Campanha, ParticipantePublico } from "./apadrinhamento-tipos";

export type { Campanha, ParticipantePublico, EstadoParticipante } from "./apadrinhamento-tipos";
export { rotuloEstado, formatarPrazo, formatarValor } from "./apadrinhamento-tipos";

const CAMPOS_PUBLICOS =
  "id, codigo_publico, idade, projeto, genero, tamanho_roupa, tamanho_calcado, sugestao_presente, estado";

export async function campanhaVigente(): Promise<Campanha | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("campanhas")
    .select("*")
    .eq("status", "aberta")
    .order("ano", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Campanha) ?? null;
}

export async function campanhaPorAno(ano: number): Promise<Campanha | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("campanhas").select("*").eq("ano", ano).maybeSingle();
  return (data as Campanha) ?? null;
}

export async function campanhasAnteriores(): Promise<Campanha[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("campanhas")
    .select("*")
    .neq("status", "aberta")
    .order("ano", { ascending: false });
  return (data as Campanha[]) ?? [];
}

/**
 * Participantes de uma campanha.
 *
 * Antes de listar, devolve à vitrine quem teve a reserva vencida. É barato e
 * garante que ninguém veja como "reservado" alguém que já está livre de novo.
 * Em produção, convém também agendar `expirar_reservas()` no banco.
 */
export async function participantesDaCampanha(campanhaId: string): Promise<ParticipantePublico[]> {
  if (!supabaseConfigurado) return [];
  const supabase = await criarClienteServidor();

  await supabase.rpc("expirar_reservas");

  const { data } = await supabase
    .from("participantes")
    .select(CAMPOS_PUBLICOS)
    .eq("campanha_id", campanhaId)
    .order("codigo_publico");

  return (data as ParticipantePublico[]) ?? [];
}

export async function participantePorId(id: string): Promise<ParticipantePublico | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("participantes")
    .select(CAMPOS_PUBLICOS)
    .eq("id", id)
    .maybeSingle();
  return (data as ParticipantePublico) ?? null;
}
