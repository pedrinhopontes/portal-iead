import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icone } from "@/components/ui/Icone";
import { listarMidias } from "@/lib/dados/midias";
import { catalogoDeSlots, rotuloDoSlot } from "@/lib/dados/slots";

export const metadata: Metadata = { title: "Fotos e arquivos" };
export const dynamic = "force-dynamic";

export default async function Midias() {
  const [midias, grupos] = await Promise.all([listarMidias(), catalogoDeSlots()]);

  const semLugar = midias.filter((m) => m.midia_slots.length === 0).length;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Fotos e arquivos</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            O acervo de imagens do site. Cada foto é descrita uma vez e pode aparecer em vários lugares.
          </p>
        </div>
        <Link
          href="/admin/midias/nova"
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Enviar foto
        </Link>
      </div>

      {midias.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-tinta-suave">
          <span>
            <strong className="font-semibold text-tinta">{midias.length}</strong>{" "}
            {midias.length === 1 ? "foto no acervo" : "fotos no acervo"}
          </span>
          {semLugar > 0 && (
            <span className="text-amber-700">
              <strong className="font-semibold">{semLugar}</strong> ainda sem lugar definido no site
            </span>
          )}
        </div>
      )}

      {midias.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-12 text-center">
          <Icone nome="camera" className="mx-auto h-10 w-10 text-tinta/30" />
          <p className="mt-4 font-semibold">Nenhuma foto enviada ainda</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-tinta-suave">
            Pode mandar a foto original do celular: o navegador reduz o tamanho antes de enviar, então
            não precisa preparar nada antes.
          </p>
          <Link
            href="/admin/midias/nova"
            className="mt-6 inline-block rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
          >
            Enviar a primeira
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {midias.map((midia) => (
            <li key={midia.id} className="overflow-hidden rounded-2xl border border-linha bg-white">
              <div className="relative aspect-[4/3] bg-creme">
                <Image
                  src={midia.caminho}
                  alt={midia.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                />
                {midia.tem_menores && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-bordo px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                    <Icone nome="cadeado" className="h-3 w-3" />
                    com menores
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="line-clamp-2 text-sm text-tinta-suave">{midia.alt}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {midia.midia_slots.length === 0 ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                      sem lugar no site
                    </span>
                  ) : (
                    midia.midia_slots.map((s) => (
                      <span
                        key={s.slot}
                        className="rounded-full bg-verde-suave px-2.5 py-1 text-[11px] font-semibold text-verde-escuro"
                      >
                        {rotuloDoSlot(grupos, s.slot)}
                      </span>
                    ))
                  )}
                </div>

                <Link
                  href={`/admin/midias/${midia.id}`}
                  className="mt-4 inline-block text-sm font-bold text-bordo hover:underline"
                >
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
