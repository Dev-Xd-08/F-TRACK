import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, Check, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import AnimeButton from '../ui/AnimeButton';

const PRESETS = [
  { id: 'BUILD_DISCIPLINE', label: 'Build discipline', subtext: 'Forge consistent habits and reliable follow-through' },
  { id: 'IMPROVE_HEALTH', label: 'Improve health', subtext: 'Protect long-term physical vitality and well-being' },
  { id: 'INCREASE_ENERGY', label: 'Increase energy', subtext: 'Build daily physical stamina and mental alertness' },
  { id: 'BUILD_CONFIDENCE', label: 'Build confidence', subtext: 'Earn self-trust through physical accomplishment' },
  { id: 'IMPROVE_STRENGTH', label: 'Improve strength', subtext: 'Develop muscular capacity and physical resilience' },
  { id: 'IMPROVE_ENDURANCE', label: 'Improve endurance', subtext: 'Build cardiovascular stamina and work capacity' },
  { id: 'PREPARE_SPORT', label: 'Prepare for a sport', subtext: 'Condition body for athletic competition' },
  { id: 'CHANGE_LIFESTYLE', label: 'Change my lifestyle', subtext: 'Break sedentary patterns and build active living' },
  { id: 'FEEL_BETTER', label: 'Feel better in daily life', subtext: 'Relieve stress, tension, and move without pain' },
  { id: 'SUPPORT_FAMILY', label: 'Support loved ones', subtext: 'Show up energized and healthy for family' },
  { id: 'PERSONAL_CHALLENGE', label: 'Personal challenge', subtext: 'Confront physical limits and grow stronger' },
  { id: 'CUSTOM', label: 'Custom purpose', subtext: 'Write your own personal motivation statement' },
];

/**
 * PurposeSetup Modal / Dialog (Stage 19)
 */
export const PurposeSetup = ({ isOpen, onClose, currentPurpose, onSaved }) => {
  const [selectedType, setSelectedType] = useState(currentPurpose?.purposeType || 'BUILD_DISCIPLINE');
  const [customText, setCustomText] = useState(currentPurpose?.customPurpose || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    setError('');

    if (selectedType === 'CUSTOM' && !customText.trim()) {
      setError('Please write your personal purpose statement.');
      return;
    }

    try {
      setSubmitting(true);
      if (onSaved) {
        await onSaved({
          purposeType: selectedType,
          customPurpose: customText.trim(),
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to preserve purpose.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-void/85 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-2xl rounded bg-charcoal-900 border border-steel-700 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
      >
        {/* Single Crimson Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-800" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-steel-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-charcoal-800 border border-steel-700 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-extrabold text-amber-400 tracking-widest uppercase block mb-0.5">
                BEFORE WE BEGIN • PERSONAL PURPOSE
              </span>
              <h3 className="font-orbitron font-black text-lg sm:text-xl text-bone-100 uppercase tracking-wide">
                What are you training for?
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Every journey has a reason. Select your core purpose or define your own personal anchor.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded border border-steel-700 bg-charcoal-800 text-ash-400 hover:text-bone-100 hover:border-steel-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded bg-crimson-950/60 border border-crimson-800/80 text-xs text-crimson-400 font-mono">
            {error}
          </div>
        )}

        {/* Preset Selector Grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-orbitron font-bold text-ash-300 uppercase tracking-wider block">
            SELECT PRIMARY PURPOSE:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {PRESETS.map((preset) => {
              const isSelected = selectedType === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedType(preset.id)}
                  className={`p-3 rounded text-left border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-crimson-800 bg-crimson-950/40 text-bone-100 shadow-steel-card'
                      : 'border-steel-800 bg-void/60 text-ash-300 hover:border-steel-700 hover:text-bone-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-crimson-600 bg-crimson-700 text-bone-100' : 'border-steel-700'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-orbitron font-bold text-xs uppercase block tracking-wider">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-ash-400 font-sans block leading-tight">
                      {preset.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input (If Custom is selected or to add note) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-orbitron font-bold text-ash-300 uppercase tracking-wider block">
            {selectedType === 'CUSTOM' ? 'YOUR CUSTOM STATEMENT (REQUIRED):' : 'OPTIONAL PERSONAL NOTE / STATEMENT:'}
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder='e.g. "I want to become someone I can rely on."'
            rows={2}
            maxLength={280}
            className="w-full px-3 py-2 rounded bg-void border border-steel-700 text-bone-100 placeholder-ash-500 text-sm focus:outline-none focus:border-crimson-800 font-sans resize-none"
          />
          <div className="flex justify-between items-center text-[10px] font-mono text-ash-500">
            <span>Anchors your daily recommendation focus and intelligence insights</span>
            <span>{customText.length} / 280</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-steel-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-ash-400 hover:text-bone-100 transition-colors uppercase tracking-wider order-2 sm:order-1"
          >
            SKIP FOR NOW
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <AnimeButton
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-1/2 sm:w-auto"
            >
              CANCEL
            </AnimeButton>

            <AnimeButton
              type="button"
              variant="crimson"
              size="md"
              icon={Compass}
              disabled={submitting}
              onClick={handleSave}
              className="w-1/2 sm:w-auto"
            >
              {submitting ? 'ANCHORING...' : 'ANCHOR PURPOSE'}
            </AnimeButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurposeSetup;
