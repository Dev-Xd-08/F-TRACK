# ⚔️ F-TRACK: FITNESS ASCENSION — STAGE 8 COMPLETION REPORT

**Project:** Fitness Tracker (F-TRACK) Using MERN Style  
**Product Identity:** F-TRACK: FITNESS ASCENSION  
**Stage:** Stage 8 — Daily & Weekly Quest System  
**Status:** COMPLETE & VERIFIED (Awaiting Developer Review before Git Checkpoint)  

---

## 1. Executive Summary & Architecture Overview

Stage 8 introduces the **Quest System (Daily + Weekly Missions)** to F-TRACK. The system transforms everyday fitness tracking into engaging daily and weekly missions calculated strictly from authentic user workout telemetry.

### Core Principles Enforced:
1. **Real Data-Driven Quests:** Quests are evaluated exclusively against actual `Workout` entries (`workouts`, `duration`, `caloriesBurned`). Zero fake progression or arbitrary client-side state.
2. **Stable Catalog:** Quests are not generated randomly. A centralized catalog (`questCatalog.js`) defines the immutable templates.
3. **Discrete Period Scoping:** Daily quests align with the UTC calendar day (matching Stage 6 streak logic). Weekly quests align with UTC Monday 00:00:00 to Sunday 23:59:59 (matching Stage 7 volume records).
4. **Single-Authority XP Progression:** All quest rewards (+25 XP for Daily, +100 XP for Weekly) are processed through `awardQuestProgression` in `progressionEngine.js`. Level up and rank up events are generated automatically if thresholds are crossed.
5. **Strict Exploit & Duplication Protection:** Quests award XP and trigger `QUEST_COMPLETED` events **only** upon transitioning from `completed: false` to `completed: true`. Subsequent reads, page refreshes, and API calls award 0 XP.
6. **Dual Mode Parity:** 100% feature parity between MongoDB Atlas (`QuestProgress` collection) and the offline in-memory fallback (`devStore.js`).

---

## 2. Quest Catalog & Metric Definitions

All quests are defined in `server/src/config/questCatalog.js`:

| ID | Title | Type | Metric | Target | Unit | Reward | Reset Cycle |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `daily_first_ascension` | **FIRST ASCENSION** | DAILY | `workouts` | 1 | workouts | +25 XP | UTC Calendar Day |
| `daily_active_warrior` | **ACTIVE WARRIOR** | DAILY | `duration` | 30 | minutes | +25 XP | UTC Calendar Day |
| `daily_calorie_burn` | **CALORIE BURN** | DAILY | `calories` | 300 | kcal | +25 XP | UTC Calendar Day |
| `weekly_warrior` | **WEEKLY WARRIOR** | WEEKLY | `workouts` | 3 | workouts | +100 XP | UTC Mon–Sun Cycle |
| `weekly_endurance` | **WEEKLY ENDURANCE** | WEEKLY | `duration` | 120 | minutes | +100 XP | UTC Mon–Sun Cycle |
| `weekly_calorie_crusher` | **CALORIE CRUSHER** | WEEKLY | `calories` | 1,500 | kcal | +100 XP | UTC Mon–Sun Cycle |

### Metric Derivations from Actual Workouts:
- **`workouts`**: $\text{COUNT}(w \in W_{\text{period}})$
- **`duration`**: $\sum_{w \in W_{\text{period}}} \text{duration}_w$ (minutes)
- **`calories`**: $\sum_{w \in W_{\text{period}}} \text{caloriesBurned}_w$ (kcal)
- **Capping Rule**: While the underlying metric tracks actual training (e.g. 47 minutes), `currentValue` in the UI is clamped to `targetValue` ($\min(\text{actual}, \text{target})$) and percentage is clamped to $0\%\text{--}100\%$.

---

## 3. Files Created & Modified

### New Files Created
1. `server/src/config/questCatalog.js`: Stable definitions of all 6 daily and weekly quests.
2. `server/src/models/QuestProgress.js`: Mongoose model tracking user quest instances with a unique compound index on `(user, questId, periodStart)`.
3. `server/src/utils/questEngine.js`: Core business logic for period determination, metric aggregation, progress persistence, transition detection, and history retrieval.
4. `server/src/controllers/questController.js`: API handlers for `GET /api/quests` and `GET /api/quests/history`.
5. `server/src/routes/questRoutes.js`: Express router mounting protected quest routes.
6. `client/src/services/questService.js`: Frontend client service with JWT auth headers.
7. `client/src/components/quests/QuestBoard.jsx`: Professional dark anime-styled mission dashboard with Daily, Weekly, and Archive views.

### Existing Files Modified
1. `server/src/models/Progression.js`: Added `'QUEST_COMPLETED'` to event enum, along with `questId` and `periodType` metadata.
2. `server/src/utils/devStore.js`: Added `devQuestProgress` in-memory collection and isolated query/upsert methods for offline development.
3. `server/src/utils/progressionEngine.js`: Implemented `awardQuestProgression(userId, newlyCompletedQuests)` maintaining centralized XP/Level/Rank management.
4. `server/src/controllers/workoutController.js`:
   - `createWorkout`: Integrates quest evaluation, awards quest completion XP, and returns combined events and quest statuses.
   - `updateWorkout`: Safely recalculates quest progress with `allowXpAward: false`.
   - `deleteWorkout`: Safely recalculates quest progress with `allowXpAward: false` (reverts to in-progress if below target).
5. `server/src/server.js`: Mounted `/api/quests` in the Express pipeline.
6. `client/src/components/progression/SystemNotification.jsx`: Added gold glowing HUD notification toast for `QUEST_COMPLETED` events.
7. `client/src/components/progression/RecentActivity.jsx`: Added `QUEST COMPLETE` tag and styling for timeline events.
8. `client/src/pages/Dashboard.jsx`: Integrated `QuestBoard` between `PersonalRecordMatrix` and `RecentActivity`, fetching active quests and history.

---

## 4. API Endpoints

### 1. `GET /api/quests`
- **Access**: Private (JWT Bearer Token required)
- **Response**:
```json
{
  "success": true,
  "daily": [
    {
      "id": "daily_first_ascension",
      "type": "DAILY",
      "title": "FIRST ASCENSION",
      "description": "Complete your first workout of the day.",
      "metric": "workouts",
      "target": 1,
      "unit": "workouts",
      "xp": 25,
      "actualValue": 1,
      "currentValue": 1,
      "percentage": 100,
      "completed": true,
      "completedAt": "2026-09-26T20:00:00.000Z",
      "timeRemaining": "ENDS IN 3H 58M"
    }
  ],
  "weekly": [
    {
      "id": "weekly_warrior",
      "type": "WEEKLY",
      "title": "WEEKLY WARRIOR",
      "description": "Complete 3 workouts during the current week.",
      "metric": "workouts",
      "target": 3,
      "unit": "workouts",
      "xp": 100,
      "actualValue": 1,
      "currentValue": 1,
      "percentage": 33,
      "completed": false,
      "completedAt": null,
      "timeRemaining": "ENDS IN 1D 3H"
    }
  ]
}
```

### 2. `GET /api/quests/history`
- **Access**: Private (JWT Bearer Token required)
- **Response**:
```json
{
  "success": true,
  "history": [
    {
      "questId": "daily_first_ascension",
      "title": "FIRST ASCENSION",
      "type": "DAILY",
      "target": 1,
      "unit": "workouts",
      "xp": 25,
      "completedAt": "2026-09-26T20:00:00.000Z"
    }
  ]
}
```

---

## 5. Verification & Test Matrix (All 12 Tests Verified)

| # | Test Scenario | Verified Behavior | Status |
| :--- | :--- | :--- | :--- |
| **TEST 1** | **New User (0 Workouts)** | Daily and weekly quests display with 0 progress. None marked completed. Zero XP awarded. | **PASSED** |
| **TEST 2** | **One Workout (30m, 300 kcal)** | Workout XP (+100) + 3 daily quests (+75) = +175 XP total. Daily quests complete, weekly progress at 1/3, 30/120, 300/1500. | **PASSED** |
| **TEST 3** | **Refresh / Repeated Reads** | `GET /api/quests` called repeatedly. `allowXpAward: false` ensures zero additional XP and zero duplicate events. | **PASSED** |
| **TEST 4** | **Second Same-Day Workout** | Second workout awards +100 workout XP. Completed daily quests do NOT award XP again. Weekly progress increments. | **PASSED** |
| **TEST 5** | **Weekly Completion (3 Workouts)** | Upon logging 3rd workout of the week, `WEEKLY WARRIOR` transitions to complete and awards exactly +100 XP once. | **PASSED** |
| **TEST 6** | **Duration Quest (120 min)** | Reaching 120 cumulative weekly minutes completes `WEEKLY ENDURANCE` once (+100 XP). | **PASSED** |
| **TEST 7** | **Calories Quest (1,500 kcal)** | Reaching 1,500 cumulative weekly calories completes `CALORIE CRUSHER` once (+100 XP). | **PASSED** |
| **TEST 8** | **Edit Workout** | `PUT /api/workouts/:id` recalculates quest progress with zero XP award and zero completion events. | **PASSED** |
| **TEST 9** | **Delete Workout** | `DELETE /api/workouts/:id` recalculates progress; incomplete quests revert from completed to in-progress if metric drops below target. Zero XP side-effects. | **PASSED** |
| **TEST 10** | **Same-Day Multiple Workouts** | Workout creation awards +100 XP each. Quests only award XP once on initial false $\to$ true transition. | **PASSED** |
| **TEST 11** | **MongoDB Offline Fallback** | `devStore.js` seamlessly persists quest progress and archives in-memory without errors. | **PASSED** |
| **TEST 12** | **User Data Isolation** | Quests and history strictly filtered by `req.user._id`. Complete multi-user isolation guaranteed. | **PASSED** |

---

## 6. Regression Check Confirmation

- [x] Authentication & JWT Middleware intact
- [x] Workout Quest System & CRUD operations intact
- [x] BMI & Calorie Core intact
- [x] Ascension Progression Engine, Levels & Ranks intact
- [x] Streak calculation intact
- [x] Personal Record Matrix (Stage 7) intact
- [x] System Notifications & Recent Activity timeline intact
- [x] Dashboard visual hierarchy and responsive layout intact
