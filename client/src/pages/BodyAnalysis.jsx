import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Flame, 
  Zap, 
  Sparkles, 
  AlertCircle, 
  Scale, 
  User, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { calculateBMI, calculateCalories, getHealthProfile } from '../services/healthService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BMIScale from '../components/health/BMIScale';
import GlassCard from '../components/ui/GlassCard';
import AnimeButton from '../components/ui/AnimeButton';

const ACTIVITY_OPTIONS = [
  { value: 'Sedentary', label: 'Sedentary', sub: 'Little or no exercise' },
  { value: 'Lightly Active', label: 'Lightly Active', sub: 'Exercise 1–3 days/week' },
  { value: 'Moderately Active', label: 'Moderately Active', sub: 'Exercise 3–5 days/week' },
  { value: 'Very Active', label: 'Very Active', sub: 'Hard exercise 6–7 days/week' },
  { value: 'Extra Active', label: 'Extra Active', sub: 'Very hard training / physical job' },
];

export const BodyAnalysis = () => {
  // BMI Section State
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiLoading, setBmiLoading] = useState(false);
  const [bmiError, setBmiError] = useState('');

  // Calorie Core Section State
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [calHeightCm, setCalHeightCm] = useState('');
  const [calWeightKg, setCalWeightKg] = useState('');
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [calorieResult, setCalorieResult] = useState(null);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState('');

  // Initial load: Fetch existing saved calculations from current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getHealthProfile();
        if (response && response.profile) {
          if (response.profile.latestBMI) {
            setBmiResult(response.profile.latestBMI);
            setHeightCm(response.profile.latestBMI.heightCm?.toString() || '');
            setWeightKg(response.profile.latestBMI.weightKg?.toString() || '');
          }
          if (response.profile.latestCalories) {
            setCalorieResult(response.profile.latestCalories);
            setAge(response.profile.latestCalories.age?.toString() || '');
            setSex(response.profile.latestCalories.sex || 'male');
            setCalHeightCm(response.profile.latestCalories.heightCm?.toString() || '');
            setCalWeightKg(response.profile.latestCalories.weightKg?.toString() || '');
            setActivityLevel(response.profile.latestCalories.activityLevel || 'Moderately Active');
          }
        }
      } catch (err) {
        console.warn('[HEALTH PROFILE FETCH]', err.message);
      }
    };

    fetchProfile();
  }, []);

  // Handle BMI Calculation
  const handleScanBMI = async (e) => {
    e.preventDefault();
    setBmiError('');

    const h = Number(heightCm);
    const w = Number(weightKg);

    if (!heightCm || isNaN(h) || h < 30 || h > 300) {
      setBmiError('Enter a valid height between 30 cm and 300 cm.');
      return;
    }

    if (!weightKg || isNaN(w) || w < 10 || w > 500) {
      setBmiError('Enter a valid weight between 10 kg and 500 kg.');
      return;
    }

    setBmiLoading(true);
    try {
      const response = await calculateBMI(h, w);
      setBmiResult(response.data);
      // Auto pre-fill Calorie Core inputs if empty
      if (!calHeightCm) setCalHeightCm(h.toString());
      if (!calWeightKg) setCalWeightKg(w.toString());
    } catch (err) {
      setBmiError(err.message || 'Failed to scan body metrics.');
    } finally {
      setBmiLoading(false);
    }
  };

  // Quick Action: Sync BMI inputs to Calorie Core inputs
  const handleSyncToCalories = () => {
    if (heightCm) setCalHeightCm(heightCm);
    if (weightKg) setCalWeightKg(weightKg);
  };

  // Handle Calorie Core Calculation
  const handleActivateCalorieCore = async (e) => {
    e.preventDefault();
    setCalError('');

    const a = Number(age);
    const h = Number(calHeightCm);
    const w = Number(calWeightKg);

    if (!age || isNaN(a) || a < 1 || a > 120) {
      setCalError('Age must be between 1 and 120.');
      return;
    }

    if (!calHeightCm || isNaN(h) || h < 30 || h > 300) {
      setCalError('Enter a valid height between 30 cm and 300 cm.');
      return;
    }

    if (!calWeightKg || isNaN(w) || w < 10 || w > 500) {
      setCalError('Enter a valid weight between 10 kg and 500 kg.');
      return;
    }

    setCalLoading(true);
    try {
      const response = await calculateCalories({
        age: a,
        sex,
        heightCm: h,
        weightKg: w,
        activityLevel,
      });
      setCalorieResult(response.data);
    } catch (err) {
      setCalError(err.message || 'Failed to calculate calorie requirements.');
    } finally {
      setCalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-slate-100 cyber-grid flex flex-col justify-between relative overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Analysis Realm */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex-1 space-y-12 relative z-10">
        
        {/* Page Header */}
        <div className="space-y-2 border-b border-slate-800/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-neon/40 bg-violet-neon/10 text-violet-glow text-xs font-orbitron font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODULE 02 & 03 • BODY COMPOSITION & METABOLIC MATRIX</span>
          </div>

          <h1 className="font-orbitron text-3xl sm:text-5xl font-black tracking-tight text-slate-100 uppercase">
            BODY{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-white to-violet-glow text-glow-cyan">
              ANALYSIS
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
            Scan your current physical metrics. Calculate your Body Mass Index and activate your 
            Calorie Core engine to determine exact basal energy expenditure and daily maintenance requirements.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECTION A: BODY METRICS (BMI CORE)
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-wide">
                  SECTION A: BODY METRICS & BMI CORE
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Height and weight biometric assessment based on standard World Health thresholds.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-neon hidden sm:inline-block">
              STANDARD FORMULA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Panel (5 cols) */}
            <GlassCard glow="cyan" className="lg:col-span-5 space-y-6">
              <h3 className="font-orbitron font-bold text-sm text-slate-200 tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-neon" />
                BIOMETRIC SCANNER INPUT
              </h3>

              {/* BMI Error Alert */}
              {bmiError && (
                <div className="p-3 rounded-lg bg-crimson-aura/10 border border-crimson-aura/40 flex items-center gap-2 text-xs font-mono text-crimson-aura">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bmiError}</span>
                </div>
              )}

              <form onSubmit={handleScanBMI} className="space-y-4">
                {/* Height Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                    HEIGHT (CENTIMETERS)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    step="0.5"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g. 175"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors"
                  />
                </div>

                {/* Weight Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                    BODY WEIGHT (KILOGRAMS)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g. 70"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <AnimeButton
                    type="submit"
                    variant="cyan"
                    size="lg"
                    icon={Activity}
                    disabled={bmiLoading}
                    className="w-full"
                  >
                    {bmiLoading ? 'SCANNING BIOMETRICS...' : 'SCAN BODY'}
                  </AnimeButton>
                </div>
              </form>
            </GlassCard>

            {/* Results & Scale Panel (7 cols) */}
            <GlassCard glow="violet" className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-orbitron font-bold text-slate-300 tracking-wider">
                    SCAN RESULT TELEMETRY
                  </span>
                  {bmiResult && (
                    <span className="text-[10px] font-mono text-matrix-neon flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CALCULATION VERIFIED
                    </span>
                  )}
                </div>

                {/* Scores Display */}
                <div className="grid grid-cols-2 gap-4 my-6">
                  {/* BMI Score */}
                  <div className="p-4 rounded-xl bg-void/80 border border-slate-800">
                    <span className="text-[10px] font-orbitron font-bold text-slate-400 block mb-1">
                      BMI SCORE
                    </span>
                    <p className="font-orbitron font-black text-3xl sm:text-4xl text-cyan-neon">
                      {bmiResult ? bmiResult.bmi : '--.-'}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500">kg / m²</span>
                  </div>

                  {/* BMI Category */}
                  <div className="p-4 rounded-xl bg-void/80 border border-slate-800">
                    <span className="text-[10px] font-orbitron font-bold text-slate-400 block mb-1">
                      BMI CATEGORY
                    </span>
                    <p className={`font-orbitron font-black text-xl sm:text-2xl ${
                      bmiResult?.category === 'Underweight' ? 'text-cyan-neon' :
                      bmiResult?.category === 'Normal' ? 'text-matrix-neon' :
                      bmiResult?.category === 'Overweight' ? 'text-gold-mythic' :
                      bmiResult?.category === 'Obesity' ? 'text-crimson-aura' :
                      'text-slate-400'
                    }`}>
                      {bmiResult ? bmiResult.category.toUpperCase() : 'PENDING SCAN'}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500">
                      {bmiResult ? `${bmiResult.heightCm} cm • ${bmiResult.weightKg} kg` : 'Awaiting input'}
                    </span>
                  </div>
                </div>

                {/* Dynamic Visual Scale */}
                <div className="pt-2">
                  <BMIScale
                    bmi={bmiResult?.bmi || null}
                    category={bmiResult?.category || ''}
                  />
                </div>

                {/* Explanation Box */}
                {bmiResult?.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-obsidian/90 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-orbitron text-violet-glow font-bold">
                      <Info className="w-4 h-4" />
                      <span>ANALYSIS INSIGHT</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {bmiResult.explanation}
                    </p>
                    <p className="text-[10px] text-slate-500 font-sans italic border-t border-slate-800/80 pt-2">
                      {bmiResult.disclaimer}
                    </p>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION B: CALORIE CORE (BMR & TDEE ENGINE)
        ══════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-crimson-aura/10 border border-crimson-aura/30 text-crimson-aura">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-wide">
                  SECTION B: CALORIE CORE
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  Estimate your daily energy requirements using the Mifflin-St Jeor equation.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-crimson-aura hidden sm:inline-block">
              MIFFLIN-ST JEOR ENGINE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Panel (6 cols) */}
            <GlassCard glow="crimson" className="lg:col-span-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron font-bold text-sm text-slate-200 tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-crimson-aura" />
                  METABOLIC CONFIGURATION
                </h3>

                {/* Quick copy button if height & weight exist from section A */}
                {(heightCm || weightKg) && (
                  <button
                    type="button"
                    onClick={handleSyncToCalories}
                    className="text-[10px] font-mono text-cyan-neon hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>USE SCANNED METRICS</span>
                  </button>
                )}
              </div>

              {/* Calorie Error Alert */}
              {calError && (
                <div className="p-3 rounded-lg bg-crimson-aura/10 border border-crimson-aura/40 flex items-center gap-2 text-xs font-mono text-crimson-aura">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{calError}</span>
                </div>
              )}

              <form onSubmit={handleActivateCalorieCore} className="space-y-4">
                {/* Age & Sex Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                      AGE (YEARS)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 21"
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-void/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-crimson-aura focus:ring-1 focus:ring-crimson-aura transition-colors"
                    />
                  </div>

                  {/* Sex Selection Pills */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                      BIOLOGICAL SEX
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSex('male')}
                        className={`py-2 px-3 rounded-lg font-orbitron text-xs font-bold border transition-all ${
                          sex === 'male'
                            ? 'bg-cyan-neon/15 border-cyan-neon text-cyan-neon shadow-glow-cyan'
                            : 'bg-void/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        MALE
                      </button>
                      <button
                        type="button"
                        onClick={() => setSex('female')}
                        className={`py-2 px-3 rounded-lg font-orbitron text-xs font-bold border transition-all ${
                          sex === 'female'
                            ? 'bg-crimson-aura/15 border-crimson-aura text-crimson-aura shadow-glow-crimson'
                            : 'bg-void/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        FEMALE
                      </button>
                    </div>
                  </div>
                </div>

                {/* Height & Weight Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                      HEIGHT (CM)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="300"
                      value={calHeightCm}
                      onChange={(e) => setCalHeightCm(e.target.value)}
                      placeholder="e.g. 175"
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-void/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-crimson-aura focus:ring-1 focus:ring-crimson-aura transition-colors"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                      WEIGHT (KG)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={calWeightKg}
                      onChange={(e) => setCalWeightKg(e.target.value)}
                      placeholder="e.g. 70"
                      required
                      className="w-full px-3.5 py-2 rounded-lg bg-void/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-crimson-aura focus:ring-1 focus:ring-crimson-aura transition-colors"
                    />
                  </div>
                </div>

                {/* Activity Level Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-orbitron font-bold tracking-wider text-slate-300">
                    TRAINING ACTIVITY LEVEL
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-void/90 border border-slate-700 text-slate-100 text-sm font-sans focus:outline-none focus:border-crimson-aura focus:ring-1 focus:ring-crimson-aura transition-colors"
                  >
                    {ACTIVITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-obsidian text-slate-200">
                        {opt.label} — {opt.sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <AnimeButton
                    type="submit"
                    variant="crimson"
                    size="lg"
                    icon={Flame}
                    disabled={calLoading}
                    className="w-full"
                  >
                    {calLoading ? 'ACTIVATING CALORIE CORE...' : 'ACTIVATE CALORIE CORE'}
                  </AnimeButton>
                </div>
              </form>
            </GlassCard>

            {/* Results Display Panel (6 cols) */}
            <GlassCard glow="gold" className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-orbitron font-bold text-slate-300 tracking-wider">
                    CALORIE ENGINE TELEMETRY
                  </span>
                  {calorieResult && (
                    <span className="text-[10px] font-mono text-gold-mythic flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> METABOLIC LOCK ACQUIRED
                    </span>
                  )}
                </div>

                {/* Calorie Stats HUD Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  {/* BMR Card */}
                  <div className="p-5 rounded-xl bg-void/85 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-wider">
                      BMR (BASAL RATE)
                    </span>
                    <p className="font-orbitron font-black text-3xl text-violet-glow">
                      {calorieResult ? calorieResult.bmr.toLocaleString() : '----'}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">KCAL / DAY AT REST</p>
                  </div>

                  {/* Maintenance TDEE Card */}
                  <div className="p-5 rounded-xl bg-void/85 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-wider">
                      ESTIMATED MAINTENANCE
                    </span>
                    <p className="font-orbitron font-black text-3xl text-crimson-aura">
                      {calorieResult ? calorieResult.tdee.toLocaleString() : '----'}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">KCAL / DAY (TDEE)</p>
                  </div>
                </div>

                {/* Multiplier Detail Banner */}
                {calorieResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-obsidian/90 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-orbitron">
                      <span className="text-slate-400">ACTIVE MULTIPLIER:</span>
                      <span className="text-gold-mythic font-bold">{calorieResult.activityLevel} ({calorieResult.activityMultiplier}x)</span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {calorieResult.explanation}
                    </p>

                    <p className="text-[10px] text-slate-500 font-sans italic border-t border-slate-800/80 pt-2">
                      {calorieResult.disclaimer}
                    </p>
                  </motion.div>
                )}

                {!calorieResult && (
                  <div className="p-8 rounded-xl bg-obsidian/40 border border-dashed border-slate-800 text-center space-y-2">
                    <Flame className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-orbitron text-xs text-slate-400">
                      CALORIE ENGINE OFFLINE
                    </p>
                    <p className="text-[11px] text-slate-500 font-sans max-w-xs mx-auto">
                      Fill in your age, sex, metrics, and activity level to compute your maintenance calories.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BodyAnalysis;
