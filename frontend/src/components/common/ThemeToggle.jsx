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
      className={`transition-all duration-300 flex items-center justify-center w-11 h-11 rounded-xl shadow-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="relative flex items-center justify-center transition-all duration-300">
        <Sun
          className={`absolute transition-all duration-300 w-5 h-5 ${isDark ? 'opacity-100 scale-100 rotate-0 text-yellow-400' : 'opacity-0 scale-75 rotate-45 text-gray-400'}`}
        />
        <Moon
          className={`absolute transition-all duration-300 w-5 h-5 ${!isDark ? 'opacity-100 scale-100 rotate-0 text-blue-500' : 'opacity-0 scale-75 -rotate-45 text-gray-400'}`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle; 