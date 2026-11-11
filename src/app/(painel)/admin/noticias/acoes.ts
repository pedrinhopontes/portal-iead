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

  const dados = {
    titulo,
    resumo,
    corpo,
    categoria,
    slug,
    // Data nula é proposital: a tela pública mostra "data a confirmar".
    data: dataTexto || null,
    publicado,
  };

  const supabase = await criarClienteServidor();

  const { error } = id
    ? await supabase.from("noticias").update(dados).eq("id", id)
    : await supabase.from("noticias").insert(dados);

  if (error) return { erro: mensagemDoErro(error.code, error.message) };

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
