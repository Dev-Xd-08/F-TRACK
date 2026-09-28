import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Flame,
  Clock,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Scale,
  RefreshCw,
  AlertTriangle,
  History,
  TrendingUp,
  Layers,
  ChevronRight,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimeButton from '../ui/AnimeButton';
import GoalModal from './GoalModal';
import GoalDetail from './GoalDetail';
import GoalHistory from './GoalHistory';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  refreshGoal,
  updateGoalProgress,
} from '../../services/goalService';
import { useToast } from '../../context/ToastContext';

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
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-obsidian border border-steel text-offwhite flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-crimson" />
          <span>COMPLETED</span>
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-obsidian border border-crimson/50 text-crimson flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>EXPIRED</span>
        </span>
      );
    case 'PAUSED':
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-obsidian border border-steel/60 text-ash">
          PAUSED
        </span>
      );
    case 'ACTIVE':
    default:
      return (
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-obsidian border border-steel text-offwhite flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
          <span>ACTIVE</span>
        </span>
      );
  }
};

/**
 * GoalCard Component
 * Individual active mission card on the board
 */
const GoalCard = ({ goal, onSelect, onRefresh }) => {
  const Icon = getGoalTypeIcon(goal.type);
  const remaining = Math.max(0, goal.targetValue - goal.currentValue);
  const targetDateObj = new Date(goal.targetDate);
  const isValidDate = !isNaN(targetDateObj.getTime());
  const daysLeft = isValidDate ? Math.ceil((targetDateObj - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const isCompleted = goal.status === 'COMPLETED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(goal)}
      className="rounded-sm p-5 border border-steel bg-charcoal shadow-steel-card flex flex-col justify-between transition-all duration-200 cursor-pointer group hover:border-steel-light"
    >
      <div className="space-y-3 relative z-10">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center border border-steel bg-obsidian text-offwhite">
              <Icon className="w-4 h-4 text-steel-light" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ash block">
                {goal.type} OBJECTIVE
              </span>
              <h4 className="font-orbitron font-bold text-sm text-offwhite group-hover:text-bone transition-colors truncate max-w-[180px] sm:max-w-[220px]">
                {goal.title}
              </h4>
            </div>
          </div>
          {getStatusBadge(goal.status)}
        </div>

        {/* Description (if any) */}
        {goal.description && (
          <p className="text-xs text-ash font-sans line-clamp-2 leading-relaxed">
            {goal.description}
          </p>
        )}

        {/* Progress Metric Numbers */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-orbitron font-black text-2xl text-offwhite">
              {goal.currentValue}
            </span>
            <span className="text-xs font-mono text-ash">
              / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <span className="font-mono font-bold text-sm text-bone">
            {goal.progressPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-void rounded-none overflow-hidden border border-steel/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${
              isCompleted
                ? 'bg-steel-light'
                : 'bg-gradient-to-r from-crimson-dark to-crimson'
            }`}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-4 border-t border-steel/50 flex items-center justify-between text-[11px] font-mono relative z-10 text-ash">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-ash" />
          {daysLeft !== null && daysLeft > 0 ? (
            <span>{daysLeft} days remaining</span>
          ) : daysLeft === 0 ? (
            <span className="text-crimson font-bold">Due today</span>
          ) : daysLeft !== null ? (
            <span className="text-crimson">Overdue</span>
          ) : (
            <span>No deadline</span>
          )}
        </span>

        <span className="text-ash group-hover:text-offwhite flex items-center gap-1 font-mono text-[10px] tracking-wider transition-colors">
          <span>DETAILS</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </motion.div>
  );
};

/**
 * GoalBoard Component (Stage 13)
 * Central Mission Planning and Goals dashboard module
 */
export const GoalBoard = ({ onDashboardSync }) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'COMPLETED' | 'HISTORY' | 'ALL'

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Fetch Goals
  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getGoals();
      setGoals(data.goals || []);
    } catch (err) {
      console.warn('Failed to fetch goals:', err.message);
      setError(err.message || 'Unable to connect to Mission Control engine.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Derived Goal Sets
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE');
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED');
  const historyGoals = goals.filter((g) => g.status !== 'ACTIVE');

  // Filtered list based on active tab
  const getFilteredGoals = () => {
    switch (activeTab) {
      case 'ACTIVE':
        return activeGoals;
      case 'COMPLETED':
        return completedGoals;
      case 'ALL':
        return goals;
      case 'HISTORY':
      default:
        return historyGoals;
    }
  };

  const filteredGoals = getFilteredGoals();

  // Handlers
  const handleOpenCreate = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (goalData) => {
    if (editingGoal) {
      const id = editingGoal._id || editingGoal.id;
      await updateGoal(id, goalData);
      toast.success('MISSION UPDATED', `Parameters recalibrated for "${goalData.title}".`);
    } else {
      await createGoal(goalData);
      toast.success('NEW MISSION LOCKED', `Target "${goalData.title}" registered in Mission Control.`);
    }
    await loadGoals();
    if (onDashboardSync) onDashboardSync();
  };

  const handleDeleteGoal = async (id) => {
    await deleteGoal(id);
    setSelectedGoal(null);
    toast.info('MISSION ABORTED', 'Fitness mission removed from active board.');
    await loadGoals();
    if (onDashboardSync) onDashboardSync();
  };

  const handleRefreshGoal = async (id) => {
    const prevGoal = goals.find((g) => (g._id || g.id) === id);
    const updated = await refreshGoal(id);
    if (updated && updated.goal) {
      setSelectedGoal(updated.goal);
      if (updated.goal.status === 'COMPLETED' && prevGoal?.status !== 'COMPLETED') {
        toast.goalCompleted(updated.goal.title);
      }
    }
    await loadGoals();
    if (onDashboardSync) onDashboardSync();
  };

  const handleUpdateProgress = async (id, value) => {
    const prevGoal = goals.find((g) => (g._id || g.id) === id);
    const updated = await updateGoalProgress(id, value);
    if (updated && updated.goal) {
      setSelectedGoal(updated.goal);
      if (updated.goal.status === 'COMPLETED' && prevGoal?.status !== 'COMPLETED') {
        toast.goalCompleted(updated.goal.title);
      }
    }
    await loadGoals();
    if (onDashboardSync) onDashboardSync();
  };

  return (
    <section className="space-y-4">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-obsidian border border-steel flex items-center justify-center text-crimson">
            <Target className="w-4 h-4 text-crimson" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite tracking-wider">
                MISSION CONTROL
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-charcoal text-ash border border-steel/60">
                PERSONAL GOALS
              </span>
            </div>
            <p className="text-xs text-ash font-sans">
              Set empirical targets. Real training telemetry drives all calculations.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadGoals}
            disabled={loading}
            className="p-2 rounded-sm bg-obsidian border border-steel hover:border-steel-light text-ash hover:text-offwhite transition-colors"
            title="Synchronize Mission Telemetry"
            aria-label="Synchronize Mission Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-offwhite' : ''}`} />
          </button>

          <AnimeButton
            variant="crimson"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            NEW MISSION
          </AnimeButton>
        </div>
      </div>

      {/* Navigation Filter Tabs & Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-obsidian p-1 rounded-sm border border-steel">
        <div className="flex items-center gap-1">
          {[
            { id: 'ACTIVE', label: 'ACTIVE', count: activeGoals.length, icon: Target },
            { id: 'COMPLETED', label: 'COMPLETED', count: completedGoals.length, icon: CheckCircle2 },
            { id: 'HISTORY', label: 'HISTORY', count: historyGoals.length, icon: History },
            { id: 'ALL', label: 'ALL MISSIONS', count: goals.length, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-charcoal text-offwhite border border-steel shadow-steel-card'
                    : 'text-ash hover:text-offwhite'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-sm font-mono font-bold ${
                    isActive ? 'bg-gunmetal text-offwhite' : 'bg-charcoal text-ash'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Summary Metrics */}
        <div className="hidden md:flex items-center gap-4 px-3 text-xs font-mono text-ash">
          <span>
            ACTIVE: <strong className="text-bone-100">{activeGoals.length}</strong>
          </span>
          <span className="text-steel">•</span>
          <span>
            COMPLETED: <strong className="text-emerald-400">{completedGoals.length}</strong>
          </span>
          <span className="text-steel">•</span>
          <span>
            TOTAL INITIATED: <strong className="text-bone-200">{goals.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Board Content */}
      {loading && goals.length === 0 ? (
        <div className="text-center py-16 rounded border border-steel bg-charcoal-900/60 shadow-steel-card space-y-3">
          <RefreshCw className="w-8 h-8 text-ash animate-spin mx-auto" />
          <p className="font-orbitron text-xs text-ash tracking-wider">
            SYNCHRONIZING MISSION CONTROL...
          </p>
        </div>
      ) : activeTab === 'HISTORY' ? (
        <GoalHistory
          goals={goals}
          onSelectGoal={(goal) => setSelectedGoal(goal)}
        />
      ) : filteredGoals.length === 0 ? (
        /* Empty State */
        <GlassCard glow="none" className="text-center py-12 px-4 space-y-4 border-steel bg-charcoal-900 shadow-steel-card">
          <div className="w-14 h-14 rounded bg-charcoal-800 border border-steel mx-auto flex items-center justify-center text-bone-100 shadow-steel-card">
            <Target className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="font-orbitron font-bold text-base text-bone-100 uppercase tracking-wider">
              {activeTab === 'ACTIVE'
                ? 'NO ACTIVE MISSIONS IN QUEUE'
                : activeTab === 'COMPLETED'
                ? 'NO MISSIONS COMPLETED YET'
                : 'MISSION CONTROL DATABASE VACANT'}
            </h4>
            <p className="text-xs text-slate-300 font-sans">
              {activeTab === 'ACTIVE'
                ? 'Initialize your first personal fitness goal to begin tracking empirical progress. Workouts, streaks, calories, and duration will automatically advance mission telemetry.'
                : 'Complete active fitness targets through real workout logs to archive mission honors.'}
            </p>
          </div>

          <div className="pt-2">
            <AnimeButton
              variant="crimson"
              size="md"
              icon={Plus}
              onClick={handleOpenCreate}
            >
              INITIALIZE FIRST MISSION
            </AnimeButton>
          </div>
        </GlassCard>
      ) : (
        /* Mission Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal._id || goal.id}
                goal={goal}
                onSelect={(g) => setSelectedGoal(g)}
                onRefresh={handleRefreshGoal}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Goal Modal (Create / Edit) */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />

      {/* Goal Detail Modal */}
      <GoalDetail
        goal={selectedGoal}
        isOpen={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteGoal}
        onUpdateProgress={handleUpdateProgress}
        onRefresh={handleRefreshGoal}
      />
    </section>
  );
};

export default GoalBoard;
