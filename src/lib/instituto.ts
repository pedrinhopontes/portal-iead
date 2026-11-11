/**
 * Dados institucionais do IEAD.
 *
 * Tudo neste arquivo foi LIDO do site oficial (iearaujodutra.com.br) e do Linktree
 * oficial em 10/11/2026. Nada aqui é inventado.
 *
 * Os itens marcados com `aConfirmar` divergem entre o site atual e o briefing do
 * Instituto e precisam de confirmação antes da publicação.
 */

export const instituto = {
  nome: "Instituto Educacional Araujo Dutra",
  sigla: "IEAD",
  fundacao: 2016,
  aniversario: 2026,
  anosDeAtuacao: 10,

  /**
   * DIVERGÊNCIA A CONFIRMAR: o site atual publica "Associação Educacional Araujo Dutra"
   * no rodapé, enquanto o briefing e a marca usam "Instituto". Antes de publicar é
   * preciso saber qual é a razão social registrada e qual é o nome fantasia.
   */
  razaoSocialNoSiteAtual: "Associação Educacional Araujo Dutra",

  cnpj: "27.757.883/0001-35",
  registroCmdcaRio: "05/2019",

  endereco: {
    logradouro: "Rua Menezes Brum, 795",
    bairro: "Guadalupe",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    completo: "Rua Menezes Brum, 795 — Guadalupe, Rio de Janeiro, RJ",
  },

  contato: {
    email: "iearaujodutra@gmail.com",
    telefone: "(21) 2451-4528",
    telefoneLink: "tel:+552124514528",
    whatsapp: "https://wa.me/552124514528",
    horario: "Segunda a sexta, das 9h30 às 18h",
  },

  redes: {
    instagram: "https://www.instagram.com/iead.ong/",
    instagramHandle: "@iead.ong",
    facebook: "https://www.facebook.com/oficialiphg",
    linkedin: "https://www.linkedin.com/",
  },

} as const;

/**
 * Texto institucional publicado hoje no site atual, preservado literalmente.
 *
 * REVISÃO NECESSÁRIA: a expressão "Organização Social da Sociedade Civil de Interesse
 * Público" mistura qualificações jurídicas distintas (OSC e OSCIP). O texto precisa
 * passar por revisão antes de ir ao ar no novo portal.
 */
export const textoQuemSomosAtual =
  "O Instituto Educacional Araujo Dutra é uma organização da sociedade civil, sem fins " +
  "lucrativos, que tem a missão de, através da educação, propiciar na vida de crianças, " +
  "adolescentes e idosos uma convivência comunitária fundamentada nos valores da " +
  "solidariedade, da equidade e da justiça social, nos bairros do Rio de Janeiro com " +
  "baixo índice de desenvolvimento humano.";

