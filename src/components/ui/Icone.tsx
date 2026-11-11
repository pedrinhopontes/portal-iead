import type { ReactNode } from "react";

export type NomeIcone =
  | "seta"
  | "menu"
  | "fechar"
  | "camera"
  | "documento"
  | "cadeado"
  | "coracao"
  | "relogio"
  | "local"
  | "telefone"
  | "email"
  | "check"
  | "pausar"
  | "tocar"
  | "grafico"
  | "pessoas"
  | "presente"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "whatsapp";

const tracos: Record<NomeIcone, ReactNode> = {
  seta: <path d="M5 12h13M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fechar: <path d="M6 6l12 12M18 6L6 18" />,
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.3l1.2-2h8l1.2 2h2.3A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  documento: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
    </>
  ),
  cadeado: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  coracao: <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z" />,
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  local: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  telefone: <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7.5l9 6 9-6" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  pausar: <path d="M9.5 5v14M14.5 5v14" />,
  tocar: <path d="M8 5.2v13.6L19 12z" />,
  grafico: <path d="M4 20V10M10 20V4M16 20v-6M2 20h20" />,
  pessoas: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16 5.5A3.5 3.5 0 0 1 16 12M17 20c0-2.6-.8-4.3-2.2-5.3" />
    </>
  ),
  presente: (
    <>
      <path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M3 7.5h18V11H3zM12 7.5V21" />
      <path d="M12 7.5S9.5 3 7.5 4.3 10 7.5 12 7.5zM12 7.5s2.5-4.5 4.5-3.2S14 7.5 12 7.5z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" />
    </>
  ),
  facebook: <path d="M13.8 21v-8h2.6l.4-3h-3V8.2c0-.9.3-1.5 1.5-1.5H17V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8z" />,
  linkedin: (
    <>
      <path d="M7 20H4V9h3zM5.5 7.4a1.9 1.9 0 1 1 0-3.9 1.9 1.9 0 0 1 0 3.9z" />
      <path d="M20 20h-3v-5.8c0-1.5-.6-2.4-1.8-2.4-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V20h-3V9h3v1.5c.4-.7 1.2-1.6 2.9-1.6 2.1 0 3.8 1.4 3.8 4.3z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3z" />
      <path d="M8.8 8.2c.3 0 .5.1.7.5l.6 1.3c.1.3 0 .5-.2.7l-.4.5c-.2.2-.2.4 0 .7a7 7 0 0 0 2.7 2.4c.3.1.5.1.7-.1l.5-.6c.2-.2.4-.3.7-.2l1.3.6c.3.2.4.4.4.7 0 1-1 1.7-2 1.7-2.8 0-6.1-3.3-6.1-6.1 0-1 .8-2.1 1.8-2.1z" />
    </>
  ),
};

/** Ícones preenchidos (marcas) — os demais são desenhados com traço. */
const preenchidos: NomeIcone[] = ["facebook", "linkedin", "tocar"];

export function Icone({ nome, className = "h-5 w-5" }: { nome: NomeIcone; className?: string }) {
  const preenchido = preenchidos.includes(nome);

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={preenchido ? "currentColor" : "none"}
      stroke={preenchido ? "none" : "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {tracos[nome]}
    </svg>
  );
}
