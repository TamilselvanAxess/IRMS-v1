import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  UserCheck,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Analytics Dashboard',
      icon: BarChart3,
      path: '/analytics',
      description: 'View detailed analytics and reports'
    },
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      description: 'Main dashboard overview'
    },
    {
      name: 'Users List',
      icon: Users,
      path: '/users',
      description: 'Manage system users'
    },
    {
      name: 'Participants',
      icon: UserCheck,
      path: '/participants',
      description: 'View and manage participants'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        shadow-xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">IRMS</span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`
                    w-5 h-5 transition-colors
                    ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}
                  `} />
                  
                  {!isCollapsed && (
                    <div className="ml-3 flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              IRMS v1.0.0
            </div>
          </div>
        )}
      </div>

      {/* Main Content Wrapper */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        ${isOpen ? 'ml-64' : 'ml-0'}
      `}>
        {/* This div will be used to push content when sidebar is open on mobile */}
      </div>
    </>
  );
};

export default Sidebar; 