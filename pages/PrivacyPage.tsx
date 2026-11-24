import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📜 Política de Privacidade – Affetto
        </h1>
        
        <div className="text-sm text-gray-600 mb-8">
          <p><strong>Última atualização:</strong> 23/11/2026</p>
          <p><strong>Aplicativo:</strong> Affetto – Cupons Afetivos (Google Play e App Store)</p>
          <p><strong>Desenvolvedor:</strong> Luanderson Santos</p>
          <p><strong>Idade mínima para uso:</strong> 18 anos</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informações Gerais</h2>
          <p className="text-gray-700 mb-3">
            O <strong>Affetto</strong> é um aplicativo criado para que casais maiores de idade possam criar, compartilhar e usar cupons afetivos.
          </p>
          <p className="text-gray-700 mb-3">
            Esta Política de Privacidade explica como os dados são coletados, utilizados e protegidos de acordo com as diretrizes da Google Play, da App Store, LGPD, GDPR e demais regulamentações aplicáveis. Ela vale para o aplicativo (iOS e Android) e para o site de resgate de cupons.
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
            <li><strong>Cadastro com e-mail e senha:</strong> nome de exibição, endereço de e-mail e senha (armazenada de forma segura pelo Firebase Authentication)</li>
            <li><strong>Login com Google:</strong> nome, e-mail e foto de perfil fornecidos pela conta Google</li>
            <li><strong>Login com a Apple (somente iOS):</strong> nome (quando você optar por compartilhá-lo), endereço de e-mail (o e-mail da sua conta Apple ou um e-mail privado do serviço “Ocultar meu e-mail” da Apple, no domínio privaterelay.appleid.com) e o identificador de usuário da Apple. O nome e o e-mail são enviados pela Apple apenas na primeira autorização do aplicativo; nas sessões seguintes, o Affetto reutiliza os dados já salvos no seu perfil. A Apple não envia foto de perfil.</li>
            <li>Dados dos cupons criados (nome, categoria, quantidade, validade)</li>
            <li>Informações sobre uso de cupons</li>
            <li>Mensagens personalizadas (opcionais)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Dados coletados automaticamente</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Identificador para envio de notificações push (token Expo Push)</li>
            <li>Dados técnicos do dispositivo (modelo, sistema operacional, idioma), coletados principalmente pelo Firebase Analytics</li>
            <li>Versão do aplicativo</li>
            <li>Identificadores de publicidade (como o IDFA no iOS), somente se você autorizar o rastreamento no aviso de App Tracking Transparency (ATT)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Dados de links compartilhados</h3>
          <p className="text-gray-700 mb-4">
            Ao compartilhar um cupom, um link único é gerado.
            O destinatário pode visualizar apenas informações essenciais sobre aquele cupom.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4. Dados de assinaturas premium</h3>
          <p className="text-gray-700 mb-3">
            O Affetto oferece assinaturas premium processadas pela Google Play (Android) ou pela App Store (iOS), via RevenueCat. Podemos armazenar o identificador e o status da assinatura, datas de compra e expiração, identificadores de transação, valor, moeda e o vínculo entre a sua conta Affetto (Firebase UID) e a conta da loja.
          </p>
          <p className="text-gray-700">
            Dados de pagamento (cartão de crédito, etc.) são processados exclusivamente pela Google Play ou pela App Store. O Affetto não tem acesso a essas informações.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Finalidade do Uso de Dados</h2>
          <p className="text-gray-700 mb-3">Os dados coletados são utilizados para:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Autenticar o usuário via e-mail/senha, Google Sign-In ou Sign in with Apple (iOS)</li>
            <li>Criar, gerenciar e sincronizar cupons na conta do usuário</li>
            <li>Permitir que cupons sejam visualizados por links compartilhados</li>
            <li>Enviar notificações push quando cupons forem usados ou atualizados</li>
            <li>Processar e gerenciar assinaturas premium</li>
            <li>Medir o uso do aplicativo e melhorar o desempenho (Firebase Analytics)</li>
            <li>Atribuir instalações e assinaturas a campanhas, quando houver a sua autorização</li>
          </ul>
          <p className="text-gray-700 font-semibold">
            Não exibimos anúncios no aplicativo e não vendemos dados para terceiros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
          <p className="text-gray-700 mb-4">Os dados só são compartilhados com serviços essenciais ao funcionamento:</p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1. Firebase (Google)</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Firestore (banco de dados)</li>
            <li>Authentication (e-mail/senha, Google Sign-In e Sign in with Apple no iOS)</li>
            <li>Cloud Messaging e Cloud Functions (notificações e eventos de assinatura)</li>
            <li>Analytics (medição de uso do aplicativo; não usamos esses dados para anúncios no app)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Google Sign-In</h3>
          <p className="text-gray-700 mb-4">Utilizado exclusivamente para login seguro com a conta Google.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Sign in with Apple</h3>
          <p className="text-gray-700 mb-3">
            No iOS, o Affetto também oferece login com a Apple, além do cadastro com e-mail e senha e do Google Sign-In. A autenticação é processada pela Apple e pelo Firebase Authentication.
          </p>
          <p className="text-gray-700 mb-3">Quando você escolhe entrar com a Apple, podemos receber:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>o nome que você autorizar a compartilhar;</li>
            <li>o endereço de e-mail da sua conta Apple, ou um e-mail privado de retransmissão da Apple (“Ocultar meu e-mail”), no domínio privaterelay.appleid.com, se você optar por ocultar o e-mail real;</li>
            <li>o identificador de usuário da Apple, usado pelo Firebase Authentication para reconhecer sua conta nas próximas sessões.</li>
          </ul>
          <p className="text-gray-700 mb-3">
            Esses dados são usados exclusivamente para criar e autenticar sua conta no Affetto, exibir seu nome de perfil e, quando necessário, entrar em contato com você (por exemplo, sobre a exclusão da conta). Não usamos o login com a Apple para anúncios.
          </p>
          <p className="text-gray-700 mb-3">
            A Apple pode ocultar o seu e-mail real. Nesse caso, o Affetto armazena apenas o endereço de retransmissão, que passa a ser o e-mail da sua conta no aplicativo. Use esse mesmo endereço para entrar no app ou no pedido de exclusão por e-mail.
          </p>
          <p className="text-gray-700 mb-4">
            Você pode revogar o acesso do Affetto ao seu ID Apple a qualquer momento em <strong>Ajustes &gt; [seu nome] &gt; Iniciar Sessão com a Apple &gt; Affetto &gt; Deixar de usar o ID Apple</strong> (em inglês: Settings &gt; Apple ID &gt; Sign in with Apple). A revogação encerra o login com a Apple neste aplicativo. Para apagar os dados que o Affetto já armazenou, exclua a conta no aplicativo ou solicite a exclusão por e-mail na página de exclusão. Ao excluir a conta no iOS, o Affetto pede uma nova confirmação com a Apple e revoga os tokens de Sign in with Apple antes de apagar os dados. Se a exclusão não for feita no iPhone, a revogação pode ser feita nesses mesmos Ajustes.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.4. RevenueCat</h3>
          <p className="text-gray-700 mb-4">
            Processa assinaturas no aplicativo, valida transações com a Google Play e a App Store, e envia eventos de assinatura ao nosso backend. O identificador da sua conta Affetto (Firebase UID) é vinculado à sua conta RevenueCat para gerenciar o status premium.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.5. Expo (notificações push)</h3>
          <p className="text-gray-700 mb-4">
            Utilizado para registrar e entregar notificações push. O token Expo Push é transmitido ao serviço Expo para encaminhamento à Google Play ou à App Store.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">5.6. Meta (SDK e atribuição)</h3>
          <p className="text-gray-700 mb-4">
            Usamos o SDK da Meta e a integração de atribuição do RevenueCat para medir instalações e assinaturas de campanhas. Não exibimos anúncios no Affetto e não registramos compras diretamente pelo SDK da Meta. Identificadores de publicidade (como o IDFA) só são coletados e encaminhados se você autorizar o rastreamento no aviso de App Tracking Transparency. Sem essa permissão, a atribuição pode ocorrer de forma limitada, sem o identificador de publicidade.
          </p>

          <p className="text-gray-700 font-semibold">
            Não vendemos dados para terceiros e não compartilhamos dados para que anúncios sejam exibidos dentro do Affetto.
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
            Caso deseje excluir sua conta, os dados pessoais da conta no Affetto são removidos de forma permanente, conforme a seção 10. Uma assinatura ativa da App Store ou do Google Play não é cancelada, e os registros de pagamento permanecem com a loja. O catálogo compartilhado de modelos de cupons não é um dado da sua conta e não é apagado.
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
            Para isso, exclua a conta no aplicativo, use a página de exclusão ou entre em contato pelo e-mail abaixo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Exclusão de Conta e Dados</h2>
          <p className="text-gray-700 mb-3">
            Você pode excluir a conta a qualquer momento no aplicativo, ou solicitar a exclusão por e-mail se não puder usar o app.
          </p>
          <p className="text-gray-700 mb-3">
            No Affetto, abra a tela inicial, toque no menu da conta no canto superior direito (ícone de três pontos, “Menu da conta”) e em “Excluir conta”. A exclusão pelo aplicativo é imediata. No iOS, se a conta foi criada com a Apple, o Affetto confirma com a Apple e revoga os tokens de Sign in with Apple antes de apagar os dados.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-900 font-semibold mb-2">📝 Instruções e pedido por e-mail:</p>
            <a 
              href="/delete-account" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Acessar a página de exclusão de conta →
            </a>
          </div>
          <p className="text-gray-700 mb-3">Ou escreva para o e-mail de suporte, informando o e-mail da sua conta. Pedidos por e-mail são processados em até 30 dias:</p>
          <p className="text-gray-700 mb-4">
            📧 <a href="mailto:luanderson.engsoftware@gmail.com" className="text-blue-600 hover:underline">luanderson.engsoftware@gmail.com</a>
          </p>
          <p className="text-gray-700 mb-3">A exclusão no Affetto remove de forma permanente:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>O perfil (nome, e-mail e foto)</li>
            <li>Os cupons que você criou</li>
            <li>O histórico de uso dos cupons</li>
            <li>Notificações</li>
            <li>Avaliações e feedback</li>
            <li>Tokens de notificação push</li>
            <li>Os registros de compras e de assinatura salvos no Affetto</li>
            <li>A conta de login</li>
          </ul>
          <p className="text-gray-700">
            Uma assinatura ativa da App Store ou do Google Play não é cancelada: cancele nas configurações da loja. Os registros de pagamento da loja permanecem com a Apple ou com o Google. O catálogo compartilhado de modelos de cupons não é apagado.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contato</h2>
          <p className="text-gray-700 mb-2">Para dúvidas sobre privacidade ou solicitações formais:</p>
          <p className="text-gray-700">
            <strong>Luanderson Santos</strong><br />
            📧 <a href="mailto:luanderson.engsoftware@gmail.com" className="text-blue-600 hover:underline">luanderson.engsoftware@gmail.com</a>
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
