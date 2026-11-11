import { criarClienteServidor } from "@/lib/supabase/servidor";

export type OpcaoSlot = { slot: string; rotulo: string };
export type GrupoDeSlots = { grupo: string; opcoes: OpcaoSlot[] };

function serie(prefixo: string, quantidade: number, rotulo: (i: number) => string): OpcaoSlot[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    slot: `${prefixo}-${i + 1}`,
    rotulo: rotulo(i + 1),
  }));
}

/**
 * Todos os lugares do site que aceitam foto.
 *
 * Os grupos fixos estão escritos aqui; os que dependem de conteúdo (projetos,
 * anos da linha do tempo, campanhas e notícias) são montados a partir do banco,
 * então cadastrar um projeto novo já cria os lugares de foto dele.
 */
export async function catalogoDeSlots(): Promise<GrupoDeSlots[]> {
  const supabase = await criarClienteServidor();

  const [projetos, anos, campanhas, noticias] = await Promise.all([
    supabase.from("projetos").select("slug, nome").order("ordem"),
    supabase.from("timeline_anos").select("ano").order("ano"),
    supabase.from("campanhas").select("ano").order("ano", { ascending: false }),
    supabase.from("noticias").select("slug, titulo").order("criado_em", { ascending: false }),
  ]);

  const grupos: GrupoDeSlots[] = [
    {
      grupo: "Página inicial",
      opcoes: [
        ...serie("home-hero", 12, (i) => `Carrossel do banner — foto ${i}`),
        ...serie("home-galeria", 6, (i) => `Galeria "Nossos momentos" — foto ${i}`),
      ],
    },
    {
      grupo: "Quem somos",
      opcoes: [{ slot: "quem-somos-sede", rotulo: "Fachada da sede ou foto de equipe" }],
    },
    {
      grupo: "10 anos",
      opcoes: serie("dez-anos", 6, (i) => `Evento dos 10 anos — foto ${i}`),
    },
  ];

  if (projetos.data?.length) {
    grupos.push({
      grupo: "Projetos",
      opcoes: projetos.data.flatMap((p) => [
        { slot: `projeto-${p.slug}-capa`, rotulo: `${p.nome} — capa` },
        { slot: `projeto-${p.slug}-1`, rotulo: `${p.nome} — foto de apoio 1` },
        { slot: `projeto-${p.slug}-2`, rotulo: `${p.nome} — foto de apoio 2` },
      ]),
    });
  }

  if (anos.data?.length) {
    grupos.push({
      grupo: "Linha do tempo",
      opcoes: anos.data.flatMap((a) =>
        serie(`historia-${a.ano}`, 4, (i) => `${a.ano} — foto ${i}`),
      ),
    });
  }

  if (campanhas.data?.length) {
    grupos.push({
      grupo: "Apadrinhamento",
      opcoes: [
        { slot: "apadrinhamento-capa", rotulo: "Apadrinhamento — foto principal" },
        ...campanhas.data.flatMap((c) =>
          serie(`apadrinhamento-${c.ano}`, 4, (i) => `Campanha ${c.ano} — foto ${i}`),
        ),
      ],
    });
  }

  if (noticias.data?.length) {
    grupos.push({
      grupo: "Notícias",
      opcoes: noticias.data.map((n) => ({
        slot: `noticia-${n.slug}-capa`,
        rotulo: `${n.titulo.slice(0, 60)} — capa`,
      })),
    });
  }

  return grupos;
}

/** Procura o rótulo amigável de um slot dentro do catálogo. */
export function rotuloDoSlot(grupos: GrupoDeSlots[], slot: string): string {
  for (const grupo of grupos) {
    const achou = grupo.opcoes.find((o) => o.slot === slot);
    if (achou) return achou.rotulo;
  }
  return slot;
}
