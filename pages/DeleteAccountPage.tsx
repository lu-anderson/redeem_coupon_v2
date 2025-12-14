import React, { useState } from 'react';
import { Trash2, AlertTriangle, Mail } from 'lucide-react';
import { createDeletionRequest } from '../services/deletionRequestService';

const DeleteAccountPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email?.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Criar a solicitação no Firebase
      await createDeletionRequest(email);
      
      setSubmitStatus('success');
      setEmail('');
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
      
      // Mostrar mensagem de erro mais específica
      if (error.message?.includes('já existe uma solicitação')) {
        console.log('Mostrando alerta de solicitação existente');
        alert(error.message);
      }
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitação de Exclusão de Conta
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
            <p>A exclusão da sua conta é permanente e não pode ser desfeita. Todos os seus dados serão removidos de nossos servidores.</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Como solicitar a exclusão da sua conta</h2>
          <p className="text-gray-700 mb-4">
            Para solicitar a exclusão da sua conta e dados associados ao <strong>Affetto</strong>, siga as etapas abaixo:
          </p>
          
          <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
            <li className="pl-2">
              <strong>Informe o e-mail da sua conta:</strong> Insira no formulário abaixo o endereço de e-mail que você utilizou para criar sua conta no Affetto (Google ou Apple Sign-In).
            </li>
            <li className="pl-2">
              <strong>Envie a solicitação:</strong> Clique no botão "Enviar Solicitação" para confirmar.
            </li>
            <li className="pl-2">
              <strong>Confirme por e-mail:</strong> Você receberá um e-mail ao qual deverá responder ou clicar no link de confirmação para validar sua solicitação de exclusão.
            </li>
            <li className="pl-2">
              <strong>Aguarde o processamento:</strong> Após a confirmação via e-mail, sua conta e dados serão excluídos em até 30 dias.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dados que serão excluídos</h2>
          <p className="text-gray-700 mb-3">Ao solicitar a exclusão da conta, os seguintes dados serão permanentemente removidos:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Informações de perfil (nome, e-mail, foto)</li>
            <li>Todos os cupons criados por você</li>
            <li>Histórico de cupons resgatados</li>
            <li>Mensagens e personalizações associadas à sua conta</li>
            <li>Preferências e configurações do aplicativo</li>
            <li>Dados de autenticação (Google ou Apple Sign-In)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dados que podem ser mantidos</h2>
          <p className="text-gray-700 mb-3">
            Podemos reter temporariamente algumas informações por razões legais, de segurança ou para prevenir fraudes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>
              <strong>Logs de segurança:</strong> Mantidos por até 90 dias para fins de auditoria e segurança
            </li>
            <li>
              <strong>Dados de transações:</strong> Caso haja obrigações fiscais ou legais, podem ser mantidos pelo período exigido por lei (geralmente até 5 anos)
            </li>
            <li>
              <strong>Dados agregados e anônimos:</strong> Estatísticas não identificáveis podem ser mantidas para fins de análise e melhorias do serviço
            </li>
          </ul>
          <p className="text-gray-700 text-sm italic">
            Após o período de armazenamento necessário, todos os dados remanescentes serão permanentemente excluídos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Formulário de Solicitação</h2>
          
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">✓ Solicitação enviada com sucesso!</p>
              <p className="text-green-700 text-sm mt-1">
                Um e-mail será enviado para <strong>{email || 'seu endereço'}</strong> por favor responda para confirmar a exclusão da sua conta.
              </p>
              <p className="text-green-700 text-sm mt-1">
              </p>
              <p className="text-green-700 text-sm mt-1">
                Verifique sua caixa de entrada (e spam) e clique no link dentro de 7 dias.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">✗ Erro ao enviar solicitação</p>
              <p className="text-red-700 text-sm mt-1">
                Por favor, tente novamente ou entre em contato diretamente pelo e-mail: luanderson.engsoftware@gmail.com
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                E-mail associado à sua conta *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              />
              <p className="text-sm text-gray-500 mt-2">
                Este deve ser o mesmo e-mail usado para fazer login no aplicativo (Google ou Apple).
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Ao clicar em "Enviar Solicitação", você confirma que deseja excluir permanentemente sua conta e todos os dados associados.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {' '}
                  Enviando...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Enviar Solicitação de Exclusão
                </>
              )}
            </button>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dúvidas ou problemas?</h2>
          <p className="text-gray-700 mb-3">
            Se você tiver qualquer dúvida sobre o processo de exclusão ou encontrar problemas, entre em contato conosco:
          </p>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              <strong>E-mail de suporte:</strong>{' '}
              <a href="mailto:luanderson.engsoftware@gmail.com" className="text-blue-600 hover:underline">
                luanderson.engsoftware@gmail.com
              </a>
            </li>
          </ul>
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
          <p>© 2025 Affetto – Desenvolvido por Luanderson Santos</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
