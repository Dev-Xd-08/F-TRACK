import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { setAvailability } from '../../services/trainingPlanService';

const TIME_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

/**
 * AvailabilitySelector Component (Stage 20)
 * Allows user to specify today's realistic available time.
 * Immediately calibrates Today's Focus and Adaptive Recommendations.
 */
export const AvailabilitySelector = ({
  currentMinutes = 25,
  onAvailabilityChanged,
}) => {
  const [selected, setSelected] = useState(currentMinutes);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (currentMinutes) {
      setSelected(currentMinutes);
    }
  }, [currentMinutes]);

  const handleSelect = async (minutes) => {
    setSelected(minutes);
    try {
      setSaving(true);
      await setAvailability(minutes);
      if (onAvailabilityChanged) {
        onAvailabilityChanged(minutes);
      }
    } catch (err) {
      console.warn('Failed to update availability', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-steel-400" />
          TODAY'S REALISTIC AVAILABILITY
        </span>
        <span className="text-[10px] font-mono text-ash-500">
          SELECT YOUR TIME
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {TIME_OPTIONS.map((time) => {
          const isSelected = selected === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => handleSelect(time)}
              disabled={saving}
              className={`py-2 px-1 text-center rounded-sm font-orbitron font-bold text-xs transition-all border ${
                isSelected
                  ? 'bg-crimson-950/60 border-crimson-600 text-bone shadow-sm'
                  : 'bg-charcoal-950 border-steel-800 text-ash-400 hover:text-bone hover:border-steel-700'
              }`}
            >
              {time}m
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilitySelector;
