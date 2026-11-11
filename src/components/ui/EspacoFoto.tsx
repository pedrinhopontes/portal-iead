import { Icone } from "./Icone";

export type Proporcao = "16/9" | "3/2" | "4/3" | "1/1" | "3/4";

export const proporcoes: Record<Proporcao, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
};

/**
 * Espaço reservado para fotografia real do IEAD.
 *
 * O portal não usa imagem de banco posando de foto do projeto. Enquanto o Instituto
 * não envia o material (com o termo de autorização de imagem), o lugar da foto fica
 * visivelmente marcado — assim ninguém publica o site achando que está pronto.
 */
export function EspacoFoto({
  legenda,
  proporcao = "4/3",
  className = "",
  raio = "rounded-2xl",
}: {
  legenda: string;
  proporcao?: Proporcao;
  className?: string;
  raio?: string;
}) {
  return (
    <div
      className={`hachura flex ${proporcoes[proporcao]} ${raio} w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-verde/40 bg-verde-suave/40 p-6 text-center ${className}`}
    >
      <Icone nome="camera" className="h-7 w-7 text-verde-escuro/70" />
      <p className="text-sm font-semibold text-verde-escuro">Fotografia real a inserir</p>
      <p className="max-w-xs text-xs leading-snug text-tinta-suave">{legenda}</p>
    </div>
  );
}
