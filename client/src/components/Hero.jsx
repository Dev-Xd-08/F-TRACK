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
      {/* Background Energy Matrix & Concentric Neon Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-violet-neon/15 via-cyan-neon/10 to-transparent rounded-full blur-3xl opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-crimson-aura/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-neon/40 bg-cyan-neon/10 backdrop-blur-md shadow-glow-cyan"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-neon animate-ping" />
              <span className="text-[11px] font-orbitron font-bold tracking-widest text-cyan-neon uppercase">
                SYSTEM AWAKENING PROTOCOL • ONLINE
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="font-orbitron text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-slate-100 uppercase">
                YOUR BODY.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow">
                  YOUR POWER.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-neon via-crimson-glow to-gold-mythic text-glow-violet">
                  YOUR ASCENSION.
                </span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Turn every workout into progress. Track your fitness. Complete quests. 
              Earn XP. Become stronger. Experience fitness through an original anime RPG interface designed for peak performance.
            </motion.p>

            {/* Primary & Secondary Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <AnimeButton
                variant="cyan"
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
                ⚡ BEGIN ASCENSION
              </AnimeButton>

              <AnimeButton
                variant="outline"
                size="lg"
                icon={Compass}
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                EXPLORE SYSTEM
              </AnimeButton>
            </motion.div>

            {/* Stats Micro Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left font-orbitron"
            >
              <div>
                <p className="text-xl sm:text-2xl font-black text-cyan-neon">6 CORE</p>
                <p className="text-[10px] text-slate-400 font-sans tracking-wide">FITNESS MODULES</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-violet-glow">E → S</p>
                <p className="text-[10px] text-slate-400 font-sans tracking-wide">RANK PROGRESSION</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-gold-mythic">100%</p>
                <p className="text-[10px] text-slate-400 font-sans tracking-wide">GAMIFIED WORKOUTS</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Original Anime Warrior Visual & Floating HUD Matrix (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Energy Core / Abstract Warrior Silhouette */}
            <div className="relative w-[320px] sm:w-[420px] h-[460px] sm:h-[540px] flex items-center justify-center">
              
              {/* Concentric Rotating Energy Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border border-dashed border-cyan-neon/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-10 rounded-full border border-violet-neon/30"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-16 rounded-full border border-dashed border-gold-mythic/20"
              />

              {/* Sci-Fi Warrior Silhouette Geometry */}
              <div className="relative z-10 w-64 h-80 rounded-2xl bg-gradient-to-b from-obsidian/90 via-void/90 to-obsidian/90 border border-violet-neon/40 shadow-glow-violet backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
                
                {/* Internal Scanlines & Shonen Aura Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-neon/20 via-transparent to-cyan-neon/20 opacity-60" />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-neon/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                {/* Abstract Warrior Crest / Core Emblem */}
                <div className="relative z-20 mb-4">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-neon p-1 shadow-glow-cyan">
                    <div className="w-full h-full bg-void rounded-lg flex items-center justify-center">
                      <Shield className="w-12 h-12 text-cyan-neon drop-shadow-[0_0_8px_#00F5FF]" />
                    </div>
                  </div>
                </div>

                <div className="relative z-20 space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/40">
                    HUNTER ARCHETYPE
                  </div>
                  <h3 className="font-orbitron text-lg font-bold text-slate-100 tracking-wider">
                    ASCENDANT WARRIOR
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight">
                    Resilient body matrix with adaptive strength and stamina capacity.
                  </p>
                </div>

                {/* Energy Pulse Base Line */}
                <div className="relative z-20 w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>CORE: AWAKENED</span>
                  <span className="text-matrix-neon flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-matrix-neon animate-pulse" /> SYNCHRONIZED
                  </span>
                </div>
              </div>

              {/* 5 FLOATING HUD ELEMENTS (Framer Motion Animated) */}

              {/* HUD 1: RANK: E (Top Left) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute top-4 -left-4 sm:-left-8 z-20"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3.5 py-2 rounded-lg bg-obsidian/90 border border-slate-700/80 backdrop-blur-md shadow-lg flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded bg-slate-800 border border-slate-600 flex items-center justify-center font-orbitron font-bold text-xs text-slate-300">
                    E
                  </div>
                  <div>
                    <span className="text-[9px] font-orbitron block text-slate-400 tracking-wider">INITIATE STATUS</span>
                    <span className="text-xs font-orbitron font-bold text-slate-200">RANK: E</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* HUD 2: LEVEL: 01 (Top Right) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-10 -right-4 sm:-right-8 z-20"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3.5 py-2 rounded-lg bg-obsidian/90 border border-violet-neon/40 backdrop-blur-md shadow-glow-violet flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded bg-violet-neon/20 border border-violet-neon/60 flex items-center justify-center font-orbitron font-bold text-xs text-violet-glow">
                    01
                  </div>
                  <div>
                    <span className="text-[9px] font-orbitron block text-violet-glow tracking-wider">ASCENSION</span>
                    <span className="text-xs font-orbitron font-bold text-slate-100">LEVEL: 01</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* HUD 3: XP: 0 / 100 (Middle Left) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-1/2 -left-6 sm:-left-12 z-20"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3.5 py-2 rounded-lg bg-obsidian/90 border border-cyan-neon/40 backdrop-blur-md shadow-glow-cyan w-40"
                >
                  <div className="flex justify-between items-center text-[10px] font-orbitron mb-1">
                    <span className="text-cyan-neon font-bold">XP MATRIX</span>
                    <span className="text-slate-300 font-mono">0 / 100</span>
                  </div>
                  <div className="h-1.5 w-full bg-void-pure rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full w-1/12 bg-cyan-neon rounded-full" />
                  </div>
                </motion.div>
              </motion.div>

              {/* HUD 4: STREAK: 0 DAYS (Bottom Left) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-2 -left-2 sm:-left-6 z-20"
              >
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 py-2 rounded-lg bg-obsidian/90 border border-crimson-aura/40 backdrop-blur-md shadow-glow-crimson flex items-center gap-2.5"
                >
                  <Flame className="w-5 h-5 text-crimson-aura fill-crimson-aura/40 animate-pulse" />
                  <div>
                    <span className="text-[9px] font-orbitron block text-crimson-aura tracking-wider">DAILY DRIVE</span>
                    <span className="text-xs font-orbitron font-bold text-slate-100">STREAK: 0 DAYS</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* HUD 5: ENERGY: 100% (Bottom Right) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-4 -right-2 sm:-right-6 z-20"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3.5 py-2 rounded-lg bg-obsidian/90 border border-gold-mythic/40 backdrop-blur-md shadow-glow-gold flex items-center gap-2.5"
                >
                  <BatteryCharging className="w-5 h-5 text-gold-mythic" />
                  <div>
                    <span className="text-[9px] font-orbitron block text-gold-mythic tracking-wider">STAMINA HUD</span>
                    <span className="text-xs font-orbitron font-bold text-slate-100">ENERGY: 100%</span>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
