import type { MetadataRoute } from "next";
import { campanhasAnteriores, campanhaVigente } from "@/lib/dados/apadrinhamento";
import { areasOcultas } from "@/lib/dados/areas";
import { listarNoticias, listarProjetos } from "@/lib/dados/conteudo";

const SITE = "https://iearaujodutra.com.br";

/**
 * Mapa do site para os buscadores.
 *
 * O site atual não tem sitemap nenhum — o Google descobre as páginas tropeçando
 * nelas. Aqui ele recebe a lista pronta, incluindo cada projeto, cada notícia e
 * cada campanha de apadrinhamento.
 *
 * Fica de fora o que não deve ser indexado: painel, login, lista de
 * participantes e o formulário de apadrinhamento.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projetos, noticias, vigente, anteriores, ocultas] = await Promise.all([
    listarProjetos(),
    listarNoticias(),
    campanhaVigente(),
    campanhasAnteriores(),
    areasOcultas(),
  ]);

  const fixas: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/quem-somos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/projetos`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/nossa-historia`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/nossa-historia/10-anos`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/apadrinhamento`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/transparencia`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/seja-filiado`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/apoie`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/noticias`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/contato`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const deProjetos: MetadataRoute.Sitemap = projetos.map((projeto) => ({
    url: `${SITE}/projetos/${projeto.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const deNoticias: MetadataRoute.Sitemap = noticias.map((noticia) => ({
    url: `${SITE}/noticias/${noticia.slug}`,
    lastModified: noticia.data ? new Date(noticia.data) : undefined,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const campanhas = [...(vigente ? [vigente] : []), ...anteriores];
  const deCampanhas: MetadataRoute.Sitemap = campanhas.map((campanha) => ({
    url: `${SITE}/apadrinhamento/${campanha.ano}`,
    changeFrequency: campanha.status === "aberta" ? "weekly" : "yearly",
    priority: campanha.status === "aberta" ? 0.8 : 0.4,
  }));

  // Área oculta sai do mapa junto com o que vive dentro dela. Entregar ao
  // Google uma página que o Instituto decidiu não anunciar seria contraditório:
  // ela sumiria do menu e apareceria na busca.
  const escondida = (url: string) => {
    const caminho = url.slice(SITE.length);
    return ocultas.some((area) => caminho === area || caminho.startsWith(area + "/"));
  };

  return [...fixas, ...deProjetos, ...deNoticias, ...deCampanhas].filter(
    (entrada) => !escondida(entrada.url),
  );
}
