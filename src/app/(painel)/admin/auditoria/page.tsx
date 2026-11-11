import type { Metadata } from "next";
import { Icone } from "@/components/ui/Icone";
import { formatarDataHora } from "@/lib/dados/painel-apadrinhamento";
import { listarAuditoria } from "@/lib/dados/painel-conteudo";

export const metadata: Metadata = { title: "Registro de alterações" };
export const dynamic = "force-dynamic";

const rotuloOperacao: Record<string, { texto: string; cor: string }> = {
  INSERT: { texto: "criou", cor: "bg-verde-suave text-verde-escuro" },
  UPDATE: { texto: "alterou", cor: "bg-ardosia/10 text-ardosia" },
  DELETE: { texto: "apagou", cor: "bg-bordo-suave text-bordo-escuro" },
};

const nomeDaTabela: Record<string, string> = {
  noticias: "notícia",
  projetos: "projeto",
  timeline_anos: "ano da linha do tempo",
  midias: "foto",
  midia_slots: "posição de foto",
  parceiros: "parceiro",
  depoimentos: "depoimento",
  indicadores: "indicador",
  campanhas: "campanha",
  participantes: "participante",
  participantes_dados_restritos: "dados restritos de participante",
  apadrinhamentos: "apadrinhamento",
  usuarios_admin: "usuário do painel",
  site_settings: "configuração do site",
};

export default async function Auditoria() {
  const registros = await listarAuditoria(150);

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold">Registro de alterações</h1>
      <p className="mt-2 text-sm text-tinta-suave">
        Quem mudou o quê e quando. O registro é gravado pelo próprio banco e ninguém consegue editá-lo
        ou apagá-lo pelo painel — nem administradores.
      </p>

      {registros.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-tinta/20 p-10 text-center text-tinta-suave">
          Nenhuma alteração registrada ainda.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {registros.map((registro) => {
            const operacao = rotuloOperacao[registro.operacao] ?? {
              texto: registro.operacao,
              cor: "bg-creme text-tinta-suave",
            };

            return (
              <li
                key={registro.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-linha bg-white px-5 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${operacao.cor}`}
                  >
                    {operacao.texto}
                  </span>
                  <span className="font-semibold">
                    {nomeDaTabela[registro.tabela] ?? registro.tabela}
                  </span>
                  <span className="text-tinta-suave">
                    por {registro.usuario_email ?? "sistema"}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-tinta-suave">
                  <Icone nome="relogio" className="h-3.5 w-3.5" />
                  {formatarDataHora(registro.em)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-xs text-tinta-suave">
        Mostrando as {registros.length} alterações mais recentes. O registro completo, com o conteúdo
        anterior e posterior de cada mudança, fica na tabela <code>log_auditoria</code> do banco.
      </p>
    </div>
  );
}
