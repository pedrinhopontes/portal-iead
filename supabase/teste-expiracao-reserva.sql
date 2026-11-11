-- =============================================================================
-- Teste: a reserva de apadrinhamento vence sozinha?
--
-- Era o único teste do plano que ainda não tinha sido exercitado. Ele:
--   1. reserva um participante disponível pelo mesmo caminho que o site usa;
--   2. força o vencimento da reserva, adiantando o relógio;
--   3. roda a expiração;
--   4. confere se o participante voltou para a vitrine;
--   5. apaga tudo o que criou.
--
-- Rode no SQL Editor. O resultado aparece na tabela no fim.
-- =============================================================================

drop table if exists resultado_teste;
create temp table resultado_teste (ordem int, passo text, resultado text);

do $$
declare
  v_participante uuid;
  v_codigo       text;
  v_reserva      record;
  v_estado       text;
  v_expiradas    int;
begin
  -- 1. Um participante livre de uma campanha aberta
  select p.id, p.codigo_publico
    into v_participante, v_codigo
    from public.participantes p
    join public.campanhas c on c.id = p.campanha_id
   where c.status = 'aberta'
     and p.estado = 'disponivel'
   order by p.codigo_publico
   limit 1;

  if v_participante is null then
    insert into resultado_teste values (1, 'ABORTADO', 'nenhum participante disponivel numa campanha aberta');
    return;
  end if;

  insert into resultado_teste values (1, 'participante escolhido', v_codigo);

  -- 2. Reserva pelo mesmo caminho do site
  select * into v_reserva
    from public.reservar_participante(
      v_participante, 'TESTE EXPIRACAO', 'teste-expiracao@exemplo.invalid',
      '', 'presente', 'TESTE EXPIRACAO - APAGAR');

  insert into resultado_teste values (2, 'reserva aceita', v_reserva.sucesso::text);

  select estado into v_estado from public.participantes where id = v_participante;
  insert into resultado_teste values
    (3, 'estado apos reservar', v_estado || '   (esperado: reserva_pendente)');

  -- 3. Adianta o relogio: a reserva passa a estar vencida
  update public.apadrinhamentos
     set reserva_expira_em = now() - interval '1 hour'
   where participante_id = v_participante
     and status = 'reservado';

  -- 4. Roda a expiracao
  select public.expirar_reservas() into v_expiradas;
  insert into resultado_teste values (4, 'reservas expiradas', v_expiradas::text);

  select estado into v_estado from public.participantes where id = v_participante;
  insert into resultado_teste values
    (5, 'estado apos expirar', v_estado || '   (esperado: disponivel)');

  insert into resultado_teste values
    (6, 'VEREDITO', case when v_estado = 'disponivel' then 'PASSOU' else 'FALHOU' end);

  -- 5. Limpeza
  delete from public.apadrinhamentos where mensagem = 'TESTE EXPIRACAO - APAGAR';
  insert into resultado_teste values (7, 'limpeza', 'reserva de teste apagada');
end
$$;

select passo, resultado from resultado_teste order by ordem;
