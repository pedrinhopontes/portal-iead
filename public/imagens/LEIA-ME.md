# Fotografias do portal

## Onde colocar cada arquivo

| Pasta | O que vai aqui |
|---|---|
| `acervo/` | Fotos datadas do Instituto, usadas no carrossel da home **e** na linha do tempo |
| `marca/` | Logo oficial |
| `projetos/` | Fotos de cada projeto (Sementes I e II, Oficina 5.5, Renascer, Libertas, Inglês Social) |
| `historia/` | Fotos de um ano específico que não entram no carrossel |
| `apadrinhamento/` | Campanhas de Natal, por ano |
| `galeria/` | Fotos avulsas da rotina do Instituto |
| `equipe/` | Equipe, diretoria e conselhos |
| `parceiros/` | Logomarcas dos parceiros |
| `noticias/` | Imagens de capa das notícias |

## Nome dos arquivos

Tudo em minúsculas, sem acento e sem espaço, separado por hífen, com o ano quando fizer sentido:

```
projetos/sementes-2-roda-de-leitura-2026.jpg
historia/2017-curso-cuidador-de-idosos.jpg
apadrinhamento/2025-entrega-dos-presentes.jpg
```

## Formato

- **JPG** para fotografias, **PNG** apenas para logomarcas com fundo transparente.
- Lado maior de **1600 a 2400 pixels**. Maior que isso é desperdício: o site redimensiona sozinho.
- Fotos horizontais funcionam melhor em banner e galeria; verticais, em retratos.
- Mande o arquivo original da câmera ou do celular sempre que possível, não o print nem a imagem
  baixada do WhatsApp (o WhatsApp degrada muito a qualidade).

## Como entram no site

Depois que o arquivo estiver na pasta, a foto é registrada em `src/content/fotos.ts`, na chave
do lugar onde ela deve aparecer. Enquanto não houver registro, a página mostra o espaço reservado.

## Autorização de imagem

Fotografias em que apareçam crianças ou adolescentes **só podem ser publicadas com o termo de
autorização de imagem assinado pelo responsável**. Ao enviar a foto, informe qual termo a cobre —
o registro fica guardado junto com a imagem no arquivo `fotos.ts`.

Na dúvida sobre uma foto, ela não entra.

### Como a regra é aplicada

Não depende de ninguém lembrar. São três travas, em lugares diferentes:

| Onde | O que faz |
|---|---|
| `src/content/fotos.ts` | Foto marcada `autorizacao: "PENDENTE"` não é devolvida ao site. A página mostra o espaço reservado |
| Banco de dados | A restrição `midia_menor_exige_autorizacao` recusa o cadastro de foto com menor sem termo |
| `.gitignore` | As fotos pendentes não entram no repositório |

A terceira existe por um motivo diferente das outras duas: **commit não se apaga**. Um repositório
público publica o histórico, não só o estado atual — se a foto entrar uma vez, tirá-la depois não
resolve, porque ela permanece no histórico e nos clones de quem já baixou.

### Quando o termo chegar

Para liberar uma foto, três passos:

1. Em `src/content/fotos.ts`, troque `"PENDENTE"` pela referência do termo
   (por exemplo `"Termo coletivo Sementes II, 2026"`).
2. Apague a linha correspondente no fim do `.gitignore`.
3. Suba a foto pelo painel, em **Fotos**, informando o mesmo termo.

Hoje há **nove fotos retidas** por falta de termo: percussão, 2019, 2020, 2021, 2022, 2023, 2024,
2025 e bastidores de Natal.
