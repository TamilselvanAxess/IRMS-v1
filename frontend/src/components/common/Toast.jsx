import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose, 
  position = 'top-right',
  className = '',
  index = 0
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (isExiting) return; // Prevent multiple calls
    
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [isExiting, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-center justify-between p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform";
    
    const typeStyles = {
      success: "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200",
      error: "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200",
      warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200",
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200"
    };

    const positionStyles = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const animationStyles = isExiting 
      ? 'opacity-0 scale-95 translate-x-full' 
      : 'opacity-100 scale-100 translate-x-0';

    return `${baseStyles} ${typeStyles[type]} ${positionStyles[position]} ${animationStyles} ${className}`;
  };

  const getPositionStyle = () => {
    const baseOffset = 16; // 4 * 4px (top-4/bottom-4)
    const spacing = 80; // 80px between toasts
    const offset = baseOffset + (index * spacing);

    switch (position) {
      case 'top-right':
        return { top: offset, right: 16 };
      case 'top-left':
        return { top: offset, left: 16 };
      case 'bottom-right':
        return { bottom: offset, right: 16 };
      case 'bottom-left':
        return { bottom: offset, left: 16 };
      case 'top-center':
        return { top: offset, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-center':
        return { bottom: offset, left: '50%', transform: 'translateX(-50%)' };
      default:
        return { top: offset, right: 16 };
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed z-50 min-w-[320px] max-w-[420px] ${getStyles()}`} 
      style={{ 
        ...getPositionStyle(),
        zIndex: 1000 + index 
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 