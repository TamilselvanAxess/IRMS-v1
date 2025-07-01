import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Check } from 'lucide-react';

const Checkbox = ({ 
  label, 
  className = '', 
  size = 'md',
  variant = 'default',
  error,
  ...props 
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const variantClasses = {
    default: `
      ${isDark 
        ? 'border-gray-600 bg-gray-800/50 checked:bg-blue-500 checked:border-blue-500' 
        : 'border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-500'
      }
    `,
    glass: `
      ${isDark 
        ? 'border-white/20 bg-white/10 backdrop-blur-sm checked:bg-blue-500 checked:border-blue-500' 
        : 'border-gray-200 bg-white/80 backdrop-blur-sm checked:bg-blue-500 checked:border-blue-500'
      }
    `,
    minimal: `
      ${isDark 
        ? 'border-gray-600 bg-transparent checked:bg-blue-500 checked:border-blue-500' 
        : 'border-gray-300 bg-transparent checked:bg-blue-500 checked:border-blue-500'
      }
    `
  };

  const checkboxClasses = `
    ${sizeClasses[size]}
    appearance-none border-2 rounded-lg transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantClasses[variant]}
    ${error 
      ? isDark 
        ? 'border-red-400 focus:ring-red-500' 
        : 'border-red-500 focus:ring-red-500'
      : isDark 
        ? 'focus:ring-blue-500/50' 
        : 'focus:ring-blue-500/25'
    }
    ${props.checked ? 'relative' : ''}
  `.replace(/\s+/g, ' ').trim();

  const labelClasses = `
    ${labelSizeClasses[size]}
    font-medium cursor-pointer select-none
    ${isDark ? 'text-gray-200' : 'text-gray-700'}
    ${error ? 'text-red-500 dark:text-red-400' : ''}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          className={checkboxClasses}
          {...props}
        />
        {props.checked && (
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
            isDark ? 'text-white' : 'text-white'
          }`}>
            <Check className={`${sizeClasses[size]} p-0.5`} />
          </div>
        )}
      </div>
      
      {label && (
        <label className={labelClasses} htmlFor={props.id}>
          {label}
        </label>
      )}
      
      {error && (
        <div className="mt-1 flex items-center space-x-1">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

// Checkbox group component for multiple checkboxes
Checkbox.Group = ({ children, className = '', ...props }) => {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Checkbox; 