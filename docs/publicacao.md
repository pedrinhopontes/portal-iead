# Publicação

Procedimento para colocar o portal no domínio oficial. Nada aqui deve ser feito
sem a aprovação do Instituto — o site do Canva continua no ar até o último passo.

---

## 1. O que já está verificado

| Verificação | Como foi feita | Resultado |
|---|---|---|
| Acessibilidade | axe-core 4.10 em 15 páginas | 0 violações |
| Contraste das cores | validador de paleta + axe | aprovado, inclusive o gráfico |
| Reserva duplicada | 8 reservas simultâneas no mesmo participante | 1 aceita, 7 recusadas |
| Dados de crianças | leitura anônima de cada tabela sensível | 0 registros devolvidos |
| Dados de doadores | leitura anônima após criar uma doação | 0 registros devolvidos |
| Escrita indevida | tentativa anônima de gravar balanço e documento | 401 nos dois casos |
| Expiração da reserva | relógio adiantado + `expirar_reservas()` | participante voltou para a lista |
| Build de produção | `npm run build` | 40 rotas compiladas |

A auditoria de acessibilidade pegou dois defeitos que ninguém tinha visto: o
título da página dos 10 anos saía escuro sobre o bordô, praticamente ilegível, e
a lista de datas do apadrinhamento tinha estrutura inválida para leitor de tela.

A varredura de vazamento pegou um terceiro: a tabela de fotos entregava a
referência do termo de autorização para qualquer visitante. Se alguém escrevesse
"Termo da família Silva" naquele campo, um sobrenome ligado a uma criança virava
público.

A primeira tentativa de correção (migration `0009`) **não funcionou**, e só foi
descoberto porque o próprio arquivo terminava com uma consulta de conferência:
ela mostrou a coluna ainda legível pelo público. Privilégio de tabela e
privilégio de coluna são separados no Postgres, e o Supabase concede `select` na
tabela inteira ao papel anônimo — tirar uma coluna de quem tem a tabela toda não
tira nada. A correção que funciona está na migration `0010`: revoga o privilégio
da tabela e devolve coluna por coluna, menos `autorizacao`.

Fica a lição para as próximas migrations de permissão: **toda alteração de
privilégio termina com a consulta que prova o efeito.** Sem ela, esta teria
passado por resolvida.

---

## 2. Pendências que bloqueiam a publicação

Nenhuma delas impede continuar construindo. Todas impedem ir ao ar.

| # | Pendência | Por quê bloqueia |
|---|---|---|
| 1 | **Encarregado de dados (DPO)** | A política de privacidade não pode ser publicada sem o responsável indicado |
| 2 | **Termos de autorização das fotos** | 9 das 12 fotos do acervo mostram crianças identificáveis |
| ~~3~~ | ~~**Chave PIX oficial**~~ — resolvida | Configurada e o código validado campo a campo, CRC conferido contra o padrão |
| 4 | **Transferir o Supabase para conta do IEAD** | Os dados do Instituto não devem depender de conta pessoal |
| 5 | **Plano pago do Supabase** | No gratuito o banco hiberna e o site sai do ar |
| 6 | **Slug real de "Quem Somos" no site atual** | Sem ele, esse endereço antigo vira 404 depois da virada |
| 7 | **Revisão jurídica** | Razão social, qualificação (OSC/OSCIP) e política de privacidade |

---

## 3. Publicar na Vercel

1. Suba o projeto para um repositório no GitHub, na conta do Instituto.
2. Em <https://vercel.com>, importe o repositório. A Vercel reconhece o Next.js
   sozinho — não mexa nas configurações de build.
3. Em **Settings → Environment Variables**, cadastre para *Production*:

   | Variável | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | a mesma do `.env.local` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave publishable |

4. Faça o primeiro deploy e **teste tudo na URL provisória** da Vercel
   (`algo.vercel.app`), antes de tocar no domínio. Confira: login no painel,
   publicação de uma notícia, geração de um PIX, reserva de apadrinhamento.

---

## 4. Virar o domínio

Esta é a única etapa sem volta fácil. Faça num dia útil, de manhã.

1. **Antes**: capture o endereço real da página "Quem Somos" no site do Canva
   (clicando o menu ao vivo) e acrescente o redirect em `next.config.ts`.
2. Descubra onde o domínio está registrado — registro.br ou via Canva — e
   garanta que o IEAD tem o acesso.
3. Na Vercel, em **Settings → Domains**, adicione `iearaujodutra.com.br` e
   `www.iearaujodutra.com.br`.
4. Aponte o DNS conforme a Vercel instruir. A propagação leva de minutos a horas.
5. **Não apague o site do Canva.** Ele é o retorno imediato se algo der errado:
   basta desfazer o apontamento de DNS.

---

## 5. Depois da virada

- Cadastre o site no **Google Search Console** e envie
  `https://iearaujodutra.com.br/sitemap.xml`.
- Acompanhe os erros 404 na primeira semana e acrescente os redirects que
  faltarem. Links antigos compartilhados em conversas não deixam de existir.
- Atualize o Linktree e as redes sociais para apontarem para o portal.
- Avalie cache nas páginas públicas: hoje todas consultam o banco a cada acesso,
  o que é correto mas não é o mais rápido. Alguns minutos de cache deixam o site
  mais leve e o banco mais folgado.

---

## 6. Recuperar o que der errado

| Problema | O que fazer |
|---|---|
| Site fora do ar depois da virada | Desfaça o apontamento de DNS: o Canva volta |
| Deploy quebrado na Vercel | **Instant Rollback** no painel da Vercel |
| Dado apagado por engano no painel | `log_auditoria` guarda o conteúdo anterior de cada alteração |
| Banco corrompido | Backups do Supabase: 7 dias no gratuito, diário no plano pago |
