import React from 'react';

/**
 * AnimeButton — Neon Glow Cyberpunk / RPG Action Button
 * @param {string} variant - 'violet' | 'cyan' | 'crimson' | 'gold' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export const AnimeButton = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm font-semibold tracking-wider',
    lg: 'px-7 py-3.5 text-base font-bold tracking-widest',
  };

  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-neon border-cyan-neon/50 hover:bg-cyan-neon hover:text-void shadow-glow-cyan hover:border-cyan-neon',
    violet: 'bg-violet-600/15 text-violet-glow border-violet-neon/50 hover:bg-violet-neon hover:text-white shadow-glow-violet hover:border-violet-neon',
    crimson: 'bg-crimson-aura/10 text-crimson-aura border-crimson-aura/50 hover:bg-crimson-aura hover:text-white shadow-glow-crimson hover:border-crimson-aura',
    gold: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/50 hover:bg-gold-mythic hover:text-void shadow-glow-gold hover:border-gold-mythic',
    outline: 'bg-transparent text-slate-300 border-slate-700 hover:border-cyan-neon hover:text-cyan-neon',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-orbitron uppercase transition-all duration-300
        border rounded-sm backdrop-blur-md active:scale-95
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.cyan}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 transition-transform group-hover:rotate-12" />}
      <span>{children}</span>
    </button>
  );
};

export default AnimeButton;
