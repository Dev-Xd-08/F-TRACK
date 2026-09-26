import React from 'react';

/**
 * GlassCard — Anime Cyberpunk HUD Card
 * Provides glassmorphism, corner cutouts / accents, and hover glows.
 */
export const GlassCard = ({
  children,
  className = '',
  glow = 'violet', // 'violet' | 'cyan' | 'crimson' | 'gold' | 'none'
  hoverEffect = true,
  ...props
}) => {
  const glowBorder = {
    violet: 'border-violet-neon/20 hover:border-violet-neon/60 hover:shadow-glow-violet',
    cyan: 'border-cyan-neon/20 hover:border-cyan-neon/60 hover:shadow-glow-cyan',
    crimson: 'border-crimson-aura/20 hover:border-crimson-aura/60 hover:shadow-glow-crimson',
    gold: 'border-gold-mythic/20 hover:border-gold-mythic/60 hover:shadow-glow-gold',
    none: 'border-slate-800',
  };

  return (
    <div
      className={`
        relative rounded-lg p-6 bg-obsidian/75 backdrop-blur-md
        border transition-all duration-300
        ${hoverEffect ? 'hover:-translate-y-1' : ''}
        ${glowBorder[glow] || glowBorder.violet}
        ${className}
      `}
      {...props}
    >
      {/* Anime Sci-Fi Corner Accent Marks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-neon/80" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-violet-neon/80" />
      
      {children}
    </div>
  );
};

export default GlassCard;
