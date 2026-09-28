import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Flame, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeButton from './ui/AnimeButton';

export const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <section id="cta" className="py-28 relative overflow-hidden bg-void">
      {/* Background Subtle Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-crimson-950/15 rounded-full blur-3xl opacity-35" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded p-10 sm:p-16 bg-charcoal-900 border border-steel-700 shadow-steel-card relative overflow-hidden"
        >
          {/* Accent Lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-800" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-steel-800" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-steel-700 bg-steel-800 text-ash-300 text-xs font-orbitron font-bold tracking-widest mb-6">
            <Zap className="w-4 h-4 text-crimson-600" />
            <span>FINAL PROTOCOL • LEVEL UP NOW</span>
          </div>

          {/* Heading */}
          <h2 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-bone-100 uppercase leading-tight">
            READY TO BEGIN{' '}
            <span className="text-crimson-600">
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
              variant="crimson"
              size="lg"
              icon={Zap}
              className="px-10 py-4 text-base"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/dashboard');
                } else {
                  navigate('/register');
                }
              }}
            >
              START YOUR JOURNEY
            </AnimeButton>
          </div>

          {/* System Ticker Perks */}
          <div className="mt-12 pt-8 border-t border-steel-800 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-orbitron text-ash-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>FREE ACCOUNT CREATION</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>ZERO ADS • PURE PERFORMANCE</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>MODERN MERN ARCHITECTURE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
