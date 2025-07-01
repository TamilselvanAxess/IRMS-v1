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
      className={`theme-toggle cursor-pointer ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle; 