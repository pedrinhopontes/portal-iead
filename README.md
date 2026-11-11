# Portal Institucional do IEAD

Novo portal do **Instituto Educacional Araujo Dutra** (Guadalupe, Rio de Janeiro) — o site
institucional, o sistema de apadrinhamento de Natal, a filiação de apoiadores e o Portal da
Transparência, em uma base única e administrável.

Estado atual: **protótipo navegável (Etapa 3)**. As páginas públicas existem e funcionam; banco de
dados, painel administrativo e pagamentos ainda não.

## Como rodar

```bash
npm install
npm run dev
```

O site sobe em <http://localhost:3000>.

Outros comandos: `npm run build` (build de produção), `npm run lint`, `npx tsc --noEmit`.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Site | Next.js 15 (App Router) + TypeScript | Páginas públicas renderizadas no servidor: rápidas, indexáveis pelo Google e com endereço próprio para compartilhar |
| Interface | Tailwind CSS v4 + componentes próprios | Design system num arquivo só; sem dependência de biblioteca visual de terceiros |
| Banco, login e arquivos | Supabase (Postgres + Auth + Storage + RLS) — *a implementar* | Permissão por perfil no próprio banco, não só escondendo botões na tela |
| Pagamentos | PIX direto (fase 1), provedor com recorrência (fase 2) — *a implementar* | PIX cai na conta do Instituto sem taxa: a doação chega inteira |

## De onde vem cada informação

Projetos, notícias, linha do tempo, indicadores, parceiros, campanhas de apadrinhamento e fotos
**vêm do banco**, editáveis pelo painel. Não há cópia desses dados no código: fonte única.

O que ainda mora em arquivo:

- **`src/lib/instituto.ts`** — endereço, telefone, CNPJ e registro CMDCA, lidos do site oficial
  em 10/11/2026. Mudam quase nunca. As divergências encontradas estão comentadas no arquivo.
- **`src/content/transparencia.ts`** — a estrutura das categorias. **Conteúdo vazio de propósito**:
  nenhum balanço, valor, certificação ou auditoria foi criado.
- **`src/content/fotos.ts`** — o acervo que já estava no código antes do painel existir. O site
  procura a foto no banco primeiro e só cai aqui quando o lugar ainda não foi preenchido.

Três travas vivem no banco e não dependem de ninguém lembrar: foto com menores exige referência do
termo de autorização, depoimento não é publicado sem autorização registrada, e indicador não é
marcado como verificado sem valor e fonte.

Os espaços de fotografia aparecem marcados na tela (`EspacoFoto`). O site não usa imagem de banco
posando de foto do projeto.

## Mapa do código

```
src/
  app/
    (site)/             páginas públicas, com cabeçalho e rodapé do portal
    (painel)/           /entrar e /admin, com o layout próprio do painel
  components/
    layout/             cabeçalho, rodapé e a marca
    ui/                 design system: Botao, Secao, Etiqueta, Aviso, Foto, Carrossel, Icone…
    site/               blocos de página: cartões, linha do tempo, listas com filtro
  content/              o que ainda não migrou para o banco (transparência e acervo de fotos)
  lib/
    dados/              consultas ao banco, separadas dos tipos puros
    supabase/           clientes de servidor e navegador, e a configuração
    painel.ts           menu do painel e quais perfis veem o quê
  middleware.ts         renova a sessão e barra o acesso ao /admin
supabase/migrations/    o esquema do banco, versionado
public/imagens/         acervo de fotos e a logo oficial
docs/                   análise, arquitetura, migração, pendências e setup do Supabase
```

## Painel administrativo

Fica em `/admin`, com login em `/entrar`. Precisa de um projeto no Supabase —
o passo a passo está em [`docs/supabase.md`](docs/supabase.md). Sem isso, o site
público funciona normalmente e o painel mostra uma tela dizendo o que falta.

Perfis: `admin`, `comunicacao`, `financeiro`, `coordenador`. As permissões vivem nas
políticas do Postgres, não apenas em esconder botões.

## Identidade visual

As cores de marca em `src/app/globals.css` foram **extraídas da logo oficial**, amostrando os pixels
do arquivo — não são aproximações:

| Token | Valor | Origem | Uso |
|---|---|---|---|
| `--color-bordo` | `#8c161a` | braços e tronco superior da logo | Cor de marca, botões principais (8,9:1) |
| `--color-bordo-escuro` | `#7a1119` | tronco inferior da logo | Estado de hover |
| `--color-verde` | `#1c8214` | folhas da logo | Ações e textos de apoio (4,9:1) |
| `--color-verde-escuro` | `#156110` | derivado do verde | Botões secundários e faixas (7,0:1) |
| `--color-creme` / `--color-areia` | `#e8e8da` / `#f7f6f0` | identidade do site atual | Superfícies |
| `--color-ardosia` | `#304254` | identidade do site atual | Rodapé e faixas escuras |

**A logo não é recriada nem redesenhada.** O arquivo original fica em
`public/imagens/marca/logo.png`; o site usa `logo-iead.png`, que é o mesmo arquivo apenas com as
margens transparentes recortadas. O ícone do navegador (`src/app/icon.png`) é gerado a partir dele.

## Próximas etapas

4. ~~Supabase, migrations e painel administrativo com perfis de acesso~~ — base pronta;
   falta criar o projeto no Supabase e as telas de projetos, mídias e linha do tempo
5. Apadrinhamento 2026 com reserva, anti-duplicidade e acervo por ano — **prioridade**
6. Filiação e doações (PIX), Portal da Transparência e acervo histórico
7. Acessibilidade WCAG 2.2 AA, LGPD, testes, redirects e migração do domínio

O que falta de material do Instituto está em [`docs/pendencias-do-instituto.md`](docs/pendencias-do-instituto.md).
