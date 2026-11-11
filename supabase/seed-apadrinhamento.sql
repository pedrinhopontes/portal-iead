-- =============================================================================
-- Apadrinhamento — campanhas de 2018 a 2026
--
-- As campanhas de 2018 a 2025 trazem os links REAIS encontrados na página de
-- apadrinhamento 2025 do Instituto, lida em 10/11/2026.
--
-- A campanha de 2026 entra como DEMONSTRAÇÃO: os participantes são fictícios e o
-- campo `observacao` carrega o aviso que aparece no site. Quando a lista real
-- chegar, apague os participantes de demonstração e limpe a observação.
--
-- Pode rodar mais de uma vez.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Campanhas anteriores — acervo
-- -----------------------------------------------------------------------------
insert into public.campanhas (ano, titulo, status, registro_tipo, registro_url, observacao) values
  (2018, 'Apadrinhamento 2018', 'arquivada', 'facebook',
   'https://www.facebook.com/media/set/?vanity=oficialiphg&set=a.749561798749764', null),
  (2019, 'Apadrinhamento 2019', 'arquivada', 'facebook',
   'https://www.facebook.com/media/set/?vanity=oficialiphg&set=a.991469307892344', null),
  (2020, 'Apadrinhamento 2020', 'arquivada', 'facebook',
   'https://www.facebook.com/media/set/?set=a.1904920446349233&type=3', null),
  (2021, 'Apadrinhamento 2021', 'arquivada', 'youtube',
   'https://www.youtube.com/watch?v=EvIj_C0bWyo', null),
  (2022, 'Apadrinhamento 2022', 'arquivada', 'youtube',
   'https://www.youtube.com/watch?v=32OHCpqBzfQ', null),
  (2023, 'Apadrinhamento 2023', 'arquivada', 'instagram',
   'https://www.instagram.com/p/C20o0P8Rqgr/',
   'Este link é idêntico ao registrado para 2024 na página atual do Instituto. Um dos dois está errado e precisa ser corrigido.'),
  (2024, 'Apadrinhamento 2024', 'arquivada', 'instagram',
   'https://www.instagram.com/tv/C20o0P8Rqgr/',
   'Mesmo link do registro de 2023. Aguardando o link correto.'),
  (2025, 'Apadrinhamento 2025', 'arquivada', 'pagina',
   'https://new.express.adobe.com/webpage/bqxKWz7aO4sSf',
   'Campanha publicada no Adobe Express. O conteúdo será importado para o acervo do portal.')
on conflict (ano) do update set
  titulo = excluded.titulo, status = excluded.status,
  registro_tipo = excluded.registro_tipo, registro_url = excluded.registro_url,
  observacao = excluded.observacao;

-- -----------------------------------------------------------------------------
-- Campanha vigente
--
-- Título sugerido no briefing, a confirmar. Prazo, data e local ainda não foram
-- informados pelo Instituto e por isso ficam nulos: a tela mostra "a confirmar"
-- em vez de repetir as datas de 2025.
-- -----------------------------------------------------------------------------
insert into public.campanhas
  (ano, titulo, chamada, vinculo, descricao, valor_contribuicao,
   prazo_entrega, data_evento, local_evento, horas_reserva, status, observacao)
values
  (2026,
   'Apadrinhamento 2026 | Natal Brasileiro: 10 anos semeando amor',
   'Um presente, uma criança, uma história que continua.',
   'Campanha vinculada à Cantata de Natal Brasileiro, Mig e Meg, e à celebração dos 10 anos do IEAD.',
   'Você escolhe um participante, consulta os tamanhos e a sugestão de presente, e entrega na sede do Instituto ou contribui para que a equipe monte o presente.',
   null,     -- valor de 2026 a confirmar (em 2025 foi R$ 250,00)
   null,     -- prazo de entrega a confirmar
   null,     -- data do evento a confirmar
   null,     -- local a confirmar
   48,
   'aberta',
   'Os participantes listados são fictícios e existem apenas para demonstrar o funcionamento da vitrine. Nenhuma criança real está publicada aqui.')
on conflict (ano) do update set
  titulo = excluded.titulo, chamada = excluded.chamada, vinculo = excluded.vinculo,
  descricao = excluded.descricao, horas_reserva = excluded.horas_reserva,
  status = excluded.status, observacao = excluded.observacao;

-- -----------------------------------------------------------------------------
-- Participantes de demonstração
--
-- Fictícios. Note o que NÃO existe aqui: nome, endereço, escola, responsável.
-- Esses campos moram em participantes_dados_restritos, e nenhum deles é público.
-- -----------------------------------------------------------------------------
insert into public.participantes
  (campanha_id, codigo_publico, idade, projeto, genero, tamanho_roupa, tamanho_calcado, sugestao_presente, estado)
select c.id, v.codigo, v.idade, v.projeto, v.genero, v.roupa, v.calcado, v.sugestao, v.estado::estado_participante
from public.campanhas c,
(values
  ('P-2026-001',  4, 'Sementes I',  'nao_informado', '4',  '26', 'Brinquedo de montar',   'disponivel'),
  ('P-2026-002',  5, 'Sementes I',  'menina',        '6',  '28', 'Boneca',                'disponivel'),
  ('P-2026-003',  8, 'Sementes II', 'menino',        '8',  '31', 'Bola de futebol',       'reserva_pendente'),
  ('P-2026-004',  9, 'Sementes II', 'nao_informado', '10', '32', 'Livro de aventura',     'apadrinhado'),
  ('P-2026-005',  7, 'Sementes II', 'nao_informado', '8',  '30', 'Jogo de tabuleiro',     'disponivel'),
  ('P-2026-006', 11, 'Sementes II', 'menina',        '12', '34', 'Kit de desenho',        'presente_recebido'),
  ('P-2026-007', 13, 'Oficina 5.5', 'nao_informado', 'P',  '36', 'Mochila escolar',       'disponivel'),
  ('P-2026-008', 14, 'Oficina 5.5', 'menino',        'M',  '38', 'Fone de ouvido',        'disponivel'),
  ('P-2026-009', 15, 'Oficina 5.5', 'nao_informado', 'M',  '39', 'Tênis',                 'disponivel'),
  ('P-2026-010',  6, 'Sementes I',  'nao_informado', '6',  '29', 'Quebra-cabeça',         'disponivel'),
  ('P-2026-011', 10, 'Sementes II', 'menina',        '10', '33', 'Material de pintura',   'disponivel'),
  ('P-2026-012', 16, 'Oficina 5.5', 'nao_informado', 'G',  '40', 'Camiseta e caderno',    'disponivel')
) as v(codigo, idade, projeto, genero, roupa, calcado, sugestao, estado)
where c.ano = 2026
on conflict (campanha_id, codigo_publico) do update set
  idade = excluded.idade, projeto = excluded.projeto, genero = excluded.genero,
  tamanho_roupa = excluded.tamanho_roupa, tamanho_calcado = excluded.tamanho_calcado,
  sugestao_presente = excluded.sugestao_presente;

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select c.ano, c.status, count(p.id) as participantes
from public.campanhas c
left join public.participantes p on p.campanha_id = c.id
group by c.ano, c.status
order by c.ano;
