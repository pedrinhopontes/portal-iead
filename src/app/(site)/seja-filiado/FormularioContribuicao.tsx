"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { contribuir, type EstadoContribuicao } from "./acoes";
import { Icone } from "@/components/ui/Icone";
import { instituto } from "@/lib/instituto";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";
const valores = ["20", "50", "80", "100"];

export function FormularioContribuicao() {
  const [estado, acao, enviando] = useActionState<EstadoContribuicao, FormData>(contribuir, {});
  const [valor, setValor] = useState("50");
  const [tipo, setTipo] = useState<"mensal" | "unica">("mensal");

  if (estado.sucesso) return <Confirmacao estado={estado} />;

  return (
    <form action={acao} className="rounded-2xl border border-linha bg-white p-7">
      <fieldset>
        <legend className="text-sm font-bold uppercase tracking-wider text-verde-escuro">
          Quanto você quer contribuir
        </legend>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {valores.map((v) => (
            <label
              key={v}
              className={`cursor-pointer rounded-xl border-2 px-3 py-4 text-center font-bold transition-colors ${
                valor === v ? "border-verde-escuro bg-verde-suave text-verde-escuro" : "border-linha"
              }`}
            >
              <input
                type="radio"
                name="valor"
                value={v}
                checked={valor === v}
                onChange={() => setValor(v)}
                className="sr-only"
              />
              R$ {v}
            </label>
          ))}

          <label
            className={`cursor-pointer rounded-xl border-2 px-3 py-4 text-center font-bold transition-colors ${
              valor === "outro" ? "border-verde-escuro bg-verde-suave text-verde-escuro" : "border-linha"
            }`}
          >
            <input
              type="radio"
              name="valor"
              value="outro"
              checked={valor === "outro"}
              onChange={() => setValor("outro")}
              className="sr-only"
            />
            Outro
          </label>
        </div>

        {valor === "outro" && (
          <label className="mt-4 flex flex-col gap-1.5 text-sm font-semibold">
            Valor
            <input
              name="valor_outro"
              inputMode="decimal"
              required
              placeholder="150,00"
              className={campo}
            />
          </label>
        )}
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold uppercase tracking-wider text-verde-escuro">
          Com que frequência
        </legend>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              { v: "mensal", t: "Todo mês", d: "É o que permite ao Instituto planejar o ano." },
              { v: "unica", t: "Uma vez", d: "Uma contribuição pontual, agora." },
            ] as const
          ).map((opcao) => (
            <label
              key={opcao.v}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                tipo === opcao.v ? "border-bordo bg-bordo-suave" : "border-linha hover:border-bordo/40"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={opcao.v}
                checked={tipo === opcao.v}
                onChange={() => setTipo(opcao.v)}
                className="sr-only"
              />
              <span className="font-semibold">{opcao.t}</span>
              <span className="mt-1 block text-sm text-tinta-suave">{opcao.d}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
            Telefone
            <input type="tel" name="telefone" autoComplete="tel" className={campo} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Mensagem para o Instituto
          <textarea name="mensagem" rows={2} className={campo} />
          <span className="text-xs font-normal text-tinta-suave">Opcional.</span>
        </label>

        <label className="flex items-start gap-3 rounded-xl bg-areia p-4 text-sm text-tinta-suave">
          <input type="checkbox" name="consentimento" className="mt-0.5 h-4 w-4" />
          <span>
            Autorizo o IEAD a usar os meus dados para registrar esta contribuição e emitir o comprovante,
            conforme a{" "}
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
        {enviando ? "Gerando…" : "Gerar o PIX"}
      </button>

      <p className="mt-4 text-center text-xs text-tinta-suave">
        O PIX cai direto na conta do Instituto. Sem taxa, sem intermediário.
      </p>
    </form>
  );
}

function Confirmacao({ estado }: { estado: EstadoContribuicao }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    if (!estado.codigoPix) return;
    try {
      await navigator.clipboard.writeText(estado.codigoPix);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      setCopiado(false);
    }
  }

  const valorFormatado = estado.valor?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="rounded-2xl border-2 border-verde bg-verde-suave p-7">
      <Icone nome="check" className="h-10 w-10 text-verde-escuro" />
      <h2 className="mt-4 font-serif text-2xl font-semibold text-verde-escuro">
        Contribuição registrada
      </h2>
      <p className="mt-2 text-tinta-suave">
        {valorFormatado}
        {estado.tipo === "mensal" ? " por mês" : ", uma vez"}. Agora é só pagar o PIX.
      </p>

      {estado.pixPendente ? (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-bold">A chave PIX do Instituto ainda não foi cadastrada.</p>
          <p className="mt-2">
            O seu registro foi salvo com a referência{" "}
            <strong className="font-mono">{estado.referencia}</strong>. A equipe do IEAD entra em contato
            com os dados para o pagamento.
          </p>
        </div>
      ) : (
        <>
          {estado.qrSvg && (
            <div
              className="mx-auto mt-6 w-52 rounded-xl bg-white p-3"
              /* SVG gerado aqui mesmo, a partir do código que montamos. */
              dangerouslySetInnerHTML={{ __html: estado.qrSvg }}
            />
          )}

          <p className="mt-5 text-sm font-semibold">Ou copie o código e cole no seu banco:</p>
          <code className="mt-2 block max-h-28 overflow-y-auto break-all rounded-xl bg-white p-4 font-mono text-xs text-tinta-suave">
            {estado.codigoPix}
          </code>

          <button
            type="button"
            onClick={copiar}
            className="mt-3 w-full rounded-full bg-verde-escuro px-6 py-3 font-bold text-white hover:bg-tinta"
          >
            {copiado ? "Código copiado" : "Copiar código PIX"}
          </button>
        </>
      )}

      <div className="mt-6 rounded-xl bg-white/70 p-4 text-sm text-tinta-suave">
        <p>
          A sua referência é <strong className="font-mono text-tinta">{estado.referencia}</strong>. Guarde:
          é por ela que o Instituto identifica a sua contribuição no extrato.
        </p>
        {estado.tipo === "mensal" && (
          <p className="mt-3">
            <strong className="font-semibold text-tinta">Sobre a contribuição mensal:</strong> nesta fase o
            PIX não cobra sozinho. Você repete o pagamento a cada mês, e o Instituto acompanha. A cobrança
            automática entra quando a integração bancária for contratada.
          </p>
        )}
      </div>

      <a
        href={instituto.contato.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-verde-escuro hover:underline"
      >
        <Icone nome="whatsapp" className="h-4 w-4" />
        Avisar o Instituto pelo WhatsApp
      </a>
    </div>
  );
}
