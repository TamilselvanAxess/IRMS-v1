import React from 'react';
import { useToast } from './index';
import { Button } from './index';

const ToastDemo = () => {
  const { success, error, warning, info } = useToast();

  const showToast = (type, message, position = 'top-right') => {
    switch (type) {
      case 'success':
        success(message, { position, duration: 3000 });
        break;
      case 'error':
        error(message, { position, duration: 3000 });
        break;
      case 'warning':
        warning(message, { position, duration: 3000 });
        break;
      case 'info':
        info(message, { position, duration: 3000 });
        break;
      default:
        success(message, { position, duration: 3000 });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Toast Notifications Demo</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Click the buttons below to see different types of toast notifications.
        </p>
      </div>

      {/* Toast Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Toast Types</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => showToast('success', 'Operation completed successfully!')}
            variant="success"
          >
            Success Toast
          </Button>
          <Button
            onClick={() => showToast('error', 'Something went wrong. Please try again.')}
            variant="danger"
          >
            Error Toast
          </Button>
          <Button
            onClick={() => showToast('warning', 'Please review your input before proceeding.')}
            variant="warning"
          >
            Warning Toast
          </Button>
          <Button
            onClick={() => showToast('info', 'Here is some helpful information.')}
            variant="primary"
          >
            Info Toast
          </Button>
        </div>
      </div>

      {/* Toast Positions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Toast Positions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            onClick={() => showToast('success', 'Top Right Toast', 'top-right')}
            size="sm"
          >
            Top Right
          </Button>
          <Button
            onClick={() => showToast('info', 'Top Left Toast', 'top-left')}
            size="sm"
          >
            Top Left
          </Button>
          <Button
            onClick={() => showToast('warning', 'Top Center Toast', 'top-center')}
            size="sm"
          >
            Top Center
          </Button>
          <Button
            onClick={() => showToast('success', 'Bottom Right Toast', 'bottom-right')}
            size="sm"
          >
            Bottom Right
          </Button>
          <Button
            onClick={() => showToast('error', 'Bottom Left Toast', 'bottom-left')}
            size="sm"
          >
            Bottom Left
          </Button>
          <Button
            onClick={() => showToast('info', 'Bottom Center Toast', 'bottom-center')}
            size="sm"
          >
            Bottom Center
          </Button>
        </div>
      </div>

      {/* Multiple Toasts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Multiple Toasts</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              success('First toast message!');
              setTimeout(() => error('Second toast message!'), 500);
              setTimeout(() => warning('Third toast message!'), 1000);
              setTimeout(() => info('Fourth toast message!'), 1500);
            }}
            variant="secondary"
          >
            Show Multiple Toasts
          </Button>
        </div>
      </div>

      {/* Custom Messages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Messages</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => success('Welcome to IRMS! Your session has been restored.')}
            variant="success"
          >
            Welcome Message
          </Button>
          <Button
            onClick={() => error('Network connection lost. Please check your internet connection.')}
            variant="danger"
          >
            Network Error
          </Button>
          <Button
            onClick={() => warning('Your session will expire in 5 minutes. Please save your work.')}
            variant="warning"
          >
            Session Warning
          </Button>
          <Button
            onClick={() => info('New features are available! Check out the latest updates.')}
            variant="primary"
          >
            Update Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo; 