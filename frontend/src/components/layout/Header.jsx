import React from 'react';
import { Menu, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import ThemeToggle from '../common/ThemeToggle';

const routeTitles = {
  '/analytics': 'Analytics Dashboard',
  '/dashboard': 'Dashboard',
  '/users': 'Users List',
  '/participants': 'Participants',
};

const Header = ({ onToggleSidebar, sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const title = routeTitles[Object.keys(routeTitles).find((key) => location.pathname.startsWith(key))] || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-lg flex items-center justify-between h-16 px-6 md:pl-72">
      {/* Left side - Mobile toggle button */}
      <div className="flex items-center">
        <button
          className="md:hidden mr-4 p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all duration-200"
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Right side - Modern theme toggle and user profile */}
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/80 dark:bg-gray-800/60 shadow-sm">
          <div className="relative">
            <img
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || "User")}&background=6366f1&color=fff&size=32`}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || "User")}&background=6366f1&color=fff&size=32`;
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></span>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {user?.name || user?.email || "User"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {user?.role === "admin" ? "Administrator" : 
               user?.role === "user" ? "User" : "Member"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 