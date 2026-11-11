-- =============================================================================
-- 0013 — Galeria e vídeo na notícia
--
-- POR QUE EXISTE: para pôr uma foto numa notícia, era preciso salvar a
-- notícia, sair para a tela de Fotos, enviar a imagem, lembrar o endereço da
-- notícia e ligar os dois à mão. Quem escreve uma notícia quer escrever a
-- notícia — não administrar um acervo de imagens no meio do caminho.
--
-- Agora a notícia tem capa, galeria e vídeo, tudo preenchido no mesmo
-- formulário.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Vídeo: link, não arquivo
--
-- Guardar vídeo no armazenamento do Supabase acabaria com o plano gratuito
-- (1 GB) em dois ou três arquivos de celular, e cada exibição gastaria banda
-- do Instituto. O IEAD já publica no YouTube e no Instagram, que hospedam de
-- graça e entregam rápido. Aqui fica só o endereço.
-- -----------------------------------------------------------------------------
alter table public.noticias
  add column if not exists video_url text;

comment on column public.noticias.video_url is
  'Endereço do vídeo no YouTube, Instagram ou Facebook. O arquivo não é hospedado aqui.';

-- -----------------------------------------------------------------------------
-- Galeria da notícia
--
-- Tabela de ligação em vez de reaproveitar `midia_slots`: a galeria tem ORDEM,
-- e slot é um nome fixo por lugar. Com ordem explícita, o Instituto decide a
-- sequência do carrossel.
-- -----------------------------------------------------------------------------
create table if not exists public.noticia_midias (
  noticia_id uuid not null references public.noticias (id) on delete cascade,
  midia_id   uuid not null references public.midias (id)   on delete cascade,
  ordem      int  not null default 0,

  primary key (noticia_id, midia_id)
);

create index if not exists noticia_midias_ordem_idx
  on public.noticia_midias (noticia_id, ordem);

alter table public.noticia_midias enable row level security;

-- Leitura pública apenas do que pertence a notícia publicada: galeria de
-- rascunho não vaza pela API antes de a notícia ir ao ar.
drop policy if exists "noticia_midias_leitura_publica" on public.noticia_midias;
create policy "noticia_midias_leitura_publica"
  on public.noticia_midias for select to anon, authenticated
  using (
    exists (
      select 1 from public.noticias n
       where n.id = noticia_midias.noticia_id
         and n.publicado
    )
  );

drop policy if exists "noticia_midias_escrita_comunicacao" on public.noticia_midias;
create policy "noticia_midias_escrita_comunicacao"
  on public.noticia_midias for all to authenticated
  using (public.tem_perfil('admin', 'comunicacao'))
  with check (public.tem_perfil('admin', 'comunicacao'));

drop trigger if exists noticia_midias_auditoria on public.noticia_midias;
create trigger noticia_midias_auditoria
  after insert or update or delete on public.noticia_midias
  for each row execute function public.registrar_auditoria();

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select
  (select count(*) from information_schema.columns
    where table_name = 'noticias' and column_name = 'video_url')  as tem_video_url,
  (select count(*) from information_schema.tables
    where table_name = 'noticia_midias')                          as tem_tabela_galeria,
  (select count(*) from pg_policies
    where tablename = 'noticia_midias')                           as politicas;
