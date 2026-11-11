/** Um texto do site, como o painel o manipula. */
export type TextoEditavel = {
  chave: string;
  pagina: string;
  rotulo: string;
  padrao: string;
  longo?: boolean;
  /** O que está gravado no banco, ou null quando nunca foi alterado. */
  valor: string | null;
  alterado: boolean;
};
