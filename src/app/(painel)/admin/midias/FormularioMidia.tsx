"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { excluirMidia, salvarMidia, type EstadoMidia } from "./acoes";
import { Icone } from "@/components/ui/Icone";
import type { MidiaComSlots } from "@/lib/dados/midias";
import type { GrupoDeSlots } from "@/lib/dados/slots";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";
const LADO_MAXIMO = 2400;

/**
 * Reduz a imagem no navegador antes de enviar.
 *
 * Foto de celular costuma ter 4000 pixels ou mais de lado e vários megabytes. O
 * site nunca exibe nada maior que 2400, então enviar o arquivo cru só gasta
 * armazenamento e a paciência de quem está num 4G ruim.
 */
async function reduzir(arquivo: File): Promise<File> {
  if (!arquivo.type.startsWith("image/")) return arquivo;

  try {
    const bitmap = await createImageBitmap(arquivo);
    const maiorLado = Math.max(bitmap.width, bitmap.height);
    const escala = Math.min(1, LADO_MAXIMO / maiorLado);

    // Já está pequena e leve: não mexe.
    if (escala === 1 && arquivo.size <= 2_000_000) {
      bitmap.close();
      return arquivo;
    }

    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;

    const contexto = canvas.getContext("2d");
    if (!contexto) return arquivo;

    contexto.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close();

    // PNG mantém PNG, para não perder transparência de logomarca.
    const manterPng = arquivo.type === "image/png";
    const tipo = manterPng ? "image/png" : "image/jpeg";

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, tipo, manterPng ? undefined : 0.85),
    );
    if (!blob || blob.size >= arquivo.size) return arquivo;

    const semExtensao = arquivo.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${semExtensao}.${manterPng ? "png" : "jpg"}`, { type: tipo });
  } catch {
    return arquivo;
  }
}

function formatarTamanho(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export function FormularioMidia({
  midia,
  grupos,
}: {
  midia: MidiaComSlots | null;
  grupos: GrupoDeSlots[];
}) {
  const [estado, acao, enviando] = useActionState<EstadoMidia, FormData>(salvarMidia, {});
  const [temMenores, setTemMenores] = useState(midia?.tem_menores ?? false);
  const [previa, setPrevia] = useState<string | null>(null);
  const [resumoArquivo, setResumoArquivo] = useState<string | null>(null);
  const [preparando, setPreparando] = useState(false);
  const entradaArquivo = useRef<HTMLInputElement>(null);

  const slotsAtuais = new Set((midia?.midia_slots ?? []).map((s) => s.slot));

  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa);
    };
  }, [previa]);

  async function aoEscolherArquivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const original = evento.target.files?.[0];
    if (!original) return;

    setPreparando(true);
    const reduzida = await reduzir(original);

    if (reduzida !== original) {
      // Substitui o arquivo do input pelo reduzido, para o formulário enviar esse.
      const transferencia = new DataTransfer();
      transferencia.items.add(reduzida);
      if (entradaArquivo.current) entradaArquivo.current.files = transferencia.files;
      setResumoArquivo(
        `${formatarTamanho(original.size)} → ${formatarTamanho(reduzida.size)} (reduzida no navegador)`,
      );
    } else {
      setResumoArquivo(formatarTamanho(original.size));
    }

    setPrevia(URL.createObjectURL(reduzida));
    setPreparando(false);
  }

  return (
    <form action={acao} className="max-w-3xl space-y-6">
      {midia && <input type="hidden" name="id" value={midia.id} />}

      {/* ---------- Arquivo ---------- */}
      <div className="rounded-2xl border border-linha bg-white p-7">
        <h2 className="font-semibold">{midia ? "Trocar a imagem" : "A imagem"}</h2>

        <input
          ref={entradaArquivo}
          type="file"
          name="arquivo"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={aoEscolherArquivo}
          className="mt-4 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-bordo file:px-5 file:py-2.5 file:font-semibold file:text-white hover:file:bg-bordo-escuro"
        />

        <p className="mt-2 text-xs text-tinta-suave">
          JPG, PNG, WebP ou AVIF. Pode mandar a foto original do celular: o navegador reduz para 2400
          pixels antes de enviar.
          {midia && " Deixe em branco para manter a imagem atual."}
        </p>

        {preparando && <p className="mt-3 text-sm font-semibold text-verde-escuro">Preparando a imagem…</p>}
        {resumoArquivo && !preparando && (
          <p className="mt-3 text-sm font-semibold text-verde-escuro">{resumoArquivo}</p>
        )}

        {(previa || midia) && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previa ?? midia!.caminho}
            alt=""
            className="mt-4 max-h-64 rounded-xl border border-linha object-contain"
          />
        )}
      </div>

      {/* ---------- Descrição ---------- */}
      <div className="rounded-2xl border border-linha bg-white p-7">
        <h2 className="font-semibold">Descrição</h2>

        <label className="mt-4 flex flex-col gap-1.5 text-sm font-semibold">
          O que aparece na foto
          <textarea name="alt" required rows={2} defaultValue={midia?.alt ?? ""} className={campo} />
          <span className="text-xs font-normal text-tinta-suave">
            Obrigatório. É o que uma pessoa cega ouve no lugar da imagem, e o que aparece se a foto não
            carregar. Descreva a cena: &quot;crianças do Sementes II sentadas em roda durante atividade de
            leitura&quot;, não &quot;foto 1&quot;.
          </span>
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1fr_120px]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Legenda visível
            <input name="legenda" defaultValue={midia?.legenda ?? ""} className={campo} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Crédito
            <input name="credito" defaultValue={midia?.credito ?? ""} className={campo} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Ano
            <input type="number" name="ano" min={1900} max={2100} defaultValue={midia?.ano ?? ""} className={campo} />
          </label>
        </div>
      </div>

      {/* ---------- Autorização ---------- */}
      <div
        className={`rounded-2xl border-2 p-7 transition-colors ${
          temMenores ? "border-bordo/40 bg-bordo-suave" : "border-linha bg-white"
        }`}
      >
        <h2 className="flex items-center gap-2 font-semibold">
          <Icone nome="cadeado" className="h-5 w-5 text-bordo" />
          Autorização de imagem
        </h2>

        <label className="mt-4 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="tem_menores"
            checked={temMenores}
            onChange={(e) => setTemMenores(e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            <strong className="font-semibold">Aparece criança ou adolescente nesta foto</strong>
            <span className="block text-tinta-suave">
              Marque mesmo que o rosto esteja parcialmente visível.
            </span>
          </span>
        </label>

        {temMenores && (
          <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
            Qual termo de autorização cobre esta foto
            <input
              name="autorizacao"
              required
              placeholder="ex.: Termo coletivo Sementes II, 2026"
              defaultValue={midia?.autorizacao ?? ""}
              className="w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
            />
            <span className="text-xs font-normal text-bordo-escuro">
              Sem isso o banco recusa o cadastro. Não é uma formalidade do sistema: é o que protege o
              Instituto e as famílias.
            </span>
          </label>
        )}

        {!temMenores && (
          <input type="hidden" name="autorizacao" value={midia?.autorizacao ?? ""} />
        )}
      </div>

      {/* ---------- Onde aparece ---------- */}
      <div className="rounded-2xl border border-linha bg-white p-7">
        <h2 className="font-semibold">Onde esta foto aparece no site</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Pode marcar mais de um lugar. Se outro arquivo já ocupava o lugar escolhido, ele é substituído.
        </p>

        <div className="mt-5 space-y-2">
          {grupos.map((grupo) => {
            const marcados = grupo.opcoes.filter((o) => slotsAtuais.has(o.slot)).length;
            return (
              <details
                key={grupo.grupo}
                open={marcados > 0}
                className="rounded-xl border border-linha bg-areia"
              >
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
                  {grupo.grupo}
                  {marcados > 0 && (
                    <span className="ml-2 rounded-full bg-bordo px-2 py-0.5 text-[11px] font-bold text-white">
                      {marcados}
                    </span>
                  )}
                </summary>
                <ul className="space-y-1 px-4 pb-4">
                  {grupo.opcoes.map((opcao) => (
                    <li key={opcao.slot}>
                      <label className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-white">
                        <input
                          type="checkbox"
                          name="slots"
                          value={opcao.slot}
                          defaultChecked={slotsAtuais.has(opcao.slot)}
                          className="h-4 w-4"
                        />
                        {opcao.rotulo}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </div>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enviando || preparando}
          className="rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar foto"}
        </button>
        <Link
          href="/admin/midias"
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>
        {midia && <BotaoExcluirMidia id={midia.id} />}
      </div>
    </form>
  );
}

function BotaoExcluirMidia({ id }: { id: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, iniciar] = useTransition();
  const router = useRouter();

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="ml-auto text-sm font-semibold text-tinta-suave hover:text-bordo hover:underline"
      >
        Excluir foto
      </button>
    );
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-2 rounded-xl bg-bordo-suave px-4 py-2">
      <span className="text-sm text-bordo-escuro">
        Apagar a foto e tirá-la de todos os lugares? Não dá para desfazer.
      </span>
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciar(async () => {
            await excluirMidia(id);
            router.push("/admin/midias");
          })
        }
        className="rounded-full bg-bordo px-4 py-1.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {pendente ? "Apagando…" : "Sim, apagar"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        className="rounded-full border border-bordo/40 px-4 py-1.5 text-sm font-semibold text-bordo-escuro"
      >
        Não
      </button>
    </div>
  );
}
