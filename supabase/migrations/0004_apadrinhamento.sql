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
