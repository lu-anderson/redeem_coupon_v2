import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RedeemPage from './pages/RedeemPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import HomePage from './pages/HomePage';
import { trackPageView } from './services/analytics';

/** Sends a GA4 page_view when the path or query string changes. */
const PageViewTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    void trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

const App: React.FC = () => {
  return (
    // BrowserRouter supports share links at https://<host>/redeem/<couponId>.
    // The host must fall back to index.html for app routes. Real files, including
    // the Search Console verification file, are served as themselves.
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/redeem/:id" element={<RedeemPage />} />
        {/* Older shared links used this spelling. Keep it working. */}
        <Route path="/reedem/:id" element={<RedeemPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
