-- =============================================================================
-- 0010 — Fecha de verdade a coluna de autorização de imagem
--
-- POR QUE EXISTE: a migração 0009 não funcionou, e a conferência provou isso —
-- um visitante anônimo continuava lendo `midias.autorizacao`.
--
-- O erro foi meu, e é uma regra do Postgres que é fácil de errar:
--
--   revoke select (autorizacao) on public.midias from anon;   -- não faz nada
--
-- Privilégio de tabela e privilégio de coluna são duas coisas separadas, e o
-- de tabela vale sozinho. O Supabase concede `select` na TABELA inteira para o
-- papel `anon` ao criar o schema. Com o privilégio de tabela na mão, tirar uma
-- coluna não tira nada: a permissão que um papel tem é a SOMA do que recebeu.
-- Remover uma parcela da soma não reduz o total enquanto a parcela maior fica.
--
-- O jeito certo é o contrário: tirar o privilégio da tabela e devolver coluna
-- por coluna, deixando `autorizacao` de fora.
-- =============================================================================

-- 1. Tira o privilégio amplo, que é o que estava valendo.
revoke select on public.midias from anon;

-- 2. Devolve só as colunas que o site público precisa para exibir uma foto.
--    `autorizacao` NÃO está na lista — é a única ausência, e é o objetivo.
--
--    `id` entra porque o PostgREST usa a chave estrangeira para montar a
--    consulta embutida `midia_slots -> midias`, e comparar uma coluna exige
--    permissão de leitura nela. Sem `id`, a galeria do site para de carregar.
--
--    `tem_menores` entra de propósito: não identifica ninguém e permite
--    conferir de fora que a trava de autorização está sendo respeitada.
grant select (
  id,
  caminho,
  alt,
  legenda,
  credito,
  ano,
  tem_menores,
  criado_em,
  atualizado_em
) on public.midias to anon;

comment on column public.midias.autorizacao is
  'Referência do termo de autorização de imagem. Invisível para o público: o papel anon tem privilégio de leitura coluna por coluna em midias, e esta coluna ficou fora.';

-- -----------------------------------------------------------------------------
-- CONSEQUÊNCIAS, para quem for escrever consulta nova
--
-- `select=*` em midias como anônimo passa a dar erro de permissão. Isso é
-- esperado: o site pede as colunas pelo nome (`caminho, alt, legenda, credito`)
-- e continua funcionando. O painel também, porque ele entra autenticado e o
-- papel `authenticated` manteve o privilégio de tabela inteiro.
--
-- CUIDADO: rodar `grant all on all tables in schema public to anon` — que
-- aparece em receitas de Supabase pela internet — desfaz esta migração em
-- silêncio e reabre a coluna. Se isso acontecer, rode este arquivo de novo.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- Conferência: `anonimo_le` tem de ser false SÓ na linha de `autorizacao`.
-- -----------------------------------------------------------------------------
select
  c.column_name as coluna,
  has_column_privilege('anon', 'public.midias', c.column_name, 'SELECT') as anonimo_le
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'midias'
order by c.ordinal_position;
