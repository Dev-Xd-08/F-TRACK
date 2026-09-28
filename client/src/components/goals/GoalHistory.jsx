import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  Zap,
  Scale,
  Calendar,
  AlertTriangle,
  PauseCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const getGoalTypeIcon = (type) => {
  switch (type) {
    case 'WORKOUTS':
      return Dumbbell;
    case 'MINUTES':
      return Clock;
    case 'CALORIES':
      return Flame;
    case 'STREAK':
      return Zap;
    case 'WEIGHT':
      return Scale;
    case 'CUSTOM':
    default:
      return Target;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-matrix-neon/15 border border-matrix-neon/40 text-matrix-neon shadow-glow-matrix flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>COMPLETED</span>
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-crimson-aura/15 border border-crimson-aura/40 text-crimson-aura flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>EXPIRED</span>
        </span>
      );
    case 'PAUSED':
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-1">
          <PauseCircle className="w-3 h-3" />
          <span>PAUSED</span>
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-slate-800 text-slate-400">
          {status}
        </span>
      );
  }
};

/**
 * GoalHistory Component (Stage 13)
 * Displays archive of completed, expired, and paused fitness missions
 */
export const GoalHistory = ({ goals = [], onSelectGoal }) => {
  const historyGoals = goals.filter((g) => g.status !== 'ACTIVE');

  if (historyGoals.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-slate-800/80 bg-obsidian/40 backdrop-blur-sm space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
          <Target className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-orbitron text-slate-300 font-bold uppercase tracking-wider">
            NO MISSION ARCHIVES RECORDED
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
            Missions that reach completion, expire past their deadline, or are paused will be indexed in this telemetry archive.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historyGoals.map((goal, idx) => {
        const Icon = getGoalTypeIcon(goal.type);
        const isComplete = goal.status === 'COMPLETED';
        const isExpired = goal.status === 'EXPIRED';

        return (
          <motion.div
            key={goal._id || goal.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onClick={() => onSelectGoal && onSelectGoal(goal)}
            className={`group rounded-xl p-4 border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isComplete
                ? 'bg-matrix-neon/[0.03] border-matrix-neon/30 hover:border-matrix-neon/60 hover:shadow-glow-matrix/20'
                : isExpired
                ? 'bg-crimson-aura/[0.02] border-crimson-aura/25 hover:border-crimson-aura/50'
                : 'bg-obsidian/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Left Info */}
            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
                  isComplete
                    ? 'bg-matrix-neon/15 border-matrix-neon/40 text-matrix-neon'
                    : isExpired
                    ? 'bg-crimson-aura/15 border-crimson-aura/40 text-crimson-aura'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-orbitron font-bold text-sm text-slate-200 group-hover:text-cyan-neon transition-colors truncate">
                    {goal.title}
                  </h4>
                  {getStatusBadge(goal.status)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
                  <span>
                    TARGET: <strong className="text-slate-200">{goal.targetValue} {goal.unit}</strong>
                  </span>
                  <span>
                    RECORDED: <strong className={isComplete ? 'text-matrix-neon' : 'text-slate-300'}>{goal.currentValue} {goal.unit}</strong>
                  </span>
                  {goal.completedAt ? (
                    <span className="text-matrix-neon flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      COMPLETED: {new Date(goal.completedAt).toLocaleDateString()}
                    </span>
                  ) : goal.targetDate ? (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      TARGET DATE: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right Gauge / Action */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:w-48 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
              <div className="flex-1 sm:w-28 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">FINAL SYNC</span>
                  <span
                    className={`font-orbitron font-bold ${
                      isComplete
                        ? 'text-matrix-neon'
                        : isExpired
                        ? 'text-crimson-aura'
                        : 'text-slate-300'
                    }`}
                  >
                    {goal.progressPercentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      isComplete
                        ? 'bg-matrix-neon'
                        : isExpired
                        ? 'bg-crimson-aura'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                  />
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-neon group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GoalHistory;
