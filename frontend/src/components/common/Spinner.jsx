import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Spinner = ({ 
  className = '', 
  size = 'md',
  variant = 'default',
  text,
  ...props 
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: isDark ? 'text-blue-400' : 'text-blue-600',
    primary: isDark ? 'text-blue-400' : 'text-blue-600',
    secondary: isDark ? 'text-gray-400' : 'text-gray-600',
    success: 'text-green-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500'
  };

  const spinnerClasses = `
    animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `.replace(/\s+/g, ' ').trim();

  const spinnerVariants = {
    dots: (
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    ),
    pulse: (
      <div className={`${sizeClasses[size]} rounded-full bg-current animate-pulse`}></div>
    ),
    ring: (
      <svg className={spinnerClasses} fill="none" viewBox="0 0 24 24" {...props}>
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ),
    bars: (
      <div className="flex space-x-1">
        <div className="w-1 bg-current animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
        <div className="w-1 bg-current animate-pulse" style={{ animationDelay: '0.1s', animationDuration: '1s' }}></div>
        <div className="w-1 bg-current animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
        <div className="w-1 bg-current animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '1s' }}></div>
      </div>
    )
  };

  const spinner = spinnerVariants[variant] || spinnerVariants.ring;

  if (text) {
    return (
      <div className="flex flex-col items-center space-y-3">
        {spinner}
        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {text}
        </span>
      </div>
    );
  }

  return spinner;
};

// Spinner variants for different use cases
Spinner.Dots = (props) => <Spinner variant="dots" {...props} />;
Spinner.Pulse = (props) => <Spinner variant="pulse" {...props} />;
Spinner.Ring = (props) => <Spinner variant="ring" {...props} />;
Spinner.Bars = (props) => <Spinner variant="bars" {...props} />;

export default Spinner; 