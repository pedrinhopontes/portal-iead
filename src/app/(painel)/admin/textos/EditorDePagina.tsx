"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { salvarTextos, type EstadoTextos } from "./acoes";
import type { TextoEditavel } from "./tipos";
import { Icone } from "@/components/ui/Icone";

const COOKIE_PREVIA = "previa-textos";
/** Cookie de navegador costuma morrer em 4 KB; fico bem abaixo. */
const LIMITE_DO_COOKIE = 3000;

const campo = "mt-1 w-full rounded-xl border border-linha bg-areia px-4 py-3 text-sm font-normal";

function gravarCookie(valor: string) {
  document.cookie = `${COOKIE_PREVIA}=${encodeURIComponent(valor)}; path=/; SameSite=Lax`;
}

function apagarCookie() {
  document.cookie = `${COOKIE_PREVIA}=; path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Campos de um lado, a página do outro, atualizando enquanto se digita.
 *
 * COMO A PRÉVIA ACOMPANHA: a página do quadro é a página pública de verdade,
 * montada no servidor — não uma imitação que poderia divergir do site. Para o
 * texto ainda não salvo chegar até lá, o rascunho vai num cookie com apenas os
 * campos alterados, e o quadro recarrega. Meio segundo depois da última tecla,
 * para não recarregar a cada letra.
 *
 * Só o que mudou entra no cookie. Quem edita mexe em um ou dois campos por
 * vez, então sobra espaço; se alguém alterar muitos de uma vez e passar do
 * limite, a prévia avisa que vai mostrar só depois de salvar, em vez de
 * silenciosamente parar de atualizar.
 */
export function EditorDePagina({ textos, url }: { textos: TextoEditavel[]; url: string }) {
  const [estado, acao, enviando] = useActionState<EstadoTextos, FormData>(salvarTextos, {});

  const inicial = useMemo(
    () => Object.fromEntries(textos.map((t) => [t.chave, t.valor ?? t.padrao])),
    [textos],
  );
  const [valores, setValores] = useState<Record<string, string>>(inicial);
  const [recarga, setRecarga] = useState(0);
  const [grandeDemais, setGrandeDemais] = useState(false);
  const relogio = useRef<ReturnType<typeof setTimeout> | null>(null);

  const alterados = Object.keys(valores).filter(
    (k) => valores[k].trim() !== (inicial[k] ?? "").trim(),
  );

  // Rascunho para a prévia: só o que difere do que já está no ar.
  useEffect(() => {
    const diferentes = Object.fromEntries(
      Object.keys(valores)
        .filter((k) => valores[k].trim() !== (inicial[k] ?? "").trim())
        .map((k) => [k, valores[k]]),
    );

    if (relogio.current) clearTimeout(relogio.current);

    relogio.current = setTimeout(() => {
      if (Object.keys(diferentes).length === 0) {
        apagarCookie();
        setGrandeDemais(false);
      } else {
        const json = JSON.stringify(diferentes);
        if (encodeURIComponent(json).length > LIMITE_DO_COOKIE) {
          setGrandeDemais(true);
          return;
        }
        setGrandeDemais(false);
        gravarCookie(json);
      }
      setRecarga((n) => n + 1);
    }, 500);

    return () => {
      if (relogio.current) clearTimeout(relogio.current);
    };
  }, [valores, inicial]);

  // Depois de salvar, o rascunho não é mais necessário: o valor está no banco.
  useEffect(() => {
    if (estado.salvos !== undefined && !estado.erro) {
      apagarCookie();
      setRecarga((n) => n + 1);
    }
  }, [estado]);

  // Sair da tela sem salvar não pode deixar o rascunho afetando o site.
  useEffect(() => () => apagarCookie(), []);

  return (
    <form action={acao} className="mt-6">
      {/* Barra fixa: salvar fica sempre ao alcance, sem rolar até o fim */}
      <div className="sticky top-0 z-20 -mx-2 flex flex-wrap items-center gap-3 border-b border-linha bg-areia/95 px-2 py-3 backdrop-blur-sm">
        <button
          type="submit"
          disabled={enviando || alterados.length === 0}
          className="rounded-full bg-bordo px-6 py-2.5 text-sm font-bold text-white hover:bg-bordo-escuro disabled:opacity-50"
        >
          {enviando ? "Salvando…" : "Salvar"}
        </button>

        <span className="text-sm text-tinta-suave">
          {alterados.length === 0
            ? "Nada alterado"
            : `${alterados.length} ${alterados.length === 1 ? "alteração não salva" : "alterações não salvas"}`}
        </span>

        {estado.salvos !== undefined && !estado.erro && alterados.length === 0 && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-verde-escuro">
            <Icone nome="check" className="h-4 w-4" />
            Salvo
          </span>
        )}
      </div>

      {estado.erro && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro"
        >
          {estado.erro}
        </p>
      )}

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Campos */}
        <ul className="divide-y divide-linha rounded-2xl border border-linha bg-white">
          {textos.map((texto) => {
            const valor = valores[texto.chave] ?? "";
            const original = valor.trim() === texto.padrao.trim();

            return (
              <li key={texto.chave} className="px-5 py-4">
                <input type="hidden" name="chave" value={texto.chave} />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor={texto.chave} className="text-sm font-semibold">
                    {texto.rotulo}
                  </label>
                  {!original && (
                    <button
                      type="button"
                      onClick={() =>
                        setValores((v) => ({ ...v, [texto.chave]: texto.padrao }))
                      }
                      className="text-xs font-semibold text-bordo hover:underline"
                    >
                      Voltar ao original
                    </button>
                  )}
                </div>

                {texto.longo ? (
                  <textarea
                    id={texto.chave}
                    name={`valor:${texto.chave}`}
                    rows={3}
                    value={valor}
                    onChange={(e) =>
                      setValores((v) => ({ ...v, [texto.chave]: e.target.value }))
                    }
                    className={campo}
                  />
                ) : (
                  <input
                    id={texto.chave}
                    name={`valor:${texto.chave}`}
                    value={valor}
                    onChange={(e) =>
                      setValores((v) => ({ ...v, [texto.chave]: e.target.value }))
                    }
                    className={campo}
                  />
                )}

                {!original && (
                  <p className="mt-2 text-xs text-tinta-suave">
                    Original: <span className="italic">{texto.padrao}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {/* Prévia */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Como fica no site</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-tinta-suave hover:text-bordo"
            >
              Abrir em outra aba ↗
            </a>
          </div>

          <div className="mt-2 overflow-hidden rounded-2xl border border-linha bg-white">
            <iframe key={recarga} src={url} title="Prévia da página" className="h-[75vh] w-full" />
          </div>

          <p className="mt-2 text-xs text-tinta-suave">
            {grandeDemais
              ? "Muitas alterações de uma vez para a prévia acompanhar — salve para vê-las na página."
              : "A prévia é a página de verdade e acompanha o que você digita."}
          </p>
        </div>
      </div>
    </form>
  );
}
