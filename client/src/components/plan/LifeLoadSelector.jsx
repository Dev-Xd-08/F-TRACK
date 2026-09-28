import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, Activity, Flame, Shield, HelpCircle } from 'lucide-react';
import { setLifeLoad } from '../../services/trainingPlanService';

const LOAD_OPTIONS = [
  {
    id: 'LIGHT',
    label: 'LIGHT',
    desc: 'Ample time, low friction',
    color: 'border-emerald-700/60 text-emerald-400 bg-emerald-950/20',
    activeColor: 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-500',
  },
  {
    id: 'NORMAL',
    label: 'NORMAL',
    desc: 'Balanced routine, standard pacing',
    color: 'border-steel-700 text-ash-300 bg-charcoal-900',
    activeColor: 'border-steel-400 bg-charcoal-800 text-bone ring-1 ring-steel-500',
  },
  {
    id: 'BUSY',
    label: 'BUSY',
    desc: 'Tight schedule; shorter sessions',
    color: 'border-amber-700/60 text-amber-400 bg-amber-950/20',
    activeColor: 'border-amber-500 bg-amber-950/50 text-amber-300 ring-1 ring-amber-500',
  },
  {
    id: 'VERY_BUSY',
    label: 'VERY BUSY',
    desc: 'High demand; protect baseline',
    color: 'border-crimson-700/60 text-crimson-400 bg-crimson-950/20',
    activeColor: 'border-crimson-500 bg-crimson-950/50 text-crimson-300 ring-1 ring-crimson-500',
  },
];

/**
 * LifeLoadSelector Component (Stage 20)
 * Low-friction week pressure selector.
 * Informs F-TRACK how demanding life is outside of fitness so targets adapt sustainably.
 */
export const LifeLoadSelector = ({
  currentLoad = 'NORMAL',
  onLoadChanged,
}) => {
  const [selected, setSelected] = useState(currentLoad);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (currentLoad) {
      setSelected(currentLoad);
    }
  }, [currentLoad]);

  const handleSelect = async (loadId) => {
    setSelected(loadId);
    try {
      setSaving(true);
      await setLifeLoad(loadId);
      if (onLoadChanged) {
        onLoadChanged(loadId);
      }
    } catch (err) {
      console.warn('Failed to update life load', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-steel-400" />
          WEEKLY LIFE PRESSURE
        </span>
        <span className="text-[10px] font-mono text-ash-500">
          PLANNING CONTEXT
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LOAD_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              disabled={saving}
              className={`p-2.5 rounded-sm text-left border transition-all ${
                isSelected ? opt.activeColor : `${opt.color} hover:border-steel-600`
              }`}
            >
              <span className="font-orbitron font-bold text-xs uppercase block">
                {opt.label}
              </span>
              <span className="text-[10px] font-sans text-ash-400 leading-tight block mt-0.5">
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LifeLoadSelector;
