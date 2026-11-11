"use client";

import Image from "next/image";
import { useState } from "react";
import { Icone } from "@/components/ui/Icone";
import { criarClienteNavegador } from "@/lib/supabase/navegador";

const BUCKET = "midias";
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANHO_MAXIMO = 10 * 1024 * 1024;

export type FotoEscolhida = {
  caminho: string;
  alt: string;
  /** Só para a prévia; não vai no formulário. */
  nomeOriginal: string;
};

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
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base || "foto"}.${extensao}`;
}

/**
 * Envio de fotos dentro do formulário em que a pessoa já está.
 *
 * O arquivo sobe para o armazenamento ASSIM QUE É ESCOLHIDO, direto do
 * navegador, e o formulário carrega só o endereço resultante. São dois
 * motivos: Server Action tem limite de 1 MB de corpo, que uma galeria estoura
 * fácil; e assim a pessoa vê a miniatura e escreve a descrição enquanto
 * termina de redigir a notícia, em vez de descobrir no fim que algo falhou.
 *
 * A notícia ainda nem tem identificador quando as fotos sobem — é justamente
 * por isso que elas não são ligadas aqui. A ligação acontece no servidor,
 * depois que a notícia é gravada.
 */
export function EnvioDeFotos({
  nome,
  iniciais = [],
  umaSo = false,
}: {
  /** Prefixo dos campos: gera `<nome>_caminho` e `<nome>_alt`. */
  nome: string;
  iniciais?: FotoEscolhida[];
  umaSo?: boolean;
}) {
  const [fotos, setFotos] = useState<FotoEscolhida[]>(iniciais);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState({ feitas: 0, total: 0 });
  const [falhas, setFalhas] = useState<string[]>([]);

  async function escolher(lista: FileList | null) {
    const arquivos = Array.from(lista ?? []);
    if (arquivos.length === 0) return;

    setEnviando(true);
    setFalhas([]);
    setProgresso({ feitas: 0, total: arquivos.length });

    const supabase = criarClienteNavegador();
    const novas: FotoEscolhida[] = [];
    const erros: string[] = [];

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i];

      if (!TIPOS_ACEITOS.includes(arquivo.type)) {
        erros.push(`${arquivo.name} — formato não aceito`);
      } else if (arquivo.size > TAMANHO_MAXIMO) {
        erros.push(`${arquivo.name} — passa de 10 MB`);
      } else {
        const destino = nomeNoArmazenamento(arquivo.name);
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(destino, arquivo, { contentType: arquivo.type, upsert: false });

        if (error) {
          erros.push(`${arquivo.name} — ${error.message}`);
        } else {
          const { data } = supabase.storage.from(BUCKET).getPublicUrl(destino);
          novas.push({ caminho: data.publicUrl, alt: "", nomeOriginal: arquivo.name });
        }
      }
      setProgresso({ feitas: i + 1, total: arquivos.length });
    }

    setFotos((atuais) => (umaSo ? novas.slice(0, 1) : [...atuais, ...novas]));
    setFalhas(erros);
    setEnviando(false);
  }

  const mudarAlt = (i: number, alt: string) =>
    setFotos((atuais) => atuais.map((f, j) => (j === i ? { ...f, alt } : f)));

  const remover = (i: number) => setFotos((atuais) => atuais.filter((_, j) => j !== i));

  return (
    <div>
      <input
        type="file"
        multiple={!umaSo}
        accept="image/jpeg,image/png,image/webp,image/avif"
        disabled={enviando}
        onChange={(e) => {
          void escolher(e.target.files);
          e.target.value = "";
        }}
        className="w-full rounded-xl border border-linha bg-areia px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-bordo file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />

      {enviando && (
        <p className="mt-3 text-sm font-semibold" role="status" aria-live="polite">
          Enviando {progresso.feitas} de {progresso.total}…
        </p>
      )}

      {falhas.length > 0 && (
        <ul className="mt-3 list-inside list-disc rounded-xl bg-bordo-suave px-4 py-3 text-sm text-bordo-escuro">
          {falhas.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      {fotos.length > 0 && (
        <ul className="mt-4 space-y-3">
          {fotos.map((foto, i) => (
            <li
              key={foto.caminho}
              className="flex gap-4 rounded-xl border border-linha bg-areia p-3"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-creme">
                <Image src={foto.caminho} alt="" fill sizes="80px" className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <input type="hidden" name={`${nome}_caminho`} value={foto.caminho} />
                <label className="block text-xs font-semibold">
                  Descrição da imagem
                  <input
                    name={`${nome}_alt`}
                    required
                    value={foto.alt}
                    onChange={(e) => mudarAlt(i, e.target.value)}
                    placeholder="ex.: Crianças do coral cantando no palco"
                    className="mt-1 w-full rounded-lg border border-linha bg-white px-3 py-2 text-sm font-normal"
                  />
                </label>
                <p className="mt-1 text-xs text-tinta-suave">
                  É o que uma pessoa cega ouve no lugar da foto. Obrigatória.
                </p>
              </div>

              <button
                type="button"
                onClick={() => remover(i)}
                aria-label={`Remover ${foto.nomeOriginal}`}
                className="h-8 shrink-0 self-start rounded-full px-3 text-sm font-semibold text-tinta-suave hover:text-bordo"
              >
                <Icone nome="fechar" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
