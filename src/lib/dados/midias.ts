import { criarClienteServidor } from "@/lib/supabase/servidor";

export type Midia = {
  id: string;
  caminho: string;
  alt: string;
  legenda: string | null;
  credito: string | null;
  ano: number | null;
  tem_menores: boolean;
  autorizacao: string | null;
  criado_em: string;
};

export type MidiaComSlots = Midia & { midia_slots: { slot: string }[] };

export async function listarMidias(): Promise<MidiaComSlots[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("midias")
    .select("*, midia_slots(slot)")
    .order("criado_em", { ascending: false });
  return (data as MidiaComSlots[]) ?? [];
}

export async function midiaPorId(id: string): Promise<MidiaComSlots | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("midias")
    .select("*, midia_slots(slot)")
    .eq("id", id)
    .maybeSingle();
  return (data as MidiaComSlots) ?? null;
}
