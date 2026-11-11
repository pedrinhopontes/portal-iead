-- =============================================================================
-- Chave PIX oficial do IEAD
--
-- Confirmada pelo Instituto em 11/11/2026. A chave aparece no material da
-- campanha de Natal 2026, em todos os 41 cartões.
--
-- O material também traz banco, agência e conta. Não estão aqui: o site gera
-- o QR Code só com a chave, e o que o código não usa não precisa entrar num
-- repositório público. Os dados bancários ficam com o Instituto.
--
-- O site gera o QR Code a partir destes três campos, sem intermediário e sem
-- taxa por transação: o valor doado chega inteiro na conta do Instituto.
--
-- LIMITES DO PADRÃO (EMV®QRCPS do Banco Central), por isso os textos abaixo
-- não são o nome por extenso:
--   nome do recebedor   até 25 caracteres
--   cidade              até 15 caracteres
-- Sem acento e sem pontuação fora de ponto e hífen — o gerador limpa sozinho,
-- mas é melhor já gravar limpo do que depender disso.
--
-- Rode no SQL Editor do Supabase. Pode repetir.
-- =============================================================================

update public.site_settings
   set valor = jsonb_build_object(
         'chave',  'iearaujodutra@gmail.com',
         'nome',   'INSTITUTO ARAUJO DUTRA',
         'cidade', 'RIO DE JANEIRO'
       )
 where chave = 'pix';

-- Se a linha ainda não existir (banco criado antes da migração 0007).
insert into public.site_settings (chave, valor, descricao)
select
  'pix',
  jsonb_build_object(
    'chave',  'iearaujodutra@gmail.com',
    'nome',   'INSTITUTO ARAUJO DUTRA',
    'cidade', 'RIO DE JANEIRO'
  ),
  'Dados do PIX usados para gerar o QR Code: chave, nome do recebedor (até 25 caracteres) e cidade (até 15).'
where not exists (select 1 from public.site_settings where chave = 'pix');

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select
  valor ->> 'chave'                      as chave_pix,
  valor ->> 'nome'                       as nome_recebedor,
  length(valor ->> 'nome')               as tamanho_nome,
  valor ->> 'cidade'                     as cidade,
  length(valor ->> 'cidade')             as tamanho_cidade
from public.site_settings
where chave = 'pix';
