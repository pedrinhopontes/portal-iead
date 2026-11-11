# Arquitetura, custos e decisões

## Por que esta stack

**Next.js 15 + TypeScript.** As páginas públicas são renderizadas no servidor: carregam rápido em
celular com internet ruim, são indexadas pelo Google e cada notícia ou projeto tem endereço próprio
para compartilhar no WhatsApp. O mesmo projeto abriga o site e o painel administrativo, então não há
dois sistemas para manter.

**Tailwind CSS v4 com componentes próprios.** O design system vive em `src/app/globals.css` e em
`src/components/ui/`. Trocar a identidade visual é editar um bloco de variáveis. Não há dependência
de biblioteca visual de terceiros que possa ser abandonada daqui a dois anos.

**Supabase.** Entrega Postgres, autenticação, armazenamento de arquivos e — o ponto decisivo —
**Row Level Security**: a permissão por perfil fica no banco, não apenas escondendo botões na tela.
Um usuário do perfil "comunicação" não consegue ler os dados restritos das crianças nem que tente
pela API. É o que torna defensável guardar dados de menores.

**Vercel.** Deploy automático a cada alteração, URL de preview para aprovação antes de publicar e
rollback imediato se algo quebrar.

### O que foi descartado

- **WordPress**: o apadrinhamento, a transparência e os perfis de acesso virariam plugins de
  terceiros. Mais pontos de falha, atualização constante e risco de segurança num sistema que guarda
  dados de crianças.
- **Payload/Strapi**: painel pronto e maduro, mas exige servidor Node rodando 24 h e banco próprio —
  custo e manutenção maiores — e o apadrinhamento continuaria sendo feito à mão.

## Custos recorrentes estimados

| Item | Plano gratuito | Plano pago | Quando o pago vira necessário |
|---|---|---|---|
| Vercel | Hobby | ≈ US$ 20/mês (Pro) | Uso comercial ou tráfego alto |
| Supabase | Free: 500 MB de banco, 1 GB de arquivos | ≈ US$ 25/mês (Pro) | Acervo de fotos e PDFs crescendo; backup diário |
| Resend (e-mails) | 3.000/mês | a partir de ≈ US$ 20/mês | Muitos padrinhos e apoiadores |
| Domínio | — | ≈ R$ 40/ano (registro.br) | Sempre |
| PIX direto | sem taxa por transação | — | — |
| Gateway com recorrência | — | taxa por transação, a confirmar | Só na fase 2 |

**Início: R$ 0 a R$ 40 por ano.** Os planos pagos entram quando o volume exigir, não antes. Valores
de mercado sujeitos a mudança — confirmar na contratação.

## Pagamentos

Decisão do Instituto: **PIX primeiro, porque não tem taxa e a doação chega inteira.**

**Fase 1 — PIX direto, sem taxa.** O site gera o QR Code (BR Code EMV) a partir da chave do IEAD e
registra a intenção de doação no banco. Como o PIX cai direto na conta, não há intermediário nem
taxa. A contrapartida é que **não existe confirmação automática**: a baixa é feita por uma pessoa no
painel administrativo, conferindo o extrato.

**Fase 2 — confirmação automática e recorrência.** Para a contribuição mensal funcionar sozinha é
preciso webhook de um provedor ou da API PIX do banco. Opções a avaliar com o Instituto:

- **API PIX do próprio banco** (Efí, Sicoob, Banco do Brasil e outros): mantém o custo baixo e dá
  confirmação automática. Exige contrato de API com o banco.
- **PagBank**, já usado hoje pelo Instituto (links `pag.ae` no Linktree): mantém a conta atual e
  resolve cartão de crédito, que o PIX não cobre.
- **Pix Automático** para recorrência mensal sem cartão — verificar disponibilidade e condições com
  o banco do Instituto.

Toda a integração fica isolada em `lib/payments/` atrás de uma interface única, então trocar de
provedor não mexe no resto do site. **Dados completos de cartão nunca são armazenados.**

## Modelo de dados (Etapa 4)

- **Conteúdo**: `site_settings`, `blocos_conteudo`, `midias`, `indicadores`, `depoimentos`, `parceiros`
- **Projetos**: `projetos`, `projeto_midias`, `projeto_relatorios`
- **Notícias**: `noticias` (slug único, categoria, projeto, data, capa, corpo)
- **História**: `timeline_anos`, `timeline_midias`
- **Apadrinhamento**: `campanhas`, `participantes`, `participantes_dados_restritos`, `apadrinhamentos`
- **Apoio financeiro**: `apoiadores`, `contribuicoes`, `filiacoes`
- **Transparência**: `transparencia_documentos`, `financas_anuais`
- **Governança**: `usuarios_admin` (perfil), `log_auditoria`

### Proteção de crianças e adolescentes

1. A vitrine pública expõe apenas código, primeiro nome ou iniciais, idade, tamanhos e sugestão de
   presente.
2. Nome completo, responsável e contato ficam em `participantes_dados_restritos`, tabela separada com
   RLS limitada a `admin` e `coordenador`. As páginas públicas nem consultam essa tabela.
3. Foto só é publicada com `autorizacao_imagem = true` **e** o termo assinado anexado. O padrão é não
   publicar.
4. Consentimento, finalidade e data ficam registrados.

### Anti-duplicidade da reserva

Estados: `disponivel → reserva_pendente → apadrinhado → presente_recebido → concluido`.

A reserva roda numa transação com `SELECT ... FOR UPDATE` no participante, somada a um índice único
parcial que permite no máximo uma reserva ativa por participante. Duas pessoas clicando no mesmo
segundo: só uma vence, a outra recebe aviso de que aquele participante acabou de ser escolhido.
A reserva expira sozinha depois do prazo configurado (sugestão: 48 h) e o participante volta a
`disponivel`. A confirmação definitiva é feita pelo painel.

## Como isso será testado

- **Concorrência da reserva**: script disparando N reservas simultâneas no mesmo participante —
  exatamente uma pode vencer.
- **RLS**: consultar `participantes_dados_restritos` com token anônimo e com cada perfil; só `admin` e
  `coordenador` leem.
- **Vazamento**: verificar que nenhuma resposta de API pública traz campo sensível de participante.
- **Expiração**: rodar o job com relógio adiantado e confirmar o retorno a `disponivel`.
- **Acessibilidade**: axe/Lighthouse nas páginas principais, navegação completa por teclado e
  checagem de contraste após a logo oficial.
