-- =============================================================================
-- NÃO FUNCIONOU — mantida aqui só para registro. A correção está na 0010.
--
-- O `revoke` abaixo é um comando válido que não produz efeito: privilégio de
-- tabela e privilégio de coluna são separados no Postgres, e o Supabase concede
-- `select` na tabela inteira ao papel `anon`. Com o privilégio de tabela na
-- mão, tirar uma coluna não tira nada. A conferência no fim deste arquivo
-- provou isso: `autorizacao` continuou com `anonimo_le = true`.
--
-- Ver: supabase/migrations/0010_privilegio_de_coluna_midias.sql
-- =============================================================================

-- =============================================================================
-- 0009 — Fecha a coluna de autorização de imagem para o público
--
-- A tabela `midias` precisa ser legível por visitantes: é dela que saem as fotos
-- do site. Mas a varredura de vazamento mostrou que `select=*` devolvia também a
-- coluna `autorizacao`, onde fica a referência do termo assinado.
--
-- O campo deveria conter só algo como "Termo coletivo Sementes II, 2026". Na
-- prática, quem cadastra pode escrever "Termo da família Silva" — e aí um nome
-- de família ligado a uma criança vira público. Não dá para contar com a
-- disciplina de quem preenche.
--
-- A segurança por linha não resolve isto: ela decide quais linhas aparecem, não
-- quais colunas. O que resolve é privilégio de coluna.
--
-- CONSEQUÊNCIA: para o papel anônimo, `select=*` em midias passa a dar erro de
-- permissão. O site não usa `*` — pede caminho, alt, legenda e crédito, que é o
-- necessário para exibir a foto. Quem for escrever consulta nova precisa fazer
-- o mesmo.
-- =============================================================================

revoke select (autorizacao) on public.midias from anon;

-- `tem_menores` continua visível de propósito: não identifica ninguém e serve
-- para conferir de fora que a trava de autorização está sendo respeitada.

comment on column public.midias.autorizacao is
  'Referência do termo de autorização de imagem. Invisível para o público (privilégio de coluna revogado do papel anon).';

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select
  c.column_name as coluna,
  has_column_privilege('anon', 'public.midias', c.column_name, 'SELECT') as anonimo_le
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name = 'midias'
order by c.ordinal_position;
