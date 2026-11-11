# Planejamento — o que falta

Situação em 10/11/2026.

Cada etapa lista o que será construído, o tamanho relativo do trabalho e **o que depende do
Instituto**. Uma etapa pode começar sem o material; o que não pode é ir ao ar sem ele.

---

## Já está pronto

| | |
|---|---|
| **Análise** | Site atual inventariado (Canva Sites, 4 rotas), apadrinhamento 2018–2025 mapeado, divergências registradas |
| **Protótipo** | 17 rotas, as 9 áreas do menu, versão mobile, acessibilidade de base |
| **Identidade** | Logo oficial aplicada, cores extraídas do arquivo, ícone do navegador, contraste verificado |
| **Fotos** | 12 fotos do acervo otimizadas (37 MB → 4 MB), no carrossel e na linha do tempo |
| **Banco** | 12 tabelas, segurança por linha, registro de alterações, 3 travas de proteção |
| **Painel** | Login, 4 perfis de acesso, área de notícias completa |
| **Conteúdo** | Projetos, linha do tempo, indicadores e parceiros já no banco |

---

## Etapa 5 — Apadrinhamento 2026 · **tem prazo**

Em 2025 a campanha encerrou em 15/12. É o único item do projeto com data marcada.

**Construir:**

- Tabelas de campanha, participantes, dados restritos e apadrinhamentos
- Reserva com trava contra duplicidade — duas pessoas no mesmo segundo, só uma vence
- Expiração automática da reserva (sugestão: 48 h) e devolução à vitrine
- Vitrine pública ligada ao banco, com os cinco estados
- Formulário de apadrinhamento, confirmação e orientações de entrega
- Painel: cadastrar campanha e participantes, confirmar reservas, registrar presente recebido
- Acervo permanente por ano, de 2018 a 2026

**Tamanho:** grande. É a parte mais complexa do portal.

**Depende do Instituto:** lista de participantes (por canal privado), prazo de entrega, data e
local do evento, valor da contribuição em 2026, banner da campanha.

> O sistema pode ser construído inteiro antes de o material chegar, usando a lista de
> demonstração. O que não pode é ir ao ar com dados inventados.

---

## Etapa 6 — Painel completo e site lendo do banco

Hoje o site público lê dos arquivos de código. O painel edita o banco. Enquanto os dois não forem
a mesma coisa, editar no painel não muda o site.

**Construir:**

- **Tela de fotos**: enviar imagem, escrever descrição, informar autorização, escolher onde entra.
  É o que tira a dependência de um programador para trocar uma foto.
- Telas de projetos, linha do tempo, parceiros, depoimentos e indicadores
- Tela de usuários (cadastrar a equipe, definir perfis) e de registro de alterações
- Páginas públicas passando a ler do banco, área por área

**Tamanho:** grande, mas repetitivo — a tela de notícias já definiu o padrão.

**Depende do Instituto:** fotos restantes, textos de missão e visão, história de 2020 a 2025,
números de impacto verificados, equipe e diretoria autorizadas a publicar, e a referência do
termo de autorização das fotos com crianças.

---

## Etapa 7 — Captação de recursos

**Construir:**

- Cadastro de apoiador, escolha de valor, mensal ou pontual
- PIX fase 1: QR Code gerado no site, sem taxa, com conferência no painel
- Histórico de contribuições, comprovantes, cancelamento de recorrência
- Fluxo de filiação associativa, separado do apoio financeiro
- Tela financeira no painel

**Tamanho:** médio.

**Depende do Instituto:** chave PIX oficial e titularidade, decisão sobre recorrência automática
(exige API bancária ou provedor), regras estatutárias da filiação.

---

## Etapa 8 — Portal da Transparência

**Construir:**

- Envio de documentos por categoria e ano, com data de publicação
- Filtros funcionando
- Gráficos de receitas e despesas alimentados por dados reais
- Relatórios de impacto

**Tamanho:** médio.

**Depende do Instituto:** estatuto, atas, documentos de regularidade, balanços, demonstrações
contábeis, relatórios anuais e os valores conferidos pela contabilidade.

> Esta é a etapa mais dependente de material externo. A estrutura já existe e está vazia de
> propósito: nenhum valor financeiro foi inventado.

---

## Etapa 9 — Testes, segurança e publicação · **em andamento**

**Já feito e verificado:**

- ~~Auditoria de acessibilidade~~ — axe-core em 15 páginas, 0 violações
- ~~Teste de concorrência da reserva~~ — 8 simultâneas, 1 aceita
- ~~Varredura de vazamento nas APIs públicas~~ — 7 tabelas sensíveis, 0 registros
- ~~Teste de expiração da reserva~~ — participante voltou para a vitrine
- ~~Redirects das URLs antigas, sitemap, robots e imagem de compartilhamento~~

**Falta:**

- Política de privacidade revisada juridicamente
- Publicação na Vercel e virada do domínio — ver [publicacao.md](publicacao.md)

**Tamanho:** médio.

**Depende do Instituto:** encarregado de dados (DPO), acesso ao registro do domínio, decisão
sobre o plano pago do Supabase, e a aprovação final para virar o domínio.

---

## O que trava o quê

| Pendência | Trava |
|---|---|
| Lista de participantes e datas de 2026 | Publicar o apadrinhamento |
| Termo de autorização das fotos | Mover 9 das 12 fotos para o banco |
| Chave PIX oficial | Receber doações pelo site |
| Estatuto, balanços e relatórios | Portal da Transparência sair do estado vazio |
| Números de impacto verificados | Indicadores da home deixarem de mostrar travessão |
| História de 2020 a 2025 | Seis anos da linha do tempo saírem de "texto a escrever" |
| Encarregado de dados (DPO) | Publicar a política de privacidade |
| Acesso ao domínio | Virada final |

A lista completa, com as oito decisões que só o Instituto pode tomar, está em
[pendencias-do-instituto.md](pendencias-do-instituto.md).

---

## Duas decisões para antes da publicação

1. **Transferir o projeto do Supabase para uma conta do IEAD.** O banco está hoje numa organização
   pessoal. Dados do Instituto, inclusive de crianças, não deveriam depender de uma conta pessoal.
   O Supabase permite transferir entre organizações.

2. **Avaliar o plano pago do Supabase.** No gratuito, projeto sem uso hiberna e o site sai do ar
   até alguém acordar o banco. Para o domínio oficial, o Pro (≈ US$ 25/mês) remove a pausa e traz
   backup diário.
