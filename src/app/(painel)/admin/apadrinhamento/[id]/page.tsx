import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { expirarReservasAgora, mudarStatusReserva } from "../acoes";
import { FormularioCampanha } from "../FormularioCampanha";
import { Icone } from "@/components/ui/Icone";
import { rotuloEstado } from "@/lib/dados/apadrinhamento-tipos";
import {
  campanhaDoPainel,
  formatarDataHora,
  participantesDoPainel,
  reservasDaCampanha,
  rotuloStatusReserva,
  type StatusApadrinhamento,
} from "@/lib/dados/painel-apadrinhamento";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campanha = await campanhaDoPainel(id);
  return { title: campanha ? `Campanha ${campanha.ano}` : "Campanha" };
}

const corEstado: Record<string, string> = {
  disponivel: "bg-verde-suave text-verde-escuro",
  reserva_pendente: "bg-amber-50 text-amber-800",
  apadrinhado: "bg-bordo-suave text-bordo-escuro",
  presente_recebido: "bg-ardosia/10 text-ardosia",
  concluido: "bg-creme text-tinta-suave",
};

/** Próximos passos possíveis a partir de cada status de reserva. */
const proximosPassos: Record<string, { status: StatusApadrinhamento; rotulo: string }[]> = {
  reservado: [
    { status: "confirmado", rotulo: "Confirmar" },
    { status: "cancelado", rotulo: "Cancelar" },
  ],
  confirmado: [
    { status: "presente_recebido", rotulo: "Presente recebido" },
    { status: "cancelado", rotulo: "Cancelar" },
  ],
  presente_recebido: [{ status: "concluido", rotulo: "Concluir" }],
  concluido: [],
  cancelado: [],
  expirado: [],
};

export default async function CampanhaDoPainel({ params }: Props) {
  const { id } = await params;

  const campanha = await campanhaDoPainel(id);
  if (!campanha) notFound();

  const [participantes, reservas] = await Promise.all([
    participantesDoPainel(id),
    reservasDaCampanha(id),
  ]);

  const ativas = reservas.filter((r) =>
    ["reservado", "confirmado", "presente_recebido"].includes(r.status),
  );

  return (
    <div className="max-w-5xl">
      <Link
        href="/admin/apadrinhamento"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave hover:text-bordo"
      >
        <Icone nome="seta" className="h-4 w-4 rotate-180" />
        Todas as campanhas
      </Link>

      <h1 className="mt-5 font-serif text-3xl font-semibold">
        Campanha {campanha.ano}
      </h1>
      <p className="mt-1 text-tinta-suave">{campanha.titulo}</p>

      {/* ---------------- Participantes ---------------- */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold">
            Participantes <span className="text-tinta-suave">({participantes.length})</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/apadrinhamento/${id}/fotos`}
              className="rounded-full border border-linha px-5 py-2.5 text-sm font-semibold hover:border-bordo hover:text-bordo"
            >
              Fotos dos participantes
            </Link>
            <Link
              href={`/admin/apadrinhamento/${id}/participante/novo`}
              className="rounded-full bg-bordo px-5 py-2.5 text-sm font-bold text-white hover:bg-bordo-escuro"
            >
              Novo participante
            </Link>
          </div>
        </div>

        <p className="mt-2 flex items-center gap-2 text-xs text-bordo-escuro">
          <Icone nome="cadeado" className="h-4 w-4" />
          A coluna &quot;nome&quot; é área restrita: não aparece no site e não deve ser compartilhada.
        </p>

        {participantes.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-sm text-tinta-suave">
            Nenhum participante cadastrado nesta campanha.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-linha bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-linha bg-areia text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Nome (restrito)</th>
                  <th className="px-4 py-3 font-semibold">Idade</th>
                  <th className="px-4 py-3 font-semibold">Projeto</th>
                  <th className="px-4 py-3 font-semibold">Situação</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {participantes.map((p) => (
                  <tr key={p.id} className="border-b border-linha/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-bordo">{p.codigo_publico}</td>
                    <td className="px-4 py-3 text-tinta-suave">
                      {p.participantes_dados_restritos?.nome_completo ?? (
                        <span className="text-amber-700">não cadastrado</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.idade ?? "—"}</td>
                    <td className="px-4 py-3">{p.projeto ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          corEstado[p.estado]
                        }`}
                      >
                        {rotuloEstado[p.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/apadrinhamento/${id}/participante/${p.id}`}
                        className="font-semibold text-bordo hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------- Reservas ---------------- */}
      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold">
            Reservas <span className="text-tinta-suave">({ativas.length} ativas)</span>
          </h2>
          <form action={expirarReservasAgora.bind(null, id)}>
            <button
              type="submit"
              className="rounded-full border border-linha px-5 py-2.5 text-sm font-semibold hover:border-bordo hover:text-bordo"
            >
              Expirar reservas vencidas
            </button>
          </form>
        </div>

        {reservas.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-sm text-tinta-suave">
            Ninguém apadrinhou ainda.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {reservas.map((reserva) => (
              <li key={reserva.id} className="rounded-2xl border border-linha bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-bordo">
                        {reserva.participantes?.codigo_publico ?? "—"}
                      </span>
                      <span className="rounded-full bg-creme px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-tinta-suave">
                        {rotuloStatusReserva[reserva.status]}
                      </span>
                      <span className="rounded-full bg-areia px-2.5 py-0.5 text-[11px] font-semibold text-tinta-suave">
                        {reserva.tipo === "presente" ? "entrega o presente" : "contribui"}
                      </span>
                    </div>

                    <p className="mt-2 font-semibold">{reserva.padrinho_nome}</p>
                    <p className="text-sm text-tinta-suave">
                      {reserva.padrinho_email}
                      {reserva.padrinho_telefone && ` · ${reserva.padrinho_telefone}`}
                    </p>
                    {reserva.mensagem && (
                      <p className="mt-2 rounded-xl bg-areia px-4 py-2 text-sm text-tinta-suave">
                        {reserva.mensagem}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-tinta-suave">
                      Reservado em {formatarDataHora(reserva.criado_em)}
                      {reserva.status === "reservado" &&
                        ` · vence em ${formatarDataHora(reserva.reserva_expira_em)}`}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {proximosPassos[reserva.status]?.map((passo) => (
                      <form
                        key={passo.status}
                        action={mudarStatusReserva.bind(null, id, reserva.id, passo.status)}
                      >
                        <button
                          type="submit"
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            passo.status === "cancelado"
                              ? "border border-linha hover:border-bordo hover:text-bordo"
                              : "bg-tinta text-white hover:bg-bordo"
                          }`}
                        >
                          {passo.rotulo}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------------- Dados da campanha ---------------- */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold">Dados da campanha</h2>
        <div className="mt-5 rounded-2xl border border-linha bg-white p-7">
          <FormularioCampanha campanha={campanha} />
        </div>
      </section>
    </div>
  );
}
