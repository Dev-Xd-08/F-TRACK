/**
 * ⚔️ F-TRACK: FITNESS ASCENSION — ACHIEVEMENT CATALOG (STAGE 9)
 * 
 * Centralized stable catalog defining all 14 Hunter Achievements and Badges.
 * All requirements are evaluated exclusively against authentic telemetry.
 */

export const ACHIEVEMENT_CATALOG = [
  // ─────────────────────────────────────────────────────────────
  // 1. WORKOUT VOLUME MILESTONES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'FIRST_STEP',
    title: 'FIRST STEP',
    description: 'Complete your first workout quest and awaken physical telemetry.',
    category: 'WORKOUTS',
    metric: 'workouts',
    target: 1,
    unit: 'workouts',
    xp: 50,
    icon: 'Footprints',
  },
  {
    id: 'TEN_WORKOUTS',
    title: 'TEN WORKOUTS',
    description: 'Complete 10 total workout quests in the ascension logs.',
    category: 'WORKOUTS',
    metric: 'workouts',
    target: 10,
    unit: 'workouts',
    xp: 100,
    icon: 'Dumbbell',
  },
  {
    id: 'TWENTY_FIVE_WORKOUTS',
    title: 'TWENTY-FIVE WORKOUTS',
    description: 'Complete 25 total workout quests and forge unwavering discipline.',
    category: 'WORKOUTS',
    metric: 'workouts',
    target: 25,
    unit: 'workouts',
    xp: 150,
    icon: 'Shield',
  },
  {
    id: 'FIFTY_WORKOUTS',
    title: 'FIFTY WORKOUTS',
    description: 'Complete 50 total workout quests to join the seasoned hunter vanguard.',
    category: 'WORKOUTS',
    metric: 'workouts',
    target: 50,
    unit: 'workouts',
    xp: 250,
    icon: 'Swords',
  },

  // ─────────────────────────────────────────────────────────────
  // 2. METABOLIC / CALORIE MILESTONES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'CALORIE_1000',
    title: 'CALORIE IGNITION',
    description: 'Burn a cumulative total of 1,000 calories through training.',
    category: 'CALORIES',
    metric: 'calories',
    target: 1000,
    unit: 'kcal',
    xp: 100,
    icon: 'Flame',
  },
  {
    id: 'CALORIE_5000',
    title: 'CALORIE BLAZE',
    description: 'Burn a cumulative total of 5,000 calories in your ascension journey.',
    category: 'CALORIES',
    metric: 'calories',
    target: 5000,
    unit: 'kcal',
    xp: 200,
    icon: 'Zap',
  },
  {
    id: 'CALORIE_10000',
    title: 'CALORIE INFERNO',
    description: 'Burn a cumulative total of 10,000 calories to unleash pure metabolic power.',
    category: 'CALORIES',
    metric: 'calories',
    target: 10000,
    unit: 'kcal',
    xp: 300,
    icon: 'Sparkles',
  },

  // ─────────────────────────────────────────────────────────────
  // 3. ENDURANCE / TIME MILESTONES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ACTIVE_500',
    title: 'ENDURANCE SURGE',
    description: 'Log 500 total active minutes of focused physical conditioning.',
    category: 'ENDURANCE',
    metric: 'duration',
    target: 500,
    unit: 'minutes',
    xp: 150,
    icon: 'Clock',
  },

  // ─────────────────────────────────────────────────────────────
  // 4. STREAK CONTINUITY MILESTONES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'STREAK_7',
    title: 'IRON MOMENTUM',
    description: 'Sustain a verified 7-day daily workout streak.',
    category: 'STREAK',
    metric: 'streak',
    target: 7,
    unit: 'days',
    xp: 150,
    icon: 'Flame',
  },
  {
    id: 'STREAK_30',
    title: 'UNSTOPPABLE FORCE',
    description: 'Sustain a verified 30-day daily workout streak of unyielding focus.',
    category: 'STREAK',
    metric: 'streak',
    target: 30,
    unit: 'days',
    xp: 300,
    icon: 'Crown',
  },

  // ─────────────────────────────────────────────────────────────
  // 5. PERSONAL RECORD MASTERY
  // ─────────────────────────────────────────────────────────────
  {
    id: 'RECORD_BREAKER',
    title: 'RECORD BREAKER',
    description: 'Establish at least one all-time Personal Record.',
    category: 'RECORDS',
    metric: 'records',
    target: 1,
    unit: 'PR',
    xp: 100,
    icon: 'Trophy',
  },

  // ─────────────────────────────────────────────────────────────
  // 6. QUEST PROFICIENCY
  // ─────────────────────────────────────────────────────────────
  {
    id: 'QUEST_HUNTER',
    title: 'QUEST HUNTER',
    description: 'Complete 5 daily or weekly missions from the Quest Board.',
    category: 'QUESTS',
    metric: 'quests',
    target: 5,
    unit: 'quests',
    xp: 100,
    icon: 'Target',
  },
  {
    id: 'QUEST_MASTER',
    title: 'QUEST MASTER',
    description: 'Complete 25 daily or weekly missions from the Quest Board.',
    category: 'QUESTS',
    metric: 'quests',
    target: 25,
    unit: 'quests',
    xp: 250,
    icon: 'Award',
  },

  // ─────────────────────────────────────────────────────────────
  // 7. HUNTER RANK ASCENSION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'RANK_UP',
    title: 'RANK ASCENSION',
    description: 'Ascend beyond Awakening tier and attain Hunter Rank D or higher.',
    category: 'RANK',
    metric: 'rank',
    target: 1,
    unit: 'tier',
    xp: 200,
    icon: 'ArrowUpCircle',
  },
];

/**
 * Get definition of an achievement by ID
 * @param {string} achievementId 
 * @returns {Object|null}
 */
export const getAchievementDefinition = (achievementId) => {
  return ACHIEVEMENT_CATALOG.find((a) => a.id === achievementId) || null;
};

export default {
  ACHIEVEMENT_CATALOG,
  getAchievementDefinition,
};
