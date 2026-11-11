import type { NextConfig } from "next";

/**
 * Libera o domínio do Supabase para o next/image.
 *
 * O endereço vem da variável de ambiente, então trocar de projeto Supabase não
 * exige mexer neste arquivo. Sem variável definida, nenhuma origem externa é
 * liberada — o que é o certo: só o site público roda, sem painel.
 */
function origensDeImagem(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return [];

  try {
    const { hostname } = new URL(url);
    return [{ protocol: "https" as const, hostname, pathname: "/storage/v1/object/public/**" }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: origensDeImagem(),
  },

  /**
   * Endereços do site antigo (Canva Sites) que precisam continuar funcionando.
   *
   * Link compartilhado no WhatsApp há dois anos não deixa de existir quando o
   * site muda. Sem estes redirects, quem clicar cai num 404 — e o Google demora
   * meses para reaprender os endereços novos.
   *
   * O slug de "Quem Somos" no site atual ainda não foi confirmado: /quem-somos
   * dá 404 lá, então o endereço real é outro. Falta capturá-lo clicando o menu
   * ao vivo, antes da virada.
   */
  async redirects() {
    return [
      { source: "/momentos", destination: "/noticias", permanent: true },
      { source: "/colabore", destination: "/apoie", permanent: true },
      // Variações comuns que as pessoas digitam ou que aparecem em links antigos.
      { source: "/doe", destination: "/apoie", permanent: true },
      { source: "/doacao", destination: "/apoie", permanent: true },
      { source: "/apadrinhe", destination: "/apadrinhamento", permanent: true },
    ];
  },
};

export default nextConfig;
