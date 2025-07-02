import React, { useState } from 'react';
import { BarChart2, LayoutDashboard, Users, UsersRound, Menu, X, HelpCircle, LogOut, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, setLogoutLoading } from '../../store/slices/authSlice';
import { LogoutModal } from '../common';
import { useToast } from '../common';

const navLinks = [
  { id: 1, name: 'Analytics Dashboard', icon: <BarChart2 size={20} />, to: '/analytics' },
  { id: 2, name: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/dashboard' },
  { id: 3, name: 'Users List', icon: <Users size={20} />, to: '/users' },
  { id: 4, name: 'Participants', icon: <UsersRound size={20} />, to: '/participants' },
];

const Sidebar = ({ open, onClose, sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, logoutLoading } = useAppSelector((state) => state.auth);
  const { success } = useToast();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    if (logoutLoading) return; // Prevent multiple clicks
    
    dispatch(setLogoutLoading(true));
    // Show success toast immediately
    success('Logged out successfully! See you soon!', { duration: 3000 });
    
    // Small delay to show the logout state, then logout
    setTimeout(() => {
      dispatch(logout());
      setShowLogoutModal(false);
    }, 300);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleMenuClick = (item) => {
    navigate(item.to);
    onClose(); // Close sidebar on mobile when item is clicked
  };

  return (
    <>
      {/* Sidebar Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-gray-800/50 transform transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          md:translate-x-0 md:static md:block
          ${sidebarOpen ? 'md:w-64' : 'md:w-20'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Close Button (mobile) */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200/50 dark:border-gray-800/50">
          <span className="font-bold text-lg text-gray-800 dark:text-white">Menu</span>
          <button 
            onClick={onClose} 
            aria-label="Close sidebar"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-6 py-8 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="relative">
              <img 
                src="/src/assets/newimages/Irmslogo.svg" 
                alt="Logo" 
                className={`transition-all duration-300 ${sidebarOpen ? 'w-10 h-10' : 'w-8 h-8'}`} 
              />
              {!sidebarOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-900"></div>
              )}
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">IRMS</span>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-1"></div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to);
              return (
                <div
                  key={link.id}
                  onClick={() => handleMenuClick(link)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {link.icon}
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                      {link.name}
                    </span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-20 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg">
                      {link.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="space-y-2">
              <div
                onClick={toggleSidebar}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200"
              >
                <div className="transition-transform duration-200 group-hover:scale-105">
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                {sidebarOpen && (
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Toggle Sidebar</span>
                )}
              </div>
              
              <div
                onClick={() => navigate("/help")}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200"
              >
                <div className="transition-transform duration-200 group-hover:scale-105">
                  <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                {sidebarOpen && (
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Get Help</span>
                )}
              </div>
              
              <div
                onClick={handleLogoutClick}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              >
                <div className="transition-transform duration-200 group-hover:scale-105">
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600" />
                </div>
                {sidebarOpen && (
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium group-hover:text-red-600">Log Out</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </>
  );
};

export default Sidebar; 