import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { ListaNoticias } from "@/components/site/ListaNoticias";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { categoriasDeNoticia, listarNoticias, type CategoriaNoticia } from "@/lib/dados/conteudo";
import { carregarTextos } from "@/lib/dados/textos";

export const metadata: Metadata = {
  title: "Notícias e Eventos",
  description:
    "Notícias institucionais, atividades dos projetos, eventos, campanhas e conquistas do Instituto Educacional Araujo Dutra.",
};

export const dynamic = "force-dynamic";

export default async function Noticias({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const [noticias, { categoria }, t] = await Promise.all([
    listarNoticias(),
    searchParams,
    carregarTextos(),
  ]);

  const categoriaAtiva = categoriasDeNoticia.includes(categoria as CategoriaNoticia)
    ? (categoria as CategoriaNoticia)
    : null;

  return (
    <>
      <CapaPagina
        sobretitulo={t("noticias.capa.sobretitulo")}
        titulo={t("noticias.capa.titulo")}
        texto={t("noticias.capa.texto")}
      />

      <Secao fundo="areia">
        <Container>
          {noticias.length === 0 ? (
            <Aviso titulo={t("noticias.vazio.titulo")} tom="informativo">
              {t("noticias.vazio.texto")}
            </Aviso>
          ) : (
            <ListaNoticias noticias={noticias} categoriaAtiva={categoriaAtiva} />
          )}

          {noticias.length > 0 && (
            <p className="mt-10 flex items-center justify-center gap-2 text-sm text-tinta-suave">
              <Icone nome="documento" className="h-4 w-4" />
              {noticias.length} {noticias.length === 1 ? "notícia publicada" : "notícias publicadas"}
            </p>
          )}
        </Container>
      </Secao>
    </>
  );
}
