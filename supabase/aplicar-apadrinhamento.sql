-- =============================================================================
-- APADRINHAMENTO — cole tudo de uma vez no SQL Editor do Supabase.
-- Contém a migração 0004 e os dados das campanhas de 2018 a 2026.
-- Pode ser rodado mais de uma vez.
-- =============================================================================

-- >>>>>>>>>>>>>>>>>>>> 0004_apadrinhamento.sql <<<<<<<<<<<<<<<<<<<<

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

-- >>>>>>>>>>>>>>>>>>>> seed-apadrinhamento.sql <<<<<<<<<<<<<<<<<<<<

-- =============================================================================
-- Apadrinhamento — campanhas de 2018 a 2026
--
-- As campanhas de 2018 a 2025 trazem os links REAIS encontrados na página de
-- apadrinhamento 2025 do Instituto, lida em 10/11/2026.
--
-- A campanha de 2026 entra como DEMONSTRAÇÃO: os participantes são fictícios e o
-- campo `observacao` carrega o aviso que aparece no site. Quando a lista real
-- chegar, apague os participantes de demonstração e limpe a observação.
--
-- Pode rodar mais de uma vez.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Campanhas anteriores — acervo
-- -----------------------------------------------------------------------------
insert into public.campanhas (ano, titulo, status, registro_tipo, registro_url, observacao) values
  (2018, 'Apadrinhamento 2018', 'arquivada', 'facebook',
   'https://www.facebook.com/media/set/?vanity=oficialiphg&set=a.749561798749764', null),
  (2019, 'Apadrinhamento 2019', 'arquivada', 'facebook',
   'https://www.facebook.com/media/set/?vanity=oficialiphg&set=a.991469307892344', null),
  (2020, 'Apadrinhamento 2020', 'arquivada', 'facebook',
   'https://www.facebook.com/media/set/?set=a.1904920446349233&type=3', null),
  (2021, 'Apadrinhamento 2021', 'arquivada', 'youtube',
   'https://www.youtube.com/watch?v=EvIj_C0bWyo', null),
  (2022, 'Apadrinhamento 2022', 'arquivada', 'youtube',
   'https://www.youtube.com/watch?v=32OHCpqBzfQ', null),
  (2023, 'Apadrinhamento 2023', 'arquivada', 'instagram',
   'https://www.instagram.com/p/C20o0P8Rqgr/',
   'Este link é idêntico ao registrado para 2024 na página atual do Instituto. Um dos dois está errado e precisa ser corrigido.'),
  (2024, 'Apadrinhamento 2024', 'arquivada', 'instagram',
   'https://www.instagram.com/tv/C20o0P8Rqgr/',
   'Mesmo link do registro de 2023. Aguardando o link correto.'),
  (2025, 'Apadrinhamento 2025', 'arquivada', 'pagina',
   'https://new.express.adobe.com/webpage/bqxKWz7aO4sSf',
   'Campanha publicada no Adobe Express. O conteúdo será importado para o acervo do portal.')
on conflict (ano) do update set
  titulo = excluded.titulo, status = excluded.status,
  registro_tipo = excluded.registro_tipo, registro_url = excluded.registro_url,
  observacao = excluded.observacao;

-- -----------------------------------------------------------------------------
-- Campanha vigente
--
-- Título sugerido no briefing, a confirmar. Prazo, data e local ainda não foram
-- informados pelo Instituto e por isso ficam nulos: a tela mostra "a confirmar"
-- em vez de repetir as datas de 2025.
-- -----------------------------------------------------------------------------
insert into public.campanhas
  (ano, titulo, chamada, vinculo, descricao, valor_contribuicao,
   prazo_entrega, data_evento, local_evento, horas_reserva, status, observacao)
values
  (2026,
   'Apadrinhamento 2026 | Natal Brasileiro: 10 anos semeando amor',
   'Um presente, uma criança, uma história que continua.',
   'Campanha vinculada à Cantata de Natal Brasileiro, Mig e Meg, e à celebração dos 10 anos do IEAD.',
   'Você escolhe um participante, consulta os tamanhos e a sugestão de presente, e entrega na sede do Instituto ou contribui para que a equipe monte o presente.',
   null,     -- valor de 2026 a confirmar (em 2025 foi R$ 250,00)
   null,     -- prazo de entrega a confirmar
   null,     -- data do evento a confirmar
   null,     -- local a confirmar
   48,
   'aberta',
   'Os participantes listados são fictícios e existem apenas para demonstrar o funcionamento da vitrine. Nenhuma criança real está publicada aqui.')
on conflict (ano) do update set
  titulo = excluded.titulo, chamada = excluded.chamada, vinculo = excluded.vinculo,
  descricao = excluded.descricao, horas_reserva = excluded.horas_reserva,
  status = excluded.status, observacao = excluded.observacao;

-- -----------------------------------------------------------------------------
-- Participantes de demonstração
--
-- Fictícios. Note o que NÃO existe aqui: nome, endereço, escola, responsável.
-- Esses campos moram em participantes_dados_restritos, e nenhum deles é público.
-- -----------------------------------------------------------------------------
insert into public.participantes
  (campanha_id, codigo_publico, idade, projeto, genero, tamanho_roupa, tamanho_calcado, sugestao_presente, estado)
select c.id, v.codigo, v.idade, v.projeto, v.genero, v.roupa, v.calcado, v.sugestao, v.estado::estado_participante
from public.campanhas c,
(values
  ('P-2026-001',  4, 'Sementes I',  'nao_informado', '4',  '26', 'Brinquedo de montar',   'disponivel'),
  ('P-2026-002',  5, 'Sementes I',  'menina',        '6',  '28', 'Boneca',                'disponivel'),
  ('P-2026-003',  8, 'Sementes II', 'menino',        '8',  '31', 'Bola de futebol',       'reserva_pendente'),
  ('P-2026-004',  9, 'Sementes II', 'nao_informado', '10', '32', 'Livro de aventura',     'apadrinhado'),
  ('P-2026-005',  7, 'Sementes II', 'nao_informado', '8',  '30', 'Jogo de tabuleiro',     'disponivel'),
  ('P-2026-006', 11, 'Sementes II', 'menina',        '12', '34', 'Kit de desenho',        'presente_recebido'),
  ('P-2026-007', 13, 'Oficina 5.5', 'nao_informado', 'P',  '36', 'Mochila escolar',       'disponivel'),
  ('P-2026-008', 14, 'Oficina 5.5', 'menino',        'M',  '38', 'Fone de ouvido',        'disponivel'),
  ('P-2026-009', 15, 'Oficina 5.5', 'nao_informado', 'M',  '39', 'Tênis',                 'disponivel'),
  ('P-2026-010',  6, 'Sementes I',  'nao_informado', '6',  '29', 'Quebra-cabeça',         'disponivel'),
  ('P-2026-011', 10, 'Sementes II', 'menina',        '10', '33', 'Material de pintura',   'disponivel'),
  ('P-2026-012', 16, 'Oficina 5.5', 'nao_informado', 'G',  '40', 'Camiseta e caderno',    'disponivel')
) as v(codigo, idade, projeto, genero, roupa, calcado, sugestao, estado)
where c.ano = 2026
on conflict (campanha_id, codigo_publico) do update set
  idade = excluded.idade, projeto = excluded.projeto, genero = excluded.genero,
  tamanho_roupa = excluded.tamanho_roupa, tamanho_calcado = excluded.tamanho_calcado,
  sugestao_presente = excluded.sugestao_presente;

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select c.ano, c.status, count(p.id) as participantes
from public.campanhas c
left join public.participantes p on p.campanha_id = c.id
group by c.ano, c.status
order by c.ano;
