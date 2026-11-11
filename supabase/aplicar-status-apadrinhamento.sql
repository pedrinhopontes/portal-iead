-- =============================================================================
-- MUDANÇA DE STATUS — cole no SQL Editor do Supabase.
-- Contém a migração 0005.
-- Pode ser rodado mais de uma vez.
-- =============================================================================

-- >>>>>>>>>>>>>>>>>>>> 0005_status_apadrinhamento.sql <<<<<<<<<<<<<<<<<<<<

-- =============================================================================
-- 0005 — Mudança de status do apadrinhamento
--
-- O estado do participante e o status do apadrinhamento precisam andar juntos.
-- Deixar isso a cargo da aplicação significaria duas atualizações separadas, com
-- a chance de uma falhar e o banco ficar dizendo que o participante está livre
-- enquanto existe um apadrinhamento ativo para ele.
--
-- Esta função faz as duas numa transação só.
--
-- É SECURITY INVOKER (o padrão) de propósito: assim as políticas continuam
-- valendo e só admin e coordenação conseguem executá-la de verdade.
-- =============================================================================

create or replace function public.mudar_status_apadrinhamento(
  p_apadrinhamento_id uuid,
  p_novo              status_apadrinhamento
)
returns void
language plpgsql
as $$
declare
  v_participante uuid;
begin
  update public.apadrinhamentos
     set status = p_novo,
         confirmado_em = case
           when p_novo = 'confirmado' and confirmado_em is null then now()
           else confirmado_em
         end,
         presente_recebido_em = case
           when p_novo = 'presente_recebido' and presente_recebido_em is null then now()
           else presente_recebido_em
         end,
         atualizado_em = now()
   where id = p_apadrinhamento_id
  returning participante_id into v_participante;

  if v_participante is null then
    raise exception 'Apadrinhamento não encontrado, ou o seu perfil não tem permissão para alterá-lo.';
  end if;

  update public.participantes
     set estado = case p_novo
           when 'reservado'         then 'reserva_pendente'::estado_participante
           when 'confirmado'        then 'apadrinhado'::estado_participante
           when 'presente_recebido' then 'presente_recebido'::estado_participante
           when 'concluido'         then 'concluido'::estado_participante
           else 'disponivel'::estado_participante  -- cancelado e expirado devolvem à vitrine
         end,
         atualizado_em = now()
   where id = v_participante;
end;
$$;

comment on function public.mudar_status_apadrinhamento(uuid, status_apadrinhamento) is
  'Muda o status do apadrinhamento e o estado do participante na mesma transação. Cancelar ou expirar devolve o participante à vitrine.';

-- O Postgres concede execução a PUBLIC por padrão. Sem este revoke, um visitante
-- anônimo consegue chamar a função — as políticas o impedem de alterar qualquer
-- coisa, mas não há motivo para a porta ficar destrancada.
revoke all on function public.mudar_status_apadrinhamento(uuid, status_apadrinhamento) from public;
grant execute on function public.mudar_status_apadrinhamento(uuid, status_apadrinhamento) to authenticated;
