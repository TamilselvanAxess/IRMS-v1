import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { resetPassword, clearError } from '../../store/slices/authSlice';

const ResetPassword = ({
  title = 'IRMS',
  subtitle = 'Set new password',
  bgVideoSrc = '/blackhole.webm',
  overlayVideoSrc,
  logoIcon = <Lock className="w-6 h-6 text-white" />,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, error, passwordResetSuccess } = useAppSelector((state) => state.auth);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (value) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError('');
    if (error) {
      dispatch(clearError());
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setConfirmPasswordError('');
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);
    
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }
    
    if (confirmPasswordValidation) {
      setConfirmPasswordError(confirmPasswordValidation);
      return;
    }
    
    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) {
      console.log('Password reset successfully');
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearError());
    navigate('/login');
  };

  if (passwordResetSuccess) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
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

        {/* Content */}
        <main className="absolute inset-0 z-50 w-full h-full flex items-center justify-center lg:justify-around p-4">
          <div className="hidden lg:block w-1/3">
            <img src="https://v-accel.ai/hero-bg.svg" alt="description" className="w-full h-auto" />
          </div>
          <div className="bg-white/0 border border-white/10 p-8 rounded-2xl shadow-3xl flex flex-col gap-4 min-w-[320px] max-w-[90vw] w-full sm:w-[400px] text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-4 mx-auto">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Password Reset Successfully
            </h1>
            <p className="text-gray-400 mb-6">
              Your password has been updated. You can now log in with your new password.
            </p>
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-300">
                ✅ Your password has been successfully reset
              </p>
              <p className="text-xs text-gray-400 mt-2">
                A confirmation email has been sent to your inbox
              </p>
            </div>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r to-blue-600 from-purple-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:shadow-2xl transition-all duration-200 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
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
          className="bg-white/0 border border-white/10 p-8 rounded-2xl shadow-3xl flex flex-col gap-4 min-w-[320px] max-w-[90vw] w-full sm:w-[400px]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              {logoIcon}
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                className={`w-full pl-10 pr-12 bg-transparent text-gray-500 backdrop-blur-lg shadow-inner py-3 border border-gray-700 rounded-lg focus:outline-none transition-all duration-200 cursor-text ${passwordError ? 'border-red-500' : ''}`}
                placeholder="Enter your new password"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                <Lock className="w-5 h-5" />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => handleConfirmPasswordChange(e.target.value)}
                className={`w-full pl-10 pr-12 bg-transparent text-gray-500 backdrop-blur-lg shadow-inner py-3 border border-gray-700 rounded-lg focus:outline-none transition-all duration-200 cursor-text ${confirmPasswordError ? 'border-red-500' : ''}`}
                placeholder="Confirm your new password"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                <Lock className="w-5 h-5" />
              </span>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(s => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-5 bg-gradient-to-r to-blue-600 from-purple-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 hover:shadow-xl border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>

          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full mt-2 flex items-center justify-center text-gray-400 hover:text-white transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default ResetPassword; 