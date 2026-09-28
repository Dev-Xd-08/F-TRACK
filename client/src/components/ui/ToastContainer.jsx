import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Crown, 
  ArrowUpCircle, 
  Award, 
  CheckCircle2, 
  Target, 
  AlertCircle, 
  Info, 
  X,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const getToastConfig = (type) => {
  switch (type) {
    case 'RANK_UP':
    case 'LEVEL_UP':
      return {
        border: 'border-l-4 border-l-crimson border-y border-r border-steel shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-crimson border-crimson/40',
        badgeText: 'ASCENSION ELEVATION',
        Icon: Crown,
      };
    case 'ACHIEVEMENT_UNLOCKED':
      return {
        border: 'border-l-4 border-l-brass border-y border-r border-steel shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-brass border-brass/40',
        badgeText: 'FORGED BADGE',
        Icon: Award,
      };
    case 'PERSONAL_RECORD':
      return {
        border: 'border-l-4 border-l-crimson border-y border-r border-steel shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-crimson border-crimson/40',
        badgeText: 'NEW RECORD',
        Icon: Trophy,
      };
    case 'QUEST_COMPLETED':
    case 'GOAL_COMPLETED':
    case 'WORKOUT_COMPLETED':
      return {
        border: 'border-l-4 border-l-steel-light border-y border-r border-steel shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-bone border-steel',
        badgeText: 'OBJECTIVE VERIFIED',
        Icon: CheckCircle2,
      };
    case 'STREAK_MILESTONE':
      return {
        border: 'border-l-4 border-l-crimson border-y border-r border-steel shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-crimson border-crimson/40',
        badgeText: 'STREAK ENDURANCE',
        Icon: Flame,
      };
    case 'ERROR':
      return {
        border: 'border-l-4 border-l-crimson border-y border-r border-crimson/60 shadow-steel-card',
        headerColor: 'text-crimson-muted',
        badgeBg: 'bg-obsidian text-crimson border-crimson/50',
        badgeText: 'SYSTEM WARNING',
        Icon: AlertCircle,
      };
    case 'SUCCESS':
      return {
        border: 'border-l-4 border-l-steel-light border-y border-r border-steel shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-offwhite border-steel',
        badgeText: 'SYSTEM CONFIRMED',
        Icon: CheckCircle2,
      };
    case 'INFO':
    default:
      return {
        border: 'border-l-4 border-l-steel border-y border-r border-steel/60 shadow-steel-card',
        headerColor: 'text-offwhite',
        badgeBg: 'bg-obsidian text-ash border-steel/60',
        badgeText: 'TELEMETRY',
        Icon: Info,
      };
  }
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notification Toasts"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-md w-full pointer-events-none space-y-3"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          const Icon = config.Icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto rounded-sm p-4 bg-charcoal ${config.border} relative overflow-hidden`}
              role="status"
            >
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-obsidian border border-steel flex items-center justify-center flex-shrink-0 text-offwhite">
                    <Icon className="w-4 h-4 text-offwhite" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${config.badgeBg}`}>
                        {config.badgeText}
                      </span>
                      {toast.title && (
                        <h4 className="font-orbitron font-bold text-xs uppercase tracking-wide text-offwhite">
                          {toast.title}
                        </h4>
                      )}
                    </div>

                    <p className="text-xs text-ash font-sans leading-relaxed">
                      {toast.message}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      {toast.xp > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-bone">
                          <Zap className="w-3 h-3 text-crimson" />
                          +{toast.xp} XP ACCRUED
                        </span>
                      )}
                      {toast.meta && (
                        <span className="text-[10px] font-mono text-ash font-bold">
                          • {toast.meta}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-sm text-ash hover:text-offwhite hover:bg-gunmetal transition-colors"
                  aria-label="Dismiss toast"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Countdown Progress Drain Bar */}
              {toast.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-[2px] bg-steel-light"
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
