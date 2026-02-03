import '@taloon/nowpayments-components/styles';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { NowPaymentsProvider } from '@taloon/nowpayments-components';
// import BitcoinChipsProvider from './context/DataContext'
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { AuthProvider } from './hooks/useLogInHook.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <NowPaymentsProvider apiKey="6HWSMB8-2KH4AFP-KFXNNSF-NNQP9FT">
        <App />
      </NowPaymentsProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
