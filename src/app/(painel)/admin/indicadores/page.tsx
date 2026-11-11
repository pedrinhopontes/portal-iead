import type { Metadata } from "next";
import { FormularioIndicadores } from "./FormularioIndicadores";
import { Aviso } from "@/components/ui/Aviso";
import { listarIndicadoresPainel } from "@/lib/dados/painel-conteudo";

export const metadata: Metadata = { title: "Indicadores" };
export const dynamic = "force-dynamic";

export default async function Indicadores() {
  const indicadores = await listarIndicadoresPainel();
  const pendentes = indicadores.filter((i) => !i.verificado).length;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold">Indicadores de impacto</h1>
      <p className="mt-2 text-sm text-tinta-suave">
        Os números que aparecem na página inicial.
      </p>

      <Aviso titulo="Por que o site pede a fonte de cada número" tom="protecao" className="mt-6">
        Um número de impacto num site institucional é lido como compromisso: empresas, editais e órgãos
        públicos tomam decisão com base nele. Por isso o banco não aceita marcar um indicador como
        conferido sem registrar de onde ele saiu. Não é burocracia — é o que permite defender o número
        se alguém perguntar.
      </Aviso>

      {pendentes > 0 && (
        <p className="mt-4 text-sm text-amber-800">
          {pendentes} {pendentes === 1 ? "indicador está" : "indicadores estão"} aguardando dado
          verificado e {pendentes === 1 ? "aparece" : "aparecem"} como travessão na home.
        </p>
      )}

      <div className="mt-8">
        <FormularioIndicadores indicadores={indicadores} />
      </div>
    </div>
  );
}
