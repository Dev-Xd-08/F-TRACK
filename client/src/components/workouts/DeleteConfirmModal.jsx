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
          className="relative w-full max-w-md rounded-xl bg-obsidian border border-crimson/50 p-6 sm:p-8 shadow-steel-card overflow-hidden"
        >
          {/* Top Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-crimson" />

          {/* Close Icon */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-5 right-5 p-1.5 rounded-sm border border-steel/60 text-ash hover:text-bone hover:border-steel transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Warning Icon & Header */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="p-2.5 rounded-lg bg-crimson/15 border border-crimson/40 text-crimson-bright shadow-steel-card">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-bold tracking-widest text-crimson-bright uppercase">
                CONFIRM DELETION
              </span>
              <h3 className="font-orbitron font-black text-xl text-bone uppercase tracking-wide">
                DELETE WORKOUT RECORD?
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-ash font-sans leading-relaxed mb-6">
            This training record <span className="text-bone font-bold">{workoutTitle ? `("${workoutTitle}")` : ''}</span> will be permanently removed from your workout history. Associated calories and duration will be updated accordingly.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-steel/40">
            <AnimeButton
              type="button"
              variant="outline"
              size="md"
              disabled={isDeleting}
              onClick={onClose}
            >
              CANCEL
            </AnimeButton>

            <AnimeButton
              type="button"
              variant="crimson"
              size="md"
              icon={Trash2}
              disabled={isDeleting}
              onClick={onConfirm}
            >
              {isDeleting ? 'DELETING...' : 'DELETE RECORD'}
            </AnimeButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
