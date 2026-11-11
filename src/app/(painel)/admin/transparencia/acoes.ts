"use server";

import { revalidatePath } from "next/cache";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoTransparencia = { erro?: string; salvo?: boolean };

const BUCKET = "documentos";
const TIPOS_ACEITOS = ["application/pdf", "image/jpeg", "image/png"];
const TAMANHO_MAXIMO = 15 * 1024 * 1024;

function nomeDeArquivo(original: string): string {
  const partes = original.split(".");
  const extensao = (partes.length > 1 ? partes.pop() : "pdf")!.toLowerCase();
  const base = partes
    .join("-")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${Date.now()}-${base || "documento"}.${extensao}`;
}

function mensagem(codigo: string | undefined, texto: string): string {
  if (codigo === "23514") return "Algum valor não passou nas regras do banco. Confira a categoria e o ano.";
  if (codigo === "42501" || codigo === "PGRST301") {
    return "O seu perfil não tem permissão. A Transparência é do financeiro e do administrador.";
  }
  return texto;
}

function revalidar() {
  revalidatePath("/admin/transparencia");
  revalidatePath("/transparencia");
}

// -----------------------------------------------------------------------------
// Documentos
// -----------------------------------------------------------------------------
export async function salvarDocumento(
  _anterior: EstadoTransparencia,
  formData: FormData,
): Promise<EstadoTransparencia> {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  const anoBruto = Number(formData.get("ano"));

  if (!titulo) return { erro: "O título do documento é obrigatório." };
  if (!categoria) return { erro: "Escolha a categoria." };
  if (!tipo) return { erro: "Escolha o tipo de documento." };

  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { erro: "Escolha o arquivo do documento." };
  }
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    return { erro: "Formato não aceito. Envie PDF, JPG ou PNG." };
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    return { erro: `O arquivo tem ${(arquivo.size / 1024 / 1024).toFixed(1)} MB e o limite é 15 MB.` };
  }

  const supabase = await criarClienteServidor();

  const nome = nomeDeArquivo(arquivo.name);
  const { error: erroEnvio } = await supabase.storage.from(BUCKET).upload(nome, arquivo, {
    contentType: arquivo.type,
    upsert: false,
  });

  if (erroEnvio) return { erro: `Não foi possível enviar o arquivo: ${erroEnvio.message}` };

  const url = supabase.storage.from(BUCKET).getPublicUrl(nome).data.publicUrl;

  const { error } = await supabase.from("transparencia_documentos").insert({
    categoria,
    tipo,
    titulo,
    ano: Number.isInteger(anoBruto) && anoBruto > 1999 ? anoBruto : null,
    arquivo: url,
    tamanho_bytes: arquivo.size,
  });

  if (error) return { erro: mensagem(error.code, error.message) };

  revalidar();
  return { salvo: true };
}

export async function excluirDocumento(id: string) {
  const supabase = await criarClienteServidor();

  const { data } = await supabase
    .from("transparencia_documentos")
    .select("arquivo")
    .eq("id", id)
    .maybeSingle();

  if (data?.arquivo) {
    const marcador = `/${BUCKET}/`;
    const posicao = (data.arquivo as string).indexOf(marcador);
    if (posicao >= 0) {
      await supabase.storage.from(BUCKET).remove([(data.arquivo as string).slice(posicao + marcador.length)]);
    }
  }

  await supabase.from("transparencia_documentos").delete().eq("id", id);
  revalidar();
}

// -----------------------------------------------------------------------------
// Valores anuais
// -----------------------------------------------------------------------------
export async function salvarLancamento(
  _anterior: EstadoTransparencia,
  formData: FormData,
): Promise<EstadoTransparencia> {
  const ano = Number(formData.get("ano"));
  const categoria = String(formData.get("categoria") ?? "").trim();
  const natureza = String(formData.get("natureza") ?? "");
  const fonte = String(formData.get("fonte") ?? "").trim();

  const valorBruto = String(formData.get("valor") ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const valor = Number(valorBruto);

  if (!Number.isInteger(ano) || ano < 2000) return { erro: "Informe um ano válido." };
  if (!categoria) return { erro: "Informe a categoria do valor, por exemplo Doações ou Pessoal." };
  if (natureza !== "receita" && natureza !== "despesa") return { erro: "Escolha receita ou despesa." };
  if (!Number.isFinite(valor) || valor < 0) return { erro: "Informe um valor válido." };
  if (!fonte) {
    return {
      erro: "Informe de qual documento o valor saiu. Número publicado sem fonte não pode ser conferido por ninguém.",
    };
  }

  const supabase = await criarClienteServidor();
  const { error } = await supabase
    .from("financas_anuais")
    .upsert({ ano, categoria, natureza, valor, fonte }, { onConflict: "ano,categoria,natureza" });

  if (error) return { erro: mensagem(error.code, error.message) };

  revalidar();
  return { salvo: true };
}

export async function excluirLancamento(ano: number, categoria: string, natureza: string) {
  const supabase = await criarClienteServidor();
  await supabase
    .from("financas_anuais")
    .delete()
    .eq("ano", ano)
    .eq("categoria", categoria)
    .eq("natureza", natureza);
  revalidar();
}
