# Planejamento — o que falta

Situação em 11/11/2026.

A construção do portal terminou. O que falta não é mais código: é **material do Instituto** e
**três decisões de conta**. Este documento separa as duas coisas, porque elas andam em ritmos
diferentes e por pessoas diferentes.

---

## Construído e verificado

| | |
|---|---|
| **Análise** | Site atual inventariado (Canva Sites, 4 rotas), apadrinhamento 2018–2025 mapeado, divergências registradas |
| **Site público** | 17 rotas, as 9 áreas do menu, versão mobile |
| **Identidade** | Logo oficial aplicada, cores extraídas do arquivo por amostragem de pixel, ícone do navegador |
| **Painel** | 22 telas, login, 4 perfis, registro de alterações. Projetos, notícias, fotos, história, indicadores, parceiros, transparência, apadrinhamento e usuários |
| **Banco** | 12 tabelas, segurança por linha, 10 migrações versionadas, 3 travas de proteção |
| **Apadrinhamento** | Lista, reserva com trava contra duplicidade, expiração automática, acervo por ano, painel completo |
| **Captação** | PIX gerado no site (BR Code), registro de contribuição e de filiação, tela financeira |
| **Transparência** | Envio de documentos, filtros, gráfico de receitas e despesas |
| **Acessibilidade** | axe-core em 15 páginas, 0 violações |
| **Código** | Público em [github.com/pedrinhopontes/portal-iead](https://github.com/pedrinhopontes/portal-iead) |

### Como cada teste foi feito

Nenhum destes é "deve funcionar": todos foram exercitados.

| Teste | Método | Resultado |
|---|---|---|
| Reserva duplicada | 8 requisições simultâneas no mesmo participante | 1 aceita, 7 recusadas |
| Expiração da reserva | Relógio adiantado + `expirar_reservas()` | Participante voltou para a lista |
| Dados sensíveis | Leitura anônima de 7 tabelas, nomeando as colunas | 0 registros |
| Coluna de autorização | 5 caminhos de leitura como anônimo, incluindo filtrar e ordenar por ela | Recusados nos 5 |
| PIX | `crc16("123456789")` contra o padrão EMV | `29B1`, confere |
| Acessibilidade | axe-core, 15 páginas | 0 violações |

---

## O próximo passo: publicar na Vercel

É o único item que **não depende do Instituto** e que ainda não foi feito. O repositório já está
no GitHub, que era o pré-requisito.

O resultado é um endereço provisório (`algo.vercel.app`) com o portal inteiro funcionando, ligado
ao banco de verdade. O domínio oficial **não** é tocado: `iearaujodutra.com.br` continua mostrando
o site do Canva.

**Por que isso importa mais do que parece:** nesse endereço provisório o **painel já entra em uso
real**. A equipe cria as contas, sobe as fotos, escreve as notícias, cadastra a campanha de 2026 e
preenche a transparência — tudo gravando no banco definitivo. O portal público só aparece quando
já tiver conteúdo.

Ou seja: o painel vai ao ar antes do site. É isso que destrava o resto da lista abaixo, porque a
partir daí o Instituto preenche sozinho, sem depender de programação.

Procedimento em [publicacao.md](publicacao.md).

---

## O que espera material do Instituto

A estrutura de cada item existe e está vazia **de propósito**. Nenhum número, valor ou texto foi
inventado para preencher tela.

| O que falta | O que destrava |
|---|---|
| Lista de participantes e datas de 2026 | Publicar o apadrinhamento — **é o único item com prazo** |
| Termo de autorização das fotos | As nove fotos retidas voltam ao site |
| Chave PIX oficial | Receber doações pelo site |
| Estatuto, balanços e relatórios | Transparência sair do estado vazio |
| Números de impacto verificados | Indicadores da home deixarem de mostrar travessão |
| História de 2020 a 2025 | Seis anos da linha do tempo saírem de "aguardando registros" |
| Missão, visão e valores aprovados | Quem Somos deixar de marcar "em revisão" |
| Equipe, diretoria e conselhos | Governança sair de "aguardando lista autorizada" |
| Encarregado de dados (DPO) | Publicar a política de privacidade |

A lista completa, com as oito decisões que só o Instituto pode tomar (razão social, qualificação
jurídica, faixas etárias, valor da contribuição), está em
[pendencias-do-instituto.md](pendencias-do-instituto.md).

> **Sobre o prazo:** em 2025 a campanha de apadrinhamento encerrou em 15/12. É o único item do
> projeto com data marcada. O sistema está pronto e testado; falta a lista.

---

## Três decisões de conta

Nenhuma é técnica. Todas precisam ser tomadas antes da virada do domínio.

1. **Transferir o projeto do Supabase para uma conta do IEAD.** O banco está hoje numa organização
   pessoal, criada para destravar o desenvolvimento. Dados do Instituto, inclusive de crianças, não
   deveriam depender de uma conta pessoal. O Supabase permite transferir entre organizações.

2. **Avaliar o plano pago do Supabase.** No gratuito, projeto sem uso hiberna e o site sai do ar até
   alguém acordar o banco. Para o domínio oficial, o Pro (≈ US$ 25/mês) remove a pausa e traz backup
   diário.

3. **Descobrir onde o domínio está registrado** (registro.br ou via Canva) e garantir que o IEAD
   tem o acesso.

> O código ficou no GitHub pessoal do desenvolvedor, como portfólio — isso é combinado e não tem
> problema. O que não pode ficar em conta pessoal é o **banco**, que guarda os dados.

---

## Revisão jurídica

Separada porque não é código nem material, e porque trava a publicação sozinha:

- Política de privacidade, que precisa do nome do encarregado de dados
- Razão social correta e qualificação jurídica (OSC / OSCIP / CEBAS)
- Termo de autorização de imagem, se o Instituto ainda não tiver um modelo
