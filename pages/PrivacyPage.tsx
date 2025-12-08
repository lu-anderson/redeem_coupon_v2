import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📜 Política de Privacidade – Affetto (Google Play)
        </h1>
        
        <div className="text-sm text-gray-600 mb-8">
          <p><strong>Última atualização:</strong> 07/12/2025</p>
          <p><strong>Aplicativo:</strong> Affetto – Cupons Afetivos</p>
          <p><strong>Desenvolvedor:</strong> Luanderson Santos</p>
          <p><strong>Idade mínima para uso:</strong> 18 anos</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações Gerais</h2>
          <p className="text-gray-700 mb-3">
            O <strong>Affetto</strong> é um aplicativo criado para que casais possam criar, compartilhar e usar cupons afetivos.
          </p>
          <p className="text-gray-700 mb-3">
            Esta Política de Privacidade explica como os dados são coletados, utilizados e protegidos de acordo com as diretrizes da Google Play, LGPD, GDPR e demais regulamentações aplicáveis.
          </p>
          <p className="text-gray-700">
            Ao usar o Affetto, você declara que possui 18 anos ou mais e concorda com esta política.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Idade Mínima</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>O Affetto é destinado exclusivamente a adultos (18+).</li>
            <li>Não coletamos intencionalmente dados de menores.</li>
            <li>Caso identifiquemos o uso por alguém com menos de 18 anos, a conta será removida por motivos de conformidade.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Dados Coletados</h2>
          <p className="text-gray-700 mb-4">Coletamos apenas informações necessárias para o funcionamento do app.</p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Dados fornecidos pelo usuário</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Nome, e-mail e foto de perfil (via Google ou Apple)</li>
            <li>Dados dos cupons criados (nome, categoria, quantidade, validade)</li>
            <li>Informações sobre uso de cupons</li>
            <li>Mensagens personalizadas (opcionais)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Dados coletados automaticamente</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Identificador para envio de notificações push</li>
            <li>Dados técnicos do dispositivo (modelo, sistema operacional, idioma)</li>
            <li>Versão do aplicativo</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Dados de links compartilhados</h3>
          <p className="text-gray-700">
            Ao compartilhar um cupom, um link único é gerado.
            O destinatário pode visualizar apenas informações essenciais sobre aquele cupom.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Finalidade do Uso de Dados</h2>
          <p className="text-gray-700 mb-3">Os dados coletados são utilizados para:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Autenticar o usuário via Google/Apple</li>
            <li>Criar, gerenciar e sincronizar cupons na conta do usuário</li>
            <li>Permitir que cupons sejam visualizados por links compartilhados</li>
            <li>Enviar notificações push quando cupons forem usados ou atualizados</li>
            <li>Melhorar o desempenho e corrigir falhas do app</li>
          </ul>
          <p className="text-gray-700 font-semibold">
            Não exibimos anúncios e não vendemos dados para terceiros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
          <p className="text-gray-700 mb-4">Os dados só são compartilhados com serviços essenciais ao funcionamento:</p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1. Firebase (Google)</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Firestore (banco de dados)</li>
            <li>Authentication</li>
            <li>Cloud Messaging (notificações)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Google e Apple</h3>
          <p className="text-gray-700 mb-4">Utilizados apenas para login seguro.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Expo</h3>
          <p className="text-gray-700 mb-4">Utilizado para gerenciar notificações push.</p>

          <p className="text-gray-700 font-semibold">
            Não há compartilhamento com anunciantes ou terceiros para fins comerciais.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Segurança dos Dados</h2>
          <p className="text-gray-700 mb-3">Utilizamos medidas de segurança fornecidas pelo Firebase:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Criptografia em repouso e em trânsito</li>
            <li>Regras de Firestore que restringem acesso aos dados do usuário</li>
            <li>Tokens de autenticação seguros</li>
          </ul>
          <p className="text-gray-700">
            Mesmo adotando medidas robustas, nenhum sistema é 100% infalível.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Armazenamento e Retenção</h2>
          <p className="text-gray-700 mb-3">
            Os dados permanecem armazenados enquanto sua conta estiver ativa.
          </p>
          <p className="text-gray-700">
            Caso deseje excluir sua conta, todos os seus dados serão removidos de forma permanente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Notificações Push</h2>
          <p className="text-gray-700 mb-3">Utilizamos notificações para:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Informar sobre resgates de cupons</li>
            <li>Atualizações importantes</li>
          </ul>
          <p className="text-gray-700">
            Você pode desativar notificações nas configurações do aparelho ou do app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Direitos do Usuário</h2>
          <p className="text-gray-700 mb-3">Você pode, a qualquer momento:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Solicitar acesso aos seus dados</li>
            <li>Solicitar correção</li>
            <li>Solicitar exclusão da conta</li>
            <li>Revogar consentimento</li>
          </ul>
          <p className="text-gray-700">
            Para isso, entre em contato pelo e-mail abaixo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Exclusão de Conta e Dados</h2>
          <p className="text-gray-700 mb-3">Para solicitar exclusão de todos os seus dados:</p>
          <p className="text-gray-700 mb-4">
            📧 <a href="mailto:luanderson.engsoftware@gmal.com" className="text-blue-600 hover:underline">luanderson.engsoftware@gmal.com</a>
          </p>
          <p className="text-gray-700 mb-3">A exclusão inclui:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Conta</li>
            <li>Cupons criados</li>
            <li>Histórico de uso</li>
            <li>Tokens de notificação</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contato</h2>
          <p className="text-gray-700 mb-2">Para dúvidas sobre privacidade ou solicitações formais:</p>
          <p className="text-gray-700">
            <strong>Luanderson Santos</strong><br />
            📧 <a href="mailto:luanderson.engsoftware@gmal.com" className="text-blue-600 hover:underline">luanderson.engsoftware@gmal.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Alterações nesta Política</h2>
          <p className="text-gray-700 mb-3">
            Esta política pode ser atualizada periodicamente.
          </p>
          <p className="text-gray-700">
            Alterações significativas serão publicadas nesta página.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
