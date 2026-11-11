"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/servidor";

export type EstadoMidia = { erro?: string };

const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANHO_MAXIMO = 10 * 1024 * 1024;

const BUCKET = "midias";

function nomeDeArquivo(original: string): string {
  const partes = original.split(".");
  const extensao = (partes.length > 1 ? partes.pop() : "jpg")!.toLowerCase();
  const base = partes
    .join("-")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return `${Date.now()}-${base || "foto"}.${extensao}`;
}

function limpar(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  return texto === "" ? null : texto;
}

function mensagem(codigo: string | undefined, texto: string): string {
  if (codigo === "23514") {
    return "O banco recusou: foto marcada como contendo menores precisa da referência do termo de autorização.";
  }
  if (codigo === "23505") return "Este arquivo já está cadastrado.";
  if (codigo === "42501" || codigo === "PGRST301") return "O seu perfil não tem permissão para esta ação.";
  return texto;
}

function revalidar() {
  revalidatePath("/admin/midias");
  revalidatePath("/", "layout");
}

export async function salvarMidia(_anterior: EstadoMidia, formData: FormData): Promise<EstadoMidia> {
  const id = String(formData.get("id") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const temMenores = formData.get("tem_menores") === "on";
  const autorizacao = String(formData.get("autorizacao") ?? "").trim();
  const slots = formData.getAll("slots").map(String).filter(Boolean);

  if (!alt) {
    return {
      erro: "A descrição da imagem é obrigatória. É o que uma pessoa cega ouve no lugar da foto, e o que o Google lê.",
    };
  }

  if (temMenores && (!autorizacao || autorizacao.toUpperCase() === "PENDENTE")) {
    return {
      erro: "Foto com criança ou adolescente só pode ser cadastrada com a referência do termo de autorização de imagem.",
    };
  }

  const supabase = await criarClienteServidor();

  // --- Envio do arquivo, quando houver ---
  let caminho: string | null = null;
  const arquivo = formData.get("arquivo");

  if (arquivo instanceof File && arquivo.size > 0) {
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      return { erro: "Formato não aceito. Envie JPG, PNG, WebP ou AVIF." };
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      const mb = (arquivo.size / 1024 / 1024).toFixed(1);
      return { erro: `O arquivo tem ${mb} MB e o limite é 10 MB. Tente de novo: o navegador reduz a imagem sozinho.` };
    }

    const nome = nomeDeArquivo(arquivo.name);
    const { error } = await supabase.storage.from(BUCKET).upload(nome, arquivo, {
      contentType: arquivo.type,
      upsert: false,
    });

    if (error) return { erro: `Não foi possível enviar o arquivo: ${error.message}` };

    caminho = supabase.storage.from(BUCKET).getPublicUrl(nome).data.publicUrl;
  }

  if (!id && !caminho) return { erro: "Escolha o arquivo da imagem." };

  const ano = Number(formData.get("ano"));

  const dados = {
    alt,
    legenda: limpar(formData.get("legenda")),
    credito: limpar(formData.get("credito")),
    ano: Number.isInteger(ano) && ano > 1900 ? ano : null,
    tem_menores: temMenores,
    autorizacao: autorizacao || null,
    ...(caminho ? { caminho } : {}),
  };

  let midiaId = id;

  if (id) {
    const { error } = await supabase.from("midias").update(dados).eq("id", id);
    if (error) return { erro: mensagem(error.code, error.message) };
  } else {
    const { data, error } = await supabase
      .from("midias")
      .insert({ ...dados, caminho: caminho! })
      .select("id")
      .single();
    if (error) return { erro: mensagem(error.code, error.message) };
    midiaId = data.id;
  }

  // --- Lugares no site ---
  // Troca a lista inteira: o formulário manda o estado final, não um delta.
  await supabase.from("midia_slots").delete().eq("midia_id", midiaId);

  if (slots.length > 0) {
    const { error } = await supabase
      .from("midia_slots")
      .upsert(
        slots.map((slot) => ({ slot, midia_id: midiaId })),
        { onConflict: "slot" },
      );
    if (error) return { erro: mensagem(error.code, error.message) };
  }

  revalidar();
  redirect("/admin/midias");
}

export async function excluirMidia(id: string) {
  const supabase = await criarClienteServidor();

  const { data: midia } = await supabase.from("midias").select("caminho").eq("id", id).maybeSingle();

  // Apaga o arquivo do armazenamento, quando ele veio por upload.
  if (midia?.caminho) {
    const marcador = `/${BUCKET}/`;
    const posicao = (midia.caminho as string).indexOf(marcador);
    if (posicao >= 0) {
      const nome = (midia.caminho as string).slice(posicao + marcador.length);
      await supabase.storage.from(BUCKET).remove([nome]);
    }
  }

  await supabase.from("midias").delete().eq("id", id);
  revalidar();
}
