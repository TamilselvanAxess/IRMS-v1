import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import UsersList from './pages/users/UsersList';
import Participants from './pages/participants/Participants';
import Demo from './pages/Demo';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/forgot-password" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
        } />
        <Route path="/reset-password/:token" element={
          isAuthenticated ? <Navigate to="/login" replace /> : <ResetPassword />
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/analytics" element={
          isAuthenticated ? <AnalyticsDashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/users" element={
          isAuthenticated ? <UsersList /> : <Navigate to="/login" replace />
        } />
        <Route path="/participants" element={
          isAuthenticated ? <Participants /> : <Navigate to="/login" replace />
        } />
        
        {/* Demo route */}
        <Route path="/demo" element={<Demo />} />
        
        {/* Default redirects */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;
