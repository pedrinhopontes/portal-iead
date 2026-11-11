/**
 * Textos do site, com o valor padrão aqui e a alteração no banco.
 *
 * COMO FUNCIONA: cada texto tem uma chave. O padrão fica neste arquivo; se o
 * Instituto editar pelo painel, a versão dele vence. Apagar a alteração no
 * painel devolve o padrão daqui.
 *
 * O site funciona igual com a tabela `textos_site` vazia — é o estado em que
 * ele nasce. Nada precisa ser preenchido para o portal continuar de pé.
 *
 * ONDE ESTÁ A LINHA: entra aqui o que o visitante lê como CONTEÚDO do
 * Instituto — títulos de seção, chamadas e parágrafos. Não entram rótulos de
 * interface ("Ver os participantes", "Local", "Data do evento"): são peças do
 * funcionamento da tela, não texto institucional, e misturá-las deixaria o
 * painel com centenas de campos onde o importante some no meio.
 */

export type DefinicaoDeTexto = {
  /** Agrupamento no painel. */
  pagina: string;
  /** Como o campo é chamado no painel. */
  rotulo: string;
  /** O texto que vai ao ar enquanto ninguém editar. */
  padrao: string;
  /** Campo de várias linhas no painel. */
  longo?: boolean;
};

export const TEXTOS = {
  // ---------------------------------------------------------------- Apadrinhamento
  "apadrinhamento.sem-campanha.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Aviso de campanha fechada — título",
    padrao: "Nenhuma campanha aberta no momento",
  },
  "apadrinhamento.sem-campanha.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Aviso de campanha fechada — texto",
    padrao:
      "As campanhas anteriores continuam disponíveis abaixo, como acervo. Quando o Instituto abrir a próxima, ela aparece aqui.",
    longo: true,
  },

  "apadrinhamento.o-que-e.sobretitulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “O que é” — rótulo",
    padrao: "O que é",
  },
  "apadrinhamento.o-que-e.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “O que é” — título",
    padrao: "Um presente que chega com nome e com história",
  },
  "apadrinhamento.o-que-e.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “O que é” — texto quando a campanha não tem descrição",
    padrao:
      "O apadrinhamento de Natal conecta uma pessoa que quer ajudar a uma criança ou adolescente atendido pelo Instituto.",
    longo: true,
  },
  "apadrinhamento.o-que-e.paragrafo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “O que é” — parágrafo sobre o acervo",
    padrao:
      "A campanha acontece todos os anos desde 2018 e fica guardada no portal: cada edição ganha a sua página permanente, com os registros daquele Natal.",
    longo: true,
  },

  "apadrinhamento.como-participar.sobretitulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Como participar” — rótulo",
    padrao: "Como participar",
  },
  "apadrinhamento.como-participar.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Como participar” — título",
    padrao: "Sete passos, do começo ao fim",
  },
  "apadrinhamento.entregar.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Cartão “Entregar o presente” — título",
    padrao: "Entregar o presente",
  },
  "apadrinhamento.entregar.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Cartão “Entregar o presente” — texto",
    padrao:
      "Você escolhe um participante, consulta os tamanhos e a sugestão de presente e entrega na sede do Instituto.",
    longo: true,
  },
  "apadrinhamento.contribuir.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Cartão “Contribuir” — título",
    padrao: "Contribuir financeiramente",
  },
  "apadrinhamento.contribuir.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Cartão “Contribuir” — texto",
    padrao: "A equipe do IEAD faz as compras e monta o presente para você.",
    longo: true,
  },

  "apadrinhamento.encerramento.sobretitulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Encerramento” — rótulo",
    padrao: "Encerramento",
  },
  "apadrinhamento.encerramento.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Encerramento” — título",
    padrao: "A festa de entrega",
  },

  "apadrinhamento.protecao.sobretitulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Proteção de dados” — rótulo",
    padrao: "Proteção de dados",
  },
  "apadrinhamento.protecao.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Proteção de dados” — título",
    padrao: "Como protegemos cada criança",
  },
  "apadrinhamento.protecao.item1": {
    pagina: "Apadrinhamento",
    rotulo: "Proteção — primeiro item",
    // Reescrito em 11/11/2026: a versão anterior dizia que o participante era
    // identificado por código, o que deixou de ser verdade quando o Instituto
    // decidiu publicar o primeiro nome e a foto.
    padrao:
      "Cada criança aparece com o primeiro nome, a idade, os tamanhos e o que gostaria de ganhar. Sobrenome, endereço, escola e contatos ficam em tabela separada do banco, que nenhuma página pública consulta.",
    longo: true,
  },
  "apadrinhamento.protecao.item2": {
    pagina: "Apadrinhamento",
    rotulo: "Proteção — segundo item",
    padrao:
      "Fotografias só entram no ar com o termo de autorização de imagem assinado pelo responsável, e o sistema recusa o cadastro sem esse registro.",
    longo: true,
  },
  "apadrinhamento.protecao.item3": {
    pagina: "Apadrinhamento",
    rotulo: "Proteção — terceiro item",
    padrao:
      "Ao reservar, o participante sai da lista na hora: duas pessoas nunca apadrinham a mesma criança.",
    longo: true,
  },

  "apadrinhamento.historico.sobretitulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Histórico” — rótulo",
    padrao: "Histórico",
  },
  "apadrinhamento.historico.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Histórico” — título",
    padrao: "Todas as campanhas, guardadas",
  },
  "apadrinhamento.historico.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Seção “Histórico” — texto",
    padrao:
      "Cada edição tem a sua página permanente. Nenhum registro é apagado quando uma campanha termina.",
    longo: true,
  },
  // ---------------------------------------------------------------- Página inicial
  "inicio.banner.titulo": {
    pagina: "Página inicial",
    rotulo: "Banner — título",
    padrao: "Há 10 anos semeando educação, acolhimento e transformação social.",
    longo: true,
  },
  "inicio.banner.texto": {
    pagina: "Página inicial",
    rotulo: "Banner — texto",
    padrao:
      "O IEAD é uma organização da sociedade civil, sem fins lucrativos, que atua em Guadalupe, no Rio de Janeiro, com crianças, adolescentes, jovens, mulheres e pessoas idosas.",
    longo: true,
  },

  "inicio.quem-somos.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Quem somos” — rótulo",
    padrao: "Quem somos",
  },
  "inicio.quem-somos.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Quem somos” — título",
    padrao: "Educação que acolhe, protege e abre caminhos",
  },
  "inicio.quem-somos.aviso-titulo": {
    pagina: "Página inicial",
    rotulo: "Aviso de revisão — título",
    padrao: "Texto institucional em revisão",
  },
  "inicio.quem-somos.aviso-texto": {
    pagina: "Página inicial",
    rotulo: "Aviso de revisão — texto",
    padrao:
      "Este parágrafo foi preservado do site atual com ajustes de redação. A descrição jurídica do Instituto (OSC, OSCIP ou outra qualificação) precisa de revisão antes da publicação.",
    longo: true,
  },
  "inicio.indicadores.nota": {
    pagina: "Página inicial",
    rotulo: "Nota abaixo dos indicadores",
    padrao:
      "Os indicadores são editáveis pelo painel administrativo e exibem somente números conferidos pelo Instituto.",
    longo: true,
  },

  "inicio.projetos.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Projetos” — rótulo",
    padrao: "Nossos projetos",
  },
  "inicio.projetos.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Projetos” — título",
    padrao: "Cada fase da vida tem um lugar aqui",
  },
  "inicio.projetos.texto": {
    pagina: "Página inicial",
    rotulo: "Seção “Projetos” — texto",
    padrao:
      "Do primeiro contato com a escola ao ingresso na universidade, e também com as mulheres e as pessoas idosas da comunidade.",
    longo: true,
  },

  "inicio.apadrinhamento.sobretitulo-vigente": {
    pagina: "Página inicial",
    rotulo: "Faixa do apadrinhamento — rótulo com campanha aberta",
    padrao: "Campanha vigente",
  },
  "inicio.apadrinhamento.sobretitulo-fechada": {
    pagina: "Página inicial",
    rotulo: "Faixa do apadrinhamento — rótulo sem campanha aberta",
    padrao: "Apadrinhamento de Natal",
  },
  "inicio.apadrinhamento.titulo": {
    pagina: "Página inicial",
    rotulo: "Faixa do apadrinhamento — título quando não há campanha aberta",
    padrao: "Apadrinhe uma criança neste Natal",
  },
  "inicio.apadrinhamento.texto": {
    pagina: "Página inicial",
    rotulo: "Faixa do apadrinhamento — texto quando a campanha não tem vínculo",
    padrao:
      "Todos os anos desde 2018, o Instituto conecta quem quer ajudar a uma criança ou adolescente atendido pelos projetos.",
    longo: true,
  },
  "inicio.protecao.titulo": {
    pagina: "Página inicial",
    rotulo: "Proteção das crianças — título",
    padrao: "Proteção das crianças",
  },
  "inicio.protecao.texto1": {
    pagina: "Página inicial",
    rotulo: "Proteção das crianças — primeiro parágrafo",
    padrao:
      "No apadrinhamento, cada criança aparece com o primeiro nome, a idade, os tamanhos e o que gostaria de ganhar — o necessário para escolher o presente certo. Sobrenome, endereço, escola e contatos nunca são publicados. As fotografias só vão ao ar com o termo de autorização assinado pelo responsável, e o sistema recusa o cadastro sem esse registro.",
    longo: true,
  },
  "inicio.protecao.texto2": {
    pagina: "Página inicial",
    rotulo: "Proteção das crianças — segundo parágrafo",
    padrao:
      "A reserva de um participante é exclusiva: assim que alguém reserva, ninguém mais consegue escolher a mesma criança.",
    longo: true,
  },

  "inicio.historia.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Nossa história” — rótulo",
    padrao: "Nossa história",
  },
  "inicio.historia.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Nossa história” — título",
    padrao: "Uma década construída ano a ano",
  },
  "inicio.historia.texto": {
    pagina: "Página inicial",
    rotulo: "Seção “Nossa história” — texto",
    padrao:
      "A linha do tempo do IEAD fica permanentemente no portal. A cada ano, um novo capítulo é acrescentado pelo painel administrativo.",
    longo: true,
  },

  "inicio.filiacao.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Seja um filiado” — rótulo",
    padrao: "Seja um filiado",
  },
  "inicio.filiacao.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Seja um filiado” — título",
    padrao: "Faça parte de quem transforma vidas",
  },
  "inicio.filiacao.texto": {
    pagina: "Página inicial",
    rotulo: "Seção “Seja um filiado” — texto",
    padrao:
      "A contribuição mensal é o que permite ao Instituto planejar o ano inteiro: manter as turmas, o material e a equipe que acompanha cada criança.",
    longo: true,
  },
  "inicio.pagamentos.aviso-titulo": {
    pagina: "Página inicial",
    rotulo: "Aviso de pagamentos — título",
    padrao: "Pagamentos ainda não estão ativos neste protótipo",
  },
  "inicio.pagamentos.aviso-texto1": {
    pagina: "Página inicial",
    rotulo: "Aviso de pagamentos — primeiro parágrafo",
    padrao:
      "Os valores acima mostram como a escolha será apresentada. Nenhuma cobrança é processada e nenhum pagamento é simulado como se fosse real.",
    longo: true,
  },
  "inicio.pagamentos.aviso-texto2": {
    pagina: "Página inicial",
    rotulo: "Aviso de pagamentos — segundo parágrafo",
    padrao:
      "A primeira fase vai operar por PIX direto na conta do Instituto, sem taxa por transação, com conferência no painel administrativo. A recorrência automática entra depois, quando a conta e as credenciais estiverem definidas.",
    longo: true,
  },

  "inicio.noticias.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Notícias” — rótulo",
    padrao: "Notícias e eventos",
  },
  "inicio.noticias.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Notícias” — título",
    padrao: "O que está acontecendo no Instituto",
  },
  "inicio.noticias.texto": {
    pagina: "Página inicial",
    rotulo: "Seção “Notícias” — texto",
    padrao: "Atividades dos projetos, campanhas, conquistas e comunicados.",
    longo: true,
  },

  "inicio.depoimentos.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Depoimentos” — rótulo",
    padrao: "Depoimentos",
  },
  "inicio.depoimentos.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Depoimentos” — título",
    padrao: "Quem vive o Instituto por dentro",
  },

  "inicio.galeria.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Nossos momentos” — rótulo",
    padrao: "Nossos momentos",
  },
  "inicio.galeria.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Nossos momentos” — título",
    padrao: "A rotina do Instituto em imagens",
  },
  "inicio.galeria.texto": {
    pagina: "Página inicial",
    rotulo: "Seção “Nossos momentos” — texto",
    padrao:
      "A galeria é alimentada pelo painel administrativo, com as fotografias autorizadas de cada projeto.",
    longo: true,
  },

  "inicio.parceiros.sobretitulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Parceiros” — rótulo",
    padrao: "Parceiros e apoiadores",
  },
  "inicio.parceiros.titulo": {
    pagina: "Página inicial",
    rotulo: "Seção “Parceiros” — título",
    padrao: "Redes das quais o IEAD faz parte",
  },
  "inicio.parceiros.nota": {
    pagina: "Página inicial",
    rotulo: "Nota abaixo dos parceiros",
    padrao:
      "As logomarcas dos parceiros entram no lugar dos nomes assim que o Instituto enviar os arquivos e confirmar as autorizações de uso.",
    longo: true,
  },

  "inicio.transparencia.rotulo": {
    pagina: "Página inicial",
    rotulo: "Faixa da transparência — rótulo",
    padrao: "Portal da Transparência",
  },
  "inicio.transparencia.titulo": {
    pagina: "Página inicial",
    rotulo: "Faixa da transparência — título",
    padrao: "Quem apoia tem o direito de saber para onde o recurso vai",
    longo: true,
  },
  "inicio.transparencia.texto": {
    pagina: "Página inicial",
    rotulo: "Faixa da transparência — texto",
    padrao:
      "Documentos institucionais, prestação de contas, receitas, aplicação dos recursos, parcerias e relatórios de impacto — com filtro por ano e data da última atualização.",
    longo: true,
  },
  // --- Botões e chamadas da página inicial ---
  "inicio.botao.projetos": {
    pagina: "Página inicial",
    rotulo: "Botão do banner — projetos",
    padrao: "Conheça nossos projetos",
  },
  "inicio.botao.apadrinhar": {
    pagina: "Página inicial",
    rotulo: "Botão do banner — apadrinhamento",
    padrao: "Apadrinhe neste Natal",
  },
  "inicio.botao.quem-somos": {
    pagina: "Página inicial",
    rotulo: "Botão “Quem somos”",
    padrao: "Conhecer o Instituto",
  },
  "inicio.botao.todos-projetos": {
    pagina: "Página inicial",
    rotulo: "Botão da seção de projetos",
    padrao: "Ver todos os projetos",
  },
  "inicio.botao.quero-apadrinhar": {
    pagina: "Página inicial",
    rotulo: "Botão da faixa de apadrinhamento",
    padrao: "Quero apadrinhar",
  },
  "inicio.botao.campanhas-anteriores": {
    pagina: "Página inicial",
    rotulo: "Link para campanhas anteriores",
    padrao: "Ver campanhas anteriores",
  },
  "inicio.botao.linha-do-tempo": {
    pagina: "Página inicial",
    rotulo: "Botão da linha do tempo",
    padrao: "Percorrer a linha do tempo",
  },
  "inicio.botao.dez-anos": {
    pagina: "Página inicial",
    rotulo: "Botão dos 10 anos",
    padrao: "Comemoração dos 10 anos",
  },
  "inicio.botao.contribuir": {
    pagina: "Página inicial",
    rotulo: "Botão de contribuição mensal",
    padrao: "Quero contribuir todo mês",
  },
  "inicio.botao.doacao-unica": {
    pagina: "Página inicial",
    rotulo: "Botão de doação única",
    padrao: "Fazer uma doação única",
  },
  "inicio.botao.noticias": {
    pagina: "Página inicial",
    rotulo: "Botão da seção de notícias",
    padrao: "Ver todas as notícias",
  },
  "inicio.botao.transparencia": {
    pagina: "Página inicial",
    rotulo: "Botão da faixa de transparência",
    padrao: "Acessar a transparência",
  },
  "inicio.depoimentos.texto": {
    pagina: "Página inicial",
    rotulo: "Depoimentos — texto de espera",
    padrao:
      "Esta área receberá depoimentos de famílias, participantes, educadores e parceiros, apenas os autorizados por escrito. Nenhum depoimento foi escrito por nós: eles serão cadastrados pelo painel com nome, vínculo e autorização.",
    longo: true,
  },
} as const satisfies Record<string, DefinicaoDeTexto>;

export type ChaveDeTexto = keyof typeof TEXTOS;

/** As páginas na ordem em que aparecem no painel. */
export const PAGINAS_COM_TEXTO: string[] = [...new Set(Object.values(TEXTOS).map((t) => t.pagina as string))];

/**

/**
 * As páginas do site que têm texto editável, com o endereço público de cada
 * uma — é o que a prévia do painel carrega ao lado dos campos.
 */
export const PAGINAS: { nome: string; slug: string; url: string }[] = [
  { nome: "Página inicial", slug: "inicio", url: "/" },
  { nome: "Quem Somos", slug: "quem-somos", url: "/quem-somos" },
  { nome: "Projetos", slug: "projetos", url: "/projetos" },
  { nome: "Nossa História", slug: "nossa-historia", url: "/nossa-historia" },
  { nome: "Apadrinhamento", slug: "apadrinhamento", url: "/apadrinhamento" },
  { nome: "Transparência", slug: "transparencia", url: "/transparencia" },
  { nome: "Seja um Filiado", slug: "seja-filiado", url: "/seja-filiado" },
  { nome: "Notícias", slug: "noticias", url: "/noticias" },
  { nome: "Contato", slug: "contato", url: "/contato" },
  { nome: "Apoie", slug: "apoie", url: "/apoie" },
  { nome: "Privacidade", slug: "privacidade", url: "/privacidade" },
];

export function paginaPorSlug(slug: string) {
  return PAGINAS.find((p) => p.slug === slug) ?? null;
}
