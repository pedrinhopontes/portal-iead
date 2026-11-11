import type { Metadata } from "next";
import { FormularioAreas, type LinhaDeArea } from "./FormularioAreas";
import { Icone } from "@/components/ui/Icone";
import { areasOcultas, AREAS_OCULTAVEIS } from "@/lib/dados/areas";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export const metadata: Metadata = { title: "O que aparece no site" };
export const dynamic = "force-dynamic";

/** Quantas linhas publicadas existem por trás de cada área. */
async function contagens() {
  const supabase = await criarClienteServidor();
  const contar = async (tabela: string) => {
    const { count } = await supabase.from(tabela).select("*", { count: "exact", head: true });
    return count ?? 0;
  };

  const [projetos, noticias, documentos, campanhas, anos] = await Promise.all([
    contar("projetos"),
    contar("noticias"),
    contar("transparencia_documentos"),
    contar("campanhas"),
    contar("timeline_anos"),
  ]);

  return { projetos, noticias, documentos, campanhas, anos };
}

export default async function Areas() {
  const [ocultas, n] = await Promise.all([areasOcultas(), contagens()]);

  const plural = (q: number, um: string, muitos: string) =>
    `${q} ${q === 1 ? um : muitos}`;

  const situacoes: Record<string, { texto: string; vazia: boolean }> = {
    "/projetos": { texto: plural(n.projetos, "projeto", "projetos"), vazia: n.projetos === 0 },
    "/noticias": { texto: plural(n.noticias, "notícia", "notícias"), vazia: n.noticias === 0 },
    "/transparencia": {
      texto: plural(n.documentos, "documento", "documentos"),
      vazia: n.documentos === 0,
    },
    "/apadrinhamento": {
      texto: plural(n.campanhas, "campanha", "campanhas"),
      vazia: n.campanhas === 0,
    },
    "/nossa-historia": { texto: plural(n.anos, "ano", "anos"), vazia: n.anos === 0 },
    "/quem-somos": { texto: "texto fixo", vazia: false },
    "/seja-filiado": { texto: "formulário", vazia: false },
  };

  const areas: LinhaDeArea[] = AREAS_OCULTAVEIS.map((item) => {
    const s = situacoes[item.href] ?? { texto: "—", vazia: false };
    return {
      ...item,
      visivel: !ocultas.includes(item.href),
      situacao: s.texto,
      vazia: s.vazia,
    };
  });

  const escondidasEComConteudo = areas.filter((a) => !a.visivel && !a.vazia).length;
  const visiveisEVazias = areas.filter((a) => a.visivel && a.vazia);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold">O que aparece no site</h1>
      <p className="mt-1 text-sm text-tinta-suave">
        Desmarque uma área para tirá-la do menu enquanto ela ainda não tem conteúdo. Uma aba que
        leva a uma página vazia é pior do que aba nenhuma: quem clica conclui que o Instituto não
        tem projetos, ou não presta contas.
      </p>

      <div className="mt-6 rounded-2xl border border-linha bg-areia p-5 text-sm text-tinta-suave">
        <p className="flex items-start gap-2">
          <Icone nome="cadeado" className="mt-0.5 h-4 w-4 shrink-0 text-verde-escuro" />
          <span>
            Desmarcar <strong className="font-semibold text-tinta">não apaga nada</strong>. A área
            sai do menu, do rodapé, do mapa do site e da página inicial. O endereço continua
            funcionando para quem já tem o link, e basta marcar de novo para ela voltar.
          </span>
        </p>
        <p className="mt-3">
          <strong className="font-semibold text-tinta">Início</strong> e{" "}
          <strong className="font-semibold text-tinta">Contato</strong> não entram na lista: um site
          sem porta de entrada e sem forma de falar com o Instituto não serve para nada.
        </p>
      </div>

      {visiveisEVazias.length > 0 && (
        <p className="mt-5 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong className="font-semibold">
            {visiveisEVazias.length === 1
              ? "Uma área está no menu e ainda vazia:"
              : `${visiveisEVazias.length} áreas estão no menu e ainda vazias:`}
          </strong>{" "}
          {visiveisEVazias.map((a) => a.rotulo).join(", ")}. É uma sugestão, não um impedimento —
          quem decide é o Instituto.
        </p>
      )}

      {escondidasEComConteudo > 0 && (
        <p className="mt-5 rounded-2xl bg-bordo-suave px-5 py-4 text-sm text-bordo-escuro">
          <strong className="font-semibold">
            {escondidasEComConteudo === 1
              ? "Uma área tem conteúdo e está escondida."
              : `${escondidasEComConteudo} áreas têm conteúdo e estão escondidas.`}
          </strong>{" "}
          Vale conferir se é mesmo a intenção.
        </p>
      )}

      <FormularioAreas areas={areas} />
    </div>
  );
}
