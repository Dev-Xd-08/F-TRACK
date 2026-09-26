import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Clock, 
  Dumbbell, 
  Shield, 
  Swords, 
  Zap, 
  Crown, 
  Target, 
  Award, 
  ArrowUpCircle,
  Footprints
} from 'lucide-react';

const ICON_MAP = {
  Footprints,
  Dumbbell,
  Shield,
  Swords,
  Flame,
  Zap,
  Sparkles,
  Clock,
  Crown,
  Trophy,
  Target,
  Award,
  ArrowUpCircle,
};

/**
 * AchievementCard Component (Stage 9)
 * Represents an individual achievement with locked/unlocked telemetry, progress bar, and XP reward
 */
export const AchievementCard = ({ achievement }) => {
  const {
    id,
    title,
    description,
    category,
    progressValue = 0,
    target = 1,
    unit = '',
    xp = 50,
    percentage = 0,
    unlocked = false,
    unlockedAt,
    icon = 'Award',
  } = achievement;

  const IconComponent = ICON_MAP[icon] || Award;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
        unlocked
          ? 'bg-obsidian/90 border-gold-mythic/40 shadow-[0_0_20px_rgba(255,184,0,0.15)] hover:border-gold-mythic/60'
          : 'bg-obsidian/60 border-slate-800/80 hover:border-slate-700/80 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Background Ambient Glow */}
      {unlocked && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-mythic/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top Header */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              unlocked
                ? 'bg-gold-mythic/15 border border-gold-mythic/50 text-gold-mythic shadow-[0_0_12px_rgba(255,184,0,0.3)]'
                : 'bg-slate-900 border border-slate-800 text-slate-500'
            }`}>
              {unlocked ? (
                <IconComponent className="w-4 h-4 text-gold-mythic" />
              ) : (
                <Lock className="w-4 h-4 text-slate-500" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className={`font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wide truncate ${
                  unlocked ? 'text-slate-100' : 'text-slate-400'
                }`}>
                  {title}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                {category} • TIER MILESTONE
              </span>
            </div>
          </div>

          {/* XP Reward Badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex-shrink-0 ${
            unlocked
              ? 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}>
            <Sparkles className="w-3 h-3" />
            <span>+{xp} XP</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Progress Area */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">
            {unlocked ? 'ASCENSION UNLOCKED' : 'SYNCHRONIZATION'}
          </span>
          <span className="font-bold text-slate-300">
            {progressValue.toLocaleString()} / {target.toLocaleString()}{' '}
            <span className="text-slate-500 font-normal">{unit}</span>
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              unlocked
                ? 'bg-gradient-to-r from-gold-mythic to-amber-300 shadow-[0_0_8px_rgba(255,184,0,0.5)]'
                : 'bg-gradient-to-r from-slate-700 to-cyan-dark'
            }`}
          />
        </div>

        {/* Status Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-slate-500">
            {percentage}% COMPLETE
          </span>

          {unlocked ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-gold-mythic/15 text-gold-mythic border border-gold-mythic/40">
              <CheckCircle2 className="w-3 h-3" />
              <span>UNLOCKED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
              <Lock className="w-2.5 h-2.5" />
              <span>LOCKED</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
