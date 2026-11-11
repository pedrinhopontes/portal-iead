-- =============================================================================
-- Conserta os acentos quebrados no banco
--
-- O QUE ACONTECEU: os arquivos `aplicar-*.sql` foram gerados com a codificação
-- errada. O texto em UTF-8 foi gravado como se fosse Windows-1252, e cada letra
-- acentuada virou dois caracteres: "ção" virou "Ã§Ã£o", "à" virou "Ã ".
-- Quem rodou aqueles arquivos no SQL Editor gravou o estrago no banco.
--
-- Os arquivos já foram regerados corretos. Este script conserta o que já entrou.
--
-- COMO DESFAZ: pegar o texto quebrado, escrevê-lo de volta como bytes
-- Windows-1252 e lê-lo como UTF-8 — exatamente o caminho inverso do erro.
--
-- Roda em TODAS as colunas de texto do schema `public`, não só nas que eu
-- encontrei de fora. As tabelas com dados pessoais não são legíveis pela API
-- pública, então eu não tinha como conferir aquelas daqui.
--
-- Pode ser rodado mais de uma vez: linha já correta não é tocada.
-- Roda no SQL Editor do Supabase. O relatório sai na tabela no fim.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- A assinatura do estrago.
--
-- Não basta procurar "Ã": em português "Ã" é legítimo em maiúsculas (SÃO).
-- O que denuncia o mojibake é "Ã" seguido de um caractere da faixa de
-- pontuação Latin-1 (Ã§, Ã£, Ã©, Ã ...), que não acontece em texto de verdade.
-- "â€" cobre as aspas curvas e o travessão.
-- -----------------------------------------------------------------------------

create or replace function pg_temp.corrigir_mojibake(txt text)
returns text
language plpgsql
immutable
as $$
begin
  if txt is null then
    return txt;
  end if;
  return convert_from(convert_to(txt, 'WIN1252'), 'UTF8');
exception when others then
  -- Texto com caractere fora do Windows-1252: não veio deste erro. Deixa como está.
  return txt;
end;
$$;

drop table if exists relatorio_acentos;
create temp table relatorio_acentos (tabela text, coluna text, linhas_corrigidas bigint);

do $$
declare
  r         record;
  corrigiu  bigint;
  padrao    text := 'Ã[\u0080-¿]|â€';
begin
  for r in
    select c.table_name, c.column_name
      from information_schema.columns c
      join information_schema.tables t
        on t.table_schema = c.table_schema
       and t.table_name   = c.table_name
     where c.table_schema = 'public'
       and t.table_type   = 'BASE TABLE'
       and c.data_type in ('text', 'character varying')
     order by c.table_name, c.ordinal_position
  loop
    execute format(
      'update public.%I set %I = pg_temp.corrigir_mojibake(%I) where %I ~ %L',
      r.table_name, r.column_name, r.column_name, r.column_name, padrao
    );
    get diagnostics corrigiu = row_count;

    if corrigiu > 0 then
      insert into relatorio_acentos values (r.table_name, r.column_name, corrigiu);
    end if;
  end loop;

  if not exists (select 1 from relatorio_acentos) then
    insert into relatorio_acentos values ('—', 'nada a corrigir', 0);
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Relatório: o que foi corrigido.
-- -----------------------------------------------------------------------------
select tabela, coluna, linhas_corrigidas
  from relatorio_acentos
 order by tabela, coluna;

-- -----------------------------------------------------------------------------
-- Conferência: sobrou alguma coisa quebrada?
-- Tem de voltar VAZIO. Se voltar linha, o texto estava codificado errado mais
-- de uma vez — rode este arquivo de novo.
-- -----------------------------------------------------------------------------
do $$
declare
  r       record;
  sobrou  bigint;
  padrao  text := 'Ã[\u0080-¿]|â€';
begin
  drop table if exists sobras_acentos;
  create temp table sobras_acentos (tabela text, coluna text, linhas bigint);

  for r in
    select c.table_name, c.column_name
      from information_schema.columns c
      join information_schema.tables t
        on t.table_schema = c.table_schema
       and t.table_name   = c.table_name
     where c.table_schema = 'public'
       and t.table_type   = 'BASE TABLE'
       and c.data_type in ('text', 'character varying')
  loop
    execute format(
      'select count(*) from public.%I where %I ~ %L',
      r.table_name, r.column_name, padrao
    ) into sobrou;

    if sobrou > 0 then
      insert into sobras_acentos values (r.table_name, r.column_name, sobrou);
    end if;
  end loop;
end
$$;

select tabela, coluna, linhas as ainda_quebradas
  from sobras_acentos
 order by tabela, coluna;
