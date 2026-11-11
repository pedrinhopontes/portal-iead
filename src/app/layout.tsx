import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const corpo = Inter({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

const titulo = Source_Serif_4({
  subsets: ["latin"],
  variable: "--fonte-titulo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iearaujodutra.com.br"),
  title: {
    default: "Instituto Educacional Araujo Dutra | IEAD",
    template: "%s | IEAD",
  },
  description:
    "Há 10 anos semeando educação, acolhimento e transformação social em Guadalupe, no Rio de Janeiro. Conheça os projetos, apoie e acompanhe a prestação de contas do IEAD.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Instituto Educacional Araujo Dutra",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${corpo.variable} ${titulo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
