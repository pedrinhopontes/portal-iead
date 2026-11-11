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
