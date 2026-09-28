import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Shield, Sparkles, Dumbbell, Flame, CheckCircle, ArrowRight, X } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';

const TIME_OPTIONS = [5, 10, 15, 20, 30, 45];

const WORKOUT_TEMPLATES = {
  5: {
    title: '5-MIN MICRO MOBILITY & RESET',
    philosophy: 'Better than zero. Keeps the daily connection to your body intact.',
    phases: [
      { name: 'Warm-up', time: '1 min', details: 'Neck circles, shoulder rolls, deep diaphragm breaths.' },
      { name: 'Movement', time: '3 min', details: 'Cat-cow spine waves, bodyweight squats, arm reaches.' },
      { name: 'Cool-down', time: '1 min', details: 'Child’s pose, steady nasal exhale breathing.' },
    ],
    defaultActivity: 'Flexibility / Stretching',
    estimatedCalories: 25,
  },
  10: {
    title: '10-MIN HABIT PROTECTOR',
    philosophy: 'Protects momentum on demanding days without draining energy reserves.',
    phases: [
      { name: 'Warm-up', time: '2 min', details: 'Dynamic joint rotations and wrist/ankle mobility.' },
      { name: 'Core Circuit', time: '6 min', details: '2 rounds: 30s plank, 30s air squats, 30s mountain climbers, 30s rest.' },
      { name: 'Cool-down', time: '2 min', details: 'Forward fold, standing chest opener, nasal pacing.' },
    ],
    defaultActivity: 'Bodyweight Calisthenics',
    estimatedCalories: 60,
  },
  15: {
    title: '15-MIN METABOLIC IGNITION',
    philosophy: 'Fast, focused exertion that triggers metabolic activation and mental clarity.',
    phases: [
      { name: 'Warm-up', time: '3 min', details: 'Jumping jacks or high knees at low intensity, thoracic rotations.' },
      { name: 'Main Work', time: '9 min', details: '3 rounds: 45s push-ups or wall push-ups, 45s lunges, 30s glute bridge.' },
      { name: 'Cool-down', time: '3 min', details: 'Quad stretch, hamstring stretch, heart-rate normalization.' },
    ],
    defaultActivity: 'HIIT / Circuit',
    estimatedCalories: 110,
  },
  20: {
    title: '20-MIN GOLDEN RE-ENTRY',
    philosophy: 'The ideal benchmark session. Enough for meaningful adaptation without exhaustion.',
    phases: [
      { name: 'Warm-up', time: '3 min', details: 'Full kinetic warm-up: arm swings, hip openers, light jog in place.' },
      { name: 'Main Work', time: '14 min', details: 'Targeted strength or cardio: squats, push-ups, rows/pulls, core holds.' },
      { name: 'Cool-down', time: '3 min', details: 'Pigeon pose, spinal twist, slow recovery breathwork.' },
    ],
    defaultActivity: 'General Training',
    estimatedCalories: 160,
  },
  30: {
    title: '30-MIN FOUNDATIONAL CRAFT',
    philosophy: 'Full training stimulus across major movement patterns. Sustainable and balanced.',
    phases: [
      { name: 'Warm-up', time: '5 min', details: 'Dynamic mobility, activation glute bridges, shoulder dislocates.' },
      { name: 'Main Work', time: '20 min', details: '4 compound sets: Push, Pull, Squat, Hinge with 60s rest periods.' },
      { name: 'Cool-down', time: '5 min', details: 'Static stretching and parasympathetic down-regulation.' },
    ],
    defaultActivity: 'Strength Training',
    estimatedCalories: 240,
  },
  45: {
    title: '45-MIN COMPLETE ASCENSION',
    philosophy: 'Deep volume session for progressive overload and cardiovascular endurance.',
    phases: [
      { name: 'Warm-up', time: '7 min', details: 'Cardio ramp-up, comprehensive dynamic mobility drills.' },
      { name: 'Main Work', time: '32 min', details: 'Full structured workout: compound lifts or interval running.' },
      { name: 'Cool-down', time: '6 min', details: 'Full-body cool-down and mobility restoration.' },
    ],
    defaultActivity: 'Strength Training',
    estimatedCalories: 380,
  },
};

export const QuickWorkoutPlanner = ({ isOpen = false, onClose, onSelectPlan }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(20);
  const plan = WORKOUT_TEMPLATES[selectedMinutes] || WORKOUT_TEMPLATES[20];

  if (!isOpen) return null;

  const handleApply = () => {
    if (onSelectPlan) {
      onSelectPlan({
        duration: selectedMinutes,
        activityType: plan.defaultActivity,
        notes: `Quick Plan: ${plan.title} (${selectedMinutes} min)`,
        estimatedCalories: plan.estimatedCalories,
      });
    }
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-xl rounded-sm bg-charcoal-900 border border-steel-700 p-6 sm:p-7 shadow-steel-card space-y-6 my-8"
        >
          {/* Restrained Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-crimson-600" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-sm text-ash-400 hover:text-bone hover:bg-steel-800 transition-colors"
            aria-label="Close Quick Planner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-crimson-500 uppercase font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>TIME-CONSTRAINED ARCHITECTURE</span>
            </div>
            <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-bone uppercase tracking-tight">
              QUICK WORKOUT PLANNER
            </h2>
            <p className="text-xs font-sans text-ash-400">
              Select your available time. F-TRACK constructs a balanced movement framework so you never miss a day due to lack of time.
            </p>
          </div>

          {/* Time Selector Pills */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
              AVAILABLE TIME TODAY:
            </span>
            <div className="grid grid-cols-6 gap-2">
              {TIME_OPTIONS.map((time) => {
                const isSelected = selectedMinutes === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedMinutes(time)}
                    className={`py-2 px-1 text-center rounded-sm font-orbitron font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-crimson-900/40 border-crimson-500 text-bone shadow-sm'
                        : 'bg-charcoal-800 border-steel-700 text-ash-400 hover:text-bone hover:border-steel-600'
                    }`}
                  >
                    {time}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Blueprint Card */}
          <div className="p-4 sm:p-5 rounded-sm bg-charcoal-950 border border-steel-800 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-crimson-400 font-semibold uppercase tracking-wider block">
                  SESSION BLUEPRINT
                </span>
                <h3 className="font-orbitron font-bold text-base text-bone tracking-wide">
                  {plan.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono font-semibold bg-steel-800 text-bone border border-steel-700">
                ~{plan.estimatedCalories} KCAL
              </span>
            </div>

            <p className="text-xs font-sans text-ash-300 italic border-l-2 border-steel-700 pl-3 py-0.5">
              "{plan.philosophy}"
            </p>

            {/* Phases breakdown */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] font-mono text-ash-400 uppercase tracking-widest block">
                PHASE PACING:
              </span>
              <div className="space-y-2">
                {plan.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-sm bg-charcoal-900 border border-steel-800 gap-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 flex-shrink-0" />
                      <span className="font-mono font-bold text-bone">{phase.name}</span>
                      <span className="text-ash-400 font-sans text-[11px]">— {phase.details}</span>
                    </div>
                    <span className="font-mono text-[10px] text-ash-400 font-semibold self-end sm:self-auto bg-steel-800/80 px-2 py-0.5 rounded-sm">
                      {phase.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
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
              className="w-full sm:w-auto"
              onClick={handleApply}
            >
              APPLY TO WORKOUT LOGGER
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickWorkoutPlanner;
