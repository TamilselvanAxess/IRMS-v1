import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false, 
  className = '', 
  icon,
  loading = false,
  ...props 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-300 ease-out transform cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-95
  `;
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-500
      ${isDark ? 'shadow-blue-500/25' : 'shadow-blue-500/20'}
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300
      text-gray-800 shadow-md hover:shadow-lg
      focus:ring-gray-500
      ${isDark ? 'from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white' : ''}
    `,
    outline: `
      bg-transparent border-2 border-blue-600 text-blue-600
      hover:bg-blue-600 hover:text-white
      focus:ring-blue-500
      ${isDark ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black' : ''}
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100
      focus:ring-gray-500
      ${isDark ? 'text-gray-300 hover:bg-gray-800' : ''}
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-500
      ${isDark ? 'shadow-green-500/25' : 'shadow-green-500/20'}
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
      ${isDark ? 'shadow-red-500/25' : 'shadow-red-500/20'}
    `
  };
  
  const buttonClass = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `.replace(/\s+/g, ' ').trim();
  
  return (
    <button 
      className={buttonClass} 
      onClick={onClick} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 