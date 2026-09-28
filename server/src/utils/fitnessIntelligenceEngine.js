import Workout from '../models/Workout.js';
import HealthProfile from '../models/HealthProfile.js';
import FitnessGoal from '../models/FitnessGoal.js';
import FitnessPurpose from '../models/FitnessPurpose.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevHealthProfile,
  getDevProgression,
  getDevGoals,
  getDevPurpose,
} from './devStore.js';
import { getUserProgressionData } from './progressionEngine.js';
import { getUserPersonalRecords } from './recordEngine.js';

const VALID_ACTIVITIES = [
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Swimming',
  'Yoga',
  'HIIT',
  'Sports',
  'Other',
];

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format ISO Date string YYYY-MM-DD in UTC
 * @param {Date|string} d 
 * @returns {string}
 */
export const toISODateUTC = (d = new Date()) => {
  const date = new Date(d);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
};

/**
 * Safely compute percentage change without dividing by zero
 * @param {number} current 
 * @param {number} previous 
 * @returns {number|null}
 */
export const calculateSafeChange = (current, previous) => {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * 1. Consistency Index Calculation
 * Evaluates active workout days over the last 30 UTC calendar days
 * @param {Array} workouts 
 * @param {number} periodDays 
 * @returns {Object}
 */
export const calculateConsistencyScore = (workouts = [], periodDays = 30) => {
  const now = new Date();
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (periodDays - 1), 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  const activeDates = new Set();

  for (const w of workouts) {
    const wDate = new Date(w.workoutDate || w.createdAt);
    if (wDate >= startDate && wDate <= endDate) {
      activeDates.add(toISODateUTC(wDate));
    }
  }

  const activeDays = activeDates.size;
  const rawScore = (activeDays / periodDays) * 100;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let tier = 'INACTIVE';
  if (score >= 70) tier = 'ELITE CONSISTENCY';
  else if (score >= 45) tier = 'COMMITTED WARRIOR';
  else if (score >= 20) tier = 'DEVELOPING HABIT';
  else if (activeDays > 0) tier = 'INITIAL TRACTION';

  return {
    score,
    activeDays,
    periodDays,
    label: 'F-TRACK CONSISTENCY INDEX',
    tier,
    startDate: toISODateUTC(startDate),
    endDate: toISODateUTC(endDate),
    summary: activeDays > 0 
      ? `Active on ${activeDays} of the last ${periodDays} calendar days (${score}% adherence).`
      : `No workouts recorded in the analyzed ${periodDays}-day window.`,
  };
};

/**
 * 2. Workout Pattern Analysis
 * Computes frequency distributions, averages, and peak days
 * @param {Array} workouts 
 * @returns {Object}
 */
export const analyzeWorkoutPattern = (workouts = []) => {
  if (!workouts || workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCalories: 0,
      averageWorkoutDuration: 0,
      averageCalories: 0,
      mostActiveDay: null,
      dayDistribution: WEEKDAY_NAMES.reduce((acc, day) => ({ ...acc, [day]: 0 }), {}),
    };
  }

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  const averageWorkoutDuration = Math.round((totalMinutes / totalWorkouts) * 10) / 10;
  const averageCalories = Math.round((totalCalories / totalWorkouts) * 10) / 10;

  // Day distribution
  const dayDistribution = WEEKDAY_NAMES.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
  for (const w of workouts) {
    const wDate = new Date(w.workoutDate || w.createdAt);
    const dayName = WEEKDAY_NAMES[wDate.getUTCDay()];
    dayDistribution[dayName] = (dayDistribution[dayName] || 0) + 1;
  }

  // Find peak day(s)
  let maxDayCount = 0;
  for (const day of WEEKDAY_NAMES) {
    if (dayDistribution[day] > maxDayCount) {
      maxDayCount = dayDistribution[day];
    }
  }

  const peakDays = WEEKDAY_NAMES.filter((day) => dayDistribution[day] === maxDayCount && maxDayCount > 0);
  const mostActiveDay = peakDays.length > 0 ? peakDays.join(' & ') : null;

  return {
    totalWorkouts,
    totalMinutes,
    totalCalories,
    averageWorkoutDuration,
    averageCalories,
    mostActiveDay,
    peakDays,
    dayDistribution,
  };
};

/**
 * 3. Activity Preference Analysis
 * Calculates distribution across disciplines and accurately detects ties
 * @param {Array} workouts 
 * @returns {Object}
 */
export const analyzeActivityPreference = (workouts = []) => {
  const totalWorkouts = workouts.length;

  const breakdown = VALID_ACTIVITIES.map((type) => {
    const matching = workouts.filter((w) => w.activityType === type);
    const count = matching.length;
    const minutes = matching.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
    const calories = matching.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);
    const percentage = totalWorkouts > 0 ? Math.round((count / totalWorkouts) * 100) : 0;

    return {
      type,
      count,
      percentage,
      minutes,
      calories,
    };
  }).sort((a, b) => b.count - a.count || b.minutes - a.minutes);

  if (totalWorkouts === 0) {
    return {
      breakdown,
      mostFrequent: [],
      isTied: false,
      primaryDiscipline: 'None',
      activeDisciplinesCount: 0,
    };
  }

  const maxCount = breakdown[0].count;
  const topDisciplines = breakdown.filter((item) => item.count === maxCount && item.count > 0);
  const mostFrequent = topDisciplines.map((item) => item.type);
  const isTied = mostFrequent.length > 1;

  const primaryDiscipline = isTied 
    ? mostFrequent.join(' & ') 
    : (mostFrequent[0] || 'None');

  const activeDisciplinesCount = breakdown.filter((item) => item.count > 0).length;

  return {
    breakdown,
    mostFrequent,
    isTied,
    primaryDiscipline,
    activeDisciplinesCount,
  };
};

/**
 * 4. Progress Trend Analysis
 * Compares current 14 UTC days vs previous 14 UTC days with transparent classification
 * @param {Array} workouts 
 * @returns {Object}
 */
export const analyzeProgressTrend = (workouts = []) => {
  const now = new Date();

  // Current 14-day window: D-13 00:00:00 to D 23:59:59.999 UTC
  const currStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 13, 0, 0, 0, 0));
  const currEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

  // Previous 14-day window: D-27 00:00:00 to D-14 23:59:59.999 UTC
  const prevStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 27, 0, 0, 0, 0));
  const prevEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 14, 23, 59, 59, 999));

  const currWorkouts = workouts.filter((w) => {
    const t = new Date(w.workoutDate || w.createdAt).getTime();
    return t >= currStart.getTime() && t <= currEnd.getTime();
  });

  const prevWorkouts = workouts.filter((w) => {
    const t = new Date(w.workoutDate || w.createdAt).getTime();
    return t >= prevStart.getTime() && t <= prevEnd.getTime();
  });

  const currentMetrics = {
    workouts: currWorkouts.length,
    minutes: currWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
    calories: currWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0),
  };

  const previousMetrics = {
    workouts: prevWorkouts.length,
    minutes: prevWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
    calories: prevWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0),
  };

  const workoutChange = calculateSafeChange(currentMetrics.workouts, previousMetrics.workouts);
  const minuteChange = calculateSafeChange(currentMetrics.minutes, previousMetrics.minutes);
  const calorieChange = calculateSafeChange(currentMetrics.calories, previousMetrics.calories);

  // Transparent Classification Rules
  let classification = 'INSUFFICIENT_DATA';
  let reasoning = 'Insufficient historical telemetry across analyzed 28-day window.';

  if (currentMetrics.workouts === 0 && previousMetrics.workouts === 0) {
    classification = 'INSUFFICIENT_DATA';
    reasoning = 'No workout sessions recorded in either the current or prior 14-day window.';
  } else if (previousMetrics.workouts === 0 && currentMetrics.workouts > 0) {
    classification = 'IMPROVING';
    reasoning = `New training cadence established with ${currentMetrics.workouts} sessions (${currentMetrics.minutes} min) logged in the current 14-day cycle.`;
  } else if (currentMetrics.workouts === 0 && previousMetrics.workouts > 0) {
    classification = 'DECLINING';
    reasoning = `Training volume paused in the current 14-day window compared to ${previousMetrics.workouts} sessions in the prior window.`;
  } else {
    // Both periods have workouts
    if ((minuteChange !== null && minuteChange > 5) || (workoutChange !== null && workoutChange > 0 && minuteChange >= -10)) {
      classification = 'IMPROVING';
      reasoning = `Training volume increased by ${minuteChange !== null ? `+${minuteChange}% minutes` : 'positive margin'} over the last 14 days.`;
    } else if ((minuteChange !== null && minuteChange < -15) || (workoutChange !== null && workoutChange < -15)) {
      classification = 'DECLINING';
      reasoning = `Training volume dipped by ${minuteChange !== null ? `${minuteChange}% minutes` : 'negative margin'} compared to prior 14-day period.`;
    } else {
      classification = 'STABLE';
      reasoning = `Training cadence remained consistent within regular physiological variance (${currentMetrics.workouts} vs ${previousMetrics.workouts} sessions).`;
    }
  }

  return {
    classification,
    reasoning,
    currentPeriod: {
      startDate: toISODateUTC(currStart),
      endDate: toISODateUTC(currEnd),
      ...currentMetrics,
    },
    previousPeriod: {
      startDate: toISODateUTC(prevStart),
      endDate: toISODateUTC(prevEnd),
      ...previousMetrics,
    },
    changes: {
      workoutChange,
      minuteChange,
      calorieChange,
    },
  };
};

/**
 * 5. Goal & Contextual Insights Generation
 * Produces explainable, non-medical fitness insights based purely on real telemetry
 * @param {Object} context 
 * @returns {Array}
 */
export const generateFitnessInsights = ({
  workouts = [],
  healthProfile = null,
  progression = null,
  records = null,
  consistency = null,
  pattern = null,
  activityPreference = null,
  trend = null,
  activeGoals = [],
  userPurpose = null,
}) => {
  const insights = [];

  if (workouts.length === 0) {
    return insights;
  }

  // Purpose Alignment & Consistency Over Intensity (Stage 19)
  if (userPurpose) {
    const purposeLabels = {
      BUILD_DISCIPLINE: 'Building Discipline',
      IMPROVE_HEALTH: 'Improving Health',
      INCREASE_ENERGY: 'Increasing Energy',
      BUILD_CONFIDENCE: 'Building Confidence',
      IMPROVE_STRENGTH: 'Improving Strength',
      IMPROVE_ENDURANCE: 'Improving Endurance',
      PREPARE_SPORT: 'Preparing for a Sport',
      CHANGE_LIFESTYLE: 'Changing Lifestyle',
      FEEL_BETTER: 'Feeling Better Daily',
      SUPPORT_FAMILY: 'Supporting Loved Ones',
      PERSONAL_CHALLENGE: 'Personal Challenge',
      CUSTOM: userPurpose.customPurpose || 'Personal Purpose',
    };
    const purposeTitle = purposeLabels[userPurpose.purposeType] || 'Personal Purpose';

    insights.push({
      id: 'insight-purpose-alignment',
      category: 'FOCUS',
      title: `PURPOSE ALIGNMENT: ${purposeTitle.toUpperCase()}`,
      explanation: `For your stated purpose — "${purposeTitle}" — steady weekly consistency is your most reliable foundation. Protect the routine before scaling intensity.`,
      dataSource: 'Personal Purpose System',
      priority: 'HIGH',
    });
  }

  // Insight 1: Consistency Evaluation
  if (consistency) {
    let explanation = '';
    let priority = 'MEDIUM';

    if (consistency.score >= 50) {
      explanation = `Solid habit formation detected. You were active on ${consistency.activeDays} of the past 30 days, placing you in the ${consistency.tier} bracket.`;
      priority = 'HIGH';
    } else if (consistency.score >= 20) {
      explanation = `Emerging momentum. You recorded activity on ${consistency.activeDays} days in the last 30-day window. Consistent repetition will reinforce this pattern.`;
    } else {
      explanation = `Initial training foundation. You logged ${consistency.activeDays} active days in the last 30-day window. Setting a 2–3 session weekly baseline will accelerate progression.`;
    }

    insights.push({
      id: 'insight-consistency',
      category: 'CONSISTENCY',
      title: `${consistency.tier}`,
      explanation,
      dataSource: `30-Day UTC Window (${consistency.activeDays} / ${consistency.periodDays} days)`,
      priority,
    });
  }

  // Insight 2: Activity Preference & Specialization
  if (activityPreference && activityPreference.activeDisciplinesCount > 0) {
    const isTied = activityPreference.isTied;
    const primary = activityPreference.primaryDiscipline;
    const topItem = activityPreference.breakdown[0];

    const explanation = isTied
      ? `Balanced multidisciplinary focus observed between ${primary}, with equal session counts recorded.`
      : `Your primary training focus is ${primary}, accounting for ${topItem.percentage}% of all recorded quests (${topItem.count} sessions, ${topItem.minutes} min).`;

    insights.push({
      id: 'insight-activity',
      category: 'ACTIVITY',
      title: isTied ? 'MULTIDISCIPLINARY BALANCE' : `${primary.toUpperCase()} SPECIALIZATION`,
      explanation,
      dataSource: `Activity Distribution (${activityPreference.activeDisciplinesCount} active disciplines)`,
      priority: 'MEDIUM',
    });
  }

  // Insight 3: Trend & Momentum
  if (trend && trend.classification !== 'INSUFFICIENT_DATA') {
    let title = 'STABLE TRAINING CADENCE';
    let priority = 'MEDIUM';

    if (trend.classification === 'IMPROVING') {
      title = 'POSITIVE VOLUME EXPANSION';
      priority = 'HIGH';
    } else if (trend.classification === 'DECLINING') {
      title = 'VOLUME RECALIBRATION';
      priority = 'MEDIUM';
    }

    insights.push({
      id: 'insight-trend',
      category: 'PROGRESS',
      title,
      explanation: trend.reasoning,
      dataSource: `14-Day Cycle Comparison (${trend.currentPeriod.minutes}m vs ${trend.previousPeriod.minutes}m)`,
      priority,
    });
  }

  // Insight 4: Streak Discipline
  const currentStreak = progression?.currentStreak || 0;
  const longestStreak = progression?.longestStreak || 0;

  if (currentStreak > 0) {
    insights.push({
      id: 'insight-streak',
      category: 'STREAK',
      title: `${currentStreak}-DAY STREAK SUSTAINED`,
      explanation: currentStreak >= longestStreak && longestStreak > 1
        ? `New personal streak record achieved! You have actively trained for ${currentStreak} consecutive days.`
        : `Consistent daily adherence maintained across ${currentStreak} consecutive days. Personal record is ${longestStreak} days.`,
      dataSource: `Progression Engine Telemetry`,
      priority: currentStreak >= 3 ? 'HIGH' : 'MEDIUM',
    });
  }

  // Insight 5: Health & Metabolic Context (Non-medical, transparent Mifflin-St Jeor integration)
  if (healthProfile?.latestCalories && pattern && pattern.averageCalories > 0) {
    const tdee = healthProfile.latestCalories.tdee;
    const avgBurn = pattern.averageCalories;
    const percentOfTDEE = Math.round((avgBurn / tdee) * 100);

    insights.push({
      id: 'insight-metabolic',
      category: 'PATTERN',
      title: 'METABOLIC WORKLOAD CONTEXT',
      explanation: `Each workout burns an average of ${avgBurn} kcal, contributing approximately ${percentOfTDEE}% toward your daily maintenance expenditure (${tdee.toLocaleString()} kcal TDEE).`,
      dataSource: `Body Analysis Mifflin-St Jeor Reference`,
      priority: 'LOW',
    });
  } else if (!healthProfile?.latestBMI) {
    insights.push({
      id: 'insight-health-missing',
      category: 'FOCUS',
      title: 'METABOLIC PROFILE PENDING',
      explanation: 'Complete a biometric scan in Body Analysis to link your estimated energy requirements (BMR/TDEE) with workout telemetry.',
      dataSource: 'Health Profile Status: INSUFFICIENT_DATA',
      priority: 'LOW',
    });
  }

  // Insight 6: Personal Record Matrix
  if (records && records.hasRecords && records.longestWorkout) {
    insights.push({
      id: 'insight-record',
      category: 'PROGRESS',
      title: 'SUMMIT VOLUME BENCHMARK',
      explanation: `Peak single-session duration stands at ${records.longestWorkout.durationMinutes} minutes (${records.longestWorkout.activityType}). This benchmark represents your ceiling for endurance pacing.`,
      dataSource: `Personal Record Matrix (${records.longestWorkout.date})`,
      priority: 'LOW',
    });
  }

  // Insight 7: Mission Progression Momentum (Stage 13)
  if (activeGoals && activeGoals.length > 0) {
    const topGoal = [...activeGoals].sort((a, b) => b.progressPercentage - a.progressPercentage)[0];
    if (topGoal) {
      insights.push({
        id: 'insight-goal-momentum',
        category: 'FOCUS',
        title: 'MISSION PROGRESSION MOMENTUM',
        explanation: `Your workout telemetry is actively contributing toward your mission "${topGoal.title}" (${topGoal.progressPercentage}% completed, target: ${topGoal.targetValue} ${topGoal.unit || ''}).`,
        dataSource: `Mission Control (${topGoal.title})`,
        priority: 'HIGH',
      });
    }
  }

  return insights;
};

/**
 * 6. Actionable Next Focus Generation
 * Generates up to 3 evidence-based suggestions grounded in real data
 * @param {Object} context 
 * @returns {Array}
 */
export const generateNextFocus = ({
  workouts = [],
  progression = null,
  consistency = null,
  pattern = null,
  activityPreference = null,
  trend = null,
}) => {
  const suggestions = [];

  if (workouts.length === 0) {
    return suggestions;
  }

  // Focus 1: Streak Protection
  const currentStreak = progression?.currentStreak || 0;
  if (currentStreak > 0) {
    suggestions.push({
      id: 'focus-streak',
      title: 'PROTECT YOUR STREAK',
      reason: `You have recorded workouts across consecutive days (${currentStreak}-day active streak). Completing today's activity secures streak continuity and prevents reset.`,
      priority: 'HIGH',
    });
  }

  // Focus 2: Frequency & Adherence Baseline
  if (consistency && consistency.score < 35) {
    suggestions.push({
      id: 'focus-consistency',
      title: 'BUILD WEEKLY FREQUENCY',
      reason: `Your 30-day consistency index is currently ${consistency.score}%. Committing to 3 scheduled sessions per week will elevate your training rhythm into the committed warrior tier.`,
      priority: 'HIGH',
    });
  } else if (trend && trend.classification === 'IMPROVING') {
    suggestions.push({
      id: 'focus-recovery',
      title: 'MAINTAIN RECOVERY BALANCE',
      reason: `Your active minutes expanded by ${trend.changes.minuteChange ? `+${trend.changes.minuteChange}%` : 'a positive margin'} over the last 14 days. Prioritize sleep, hydration, and active recovery between heavy efforts.`,
      priority: 'MEDIUM',
    });
  }

  // Focus 3: Duration Optimization
  if (pattern && pattern.averageWorkoutDuration > 0 && pattern.averageWorkoutDuration < 30) {
    suggestions.push({
      id: 'focus-duration',
      title: 'PROGRESSIVE DURATION EXTENSION',
      reason: `Your current average session length is ${pattern.averageWorkoutDuration} minutes. Gradually extending 1 to 2 sessions per week toward 35–45 minutes will build sustained stamina.`,
      priority: 'MEDIUM',
    });
  }

  // Focus 4: Cross-Training Variety
  if (
    activityPreference &&
    activityPreference.activeDisciplinesCount === 1 &&
    pattern &&
    pattern.totalWorkouts >= 3
  ) {
    const currentActivity = activityPreference.primaryDiscipline;
    suggestions.push({
      id: 'focus-variety',
      title: 'EXPLORE CROSS-TRAINING VARIETY',
      reason: `All ${pattern.totalWorkouts} of your recorded sessions have focused on ${currentActivity}. Introducing secondary cross-training (such as HIIT, Gym, or Yoga) builds balanced muscular endurance.`,
      priority: 'MEDIUM',
    });
  }

  // Focus 5: Trend Re-ignition if declining
  if (trend && trend.classification === 'DECLINING' && suggestions.length < 3) {
    suggestions.push({
      id: 'focus-reignite',
      title: 'REIGNITE TRAINING MOMENTUM',
      reason: `Training volume contracted by ${trend.changes.minuteChange || 0}% compared to the prior 14-day cycle. Logging a short 20-minute session will restart your momentum.`,
      priority: 'HIGH',
    });
  }

  // Limit to top 3 evidence-based suggestions
  return suggestions.slice(0, 3);
};

/**
 * Master Fitness Intelligence Calculation
 * Aggregates all authentic user telemetry and computes personal insights
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const calculateFitnessIntelligence = async (userId) => {
  let workouts = [];
  let healthProfile = null;
  let progression = null;
  let records = null;

  if (isMongoConnected()) {
    workouts = await Workout.find({ user: userId }).sort({ workoutDate: -1, createdAt: -1 }).lean();
    healthProfile = await HealthProfile.findOne({ user: userId }).lean();
    progression = await getUserProgressionData(userId);
    records = await getUserPersonalRecords(userId);
  } else {
    workouts = await getDevWorkouts(userId);
    healthProfile = await getDevHealthProfile(userId);
    progression = await getUserProgressionData(userId);
    records = await getUserPersonalRecords(userId);
  }

  // Fetch active missions for goal momentum insight (Stage 13)
  let activeGoals = [];
  try {
    if (isMongoConnected()) {
      activeGoals = await FitnessGoal.find({ user: userId, status: 'ACTIVE' }).lean();
    } else {
      const devG = await getDevGoals(userId);
      activeGoals = devG.filter((g) => g.status === 'ACTIVE');
    }
  } catch (gErr) {
    console.error(`[INTELLIGENCE_GOALS_FETCH ERROR] ${gErr.message}`);
  }

  // Fetch active purpose for purpose alignment insight (Stage 19)
  let userPurpose = null;
  try {
    if (isMongoConnected()) {
      userPurpose = await FitnessPurpose.findOne({ user: userId, active: true }).lean();
    } else {
      userPurpose = await getDevPurpose(userId);
    }
  } catch (pErr) {
    console.error(`[INTELLIGENCE_PURPOSE_FETCH ERROR] ${pErr.message}`);
  }

  // 1. Consistency Score (30-day window)
  const consistency = calculateConsistencyScore(workouts, 30);

  // 2. Workout Pattern Analysis
  const workoutPattern = analyzeWorkoutPattern(workouts);

  // 3. Activity Preference Analysis
  const activityPreference = analyzeActivityPreference(workouts);

  // 4. Progress Trend Analysis (14-day current vs 14-day previous)
  const progressTrend = analyzeProgressTrend(workouts);

  // 5. Contextual Explainable Insights
  const insights = generateFitnessInsights({
    workouts,
    healthProfile,
    progression,
    records,
    consistency,
    pattern: workoutPattern,
    activityPreference,
    trend: progressTrend,
    activeGoals,
    userPurpose,
  });

  // 6. Actionable Next Focus Suggestions
  const nextFocus = generateNextFocus({
    workouts,
    progression,
    consistency,
    pattern: workoutPattern,
    activityPreference,
    trend: progressTrend,
  });

  return {
    summary: {
      totalWorkouts: workoutPattern.totalWorkouts,
      totalMinutes: workoutPattern.totalMinutes,
      totalCalories: workoutPattern.totalCalories,
      averageDuration: workoutPattern.averageWorkoutDuration,
      averageCalories: workoutPattern.averageCalories,
      consistencyIndex: consistency.score,
      activeDaysLast30: consistency.activeDays,
      primaryDiscipline: activityPreference.primaryDiscipline,
      trendClassification: progressTrend.classification,
    },
    consistency,
    workoutPattern,
    activityPreference,
    progressTrend,
    insights,
    nextFocus,
    progression: {
      level: progression?.level || 1,
      rank: progression?.rank || 'E',
      rankTitle: progression?.rankTitle || 'AWAKENING',
      xp: progression?.xp || 0,
      currentStreak: progression?.currentStreak || 0,
      longestStreak: progression?.longestStreak || 0,
    },
    safetyDisclaimer: 'F-TRACK PERSONAL FITNESS INTELLIGENCE • INFORMATIONAL PERFORMANCE ANALYTICS ONLY • NOT MEDICAL ADVICE OR DIAGNOSIS',
  };
};

export default {
  toISODateUTC,
  calculateSafeChange,
  calculateConsistencyScore,
  analyzeWorkoutPattern,
  analyzeActivityPreference,
  analyzeProgressTrend,
  generateFitnessInsights,
  generateNextFocus,
  calculateFitnessIntelligence,
};
