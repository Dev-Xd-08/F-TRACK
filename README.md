# ⚡ F-TRACK: FITNESS ASCENSION

> *"Your fitness journey is an anime. Every workout makes you stronger."*

An original anime-inspired, gamified fitness tracking web application built on the modern MERN stack. F-TRACK transforms workout logging into a futuristic hunter progression experience—complete with level ascension, rank advancements, real personal record matrix, daily and weekly quests, milestone achievements, data-driven analytics, contextual fitness intelligence, smart notifications, and personal mission planning.

---

## 🌌 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js (ES Modules), Mongoose, JSON Web Tokens (JWT), CORS
- **Database**: MongoDB (Local or Atlas) + Seamless in-memory `devStore` offline fallback
- **Monorepo Architecture**: Root orchestrator with `client/` and `server/`

---

## 🎨 Ascension Design System Tokens

- **Deep Void (Background)**: `#080B11`
- **Obsidian Slate (Card Surface)**: `#0F172A`
- **Neon Violet (Ascension Magic / Level)**: `#8B5CF6`
- **Cyber Cyan (Energy / Telemetry)**: `#00F5FF`
- **Aura Crimson (HP / Streaks / Alerts)**: `#FF2A5F`
- **Mythic Gold (Ranks & Achievements)**: `#FFB800`
- **Matrix Neon (Success / Completion)**: `#10B981`

---

## 🌟 Major Modules & Features

1. **Authentication & Session Security (Stages 1–3)**
   - Secure registration and login with bcrypt password hashing.
   - JWT-based authentication with auto-hydration on page reload.
   - Strict user data isolation across all endpoints.

2. **Workout Quest Management (Stage 4)**
   - Complete CRUD operations for workouts across 9 disciplines (Running, Walking, Cycling, Gym, Swimming, Yoga, HIIT, Sports, Other).
   - Real-time calculations of volume, duration, and caloric expenditure.
   - Safe validation for durations, positive calories, and ISO calendar dates.

3. **Body Analysis & Calorie Core (Stage 5)**
   - Standardized BMI calculator and biometric placement gauge.
   - Calorie Core Engine implementing the Mifflin-St Jeor equation for Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
   - Neutral, non-diagnostic guidance with transparent explanations.

4. **Ascension Progression Engine (Stage 6)**
   - Quadratic RPG progression curve: $\text{Level} = \lfloor\sqrt{\text{XP} / 100}\rfloor + 1$.
   - Hunter Rank Tiers: Rank E (Lvl 1–7), Rank D (Lvl 8–10), Rank C (Lvl 11–13), Rank B (Lvl 14–16), Rank A (Lvl 17–19), Rank S (Lvl 20+).
   - Consecutive-day streak engine with grace period tracking.
   - Strict rule: XP is awarded **only upon creation** of workouts. Edits and deletes never award XP.

5. **Personal Record Matrix (Stage 7)**
   - Automatically tracks lifetime personal bests: longest session, most calories burned, highest volume week, and longest active streak.
   - Dynamic record-breaking notifications and milestone history logging.

6. **Daily & Weekly Quest System (Stage 8)**
   - Dynamic daily quests (reset at 00:00 UTC) and weekly quests (reset Monday 00:00 UTC).
   - Evaluates empirical workout volume and duration against quest thresholds.
   - Awards bonus XP with deduplication protection.

7. **Achievement & Badge Matrix (Stage 9)**
   - 14 tiered hunter badges spanning milestones, consistency, endurance, and versatility.
   - Real-time unlock evaluation with persistent badge showcase.

8. **Progress Analytics & Telemetry (Stage 10)**
   - 7-day weekly activity bar charts with active day indicators.
   - 14-day comparison engine calculating percentage changes in volume and intensity.
   - 6-month historical monthly trend tracking.
   - Activity discipline breakdown with zero-baseline handling.

9. **Smart Reminder & Notification System (Stage 11)**
   - Interactive HUD notification bell with real-time unread count badge.
   - Flyout notification drawer with category filtering (All, Unread, Reminders, Rewards).
   - Automatic reminders for workout inactivity, streak preservation, and quest deadlines.
   - Idempotent deduplication keys preventing notification spam.

10. **Personal Fitness Intelligence & Smart Insights (Stage 12)**
    - 30-day consistency score index (0–100) with category rating.
    - Day-of-week pattern detection accurately identifying peak training days.
    - Discipline preference breakdown with automated tie detection.
    - Contextual, explainable insights with evidence source citations.
    - Up to 3 evidence-based actionable next focus suggestions.

11. **Mission Control / Personal Goals (Stage 13)**
    - User-defined goals across 6 categories: `WORKOUTS`, `MINUTES`, `CALORIES`, `STREAK`, `WEIGHT`, and `CUSTOM`.
    - Lifecycle states: `ACTIVE`, `COMPLETED`, `PAUSED`, and `EXPIRED`.
    - Real-time empirical progress gauges with automated completion notifications (0 additional XP).
    - Full telemetry archive for historical missions.

12. **Production Polish & UX Hardening (Stage 14)**
    - Cyberpunk 404 System Path Not Found page.
    - Standardized reusable error state component with retry action (`ErrorState.jsx`).
    - Standardized API error responses across all controllers.
    - Responsive layout optimizations across mobile (375px–430px), tablet (768px), and desktop.
    - Zero fake data guarantee across clean accounts.

---

## 📁 Project Structure

```text
F-TRACK/
├── client/                      # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── achievements/    # AchievementCard, AchievementShowcase
│   │   │   ├── analytics/       # AnalyticsDashboard, WeeklyChart, MonthlyTrend
│   │   │   ├── auth/            # ProtectedRoute
│   │   │   ├── goals/           # GoalBoard, GoalModal, GoalDetail, GoalHistory
│   │   │   ├── health/          # BMIScale
│   │   │   ├── intelligence/    # FitnessIntelligence, InsightCard, NextFocus
│   │   │   ├── notifications/   # NotificationBell, NotificationCenter
│   │   │   ├── progression/     # AscensionHUD, PRMatrix, RecentActivity
│   │   │   ├── quests/          # QuestBoard, QuestCard
│   │   │   ├── ui/              # AnimeButton, GlassCard, EnergyBar, ErrorState
│   │   │   └── workouts/        # WorkoutHUD, WorkoutCard, WorkoutModal, DeleteModal
│   │   ├── context/             # AuthContext (JWT management & session state)
│   │   ├── pages/               # LandingPage, Login, Register, Dashboard, Workouts, BodyAnalysis, NotFound
│   │   ├── services/            # API Clients (auth, workout, health, progression, record, quest, achievement, analytics, notification, intelligence, goal)
│   │   ├── App.jsx              # Router & Route declarations
│   │   ├── index.css            # Cyberpunk grid, custom glow drop-shadows, animations
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html               # Orbitron & Outfit font imports
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Backend (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection with retry & status logs
│   │   ├── controllers/         # Auth, Workout, Health, Progression, Record, Quest, Achievement, Analytics, Notification, Intelligence, Goal
│   │   ├── middleware/          # authMiddleware (JWT protect), errorMiddleware
│   │   ├── models/              # User, Workout, HealthProfile, Progression, FitnessGoal
│   │   ├── routes/              # Auth, Workout, Health, Progression, Record, Quest, Achievement, Analytics, Notification, Intelligence, Goal
│   │   ├── utils/               # DevStore, ProgressionEngine, RecordEngine, QuestEngine, AchievementEngine, AnalyticsEngine, NotificationEngine, FitnessIntelligenceEngine, GoalEngine, HealthCalculations
│   │   └── server.js            # Express application entrypoint
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                 # Monorepo root dev scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/ftrack`) or MongoDB Atlas URI (optional; devStore handles offline development seamlessly)

### 2. Installation
Install all dependencies for root, server, and client with one command:
```bash
npm run install:all
```
*(Or install manually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### 3. Environment Setup
Copy the example environment files:
- In `server/`: copy `.env.example` to `.env`
  ```bash
  PORT=5000
  NODE_ENV=development
  MONGO_URI=mongodb://localhost:27017/ftrack
  JWT_SECRET=super_secret_anime_ascension_key_change_in_prod
  JWT_EXPIRE=30d
  CLIENT_URL=http://localhost:5173
  ```
- In `client/`: copy `.env.example` to `.env`
  ```bash
  VITE_API_URL=http://localhost:5000/api
  ```

### 4. Running Locally
From the root directory:
```bash
# Start both Backend (port 5000) and Frontend (port 5173) simultaneously:
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database & Dual-Storage Architecture

F-TRACK features an architecture designed to work in any environment:
- **MongoDB Connected:** When MongoDB or MongoDB Atlas is available, models persist to MongoDB collections with compound indexes (`user: 1, workoutDate: -1`, `user: 1, status: 1`).
- **MongoDB Offline Fallback:** If MongoDB is unavailable during local development, F-TRACK automatically transitions to the in-memory `devStore`. The `devStore` implements full user isolation, duplicate checking, and CRUD operations across all 14 stages without crashing.
- **MongoDB Atlas Integration:** Can be configured during final deployment simply by updating the `MONGO_URI` environment variable in `server/.env`.

---

## 📡 API Overview

| Route | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register new warrior user |
| `/api/auth/login` | POST | Public | Authenticate user & issue JWT |
| `/api/auth/me` | GET | Private | Get authenticated user profile |
| `/api/workouts` | GET | Private | List all workouts for user |
| `/api/workouts` | POST | Private | Create workout & calculate progression |
| `/api/workouts/:id` | GET | Private | Get specific workout details |
| `/api/workouts/:id` | PUT | Private | Update workout details (zero XP re-award) |
| `/api/workouts/:id` | DELETE | Private | Delete workout record |
| `/api/health/profile` | GET | Private | Get latest BMI and calorie calculations |
| `/api/health/bmi` | POST | Private | Compute BMI & biometric scale placement |
| `/api/health/calories` | POST | Private | Compute BMR & TDEE maintenance calories |
| `/api/progression` | GET | Private | Retrieve Ascension level, rank, streak, & XP |
| `/api/records` | GET | Private | Retrieve Personal Record Matrix bests |
| `/api/quests` | GET | Private | Retrieve active daily and weekly quests |
| `/api/quests/history` | GET | Private | Retrieve quest completion history |
| `/api/achievements` | GET | Private | Retrieve achievement matrix & badge unlocks |
| `/api/analytics` | GET | Private | Retrieve weekly, monthly, & discipline analytics |
| `/api/notifications` | GET | Private | Retrieve in-app notifications |
| `/api/notifications/unread-count` | GET | Private | Retrieve count of unread notifications |
| `/api/notifications/:id/read` | PUT | Private | Mark specific notification as read |
| `/api/notifications/read-all` | PUT | Private | Mark all notifications as read |
| `/api/intelligence` | GET | Private | Retrieve consistency, patterns, & smart insights |
| `/api/goals` | GET | Private | Retrieve personal missions & telemetry progress |
| `/api/goals` | POST | Private | Create new personal fitness goal |
| `/api/goals/:id` | GET | Private | Get single mission telemetry details |
| `/api/goals/:id` | PUT | Private | Update mission configuration |
| `/api/goals/:id` | DELETE | Private | Delete mission from hunter record |
| `/api/goals/:id/refresh` | POST | Private | Force-refresh goal progress with telemetry |
| `/api/goals/:id/progress` | POST | Private | Update manual progress for CUSTOM mission |

---

## 🛡️ Security & Data Integrity

- **Password Hashing:** Passwords hashed with bcrypt prior to storage; passwords never returned in API responses (`select('-password')`).
- **User Scoping:** All database operations strictly filter by authenticated `req.user._id`. Users cannot view, modify, or delete another user's data.
- **Zero Fake Data:** For new users, all telemetry starts cleanly at zero. No hardcoded or placeholder statistics are displayed.
- **Medical Disclaimer:** Health and calorie recommendations include neutral, evidence-based descriptions with non-diagnostic disclaimers.

---

## 🔮 Future Improvements

- Social Guilds / Co-op Quests: Train with other hunters in group fitness raids.
- Wearable Telemetry Sync: Direct integration with HealthKit, Google Fit, and Garmin.
- Audio Voice Packs: System notification voice alerts for level-ups and record breaks.
