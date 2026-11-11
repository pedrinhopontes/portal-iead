"use client";

import { useActionState, useState } from "react";
import { salvarDocumento, salvarLancamento, type EstadoTransparencia } from "./acoes";
import { categorias, categoriaPorSlug } from "@/lib/dados/transparencia-tipos";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioDocumento() {
  const [estado, acao, enviando] = useActionState<EstadoTransparencia, FormData>(salvarDocumento, {});
  const [categoria, setCategoria] = useState(categorias[0].slug);

  const tipos = categoriaPorSlug(categoria)?.tipos ?? [];

  return (
    <form action={acao} className="rounded-2xl border border-linha bg-white p-7">
      <h2 className="font-semibold">Publicar um documento</h2>
      <p className="mt-1 text-sm text-tinta-suave">
        PDF, JPG ou PNG, até 15 MB. O documento fica público assim que você salvar.
      </p>

      <div className="mt-5 space-y-5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Título
          <input
            name="titulo"
            required
            placeholder="Estatuto Social 2024"
            className={campo}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Categoria
            <select
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as typeof categoria)}
              className={campo}
            >
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Tipo
            <select name="tipo" required className={campo}>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Ano
            <input type="number" name="ano" min={2000} max={2100} className={campo} />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Arquivo
            <input
              type="file"
              name="arquivo"
              required
              accept="application/pdf,image/jpeg,image/png"
              className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-bordo file:px-5 file:py-2.5 file:font-semibold file:text-white hover:file:bg-bordo-escuro"
            />
          </label>
        </div>
      </div>

      {estado.erro && (
        <p role="alert" className="mt-5 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}
      {estado.salvo && (
        <p role="status" className="mt-5 rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro">
          Documento publicado. Já aparece no Portal da Transparência.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Publicar documento"}
      </button>
    </form>
  );
}

export function FormularioLancamento({ anoSugerido }: { anoSugerido: number }) {
  const [estado, acao, enviando] = useActionState<EstadoTransparencia, FormData>(salvarLancamento, {});

  return (
    <form action={acao} className="rounded-2xl border border-linha bg-white p-7">
      <h2 className="font-semibold">Lançar um valor</h2>
      <p className="mt-1 text-sm text-tinta-suave">
        Valores agregados por ano e categoria — nunca lançamento individual, nunca nome de doador. É
        daqui que sai o gráfico.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-[120px_1fr_150px]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ano
          <input type="number" name="ano" required min={2000} max={2100} defaultValue={anoSugerido} className={campo} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Categoria
          <input name="categoria" required placeholder="Doações, Parcerias, Pessoal…" className={campo} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Natureza
          <select name="natureza" required className={campo}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Valor
          <input name="valor" required inputMode="decimal" placeholder="12500,00" className={campo} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          De qual documento este valor saiu
          <input
            name="fonte"
            required
            placeholder="Balanço 2025, página 3"
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Obrigatório. Número publicado sem fonte não pode ser conferido por ninguém.
          </span>
        </label>
      </div>

      {estado.erro && (
        <p role="alert" className="mt-5 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}
      {estado.salvo && (
        <p role="status" className="mt-5 rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro">
          Valor salvo. O gráfico da Transparência já reflete a mudança.
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 rounded-full bg-verde-escuro px-6 py-3 font-bold text-white hover:bg-tinta disabled:opacity-60"
      >
        {enviando ? "Salvando…" : "Salvar valor"}
      </button>
    </form>
  );
}
