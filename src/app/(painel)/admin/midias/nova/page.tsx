import type { Metadata } from "next";
import Link from "next/link";
import { FormularioMidia } from "../FormularioMidia";
import { Icone } from "@/components/ui/Icone";
import { catalogoDeSlots } from "@/lib/dados/slots";

export const metadata: Metadata = { title: "Enviar foto" };
export const dynamic = "force-dynamic";

export default async function NovaMidia() {
  const grupos = await catalogoDeSlots();

  return (
    <div>
      <Link
        href="/admin/midias"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todas as fotos
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">Enviar foto</h1>
      <p className="mt-2 max-w-2xl text-sm text-tinta-suave">
        Escolha o arquivo, descreva o que aparece nele e marque onde ele deve entrar no site.
      </p>

      <div className="mt-8">
        <FormularioMidia midia={null} grupos={grupos} />
      </div>
    </div>
  );
}
