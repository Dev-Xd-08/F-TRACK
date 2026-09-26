import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeButton from '../components/ui/AnimeButton';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    // Client-side validation
    if (!name.trim()) {
      setValidationError('Warrior name is required.');
      return;
    }

    if (!email.trim()) {
      setValidationError('Enter a valid communication crystal address.');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Enter a valid communication crystal address.');
      return;
    }

    if (!password) {
      setValidationError('Password must contain at least 6 characters.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password);
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-neon/15 via-violet-neon/10 to-transparent rounded-full blur-3xl opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold-mythic/10 rounded-full blur-3xl opacity-50" />
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

      {/* Main Registration Chamber */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-8 sm:p-10 bg-obsidian/85 backdrop-blur-xl border border-cyan-neon/30 shadow-[0_0_40px_rgba(0,245,255,0.2)] overflow-hidden"
        >
          {/* Top Beam & Cyber Corners */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-neon via-cyan-neon to-gold-mythic" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-violet-neon" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-neon" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gold-mythic" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-matrix-neon" />

          {/* Chamber Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-neon to-violet-neon p-0.5 shadow-glow-violet mb-2">
              <div className="w-full h-full bg-void rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-glow" />
              </div>
            </div>

            <h1 className="font-orbitron font-black text-2xl tracking-wide text-slate-100 uppercase">
              BEGIN YOUR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-glow via-white to-cyan-neon text-glow-violet">
                ASCENSION
              </span>
            </h1>

            <p className="text-xs font-sans text-slate-400">
              Create your warrior profile and begin your journey.
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Warrior Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                WARRIOR NAME (CALLSIGN)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. JinWoo"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors font-sans"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                ACCESS CIPHER (MIN 6 CHARS)
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
                  className="w-full pl-10 pr-10 py-2 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-colors font-sans"
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                CONFIRM ACCESS CIPHER
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <AnimeButton
                type="submit"
                variant="violet"
                size="lg"
                icon={Zap}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'AWAKENING PROFILE...' : 'AWAKEN'}
              </AnimeButton>
            </div>
          </form>

          {/* Footer Portal Link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs">
            <span className="text-slate-400 font-sans">Already have an account? </span>
            <Link
              to="/login"
              className="font-orbitron font-bold text-violet-glow hover:underline tracking-wider"
            >
              Enter Ascension
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer System Specs */}
      <footer className="relative z-10 text-center py-4 text-[10px] font-mono text-slate-500">
        <span>F-TRACK HUNTER AWAKENING • PROTOCOL READY</span>
      </footer>
    </div>
  );
};

export default Register;
