import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Brain, 
  RefreshCw, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { getDeepIntelligence } from '../services/deepPersonalIntelligenceService';
import PersonalMomentum from '../components/deepIntelligence/PersonalMomentum';
import WhatChangedCard from '../components/deepIntelligence/WhatChangedCard';
import PersonalPatternCard from '../components/deepIntelligence/PersonalPatternCard';
import PlanFitCard from '../components/deepIntelligence/PlanFitCard';
import GoalMomentumCard from '../components/deepIntelligence/GoalMomentumCard';
import PurposeAlignmentCard from '../components/deepIntelligence/PurposeAlignmentCard';
import ReflectionPatternCard from '../components/deepIntelligence/ReflectionPatternCard';
import DataGapCard from '../components/deepIntelligence/DataGapCard';
import GrowthSummaryCard from '../components/deepIntelligence/GrowthSummaryCard';
import GlassCard from '../components/ui/GlassCard';
import AnimeButton from '../components/ui/AnimeButton';

export const DeepIntelligencePage = () => {
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntelligenceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDeepIntelligence();
      if (res && res.intelligence) {
        setIntelligence(res.intelligence);
      }
    } catch (err) {
      setError(err.message || 'Failed to load deep personal intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligenceData();
  }, []);

  return (
    <div className="min-h-screen bg-void text-offwhite flex flex-col font-sans selection:bg-crimson selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-charcoal/90 backdrop-blur-md border-b border-steel/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-sm bg-steel-800 text-ash-400 hover:text-bone hover:bg-steel-700 transition-colors"
            title="Return to Ascension Chamber"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-crimson-500" />
            <h1 className="font-orbitron font-bold text-sm sm:text-base text-bone uppercase tracking-wider">
              DEEP PERSONAL INTELLIGENCE
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchIntelligenceData}
          disabled={loading}
          className="px-3 py-1.5 rounded-sm bg-steel-800 border border-steel-700 text-xs font-mono text-ash-300 hover:text-bone hover:border-steel-600 transition-colors uppercase flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">REFRESH</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero Section */}
        <section className="space-y-2 border-b border-steel-800 pb-5">
          <div className="flex items-center gap-2 text-xs font-mono text-crimson-500 uppercase tracking-widest font-semibold">
            <Compass className="w-4 h-4" />
            <span>OBJECTIVE TELEMETRY SYNTHESIS</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-bone uppercase tracking-tight">
            UNDERSTAND YOUR JOURNEY
          </h2>
          <p className="text-sm font-sans text-ash-400 max-w-2xl leading-relaxed">
            Don’t just look at what you logged. Understand the patterns behind your progress, what changed across time, and how your training fits your actual life.
          </p>

          {intelligence?.dataQuality && (
            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-ash-500">
              <span>{intelligence.dataQuality.workoutCount} VERIFIED SESSIONS</span>
              <span>•</span>
              <span>{intelligence.dataQuality.historyDays} DAYS OF TELEMETRY</span>
              <span>•</span>
              <span className="text-emerald-400">100% REAL HISTORY</span>
            </div>
          )}
        </section>

        {/* Loading State */}
        {loading && !intelligence && (
          <div className="p-12 text-center space-y-3 font-mono text-xs text-ash-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-crimson-500" />
            <p>SYNTHESIZING DEEP PERSONAL TELEMETRY...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-sm bg-crimson-950/40 border border-crimson-800 text-xs font-mono text-crimson-300">
            {error}
          </div>
        )}

        {intelligence && (
          <>
            {/* 1. Personal Momentum Model */}
            <section className="space-y-3">
              <PersonalMomentum momentum={intelligence.personalMomentum} />
            </section>

            {/* 2. What Changed (Comparative Telemetry) */}
            <section className="space-y-3">
              <WhatChangedCard changes={intelligence.changes} />
            </section>

            {/* 3. Behavioral Patterns Grid */}
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-steel-800 pb-2">
                <h3 className="font-orbitron font-bold text-xs sm:text-sm text-bone tracking-wider uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-crimson-500" />
                  <span>IDENTIFIED BEHAVIORAL PATTERNS</span>
                </h3>
                <span className="text-[10px] font-mono text-ash-500 uppercase">
                  {intelligence.patterns?.length || 0} DETECTED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intelligence.patterns?.map((pattern) => (
                  <PersonalPatternCard key={pattern.id} pattern={pattern} />
                ))}
              </div>
            </section>

            {/* 4. Plan Fit & Adaptive Realities */}
            <section className="space-y-3">
              <PlanFitCard planFit={intelligence.planFit} />
            </section>

            {/* 5. Purpose & Goal Alignment */}
            <section className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PurposeAlignmentCard purposeAlignment={intelligence.purposeAlignment} />
                <GoalMomentumCard goalMomentum={intelligence.goalMomentum} />
              </div>
            </section>

            {/* 6. Reflection Patterns & Subjective Context */}
            <section className="space-y-3">
              <ReflectionPatternCard reflectionPatterns={intelligence.reflectionPatterns} />
            </section>

            {/* 7. Life Load Response & Re-entry Status */}
            {(intelligence.lifeLoadPatterns || intelligence.returnJourney) && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intelligence.lifeLoadPatterns && (
                  <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
                    <div className="flex items-center justify-between border-b border-steel-800 pb-2.5">
                      <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold">
                        SCHEDULE CONTEXT
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-steel-800 border border-steel-700 text-bone uppercase">
                        {intelligence.lifeLoadPatterns.currentLifeLoad}
                      </span>
                    </div>
                    <h4 className="font-orbitron font-bold text-sm text-bone uppercase">
                      LIFE LOAD VS TRAINING RESPONSE
                    </h4>
                    <p className="text-xs font-sans text-ash-300 leading-relaxed">
                      {intelligence.lifeLoadPatterns.observation}
                    </p>
                    <p className="text-[11px] font-sans text-ash-400 italic">
                      {intelligence.lifeLoadPatterns.meaning}
                    </p>
                  </GlassCard>
                )}

                {intelligence.returnJourney && (
                  <GlassCard glow="none" className="p-5 border-steel-700 bg-charcoal-900 shadow-steel-card space-y-3">
                    <div className="flex items-center justify-between border-b border-steel-800 pb-2.5">
                      <span className="text-[10px] font-mono tracking-widest text-ash-400 uppercase font-semibold">
                        CONTINUITY STATUS
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-steel-800 border border-steel-700 text-bone uppercase">
                        {intelligence.returnJourney.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="font-orbitron font-bold text-sm text-bone uppercase">
                      RETURN & CONTINUITY CADENCE
                    </h4>
                    <p className="text-xs font-sans text-ash-300 leading-relaxed">
                      {intelligence.returnJourney.observation}
                    </p>
                    <p className="text-[11px] font-sans text-ash-400 italic">
                      {intelligence.returnJourney.meaning}
                    </p>
                  </GlassCard>
                )}
              </section>
            )}

            {/* 8. Telemetry Data Gaps (Honest Uncertainty) */}
            <section className="space-y-3">
              <DataGapCard dataGaps={intelligence.dataGaps} />
            </section>

            {/* 9. Personal Growth Narrative */}
            <section className="space-y-3">
              <GrowthSummaryCard growthSummary={intelligence.growthSummary} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-steel/50 bg-charcoal/80 py-4 text-center text-xs text-ash font-mono">
        <span>F-TRACK: FITNESS ASCENSION • DEEP PERSONAL INTELLIGENCE SYNCHRONIZED</span>
      </footer>
    </div>
  );
};

export default DeepIntelligencePage;
