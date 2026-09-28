import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';
import AnimeButton from './AnimeButton';

/**
 * ErrorState Component (Stage 14)
 * Standardized F-TRACK cyberpunk error display with optional retry action
 * @param {string} title - Main error heading
 * @param {string} message - User-friendly explanation (no raw stack traces)
 * @param {function} retry - Optional retry callback
 * @param {string} className - Additional CSS class overrides
 */
export const ErrorState = ({
  title = 'SYSTEM CONNECTION ERROR',
  message = 'Fitness telemetry could not be synchronized.',
  retry,
  onRetry,
  className = '',
}) => {
  const handleRetry = retry || onRetry;

  return (
    <GlassCard glow="none" className={`text-center py-10 px-4 max-w-lg mx-auto space-y-4 border-steel bg-charcoal-900 shadow-steel-card ${className}`}>
      <div className="w-14 h-14 rounded-sm bg-obsidian border border-steel mx-auto flex items-center justify-center text-crimson shadow-steel-card">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h4 className="font-orbitron font-bold text-base text-bone-100 uppercase tracking-wider">
          {title}
        </h4>
        <p className="text-xs text-ash-400 font-sans max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {handleRetry && (
        <div className="pt-2">
          <AnimeButton
            variant="crimson"
            size="sm"
            icon={RefreshCw}
            onClick={handleRetry}
          >
            RETRY SYNC
          </AnimeButton>
        </div>
      )}
    </GlassCard>
  );
};

export default ErrorState;
