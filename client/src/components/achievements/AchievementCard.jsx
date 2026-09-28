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
      transition={{ duration: 0.2 }}
      className={`rounded-sm p-5 border relative overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        unlocked
          ? 'bg-charcoal border-steel shadow-steel-card hover:border-steel-light'
          : 'bg-obsidian border-steel/40 opacity-70'
      }`}
    >
      {/* Top Header */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${
              unlocked
                ? 'bg-gunmetal border border-steel text-offwhite shadow-steel-card'
                : 'bg-void border border-steel/40 text-steel'
            }`}>
              {unlocked ? (
                <IconComponent className="w-4 h-4 text-offwhite" />
              ) : (
                <Lock className="w-4 h-4 text-steel" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className={`font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wide truncate ${
                  unlocked ? 'text-offwhite' : 'text-ash'
                }`}>
                  {title}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-ash uppercase block">
                {category} • FORGED BADGE
              </span>
            </div>
          </div>

          {/* XP Reward Badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold border flex-shrink-0 ${
            unlocked
              ? 'bg-obsidian text-bone border-steel/60'
              : 'bg-void text-steel border-steel/40'
          }`}>
            <span>+{xp} XP</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-ash font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Progress Area */}
      <div className="mt-5 pt-3 border-t border-steel/50 space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-ash">
            {unlocked ? 'FORGED & REGISTERED' : 'SYNCHRONIZATION'}
          </span>
          <span className={`font-bold ${unlocked ? 'text-offwhite' : 'text-ash'}`}>
            {progressValue.toLocaleString()} / {target.toLocaleString()}{' '}
            <span className="text-ash font-normal">{unit}</span>
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-1.5 bg-void border border-steel/60 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${
              unlocked
                ? 'bg-steel-light'
                : 'bg-steel'
            }`}
          />
        </div>

        {/* Status Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-ash">
            {percentage}% VERIFIED
          </span>

          {unlocked ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-obsidian text-offwhite border border-steel">
              <CheckCircle2 className="w-3 h-3 text-crimson" />
              <span>FORGED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-void text-steel border border-steel/40">
              <Lock className="w-2.5 h-2.5 text-steel" />
              <span>LOCKED</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
