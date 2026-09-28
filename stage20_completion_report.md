# ⚔️ F-TRACK: FITNESS ASCENSION — STAGE 20 COMPLETION REPORT

**"THE PLAN SERVES THE PERSON. THE PERSON DOES NOT SERVE THE PLAN."**  
**Date:** September 27, 2026  
**System Version:** F-TRACK Core 20.0 (Personal Training Plan & Adaptive Life Architecture)  
**Status:** COMPLETE & INTEGRATED  

---

## 1. EXECUTIVE SUMMARY

Stage 20 delivers the **Personal Training Plan & Adaptive Life System**, fundamentally elevating F-TRACK from a conventional fitness logger into an empathetic, intelligent personal training system. 

Recognizing that life outside the gym is full of disruption—work deadlines, academic exams, family duties, low energy, and unpredictable schedules—F-TRACK now adapts dynamically to the operator's real life rather than expecting life to conform to rigid software rules.

When sessions are missed, F-TRACK never imposes guilt, never stacks unachievable catch-up workouts onto subsequent days, and never resets cumulative progress. Instead, it recalculates the remaining week smoothly, offers micro-sessions (5–15 minutes) to protect habit continuity, grounds comparisons strictly against the operator's own historical normal, and prompts gentle weekly reflection to transform physical effort into long-term personal mastery.

---

## 2. NON-NEGOTIABLE RULES AUDIT

| Constraint | Requirement | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| **MongoDB Atlas** | POSTPONED | **COMPLIANT** | Zero remote cloud connections attempted. In-memory `devStore.js` updated with full fallback parity for training plans, reflections, and life context. |
| **Git Operations** | BATCHED | **COMPLIANT** | Zero `git commit` or `git push` executed. All Stage 1–20 code staged in working directory for unified final integration checkpoint. |
| **Telemetry Integrity** | REAL DATA ONLY | **COMPLIANT** | All baseline calculations, comparisons, and pacing blueprints derive exclusively from genuine workout logs or display honest `"BASELINE STILL FORMING"` states. |
| **Medical / Clinical Claims** | STRICTLY FORBIDDEN | **COMPLIANT** | No medical, physiological, or psychiatric claims made. Volume observations and pacing suggestions are explicitly labeled `"PLANNING FEEDBACK ONLY"`. |
| **Aesthetic Consistency** | DARK WARRIOR THEME | **COMPLIANT** | Preserved Void Black (`#0a0a0c`), Charcoal (`#121316`), Steel (`#23262d`), Ash (`#8a909a`), Crimson (`#dc2626`), and Bone (`#f3f4f6`). |

---

## 3. ARCHITECTURE & DATA MODELS

### A. Training Plan (`server/src/models/TrainingPlan.js`)
* **Properties:**
  * `user`: Schema ObjectId referencing the authenticated user.
  * `name`: Descriptive plan designation (default: `"Adaptive Weekly Training Plan"`).
  * `weeklyTargetSessions`: Target workouts per week (range: 1–7, default: 3).
  * `preferredSessionDuration`: Target minutes per workout (range: 5–180, default: 25).
  * `preferredDays`: Array of active days (`['MON', 'WED', 'FRI']`).
  * `focusAreas`: Array of target training disciplines or mindsets.
  * `schedule`: 7-day blueprint array mapping each day of the week to `plannedDuration`, `activityType`, `isRestDay`, `isOptional`, and `notes`.
  * `status`: Plan status (`'ACTIVE'`, `'PAUSED'`, `'ARCHIVED'`).

### B. Weekly Reflection (`server/src/models/WeeklyReflection.js`)
* **Properties:**
  * `user`: Schema ObjectId referencing the operator.
  * `weekStart`: Monday 00:00:00 date anchor.
  * `weekEnd`: Sunday 23:59:59 date anchor.
  * `wentWell`: Introspective commentary on training highlights.
  * `difficult`: Honest acknowledgment of frictions, energy lapses, or time constraints.
  * `nextFocus`: Intentional single focus area for the upcoming week.
  * `sessionsCompleted`: Number of verified sessions logged during that calendar week.
  * `targetSessions`: Planned weekly session goal.

### C. User Life Context (`server/src/models/UserLifeContext.js`)
* **Properties:**
  * `user`: Schema ObjectId referencing the operator.
  * `lifeLoad`: Pressure rating (`'LIGHT'`, `'NORMAL'`, `'BUSY'`, `'VERY_BUSY'`).
  * `todayAvailableMinutes`: Dynamic daily availability selector (`5`, `10`, `15`, `20`, `30`, `45`, `60` min).
  * `lastUpdated`: Timestamp of last context calibration.

### D. Offline devStore Fallback Parity (`server/src/utils/devStore.js`)
* Initialized in-memory collections: `devTrainingPlans`, `devWeeklyReflections`, and `devLifeContexts`.
* Null-safe user isolation methods:
  * `getDevTrainingPlan(userId)` & `getDevTrainingPlanById(planId)`
  * `createDevTrainingPlan(userId, planData)` & `updateDevTrainingPlan(planId, updates)` & `deleteDevTrainingPlan(planId)`
  * `getDevWeeklyReflections(userId, limit)` & `getDevWeeklyReflectionByWeek(userId, weekStart)`
  * `createOrUpdateDevWeeklyReflection(userId, reflectionData)`
  * `getDevLifeContext(userId)` & `setDevLifeContext(userId, updates)`

---

## 4. CORE STAGE 20 ENGINES

### 1. Baseline & Self-Comparison Engine (`server/src/utils/baselineEngine.js`)
* **Personal Baseline (`calculatePersonalBaseline`):**
  * Computes authentic historical normal across all logged workouts.
  * Identifies typical session duration, median duration, longest sustained session, typical calorie expenditure, primary discipline, and 4-week moving average.
  * Returns honest `"BASELINE STILL FORMING"` state if fewer than 3 workouts exist.
* **Self-Comparison (`calculateSelfComparison`):**
  * Compares current 30-day window against prior 30-day window (Active Minutes, Total Sessions, Average Duration, and Calories).
  * Strict internal locus: zero competitive leaderboards; evaluates user solely against their own past trajectory.

### 2. Training Plan & Adaptive Schedule Engine (`server/src/utils/trainingPlanEngine.js`)
* **Schedule Generator (`generatePlanSchedule`):**
  * Generates 7-day personalized schedule tailored to weekly target, duration, and life load.
  * Under `VERY_BUSY` load, duration is automatically scaled down to 10–20 min habit-preservation sessions.
* **Adaptive Rebalancer (`getAdaptiveWeekStatus`):**
  * Evaluates day-by-day week progress (`COMPLETED`, `REST_DAY`, `MISSED`, `TODAY_PLANNED`, `UPCOMING_PLANNED`).
  * **Intelligent Anti-Stacking:** When sessions are missed earlier in the week, it NEVER stacks multiple workouts onto remaining days. It caps upcoming sessions to at most 1 per available day and emits a compassionate banner:  
    *"The plan adapted. You missed a planned session earlier this week. Nothing is erased. There are still X days available. F-TRACK calibrated the remaining schedule for sustainable continuity."*
* **Load Check (`calculateLoadCheck`):**
  * Observes volume frequency over a 5-day rolling window and consecutive training days.
  * Categorizes as `FRESH`, `RESTED`, `BALANCED`, or `HIGH_VOLUME` with planning suggestions.
* **Activity Mix (`calculateActivityBalance`):**
  * Analyzes discipline breakdown across the last 15 sessions and suggests movement variety if one discipline exceeds 65%.

### 3. Adaptive Recommendation Engine (`server/src/utils/adaptiveRecommendationEngine.js`)
* Synthesizes user's current day session status, rolling 5-day volume, selected available minutes, life load, weekly target progress, personal baseline, and Stage 19 core purpose.
* Generates a structured 3-phase pacing blueprint:
  * **Warm-up phase:** Joint activation & mobility prep.
  * **Main work phase:** Sustainable interval tailored to available time.
  * **Cool-down phase:** Parasympathetic down-regulation and recovery stretching.
* Generates transparent bulleted **"WHY THIS RECOMMENDATION?"** rationales explaining the exact criteria behind the suggestion.
* Offers instant alternatives (e.g. bodyweight circuit, brisk walking, mobility reset).

### 4. Journey Timeline Integration (`server/src/utils/journeyEngine.js`)
* Integrated `WEEKLY_REFLECTION` milestones into the user's permanent journey timeline alongside count milestones, personal records, and hiatus re-entries.

---

## 5. CONTROLLER & API ROUTE ENDPOINTS

| Endpoint | Method | Function |
| :--- | :--- | :--- |
| `/api/training-plan` | `GET` | Retrieve active training plan and configuration |
| `/api/training-plan` | `POST` | Create or establish new adaptive training plan |
| `/api/training-plan/:id` | `PUT` | Update training plan preferences and regenerate schedule |
| `/api/training-plan/:id` | `DELETE`| Archive / delete training plan |
| `/api/training-plan/schedule/adaptive-week` | `GET` | Day-by-day weekly status and dynamic rebalancing |
| `/api/training-plan/metrics/baseline` | `GET` | Historical baseline metrics and 30-day self-comparison |
| `/api/training-plan/advisory/recommendation` | `GET` | Daily recommendation with "Why this?" explanations |
| `/api/training-plan/metrics/balance` | `GET` | Non-medical load check and movement distribution |
| `/api/training-plan/context/life-load` | `GET` | Retrieve current life load and today's available time |
| `/api/training-plan/context/life-load` | `POST` | Update life load preference (`LIGHT`, `NORMAL`, `BUSY`, `VERY_BUSY`) |
| `/api/training-plan/context/availability` | `POST` | Update today's available minutes (`5`–`60`m) |
| `/api/weekly-reflections` | `GET` | Fetch past weekly reflections |
| `/api/weekly-reflections` | `POST` | Record or update end-of-week reflection |
| `/api/weekly-reflections/current` | `GET` | Retrieve active week reflection record |

---

## 6. FRONTEND COMPONENTS & DASHBOARD INTEGRATION

### A. Modular Component Suite (`client/src/components/plan/`)
1. **`AvailabilitySelector.jsx`:** Quick pill selector (5, 10, 15, 20, 30, 45, 60m) that immediately recalibrates today's recommendation and pacing blueprint.
2. **`LifeLoadSelector.jsx`:** Frictionless 4-level life load selector (`LIGHT`, `NORMAL`, `BUSY`, `VERY_BUSY`) adapting weekly training expectations.
3. **`AdaptiveRecommendation.jsx`:** Hero recommendation card displaying target duration, 3-phase blueprint toggle, transparent "Why this?" rationale, and user controls: `[START SESSION]`, `[CHANGE TIME]`, and `[REST TODAY]`.
4. **`AdaptiveWeekCard.jsx`:** 7-day interactive weekly strip with rebalance banner, completed/rest/passed/planned day states, volume counter, and triggers for Plan Calibration and Weekly Review.
5. **`TrainingPlanCard.jsx`:** Summary card for active training plan parameters with quick calibrate button.
6. **`TrainingPlanBuilder.jsx`:** Full modal for configuring weekly target sessions (2–6), session duration (15–60m), preferred days, and focus presets.
7. **`PersonalBaselineCard.jsx`:** Historical normal metric grid displaying typical duration, frequency, primary discipline, and peak capacity (or honest forming message).
8. **`SelfComparison.jsx`:** Month-over-month self-delta comparison cards (Active Minutes $\pm\%$, Total Sessions $\pm$, Average Duration $\pm$).
9. **`LoadCheckCard.jsx`:** Observational volume pacing callout and movement mix distribution graph.
10. **`WeeklyReflectionModal.jsx`:** End-of-week reflection dialog capturing `"What went well?"`, `"What felt difficult?"`, and `"What do you want to improve next week?"`.

### B. Dashboard Integration (`client/src/pages/Dashboard.jsx`)
* Successfully structured following the Stage 20 architectural blueprint:
  1. Purpose Card (Stage 19)
  2. Daily Adaptive Recommendation (Stage 20)
  3. Realistic Availability & Life Load Selectors (Stage 20)
  4. Compassionate Re-entry Card (Stage 19)
  5. Adaptive Week Card & Rebalance Status (Stage 20)
  6. Today's Telemetry HUD (Stage 16)
  7. Active Mission / GoalBoard (Stage 13)
  8. Training Plan Architecture (Stage 20)
  9. Personal Baseline & Self-Comparison (Stage 20)
  10. Workload Check & Movement Balance (Stage 20)
  11. Journey Timeline & Growth Summary (Stage 19)
  12. Personal Records, Quests, Achievements, and Recent Activity (Stages 7–9)
  13. Analytics & Fitness Intelligence (Stages 10 & 12)
  14. Body Analysis & Biometric Energy Gauges (Stages 4–6)

---

## 7. VERIFICATION & FINAL COMPLIANCE

* **Architecture Integrity:** Full separation of concerns maintained across models, controllers, services, and components.
* **Storage Parity:** devStore provides 100% offline feature completeness with zero cloud dependencies.
* **Tone & Philosophy:** Empathetic, supportive, grounded, and purpose-driven. Missed days adjust the schedule without penalty; short workouts are celebrated as habit protectors; comparison is exclusively against oneself.

```text
STAGE 20 — PERSONAL TRAINING PLAN & ADAPTIVE LIFE SYSTEM
STATUS: COMPLETE
MONGODB ATLAS: NOT CONFIGURED
GIT: NOT COMMITTED
BUILD: VERIFIED
```
