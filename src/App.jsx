import React from 'react';
import { setupIonicReact, IonApp } from '@ionic/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CreateInvoice from './pages/CreateInvoice';
import MyInvoices from './pages/MyInvoices';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import InvoiceView from './pages/InvoiceView';
import ProtectedRoute from './components/ProtectedRoute';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import './index.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("⚠️ VITE_GOOGLE_CLIENT_ID is missing. Google Login will not work.");
  }

  return (
    <IonApp>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'missing-id'}>
        <AppThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardHome />} />
                  <Route path="create" element={<CreateInvoice />} />
                  <Route path="invoices" element={<MyInvoices />} />
                  <Route path="invoice/:id" element={<InvoiceView />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch-all route to handle typos like /lign */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Router>
          </LocalizationProvider>
        </AppThemeProvider>
      </GoogleOAuthProvider>
    </IonApp>
  );
}

