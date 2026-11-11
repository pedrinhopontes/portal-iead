import Link from "next/link";
import { Marca } from "@/components/layout/Marca";
import { Container } from "@/components/ui/Container";
import { Icone } from "@/components/ui/Icone";
import { instituto } from "@/lib/instituto";
import { areasOcultas } from "@/lib/dados/areas";
import { rodapeInstitucional, rodapeParticipe } from "@/lib/navegacao";

export async function Rodape() {
  // Um link de rodapé para uma área oculta é ponta solta: a aba some do menu
  // e o visitante chega lá pelo rodapé assim mesmo. O "#missao" é cortado
  // antes de comparar — o que conta é a área, não a âncora dentro dela.
  const ocultas = await areasOcultas();
  const visivel = (href: string) => !ocultas.includes(href.split("#")[0]);
  const institucional = rodapeInstitucional.filter((i) => visivel(i.href));
  const participe = rodapeParticipe.filter((i) => visivel(i.href));

  return (
    <footer className="bg-ardosia text-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Marca tamanho={52} fundoEscuro className="mb-4" />
            <p className="font-serif text-xl font-semibold">Instituto Educacional Araujo Dutra</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Há 10 anos semeando educação, acolhimento e transformação social em Guadalupe, no Rio de Janeiro.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={instituto.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do IEAD"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
              >
                <Icone nome="instagram" className="h-5 w-5" />
              </a>
              <a
                href={instituto.redes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook do IEAD"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
              >
                <Icone nome="facebook" className="h-5 w-5" />
              </a>
              <a
                href={instituto.contato.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp do IEAD"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
              >
                <Icone nome="whatsapp" className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-labelledby="rodape-institucional">
            <h2 id="rodape-institucional" className="text-sm font-bold uppercase tracking-wider text-white">
              O Instituto
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {institucional.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white hover:underline">
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="rodape-participe">
            <h2 id="rodape-participe" className="text-sm font-bold uppercase tracking-wider text-white">
              Participe
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {participe.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white hover:underline">
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Fale com a gente</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-2.5">
                <Icone nome="local" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{instituto.endereco.completo}</span>
              </li>
              <li className="flex gap-2.5">
                <Icone nome="telefone" className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={instituto.contato.telefoneLink} className="hover:text-white hover:underline">
                  {instituto.contato.telefone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icone nome="email" className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`mailto:${instituto.contato.email}`} className="hover:text-white hover:underline">
                  {instituto.contato.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icone nome="relogio" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{instituto.contato.horario}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            CNPJ {instituto.cnpj} · Registro CMDCA-Rio {instituto.registroCmdcaRio}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacidade" className="hover:text-white hover:underline">
              Política de Privacidade
            </Link>
            {visivel("/transparencia") && (
              <Link href="/transparencia" className="hover:text-white hover:underline">
                Portal da Transparência
              </Link>
            )}
            <span>© {instituto.fundacao}–2026 IEAD</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
