import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Shield, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import { saveReflection } from '../../services/reflectionService';

const EFFORT_OPTIONS = [
  {
    key: 'EASY',
    label: 'EASY & RECOVERING',
    rpe: 'RPE 1–4',
    desc: 'Gentle, conversational movement. Restorative.',
    color: 'border-emerald-700/60 text-emerald-400 bg-emerald-950/20',
    selectedColor: 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-500',
  },
  {
    key: 'GOOD',
    label: 'GOOD & SOLID',
    rpe: 'RPE 5–7',
    desc: 'Productive stimulus, controlled challenge, solid rhythm.',
    color: 'border-blue-700/60 text-blue-400 bg-blue-950/20',
    selectedColor: 'border-blue-500 bg-blue-950/50 text-blue-300 ring-1 ring-blue-500',
  },
  {
    key: 'HARD',
    label: 'HARD & DEMANDING',
    rpe: 'RPE 8–9',
    desc: 'Heavy physical exertion. Deep focus and stamina required.',
    color: 'border-amber-700/60 text-amber-400 bg-amber-950/20',
    selectedColor: 'border-amber-500 bg-amber-950/50 text-amber-300 ring-1 ring-amber-500',
  },
  {
    key: 'VERY_HARD',
    label: 'VERY HARD & LIMITING',
    rpe: 'RPE 10',
    desc: 'Maximum exertion. Pushed to current outer physical limits.',
    color: 'border-crimson-700/60 text-crimson-400 bg-crimson-950/20',
    selectedColor: 'border-crimson-500 bg-crimson-950/50 text-crimson-300 ring-1 ring-crimson-500',
  },
];

/**
 * WorkoutReflectionModal Component (Stage 19)
 * Allows user to optionally capture subjective perceived effort and mindset note after a workout.
 * 100% non-blocking; user can skip at any time.
 */
export const WorkoutReflectionModal = ({
  isOpen = false,
  onClose,
  workout = null,
  onSaved,
}) => {
  const [effort, setEffort] = useState('GOOD');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !workout) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const reflectionData = {
        workoutId: workout._id || workout.id,
        effort,
        note: note.trim(),
        activityType: workout.activityType || 'General Training',
        duration: workout.duration || 0,
      };

      const result = await saveReflection(reflectionData);
      if (onSaved) onSaved(result);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to save session reflection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-sm bg-charcoal-900 border border-steel-700 p-6 sm:p-7 shadow-steel-card space-y-6 my-8"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-crimson-600" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-sm text-ash-400 hover:text-bone hover:bg-steel-800 transition-colors"
            aria-label="Close reflection modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>HONEST SESSION INTROSPECTION</span>
            </div>
            <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-bone uppercase tracking-tight">
              SESSION REFLECTION
            </h2>
            <p className="text-xs font-sans text-ash-400">
              Numbers describe the workout. Reflection builds the habit. How did this session feel for you?
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-crimson-950/50 border border-crimson-800 text-xs font-mono text-crimson-300">
              {error}
            </div>
          )}

          {/* Effort Selection Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
              PERCEIVED EXERTION (RPE):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EFFORT_OPTIONS.map((opt) => {
                const isSelected = effort === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setEffort(opt.key)}
                    className={`p-3 rounded-sm text-left border transition-all ${
                      isSelected ? opt.selectedColor : `${opt.color} hover:border-steel-600`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-orbitron font-bold text-xs uppercase tracking-wide">
                        {opt.label}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-sm bg-charcoal-950 border border-steel-800">
                        {opt.rpe}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-ash-400 leading-snug">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note / Focus */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest">
                PERSONAL NOTE / MINDSET (OPTIONAL):
              </span>
              <span className="text-[10px] font-mono text-ash-500">
                {note.length}/500
              </span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="Felt sluggish warming up, but strong during the second half. Focused on deliberate pacing today..."
              className="w-full bg-charcoal-950 border border-steel-700 rounded-sm p-3 text-xs text-bone placeholder-ash-500 focus:outline-none focus:border-crimson-600 font-sans leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-steel-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-sm text-xs font-mono text-ash-400 hover:text-bone hover:bg-steel-800 transition-colors uppercase"
            >
              SKIP FOR NOW
            </button>
            <AnimeButton
              variant="crimson"
              size="md"
              icon={ArrowRight}
              disabled={loading}
              className="w-full sm:w-auto"
              onClick={handleSubmit}
            >
              {loading ? 'RECORDING...' : 'SAVE REFLECTION'}
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WorkoutReflectionModal;
