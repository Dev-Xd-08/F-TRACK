# ⚔️ F-TRACK: Stage 4 Completion Report — Workout Quest System

**Project:** F-TRACK: FITNESS ASCENSION (MERN Style Fitness Tracker)  
**Academic Module:** Workout Management  
**Stage:** 4 — Workout Quest System (CRUD, Activity Types, Duration, Calories, Stats HUD, History)

---

## 1. 📁 Files Created & Modified

### Backend (`server/`)
* **Created**:
  * [`server/src/models/Workout.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/models/Workout.js): Mongoose Workout model with user foreign key reference, `activityType` enum validation (Running, Walking, Cycling, Gym, Swimming, Yoga, HIIT, Sports, Other), duration (>0), caloriesBurned (>=0), workoutDate, notes, and compound index `({ user: 1, workoutDate: -1 })`.
  * [`server/src/utils/devStore.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/utils/devStore.js): Isolated, clean in-memory development fallback store that handles authentication and workout CRUD operations when MongoDB Atlas / local MongoDB is not yet running, without writing fake data to project files.
  * [`server/src/controllers/workoutController.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/controllers/workoutController.js): Implements `getWorkouts` (sorted newest first, user-scoped), `getWorkout` (ownership-guarded), `createWorkout`, `updateWorkout`, and `deleteWorkout`.
  * [`server/src/routes/workoutRoutes.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/routes/workoutRoutes.js): Declares protected REST endpoints mounted at `/api/workouts`.
* **Modified**:
  * [`server/src/server.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/server.js): Registered `/api/workouts` router with JWT protection pipeline.
  * [`server/src/middleware/authMiddleware.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/middleware/authMiddleware.js): Integrated resilient devStore lookup when MongoDB is offline during development.
  * [`server/src/controllers/authController.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/controllers/authController.js): Added transparent fallback handling for local dev registration/login.

### Frontend (`client/`)
* **Created**:
  * [`client/src/services/workoutService.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/services/workoutService.js): Client API service communicating with `/api/workouts` sending `Authorization: Bearer <token>`.
  * [`client/src/components/workouts/WorkoutHUD.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/workouts/WorkoutHUD.jsx): Real-time animated stats HUD displaying Total Workouts, Total Minutes, Calories Burned, and Active Streak in days.
  * [`client/src/components/workouts/WorkoutCard.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/workouts/WorkoutCard.jsx): Glassmorphic anime quest card with activity badges, icons, duration, calories, date, notes, and edit/delete actions.
  * [`client/src/components/workouts/WorkoutModal.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/workouts/WorkoutModal.jsx): Reusable modal for logging and updating quests with activity dropdown, duration, calories, calendar picker, and validation.
  * [`client/src/components/workouts/DeleteConfirmModal.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/workouts/DeleteConfirmModal.jsx): Cyber warning modal ("ABANDON QUEST?") confirming quest deletion.
  * [`client/src/pages/Workouts.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/Workouts.jsx): Complete workout quests screen with top HUD, quest grid, empty state, and action buttons.
* **Modified**:
  * [`client/src/App.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/App.jsx): Registered protected `/workouts` route.
  * [`client/src/components/Navbar.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/Navbar.jsx): Added "QUESTS" / "WORKOUT QUESTS" navigation link for authenticated users.
  * [`client/src/pages/Dashboard.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/Dashboard.jsx): Added primary "START WORKOUT QUEST" CTA button and real-time workout summary metrics (completed sessions, minutes trained, calories burned).

---

## 2. 🌐 REST API Endpoints (`/api/workouts`)

| Method | Endpoint | Access | Purpose | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/workouts` | Protected | Fetch authenticated user's workout quests (newest first) | `200`, `401`, `500` |
| `GET` | `/api/workouts/:id` | Protected | Fetch single workout quest by ID (ownership verified) | `200`, `401`, `404`, `500` |
| `POST` | `/api/workouts` | Protected | Record new training quest with duration & calories | `201`, `400`, `401`, `500` |
| `PUT` | `/api/workouts/:id` | Protected | Update existing quest (only by owner) | `200`, `400`, `401`, `404`, `500` |
| `DELETE` | `/api/workouts/:id` | Protected | Abandon/delete quest (only by owner) | `200`, `401`, `404`, `500` |

---

## 3. 📊 Workout Data Model Schema

```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  activityType: { 
    type: String, 
    required: true, 
    enum: ['Running', 'Walking', 'Cycling', 'Gym', 'Swimming', 'Yoga', 'HIIT', 'Sports', 'Other'] 
  },
  duration: { type: Number, required: true, min: 1 }, // in minutes
  caloriesBurned: { type: Number, required: true, min: 0 }, // in kcal
  workoutDate: { type: Date, required: true, default: Date.now },
  notes: { type: String, maxlength: 500, default: '' },
  timestamps: true // createdAt, updatedAt
}
```

---

## 4. 🗺️ Frontend Routes

* `/` $\to$ Anime Landing Page (Stage 2)
* `/login` $\to$ Training Chamber Login (Stage 3)
* `/register` $\to$ Hunter Awakening Registration (Stage 3)
* `/dashboard` $\to$ Protected Ascension Chamber with real-time quest summary (Stage 3 + 4)
* `/workouts` $\to$ Protected Workout Quest System (Stage 4)

---

## 5. 🛡️ Validation & Security Strategy

1. **Strict Ownership Scoping**:
   - `GET /api/workouts` filters exclusively by `user: req.user._id`.
   - `GET /api/workouts/:id`, `PUT /api/workouts/:id`, and `DELETE /api/workouts/:id` require both matching `_id` and `user: req.user._id`. A user can never view, mutate, or delete another user's quest.
2. **Server-Side Validation**:
   - `activityType` validated against enum whitelist.
   - `duration` must be numeric and $>0$.
   - `caloriesBurned` must be numeric and $\ge 0$.
   - `workoutDate` parsed and validated.
3. **Client-Side Validation**:
   - Immediate responsive feedback in `WorkoutModal` before sending HTTP payload.
4. **JWT Verification**:
   - All `/api/workouts` endpoints pass through `protect` middleware.

---

## 6. 💾 Temporary Development Storage Strategy

To honor the constraint that **MongoDB Atlas is postponed until final integration/testing**:
- When MongoDB is running (`mongoose.connection.readyState === 1`), Mongoose handles operations directly with MongoDB.
- When MongoDB is offline (`readyState !== 1`), `devStore.js` seamlessly acts as an isolated, in-memory store linked to `req.user._id`.
- Zero temporary or fake files are written to disk.
- When MongoDB Atlas is configured in later stages, no code refactor is needed; Mongoose naturally handles storage.

---

## 7. 🧪 Testing & Verification Performed

- [x] **Unauthenticated Access Protection**: Accessing `/api/workouts` without JWT Bearer returns HTTP `401 Unauthorized`.
- [x] **Route Guard**: Visiting `/workouts` in browser while unauthenticated redirects to `/login`.
- [x] **Add Workout Quest**: Successfully creates workout with activity type, duration, calories, date, and notes.
- [x] **Real-time HUD Calculations**: Workouts count, Total Minutes, and Calories Burned update immediately on addition/deletion.
- [x] **Streak Calculation**: Computed algorithm calculates consecutive active days from workout history.
- [x] **Edit Workout**: Populates modal with current quest values, transmits update, and refreshes the cards.
- [x] **Delete Confirmation**: "ABANDON QUEST?" modal confirms before deletion and adjusts totals.
- [x] **Empty State**: Displays anime prompt ("NO QUESTS COMPLETED") and "+ START FIRST QUEST" button when list is empty.
- [x] **Dashboard Integration**: Dashboard renders real-time stats and direct navigation to `/workouts`.
- [x] **Preservation of Existing Work**: Stages 1, 2, and 3 continue to function flawlessly.

---

## 8. ⚠️ Known Limitations

- BMI calculation, Calorie intake logging, and Goal thresholds belong to Stages 5, 6, and 7 and are not yet active in this stage.

---

**STAGE 4 COMPLETE — WORKOUT QUEST SYSTEM ONLINE.**
