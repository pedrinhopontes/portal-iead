import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioFotos } from "./FormularioFotos";
import { Icone } from "@/components/ui/Icone";
import { campanhaDoPainel, participantesDoPainel } from "@/lib/dados/painel-apadrinhamento";

export const metadata: Metadata = { title: "Fotos dos participantes" };
export const dynamic = "force-dynamic";

/** Caminho que ainda aponta para a máquina de quem desenvolve, não para o armazenamento. */
function ehCaminhoLocal(caminho: string | null | undefined): boolean {
  return !!caminho && caminho.startsWith("/");
}

export default async function FotosDaCampanha({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campanha = await campanhaDoPainel(id);
  if (!campanha) notFound();

  const participantes = await participantesDoPainel(id);

  const comFoto = participantes.filter((p) => p.foto?.caminho);
  const noArmazenamento = comFoto.filter((p) => !ehCaminhoLocal(p.foto?.caminho));
  const pendentes = comFoto.filter((p) => ehCaminhoLocal(p.foto?.caminho));
  const semFoto = participantes.filter((p) => !p.foto?.caminho);

  return (
    <div className="max-w-4xl">
      <Link
        href={`/admin/apadrinhamento/${id}`}
        className="text-sm font-semibold text-tinta-suave hover:text-bordo hover:underline"
      >
        ← Campanha {campanha.ano}
      </Link>

      <h1 className="mt-3 font-serif text-3xl font-semibold">Fotos dos participantes</h1>
      <p className="mt-1 text-sm text-tinta-suave">
        As fotos precisam ficar no armazenamento do Supabase para aparecerem no site publicado.
        Enquanto estiverem só no computador, elas funcionam aqui e somem lá.
      </p>

      {/* Situação */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-linha bg-white p-5">
          <p className="font-serif text-3xl font-semibold text-verde-escuro">
            {noArmazenamento.length}
          </p>
          <p className="mt-1 text-sm text-tinta-suave">no armazenamento, prontas para publicar</p>
        </div>
        <div className="rounded-2xl border border-linha bg-white p-5">
          <p className="font-serif text-3xl font-semibold text-amber-700">{pendentes.length}</p>
          <p className="mt-1 text-sm text-tinta-suave">ainda só no computador</p>
        </div>
        <div className="rounded-2xl border border-linha bg-white p-5">
          <p className="font-serif text-3xl font-semibold text-tinta-suave">{semFoto.length}</p>
          <p className="mt-1 text-sm text-tinta-suave">sem foto cadastrada</p>
        </div>
      </div>

      {pendentes.length > 0 && (
        <div className="mt-8">
          <FormularioFotos campanhaId={id} pendentes={pendentes.length} />
        </div>
      )}

      {pendentes.length === 0 && comFoto.length > 0 && (
        <p className="mt-8 flex items-center gap-2 rounded-2xl bg-verde-suave px-5 py-4 text-sm font-semibold text-verde-escuro">
          <Icone nome="check" className="h-5 w-5" />
          Todas as fotos já estão no armazenamento. Nada a enviar.
        </p>
      )}

      {/* Lista, para conferir arquivo por arquivo */}
      {pendentes.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold">Esperando envio</h2>
          <p className="mt-1 text-sm text-tinta-suave">
            O nome do arquivo é o que liga a foto à criança. Envie com estes nomes.
          </p>
          <ul className="mt-5 divide-y divide-linha rounded-2xl border border-linha bg-white">
            {pendentes.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <span className="font-semibold">{p.nome_exibicao ?? p.codigo_publico}</span>
                <code className="rounded bg-areia px-2 py-1 text-xs">
                  {p.foto?.caminho?.split("/").pop()}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {semFoto.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold">Sem foto cadastrada</h2>
          <p className="mt-1 text-sm text-tinta-suave">
            Estes participantes não têm foto ligada. Cadastre pela tela de Fotos, informando o termo
            de autorização, e depois ligue na ficha do participante.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {semFoto.map((p) => (
              <li
                key={p.id}
                className="rounded-full border border-linha bg-areia px-4 py-1.5 text-sm"
              >
                {p.nome_exibicao ?? p.codigo_publico}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
