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
