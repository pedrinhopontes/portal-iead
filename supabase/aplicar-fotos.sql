-- =============================================================================
-- LUGARES DE FOTO — cole no SQL Editor do Supabase.
-- Contém a migração 0006.
-- Pode ser rodado mais de uma vez.
-- =============================================================================

-- >>>>>>>>>>>>>>>>>>>> 0006_midia_slots.sql <<<<<<<<<<<<<<<<<<<<

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
