-- =============================================================================
-- 0011 — Nome de exibição e observação pública do participante
--
-- POR QUE EXISTE: a campanha do Instituto mostra o PRIMEIRO NOME da criança no
-- material ("ANA BEATRIZ", "KAUÊ"), e o portal passa a mostrar também. Só que
-- a tabela `participantes` não tinha onde guardar nome nenhum: o nome completo
-- mora em `participantes_dados_restritos`, que é invisível para o site.
--
-- Isso era proposital — a vitrine original identificava por código. Com a
-- decisão do Instituto de publicar foto e nome, a separação continua
-- valendo, só muda onde fica a linha:
--
--   `participantes.nome_exibicao`          primeiro nome. Público.
--   `dados_restritos.nome_completo`        nome e sobrenome. Nunca sai daqui.
--
-- Continuam fora do alcance do público, como antes: nome completo, responsável,
-- contato e observações internas.
-- =============================================================================

alter table public.participantes
  add column if not exists nome_exibicao text;

comment on column public.participantes.nome_exibicao is
  'Primeiro nome, como aparece no site. O nome completo fica em participantes_dados_restritos.';

-- -----------------------------------------------------------------------------
-- Observação pública
--
-- O material da campanha traz recados que o padrinho precisa ler antes de
-- comprar — "Não uso vestido" é um deles. É informação da criança sobre si
-- mesma, não dado sensível, e sem ela o presente pode sair errado.
-- -----------------------------------------------------------------------------
alter table public.participantes
  add column if not exists observacao_publica text;

comment on column public.participantes.observacao_publica is
  'Recado curto da criança que ajuda quem vai comprar o presente. Público.';
