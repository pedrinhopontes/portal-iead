"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoFormulario = { erro?: string };

const CATEGORIAS = ["Institucional", "Campanhas", "Projetos", "Conquistas"] as const;

/** Transforma o título em endereço: "Seminário dos 10 Anos" → "seminario-dos-10-anos". */
export async function gerarSlug(texto: string): Promise<string> {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function mensagemDoErro(codigo: string | undefined, mensagem: string): string {
  if (codigo === "23505") return "Já existe uma notícia com este endereço. Mude o título ou o endereço.";
  if (codigo === "42501" || codigo === "PGRST301") {
    return "O seu perfil não tem permissão para esta ação.";
  }
  if (codigo === "42P01") {
    return "As tabelas ainda não foram criadas no banco. Rode as migrations de supabase/migrations.";
  }
  return mensagem;
}

export async function salvarNoticia(
  _anterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const id = String(formData.get("id") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const resumo = String(formData.get("resumo") ?? "").trim();
  const corpo = String(formData.get("corpo") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const dataTexto = String(formData.get("data") ?? "").trim();
  const slugTexto = String(formData.get("slug") ?? "").trim();
  const publicado = formData.get("publicado") === "on";

  if (!titulo) return { erro: "O título é obrigatório." };
  if (!resumo) return { erro: "O resumo é obrigatório: ele aparece nos cartões e no compartilhamento." };
  if (!corpo) return { erro: "O texto da notícia é obrigatório." };
  if (!CATEGORIAS.includes(categoria as (typeof CATEGORIAS)[number])) {
    return { erro: "Escolha uma categoria." };
  }

  const slug = slugTexto ? await gerarSlug(slugTexto) : await gerarSlug(titulo);
  if (!slug) return { erro: "Não foi possível gerar o endereço a partir do título." };

  // --- Imagens e vídeo ---
  const temMenores = formData.get("tem_menores") === "on";
  const autorizacao = String(formData.get("autorizacao") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();

  const juntar = (prefixo: string) => {
    const caminhos = formData.getAll(`${prefixo}_caminho`).map(String);
    const alts = formData.getAll(`${prefixo}_alt`).map((a) => String(a).trim());
    return caminhos.map((caminho, i) => ({ caminho, alt: alts[i] ?? "" }));
  };

  const capa = juntar("capa")[0] ?? null;
  const galeria = juntar("galeria");
  const todas = [...(capa ? [capa] : []), ...galeria];

  if (todas.some((f) => !f.alt)) {
    return {
      erro: "Toda imagem precisa de descrição. É o que uma pessoa cega ouve no lugar da foto.",
    };
  }

  // A mesma regra que a restrição do banco aplica, verificada antes para a
  // mensagem ser legível em vez de um erro de violação de constraint.
  if (temMenores && (!autorizacao || autorizacao.toUpperCase() === "PENDENTE")) {
    return {
      erro:
        "As fotos estão marcadas como contendo crianças ou adolescentes. Informe qual termo de autorização de imagem as cobre.",
    };
  }

  if (videoUrl && !/^https?:\/\//i.test(videoUrl)) {
    return { erro: "O endereço do vídeo precisa começar com https://" };
  }

  const dados = {
    titulo,
    resumo,
    corpo,
    categoria,
    slug,
    // Data nula é proposital: a tela pública mostra "data a confirmar".
    data: dataTexto || null,
    publicado,
    video_url: videoUrl || null,
  };

  const supabase = await criarClienteServidor();

  // --- Cadastra as imagens ---
  // `upsert` por caminho: reenviar o formulário com as mesmas fotos atualiza a
  // descrição em vez de duplicar a linha no acervo.
  const idPorCaminho = new Map<string, string>();

  if (todas.length > 0) {
    const { data: midias, error: erroMidias } = await supabase
      .from("midias")
      .upsert(
        todas.map((f) => ({
          caminho: f.caminho,
          alt: f.alt,
          tem_menores: temMenores,
          autorizacao: autorizacao || null,
        })),
        { onConflict: "caminho" },
      )
      .select("id, caminho");

    if (erroMidias) {
      if (erroMidias.code === "23514") {
        return {
          erro:
            "O banco recusou: foto com criança ou adolescente só entra com a referência do termo de autorização.",
        };
      }
      return { erro: mensagemDoErro(erroMidias.code, erroMidias.message) };
    }

    for (const m of (midias ?? []) as { id: string; caminho: string }[]) {
      idPorCaminho.set(m.caminho, m.id);
    }
  }

  const capaId = capa ? (idPorCaminho.get(capa.caminho) ?? null) : null;

  // --- Grava a notícia ---
  const { data: salva, error } = id
    ? await supabase
        .from("noticias")
        .update({ ...dados, capa_id: capaId })
        .eq("id", id)
        .select("id")
        .single()
    : await supabase
        .from("noticias")
        .insert({ ...dados, capa_id: capaId })
        .select("id")
        .single();

  if (error) return { erro: mensagemDoErro(error.code, error.message) };

  // --- Galeria ---
  // Troca a lista inteira: o formulário manda o estado final, não um delta.
  // Só depois de gravar a notícia, porque antes disso ela não tem identificador.
  await supabase.from("noticia_midias").delete().eq("noticia_id", salva.id);

  if (galeria.length > 0) {
    const linhas = galeria
      .map((f, ordem) => ({
        noticia_id: salva.id as string,
        midia_id: idPorCaminho.get(f.caminho),
        ordem,
      }))
      .filter((l): l is { noticia_id: string; midia_id: string; ordem: number } => !!l.midia_id);

    const { error: erroGaleria } = await supabase.from("noticia_midias").insert(linhas);
    if (erroGaleria) return { erro: mensagemDoErro(erroGaleria.code, erroGaleria.message) };
  }

  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${slug}`);
  redirect("/admin/noticias");
}

export async function alternarPublicacao(id: string, publicar: boolean) {
  const supabase = await criarClienteServidor();
  await supabase.from("noticias").update({ publicado: publicar }).eq("id", id);
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
}

export async function excluirNoticia(id: string) {
  const supabase = await criarClienteServidor();
  await supabase.from("noticias").delete().eq("id", id);
  revalidatePath("/admin/noticias");
  revalidatePath("/noticias");
}
