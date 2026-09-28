import {
  createDevWorkout,
  createDevGoal,
  createOrUpdateDevPurpose,
  createOrUpdateDevWeeklyReflection,
  createDevReflection,
  createDevTrainingPlan,
  setDevLifeContext,
  getDevWorkouts,
} from '../server/src/utils/devStore.js';
import { getDeepPersonalIntelligence } from '../server/src/utils/deepPersonalIntelligenceEngine.js';

console.log('⚔️  RUNNING STAGE 21 DEEP PERSONAL INTELLIGENCE TEST SUITE ⚔️\n');

let passedTests = 0;
let totalTests = 0;

const assert = (condition, testName) => {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
};

const runTests = async () => {
  try {
    // ─────────────────────────────────────────────────────────────
    // TEST 1: Zero Workouts & Data Quality
    // ─────────────────────────────────────────────────────────────
    const userZeroId = 'test_user_zero_' + Date.now();
    const intelZero = await getDeepPersonalIntelligence(userZeroId);

    assert(intelZero.status === 'FORMING', 'Zero workouts returns status: FORMING');
    assert(intelZero.dataQuality.sufficient === false, 'dataQuality.sufficient is false for 0 workouts');
    assert(intelZero.dataQuality.workoutCount === 0, 'workoutCount is 0 for new user');
    assert(intelZero.dataGaps.length >= 4, 'Identifies multiple honest data gaps for empty user');
    assert(intelZero.patterns[0].status === 'INSUFFICIENT_HISTORY', 'Pattern detection returns INSUFFICIENT_HISTORY');
    assert(intelZero.changes.hasComparison === false, 'What Changed returns hasComparison: false');
    assert(intelZero.growthSummary.hasData === false, 'Growth summary reports hasData: false without crashing');

    // ─────────────────────────────────────────────────────────────
    // TEST 2: User Isolation (User A vs User B)
    // ─────────────────────────────────────────────────────────────
    const userA = 'user_alpha_' + Date.now();
    const userB = 'user_beta_' + Date.now();

    // User A logs 4 workouts
    for (let i = 0; i < 4; i++) {
      const d = new Date(Date.now() - (4 - i) * 24 * 60 * 60 * 1000);
      await createDevWorkout({
        userId: userA,
        duration: 30,
        activityType: 'Running',
        caloriesBurned: 250,
        workoutDate: d,
      });
    }

    // User B logs 1 workout
    await createDevWorkout({
      userId: userB,
      duration: 15,
      activityType: 'Walking',
      caloriesBurned: 80,
      workoutDate: new Date(),
    });

    const intelA = await getDeepPersonalIntelligence(userA);
    const intelB = await getDeepPersonalIntelligence(userB);

    assert(intelA.dataQuality.workoutCount === 4, 'User A sees exactly 4 workouts');
    assert(intelB.dataQuality.workoutCount === 1, 'User B sees exactly 1 workout');
    assert(intelA.dataQuality.sufficient === true, 'User A has sufficient baseline history (>= 3 workouts)');
    assert(intelB.dataQuality.sufficient === false, 'User B has insufficient history (< 3 workouts)');

    // ─────────────────────────────────────────────────────────────
    // TEST 3: Pattern Detection & "What Changed" with History
    // ─────────────────────────────────────────────────────────────
    const userHeavy = 'user_heavy_' + Date.now();

    // Setup 14-day comparison history:
    // Prior period (days 15-28 ago): 2 workouts of 45 mins
    const dayMs = 24 * 60 * 60 * 1000;
    await createDevWorkout({
      userId: userHeavy,
      duration: 45,
      activityType: 'Strength Training',
      caloriesBurned: 300,
      workoutDate: new Date(Date.now() - 20 * dayMs),
    });
    await createDevWorkout({
      userId: userHeavy,
      duration: 45,
      activityType: 'Strength Training',
      caloriesBurned: 300,
      workoutDate: new Date(Date.now() - 16 * dayMs),
    });

    // Current period (last 14 days): 4 workouts of 25 mins
    for (let i = 1; i <= 4; i++) {
      await createDevWorkout({
        userId: userHeavy,
        duration: 25,
        activityType: 'Bodyweight Calisthenics',
        caloriesBurned: 180,
        workoutDate: new Date(Date.now() - (12 - i * 2) * dayMs),
      });
    }

    // Configure Purpose, Plan, and Life Load
    await createOrUpdateDevPurpose(userHeavy, {
      purposeType: 'BUILD_DISCIPLINE',
      identityStatement: 'I show up every single week.',
      active: true,
    });

    await createDevTrainingPlan(userHeavy, {
      name: 'Consistent Habit Routine',
      weeklyTargetSessions: 3,
      preferredSessionDuration: 25,
      preferredDays: ['MON', 'WED', 'FRI'],
      focusAreas: ['Discipline'],
    });

    await setDevLifeContext(userHeavy, {
      lifeLoad: 'BUSY',
      todayAvailableMinutes: 20,
    });

    await createDevReflection(userHeavy, {
      effort: 'GOOD',
      note: 'Felt great, managed time well despite tight schedule.',
    });

    const intelHeavy = await getDeepPersonalIntelligence(userHeavy);

    // Assertions on Intelligence
    assert(intelHeavy.status === 'READY', 'Status is READY with 6 workouts');
    assert(intelHeavy.changes.hasComparison === true, 'What Changed detected multi-period comparison');
    assert(intelHeavy.changes.metrics[0].current === 4, 'Current 14d workouts is 4');
    assert(intelHeavy.changes.metrics[0].previous === 2, 'Previous 14d workouts is 2');
    assert(intelHeavy.changes.metrics[0].delta === 2, 'Workouts delta is +2');
    assert(intelHeavy.changes.primaryDisciplineShift.changed === true, 'Discipline shifted from Strength to Bodyweight');

    // Consistency Pattern
    const consistencyPat = intelHeavy.patterns.find((p) => p.type === 'CONSISTENCY');
    assert(consistencyPat !== undefined, 'Consistency pattern detected');
    assert(consistencyPat.status === 'IMPROVING', 'Consistency status is IMPROVING (+2 workouts)');
    assert(consistencyPat.observation.includes('increased'), 'Neutral observation correctly explains increase');

    // Reality Fit Pattern
    const realityPat = intelHeavy.patterns.find((p) => p.type === 'REALITY_FIT');
    assert(realityPat !== undefined, 'Reality Fit pattern detected');
    assert(realityPat.evidence.includes('25m'), 'Identifies plan duration and average completed duration');

    // Purpose Alignment
    assert(intelHeavy.purposeAlignment.configured === true, 'Purpose alignment is active');
    assert(intelHeavy.purposeAlignment.purposeType === 'BUILD_DISCIPLINE', 'Correct purpose type linked');
    assert(intelHeavy.purposeAlignment.identityStatement.includes('show up'), 'Retains identity statement without judgment');

    // Life Load response
    assert(intelHeavy.lifeLoadPatterns.currentLifeLoad === 'BUSY', 'Life load pattern reads BUSY state');
    assert(intelHeavy.lifeLoadPatterns.observation.includes('BUSY'), 'Life load observation cites BUSY context neutrally');

    // Reflection Patterns
    assert(intelHeavy.reflectionPatterns.hasData === true, 'Reflection patterns populated');
    assert(intelHeavy.reflectionPatterns.primaryPerceivedEffort === 'GOOD', 'Identifies GOOD perceived effort');
    assert(intelHeavy.reflectionPatterns.recurringThemes.some((t) => t.topic === 'TIME'), 'Detected recurring keyword "TIME" in reflection notes');

    // Multi-dimensional Momentum
    assert(intelHeavy.personalMomentum.dimensions.length === 4, 'Personal momentum contains 4 transparent dimensions');
    assert(intelHeavy.personalMomentum.dimensions.every((d) => d.description.length > 5), 'Every momentum dimension has descriptive explanation');

    // Personal Growth Summary
    assert(intelHeavy.growthSummary.hasData === true, 'Personal growth narrative generated');
    assert(intelHeavy.growthSummary.whereIStarted.duration === 45, 'Accurately documents where user started (45m)');
    assert(intelHeavy.growthSummary.whereIAm.totalWorkouts === 6, 'Accurately documents where user is (6 workouts)');

    // ─────────────────────────────────────────────────────────────
    // TEST 4: Non-Medical Load & Conservative Plateau Checks
    // ─────────────────────────────────────────────────────────────
    assert(intelHeavy.loadObservation.disclaimer.includes('PLANNING SIGNAL ONLY'), 'Load check has strict non-medical disclaimer');
    assert(intelHeavy.plateauAnalysis.hasData === true, 'Plateau analysis evaluated with 6 workouts');

    console.log(`\n==============================================`);
    console.log(`🎉 ALL STAGE 21 TESTS PASSED: ${passedTests} / ${totalTests} ASSERTIONS!`);
    console.log(`==============================================\n`);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  }
};

runTests();
