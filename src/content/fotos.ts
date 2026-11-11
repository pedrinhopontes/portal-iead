/**
 * Registro de fotografias do portal.
 *
 * Cada lugar do site que recebe foto tem um "slot" (um identificador). Enquanto o slot
 * não estiver registrado aqui, a página mostra o espaço reservado marcado.
 *
 * As fotos ficam descritas UMA única vez no `acervo` abaixo e são apontadas pelos slots.
 * Assim a mesma imagem aparece no carrossel da página inicial e na linha do tempo sem
 * duplicar arquivo nem descrição — mudou a legenda em um lugar, mudou nos dois.
 *
 * Os arquivos ficam em `public/imagens/`. Veja `public/imagens/LEIA-ME.md`.
 *
 * IMPORTANTE: fotografias de crianças e adolescentes só podem ir ao ar com o termo de
 * autorização de imagem. O campo `autorizacao` registra qual termo cobre cada foto;
 * "PENDENTE" significa que o Instituto ainda precisa confirmar.
 */

export type Foto = {
  /** Caminho a partir de /public, começando com "/imagens/". */
  arquivo: string;
  /** Descrição da imagem para leitores de tela. Obrigatória. */
  alt: string;
  /** Legenda visível, quando houver. */
  legenda?: string;
  /** Crédito do fotógrafo, quando houver. */
  credito?: string;
  /** Referência do termo de autorização de imagem, ou "PENDENTE". */
  autorizacao?: string;
};

/**
 * Acervo fotográfico do Instituto, enviado em 10/11/2026.
 *
 * Os anos vêm dos nomes dos arquivos enviados pelo Instituto. Duas fotos chegaram sem
 * ano confiável e ficaram sem data em vez de receber um ano presumido: `percussao`
 * (arquivo do Facebook) e `natal-bastidores` (imagem de WhatsApp, cuja data do arquivo
 * não corresponde à data da foto).
 */
const acervo = {
  "2017-a": {
    arquivo: "/imagens/acervo/acervo-2017-1.jpg",
    alt: "Integrantes do Instituto apresentam o IEAD em uma sala, ao lado de uma tela que exibe a primeira identidade visual da instituição",
    legenda: "2017 — Primeiras apresentações institucionais",
  },
  "2017-b": {
    arquivo: "/imagens/acervo/acervo-2017-2.jpg",
    alt: "Três integrantes do Instituto sentados a uma mesa durante apresentação, com um slide intitulado Finalidades projetado ao lado",
    legenda: "2017 — As finalidades do Instituto",
  },
  "2018-formatura": {
    arquivo: "/imagens/acervo/acervo-2018-1.jpg",
    alt: "Turma de formandos em beca preta e verde reunida para foto após a cerimônia de formatura",
    legenda: "2018 — Formatura de turma de formação",
  },
  percussao: {
    arquivo: "/imagens/acervo/acervo-percussao.jpg",
    alt: "Adolescentes de camiseta do IEAD tocam instrumentos de percussão sentados em roda, diante de um mural de fotos com o título Nossos momentos",
    legenda: "Aula de percussão na sede",
    autorizacao: "PENDENTE",
  },
  "2019": {
    arquivo: "/imagens/acervo/acervo-2019-1.jpg",
    alt: "Educador conversa com famílias sentadas em cadeiras escolares durante encontro na sede do Instituto",
    legenda: "2019 — Encontro com as famílias",
    autorizacao: "PENDENTE",
  },
  "2020": {
    arquivo: "/imagens/acervo/acervo-2020-1.jpg",
    alt: "Dezenas de crianças com coletes do IEAD reunidas no pátio da sede, sob tendas brancas, durante atividade coletiva",
    legenda: "2020 — Atividade coletiva no pátio da sede",
    autorizacao: "PENDENTE",
  },
  "2021": {
    arquivo: "/imagens/acervo/acervo-2021-1.jpg",
    alt: "Coral de crianças e adolescentes do IEAD se apresenta diante de uma árvore de Natal iluminada, com educadora regendo o grupo",
    legenda: "2021 — Cantata de Natal e apadrinhamento",
    autorizacao: "PENDENTE",
  },
  "2022": {
    arquivo: "/imagens/acervo/acervo-2022-1.jpg",
    alt: "Crianças e adolescentes do IEAD cantam em um palco enfeitado com flores, acompanhados por educadores ao microfone",
    legenda: "2022 — Cantata de Natal",
    credito: "Esther Azevedo",
    autorizacao: "PENDENTE",
  },
  "2023": {
    arquivo: "/imagens/acervo/acervo-2023-1.jpg",
    alt: "Apresentação de Natal vista do fundo do salão, com as crianças no palco iluminado e presentes empilhados ao lado",
    legenda: "2023 — Apresentação de Natal",
    autorizacao: "PENDENTE",
  },
  "2024": {
    arquivo: "/imagens/acervo/acervo-2024-1.jpg",
    alt: "Crianças e adolescentes em figurinos coloridos se apresentam no palco durante a cantata de Natal, diante de uma plateia que filma com celulares",
    legenda: "2024 — Cantata de Natal",
    autorizacao: "PENDENTE",
  },
  "2025": {
    arquivo: "/imagens/acervo/acervo-2025-1.jpg",
    alt: "Coral de crianças com camisetas vermelhas e verdes canta no palco, com uma bandeira do Brasil ao fundo",
    legenda: "2025 — Cantata de Natal",
    autorizacao: "PENDENTE",
  },
  "natal-bastidores": {
    arquivo: "/imagens/acervo/acervo-natal-bastidores.jpg",
    alt: "Adolescentes de camiseta verde sentados na borda do palco, acompanhando uma apresentação de Natal nos bastidores",
    legenda: "Bastidores de uma apresentação de Natal",
    autorizacao: "PENDENTE",
  },
} satisfies Record<string, Foto>;

/**
 * Slots disponíveis — aponte cada um para uma foto do acervo.
 *
 *  PÁGINA INICIAL
 *    home-hero-1 … home-hero-12     carrossel do banner, nesta ordem. Com uma foto só,
 *                                   ela fica fixa; a partir de duas, a troca liga sozinha.
 *    home-galeria-1 … -6            galeria "Nossos momentos"
 *
 *  QUEM SOMOS
 *    quem-somos-sede                fachada da sede ou foto de equipe
 *
 *  PROJETOS  (slugs: sementes-1, sementes-2, oficina-5-5, renascer,
 *             pre-vestibular-libertas, ingles-social)
 *    projeto-<slug>-capa / -1 / -2
 *
 *  NOSSA HISTÓRIA
 *    historia-<ano>-1 … -4          fotos daquele ano na linha do tempo
 *
 *  10 ANOS
 *    dez-anos-1 … dez-anos-6        galeria do evento de 07/11/2026
 *
 *  APADRINHAMENTO
 *    apadrinhamento-capa
 *    apadrinhamento-<ano>-1 … -4
 *
 *  NOTÍCIAS
 *    noticia-<slug>-capa
 */
export const fotos: Record<string, Foto> = {
  // Carrossel da página inicial, em ordem cronológica.
  "home-hero-1": acervo["2017-a"],
  "home-hero-2": acervo["2017-b"],
  "home-hero-3": acervo["2018-formatura"],
  "home-hero-4": acervo.percussao,
  "home-hero-5": acervo["2019"],
  "home-hero-6": acervo["2020"],
  "home-hero-7": acervo["2021"],
  "home-hero-8": acervo["2022"],
  "home-hero-9": acervo["2023"],
  "home-hero-10": acervo["2024"],
  "home-hero-11": acervo["2025"],
  "home-hero-12": acervo["natal-bastidores"],

  // Linha do tempo. As duas fotos sem ano confiável não entram aqui de propósito.
  "historia-2017-1": acervo["2017-a"],
  "historia-2017-2": acervo["2017-b"],
  "historia-2018-1": acervo["2018-formatura"],
  "historia-2019-1": acervo["2019"],
  "historia-2020-1": acervo["2020"],
  "historia-2021-1": acervo["2021"],
  "historia-2022-1": acervo["2022"],
  "historia-2023-1": acervo["2023"],
  "historia-2024-1": acervo["2024"],
  "historia-2025-1": acervo["2025"],
};

/**
 * A foto pode ir ao ar?
 *
 * Só não pode quando a autorização está marcada como "PENDENTE" — foto em que
 * aparece criança ou adolescente e cujo termo o Instituto ainda não confirmou.
 * Foto sem o campo é foto sem menor identificável (institucional, fachada,
 * evento de adultos) e dispensa termo.
 *
 * Esta trava existe porque o banco já tinha a dele (a restrição
 * `midia_menor_exige_autorizacao`, que recusa o cadastro) e este arquivo não
 * tinha nenhuma. A regra valia num caminho e não valia no outro, e quem lê o
 * site não sabe por qual caminho a foto chegou. Agora vale nos dois.
 */
function podePublicar(foto: Foto): boolean {
  return foto.autorizacao !== "PENDENTE";
}

export function buscarFoto(slot: string): Foto | undefined {
  const foto = fotos[slot];
  if (!foto || !podePublicar(foto)) return undefined;
  return foto;
}

/** Quantas fotos do acervo estão retidas por falta de termo de autorização. */
export function fotosRetidas(): number {
  return new Set(
    Object.values(fotos)
      .filter((f) => !podePublicar(f))
      .map((f) => f.arquivo),
  ).size;
}
