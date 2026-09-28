import React from 'react';
import { motion } from 'framer-motion';

/**
 * BMIScale — Visual Anime HUD Gauge for BMI Categories
 * @param {number} bmi - Calculated BMI score (e.g. 22.9)
 * @param {string} category - Underweight | Normal | Overweight | Obesity
 */
export const BMIScale = ({ bmi = null, category = '' }) => {
  // Clamp BMI between 15 and 40 for scale percentage calculation
  const minScale = 15;
  const maxScale = 40;
  const hasValue = typeof bmi === 'number' && !isNaN(bmi) && bmi > 0;
  
  const percentage = hasValue
    ? Math.min(100, Math.max(0, ((bmi - minScale) / (maxScale - minScale)) * 100))
    : 0;

  const categories = [
    { label: 'UNDERWEIGHT', range: '< 18.5', color: 'bg-steel/60', text: 'text-bone', border: 'border-steel/60' },
    { label: 'NORMAL', range: '18.5 - 24.9', color: 'bg-emerald-800/80', text: 'text-emerald-400', border: 'border-emerald-800/80' },
    { label: 'OVERWEIGHT', range: '25.0 - 29.9', color: 'bg-brass/70', text: 'text-brass', border: 'border-brass/50' },
    { label: 'OBESITY', range: '≥ 30.0', color: 'bg-crimson', text: 'text-crimson-bright', border: 'border-crimson/60' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Visual Scale Bar with Marker */}
      <div className="relative pt-6 pb-2">
        {/* Dynamic Animated Pointer / Physical Instrumentation Marker */}
        {hasValue && (
          <motion.div
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: `${percentage}%`, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
          >
            <div className="px-2 py-0.5 rounded-sm bg-obsidian border border-crimson text-crimson-bright font-mono font-bold text-[10px] shadow-steel-card">
              {bmi}
            </div>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-crimson -mt-0.5" />
          </motion.div>
        )}

        {/* Physical Instrumentation Recessed Track */}
        <div className="relative h-3 w-full bg-void rounded-sm overflow-hidden border border-steel/60 p-0.5 grid grid-cols-4 gap-0.5 shadow-inner">
          <div className="h-full bg-steel/40" title="Underweight (<18.5)" />
          <div className="h-full bg-emerald-900/60" title="Normal (18.5 - 24.9)" />
          <div className="h-full bg-brass/40" title="Overweight (25 - 29.9)" />
          <div className="h-full bg-crimson/70" title="Obesity (≥30.0)" />
        </div>
      </div>

      {/* Category Labels & Ranges Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {categories.map((cat) => {
          const isActive = category && category.toLowerCase() === cat.label.toLowerCase();
          return (
            <div
              key={cat.label}
              className={`p-2 rounded-sm border transition-all duration-200 ${
                isActive
                  ? `${cat.border} bg-charcoal shadow-steel-card font-bold`
                  : 'border-steel/40 bg-void'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${cat.color}`} />
                <span className={`text-[10px] font-orbitron tracking-wider ${isActive ? cat.text : 'text-ash'}`}>
                  {cat.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-ash/80 block">
                {cat.range}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BMIScale;
