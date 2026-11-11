import { Cabecalho } from "@/components/layout/Cabecalho";
import { Rodape } from "@/components/layout/Rodape";

/** Layout das páginas públicas do portal. O painel administrativo tem o seu. */
export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-bordo focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Rodape />
    </div>
  );
}
