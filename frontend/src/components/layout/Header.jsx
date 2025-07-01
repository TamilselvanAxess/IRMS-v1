import React from 'react';
import ThemeToggle from '../common/ThemeToggle';

const Header = () => {
  return (
    <header className="glass border-b border-white/10">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gradient">IRMS</h1>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                    Profile
                  </a>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 