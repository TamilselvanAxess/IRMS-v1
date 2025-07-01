import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'default',
  ...props 
}) => {
  const { isDark } = useTheme();

  const baseClasses = `
    rounded-2xl transition-all duration-300 ease-out
    ${hover ? 'hover:transform hover:scale-[1.02] hover:shadow-2xl' : ''}
  `;

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: `
      ${isDark 
        ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 shadow-xl' 
        : 'bg-white border border-gray-200 shadow-lg'
      }
    `,
    glass: `
      ${isDark 
        ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl'
      }
    `,
    elevated: `
      ${isDark 
        ? 'bg-gray-900/80 backdrop-blur-lg border border-gray-600/50 shadow-2xl' 
        : 'bg-white border border-gray-300 shadow-2xl'
      }
    `,
    minimal: `
      ${isDark 
        ? 'bg-transparent border border-gray-700/30' 
        : 'bg-transparent border border-gray-200'
      }
    `,
    gradient: `
      ${isDark 
        ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
      }
    `
  };

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card sub-components for better structure
Card.Header = ({ children, className = '', ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`mb-6 pb-4 ${isDark ? 'border-b border-gray-700/50' : 'border-b border-gray-200'} ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Title = ({ children, className = '', size = 'lg', ...props }) => {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };

  const titleClasses = `
    ${sizeClasses[size]}
    ${isDark ? 'text-white' : 'text-gray-900'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <h3 className={titleClasses} {...props}>
      {children}
    </h3>
  );
};

Card.Subtitle = ({ children, className = '', ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <p className={`text-sm mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'} ${className}`} {...props}>
      {children}
    </p>
  );
};

Card.Content = ({ children, className = '', ...props }) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className = '', ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card; 