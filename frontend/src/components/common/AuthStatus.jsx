import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, checkAuthStatus } from '../../store/slices/authSlice';
import { Button, Alert } from './index';
import { LogOut, User, Shield } from 'lucide-react';

const AuthStatus = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, token } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCheckAuth = () => {
    dispatch(checkAuthStatus());
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-800">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="space-y-4">
        <Alert type="success" title="Authenticated" icon={<Shield className="w-4 h-4" />}>
          You are logged in as <strong>{user.name}</strong> ({user.email})
        </Alert>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">User Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckAuth}
            icon={<User className="w-4 h-4" />}
          >
            Refresh Auth Status
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert type="info" title="Not Authenticated" icon={<User className="w-4 h-4" />}>
        You are not currently logged in. Use the login or register form above to authenticate.
      </Alert>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Auth State:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? 'Present' : 'None'}</p>
          <p><strong>Token:</strong> {token ? 'Present' : 'None'}</p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCheckAuth}
        icon={<User className="w-4 h-4" />}
      >
        Check Auth Status
      </Button>
    </div>
  );
};

export default AuthStatus; 