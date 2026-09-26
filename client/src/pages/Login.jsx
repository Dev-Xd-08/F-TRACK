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
      setValidationError('Enter a valid communication crystal email address.');
      return;
    }

    if (!password) {
      setValidationError('Warrior access password is required.');
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
    <div className="min-h-screen bg-void text-slate-100 cyber-grid flex flex-col justify-between relative overflow-hidden">
      {/* Background Energy Matrix & Concentric Neon Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-violet-neon/15 via-cyan-neon/10 to-transparent rounded-full blur-3xl opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-crimson-aura/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Top Header / Back to Realm */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-orbitron font-semibold tracking-wider text-slate-400 hover:text-cyan-neon transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO OVERWORLD</span>
        </Link>
      </header>

      {/* Main Authentication Chamber */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-8 sm:p-10 bg-obsidian/85 backdrop-blur-xl border border-violet-neon/30 shadow-[0_0_40px_rgba(139,92,246,0.2)] overflow-hidden"
        >
          {/* Top Beam & Cyber Corners */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-neon via-violet-neon to-crimson-aura" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-neon" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-violet-neon" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-crimson-aura" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gold-mythic" />

          {/* Chamber Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-neon p-0.5 shadow-glow-cyan mb-2">
              <div className="w-full h-full bg-void rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-neon" />
              </div>
            </div>

            <h1 className="font-orbitron font-black text-2xl tracking-wide text-slate-100 uppercase">
              ENTER THE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-cyan">
                ASCENSION
              </span>
            </h1>

            <p className="text-xs font-sans text-slate-400">
              Return to your training realm.
            </p>
          </div>

          {/* Error Alert Box */}
          {displayedError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-lg bg-crimson-aura/10 border border-crimson-aura/40 flex items-start gap-2.5 text-xs text-crimson-aura font-mono"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{displayedError}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                COMMUNICATION CRYSTAL (EMAIL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="warrior@realm.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                ACCESS CIPHER (PASSWORD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
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
                variant="cyan"
                size="lg"
                icon={Zap}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'SYNCHRONIZING...' : 'ENTER ASCENSION'}
              </AnimeButton>
            </div>
          </form>

          {/* Footer Portal Link */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs">
            <span className="text-slate-400 font-sans">New warrior? </span>
            <Link
              to="/register"
              className="font-orbitron font-bold text-cyan-neon hover:underline tracking-wider"
            >
              Create your account
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer System Specs */}
      <footer className="relative z-10 text-center py-4 text-[10px] font-mono text-slate-500">
        <span>F-TRACK AUTHENTICATION PROTOCOL • 256-BIT ENCRYPTION ACTIVE</span>
      </footer>
    </div>
  );
};

export default Login;
