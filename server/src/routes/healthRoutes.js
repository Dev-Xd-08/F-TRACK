import express from 'express';
import mongoose from 'mongoose';
import {
  getHealthProfile,
  postBMI,
  postCalories,
} from '../controllers/healthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    System Health Check & Status (Preserved from Stage 1)
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'Disconnected (Using devStore fallback)',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    status: 'ONLINE',
    project: 'F-TRACK: FITNESS ASCENSION',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: statusMap[dbStatus] || 'Unknown',
      readyState: dbStatus,
    },
    system: {
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

/**
 * @route   GET /api/health/profile
 * @desc    Get user's latest BMI and Calorie calculations
 * @access  Private
 */
router.get('/profile', protect, getHealthProfile);

/**
 * @route   POST /api/health/bmi
 * @desc    Calculate Body Mass Index (BMI)
 * @access  Private
 */
router.post('/bmi', protect, postBMI);

/**
 * @route   POST /api/health/calories
 * @desc    Calculate Mifflin-St Jeor BMR and Maintenance Calories (TDEE)
 * @access  Private
 */
router.post('/calories', protect, postCalories);

export default router;
