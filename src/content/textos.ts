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
  // ---------------------------------------------------------------- Quem Somos
  "quem-somos.capa.sobretitulo": {
    pagina: "Quem Somos",
    rotulo: "Capa — rótulo",
    padrao: "Quem somos",
  },
  "quem-somos.capa.titulo": {
    pagina: "Quem Somos",
    rotulo: "Capa — título",
    padrao: "Um instituto nascido e enraizado em Guadalupe",
  },
  "quem-somos.capa.texto": {
    pagina: "Quem Somos",
    rotulo: "Capa — texto",
    padrao:
      "Desde 2016, o IEAD trabalha para que a educação chegue onde ela mais transforma: perto de casa, todos os dias, com quem conhece cada família pelo nome.",
    longo: true,
  },
  "quem-somos.intro.paragrafo": {
    pagina: "Quem Somos",
    rotulo: "Parágrafo de abertura",
    padrao:
      "O Instituto atende crianças, adolescentes, jovens, mulheres e pessoas idosas por meio de projetos socioeducativos, culturais e de fortalecimento de vínculos.",
    longo: true,
  },
  "quem-somos.aviso-revisao.titulo": {
    pagina: "Quem Somos",
    rotulo: "Aviso de revisão — título",
    padrao: "Em revisão com o Instituto",
  },

  "quem-somos.missao.sobretitulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Missão, visão e valores” — rótulo",
    padrao: "Missão, visão e valores",
  },
  "quem-somos.missao.titulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Missão, visão e valores” — título",
    padrao: "O que nos move",
  },
  "quem-somos.missao.texto": {
    pagina: "Quem Somos",
    rotulo: "Seção “Missão, visão e valores” — texto",
    padrao:
      "A missão abaixo é a que o Instituto publica hoje. Visão e valores precisam ser formalizados pela diretoria.",
    longo: true,
  },
  "quem-somos.missao.rotulo": {
    pagina: "Quem Somos",
    rotulo: "Cartão da missão — rótulo",
    padrao: "Missão",
  },
  "quem-somos.missao.conteudo": {
    pagina: "Quem Somos",
    rotulo: "Cartão da missão — texto",
    padrao:
      "Através da educação, propiciar a crianças, adolescentes e idosos uma convivência comunitária fundamentada nos valores da solidariedade, da equidade e da justiça social, nos bairros do Rio de Janeiro com baixo índice de desenvolvimento humano.",
    longo: true,
  },
  "quem-somos.visao.rotulo": {
    pagina: "Quem Somos",
    rotulo: "Cartão da visão — rótulo",
    padrao: "Visão",
  },
  "quem-somos.visao.conteudo": {
    pagina: "Quem Somos",
    rotulo: "Cartão da visão — texto",
    padrao:
      "Aguardando o texto oficial aprovado pela diretoria. Este espaço fica reservado e será preenchido pelo painel administrativo.",
    longo: true,
  },
  "quem-somos.valores.rotulo": {
    pagina: "Quem Somos",
    rotulo: "Cartão dos valores — rótulo",
    padrao: "Valores",
  },
  "quem-somos.valores.nota": {
    pagina: "Quem Somos",
    rotulo: "Cartão dos valores — nota",
    padrao: "Valores extraídos do texto institucional atual. A lista oficial precisa ser confirmada.",
    longo: true,
  },

  "quem-somos.atuacao.sobretitulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Nossa atuação” — rótulo",
    padrao: "Nossa atuação",
  },
  "quem-somos.atuacao.titulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Nossa atuação” — título",
    padrao: "O papel do IEAD na comunidade de Guadalupe",
  },
  "quem-somos.atuacao.texto": {
    pagina: "Quem Somos",
    rotulo: "Seção “Nossa atuação” — texto",
    padrao:
      "Estar no bairro muda tudo: a criança chega a pé, a família conhece a equipe e o acompanhamento não depende de transporte nem de agendamento distante.",
    longo: true,
  },
  "quem-somos.atuacao.paragrafo": {
    pagina: "Quem Somos",
    rotulo: "Nossa atuação — texto reservado",
    padrao:
      "Esta seção receberá o texto sobre a presença do Instituto no território: histórico de ocupação do espaço, articulação com escolas e serviços públicos, e os dados do bairro que justificam a atuação.",
    longo: true,
  },
  "quem-somos.atuacao.nota": {
    pagina: "Quem Somos",
    rotulo: "Nossa atuação — nota",
    padrao:
      "Aguardando o conteúdo do Instituto. Nenhum dado socioeconômico foi inserido por conta própria.",
    longo: true,
  },

  "quem-somos.governanca.sobretitulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Governança” — rótulo",
    padrao: "Governança",
  },
  "quem-somos.governanca.titulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Governança” — título",
    padrao: "Equipe, diretoria e conselhos",
  },
  "quem-somos.governanca.texto": {
    pagina: "Quem Somos",
    rotulo: "Seção “Governança” — texto",
    padrao:
      "A composição será publicada com nome, cargo e período de mandato — somente com autorização de cada pessoa.",
    longo: true,
  },
  "quem-somos.governanca.equipe.titulo": {
    pagina: "Quem Somos",
    rotulo: "Cartão “Equipe” — título",
    padrao: "Equipe",
  },
  "quem-somos.governanca.equipe.texto": {
    pagina: "Quem Somos",
    rotulo: "Cartão “Equipe” — texto",
    padrao: "Educadores, coordenação e apoio que acompanham as turmas no dia a dia.",
    longo: true,
  },
  "quem-somos.governanca.diretoria.titulo": {
    pagina: "Quem Somos",
    rotulo: "Cartão “Diretoria” — título",
    padrao: "Diretoria",
  },
  "quem-somos.governanca.diretoria.texto": {
    pagina: "Quem Somos",
    rotulo: "Cartão “Diretoria” — texto",
    padrao: "Responsável pela condução institucional do Instituto.",
    longo: true,
  },
  "quem-somos.governanca.conselhos.titulo": {
    pagina: "Quem Somos",
    rotulo: "Cartão “Conselhos” — título",
    padrao: "Conselhos",
  },
  "quem-somos.governanca.conselhos.texto": {
    pagina: "Quem Somos",
    rotulo: "Cartão “Conselhos” — texto",
    padrao: "Instâncias de acompanhamento e fiscalização previstas no estatuto.",
    longo: true,
  },
  "quem-somos.governanca.aguardando": {
    pagina: "Quem Somos",
    rotulo: "Selo dos cartões de governança",
    padrao: "Aguardando lista autorizada",
  },

  "quem-somos.documentos.titulo": {
    pagina: "Quem Somos",
    rotulo: "Bloco de documentos — título",
    padrao: "Documentos institucionais",
  },
  "quem-somos.documentos.texto": {
    pagina: "Quem Somos",
    rotulo: "Bloco de documentos — texto",
    padrao:
      "Estatuto social, atas, documentos de regularidade e certificações ficam reunidos no Portal da Transparência, com filtro por ano e data da última atualização.",
    longo: true,
  },
  "quem-somos.documentos.botao": {
    pagina: "Quem Somos",
    rotulo: "Bloco de documentos — botão",
    padrao: "Ir para a transparência",
  },

  "quem-somos.parceiros.sobretitulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Parceiros” — rótulo",
    padrao: "Parceiros",
  },
  "quem-somos.parceiros.titulo": {
    pagina: "Quem Somos",
    rotulo: "Seção “Parceiros” — título",
    padrao: "Redes e articulações",
  },
  // ---------------------------------------------------------------- Transparência
  "transparencia.capa.sobretitulo": {
    pagina: "Transparência",
    rotulo: "Capa — rótulo",
    padrao: "Portal da Transparência",
  },
  "transparencia.capa.titulo": {
    pagina: "Transparência",
    rotulo: "Capa — título",
    padrao: "Prestação de contas aberta",
  },
  "transparencia.capa.texto": {
    pagina: "Transparência",
    rotulo: "Capa — texto",
    padrao:
      "Quem apoia o Instituto tem o direito de saber de onde vêm e para onde vão os recursos. Esta área reúne os documentos oficiais, organizados por categoria e por ano.",
    longo: true,
  },
  "transparencia.financas.sobretitulo": {
    pagina: "Transparência",
    rotulo: "Seção “Receitas e despesas” — rótulo",
    padrao: "Receitas e despesas",
  },
  "transparencia.financas.titulo": {
    pagina: "Transparência",
    rotulo: "Seção “Receitas e despesas” — título",
    padrao: "Para onde vai cada real",
  },
  "transparencia.financas.texto": {
    pagina: "Transparência",
    rotulo: "Seção “Receitas e despesas” — texto",
    padrao:
      "Os gráficos são gerados a partir dos valores publicados pelo Instituto, nunca de estimativas.",
    longo: true,
  },
  "transparencia.documentos.sobretitulo": {
    pagina: "Transparência",
    rotulo: "Seção “Documentos” — rótulo",
    padrao: "Documentos",
  },
  "transparencia.documentos.titulo": {
    pagina: "Transparência",
    rotulo: "Seção “Documentos” — título",
    padrao: "O que está publicado",
  },
  "transparencia.vazio.titulo": {
    pagina: "Transparência",
    rotulo: "Sem documentos — título",
    padrao: "Nenhum documento publicado até o momento",
  },
  "transparencia.vazio.texto": {
    pagina: "Transparência",
    rotulo: "Sem documentos — texto",
    padrao:
      "A estrutura está pronta e vazia de propósito: nenhum balanço, certificação ou auditoria foi criado. Assim que o Instituto enviar os arquivos oficiais, eles aparecem aqui com a data de publicação.",
    longo: true,
  },
  "transparencia.sem-filtro": {
    pagina: "Transparência",
    rotulo: "Nenhum resultado nos filtros",
    padrao: "Nenhum documento com esses filtros.",
  },
  "transparencia.limites.sobretitulo": {
    pagina: "Transparência",
    rotulo: "Seção “Limites” — rótulo",
    padrao: "Limites",
  },
  "transparencia.limites.titulo": {
    pagina: "Transparência",
    rotulo: "Seção “Limites” — título",
    padrao: "O que este portal nunca publica",
  },
  "transparencia.nada-inventado.titulo": {
    pagina: "Transparência",
    rotulo: "Aviso final — título",
    padrao: "Nada foi inventado nesta página",
  },
  "transparencia.nada-inventado.texto": {
    pagina: "Transparência",
    rotulo: "Aviso final — texto",
    padrao:
      "Balanços, certificações, auditorias e valores financeiros só aparecem quando existirem de fato, com o documento que os comprova. Até lá, cada categoria mostra o seu estado real.",
    longo: true,
  },

  // ---------------------------------------------------------------- Apoie
  "apoie.capa.sobretitulo": {
    pagina: "Apoie",
    rotulo: "Capa — rótulo",
    padrao: "Apoie o IEAD",
  },
  "apoie.capa.titulo": {
    pagina: "Apoie",
    rotulo: "Capa — título",
    padrao: "Há mais de um jeito de fazer parte",
  },
  "apoie.capa.texto": {
    pagina: "Apoie",
    rotulo: "Capa — texto",
    padrao:
      "Escolha a forma que combina com você. Toda contribuição vira atividade, material e acompanhamento para crianças, adolescentes, mulheres e pessoas idosas de Guadalupe.",
    longo: true,
  },
  "apoie.mensal.titulo": {
    pagina: "Apoie",
    rotulo: "Cartão “Contribuição mensal” — título",
    padrao: "Contribuição mensal",
  },
  "apoie.mensal.texto": {
    pagina: "Apoie",
    rotulo: "Cartão “Contribuição mensal” — texto",
    padrao:
      "A forma que mais ajuda: permite ao Instituto planejar o ano, manter as turmas e comprar material com antecedência.",
    longo: true,
  },
  "apoie.mensal.botao": {
    pagina: "Apoie",
    rotulo: "Cartão “Contribuição mensal” — botão",
    padrao: "Quero contribuir todo mês",
  },
  "apoie.unica.titulo": {
    pagina: "Apoie",
    rotulo: "Cartão “Doação única” — título",
    padrao: "Doação única",
  },
  "apoie.unica.texto": {
    pagina: "Apoie",
    rotulo: "Cartão “Doação única” — texto",
    padrao:
      "Uma contribuição pontual, no valor que você escolher, direto na conta do Instituto por PIX — sem taxa, o valor chega inteiro.",
    longo: true,
  },
  "apoie.unica.botao": {
    pagina: "Apoie",
    rotulo: "Cartão “Doação única” — botão",
    padrao: "Fazer uma doação",
  },
  "apoie.apadrinhamento.titulo": {
    pagina: "Apoie",
    rotulo: "Cartão “Apadrinhamento” — título",
    padrao: "Apadrinhamento de Natal",
  },
  "apoie.apadrinhamento.texto": {
    pagina: "Apoie",
    rotulo: "Cartão “Apadrinhamento” — texto",
    padrao:
      "Escolha um participante, prepare o presente e entregue na festa de encerramento do ano. Um presente com nome e com história.",
    longo: true,
  },
  "apoie.apadrinhamento.botao": {
    pagina: "Apoie",
    rotulo: "Cartão “Apadrinhamento” — botão",
    padrao: "Apadrinhe neste Natal",
  },
  "apoie.pix.sobretitulo": {
    pagina: "Apoie",
    rotulo: "Seção do PIX — rótulo",
    padrao: "PIX",
  },
  "apoie.pix.texto": {
    pagina: "Apoie",
    rotulo: "Seção do PIX — texto",
    padrao:
      "O PIX cai direto na conta do Instituto, sem intermediário e sem taxa por transação. É por isso que ele é a primeira forma de pagamento do portal: o valor doado chega inteiro.",
    longo: true,
  },
  "apoie.pix.confira": {
    pagina: "Apoie",
    rotulo: "PIX — aviso de conferência",
    padrao:
      "Confira o nome no seu aplicativo antes de confirmar — é assim que você sabe que o dinheiro vai para o Instituto.",
    longo: true,
  },
  "apoie.pix.sem-chave": {
    pagina: "Apoie",
    rotulo: "PIX — texto quando a chave não está cadastrada",
    padrao:
      "A chave oficial será publicada aqui depois de cadastrada no painel pelo Instituto. Nenhuma chave foi inserida por suposição — publicar uma chave errada desviaria doações.",
    longo: true,
  },
  "apoie.confirmacao.titulo": {
    pagina: "Apoie",
    rotulo: "Como a confirmação funciona — título",
    padrao: "Como a confirmação funciona",
  },
  "apoie.confirmacao.texto": {
    pagina: "Apoie",
    rotulo: "Como a confirmação funciona — texto",
    padrao:
      "O PIX cai direto na conta do Instituto, sem intermediário. Como não há integração bancária ainda, a baixa é feita por uma pessoa do financeiro conferindo o extrato — por isso cada doação recebe uma referência própria, que aparece no pagamento.",
    longo: true,
  },
  "apoie.pix.titulo": {
    pagina: "Apoie",
    rotulo: "Seção do PIX — título",
    padrao: "Doação direta, sem taxa",
  },
  // ---------------------------------------------------------------- Contato
  "contato.capa.sobretitulo": { pagina: "Contato", rotulo: "Capa — rótulo", padrao: "Contato" },
  "contato.capa.titulo": { pagina: "Contato", rotulo: "Capa — título", padrao: "Faça-nos uma visita" },
  "contato.capa.texto": {
    pagina: "Contato",
    rotulo: "Capa — texto",
    padrao:
      "O Instituto fica em Guadalupe, no Rio de Janeiro. Você pode aparecer, ligar, escrever ou chamar no WhatsApp.",
    longo: true,
  },
  "contato.consentimento": {
    pagina: "Contato",
    rotulo: "Texto do consentimento no formulário",
    padrao:
      "Autorizo o IEAD a usar os dados acima para responder a esta mensagem, conforme a Política de Privacidade.",
    longo: true,
  },
  "contato.aviso.titulo": {
    pagina: "Contato",
    rotulo: "Aviso do formulário — título",
    padrao: "Formulário desativado neste protótipo",
  },
  "contato.aviso.texto": {
    pagina: "Contato",
    rotulo: "Aviso do formulário — texto",
    padrao:
      "O envio entra em funcionamento junto com o painel administrativo, que vai receber as mensagens e encaminhar para a área responsável.",
    longo: true,
  },
  "contato.mapa.nota": {
    pagina: "Contato",
    rotulo: "Nota sobre o mapa",
    padrao:
      "O mapa incorporado entra na implementação, com opção de carregamento sob consentimento de cookies.",
    longo: true,
  },

  // ---------------------------------------------------------------- Seja um Filiado
  "filiado.capa.sobretitulo": {
    pagina: "Seja um Filiado",
    rotulo: "Capa — rótulo",
    padrao: "Seja um filiado",
  },
  "filiado.capa.titulo": {
    pagina: "Seja um Filiado",
    rotulo: "Capa — título",
    padrao: "Faça parte de quem transforma vidas",
  },
  "filiado.capa.texto": {
    pagina: "Seja um Filiado",
    rotulo: "Capa — texto",
    padrao:
      "A contribuição mensal é o que dá previsibilidade ao Instituto: permite manter as turmas abertas, comprar material e planejar o ano inteiro sem depender de doações pontuais.",
    longo: true,
  },
  "filiado.sem-pix.titulo": {
    pagina: "Seja um Filiado",
    rotulo: "Aviso de PIX não cadastrado — título",
    padrao: "A chave PIX ainda não foi cadastrada",
  },
  "filiado.sem-pix.texto": {
    pagina: "Seja um Filiado",
    rotulo: "Aviso de PIX não cadastrado — texto",
    padrao:
      "O formulário funciona e registra a sua contribuição, mas o código PIX só é gerado depois que o Instituto cadastrar a chave no painel. Nenhuma chave foi colocada por suposição — publicar uma chave errada desviaria doações.",
    longo: true,
  },
  "filiado.pix.vantagem": {
    pagina: "Seja um Filiado",
    rotulo: "Por que PIX — parágrafo",
    padrao:
      "O PIX cai direto na conta do Instituto, sem intermediário e sem taxa por transação. Numa doação de R$ 50, a diferença entre receber R$ 50 e receber R$ 47 não é pequena quando o orçamento é o de uma organização social.",
    longo: true,
  },
  "filiado.pix.contrapartida": {
    pagina: "Seja um Filiado",
    rotulo: "Por que PIX — contrapartida",
    padrao:
      "A contrapartida: o PIX não cobra sozinho. A contribuição mensal, nesta fase, é um compromisso que você repete a cada mês — e que o Instituto acompanha. A cobrança automática depende de integração bancária, prevista para a fase seguinte.",
    longo: true,
  },
  "filiado.associacao.sobretitulo": {
    pagina: "Seja um Filiado",
    rotulo: "Seção da filiação associativa — rótulo",
    padrao: "Atenção",
  },
  "filiado.associacao.titulo": {
    pagina: "Seja um Filiado",
    rotulo: "Seção da filiação associativa — título",
    padrao: "Apoiar financeiramente não é o mesmo que ser associado",
  },
  "filiado.associacao.texto": {
    pagina: "Seja um Filiado",
    rotulo: "Seção da filiação associativa — texto",
    padrao:
      "A filiação associativa envolve direitos previstos no estatuto, regras próprias e aprovação administrativa. Por isso ela tem um fluxo separado do apoio financeiro, e um não leva ao outro.",
    longo: true,
  },

  // ---------------------------------------------------------------- Projetos
  "projetos.capa.sobretitulo": {
    pagina: "Projetos",
    rotulo: "Capa — rótulo",
    padrao: "Nossos projetos",
  },
  "projetos.capa.titulo": {
    pagina: "Projetos",
    rotulo: "Capa — título",
    padrao: "Da primeira infância à universidade",
  },
  "projetos.capa.texto": {
    pagina: "Projetos",
    rotulo: "Capa — texto",
    padrao:
      "Cada projeto tem público, objetivos e atividades próprias — e uma página com fotografias, relatórios, notícias e formas de colaborar.",
    longo: true,
  },
  "projetos.vazio.titulo": {
    pagina: "Projetos",
    rotulo: "Sem projetos — título",
    padrao: "Nenhum projeto publicado",
  },
  "projetos.vazio.texto": {
    pagina: "Projetos",
    rotulo: "Sem projetos — texto",
    padrao: "Os projetos cadastrados no painel aparecem aqui assim que forem publicados.",
    longo: true,
  },
  "projetos.aviso.titulo": {
    pagina: "Projetos",
    rotulo: "Aviso sobre as descrições — título",
    padrao: "As descrições são iniciais",
  },
  "projetos.aviso.texto": {
    pagina: "Projetos",
    rotulo: "Aviso sobre as descrições — texto",
    padrao:
      "Conforme o briefing, os textos acima são um ponto de partida e devem ser revisados com a equipe de cada projeto. As faixas etárias divergem entre o site atual e o briefing e estão sinalizadas dentro de cada página.",
    longo: true,
  },
  "projetos.confirmar.sobretitulo": {
    pagina: "Projetos",
    rotulo: "Seção “A confirmar” — rótulo",
    padrao: "A confirmar",
  },
  "projetos.confirmar.titulo": {
    pagina: "Projetos",
    rotulo: "Seção “A confirmar” — título",
    padrao: "Frentes que aparecem no site atual",
  },
  "projetos.confirmar.texto": {
    pagina: "Projetos",
    rotulo: "Seção “A confirmar” — texto",
    padrao:
      "Estas iniciativas estão publicadas hoje em iearaujodutra.com.br, mas não constavam do briefing. Precisam de definição: seguem ativas, mudaram de nome ou saem do ar?",
    longo: true,
  },

  // ---------------------------------------------------------------- Nossa História
  "historia.capa.sobretitulo": {
    pagina: "Nossa História",
    rotulo: "Capa — rótulo",
    padrao: "2016 — 2026",
  },
  "historia.capa.titulo": {
    pagina: "Nossa História",
    rotulo: "Capa — título",
    padrao: "Nossa história, ano a ano",
  },
  "historia.capa.texto": {
    pagina: "Nossa História",
    rotulo: "Capa — texto",
    padrao:
      "Uma linha do tempo permanente. Cada ano guarda o seu próprio capítulo: textos, fotografias, vídeos, conquistas e parcerias. A partir de 2027, novos anos são acrescentados pelo painel administrativo.",
    longo: true,
  },
  "historia.vazio.titulo": {
    pagina: "Nossa História",
    rotulo: "Linha do tempo vazia — título",
    padrao: "Linha do tempo ainda vazia",
  },
  "historia.vazio.texto": {
    pagina: "Nossa História",
    rotulo: "Linha do tempo vazia — texto",
    padrao: "Os anos cadastrados no painel aparecem aqui.",
  },
  "historia.acervo.texto": {
    pagina: "Nossa História",
    rotulo: "Chamada por material de acervo",
    padrao:
      "Fotografias, vídeos, recortes de jornal, atas, listas de presença e certificados ajudam a reconstruir a história entre 2020 e 2025. Todo material enviado é creditado e arquivado.",
    longo: true,
  },
  // ---------------------------------------------------------------- 10 Anos
  "dez-anos.capa.titulo": {
    pagina: "10 Anos",
    rotulo: "Capa — título",
    padrao: "IEAD 10 Anos: Infâncias Protegidas, Futuros Possíveis",
    longo: true,
  },
  "dez-anos.capa.texto": {
    pagina: "10 Anos",
    rotulo: "Capa — texto",
    padrao:
      "A comemoração de uma década de atuação em Guadalupe reuniu o seminário, parceiros institucionais e as famílias atendidas pelo Instituto.",
    longo: true,
  },
  "dez-anos.acervo.sobretitulo": {
    pagina: "10 Anos",
    rotulo: "Seção “Acervo permanente” — rótulo",
    padrao: "Acervo permanente",
  },
  "dez-anos.acervo.titulo": {
    pagina: "10 Anos",
    rotulo: "Seção “Acervo permanente” — título",
    padrao: "O que esta página vai guardar",
  },
  "dez-anos.acervo.texto": {
    pagina: "10 Anos",
    rotulo: "Seção “Acervo permanente” — texto",
    padrao:
      "A comemoração continua disponível como acervo histórico mesmo depois de 2026. Cada bloco abaixo é preenchido pelo painel administrativo.",
    longo: true,
  },
  "dez-anos.sem-material.titulo": {
    pagina: "10 Anos",
    rotulo: "Aviso de material pendente — título",
    padrao: "Material do evento ainda não recebido",
  },
  "dez-anos.sem-material.texto": {
    pagina: "10 Anos",
    rotulo: "Aviso de material pendente — texto",
    padrao:
      "O evento ocorreu em 7 de novembro de 2026, três dias antes desta entrega. Assim que o Instituto enviar programação, lista de palestrantes, fotografias e vídeos, esta página passa a exibir o conteúdo real — nada foi preenchido por suposição.",
    longo: true,
  },
  "dez-anos.galeria.sobretitulo": {
    pagina: "10 Anos",
    rotulo: "Seção da galeria — rótulo",
    padrao: "Galeria",
  },

  // ---------------------------------------------------------------- Notícias
  "noticias.capa.sobretitulo": {
    pagina: "Notícias",
    rotulo: "Capa — rótulo",
    padrao: "Notícias e eventos",
  },
  "noticias.capa.titulo": {
    pagina: "Notícias",
    rotulo: "Capa — título",
    padrao: "O que acontece no Instituto",
  },
  "noticias.capa.texto": {
    pagina: "Notícias",
    rotulo: "Capa — texto",
    padrao:
      "Atividades dos projetos, campanhas, conquistas, parcerias e comunicados. Cada notícia tem endereço próprio, pronto para compartilhar no WhatsApp e nas redes.",
    longo: true,
  },
  "noticias.vazio.titulo": {
    pagina: "Notícias",
    rotulo: "Sem notícias — título",
    padrao: "Nenhuma notícia publicada ainda",
  },
  "noticias.vazio.texto": {
    pagina: "Notícias",
    rotulo: "Sem notícias — texto",
    padrao: "As notícias escritas no painel aparecem aqui assim que forem marcadas como publicadas.",
    longo: true,
  },
  "dez-anos.galeria.titulo": {
    pagina: "10 Anos",
    rotulo: "Seção da galeria — título",
    padrao: "Registros da comemoração",
  },
  // --- Apadrinhamento: lista de participantes ---
  "participantes.capa.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Lista de participantes — título",
    padrao: "Escolha um participante",
  },
  "participantes.capa.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Lista de participantes — texto",
    padrao:
      "Cada criança aparece com o primeiro nome, a idade, os tamanhos de roupa e calçado e o que gostaria de ganhar — o necessário para você escolher e comprar o presente certo.",
    longo: true,
  },
  "participantes.sem-campanha.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Lista — aviso de campanha fechada, título",
    padrao: "Nenhuma campanha aberta no momento",
  },
  "participantes.sem-campanha.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Lista — aviso de campanha fechada, texto",
    padrao:
      "Quando a próxima campanha de apadrinhamento for aberta pelo Instituto, os participantes aparecem aqui.",
    longo: true,
  },
  "participantes.protecao.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Lista — aviso de proteção, título",
    padrao: "O que nunca aparece nesta página",
  },
  "participantes.protecao.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Lista — aviso de proteção, texto",
    padrao:
      "Sobrenome, endereço, escola, nome dos responsáveis e qualquer contato pessoal ficam em tabela separada do banco de dados, acessível apenas à coordenação. As fotografias são publicadas com o termo de autorização de imagem assinado pelo responsável e arquivado no Instituto.",
    longo: true,
  },
  "participantes.reserva.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Lista — como funciona a reserva, título",
    padrao: "Como funciona a reserva",
  },

  // --- Apadrinhamento: campanha de um ano ---
  "campanha-ano.acervo.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Campanha por ano — texto do acervo",
    padrao:
      "O registro público desta campanha está hospedado nos canais do Instituto. O conteúdo será importado para o portal, preservando o link original.",
    longo: true,
  },
  "campanha-ano.corrigir.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Campanha por ano — aviso de registro a corrigir",
    padrao: "Registro a corrigir",
  },

  // --- Apadrinhamento: formulário de reserva ---
  "apadrinhar.capa.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Formulário de reserva — texto da capa",
    padrao:
      "Preencha os seus dados para reservar. A equipe do Instituto entra em contato para combinar a entrega.",
    longo: true,
  },
  "apadrinhar.protecao.texto": {
    pagina: "Apadrinhamento",
    rotulo: "Formulário de reserva — nota de proteção",
    padrao:
      "Estas são todas as informações que o Instituto divulga sobre um participante. Nome, endereço, escola e contato não são publicados em nenhuma hipótese.",
    longo: true,
  },

  // --- Projetos: página de um projeto ---
  "projeto.confirmar.titulo": {
    pagina: "Projetos",
    rotulo: "Página do projeto — aviso de informação a confirmar",
    padrao: "Informação a confirmar",
  },
  "projeto.acervo.sobretitulo": {
    pagina: "Projetos",
    rotulo: "Página do projeto — rótulo do acervo",
    padrao: "Acervo do projeto",
  },
  "projeto.acervo.titulo": {
    pagina: "Projetos",
    rotulo: "Página do projeto — título do acervo",
    padrao: "O que esta página vai reunir",
  },
  "projeto.acervo.texto": {
    pagina: "Projetos",
    rotulo: "Página do projeto — texto do acervo",
    padrao:
      "Cada projeto terá um acervo próprio, alimentado pelo painel administrativo pelo coordenador responsável.",
    longo: true,
  },
  "projeto.apoio.texto": {
    pagina: "Projetos",
    rotulo: "Página do projeto — chamada de apoio",
    padrao:
      "Você pode apoiar com contribuição mensal, doação pontual, voluntariado ou parceria institucional.",
    longo: true,
  },

  // --- Notícias: página de uma notícia ---
  "noticia.compartilhar.texto": {
    pagina: "Notícias",
    rotulo: "Página da notícia — texto de compartilhamento",
    padrao:
      "Cada notícia tem endereço próprio, o que facilita o compartilhamento no WhatsApp e nas redes sociais.",
    longo: true,
  },
  "participantes.demonstracao.titulo": {
    pagina: "Apadrinhamento",
    rotulo: "Lista — aviso de demonstração, título",
    padrao: "Lista de demonstração",
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
];

export function paginaPorSlug(slug: string) {
  return PAGINAS.find((p) => p.slug === slug) ?? null;
}
