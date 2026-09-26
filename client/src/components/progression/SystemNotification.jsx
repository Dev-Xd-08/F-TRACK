import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Trophy, 
  ShieldAlert, 
  Sparkles, 
  X, 
  ArrowUpCircle,
  Crown,
  Clock,
  CheckCircle2,
  Award
} from 'lucide-react';

/**
 * SystemNotification Component
 * Anime-style HUD popup for Ascension events:
 * - WORKOUT_COMPLETED (+100 XP)
 * - LEVEL_UP
 * - RANK_UP
 * - STREAK_UPDATED
 * - NEW_RECORD_LONGEST_WORKOUT
 * - NEW_RECORD_HIGHEST_CALORIES
 * - NEW_RECORD_MOST_ACTIVE_WEEK
 * - QUEST_COMPLETED
 * - ACHIEVEMENT_UNLOCKED
 */
export const SystemNotification = ({ events = [], onClose }) => {
  useEffect(() => {
    if (events.length > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [events, onClose]);

  if (!events || events.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full pointer-events-none space-y-3">
      <AnimatePresence>
        {events.map((evt, idx) => {
          const isLevelUp = evt.type === 'LEVEL_UP';
          const isRankUp = evt.type === 'RANK_UP';
          const isStreak = evt.type === 'STREAK_UPDATED';
          const isLongestRecord = evt.type === 'NEW_RECORD_LONGEST_WORKOUT';
          const isCaloriesRecord = evt.type === 'NEW_RECORD_HIGHEST_CALORIES';
          const isWeekRecord = evt.type === 'NEW_RECORD_MOST_ACTIVE_WEEK';
          const isQuestComplete = evt.type === 'QUEST_COMPLETED';
          const isAchievement = evt.type === 'ACHIEVEMENT_UNLOCKED';
          
          let borderGlow = 'border-cyan-neon shadow-[0_0_25px_rgba(0,245,255,0.4)]';
          let headerColor = 'text-cyan-neon';
          let IconComponent = Zap;

          if (isAchievement) {
            borderGlow = 'border-gold-mythic shadow-[0_0_35px_rgba(255,184,0,0.8)]';
            headerColor = 'text-gold-mythic';
            IconComponent = Award;
          } else if (isLevelUp) {
            borderGlow = 'border-violet-neon shadow-[0_0_30px_rgba(139,92,246,0.6)]';
            headerColor = 'text-violet-glow';
            IconComponent = ArrowUpCircle;
          } else if (isRankUp) {
            borderGlow = 'border-gold-mythic shadow-[0_0_35px_rgba(255,184,0,0.7)]';
            headerColor = 'text-gold-mythic';
            IconComponent = Crown;
          } else if (isQuestComplete) {
            borderGlow = 'border-gold-mythic shadow-[0_0_35px_rgba(255,184,0,0.7)]';
            headerColor = 'text-gold-mythic';
            IconComponent = CheckCircle2;
          } else if (isStreak) {
            borderGlow = 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)]';
            headerColor = 'text-amber-400';
            IconComponent = Flame;
          } else if (isLongestRecord) {
            borderGlow = 'border-cyan-neon shadow-[0_0_30px_rgba(0,245,255,0.6)]';
            headerColor = 'text-cyan-neon';
            IconComponent = Clock;
          } else if (isCaloriesRecord) {
            borderGlow = 'border-crimson-aura shadow-[0_0_30px_rgba(255,42,95,0.6)]';
            headerColor = 'text-crimson-aura';
            IconComponent = Flame;
          } else if (isWeekRecord) {
            borderGlow = 'border-gold-mythic shadow-[0_0_30px_rgba(255,184,0,0.6)]';
            headerColor = 'text-gold-mythic';
            IconComponent = Trophy;
          }

          return (
            <motion.div
              key={`${evt.type}-${idx}-${evt.timestamp || Date.now()}`}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`pointer-events-auto rounded-xl p-4 bg-void/95 backdrop-blur-xl border ${borderGlow} relative overflow-hidden`}
            >
              {/* Scanline background effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-obsidian border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <IconComponent className={`w-5 h-5 ${headerColor} animate-pulse`} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-orbitron font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {isAchievement ? 'ACHIEVEMENT UNLOCKED' : isQuestComplete ? 'QUEST COMPLETE' : isLevelUp ? 'ASCENSION' : isRankUp ? 'PROMOTION' : (isLongestRecord || isCaloriesRecord || isWeekRecord) ? 'NEW RECORD' : isStreak ? 'STREAK' : 'SYSTEM'}
                      </span>
                      <h4 className={`font-orbitron font-black text-xs sm:text-sm tracking-wide ${headerColor} uppercase`}>
                        {evt.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {evt.description}
                    </p>
                    {evt.xpGained > 0 && (
                      <span className="inline-block text-[10px] font-mono text-cyan-neon font-bold">
                        +{evt.xpGained} XP ACCELERATION
                      </span>
                    )}
                    {evt.recordValue && (
                      <span className="inline-block text-[10px] font-mono text-gold-mythic font-bold ml-2">
                        ★ PR: {evt.recordValue} {evt.recordUnit}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1 rounded-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar countdown line */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5.5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-neon to-violet-neon`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SystemNotification;
