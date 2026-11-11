import Image from "next/image";
import { marca } from "@/lib/marca";

/**
 * Exibe a logo oficial do IEAD, ou o espaço reservado enquanto o arquivo não chega.
 * A logo nunca é recriada nem redesenhada pelo site.
 */
export function Marca({
  tamanho = 44,
  fundoEscuro = false,
  className = "",
}: {
  tamanho?: number;
  fundoEscuro?: boolean;
  className?: string;
}) {
  const arquivo = fundoEscuro ? (marca.arquivoFundoEscuro ?? marca.arquivo) : marca.arquivo;

  if (!arquivo) {
    return (
      <span
        style={{ height: tamanho, width: tamanho }}
        title="Espaço reservado para a logo oficial do IEAD"
        className={`flex shrink-0 items-center justify-center rounded-lg border-2 border-dashed text-[9px] font-bold uppercase leading-none tracking-wide ${
          fundoEscuro ? "border-white/40 text-white/60" : "border-bordo/40 text-bordo/70"
        } ${className}`}
      >
        logo
      </span>
    );
  }

  return (
    <span
      style={{ height: tamanho, width: tamanho }}
      className={`relative block shrink-0 ${className}`}
    >
      <Image src={arquivo} alt={marca.alt} fill sizes={`${tamanho}px`} priority className="object-contain" />
    </span>
  );
}
