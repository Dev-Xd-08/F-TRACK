import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Shield, CheckCircle2 } from 'lucide-react';
import AnimeButton from './ui/AnimeButton';

export const CTASection = () => {
  return (
    <section id="cta" className="py-28 relative overflow-hidden">
      {/* Background Vortex / Energy Ring */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-gradient-to-tr from-violet-neon/20 via-cyan-neon/15 to-crimson-aura/10 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-10 sm:p-16 bg-obsidian/90 border border-violet-neon/40 shadow-[0_0_50px_rgba(139,92,246,0.25)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Cyber Accent Lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-neon via-violet-neon to-crimson-aura" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-aura via-gold-mythic to-cyan-neon" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon text-xs font-orbitron font-bold tracking-widest mb-6">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>FINAL PROTOCOL • LEVEL UP NOW</span>
          </div>

          {/* Heading */}
          <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100 uppercase leading-tight">
            READY TO BEGIN{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-violet">
              YOUR ASCENSION?
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="mt-6 text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Your journey starts with the first workout. Complete daily quests, track calories and BMI, 
            earn XP, and ascend from E-Rank to the apex of strength.
          </p>

          {/* Button */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <AnimeButton
              variant="cyan"
              size="lg"
              icon={Zap}
              className="px-10 py-4 text-base"
              onClick={() => {
                alert('⚡ Stage 2 is complete! Authentication & Login will be connected in Stage 3.');
              }}
            >
              ⚡ START YOUR JOURNEY
            </AnimeButton>
          </div>

          {/* System Ticker Perks */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-orbitron text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-matrix-neon" />
              <span>FREE HUNTER REGISTRATION</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-matrix-neon" />
              <span>ZERO ADS • PURE PERFORMANCE</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-matrix-neon" />
              <span>MODERN MERN ARCHITECTURE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
