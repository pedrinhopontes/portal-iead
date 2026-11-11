# Inventário do site atual e plano de migração

Levantamento feito em 10/11/2026 a partir de `https://iearaujodutra.com.br/`.

## Plataforma

O site atual é um **Canva Sites** (bundle `_assets/*.runtime.js`, marcadores `canva-a11y-fallback`).
Consequências práticas:

- Não há CMS, blog, repositório de documentos nem área administrativa.
- Não existe `sitemap.xml` nem `robots.txt` (ambos retornam 404).
- O conteúdo é pequeno: a migração editorial é rápida. O trabalho está em construir o que não existe.
- O domínio está apontado para o Canva. **Confirmar onde o registro está (registro.br ou via Canva) e
  quem tem acesso** antes de qualquer mudança de DNS.

## Páginas existentes

| URL atual | Rótulo no menu | Destino no novo portal |
|---|---|---|
| `/` | Pagina Inicial | `/` |
| `/projetos` | Projetos | `/projetos` |
| `/momentos` | Momentos | `/noticias` (galerias) — **redirect 301** |
| `/colabore` | Colabore | `/apoie` — **redirect 301** |
| *(slug não confirmado)* | Quem Somos ? | `/quem-somos` — confirmar o endereço real clicando o menu ao vivo |

Nenhuma outra rota respondeu. `/quem-somos` retorna 404 no site atual, então o slug usado pelo Canva
é outro e precisa ser capturado antes da virada.

## Conteúdo a preservar

**Dados institucionais** (já incorporados em `src/lib/instituto.ts`):
Rua Menezes Brum, 795 — Guadalupe, RJ · iearaujodutra@gmail.com · (21) 2451-4528 ·
CNPJ 27.757.883/0001-35 · Registro CMDCA-Rio 05/2019 · funcionamento 9h30–18h ·
Instagram `@iead.ong`, Facebook, LinkedIn.

**Texto institucional**: preservado com ajuste de redação, marcado como "em revisão" no site.

**Projetos listados hoje**: Sementes, Oficina 5.5, Renascer, Liberta-se, EASIP–Mulheres e Cursos.

**Redes e parcerias**: CMDCA-Rio, FePeti-RJ, Visão Mundial, Plataforma MROSC, Mapa das OSCs.

**Galeria "Nossos Momentos"**: as legendas foram preservadas como referência dos espaços de foto
(aula de pintura do Renascer, Dia das Mães, Oficina 5.5, ballet, Sementes II, percussão). As imagens
precisam ser enviadas em alta resolução com autorização de uso.

## Canais fora do site

| Canal | Conteúdo | Destino |
|---|---|---|
| Página Adobe Express | Campanha de apadrinhamento 2025 | Importada para `/apadrinhamento/2025` |
| Álbuns do Facebook | Campanhas 2018, 2019, 2020 | `/apadrinhamento/<ano>` |
| Vídeos do YouTube | Campanhas 2021 e 2022 | `/apadrinhamento/<ano>` |
| Instagram | Campanhas 2023 e 2024 | `/apadrinhamento/<ano>` — **os dois links apontam para o mesmo post; um está errado** |
| Linktree | Doações R$10 / R$25 (PagBank) / R$50 / valor livre, e formulários do Seminário 10 Anos e do Pré-Vestibular Libertas | Substituído por `/apoie` e `/seja-filiado`; o Linktree pode continuar, apontando para o portal |

## Plano de virada

1. Construir e aprovar o novo portal em ambiente de testes (URL de preview, fora do domínio oficial).
2. Capturar o slug real de "Quem Somos" e conferir a lista final de URLs antigas.
3. Configurar os redirects 301 em `next.config.ts` antes da virada.
4. Publicar `sitemap.xml` e `robots.txt`, que hoje não existem.
5. Só então apontar o DNS do domínio oficial, com o site do Canva ainda disponível como retorno
   imediato caso algo dê errado.
6. Monitorar erros 404 na primeira semana e acrescentar redirects que faltarem.

**O site atual não sai do ar antes da aprovação.**
