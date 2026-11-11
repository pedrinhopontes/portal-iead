-- =============================================================================
-- Limpeza do teste de concorrência
--
-- O teste disparou 8 reservas simultâneas em P-2026-001 para provar que só uma
-- é aceita. A reserva vencedora ficou gravada no banco com dados fictícios.
-- Rode este arquivo para apagá-la e devolver o participante à vitrine.
-- =============================================================================

delete from public.apadrinhamentos
 where mensagem = 'TESTE AUTOMATICO - APAGAR';

update public.participantes
   set estado = 'disponivel'
 where codigo_publico = 'P-2026-001'
   and not exists (
     select 1 from public.apadrinhamentos a
      where a.participante_id = participantes.id
        and a.status in ('reservado', 'confirmado', 'presente_recebido', 'concluido')
   );

-- Conferência: todos devem voltar ao estado de origem.
select codigo_publico, estado
from public.participantes p
join public.campanhas c on c.id = p.campanha_id
where c.ano = 2026
order by codigo_publico;
