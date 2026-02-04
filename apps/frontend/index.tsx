import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Get Google Client ID from environment
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';

const root = ReactDOM.createRoot(rootElement);

// Wrap app and conditionally include GoogleOAuthProvider
const AppWrapper: React.FC = () => {
  React.useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will not work.');
    }
  }, []);

  const appContent = (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );

  // Only wrap with GoogleOAuthProvider if client ID is provided
  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {appContent}
        <Toaster />
      </GoogleOAuthProvider>
    );
  }

  return (
    <>
      {appContent}
      <Toaster />
    </>
  );
};

try {
  root.render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  root.render(
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p>{(error as Error)?.message || 'An unexpected error occurred'}</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
}