import type { Metadata } from "next";
import { CapaPagina } from "@/components/site/CapaPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Container } from "@/components/ui/Container";
import { Secao } from "@/components/ui/Secao";
import { instituto } from "@/lib/instituto";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o Instituto Educacional Araujo Dutra trata dados pessoais, conforme a LGPD.",
};

const secoes = [
  {
    titulo: "Quais dados são coletados",
    paragrafos: [
      "No formulário de contato: nome, e-mail, telefone, assunto e o conteúdo da mensagem.",
      "No apadrinhamento: nome, e-mail e telefone de quem apadrinha, além da forma de participação escolhida.",
      "No apoio financeiro: nome, e-mail, telefone e os dados necessários para emitir o comprovante da contribuição.",
      "Dados completos de cartão nunca são armazenados pelo Instituto.",
    ],
  },
  {
    titulo: "Para que os dados são usados",
    paragrafos: [
      "Responder mensagens, organizar a entrega dos presentes do apadrinhamento, registrar e comprovar contribuições e prestar contas do uso dos recursos.",
      "Os dados não são vendidos nem cedidos para fins comerciais.",
    ],
  },
  {
    titulo: "Dados de crianças e adolescentes",
    paragrafos: [
      "Os dados de crianças e adolescentes atendidos pelo Instituto recebem tratamento reforçado e são usados apenas no interesse deles.",
      "Nas páginas do apadrinhamento, cada participante aparece com o primeiro nome, a idade, os tamanhos de roupa e calçado e a sugestão de presente — o necessário para que alguém possa escolher e comprar o presente certo. Nome completo, sobrenome, endereço, escola, nome dos responsáveis e qualquer contato pessoal não são publicados em nenhuma hipótese: ficam em área restrita do sistema.",
      "A fotografia do participante é publicada na mesma página, sempre com o termo de autorização de imagem assinado pelo responsável e arquivado no Instituto. O sistema recusa o cadastro de fotografia de criança ou adolescente sem esse registro.",
      "As informações completas ficam em área restrita do sistema, acessível somente a quem precisa organizar a entrega.",
      "Fotografias de crianças e adolescentes só são publicadas com autorização válida dos responsáveis, registrada e arquivada pelo Instituto. Na ausência de autorização, a foto não vai ao ar.",
    ],
  },
  {
    titulo: "Compartilhamento",
    paragrafos: [
      "Dados podem ser compartilhados com prestadores de serviço necessários ao funcionamento do portal, como hospedagem, banco de dados e envio de e-mails, sempre limitados à finalidade contratada.",
      "Também podem ser compartilhados quando houver obrigação legal ou requisição de autoridade competente.",
    ],
  },
  {
    titulo: "Direitos de quem fornece os dados",
    paragrafos: [
      "Confirmar a existência de tratamento, acessar os dados, corrigir dados incompletos ou desatualizados, solicitar anonimização ou eliminação, revogar o consentimento e obter informação sobre compartilhamentos.",
      `Os pedidos podem ser enviados para ${instituto.contato.email}.`,
    ],
  },
  {
    titulo: "Segurança e retenção",
    paragrafos: [
      "O portal usa conexão criptografada (HTTPS), controle de acesso por perfil, registro de alterações e rotina de backup.",
      "Os dados são mantidos pelo tempo necessário às finalidades acima e pelos prazos exigidos por lei.",
    ],
  },
  {
    titulo: "Cookies",
    paragrafos: [
      "O portal usa apenas os cookies necessários ao seu funcionamento. Recursos de terceiros que exijam cookies adicionais, como mapas incorporados, só são carregados mediante consentimento.",
    ],
  },
];

export default function Privacidade() {
  return (
    <>
      <CapaPagina
        sobretitulo="LGPD"
        titulo="Política de Privacidade"
        texto="Como o Instituto Educacional Araujo Dutra coleta, usa e protege dados pessoais."
      />

      <Secao fundo="branco">
        <Container estreito>
          <Aviso titulo="Minuta para revisão jurídica" tom="pendente">
            Este texto é uma minuta construída a partir das funcionalidades previstas para o portal. Antes de
            publicar, o Instituto precisa indicar o encarregado pelo tratamento de dados (DPO) e submeter o
            documento a revisão jurídica.
          </Aviso>

          <div className="mt-10 space-y-10">
            {secoes.map((secao) => (
              <section key={secao.titulo}>
                <h2 className="text-2xl font-semibold">{secao.titulo}</h2>
                <div className="mt-4 space-y-3 leading-relaxed text-tinta-suave">
                  {secao.paragrafos.map((paragrafo) => (
                    <p key={paragrafo}>{paragrafo}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-2xl font-semibold">Encarregado pelo tratamento de dados</h2>
              <p className="mt-4 leading-relaxed text-tinta-suave">
                A indicação do encarregado (DPO) está pendente. O nome e o canal de contato serão publicados
                aqui assim que o Instituto definir o responsável.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Responsável</h2>
              <p className="mt-4 leading-relaxed text-tinta-suave">
                {instituto.nome} — CNPJ {instituto.cnpj}
                <br />
                {instituto.endereco.completo}
                <br />
                {instituto.contato.email} · {instituto.contato.telefone}
              </p>
            </section>
          </div>
        </Container>
      </Secao>
    </>
  );
}
