-- =============================================================================
-- Apadrinhamento de Natal 2026 — dados reais do Instituto
--
-- Extraído da apresentação oficial da campanha (Adobe Express, 45 slides
-- exportados em 11/11/2026). 41 participantes, dos slides 9 a 49.
--
-- O texto foi transcrito como está no material, inclusive onde há erro de
-- digitação — ver a lista de divergências no fim do arquivo. Nada foi
-- inventado: onde o material deixou o desejo em branco, o campo fica nulo e o
-- site mostra "a combinar".
--
-- As fotos são recortes da moldura de cada slide, em `public/imagens/
-- apadrinhamento/2026/`. Os termos de autorização de imagem estão assinados e
-- arquivados no Instituto.
--
-- Pode ser rodado mais de uma vez: apaga e recria os participantes de 2026.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. A campanha, com os dados reais do material
-- -----------------------------------------------------------------------------
insert into public.campanhas (
  ano, titulo, chamada, vinculo, descricao,
  valor_contribuicao, prazo_entrega,
  data_evento, local_evento, observacao, status, horas_reserva
) values (
  2026,
  'Apadrinhamento de Natal 2026',
  'Você pode ser meu padrinho ou minha madrinha?',
  'Campanha dos 10 anos do IEAD.',
  'Escolha uma criança, veja a idade, os tamanhos e o que ela gostaria de ganhar, e leve o presente até o Instituto. A entrega acontece na festa de Natal.',
  260.00,
  '2026-12-15 17:30',
  '2026-12-19 19:30',
  'Igreja Presbiteriana de Honório Gurgel — Rua Menezes Brum, 144, Guadalupe',
  null,
  'aberta',
  48
)
on conflict (ano) do update set
  titulo        = excluded.titulo,
  chamada       = excluded.chamada,
  vinculo       = excluded.vinculo,
  descricao     = excluded.descricao,
  valor_contribuicao = excluded.valor_contribuicao,
  prazo_entrega = excluded.prazo_entrega,
  data_evento   = excluded.data_evento,
  local_evento  = excluded.local_evento,
  observacao    = excluded.observacao,
  status        = excluded.status;

-- -----------------------------------------------------------------------------
-- 2. Fora os participantes de demonstração
--
-- Só apaga quem ainda não tem apadrinhamento registrado. Se alguém já foi
-- apadrinhado, o registro é preservado e o script avisa no fim.
-- -----------------------------------------------------------------------------
delete from public.participantes p
 where p.campanha_id = (select id from public.campanhas where ano = 2026)
   and not exists (select 1 from public.apadrinhamentos a where a.participante_id = p.id);

-- -----------------------------------------------------------------------------
-- 3. Os 41 participantes
--
-- idade em anos. HEITOR tem 3 meses: idade 0, com a idade real no recado.
-- -----------------------------------------------------------------------------
create temp table entrada_2026 (
  ordem      int,
  nome       text,
  arquivo    text,
  idade      int,
  roupa      text,
  calcado    text,
  presente   text,
  recado     text
) on commit drop;

insert into entrada_2026 (ordem, nome, arquivo, idade, roupa, calcado, presente, recado) values
  ( 1, 'Aléxia',                'alexia',             14, '16 anos',        '35/36', 'Kit 145/96 Estojo Lápis Esboço Arte', null),
  ( 2, 'Ana Beatriz',           'ana-beatriz',        12, '14 anos',        '35/36', 'Material escolar', null),
  ( 3, 'Bruna',                 'bruna',              12, '14 anos',        '35/36', 'Kit de maquiagem', null),
  ( 4, 'Keyla',                 'keyla',              12, 'M / 38 / 14 anos','37/38', 'Kit de cílios 90|P', null),
  ( 5, 'Lorrana',               'lorrana',            12, '12/14 anos',     '36',    'Melissa branca', null),
  ( 6, 'Mariana',               'mariana',            13, '16 anos',        '39/40', 'Material escolar (preto, lilás ou azul)', null),
  ( 7, 'Sara',                  'sara',               13, '14 anos',        '36/37', null, null),
  ( 8, 'Sofia',                 'sofia',              13, 'M / 12/14 anos', '35/36', 'Kit de cílios 3/14', null),
  ( 9, 'Antony',                'antony',              2, '3 anos',         '24',    'Um carrinho', null),
  (10, 'Ismael',                'ismael',              3, '5 anos',         '30/31', 'Um carrinho', null),
  (11, 'Samuel Lucas',          'samuel-lucas',        5, '6 anos',         '31/32', 'Um carrinho', null),
  (12, 'Heitor',                'heitor',              0, '6 meses',        '15',    'Aptamil e fralda G', 'Tenho 3 meses'),
  (13, 'Ana Laura',             'ana-laura',           3, '2 anos',         '21/22', 'Carrinho de boneca', null),
  (14, 'Kauê',                  'kaue',                5, '6 anos',         '30/31', 'Caneta 3D', null),
  (15, 'Liz',                   'liz',                 5, '6 anos',         '29',    'Squishy', null),
  (16, 'Maitê',                 'maite',               5, '8/10 anos',      '31/32', 'Casa de boneca', null),
  (17, 'Miguel',                'miguel',              4, 'P ou 5 anos',    '27/28', 'Casa do Hulk, ou o Hulk', null),
  (18, 'Rhavi',                 'rhavi',               3, '5 anos',         '29',    'Uma piscina ou um boneco', null),
  (19, 'Sophia',                'sophia',              6, '6 anos',         '28/29', 'Material escolar', null),
  (20, 'Thalita',               'thalita',             3, '4 anos',         '25/26', 'Duas bonecas', null),
  (21, 'Valentina',             'valentina-6',         6, '8 anos',         '29/30', 'Patins (rosa)', null),
  (22, 'Heloisa',               'heloisa',             5, '4/5 anos',       '27',    'Patinete de 3 rodas', 'Não uso vestido'),
  (23, 'Arthur Souza',          'arthur-souza',       12, '14 anos',        '37/38', 'Bike de dedo', null),
  (24, 'Arthur Lopes',          'arthur-lopes',       10, '12 anos',        '36',    'Bola verde', null),
  (25, 'Bernardo',              'bernardo',            7, '8 anos',         '32',    'Carrinho de controle remoto ou uma bicicleta', null),
  (26, 'Bryan',                 'bryan',               7, '8 anos',         '33',    'Carrinho de controle remoto ou uma bicicleta', null),
  (27, 'Davi Lucas',            'davi-lucas',          8, '9 anos',         '35',    'Videogame da Shopee', null),
  (28, 'Enzo Gabriel',          'enzo-gabriel',        6, '7 anos',         '33/34', 'Pista de carrinho', null),
  (29, 'Enzo Souza',            'enzo-souza',          7, '10 anos',        '33',    'Bike de dedo', null),
  (30, 'Fernando',              'fernando',            8, '8 anos',         '33',    'Saco de box com luva', null),
  (31, 'João Victor de Araujo', 'joao-victor-araujo', 10, '12 anos',        '35',    'Carrinho de controle', null),
  (32, 'João Victor Bard',      'joao-victor-bard',   12, '13 anos',        '36/37', null, null),
  (33, 'Kaike',                 'kaike',              10, 'P / 10 anos',    '35/36', 'Bola da Copa', null),
  (34, 'Klayton Miguel',        'klayton-miguel',      8, '9 anos',         '33',    'Bicicleta ou carrinho de controle remoto', null),
  (35, 'Ketellyn',              'ketellyn',            7, '6 anos',         '32',    'Patins rosa', null),
  (36, 'Luís Henrique',         'luis-henrique',      10, '10 anos',        '35/36', 'Chuteira com kit (meião, bola e caneleira)', null),
  (37, 'Milena Zanelli',        'milena-zanelli',     10, '11/12 anos',     '35',    null, null),
  (38, 'Myllena Florêncio',     'myllena-florencio',   8, '10 anos',        '31/32', 'Patins rosa', null),
  (39, 'Silvia',                'silvia',              9, 'M / 9 anos',     '29',    'Material escolar', null),
  (40, 'Pedro Luis',            'pedro-luis',         11, '14 anos',        '35',    'Game Boy', null),
  (41, 'Valentina',             'valentina-8',         8, '12 anos',        '31',    null, null);

-- -----------------------------------------------------------------------------
-- 4. As fotos
--
-- `tem_menores = true` liga a restrição `midia_menor_exige_autorizacao`: sem a
-- referência do termo, o banco recusa estas 41 linhas. É de propósito.
-- -----------------------------------------------------------------------------
insert into public.midias (caminho, alt, tem_menores, autorizacao, ano)
select
  '/imagens/apadrinhamento/2026/' || e.arquivo || '.jpg',
  e.nome || ', participante do Apadrinhamento de Natal 2026 do IEAD',
  true,
  'Termo de autorização de imagem assinado, arquivo do Instituto',
  2026
from entrada_2026 e
on conflict (caminho) do update set
  alt         = excluded.alt,
  tem_menores = excluded.tem_menores,
  autorizacao = excluded.autorizacao;

-- -----------------------------------------------------------------------------
-- 5. Os participantes, já ligados à foto
-- -----------------------------------------------------------------------------
insert into public.participantes (
  campanha_id, codigo_publico, nome_exibicao, idade,
  tamanho_roupa, tamanho_calcado, sugestao_presente, observacao_publica,
  foto_id, estado
)
select
  (select id from public.campanhas where ano = 2026),
  'P-2026-' || lpad(e.ordem::text, 3, '0'),
  e.nome,
  e.idade,
  e.roupa,
  e.calcado,
  e.presente,
  e.recado,
  m.id,
  'disponivel'
from entrada_2026 e
join public.midias m
  on m.caminho = '/imagens/apadrinhamento/2026/' || e.arquivo || '.jpg'
on conflict (campanha_id, codigo_publico) do update set
  nome_exibicao      = excluded.nome_exibicao,
  idade              = excluded.idade,
  tamanho_roupa      = excluded.tamanho_roupa,
  tamanho_calcado    = excluded.tamanho_calcado,
  sugestao_presente  = excluded.sugestao_presente,
  observacao_publica = excluded.observacao_publica,
  foto_id            = excluded.foto_id;

commit;

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select
  (select count(*) from public.participantes
    where campanha_id = (select id from public.campanhas where ano = 2026)) as participantes,
  (select count(*) from public.participantes
    where campanha_id = (select id from public.campanhas where ano = 2026)
      and foto_id is not null)                                             as com_foto,
  (select count(*) from public.participantes
    where campanha_id = (select id from public.campanhas where ano = 2026)
      and sugestao_presente is null)                                       as sem_desejo;

-- =============================================================================
-- DIVERGÊNCIAS DO MATERIAL — resolvidas com o Instituto em 11/11/2026
--
-- O material da campanha tinha alguns pontos ambíguos. Nenhum foi "corrigido"
-- por conta própria: todos foram perguntados e respondidos.
--
--  1. "carirnho" (Antony, Ismael, Samuel Lucas) → é CARRINHO, confirmado.
--     Gravado como "Um carrinho".
--  2. "Bicicleta Dedal" (Arthur Souza, Enzo Souza) → é BIKE DE DEDO, o
--     brinquedo, não uma bicicleta. Gravado como "Bike de dedo". Esta aqui
--     teria passado batido: "bicicleta de pedal" parecia a leitura óbvia, e
--     teria mandado o padrinho comprar a coisa errada.
--  3. "BERNADO" → é BERNARDO. Corrigido no nome e no arquivo da foto.
--  4. Prazo de entrega dos presentes: 15/12/2026, 17h30.
--     Valor da contribuição: R$ 260,00. Ambos gravados na campanha.
--
-- AINDA EM ABERTO, e de propósito:
--
--  5. Quatro crianças estão sem desejo no material: Sara, João Victor Bard,
--     Milena Zanelli e Valentina (8 anos). O site mostra "a combinar" em vez
--     de inventar um presente. Dá para preencher pelo painel quando souberem.
--  6. Duas crianças se chamam Valentina (6 e 8 anos). Ficaram com códigos
--     internos diferentes (P-2026-021 e P-2026-041) e fotos diferentes.
--     Quem olha o site vê duas crianças distintas, com idades distintas.
-- =============================================================================
