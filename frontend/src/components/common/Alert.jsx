import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  children, 
  className = '', 
  dismissible = false,
  onDismiss,
  title,
  ...props 
}) => {
  const { isDark } = useTheme();

  const alertConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      colors: isDark 
        ? 'bg-green-900/20 border-green-500/30 text-green-400' 
        : 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      colors: isDark 
        ? 'bg-red-900/20 border-red-500/30 text-red-400' 
        : 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      colors: isDark 
        ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' 
        : 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      colors: isDark 
        ? 'bg-blue-900/20 border-blue-500/30 text-blue-400' 
        : 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const config = alertConfig[type];

  const alertClasses = `
    relative p-4 rounded-xl border-2 backdrop-blur-sm
    transition-all duration-300 ease-out
    ${config.colors}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-semibold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h4>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 p-1 rounded-lg transition-colors duration-200 cursor-pointer ${
              isDark 
                ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Alert variants for different use cases
Alert.Success = (props) => <Alert type="success" {...props} />;
Alert.Error = (props) => <Alert type="error" {...props} />;
Alert.Warning = (props) => <Alert type="warning" {...props} />;
Alert.Info = (props) => <Alert type="info" {...props} />;

export default Alert; 