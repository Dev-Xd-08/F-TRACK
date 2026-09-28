import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  X,
  Calendar,
  Sparkles,
  Dumbbell,
  Clock,
  Flame,
  Zap,
  Scale,
  Award,
  AlertCircle,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimeButton from '../ui/AnimeButton';

const GOAL_TYPES = [
  { id: 'WORKOUTS', label: 'Workout Count', unit: 'workouts', icon: Dumbbell, defaultTarget: 20 },
  { id: 'MINUTES', label: 'Active Minutes', unit: 'min', icon: Clock, defaultTarget: 500 },
  { id: 'CALORIES', label: 'Caloric Burn', unit: 'kcal', icon: Flame, defaultTarget: 5000 },
  { id: 'STREAK', label: 'Discipline Streak', unit: 'days', icon: Zap, defaultTarget: 7 },
  { id: 'WEIGHT', label: 'Body Mass Target', unit: 'kg', icon: Scale, defaultTarget: 70 },
  { id: 'CUSTOM', label: 'Custom Mission', unit: 'units', icon: Target, defaultTarget: 10 },
];

/**
 * Format date to YYYY-MM-DD for input[type="date"]
 */
const toDateInputString = (d) => {
  const date = new Date(d);
  return date.toISOString().split('T')[0];
};

/**
 * GoalModal Component (Stage 13)
 * Interactive modal for initializing or editing personal fitness missions
 */
export const GoalModal = ({ isOpen, onClose, onSave, editingGoal = null }) => {
  const [type, setType] = useState('WORKOUTS');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState(20);
  const [unit, setUnit] = useState('workouts');
  const [startDate, setStartDate] = useState(toDateInputString(new Date()));
  const [targetDate, setTargetDate] = useState(
    toDateInputString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setType(editingGoal.type);
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setTargetValue(editingGoal.targetValue);
      setUnit(editingGoal.unit || 'units');
      setStartDate(toDateInputString(editingGoal.startDate));
      setTargetDate(toDateInputString(editingGoal.targetDate));
    } else {
      setType('WORKOUTS');
      setTitle('Complete 20 Workout Quests');
      setDescription('Maintain sustained physical conditioning across the upcoming 30-day window.');
      setTargetValue(20);
      setUnit('workouts');
      setStartDate(toDateInputString(new Date()));
      setTargetDate(toDateInputString(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));
    }
    setError('');
  }, [editingGoal, isOpen]);

  const handleTypeChange = (newType) => {
    setType(newType);
    const cfg = GOAL_TYPES.find((g) => g.id === newType);
    if (cfg) {
      setUnit(cfg.unit);
      setTargetValue(cfg.defaultTarget);
      if (!editingGoal) {
        switch (newType) {
          case 'WORKOUTS':
            setTitle('Complete 20 Workout Quests');
            setDescription('Establish consistent weekly cadence across all disciplines.');
            break;
          case 'MINUTES':
            setTitle('Accumulate 500 Active Minutes');
            setDescription('Total training duration recorded in empirical telemetry.');
            break;
          case 'CALORIES':
            setTitle('Ignite 5,000 Total Calories');
            setDescription('Metabolic burnout target for current training cycle.');
            break;
          case 'STREAK':
            setTitle('Achieve a 7-Day Ascension Streak');
            setDescription('Log workouts across 7 consecutive calendar days.');
            break;
          case 'WEIGHT':
            setTitle('Reach 70 kg Body Mass Target');
            setDescription('Biometric milestone tracked via Body Analysis scans.');
            break;
          case 'CUSTOM':
            setTitle('Custom Training Objective');
            setDescription('User-defined physical milestone with manual progress tracking.');
            break;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a mission title.');
      return;
    }

    const numTarget = Number(targetValue);
    if (!targetValue || isNaN(numTarget) || numTarget <= 0) {
      setError('Target value must be a positive number greater than 0.');
      return;
    }

    if (new Date(targetDate) < new Date(startDate)) {
      setError('Target deadline date cannot precede the start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        type,
        title: title.trim(),
        description: description.trim(),
        targetValue: numTarget,
        unit: unit.trim(),
        startDate,
        targetDate,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save fitness mission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
        <GlassCard glow="cyan" className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-neon/15 border border-cyan-neon/30 flex items-center justify-center text-cyan-neon shadow-glow-cyan">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-sm sm:text-base text-slate-100 uppercase tracking-wide">
                  {editingGoal ? 'MODIFY MISSION PARAMETERS' : 'INITIALIZE FITNESS MISSION'}
                </h3>
                <span className="text-[10px] font-mono text-cyan-neon tracking-widest uppercase">
                  PERSONAL GOAL & STRATEGIC PLANNING
                </span>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-crimson-aura/10 border border-crimson-aura/40 flex items-center gap-2 text-xs text-crimson-aura font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Goal Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                MISSION TYPE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GOAL_TYPES.map((cfg) => {
                  const Icon = cfg.icon;
                  const isSelected = type === cfg.id;
                  return (
                    <button
                      key={cfg.id}
                      type="button"
                      disabled={!!editingGoal}
                      onClick={() => handleTypeChange(cfg.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-cyan-neon/20 border-cyan-neon/60 text-cyan-neon shadow-glow-cyan'
                          : 'bg-obsidian/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      } ${editingGoal ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[10px] font-orbitron font-bold truncate">
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mission Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                MISSION TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete 20 Workouts"
                required
                className="w-full px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-sans text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>

            {/* Target Value and Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                  TARGET VALUE
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-mono text-cyan-neon placeholder-slate-600 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                  UNIT LABEL
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. workouts, min, kg"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-mono text-slate-300 placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Dates: Start Date & Target Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                  START DATE
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-mono text-slate-300 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                  TARGET DEADLINE
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-mono text-slate-300 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[11px] font-orbitron font-bold text-slate-300 uppercase tracking-wider block">
                MISSION BRIEFING (OPTIONAL)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief objective details or training strategy..."
                className="w-full px-3 py-2 rounded-lg bg-obsidian border border-slate-800 focus:border-cyan-neon text-xs font-sans text-slate-100 placeholder-slate-600 outline-none transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-orbitron font-bold text-slate-400 hover:text-slate-200 transition-colors"
              >
                CANCEL
              </button>

              <AnimeButton
                type="submit"
                variant="cyan"
                size="md"
                disabled={isSubmitting}
                icon={Sparkles}
              >
                {isSubmitting ? 'INITIALIZING...' : editingGoal ? 'SAVE MODIFICATIONS' : 'ACTIVATE MISSION'}
              </AnimeButton>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default GoalModal;
