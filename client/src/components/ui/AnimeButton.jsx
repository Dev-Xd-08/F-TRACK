import React from 'react';

/**
 * AnimeButton — Dark Warrior Tactical Action Button
 * Structured rectangular button with dark steel surfaces, crimson accents, and restrained hover.
 * @param {string} variant - 'crimson' | 'cyan' | 'violet' | 'gold' | 'outline'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export const AnimeButton = ({
  children,
  variant = 'crimson',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider',
    lg: 'px-6 py-3 text-sm sm:text-base font-bold tracking-widest',
  };

  const variantStyles = {
    crimson: 'bg-charcoal text-offwhite border-crimson/80 hover:bg-crimson hover:border-crimson-muted hover:text-offwhite shadow-sm',
    cyan: 'bg-charcoal text-bone border-steel hover:border-cyan/60 hover:text-offwhite shadow-sm',
    violet: 'bg-charcoal text-bone border-steel hover:border-violet/60 hover:text-offwhite shadow-sm',
    gold: 'bg-charcoal text-bone border-steel hover:border-gold/60 hover:text-offwhite shadow-sm',
    outline: 'bg-transparent text-ash border-steel hover:border-crimson/60 hover:text-offwhite',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-orbitron uppercase transition-all duration-200
        border rounded-lg active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.crimson}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export default AnimeButton;
