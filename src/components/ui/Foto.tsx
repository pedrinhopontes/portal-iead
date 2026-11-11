import Image from "next/image";
import { EspacoFoto, proporcoes, type Proporcao } from "./EspacoFoto";
import { resolverFoto } from "@/lib/dados/fotos-do-site";

/**
 * Mostra a fotografia registrada para este lugar do site.
 *
 * A foto vem do painel administrativo. Enquanto o lugar não for preenchido,
 * aparece o espaço reservado marcado — o site nunca usa imagem genérica no
 * lugar de uma foto real do Instituto.
 */
export async function Foto({
  slot,
  legenda,
  proporcao = "4/3",
  className = "",
  raio = "rounded-2xl",
  prioridade = false,
  tamanhos = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px",
}: {
  /** Identificador do lugar no site, por exemplo "home-hero-1". */
  slot: string;
  /** Texto exibido no espaço reservado enquanto a foto não chega. */
  legenda: string;
  proporcao?: Proporcao;
  className?: string;
  /** Classe de arredondamento; use "rounded-none" quando a foto encosta na borda de um cartão. */
  raio?: string;
  /** Use em imagens visíveis logo no carregamento, como o banner principal. */
  prioridade?: boolean;
  tamanhos?: string;
}) {
  const foto = await resolverFoto(slot);

  if (!foto) {
    return <EspacoFoto legenda={legenda} proporcao={proporcao} className={className} raio={raio} />;
  }

  return (
    <figure className={`relative overflow-hidden bg-creme ${raio} ${proporcoes[proporcao]} ${className}`}>
      <Image
        src={foto.arquivo}
        alt={foto.alt}
        fill
        sizes={tamanhos}
        priority={prioridade}
        className="object-cover"
      />
      {(foto.legenda || foto.credito) && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta/80 to-transparent px-4 pb-3 pt-10 text-xs text-white">
          {foto.legenda}
          {foto.credito && <span className="block text-white/70">Foto: {foto.credito}</span>}
        </figcaption>
      )}
    </figure>
  );
}
