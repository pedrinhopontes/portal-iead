import type { Indicador } from "@/lib/dados/conteudo-tipos";

/**
 * Indicadores de impacto.
 *
 * Só exibe número que o Instituto confirmou e cuja fonte foi declarada — o banco
 * recusa marcar como verificado sem as duas coisas. Enquanto o dado não chega, o
 * lugar fica marcado como pendente, nunca estimado.
 */
export function Indicadores({
  indicadores,
  claro = false,
}: {
  indicadores: Indicador[];
  claro?: boolean;
}) {
  if (indicadores.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-linha bg-linha lg:grid-cols-4">
      {indicadores.map((item) => (
        <div key={item.rotulo} className={`p-6 ${claro ? "bg-areia" : "bg-white"}`}>
          <dt className="text-sm font-semibold leading-snug text-tinta-suave">{item.rotulo}</dt>
          <dd className="mt-2">
            {item.verificado && item.valor ? (
              <span className="font-serif text-4xl font-semibold text-bordo">{item.valor}</span>
            ) : (
              <>
                <span aria-hidden="true" className="font-serif text-4xl font-semibold text-tinta/25">
                  —
                </span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  Aguardando dado verificado
                </span>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
