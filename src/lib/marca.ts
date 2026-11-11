/**
 * Logo oficial do IEAD.
 *
 * A logo NÃO é recriada, redesenhada nem alterada. O site apenas exibe o arquivo
 * oficial enviado pelo Instituto. Enquanto `arquivo` for null, o cabeçalho mostra um
 * espaço reservado visivelmente marcado.
 *
 * Para ativar: coloque o arquivo em `public/imagens/marca/` e preencha `arquivo`.
 */
export const marca = {
  /**
   * Arquivo oficial enviado pelo Instituto, com as margens vazias recortadas.
   * O original, sem recorte, está preservado em `/imagens/marca/logo.png`.
   * Fundo transparente (577 × 773), então funciona em fundo claro e escuro.
   */
  arquivo: "/imagens/marca/logo-iead.png" as string | null,

  /** Versão em fundo escuro (rodapé), se houver uma. Caindo para `arquivo` quando null. */
  arquivoFundoEscuro: null as string | null,

  alt:
    "Logo do Instituto Educacional Araujo Dutra: uma árvore estilizada cujo tronco tem a forma " +
    "de uma pessoa de braços erguidos, em bordô, com a copa formada por círculos verdes e bordôs",
};
