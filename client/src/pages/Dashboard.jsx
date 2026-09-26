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
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/workoutService';
import { getHealthProfile } from '../services/healthService';
import { getProgression } from '../services/progressionService';
import { getRecords } from '../services/recordService';
import AscensionHUD from '../components/progression/AscensionHUD';
import PersonalRecordMatrix from '../components/progression/PersonalRecordMatrix';
import RecentActivity from '../components/progression/RecentActivity';
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

  // Load real workouts, health metrics, ascension progression, and personal records
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [workoutData, healthData, progressionData, recordData] = await Promise.all([
          getWorkouts().catch(() => ({ workouts: [] })),
          getHealthProfile().catch(() => ({ profile: null })),
          getProgression().catch(() => ({ progression: null })),
          getRecords().catch(() => ({ records: null })),
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
      } catch (err) {
        console.warn('Failed to load dashboard metrics', err.message);
      } finally {
        setLoadingDashboard(false);
      }
    };

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
    <div className="min-h-screen bg-void text-slate-100 cyber-grid flex flex-col justify-between relative overflow-hidden">
      {/* Background Energy Spheres */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-neon/15 via-cyan-neon/10 to-transparent rounded-full blur-3xl opacity-70 animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-crimson-aura/10 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Top HUD Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-void/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-violet-neon to-cyan-neon p-0.5 shadow-glow-cyan">
                <div className="w-full h-full bg-void flex items-center justify-center rounded-sm">
                  <Zap className="w-4 h-4 text-cyan-neon animate-pulse" />
                </div>
              </div>
              <div>
                <span className="font-orbitron font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-neon via-white to-violet-glow bg-clip-text text-transparent">
                  F-TRACK
                </span>
                <span className="text-[9px] block font-orbitron tracking-widest text-violet-glow uppercase">
                  Ascension Chamber
                </span>
              </div>
            </Link>
          </div>

          {/* Right User HUD & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/workouts" className="hidden sm:inline-block">
              <AnimeButton variant="cyan" size="sm" icon={Dumbbell}>
                QUESTS
              </AnimeButton>
            </Link>

            <Link to="/body-analysis" className="hidden sm:inline-block">
              <AnimeButton variant="outline" size="sm" icon={Scale}>
                BODY SCAN
              </AnimeButton>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-matrix-neon animate-pulse" />
              <span className="text-slate-300 font-sans font-semibold">{user?.name || 'Warrior'}</span>
              <span className="text-[10px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-neon border border-slate-700">
                RANK {progression?.rank || 'E'}
              </span>
            </div>

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
        
        {/* Chamber Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-6 sm:p-8 bg-obsidian/85 border border-violet-neon/30 backdrop-blur-xl shadow-glow-violet relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-neon/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon text-xs font-orbitron font-bold tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHAMBER PROTOCOL ACTIVE • STAGE 7 RECORD MATRIX ONLINE</span>
              </div>

              <h1 className="font-orbitron text-2xl sm:text-4xl font-black tracking-tight text-slate-100 uppercase">
                WELCOME, HUNTER{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-cyan">
                  {user?.name || 'WARRIOR'}
                </span>
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-xl">
                Your portal authorization is synchronized. Workout Quests, Ascension Progression Engine, 
                BMI Analysis, and Calorie Core engines are fully active. Log workouts to ascend tiers and extend your streak.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <AnimeButton
                  variant="cyan"
                  size="md"
                  icon={Zap}
                  onClick={() => navigate('/workouts')}
                >
                  ⚡ START WORKOUT QUEST
                </AnimeButton>

                <AnimeButton
                  variant="violet"
                  size="md"
                  icon={Scale}
                  onClick={() => navigate('/body-analysis')}
                >
                  OPEN BODY ANALYSIS
                </AnimeButton>
              </div>
            </div>

            {/* Hunter Identity Badge */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-void/90 border border-slate-800">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-violet-dark to-cyan-dark border border-violet-neon flex items-center justify-center text-white font-orbitron font-black text-2xl shadow-glow-violet">
                {progression?.rank || 'E'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-orbitron font-bold text-sm text-slate-200">HUNTER LICENSE</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-orbitron font-bold bg-slate-800 text-cyan-neon border border-slate-700">
                    RANK: {progression?.rank || 'E'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono block">
                  LEVEL: {String(progression?.level || 1).padStart(2, '0')} • {progression?.rankTitle || 'AWAKENING'}
                </span>
                <span className="text-[10px] text-matrix-neon font-mono flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-matrix-neon animate-pulse" /> ASCENSION MATRIX ACTIVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            STAGE 6 — ASCENSION ENGINE HUD
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-orbitron font-bold text-sm text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-neon" />
              ASCENSION PROGRESSION STATUS
            </h3>
            <span className="text-xs font-mono text-cyan-neon">
              {progression?.currentStreak || 0} DAY STREAK
            </span>
          </div>

          <AscensionHUD progression={progression} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 7 — PERSONAL RECORD MATRIX
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <PersonalRecordMatrix records={records} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            STAGE 7 — PROGRESSION & RECORD HISTORY
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <RecentActivity events={progression?.events || []} />
        </section>

        {/* ══════════════════════════════════════════════════════════
            BODY ANALYSIS & CALORIE CORE DASHBOARD CARD
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-orbitron font-bold text-sm text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-violet-glow" />
              BODY ANALYSIS & METABOLIC MATRIX
            </h3>
            <Link
              to="/body-analysis"
              className="text-xs font-orbitron text-violet-glow hover:underline flex items-center gap-1"
            >
              <span>OPEN BODY ANALYSIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BMI Card */}
            <GlassCard glow="violet" className="p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-neon" />
                    BODY MASS INDEX (BMI)
                  </span>
                  <span className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border ${
                    latestBMI ? 'bg-matrix-neon/10 border-matrix-neon/40 text-matrix-neon' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {latestBMI ? latestBMI.category.toUpperCase() : 'PENDING SCAN'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="font-orbitron font-black text-4xl text-cyan-neon">
                    {latestBMI ? latestBMI.bmi : '--.-'}
                  </p>
                  <span className="text-xs font-mono text-slate-500">kg / m²</span>
                </div>

                <p className="text-xs text-slate-400 font-sans line-clamp-2">
                  {latestBMI
                    ? latestBMI.explanation
                    : 'Scan your height and weight in Body Analysis to compute your BMI category and biometric scale placement.'}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {latestBMI ? `${latestBMI.heightCm} cm • ${latestBMI.weightKg} kg` : 'Standard adult classification'}
                </span>
                <Link to="/body-analysis" className="text-cyan-neon font-orbitron hover:underline flex items-center gap-1 text-[11px]">
                  <span>RE-SCAN</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>

            {/* Calorie Core Card */}
            <GlassCard glow="crimson" className="p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-crimson-aura" />
                    CALORIE CORE ENGINE
                  </span>
                  <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded border bg-crimson-aura/10 border-crimson-aura/40 text-crimson-aura">
                    {latestCalories ? `${latestCalories.activityLevel.toUpperCase()}` : 'CALORIE LOCK PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-1">
                  <div>
                    <span className="text-[10px] font-orbitron text-slate-400 block">BMR (RESTING)</span>
                    <p className="font-orbitron font-black text-2xl text-violet-glow">
                      {latestCalories ? `${latestCalories.bmr.toLocaleString()}` : '----'}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">KCAL</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-orbitron text-slate-400 block">MAINTENANCE (TDEE)</span>
                    <p className="font-orbitron font-black text-2xl text-crimson-aura">
                      {latestCalories ? `${latestCalories.tdee.toLocaleString()}` : '----'}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">KCAL</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans line-clamp-2">
                  {latestCalories
                    ? `Estimated energy maintenance based on Mifflin-St Jeor equation at ${latestCalories.activityMultiplier}x activity factor.`
                    : 'Configure your age, sex, and activity tier in Body Analysis to activate your daily metabolic requirements.'}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {latestCalories ? `Sex: ${latestCalories.sex} • Age: ${latestCalories.age}` : 'Mifflin-St Jeor Equation'}
                </span>
                <Link to="/body-analysis" className="text-crimson-aura font-orbitron hover:underline flex items-center gap-1 text-[11px]">
                  <span>RECALCULATE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Biometric Energy Gauges */}
        <GlassCard glow="violet" className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-orbitron font-bold text-sm text-slate-100 tracking-wider">
              BIOMETRIC ENERGY GAUGES
            </h3>
            <span className="text-[11px] font-mono text-cyan-neon">STAGE 6 SYNCHRONIZED</span>
          </div>

          <div className="space-y-4">
            <EnergyBar
              label={`LEVEL ${String(progression?.level || 1).padStart(2, '0')} ASCENSION XP`}
              current={progression?.currentLevelXP ?? 0}
              max={progression?.nextLevelXPRequired ?? 100}
              color="violet"
              unit="XP"
            />
            <EnergyBar label="STAMINA & VITALITY (ENERGY)" current={100} max={100} color="cyan" unit="%" />
            <EnergyBar label="TRAINING CAPACITY (HP)" current={1000} max={1000} color="crimson" unit="HP" />
          </div>
        </GlassCard>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-void/80 py-4 text-center text-xs text-slate-500 font-mono">
        <span>F-TRACK: FITNESS ASCENSION • STAGE 7 PERSONAL RECORD MATRIX ONLINE</span>
      </footer>
    </div>
  );
};

export default Dashboard;
