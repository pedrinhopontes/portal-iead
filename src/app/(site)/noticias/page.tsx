import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { ListaNoticias } from "@/components/site/ListaNoticias";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { Secao } from "@/components/ui/Secao";
import { categoriasDeNoticia, listarNoticias, type CategoriaNoticia } from "@/lib/dados/conteudo";

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
  const [noticias, { categoria }] = await Promise.all([listarNoticias(), searchParams]);

  const categoriaAtiva = categoriasDeNoticia.includes(categoria as CategoriaNoticia)
    ? (categoria as CategoriaNoticia)
    : null;

  return (
    <>
      <CapaPagina
        sobretitulo="Notícias e eventos"
        titulo="O que acontece no Instituto"
        texto="Atividades dos projetos, campanhas, conquistas, parcerias e comunicados. Cada notícia tem endereço próprio, pronto para compartilhar no WhatsApp e nas redes."
      />

      <Secao fundo="areia">
        <Container>
          {noticias.length === 0 ? (
            <Aviso titulo="Nenhuma notícia publicada ainda" tom="informativo">
              As notícias escritas no painel aparecem aqui assim que forem marcadas como publicadas.
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
