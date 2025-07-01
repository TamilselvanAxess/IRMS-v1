import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { checkAuthStatus, logout, loginUser, registerUser, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is logged in on app start
    if (token && !user) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, token, user]);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    return result.meta.requestStatus === 'fulfilled' 
      ? { success: true } 
      : { success: false, error: result.payload };
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    return result.meta.requestStatus === 'fulfilled' 
      ? { success: true } 
      : { success: false, error: result.payload };
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    loading,
    error,
    login,
    logout: handleLogout,
    register,
    clearError: clearAuthError,
    isAuthenticated,
  };
}; 