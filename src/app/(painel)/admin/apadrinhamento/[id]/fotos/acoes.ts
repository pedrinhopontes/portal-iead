"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/servidor";

/**
 * Registro das fotos enviadas em lote.
 *
 * O ARQUIVO NÃO PASSA POR AQUI. O navegador envia cada foto direto para o
 * armazenamento do Supabase, com a sessão de quem está logado, e esta ação
 * recebe só a lista de "nome do arquivo → URL". São dois motivos:
 *
 *   1. Server Action tem limite de 1 MB de corpo. 41 fotos somam 2,5 MB, e
 *      o envio falhava inteiro. Dava para levantar o limite no next.config,
 *      mas aí a próxima campanha com fotos maiores esbarraria de novo.
 *   2. Mandar megabytes para o servidor só para ele reenviar ao armazenamento
 *      é trabalho dobrado. O navegador já fala com o Supabase.
 *
 * COMO CASA CADA FOTO COM CADA CRIANÇA: pelo nome do arquivo, comparado com o
 * caminho que já está registrado no banco. `ana-beatriz.jpg` encontra a linha
 * de `midias` cujo caminho termina em `/ana-beatriz.jpg`, e troca esse caminho
 * pela URL do armazenamento.
 *
 * NÃO casa pelo nome da criança, e isso é de propósito. "João Victor de
 * Araujo" está registrado como `joao-victor-araujo`, sem o "de" — qualquer
 * regra de transformação de nome erraria nele. E há duas Valentinas, de 6 e 8
 * anos, que só se distinguem pelo arquivo.
 *
 * POR QUE ISSO EXISTE: as fotos das crianças não entram no repositório (ver
 * .gitignore). Enquanto estiverem só na máquina de quem desenvolve, o site
 * funciona no computador dele e sobe sem imagem nenhuma.
 */

export type FotoEnviada = { arquivo: string; url: string };

export type ResultadoRegistro = {
  erro?: string;
  ligadas?: number;
  semPar?: string[];
};

export async function registrarFotosEnviadas(
  campanhaId: string,
  enviadas: FotoEnviada[],
): Promise<ResultadoRegistro> {
  if (!campanhaId) return { erro: "Campanha não identificada." };
  if (enviadas.length === 0) return { erro: "Nenhuma foto para registrar." };

  const supabase = await criarClienteServidor();

  const { data: midias, error } = await supabase.from("midias").select("id, caminho");
  if (error) return { erro: `Não foi possível ler as fotos cadastradas: ${error.message}` };

  const porArquivo = new Map<string, string>();
  for (const m of (midias ?? []) as { id: string; caminho: string }[]) {
    const ultimo = m.caminho.split("/").pop();
    if (ultimo) porArquivo.set(ultimo.toLowerCase(), m.id);
  }

  let ligadas = 0;
  const semPar: string[] = [];

  for (const { arquivo, url } of enviadas) {
    const alvo = porArquivo.get(arquivo.toLowerCase());

    // Sem linha correspondente, o arquivo é ignorado em vez de virar foto
    // solta: foto de criança sem participante e sem termo não deve existir.
    if (!alvo) {
      semPar.push(arquivo);
      continue;
    }

    // Só o caminho muda. `tem_menores` e `autorizacao` ficam como estão, então
    // a restrição do banco continua valendo sem precisar ser reafirmada aqui.
    const { error: erroUpdate } = await supabase
      .from("midias")
      .update({ caminho: url })
      .eq("id", alvo);

    if (erroUpdate) {
      semPar.push(`${arquivo} (${erroUpdate.message})`);
      continue;
    }

    ligadas++;
  }

  revalidatePath(`/admin/apadrinhamento/${campanhaId}`);
  revalidatePath(`/admin/apadrinhamento/${campanhaId}/fotos`);
  revalidatePath("/apadrinhamento/participantes");
  revalidatePath("/", "layout");

  return { ligadas, semPar };
}
