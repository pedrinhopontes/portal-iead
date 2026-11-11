"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { reservar, type EstadoReserva } from "../acoes";
import { Icone } from "@/components/ui/Icone";
import { instituto } from "@/lib/instituto";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioApadrinhamento({
  participanteId,
  codigo,
  horasReserva,
  valorContribuicao,
}: {
  participanteId: string;
  codigo: string;
  horasReserva: number;
  valorContribuicao: string | null;
}) {
  const [estado, acao, enviando] = useActionState<EstadoReserva, FormData>(reservar, {});
  const [tipo, setTipo] = useState<"presente" | "financeiro">("presente");

  if (estado.sucesso) {
    const prazo = estado.expiraEm
      ? new Date(estado.expiraEm).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

    return (
      <div className="rounded-2xl border-2 border-verde bg-verde-suave p-8">
        <Icone nome="check" className="h-10 w-10 text-verde-escuro" />
        <h2 className="mt-4 font-serif text-2xl font-semibold text-verde-escuro">
          Reserva registrada
        </h2>
        <p className="mt-3 leading-relaxed text-tinta-suave">
          O participante <strong className="font-semibold">{codigo}</strong> saiu da lista e está
          reservado para você. Ninguém mais consegue escolhê-lo.
        </p>

        {prazo && (
          <p className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-sm text-tinta-suave">
            A equipe do Instituto vai entrar em contato para confirmar até{" "}
            <strong className="font-semibold text-tinta">{prazo}</strong>. Se não houver confirmação
            até lá, a reserva vence e o participante volta para a lista.
          </p>
        )}

        <h3 className="mt-6 font-semibold">E agora?</h3>
        <ul className="mt-3 space-y-2 text-sm text-tinta-suave">
          <li className="flex gap-2.5">
            <Icone nome="check" className="mt-0.5 h-4 w-4 shrink-0 text-verde-escuro" />
            Guarde o código <strong className="font-semibold">{codigo}</strong>: é por ele que o
            Instituto identifica a sua reserva.
          </li>
          <li className="flex gap-2.5">
            <Icone nome="check" className="mt-0.5 h-4 w-4 shrink-0 text-verde-escuro" />
            Aguarde o contato da equipe com as orientações de entrega.
          </li>
          <li className="flex gap-2.5">
            <Icone nome="check" className="mt-0.5 h-4 w-4 shrink-0 text-verde-escuro" />
            Se preferir adiantar, fale direto com o Instituto.
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={instituto.contato.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-verde-escuro px-6 py-3 text-sm font-bold text-white hover:bg-tinta"
          >
            <Icone nome="whatsapp" className="h-4 w-4" />
            Falar com o Instituto
          </a>
          <Link
            href="/apadrinhamento/participantes"
            className="inline-flex items-center gap-2 rounded-full border border-verde-escuro/40 px-6 py-3 text-sm font-semibold text-verde-escuro hover:bg-white/60"
          >
            Apadrinhar outro participante
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={acao} className="rounded-2xl border border-linha bg-white p-7">
      <input type="hidden" name="participanteId" value={participanteId} />

      <h2 className="text-xl font-semibold">Como você quer participar?</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label
          className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${
            tipo === "presente" ? "border-bordo bg-bordo-suave" : "border-linha hover:border-bordo/40"
          }`}
        >
          <input
            type="radio"
            name="tipo"
            value="presente"
            checked={tipo === "presente"}
            onChange={() => setTipo("presente")}
            className="sr-only"
          />
          <span className="flex items-center gap-2 font-semibold">
            <Icone nome="presente" className="h-5 w-5 text-bordo" />
            Entregar o presente
          </span>
          <span className="mt-1 block text-sm text-tinta-suave">
            Você compra e entrega na sede do Instituto.
          </span>
        </label>

        <label
          className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${
            tipo === "financeiro" ? "border-bordo bg-bordo-suave" : "border-linha hover:border-bordo/40"
          }`}
        >
          <input
            type="radio"
            name="tipo"
            value="financeiro"
            checked={tipo === "financeiro"}
            onChange={() => setTipo("financeiro")}
            className="sr-only"
          />
          <span className="flex items-center gap-2 font-semibold">
            <Icone nome="coracao" className="h-5 w-5 text-bordo" />
            Contribuir
          </span>
          <span className="mt-1 block text-sm text-tinta-suave">
            {valorContribuicao
              ? `A equipe monta o presente. Valor: ${valorContribuicao}.`
              : "A equipe monta o presente. O valor de 2026 ainda será confirmado."}
          </span>
        </label>
      </div>

      <div className="mt-6 space-y-5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Seu nome
          <input name="nome" required autoComplete="name" className={campo} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            E-mail
            <input type="email" name="email" required autoComplete="email" className={campo} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Telefone ou WhatsApp
            <input type="tel" name="telefone" autoComplete="tel" className={campo} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Mensagem para a equipe
          <textarea name="mensagem" rows={3} className={campo} />
          <span className="text-xs font-normal text-tinta-suave">
            Opcional. Útil para combinar horário de entrega, por exemplo.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-xl bg-areia p-4 text-sm text-tinta-suave">
          <input type="checkbox" name="consentimento" className="mt-0.5 h-4 w-4" />
          <span>
            Autorizo o IEAD a usar os meus dados para organizar a entrega deste presente, conforme a{" "}
            <Link href="/privacidade" className="font-semibold text-bordo hover:underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
      </div>

      {estado.erro && (
        <p role="alert" className="mt-5 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-bordo px-6 py-4 font-bold text-white transition-colors hover:bg-bordo-escuro disabled:opacity-60"
      >
        <Icone nome="coracao" className="h-5 w-5" />
        {enviando ? "Reservando…" : `Reservar ${codigo}`}
      </button>

      <p className="mt-4 text-center text-xs text-tinta-suave">
        A reserva fica no seu nome por {horasReserva} horas.
      </p>
    </form>
  );
}
