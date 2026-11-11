"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registrarFotosEnviadas, type FotoEnviada } from "./acoes";
import { Icone } from "@/components/ui/Icone";
import { criarClienteNavegador } from "@/lib/supabase/navegador";

const BUCKET = "midias";
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANHO_MAXIMO = 10 * 1024 * 1024;

/** Nome seguro no armazenamento, mantendo o original reconhecível. */
function nomeNoArmazenamento(original: string): string {
  const partes = original.split(".");
  const extensao = (partes.length > 1 ? partes.pop() : "jpg")!.toLowerCase();
  const base = partes
    .join("-")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${Date.now()}-${base || "foto"}.${extensao}`;
}

type Resultado = { ligadas: number; semPar: string[]; falhas: string[] };

export function FormularioFotos({
  campanhaId,
  pendentes,
}: {
  campanhaId: string;
  pendentes: number;
}) {
  const router = useRouter();
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  async function enviar() {
    setEnviando(true);
    setErro(null);
    setResultado(null);
    setProgresso(0);

    const supabase = criarClienteNavegador();
    const enviadas: FotoEnviada[] = [];
    const falhas: string[] = [];

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i];

      if (!TIPOS_ACEITOS.includes(arquivo.type)) {
        falhas.push(`${arquivo.name} — formato não aceito`);
      } else if (arquivo.size > TAMANHO_MAXIMO) {
        falhas.push(`${arquivo.name} — passa de 10 MB`);
      } else {
        // Calculado UMA vez: o nome leva `Date.now()`, e gerar de novo depois
        // do envio daria um nome diferente e uma URL para um arquivo que não
        // existe.
        const nome = nomeNoArmazenamento(arquivo.name);

        const { error } = await supabase.storage.from(BUCKET).upload(nome, arquivo, {
          contentType: arquivo.type,
          upsert: false,
        });

        if (error) {
          falhas.push(`${arquivo.name} — ${error.message}`);
        } else {
          // O nome ORIGINAL é o que casa com o cadastro; a URL é o destino.
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(nome);
          enviadas.push({ arquivo: arquivo.name, url: data.publicUrl });
        }
      }

      setProgresso(i + 1);
    }

    if (enviadas.length === 0) {
      setErro("Nenhuma foto chegou ao armazenamento.");
      setResultado({ ligadas: 0, semPar: [], falhas });
      setEnviando(false);
      return;
    }

    const r = await registrarFotosEnviadas(campanhaId, enviadas);

    if (r.erro) setErro(r.erro);
    setResultado({ ligadas: r.ligadas ?? 0, semPar: r.semPar ?? [], falhas });
    setEnviando(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-linha bg-white p-7">
      <label className="flex flex-col gap-2 text-sm font-semibold">
        Escolha as fotos
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={enviando}
          onChange={(e) => {
            setArquivos(Array.from(e.target.files ?? []));
            setResultado(null);
            setErro(null);
          }}
          className="w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal file:mr-4 file:rounded-full file:border-0 file:bg-bordo file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
        />
        <span className="text-xs font-normal text-tinta-suave">
          Pode selecionar todas de uma vez. Cada foto encontra a criança certa pelo nome do arquivo —
          não renomeie os arquivos.
        </span>
      </label>

      {arquivos.length > 0 && !enviando && !resultado && (
        <p className="mt-4 text-sm text-tinta-suave">
          <strong className="font-semibold text-tinta">{arquivos.length}</strong>{" "}
          {arquivos.length === 1 ? "arquivo escolhido" : "arquivos escolhidos"}
          {pendentes > 0 && ` · ${pendentes} esperando envio`}
        </p>
      )}

      {enviando && (
        <div className="mt-5" role="status" aria-live="polite">
          <p className="text-sm font-semibold">
            Enviando {progresso} de {arquivos.length}…
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-creme">
            <div
              className="h-full bg-verde transition-[width]"
              style={{ width: `${(progresso / arquivos.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {erro && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro"
        >
          {erro}
        </p>
      )}

      {resultado && (
        <div role="status" className="mt-5 space-y-3">
          {resultado.ligadas > 0 && (
            <p className="rounded-xl bg-verde-suave px-4 py-3 text-sm font-semibold text-verde-escuro">
              <Icone nome="check" className="mr-2 inline h-4 w-4" />
              {resultado.ligadas}{" "}
              {resultado.ligadas === 1 ? "foto ligada" : "fotos ligadas"} ao participante.
            </p>
          )}

          {resultado.semPar.length > 0 && (
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">
                {resultado.semPar.length}{" "}
                {resultado.semPar.length === 1 ? "arquivo não encontrou par" : "arquivos não encontraram par"}:
              </p>
              <ul className="mt-2 list-inside list-disc">
                {resultado.semPar.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className="mt-2">
                Isso acontece quando o nome do arquivo não corresponde a nenhuma foto cadastrada.
                Nada foi criado solto.
              </p>
            </div>
          )}

          {resultado.falhas.length > 0 && (
            <div className="rounded-xl bg-bordo-suave px-4 py-3 text-sm text-bordo-escuro">
              <p className="font-semibold">
                {resultado.falhas.length}{" "}
                {resultado.falhas.length === 1 ? "arquivo falhou" : "arquivos falharam"} no envio:
              </p>
              <ul className="mt-2 list-inside list-disc">
                {resultado.falhas.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={enviar}
        disabled={enviando || arquivos.length === 0}
        className="mt-6 rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Enviar as fotos"}
      </button>
    </div>
  );
}
