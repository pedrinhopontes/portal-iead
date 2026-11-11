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
