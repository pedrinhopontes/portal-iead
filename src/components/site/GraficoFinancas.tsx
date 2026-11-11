import { Icone } from "@/components/ui/Icone";
import { formatarCompacto, formatarReal, type ResumoAnual } from "@/lib/dados/transparencia-tipos";

/**
 * Receitas e despesas por ano.
 *
 * As duas cores foram escolhidas rodando o validador de paleta, não a olho.
 * O par verde/vermelho — que seria o intuitivo para dinheiro que entra e sai —
 * falha para quem tem daltonismo vermelho-verde: a separação ficava em ΔE 6,9,
 * no limite do aceitável. O azul institucional dá 21,6, três vezes o mínimo.
 *
 * A cor nunca é a única pista: a legenda nomeia as séries, o ano mais recente
 * tem os valores escritos, cada barra responde ao passar o mouse e os mesmos
 * números estão na tabela logo abaixo.
 */
const COR_RECEITA = "#1c8214";
const COR_DESPESA = "#1f6aa8";

const LARGURA = 880;
const ALTURA = 320;
const MARGEM = { topo: 40, base: 46, esquerda: 78, direita: 24 };
const LARGURA_MAXIMA_BARRA = 44;
const ESPACO_ENTRE_BARRAS = 2;

/** Barra com os cantos de cima arredondados, ancorada na linha de base. */
function caminhoDaBarra(x: number, y: number, largura: number, altura: number): string {
  const raio = Math.min(4, Math.max(0, altura), largura / 2);
  const base = y + altura;
  return [
    `M ${x} ${base}`,
    `L ${x} ${y + raio}`,
    `Q ${x} ${y} ${x + raio} ${y}`,
    `L ${x + largura - raio} ${y}`,
    `Q ${x + largura} ${y} ${x + largura} ${y + raio}`,
    `L ${x + largura} ${base}`,
    "Z",
  ].join(" ");
}

/** Escolhe um topo "redondo" para o eixo, para as linhas de grade caírem em valores legíveis. */
function tetoDoEixo(maior: number): number {
  if (maior <= 0) return 1000;
  const ordem = 10 ** Math.floor(Math.log10(maior));
  return Math.ceil(maior / (ordem / 2)) * (ordem / 2);
}

export function GraficoFinancas({ dados }: { dados: ResumoAnual[] }) {
  if (dados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-tinta/20 px-6 py-20 text-center">
        <Icone nome="grafico" className="h-10 w-10 text-tinta/30" />
        <p className="text-lg font-semibold">Ainda não há dados financeiros publicados</p>
        <p className="max-w-lg text-sm text-tinta-suave">
          Nenhum balanço, valor ou demonstração foi criado para este portal. O gráfico aparece assim
          que o Instituto registrar os valores conferidos pela contabilidade.
        </p>
      </div>
    );
  }

  const maior = Math.max(...dados.flatMap((d) => [d.receitas, d.despesas]));
  const teto = tetoDoEixo(maior);

  const larguraPlot = LARGURA - MARGEM.esquerda - MARGEM.direita;
  const alturaPlot = ALTURA - MARGEM.topo - MARGEM.base;
  const linhaBase = MARGEM.topo + alturaPlot;

  const larguraGrupo = larguraPlot / dados.length;
  const larguraBarra = Math.min(LARGURA_MAXIMA_BARRA, (larguraGrupo - 24) / 2 - ESPACO_ENTRE_BARRAS);

  const alturaDe = (valor: number) => (teto === 0 ? 0 : (valor / teto) * alturaPlot);
  const grades = [0, 0.25, 0.5, 0.75, 1];

  const totalReceitas = dados.reduce((s, d) => s + d.receitas, 0);
  const totalDespesas = dados.reduce((s, d) => s + d.despesas, 0);
  const anoMaisRecente = dados[dados.length - 1].ano;

  return (
    <figure>
      {/* Legenda: para duas séries ela é obrigatória, e a cor nunca fica sozinha. */}
      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ backgroundColor: COR_RECEITA }} />
          <span className="font-semibold">Receitas</span>
          <span className="text-tinta-suave">{formatarReal(totalReceitas)} no período</span>
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ backgroundColor: COR_DESPESA }} />
          <span className="font-semibold">Despesas</span>
          <span className="text-tinta-suave">{formatarReal(totalDespesas)} no período</span>
        </span>
      </figcaption>

      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          role="img"
          aria-label={`Gráfico de barras com receitas e despesas de ${dados[0].ano} a ${anoMaisRecente}. Os mesmos números estão na tabela abaixo.`}
          className="h-80 w-full min-w-[520px]"
        >
          {/* Grade e eixo, recessivos */}
          {grades.map((fracao) => {
            const y = linhaBase - fracao * alturaPlot;
            return (
              <g key={fracao}>
                <line
                  x1={MARGEM.esquerda}
                  x2={LARGURA - MARGEM.direita}
                  y1={y}
                  y2={y}
                  stroke="#dedcc9"
                  strokeWidth={1}
                />
                <text
                  x={MARGEM.esquerda - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-tinta-suave text-[11px]"
                >
                  {formatarCompacto(teto * fracao)}
                </text>
              </g>
            );
          })}

          {dados.map((ano) => {
            const centro = MARGEM.esquerda + dados.indexOf(ano) * larguraGrupo + larguraGrupo / 2;
            const xReceita = centro - larguraBarra - ESPACO_ENTRE_BARRAS / 2;
            const xDespesa = centro + ESPACO_ENTRE_BARRAS / 2;

            const hReceita = alturaDe(ano.receitas);
            const hDespesa = alturaDe(ano.despesas);

            // Rótulo direto só no ano mais recente: número em cima de toda barra
            // vira ruído, e os demais valores estão na tabela e ao passar o mouse.
            const rotular = ano.ano === anoMaisRecente;

            return (
              <g key={ano.ano}>
                <path
                  d={caminhoDaBarra(xReceita, linhaBase - hReceita, larguraBarra, hReceita)}
                  fill={COR_RECEITA}
                >
                  <title>{`${ano.ano} · Receitas: ${formatarReal(ano.receitas)}`}</title>
                </path>
                <path
                  d={caminhoDaBarra(xDespesa, linhaBase - hDespesa, larguraBarra, hDespesa)}
                  fill={COR_DESPESA}
                >
                  <title>{`${ano.ano} · Despesas: ${formatarReal(ano.despesas)}`}</title>
                </path>

                {rotular && (
                  <>
                    {/* Valores em tinta neutra, nunca na cor da série.
                        Um rótulo cresce para a esquerda e o outro para a direita,
                        a partir do meio do grupo: assim nunca se sobrepõem, mesmo
                        quando as duas barras têm quase a mesma altura. */}
                    <text
                      x={centro - 5}
                      y={linhaBase - hReceita - 10}
                      textAnchor="end"
                      className="fill-tinta text-[11px] font-semibold"
                    >
                      {formatarCompacto(ano.receitas)}
                    </text>
                    <text
                      x={centro + 5}
                      y={linhaBase - hDespesa - 10}
                      textAnchor="start"
                      className="fill-tinta text-[11px] font-semibold"
                    >
                      {formatarCompacto(ano.despesas)}
                    </text>
                  </>
                )}

                <text
                  x={centro}
                  y={linhaBase + 24}
                  textAnchor="middle"
                  className={`text-[13px] ${rotular ? "fill-tinta font-bold" : "fill-tinta-suave font-semibold"}`}
                >
                  {ano.ano}
                </text>
              </g>
            );
          })}

          <line
            x1={MARGEM.esquerda}
            x2={LARGURA - MARGEM.direita}
            y1={linhaBase}
            y2={linhaBase}
            stroke="#1f2420"
            strokeWidth={1.5}
          />
        </svg>
      </div>

      <p className="mt-2 text-xs text-tinta-suave">
        Os valores do ano mais recente estão escritos no gráfico. Para os demais, passe o mouse sobre a
        barra ou abra a tabela.
      </p>

      {/* Mesmos números em tabela: quem não enxerga o gráfico não fica sem a informação. */}
      <details className="mt-5 rounded-xl border border-linha bg-white">
        <summary className="cursor-pointer px-5 py-3 text-sm font-semibold">
          Ver todos os números em tabela
        </summary>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full text-sm">
            <caption className="sr-only">Receitas e despesas por ano</caption>
            <thead className="border-b border-linha text-left">
              <tr>
                <th scope="col" className="py-2 font-semibold">Ano</th>
                <th scope="col" className="py-2 text-right font-semibold">Receitas</th>
                <th scope="col" className="py-2 text-right font-semibold">Despesas</th>
                <th scope="col" className="py-2 text-right font-semibold">Diferença</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((ano) => (
                <tr key={ano.ano} className="border-b border-linha/60 last:border-0">
                  <th scope="row" className="py-2 text-left font-semibold">{ano.ano}</th>
                  <td className="py-2 text-right">{formatarReal(ano.receitas)}</td>
                  <td className="py-2 text-right">{formatarReal(ano.despesas)}</td>
                  <td className="py-2 text-right text-tinta-suave">
                    {formatarReal(ano.receitas - ano.despesas)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
