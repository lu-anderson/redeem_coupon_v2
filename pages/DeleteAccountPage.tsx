import React from 'react';
import { Trash2, AlertTriangle, Mail } from 'lucide-react';

const DeleteAccountPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Exclusão de Conta
          </h1>
        </div>

        <div className="text-sm text-gray-600 mb-8">
          <p><strong>Aplicativo:</strong> Affetto – Cupons Afetivos</p>
          <p><strong>Desenvolvedor:</strong> Luanderson Santos</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Atenção!</p>
            <p>A exclusão da sua conta é permanente e não pode ser desfeita. Depois de processada, os dados da sua conta no Affetto são removidos dos nossos servidores.</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Como excluir a conta no aplicativo</h2>
          <p className="text-gray-700 mb-4">
            Se você ainda tem o Affetto instalado, a exclusão é feita no próprio aplicativo e acontece na hora:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
            <li className="pl-2">
              Abra o Affetto e entre na sua conta.
            </li>
            <li className="pl-2">
              Na tela inicial (a saudação “Olá, …!”), toque no menu da conta no canto superior direito (ícone de três pontos, identificado como “Menu da conta”), o mesmo menu de “Sair”.
            </li>
            <li className="pl-2">
              Toque em “Excluir conta”, leia o aviso e confirme. A exclusão é imediata: você sai da conta e os dados listados abaixo são apagados.
            </li>
          </ol>
          <p className="text-gray-700 mb-3">
            Se a conta foi criada com Sign in with Apple e a exclusão é feita no iPhone, o Affetto pede uma nova confirmação com a Apple e revoga os tokens de Sign in with Apple antes de apagar os dados.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Como solicitar por e-mail</h2>
          <p className="text-gray-700 mb-4">
            Se você não tem o aplicativo instalado, ou não consegue entrar na conta, envie um e-mail para o suporte solicitando a exclusão. Informe o endereço de e-mail da sua conta Affetto (cadastro com e-mail/senha, Google Sign-In ou Sign in with Apple, inclusive um e-mail de retransmissão privada da Apple, se for o caso). Pedidos por e-mail são analisados e processados em até 30 dias.
          </p>
          <p className="text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            <strong>E-mail de suporte:</strong> 
            <a href="mailto:luanderson.engsoftware@gmail.com" className="text-blue-600 hover:underline">
              luanderson.engsoftware@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dados que são excluídos</h2>
          <p className="text-gray-700 mb-3">
            Na exclusão pelo aplicativo, e também quando o pedido por e-mail é processado, removemos de forma permanente:
          </p>
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
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">O que não é cancelado nem apagado pelo Affetto</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 mb-4">
            <li>
              <strong>Assinatura da App Store ou do Google Play:</strong> uma assinatura ativa não é cancelada com a exclusão da conta. Cancele nas configurações da loja: 
              <a href="https://apps.apple.com/account/subscriptions" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                gerenciar assinaturas da App Store
              </a>
               (iPhone) ou 
              <a href="https://play.google.com/store/account/subscriptions" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                gerenciar assinaturas do Google Play
              </a>
               (Android).
            </li>
            <li>
              <strong>Registros de pagamento da loja:</strong> a Apple e o Google mantêm os próprios registros da assinatura. O Affetto não tem acesso a esses dados financeiros completos e não os armazena depois que a conta é excluída.
            </li>
            <li>
              <strong>Catálogo compartilhado de modelos de cupons:</strong> não é um dado da sua conta e não é apagado.
            </li>
          </ul>
          <p className="text-gray-700">
            Se a conta foi criada com a Apple e a exclusão não foi feita no iPhone, revogue também o Affetto em Ajustes &gt; [seu nome] &gt; Iniciar Sessão com a Apple &gt; Affetto &gt; Deixar de usar o ID Apple.
          </p>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Documentos Relacionados</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/privacy"
              className="text-blue-600 hover:underline font-medium"
            >
              📜 Política de Privacidade
            </a>
            <a
              href="/terms"
              className="text-blue-600 hover:underline font-medium"
            >
              📋 Termos de Uso
            </a>
          </div>
        </section>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Affetto – Desenvolvido por Luanderson Santos</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
