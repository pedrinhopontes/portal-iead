import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CHAVE_PUBLICA, URL_SUPABASE } from "./configuracao";

/**
 * Cliente do Supabase para uso no servidor (Server Components e Server Actions).
 *
 * Lê e grava a sessão nos cookies da requisição. Em Server Components a gravação
 * não é permitida pelo Next, e por isso ela é ignorada em silêncio: quem renova a
 * sessão é o middleware.
 */
export async function criarClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(URL_SUPABASE, CHAVE_PUBLICA, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          cookiesParaGravar.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component: o middleware cuida da renovação da sessão.
        }
      },
    },
  });
}

/**
 * Usuário autenticado e o seu perfil no painel.
 * Devolve `null` quando não há sessão ou quando a pessoa não é usuária do painel.
 */
export async function usuarioDoPainel() {
  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from("usuarios_admin")
    .select("nome, email, perfil, ativo")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil || !perfil.ativo) {
    return { id: user.id, email: user.email ?? "", perfil: null, nome: null };
  }

  return {
    id: user.id,
    email: perfil.email ?? user.email ?? "",
    nome: perfil.nome as string,
    perfil: perfil.perfil as "admin" | "comunicacao" | "financeiro" | "coordenador",
  };
}
