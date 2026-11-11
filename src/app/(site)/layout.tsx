import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";
import { menuVisivel } from "@/lib/dados/areas";

/**
 * Nenhuma página do site é gerada estaticamente.
 *
 * O cabeçalho e o rodapé leem do banco quais áreas o Instituto escolheu
 * mostrar. Quando a mudança vem pelo painel, a ação chama `revalidatePath` e
 * até as páginas estáticas (/contato, /privacidade) são refeitas.
 *
 * O problema é a mudança que NÃO vem pelo painel: um `update` em
 * `site_settings` rodado direto no SQL Editor — como são rodados todos os
 * arquivos de `supabase/` deste projeto. Aí nenhum `revalidatePath` dispara, e
 * aquelas duas páginas ficariam com o menu antigo até o próximo deploy, sem
 * ninguém entender por quê.
 *
 * Renderizar sob demanda custa pouco aqui: o resto do site já é dinâmico,
 * porque todas as páginas consultam o banco a cada acesso.
 */
export const dynamic = "force-dynamic";

/** Layout das páginas públicas do portal. O painel administrativo tem o seu. */
export default async function LayoutSite({ children }: { children: React.ReactNode }) {
  // O menu é resolvido aqui, no servidor: o cabeçalho é componente de cliente
  // e recebe a lista pronta, já sem as áreas que o Instituto escolheu ocultar.
  const itens = await menuVisivel();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-bordo focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho itens={itens} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Rodape />
    </div>
  );
}
