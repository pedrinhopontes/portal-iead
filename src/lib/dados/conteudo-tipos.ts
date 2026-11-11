/**
 * Tipos do conteúdo editorial, no formato em que o banco guarda.
 *
 * Sem importação de servidor: é usado tanto pelas páginas quanto pelos
 * componentes com "use client".
 */

export type CategoriaNoticia = "Institucional" | "Campanhas" | "Projetos" | "Conquistas";

export const categoriasDeNoticia: CategoriaNoticia[] = [
  "Institucional",
  "Campanhas",
  "Projetos",
  "Conquistas",
];

/** Uma imagem da notícia, já com a descrição que o leitor de tela usa. */
export type ImagemDaNoticia = { caminho: string; alt: string };

export type Noticia = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  corpo: string;
  categoria: CategoriaNoticia;
  data: string | null;
  publicado: boolean;
  video_url: string | null;
  capa: ImagemDaNoticia | null;
  galeria: ImagemDaNoticia[];
};

export type Projeto = {
  id: string;
  slug: string;
  nome: string;
  chamada: string | null;
  publico: string | null;
  faixa_etaria: string | null;
  observacao: string | null;
  resumo: string | null;
  objetivos: string[];
  atividades: string[];
  paleta: "verde" | "bordo" | "ardosia";
};

export type AnoHistoria = {
  ano: number;
  titulo: string | null;
  texto: string | null;
  acontecimentos: string[];
  destaque: boolean;
};

export type Indicador = {
  rotulo: string;
  valor: string | null;
  verificado: boolean;
  fonte: string | null;
};

export type Parceiro = {
  nome: string;
  descricao: string | null;
  site: string | null;
};

/** Data do fato. Nula quando o Instituto ainda não confirmou. */
export function formatarData(data: string | null): string {
  if (!data) return "Data a confirmar";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Separa o texto em parágrafos: uma linha em branco começa um novo. */
export function paragrafos(corpo: string): string[] {
  return corpo
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Um ano da linha do tempo só tem história contada quando alguém escreveu o título. */
export function anoTemTexto(ano: AnoHistoria): boolean {
  return Boolean(ano.titulo);
}
