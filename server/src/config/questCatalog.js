/**
 * ⚔️ F-TRACK: FITNESS ASCENSION — QUEST CATALOG (STAGE 8)
 * 
 * Centralized stable catalog defining all Daily and Weekly fitness quests.
 * These definitions are immutable templates evaluated against real workout telemetry.
 */

export const QUEST_CATALOG = [
  // ─────────────────────────────────────────────────────────────
  // DAILY QUESTS (Reset every UTC calendar day)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'daily_first_ascension',
    type: 'DAILY',
    title: 'FIRST ASCENSION',
    description: 'Complete your first workout of the day.',
    metric: 'workouts',
    target: 1,
    unit: 'workouts',
    xp: 25,
  },
  {
    id: 'daily_active_warrior',
    type: 'DAILY',
    title: 'ACTIVE WARRIOR',
    description: 'Complete 30 minutes of workouts today.',
    metric: 'duration',
    target: 30,
    unit: 'minutes',
    xp: 25,
  },
  {
    id: 'daily_calorie_burn',
    type: 'DAILY',
    title: 'CALORIE BURN',
    description: 'Burn 300 calories today.',
    metric: 'calories',
    target: 300,
    unit: 'kcal',
    xp: 25,
  },

  // ─────────────────────────────────────────────────────────────
  // WEEKLY QUESTS (Reset every Monday 00:00 UTC → Sunday 23:59 UTC)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'weekly_warrior',
    type: 'WEEKLY',
    title: 'WEEKLY WARRIOR',
    description: 'Complete 3 workouts during the current week.',
    metric: 'workouts',
    target: 3,
    unit: 'workouts',
    xp: 100,
  },
  {
    id: 'weekly_endurance',
    type: 'WEEKLY',
    title: 'WEEKLY ENDURANCE',
    description: 'Complete 120 total workout minutes during the current week.',
    metric: 'duration',
    target: 120,
    unit: 'minutes',
    xp: 100,
  },
  {
    id: 'weekly_calorie_crusher',
    type: 'WEEKLY',
    title: 'CALORIE CRUSHER',
    description: 'Burn 1,500 calories during the current week.',
    metric: 'calories',
    target: 1500,
    unit: 'kcal',
    xp: 100,
  },
];

/**
 * Lookup a quest definition by its unique ID
 * @param {string} questId 
 * @returns {Object|null}
 */
export const getQuestDefinition = (questId) => {
  return QUEST_CATALOG.find((q) => q.id === questId) || null;
};

export default {
  QUEST_CATALOG,
  getQuestDefinition,
};
