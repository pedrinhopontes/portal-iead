-- =============================================================================
-- Conteúdo inicial — leva para o banco o que hoje está nos arquivos de
-- src/content/. Pode rodar mais de uma vez: tudo usa "on conflict do update".
--
-- O que NÃO entra aqui, e por quê:
--
--   As fotos do acervo que mostram crianças e adolescentes. A restrição
--   `midia_menor_exige_autorizacao` recusa o cadastro enquanto o Instituto não
--   informar qual termo de autorização de imagem cobre cada uma. Nove das doze
--   fotos estão nessa situação. Isso é a trava funcionando, não um defeito.
--   Assim que as referências chegarem, elas entram.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Garante as chaves únicas que tornam este arquivo seguro para rodar de novo.
-- (Já estão na migration 0002; este bloco cobre bancos criados antes dela.)
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'indicadores_rotulo_key') then
    alter table public.indicadores add constraint indicadores_rotulo_key unique (rotulo);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'parceiros_nome_key') then
    alter table public.parceiros add constraint parceiros_nome_key unique (nome);
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Indicadores de impacto
-- -----------------------------------------------------------------------------
insert into public.indicadores (rotulo, valor, verificado, fonte, ordem) values
  ('Anos de atuação', '10', true, 'Fundação do Instituto em 2016, informada pelo IEAD', 1),
  ('Crianças e adolescentes atendidos', null, false, null, 2),
  ('Famílias acompanhadas', null, false, null, 3),
  ('Projetos em andamento', null, false, null, 4)
on conflict (rotulo) do update set
  valor = excluded.valor, verificado = excluded.verificado,
  fonte = excluded.fonte, ordem = excluded.ordem;

-- -----------------------------------------------------------------------------
-- Projetos
-- -----------------------------------------------------------------------------
insert into public.projetos
  (slug, nome, chamada, publico, faixa_etaria, observacao, resumo, objetivos, atividades, paleta, ordem, publicado)
values
  ('sementes-1', 'Sementes I', 'Primeira infância', 'Crianças', '3 a 5 anos',
   'O site atual apresenta o Sementes como um projeto único para crianças de 3 a 12 anos. Confirmar a divisão em Sementes I e II e as faixas corretas.',
   'Atividades lúdicas, educativas e de desenvolvimento infantil para crianças na primeira infância, em contraturno escolar.',
   array['Estimular o desenvolvimento motor, cognitivo e afetivo','Fortalecer o vínculo da criança com a família e com a comunidade','Preparar a transição para os anos iniciais do ensino fundamental'],
   array['Atividades lúdicas dirigidas','Contação de histórias','Expressão artística','Acompanhamento familiar'],
   'verde', 1, true),

  ('sementes-2', 'Sementes II', 'Infância', 'Crianças', '7 a 11 anos',
   'Confirmar a faixa etária e o que acontece com as crianças de 6 anos, que ficam de fora entre Sementes I e Sementes II.',
   'Atividades socioeducativas, culturais, artísticas e de fortalecimento de vínculos para crianças em idade escolar.',
   array['Ampliar o repertório cultural e artístico','Apoiar o desempenho escolar','Fortalecer vínculos familiares e comunitários'],
   array['Oficinas de arte','Atividades esportivas','Reforço e apoio escolar','Passeios e vivências culturais'],
   'bordo', 2, true),

  ('oficina-5-5', 'Oficina 5.5', 'Adolescência', 'Adolescentes', '12 a 16 anos',
   'O site atual informa 13 a 18 anos. Confirmar a faixa correta.',
   'Espaço de reflexão, cidadania, identidade, cultura e desenvolvimento pessoal para adolescentes.',
   array['Promover protagonismo juvenil e participação cidadã','Trabalhar identidade, autoestima e projeto de vida','Prevenir situações de vulnerabilidade e violência'],
   array['Rodas de conversa','Oficinas culturais','Projetos de cidadania','Atividades de protagonismo'],
   'ardosia', 3, true),

  ('renascer', 'Renascer', 'Mulheres e pessoas idosas', 'Mulheres e pessoas idosas', null, null,
   'Atividades de convivência e valorização pessoal voltadas a mulheres e pessoas idosas da comunidade.',
   array['Promover convivência e combater o isolamento','Valorizar saberes e histórias de vida','Estimular autonomia e cuidado com a saúde'],
   array['Oficinas de artesanato e pintura','Encontros de convivência','Atividades de bem-estar'],
   'verde', 4, true),

  ('pre-vestibular-libertas', 'Pré-Vestibular Libertas', 'Acesso ao ensino superior', 'Jovens e adultos', null,
   'Confirmar a relação com o projeto Liberta-se (alfabetização de adultos) listado no site atual: são o mesmo projeto, projetos distintos ou um sucedeu o outro?',
   'Preparação educacional gratuita para o ingresso no ensino superior, em articulação com a Rede Guadalupe e o Movimento PERIFARIO.',
   array['Ampliar o acesso de jovens da periferia ao ensino superior','Preparar para o ENEM e para os vestibulares','Oferecer orientação sobre carreiras e políticas de acesso'],
   array['Aulas preparatórias','Simulados','Orientação vocacional','Apoio à inscrição em processos seletivos'],
   'bordo', 5, true),

  ('ingles-social', 'Inglês Social', 'Idiomas', 'Crianças, adolescentes e jovens', null, null,
   'Iniciativa de acesso à aprendizagem da língua inglesa para quem não teria como pagar um curso particular.',
   array['Democratizar o acesso ao aprendizado de idiomas','Ampliar oportunidades de estudo e trabalho','Estimular o contato com outras culturas'],
   array['Aulas regulares de inglês','Atividades de conversação','Material didático de apoio'],
   'ardosia', 6, true)
on conflict (slug) do update set
  nome = excluded.nome, chamada = excluded.chamada, publico = excluded.publico,
  faixa_etaria = excluded.faixa_etaria, observacao = excluded.observacao, resumo = excluded.resumo,
  objetivos = excluded.objetivos, atividades = excluded.atividades, paleta = excluded.paleta,
  ordem = excluded.ordem, publicado = excluded.publicado;

-- -----------------------------------------------------------------------------
-- Linha do tempo
-- -----------------------------------------------------------------------------
insert into public.timeline_anos (ano, titulo, texto, acontecimentos, destaque, publicado) values
  (2016, 'A fundação', 'Nasce o Instituto Educacional Araujo Dutra, em Guadalupe, no Rio de Janeiro.',
   array['Fundação do Instituto'], true, true),
  (2017, 'Formação e cuidado', 'Atividades de formação profissional, com destaque para a iniciativa de cuidador de idosos.',
   array['Iniciativa de cuidador de idosos em parceria com Furnas'], false, true),
  (2018, 'Cursos e atividades formativas', 'Desenvolvimento de cursos e atividades formativas.',
   array['Ampliação da oferta de cursos'], false, true),
  (2019, 'Empreendedorismo e ampliação', 'Iniciativas de empreendedorismo e ampliação das atividades do Instituto.',
   array['Registro no CMDCA-Rio sob o número 05/2019'], false, true),
  (2020, null, null, array[]::text[], false, true),
  (2021, null, null, array[]::text[], false, true),
  (2022, null, null, array[]::text[], false, true),
  (2023, null, null, array[]::text[], false, true),
  (2024, null, null, array[]::text[], false, true),
  (2025, null, null, array[]::text[], false, true),
  (2026, '10 anos: infâncias protegidas, futuros possíveis',
   'Ano da comemoração dos 10 anos do Instituto, com fortalecimento das parcerias institucionais.',
   array['Participação no processo do CMDCA-Rio, com o IEAD eleito em 7º lugar',
         'Seminário e evento comemorativo dos 10 anos, em 7 de novembro de 2026'], true, true)
on conflict (ano) do update set
  titulo = excluded.titulo, texto = excluded.texto,
  acontecimentos = excluded.acontecimentos, destaque = excluded.destaque;

-- -----------------------------------------------------------------------------
-- Parceiros e redes
-- -----------------------------------------------------------------------------
insert into public.parceiros (nome, descricao, ordem, publicado) values
  ('CMDCA-Rio', 'Conselho Municipal dos Direitos da Criança e do Adolescente', 1, true),
  ('FePeti-RJ', 'Fórum Estadual de Prevenção e Erradicação do Trabalho Infantil', 2, true),
  ('Visão Mundial', 'Organização parceira', 3, true),
  ('Plataforma MROSC', 'Marco Regulatório das Organizações da Sociedade Civil', 4, true),
  ('Mapa das OSCs', 'Mapa das Organizações da Sociedade Civil', 5, true)
on conflict (nome) do update set
  descricao = excluded.descricao, ordem = excluded.ordem, publicado = excluded.publicado;

-- -----------------------------------------------------------------------------
-- Fotos SEM menores identificáveis — as únicas que a trava deixa entrar agora
-- -----------------------------------------------------------------------------
insert into public.midias (caminho, alt, legenda, ano, tem_menores) values
  ('/imagens/acervo/acervo-2017-1.jpg',
   'Integrantes do Instituto apresentam o IEAD em uma sala, ao lado de uma tela que exibe a primeira identidade visual da instituição',
   '2017 — Primeiras apresentações institucionais', 2017, false),
  ('/imagens/acervo/acervo-2017-2.jpg',
   'Três integrantes do Instituto sentados a uma mesa durante apresentação, com um slide intitulado Finalidades projetado ao lado',
   '2017 — As finalidades do Instituto', 2017, false),
  ('/imagens/acervo/acervo-2018-1.jpg',
   'Turma de formandos em beca preta e verde reunida para foto após a cerimônia de formatura',
   '2018 — Formatura de turma de formação', 2018, false)
on conflict (caminho) do update set
  alt = excluded.alt, legenda = excluded.legenda, ano = excluded.ano;

-- -----------------------------------------------------------------------------
-- Notícias — todas como RASCUNHO. Nenhuma vai ao ar sem revisão da comunicação.
-- -----------------------------------------------------------------------------
insert into public.noticias (slug, titulo, resumo, corpo, categoria, data, publicado) values
  ('seminario-10-anos-iead',
   'Seminário Educação que Transforma marca os 10 anos do IEAD',
   'O Instituto reuniu parceiros e convidados no seminário que abriu as comemorações de uma década de atuação em Guadalupe.',
   E'O Instituto Educacional Araujo Dutra realizou, em 7 de novembro de 2026, o seminário que marca os seus 10 anos de atuação.\n\nA programação completa, a lista de palestrantes e os registros do encontro serão publicados nesta página assim que o Instituto enviar o material.',
   'Institucional', '2026-11-07', false),

  ('cmdca-rio-2026',
   'IEAD é eleito em 7º lugar no processo do CMDCA-Rio',
   'O resultado fortalece a participação do Instituto nas instâncias de defesa dos direitos da criança e do adolescente na cidade.',
   E'O IEAD foi eleito em 7º lugar no processo do Conselho Municipal dos Direitos da Criança e do Adolescente do Rio de Janeiro, conforme informado pelo Instituto.\n\nO detalhamento do processo e a data oficial do resultado serão acrescentados após confirmação.',
   'Conquistas', null, false),

  ('apadrinhamento-2026-aberto',
   'Apadrinhamento de Natal 2026 está com inscrições abertas',
   'A campanha deste ano celebra os 10 anos do Instituto e está vinculada à Cantata de Natal Brasileiro.',
   E'A campanha de apadrinhamento de 2026 já pode receber padrinhos e madrinhas pela área de apadrinhamento do portal.\n\nPrazo de entrega dos presentes, data e local do evento de encerramento serão divulgados assim que confirmados.',
   'Campanhas', null, false),

  ('pre-vestibular-libertas-inscricoes',
   'Pré-Vestibular Libertas abre inscrições',
   'A iniciativa é realizada em articulação com a Rede Guadalupe e o Movimento PERIFARIO.',
   E'O Pré-Vestibular Libertas recebe inscrições de jovens e adultos que querem se preparar para o ingresso no ensino superior.\n\nRequisitos, calendário e número de vagas serão publicados após confirmação com a coordenação do projeto.',
   'Projetos', null, false)
on conflict (slug) do update set
  titulo = excluded.titulo, resumo = excluded.resumo, corpo = excluded.corpo,
  categoria = excluded.categoria, data = excluded.data;

-- -----------------------------------------------------------------------------
-- Conferência
-- -----------------------------------------------------------------------------
select 'indicadores' as tabela, count(*) from public.indicadores
union all select 'projetos', count(*) from public.projetos
union all select 'timeline_anos', count(*) from public.timeline_anos
union all select 'parceiros', count(*) from public.parceiros
union all select 'midias', count(*) from public.midias
union all select 'noticias', count(*) from public.noticias;
