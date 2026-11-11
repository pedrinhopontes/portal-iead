import { createBrowserClient } from "@supabase/ssr";
import { CHAVE_PUBLICA, URL_SUPABASE } from "./configuracao";

/** Cliente do Supabase para uso no navegador (componentes com "use client"). */
export function criarClienteNavegador() {
  return createBrowserClient(URL_SUPABASE, CHAVE_PUBLICA);
}
