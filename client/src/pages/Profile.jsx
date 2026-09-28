import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Zap, 
  Flame, 
  Trophy, 
  Calendar, 
  Mail, 
  Clock, 
  Dumbbell, 
  Award, 
  LogOut, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ArrowLeft,
  Scale,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProgression } from '../services/progressionService';
import { getWorkouts } from '../services/workoutService';
import { getRecords } from '../services/recordService';
import { getAchievements } from '../services/achievementService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/ui/GlassCard';
import AnimeButton from '../components/ui/AnimeButton';
import EnergyBar from '../components/ui/EnergyBar';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [progression, setProgression] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [records, setRecords] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [progRes, workoutsRes, recordsRes, achieveRes] = await Promise.all([
          getProgression().catch(() => ({ progression: null })),
          getWorkouts().catch(() => ({ workouts: [] })),
          getRecords().catch(() => ({ records: null })),
          getAchievements().catch(() => null),
        ]);

        if (progRes?.progression) setProgression(progRes.progression);
        setWorkouts(workoutsRes?.workouts || []);
        if (recordsRes?.records) setRecords(recordsRes.records);
        if (achieveRes) setAchievements(achieveRes);
      } catch (err) {
        console.warn('Failed to load profile telemetry', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe formatting of registration date
  const registeredDateFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'System Pioneer Cycle';

  // Derived telemetry metrics
  const totalWorkouts = progression?.totalWorkouts ?? workouts.length;
  const totalMinutes = progression?.totalDurationMinutes ?? workouts.reduce((acc, w) => acc + (Number(w.duration) || 0), 0);
  const totalCalories = progression?.totalCaloriesBurned ?? workouts.reduce((acc, w) => acc + (Number(w.caloriesBurned) || 0), 0);
  const currentStreak = progression?.currentStreak || 0;
  const longestStreak = progression?.longestStreak || currentStreak;
  const totalXP = progression?.xp || 0;
  const currentLevel = progression?.level || 1;
  const rank = progression?.rank || 'E';
  const rankTitle = progression?.rankTitle || 'AWAKENING';
  const currentLevelXP = progression?.currentLevelXP || 0;
  const nextLevelXP = progression?.nextLevelXPRequired || 100;
  const unlockedBadgesCount = achievements?.stats?.unlockedCount ?? (achievements?.achievements?.filter(a => a.unlocked).length || 0);

  return (
    <div className="min-h-screen bg-void text-slate-100 architectural-grid flex flex-col justify-between relative overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Profile / Dossier Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex-1 space-y-8 relative z-10">
        
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex items-center justify-between border-b border-steel/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-orbitron text-ash hover:text-bone transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO DASHBOARD</span>
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-steel/60 bg-charcoal text-ash text-[11px] font-orbitron font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-crimson-bright" />
            <span>F-TRACK IDENTITY RECORD • SECURE TELEMETRY</span>
          </div>
        </div>

        {/* Hero Hunter Identity Dossier Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl p-6 sm:p-8 bg-obsidian border border-steel/60 shadow-steel-card relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Identity & Rank Emblem */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-charcoal border-2 border-steel flex items-center justify-center text-bone shadow-steel-card">
                  <span className="font-orbitron font-black text-4xl sm:text-5xl text-bone">
                    {rank}
                  </span>
                </div>
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-void border border-steel/60 text-ash shadow-sm">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-orbitron text-2xl sm:text-4xl font-black text-bone uppercase tracking-tight">
                    {user?.name || 'ATHLETE'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded text-xs font-orbitron font-bold bg-charcoal text-bone border border-steel/60">
                    DESIGNATION {rank} • {rankTitle}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ash">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-steel" />
                    {user?.email || 'athlete@example.com'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-steel" />
                    Member Since: {registeredDateFormatted}
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-steel-light flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson-bright" />
                    STATUS: LEVEL {currentLevel} ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-end">
              <Link to="/workouts">
                <AnimeButton variant="outline" size="sm" icon={Dumbbell}>
                  WORKOUTS
                </AnimeButton>
              </Link>
              <Link to="/body-analysis">
                <AnimeButton variant="outline" size="sm" icon={Scale}>
                  BODY SCAN
                </AnimeButton>
              </Link>
              <AnimeButton
                variant="crimson"
                size="sm"
                icon={LogOut}
                onClick={() => setShowLogoutConfirm(true)}
              >
                SIGN OUT
              </AnimeButton>
            </div>

          </div>
        </motion.div>

        {/* Ascension Progression Matrix Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-steel/40 pb-2">
            <h2 className="font-orbitron font-bold text-base text-bone flex items-center gap-2">
              <Zap className="w-4 h-4 text-crimson-bright" />
              ASCENSION PROGRESSION STATUS
            </h2>
            <span className="text-xs font-mono text-ash">
              TOTAL ACCUMULATED XP: {totalXP.toLocaleString()} XP
            </span>
          </div>

          <GlassCard glow="none" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-[10px] font-orbitron font-bold text-ash uppercase">CURRENT LEVEL</span>
                <p className="font-orbitron font-black text-3xl text-bone">
                  LEVEL {String(currentLevel).padStart(2, '0')}
                </p>
                <p className="text-[11px] font-mono text-ash">
                  Tier: {rankTitle}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-[10px] font-orbitron font-bold text-ash uppercase">TIER XP METRIC</span>
                <p className="font-orbitron font-black text-3xl text-bone">
                  {currentLevelXP} / {nextLevelXP}
                </p>
                <p className="text-[11px] font-mono text-ash">
                  XP to Next Level: {Math.max(0, nextLevelXP - currentLevelXP)} XP
                </p>
              </div>

              <div className="p-4 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-[10px] font-orbitron font-bold text-ash uppercase">DISCIPLINE STREAK</span>
                <p className="font-orbitron font-black text-3xl text-brass flex items-center gap-2">
                  <Flame className="w-6 h-6 text-brass" />
                  {currentStreak} DAYS
                </p>
                <p className="text-[11px] font-mono text-ash">
                  All-Time Record: {longestStreak} Days
                </p>
              </div>
            </div>

            {/* Visual Level XP Bar */}
            <div className="space-y-2 pt-2">
              <EnergyBar
                label={`LEVEL ${String(currentLevel).padStart(2, '0')} ASCENSION XP`}
                current={currentLevelXP}
                max={nextLevelXP}
                color="steel"
                unit="XP"
              />
            </div>
          </GlassCard>
        </section>

        {/* Lifetime Telemetry & Performance Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-steel/40 pb-2">
            <h2 className="font-orbitron font-bold text-base text-bone flex items-center gap-2">
              <Activity className="w-4 h-4 text-steel-light" />
              LIFETIME TRAINING TELEMETRY
            </h2>
            <span className="text-xs font-mono text-ash">
              AUDITED FROM REAL TRAINING SESSIONS
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Workouts */}
            <GlassCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-ash">
                <span className="text-[10px] font-orbitron font-bold uppercase">TOTAL SESSIONS</span>
                <Dumbbell className="w-4 h-4 text-steel-light" />
              </div>
              <p className="font-orbitron font-black text-3xl text-bone">
                {totalWorkouts}
              </p>
              <p className="text-xs font-sans text-ash">
                Completed workouts logged in database
              </p>
            </GlassCard>

            {/* Total Minutes */}
            <GlassCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-ash">
                <span className="text-[10px] font-orbitron font-bold uppercase">ACTIVE TRAINING</span>
                <Clock className="w-4 h-4 text-steel-light" />
              </div>
              <p className="font-orbitron font-black text-3xl text-bone">
                {totalMinutes.toLocaleString()}
                <span className="text-xs font-normal text-ash ml-1">MIN</span>
              </p>
              <p className="text-xs font-sans text-ash">
                Total training duration accumulated
              </p>
            </GlassCard>

            {/* Total Calories */}
            <GlassCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-ash">
                <span className="text-[10px] font-orbitron font-bold uppercase">CALORIES EXERTED</span>
                <Flame className="w-4 h-4 text-crimson-bright" />
              </div>
              <p className="font-orbitron font-black text-3xl text-crimson-bright">
                {totalCalories.toLocaleString()}
                <span className="text-xs font-normal text-ash ml-1">KCAL</span>
              </p>
              <p className="text-xs font-sans text-ash">
                Metabolic energy expended
              </p>
            </GlassCard>

            {/* Badges & Accolades */}
            <GlassCard className="p-5 space-y-2">
              <div className="flex items-center justify-between text-ash">
                <span className="text-[10px] font-orbitron font-bold uppercase">BADGES UNLOCKED</span>
                <Trophy className="w-4 h-4 text-brass" />
              </div>
              <p className="font-orbitron font-black text-3xl text-brass">
                {unlockedBadgesCount}
              </p>
              <p className="text-xs font-sans text-ash">
                Milestones & forged achievements
              </p>
            </GlassCard>
          </div>
        </section>

        {/* System Architecture & Security Telemetry Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-steel/40 pb-2">
            <h2 className="font-orbitron font-bold text-base text-bone flex items-center gap-2">
              <Shield className="w-4 h-4 text-steel-light" />
              SYSTEM TELEMETRY & SPECIFICATIONS
            </h2>
            <span className="text-xs font-mono text-ash">
              SECURE PROTOCOL v1.0.0
            </span>
          </div>

          <GlassCard className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-ash block text-[10px] uppercase font-orbitron">SYSTEM VERSION</span>
                <span className="text-bone font-bold">F-TRACK: FITNESS ASCENSION v1.0.0</span>
              </div>
              <div className="p-3 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-ash block text-[10px] uppercase font-orbitron">CORE ARCHITECTURE</span>
                <span className="text-bone">React 18 + Vite + Tailwind + Express</span>
              </div>
              <div className="p-3 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-ash block text-[10px] uppercase font-orbitron">STORAGE SUBSYSTEM</span>
                <span className="text-steel-light font-bold">Local devStore Active (Atlas Ready)</span>
              </div>
              <div className="p-3 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-ash block text-[10px] uppercase font-orbitron">AUTH SECURITY</span>
                <span className="text-bone">JWT Bearer Token • Bcrypt Hash</span>
              </div>
              <div className="p-3 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-ash block text-[10px] uppercase font-orbitron">DATA INTEGRITY</span>
                <span className="text-bone">User Isolated • Real Telemetry Calculations</span>
              </div>
              <div className="p-3 rounded-lg bg-void border border-steel/40 space-y-1">
                <span className="text-ash block text-[10px] uppercase font-orbitron">CHAMBER STATUS</span>
                <span className="text-emerald-400 font-bold">FULLY OPERATIONAL</span>
              </div>
            </div>
          </GlassCard>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-obsidian border border-crimson/50 rounded-xl p-6 shadow-steel-card space-y-5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-crimson" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-crimson/15 border border-crimson/40 flex items-center justify-center text-crimson-bright shadow-steel-card">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron font-black text-lg text-bone uppercase">
                    CONFIRM SIGN OUT
                  </h3>
                  <p className="text-xs font-sans text-ash">
                    Are you sure you want to sign out?
                  </p>
                </div>
              </div>

              <p className="text-xs font-mono text-ash bg-void p-3 rounded-lg border border-steel/40">
                Your progression, workout logs, and personal records are securely saved. You can sign in anytime.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-steel/40">
                <AnimeButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  CANCEL
                </AnimeButton>
                <AnimeButton
                  variant="crimson"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                >
                  SIGN OUT
                </AnimeButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
