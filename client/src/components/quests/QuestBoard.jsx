import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Flame, 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Award, 
  ChevronRight,
  History,
  Zap,
  Timer
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

/**
 * QuestCard Component
 * Displays individual mission status, progress bar, and rewards
 */
const QuestCard = ({ quest, isWeekly = false }) => {
  const {
    id,
    title,
    description,
    currentValue = 0,
    target = 1,
    unit = '',
    xp = 25,
    percentage = 0,
    completed = false,
    completedAt,
    timeRemaining = '',
  } = quest;

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'duration':
        return Clock;
      case 'calories':
        return Flame;
      case 'workouts':
      default:
        return Dumbbell;
    }
  };

  const IconComponent = getMetricIcon(quest.metric);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-sm p-5 border relative overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        completed
          ? 'bg-charcoal border-steel shadow-steel-card'
          : 'bg-charcoal border-steel/70 hover:border-steel shadow-steel-card'
      }`}
    >
      {/* Top Header */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 bg-obsidian border border-steel ${
              completed ? 'text-crimson' : 'text-offwhite'
            }`}>
              {completed ? (
                <CheckCircle2 className="w-4 h-4 text-crimson" />
              ) : (
                <IconComponent className="w-4 h-4 text-steel-light" />
              )}
            </div>

            <div>
              <h4 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite uppercase tracking-wide flex items-center gap-2">
                {title}
              </h4>
              <span className="text-[10px] font-mono text-ash uppercase flex items-center gap-1">
                <Timer className="w-3 h-3 text-ash" />
                {timeRemaining || (isWeekly ? 'WEEKLY DIRECTIVE' : 'DAILY DIRECTIVE')}
              </span>
            </div>
          </div>

          {/* XP Reward Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold border border-steel/60 bg-obsidian text-bone flex-shrink-0">
            <span>+{xp} XP</span>
          </div>
        </div>

        {/* Quest Description */}
        <p className="text-xs text-ash font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Progress Area */}
      <div className="mt-5 pt-3 border-t border-steel/50 space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-ash">
            {completed ? 'DIRECTIVE SATISFIED' : 'OBJECTIVE PROGRESS'}
          </span>
          <span className="font-bold text-offwhite">
            {currentValue.toLocaleString()} / {target.toLocaleString()}{' '}
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
              completed
                ? 'bg-steel-light'
                : 'bg-gradient-to-r from-crimson-dark to-crimson'
            }`}
          />
        </div>

        {/* Footer Status Badge */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-ash">
            {percentage}% VERIFIED
          </span>

          {completed ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-obsidian text-offwhite border border-steel">
              <CheckCircle2 className="w-3 h-3 text-crimson" />
              <span>COMPLETED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-obsidian text-ash border border-steel/60">
              <span>IN PROGRESS</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * QuestBoard Component (Stage 8)
 * Primary Mission Dashboard presenting Daily Quests, Weekly Missions, and Completion Archives
 */
export const QuestBoard = ({ quests, history = [], onRefresh }) => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'history'

  const dailyQuests = quests?.daily || [];
  const weeklyQuests = quests?.weekly || [];

  const dailyCompletedCount = dailyQuests.filter((q) => q.completed).length;
  const weeklyCompletedCount = weeklyQuests.filter((q) => q.completed).length;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-crimson">
            <Target className="w-4 h-4 text-crimson" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite flex items-center gap-2 tracking-wider">
              OPERATIONAL DIRECTIVES
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-charcoal text-ash border border-steel/60">
                ACTIVE MISSIONS
              </span>
            </h3>
            <p className="text-[11px] text-ash font-sans">
              Daily and weekly training requirements calculated from authentic workout telemetry
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1 p-0.5 rounded-sm bg-obsidian border border-steel">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-charcoal text-offwhite border border-steel shadow-steel-card'
                : 'text-ash hover:text-offwhite'
            }`}
          >
            <span>DAILY</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-obsidian text-ash">
              {dailyCompletedCount}/{dailyQuests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-charcoal text-offwhite border border-steel shadow-steel-card'
                : 'text-ash hover:text-offwhite'
            }`}
          >
            <span>WEEKLY</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-obsidian text-ash">
              {weeklyCompletedCount}/{weeklyQuests.length}
            </span>
          </button>

          {history && history.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-charcoal text-offwhite border border-steel shadow-steel-card'
                  : 'text-ash hover:text-offwhite'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>ARCHIVE</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'daily' && (
          <motion.div
            key="daily-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} isWeekly={false} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'weekly' && (
          <motion.div
            key="weekly-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weeklyQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} isWeekly={true} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-2.5"
          >
            {history.length === 0 ? (
              <GlassCard glow="none" className="p-6 text-center text-xs font-mono text-ash">
                No archived quests yet. Complete daily or weekly quests to establish your record archive.
              </GlassCard>
            ) : (
              history.slice(0, 10).map((h, idx) => (
                <div
                  key={`${h.questId}-${idx}-${h.completedAt}`}
                  className="p-3.5 rounded-sm bg-obsidian border border-steel/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-sm bg-charcoal border border-steel flex items-center justify-center flex-shrink-0 text-bone">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded-sm bg-charcoal text-amber-400 border border-steel uppercase">
                          {h.type}
                        </span>
                        <h5 className="font-orbitron font-bold text-xs text-bone truncate">
                          {h.title}
                        </h5>
                      </div>
                      <p className="text-xs text-ash font-sans truncate mt-0.5">
                        Completed {h.completedAt ? new Date(h.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-bone">
                      +{h.xp} XP
                    </span>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestBoard;
