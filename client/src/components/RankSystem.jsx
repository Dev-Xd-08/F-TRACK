import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Sparkles, ChevronRight, Award } from 'lucide-react';
import EnergyBar from './ui/EnergyBar';

export const RankSystem = () => {
  const [selectedRank, setSelectedRank] = useState(0);

  const ranks = [
    {
      tier: 'E-RANK',
      title: 'TRAINEE OPERATOR',
      levelRange: 'LEVEL 1 - 4',
      xpRequirement: '0 - 500 XP',
      color: 'slate',
      badgeClass: 'bg-steel-800 text-bone-200 border-steel-700',
      perk: 'Unlocks base workout logging, BMI computation, and initial quest log.',
      multiplier: '1.0x XP',
    },
    {
      tier: 'D-RANK',
      title: 'STRIKER',
      levelRange: 'LEVEL 5 - 9',
      xpRequirement: '500 - 1,500 XP',
      color: 'slate',
      badgeClass: 'bg-steel-800 text-bone-200 border-steel-700',
      perk: 'Unlocks daily workout streaks, calorie burn estimator, and badge showcase.',
      multiplier: '1.2x XP',
    },
    {
      tier: 'C-RANK',
      title: 'VANGUARD',
      levelRange: 'LEVEL 10 - 19',
      xpRequirement: '1,500 - 4,000 XP',
      color: 'brass',
      badgeClass: 'bg-steel-800 text-amber-300 border-steel-700',
      perk: 'Unlocks custom fitness goal thresholds and weekly trend analytics.',
      multiplier: '1.5x XP',
    },
    {
      tier: 'B-RANK',
      title: 'ELITE WARRIOR',
      levelRange: 'LEVEL 20 - 34',
      xpRequirement: '4,000 - 10,000 XP',
      color: 'slate',
      badgeClass: 'bg-steel-800 text-bone-100 border-steel-700',
      perk: 'Unlocks advanced calorie deficit tracking and personal record alerts.',
      multiplier: '1.8x XP',
    },
    {
      tier: 'A-RANK',
      title: 'CHAMPION',
      levelRange: 'LEVEL 35 - 49',
      xpRequirement: '10,000 - 25,000 XP',
      color: 'crimson',
      badgeClass: 'bg-crimson-950/60 text-crimson-400 border-crimson-800/60',
      perk: 'Unlocks high-intensity quest challenges and tactical Hall-of-Fame insignia.',
      multiplier: '2.2x XP',
    },
    {
      tier: 'S-RANK',
      title: 'APEX ASCENDANT',
      levelRange: 'LEVEL 50+',
      xpRequirement: '25,000+ XP',
      color: 'crimson',
      badgeClass: 'bg-crimson-900/60 text-bone-100 border-crimson-700',
      perk: 'Supreme master of physical discipline. Unlocks apex identity insignia and eternal status.',
      multiplier: '3.0x XP',
    },
  ];

  return (
    <section id="rankings" className="py-24 relative overflow-hidden bg-void">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded border border-steel-700 bg-charcoal-900 text-ash-300 text-xs font-orbitron font-bold tracking-widest uppercase shadow-steel-card">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>ATHLETE HIERARCHY LADDER</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-bone-100 uppercase">
            RANK{' '}
            <span className="text-crimson-600">
              PROGRESSION
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From unranked initiate to supreme athlete. Every calorie burned and workout logged advances your operational tier.
          </p>
        </div>

        {/* Tier Selector Ribbon */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 justify-start lg:justify-center no-scrollbar">
          {ranks.map((r, idx) => (
            <button
              key={r.tier}
              onClick={() => setSelectedRank(idx)}
              className={`
                px-4 py-2.5 rounded font-orbitron text-xs font-bold tracking-wider
                transition-all duration-200 border flex items-center gap-2 whitespace-nowrap shadow-steel-card
                ${selectedRank === idx 
                  ? 'border-crimson-800 bg-crimson-950/40 text-bone-100' 
                  : 'bg-charcoal-900 text-ash-400 border-steel-800 hover:border-steel-700 hover:text-bone-200'
                }
              `}
            >
              <span>{r.tier}</span>
            </button>
          ))}
        </div>

        {/* Detailed Selected Rank Highlight Card */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Card (8 cols) */}
          <div className="lg:col-span-8 rounded bg-charcoal-900 border border-steel-700 p-8 relative overflow-hidden shadow-steel-card">
            {/* Top Crimson Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-800" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel-800 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black font-orbitron text-bone-100">
                      {ranks[selectedRank].tier}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-steel-800 text-bone-200 border border-steel-700">
                      {ranks[selectedRank].levelRange}
                    </span>
                  </div>
                  <h3 className="font-orbitron font-bold text-xl text-bone-100 mt-1">
                    {ranks[selectedRank].title}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-orbitron block text-ash-400">EXP THRESHOLD</span>
                  <span className="text-lg font-mono font-bold text-bone-100">
                    {ranks[selectedRank].xpRequirement}
                  </span>
                </div>
              </div>

              {/* Rank Perks & Multiplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded bg-void border border-steel-800 space-y-1">
                  <span className="text-[10px] font-orbitron font-bold text-amber-400 uppercase tracking-wider">
                    REWARD MULTIPLIER
                  </span>
                  <p className="text-xl font-orbitron font-black text-bone-100">
                    {ranks[selectedRank].multiplier}
                  </p>
                  <p className="text-xs text-ash-400 font-sans">
                    Earn amplified XP for every verified workout logged.
                  </p>
                </div>

                <div className="p-4 rounded bg-void border border-steel-800 space-y-1">
                  <span className="text-[10px] font-orbitron font-bold text-ash-400 uppercase tracking-wider">
                    SYSTEM PRIVILEGES
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {ranks[selectedRank].perk}
                  </p>
                </div>
              </div>

              {/* XP Progress Gauge */}
              <div className="pt-2">
                <EnergyBar
                  label={`RANK ASCENSION PROGRESS (${ranks[selectedRank].tier})`}
                  current={selectedRank === 5 ? 25000 : (selectedRank + 1) * 3500}
                  max={selectedRank === 5 ? 25000 : (selectedRank + 1) * 5000}
                  color={selectedRank >= 4 ? 'crimson' : selectedRank === 2 ? 'brass' : 'slate'}
                  unit="XP"
                />
              </div>
            </div>
          </div>

          {/* Side Ladder Overview (4 cols) */}
          <div className="lg:col-span-4 rounded bg-charcoal-900 border border-steel-800 p-6 space-y-3 shadow-steel-card">
            <h4 className="font-orbitron font-bold text-xs text-ash-300 tracking-wider uppercase mb-2">
              Ascension Hierarchy
            </h4>
            {ranks.map((r, i) => (
              <div
                key={r.tier}
                onClick={() => setSelectedRank(i)}
                className={`
                  p-3 rounded border transition-all duration-200 cursor-pointer flex items-center justify-between
                  ${selectedRank === i 
                    ? 'border-crimson-800/80 bg-charcoal-800' 
                    : 'border-steel-800 bg-void/60 hover:border-steel-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="font-orbitron font-black text-sm text-bone-100">{r.tier}</span>
                  <span className="text-xs text-ash-400 font-sans">{r.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedRank === i ? 'text-crimson-400' : 'text-steel-600'}`} />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default RankSystem;
