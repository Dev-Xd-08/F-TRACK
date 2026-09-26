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
      badge: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
      iconBox: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/40 shadow-glow-cyan',
      glowBorder: 'border-cyan-neon/20 hover:border-cyan-neon/70 hover:shadow-glow-cyan',
      accentText: 'text-cyan-neon',
      topLine: 'from-cyan-neon to-transparent',
    },
    violet: {
      badge: 'bg-violet-neon/10 text-violet-glow border-violet-neon/30',
      iconBox: 'bg-violet-neon/10 text-violet-glow border-violet-neon/40 shadow-glow-violet',
      glowBorder: 'border-violet-neon/20 hover:border-violet-neon/70 hover:shadow-glow-violet',
      accentText: 'text-violet-glow',
      topLine: 'from-violet-neon to-transparent',
    },
    crimson: {
      badge: 'bg-crimson-aura/10 text-crimson-aura border-crimson-aura/30',
      iconBox: 'bg-crimson-aura/10 text-crimson-aura border-crimson-aura/40 shadow-glow-crimson',
      glowBorder: 'border-crimson-aura/20 hover:border-crimson-aura/70 hover:shadow-glow-crimson',
      accentText: 'text-crimson-aura',
      topLine: 'from-crimson-aura to-transparent',
    },
    gold: {
      badge: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30',
      iconBox: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/40 shadow-glow-gold',
      glowBorder: 'border-gold-mythic/20 hover:border-gold-mythic/70 hover:shadow-glow-gold',
      accentText: 'text-gold-mythic',
      topLine: 'from-gold-mythic to-transparent',
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
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`
        relative rounded-xl p-6 sm:p-7 bg-obsidian/75 backdrop-blur-md
        border transition-all duration-300 flex flex-col justify-between
        ${scheme.glowBorder} group overflow-hidden
      `}
    >
      {/* Top Cyber Accent Beam */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${scheme.topLine} opacity-80`} />

      {/* Sci-Fi Corner Cuts */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-600 group-hover:border-cyan-neon transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-600 group-hover:border-violet-neon transition-colors" />

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded text-xs font-orbitron font-extrabold tracking-wider border ${scheme.badge}`}>
            {number}
          </span>
          <div className={`p-2.5 rounded-lg border ${scheme.iconBox} transition-transform duration-300 group-hover:scale-110`}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
        </div>

        <div>
          <h3 className="font-orbitron font-bold text-lg text-slate-100 group-hover:text-white tracking-wide">
            {title}
          </h3>
          <p className="mt-2 text-slate-400 text-sm leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>

      {/* Module Highlight Tags */}
      {perks.length > 0 && (
        <div className="pt-6 mt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
          {perks.map((perk, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-void-pure text-slate-300 border border-slate-800"
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
