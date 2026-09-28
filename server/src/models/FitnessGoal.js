import mongoose from 'mongoose';

/**
 * ⚔️ F-TRACK: Fitness Goal / Mission Model (Stage 13)
 * 
 * Represents a personal fitness target or quest mission for an authenticated warrior.
 * Tracks progress dynamically from empirical activity and health telemetry.
 */
const fitnessGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: ['WEIGHT', 'WORKOUTS', 'MINUTES', 'CALORIES', 'STREAK', 'CUSTOM'],
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
      min: 0.1,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    initialValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '',
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'EXPIRED'],
      default: 'ACTIVE',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user and status queries
fitnessGoalSchema.index({ user: 1, status: 1 });

const FitnessGoal = mongoose.model('FitnessGoal', fitnessGoalSchema);

export default FitnessGoal;
