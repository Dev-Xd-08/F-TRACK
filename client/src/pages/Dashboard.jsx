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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../services/workoutService';
import AnimeButton from '../components/ui/AnimeButton';
import GlassCard from '../components/ui/GlassCard';
import EnergyBar from '../components/ui/EnergyBar';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

  // Load real workouts for summary stats
  useEffect(() => {
    const fetchUserWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data.workouts || []);
      } catch (err) {
        console.warn('Failed to load workouts for dashboard HUD', err.message);
      } finally {
        setLoadingWorkouts(false);
      }
    };

    fetchUserWorkouts();
  }, []);

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/workouts" className="hidden sm:inline-block">
              <AnimeButton variant="cyan" size="sm" icon={Dumbbell}>
                QUESTS
              </AnimeButton>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-matrix-neon animate-pulse" />
              <span className="text-slate-300 font-sans font-semibold">{user?.name || 'Warrior'}</span>
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
                <span>CHAMBER PROTOCOL ACTIVE • STAGE 4 READY</span>
              </div>

              <h1 className="font-orbitron text-2xl sm:text-4xl font-black tracking-tight text-slate-100 uppercase">
                WELCOME, HUNTER{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-cyan">
                  {user?.name || 'WARRIOR'}
                </span>
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-xl">
                Your portal authorization is synchronized. The Workout Quest System is online. 
                Log your training quests to increase duration and burn calories.
              </p>

              {/* Primary Action Button */}
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
                  variant="outline"
                  size="md"
                  icon={Dumbbell}
                  onClick={() => navigate('/workouts')}
                >
                  VIEW QUEST LOGS
                </AnimeButton>
              </div>
            </div>

            {/* Hunter Identity Badge */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-void/90 border border-slate-800">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-violet-dark to-cyan-dark border border-violet-neon flex items-center justify-center text-white font-orbitron font-black text-2xl shadow-glow-violet">
                E
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-orbitron font-bold text-sm text-slate-200">HUNTER LICENSE</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-orbitron font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    RANK: E
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono block">LEVEL: 01 • INITIATE</span>
                <span className="text-[10px] text-matrix-neon font-mono flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-matrix-neon animate-pulse" /> JWT VERIFIED
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Workout Quest Summary Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-orbitron font-bold text-sm text-slate-100 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-neon" />
              TRAINING QUEST SUMMARY
            </h3>
            <Link
              to="/workouts"
              className="text-xs font-orbitron text-cyan-neon hover:underline flex items-center gap-1"
            >
              <span>MANAGE QUESTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Summary Card 1: Completed Workouts */}
            <GlassCard glow="cyan" className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase">
                  WORKOUTS COMPLETED
                </span>
                <Dumbbell className="w-4 h-4 text-cyan-neon" />
              </div>
              <p className="font-orbitron text-3xl font-black text-cyan-neon">
                {totalWorkouts}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">LOGGED SESSIONS</p>
            </GlassCard>

            {/* Summary Card 2: Minutes Trained */}
            <GlassCard glow="violet" className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase">
                  MINUTES TRAINED
                </span>
                <Clock className="w-4 h-4 text-violet-glow" />
              </div>
              <p className="font-orbitron text-3xl font-black text-violet-glow">
                {totalMinutes} <span className="text-xs font-normal text-slate-400">MINS</span>
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">TOTAL TRAINING TIME</p>
            </GlassCard>

            {/* Summary Card 3: Calories Burned */}
            <GlassCard glow="crimson" className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-orbitron font-bold tracking-wider text-slate-400 uppercase">
                  CALORIES BURNED
                </span>
                <Flame className="w-4 h-4 text-crimson-aura" />
              </div>
              <p className="font-orbitron text-3xl font-black text-crimson-aura">
                {totalCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">KCAL</span>
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">ENERGY EXPENDITURE</p>
            </GlassCard>
          </div>
        </section>

        {/* Biometric Energy Gauges */}
        <GlassCard glow="violet" className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-orbitron font-bold text-sm text-slate-100 tracking-wider">
              BIOMETRIC ENERGY GAUGES
            </h3>
            <span className="text-[11px] font-mono text-cyan-neon">STAGE 4 SYNCHRONIZED</span>
          </div>

          <div className="space-y-4">
            <EnergyBar label="LEVEL 01 ASCENSION XP" current={totalWorkouts * 25} max={100} color="violet" unit="XP" />
            <EnergyBar label="STAMINA & VITALITY (ENERGY)" current={100} max={100} color="cyan" unit="%" />
            <EnergyBar label="TRAINING CAPACITY (HP)" current={1000} max={1000} color="crimson" unit="HP" />
          </div>
        </GlassCard>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-void/80 py-4 text-center text-xs text-slate-500 font-mono">
        <span>F-TRACK: FITNESS ASCENSION • WORKOUT QUEST SYSTEM ONLINE</span>
      </footer>
    </div>
  );
};

export default Dashboard;
