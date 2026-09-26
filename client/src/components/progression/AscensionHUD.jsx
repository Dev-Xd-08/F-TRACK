import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Shield, 
  Trophy, 
  Sparkles, 
  Dumbbell, 
  Clock, 
  Activity, 
  Crown,
  ChevronRight,
  Target
} from 'lucide-react';
import EnergyBar from '../ui/EnergyBar';
import GlassCard from '../ui/GlassCard';

/**
 * Rank styling configuration
 */
const RANK_CONFIGS = {
  E: {
    border: 'border-slate-600',
    bg: 'from-slate-900 via-slate-800 to-slate-950',
    badgeGlow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    textColor: 'text-slate-200',
    tagBg: 'bg-slate-800/80 text-slate-300 border-slate-700',
    colorKey: 'cyan',
  },
  D: {
    border: 'border-emerald-500/60',
    bg: 'from-emerald-950/60 via-slate-900 to-slate-950',
    badgeGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    textColor: 'text-emerald-400',
    tagBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    colorKey: 'cyan',
  },
  C: {
    border: 'border-cyan-neon/60',
    bg: 'from-cyan-950/60 via-slate-900 to-slate-950',
    badgeGlow: 'shadow-[0_0_25px_rgba(0,245,255,0.4)]',
    textColor: 'text-cyan-neon',
    tagBg: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/40',
    colorKey: 'cyan',
  },
  B: {
    border: 'border-violet-neon/60',
    bg: 'from-violet-950/60 via-slate-900 to-slate-950',
    badgeGlow: 'shadow-[0_0_30px_rgba(139,92,246,0.5)]',
    textColor: 'text-violet-glow',
    tagBg: 'bg-violet-neon/10 text-violet-glow border-violet-neon/40',
    colorKey: 'violet',
  },
  A: {
    border: 'border-crimson-aura/70',
    bg: 'from-rose-950/70 via-slate-900 to-slate-950',
    badgeGlow: 'shadow-[0_0_35px_rgba(255,42,95,0.6)]',
    textColor: 'text-crimson-aura',
    tagBg: 'bg-crimson-aura/10 text-crimson-aura border-crimson-aura/40',
    colorKey: 'crimson',
  },
  S: {
    border: 'border-gold-mythic/80',
    bg: 'from-amber-950/80 via-slate-900 to-slate-950',
    badgeGlow: 'shadow-[0_0_40px_rgba(255,184,0,0.7)]',
    textColor: 'text-gold-mythic',
    tagBg: 'bg-gold-mythic/15 text-gold-mythic border-gold-mythic/50',
    colorKey: 'gold',
  },
};

export const AscensionHUD = ({ progression }) => {
  const {
    xp = 0,
    level = 1,
    currentLevelXP = 0,
    nextLevelXPRequired = 100,
    progressPercent = 0,
    rank = 'E',
    rankTitle = 'AWAKENING',
    currentStreak = 0,
    longestStreak = 0,
    totalWorkouts = 0,
    totalDurationMinutes = 0,
    totalCaloriesBurned = 0,
  } = progression || {};

  const rankConfig = RANK_CONFIGS[rank] || RANK_CONFIGS.E;

  return (
    <div className="space-y-6">
      {/* ─── PRIMARY ASCENSION STATUS CORE ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 bg-obsidian/90 border border-violet-neon/40 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.15)]"
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-neon/15 via-cyan-neon/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-crimson-aura/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Hunter Rank Badge & Title (cols 12 -> 4) */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-6">
            {/* Holographic Rank Insignia */}
            <div className="relative group">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${rankConfig.bg} border-2 ${rankConfig.border} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${rankConfig.badgeGlow}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <span className="text-[10px] font-orbitron font-bold tracking-widest text-slate-400 uppercase">
                  RANK
                </span>
                <span
                  className={`font-orbitron font-black text-4xl sm:text-5xl tracking-tighter ${rankConfig.textColor} drop-shadow-md`}
                >
                  {rank}
                </span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-void border border-slate-700 text-[9px] font-orbitron font-bold tracking-widest text-cyan-neon whitespace-nowrap shadow-sm">
                LVL {String(level).padStart(2, '0')}
              </div>
            </div>

            {/* Hunter Title & Tier Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-orbitron font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${rankConfig.tagBg}`}>
                  {rankTitle}
                </span>
              </div>
              <h2 className="font-orbitron text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                <span>HUNTER LEVEL {level}</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-neon" />
                <span>{xp.toLocaleString()} TOTAL ASCENSION XP</span>
              </p>
            </div>
          </div>

          {/* Center: Dynamic XP & Level Progress Bar (cols 12 -> 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-orbitron">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-violet-glow animate-pulse" />
                <span>LEVEL {level} PROGRESSION</span>
              </span>
              <span className="font-mono text-cyan-neon font-bold">
                {currentLevelXP} / {nextLevelXPRequired} XP ({progressPercent}%)
              </span>
            </div>

            {/* Glowing Cyber XP Bar */}
            <div className="relative h-4 w-full bg-void-pure rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-violet-600 via-cyan-neon to-violet-glow shadow-[0_0_15px_#00F5FF] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Current Tier: {rank}</span>
              <span>Next Level in {Math.max(0, nextLevelXPRequired - currentLevelXP)} XP</span>
            </div>
          </div>

          {/* Right: Daily Workout Streak Badge (cols 12 -> 3) */}
          <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-4 lg:pt-0 lg:pl-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-crimson-aura/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Flame className={`w-6 h-6 text-amber-400 ${currentStreak > 0 ? 'animate-bounce' : 'opacity-50'}`} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-orbitron font-bold text-slate-400 block tracking-wider uppercase">
                  ACTIVE STREAK
                </span>
                <span className="font-orbitron font-black text-2xl text-amber-400 leading-none">
                  {currentStreak} <span className="text-xs font-semibold text-slate-300">DAYS</span>
                </span>
              </div>
            </div>

            <div className="text-right lg:mt-3">
              <span className="text-[10px] font-mono text-slate-500 block">RECORD STREAK</span>
              <span className="text-xs font-orbitron font-bold text-slate-300">
                {longestStreak} DAYS BEST
              </span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* ─── AGGREGATED ASCENSION METRICS (3 COLUMNS) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Quests Completed */}
        <GlassCard glow="cyan" className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-neon" />
              TOTAL QUESTS LOGGED
            </span>
            <p className="font-orbitron font-black text-3xl text-cyan-neon">
              {totalWorkouts}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              +{totalWorkouts * 100} XP CUMULATIVE REWARD
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon">
            <Trophy className="w-5 h-5" />
          </div>
        </GlassCard>

        {/* Stat 2: Active Training Time */}
        <GlassCard glow="violet" className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-glow" />
              TOTAL TRAINING TIME
            </span>
            <p className="font-orbitron font-black text-3xl text-violet-glow">
              {totalDurationMinutes}{' '}
              <span className="text-xs font-normal text-slate-400">MINS</span>
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              {(totalDurationMinutes / 60).toFixed(1)} ACTIVE HOURS
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-neon/10 border border-violet-neon/30 flex items-center justify-center text-violet-glow">
            <Activity className="w-5 h-5" />
          </div>
        </GlassCard>

        {/* Stat 3: Total Energy Expended */}
        <GlassCard glow="crimson" className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-crimson-aura" />
              CALORIE EXPENDITURE
            </span>
            <p className="font-orbitron font-black text-3xl text-crimson-aura">
              {totalCaloriesBurned.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">KCAL</span>
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              METABOLIC POWER BURNOUT
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-crimson-aura/10 border border-crimson-aura/30 flex items-center justify-center text-crimson-aura">
            <Zap className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AscensionHUD;
