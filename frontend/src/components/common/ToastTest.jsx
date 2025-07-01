import React from 'react';
import { useToast } from './index';

const ToastTest = () => {
  const { success, error, warning, info } = useToast();

  const testCloseFunctionality = () => {
    success('This toast can be closed by clicking the X button!', { duration: 3000 });
  };

  const testAutoClose = () => {
    success('This toast will auto-close in 3 seconds', { duration: 3000 });
  };

  const testMultipleToasts = () => {
    success('First toast - click X to close', { duration: 3000 });
    setTimeout(() => error('Second toast - click X to close', { duration: 3000 }), 500);
    setTimeout(() => warning('Third toast - click X to close', { duration: 3000 }), 1000);
    setTimeout(() => info('Fourth toast - click X to close', { duration: 3000 }), 1500);
  };

  const testStacking = () => {
    // Show multiple toasts quickly to test stacking
    success('Toast 1 - Success', { duration: 3000 });
    setTimeout(() => error('Toast 2 - Error', { duration: 3000 }), 200);
    setTimeout(() => warning('Toast 3 - Warning', { duration: 3000 }), 400);
    setTimeout(() => info('Toast 4 - Info', { duration: 3000 }), 600);
    setTimeout(() => success('Toast 5 - Another Success', { duration: 3000 }), 800);
  };

  const testDifferentPositions = () => {
    success('Top Right Toast', { position: 'top-right', duration: 3000 });
    setTimeout(() => error('Top Left Toast', { position: 'top-left', duration: 3000 }), 500);
    setTimeout(() => warning('Bottom Right Toast', { position: 'bottom-right', duration: 3000 }), 1000);
    setTimeout(() => info('Bottom Left Toast', { position: 'bottom-left', duration: 3000 }), 1500);
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Toast Stacking & Close Functionality Test</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Test the stacking functionality and close button (X) on different toast types. Toasts should stack vertically without overlapping.
      </p>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={testCloseFunctionality}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer"
        >
          Test Close Button
        </button>
        <button
          onClick={testAutoClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Test Auto Close
        </button>
        <button
          onClick={testMultipleToasts}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer"
        >
          Test Multiple Toasts
        </button>
        <button
          onClick={testStacking}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Test Stacking
        </button>
        <button
          onClick={testDifferentPositions}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors cursor-pointer"
        >
          Test Different Positions
        </button>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Individual Toast Types:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => success('Success toast - click X to close!', { duration: 3000 })}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors cursor-pointer"
          >
            Success
          </button>
          <button
            onClick={() => error('Error toast - click X to close!', { duration: 3000 })}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors cursor-pointer"
          >
            Error
          </button>
          <button
            onClick={() => warning('Warning toast - click X to close!', { duration: 3000 })}
            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors cursor-pointer"
          >
            Warning
          </button>
          <button
            onClick={() => info('Info toast - click X to close!', { duration: 3000 })}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Info
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Stacking Information:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Toasts now stack vertically with 80px spacing between them</li>
          <li>• Each toast has a unique z-index to ensure proper layering</li>
          <li>• Click the X button to close any toast individually</li>
          <li>• Toasts auto-close after their specified duration</li>
          <li>• Multiple toasts can be displayed simultaneously without overlapping</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastTest; 