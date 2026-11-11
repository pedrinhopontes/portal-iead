import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { TituloSecao } from "@/components/ui/TituloSecao";

export function CapaPagina({
  sobretitulo,
  titulo,
  texto,
  children,
}: {
  sobretitulo?: string;
  titulo: ReactNode;
  texto?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-linha bg-creme">
      <Container className="py-14 sm:py-20">
        <TituloSecao nivel={1} sobretitulo={sobretitulo} titulo={titulo} texto={texto} className="max-w-3xl" />
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
