import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Spinner, useToast } from '../../components/common';

const Login = ({
  title = 'IRMS',
  subtitle = 'Sign in to your account',
  fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      validation: (value) => {
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      }
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      validation: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      }
    }
  ],
  buttonText = 'Sign In',
  bgVideoSrc = '/blackhole.webm',
  overlayVideoSrc,
  logoIcon = <Users className="w-6 h-6 text-white cursor-pointer" />,
  forgetPassword = true,
  onForgetPassword,
  footer,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading } = useAppSelector((state) => state.auth);
  const { success, error: showErrorToast } = useToast();
  
  const [values, setValues] = useState(
    Object.fromEntries(fields.map(f => [f.name, '']))
  );
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      // Format error message for better user experience
      const formattedError = formatErrorMessage(error);
      showErrorToast(formattedError, { duration: 4000 });
    }
  }, [error, showErrorToast]);

  // Validate all fields
  const validate = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.validation) {
        const error = field.validation(values[field.name], values);
        if (error) newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setValues(v => ({ ...v, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(e => ({ ...e, [name]: '' }));
    }
  };

  // Helper function to format error messages
  const formatErrorMessage = (errorMessage) => {
    const error = errorMessage.toLowerCase();
    
    // Handle specific error cases
    if (error.includes('invalid credentials') || 
        error.includes('wrong password') ||
        error.includes('incorrect password')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    } else if (error.includes('user not found') ||
               error.includes('email not found') ||
               error.includes('user does not exist')) {
      return 'Email address not found. Please check your email or create a new account.';
    } else if (error.includes('password') && error.includes('incorrect')) {
      return 'Incorrect password. Please try again or use "Forgot Password" to reset.';
    } else if (error.includes('email') && error.includes('invalid')) {
      return 'Invalid email format. Please enter a valid email address.';
    } else if (error.includes('network') ||
               error.includes('connection') ||
               error.includes('timeout')) {
      return 'Connection error. Please check your internet connection and try again.';
    } else if (error.includes('server') || error.includes('internal')) {
      return 'Server error. Please try again later or contact support.';
    } else if (error.includes('unauthorized') || error.includes('401')) {
      return 'Authentication failed. Please check your credentials.';
    } else if (error.includes('forbidden') || error.includes('403')) {
      return 'Access denied. Please contact support if this persists.';
    } else if (error.includes('not found') || error.includes('404')) {
      return 'Service not found. Please try again later.';
    } else {
      // Default error message
      return errorMessage;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validate()) {
      // Show toast for validation errors
      const firstError = Object.values(errors)[0];
      if (firstError) {
        showErrorToast(firstError, { duration: 3000 });
      }
      return;
    }
    
    if (loading) return;
    
    try {
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        // Show success toast and let router handle navigation
        success('Login successful! Welcome back!', { duration: 3000 });
        console.log('Login successful:', result.payload);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    if (onForgetPassword) {
      onForgetPassword();
    } else {
      navigate('/forgot-password');
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-white text-lg font-medium animate-pulse">
              Signing you in...
            </p>
            <p className="mt-2 text-white/70 text-sm">
              Please wait while we authenticate your credentials
            </p>
          </div>
        </div>
      )}

      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 rotate-180 top-[-50%]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
          style={{
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
          }}
        >
          <source src={bgVideoSrc} type="video/webm" />
        </video>
      </div>
      {/* Overlay Video (optional) */}
      {overlayVideoSrc && (
        <div className="absolute inset-0 w-full h-full z-5 top-[50%]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
            style={{
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%, transparent 100%)',
            }}
          >
            <source src={overlayVideoSrc} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Content */}
      <main className="absolute inset-0 z-50 w-full h-full flex items-center justify-center lg:justify-around p-4">
        <div className="hidden lg:block w-1/3">
          <img src="https://v-accel.ai/hero-bg.svg" alt="description" className="w-full h-auto" />
        </div>
        <form
          className="bg-white/0 border border-white/10 p-8 rounded-2xl shadow-3xl flex flex-col gap-4 min-w-[320px] max-w-[90vw] w-full sm:w-[400px] transition-all duration-300"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 transition-transform duration-200 hover:scale-105">
              {logoIcon}
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          {fields.map(field => (
            <div key={field.name} className="transition-all duration-200">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={
                    field.type === 'password'
                      ? showPassword
                        ? 'text'
                        : 'password'
                      : field.type
                  }
                  value={values[field.name]}
                  onChange={e => handleChange(field.name, e.target.value)}
                  className={`w-full pl-4 pr-4 bg-transparent text-gray-500 backdrop-blur-lg shadow-inner py-3 border border-gray-700 rounded-lg focus:outline-none  hover:border-blue-500 transition-all duration-200 cursor-text ${
                    errors[field.name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  } ${loading ? 'opacity-75' : ''}`}
                  placeholder={field.placeholder}
                  required
                  disabled={loading}
                />
                {field.icon && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                    {field.icon}
                  </span>
                )}
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1 animate-pulse">{errors[field.name]}</p>
              )}
            </div>
          ))}
          {/* Forgot password option */}
          {forgetPassword && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-400 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full mt-5 bg-gradient-to-r to-blue-600 from-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" className="mr-2" />
                Signing in...
              </div>
            ) : (
              buttonText
            )}
          </button>
          {footer && <div className="mt-4">{footer}</div>}
        </form>
      </main>
    </div>
  );
};

export default Login;