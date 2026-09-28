import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  Zap,
  Scale,
  Trash2,
  Edit3,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimeButton from '../ui/AnimeButton';

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
        <span className="px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-slate-800 border border-slate-700 text-slate-400">
          PAUSED
        </span>
      );
    case 'ACTIVE':
    default:
      return (
        <span className="px-2.5 py-0.5 rounded text-[10px] font-orbitron font-extrabold bg-cyan-neon/15 border border-cyan-neon/40 text-cyan-neon shadow-glow-cyan flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-pulse" />
          <span>ACTIVE MISSION</span>
        </span>
      );
  }
};

/**
 * GoalDetail Component (Stage 13)
 * Comprehensive modal view of an individual personal fitness mission
 */
export const GoalDetail = ({
  goal,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateProgress,
  onRefresh,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen || !goal) return null;

  const Icon = getGoalTypeIcon(goal.type);
  const remaining = Math.max(0, goal.targetValue - goal.currentValue);
  const isCustom = goal.type === 'CUSTOM';
  const goalId = goal._id || goal.id;

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const val = Number(customInput);
    if (isNaN(val) || val < 0) return;

    setIsUpdatingProgress(true);
    try {
      if (onUpdateProgress) {
        await onUpdateProgress(goalId, val);
        setCustomInput('');
      }
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleRefreshClick = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh(goalId);
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-void/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-50 w-full max-w-lg"
      >
        <GlassCard glow="violet" className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-neon/15 border border-violet-neon/30 flex items-center justify-center text-violet-glow shadow-glow-violet flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-orbitron font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    {goal.type} MISSION
                  </span>
                  {getStatusBadge(goal.status)}
                </div>
                <h3 className="font-orbitron font-black text-base text-slate-100 uppercase tracking-wide">
                  {goal.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          {goal.description && (
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-void/40 p-3 rounded-lg border border-slate-800/60">
              {goal.description}
            </p>
          )}

          {/* Progress Bar & Numerical Metrics */}
          <div className="space-y-2 p-4 rounded-xl bg-obsidian/70 border border-slate-800">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase">
                  CURRENT TRAJECTORY
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-orbitron font-black text-3xl text-cyan-neon">
                    {goal.currentValue.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    / {goal.targetValue.toLocaleString()} {goal.unit || ''}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-orbitron font-black text-2xl text-violet-glow">
                  {goal.progressPercentage}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  {goal.status === 'COMPLETED' ? 'Objective fulfilled' : `${remaining} ${goal.unit || ''} remaining`}
                </span>
              </div>
            </div>

            {/* Gauge */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progressPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full transition-all ${
                  goal.status === 'COMPLETED'
                    ? 'bg-matrix-neon shadow-glow-matrix'
                    : 'bg-gradient-to-r from-violet-neon via-cyan-neon to-matrix-neon shadow-[0_0_10px_rgba(0,245,255,0.5)]'
                }`}
              />
            </div>
          </div>

          {/* Timeline and Dates */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-void/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-orbitron">START DATE</span>
              <span className="text-slate-300">
                {goal.startDate && !isNaN(new Date(goal.startDate).getTime())
                  ? new Date(goal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'N/A'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-void/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-orbitron">TARGET DEADLINE</span>
              <span className="text-slate-300">
                {goal.targetDate && !isNaN(new Date(goal.targetDate).getTime())
                  ? new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'N/A'}
              </span>
            </div>
          </div>

          {goal.completedAt && !isNaN(new Date(goal.completedAt).getTime()) && (
            <div className="p-2.5 rounded-lg bg-matrix-neon/10 border border-matrix-neon/30 text-xs font-mono text-matrix-neon flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Fulfilled on {new Date(goal.completedAt).toLocaleDateString()}</span>
            </div>
          )}

          {/* Evidence Data Source Citation */}
          {goal.metadata?.dataSource && (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-neon flex-shrink-0" />
              <span className="truncate">Data Source: {goal.metadata.dataSource}</span>
            </div>
          )}

          {/* Manual Progress Input for CUSTOM Goals */}
          {isCustom && goal.status !== 'COMPLETED' && (
            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-cyan-neon" />
                UPDATE CUSTOM PROGRESS
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={`Current ${goal.unit || 'units'} value`}
                  required
                  className="flex-1 px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-mono text-cyan-neon placeholder-slate-600 outline-none"
                />
                <AnimeButton
                  type="submit"
                  variant="cyan"
                  size="sm"
                  disabled={isUpdatingProgress}
                >
                  {isUpdatingProgress ? 'UPDATING...' : 'RECORD'}
                </AnimeButton>
              </div>
            </form>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
                  onDelete(goalId);
                  onClose();
                }
              }}
              className="text-xs font-mono text-crimson-aura hover:underline flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE MISSION</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-lg bg-obsidian border border-slate-800 hover:border-violet-neon/40 text-xs font-mono text-slate-300 hover:text-violet-glow transition-colors flex items-center gap-1.5"
                title="Refresh with real telemetry"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-neon' : ''}`} />
                <span>SYNC</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onEdit(goal);
                }}
                className="px-3 py-1.5 rounded-lg bg-obsidian border border-slate-800 hover:border-cyan-neon/40 text-xs font-mono text-slate-300 hover:text-cyan-neon transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default GoalDetail;
