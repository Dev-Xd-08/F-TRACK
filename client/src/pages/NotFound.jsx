import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon, ArrowLeft, Zap, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeButton from '../components/ui/AnimeButton';
import GlassCard from '../components/ui/GlassCard';

/**
 * NotFound (404) Page (Stage 14)
 * F-TRACK: FITNESS ASCENSION System Path Not Found Screen
 */
export const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void text-bone-100 architectural-grid flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-crimson-950/15 rounded-full blur-3xl opacity-35" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-steel-800 bg-void/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-charcoal-800 border border-steel-700 flex items-center justify-center text-bone-100 shadow-steel-card">
              <AlertOctagon className="w-4 h-4 text-crimson-600" />
            </div>
            <div>
              <span className="font-orbitron font-extrabold text-base tracking-wider text-bone-100">
                F-TRACK
              </span>
              <span className="text-[9px] block font-orbitron tracking-widest text-ash-400 uppercase">
                ERROR PROTOCOL
              </span>
            </div>
          </Link>

          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <AnimeButton variant="outline" size="sm" icon={ArrowLeft}>
              {isAuthenticated ? 'DASHBOARD' : 'HOME'}
            </AnimeButton>
          </Link>
        </div>
      </header>

      {/* Main Chamber Center */}
      <main className="max-w-xl mx-auto px-4 py-16 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-6"
        >
          {/* 404 Emblem */}
          <div className="relative inline-block">
            <h1 className="font-orbitron font-black text-7xl sm:text-9xl tracking-tight text-bone-100 select-none">
              404
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-steel-800 border border-steel-700 text-[10px] font-orbitron font-bold text-bone-200 tracking-widest uppercase shadow-steel-card whitespace-nowrap">
              <span>●</span> COORDINATES UNKNOWN
            </div>
          </div>

          <GlassCard glow="none" className="p-6 sm:p-8 space-y-4 border-steel-700 bg-charcoal-900 shadow-steel-card">
            {/* Single Crimson Top Line */}
            <div className="h-0.5 w-full bg-crimson-800 mb-2" />

            <div className="space-y-2">
              <h2 className="font-orbitron font-black text-xl sm:text-2xl text-bone-100 uppercase tracking-wide">
                SYSTEM PATH NOT FOUND
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-md mx-auto">
                The trajectory you requested is invalid or has been decommissioned from the Ascension Matrix.
              </p>
            </div>

            <div className="p-3 rounded bg-void border border-steel-800 text-xs font-mono text-ash-500">
              STATUS CODE: 404_NOT_FOUND • PROTOCOL: ASCENSION_ROUTER
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <AnimeButton
                variant="crimson"
                size="md"
                icon={Zap}
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              >
                {isAuthenticated ? 'RETURN TO DASHBOARD' : 'RETURN TO HOME'}
              </AnimeButton>

              {isAuthenticated && (
                <AnimeButton
                  variant="outline"
                  size="md"
                  icon={ArrowLeft}
                  onClick={() => navigate(-1)}
                >
                  NAVIGATE BACK
                </AnimeButton>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-steel-800 bg-void py-4 text-center text-xs text-ash-500 font-mono">
        <span>F-TRACK: FITNESS ASCENSION • ROUTING SUBSYSTEM ACTIVE</span>
      </footer>
    </div>
  );
};

export default NotFound;
