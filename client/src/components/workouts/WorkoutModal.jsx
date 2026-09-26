import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Flame, Calendar, FileText, AlertCircle, Dumbbell } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';

const ACTIVITIES = [
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Swimming',
  'Yoga',
  'HIIT',
  'Sports',
  'Other',
];

export const WorkoutModal = ({ isOpen, onClose, onSave, initialData = null, isSaving = false }) => {
  const isEditing = !!initialData;

  const [activityType, setActivityType] = useState('Gym');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [workoutDate, setWorkoutDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setActivityType(initialData.activityType || 'Gym');
      setDuration(initialData.duration?.toString() || '');
      setCaloriesBurned(initialData.caloriesBurned?.toString() || '');
      setWorkoutDate(
        initialData.workoutDate
          ? new Date(initialData.workoutDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNotes(initialData.notes || '');
    } else {
      setActivityType('Gym');
      setDuration('');
      setCaloriesBurned('');
      setWorkoutDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!activityType) {
      setError('Please select a valid training activity.');
      return;
    }

    const numDuration = Number(duration);
    if (!duration || isNaN(numDuration) || numDuration <= 0) {
      setError('Training duration must be greater than 0 minutes.');
      return;
    }

    const numCalories = Number(caloriesBurned);
    if (caloriesBurned === '' || isNaN(numCalories) || numCalories < 0) {
      setError('Calories burned must be 0 or greater.');
      return;
    }

    if (!workoutDate) {
      setError('Workout date is required.');
      return;
    }

    onSave({
      activityType,
      duration: numDuration,
      caloriesBurned: numCalories,
      workoutDate,
      notes,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md overflow-y-auto">
        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-2xl bg-obsidian/95 border border-cyan-neon/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,245,255,0.2)] overflow-hidden"
        >
          {/* Top Beam & Cyber Corners */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-neon via-violet-neon to-crimson-aura" />
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-neon" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-violet-neon" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-crimson-aura" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gold-mythic" />

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isSaving}
            className="absolute top-5 right-5 p-1.5 rounded-sm border border-slate-700 text-slate-400 hover:text-cyan-neon hover:border-cyan-neon transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-neon/10 border border-cyan-neon/40 text-cyan-neon shadow-glow-cyan">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-bold tracking-widest text-cyan-neon uppercase">
                {isEditing ? 'RECALIBRATE PROTOCOL' : 'NEW TRAINING MISSION'}
              </span>
              <h2 className="font-orbitron font-black text-xl text-slate-100 uppercase tracking-wide">
                {isEditing ? 'UPDATE QUEST' : 'COMMENCE NEW QUEST'}
              </h2>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-crimson-aura/10 border border-crimson-aura/40 flex items-center gap-2 text-xs font-mono text-crimson-aura">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Type Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                ACTIVITY TYPE
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 text-sm font-sans focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors"
              >
                {ACTIVITIES.map((act) => (
                  <option key={act} value={act} className="bg-obsidian text-slate-200">
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration and Calories 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-1.5">
                <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-neon" />
                  DURATION (MINUTES)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 45"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors"
                />
              </div>

              {/* Calories Burned */}
              <div className="space-y-1.5">
                <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-crimson-aura" />
                  CALORIES BURNED (KCAL)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  placeholder="e.g. 350"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-crimson-aura focus:ring-1 focus:ring-crimson-aura transition-colors"
                />
              </div>
            </div>

            {/* Workout Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold-mythic" />
                TRAINING DATE
              </label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 text-sm font-sans focus:outline-none focus:border-gold-mythic focus:ring-1 focus:ring-gold-mythic transition-colors"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-violet-glow" />
                QUEST NOTES (OPTIONAL)
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Heavy deadlift day, new personal record achieved..."
                className="w-full px-3.5 py-2 rounded-lg bg-void/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <AnimeButton
                type="button"
                variant="outline"
                size="md"
                disabled={isSaving}
                onClick={onClose}
              >
                ABORT
              </AnimeButton>

              <AnimeButton
                type="submit"
                variant={isEditing ? 'violet' : 'cyan'}
                size="md"
                icon={Zap}
                disabled={isSaving}
              >
                {isSaving
                  ? 'TRANSMITTING...'
                  : isEditing
                  ? 'UPDATE QUEST'
                  : 'COMPLETE QUEST'}
              </AnimeButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WorkoutModal;
