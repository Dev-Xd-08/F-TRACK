import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import progressionRoutes from './routes/progressionRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import questRoutes from './routes/questRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware Pipeline
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[API ${req.method}] ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progression', progressionRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '⚡ Welcome to F-TRACK: FITNESS ASCENSION API',
    healthCheck: '/api/health',
    version: '1.0.0',
    status: 'ACTIVE',
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`
  ═══════════════════════════════════════════════════
  ⚡ F-TRACK: FITNESS ASCENSION — BACKEND ONLINE ⚡
  ═══════════════════════════════════════════════════
  📡 Server URL:   http://localhost:${PORT}
  ❤️  Health Check: http://localhost:${PORT}/api/health
  🎮 Environment:  ${process.env.NODE_ENV || 'development'}
  ═══════════════════════════════════════════════════
  `);
});
