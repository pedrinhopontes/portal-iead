/**
 * Configuração do Supabase.
 *
 * Enquanto as credenciais não estiverem no `.env.local`, o site público continua
 * funcionando normalmente e o painel mostra uma tela explicando o que falta —
 * em vez de quebrar com erro de variável indefinida.
 */

export const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Verdadeiro quando as duas variáveis obrigatórias estão preenchidas. */
export const supabaseConfigurado = Boolean(URL_SUPABASE && CHAVE_PUBLICA);

/** Lista o que falta configurar, para mostrar na tela do painel. */
export function pendenciasDeConfiguracao(): string[] {
  const faltando: string[] = [];
  if (!URL_SUPABASE) faltando.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!CHAVE_PUBLICA) faltando.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return faltando;
}
