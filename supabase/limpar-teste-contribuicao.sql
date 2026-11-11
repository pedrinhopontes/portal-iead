-- =============================================================================
-- Limpeza da doação de teste
--
-- O teste registrou uma contribuição de R$ 12,34 em nome de "TESTE AUTOMATICO"
-- pelo mesmo caminho que o site usa, para provar que o fluxo funciona ponta a
-- ponta. Rode isto quando quiser tirá-la do painel.
-- =============================================================================

delete from public.contribuicoes
 where mensagem = 'TESTE - APAGAR';

delete from public.apoiadores
 where email = 'teste@exemplo.invalid';

-- Conferência: não deve sobrar nada de teste.
select count(*) as contribuicoes_restantes from public.contribuicoes;
