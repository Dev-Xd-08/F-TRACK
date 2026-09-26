import React from 'react';

/**
 * EnergyBar — Anime HP / Stamina / XP Progress Bar
 * @param {string} label - e.g. "HP", "STAMINA", "XP PROGRESS"
 * @param {number} current - e.g. 750
 * @param {number} max - e.g. 1000
 * @param {string} color - 'cyan' | 'crimson' | 'violet' | 'gold'
 */
export const EnergyBar = ({
  label = 'XP PROGRESS',
  current = 75,
  max = 100,
  color = 'violet',
  unit = 'XP',
  showValues = true,
}) => {
  const percent = Math.min(100, Math.max(0, Math.round((current / max) * 100)));

  const barGradients = {
    violet: 'from-violet-600 to-violet-glow shadow-[0_0_12px_#8B5CF6]',
    cyan: 'from-cyan-600 to-cyan-neon shadow-[0_0_12px_#00F5FF]',
    crimson: 'from-crimson-dark to-crimson-aura shadow-[0_0_12px_#FF2A5F]',
    gold: 'from-amber-600 to-gold-mythic shadow-[0_0_12px_#FFB800]',
  };

  const labelColors = {
    violet: 'text-violet-glow',
    cyan: 'text-cyan-neon',
    crimson: 'text-crimson-aura',
    gold: 'text-gold-mythic',
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs font-orbitron">
        <span className={`tracking-wider font-bold ${labelColors[color] || labelColors.violet}`}>
          {label}
        </span>
        {showValues && (
          <span className="text-slate-400 font-mono">
            <span className="text-slate-200 font-bold">{current}</span> / {max} {unit} ({percent}%)
          </span>
        )}
      </div>

      {/* Energy Bar Track */}
      <div className="relative h-3 w-full bg-void-pure rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
            barGradients[color] || barGradients.violet
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default EnergyBar;
