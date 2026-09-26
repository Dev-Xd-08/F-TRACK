import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    API Health Check & System Status
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'Disconnected',
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

export default router;
