import React from 'react';
import { Spinner } from './index';

const LoadingScreen = ({ 
  message = 'Loading...', 
  size = 'lg',
  className = '',
  variant = 'default'
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-300 ${className}`}>
      <div className="text-center">
        <Spinner size={size} variant={variant} />
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 