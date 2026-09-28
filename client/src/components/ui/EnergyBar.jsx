import React from 'react';

/**
 * EnergyBar — Dark Warrior Instrumentation Status Meter
 * Restrained status meter styled like physical tactical instrumentation.
 * @param {string} label - e.g. "XP PROGRESS", "STAMINA"
 * @param {number} current - e.g. 750
 * @param {number} max - e.g. 1000
 * @param {string} color - 'crimson' | 'violet' | 'cyan' | 'gold' | 'matrix'
 * @param {string} unit - 'XP' | '%' | 'HP' | 'KCAL'
 */
export const EnergyBar = ({
  label = 'XP PROGRESS',
  current = 75,
  max = 100,
  color = 'crimson',
  unit = 'XP',
  showValues = true,
  className = '',
}) => {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeCurrent = Math.max(0, Number(current) || 0);
  const percent = Math.min(100, Math.max(0, Math.round((safeCurrent / safeMax) * 100)));

  // Disciplined dark steel and crimson instrumentation gradients
  const barFills = {
    crimson: 'bg-gradient-to-r from-crimson-dark via-crimson to-crimson-muted',
    steel: 'bg-gradient-to-r from-steel-muted via-steel to-ash-dark',
    violet: 'bg-gradient-to-r from-violet-dark via-violet to-violet-glow',
    cyan: 'bg-gradient-to-r from-cyan-dark via-cyan to-cyan-glow',
    gold: 'bg-gradient-to-r from-gold-dark via-gold to-gold-glow',
    matrix: 'bg-gradient-to-r from-matrix via-matrix-neon to-matrix-glow',
  };

  const labelColors = {
    crimson: 'text-offwhite',
    steel: 'text-bone',
    violet: 'text-bone',
    cyan: 'text-bone',
    gold: 'text-bone',
    matrix: 'text-bone',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs font-orbitron">
        <span className={`tracking-wider font-bold text-xs uppercase ${labelColors[color] || 'text-bone'}`}>
          {label}
        </span>
        {showValues && (
          <span className="text-ash font-mono text-[11px]">
            <span className="text-offwhite font-bold">{safeCurrent.toLocaleString()}</span>
            {' '}/ {safeMax.toLocaleString()} {unit} <span className="text-ash-dark">({percent}%)</span>
          </span>
        )}
      </div>

      {/* Meter Track: Dark recessed channel */}
      <div
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label}
        className="relative h-2.5 w-full bg-void rounded-sm overflow-hidden border border-gunmetal p-[1px]"
      >
        <div
          className={`h-full rounded-[1px] transition-all duration-500 ease-out ${
            barFills[color] || barFills.crimson
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default EnergyBar;
