-- =============================================================================
-- Primeiro usuário do painel — JÁ PREENCHIDO
--
-- Rode este arquivo inteiro no SQL Editor do Supabase.
--
-- Este passo é manual uma única vez. Daqui em diante, os usuários são cadastrados
-- pelo próprio painel, por quem tem o perfil "admin".
-- =============================================================================

insert into public.usuarios_admin (id, nome, email, perfil)
values (
  '68f1954a-dbe5-4071-a8c2-3b1789a14908',
  'Instituto Educacional Araujo Dutra',
  'iearaujodutra@gmail.com',
  'admin'
)
on conflict (id) do update
  set nome   = excluded.nome,
      email  = excluded.email,
      perfil = excluded.perfil,
      ativo  = true;

-- Confirmação: deve aparecer uma linha com perfil "admin" e ativo = true.
select u.nome, u.email, u.perfil, u.ativo, u.criado_em
from public.usuarios_admin u
order by u.criado_em;
