import Link from "next/link";
import { Icone } from "@/components/ui/Icone";
import { itensDoPerfil, rotuloPerfil, type Perfil } from "@/lib/painel";
import { usuarioDoPainel } from "@/lib/supabase/servidor";

export default async function InicioPainel() {
  const usuario = await usuarioDoPainel();
  const perfil = (usuario?.perfil ?? "comunicacao") as Perfil;
  const itens = itensDoPerfil(perfil).filter((item) => item.href !== "/admin");

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "";

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold">
        {primeiroNome ? `Olá, ${primeiroNome}.` : "Olá."}
      </h1>
      <p className="mt-2 text-tinta-suave">
        Você está no perfil <strong className="font-semibold">{rotuloPerfil[perfil]}</strong>. Abaixo estão
        as áreas que esse perfil acessa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {itens.map((item) =>
          item.emBreve ? (
            <div
              key={item.href}
              className="rounded-2xl border border-dashed border-tinta/20 p-6 opacity-70"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-tinta/60">{item.rotulo}</p>
                <span className="rounded-full bg-creme px-2.5 py-1 text-[10px] font-bold uppercase text-tinta-suave">
                  em breve
                </span>
              </div>
              <p className="mt-1 text-sm text-tinta-suave">{item.descricao}</p>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-linha bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{item.rotulo}</p>
                <Icone
                  nome="seta"
                  className="h-4 w-4 text-bordo transition-transform group-hover:translate-x-0.5"
                />
              </div>
              <p className="mt-1 text-sm text-tinta-suave">{item.descricao}</p>
            </Link>
          ),
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-linha bg-white p-6">
        <h2 className="font-semibold">Onde o projeto está</h2>
        <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
          O banco de dados, os perfis de acesso e o registro de alterações já estão funcionando. A área de
          notícias é a primeira completa, e serve de modelo para as demais. As áreas marcadas como
          &quot;em breve&quot; têm as tabelas prontas no banco e ainda não têm tela.
        </p>
      </div>
    </div>
  );
}
