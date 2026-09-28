import React from 'react';

/**
 * GlassCard (Dark Steel Panel) — Dark Warrior Tactical Panel
 * Replaces glowing holograms with structured, industrial worn steel panels.
 */
export const GlassCard = ({
  children,
  className = '',
  glow = 'crimson', // 'crimson' | 'steel' | 'violet' | 'cyan' | 'gold' | 'matrix' | 'none'
  hoverEffect = true,
  ...props
}) => {
  // Restrained dark steel borders with subtle accent shift on hover
  const glowBorder = {
    crimson: 'border-steel-muted hover:border-crimson/50 hover:shadow-crimson-edge',
    steel: 'border-steel-muted hover:border-steel hover:shadow-steel-hover',
    violet: 'border-steel-muted hover:border-violet/40 hover:shadow-steel-hover',
    cyan: 'border-steel-muted hover:border-cyan/40 hover:shadow-steel-hover',
    gold: 'border-steel-muted hover:border-gold/40 hover:shadow-steel-hover',
    matrix: 'border-steel-muted hover:border-matrix/40 hover:shadow-steel-hover',
    none: 'border-steel-muted',
  };

  return (
    <div
      className={`
        relative rounded-xl p-6 bg-obsidian border shadow-steel-card
        transition-all duration-200
        ${hoverEffect ? 'hover:-translate-y-0.5' : ''}
        ${glowBorder[glow] || glowBorder.crimson}
        ${className}
      `}
      {...props}
    >
      {/* Industrial Steel Corner Notch Accent Marks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-steel/60" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-steel/60" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-steel/60" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-crimson/40" />

      {children}
    </div>
  );
};

export default GlassCard;
