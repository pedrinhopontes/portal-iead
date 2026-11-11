-- =============================================================================
-- 0014 — Textos do site
--
-- POR QUE EXISTE: havia 91 textos escritos direto no código, espalhados por 11
-- páginas. Trocar qualquer um deles era um pedido ao programador — o contrário
-- do que este portal deveria ser.
--
-- COMO FUNCIONA: cada texto tem uma chave (`apadrinhamento.o-que-e.titulo`) e
-- um valor PADRÃO que continua no código, em src/content/textos.ts. Esta tabela
-- guarda apenas o que o Instituto decidiu mudar.
--
-- A consequência dessa escolha é o que importa: a tabela nasce vazia e o site
-- fica exatamente como está. Nada precisa ser migrado de uma vez, nenhuma
-- página quebra se a linha não existir, e apagar uma linha aqui devolve o texto
-- original. O banco guarda a diferença, não o conteúdo inteiro.
-- =============================================================================

create table if not exists public.textos_site (
  chave         text primary key,
  valor         text not null,
  atualizado_em timestamptz not null default now()
);

comment on table public.textos_site is
  'Textos do site que o Instituto alterou. O padrão de cada chave vive no código, em src/content/textos.ts.';

drop trigger if exists textos_site_atualizado_em on public.textos_site;
create trigger textos_site_atualizado_em
  before update on public.textos_site
  for each row execute function public.tocar_atualizado_em();

alter table public.textos_site enable row level security;

-- Leitura pública: é o conteúdo das páginas públicas.
drop policy if exists "textos_site_leitura_publica" on public.textos_site;
create policy "textos_site_leitura_publica"
  on public.textos_site for select to anon, authenticated using (true);

drop policy if exists "textos_site_escrita_comunicacao" on public.textos_site;
create policy "textos_site_escrita_comunicacao"
  on public.textos_site for all to authenticated
  using (public.tem_perfil('admin', 'comunicacao'))
  with check (public.tem_perfil('admin', 'comunicacao'));

drop trigger if exists textos_site_auditoria on public.textos_site;
create trigger textos_site_auditoria
  after insert or update or delete on public.textos_site
  for each row execute function public.registrar_auditoria();

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select
  (select count(*) from information_schema.tables where table_name = 'textos_site') as tabela,
  (select count(*) from pg_policies where tablename = 'textos_site')                as politicas,
  (select count(*) from public.textos_site)                                         as textos_alterados;
