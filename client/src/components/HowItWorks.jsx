import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Swords, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'INITIALIZE PROFILE',
      subtitle: 'RECORD BASELINE TELEMETRY',
      description: 'Enter your biometric baseline, height, weight, and fitness targets. Receive your initial E-Rank Trainee designation and connect to the Ascension network.',
      icon: UserCheck,
      iconColor: 'text-bone-100',
    },
    {
      number: '02',
      title: 'EXECUTE DIRECTIVES',
      subtitle: 'COMPLETE DAILY MISSIONS',
      description: 'Execute your training routine. Log gym sessions, outdoor runs, HIIT, or steps. Every workout earns you XP, burns calories, and maintains your streak.',
      icon: Swords,
      iconColor: 'text-crimson-400',
    },
    {
      number: '03',
      title: 'COMMAND ASCENSION',
      subtitle: 'SURPASS S-TIER THRESHOLD',
      description: 'Watch your character level up. Monitor your weight and calorie trends on physical telemetry gauges, forge personal records, and ascend the rank hierarchy.',
      icon: TrendingUp,
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-void border-y border-steel-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded border border-steel-700 bg-charcoal-900 text-ash-300 text-xs font-orbitron font-bold tracking-widest uppercase shadow-steel-card">
            <Sparkles className="w-3.5 h-3.5 text-crimson-600" />
            <span>OPERATIONAL LOOP</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-bone-100 uppercase">
            HOW IT{' '}
            <span className="text-crimson-600">
              WORKS
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Physical discipline built on empirical fitness methodology. Follow the path to peak human performance.
          </p>
        </div>

        {/* 3 Step Progression with Connectors */}
        <div className="relative">
          {/* Desktop Horizontal Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-24 right-24 h-[1px] bg-steel-800 -translate-y-8 z-0" />

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
                  className="relative rounded p-8 bg-charcoal-900 border border-steel-700/80 hover:border-steel-500 transition-all duration-300 flex flex-col justify-between group shadow-steel-card"
                >
                  {/* Single Crimson Top Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-800" />

                  <div className="space-y-6">
                    {/* Top Step Badge & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded text-xs font-orbitron font-extrabold tracking-widest border border-steel-700 bg-steel-800 text-bone-200">
                        PHASE {step.number}
                      </span>
                      <div className="w-12 h-12 rounded border border-steel-700 bg-void flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                        <Icon className={`w-6 h-6 ${step.iconColor}`} />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-orbitron font-bold tracking-widest text-ash-500 uppercase block mb-1">
                        {step.subtitle}
                      </span>
                      <h3 className="font-orbitron font-bold text-xl text-bone-100">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-slate-300 text-sm leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-steel-800 flex items-center justify-between text-xs font-orbitron">
                    <span className="text-ash-500 font-mono">DIRECTIVE {step.number}</span>
                    <span className="text-ash-400 flex items-center gap-1 group-hover:text-crimson-400 group-hover:translate-x-1 transition-all">
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
