import Workout from '../models/Workout.js';
import { isMongoConnected, getDevWorkouts } from './devStore.js';

/**
 * Helper to fetch workouts for user sorted chronologically
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
 * 1. Personal Baseline Calculation
 * Derives user's authentic historical normal from real logged sessions.
 * Never compares against external users or arbitrary standards.
 */
export const calculatePersonalBaseline = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length < 3) {
    return {
      hasBaseline: false,
      status: 'BASELINE STILL FORMING',
      message: 'Complete a few more sessions and F-TRACK will learn your personal pattern.',
      sampleSize: workouts.length,
      requiredSamples: 3,
    };
  }

  // Durations
  const durations = workouts.map((w) => Number(w.duration) || 0).filter((d) => d > 0);
  const totalDuration = durations.reduce((a, b) => a + b, 0);
  const typicalDuration = Math.round(totalDuration / (durations.length || 1));

  // Median duration
  const sortedDurations = [...durations].sort((a, b) => a - b);
  const mid = Math.floor(sortedDurations.length / 2);
  const medianDuration = sortedDurations.length % 2 !== 0
    ? sortedDurations[mid]
    : Math.round((sortedDurations[mid - 1] + sortedDurations[mid]) / 2);

  // Longest recorded session
  const longestSession = sortedDurations.length > 0 ? sortedDurations[sortedDurations.length - 1] : 0;

  // Typical calories
  const calories = workouts.map((w) => Number(w.caloriesBurned) || 0).filter((c) => c > 0);
  const typicalCalories = calories.length > 0
    ? Math.round(calories.reduce((a, b) => a + b, 0) / calories.length)
    : 0;

  // Activity distribution & most common activity
  const activityCounts = {};
  workouts.forEach((w) => {
    const act = w.activityType || 'General Training';
    activityCounts[act] = (activityCounts[act] || 0) + 1;
  });

  let mostCommonActivity = 'General Training';
  let maxCount = 0;
  const activityDistribution = [];

  for (const [act, count] of Object.entries(activityCounts)) {
    const pct = Math.round((count / workouts.length) * 100);
    activityDistribution.push({ activity: act, count, percentage: pct });
    if (count > maxCount) {
      maxCount = count;
      mostCommonActivity = act;
    }
  }
  activityDistribution.sort((a, b) => b.count - a.count);

  // Day of week distribution
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayCounts = { SUN: 0, MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0 };
  workouts.forEach((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    const dayName = dayNames[d.getDay()];
    if (dayName) dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });

  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonDays = sortedDays.slice(0, 3).filter((d) => d[1] > 0).map((d) => d[0]);

  // Weekly frequency calculation across active weeks
  const firstDate = new Date(workouts[0].workoutDate || workouts[0].createdAt);
  const lastDate = new Date(workouts[workouts.length - 1].workoutDate || workouts[workouts.length - 1].createdAt);
  const totalWeeks = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
  const averageSessionsPerWeek = Math.round((workouts.length / totalWeeks) * 10) / 10;

  // 4-Week Average (past 28 days)
  const now = Date.now();
  const fourWeeksAgo = new Date(now - 28 * 24 * 60 * 60 * 1000);
  const recentWorkouts = workouts.filter((w) => new Date(w.workoutDate || w.createdAt) >= fourWeeksAgo);
  const fourWeekAverage = Math.round((recentWorkouts.length / 4) * 10) / 10;

  return {
    hasBaseline: true,
    status: 'ESTABLISHED BASELINE',
    typicalDuration,
    medianDuration,
    longestSession,
    typicalCalories,
    mostCommonActivity,
    activityDistribution,
    mostCommonDays,
    averageSessionsPerWeek,
    fourWeekAverage,
    totalSessions: workouts.length,
    activeWeeks: totalWeeks,
  };
};

/**
 * 2. Self-Comparison Calculation
 * Compares current 30-day period with the preceding 30-day period.
 * Strict privacy: compares user ONLY against their own past self.
 */
export const calculateSelfComparison = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length < 4) {
    return {
      hasComparison: false,
      message: 'F-TRACK requires at least 4 recorded sessions across multiple weeks to generate self-comparisons.',
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = new Date(now - 30 * dayMs);
  const sixtyDaysAgo = new Date(now - 60 * dayMs);

  const currentMonthWorkouts = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= thirtyDaysAgo;
  });

  const previousMonthWorkouts = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  });

  // If user hasn't trained in the previous 30-60 day window, compare early half vs recent half
  if (previousMonthWorkouts.length === 0 && currentMonthWorkouts.length < 2) {
    return {
      hasComparison: false,
      message: 'Accumulating comparative month data. Continue training to unlock self-comparison metrics.',
    };
  }

  // Active Minutes
  const currentMinutes = currentMonthWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const prevMinutes = previousMonthWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
  const minutesPct = prevMinutes > 0
    ? Math.round(((currentMinutes - prevMinutes) / prevMinutes) * 100)
    : currentMinutes > 0 ? 100 : 0;

  // Session counts
  const sessionsDelta = currentMonthWorkouts.length - previousMonthWorkouts.length;

  // Average session duration
  const currentAvgDur = currentMonthWorkouts.length > 0
    ? Math.round(currentMinutes / currentMonthWorkouts.length)
    : 0;
  const prevAvgDur = previousMonthWorkouts.length > 0
    ? Math.round(prevMinutes / previousMonthWorkouts.length)
    : 0;
  const durationDelta = currentAvgDur - prevAvgDur;

  // Calories
  const currentCals = currentMonthWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);
  const prevCals = previousMonthWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0);

  return {
    hasComparison: true,
    heading: 'THIS MONTH vs YOUR PREVIOUS MONTH',
    periodLabel: 'Last 30 Days vs Prior 30 Days',
    metrics: {
      activeMinutes: {
        current: currentMinutes,
        previous: prevMinutes,
        percentChange: minutesPct,
        formattedDelta: minutesPct >= 0 ? `+${minutesPct}%` : `${minutesPct}%`,
      },
      sessions: {
        current: currentMonthWorkouts.length,
        previous: previousMonthWorkouts.length,
        delta: sessionsDelta,
        formattedDelta: sessionsDelta >= 0 ? `+${sessionsDelta}` : `${sessionsDelta}`,
      },
      averageDuration: {
        current: currentAvgDur,
        previous: prevAvgDur,
        delta: durationDelta,
        formattedDelta: durationDelta >= 0 ? `+${durationDelta}m` : `${durationDelta}m`,
      },
      calories: {
        current: currentCals,
        previous: prevCals,
        delta: currentCals - prevCals,
      },
    },
  };
};

export default {
  calculatePersonalBaseline,
  calculateSelfComparison,
};
