import { areaVisivel } from "@/lib/dados/areas";

/**
 * Mostra o conteúdo só se a área estiver visível.
 *
 * Serve para as seções da página inicial e para os botões que levam de uma
 * área a outra. Esconder a aba "Transparência" no menu e manter uma faixa
 * enorme na home convidando a visitar a transparência seria incoerente — e é
 * exatamente o tipo de ponta solta que ninguém lembra de conferir.
 *
 * Como é componente de servidor, o conteúdo escondido não chega ao navegador:
 * não é CSS escondendo, é HTML que não existe.
 */
export async function SeArea({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  if (!(await areaVisivel(href))) return null;
  return <>{children}</>;
}
