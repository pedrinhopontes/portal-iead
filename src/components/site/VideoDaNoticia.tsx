import { Icone } from "@/components/ui/Icone";

/**
 * Vídeo da notícia.
 *
 * YouTube é incorporado na página; os outros viram um link. Incorporar
 * Instagram ou Facebook exige carregar script deles em toda visita, o que
 * entrega o visitante à rede social mesmo que ele não clique em nada — não
 * combina com a política de privacidade que este portal publica.
 *
 * O YouTube entra pelo domínio `youtube-nocookie.com`, que não grava rastreio
 * antes de a pessoa dar play.
 */

/** Extrai o identificador do vídeo das formas de endereço que o YouTube usa. */
function idDoYouTube(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const partes = u.pathname.split("/").filter(Boolean);
      // /shorts/ID, /embed/ID, /live/ID
      if (["shorts", "embed", "live"].includes(partes[0])) return partes[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

function nomeDaPlataforma(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("facebook") || host.includes("fb.watch")) return "Facebook";
    if (host.includes("vimeo")) return "Vimeo";
    return host;
  } catch {
    return "outro site";
  }
}

export function VideoDaNoticia({ url, titulo }: { url: string; titulo: string }) {
  const id = idDoYouTube(url);

  if (id) {
    return (
      <div className="mt-10 overflow-hidden rounded-2xl border border-linha bg-tinta">
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={`Vídeo: ${titulo}`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-10 flex items-center gap-4 rounded-2xl border border-linha bg-areia p-6 transition-colors hover:border-bordo"
    >
      <Icone nome="tocar" className="h-6 w-6 shrink-0 text-bordo" />
      <span>
        <span className="block font-semibold">Assistir ao vídeo no {nomeDaPlataforma(url)}</span>
        <span className="block text-sm text-tinta-suave">Abre em uma nova aba.</span>
      </span>
    </a>
  );
}
