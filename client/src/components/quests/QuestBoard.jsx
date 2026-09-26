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
  const accentColor = isWeekly ? 'text-violet-glow' : 'text-cyan-neon';
  const progressBg = isWeekly ? 'bg-gradient-to-r from-violet-neon to-cyan-neon' : 'bg-gradient-to-r from-cyan-neon to-matrix-neon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
        completed
          ? 'bg-obsidian/90 border-gold-mythic/40 shadow-[0_0_20px_rgba(255,184,0,0.15)]'
          : 'bg-obsidian/75 border-slate-800 hover:border-slate-700/80 shadow-lg'
      }`}
    >
      {/* Background Ambient Glow */}
      {completed && (
        <div className="absolute top-0 right-0 w-36 h-36 bg-gold-mythic/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top Header */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              completed
                ? 'bg-gold-mythic/15 border border-gold-mythic/40 text-gold-mythic'
                : 'bg-slate-800 border border-slate-700 ' + accentColor
            }`}>
              {completed ? (
                <CheckCircle2 className="w-4 h-4 text-gold-mythic" />
              ) : (
                <IconComponent className="w-4 h-4" />
              )}
            </div>

            <div>
              <h4 className="font-orbitron font-bold text-xs sm:text-sm text-slate-100 uppercase tracking-wide flex items-center gap-2">
                {title}
              </h4>
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                <Timer className="w-3 h-3 text-slate-500" />
                {timeRemaining || (isWeekly ? 'WEEKLY CYCLE' : 'DAILY CYCLE')}
              </span>
            </div>
          </div>

          {/* XP Reward Pill */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex-shrink-0 ${
            completed
              ? 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30'
              : 'bg-slate-800/80 text-cyan-neon border-slate-700'
          }`}>
            <Sparkles className="w-3 h-3" />
            <span>+{xp} XP</span>
          </div>
        </div>

        {/* Quest Description */}
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Progress Area */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            {completed ? 'REQUIREMENT SATISFIED' : 'OBJECTIVE PROGRESS'}
          </span>
          <span className="font-bold text-slate-200">
            {currentValue.toLocaleString()} / {target.toLocaleString()}{' '}
            <span className="text-slate-500 font-normal">{unit}</span>
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              completed
                ? 'bg-gradient-to-r from-gold-mythic to-amber-300 shadow-[0_0_10px_rgba(255,184,0,0.5)]'
                : progressBg
            }`}
          />
        </div>

        {/* Footer Status Badge */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-slate-500">
            {percentage}% SYNCHRONIZED
          </span>

          {completed ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-gold-mythic/15 text-gold-mythic border border-gold-mythic/40">
              <CheckCircle2 className="w-3 h-3" />
              <span>COMPLETED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon shadow-[0_0_12px_rgba(0,245,255,0.25)]">
            <Target className="w-4 h-4 text-cyan-neon" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              QUEST BOARD
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-neon border border-slate-700">
                ACTIVE MISSIONS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Your daily and weekly fitness missions calculated from authentic workout telemetry
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>DAILY</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {dailyCompletedCount}/{dailyQuests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'weekly'
                ? 'bg-violet-neon/15 text-violet-glow border border-violet-neon/40 shadow-glow-violet'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>WEEKLY</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {weeklyCompletedCount}/{weeklyQuests.length}
            </span>
          </button>

          {history && history.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-gold-mythic/15 text-gold-mythic border border-gold-mythic/40'
                  : 'text-slate-400 hover:text-slate-200'
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
              <GlassCard className="p-6 text-center text-xs font-mono text-slate-500">
                No archived quests yet. Complete daily or weekly quests to establish your record archive.
              </GlassCard>
            ) : (
              history.slice(0, 10).map((h, idx) => (
                <div
                  key={`${h.questId}-${idx}-${h.completedAt}`}
                  className="p-3.5 rounded-xl bg-obsidian/75 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gold-mythic/10 border border-gold-mythic/30 flex items-center justify-center flex-shrink-0 text-gold-mythic">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-gold-mythic border border-slate-700 uppercase">
                          {h.type}
                        </span>
                        <h5 className="font-orbitron font-bold text-xs text-slate-200 truncate">
                          {h.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-400 font-sans truncate mt-0.5">
                        Completed {h.completedAt ? new Date(h.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-gold-mythic">
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
