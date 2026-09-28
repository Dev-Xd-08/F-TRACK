import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Activity, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle 
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import WhyThisInsight from './WhyThisInsight';

const getPatternIcon = (type) => {
  switch (type) {
    case 'CONSISTENCY':
      return TrendingUp;
    case 'TRAINING_WINDOW':
      return Calendar;
    case 'REALITY_FIT':
      return Clock;
    case 'MOVEMENT_PATTERN':
      return Activity;
    default:
      return Compass;
  }
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'IMPROVING':
    case 'TARGET_REACHED':
      return 'bg-emerald-950/40 border-emerald-600/60 text-emerald-400';
    case 'BALANCED':
    case 'STABLE':
    case 'DIVERSE':
      return 'bg-charcoal-800 border-steel-700 text-bone';
    case 'DECLINING':
    case 'MISALIGNED':
      return 'bg-amber-950/40 border-amber-600/60 text-amber-400';
    case 'INSUFFICIENT_HISTORY':
    case 'UNCONFIGURED':
      return 'bg-charcoal-900 border-steel-800 text-ash-500';
    default:
      return 'bg-charcoal-800 border-steel-700 text-ash-300';
  }
};

/**
 * PersonalPatternCard Component (Stage 21)
 * Displays a single verified behavioral pattern with transparent rationale disclosure.
 */
export const PersonalPatternCard = ({ pattern }) => {
  if (!pattern) return null;

  const {
    id,
    type,
    title,
    status = 'STABLE',
    observation,
    evidence,
    meaning,
    nextStep,
  } = pattern;

  const Icon = getPatternIcon(type);

  return (
    <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-steel-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-bone">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold block">
              BEHAVIORAL TELEMETRY
            </span>
            <h4 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase tracking-tight">
              {title}
            </h4>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border uppercase ${getStatusBadgeStyle(status)}`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Observation Primary Text */}
      <p className="text-xs font-sans text-ash-300 leading-relaxed">
        {observation}
      </p>

      {/* Why This Insight Accordion */}
      <WhyThisInsight
        observation={observation}
        evidence={evidence}
        meaning={meaning}
        nextStep={nextStep}
      />
    </GlassCard>
  );
};

export default PersonalPatternCard;
