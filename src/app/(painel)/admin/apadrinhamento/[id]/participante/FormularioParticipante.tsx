"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { excluirParticipante, salvarParticipante, type EstadoForm } from "../../acoes";
import { Icone } from "@/components/ui/Icone";
import type { ParticipanteAdmin } from "@/lib/dados/painel-apadrinhamento";

const campo = "w-full rounded-xl border border-linha bg-areia px-4 py-3 font-normal";

export function FormularioParticipante({
  campanhaId,
  participante,
  proximoCodigo,
}: {
  campanhaId: string;
  participante: ParticipanteAdmin | null;
  proximoCodigo: string;
}) {
  const [estado, acao, enviando] = useActionState<EstadoForm, FormData>(salvarParticipante, {});
  const restritos = participante?.participantes_dados_restritos ?? null;

  return (
    <form action={acao} className="max-w-3xl space-y-8">
      <input type="hidden" name="campanha_id" value={campanhaId} />
      {participante && <input type="hidden" name="id" value={participante.id} />}

      {/* ---------- Público ---------- */}
      <fieldset className="rounded-2xl border border-linha bg-white p-7">
        <legend className="px-2 text-sm font-bold uppercase tracking-wider text-verde-escuro">
          Aparece no site
        </legend>

        <p className="text-sm text-tinta-suave">
          Tudo neste bloco fica visível para qualquer visitante da lista.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_180px]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Primeiro nome
            <input
              name="nome_exibicao"
              defaultValue={participante?.nome_exibicao ?? ""}
              placeholder="ex.: Ana Beatriz"
              className={campo}
            />
            <span className="text-xs font-normal text-tinta-suave">
              É assim que a criança aparece no site. Só o primeiro nome — o nome completo vai no bloco
              vermelho abaixo e nunca sai de lá.
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Código interno
            <input
              name="codigo_publico"
              required
              defaultValue={participante?.codigo_publico ?? proximoCodigo}
              className={`${campo} font-mono`}
            />
            <span className="text-xs font-normal text-tinta-suave">
              Usado para organizar a entrega. Não aparece no site.
            </span>
          </label>
        </div>

        <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
          Projeto
          <input name="projeto" defaultValue={participante?.projeto ?? ""} className={campo} />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Idade
            <input
              type="number"
              name="idade"
              min={0}
              max={25}
              defaultValue={participante?.idade ?? ""}
              className={campo}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Gênero
            <select name="genero" defaultValue={participante?.genero ?? "nao_informado"} className={campo}>
              <option value="nao_informado">Não informar</option>
              <option value="menina">Menina</option>
              <option value="menino">Menino</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Tamanho da roupa
            <input name="tamanho_roupa" defaultValue={participante?.tamanho_roupa ?? ""} className={campo} />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Calçado
            <input
              name="tamanho_calcado"
              defaultValue={participante?.tamanho_calcado ?? ""}
              className={campo}
            />
          </label>
        </div>

        <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
          O que gostaria de ganhar
          <input
            name="sugestao_presente"
            defaultValue={participante?.sugestao_presente ?? ""}
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Deixe em branco se ainda não foi definido: o site mostra &quot;a combinar&quot;.
          </span>
        </label>

        <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
          Recado da criança
          <input
            name="observacao_publica"
            placeholder="ex.: Não uso vestido"
            defaultValue={participante?.observacao_publica ?? ""}
            className={campo}
          />
          <span className="text-xs font-normal text-tinta-suave">
            Aparece no site, logo abaixo do nome. Serve para o que quem compra precisa saber antes de
            escolher o presente.
          </span>
        </label>
      </fieldset>

      {/* ---------- Restrito ---------- */}
      <fieldset className="rounded-2xl border-2 border-bordo/30 bg-bordo-suave p-7">
        <legend className="flex items-center gap-2 px-2 text-sm font-bold uppercase tracking-wider text-bordo-escuro">
          <Icone nome="cadeado" className="h-4 w-4" />
          Área restrita
        </legend>

        <p className="text-sm text-bordo-escuro">
          Nada deste bloco vai para o site. Fica em tabela separada do banco, que só administradores e
          coordenação conseguem ler.
        </p>

        <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
          Nome completo
          <input
            name="nome_completo"
            required
            defaultValue={restritos?.nome_completo ?? ""}
            className="w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
          />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Responsável
            <input
              name="responsavel"
              defaultValue={restritos?.responsavel ?? ""}
              className="w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Contato do responsável
            <input
              name="contato"
              defaultValue={restritos?.contato ?? ""}
              className="w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
            />
          </label>
        </div>

        <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
          Autorização de imagem
          <input
            name="autorizacao_imagem"
            placeholder="ex.: Termo coletivo Sementes II, 2026"
            defaultValue={restritos?.autorizacao_imagem ?? ""}
            className="w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
          />
          <span className="text-xs font-normal text-bordo-escuro">
            Qual termo assinado cobre as fotos desta criança. Sem isso, nenhuma foto dela pode ser
            publicada.
          </span>
        </label>

        <label className="mt-5 flex flex-col gap-1.5 text-sm font-semibold">
          Observações internas
          <textarea
            name="observacoes"
            rows={3}
            defaultValue={restritos?.observacoes ?? ""}
            className="w-full rounded-xl border border-bordo/20 bg-white px-4 py-3 font-normal"
          />
        </label>
      </fieldset>

      {estado.erro && (
        <p role="alert" className="rounded-xl bg-bordo-suave px-4 py-3 text-sm font-semibold text-bordo-escuro">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-full bg-bordo px-6 py-3 font-bold text-white hover:bg-bordo-escuro disabled:opacity-60"
        >
          {enviando ? "Salvando…" : "Salvar participante"}
        </button>
        <Link
          href={`/admin/apadrinhamento/${campanhaId}`}
          className="rounded-full border border-linha px-6 py-3 font-semibold hover:border-bordo hover:text-bordo"
        >
          Cancelar
        </Link>

        {participante && (
          <BotaoExcluirParticipante
            campanhaId={campanhaId}
            id={participante.id}
            codigo={participante.codigo_publico}
          />
        )}
      </div>
    </form>
  );
}

function BotaoExcluirParticipante({
  campanhaId,
  id,
  codigo,
}: {
  campanhaId: string;
  id: string;
  codigo: string;
}) {
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
        Excluir participante
      </button>
    );
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-2 rounded-xl bg-bordo-suave px-4 py-2">
      <span className="text-sm text-bordo-escuro">
        Apagar {codigo} e os dados dele? Não dá para desfazer.
      </span>
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          iniciar(async () => {
            await excluirParticipante(campanhaId, id);
            router.push(`/admin/apadrinhamento/${campanhaId}`);
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
