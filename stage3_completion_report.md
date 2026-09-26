# ⚡ F-TRACK: Stage 3 Completion Report — Authentication System

**Project:** F-TRACK: FITNESS ASCENSION (MERN Style Fitness Tracker)  
**Stage:** 3 — User Registration, Login & JWT Authentication

---

## 1. 📁 Files Created & Modified

### Backend (`server/`)
* **Created**:
  * [`server/src/models/User.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/models/User.js): Mongoose user schema with automatic `bcryptjs` password hashing pre-save hook, timing-safe `matchPassword` method, email normalization, and JSON serialization protection.
  * [`server/src/utils/generateToken.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/utils/generateToken.js): Signs secure JWTs using `JWT_SECRET` from environment variables.
  * [`server/src/middleware/authMiddleware.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/middleware/authMiddleware.js): Intercepts `Authorization: Bearer <token>`, verifies JWT signature, and attaches authenticated user (excluding password) to `req.user`.
  * [`server/src/controllers/authController.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/controllers/authController.js): Implements `registerUser` (validations, duplicate email check with 409), `loginUser` (password verification, 401 handling), and `getMe` (safe user retrieval).
  * [`server/src/routes/authRoutes.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/routes/authRoutes.js): Declares `/api/auth/register`, `/api/auth/login`, and protected `/api/auth/me`.
* **Modified**:
  * [`server/src/server.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/server/src/server.js): Registered `/api/auth` router while preserving the `/api/health` system monitoring route.

### Frontend (`client/`)
* **Created**:
  * [`client/src/services/authService.js`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/services/authService.js): API communication layer for `registerUser`, `loginUser`, and `getCurrentUser`.
  * [`client/src/context/AuthContext.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/context/AuthContext.jsx): React Context providing `user`, `token`, `login`, `register`, `logout`, and auto-restore of sessions on page refresh via `localStorage`.
  * [`client/src/components/auth/ProtectedRoute.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/auth/ProtectedRoute.jsx): Route guard redirecting unauthenticated users from `/dashboard` to `/login` with an anime loading HUD.
  * [`client/src/pages/Login.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/Login.jsx): Anime-inspired login chamber with glassmorphism, email/password validation, eye password toggle, and error alert banners.
  * [`client/src/pages/Register.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/Register.jsx): Anime Hunter registration screen with callsign, crystal email, password confirmation, and client-side validation.
  * [`client/src/pages/Dashboard.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/Dashboard.jsx): Temporary "ASCENSION CHAMBER" placeholder displaying Hunter name, Rank E, Level 1, Energy, Streak, XP gauge, and logout action.
  * [`client/src/pages/LandingPage.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/pages/LandingPage.jsx): Encapsulated landing page components into a clean, dedicated page route.
* **Modified**:
  * [`client/package.json`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/package.json): Added `react-router-dom` for application routing.
  * [`client/src/App.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/App.jsx): Configured `Router`, `AuthProvider`, and routes (`/`, `/login`, `/register`, `/dashboard`).
  * [`client/src/components/Navbar.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/Navbar.jsx): Integrated authentication state—displays Login/Start Ascension when logged out, and Ascension Chamber/Logout when authenticated.
  * [`client/src/components/Hero.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/Hero.jsx), [`CTASection.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/CTASection.jsx), [`Footer.jsx`](file:///c:/Users/lenovo/OneDrive/Desktop/F-TRACK/client/src/components/Footer.jsx): Updated action buttons to navigate dynamically to `/register` or `/dashboard`.

---

## 2. 📦 Dependencies

* **Backend (`server/`)**:
  * `bcryptjs`: Secure cryptographic password hashing with 10 salt rounds.
  * `jsonwebtoken`: Signing and validating stateless bearer tokens.
  * `mongoose`: Object Document Mapper for MongoDB.
  * `dotenv`: Environment configuration (`JWT_SECRET`, `PORT`, `MONGO_URI`).
  * `cors`: Cross-Origin Resource Sharing.
  * `express`: REST API web framework.
* **Frontend (`client/`)**:
  * `react-router-dom`: SPA client routing and navigation guards.
  * `framer-motion`: High-performance animations and page transitions.
  * `lucide-react`: Modern icons.
  * `tailwindcss`: Cyberpunk / Anime Ascension Design System.

---

## 3. 🌐 API Endpoints

| Method | Endpoint | Access | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status, database state, uptime | `200` |
| `POST` | `/api/auth/register` | Public | Register new warrior, hash password, return safe user & token | `201`, `400`, `409`, `500` |
| `POST` | `/api/auth/login` | Public | Verify credentials, return safe user & token | `200`, `400`, `401`, `500` |
| `GET` | `/api/auth/me` | Protected | Extract identity from `Bearer <token>` and return profile | `200`, `401`, `500` |

---

## 4. 🔒 Authentication Flow & Security Measures

1. **Password Hashing**: Plaintext passwords are never stored in the database. `User.js` utilizes an automated `pre('save')` hook with `bcrypt.hash(password, 10)`.
2. **Timing-Safe Login Comparison**: Passwords are verified with `bcrypt.compare`.
3. **Ambiguity on Login Failure**: 401 returns generic `"Invalid email or password"` without revealing whether the email or password was the cause of failure.
4. **Duplicate Prevention**: Email normalization (`toLowerCase().trim()`) prevents case-sensitive duplicates; returns HTTP `409 Conflict`.
5. **No Password Leakage**:
   - `toJSON` transform on User model strips `password`.
   - Controllers explicitly select or construct safe response objects `{ id, name, email }`.
   - `authMiddleware` queries `User.findById(decoded.id).select('-password')`.
6. **Environment Variable Protection**: `JWT_SECRET` is drawn strictly from `process.env.JWT_SECRET`. Real `.env` files remain strictly excluded by `.gitignore`.

---

## 5. 🗺️ Frontend Routes

* `/` $\to$ Anime Landing Page (Hero, Features, How It Works, Rankings, CTA, Footer)
* `/login` $\to$ Anime Training Chamber Login
* `/register` $\to$ Anime Hunter Profile Registration
* `/dashboard` $\to$ Protected "Ascension Chamber" (Hunter License, Level 1, Rank E, Energy & XP gauges)
* `*` $\to$ Redirect to `/`

---

## 6. 🧪 Testing Performed

* [x] **Registration Validation**: Missing name, invalid email, short password (<6 chars), and mismatched passwords produce distinct, clean alerts.
* [x] **Duplicate Registration Handling**: Returning 409 when attempting to register an existing email.
* [x] **Login Credential Validation**: Correct rejection of bad passwords with HTTP 401.
* [x] **Protected Route Guarding**: Accessing `/dashboard` while unauthenticated immediately redirects to `/login`.
* [x] **Session Persistence**: Storing JWT in `localStorage` restores the user session and updates the Navbar automatically upon page refresh.
* [x] **Logout Flow**: Clears local storage token, resets user state, and redirects to `/login` or `/`.
* [x] **Preservation of Existing Assets**: Stage 1 backend architecture and Stage 2 anime landing page remain completely intact.

---

## 7. ⚠️ Known Limitations
* Advanced metrics (actual workout database logging, BMI computation, calorie intake/burn logging) are scheduled for Stage 4+ and remain placeholders on the Ascension Chamber dashboard as specified.

---

## 8. Summary

Stage 3 successfully completes the authentication layer for **F-TRACK: FITNESS ASCENSION**. Users can register, log in, view their protected Ascension Chamber profile, and log out with secure JWT authorization, while enjoying a cohesive cyberpunk anime UI.

STAGE 3 COMPLETE — AUTHENTICATION SYSTEM ONLINE.
