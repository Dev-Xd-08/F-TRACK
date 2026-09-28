import Workout from '../models/Workout.js';
import FitnessGoal from '../models/FitnessGoal.js';
import FitnessPurpose from '../models/FitnessPurpose.js';
import WorkoutReflection from '../models/WorkoutReflection.js';
import WeeklyReflection from '../models/WeeklyReflection.js';
import TrainingPlan from '../models/TrainingPlan.js';
import UserLifeContext from '../models/UserLifeContext.js';
import {
  isMongoConnected,
  getDevWorkouts,
  getDevGoals,
  getDevPurpose,
  getDevReflections,
  getDevWeeklyReflections,
  getDevTrainingPlan,
  getDevLifeContext,
} from './devStore.js';
import { getUserProgressionData } from './progressionEngine.js';
import { getUserPersonalRecords } from './recordEngine.js';
import { calculatePersonalBaseline } from './baselineEngine.js';
import { getAdaptiveWeekStatus, calculateLoadCheck, fetchUserLifeContext } from './trainingPlanEngine.js';

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format ISO Date string YYYY-MM-DD
 */
const toISODate = (d = new Date()) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Format date for display (e.g. "OCT 14, 2026")
 */
const formatDisplayDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
};

/**
 * Fetch all workouts for user sorted chronologically
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
  return [...workouts].sort((a, b) => new Date(a.workoutDate || a.createdAt) - new Date(b.workoutDate || b.createdAt));
};

/**
 * Fetch active goals for user
 */
const fetchUserGoals = async (userId) => {
  if (isMongoConnected()) {
    try {
      return await FitnessGoal.find({ user: userId }).sort({ createdAt: -1 }).lean();
    } catch {
      return await getDevGoals(userId);
    }
  }
  return await getDevGoals(userId);
};

/**
 * Fetch purpose for user
 */
const fetchUserPurpose = async (userId) => {
  if (isMongoConnected()) {
    try {
      return await FitnessPurpose.findOne({ user: userId, active: true }).lean();
    } catch {
      return await getDevPurpose(userId);
    }
  }
  return await getDevPurpose(userId);
};

/**
 * Fetch workout reflections for user
 */
const fetchUserWorkoutReflections = async (userId) => {
  if (isMongoConnected()) {
    try {
      return await WorkoutReflection.find({ user: userId }).sort({ createdAt: -1 }).lean();
    } catch {
      return await getDevReflections(userId);
    }
  }
  return await getDevReflections(userId);
};

/**
 * Fetch weekly reflections for user
 */
const fetchUserWeeklyReflections = async (userId) => {
  if (isMongoConnected()) {
    try {
      return await WeeklyReflection.find({ user: userId }).sort({ weekStart: -1 }).lean();
    } catch {
      return await getDevWeeklyReflections(userId);
    }
  }
  return await getDevWeeklyReflections(userId);
};

/**
 * Fetch active training plan for user
 */
const fetchUserTrainingPlan = async (userId) => {
  if (isMongoConnected()) {
    try {
      return await TrainingPlan.findOne({ user: userId, status: 'ACTIVE' }).lean();
    } catch {
      return await getDevTrainingPlan(userId);
    }
  }
  return await getDevTrainingPlan(userId);
};

/* ─────────────────────────────────────────────────────────────
   1. DATA QUALITY & DATA GAP DETECTION
───────────────────────────────────────────────────────────── */
const analyzeDataQualityAndGaps = (workouts, goals, purpose, reflections, weeklyReflections, plan) => {
  const workoutCount = workouts.length;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  let historyDays = 0;
  let firstWorkoutDate = null;
  let lastWorkoutDate = null;

  if (workoutCount > 0) {
    firstWorkoutDate = workouts[0].workoutDate || workouts[0].createdAt;
    lastWorkoutDate = workouts[workoutCount - 1].workoutDate || workouts[workoutCount - 1].createdAt;
    const diff = new Date(lastWorkoutDate).getTime() - new Date(firstWorkoutDate).getTime();
    historyDays = Math.max(1, Math.round(diff / dayMs));
  }

  const sufficient = workoutCount >= 3;
  const dataGaps = [];

  if (workoutCount === 0) {
    dataGaps.push({
      id: 'gap_no_workouts',
      title: 'TRAINING TELEMETRY PENDING',
      category: 'WORKOUTS',
      observation: 'Zero training sessions logged.',
      evidence: 'No recorded workouts in your archive.',
      meaning: 'Deep intelligence requires real movement data to establish baseline habits and patterns.',
      nextStep: 'Log your first workout to begin generating personalized telemetry.',
    });
  } else if (workoutCount < 3) {
    dataGaps.push({
      id: 'gap_forming_baseline',
      title: 'BASELINE STILL FORMING',
      category: 'WORKOUTS',
      observation: `You have recorded ${workoutCount} of 3 sessions needed for baseline derivation.`,
      evidence: `${workoutCount} session${workoutCount === 1 ? '' : 's'} recorded.`,
      meaning: 'F-TRACK holds conclusions until at least 3 sessions exist to avoid making hasty assumptions.',
      nextStep: 'Complete your next session to lock in your initial historical normal.',
    });
  }

  if (!purpose || !purpose.purposeType) {
    dataGaps.push({
      id: 'gap_no_purpose',
      title: 'PURPOSE NOT CONFIGURED',
      category: 'PURPOSE',
      observation: 'No overarching training purpose declared.',
      evidence: 'Stage 19 Purpose profile is empty.',
      meaning: 'Declaring your core "Why" connects daily effort to personal meaning and aligns recommendations.',
      nextStep: 'Complete your Purpose Profile to anchor your training path.',
    });
  }

  if (!goals || goals.filter((g) => g.status === 'ACTIVE').length === 0) {
    dataGaps.push({
      id: 'gap_no_goals',
      title: 'NO ACTIVE MISSIONS',
      category: 'GOALS',
      observation: 'No active fitness goals currently tracked.',
      evidence: 'Zero active goals in mission planning.',
      meaning: 'Active goals provide direction and allow F-TRACK to measure momentum and pace.',
      nextStep: 'Establish a realistic personal goal in Mission Planning.',
    });
  }

  if (!plan) {
    dataGaps.push({
      id: 'gap_no_plan',
      title: 'DEFAULT ADAPTIVE SCHEDULE IN USE',
      category: 'PLAN',
      observation: 'Custom weekly training plan not calibrated.',
      evidence: 'Operating on default 3-day adaptive schedule.',
      meaning: 'Customizing preferred days and durations helps F-TRACK adapt to real-life friction.',
      nextStep: 'Calibrate your weekly plan in the Training Plan builder.',
    });
  }

  if (!reflections || reflections.length === 0) {
    dataGaps.push({
      id: 'gap_no_reflections',
      title: 'SESSION CONTEXT UNOBSERVED',
      category: 'REFLECTIONS',
      observation: 'No post-session reflections recorded.',
      evidence: 'Zero subjective effort ratings logged.',
      meaning: 'Reflections inform how effort felt, identifying fatigue before it leads to burnout.',
      nextStep: 'Add an effort rating after your next workout.',
    });
  }

  if (!weeklyReflections || weeklyReflections.length === 0) {
    dataGaps.push({
      id: 'gap_no_weekly_reviews',
      title: 'WEEKLY INTROSPECTION EMPTY',
      category: 'WEEKLY_REVIEWS',
      observation: 'No end-of-week reviews saved.',
      evidence: 'Zero weekly reflection entries in journey history.',
      meaning: 'Weekly calibration turns physical output into sustainable long-term self-awareness.',
      nextStep: 'Complete a brief 2-minute weekly review at the end of this week.',
    });
  }

  return {
    dataQuality: {
      sufficient,
      workoutCount,
      historyDays,
      firstWorkoutDate,
      lastWorkoutDate,
    },
    dataGaps,
  };
};

/* ─────────────────────────────────────────────────────────────
   2. PERSONAL PATTERN DETECTION
───────────────────────────────────────────────────────────── */
const detectPersonalPatterns = (workouts, plan, lifeCtx, baseline) => {
  const patterns = [];
  const count = workouts.length;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  if (count < 2) {
    return [
      {
        id: 'pattern_insufficient',
        type: 'CONSISTENCY',
        title: 'PATTERNS FORMING',
        status: 'INSUFFICIENT_HISTORY',
        observation: 'Not enough history to detect recurring patterns yet.',
        evidence: `${count} session${count === 1 ? '' : 's'} recorded.`,
        meaning: 'Behavioral patterns emerge across multiple weeks of natural activity.',
        nextStep: 'Continue logging regular training sessions.',
      },
    ];
  }

  // A. Consistency Pattern (14d vs prior 14d)
  const fourteenDaysAgo = new Date(now - 14 * dayMs);
  const twentyEightDaysAgo = new Date(now - 28 * dayMs);

  const recent14 = workouts.filter((w) => new Date(w.workoutDate || w.createdAt) >= fourteenDaysAgo);
  const prior14 = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= twentyEightDaysAgo && d < fourteenDaysAgo;
  });

  let consistencyStatus = 'STABLE';
  let consistencyObs = 'Your workout frequency is steady across recent periods.';
  let consistencyMeaning = 'Consistency is the primary driver of physical resilience.';
  let consistencyNext = 'Maintain your current sustainable cadence.';

  if (recent14.length > prior14.length) {
    consistencyStatus = 'IMPROVING';
    consistencyObs = 'Your workout frequency has increased compared with your previous period.';
    consistencyMeaning = 'Cadence expansion indicates positive momentum without forcing excessive load.';
    consistencyNext = 'Ensure adequate rest intervals between sessions to sustain this pace.';
  } else if (recent14.length < prior14.length && prior14.length >= 2) {
    consistencyStatus = 'DECLINING';
    consistencyObs = 'Your workout frequency has eased compared with your previous period.';
    consistencyMeaning = 'Natural life fluctuations occur. Continuity over intensity prevents total hiatus.';
    consistencyNext = 'Consider logging a brief 10–15 minute habit-protector session to restore rhythm.';
  }

  patterns.push({
    id: 'pattern_consistency',
    type: 'CONSISTENCY',
    title: 'CONSISTENCY TREND',
    status: consistencyStatus,
    observation: consistencyObs,
    evidence: `${recent14.length} session${recent14.length === 1 ? '' : 's'} in the last 14 days vs ${prior14.length} in the prior 14 days.`,
    meaning: consistencyMeaning,
    nextStep: consistencyNext,
  });

  // B. Training Window Pattern (Day of week & Weekday vs Weekend)
  const dayCounts = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };
  let weekdayCount = 0;
  let weekendCount = 0;
  let hasTimestampVariation = false;
  const hourBuckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  workouts.forEach((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    const dayIdx = (d.getDay() + 6) % 7; // Monday = 0
    const code = DAYS_OF_WEEK[dayIdx];
    if (code) dayCounts[code]++;

    if (dayIdx >= 5) weekendCount++;
    else weekdayCount++;

    const hr = d.getHours();
    if (hr !== 0 || d.getMinutes() !== 0) {
      hasTimestampVariation = true;
      if (hr >= 5 && hr < 12) hourBuckets.morning++;
      else if (hr >= 12 && hr < 17) hourBuckets.afternoon++;
      else if (hr >= 17 && hr < 22) hourBuckets.evening++;
      else hourBuckets.night++;
    }
  });

  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
  const topDay = sortedDays[0];

  let windowObservation = `You train most frequently on ${topDay[0]} (${topDay[1]} session${topDay[1] === 1 ? '' : 's'}).`;
  if (weekendCount > weekdayCount && weekendCount >= 2) {
    windowObservation += ' Your activity leans predominantly toward weekends.';
  } else if (weekdayCount >= weekendCount * 2) {
    windowObservation += ' Your training is concentrated primarily during weekdays.';
  }

  let windowEvidence = `Weekday sessions: ${weekdayCount} • Weekend sessions: ${weekendCount}.`;
  if (hasTimestampVariation) {
    const sortedHours = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1]);
    if (sortedHours[0][1] >= 2) {
      windowEvidence += ` Time of day: Most sessions occur during the ${sortedHours[0][0]}.`;
    }
  }

  patterns.push({
    id: 'pattern_training_window',
    type: 'TRAINING_WINDOW',
    title: 'TRAINING WINDOW CADENCE',
    status: 'OBSERVATION',
    observation: windowObservation,
    evidence: windowEvidence,
    meaning: 'Honoring your organic schedule rhythm reduces willpower expenditure.',
    nextStep: 'Align your planned target days with the days you naturally have the highest completion rate.',
  });

  // C. Session Length Pattern (Reality Fit vs Plan)
  const durations = workouts.map((w) => Number(w.duration) || 0).filter((d) => d > 0);
  const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / (durations.length || 1));
  const planTargetDuration = plan?.preferredSessionDuration || 25;

  let realityFitStatus = 'BALANCED';
  let realityFitObs = `Your average completed session is ${avgDuration} minutes, which aligns cleanly with your ${planTargetDuration}-minute plan target.`;
  let realityFitMeaning = 'Realistic expectation matching protects workout consistency and eliminates guilt.';
  let realityFitNext = 'Keep your current duration target stable.';

  if (planTargetDuration - avgDuration >= 15 && count >= 3) {
    realityFitStatus = 'MISALIGNED';
    realityFitObs = `Your recent completed sessions average ${avgDuration} minutes, while your active plan targets ${planTargetDuration} minutes.`;
    realityFitMeaning = 'When plan expectations exceed practical time constraints, routine friction increases.';
    realityFitNext = `Consider calibrating your plan's preferred session length down to ${avgDuration}–${avgDuration + 5} minutes for higher completion fidelity.`;
  } else if (avgDuration - planTargetDuration >= 15 && count >= 3) {
    realityFitStatus = 'EXCEEDING';
    realityFitObs = `Your completed sessions average ${avgDuration} minutes, comfortably exceeding your ${planTargetDuration}-minute plan target.`;
    realityFitMeaning = 'You have demonstrated capacity for longer volume without forcing.';
    realityFitNext = 'You can optionally update your target duration if you want your weekly planning to reflect this standard.';
  }

  patterns.push({
    id: 'pattern_session_length',
    type: 'REALITY_FIT',
    title: 'SESSION LENGTH REALITY FIT',
    status: realityFitStatus,
    observation: realityFitObs,
    evidence: `Average completed duration: ${avgDuration}m • Active plan target: ${planTargetDuration}m across ${count} sessions.`,
    meaning: realityFitMeaning,
    nextStep: realityFitNext,
  });

  // D. Activity Preference Pattern
  const actCounts = {};
  workouts.forEach((w) => {
    const act = w.activityType || 'General Training';
    actCounts[act] = (actCounts[act] || 0) + 1;
  });

  const sortedActs = Object.entries(actCounts).map(([activity, cnt]) => ({
    activity,
    count: cnt,
    percentage: Math.round((cnt / count) * 100),
  })).sort((a, b) => b.count - a.count);

  const primaryAct = sortedActs[0];
  const secondaryAct = sortedActs[1] || null;

  let actObs = `${primaryAct.activity} represents ${primaryAct.percentage}% of your recorded training volume.`;
  if (secondaryAct) {
    actObs += ` ${secondaryAct.activity} is your secondary discipline (${secondaryAct.percentage}%).`;
  }

  patterns.push({
    id: 'pattern_activity_preference',
    type: 'MOVEMENT_PATTERN',
    title: 'MOVEMENT DISCIPLINE PREFERENCE',
    status: primaryAct.percentage >= 70 ? 'FOCUSED' : 'DIVERSE',
    observation: actObs,
    evidence: `${sortedActs.length} distinct movement disciplines logged across ${count} total sessions.`,
    meaning: 'Focusing on activities you naturally enjoy builds deep habit sustainability.',
    nextStep: primaryAct.percentage >= 70
      ? 'If cross-training is desired, introduce a complementary mobility or low-impact session once per week.'
      : 'Maintain your healthy movement variety.',
  });

  return patterns;
};

/* ─────────────────────────────────────────────────────────────
   3. "WHAT CHANGED?" COMPARISON ENGINE
───────────────────────────────────────────────────────────── */
const calculateWhatChanged = (workouts) => {
  const count = workouts.length;
  if (count < 3) {
    return {
      hasComparison: false,
      periodLabel: 'Last 14 Days vs Prior 14 Days',
      message: 'Accumulating comparative window telemetry. Requires at least 3 workouts across multiple weeks.',
      metrics: [],
      summaryExplanation: 'Continue training to unlock multi-period differential telemetry.',
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = new Date(now - 14 * dayMs);
  const twentyEightDaysAgo = new Date(now - 28 * dayMs);

  const cur14 = workouts.filter((w) => new Date(w.workoutDate || w.createdAt) >= fourteenDaysAgo);
  const prev14 = workouts.filter((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= twentyEightDaysAgo && d < fourteenDaysAgo;
  });

  // Calculate metrics
  const curWorkouts = cur14.length;
  const prevWorkouts = prev14.length;
  const workoutDelta = curWorkouts - prevWorkouts;

  const curMinutes = cur14.reduce((s, w) => s + (Number(w.duration) || 0), 0);
  const prevMinutes = prev14.reduce((s, w) => s + (Number(w.duration) || 0), 0);
  const minutesDelta = curMinutes - prevMinutes;

  const curAvgDur = curWorkouts > 0 ? Math.round(curMinutes / curWorkouts) : 0;
  const prevAvgDur = prevWorkouts > 0 ? Math.round(prevMinutes / prevWorkouts) : 0;
  const avgDurDelta = curAvgDur - prevAvgDur;

  const curCals = cur14.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0);
  const prevCals = prev14.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0);
  const calsDelta = curCals - prevCals;

  // Primary activity comparison
  const getTopAct = (arr) => {
    if (arr.length === 0) return 'None';
    const c = {};
    arr.forEach((w) => {
      const a = w.activityType || 'General Training';
      c[a] = (c[a] || 0) + 1;
    });
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
  };

  const curTopAct = getTopAct(cur14);
  const prevTopAct = getTopAct(prev14);

  // Generate explanation
  let summary = '';
  if (workoutDelta > 0) {
    summary = `You logged ${workoutDelta} more workout${workoutDelta === 1 ? '' : 's'} and ${Math.abs(minutesDelta)} more active minutes than during the previous 14-day window.`;
  } else if (workoutDelta < 0) {
    summary = `You recorded ${Math.abs(workoutDelta)} fewer session${Math.abs(workoutDelta) === 1 ? '' : 's'} than during the previous 14-day window, with total active duration easing by ${Math.abs(minutesDelta)} minutes.`;
  } else {
    summary = `Your workout frequency matched the previous 14-day window exactly (${curWorkouts} sessions), maintaining steady cadence.`;
  }

  return {
    hasComparison: true,
    periodLabel: 'Last 14 Days vs Prior 14 Days',
    summaryExplanation: summary,
    metrics: [
      {
        label: 'WORKOUT SESSIONS',
        current: curWorkouts,
        previous: prevWorkouts,
        delta: workoutDelta,
        formattedDelta: workoutDelta >= 0 ? `+${workoutDelta}` : `${workoutDelta}`,
        unit: 'sessions',
        trend: workoutDelta > 0 ? 'UP' : workoutDelta < 0 ? 'DOWN' : 'EQUAL',
      },
      {
        label: 'ACTIVE MINUTES',
        current: curMinutes,
        previous: prevMinutes,
        delta: minutesDelta,
        formattedDelta: minutesDelta >= 0 ? `+${minutesDelta}m` : `${minutesDelta}m`,
        unit: 'min',
        trend: minutesDelta > 0 ? 'UP' : minutesDelta < 0 ? 'DOWN' : 'EQUAL',
      },
      {
        label: 'AVERAGE SESSION',
        current: curAvgDur,
        previous: prevAvgDur,
        delta: avgDurDelta,
        formattedDelta: avgDurDelta >= 0 ? `+${avgDurDelta}m` : `${avgDurDelta}m`,
        unit: 'min',
        trend: avgDurDelta > 0 ? 'UP' : avgDurDelta < 0 ? 'DOWN' : 'EQUAL',
      },
      {
        label: 'ESTIMATED KCAL',
        current: curCals,
        previous: prevCals,
        delta: calsDelta,
        formattedDelta: calsDelta >= 0 ? `+${calsDelta.toLocaleString()}` : `${calsDelta.toLocaleString()}`,
        unit: 'kcal',
        trend: calsDelta > 0 ? 'UP' : calsDelta < 0 ? 'DOWN' : 'EQUAL',
      },
    ],
    primaryDisciplineShift: {
      current: curTopAct,
      previous: prevTopAct,
      changed: curTopAct !== prevTopAct && curWorkouts > 0 && prevWorkouts > 0,
    },
  };
};

/* ─────────────────────────────────────────────────────────────
   4. PLAN ADHERENCE & ADAPTIVE FIT
───────────────────────────────────────────────────────────── */
const analyzePlanFit = (weekStatus, plan) => {
  if (!plan) {
    return {
      status: 'UNCONFIGURED',
      title: 'PLAN FIT: BASELINE ADAPTIVE',
      observation: 'Operating without a personalized training plan configuration.',
      evidence: 'Default 3-session weekly adaptive model active.',
      meaning: 'Establishing your target session cadence allows F-TRACK to adapt schedule rebalancing accurately.',
      nextStep: 'Create a custom plan in Training Plan settings.',
      completionRatio: 0,
      plannedSessions: 3,
      completedSessions: weekStatus?.completedSessions || 0,
    };
  }

  const target = weekStatus?.targetSessions || plan.weeklyTargetSessions || 3;
  const completed = weekStatus?.completedSessions || 0;
  const ratio = Math.round((completed / (target || 1)) * 100);
  const rebalanceNeeded = weekStatus?.rebalanceNeeded || false;

  let fitStatus = 'BALANCED_FIT';
  let fitObs = `You have completed ${completed} of ${target} planned sessions this week (${ratio}%).`;
  let fitMeaning = 'Your training cadence is tracking with your target expectations.';
  let fitNext = 'Continue through the remaining week sessions without accelerating.';

  if (completed >= target) {
    fitStatus = 'TARGET_REACHED';
    fitObs = `You reached your weekly target with ${completed} of ${target} planned sessions complete.`;
    fitMeaning = 'Consistent weekly execution consolidates physical conditioning.';
    fitNext = 'Use remaining days for rest or optional light recovery movement.';
  } else if (rebalanceNeeded) {
    fitStatus = 'ADAPTED';
    fitObs = `The weekly plan adapted after a missed session. Remaining sessions are calibrated to available days without stacking.`;
    fitMeaning = 'The plan serves the person: missed sessions never trigger failure or stacked catch-up workouts.';
    fitNext = 'Follow the recalibrated schedule at comfortable pacing.';
  }

  return {
    status: fitStatus,
    title: 'PLAN ADHERENCE & FIDELITY',
    observation: fitObs,
    evidence: `${completed} / ${target} weekly sessions logged (${ratio}% completion ratio).`,
    meaning: fitMeaning,
    nextStep: fitNext,
    completionRatio: ratio,
    plannedSessions: target,
    completedSessions: completed,
    rebalanced: rebalanceNeeded,
  };
};

/* ─────────────────────────────────────────────────────────────
   5. GOAL MOMENTUM ANALYSIS
───────────────────────────────────────────────────────────── */
const analyzeGoalMomentum = (goals, workouts) => {
  if (!goals || goals.length === 0) {
    return {
      status: 'NO_GOALS',
      activeGoalsCount: 0,
      goals: [],
      observation: 'No active goals recorded in mission planning.',
      evidence: 'Zero active goal records in telemetry.',
      meaning: 'Active goals establish tangible benchmarks for progress evaluation.',
      nextStep: 'Create a specific goal (e.g. 10 workouts this month) in Mission Planning.',
    };
  }

  const activeGoals = goals.filter((g) => g.status === 'ACTIVE');
  if (activeGoals.length === 0) {
    return {
      status: 'ALL_COMPLETED_OR_PAUSED',
      activeGoalsCount: 0,
      goals: [],
      observation: 'All existing goals are completed or paused.',
      evidence: `${goals.length} total goal${goals.length === 1 ? '' : 's'} archived in history.`,
      meaning: 'Setting new milestones maintains purposeful direction.',
      nextStep: 'Establish a new target in Mission Planning.',
    };
  }

  const evaluatedGoals = activeGoals.map((g) => {
    const target = Number(g.targetValue) || 1;
    const current = Number(g.currentValue) || 0;
    const pct = Math.min(100, Math.round((current / target) * 100));

    let momentum = 'STEADY';
    let obs = `Goal is at ${pct}% completion (${current} / ${target} ${g.unit || ''}).`;

    if (pct >= 85) {
      momentum = 'PROGRESSING';
      obs = `Approaching milestone completion (${pct}% complete).`;
    } else if (pct === 0 && workouts.length > 0) {
      momentum = 'RECENTLY_ESTABLISHED';
      obs = 'Goal recently established; telemetry tracking active.';
    }

    return {
      id: g._id,
      title: g.title,
      category: g.category,
      targetValue: target,
      currentValue: current,
      unit: g.unit,
      percentage: pct,
      momentum,
      observation: obs,
    };
  });

  return {
    status: 'ACTIVE_GOALS',
    activeGoalsCount: activeGoals.length,
    goals: evaluatedGoals,
    observation: `Tracking ${activeGoals.length} active mission${activeGoals.length === 1 ? '' : 's'} with real workout telemetry.`,
    evidence: evaluatedGoals.map((g) => `${g.title}: ${g.percentage}%`).join(' • '),
    meaning: 'Real telemetry updates goals automatically with zero manual exaggeration.',
    nextStep: 'Continue steady session logging to advance active goals.',
  };
};

/* ─────────────────────────────────────────────────────────────
   6. PURPOSE ALIGNMENT (Stage 19 Integration)
───────────────────────────────────────────────────────────── */
const analyzePurposeAlignment = (purpose, workouts, baseline) => {
  if (!purpose || !purpose.purposeType) {
    return {
      configured: false,
      status: 'UNCONFIGURED',
      observation: 'Fitness purpose has not been configured.',
      evidence: 'No active Purpose record.',
      meaning: 'Defining your core why grounds your physical routine in sustainable personal values.',
      nextStep: 'Open Purpose Setup to declare your primary motivation.',
    };
  }

  const purposeNames = {
    BUILD_DISCIPLINE: 'Building Discipline',
    IMPROVE_HEALTH: 'Improving Health & Vitality',
    INCREASE_ENERGY: 'Increasing Energy & Stamina',
    IMPROVE_STRENGTH: 'Strength Progression',
    IMPROVE_ENDURANCE: 'Endurance Base',
    CHANGE_LIFESTYLE: 'Sustainable Lifestyle Transformation',
  };

  const pName = purposeNames[purpose.purposeType] || purpose.purposeType;
  const count = workouts.length;

  if (count < 3) {
    return {
      configured: true,
      status: 'FORMING',
      purposeType: purpose.purposeType,
      purposeName: pName,
      identityStatement: purpose.identityStatement || '',
      observation: `Your stated purpose is ${pName}. More session history is needed to identify behavioral alignment patterns.`,
      evidence: `${count} session${count === 1 ? '' : 's'} recorded since purpose configuration.`,
      meaning: 'Behavioral alignment requires time to observe natural consistency trends.',
      nextStep: 'Continue logging your regular sessions.',
    };
  }

  let alignmentObs = `Your stated purpose is ${pName}. Your recorded activity shows ${count} completed sessions.`;
  let alignmentMeaning = 'Aligning training habits with internal identity reinforces longevity over short-term burn.';

  if (purpose.purposeType === 'BUILD_DISCIPLINE') {
    alignmentObs = `Your stated purpose is Building Discipline. You have accumulated ${count} total sessions across your journey.`;
  } else if (purpose.purposeType === 'IMPROVE_STRENGTH') {
    const strengthWorkouts = workouts.filter((w) => w.activityType === 'Gym' || w.activityType === 'Strength Training').length;
    alignmentObs = `Your stated purpose is Strength Progression. Strength-oriented training represents ${strengthWorkouts} of your ${count} total sessions.`;
  }

  return {
    configured: true,
    status: 'ALIGNED',
    purposeType: purpose.purposeType,
    purposeName: pName,
    identityStatement: purpose.identityStatement || '',
    coreWhy: purpose.coreWhy || '',
    observation: alignmentObs,
    evidence: `Logged history: ${count} sessions • Primary discipline: ${baseline?.mostCommonActivity || 'General'}.`,
    meaning: alignmentMeaning,
    nextStep: 'Let your stated purpose guide session duration when daily time is constrained.',
  };
};

/* ─────────────────────────────────────────────────────────────
   7. REFLECTION PATTERN ANALYSIS (Stage 19 & 20 Integration)
───────────────────────────────────────────────────────────── */
const analyzeReflectionPatterns = (workoutReflections, weeklyReflections) => {
  const wrCount = workoutReflections.length;
  const weekCount = weeklyReflections.length;

  if (wrCount === 0 && weekCount === 0) {
    return {
      hasData: false,
      message: 'No reflections recorded yet. Subjective effort context will appear as you log session reflections.',
      effortDistribution: null,
      recurringThemes: [],
    };
  }

  // Effort Distribution
  const effortCounts = { EASY: 0, GOOD: 0, HARD: 0, VERY_HARD: 0 };
  workoutReflections.forEach((r) => {
    if (r.effort && effortCounts[r.effort] !== undefined) {
      effortCounts[r.effort]++;
    }
  });

  // Keyword / Theme Detection in notes (time, energy, tired, tight, focus)
  const keywords = ['time', 'energy', 'tired', 'busy', 'focus', 'form', 'pace', 'rest'];
  const keywordHits = {};

  workoutReflections.forEach((r) => {
    const text = (r.note || '').toLowerCase();
    keywords.forEach((kw) => {
      if (text.includes(kw)) {
        keywordHits[kw] = (keywordHits[kw] || 0) + 1;
      }
    });
  });

  weeklyReflections.forEach((wr) => {
    const text = `${wr.wentWell || ''} ${wr.difficult || ''} ${wr.nextFocus || ''}`.toLowerCase();
    keywords.forEach((kw) => {
      if (text.includes(kw)) {
        keywordHits[kw] = (keywordHits[kw] || 0) + 1;
      }
    });
  });

  const recurringThemes = Object.entries(keywordHits)
    .filter(([_, count]) => count >= 1)
    .map(([topic, count]) => ({
      topic: topic.toUpperCase(),
      occurrences: count,
      observation: `The topic "${topic}" has appeared in ${count} of your reflection entries.`,
    }))
    .sort((a, b) => b.occurrences - a.occurrences);

  let primaryEffort = 'GOOD';
  let maxEffortCount = 0;
  for (const [eff, cnt] of Object.entries(effortCounts)) {
    if (cnt > maxEffortCount) {
      maxEffortCount = cnt;
      primaryEffort = eff;
    }
  }

  return {
    hasData: true,
    workoutReflectionsCount: wrCount,
    weeklyReflectionsCount: weekCount,
    primaryPerceivedEffort: wrCount > 0 ? primaryEffort : 'UNRECORDED',
    effortDistribution: effortCounts,
    recurringThemes,
    observation: wrCount > 0
      ? `Most recorded sessions were rated as "${primaryEffort}" perceived effort.`
      : 'Weekly introspections recorded.',
    evidence: `${wrCount} workout reflection${wrCount === 1 ? '' : 's'} and ${weekCount} weekly review${weekCount === 1 ? '' : 's'} analyzed.`,
    meaning: 'Monitoring perceived effort prevents accumulated neuromuscular fatigue.',
    nextStep: 'When effort feels frequently "HARD" or "VERY_HARD", schedule a lighter recovery session.',
  };
};

/* ─────────────────────────────────────────────────────────────
   8. LIFE LOAD VS TRAINING RESPONSE (Stage 20 Integration)
───────────────────────────────────────────────────────────── */
const analyzeLifeLoadResponse = (lifeCtx, workouts, baseline) => {
  const currentLoad = lifeCtx?.lifeLoad || 'NORMAL';
  const availableMinutes = lifeCtx?.todayAvailableMinutes || 25;

  let obs = `Your current life load is marked as ${currentLoad}.`;
  let meaning = 'Life load reflects outside schedule friction and work/family commitments.';
  let next = 'Use available time controls to tailor today’s duration to your actual capacity.';

  if (currentLoad === 'VERY_BUSY' || currentLoad === 'BUSY') {
    obs = `Your life load is currently marked as ${currentLoad}. During busy periods, completed sessions tend to be shorter and more focused.`;
    meaning = 'Adapting session duration during demanding life weeks protects the habit without adding mental pressure.';
    next = 'Lean on 10–15 minute habit-protector sessions rather than pausing entirely.';
  } else if (currentLoad === 'LIGHT') {
    obs = `Your life load is marked as LIGHT, indicating ample availability and lower schedule friction.`;
    meaning = 'Periods with light schedule friction provide good opportunities for deeper skill practice or extended volume.';
    next = 'Capitalize on this window at comfortable, unhurried pacing.';
  }

  return {
    currentLifeLoad: currentLoad,
    todayAvailableMinutes: availableMinutes,
    observation: obs,
    evidence: `Current life load context: ${currentLoad} • Specified availability: ${availableMinutes} min today.`,
    meaning,
    nextStep: next,
  };
};

/* ─────────────────────────────────────────────────────────────
   9. RETURN / RE-ENTRY INTELLIGENCE (Stage 19 Integration)
───────────────────────────────────────────────────────────── */
const analyzeReturnJourney = (workouts) => {
  const count = workouts.length;
  if (count === 0) {
    return {
      status: 'FRESH_COMMENCEMENT',
      message: 'Beginning the journey from the inaugural session.',
      isRebuilding: false,
    };
  }

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const latestWorkout = workouts[count - 1];
  const daysSinceLatest = Math.floor((now - new Date(latestWorkout.workoutDate || latestWorkout.createdAt).getTime()) / dayMs);

  // Check historical hiatus gaps
  let previousHiatusGap = 0;
  if (count >= 2) {
    for (let i = count - 1; i >= 1; i--) {
      const cur = new Date(workouts[i].workoutDate || workouts[i].createdAt).getTime();
      const prev = new Date(workouts[i - 1].workoutDate || workouts[i - 1].createdAt).getTime();
      const gap = Math.floor((cur - prev) / dayMs);
      if (gap >= 4) {
        previousHiatusGap = gap;
        break;
      }
    }
  }

  if (daysSinceLatest >= 4) {
    return {
      status: 'PAUSE_DETECTED',
      daysSinceLastSession: daysSinceLatest,
      isRebuilding: true,
      observation: `It has been ${daysSinceLatest} days since your last recorded session.`,
      evidence: `Last session logged on ${formatDisplayDate(latestWorkout.workoutDate || latestWorkout.createdAt)}.`,
      meaning: 'Pauses are an organic component of a lifelong fitness journey. A break never erases prior progress.',
      nextStep: 'The path continues. Step in with a gentle 10–15 minute re-entry session with zero pressure.',
    };
  }

  if (previousHiatusGap >= 4 && daysSinceLatest <= 3) {
    return {
      status: 'REBUILDING_RHYTHM',
      daysSinceLastSession: daysSinceLatest,
      previousGapDays: previousHiatusGap,
      isRebuilding: true,
      observation: `You returned to train after a ${previousHiatusGap}-day hiatus and are currently rebuilding steady rhythm.`,
      evidence: `Session logged within the past ${daysSinceLatest} day${daysSinceLatest === 1 ? '' : 's'}.`,
      meaning: 'Returning after an interruption demonstrates genuine resilience.',
      nextStep: 'Keep sessions comfortable to re-establish neuromuscular habituation.',
    };
  }

  return {
    status: 'ACTIVE_CONTINUITY',
    daysSinceLastSession: daysSinceLatest,
    isRebuilding: false,
    observation: 'You are maintaining active training continuity.',
    evidence: `Latest session logged ${daysSinceLatest === 0 ? 'today' : `${daysSinceLatest} day${daysSinceLatest === 1 ? '' : 's'} ago`}.`,
    meaning: 'Regular training frequency builds compounding consistency.',
    nextStep: 'Continue following your planned weekly cadence.',
  };
};

/* ─────────────────────────────────────────────────────────────
   10. CONSERVATIVE PLATEAU DETECTION
───────────────────────────────────────────────────────────── */
const analyzePlateau = (workouts) => {
  const count = workouts.length;

  if (count < 6) {
    return {
      hasData: false,
      status: 'INSUFFICIENT_HISTORY',
      observation: 'Not enough multi-week history to evaluate volume plateaus.',
      evidence: `${count} session${count === 1 ? '' : 's'} recorded (requires minimum 6 sessions across 3+ weeks).`,
      meaning: 'Meaningful plateau detection requires multiple weeks of steady telemetry to avoid premature conclusions.',
      nextStep: 'Continue steady session execution.',
    };
  }

  // Check last 6 sessions duration variance
  const recent6 = workouts.slice(-6);
  const durations = recent6.map((w) => Number(w.duration) || 0);
  const maxDur = Math.max(...durations);
  const minDur = Math.min(...durations);
  const diff = maxDur - minDur;

  // If all 6 workouts are virtually identical in duration (< 5m difference)
  if (diff <= 5 && count >= 8) {
    return {
      hasData: true,
      status: 'VOLUME_STABILIZED',
      observation: 'Your training duration has remained steady across your last 6 sessions.',
      evidence: `Session durations across the last 6 workouts fluctuated within a narrow ${diff}-minute window.`,
      meaning: 'This is an observation, not a diagnosis. A stable period is often necessary for physical consolidation.',
      nextStep: 'If progressive stimulus is your goal, consider slightly varying duration, pace, or movement discipline.',
    };
  }

  return {
    hasData: true,
    status: 'DYNAMIC_VARIANCE',
    observation: 'Your recent training duration exhibits natural healthy variance.',
    evidence: `Recent session durations range between ${minDur}m and ${maxDur}m.`,
    meaning: 'Natural duration variance indicates appropriate adaptation to daily energy and time availability.',
    nextStep: 'Continue matching session duration to your daily life context.',
  };
};

/* ─────────────────────────────────────────────────────────────
   11. PERSONAL MOMENTUM MODEL (Multi-Dimensional)
───────────────────────────────────────────────────────────── */
const calculatePersonalMomentum = (patterns, planFit, returnJourney, goalMomentum) => {
  const consistencyPattern = patterns.find((p) => p.type === 'CONSISTENCY') || { status: 'STABLE' };

  let consistencyLevel = consistencyPattern.status; // IMPROVING, STABLE, DECLINING, INSUFFICIENT_HISTORY
  let planFitLevel = planFit.status; // TARGET_REACHED, BALANCED_FIT, ADAPTED, UNCONFIGURED
  let activityLevel = returnJourney.status; // ACTIVE_CONTINUITY, REBUILDING_RHYTHM, PAUSE_DETECTED, FRESH_COMMENCEMENT
  let goalLevel = goalMomentum.status; // ACTIVE_GOALS, ALL_COMPLETED_OR_PAUSED, NO_GOALS

  return {
    summary: 'MULTI-DIMENSIONAL MOMENTUM MODEL',
    dimensions: [
      {
        dimension: 'CONSISTENCY',
        state: consistencyLevel,
        description: consistencyPattern.observation,
      },
      {
        dimension: 'PLAN FIT',
        state: planFitLevel,
        description: planFit.observation,
      },
      {
        dimension: 'ACTIVITY CONTINUITY',
        state: activityLevel,
        description: returnJourney.observation,
      },
      {
        dimension: 'GOAL MOVEMENT',
        state: goalLevel,
        description: goalMomentum.observation,
      },
    ],
  };
};

/* ─────────────────────────────────────────────────────────────
   12. PERSONAL GROWTH SUMMARY (Long-Term Narrative)
───────────────────────────────────────────────────────────── */
const buildPersonalGrowthSummary = (workouts, progression, baseline, goals, plan) => {
  const count = workouts.length;

  if (count === 0) {
    return {
      hasData: false,
      message: 'Your personal growth summary will compile as you log workouts.',
    };
  }

  const firstWorkout = workouts[0];
  const latestWorkout = workouts[count - 1];

  const totalMinutes = workouts.reduce((s, w) => s + (Number(w.duration) || 0), 0);
  const totalCalories = workouts.reduce((s, w) => s + (Number(w.caloriesBurned) || 0), 0);

  const firstDateStr = formatDisplayDate(firstWorkout.workoutDate || firstWorkout.createdAt);
  const latestDateStr = formatDisplayDate(latestWorkout.workoutDate || latestWorkout.createdAt);

  return {
    hasData: true,
    whereIStarted: {
      date: firstDateStr,
      activity: firstWorkout.activityType || 'Workout',
      duration: firstWorkout.duration || 0,
      description: `Your journey began on ${firstDateStr} with a ${firstWorkout.duration || 0}-minute ${firstWorkout.activityType || 'workout'} session.`,
    },
    whereIAm: {
      totalWorkouts: count,
      totalActiveMinutes: totalMinutes,
      totalCaloriesBurned: totalCalories,
      level: progression?.level || 1,
      rankTitle: progression?.rankTitle || 'Novice Hunter',
      latestSessionDate: latestDateStr,
      description: `Accumulated ${count} verified training sessions and ${totalMinutes} active minutes to reach Level ${progression?.level || 1}.`,
    },
    whatHasChanged: {
      description: count >= 3
        ? `Derived baseline shows your typical session is ${baseline?.typicalDuration || 25} minutes at ${baseline?.averageSessionsPerWeek || 3} sessions per week.`
        : 'Telemetry accumulation underway; historical baseline forming.',
    },
    whatIKeepReturningTo: {
      primaryActivity: baseline?.mostCommonActivity || 'General Training',
      description: `Your most recurring movement discipline is ${baseline?.mostCommonActivity || 'General Training'}.`,
    },
    whatIAmBuilding: {
      activeGoalsCount: goals?.filter((g) => g.status === 'ACTIVE').length || 0,
      description: 'Building physical durability, habit consistency, and personal self-reliance.',
    },
    whatComesNext: {
      planName: plan?.name || 'Adaptive Weekly Training Plan',
      description: `Continuing along your ${plan?.weeklyTargetSessions || 3}-session weekly adaptive cadence.`,
    },
  };
};

/* ─────────────────────────────────────────────────────────────
   MAIN ENTRY POINT: getDeepPersonalIntelligence
───────────────────────────────────────────────────────────── */
export const getDeepPersonalIntelligence = async (userId) => {
  const [
    workouts,
    goals,
    purpose,
    workoutReflections,
    weeklyReflections,
    plan,
    lifeCtx,
    progression,
    records,
    baseline,
    weekStatus,
    loadCheck,
  ] = await Promise.all([
    fetchUserWorkouts(userId),
    fetchUserGoals(userId),
    fetchUserPurpose(userId),
    fetchUserWorkoutReflections(userId),
    fetchUserWeeklyReflections(userId),
    fetchUserTrainingPlan(userId),
    fetchUserLifeContext(userId),
    getUserProgressionData(userId),
    getUserPersonalRecords(userId),
    calculatePersonalBaseline(userId),
    getAdaptiveWeekStatus(userId),
    calculateLoadCheck(userId),
  ]);

  // 1. Data Quality and Data Gaps
  const { dataQuality, dataGaps } = analyzeDataQualityAndGaps(
    workouts,
    goals,
    purpose,
    workoutReflections,
    weeklyReflections,
    plan
  );

  // 2. Personal Patterns
  const patterns = detectPersonalPatterns(workouts, plan, lifeCtx, baseline);

  // 3. What Changed?
  const changes = calculateWhatChanged(workouts);

  // 4. Plan Fit
  const planFit = analyzePlanFit(weekStatus, plan);

  // 5. Goal Momentum
  const goalMomentum = analyzeGoalMomentum(goals, workouts);

  // 6. Purpose Alignment
  const purposeAlignment = analyzePurposeAlignment(purpose, workouts, baseline);

  // 7. Reflection Patterns
  const reflectionPatterns = analyzeReflectionPatterns(workoutReflections, weeklyReflections);

  // 8. Life Load vs Training Response
  const lifeLoadPatterns = analyzeLifeLoadResponse(lifeCtx, workouts, baseline);

  // 9. Return / Re-entry Journey
  const returnJourney = analyzeReturnJourney(workouts);

  // 10. Conservative Plateau Detection
  const plateauAnalysis = analyzePlateau(workouts);

  // 11. Non-medical Training Load Observation
  const loadObservation = {
    status: loadCheck?.status || 'BALANCED',
    heading: loadCheck?.heading || 'VOLUME PACING',
    message: loadCheck?.message || 'Ready for today’s session.',
    suggestion: loadCheck?.suggestion || 'Maintain comfortable rhythm.',
    disclaimer: 'PLANNING SIGNAL ONLY. Purely observational feedback based on logged frequency.',
  };

  // 12. Personal Momentum Model
  const personalMomentum = calculatePersonalMomentum(patterns, planFit, returnJourney, goalMomentum);

  // 13. Personal Growth Summary
  const growthSummary = buildPersonalGrowthSummary(workouts, progression, baseline, goals, plan);

  return {
    status: dataQuality.sufficient ? 'READY' : 'FORMING',
    dataQuality,
    patterns,
    changes,
    planFit,
    goalMomentum,
    purposeAlignment,
    reflectionPatterns,
    lifeLoadPatterns,
    returnJourney,
    plateauAnalysis,
    loadObservation,
    personalMomentum,
    dataGaps,
    growthSummary,
    generatedAt: new Date().toISOString(),
  };
};

export default {
  getDeepPersonalIntelligence,
};
