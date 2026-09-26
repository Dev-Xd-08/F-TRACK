import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Swords, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'CREATE YOUR PROFILE',
      subtitle: 'AWAKEN YOUR IDENTITY',
      description: 'Enter your biometric baseline, height, weight, and fitness targets. Receive your initial E-Rank Trainee license and step into the Ascension Realm.',
      icon: UserCheck,
      color: 'cyan',
      glow: 'shadow-glow-cyan',
      border: 'border-cyan-neon/40',
      badgeBg: 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
    },
    {
      number: '02',
      title: 'COMPLETE YOUR QUESTS',
      subtitle: 'CONQUER DAILY WORKOUTS',
      description: 'Execute your training routine. Log gym sessions, outdoor runs, HIIT, or steps. Every workout earns you XP, burns calories, and maintains your streak.',
      icon: Swords,
      color: 'violet',
      glow: 'shadow-glow-violet',
      border: 'border-violet-neon/40',
      badgeBg: 'bg-violet-neon/10 text-violet-glow border-violet-neon/30',
    },
    {
      number: '03',
      title: 'TRACK YOUR ASCENSION',
      subtitle: 'RANK UP TO S-TIER',
      description: 'Watch your character level up. Monitor your weight and calorie trends on dynamic charts, unlock mythic achievement badges, and ascend through Hunter Ranks.',
      icon: TrendingUp,
      color: 'gold',
      glow: 'shadow-glow-gold',
      border: 'border-gold-mythic/40',
      badgeBg: 'bg-gold-mythic/10 text-gold-mythic border-gold-mythic/30',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-void-pure/60 border-y border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon text-xs font-orbitron font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE 3-STEP GAME LOOP</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-slate-100 uppercase">
            HOW IT{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-violet-glow to-gold-mythic">
              WORKS
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Gamified progression built on verified fitness methodology. Follow the path to peak physical conditioning.
          </p>
        </div>

        {/* 3 Step Progression with Animated Connectors */}
        <div className="relative">
          {/* Desktop Horizontal Glowing Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-24 right-24 h-0.5 bg-gradient-to-r from-cyan-neon/40 via-violet-neon/40 to-gold-mythic/40 -translate-y-8 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="relative rounded-xl p-8 bg-obsidian/85 backdrop-blur-md border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Step Accent Glow on Hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color === 'cyan' ? 'from-cyan-neon' : step.color === 'violet' ? 'from-violet-neon' : 'from-gold-mythic'} to-transparent`} />

                  <div className="space-y-6">
                    {/* Top Step Badge & Icon */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded text-xs font-orbitron font-extrabold tracking-widest border ${step.badgeBg}`}>
                        STEP {step.number}
                      </span>
                      <div className={`w-12 h-12 rounded-xl border ${step.border} ${step.glow} bg-void flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className={`w-6 h-6 ${step.color === 'cyan' ? 'text-cyan-neon' : step.color === 'violet' ? 'text-violet-glow' : 'text-gold-mythic'}`} />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-orbitron font-bold tracking-widest text-slate-400 uppercase block mb-1">
                        {step.subtitle}
                      </span>
                      <h3 className="font-orbitron font-bold text-xl text-slate-100 group-hover:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-slate-400 text-sm leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-orbitron">
                    <span className="text-slate-500 font-mono">PHASE {step.number}</span>
                    <span className="text-cyan-neon flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      EXPLORE <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
