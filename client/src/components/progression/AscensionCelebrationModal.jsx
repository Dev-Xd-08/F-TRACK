import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpCircle, 
  Crown, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';

export const AscensionCelebrationModal = ({
  isOpen = false,
  onClose,
  type = 'LEVEL_UP', // 'LEVEL_UP' | 'RANK_UP'
  data = {},
}) => {
  if (!isOpen) return null;

  const isRankUp = type === 'RANK_UP';

  const {
    oldLevel = 1,
    newLevel = 2,
    oldRank = 'E',
    newRank = 'D',
    newRankTitle = 'INITIATE',
    rank = 'E',
    xp = 0,
  } = data;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/95 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-sm p-6 sm:p-8 bg-charcoal border border-steel text-center space-y-6 overflow-hidden shadow-steel-card"
        >
          {/* Expanding Restrained Crimson Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute top-0 left-0 right-0 h-[3px] bg-crimson origin-center"
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-sm text-ash hover:text-offwhite hover:bg-gunmetal transition-colors"
            aria-label="Close celebration dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Insignia Box */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
            <div className="w-full h-full rounded-sm border-2 border-steel bg-gunmetal flex items-center justify-center shadow-steel-card">
              {isRankUp ? (
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-crimson" />
              ) : (
                <ArrowUpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-offwhite" />
              )}
            </div>
          </div>

          {/* Header Title */}
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-sm border uppercase bg-obsidian text-ash border-steel">
              {isRankUp ? 'TIER ELEVATION CLEARED' : 'CAPACITY THRESHOLD CROSSED'}
            </span>

            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-offwhite uppercase tracking-tight pt-1">
              {isRankUp ? 'RANK PROMOTED' : 'LEVEL ADVANCED'}
            </h2>
          </div>

          {/* Transition Showcase */}
          <div className="p-4 rounded-sm bg-obsidian border border-steel/60 space-y-2 relative z-10">
            {isRankUp ? (
              <div className="flex items-center justify-center gap-6 text-center">
                <div>
                  <span className="text-[10px] font-mono text-ash uppercase block">FORMER</span>
                  <span className="font-orbitron font-bold text-2xl text-steel-light">RANK {oldRank}</span>
                </div>

                <ArrowRight className="w-6 h-6 text-crimson" />

                <div>
                  <span className="text-[10px] font-mono text-crimson uppercase block font-bold">ASCENDED</span>
                  <span className="font-orbitron font-black text-3xl text-offwhite">RANK {newRank}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6 text-center">
                <div>
                  <span className="text-[10px] font-mono text-ash uppercase block">PREVIOUS</span>
                  <span className="font-orbitron font-bold text-2xl text-steel-light">
                    LVL {String(oldLevel).padStart(2, '0')}
                  </span>
                </div>

                <ArrowRight className="w-6 h-6 text-crimson" />

                <div>
                  <span className="text-[10px] font-mono text-crimson uppercase block font-bold">CURRENT</span>
                  <span className="font-orbitron font-black text-3xl text-offwhite">
                    LVL {String(newLevel).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-steel/50 text-xs font-mono text-ash">
              {isRankUp ? (
                <span>DESIGNATION: <strong className="text-offwhite uppercase">{newRankTitle}</strong></span>
              ) : (
                <span>OPERATIONAL TIER: <strong className="text-bone uppercase">RANK {rank}</strong></span>
              )}
            </div>
          </div>

          {/* Flavor context */}
          <p className="text-xs font-sans text-ash relative z-10 leading-relaxed">
            {isRankUp
              ? 'Athletic output has crossed the qualification threshold. Enhanced training parameters authorized.'
              : 'Physical conditioning limit expanded. Baseline work capacity elevated.'}
          </p>

          {/* Continue Button */}
          <div className="pt-2 relative z-10">
            <AnimeButton
              variant="crimson"
              size="lg"
              className="w-full"
              icon={ArrowRight}
              onClick={onClose}
            >
              ACCEPT AND CONTINUE
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AscensionCelebrationModal;
