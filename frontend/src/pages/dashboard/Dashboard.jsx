import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, setLogoutLoading } from '../../store/slices/authSlice';
import { toggleTheme, selectIsDark } from '../../store/slices/themeSlice';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useToast, Spinner } from '../../components/common';
import { LogOut, User, Settings } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, logoutLoading } = useAppSelector((state) => state.auth);
  const isDark = useAppSelector(selectIsDark);
  const { success } = useToast();

  const handleLogout = async () => {
    if (logoutLoading) return; // Prevent multiple clicks
    
    dispatch(setLogoutLoading(true));
    // Show success toast immediately
    success('Logged out successfully! See you soon!', { duration: 3000 });
    
    // Small delay to show the logout state, then logout
    setTimeout(() => {
      dispatch(logout());
    }, 300);
  };

  // Show loading screen if user is not authenticated (prevent flickering)
  if (!isAuthenticated) {
    return null; // Let the router handle the redirect
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Logout Loading Overlay */}
      {logoutLoading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-white text-lg font-medium animate-pulse">
              Logging you out...
            </p>
            <p className="mt-2 text-white/70 text-sm">
              Please wait while we securely end your session
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div>
        {/* Header */}
       

        {/* Main Content */}
      
      </div>
    </div>
  );
};

export default Dashboard; 