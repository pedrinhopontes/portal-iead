/** Tipos e catálogo do Portal da Transparência. Sem importação de servidor. */

export type CategoriaTransparencia =
  | "documentos-institucionais"
  | "prestacao-de-contas"
  | "receitas-e-contribuicoes"
  | "aplicacao-dos-recursos"
  | "parcerias-e-convenios"
  | "relatorios-de-impacto";

export type DefinicaoCategoria = {
  slug: CategoriaTransparencia;
  nome: string;
  descricao: string;
  tipos: string[];
};

export const categorias: DefinicaoCategoria[] = [
  {
    slug: "documentos-institucionais",
    nome: "Documentos Institucionais",
    descricao: "Os documentos que constituem e regulam o Instituto.",
    tipos: [
      "Estatuto Social",
      "Ata",
      "Documento de regularidade",
      "Certificação",
      "Composição da diretoria",
      "Conselhos",
    ],
  },
  {
    slug: "prestacao-de-contas",
    nome: "Prestação de Contas",
    descricao: "Relatórios e demonstrações que mostram como o Instituto se sustenta.",
    tipos: [
      "Relatório financeiro",
      "Demonstração contábil",
      "Balanço",
      "Relatório anual",
      "Documento de auditoria",
    ],
  },
  {
    slug: "receitas-e-contribuicoes",
    nome: "Receitas e Contribuições",
    descricao: "De onde vêm os recursos, em valores agregados por período.",
    tipos: [
      "Total recebido por período",
      "Contribuições pontuais",
      "Contribuições recorrentes",
      "Campanhas",
      "Parcerias e projetos",
    ],
  },
  {
    slug: "aplicacao-dos-recursos",
    nome: "Aplicação dos Recursos",
    descricao: "Para onde os recursos vão, por categoria de despesa e por projeto.",
    tipos: [
      "Despesas por categoria",
      "Recursos destinados aos projetos",
      "Materiais e infraestrutura",
      "Custos operacionais",
      "Relatório de execução",
    ],
  },
  {
    slug: "parcerias-e-convenios",
    nome: "Parcerias e Convênios",
    descricao: "Com quem o Instituto trabalha e sob quais instrumentos.",
    tipos: [
      "Instrumento de parceria",
      "Projeto apoiado",
      "Período de execução",
      "Prestação de contas de parceria",
    ],
  },
  {
    slug: "relatorios-de-impacto",
    nome: "Relatórios de Impacto Social",
    descricao: "Quantas pessoas foram atendidas e o que foi realizado em cada ano.",
    tipos: [
      "Pessoas atendidas",
      "Atividades realizadas",
      "Projetos executados",
      "Resultados anuais",
    ],
  },
];

export function categoriaPorSlug(slug: string): DefinicaoCategoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export type Documento = {
  id: string;
  categoria: CategoriaTransparencia;
  tipo: string;
  titulo: string;
  ano: number | null;
  arquivo: string;
  tamanho_bytes: number | null;
  publicado_em: string;
};

export type LinhaFinanceira = {
  ano: number;
  categoria: string;
  natureza: "receita" | "despesa";
  valor: number;
  fonte: string | null;
};

export type ResumoAnual = {
  ano: number;
  receitas: number;
  despesas: number;
};

/** O que este portal nunca publica, por decisão de projeto. */
export const naoPublicamos = [
  "Nomes de doadores individuais",
  "Dados bancários pessoais",
  "Documentos sensíveis",
  "Informações privadas de beneficiários, especialmente crianças e adolescentes",
];

export function formatarReal(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Valor abreviado para caber como rótulo no gráfico: R$ 1,2 mil, R$ 340 mil. */
export function formatarCompacto(valor: number): string {
  if (valor === 0) return "R$ 0";
  if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (valor >= 1_000) return `R$ ${(valor / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mil`;
  return `R$ ${valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

export function formatarTamanho(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function formatarDataCurta(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
