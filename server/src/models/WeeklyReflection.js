import mongoose from 'mongoose';

const WeeklyReflectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weekStart: {
      type: Date,
      required: true,
      index: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    wentWell: {
      type: String,
      trim: true,
      maxlength: 600,
      default: '',
    },
    difficult: {
      type: String,
      trim: true,
      maxlength: 600,
      default: '',
    },
    nextFocus: {
      type: String,
      trim: true,
      maxlength: 600,
      default: '',
    },
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    targetSessions: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate weekly reflections per user per weekStart
WeeklyReflectionSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export default mongoose.models.WeeklyReflection || mongoose.model('WeeklyReflection', WeeklyReflectionSchema);
