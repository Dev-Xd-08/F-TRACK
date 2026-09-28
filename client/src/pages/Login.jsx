import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeButton from '../components/ui/AnimeButton';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Client-side validation
    if (!email.trim()) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setValidationError('Password is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedError = validationError || error;

  return (
    <div className="min-h-screen bg-void text-bone-100 architectural-grid flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-crimson-950/15 rounded-full blur-3xl opacity-35" />
      </div>

      {/* Top Header / Back to Home */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-orbitron font-semibold tracking-wider text-ash-400 hover:text-bone-100 transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </Link>
      </header>

      {/* Main Authentication Chamber */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded p-8 sm:p-10 bg-charcoal-900 border border-steel-700 shadow-steel-card overflow-hidden"
        >
          {/* Top Line & Industrial Corners */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-800" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-steel-700" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-steel-700" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-steel-700" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-steel-700" />

          {/* Chamber Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-charcoal-800 border border-steel-700 text-bone-100 shadow-steel-card mb-2">
              <Shield className="w-6 h-6 text-crimson-600" />
            </div>

            <h1 className="font-orbitron font-black text-2xl tracking-wide text-bone-100 uppercase">
              SIGN IN TO{' '}
              <span className="text-crimson-600">
                F-TRACK
              </span>
            </h1>

            <p className="text-xs font-sans text-ash-400">
              Access your personal training telemetry and journey progress.
            </p>
          </div>

          {/* Error Alert Box */}
          {displayedError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded bg-crimson-950/60 border border-crimson-800/80 flex items-start gap-2.5 text-xs text-crimson-400 font-mono"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{displayedError}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-ash-300">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-void border border-steel-700 text-bone-100 placeholder-ash-500 text-sm focus:outline-none focus:border-crimson-800 focus:ring-1 focus:ring-crimson-800 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-ash-300">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded bg-void border border-steel-700 text-bone-100 placeholder-ash-500 text-sm focus:outline-none focus:border-crimson-800 focus:ring-1 focus:ring-crimson-800 transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ash-400 hover:text-bone-100 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <AnimeButton
                type="submit"
                variant="crimson"
                size="lg"
                icon={Zap}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
              </AnimeButton>
            </div>
          </form>

          {/* Footer Portal Link */}
          <div className="mt-8 pt-6 border-t border-steel-800 text-center text-xs">
            <span className="text-ash-400 font-sans">New to F-TRACK? </span>
            <Link
              to="/register"
              className="font-orbitron font-bold text-bone-100 hover:text-crimson-400 hover:underline tracking-wider"
            >
              Create your account
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer System Specs */}
      <footer className="relative z-10 text-center py-4 text-[10px] font-mono text-ash-500">
        <span>F-TRACK AUTHENTICATION PROTOCOL • SECURE TELEMETRY ACTIVE</span>
      </footer>
    </div>
  );
};

export default Login;
