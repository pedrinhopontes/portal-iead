"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ItemPainel } from "@/lib/painel";

export function MenuLateral({ itens }: { itens: ItemPainel[] }) {
  const caminho = usePathname();

  const estaAtivo = (href: string) =>
    href === "/admin" ? caminho === "/admin" : caminho.startsWith(href);

  return (
    <nav aria-label="Áreas do painel" className="p-4">
      <ul className="space-y-1">
        {itens.map((item) => {
          if (item.emBreve) {
            return (
              <li key={item.href}>
                <span
                  className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-tinta-suave"
                  title="Área prevista no projeto, ainda não implementada"
                >
                  {item.rotulo}
                  <span className="rounded-full bg-creme px-2 py-0.5 text-[10px] font-bold uppercase text-tinta-suave">
                    em breve
                  </span>
                </span>
              </li>
            );
          }

          const ativo = estaAtivo(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  ativo ? "bg-bordo-suave text-bordo" : "text-tinta hover:bg-creme hover:text-bordo"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-4 w-1 rounded-full ${ativo ? "bg-bordo" : "bg-transparent"}`}
                />
                {item.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
