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
