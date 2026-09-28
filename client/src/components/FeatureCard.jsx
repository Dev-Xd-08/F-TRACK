import React from 'react';
import { motion } from 'framer-motion';

/**
 * FeatureCard — Glassmorphic Cyberpunk Card for System Modules
 */
export const FeatureCard = ({
  number,
  title,
  description,
  icon: Icon,
  accentColor = 'cyan', // 'cyan' | 'violet' | 'crimson' | 'gold'
  perks = [],
}) => {
  const colorMap = {
    cyan: {
      badge: 'bg-steel-800 text-bone-200 border-steel-700',
      iconBox: 'bg-steel-800 text-bone-100 border-steel-700',
      glowBorder: 'border-steel-700 hover:border-steel-500',
      accentText: 'text-bone-100',
      topLine: 'bg-crimson-800',
    },
    violet: {
      badge: 'bg-steel-800 text-bone-200 border-steel-700',
      iconBox: 'bg-steel-800 text-bone-100 border-steel-700',
      glowBorder: 'border-steel-700 hover:border-steel-500',
      accentText: 'text-bone-100',
      topLine: 'bg-steel-700',
    },
    crimson: {
      badge: 'bg-crimson-950/60 text-crimson-400 border-crimson-800/60',
      iconBox: 'bg-crimson-950/60 text-crimson-400 border-crimson-800/60',
      glowBorder: 'border-steel-700 hover:border-crimson-800/80',
      accentText: 'text-crimson-400',
      topLine: 'bg-crimson-800',
    },
    gold: {
      badge: 'bg-steel-800 text-amber-300 border-steel-700',
      iconBox: 'bg-steel-800 text-amber-300 border-steel-700',
      glowBorder: 'border-steel-700 hover:border-steel-500',
      accentText: 'text-amber-300',
      topLine: 'bg-steel-700',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.cyan;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative rounded p-6 sm:p-7 bg-charcoal-900/95
        border transition-all duration-300 flex flex-col justify-between
        ${scheme.glowBorder} group overflow-hidden shadow-steel-card
      `}
    >
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${scheme.topLine}`} />

      {/* Industrial Corner Cuts */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-steel-700 group-hover:border-crimson-800 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-steel-700 group-hover:border-steel-500 transition-colors" />

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded text-xs font-orbitron font-extrabold tracking-wider border ${scheme.badge}`}>
            {number}
          </span>
          <div className={`p-2.5 rounded border ${scheme.iconBox} transition-transform duration-300 group-hover:scale-105`}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
        </div>

        <div>
          <h3 className="font-orbitron font-bold text-lg text-bone-100 tracking-wide">
            {title}
          </h3>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>

      {/* Module Highlight Tags */}
      {perks.length > 0 && (
        <div className="pt-6 mt-4 border-t border-steel-800 flex flex-wrap gap-2">
          {perks.map((perk, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-void text-ash-400 border border-steel-800"
            >
              • {perk}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FeatureCard;
