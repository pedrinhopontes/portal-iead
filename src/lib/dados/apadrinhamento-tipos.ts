/**
 * Tipos e rótulos do apadrinhamento.
 *
 * Este arquivo não importa nada do servidor de propósito: ele é usado tanto pelas
 * páginas (servidor) quanto pelos componentes com "use client". Misturar os dois
 * faria o Next arrastar `next/headers` para dentro do navegador e quebrar o build.
 */

export type EstadoParticipante =
  | "disponivel"
  | "reserva_pendente"
  | "apadrinhado"
  | "presente_recebido"
  | "concluido";

export const rotuloEstado: Record<EstadoParticipante, string> = {
  disponivel: "Disponível",
  reserva_pendente: "Reserva pendente",
  apadrinhado: "Apadrinhado",
  presente_recebido: "Presente recebido",
  concluido: "Concluído",
};

export type StatusCampanha = "rascunho" | "aberta" | "encerrada" | "arquivada";

export type Campanha = {
  id: string;
  ano: number;
  titulo: string;
  chamada: string | null;
  vinculo: string | null;
  descricao: string | null;
  valor_contribuicao: number | null;
  prazo_entrega: string | null;
  data_evento: string | null;
  local_evento: string | null;
  registro_tipo: "facebook" | "youtube" | "instagram" | "pagina" | null;
  registro_url: string | null;
  observacao: string | null;
  horas_reserva: number;
  status: StatusCampanha;
};

/**
 * Participante como o público o vê.
 *
 * Esta forma é deliberadamente pobre: código, idade, projeto, tamanhos e sugestão.
 * Nome, responsável e contato vivem em outra tabela, que nenhuma página pública
 * consulta.
 */
export type ParticipantePublico = {
  id: string;
  codigo_publico: string;
  idade: number | null;
  projeto: string | null;
  genero: "menina" | "menino" | "nao_informado" | null;
  tamanho_roupa: string | null;
  tamanho_calcado: string | null;
  sugestao_presente: string | null;
  estado: EstadoParticipante;
};

export function formatarPrazo(valor: string | null): string | null {
  if (!valor) return null;
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarValor(valor: number | null): string | null {
  if (valor === null) return null;
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
