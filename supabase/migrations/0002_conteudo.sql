-- =============================================================================
-- 0002 — Conteúdo editável: mídias, projetos, notícias, linha do tempo,
--        indicadores, parceiros, depoimentos e textos do site.
--
-- Regra geral de leitura: o público só enxerga o que está `publicado`.
-- Regra geral de escrita: admin e comunicação. Projetos também aceitam coordenador.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Mídias
-- -----------------------------------------------------------------------------
create table if not exists public.midias (
  id            uuid primary key default gen_random_uuid(),
  caminho       text not null unique,
  alt           text not null,
  legenda       text,
  credito       text,
  ano           int,
  tem_menores   boolean not null default false,
  autorizacao   text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  -- Trava de proteção: foto com criança ou adolescente não entra no banco sem a
  -- referência do termo de autorização de imagem. Não depende de ninguém lembrar.
  constraint midia_menor_exige_autorizacao
    check (not tem_menores or (autorizacao is not null and autorizacao <> '' and autorizacao <> 'PENDENTE'))
);

comment on column public.midias.caminho is 'Caminho dentro do bucket "midias" do Storage, ou caminho em /public durante a transição.';
comment on column public.midias.alt is 'Descrição para leitores de tela. Obrigatória — sem ela a imagem não é acessível.';
comment on constraint midia_menor_exige_autorizacao on public.midias is 'Impede o cadastro de foto de menor sem termo de autorização.';

-- -----------------------------------------------------------------------------
-- Projetos
-- -----------------------------------------------------------------------------
create table if not exists public.projetos (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nome          text not null,
  chamada       text,
  publico       text,
  faixa_etaria  text,
  observacao    text,
  resumo        text,
  objetivos     text[] not null default '{}',
  atividades    text[] not null default '{}',
  paleta        text not null default 'verde' check (paleta in ('verde', 'bordo', 'ardosia')),
  capa_id       uuid references public.midias (id) on delete set null,
  ordem         int not null default 0,
  publicado     boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on column public.projetos.observacao is 'Divergências e pontos a confirmar com a equipe do projeto.';

create table if not exists public.projeto_midias (
  projeto_id uuid not null references public.projetos (id) on delete cascade,
  midia_id   uuid not null references public.midias (id) on delete cascade,
  ordem      int not null default 0,
  primary key (projeto_id, midia_id)
);

-- -----------------------------------------------------------------------------
-- Notícias
-- -----------------------------------------------------------------------------
create table if not exists public.noticias (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  titulo        text not null,
  resumo        text not null,
  corpo         text not null,
  categoria     text not null check (categoria in ('Institucional', 'Campanhas', 'Projetos', 'Conquistas')),
  projeto_id    uuid references public.projetos (id) on delete set null,
  capa_id       uuid references public.midias (id) on delete set null,
  data          date,
  publicado     boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists noticias_data_idx on public.noticias (data desc nulls last);
create index if not exists noticias_categoria_idx on public.noticias (categoria);

comment on column public.noticias.data is 'Data do fato. Nula quando ainda não confirmada — a tela mostra "data a confirmar".';

-- -----------------------------------------------------------------------------
-- Linha do tempo
-- -----------------------------------------------------------------------------
create table if not exists public.timeline_anos (
  ano            int primary key check (ano between 2016 and 2100),
  titulo         text,
  texto          text,
  acontecimentos text[] not null default '{}',
  destaque       boolean not null default false,
  publicado      boolean not null default true,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

comment on table public.timeline_anos is 'Um ano pode existir só com fotos, sem texto: a página mostra "texto a escrever".';

create table if not exists public.timeline_midias (
  ano      int not null references public.timeline_anos (ano) on delete cascade,
  midia_id uuid not null references public.midias (id) on delete cascade,
  ordem    int not null default 0,
  primary key (ano, midia_id)
);

-- -----------------------------------------------------------------------------
-- Indicadores de impacto
-- -----------------------------------------------------------------------------
create table if not exists public.indicadores (
  id            uuid primary key default gen_random_uuid(),
  rotulo        text not null unique,
  valor         text,
  verificado    boolean not null default false,
  fonte         text,
  ordem         int not null default 0,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  -- Indicador marcado como verificado precisa ter número e fonte.
  constraint indicador_verificado_exige_valor
    check (not verificado or (valor is not null and fonte is not null))
);

comment on constraint indicador_verificado_exige_valor on public.indicadores is
  'A home só exibe número verificado. Sem fonte declarada, o indicador não pode ser marcado como tal.';

-- -----------------------------------------------------------------------------
-- Parceiros e depoimentos
-- -----------------------------------------------------------------------------
create table if not exists public.parceiros (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null unique,
  descricao     text,
  site          text,
  logo_id       uuid references public.midias (id) on delete set null,
  ordem         int not null default 0,
  publicado     boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.depoimentos (
  id            uuid primary key default gen_random_uuid(),
  autor         text not null,
  vinculo       text,
  texto         text not null,
  autorizado    boolean not null default false,
  autorizacao   text,
  publicado     boolean not null default false,
  ordem         int not null default 0,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  -- Depoimento só vai ao ar com autorização por escrito registrada.
  constraint depoimento_publicado_exige_autorizacao
    check (not publicado or (autorizado and autorizacao is not null))
);

-- -----------------------------------------------------------------------------
-- Textos soltos do site
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  chave         text primary key,
  valor         jsonb not null,
  descricao     text,
  atualizado_em timestamptz not null default now()
);

comment on table public.site_settings is 'Textos e configurações avulsas: chamada do banner, telefone, horário, prazos de campanha.';

-- =============================================================================
-- Triggers
-- =============================================================================
do $$
declare
  t text;
begin
  foreach t in array array[
    'midias', 'projetos', 'noticias', 'timeline_anos', 'indicadores',
    'parceiros', 'depoimentos', 'site_settings'
  ]
  loop
    execute format(
      'drop trigger if exists tocar_%1$s on public.%1$I;
       create trigger tocar_%1$s before update on public.%1$I
       for each row execute function public.tocar_atualizado_em();', t);

    execute format(
      'drop trigger if exists auditar_%1$s on public.%1$I;
       create trigger auditar_%1$s after insert or update or delete on public.%1$I
       for each row execute function public.registrar_auditoria();', t);
  end loop;
end
$$;

-- =============================================================================
-- Segurança
-- =============================================================================
alter table public.midias          enable row level security;
alter table public.projetos        enable row level security;
alter table public.projeto_midias  enable row level security;
alter table public.noticias        enable row level security;
alter table public.timeline_anos   enable row level security;
alter table public.timeline_midias enable row level security;
alter table public.indicadores     enable row level security;
alter table public.parceiros       enable row level security;
alter table public.depoimentos     enable row level security;
alter table public.site_settings   enable row level security;

-- Leitura pública apenas do que está publicado.
-- Os `drop ... if exists` deixam o arquivo seguro para rodar de novo.
drop policy if exists "midias_leitura_publica"        on public.midias;
drop policy if exists "projetos_leitura_publica"      on public.projetos;
drop policy if exists "projeto_midias_leitura"        on public.projeto_midias;
drop policy if exists "noticias_leitura_publica"      on public.noticias;
drop policy if exists "timeline_leitura_publica"      on public.timeline_anos;
drop policy if exists "timeline_midias_leitura"       on public.timeline_midias;
drop policy if exists "indicadores_leitura_publica"   on public.indicadores;
drop policy if exists "parceiros_leitura_publica"     on public.parceiros;
drop policy if exists "depoimentos_leitura_publica"   on public.depoimentos;
drop policy if exists "site_settings_leitura_publica" on public.site_settings;

create policy "midias_leitura_publica"        on public.midias          for select to anon, authenticated using (true);
create policy "projetos_leitura_publica"      on public.projetos        for select to anon, authenticated using (publicado);
create policy "projeto_midias_leitura"        on public.projeto_midias  for select to anon, authenticated using (true);
create policy "noticias_leitura_publica"      on public.noticias        for select to anon, authenticated using (publicado);
create policy "timeline_leitura_publica"      on public.timeline_anos   for select to anon, authenticated using (publicado);
create policy "timeline_midias_leitura"       on public.timeline_midias for select to anon, authenticated using (true);
create policy "indicadores_leitura_publica"   on public.indicadores     for select to anon, authenticated using (true);
create policy "parceiros_leitura_publica"     on public.parceiros       for select to anon, authenticated using (publicado);
create policy "depoimentos_leitura_publica"   on public.depoimentos     for select to anon, authenticated using (publicado);
create policy "site_settings_leitura_publica" on public.site_settings   for select to anon, authenticated using (true);

-- Escrita: admin e comunicação.
do $$
declare
  t text;
begin
  foreach t in array array[
    'midias', 'noticias', 'timeline_anos', 'timeline_midias', 'indicadores',
    'parceiros', 'depoimentos', 'site_settings'
  ]
  loop
    execute format('drop policy if exists "%1$s_escrita_comunicacao" on public.%1$I;', t);
    execute format(
      'create policy "%1$s_escrita_comunicacao" on public.%1$I for all to authenticated
         using (public.tem_perfil(''admin'', ''comunicacao''))
         with check (public.tem_perfil(''admin'', ''comunicacao''));', t);
  end loop;
end
$$;

-- Projetos: coordenador também edita.
drop policy if exists "projetos_escrita" on public.projetos;
create policy "projetos_escrita" on public.projetos for all to authenticated
  using (public.tem_perfil('admin', 'comunicacao', 'coordenador'))
  with check (public.tem_perfil('admin', 'comunicacao', 'coordenador'));

drop policy if exists "projeto_midias_escrita" on public.projeto_midias;
create policy "projeto_midias_escrita" on public.projeto_midias for all to authenticated
  using (public.tem_perfil('admin', 'comunicacao', 'coordenador'))
  with check (public.tem_perfil('admin', 'comunicacao', 'coordenador'));
