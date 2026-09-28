import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';
import GlassCard from '../ui/GlassCard';

/**
 * ReturnJourneyCard Component (Stage 19)
 * Empathetic, non-punitive re-entry banner when returning after 3+ days away.
 * Never shames or displays failure banners. Focuses on restarting where the user is.
 */
export const ReturnJourneyCard = ({ returnStatus, onStartWorkout, onDismiss }) => {
  if (!returnStatus || !returnStatus.needsReturnCard) {
    return null;
  }

  const {
    daysAway = 3,
    heading = 'THE PATH CONTINUES',
    message = 'Your previous progress is still here. Start where you are.',
    recommendedMinutes = 20,
    subtext = 'You do not need an extreme effort today. A simple 20-minute movement session is enough.',
  } = returnStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <GlassCard
        glow="none"
        className="p-5 sm:p-6 border-steel-700 bg-charcoal-900 shadow-steel-card relative overflow-hidden"
      >
        {/* Subtle brass/amber top indicator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-600 via-amber-500/70 to-transparent" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-sm bg-steel-800 border border-steel-700 flex items-center justify-center text-amber-500 flex-shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
                  RESILIENT RE-ENTRY
                </span>
                <span className="text-steel-600">•</span>
                <span className="text-[10px] font-mono text-ash-400">
                  {daysAway} DAYS SINCE LAST RECORD
                </span>
              </div>

              <h3 className="font-orbitron font-bold text-lg sm:text-xl text-bone tracking-wide uppercase">
                {heading}
              </h3>

              <p className="text-sm font-sans text-ash-300 max-w-2xl leading-relaxed">
                {message}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs font-mono text-ash-400">
                <ShieldCheck className="w-3.5 h-3.5 text-steel-400 flex-shrink-0" />
                <span>{subtext}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0">
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-mono text-ash-500 hover:text-ash-300 px-3 py-2 transition-colors uppercase"
              >
                DISMISS
              </button>
            )}

            <AnimeButton
              variant="outline"
              size="md"
              icon={ArrowRight}
              className="w-full md:w-auto border-amber-600/60 text-bone hover:border-amber-500 hover:bg-amber-600/10"
              onClick={() => onStartWorkout && onStartWorkout({ duration: recommendedMinutes, activityType: 'Walking' })}
            >
              START {recommendedMinutes}-MIN SESSION
            </AnimeButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ReturnJourneyCard;
