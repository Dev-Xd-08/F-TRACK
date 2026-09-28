import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Dumbbell, 
  Clock, 
  Trophy, 
  Sparkles, 
  ArrowUpCircle, 
  Crown, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import EnergyBar from '../ui/EnergyBar';

export const WorkoutCompletionModal = ({
  isOpen = false,
  onClose,
  workout = null,
  progression = null,
  events = [],
  onOpenReflection = null,
}) => {
  if (!isOpen || !workout) return null;

  // Detect Level Up and Rank Up from events
  const levelUpEvent = events.find((e) => e.type === 'LEVEL_UP');
  const rankUpEvent = events.find((e) => e.type === 'RANK_UP');
  const streakEvent = events.find((e) => e.type === 'STREAK_UPDATED');
  const recordEvents = events.filter((e) => e.type && e.type.startsWith('NEW_RECORD_'));
  const questEvents = events.filter((e) => e.type === 'QUEST_COMPLETED');
  const achievementEvents = events.filter((e) => e.type === 'ACHIEVEMENT_UNLOCKED');

  const isLevelUp = !!levelUpEvent;
  const isRankUp = !!rankUpEvent;

  const currentLevel = progression?.level || 1;
  const currentRank = progression?.rank || 'E';
  const currentRankTitle = progression?.rankTitle || 'AWAKENING';
  const currentStreak = progression?.currentStreak ?? streakEvent?.streak ?? 1;
  const currentLevelXP = progression?.currentLevelXP ?? 0;
  const nextLevelXP = progression?.nextLevelXPRequired ?? 100;
  const progressPercent = progression?.progressPercent ?? Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-sm bg-charcoal border border-steel p-6 sm:p-8 shadow-steel-card overflow-hidden space-y-6"
        >
          {/* Single Restrained Crimson Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-crimson" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-sm text-ash hover:text-offwhite hover:bg-gunmetal transition-colors"
            aria-label="Close confirmation dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-sm border border-steel bg-obsidian text-ash text-[10px] font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
              <span>SYSTEM CONFIRMATION</span>
            </div>

            <h2 className="font-orbitron font-black text-xl sm:text-2xl text-offwhite uppercase tracking-tight">
              TRAINING RECORD REGISTERED
            </h2>

            <p className="text-xs font-mono text-ash">
              Physical session logged to training archive. Metrics synchronized.
            </p>
          </div>

          {/* XP Acceleration Callout */}
          <div className="p-4 rounded-sm bg-obsidian border border-steel/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-gunmetal border border-steel flex items-center justify-center text-crimson">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-ash uppercase tracking-wider block">
                  EXPERIENCE ACCRUED
                </span>
                <span className="font-orbitron font-black text-2xl text-offwhite">
                  +100 XP
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-ash block uppercase">CURRENT LEVEL</span>
              <span className="font-orbitron font-bold text-sm text-bone">
                LEVEL {String(currentLevel).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Special Level-Up Celebration Banner if triggered */}
          {isLevelUp && (
            <div className="p-4 rounded-sm bg-obsidian border-l-4 border-l-crimson border-y border-r border-steel flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-gunmetal border border-steel flex items-center justify-center text-offwhite flex-shrink-0">
                <ArrowUpCircle className="w-5 h-5 text-crimson" />
              </div>
              <div>
                <h4 className="font-orbitron font-black text-sm text-offwhite uppercase">
                  LEVEL ADVANCEMENT: LEVEL {currentLevel}
                </h4>
                <p className="text-xs font-sans text-ash">
                  Training capacity expanded. Work capacity threshold increased.
                </p>
              </div>
            </div>
          )}

          {/* Special Rank-Up Celebration Banner if triggered */}
          {isRankUp && (
            <div className="p-4 rounded-sm bg-obsidian border-l-4 border-l-crimson border-y border-r border-steel flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-gunmetal border border-steel flex items-center justify-center text-crimson flex-shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-orbitron font-black text-sm text-offwhite uppercase">
                  TIER PROMOTION: RANK {currentRank} — {currentRankTitle}
                </h4>
                <p className="text-xs font-sans text-ash">
                  Higher tier training parameters and objectives cleared.
                </p>
              </div>
            </div>
          )}

          {/* Workout Telemetry Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-sm bg-obsidian border border-steel/60 space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-ash block uppercase">ACTIVITY</span>
              <p className="font-orbitron font-black text-sm sm:text-base text-offwhite truncate">
                {workout.activityType}
              </p>
            </div>

            <div className="p-3 rounded-sm bg-obsidian border border-steel/60 space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-ash block uppercase">DURATION</span>
              <p className="font-orbitron font-black text-sm sm:text-base text-bone">
                {workout.duration} <span className="text-[10px] font-normal text-ash">MIN</span>
              </p>
            </div>

            <div className="p-3 rounded-sm bg-obsidian border border-steel/60 space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-ash block uppercase">BURNED</span>
              <p className="font-orbitron font-black text-sm sm:text-base text-crimson">
                {workout.caloriesBurned} <span className="text-[10px] font-normal text-ash">KCAL</span>
              </p>
            </div>
          </div>

          {/* Progression Status: Streak & XP progress bar */}
          <div className="p-4 rounded-sm bg-obsidian border border-steel/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-offwhite flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-crimson" />
                <span>{currentStreak} DAY STREAK ACTIVE</span>
              </span>
              <span className="text-ash font-mono font-bold">
                RANK {currentRank} • {currentRankTitle}
              </span>
            </div>

            <EnergyBar
              label={`LEVEL ${String(currentLevel).padStart(2, '0')} XP PROGRESS`}
              current={currentLevelXP}
              max={nextLevelXP}
              color="crimson"
              unit="XP"
            />
          </div>

          {/* Extra accomplishments list if any occurred */}
          {(recordEvents.length > 0 || questEvents.length > 0 || achievementEvents.length > 0) && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-bold text-ash uppercase tracking-wider block">
                RECORDS & DIRECTIVES SATISFIED:
              </span>
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {recordEvents.map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-bone bg-obsidian p-2 rounded-sm border border-steel/60">
                    <Trophy className="w-3.5 h-3.5 text-crimson flex-shrink-0" />
                    <span>RECORD: {rec.title}</span>
                  </div>
                ))}
                {questEvents.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-offwhite bg-obsidian p-2 rounded-sm border border-steel/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ash flex-shrink-0" />
                    <span>{q.title}</span>
                  </div>
                ))}
                {achievementEvents.map((ach, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-offwhite bg-obsidian p-2 rounded-sm border border-steel/60">
                    <Crown className="w-3.5 h-3.5 text-crimson flex-shrink-0" />
                    <span>{ach.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            {onOpenReflection && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReflection(workout);
                }}
                className="w-full sm:w-1/2 py-2.5 px-3 rounded-sm border border-steel-700 bg-charcoal-900 text-bone hover:border-steel-500 font-orbitron font-bold text-xs uppercase transition-colors"
              >
                RECORD REFLECTION
              </button>
            )}
            <AnimeButton
              variant="crimson"
              size="lg"
              className={onOpenReflection ? "w-full sm:w-1/2" : "w-full"}
              icon={ArrowRight}
              onClick={onClose}
            >
              CONFIRM & PROCEED
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WorkoutCompletionModal;
