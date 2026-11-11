import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";
import type { Campanha, ParticipantePublico } from "./apadrinhamento-tipos";

export type { Campanha, ParticipantePublico, EstadoParticipante } from "./apadrinhamento-tipos";
export { rotuloEstado, formatarPrazo, formatarValor } from "./apadrinhamento-tipos";

/**
 * O que o site pede do participante.
 *
 * Nomeado campo a campo de propósito, nunca `*`: assim, se alguém acrescentar
 * uma coluna sensível à tabela amanhã, ela não vaza para o site sozinha.
 *
 * A foto vem embutida de `midias` pela chave estrangeira `foto_id`, e só
 * existe com o termo de autorização registrado — a restrição do banco recusa
 * o cadastro sem ele.
 */
const CAMPOS_PUBLICOS =
  "id, codigo_publico, nome_exibicao, idade, projeto, genero, tamanho_roupa, " +
  "tamanho_calcado, sugestao_presente, observacao_publica, estado, " +
  "foto:midias(caminho, alt)";

/** O cliente tipa relação embutida como lista; aqui é sempre uma foto só. */
function normalizar(linha: unknown): ParticipantePublico {
  const p = linha as ParticipantePublico & { foto: unknown };
  const foto = Array.isArray(p.foto) ? p.foto[0] : p.foto;
  return { ...p, foto: (foto as ParticipantePublico["foto"]) ?? null };
}

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
 * Antes de listar, devolve à lista quem teve a reserva vencida. É barato e
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

  return (data ?? []).map(normalizar);
}

export async function participantePorId(id: string): Promise<ParticipantePublico | null> {
  if (!supabaseConfigurado) return null;
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("participantes")
    .select(CAMPOS_PUBLICOS)
    .eq("id", id)
    .maybeSingle();
  return data ? normalizar(data) : null;
}
