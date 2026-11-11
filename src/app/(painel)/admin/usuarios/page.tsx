import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/ui/Aviso";
import { listarUsuarios } from "@/lib/dados/painel-conteudo";
import { rotuloPerfil, type Perfil } from "@/lib/painel";

export const metadata: Metadata = { title: "Usuários" };
export const dynamic = "force-dynamic";

export default async function Usuarios() {
  const usuarios = await listarUsuarios();

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Usuários</h1>
          <p className="mt-1 text-sm text-tinta-suave">Quem acessa o painel e com qual perfil.</p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="rounded-full bg-bordo px-6 py-3 text-sm font-bold text-white hover:bg-bordo-escuro"
        >
          Novo usuário
        </Link>
      </div>

      <Aviso titulo="Uma conta por pessoa, não uma conta por instituição" tom="protecao" className="mt-6">
        O registro de alterações grava quem fez cada mudança. Com um login compartilhado, ele responde
        sempre &quot;o Instituto&quot; e deixa de servir para o que existe. Crie uma conta para cada
        pessoa da equipe, com o perfil que ela precisa — nem mais, nem menos.
      </Aviso>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-linha bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-linha bg-areia text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">E-mail</th>
              <th className="px-4 py-3 font-semibold">Perfil</th>
              <th className="px-4 py-3 font-semibold">Acesso</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-b border-linha/60 last:border-0">
                <td className="px-4 py-3 font-semibold">{usuario.nome}</td>
                <td className="px-4 py-3 text-tinta-suave">{usuario.email}</td>
                <td className="px-4 py-3">{rotuloPerfil[usuario.perfil as Perfil]}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      usuario.ativo
                        ? "bg-verde-suave text-verde-escuro"
                        : "bg-creme text-tinta-suave"
                    }`}
                  >
                    {usuario.ativo ? "liberado" : "bloqueado"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/usuarios/${usuario.id}`}
                    className="font-semibold text-bordo hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
