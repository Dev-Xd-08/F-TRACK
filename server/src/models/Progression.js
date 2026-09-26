import mongoose from 'mongoose';

const progressionEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'WORKOUT_COMPLETED',
        'LEVEL_UP',
        'RANK_UP',
        'STREAK_UPDATED',
        'NEW_RECORD_LONGEST_WORKOUT',
        'NEW_RECORD_HIGHEST_CALORIES',
        'NEW_RECORD_MOST_ACTIVE_WEEK',
        'QUEST_COMPLETED',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    xpGained: {
      type: Number,
      default: 0,
    },
    newLevel: {
      type: Number,
    },
    newRank: {
      type: String,
    },
    streak: {
      type: Number,
    },
    recordValue: {
      type: Number,
    },
    recordUnit: {
      type: String,
    },
    workoutId: {
      type: String,
    },
    questId: {
      type: String,
    },
    periodType: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const progressionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    rank: {
      type: String,
      default: 'E',
      enum: ['E', 'D', 'C', 'B', 'A', 'S'],
    },
    rankTitle: {
      type: String,
      default: 'AWAKENING',
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastWorkoutDate: {
      type: Date,
      default: null,
    },
    totalWorkouts: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDurationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCaloriesBurned: {
      type: Number,
      default: 0,
      min: 0,
    },
    events: {
      type: [progressionEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Progression = mongoose.model('Progression', progressionSchema);

export default Progression;
