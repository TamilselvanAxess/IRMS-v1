import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { Button, Input, Alert } from '../common';

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Clear Redux error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const { confirmPassword, ...registrationData } = formData;
    const result = await dispatch(registerUser(registrationData));
    
    if (registerUser.fulfilled.match(result)) {
      console.log('Registration successful:', result.payload);
      // You can redirect here or show success message
    }
  };

  if (isAuthenticated) {
    return (
      <div className="text-center p-8">
        <Alert type="success" title="Registration Successful!">
          You have been successfully registered and logged in.
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join us today!</p>
      </div>

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          icon={<User className="w-4 h-4" />}
          error={errors.username}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={<Lock className="w-4 h-4" />}
          error={errors.password}
          required
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          icon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword}
          required
          endIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm; 