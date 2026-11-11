-- =============================================================================
-- IEAD — esquema completo do banco, para colar de uma vez no SQL Editor.
-- Gerado a partir dos arquivos de supabase/migrations/, na ordem.
-- Pode ser rodado mais de uma vez sem dar erro.
-- =============================================================================

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0001_fundacao.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0001 — Fundação: perfis de acesso, auditoria e funções de apoio
--
-- A permissão por perfil mora no banco, não só na tela. Um usuário do perfil
-- "comunicação" não consegue ler os dados restritos das crianças nem que chame
-- a API diretamente, porque o próprio Postgres recusa.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Perfis de acesso
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'perfil_usuario') then
    create type perfil_usuario as enum ('admin', 'comunicacao', 'financeiro', 'coordenador');
  end if;
end
$$;

comment on type perfil_usuario is
  'admin: tudo. comunicacao: conteúdo e notícias. financeiro: contribuições e transparência. coordenador: projetos e apadrinhamento.';

create table if not exists public.usuarios_admin (
  id            uuid primary key references auth.users (id) on delete cascade,
  nome          text not null,
  email         text not null,
  perfil        perfil_usuario not null default 'comunicacao',
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.usuarios_admin is
  'Quem pode entrar no painel. Criar o usuário no Supabase Auth e depois inserir a linha aqui.';

-- -----------------------------------------------------------------------------
-- Funções de apoio
--
-- São SECURITY DEFINER de propósito: as políticas de usuarios_admin precisam
-- consultar a própria tabela usuarios_admin, o que entraria em recursão infinita
-- se a função respeitasse RLS.
-- -----------------------------------------------------------------------------
create or replace function public.perfil_atual()
returns perfil_usuario
language sql
stable
security definer
set search_path = public
as $$
  select u.perfil
  from public.usuarios_admin u
  where u.id = auth.uid()
    and u.ativo;
$$;

comment on function public.perfil_atual() is
  'Perfil de quem está autenticado agora, ou nulo se não for usuário ativo do painel.';

create or replace function public.tem_perfil(variadic perfis perfil_usuario[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.perfil_atual() = any(perfis), false);
$$;

comment on function public.tem_perfil(perfil_usuario[]) is
  'Verdadeiro quando o usuário autenticado tem um dos perfis informados.';

-- Mantém `atualizado_em` sempre correto, sem depender da aplicação lembrar.
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Registro de alterações
-- -----------------------------------------------------------------------------
create table if not exists public.log_auditoria (
  id            bigint generated always as identity primary key,
  tabela        text not null,
  registro_id   text,
  operacao      text not null check (operacao in ('INSERT', 'UPDATE', 'DELETE')),
  usuario_id    uuid,
  usuario_email text,
  antes         jsonb,
  depois        jsonb,
  em            timestamptz not null default now()
);

create index if not exists log_auditoria_tabela_em_idx on public.log_auditoria (tabela, em desc);
create index if not exists log_auditoria_usuario_idx on public.log_auditoria (usuario_id, em desc);

comment on table public.log_auditoria is
  'Quem mudou o quê e quando. Só leitura pelo painel; ninguém edita nem apaga.';

create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_registro_id text;
begin
  v_registro_id := coalesce(
    to_jsonb(new) ->> 'id',
    to_jsonb(old) ->> 'id',
    to_jsonb(new) ->> 'ano',
    to_jsonb(old) ->> 'ano'
  );

  insert into public.log_auditoria (
    tabela, registro_id, operacao, usuario_id, usuario_email, antes, depois
  )
  values (
    tg_table_name,
    v_registro_id,
    tg_op,
    auth.uid(),
    (select u.email from auth.users u where u.id = auth.uid()),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );

  return coalesce(new, old);
end;
$$;

comment on function public.registrar_auditoria() is
  'Trigger de auditoria. Aplique com: create trigger auditar_<tabela> after insert or update or delete on <tabela> for each row execute function public.registrar_auditoria();';

-- -----------------------------------------------------------------------------
-- Segurança
-- -----------------------------------------------------------------------------
alter table public.usuarios_admin enable row level security;
alter table public.log_auditoria enable row level security;

drop policy if exists "usuarios_admin_leitura" on public.usuarios_admin;
create policy "usuarios_admin_leitura"
  on public.usuarios_admin for select to authenticated
  using (id = auth.uid() or public.tem_perfil('admin'));

drop policy if exists "usuarios_admin_gestao" on public.usuarios_admin;
create policy "usuarios_admin_gestao"
  on public.usuarios_admin for all to authenticated
  using (public.tem_perfil('admin'))
  with check (public.tem_perfil('admin'));

-- O log é só de leitura, e só para administradores.
drop policy if exists "log_auditoria_leitura" on public.log_auditoria;
create policy "log_auditoria_leitura"
  on public.log_auditoria for select to authenticated
  using (public.tem_perfil('admin'));

drop trigger if exists tocar_usuarios_admin on public.usuarios_admin;
create trigger tocar_usuarios_admin
  before update on public.usuarios_admin
  for each row execute function public.tocar_atualizado_em();

drop trigger if exists auditar_usuarios_admin on public.usuarios_admin;
create trigger auditar_usuarios_admin
  after insert or update or delete on public.usuarios_admin
  for each row execute function public.registrar_auditoria();

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0002_conteudo.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

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

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0003_storage.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0003 — Armazenamento de arquivos
--
-- Dois baldes, de propósito:
--   midias                → público. Fotos e logomarcas que aparecem no site.
--   documentos-restritos  → privado. Termos de autorização de imagem, documentos
--                           com dados pessoais. Ninguém lê sem estar autenticado
--                           e com o perfil certo.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('midias', 'midias', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documentos-restritos', 'documentos-restritos', false)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- midias (público para leitura)
-- -----------------------------------------------------------------------------
drop policy if exists "midias_leitura" on storage.objects;
create policy "midias_leitura"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'midias');

drop policy if exists "midias_envio" on storage.objects;
create policy "midias_envio"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'midias' and public.tem_perfil('admin', 'comunicacao', 'coordenador'));

drop policy if exists "midias_atualizacao" on storage.objects;
create policy "midias_atualizacao"
  on storage.objects for update to authenticated
  using (bucket_id = 'midias' and public.tem_perfil('admin', 'comunicacao', 'coordenador'))
  with check (bucket_id = 'midias' and public.tem_perfil('admin', 'comunicacao', 'coordenador'));

-- Apagar arquivo é irreversível: só administrador.
drop policy if exists "midias_exclusao" on storage.objects;
create policy "midias_exclusao"
  on storage.objects for delete to authenticated
  using (bucket_id = 'midias' and public.tem_perfil('admin'));

-- -----------------------------------------------------------------------------
-- documentos-restritos (nada público)
-- -----------------------------------------------------------------------------
drop policy if exists "restritos_leitura" on storage.objects;
create policy "restritos_leitura"
  on storage.objects for select to authenticated
  using (bucket_id = 'documentos-restritos' and public.tem_perfil('admin', 'coordenador'));

drop policy if exists "restritos_envio" on storage.objects;
create policy "restritos_envio"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos-restritos' and public.tem_perfil('admin', 'coordenador'));

drop policy if exists "restritos_exclusao" on storage.objects;
create policy "restritos_exclusao"
  on storage.objects for delete to authenticated
  using (bucket_id = 'documentos-restritos' and public.tem_perfil('admin'));

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0004_apadrinhamento.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0004 — Apadrinhamento de Natal
--
-- Duas preocupações mandam no desenho deste arquivo:
--
--   1. Proteção de crianças e adolescentes. O que é público fica em `participantes`
--      e não tem nome completo, endereço, escola nem contato. O que identifica a
--      pessoa fica em `participantes_dados_restritos`, tabela separada que só
--      admin e coordenação conseguem ler.
--
--   2. Duas pessoas não podem apadrinhar a mesma criança. Isso é garantido por
--      duas barreiras independentes: um índice único parcial, que o banco não
--      deixa violar de jeito nenhum, e um bloqueio de linha na função de reserva,
--      que evita a corrida antes mesmo de ela acontecer.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_participante') then
    create type estado_participante as enum (
      'disponivel', 'reserva_pendente', 'apadrinhado', 'presente_recebido', 'concluido'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'status_campanha') then
    create type status_campanha as enum ('rascunho', 'aberta', 'encerrada', 'arquivada');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_apadrinhamento') then
    create type status_apadrinhamento as enum (
      'reservado', 'confirmado', 'presente_recebido', 'concluido', 'cancelado', 'expirado'
    );
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Campanhas
-- -----------------------------------------------------------------------------
create table if not exists public.campanhas (
  id                 uuid primary key default gen_random_uuid(),
  ano                int not null unique check (ano between 2018 and 2100),
  titulo             text not null,
  chamada            text,
  vinculo            text,
  descricao          text,
  valor_contribuicao numeric(10, 2),
  prazo_entrega      timestamptz,
  data_evento        timestamptz,
  local_evento       text,
  registro_url       text,
  registro_tipo      text check (registro_tipo in ('facebook', 'youtube', 'instagram', 'pagina')),
  observacao         text,
  horas_reserva      int not null default 48 check (horas_reserva between 1 and 720),
  status             status_campanha not null default 'rascunho',
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now()
);

comment on column public.campanhas.horas_reserva is
  'Prazo que o padrinho tem para confirmar antes de a reserva expirar e o participante voltar à vitrine.';
comment on column public.campanhas.status is
  'Só campanha "aberta" aceita novas reservas. "encerrada" e "arquivada" continuam visíveis como acervo.';

-- -----------------------------------------------------------------------------
-- Participantes — somente o que pode ser público
-- -----------------------------------------------------------------------------
create table if not exists public.participantes (
  id                uuid primary key default gen_random_uuid(),
  campanha_id       uuid not null references public.campanhas (id) on delete cascade,
  codigo_publico    text not null,
  idade             int check (idade between 0 and 25),
  projeto           text,
  genero            text check (genero in ('menina', 'menino', 'nao_informado')),
  tamanho_roupa     text,
  tamanho_calcado   text,
  sugestao_presente text,
  foto_id           uuid references public.midias (id) on delete set null,
  estado            estado_participante not null default 'disponivel',
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now(),

  unique (campanha_id, codigo_publico)
);

comment on table public.participantes is
  'Tudo nesta tabela é público. Nome completo, endereço, escola e contato NÃO entram aqui.';
comment on column public.participantes.codigo_publico is
  'Identificador mostrado no site, por exemplo P-2026-014.';

-- -----------------------------------------------------------------------------
-- Dados restritos — tabela separada, acesso restrito
-- -----------------------------------------------------------------------------
create table if not exists public.participantes_dados_restritos (
  participante_id     uuid primary key references public.participantes (id) on delete cascade,
  nome_completo       text not null,
  responsavel         text,
  contato             text,
  observacoes         text,
  autorizacao_imagem  text,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

comment on table public.participantes_dados_restritos is
  'Dados pessoais de crianças e adolescentes. Só admin e coordenação leem. Nenhuma página pública consulta esta tabela.';

-- -----------------------------------------------------------------------------
-- Apadrinhamentos
-- -----------------------------------------------------------------------------
create table if not exists public.apadrinhamentos (
  id                   uuid primary key default gen_random_uuid(),
  participante_id      uuid not null references public.participantes (id) on delete cascade,
  padrinho_nome        text not null,
  padrinho_email       text not null,
  padrinho_telefone    text,
  tipo                 text not null check (tipo in ('presente', 'financeiro')),
  mensagem             text,
  status               status_apadrinhamento not null default 'reservado',
  token                uuid not null default gen_random_uuid(),
  reserva_expira_em    timestamptz not null,
  confirmado_em        timestamptz,
  presente_recebido_em timestamptz,
  criado_em            timestamptz not null default now(),
  atualizado_em        timestamptz not null default now()
);

comment on table public.apadrinhamentos is
  'Contém dados pessoais de quem apadrinha. Nenhuma leitura pública.';

-- ESTA É A TRAVA. Um participante só pode ter um apadrinhamento vivo por vez.
-- Reserva cancelada ou expirada não bloqueia, e por isso ele volta para a vitrine.
create unique index if not exists apadrinhamento_ativo_unico
  on public.apadrinhamentos (participante_id)
  where status in ('reservado', 'confirmado', 'presente_recebido', 'concluido');

create index if not exists apadrinhamentos_expiracao_idx
  on public.apadrinhamentos (reserva_expira_em)
  where status = 'reservado';

create index if not exists participantes_campanha_estado_idx
  on public.participantes (campanha_id, estado);

-- =============================================================================
-- Expiração das reservas
-- =============================================================================
create or replace function public.expirar_reservas()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ids uuid[];
begin
  -- 1. Quais reservas venceram.
  select array_agg(id) into v_ids
    from public.apadrinhamentos
   where status = 'reservado'
     and reserva_expira_em < now();

  if v_ids is null then
    return 0;
  end if;

  -- 2. Marca como expiradas.
  update public.apadrinhamentos
     set status = 'expirado', atualizado_em = now()
   where id = any(v_ids);

  -- 3. Devolve à vitrine os participantes que ficaram sem apadrinhamento vivo.
  --    A checagem olha só de "confirmado" para frente: as reservas que acabaram
  --    de expirar não contam, e o índice único garante que não há outra ativa.
  update public.participantes p
     set estado = 'disponivel', atualizado_em = now()
   where p.estado = 'reserva_pendente'
     and exists (
       select 1 from public.apadrinhamentos a
        where a.id = any(v_ids) and a.participante_id = p.id
     )
     and not exists (
       select 1 from public.apadrinhamentos b
        where b.participante_id = p.id
          and b.status in ('confirmado', 'presente_recebido', 'concluido')
     );

  return array_length(v_ids, 1);
end;
$$;

comment on function public.expirar_reservas() is
  'Devolve à vitrine os participantes cuja reserva venceu. Chamada ao abrir a vitrine e, em produção, também por agendamento.';

-- =============================================================================
-- Reserva — o caminho por onde o visitante apadrinha
--
-- É SECURITY DEFINER de propósito: assim o público consegue criar a reserva
-- sem que exista uma política permitindo inserção livre em `apadrinhamentos`,
-- que é uma tabela com dados pessoais.
-- =============================================================================
create or replace function public.reservar_participante(
  p_participante_id uuid,
  p_nome            text,
  p_email           text,
  p_telefone        text,
  p_tipo            text,
  p_mensagem        text default null
)
returns table (sucesso boolean, mensagem text, token uuid, expira_em timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_participante public.participantes%rowtype;
  v_campanha     public.campanhas%rowtype;
  v_expira       timestamptz;
  v_token        uuid;
begin
  if coalesce(btrim(p_nome), '') = '' then
    return query select false, 'Informe o seu nome.', null::uuid, null::timestamptz;
    return;
  end if;

  if p_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return query select false, 'Informe um e-mail válido.', null::uuid, null::timestamptz;
    return;
  end if;

  if p_tipo not in ('presente', 'financeiro') then
    return query select false, 'Escolha como você quer participar.', null::uuid, null::timestamptz;
    return;
  end if;

  -- Bloqueia a linha do participante: quem chegar junto espera aqui.
  select * into v_participante
    from public.participantes
   where id = p_participante_id
     for update;

  if not found then
    return query select false, 'Participante não encontrado.', null::uuid, null::timestamptz;
    return;
  end if;

  select * into v_campanha from public.campanhas where id = v_participante.campanha_id;

  if v_campanha.status <> 'aberta' then
    return query select false, 'Esta campanha não está recebendo apadrinhamentos no momento.', null::uuid, null::timestamptz;
    return;
  end if;

  if v_participante.estado <> 'disponivel' then
    return query select false, 'Este participante acabou de ser escolhido por outra pessoa. Escolha outro.', null::uuid, null::timestamptz;
    return;
  end if;

  v_expira := now() + make_interval(hours => v_campanha.horas_reserva);

  insert into public.apadrinhamentos
    (participante_id, padrinho_nome, padrinho_email, padrinho_telefone, tipo, mensagem, reserva_expira_em)
  values
    (p_participante_id, btrim(p_nome), lower(btrim(p_email)), nullif(btrim(p_telefone), ''), p_tipo,
     nullif(btrim(p_mensagem), ''), v_expira)
  returning apadrinhamentos.token into v_token;

  update public.participantes
     set estado = 'reserva_pendente', atualizado_em = now()
   where id = p_participante_id;

  return query select true, 'Reserva registrada.', v_token, v_expira;

exception
  -- Segunda barreira: se duas transações passarem pelo bloqueio, o índice único
  -- derruba a segunda. O visitante recebe um recado, não um erro de sistema.
  when unique_violation then
    return query select false, 'Este participante acabou de ser escolhido por outra pessoa. Escolha outro.', null::uuid, null::timestamptz;
end;
$$;

revoke all on function public.reservar_participante(uuid, text, text, text, text, text) from public;
grant execute on function public.reservar_participante(uuid, text, text, text, text, text) to anon, authenticated;
grant execute on function public.expirar_reservas() to anon, authenticated;

-- =============================================================================
-- Triggers
-- =============================================================================
do $$
declare
  t text;
begin
  foreach t in array array['campanhas', 'participantes', 'participantes_dados_restritos', 'apadrinhamentos']
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
-- Segurança
-- =============================================================================
alter table public.campanhas                     enable row level security;
alter table public.participantes                 enable row level security;
alter table public.participantes_dados_restritos enable row level security;
alter table public.apadrinhamentos               enable row level security;

-- Campanhas: o público vê tudo que não é rascunho.
drop policy if exists "campanhas_leitura_publica" on public.campanhas;
create policy "campanhas_leitura_publica"
  on public.campanhas for select to anon, authenticated
  using (status <> 'rascunho');

drop policy if exists "campanhas_gestao" on public.campanhas;
create policy "campanhas_gestao"
  on public.campanhas for all to authenticated
  using (public.tem_perfil('admin', 'coordenador'))
  with check (public.tem_perfil('admin', 'coordenador'));

-- Participantes: visíveis quando a campanha deles é visível.
drop policy if exists "participantes_leitura_publica" on public.participantes;
create policy "participantes_leitura_publica"
  on public.participantes for select to anon, authenticated
  using (exists (
    select 1 from public.campanhas c
     where c.id = participantes.campanha_id
       and c.status <> 'rascunho'
  ));

drop policy if exists "participantes_gestao" on public.participantes;
create policy "participantes_gestao"
  on public.participantes for all to authenticated
  using (public.tem_perfil('admin', 'coordenador'))
  with check (public.tem_perfil('admin', 'coordenador'));

-- Dados restritos: nenhuma política para anon. Nem leitura.
drop policy if exists "dados_restritos_acesso" on public.participantes_dados_restritos;
create policy "dados_restritos_acesso"
  on public.participantes_dados_restritos for all to authenticated
  using (public.tem_perfil('admin', 'coordenador'))
  with check (public.tem_perfil('admin', 'coordenador'));

-- Apadrinhamentos: nenhuma leitura pública. Contém dados de quem apadrinha.
drop policy if exists "apadrinhamentos_gestao" on public.apadrinhamentos;
create policy "apadrinhamentos_gestao"
  on public.apadrinhamentos for all to authenticated
  using (public.tem_perfil('admin', 'coordenador'))
  with check (public.tem_perfil('admin', 'coordenador'));

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0005_status_apadrinhamento.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0005 — Mudança de status do apadrinhamento
--
-- O estado do participante e o status do apadrinhamento precisam andar juntos.
-- Deixar isso a cargo da aplicação significaria duas atualizações separadas, com
-- a chance de uma falhar e o banco ficar dizendo que o participante está livre
-- enquanto existe um apadrinhamento ativo para ele.
--
-- Esta função faz as duas numa transação só.
--
-- É SECURITY INVOKER (o padrão) de propósito: assim as políticas continuam
-- valendo e só admin e coordenação conseguem executá-la de verdade.
-- =============================================================================

create or replace function public.mudar_status_apadrinhamento(
  p_apadrinhamento_id uuid,
  p_novo              status_apadrinhamento
)
returns void
language plpgsql
as $$
declare
  v_participante uuid;
begin
  update public.apadrinhamentos
     set status = p_novo,
         confirmado_em = case
           when p_novo = 'confirmado' and confirmado_em is null then now()
           else confirmado_em
         end,
         presente_recebido_em = case
           when p_novo = 'presente_recebido' and presente_recebido_em is null then now()
           else presente_recebido_em
         end,
         atualizado_em = now()
   where id = p_apadrinhamento_id
  returning participante_id into v_participante;

  if v_participante is null then
    raise exception 'Apadrinhamento não encontrado, ou o seu perfil não tem permissão para alterá-lo.';
  end if;

  update public.participantes
     set estado = case p_novo
           when 'reservado'         then 'reserva_pendente'::estado_participante
           when 'confirmado'        then 'apadrinhado'::estado_participante
           when 'presente_recebido' then 'presente_recebido'::estado_participante
           when 'concluido'         then 'concluido'::estado_participante
           else 'disponivel'::estado_participante  -- cancelado e expirado devolvem à vitrine
         end,
         atualizado_em = now()
   where id = v_participante;
end;
$$;

comment on function public.mudar_status_apadrinhamento(uuid, status_apadrinhamento) is
  'Muda o status do apadrinhamento e o estado do participante na mesma transação. Cancelar ou expirar devolve o participante à vitrine.';

-- O Postgres concede execução a PUBLIC por padrão. Sem este revoke, um visitante
-- anônimo consegue chamar a função — as políticas o impedem de alterar qualquer
-- coisa, mas não há motivo para a porta ficar destrancada.
revoke all on function public.mudar_status_apadrinhamento(uuid, status_apadrinhamento) from public;
grant execute on function public.mudar_status_apadrinhamento(uuid, status_apadrinhamento) to authenticated;

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0006_midia_slots.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0006 — Onde cada foto aparece no site
--
-- O site tem lugares fixos para imagem: o carrossel do banner, a capa de cada
-- projeto, as fotos de cada ano da linha do tempo. Cada lugar tem um nome, o
-- "slot". Esta tabela diz qual foto ocupa qual lugar.
--
-- A mesma foto pode ocupar vários lugares: ela é descrita uma vez e apontada
-- quantas vezes for preciso.
-- =============================================================================

create table if not exists public.midia_slots (
  slot          text primary key,
  midia_id      uuid not null references public.midias (id) on delete cascade,
  atualizado_em timestamptz not null default now()
);

comment on table public.midia_slots is
  'Slot é o identificador do lugar no site, por exemplo home-hero-1 ou projeto-renascer-capa.';

create index if not exists midia_slots_midia_idx on public.midia_slots (midia_id);

drop trigger if exists tocar_midia_slots on public.midia_slots;
create trigger tocar_midia_slots
  before update on public.midia_slots
  for each row execute function public.tocar_atualizado_em();

drop trigger if exists auditar_midia_slots on public.midia_slots;
create trigger auditar_midia_slots
  after insert or update or delete on public.midia_slots
  for each row execute function public.registrar_auditoria();

alter table public.midia_slots enable row level security;

drop policy if exists "midia_slots_leitura_publica" on public.midia_slots;
create policy "midia_slots_leitura_publica"
  on public.midia_slots for select to anon, authenticated
  using (true);

drop policy if exists "midia_slots_escrita" on public.midia_slots;
create policy "midia_slots_escrita"
  on public.midia_slots for all to authenticated
  using (public.tem_perfil('admin', 'comunicacao', 'coordenador'))
  with check (public.tem_perfil('admin', 'comunicacao', 'coordenador'));

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0007_contribuicoes.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0007 — Apoio financeiro: apoiadores, contribuições e filiação associativa
--
-- Nenhuma destas tabelas tem leitura pública: todas guardam dados pessoais de
-- quem doa. O site registra a contribuição por uma função SECURITY DEFINER, do
-- mesmo jeito que a reserva do apadrinhamento, para não precisar existir uma
-- política permitindo inserção livre.
--
-- Esta é a FASE 1 do pagamento: PIX direto na conta do Instituto, sem taxa e sem
-- confirmação automática. A baixa é feita por uma pessoa no painel, conferindo o
-- extrato. A confirmação automática entra quando houver integração bancária.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'tipo_contribuicao') then
    create type tipo_contribuicao as enum ('unica', 'mensal');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_contribuicao') then
    create type status_contribuicao as enum ('aguardando', 'confirmada', 'cancelada');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_filiacao') then
    create type status_filiacao as enum ('em_analise', 'aprovada', 'recusada');
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Apoiadores
-- -----------------------------------------------------------------------------
create table if not exists public.apoiadores (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  email         text not null unique,
  telefone      text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.apoiadores is
  'Quem apoia financeiramente. Guardamos o mínimo: nome, e-mail e telefone. CPF só entra se e quando o Instituto precisar emitir recibo fiscal.';

-- -----------------------------------------------------------------------------
-- Contribuições
-- -----------------------------------------------------------------------------
create table if not exists public.contribuicoes (
  id             uuid primary key default gen_random_uuid(),
  apoiador_id    uuid not null references public.apoiadores (id) on delete cascade,
  tipo           tipo_contribuicao not null,
  valor          numeric(10, 2) not null check (valor > 0),
  metodo         text not null default 'pix' check (metodo in ('pix', 'outro')),
  status         status_contribuicao not null default 'aguardando',
  referencia     text not null unique,
  mensagem       text,
  confirmada_em  timestamptz,
  confirmada_por uuid references auth.users (id),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

comment on column public.contribuicoes.referencia is
  'Identificador que vai no PIX (txid). É por ele que a pessoa do financeiro casa o extrato com o registro.';
comment on column public.contribuicoes.tipo is
  'mensal registra a intenção de contribuir todo mês. Nesta fase o PIX não cobra sozinho: o acompanhamento é do Instituto.';

create index if not exists contribuicoes_status_idx on public.contribuicoes (status, criado_em desc);

-- -----------------------------------------------------------------------------
-- Filiação associativa
--
-- Separada do apoio financeiro de propósito: envolve direitos estatutários e
-- depende de aprovação da diretoria. Doar não torna ninguém associado.
-- -----------------------------------------------------------------------------
create table if not exists public.filiacoes (
  id                 uuid primary key default gen_random_uuid(),
  nome               text not null,
  email              text not null,
  telefone           text,
  motivacao          text,
  status             status_filiacao not null default 'em_analise',
  observacao_interna text,
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now()
);

-- =============================================================================
-- Registro de contribuição vindo do site
-- =============================================================================
create or replace function public.registrar_contribuicao(
  p_nome     text,
  p_email    text,
  p_telefone text,
  p_tipo     text,
  p_valor    numeric,
  p_mensagem text default null
)
returns table (sucesso boolean, mensagem text, referencia text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_apoiador   uuid;
  v_referencia text;
begin
  if coalesce(btrim(p_nome), '') = '' then
    return query select false, 'Informe o seu nome.', null::text;
    return;
  end if;

  if p_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return query select false, 'Informe um e-mail válido.', null::text;
    return;
  end if;

  if p_tipo not in ('unica', 'mensal') then
    return query select false, 'Escolha entre contribuição única ou mensal.', null::text;
    return;
  end if;

  if p_valor is null or p_valor <= 0 then
    return query select false, 'Informe um valor maior que zero.', null::text;
    return;
  end if;

  if p_valor > 100000 then
    return query select false, 'Para valores acima de R$ 100.000, fale direto com o Instituto.', null::text;
    return;
  end if;

  insert into public.apoiadores (nome, email, telefone)
  values (btrim(p_nome), lower(btrim(p_email)), nullif(btrim(p_telefone), ''))
  on conflict (email) do update
    set nome = excluded.nome,
        telefone = coalesce(excluded.telefone, public.apoiadores.telefone),
        atualizado_em = now()
  returning id into v_apoiador;

  -- Referência curta e sem ambiguidade visual, para caber no campo do PIX.
  v_referencia := 'IEAD' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  insert into public.contribuicoes (apoiador_id, tipo, valor, referencia, mensagem)
  values (v_apoiador, p_tipo::tipo_contribuicao, p_valor, v_referencia, nullif(btrim(p_mensagem), ''));

  return query select true, 'Contribuição registrada.', v_referencia;
end;
$$;

revoke all on function public.registrar_contribuicao(text, text, text, text, numeric, text) from public;
grant execute on function public.registrar_contribuicao(text, text, text, text, numeric, text) to anon, authenticated;

-- =============================================================================
-- Pedido de filiação vindo do site
-- =============================================================================
create or replace function public.registrar_filiacao(
  p_nome      text,
  p_email     text,
  p_telefone  text,
  p_motivacao text default null
)
returns table (sucesso boolean, mensagem text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(btrim(p_nome), '') = '' then
    return query select false, 'Informe o seu nome.';
    return;
  end if;

  if p_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return query select false, 'Informe um e-mail válido.';
    return;
  end if;

  insert into public.filiacoes (nome, email, telefone, motivacao)
  values (btrim(p_nome), lower(btrim(p_email)), nullif(btrim(p_telefone), ''), nullif(btrim(p_motivacao), ''));

  return query select true, 'Pedido registrado.';
end;
$$;

revoke all on function public.registrar_filiacao(text, text, text, text) from public;
grant execute on function public.registrar_filiacao(text, text, text, text) to anon, authenticated;

-- =============================================================================
-- Triggers
-- =============================================================================
do $$
declare
  t text;
begin
  foreach t in array array['apoiadores', 'contribuicoes', 'filiacoes']
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
-- Segurança — nenhuma leitura pública
-- =============================================================================
alter table public.apoiadores    enable row level security;
alter table public.contribuicoes enable row level security;
alter table public.filiacoes     enable row level security;

drop policy if exists "apoiadores_gestao" on public.apoiadores;
create policy "apoiadores_gestao"
  on public.apoiadores for all to authenticated
  using (public.tem_perfil('admin', 'financeiro'))
  with check (public.tem_perfil('admin', 'financeiro'));

drop policy if exists "contribuicoes_gestao" on public.contribuicoes;
create policy "contribuicoes_gestao"
  on public.contribuicoes for all to authenticated
  using (public.tem_perfil('admin', 'financeiro'))
  with check (public.tem_perfil('admin', 'financeiro'));

drop policy if exists "filiacoes_gestao" on public.filiacoes;
create policy "filiacoes_gestao"
  on public.filiacoes for all to authenticated
  using (public.tem_perfil('admin', 'financeiro'))
  with check (public.tem_perfil('admin', 'financeiro'));

-- =============================================================================
-- Configurações do PIX
--
-- Ficam em site_settings para o Instituto poder trocar pelo painel, sem mexer no
-- código. A chave começa vazia: publicar chave errada desvia doação.
-- =============================================================================
insert into public.site_settings (chave, valor, descricao) values
  ('pix', '{"chave": "", "nome": "", "cidade": ""}'::jsonb,
   'Dados do PIX usados para gerar o QR Code: chave, nome do recebedor (até 25 caracteres) e cidade (até 15).')
on conflict (chave) do nothing;

-- O perfil financeiro precisa poder alterar os dados do PIX. As políticas são
-- somadas, então esta convive com a de comunicação criada na migration 0002.
drop policy if exists "site_settings_escrita_financeiro" on public.site_settings;
create policy "site_settings_escrita_financeiro"
  on public.site_settings for all to authenticated
  using (public.tem_perfil('admin', 'financeiro'))
  with check (public.tem_perfil('admin', 'financeiro'));

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0008_transparencia.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

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

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0009_coluna_autorizacao.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

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

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0010_privilegio_de_coluna_midias.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

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

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0011_nome_e_observacao_participante.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0011 — Nome de exibição e observação pública do participante
--
-- POR QUE EXISTE: a campanha do Instituto mostra o PRIMEIRO NOME da criança no
-- material ("ANA BEATRIZ", "KAUÊ"), e o portal passa a mostrar também. Só que
-- a tabela `participantes` não tinha onde guardar nome nenhum: o nome completo
-- mora em `participantes_dados_restritos`, que é invisível para o site.
--
-- Isso era proposital — a vitrine original identificava por código. Com a
-- decisão do Instituto de publicar foto e nome, a separação continua
-- valendo, só muda onde fica a linha:
--
--   `participantes.nome_exibicao`          primeiro nome. Público.
--   `dados_restritos.nome_completo`        nome e sobrenome. Nunca sai daqui.
--
-- Continuam fora do alcance do público, como antes: nome completo, responsável,
-- contato e observações internas.
-- =============================================================================

alter table public.participantes
  add column if not exists nome_exibicao text;

comment on column public.participantes.nome_exibicao is
  'Primeiro nome, como aparece no site. O nome completo fica em participantes_dados_restritos.';

-- -----------------------------------------------------------------------------
-- Observação pública
--
-- O material da campanha traz recados que o padrinho precisa ler antes de
-- comprar — "Não uso vestido" é um deles. É informação da criança sobre si
-- mesma, não dado sensível, e sem ela o presente pode sair errado.
-- -----------------------------------------------------------------------------
alter table public.participantes
  add column if not exists observacao_publica text;

comment on column public.participantes.observacao_publica is
  'Recado curto da criança que ajuda quem vai comprar o presente. Público.';

-- =============================================================================
-- >>>>>>>>>>>>>>>>>>>> 0012_areas_ocultas.sql <<<<<<<<<<<<<<<<<<<<
-- =============================================================================

-- =============================================================================
-- 0012 — Áreas ocultas do site
--
-- POR QUE EXISTE: o portal nasceu com as nove áreas do menu, mas várias ainda
-- esperam material do Instituto. Uma aba "Transparência" que leva a uma página
-- vazia é pior do que aba nenhuma: quem clica conclui que o Instituto não
-- presta contas, quando a verdade é que o portal ainda não recebeu os
-- documentos.
--
-- Em vez de apagar páginas, que depois teriam de ser reconstruídas, o Instituto
-- escolhe o que aparece. A área oculta sai do menu, do rodapé, do mapa do site
-- e da seção que a promove na página inicial.
--
-- A PÁGINA CONTINUA EXISTINDO e respondendo no endereço dela. Isso é
-- deliberado: há links cruzados pelo site e links que as pessoas já
-- compartilharam. Sumir do menu é diferente de virar erro 404, e aqui a
-- intenção é a primeira — não anunciar o que ainda está vazio, sem quebrar
-- nada para quem chegar pelo caminho antigo.
-- =============================================================================

insert into public.site_settings (chave, valor, descricao) values
  ('areas_ocultas', '{"ocultas": []}'::jsonb,
   'Endereços das áreas que não aparecem no menu, no rodapé, no mapa do site nem na página inicial. A página em si continua respondendo.')
on conflict (chave) do nothing;
