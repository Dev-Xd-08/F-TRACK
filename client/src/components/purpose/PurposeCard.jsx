import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Edit3, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';

/**
 * Format purpose preset into human readable title
 */
const getPurposeDisplay = (purpose) => {
  if (!purpose) return null;

  if (purpose.purposeType === 'CUSTOM' && purpose.customPurpose) {
    return {
      title: 'PERSONAL PURPOSE',
      statement: `"${purpose.customPurpose}"`,
    };
  }

  const mapping = {
    BUILD_DISCIPLINE: { title: 'DISCIPLINE & HABIT', statement: '"I train to build unbreakable daily discipline and become someone I can rely on."' },
    IMPROVE_HEALTH: { title: 'VITALITY & HEALTH', statement: '"I train to protect my health, strengthen my immune capacity, and live with longevity."' },
    INCREASE_ENERGY: { title: 'ENERGY & FOCUS', statement: '"I train to elevate my daily stamina, mental clarity, and metabolic vitality."' },
    BUILD_CONFIDENCE: { title: 'CONFIDENCE & STRENGTH', statement: '"I train to respect my physical capability and build earned self-confidence."' },
    IMPROVE_STRENGTH: { title: 'STRENGTH PROGRESSION', statement: '"I train to develop real physical strength and exceed past limitations."' },
    IMPROVE_ENDURANCE: { title: 'ENDURANCE & RESILIENCE', statement: '"I train to forge cardiovascular stamina and endure demanding challenges."' },
    PREPARE_SPORT: { title: 'ATHLETIC READINESS', statement: '"I train to condition my body for athletic performance and competitive movement."' },
    CHANGE_LIFESTYLE: { title: 'LIFESTYLE TRANSFORMATION', statement: '"I train to cultivate a healthier, structured, and deliberate way of living."' },
    FEEL_BETTER: { title: 'DAILY WELL-BEING', statement: '"I train to release mental tension and feel centered, capable, and balanced."' },
    SUPPORT_FAMILY: { title: 'FAMILY & PURPOSE', statement: '"I train so I can show up with energy and longevity for the people who depend on me."' },
    PERSONAL_CHALLENGE: { title: 'PERSONAL CHALLENGE', statement: '"I train to confront difficult tasks and prove to myself what is possible."' },
  };

  const matched = mapping[purpose.purposeType];
  if (matched) {
    return {
      title: matched.title,
      statement: purpose.customPurpose ? `"${purpose.customPurpose}"` : matched.statement,
    };
  }

  return {
    title: 'PERSONAL PURPOSE',
    statement: purpose.customPurpose ? `"${purpose.customPurpose}"` : '"I train to become better each day."',
  };
};

/**
 * PurposeCard Component (Stage 19)
 * Represents the persistent user purpose: "Why are you training?"
 * Designed with warm dark warrior tones (weathered steel, charcoal, bone, and muted crimson).
 */
export const PurposeCard = ({ purpose, onEditPurpose }) => {
  const display = getPurposeDisplay(purpose);

  if (!purpose || !display) {
    return (
      <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-charcoal-800 border border-steel-700 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-bold text-ash-400 uppercase tracking-widest block mb-0.5">
                PERSONAL PURPOSE • UNSET
              </span>
              <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone-100 uppercase tracking-wide">
                Why do you train?
              </h4>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Every journey needs an anchor. Define your personal reason for training to guide your intelligence and daily focus.
              </p>
            </div>
          </div>

          <AnimeButton
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={onEditPurpose}
            className="flex-shrink-0 whitespace-nowrap"
          >
            ANCHOR PURPOSE
          </AnimeButton>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard glow="none" className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden group">
        {/* Subtle Warm Brass Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-600/70 via-steel-600 to-crimson-800/70" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-charcoal-800 border border-steel-700 flex items-center justify-center text-amber-400">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-orbitron font-extrabold text-amber-400 tracking-widest uppercase">
                WHY I TRAIN • {display.title}
              </span>
            </div>

            <p className="font-serif italic text-base sm:text-lg text-bone-100 leading-relaxed font-medium">
              {display.statement}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-ash-400">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson-600" />
              <span className="uppercase tracking-wider">KEEP WALKING. THE PATH CONTINUES.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0 flex-shrink-0">
            <button
              onClick={onEditPurpose}
              className="px-3 py-1.5 rounded border border-steel-700 bg-charcoal-800 hover:border-steel-500 hover:text-bone-100 text-ash-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-steel-card"
              title="Edit Personal Purpose"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT PURPOSE</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default PurposeCard;
