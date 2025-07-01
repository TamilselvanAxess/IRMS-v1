import React, { useState } from 'react';
import apiService from '../../services/api/apiService';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      console.log('Testing API connection...');
      const response = await apiService.get('/health');
      console.log('API test successful:', response);
      setTestResult(`✅ API connection successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('API test failed:', error);
      setTestResult(`❌ API connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      console.log('Testing login...');
      const response = await apiService.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Login test successful:', response);
      setTestResult(`✅ Login test successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('Login test failed:', error);
      setTestResult(`❌ Login test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testApiConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health Endpoint'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
      </div>
      
      {testResult && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Result:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 