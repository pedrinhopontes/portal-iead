"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor, usuarioDoPainel } from "@/lib/supabase/servidor";

export type EstadoUsuario = { erro?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PERFIS = ["admin", "comunicacao", "financeiro", "coordenador"];

export async function salvarUsuario(
  _anterior: EstadoUsuario,
  formData: FormData,
): Promise<EstadoUsuario> {
  const id = String(formData.get("id") ?? "").trim();
  const criando = formData.get("criando") === "1";
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const perfil = String(formData.get("perfil") ?? "");
  const ativo = formData.get("ativo") === "on";

  if (!UUID.test(id)) {
    return { erro: "O identificador precisa ser o UID copiado de Authentication → Users no Supabase." };
  }
  if (!nome) return { erro: "O nome é obrigatório." };
  if (!email.includes("@")) return { erro: "Informe um e-mail válido." };
  if (!PERFIS.includes(perfil)) return { erro: "Escolha um perfil." };

  // Trava contra se trancar para fora: o próprio usuário não pode se rebaixar
  // nem se desativar. Outro administrador faz isso, se for o caso.
  const eu = await usuarioDoPainel();
  if (eu && eu.id === id && (!ativo || perfil !== "admin")) {
    return {
      erro: "Você não pode remover o seu próprio acesso de administrador. Peça a outro administrador.",
    };
  }

  const supabase = await criarClienteServidor();

  const { error } = criando
    ? await supabase.from("usuarios_admin").insert({ id, nome, email, perfil, ativo })
    : await supabase.from("usuarios_admin").update({ nome, email, perfil, ativo }).eq("id", id);

  if (error) {
    if (error.code === "23505") return { erro: "Este usuário já está cadastrado no painel." };
    if (error.code === "23503") {
      return {
        erro: "Não existe usuário com esse UID no Supabase Auth. Crie o login primeiro em Authentication → Users.",
      };
    }
    if (error.code === "42501" || error.code === "PGRST301") {
      return { erro: "Só administradores podem gerenciar usuários." };
    }
    return { erro: error.message };
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
