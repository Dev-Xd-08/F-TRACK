import Workout from '../models/Workout.js';
import FitnessGoal from '../models/FitnessGoal.js';
import FitnessPurpose from '../models/FitnessPurpose.js';
import Achievement from '../models/Achievement.js';
import Progression from '../models/Progression.js';
import WeeklyReflection from '../models/WeeklyReflection.js';
import WorkoutReflection from '../models/WorkoutReflection.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevGoals,
  getDevPurpose,
  getDevAchievements,
  getDevProgression,
  getDevWeeklyReflections,
  getDevReflections,
} from './devStore.js';
import { getUserPersonalRecords } from './recordEngine.js';

/**
 * Format date nicely for Journey Milestones (e.g. "AUG 02, 2026")
 */
const formatMilestoneDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
};

/**
 * Helper to fetch user workouts sorted chronologically
 */
const fetchUserWorkouts = async (userId) => {
  if (isMongoConnected()) {
    try {
      return await Workout.find({ user: userId }).sort({ workoutDate: 1 }).lean();
    } catch {
      return await getDevWorkouts(userId);
    }
  }
  const workouts = await getDevWorkouts(userId);
  return [...workouts].sort((a, b) => new Date(a.workoutDate) - new Date(b.workoutDate));
};

/**
 * 1. Journey Timeline Milestones Generator
 * Derives meaningful, reflective milestones ONLY from real user telemetry
 */
export const getJourneyMilestones = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);
  const milestones = [];

  if (workouts.length === 0) {
    return [];
  }

  // Milestone 1: The First Step
  const firstWorkout = workouts[0];
  milestones.push({
    id: 'first_step',
    type: 'FIRST_STEP',
    date: firstWorkout.workoutDate || firstWorkout.createdAt,
    formattedDate: formatMilestoneDate(firstWorkout.workoutDate || firstWorkout.createdAt),
    title: 'THE FIRST STEP',
    subtitle: 'THE PATH COMMENCED',
    description: `Your journey began with a ${firstWorkout.duration || 0}-minute ${firstWorkout.activityType || 'workout'} session.`,
    icon: 'Footprints',
  });

  // Milestone: Workout Count Thresholds (10th, 25th, 50th, 100th)
  const thresholds = [
    { count: 10, title: 'TEN SESSIONS', subtitle: 'CONSISTENCY FORGED', desc: '10 training sessions recorded.' },
    { count: 25, title: 'TWENTY-FIVE SESSIONS', subtitle: 'DISCIPLINE EMBEDDED', desc: 'A quarter-century of dedicated training sessions.' },
    { count: 50, title: 'FIFTY SESSIONS', subtitle: 'UNYIELDING ENDURANCE', desc: '50 recorded sessions on the path.' },
    { count: 100, title: 'ONE HUNDRED SESSIONS', subtitle: 'CENTURY OF RESOLVE', desc: '100 completed training sessions.' },
  ];

  thresholds.forEach(({ count, title, subtitle, desc }) => {
    if (workouts.length >= count) {
      const targetSession = workouts[count - 1];
      milestones.push({
        id: `milestone_${count}`,
        type: 'COUNT_MILESTONE',
        date: targetSession.workoutDate || targetSession.createdAt,
        formattedDate: formatMilestoneDate(targetSession.workoutDate || targetSession.createdAt),
        title,
        subtitle,
        description: desc,
        icon: 'Flame',
      });
    }
  });

  // Milestone: Returning After Inactivity Gap in History
  for (let i = 1; i < workouts.length; i++) {
    const prevDate = new Date(workouts[i - 1].workoutDate || workouts[i - 1].createdAt).getTime();
    const currDate = new Date(workouts[i].workoutDate || workouts[i].createdAt).getTime();
    const gapDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (gapDays >= 4) {
      milestones.push({
        id: `return_gap_${i}`,
        type: 'RETURN_AFTER_GAP',
        date: workouts[i].workoutDate || workouts[i].createdAt,
        formattedDate: formatMilestoneDate(workouts[i].workoutDate || workouts[i].createdAt),
        title: 'THE PATH CONTINUES',
        subtitle: 'RESILIENCE PROVEN',
        description: `You returned to train after a ${gapDays}-day hiatus. A pause did not end the journey.`,
        icon: 'Compass',
      });
      break; // Record the most notable early return
    }
  }

  // Milestone: Personal Records
  try {
    const prs = await getUserPersonalRecords(userId);
    if (prs && prs.maxDuration && prs.maxDuration.value > 0) {
      milestones.push({
        id: 'pr_longest_session',
        type: 'PERSONAL_RECORD',
        date: prs.maxDuration.workoutDate || prs.maxDuration.updatedAt || new Date(),
        formattedDate: formatMilestoneDate(prs.maxDuration.workoutDate || prs.maxDuration.updatedAt || new Date()),
        title: 'RECORD OF ENDURANCE',
        subtitle: 'LONGEST RECORDED SESSION',
        description: `Pushed personal capacity to ${prs.maxDuration.value} minutes in a single session.`,
        icon: 'Award',
      });
    }
  } catch (err) {
    // Ignore PR errors
  }

  // Milestone: Weekly Reflections (Stage 20)
  try {
    let weeklyReflections = [];
    if (isMongoConnected()) {
      weeklyReflections = await WeeklyReflection.find({ user: userId }).sort({ weekStart: -1 }).limit(3).lean();
    } else {
      weeklyReflections = await getDevWeeklyReflections(userId, 3);
    }

    weeklyReflections.forEach((wf, idx) => {
      milestones.push({
        id: `weekly_reflection_${wf._id || idx}`,
        type: 'WEEKLY_REFLECTION',
        date: wf.createdAt || wf.weekEnd || new Date(),
        formattedDate: formatMilestoneDate(wf.createdAt || wf.weekEnd || new Date()),
        title: 'WEEKLY INTROSPECTION',
        subtitle: `${wf.sessionsCompleted} SESSIONS RECORDED`,
        description: wf.wentWell
          ? `Focus review: "${wf.wentWell.length > 90 ? wf.wentWell.substring(0, 90) + '...' : wf.wentWell}"`
          : 'Completed dedicated weekly training review and calibration.',
        icon: 'Compass',
      });
    });
  } catch (err) {
    // Ignore reflection errors
  }

  // Milestone: Meaningful Workout Reflection
  try {
    let reflections = [];
    if (isMongoConnected()) {
      reflections = await WorkoutReflection.find({ user: userId, note: { $ne: '' } }).sort({ createdAt: -1 }).limit(1).lean();
    } else {
      reflections = (await getDevReflections(userId)).filter((r) => r.note && r.note.trim().length > 0).slice(0, 1);
    }

    if (reflections.length > 0) {
      const refl = reflections[0];
      milestones.push({
        id: `reflection_${refl._id}`,
        type: 'SESSION_NOTE',
        date: refl.createdAt,
        formattedDate: formatMilestoneDate(refl.createdAt),
        title: 'TRAINING INSIGHT RECORDED',
        subtitle: `RPE ${refl.effort}`,
        description: `"${refl.note.length > 100 ? refl.note.substring(0, 100) + '...' : refl.note}"`,
        icon: 'Flame',
      });
    }
  } catch (err) {
    // Ignore note errors
  }

  // Sort milestones reverse-chronologically (newest first)
  return milestones.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * 2. Return After Inactivity Engine
 * Non-punitive, compassionate return detection
 */
export const getReturnStatus = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length === 0) {
    return {
      status: 'NEW_USER',
      needsReturnCard: false,
      daysAway: 0,
      message: 'Welcome to F-TRACK. Record your first session to commence your journey.',
    };
  }

  const latestWorkout = workouts[workouts.length - 1];
  const lastDate = new Date(latestWorkout.workoutDate || latestWorkout.createdAt);
  const now = new Date();
  const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) {
    return {
      status: 'ACTIVE',
      needsReturnCard: false,
      daysAway: diffDays,
      lastWorkoutDate: lastDate,
      message: 'Active routine rhythm maintained.',
    };
  }

  if (diffDays >= 3 && diffDays <= 6) {
    return {
      status: 'GENTLE_RETURN',
      needsReturnCard: true,
      daysAway: diffDays,
      lastWorkoutDate: lastDate,
      heading: 'THE PATH CONTINUES',
      message: `You were away for ${diffDays} days. Your previous progress is still here. Start where you are.`,
      recommendedMinutes: 20,
      subtext: 'You do not need an extreme effort today. A simple 20-minute movement session is enough.',
    };
  }

  // diffDays >= 7
  return {
    status: 'STRONG_RETURN',
    needsReturnCard: true,
    daysAway: diffDays,
    lastWorkoutDate: lastDate,
    heading: 'WELCOME BACK',
    message: "You don't need to recover your old streak. You only need to begin again.",
    recommendedMinutes: 20,
    subtext: 'Consistency begins with a single modest step today.',
  };
};

/**
 * 3. "What Should I Do Today?" Engine
 * Transparent, empirical, purpose-aware recommendation
 */
export const getTodayFocus = async (userId, userPurpose = null) => {
  const workouts = await fetchUserWorkouts(userId);
  const now = new Date();

  // Check if user logged a workout today
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const trainedToday = workouts.some((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= todayStart;
  });

  // Calculate workouts completed this week (Monday to Sunday)
  const dayOfWeek = (now.getUTCDay() + 6) % 7; // Monday = 0
  const mondayStart = new Date(now);
  mondayStart.setUTCDate(now.getUTCDate() - dayOfWeek);
  mondayStart.setUTCHours(0, 0, 0, 0);

  const workoutsThisWeek = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= mondayStart;
  });

  // Get active goals if any
  let activeGoals = [];
  try {
    if (isMongoConnected()) {
      activeGoals = await FitnessGoal.find({ user: userId, status: 'ACTIVE' }).lean();
    } else {
      activeGoals = (await getDevGoals(userId)).filter((g) => g.status === 'ACTIVE');
    }
  } catch {
    activeGoals = [];
  }

  const workoutGoal = activeGoals.find((g) => g.type === 'WORKOUTS');
  const targetSessions = workoutGoal ? Number(workoutGoal.targetValue) || 3 : 3;

  const reasons = [
    `You have completed ${workoutsThisWeek.length} training ${workoutsThisWeek.length === 1 ? 'session' : 'sessions'} this week.`,
  ];

  if (workoutGoal) {
    const remaining = Math.max(0, targetSessions - workoutsThisWeek.length);
    reasons.push(`Your active mission requires ${remaining} more ${remaining === 1 ? 'session' : 'sessions'} to meet target.`);
  }

  if (trainedToday) {
    reasons.push('You have already logged a session today. Active recovery or rest is supported.');
    return {
      title: "TODAY'S EMPHASIS: RECOVERY & INTEGRATION",
      recommendedDuration: '10–15 MIN RECOVERY',
      priority: 'RECOVERY',
      trainedToday: true,
      sessionsThisWeek: workoutsThisWeek.length,
      targetSessions,
      reasons,
      actionText: 'LOG OPTIONAL STRETCH OR WALK',
    };
  }

  reasons.push('You have not logged a session today.');

  if (userPurpose && userPurpose.purposeType) {
    const purposeLabels = {
      BUILD_DISCIPLINE: 'Building Discipline',
      IMPROVE_HEALTH: 'Improving Health',
      INCREASE_ENERGY: 'Increasing Energy',
      IMPROVE_STRENGTH: 'Strength Progression',
      IMPROVE_ENDURANCE: 'Endurance Base',
      CHANGE_LIFESTYLE: 'Sustainable Lifestyle',
    };
    const label = purposeLabels[userPurpose.purposeType] || 'Your Stated Purpose';
    reasons.push(`Aligning with your core purpose: ${label}.`);
  }

  return {
    title: "TODAY'S FOCUS: SUSTAINABLE DISCIPLINE",
    recommendedDuration: '20–30 MINUTE SESSION',
    priority: 'CONSISTENCY',
    trainedToday: false,
    sessionsThisWeek: workoutsThisWeek.length,
    targetSessions,
    reasons,
    actionText: 'BEGIN TODAY’S SESSION',
  };
};

/**
 * 4. Smart Goal Adjustment Suggestions
 * Detects chronic gap between goal target and real frequency without shaming
 */
export const getGoalAdjustmentSuggestions = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);
  let activeGoals = [];

  try {
    if (isMongoConnected()) {
      activeGoals = await FitnessGoal.find({ user: userId, status: 'ACTIVE' }).lean();
    } else {
      activeGoals = (await getDevGoals(userId)).filter((g) => g.status === 'ACTIVE');
    }
  } catch {
    return null;
  }

  const workoutGoal = activeGoals.find((g) => g.type === 'WORKOUTS');
  if (!workoutGoal) return null;

  // Calculate average weekly workouts over past 21 days
  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
  const recentWorkouts = workouts.filter((w) => new Date(w.workoutDate || w.createdAt) >= threeWeeksAgo);
  const weeklyAverage = Math.round((recentWorkouts.length / 3) * 10) / 10;

  const target = Number(workoutGoal.targetValue) || 4;

  // Suggest adjustment only if actual weekly average is significantly lower than target (difference >= 1.5)
  if (target >= 4 && weeklyAverage <= target - 1.5 && recentWorkouts.length >= 2) {
    const suggested = Math.max(2, Math.round(weeklyAverage) + 1);
    return {
      goalId: workoutGoal._id,
      goalTitle: workoutGoal.title,
      targetValue: target,
      currentWeeklyAverage: weeklyAverage,
      suggestedTarget: suggested,
      heading: 'MISSION REVIEW',
      message: `Your current routine is averaging ${weeklyAverage} workouts per week (Target: ${target}). Rather than forcing the original target, F-TRACK suggests rebuilding consistency first with a sustainable baseline.`,
      recommendedAction: 'ADJUST TARGET TO ' + suggested + ' WORKOUTS/WEEK',
    };
  }

  return null;
};

/**
 * 5. Habit Risk & Behavior Pattern Detection
 * Discovers factual weekday distribution patterns from real data
 */
export const getHabitPatterns = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length < 6) {
    return {
      hasPattern: false,
      title: 'TELEMETRY ACCUMULATION',
      message: 'F-TRACK needs at least 6 logged sessions to detect your authentic behavioral rhythm without speculation.',
      sampleSize: workouts.length,
    };
  }

  // Count distribution: Monday-Wednesday vs Thursday-Sunday
  let earlyWeekCount = 0;
  let lateWeekCount = 0;

  workouts.forEach((w) => {
    const day = new Date(w.workoutDate || w.createdAt).getDay(); // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat
    if (day >= 1 && day <= 3) {
      earlyWeekCount++;
    } else {
      lateWeekCount++;
    }
  });

  const total = workouts.length;
  const earlyPct = Math.round((earlyWeekCount / total) * 100);

  if (earlyPct >= 65) {
    return {
      hasPattern: true,
      title: 'WEEKDAY MOMENTUM PATTERN',
      message: `You record ${earlyPct}% of your workouts between Monday and Wednesday, with a significant drop toward the weekend.`,
      suggestion: 'Consider scheduling a brief 15-minute mobility or walking session on Friday or Saturday to sustain rhythm across the weekend.',
      sampleSize: total,
    };
  }

  return {
    hasPattern: true,
    title: 'BALANCED TRAINING DISTRIBUTION',
    message: 'Your training frequency is evenly distributed across both weekdays and weekends.',
    suggestion: 'Continue protecting your existing pacing.',
    sampleSize: total,
  };
};

/**
 * 6. Plateau Detection Engine
 * Behavior-focused analysis of routine stabilization
 */
export const getPlateauAnalysis = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length < 8) {
    return {
      stabilized: false,
      title: 'ROUTINE FORMATION',
      message: 'Baseline training habits are currently forming. Continue establishing regular sessions.',
    };
  }

  // Inspect last 6 workouts
  const lastSix = workouts.slice(-6);
  const durations = lastSix.map((w) => w.duration || 0);
  const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  const isUniformDuration = durations.every((d) => Math.abs(d - avgDuration) <= 5);

  const activities = new Set(lastSix.map((w) => w.activityType));

  if (isUniformDuration && activities.size === 1) {
    return {
      stabilized: true,
      title: 'ROUTINE STABILIZATION OBSERVED',
      message: `Your last 6 sessions have held identical duration (~${avgDuration} min) and activity (${Array.from(activities)[0]}).`,
      recommendation: 'Your baseline has solidified. Consider adjusting one variable: increase duration by 5 minutes, alter your exercise selection, or incorporate interval pacing.',
    };
  }

  return {
    stabilized: false,
    title: 'DYNAMIC TRAINING PACING',
    message: 'Your sessions demonstrate healthy variation across duration and exercise modality.',
  };
};

/**
 * 7. Long-Term Growth Summary Engine
 * Calculates authentic positive changes over time
 */
export const getGrowthSummary = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length < 3) {
    return {
      hasGrowthData: false,
      heading: 'YOUR STORY IS JUST BEGINNING',
      message: 'Keep training. F-TRACK will map your measurable growth as your journey unfolds.',
      totalSessions: workouts.length,
    };
  }

  const firstWorkout = workouts[0];
  const firstDate = new Date(firstWorkout.workoutDate || firstWorkout.createdAt);
  const daysOnPath = Math.max(1, Math.floor((Date.now() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Calculate average session duration early vs recent
  const earlySlice = workouts.slice(0, Math.min(5, Math.floor(workouts.length / 2)));
  const recentSlice = workouts.slice(-Math.min(5, Math.floor(workouts.length / 2)));

  const earlyAvg = Math.round(earlySlice.reduce((sum, w) => sum + (w.duration || 0), 0) / earlySlice.length);
  const recentAvg = Math.round(recentSlice.reduce((sum, w) => sum + (w.duration || 0), 0) / recentSlice.length);
  const durationDelta = recentAvg - earlyAvg;

  // Total calories burned
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

  return {
    hasGrowthData: true,
    heading: 'YOUR JOURNEY TO DATE',
    totalSessions: workouts.length,
    daysOnPath,
    earlyAvgMinutes: earlyAvg,
    recentAvgMinutes: recentAvg,
    durationDelta,
    totalMinutes,
    totalCalories,
  };
};

export default {
  getJourneyMilestones,
  getReturnStatus,
  getTodayFocus,
  getGoalAdjustmentSuggestions,
  getHabitPatterns,
  getPlateauAnalysis,
  getGrowthSummary,
};
