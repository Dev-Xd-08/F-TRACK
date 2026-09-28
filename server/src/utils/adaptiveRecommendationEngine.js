import FitnessGoal from '../models/FitnessGoal.js';
import FitnessPurpose from '../models/FitnessPurpose.js';
import Workout from '../models/Workout.js';
import {
  isMongoConnected,
  getDevGoals,
  getDevPurpose,
  getDevWorkouts,
} from './devStore.js';
import { calculatePersonalBaseline } from './baselineEngine.js';
import {
  fetchUserLifeContext,
  getAdaptiveWeekStatus,
  calculateLoadCheck,
} from './trainingPlanEngine.js';

/**
 * Helper to fetch user workouts
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
 * Generates transparent 3-phase blueprint for a recommended duration
 */
const getSessionBlueprint = (duration, activityType = 'General Training') => {
  if (duration <= 10) {
    return {
      warmup: '2 MIN — Gentle joint rotations & shoulder circles',
      mainWork: `${duration - 4} MIN — Focused bodyweight movements or brisk walking`,
      cooldown: '2 MIN — Parasympathetic nasal breathing & gentle fold',
    };
  }

  if (duration <= 20) {
    const warmup = 3;
    const cooldown = 3;
    const main = duration - warmup - cooldown;
    return {
      warmup: `${warmup} MIN — Dynamic movements, hip openers, light pacing`,
      mainWork: `${main} MIN — Steady continuous rhythm in ${activityType.toLowerCase()}`,
      cooldown: `${cooldown} MIN — Calming stretches & heart-rate normalization`,
    };
  }

  const warmup = 5;
  const cooldown = 5;
  const main = duration - warmup - cooldown;
  return {
    warmup: `${warmup} MIN — Full dynamic activation & joint prep`,
    mainWork: `${main} MIN — Main work interval at sustainable target intensity`,
    cooldown: `${cooldown} MIN — Recovery mobility & down-regulation`,
  };
};

/**
 * Adaptive Daily Recommendation Engine (Stage 20)
 * Builds transparent, user-controlled recommendations based on real telemetry:
 * available time, life load, week progress, baseline, goals, and purpose.
 */
export const getAdaptiveDailyRecommendation = async (userId) => {
  const [workouts, baseline, lifeCtx, weekStatus, loadCheck] = await Promise.all([
    fetchUserWorkouts(userId),
    calculatePersonalBaseline(userId),
    fetchUserLifeContext(userId),
    getAdaptiveWeekStatus(userId),
    calculateLoadCheck(userId),
  ]);

  // Fetch purpose
  let purpose = null;
  if (isMongoConnected()) {
    try {
      purpose = await FitnessPurpose.findOne({ user: userId, active: true }).lean();
    } catch {
      purpose = await getDevPurpose(userId);
    }
  } else {
    purpose = await getDevPurpose(userId);
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  // Check if user already logged a session today
  const trainedToday = workouts.some((w) => {
    const d = new Date(w.workoutDate || w.createdAt);
    return d >= todayStart;
  });

  const availableMinutes = lifeCtx?.todayAvailableMinutes || 25;
  const lifeLoad = lifeCtx?.lifeLoad || 'NORMAL';
  const commonActivity = baseline?.mostCommonActivity || 'General Training';

  const reasons = [];

  // 1. Session check today
  if (trainedToday) {
    reasons.push('You have already recorded a training session today.');
    reasons.push('Physical adaptation occurs during rest and recovery.');
    if (lifeLoad === 'BUSY' || lifeLoad === 'VERY_BUSY') {
      reasons.push(`Your life load is currently marked as ${lifeLoad.toLowerCase()}. Protect your recovery.`);
    }

    return {
      recommendationType: 'ACTIVE_RECOVERY',
      title: 'TODAY: RECOVERY & RESTORATION',
      actionTitle: 'OPTIONAL 10-MIN MOBILITY',
      suggestedDuration: 10,
      activityType: 'Flexibility / Stretching',
      trainedToday: true,
      ...getSessionBlueprint(10, 'Flexibility / Stretching'),
      reasons,
      alternatives: [
        { label: 'Full Rest Day', duration: 0, activityType: 'Rest' },
        { label: 'Gentle Walk', duration: 15, activityType: 'Walking' },
      ],
    };
  }

  // 2. High recent volume check
  if (loadCheck.status === 'HIGH_VOLUME') {
    reasons.push(`You have completed ${loadCheck.recentSessionsCount} sessions across the last 5 days.`);
    reasons.push('Maintaining balance prevents routine burnout.');
    reasons.push(`Suggested based on your ${availableMinutes} minutes of available time today.`);

    const dur = Math.min(availableMinutes, 20);
    return {
      recommendationType: 'LIGHT_MOVEMENT',
      title: 'TODAY: LIGHT MOVEMENT & MOBILITY',
      actionTitle: `START ${dur}-MIN GENTLE RESET`,
      suggestedDuration: dur,
      activityType: 'Walking',
      trainedToday: false,
      ...getSessionBlueprint(dur, 'Walking'),
      reasons,
      alternatives: [
        { label: 'Mobility & Foam Rolling', duration: 15, activityType: 'Flexibility / Stretching' },
        { label: 'Full Rest Day', duration: 0, activityType: 'Rest' },
      ],
    };
  }

  // 3. User has constrained time today
  if (availableMinutes <= 15) {
    reasons.push(`You specified ${availableMinutes} minutes available today.`);
    reasons.push('Short sessions protect neuromuscular habits without draining your schedule.');
    reasons.push(`Week status: ${weekStatus.completedSessions} of ${weekStatus.targetSessions} sessions complete.`);
    if (purpose?.purposeType) {
      reasons.push('Continuity over intensity serves your stated training purpose.');
    }

    return {
      recommendationType: 'SHORT_SESSION',
      title: `${availableMinutes}-MINUTE HABIT PROTECTOR`,
      actionTitle: `START ${availableMinutes}-MIN SESSION`,
      suggestedDuration: availableMinutes,
      activityType: commonActivity,
      trainedToday: false,
      ...getSessionBlueprint(availableMinutes, commonActivity),
      reasons,
      alternatives: [
        { label: 'Bodyweight Circuit', duration: availableMinutes, activityType: 'Bodyweight Calisthenics' },
        { label: 'Brisk Walk', duration: availableMinutes, activityType: 'Walking' },
      ],
    };
  }

  // 4. Standard / Rebalanced Recommendation
  reasons.push(`Week progress: ${weekStatus.completedSessions} of ${weekStatus.targetSessions} sessions completed.`);
  if (weekStatus.daysRemainingInWeek > 0) {
    reasons.push(`${weekStatus.daysRemainingInWeek} days remain this week.`);
  }
  reasons.push(`You specified ${availableMinutes} minutes available today.`);

  if (baseline.hasBaseline) {
    reasons.push(`Your typical session duration is around ${baseline.typicalDuration} minutes.`);
  }

  if (purpose && purpose.purposeType) {
    const purposeNames = {
      BUILD_DISCIPLINE: 'Building Discipline',
      IMPROVE_HEALTH: 'Improving Health & Vitality',
      INCREASE_ENERGY: 'Increasing Energy',
      IMPROVE_STRENGTH: 'Strength Progression',
      IMPROVE_ENDURANCE: 'Endurance Base',
      CHANGE_LIFESTYLE: 'Sustainable Lifestyle',
    };
    const pName = purposeNames[purpose.purposeType] || 'Your Stated Purpose';
    reasons.push(`Aligning with your core purpose: ${pName}.`);
  }

  return {
    recommendationType: 'STANDARD_SESSION',
    title: `TODAY: ${availableMinutes}-MINUTE STRUCTURED SESSION`,
    actionTitle: `START ${availableMinutes}-MIN ${commonActivity.toUpperCase()}`,
    suggestedDuration: availableMinutes,
    activityType: commonActivity,
    trainedToday: false,
    ...getSessionBlueprint(availableMinutes, commonActivity),
    reasons,
    alternatives: [
      { label: 'Strength Session', duration: availableMinutes, activityType: 'Strength Training' },
      { label: 'Cardio Pacing', duration: availableMinutes, activityType: 'Running' },
      { label: 'Low Impact Movement', duration: availableMinutes, activityType: 'Walking' },
    ],
  };
};

export default {
  getAdaptiveDailyRecommendation,
};
