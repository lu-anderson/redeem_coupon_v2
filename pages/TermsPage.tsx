import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📄 Termos de Uso – Affetto
        </h1>
        
        <div className="text-sm text-gray-600 mb-8">
          <p><strong>Última atualização:</strong> 08/12/2025</p>
          <p><strong>Aplicativo:</strong> Affetto – Cupons Afetivos</p>
          <p><strong>Desenvolvedor:</strong> Luanderson Santos</p>
          <p><strong>Idade mínima de uso:</strong> 18 anos</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
          <p className="text-gray-700 mb-3">
            Ao utilizar o aplicativo Affetto, você declara que:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Leu e concorda com estes Termos de Uso.</li>
            <li>Possui 18 anos ou mais.</li>
            <li>Concorda com a coleta e uso de dados conforme descrito na Política de Privacidade.</li>
            <li>Utilizará o app apenas para fins pessoais e lícitos.</li>
          </ul>
          <p className="text-gray-700 font-semibold">
            Se você não concorda com algum ponto destes Termos, não utilize o aplicativo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
          <p className="text-gray-700 mb-3">
            O Affetto é um aplicativo que permite:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Criar cupons afetivos personalizados</li>
            <li>Compartilhar cupons com parceiros por meio de link</li>
            <li>Ver cupons recebidos</li>
            <li>Utilizar cupons e acompanhar quantidades</li>
            <li>Receber notificações sobre resgates e atualizações</li>
          </ul>
          <p className="text-gray-700">
            O serviço é destinado a uso recreativo entre adultos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Requisitos de Idade</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>O uso é permitido exclusivamente para maiores de 18 anos.</li>
            <li>Não coletamos intencionalmente dados de menores.</li>
            <li>Contas identificadas como pertencentes a menores serão removidas.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Conta e Autenticação</h2>
          <p className="text-gray-700 mb-3">
            Para usar o Affetto, você deve:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Criar uma conta via Google ou Apple</li>
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Manter sua conta segura</li>
            <li>Não compartilhar sua conta ou credenciais com terceiros</li>
          </ul>
          <p className="text-gray-700 font-semibold">
            O usuário é responsável por qualquer atividade executada em sua conta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Uso Permitido</h2>
          <p className="text-gray-700 mb-3">
            Ao utilizar o Affetto, você concorda em <strong>NÃO</strong>:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Utilizar o app para fins ilegais, ofensivos ou prejudiciais</li>
            <li>Tentar acessar dados de outros usuários</li>
            <li>Criar, compartilhar ou exibir conteúdo abusivo ou discriminatório</li>
            <li>Engajar em engenharia reversa, ataques, scraping ou tentativas de manipular o sistema</li>
            <li>Criar automações ou bots para interagir com o app</li>
          </ul>
          <p className="text-gray-700 font-semibold">
            Violação dessas regras pode resultar em suspensão ou exclusão da conta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Compartilhamento de Cupons</h2>
          <p className="text-gray-700 mb-3">
            Ao gerar um link de compartilhamento:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Você é responsável por enviá-lo apenas para pessoas de confiança.</li>
            <li>Qualquer pessoa com o link poderá visualizar o cupom.</li>
            <li>O Affetto não se responsabiliza pelo uso indevido de links compartilhados por você.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
          <p className="text-gray-700 mb-3">
            Todos os elementos do aplicativo (código, design, marca e funcionalidades) pertencem ao desenvolvedor do Affetto.
          </p>
          <p className="text-gray-700 mb-3">
            É proibido:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Copiar, modificar ou distribuir partes do app</li>
            <li>Criar produtos derivados sem autorização</li>
            <li>Reproduzir identidade visual, marca ou funcionalidades sem permissão</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Notificações</h2>
          <p className="text-gray-700 mb-3">
            O Affetto utiliza notificações push para:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Informar sobre uso de cupons</li>
            <li>Avisos operacionais</li>
            <li>Funcionalidades relacionadas ao funcionamento do app</li>
          </ul>
          <p className="text-gray-700">
            Você pode desativar notificações nas configurações do sistema.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Conteúdo Criado pelo Usuário</h2>
          <p className="text-gray-700 mb-3">
            O usuário é responsável pelo conteúdo dos cupons que cria, incluindo textos e mensagens personalizadas.
          </p>
          <p className="text-gray-700 mb-3">
            O desenvolvedor não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Conteúdo ofensivo criado por usuários</li>
            <li>Uso inadequado entre terceiros</li>
            <li>Consequências emocionais, pessoais ou legais decorrentes do uso do app</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitação de Responsabilidade</h2>
          <p className="text-gray-700 mb-3">
            Você concorda que o uso do Affetto é por sua conta e risco.
          </p>
          <p className="text-gray-700 mb-3">
            O desenvolvedor não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Perda de dados causada por fatores externos</li>
            <li>Uso inadequado do app</li>
            <li>Compartilhamento de links com terceiros</li>
            <li>Problemas técnicos fora do controle (falhas de rede, serviços Firebase, etc.)</li>
            <li>Conflitos pessoais entre usuários decorrentes de cupons ou interações</li>
          </ul>
          <p className="text-gray-700 font-semibold">
            O app é fornecido "como está".
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Suspensão ou Encerramento da Conta</h2>
          <p className="text-gray-700 mb-3">
            O desenvolvedor pode suspender ou deletar contas que:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Violarem estes Termos</li>
            <li>Forem usadas para fins inadequados</li>
            <li>Apresentarem atividade suspeita</li>
            <li>Pertencerem a menores de idade</li>
          </ul>
          <p className="text-gray-700 mb-3">
            O usuário pode solicitar exclusão da conta a qualquer momento pelo e-mail:
          </p>
          <p className="text-gray-700 font-semibold">
            📧 <a href="mailto:luanderson.engsoftware@gmail.com" className="text-blue-600 hover:underline">luanderson.engsoftware@gmail.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Atualizações do Aplicativo</h2>
          <p className="text-gray-700 mb-3">
            O Affetto pode receber atualizações periódicas para:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Correções de bugs</li>
            <li>Melhoria de desempenho</li>
            <li>Novas funcionalidades</li>
            <li>Alterações de design</li>
          </ul>
          <p className="text-gray-700">
            O uso contínuo após atualizações implica concordância com as mudanças.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Alterações nos Termos</h2>
          <p className="text-gray-700 mb-3">
            Estes Termos podem ser atualizados. A versão mais recente sempre estará disponível nesta página.
          </p>
          <p className="text-gray-700">
            O uso contínuo do app após alterações significa que você concorda com os novos termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contato</h2>
          <p className="text-gray-700 mb-3">
            Para dúvidas, problemas, solicitações ou questões legais:
          </p>
          <p className="text-gray-700">
            <strong>Luanderson Santos</strong><br />
            📩 <a href="mailto:luanderson.engsoftware@gmail.com" className="text-blue-600 hover:underline">luanderson.engsoftware@gmail.com</a>
          </p>
        </section>

        <div className="border-t pt-6 mt-8">
          <p className="text-sm text-gray-600 text-center">
            © 2025 Affetto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
