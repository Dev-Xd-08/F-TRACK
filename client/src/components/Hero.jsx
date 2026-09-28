import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Crosshair,
  BatteryCharging,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeButton from './ui/AnimeButton';

export const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background Architectural Grid & Subtle Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-crimson-950/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute inset-0 architectural-grid opacity-25" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Dramatic Copy & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* System Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded border border-steel-700 bg-charcoal-900/90 shadow-steel-card"
            >
              <span className="w-2 h-2 rounded-full bg-crimson-600" />
              <span className="text-[11px] font-orbitron font-bold tracking-widest text-ash-300 uppercase">
                SYSTEM PROTOCOL • OPERATIONAL
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="font-orbitron text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-bone-100 uppercase">
                BECOME SOMEONE
                <span className="block text-ash-400">
                  YOU'RE PROUD OF.
                </span>
                <span className="block text-crimson-600 text-3xl sm:text-5xl xl:text-6xl">
                  THE PATH CONTINUES.
                </span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed space-y-1.5"
            >
              <span className="block font-medium text-bone-100">
                Train your body. Understand yourself. Build a routine you can return to.
              </span>
              <span className="block text-sm text-ash-400">
                You don't need to become someone else. You need to become someone you can rely on. Start where you are. Keep moving forward.
              </span>
            </motion.p>

            {/* Primary & Secondary Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <AnimeButton
                variant="crimson"
                size="lg"
                icon={Zap}
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/dashboard');
                  } else {
                    navigate('/register');
                  }
                }}
              >
                START YOUR JOURNEY
              </AnimeButton>

              <AnimeButton
                variant="outline"
                size="lg"
                icon={Compass}
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                EXPLORE THE SYSTEM
              </AnimeButton>
            </motion.div>

            {/* Stats Micro Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-steel-800 max-w-lg mx-auto lg:mx-0 text-left font-orbitron"
            >
              <div>
                <p className="text-xl sm:text-2xl font-black text-bone-100">6 CORE</p>
                <p className="text-[10px] text-ash-400 font-mono tracking-wider">FITNESS MODULES</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-bone-100">E → S</p>
                <p className="text-[10px] text-ash-400 font-mono tracking-wider">RANK PROGRESSION</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-crimson-500">100%</p>
                <p className="text-[10px] text-ash-400 font-mono tracking-wider">VERIFIED TELEMETRY</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Dark Warrior Spec Dossier & Physical Instrumentation (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            <div className="relative w-[320px] sm:w-[420px] h-[460px] sm:h-[540px] flex items-center justify-center">
              
              {/* Outer Concentric Tactical Rings */}
              <div className="absolute inset-4 rounded-full border border-steel-800/80 pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-steel-800/50 pointer-events-none" />

              {/* Sci-Fi Warrior Silhouette Geometry */}
              <div className="relative z-10 w-64 h-80 rounded bg-charcoal-900 border border-steel-700 shadow-steel-card flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
                {/* Single Crimson Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-800" />
                
                {/* Warrior Crest / Core Emblem */}
                <div className="relative z-20 mb-4">
                  <div className="w-20 h-20 rounded bg-charcoal-800 border border-steel-700 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-bone-100" />
                  </div>
                </div>

                <div className="relative z-20 space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-steel-800 text-bone-200 border border-steel-700">
                    OPERATOR ARCHETYPE
                  </div>
                  <h3 className="font-orbitron text-lg font-bold text-bone-100 tracking-wider">
                    DARK WARRIOR
                  </h3>
                  <p className="text-[11px] text-ash-400 font-sans leading-tight">
                    Resilient physical matrix with adaptive strength and endurance capacity.
                  </p>
                </div>

                {/* Energy Pulse Base Line */}
                <div className="relative z-20 w-full mt-4 pt-3 border-t border-steel-800 flex items-center justify-between text-[10px] font-mono text-ash-400">
                  <span>CORE: ONLINE</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SYNCHRONIZED
                  </span>
                </div>
              </div>

              {/* 5 FLOATING HUD ELEMENTS (Physical Instrumentation Design) */}

              {/* HUD 1: RANK: E (Top Left) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute top-4 -left-4 sm:-left-8 z-20"
              >
                <div className="px-3.5 py-2 rounded bg-charcoal-900 border border-steel-700 shadow-steel-card flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-steel-800 border border-steel-600 flex items-center justify-center font-orbitron font-bold text-xs text-bone-200">
                    E
                  </div>
                  <div>
                    <span className="text-[9px] font-orbitron block text-ash-400 tracking-wider">INITIATE STATUS</span>
                    <span className="text-xs font-orbitron font-bold text-bone-100">RANK: E</span>
                  </div>
                </div>
              </motion.div>

              {/* HUD 2: LEVEL: 01 (Top Right) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-10 -right-4 sm:-right-8 z-20"
              >
                <div className="px-3.5 py-2 rounded bg-charcoal-900 border border-steel-700 shadow-steel-card flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-steel-800 border border-steel-600 flex items-center justify-center font-orbitron font-bold text-xs text-bone-100">
                    01
                  </div>
                  <div>
                    <span className="text-[9px] font-orbitron block text-ash-400 tracking-wider">ASCENSION</span>
                    <span className="text-xs font-orbitron font-bold text-bone-100">LEVEL: 01</span>
                  </div>
                </div>
              </motion.div>

              {/* HUD 3: XP: 0 / 100 (Middle Left) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-1/2 -left-6 sm:-left-12 z-20"
              >
                <div className="px-3.5 py-2 rounded bg-charcoal-900 border border-steel-700 shadow-steel-card w-40">
                  <div className="flex justify-between items-center text-[10px] font-orbitron mb-1">
                    <span className="text-ash-300 font-bold">XP MATRIX</span>
                    <span className="text-bone-100 font-mono">0 / 100</span>
                  </div>
                  <div className="h-1.5 w-full bg-void border border-steel-800 rounded-sm overflow-hidden">
                    <div className="h-full w-1/12 bg-crimson-700 rounded-sm" />
                  </div>
                </div>
              </motion.div>

              {/* HUD 4: STREAK: 0 DAYS (Bottom Left) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-2 -left-2 sm:-left-6 z-20"
              >
                <div className="px-3 py-2 rounded bg-charcoal-900 border border-steel-700 shadow-steel-card flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-[9px] font-orbitron block text-ash-400 tracking-wider">DAILY DISCIPLINE</span>
                    <span className="text-xs font-orbitron font-bold text-bone-100">STREAK: 0 DAYS</span>
                  </div>
                </div>
              </motion.div>

              {/* HUD 5: ENERGY: 100% (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-4 -right-2 sm:-right-6 z-20"
              >
                <div className="px-3.5 py-2 rounded bg-charcoal-900 border border-steel-700 shadow-steel-card flex items-center gap-2.5">
                  <BatteryCharging className="w-5 h-5 text-ash-300" />
                  <div>
                    <span className="text-[9px] font-orbitron block text-ash-400 tracking-wider">STAMINA HUD</span>
                    <span className="text-xs font-orbitron font-bold text-bone-100">ENERGY: 100%</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
