import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import { Sidebar, Header } from './components/layout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import UsersList from './pages/users/UsersList';
import Participants from './pages/participants/Participants';
import Demo from './pages/Demo';

function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeMobileSidebar = () => setMobileOpen(false);
  const openMobileSidebar = () => setMobileOpen(true);

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar 
        open={mobileOpen} 
        onClose={closeMobileSidebar} 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Fixed Header */}
        <Header onToggleSidebar={openMobileSidebar} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
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
        
      {/* Protected routes with layout */}
        <Route path="/dashboard" element={
        isAuthenticated ? (
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        ) : <Navigate to="/login" replace />
        } />
        <Route path="/analytics" element={
        isAuthenticated ? (
          <ProtectedLayout>
            <AnalyticsDashboard />
          </ProtectedLayout>
        ) : <Navigate to="/login" replace />
        } />
        <Route path="/users" element={
        isAuthenticated ? (
          <ProtectedLayout>
            <UsersList />
          </ProtectedLayout>
        ) : <Navigate to="/login" replace />
        } />
        <Route path="/participants" element={
        isAuthenticated ? (
          <ProtectedLayout>
            <Participants />
          </ProtectedLayout>
        ) : <Navigate to="/login" replace />
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
  );
}

export default App;
