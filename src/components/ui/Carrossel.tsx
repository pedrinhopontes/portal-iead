"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { EspacoFoto, proporcoes, type Proporcao } from "./EspacoFoto";
import { Icone } from "./Icone";
import type { FotoExibida } from "@/lib/dados/fotos-do-site";

/**
 * Carrossel de fotografias com troca automática.
 *
 * Regras de acessibilidade aplicadas (WCAG 2.2):
 * - 2.2.2 Pausar, parar, ocultar: há botão de pausa, já que a troca é automática.
 * - A troca automática não começa para quem pede movimento reduzido no sistema.
 * - A troca pausa sozinha quando o ponteiro está sobre o carrossel ou quando algum
 *   controle recebe foco pelo teclado, para não trocar a foto no meio da interação.
 * - Setas do teclado navegam entre as fotos.
 *
 * Enquanto nenhuma das fotos estiver registrada em `src/content/fotos.ts`, mostra o
 * espaço reservado marcado, igual ao componente Foto.
 */
export function Carrossel({
  fotos,
  legenda,
  proporcao = "4/3",
  intervalo = 5000,
  className = "",
  tamanhos = "(max-width: 1024px) 100vw, 560px",
}: {
  /** Fotos já resolvidas pelo servidor, na ordem em que devem aparecer. */
  fotos: FotoExibida[];
  /** Texto do espaço reservado enquanto não houver nenhuma foto registrada. */
  legenda: string;
  proporcao?: Proporcao;
  /** Tempo de cada foto, em milissegundos. */
  intervalo?: number;
  className?: string;
  tamanhos?: string;
}) {
  const total = fotos.length;

  const [indice, setIndice] = useState(0);
  const [tocando, setTocando] = useState(true);
  const [interagindo, setInteragindo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTocando(false);
    }
  }, []);

  const avancar = useCallback(() => setIndice((i) => (i + 1) % Math.max(total, 1)), [total]);
  const voltar = useCallback(() => setIndice((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1)), [total]);

  useEffect(() => {
    if (!tocando || interagindo || total < 2) return;
    const id = window.setInterval(avancar, intervalo);
    return () => window.clearInterval(id);
  }, [tocando, interagindo, total, intervalo, avancar]);

  if (total === 0) {
    return <EspacoFoto legenda={legenda} proporcao={proporcao} className={className} />;
  }

  const botao =
    "rounded-full bg-tinta/35 p-2 text-white backdrop-blur-sm transition-colors hover:bg-tinta/60";

  return (
    <div
      role="group"
      aria-roledescription="carrossel"
      aria-label="Fotografias do Instituto"
      className={`relative overflow-hidden rounded-2xl bg-creme ${proporcoes[proporcao]} ${className}`}
      onMouseEnter={() => setInteragindo(true)}
      onMouseLeave={() => setInteragindo(false)}
      onFocusCapture={() => setInteragindo(true)}
      onBlurCapture={() => setInteragindo(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          avancar();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          voltar();
        }
      }}
    >
      {fotos.map((foto, i) => (
        <div
          key={foto.arquivo}
          aria-hidden={i !== indice}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === indice ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={foto.arquivo}
            alt={foto.alt}
            fill
            sizes={tamanhos}
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}

      {fotos[indice].legenda && (
        <p className="pointer-events-none absolute inset-x-0 bottom-14 px-5 text-sm font-medium text-white drop-shadow">
          {fotos[indice].legenda}
        </p>
      )}

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-tinta/75 to-transparent px-4 pb-4 pt-12">
          {/*
            O botão tem 24x24 e é transparente; o pontinho visível fica dentro.
            O WCAG 2.2 (critério 2.5.8) exige alvo de toque de pelo menos
            24x24 px, e um ponto de 10px reprova — quem tem pouca firmeza na
            mão, ou usa o site no celular, erra o alvo. A aparência não muda.
          */}
          <div className="flex gap-2">
            {fotos.map((foto, i) => (
              <button
                key={foto.arquivo}
                type="button"
                onClick={() => {
                  setIndice(i);
                  setTocando(false);
                }}
                aria-label={`Ir para a fotografia ${i + 1} de ${total}`}
                aria-current={i === indice ? "true" : undefined}
                className="flex h-6 min-w-6 items-center justify-center"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    i === indice ? "w-7 bg-white" : "w-2.5 bg-white/55 hover:bg-white/85"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={voltar} aria-label="Fotografia anterior" className={botao}>
              <Icone nome="seta" className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setTocando((v) => !v)}
              aria-label={tocando ? "Pausar a troca automática de fotos" : "Retomar a troca automática de fotos"}
              className={botao}
            >
              <Icone nome={tocando ? "pausar" : "tocar"} className="h-4 w-4" />
            </button>
            <button type="button" onClick={avancar} aria-label="Próxima fotografia" className={botao}>
              <Icone nome="seta" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live={tocando ? "off" : "polite"}>
        Fotografia {indice + 1} de {total}
      </p>
    </div>
  );
}
