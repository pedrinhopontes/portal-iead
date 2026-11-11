import type { MetadataRoute } from "next";

/**
 * Regras para os buscadores.
 *
 * O painel e o login ficam de fora do índice. A vitrine de participantes e o
 * formulário de apadrinhamento também: mesmo sem nome nenhum publicado, não há
 * motivo para uma lista de crianças aparecer em busca na internet.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/entrar",
        "/apadrinhamento/participantes",
        "/apadrinhamento/apadrinhar",
      ],
    },
    sitemap: "https://iearaujodutra.com.br/sitemap.xml",
  };
}
