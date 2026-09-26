import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Sparkles, ChevronRight, Award } from 'lucide-react';
import EnergyBar from './ui/EnergyBar';

export const RankSystem = () => {
  const [selectedRank, setSelectedRank] = useState(0);

  const ranks = [
    {
      tier: 'E-RANK',
      title: 'TRAINEE HUNTER',
      levelRange: 'LEVEL 1 - 4',
      xpRequirement: '0 - 500 XP',
      color: 'slate',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-600',
      glow: 'shadow-none',
      perk: 'Unlocks base workout logging, BMI computation, and initial quest log.',
      multiplier: '1.0x XP',
    },
    {
      tier: 'D-RANK',
      title: 'STRIKER',
      levelRange: 'LEVEL 5 - 9',
      xpRequirement: '500 - 1,500 XP',
      color: 'cyan',
      badgeClass: 'bg-cyan-neon/15 text-cyan-neon border-cyan-neon/40',
      glow: 'shadow-glow-cyan',
      perk: 'Unlocks daily workout streaks, calorie burn estimator, and badge showcase.',
      multiplier: '1.2x XP',
    },
    {
      tier: 'C-RANK',
      title: 'VANGUARD',
      levelRange: 'LEVEL 10 - 19',
      xpRequirement: '1,500 - 4,000 XP',
      color: 'matrix',
      badgeClass: 'bg-matrix-neon/15 text-matrix-neon border-matrix-neon/40',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      perk: 'Unlocks custom fitness goal thresholds and weekly trend analytics.',
      multiplier: '1.5x XP',
    },
    {
      tier: 'B-RANK',
      title: 'ELITE WARRIOR',
      levelRange: 'LEVEL 20 - 34',
      xpRequirement: '4,000 - 10,000 XP',
      color: 'violet',
      badgeClass: 'bg-violet-neon/15 text-violet-glow border-violet-neon/40',
      glow: 'shadow-glow-violet',
      perk: 'Unlocks advanced calorie deficit tracking and personal record alerts.',
      multiplier: '1.8x XP',
    },
    {
      tier: 'A-RANK',
      title: 'CHAMPION',
      levelRange: 'LEVEL 35 - 49',
      xpRequirement: '10,000 - 25,000 XP',
      color: 'crimson',
      badgeClass: 'bg-crimson-aura/15 text-crimson-aura border-crimson-aura/40',
      glow: 'shadow-glow-crimson',
      perk: 'Unlocks high-intensity quest challenges and animated hall-of-fame flair.',
      multiplier: '2.2x XP',
    },
    {
      tier: 'S-RANK',
      title: 'ASCENSION MONARCH',
      levelRange: 'LEVEL 50+',
      xpRequirement: '25,000+ XP',
      color: 'gold',
      badgeClass: 'bg-gold-mythic/20 text-gold-mythic border-gold-mythic/50',
      glow: 'shadow-glow-gold',
      perk: 'Supreme master of physical discipline. Unlocks Mythic avatar glow and eternal status.',
      multiplier: '3.0x XP',
    },
  ];

  return (
    <section id="rankings" className="py-24 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-gold-mythic/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-mythic/40 bg-gold-mythic/10 text-gold-mythic text-xs font-orbitron font-bold tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5" />
            <span>HUNTER ASCENSION LADDER</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-slate-100 uppercase">
            RANK{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-mythic via-violet-glow to-cyan-neon">
              PROGRESSION
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From unranked beginner to supreme athlete. Every calorie burned and workout logged advances your rank tier.
          </p>
        </div>

        {/* Tier Selector Ribbon (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 justify-start lg:justify-center no-scrollbar">
          {ranks.map((r, idx) => (
            <button
              key={r.tier}
              onClick={() => setSelectedRank(idx)}
              className={`
                px-4 py-2.5 rounded-lg font-orbitron text-xs font-bold tracking-wider
                transition-all duration-300 border flex items-center gap-2 whitespace-nowrap
                ${selectedRank === idx 
                  ? `${r.badgeClass} ${r.glow} scale-105` 
                  : 'bg-obsidian/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }
              `}
            >
              <span>{r.tier}</span>
              {selectedRank === idx && <Sparkles className="w-3.5 h-3.5 animate-spin" />}
            </button>
          ))}
        </div>

        {/* Detailed Selected Rank Highlight Card */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Card (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-obsidian/90 border border-slate-800 p-8 relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-neon/15 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-black font-orbitron ${ranks[selectedRank].badgeClass.split(' ')[1]}`}>
                      {ranks[selectedRank].tier}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ranks[selectedRank].levelRange}
                    </span>
                  </div>
                  <h3 className="font-orbitron font-bold text-xl text-slate-100 mt-1">
                    {ranks[selectedRank].title}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-orbitron block text-slate-400">EXP THRESHOLD</span>
                  <span className="text-lg font-mono font-bold text-cyan-neon">
                    {ranks[selectedRank].xpRequirement}
                  </span>
                </div>
              </div>

              {/* Rank Perks & Multiplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-void/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-orbitron font-bold text-gold-mythic uppercase tracking-wider">
                    REWARD MULTIPLIER
                  </span>
                  <p className="text-xl font-orbitron font-black text-slate-100">
                    {ranks[selectedRank].multiplier}
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    Earn amplified XP for every logged workout session.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-void/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-orbitron font-bold text-violet-glow uppercase tracking-wider">
                    SYSTEM PRIVILEGES
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {ranks[selectedRank].perk}
                  </p>
                </div>
              </div>

              {/* Simulated XP Progress Gauge */}
              <div className="pt-2">
                <EnergyBar
                  label={`RANK ASCENSION PROGRESS (${ranks[selectedRank].tier})`}
                  current={selectedRank === 5 ? 25000 : (selectedRank + 1) * 3500}
                  max={selectedRank === 5 ? 25000 : (selectedRank + 1) * 5000}
                  color={selectedRank === 5 ? 'gold' : selectedRank >= 4 ? 'crimson' : selectedRank >= 2 ? 'violet' : 'cyan'}
                  unit="XP"
                />
              </div>
            </div>
          </div>

          {/* Side Ladder Overview (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-obsidian/60 border border-slate-800/80 p-6 space-y-3">
            <h4 className="font-orbitron font-bold text-xs text-slate-300 tracking-wider uppercase mb-2">
              Ascension Hierarchy
            </h4>
            {ranks.map((r, i) => (
              <div
                key={r.tier}
                onClick={() => setSelectedRank(i)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between
                  ${selectedRank === i 
                    ? 'border-cyan-neon/50 bg-cyan-neon/10' 
                    : 'border-slate-800/60 bg-void/50 hover:border-slate-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="font-orbitron font-black text-sm text-slate-200">{r.tier}</span>
                  <span className="text-xs text-slate-400 font-sans">{r.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedRank === i ? 'text-cyan-neon' : 'text-slate-600'}`} />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default RankSystem;
