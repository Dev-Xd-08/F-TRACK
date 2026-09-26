# ⚡ F-TRACK: FITNESS ASCENSION

> *"Your fitness journey is an anime. Every workout makes you stronger."*

An original anime-inspired, gamified fitness tracking web application built on the modern MERN stack.

---

## 🌌 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), CORS
- **Database**: MongoDB (Local or Atlas)
- **Monorepo Architecture**: Root orchestrator with `client/` and `server/`

---

## 🎨 Ascension Design System Tokens

- **Deep Void (Background)**: `#080B11`
- **Obsidian Slate (Card Surface)**: `#0F172A`
- **Neon Violet (Ascension Magic / Level)**: `#8B5CF6`
- **Cyber Cyan (Energy / Timers)**: `#00F5FF`
- **Aura Crimson (HP / Streaks)**: `#FF2A5F`
- **Mythic Gold (Ranks & Achievements)**: `#FFB800`

---

## 📁 Project Structure

```text
F-TRACK/
├── client/                      # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/ui/       # Anime design system atomic components
│   │   ├── App.jsx              # Design system & status verification HUD
│   │   ├── index.css            # Custom anime glow, glassmorphism, animations
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html               # Custom fonts (Orbitron + Outfit)
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js       # Custom theme color tokens & glow drop-shadows
│   └── vite.config.js
│
├── server/                      # Backend (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection with retry & status logs
│   │   ├── middleware/
│   │   │   └── errorMiddleware.js # Standardized error handling
│   │   ├── routes/
│   │   │   └── healthRoutes.js  # GET /api/health
│   │   └── server.js            # Express server entrypoint
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
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/ftrack`) or MongoDB Atlas URI

### 2. Installation
Install all dependencies for root, server, and client with one command:
```bash
npm run install:all
```
*(Or install manually in each folder: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### 3. Environment Setup
Copy the example environment files:
- In `server/`: copy `.env.example` to `.env`
  ```bash
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/ftrack
  JWT_SECRET=super_secret_anime_ascension_key_change_in_prod
  CLIENT_URL=http://localhost:5173
  ```
- In `client/`: copy `.env.example` to `.env`
  ```bash
  VITE_API_URL=http://localhost:5000/api
  ```

### 4. Running the Servers
From the root directory:
```bash
# Start both Backend (port 5000) and Frontend (port 5173) simultaneously:
npm run dev
```

Or run individually:
- **Backend only**: `npm run server` (runs at [http://localhost:5000](http://localhost:5000))
  - Health check endpoint: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Frontend only**: `npm run client` (runs at [http://localhost:5173](http://localhost:5173))
