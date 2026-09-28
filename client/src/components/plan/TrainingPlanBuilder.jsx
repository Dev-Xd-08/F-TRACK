import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Target, Check, ArrowRight, X } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import { createTrainingPlan, updateTrainingPlan } from '../../services/trainingPlanService';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const TARGET_OPTIONS = [2, 3, 4, 5, 6];
const DURATION_OPTIONS = [15, 20, 25, 30, 45, 60];

const FOCUS_PRESETS = [
  'Discipline & Consistency',
  'Health & Longevity',
  'Strength Progression',
  'Cardio & Endurance',
  'Stress Relief & Balance',
];

/**
 * TrainingPlanBuilder Component (Stage 20)
 * Modal enabling user to configure their adaptive training plan.
 */
export const TrainingPlanBuilder = ({
  isOpen = false,
  onClose,
  existingPlan = null,
  currentPlan = null,
  onPlanSaved,
}) => {
  const activePlan = currentPlan || existingPlan;
  const [weeklyTarget, setWeeklyTarget] = useState(activePlan?.weeklyTargetSessions || 3);
  const [preferredDuration, setPreferredDuration] = useState(activePlan?.preferredSessionDuration || 25);
  const [preferredDays, setPreferredDays] = useState(activePlan?.preferredDays || ['MON', 'WED', 'FRI']);
  const [selectedFocus, setSelectedFocus] = useState(activePlan?.focusAreas?.[0] || 'Discipline & Consistency');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (activePlan) {
      if (activePlan.weeklyTargetSessions) setWeeklyTarget(activePlan.weeklyTargetSessions);
      if (activePlan.preferredSessionDuration) setPreferredDuration(activePlan.preferredSessionDuration);
      if (activePlan.preferredDays) setPreferredDays(activePlan.preferredDays);
      if (activePlan.focusAreas?.[0]) setSelectedFocus(activePlan.focusAreas[0]);
    }
  }, [activePlan, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day) => {
    if (preferredDays.includes(day)) {
      if (preferredDays.length > 1) {
        setPreferredDays(preferredDays.filter((d) => d !== day));
      }
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const planData = {
        name: 'Adaptive Weekly Training Plan',
        weeklyTargetSessions: weeklyTarget,
        preferredSessionDuration: preferredDuration,
        preferredDays,
        focusAreas: [selectedFocus],
      };

      let result;
      if (activePlan && activePlan._id) {
        result = await updateTrainingPlan(activePlan._id, planData);
      } else {
        result = await createTrainingPlan(planData);
      }

      if (onPlanSaved) onPlanSaved(result.plan);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to preserve training plan.');
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
            aria-label="Close Plan Builder"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>PLAN ARCHITECTURE</span>
            </div>
            <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-bone uppercase tracking-tight">
              CALIBRATE TRAINING PLAN
            </h2>
            <p className="text-xs font-sans text-ash-400">
              The plan serves you, not the other way around. Select targets that fit your authentic rhythm.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-sm bg-crimson-950/50 border border-crimson-800 text-xs font-mono text-crimson-300">
              {error}
            </div>
          )}

          {/* Weekly Target Sessions */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
              TARGET SESSIONS PER WEEK:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {TARGET_OPTIONS.map((num) => {
                const isSelected = weeklyTarget === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setWeeklyTarget(num)}
                    className={`py-2 px-1 text-center rounded-sm font-orbitron font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-crimson-950/60 border-crimson-600 text-bone shadow-sm'
                        : 'bg-charcoal-950 border-steel-800 text-ash-400 hover:text-bone hover:border-steel-700'
                    }`}
                  >
                    {num}/wk
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Session Duration */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
              TYPICAL SESSION DURATION:
            </span>
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {DURATION_OPTIONS.map((dur) => {
                const isSelected = preferredDuration === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setPreferredDuration(dur)}
                    className={`py-2 px-1 text-center rounded-sm font-orbitron font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-crimson-950/60 border-crimson-600 text-bone shadow-sm'
                        : 'bg-charcoal-950 border-steel-800 text-ash-400 hover:text-bone hover:border-steel-700'
                    }`}
                  >
                    {dur}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Days */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
              PREFERRED TRAINING DAYS:
            </span>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {DAYS.map((day) => {
                const isSelected = preferredDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 px-1 text-center rounded-sm font-orbitron font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-crimson-950/60 border-crimson-600 text-bone'
                        : 'bg-charcoal-950 border-steel-800 text-ash-500 hover:border-steel-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus Area Selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
              PRIMARY FOCUS AREA:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FOCUS_PRESETS.map((focus) => {
                const isSelected = selectedFocus === focus;
                return (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => setSelectedFocus(focus)}
                    className={`p-2.5 rounded-sm text-left border text-xs font-mono transition-all ${
                      isSelected
                        ? 'border-crimson-600 bg-crimson-950/40 text-bone'
                        : 'border-steel-800 bg-charcoal-950 text-ash-400 hover:border-steel-700'
                    }`}
                  >
                    {focus}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-steel-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-sm text-xs font-mono text-ash-400 hover:text-bone hover:bg-steel-800 transition-colors uppercase"
            >
              CANCEL
            </button>
            <AnimeButton
              variant="crimson"
              size="md"
              icon={ArrowRight}
              disabled={submitting}
              className="w-full sm:w-auto"
              onClick={handleSave}
            >
              {submitting ? 'CALIBRATING...' : 'SAVE TRAINING PLAN'}
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrainingPlanBuilder;
