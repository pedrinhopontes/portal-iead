import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  estreito = false,
}: {
  children: ReactNode;
  className?: string;
  estreito?: boolean;
}) {
  const largura = estreito ? "max-w-3xl" : "max-w-7xl";
  return <div className={`mx-auto w-full ${largura} px-5 sm:px-8 ${className}`}>{children}</div>;
}
