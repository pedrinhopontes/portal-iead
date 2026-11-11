import { cache } from "react";
import { buscarFoto } from "@/content/fotos";
import { supabaseConfigurado } from "@/lib/supabase/configuracao";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type FotoExibida = {
  arquivo: string;
  alt: string;
  legenda?: string;
  credito?: string;
};

/**
 * Todas as fotos posicionadas no site, numa consulta só.
 *
 * `cache` do React garante uma única ida ao banco por requisição, mesmo que
 * vinte componentes peçam a sua foto. São poucas dezenas de linhas: carregar
 * tudo de uma vez sai mais barato do que uma consulta por lugar.
 */
const mapaDoBanco = cache(async (): Promise<Map<string, FotoExibida>> => {
  const mapa = new Map<string, FotoExibida>();
  if (!supabaseConfigurado) return mapa;

  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("midia_slots")
    .select("slot, midias(caminho, alt, legenda, credito)");

  type Embutida = { caminho: string; alt: string; legenda: string | null; credito: string | null };
  // O cliente do Supabase tipa relação embutida como lista; aqui é sempre um só.
  type Linha = { slot: string; midias: Embutida | Embutida[] | null };

  for (const linha of (data ?? []) as unknown as Linha[]) {
    const midia = Array.isArray(linha.midias) ? linha.midias[0] : linha.midias;
    if (!midia) continue;

    mapa.set(linha.slot, {
      arquivo: midia.caminho,
      alt: midia.alt,
      legenda: midia.legenda ?? undefined,
      credito: midia.credito ?? undefined,
    });
  }

  return mapa;
});

/**
 * A foto de um lugar do site.
 *
 * Procura primeiro no banco, que é a fonte definitiva. Se o lugar ainda não foi
 * preenchido pelo painel, cai no arquivo `src/content/fotos.ts`, onde estão as
 * fotos do acervo enquanto a migração não termina.
 */
export async function resolverFoto(slot: string): Promise<FotoExibida | null> {
  const doBanco = (await mapaDoBanco()).get(slot);
  if (doBanco) return doBanco;

  const doArquivo = buscarFoto(slot);
  if (!doArquivo) return null;

  return {
    arquivo: doArquivo.arquivo,
    alt: doArquivo.alt,
    legenda: doArquivo.legenda,
    credito: doArquivo.credito,
  };
}

/** Resolve vários lugares de uma vez, mantendo a ordem e pulando os vazios. */
export async function resolverFotos(slots: string[]): Promise<FotoExibida[]> {
  const resolvidas = await Promise.all(slots.map((slot) => resolverFoto(slot)));
  return resolvidas.filter((f): f is FotoExibida => f !== null);
}

/**
 * Quais lugares numerados de uma base já têm foto, de `base-1` a `base-<max>`.
 *
 * Serve para galerias que crescem conforme o Instituto envia material, sem
 * deixar espaços reservados sobrando na tela.
 */
export async function slotsComFoto(base: string, max = 6): Promise<string[]> {
  const candidatos = Array.from({ length: max }, (_, i) => `${base}-${i + 1}`);
  const resolvidos = await Promise.all(
    candidatos.map(async (slot) => ((await resolverFoto(slot)) ? slot : null)),
  );
  return resolvidos.filter((s): s is string => s !== null);
}
