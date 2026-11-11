"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Marca } from "@/components/layout/Marca";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { instituto } from "@/lib/instituto";
import type { ItemDeMenu } from "@/lib/navegacao";

/**
 * O menu chega pronto, de quem renderiza: o cabeçalho é componente de
 * cliente e não consulta o banco. Quais áreas aparecem é decisão do
 * Instituto, guardada em site_settings e resolvida no servidor.
 */
export function Cabecalho({ itens }: { itens: ItemDeMenu[] }) {
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  useEffect(() => {
    setAberto(false);
  }, [caminho]);

  const estaAtivo = (href: string) => (href === "/" ? caminho === "/" : caminho.startsWith(href));

  return (
    // Fundo sólido, sem backdrop-blur: num cabeçalho fixo, o blur faz o Chrome
    // deixar um rastro da pintura anterior ao rolar para cima.
    <header className="sticky top-0 z-50 border-b border-linha bg-areia">
      {/* Faixa de contato */}
      <div className="hidden bg-verde-escuro text-white lg:block">
        <Container className="flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Icone nome="local" className="h-3.5 w-3.5" />
              {instituto.endereco.completo}
            </span>
            <a href={instituto.contato.telefoneLink} className="flex items-center gap-1.5 hover:underline">
              <Icone nome="telefone" className="h-3.5 w-3.5" />
              {instituto.contato.telefone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href={instituto.redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram do IEAD">
              <Icone nome="instagram" className="h-4 w-4" />
            </a>
            <a href={instituto.redes.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook do IEAD">
              <Icone nome="facebook" className="h-4 w-4" />
            </a>
            <a href={instituto.contato.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp do IEAD">
              <Icone nome="whatsapp" className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </div>

      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="IEAD — página inicial">
          <Marca tamanho={42} />
          <span className="leading-tight">
            <span className="block font-serif text-2xl font-semibold leading-none text-bordo">IEAD</span>
            <span className="mt-1 hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.06em] text-verde-escuro sm:block">
              Instituto Educacional Araujo Dutra
            </span>
          </span>
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 xl:flex">
          {itens.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={estaAtivo(item.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold transition-colors ${
                estaAtivo(item.href) ? "bg-creme text-bordo" : "text-tinta hover:bg-creme hover:text-bordo"
              }`}
            >
              {item.rotuloCurto}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/apoie"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-bordo px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-bordo-escuro sm:px-5 sm:py-3"
          >
            <Icone nome="coracao" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            <span className="sm:hidden">Apoie</span>
            <span className="hidden sm:inline">Apoie o IEAD</span>
          </Link>

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-linha px-3 py-2.5 text-sm font-semibold sm:px-4 xl:hidden"
          >
            <Icone nome={aberto ? "fechar" : "menu"} className="h-5 w-5" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </Container>

      {aberto && (
        <div id="menu-mobile" className="border-t border-linha bg-white xl:hidden">
          <Container className="py-4">
            <nav aria-label="Menu principal (celular)" className="flex flex-col">
              {itens.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={estaAtivo(item.href) ? "page" : undefined}
                  className={`border-b border-linha/70 py-3 text-base font-semibold ${
                    estaAtivo(item.href) ? "text-bordo" : "text-tinta"
                  }`}
                >
                  {item.rotulo}
                </Link>
              ))}
            </nav>
            <Link
              href="/apoie"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-bordo px-5 py-3 text-base font-bold text-white"
            >
              <Icone nome="coracao" className="h-5 w-5" />
              Apoie o IEAD
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
