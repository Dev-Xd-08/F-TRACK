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
    border: 'border-steel',
    bg: 'from-charcoal via-obsidian to-void',
    badgeGlow: 'shadow-steel-card',
    textColor: 'text-bone',
    tagBg: 'bg-charcoal text-ash border-steel/60',
    colorKey: 'steel',
  },
  D: {
    border: 'border-steel-light/70',
    bg: 'from-charcoal via-obsidian to-void',
    badgeGlow: 'shadow-steel-card',
    textColor: 'text-offwhite',
    tagBg: 'bg-charcoal text-ash border-steel/60',
    colorKey: 'steel',
  },
  C: {
    border: 'border-steel-light',
    bg: 'from-gunmetal via-charcoal to-obsidian',
    badgeGlow: 'shadow-steel-card',
    textColor: 'text-offwhite',
    tagBg: 'bg-gunmetal text-bone border-steel',
    colorKey: 'steel',
  },
  B: {
    border: 'border-steel-light',
    bg: 'from-gunmetal via-charcoal to-obsidian',
    badgeGlow: 'shadow-steel-card',
    textColor: 'text-offwhite',
    tagBg: 'bg-gunmetal text-bone border-steel',
    colorKey: 'steel',
  },
  A: {
    border: 'border-crimson-muted',
    bg: 'from-crimson-dark/40 via-charcoal to-obsidian',
    badgeGlow: 'shadow-steel-card',
    textColor: 'text-bone',
    tagBg: 'bg-charcoal text-crimson-muted border-crimson/50',
    colorKey: 'crimson',
  },
  S: {
    border: 'border-crimson',
    bg: 'from-crimson-dark/60 via-charcoal to-obsidian',
    badgeGlow: 'shadow-steel-card',
    textColor: 'text-offwhite',
    tagBg: 'bg-charcoal text-bone border-crimson',
    colorKey: 'crimson',
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
        className="rounded-lg p-6 sm:p-8 bg-charcoal border border-steel shadow-steel-card relative overflow-hidden"
      >
        {/* Top Edge Restrained Crimson Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-crimson via-steel to-crimson/30" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Rank Badge & Title (cols 12 -> 4) */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-steel/60 pb-6 lg:pb-0 lg:pr-6">
            {/* Forged Rank Insignia */}
            <div className="relative group">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-sm bg-gradient-to-br ${rankConfig.bg} border-2 ${rankConfig.border} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 shadow-steel-card`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                <span className="text-[10px] font-mono tracking-widest text-ash uppercase">
                  DESIGNATION
                </span>
                <span
                  className={`font-orbitron font-black text-4xl sm:text-5xl tracking-tighter ${rankConfig.textColor} drop-shadow-sm`}
                >
                  {rank}
                </span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-sm bg-obsidian border border-steel text-[9px] font-mono font-bold tracking-widest text-offwhite whitespace-nowrap shadow-sm">
                LVL {String(level).padStart(2, '0')}
              </div>
            </div>

            {/* Title & Tier Info */}
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider ${rankConfig.tagBg}`}>
                  {rankTitle}
                </span>
              </div>
              <h2 className="font-orbitron text-lg sm:text-xl font-black text-offwhite tracking-tight flex items-center gap-2">
                <span>ATHLETE LEVEL {level}</span>
              </h2>
              <p className="text-xs text-ash font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                <span>{xp.toLocaleString()} TOTAL ASCENSION XP</span>
              </p>
            </div>
          </div>

          {/* Center: Dynamic XP & Level Progress Bar (cols 12 -> 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-bone flex items-center gap-1.5">
                <span className="w-2 h-2 bg-crimson rounded-none" />
                <span>LEVEL {level} PROGRESSION</span>
              </span>
              <span className="font-mono text-offwhite font-bold">
                {currentLevelXP} / {nextLevelXPRequired} XP ({progressPercent}%)
              </span>
            </div>

            {/* Dark Industrial Physical Meter */}
            <div 
              role="progressbar"
              aria-valuenow={currentLevelXP}
              aria-valuemin={0}
              aria-valuemax={nextLevelXPRequired}
              aria-label={`Level ${level} XP Progress`}
              className="relative h-3 w-full bg-void rounded-sm overflow-hidden border border-steel/80 p-0.5 shadow-inner"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-none bg-gradient-to-r from-crimson-dark via-crimson to-crimson-muted relative overflow-hidden"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-ash">
              <span>Current Designation: {rank}</span>
              <span>Next Level in {Math.max(0, nextLevelXPRequired - currentLevelXP)} XP</span>
            </div>
          </div>

          {/* Right: Daily Workout Streak Badge (cols 12 -> 3) */}
          <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-steel/60 pt-4 lg:pt-0 lg:pl-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-crimson shadow-steel-card">
                <Flame className={`w-6 h-6 text-crimson ${currentStreak > 0 ? 'opacity-100' : 'opacity-40'}`} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold text-ash block tracking-wider uppercase">
                  ACTIVE STREAK
                </span>
                <span className="font-orbitron font-black text-2xl text-offwhite leading-none">
                  {currentStreak} <span className="text-xs font-mono text-ash">DAYS</span>
                </span>
              </div>
            </div>

            <div className="text-right lg:mt-3">
              <span className="text-[10px] font-mono text-ash block">RECORD STREAK</span>
              <span className="text-xs font-mono font-bold text-bone">
                {longestStreak} DAYS BEST
              </span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* ─── AGGREGATED METRICS (3 COLUMNS) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Quests Completed */}
        <GlassCard glow="none" className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-steel-light" />
              TOTAL QUESTS LOGGED
            </span>
            <p className="font-orbitron font-black text-3xl text-offwhite">
              {totalWorkouts}
            </p>
            <p className="text-[10px] font-mono text-ash">
              +{totalWorkouts * 100} XP ACCRUED
            </p>
          </div>
          <div className="w-11 h-11 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-bone">
            <Trophy className="w-5 h-5 text-steel-light" />
          </div>
        </GlassCard>

        {/* Stat 2: Active Training Time */}
        <GlassCard glow="none" className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-steel-light" />
              TOTAL TRAINING TIME
            </span>
            <p className="font-orbitron font-black text-3xl text-bone">
              {totalDurationMinutes}{' '}
              <span className="text-xs font-normal text-ash">MINS</span>
            </p>
            <p className="text-[10px] font-mono text-ash">
              {(totalDurationMinutes / 60).toFixed(1)} ACTIVE HOURS
            </p>
          </div>
          <div className="w-11 h-11 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-bone">
            <Activity className="w-5 h-5 text-steel-light" />
          </div>
        </GlassCard>

        {/* Stat 3: Total Energy Expended */}
        <GlassCard glow="none" className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-orbitron font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-crimson" />
              CALORIE EXPENDITURE
            </span>
            <p className="font-orbitron font-black text-3xl text-crimson">
              {totalCaloriesBurned.toLocaleString()}{' '}
              <span className="text-xs font-normal text-ash">KCAL</span>
            </p>
            <p className="text-[10px] font-mono text-ash">
              METABOLIC EXPENDITURE
            </p>
          </div>
          <div className="w-11 h-11 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-crimson">
            <Zap className="w-5 h-5 text-crimson" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AscensionHUD;
