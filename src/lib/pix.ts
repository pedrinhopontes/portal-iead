import QRCode from "qrcode";

/**
 * Geração do código PIX (BR Code).
 *
 * O formato é o EMV®QRCPS do Banco Central: campos no padrão
 * identificador + tamanho + valor, terminados por um CRC16.
 *
 * Isso é feito aqui, sem intermediário, porque o PIX direto na conta do
 * Instituto não tem taxa por transação — o valor doado chega inteiro. A
 * contrapartida é que não existe confirmação automática: a baixa é feita por
 * uma pessoa no painel, conferindo o extrato.
 */

export type ConfiguracaoPix = {
  chave: string;
  nome: string;
  cidade: string;
};

/** Campo no formato identificador + tamanho (2 dígitos) + valor. */
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, "0") + valor;
}

/** Remove acentos e caracteres que o padrão não aceita, e corta no limite. */
function limpar(texto: string, limite: number): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 .-]/g, "")
    .trim()
    .slice(0, limite);
}

/**
 * CRC-16/CCITT-FALSE: polinômio 0x1021, valor inicial 0xFFFF, sem reflexão.
 * É o que o Banco Central especifica para fechar o código.
 */
function crc16(payload: string): string {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Lista o que falta ou está errado na configuração. Vazio significa pronta. */
export function problemasDaConfiguracao(config: Partial<ConfiguracaoPix>): string[] {
  const problemas: string[] = [];

  if (!config.chave?.trim()) problemas.push("A chave PIX não foi informada.");
  if (!config.nome?.trim()) problemas.push("O nome do recebedor não foi informado.");
  if (!config.cidade?.trim()) problemas.push("A cidade do recebedor não foi informada.");

  if (config.nome && limpar(config.nome, 99).length > 25) {
    problemas.push("O nome do recebedor passa de 25 caracteres e seria cortado.");
  }
  if (config.cidade && limpar(config.cidade, 99).length > 15) {
    problemas.push("A cidade passa de 15 caracteres e seria cortada.");
  }

  return problemas;
}

export function pixConfigurado(config: Partial<ConfiguracaoPix> | null): config is ConfiguracaoPix {
  return config !== null && problemasDaConfiguracao(config).length === 0;
}

/**
 * Monta o código copia-e-cola.
 *
 * `referencia` vira o identificador da transação, e é por ele que o financeiro
 * casa o extrato com o registro no painel.
 */
export function montarCodigoPix({
  chave,
  nome,
  cidade,
  valor,
  referencia,
}: ConfiguracaoPix & { valor?: number; referencia?: string }): string {
  const contaDoRecebedor =
    campo("00", "br.gov.bcb.pix") + campo("01", chave.trim());

  const dadosAdicionais = campo("05", referencia ? limpar(referencia, 25) : "***");

  const partes = [
    campo("00", "01"),
    // 12 = uso único: cada doação gera o seu próprio código.
    campo("01", "12"),
    campo("26", contaDoRecebedor),
    campo("52", "0000"),
    campo("53", "986"),
    ...(valor && valor > 0 ? [campo("54", valor.toFixed(2))] : []),
    campo("58", "BR"),
    campo("59", limpar(nome, 25)),
    campo("60", limpar(cidade, 15)),
    campo("62", dadosAdicionais),
  ].join("");

  const semCrc = `${partes}6304`;
  return semCrc + crc16(semCrc);
}

/** Desenha o código como SVG, para exibir sem depender de JavaScript no navegador. */
export async function qrCodeSvg(texto: string): Promise<string> {
  return QRCode.toString(texto, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1f2420", light: "#ffffff" },
  });
}
