import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, workoutTitle = '', isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl bg-obsidian/95 border border-crimson-aura/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(255,42,95,0.25)] overflow-hidden"
        >
          {/* Top Beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-aura via-gold-mythic to-crimson-dark" />

          {/* Close Icon */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-5 right-5 p-1.5 rounded-sm border border-slate-700 text-slate-400 hover:text-crimson-aura hover:border-crimson-aura transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Warning Icon & Header */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="p-3 rounded-xl bg-crimson-aura/15 border border-crimson-aura/40 text-crimson-aura shadow-glow-crimson">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-bold tracking-widest text-crimson-aura uppercase">
                CRITICAL CONFIRMATION
              </span>
              <h3 className="font-orbitron font-black text-xl text-slate-100 uppercase tracking-wide">
                ABANDON QUEST?
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
            This training record <span className="text-white font-bold">{workoutTitle ? `("${workoutTitle}")` : ''}</span> will be permanently removed from your ascension log. All calories and training time for this session will be subtracted.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <AnimeButton
              type="button"
              variant="outline"
              size="md"
              disabled={isDeleting}
              onClick={onClose}
            >
              KEEP QUEST
            </AnimeButton>

            <AnimeButton
              type="button"
              variant="crimson"
              size="md"
              icon={Trash2}
              disabled={isDeleting}
              onClick={onConfirm}
            >
              {isDeleting ? 'PURGING...' : 'ABANDON'}
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
