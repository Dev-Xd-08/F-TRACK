import TrainingPlan from '../models/TrainingPlan.js';
import FitnessGoal from '../models/FitnessGoal.js';
import FitnessPurpose from '../models/FitnessPurpose.js';
import Workout from '../models/Workout.js';
import UserLifeContext from '../models/UserLifeContext.js';
import {
  isMongoConnected,
  getDevTrainingPlan,
  createDevTrainingPlan,
  updateDevTrainingPlan,
  getDevWorkouts,
  getDevGoals,
  getDevPurpose,
  getDevLifeContext,
} from './devStore.js';

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/**
 * Helper to fetch workouts for user
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
 * Helper to fetch user's active life load context
 */
export const fetchUserLifeContext = async (userId) => {
  if (isMongoConnected()) {
    try {
      let ctx = await UserLifeContext.findOne({ user: userId }).lean();
      if (!ctx) {
        ctx = await UserLifeContext.create({ user: userId });
      }
      return ctx;
    } catch {
      return await getDevLifeContext(userId);
    }
  }
  return await getDevLifeContext(userId);
};

/**
 * 1. Generate 7-Day Plan Schedule based on preferences and life load
 */
export const generatePlanSchedule = (preferences = {}) => {
  const {
    weeklyTargetSessions = 3,
    preferredSessionDuration = 25,
    preferredDays = ['MON', 'WED', 'FRI'],
    focusAreas = ['Discipline', 'General Fitness'],
    lifeLoad = 'NORMAL',
    activityType = 'General Training',
  } = preferences;

  // Adapt duration based on life load
  let duration = preferredSessionDuration;
  if (lifeLoad === 'VERY_BUSY') {
    duration = Math.min(20, Math.max(10, preferredSessionDuration - 10));
  } else if (lifeLoad === 'BUSY') {
    duration = Math.min(25, Math.max(15, preferredSessionDuration - 5));
  } else if (lifeLoad === 'LIGHT') {
    duration = Math.max(30, preferredSessionDuration);
  }

  // Determine active days
  let selectedDays = preferredDays && preferredDays.length > 0 ? [...preferredDays] : ['MON', 'WED', 'FRI'];
  if (selectedDays.length > weeklyTargetSessions) {
    selectedDays = selectedDays.slice(0, weeklyTargetSessions);
  } else if (selectedDays.length < weeklyTargetSessions) {
    // Add additional days avoiding immediate clusters
    const candidates = ['MON', 'WED', 'FRI', 'SAT', 'TUE', 'THU', 'SUN'];
    for (const cand of candidates) {
      if (!selectedDays.includes(cand) && selectedDays.length < weeklyTargetSessions) {
        selectedDays.push(cand);
      }
    }
  }

  const schedule = DAYS_OF_WEEK.map((day) => {
    const isPlanned = selectedDays.includes(day);
    if (!isPlanned) {
      return {
        dayOfWeek: day,
        plannedDuration: 0,
        activityType: 'Rest & Recovery',
        isRestDay: true,
        isOptional: false,
        notes: 'Rest & physical integration',
      };
    }

    let notes = 'Focused movement session';
    if (lifeLoad === 'VERY_BUSY') {
      notes = 'Short habit-protector session';
    } else if (day === 'SAT' || day === 'SUN') {
      notes = 'Weekend rhythm session';
    }

    return {
      dayOfWeek: day,
      plannedDuration: duration,
      activityType,
      isRestDay: false,
      isOptional: lifeLoad === 'VERY_BUSY' && selectedDays.indexOf(day) === selectedDays.length - 1,
      notes,
    };
  });

  return schedule;
};

/**
 * 2. Adaptive Week Status & Dynamic Rebalancing
 * The plan serves the person: missed sessions never trigger failure;
 * the remaining week adjusts gracefully without stacking unrealistic catch-up volume.
 */
export const getAdaptiveWeekStatus = async (userId) => {
  const [workouts, lifeCtx] = await Promise.all([
    fetchUserWorkouts(userId),
    fetchUserLifeContext(userId),
  ]);

  // Fetch or resolve active training plan
  let plan = null;
  if (isMongoConnected()) {
    try {
      plan = await TrainingPlan.findOne({ user: userId, status: 'ACTIVE' }).lean();
    } catch {
      plan = await getDevTrainingPlan(userId);
    }
  } else {
    plan = await getDevTrainingPlan(userId);
  }

  // Active goals check if target sessions need default
  let targetSessions = plan ? plan.weeklyTargetSessions : 3;
  let preferredDuration = plan ? plan.preferredSessionDuration : 25;
  let schedule = plan && plan.schedule && plan.schedule.length === 7
    ? plan.schedule
    : generatePlanSchedule({
        weeklyTargetSessions: targetSessions,
        preferredSessionDuration: preferredDuration,
        preferredDays: plan?.preferredDays || ['MON', 'WED', 'FRI'],
        lifeLoad: lifeCtx?.lifeLoad || 'NORMAL',
      });

  // Calculate current week date boundaries (Monday 00:00:00 to Sunday 23:59:59 UTC/Local)
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  const currentDayCode = DAYS_OF_WEEK[dayIndex];

  // Monday start of this week
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayIndex);
  monday.setHours(0, 0, 0, 0);

  // Sunday end of this week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Filter workouts belonging to this week
  const thisWeekWorkouts = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= monday && d <= sunday;
  });

  // Map each day of current week with authentic state
  let missedSessionsCount = 0;
  const daysStatus = DAYS_OF_WEEK.map((code, idx) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + idx);
    const dateStr = dayDate.toISOString().split('T')[0];

    const isToday = idx === dayIndex;
    const isPast = idx < dayIndex;
    const isFuture = idx > dayIndex;

    // Find if user logged a workout on this calendar day
    const dayWorkouts = thisWeekWorkouts.filter((w) => {
      const d = new Date(w.workoutDate || w.createdAt);
      return (
        d.getFullYear() === dayDate.getFullYear() &&
        d.getMonth() === dayDate.getMonth() &&
        d.getDate() === dayDate.getDate()
      );
    });

    const hasTrained = dayWorkouts.length > 0;
    const planned = schedule.find((s) => s.dayOfWeek === code) || {
      isRestDay: true,
      plannedDuration: 0,
      activityType: 'Rest',
    };

    let status = 'PLANNED';
    if (hasTrained) {
      status = 'COMPLETED';
    } else if (isPast) {
      if (planned.isRestDay) {
        status = 'REST_DAY';
      } else {
        status = 'MISSED';
        missedSessionsCount++;
      }
    } else if (isToday) {
      status = planned.isRestDay ? 'REST_DAY' : 'TODAY_PLANNED';
    } else {
      status = planned.isRestDay ? 'REST_DAY' : 'UPCOMING_PLANNED';
    }

    return {
      dayOfWeek: code,
      date: dateStr,
      isToday,
      isPast,
      isFuture,
      status,
      plannedDuration: planned.plannedDuration,
      activityType: planned.activityType,
      isRestDay: planned.isRestDay,
      isOptional: planned.isOptional,
      workouts: dayWorkouts,
    };
  });

  const completedSessions = thisWeekWorkouts.length;
  const remainingDaysCount = Math.max(0, 6 - dayIndex); // days after today

  // Intelligent Adaptive Rebalancing
  let rebalanceNeeded = false;
  let rebalanceMessage = null;
  let rebalancedRemainingSchedule = [];

  const remainingNeeded = Math.max(0, targetSessions - completedSessions);

  if (missedSessionsCount > 0 && remainingDaysCount > 0 && remainingNeeded > 0) {
    rebalanceNeeded = true;
    const sessionsCanFit = Math.min(remainingDaysCount, remainingNeeded);

    rebalanceMessage = {
      heading: 'THE PLAN ADAPTED',
      body: `You missed a planned session earlier this week. Nothing is erased. There are still ${remainingDaysCount} ${remainingDaysCount === 1 ? 'day' : 'days'} available. F-TRACK calibrated the remaining schedule for sustainable continuity.`,
      adjustedTarget: completedSessions + sessionsCanFit,
    };

    // Rebalance upcoming future days realistically (max 1 session per day, no heavy stacking)
    let assigned = 0;
    rebalancedRemainingSchedule = daysStatus
      .filter((d) => d.isFuture)
      .map((day) => {
        if (assigned < sessionsCanFit) {
          assigned++;
          return {
            dayOfWeek: day.dayOfWeek,
            date: day.date,
            action: 'TRAIN',
            recommendedDuration: lifeCtx?.lifeLoad === 'VERY_BUSY' ? 15 : preferredDuration,
            note: 'Calibrated rebalanced session',
          };
        }
        return {
          dayOfWeek: day.dayOfWeek,
          date: day.date,
          action: 'REST',
          recommendedDuration: 0,
          note: 'Rest & balance',
        };
      });
  }

  return {
    planId: plan ? plan._id : null,
    planName: plan ? plan.name : 'Adaptive Weekly Schedule',
    status: plan ? plan.status : 'ACTIVE',
    targetSessions,
    completedSessions,
    remainingSessionsNeeded: remainingNeeded,
    daysRemainingInWeek: remainingDaysCount,
    lifeLoad: lifeCtx?.lifeLoad || 'NORMAL',
    todayAvailableMinutes: lifeCtx?.todayAvailableMinutes || 25,
    days: daysStatus,
    rebalanceNeeded,
    rebalanceMessage,
    rebalancedRemainingSchedule,
  };
};

/**
 * 3. Load Check / Balance Signal
 * Strictly non-medical volume & frequency observation.
 */
export const calculateLoadCheck = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length === 0) {
    return {
      status: 'FRESH',
      message: 'No recent load accumulated. Commencing from rested baseline.',
      consecutiveDays: 0,
      recentSessionsCount: 0,
      suggestion: 'Begin with a comfortable, unforced session.',
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const fiveDaysAgo = new Date(now - 5 * dayMs);

  const recentSessions = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= fiveDaysAgo;
  });

  // Calculate consecutive training days up to today
  let consecutiveDays = 0;
  const checkDate = new Date();
  for (let i = 0; i < 7; i++) {
    const cur = new Date(checkDate.getTime() - i * dayMs);
    const trained = workouts.some((w) => {
      const d = new Date(w.workoutDate || w.createdAt);
      return (
        d.getFullYear() === cur.getFullYear() &&
        d.getMonth() === cur.getMonth() &&
        d.getDate() === cur.getDate()
      );
    });

    if (trained) {
      consecutiveDays++;
    } else if (i > 0) {
      break; // Streak of consecutive days broken
    }
  }

  if (recentSessions.length >= 4 || consecutiveDays >= 4) {
    return {
      status: 'HIGH_VOLUME',
      heading: 'VOLUME CHECK',
      message: `You've logged ${recentSessions.length} sessions across the last 5 days.`,
      suggestion: 'A lighter movement or active mobility session fits your current pattern. This is a planning suggestion based on your logged activity.',
      consecutiveDays,
      recentSessionsCount: recentSessions.length,
    };
  }

  if (recentSessions.length >= 2) {
    return {
      status: 'BALANCED',
      heading: 'STEADY PACING',
      message: `You've logged ${recentSessions.length} sessions over the past 5 days with balanced intervals.`,
      suggestion: 'Your training cadence demonstrates healthy pacing. Continue maintaining regular rhythm.',
      consecutiveDays,
      recentSessionsCount: recentSessions.length,
    };
  }

  return {
    status: 'RESTED',
    heading: 'SUFFICIENT CAPACITY',
    message: 'Ready for today’s training session.',
    suggestion: 'Step into today’s session with focused, steady effort.',
    consecutiveDays,
    recentSessionsCount: recentSessions.length,
  };
};

/**
 * 4. Activity Mix & Training Balance Analysis
 */
export const calculateActivityBalance = async (userId) => {
  const workouts = await fetchUserWorkouts(userId);

  if (workouts.length < 3) {
    return {
      hasData: false,
      message: 'Accumulating session variety telemetry.',
      mix: [],
    };
  }

  const recent = workouts.slice(-15); // Inspect last 15 sessions
  const counts = {};
  recent.forEach((w) => {
    const act = w.activityType || 'General Training';
    counts[act] = (counts[act] || 0) + 1;
  });

  const mix = Object.entries(counts).map(([activity, count]) => ({
    activity,
    count,
    percentage: Math.round((count / recent.length) * 100),
  })).sort((a, b) => b.percentage - a.percentage);

  const primary = mix[0];
  let observation = `Most of your recent sessions (${primary.percentage}%) have been ${primary.activity.toLowerCase()}-based.`;
  if (primary.percentage >= 65 && mix.length > 1) {
    observation += ' If movement variety is one of your goals, consider introducing an alternative activity this week.';
  } else {
    observation += ' Your routine shows healthy cross-movement diversity.';
  }

  return {
    hasData: true,
    sampleSize: recent.length,
    mix,
    observation,
  };
};

export default {
  generatePlanSchedule,
  getAdaptiveWeekStatus,
  calculateLoadCheck,
  calculateActivityBalance,
  fetchUserLifeContext,
};
