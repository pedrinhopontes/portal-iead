"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Icone } from "@/components/ui/Icone";
import {
  rotuloEstado,
  type EstadoParticipante,
  type ParticipantePublico,
} from "@/lib/dados/apadrinhamento-tipos";

const tonsEstado: Record<EstadoParticipante, "verde" | "aviso" | "bordo" | "ardosia" | "neutro"> = {
  disponivel: "verde",
  reserva_pendente: "aviso",
  apadrinhado: "bordo",
  presente_recebido: "ardosia",
  concluido: "neutro",
};

const filtros: { valor: "todos" | EstadoParticipante; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "disponivel", rotulo: "Disponíveis" },
  { valor: "reserva_pendente", rotulo: "Reserva pendente" },
  { valor: "apadrinhado", rotulo: "Apadrinhados" },
  { valor: "presente_recebido", rotulo: "Presente recebido" },
  { valor: "concluido", rotulo: "Concluídos" },
];

export function ListaParticipantes({
  participantes,
  campanhaAberta,
}: {
  participantes: ParticipantePublico[];
  campanhaAberta: boolean;
}) {
  const [filtro, setFiltro] = useState<"todos" | EstadoParticipante>("todos");

  const visiveis = useMemo(
    () => (filtro === "todos" ? participantes : participantes.filter((p) => p.estado === filtro)),
    [filtro, participantes],
  );

  const disponiveis = participantes.filter((p) => p.estado === "disponivel").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold text-tinta-suave">
          {disponiveis} de {participantes.length}{" "}
          {participantes.length === 1 ? "participante ainda aguarda" : "participantes ainda aguardam"} um
          padrinho ou madrinha
        </p>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por situação">
          {filtros.map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => setFiltro(item.valor)}
              aria-pressed={filtro === item.valor}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filtro === item.valor
                  ? "border-bordo bg-bordo text-white"
                  : "border-linha bg-white text-tinta hover:border-bordo hover:text-bordo"
              }`}
            >
              {item.rotulo}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((participante) => {
          const livre = participante.estado === "disponivel";

          return (
            <li
              key={participante.id}
              className="flex flex-col rounded-2xl border border-linha bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl font-semibold text-bordo">
                    {participante.codigo_publico}
                  </p>
                  <p className="text-sm text-tinta-suave">
                    {participante.idade !== null && `${participante.idade} anos`}
                    {participante.idade !== null && participante.projeto && " · "}
                    {participante.projeto}
                  </p>
                </div>
                <Etiqueta tom={tonsEstado[participante.estado]}>
                  {rotuloEstado[participante.estado]}
                </Etiqueta>
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-linha/70 pb-2">
                  <dt className="text-tinta-suave">Tamanho da roupa</dt>
                  <dd className="font-semibold">{participante.tamanho_roupa ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-linha/70 pb-2">
                  <dt className="text-tinta-suave">Calçado</dt>
                  <dd className="font-semibold">{participante.tamanho_calcado ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-tinta-suave">Sugestão</dt>
                  <dd className="text-right font-semibold">{participante.sugestao_presente ?? "—"}</dd>
                </div>
              </dl>

              {livre && campanhaAberta ? (
                <Link
                  href={`/apadrinhamento/apadrinhar/${participante.id}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-bordo px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-bordo-escuro"
                >
                  <Icone nome="presente" className="h-4 w-4" />
                  Quero apadrinhar
                </Link>
              ) : (
                <span className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-linha bg-areia px-5 py-3 text-sm font-semibold text-tinta-suave">
                  <Icone nome="check" className="h-4 w-4" />
                  {livre ? "Campanha fechada" : rotuloEstado[participante.estado]}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {visiveis.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-tinta/20 p-8 text-center text-tinta-suave">
          Nenhum participante nesta situação.
        </p>
      )}
    </div>
  );
}
