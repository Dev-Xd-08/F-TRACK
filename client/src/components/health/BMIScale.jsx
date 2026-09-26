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
    { label: 'UNDERWEIGHT', range: '< 18.5', color: 'bg-cyan-500/80', text: 'text-cyan-neon', border: 'border-cyan-500/40' },
    { label: 'NORMAL', range: '18.5 - 24.9', color: 'bg-matrix-neon/80', text: 'text-matrix-neon', border: 'border-matrix-neon/40' },
    { label: 'OVERWEIGHT', range: '25.0 - 29.9', color: 'bg-gold-mythic/80', text: 'text-gold-mythic', border: 'border-gold-mythic/40' },
    { label: 'OBESITY', range: '≥ 30.0', color: 'bg-crimson-aura/80', text: 'text-crimson-aura', border: 'border-crimson-aura/40' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Visual Scale Bar with Marker */}
      <div className="relative pt-6 pb-2">
        {/* Dynamic Animated Pointer / HUD Marker */}
        {hasValue && (
          <motion.div
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: `${percentage}%`, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
          >
            <div className="px-2 py-0.5 rounded bg-void border border-cyan-neon text-cyan-neon font-orbitron font-black text-[10px] shadow-glow-cyan">
              {bmi}
            </div>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-cyan-neon -mt-0.5" />
          </motion.div>
        )}

        {/* Multi-colored Gradient Zone Track */}
        <div className="relative h-4 w-full bg-void-pure rounded-full overflow-hidden border border-slate-800 p-0.5 grid grid-cols-4 gap-0.5 shadow-inner">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-l-full" title="Underweight (<18.5)" />
          <div className="h-full bg-gradient-to-r from-emerald-500 to-matrix-neon" title="Normal (18.5 - 24.9)" />
          <div className="h-full bg-gradient-to-r from-amber-500 to-gold-mythic" title="Overweight (25 - 29.9)" />
          <div className="h-full bg-gradient-to-r from-rose-600 to-crimson-aura rounded-r-full" title="Obesity (≥30.0)" />
        </div>
      </div>

      {/* Category Labels & Ranges Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {categories.map((cat) => {
          const isActive = category && category.toLowerCase() === cat.label.toLowerCase();
          return (
            <div
              key={cat.label}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                isActive
                  ? `${cat.border} bg-obsidian shadow-lg scale-105`
                  : 'border-slate-800/80 bg-void/50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                <span className={`text-[10px] font-orbitron font-bold tracking-wider ${isActive ? cat.text : 'text-slate-300'}`}>
                  {cat.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 block">
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
