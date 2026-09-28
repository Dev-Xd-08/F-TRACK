import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Shield, 
  Trophy, 
  LogOut, 
  User, 
  Sparkles, 
  ArrowLeft,
  Activity,
  BatteryCharging,
  Clock,
  Dumbbell,
  Plus,
  ArrowRight,
  Scale,
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/workoutService';
import { getHealthProfile } from '../services/healthService';
import { getProgression } from '../services/progressionService';
import { getRecords } from '../services/recordService';
import { getQuests, getQuestHistory } from '../services/questService';
import { getAchievements } from '../services/achievementService';
import { getAnalytics } from '../services/analyticsService';
import { getFitnessIntelligence } from '../services/intelligenceService';
import { getPurpose, savePurpose } from '../services/purposeService';
import { getJourneyTelemetry } from '../services/journeyService';
import {
  getTrainingPlan,
  getAdaptiveWeek,
  getBaseline,
  getDailyRecommendation,
  getLoadAndBalance,
  getLifeContext,
} from '../services/trainingPlanService';
import { getCurrentWeeklyReflection } from '../services/weeklyReflectionService';
import { getDeepIntelligence } from '../services/deepPersonalIntelligenceService';
import DeepIntelligenceDashboard from '../components/deepIntelligence/DeepIntelligenceDashboard';
import AscensionHUD from '../components/progression/AscensionHUD';
import PersonalRecordMatrix from '../components/progression/PersonalRecordMatrix';
import RecentActivity from '../components/progression/RecentActivity';
import QuestBoard from '../components/quests/QuestBoard';
import GoalBoard from '../components/goals/GoalBoard';
import AchievementShowcase from '../components/achievements/AchievementShowcase';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import FitnessIntelligence from '../components/intelligence/FitnessIntelligence';
import NotificationBell from '../components/notifications/NotificationBell';
import TodayTelemetry from '../components/dashboard/TodayTelemetry';
import PurposeCard from '../components/purpose/PurposeCard';
import PurposeSetup from '../components/purpose/PurposeSetup';
import ReturnJourneyCard from '../components/journey/ReturnJourneyCard';
import TodayFocus from '../components/journey/TodayFocus';
import GoalAdjustmentSuggestion from '../components/journey/GoalAdjustmentSuggestion';
import JourneyTimeline from '../components/journey/JourneyTimeline';
import GrowthSummary from '../components/journey/GrowthSummary';
import AvailabilitySelector from '../components/plan/AvailabilitySelector';
import LifeLoadSelector from '../components/plan/LifeLoadSelector';
import AdaptiveRecommendation from '../components/plan/AdaptiveRecommendation';
import AdaptiveWeekCard from '../components/plan/AdaptiveWeekCard';
import TrainingPlanCard from '../components/plan/TrainingPlanCard';
import TrainingPlanBuilder from '../components/plan/TrainingPlanBuilder';
import PersonalBaselineCard from '../components/plan/PersonalBaselineCard';
import SelfComparison from '../components/plan/SelfComparison';
import LoadCheckCard from '../components/plan/LoadCheckCard';
import WeeklyReflectionModal from '../components/plan/WeeklyReflectionModal';
import AnimeButton from '../components/ui/AnimeButton';
import GlassCard from '../components/ui/GlassCard';
import EnergyBar from '../components/ui/EnergyBar';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [healthProfile, setHealthProfile] = useState(null);
  const [progression, setProgression] = useState(null);
  const [records, setRecords] = useState(null);
  const [quests, setQuests] = useState(null);
  const [questHistory, setQuestHistory] = useState([]);
  const [achievementsData, setAchievementsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const [purposeSetupOpen, setPurposeSetupOpen] = useState(false);
  const [journeyTelemetry, setJourneyTelemetry] = useState(null);

  // Stage 20 Adaptive Training Plan and Life System State
  const [planData, setPlanData] = useState(null);
  const [weekStatus, setWeekStatus] = useState(null);
  const [baselineData, setBaselineData] = useState(null);
  const [selfComparisonData, setSelfComparisonData] = useState(null);
  const [dailyRecommendation, setDailyRecommendation] = useState(null);
  const [loadAndBalance, setLoadAndBalance] = useState(null);
  const [lifeContext, setLifeContext] = useState(null);
  const [planBuilderOpen, setPlanBuilderOpen] = useState(false);
  const [weeklyReflectionOpen, setWeeklyReflectionOpen] = useState(false);
  const [currentWeeklyReflection, setCurrentWeeklyReflection] = useState(null);
  const [deepIntelligenceData, setDeepIntelligenceData] = useState(null);

  // Load real workouts, health metrics, ascension progression, personal records, quests, achievements, analytics, intelligence, purpose, journey, plan, and baseline
  const fetchDashboardData = async () => {
    try {
      const [
        workoutData, 
        healthData, 
        progressionData, 
        recordData, 
        questData, 
        questHistoryData,
        achievementRes,
        analyticsRes,
        intelligenceRes,
        purposeRes,
        journeyRes,
        planRes,
        weekStatusRes,
        baselineRes,
        recommendationRes,
        balanceRes,
        lifeCtxRes,
        currentWeeklyReflectionRes,
        deepIntelligenceRes
      ] = await Promise.all([
        getWorkouts().catch(() => ({ workouts: [] })),
        getHealthProfile().catch(() => ({ profile: null })),
        getProgression().catch(() => ({ progression: null })),
        getRecords().catch(() => ({ records: null })),
        getQuests().catch(() => ({ daily: [], weekly: [] })),
        getQuestHistory().catch(() => ({ history: [] })),
        getAchievements().catch(() => null),
        getAnalytics().catch(() => null),
        getFitnessIntelligence().catch(() => null),
        getPurpose().catch(() => null),
        getJourneyTelemetry().catch(() => null),
        getTrainingPlan().catch(() => null),
        getAdaptiveWeek().catch(() => null),
        getBaseline().catch(() => null),
        getDailyRecommendation().catch(() => null),
        getLoadAndBalance().catch(() => null),
        getLifeContext().catch(() => null),
        getCurrentWeeklyReflection().catch(() => null),
        getDeepIntelligence().catch(() => null),
      ]);

      setWorkouts(workoutData.workouts || []);
      if (healthData && healthData.profile) {
        setHealthProfile(healthData.profile);
      }
      if (progressionData && progressionData.progression) {
        setProgression(progressionData.progression);
      }
      if (recordData && recordData.records) {
        setRecords(recordData.records);
      }
      if (questData) {
        setQuests(questData);
      }
      if (questHistoryData && questHistoryData.history) {
        setQuestHistory(questHistoryData.history);
      }
      if (achievementRes) {
        setAchievementsData(achievementRes);
      }
      if (analyticsRes && analyticsRes.analytics) {
        setAnalyticsData(analyticsRes.analytics);
      }
      if (intelligenceRes && intelligenceRes.intelligence) {
        setIntelligenceData(intelligenceRes.intelligence);
      }
      if (purposeRes && purposeRes.purpose) {
        setPurpose(purposeRes.purpose);
      }
      if (journeyRes && journeyRes.telemetry) {
        setJourneyTelemetry(journeyRes.telemetry);
      }
      if (planRes && planRes.plan) {
        setPlanData(planRes.plan);
      }
      if (weekStatusRes && weekStatusRes.weekStatus) {
        setWeekStatus(weekStatusRes.weekStatus);
      } else if (planRes && planRes.weekStatus) {
        setWeekStatus(planRes.weekStatus);
      }
      if (baselineRes) {
        if (baselineRes.baseline) setBaselineData(baselineRes.baseline);
        if (baselineRes.selfComparison) setSelfComparisonData(baselineRes.selfComparison);
      }
      if (recommendationRes && recommendationRes.recommendation) {
        setDailyRecommendation(recommendationRes.recommendation);
      }
      if (balanceRes) {
        setLoadAndBalance(balanceRes);
      }
      if (lifeCtxRes && lifeCtxRes.lifeContext) {
        setLifeContext(lifeCtxRes.lifeContext);
      }
      if (currentWeeklyReflectionRes && currentWeeklyReflectionRes.reflection) {
        setCurrentWeeklyReflection(currentWeeklyReflectionRes.reflection);
      }
      if (deepIntelligenceRes && deepIntelligenceRes.intelligence) {
        setDeepIntelligenceData(deepIntelligenceRes.intelligence);
      }
    } catch (err) {
      console.warn('Failed to load dashboard metrics', err.message);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalWorkouts = progression?.totalWorkouts ?? workouts.length;
  const totalMinutes = progression?.totalDurationMinutes ?? workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalCalories = progression?.totalCaloriesBurned ?? workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const latestBMI = healthProfile?.latestBMI;
  const latestCalories = healthProfile?.latestCalories;

  return (
    <div className="min-h-screen bg-void text-offwhite flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Structural Texture Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_0%,rgba(48,54,61,0.25)_0%,transparent_75%)]" />

      {/* Top HUD Navigation Bar */}
      <header className="border-b border-steel/50 bg-void/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-sm bg-charcoal border border-steel flex items-center justify-center text-crimson group-hover:border-crimson transition-colors">
                <span className="font-orbitron font-black text-sm text-bone">F</span>
              </div>
              <div>
                <span className="font-orbitron font-black text-base tracking-wider text-offwhite group-hover:text-bone transition-colors">
                  F-TRACK
                </span>
                <span className="text-[9px] block font-mono tracking-widest text-ash uppercase">
                  OPERATIONAL DASHBOARD
                </span>
              </div>
            </Link>
          </div>

          {/* Right User HUD & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/workouts" className="hidden sm:inline-block">
              <AnimeButton variant="outline" size="sm" icon={Dumbbell}>
                WORKOUTS
              </AnimeButton>
            </Link>

            <Link to="/body-analysis" className="hidden sm:inline-block">
              <AnimeButton variant="outline" size="sm" icon={Scale}>
                BODY SCAN
              </AnimeButton>
            </Link>

            <Link to="/intelligence" className="hidden sm:inline-block">
              <AnimeButton variant="outline" size="sm" icon={Brain}>
                INTELLIGENCE
              </AnimeButton>
            </Link>

            <Link to="/profile" className="hidden sm:inline-block">
              <AnimeButton variant="outline" size="sm" icon={User}>
                PROFILE
              </AnimeButton>
            </Link>

            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-charcoal border border-steel/60 hover:border-steel text-xs font-mono transition-colors"
              title="View Athlete Profile & Stats"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
              <span className="text-bone font-medium">{user?.name || 'Athlete'}</span>
              <span className="text-[10px] font-orbitron font-bold px-1.5 py-0.5 rounded-sm bg-gunmetal text-offwhite border border-steel/60">
                RANK {progression?.rank || 'E'}
              </span>
            </Link>

            <NotificationBell />

            <AnimeButton
              variant="crimson"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
            >
              LOGOUT
            </AnimeButton>
          </div>
        </div>
      </header>

      {/* Main Chamber Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8 relative z-10">

        {/* ══════════════════════════════════════════════════════════
            STAGE 6 — ASCENSION ENGINE HUD (TOP COMMAND TELEMETRY)
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-steel/60 pb-2.5 gap-2">
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite flex items-center gap-2 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              ASCENSION PROGRESSION STATUS
            </h3>
            <div className="flex flex-col sm:items-end gap-0.5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-ash font-bold">
                  CURRENT STREAK: <span className="text-bone">{progression?.currentStreak || 0}D</span>
                </span>
                <span className="text-steel-600">•</span>
                <span className="text-ash">
                  LONGEST: <span className="text-bone">{progression?.longestStreak || progression?.currentStreak || 0}D</span>
                </span>
                <span className="text-steel-600">•</span>
                <span className="text-ash">
                  TOTAL JOURNEY: <span className="text-bone">{totalWorkouts} SESSIONS</span>
                </span>
              </div>
              <span className="text-[10px] font-sans text-ash-400 italic">
                A missed day does not erase the journey.
              </span>
            </div>
          </div>

          <AscensionHUD progression={progression} />
        </section>

        {/* Operational Command Banner & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg p-6 sm:p-8 bg-charcoal border border-steel shadow-steel-card relative overflow-hidden"
        >
          {/* Subtle Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-crimson via-steel to-crimson/40" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-steel/80 bg-gunmetal/60 text-ash text-[10px] font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                <span>TELEMETRY SYNCHRONIZED • SYSTEM OPERATIONAL</span>
              </div>

              <h1 className="font-orbitron text-2xl sm:text-4xl font-black tracking-tight text-offwhite uppercase">
                ATHLETE{' '}
                <span className="text-crimson-muted font-black">
                  {user?.name || 'TRAINEE'}
                </span>
              </h1>

              <p className="text-ash text-xs sm:text-sm font-sans max-w-xl leading-relaxed">
                Terminal authorization synchronized. Workouts, Progression Engine, 
                Metabolic Telemetry, and Personal Records are operational. Build consistent daily habits.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <AnimeButton
                  variant="crimson"
                  size="md"
                  icon={Zap}
                  onClick={() => navigate('/workouts')}
                >
                  LOG WORKOUT
                </AnimeButton>

                <AnimeButton
                  variant="outline"
                  size="md"
                  icon={Scale}
                  onClick={() => navigate('/body-analysis')}
                >
                  BODY METRICS
                </AnimeButton>
              </div>
            </div>

            {/* Operator Identity Dossier Emblem */}
            <Link
              to="/profile"
              className="flex items-center gap-4 p-4 rounded-sm bg-obsidian border border-steel hover:border-steel-light transition-all cursor-pointer group shadow-steel-card"
              title="Open Identity Record / Profile"
            >
              <div className="w-14 h-14 rounded-sm bg-gunmetal border border-steel flex items-center justify-center text-offwhite font-orbitron font-black text-2xl group-hover:border-crimson transition-colors">
                {progression?.rank || 'E'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-orbitron font-bold text-xs text-bone group-hover:text-offwhite transition-colors">IDENTITY RECORD</span>
                  <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-orbitron font-bold bg-gunmetal text-ash border border-steel/60">
                    TIER {progression?.rank || 'E'}
                  </span>
                </div>
                <span className="text-xs text-ash font-mono block">
                  LEVEL {String(progression?.level || 1).padStart(2, '0')} • {progression?.rankTitle || 'INITIATE'}
                </span>
                <span className="text-[10px] text-bone font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson" /> TELEMETRY SYNCHRONIZED
                </span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            STAGE 19 & 20 — PURPOSE & ADAPTIVE LIFE SYSTEM
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          {/* 1. User Purpose Anchor */}
          <PurposeCard
            purpose={purpose}
            onEditPurpose={() => setPurposeSetupOpen(true)}
          />

          {/* 2. Today's Adaptive Recommendation */}
          {dailyRecommendation ? (
            <AdaptiveRecommendation
              recommendation={dailyRecommendation}
              onStartWorkout={(plan) => navigate('/workouts', { state: { quickPlan: plan } })}
              onOpenAvailability={() => {
                const el = document.getElementById('availability-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onRecordRest={() => {}}
            />
          ) : journeyTelemetry?.todayFocus ? (
            <TodayFocus
              todayFocus={journeyTelemetry.todayFocus}
              onStartWorkout={(plan) => navigate('/workouts', { state: { quickPlan: plan } })}
              onApplyPlan={(plan) => navigate('/workouts', { state: { quickPlan: plan } })}
            />
          ) : null}

          {/* 3. Availability & Life Load Context Selectors */}
          <div id="availability-section" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard glow="none" className="p-4 sm:p-5 border-steel-700 bg-charcoal-900 shadow-steel-card">
              <AvailabilitySelector
                currentMinutes={lifeContext?.todayAvailableMinutes || 25}
                onAvailabilityChanged={fetchDashboardData}
              />
            </GlassCard>
            <GlassCard glow="none" className="p-4 sm:p-5 border-steel-700 bg-charcoal-900 shadow-steel-card">
              <LifeLoadSelector
                currentLoad={lifeContext?.lifeLoad || 'NORMAL'}
                onLoadChanged={fetchDashboardData}
              />
            </GlassCard>
          </div>

          {/* 4. Compassionate Re-entry Card if returning after 3+ days away */}
          {journeyTelemetry?.returnStatus?.needsReturnCard && (
            <ReturnJourneyCard
              returnStatus={journeyTelemetry.returnStatus}
              onStartWorkout={(plan) => navigate('/workouts', { state: { quickPlan: plan } })}
            />
          )}

          {/* 5. Adaptive Week Card */}
          <AdaptiveWeekCard
            weekStatus={weekStatus}
            onOpenReflection={() => setWeeklyReflectionOpen(true)}
            onOpenPlanBuilder={() => setPlanBuilderOpen(true)}
            onStartWorkout={(plan) => navigate('/workouts', { state: { quickPlan: plan } })}
          />

          {/* 6. Sustainable Goal Adjustment Suggestion if detected */}
          {journeyTelemetry?.goalAdjustment && (
            <GoalAdjustmentSuggestion
              goalAdjustment={journeyTelemetry.goalAdjustment}
              onAdjustSuccess={fetchDashboardData}
            />
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 16 — TODAY'S TELEMETRY HUD
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <TodayTelemetry 
            workouts={workouts} 
            progression={progression} 
            quests={quests} 
          />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 7 — PERSONAL RECORD MATRIX
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <PersonalRecordMatrix records={records} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 10 — ANALYTICS & PROGRESS INTELLIGENCE
        ══════════════════════════════════════════════════════════ */}
        <AnalyticsDashboard analyticsData={analyticsData} onRefresh={fetchDashboardData} />

        {/* ══════════════════════════════════════════════════════════
            STAGE 12 — PERSONAL FITNESS INTELLIGENCE & SMART INSIGHTS
        ══════════════════════════════════════════════════════════ */}
        <FitnessIntelligence intelligenceData={intelligenceData} onRefresh={fetchDashboardData} />

        {/* ══════════════════════════════════════════════════════════
            STAGE 13 — PERSONAL GOALS & MISSION PLANNING SYSTEM
        ══════════════════════════════════════════════════════════ */}
        <GoalBoard onDashboardSync={fetchDashboardData} />

        {/* ══════════════════════════════════════════════════════════
            STAGE 20 — ADAPTIVE TRAINING PLAN & ARCHITECTURE
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <TrainingPlanCard 
            plan={planData} 
            onOpenBuilder={() => setPlanBuilderOpen(true)} 
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PersonalBaselineCard baseline={baselineData} />
            <SelfComparison comparison={selfComparisonData} />
          </div>
          <LoadCheckCard
            loadCheck={loadAndBalance?.loadCheck}
            activityBalance={loadAndBalance?.activityBalance}
          />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 8 — QUEST SYSTEM (DAILY & WEEKLY MISSIONS)
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <QuestBoard quests={quests} history={questHistory} onRefresh={fetchDashboardData} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 9 — ACHIEVEMENT MATRIX & HUNTER BADGES
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <AchievementShowcase achievementsData={achievementsData} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 7 — PROGRESSION & RECORD HISTORY
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <RecentActivity events={progression?.events || []} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 21 — DEEP PERSONAL INTELLIGENCE
        ══════════════════════════════════════════════════════════ */}
        <DeepIntelligenceDashboard intelligenceData={deepIntelligenceData} />

        {/* ══════════════════════════════════════════════════════════
            STAGE 19 — LONG-TERM GROWTH & JOURNEY TIMELINE
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <GrowthSummary
            growthSummary={journeyTelemetry?.growthSummary}
            habitPatterns={journeyTelemetry?.habitPatterns}
            plateauAnalysis={journeyTelemetry?.plateauAnalysis}
          />
          <JourneyTimeline
            milestones={journeyTelemetry?.milestones || []}
          />
        </section>

        {/* ══════════════════════════════════════════════════════════
            BODY ANALYSIS & CALORIE CORE DASHBOARD CARD
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite flex items-center gap-2 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              BODY ANALYSIS & METABOLIC MATRIX
            </h3>
            <Link
              to="/body-analysis"
              className="text-xs font-mono text-ash hover:text-offwhite flex items-center gap-1 transition-colors"
            >
              <span>OPEN BODY ANALYSIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BMI Card */}
            <GlassCard glow="none" className="p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-orbitron font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-steel-light" />
                    BODY MASS INDEX (BMI)
                  </span>
                  <span className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded-sm border ${
                    latestBMI ? 'bg-charcoal border-steel text-offwhite' : 'bg-charcoal border-steel/60 text-ash'
                  }`}>
                    {latestBMI ? latestBMI.category.toUpperCase() : 'PENDING SCAN'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="font-orbitron font-black text-4xl text-bone">
                    {latestBMI ? latestBMI.bmi : '--.-'}
                  </p>
                  <span className="text-xs font-mono text-ash">kg / m²</span>
                </div>

                <p className="text-xs text-ash font-sans line-clamp-2 leading-relaxed">
                  {latestBMI
                    ? latestBMI.explanation
                    : 'Scan height and weight in Body Analysis to compute your BMI category and biometric tier placement.'}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-steel/50 flex items-center justify-between text-xs font-mono">
                <span className="text-ash">
                  {latestBMI ? `${latestBMI.heightCm} cm • ${latestBMI.weightKg} kg` : 'Standard adult classification'}
                </span>
                <Link to="/body-analysis" className="text-offwhite font-orbitron hover:text-crimson-muted flex items-center gap-1 text-[11px] transition-colors">
                  <span>RE-SCAN</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Calorie Core Card */}
            <GlassCard glow="none" className="p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-orbitron font-bold tracking-wider text-ash uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-crimson" />
                    CALORIE CORE ENGINE
                  </span>
                  <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded-sm border bg-charcoal border-crimson/40 text-bone">
                    {latestCalories ? `${latestCalories.activityLevel.toUpperCase()}` : 'CALORIE LOCK PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-1">
                  <div>
                    <span className="text-[10px] font-mono text-ash block">BMR (RESTING)</span>
                    <p className="font-orbitron font-black text-2xl text-offwhite">
                      {latestCalories ? `${latestCalories.bmr.toLocaleString()}` : '----'}
                      <span className="text-[10px] font-normal text-ash ml-1">KCAL</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-ash block">MAINTENANCE (TDEE)</span>
                    <p className="font-orbitron font-black text-2xl text-bone">
                      {latestCalories ? `${latestCalories.tdee.toLocaleString()}` : '----'}
                      <span className="text-[10px] font-normal text-ash ml-1">KCAL</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-ash font-sans line-clamp-2 leading-relaxed">
                  {latestCalories
                    ? `Estimated energy maintenance based on Mifflin-St Jeor equation at ${latestCalories.activityMultiplier}x activity factor.`
                    : 'Configure age, sex, and activity tier in Body Analysis to compute metabolic requirements.'}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-steel/50 flex items-center justify-between text-xs font-mono">
                <span className="text-ash">
                  {latestCalories ? `Sex: ${latestCalories.sex} • Age: ${latestCalories.age}` : 'Mifflin-St Jeor Equation'}
                </span>
                <Link to="/body-analysis" className="text-offwhite font-orbitron hover:text-crimson-muted flex items-center gap-1 text-[11px] transition-colors">
                  <span>RECALCULATE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Biometric Energy Gauges */}
        <GlassCard glow="none" className="space-y-5">
          <div className="flex items-center justify-between border-b border-steel/50 pb-3">
            <h3 className="font-orbitron font-bold text-xs sm:text-sm text-offwhite tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              BIOMETRIC INSTRUMENTATION GAUGES
            </h3>
            <span className="text-[11px] font-mono text-ash font-bold">SYSTEM TELEMETRY</span>
          </div>

          <div className="space-y-4">
            <EnergyBar
              label={`LEVEL ${String(progression?.level || 1).padStart(2, '0')} PROGRESSION XP`}
              current={progression?.currentLevelXP ?? 0}
              max={progression?.nextLevelXPRequired ?? 100}
              color="crimson"
              unit="XP"
            />
            <EnergyBar label="STAMINA & VITALITY (ENERGY)" current={100} max={100} color="steel" unit="%" />
            <EnergyBar label="TRAINING CAPACITY (HP)" current={1000} max={1000} color="crimson" unit="HP" />
          </div>
        </GlassCard>

      </main>

      {/* Stage 19 Purpose Setup Modal */}
      <PurposeSetup
        isOpen={purposeSetupOpen}
        onClose={() => setPurposeSetupOpen(false)}
        currentPurpose={purpose}
        onSaved={async (data) => {
          await savePurpose(data);
          await fetchDashboardData();
        }}
      />

      {/* Stage 20 Training Plan Builder Modal */}
      <TrainingPlanBuilder
        isOpen={planBuilderOpen}
        onClose={() => setPlanBuilderOpen(false)}
        currentPlan={planData}
        onPlanSaved={async () => {
          await fetchDashboardData();
        }}
      />

      {/* Stage 20 Weekly Reflection Modal */}
      <WeeklyReflectionModal
        isOpen={weeklyReflectionOpen}
        onClose={() => setWeeklyReflectionOpen(false)}
        currentReflection={currentWeeklyReflection}
        weekStatus={weekStatus}
        onReflectionSaved={async () => {
          await fetchDashboardData();
        }}
      />

      {/* Footer */}
      <footer className="border-t border-steel/50 bg-charcoal/80 py-4 text-center text-xs text-ash font-mono">
        <span>F-TRACK: FITNESS ASCENSION • STAGE 21 DEEP PERSONAL INTELLIGENCE & ADAPTIVE ARCHITECTURE</span>
      </footer>
    </div>
  );
};

export default Dashboard;
