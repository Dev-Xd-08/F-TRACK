# ⚔️ F-TRACK: Stage 5 Completion Report — BMI & Calorie Core

**Project:** F-TRACK: FITNESS ASCENSION (MERN Style Fitness Tracker)  
**Academic Modules:** Body Analysis (BMI) + Calorie Core (BMR & TDEE)  
**Stage:** 5 — Body Analysis & Calorie Core Engine

---

## 1. 📁 Files Created & Modified

### Backend (`server/`)
* **Created**:
  * [`server/src/utils/healthCalculations.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/utils/healthCalculations.js): Isolated, clean calculation utility implementing standard adult BMI categorization and the peer-reviewed Mifflin-St Jeor equation for BMR and TDEE maintenance calories.
  * [`server/src/models/HealthProfile.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/models/HealthProfile.js): Mongoose model schema for persisting user's latest biometric scan and metabolic telemetry.
  * [`server/src/controllers/healthController.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/controllers/healthController.js): Implements `getHealthProfile` (retrieves latest user metrics), `postBMI` (validates and calculates BMI), and `postCalories` (validates and calculates BMR/TDEE).
* **Modified**:
  * [`server/src/routes/healthRoutes.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/routes/healthRoutes.js): Expanded with protected endpoints (`/profile`, `/bmi`, `/calories`) while fully preserving public `GET /api/health` system status.
  * [`server/src/utils/devStore.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/utils/devStore.js): Added in-memory fallback health profile storage (`devHealthProfiles`, `saveDevBMI`, `saveDevCalories`) for development sessions when MongoDB Atlas is offline.

### Frontend (`client/`)
* **Created**:
  * [`client/src/services/healthService.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/services/healthService.js): Client API service communicating with `/api/health/bmi`, `/api/health/calories`, and `/api/health/profile` sending `Authorization: Bearer <token>`.
  * [`client/src/components/health/BMIScale.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/health/BMIScale.jsx): Dynamic visual gauge rendering the 4 adult BMI categories with Framer Motion animated marker positioning and range legend.
  * [`client/src/pages/BodyAnalysis.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/BodyAnalysis.jsx): Complete Body Analysis & Calorie Core page featuring Section A (BMI Core scanner & scale) and Section B (Calorie Core BMR/TDEE engine with metric sync).
* **Modified**:
  * [`client/src/App.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/App.jsx): Added protected `/body-analysis` route guarded by `ProtectedRoute`.
  * [`client/src/components/Navbar.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/Navbar.jsx): Added "BODY ANALYSIS" navigation link for authenticated users on both desktop and mobile menus.
  * [`client/src/pages/Dashboard.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/Dashboard.jsx): Integrated "BODY ANALYSIS & METABOLIC MATRIX" card displaying latest BMI, BMR, and TDEE with direct CTA to `/body-analysis`.

---

## 2. 🌐 Backend Endpoints (`/api/health`)

| Method | Endpoint | Access | Purpose | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime & MongoDB connection health check (Preserved) | `200` |
| `GET` | `/api/health/profile` | Protected | Fetch user's latest recorded BMI and Calorie Core telemetry | `200`, `401`, `500` |
| `POST` | `/api/health/bmi` | Protected | Validate inputs, calculate BMI & category, update user profile | `200`, `400`, `401`, `500` |
| `POST` | `/api/health/calories` | Protected | Validate inputs, calculate Mifflin-St Jeor BMR & TDEE, update profile | `200`, `400`, `401`, `500` |

---

## 3. 📐 Formulas & Scientific Methodology

### A. Body Mass Index (BMI)
$$\text{BMI} = \frac{\text{weightKg}}{(\text{heightMeters})^2} \quad \text{where } \text{heightMeters} = \frac{\text{heightCm}}{100}$$

#### Adult Classifications (WHO Standards):
* **Underweight**: $\text{BMI} < 18.5$
* **Normal**: $18.5 \le \text{BMI} \le 24.9$
* **Overweight**: $25.0 \le \text{BMI} \le 29.9$
* **Obesity**: $\text{BMI} \ge 30.0$

*Rounded to 1 decimal place. Accompanied by descriptive, fitness-focused explanations and explicit non-diagnostic disclaimers.*

### B. Calorie Core: Mifflin-St Jeor Equation
$$\text{BMR}_{\text{male}} = 10 \times \text{weightKg} + 6.25 \times \text{heightCm} - 5 \times \text{age} + 5$$
$$\text{BMR}_{\text{female}} = 10 \times \text{weightKg} + 6.25 \times \text{heightCm} - 5 \times \text{age} - 161$$

#### Activity Multipliers (TDEE):
* **Sedentary**: $1.2$
* **Lightly Active**: $1.375$
* **Moderately Active**: $1.55$
* **Very Active**: $1.725$
* **Extra Active**: $1.9$

$$\text{TDEE (Estimated Maintenance)} = \text{BMR} \times \text{Activity Multiplier}$$

*Rounded to nearest whole number. Clearly labeled as an estimate.*

---

## 4. 🗺️ Frontend Routes

* `/` $\to$ Anime Landing Page (Stage 2)
* `/login` $\to$ Training Chamber Login (Stage 3)
* `/register` $\to$ Hunter Awakening Registration (Stage 3)
* `/dashboard` $\to$ Protected Ascension Chamber with real-time workouts & body analysis cards (Stages 3, 4, 5)
* `/workouts` $\to$ Protected Workout Quests System (Stage 4)
* `/body-analysis` $\to$ Protected Body Analysis & Calorie Core System (Stage 5)

---

## 5. 🛡️ Validation & Input Boundaries

* **BMI Inputs**:
  * Height: $30\text{ cm} \le \text{heightCm} \le 300\text{ cm}$
  * Weight: $10\text{ kg} \le \text{weightKg} \le 500\text{ kg}$
  * Rejects empty, NaN, and negative values.
* **Calorie Inputs**:
  * Age: $1 \le \text{age} \le 120$
  * Biological Sex: `'male'` or `'female'`
  * Height & Weight bounded as above.
  * Activity Level verified against enum whitelist.

---

## 6. 💾 MongoDB Fallback Behavior

* When MongoDB is connected (`readyState === 1`), calculations are saved via Mongoose into `HealthProfile` collection.
* When MongoDB is offline (`readyState !== 1`), `devStore.js` seamlessly maintains health telemetry per user ID in-memory.
* Zero persistent mock files are written to disk.
* Fully prepared for production MongoDB Atlas connectivity in final stages.

---

## 7. 🧪 Testing & Verification Performed

* **Test Case 1 (BMI Verification)**:
  * Input: Height 175 cm, Weight 70 kg
  * Result: $\text{BMI} = 22.9$, Category: `Normal` (Verified)
* **Test Case 2 (Calorie Core Male Verification)**:
  * Input: Age 21, Sex Male, Height 175 cm, Weight 70 kg, Moderately Active ($1.55\times$)
  * Result: $\text{BMR} = 1694\text{ kcal/day}$, $\text{TDEE} = 2625\text{ kcal/day}$ (Verified)
* **Test Case 3 (Calorie Core Female Verification)**:
  * Input: Age 25, Sex Female, Height 165 cm, Weight 60 kg, Lightly Active ($1.375\times$)
  * Result: $\text{BMR} = 1345\text{ kcal/day}$, $\text{TDEE} = 1850\text{ kcal/day}$ (Verified)
* **Input Validation**: Empty strings, negative values, and extreme out-of-range numbers trigger explicit anime alert banners.
* **Route Protection**: Accessing `/body-analysis` while logged out redirects automatically to `/login`.
* **Dashboard Integration**: Latest BMI and Calorie Core scores sync dynamically to `/dashboard`.
* **Stages 1–4 Integrity**: Verified that Landing page, JWT auth, Workout Quests CRUD, and existing HUD components are 100% operational and undisturbed.

---

**STAGE 5 COMPLETE — BMI & CALORIE CORE ONLINE**
