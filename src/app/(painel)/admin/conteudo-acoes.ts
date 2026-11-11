"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoConteudo = { erro?: string; salvo?: boolean };

function limpar(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  return texto === "" ? null : texto;
}

/** Converte um textarea de "um item por linha" em lista. */
function linhas(valor: FormDataEntryValue | null): string[] {
  return String(valor ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function mensagem(codigo: string | undefined, texto: string): string {
  if (codigo === "23505") return "Já existe um registro com este endereço ou nome.";
  if (codigo === "23514") {
    return "O banco recusou: confira as regras do campo. Indicador verificado precisa de valor e fonte.";
  }
  if (codigo === "42501" || codigo === "PGRST301") return "O seu perfil não tem permissão para esta ação.";
  return texto;
}

function revalidarSite() {
  revalidatePath("/", "layout");
}

// -----------------------------------------------------------------------------
// Projetos
// -----------------------------------------------------------------------------
export async function salvarProjeto(
  _anterior: EstadoConteudo,
  formData: FormData,
): Promise<EstadoConteudo> {
  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  if (!nome) return { erro: "O nome do projeto é obrigatório." };
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { erro: "O endereço só aceita letras minúsculas, números e hífen." };
  }

  const ordem = Number(formData.get("ordem"));

  const dados = {
    slug,
    nome,
    chamada: limpar(formData.get("chamada")),
    publico: limpar(formData.get("publico")),
    faixa_etaria: limpar(formData.get("faixa_etaria")),
    observacao: limpar(formData.get("observacao")),
    resumo: limpar(formData.get("resumo")),
    objetivos: linhas(formData.get("objetivos")),
    atividades: linhas(formData.get("atividades")),
    paleta: String(formData.get("paleta") ?? "verde"),
    ordem: Number.isInteger(ordem) ? ordem : 0,
    publicado: formData.get("publicado") === "on",
  };

  const supabase = await criarClienteServidor();
  const { error } = id
    ? await supabase.from("projetos").update(dados).eq("id", id)
    : await supabase.from("projetos").insert(dados);

  if (error) return { erro: mensagem(error.code, error.message) };

  revalidarSite();
  redirect("/admin/projetos");
}

// -----------------------------------------------------------------------------
// Linha do tempo
// -----------------------------------------------------------------------------
export async function salvarAno(
  _anterior: EstadoConteudo,
  formData: FormData,
): Promise<EstadoConteudo> {
  const ano = Number(formData.get("ano"));
  if (!Number.isInteger(ano) || ano < 2016 || ano > 2100) {
    return { erro: "Informe um ano entre 2016 e 2100." };
  }

  const dados = {
    ano,
    titulo: limpar(formData.get("titulo")),
    texto: limpar(formData.get("texto")),
    acontecimentos: linhas(formData.get("acontecimentos")),
    destaque: formData.get("destaque") === "on",
    publicado: formData.get("publicado") === "on",
  };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("timeline_anos").upsert(dados, { onConflict: "ano" });

  if (error) return { erro: mensagem(error.code, error.message) };

  revalidarSite();
  redirect("/admin/historia");
}

// -----------------------------------------------------------------------------
// Parceiros
// -----------------------------------------------------------------------------
export async function salvarParceiro(
  _anterior: EstadoConteudo,
  formData: FormData,
): Promise<EstadoConteudo> {
  const id = String(formData.get("id") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return { erro: "O nome do parceiro é obrigatório." };

  const ordem = Number(formData.get("ordem"));

  const dados = {
    nome,
    descricao: limpar(formData.get("descricao")),
    site: limpar(formData.get("site")),
    ordem: Number.isInteger(ordem) ? ordem : 0,
    publicado: formData.get("publicado") === "on",
  };

  const supabase = await criarClienteServidor();
  const { error } = id
    ? await supabase.from("parceiros").update(dados).eq("id", id)
    : await supabase.from("parceiros").insert(dados);

  if (error) return { erro: mensagem(error.code, error.message) };

  revalidarSite();
  redirect("/admin/parceiros");
}

export async function excluirParceiro(id: string) {
  const supabase = await criarClienteServidor();
  await supabase.from("parceiros").delete().eq("id", id);
  revalidarSite();
}

// -----------------------------------------------------------------------------
// Indicadores
// -----------------------------------------------------------------------------
export async function salvarIndicadores(
  _anterior: EstadoConteudo,
  formData: FormData,
): Promise<EstadoConteudo> {
  const ids = formData.getAll("id").map(String);
  const supabase = await criarClienteServidor();

  for (const id of ids) {
    const verificado = formData.get(`verificado-${id}`) === "on";
    const valor = limpar(formData.get(`valor-${id}`));
    const fonte = limpar(formData.get(`fonte-${id}`));

    if (verificado && (!valor || !fonte)) {
      return {
        erro: "Indicador marcado como verificado precisa de valor e de fonte declarada. Sem fonte, ninguém consegue conferir.",
      };
    }

    const { error } = await supabase
      .from("indicadores")
      .update({ valor, fonte, verificado })
      .eq("id", id);

    if (error) return { erro: mensagem(error.code, error.message) };
  }

  revalidarSite();
  revalidatePath("/admin/indicadores");
  return { salvo: true };
}
