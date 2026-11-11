-- =============================================================================
-- 0008 — Portal da Transparência
--
-- Aqui tudo é público por definição: documento de prestação de contas existe
-- para ser lido. O que não entra são dados de doadores individuais, dados
-- bancários e informações de beneficiários — e isso é uma regra de operação,
-- não uma coluna do banco.
--
-- Valores financeiros ficam em `financas_anuais`, separados dos documentos,
-- porque é deles que saem os gráficos.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'natureza_financeira') then
    create type natureza_financeira as enum ('receita', 'despesa');
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Documentos
-- -----------------------------------------------------------------------------
create table if not exists public.transparencia_documentos (
  id            uuid primary key default gen_random_uuid(),
  categoria     text not null check (categoria in (
                  'documentos-institucionais',
                  'prestacao-de-contas',
                  'receitas-e-contribuicoes',
                  'aplicacao-dos-recursos',
                  'parcerias-e-convenios',
                  'relatorios-de-impacto'
                )),
  tipo          text not null,
  titulo        text not null,
  ano           int check (ano between 2000 and 2100),
  arquivo       text not null,
  tamanho_bytes bigint,
  publicado_em  date not null default current_date,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on column public.transparencia_documentos.tipo is
  'Tipo dentro da categoria: Estatuto Social, Ata, Balanço, Relatório anual, e assim por diante.';

create index if not exists transparencia_categoria_idx
  on public.transparencia_documentos (categoria, ano desc nulls last);

-- -----------------------------------------------------------------------------
-- Valores anuais
-- -----------------------------------------------------------------------------
create table if not exists public.financas_anuais (
  ano           int not null check (ano between 2000 and 2100),
  categoria     text not null,
  natureza      natureza_financeira not null,
  valor         numeric(14, 2) not null check (valor >= 0),
  fonte         text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  primary key (ano, categoria, natureza)
);

comment on table public.financas_anuais is
  'Valores agregados por ano e categoria. Nunca lançamento individual, nunca nome de doador.';
comment on column public.financas_anuais.fonte is
  'De qual documento o valor saiu. Sem isso ninguém consegue conferir o gráfico.';

-- =============================================================================
-- Triggers
-- =============================================================================
do $$
declare
  t text;
begin
  foreach t in array array['transparencia_documentos', 'financas_anuais']
  loop
    execute format('drop trigger if exists tocar_%1$s on public.%1$I;
                    create trigger tocar_%1$s before update on public.%1$I
                    for each row execute function public.tocar_atualizado_em();', t);
    execute format('drop trigger if exists auditar_%1$s on public.%1$I;
                    create trigger auditar_%1$s after insert or update or delete on public.%1$I
                    for each row execute function public.registrar_auditoria();', t);
  end loop;
end
$$;

-- =============================================================================
-- Segurança — leitura pública, escrita restrita
-- =============================================================================
alter table public.transparencia_documentos enable row level security;
alter table public.financas_anuais          enable row level security;

drop policy if exists "transparencia_leitura_publica" on public.transparencia_documentos;
create policy "transparencia_leitura_publica"
  on public.transparencia_documentos for select to anon, authenticated
  using (true);

drop policy if exists "transparencia_escrita" on public.transparencia_documentos;
create policy "transparencia_escrita"
  on public.transparencia_documentos for all to authenticated
  using (public.tem_perfil('admin', 'financeiro'))
  with check (public.tem_perfil('admin', 'financeiro'));

drop policy if exists "financas_leitura_publica" on public.financas_anuais;
create policy "financas_leitura_publica"
  on public.financas_anuais for select to anon, authenticated
  using (true);

drop policy if exists "financas_escrita" on public.financas_anuais;
create policy "financas_escrita"
  on public.financas_anuais for all to authenticated
  using (public.tem_perfil('admin', 'financeiro'))
  with check (public.tem_perfil('admin', 'financeiro'));

-- =============================================================================
-- Armazenamento dos documentos
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', true)
on conflict (id) do nothing;

drop policy if exists "documentos_leitura" on storage.objects;
create policy "documentos_leitura"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'documentos');

drop policy if exists "documentos_envio" on storage.objects;
create policy "documentos_envio"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos' and public.tem_perfil('admin', 'financeiro'));

drop policy if exists "documentos_exclusao" on storage.objects;
create policy "documentos_exclusao"
  on storage.objects for delete to authenticated
  using (bucket_id = 'documentos' and public.tem_perfil('admin'));
