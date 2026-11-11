# Conectar o banco de dados

O painel administrativo precisa de um projeto no Supabase. São uns 15 minutos, uma vez só.
O plano gratuito atende o Instituto com folga no começo.

Enquanto isso não for feito, **o site público continua funcionando normalmente** e o painel
mostra uma tela explicando o que falta.

## 1. Criar o projeto

1. Entre em <https://supabase.com> e crie a conta **com um e-mail institucional do IEAD**, não
   com e-mail pessoal de alguém. Quem controla essa conta controla o banco inteiro.
2. Crie um projeto: nome `iead-portal`, região **South America (São Paulo)** — mais perto, mais rápido.
3. Guarde a senha do banco num gerenciador de senhas. Ela não dá para recuperar depois.

## 2. Criar as tabelas

No painel do Supabase, abra **SQL Editor** e rode os arquivos da pasta `supabase/migrations/`
**na ordem**, um de cada vez:

1. `0001_fundacao.sql` — perfis de acesso, auditoria e funções de segurança
2. `0002_conteudo.sql` — mídias, projetos, notícias, linha do tempo, indicadores, parceiros
3. `0003_storage.sql` — os dois baldes de arquivos (públicos e restritos)

Cada um deve terminar com "Success. No rows returned".

## 3. Pegar as credenciais

Em **Project Settings → API**, copie:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Crie o arquivo `.env.local` na raiz do projeto (copie de `.env.example`) e cole os dois valores.

> A chave **service_role** aparece na mesma tela. Ela ignora todas as regras de segurança do
> banco. Não coloque em `.env.local`, não mande por WhatsApp, não cole em nenhum lugar.

## 4. Criar o primeiro usuário

1. Em **Authentication → Users → Add user**, crie o usuário com e-mail e senha, marcando
   *Auto Confirm User*.
2. Copie o **UID** que aparece na lista.
3. Em **SQL Editor**, rode (trocando os valores):

```sql
insert into public.usuarios_admin (id, nome, email, perfil)
values ('COLE-O-UID-AQUI', 'Nome da Pessoa', 'email@dominio.com', 'admin');
```

Perfis possíveis: `admin`, `comunicacao`, `financeiro`, `coordenador`.

Só o primeiro usuário precisa ser criado assim. Os demais serão cadastrados pelo painel.

## 5. Entrar

Rode `npm run dev` e abra <http://localhost:3000/entrar>.

## Como a segurança funciona aqui

A permissão **não** está só em esconder botões na tela. Cada tabela tem políticas no próprio
Postgres que dizem quem pode ler e escrever o quê. Três consequências práticas:

- Quem não está autenticado só enxerga o que está marcado como publicado.
- Um usuário do perfil "comunicação" não lê dados restritos de crianças nem que chame a API
  diretamente — o banco recusa.
- Toda alteração fica registrada em `log_auditoria`: quem, o quê, quando, antes e depois.

Há também travas que não dependem de ninguém lembrar:

- Foto marcada como contendo menores **não entra no banco** sem a referência do termo de autorização.
- Depoimento **não pode ser publicado** sem autorização registrada.
- Indicador **não pode ser marcado como verificado** sem valor e fonte.

## Backup

No plano gratuito o Supabase mantém backup de 7 dias. Antes de qualquer operação grande,
faça um backup manual em **Database → Backups**. Quando o acervo crescer, o plano pago
(≈ US$ 25/mês) traz backup diário automático.
