import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Input = ({ 
  label, 
  error, 
  className = '', 
  icon,
  rightIcon,
  variant = 'default',
  size = 'md',
  placeholder,
  ...props 
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variantClasses = {
    default: `
      ${isDark 
        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/80' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
      }
    `,
    glass: `
      ${isDark 
        ? 'bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/15' 
        : 'bg-white/80 backdrop-blur-lg border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white/90'
      }
    `,
    minimal: `
      ${isDark 
        ? 'bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
        : 'bg-transparent border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
      }
    `
  };

  const inputClasses = `
    w-full border-2 rounded-xl font-medium cursor-text
    transition-none
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error 
      ? isDark 
        ? 'border-red-400 focus:ring-red-500 focus:border-red-400' 
        : 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : isDark 
        ? 'focus:ring-blue-500/50' 
        : 'focus:ring-blue-500/25'
    }
    ${icon ? 'pl-12' : 'pl-4'}
    ${rightIcon ? 'pr-12' : 'pr-4'}
    py-4
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-30 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {icon}
          </div>
        )}
        <input
          className={inputClasses}
          placeholder={placeholder}
          {...props}
        />
        {rightIcon && (
          <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-30 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center space-x-1">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Input; 