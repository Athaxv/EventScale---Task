import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import EventMarketplace from './components/EventMarketplace';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <LoginRoute>
            <Login />
          </LoginRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard onLogout={logout} />
          </ProtectedRoute>
        } 
      />
      <Route path="/marketplace" element={<EventMarketplace />} />
    </Routes>
  );
};

// Redirect to admin if already logged in
const LoginRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

export default App;