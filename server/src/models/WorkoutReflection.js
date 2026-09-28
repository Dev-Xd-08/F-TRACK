import mongoose from 'mongoose';

/**
 * WorkoutReflection Schema (Stage 19)
 * Stores optional post-workout subjective context (perceived effort & reflections).
 */
const workoutReflectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      index: true,
    },
    effort: {
      type: String,
      required: [true, 'Please rate perceived session effort.'],
      enum: ['EASY', 'GOOD', 'HARD', 'VERY_HARD'],
      default: 'GOOD',
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Reflection note cannot exceed 500 characters.'],
    },
    activityType: {
      type: String,
      default: 'Workout',
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutReflection = mongoose.models.WorkoutReflection || mongoose.model('WorkoutReflection', workoutReflectionSchema);

export default WorkoutReflection;
