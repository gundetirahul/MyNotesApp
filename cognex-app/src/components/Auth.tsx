import React, { useState } from 'react';
import { Eye, EyeOff, Brain } from 'lucide-react';
import { signInAnonymous, signInWithEmail, signUpWithEmail } from '../services/firebase';
import { useAppStore } from '../store';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'anonymous'>('anonymous');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser, setError: setGlobalError } = useAppStore();

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await signInAnonymous();
      setUser(user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in anonymously');
      setGlobalError(err.message || 'Failed to sign in anonymously');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = mode === 'signin' 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
      setUser(user);
    } catch (err: any) {
      setError(err.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`);
      setGlobalError(err.message || `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Brain size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Cognex
          </h1>
          <p className="text-gray-600 dark:text-dark-400">
            Your personal knowledge management system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Anonymous Sign In */}
        {mode === 'anonymous' && (
          <div className="space-y-4">
            <button
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Getting Started...' : 'Get Started (Anonymous)'}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-dark-400">
                  or
                </span>
              </div>
            </div>

            <button
              onClick={() => setMode('signin')}
              className="w-full border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              Sign in with email
            </button>
          </div>
        )}

        {/* Email Authentication */}
        {(mode === 'signin' || mode === 'signup') && (
          <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading 
                ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
              
              <div>
                <button
                  type="button"
                  onClick={() => setMode('anonymous')}
                  className="text-gray-500 dark:text-dark-400 hover:underline text-sm"
                >
                  Continue as guest
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600 text-center">
          <p className="text-xs text-gray-500 dark:text-dark-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;