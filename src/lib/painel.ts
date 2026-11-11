export type Perfil = "admin" | "comunicacao" | "financeiro" | "coordenador";

export const rotuloPerfil: Record<Perfil, string> = {
  admin: "Administrador geral",
  comunicacao: "Comunicação",
  financeiro: "Financeiro",
  coordenador: "Coordenação de projeto",
};

export type ItemPainel = {
  href: string;
  rotulo: string;
  descricao: string;
  perfis: Perfil[];
  /** Área prevista no projeto, ainda não implementada. */
  emBreve?: boolean;
};

/**
 * Menu do painel. Cada item declara quem enxerga.
 *
 * Esconder o item é conveniência, não segurança: quem tentar o endereço direto
 * esbarra nas políticas do banco, que recusam a consulta.
 */
export const menuPainel: ItemPainel[] = [
  {
    href: "/admin",
    rotulo: "Início",
    descricao: "Visão geral do painel",
    perfis: ["admin", "comunicacao", "financeiro", "coordenador"],
  },
  {
    href: "/admin/noticias",
    rotulo: "Notícias",
    descricao: "Publicar e editar notícias e eventos",
    perfis: ["admin", "comunicacao"],
  },
  {
    href: "/admin/projetos",
    rotulo: "Projetos",
    descricao: "Textos, objetivos e atividades de cada projeto",
    perfis: ["admin", "comunicacao", "coordenador"],
  },
  {
    href: "/admin/historia",
    rotulo: "Linha do tempo",
    descricao: "Os anos de história do Instituto",
    perfis: ["admin", "comunicacao"],
  },
  {
    href: "/admin/parceiros",
    rotulo: "Parceiros",
    descricao: "Redes e organizações parceiras",
    perfis: ["admin", "comunicacao"],
  },
  {
    href: "/admin/indicadores",
    rotulo: "Indicadores",
    descricao: "Os números de impacto da página inicial",
    perfis: ["admin", "comunicacao"],
  },
  {
    href: "/admin/midias",
    rotulo: "Fotos e arquivos",
    descricao: "Acervo de imagens, com descrição e autorização",
    perfis: ["admin", "comunicacao", "coordenador"],
  },
  {
    href: "/admin/apadrinhamento",
    rotulo: "Apadrinhamento",
    descricao: "Campanhas, participantes e reservas",
    perfis: ["admin", "coordenador"],
  },
  {
    href: "/admin/contribuicoes",
    rotulo: "Contribuições",
    descricao: "Doações, filiações e os dados do PIX",
    perfis: ["admin", "financeiro"],
  },
  {
    href: "/admin/transparencia",
    rotulo: "Transparência",
    descricao: "Documentos públicos e valores dos gráficos",
    perfis: ["admin", "financeiro"],
  },
  {
    href: "/admin/usuarios",
    rotulo: "Usuários",
    descricao: "Quem acessa o painel e com qual perfil",
    perfis: ["admin"],
  },
  {
    href: "/admin/textos",
    rotulo: "Textos do site",
    descricao: "Títulos e parágrafos das páginas públicas",
    perfis: ["admin", "comunicacao"],
  },
  {
    href: "/admin/areas",
    rotulo: "O que aparece no site",
    descricao: "Esconder do menu as áreas que ainda não têm conteúdo",
    perfis: ["admin", "comunicacao"],
  },
  {
    href: "/admin/auditoria",
    rotulo: "Registro de alterações",
    descricao: "Quem mudou o quê e quando",
    perfis: ["admin"],
  },
];

export function itensDoPerfil(perfil: Perfil): ItemPainel[] {
  return menuPainel.filter((item) => item.perfis.includes(perfil));
}
