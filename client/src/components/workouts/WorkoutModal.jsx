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

  // Populate form if editing or reset
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

  // Keyboard Escape support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSaving && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return; // Prevent duplicate clicks
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
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          // Backdrop click closes modal if clicked directly on overlay and not saving
          if (e.target === e.currentTarget && !isSaving && onClose) {
            onClose();
          }
        }}
      >
        {/* Modal Box */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="workout-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-xl bg-obsidian border border-steel/60 p-6 sm:p-8 shadow-steel-card overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-crimson" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="absolute top-5 right-5 p-1.5 rounded-sm border border-steel/60 text-ash hover:text-bone hover:border-steel transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-charcoal border border-steel/60 text-crimson-bright shadow-steel-card">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-bold tracking-widest text-ash uppercase">
                {isEditing ? 'UPDATE WORKOUT' : 'NEW TRAINING SESSION'}
              </span>
              <h2 id="workout-modal-title" className="font-orbitron font-black text-xl text-bone uppercase tracking-wide">
                {isEditing ? 'EDIT WORKOUT' : 'RECORD WORKOUT SESSION'}
              </h2>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-crimson/15 border border-crimson/50 flex items-center gap-2 text-xs font-mono text-crimson-bright">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Type Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-ash">
                DISCIPLINE / ACTIVITY TYPE
              </label>
              <select
                value={activityType}
                onChange={(e) => {
                  setActivityType(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-void border border-steel/60 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors cursor-pointer"
              >
                {ACTIVITIES.map((act) => (
                  <option key={act} value={act} className="bg-obsidian text-bone">
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration & Calories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-1.5">
                <label className="block text-xs font-orbitron font-bold tracking-wider text-ash flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-steel-light" />
                  DURATION (MINUTES)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 45"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-void border border-steel/60 text-bone placeholder-ash/60 text-sm font-sans focus:outline-none focus:border-crimson transition-colors"
                />
              </div>

              {/* Calories Burned */}
              <div className="space-y-1.5">
                <label className="block text-xs font-orbitron font-bold tracking-wider text-ash flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-crimson-bright" />
                  CALORIES BURNED (KCAL)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={caloriesBurned}
                  onChange={(e) => {
                    setCaloriesBurned(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 350"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-void border border-steel/60 text-bone placeholder-ash/60 text-sm font-sans focus:outline-none focus:border-crimson transition-colors"
                />
              </div>
            </div>

            {/* Workout Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-ash flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-steel-light" />
                SESSION DATE
              </label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => {
                  setWorkoutDate(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-void border border-steel/60 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-orbitron font-bold tracking-wider text-ash flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-steel-light" />
                SESSION NOTES (OPTIONAL)
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on form, steady pace throughout..."
                className="w-full px-3.5 py-2 rounded-lg bg-void border border-steel/60 text-bone placeholder-ash/60 text-sm font-sans focus:outline-none focus:border-crimson transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-steel/40 flex items-center justify-end gap-3">
              <AnimeButton
                type="button"
                variant="outline"
                size="md"
                disabled={isSaving}
                onClick={onClose}
              >
                CANCEL
              </AnimeButton>

              <AnimeButton
                type="submit"
                variant="crimson"
                size="md"
                icon={Zap}
                disabled={isSaving}
              >
                {isSaving
                  ? 'SAVING...'
                  : isEditing
                  ? 'UPDATE WORKOUT'
                  : 'LOG SESSION'}
              </AnimeButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WorkoutModal;
