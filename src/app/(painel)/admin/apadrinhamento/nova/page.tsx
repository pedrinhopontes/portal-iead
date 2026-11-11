import type { Metadata } from "next";
import Link from "next/link";
import { FormularioCampanha } from "../FormularioCampanha";
import { Icone } from "@/components/ui/Icone";

export const metadata: Metadata = { title: "Nova campanha" };

export default function NovaCampanha() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/apadrinhamento"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todas as campanhas
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">Nova campanha</h1>
      <p className="mt-2 text-sm text-tinta-suave">
        A campanha nasce como rascunho: ela só aparece no site quando você mudar a situação para
        &quot;aberta&quot;.
      </p>

      <div className="mt-8">
        <FormularioCampanha campanha={null} />
      </div>
    </div>
  );
}
