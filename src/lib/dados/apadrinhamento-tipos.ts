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
 * A foto do participante, como ela sai do banco para a lista.
 *
 * Só existe se o termo de autorização de imagem da criança estiver registrado:
 * a foto é gravada em `midias` com `tem_menores = true`, e a restrição
 * `midia_menor_exige_autorizacao` recusa esse cadastro sem a referência do
 * termo. Por isso a lista não precisa conferir nada na hora de exibir —
 * se a foto chegou até aqui, o termo existe.
 */
export type FotoParticipante = {
  caminho: string;
  alt: string;
};

export type ParticipantePublico = {
  id: string;
  codigo_publico: string;
  nome_exibicao: string | null;
  idade: number | null;
  projeto: string | null;
  genero: "menina" | "menino" | "nao_informado" | null;
  tamanho_roupa: string | null;
  tamanho_calcado: string | null;
  sugestao_presente: string | null;
  observacao_publica: string | null;
  estado: EstadoParticipante;
  foto: FotoParticipante | null;
};

/** Como a criança é chamada no site: o primeiro nome, ou o código se faltar. */
export function comoChamar(p: ParticipantePublico): string {
  return p.nome_exibicao?.trim() || p.codigo_publico;
}

/** "14 anos", "1 ano", ou null quando a idade não foi informada. */
export function idadeEmTexto(idade: number | null): string | null {
  if (idade === null) return null;
  if (idade === 0) return null; // bebês: a idade real vai no recado
  return idade === 1 ? "1 ano" : `${idade} anos`;
}

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
