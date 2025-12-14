import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RedeemPage from './pages/RedeemPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DeleteAccountPage from './pages/DeleteAccountPage';

const App: React.FC = () => {
  return (
    // BrowserRouter permite URLs no formato https://dominio/redeem/id
    // Nota: Isso requer que o servidor redirecione todas as rotas para index.html
    <BrowserRouter>
      <Routes>
        {/* Rota de Política de Privacidade */}
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* Rota de Termos de Uso */}
        <Route path="/terms" element={<TermsPage />} />
        
        {/* Rota de Exclusão de Conta */}
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        
        {/* Rota correta (inglês) */}
        <Route path="/redeem/:id" element={<RedeemPage />} />
        
        {/* Rota alternativa para suportar o erro de digitação comum 'reedem' mencionado na descrição */}
        <Route path="/reedem/:id" element={<RedeemPage />} />

        {/* Página inicial ou fallback */}
        <Route path="/" element={
          <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-gray-400">
            <p>Link inválido. Por favor, use o link compartilhado com você.</p>
          </div>
        } />
        
        {/* Redireciona qualquer outra rota desconhecida para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;