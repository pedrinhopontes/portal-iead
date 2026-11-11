import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioMidia } from "../FormularioMidia";
import { Icone } from "@/components/ui/Icone";
import { midiaPorId } from "@/lib/dados/midias";
import { catalogoDeSlots } from "@/lib/dados/slots";

export const metadata: Metadata = { title: "Editar foto" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarMidia({ params }: Props) {
  const { id } = await params;

  const [midia, grupos] = await Promise.all([midiaPorId(id), catalogoDeSlots()]);
  if (!midia) notFound();

  return (
    <div>
      <Link
        href="/admin/midias"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todas as fotos
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">Editar foto</h1>

      <div className="mt-8">
        <FormularioMidia midia={midia} grupos={grupos} />
      </div>
    </div>
  );
}
