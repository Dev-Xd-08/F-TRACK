import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Activity, 
  Flame, 
  Target, 
  LineChart, 
  Trophy,
  Sparkles
} from 'lucide-react';
import FeatureCard from './FeatureCard';

export const FeatureSection = () => {
  const modules = [
    {
      number: '01',
      title: 'WORKOUT QUESTS',
      description: 'Track running, cycling, gym, walking and other workouts with real-time logs, duration, sets, and XP rewards.',
      icon: Dumbbell,
      accentColor: 'cyan',
      perks: ['Running & Cycling', 'Gym & Lifting', 'XP Multipliers'],
    },
    {
      number: '02',
      title: 'BODY ANALYSIS',
      description: 'Calculate and monitor BMI and fitness metrics with accurate standard classifications and health trajectory indicators.',
      icon: Activity,
      accentColor: 'violet',
      perks: ['BMI Calculator', 'Weight Logging', 'Category Index'],
    },
    {
      number: '03',
      title: 'CALORIE CORE',
      description: 'Track calorie intake and calories burned. Balance your metabolic energy equation to power your physical evolution.',
      icon: Flame,
      accentColor: 'crimson',
      perks: ['Intake Tracking', 'Burn Estimation', 'Deficit/Surplus HUD'],
    },
    {
      number: '04',
      title: 'GOAL SYSTEM',
      description: 'Set fitness goals such as target weight, calorie burn, workout duration and steps with dynamic quest progress bars.',
      icon: Target,
      accentColor: 'gold',
      perks: ['Target Weight', 'Step Count Targets', 'Weekly Quests'],
    },
    {
      number: '05',
      title: 'PROGRESS MATRIX',
      description: 'View workout history, BMI changes, calories and goal completion through high-contrast visual analytics and charts.',
      icon: LineChart,
      accentColor: 'cyan',
      perks: ['Workout History', 'Trend Analytics', 'Interactive Charts'],
    },
    {
      number: '06',
      title: 'ACHIEVEMENT SYSTEM',
      description: 'Track streaks, milestones and fitness achievements. Unlock legendary anime badges and ascend to higher Hunter Ranks.',
      icon: Trophy,
      accentColor: 'gold',
      perks: ['Daily Streaks', 'Milestone Badges', 'Personal Records'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-violet-neon/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-neon/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-neon/40 bg-violet-neon/10 text-violet-glow text-xs font-orbitron font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE FITNESS ARCHITECTURE</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-slate-100 uppercase">
            THE ASCENSION{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-cyan">
              SYSTEM
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to transform your fitness journey. Grounded in rigorous fitness tracking science, 
            amplified by anime progression mechanics.
          </p>
        </div>

        {/* 6 Grid Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {modules.map((mod) => (
            <FeatureCard key={mod.number} {...mod} />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeatureSection;
