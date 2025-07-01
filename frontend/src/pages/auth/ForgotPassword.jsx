import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { forgotPassword, clearError } from '../../store/slices/authSlice';

const ForgotPassword = ({
  title = 'IRMS',
  subtitle = 'Reset your password',
  bgVideoSrc = '/blackhole.webm',
  overlayVideoSrc,
  logoIcon = <Mail className="w-6 h-6 text-white" />,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, passwordResetSent } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    return '';
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError('');
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }
    
    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      console.log('Password reset email sent successfully');
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearError());
    navigate('/login');
  };

  if (passwordResetSent) {
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
              Check Your Email
            </h1>
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-300">
                📧 Check your email inbox (and spam folder) for the reset link
              </p>
              <p className="text-xs text-gray-400 mt-2">
                The link will expire in 1 hour for security
              </p>
            </div>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r to-blue-600 from-purple-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:shadow-2xl transition-all duration-200 cursor-pointer"
            >
              Back to Login
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
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                className={`w-full pl-10 pr-4 bg-transparent text-gray-500 backdrop-blur-lg shadow-inner py-3 border border-gray-700 rounded-lg hover:border-blue-500 focus:outline-none transition-all duration-200 cursor-text ${emailError ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                <Mail className="w-5 h-5" />
              </span>
            </div>
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
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
                Sending...
              </div>
            ) : (
              'Send Reset Link'
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

export default ForgotPassword; 