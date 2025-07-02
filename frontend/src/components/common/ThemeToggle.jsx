import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleTheme, selectIsDark } from '../../store/slices/themeSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectIsDark);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 focus:outline-none shadow-md bg-gradient-to-r ${isDark ? 'from-gray-700 to-gray-900' : 'from-yellow-200 to-yellow-400'} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{ minWidth: 56 }}
    >
      {/* Sun icon */}
      <span className={`absolute left-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-yellow-500'}`}>
        <Sun className="w-5 h-5" />
      </span>
      {/* Moon icon */}
      <span className={`absolute right-2 transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-gray-400'}`}>
        <Moon className="w-5 h-5" />
      </span>
      {/* Toggle thumb */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default ThemeToggle; 