import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CHAVE_PUBLICA, URL_SUPABASE, supabaseConfigurado } from "@/lib/supabase/configuracao";

/**
 * Renova a sessão a cada requisição e protege o painel.
 *
 * Esta é a primeira barreira: quem não está autenticado nem chega a carregar a
 * página do painel. A segunda barreira são as políticas do banco, que recusam a
 * consulta mesmo que alguém passe daqui.
 */
export async function middleware(request: NextRequest) {
  if (!supabaseConfigurado) return NextResponse.next();

  let resposta = NextResponse.next({ request });

  const supabase = createServerClient(URL_SUPABASE, CHAVE_PUBLICA, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesParaGravar) {
        cookiesParaGravar.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        cookiesParaGravar.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const caminho = request.nextUrl.pathname;

  if (caminho.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = `?destino=${encodeURIComponent(caminho)}`;
    return NextResponse.redirect(url);
  }

  if (caminho === "/entrar" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return resposta;
}

export const config = {
  matcher: ["/admin/:path*", "/entrar"],
};
