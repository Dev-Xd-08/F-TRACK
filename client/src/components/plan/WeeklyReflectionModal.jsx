import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenSquare, Compass, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import { saveWeeklyReflection } from '../../services/weeklyReflectionService';

/**
 * WeeklyReflectionModal Component (Stage 20)
 * Dialog prompting end-of-week review:
 * "What went well?", "What felt difficult?", "What do you want to improve next week?"
 */
export const WeeklyReflectionModal = ({
  isOpen = false,
  onClose,
  initialData = null,
  currentReflection = null,
  weekStatus = null,
  onSaved,
  onReflectionSaved,
}) => {
  const activeReflection = currentReflection || initialData;
  const [wentWell, setWentWell] = useState(activeReflection?.wentWell || '');
  const [difficult, setDifficult] = useState(activeReflection?.difficult || '');
  const [nextFocus, setNextFocus] = useState(activeReflection?.nextFocus || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (activeReflection) {
      if (activeReflection.wentWell) setWentWell(activeReflection.wentWell);
      if (activeReflection.difficult) setDifficult(activeReflection.difficult);
      if (activeReflection.nextFocus) setNextFocus(activeReflection.nextFocus);
    }
  }, [activeReflection]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const result = await saveWeeklyReflection({
        wentWell,
        difficult,
        nextFocus,
      });

      if (onReflectionSaved) onReflectionSaved(result.reflection);
      if (onSaved) onSaved(result.reflection);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to preserve weekly reflection.');
    } finally {
      setSubmitting(false);
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
            aria-label="Close Weekly Reflection"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold">
              <PenSquare className="w-3.5 h-3.5" />
              <span>WEEKLY INTROSPECTION</span>
            </div>
            <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-bone uppercase tracking-tight">
              WEEKLY TRAINING REVIEW
            </h2>
            <p className="text-xs font-sans text-ash-400">
              Pause and calibrate. Reflecting on your actual week turns effort into sustainable mastery.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-crimson-950/50 border border-crimson-800 text-xs font-mono text-crimson-300">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prompt 1: What went well? */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
                WHAT WENT WELL THIS WEEK?
              </label>
              <textarea
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value.slice(0, 600))}
                rows={2}
                placeholder="Stayed consistent on Monday and Wednesday despite a demanding workload..."
                className="w-full bg-charcoal-950 border border-steel-700 rounded-sm p-3 text-xs text-bone placeholder-ash-500 focus:outline-none focus:border-crimson-600 font-sans leading-relaxed"
              />
            </div>

            {/* Prompt 2: What felt difficult? */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
                WHAT FELT DIFFICULT OR CAUSED FRICTION?
              </label>
              <textarea
                value={difficult}
                onChange={(e) => setDifficult(e.target.value.slice(0, 600))}
                rows={2}
                placeholder="Low energy on Thursday evening after work. Struggled to start..."
                className="w-full bg-charcoal-950 border border-steel-700 rounded-sm p-3 text-xs text-bone placeholder-ash-500 focus:outline-none focus:border-crimson-600 font-sans leading-relaxed"
              />
            </div>

            {/* Prompt 3: Next week focus */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
                WHAT DO YOU WANT TO FOCUS ON NEXT WEEK?
              </label>
              <textarea
                value={nextFocus}
                onChange={(e) => setNextFocus(e.target.value.slice(0, 600))}
                rows={2}
                placeholder="Keep weekday sessions to 20 minutes so I don't skip them..."
                className="w-full bg-charcoal-950 border border-steel-700 rounded-sm p-3 text-xs text-bone placeholder-ash-500 focus:outline-none focus:border-crimson-600 font-sans leading-relaxed"
              />
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-steel-800">
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
                disabled={submitting}
                className="w-full sm:w-auto"
                type="submit"
              >
                {submitting ? 'RECORDING...' : 'PRESERVE REVIEW'}
              </AnimeButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WeeklyReflectionModal;
